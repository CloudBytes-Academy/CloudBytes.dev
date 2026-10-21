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
    it("includes <lastmod> on every post URL and on the home and category hubs", async () => {
        const urls = await readSitemapUrls();
        const needsLastmod = /^\/(snippets|aws-academy)(\/[^/]+)?$|^\/$/;
        const missing = urls.filter((u) => needsLastmod.test(new URL(u.loc).pathname) && !u.lastmod);
        expect(missing.map((u) => u.loc)).toEqual([]);
    });

    it("never uses the build time as <lastmod>", async () => {
        // Content dates are date-only frontmatter values, so they serialize to
        // midnight UTC. Anything else is a build timestamp that changes on every deploy.
        const urls = await readSitemapUrls();
        const offenders = urls.filter((u) => u.lastmod && !u.lastmod.endsWith("T00:00:00.000Z"));
        expect(offenders.map((u) => `${u.loc} ${u.lastmod}`)).toEqual([]);
    });

    it("excludes tag archives", async () => {
        const urls = await getSitemapUrls();
        const offenders = urls.filter((u) => /^\/tags(\/|$)/.test(new URL(u).pathname));
        expect(offenders).toEqual([]);
    });

    it("gives each category hub the newest lastmod of its posts", async () => {
        const urls = await readSitemapUrls();
        for (const category of ["snippets", "aws-academy"]) {
            const hub = urls.find((u) => new URL(u.loc).pathname === `/${category}`);
            expect(hub, `expected /${category} in sitemap`).toBeTruthy();
            const newest = urls
                .filter((u) => new URL(u.loc).pathname.startsWith(`/${category}/`) && u.lastmod)
                .map((u) => u.lastmod!)
                .sort()
                .pop();
            expect(hub!.lastmod).toBe(newest);
        }
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
        // Pick a post URL we know exists. With Astro `trailingSlash: "never"`
        // (set in astro.config.mjs to match Firebase's `trailingSlash: false`),
        // sitemap URLs no longer end with `/`.
        const post = urls.find((u) => u.loc.endsWith("/snippets/upgrade-python-to-latest-version-on-ubuntu-linux"));
        expect(post, "expected sample post in sitemap").toBeTruthy();
        // The post pubDate is 2026-04-13 — lastmod should reflect that, not the build date
        expect(post!.lastmod).toMatch(/^2026-04-13/);
    });
});
