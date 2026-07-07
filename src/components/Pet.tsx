/**
 * Pet.tsx — CSS-animated virtual pet
 * Pure CSS shapes + keyframes, zero bitmaps
 */
import React from 'react';

interface PetProps {
  type: 'cloudy' | 'berry' | 'mochi' | 'pepper' | 'tangerine';
  mood: 'happy' | 'normal' | 'sad' | 'hungry';
  level: 'baby' | 'adult' | 'full';
  state?: 'idle' | 'eating' | 'sleeping';
}

const COLORS: Record<string, { body: string; shadow: string; ear: string; highlight: string }> = {
  cloudy:    { body: '#A8D8EA', shadow: 'rgba(168,216,234,0.35)', ear: '#C5E5F0', highlight: '0 0 30px rgba(168,216,234,0.3)' },
  berry:     { body: '#FFB5C5', shadow: 'rgba(255,181,197,0.35)', ear: '#FFCDD8', highlight: '0 0 30px rgba(255,181,197,0.3)' },
  mochi:     { body: '#F5E6CA', shadow: 'rgba(245,230,202,0.35)', ear: '#FFF0DA', highlight: '0 0 30px rgba(245,230,202,0.3)' },
  pepper:    { body: '#7E7E7E', shadow: 'rgba(126,126,126,0.35)', ear: '#A0A0A0', highlight: '0 0 30px rgba(126,126,126,0.3)' },
  tangerine: { body: '#FDBE3F', shadow: 'rgba(253,190,63,0.40)', ear: '#FFD070', highlight: '0 0 30px rgba(253,190,63,0.35)' },
};

export const Pet: React.FC<PetProps> = ({ type, mood, level, state = 'idle' }) => {
  const c = COLORS[type] || COLORS.cloudy;
  const alpha = mood === 'hungry' ? 0.5 : mood === 'sad' ? 0.75 : 1;
  const eyeClosed = mood === 'hungry' || state === 'sleeping';
  const mouth = mood === 'happy' ? 'smile' : (mood === 'sad' || mood === 'hungry') ? 'sad' : 'neutral';
  const animClass = state === 'eating' ? 'eating' : state === 'sleeping' ? 'sleeping' : mood === 'happy' ? 'happy' : 'idle';

  return (
    <div className={`pet-body ${animClass}`} style={{ opacity: alpha }}>
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
      <div
        className="pet-shape"
        style={{ background: c.body, boxShadow: c.highlight }}
      />

      {/* Level star */}
      {level === 'full' && <div className="pet-level-star">⭐</div>}

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

      {/* Hat for berry */}
      {type === 'berry' && <div className="pet-hat">🍀</div>}
      {type === 'tangerine' && <div className="pet-hat">🌿</div>}
    </div>
  );
};
