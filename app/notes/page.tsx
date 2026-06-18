import { getAllNotes, sortByDate } from '@/lib/mdx';
import { NotesList } from '@/components/notes-list';

export default function NotesPage() {
  const notes = sortByDate(getAllNotes());

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          学习笔记
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          嵌入式开发、电源设计、模电数电与工具教程的知识沉淀。
        </p>
      </div>
      <NotesList notes={notes} />
    </div>
  );
}
