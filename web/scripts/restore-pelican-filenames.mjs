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

function normalizeSlug(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
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

function deriveSlugFromOldFilename(fileName) {
    let base = String(fileName ?? "");
    base = base.replace(/\.(md|mdx)$/i, "");
    base = base.replace(/^\[draft\]\s+/i, "");
    base = base.replace(/^\d+-/, "");
    return base;
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
        // ignore missing dirs
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
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/m.exec(String(text ?? ""));
    if (!match) return {};
    const yaml = match[1] ?? "";

    const get = (key) => {
        const m = new RegExp(`^${key}:\\s*(.+)\\s*$`, "m").exec(yaml);
        return m ? stripWrappingQuotes(m[1]) : undefined;
    };

    const draftRaw = get("draft");
    return {
        title: get("title"),
        slug: get("slug"),
        categorySlug: get("categorySlug"),
        draft: String(draftRaw ?? "").trim().toLowerCase() === "true",
    };
}

function chooseCandidate(candidates, newTitle) {
    if (!candidates.length) return null;
    if (candidates.length === 1) return candidates[0];

    const titleKey = String(newTitle ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    const match = candidates.find((c) => {
        const oldTitleKey = String(c.title ?? "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
        return Boolean(titleKey) && Boolean(oldTitleKey) && titleKey === oldTitleKey;
    });

    return match ?? candidates[0];
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const apply = args.has("--apply");
    const includeDrafts = args.has("--include-drafts");

    const oldFiles = [];
    for (const src of OLD_SOURCES) {
        oldFiles.push(...(await listMarkdownFilesNonRecursive(src)));
    }

    const oldBySlugKey = new Map();
    for (const filePath of oldFiles) {
        const fileName = path.basename(filePath);
        const text = await fs.readFile(filePath, "utf8");
        const meta = parsePelicanMeta(text);

        const titleRaw = stripWrappingQuotes(meta.title ?? "");
        const slugRaw = meta.slug ? stripWrappingQuotes(meta.slug) : titleRaw ? titleRaw : deriveSlugFromOldFilename(fileName);
        const slugKey = normalizeSlug(slugRaw);
        if (!slugKey) continue;

        const entry = { fileName, title: meta.title ?? "", filePath };
        const existing = oldBySlugKey.get(slugKey);
        if (existing) existing.push(entry);
        else oldBySlugKey.set(slugKey, [entry]);
    }

    const newFiles = await walkMarkdownFiles(NEW_POSTS_ROOT);

    let renamed = 0;
    let skipped = 0;
    let missing = 0;
    let conflicts = 0;

    for (const filePath of newFiles) {
        const text = await fs.readFile(filePath, "utf8");
        const fm = parseAstroFrontmatter(text);
        if (!fm.slug) continue;
        if (fm.draft && !includeDrafts) {
            skipped++;
            continue;
        }

        let slugKey = normalizeSlug(fm.slug);
        let candidates = oldBySlugKey.get(slugKey);

        // Draft slugs in Astro content sometimes include the draft prefix + numeric id.
        if (!candidates && slugKey.startsWith("draft-")) {
            const stripped = slugKey.replace(/^draft-\d+-/, "");
            candidates = oldBySlugKey.get(stripped);
        }

        if (!candidates) {
            missing++;
            continue;
        }

        const chosen = chooseCandidate(candidates, fm.title);
        if (!chosen) {
            missing++;
            continue;
        }

        const currentBase = path.basename(filePath);
        const desiredBase = chosen.fileName;
        if (currentBase === desiredBase) continue;

        const targetPath = path.join(path.dirname(filePath), desiredBase);

        try {
            await fs.access(targetPath);
            conflicts++;
            continue;
        } catch {
            // target doesn't exist
        }

        const fromRel = path.relative(WEB_ROOT, filePath);
        const toRel = path.relative(WEB_ROOT, targetPath);

        if (apply) {
            await fs.rename(filePath, targetPath);
        }

        // eslint-disable-next-line no-console
        console.log(`${apply ? "renamed" : "would rename"}: ${fromRel} -> ${toRel}`);
        renamed++;
    }

    // eslint-disable-next-line no-console
    console.log(
        [
            "",
            `Summary: ${apply ? "applied" : "dry-run"}`,
            `- old sources scanned: ${oldFiles.length}`,
            `- new files scanned: ${newFiles.length}`,
            `- renamed: ${renamed}`,
            `- skipped drafts: ${skipped}`,
            `- missing mapping: ${missing}`,
            `- conflicts: ${conflicts}`,
        ].join("\n"),
    );
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
});

