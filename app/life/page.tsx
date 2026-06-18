'use client';

import { useState, useMemo } from 'react';
import {
  lifeMoments,
  subCategoryMap,
  type TopCategory,
} from '@/content/data/life-moments';
import { MomentCard } from '@/components/moment-card';
import { cn } from '@/lib/utils';
import { Gamepad2, Music, BookOpen, Plane } from 'lucide-react';
import { books, getBooksByType, type ReadingType } from '@/content/data/books';
import { BookCard } from '@/components/book-card';

const tabs: { key: TopCategory | 'reading'; label: string; icon: React.ReactNode }[] = [
  { key: 'game', label: '游戏', icon: <Gamepad2 className="h-4 w-4" /> },
  { key: 'music', label: '音乐', icon: <Music className="h-4 w-4" /> },
  { key: 'reading', label: '阅读', icon: <BookOpen className="h-4 w-4" /> },
  { key: 'travel', label: '旅游', icon: <Plane className="h-4 w-4" /> },
];

export default function LifePage() {
  const [activeTab, setActiveTab] = useState<TopCategory | 'reading'>('travel');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('全部');
  const [activeReadingType, setActiveReadingType] = useState<ReadingType>('学习');

  // 当前 tab 下的子分类列表
  const subCategories = useMemo(() => {
    if (activeTab === 'reading') return [];
    return subCategoryMap[activeTab as TopCategory] || [];
  }, [activeTab]);

  // 过滤动态（游戏/音乐/旅游）
  const filteredMoments = useMemo(() => {
    if (activeTab === 'reading') return [];
    return lifeMoments
      .filter((m) => {
        if (m.topCategory !== activeTab) return false;
        if (activeSubCategory !== '全部' && m.subCategory !== activeSubCategory) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeTab, activeSubCategory]);

  // 切换 tab
  const handleTabChange = (tab: TopCategory | 'reading') => {
    setActiveTab(tab);
    setActiveSubCategory('全部');
  };

  return (
    <div className="animate-fade-in">
      {/* 顶部 Banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="h-40 w-full bg-gradient-to-br from-sky-400 to-indigo-500 sm:h-52">
          <img
            src="https://picsum.photos/seed/lifebanner/1200/400"
            alt="生活记录封面"
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-4 sm:px-6 sm:pb-5">
          <div className="text-white">
            <h1 className="text-xl font-bold drop-shadow-md sm:text-2xl">生活记录</h1>
            <p className="mt-0.5 text-xs text-white/90 drop-shadow">
              游戏、音乐、阅读与旅游
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-primary text-lg font-bold text-white shadow-lg sm:h-16 sm:w-16 sm:text-xl">
            任
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="mb-4 flex gap-2 border-b border-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 子分类筛选（游戏/音乐/旅游） */}
      {activeTab !== 'reading' && subCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSubCategory('全部')}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              activeSubCategory === '全部'
                ? 'bg-primary text-white'
                : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
            )}
          >
            全部
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setActiveSubCategory(sub)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                activeSubCategory === sub
                  ? 'bg-primary text-white'
                  : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 阅读板块 */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          {/* 学习/娱乐 切换 */}
          <div className="flex gap-2">
            {(['学习', '娱乐'] as ReadingType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveReadingType(type)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeReadingType === type
                    ? 'bg-primary text-white'
                    : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {getBooksByType(activeReadingType).map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
            {getBooksByType(activeReadingType).length === 0 && (
              <div className="py-16 text-center text-text-muted">
                该分类下暂无书籍
              </div>
            )}
          </div>
        </div>
      )}

      {/* 动态列表（游戏/音乐/旅游） */}
      {activeTab !== 'reading' && (
        <div className="divide-y divide-border">
          {filteredMoments.length > 0 ? (
            filteredMoments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))
          ) : (
            <div className="py-16 text-center text-text-muted">
              该分类下暂无动态
            </div>
          )}
        </div>
      )}
    </div>
  );
}
