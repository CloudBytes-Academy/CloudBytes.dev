import { describe, expect, it } from "vitest";
import { listHtmlPages, loadHtml } from "./testUtils";

const ARTICLE_PATHS = [
    "snippets/upgrade-python-to-latest-version-on-ubuntu-linux/index.html",
    "aws-academy/how-to-import-an-existing-lambda-function-using-aws-cdk-in-python/index.html",
];

describe("Article-typed OG meta", () => {
    it("article pages emit og:type=article and article:* meta", async () => {
        for (const rel of ARTICLE_PATHS) {
            const route = "/" + rel.replace(/index\.html$/, "");
            const $ = await loadHtml(route);
            const ogType = $('meta[property="og:type"]').attr("content");
            expect(ogType, `${route}: og:type`).toBe("article");
            expect(
                $('meta[property="article:published_time"]').attr("content"),
                `${route}: article:published_time`,
            ).toBeTruthy();
            expect(
                $('meta[property="article:modified_time"]').attr("content"),
                `${route}: article:modified_time`,
            ).toBeTruthy();
            expect(
                $('meta[property="article:author"]').attr("content"),
                `${route}: article:author`,
            ).toBeTruthy();
            expect(
                $('meta[property="article:section"]').attr("content"),
                `${route}: article:section`,
            ).toBeTruthy();
        }
    });

    it("article: meta does NOT leak onto non-article pages", async () => {
        const offenders: string[] = [];
        const html = await listHtmlPages();
        const sample = html.filter((p) => {
            // only check non-article hubs
            return [
                "index.html",
                "about/index.html",
                "tags/index.html",
                "tags/python/index.html",
                "snippets/index.html",
                "aws-academy/index.html",
                "authors/index.html",
                "authors/rehan-haider/index.html",
                "learn/glossary/index.html",
                "search/index.html",
            ].includes(p);
        });
        for (const rel of sample) {
            const route = "/" + rel.replace(/index\.html$/, "");
            const $ = await loadHtml(route);
            const ogType = $('meta[property="og:type"]').attr("content");
            if (ogType === "article") {
                offenders.push(`${route}: og:type=article on non-article page`);
            }
            const leaked = $('meta[property^="article:"]');
            if (leaked.length > 0) {
                offenders.push(`${route}: article:* meta leaked (${leaked.length} tags)`);
            }
        }
        expect(offenders).toEqual([]);
    });

    it("OG image dimensions are emitted on every page that has an OG image", async () => {
        const $ = await loadHtml("/");
        expect($('meta[property="og:image"]').attr("content"), "og:image").toBeTruthy();
        expect($('meta[property="og:image:alt"]').attr("content"), "og:image:alt").toBeTruthy();
    });
});
