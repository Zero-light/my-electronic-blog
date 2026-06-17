import type { MDXComponents } from 'mdx/types';

// 全局 MDX 组件注册（供 @next/mdx 使用）
// 实际渲染逻辑在 components/MdxContent.tsx 中通过 next-mdx-remote 自定义
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
