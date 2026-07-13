'use client';

import { cn } from '@/lib/utils';

export interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (selected: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onChange('')}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          selected === ''
            ? 'bg-primary text-white'
            : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
        )}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
