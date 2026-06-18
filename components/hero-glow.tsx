'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HeroGlowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hero 区鼠标跟随光晕
 * - 仅在支持 hover 的设备上启用（桌面端）
 * - 使用径向渐变营造"光"的氛围
 */
export function HeroGlow({ children, className }: HeroGlowProps) {
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        className
      )}
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(91,141,239,0.06), transparent 40%)`,
      }}
    >
      {children}
    </section>
  );
}
