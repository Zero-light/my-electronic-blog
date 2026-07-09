'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';

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
 * - 数字从 0 滚动到目标值（framer-motion spring）
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
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {category.title}
      </h3>
      <div className="space-y-4">
        {category.items.map((item) => (
          <SkillItemBar key={item.name} item={item} animate={isInView} />
        ))}
      </div>
    </div>
  );
}

function SkillItemBar({ item, animate }: { item: SkillItem; animate: boolean }) {
  const val = useMotionValue(0);
  const springVal = useSpring(val, { stiffness: 60, damping: 18 });
  const rounded = useTransform(springVal, (v) => Math.round(v));

  useEffect(() => {
    if (animate) val.set(item.level);
  }, [animate, item.level, val]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {item.name}
        </span>
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
          <motion.span>{rounded}</motion.span>%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--primary)' }}
          initial={{ width: '0%' }}
          animate={animate ? { width: `${item.level}%` } : { width: '0%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
