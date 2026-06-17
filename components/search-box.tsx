'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, X, FileText, FolderGit2, PenLine, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchIndex, groupResultsByType, type SearchResult } from '@/lib/search';

export interface SearchBoxProps {
  /** 全站搜索索引（由服务端构建后传入） */
  index: SearchResult[];
}

/** 分类图标映射 */
const typeIcon = {
  note: <FileText className="h-4 w-4" />,
  project: <FolderGit2 className="h-4 w-4" />,
  essay: <PenLine className="h-4 w-4" />,
};

const typeLabel = {
  note: '笔记',
  project: '项目',
  essay: '随笔',
};

/**
 * 全局搜索弹窗组件
 * - 快捷键 Ctrl+K 或 / 打开
 * - ESC 关闭
 * - 实时匹配标题 / 标签 / 简介
 * - 分类图标 + 链接直达
 * - 零外部依赖，纯前端内存过滤
 */
export function SearchBox({ index }: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndex(index, query);
  }, [index, query]);

  const grouped = useMemo(() => groupResultsByType(results), [results]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  // 键盘快捷键：Ctrl+K 或 / 打开，ESC 关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      // 忽略输入框内的 /
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

  // 打开后自动聚焦输入框
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(id);
        document.body.style.overflow = '';
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

      {/* 弹窗 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 输入框 */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索标题、标签、描述..."
                className="flex-1 bg-transparent text-base outline-none placeholder:text-text-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-border hover:text-text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                className="hidden rounded bg-bg-soft px-1.5 py-0.5 text-xs text-text-muted md:inline-block"
              >
                ESC
              </button>
            </div>

            {/* 结果列表 */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <div className="py-8 text-center text-sm text-text-muted">
                  未找到匹配内容
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-4">
                  {(
                    Object.keys(grouped) as Array<keyof typeof grouped>
                  ).map((type) => {
                    const list = grouped[type];
                    if (list.length === 0) return null;
                    return (
                      <div key={type}>
                        <div className="mb-1 px-2 text-xs font-medium text-text-muted">
                          {typeLabel[type]} · {list.length}
                        </div>
                        <div className="space-y-0.5">
                          {list.map((item) => (
                            <Link
                              key={item.url}
                              href={item.url}
                              onClick={close}
                              className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-bg-soft"
                            >
                              <span className="mt-0.5 shrink-0 text-text-muted">
                                {typeIcon[item.type]}
                              </span>
                              <div className="min-w-0">
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
                  })}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-text-muted">
              <span>{index.length} 条内容已索引</span>
              <span className="hidden md:inline">
                使用 ↑ ↓ 选择，↵ 打开，ESC 关闭
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
