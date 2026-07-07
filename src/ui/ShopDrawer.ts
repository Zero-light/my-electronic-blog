/**
 * ShopDrawer — 装扮商城侧边抽屉 + Achievements wall
 * Slides in from right, shows cosmetics for purchase
 */
import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, GLASS } from '../config';
import { SAVE } from '../data/SaveManager';
import type { ShopItem } from '../data/Types';
import { drawGlassPanel } from './GlassPanel';
import { createGlassButton } from './GlassButton';
import { AudioEngine } from '../fx/Audio';

// ── Shop Catalog ──────────────────────────────────────────
export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat_crown', category: 'hat', name: '小王冠', icon: '👑', price: 15, preview: '👑' },
  { id: 'hat_flower', category: 'hat', name: '小花', icon: '🌸', price: 8, preview: '🌸' },
  { id: 'hat_ribbon', category: 'hat', name: '蝴蝶结', icon: '🎀', price: 10, preview: '🎀' },
  { id: 'hat_cap', category: 'hat', name: '棒球帽', icon: '🧢', price: 12, preview: '🧢' },
  // Skins (tint colors)
  { id: 'skin_lavender', category: 'skin', name: '薰衣草紫', icon: '💜', price: 20, preview: '💜' },
  { id: 'skin_mint', category: 'skin', name: '薄荷绿', icon: '💚', price: 20, preview: '💚' },
  { id: 'skin_coral', category: 'skin', name: '珊瑚橙', icon: '🧡', price: 20, preview: '🧡' },
  // Backgrounds
  { id: 'bg_stars', category: 'background', name: '星空', icon: '🌟', price: 25, preview: '🌟' },
  { id: 'bg_ocean', category: 'background', name: '海洋', icon: '🌊', price: 25, preview: '🌊' },
  { id: 'bg_forest', category: 'background', name: '森林', icon: '🌲', price: 25, preview: '🌲' },
  // Bubbles
  { id: 'bubble_uwu', category: 'bubble', name: '卖萌台词', icon: '💬', price: 5, preview: '"加油哦~"' },
  { id: 'bubble_cool', category: 'bubble', name: '酷酷台词', icon: '😎', price: 5, preview: '"背单词吧!"' },
  { id: 'bubble_sleepy', category: 'bubble', name: '犯困台词', icon: '😴', price: 5, preview: '"zzz...学了..."' },
];

// ── Shop Drawer ───────────────────────────────────────────
export class ShopDrawer {
  private container!: Phaser.GameObjects.Container;
  private mask!: Phaser.GameObjects.Graphics;
  private categoryTabs: Phaser.GameObjects.Text[] = [];
  private currentCategory: string = 'hat';
  private itemCards: Phaser.GameObjects.Graphics[] = [];
  private isOpen = false;

  constructor(private scene: Phaser.Scene) {}

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    const save = SAVE.load();

    // Dim background mask
    this.mask = this.scene.add.graphics().setDepth(90);
    this.mask.fillStyle(0x000000, 0.3);
    this.mask.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.mask.setInteractive(new Phaser.Geom.Rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT), Phaser.Geom.Rectangle.Contains);
    this.mask.on('pointerdown', () => this.close());

    // Drawer container
    const drawerW = 360;
    this.container = this.scene.add.container(GAME_WIDTH + drawerW, 0).setDepth(100);

    // Drawer bg
    const bg = this.scene.add.graphics();
    bg.fillStyle(0xFFFFFF, 0.06);
    bg.fillRect(0, 0, drawerW, GAME_HEIGHT);
    drawGlassPanel(bg, { x: 8, y: 20, width: drawerW - 16, height: GAME_HEIGHT - 40, radius: 24 });
    this.container.add(bg);

    // Title
    const title = this.scene.add.text(drawerW / 2, 50, '🛍 装扮商城', {
      fontSize: '20px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '700',
    }).setOrigin(0.5);
    this.container.add(title);

    // Close button
    const closeBtn = this.scene.add.text(drawerW - 30, 30, '✕', {
      fontSize: '18px', color: COLORS.textSecondary, fontFamily: 'Inter, sans-serif',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.close());
    this.container.add(closeBtn);

    // Category tabs
    const categories = [
      { id: 'hat', label: '头饰' },
      { id: 'skin', label: '皮肤' },
      { id: 'background', label: '背景' },
      { id: 'bubble', label: '台词' },
    ];
    this.categoryTabs = categories.map((cat, i) => {
      const tab = this.scene.add.text(30 + i * 85, 85, cat.label, {
        fontSize: '14px', color: this.currentCategory === cat.id ? COLORS.textMain : COLORS.textMuted,
        fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '600',
      }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
      tab.on('pointerdown', () => {
        this.currentCategory = cat.id;
        this.renderItems(save);
      });
      this.container.add(tab);
      return tab;
    });

    // Food counter
    this.addFoodDisplay(save);

    // Items grid
    this.renderItems(save);

    // Slide in
    this.scene.tweens.add({
      targets: this.container, x: GAME_WIDTH - drawerW,
      duration: 350, ease: 'Power3.easeOut',
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.scene.tweens.add({
      targets: this.container, x: GAME_WIDTH + 360,
      duration: 300, ease: 'Power3.easeIn',
      onComplete: () => {
        this.container?.destroy();
        this.mask?.destroy();
        this.itemCards = [];
      },
    });
  }

  private addFoodDisplay(save: ReturnType<typeof SAVE.load>) {
    const foodLabel = this.scene.add.text(30, 110, `🍎 x${save.foodCount}`, {
      fontSize: '14px', color: COLORS.textSecondary, fontFamily: 'Inter, sans-serif', fontStyle: '600',
    });
    this.container.add(foodLabel);
  }

  private renderItems(save: ReturnType<typeof SAVE.load>) {
    // Clear old
    this.itemCards.forEach(c => c.destroy());
    this.itemCards = [];

    const items = SHOP_ITEMS.filter(it => it.category === this.currentCategory);
    const drawerW = 360;
    const startY = 140;

    // Update tabs
    this.categoryTabs.forEach(tab => {
      (tab as Phaser.GameObjects.Text).setColor(
        this.currentCategory === (tab as any).category ? COLORS.textMain : COLORS.textMuted
      );
    });

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ix = 25 + col * 155;
      const iy = startY + row * 100;

      const owned = save.ownedItems.indexOf(item.id) !== -1;

      const card = this.scene.add.graphics();
      drawGlassPanel(card, { x: ix, y: iy, width: 148, height: 88, radius: 14, alpha: owned ? 0.1 : 0.16 });
      this.container.add(card);
      this.itemCards.push(card);

      // Icon
      this.container.add(
        this.scene.add.text(ix + 14, iy + 14, item.icon, { fontSize: '20px' })
      );

      // Name
      this.container.add(
        this.scene.add.text(ix + 44, iy + 12, item.name, {
          fontSize: '13px', color: COLORS.textMain, fontFamily: 'Inter, "PingFang SC", sans-serif', fontStyle: '600',
        })
      );

      if (owned) {
        this.container.add(
          this.scene.add.text(ix + 44, iy + 34, '已拥有', {
            fontSize: '11px', color: '#7ECB9A', fontFamily: 'Inter, sans-serif', fontStyle: '500',
          })
        );
      } else {
        const priceLabel = this.scene.add.text(ix + 44, iy + 34, `🍎 ${item.price}`, {
          fontSize: '12px', color: COLORS.textSecondary, fontFamily: 'Inter, sans-serif', fontStyle: '500',
        }).setInteractive({ useHandCursor: true });
        priceLabel.on('pointerdown', () => {
          if (SAVE.buyItem(save, item)) {
            AudioEngine.correct();
            SAVE.equipItem(save, item);
            this.close();
          } else {
            AudioEngine.wrong();
            const warn = this.scene.add.text(ix + 74, iy + 54, '不够!', {
              fontSize: '11px', color: '#FF8C69', fontFamily: 'Inter, sans-serif',
            }).setOrigin(0.5);
            this.container.add(warn);
            this.scene.tweens.add({
              targets: warn, alpha: 0, y: iy + 44, duration: 1000, onComplete: () => warn.destroy(),
            });
          }
        });
        this.container.add(priceLabel);
      }
    });
  }
}
