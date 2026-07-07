/**
 * ChallengeTab — Timed Quiz + Spelling + Boss modes
 * Words come from previously learned vocabulary
 */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Timer, Zap, Swords, Pencil } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { loadWordPack } from '../data/wordBank';
import type { WordEntry } from '../data/types';
import { shuffle } from '../utils/helpers';
import { getHighScore } from '../data/saveManager';

type Mode = 'menu' | 'timed' | 'spelling' | 'boss';

export const ChallengeTab: React.FC = () => {
  const { save, saveChallenge, saveBoss, canBoss } = useGameStore();
  const [mode, setMode] = useState<Mode>('menu');
  const [words, setWords] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAns, setCorrectAns] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingResult, setSpellingResult] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  const total = 20;
  const highScore = getHighScore(save);

  useEffect(() => {
    loadWordPack('kaoyan_2').then(all => {
      const batch = shuffle(all).slice(0, total);
      setWords(batch);
      setLoading(false);
    });
  }, []);

  // Timer
  useEffect(() => {
    if (mode === 'timed' && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    if (timeLeft <= 0 && mode === 'timed') finishChallenge();
    return () => clearInterval(timerRef.current);
  }, [mode, timeLeft]);

  // Choices for timed mode
  const loadQuestion = useCallback(() => {
    if (index >= total || !words.length) return;
    const w = words[index];
    const others = words.filter(o => o.id !== w.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = shuffle([w.meaning, ...others.map(o => o.meaning)]);
    setChoices(opts);
    setCorrectAns(opts.indexOf(w.meaning));
    setAnswered(false);
  }, [index, words]);

  useEffect(() => { if ((mode === 'timed' || mode === 'boss') && words.length) loadQuestion(); }, [index, mode, loadQuestion]);

  // Spelling mode
  useEffect(() => {
    if (mode === 'spelling' && words.length) {
      setSpellingInput(''); setSpellingResult(''); setAnswered(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [index, mode]);

  const handleTimedChoice = (i: number) => {
    if (answered) return;
    setAnswered(true);
    const correct_ = i === correctAns;
    if (correct_) {
      setScore(s => s + 100 + streak * 20);
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setScore(s => Math.max(0, s - 30)); // deduct score on wrong
      setTimeLeft(t => Math.max(t - 5, 0));
    }
    setTimeout(() => setIndex(i => i + 1), 400);
  };

  const handleSpelling = () => {
    if (answered || index >= total) return;
    setAnswered(true);
    const w = words[index];
    if (spellingInput.trim().toLowerCase() === w.word.toLowerCase()) {
      setSpellingResult('✓ 正确!');
      setScore(s => s + 150);
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setSpellingResult(`✗ 正确答案: ${w.word}`);
      setStreak(0);
    }
    setTimeout(() => { setIndex(i => i + 1); }, 1200);
  };

  const finishChallenge = () => {
    clearInterval(timerRef.current);
    const timeUsed = mode === 'timed' ? 60 - timeLeft : 0;
    if (mode === 'timed') saveChallenge(score, timeUsed, correct, index);
    if (mode === 'boss') saveBoss(score);
    setMode('menu');
  };

  const startTimed = () => { setMode('timed'); setScore(0); setIndex(0); setCorrect(0); setStreak(0); setTimeLeft(60); };
  const startSpelling = () => { setMode('spelling'); setScore(0); setIndex(0); setCorrect(0); setStreak(0); };
  const startBoss = () => { setMode('boss'); setScore(0); setIndex(0); setCorrect(0); setStreak(0); setTimeLeft(90); };

  // Boss mode — 10 questions, 90 seconds, diamond rewards
  const bossTotal = 10;
  if (mode === 'boss') {
    if (index >= bossTotal) { finishChallenge(); return null; }
    if (!words.length) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;
    const w = words[index];
    return (
      <div className="flex flex-col items-center w-full h-full pt-4 px-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`glass-chip ${timeLeft <= 15 ? 'text-red-300 animate-breathe' : 'text-yellow-200'}`}>
            <Timer size={14} /> {timeLeft}s
          </div>
          <div className="glass-chip text-yellow-300"><Swords size={14} /> BOSS {index + 1}/{bossTotal}</div>
          <div className="glass-chip">{score} 分</div>
          <div className="glass-chip">🔥 {streak}x</div>
        </div>

        <div className="text-xs text-white/30 mb-3 text-center">
          ⚡ 综合挑战 · 答对+100~180分 · 答错-30分 · 通关得💎
        </div>

        <div className="glass-panel w-full max-w-md p-6 mb-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-1">{w.word}</h2>
          <p className="text-white/40 text-sm font-mono">{w.phonetic}</p>
          {w.example && <p className="text-white/20 text-xs italic mt-2">"{w.example}"</p>}
        </div>
        <div className="w-full max-w-md grid gap-2.5">
          {choices.map((c, i) => (
            <button key={i}
              className={`glass-panel px-5 py-3.5 text-left text-sm font-medium text-white/85 transition-all ${
                answered ? 'cursor-default' : 'hover:bg-white/18 cursor-pointer'
              } ${
                answered && i === correctAns ? 'bg-green-400/25 border-green-400/40' : ''
              } ${
                answered && i !== correctAns ? 'bg-white/5' : ''
              }`}
              onClick={() => handleTimedChoice(i)} disabled={answered}
            >
              {String.fromCharCode(65 + i)}. {c}
            </button>
          ))}
        </div>
        {streak >= 3 && <div className="glass-chip text-yellow-300 mt-3"><Zap size={12} /> {streak}x combo!</div>}
      </div>
    );
  }

  if (mode === 'timed' && words.length > 0 && index < total) {
    const w = words[index];
    return (
      <div className="flex flex-col items-center w-full h-full pt-4 px-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`glass-chip ${timeLeft <= 10 ? 'text-red-300 animate-breathe' : 'text-white/70'}`}>
            <Timer size={14} /> {timeLeft}s
          </div>
          <div className="glass-chip">{score} 分</div>
          <div className="glass-chip">{index + 1}/{total}</div>
          <div className="glass-chip">🔥 {streak}x</div>
        </div>

        <div className="text-xs text-white/30 mb-3 text-center">
          ✅ 答对 +{100 + streak * 20}分 · ❌ 答错 -30分 -5秒
        </div>

        <div className="glass-panel w-full max-w-md p-6 mb-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-1">{w.word}</h2>
          <p className="text-white/40 text-sm font-mono">{w.phonetic}</p>
        </div>
        <div className="w-full max-w-md grid gap-2.5">
          {choices.map((c, i) => (
            <button key={i}
              className={`glass-panel px-5 py-3.5 text-left text-sm font-medium text-white/85 transition-all ${
                answered ? 'cursor-default' : 'hover:bg-white/18 cursor-pointer'
              } ${
                answered && i === correctAns ? 'bg-green-400/25 border-green-400/40' : ''
              }`}
              onClick={() => handleTimedChoice(i)} disabled={answered}
            >
              {String.fromCharCode(65 + i)}. {c}
            </button>
          ))}
        </div>
        {streak >= 5 && <div className="glass-chip text-yellow-300 mt-3"><Zap size={12} /> {streak}x combo!</div>}
      </div>
    );
  }

  if (mode === 'spelling' && words.length > 0 && index < total) {
    const w = words[index];
    return (
      <div className="flex flex-col items-center w-full h-full pt-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="glass-chip">{score} 分</div>
          <div className="glass-chip">{index + 1}/{total}</div>
          <div className="glass-chip">🔥 {streak}x</div>
        </div>
        <div className="glass-panel w-full max-w-md p-8 mb-4 text-center">
          <h2 className="text-lg text-white/70 mb-2">听发音，拼写单词</h2>
          <p className="text-3xl font-extrabold text-white mb-1">{w.word}</p>
          <p className="text-white/40 text-sm font-mono mb-4">{w.phonetic}</p>

          {!answered ? (
            <div className="flex gap-3 justify-center">
              <input
                ref={inputRef}
                className="glass-panel px-4 py-3 text-lg text-white bg-transparent outline-none w-48 text-center"
                value={spellingInput}
                onChange={e => setSpellingInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSpelling()}
                placeholder="输入单词..."
                autoFocus
              />
              <button className="glass-btn" onClick={handleSpelling}>确认</button>
            </div>
          ) : (
            <p className={`text-lg font-semibold ${spellingResult.startsWith('✓') ? 'text-green-300' : 'text-red-300'}`}>
              {spellingResult}
            </p>
          )}
        </div>
        <p className="text-xs text-white/30 mt-2">你可以先看到单词→记忆→输入→验证</p>
      </div>
    );
  }

  // Menu
  if (loading) return <div className="flex items-center justify-center h-full text-white/50">加载中...</div>;

  const todayRecords = save.challengeRecords.filter(r => r.date === new Date().toISOString().slice(0, 10));
  const todayBest = todayRecords.reduce((max, r) => Math.max(max, r.score), 0);

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-white mb-4">⚡ 挑战模式</h2>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <div className="glass-chip">🏆 最高 {highScore} 分</div>
        <div className="glass-chip">📊 今日 {todayBest} 分</div>
        <div className="glass-chip">💎 {save.diamonds}</div>
      </div>

      {/* Mode cards */}
      <div className="grid gap-4 w-full max-w-md">
        {/* Timed */}
        <div className="glass-panel p-5 hover:bg-white/15 cursor-pointer transition-all" onClick={startTimed}>
          <div className="flex items-center gap-3 mb-2">
            <Timer size={24} className="text-ice-300" />
            <span className="text-white font-bold text-lg">限时闯关</span>
            <span className="glass-chip text-xs ml-auto">60秒</span>
          </div>
          <p className="text-white/50 text-sm">限时答题，连击加分。答错扣 5 秒。从已学词汇中出题。</p>
        </div>

        {/* Spelling */}
        <div className="glass-panel p-5 hover:bg-white/15 cursor-pointer transition-all" onClick={startSpelling}>
          <div className="flex items-center gap-3 mb-2">
            <Pencil size={24} className="text-peach-300" />
            <span className="text-white font-bold text-lg">拼写模式</span>
            <span className="glass-chip text-xs ml-auto">无时限</span>
          </div>
          <p className="text-white/50 text-sm">先看单词→记住→输入拼写。考验真实记忆，每题 150 分。</p>
        </div>

        {/* Boss */}
        <div className={`glass-panel p-5 transition-all ${
          canBoss() ? 'hover:bg-white/15 cursor-pointer border-yellow-400/20' : 'opacity-50'
        }`}
          onClick={() => canBoss() && startBoss()}
        >
          <div className="flex items-center gap-3 mb-2">
            <Swords size={24} className="text-yellow-300" />
            <span className="text-white font-bold text-lg">每日 BOSS 战</span>
            <span className="glass-chip text-xs ml-auto text-yellow-300">💎 奖励</span>
          </div>
          <p className="text-white/50 text-sm">每天 1 次，综合 10 题，90 秒。通关获得钻石。最高: {save.bossHighScore} 分</p>
          {!canBoss() && <p className="text-red-300/60 text-xs mt-1">今日已完成，明天再来!</p>}
        </div>

        {/* Today's records */}
        {todayRecords.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-white/40 mb-2">今日记录</p>
            {todayRecords.slice(-5).map((r, i) => (
              <div key={i} className="flex justify-between text-xs text-white/50 mb-1">
                <span>得分 {r.score}</span>
                <span>{r.correct}/{r.total} 正确</span>
                <span>{r.time}s</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
