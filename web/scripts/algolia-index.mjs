import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import algoliasearch from "algoliasearch";

const WEB_ROOT = process.cwd();

function sha256(value) {
    return crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
}

async function pathExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function loadDotEnv(dotEnvPath) {
    if (!(await pathExists(dotEnvPath))) return;
    const text = await fs.readFile(dotEnvPath, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const idx = line.indexOf("=");
        if (idx === -1) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
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
            if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) out.push(full);
        }
    }

    if (await pathExists(dir)) await walk(dir);
    return out;
}

function parseScalar(raw) {
    const v = raw.trim();
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (v.startsWith("\"")) {
        try {
            return JSON.parse(v);
        } catch {
            return v;
        }
    }
    return v;
}

function parseFrontmatter(text) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/m.exec(text);
    if (!match) return { data: {}, body: text };

    const yaml = match[1];
    const body = match[2] ?? "";

    const lines = yaml.split(/\r?\n/);
    const data = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const keyMatch = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
        if (!keyMatch) continue;

        const key = keyMatch[1];
        const rest = keyMatch[2] ?? "";

        if (rest.trim() === "") {
            // array block
            const items = [];
            for (let j = i + 1; j < lines.length; j++) {
                const next = lines[j];
                const itemMatch = /^\s*-\s*(.*)$/.exec(next);
                if (!itemMatch) break;
                items.push(parseScalar(itemMatch[1]));
                i = j;
            }
            data[key] = items;
        } else {
            data[key] = parseScalar(rest);
        }
    }

    return { data, body };
}

function stripMarkdown(md) {
    return md
        .replace(/^\\[TOC\\]\\s*$/gim, "")
        .replace(/```[\\s\\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\\[[^\\]]*\\]\\([^)]*\\)/g, " ")
        .replace(/\\[[^\\]]*\\]\\([^)]*\\)/g, " ")
        .replace(/#+\\s*/g, "")
        .replace(/[*_>~-]+/g, " ")
        .replace(/\\s+/g, " ")
        .trim();
}

async function main() {
    if (path.basename(WEB_ROOT) !== "web") {
        console.error(`Expected to run from /web, but cwd is: ${WEB_ROOT}`);
        process.exitCode = 1;
        return;
    }

    // Load local env for convenience (CI should set env explicitly)
    await loadDotEnv(path.join(WEB_ROOT, ".env"));

    const appId = process.env.PUBLIC_ALGOLIA_APP_ID;
    const indexName = process.env.PUBLIC_ALGOLIA_INDEX_NAME;
    const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;

    if (!appId || !indexName || !adminKey) {
        console.error("Missing required env vars: PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_INDEX_NAME, ALGOLIA_ADMIN_API_KEY");
        process.exitCode = 1;
        return;
    }

    const postsRoot = path.join(WEB_ROOT, "src", "content", "posts");
    const files = await walkMarkdownFiles(postsRoot);

    const records = [];
    for (const filePath of files) {
        const text = await fs.readFile(filePath, "utf8");
        const { data, body } = parseFrontmatter(text);
        if (data.draft) continue;

        const title = data.title;
        const slug = data.slug;
        const category = data.category;
        const categorySlug = data.categorySlug;
        const tags = Array.isArray(data.tags) ? data.tags : [];

        if (!title || !slug || !category || !categorySlug) continue;

        const url = `${categorySlug}/${slug}`;
        const content = stripMarkdown(body).slice(0, 20000);

        records.push({
            title,
            slug,
            url,
            tags,
            content,
            category,
            objectID: sha256(slug),
        });
    }

    console.log(`Indexing ${records.length} records to Algolia index "${indexName}"...`);
    const client = algoliasearch(appId, adminKey);
    const index = client.initIndex(indexName);

    await index.saveObjects(records);
    console.log("Done.");
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

