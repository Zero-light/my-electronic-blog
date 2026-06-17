import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Cpu, Code2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllProjects, getProjectBySlug } from '@/lib/mdx';
import { MdxContent } from '@/components/mdx-content';
import { formatDate } from '@/lib/utils';

interface ProjectPageProps {
  params: { slug: string };
}

/** 静态导出：预渲染所有项目详情页 */
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

/** 动态页面标题 */
export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  return {
    title: project?.meta.title ?? '项目详情',
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const { meta, content } = project;

  // 直接从文件补读原始 frontmatter，提取项目面板所需的额外字段
  // 约定 frontmatter 中以 hardware: [...] 和 software: [...] 记录工具链
  const filePath = path.join(process.cwd(), 'content', 'projects', `${params.slug}.mdx`);
  let hardware: string[] = [];
  let software: string[] = [];
  if (fs.existsSync(filePath)) {
    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
    if (
      Array.isArray(data['hardware']) &&
      data['hardware'].every((v: unknown) => typeof v === 'string')
    ) {
      hardware = data['hardware'] as string[];
    }
    if (
      Array.isArray(data['software']) &&
      data['software'].every((v: unknown) => typeof v === 'string')
    ) {
      software = data['software'] as string[];
    }
  }

  return (
    <article className="animate-fade-in">
      {/* 头部元信息 */}
      <div className="mb-8 space-y-4">
        <Link
          href="/projects/"
          className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回项目列表
        </Link>

        {meta.cover && (
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
            <img
              src={meta.cover}
              alt={meta.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {meta.period && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {meta.period}
            </span>
          )}
          {meta.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(meta.date)}
            </span>
          )}
          {meta.category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {meta.category}
            </span>
          )}
        </div>

        {meta.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-text-muted" />
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-soft px-2.5 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {meta.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {meta.description}
          </p>
        )}

        {/* 硬件 / 软件信息面板 */}
        {(hardware.length > 0 || software.length > 0) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {hardware.length > 0 && (
              <div className="rounded-xl border border-border bg-bg-soft p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Cpu className="h-4 w-4 text-primary" />
                  硬件平台
                </div>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {hardware.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {software.length > 0 && (
              <div className="rounded-xl border border-border bg-bg-soft p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Code2 className="h-4 w-4 text-primary" />
                  软件工具
                </div>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {software.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MDX 正文 */}
      <MdxContent source={content} />
    </article>
  );
}
