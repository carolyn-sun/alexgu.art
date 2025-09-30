const { execSync } = require("child_process");

execSync("node src/scripts/generate-lqip.js", { stdio: "inherit" });
execSync("node src/scripts/generate-json.js", { stdio: "inherit" });
execSync("./rclone-to-r2.sh", { stdio: "inherit" });
execSync("node src/scripts/generate-index-mdx.js", { stdio: "inherit" });
