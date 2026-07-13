'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HeroGlowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hero 区鼠标跟随光晕 — 高级感 mesh 渐变
 * - 三层光斑：鼠标跟随 + 左上靛蓝 + 右下琥珀
 * - 暗色模式自动切换色调
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
      className={cn('relative overflow-hidden rounded-2xl', className)}
      onMouseMove={handleMouseMove}
      style={{
        background: [
          `radial-gradient(500px circle at 15% 25%, rgba(79,70,229,var(--glow-opacity)), transparent 50%)`,
          `radial-gradient(400px circle at 85% 75%, rgba(217,119,6,calc(var(--glow-opacity) * 0.5)), transparent 50%)`,
          `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(99,102,241,var(--glow-opacity-strong)), transparent 45%)`,
        ].join(', '),
        transition: 'background 0.2s ease-out',
      }}
    >
      {children}
    </section>
  );
}
