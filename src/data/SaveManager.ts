import { SAVE_KEY, MAX_HUNGER, MIN_HUNGER_FOR_HAPPY, MIN_HUNGER_FOR_NORMAL, MIN_HUNGER_FOR_LOW, HUNGER_DECAY_PER_HOUR, XP_PER_WORD, XP_PERFECT_BONUS, XP_PET_ADULT, XP_PET_FULL } from '../config';
import type { SaveData } from './Types';

function createDefaultSave(): SaveData {
  return {
    version: 1,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    totalWordsLearned: 0,
    foodCount: 10,
    heartCount: 0,
    dailyStreak: 0,
    lastCheckin: '',
    currentPet: 'cloudy',
    unlockedPets: ['cloudy'],
    cosmetics: [{}],
    studyProgress: [],
    achievements: [],
    checkins: [],
    settings: { volume: 0.6, dailyGoal: 20 },
    pet: {
      type: 'cloudy',
      hunger: 70,
      xp: 0,
      level: 'baby',
      lastFedAt: Date.now(),
    },
  };
}

function migrateSave(parsed: any): SaveData {
  const def = createDefaultSave();
  const save: SaveData = {
    ...def,
    ...parsed,
    settings: { ...def.settings, ...(parsed.settings || {}) },
    pet: { ...def.pet, ...(parsed.pet || {}), type: parsed.currentPet || 'cloudy' },
  };
  if (!save.pet.lastFedAt) save.pet.lastFedAt = Date.now();
  if (save.pet.xp === undefined) save.pet.xp = 0;
  if (!save.pet.level) save.pet.level = 'baby';
  if (save.pet.hunger === undefined || save.pet.hunger === null) save.pet.hunger = 70;
  return save;
}

export const SAVE = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === 1) return migrateSave(parsed);
      }
    } catch (e) {
      console.warn('Save load failed:', e);
    }
    const def = createDefaultSave();
    this.write(def);
    return def;
  },

  write(save: SaveData): void {
    try {
      save.lastLogin = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
      console.warn('Save write failed:', e);
    }
  },

  applyHungerDecay(save: SaveData): SaveData {
    const now = Date.now();
    const lastFed = save.pet.lastFedAt;
    const hoursElapsed = (now - lastFed) / (1000 * 60 * 60);
    if (hoursElapsed >= 1) {
      const decayAmount = Math.floor(hoursElapsed) * HUNGER_DECAY_PER_HOUR;
      save.pet.hunger = Math.max(0, save.pet.hunger - decayAmount);
      save.pet.lastFedAt = lastFed + Math.floor(hoursElapsed) * 3600000;
      this.write(save);
    }
    return save;
  },

  feed(save: SaveData, amount: number, foodCost: number): boolean {
    if (save.foodCount < foodCost) return false;
    save.foodCount -= foodCost;
    save.pet.hunger = Math.min(MAX_HUNGER, save.pet.hunger + amount);
    save.pet.lastFedAt = Date.now();
    this.write(save);
    return true;
  },

  addFood(save: SaveData, amount: number): number {
    save.foodCount = Math.max(0, save.foodCount + amount);
    this.write(save);
    return save.foodCount;
  },

  addXP(save: SaveData, xp: number): { evolved: boolean; newLevel: string } {
    save.pet.xp += xp;
    const oldLevel = save.pet.level;
    if (save.pet.xp >= XP_PET_FULL) {
      save.pet.level = 'full';
    } else if (save.pet.xp >= XP_PET_ADULT) {
      save.pet.level = 'adult';
    } else {
      save.pet.level = 'baby';
    }
    this.write(save);
    return { evolved: save.pet.level !== oldLevel, newLevel: save.pet.level };
  },

  unlockPet(save: SaveData, petType: string): boolean {
    if (save.unlockedPets.indexOf(petType) !== -1) return false;
    save.unlockedPets.push(petType);
    this.write(save);
    return true;
  },

  switchPet(save: SaveData, petType: string): boolean {
    if (save.unlockedPets.indexOf(petType) === -1) return false;
    save.currentPet = petType;
    save.pet.type = petType;
    this.write(save);
    return true;
  },

  getStudyProgress(save: SaveData, wordId: string) {
    return save.studyProgress.find(p => p.wordId === wordId);
  },

  updateStudyProgress(save: SaveData, progress: SaveData['studyProgress'][0]): void {
    const idx = save.studyProgress.findIndex(p => p.wordId === progress.wordId);
    if (idx >= 0) save.studyProgress[idx] = progress;
    else save.studyProgress.push(progress);
    this.write(save);
  },

  addCheckIn(save: SaveData, entry: SaveData['checkins'][0]): void {
    save.checkins.push(entry);
    if (save.checkins.length > 30) save.checkins.shift();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (save.lastCheckin === yesterday) {
      save.dailyStreak += 1;
    } else if (save.lastCheckin !== today) {
      save.dailyStreak = 1;
    }
    save.lastCheckin = today;
    this.write(save);
  },

  endStudySession(save: SaveData, wordsLearned: number, correct: number, wrong: number, foodEarned: number): void {
    save.totalWordsLearned += wordsLearned;
    save.foodCount += foodEarned;
    save.checkins.push({
      date: new Date().toISOString().slice(0, 10),
      wordsLearned,
      correct,
      wrong,
      earnedFood: foodEarned,
    });
    const xpGained = wordsLearned * XP_PER_WORD + correct * XP_PERFECT_BONUS;
    this.addXP(save, xpGained);
    this.write(save);
  },
};
