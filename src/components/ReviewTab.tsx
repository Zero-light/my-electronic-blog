/**
 * ReviewTab — "不背单词" style: masked review + self-assessment
 */
import React, { useEffect, useState } from 'react';
import { EyeOff, Eye, Volume2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

let bankCache: any[] | null = null;
async function loadBank(): Promise<any[]> {
  if (bankCache) return bankCache;
  const r = await fetch('/assets/words/wordbank.json');
  const d = await r.json();
  bankCache = d.words || [];
  return bankCache;
}

export const ReviewTab: React.FC = () => {
  const { save, getDueWords, updateReview } = useGameStore();
  const [bank, setBank] = useState<any[] | null>(null);
  const [due, setDue] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { loadBank().then(setBank); }, []);
  useEffect(() => {
    const dueIds = getDueWords();
    const full = dueIds.map(d => (bank || []).find(w => w && w.id === d.wordId)).filter(Boolean);
    setDue(full);
  }, [bank, save.wordbook]);

  if (!bank) return <div className="flex items-center justify-center h-full text-white/40 text-sm">加载中...</div>;
  if (due.length === 0 || index >= due.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-3xl">🎉</span>
        <p className="text-white/60 text-sm">没有待复习的单词</p>
        <p className="text-white/25 text-xs">所有单词都在掌握中!</p>
        {due.length > 0 && index >= due.length && (
          <button className="glass-btn text-xs" onClick={() => { setIndex(0); setDone(true); }}>重新开始</button>
        )}
      </div>
    );
  }

  const word = due[index];
  if (!word) return null;

  const handleGrade = (grade: number) => {
    updateReview(word.id, grade);
    if (index + 1 >= due.length) setDone(true);
    setRevealed(false);
    setIndex(i => i + 1);
  };

  return (
    <div className="flex flex-col items-center w-full h-full pt-8 px-6">
      {/* Masked word card */}
      <div className="glass-panel w-full max-w-lg p-10 mb-6 flex flex-col items-center text-center min-h-[280px] justify-center">
        <h1 className="text-5xl font-extrabold text-white mb-3">{word.word}</h1>
        <p className="text-white/35 text-base font-mono mb-6">{word.phonetic}</p>

        {!revealed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-8 bg-white/8 rounded-full" />
            <p className="text-white/15 text-xs">点击下方按钮查看释义</p>
            <button className="glass-btn" onClick={() => setRevealed(true)}>
              <Eye size={16} /> 显示释义
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn w-full">
            <div className="w-full h-px bg-white/8 mb-4" />
            <p className="text-xl font-bold text-white mb-2">{word.meaning}</p>

            {word.examples?.[0] && (
              <p className="text-sm text-white/40 italic mt-4">"{word.examples[0]}"</p>
            )}

            {word.collocations?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {word.collocations.slice(0, 3).map((c: string, i: number) => (
                  <span key={i} className="glass-chip text-[11px]">{c}</span>
                ))}
              </div>
            )}

            {/* Self-assessment */}
            <div className="flex justify-center gap-3 mt-6">
              <button className="glass-btn px-5 py-2 text-sm" style={{ background: 'rgba(255,140,105,0.25)' }}
                onClick={() => handleGrade(1)}>忘记了</button>
              <button className="glass-btn px-5 py-2 text-sm" style={{ background: 'rgba(255,180,70,0.25)' }}
                onClick={() => handleGrade(3)}>模糊</button>
              <button className="glass-btn glass-btn-feed px-5 py-2 text-sm"
                onClick={() => handleGrade(5)}>认识</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
