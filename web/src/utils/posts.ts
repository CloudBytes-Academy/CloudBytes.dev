import { getCollection, type CollectionEntry } from "astro:content";
import { slugify } from "./slugify";

export type PostEntry = CollectionEntry<"posts">;

export const PAGE_SIZE = 6;

export async function getAllPosts(): Promise<PostEntry[]> {
    const posts = await getCollection("posts");
    return posts
        .filter((p) => !p.data.draft)
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostHref(post: PostEntry): string {
    return `/${post.data.categorySlug}/${post.data.slug}/`;
}

export function getUniqueCategories(posts: PostEntry[]) {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const post of posts) {
        const slug = post.data.categorySlug;
        const name = post.data.category;
        const existing = map.get(slug);
        map.set(slug, { slug, name, count: (existing?.count ?? 0) + 1 });
    }
    return Array.from(map.values()).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
    });
}

export function getUniqueTags(posts: PostEntry[]) {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const post of posts) {
        for (const tag of post.data.tags ?? []) {
            const slug = slugify(tag);
            const existing = map.get(slug);
            map.set(slug, { slug, name: tag, count: (existing?.count ?? 0) + 1 });
        }
    }
    return Array.from(map.values()).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
    });
}

export function getUniqueAuthors(posts: PostEntry[]) {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const post of posts) {
        const slug = post.data.authorSlug;
        const name = post.data.author;
        if (!slug || !name) continue;
        const existing = map.get(slug);
        map.set(slug, { slug, name, count: (existing?.count ?? 0) + 1 });
    }
    return Array.from(map.values()).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
    });
}

export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE) {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
        page: currentPage,
        totalPages,
        items: items.slice(start, end),
    };
}

