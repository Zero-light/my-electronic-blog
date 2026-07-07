import React, { useState } from 'react';
import { Apple, Hand } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Pet } from './Pet';
import { ProgressBar } from './ProgressBar';
import { getLevelInfo, getNextEvo } from '../data/saveManager';

export const HomeTab: React.FC = () => {
  const { save, doFeed, doPet } = useGameStore();
  const [petState, setPetState] = useState<'idle' | 'eating'>('idle');
  const [showYum, setShowYum] = useState(false);
  const [petMsg, setPetMsg] = useState('');

  const mood = save.pet.hunger >= 70 && save.pet.happiness >= 60 ? 'happy' as const
    : save.pet.hunger >= 40 && save.pet.happiness >= 30 ? 'normal' as const
    : save.pet.hunger >= 20 ? 'sad' as const : 'hungry' as const;

  const handleFeed = () => {
    if (!doFeed()) return;
    setPetState('eating'); setShowYum(true);
    setTimeout(() => { setPetState('idle'); setShowYum(false); }, 800);
  };

  const handlePet = () => {
    const result = doPet();
    if (result.ok) { setPetMsg('♡ 好舒服~'); setPetState('idle'); setTimeout(() => setPetMsg(''), 1500); }
    else { setPetMsg(`等 ${Math.ceil(result.cooldown/1000)} 秒再摸吧~`); setTimeout(() => setPetMsg(''), 1500); }
  };

  const levelInfo = getLevelInfo(save.pet.level);
  const nextEvo = getNextEvo(save);

  return (
    <div className="flex flex-col items-center w-full h-full pt-6">
      {/* Stats row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="glass-chip">🍎 {save.foodCount}</div>
        <div className="glass-chip">💎 {save.diamonds}</div>
        <div className="glass-chip">Day {save.dailyStreak}</div>
        <div className="glass-chip">{levelInfo.emoji} {levelInfo.label}</div>
      </div>

      {/* Streak reward banner */}
      {useGameStore(s => s.showStreakReward) && (
        <div className="glass-panel px-5 py-2.5 mb-3 animate-slideUp">
          <span className="text-sm font-bold text-yellow-300">
            {useGameStore(s => s.showStreakReward)?.label}!
          </span>
          <span className="text-xs text-white/60 ml-2">连续 {save.dailyStreak} 天奖励已发放</span>
        </div>
      )}

      {/* Pet area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <Pet
          type={save.currentPet}
          mood={mood}
          level={save.pet.level}
          state={petState}
          equippedHat={save.equippedItems.hat}
          equippedSkin={save.equippedItems.skin}
        />

        {petMsg && <div className="glass-chip mt-2 animate-fadeIn text-sm">{petMsg}</div>}
        {showYum && <div className="glass-chip mt-2 animate-slideUp text-warm-400">🍎 好吃!</div>}

        <p className="text-white/40 text-xs mt-2">
          {mood === 'happy' ? '♡ 好开心~' : mood === 'normal' ? '平静' : mood === 'sad' ? '不太开心...' : '好饿...zzz'}
        </p>
      </div>

      {/* Hunger bar */}
      <div className="w-72 mb-2">
        <div className="flex justify-between text-xs text-white/40 mb-0.5"><span>饱食度</span><span>{Math.round(save.pet.hunger)}%</span></div>
        <ProgressBar progress={save.pet.hunger / 100} />
      </div>

      {/* Happiness bar */}
      <div className="w-72 mb-2">
        <div className="flex justify-between text-xs text-white/40 mb-0.5"><span>心情</span><span>{Math.round(save.pet.happiness)}%</span></div>
        <ProgressBar progress={save.pet.happiness / 100} />
      </div>

      {/* Evolution progress */}
      <div className="w-72 mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-0.5">
          <span>进化 {nextEvo ? `→ ${nextEvo.emoji}${nextEvo.label}` : '✨ 已满级'}</span>
          <span>
            📖{save.totalWordsLearned}词 🔄{save.totalWordsReviewed || 0}词
          </span>
        </div>
        {nextEvo && (
          <ProgressBar progress={
            Math.min(1,
              (save.totalWordsLearned / nextEvo.learned) * 0.6 +
              ((save.totalWordsReviewed || 0) / (nextEvo.reviewed || 1)) * 0.4
            )
          } />
        )}
        {!nextEvo && (
          <div className="glass-progress">
            <div className="glass-progress-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #FFD70080, #FFD700)' }} />
          </div>
        )}
      </div>

      {/* Diamond earning info */}
      <div className="text-[10px] text-white/30 mb-3">
        每 50 词📖+3💎 | 每 50 复习🔄+2💎 | 满分回合+3💎 | Streak 奖励💎
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-4">
        <button className="glass-btn glass-btn-feed" onClick={handleFeed}>
          <Apple size={15} /> 喂食
        </button>
        <button className="glass-btn" onClick={handlePet}>
          <Hand size={15} /> 摸头
        </button>
      </div>
    </div>
  );
};
