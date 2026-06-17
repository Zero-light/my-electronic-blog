'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CopyButtonProps {
  /** 要复制到剪贴板的文本 */
  text: string;
  className?: string;
  /** 展示形式：icon-only 或带文字 */
  variant?: 'icon' | 'text';
}

/**
 * 通用复制按钮
 * - 点击后复制指定文本到剪贴板
 * - 成功反馈：图标变为勾选，2s 后恢复
 * - 失败静默处理，不打扰用户
 */
export function CopyButton({
  text,
  className,
  variant = 'icon',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 静默处理复制失败
    }
  };

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-primary',
          className
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? '已复制' : '复制'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md',
        'bg-bg-soft text-text-muted transition-colors hover:bg-border hover:text-text',
        className
      )}
      aria-label="复制"
      title="复制"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
