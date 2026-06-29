import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MdxMeta {
  title: string;
  date: string;
  author?: string;
  description?: string;
  tags?: string[];
}

export interface MdxFile {
  slug: string;
  meta: MdxMeta;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readMdxFiles(dir: string): MdxFile[] {
  const fullPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.mdx'));
  return files.map(filename => {
    const raw = fs.readFileSync(path.join(fullPath, filename), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: filename.replace(/\.mdx$/, ''),
      meta: data as MdxMeta,
      content,
    };
  });
}

/** Get all notes (知识库) */
export function getAllNotes(): MdxFile[] {
  return readMdxFiles('notes');
}

/** Get a single note by slug */
export function getNoteBySlug(slug: string): MdxFile | undefined {
  return getAllNotes().find(n => n.slug === slug);
}

/** Get all essays */
export function getAllEssays(): MdxFile[] {
  return readMdxFiles('essays');
}

/** Get a single essay by slug */
export function getEssayBySlug(slug: string): MdxFile | undefined {
  return getAllEssays().find(e => e.slug === slug);
}

/** Sort by date descending */
export function sortByDate(files: MdxFile[]): MdxFile[] {
  return [...files].sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}
