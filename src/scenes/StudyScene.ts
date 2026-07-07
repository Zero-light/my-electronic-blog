/**
 * Study Scene — 4-Choice Quiz
 * Core loop: show word → 4 choices → pick right → earn XP + food + particles + audio
 */

import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, DAILY_GOAL_DEFAULT, XP_PER_WORD } from '../config';
import { SAVE } from '../data/SaveManager';
import type { WordEntry } from '../data/Types';
import { AudioEngine } from '../fx/Audio';
import { Particles } from '../fx/Particles';
import { shuffle } from '../utils/Helpers';

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

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.secondary, COLORS.secondary, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Top bar — back button
    const topBarBg = this.add.graphics();
    topBarBg.fillStyle(0xFFFFFF, 0.6);
    topBarBg.fillRect(0, 0, GAME_WIDTH, 72);

    this.add.text(GAME_WIDTH / 2, 36, '📖 学习模式', {
      fontSize: '18px', color: '#2D3748', fontFamily: '"PingFang SC", sans-serif',
    }).setOrigin(0.5);

    const backBtn = this.add.text(20, 20, '← 返回', {
      fontSize: '16px', color: '#7C9CF8', fontFamily: 'sans-serif',
    });
    backBtn.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      AudioEngine.click();
      this.scene.start('Home');
    });

    // Score / streak display
    this.streakText = this.add.text(GAME_WIDTH - 20, 20, '🔥 0', {
      fontSize: '16px', color: '#2D3748', fontFamily: 'sans-serif',
    }).setOrigin(1, 0);

    // Progress bar
    const barY = 74;
    const barW = GAME_WIDTH - 40;
    const barH = 8;
    const barBg = this.add.graphics();
    barBg.fillStyle(0xE0E0E0, 1);
    barBg.fillRoundedRect(20, barY, barW, barH, 4);
    this.progressBarFill = this.add.rectangle(20, barY + barH / 2, 0, barH, COLORS.primary)
      .setOrigin(0, 0.5);
    this.add.text(GAME_WIDTH / 2, barY + barH + 14, '0 / 20', {
      fontSize: '12px', color: '#718096', fontFamily: 'sans-serif',
    }).setOrigin(0.5);

    // Word display — centered card area
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0xFFFFFF, 0.92);
    cardBg.fillRoundedRect(30, 120, GAME_WIDTH - 60, 130, 20);
    cardBg.lineStyle(1, COLORS.primary, 0.3);
    cardBg.strokeRoundedRect(30, 120, GAME_WIDTH - 60, 130, 20);

    this.questionText = this.add.text(GAME_WIDTH / 2, 158, 'Loading...', {
      fontSize: '36px', color: '#2D3748', fontFamily: 'sans-serif',
      align: 'center',
    }).setOrigin(0.5);

    // Phonetic
    const phoneticText = this.add.text(GAME_WIDTH / 2, 205, '', {
      fontSize: '15px', color: '#718096', fontFamily: 'serif',
      align: 'center',
    }).setOrigin(0.5);
    this.data.set('phoneticText', phoneticText);

    // Hint: "pick the correct meaning"
    this.add.text(GAME_WIDTH / 2, 238, '选择正确的中文释义 👇', {
      fontSize: '12px', color: '#AAA', fontFamily: '"PingFang SC", sans-serif',
    }).setOrigin(0.5);

    // 4 choice buttons
    this.choiceButtons = [];
    for (let i = 0; i < 4; i++) {
      const y = 290 + i * 76;
      const btn = this.createChoiceButton(i, y);
      this.choiceButtons.push(btn);
    }

    // Hint text (shows correct answer on wrong)
    this.hintText = this.add.text(GAME_WIDTH / 2, 620, '', {
      fontSize: '14px', color: '#FF6B6B', fontFamily: '"PingFang SC", sans-serif',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    // Skip button
    const skipTxt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 70, '⏭ 跳过', {
      fontSize: '15px', color: '#718096', fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    skipTxt.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      AudioEngine.click();
      this.nextQuestion();
    });

    // Question counter bottom
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 48, '', {
      fontSize: '11px', color: '#AAA', fontFamily: 'sans-serif',
    }).setOrigin(0.5);

    // Load words and start
    this.loadWordPack();
  }

  private createChoiceButton(index: number, y: number): Phaser.GameObjects.Text {
    const colors = ['#FFE8EC', '#E8F0FF', '#E8FFEE', '#FFF5E8'];
    const x = 30;
    const w = GAME_WIDTH - 60;

    const btn = this.add.text(x, y, '', {
      fontSize: '16px', color: '#2D3748', fontFamily: '"PingFang SC", sans-serif',
      align: 'left',
      wordWrap: { width: w - 50 },
      backgroundColor: colors[index],
      padding: { left: 18, right: 18, top: 16, bottom: 16 },
    }).setDisplaySize(w, 60);

    btn.setOrigin(0, 0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.setData('index', index);
    btn.setData('defaultBg', colors[index]);

    btn.on('pointerover', () => {
      if (!this.answered) {
        btn.setStyle({ backgroundColor: '#E0E8FF' });
      }
    });
    btn.on('pointerout', () => {
      if (!this.answered) {
        btn.setStyle({ backgroundColor: colors[index] });
      }
    });
    btn.on('pointerdown', () => {
      if (!this.answered) {
        this.onChoiceSelected(index);
      }
    });

    return btn;
  }

  private async loadWordPack() {
    try {
      const res = await fetch('/assets/words/kaoyan_basic.json');
      const data = await res.json();
      if (data.words && data.words.length > 0) {
        this.words = data.words;
        this.particles = new Particles(this);
        this.nextQuestion();
      } else {
        this.questionText.setText('词库为空 📭');
      }
    } catch (e) {
      console.error('Word pack load failed:', e);
      this.questionText.setText('加载词库失败 😢');
    }
  }

  private nextQuestion() {
    // Check if round is complete
    if (this.questionCount >= this.maxQuestions && this.maxQuestions > 0) {
      this.showSummary();
      return;
    }

    this.answered = false;
    this.hintText.setAlpha(0);

    // Pick word — prefer unreviewed words
    const candidates = this.words;
    if (candidates.length === 0) {
      this.questionText.setText('无可用单词');
      return;
    }
    this.currentWord = candidates[Math.floor(Math.random() * candidates.length)];

    // Update question display
    this.questionText.setText(this.currentWord.word);
    this.questionText.setAlpha(0);
    this.questionText.setScale(0.8);
    this.tweens.add({
      targets: this.questionText,
      alpha: 1, scale: 1,
      duration: 300, ease: 'Back.easeOut',
    });

    const phoneticText = this.data.get('phoneticText') as Phaser.GameObjects.Text;
    if (phoneticText) {
      phoneticText.setText(this.currentWord.phonetic || '');
    }

    // Generate 4 choices with 1 correct + 3 distractors
    const choices = this.generateChoices(this.currentWord, candidates);
    this.correctAnswer = choices.correctIndex;

    const labels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
      const btn = this.choiceButtons[i];
      btn.setText(`${labels[i]}. ${choices.options[i]}`);
      btn.setStyle({ backgroundColor: btn.getData('defaultBg'), color: '#2D3748' });
      btn.setAlpha(0);
      btn.x = GAME_WIDTH;
      this.tweens.add({
        targets: btn,
        alpha: 1, x: 30,
        duration: 280, delay: i * 55,
        ease: 'Power2',
      });
    }
  }

  private generateChoices(
    correct: WordEntry,
    pool: WordEntry[]
  ): { options: string[]; correctIndex: number } {
    const distractors: string[] = [];
    const usedMeanings: string[] = [correct.meaning];

    // Shuffle the pool to get random distractors
    const others = shuffle(pool.filter((w) => w.id !== correct.id));

    for (const w of others) {
      if (distractors.length >= 3) break;
      if (usedMeanings.indexOf(w.meaning) === -1) {
        distractors.push(w.meaning);
        usedMeanings.push(w.meaning);
      }
    }

    // Fallback if not enough unique meanings
    while (distractors.length < 3) {
      distractors.push(`——`);
    }

    // Insert correct answer at random position
    const correctIndex = Math.floor(Math.random() * 4);
    distractors.splice(correctIndex, 0, correct.meaning);

    return { options: distractors, correctIndex };
  }

  private onChoiceSelected(index: number) {
    this.answered = true;
    this.questionCount++;

    // Audio feedback
    if (index === this.correctAnswer) {
      AudioEngine.correct();
    } else {
      AudioEngine.wrong();
    }

    // Visual feedback — highlight buttons
    const labels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
      const btn = this.choiceButtons[i];
      if (i === this.correctAnswer) {
        btn.setStyle({ backgroundColor: '#D4EDDA', color: '#155724' });
      } else if (i === index && index !== this.correctAnswer) {
        btn.setStyle({ backgroundColor: '#F8D7DA', color: '#721C24' });
        // Shake wrong choice
        this.tweens.add({
          targets: btn, x: btn.x - 7,
          yoyo: true, repeat: 2, duration: 60,
        });
      } else {
        btn.setStyle({ backgroundColor: '#F0F0F0', color: '#AAAAAA' });
      }
    }

    if (index === this.correctAnswer) {
      this.onCorrect();
    } else {
      this.onWrong(this.currentWord.meaning);
    }

    // Update progress bar
    const barW = GAME_WIDTH - 40;
    const progress = Math.min(this.questionCount / this.maxQuestions, 1);
    this.tweens.add({
      targets: this.progressBarFill,
      displayWidth: barW * progress,
      duration: 300, ease: 'Power2',
    });

    // Update counter text
    const counterText = this.children.getByName('qCounter') as Phaser.GameObjects.Text;
    // Find and update counter (created in showWord or initial create)

    // Auto-advance
    const delay = index === this.correctAnswer ? 800 : 1800;
    this.time.delayedCall(delay, () => {
      this.nextQuestion();
    });
  }

  private onCorrect() {
    this.correctCount++;
    this.streakCount++;
    this.streakText.setText(`🔥 ${this.streakCount}`);

    const save = SAVE.load();
    SAVE.addXP(save, XP_PER_WORD);

    // Food reward — chance of rare food on long streaks
    let foodAmount = 5;
    let foodLabel = '🍎 +5';
    if (this.streakCount >= 5 && Math.random() < 0.2) {
      foodAmount = 15;
      foodLabel = '✨ 金苹果 +15';
    } else if (this.streakCount >= 3 && Math.random() < 0.3) {
      foodAmount = 8;
      foodLabel = '🍎 +8';
    }
    SAVE.addFood(save, foodAmount);

    // Particle burst
    if (this.particles) {
      this.particles.emitStars(GAME_WIDTH / 2, 180, this.streakCount >= 3 ? 12 : 6);
      if (this.streakCount >= 5) {
        this.particles.emitHeart(GAME_WIDTH / 2 + 40, 150);
      }
    }

    // Feedback text
    const feedback = this.add.text(GAME_WIDTH / 2, 270, `✓ 正确  ${foodLabel}`, {
      fontSize: '16px', color: '#155724', fontFamily: '"PingFang SC", sans-serif',
      backgroundColor: '#D4EDDA',
      padding: { left: 14, right: 14, top: 8, bottom: 8 },
    }).setOrigin(0.5).setDepth(4);
    this.tweens.add({
      targets: feedback, y: 230, alpha: 0, duration: 1000, delay: 200,
      onComplete: () => feedback.destroy(),
    });
  }

  private onWrong(correctMeaning: string) {
    this.streakCount = 0;
    this.streakText.setText(`🔥 0`);

    const save = SAVE.load();
    SAVE.addFood(save, 1); // comfort food

    // Show correct answer
    this.hintText.setText(`正确答案：${correctMeaning}`);
    this.hintText.setAlpha(0);
    this.hintText.setScale(0.9);
    this.tweens.add({
      targets: this.hintText,
      alpha: 1, scale: 1,
      duration: 250, ease: 'Back.easeOut',
    });
  }

  private showSummary() {
    // Clear scene
    this.children.removeAll(true);

    const save = SAVE.load();
    SAVE.endStudySession(save, this.questionCount, this.correctCount, this.questionCount - this.correctCount, 0);

    // BG
    const bg = this.add.graphics();
    bg.fillGradientStyle(COLORS.bg, COLORS.bg, COLORS.accent, COLORS.accent, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const cx = GAME_WIDTH / 2;

    // Summary card
    const card = this.add.graphics();
    card.fillStyle(0xFFFFFF, 0.95);
    card.fillRoundedRect(30, 120, GAME_WIDTH - 60, 380, 24);
    card.lineStyle(2, COLORS.primary, 0.3);
    card.strokeRoundedRect(30, 120, GAME_WIDTH - 60, 380, 24);

    this.add.text(cx, 170, '🎉 学习完成!', {
      fontSize: '28px', color: '#2D3748', fontFamily: '"PingFang SC", sans-serif',
    }).setOrigin(0.5);

    // Stats
    const accuracy = this.questionCount > 0
      ? Math.round((this.correctCount / this.questionCount) * 100)
      : 0;

    const stats = [
      { label: '总题数', value: `${this.questionCount}` },
      { label: '正确', value: `${this.correctCount}`, color: '#77DD77' },
      { label: '错误', value: `${this.questionCount - this.correctCount}`, color: '#FF6B6B' },
      { label: '正确率', value: `${accuracy}%`, color: accuracy >= 80 ? '#77DD77' : '#FFB347' },
      { label: '最高连击', value: `🔥 ${this.streakCount}` },
    ];

    stats.forEach((s, i) => {
      const y = 230 + i * 42;
      this.add.text(cx - 80, y, s.label, {
        fontSize: '16px', color: '#718096', fontFamily: '"PingFang SC", sans-serif',
      }).setOrigin(0, 0.5);
      this.add.text(cx + 80, y, s.value, {
        fontSize: '18px', color: (s as any).color || '#2D3748', fontFamily: 'sans-serif',
      }).setOrigin(0, 0.5);
    });

    // Progress to next pet level
    const petSave = SAVE.load();
    const xp = petSave.pet.xp;
    const levelLabel = petSave.pet.level === 'baby' ? '幼体' : petSave.pet.level === 'adult' ? '成体' : '完全体';
    const nextXP = petSave.pet.level === 'baby' ? 100 : petSave.pet.level === 'adult' ? 300 : 500;

    this.add.text(cx, 456, `宠物经验: ${xp}/${nextXP} XP  (${levelLabel})`, {
      fontSize: '13px', color: '#718096', fontFamily: '"PingFang SC", sans-serif',
    }).setOrigin(0.5);

    // Buttons
    this.drawSummaryButton(cx - 75, 520, '🔄 再来一轮', COLORS.primary, () => {
      AudioEngine.click();
      this.scene.restart();
    });
    this.drawSummaryButton(cx + 75, 520, '🏠 回家', COLORS.accent, () => {
      AudioEngine.click();
      this.scene.start('Home');
    });
  }

  private drawSummaryButton(x: number, y: number, label: string, color: number, cb: () => void) {
    const btn = this.add.graphics();
    btn.fillStyle(color, 1);
    btn.fillRoundedRect(x - 65, y - 22, 130, 44, 22);
    const txt = this.add.text(x, y, label, {
      fontSize: '15px', color: color === COLORS.accent ? '#2D3748' : '#FFF',
      fontFamily: '"PingFang SC", sans-serif',
    }).setOrigin(0.5);
    btn.setInteractive(
      new Phaser.Geom.Rectangle(x - 65, y - 22, 130, 44),
      Phaser.Geom.Rectangle.Contains,
    );
    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, txt], scaleX: 0.92, scaleY: 0.92,
        duration: 80, yoyo: true,
      });
      cb();
    });
  }
}
