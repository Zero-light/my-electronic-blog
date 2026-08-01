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
  /** 描述内容（支持 markdown 粗体分节） */
  description?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/**
 * 解析单行文本中的 markdown 粗体标记 **text**
 * 返回分段数组，偶数索引为普通文本，奇数索引为粗体文本
 */
function parseBoldSegments(text: string): { bold: boolean; text: string }[] {
  const segments: { bold: boolean; text: string }[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ bold: false, text: text.slice(lastIndex, match.index) });
    }
    segments.push({ bold: true, text: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ bold: false, text: text.slice(lastIndex) });
  }

  return segments;
}

/**
 * 渲染描述文本：
 * - 含 **粗体** 标记的行 → 解析为分段渲染（粗体行作为分节标题）
 * - 普通行 → 原样渲染（保留换行）
 */
function renderDescription(description: string) {
  const lines = description.split('\n');

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={lineIdx} />;

    // 判断是否为粗体分节标题（整行被 **...** 包裹）
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
    if (boldMatch) {
      return (
        <p
          key={lineIdx}
          className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          {boldMatch[1]}
        </p>
      );
    }

    // 普通行：解析行内粗体 + 渲染列表项
    const segments = parseBoldSegments(trimmed);
    const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('• ');
    const content = isListItem ? trimmed.slice(2) : trimmed;
    const listSegments = parseBoldSegments(content);

    return (
      <p
        key={lineIdx}
        className={cn(
          'text-sm leading-relaxed text-slate-600 dark:text-slate-400',
          isListItem && 'pl-3'
        )}
      >
        {isListItem && (
          <span className="mr-1.5 text-primary">•</span>
        )}
        {listSegments.map((seg, i) =>
          seg.bold ? (
            <span key={i} className="font-semibold text-slate-800 dark:text-slate-200">
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    );
  });
}

/**
 * 时间线组件
 * - 左侧竖线 + 圆点标记
 * - 按时间倒序排列（最新的在最上）
 * - 适配明暗主题与移动端
 * - 滚动进入视口时逐项淡入（IntersectionObserver + stagger）
 * - 支持描述中的 markdown 粗体分节标题
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
                <div className="mt-1 space-y-0.5">
                  {renderDescription(item.description)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
