/**
 * SaveManager — localStorage persistence + all game systems
 * Evolution tied to vocabulary milestones, not just XP
 */
import type { SaveData, ShopItem, OfflineReward, StreakReward, PetLevel } from './types';

const SAVE_KEY = 'wordpal.v3.save';
const MAX_HUNGER = 100;
const MAX_HAPPINESS = 100;

// ── Evolution thresholds (vocabulary-based) ────────────
const EVO_BABY   = { learned: 30, reviewed: 0 };
const EVO_GROWTH = { learned: 100, reviewed: 50 };
const EVO_MATURE = { learned: 500, reviewed: 500 };
const EVO_PERFECT = { learned: 800, reviewed: 800 };

function createDefault(): SaveData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version: 3, createdAt: Date.now(), lastLogin: Date.now(),
    totalWordsLearned: 0, totalWordsReviewed: 0,
    foodCount: 10, diamonds: 0,
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
      if (!d.pet.level || d.pet.level === 'adult') d.pet.level = recalcLevel(d);
      if (!d.totalWordsReviewed) d.totalWordsReviewed = 0;
      return d;
    }
  } catch {}
  const def = createDefault();
  saveWrite(def);
  return def;
}

function recalcLevel(save: SaveData): PetLevel {
  const l = save.totalWordsLearned || 0;
  const r = save.totalWordsReviewed || 0;
  if (l >= EVO_PERFECT.learned && r >= EVO_PERFECT.reviewed) return 'perfect';
  if (l >= EVO_MATURE.learned && r >= EVO_MATURE.reviewed) return 'mature';
  if (l >= EVO_GROWTH.learned && r >= EVO_GROWTH.reviewed) return 'growth';
  if (l >= EVO_BABY.learned) return 'baby';
  return 'egg';
}

export function saveWrite(save: SaveData) {
  try { save.lastLogin = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {}
}

export function getNextEvo(save: SaveData): { learned: number; reviewed: number; label: string; emoji: string } | null {
  const l = save.totalWordsLearned || 0;
  const r = save.totalWordsReviewed || 0;
  if (l < EVO_BABY.learned) return { ...EVO_BABY, label: '幼体', emoji: '🐣' };
  if (l < EVO_GROWTH.learned || r < EVO_GROWTH.reviewed) return { ...EVO_GROWTH, label: '成长体', emoji: '🐱' };
  if (l < EVO_MATURE.learned || r < EVO_MATURE.reviewed) return { ...EVO_MATURE, label: '成熟体', emoji: '🦊' };
  if (l < EVO_PERFECT.learned || r < EVO_PERFECT.reviewed) return { ...EVO_PERFECT, label: '完全体', emoji: '🦄' };
  return null; // max level
}

export function getLevelInfo(level: PetLevel) {
  const map: Record<PetLevel, { num: number; label: string; emoji: string }> = {
    egg:     { num: 0, label: '蛋', emoji: '🥚' },
    baby:    { num: 1, label: '幼体', emoji: '🐣' },
    growth:  { num: 2, label: '成长体', emoji: '🐱' },
    mature:  { num: 3, label: '成熟体', emoji: '🦊' },
    perfect: { num: 4, label: '完全体', emoji: '🦄' },
  };
  return map[level];
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
  const cooldown = Math.max(0, 600000 - (now - save.pet.lastPetAt));
  if (cooldown > 0) return { ok: false, cooldown };
  save.pet.happiness = Math.min(MAX_HAPPINESS, save.pet.happiness + 8);
  save.pet.lastPetAt = now;
  saveWrite(save);
  return { ok: true, cooldown: 0 };
}

export function addXP(save: SaveData, xp: number) {
  save.pet.xp += xp;
  saveWrite(save);
}

export function addFood(save: SaveData, amount: number) { save.foodCount += amount; saveWrite(save); }
export function addDiamonds(save: SaveData, amount: number) { save.diamonds += amount; saveWrite(save); }

/** Check and award diamonds for vocabulary milestones */
export function checkWordMilestones(save: SaveData, prevLearned: number, prevReviewed: number): number {
  let diamonds = 0;
  const thresholds = [50, 100, 200, 300, 400, 500, 600, 700, 800, 1000];
  for (const t of thresholds) {
    if (save.totalWordsLearned >= t && prevLearned < t) diamonds += 3;
    if ((save.totalWordsReviewed || 0) >= t && prevReviewed < t) diamonds += 2;
  }
  if (diamonds > 0) save.diamonds += diamonds;
  saveWrite(save);
  return diamonds;
}

export function switchPet(save: SaveData, petType: string): boolean {
  if (save.unlockedPets.indexOf(petType) === -1) return false;
  save.currentPet = petType; save.pet.type = petType;
  saveWrite(save); return true;
}

export function endStudySession(save: SaveData, total: number, correct: number, wrong: number) {
  const prevLearned = save.totalWordsLearned;
  const prevReviewed = save.totalWordsReviewed || 0;
  save.totalWordsLearned += total;
  save.totalWordsReviewed = (save.totalWordsReviewed || 0) + correct;
  addXP(save, total * 5 + correct * 3);

  // Perfect round bonus
  if (total > 0 && wrong === 0 && total >= 10) {
    addDiamonds(save, 3);
  }

  // Level check
  const newLevel = recalcLevel(save);
  const evolved = save.pet.level !== newLevel;
  save.pet.level = newLevel;

  save.checkins.push({ date: new Date().toISOString().slice(0, 10), wordsLearned: total, correct, wrong, earnedFood: 0 });
  const today = new Date().toISOString().slice(0, 10);
  const ws = save.weeklyStats.find(s => s.date === today);
  if (ws) { ws.words += total; ws.correct += correct; }
  else save.weeklyStats.push({ date: today, words: total, correct });
  if (save.weeklyStats.length > 7) save.weeklyStats.shift();
  saveWrite(save);

  // Check diamonds from milestones
  checkWordMilestones(save, prevLearned, prevReviewed);
}

export function buyItem(save: SaveData, item: ShopItem): boolean {
  const currency = item.priceType === 'diamond' ? 'diamonds' : 'foodCount';
  const cost = item.price;
  if (currency === 'diamonds' && save.diamonds < cost) return false;
  if (currency === 'foodCount' && save.foodCount < cost) return false;
  if (save.ownedItems.includes(item.id)) return false;
  if (currency === 'diamonds') save.diamonds -= cost;
  else save.foodCount -= cost;
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
  const tiers: { days: number; tier: 1|2|3; label: string; itemId?: string; diamonds: number }[] = [
    { days: 3, tier: 1, label: '🔥 火焰徽章', diamonds: 5 },
    { days: 7, tier: 2, label: '🎁 稀有宝箱', diamonds: 10, itemId: 'bg_stars_premium' },
    { days: 30, tier: 3, label: '👑 传说守护者', diamonds: 25, itemId: 'skin_galaxy' },
  ];
  for (const t of tiers) {
    if (save.dailyStreak >= t.days && !save.streakRewards.find(r => r.tier === t.tier)) {
      const reward: StreakReward = { tier: t.tier, claimed: false, itemId: t.itemId };
      save.streakRewards.push(reward);
      if (t.itemId && !save.ownedItems.includes(t.itemId)) save.ownedItems.push(t.itemId);
      addDiamonds(save, t.diamonds);
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
