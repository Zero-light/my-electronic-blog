/**
 * Pet.tsx — CSS-animated virtual pet with skin tint support
 */
import React from 'react';

const LEVEL_CONFIG: Record<string, { scale: number; glow: string; extra: string }> = {
  egg:     { scale: 0.7, glow: '0 0 20px rgba(255,255,255,0.2)', extra: '🥚' },
  baby:    { scale: 0.85, glow: '0 0 25px rgba(255,255,255,0.25)', extra: '🐣' },
  growth:  { scale: 1, glow: '0 0 30px rgba(255,255,255,0.3)', extra: '🐱' },
  mature:  { scale: 1.15, glow: '0 0 40px rgba(255,255,255,0.35)', extra: '🦊' },
  perfect: { scale: 1.3, glow: '0 0 50px rgba(255,215,0,0.4)', extra: '🦄' },
};

// Skin tints: override pet body color
const SKIN_COLORS: Record<string, string> = {
  skin_lavender: '#C9A0DC',
  skin_mint: '#7ECB9A',
  skin_coral: '#FF8C69',
  skin_galaxy: '#6C63FF',
};

interface PetProps {
  type: string;
  mood: 'happy' | 'normal' | 'sad' | 'hungry';
  level: string;
  state?: 'idle' | 'eating' | 'sleeping';
  equippedHat?: string;
  equippedSkin?: string;
}

const BASE_COLORS: Record<string, { body: string; shadow: string; ear: string }> = {
  cloudy:    { body: '#A8D8EA', shadow: 'rgba(168,216,234,0.35)', ear: '#C5E5F0' },
  berry:     { body: '#FFB5C5', shadow: 'rgba(255,181,197,0.35)', ear: '#FFCDD8' },
  mochi:     { body: '#F5E6CA', shadow: 'rgba(245,230,202,0.35)', ear: '#FFF0DA' },
  pepper:    { body: '#7E7E7E', shadow: 'rgba(126,126,126,0.35)', ear: '#A0A0A0' },
  tangerine: { body: '#FDBE3F', shadow: 'rgba(253,190,63,0.40)', ear: '#FFD070' },
};

const HAT_EMOJIS: Record<string, string> = {
  hat_crown: '👑', hat_flower: '🌸', hat_ribbon: '🎀',
};

export const Pet: React.FC<PetProps> = ({ type, mood, level, state = 'idle', equippedHat, equippedSkin }) => {
  const base = BASE_COLORS[type] || BASE_COLORS.cloudy;
  // Apply skin tint if equipped
  const bodyColor = (equippedSkin && SKIN_COLORS[equippedSkin]) ? SKIN_COLORS[equippedSkin] : base.body;
  const earColor = (equippedSkin && SKIN_COLORS[equippedSkin]) ? SKIN_COLORS[equippedSkin] : base.ear;
  const shadowColor = (equippedSkin && SKIN_COLORS[equippedSkin])
    ? SKIN_COLORS[equippedSkin].replace(')', ',0.35)').replace('rgb', 'rgba')
    : base.shadow;

  const c = { body: bodyColor, shadow: shadowColor, ear: earColor };
  const lc = LEVEL_CONFIG[level] || LEVEL_CONFIG.baby;
  const alpha = mood === 'hungry' ? 0.5 : mood === 'sad' ? 0.75 : 1;
  const eyeClosed = mood === 'hungry' || state === 'sleeping';
  const mouth = mood === 'happy' ? 'smile' : (mood === 'sad' || mood === 'hungry') ? 'sad' : 'neutral';
  const animClass = state === 'eating' ? 'eating' : state === 'sleeping' ? 'sleeping' : mood === 'happy' ? 'happy' : 'idle';

  // Create a rgba shadow from the body hex color
  const getShadowRGBA = (hex: string) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},0.35)`;
  };

  return (
    <div className={`pet-body ${animClass}`} style={{ opacity: alpha, transform: `scale(${lc.scale})` }}>
      <div className="pet-level-star">{lc.extra}</div>

      <div style={{
        width: 100, height: 18, borderRadius: '50%',
        background: getShadowRGBA(c.body), position: 'absolute',
        bottom: 0, left: '50%', transform: 'translateX(-50%)',
      }} />

      <div className="pet-ear pet-ear-left" style={{ background: c.ear }} />
      <div className="pet-ear pet-ear-right" style={{ background: c.ear }} />

      <div className="pet-shape" style={{ background: c.body, boxShadow: lc.glow }} />

      {equippedHat && HAT_EMOJIS[equippedHat] && (
        <div className="pet-hat">{HAT_EMOJIS[equippedHat]}</div>
      )}

      <div className="pet-eyes">
        <div className={`pet-eye ${eyeClosed ? 'closed' : ''}`} />
        <div className={`pet-eye ${eyeClosed ? 'closed' : ''}`} />
      </div>

      {mood !== 'hungry' && (
        <div className="pet-blush">
          <div className="pet-blush-dot" />
          <div className="pet-blush-dot" />
        </div>
      )}

      <div className="pet-mouth">
        <div className={`pet-mouth-line ${mouth === 'smile' ? 'smile' : mouth === 'sad' ? 'sad' : ''}`} />
      </div>
    </div>
  );
};
