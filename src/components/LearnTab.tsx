/**
 * LearnTab — "不背单词" style: rich word card + self-assessment
 */
import React, { useEffect, useState } from 'react';
import { Volume2, Check, EyeOff, Eye, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const wb: any[] = [];
let wbLoaded = false;
async function loadBank(): Promise<any[]> {
  if (wbLoaded) return wb;
  const r = await fetch('/assets/words/wordbank.json');
  const d = await r.json();
  wb.push(...(d.words || []));
  wbLoaded = true;
  return wb;
}

type LearnPhase = 'question' | 'reveal' | 'done';

export const LearnTab: React.FC = () => {
  const { save, startLearn, answerLearn, nextLearn, currentLearnWord, learnChoices, learnAnswered } = useGameStore();
  const [phase, setPhase] = useState<LearnPhase>('question');
  const [bank, setBank] = useState<any[] | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => { loadBank().then(setBank); }, []);
  useEffect(() => {
    const newWords = save.wordbook.filter(w => w.status === 'new');
    setDueCount(newWords.length);
  }, [save.wordbook]);

  const handleStart = () => {
    if (bank.length) { startLearn(save.wordbook, bank); setPhase('question'); setSelectedIdx(-1); }
  };

  const handleChoice = (idx: number) => {
    if (learnAnswered) return;
    setSelectedIdx(idx);
    const correct = answerLearn(idx);
    setWasCorrect(correct);
    setPhase('reveal');
  };

  const handleNext = () => { nextLearn(); setPhase('done'); };

  // Empty state
  if (!currentLearnWord && phase !== 'done') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <p className="text-white/50 text-sm">生词本中有 {dueCount} 个待学习单词</p>
        {dueCount > 0 ? (
          <button className="glass-btn px-6 py-3" onClick={handleStart}>
            开始学习 → {dueCount}词
          </button>
        ) : (
          <p className="text-white/25 text-xs">去搜索页面添加新词 📖</p>
        )}
      </div>
    );
  }

  // Done state
  if (phase === 'done' || !currentLearnWord) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <span className="text-3xl">✅</span>
        <p className="text-white font-semibold">完成!</p>
        <button className="glass-btn" onClick={handleStart}>继续学习</button>
        <button className="text-white/30 text-xs" onClick={() => setPhase('question')}>返回</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full pt-8 px-6 overflow-y-auto">
      {/* Word card */}
      <div className="glass-panel w-full max-w-lg p-8 mb-6 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold text-white mb-2">{currentLearnWord.word}</h1>
        <p className="text-white/40 text-base font-mono mb-4">{currentLearnWord.phonetic}</p>

        {/* Reveal: show meaning + rich content */}
        {phase === 'reveal' && (
          <div className="animate-fadeIn w-full text-left">
            <div className="w-full h-px bg-white/8 mb-4" />
            <div className={`text-lg font-semibold mb-4 ${wasCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {wasCorrect ? '✓ 正确!' : '✗ 正确答案:'} {currentLearnWord.meaning}
            </div>

            {/* Examples */}
            {currentLearnWord.examples?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/25 mb-2">例句 Examples</p>
                {currentLearnWord.examples.map((ex: string, i: number) => (
                  <p key={i} className="text-sm text-white/50 italic mb-1">"{ex}"</p>
                ))}
              </div>
            )}

            {/* Collocations */}
            {currentLearnWord.collocations?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/25 mb-2">搭配 Collocations</p>
                <div className="flex flex-wrap gap-2">
                  {currentLearnWord.collocations.map((col: string, i: number) => (
                    <span key={i} className="glass-chip text-xs">{col}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Derivatives */}
            {currentLearnWord.derivatives?.length > 0 && (
              <div>
                <p className="text-xs text-white/25 mb-2">派生词 Family</p>
                <div className="flex flex-wrap gap-2">
                  {currentLearnWord.derivatives.map((d: string, i: number) => (
                    <span key={i} className="text-xs text-white/40">{d}</span>
                  ))}
                </div>
              </div>
            )}

            <button className="glass-btn mt-5 w-full" onClick={handleNext}>
              下一个 <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Choices (only in question phase) */}
      {phase === 'question' && learnChoices.length > 0 && (
        <div className="w-full max-w-lg grid gap-2.5 mb-4">
          {learnChoices.map((c, i) => (
            <button key={i} className="glass-panel px-5 py-3.5 text-left text-sm text-white/80 hover:bg-white/15 transition-all"
              onClick={() => handleChoice(i)}>
              {String.fromCharCode(65 + i)}. {c}
            </button>
          ))}
          <p className="text-xs text-white/20 text-center mt-1">选择正确的中文释义</p>
        </div>
      )}
    </div>
  );
};
