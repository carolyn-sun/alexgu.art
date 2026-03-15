import { visit } from "unist-util-visit";
import path from "node:path";

export function remarkAutoPhoto() {
  return (tree, file) => {
    let photoIndex = 0;
    const importNodes = [];
    let hasPhotoImport = false;

    // Check if Photo is already imported
    visit(tree, "mdxjsEsm", (node) => {
      if (node.value && node.value.includes("Photo.tsx")) {
        hasPhotoImport = true;
      }
    });

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

        if (file && file.path && file.cwd) {
          const absolutePhotoTsx = path.join(
            file.cwd,
            "src/components/Photo.tsx",
          );
          let relPath = path.relative(
            path.dirname(file.path),
            absolutePhotoTsx,
          );
          if (!relPath.startsWith(".")) relPath = "./" + relPath;

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
