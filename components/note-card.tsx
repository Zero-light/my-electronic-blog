import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { NoteMeta } from '@/lib/mdx';
import { Calendar, Tag } from 'lucide-react';

export interface NoteCardProps {
  note: NoteMeta;
  className?: string;
}

/**
 * 笔记卡片组件
 * - 展示封面图、标题、日期、标签、简介
 * - 复用现有 Card 组件，启用 hover 上浮动效
 * - 封面图在 hover 时轻微放大
 * - 全卡片可点击，链接到笔记详情页
 */
export function NoteCard({ note, className }: NoteCardProps) {
  return (
    <Link
      href={`/notes/${note.slug}/`}
      className={className}
    >
      <Card hover className="group h-full flex flex-col">
        {/* 封面图 */}
        {note.cover && (
          <div className="relative aspect-video overflow-hidden rounded-t-xl">
            <img
              src={note.cover}
              alt={note.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-2 text-base">
            {note.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {note.description || '暂无描述'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(note.date)}
            </span>
            {note.tags.length > 0 && (
              <span className="flex items-center gap-1 truncate">
                <Tag className="h-3 w-3 shrink-0" />
                <span className="truncate">{note.tags.join(' · ')}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
