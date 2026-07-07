/**
 * GlassPanel — 液态玻璃面板组件
 * 多层绘制：底层柔光阴影 + 半透明填充 + 顶边高光 + 细白边框
 */
import * as Phaser from 'phaser';
import { GLASS, COLORS } from '../config';

export interface GlassPanelConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  alpha?: number;
  borderAlpha?: number;
}

export function drawGlassPanel(
  g: Phaser.GameObjects.Graphics,
  cfg: GlassPanelConfig
): void {
  const r = cfg.radius ?? GLASS.cornerRadius;
  const a = cfg.alpha ?? GLASS.fillAlpha;
  const ba = cfg.borderAlpha ?? GLASS.borderAlpha;

  g.clear();

  // 1. Soft shadow layer (offset down + right)
  g.fillStyle(0x000000, GLASS.shadowAlpha);
  g.fillRoundedRect(cfg.x + GLASS.shadowOffset, cfg.y + GLASS.shadowOffset, cfg.width, cfg.height, r);

  // 2. Main fill — semi-transparent white
  g.fillStyle(COLORS.white, a);
  g.fillRoundedRect(cfg.x, cfg.y, cfg.width, cfg.height, r);

  // 3. Top-edge highlight (light catch)
  g.fillStyle(COLORS.white, GLASS.highlightAlpha);
  g.fillRoundedRect(cfg.x + 4, cfg.y + 2, cfg.width - 8, cfg.height * 0.35, { tl: r - 2, tr: r - 2, bl: 6, br: 6 });

  // 4. Border — thin white semi-transparent
  g.lineStyle(GLASS.borderWidth, COLORS.white, ba);
  g.strokeRoundedRect(cfg.x, cfg.y, cfg.width, cfg.height, r);
}

/** Shorthand: create a Graphics object and draw glass panel on it, return the Graphics */
export function createGlassPanel(
  scene: Phaser.Scene,
  cfg: GlassPanelConfig
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setDepth(cfg.alpha ?? 1);
  drawGlassPanel(g, cfg);
  return g;
}
