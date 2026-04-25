/**
 * OG card manifest.
 *
 * One entry per indexable page: a stable slug (used in `/og/<slug>.png`),
 * the canonical path (used by BaseHead to derive the slug), title, kicker,
 * and an optional accent override.
 *
 * Pages outside the manifest fall back to /og-default.png.
 */
import { getCollection } from "astro:content";
import { SECTION_LABELS, SITE_TITLE } from "../../consts";
import { getAllPosts, getPostHref, getUniqueTags, getUniqueAuthors, PAGE_SIZE } from "../../utils/posts";
import { GLOSSARY_TERMS } from "../glossary/manifest";

export interface OgEntry {
    slug: string;
    path: string;
    title: string;
    kicker?: string;
    subtitle?: string;
    accent?: string;
    byline?: string;
}

/**
 * Stable path → slug mapping. Used by both the manifest builder AND
 * BaseHead's URL-derivation so they always agree.
 *
 * `/`              → `_root`
 * `/about/`        → `about`
 * `/snippets/foo/` → `snippets-foo`
 */
export function pathToSlug(pathname: string): string {
    const trimmed = String(pathname ?? "")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    if (!trimmed) return "_root";
    return trimmed.replace(/\//g, "-");
}

export async function buildOgManifest(): Promise<OgEntry[]> {
    const entries: OgEntry[] = [];

    // Static, top-of-funnel pages
    entries.push({
        slug: "_root",
        path: "/",
        title: SITE_TITLE,
        kicker: "Knowledge base",
        subtitle: "Code snippets, AWS Academy lessons, and tutorials for cloud, Python, Linux, and developer tooling.",
    });
    entries.push({
        slug: "about",
        path: "/about/",
        title: "About CloudBytes/dev",
        kicker: "About",
        subtitle: "Who runs the site, what it covers, and how to get in touch.",
    });
    entries.push({
        slug: "search",
        path: "/search/",
        title: "Search the entire knowledge base",
        kicker: "Search",
        subtitle: "Filter every post, snippet, and reference page in one place.",
    });
    entries.push({
        slug: "learn",
        path: "/learn/",
        title: "Reference content",
        kicker: "Learn",
        subtitle: "Definitions and explainers for the recurring tools and concepts.",
    });
    entries.push({
        slug: "learn-glossary",
        path: "/learn/glossary/",
        title: "Glossary",
        kicker: "Glossary",
        subtitle: `Definitions of ${GLOSSARY_TERMS.length} AWS, CDK, Linux, Python, and tooling terms.`,
    });
    entries.push({
        slug: "tags",
        path: "/tags/",
        title: "Browse by tag",
        kicker: "Tags",
        subtitle: "Every topic across the site.",
    });
    entries.push({
        slug: "authors",
        path: "/authors/",
        title: "Authors",
        kicker: "Authors",
        subtitle: "All contributors with published posts.",
    });

    // Static legal / utility pages
    const pages = (await getCollection("pages")).filter((p) => !p.data.draft && p.data.slug !== "404");
    for (const p of pages) {
        entries.push({
            slug: pathToSlug(`/${p.data.slug}/`),
            path: `/${p.data.slug}/`,
            title: p.data.title,
            kicker: "Page",
            subtitle: p.data.description,
        });
    }

    // Categories
    const posts = await getAllPosts();
    const categories = new Map<string, { name: string; count: number }>();
    for (const post of posts) {
        const slug = post.data.categorySlug;
        const c = categories.get(slug);
        categories.set(slug, { name: post.data.category, count: (c?.count ?? 0) + 1 });
    }
    for (const [slug, info] of categories) {
        entries.push({
            slug: pathToSlug(`/${slug}/`),
            path: `/${slug}/`,
            title: info.name,
            kicker: SECTION_LABELS[slug] ?? info.name,
            subtitle: `${info.count} hands-on posts.`,
        });
    }

    // Posts
    for (const post of posts) {
        entries.push({
            slug: pathToSlug(getPostHref(post)),
            path: getPostHref(post),
            title: post.data.title,
            kicker: SECTION_LABELS[post.data.categorySlug] ?? post.data.category,
            byline: post.data.author ? `by ${post.data.author}` : undefined,
            subtitle: undefined, // omit on posts; the title is enough and the description is often >120 chars
        });
    }

    // Tag archives
    const tags = getUniqueTags(posts);
    for (const tag of tags) {
        entries.push({
            slug: pathToSlug(`/tags/${tag.slug}/`),
            path: `/tags/${tag.slug}/`,
            title: `#${tag.name}`,
            kicker: "Tag",
            subtitle: `${tag.count} post${tag.count === 1 ? "" : "s"} tagged ${tag.name}.`,
        });
    }

    // Author profile pages
    const authors = getUniqueAuthors(posts);
    for (const author of authors) {
        entries.push({
            slug: pathToSlug(`/authors/${author.slug}/`),
            path: `/authors/${author.slug}/`,
            title: author.name,
            kicker: "Author",
            subtitle: `${author.count} post${author.count === 1 ? "" : "s"}.`,
        });
    }

    /* ----------------------------------------------------------------
     * Paginated archives. These aren't in the sitemap but users may
     * still share `/page/3/` or `/tags/python/4/` style URLs. Re-use
     * the parent kicker, with a "Page N" subtitle.
     * ---------------------------------------------------------------- */

    // Home pagination
    const totalHomePages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    for (let p = 2; p <= totalHomePages; p += 1) {
        entries.push({
            slug: pathToSlug(`/page/${p}/`),
            path: `/page/${p}/`,
            title: `Latest posts`,
            kicker: "Knowledge base",
            subtitle: `Page ${p} of ${totalHomePages}.`,
        });
    }

    // Category pagination
    for (const [slug, info] of categories) {
        const total = Math.max(1, Math.ceil(info.count / PAGE_SIZE));
        for (let p = 2; p <= total; p += 1) {
            entries.push({
                slug: pathToSlug(`/${slug}/${p}/`),
                path: `/${slug}/${p}/`,
                title: info.name,
                kicker: SECTION_LABELS[slug] ?? info.name,
                subtitle: `Page ${p} of ${total}.`,
            });
        }
    }

    // Tag pagination
    for (const tag of tags) {
        const total = Math.max(1, Math.ceil(tag.count / PAGE_SIZE));
        for (let p = 2; p <= total; p += 1) {
            entries.push({
                slug: pathToSlug(`/tags/${tag.slug}/${p}/`),
                path: `/tags/${tag.slug}/${p}/`,
                title: `#${tag.name}`,
                kicker: "Tag",
                subtitle: `Page ${p} of ${total}.`,
            });
        }
    }

    // Author pagination
    for (const author of authors) {
        const total = Math.max(1, Math.ceil(author.count / PAGE_SIZE));
        for (let p = 2; p <= total; p += 1) {
            entries.push({
                slug: pathToSlug(`/authors/${author.slug}/${p}/`),
                path: `/authors/${author.slug}/${p}/`,
                title: author.name,
                kicker: "Author",
                subtitle: `Page ${p} of ${total}.`,
            });
        }
    }

    return entries;
}
