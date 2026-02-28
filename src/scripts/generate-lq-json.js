const fs = require("fs");
const path = require("path");

const docsDir = path.resolve(__dirname, "../../docs");
const staticDir = path.resolve(__dirname, "../../public");
const result = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/lq.*\.(jpe?g|png|webp)$/i.test(file)) {
      const relPath = fullPath.replace(docsDir, "").replace(/\\/g, "/");
      result.push(`/docs${relPath}`);
    }
  }
}

walk(docsDir);

if (fs.existsSync(path.resolve(__dirname, "../../dist"))) {
  const output = path.join(__dirname, "../../dist", "lqImages.json");
  fs.writeFileSync(output, JSON.stringify(result, null, 2));
}

const staticOutput = path.join(staticDir, "lqImages.json");
fs.writeFileSync(staticOutput, JSON.stringify(result, null, 2));

console.log("lqImages.json generated.");
