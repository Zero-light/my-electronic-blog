/**
 * SaveManager — localStorage persistence
 */
import type { SaveData, ShopItem, OfflineReward, WeeklyStat } from './types';

const SAVE_KEY = 'wordpal.v2.save';
const MAX_HUNGER = 100;
const XP_PET_ADULT = 100;
const XP_PET_FULL = 300;

function createDefault(): SaveData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 2, createdAt: Date.now(), lastLogin: Date.now(),
    totalWordsLearned: 0, foodCount: 10, heartCount: 0,
    dailyStreak: 1, lastCheckin: today,
    currentPet: 'cloudy', unlockedPets: ['cloudy'],
    cosmetics: [{}], studyProgress: [], achievements: [], checkins: [],
    settings: { volume: 0.6, dailyGoal: 20 },
    pet: { type: 'cloudy', hunger: 70, xp: 0, level: 'baby', lastFedAt: Date.now() },
    ownedItems: [], equippedItems: {},
    weeklyStats: [], dailyWordBank: [], lastDailyRefresh: today,
    offlineRewards: null,
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const def = createDefault();
  saveWrite(def);
  return def;
}

export function saveWrite(save: SaveData) {
  try { save.lastLogin = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
  catch {}
}

export function applyHungerDecay(save: SaveData): SaveData {
  const now = Date.now();
  const hours = (now - save.pet.lastFedAt) / 3600000;
  if (hours >= 1) {
    save.pet.hunger = Math.max(0, save.pet.hunger - Math.floor(hours));
    save.pet.lastFedAt = save.pet.lastFedAt + Math.floor(hours) * 3600000;
    saveWrite(save);
  }
  return save;
}

export function feedPet(save: SaveData, amount: number, cost: number): boolean {
  if (save.foodCount < cost) return false;
  save.foodCount -= cost;
  save.pet.hunger = Math.min(MAX_HUNGER, save.pet.hunger + amount);
  save.pet.lastFedAt = Date.now();
  saveWrite(save);
  return true;
}

export function addFood(save: SaveData, amount: number): number {
  save.foodCount += amount;
  saveWrite(save);
  return save.foodCount;
}

export function addXP(save: SaveData, xp: number): { evolved: boolean; newLevel: string } {
  save.pet.xp += xp;
  const old = save.pet.level;
  if (save.pet.xp >= XP_PET_FULL) save.pet.level = 'full';
  else if (save.pet.xp >= XP_PET_ADULT) save.pet.level = 'adult';
  else save.pet.level = 'baby';
  saveWrite(save);
  return { evolved: old !== save.pet.level, newLevel: save.pet.level };
}

export function switchPet(save: SaveData, petType: string): boolean {
  if (save.unlockedPets.indexOf(petType) === -1) return false;
  save.currentPet = petType; save.pet.type = petType;
  saveWrite(save); return true;
}

export function endStudySession(
  save: SaveData, total: number, correct: number, wrong: number
) {
  save.totalWordsLearned += total;
  save.checkins.push({ date: new Date().toISOString().slice(0, 10), wordsLearned: total, correct, wrong, earnedFood: 0 });
  addXP(save, total * 5 + correct * 3);
  const today = new Date().toISOString().slice(0, 10);
  const ws = save.weeklyStats.find(s => s.date === today);
  if (ws) { ws.words += total; ws.correct += correct; }
  else save.weeklyStats.push({ date: today, words: total, correct });
  if (save.weeklyStats.length > 7) save.weeklyStats.shift();
  saveWrite(save);
}

export function buyItem(save: SaveData, item: ShopItem): boolean {
  if (save.foodCount < item.price || save.ownedItems.indexOf(item.id) !== -1) return false;
  save.foodCount -= item.price; save.ownedItems.push(item.id);
  (save.equippedItems as any)[item.category] = item.id;
  saveWrite(save); return true;
}

export function checkOffline(save: SaveData): OfflineReward | null {
  const now = Date.now();
  const hours = Math.floor((now - save.lastLogin) / 3600000);
  if (hours < 2) return null;
  const hr = Math.min(30, Math.floor(hours * 2));
  const apples = Math.min(10, Math.floor(hours * 0.5));
  save.pet.hunger = Math.min(MAX_HUNGER, save.pet.hunger + hr);
  save.foodCount += apples;
  save.lastLogin = now;
  const reward: OfflineReward = { lastLogin: save.lastLogin, offlineHours: hours, hungerRecovered: hr, bonusApples: apples };
  save.offlineRewards = reward;
  saveWrite(save);
  return reward;
}

export function refreshDaily(save: SaveData): SaveData {
  const today = new Date().toISOString().slice(0, 10);
  if (save.lastDailyRefresh !== today) {
    save.lastDailyRefresh = today; save.dailyWordBank = [];
    // streak check
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (save.lastCheckin === yesterday) save.dailyStreak += 1;
    else if (save.lastCheckin !== today) save.dailyStreak = 1;
    save.lastCheckin = today;
    saveWrite(save);
  }
  return save;
}

export function getTodayStats(save: SaveData) {
  const today = new Date().toISOString().slice(0, 10);
  const s = save.weeklyStats.find(w => w.date === today);
  return s || { date: today, words: 0, correct: 0 };
}
