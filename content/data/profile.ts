/**
 * 个人档案数据
 * 关于我 / 简历页面共用
 * 数据源：profile.json（可由 Decap CMS 在线编辑）
 */

import profileData from './profile.json';

export interface Education {
  school: string;
  major: string;
  degree: string;
  period: string;
  description?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  location: string;
  education: Education[];
  experience: Experience[];
  summary: string;
  objective: string;
  honors: string[];
}

export const profile: Profile = profileData;
