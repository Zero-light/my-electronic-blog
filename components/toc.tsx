'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(source: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = source.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*|__|[*_`]/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '');
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export interface TocProps {
  source: string;
  className?: string;
}

/**
 * 文章目录组件
 * - 从 MDX 源码提取 h2/h3/h4 标题
 * - 粘性定位，滚动时高亮当前章节
 */
export function Toc({ source, className }: TocProps) {
  const headings = extractHeadings(source);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={cn('sticky top-24', className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
        <List className="h-3.5 w-3.5" />
        目录
      </div>
      <ul className="space-y-1 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                'block border-l-2 py-1 text-sm transition-colors hover:text-primary',
                h.level === 2 && 'pl-3',
                h.level === 3 && 'pl-6',
                h.level === 4 && 'pl-9',
                activeId === h.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-text-muted'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
