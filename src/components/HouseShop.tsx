/**
 * HouseShop — Furniture purchasing + placement panel
 */
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { FURNITURE_CATALOG } from '../data/saveManager';

const TYPE_LABELS: Record<string, string> = {
  floor: '地毯', furniture: '家具', light: '灯饰', decor: '装饰', window: '窗户',
};

export const HouseShop: React.FC = () => {
  const { save, doBuyFurniture, doPlaceFurniture, doRemoveFurniture } = useGameStore();

  const grouped: Record<string, typeof FURNITURE_CATALOG> = {};
  FURNITURE_CATALOG.forEach(item => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });

  return (
    <div className="w-full max-w-lg px-2 mb-4">
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">🪑 家具商城</span>
          <span className="glass-chip text-xs">💰 {save.gold}</span>
        </div>

        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-3 last:mb-0">
            <p className="text-[11px] text-white/40 mb-1.5">{TYPE_LABELS[type] || type}</p>
            <div className="grid grid-cols-4 gap-2">
              {items.map(item => {
                const owned = save.furniture.includes(item.id);
                const placed = (save.placedFurniture || []).includes(item.id);
                return (
                  <div key={item.id} className={`glass-panel p-2 flex flex-col items-center gap-1 text-center ${
                    placed ? 'border-white/40 bg-white/15' : ''
                  }`}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] text-white/60 leading-tight">{item.name}</span>
                    {!owned ? (
                      <button
                        className="glass-btn-feed glass-btn px-2 py-0.5 text-[10px]"
                        onClick={() => doBuyFurniture(item.id)}
                      >
                        💰{item.cost}
                      </button>
                    ) : placed ? (
                      <button
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/12 text-white/50 hover:bg-white/20"
                        onClick={() => doRemoveFurniture(item.id)}
                      >
                        已放置
                      </button>
                    ) : (
                      <button
                        className="glass-btn px-2 py-0.5 text-[10px]"
                        onClick={() => doPlaceFurniture(item.id)}
                      >
                        放置
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
