# SEO / GEO / AEO Audit: cloudbytes.dev

**Audit type:** Full
**Date:** 2026-04-25
**Pages reviewed:** Source code (`web/`) + production build (`web/dist/`, 210 HTML pages) + dev server at `http://localhost:8080/`
**Site type:** Astro 6 static blog migrated from Pelican — 100 posts, 1 author, 3 categories (Snippets, AWS Academy, Books)

---

## Scores

| Dimension         | Score    | Status                                                                |
| ----------------- | -------- | --------------------------------------------------------------------- |
| SEO               | 5/10     | Decent foundation, multiple critical gaps                             |
| GEO               | 3/10     | Below average — almost no AI-search entity graph                      |
| AEO               | 2/10     | Critical — zero structured-answer formats despite ~100 how-to posts    |
| Keyword Targeting | 7/10     | Strong title-level targeting, no glossary/pillar pages                |
| **Combined**      | **17/40** |                                                                      |

---

## Executive Summary

CloudBytes/dev has the bones of a solid technical knowledge base — 100 well-titled how-to posts, a clean Astro 6 build, working sitemap, RSS, canonical URLs, semantic theming, and BlogPosting JSON-LD on every article. But almost every signal beyond "the basics" is missing: no `lastmod` in the sitemap, the same fallback OG image for every page, no Organization/Person schema, no `sameAs` linking to the (visible) GitHub/YouTube presence, no `/llms.txt`, and zero HowTo/FAQ schema despite the site being almost entirely how-to content. The single biggest unlock is structured data on existing content — adding HowTo + FAQ + BreadcrumbList + Person/Organization schema would meaningfully change AI-engine citability and Google rich-result eligibility without writing a new word. The second biggest unlock is per-post hero images — every page currently uses the same `blog-placeholder-1.jpg`, which is invisible-to-bad on social and breaks Article rich-result eligibility. Content quality is good for snippets (avg ~715 words, code-rich, image-rich) but the About page is a single sentence which is a hard E-E-A-T problem.

---

## Pages Audited

| URL                                            | Page Type                | Notes                                                                   |
| ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `/`                                            | Homepage / latest posts  | WebSite JSON-LD only; fallback OG; minimal title                        |
| `/about/`                                      | About                    | One-sentence body; no schema beyond default WebSite                     |
| `/snippets/` (+ pages 2-9)                     | Category index           | WebSite schema (wrong type); no ItemList                                |
| `/aws-academy/` (+ pages 2-8)                  | Category index           | Same as above                                                           |
| `/books/`                                      | Category index           | One book                                                                |
| `/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/` | Sample post (snippet) | BlogPosting JSON-LD, no publisher.logo, fallback OG, no FAQ/HowTo       |
| `/aws-academy/how-to-import-an-existing-lambda-function-using-aws-cdk-in-python/` | Sample post (long-form) | Same                                                                    |
| `/authors/` + `/authors/rehan-haider/` (+ 2-16) | Author hub & profile    | Just lists posts; no Person/ProfilePage schema, no bio, no sameAs       |
| `/tags/` + `/tags/python/` (+ 2-12 each)       | Tag archives             | No ItemList; visible tag dupes ("aws"/"AWS")                            |
| `/page/2/`-`/page/16/`                         | Site pagination          | All in sitemap (should be excluded or noindexed)                        |
| `/sitemap-index.xml` + `/sitemap-0.xml`        | Sitemaps                 | No `<lastmod>` on any URL; pagination URLs included                     |
| `/rss.xml`                                     | RSS                      | Full feed; description has `>` artefact                                 |
| `/robots.txt`                                  | Robots                   | Bare bones; no llms.txt reference                                       |
| `/llms.txt`, `/llms-full.txt`, `/feed.xml`     | (Missing)                | 404 — not generated                                                     |
| `/search`                                      | (Missing)                | No `/search` route — only client-side autocomplete in the header        |

---

## Keyword Analysis

### Mode

**Mode 2 — Auto-discovered** (no keyword list supplied). Inferred from title patterns, frontmatter `tags`/`keywords`, and recurring noun phrases across the 100 posts.

### Top 20 Target Keywords + Coverage

| #  | Keyword                                          | Intent          | Best Matching Page                                                                       | Coverage   |
| -- | ------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------- | ---------- |
| 1  | aws cdk python tutorial                          | Informational   | `/aws-academy/creating-a-new-cdk-app-with-python/` + 30+ siblings                        | ⭐⭐⭐ Strong |
| 2  | aws cdk lambda function python                   | Informational   | `/aws-academy/how-to-create-a-lambda-function-using-aws-cdk-in-python/`                  | ⭐⭐⭐ Strong |
| 3  | aws cdk s3 bucket                                | Informational   | `/aws-academy/create-s3-bucket-using-cdk/` + 6 siblings                                  | ⭐⭐⭐ Strong |
| 4  | install wsl2 windows 10 11                       | Transactional   | `/snippets/how-to-install-wsl2-on-windows-10-11/`                                        | ⭐⭐⭐ Strong |
| 5  | upgrade python ubuntu                            | Transactional   | `/snippets/upgrade-python-to-latest-version-on-ubuntu-linux/`                            | ⭐⭐⭐ Strong |
| 6  | aws cli install linux autocompletion             | Informational   | `/aws-academy/how-to-install-and-configure-aws-cli-on-linux-with-autocompletion/`        | ⭐⭐⭐ Strong |
| 7  | aws ec2 create instance cli                      | Informational   | `/aws-academy/how-to-create-an-aws-ec2-instance-using-aws-cli/`                          | ⭐⭐⭐ Strong |
| 8  | python virtual environment venv                  | Informational   | `/snippets/create-a-python-virtual-environment-using-venv/`                              | ⭐⭐⭐ Strong |
| 9  | run selenium aws lambda                          | Informational   | `/snippets/run-selenium-in-aws-lambda-for-ui-testing/`                                   | ⭐⭐⭐ Strong |
| 10 | aws sam cli serverless                           | Informational   | `/snippets/build-deploy-serverless-apps-on-aws-with-sam-cli/`                            | ⭐⭐⭐ Strong |
| 11 | mount efs ec2 ubuntu                             | Informational   | `/aws-academy/mount-amazon-efs-drive-on-ec2-ubuntu-linux-using-nfs-utils/`               | ⭐⭐⭐ Strong |
| 12 | aws cdk multiple stacks                          | Informational   | `/aws-academy/creating-multiple-stacks-in-aws-cdk/`                                      | ⭐⭐⭐ Strong |
| 13 | wsl2 git authentication fix                     | Informational   | `/snippets/fix-or-configure-git-authentication-in-wsl2/`                                 | ⭐⭐⭐ Strong |
| 14 | expo react native android compile                | Informational   | `/snippets/compile-expo-react-native-application-for-android/`                           | ⭐⭐⭐ Strong |
| 15 | fastapi return file response                     | Informational   | `/snippets/received-return-a-file-from-in-memory-buffer-using-fastapi/`                  | ⭐⭐ Partial (slug typo: "received-return")  |
| 16 | what is aws cdk                                  | Informational   | `/snippets/which-python-implementation-you-should-use-cpython-pypy-etc/` (closest)       | ❌ No page  |
| 17 | aws cdk vs terraform                             | Commercial      | (none)                                                                                    | ❌ No page  |
| 18 | flask vs fastapi                                 | Commercial      | (none — books page references both but no comparison)                                    | ❌ No page  |
| 19 | wsl vs wsl2                                      | Commercial      | (none)                                                                                    | ❌ No page  |
| 20 | what is jamstack                                 | Informational   | `/snippets/what-is-jamstack-and-why-should-you-be-using-it/`                             | ⭐⭐ Partial (exists but no FAQ/Speakable schema)  |

**Coverage summary:** 14/20 keywords have a strong dedicated page; 2/20 have weak/partial coverage; 4/20 have **no page at all**. The "no page" group is concentrated on definitional ("what is X") and comparison ("X vs Y") queries — both of which are high-traffic, high-AEO-value SERP positions the site is currently invisible for.

### Content Gaps

- **"what is aws cdk"** (Informational) — No dedicated page. AWS CDK is the site's largest content cluster (40+ posts) yet there's no entry-point page defining what CDK is. Recommend creating `/learn/what-is-aws-cdk/` (or similar) with `Article` + `FAQPage` schema and a clear "AWS CDK is..." opener.
- **"aws cdk vs terraform"** (Commercial) — High-intent comparison query. Recommend a hand-written `/compare/aws-cdk-vs-terraform/` with an honest diff table.
- **"flask vs fastapi"** (Commercial) — The Books category page advertises a book covering both. Recommend an excerpt comparison page at `/compare/flask-vs-fastapi/` linking back to the book.
- **"wsl vs wsl2"** (Commercial) — Lots of WSL2 content but no positioning of WSL vs WSL2. Recommend `/compare/wsl-vs-wsl2/`.
- **Glossary** (Informational, multi-keyword) — There's no `/glossary/` defining recurring terms (CDK, VPC, S3, Lambda, WSL2, EFS, Lustre, partytown, Pelican). A `DefinedTermSet` glossary would cluster ~30 entities with citable definitions for AI engines.
- **Pillar pages per category** — `/snippets/` and `/aws-academy/` are auto-generated card lists. There's no pillar/overview page that frames the cluster and links to the canonical posts. That's the page that ranks for the cluster's head term ("aws cdk tutorials", "linux dev snippets").
- **Author bio** — `/authors/rehan-haider/` lists posts but contains zero biographical content. Adding a real bio with credentials, GitHub/LinkedIn `sameAs`, and `Person` JSON-LD would unlock E-E-A-T for the entire site.

### Tag Duplication (Content-Level)

`grep` across post frontmatter shows duplicate tag entries differing only in case:

| Canonical | Variants found in frontmatter | Result                                    |
| --------- | ------------------------------ | ----------------------------------------- |
| `aws`     | `aws` (53), `AWS` (33)         | One archive page (slug collapses) but inconsistent display name |
| `python`  | `python` (28), `Python` (29)   | Same                                      |
| `lambda`  | `lambda` (14), `Lambda` (3)    | Same                                      |
| `wsl2`    | `wsl2` (12), `WSL2` (3)        | Same                                      |
| `wsl`     | `wsl` (2), `WSL` (2)           | Same                                      |
| `linux`   | `linux` (19), `Linux` (2)      | Same                                      |
| `ec2`     | `ec2` (2), `EC2` (6)           | Same                                      |

Recommend a one-off normalization pass on frontmatter (lowercase, then re-validate) so the displayed tag chip and tag archive match.

---

## SEO Analysis (5/10)

### Technical On-Page

| Signal                          | Finding                                                                                                                     | Status               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Title tag (home)                | `CloudBytes/dev` — 14 chars, no keywords, brand-only                                                                        | ⚠️ Needs Attention    |
| Title tag (post)                | `{title} · CloudBytes/dev` — descriptive, well-formed                                                                       | ✅ Good              |
| Title tag (archive)             | `CloudBytes/dev · Snippets` (etc.) — brand-first; consider keyword-first                                                    | ⚠️ Needs Attention    |
| Meta description (home)         | `CloudBytes/dev>: Programming on Steroids \| Code snippets, lessons, tutorials, and more.!` — 84 chars, has stray `>`, ends with `.!`  | ⚠️ Needs Attention    |
| Meta description (post)         | Pulled from frontmatter `description` — generally well-written                                                              | ✅ Good              |
| Meta description (archive)      | All archive pages share the same `SITE_DESCRIPTION` — non-unique                                                            | ⚠️ Needs Attention    |
| H1 (home)                       | `Latest` — generic, no keywords                                                                                              | ⚠️ Needs Attention    |
| H1 (post)                       | Single H1 with full title                                                                                                    | ✅ Good              |
| H1 (about)                      | Just `About`                                                                                                                  | ⚠️ Needs Attention    |
| H1 (tag pages)                  | `#python` (with hashtag literal in H1)                                                                                       | ⚠️ Needs Attention    |
| Heading hierarchy               | Posts use H1→H2→H3 cleanly; section headings are imperative ("Method 1") not question-phrased                              | ⚠️ Needs Attention    |
| URL structure                   | Clean, lowercase, hyphenated, trailing slash consistent                                                                      | ✅ Good              |
| Canonical tag                   | Self-referencing on every page                                                                                                | ✅ Good              |
| Robots meta                     | `index,follow` everywhere; no accidental noindex                                                                              | ✅ Good              |
| Viewport meta                   | Present                                                                                                                       | ✅ Good              |
| Image alt text (markdown)       | Authors do provide alt text in `![alt](path)` — sample looks descriptive                                                      | ✅ Good              |
| Image optimization              | All 21MB of post images are in `/public/images/` — bypasses Astro's `<Image>` pipeline (no WebP/AVIF, no responsive variants) | ⚠️ Needs Attention    |
| Per-post hero image             | None — every post falls back to `blog-placeholder-1.jpg`                                                                     | ❌ Missing           |
| Internal links                  | Tag archives, breadcrumbs, related-posts, series nav all generated automatically                                              | ✅ Good              |
| Open Graph (`og:title`/desc/url) | Present                                                                                                                       | ✅ Good              |
| `og:image`                      | Single fallback `blog-placeholder-1.Bx0Zcyzv.jpg` for every page                                                              | ❌ Missing per-page  |
| `og:image:width`/`height`/`alt` | Not emitted                                                                                                                   | ❌ Missing           |
| `og:site_name`, `og:locale`     | Present                                                                                                                       | ✅ Good              |
| `og:type`                       | `website` on archives, `article` on posts                                                                                     | ✅ Good              |
| `article:published_time` / `modified_time` | Emitted on posts (good)                                                                                              | ✅ Good              |
| `article:author` / `article:tag` / `article:section` | Not emitted                                                                                                | ❌ Missing           |
| `twitter:card=summary_large_image` | Present                                                                                                                    | ✅ Good              |
| `twitter:site`                  | `@cloudbytes_dev`                                                                                                              | ✅ Good              |
| `twitter:creator`               | Not emitted (single-author site, easy win)                                                                                    | ❌ Missing           |
| Favicon / manifest              | Full coverage (favicon.ico, svg, apple-touch, webmanifest, masked, browserconfig)                                              | ✅ Good              |

### Content Quality

| Signal                    | Finding                                                                                            | Status            |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ----------------- |
| Total content             | 100 posts, ~71,571 words, avg ~715 words/post                                                       | ✅ Good           |
| Long-form pillar content  | Largest posts: 2,216 words (selenium chrome) / 3,296 words (DMS migration); no >5K word pillar     | ⚠️ Needs Attention |
| Short content             | 5 posts under 300 words (one is a 45-word draft)                                                    | ⚠️ Needs Attention |
| About page depth          | One sentence ("CloudBytes/dev> is a personal knowledge base for cloud + developer tooling…")        | ❌ Critical       |
| Code snippets             | All posts code-rich; copy button enhancement is wired up                                            | ✅ Good           |
| Inline images             | 65/100 posts contain inline screenshots/images                                                       | ✅ Good           |
| `updatedDate`             | **Zero** posts use `updatedDate` — `dateModified` always equals `datePublished` in JSON-LD          | ❌ Missing        |
| Visible publish/modified date | Shown via `<FormattedDate>` on every post                                                       | ✅ Good           |
| Outbound authoritative citations | None — long-form posts don't cite Wikipedia/AWS docs/RFCs. Even AWS-CDK-heavy posts don't link to https://docs.aws.amazon.com | ❌ Missing |

### Discoverability

| Signal                        | Finding                                                                                  | Status            |
| ----------------------------- | ---------------------------------------------------------------------------------------- | ----------------- |
| `sitemap-index.xml`           | Present, references one sitemap                                                            | ✅ Good           |
| `sitemap-0.xml`               | 200+ URLs, but ZERO `<lastmod>` on ANY URL                                                 | ❌ Critical       |
| Sitemap pollution             | Includes thin paginated archives: `/page/2-16/`, `/aws-academy/2-8/`, `/snippets/2-9/`, `/tags/python/2-12/`, `/authors/rehan-haider/2-16/` | ⚠️ Needs Attention |
| RSS at `/rss.xml`             | Full feed, all 100 posts                                                                    | ✅ Good           |
| `<link rel="alternate" type="application/rss+xml">` | Present site-wide (good)                                                  | ✅ Good           |
| Per-section feeds             | None (no `/snippets/feed.xml`, `/aws-academy/feed.xml`)                                    | ⚠️ Needs Attention |
| JSON Feed (`/feed.json`)      | Not present                                                                                 | ❌ Missing        |
| `/llms.txt`                   | 404                                                                                         | ❌ Missing        |
| `/llms-full.txt`              | 404                                                                                         | ❌ Missing        |
| Internal `/search` page       | Not present — header search is Algolia client-side autocomplete only, no fallback URL       | ❌ Missing        |
| `robots.txt`                  | Present but minimal: `User-agent: *` + sitemap link only; doesn't reference llms.txt       | ⚠️ Needs Attention |

### Structured Data

Detected JSON-LD blocks across the site:

| Schema Type   | Where Emitted                                                            | Field Completeness                                                                                  | Status              |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------- |
| `WebSite`     | Every non-article page (114 pages — home, archives, tags, authors, etc.) | Only `name`, `description`, `url`. **No `potentialAction` / SearchAction**, no `@id`              | ⚠️ Thin & misplaced  |
| `BlogPosting` | Every post page (95 pages)                                                | `headline` (with site-suffix bug), `description`, `url`, `mainEntityOfPage` (typed), `image` (always fallback), `datePublished`, `dateModified`, `author.Person`. **No `publisher`, no `keywords`, no `speakable`, no `articleSection`** | ⚠️ Incomplete       |
| `Organization` | Nowhere                                                                    | —                                                                                                   | ❌ Missing           |
| `Person`      | Nowhere as standalone (only nested in BlogPosting.author with just `name`)  | No `@id`, no `sameAs[]`, no `jobTitle`, no `image`                                                  | ❌ Missing           |
| `ProfilePage` | Nowhere                                                                    | —                                                                                                   | ❌ Missing           |
| `BreadcrumbList` | Nowhere (breadcrumbs ARE rendered visually in `Breadcrumbs.astro`)      | —                                                                                                   | ❌ Missing           |
| `ItemList`    | Nowhere (archive/index pages would benefit)                                 | —                                                                                                   | ❌ Missing           |
| `CollectionPage` | Nowhere                                                                  | —                                                                                                   | ❌ Missing           |
| `WebPage`     | Nowhere as explicit type (only as nested `mainEntityOfPage`)                | —                                                                                                   | ❌ Missing           |
| `FAQPage`     | Nowhere                                                                    | —                                                                                                   | ❌ Missing           |
| `HowTo`       | Nowhere                                                                    | —                                                                                                   | ❌ Missing           |
| `DefinedTerm` / `DefinedTermSet` | Nowhere                                                  | —                                                                                                   | ❌ Missing           |
| `SpeakableSpecification` | Nowhere                                                       | —                                                                                                   | ❌ Missing           |

Most-impactful fix in this section: emit `Organization` (with `logo: ImageObject`) on the home page, add it as `publisher` on every BlogPosting, and add `BreadcrumbList` everywhere a breadcrumb is rendered. This is a single helper file in `lib/seo.ts`.

---

## GEO Analysis (3/10)

### E-E-A-T Assessment

| Signal                              | Finding                                                                                                  | Status              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------- |
| Named author with credentials       | `Rehan Haider` is set on 99/100 posts in frontmatter but no bio, no credentials anywhere                | ⚠️ Partial          |
| Real `Person` profile schema        | Not emitted                                                                                               | ❌ Missing          |
| Author profile page                 | `/authors/rehan-haider/` exists but is just a paginated list of posts — no bio, photo, links, schema    | ❌ Critical         |
| Author byline links to profile      | Visible byline on `Post.astro` does link to `/authors/<slug>/` when present                              | ✅ Good             |
| About page                          | Single sentence — no bio, no team, no qualifications                                                      | ❌ Critical         |
| Contact information                 | Footer has "GitHub" link only; no email, no contact form, no Twitter handle in footer                    | ⚠️ Needs Attention   |
| Trust signals                       | None visible (no testimonials, awards, press, certifications)                                             | ⚠️ Needs Attention   |
| Organization schema                 | Not emitted                                                                                               | ❌ Missing          |
| Stable `@id` per entity             | Not emitted                                                                                               | ❌ Missing          |

### Content for AI Synthesis

| Signal                                  | Finding                                                                                                       | Status              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------- |
| Factual density                         | High — posts contain real commands, version numbers, specific config — content is citable in form              | ✅ Good             |
| Clear lede claims                       | Posts open with concrete `description`; some lede sentences are weak ("To complete this course, configure your system…") | ⚠️ Needs Attention   |
| Outbound authoritative citations        | None — posts don't link to AWS docs, Wikipedia, RFCs, or other primary sources                                 | ❌ Critical         |
| Comprehensive topic coverage            | Strong on AWS-CDK and WSL2 clusters (~40 posts each); no glossary, no scan/install device-family page         | ⚠️ Partial          |
| Entity clarity — single brand `@id`     | Not emitted                                                                                                    | ❌ Missing          |
| Originality                             | Posts have personal voice and hands-on commands — distinct from AWS docs                                       | ✅ Good             |

### Technical GEO

| Signal                                              | Finding                                                                              | Status              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------- |
| `/llms.txt`                                         | 404                                                                                   | ❌ Critical         |
| `/llms-full.txt`                                    | 404                                                                                   | ❌ Missing          |
| `robots.txt` references llms files                  | No                                                                                    | ❌ Missing          |
| HTTPS                                               | Production at `cloudbytes.dev` — assumed HTTPS (canonical uses `https://`)            | ✅ Good             |
| Crawlability — JS-only body content                 | Astro static-renders all body content; no SPA-only rendering                          | ✅ Good             |
| Social profile links from site                      | GitHub + YouTube linked in header (good signal for entity graph)                      | ✅ Good             |
| `Organization.sameAs[]` linking those profiles      | Not emitted                                                                           | ❌ Missing          |
| `Person.sameAs[]` for author                        | Not emitted                                                                           | ❌ Missing          |
| `WebSite.potentialAction.SearchAction`              | Not emitted (and there's no `/search` page to point to)                              | ❌ Missing          |
| `Article.speakable` with `cssSelector`              | Not emitted                                                                           | ❌ Missing          |
| `DefinedTerm` markup on glossary entries            | No glossary exists                                                                    | ❌ Missing          |
| Auto-linking of glossary terms in posts             | No glossary exists                                                                    | ❌ Missing          |

---

## AEO Analysis (2/10)

### Featured Snippet Eligibility

| Signal                                                         | Finding                                                                              | Status              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------- |
| Direct-answer paragraphs (40-60 words) under question headings | None — most post intros are conversational, e.g. "To complete this course…"          | ⚠️ Needs Attention   |
| "X is…" definition sentences                                   | Few. Most posts open with task-orientation, not definition                            | ⚠️ Needs Attention   |
| Numbered steps / bullets                                       | Heavy use of ordered lists — good for list snippets                                   | ✅ Good             |
| Comparison tables                                              | None                                                                                   | ❌ Missing          |

### Structured Answer Formats

| Signal                                          | Finding                                                                       | Status              |
| ----------------------------------------------- | ----------------------------------------------------------------------------- | ------------------- |
| `FAQPage` schema present                        | Nowhere                                                                        | ❌ Critical         |
| `HowTo` schema present                          | Nowhere — despite ~95 posts being structurally how-to content                  | ❌ Critical         |
| Question-phrased H2/H3 headings                 | Rare — most are imperative ("Method 1", "Setting up the dev environment")       | ⚠️ Needs Attention   |
| `SpeakableSpecification` with cssSelector       | Nowhere                                                                        | ❌ Missing          |

### Voice Search Readiness

| Signal                                                           | Finding                                                                  | Status              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------- |
| Conversational language                                          | Posts read as written-by-engineer; not voice-optimized                    | ⚠️ Needs Attention   |
| Long-tail who/what/when/where/why/how question coverage          | Some titles use "How to…" naturally — partial coverage                   | ⚠️ Partial          |
| "How to install / setup on \[device\]" device-family content    | Some natural coverage (WSL2, Hyper-V, Ubuntu) but not productised        | ⚠️ Partial          |
| NAP / local schema                                               | N/A — site is a personal blog                                            | ➖ Not applicable    |

---

## Priority Recommendations

| Priority      | Issue                                                                                                              | Dimension     | Effort | Impact   |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- | ------ | -------- |
| 🔴 Critical    | Add `Organization` JSON-LD (with PNG logo + `sameAs[]` to GitHub/YouTube) on home; add as `publisher` on every BlogPosting | SEO + GEO     | Low    | High     |
| 🔴 Critical    | Add `lastmod` to every sitemap URL (driven by `updatedDate ?? pubDate`); filter out paginated archives             | SEO           | Low    | High     |
| 🔴 Critical    | Add `BreadcrumbList` JSON-LD on every page that already renders breadcrumbs                                         | SEO           | Low    | High     |
| 🔴 Critical    | Generate per-page OG cards (satori + sharp) — kills the "every page = same fallback" problem in one shot            | SEO + AEO     | Medium | High     |
| 🔴 Critical    | Add `HowTo` JSON-LD generator — apply to all 95 step-by-step posts (enrich each post's frontmatter with `totalTime`, `tools`, `steps`) | AEO           | Medium | High     |
| 🔴 Critical    | Add `FAQPage` JSON-LD on posts that already include Q&A-shaped sections (Selenium / Chrome extensions / WSL2 install / Python upgrade) | AEO           | Low    | High     |
| 🔴 Critical    | Create `/llms.txt` + `/llms-full.txt` Astro endpoints listing top posts + glossary (when added) by section          | GEO           | Low    | High     |
| 🟠 High        | Rewrite About page (200-400 words) with bio, qualifications, focus areas; emit `AboutPage` + `Person` schema     | GEO (E-E-A-T) | Low    | High     |
| 🟠 High        | Add Author content collection (one entry per author) with bio + `sameAs[]` (GitHub, LinkedIn, X); render `ProfilePage` + `Person` JSON-LD on `/authors/rehan-haider/`; nest the `Person` (with `sameAs[]`) inside `BlogPosting.author` | GEO (E-E-A-T) | Low    | High     |
| 🟠 High        | Fix `BlogPosting.headline` — currently includes the " · CloudBytes/dev" suffix. `headline` should be the article title only | SEO           | Low    | Medium   |
| 🟠 High        | Replace the WebSite-on-every-page schema with proper page typing: `WebSite` (with SearchAction) only on home; `CollectionPage` + `ItemList` on archives; `ProfilePage` on author hubs; `WebPage` on About/static pages | SEO + GEO     | Medium | High     |
| 🟠 High        | Add `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:creator`, `article:author/tag/section` to BaseHead | SEO           | Low    | Medium   |
| 🟠 High        | Add a `/search` route (server-rendered fallback list + client-side filter from a baked JSON index) so SearchAction can honestly point at it | SEO + GEO     | Medium | High     |
| 🟠 High        | Build a `/learn/glossary/` page with `DefinedTermSet` schema covering AWS/CDK/WSL/Python terms (~30 entries); auto-link glossary terms in markdown content | GEO           | Medium | High     |
| 🟠 High        | Adopt per-post hero images: add `heroImage: image()` to the posts collection schema; pass `heroImage.src` to OG `image` and BlogPosting `image[]`. For older posts without heroes, fall back to the new dynamic OG card | SEO + GEO     | Medium | High     |
| 🟠 High        | Normalize tag casing in frontmatter (one-off script): "AWS"→"aws", "Python"→"python", "Lambda"→"lambda", "WSL2"→"wsl2", "EC2"→"ec2", "Linux"→"linux" | SEO           | Low    | Medium   |
| 🟡 Medium      | Add `Speakable` schema on posts (mark H1 + first paragraph with `data-speakable`) — voice/AI summary signal     | AEO           | Low    | Medium   |
| 🟡 Medium      | Migrate post-body images from `/public/images/` → `/src/assets/posts/<category>/<slug>/` so Astro's `<Image>` pipeline can produce WebP/AVIF responsive variants | SEO (Core Web Vitals) | High   | High     |
| 🟡 Medium      | Add ≥2 outbound authoritative citations per long-form post (AWS docs, Wikipedia, RFCs) — append a `## Sources` section. Hand-pick, don't auto-generate | GEO           | High   | Medium   |
| 🟡 Medium      | Add comparison pages for the 3 highest-intent missing keywords: `/compare/aws-cdk-vs-terraform/`, `/compare/flask-vs-fastapi/`, `/compare/wsl-vs-wsl2/` | SEO + Keywords | High   | High     |
| 🟡 Medium      | Add definitional pillar pages: `/learn/what-is-aws-cdk/`, `/learn/what-is-wsl2/`. Each is 1500-2000 words with FAQ + speakable schema and links to all relevant snippets | SEO + AEO     | High   | High     |
| 🟢 Quick win   | Fix the home-page `<title>`: currently `CloudBytes/dev` (14 chars) — change to `CloudBytes/dev — AWS, Python & Cloud Tutorials` (~50 chars, keyword-front-loaded) | SEO           | Low    | Medium   |
| 🟢 Quick win   | Fix archive-page meta descriptions — currently every archive page shares `SITE_DESCRIPTION`. Generate a per-archive description ("All 49 snippets in CloudBytes/dev — AWS, Python, WSL2, Linux") | SEO           | Low    | Medium   |
| 🟢 Quick win   | Fix the homepage H1 — currently `Latest`. Use a keyword-rich `<h1>` even if visually hidden (e.g. "CloudBytes/dev — code snippets and tutorials") | SEO           | Low    | Medium   |
| 🟢 Quick win   | Add `<link rel="alternate" type="application/json" href="/feed.json">` (and emit a JSON Feed at that path) — simple Astro endpoint | SEO + GEO     | Low    | Medium   |
| 🟢 Quick win   | Reference `/llms.txt` from `/robots.txt` once it exists                                                            | GEO           | Low    | Low      |
| 🟢 Quick win   | Drop the stray `>` from the meta description if it's not intentional brand styling — or keep it but flatten the trailing `.!` | SEO           | Low    | Low      |
| 🟢 Quick win   | Remove paginated archive URLs (`/page/N/`, `/{cat}/N/`, `/tags/{t}/N/`, `/authors/{a}/N/`) from the sitemap via `@astrojs/sitemap`'s `filter` callback | SEO           | Low    | Medium   |
| 🟢 Quick win   | Set `updatedDate` for evergreen posts so `dateModified` is meaningful (start with the AWS-CDK posts that get re-validated)  | SEO + GEO     | Medium | Medium   |
| 🟢 Quick win   | Add `WebSite.potentialAction.SearchAction` JSON-LD on home (after `/search` exists) — paste-in change                | SEO + GEO     | Low    | Medium   |

When you're ready to ship any of these, ask "implement X" and I'll walk through the change. The Astro/static-stack reference playbook in the seo-expert skill covers most of these patterns end-to-end.

---

## What's Working Well

- **Solid Astro 6 build** — 210 static HTML files, prefetch-on-viewport, partytown'd analytics, no SPA-only body rendering. AI crawlers and Googlebot get the same content as users.
- **Full BlogPosting JSON-LD** on every post (95 pages) with `mainEntityOfPage` typed correctly, `datePublished`, `dateModified`, and a Person `author`. The shape is right; it just needs `publisher.logo` + `image` per-post.
- **Clean URL structure** — lowercase, hyphenated, trailing slash consistent, category prefix carries semantic weight (`/aws-academy/`, `/snippets/`).
- **RSS at `/rss.xml`** — full feed, all 100 posts, properly referenced via `<link rel="alternate">` site-wide.
- **Sitemap-index pattern** with `@astrojs/sitemap` is in place and split correctly.
- **Tag + author + category archives** auto-generate from frontmatter — internal linking is dense, related-posts and series-nav are wired up on `Post.astro`.
- **Code-snippet ergonomics** — copy-button enhancement, language + filename labels, no client-side JS framework on most pages.
- **Algolia client-side autocomplete** in the header (just add a `/search` page to make it AI-search-friendly too).
- **DaisyUI/Tailwind theming** with light/dark and an anti-flash inline script — correctly implemented per CLAUDE.md.
- **Single canonical author** (Rehan Haider) — when you add `Person` schema with `sameAs[]`, the entire site benefits from one strong entity declaration.
- **Healthy keyword targeting at the title level** — most long-tail "how to X on Y" queries already have a dedicated page. The schema and entity-graph layer is what's missing, not the content.
- **Live local dev server** + `dist/` build available simultaneously made this audit faster than typical.

---

## Glossary

**SEO** — Search Engine Optimization: making pages rank higher in Google and Bing.
**GEO** — Generative Engine Optimization: making content citable by AI-powered search (Perplexity, ChatGPT Search, Google AI Overviews, Claude, Gemini).
**AEO** — Answer Engine Optimization: structuring content to win featured snippets and voice search answers.
**E-E-A-T** — Experience, Expertise, Authoritativeness, Trustworthiness — Google's quality framework for evaluating who and what to trust.
**llms.txt** — A markdown index at the root of a site (analogous to robots.txt) that tells AI crawlers which pages matter most. Spec: [llmstxt.org](https://llmstxt.org).
**JSON-LD** — JSON for Linking Data: the structured-data format Google, Bing, Perplexity, ChatGPT, etc. all parse from `<script type="application/ld+json">` tags.
**Schema.org** — The vocabulary used inside JSON-LD (`@type: BlogPosting`, `@type: Organization`, etc.). Validate against [validator.schema.org](https://validator.schema.org), not Google's Rich Results Test (which hides several types).
