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
 * - 双层光斑：鼠标跟随层 + 静态呼吸层（强化零光品牌）
 * - 明暗模式通过 CSS 变量 --glow-opacity 自动控制强度
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
        /* 鼠标跟随层：平滑过渡移动位置 */
        background: [
          /* 静态呼吸光斑 - 左上固定 */
          `radial-gradient(480px circle at 20% 30%, rgba(91,141,239,var(--glow-opacity)), transparent 50%)`,
          /* 静态呼吸光斑 - 右下固定 */
          `radial-gradient(420px circle at 80% 70%, rgba(212,163,115,calc(var(--glow-opacity) * 0.6)), transparent 50%)`,
          /* 鼠标跟随层 - 最上层 */
          `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(91,141,239,var(--glow-opacity-strong)), transparent 45%)`,
        ].join(', '),
        transition: 'background 0.15s ease-out',
      }}
    >
      {children}
    </section>
  );
}
