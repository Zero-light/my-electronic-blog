/**
 * GradientBg — 动态流动渐变背景
 * 两层叠加：冰蓝光斑 + 粉紫光斑，缓慢反向漂移
 * 鼠标移动时加速偏移（模拟环境光跟随）
 */
import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config';

export class GradientBg {
  private layer1: Phaser.GameObjects.Graphics;
  private layer2: Phaser.GameObjects.Graphics;
  private offsetX = 0;
  private offsetY = 0;
  private parallaxX = 0;
  private parallaxY = 0;

  constructor(private scene: Phaser.Scene) {
    this.layer1 = scene.add.graphics().setDepth(-10);
    this.layer2 = scene.add.graphics().setDepth(-9);
    this.render();

    // Slow drift animation
    scene.tweens.addCounter({
      from: 0,
      to: Math.PI * 2,
      duration: 12000,
      repeat: -1,
      onUpdate: (tween) => {
        const v = tween.getValue();
        this.offsetX = Math.sin(v * 0.7) * 30;
        this.offsetY = Math.cos(v * 0.5) * 25;
        this.render();
      },
    });

    // Mouse parallax
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const cx = GAME_WIDTH / 2;
      const cy = GAME_HEIGHT / 2;
      this.parallaxX = ((pointer.x - cx) / cx) * 16;
      this.parallaxY = ((pointer.y - cy) / cy) * 12;
    });
  }

  private render() {
    this.layer1.clear();
    this.layer2.clear();

    const cx1 = GAME_WIDTH * 0.25 + this.offsetX + this.parallaxX;
    const cy1 = GAME_HEIGHT * 0.3 + this.offsetY + this.parallaxY;
    const cx2 = GAME_WIDTH * 0.75 - this.offsetX - this.parallaxX * 0.7;
    const cy2 = GAME_HEIGHT * 0.7 - this.offsetY - this.parallaxY * 0.7;

    // Layer 1: Ice blue radial glow
    this.layer1.fillGradientStyle(COLORS.bgIce, COLORS.bgIce, 0xFFFFFF, 0xFFFFFF, 0.5);
    this.layer1.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Soft spotlight — ice blue
    this.layer1.fillStyle(COLORS.bgIce, 0.4);
    this.layer1.fillCircle(cx1, cy1, 350);

    // Layer 2: Pink-purple glow
    this.layer2.fillStyle(COLORS.bgPink, 0.25);
    this.layer2.fillCircle(cx2, cy2, 280);
    this.layer2.fillStyle(0xE8D5F5, 0.15);
    this.layer2.fillCircle(cx2 + 60, cy2 - 40, 180);
  }

  /** Call this when scene changes */
  destroy() {
    this.layer1.destroy();
    this.layer2.destroy();
  }
}
