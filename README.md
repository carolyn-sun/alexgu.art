# alex.gu

## 主页文件

`src/pages/index.md`

## 前置条件

### Node.js
- [macOS](https://nodejs.org/dist/v22.19.0/node-v22.19.0.pkg)
- [Windows](https://nodejs.org/dist/v22.19.0/node-v22.19.0-x64.msi)

## 标准工作流

1. 在`docs`目录下创建一个新的文件夹，作为某一次项目的目录。
2. 上传不大于`25MB`的文件到该目录下，仅支持`jpeg`、`jpg`、`tiff`、`heic`格式。
3. 在`alex.gu`目录下运行`npm run docusaurus start`，启动本地服务器。
4. 上一步会遍历所有照片，并且在相同目录下**自动**生成同名的保存有 EXIF 信息的`json`文件。如果已经存在同名`json`文件，则会跳过该照片。因此，如果需要重新生成`json`文件，需要删除同名的`json`文件。
5. 同时，对于每个项目目录，都会**自动**生成一个`index.md`文件，作为该项目的页面文件。如果已经存在该文件，则会跳过该项目。因此，如果对于某一项目添加或者删除了照片后，需要重新生成`index.md`文件，需要删除该文件。在该文件中，可以添加一些描述性的文字，使用`markdown`语法，参考`docs/Hello/index.mdx`文件。
6. 提交所有更改后，等待自动部署后，即可在`https://alex.gu`下查看效果。