import * as Phaser from 'phaser';


export class Particles {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    // Using Phaser's particle system with particle texture
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(8, 12, 8);
    graphics.generateTexture('particle', 16, 24);
    graphics.destroy();

    // Heart shape sprite
    const hg = scene.add.graphics();
    hg.fillStyle(0xff69b4, 1);
    hg.fillCircle(8, 8, 6);
    hg.fillCircle(20, 8, 6);
    hg.fillTriangle(2, 10, 26, 10, 14, 22);
    hg.generateTexture('heart_p', 28, 24);
    hg.destroy();

    // Food trail particle
    const fg = scene.add.graphics();
    fg.fillStyle(0xff6b6b, 1);
    fg.fillCircle(6, 6, 6);
    fg.generateTexture('apple_t', 12, 12);
    fg.destroy();

    this.emitter = scene.add.particles(0, 0, 'particle', {
      speed: { min: 20, max: 80 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 600,
      frequency: -1,
      blendMode: Phaser.BlendModes.ADD,
    });
  }

  emitHeart(x: number, y: number) {
    const scene = this.emitter.scene;
    const heart = scene.add.text(x, y, '💖', { fontSize: '20px' }).setOrigin(0.5);
    scene.tweens.add({
      targets: heart,
      y: y - 60,
      alpha: 0,
      scale: 0.5,
      duration: 800,
      onComplete: () => heart.destroy(),
    });
  }

  emitStars(x: number, y: number, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 40 + Math.random() * 30;
      const p = this.emitter.scene.add.circle(x, y, 3, 0xFFD700);
      this.emitter.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 500,
        onComplete: () => p.destroy(),
      });
    }
  }

  emitFoodTrail(x: number, y: number) {
    const scene = this.emitter.scene;
    for (let i = 0; i < 3; i++) {
      const t = scene.add.text(x + Math.random() * 30, y, '🍎', { fontSize: '16px' }).setOrigin(0.5);
      scene.tweens.add({
        targets: t,
        x: x + 80 + Math.random() * 50,
        y: y - 60,
        alpha: 0,
        duration: 600,
        delay: i * 80,
        onComplete: () => t.destroy(),
      });
    }
  }
}
