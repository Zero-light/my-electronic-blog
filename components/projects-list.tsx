'use client';

import { useState } from 'react';
import { ProjectMeta } from '@/lib/mdx';
import { CategoryFilter } from './category-filter';
import { ProjectCard } from './project-card';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface ProjectsListProps {
  projects: ProjectMeta[];
  categories: string[];
  className?: string;
  initialVisible?: number;
  loadMoreStep?: number;
}

export function ProjectsList({
  projects,
  categories,
  className,
  initialVisible = 6,
  loadMoreStep = 6,
}: ProjectsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const filtered =
    selectedCategory
      ? projects.filter((p) => p.category === selectedCategory)
      : projects;

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((v) => v + loadMoreStep);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(initialVisible);
  };

  return (
    <div className={cn('space-y-8', className)}>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />

      {visible.length > 0 ? (
        <>
          <div className="stagger-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} className="stagger-item" />
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
