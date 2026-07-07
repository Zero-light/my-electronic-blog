import type { SaveData, WordbookEntry } from './types';

const KEY = 'wordpal.v4';

function def(): SaveData {
  return { version: 4, diamonds: 0, dailyStreak: 1, lastCheckin: new Date().toISOString().slice(0,10), wordbook: [], challengeRecords: [], lastDailyRefresh: new Date().toISOString().slice(0,10) };
}

export function load(): SaveData {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch {}
  return def();
}

function persist(d: SaveData) { localStorage.setItem(KEY, JSON.stringify(d)); }

export function addToWordbook(s: SaveData, wordId: string): boolean {
  if (s.wordbook.find((w: WordbookEntry) => w.wordId === wordId)) return false;
  s.wordbook.push({ wordId, addedAt: Date.now(), status: 'new', easeFactor: 2.5, intervalDays: 0, lastReview: '', reviewCount: 0 });
  persist(s); return true;
}

export function updateWordProgress(s: SaveData, wordId: string, grade: number) {
  const w = s.wordbook.find((e: WordbookEntry) => e.wordId === wordId);
  if (!w) return;
  w.reviewCount++;
  w.lastReview = new Date().toISOString().slice(0,10);
  if (grade >= 3) {
    const newInterval = w.intervalDays === 0 ? 1 : (w.reviewCount <= 2 ? w.reviewCount * 3 : Math.round(w.intervalDays * w.easeFactor));
    w.intervalDays = newInterval;
    w.easeFactor = Math.max(1.3, w.easeFactor + (0.1 - (5-grade) * 0.08));
    if (w.reviewCount >= 5) w.status = 'mastered';
    else if (w.reviewCount >= 2) w.status = 'learning';
  } else {
    w.intervalDays = 0; w.reviewCount = 0;
    w.easeFactor = Math.max(1.3, w.easeFactor - 0.2);
  }
  persist(s);
}

export function getDueWords(s: SaveData): WordbookEntry[] {
  const today = new Date(); today.setHours(0,0,0,0);
  return s.wordbook.filter((w: WordbookEntry) => {
    if (!w.lastReview) return true;
    const next = new Date(w.lastReview); next.setDate(next.getDate() + w.intervalDays);
    return next <= today;
  });
}

export function getWordbookStats(s: SaveData) {
  return {
    total: s.wordbook.length,
    newCount: s.wordbook.filter((w: WordbookEntry) => w.status === 'new').length,
    learning: s.wordbook.filter((w: WordbookEntry) => w.status === 'learning').length,
    mastered: s.wordbook.filter((w: WordbookEntry) => w.status === 'mastered').length,
    due: getDueWords(s).length,
  };
}

export function saveChallengeRecord(s: SaveData, score: number, timeUsed: number, correct: number, total: number) {
  s.challengeRecords.push({ date: new Date().toISOString().slice(0,10), score, time: timeUsed, correct, total });
  if (s.challengeRecords.length > 50) s.challengeRecords.shift();
  const diamonds = getChallengeDiamonds(correct, total);
  s.diamonds += diamonds;
  persist(s);
  return diamonds;
}

export function getChallengeDiamonds(correct: number, total: number): number {
  if (total === 0) return 0;
  const acc = correct / total;
  if (acc >= 1) return 100; if (acc >= 0.85) return 40; if (acc >= 0.75) return 20; if (acc >= 0.6) return 10; return 0;
}

export function getChallengeTier(acc: number): string {
  if (acc >= 1) return '💎 +100'; if (acc >= 0.85) return '💎 +40'; if (acc >= 0.75) return '💎 +20'; if (acc >= 0.6) return '💎 +10'; return '再试试!';
}

export function getHighScore(s: SaveData): number {
  return s.challengeRecords.reduce((max: number, r: { score: number }) => Math.max(max, r.score), 0);
}

export function refreshDaily(s: SaveData): SaveData {
  const today = new Date().toISOString().slice(0,10);
  if (s.lastDailyRefresh !== today) {
    s.lastDailyRefresh = today;
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    s.dailyStreak = s.lastCheckin === yesterday ? s.dailyStreak + 1 : s.lastCheckin !== today ? 1 : s.dailyStreak;
    s.lastCheckin = today;
    persist(s);
  }
  return s;
}
