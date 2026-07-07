/**
 * SaveManager — localStorage for wordbook app
 */
import type { SaveData, WordbookEntry, ChallengeRecord } from './types';

const KEY = 'wordpal.v4';

function def(): SaveData {
  return { version: 4, diamonds: 0, dailyStreak: 1, lastCheckin: new Date().toISOString().slice(0,10), wordbook: [], challengeRecords: [], lastDailyRefresh: new Date().toISOString().slice(0,10) };
}

export function load(): SaveData {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch {}
  return def();
}
export function saveData(d: SaveData) { localStorage.setItem(KEY, JSON.stringify(d)); }

// Wordbook
export function addToWordbook(data: SaveData, wordId: string): boolean {
  if (data.wordbook.find(w => w.wordId === wordId)) return false;
  data.wordbook.push({ wordId, addedAt: Date.now(), status: 'new', easeFactor: 2.5, intervalDays: 0, lastReview: '', reviewCount: 0 });
  saveData(data); return true;
}

export function updateWordProgress(data: SaveData, wordId: string, grade: number) {
  const w = save.wordbook.find(e => e.wordId === wordId);
  if (!w) return;
  w.reviewCount++;
  w.lastReview = new Date().toISOString().slice(0,10);
  if (grade >= 3) {
    let newInterval = w.intervalDays === 0 ? 1 : (w.reviewCount <= 2 ? w.reviewCount * 3 : Math.round(w.intervalDays * w.easeFactor));
    w.intervalDays = newInterval;
    w.easeFactor = Math.max(1.3, w.easeFactor + (0.1 - (5-grade) * 0.08));
    if (w.reviewCount >= 5) w.status = 'mastered';
    else if (w.reviewCount >= 2) w.status = 'learning';
  } else {
    w.intervalDays = 0; w.reviewCount = 0;
    w.easeFactor = Math.max(1.3, w.easeFactor - 0.2);
  }
  saveData(data);
}

export function getDueWords(data: SaveData): WordbookEntry[] {
  const today = new Date(); today.setHours(0,0,0,0);
  return save.wordbook.filter(w => {
    if (!w.lastReview) return true;
    const next = new Date(w.lastReview); next.setDate(next.getDate() + w.intervalDays);
    return next <= today;
  });
}

export function getWordbookStats(data: SaveData) {
  return { total: save.wordbook.length, new: save.wordbook.filter(w=>w.status==='new').length, learning: save.wordbook.filter(w=>w.status==='learning').length, mastered: save.wordbook.filter(w=>w.status==='mastered').length, due: getDueWords(save).length };
}

// Challenge
export function saveChallengeRecord(data: SaveData, score: number, timeUsed: number, correct: number, total: number) {
  save.challengeRecords.push({ date: new Date().toISOString().slice(0,10), score, time: timeUsed, correct, total });
  if (save.challengeRecords.length > 50) save.challengeRecords.shift();
  const diamonds = getChallengeDiamonds(correct, total);
  save.diamonds += diamonds;
  saveData(data);
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

export function getHighScore(data: SaveData): number {
  return save.challengeRecords.reduce((max, r) => Math.max(max, r.score), 0);
}

// Streak
export function refreshDaily(data: SaveData): SaveData {
  const today = new Date().toISOString().slice(0,10);
  if (save.lastDailyRefresh !== today) {
    save.lastDailyRefresh = today;
    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    save.dailyStreak = save.lastCheckin === yesterday ? save.dailyStreak + 1 : save.lastCheckin !== today ? 1 : save.dailyStreak;
    save.lastCheckin = today;
    saveData(data);
  }
  return save;
}
