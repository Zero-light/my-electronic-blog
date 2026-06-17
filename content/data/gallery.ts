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
    src: '/images/gallery/lab_bench.jpg',
    alt: '实验室工作台',
    category: '实验室作品',
  },
  {
    src: '/images/gallery/competition_scene.jpg',
    alt: '电赛现场',
    category: '赛事实拍',
  },
  {
    src: '/images/gallery/pcb_layout.jpg',
    alt: 'PCB 版图',
    category: '实验室作品',
  },
  {
    src: '/images/gallery/sunset_campus.jpg',
    alt: '校园夕阳',
    category: '风景',
  },
  {
    src: '/images/gallery/daily_coffee.jpg',
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
