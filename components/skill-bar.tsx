'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  items: SkillItem[];
}

export interface SkillBarProps {
  categories: SkillCategory[];
  className?: string;
}

function levelColor(level: number): string {
  if (level >= 88) return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400';
  if (level >= 80) return 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400';
  return 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400';
}

function levelDot(level: number): string {
  if (level >= 88) return 'bg-emerald-500';
  if (level >= 80) return 'bg-indigo-500';
  return 'bg-amber-500';
}

/**
 * 技能可视化组件 — 标签卡片式
 * - 按分类分组，每个分类一张卡片
 * - 技能项以紧凑行展示，带圆点等级指示
 */
export function SkillBar({ categories, className }: SkillBarProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {categories.map((category) => (
        <SkillCategoryCard key={category.title} category={category} />
      ))}
    </div>
  );
}

function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-card p-5 transition-all',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}
      style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
        {category.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <span
            key={item.name}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              levelColor(item.level)
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', levelDot(item.level))} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
