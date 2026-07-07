/**
 * ShopDrawer — Cosmetics Shop (slide from right)
 */
import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { ShopItem } from '../data/types';

const SHOP: ShopItem[] = [
  { id: 'hat_crown', category: 'hat', name: '小王冠', icon: '👑', price: 15, preview: '👑' },
  { id: 'hat_flower', category: 'hat', name: '小花', icon: '🌸', price: 8, preview: '🌸' },
  { id: 'hat_ribbon', category: 'hat', name: '蝴蝶结', icon: '🎀', price: 10, preview: '🎀' },
  { id: 'skin_lavender', category: 'skin', name: '薰衣草紫', icon: '💜', price: 20, preview: '💜' },
  { id: 'skin_mint', category: 'skin', name: '薄荷绿', icon: '💚', price: 20, preview: '💚' },
  { id: 'skin_coral', category: 'skin', name: '珊瑚橙', icon: '🧡', price: 20, preview: '🧡' },
  { id: 'bg_stars', category: 'background', name: '星空', icon: '🌟', price: 25, preview: '🌟' },
  { id: 'bg_ocean', category: 'background', name: '海洋', icon: '🌊', price: 25, preview: '🌊' },
  { id: 'bg_forest', category: 'background', name: '森林', icon: '🌲', price: 25, preview: '🌲' },
  { id: 'bubble_uwu', category: 'bubble', name: '卖萌', icon: '💬', price: 5, preview: '"加油~"' },
  { id: 'bubble_cool', category: 'bubble', name: '酷酷', icon: '😎', price: 5, preview: '"背单词!"' },
];

const CATS = [
  { id: 'hat', label: '头饰' },
  { id: 'skin', label: '皮肤' },
  { id: 'background', label: '背景' },
  { id: 'bubble', label: '台词' },
];

export const ShopDrawer: React.FC = () => {
  const { save, doBuyItem, toggleShop } = useGameStore();
  const [cat, setCat] = useState('hat');
  const items = SHOP.filter(i => i.category === cat);

  return (
    <>
      <div className="drawer-overlay" onClick={toggleShop} />
      <div className="drawer-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag size={18} /> 装扮商城
          </h2>
          <button onClick={toggleShop} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Apple balance */}
        <div className="glass-chip mb-4">🍎 {save.foodCount}</div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-5">
          {CATS.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                cat === c.id
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => {
            const owned = save.ownedItems.includes(item.id);
            return (
              <div
                key={item.id}
                className="glass-panel p-4 flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-white/80">{item.name}</span>
                {owned ? (
                  <span className="text-xs text-green-300 font-medium">已拥有</span>
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
    </>
  );
};
