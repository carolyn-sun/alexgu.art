const { readdir, access, writeFile } = require("fs/promises");
const { join, extname, basename } = require("path");
const { exec } = require("child_process");

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

    // 读取目录里所有文件（包括图片与 json）
    const allFiles = await readdir(folder);
    if (allFiles.length === 0) continue;

    // 将同一 base (去掉 _lq 或 -lq 后缀) 归并到一个 record
    const groups = new Map(); // baseNoLQ -> { image: fn?, lq: fn?, json: fn? }

    for (const f of allFiles) {
      if (f.startsWith(".")) continue;
      const ext = extname(f).toLowerCase();
      const name = basename(f, extname(f));
      const baseNoLQ = name.replace(/[-_]?lq$/i, "");

      let rec = groups.get(baseNoLQ);
      if (!rec) {
        rec = { image: null, lq: null, json: null };
        groups.set(baseNoLQ, rec);
      }

      if (ext === ".json") {
        rec.json = f;
      } else if (imageExts.has(ext)) {
        // 判断是不是带 lq 的文件
        if (name.match(/[-_]?lq$/i)) {
          rec.lq = f;
        } else {
          // 优先把非-lq 的文件当作主图
          rec.image = f;
        }
      }
    }

    // 生成 import lines 与 <Photo /> 行（保证每个文件只 import 一次，且顺序为：image, lq, json）
    const importLines = [];
    const photoLines = [];

    function makeVarName(base) {
      // 去掉所有非字母数字，若以数字开头则前面加下划线，然后全部大写
      let v = base.replace(/[^A-Za-z0-9]/g, "");
      if (!v) v = base.replace(/[^A-Za-z0-9_]/g, "_"); // 兜底
      if (/^[0-9]/.test(v)) v = "_" + v;
      return v.toUpperCase();
    }

    for (const [base, rec] of groups) {
      // 如果目录里既没有图片也没有 json，跳过
      if (!rec.image && !rec.lq && !rec.json) continue;

      const varBase = makeVarName(base);

      // import 主图（如果存在）
      if (rec.image) {
        importLines.push(`import ${varBase} from "./${rec.image}";`);
      } else {
        // 若没有主图但存在 lq，可把 lq 当作 src（可根据你需求改）
        if (rec.lq) {
          importLines.push(`import ${varBase} from "./${rec.lq}";`);
        }
      }

      // import lq（如果存在）
      if (rec.lq) {
        importLines.push(`import ${varBase}LQ from "./${rec.lq}";`);
      }

      // import json（如果存在）
      if (rec.json) {
        importLines.push(`import ${varBase}JSON from "./${rec.json}";`);
      }

      // 构造 <Photo ... /> 行 —— 只加入存在的 props
      const props = [];
      // src 必须存在（rec.image 或 rec.lq 已经作为 src import）
      props.push(`src={${varBase}}`);
      if (rec.lq) props.push(`lqip={${varBase}LQ}`);
      if (rec.json) props.push(`json={${varBase}JSON}`);
      photoLines.push(`<Photo ${props.join(" ")} />`);
    }

    // 去重 importLines 并保持顺序（同一文件不会被重复 import）
    const seen = new Set();
    const uniqImports = [];
    for (const imp of importLines) {
      if (!seen.has(imp)) {
        seen.add(imp);
        uniqImports.push(imp);
      }
    }

    const mdxLines = [
      `# ${entry.name}`,
      "",
      `import Photo from "../../src/components/Photo.tsx";`,
      "",
      ...uniqImports,
      "",
      ...photoLines,
    ];

    const mdxContent = mdxLines.join("\n");
    const mdxPath = join(folder, "index.mdx");
    await writeFile(mdxPath, mdxContent, "utf-8");
    await gitAdd(mdxPath);
    console.log(`GENERATED: ${mdxPath}`);
  }
}

processFolders(DOCS_DIR);
