#!/usr/bin/env node
/**
 * One-off frontmatter tag normaliser.
 *
 * Rewrites every post's `tags` and `keywords` array entries to lowercase so
 * "AWS"/"aws" collapse to a single canonical form. The slugify() helper
 * already lowercases for the URL slug, but the displayed tag chip uses the
 * first variant encountered — leading to inconsistent casing across the site.
 *
 * Idempotent: re-running the script after any tag is normalised is a no-op.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, "../src/content/posts");

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

function isFrontmatterArrayHeader(line) {
    return /^(tags|keywords):\s*$/.test(line);
}

function isFrontmatterArrayItem(line) {
    return /^\s+-\s+/.test(line);
}

function normaliseLine(line) {
    // `    - "Foo Bar"` -> `    - "foo bar"`
    return line.replace(/^(\s+-\s+)"([^"]*)"\s*$/, (_match, prefix, value) => `${prefix}"${value.toLowerCase()}"`);
}

async function processFile(file) {
    const text = await fs.readFile(file, "utf8");
    const fmMatch = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) return false;

    const fmStart = 0;
    const fmEnd = fmMatch[0].length;
    const fm = fmMatch[1];

    const lines = fm.split(/\r?\n/);
    const newLines = [];
    let inArray = false;
    let changed = false;
    for (const line of lines) {
        if (isFrontmatterArrayHeader(line)) {
            inArray = true;
            newLines.push(line);
            continue;
        }
        if (inArray && isFrontmatterArrayItem(line)) {
            const normalized = normaliseLine(line);
            if (normalized !== line) changed = true;
            newLines.push(normalized);
            continue;
        }
        if (line && !line.startsWith(" ")) inArray = false;
        newLines.push(line);
    }

    if (!changed) return false;

    const newFm = newLines.join("\n");
    const before = text.slice(fmStart, fmEnd);
    const after = text.slice(fmEnd);
    const next = `---\n${newFm}\n---${after}`;

    if (next === before + after) return false;

    await fs.writeFile(file, next, "utf8");
    return true;
}

async function main() {
    const files = await walk(POSTS_DIR);
    let changed = 0;
    for (const file of files) {
        if (await processFile(file)) {
            changed += 1;
            console.log(`updated  ${path.relative(process.cwd(), file)}`);
        }
    }
    console.log(`\nDone — ${changed}/${files.length} files updated`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
