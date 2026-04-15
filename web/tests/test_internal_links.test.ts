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

function shouldSkipHref(href: string) {
    const h = href.trim();
    if (!h) return true;
    if (h.startsWith("#")) return true;
    if (h.startsWith("mailto:")) return true;
    if (h.startsWith("tel:")) return true;
    if (h.startsWith("javascript:")) return true;
    if (h.startsWith("http://") || h.startsWith("https://") || h.startsWith("//")) return true;
    return false;
}

describe("Internal links", () => {
    it("all internal <a href> targets exist in dist", async () => {
        const distFiles = new Set(await listDistFiles());
        const pages = await listHtmlPages();
        const failures: string[] = [];

        for (const pageRel of pages) {
            const abs = path.join(DIST_DIR, pageRel);
            const html = await fs.readFile(abs, "utf8");
            const $ = load(html);

            const currentRoute = pageRelToRoute(pageRel);
            const base = new URL(currentRoute, SITE_URL);

            $("a[href]").each((_, el) => {
                const hrefRaw = ($(el).attr("href") ?? "").trim();
                if (shouldSkipHref(hrefRaw)) return;

                try {
                    const resolved = hrefRaw.startsWith("/") ? new URL(hrefRaw, SITE_URL) : new URL(hrefRaw, base);
                    const distAbs = routeToDistPath(resolved.href);
                    const distRel = path.relative(DIST_DIR, distAbs).replace(/\\/g, "/");

                    if (!distFiles.has(distRel)) {
                        failures.push(`${pageRel} -> ${hrefRaw} (missing ${distRel})`);
                    }
                } catch (err) {
                    failures.push(`${pageRel} -> ${hrefRaw} (invalid URL)`);
                }
            });
        }

        expect(failures).toEqual([]);
    });
});

