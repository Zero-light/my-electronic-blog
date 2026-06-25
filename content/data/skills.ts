/**
 * 技能数据
 * 首页 / 关于我 / 简历页面共用
 * 按分类分组，每项包含名称与熟练度（0–100）
 * 数据源：skills.json（可由 Decap CMS 在线编辑）
 */

import skillsData from './skills.json';

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  items: SkillItem[];
}

export const skillCategories: SkillCategory[] = skillsData.categories;
