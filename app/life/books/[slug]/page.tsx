import { notFound } from 'next/navigation';
import { books, getBookBySlug } from '@/content/data/books';
import { BookOpen, ChevronLeft, ListTree } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

interface Props {
  params: { slug: string };
}

export default function BookDetailPage({ params }: Props) {
  const book = getBookBySlug(params.slug);
  if (!book) return notFound();

  return (
    <div className="animate-fade-in space-y-8">
      {/* 返回导航 */}
      <Link
        href="/life/"
        className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        返回生活
      </Link>

      {/* 书籍信息 */}
      <section className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        {/* 封面 */}
        <div className="shrink-0 self-center sm:self-start">
          <div className="h-48 w-32 overflow-hidden rounded-xl bg-bg-soft shadow-md sm:h-56 sm:w-40">
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {book.title}
          </h1>
          <div className="space-y-1 text-sm text-text-muted">
            <p>作者：{book.author}</p>
            {book.publisher && <p>出版社：{book.publisher}</p>}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            {book.summary}
          </p>
        </div>
      </section>

      {/* 目录 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <ListTree className="h-5 w-5 text-primary" />
          目录
        </div>

        <div className="space-y-3">
          {book.toc.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  {item.sections && item.sections.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {item.sections.map((sec, sidx) => (
                        <li
                          key={sidx}
                          className="flex items-center gap-2 text-sm text-text-muted"
                        >
                          <span className="h-1 w-1 rounded-full bg-text-muted/50" />
                          {sec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
