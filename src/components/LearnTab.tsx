/**
 * LearnTab — Active recall: see word, pick meaning from 4 choices
 * Correct = learned (+🍎). Wrong = show answer, word returns to pool.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadWordPack } from '../data/wordBank';
import type { WordEntry } from '../data/types';
import { shuffle } from '../utils/helpers';
import { ProgressBar } from './ProgressBar';

export const LearnTab: React.FC = () => {
  const save = useGameStore(s => s.save);
  const [pool, setPool] = useState<WordEntry[]>([]);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [learned, setLearned] = useState(0);
  const [total, setTotal] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadWordPack('kaoyan_2').then(all => {
      const batch = shuffle(all).slice(0, total);
      setPool(batch);
      setLoading(false);
    });
  }, []);

  const nextWord = useCallback(() => {
    if (!pool.length) return;
    const remaining = pool.filter(w => w.id !== current?.id);
    if (remaining.length === 0 || learned >= total) {
      setFinished(true);
      return;
    }
    const word = remaining[Math.floor(Math.random() * remaining.length)];
    // Generate 4 choices from pool
    const others = pool
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const opts = shuffle([word.meaning, ...others.map(o => o.meaning)]);
    setCurrent(word);
    setChoices(opts);
    setCorrectIdx(opts.indexOf(word.meaning));
    setAnswered(false);
    setSelectedIdx(-1);
    setShowAnswer(false);
  }, [pool, current, learned, total]);

  useEffect(() => {
    if (!loading && pool.length > 0 && !current && !finished) nextWord();
  }, [loading, pool, current, finished, nextWord]);

  const handleChoice = (i: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(i);
    const store = useGameStore.getState();
    const correct = i === correctIdx;

    if (correct) {
      store.answerQuestion(true);
      setLearned(l => l + 1);
    } else {
      setShowAnswer(true);
      // Don't mark as correct in study stats
    }

    setTimeout(() => {
      if (learned + 1 >= total) {
        setFinished(true);
        if (!correct) store.answerQuestion(false); // count as wrong for stats
      } else {
        if (!correct) store.answerQuestion(false);
      }
      nextWord();
    }, correct ? 600 : 2000);
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-full text-white/50">加载中...</div>;

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-3xl">🎉</span>
        <p className="text-white font-semibold text-lg">学习完成!</p>
        <p className="text-white/50 text-sm">已掌握 {learned}/{total} 个新词</p>
        <div className="glass-chip">🍎 获得 {learned * 5} 个苹果</div>
        <button className="glass-btn" onClick={() => { setLearned(0); setFinished(false); setCurrent(null); }}>
          再来一轮
        </button>
      </div>
    );
  }

  if (!current) return <div className="flex items-center justify-center h-full text-white/50">准备中...</div>;

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-6">
      {/* Progress */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>已掌握 {learned}/{total}</span>
          <span>🍎 +5/词</span>
        </div>
        <ProgressBar progress={learned / total} />
      </div>

      {/* Word card */}
      <div className="glass-panel w-full max-w-md p-8 mb-4 flex flex-col items-center justify-center min-h-[180px]">
        <h2 className="text-5xl font-extrabold text-white mb-2">{current.word}</h2>
        <p className="text-white/45 text-sm font-mono mb-3">{current.phonetic}</p>

        {current.example && (
          <p className="text-white/25 text-xs italic text-center px-4">
            "{current.example}"
          </p>
        )}

        {/* Show answer after wrong choice */}
        {showAnswer && (
          <div className="mt-4 text-center animate-fadeIn">
            <div className="w-full h-px bg-white/10 mb-3" />
            <p className="text-sm text-red-300/80 mb-1">正确答案</p>
            <p className="text-lg text-white/90 font-semibold">{current.meaning}</p>
          </div>
        )}
      </div>

      {/* 4 choices */}
      <div className="w-full max-w-md grid gap-2.5 mb-2">
        {choices.map((c, i) => {
          let style = 'hover:bg-white/18 cursor-pointer';
          if (answered && i === correctIdx) style = 'bg-green-400/25 border-green-400/40';
          else if (answered && i === selectedIdx && !showAnswer) style = 'bg-green-400/25 border-green-400/40';
          else if (answered && i === selectedIdx && showAnswer) style = 'bg-red-400/25 border-red-400/40';

          return (
            <button
              key={i}
              className={`glass-panel px-5 py-3.5 text-left text-sm font-medium text-white/85 transition-all ${style}`}
              onClick={() => handleChoice(i)}
              disabled={answered}
            >
              {String.fromCharCode(65 + i)}. {c}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-white/30 mt-1">选择正确的中文释义</p>
    </div>
  );
};
