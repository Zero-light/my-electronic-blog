import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { ShopItem } from '../data/types';

const ITEMS: ShopItem[] = [
  { id: 'hat_crown', category: 'hat', name: '小王冠', icon: '👑', price: 15, preview: '👑' },
  { id: 'hat_flower', category: 'hat', name: '小花', icon: '🌸', price: 8, preview: '🌸' },
  { id: 'hat_ribbon', category: 'hat', name: '蝴蝶结', icon: '🎀', price: 10, preview: '🎀' },
  { id: 'skin_lavender', category: 'skin', name: '薰衣草紫', icon: '💜', price: 20, preview: '💜' },
  { id: 'skin_mint', category: 'skin', name: '薄荷绿', icon: '💚', price: 20, preview: '💚' },
  { id: 'skin_coral', category: 'skin', name: '珊瑚橙', icon: '🧡', price: 20, preview: '🧡' },
  { id: 'bg_stars', category: 'background', name: '星空', icon: '🌟', price: 25, preview: '🌟' },
  { id: 'bg_ocean', category: 'background', name: '海洋', icon: '🌊', price: 25, preview: '🌊' },
  { id: 'bg_forest', category: 'background', name: '森林', icon: '🌲', price: 25, preview: '🌲' },
  { id: 'bubble_uwu', category: 'bubble', name: '卖萌台词', icon: '💬', price: 5, preview: '"加油~"' },
  { id: 'bubble_cool', category: 'bubble', name: '酷酷台词', icon: '😎', price: 5, preview: '"背单词!"' },
];

const CATS = [
  { id: 'hat' as const, label: '头饰' },
  { id: 'skin' as const, label: '皮肤' },
  { id: 'background' as const, label: '背景' },
  { id: 'bubble' as const, label: '台词' },
];

export const ShopTab: React.FC = () => {
  const { save, doBuyItem, doEquip, doUnequip } = useGameStore();
  const [cat, setCat] = useState<'hat'|'skin'|'background'|'bubble'>('hat');
  const items = ITEMS.filter(i => i.category === cat);

  return (
    <div className="flex flex-col w-full h-full pt-4 px-4">
      {/* Balance */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="glass-chip">🍎 {save.foodCount}</div>
        <div className="glass-chip">💎 {save.diamonds}</div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 justify-center mb-5">
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`text-xs px-4 py-2 rounded-full transition-colors ${
              cat === c.id ? 'bg-white/20 text-white font-semibold' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto w-full">
        {items.map(item => {
          const owned = save.ownedItems.includes(item.id);
          const equipped = (save.equippedItems as any)[cat] === item.id;
          return (
            <div key={item.id} className={`glass-panel p-4 flex flex-col items-center gap-1.5 ${
              equipped ? 'border-white/40 bg-white/18' : ''
            }`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-white/75">{item.name}</span>
              {owned ? (
                equipped ? (
                  <button
                    className="text-[11px] px-2 py-1 rounded-full bg-white/15 text-white/60 hover:bg-white/25"
                    onClick={() => doUnequip(cat)}
                  >
                    使用中 · 卸下
                  </button>
                ) : (
                  <button
                    className="glass-btn-feed glass-btn px-3 py-1 text-xs"
                    onClick={() => doEquip(cat, item.id)}
                  >
                    穿戴
                  </button>
                )
              ) : (
                <button
                  className="glass-btn-feed glass-btn px-3 py-1 text-xs"
                  onClick={() => doBuyItem(item)}
                >
                  🍎 {item.price}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
