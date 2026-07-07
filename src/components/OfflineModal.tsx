/**
 * OfflineModal — Welcome back rewards popup
 */
import React, { useEffect, useState } from 'react';
import { Moon, Clock, Apple, Heart } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const OfflineModal: React.FC = () => {
  const save = useGameStore(s => s.save);
  const dismiss = useGameStore(s => s.dismissOffline);
  const reward = save.offlineRewards;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reward) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [reward]);

  if (!reward) return null;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(dismiss, 300);
  };

  return (
    <div className={`modal-backdrop z-[300] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleDismiss}>
      <div
        className={`glass-panel w-[340px] max-w-[90vw] p-8 text-center transition-all duration-500 ${
          visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <Moon size={40} className="mx-auto mb-3 text-ice-300" />
        <h2 className="text-xl font-bold text-white mb-2">欢迎回来! 🌙</h2>

        <div className="flex items-center justify-center gap-2 mb-1 text-white/60 text-sm">
          <Clock size={14} />
          <span>离线 {reward.offlineHours} 小时</span>
        </div>

        <div className="flex items-center justify-center gap-4 my-4">
          <div className="flex items-center gap-1.5">
            <Heart size={16} className="text-red-400" fill="#FF8C69" />
            <span className="text-white font-semibold">+{reward.hungerRecovered}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Apple size={16} className="text-warm-400" fill="#FF8C69" />
            <span className="text-white font-semibold">+{reward.bonusApples}</span>
          </div>
        </div>

        <button className="glass-btn mt-3 w-full" onClick={handleDismiss}>
          收下! 🎁
        </button>
      </div>
    </div>
  );
};
