/**
 * Pet.tsx — SVG Vector Pet (5 types, pure vector, zero blur)
 * Renders at any size without pixelation.
 * Types: cloudy | berry | mochi | pepper | tangerine
 */
import React from 'react';

interface PetProps {
  type: 'cloudy' | 'berry' | 'mochi' | 'pepper' | 'tangerine';
  mood: 'happy' | 'normal' | 'sad' | 'hungry'; // hungry = very low
  level: 'baby' | 'adult' | 'full';
  size?: number;
  className?: string;
}

const PET_COLORS: Record<string, { body: string; bodyLight: string; accent: string; }> = {
  cloudy:    { body: '#A8D8EA', bodyLight: '#CEEAF2', accent: '#D4EEF1' },
  berry:     { body: '#FFB5C5', bodyLight: '#FFCCD6', accent: '#FFE0E6' },
  mochi:     { body: '#F5E6CA', bodyLight: '#FFF0DA', accent: '#FFF3E0' },
  pepper:    { body: '#6E6E6E', bodyLight: '#909090', accent: '#A0A0A0' },
  tangerine: { body: '#FDBE3F', bodyLight: '#FFD070', accent: '#FFE0A0' },
};

export const Pet: React.FC<PetProps> = ({ type, mood, level, size = 220, className }) => {
  const c = PET_COLORS[type] || PET_COLORS.cloudy;
  const s = size;
  const cx = s / 2;
  const cy = s / 2 + 10;
  const alpha = mood === 'hungry' ? 0.45 : mood === 'sad' ? 0.7 : 1;

  // Body dimensions
  const bw = s * 0.6;
  const bh = s * 0.55;
  const earSize = s * 0.18;
  const eyeSize = s * 0.06;

  const eyeClosed = mood === 'hungry';
  const mouthType = mood === 'happy' ? 'smile' : mood === 'sad' || mood === 'hungry' ? 'frown' : 'neutral';

  return (
    <svg
      width={s} height={s + 30}
      viewBox={`0 0 ${s} ${s + 30}`}
      className={className}
      style={{ opacity: alpha, transition: 'opacity 0.5s ease' }}
    >
      {/* Ground shadow */}
      <ellipse cx={cx} cy={cy + bh * 0.55} rx={bw * 0.55} ry={bh * 0.12}
        fill={c.body} opacity={0.15} />

      {/* Body — main ellipse */}
      <ellipse cx={cx} cy={cy} rx={bw} ry={bh}
        fill={c.bodyLight} />
      <ellipse cx={cx} cy={cy - bh * 0.08} rx={bw * 0.92} ry={bh * 0.88}
        fill={c.body} />

      {/* Glass highlight — top reflection */}
      <ellipse cx={cx - bw * 0.05} cy={cy - bh * 0.32} rx={bw * 0.42} ry={bh * 0.2}
        fill="white" opacity={0.25} />
      <ellipse cx={cx - bw * 0.15} cy={cy - bh * 0.38} rx={bw * 0.15} ry={bh * 0.08}
        fill="white" opacity={0.3} />

      {/* Ears / Features per type */}
      {type === 'cloudy' && (
        <>
          <ellipse cx={cx - bw * 0.6} cy={cy - bh * 0.55} rx={earSize * 1.1} ry={earSize}
            fill={c.accent} />
          <ellipse cx={cx + bw * 0.6} cy={cy - bh * 0.55} rx={earSize * 1.1} ry={earSize}
            fill={c.accent} />
          <ellipse cx={cx} cy={cy - bh * 0.75} rx={earSize * 0.85} ry={earSize * 0.8}
            fill={c.accent} />
        </>
      )}
      {type === 'berry' && (
        <>
          <ellipse cx={cx - bw * 0.58} cy={cy - bh * 0.52} rx={earSize * 0.85} ry={earSize * 0.85}
            fill={c.accent} />
          <ellipse cx={cx + bw * 0.58} cy={cy - bh * 0.52} rx={earSize * 0.85} ry={earSize * 0.85}
            fill={c.accent} />
          {/* Strawberry leaf */}
          <ellipse cx={cx} cy={cy - bh * 0.75} rx={earSize * 0.25} ry={earSize * 0.4}
            fill="#54B86F" />
          <polygon points={`${cx - earSize * 0.22},${cy - bh * 0.75} ${cx},${cy - bh * 0.98} ${cx + earSize * 0.22},${cy - bh * 0.75}`}
            fill="#6CCB7F" />
        </>
      )}
      {type === 'mochi' && (
        <>
          <ellipse cx={cx - bw * 0.55} cy={cy - bh * 0.48} rx={earSize * 0.7} ry={earSize * 0.75}
            fill={c.accent} />
          <ellipse cx={cx + bw * 0.55} cy={cy - bh * 0.48} rx={earSize * 0.7} ry={earSize * 0.75}
            fill={c.accent} />
          {/* Mochi dimple */}
          <ellipse cx={cx} cy={cy - bh * 0.15} rx={bw * 0.12} ry={bh * 0.04}
            fill={c.bodyLight} opacity={0.6} />
        </>
      )}
      {type === 'pepper' && (
        <>
          <polygon points={`${cx - bw * 0.6},${cy - bh * 0.3} ${cx - bw * 0.28},${cy - bh * 0.9} ${cx - bw * 0.1},${cy - bh * 0.2}`}
            fill={c.accent} />
          <polygon points={`${cx + bw * 0.6},${cy - bh * 0.3} ${cx + bw * 0.28},${cy - bh * 0.9} ${cx + bw * 0.1},${cy - bh * 0.2}`}
            fill={c.accent} />
        </>
      )}
      {type === 'tangerine' && (
        <>
          {/* Orange leaf */}
          <ellipse cx={cx} cy={cy - bh * 0.78} rx={earSize * 0.35} ry={earSize * 0.18}
            fill="#54B86F" transform={`rotate(-15, ${cx}, ${cy - bh * 0.78})`} />
          <ellipse cx={cx - earSize * 0.12} cy={cy - bh * 0.84} rx={earSize * 0.28} ry={earSize * 0.13}
            fill="#6CCB7F" transform={`rotate(-10, ${cx - earSize * 0.12}, ${cy - bh * 0.84})`} />
          <ellipse cx={cx + earSize * 0.12} cy={cy - bh * 0.84} rx={earSize * 0.28} ry={earSize * 0.13}
            fill="#6CCB7F" transform={`rotate(10, ${cx + earSize * 0.12}, ${cy - bh * 0.84})`} />
        </>
      )}

      {/* Eyes */}
      {eyeClosed ? (
        <>
          <line x1={cx - eyeSize * 4.5} y1={cy - bh * 0.08} x2={cx - eyeSize * 3} y2={cy - bh * 0.08}
            stroke="#3D3D5C" strokeWidth={2.5} opacity={0.8} strokeLinecap="round" />
          <line x1={cx + eyeSize * 3} y1={cy - bh * 0.08} x2={cx + eyeSize * 4.5} y2={cy - bh * 0.08}
            stroke="#3D3D5C" strokeWidth={2.5} opacity={0.8} strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx={cx - eyeSize * 4.2} cy={cy - bh * 0.1} rx={eyeSize * 1.05} ry={eyeSize * 1.2}
            fill="#3D3D5C" />
          <ellipse cx={cx - eyeSize * 3.7} cy={cy - bh * 0.13} rx={eyeSize * 0.35} ry={eyeSize * 0.35}
            fill="white" />
          {/* Right eye */}
          <ellipse cx={cx + eyeSize * 4.2} cy={cy - bh * 0.1} rx={eyeSize * 1.05} ry={eyeSize * 1.2}
            fill="#3D3D5C" />
          <ellipse cx={cx + eyeSize * 4.7} cy={cy - bh * 0.13} rx={eyeSize * 0.35} ry={eyeSize * 0.35}
            fill="white" />
        </>
      )}

      {/* Blush */}
      {mood !== 'hungry' && (
        <>
          <ellipse cx={cx - eyeSize * 6.5} cy={cy + bh * 0.08} rx={eyeSize * 1.2} ry={eyeSize * 0.65}
            fill="#FFB5C5" opacity={0.5} />
          <ellipse cx={cx + eyeSize * 6.5} cy={cy + bh * 0.08} rx={eyeSize * 1.2} ry={eyeSize * 0.65}
            fill="#FFB5C5" opacity={0.5} />
        </>
      )}

      {/* Mouth */}
      <g stroke="#3D3D5C" strokeWidth={2.5} fill="none" opacity={0.75} strokeLinecap="round">
        {mouthType === 'smile' && (
          <path d={`M ${cx - eyeSize * 2} ${cy + bh * 0.08} Q ${cx} ${cy + bh * 0.22} ${cx + eyeSize * 2} ${cy + bh * 0.08}`} />
        )}
        {mouthType === 'neutral' && (
          <line x1={cx - eyeSize * 1.5} y1={cy + bh * 0.1} x2={cx + eyeSize * 1.5} y2={cy + bh * 0.1} />
        )}
        {mouthType === 'frown' && (
          <path d={`M ${cx - eyeSize * 2} ${cy + bh * 0.18} Q ${cx} ${cy + bh * 0.08} ${cx + eyeSize * 2} ${cy + bh * 0.18}`} />
        )}
      </g>

      {/* Mood indicators */}
      {mood === 'hungry' && (
        <>
          <circle cx={cx - eyeSize * 3.5} cy={cy - bh * 0.6} r={eyeSize * 0.6} fill="#FF8C69" opacity={0.6} />
          <circle cx={cx + eyeSize * 3.5} cy={cy - bh * 0.55} r={eyeSize * 0.5} fill="#FF8C69" opacity={0.5} />
        </>
      )}

      {/* Level indicator */}
      {level === 'full' && (
        <circle cx={cx + bw * 0.45} cy={cy - bh * 0.6} r={eyeSize * 1.2}
          fill="none" stroke="#FFD700" strokeWidth={2} opacity={0.8} />
      )}
    </svg>
  );
};
