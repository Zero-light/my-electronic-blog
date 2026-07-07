import { create } from 'zustand';
import type { SaveData, PetType, WordEntry, DailyTask } from '../data/types';
import {
  loadSave, saveWrite, applyHungerDecay, feedPet, addFood, addXP,
  switchPet, endStudySession, buyItem, checkOffline, refreshDaily, getTodayStats,
} from '../data/saveManager';
import { loadWordPack } from '../data/wordBank';
import { shuffle } from '../utils/helpers';

interface GameState {
  save: SaveData;
  // UI state
  showStudy: boolean;
  showShop: boolean;
  showPetGallery: boolean;
  showAchievements: boolean;
  showOffline: boolean;
  studyWords: WordEntry[];
  studyIndex: number;
  studyCorrect: number;
  studyWrong: number;
  studyStreak: number;
  // Actions
  init: () => Promise<void>;
  doFeed: () => boolean;
  doSwitchPet: (type: PetType) => void;
  doBuyItem: (item: any) => boolean;
  // Study
  openStudy: () => Promise<void>;
  answerQuestion: (knew: boolean) => void;
  closeStudy: () => void;
  // UI toggles
  toggleShop: () => void;
  togglePetGallery: () => void;
  toggleAchievements: () => void;
  dismissOffline: () => void;
  // Daily tasks
  getDailyTasks: () => DailyTask[];
}

export const useGameStore = create<GameState>((set, get) => ({
  save: loadSave(),
  showStudy: false, showShop: false, showPetGallery: false,
  showAchievements: false, showOffline: false,
  studyWords: [], studyIndex: 0, studyCorrect: 0, studyWrong: 0, studyStreak: 0,

  init: async () => {
    let save = loadSave();
    save = applyHungerDecay(save);
    save = refreshDaily(save);
    const offline = checkOffline(save);
    set({ save, showOffline: !!offline });
  },

  doFeed: () => {
    const { save } = get();
    if (feedPet(save, 20, 5)) { set({ save: { ...save } }); return true; }
    return false;
  },

  doSwitchPet: (type: PetType) => {
    const { save } = get();
    switchPet(save, type);
    set({ save: { ...save }, showPetGallery: false });
  },

  doBuyItem: (item) => {
    const { save } = get();
    const ok = buyItem(save, item);
    if (ok) set({ save: { ...save } });
    return ok;
  },

  openStudy: async () => {
    const words = await loadWordPack('kaoyan_2');
    const batch = shuffle(words).slice(0, 20);
    set({ showStudy: true, studyWords: batch, studyIndex: 0, studyCorrect: 0, studyWrong: 0, studyStreak: 0 });
  },

  answerQuestion: (correct: boolean) => {
    const { save, studyIndex, studyWords, studyCorrect, studyWrong, studyStreak } = get();
    const newCorrect = studyCorrect + (correct ? 1 : 0);
    const newWrong = studyWrong + (correct ? 0 : 1);
    const newStreak = correct ? studyStreak + 1 : 0;

    // Rewards
    if (correct) {
      addXP(save, 5);
      const foodAmount = newStreak >= 5 && Math.random() < 0.2 ? 15 : (newStreak >= 3 && Math.random() < 0.3 ? 8 : 5);
      addFood(save, foodAmount);
    } else {
      addFood(save, 1);
    }

    set({ save: { ...save }, studyCorrect: newCorrect, studyWrong: newWrong, studyStreak: newStreak });

    // Next word or finish
    if (studyIndex + 1 >= studyWords.length) {
      endStudySession(save, studyIndex + 1, newCorrect, newWrong);
      setTimeout(() => set({ showStudy: false, save: { ...save } }), 1200);
    } else {
      setTimeout(() => set({ studyIndex: studyIndex + 1 }), correct ? 600 : 1500);
    }
  },

  closeStudy: () => {
    const { save, studyIndex, studyCorrect, studyWrong } = get();
    if (studyIndex > 0) endStudySession(save, studyIndex, studyCorrect, studyWrong);
    set({ showStudy: false, save: { ...save } });
  },

  toggleShop: () => set(s => ({ showShop: !s.showShop })),
  togglePetGallery: () => set(s => ({ showPetGallery: !s.showPetGallery })),
  toggleAchievements: () => set(s => ({ showAchievements: !s.showAchievements })),
  dismissOffline: () => set({ showOffline: false }),

  getDailyTasks: () => {
    const { save } = get();
    const stats = getTodayStats(save);
    return [
      { id: 'checkin', label: '打卡', target: 1, current: save.dailyStreak > 0 ? 1 : 0, reward: 2, done: save.lastCheckin === new Date().toISOString().slice(0, 10) },
      { id: 'learn', label: '学习', target: 20, current: stats.words, reward: 5, done: stats.words >= 20 },
      { id: 'review', label: '复习', target: 5, current: Math.min(stats.words, 5), reward: 3, done: stats.words >= 5 },
      { id: 'feed', label: '喂食', target: 1, current: save.pet.hunger >= 80 ? 1 : 0, reward: 3, done: save.pet.hunger >= 80 },
    ];
  },
}));
