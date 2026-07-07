// Word Bank - loads and manages vocabulary packs

import type { WordEntry, WordPack } from './Types';

export const WORD_PACKS: WordPack[] = [
  {
    id: 'kaoyan_2',
    name: '考研英语二核心词汇',
    description: '考研英语二高频核心词汇，1050词',
    file: '/assets/words/kaoyan_basic.json',
    totalWords: 1050,
  },
];

export class WordBank {
  private static packs: Map<string, WordEntry[]> = new Map();

  static async loadPack(packId: string): Promise<WordEntry[]> {
    if (this.packs.has(packId)) return this.packs.get(packId)!;
    const pack = WORD_PACKS.find((p) => p.id === packId);
    if (!pack) throw new Error(`Unknown pack: ${packId}`);
    const res = await fetch(pack.file);
    const data = await res.json();
    const words = data.words as WordEntry[];
    this.packs.set(packId, words);
    return words;
  }

  static getBatch(words: WordEntry[], count: number, reviewed?: Set<string>): WordEntry[] {
    let pool = words;
    if (reviewed && reviewed.size > 0) {
      pool = pool.filter((w) => !reviewed.has(w.id));
    }
    if (pool.length <= count) return pool;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  static getDistractors(correct: WordEntry, pool: WordEntry[], count: number): WordEntry[] {
    const others = pool.filter((w) => w.id !== correct.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
}
