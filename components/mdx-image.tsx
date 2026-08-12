'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

/**
 * 延迟加载图片灯箱（含 framer-motion），仅在点击图片时加载
 * - framer-motion 从笔记/项目详情页的首屏 bundle 中移除
 * - 用户未点击图片前，灯箱代码不进入 JS 包
 */
const ImageLightbox = dynamic(
  () => import('@/components/image-lightbox').then((mod) => ({ default: mod.ImageLightbox })),
  { ssr: false }
);

export interface MdxImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 同篇文章中的所有图片 URL 列表，用于灯箱翻页 */
  allImages?: string[];
}

/**
 * MDX 渲染专用图片组件
 * - 点击放大进入灯箱预览
 * - 自动在同篇文章的所有图片间翻页
 * - cursor-zoom-in 提示可点击
 * - 灯箱按需加载，不影响首屏性能
 */
export function MdxImage({
  src,
  alt,
  allImages,
  className,
  loading,
  ...props
}: MdxImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!src) return null;

  const images = allImages && allImages.length > 0 ? allImages : [src];
  const index = allImages?.findIndex((img) => img === src) ?? 0;

  const handleClick = () => {
    setCurrentIndex(index >= 0 ? index : 0);
    setIsOpen(true);
  };

  return (
    <>
      <img
        src={src}
        alt={alt || ''}
        loading={loading || 'lazy'}
        className={cn(
          'cursor-zoom-in rounded-lg transition-opacity hover:opacity-90',
          className
        )}
        onClick={handleClick}
        {...props}
      />
      <ImageLightbox
        images={images}
        initialIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
