'use client';

import { useState } from 'react';
import { NoteMeta } from '@/lib/mdx';
import { TagFilter } from './tag-filter';
import { NoteCard } from './note-card';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface NotesListProps {
  /** 全部笔记元数据（已排序） */
  notes: NoteMeta[];
  /** 所有可用标签 */
  allTags: string[];
  className?: string;
  /** 初始可见数量 */
  initialVisible?: number;
  /** 每次加载更多增加的数量 */
  loadMoreStep?: number;
}

/**
 * 笔记列表客户端组件（列排列）
 * - 标签多选筛选
 * - 加载更多（前端分页）
 * - 单列纵向列表布局
 */
export function NotesList({
  notes,
  allTags,
  className,
  initialVisible = 6,
  loadMoreStep = 6,
}: NotesListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  // 按选中标签过滤（包含任一即匹配）
  const filtered =
    selectedTags.length > 0
      ? notes.filter((note) =>
          selectedTags.some((tag) => note.tags.includes(tag))
        )
      : notes;

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((v) => v + loadMoreStep);
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
    setVisibleCount(initialVisible);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <TagFilter
        tags={allTags}
        selected={selectedTags}
        onChange={handleTagChange}
      />

      {visible.length > 0 ? (
        <>
          {/* 单列列表布局 */}
          <div className="flex flex-col gap-3">
            {visible.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="btn-ghost"
              >
                <ChevronDown className="h-4 w-4" />
                加载更多
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-text-muted">
          没有符合条件的笔记
        </div>
      )}
    </div>
  );
}
