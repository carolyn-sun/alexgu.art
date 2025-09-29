const path = require("path");
const webpack = require("webpack");

module.exports = function pluginCdnJpg(context, opts = {}) {
  const isCI = process.env.GITHUB_ACTIONS === "true";
  const CDN_BASE = (opts.cdnBase || process.env.CDN_BASE || "").replace(
    /\/$/,
    "",
  );

  const docsDir = path.resolve(process.cwd(), "docs");

  return {
    name: "plugin-cdn-assets",
    configureWebpack() {
      const rules = [
        // 仅打包 docs 下的 "_lq-" 低清图
        {
          test: /_lq-.*\.(jpe?g)$/i,
          include: [docsDir],
          type: "asset/resource",
          generator: {
            filename: (pathData) => {
              const rel = path
                .relative(docsDir, pathData.filename)
                .replace(/\\/g, "/");
              return `assets/images/${rel}`;
            },
            publicPath: `/`,
          },
        },
      ];

      const plugins = [];

      if (isCI) {
        if (!CDN_BASE) {
          console.warn(
            "[plugin-cdn-assets] CI detected but CDN_BASE is empty.",
          );
        }

        plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /\/docs\/(?!.*\/_lq-).*\.jpe?g$/i,
            (resource) => {
              const abs = resource.context
                ? path.resolve(resource.context, resource.request)
                : resource.request;
              const rel = path.relative(docsDir, abs).replace(/\\/g, "/");
              resource.request =
                require.resolve("./cdn-exporter.js") +
                `?p=${encodeURIComponent(rel)}&base=${encodeURIComponent(CDN_BASE)}`;
            },
          ),
        );
      }

      return { module: { rules }, plugins };
    },
  };
};
