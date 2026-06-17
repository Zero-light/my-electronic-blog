# 部署文档

## 推荐方案：Vercel（零配置）

### 1. 准备代码仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourname/my-portfolio.git
git push -u origin main
```

### 2. Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)，使用 GitHub 账号登录
2. 点击 **Add New Project**
3. 选择 `my-portfolio` 仓库
4. **Framework Preset** 选择 `Next.js`
5. 点击 **Deploy**

### 3. 配置构建输出

项目已配置 `next.config.js` 的 `output: 'export'`，Vercel 会自动识别并输出纯静态 HTML。

无需额外环境变量。

### 4. 自定义域名（可选）

在 Vercel Dashboard → Project Settings → Domains 中添加自定义域名，按提示配置 DNS 记录即可。

---

## 备选方案：GitHub Pages

### 1. 修改 next.config.js

确保已设置：

```js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
```

### 2. 本地构建并推送

```bash
npm run build
```

构建产物位于 `out/` 目录。

使用 [gh-pages](https://github.com/tschaub/gh-pages) 自动部署：

```bash
npm install --save-dev gh-pages
```

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "gh-pages -d out"
  }
}
```

然后执行：

```bash
npm run build
npm run deploy
```

### 3. 配置 GitHub Pages

进入仓库 Settings → Pages → Source，选择 `gh-pages` 分支。

---

## 备选方案：Cloudflare Pages

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 选择 Pages → Create a project → Connect to Git
3. 选择仓库，构建配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. 点击 **Save and Deploy**

---

## 静态资源打包说明

- `public/` 目录下的所有文件会在构建时原样复制到 `out/`
- 图片建议控制在 **200 KB 以内**，使用 [TinyPNG](https://tinypng.com/) 压缩
- 简历 PDF 放入 `public/pdfs/resume.pdf`，页面中通过 `/pdfs/resume.pdf` 引用
- 可下载资料放入 `public/files/`，直接在 MDX 或页面中链接

## 构建注意事项

- 本项目使用 **纯静态导出**，无需 Node.js 运行时
- 动态路由（`[slug]`）已配置 `generateStaticParams`，确保所有 MDX 文件在构建时生成对应 HTML
- 若新增 MDX 文件后构建失败，检查 frontmatter 中的 `date` 是否为有效日期格式

## 更新部署

内容更新后，只需：

```bash
git add .
git commit -m "Update content"
git push origin main
```

Vercel / Cloudflare Pages 会自动触发重新构建与部署。
