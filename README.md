# alexgu.art

[中文](#中文) | [English](#english)

---

## English

This is the source code for [alexgu.art](https://alexgu.art), a premium photography archive built with **Astro 6**, **React**, and **Framer Motion**. It is optimized for high-performance visual storytelling, featuring automated EXIF extraction and cinematic animations.

### Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Storage**: Cloudflare R2 (Photos) / Cloudflare Pages (Hosting)

### Prerequisites

- **Node.js**: v20 or later
- **Cloudflare Wrangler**: For R2 sync
- **RClone**: For R2 sync

### Optimized Workflow

1. **Add Photos**: Create a new folder in `docs/` (e.g., `docs/my-trip/`) and drop your high-res photos there.
   - **Recommendation**: Use `jpeg` format. `tiff` files are too large for web delivery, and `heic` compatibility is limited.
2. **Process Everything**:

   ```bash
   npm run process
   ```

   This one-stop command automates the entire workflow:
   - **Filename Fixing**: Removes spaces and special characters.
   - **EXIF Extraction**: Generates metadata JSON files for each photo.
   - **LQIP Generation**: Creates low-quality thumbnails (`_lq.jpeg`) for fast loading.
   - **MDX Auto-generation**: Creates `index.mdx` gallery pages for new folders.
   - **Gallery Indexing**: Updates `lqImages.json` for frontend display.
   - **R2 Sync (RClone/Wrangler)**: Uploads high-res photos to Cloudflare and cleans up local storage.

3. **Edit Content**: Open the auto-generated `index.mdx` in your folder to add captions or custom text. The site automatically detects it for the "Selected Series".
   - Standard Markdown `![Image Title](./filename)` renders the `<Photo />` component with EXIF metadata.
   - Use `:::note` for callouts.
4. **Deploy**:
   ```bash
   npm run build
   ```
   Followed by a `git push` to trigger the automated build on Cloudflare Pages.

---

## 中文

[Alexander Gu](https://github.com/gjc1202) 的摄影作品集与数字存档。基于 **Astro 6** 构建，追求极致的视觉体验与呈现。

### 技术栈

- **框架**: Astro (SSG 静态生成)
- **样式**: Tailwind CSS + 自定义精细设计系统
- **动画**: Framer Motion
- **存储**: Cloudflare R2 (照片) / Cloudflare Pages (托管)

### 简化工作流

1. **新增作品**: 在 `docs/` 下创建文件夹（如 `docs/shanghai-streets/`），放入原始照片。
   - **建议**: 推荐使用 `jpeg` 格式。
2. **一键处理**:

   ```bash
   npm run process
   ```

   该环境自动化处理以下 6 个步骤：
   - **名称修正**: 移除路径中的空格与特殊字符。
   - **EXIF 提取**: 自动生成每张照片的元数据 JSON 文件。
   - **略缩图生成**: 生成用于极致性能加载的 LQIP (`_lq.jpeg`)。
   - **MDX 自动生成**: 为新文件夹自动补全 `index.mdx` 页面。
   - **全局索引更新**: 更新全局 `lqImages.json` 用于画廊渲染。
   - **R2 同步 (RClone)**: 自动上传原图至云端并清理本地冗余。

3. **内容润色**: 编辑自动生成的 `index.mdx`。
   - 首页会自动识别并添加至 "Selected Series"。
   - 基础 Markdown 语法 `![图片说明](./图片名称)` 即可自动解析 EXIF 数据。
4. **发布**:
   ```bash
   npm run build && git push
   ```
   推送代码后，Cloudflare Pages 将自动构建并发布。

### 注意事项

- **关于 public/docs**: 该文件夹是一个软链接（Symlink），直接指向根目录下的 `docs`。这使得我们可以在本地开发时直接加载大量照片，而无需在不同目录间进行沉重的复制操作。请勿将其删除。
