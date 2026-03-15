import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
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
        const data = node.data || (node.data = {});
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
  integrations: [react(), mdx()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions, remarkAutoPhoto],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
