import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HouseView } from './HouseView';
import { HouseShop } from './HouseShop';
import { HOUSE_TIERS } from '../data/saveManager';

export const HouseTab: React.FC = () => {
  const save = useGameStore(s => s.save);
  const tier = save.houseTier;
  const info = HOUSE_TIERS[tier];
  const nextInfo = tier < 4 ? HOUSE_TIERS[tier + 1] : null;

  return (
    <div className="flex flex-col items-center w-full h-full pt-4 px-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="glass-chip">💰 {save.gold}</div>
        <div className="glass-chip">{info.emoji} {info.name}</div>
        {nextInfo && <div className="glass-chip text-xs text-white/40">下一级: {nextInfo.name} 💰{nextInfo.cost}</div>}
      </div>

      {/* House */}
      <HouseView />

      {/* Furniture shop */}
      <HouseShop />
    </div>
  );
};
