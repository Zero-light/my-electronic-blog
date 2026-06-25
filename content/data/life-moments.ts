/**
 * 生活动态数据
 * 一级分类：游戏 / 音乐 / 旅游
 * 每个一级分类下有自己的子分类
 * 数据源：life-moments.json（可由 Decap CMS 在线编辑）
 */

import lifeData from './life-moments.json';

export type TopCategory = 'game' | 'music' | 'travel';

export interface LifeMoment {
  id: string;
  /** 一级分类 */
  topCategory: TopCategory;
  /** 子分类（游戏名 / 音乐类型 / 旅游地点） */
  subCategory: string;
  /** 发布时间 */
  date: string;
  /** 动态文字内容 */
  content: string;
  /** 配图 */
  images: string[];
  /** 位置信息（可选） */
  location?: string;
}

export const lifeMoments: LifeMoment[] = lifeData.moments as LifeMoment[];

/** 各一级分类下的子分类 */
export const subCategoryMap: Record<TopCategory, string[]> =
  lifeData.subCategoryMap as Record<TopCategory, string[]>;
