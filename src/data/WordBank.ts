import type { WordEntry, WordPack } from './types';

export const WORD_PACKS: WordPack[] = [{
  id: 'kaoyan_2', name: '考研英语二核心词汇',
  description: '考研英语二高频核心词汇，1050词',
  file: '/assets/words/kaoyan_basic.json', totalWords: 1050,
}];

const cache = new Map<string, WordEntry[]>();

export async function loadWordPack(packId: string): Promise<WordEntry[]> {
  if (cache.has(packId)) return cache.get(packId)!;
  const pack = WORD_PACKS.find(p => p.id === packId);
  if (!pack) throw new Error(`Unknown pack: ${packId}`);
  const res = await fetch(pack.file);
  const data = await res.json();
  cache.set(packId, data.words);
  return data.words as WordEntry[];
}

export function wordDistractors(correct: WordEntry, pool: WordEntry[], count = 3): WordEntry[] {
  return pool
    .filter(w => w.id !== correct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
