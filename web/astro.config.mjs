// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://example.com",
    integrations: [mdx(), sitemap(), react()],
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Montserrat",
            weights: [400, 700],
            cssVariable: "--font-montserrat",
        },
    ],

    vite: {
        plugins: [tailwindcss()],
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
});
