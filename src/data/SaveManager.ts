/**
 * SaveManager — localStorage persistence + all game systems
 */
import { SAVE_KEY, MAX_HUNGER, MIN_HUNGER_FOR_HAPPY, MIN_HUNGER_FOR_NORMAL, MIN_HUNGER_FOR_LOW, HUNGER_DECAY_PER_HOUR, XP_PER_WORD, XP_PERFECT_BONUS, XP_PET_ADULT, XP_PET_FULL } from '../config';
import type { SaveData, Achievement, DailyTask, ShopItem, OfflineReward, WeeklyStat } from './Types';

// ── Defaults ──────────────────────────────────────────────
function createDefaultSave(): SaveData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 2,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    totalWordsLearned: 0,
    foodCount: 10,
    heartCount: 0,
    dailyStreak: 0,
    lastCheckin: today,
    currentPet: 'cloudy',
    unlockedPets: ['cloudy'],
    cosmetics: [{}],
    studyProgress: [],
    achievements: [],
    checkins: [],
    settings: { volume: 0.6, dailyGoal: 20 },
    pet: { type: 'cloudy', hunger: 70, xp: 0, level: 'baby', lastFedAt: Date.now() },
    ownedItems: [],
    equippedItems: {},
    weeklyStats: [],
    dailyWordBank: [],
    lastDailyRefresh: today,
    offlineRewards: null,
  };
}

function migrateSave(parsed: any): SaveData {
  const def = createDefaultSave();
  const save: SaveData = {
    ...def, ...parsed,
    settings: { ...def.settings, ...(parsed.settings || {}) },
    pet: { ...def.pet, ...(parsed.pet || {}), type: parsed.currentPet || 'cloudy' },
    ownedItems: parsed.ownedItems || [],
    equippedItems: parsed.equippedItems || {},
    weeklyStats: parsed.weeklyStats || [],
    dailyWordBank: parsed.dailyWordBank || [],
    lastDailyRefresh: parsed.lastDailyRefresh || def.lastDailyRefresh,
    offlineRewards: parsed.offlineRewards || null,
  };
  if (!save.pet.lastFedAt) save.pet.lastFedAt = Date.now();
  if (save.pet.xp === undefined) save.pet.xp = 0;
  if (!save.pet.level) save.pet.level = 'baby';
  if (save.pet.hunger === undefined || save.pet.hunger === null) save.pet.hunger = 70;
  return save;
}

// ── Core Save/Load ────────────────────────────────────────
export const SAVE = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version >= 1) return migrateSave(parsed);
      }
    } catch (e) { console.warn('Save load failed:', e); }
    const def = createDefaultSave();
    this.write(def);
    return def;
  },

  write(save: SaveData): void {
    try {
      save.lastLogin = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) { console.warn('Save write failed:', e); }
  },

  // ── Hunger ─────────────────────────────────────────
  applyHungerDecay(save: SaveData): SaveData {
    const now = Date.now();
    const hoursElapsed = (now - save.pet.lastFedAt) / 3600000;
    if (hoursElapsed >= 1) {
      const decay = Math.floor(hoursElapsed) * HUNGER_DECAY_PER_HOUR;
      save.pet.hunger = Math.max(0, save.pet.hunger - decay);
      save.pet.lastFedAt = save.pet.lastFedAt + Math.floor(hoursElapsed) * 3600000;
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

  // ── XP & Level ─────────────────────────────────────
  addXP(save: SaveData, xp: number): { evolved: boolean; newLevel: string } {
    save.pet.xp += xp;
    const oldLevel = save.pet.level;
    if (save.pet.xp >= XP_PET_FULL) save.pet.level = 'full';
    else if (save.pet.xp >= XP_PET_ADULT) save.pet.level = 'adult';
    else save.pet.level = 'baby';
    this.write(save);
    return { evolved: save.pet.level !== oldLevel, newLevel: save.pet.level };
  },

  // ── Pets ───────────────────────────────────────────
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

  // ── Study Progress ─────────────────────────────────
  getStudyProgress(save: SaveData, wordId: string) {
    return save.studyProgress.find(p => p.wordId === wordId);
  },

  updateStudyProgress(save: SaveData, progress: SaveData['studyProgress'][0]): void {
    const idx = save.studyProgress.findIndex(p => p.wordId === progress.wordId);
    if (idx >= 0) save.studyProgress[idx] = progress;
    else save.studyProgress.push(progress);
    this.write(save);
  },

  // ── Check-in & Streak ──────────────────────────────
  addCheckIn(save: SaveData, entry: SaveData['checkins'][0]): void {
    save.checkins.push(entry);
    if (save.checkins.length > 30) save.checkins.shift();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (save.lastCheckin === yesterday) save.dailyStreak += 1;
    else if (save.lastCheckin !== today) save.dailyStreak = 1;
    save.lastCheckin = today;
    this.write(save);
  },

  endStudySession(save: SaveData, wordsLearned: number, correct: number, wrong: number, foodEarned: number): void {
    save.totalWordsLearned += wordsLearned;
    save.foodCount += foodEarned;
    save.checkins.push({
      date: new Date().toISOString().slice(0, 10),
      wordsLearned, correct, wrong, earnedFood: foodEarned,
    });
    const xpGained = wordsLearned * XP_PER_WORD + correct * XP_PERFECT_BONUS;
    this.addXP(save, xpGained);
    // Track weekly stats
    const today = new Date().toISOString().slice(0, 10);
    const weekStat = save.weeklyStats.find(s => s.date === today);
    if (weekStat) { weekStat.words += wordsLearned; weekStat.correct += correct; }
    else { save.weeklyStats.push({ date: today, words: wordsLearned, correct }); }
    if (save.weeklyStats.length > 7) save.weeklyStats.shift();
    this.write(save);
  },

  // ── Achievements ───────────────────────────────────
  unlockAchievement(save: SaveData, achievementId: string): boolean {
    if (save.achievements.indexOf(achievementId) !== -1) return false;
    save.achievements.push(achievementId);
    this.write(save);
    return true;
  },

  // ── Shop / Cosmetics ───────────────────────────────
  buyItem(save: SaveData, item: ShopItem): boolean {
    if (save.foodCount < item.price) return false;
    if (save.ownedItems.indexOf(item.id) !== -1) return false;
    save.foodCount -= item.price;
    save.ownedItems.push(item.id);
    this.write(save);
    return true;
  },

  equipItem(save: SaveData, item: ShopItem): void {
    save.equippedItems = save.equippedItems || {};
    (save.equippedItems as any)[item.category] = item.id;
    this.write(save);
  },

  // ── Daily Refresh ──────────────────────────────────
  refreshDaily(save: SaveData): SaveData {
    const today = new Date().toISOString().slice(0, 10);
    if (save.lastDailyRefresh !== today) {
      save.lastDailyRefresh = today;
      save.dailyWordBank = [];
      this.write(save);
    }
    return save;
  },

  // ── Offline Rewards ────────────────────────────────
  checkOffline(save: SaveData): OfflineReward | null {
    const now = Date.now();
    const hoursAway = Math.floor((now - save.lastLogin) / 3600000);
    if (hoursAway < 2) return null; // only trigger after 2+ hours

    const hungerRecovered = Math.min(30, Math.floor(hoursAway * 2));
    const bonusApples = Math.min(10, Math.floor(hoursAway * 0.5));
    save.pet.hunger = Math.min(MAX_HUNGER, save.pet.hunger + hungerRecovered);
    save.foodCount += bonusApples;

    const reward: OfflineReward = {
      lastLogin: save.lastLogin,
      offlineHours: hoursAway,
      hungerRecovered,
      bonusApples,
    };
    save.offlineRewards = reward;
    save.lastLogin = now;
    this.write(save);
    return reward;
  },

  // ── Statistics ─────────────────────────────────────
  getWeeklyStats(save: SaveData): WeeklyStat[] {
    return save.weeklyStats || [];
  },

  getTodayStats(save: SaveData): { words: number; correct: number } {
    const today = new Date().toISOString().slice(0, 10);
    const stat = save.weeklyStats.find(s => s.date === today);
    return stat ? { words: stat.words, correct: stat.correct } : { words: 0, correct: 0 };
  },
};
