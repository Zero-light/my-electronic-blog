'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SkillItem {
  /** 技能名称 */
  name: string;
  /** 熟练度 0–100 */
  level: number;
}

export interface SkillCategory {
  /** 分类标题，如 "硬件设计" */
  title: string;
  /** 该分类下的技能列表 */
  items: SkillItem[];
}

export interface SkillBarProps {
  categories: SkillCategory[];
  className?: string;
}

/**
 * 技能可视化组件
 * - 按分类分组展示水平进度条
 * - 进度条颜色使用 CSS 变量 --primary，自动适配明暗主题
 * - 滚动到视口时进度条从 0% 动画展开到目标宽度
 * - 两列网格布局（移动端单列）
 */
export function SkillBar({ categories, className }: SkillBarProps) {
  return (
    <div className={cn('grid gap-8 md:grid-cols-2', className)}>
      {categories.map((category) => (
        <SkillCategory key={category.title} category={category} />
      ))}
    </div>
  );
}

function SkillCategory({ category }: { category: SkillCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {category.title}
      </h3>
      <div className="space-y-4">
        {category.items.map((item) => (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {item.level}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: visible ? `${item.level}%` : '0%',
                  backgroundColor: 'var(--primary)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
