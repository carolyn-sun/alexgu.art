const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
sharp.concurrency(1);
sharp.cache(false);

const ROOT = path.join(__dirname, "../../docs");
const MAX_SIZE = 3 * 1024 * 1024; // 3MB

function isJpeg(file) {
  return /\.(jpe?g)$/i.test(file) && !/_lq\.jpe?g$/i.test(file);
}

async function processImage(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const lqipPath = path.join(dir, `${base}_lq.jpeg`);
  if (fs.existsSync(lqipPath)) return;

  let quality = 40;
  let buffer;
  const image = sharp(filePath, {
    limitInputPixels: false,
  });
  const meta = await image.metadata();
  let pipeline = image;
  if (meta.width > 3000) {
    pipeline = image.resize({ width: 3000 });
  }
  do {
    buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    quality -= 5;
  } while (buffer.length > MAX_SIZE && quality > 10);

  fs.writeFileSync(lqipPath, buffer);
  console.log(
    `GENERATED: ${lqipPath} (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`,
  );
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (isJpeg(full)) {
      processImage(full).catch(console.error);
    }
  });
}

walk(ROOT);
