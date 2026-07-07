// WordPal Type Definitions

export interface WordEntry {
  id: string; word: string; phonetic: string; meaning: string;
  example?: string; exampleTranslation?: string; tags?: string[];
}

export interface WordPack {
  id: string; name: string; description: string; file: string; totalWords: number;
}

export interface PetState {
  type: string; hunger: number; xp: number;
  level: 'baby' | 'adult' | 'full'; lastFedAt: number; food?: number;
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

export interface WeeklyStat {
  date: string; words: number; correct: number;
}

export interface ShopItem {
  id: string; category: 'hat' | 'skin' | 'background' | 'bubble';
  name: string; icon: string; price: number; preview: string;
}

export interface OfflineReward {
  lastLogin: number; offlineHours: number; hungerRecovered: number; bonusApples: number;
}

export interface SaveData {
  version: number; createdAt: number; lastLogin: number;
  totalWordsLearned: number; foodCount: number; heartCount: number;
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
}

export type FoodType = 'normal' | 'silver' | 'gold' | 'comfort';

export type PetType = 'cloudy' | 'berry' | 'mochi' | 'pepper' | 'tangerine';
