import { getAllNotes, getAllProjects, getAllEssays } from './mdx';
import type { SearchResult } from './search';

/**
 * 构建全站搜索索引
 * - 聚合笔记、项目、随笔的元数据
 * - 在构建时生成，前端内存过滤
 */
export function buildSearchIndex(): SearchResult[] {
  const notes = getAllNotes().map((note) => ({
    type: 'note' as const,
    slug: note.slug,
    title: note.title,
    description: note.description,
    tags: note.tags,
    date: note.date,
    url: `/notes/${note.slug}/`,
  }));

  const projects = getAllProjects().map((project) => ({
    type: 'project' as const,
    slug: project.slug,
    title: project.title,
    description: project.description,
    tags: project.tags,
    date: project.date,
    url: `/projects/${project.slug}/`,
  }));

  const essays = getAllEssays().map((essay) => ({
    type: 'essay' as const,
    slug: essay.slug,
    title: essay.title,
    description: essay.description,
    tags: essay.tags,
    date: essay.date,
    url: `/life/essays/${essay.slug}/`,
  }));

  return [...notes, ...projects, ...essays];
}
