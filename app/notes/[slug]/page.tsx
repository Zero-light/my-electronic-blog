import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllNotes, getNoteBySlug } from '@/lib/mdx';
import { MdxContent } from '@/components/mdx-content';
import { formatDate } from '@/lib/utils';

interface NotePageProps {
  params: { slug: string };
}

/** 静态导出：预渲染所有笔记详情页 */
export function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

/** 动态页面标题 */
export function generateMetadata({ params }: NotePageProps): Metadata {
  const note = getNoteBySlug(params.slug);
  return {
    title: note?.meta.title ?? '笔记详情',
  };
}

export default function NotePage({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug);
  if (!note) notFound();

  const { meta, content } = note;

  return (
    <article className="animate-fade-in">
      {/* 头部元信息 */}
      <div className="mb-8 space-y-4">
        <Link
          href="/notes/"
          className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回笔记列表
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(meta.date)}
          </span>
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
      </div>

      {/* MDX 正文 */}
      <MdxContent source={content} />
    </article>
  );
}
