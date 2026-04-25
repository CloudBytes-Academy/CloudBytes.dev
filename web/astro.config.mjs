// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { remarkCodeBlockMeta } from "./src/utils/remark/codeBlockMeta.mjs";
import { remarkStripPelicanToc } from "./src/utils/remark/stripPelicanToc.mjs";
import { remarkRewritePelicanFilenameLinks } from "./src/utils/remark/rewritePelicanFilenameLinks.mjs";
import { rehypePelicanAdmonitions } from "./src/utils/rehype/pelicanAdmonitions.mjs";
import { buildLastModMap, sitemapFilter, sitemapSerialize } from "./src/utils/sitemap.mjs";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import partytown from "@astrojs/partytown";

// Resolve once at config time so every URL in the sitemap can pull lastmod
// from the same map.
const lastModMap = await buildLastModMap();
const buildLastMod = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
    site: "https://cloudbytes.dev",
    integrations: [
        mdx(),
        sitemap({
            filter: sitemapFilter,
            serialize: sitemapSerialize(lastModMap, buildLastMod),
        }),
        react(),
        partytown({
            config: {
                // Avoid dev-only requests to `/~partytown/debug/*` which can be
                // mis-routed into dynamic pages (e.g. `[category]/[...rest]`).
                debug: false,
                forward: ["dataLayer.push"],
            },
        }),
    ],

    markdown: {
        remarkPlugins: [remarkStripPelicanToc, remarkCodeBlockMeta, remarkRewritePelicanFilenameLinks],
        rehypePlugins: [rehypePelicanAdmonitions],
    },

    vite: {
        plugins: [tailwindcss()],
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
    server: {
        port: 8080,
    },
});
