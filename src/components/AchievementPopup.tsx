import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const AchievementPopup: React.FC = () => {
  const achievements = useGameStore(s => s.newAchievements);
  const claim = useGameStore(s => s.claimAchievement);
  if (achievements.length === 0) return null;

  const a = achievements[0]; // show one at a time

  return (
    <div className="modal-backdrop z-[300]" onClick={() => claim(a.id)}>
      <div className="glass-panel w-[340px] max-w-[90vw] p-8 text-center animate-slideUp z-[301]" onClick={e => e.stopPropagation()}>
        <span className="text-5xl block mb-3">{a.icon}</span>
        <Trophy size={24} className="mx-auto mb-2 text-yellow-300" />
        <h2 className="text-xl font-bold text-white mb-1">🏆 {a.name}</h2>
        <p className="text-white/50 text-sm mb-4">{a.desc}</p>
        <div className="glass-chip mb-4">+3 💎 钻石奖励</div>
        <button className="glass-btn w-full" onClick={() => claim(a.id)}>
          太棒了! 🎉
        </button>
      </div>
    </div>
  );
};
