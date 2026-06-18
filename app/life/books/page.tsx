import { books } from '@/content/data/books';
import { BookCard } from '@/components/book-card';
import { BookOpen } from 'lucide-react';

export default function BooksPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            阅读记录
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          嵌入式与硬件方向的阅读书单，附主要内容备注与目录。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
    </div>
  );
}
