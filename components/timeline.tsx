'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  /** 日期/时间段 */
  date: string;
  /** 标题 */
  title: string;
  /** 副标题/地点 */
  subtitle?: string;
  /** 描述内容 */
  description?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * 时间线组件
 * - 左侧竖线 + 圆点标记
 * - 按时间倒序排列（最新的在最上）
 * - 适配明暗主题与移动端
 * - 滚动进入视口时逐项淡入（IntersectionObserver + stagger）
 */
export function Timeline({ items, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative pl-6', className)}
      style={{ '--timeline-visible': visible ? '1' : '0' } as React.CSSProperties}
    >
      {/* 竖线 */}
      <div
        className={cn(
          'absolute left-[9px] top-2 bottom-2 w-0.5 overflow-hidden bg-border transition-all duration-700',
          visible && 'opacity-100'
        )}
        style={{
          maxHeight: visible ? '100vh' : '0px',
          transition: 'max-height 0.8s ease-out',
        }}
      />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'relative transition-all duration-500 ease-out',
              visible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-3'
            )}
            style={{
              transitionDelay: visible ? `${index * 120}ms` : '0ms',
              willChange: 'transform, opacity',
            }}
          >
            {/* 圆点 - 入场时脉冲 */}
            <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center">
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2 border-primary bg-bg transition-all duration-500',
                  visible && 'scale-100'
                )}
                style={{
                  scale: visible ? '1' : '0.5',
                  transitionDelay: visible ? `${index * 120 + 300}ms` : '0ms',
                }}
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-primary">
                {item.date}
              </span>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              {item.subtitle && (
                <p className="text-sm text-text-muted">{item.subtitle}</p>
              )}
              {item.description && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
