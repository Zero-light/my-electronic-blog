/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 (Wozniak, 1990)
 */
import type { StudyProgress } from './types';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

export function createSM2Progress(wordId: string): StudyProgress {
  return {
    wordId, easeFactor: DEFAULT_EASE, intervalDays: 0,
    lastReview: new Date().toISOString().slice(0, 10),
    rating: 0, reviewCount: 0,
  };
}

export function sm2Update(progress: StudyProgress, grade: number): StudyProgress {
  const today = new Date().toISOString().slice(0, 10);
  let newEase = progress.easeFactor;
  let newInterval: number;
  let newReviewCount: number;

  if (grade >= 3) {
    newReviewCount = progress.reviewCount + 1;
    if (newReviewCount === 1) newInterval = 1;
    else if (newReviewCount === 2) newInterval = 6;
    else newInterval = Math.round(progress.intervalDays * newEase);
    newEase = Math.max(MIN_EASE, newEase + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  } else {
    newReviewCount = 0; newInterval = 0;
    newEase = Math.max(MIN_EASE, newEase - 0.2);
  }

  return {
    ...progress,
    easeFactor: +newEase.toFixed(2),
    intervalDays: newInterval,
    lastReview: today, rating: grade, reviewCount: newReviewCount,
  };
}

export function isDueToday(progress: StudyProgress): boolean {
  if (progress.intervalDays === 0) return true;
  const last = new Date(progress.lastReview);
  const nextReview = new Date(last.getTime() + progress.intervalDays * 86400000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextReview <= today;
}
