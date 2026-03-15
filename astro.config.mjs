import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { remarkAutoPhoto } from "./src/plugins/remark-photo.mjs";

function remarkAdmonitions() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (!node.data) node.data = {};
        const data = node.data;
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;
        data.hProperties = {
          ...node.attributes,
          class: `admonition admonition-${node.name}`,
        };
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://alexgu.art",
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions, remarkAutoPhoto],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
