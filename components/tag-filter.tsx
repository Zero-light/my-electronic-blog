'use client';

import { cn } from '@/lib/utils';

export interface TagFilterProps {
  /** 所有可用标签 */
  tags: string[];
  /** 当前选中的标签 */
  selected: string[];
  /** 选中变化回调 */
  onChange: (selected: string[]) => void;
  className?: string;
}

/**
 * 标签筛选组件
 * - 支持多选（点击切换选中状态）
 * - "全部"按钮一键清除筛选
 * - 选中项高亮，未选中项低对比度
 * - 圆角胶囊样式，适配明暗主题
 */
export function TagFilter({
  tags,
  selected,
  onChange,
  className,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <button
        type="button"
        onClick={clearAll}
        className={cn(
          'rounded-full px-3 py-1 text-sm font-medium transition-colors',
          selected.length === 0
            ? 'bg-primary text-white'
            : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
        )}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            selected.includes(tag)
              ? 'bg-primary text-white'
              : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
