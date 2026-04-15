import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT = path.resolve(__dirname, "../../..");
const POSTS_ROOT = path.join(WEB_ROOT, "src", "content", "posts");
const PAGES_ROOT = path.join(WEB_ROOT, "src", "content", "pages");

function walkMarkdownFilesSync(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;

    const walk = (current) => {
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                walk(full);
                continue;
            }
            if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) out.push(full);
        }
    };

    walk(dir);
    return out;
}

function parseScalar(raw) {
    const v = String(raw ?? "").trim();
    if (v === "true") return true;
    if (v === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (v.startsWith('"')) {
        try {
            return JSON.parse(v);
        } catch {
            return v;
        }
    }
    return v;
}

function parseFrontmatter(text) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/m.exec(String(text ?? ""));
    if (!match) return { data: {}, body: String(text ?? "") };

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

function normalizeSlugSegment(value) {
    return String(value ?? "")
        .trim()
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
}

function buildFilenameToUrlIndex() {
    const map = new Map();

    for (const filePath of walkMarkdownFilesSync(POSTS_ROOT)) {
        const text = fs.readFileSync(filePath, "utf8");
        const { data } = parseFrontmatter(text);
        const categorySlug = normalizeSlugSegment(data.categorySlug);
        const slug = normalizeSlugSegment(data.slug);

        if (!categorySlug || !slug) continue;
        const url = `/${categorySlug}/${slug}/`;
        map.set(path.basename(filePath), url);
    }

    for (const filePath of walkMarkdownFilesSync(PAGES_ROOT)) {
        const text = fs.readFileSync(filePath, "utf8");
        const { data } = parseFrontmatter(text);
        const slug = normalizeSlugSegment(data.slug);
        if (!slug) continue;
        const url = `/${slug}/`;
        map.set(path.basename(filePath), url);
    }

    return map;
}

const FILENAME_TO_URL = buildFilenameToUrlIndex();

function rewritePelicanFilenameUrl(url) {
    const raw = String(url ?? "");

    let rest = "";
    if (raw.startsWith("{filename}")) rest = raw.slice("{filename}".length);
    else if (raw.toLowerCase().startsWith("%7bfilename%7d")) rest = raw.slice("%7Bfilename%7D".length);
    else return null;

    // Supports {filename}/path/to/file.md and {filename}file.md patterns
    rest = rest.replace(/^\/+/, "");

    const hashIdx = rest.indexOf("#");
    const targetPart = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
    const rawFragment = hashIdx >= 0 ? rest.slice(hashIdx) : "";

    const targetFile = path.posix.basename(targetPart.replace(/\\/g, "/"));
    const mapped = FILENAME_TO_URL.get(targetFile);
    if (!mapped) return null;

    // Normalize weird "##anchor" fragments seen in some legacy content.
    let fragment = rawFragment;
    if (fragment.startsWith("##")) fragment = `#${fragment.replace(/^#+/, "")}`;

    return `${mapped}${fragment}`;
}

function walkTree(node, visit) {
    if (!node || typeof node !== "object") return;
    visit(node);
    const children = node.children;
    if (Array.isArray(children)) {
        for (const child of children) walkTree(child, visit);
    }
}

export function remarkRewritePelicanFilenameLinks() {
    return (tree) => {
        walkTree(tree, (node) => {
            if (!node || typeof node !== "object") return;
            const type = node.type;
            if (type !== "link" && type !== "image") return;
            if (typeof node.url !== "string") return;

            const next = rewritePelicanFilenameUrl(node.url);
            if (next) node.url = next;
        });
    };
}

