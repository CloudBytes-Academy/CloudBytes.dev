import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.string(),
        categorySlug: z.string(),
        slug: z.string(),
        tags: z.array(z.string()).default([]),
        keywords: z.array(z.string()).optional(),
        author: z.string().optional(),
        authorSlug: z.string().optional(),
        series: z.string().optional(),
        seriesIndex: z.number().optional(),
        youtubeId: z.string().optional(),
        draft: z.boolean().optional(),
    }),
});

const pages = defineCollection({
    loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date().optional(),
        slug: z.string(),
        keywords: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
    }),
});

export const collections = { posts, pages };
