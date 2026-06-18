import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { NoteMeta } from '@/lib/mdx';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

export interface NoteCardProps {
  note: NoteMeta;
  className?: string;
}

/**
 * 笔记列表项组件（列排列）
 * - 横向布局，单列展开
 * - 左侧日期突出展示
 * - 中间标题 + 描述
 * - 右侧箭头
 */
export function NoteCard({ note, className }: NoteCardProps) {
  return (
    <Link
      href={`/notes/${note.slug}/`}
      className={className}
    >
      <article className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-start sm:gap-5">
        {/* 左侧日期区 */}
        <div className="flex shrink-0 flex-row items-center gap-2 sm:w-32 sm:flex-col sm:items-start sm:gap-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(note.date)}
          </span>
          {note.category && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] text-primary">
              {note.category}
            </span>
          )}
        </div>

        {/* 中间内容区 */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
            {note.title}
          </h3>
          {note.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
              {note.description}
            </p>
          )}

          {/* 标签 */}
          {note.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Tag className="h-3 w-3 text-text-muted" />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[0.7rem] text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 右侧箭头 */}
        <div className="hidden shrink-0 items-center self-center text-text-muted transition-colors group-hover:text-primary sm:flex">
          <ArrowRight className="h-4 w-4" />
        </div>
      </article>
    </Link>
  );
}
