/**
 * PetGallery — Pet selection modal
 */
import React from 'react';
import { X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { PetType } from '../data/types';

const PETS: { id: PetType; name: string; icon: string }[] = [
  { id: 'cloudy', name: 'Cloudy 云小逗', icon: '☁️' },
  { id: 'berry', name: 'Berry 莓莓', icon: '🍓' },
  { id: 'mochi', name: 'Mochi 麻薯', icon: '🍡' },
  { id: 'pepper', name: 'Pepper 小椒', icon: '🐕' },
  { id: 'tangerine', name: 'Tangerine 橘子', icon: '🍊' },
];

export const PetGallery: React.FC = () => {
  const { save, doSwitchPet, togglePetGallery } = useGameStore();

  return (
    <div className="modal-backdrop z-[200]" onClick={togglePetGallery}>
      <div className="glass-panel w-[380px] max-w-[90vw] p-6 animate-slideUp z-[201]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">🐾 宠物图鉴</h2>
          <button onClick={togglePetGallery} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {PETS.map(pet => {
            const unlocked = save.unlockedPets.includes(pet.id);
            const active = save.currentPet === pet.id;
            return (
              <div
                key={pet.id}
                className={`glass-panel p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  active ? 'border-white/40 bg-white/20' : ''
                } ${!unlocked ? 'opacity-50' : ''}`}
                onClick={() => unlocked && doSwitchPet(pet.id)}
              >
                <span className="text-2xl">{pet.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{pet.name}</p>
                  <p className="text-xs text-white/40">
                    {active ? '当前使用' : unlocked ? '点击切换' : '🔒 未解锁'}
                  </p>
                </div>
                {active && (
                  <span className="glass-chip text-green-300 text-xs">使用中</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
