'use client';

import { useEffect, useState } from 'react';

/**
 * 页面顶部阅读进度条
 * - 极细（2px），固定在视口最顶部
 * - 背景使用主色到强调色的渐变
 * - 通过 scroll 事件实时计算阅读进度
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed left-0 bottom-0 z-[60] h-[2px] w-full origin-left will-change-transform"
      style={{
        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
        transform: `scaleX(${progress / 100})`,
        transition: 'transform 0.1s ease-out',
      }}
      aria-hidden="true"
    />
  );
}
