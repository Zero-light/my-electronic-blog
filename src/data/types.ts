// WordPal Type Definitions

export interface WordEntry {
  id: string; word: string; phonetic: string; meaning: string;
  example?: string; exampleTranslation?: string; tags?: string[];
}
export interface WordPack {
  id: string; name: string; description: string; file: string; totalWords: number;
}

export interface PetState {
  type: string; hunger: number; happiness: number; xp: number;
  level: 'egg' | 'baby' | 'growth' | 'mature' | 'perfect';
  lastFedAt: number; lastPetAt: number;
}
export interface StudyProgress {
  wordId: string; easeFactor: number; intervalDays: number;
  lastReview: string; rating: number; reviewCount: number;
}
export interface DailyCheckIn {
  date: string; wordsLearned: number; correct: number; wrong: number; earnedFood: number;
}
export interface Achievement {
  id: string; name: string; description: string; icon: string; unlockedAt?: number;
}
export interface DailyTask {
  id: string; label: string; target: number; current: number; reward: number; done: boolean;
}
export interface WeeklyStat { date: string; words: number; correct: number; }

export interface ShopItem {
  id: string; category: 'hat' | 'skin' | 'background' | 'bubble';
  name: string; icon: string; price: number; priceType?: 'apple' | 'diamond';
  preview: string; tintColor?: string;
}

export interface OfflineReward {
  lastLogin: number; offlineHours: number; hungerRecovered: number; bonusApples: number;
}

export interface StreakReward {
  tier: 1 | 2 | 3; // 3d flame, 7d chest, 30d legendary
  claimed: boolean;
  itemId?: string;
}

export interface SaveData {
  version: number; createdAt: number; lastLogin: number;
  totalWordsLearned: number; totalWordsReviewed: number; foodCount: number;
  diamonds: number; // rare currency from achievements/streaks
  dailyStreak: number; lastCheckin: string;
  currentPet: string; unlockedPets: string[];
  cosmetics: { petId?: string; hat?: string; tie?: string; color?: string; background?: string }[];
  studyProgress: StudyProgress[];
  achievements: string[]; checkins: DailyCheckIn[];
  settings: { volume: number; dailyGoal: number };
  pet: PetState;
  xp?: number; dailyCorrect?: number; dailyWrong?: number;
  ownedItems: string[];
  equippedItems: { hat?: string; skin?: string; background?: string; bubble?: string };
  weeklyStats: WeeklyStat[];
  dailyWordBank: string[];
  lastDailyRefresh: string;
  offlineRewards: OfflineReward | null;
  streakRewards: StreakReward[];
}

export type FoodType = 'normal' | 'silver' | 'gold' | 'comfort';
export type PetType = 'cloudy' | 'berry' | 'mochi' | 'pepper' | 'tangerine';
export type PetLevel = 'egg' | 'baby' | 'growth' | 'mature' | 'perfect';
