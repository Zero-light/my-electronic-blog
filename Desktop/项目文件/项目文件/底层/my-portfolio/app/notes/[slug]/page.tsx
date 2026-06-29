import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllNotes, getNoteBySlug } from '@/lib/mdx';
import { MdxContent } from '@/components/mdx-content';
import { formatDate } from '@/lib/utils';
import { compileMDX } from 'next-mdx-remote/rsc';

interface NotePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export function generateMetadata({ params }: NotePageProps): Metadata {
  const note = getNoteBySlug(params.slug);
  return {
    title: note?.meta.title ?? '知识库笔记',
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug);
  if (!note) notFound();

  const { meta, content } = note;
  const { content: mdxContent } = await compileMDX<{ title: string }>({
    source: content,
    options: { parseFrontmatter: false },
  });

  return (
    <article className="animate-fade-in">
      <div className="mb-8 space-y-4">
        <Link
          href="/notes/"
          className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回知识库
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(meta.date)}
          </span>
          {meta.author && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {meta.author}
            </span>
          )}
        </div>

        {meta.tags && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map(tag => (
              <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <MdxContent>{mdxContent}</MdxContent>
    </article>
  );
}
