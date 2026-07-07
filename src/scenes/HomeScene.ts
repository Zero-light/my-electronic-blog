/**
 * HomeScene — 宠物主界面（液态玻璃 + 鼠标视差 + 宠物互动）
 * BootScene, HomeScene, WardrobeScene all in one file.
 */
import * as Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, COLORS, GLASS,
  PET_DEFINITIONS, type PetType,
  MAX_HUNGER, MIN_HUNGER_FOR_HAPPY, MIN_HUNGER_FOR_NORMAL, MIN_HUNGER_FOR_LOW,
} from '../config';
import { SAVE } from '../data/SaveManager';
import { AudioEngine } from '../fx/Audio';
import { lighten, darken } from '../utils/Helpers';
import { drawGlassPanel } from '../ui/GlassPanel';
import { createGlassButton } from '../ui/GlassButton';
import { GradientBg } from '../ui/GradientBg';
import { DailyTaskPanel, getDailyTasks } from '../ui/DailyTaskPanel';
import { ShopDrawer } from '../ui/ShopDrawer';

// ─── Boot Scene ────────────────────────────────────────────
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() { this.scene.start('Home'); }
}

// ─── Home Scene ────────────────────────────────────────────
export class HomeScene extends Phaser.Scene {
  private petType: PetType = 'cloudy';
  private foodCount = 10;
  private petHunger = 70;
  private petXP = 0;
  private petLevel: 'baby' | 'adult' | 'full' = 'baby';
  private petGfx!: Phaser.GameObjects.Graphics;
  private petHighlight!: Phaser.GameObjects.Graphics;
  private gradientBg!: GradientBg;
  private petContainer!: Phaser.GameObjects.Container;
  private hungerBarGfx!: Phaser.GameObjects.Graphics;
  private xpBarGfx!: Phaser.GameObjects.Graphics;
  private moodBubble!: Phaser.GameObjects.Container;
  private isPetHovered = false;
  private dailyPanel!: DailyTaskPanel;
  private shopDrawer!: ShopDrawer;
  private offlinePopup!: Phaser.GameObjects.Container | null;

  constructor() { super('Home'); }

  create() {
    const save = SAVE.load();
    SAVE.applyHungerDecay(save);
    this.petType = (save.currentPet as PetType) || 'cloudy';
    this.foodCount = save.foodCount;
    this.petHunger = save.pet.hunger;
    this.petXP = save.pet.xp;
    this.petLevel = save.pet.level;

    AudioEngine.init();

    // Gradient flowing background
    this.gradientBg = new GradientBg(this);

    // Glass ground shadow
    this.drawGround();

    // Pet container (with highlight layer)
    this.petContainer = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
    this.petHighlight = this.add.graphics();
    this.petContainer.add(this.petHighlight);
    this.petGfx = this.add.graphics();
    this.petContainer.add(this.petGfx);
    this.drawPet();

    // Mouse parallax on pet
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const dx = ((p.x - GAME_WIDTH / 2) / GAME_WIDTH) * 14;
      const dy = ((p.y - (GAME_HEIGHT / 2 - 50)) / GAME_HEIGHT) * 10;
      this.tweens.killTweensOf(this.petContainer);
      this.petContainer.setPosition(GAME_WIDTH / 2 + dx, GAME_HEIGHT / 2 - 50 + dy);
      this.drawPetHighlight(dx, dy);
    });

    // Pet click → mood bubble
    const petHit = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 180, 180, 0x000000, 0)
      .setInteractive({ useHandCursor: true });
    petHit.on('pointerdown', () => {
      AudioEngine.heart();
      this.showMoodBubble();
      this.tweens.add({
        targets: this.petContainer,
        scaleX: 1.08, scaleY: 0.92,
        duration: 120, yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.tweens.add({
            targets: this.petContainer,
            scaleX: 1, scaleY: 1,
            duration: 200, ease: 'Back.easeOut',
          });
        },
      });
    });
    petHit.on('pointerover', () => {
      this.isPetHovered = true;
      this.tweens.add({ targets: this.petContainer, scaleX: 1.04, scaleY: 1.04, duration: 300, ease: 'Sine.easeOut' });
    });
    petHit.on('pointerout', () => {
      this.isPetHovered = false;
      this.tweens.add({ targets: this.petContainer, scaleX: 1, scaleY: 1, duration: 300, ease: 'Sine.easeOut' });
    });

    // Day counter — glass chip
    const dayChip = this.add.graphics();
    drawGlassPanel(dayChip, { x: GAME_WIDTH / 2 - 40, y: 16, width: 80, height: 36, radius: 18 });
    this.add.text(GAME_WIDTH / 2, 34, `Day ${save.dailyStreak || 1}`, {
      fontFamily: 'Inter, "PingFang SC", sans-serif',
      fontSize: '14px', color: COLORS.textMain, fontStyle: '600',
    }).setOrigin(0.5);

    this.drawFoodHUD();
    this.drawXPBar();
    this.drawHungerBar();
    this.drawButtons();

    // Daily tasks panel
    SAVE.refreshDaily(save);
    const tasks = getDailyTasks(save);
    this.dailyPanel = new DailyTaskPanel(this, GAME_WIDTH / 2, 100);
    this.dailyPanel.create(tasks, () => {
      AudioEngine.evolve();
      const bonus = this.add.text(GAME_WIDTH / 2, 140, '🎉 全部完成! +8 🍎', {
        fontSize: '16px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '700',
        backgroundColor: 'rgba(126,203,154,0.35)', padding: { left: 16, right: 16, top: 8, bottom: 8 },
      }).setOrigin(0.5).setDepth(60);
      SAVE.addFood(SAVE.load(), 8);
      this.foodCount = SAVE.load().foodCount;
      this.drawFoodHUD();
      this.tweens.add({ targets: bonus, alpha: 0, y: 170, duration: 2000, onComplete: () => bonus.destroy() });
    });

    // Shop drawer
    this.shopDrawer = new ShopDrawer(this);

    // Offline rewards
    this.checkOfflineRewards(save);

    // Hunger decay timer
    this.time.addEvent({
      delay: 60000, loop: true,
      callback: () => {
        const s = SAVE.load();
        SAVE.applyHungerDecay(s);
        this.petHunger = s.pet.hunger;
        this.drawHungerBar();
        this.drawPet();
      },
    });
  }

  // ── Ground Shadow ─────────────────────────────────────
  private drawGround() {
    const g = this.add.graphics().setDepth(-1);
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT - 130;
    // 3-layer soft shadow
    g.fillStyle(COLORS.primary, 0.08);
    g.fillEllipse(cx, cy, 300, 45);
    g.fillStyle(COLORS.primary, 0.05);
    g.fillEllipse(cx, cy, 220, 35);
    g.fillStyle(COLORS.secondary, 0.06);
    g.fillEllipse(cx + 20, cy - 5, 180, 30);
  }

  // ── Pet Rendering ─────────────────────────────────────
  private drawPet() {
    const def = PET_DEFINITIONS[this.petType];
    const g = this.petGfx;
    g.clear();

    const moodAlpha = this.petHunger < MIN_HUNGER_FOR_LOW ? 0.45
      : this.petHunger < MIN_HUNGER_FOR_NORMAL ? 0.75 : 1;

    // Outer glow (ambient)
    g.fillStyle(def.primaryColor, 0.1 * moodAlpha);
    g.fillCircle(0, 10, 80);

    // Body shadow
    g.fillStyle(darken(def.primaryColor, 30), 0.2 * moodAlpha);
    g.fillEllipse(0, 38, 130, 28);

    // Main body — layered for depth
    g.fillStyle(darken(def.primaryColor, 15), moodAlpha);
    g.fillEllipse(0, 5, 145, 125);
    g.fillStyle(def.primaryColor, moodAlpha);
    g.fillEllipse(0, 0, 140, 120);
    // Top highlight (diffuse reflection — glass look)
    g.fillStyle(lighten(def.primaryColor, 30), 0.4 * moodAlpha);
    g.fillEllipse(0, -22, 90, 42);
    g.fillStyle(COLORS.white, 0.2 * moodAlpha);
    g.fillEllipse(-15, -30, 35, 18);

    // Features per pet type
    g.fillStyle(def.secondaryColor, moodAlpha);
    if (this.petType === 'cloudy') {
      g.fillEllipse(-48, -42, 42, 38);
      g.fillEllipse(48, -42, 42, 38);
      g.fillEllipse(0, -56, 32, 32);
    } else if (this.petType === 'pepper') {
      g.fillTriangle(-55, -30, -28, -80, -10, -25);
      g.fillTriangle(55, -30, 28, -80, 10, -25);
    } else if (this.petType === 'berry') {
      g.fillEllipse(-48, -42, 32, 32);
      g.fillEllipse(48, -42, 32, 32);
      g.fillStyle(0x54B86F, 1);
      g.fillEllipse(0, -65, 10, 16);
      g.fillStyle(0x6CCB7F, 1);
      g.fillTriangle(-8, -65, 0, -82, 8, -65);
    } else if (this.petType === 'mochi') {
      g.fillEllipse(-42, -38, 28, 28);
      g.fillEllipse(42, -38, 28, 28);
    } else if (this.petType === 'tangerine') {
      g.fillStyle(0x54B86F, 1);
      g.fillEllipse(0, -68, 14, 7);
      g.fillStyle(0x6CCB7F, 1);
      g.fillEllipse(-4, -74, 12, 6);
      g.fillEllipse(4, -74, 12, 6);
    }

    // Eyes
    const eyeY = -8;
    if (this.petHunger < MIN_HUNGER_FOR_LOW) {
      g.lineStyle(2.5, COLORS.textDark, 0.7);
      g.beginPath(); g.moveTo(-30, eyeY); g.lineTo(-18, eyeY); g.strokePath();
      g.beginPath(); g.moveTo(18, eyeY); g.lineTo(30, eyeY); g.strokePath();
    } else {
      g.fillStyle(COLORS.textDark, moodAlpha);
      g.fillEllipse(-25, eyeY, 13, 15);
      g.fillEllipse(25, eyeY, 13, 15);
      g.fillStyle(COLORS.white, moodAlpha);
      g.fillEllipse(-22, eyeY - 3, 5, 5);
      g.fillEllipse(28, eyeY - 3, 5, 5);
    }

    // Blush
    if (this.petHunger > MIN_HUNGER_FOR_LOW) {
      g.fillStyle(0xFFB5C5, 0.45 * moodAlpha);
      g.fillEllipse(-40, 10, 15, 9);
      g.fillEllipse(40, 10, 15, 9);
    }

    // Mouth
    g.lineStyle(2.5, COLORS.textDark, 0.7);
    if (this.petHunger >= MIN_HUNGER_FOR_HAPPY) {
      g.beginPath();
      g.arc(0, 3, 9, Phaser.Math.DegToRad(25), Phaser.Math.DegToRad(155));
      g.strokePath();
    } else if (this.petHunger >= MIN_HUNGER_FOR_NORMAL) {
      g.beginPath(); g.moveTo(-9, 5); g.lineTo(9, 5); g.strokePath();
    } else {
      g.beginPath();
      g.arc(0, 14, 7, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340));
      g.strokePath();
    }

    // Mood drops when very hungry
    if (this.petHunger < MIN_HUNGER_FOR_LOW) {
      g.fillStyle(0xFF8C69, 0.6);
      g.fillEllipse(-20, -52, 9, 9);
      g.fillEllipse(22, -48, 7, 7);
    }

    // Entrance animation
    this.petContainer.setScale(0.4);
    this.tweens.add({
      targets: this.petContainer, scale: 1,
      duration: 600, ease: 'Back.easeOut',
    });
    // Idle float
    this.tweens.add({
      targets: this.petContainer, y: this.petContainer.y + 8,
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      delay: 600,
    });
  }

  private drawPetHighlight(dx: number, dy: number) {
    const hl = this.petHighlight;
    hl.clear();
    hl.fillStyle(COLORS.white, 0.15);
    hl.fillCircle(-15 - dx * 2, -25 - dy * 2, 25);
  }

  // ── Mood Bubble ───────────────────────────────────────
  private showMoodBubble() {
    if (this.moodBubble) this.moodBubble.destroy();
    const bubble = this.add.container(GAME_WIDTH / 2 + 80, GAME_HEIGHT / 2 - 140);
    bubble.setDepth(20);
    this.moodBubble = bubble;

    const moodMsg = this.petHunger >= MIN_HUNGER_FOR_HAPPY ? '♡ 好开心~'
      : this.petHunger >= MIN_HUNGER_FOR_NORMAL ? '平静'
      : this.petHunger >= MIN_HUNGER_FOR_LOW ? '好饿...'
      : 'zzz...';

    const bg = this.add.graphics();
    drawGlassPanel(bg, { x: -50, y: -18, width: 100, height: 32, radius: 16 });
    bubble.add(bg);

    const txt = this.add.text(0, -2, moodMsg, {
      fontFamily: 'Inter, "PingFang SC", sans-serif',
      fontSize: '13px', color: COLORS.textMain, fontStyle: '500',
    }).setOrigin(0.5);
    bubble.add(txt);

    bubble.setAlpha(0).setScale(0.5);
    this.tweens.add({
      targets: bubble, alpha: 1, scale: 1, duration: 250, ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: bubble, alpha: 0, y: bubble.y - 30,
          duration: 1200, delay: 800,
          onComplete: () => bubble.destroy(),
        });
      },
    });
  }

  // ── Food HUD — glass chip ─────────────────────────────
  private drawFoodHUD() {
    const bg = this.add.graphics();
    drawGlassPanel(bg, { x: 18, y: 18, width: 100, height: 42, radius: 21 });
    this.add.text(34, 38, '🍎', { fontSize: '20px' }).setOrigin(0, 0.5).setDepth(2);
    this.add.text(58, 39, `${this.foodCount}`, {
      fontFamily: 'Inter, sans-serif', fontSize: '16px', color: COLORS.textMain, fontStyle: '600',
    }).setOrigin(0, 0.5).setDepth(2);
  }

  // ── XP Bar — glass with shimmer ───────────────────────
  private drawXPBar() {
    const save = SAVE.load();
    this.petXP = save.pet.xp;
    this.petLevel = save.pet.level;

    const totalXP = this.petXP;
    const requiredXP = this.petLevel === 'baby' ? 100 : (this.petLevel === 'adult' ? 300 : 500);
    const prevXP = this.petLevel === 'baby' ? 0 : (this.petLevel === 'adult' ? 100 : 300);
    const progress = Math.min(1, (totalXP - prevXP) / (requiredXP - prevXP));

    const x = GAME_WIDTH - 166;
    const y = 18;
    const w = 148;
    const h = 18;

    if (this.xpBarGfx) this.xpBarGfx.destroy();
    const g = this.add.graphics();
    this.xpBarGfx = g;

    // Glass bg
    drawGlassPanel(g, { x, y, width: w, height: h, radius: 9 });

    // Fill
    if (progress > 0) {
      // Gradient fill effect via two overlapping rects
      g.fillStyle(COLORS.accent, 0.6);
      g.fillRoundedRect(x + 2, y + 2, (w - 4) * progress, h - 4, 7);
      g.fillStyle(COLORS.white, 0.3);
      g.fillRoundedRect(x + 2, y + 2, (w - 4) * progress, (h - 4) * 0.45, { tl: 7, tr: 7, bl: 2, br: 2 });
    }

    // Shimmer animation
    if (progress > 0.15) {
      const shimmer = this.add.graphics().setDepth(3);
      shimmer.fillStyle(COLORS.white, 0.5);
      const shimmerX = x + 2 + (w - 4) * progress - 30;
      shimmer.fillRoundedRect(shimmerX, y + 2, 18, h - 4, 6);
      this.tweens.add({
        targets: shimmer,
        x: { from: x + 2, to: x - 2 + (w - 4) * progress },
        duration: 2000, repeat: -1, yoyo: true,
        onUpdate: () => {
          shimmer.clear();
          shimmer.fillStyle(COLORS.white, 0.4);
          shimmer.fillRoundedRect(shimmer.x, y + 2, 16, h - 4, 6);
        },
      });
    }

    const lvNum = this.petLevel === 'baby' ? 1 : (this.petLevel === 'adult' ? 2 : 3);
    this.add.text(x + w / 2, y + h + 6, `LV ${lvNum}`, {
      fontFamily: 'Inter, sans-serif', fontSize: '11px', color: COLORS.textSecondary, fontStyle: '500',
    }).setOrigin(0.5);
  }

  // ── Hunger Bar — breathing glow ───────────────────────
  private drawHungerBar() {
    const progress = Math.max(0, this.petHunger / MAX_HUNGER);
    const barW = 240;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT - 200;
    const barH = 16;

    if (this.hungerBarGfx) this.hungerBarGfx.destroy();
    const g = this.add.graphics();
    this.hungerBarGfx = g;

    // Glass bg
    drawGlassPanel(g, { x: barX, y: barY, width: barW, height: barH, radius: 8 });

    // Fill color based on level
    const color = this.petHunger >= MIN_HUNGER_FOR_HAPPY ? 0x7ECB9A
      : this.petHunger >= MIN_HUNGER_FOR_NORMAL ? COLORS.primary
      : this.petHunger >= MIN_HUNGER_FOR_LOW ? 0xFFB347
      : 0xFF8C69;

    // Fill
    g.fillStyle(color, 0.7);
    g.fillRoundedRect(barX + 2, barY + 2, (barW - 4) * progress, barH - 4, 6);
    // Top highlight on fill
    g.fillStyle(COLORS.white, 0.3);
    g.fillRoundedRect(barX + 2, barY + 2, (barW - 4) * progress, (barH - 4) * 0.4, { tl: 6, tr: 6, bl: 1, br: 1 });

    // Breathing glow on bar (if hunger > 0)
    const glowGfx = this.add.graphics().setDepth(3);
    this.tweens.addCounter({
      from: 0.6, to: 1, duration: 1500, repeat: -1, yoyo: true,
      onUpdate: (tween) => {
        const a = tween.getValue();
        glowGfx.clear();
        if (progress > 0) {
          glowGfx.fillStyle(color, 0.2 * a);
          glowGfx.fillRoundedRect(barX + 2, barY + 2, (barW - 4) * progress, barH - 4, 6);
        }
      },
    });

    // Mood text
    const moodText = this.petHunger >= MIN_HUNGER_FOR_HAPPY ? '♡ 好开心~'
      : this.petHunger >= MIN_HUNGER_FOR_NORMAL ? '平静'
      : this.petHunger >= MIN_HUNGER_FOR_LOW ? '有点饿...'
      : '饿坏了...';
    this.add.text(GAME_WIDTH / 2, barY - 12, moodText, {
      fontFamily: 'Inter, "PingFang SC", sans-serif',
      fontSize: '13px', color: COLORS.textMain, fontStyle: '500',
    }).setOrigin(0.5);

    // Hunger %
    this.add.text(GAME_WIDTH / 2, barY + barH + 6, `饱食度 ${Math.round(this.petHunger)}%`, {
      fontFamily: 'Inter, sans-serif', fontSize: '11px', color: COLORS.textSecondary,
    }).setOrigin(0.5);
  }

  // ── Buttons ────────────────────────────────────────────
  private drawButtons() {
    const btnY = GAME_HEIGHT - 130;

    // Study button
    createGlassButton({
      scene: this, x: GAME_WIDTH / 2 - 150, y: btnY,
      width: 180, height: 46, label: '📖 开始学习', variant: 'primary',
      onClick: () => { AudioEngine.click(); this.scene.start('Study'); },
    });

    // Feed button
    createGlassButton({
      scene: this, x: GAME_WIDTH / 2 + 70, y: btnY,
      width: 120, height: 46, label: '🍎 喂食', variant: 'feed',
      onClick: () => this.doFeed(),
      onHover: () => this.showFeedParticles(),
    });

    // Shop button
    createGlassButton({
      scene: this, x: GAME_WIDTH / 2 + 220, y: btnY,
      width: 100, height: 46, label: '🛍 装扮', variant: 'shop',
      onClick: () => { AudioEngine.click(); this.shopDrawer.open(); },
    });

    // Pet switch button
    createGlassButton({
      scene: this, x: GAME_WIDTH / 2 + 340, y: btnY,
      width: 80, height: 46, label: '🐾 换宠', variant: 'back',
      onClick: () => { AudioEngine.click(); this.scene.start('Wardrobe'); },
    });
  }

  private doFeed() {
    AudioEngine.feed();
    const save = SAVE.load();
    if (SAVE.feed(save, 20, 5)) {
      this.foodCount = save.foodCount;
      this.petHunger = save.pet.hunger;
      this.drawFoodHUD();
      this.drawHungerBar();
      this.drawXPBar();
      this.drawPet();
      this.showFeedAnimation();
    } else {
      const warn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, '食物不够! 🍎', {
        fontFamily: 'Inter, "PingFang SC", sans-serif',
        fontSize: '16px', color: '#FF8C69', fontStyle: '600',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
      }).setOrigin(0.5).setDepth(10);
      this.tweens.add({ targets: warn, alpha: 0, y: warn.y - 30, duration: 1500, onComplete: () => warn.destroy() });
    }
  }

  private showFeedAnimation() {
    // Apple flies to pet
    const apple = this.add.text(130, 40, '🍎', { fontSize: '34px' }).setOrigin(0.5).setDepth(15);
    this.tweens.add({
      targets: apple,
      x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 - 110,
      duration: 450, ease: 'Cubic.easeIn',
      onComplete: () => {
        apple.destroy();
        // Happy pet reaction
        this.tweens.add({
          targets: this.petContainer, scaleX: 1.1, scaleY: 0.85,
          duration: 100, yoyo: true,
          onComplete: () => {
            this.tweens.add({
              targets: this.petContainer, scaleX: 1, scaleY: 1,
              duration: 250, ease: 'Back.easeOut',
            });
          },
        });
        // "好吃!" popup
        const yum = this.add.text(GAME_WIDTH / 2 + 40, GAME_HEIGHT / 2 - 170, '好吃!', {
          fontFamily: 'Inter, "PingFang SC", sans-serif',
          fontSize: '15px', color: '#FF8C69', fontStyle: '600',
        }).setOrigin(0.5).setDepth(15);
        this.tweens.add({ targets: yum, y: yum.y - 50, alpha: 0, duration: 1000, onComplete: () => yum.destroy() });
      },
    });
  }

  private showFeedParticles() {
    for (let i = 0; i < 4; i++) {
      const p = this.add.text(
        GAME_WIDTH / 2 + 60 + Math.random() * 80,
        GAME_HEIGHT - 140 - Math.random() * 20,
        '🍎', { fontSize: '14px' }
      ).setOrigin(0.5).setDepth(15);
      this.tweens.add({
        targets: p,
        x: p.x + (Math.random() - 0.5) * 60,
        y: p.y - 40 - Math.random() * 30,
        alpha: 0, duration: 700, delay: i * 60,
        onComplete: () => p.destroy(),
      });
    }
  }

  // ── Offline Rewards ──────────────────────────────────
  private checkOfflineRewards(save: ReturnType<typeof SAVE.load>) {
    const reward = SAVE.checkOffline(save);
    if (!reward) return;

    this.foodCount = save.foodCount;
    this.petHunger = save.pet.hunger;

    // Popup
    setTimeout(() => {
      const container = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50).setDepth(200);
      this.offlinePopup = container;

      const bg = this.add.graphics();
      drawGlassPanel(bg, { x: -160, y: -80, width: 320, height: 160, radius: 24 });
      container.add(bg);

      container.add(this.add.text(0, -55, '🌙 欢迎回来!', {
        fontSize: '20px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '700',
      }).setOrigin(0.5));

      container.add(this.add.text(0, -20, `离线 ${reward.offlineHours} 小时`, {
        fontSize: '14px', color: COLORS.textSecondary, fontFamily: 'Inter, sans-serif',
      }).setOrigin(0.5));

      container.add(this.add.text(0, 10, `饱食度恢复 +${reward.hungerRecovered}  🍎 +${reward.bonusApples}`, {
        fontSize: '15px', color: COLORS.textMain, fontFamily: 'Inter, sans-serif', fontStyle: '600',
      }).setOrigin(0.5));

      const okBtn = this.add.text(0, 55, '收下!', {
        fontSize: '16px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '700',
        backgroundColor: 'rgba(139,184,208,0.5)', padding: { left: 30, right: 30, top: 10, bottom: 10 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      okBtn.on('pointerdown', () => {
        AudioEngine.click();
        this.tweens.add({
          targets: container, alpha: 0, scale: 0.9,
          duration: 250, onComplete: () => container.destroy(),
        });
        this.offlinePopup = null;
        this.drawFoodHUD();
        this.drawHungerBar();
      });
      container.add(okBtn);

      container.setAlpha(0).setScale(0.7);
      this.tweens.add({
        targets: container, alpha: 1, scale: 1, duration: 350, ease: 'Back.easeOut',
      });
    }, 800);
  }
}

// ─── Wardrobe Scene ───────────────────────────────────────
export class WardrobeScene extends Phaser.Scene {
  constructor() { super('Wardrobe'); }

  create() {
    // Gradient bg
    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bgIce, COLORS.bgIce, COLORS.bgPink, COLORS.bgPink, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Title
    const titleChip = this.add.graphics();
    drawGlassPanel(titleChip, { x: GAME_WIDTH / 2 - 90, y: 32, width: 180, height: 44, radius: 22 });
    this.add.text(GAME_WIDTH / 2, 54, '🛍 装扮商店', {
      fontFamily: 'Inter, "PingFang SC", sans-serif',
      fontSize: '18px', color: COLORS.textMain, fontStyle: '600',
    }).setOrigin(0.5);

    const pets: PetType[] = ['cloudy', 'berry', 'mochi', 'pepper', 'tangerine'];
    const save = SAVE.load();

    pets.forEach((pt, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = GAME_WIDTH / 2 + (col - 1) * 180;
      const y = 260 + row * 200;
      const def = PET_DEFINITIONS[pt];
      const unlocked = save.unlockedPets.indexOf(pt) !== -1;

      // Glass card
      const card = this.add.graphics();
      drawGlassPanel(card, { x: x - 65, y: y - 70, width: 130, height: 145, radius: 20 });

      // Mini pet preview
      const pg = this.add.graphics();
      pg.fillStyle(def.primaryColor, 1);
      pg.fillEllipse(x, y, 55, 50);
      pg.fillStyle(COLORS.white, 1);
      pg.fillEllipse(x - 10, y - 8, 7, 7);
      pg.fillEllipse(x + 10, y - 8, 7, 7);

      this.add.text(x, y + 40, def.nameZh, {
        fontFamily: 'Inter, "PingFang SC", sans-serif',
        fontSize: '13px', color: unlocked ? COLORS.textMain : COLORS.textMuted,
        fontStyle: '500',
      }).setOrigin(0.5);

      if (unlocked) {
        card.setInteractive(
          new Phaser.Geom.Rectangle(x - 65, y - 70, 130, 145),
          Phaser.Geom.Rectangle.Contains,
        );
        card.on('pointerover', () => {
          this.tweens.add({ targets: card, scaleX: 1.04, scaleY: 1.04, duration: 150 });
        });
        card.on('pointerout', () => {
          this.tweens.add({ targets: card, scaleX: 1, scaleY: 1, duration: 150 });
        });
        card.on('pointerdown', () => {
          AudioEngine.click();
          SAVE.switchPet(save, pt);
          this.scene.start('Home');
        });
      } else {
        this.add.text(x, y + 58, '🔒', { fontSize: '14px' }).setOrigin(0.5);
      }
    });

    // Back button
    createGlassButton({
      scene: this, x: GAME_WIDTH / 2, y: GAME_HEIGHT - 80,
      width: 160, height: 46, label: '🏠 回首页', variant: 'back',
      onClick: () => { AudioEngine.click(); this.scene.start('Home'); },
    });
  }
}
