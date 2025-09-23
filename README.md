# alex.gu

## 主页文件

`src/pages/index.md`

## 前置条件

### Node.js
- [macOS](https://nodejs.org/dist/v22.19.0/node-v22.19.0.pkg)
- [Windows](https://nodejs.org/dist/v22.19.0/node-v22.19.0-x64.msi)

## 标准工作流

1. 每次工作以前，使用`git pull`拉取最新的代码。
2. 在`docs`目录下创建一个新的文件夹，作为某一次项目的目录。
3. 上传不大于`25MB`的文件到该目录下，仅支持`jpeg`、`jpg`、`tiff`、`heic`格式。**只推荐使用`jpeg`格式，因为`tiff`文件体积过大，`heic`的兼容性仅限于 Safari**。
4. 在`alex.gu`目录下运行`npm run docusaurus start`，启动本地服务器。
5. 上一步会遍历所有照片，并且在相同目录下**自动**生成同名的保存有 EXIF 信息的`json`文件。如果已经存在同名`json`文件，则会跳过该照片。因此，如果需要重新生成`json`文件，需要删除同名的`json`文件。
6. 同时，对于每个项目目录，都会**自动**生成一个`index.md`文件，作为该项目的页面文件。如果已经存在该文件，则会跳过该项目。因此，如果对于某一项目添加或者删除了照片后，需要重新生成`index.md`文件，需要删除该文件。在该文件中，可以添加一些描述性的文字，使用`markdown`语法，参考`docs/Hello/index.mdx`文件。
7. 提交所有更改后，等待自动部署后，即可在`https://alexgu.art`下查看效果。在[这里](https://github.com/carolyn-sun/alexgu.art/commits/main/)查看构建日志。

## 其他

在文件开始添加以下的标柱，可以将该页面设置为草稿状态，不会出现在网站上。

```markdown
---
draft: true
---
```
