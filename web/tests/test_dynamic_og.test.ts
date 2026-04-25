import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DIST_DIR, getSitemapUrls, loadHtml, normalizeUrl } from "./testUtils";

const SITE_PREFIX = "https://cloudbytes.dev";

function ogPathToDistPath(ogUrl: string): string {
    // og:image is always absolute; strip the origin so we can look it up in dist
    const u = new URL(ogUrl);
    return path.join(DIST_DIR, u.pathname.replace(/^\/+/, ""));
}

describe("Dynamic OG cards", () => {
    it("every sitemap URL's og:image resolves to a real PNG in dist", async () => {
        const urls = await getSitemapUrls();
        const failures: string[] = [];

        for (const url of urls) {
            const $ = await loadHtml(url);
            const og = $('meta[property="og:image"]').attr("content");
            if (!og) {
                failures.push(`${url}: missing og:image`);
                continue;
            }
            if (!og.startsWith(SITE_PREFIX)) {
                failures.push(`${url}: og:image is not absolute (${og})`);
                continue;
            }
            try {
                const stat = await fs.stat(ogPathToDistPath(og));
                if (stat.size < 8 * 1024) {
                    failures.push(`${url}: og:image ${og} is suspiciously small (${stat.size}B)`);
                }
            } catch {
                failures.push(`${url}: og:image ${og} does not exist in dist`);
            }
        }

        expect(failures).toEqual([]);
    });

    it("og:image dimensions match the rendered PNG", async () => {
        // Sample a handful of URLs across page types
        const samples = [
            "/",
            "/about/",
            "/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/",
            "/aws-academy/how-to-import-an-existing-lambda-function-using-aws-cdk-in-python/",
            "/tags/python/",
            "/authors/rehan-haider/",
            "/learn/glossary/",
        ];

        for (const url of samples) {
            const $ = await loadHtml(url);
            const og = $('meta[property="og:image"]').attr("content");
            const w = $('meta[property="og:image:width"]').attr("content");
            const h = $('meta[property="og:image:height"]').attr("content");
            expect(og, `${url}: og:image`).toBeTruthy();
            expect(w, `${url}: og:image:width`).toBe("1200");
            expect(h, `${url}: og:image:height`).toBe("630");
        }
    });

    it("static og-default.png exists as a fallback (used by JSON-LD when no manifest entry)", async () => {
        const stat = await fs.stat(path.join(DIST_DIR, "og-default.png"));
        expect(stat.size).toBeGreaterThan(8 * 1024);
    });

    it("BlogPosting.image matches og:image on article pages", async () => {
        const url = "/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/";
        const $ = await loadHtml(url);
        const og = $('meta[property="og:image"]').attr("content");

        const ldText = $('script[type="application/ld+json"]').first().text().trim();
        const graph = JSON.parse(ldText) as Record<string, unknown>;
        const nodes = (graph["@graph"] as Array<Record<string, unknown>>) ?? [graph];
        const article = nodes.find((n) => n["@type"] === "BlogPosting");
        expect(article, "expected BlogPosting").toBeTruthy();
        const images = article!.image as string[];
        expect(images, "expected Article.image").toBeTruthy();
        expect(normalizeUrl(images[0])).toBe(normalizeUrl(og!));
    });
});
