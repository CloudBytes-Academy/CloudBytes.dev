import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import { getAllPosts, getPostHref } from "../utils/posts";

/** JSON Feed 1.1 — https://www.jsonfeed.org/version/1.1/ */
export const GET: APIRoute = async () => {
    const posts = await getAllPosts();

    const feed = {
        version: "https://jsonfeed.org/version/1.1",
        title: SITE_TITLE,
        home_page_url: `${SITE_URL}/`,
        feed_url: `${SITE_URL}/feed.json`,
        description: SITE_DESCRIPTION,
        language: "en",
        items: posts.map((post) => ({
            id: `${SITE_URL}${getPostHref(post)}`,
            url: `${SITE_URL}${getPostHref(post)}`,
            title: post.data.title,
            content_text: post.data.description,
            summary: post.data.description,
            date_published: post.data.pubDate.toISOString(),
            date_modified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
            tags: post.data.tags ?? [],
            ...(post.data.author
                ? { author: { name: post.data.author, url: post.data.authorSlug ? `${SITE_URL}/authors/${post.data.authorSlug}/` : undefined } }
                : {}),
        })),
    };

    return new Response(JSON.stringify(feed, null, 2), {
        headers: {
            "Content-Type": "application/feed+json; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
