import path from "node:path";
import { visit } from "unist-util-visit";

export function remarkAutoPhoto() {
  return (tree, file) => {
    let photoIndex = 0;
    const importNodes = [];
    let hasPhotoImport = false;

    // Check if Photo is already imported
    visit(tree, "mdxjsEsm", (node) => {
      if (node.value?.includes("Photo.tsx")) {
        hasPhotoImport = true;
      }
    });

    // Pre-pass: split paragraphs that contain multiple images (separated only
    // by whitespace text nodes) into one paragraph per image. Markdown parsers
    // merge consecutive `![]()` lines (no blank line between them) into a
    // single paragraph; if we leave it intact, the replaced <Photo> JSX nodes
    // get nested inside a single <p>, producing invalid HTML that breaks
    // React hydration on the first island in the paragraph.
    for (let i = tree.children.length - 1; i >= 0; i--) {
      const node = tree.children[i];
      if (node.type !== "paragraph") continue;
      const images = node.children.filter((c) => c.type === "image");
      if (images.length <= 1) continue;
      // Only split if every non-image child is pure whitespace text.
      const onlyImagesAndWs = node.children.every(
        (c) => c.type === "image" || (c.type === "text" && !c.value.trim()),
      );
      if (!onlyImagesAndWs) continue;

      // Replace this paragraph with one paragraph per image.
      const replacements = images.map((img) => ({
        type: "paragraph",
        children: [img],
      }));
      tree.children.splice(i, 1, ...replacements);
    }

    visit(tree, "image", (node, index, parent) => {
      const src = node.url;
      // We only target local files that don't have http or / absolute paths
      if (src && (src.startsWith("./") || src.startsWith("../"))) {
        const base = src.replace(/\.(json|jpeg|jpg|png|webp|gif)$/, "");

        photoIndex++;
        const jsonVar = `PhotoJson_${photoIndex}`;
        const lqipVar = `PhotoLqip_${photoIndex}`;

        const importStmt = `import ${jsonVar} from "${base}.json";\nimport ${lqipVar} from "${base}_lq.jpeg";`;

        const estree = {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: jsonVar },
                },
              ],
              source: {
                type: "Literal",
                value: `${base}.json`,
                raw: `"${base}.json"`,
              },
            },
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: lqipVar },
                },
              ],
              source: {
                type: "Literal",
                value: `${base}_lq.jpeg`,
                raw: `"${base}_lq.jpeg"`,
              },
            },
          ],
        };

        importNodes.push({
          type: "mdxjsEsm",
          value: importStmt,
          data: { estree },
        });

        const photoNode = {
          type: "mdxJsxFlowElement",
          name: "Photo",
          attributes: [
            { type: "mdxJsxAttribute", name: "client:visible" },
            {
              type: "mdxJsxAttribute",
              name: "json",
              value: {
                type: "mdxJsxAttributeValueExpression",
                value: jsonVar,
                data: {
                  estree: {
                    type: "Program",
                    body: [
                      {
                        type: "ExpressionStatement",
                        expression: { type: "Identifier", name: jsonVar },
                      },
                    ],
                    sourceType: "module",
                  },
                },
              },
            },
            {
              type: "mdxJsxAttribute",
              name: "lqip",
              value: {
                type: "mdxJsxAttributeValueExpression",
                value: lqipVar,
                data: {
                  estree: {
                    type: "Program",
                    body: [
                      {
                        type: "ExpressionStatement",
                        expression: { type: "Identifier", name: lqipVar },
                      },
                    ],
                    sourceType: "module",
                  },
                },
              },
            },
          ],
          children: [],
        };

        // If parent is a paragraph and contains only this image, replace the paragraph
        if (parent && parent.type === "paragraph") {
          const onlyImage =
            parent.children.length === 1 && parent.children[0] === node;
          if (onlyImage) {
            Object.assign(parent, photoNode);
            return;
          }
        }

        // Replace node in-situ
        parent.children[index] = photoNode;
      }
    });

    if (photoIndex > 0) {
      if (!hasPhotoImport) {
        // Try to dynamically compute the path to Photo.tsx
        let photoTsxPath = "../../src/components/Photo.tsx"; // default fallback

        if (file?.path && file.cwd) {
          const absolutePhotoTsx = path.join(
            file.cwd,
            "src/components/Photo.tsx",
          );
          let relPath = path.relative(
            path.dirname(file.path),
            absolutePhotoTsx,
          );
          if (!relPath.startsWith(".")) relPath = `./${relPath}`;

          // Replace backslashes with forward slashes for Windows (just in case)
          photoTsxPath = relPath.split(path.sep).join("/");
        }

        const importPhotoStmt = `import Photo from "${photoTsxPath}";`;
        const estree = {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: "Photo" },
                },
              ],
              source: {
                type: "Literal",
                value: photoTsxPath,
                raw: `"${photoTsxPath}"`,
              },
            },
          ],
        };
        tree.children.unshift({
          type: "mdxjsEsm",
          value: importPhotoStmt,
          data: { estree },
        });
      }
      tree.children.unshift(...importNodes);
    }
  };
}
