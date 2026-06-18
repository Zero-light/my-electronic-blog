import Link from 'next/link';
import { Book } from '@/content/data/books';
import { Tag, BookOpen } from 'lucide-react';

export interface BookCardProps {
  book: Book;
}

/**
 * 书籍列表项组件（行排列）
 * - 左侧封面缩略图
 * - 中间：书名、作者、主要内容备注
 * - 右侧箭头
 */
export function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/life/books/${book.slug}/`}
      className="group block"
    >
      <article className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm sm:gap-5 sm:p-5">
        {/* 左侧封面 */}
        <div className="shrink-0">
          <div className="relative h-24 w-16 overflow-hidden rounded-lg bg-bg-soft sm:h-28 sm:w-20">
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* 中间内容 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
              {book.title}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">
              {book.author}
              {book.publisher && ` · ${book.publisher}`}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {book.summary}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-text-muted" />
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[0.7rem] text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 右侧箭头 */}
        <div className="hidden shrink-0 items-center self-center text-text-muted transition-colors group-hover:text-primary sm:flex">
          <Tag className="h-4 w-4 rotate-90" />
        </div>
      </article>
    </Link>
  );
}
