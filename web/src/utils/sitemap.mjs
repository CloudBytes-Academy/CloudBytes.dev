/**
 * Sitemap helpers (config-time, plain ESM).
 *
 * Builds a `Map<canonicalPath, ISO-date>` from the posts content collection by
 * reading frontmatter directly off disk. Used by `@astrojs/sitemap`'s
 * `serialize` callback to add `<lastmod>` to every post URL.
 *
 * Plain ESM because astro.config.mjs runs at config time, before Vite resolves
 * the `@/` alias.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, "../content/posts");

const DATE_RE = /^([\w]+):\s*"?(\d{4}-\d{2}-\d{2})"?\s*$/;

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out = [];
    for (const e of entries) {
        const abs = path.join(dir, e.name);
        if (e.isDirectory()) {
            out.push(...(await walk(abs)));
        } else if (/\.(md|mdx)$/i.test(e.name)) {
            out.push(abs);
        }
    }
    return out;
}

function parseFrontmatter(text) {
    const m = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return {};
    const raw = m[1];
    const data = {};
    for (const rawLine of raw.split(/\r?\n/)) {
        const line = rawLine.trimEnd();
        const dm = line.match(DATE_RE);
        if (dm) {
            data[dm[1]] = dm[2];
            continue;
        }
        const generic = line.match(/^([\w]+):\s*"?([^"]*)"?\s*$/);
        if (generic) data[generic[1]] = generic[2];
    }
    return data;
}

function canonicalPathFor(category, slug) {
    return `/${category}/${slug}/`;
}

/**
 * Build a Map<canonicalPath, ISODate> from the posts collection.
 * Returned dates use `updatedDate` if present, otherwise `pubDate`.
 */
export async function buildLastModMap() {
    let files;
    try {
        files = await walk(POSTS_DIR);
    } catch {
        return new Map();
    }

    const map = new Map();
    for (const file of files) {
        try {
            const text = await fs.readFile(file, "utf8");
            const fm = parseFrontmatter(text);
            if (fm.draft === "true") continue;
            const date = fm.updatedDate ?? fm.pubDate;
            if (!date) continue;
            if (!fm.categorySlug || !fm.slug) continue;
            const iso = new Date(date).toISOString();
            map.set(canonicalPathFor(fm.categorySlug, fm.slug), iso);
        } catch {
            /* ignore individual file failures */
        }
    }

    return map;
}

const PAGINATION_RE = /\/\d+\/?$/;

/**
 * Filter callback for @astrojs/sitemap. Drops:
 *  - paginated archive URLs (`/page/2/`, `/aws-academy/3/`, `/tags/python/4/`,
 *    `/authors/rehan-haider/2/`)
 *  - the 404 route
 */
export function sitemapFilter(url) {
    const u = new URL(url);
    const pathname = u.pathname;

    if (pathname === "/404/" || pathname === "/404") return false;

    // Trailing-numeric segment = pagination
    if (PAGINATION_RE.test(pathname)) return false;

    return true;
}

/**
 * Serialize callback wrapper. Returns a closure bound to the lastmod map so
 * astro.config.mjs can pass it directly.
 */
export function sitemapSerialize(lastModMap, fallbackIso) {
    return (item) => {
        const u = new URL(item.url);
        const pathname = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;

        const iso = lastModMap.get(pathname);
        return {
            ...item,
            lastmod: iso ?? fallbackIso,
        };
    };
}
