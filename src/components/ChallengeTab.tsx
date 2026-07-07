import React, { useEffect, useState, useRef } from 'react';
import { Timer, Zap, Swords } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { getChallengeTier } from '../data/saveManager';

type Mode = 'menu' | 'timed' | 'result';
const chBank: any[] = []; let chDone = false;

export const ChallengeTab: React.FC = () => {
  const { save, saveChallenge } = useGameStore();
  const [mode, setMode] = useState<Mode>('menu');
  const [words, setWords] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAns, setCorrectAns] = useState(0);
  const [lastDiamonds, setLastDiamonds] = useState(0);
  const [lastAcc, setLastAcc] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    fetch('/assets/words/wordbank.json').then(r => r.json()).then(d => {
      chBank.push(...(d.words || [])); chDone = true;
    });
  }, []);

  useEffect(() => {
    if (mode === 'timed' && timeLeft > 0) timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft <= 0 && mode === 'timed') finish();
    return () => clearInterval(timerRef.current);
  }, [mode, timeLeft]);

  const startTimed = () => {
    if (!chBank.length) return;
    const batch = [...chBank].sort(() => Math.random() - 0.5).slice(0, 50);
    setWords(batch); setIndex(0); setScore(0); setCorrect(0); setStreak(0); setTimeLeft(60); setMode('timed');
  };

  useEffect(() => {
    if (mode === 'timed' && words.length && index < 50) {
      const w = words[index];
      const others = words.filter(o => o.id !== w.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [w.meaning, ...others.map(o => o.meaning)].sort(() => Math.random() - 0.5);
      setChoices(opts); setCorrectAns(opts.indexOf(w.meaning)); setAnswered(false);
    }
  }, [index, mode, words]);

  const handleChoice = (i: number) => {
    if (answered) return; setAnswered(true);
    if (i === correctAns) { setScore(s => s + 100 + streak * 20); setCorrect(c => c + 1); setStreak(s => s + 1); }
    else { setStreak(0); setScore(s => Math.max(0, s - 30)); setTimeLeft(t => Math.max(t - 5, 0)); }
    setTimeout(() => setIndex(i => i + 1), 400);
  };

  const finish = () => {
    clearInterval(timerRef.current);
    const total = Math.max(index, 1);
    const diamonds = saveChallenge(score, 60 - timeLeft, correct, total);
    setLastDiamonds(diamonds); setLastAcc(Math.round(correct / total * 100)); setMode('result');
  };

  if (mode === 'result') {
    return (
      <div className="flex flex-col items-center w-full h-full pt-10 px-4">
        <div className="glass-panel w-full max-w-sm p-8 text-center">
          <span className="text-5xl block mb-4">{lastAcc >= 100 ? '🏆' : lastAcc >= 85 ? '🌟' : lastAcc >= 75 ? '✨' : '👍'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">挑战结束!</h2>
          <p className="text-white/70 text-lg mb-1">正确率 {lastAcc}% · {score} 分</p>
          <div className="glass-chip text-lg mb-4">{getChallengeTier(lastAcc / 100)}</div>
          <div className="text-xs text-white/30 mb-6">60%→💎10 · 75%→💎20 · 85%→💎40 · 100%→💎100</div>
          <button className="glass-btn w-full" onClick={() => setMode('menu')}>返回</button>
        </div>
      </div>
    );
  }

  if (mode === 'timed' && words[index]) {
    const w = words[index];
    return (
      <div className="flex flex-col items-center w-full h-full pt-4 px-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`glass-chip ${timeLeft <= 10 ? 'text-red-300 animate-breathe' : ''}`}><Timer size={14} />{timeLeft}s</div>
          <div className="glass-chip">{score}分</div>
          <div className="glass-chip">{index + 1}/50</div>
          <div className="glass-chip">🔥{streak}x</div>
        </div>
        <div className="glass-panel w-full max-w-md p-6 mb-3 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-1">{w.word}</h2>
          <p className="text-white/40 text-sm font-mono">{w.phonetic}</p>
        </div>
        <div className="w-full max-w-md grid gap-2">
          {choices.map((c, i) => (
            <button key={i} className={`glass-panel px-4 py-3 text-left text-sm text-white/85 ${answered ? 'cursor-default' : 'hover:bg-white/15 cursor-pointer'} ${answered && i === correctAns ? 'bg-green-400/20' : ''}`}
              onClick={() => handleChoice(i)} disabled={answered}>
              {String.fromCharCode(65 + i)}. {c}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-4">
      <h2 className="text-lg font-bold text-white mb-4">⚡ 挑战模式</h2>
      <div className="flex gap-3 mb-4">
        <div className="glass-chip">💎 {save.diamonds}</div>
        <div className="glass-chip">🏆 {save.challengeRecords.length}场</div>
      </div>
      <div className="glass-panel w-full max-w-sm p-4 mb-3 text-center text-xs text-white/35">
        60%→💎10 · 75%→💎20 · 85%→💎40 · 100%→💎100
      </div>
      <div className="grid gap-4 w-full max-w-sm">
        <div className="glass-panel p-5 hover:bg-white/15 cursor-pointer" onClick={startTimed}>
          <div className="flex items-center gap-3 mb-2">
            <Timer size={22} className="text-ice-300" />
            <span className="text-white font-bold">限时闯关</span>
            <span className="glass-chip text-xs ml-auto">60秒</span>
          </div>
          <p className="text-white/40 text-xs">答对+分·连击翻倍·答错扣分·获得💎</p>
        </div>
      </div>
    </div>
  );
};
