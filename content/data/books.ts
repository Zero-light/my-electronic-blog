/**
 * 阅读书籍数据
 * 生活-阅读板块使用
 * 分为：学习 / 娱乐 两大类
 * 数据源：books.json（可由 Decap CMS 在线编辑）
 */

import booksData from './books.json';

export type ReadingType = '学习' | '娱乐';

export interface BookTocItem {
  title: string;
  sections?: string[];
}

export interface Book {
  slug: string;
  title: string;
  author: string;
  publisher?: string;
  cover: string;
  summary: string;
  tags: string[];
  toc: BookTocItem[];
  /** 阅读分类：学习 / 娱乐 */
  readingType: ReadingType;
}

export const books: Book[] = booksData.books as Book[];

/** 获取单本书 */
export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

/** 按阅读类型过滤 */
export function getBooksByType(type: ReadingType): Book[] {
  return books.filter((b) => b.readingType === type);
}
