import { create } from 'zustand';
import type { SaveData, PetType, DailyTask, ShopItem } from '../data/types';
import {
  loadSave, applyHungerDecay, feedPet, addFood, addXP, addDiamonds,
  switchPet, endStudySession, buyItem, equipItem, unequipItem,
  checkOffline, refreshDaily, getTodayStats, petInteraction, checkStreakRewards,
} from '../data/saveManager';

interface GameState {
  save: SaveData;
  showStreakReward: { tier: number; label: string } | null;
  // Study
  studyWords: any[]; studyIndex: number; studyCorrect: number; studyWrong: number; studyStreak: number;
  // Actions
  init: () => Promise<void>;
  doFeed: () => boolean;
  doPet: () => { ok: boolean; cooldown: number };
  doSwitchPet: (type: PetType) => void;
  doBuyItem: (item: ShopItem) => boolean;
  doEquip: (category: string, itemId: string) => void;
  doUnequip: (category: string) => void;
  answerQuestion: (correct: boolean) => void;
  dismissStreakReward: () => void;
  getDailyTasks: () => DailyTask[];
}

export const useGameStore = create<GameState>((set, get) => ({
  save: loadSave(),
  showStreakReward: null,
  studyWords: [], studyIndex: 0, studyCorrect: 0, studyWrong: 0, studyStreak: 0,

  init: async () => {
    let save = loadSave();
    save = applyHungerDecay(save);
    save = refreshDaily(save);
    checkOffline(save);
    const streak = checkStreakRewards(save);
    set({
      save,
      showStreakReward: streak ? { tier: streak.tier, label: streak.tier === 1 ? '🔥 火焰徽章' : streak.tier === 2 ? '🎁 稀有宝箱' : '👑 传说守护者' } : null,
    });
  },

  doFeed: () => {
    const { save } = get();
    if (feedPet(save, 25, 5)) { set({ save: { ...save } }); return true; }
    return false;
  },

  doPet: () => {
    const { save } = get();
    const result = petInteraction(save);
    if (result.ok) set({ save: { ...save } });
    return result;
  },

  doSwitchPet: (type) => { const { save } = get(); switchPet(save, type); set({ save: { ...save } }); },

  doBuyItem: (item) => {
    const { save } = get();
    if (buyItem(save, item)) { set({ save: { ...save } }); return true; }
    return false;
  },

  doEquip: (category, itemId) => { const { save } = get(); equipItem(save, category, itemId); set({ save: { ...save } }); },
  doUnequip: (category) => { const { save } = get(); unequipItem(save, category); set({ save: { ...save } }); },

  answerQuestion: (correct) => {
    const { save, studyIndex, studyCorrect, studyWrong, studyStreak } = get();
    const newCorrect = studyCorrect + (correct ? 1 : 0);
    const newWrong = studyWrong + (correct ? 0 : 1);
    const newStreak = correct ? studyStreak + 1 : 0;
    if (correct) {
      addXP(save, 5);
      addFood(save, newStreak >= 5 ? 15 : (newStreak >= 3 ? 8 : 5));
    } else { addFood(save, 1); }
    set({ save: { ...save }, studyCorrect: newCorrect, studyWrong: newWrong, studyStreak: newStreak });

    const total = get().studyWords.length;
    const delay = correct ? 600 : 1500;
    if (studyIndex + 1 >= total) {
      // End session — this triggers vocabulary-based evolution
      endStudySession(save, studyIndex + 1, newCorrect, newWrong);
      setTimeout(() => set({ studyIndex: studyIndex + 1, save: { ...save } }), delay);
    } else {
      setTimeout(() => set({ studyIndex: studyIndex + 1 }), delay);
    }
  },

  dismissStreakReward: () => set({ showStreakReward: null }),

  getDailyTasks: () => {
    const { save } = get();
    const stats = getTodayStats(save);
    return [
      { id: 'checkin', label: '打卡', target: 1, current: save.dailyStreak > 0 ? 1 : 0, reward: 2, done: save.lastCheckin === new Date().toISOString().slice(0, 10) },
      { id: 'learn', label: '学习', target: 20, current: stats.words, reward: 5, done: stats.words >= 20 },
      { id: 'feed', label: '喂食', target: 1, current: save.pet.hunger >= 80 ? 1 : 0, reward: 3, done: save.pet.hunger >= 80 },
      { id: 'pet', label: '互动', target: 1, current: (Date.now() - save.pet.lastPetAt < 600000) ? 1 : 0, reward: 3, done: Date.now() - save.pet.lastPetAt < 600000 },
    ];
  },
}));
