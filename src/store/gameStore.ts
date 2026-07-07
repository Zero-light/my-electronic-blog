import { create } from 'zustand';
import type { SaveData, PetType, DailyTask, ShopItem, AchievementDef, ChallengeRecord } from '../data/types';
import {
  loadSave, applyHungerDecay, feedPet, addFood, addXP, addDiamonds,
  switchPet, endStudySession, buyItem, equipItem, unequipItem,
  checkOffline, refreshDaily, getTodayStats, petInteraction, checkStreakRewards,
  saveChallengeRecord, checkAllAchievements, unlockAchievement,
  getDialogue, saveBossResult, canPlayBossToday, getHighScore,
} from '../data/saveManager';

interface GameState {
  save: SaveData;
  showStreakReward: { tier: number; label: string } | null;
  // Achievements
  newAchievements: { id: string; name: string; desc: string; icon: string }[];
  // Dialogue
  showDialogue: boolean;
  dialogueText: string;
  dialogueOptions: { text: string; correct: boolean; response: string }[];
  dialogueResponse: string;
  // Study
  studyWords: any[]; studyIndex: number; studyCorrect: number; studyWrong: number; studyStreak: number;
  // Challenge
  challengeScore: number; challengeTime: number;
  // Boss
  bossScore: number;

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

  // Dialogue
  openDialogue: () => void;
  answerDialogue: (idx: number) => void;
  closeDialogue: () => void;

  // Challenge
  saveChallenge: (score: number, timeUsed: number, correct: number, total: number) => void;

  // Boss
  saveBoss: (score: number) => void;
  canBoss: () => boolean;

  // Achievements
  checkAchievements: () => void;
  claimAchievement: (id: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  save: loadSave(),
  showStreakReward: null,
  newAchievements: [],
  showDialogue: false,
  dialogueText: '',
  dialogueOptions: [],
  dialogueResponse: '',
  studyWords: [], studyIndex: 0, studyCorrect: 0, studyWrong: 0, studyStreak: 0,
  challengeScore: 0, challengeTime: 0,
  bossScore: 0,

  init: async () => {
    let save = loadSave();
    save = applyHungerDecay(save);
    save = refreshDaily(save);
    checkOffline(save);
    const streak = checkStreakRewards(save);
    const achievements = checkAllAchievements(save);
    set({
      save,
      showStreakReward: streak ? { tier: streak.tier, label: streak.tier === 1 ? '🔥 火焰徽章' : streak.tier === 2 ? '🎁 稀有宝箱' : '👑 传说守护者' } : null,
      newAchievements: achievements,
    });
  },

  doFeed: () => { const { save } = get(); if (feedPet(save, 25, 5)) { set({ save: { ...save } }); return true; } return false; },
  doPet: () => { const { save } = get(); const r = petInteraction(save); if (r.ok) set({ save: { ...save } }); return r; },
  doSwitchPet: (type) => { const { save } = get(); switchPet(save, type); set({ save: { ...save } }); },
  doBuyItem: (item) => { const { save } = get(); if (buyItem(save, item)) { set({ save: { ...save } }); return true; } return false; },
  doEquip: (c, id) => { const { save } = get(); equipItem(save, c, id); set({ save: { ...save } }); },
  doUnequip: (c) => { const { save } = get(); unequipItem(save, c); set({ save: { ...save } }); },

  answerQuestion: (correct) => {
    const { save, studyIndex, studyCorrect, studyWrong, studyStreak } = get();
    const nc = studyCorrect + (correct ? 1 : 0);
    const nw = studyWrong + (correct ? 0 : 1);
    const ns = correct ? studyStreak + 1 : 0;
    correct ? (addXP(save, 5), addFood(save, ns >= 5 ? 15 : (ns >= 3 ? 8 : 5))) : addFood(save, 1);
    set({ save: { ...save }, studyCorrect: nc, studyWrong: nw, studyStreak: ns });
    const total = get().studyWords.length;
    const delay = correct ? 600 : 1500;
    if (studyIndex + 1 >= total) {
      endStudySession(save, studyIndex + 1, nc, nw);
      setTimeout(() => { set({ studyIndex: studyIndex + 1, save: { ...save } }); get().checkAchievements(); }, delay);
    } else { setTimeout(() => set({ studyIndex: studyIndex + 1 }), delay); }
  },

  dismissStreakReward: () => set({ showStreakReward: null }),

  getDailyTasks: () => {
    const { save } = get(); const stats = getTodayStats(save);
    return [
      { id: 'checkin', label: '打卡', target: 1, current: save.dailyStreak ? 1 : 0, reward: 2, done: save.lastCheckin === new Date().toISOString().slice(0, 10) },
      { id: 'learn', label: '学习', target: 20, current: stats.words, reward: 5, done: stats.words >= 20 },
      { id: 'feed', label: '喂食', target: 1, current: save.pet.hunger >= 80 ? 1 : 0, reward: 3, done: save.pet.hunger >= 80 },
      { id: 'pet', label: '互动', target: 1, current: (Date.now() - save.pet.lastPetAt < 600000) ? 1 : 0, reward: 3, done: Date.now() - save.pet.lastPetAt < 600000 },
    ];
  },

  // ── Dialogue ───────────────────────────────────────
  openDialogue: () => {
    const { save } = get();
    const d = getDialogue(save.dialogueIndex);
    set({ showDialogue: true, dialogueText: d.text, dialogueOptions: d.options, dialogueResponse: '' });
  },
  answerDialogue: (idx: number) => {
    const { dialogueOptions, save } = get();
    const opt = dialogueOptions[idx];
    if (opt.correct) { addFood(save, 3); addXP(save, 10); addDiamonds(save, 1); }
    else addFood(save, 1);
    save.dialogueIndex = (save.dialogueIndex + 1) % 100;
    set({ save: { ...save }, dialogueResponse: opt.response });
  },
  closeDialogue: () => set({ showDialogue: false, dialogueResponse: '' }),

  // ── Challenge ──────────────────────────────────────
  saveChallenge: (score, timeUsed, correct, total) => {
    const { save } = get();
    saveChallengeRecord(save, score, timeUsed, correct, total);
    set({ save: { ...save } });
    get().checkAchievements();
  },

  // ── Boss ───────────────────────────────────────────
  saveBoss: (score) => { const { save } = get(); saveBossResult(save, score); set({ save: { ...save } }); },
  canBoss: () => canPlayBossToday(get().save),

  // ── Achievements ───────────────────────────────────
  checkAchievements: () => {
    const { save } = get();
    const checks = checkAllAchievements(save);
    if (checks.length > 0) set({ newAchievements: [...get().newAchievements, ...checks] });
  },
  claimAchievement: (id: string) => {
    const { save } = get();
    unlockAchievement(save, id);
    set({ save: { ...save }, newAchievements: get().newAchievements.filter(a => a.id !== id) });
  },
}));
