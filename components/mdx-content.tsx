import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrismPlus from 'rehype-prism-plus';
import { CodeBlock } from '@/components/ui/code-block';
import { MdxImage } from './image-lightbox';
import { cn } from '@/lib/utils';

/* ============================================================
   工具：从 MDX 源码中提取所有图片 URL
   ============================================================ */

function extractImages(source: string): string[] {
  const matches: string[] = [];
  // Markdown 语法: ![alt](url)
  const mdRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = mdRegex.exec(source)) !== null) {
    matches.push(match[1]);
  }
  // HTML 语法: <img src="url" />
  const htmlRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((match = htmlRegex.exec(source)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
}

/* ============================================================
   自定义 MDX 组件映射
   ============================================================ */

const baseComponents = {
  // 代码块：复用现有 CodeBlock（含复制按钮）
  pre: CodeBlock,

  // 行内代码
  code: ({
    children,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<'code'>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className={cn(
            'rounded bg-bg-soft px-1.5 py-0.5 text-sm text-primary',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // 标题（自动注入 id，支持锚点）
  h1: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1
      id={id}
      className="mt-8 mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2
      id={id}
      className="mt-8 mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3
      id={id}
      className="mt-6 mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4
      id={id}
      className="mt-6 mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h5'>) => (
    <h5
      id={id}
      className="mt-4 mb-2 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, id, ...props }: React.ComponentPropsWithoutRef<'h6'>) => (
    <h6
      id={id}
      className="mt-4 mb-2 text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-20"
      {...props}
    >
      {children}
    </h6>
  ),

  // 段落
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p
      className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),

  // 列表
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="mb-4 list-disc space-y-1 pl-6 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="mb-4 list-decimal space-y-1 pl-6 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  li: (props: React.ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-relaxed" {...props} />
  ),

  // 链接
  a: ({
    href,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<'a'>) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 transition-colors hover:text-primary-dark"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 引用
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="mb-4 border-l-4 border-primary/30 pl-4 italic text-slate-600 dark:text-slate-400"
      {...props}
    />
  ),

  // 分割线
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  // 表格
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border border-border bg-bg-soft px-4 py-2 text-left font-semibold text-slate-900 dark:text-slate-100"
      {...props}
    />
  ),
  td: (props: React.ComponentPropsWithoutRef<'td'>) => (
    <td
      className="border border-border px-4 py-2 text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),

  // 文本格式
  strong: (props: React.ComponentPropsWithoutRef<'strong'>) => (
    <strong
      className="font-semibold text-slate-900 dark:text-slate-100"
      {...props}
    />
  ),
  em: (props: React.ComponentPropsWithoutRef<'em'>) => (
    <em
      className="italic text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  del: (props: React.ComponentPropsWithoutRef<'del'>) => (
    <del
      className="line-through text-slate-500 dark:text-slate-400"
      {...props}
    />
  ),
};

/* ============================================================
   MDX 内容渲染器
   ============================================================ */

export interface MdxContentProps {
  /** MDX 原始字符串 */
  source: string;
}

/**
 * MDX 内容渲染组件（Server Component）
 * - 使用 next-mdx-remote/rsc 编译并渲染 MDX
 * - 集成 rehype-prism-plus 代码高亮
 * - 复用现有 CodeBlock（含复制按钮）
 * - 图片替换为 MdxImage（支持灯箱）
 * - 标题自动注入 id，支持锚点跳转
 * - 全面适配明暗主题与移动端排版
 */
export function MdxContent({ source }: MdxContentProps) {
  const allImages = extractImages(source);

  const components = {
    ...baseComponents,
    img: (props: React.ComponentPropsWithoutRef<'img'>) => (
      <MdxImage {...props} allImages={allImages} />
    ),
  };

  return (
    <article className="animate-fade-in">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypePrismPlus],
          },
        }}
      />
    </article>
  );
}
