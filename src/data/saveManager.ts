/**
 * SaveManager — localStorage persistence + all game systems
 */
import type { SaveData, ShopItem, OfflineReward, WeeklyStat, StreakReward, PetLevel } from './types';

const SAVE_KEY = 'wordpal.v3.save';
const MAX_HUNGER = 100;
const MAX_HAPPINESS = 100;
const XP_EGG = 30;
const XP_BABY = 100;
const XP_GROWTH = 300;
const XP_MATURE = 600;
const XP_PERFECT = 1000;

function createDefault(): SaveData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 3, createdAt: Date.now(), lastLogin: Date.now(),
    totalWordsLearned: 0, foodCount: 10, diamonds: 0,
    dailyStreak: 1, lastCheckin: today,
    currentPet: 'cloudy', unlockedPets: ['cloudy'],
    cosmetics: [{}], studyProgress: [], achievements: [], checkins: [],
    settings: { volume: 0.6, dailyGoal: 20 },
    pet: { type: 'cloudy', hunger: 70, happiness: 80, xp: 0, level: 'egg', lastFedAt: Date.now(), lastPetAt: 0 },
    ownedItems: [], equippedItems: {},
    weeklyStats: [], dailyWordBank: [], lastDailyRefresh: today,
    offlineRewards: null, streakRewards: [],
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (!d.pet.happiness) d.pet.happiness = 70;
      if (!d.pet.lastPetAt) d.pet.lastPetAt = 0;
      if (!d.diamonds) d.diamonds = 0;
      if (!d.streakRewards) d.streakRewards = [];
      if (!d.pet.level) d.pet.level = 'egg';
      return d;
    }
  } catch {}
  const def = createDefault();
  saveWrite(def);
  return def;
}

export function saveWrite(save: SaveData) {
  try { save.lastLogin = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {}
}

export function applyHungerDecay(save: SaveData): SaveData {
  const now = Date.now();
  const hours = (now - save.pet.lastFedAt) / 3600000;
  if (hours >= 1) {
    save.pet.hunger = Math.max(0, save.pet.hunger - Math.floor(hours));
    save.pet.happiness = Math.max(10, save.pet.happiness - Math.floor(hours * 0.5));
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

export function petInteraction(save: SaveData): { ok: boolean; cooldown: number } {
  const now = Date.now();
  const cooldown = Math.max(0, 600000 - (now - save.pet.lastPetAt)); // 10 min cooldown
  if (cooldown > 0) return { ok: false, cooldown };
  save.pet.happiness = Math.min(MAX_HAPPINESS, save.pet.happiness + 8);
  save.pet.lastPetAt = now;
  saveWrite(save);
  return { ok: true, cooldown: 0 };
}

export function addXP(save: SaveData, xp: number): { evolved: boolean; newLevel: string } {
  save.pet.xp += xp;
  const old = save.pet.level;
  const newLevel = getLevelByXP(save.pet.xp);
  save.pet.level = newLevel;
  saveWrite(save);
  return { evolved: old !== newLevel, newLevel };
}

function getLevelByXP(xp: number): PetLevel {
  if (xp >= XP_PERFECT) return 'perfect';
  if (xp >= XP_MATURE) return 'mature';
  if (xp >= XP_GROWTH) return 'growth';
  if (xp >= XP_BABY) return 'baby';
  return 'egg';
}

export function getLevelInfo(level: PetLevel) {
  const map: Record<PetLevel, { num: number; next: number; label: string; emoji: string }> = {
    egg:     { num: 0, next: XP_EGG,     label: '蛋', emoji: '🥚' },
    baby:    { num: 1, next: XP_BABY,    label: '幼体', emoji: '🐣' },
    growth:  { num: 2, next: XP_GROWTH,  label: '成长体', emoji: '🐱' },
    mature:  { num: 3, next: XP_MATURE,  label: '成熟体', emoji: '🦊' },
    perfect: { num: 4, next: XP_PERFECT, label: '完全体', emoji: '🦄' },
  };
  return map[level];
}

export function switchPet(save: SaveData, petType: string): boolean {
  if (save.unlockedPets.indexOf(petType) === -1) return false;
  save.currentPet = petType; save.pet.type = petType;
  saveWrite(save); return true;
}

export function addFood(save: SaveData, amount: number) { save.foodCount += amount; saveWrite(save); }
export function addDiamonds(save: SaveData, amount: number) { save.diamonds += amount; saveWrite(save); }

export function endStudySession(save: SaveData, total: number, correct: number, wrong: number) {
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
  if (save.foodCount < item.price || save.ownedItems.includes(item.id)) return false;
  save.foodCount -= item.price;
  save.ownedItems.push(item.id);
  saveWrite(save);
  return true;
}

export function equipItem(save: SaveData, category: string, itemId: string) {
  (save.equippedItems as any)[category] = itemId;
  saveWrite(save);
}

export function unequipItem(save: SaveData, category: string) {
  (save.equippedItems as any)[category] = undefined;
  saveWrite(save);
}

export function checkStreakRewards(save: SaveData): StreakReward | null {
  const tiers = [
    { days: 3, tier: 1 as const, label: '🔥 火焰徽章', itemId: 'hat_ribbon' },
    { days: 7, tier: 2 as const, label: '🎁 稀有宝箱', itemId: 'skin_lavender' },
    { days: 30, tier: 3 as const, label: '👑 限定皮肤', itemId: 'bg_stars' },
  ];
  for (const t of tiers) {
    if (save.dailyStreak >= t.days && !save.streakRewards.find(r => r.tier === t.tier)) {
      const reward: StreakReward = { tier: t.tier, claimed: false, itemId: t.itemId };
      save.streakRewards.push(reward);
      if (t.itemId && !save.ownedItems.includes(t.itemId)) save.ownedItems.push(t.itemId);
      addDiamonds(save, t.tier * 5);
      saveWrite(save);
      return reward;
    }
  }
  return null;
}

export function checkOffline(save: SaveData): OfflineReward | null {
  const now = Date.now();
  const hours = Math.floor((now - save.lastLogin) / 3600000);
  if (hours < 2) return null;
  const hr = Math.min(30, Math.floor(hours * 2));
  const apples = Math.min(10, Math.floor(hours * 0.5));
  save.pet.hunger = Math.min(MAX_HUNGER, save.pet.hunger + hr);
  save.pet.happiness = Math.min(MAX_HAPPINESS, save.pet.happiness + Math.floor(hr * 0.5));
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
  return save.weeklyStats.find(w => w.date === today) || { date: today, words: 0, correct: 0 };
}
