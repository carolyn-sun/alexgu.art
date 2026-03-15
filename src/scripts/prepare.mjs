import { execSync } from "node:child_process";

console.log("Starting preparation...");

// 1. Fix filenames (remove spaces, etc.)
console.log("Fixing filenames...");
execSync("./fix-name.sh", { stdio: "inherit" });

// 2. Generate EXIF JSON files
console.log("Generating EXIF JSON...");
execSync("node src/scripts/generate-json.mjs", { stdio: "inherit" });

// 3. Generate LQIP thumbnails
console.log("Generating LQIP thumbnails...");
execSync("node src/scripts/generate-lqip.mjs", { stdio: "inherit" });

// 4. Generate index.mdx for folders missing it
console.log("Generating index.mdx files...");
execSync("node src/scripts/generate-index-mdx.mjs", { stdio: "inherit" });

// 5. Generate lqImages.json for the gallery
console.log("Generating lqImages.json...");
execSync("node src/scripts/generate-lq-json.mjs", { stdio: "inherit" });

// 6. Sync to Cloudflare R2 (using rclone as priority)
console.log("Syncing to R2 via rclone...");
try {
  execSync("src/scripts/rclone-to-r2.sh", { stdio: "inherit" });
} catch (_e) {
  console.warn("Rclone sync failed, falling back to wrangler sync...");
  execSync("src/scripts/wrangler-to-r2.sh", { stdio: "inherit" });
}

console.log("Preparation complete!");
