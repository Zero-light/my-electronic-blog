'use client';

import { useState, useRef, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 代码块容器（含复制按钮）
 * - 包裹 <pre> 标签使用，通过 ref 提取纯文本内容
 * - hover 时显示复制按钮，点击后 2s 内显示勾选图标
 * - 零业务逻辑，纯交互组件
 */
export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败静默处理，不打扰用户
    }
  };

  return (
    <div className={cn('group relative', className)}>
      <pre ref={preRef} className="!mt-0">
        {children}
      </pre>

      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center',
          'rounded-md bg-white/10 text-white/70 transition-all',
          'hover:bg-white/20 hover:text-white',
          'opacity-0 group-hover:opacity-100 focus:opacity-100'
        )}
        aria-label="复制代码"
        title="复制代码"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
