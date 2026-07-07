/**
 * LearnTab — Combined new-word learning + review
 * Sub-tabs: 新词 | 复习
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadWordPack } from '../data/wordBank';
import type { WordEntry } from '../data/types';
import { shuffle } from '../utils/helpers';
import { ProgressBar } from './ProgressBar';

type SubMode = 'new' | 'review';

export const LearnTab: React.FC = () => {
  const [mode, setMode] = useState<SubMode>('new');
  return (
    <div className="flex flex-col w-full h-full pt-4">
      {/* Sub-tab toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'new' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
          onClick={() => setMode('new')}>📖 新词</button>
        <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'review' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
          onClick={() => setMode('review')}>🔄 复习</button>
      </div>

      {mode === 'new' ? <NewWordsPanel /> : <ReviewPanel />}
    </div>
  );
};

// ── New Words Panel (4-choice active recall) ──────────
const NewWordsPanel: React.FC = () => {
  const [pool, setPool] = useState<WordEntry[]>([]);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [learned, setLearned] = useState(0);
  const total = 20;
  const [answered, setAnswered] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => { loadWordPack('kaoyan_2').then(all => { setPool(shuffle(all).slice(0, total)); setLoading(false); }); }, []);

  const nextWord = useCallback(() => {
    const remaining = pool.filter(w => w.id !== current?.id);
    if (!remaining.length || learned >= total) { setFinished(true); return; }
    const word = remaining[Math.floor(Math.random() * remaining.length)];
    const others = pool.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = shuffle([word.meaning, ...others.map(o => o.meaning)]);
    setCurrent(word); setChoices(opts); setCorrectIdx(opts.indexOf(word.meaning));
    setAnswered(false); setSelectedIdx(-1); setShowAnswer(false);
  }, [pool, current, learned]);

  useEffect(() => { if (!loading && pool.length > 0 && !current && !finished) nextWord(); }, [loading, pool, current, finished, nextWord]);

  const handleChoice = (i: number) => {
    if (answered) return;
    setAnswered(true); setSelectedIdx(i);
    const correct = i === correctIdx;
    const store = useGameStore.getState();
    if (correct) { store.answerQuestion(true); setLearned(l => l + 1); }
    else { setShowAnswer(true); }
    setTimeout(() => {
      if (!correct) store.answerQuestion(false);
      nextWord();
    }, correct ? 600 : 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;
  if (finished) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <span className="text-3xl">🎉</span>
      <p className="text-white font-semibold text-lg">学习完成!</p>
      <p className="text-white/50 text-sm">掌握 {learned}/{total} 个新词 · 获得 🍎{learned * 5}</p>
      <button className="glass-btn" onClick={() => { setLearned(0); setFinished(false); setCurrent(null); }}>再来一轮</button>
    </div>
  );
  if (!current) return <div className="flex items-center justify-center h-full text-white/50">准备中...</div>;

  return (
    <div className="flex flex-col items-center w-full px-6">
      <div className="w-full max-w-md mb-3"><div className="flex justify-between text-xs text-white/40 mb-1"><span>掌握 {learned}/{total}</span><span>🍎 +5/正确</span></div><ProgressBar progress={learned / total} /></div>
      <div className="glass-panel w-full max-w-md p-6 mb-3 text-center min-h-[160px] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-white mb-1">{current.word}</h2>
        <p className="text-white/45 text-sm font-mono mb-2">{current.phonetic}</p>
        {current.example && <p className="text-white/25 text-xs italic">"{current.example}"</p>}
        {showAnswer && <div className="mt-3 animate-fadeIn"><div className="w-full h-px bg-white/10 mb-2" /><p className="text-sm text-red-300/80 mb-1">正确答案</p><p className="text-lg text-white/90 font-semibold">{current.meaning}</p></div>}
      </div>
      <div className="w-full max-w-md grid gap-2 mb-1">
        {choices.map((c, i) => (
          <button key={i} className={`glass-panel px-4 py-3 text-left text-sm text-white/85 transition-all ${answered ? 'cursor-default' : 'hover:bg-white/18 cursor-pointer'} ${answered && i === correctIdx ? 'bg-green-400/25' : answered && i === selectedIdx && showAnswer ? 'bg-red-400/25' : ''}`}
            onClick={() => handleChoice(i)} disabled={answered}>
            {String.fromCharCode(65 + i)}. {c}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/30 mt-1">选择正确的中文释义</p>
    </div>
  );
};

// ── Review Panel (4-choice quiz, SM-2 weighted) ───────
const ReviewPanel: React.FC = () => {
  const { save } = useGameStore();
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAns, setCorrectAns] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const total = 20;

  useEffect(() => { loadWordPack('kaoyan_2').then(all => { setWords(shuffle(all).slice(0, total)); setLoading(false); }); }, []);

  useEffect(() => {
    if (words.length > 0 && index < words.length) {
      const word = words[index];
      const others = words.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = shuffle([word.meaning, ...others.map(o => o.meaning)]);
      setChoices(opts); setCorrectAns(opts.indexOf(word.meaning));
      setAnswered(false); setShowHint(false);
    }
  }, [index, words]);

  const handleChoice = (i: number) => {
    if (answered) return;
    setAnswered(true);
    const store = useGameStore.getState();
    if (i === correctAns) { setCorrect(c => c + 1); setStreak(s => s + 1); store.answerQuestion(true); }
    else { setStreak(0); setShowHint(true); store.answerQuestion(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;
  if (index >= words.length) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <span className="text-3xl">🎉</span>
      <p className="text-white font-semibold text-lg">复习完成!</p>
      <p className="text-white/50 text-sm">正确 {correct}/{total} · 🔥 {streak}连击</p>
      <div className="glass-chip">💰 +{correct * 5} 金币</div>
      <button className="glass-btn" onClick={() => { setIndex(0); setCorrect(0); setStreak(0); }}>再来一轮</button>
    </div>
  );

  const word = words[index];
  return (
    <div className="flex flex-col items-center w-full px-6">
      <div className="w-full max-w-md mb-3"><div className="flex justify-between text-xs text-white/40 mb-1"><span>复习 {index + 1}/{total}</span><span>🔥 {streak} · 💰+5/对</span></div><ProgressBar progress={index / total} /></div>
      <div className="glass-panel w-full max-w-md p-5 mb-3 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-1">{word.word}</h2>
        <p className="text-white/40 text-sm font-mono">{word.phonetic}</p>
        <p className="text-white/30 text-xs mt-2">选择正确的中文释义</p>
      </div>
      <div className="w-full max-w-md grid gap-2">
        {choices.map((c, i) => {
          let bg = answered && i === correctAns ? 'bg-green-400/25' : answered && i !== correctAns ? 'bg-white/5' : '';
          return (
            <button key={i} className={`glass-panel px-4 py-3 text-left text-sm text-white/85 transition-all hover:bg-white/18 ${bg}`}
              onClick={() => handleChoice(i)} disabled={answered}>
              {String.fromCharCode(65 + i)}. {c}
            </button>
          );
        })}
      </div>
      {showHint && <div className="glass-chip mt-3 text-red-300 text-xs">正确答案：{word.meaning}</div>}
    </div>
  );
};
