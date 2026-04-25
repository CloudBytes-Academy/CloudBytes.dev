import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
    schema: ({ image }) =>
        z.object({
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
            heroImage: image().optional(),
            heroImageAlt: z.string().optional(),
            /** Optional structured how-to data. When present, a HowTo JSON-LD block is emitted. */
            howto: z
                .object({
                    totalTime: z.string().optional(),
                    estimatedCost: z
                        .object({
                            currency: z.string().default("USD"),
                            value: z.string().default("0"),
                        })
                        .optional(),
                    tools: z.array(z.string()).optional(),
                    supplies: z.array(z.string()).optional(),
                    steps: z.array(z.object({ title: z.string(), description: z.string() })),
                })
                .optional(),
            /** Optional FAQ block. When present, a FAQPage JSON-LD block is emitted. */
            faq: z
                .array(z.object({ question: z.string(), answer: z.string() }))
                .optional(),
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

const authors = defineCollection({
    loader: glob({ base: "./src/content/authors", pattern: "**/*.{md,mdx}" }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            slug: z.string(),
            jobTitle: z.string().optional(),
            location: z.string().optional(),
            bio: z.string().optional(),
            avatar: image().optional(),
            website: z.string().url().optional(),
            sameAs: z.array(z.string().url()).default([]),
            email: z.string().email().optional(),
        }),
});

export const collections = { posts, pages, authors };
