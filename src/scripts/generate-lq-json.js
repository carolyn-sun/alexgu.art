const fs = require('fs');
const path = require('path');

const staticDir = path.resolve(__dirname, '../../static');
const result = [];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (/lq.*\.(jpe?g|png|webp)$/i.test(file)) {
            result.push(fullPath.replace(staticDir, '').replace(/\\/g, '/'));
        }
    }
}

walk(staticDir);

const output = path.join(staticDir, 'lqImages.json');
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log('lqImages.json generated.');