import React, { useEffect, useState } from 'react';

interface MoodBubbleProps {
  hunger: number;
  x?: number;
  y?: number;
  onDismiss: () => void;
}

export const MoodBubble: React.FC<MoodBubbleProps> = ({ hunger, onDismiss }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setShow(false); setTimeout(onDismiss, 300); }, 2000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const msg = hunger >= 70 ? '♡ 好开心~'
    : hunger >= 40 ? '平静'
    : hunger >= 20 ? '有点饿...'
    : '好饿...zzz';

  return (
    <div
      className={`glass-chip text-sm transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      {msg}
    </div>
  );
};
