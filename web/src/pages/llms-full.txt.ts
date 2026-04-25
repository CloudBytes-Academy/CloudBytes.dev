import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import { getAllPosts, getPostHref } from "../utils/posts";

/**
 * Full-content corpus for AI ingestion. Concatenates every published post's
 * raw markdown body, prefixed with a per-post header. Use for LLM training /
 * retrieval; rate-limit on the CDN if abused.
 */
export const GET: APIRoute = async () => {
    const posts = await getAllPosts();

    const sections: string[] = [];
    sections.push(`# ${SITE_TITLE} — full content corpus`);
    sections.push("");
    sections.push(`> ${SITE_DESCRIPTION}`);
    sections.push("");
    sections.push(`Generated for AI ingestion. ${posts.length} posts, sorted newest first.`);
    sections.push("");

    for (const post of posts) {
        sections.push("---");
        sections.push("");
        sections.push(`# ${post.data.title}`);
        sections.push("");
        sections.push(`URL: ${SITE_URL}${getPostHref(post)}`);
        sections.push(`Category: ${post.data.category}`);
        sections.push(`Published: ${post.data.pubDate.toISOString().slice(0, 10)}`);
        if (post.data.updatedDate) {
            sections.push(`Updated: ${post.data.updatedDate.toISOString().slice(0, 10)}`);
        }
        if (post.data.author) sections.push(`Author: ${post.data.author}`);
        if (post.data.tags?.length) sections.push(`Tags: ${post.data.tags.join(", ")}`);
        sections.push("");
        sections.push(`> ${post.data.description}`);
        sections.push("");
        sections.push(post.body ?? "");
        sections.push("");
    }

    return new Response(sections.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
