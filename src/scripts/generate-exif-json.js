const {readdir, readFile, writeFile, stat, access} = require("fs/promises");
const {join, extname, basename} = require("path");
const {exec} = require("child_process");
const exifr = require("exifr");

const DOC_DIR = "docs";
const SUPPORTED_EXT = /\.(jpe?g|tiff?|heic)$/i;

const FIELDS = [
    "FocalLength",
    "FNumber",
    "ExposureTime",
    "ISO",
    "MeteringMode",
    "ExposureProgram",
    "ExposureCompensation",
    "Make",
    "Model",
    "LensModel",
    "Orientation",
    "ExposureMode",
    "WhiteBalance",
    "Flash",
    "CustomRendered",
    "Artist",
    "Copyright"
];

async function fileExists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function gitAdd(file) {
    return new Promise((resolve, reject) => {
        exec(`git add "${file}"`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function processDir(dir) {
    const files = await readdir(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) {
            await processDir(filePath);
            continue;
        }
        if (!SUPPORTED_EXT.test(file)) continue;

        const jsonPath = join(dir, `${basename(file, extname(file))}.json`);
        if (await fileExists(jsonPath)) {
            console.log(`EXISTED: ${jsonPath}, SKIP`);
            continue;
        }

        try {
            const buffer = await readFile(filePath);
            const exif = await exifr.parse(buffer);
            const filtered = {};
            for (const key of FIELDS) {
                if (exif && exif[key] !== undefined) {
                    filtered[key] = exif[key];
                }
            }
            if (!filtered.Copyright) {
                filtered.Copyright = "Alexander Gu";
            }
            await writeFile(jsonPath, JSON.stringify(filtered, null, 2), "utf-8");
            await gitAdd(jsonPath);
            console.log(`GENERATED, git add: ${jsonPath}`);
        } catch (err) {
            console.error(`ERROR WHEN GENERATING ${file}:`, err);
        }
    }
}

async function main() {
    await processDir(DOC_DIR);
}

main();