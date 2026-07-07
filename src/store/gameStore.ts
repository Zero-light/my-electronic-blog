import { create } from 'zustand';
import type { SaveData } from '../data/types';
import { load, addToWordbook, updateWordProgress, getDueWords, getWordbookStats,
  saveChallengeRecord, getHighScore, refreshDaily, getChallengeDiamonds, getChallengeTier } from '../data/saveManager';

interface GameState {
  save: SaveData;
  wordResults: any[]; // search results
  currentLearnWord: any | null;
  learnChoices: string[];
  learnCorrect: number;
  learnAnswered: boolean;
  challengeDiamonds: number;

  init: () => void;
  search: (query: string, wordBank: any[]) => any[];
  addWord: (wordId: string) => boolean;
  startLearn: (wordbook: any[], wordBank: any[]) => void;
  answerLearn: (idx: number) => boolean;
  nextLearn: () => void;
  updateReview: (wordId: string, grade: number) => void;
  saveChallenge: (score: number, timeUsed: number, correct: number, total: number) => number;
  getStats: () => ReturnType<typeof getWordbookStats>;
  getHighScore: () => number;
  getDueWords: () => any[];
}

export const useGameStore = create<GameState>((set, get) => ({
  save: load(),
  wordResults: [],
  currentLearnWord: null,
  learnChoices: [],
  learnCorrect: 0,
  learnAnswered: false,
  challengeDiamonds: 0,

  init: () => {
    let s = load();
    s = refreshDaily(s);
    set({ save: s });
  },

  search: (query, bank) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return bank.filter((w: any) =>
      w.word.toLowerCase().includes(q) || w.meaning.includes(query)
    ).slice(0, 30);
  },

  addWord: (wordId) => {
    const s = get().save;
    const ok = addToWordbook(s, wordId);
    set({ save: { ...s } });
    return ok;
  },

  startLearn: (wordbook, bank) => {
    const newWords = wordbook.filter((w: any) => w.status === 'new');
    if (!newWords.length) { set({ currentLearnWord: null }); return; }
    const entry = newWords[Math.floor(Math.random() * newWords.length)];
    const full = bank.find((w: any) => w.id === entry.wordId);
    if (!full) return;
    // Generate choices
    const others = bank.filter((w: any) => w.id !== full.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [full.meaning, ...others.map((o: any) => o.meaning)].sort(() => Math.random() - 0.5);
    set({ currentLearnWord: full, learnChoices: choices, learnCorrect: choices.indexOf(full.meaning), learnAnswered: false });
  },

  answerLearn: (idx) => {
    const correct = idx === get().learnCorrect;
    if (correct) {
      const s = get().save;
      updateWordProgress(s, get().currentLearnWord.id, 4);
      set({ save: { ...s }, learnAnswered: true });
    }
    set({ learnAnswered: true });
    return correct;
  },

  nextLearn: () => set({ currentLearnWord: null, learnAnswered: false }),

  updateReview: (wordId, grade) => {
    const s = get().save;
    updateWordProgress(s, wordId, grade);
    set({ save: { ...s } });
  },

  saveChallenge: (score, timeUsed, correct, total) => {
    const s = get().save;
    const diamonds = saveChallengeRecord(s, score, timeUsed, correct, total);
    set({ save: { ...s }, challengeDiamonds: diamonds });
    return diamonds;
  },

  getStats: () => getWordbookStats(get().save),
  getHighScore: () => getHighScore(get().save),
  getDueWords: () => getDueWords(get().save),
}));
