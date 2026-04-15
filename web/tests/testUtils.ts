import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load, type CheerioAPI } from "cheerio";

export const SITE_URL = "https://cloudbytes.dev";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const WEB_ROOT = path.resolve(__dirname, "..");
export const DIST_DIR = path.join(WEB_ROOT, "dist");

export function normalizeUrl(url: string) {
    const parsed = new URL(url, SITE_URL);
    const pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${pathname}`;
}

export function routeToDistPath(routeOrUrl: string) {
    const parsed = new URL(routeOrUrl, SITE_URL);
    const pathname = parsed.pathname || "/";

    if (pathname === "/" || pathname === "") return path.join(DIST_DIR, "index.html");

    // Firebase cleanUrls commonly serves /404 -> /404.html
    if (pathname === "/404" || pathname === "/404/") return path.join(DIST_DIR, "404.html");

    const rel = pathname.startsWith("/") ? pathname.slice(1) : pathname;
    const hasExt = Boolean(path.extname(rel));

    if (pathname.endsWith("/")) return path.join(DIST_DIR, rel, "index.html");
    if (hasExt) return path.join(DIST_DIR, rel);
    return path.join(DIST_DIR, rel, "index.html");
}

export async function readHtml(routeOrUrl: string) {
    const filePath = routeToDistPath(routeOrUrl);
    return fs.readFile(filePath, "utf8");
}

export async function loadHtml(routeOrUrl: string): Promise<CheerioAPI> {
    const html = await readHtml(routeOrUrl);
    return load(html);
}

export async function listDistFiles() {
    const out: string[] = [];

    async function walk(currentAbs: string, currentRel: string) {
        const entries = await fs.readdir(currentAbs, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === ".DS_Store") continue;
            const abs = path.join(currentAbs, entry.name);
            const rel = currentRel ? `${currentRel}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                await walk(abs, rel);
                continue;
            }
            if (entry.isFile()) out.push(rel.replace(/\\/g, "/"));
        }
    }

    await walk(DIST_DIR, "");
    return out;
}

export async function listHtmlPages() {
    const files = await listDistFiles();
    return files.filter((f) => f.endsWith(".html") && !f.startsWith("_astro/"));
}

export async function getSitemapUrls() {
    const indexPath = path.join(DIST_DIR, "sitemap-index.xml");
    const fallbackPaths = [path.join(DIST_DIR, "sitemap-0.xml"), path.join(DIST_DIR, "sitemap.xml")];

    const readXml = async (xmlPath: string) => fs.readFile(xmlPath, "utf8");
    const extractLocs = (xml: string) => Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/gi), (m) => m[1]);

    try {
        const xml = await readXml(indexPath);
        const sitemapLocs = extractLocs(xml);
        const urls: string[] = [];

        for (const sitemapUrl of sitemapLocs) {
            const sitemapFile = routeToDistPath(sitemapUrl);
            const sitemapXml = await readXml(sitemapFile);
            urls.push(...extractLocs(sitemapXml));
        }

        if (urls.length) return urls;
    } catch {
        // ignore
    }

    for (const p of fallbackPaths) {
        try {
            const xml = await readXml(p);
            const urls = extractLocs(xml);
            if (urls.length) return urls;
        } catch {
            // ignore
        }
    }

    throw new Error("No sitemap found in web/dist (expected sitemap-index.xml or sitemap-0.xml). Run `npm run build` first.");
}

