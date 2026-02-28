# alexgu.art

[中文](#中文) | [English](#english)

---

## English

This is the source code for [alexgu.art](https://alexgu.art), a premium photography archive built with **Astro 5**, **React**, and **Framer Motion**. It is optimized for high-performance visual storytelling, featuring automated EXIF extraction and cinematic animations.

### Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Storage**: Cloudflare R2 (Photos) / Cloudflare Pages (Hosting)

### Prerequisites

- **Node.js**: v20 or later
- **Cloudflare Wrangler**: For R2 sync

### Optimized Workflow

1. **Add Photos**: Create a new folder in `docs/` (e.g., `docs/my-trip/`) and drop your high-res photos there.
   - **Recommendation**: Use `jpeg` format. `tiff` files are too large for web delivery, and `heic` compatibility is limited.
2. **Process Series**:
   ```bash
   npm run process
   ```
   This automatically fixes filenames, extracts EXIF data to `.json` files, and generates low-quality thumbnails (`_lq.jpeg`) for fast loading.
3. **Draft Content**: Create an `index.mdx` in your folder. The site will automatically detect and include it in the "Selected Series" on the home page.
   - Use `<Photo json={filename} />` for images.
   - Use `:::note` for callouts.
4. **Sync to Cloud**:
   ```bash
   npm run sync
   ```
   Uploads photos to Cloudflare R2.
5. **Deploy**:
   ```bash
   npm run build
   ```
   Followed by a `git push` to trigger the automated build on Cloudflare Pages.

---

## 中文

[Alexander Gu](https://github.com/gjc1202) 的摄影作品集与数字存档。基于 **Astro 5** 构建，追求极致的视觉体验与呈现。

### 技术栈

- **框架**: Astro (SSG 静态生成)
- **样式**: Tailwind CSS + 自定义精细设计系统
- **动画**: Framer Motion
- **存储**: Cloudflare R2 (照片) / Cloudflare Pages (托管)

### 简化工作流

1. **新增作品**: 在 `docs/` 下创建文件夹（如 `docs/shanghai-streets/`），放入原始照片。
   - **建议**: 推荐使用 `jpeg` 格式。`tiff` 文件体积过于庞大，而 `heic` 在部分浏览器（如 Chrome/Firefox）上的兼容性欠佳。
2. **自动化处理**:
   ```bash
   npm run process
   ```
   脚本将自动：修正非法文件名、提取照片 EXIF 信息至 `.json` 文件、生成用于预加载的低画质略缩图 (`_lq.jpeg`)。
3. **内容创作**: 在文件夹内创建 `index.mdx`。
   - 首页会自动识别并添加至 "Selected Series"。
   - 使用 `<Photo json={filename} />` 组件引入照片。
4. **同步 R2**:
   ```bash
   npm run sync
   ```
5. **发布**:
   ```bash
   git push
   ```
   推送代码后，Cloudflare Pages 将自动构建并发布。

### 注意事项

- **关于 public/docs**: 该文件夹是一个软链接（Symlink），直接指向根目录下的 `docs`。这使得我们可以在本地开发时直接加载大量照片，而无需在不同目录间进行沉重的复制操作。请勿将其删除。
