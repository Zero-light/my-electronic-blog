/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 (Wozniak, 1990)
 *
 * Each StudyProgress tracks:
 *   - easeFactor: multiplier for interval growth (min 1.3)
 *   - intervalDays: days until next review
 *   - reviewCount: number of successful reviews in a row
 *
 * Grade (0-5):
 *   5 = perfect (immediate recall)
 *   4 = correct after hesitation
 *   3 = correct with difficulty
 *   2 = incorrect; recognized answer on seeing it
 *   1 = incorrect; familiar but don't know
 *   0 = complete blackout
 *
 * Simplified: we use grades 0-3 mapped from user action:
 *   3 = "Know" on first try
 *   2 = "Know" on second try (after seeing meaning)
 *   1 = "Don't know" → shown answer, recalled it
 *   0 = "Don't know" even after seeing answer
 */
import type { StudyProgress } from '../data/Types';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

export function createSM2Progress(wordId: string): StudyProgress {
  return {
    wordId,
    easeFactor: DEFAULT_EASE,
    intervalDays: 0,
    lastReview: new Date().toISOString().slice(0, 10),
    rating: 0,
    reviewCount: 0,
  };
}

export function sm2Update(progress: StudyProgress, grade: number): StudyProgress {
  const today = new Date().toISOString().slice(0, 10);

  let newEase = progress.easeFactor;
  let newInterval: number;
  let newReviewCount: number;

  if (grade >= 3) {
    // Successful recall
    newReviewCount = progress.reviewCount + 1;
    if (newReviewCount === 1) {
      newInterval = 1;
    } else if (newReviewCount === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(progress.intervalDays * newEase);
    }
    // Ease still adjusts up/down for grade 3 vs 4/5
    newEase = Math.max(MIN_EASE, newEase + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  } else {
    // Failed recall — reset
    newReviewCount = 0;
    newInterval = 0;
    newEase = Math.max(MIN_EASE, newEase - 0.2);
  }

  return {
    ...progress,
    easeFactor: +newEase.toFixed(2),
    intervalDays: newInterval,
    lastReview: today,
    rating: grade,
    reviewCount: newReviewCount,
  };
}

/** Returns true if this word is due for review today */
export function isDueToday(progress: StudyProgress): boolean {
  if (progress.intervalDays === 0) return true;
  const last = new Date(progress.lastReview);
  const nextReview = new Date(last.getTime() + progress.intervalDays * 86400000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextReview <= today;
}
