import fs from "node:fs";
import path from "node:path";

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, "utf8");

  const jsonImportRegex =
    /import\s+([A-Za-z0-9_]+)\s+from\s+['"]\.\/([^'"]+)\.json['"]/g;
  const map = {};
  let match;
  match = jsonImportRegex.exec(content);
  while (match !== null) {
    map[match[1]] = match[2];
    match = jsonImportRegex.exec(content);
  }

  content = content.replace(/import\s+Photo\s+from\s+[^;]+;?\n?/g, "");
  content = content.replace(
    /import\s+[A-Za-z0-9_]+\s+from\s+['"]\.\/[^'"]+\.(json|jpeg|jpg|png)['"];?\n?/g,
    "",
  );

  const photoRegex = /<Photo[^>]*\/>/g;
  content = content.replace(photoRegex, (fullMatch) => {
    const jsonMatch = /json=\{([A-Za-z0-9_]+)\}/.exec(fullMatch);
    if (jsonMatch) {
      const varName = jsonMatch[1];
      if (map[varName]) {
        const base = map[varName];
        return `![${base}](./${base})`;
      } else {
        // If the variable isn't mapped, fallback to just using varName as base
        return `![${varName}](./${varName})`;
      }
    }
    return fullMatch;
  });

  content = content.replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated ${filePath}`);
}

// Dynamically scan all docs/*/index.{md,mdx} instead of a hardcoded list.
const docsDir = path.resolve("docs");
if (fs.existsSync(docsDir)) {
  const galleries = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);

  for (const gallery of galleries) {
    for (const ext of ["mdx", "md"]) {
      const idx = path.join(docsDir, gallery, `index.${ext}`);
      if (fs.existsSync(idx)) {
        processFile(idx);
      }
    }
  }
} else {
  console.warn(`docs directory not found at ${docsDir}`);
}
