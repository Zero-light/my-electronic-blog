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
    foodCount: 10, gold: 20, diamonds: 0,
    dailyStreak: 1, lastCheckin: today,
    currentPet: 'cloudy', unlockedPets: ['cloudy'],
    cosmetics: [{}], studyProgress: [], achievements: [], checkins: [],
    settings: { volume: 0.6, dailyGoal: 20 },
    pet: { type: 'cloudy', hunger: 70, happiness: 80, xp: 0, level: 'egg', lastFedAt: Date.now(), lastPetAt: 0 },
    ownedItems: [], equippedItems: {},
    weeklyStats: [], dailyWordBank: [], lastDailyRefresh: today,
    offlineRewards: null, streakRewards: [],
    challengeRecords: [], dialogueIndex: 0, lastBossDate: '', bossHighScore: 0,
    houseTier: 0, furniture: [], placedFurniture: [],
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
      if (!d.challengeRecords) d.challengeRecords = [];
      if (!d.dialogueIndex) d.dialogueIndex = 0;
      if (!d.bossHighScore) d.bossHighScore = 0;
      if (!d.lastBossDate) d.lastBossDate = '';
      if (!d.gold && d.gold !== 0) d.gold = 20;
      if (!d.houseTier && d.houseTier !== 0) d.houseTier = 0;
      if (!d.furniture) d.furniture = [];
      if (!d.placedFurniture) d.placedFurniture = [];
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

// ── Challenge Records ─────────────────────────────────
export function saveChallengeRecord(save: SaveData, score: number, timeUsed: number, correct: number, total: number) {
  save.challengeRecords.push({ date: new Date().toISOString().slice(0, 10), score, time: timeUsed, correct, total });
  if (save.challengeRecords.length > 50) save.challengeRecords.shift();
  const diamonds = getChallengeDiamonds(correct, total);
  addDiamonds(save, diamonds);
  saveWrite(save);
  return diamonds;
}

export function getChallengeDiamonds(correct: number, total: number): number {
  if (total === 0) return 0;
  const acc = correct / total;
  if (acc >= 1) return 100;      // 100% perfect
  if (acc >= 0.85) return 40;    // 85%+
  if (acc >= 0.75) return 20;    // 75%+
  if (acc >= 0.6) return 10;     // 60%+
  return 0;                       // below 60%
}

export function getChallengeTier(acc: number): string {
  if (acc >= 1) return '💎 完美! +100';
  if (acc >= 0.85) return '💎 优秀 +40';
  if (acc >= 0.75) return '💎 良好 +20';
  if (acc >= 0.6) return '💎 及格 +10';
  return '未达标，再试一次!';
}

export function getHighScore(save: SaveData): number {
  return save.challengeRecords.reduce((max, r) => Math.max(max, r.score), 0);
}

// ── Achievements (comprehensive) ──────────────────────
export interface AchievementCheck { id: string; name: string; desc: string; icon: string; unlocked: boolean; }
export function checkAllAchievements(save: SaveData): AchievementCheck[] {
  const checks: AchievementCheck[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const todayStats = getTodayStats(save);
  const highScore = getHighScore(save);

  // Word milestones
  const wordTiers = [50, 100, 200, 500, 800, 1000, 1500];
  wordTiers.forEach(n => {
    if (save.totalWordsLearned >= n && !save.achievements.includes(`words_${n}`)) {
      checks.push({ id: `words_${n}`, name: `📚 词汇达人`, desc: `累计学习 ${n} 个单词`, icon: '📚', unlocked: false });
    }
  });

  // Streak
  [3, 7, 14, 30, 60].forEach(n => {
    if (save.dailyStreak >= n && !save.achievements.includes(`streak_${n}`)) {
      checks.push({ id: `streak_${n}`, name: `🔥 坚持之星`, desc: `连续打卡 ${n} 天`, icon: '🔥', unlocked: false });
    }
  });

  // Challenge scores
  const challengeTiers = [500, 1000, 2000, 5000, 10000];
  challengeTiers.forEach(n => {
    if (highScore >= n && !save.achievements.includes(`chal_${n}`)) {
      checks.push({ id: `chal_${n}`, name: `⚡ 挑战王者`, desc: `挑战模式最高分达到 ${n}`, icon: '⚡', unlocked: false });
    }
  });

  // Daily volume
  if (todayStats.words >= 50 && !save.achievements.includes('daily_50')) {
    checks.push({ id: 'daily_50', name: '📖 学霸日', desc: '单日学习 50 个单词', icon: '📖', unlocked: false });
  }
  if (todayStats.words >= 100 && !save.achievements.includes('daily_100')) {
    checks.push({ id: 'daily_100', name: '📖 卷王日', desc: '单日学习 100 个单词', icon: '📖', unlocked: false });
  }

  // Perfect challenge
  const perfectChallenges = save.challengeRecords.filter(r => r.correct === r.total && r.total >= 10);
  if (perfectChallenges.length >= 1 && !save.achievements.includes('perfect_1')) {
    checks.push({ id: 'perfect_1', name: '🎯 百发百中', desc: '完成一次满分挑战', icon: '🎯', unlocked: false });
  }

  // Total review count
  if ((save.totalWordsReviewed || 0) >= 1000 && !save.achievements.includes('review_1k')) {
    checks.push({ id: 'review_1k', name: '🔄 复习达人', desc: '累计复习 1000 次', icon: '🔄', unlocked: false });
  }

  // Evolution
  if (save.pet.level === 'perfect' && !save.achievements.includes('evo_perfect')) {
    checks.push({ id: 'evo_perfect', name: '🦄 完全体', desc: '宠物进化到完全体', icon: '🦄', unlocked: false });
  }

  return checks;
}

export function unlockAchievement(save: SaveData, id: string) {
  if (!save.achievements.includes(id)) {
    save.achievements.push(id);
    addDiamonds(save, 3); // bonus for any achievement
    saveWrite(save);
    return true;
  }
  return false;
}

// ── Pet Dialogue Bank ─────────────────────────────────
export const DIALOGUE_BANK = [
  {
    text: 'Do you like learning English?',
    options: [
      { text: 'Yes, I love it!', correct: true, response: 'Me too! Every word is a new adventure! 🌟' },
      { text: 'It\'s okay, I guess.', correct: false, response: 'Keep going! Small steps lead to big progress 💪' },
      { text: 'No, it\'s too hard.', correct: false, response: 'Don\'t give up! I\'m here to help you 🐾' },
    ],
  },
  {
    text: 'What\'s your favorite word you learned today?',
    options: [
      { text: 'I liked "perseverance"!', correct: true, response: 'Great choice! Perseverance is the key to mastery ✨' },
      { text: 'I can\'t remember any.', correct: false, response: 'That\'s okay! Let\'s review together 📖' },
      { text: 'All words are the same to me.', correct: false, response: 'Try to find beauty in each word, they all have stories! 📚' },
    ],
  },
  {
    text: 'How do you stay motivated to study?',
    options: [
      { text: 'I set small goals every day.', correct: true, response: 'That\'s smart! Small goals make big dreams come true 🎯' },
      { text: 'I just force myself.', correct: false, response: 'Maybe try making it fun? Play some challenge games! ⚡' },
      { text: 'I don\'t... that\'s why I\'m here.', correct: false, response: 'Then let me be your motivation! Study with me every day 🤝' },
    ],
  },
  {
    text: 'Do you believe practice makes perfect?',
    options: [
      { text: 'Absolutely!', correct: true, response: 'I agree 100%! Let\'s practice together right now 📝' },
      { text: 'Maybe, but talent matters more.', correct: false, response: 'Talent helps, but hard work beats talent every time! 💪' },
      { text: 'I\'m not sure.', correct: false, response: 'Try it and see! Practice this week, you\'ll surprise yourself 🌱' },
    ],
  },
  {
    text: 'What would you do if you met an English speaker?',
    options: [
      { text: 'I\'d try my best to talk!', correct: true, response: 'That\'s the spirit! Mistakes are just stepping stones 🪜' },
      { text: 'I\'d run away!', correct: false, response: 'Haha! But they\'re probably friendly. Just say "Hello!" 👋' },
      { text: 'I\'d use a translator app.', correct: false, response: 'Apps help, but your own words have magic in them! 🪄' },
    ],
  },
  {
    text: 'Isn\'t it amazing how words connect people?',
    options: [
      { text: 'Yes, language is beautiful!', correct: true, response: 'It truly is! Every word you learn connects you to millions more people 🌍' },
      { text: 'I never thought about it that way.', correct: false, response: 'Now you know! Language is the bridge between hearts 💕' },
      { text: 'I just want to pass my exam...', correct: false, response: 'Fair enough! But the skills last a lifetime, not just for exams 🎓' },
    ],
  },
];

export function getDialogue(index: number) {
  return DIALOGUE_BANK[index % DIALOGUE_BANK.length];
}

export function saveBossResult(save: SaveData, score: number) {
  if (score > save.bossHighScore) save.bossHighScore = score;
  save.lastBossDate = new Date().toISOString().slice(0, 10);
  addDiamonds(save, Math.floor(score / 50));
  saveWrite(save);
}

export function canPlayBossToday(save: SaveData): boolean {
  return save.lastBossDate !== new Date().toISOString().slice(0, 10);
}

// ── Gold Economy ──────────────────────────────────────
export function addGold(save: SaveData, amount: number) { save.gold += amount; saveWrite(save); }

// ── House System ──────────────────────────────────────
export const HOUSE_TIERS = [
  { tier: 0, name: '空地', cost: 0, emoji: '🏕️', desc: '一片空地，什么都没有' },
  { tier: 1, name: '平房', cost: 200, emoji: '🏠', desc: '简朴的小屋，遮风挡雨' },
  { tier: 2, name: '小康房', cost: 800, emoji: '🏡', desc: '温馨舒适，有院子' },
  { tier: 3, name: '二层楼', cost: 3000, emoji: '🏘️', desc: '二层小楼，宽敞明亮' },
  { tier: 4, name: '别墅', cost: 8000, emoji: '🏰', desc: '豪华别墅，带花园泳池' },
];

export const FURNITURE_CATALOG = [
  { id: 'rug_red', name: '红地毯', icon: '🟥', cost: 50, type: 'floor' },
  { id: 'rug_blue', name: '蓝地毯', icon: '🟦', cost: 50, type: 'floor' },
  { id: 'bed_simple', name: '小木床', icon: '🛏️', cost: 100, type: 'furniture' },
  { id: 'bed_double', name: '双人床', icon: '🛌', cost: 300, type: 'furniture' },
  { id: 'table_wood', name: '木桌', icon: '🪑', cost: 80, type: 'furniture' },
  { id: 'desk_study', name: '书桌', icon: '📚', cost: 120, type: 'furniture' },
  { id: 'lamp_floor', name: '落地灯', icon: '💡', cost: 60, type: 'light' },
  { id: 'lamp_chandelier', name: '吊灯', icon: '✨', cost: 200, type: 'light' },
  { id: 'plant_potted', name: '盆栽', icon: '🪴', cost: 40, type: 'decor' },
  { id: 'plant_flower', name: '花瓶', icon: '💐', cost: 60, type: 'decor' },
  { id: 'window_curtain', name: '窗帘', icon: '🪟', cost: 70, type: 'window' },
  { id: 'bookshelf', name: '书架', icon: '📚', cost: 150, type: 'furniture' },
  { id: 'sofa', name: '沙发', icon: '🛋️', cost: 250, type: 'furniture' },
  { id: 'painting', name: '挂画', icon: '🖼️', cost: 90, type: 'decor' },
  { id: 'clock_wall', name: '挂钟', icon: '🕐', cost: 45, type: 'decor' },
];

export function upgradeHouse(save: SaveData): { ok: boolean; tier: number; cost: number } {
  const current = save.houseTier;
  if (current >= 4) return { ok: false, tier: current, cost: 0 };
  const next = HOUSE_TIERS[current + 1];
  if (save.gold < next.cost) return { ok: false, tier: current, cost: next.cost };
  save.gold -= next.cost;
  save.houseTier = current + 1;
  saveWrite(save);
  return { ok: true, tier: current + 1, cost: next.cost };
}

export function buyFurniture(save: SaveData, itemId: string): boolean {
  if (save.furniture.includes(itemId)) return false;
  const item = FURNITURE_CATALOG.find(f => f.id === itemId);
  if (!item || save.gold < item.cost) return false;
  save.gold -= item.cost;
  save.furniture.push(itemId);
  saveWrite(save);
  return true;
}

export function placeFurniture(save: SaveData, itemId: string) {
  if (!save.placedFurniture.includes(itemId)) save.placedFurniture.push(itemId);
  saveWrite(save);
}

export function removeFurniture(save: SaveData, itemId: string) {
  save.placedFurniture = save.placedFurniture.filter(id => id !== itemId);
  saveWrite(save);
}
