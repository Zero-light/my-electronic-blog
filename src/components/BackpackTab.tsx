/**
 * BackpackTab — Inventory / wardrobe management
 * View owned items, equip/unequip cosmetics
 */
import React from 'react';
import { Package, Shirt, Wand2, Palette, MessageCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { ShopItem } from '../data/types';

const ALL_ITEMS: ShopItem[] = [
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

const CATEGORY_INFO: Record<string, { label: string; icon: React.ReactNode }> = {
  hat:        { label: '头饰', icon: <Shirt size={14} /> },
  skin:       { label: '皮肤', icon: <Wand2 size={14} /> },
  background: { label: '背景', icon: <Palette size={14} /> },
  bubble:     { label: '台词', icon: <MessageCircle size={14} /> },
};

export const BackpackTab: React.FC = () => {
  const { save, doEquip, doUnequip } = useGameStore();
  const owned = ALL_ITEMS.filter(item => save.ownedItems.includes(item.id));
  const equipped = save.equippedItems;

  if (owned.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/50">
        <Package size={48} />
        <p className="text-sm">背包空空如也</p>
        <p className="text-xs">去商店买点东西吧 🛍️</p>
      </div>
    );
  }

  // Group by category
  const categories = ['hat', 'skin', 'background', 'bubble'] as const;
  const grouped: Record<string, ShopItem[]> = {};
  categories.forEach(cat => {
    grouped[cat] = owned.filter(i => i.category === cat);
  });

  return (
    <div className="flex flex-col w-full h-full pt-4 px-4 overflow-y-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Package size={18} className="text-white/60" />
        <span className="text-white/70 text-sm font-semibold">我的背包</span>
        <span className="glass-chip text-xs">💎 {save.diamonds}</span>
      </div>

      {categories.map(cat => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const info = CATEGORY_INFO[cat];

        return (
          <div key={cat} className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-white/50 text-xs">
              {info.icon}
              <span>{info.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {items.map(item => {
                const isEquipped = (equipped as any)[cat] === item.id;
                return (
                  <div key={item.id} className={`glass-panel p-3 flex flex-col items-center gap-1.5 ${
                    isEquipped ? 'border-white/40 bg-white/18' : ''
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] text-white/70 font-medium">{item.name}</span>
                    {isEquipped ? (
                      <button
                        className="text-[10px] px-2 py-1 rounded-full bg-white/15 text-white/60 hover:bg-white/25 transition-colors"
                        onClick={() => doUnequip(cat)}
                      >
                        卸下
                      </button>
                    ) : (
                      <button
                        className="glass-btn-feed glass-btn px-2 py-0.5 text-[10px]"
                        onClick={() => doEquip(cat, item.id)}
                      >
                        穿戴
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
