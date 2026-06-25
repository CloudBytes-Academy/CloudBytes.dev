import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = new URL(".", import.meta.url);
const svgUrl = new URL("../public/img/icons/favicon.svg", here);
const outDirUrl = new URL("../public/img/icons/", here);

const outDir = fileURLToPath(outDirUrl);
await mkdir(outDir, { recursive: true });

const svgPath = fileURLToPath(svgUrl);
const svgBuffer = await readFile(svgPath);

const sizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-48x48.png", size: 48 },
    { name: "favicon-96x96.png", size: 96 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
    { name: "mstile-150x150.png", size: 150 },
    { name: "maskable_icon.png", size: 1024 },
];

// Generate root /favicon.ico as a 48×48 PNG (browsers accept PNG data in .ico)
const rootIcoPath = fileURLToPath(new URL("../public/favicon.ico", here));
await sharp(svgBuffer, { density: 1024 }).resize(48, 48, { fit: "contain" }).png().toFile(rootIcoPath);

await Promise.all(
    sizes.map(async ({ name, size }) => {
        const outPath = path.join(outDir, name);
        await sharp(svgBuffer, { density: 1024 }).resize(size, size, { fit: "contain" }).png().toFile(outPath);
    }),
);

console.log(`Generated ${sizes.length} icons in ${outDir}`);
