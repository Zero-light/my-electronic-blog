import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { NoteMeta } from '@/lib/mdx';
import { Calendar, Tag, ArrowRight, Cpu, CircuitBoard, Code2 } from 'lucide-react';

export interface NoteCardProps {
  note: NoteMeta;
  className?: string;
}

/** 根据分类返回图标 */
function getCategoryIcon(mainCategory?: string) {
  if (!mainCategory) return <Code2 className="h-5 w-5" />;
  if (mainCategory.includes('硬件') || mainCategory.includes('PCB')) return <CircuitBoard className="h-5 w-5" />;
  return <Cpu className="h-5 w-5" />;
}

/** 技术关键词自动高亮 */
const KEYWORDS = ['STM32', 'PyQt6', 'FreeRTOS', 'RTOS', 'PCB', 'ADC', 'DMA', 'SPI', 'UART', 'EMC', 'C语言', 'C 语言'];

function highlightKeywords(text: string) {
  const regex = new RegExp(`(${KEYWORDS.join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    KEYWORDS.includes(part) ? (
      <span key={i} className="keyword-highlight">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * 笔记列表项组件（列排列）
 * - 横向布局：左侧图标/封面图 + 日期 + 分类，中间标题 + 描述 + 知识点标签，右侧箭头
 * - 无封面图时显示分类矢量图标
 */
export function NoteCard({ note, className }: NoteCardProps) {
  const hasCover = note.cover && !note.cover.startsWith('http');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link href={`/notes/${note.slug}/`} className={className}>
        <article className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-start sm:gap-4">
          {/* 左侧：封面图 or 分类图标 */}
          {hasCover ? (
            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
              <Image
                src={note.cover!}
                alt={note.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 112px"
              />
            </div>
          ) : (
            <div className="flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary sm:h-20 sm:w-28">
              {getCategoryIcon(note.mainCategory)}
            </div>
          )}

          {/* 中间内容区 */}
          <div className="min-w-0 flex-1">
            {/* 分类标签（左上，浅蓝色） */}
            {note.mainCategory && (
              <span className="mb-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[0.68rem] font-medium text-primary">
                {note.mainCategory}
                {note.subCategory ? ` · ${note.subCategory}` : ''}
              </span>
            )}

            {/* 标题 */}
            <h3 className="text-[0.92rem] font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
              {highlightKeywords(note.title)}
            </h3>

            {/* 摘要 */}
            {note.description && (
              <p className="mt-0.5 line-clamp-1 text-[0.8rem] text-slate-600 dark:text-slate-400">
                {note.description}
              </p>
            )}

            {/* 底部：日期 + 知识点标签 */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[0.7rem] text-text-muted">
                <Calendar className="h-3 w-3" />
                {formatDate(note.date)}
              </span>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-bg-soft px-1.5 py-0.5 text-[0.65rem] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧箭头 */}
          <div className="hidden shrink-0 items-center self-center text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-primary sm:flex">
            <ArrowRight className="h-4 w-4" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
