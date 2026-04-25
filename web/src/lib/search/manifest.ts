import { getCollection } from "astro:content";
import { getAllPosts, getPostHref } from "../../utils/posts";

export interface SearchEntry {
    url: string;
    title: string;
    description: string;
    section: string;
}

/**
 * Build the in-page search index. Includes posts, static pages, archive hubs,
 * and the glossary. Used by the /search route to render a no-JS fallback list
 * AND inlined as JSON for client-side filtering.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
    const entries: SearchEntry[] = [];

    // Posts
    const posts = await getAllPosts();
    for (const post of posts) {
        entries.push({
            url: getPostHref(post),
            title: post.data.title,
            description: post.data.description,
            section: post.data.category,
        });
    }

    // Static pages (privacy, terms, about)
    const pages = (await getCollection("pages")).filter((p) => !p.data.draft && p.data.slug !== "404");
    for (const p of pages) {
        entries.push({
            url: `/${p.data.slug}/`,
            title: p.data.title,
            description: p.data.description,
            section: "Pages",
        });
    }

    entries.push({
        url: "/about/",
        title: "About",
        description: "About CloudBytes/dev — who runs it, focus areas, and how to get in touch.",
        section: "Pages",
    });

    // Hubs
    entries.push(
        {
            url: "/snippets/",
            title: "Snippets",
            description: "All snippets — short, copy-pasteable how-tos for everyday tooling problems.",
            section: "Hubs",
        },
        {
            url: "/aws-academy/",
            title: "AWS Academy",
            description: "Project-style guides for AWS CDK in Python: Lambda, S3, EC2, VPCs, IAM, EFS/FSx for Lustre.",
            section: "Hubs",
        },
        {
            url: "/books/",
            title: "Books",
            description: "Build WebAPIs with Python using Flask and FastAPI.",
            section: "Hubs",
        },
        {
            url: "/learn/glossary/",
            title: "Glossary",
            description: "Definitions of recurring AWS, CDK, Linux, Python, and WSL2 terms.",
            section: "Hubs",
        },
        {
            url: "/tags/",
            title: "Tag cloud",
            description: "Browse all topics across the site.",
            section: "Hubs",
        },
        {
            url: "/authors/",
            title: "Authors",
            description: "All authors with published posts.",
            section: "Hubs",
        },
    );

    return entries;
}
