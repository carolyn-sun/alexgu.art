import { exec } from "node:child_process";
import { access, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const DOCS_DIR = "docs";
const INDEX_FILES = ["index.mdx", "index.md", "index.html", "index.ts"];

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function shouldSkip(dir) {
  for (const name of INDEX_FILES) {
    if (await fileExists(join(dir, name))) return true;
  }
  return false;
}

async function gitAdd(file) {
  return new Promise((resolve, reject) => {
    exec(`git add "${file}"`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function processFolders(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const imageExts = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".tif",
    ".tiff",
  ]);

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = join(root, entry.name);
    if (await shouldSkip(folder)) {
      console.log(`INDEX FILE EXISTED, SKIP ${folder}`);
      continue;
    }

    const allFiles = await readdir(folder);
    if (allFiles.length === 0) continue;

    const baseNames = new Set();
    for (const f of allFiles) {
      if (f.startsWith(".")) continue;
      const ext = extname(f).toLowerCase();
      if (imageExts.has(ext)) {
        const name = basename(f, ext);
        if (!name.match(/[-_]?lq$/i)) {
          baseNames.add(name);
        }
      }
    }

    if (baseNames.size === 0) continue;

    const mdxLines = [
      `---`,
      `title: "${entry.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}"`,
      `date: ${new Date().toISOString().split("T")[0]}`,
      `---`,
      ``,
      `# ${entry.name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      ``,
    ];

    for (const base of Array.from(baseNames).sort()) {
      mdxLines.push(`![${base}](./${base})`);
    }

    mdxLines.push(`\n`);

    const mdxContent = mdxLines.join("\n");
    const mdxPath = join(folder, "index.mdx");
    await writeFile(mdxPath, mdxContent, "utf-8");
    await gitAdd(mdxPath);
    console.log(`GENERATED: ${mdxPath}`);
  }
}

processFolders(DOCS_DIR);
