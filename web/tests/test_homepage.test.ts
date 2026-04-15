import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

import { DIST_DIR, loadHtml } from "./testUtils";

describe("Homepage", () => {
    it("build output exists", async () => {
        await expect(fs.access(path.join(DIST_DIR, "index.html"))).resolves.toBeUndefined();
    });

    it("has a title", async () => {
        const $ = await loadHtml("/");
        expect($("title").text().trim()).toContain("CloudBytes/dev");
    });

    it("renders header navigation + search + theme toggle", async () => {
        const $ = await loadHtml("/");

        expect($('header a[href="/"]').length).toBeGreaterThan(0);
        expect($('header a[href="/books/"]').length).toBeGreaterThan(0);
        expect($('header a[href="/tags/"]').length).toBeGreaterThan(0);

        expect($("[data-cb-search-desktop-input]").length).toBeGreaterThan(0);
        expect($("#cb-theme-toggle").length).toBe(1);
    });

    it("renders footer links and copyright", async () => {
        const $ = await loadHtml("/");

        expect($("footer").length).toBe(1);
        expect($('footer a[href="/terms/"]').length).toBeGreaterThan(0);
        expect($('footer a[href="/privacy/"]').length).toBeGreaterThan(0);

        const footerText = $("footer").text();
        expect(footerText).toContain(String(new Date().getFullYear()));
    });

    it("shows latest posts list", async () => {
        const $ = await loadHtml("/");

        expect($("h1").first().text().trim()).toBe("Latest");

        const cards = $("article");
        expect(cards.length).toBeGreaterThanOrEqual(6);
    });
});

