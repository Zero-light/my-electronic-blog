// WordPal Global Configuration

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const COLORS = {
  bg:        0xE8F0FF,
  primary:   0x7C9CF8,
  secondary: 0xB8E6FF,
  accent:    0xFFE5F1,
  correct:   0x77DD77,
  wrong:     0xFFD93D,
  textDark:  0x2D3748,
  textLight: 0x718096,
  white:     0xFFFFFF,
  black:     0x000000,
} as const;

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
  cloudy:    { id: 'cloudy',    name: 'Cloudy',    nameZh: '云小逗', primaryColor: 0xA8D8EA, secondaryColor: 0xD4EEF1, description: '像云朵一样软乎乎的，懒懒的表情' },
  berry:     { id: 'berry',     name: 'Berry',     nameZh: '莓莓',   primaryColor: 0xFFB5C5, secondaryColor: 0xFFE0E6, description: '草莓小熊造型，憨厚爱吃蜂蜜' },
  mochi:     { id: 'mochi',     name: 'Mochi',     nameZh: '麻薯',   primaryColor: 0xF5E6CA, secondaryColor: 0xFFF3E0, description: '圆滚滚的白团子，害羞的表情' },
  pepper:    { id: 'pepper',    name: 'Pepper',    nameZh: '小椒',   primaryColor: 0x5B5B5B, secondaryColor: 0x8A8A8A, description: '小柴犬造型，机灵敏捷' },
  tangerine: { id: 'tangerine', name: 'Tangerine', nameZh: '橘子',   primaryColor: 0xFDBE3F, secondaryColor: 0xFFE0A0, description: '小橘子造型，活泼好动' },
};

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

export const SAVE_KEY = 'wordpal.v1.save';
export const DAILY_GOAL_DEFAULT = 20;
