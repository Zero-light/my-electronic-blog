import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Pet } from './Pet';
import { ProgressBar } from './ProgressBar';

export const HomeTab: React.FC = () => {
  const { save, doFeed } = useGameStore();
  const [petState, setPetState] = useState<'idle' | 'eating'>('idle');
  const [showYum, setShowYum] = useState(false);

  const mood = save.pet.hunger >= 70 ? 'happy' as const
    : save.pet.hunger >= 40 ? 'normal' as const
    : save.pet.hunger >= 20 ? 'sad' as const : 'hungry' as const;

  const handleFeed = () => {
    if (!doFeed()) return;
    setPetState('eating');
    setShowYum(true);
    setTimeout(() => { setPetState('idle'); setShowYum(false); }, 800);
  };

  const levelNum = save.pet.level === 'baby' ? 1 : save.pet.level === 'adult' ? 2 : 3;

  return (
    <div className="flex flex-col items-center w-full h-full pt-8">
      {/* Stats row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="glass-chip">🍎 {save.foodCount}</div>
        <div className="glass-chip">Day {save.dailyStreak}</div>
        <div className="glass-chip">LV {levelNum}</div>
      </div>

      {/* Pet */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <Pet
          type={save.currentPet as any}
          mood={mood}
          level={save.pet.level as any}
          state={petState}
        />

        {showYum && (
          <div className="glass-chip mt-2 animate-slideUp text-warm-400">
            🍎 好吃!
          </div>
        )}

        {/* Mood text */}
        <p className="text-white/40 text-sm mt-3">
          {mood === 'happy' ? '♡ 好开心~' : mood === 'normal' ? '平静' : mood === 'sad' ? '有点饿...' : '好饿...zzz'}
        </p>
      </div>

      {/* Hunger bar */}
      <div className="w-72 mb-3">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>饱食度</span>
          <span>{Math.round(save.pet.hunger)}%</span>
        </div>
        <ProgressBar progress={save.pet.hunger / 100} />
      </div>

      {/* XP bar */}
      <div className="w-72 mb-6">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>经验 LV{levelNum}</span>
          <span>{save.pet.xp}/{save.pet.level === 'baby' ? 100 : save.pet.level === 'adult' ? 300 : 500}</span>
        </div>
        <ProgressBar progress={
          save.pet.level === 'baby' ? save.pet.xp / 100
          : save.pet.level === 'adult' ? (save.pet.xp - 100) / 200 : (save.pet.xp - 300) / 200
        } />
      </div>

      {/* Feed button */}
      <button className="glass-btn glass-btn-feed mb-4" onClick={handleFeed}>
        <Apple size={16} /> 喂食 (-5🍎)
      </button>
    </div>
  );
};
