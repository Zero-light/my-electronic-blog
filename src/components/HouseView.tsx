/**
 * HouseView — CSS dollhouse (cross-section, see inside)
 * Tier 0=空地, 1=平房, 2=小康房, 3=二层楼, 4=别墅
 * Furniture placed inside as emoji overlays
 */
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { HOUSE_TIERS, FURNITURE_CATALOG } from '../data/saveManager';

// House dimensions for each tier
const HOUSE_STYLES: Record<number, { w: number; h: number; roof: string; wall: string; door: string; windows: number }> = {
  0: { w: 0, h: 0, roof: '', wall: '', door: '', windows: 0 },
  1: { w: 200, h: 140, roof: '#C4956A', wall: '#F5E6CA', door: '#A0522D', windows: 1 },
  2: { w: 260, h: 160, roof: '#D4956B', wall: '#FFF8EE', door: '#8B4513', windows: 2 },
  3: { w: 280, h: 240, roof: '#B8845C', wall: '#FFFDF5', door: '#6B3410', windows: 3 },
  4: { w: 340, h: 260, roof: '#A07050', wall: '#FFFFF8', door: '#5C2D0E', windows: 4 },
};

// Furniture positions per house tier
function getFurnitureSlots(tier: number): { x: number; y: number; type: string }[] {
  if (tier === 1) return [
    { x: 15, y: 70, type: 'floor' }, { x: 100, y: 70, type: 'floor' },
    { x: 15, y: 40, type: 'furniture' }, { x: 80, y: 30, type: 'decor' },
  ];
  if (tier === 2) return [
    { x: 15, y: 80, type: 'floor' }, { x: 100, y: 80, type: 'floor' },
    { x: 15, y: 45, type: 'furniture' }, { x: 100, y: 45, type: 'furniture' },
    { x: 170, y: 30, type: 'light' }, { x: 30, y: 20, type: 'decor' },
  ];
  if (tier === 3) return [
    // Ground floor
    { x: 15, y: 150, type: 'floor' }, { x: 100, y: 150, type: 'floor' },
    { x: 15, y: 115, type: 'furniture' }, { x: 100, y: 115, type: 'furniture' },
    { x: 170, y: 140, type: 'light' }, { x: 30, y: 130, type: 'decor' },
    // Upper floor
    { x: 15, y: 50, type: 'floor' }, { x: 100, y: 50, type: 'floor' },
    { x: 15, y: 20, type: 'furniture' }, { x: 100, y: 20, type: 'furniture' },
    { x: 200, y: 75, type: 'window' },
  ];
  if (tier === 4) return [
    // Ground floor
    { x: 15, y: 180, type: 'floor' }, { x: 100, y: 180, type: 'floor' },
    { x: 15, y: 145, type: 'furniture' }, { x: 100, y: 145, type: 'furniture' },
    { x: 200, y: 145, type: 'furniture' }, { x: 170, y: 170, type: 'light' },
    { x: 30, y: 160, type: 'decor' }, { x: 180, y: 130, type: 'decor' },
    // Upper floor
    { x: 15, y: 65, type: 'floor' }, { x: 100, y: 65, type: 'floor' },
    { x: 15, y: 35, type: 'furniture' }, { x: 100, y: 35, type: 'furniture' },
    { x: 240, y: 100, type: 'window' }, { x: 240, y: 25, type: 'window' },
  ];
  return [];
}

export const HouseView: React.FC = () => {
  const { save, doUpgradeHouse } = useGameStore();
  const tier = save.houseTier;
  const info = HOUSE_TIERS[tier];
  const style = HOUSE_STYLES[tier];
  const slots = getFurnitureSlots(tier);

  // Tier 0 — empty ground
  if (tier === 0) {
    return (
      <div className="relative w-full flex flex-col items-center">
        {/* Ground */}
        <div className="w-72 h-4 rounded-full bg-green-700/20 mb-1" />
        <div className="text-xs text-white/30 mb-2">🏕️ 一片空地</div>
        <button className="glass-btn text-xs px-4 py-1.5" onClick={() => doUpgradeHouse()}>
          🏠 建平房 — 💰 {HOUSE_TIERS[1].cost}
        </button>
      </div>
    );
  }

  const placedFurniture = save.placedFurniture || [];
  const furnitureMap = new Map(FURNITURE_CATALOG.map(f => [f.id, f]));

  return (
    <div className="relative flex flex-col items-center" style={{ width: style.w, margin: '0 auto' }}>
      {/* Sky/background */}
      <div className="absolute inset-0 rounded-lg" style={{
        background: tier >= 4
          ? 'linear-gradient(180deg, rgba(135,206,235,0.2) 0%, rgba(255,255,255,0.05) 60%)'
          : 'transparent'
      }} />

      {/* Roof */}
      <div style={{
        width: style.w + 20, height: 30,
        background: style.roof,
        clipPath: 'polygon(0% 100%, 15% 0%, 85% 0%, 100% 100%)',
        position: 'relative', zIndex: 2,
      }} />
      {tier >= 2 && (
        <div style={{
          width: style.w + 20, height: 8,
          background: '#8B6914', marginTop: -1, zIndex: 1,
        }} />
      )}

      {/* House body — open front (cross-section) */}
      <div style={{
        width: style.w, height: style.h,
        background: `linear-gradient(180deg, ${style.wall} 0%, ${style.wall}DD 100%)`,
        borderRadius: '4px 4px 0 0',
        position: 'relative',
        border: '1.5px solid rgba(139,90,43,0.3)',
        borderBottom: 'none',
        overflow: 'hidden',
      }}>
        {/* Floor divider for 2+ story */}
        {tier >= 3 && (
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: '50%', height: 4,
            background: '#C4956A',
            zIndex: 3,
          }} />
        )}

        {/* Windows */}
        {Array.from({ length: style.windows }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            right: 10 + i * 55,
            top: tier >= 3 && i % 2 === 1 ? '55%' : '10%',
            width: 35, height: 35,
            background: 'rgba(135,206,235,0.3)',
            border: '2px solid rgba(139,90,43,0.4)',
            borderRadius: 3,
            zIndex: 2,
          }}>
            <div style={{
              position: 'absolute',
              top: '50%', left: 0, right: 0, height: 2,
              background: 'rgba(139,90,43,0.5)',
            }} />
            <div style={{
              position: 'absolute',
              left: '50%', top: 0, bottom: 0, width: 2,
              background: 'rgba(139,90,43,0.5)',
            }} />
          </div>
        ))}

        {/* Door */}
        <div style={{
          position: 'absolute',
          left: style.w / 2 - 14,
          bottom: 0,
          width: 28, height: style.h * 0.35,
          background: style.door,
          borderRadius: '8px 8px 0 0',
          border: '2px solid rgba(0,0,0,0.15)',
          zIndex: 5,
        }}>
          <div style={{
            position: 'absolute',
            right: 4, top: '50%',
            width: 4, height: 4,
            borderRadius: '50%',
            background: '#FFD700',
          }} />
        </div>

        {/* Placed furniture */}
        {slots.map((slot, i) => {
          const furnitureId = placedFurniture[i];
          if (!furnitureId) return null;
          const furn = furnitureMap.get(furnitureId);
          if (!furn) return null;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: slot.x, top: slot.y,
              fontSize: tier >= 3 ? '22px' : '18px',
              zIndex: 10,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
            }}>
              {furn.icon}
            </div>
          );
        })}
      </div>

      {/* Ground */}
      <div style={{
        width: style.w + 30, height: 12,
        borderRadius: '50%',
        background: tier >= 4
          ? 'linear-gradient(90deg, #90EE9080, #228B2240, #90EE9080)'
          : tier >= 3
          ? 'linear-gradient(90deg, #90EE9060, #228B2230, #90EE9060)'
          : 'rgba(34,139,34,0.25)',
        marginTop: -4,
      }} />

      {/* Upgrade button */}
      {tier < 4 && (
        <button
          className="glass-btn text-xs px-3 py-1 mt-2"
          onClick={() => doUpgradeHouse()}
        >
          {HOUSE_TIERS[tier + 1].emoji} 升级到{HOUSE_TIERS[tier + 1].name} — 💰 {HOUSE_TIERS[tier + 1].cost}
        </button>
      )}
    </div>
  );
};
