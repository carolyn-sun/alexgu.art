# alex.gu

[中文](#中文) | [English](#english)

## English

[Alexander Gu](https://github.com/gjc1202) is the site owner.

This is the source code repository for [https://alexgu.art](https://alexgu.art). Built with [Docusaurus](https://github.com/facebook/docusaurus) 3 and optimized for showcasing photography works. Deployed on Cloudflare Pages, with photos stored in Cloudflare R2.

### Prerequisites

- [NodeJS 20 or later](https://nodejs.org/zh-cn/download)
- [RClone optional, otherwise use Wrangler](https://rclone.org/downloads/)

### Standard Workflow

1. Before starting any work, use `git pull` to fetch the latest code.
2. Create a new folder under the `docs` directory to serve as the directory for a specific project.
3. Upload files no larger than `25MB` (to comply with Cloudflare Pages service limits) to that directory, supporting only `jpeg`, `jpg`, ~~`tiff`~~, ~~`heic`~~ formats. **It is recommended to use `jpeg` format only, as `tiff` files are too large and `heic` compatibility is limited to Safari**.
4. Run the `./fix-name.sh` script to correct file names.
5. Run `npm run start` in the `alex.gu` directory to start the local server.
6. The previous step will traverse all photos and **automatically** generate a `json` file with the same name containing EXIF information in the same directory. If a `json` file with the same name already exists, that photo will be skipped. Therefore, if you need to regenerate the `json` file, you need to delete the `json` file with the same name.
7. Additionally, for each project directory, an `index.md` file will be **automatically** generated as the page file for that project. If the file already exists, that project will be skipped. Therefore, if you add or delete photos for a project and need to regenerate the `index.md` file, you need to delete that file. In that file, you can add some descriptive text using `Markdown` syntax and [`Docusaurus`'s `MDX` syntax](https://docusaurus.io/docs/markdown-features/react).
8. Afterwards, the script will upload the photos to Cloudflare R2 via RClone or Wrangler.
9. Add the sidebar link for that project in `sidebars.ts`. Add the index link in `src/pages/index.mdx`.

## 中文

[Alexander Gu](https://github.com/gjc1202) 是站点所有者。

这是 [https://alexgu.art](https://alexgu.art) 的源代码仓库。基于 [Docusaurus](https://github.com/facebook/docusaurus) 3 构建，针对展现摄影作品进行了优化。部署于 Cloudflare Pages，照片存储于 Cloudflare R2。

### 前置条件

- [NodeJS 20 或更高版本](https://nodejs.org/dist/v22.19.0/)
- [RClone 可选，否则使用 Wrangler](https://rclone.org/downloads/)

### 标准工作流

1. 每次工作以前，使用`git pull`拉取最新的代码。
2. 在`docs`目录下创建一个新的文件夹，作为某一次项目的目录。
3. 上传不大于`25MB`的文件（以便使用 Cloudflare Pages 服务）到该目录下，仅支持`jpeg`、`jpg`、~~`tiff`~~、~~`heic`~~ 格式。**只推荐使用`jpeg`格式，因为`tiff`文件体积过大，`heic`的兼容性仅限于 Safari**。
4. 运行`./fix-name.sh`脚本，修正文件名。
5. 在`alex.gu`目录下运行`npm run start`，启动本地服务器。
6. 上一步会遍历所有照片，并且在相同目录下**自动**生成同名的保存有 EXIF 信息的`json`文件。如果已经存在同名`json`文件，则会跳过该照片。因此，如果需要重新生成`json`文件，需要删除同名的`json`文件。
7. 同时，对于每个项目目录，都会**自动**生成一个`index.md`文件，作为该项目的页面文件。如果已经存在该文件，则会跳过该项目。因此，如果对于某一项目添加或者删除了照片后，需要重新生成`index.md`文件，需要删除该文件。在该文件中，可以添加一些描述性的文字，使用`Markdown`语法，以及[`Docusaurus`的`MDX`语法](https://docusaurus.io/docs/markdown-features/react)。
8. 此后，脚本会透过 RClone 或 Wrangler 将照片上传至 Cloudflare R2。
9. 在`sidebars.ts`中，添加该项目的侧边栏链接或。在 `src/pages/index.mdx` 中，添加索引链接。

