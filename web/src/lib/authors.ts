/**
 * Author resolution utilities.
 *
 * The posts collection has free-form `author` (string) frontmatter. The
 * authors collection has structured author entries. `resolvePostAuthor`
 * looks up an entry by `authorSlug` (preferred) or by name, falling back
 * to a minimal placeholder so posts without a matching author still render
 * a valid Person.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import type { ArticleAuthor } from "./seo";
import { DEFAULT_AUTHOR } from "../consts";
import { slugify } from "../utils/slugify";

export type AuthorEntry = CollectionEntry<"authors">;

let cache: AuthorEntry[] | null = null;

export async function getAllAuthors(): Promise<AuthorEntry[]> {
    if (!cache) cache = await getCollection("authors");
    return cache;
}

export async function findAuthorByName(name: string | undefined): Promise<AuthorEntry | undefined> {
    if (!name) return undefined;
    const all = await getAllAuthors();
    const targetSlug = slugify(name);
    return (
        all.find((a) => a.data.slug === targetSlug) ??
        all.find((a) => slugify(a.data.name) === targetSlug)
    );
}

export async function findAuthorBySlug(slug: string | undefined): Promise<AuthorEntry | undefined> {
    if (!slug) return undefined;
    const all = await getAllAuthors();
    return all.find((a) => a.data.slug === slug);
}

export async function resolvePostAuthor(opts: {
    authorName?: string;
    authorSlug?: string;
}): Promise<ArticleAuthor> {
    const explicit = await findAuthorBySlug(opts.authorSlug);
    const fallbackByName = explicit ?? (await findAuthorByName(opts.authorName));

    if (fallbackByName) {
        return entryToArticleAuthor(fallbackByName);
    }

    // Last-resort: just the bare name from frontmatter, or the default author.
    return {
        name: opts.authorName ?? DEFAULT_AUTHOR.name,
        slug: opts.authorSlug,
    };
}

export function entryToArticleAuthor(entry: AuthorEntry): ArticleAuthor {
    return {
        name: entry.data.name,
        slug: entry.data.slug,
        jobTitle: entry.data.jobTitle,
        sameAs: entry.data.sameAs,
        image: entry.data.avatar?.src,
    };
}
