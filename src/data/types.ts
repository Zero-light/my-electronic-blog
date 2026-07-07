// WordPal — Wordbook types
export interface WordEntry {
  id: string; word: string; phonetic: string; meaning: string;
  examples: string[];           // 2-3 English example sentences
  collocations?: string[];      // common phrases/搭配
  derivatives?: string[];       // word family 派生词
  tags?: string[];
}
export interface WordbookEntry {
  wordId: string; addedAt: number; status: 'new' | 'learning' | 'mastered';
  easeFactor: number; intervalDays: number; lastReview: string; reviewCount: number;
}
export interface ChallengeRecord {
  date: string; score: number; time: number; correct: number; total: number;
}
export interface SaveData {
  version: number; diamonds: number; dailyStreak: number; lastCheckin: string;
  wordbook: WordbookEntry[];
  challengeRecords: ChallengeRecord[];
  lastDailyRefresh: string;
}
