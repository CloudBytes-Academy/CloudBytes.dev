import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveWebRoot() {
    const candidates = [
        process.cwd(),
        path.resolve(__dirname, "../../.."),
        path.resolve(__dirname, "../../../.."),
        path.resolve(__dirname, "../../../../.."),
    ];

    for (const candidate of candidates) {
        if (!candidate) continue;
        try {
            const hasAstroConfig = fs.existsSync(path.join(candidate, "astro.config.mjs"));
            const hasSrc = fs.existsSync(path.join(candidate, "src"));
            const hasPublic = fs.existsSync(path.join(candidate, "public"));
            if (hasAstroConfig && hasSrc && hasPublic) return candidate;
        } catch {
            // ignore
        }
    }

    return path.resolve(__dirname, "../../..");
}

const WEB_ROOT = resolveWebRoot();
const POSTS_ROOT = path.join(WEB_ROOT, "src", "content", "posts");
const PAGES_ROOT = path.join(WEB_ROOT, "src", "content", "pages");
const IMAGES_ROOT = path.join(WEB_ROOT, "public", "images");
const CONTENT_POST_ROOTS = [POSTS_ROOT, path.join(WEB_ROOT, "content", "posts")];

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

function walkImageFiles(dir) {
    const out = [];
    if (!fs.existsSync(dir)) return out;

    const walk = (current) => {
        const entries = fs.readdirSync(current, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(current, entry.name);
            const relative = path.relative(IMAGES_ROOT, full).replace(/\\/g, "/");
            if (entry.isDirectory()) {
                walk(full);
                continue;
            }
            out.push(relative);
        }
    };

    walk(dir);
    return out;
}

function normalizeImagePath(value) {
    return String(value ?? "")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/\/+/g, "/");
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
const IMAGE_PATHS = new Set(walkImageFiles(IMAGES_ROOT).map(normalizeImagePath));

function rewritePelicanFilenameUrl(url) {
    const raw = String(url ?? "");

    let rest = "";
    if (raw.startsWith("{filename}")) rest = raw.slice("{filename}".length);
    else if (raw.toLowerCase().startsWith("%7bfilename%7d")) rest = raw.slice("%7Bfilename%7D".length);
    else return null;

    rest = rest.replace(/^\/+/, "");

    const hashIdx = rest.indexOf("#");
    const targetPart = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
    const rawFragment = hashIdx >= 0 ? rest.slice(hashIdx) : "";

    const targetFile = path.posix.basename(targetPart.replace(/\\/g, "/"));
    const mapped = FILENAME_TO_URL.get(targetFile);
    if (!mapped) return null;

    let fragment = rawFragment;
    if (fragment.startsWith("##")) fragment = `#${fragment.replace(/^#+/, "")}`;

    return `${mapped}${fragment}`;
}

function splitUrlAndSuffix(raw) {
    const queryIdx = raw.indexOf("?");
    const hashIdx = raw.indexOf("#");
    const sentinel = Number.MAX_SAFE_INTEGER;
    const cutIdx = Math.min(queryIdx >= 0 ? queryIdx : sentinel, hashIdx >= 0 ? hashIdx : sentinel);
    if (cutIdx === sentinel) return { path: raw, suffix: "" };
    return { path: raw.slice(0, cutIdx), suffix: raw.slice(cutIdx) };
}

function safeDecode(value) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function getCategoryFromFilePath(filePath = "") {
    const normalized = path.resolve(filePath);
    for (const root of CONTENT_POST_ROOTS) {
        const rel = path.relative(root, normalized);
        if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) continue;
        const segments = rel.split(path.sep).filter(Boolean);
        if (segments.length >= 2) return segments[0];
    }
    return "";
}

function hasImage(relativePath) {
    return IMAGE_PATHS.has(normalizeImagePath(relativePath));
}

function rewriteImageAssetUrl(url, filePath) {
    const raw = String(url ?? "");
    if (!raw || !(raw.startsWith("/images/") || raw.startsWith("images/"))) return null;

    const normalizedRaw = raw.startsWith("/") ? raw : `/${raw}`;
    const { path: imagePath, suffix } = splitUrlAndSuffix(normalizedRaw);
    const remainder = imagePath.slice("/images/".length);
    if (!remainder) return null;

    const segments = remainder
        .split("/")
        .map((segment) => safeDecode(segment))
        .filter(Boolean);

    if (!segments.length) return null;

    const fileName = segments.at(-1);

    // /images/foo.png -> if root asset exists keep as-is
    if (segments.length === 1) {
        if (hasImage(fileName)) return null;

        // If the asset only exists under the post's category folder, rewrite to that.
        const category = getCategoryFromFilePath(filePath);
        if (category && hasImage(path.posix.join(category, fileName))) {
            return `/images/${category}/${fileName}${suffix}`;
        }
        return null;
    }

    // /images/<folder>/<file> style
    const asGiven = normalizeImagePath(segments.join("/"));
    if (hasImage(asGiven)) return null;

    // If the asset exists at root, normalize to root url.
    if (hasImage(fileName)) return `/images/${fileName}${suffix}`;

    // If the asset exists under the post category folder (but the URL used a different folder), rewrite to category.
    const category = getCategoryFromFilePath(filePath);
    if (category && category !== segments[0] && hasImage(path.posix.join(category, fileName))) {
        return `/images/${category}/${fileName}${suffix}`;
    }

    return null;
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
    return (tree, file) => {
        const filePath = String(file?.history?.[0] ?? file?.path ?? "");
        walkTree(tree, (node) => {
            if (!node || typeof node !== "object") return;
            const type = node.type;
            if (type !== "link" && type !== "image") return;
            if (typeof node.url !== "string") return;

            const next = rewritePelicanFilenameUrl(node.url);
            if (next) {
                node.url = next;
                return;
            }

            const imageMapped = rewriteImageAssetUrl(node.url, filePath);
            if (imageMapped) {
                node.url = imageMapped;
            }
        });
    };
}

