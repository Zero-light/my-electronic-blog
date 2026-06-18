'use client';

import { useState, useMemo } from 'react';
import {
  lifeMoments,
  travelCategories,
  hobbyCategories,
  gameSubCategories,
  type MomentType,
} from '@/content/data/life-moments';
import { MomentCard } from '@/components/moment-card';
import { cn } from '@/lib/utils';
import { Plane, Gamepad2 } from 'lucide-react';

export default function LifePage() {
  const [activeTab, setActiveTab] = useState<MomentType>('travel');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('全部');

  // 根据当前 tab 获取可用的主分类
  const categories = useMemo(() => {
    return activeTab === 'travel' ? travelCategories : hobbyCategories;
  }, [activeTab]);

  // 过滤动态
  const filteredMoments = useMemo(() => {
    return lifeMoments
      .filter((m) => {
        if (m.type !== activeTab) return false;
        if (activeCategory !== '全部' && m.category !== activeCategory) return false;
        if (
          activeTab === 'hobby' &&
          activeCategory === '游戏' &&
          activeSubCategory !== '全部' &&
          m.subCategory !== activeSubCategory
        )
          return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeTab, activeCategory, activeSubCategory]);

  // 切换 tab 时重置分类
  const handleTabChange = (tab: MomentType) => {
    setActiveTab(tab);
    setActiveCategory('全部');
    setActiveSubCategory('全部');
  };

  // 切换主分类时重置子分类
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory('全部');
  };

  return (
    <div className="animate-fade-in">
      {/* 顶部 Banner（类似微信相册封面） */}
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
              旅游、爱好与日常点滴
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-primary text-lg font-bold text-white shadow-lg sm:h-16 sm:w-16 sm:text-xl">
            任
          </div>
        </div>
      </div>

      {/* Tab 切换：旅游 / 爱好 */}
      <div className="mb-4 flex gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => handleTabChange('travel')}
          className={cn(
            'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
            activeTab === 'travel'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text'
          )}
        >
          <Plane className="h-4 w-4" />
          旅游
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('hobby')}
          className={cn(
            'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
            activeTab === 'hobby'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text'
          )}
        >
          <Gamepad2 className="h-4 w-4" />
          爱好
        </button>
      </div>

      {/* 主分类筛选 */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange('全部')}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            activeCategory === '全部'
              ? 'bg-primary text-white'
              : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
          )}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
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

      {/* 游戏子分类筛选（仅在爱好-游戏下显示） */}
      {activeTab === 'hobby' && activeCategory === '游戏' && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSubCategory('全部')}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeSubCategory === '全部'
                ? 'bg-accent text-white'
                : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
            )}
          >
            全部
          </button>
          {gameSubCategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setActiveSubCategory(sub)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                activeSubCategory === sub
                  ? 'bg-accent text-white'
                  : 'bg-bg-soft text-text-muted hover:bg-border hover:text-text'
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 动态列表 */}
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
    </div>
  );
}
