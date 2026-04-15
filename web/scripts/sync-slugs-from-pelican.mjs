import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");

const OLD_CONTENT_ROOT = path.join(REPO_ROOT, "content");
const OLD_SOURCES = [
    path.join(OLD_CONTENT_ROOT, "aws"),
    path.join(OLD_CONTENT_ROOT, "articles"),
    path.join(OLD_CONTENT_ROOT, "books"),
];

const NEW_POSTS_ROOT = path.join(WEB_ROOT, "src", "content", "posts");

function slugify(input) {
    return String(input ?? "")
        .trim()
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
}

function stripWrappingQuotes(value) {
    const v = String(value ?? "").trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
    return v;
}

function parsePelicanMeta(text) {
    const out = {};
    for (const rawLine of String(text ?? "").split(/\r?\n/)) {
        const line = rawLine.trimEnd();
        if (!line.trim()) break;
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        out[key] = value;
    }
    return out;
}

function normalizeDraftBasename(base) {
    // Old sources sometimes use "[DRAFT] 123-foo.md", new Astro content uses "draft-123-foo.md"
    const trimmed = String(base ?? "").trim();
    const m = /^\[draft\]\s*(.+)$/i.exec(trimmed);
    if (!m) return null;
    return `draft-${m[1].trim()}`;
}

async function listMarkdownFilesNonRecursive(dir) {
    const out = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isFile()) continue;
            if (!/\.(md|mdx)$/i.test(entry.name)) continue;
            out.push(path.join(dir, entry.name));
        }
    } catch {
        // ignore
    }
    return out;
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
            if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) out.push(full);
        }
    }

    await walk(dir);
    return out;
}

function parseAstroFrontmatter(text) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/m.exec(String(text ?? ""));
    if (!match) return { yaml: "", body: String(text ?? "") };
    return { yaml: match[1] ?? "", body: match[2] ?? "" };
}

function setYamlScalar(yaml, key, value) {
    const quoted = JSON.stringify(String(value ?? ""));
    const re = new RegExp(`^${key}:\\s*.*$`, "m");
    if (re.test(yaml)) return yaml.replace(re, `${key}: ${quoted}`);
    return `${yaml.trimEnd()}\n${key}: ${quoted}\n`;
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const apply = args.has("--apply");

    // Build old desired metadata by filename
    const oldFiles = [];
    for (const src of OLD_SOURCES) oldFiles.push(...(await listMarkdownFilesNonRecursive(src)));

    const desiredByBase = new Map();
    for (const oldPath of oldFiles) {
        const base = path.basename(oldPath);
        const text = await fs.readFile(oldPath, "utf8");
        const meta = parsePelicanMeta(text);

        const title = stripWrappingQuotes(meta.title ?? "");
        const category = stripWrappingQuotes(meta.category ?? "");
        const slugRaw = stripWrappingQuotes(meta.slug ?? "");

        if (!title || !category) continue;

        const desiredSlug = slugRaw ? slugify(slugRaw) : slugify(title);
        const desiredCategorySlug = slugify(category);

        desiredByBase.set(base, {
            title,
            category,
            categorySlug: desiredCategorySlug,
            slug: desiredSlug,
        });

        const draftAlt = normalizeDraftBasename(base);
        if (draftAlt) {
            desiredByBase.set(draftAlt, {
                title,
                category,
                categorySlug: desiredCategorySlug,
                slug: desiredSlug,
            });
        }
    }

    const newFiles = await walkMarkdownFiles(NEW_POSTS_ROOT);

    let changed = 0;
    let unchanged = 0;
    let missing = 0;

    for (const filePath of newFiles) {
        const base = path.basename(filePath);
        const desired = desiredByBase.get(base);
        if (!desired) {
            missing++;
            continue;
        }

        const text = await fs.readFile(filePath, "utf8");
        const { yaml, body } = parseAstroFrontmatter(text);
        if (!yaml) continue;

        let nextYaml = yaml;
        nextYaml = setYamlScalar(nextYaml, "category", desired.category);
        nextYaml = setYamlScalar(nextYaml, "categorySlug", desired.categorySlug);
        nextYaml = setYamlScalar(nextYaml, "slug", desired.slug);

        if (nextYaml === yaml) {
            unchanged++;
            continue;
        }

        const nextText = `---\n${nextYaml.trimEnd()}\n---\n${body}`;
        const rel = path.relative(WEB_ROOT, filePath);

        if (apply) await fs.writeFile(filePath, nextText, "utf8");
        // eslint-disable-next-line no-console
        console.log(`${apply ? "updated" : "would update"}: ${rel}`);
        changed++;
    }

    // eslint-disable-next-line no-console
    console.log(
        [
            "",
            `Summary: ${apply ? "applied" : "dry-run"}`,
            `- old scanned: ${oldFiles.length}`,
            `- new scanned: ${newFiles.length}`,
            `- changed: ${changed}`,
            `- unchanged: ${unchanged}`,
            `- missing old mapping: ${missing}`,
        ].join("\n"),
    );
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
});

