# 个人综合知识库 & 求职作品集

面向电子信息/嵌入式工程师的纯静态个人网站，兼具私人知识库存储与求职作品集展示。

## 技术栈

- **框架**：Next.js 14 App Router（静态导出）
- **语言**：TypeScript（严格模式）
- **样式**：Tailwind CSS 3 + CSS 变量（明暗双主题）
- **内容**：MDX（gray-matter 解析 frontmatter）+ JSON 数据文件（Decap CMS 双写）
- **部署**：Vercel（git push 自动构建）

## 功能预览

| 模块 | 功能 |
|------|------|
| **首页** | 个人简介 Hero、方向标签、最新项目、最新笔记 |
| **学习笔记** | 关键词搜索、软件/硬件主分类 + 子分类筛选、加载更多、MDX 渲染、代码高亮 |
| **项目作品** | 卡片网格、分类筛选、加载更多、详情页（头图 + 硬件/软件面板 + MDX） |
| **简历** | 在线预览、打印适配、个人信息 / 求职意向 / 教育 / 项目 / 技能 / 荣誉 / 自我评价 |
| **明暗主题** | 右上角一键切换，跟随系统偏好 |
| **Decap CMS** | 浏览器端内容编辑 `/admin/`，自动 git commit |

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
│   ├── layout.tsx          # 根布局（导航 + 主题 + 页脚）
│   ├── page.tsx            # 首页
│   ├── notes/              # 笔记中心（列表 + 详情）
│   ├── projects/           # 项目作品集（列表 + 详情）
│   └── resume/             # 简历
├── components/             # React 组件库
│   ├── ui/                 # 底层基础组件（Card / Header / Footer / Layout ...）
│   ├── skill-bar.tsx       # 技能进度条
│   ├── category-filter.tsx # 分类筛选
│   ├── note-card.tsx       # 笔记卡片
│   ├── project-card.tsx    # 项目卡片
│   ├── notes-list.tsx      # 笔记列表（搜索 + 分类筛选 + 加载更多）
│   ├── projects-list.tsx   # 项目列表（分类筛选 + 加载更多）
│   ├── mdx-content.tsx     # MDX 渲染器（代码高亮 + 灯箱）
│   ├── image-lightbox.tsx  # 图片灯箱
│   ├── timeline.tsx        # 时间线
│   ├── tag-filter.tsx      # 标签筛选
│   ├── book-card.tsx       # 书籍卡片
│   ├── moment-card.tsx     # 动态卡片
│   ├── gallery-grid.tsx    # 相册网格
│   ├── hero-glow.tsx       # Hero 光晕背景
│   ├── resume-actions.tsx  # 简历操作栏（PDF 下载 + 打印）
│   └── toc.tsx             # 文章目录
├── content/                # 网站内容（纯文件驱动）
│   ├── notes/*.mdx         # 学习笔记
│   ├── projects/*.mdx      # 项目作品
│   ├── essays/*.mdx        # 随笔
│   └── data/               # JSON 数据文件（Decap CMS 可编辑）
│       ├── profile.json    # 个人信息
│       ├── skills.json     # 技能数据
│       ├── gallery.json    # 相册数据
│       ├── books.json      # 阅读数据
│       └── life-moments.json # 生活动态数据
├── lib/                    # 工具函数
│   ├── utils.ts            # 通用工具（cn / 日期格式化）
│   └── mdx.ts              # MDX 读取与解析
├── public/                 # 静态资源
│   └── images/             # 头像、项目图、笔记配图
├── next.config.js          # Next.js 配置（静态导出）
├── tailwind.config.js      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 内容管理

### 方式一：Decap CMS（推荐）

访问 `/admin/` → 登录 → 表单编辑 → 自动 git commit → Vercel 重建。

支持编辑的字段在 `public/admin/config.yml` 中定义。

### 方式二：直接编辑源文件

**新增笔记**：

1. 在 `content/notes/` 下新建 `.mdx` 文件
2. 填写 frontmatter：

```yaml
---
title: 文章标题
date: 2025-01-01
tags: ['标签1', '标签2']
mainCategory: 嵌入式基础
subCategory: STM32
description: 文章简介
cover: /images/xxx.jpg
---
```

3. 编写正文（支持标准 Markdown + 代码块 + 图片）
4. 运行 `npm run build` 重新构建

**新增项目**：

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

**修改个人信息**：

编辑 `content/data/profile.json` 与 `content/data/skills.json`，即全站联动更新。

## 自定义主题色

修改 `app/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: #0ea5e9;      /* 主色 */
  --primary-dark: #0284c7; /* 深色 */
  --accent: #06b6d4;       /* 强调色 */
}
```

## 数据双写机制

JSON 数据文件同时被两套消费者读取：
- TypeScript 组件通过 `@/content/data/xxx` 薄包装器导入
- Decap CMS 通过 `public/admin/config.yml` 的 collection schema 编辑

修改 JSON 结构时，两边都要同步更新。

## 许可证

本站所有内容仅供学习交流，转载请注明出处。
