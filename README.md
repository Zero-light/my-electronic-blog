# 个人综合知识库 & 求职作品集

面向电子信息/嵌入式工程师的纯静态个人网站，兼具私人知识库存储、求职作品集展示与生活记录分享。

## 技术栈

- **框架**：Next.js 14 App Router（静态导出）
- **语言**：TypeScript（严格模式）
- **样式**：Tailwind CSS 3 + CSS 变量（明暗双主题）
- **内容**：MDX（gray-matter 解析 frontmatter）
- **部署**：Vercel / GitHub Pages / Cloudflare Pages

## 功能预览

| 模块 | 功能 |
|------|------|
| **首页** | 个人 Banner、三大快捷入口、技能可视化、最新动态 |
| **学习笔记** | 卡片瀑布流、多标签筛选、加载更多、MDX 渲染、代码高亮、图片灯箱 |
| **项目作品** | 项目卡片、标签筛选、详情页（头图 + 硬件/软件面板 + MDX） |
| **生活记录** | 随笔时间线、相册瀑布流、分类筛选、灯箱预览 |
| **关于我** | 个人简介、教育/实习时间线、技能汇总 |
| **简历** | 在线预览、PDF 下载、打印适配 |
| **全局搜索** | 弹窗式搜索，支持标题/标签/描述匹配，快捷键 `Ctrl+K` |
| **明暗主题** | 右上角一键切换，跟随系统偏好 |

## 本地启动

```bash
# 1. 安装依赖
npm install

# 2. 开发模式
npm run dev

# 3. 构建（静态导出到 out/）
npm run build
```

开发服务器默认运行在 http://localhost:3000。

## 目录结构

```
my-portfolio/
├── app/                    # Next.js 页面路由
│   ├── layout.tsx          # 根布局（导航 + 主题 + 页脚 + 搜索）
│   ├── page.tsx            # 首页
│   ├── notes/              # 笔记中心（列表 + 详情）
│   ├── projects/           # 项目作品集（列表 + 详情）
│   ├── life/               # 生活专区（入口 + 随笔 + 相册）
│   ├── about/              # 关于我
│   └── resume/             # 简历
├── components/             # React 组件库
│   ├── ui/                 # 底层基础组件（Card / Header / Footer / Layout ...）
│   ├── skill-bar.tsx       # 技能进度条
│   ├── tag-filter.tsx      # 标签筛选
│   ├── note-card.tsx       # 笔记卡片
│   ├── project-card.tsx    # 项目卡片
│   ├── notes-list.tsx      # 笔记列表（客户端筛选 + 分页）
│   ├── projects-list.tsx   # 项目列表（客户端筛选 + 分页）
│   ├── mdx-content.tsx     # MDX 渲染器（代码高亮 + 灯箱）
│   ├── image-lightbox.tsx  # 图片灯箱
│   ├── timeline.tsx        # 时间线
│   ├── gallery-grid.tsx    # 相册瀑布流
│   ├── copy-btn.tsx        # 通用复制按钮
│   └── search-box.tsx      # 全局搜索弹窗
├── content/                # 网站内容（纯文件驱动）
│   ├── notes/*.mdx         # 学习笔记
│   ├── projects/*.mdx      # 项目作品
│   ├── essays/*.mdx        # 随笔日记
│   └── data/               # TypeScript 静态数据
│       ├── profile.ts      # 个人档案
│       ├── skills.ts       # 技能数据
│       └── gallery.ts      # 相册数据
├── lib/                    # 工具函数
│   ├── utils.ts            # 通用工具（cn / 日期格式化）
│   ├── mdx.ts              # MDX 读取与解析
│   └── search.ts           # 搜索索引构建
├── public/                 # 静态资源
│   ├── images/             # 图片（头像、项目图、相册）
│   ├── pdfs/               # 简历 PDF
│   └── files/              # 可下载资料
├── next.config.js          # Next.js 配置（静态导出）
├── tailwind.config.js      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 内容管理

### 新增笔记

1. 在 `content/notes/` 下新建 `.mdx` 文件
2. 填写 frontmatter：

```yaml
---
title: 文章标题
date: 2025-01-01
tags: ['标签1', '标签2']
category: 分类名
description: 文章简介
cover: /images/xxx.jpg
---
```

3. 编写正文（支持标准 Markdown + 代码块 + 图片）
4. 运行 `npm run build` 重新构建

### 新增项目

步骤同上，文件放在 `content/projects/`。项目 frontmatter 额外支持：

```yaml
period: 2024.03 – 2024.06
hardware:
  - STM32F407
  - Altium Designer
software:
  - STM32CubeIDE
  - MATLAB
```

### 修改个人信息

编辑 `content/data/profile.ts` 与 `content/data/skills.ts`，全站联动更新。

## 自定义主题色

修改 `app/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: #0ea5e9;      /* 主色 */
  --primary-dark: #0284c7; /* 深色 */
  --accent: #06b6d4;       /* 强调色 */
}
```

## 许可证

本站所有内容仅供学习交流，转载请注明出处。
