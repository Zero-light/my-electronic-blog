import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadWordPack } from '../data/wordBank';
import type { WordEntry } from '../data/types';
import { shuffle } from '../utils/helpers';
import { ProgressBar } from './ProgressBar';

export const LearnTab: React.FC = () => {
  const save = useGameStore(s => s.save);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [learned, setLearned] = useState(0);

  useEffect(() => {
    loadWordPack('kaoyan_2').then(all => {
      const today = new Date().toISOString().slice(0, 10);
      const learnedIds = save.checkins
        .filter(c => c.date === today)
        .flatMap(() => []);
      const batch = shuffle(all).slice(0, 20);
      setWords(batch);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;
  if (words.length === 0) return <div className="flex items-center justify-center h-full text-white/50">词库为空</div>;
  if (index >= words.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-3xl">🎉</span>
        <p className="text-white font-semibold text-lg">今日学习完成!</p>
        <p className="text-white/50 text-sm">已学 {learned} 个新词</p>
        <button className="glass-btn" onClick={() => { setIndex(0); setLearned(0); }}>
          再来一轮
        </button>
      </div>
    );
  }

  const word = words[index];
  const handleKnown = () => {
    const store = useGameStore.getState();
    store.answerQuestion(true);
    setLearned(l => l + 1);
    setFlipped(false);
    setIndex(i => i + 1);
  };
  const handleUnknown = () => {
    setFlipped(true);
  };
  const handleNext = () => {
    const store = useGameStore.getState();
    store.answerQuestion(false);
    setFlipped(false);
    setIndex(i => i + 1);
  };

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-6">
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>今日进度</span>
          <span>{index}/{words.length}</span>
        </div>
        <ProgressBar progress={index / words.length} />
      </div>

      {/* Word card */}
      <div className="glass-panel w-full max-w-md p-8 mb-4 min-h-[200px] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-white mb-3">{word.word}</h2>
        <p className="text-white/45 text-sm font-mono mb-2">{word.phonetic}</p>

        {flipped && (
          <div className="text-center animate-fadeIn">
            <p className="text-lg text-white/80 font-medium mb-3">{word.meaning}</p>
            {word.example && (
              <p className="text-xs text-white/40 italic">"{word.example}"</p>
            )}
            <button className="glass-btn mt-4" onClick={handleNext}>
              下一个 →
            </button>
          </div>
        )}
      </div>

      {!flipped && (
        <div className="flex gap-4">
          <button className="glass-btn-feed glass-btn px-8" onClick={handleKnown}>
            认识 ✓
          </button>
          <button className="glass-btn-back glass-btn px-8" onClick={handleUnknown}>
            不认识 ?
          </button>
        </div>
      )}
    </div>
  );
};
