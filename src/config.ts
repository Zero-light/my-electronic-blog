// WordPal Global Configuration — Macaron Glass-Morphism Palette

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// ── Macaron Color Palette ──────────────────────────────────
export const COLORS = {
  // Background gradient stops
  bgIce:      0xD6EAFA,  // 浅冰蓝
  bgPink:     0xFFE8EE,  // 淡粉紫

  // Primary
  primary:    0x8BB8D0,  // 冰蓝
  primaryDark: 0x6B9CB5, // 冰蓝深

  // Secondary
  secondary:  0xFFD4C4,  // 蜜桃粉

  // Accent (food / emphasis)
  accent:     0xFF8C69,  // 暖橙红

  // Feedback
  correct:    0x7ECB9A,  // 柔绿
  wrong:      0xFFB5A0,  // 柔橙

  // Glass surfaces
  glassCard:  0xFFFFFF,  // 白色基底（配合 alpha 使用）
  glassBorder: 0xFFFFFF, // 边框色（配合 alpha）

  // Text layers (hex strings for Phaser Text objects)
  textMain:   '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted:  'rgba(255,255,255,0.40)',

  // Legacy aliases
  textDark:   0x3D3D5C,
  textLight:  0x8B8BA6,
  white:      0xFFFFFF,
  black:      0x000000,
  bg:         0xD6EAFA,
} as const;

// ── Glass Constants ────────────────────────────────────────
export const GLASS = {
  cornerRadius: 24,
  borderWidth: 1,
  borderAlpha: 0.25,
  fillAlpha: 0.18,
  highlightAlpha: 0.35,  // 顶边高光
  shadowAlpha: 0.10,
  shadowOffset: 4,
  blurStrength: 3,
} as const;

// ── Pet Definitions ────────────────────────────────────────
export const PET_TYPES = ['cloudy', 'berry', 'mochi', 'pepper', 'tangerine'] as const;
export type PetType = typeof PET_TYPES[number];

export interface PetDefinition {
  id: PetType;
  name: string;
  nameZh: string;
  primaryColor: number;
  secondaryColor: number;
  description: string;
}

export const PET_DEFINITIONS: Record<PetType, PetDefinition> = {
  cloudy:    { id: 'cloudy',    name: 'Cloudy',    nameZh: '云小逗', primaryColor: 0xA8D8EA, secondaryColor: 0xD4EEF1, description: '像云朵一样软乎乎的' },
  berry:     { id: 'berry',     name: 'Berry',     nameZh: '莓莓',   primaryColor: 0xFFB5C5, secondaryColor: 0xFFE0E6, description: '草莓小熊，憨厚爱吃蜂蜜' },
  mochi:     { id: 'mochi',     name: 'Mochi',     nameZh: '麻薯',   primaryColor: 0xF5E6CA, secondaryColor: 0xFFF3E0, description: '圆滚滚的白团子' },
  pepper:    { id: 'pepper',    name: 'Pepper',    nameZh: '小椒',   primaryColor: 0x5B5B5B, secondaryColor: 0x8A8A8A, description: '小柴犬，机灵敏捷' },
  tangerine: { id: 'tangerine', name: 'Tangerine', nameZh: '橘子',   primaryColor: 0xFDBE3F, secondaryColor: 0xFFE0A0, description: '小橘子，活泼好动' },
};

// ── Gameplay Constants ─────────────────────────────────────
export const FOOD_VALUES = {
  normal: 5,
  silver: 8,
  gold: 15,
  comfort: 1,
} as const;

export const HUNGER_DECAY_PER_HOUR = 1;
export const MAX_HUNGER = 100;
export const MIN_HUNGER_FOR_HAPPY = 70;
export const MIN_HUNGER_FOR_NORMAL = 40;
export const MIN_HUNGER_FOR_LOW = 20;

export const XP_PER_WORD = 5;
export const XP_PERFECT_BONUS = 3;
export const XP_PET_ADULT = 100;
export const XP_PET_FULL = 300;

export const SAVE_KEY = 'wordpal.v2.save';
export const DAILY_GOAL_DEFAULT = 20;
