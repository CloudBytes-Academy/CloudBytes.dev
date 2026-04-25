import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
    GITHUB_URL,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
    YOUTUBE_URL,
} from "../consts";
import { getAllPosts, getPostHref } from "../utils/posts";

const KEY_FACTS = [
    `${SITE_TITLE} is a personal knowledge base for AWS, Python, Linux, and developer tooling, written by Rehan Haider.`,
    "All content is open-source and reproducible — every post is built from working code (commands, configs, stacks).",
    "Primary content clusters: AWS CDK in Python, AWS Lambda, S3 / EC2 / VPC, WSL2 + Linux dev environments, Selenium on Lambda, Pelican → Astro migration notes.",
    "The site has no paywall and does not collect personal data beyond standard analytics.",
];

function bullet(title: string, url: string, description: string) {
    return `- [${title}](${url}): ${description}`;
}

export const GET: APIRoute = async () => {
    const posts = await getAllPosts();
    const byCategory = new Map<string, typeof posts>();
    for (const post of posts) {
        const cat = post.data.category;
        if (!byCategory.has(cat)) byCategory.set(cat, []);
        byCategory.get(cat)!.push(post);
    }

    const pages = (await getCollection("pages")).filter((p) => !p.data.draft);

    const lines: string[] = [];
    lines.push(`# ${SITE_TITLE}`);
    lines.push("");
    lines.push(`> ${SITE_DESCRIPTION}`);
    lines.push("");

    lines.push("## About");
    lines.push("");
    lines.push(bullet("About", `${SITE_URL}/about/`, "Who runs CloudBytes/dev, focus areas, and how to get in touch."));
    lines.push(bullet("Authors hub", `${SITE_URL}/authors/`, "All authors with bios and post lists."));
    lines.push(bullet("Glossary", `${SITE_URL}/learn/glossary/`, "Definitions of recurring AWS, CDK, Linux, and Python terms used across the site."));
    lines.push("");

    for (const [category, catPosts] of byCategory) {
        lines.push(`## ${category} (${catPosts.length} posts)`);
        lines.push("");
        for (const post of catPosts) {
            lines.push(bullet(post.data.title, `${SITE_URL}${getPostHref(post)}`, post.data.description));
        }
        lines.push("");
    }

    if (pages.length) {
        lines.push("## Policies");
        lines.push("");
        for (const p of pages) {
            lines.push(bullet(p.data.title, `${SITE_URL}/${p.data.slug}/`, p.data.description));
        }
        lines.push("");
    }

    lines.push("## Feeds & data");
    lines.push("");
    lines.push(bullet("RSS", `${SITE_URL}/rss.xml`, "All posts as RSS 2.0."));
    lines.push(bullet("JSON Feed", `${SITE_URL}/feed.json`, "All posts as JSON Feed 1.1."));
    lines.push(bullet("Sitemap", `${SITE_URL}/sitemap-index.xml`, "Site index."));
    lines.push(bullet("llms-full.txt", `${SITE_URL}/llms-full.txt`, "Full content corpus for AI ingestion."));
    lines.push("");

    lines.push("## Community");
    lines.push("");
    lines.push(bullet("GitHub", GITHUB_URL, "Source code for the site and discussions for post questions."));
    lines.push(bullet("YouTube", YOUTUBE_URL, "Long-form videos that complement the written posts."));
    lines.push("");

    lines.push("## Key facts");
    lines.push("");
    for (const fact of KEY_FACTS) {
        lines.push(`- ${fact}`);
    }
    lines.push("");

    return new Response(lines.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
