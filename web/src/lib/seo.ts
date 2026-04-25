/**
 * Centralised JSON-LD builders.
 *
 * Every page should compose its JSON-LD from one of the helpers below so the
 * shape (fields, @id strategy, publisher attribution) stays consistent across
 * Article / WebPage / CollectionPage / ProfilePage / etc.
 *
 * URLs passed in must already be absolute (use `new URL(...).toString()`),
 * with the exception of asset paths starting with "/" which we resolve against
 * SITE_URL here.
 */
import {
    BRAND_LOGO_HEIGHT,
    BRAND_LOGO_PATH,
    BRAND_LOGO_WIDTH,
    ORG_ID,
    ORG_SAME_AS,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
    WEBSITE_ID,
} from "../consts";

type JsonLd = Record<string, unknown>;

export interface BreadcrumbInput {
    name: string;
    url?: string;
}

export interface ArticleAuthor {
    name: string;
    slug?: string;
    url?: string;
    jobTitle?: string;
    sameAs?: string[];
    image?: string;
}

export interface HowToStepInput {
    title: string;
    description: string;
    url?: string;
    image?: string;
}

export interface HowToInput {
    name: string;
    description: string;
    url: string;
    image?: string | string[];
    totalTime?: string;
    estimatedCost?: { currency: string; value: string };
    tools?: string[];
    supplies?: string[];
    steps: HowToStepInput[];
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface SpeakableInput {
    cssSelectors?: string[];
}

const DEFAULT_SPEAKABLE_SELECTORS = ["[data-speakable]"];

function abs(url: string) {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `${SITE_URL}${url}`;
    return `${SITE_URL}/${url}`;
}

/* ------------------------------------------------------------------ */
/*  Entity blocks                                                      */
/* ------------------------------------------------------------------ */

export function buildOrganization(): JsonLd {
    return {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_TITLE,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: {
            "@type": "ImageObject",
            "@id": `${SITE_URL}/#logo`,
            url: abs(BRAND_LOGO_PATH),
            contentUrl: abs(BRAND_LOGO_PATH),
            width: BRAND_LOGO_WIDTH,
            height: BRAND_LOGO_HEIGHT,
            caption: SITE_TITLE,
        },
        sameAs: ORG_SAME_AS,
    };
}

export function buildWebSite(opts: { searchUrlTemplate?: string } = {}): JsonLd {
    const node: JsonLd = {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_TITLE,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@id": ORG_ID },
    };

    if (opts.searchUrlTemplate) {
        node.potentialAction = {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: opts.searchUrlTemplate,
            },
            "query-input": "required name=search_term_string",
        };
    }

    return node;
}

export function buildPerson(author: ArticleAuthor & { id?: string }): JsonLd {
    const profileUrl = author.url ?? (author.slug ? abs(`/authors/${author.slug}/`) : undefined);
    const id = author.id ?? (profileUrl ? `${profileUrl}#person` : `${SITE_URL}/#person-${slugify(author.name)}`);

    const node: JsonLd = {
        "@type": "Person",
        "@id": id,
        name: author.name,
    };

    if (profileUrl) node.url = profileUrl;
    if (author.jobTitle) node.jobTitle = author.jobTitle;
    if (author.image) node.image = abs(author.image);
    if (author.sameAs && author.sameAs.length) node.sameAs = author.sameAs;

    return node;
}

/* ------------------------------------------------------------------ */
/*  Page-type blocks                                                   */
/* ------------------------------------------------------------------ */

export interface WebPageInput {
    type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
    url: string;
    name: string;
    description: string;
    breadcrumbs?: BreadcrumbInput[];
    speakable?: boolean | SpeakableInput;
    image?: string;
    inLanguage?: string;
}

export function buildWebPage(input: WebPageInput): JsonLd {
    const node: JsonLd = {
        "@type": input.type ?? "WebPage",
        "@id": `${input.url}#webpage`,
        url: input.url,
        name: input.name,
        description: input.description,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: input.inLanguage ?? "en",
    };

    if (input.image) node.primaryImageOfPage = { "@type": "ImageObject", url: abs(input.image) };

    if (input.breadcrumbs && input.breadcrumbs.length) {
        node.breadcrumb = { "@id": `${input.url}#breadcrumbs` };
    }

    if (input.speakable) {
        const selectors =
            typeof input.speakable === "object" && input.speakable.cssSelectors
                ? input.speakable.cssSelectors
                : DEFAULT_SPEAKABLE_SELECTORS;
        node.speakable = {
            "@type": "SpeakableSpecification",
            cssSelector: selectors,
        };
    }

    return node;
}

export function buildBreadcrumbList(url: string, items: BreadcrumbInput[]): JsonLd {
    return {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: items.map((item, idx) => {
            const el: JsonLd = {
                "@type": "ListItem",
                position: idx + 1,
                name: item.name,
            };
            if (item.url) el.item = abs(item.url);
            return el;
        }),
    };
}

/**
 * Adapt the visual `BreadcrumbItem[]` (from utils/breadcrumbs) into the
 * JSON-LD input shape, resolving relative `href`s against `site`.
 */
export function adaptBreadcrumbs(
    items: { label: string; href?: string }[],
    site: URL | string,
): BreadcrumbInput[] {
    return items.map((b) => ({
        name: b.label,
        url: b.href ? new URL(b.href, site).toString() : undefined,
    }));
}

export interface ItemListInput {
    url: string;
    items: { url: string; name: string }[];
}

export function buildItemList(input: ItemListInput): JsonLd {
    return {
        "@type": "ItemList",
        "@id": `${input.url}#itemlist`,
        itemListElement: input.items.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: abs(item.url),
            name: item.name,
        })),
    };
}

/* ------------------------------------------------------------------ */
/*  Article                                                            */
/* ------------------------------------------------------------------ */

export interface ArticleInput {
    type?: "Article" | "BlogPosting" | "NewsArticle";
    url: string;
    headline: string;
    description: string;
    datePublished: Date;
    dateModified?: Date;
    image: string | string[];
    author: ArticleAuthor;
    keywords?: string[];
    articleSection?: string;
    speakable?: boolean | SpeakableInput;
    inLanguage?: string;
}

export function buildArticle(input: ArticleInput): JsonLd {
    const images = (Array.isArray(input.image) ? input.image : [input.image]).map(abs);
    const author = buildPerson(input.author);

    const node: JsonLd = {
        "@type": input.type ?? "BlogPosting",
        "@id": `${input.url}#article`,
        headline: input.headline,
        description: input.description,
        url: input.url,
        mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
        image: images,
        datePublished: input.datePublished.toISOString(),
        dateModified: (input.dateModified ?? input.datePublished).toISOString(),
        inLanguage: input.inLanguage ?? "en",
        author,
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": WEBSITE_ID },
    };

    if (input.keywords && input.keywords.length) node.keywords = input.keywords.join(", ");
    if (input.articleSection) node.articleSection = input.articleSection;

    if (input.speakable) {
        const selectors =
            typeof input.speakable === "object" && input.speakable.cssSelectors
                ? input.speakable.cssSelectors
                : DEFAULT_SPEAKABLE_SELECTORS;
        node.speakable = {
            "@type": "SpeakableSpecification",
            cssSelector: selectors,
        };
    }

    return node;
}

/* ------------------------------------------------------------------ */
/*  HowTo / FAQ                                                        */
/* ------------------------------------------------------------------ */

export function buildHowTo(input: HowToInput): JsonLd {
    const images = input.image
        ? (Array.isArray(input.image) ? input.image : [input.image]).map(abs)
        : undefined;

    const node: JsonLd = {
        "@type": "HowTo",
        "@id": `${input.url}#howto`,
        name: input.name,
        description: input.description,
        url: input.url,
        step: input.steps.map((s, idx) => {
            const step: JsonLd = {
                "@type": "HowToStep",
                position: idx + 1,
                name: s.title,
                text: s.description,
            };
            if (s.url) step.url = s.url;
            if (s.image) step.image = abs(s.image);
            return step;
        }),
    };

    if (images) node.image = images;
    if (input.totalTime) node.totalTime = input.totalTime;
    if (input.estimatedCost) {
        node.estimatedCost = {
            "@type": "MonetaryAmount",
            currency: input.estimatedCost.currency,
            value: input.estimatedCost.value,
        };
    }
    if (input.tools && input.tools.length) {
        node.tool = input.tools.map((t) => ({ "@type": "HowToTool", name: t }));
    }
    if (input.supplies && input.supplies.length) {
        node.supply = input.supplies.map((s) => ({ "@type": "HowToSupply", name: s }));
    }

    return node;
}

export function buildFaqPage(url: string, items: FaqItem[]): JsonLd {
    return {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: items.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
            },
        })),
    };
}

/* ------------------------------------------------------------------ */
/*  Profile / DefinedTerm                                              */
/* ------------------------------------------------------------------ */

export interface ProfilePageInput {
    url: string;
    person: ArticleAuthor;
    description?: string;
}

export function buildProfilePage(input: ProfilePageInput): JsonLd {
    const person = buildPerson(input.person);
    return {
        "@type": "ProfilePage",
        "@id": `${input.url}#profilepage`,
        url: input.url,
        mainEntity: person,
        about: { "@id": person["@id"] },
        isPartOf: { "@id": WEBSITE_ID },
        ...(input.description ? { description: input.description } : {}),
    };
}

export interface DefinedTermInput {
    slug: string;
    term: string;
    description: string;
    inDefinedTermSet: string;
    sameAs?: string[];
}

export function buildDefinedTerm(input: DefinedTermInput): JsonLd {
    const node: JsonLd = {
        "@type": "DefinedTerm",
        "@id": `${input.inDefinedTermSet}#${input.slug}`,
        name: input.term,
        description: input.description,
        inDefinedTermSet: input.inDefinedTermSet,
        url: `${input.inDefinedTermSet}#${input.slug}`,
    };
    if (input.sameAs && input.sameAs.length) node.sameAs = input.sameAs;
    return node;
}

export function buildDefinedTermSet(opts: {
    url: string;
    name: string;
    description: string;
    terms: { slug: string; term: string; description: string; sameAs?: string[] }[];
}): JsonLd {
    return {
        "@type": "DefinedTermSet",
        "@id": opts.url,
        url: opts.url,
        name: opts.name,
        description: opts.description,
        hasDefinedTerm: opts.terms.map((t) =>
            buildDefinedTerm({
                slug: t.slug,
                term: t.term,
                description: t.description,
                inDefinedTermSet: opts.url,
                sameAs: t.sameAs,
            }),
        ),
    };
}

/* ------------------------------------------------------------------ */
/*  Graph wrapping                                                     */
/* ------------------------------------------------------------------ */

/**
 * Wrap a list of JSON-LD nodes into a single `@graph` document. Use this
 * whenever a page emits more than one entity (almost every page).
 */
export function buildGraph(nodes: JsonLd[]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@graph": nodes.filter(Boolean),
    };
}

/* ------------------------------------------------------------------ */
/*  Utils                                                              */
/* ------------------------------------------------------------------ */

function slugify(input: string) {
    return String(input)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
