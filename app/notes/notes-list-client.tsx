'use client';

import dynamic from 'next/dynamic';
import type { NoteMeta } from '@/lib/mdx';

const NotesList = dynamic(() => import('@/components/notes-list').then(mod => mod.NotesList), {
  loading: () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border/30 p-4">
          <div className="h-16 w-24 shrink-0 rounded-lg bg-bg-elevated skeleton-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 rounded-full bg-bg-elevated skeleton-pulse" />
            <div className="h-5 w-3/4 rounded bg-bg-elevated skeleton-pulse" />
            <div className="h-4 w-full rounded bg-bg-elevated skeleton-pulse" />
          </div>
        </div>
      ))}
    </div>
  ),
});

interface NotesListClientProps {
  notes: NoteMeta[];
}

export function NotesListClient({ notes }: NotesListClientProps) {
  return <NotesList notes={notes} />;
}
