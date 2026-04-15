import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

import { DIST_DIR, loadHtml } from "./testUtils";

describe("Pages", () => {
    it("404 page is built", async () => {
        await expect(fs.access(path.join(DIST_DIR, "404.html"))).resolves.toBeUndefined();
    });

    it("404 page contains expected content", async () => {
        const $ = await loadHtml("/404");
        expect($("h1").first().text().trim()).toBe("404");
    });
});

