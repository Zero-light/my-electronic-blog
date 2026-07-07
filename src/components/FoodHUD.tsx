import React from 'react';
import { Apple, Zap, CalendarDays } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const FoodHUD: React.FC = () => {
  const save = useGameStore(s => s.save);
  const levelNum = save.pet.level === 'baby' ? 1 : save.pet.level === 'adult' ? 2 : 3;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
      {/* Apple count */}
      <div className="glass-chip">
        <Apple size={16} className="text-warm-400" fill="#FF8C69" />
        <span>{save.foodCount}</span>
      </div>

      {/* Day counter */}
      <div className="glass-chip">
        <CalendarDays size={14} />
        <span>Day {save.dailyStreak || 1}</span>
      </div>

      {/* LV + XP */}
      <div className="glass-chip">
        <Zap size={14} className="text-yellow-400" fill="#FFD700" />
        <span>LV {levelNum}</span>
      </div>
    </div>
  );
};
