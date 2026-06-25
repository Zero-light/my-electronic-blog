/**
 * 相册图片数据
 * 图库页面读取此文件渲染瀑布流
 * 数据源：gallery.json（可由 Decap CMS 在线编辑）
 */

import galleryData from './gallery.json';

export type GalleryCategory = '生活随拍' | '实验室作品' | '赛事实拍' | '风景';

export interface GalleryImage {
  /** 图片路径（相对于 public/） */
  src: string;
  /** 图片描述 */
  alt: string;
  /** 所属分类 */
  category: GalleryCategory;
}

export const galleryImages: GalleryImage[] =
  galleryData.images as GalleryImage[];

export const galleryCategories: GalleryCategory[] =
  galleryData.categories as GalleryCategory[];
