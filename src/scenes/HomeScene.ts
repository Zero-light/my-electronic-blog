import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, PET_TYPES, PET_DEFINITIONS, type PetType, MAX_HUNGER, MIN_HUNGER_FOR_HAPPY, MIN_HUNGER_FOR_NORMAL, MIN_HUNGER_FOR_LOW } from '../config';
import { SAVE } from '../data/SaveManager';
import { AudioEngine } from '../fx/Audio';
import { lighten, darken } from '../utils/Helpers';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() { this.scene.start('Home'); }
}

export class HomeScene extends Phaser.Scene {
  private petType: PetType = 'cloudy';
  private foodCount = 10;
  private petHunger = 70;
  private petXP = 0;
  private petLevel: 'baby' | 'adult' | 'full' = 'baby';
  private petGfx!: Phaser.GameObjects.Graphics;

  constructor() { super('Home'); }

  create() {
    const save = SAVE.load();
    SAVE.applyHungerDecay(save);
    this.petType = (save.currentPet as PetType) || 'cloudy';
    this.foodCount = save.foodCount;
    this.petHunger = save.pet.hunger;
    this.petXP = save.pet.xp;
    this.petLevel = save.pet.level;

    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.accent, COLORS.accent, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.drawGround();
    this.petGfx = this.add.graphics();
    this.drawPet();

    this.add.text(GAME_WIDTH / 2, 140, `Day ${SAVE.load().dailyStreak || 1}`, {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '20px', color: '#2D3748',
    }).setOrigin(0.5);

    this.drawFoodHUD();
    this.drawXPBar();
    this.drawHungerBar();
    this.drawFeedButton();
    this.drawStudyButton();
    this.drawShopButton();

    this.input.on('pointerdown', () => {});

    this.time.addEvent({
      delay: 60000,
      callback: () => {
        const s = SAVE.load();
        SAVE.applyHungerDecay(s);
        this.petHunger = s.pet.hunger;
        this.refreshBars();
        this.refreshPet();
      },
      loop: true,
    });
  }

  private drawGround() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.secondary, 0.4);
    g.fillEllipse(GAME_WIDTH / 2, GAME_HEIGHT - 120, GAME_WIDTH - 60, 60);
  }

  private drawPet() {
    const def = PET_DEFINITIONS[this.petType];
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 80;
    const g = this.petGfx;
    g.clear();

    // shadow
    g.fillStyle(darken(def.primaryColor, 40), 0.3);
    g.fillEllipse(cx, cy + 35, 130, 30);

    // body
    const moodAlpha = this.petHunger < MIN_HUNGER_FOR_LOW ? 0.5 : (this.petHunger < MIN_HUNGER_FOR_NORMAL ? 0.8 : 1);
    g.fillStyle(darken(def.primaryColor, 20), moodAlpha);
    g.fillEllipse(cx, cy + 5, 140, 120);
    g.fillStyle(def.primaryColor, moodAlpha);
    g.fillEllipse(cx, cy, 135, 115);
    g.fillStyle(lighten(def.primaryColor, 25), 0.5 * moodAlpha);
    g.fillEllipse(cx, cy - 20, 90, 40);

    // ears/features per pet type
    g.fillStyle(def.secondaryColor, moodAlpha);
    if (this.petType === 'cloudy') {
      g.fillEllipse(cx - 45, cy - 40, 40, 35);
      g.fillEllipse(cx + 45, cy - 40, 40, 35);
      g.fillEllipse(cx, cy - 55, 30, 30);
    } else if (this.petType === 'pepper') {
      g.fillTriangle(cx - 55, cy - 30, cx - 25, cy - 80, cx - 10, cy - 25);
      g.fillTriangle(cx + 55, cy - 30, cx + 25, cy - 80, cx + 10, cy - 25);
    } else if (this.petType === 'berry') {
      g.fillEllipse(cx - 48, cy - 40, 30, 30);
      g.fillEllipse(cx + 48, cy - 40, 30, 30);
      // strawberry leaf hat
      g.fillStyle(0x4CAF50, 1);
      g.fillEllipse(cx, cy - 60, 8, 14);
      g.fillStyle(0x66BB6A, 1);
      g.fillTriangle(cx - 8, cy - 60, cx, cy - 75, cx + 8, cy - 60);
    } else if (this.petType === 'mochi') {
      g.fillEllipse(cx - 40, cy - 35, 25, 25);
      g.fillEllipse(cx + 40, cy - 35, 25, 25);
    } else if (this.petType === 'tangerine') {
      // orange leaf on top
      g.fillStyle(0x4CAF50, 1);
      g.fillEllipse(cx, cy - 65, 12, 6);
      g.fillStyle(0x66BB6A, 1);
      g.fillEllipse(cx - 4, cy - 70, 10, 5);
      g.fillEllipse(cx + 4, cy - 70, 10, 5);
    }

    // eyes
    const eyeY = cy - 8;
    const eyeClosed = this.petHunger < MIN_HUNGER_FOR_LOW;
    g.fillStyle(COLORS.textDark, moodAlpha);
    if (eyeClosed) {
      // tired closed eyes (lines)
      g.lineStyle(2, COLORS.textDark, 0.8);
      g.beginPath();
      g.moveTo(cx - 30, eyeY); g.lineTo(cx - 18, eyeY);
      g.strokePath();
      g.beginPath();
      g.moveTo(cx + 18, eyeY); g.lineTo(cx + 30, eyeY);
      g.strokePath();
    } else {
      g.fillEllipse(cx - 25, eyeY, 12, 14);
      g.fillEllipse(cx + 25, eyeY, 12, 14);
      g.fillStyle(COLORS.white, moodAlpha);
      g.fillEllipse(cx - 22, eyeY - 3, 4, 4);
      g.fillEllipse(cx + 28, eyeY - 3, 4, 4);
    }

    // blush (hidden when very hungry)
    if (this.petHunger > MIN_HUNGER_FOR_LOW) {
      g.fillStyle(0xFFB5C5, 0.5 * moodAlpha);
      g.fillEllipse(cx - 38, cy + 10, 14, 8);
      g.fillEllipse(cx + 38, cy + 10, 14, 8);
    }

    // mouth — expression based on hunger
    g.lineStyle(2, COLORS.textDark, 0.8);
    if (this.petHunger >= MIN_HUNGER_FOR_HAPPY) {
      // happy smile
      g.beginPath();
      g.arc(cx, cy + 3, 8, Phaser.Math.DegToRad(25), Phaser.Math.DegToRad(155));
      g.strokePath();
    } else if (this.petHunger >= MIN_HUNGER_FOR_NORMAL) {
      // neutral
      g.beginPath();
      g.moveTo(cx - 8, cy + 5); g.lineTo(cx + 8, cy + 5);
      g.strokePath();
    } else {
      // sad
      g.beginPath();
      g.arc(cx, cy + 12, 6, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340));
      g.strokePath();
    }

    // mood drops when very hungry
    if (this.petHunger < MIN_HUNGER_FOR_LOW) {
      g.fillStyle(0xFF6B6B, 0.7);
      g.fillEllipse(cx - 20, cy - 50, 8, 8);
      g.fillEllipse(cx + 20, cy - 45, 6, 6);
    }

    // bounce when spawning
    g.setScale(0.6);
    this.tweens.add({ targets: g, scale: 1, duration: 500, ease: 'Back.easeOut' });
    this.tweens.add({ targets: g, y: '+=6', duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private drawFoodHUD() {
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.white, 0.7);
    bg.fillRoundedRect(20, 20, 130, 44, 22);
    this.add.text(40, 30, '🍎 ', { fontSize: '18px' }).setOrigin(0, 0);
    const foodLabel = this.add.text(68, 42, `${this.foodCount}`, {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#2D3748',
    }).setOrigin(0, 0.5);
  }

  private drawXPBar() {
    const save = SAVE.load();
    const totalXP = save.pet.xp;
    const requiredXP = this.petLevel === 'baby' ? 100 : (this.petLevel === 'adult' ? 300 : 500);
    const prevXP = this.petLevel === 'baby' ? 0 : (this.petLevel === 'adult' ? 100 : 300);
    const progress = Math.min(1, (totalXP - prevXP) / (requiredXP - prevXP));

    const x = GAME_WIDTH - 150;
    const y = 28;
    const w = 130;
    const h = 16;
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.white, 0.6);
    bg.fillRoundedRect(x, y, w, h, 8);
    bg.fillStyle(COLORS.accent, 1);
    bg.fillRoundedRect(x, y, w * progress, h, 8);
    bg.lineStyle(1, COLORS.primary, 1);
    bg.strokeRoundedRect(x, y, w, h, 8);
    this.add.text(x, y + h + 4, `LV ${this.petLevel === 'baby' ? 1 : (this.petLevel === 'adult' ? 2 : 3)}  ${totalXP}/${requiredXP} XP`, {
      fontFamily: 'sans-serif', fontSize: '11px', color: '#718096',
    });
  }

  private drawHungerBar() {
    const progress = Math.max(0, this.petHunger / MAX_HUNGER);
    const barW = 200;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT - 220;

    const bg = this.add.graphics();
    bg.fillStyle(COLORS.white, 0.6);
    bg.fillRoundedRect(barX, barY, barW, 16, 8);

    const color = this.petHunger >= MIN_HUNGER_FOR_HAPPY ? COLORS.correct
      : this.petHunger >= MIN_HUNGER_FOR_NORMAL ? COLORS.primary
      : this.petHunger >= MIN_HUNGER_FOR_LOW ? 0xFFB347
      : 0xFF6B6B;
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(barX, barY, barW * progress, 16, 8);

    bg.lineStyle(1, COLORS.textLight, 1);
    bg.strokeRoundedRect(barX, barY, barW, 16, 8);

    this.add.text(GAME_WIDTH / 2, barY + 24, `饱食度 ${Math.round(this.petHunger)}%`, {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '12px', color: '#718096',
    }).setOrigin(0.5);

    // mood text above
    const moodText = this.petHunger >= MIN_HUNGER_FOR_HAPPY ? '♡ 好开心~'
      : this.petHunger >= MIN_HUNGER_FOR_NORMAL ? '平静'
      : this.petHunger >= MIN_HUNGER_FOR_LOW ? '有点饿...'
      : 'zzz...';
    this.add.text(GAME_WIDTH / 2, barY - 16, moodText, {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '14px', color: '#2D3748',
    }).setOrigin(0.5);
  }

  private drawFeedButton() {
    const y = GAME_HEIGHT - 155;
    const btn = this.add.graphics();
    btn.fillStyle(0x77DD77, 1);
    btn.fillRoundedRect(GAME_WIDTH / 2 + 68, y - 22, 80, 44, 22);
    const txt = this.add.text(GAME_WIDTH / 2 + 108, y, '喂食\n(-5🍎/+20)', {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '11px', color: '#FFF', align: 'center',
    }).setOrigin(0.5);

    btn.setInteractive(new Phaser.Geom.Rectangle(GAME_WIDTH / 2 + 68, y - 22, 80, 44), Phaser.Geom.Rectangle.Contains);
    btn.on('pointerdown', () => {
      AudioEngine.feed();
      const save = SAVE.load();
      if (SAVE.feed(save, 20, 5)) {
        this.foodCount = save.foodCount;
        this.petHunger = save.pet.hunger;
        this.refreshBars();
        this.refreshPet();
        this.showFeedTween();
      } else {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 160, '食物不够!', {
          fontFamily: 'sans-serif', fontSize: '18px', color: '#FF6B6B',
        }).setOrigin(0.5).setAlpha(1)
          .setDepth(10);
        this.tweens.add({ targets: txt, alpha: 0, duration: 1200, onComplete: () => {} });
      }
    });
  }

  private drawStudyButton() {
    const y = GAME_HEIGHT - 155;
    const btn = this.add.graphics();
    btn.fillStyle(COLORS.primary, 1);
    btn.fillRoundedRect(GAME_WIDTH / 2 - 148, y - 22, 210, 44, 22);
    const txt = this.add.text(GAME_WIDTH / 2 - 43, y, '📖 开始学习', {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '18px', color: '#FFF',
    }).setOrigin(0.5);

    btn.setInteractive(new Phaser.Geom.Rectangle(GAME_WIDTH / 2 - 148, y - 22, 210, 44), Phaser.Geom.Rectangle.Contains);
    btn.on('pointerdown', () => {
      AudioEngine.click();
      this.tweens.add({ targets: [btn, txt], scaleX: 0.92, scaleY: 0.92, duration: 80, yoyo: true });
      this.scene.start('Study');
    });
  }

  private drawShopButton() {
    const y = GAME_HEIGHT - 100;
    const btn = this.add.graphics();
    btn.fillStyle(0xFFE5F1, 1);
    btn.fillRoundedRect(GAME_WIDTH / 2 - 100, y - 20, 200, 40, 20);
    const txt = this.add.text(GAME_WIDTH / 2, y, '🛍️ 装扮', {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '16px', color: '#2D3748',
    }).setOrigin(0.5);

    btn.setInteractive(new Phaser.Geom.Rectangle(GAME_WIDTH / 2 - 100, y - 20, 200, 40), Phaser.Geom.Rectangle.Contains);
    btn.on('pointerdown', () => {
      AudioEngine.click();
      this.tweens.add({ targets: [btn, txt], scaleX: 0.95, scaleY: 0.95, duration: 80, yoyo: true });
      this.scene.start('Wardrobe');
    });
  }

  private refreshBars() {
    this.children.removeAll(true);
    this.drawGround();
    this.petGfx = this.add.graphics();
    this.drawPet();
    this.drawFoodHUD();
    this.drawXPBar();
    this.drawHungerBar();
    this.drawFeedButton();
    this.drawStudyButton();
    this.drawShopButton();
  }

  private refreshPet() {
    if (this.petGfx) {
      this.drawPet();
    }
  }

  private showFeedTween() {
    // food flies from food HUD to pet
    const apple = this.add.text(80, 42, '🍎', { fontSize: '32px' }).setOrigin(0.5);
    this.tweens.add({
      targets: apple,
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2 - 100,
      duration: 500,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        apple.destroy();
        const happy = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 140, '好吃!', {
          fontFamily: '"PingFang SC", sans-serif', fontSize: '16px', color: '#FF69B4',
        }).setOrigin(0.5);
        this.tweens.add({ targets: happy, y: happy.y - 50, alpha: 0, duration: 800, onComplete: () => happy.destroy() });
      },
    });
  }
}

export class WardrobeScene extends Phaser.Scene {
  constructor() { super('Wardrobe'); }

  create() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.accent, COLORS.accent, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.text(GAME_WIDTH / 2, 50, '🛍️ 装扮商店', {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '24px', color: '#2D3748',
    }).setOrigin(0.5);

    const pets: PetType[] = ['cloudy', 'berry', 'mochi', 'pepper', 'tangerine'];
    const save = SAVE.load();

    pets.forEach((pt, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = GAME_WIDTH / 2 + (col - 1) * 160;
      const y = 220 + row * 180;
      const def = PET_DEFINITIONS[pt];
      const unlocked = save.unlockedPets.indexOf(pt) !== -1;

      const card = this.add.graphics();
      card.fillStyle(unlocked ? def.primaryColor : 0xCCCCCC, 0.3);
      card.fillRoundedRect(x - 50, y - 60, 100, 130, 16);

      // mini pet preview
      const pg = this.add.graphics();
      pg.fillStyle(def.primaryColor, 1);
      pg.fillEllipse(x, y - 10, 50, 45);
      pg.fillStyle(COLORS.white, 1);
      pg.fillEllipse(x - 8, y - 15, 5, 5);
      pg.fillEllipse(x + 8, y - 15, 5, 5);

      this.add.text(x, y + 30, def.nameZh, {
        fontFamily: '"PingFang SC", sans-serif', fontSize: '12px',
        color: unlocked ? '#2D3748' : '#999',
      }).setOrigin(0.5);

      if (unlocked) {
        card.setInteractive(new Phaser.Geom.Rectangle(x - 50, y - 60, 100, 130), Phaser.Geom.Rectangle.Contains);
        card.on('pointerdown', () => {
          SAVE.switchPet(save, pt);
          this.scene.start('Home');
        });
      } else {
        this.add.text(x, y + 50, '🔒', { fontSize: '14px' }).setOrigin(0.5);
      }
    });

    // back button
    const back = this.add.graphics();
    back.fillStyle(COLORS.primary, 1);
    back.fillRoundedRect(GAME_WIDTH / 2 - 80, GAME_HEIGHT - 120, 160, 50, 25);
    const backTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 95, '回首页', {
      fontFamily: '"PingFang SC", sans-serif', fontSize: '18px', color: '#FFF',
    }).setOrigin(0.5);
    back.setInteractive(new Phaser.Geom.Rectangle(GAME_WIDTH / 2 - 80, GAME_HEIGHT - 120, 160, 50), Phaser.Geom.Rectangle.Contains);
    back.on('pointerdown', () => this.scene.start('Home'));
  }
}
