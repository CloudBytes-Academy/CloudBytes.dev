// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { remarkCodeBlockMeta } from "./src/utils/remark/codeBlockMeta.mjs";
import { remarkStripPelicanToc } from "./src/utils/remark/stripPelicanToc.mjs";
import { rehypePelicanAdmonitions } from "./src/utils/rehype/pelicanAdmonitions.mjs";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://cloudbytes.dev",
    integrations: [mdx(), sitemap(), react()],

    markdown: {
        remarkPlugins: [remarkStripPelicanToc, remarkCodeBlockMeta],
        rehypePlugins: [rehypePelicanAdmonitions],
    },

    vite: {
        plugins: [tailwindcss()],
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
});
