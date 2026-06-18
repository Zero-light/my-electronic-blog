/**
 * 相册图片数据
 * 图库页面读取此文件渲染瀑布流
 */

export type GalleryCategory = '生活随拍' | '实验室作品' | '赛事实拍' | '风景';

export interface GalleryImage {
  /** 图片路径（相对于 public/） */
  src: string;
  /** 图片描述 */
  alt: string;
  /** 所属分类 */
  category: GalleryCategory;
}

export const galleryImages: GalleryImage[] = [
  {
    src: 'https://picsum.photos/seed/electronics1/800/600',
    alt: '实验室工作台',
    category: '实验室作品',
  },
  {
    src: 'https://picsum.photos/seed/teamwork1/800/600',
    alt: '电赛现场',
    category: '赛事实拍',
  },
  {
    src: 'https://picsum.photos/seed/circuit1/800/600',
    alt: 'PCB 版图',
    category: '实验室作品',
  },
  {
    src: 'https://picsum.photos/seed/sunset1/800/600',
    alt: '校园夕阳',
    category: '风景',
  },
  {
    src: 'https://picsum.photos/seed/coffee1/800/600',
    alt: '日常咖啡',
    category: '生活随拍',
  },
];

export const galleryCategories: GalleryCategory[] = [
  '生活随拍',
  '实验室作品',
  '赛事实拍',
  '风景',
];
