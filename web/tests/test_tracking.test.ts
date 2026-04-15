import { describe, it, expect } from "vitest";

import { loadHtml } from "./testUtils";

describe("Tracking + Ads", () => {
    it("includes AdSense loader script", async () => {
        const $ = await loadHtml("/");
        const src = $('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]').attr("src") ?? "";
        expect(src).toMatch(/client=ca-pub-0503340532690886/);
    });

    it("includes Google Analytics (gtag) loader + config", async () => {
        const $ = await loadHtml("/");

        const gtagSrc = $('script[src^="https://www.googletagmanager.com/gtag/js"]').attr("src") ?? "";
        expect(gtagSrc).toContain("id=");

        const id = new URL(gtagSrc).searchParams.get("id") ?? "";
        expect(id).toMatch(/^G-[A-Z0-9]+/);

        const scriptText = $("script")
            .map((_, el) => $(el).text())
            .get()
            .join("\n");

        expect(scriptText).toMatch(new RegExp(`gtag\\(\\s*['"]config['"]\\s*,\\s*['"]${id}['"]\\s*\\)`));
    });
});

