import { describe, expect, it } from "vitest";
import { loadHtml } from "./testUtils";

type JsonLdNode = Record<string, unknown>;

async function loadJsonLdNodes(route: string): Promise<JsonLdNode[]> {
    const $ = await loadHtml(route);
    const nodes: JsonLdNode[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        const text = $(el).text().trim();
        if (!text) return;
        let parsed: unknown;
        try {
            parsed = JSON.parse(text);
        } catch {
            throw new Error(`Invalid JSON-LD on ${route}: ${text.slice(0, 80)}…`);
        }
        if (Array.isArray(parsed)) {
            nodes.push(...(parsed as JsonLdNode[]));
        } else if (parsed && typeof parsed === "object") {
            const obj = parsed as JsonLdNode;
            if (Array.isArray(obj["@graph"])) {
                nodes.push(...(obj["@graph"] as JsonLdNode[]));
            } else {
                nodes.push(obj);
            }
        }
    });
    return nodes;
}

function findByType(nodes: JsonLdNode[], type: string): JsonLdNode | undefined {
    return nodes.find((n) => n["@type"] === type);
}

function findAllByType(nodes: JsonLdNode[], type: string): JsonLdNode[] {
    return nodes.filter((n) => n["@type"] === type);
}

describe("SEO Guards — Home page", () => {
    it("emits Organization with logo + sameAs", async () => {
        const nodes = await loadJsonLdNodes("/");
        const org = findByType(nodes, "Organization");
        expect(org, "expected Organization JSON-LD on /").toBeTruthy();
        const logo = org!.logo as Record<string, unknown> | undefined;
        expect(logo, "expected Organization.logo").toBeTruthy();
        expect(logo!["@type"]).toBe("ImageObject");
        expect(typeof logo!.url).toBe("string");
        expect(Number(logo!.width)).toBeGreaterThanOrEqual(112);
        expect(Number(logo!.height)).toBeGreaterThanOrEqual(112);
        const sameAs = org!.sameAs as string[] | undefined;
        expect(sameAs, "expected Organization.sameAs to include GitHub").toBeTruthy();
        expect(sameAs!.some((u) => u.includes("github.com"))).toBe(true);
    });

    it("emits WebSite with SearchAction", async () => {
        const nodes = await loadJsonLdNodes("/");
        const site = findByType(nodes, "WebSite");
        expect(site, "expected WebSite JSON-LD on /").toBeTruthy();
        const action = site!.potentialAction as Record<string, unknown> | undefined;
        expect(action, "expected WebSite.potentialAction").toBeTruthy();
        expect(action!["@type"]).toBe("SearchAction");
        const target = action!.target as Record<string, unknown>;
        expect(target.urlTemplate).toMatch(/\{search_term_string\}/);
    });

    it("emits ItemList of latest posts", async () => {
        const nodes = await loadJsonLdNodes("/");
        const list = findByType(nodes, "ItemList");
        expect(list, "expected ItemList on /").toBeTruthy();
        const items = list!.itemListElement as Array<{ url: string; name: string }> | undefined;
        expect(items?.length).toBeGreaterThan(0);
    });
});

describe("SEO Guards — Article pages", () => {
    const sampleArticleUrl = "/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/";

    it("emits BlogPosting with publisher (with logo) and Person author", async () => {
        const nodes = await loadJsonLdNodes(sampleArticleUrl);
        const article = findByType(nodes, "BlogPosting");
        expect(article, "expected BlogPosting on article page").toBeTruthy();
        expect(article!.publisher, "expected publisher reference").toBeTruthy();
        expect(article!.author, "expected author").toBeTruthy();
        const author = article!.author as Record<string, unknown>;
        expect(author["@type"]).toBe("Person");
        expect(typeof author.name).toBe("string");
        expect(article!.dateModified, "expected dateModified").toBeTruthy();
        expect(article!.datePublished, "expected datePublished").toBeTruthy();
        expect(article!.mainEntityOfPage, "expected mainEntityOfPage").toBeTruthy();
        expect(typeof article!.headline).toBe("string");
        expect((article!.headline as string).includes("· CloudBytes/dev")).toBe(false);
    });

    it("emits BreadcrumbList JSON-LD", async () => {
        const nodes = await loadJsonLdNodes(sampleArticleUrl);
        const bc = findByType(nodes, "BreadcrumbList");
        expect(bc, "expected BreadcrumbList").toBeTruthy();
        const items = bc!.itemListElement as Array<Record<string, unknown>> | undefined;
        expect(items?.length).toBeGreaterThanOrEqual(2);
    });

    it("emits Speakable on article", async () => {
        const nodes = await loadJsonLdNodes(sampleArticleUrl);
        const article = findByType(nodes, "BlogPosting");
        expect(article!.speakable, "expected speakable on Article").toBeTruthy();
    });
});

describe("SEO Guards — About page", () => {
    it("emits AboutPage + Person", async () => {
        const nodes = await loadJsonLdNodes("/about/");
        expect(findByType(nodes, "AboutPage"), "expected AboutPage").toBeTruthy();
        expect(findByType(nodes, "Person"), "expected Person").toBeTruthy();
    });
});

describe("SEO Guards — Author profile", () => {
    it("emits ProfilePage + Person with sameAs[]", async () => {
        const nodes = await loadJsonLdNodes("/authors/rehan-haider/");
        expect(findByType(nodes, "ProfilePage"), "expected ProfilePage").toBeTruthy();
        const persons = findAllByType(nodes, "Person");
        expect(persons.length, "expected at least one Person").toBeGreaterThanOrEqual(1);
        const withSameAs = persons.find((p) => Array.isArray(p.sameAs) && (p.sameAs as string[]).length > 0);
        expect(withSameAs, "expected a Person with sameAs[]").toBeTruthy();
    });
});

describe("SEO Guards — Tag archive", () => {
    it("emits CollectionPage + ItemList", async () => {
        const nodes = await loadJsonLdNodes("/tags/python/");
        expect(findByType(nodes, "CollectionPage"), "expected CollectionPage").toBeTruthy();
        expect(findByType(nodes, "ItemList"), "expected ItemList").toBeTruthy();
    });
});

describe("SEO Guards — Glossary", () => {
    it("emits DefinedTermSet with anchored DefinedTerms", async () => {
        const nodes = await loadJsonLdNodes("/learn/glossary/");
        const set = findByType(nodes, "DefinedTermSet");
        expect(set, "expected DefinedTermSet").toBeTruthy();
        const terms = set!.hasDefinedTerm as Array<Record<string, unknown>> | undefined;
        expect(terms?.length, "expected DefinedTerm[] in set").toBeGreaterThan(0);
        // Each term should have an anchor in the rendered HTML
        const $ = await loadHtml("/learn/glossary/");
        for (const term of terms!) {
            const url = term.url as string;
            const anchor = url.split("#")[1];
            // glossary slugs use [a-z0-9-] only, so escaping is unnecessary
            expect($(`#${anchor}`).length, `expected anchor #${anchor}`).toBe(1);
        }
    });
});

describe("SEO Guards — Search", () => {
    it("renders /search with no-JS fallback list", async () => {
        const $ = await loadHtml("/search/");
        const entries = $('[data-cb-search-page-entry]');
        expect(entries.length, "expected search entries").toBeGreaterThan(0);
        const indexJson = $("script#cb-search-index").text();
        expect(indexJson.length, "expected inline JSON index").toBeGreaterThan(0);
        const parsed = JSON.parse(indexJson);
        expect(Array.isArray(parsed)).toBe(true);
    });
});
