export type BreadcrumbItem = { label: string; href?: string };

const SEGMENT_LABELS: Record<string, string> = {
    "aws-academy": "AWS Academy",
    snippets: "Snippets",
    books: "Books",
    tags: "Tags",
    authors: "Authors",
    page: "Latest",
    about: "About",
    "terms.html": "Terms",
    "privacy.html": "Privacy",
};

function titleCaseFromSlug(input: string) {
    const text = decodeURIComponent(input).replace(/\.html$/i, "").replace(/[-_]+/g, " ").trim();
    if (!text) return "";
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelForSegment(segment: string, segments: string[], index: number) {
    if (/^\d+$/.test(segment)) return `Page ${segment}`;

    const prev = segments[index - 1];
    if (prev === "tags") return `#${decodeURIComponent(segment)}`;
    if (prev === "authors") return titleCaseFromSlug(segment);

    return SEGMENT_LABELS[segment] ?? titleCaseFromSlug(segment);
}

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const clean = String(pathname ?? "").split("?")[0].split("#")[0];
    const segments = clean.split("/").filter(Boolean);
    if (!segments.length) return [];

    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    let acc = "";
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        acc += `/${seg}`;
        let href = `${acc}/`;

        // /page/{n}/ is pagination for the homepage. There is no /page/ index route.
        if (seg === "page") href = "/";

        items.push({ label: labelForSegment(seg, segments, i), href });
    }

    // Last crumb should not be a link
    items[items.length - 1] = { label: items[items.length - 1].label };
    return items;
}

