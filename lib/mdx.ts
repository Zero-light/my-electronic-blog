import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/* ============================================================
   类型定义
   ============================================================ */

/** 所有 MDX 内容共享的基础元数据 */
export interface BaseMeta {
  /** URL 路径标识（默认由文件名推导） */
  slug: string;
  /** 文章标题 */
  title: string;
  /** 标签数组 */
  tags: string[];
  /** 发布/更新日期（ISO 8601 格式字符串） */
  date: string;
  /** 封面图路径（相对 public/ 或外部 URL） */
  cover?: string;
  /** 所属分类 */
  category?: string;
  /** 文章简介/摘要 */
  description?: string;
}

/** 学习笔记元数据 */
export interface NoteMeta extends BaseMeta {}

/** 项目作品元数据（额外支持项目周期） */
export interface ProjectMeta extends BaseMeta {
  /** 项目周期，如 "2024.03 – 2024.06" */
  period?: string;
}

/** 随笔日记元数据 */
export interface EssayMeta extends BaseMeta {}

/** 解析后的 MDX 内容包 */
export interface ParsedContent<T extends BaseMeta> {
  meta: T;
  /** 去掉 frontmatter 后的原始 markdown/MDX 正文 */
  content: string;
}

/* ============================================================
   内部工具
   ============================================================ */

/** 内容文件根目录 */
const CONTENT_DIR = path.join(process.cwd(), 'content');

/** 读取目录下所有 .mdx 文件并按文件名排序 */
function getMdxFilenames(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();
}

/** 由文件名生成 slug */
function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

/** 安全提取字符串字段 */
function strField(
  data: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  const val = data[key];
  return typeof val === 'string' ? val : fallback;
}

/** 安全提取字符串数组 */
function strArrayField(data: Record<string, unknown>, key: string): string[] {
  const val = data[key];
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is string => typeof v === 'string');
}

/** 安全提取可选字符串 */
function optionalStr(data: Record<string, unknown>, key: string): string | undefined {
  const val = data[key];
  return typeof val === 'string' ? val : undefined;
}

/* ============================================================
   解析器
   ============================================================ */

/**
 * 解析单个 MDX 文件
 * @param filePath 绝对文件路径
 * @param slugFallback 当 frontmatter 中未提供 slug 时的回退值
 * @param enrich 可选的元数据扩展回调（用于提取特定类型的额外字段）
 */
function parseMdxFile<T extends BaseMeta>(
  filePath: string,
  slugFallback: string,
  enrich?: (record: Record<string, unknown>, meta: T) => void
): ParsedContent<T> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const record = data as Record<string, unknown>;

  const meta = {
    slug: strField(record, 'slug', slugFallback),
    title: strField(record, 'title', slugFallback),
    tags: strArrayField(record, 'tags'),
    date: strField(record, 'date', ''),
    cover: optionalStr(record, 'cover'),
    category: optionalStr(record, 'category'),
    description: optionalStr(record, 'description'),
  } as T;

  enrich?.(record, meta);

  return { meta, content };
}

/* ============================================================
   笔记 API
   ============================================================ */

/** 获取全部笔记元数据（未经排序） */
export function getAllNotes(): NoteMeta[] {
  const dir = path.join(CONTENT_DIR, 'notes');
  return getMdxFilenames(dir).map((file) => {
    const slug = slugFromFilename(file);
    const { meta } = parseMdxFile<NoteMeta>(path.join(dir, file), slug);
    return meta;
  });
}

/** 根据 slug 读取单篇笔记的元数据 + 正文 */
export function getNoteBySlug(
  slug: string
): ParsedContent<NoteMeta> | null {
  const filePath = path.join(CONTENT_DIR, 'notes', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMdxFile<NoteMeta>(filePath, slug);
}

/* ============================================================
   项目 API
   ============================================================ */

/** 获取全部项目元数据（未经排序） */
export function getAllProjects(): ProjectMeta[] {
  const dir = path.join(CONTENT_DIR, 'projects');
  return getMdxFilenames(dir).map((file) => {
    const slug = slugFromFilename(file);
    const { meta } = parseMdxFile<ProjectMeta>(
      path.join(dir, file),
      slug,
      (record, meta) => {
        meta.period = optionalStr(record, 'period');
      }
    );
    return meta;
  });
}

/** 根据 slug 读取单个项目的元数据 + 正文 */
export function getProjectBySlug(
  slug: string
): ParsedContent<ProjectMeta> | null {
  const filePath = path.join(CONTENT_DIR, 'projects', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMdxFile<ProjectMeta>(
    filePath,
    slug,
    (record, meta) => {
      meta.period = optionalStr(record, 'period');
    }
  );
}

/* ============================================================
   随笔 API
   ============================================================ */

/** 获取全部随笔元数据（未经排序） */
export function getAllEssays(): EssayMeta[] {
  const dir = path.join(CONTENT_DIR, 'essays');
  return getMdxFilenames(dir).map((file) => {
    const slug = slugFromFilename(file);
    const { meta } = parseMdxFile<EssayMeta>(path.join(dir, file), slug);
    return meta;
  });
}

/** 根据 slug 读取单篇随笔的元数据 + 正文 */
export function getEssayBySlug(
  slug: string
): ParsedContent<EssayMeta> | null {
  const filePath = path.join(CONTENT_DIR, 'essays', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMdxFile<EssayMeta>(filePath, slug);
}

/* ============================================================
   通用工具函数
   ============================================================ */

/**
 * 按日期倒序排序（最新的排在最前）
 * @param items 包含 date 字段的对象数组
 */
export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * 按分类精确过滤
 * @param items 元数据数组
 * @param category 目标分类名
 */
export function filterByCategory<T extends { category?: string }>(
  items: T[],
  category: string
): T[] {
  return items.filter((item) => item.category === category);
}

/**
 * 按标签过滤（包含任一指定标签即匹配）
 * @param items 元数据数组
 * @param tags 目标标签数组；空数组表示不过滤
 */
export function filterByTags<T extends { tags: string[] }>(
  items: T[],
  tags: string[]
): T[] {
  if (tags.length === 0) return items;
  return items.filter((item) =>
    tags.some((tag) => item.tags.includes(tag))
  );
}

/**
 * 前端搜索：按标题 / 标签 / 描述匹配关键词（不区分大小写）
 * @param items 元数据数组
 * @param keyword 搜索关键词
 */
export function searchItems<
  T extends { title: string; tags: string[]; description?: string }
>(items: T[], keyword: string): T[] {
  const lower = keyword.toLowerCase().trim();
  if (!lower) return items;
  return items.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(lower);
    const inTags = item.tags.some((t) => t.toLowerCase().includes(lower));
    const inDesc = item.description?.toLowerCase().includes(lower) ?? false;
    return inTitle || inTags || inDesc;
  });
}
