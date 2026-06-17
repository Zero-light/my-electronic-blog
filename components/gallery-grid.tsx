'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ImageLightbox } from './image-lightbox';

export interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

export interface GalleryGridProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * 相册瀑布流组件
 * - CSS columns 实现瀑布流布局
 * - break-inside-avoid 防止图片被截断
 * - 点击唤起全屏灯箱预览
 * - 适配移动端与深色模式
 */
export function GalleryGrid({ images, className }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageUrls = useMemo(() => images.map((img) => img.src), [images]);

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="py-16 text-center text-text-muted">
        暂无图片
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3',
          className
        )}
      >
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => handleClick(index)}
            className="block w-full break-inside-avoid rounded-xl border border-border bg-card p-1 transition-shadow hover:shadow-md"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full rounded-lg object-cover"
              loading="lazy"
            />
            <span className="mt-1 block px-1 pb-1 text-left text-xs text-text-muted">
              {image.alt}
            </span>
          </button>
        ))}
      </div>

      <ImageLightbox
        images={imageUrls}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
