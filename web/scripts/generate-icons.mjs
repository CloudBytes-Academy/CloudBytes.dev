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
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
    { name: "mstile-150x150.png", size: 150 },
    { name: "maskable_icon.png", size: 1024 },
];

await Promise.all(
    sizes.map(async ({ name, size }) => {
        const outPath = path.join(outDir, name);
        await sharp(svgBuffer, { density: 1024 })
            .resize(size, size, { fit: "contain" })
            .png()
            .toFile(outPath);
    }),
);

console.log(`Generated ${sizes.length} icons in ${outDir}`);

