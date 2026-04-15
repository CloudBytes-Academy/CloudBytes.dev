import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

import { DIST_DIR, SITE_URL, listDistFiles, listHtmlPages, routeToDistPath } from "./testUtils";

function pageRelToRoute(pageRel: string) {
    if (pageRel === "index.html") return "/";
    if (pageRel === "404.html") return "/404.html";

    const suffix = "/index.html";
    if (pageRel.endsWith(suffix)) {
        return `/${pageRel.slice(0, -suffix.length)}/`;
    }

    return `/${pageRel}`;
}

function isExternalOrDataUrl(url: string) {
    const u = url.trim();
    if (!u) return true;
    if (u.startsWith("#")) return true;
    if (u.startsWith("data:")) return true;
    if (u.startsWith("blob:")) return true;
    if (u.startsWith("mailto:")) return true;
    if (u.startsWith("tel:")) return true;
    if (u.startsWith("javascript:")) return true;
    if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("//")) return false; // handled later
    return false;
}

function parseSrcset(srcset: string) {
    return String(srcset ?? "")
        .split(",")
        .map((part) => part.trim())
        .map((part) => part.split(/\s+/)[0])
        .filter(Boolean);
}

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"]);

describe("Assets", () => {
    it("all referenced local assets exist in dist (including images)", async () => {
        const distFiles = new Set(await listDistFiles());
        const pages = await listHtmlPages();
        const failures: string[] = [];

        const origin = new URL(SITE_URL).origin;

        const checkUrl = (rawUrl: string, base: URL, source: string) => {
            const raw = String(rawUrl ?? "").trim();
            if (!raw) return;

            // data:, blob:, mailto:, etc
            if (isExternalOrDataUrl(raw)) return;

            let resolved: URL;
            try {
                resolved = raw.startsWith("/") ? new URL(raw, origin) : new URL(raw, base);
            } catch {
                failures.push(`${source}: invalid url "${raw}"`);
                return;
            }

            // skip external origins
            if (resolved.origin !== origin) return;

            const distAbs = routeToDistPath(resolved.href);
            const distRel = path.relative(DIST_DIR, distAbs).replace(/\\/g, "/");
            if (!distFiles.has(distRel)) failures.push(`${source}: missing ${distRel} (from ${resolved.pathname})`);
        };

        for (const pageRel of pages) {
            const abs = path.join(DIST_DIR, pageRel);
            const html = await fs.readFile(abs, "utf8");
            const $ = load(html);

            const currentRoute = pageRelToRoute(pageRel);
            const base = new URL(currentRoute, origin);
            const prefix = pageRel;

            // Images
            $("img[src]").each((_, el) => {
                const src = ($(el).attr("src") ?? "").trim();
                if (!src) return;

                // If this is a local image, enforce it looks like an image asset.
                const maybeUrl = src.startsWith("/") ? new URL(src, origin) : new URL(src, base);
                if (maybeUrl.origin === origin) {
                    const ext = path.extname(maybeUrl.pathname).toLowerCase();
                    if (ext && !IMAGE_EXT.has(ext)) {
                        failures.push(`${prefix}: img src has non-image extension "${ext}" (${src})`);
                        return;
                    }
                }

                checkUrl(src, base, `${prefix}: <img src>`);
            });

            $("img[srcset]").each((_, el) => {
                const srcset = $(el).attr("srcset") ?? "";
                for (const u of parseSrcset(srcset)) checkUrl(u, base, `${prefix}: <img srcset>`);
            });

            $("source[srcset]").each((_, el) => {
                const srcset = $(el).attr("srcset") ?? "";
                for (const u of parseSrcset(srcset)) checkUrl(u, base, `${prefix}: <source srcset>`);
            });

            // Head assets
            $('link[rel="stylesheet"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: stylesheet`));
            $('link[rel="icon"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: icon`));
            $('link[rel="apple-touch-icon"][href]').each((_, el) =>
                checkUrl($(el).attr("href") ?? "", base, `${prefix}: apple-touch-icon`),
            );
            $('link[rel="mask-icon"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: mask-icon`));
            $('link[rel="manifest"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: manifest`));
            $('link[rel="sitemap"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: sitemap`));
            $('link[rel="alternate"][href]').each((_, el) => checkUrl($(el).attr("href") ?? "", base, `${prefix}: alternate`));

            // Scripts
            $("script[src]").each((_, el) => checkUrl($(el).attr("src") ?? "", base, `${prefix}: script`));

            // Social images
            const ogImage = $('meta[property="og:image"]').attr("content") ?? "";
            if (ogImage) checkUrl(ogImage, base, `${prefix}: og:image`);

            const twitterImage =
                $('meta[property="twitter:image"]').attr("content") ?? $('meta[name="twitter:image"]').attr("content") ?? "";
            if (twitterImage) checkUrl(twitterImage, base, `${prefix}: twitter:image`);

            // Browser config
            const msConfig = $('meta[name="msapplication-config"]').attr("content") ?? "";
            if (msConfig) checkUrl(msConfig, base, `${prefix}: msapplication-config`);
        }

        expect(failures).toEqual([]);
    });
});

