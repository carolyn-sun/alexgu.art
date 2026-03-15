import { execSync } from "child_process";

execSync("node src/scripts/generate-lqip.mjs", { stdio: "inherit" });
execSync("node src/scripts/generate-json.mjs", { stdio: "inherit" });
execSync("src/scripts/wrangler-to-r2.sh", { stdio: "inherit" });
// execSync("src/scripts/rclone-to-r2.sh", { stdio: "inherit" });
execSync("node src/scripts/generate-index-mdx.mjs", { stdio: "inherit" });
