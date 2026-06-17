'use client';

import { useState } from 'react';
import { ProjectMeta } from '@/lib/mdx';
import { TagFilter } from './tag-filter';
import { ProjectCard } from './project-card';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface ProjectsListProps {
  /** 全部项目元数据（已排序） */
  projects: ProjectMeta[];
  /** 所有可用标签 */
  allTags: string[];
  className?: string;
  /** 初始可见数量 */
  initialVisible?: number;
  /** 每次加载更多增加的数量 */
  loadMoreStep?: number;
}

/**
 * 项目列表客户端组件
 * - 标签多选筛选
 * - 加载更多（前端分页）
 * - 切换标签时重置可见数量
 */
export function ProjectsList({
  projects,
  allTags,
  className,
  initialVisible = 6,
  loadMoreStep = 6,
}: ProjectsListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  // 按选中标签过滤（包含任一即匹配）
  const filtered =
    selectedTags.length > 0
      ? projects.filter((project) =>
          selectedTags.some((tag) => project.tags.includes(tag))
        )
      : projects;

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
    <div className={cn('space-y-8', className)}>
      <TagFilter
        tags={allTags}
        selected={selectedTags}
        onChange={handleTagChange}
      />

      {visible.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
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
          没有符合条件的项目
        </div>
      )}
    </div>
  );
}
