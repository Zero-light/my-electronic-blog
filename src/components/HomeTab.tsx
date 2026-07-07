import React, { useState } from 'react';
import { Apple, Hand, MessageCircle, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Pet } from './Pet';
import { ProgressBar } from './ProgressBar';
import { HouseView } from './HouseView';
import { HouseShop } from './HouseShop';
import { getLevelInfo, getNextEvo } from '../data/saveManager';

export const HomeTab: React.FC = () => {
  const { save, doFeed, doPet, openDialogue } = useGameStore();
  const [petState, setPetState] = useState<'idle' | 'eating'>('idle');
  const [showYum, setShowYum] = useState(false);
  const [petMsg, setPetMsg] = useState('');
  const [showHouseShop, setShowHouseShop] = useState(false);

  const mood = save.pet.hunger >= 70 && save.pet.happiness >= 60 ? 'happy' as const
    : save.pet.hunger >= 40 && save.pet.happiness >= 30 ? 'normal' as const
    : save.pet.hunger >= 20 ? 'sad' as const : 'hungry' as const;

  const handleFeed = () => { if (!doFeed()) return; setPetState('eating'); setShowYum(true); setTimeout(() => { setPetState('idle'); setShowYum(false); }, 800); };
  const handlePet = () => { const r = doPet(); setPetMsg(r.ok ? '♡ 好舒服~ (+2💰)' : `等 ${Math.ceil(r.cooldown/1000)} 秒`); setTimeout(() => setPetMsg(''), 1500); };

  const levelInfo = getLevelInfo(save.pet.level);
  const nextEvo = getNextEvo(save);

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 overflow-y-auto">
      {/* Stats row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
        <div className="glass-chip">💰 {save.gold}</div>
        <div className="glass-chip">🍎 {save.foodCount}</div>
        <div className="glass-chip">💎 {save.diamonds}</div>
        <div className="glass-chip">Day {save.dailyStreak}</div>
        <div className="glass-chip">{levelInfo.emoji} {levelInfo.label}</div>
      </div>

      {/* House + Pet */}
      <div className="w-full flex flex-col items-center mb-3">
        <HouseView />
      </div>

      {/* Pet inside house area */}
      <div className="flex flex-col items-center -mt-3 mb-2">
        <Pet
          type={save.currentPet}
          mood={mood}
          level={save.pet.level}
          state={petState}
          equippedHat={save.equippedItems.hat}
          equippedSkin={save.equippedItems.skin}
        />
        {petMsg && <div className="glass-chip mt-1 animate-fadeIn text-xs">{petMsg}</div>}
        {showYum && <div className="glass-chip mt-1 animate-slideUp text-warm-400 text-xs">🍎 好吃! (+3💰)</div>}
        <p className="text-white/35 text-[11px] mt-1">
          {mood === 'happy' ? '♡ 好开心~' : mood === 'normal' ? '平静' : mood === 'sad' ? '不太开心...' : '好饿...'}
        </p>
      </div>

      {/* Bars */}
      <div className="w-72 mb-1.5"><div className="flex justify-between text-[10px] text-white/40 mb-0.5"><span>饱食度</span><span>{Math.round(save.pet.hunger)}%</span></div><ProgressBar progress={save.pet.hunger / 100} /></div>
      <div className="w-72 mb-1.5"><div className="flex justify-between text-[10px] text-white/40 mb-0.5"><span>心情</span><span>{Math.round(save.pet.happiness)}%</span></div><ProgressBar progress={save.pet.happiness / 100} /></div>
      <div className="w-72 mb-2">
        <div className="flex justify-between text-[10px] text-white/40 mb-0.5">
          <span>进化 {nextEvo ? `→ ${nextEvo.emoji}` : '✨'}</span>
          <span>📖{save.totalWordsLearned} 🔄{save.totalWordsReviewed || 0}</span>
        </div>
        {nextEvo && <ProgressBar progress={Math.min(1, (save.totalWordsLearned / nextEvo.learned) * 0.6 + ((save.totalWordsReviewed || 0) / (nextEvo.reviewed || 1)) * 0.4)} />}
      </div>

      {/* Economy info */}
      <div className="text-[9px] text-white/25 mb-2 text-center">
        复习+💰5 | 喂食+💰3 | 摸头+💰2 | 对话+💰5 | 挑战少量💎 | 学习+🍎
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <button className="glass-btn glass-btn-feed text-xs px-3 py-2" onClick={handleFeed}><Apple size={14} /> 喂食</button>
        <button className="glass-btn text-xs px-3 py-2" onClick={handlePet}><Hand size={14} /> 摸头</button>
        <button className="glass-btn glass-btn-shop text-xs px-3 py-2" onClick={openDialogue}><MessageCircle size={14} /> 对话</button>
        <button className="glass-btn glass-btn-back text-xs px-3 py-2" onClick={() => setShowHouseShop(!showHouseShop)}>
          <Coins size={14} /> 家具
        </button>
      </div>

      {/* House shop panel */}
      {showHouseShop && <HouseShop />}
    </div>
  );
};
