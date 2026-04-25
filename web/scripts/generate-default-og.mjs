#!/usr/bin/env node
/**
 * Generate the static `public/og-default.png` fallback.
 *
 * Used by the BaseHead OG image fallback for any page that, for whatever
 * reason, isn't in the OG manifest. Also used for the JSON-LD
 * `Organization`/`Article` `image` fields (those need an absolute URL that
 * does not depend on the dynamic /og endpoint being live).
 *
 * Imports the same renderer the dynamic endpoint uses, so brand drift can
 * never sneak in.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderOgCard } from "../src/lib/og/render.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const OUT = path.join(PUBLIC_DIR, "og-default.png");

async function main() {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    const png = await renderOgCard({
        title: "CloudBytes/dev",
        kicker: "Knowledge base",
        subtitle:
            "Code snippets, AWS Academy lessons, and tutorials for cloud, Python, Linux, and developer tooling.",
    });

    await fs.writeFile(OUT, png);
    console.log(`wrote ${path.relative(process.cwd(), OUT)} (${(png.length / 1024).toFixed(1)}KB)`);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
