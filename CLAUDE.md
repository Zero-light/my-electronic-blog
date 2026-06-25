# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 开发服务器，http://localhost:3000
npm run build    # 静态导出到 out/（Vercel 部署命令）
npm run lint     # ESLint 检查
npx decap-server # Decap CMS 本地代理（用于 /admin/ 本地登录）
```

`npm run build` must pass before pushing — it includes TypeScript type-checking via `tsc`.

## Architecture

纯静态个人网站（零光驿站），Next.js 14 App Router + `output: 'export'`。部署在 Vercel，git push 自动触发构建。

### Content management: dual-write system

内容有两种修改路径，必须保持互相兼容：

1. **直接编辑源文件**（传统方式）：编辑 `.json` / `.mdx` → git push → Vercel 重建
2. **Decap CMS**（浏览器方式）：访问 `/admin/` → 表单编辑 → Decap 自动 git commit → Vercel 重建

**关键约束**：JSON 数据文件的结构必须同时满足两套消费者：
- TypeScript 组件通过 `@/content/data/xxx`（薄包装器）导入
- Decap CMS 通过 `public/admin/config.yml` 定义的 collection schema 编辑
- 修改 JSON 结构时，**两边都要同步更新**

### Data layer: JSON → TS wrapper pattern

```
content/data/profile.json  ←── Decap CMS 编辑此文件
         │
    profile.ts  (薄包装器: import → re-export with types)
         │
    app/about/page.tsx  (消费方，导入路径不变)
```

- 5 个 JSON 数据文件：`profile.json`, `skills.json`, `gallery.json`, `books.json`, `life-moments.json`
- 对应的 `.ts` 文件只做三件事：定义 interface、`import` JSON、`export` 带类型的常量
- 新增可编辑数据时遵循此模式，不要走回"数据内嵌在 TS 中"的老路

### MDX content pipeline

```
content/notes/*.mdx  ──→  lib/mdx.ts (fs + gray-matter 解析 frontmatter)
        │                       │
        │              NoteMeta / ProjectMeta / EssayMeta
        │                       │
        ▼                       ▼
  页面路由 (generateStaticParams)  ←  getAllNotes() / getAllProjects() / getAllEssays()
        │
  详情页 (getNoteBySlug)  →  MdxContent 组件  →  rehype-prism-plus 代码高亮
```

- 新增 MDX 文件后 `npm run build` 才能生成对应 HTML（`generateStaticParams` 构建时扫描）
- frontmatter 中 `date` 必须是有效日期字符串，否则排序异常
- `slug` 默认由文件名推导，也可在 frontmatter 中显式指定

### CSS theme system

明暗主题通过 CSS 变量 + `.dark` class 切换，变量定义在 `app/globals.css`：

```css
:root { --bg, --primary, --accent, --border, ... }   /* 亮色 */
.dark { --bg, --primary, --accent, --border, ... }    /* 暗色 */
```

- 所有组件中使用 `var(--变量名)` 或 Tailwind `dark:` 修饰符
- 全局新增变量时必须在 `:root` 和 `.dark` 中同时定义
- `next-themes` Provider 挂载在根布局，通过 `<ThemeToggle />` 切换

### Component patterns

- **Server Components**（默认）：页面、MDX 渲染器、卡片展示组件。直接 `import` 数据和工具函数
- **Client Components**（`'use client'` 标记）：交互式组件（筛选、灯箱、进度条、主题切换）。接收预计算数据作为 props
- 列表页的数据获取在 Server Component 中完成（`getAllNotes()` 等），通过 props 传递给 Client 筛选/分页组件

### Life page tab architecture

`app/life/page.tsx` 是一个纯 Client 页面，4 个 Tab（游戏/音乐/阅读/旅游）通过前端状态切换：
- "动态类" Tab（游戏/音乐/旅游）读取 `life-moments.json` → `MomentCard`
- "阅读类" Tab 读取 `books.json` → `BookCard`（含学习/娱乐二级筛选）
- `subCategoryMap` 在 JSON 中维护，驱动二级筛选胶囊

### Static route coverage

所有动态路由使用 `generateStaticParams` 预生成：
- `/notes/[slug]` ← `getAllNotes()`
- `/projects/[slug]` ← `getAllProjects()`
- `/life/essays/[slug]` ← `getAllEssays()`
- `/life/books/[slug]` ← `books` 数组

构建时若 MDX 目录为空，对应路由生成 0 页（不会报错）。

### Git workflow note

远程使用 SSH (`git@github.com:Zero-light/my-electronic-blog.git`)。HTTPS 在国内可能连接重置。推送前确保 SSH key 已加载到 agent。

### Project update log convention

修改项目代码后，必须在 `../更新日志/` 目录创建 `YYYY-MM-DD-简短描述.md`，遵循 `探访标记.md` 中的模板。该目录与源码目录平级，不在 `my-portfolio/` 内。
