'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

/* ============================================================
   灯箱 UI 组件
   ============================================================ */

export interface ImageLightboxProps {
  /** 图片 URL 列表 */
  images: string[];
  /** 初始展示索引 */
  initialIndex?: number;
  /** 是否打开 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * 全屏图片灯箱
 * - 点击遮罩或 ESC 关闭
 * - 左右箭头 / 键盘方向键翻页
 * - 图片计数显示
 * - 深色遮罩，明暗模式自适应（始终深色背景）
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 同步外部传入的初始索引
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // 键盘事件：ESC 关闭，左右翻页
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 关闭按钮 */}
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="关闭"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* 图片计数 */}
          <motion.div
            className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {currentIndex + 1} / {images.length}
          </motion.div>

          {/* 上一张 */}
          {images.length > 1 && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="上一张"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}

          {/* 当前图片 */}
          <motion.div
            key={currentIndex}
            className="max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <img
              src={images[currentIndex]}
              alt={`图片 ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
          </motion.div>

          {/* 下一张 */}
          {images.length > 1 && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="下一张"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   MDX 图片组件（带灯箱触发）
   ============================================================ */

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
 */
export function MdxImage({
  src,
  alt,
  allImages,
  className,
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
