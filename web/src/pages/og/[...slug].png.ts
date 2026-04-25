import type { APIRoute, GetStaticPaths } from "astro";
import { buildOgManifest, type OgEntry } from "../../lib/og/manifest";
import { renderOgCard } from "../../lib/og/render.mjs";

export const getStaticPaths: GetStaticPaths = async () => {
    const manifest = await buildOgManifest();
    return manifest.map((entry) => ({
        params: { slug: entry.slug },
        props: { entry },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    const entry = props.entry as OgEntry;
    const png = await renderOgCard({
        title: entry.title,
        kicker: entry.kicker,
        subtitle: entry.subtitle,
        byline: entry.byline,
        accent: entry.accent,
    });
    return new Response(new Uint8Array(png), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
