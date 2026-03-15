import fs from "node:fs";

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

const files = [
  "docs/daily-photos-taken-by-film/index.mdx",
  "docs/daily-photos-taken-by-gfx100s/index.mdx",
  "docs/fall/index.mdx",
  "docs/hajime-sorayama/index.mdx",
  "docs/photo-ride-to-dhm/index.mdx",
  "docs/photo-trip-to-america/index.mdx",
  "docs/photo-trip-to-shengshan-island/index.mdx",
];

files.forEach(processFile);
