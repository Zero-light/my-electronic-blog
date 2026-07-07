/**
 * DailyTaskPanel — 每日任务悬浮卡片
 * 4 persistent tasks: check-in, learn words, review, feed pet
 */
import * as Phaser from 'phaser';
import { GAME_WIDTH, COLORS, GLASS } from '../config';
import { SAVE } from '../data/SaveManager';
import { drawGlassPanel } from './GlassPanel';
import { AudioEngine } from '../fx/Audio';

export interface TaskDef {
  id: string;
  label: string;
  icon: string;
  target: number;
  current: number;
  reward: number;
  done: boolean;
}

export class DailyTaskPanel {
  private container!: Phaser.GameObjects.Container;
  private taskTexts: Phaser.GameObjects.Text[] = [];
  private onAllDone?: () => void;

  constructor(
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
  ) {}

  create(tasks: TaskDef[], onAllDone?: () => void) {
    this.onAllDone = onAllDone;
    this.container = this.scene.add.container(this.x, this.y).setDepth(50);

    const bg = this.scene.add.graphics();
    drawGlassPanel(bg, { x: -160, y: 0, width: 320, height: 52, radius: 16 });
    this.container.add(bg);

    tasks.forEach((t, i) => {
      const tx = -140 + i * 72;
      const icon = this.scene.add.text(tx, 14, t.done ? '✅' : t.icon, {
        fontSize: '14px',
      }).setOrigin(0, 0.5);
      this.container.add(icon);

      const label = this.scene.add.text(tx + 16, 14, `${t.current}/${t.target}`, {
        fontSize: '10px', color: t.done ? '#7ECB9A' : COLORS.textSecondary,
        fontFamily: 'Inter, sans-serif', fontStyle: '500',
      }).setOrigin(0, 0.5);
      this.container.add(label);
      this.taskTexts.push(label);

      // Progress dot
      const dot = this.scene.add.graphics();
      dot.fillStyle(t.done ? 0x7ECB9A : COLORS.white, t.done ? 0.8 : 0.2);
      dot.fillCircle(tx + 8, 40, 3);
      this.container.add(dot);
    });

    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container, alpha: 1, y: this.y + 4,
      duration: 400, ease: 'Sine.easeOut',
    });
  }

  updateTask(index: number, current: number, done: boolean) {
    if (index < this.taskTexts.length) {
      const t = this.taskTexts[index];
      t.setText(done ? '✓' : `${current}/${t.text.includes('/') ? t.text.split('/')[1] : '?'}`);
      t.setColor(done ? '#7ECB9A' : COLORS.textSecondary);
    }

    const allDone = this.taskTexts.every((_, i) => {
      return this.taskTexts[i].text === '✓';
    });
    if (allDone && this.onAllDone) this.onAllDone();
  }

  destroy() {
    this.container?.destroy();
  }
}

/** Generate today's default tasks */
export function getDailyTasks(save: ReturnType<typeof SAVE.load>): TaskDef[] {
  const todayStats = SAVE.getTodayStats(save);
  return [
    { id: 'checkin', label: '打卡', icon: '📅', target: 1, current: save.dailyStreak > 0 ? 1 : 0, reward: 2, done: save.lastCheckin === new Date().toISOString().slice(0, 10) },
    { id: 'learn', label: '学习', icon: '📖', target: 20, current: todayStats.words, reward: 5, done: todayStats.words >= 20 },
    { id: 'review', label: '复习', icon: '🔄', target: 5, current: Math.min(todayStats.words, 5), reward: 3, done: todayStats.words >= 5 },
    { id: 'feed', label: '喂食', icon: '🍎', target: 1, current: save.pet.hunger >= 80 ? 1 : 0, reward: 3, done: save.pet.hunger >= 80 },
  ];
}
