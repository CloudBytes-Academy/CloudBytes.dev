import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DIST_DIR, WEB_ROOT, routeToDistPath } from "./testUtils";

interface Redirect {
    source: string;
    destination: string;
    type: number;
}

async function readRedirects(): Promise<Redirect[]> {
    const firebaseJson = path.resolve(WEB_ROOT, "..", "firebase.json");
    const config = JSON.parse(await fs.readFile(firebaseJson, "utf8"));
    return config.hosting.redirects as Redirect[];
}

async function exists(file: string) {
    return fs
        .access(file)
        .then(() => true)
        .catch(() => false);
}

// Pelican built slugs by deleting punctuation ("Zone.Identifier" -> "zoneidentifier",
// "10/11" -> "1011"). The Astro migration changed these slugs, and the old URLs
// still have backlinks and search history.
const LEGACY_SLUGS: Record<string, string> = {
    "/snippets/wsl2-find-and-delete-zoneidentifier-files": "/snippets/wsl2-find-and-delete-zone-identifier-files",
    "/snippets/enable-hyper-v-on-windows-1011-home": "/snippets/enable-hyper-v-on-windows-10-11-home",
    "/snippets/how-to-install-nodejs-and-npm-on-wsl2": "/snippets/how-to-install-node-js-and-npm-on-wsl2",
    "/snippets/how-to-install-wsl2-on-windows-1011": "/snippets/how-to-install-wsl2-on-windows-10-11",
    "/snippets/build-cicd-pipelines-using-artifacts-with-github-actions":
        "/snippets/build-ci-cd-pipelines-using-artifacts-with-github-actions",
};

describe("Legacy Pelican redirects", () => {
    it("301s every renamed slug to a page that exists", async () => {
        const redirects = await readRedirects();
        for (const [source, destination] of Object.entries(LEGACY_SLUGS)) {
            const rule = redirects.find((r) => r.source === source);
            expect(rule, `expected redirect for ${source}`).toBeTruthy();
            expect(rule!.destination).toBe(destination);
            expect(rule!.type).toBe(301);
            expect(await exists(routeToDistPath(destination)), `${destination} is not built`).toBe(true);
        }
    });

    it("lists renamed slugs before the /articles catch-all", async () => {
        const redirects = await readRedirects();
        const catchAll = redirects.findIndex((r) => r.source === "/articles/:post");
        for (const source of Object.keys(LEGACY_SLUGS)) {
            expect(redirects.findIndex((r) => r.source === source)).toBeLessThan(catchAll);
        }
    });

    it("301s /images/aws/* to /images/* without shadowing built files", async () => {
        const redirects = await readRedirects();
        const rule = redirects.find((r) => r.source === "/images/aws/:file");
        expect(rule?.destination).toBe("/images/:file");
        expect(rule?.type).toBe(301);
        // Firebase applies redirects before static files, so nothing may be served from images/aws/.
        const awsDir = path.join(DIST_DIR, "images", "aws");
        const shadowed = (await exists(awsDir)) ? await fs.readdir(awsDir) : [];
        expect(shadowed).toEqual([]);
        expect(await exists(path.join(DIST_DIR, "images", "25000000-architecture-diagram.png"))).toBe(true);
    });
});
