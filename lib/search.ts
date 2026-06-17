/* ============================================================
   搜索索引（纯前端逻辑，不含 fs / Node 模块）
   ============================================================ */

export interface SearchResult {
  /** 内容类型 */
  type: 'note' | 'project' | 'essay';
  /** URL 路径标识 */
  slug: string;
  /** 标题 */
  title: string;
  /** 简介 */
  description?: string;
  /** 标签 */
  tags: string[];
  /** 日期 */
  date: string;
  /** 页面路由 */
  url: string;
}

/**
 * 前端关键词搜索
 * - 匹配标题、标签、简介（不区分大小写）
 * - 返回按类型分组后的结果数组
 * @param index 搜索索引
 * @param keyword 关键词
 */
export function searchIndex(
  index: SearchResult[],
  keyword: string
): SearchResult[] {
  const lower = keyword.toLowerCase().trim();
  if (!lower) return [];

  return index.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(lower);
    const inTags = item.tags.some((tag) =>
      tag.toLowerCase().includes(lower)
    );
    const inDesc = item.description?.toLowerCase().includes(lower) ?? false;
    return inTitle || inTags || inDesc;
  });
}

/**
 * 按类型聚合搜索结果
 * @param results 搜索结果数组
 */
export function groupResultsByType(results: SearchResult[]) {
  return {
    notes: results.filter((r) => r.type === 'note'),
    projects: results.filter((r) => r.type === 'project'),
    essays: results.filter((r) => r.type === 'essay'),
  };
}
