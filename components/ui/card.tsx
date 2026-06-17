import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ============================================================
   基础卡片组件族
   灵感来源：shadcn/ui Card，但去除了 Radix 依赖，零外部库
   ============================================================ */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/**
 * Card 根容器
 * @param hover - 是否启用 hover 上浮阴影效果
 */
export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover',
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-5', className)}
      {...props}
    />
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-text-muted', className)}
      {...props}
    />
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props} />
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex items-center p-5 pt-0', className)}
      {...props}
    />
  );
}
