import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllEssays, getEssayBySlug } from '@/lib/mdx';
import { MdxContent } from '@/components/mdx-content';
import { formatDate } from '@/lib/utils';
import { compileMDX } from 'next-mdx-remote/rsc';

interface EssayPageProps {
  params: { slug: string };
}

/** 静态导出：预渲染所有随笔详情页 */
export function generateStaticParams() {
  const essays = getAllEssays();
  return essays.map((essay) => ({ slug: essay.slug }));
}

/** 动态页面标题 */
export function generateMetadata({ params }: EssayPageProps): Metadata {
  const essay = getEssayBySlug(params.slug);
  return {
    title: essay?.meta.title ?? '随笔详情',
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const essay = getEssayBySlug(params.slug);
  if (!essay) notFound();

  const { meta, content } = essay;
  const { content: mdxContent } = await compileMDX<{ title: string }>({
    source: content,
    options: { parseFrontmatter: false },
  });

  return (
    <article className="animate-fade-in">
      <div className="mb-8 space-y-4">
        <Link
          href="/life/essays/"
          className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          返回随笔列表
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(meta.date)}
          </span>
        </div>

        {meta.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {meta.description}
          </p>
        )}
      </div>

      <MdxContent>{mdxContent}</MdxContent>
    </article>
  );
}
