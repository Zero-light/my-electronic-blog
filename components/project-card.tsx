import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProjectMeta } from '@/lib/mdx';
import { Calendar, Tag } from 'lucide-react';

export interface ProjectCardProps {
  project: ProjectMeta;
  className?: string;
}

/**
 * 项目卡片组件
 * - 展示封面图、标题、项目周期、标签、概述
 * - 复用现有 Card 组件，启用 hover 上浮动效
 * - 封面图在 hover 时轻微放大
 * - 全卡片可点击，链接到项目详情页
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className={className}
    >
      <Card hover className="group h-full flex flex-col">
        {/* 封面图 */}
        {project.cover && (
          <div className="relative aspect-video overflow-hidden rounded-t-xl">
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-2 text-base">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description || '暂无描述'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            {project.period && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.period}
              </span>
            )}
            {project.tags.length > 0 && (
              <span className="flex flex-wrap items-center gap-1.5">
                <Tag className="h-3 w-3 shrink-0 text-text-muted" />
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[0.78rem] text-text-muted backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
