'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, X, FileText, FolderGit2, PenLine, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchIndex, groupResultsByType, type SearchResult } from '@/lib/search';

export interface SearchBoxProps {
  index: SearchResult[];
}

const typeIcon = {
  note: <FileText className="h-4 w-4" />,
  project: <FolderGit2 className="h-4 w-4" />,
  essay: <PenLine className="h-4 w-4" />,
};

const typeLabel: Record<string, string> = {
  notes: '笔记',
  projects: '项目',
  essays: '随笔',
};

/**
 * 全局搜索弹窗组件
 * - 快捷键 Ctrl+K 或 / 打开，ESC 关闭
 * - 修复弹窗定位与关闭后页面错位问题
 */
export function SearchBox({ index }: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollYRef = useRef(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndex(index, query);
  }, [index, query]);

  const grouped = useMemo(() => groupResultsByType(results), [results]);

  const open = useCallback(() => {
    scrollYRef.current = window.scrollY;
    setIsOpen(true);
    setQuery('');
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT')
      ) {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, close]);

  // 打开/关闭时锁定/恢复页面滚动
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={open}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-lg border border-border',
          'bg-bg-soft px-2.5 text-sm text-text-muted transition-colors',
          'hover:bg-border hover:text-text',
          'md:w-48 md:justify-between'
        )}
        aria-label="搜索"
      >
        <span className="inline-flex items-center gap-1.5">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">搜索...</span>
        </span>
        <span className="hidden items-center gap-0.5 text-xs md:inline-flex">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      {/* 弹窗遮罩 + 内容 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* 半透明背景层 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={close}
          />

          {/* 弹窗卡片 */}
          <div
            className="relative z-10 mx-4 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-fade-in sm:mx-6"
            style={{ maxHeight: 'min(70vh, 540px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 输入框 */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索标题、标签、描述..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-text-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border hover:text-text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="hidden shrink-0 rounded-md bg-bg-soft px-2 py-1 text-xs text-text-muted transition-colors hover:bg-border hover:text-text md:block"
              >
                ESC
              </button>
            </div>

            {/* 结果列表 */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2">
              {/* 初始状态提示 */}
              {!query.trim() && (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-text-muted">
                  <Search className="h-8 w-8 opacity-40" />
                  <p>输入关键词开始搜索</p>
                  <p className="text-xs">支持搜索标题、标签与描述</p>
                </div>
              )}

              {/* 无结果 */}
              {query.trim() && results.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-text-muted">
                  <X className="h-8 w-8 opacity-40" />
                  <p>未找到匹配内容</p>
                </div>
              )}

              {/* 搜索结果 */}
              {results.length > 0 && (
                <div className="space-y-4">
                  {(Object.keys(grouped) as Array<keyof typeof grouped>).map(
                    (type) => {
                      const list = grouped[type];
                      if (list.length === 0) return null;
                      return (
                        <div key={type}>
                          <div className="mb-1.5 flex items-center gap-2 px-2">
                            <span className="text-xs font-semibold text-text-muted">
                              {typeLabel[type]}
                            </span>
                            <span className="rounded-full bg-bg-soft px-1.5 py-0 text-[0.65rem] text-text-muted">
                              {list.length}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            {list.map((item) => (
                              <Link
                                key={item.url}
                                href={item.url}
                                onClick={close}
                                className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-bg-soft"
                              >
                                <span className="mt-0.5 shrink-0 text-primary">
                                  {typeIcon[item.type]}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div className="truncate text-xs text-text-muted">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-text-muted">
              <span>{index.length} 条内容已索引</span>
              <span className="hidden md:inline">
                ↵ 打开 · ESC 关闭
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
