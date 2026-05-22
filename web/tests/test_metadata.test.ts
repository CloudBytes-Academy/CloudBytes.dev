import { describe, it, expect } from "vitest";

import { getSitemapUrls, loadHtml } from "./testUtils";

describe("Metadata", () => {
    it("all sitemap pages include SEO + social metadata + canonical", async () => {
        const urls = await getSitemapUrls();
        const failures: string[] = [];

        for (const url of urls) {
            const $ = await loadHtml(url);

            const hasIcon = $('link[rel="icon"]').length > 0;
            const title = $("title").text().trim();
            const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
            const keywords = $('meta[name="keywords"]').attr("content")?.trim() ?? "";
            const canonical = $('link[rel="canonical"]').attr("href")?.trim() ?? "";

            // Social cards
            const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() ?? "";
            const ogType = $('meta[property="og:type"]').attr("content")?.trim() ?? "";
            const ogUrl = $('meta[property="og:url"]').attr("content")?.trim() ?? "";
            const ogImage = $('meta[property="og:image"]').attr("content")?.trim() ?? "";
            const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() ?? "";

            const twitterCard =
                ($('meta[property="twitter:card"]').attr("content") ?? $('meta[name="twitter:card"]').attr("content"))?.trim() ??
                "";
            const twitterSite = $('meta[name="twitter:site"]').attr("content")?.trim() ?? "";
            const twitterTitle = $('meta[property="twitter:title"]').attr("content")?.trim() ?? "";
            const twitterDescription = $('meta[property="twitter:description"]').attr("content")?.trim() ?? "";
            const twitterImage = $('meta[property="twitter:image"]').attr("content")?.trim() ?? "";

            // Structured data
            const jsonLdText = $('script[type="application/ld+json"]').first().text().trim();

            const missing = [
                !hasIcon ? "icon" : null,
                !title ? "title" : null,
                !description ? "description" : null,
                !keywords ? "keywords" : null,
                !canonical ? "canonical" : null,
                !ogTitle ? "og:title" : null,
                !ogType ? "og:type" : null,
                !ogUrl ? "og:url" : null,
                !ogImage ? "og:image" : null,
                !ogDescription ? "og:description" : null,
                !twitterCard ? "twitter:card" : null,
                !twitterSite ? "twitter:site" : null,
                !twitterTitle ? "twitter:title" : null,
                !twitterDescription ? "twitter:description" : null,
                !twitterImage ? "twitter:image" : null,
                !jsonLdText ? "json-ld" : null,
            ].filter(Boolean);

            if (missing.length) {
                failures.push(`${url}: missing ${missing.join(", ")}`);
                continue;
            }

            // Strict byte-equal compare. The previous version of this test
            // normalized URLs (stripped trailing slashes) before comparing, which
            // silently hid the trailing-slash mismatch that caused the May 2026
            // deindexing event: sitemap + canonical + og:url all had a trailing
            // slash while Firebase Hosting (`trailingSlash: false`) served the
            // same pages without one, producing a 301 redirect chain on every URL.
            if (canonical !== url) {
                failures.push(`${url}: canonical mismatch (${canonical})`);
            }

            if (ogUrl !== canonical) {
                failures.push(`${url}: og:url mismatch (${ogUrl})`);
            }

            // Regression guard: Firebase Hosting is `cleanUrls: true, trailingSlash: false`,
            // so non-root URLs must never end with `/` in the sitemap, canonical, og:url,
            // or twitter:url. Otherwise Googlebot follows sitemap → 301 → canonical
            // (which points back at the redirecting URL) and drops the page from the index.
            const parsedSitemap = new URL(url);
            if (parsedSitemap.pathname !== "/" && parsedSitemap.pathname.endsWith("/")) {
                failures.push(
                    `${url}: sitemap URL has trailing slash; Firebase trailingSlash:false will 301-redirect (set trailingSlash: "never" in astro.config.mjs)`,
                );
            }

            try {
                const parsed = JSON.parse(jsonLdText);
                if (!parsed || typeof parsed !== "object") throw new Error("json-ld not an object");
                if (parsed["@context"] !== "https://schema.org") throw new Error("json-ld @context missing");
            } catch (err: any) {
                failures.push(`${url}: invalid json-ld (${err?.message ?? "parse error"})`);
            }
        }

        expect(failures).toEqual([]);
    });
});

