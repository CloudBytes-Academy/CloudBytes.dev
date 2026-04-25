import path from "node:path";
import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { DIST_DIR, getSitemapUrls } from "./testUtils";

interface SitemapUrl {
    loc: string;
    lastmod?: string;
}

async function readSitemapUrls(): Promise<SitemapUrl[]> {
    // Combine all <url> blocks across sitemap-0.xml (only one sitemap on this site)
    const indexPath = path.join(DIST_DIR, "sitemap-index.xml");
    const indexXml = await fs.readFile(indexPath, "utf8");
    const sitemapLocs = Array.from(indexXml.matchAll(/<loc>([^<]+)<\/loc>/gi), (m) => m[1]);

    const out: SitemapUrl[] = [];
    for (const sitemapUrl of sitemapLocs) {
        const filename = sitemapUrl.split("/").pop()!;
        const xml = await fs.readFile(path.join(DIST_DIR, filename), "utf8");
        const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
        for (const block of urlBlocks) {
            const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
            const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
            if (loc) out.push({ loc, lastmod });
        }
    }
    return out;
}

describe("Sitemap", () => {
    it("includes <lastmod> on every URL", async () => {
        const urls = await readSitemapUrls();
        const missing = urls.filter((u) => !u.lastmod);
        expect(missing.map((u) => u.loc)).toEqual([]);
    });

    it("excludes paginated archive URLs", async () => {
        const urls = await getSitemapUrls();
        const offenders = urls.filter((u) => /\/\d+\/?$/.test(new URL(u).pathname));
        expect(offenders).toEqual([]);
    });

    it("excludes /404", async () => {
        const urls = await getSitemapUrls();
        expect(urls.some((u) => /\/404\/?$/.test(new URL(u).pathname))).toBe(false);
    });

    it("uses the post's updatedDate or pubDate (not the build date) for posts", async () => {
        const urls = await readSitemapUrls();
        // Pick a post URL we know exists
        const post = urls.find((u) => u.loc.endsWith("/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/"));
        expect(post, "expected sample post in sitemap").toBeTruthy();
        // The post pubDate is 2026-04-13 — lastmod should reflect that, not the build date
        expect(post!.lastmod).toMatch(/^2026-04-13/);
    });
});
