/**
 * Pet.tsx — CSS-animated virtual pet
 * Pure CSS shapes + keyframes, zero bitmaps
 * Supports 5 evolution levels + equipped hat
 */
import React from 'react';

const LEVEL_CONFIG: Record<string, { scale: number; glow: string; extra: string }> = {
  egg:     { scale: 0.7, glow: '0 0 20px rgba(255,255,255,0.2)', extra: '🥚' },
  baby:    { scale: 0.85, glow: '0 0 25px rgba(255,255,255,0.25)', extra: '🐣' },
  growth:  { scale: 1, glow: '0 0 30px rgba(255,255,255,0.3)', extra: '🐱' },
  mature:  { scale: 1.15, glow: '0 0 40px rgba(255,255,255,0.35)', extra: '🦊' },
  perfect: { scale: 1.3, glow: '0 0 50px rgba(255,215,0,0.4)', extra: '⭐' },
};

interface PetProps {
  type: 'cloudy' | 'berry' | 'mochi' | 'pepper' | 'tangerine';
  mood: 'happy' | 'normal' | 'sad' | 'hungry';
  level: 'egg' | 'baby' | 'growth' | 'mature' | 'perfect';
  state?: 'idle' | 'eating' | 'sleeping';
  equippedHat?: string;
}

const COLORS: Record<string, { body: string; shadow: string; ear: string }> = {
  cloudy:    { body: '#A8D8EA', shadow: 'rgba(168,216,234,0.35)', ear: '#C5E5F0' },
  berry:     { body: '#FFB5C5', shadow: 'rgba(255,181,197,0.35)', ear: '#FFCDD8' },
  mochi:     { body: '#F5E6CA', shadow: 'rgba(245,230,202,0.35)', ear: '#FFF0DA' },
  pepper:    { body: '#7E7E7E', shadow: 'rgba(126,126,126,0.35)', ear: '#A0A0A0' },
  tangerine: { body: '#FDBE3F', shadow: 'rgba(253,190,63,0.40)', ear: '#FFD070' },
};

const HAT_EMOJIS: Record<string, string> = {
  hat_crown: '👑', hat_flower: '🌸', hat_ribbon: '🎀',
};

export const Pet: React.FC<PetProps> = ({ type, mood, level, state = 'idle', equippedHat }) => {
  const c = COLORS[type] || COLORS.cloudy;
  const lc = LEVEL_CONFIG[level] || LEVEL_CONFIG.baby;
  const alpha = mood === 'hungry' ? 0.5 : mood === 'sad' ? 0.75 : 1;
  const eyeClosed = mood === 'hungry' || state === 'sleeping';
  const mouth = mood === 'happy' ? 'smile' : (mood === 'sad' || mood === 'hungry') ? 'sad' : 'neutral';
  const animClass = state === 'eating' ? 'eating' : state === 'sleeping' ? 'sleeping' : mood === 'happy' ? 'happy' : 'idle';

  return (
    <div className={`pet-body ${animClass}`} style={{ opacity: alpha, transform: `scale(${lc.scale})` }}>
      {/* Level indicator */}
      <div className="pet-level-star">{lc.extra}</div>

      {/* Ground shadow */}
      <div style={{
        width: 100, height: 18, borderRadius: '50%',
        background: c.shadow, position: 'absolute',
        bottom: 0, left: '50%', transform: 'translateX(-50%)',
      }} />

      {/* Ears */}
      <div className="pet-ear pet-ear-left" style={{ background: c.ear }} />
      <div className="pet-ear pet-ear-right" style={{ background: c.ear }} />

      {/* Main body */}
      <div className="pet-shape" style={{ background: c.body, boxShadow: lc.glow }} />

      {/* Hat */}
      {equippedHat && HAT_EMOJIS[equippedHat] && (
        <div className="pet-hat">{HAT_EMOJIS[equippedHat]}</div>
      )}

      {/* Eyes */}
      <div className="pet-eyes">
        <div className={`pet-eye ${eyeClosed ? 'closed' : ''}`} />
        <div className={`pet-eye ${eyeClosed ? 'closed' : ''}`} />
      </div>

      {/* Blush */}
      {mood !== 'hungry' && (
        <div className="pet-blush">
          <div className="pet-blush-dot" />
          <div className="pet-blush-dot" />
        </div>
      )}

      {/* Mouth */}
      <div className="pet-mouth">
        <div className={`pet-mouth-line ${mouth === 'smile' ? 'smile' : mouth === 'sad' ? 'sad' : ''}`} />
      </div>
    </div>
  );
};
