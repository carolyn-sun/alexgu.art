const {readdir, access, writeFile} = require("fs/promises");
const {join, extname, basename} = require("path");
const {exec} = require("child_process");

const DOCS_DIR = "docs";
const SUPPORTED_EXT = /\.(jpe?g|tiff?|heic|png)$/i;
const INDEX_FILES = [
    "index.mdx",
    "index.md",
    "index.html",
    "index.ts"
];

function toVarName(filename) {
    return basename(filename, extname(filename)).replace(/[^a-zA-Z0-9_]/g, "_");
}

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

async function getImageFiles(dir) {
    const files = await readdir(dir);
    return files.filter(f => SUPPORTED_EXT.test(f) && !/\.lq\.jpe?g$/i.test(f));
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
    const entries = await readdir(root, {withFileTypes: true});
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const folder = join(root, entry.name);
        if (await shouldSkip(folder)) {
            console.log(`INDEX FILE EXISTED, SKIP ${folder}`);
            continue;
        }
        const images = await getImageFiles(folder);
        if (images.length === 0) continue;

        const importLines = images.flatMap(img => {
            const imgVar = toVarName(img);
            const lqipFile = `${basename(img, extname(img))}.lq.jpeg`;
            const lqipVar = toVarName(lqipFile) + 'LQ';
            const jsonFile = `${basename(img, extname(img))}.json`;
            const jsonVar = toVarName(jsonFile) + 'JSON';
            return [
                `import ${imgVar} from "./${img}";`,
                `import ${lqipVar} from "./${lqipFile}";`,
                `import ${jsonVar} from "./${jsonFile}";`
            ];
        });
        const photoLines = images.map(img => {
            const imgVar = toVarName(img);
            const lqipFile = `${basename(img, extname(img))}.lq.jpeg`;
            const lqipVar = toVarName(lqipFile) + 'LQ';
            const jsonFile = `${basename(img, extname(img))}.json`;
            const jsonVar = toVarName(jsonFile) + 'JSON';
            return `<Photo src={${imgVar}} lqip={${lqipVar}} json={${jsonVar}} />`;
        });
        const mdxLines = [
            `# ${entry.name}`,
            "",
            `import Photo from '../../src/components/Photo.tsx';`,
            "",
            ...importLines,
            "",
            ...photoLines
        ];
        const mdxContent = mdxLines.join("\n");

        const mdxPath = join(folder, "index.mdx");
        await writeFile(mdxPath, mdxContent, "utf-8");
        await gitAdd(mdxPath);
        console.log(`GENERATED: ${mdxPath}`);
    }
}

processFolders(DOCS_DIR);