'use client';

import { useState } from 'react';
import { LifeMoment } from '@/content/data/life-moments';
import { formatDate, cn } from '@/lib/utils';
import { MapPin, X } from 'lucide-react';

export interface MomentCardProps {
  moment: LifeMoment;
}

/**
 * 单条朋友圈动态组件
 * - 左侧头像（首字母）
 * - 右侧：昵称、时间、内容、图片网格、位置
 * - 点击图片可放大预览
 */
export function MomentCard({ moment }: MomentCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = moment.images;

  // 根据图片数量决定网格布局类名
  const getGridClass = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <>
      <article className="flex gap-3 py-4 sm:gap-4">
        {/* 头像 */}
        <div className="shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-11 sm:w-11">
            任
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="min-w-0 flex-1">
          {/* 昵称 */}
          <div className="text-sm font-semibold text-primary">
            任炳宇
          </div>

          {/* 时间 */}
          <div className="mt-0.5 text-xs text-text-muted">
            {formatDate(moment.date)}
            {moment.subCategory && (
              <span className="ml-2 rounded-full bg-bg-soft px-1.5 py-0.5 text-[0.65rem]">
                {moment.subCategory}
              </span>
            )}
          </div>

          {/* 文字内容 */}
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {moment.content}
          </p>

          {/* 图片网格 */}
          {images.length > 0 && (
            <div className={cn('mt-2 grid gap-1', getGridClass(images.length))}>
              {images.map((src, idx) => (
                <button
                  key={`${moment.id}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="relative overflow-hidden rounded-lg bg-bg-soft"
                >
                  <img
                    src={src}
                    alt={`${moment.subCategory} ${idx + 1}`}
                    className="aspect-square w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* 位置 */}
          {moment.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-text-muted">
              <MapPin className="h-3 w-3" />
              {moment.location}
            </div>
          )}
        </div>
      </article>

      {/* 简易灯箱 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt="预览"
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
