import Link from 'next/link';
import { getAllEssays, sortByDate } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Calendar, FileText } from 'lucide-react';

export default function EssaysPage() {
  const essays = sortByDate(getAllEssays());

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          随笔日记
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          阅读笔记、学期复盘与日常思考。
        </p>
      </div>

      {essays.length > 0 ? (
        <div className="relative space-y-8 pl-6">
          {/* 竖线 */}
          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />

          {essays.map((essay) => (
            <div key={essay.slug} className="relative">
              {/* 圆点 */}
              <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center">
                <div className="h-3 w-3 rounded-full border-2 border-primary bg-bg" />
              </div>

              <Link
                href={`/life/essays/${essay.slug}/`}
                className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-primary">
                  <Calendar className="h-3 w-3" />
                  {formatDate(essay.meta.date)}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {essay.meta.title}
                </h3>
                {essay.meta.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {essay.meta.description}
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-text-muted">
          <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
          暂无随笔，精彩内容即将上线。
        </div>
      )}
    </div>
  );
}
