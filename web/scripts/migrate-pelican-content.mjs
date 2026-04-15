import fs from "node:fs/promises";
import path from "node:path";

const WEB_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEB_ROOT, "..");

const PELICAN_CONTENT_ROOT = path.join(REPO_ROOT, "content");
const SOURCE_POST_DIRS = [
    { dir: path.join(PELICAN_CONTENT_ROOT, "articles"), defaultCategory: "Snippets" },
    { dir: path.join(PELICAN_CONTENT_ROOT, "aws"), defaultCategory: "AWS Academy" },
    { dir: path.join(PELICAN_CONTENT_ROOT, "books"), defaultCategory: "Books" },
];
const SOURCE_PAGES_DIR = path.join(PELICAN_CONTENT_ROOT, "pages");

const OUT_CONTENT_ROOT = path.join(WEB_ROOT, "src", "content");
const OUT_POSTS_ROOT = path.join(OUT_CONTENT_ROOT, "posts");
const OUT_PAGES_ROOT = path.join(OUT_CONTENT_ROOT, "pages");

const OUT_PUBLIC_ROOT = path.join(WEB_ROOT, "public");
const SOURCE_IMAGES_DIR = path.join(PELICAN_CONTENT_ROOT, "images");
const SOURCE_EXTRA_DIR = path.join(PELICAN_CONTENT_ROOT, "extra");

function slugify(input) {
    return String(input ?? "")
        .trim()
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
}

function splitList(value) {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

async function pathExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function walkMarkdownFiles(dir) {
    const out = [];

    async function walk(current) {
        const entries = await fs.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                await walk(full);
                continue;
            }
            if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
                out.push(full);
            }
        }
    }

    if (await pathExists(dir)) {
        await walk(dir);
    }

    return out;
}

function parsePelicanMarkdown(sourceText) {
    const lines = sourceText.split(/\r?\n/);
    const meta = {};
    let i = 0;
    let currentKey = null;

    for (; i < lines.length; i++) {
        const line = lines[i];

        // end of meta block
        if (line.trim() === "") {
            i++;
            break;
        }

        const match = /^([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line);
        if (match) {
            const rawKey = match[1];
            const rawValue = match[2] ?? "";
            currentKey = rawKey.toLowerCase();

            if (meta[currentKey] === undefined) meta[currentKey] = rawValue.trim();
            else meta[currentKey] = `${meta[currentKey]}\n${rawValue.trim()}`;

            continue;
        }

        // Support indented continuation lines (Markdown meta extension behavior)
        if (currentKey && /^\s+/.test(line)) {
            meta[currentKey] = `${meta[currentKey]}\n${line.trim()}`.trim();
            continue;
        }

        // If we hit a non-meta line before a blank line, treat as body (no meta).
        if (i === 0) break;
    }

    const body = lines.slice(i).join("\n").trimStart();
    return { meta, body };
}

function deriveSlugFromFilename(filePath) {
    const base = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
    const withoutPrefix = base.replace(/^\d+-/, "");
    return slugify(withoutPrefix);
}

function yamlScalar(value) {
    return JSON.stringify(String(value ?? ""));
}

function toYamlFrontmatter(obj) {
    const lines = ["---"];

    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            if (value.length === 0) continue;
            lines.push(`${key}:`);
            for (const item of value) lines.push(`    - ${yamlScalar(item)}`);
            continue;
        }

        if (typeof value === "boolean") {
            lines.push(`${key}: ${value ? "true" : "false"}`);
            continue;
        }

        if (typeof value === "number") {
            lines.push(`${key}: ${value}`);
            continue;
        }

        lines.push(`${key}: ${yamlScalar(value)}`);
    }

    lines.push("---", "");
    return lines.join("\n");
}

function rewriteBody(body) {
    let out = body;

    // Pelican static macro
    out = out.replace(/\{static\}\/images\//g, "/images/");

    // Pelican filename links to pages
    out = out.replace(/\{filename\}\/pages\/([^\s)]+)\b/g, (_m, p1) => {
        const withoutExt = p1.replace(/\.(md|markdown)$/i, "");
        const slug = slugify(path.basename(withoutExt));
        return `/${slug}.html`;
    });

    return out;
}

async function ensureEmptyDir(dir) {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
}

async function writeTextFile(outPath, text) {
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, text, "utf8");
}

async function migratePostFile(filePath, defaults) {
    const sourceText = await fs.readFile(filePath, "utf8");
    const { meta, body } = parsePelicanMarkdown(sourceText);

    const title = meta.title || "";
    const pubDate = meta.date || "";
    const category = meta.category || defaults.defaultCategory || "Uncategorized";
    const categorySlug = slugify(category);
    const slug = meta.slug || deriveSlugFromFilename(filePath);

    const tags = splitList(meta.tags);
    const keywords = splitList(meta.keywords);

    const description = (meta.summary || meta.description || "").trim();
    const author = (meta.author || "").trim();

    const series = (meta.series || "").trim() || undefined;
    const seriesIndex = meta.series_index ? Number(meta.series_index) : undefined;
    const youtubeId = (meta.youtube_id || "").trim() || undefined;

    const isDraft =
        /\bdraft\b/i.test(meta.status || "") ||
        /\[draft\]/i.test(path.basename(filePath)) ||
        /\bdraft\b/i.test(path.dirname(filePath));

    const fm = toYamlFrontmatter({
        title,
        description: description || title,
        pubDate,
        category,
        categorySlug,
        slug,
        tags,
        keywords,
        author: author || undefined,
        authorSlug: author ? slugify(author) : undefined,
        series,
        seriesIndex: Number.isFinite(seriesIndex) ? seriesIndex : undefined,
        youtubeId,
        draft: isDraft ? true : undefined,
    });

    const finalBody = rewriteBody(body);

    const outPath = path.join(OUT_POSTS_ROOT, categorySlug, `${slug}.md`);
    await writeTextFile(outPath, `${fm}${finalBody.trimEnd()}\n`);
    return { outPath, categorySlug, slug };
}

async function migratePageFile(filePath) {
    const sourceText = await fs.readFile(filePath, "utf8");
    const { meta, body } = parsePelicanMarkdown(sourceText);

    const title = meta.title || "";
    const slug = meta.slug || deriveSlugFromFilename(filePath);
    const pubDate = meta.date || undefined;
    const keywords = splitList(meta.keywords);
    const description = (meta.summary || meta.description || "").trim();

    const isDraft =
        /\bdraft\b/i.test(meta.status || "") ||
        /\[draft\]/i.test(path.basename(filePath)) ||
        /\bdraft\b/i.test(path.dirname(filePath));

    const fm = toYamlFrontmatter({
        title,
        description: description || title,
        pubDate,
        slug,
        keywords,
        draft: isDraft ? true : undefined,
    });

    const finalBody = rewriteBody(body);

    const outPath = path.join(OUT_PAGES_ROOT, `${slug}.md`);
    await writeTextFile(outPath, `${fm}${finalBody.trimEnd()}\n`);
    return { outPath, slug };
}

async function copyPublicAssets() {
    // images → public/images
    if (await pathExists(SOURCE_IMAGES_DIR)) {
        await fs.mkdir(OUT_PUBLIC_ROOT, { recursive: true });
        await fs.cp(SOURCE_IMAGES_DIR, path.join(OUT_PUBLIC_ROOT, "images"), { recursive: true });
    }

    // extra files → public/
    const extraFiles = ["SW.js", "robots.txt", "ads.txt"];
    for (const filename of extraFiles) {
        const src = path.join(SOURCE_EXTRA_DIR, filename);
        if (!(await pathExists(src))) continue;
        await fs.mkdir(OUT_PUBLIC_ROOT, { recursive: true });
        await fs.copyFile(src, path.join(OUT_PUBLIC_ROOT, filename));
    }
}

async function main() {
    if (path.basename(WEB_ROOT) !== "web") {
        console.error(`Expected to run from /web, but cwd is: ${WEB_ROOT}`);
        process.exitCode = 1;
        return;
    }

    await ensureEmptyDir(OUT_POSTS_ROOT);
    await ensureEmptyDir(OUT_PAGES_ROOT);

    let postCount = 0;
    let pageCount = 0;

    for (const source of SOURCE_POST_DIRS) {
        const files = await walkMarkdownFiles(source.dir);
        for (const filePath of files) {
            await migratePostFile(filePath, source);
            postCount += 1;
        }
    }

    const pageFiles = await walkMarkdownFiles(SOURCE_PAGES_DIR);
    for (const filePath of pageFiles) {
        await migratePageFile(filePath);
        pageCount += 1;
    }

    await copyPublicAssets();

    console.log(`Migrated posts: ${postCount}`);
    console.log(`Migrated pages: ${pageCount}`);
    console.log(`Wrote content to: ${OUT_CONTENT_ROOT}`);
    console.log(`Wrote public assets to: ${OUT_PUBLIC_ROOT}`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

