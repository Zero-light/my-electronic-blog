/**
 * GlassButton — 液态玻璃果冻回弹按钮
 * hover: 上浮 + 放大 + 发光扩散
 * click: 下沉 → 果冻回弹
 */
import * as Phaser from 'phaser';
import { GLASS, COLORS } from '../config';
import { drawGlassPanel } from './GlassPanel';

export type ButtonVariant = 'primary' | 'feed' | 'shop' | 'back';

interface GlassButtonConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
  onHover?: () => void;
  fontSize?: number;
}

const VARIANT_COLORS: Record<ButtonVariant, number> = {
  primary: COLORS.primary,
  feed:    0x7ECB9A,
  shop:    0xFFD4C4,
  back:    COLORS.primaryDark,
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  feed:    '#FFFFFF',
  shop:    '#3D3D5C',
  back:    '#FFFFFF',
};

export function createGlassButton(cfg: GlassButtonConfig): Phaser.GameObjects.Container {
  const { scene, x, y, width, height, label, onClick, onHover } = cfg;
  const variant = cfg.variant ?? 'primary';
  const fontSize = cfg.fontSize ?? 17;
  const r = height / 2;

  const color = VARIANT_COLORS[variant];
  const textColor = VARIANT_TEXT[variant];

  const container = scene.add.container(x, y);
  container.setSize(width, height);

  // Background graphics
  const bg = scene.add.graphics();
  container.add(bg);

  function drawNormal() {
    bg.clear();
    // Shadow
    bg.fillStyle(0x000000, 0.06);
    bg.fillRoundedRect(-width / 2 + 1, -height / 2 + 2, width, height, r);
    // Main fill — colored + glass overlay
    bg.fillStyle(color, 0.65);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, r);
    // Glass top highlight
    bg.fillStyle(COLORS.white, 0.3);
    bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 1, width - 8, height * 0.4, { tl: r - 2, tr: r - 2, bl: 4, br: 4 });
    // Border
    bg.lineStyle(1, COLORS.white, 0.35);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, r);
  }

  function drawHover() {
    bg.clear();
    // Larger shadow
    bg.fillStyle(0x000000, 0.1);
    bg.fillRoundedRect(-width / 2 + 2, -height / 2 + 4, width, height, r);
    // Brighter fill
    bg.fillStyle(color, 0.78);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, r);
    // Stronger highlight
    bg.fillStyle(COLORS.white, 0.45);
    bg.fillRoundedRect(-width / 2 + 4, -height / 2 + 1, width - 8, height * 0.4, { tl: r - 2, tr: r - 2, bl: 4, br: 4 });
    // Glow border
    bg.lineStyle(1.5, COLORS.white, 0.6);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, r);
  }

  drawNormal();

  // Label
  const txt = scene.add.text(0, 0, label, {
    fontFamily: 'Inter, "PingFang SC", sans-serif',
    fontSize: `${fontSize}px`,
    color: textColor,
    fontStyle: '600',
  }).setOrigin(0.5);
  container.add(txt);

  // Hit area
  const hitZone = scene.add.rectangle(0, 0, width, height, 0x000000, 0)
    .setInteractive({ useHandCursor: true });
  container.add(hitZone);

  hitZone.on('pointerover', () => {
    drawHover();
    scene.tweens.add({ targets: container, scaleX: 1.03, scaleY: 1.03, duration: 180, ease: 'Sine.easeOut' });
    if (onHover) onHover();
  });

  hitZone.on('pointerout', () => {
    drawNormal();
    scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 200, ease: 'Sine.easeOut' });
  });

  hitZone.on('pointerdown', () => {
    scene.tweens.add({
      targets: container,
      scaleX: 0.94, scaleY: 0.94,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        scene.tweens.add({
          targets: container,
          scaleX: 1.03, scaleY: 1.03,
          duration: 120,
          yoyo: true,
          ease: 'Back.easeOut',
          onComplete: () => {
            scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 150, ease: 'Sine.easeOut' });
          },
        });
      },
    });
    onClick();
  });

  return container;
}
