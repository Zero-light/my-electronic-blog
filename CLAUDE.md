# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills — 自动触发规则（无需手动调用）

我已安装以下技能，它们会根据对话上下文 **自动匹配触发**，不需要我输入 `/xxx` 命令：

### 🧠 行为准则（始终生效）
- **karpathy-guidelines** — 编码前先思考、保持简洁、只做精确修改。每次对话自动激活

### 🔍 代码质量（遇到问题自动触发）
- **addy-code-review-and-quality** — 审查代码时自动启用多维审查
- **addy-code-simplification** — 检测到复杂代码时自动建议简化
- **addy-performance-optimization** — 涉及性能优化时自动触发
- **addy-security-and-hardening** — 处理用户输入/认证/存储时自动启用
- **addy-debugging-and-error-recovery** — 测试失败/构建错误时自动进入系统排查

### 📋 开发流程（场景触发）
- **addy-test-driven-development** / **tdd** — 写测试时自动应用 TDD 流程
- **addy-incremental-implementation** — 大功能拆小步实现
- **addy-documentation-and-adrs** — 做架构决策时自动记录
- **addy-planning-and-task-breakdown** — 大任务拆解时自动启用

### 🎨 前端专项
- **addy-frontend-ui-engineering** — 构建 UI 组件时自动激活
- **addy-browser-testing-with-devtools** — 浏览器调试时自动启用

### 应用规则
以上所有技能应当 **根据上下文自动激活**，无需用户指定技能名称。当对话中出现相关场景（代码审查、调试、性能、安全、写测试、架构设计、任务拆解等），自动选择匹配的技能来处理。技能的完整内容对用户透明，不必每次汇报哪个技能被激活了。

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

---

## 🗺️ 项目记忆索引（按需加载，不占上下文）

以下信息存于 `~/.claude/projects/C--/memory/` 的记忆文件中，需要时我会读取详细内容：

| 记忆文件 | 一句话概要 | 什么时候读取 |
|---|---|---|
| `project-structure.md` | 全部 12 个项目的本地路径 + GitHub 仓库映射 | 需要操作项目时 |
| `knowledge-base.md` | 知识库位置 `D:\知识库\` + GitHub 私有仓库 | 需要查/写笔记时 |
| `github-config.md` | GitHub: `Zero-light`，SSH 方式连接 | 需要操作 GitHub 时 |
| `skills-config.md` | 44 个已安装技能 + 自动触发规则 | 需要排查技能问题时 |
| `user-profile.md` | 你的技术栈、偏好、身份 | 了解工作方式时 |

### 常用命令速查
```bash
# 本网站
npm run dev      # 开发服务器
npm run build    # 构建（推送前必须通过）

# 知识库位置
D:\知识库\       （已同步 GitHub 私有仓库）
```
