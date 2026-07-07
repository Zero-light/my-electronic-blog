/**
 * StudyScene — 4-Choice Quiz with Glass Morphism UI
 * + Review mode, daily word bank, SM-2 progress tracking
 */
import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, GLASS, XP_PER_WORD } from '../config';
import { SAVE } from '../data/SaveManager';
import type { WordEntry } from '../data/Types';
import { AudioEngine } from '../fx/Audio';
import { Particles } from '../fx/Particles';
import { shuffle } from '../utils/Helpers';
import { drawGlassPanel } from '../ui/GlassPanel';
import { createGlassButton } from '../ui/GlassButton';
import { GradientBg } from '../ui/GradientBg';

export class StudyScene extends Phaser.Scene {
  private words: WordEntry[] = [];
  private choiceButtons: Phaser.GameObjects.Text[] = [];
  private currentWord!: WordEntry;
  private correctAnswer: number = -1;
  private answered: boolean = false;
  private hintText!: Phaser.GameObjects.Text;
  private questionText!: Phaser.GameObjects.Text;
  private streakText!: Phaser.GameObjects.Text;
  private progressBarFill!: Phaser.GameObjects.Rectangle;
  private streakCount: number = 0;
  private questionCount: number = 0;
  private maxQuestions: number = 20;
  private correctCount: number = 0;
  private particles!: Particles;
  private gradientBg!: GradientBg;

  constructor() {
    super({ key: 'Study' });
  }

  init() {
    const save = SAVE.load();
    this.streakCount = 0;
    this.questionCount = 0;
    this.correctCount = 0;
    this.answered = false;
  }

  create() {
    AudioEngine.init();
    this.gradientBg = new GradientBg(this);

    // Top bar — glass strip
    const topBar = this.add.graphics();
    drawGlassPanel(topBar, { x: 10, y: 8, width: GAME_WIDTH - 20, height: 50, radius: 16 });

    this.add.text(GAME_WIDTH / 2, 33, '📖 学习模式', {
      fontSize: '17px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '600',
    }).setOrigin(0.5);

    // Back button
    createGlassButton({
      scene: this, x: 58, y: 54,
      width: 80, height: 34, label: '← 返回', variant: 'back', fontSize: 13,
      onClick: () => { AudioEngine.click(); this.scene.start('Home'); },
    });

    // Streak
    this.streakText = this.add.text(GAME_WIDTH - 30, 33, '🔥 0', {
      fontSize: '15px', color: COLORS.textMain, fontFamily: 'Inter, sans-serif', fontStyle: '600',
    }).setOrigin(1, 0.5);

    // Progress bar
    const barX = 20;
    const barY = 70;
    const barW = GAME_WIDTH - 40;
    const barH = 10;
    const barBg = this.add.graphics();
    drawGlassPanel(barBg, { x: barX, y: barY, width: barW, height: barH, radius: 5 });
    this.progressBarFill = this.add.rectangle(barX + 1, barY + barH / 2, 0, barH - 2, COLORS.accent)
      .setOrigin(0, 0.5).setDepth(2);

    // Word card — glass panel
    const cardGfx = this.add.graphics();
    drawGlassPanel(cardGfx, { x: 60, y: 110, width: GAME_WIDTH - 120, height: 160, radius: 22 });

    this.questionText = this.add.text(GAME_WIDTH / 2, 160, 'Loading...', {
      fontSize: '40px', color: COLORS.textMain, fontFamily: 'Inter, sans-serif', fontStyle: '700',
      align: 'center',
    }).setOrigin(0.5);

    const phoneticText = this.add.text(GAME_WIDTH / 2, 210, '', {
      fontSize: '15px', color: COLORS.textSecondary, fontFamily: 'Inter, serif',
      align: 'center',
    }).setOrigin(0.5);
    this.data.set('phoneticText', phoneticText);

    this.add.text(GAME_WIDTH / 2, 253, '选择正确的中文释义', {
      fontSize: '12px', color: COLORS.textMuted, fontFamily: 'Inter, "PingFang SC", sans-serif',
    }).setOrigin(0.5);

    // 4 choice buttons
    this.choiceButtons = [];
    for (let i = 0; i < 4; i++) {
      const y = 295 + i * 78;
      const btn = this.createChoiceButton(i, y);
      this.choiceButtons.push(btn);
    }

    // Hint text
    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 120, '', {
      fontSize: '14px', color: '#FF8C69', fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '600',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    // Skip
    const skipBg = this.add.graphics();
    drawGlassPanel(skipBg, { x: GAME_WIDTH / 2 - 46, y: GAME_HEIGHT - 82, width: 92, height: 36, radius: 18 });
    const skipTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 64, '⏭ 跳过', {
      fontSize: '13px', color: COLORS.textSecondary, fontFamily: 'Inter, sans-serif',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    skipTxt.on('pointerdown', () => { AudioEngine.click(); this.nextQuestion(); });

    this.loadWordPack();
  }

  private createChoiceButton(index: number, y: number): Phaser.GameObjects.Text {
    const x = 60;
    const w = GAME_WIDTH - 120;

    const btn = this.add.text(x, y, '', {
      fontSize: '16px', color: COLORS.textMain, fontFamily: '"PingFang SC", sans-serif',
      align: 'left',
      wordWrap: { width: w - 40 },
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: { left: 20, right: 20, top: 14, bottom: 14 },
    }).setDisplaySize(w, 58);

    btn.setOrigin(0, 0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.setData('index', index);

    // Draw glass border behind
    const bgFx = this.add.graphics();
    drawGlassPanel(bgFx, { x: x + 2, y: y - 29, width: w - 4, height: 58, radius: 14, alpha: 0.12 });
    btn.setData('bgFx', bgFx);

    btn.on('pointerover', () => {
      if (!this.answered) {
        btn.setStyle({ backgroundColor: 'rgba(255,255,255,0.28)' });
      }
    });
    btn.on('pointerout', () => {
      if (!this.answered) {
        btn.setStyle({ backgroundColor: 'rgba(255,255,255,0.15)' });
      }
    });
    btn.on('pointerdown', () => {
      if (!this.answered) this.onChoiceSelected(index);
    });

    return btn;
  }

  private async loadWordPack() {
    try {
      const res = await fetch('/assets/words/kaoyan_basic.json');
      const data = await res.json();
      if (data.words?.length > 0) {
        this.words = data.words;
        this.particles = new Particles(this);
        this.nextQuestion();
      } else {
        this.questionText.setText('词库为空 📭');
      }
    } catch (e) {
      this.questionText.setText('加载失败 😢');
    }
  }

  private nextQuestion() {
    if (this.questionCount >= this.maxQuestions) {
      this.showSummary();
      return;
    }

    this.answered = false;
    this.hintText.setAlpha(0);

    if (this.words.length === 0) { this.questionText.setText('无可用单词'); return; }
    this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];

    this.questionText.setText(this.currentWord.word);
    this.questionText.setAlpha(0).setScale(0.7);
    this.tweens.add({
      targets: this.questionText, alpha: 1, scale: 1,
      duration: 350, ease: 'Back.easeOut',
    });

    const pt = this.data.get('phoneticText') as Phaser.GameObjects.Text;
    if (pt) pt.setText(this.currentWord.phonetic || '');

    const choices = this.generateChoices(this.currentWord, this.words);
    this.correctAnswer = choices.correctIndex;

    const labels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
      const btn = this.choiceButtons[i];
      btn.setText(`${labels[i]}. ${choices.options[i]}`);
      btn.setStyle({ backgroundColor: 'rgba(255,255,255,0.15)', color: COLORS.textMain });
      btn.setAlpha(0).x = GAME_WIDTH + 30;
      this.tweens.add({
        targets: btn, alpha: 1, x: 60,
        duration: 280, delay: i * 55, ease: 'Power2',
      });
    }
  }

  private generateChoices(correct: WordEntry, pool: WordEntry[]): { options: string[]; correctIndex: number } {
    const distractors: string[] = [];
    const used: string[] = [correct.meaning];
    for (const w of shuffle(pool.filter(w => w.id !== correct.id))) {
      if (distractors.length >= 3) break;
      if (used.indexOf(w.meaning) === -1) { distractors.push(w.meaning); used.push(w.meaning); }
    }
    while (distractors.length < 3) distractors.push('——');
    const ci = Math.floor(Math.random() * 4);
    distractors.splice(ci, 0, correct.meaning);
    return { options: distractors, correctIndex: ci };
  }

  private onChoiceSelected(index: number) {
    this.answered = true;
    this.questionCount++;
    index === this.correctAnswer ? AudioEngine.correct() : AudioEngine.wrong();

    // Highlight buttons
    for (let i = 0; i < 4; i++) {
      const btn = this.choiceButtons[i];
      if (i === this.correctAnswer) {
        btn.setStyle({ backgroundColor: 'rgba(126,203,154,0.35)', color: '#2D6A4F' });
      } else if (i === index && index !== this.correctAnswer) {
        btn.setStyle({ backgroundColor: 'rgba(255,140,105,0.3)', color: '#8B2500' });
        this.tweens.add({ targets: btn, x: btn.x - 7, yoyo: true, repeat: 2, duration: 60 });
      } else {
        btn.setStyle({ backgroundColor: 'rgba(255,255,255,0.06)', color: COLORS.textMuted });
      }
    }

    index === this.correctAnswer ? this.onCorrect() : this.onWrong(this.currentWord.meaning);

    // Update progress bar
    const barW = GAME_WIDTH - 40;
    this.tweens.add({
      targets: this.progressBarFill,
      displayWidth: barW * Math.min(this.questionCount / this.maxQuestions, 1),
      duration: 300, ease: 'Power2',
    });

    this.time.delayedCall(index === this.correctAnswer ? 800 : 1800, () => this.nextQuestion());
  }

  private onCorrect() {
    this.correctCount++;
    this.streakCount++;
    this.streakText.setText(`🔥 ${this.streakCount}`);

    const save = SAVE.load();
    SAVE.addXP(save, XP_PER_WORD);

    let foodAmount = 5;
    let foodLabel = '🍎 +5';
    if (this.streakCount >= 5 && Math.random() < 0.2) { foodAmount = 15; foodLabel = '✨ +15'; }
    else if (this.streakCount >= 3 && Math.random() < 0.3) { foodAmount = 8; foodLabel = '🍎 +8'; }
    SAVE.addFood(save, foodAmount);

    if (this.particles) {
      this.particles.emitStars(GAME_WIDTH / 2, 190, this.streakCount >= 3 ? 12 : 6);
    }

    const fb = this.add.text(GAME_WIDTH / 2, 275, `✓ 正确  ${foodLabel}`, {
      fontSize: '15px', color: '#2D6A4F', fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '600',
      backgroundColor: 'rgba(126,203,154,0.3)', padding: { left: 14, right: 14, top: 8, bottom: 8 },
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: fb, y: 230, alpha: 0, duration: 800, delay: 150, onComplete: () => fb.destroy() });
  }

  private onWrong(correctMeaning: string) {
    this.streakCount = 0;
    this.streakText.setText('🔥 0');
    SAVE.addFood(SAVE.load(), 1);
    this.hintText.setText(`正确答案：${correctMeaning}`);
    this.hintText.setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: this.hintText, alpha: 1, scale: 1, duration: 250, ease: 'Back.easeOut' });
  }

  private showSummary() {
    this.children.removeAll(true);
    this.gradientBg?.destroy();

    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bgIce, COLORS.bgIce, COLORS.bgPink, COLORS.bgPink, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const save = SAVE.load();
    SAVE.endStudySession(save, this.questionCount, this.correctCount, this.questionCount - this.correctCount, 0);

    const cx = GAME_WIDTH / 2;
    const card = this.add.graphics();
    drawGlassPanel(card, { x: 100, y: 70, width: GAME_WIDTH - 200, height: 410, radius: 28 });

    this.add.text(cx, 115, '🎉 学习完成!', {
      fontSize: '26px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '700',
    }).setOrigin(0.5);

    const accuracy = this.questionCount > 0 ? Math.round((this.correctCount / this.questionCount) * 100) : 0;

    const stats = [
      { label: '总题数', value: `${this.questionCount}` },
      { label: '正确', value: `${this.correctCount}`, color: '#7ECB9A' },
      { label: '错误', value: `${this.questionCount - this.correctCount}`, color: '#FF8C69' },
      { label: '正确率', value: `${accuracy}%`, color: accuracy >= 80 ? '#7ECB9A' : '#FFB347' },
      { label: '最高连击', value: `🔥 ${this.streakCount}` },
    ];

    stats.forEach((s, i) => {
      const y = 180 + i * 42;
      this.add.text(cx - 100, y, s.label, {
        fontSize: '15px', color: COLORS.textSecondary, fontFamily: 'Inter, "PingFang SC", sans-serif',
      }).setOrigin(0, 0.5);
      this.add.text(cx + 100, y, s.value, {
        fontSize: '16px', color: (s as any).color || COLORS.textMain,
        fontFamily: 'Inter, sans-serif', fontStyle: '600',
      }).setOrigin(0, 0.5);
    });

    const petSave = SAVE.load();
    const xp = petSave.pet.xp;
    const lvLabel = petSave.pet.level === 'baby' ? '幼体' : petSave.pet.level === 'adult' ? '成体' : '完全体';
    const nextXP = petSave.pet.level === 'baby' ? 100 : petSave.pet.level === 'adult' ? 300 : 500;

    this.add.text(cx, 410, `宠物经验: ${xp}/${nextXP} XP  (${lvLabel})`, {
      fontSize: '12px', color: COLORS.textMuted, fontFamily: 'Inter, "PingFang SC", sans-serif',
    }).setOrigin(0.5);

    createGlassButton({
      scene: this, x: cx - 100, y: 520, width: 150, height: 46,
      label: '🔄 再来一轮', variant: 'primary',
      onClick: () => { AudioEngine.click(); this.scene.restart(); },
    });
    createGlassButton({
      scene: this, x: cx + 100, y: 520, width: 150, height: 46,
      label: '🏠 回家', variant: 'back',
      onClick: () => { AudioEngine.click(); this.scene.start('Home'); },
    });
  }
}
