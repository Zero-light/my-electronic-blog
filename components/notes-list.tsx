'use client';

import { useState, useMemo } from 'react';
import { NoteMeta } from '@/lib/mdx';
import { NoteCard } from './note-card';
import { cn } from '@/lib/utils';
import { ChevronDown, Cpu, CircuitBoard, FileQuestion } from 'lucide-react';

export interface NotesListProps {
  notes: NoteMeta[];
  className?: string;
  initialVisible?: number;
  loadMoreStep?: number;
}

const mainCategories = [
  { key: '软件', label: '软件', icon: <Cpu className="h-4 w-4" /> },
  { key: '硬件', label: '硬件', icon: <CircuitBoard className="h-4 w-4" /> },
  { key: '测试题', label: '测试题', icon: <FileQuestion className="h-4 w-4" /> },
] as const;

type MainCategory = (typeof mainCategories)[number]['key'];

/**
 * 笔记列表客户端组件
 * - 按主分类（软件/硬件/测试题）分组展示
 * - 每个分类下支持子分类筛选
 * - 单列列表布局
 */
export function NotesList({
  notes,
  className,
  initialVisible = 6,
  loadMoreStep = 6,
}: NotesListProps) {
  const [activeMainCategory, setActiveMainCategory] = useState<MainCategory | '全部'>('全部');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('全部');
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  // 收集所有子分类
  const allSubCategories = useMemo(() => {
    const map = new Map<string, Set<string>>();
    notes.forEach((n) => {
      const main = n.mainCategory || '未分类';
      const sub = n.subCategory || '未分类';
      if (!map.has(main)) map.set(main, new Set());
      map.get(main)!.add(sub);
    });
    return map;
  }, [notes]);

  // 当前主分类下的子分类列表
  const currentSubCategories = useMemo(() => {
    if (activeMainCategory === '全部') {
      const set = new Set<string>();
      allSubCategories.forEach((subs) => subs.forEach((s) => set.add(s)));
      return [...set];
    }
    return [...(allSubCategories.get(activeMainCategory) || [])];
  }, [activeMainCategory, allSubCategories]);

  // 过滤笔记
  const filtered = useMemo(() => {
    return notes.filter((note) => {
      if (activeMainCategory !== '全部' && note.mainCategory !== activeMainCategory) return false;
      if (activeSubCategory !== '全部' && note.subCategory !== activeSubCategory) return false;
      return true;
    });
  }, [notes, activeMainCategory, activeSubCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((v) => v + loadMoreStep);
  };

  const handleMainCategoryChange = (cat: MainCategory | '全部') => {
    setActiveMainCategory(cat);
    setActiveSubCategory('全部');
    setVisibleCount(initialVisible);
  };

  const handleSubCategoryChange = (sub: string) => {
    setActiveSubCategory(sub);
    setVisibleCount(initialVisible);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* 主分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleMainCategoryChange('全部')}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            activeMainCategory === '全部'
              ? 'bg-primary text-white'
              : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
          )}
        >
          全部
        </button>
        {mainCategories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => handleMainCategoryChange(cat.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeMainCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
            )}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* 子分类筛选 */}
      {currentSubCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSubCategoryChange('全部')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeSubCategory === '全部'
                ? 'bg-accent text-white'
                : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
            )}
          >
            全部
          </button>
          {currentSubCategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => handleSubCategoryChange(sub)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeSubCategory === sub
                  ? 'bg-accent text-white'
                  : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 笔记列表 */}
      {visible.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {visible.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button type="button" onClick={handleLoadMore} className="btn-ghost">
                <ChevronDown className="h-4 w-4" />
                加载更多
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-text-muted">没有符合条件的笔记</div>
      )}
    </div>
  );
}
