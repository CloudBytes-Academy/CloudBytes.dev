import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DIST_DIR, loadHtml } from "./testUtils";

async function readDist(relative: string): Promise<string> {
    return fs.readFile(path.join(DIST_DIR, relative), "utf8");
}

describe("Feeds & LLM index files", () => {
    it("/llms.txt is generated and references all sections", async () => {
        const text = await readDist("llms.txt");
        expect(text).toMatch(/^# CloudBytes\/dev/);
        expect(text).toMatch(/^## About/m);
        expect(text).toMatch(/^## Snippets/m);
        expect(text).toMatch(/^## AWS Academy/m);
        expect(text).toMatch(/^## Feeds & data/m);
        expect(text).toMatch(/^## Key facts/m);
    });

    it("/llms-full.txt is generated and contains post bodies", async () => {
        const text = await readDist("llms-full.txt");
        expect(text).toMatch(/full content corpus/i);
        // Should reference at least one known post URL
        expect(text).toMatch(/\/snippets\/upgrade-python-to-latest-version-on-ubuntu-linux\//);
    });

    it("/feed.json is generated and is valid JSON Feed 1.1", async () => {
        const text = await readDist("feed.json");
        const feed = JSON.parse(text);
        expect(feed.version).toBe("https://jsonfeed.org/version/1.1");
        expect(feed.title).toBeTruthy();
        expect(Array.isArray(feed.items)).toBe(true);
        expect(feed.items.length).toBeGreaterThan(0);
    });

    it("Layout references rss.xml and feed.json via <link rel=\"alternate\">", async () => {
        const $ = await loadHtml("/");
        expect($('link[rel="alternate"][type="application/rss+xml"]').length).toBe(1);
        expect($('link[rel="alternate"][type="application/json"]').length).toBe(1);
    });

    it("robots.txt references the llms files", async () => {
        const text = await readDist("robots.txt");
        expect(text).toMatch(/llms\.txt/);
        expect(text).toMatch(/llms-full\.txt/);
    });
});
