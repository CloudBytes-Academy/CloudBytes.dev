/**
 * OG card renderer.
 *
 * Plain ESM so the same renderer works from:
 *   - the Astro endpoint at src/pages/og/[...slug].png.ts
 *   - the standalone scripts/generate-default-og.mjs prebuild script
 *
 * Uses satori (JSX/object tree → SVG) + sharp (SVG → PNG).
 *
 * Design:
 *   1200x630 dark card, on-brand bethany colours, with:
 *   - top-left wordmark "CloudBytes/dev>" using JetBrains Mono for the
 *     prompt-cursor character
 *   - colored kicker pill below the wordmark (per-section accent)
 *   - large bold title
 *   - byline + URL bottom-left
 *   - thin accent gradient bar at the bottom
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import satori from "satori";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve fonts relative to the package root (../../..).
const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const INTER_400 = path.join(PROJECT_ROOT, "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff");
const INTER_700 = path.join(PROJECT_ROOT, "node_modules/@fontsource/inter/files/inter-latin-700-normal.woff");
const INTER_800 = path.join(PROJECT_ROOT, "node_modules/@fontsource/inter/files/inter-latin-800-normal.woff");
const JBM_700 = path.join(PROJECT_ROOT, "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff");

let fontCache;
async function loadFonts() {
    if (fontCache) return fontCache;
    const [inter400, inter700, inter800, jbm700] = await Promise.all([
        fs.readFile(INTER_400),
        fs.readFile(INTER_700),
        fs.readFile(INTER_800),
        fs.readFile(JBM_700),
    ]);
    fontCache = [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
        { name: "Inter", data: inter800, weight: 800, style: "normal" },
        { name: "JetBrains Mono", data: jbm700, weight: 700, style: "normal" },
    ];
    return fontCache;
}

/* -------------------------------------------------------------------- */
/* Brand palette                                                        */
/* -------------------------------------------------------------------- */

const COLORS = {
    bg: "#191c23",
    bgGradient: "#222831",
    surface: "#222831",
    border: "#2c333d",
    text: "#ffffff",
    textMuted: "#9ca3af",
    primary: "#498afb",
    secondary: "#9166cc",
    accent: "#09c372",
    warning: "#fa8142",
    error: "#ff3860",
};

const ACCENT_BY_KICKER = {
    Snippets: COLORS.primary,
    "AWS Academy": COLORS.warning,
    Books: COLORS.accent,
    Tag: COLORS.secondary,
    Category: COLORS.primary,
    Author: COLORS.accent,
    Authors: COLORS.accent,
    Page: COLORS.textMuted,
    Glossary: COLORS.secondary,
    Search: COLORS.textMuted,
    Learn: COLORS.secondary,
    "Knowledge base": COLORS.primary,
};

function pickAccent(kicker, override) {
    if (override) return override;
    return ACCENT_BY_KICKER[kicker] ?? COLORS.primary;
}

/* -------------------------------------------------------------------- */
/* JSX-as-object tree (avoids needing a TSX/JSX runtime)                */
/* -------------------------------------------------------------------- */

/**
 * Build the satori JSX tree.
 * @param {{title: string, kicker?: string, byline?: string, accent?: string, subtitle?: string}} opts
 */
function buildTree({ title, kicker = "Knowledge base", byline, accent, subtitle }) {
    const accentColor = pickAccent(kicker, accent);

    return {
        type: "div",
        props: {
            style: {
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                background: `linear-gradient(140deg, ${COLORS.bg} 0%, ${COLORS.bgGradient} 100%)`,
                fontFamily: "Inter",
                color: COLORS.text,
                padding: "60px 72px",
            },
            children: [
                // Decorative top-right accent dot grid
                {
                    type: "div",
                    props: {
                        style: {
                            position: "absolute",
                            top: "0",
                            right: "0",
                            width: "420px",
                            height: "420px",
                            display: "flex",
                            background:
                                "radial-gradient(circle at top right, rgba(73,138,251,0.18) 0%, rgba(25,28,35,0) 60%)",
                        },
                    },
                },

                // Wordmark
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "0",
                            fontFamily: "JetBrains Mono",
                            fontWeight: 700,
                            fontSize: "32px",
                            letterSpacing: "-0.01em",
                            color: COLORS.text,
                        },
                        children: [
                            { type: "span", props: { children: "CloudBytes" } },
                            { type: "span", props: { style: { color: accentColor }, children: "/dev" } },
                            { type: "span", props: { style: { color: accentColor, marginLeft: "2px" }, children: ">" } },
                        ],
                    },
                },

                // Main content stack
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            justifyContent: "center",
                            marginTop: "16px",
                            marginBottom: "16px",
                        },
                        children: [
                            // Kicker pill
                            kicker && {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        alignSelf: "flex-start",
                                        background: `${accentColor}22`,
                                        border: `1px solid ${accentColor}66`,
                                        color: accentColor,
                                        padding: "8px 18px",
                                        borderRadius: "999px",
                                        fontSize: "20px",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        marginBottom: "32px",
                                    },
                                    children: kicker,
                                },
                            },

                            // Title
                            {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        fontSize: title.length > 70 ? "56px" : title.length > 40 ? "68px" : "76px",
                                        lineHeight: 1.08,
                                        fontWeight: 800,
                                        color: COLORS.text,
                                        letterSpacing: "-0.02em",
                                        maxWidth: "1056px",
                                    },
                                    children: title,
                                },
                            },

                            // Subtitle
                            subtitle && {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        marginTop: "24px",
                                        fontSize: "26px",
                                        lineHeight: 1.4,
                                        fontWeight: 400,
                                        color: COLORS.textMuted,
                                        maxWidth: "1056px",
                                    },
                                    children: subtitle,
                                },
                            },
                        ].filter(Boolean),
                    },
                },

                // Byline / URL footer row
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            fontSize: "22px",
                            color: COLORS.textMuted,
                            fontFamily: "Inter",
                        },
                        children: [
                            byline
                                ? {
                                      type: "div",
                                      props: {
                                          style: {
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "12px",
                                          },
                                          children: [
                                              {
                                                  type: "div",
                                                  props: {
                                                      style: {
                                                          display: "flex",
                                                          width: "12px",
                                                          height: "12px",
                                                          borderRadius: "999px",
                                                          background: accentColor,
                                                      },
                                                  },
                                              },
                                              { type: "span", props: { style: { color: COLORS.text }, children: byline } },
                                          ],
                                      },
                                  }
                                : { type: "div", props: { style: { display: "flex" }, children: "" } },
                            {
                                type: "div",
                                props: {
                                    style: {
                                        display: "flex",
                                        fontFamily: "JetBrains Mono",
                                        fontWeight: 700,
                                        color: COLORS.textMuted,
                                    },
                                    children: "cloudbytes.dev",
                                },
                            },
                        ],
                    },
                },

                // Bottom accent bar
                {
                    type: "div",
                    props: {
                        style: {
                            position: "absolute",
                            left: "0",
                            right: "0",
                            bottom: "0",
                            height: "8px",
                            display: "flex",
                            background: `linear-gradient(90deg, ${accentColor} 0%, ${COLORS.primary} 50%, ${COLORS.secondary} 100%)`,
                        },
                    },
                },
            ],
        },
    };
}

/* -------------------------------------------------------------------- */
/* Public API                                                           */
/* -------------------------------------------------------------------- */

/**
 * Render an OG card to a PNG buffer.
 * @param {{title: string, kicker?: string, byline?: string, accent?: string, subtitle?: string}} opts
 * @returns {Promise<Buffer>}
 */
export async function renderOgCard(opts) {
    const fonts = await loadFonts();
    const tree = buildTree(opts);

    const svg = await satori(tree, {
        width: 1200,
        height: 630,
        fonts,
    });

    return sharp(Buffer.from(svg)).png().toBuffer();
}

export { COLORS };
