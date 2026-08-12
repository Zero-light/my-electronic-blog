'use client';

import dynamic from 'next/dynamic';
import type { ProjectMeta } from '@/lib/mdx';

const ProjectsList = dynamic(() => import('@/components/projects-list').then(mod => mod.ProjectsList), {
  loading: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
          <div className="aspect-video bg-bg-elevated skeleton-pulse" />
          <div className="space-y-2 p-5">
            <div className="h-5 w-3/4 rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-full rounded bg-bg-elevated skeleton-pulse" />
          </div>
        </div>
      ))}
    </div>
  ),
});

interface ProjectsListClientProps {
  projects: ProjectMeta[];
  categories: string[];
}

export function ProjectsListClient({ projects, categories }: ProjectsListClientProps) {
  return <ProjectsList projects={projects} categories={categories} />;
}
