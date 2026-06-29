import Link from 'next/link';
import { getAllNotes, sortByDate } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Calendar, BookOpen, User } from 'lucide-react';

export default function NotesPage() {
  const notes = sortByDate(getAllNotes());

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          知识库
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          硬件调试笔记、技术排查实录与经验沉淀。
        </p>
      </div>

      {notes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}/`}
              className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-2 flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(note.meta.date)}
                </span>
                {note.meta.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {note.meta.author}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {note.meta.title}
              </h3>
              {note.meta.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {note.meta.description}
                </p>
              )}
              {note.meta.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.meta.tags.map(tag => (
                    <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-text-muted">
          <BookOpen className="mx-auto mb-2 h-8 w-8 opacity-50" />
          知识库暂无笔记，精彩内容即将上线。
        </div>
      )}
    </div>
  );
}
