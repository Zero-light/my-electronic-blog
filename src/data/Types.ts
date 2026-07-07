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
  // Extended fields for runtime use
  xp?: number;
  dailyCorrect?: number;
  dailyWrong?: number;
}

export interface StudyBatch {
  word: WordEntry;
  progress?: StudyProgress;
}

export type FoodType = 'normal' | 'silver' | 'gold' | 'comfort';
