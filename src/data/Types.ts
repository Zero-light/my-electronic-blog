// WordPal Type Definitions

export interface WordEntry {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  tags?: string[];
}

export interface WordPack {
  id: string;
  name: string;
  description: string;
  file: string;
  totalWords: number;
}

export interface PetState {
  type: string;
  hunger: number;
  xp: number;
  level: 'baby' | 'adult' | 'full';
  lastFedAt: number;
  food?: number;
}

export interface PetOutfit {
  hat?: string;
  accessory?: string;
  color?: string;
  background?: string;
}

export interface StudyProgress {
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  lastReview: string;
  rating: number;
  reviewCount: number;
}

export interface DailyCheckIn {
  date: string;
  wordsLearned: number;
  correct: number;
  wrong: number;
  earnedFood: number;
}

// ── New Game Systems ──────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface DailyTask {
  id: string;
  label: string;
  target: number;
  current: number;
  reward: number; // apples
  done: boolean;
}

export interface WeeklyStat {
  date: string;
  words: number;
  correct: number;
}

export interface ShopItem {
  id: string;
  category: 'hat' | 'skin' | 'background' | 'bubble';
  name: string;
  icon: string;
  price: number;
  preview: string; // emoji or tint color
}

export interface OfflineReward {
  lastLogin: number;
  offlineHours: number;
  hungerRecovered: number;
  bonusApples: number;
}

// ── Full SaveData ─────────────────────────────────────────

export interface SaveData {
  version: number;
  createdAt: number;
  lastLogin: number;
  totalWordsLearned: number;
  foodCount: number;
  heartCount: number;
  dailyStreak: number;
  lastCheckin: string;
  currentPet: string;
  unlockedPets: string[];
  cosmetics: PetOutfit[];
  studyProgress: StudyProgress[];
  achievements: string[];
  checkins: DailyCheckIn[];
  settings: {
    volume: number;
    dailyGoal: number;
  };
  pet: PetState;
  // Extended
  xp?: number;
  dailyCorrect?: number;
  dailyWrong?: number;
  // New systems
  ownedItems: string[];
  equippedItems: { hat?: string; skin?: string; background?: string; bubble?: string };
  weeklyStats: WeeklyStat[];
  dailyWordBank: string[]; // word IDs for today's session
  lastDailyRefresh: string;
  offlineRewards: OfflineReward | null;
}

export interface StudyBatch {
  word: WordEntry;
  progress?: StudyProgress;
}

export type FoodType = 'normal' | 'silver' | 'gold' | 'comfort';
