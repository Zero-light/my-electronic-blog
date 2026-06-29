import Link from 'next/link';
import { getAllNotes, sortByDate, getAllEssays } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { BookOpen, PenLine, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const recentNotes = sortByDate(getAllNotes()).slice(0, 3);
  const recentEssays = sortByDate(getAllEssays()).slice(0, 3);

  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Newman Dryden
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
          电子信息工程专业，STM32 嵌入式开发、硬件调试、FPGA 学习笔记与项目记录。
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            知识库
          </h2>
          <Link href="/notes/" className="flex items-center gap-1 text-sm text-primary hover:underline">
            全部 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentNotes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentNotes.map(note => (
              <Link key={note.slug} href={`/notes/${note.slug}/`}
                className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/30">
                <div className="text-xs text-text-muted">{formatDate(note.meta.date)}</div>
                <div className="font-medium">{note.meta.title}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">暂无笔记</p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <PenLine className="h-5 w-5 text-primary" />
            随笔
          </h2>
          <Link href="/life/essays/" className="flex items-center gap-1 text-sm text-primary hover:underline">
            全部 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentEssays.length > 0 ? (
          <div className="space-y-3">
            {recentEssays.map(essay => (
              <Link key={essay.slug} href={`/life/essays/${essay.slug}/`}
                className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/30">
                <div className="text-xs text-text-muted">{formatDate(essay.meta.date)}</div>
                <div className="font-medium">{essay.meta.title}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">暂无随笔</p>
        )}
      </section>
    </div>
  );
}
