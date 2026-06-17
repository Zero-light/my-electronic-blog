'use client';

import { useState } from 'react';
import { GalleryGrid } from '@/components/gallery-grid';
import {
  galleryImages,
  galleryCategories,
  type GalleryCategory,
} from '@/content/data/gallery';
import { cn } from '@/lib/utils';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | '全部'>('全部');

  const filteredImages =
    activeCategory === '全部'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          相册图库
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          生活随拍、实验室作品、赛事实拍与风景。
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('全部')}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            activeCategory === '全部'
              ? 'bg-primary text-white'
              : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
          )}
        >
          全部
        </button>
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <GalleryGrid images={filteredImages} />
    </div>
  );
}
