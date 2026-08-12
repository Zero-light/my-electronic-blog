'use client';

import dynamic from 'next/dynamic';
import type { NoteMeta, ProjectMeta } from '@/lib/mdx';

/**
 * 延迟加载 HomePage（含 framer-motion 卡片动画）
 * - 骨架屏复用的 pulse 样式，首次渲染即显示
 * - 分割 framer-motion 到独立 chunk，首屏 JS 体积大幅降低
 */
const HomePage = dynamic(() => import('@/components/home-page').then(mod => mod.HomePage), {
  loading: () => <HomePageSkeleton />,
});

interface HomePageClientProps {
  notes: NoteMeta[];
  projects: ProjectMeta[];
}

export function HomePageClient({ notes, projects }: HomePageClientProps) {
  return <HomePage notes={notes} projects={projects} />;
}

/** 与 loading.tsx 一致的骨架屏 */
function HomePageSkeleton() {
  return (
    <div className="animate-fade-in space-y-12">
      <div className="rounded-2xl border border-border/30 py-10 text-center">
        <div className="mx-auto max-w-2xl space-y-4 px-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-bg-elevated skeleton-pulse" />
          <div className="mx-auto h-9 w-64 rounded-lg bg-bg-elevated skeleton-pulse" />
          <div className="mx-auto h-5 w-48 rounded-lg bg-bg-elevated skeleton-pulse" />
          <div className="space-y-2">
            <div className="mx-auto h-4 w-full max-w-lg rounded bg-bg-elevated skeleton-pulse" />
            <div className="mx-auto h-4 w-11/12 max-w-md rounded bg-bg-elevated skeleton-pulse" />
            <div className="mx-auto h-4 w-5/6 max-w-sm rounded bg-bg-elevated skeleton-pulse" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <div className="h-9 w-28 rounded-lg bg-bg-elevated skeleton-pulse" />
            <div className="h-9 w-36 rounded-lg bg-bg-elevated skeleton-pulse" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-bg-elevated skeleton-pulse" />
        ))}
      </div>
    </div>
  );
}
