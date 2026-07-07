/**
 * ReviewTab — 4-choice quiz with SM-2 scheduling
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, SkipForward } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { loadWordPack } from '../data/wordBank';
import type { WordEntry } from '../data/types';
import { shuffle } from '../utils/helpers';
import { ProgressBar } from './ProgressBar';

export const ReviewTab: React.FC = () => {
  const save = useGameStore(s => s.save);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAns, setCorrectAns] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const total = 20;

  useEffect(() => {
    loadWordPack('kaoyan_2').then(all => {
      setWords(shuffle(all).slice(0, total));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (words.length > 0 && index < words.length) {
      const word = words[index];
      const others = words.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = shuffle([word.meaning, ...others.map(o => o.meaning)]);
      setChoices(opts);
      setCorrectAns(opts.indexOf(word.meaning));
      setAnswered(false);
      setSelectedIdx(-1);
      setShowHint(false);
    }
  }, [index, words]);

  const handleChoice = (i: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(i);
    const store = useGameStore.getState();

    if (i === correctAns) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
      store.answerQuestion(true);
    } else {
      setStreak(0);
      setShowHint(true);
      store.answerQuestion(false);
    }
  };

  const handleNext = () => {
    if (index + 1 >= words.length) {
      // Round complete — save stats
      const store = useGameStore.getState();
      // already handled by answerQuestion
    }
    setIndex(i => i + 1);
  };

  if (loading) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;

  if (index >= words.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-3xl">🎉</span>
        <p className="text-white font-semibold text-lg">复习完成!</p>
        <p className="text-white/50 text-sm">正确 {correct}/{total}</p>
        <div className="glass-chip">{streak} 连击</div>
        <button className="glass-btn" onClick={() => { setIndex(0); setCorrect(0); setStreak(0); }}>
          再来一轮
        </button>
      </div>
    );
  }

  const word = words[index];
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-6">
      {/* Progress */}
      <div className="w-full max-w-md mb-3">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>复习 {index + 1}/{total}</span>
          <span>🔥 {streak}</span>
        </div>
        <ProgressBar progress={index / total} />
      </div>

      {/* Word */}
      <div className="glass-panel w-full max-w-md p-6 mb-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-1">{word.word}</h2>
        <p className="text-white/40 text-sm font-mono">{word.phonetic}</p>
        <p className="text-white/30 text-xs mt-2">选择正确的中文释义</p>
      </div>

      {/* Choices */}
      <div className="w-full max-w-md grid gap-2.5">
        {choices.map((c, i) => {
          let bg = 'bg-white/10';
          if (answered && i === correctAns) bg = 'bg-green-400/25 border-green-400/40';
          else if (answered && i === selectedIdx && i !== correctAns) bg = 'bg-red-400/25 border-red-400/40';
          else if (answered && i !== correctAns) bg = 'bg-white/5';

          return (
            <button
              key={i}
              className={`glass-panel px-5 py-3.5 text-left text-sm font-medium text-white/85
                hover:bg-white/18 transition-all cursor-pointer ${bg}`}
              onClick={() => handleChoice(i)}
              disabled={answered}
            >
              <span className="text-white/35 mr-3">{labels[i]}.</span>
              {c}
            </button>
          );
        })}
      </div>

      {/* Hint */}
      {showHint && (
        <div className="glass-chip mt-3 text-red-300">
          正确答案：{word.meaning}
        </div>
      )}

      {/* Streak bonus */}
      {streak >= 3 && (
        <div className="mt-3">
          <span className="glass-chip text-yellow-300">
            <Sparkles size={12} /> 连击奖励 x{streak}
          </span>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button className="glass-btn mt-4" onClick={handleNext}>
          <SkipForward size={14} /> {index + 1 < total ? '下一题' : '查看结果'}
        </button>
      )}
    </div>
  );
};
