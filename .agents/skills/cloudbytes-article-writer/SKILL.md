---
name: cloudbytes-article-writer
description: Draft, revise, and review CloudBytes technical articles in Rehan Haider's established style. Use when Codex is asked to write or edit posts under web/src/content/posts, create AWS Academy or Snippets content, preserve the CloudBytes tutorial voice, generate article frontmatter, outline a technical how-to, or adapt AI-written text so it sounds like CloudBytes.
---

# CloudBytes Article Writer

## Overview

Use this skill to produce CloudBytes articles that are practical, beginner-friendly, and code-led. The target voice is an experienced developer walking the reader through a working setup: explain just enough context, show the exact commands or code, then tell the reader what to verify next.

## Required Reference

Before drafting or revising article prose, read [references/cloudbytes-style-guide.md](references/cloudbytes-style-guide.md). It contains the reusable voice, structure, frontmatter, and review checklist derived from existing CloudBytes posts.

## Workflow

1. Inspect nearby articles in the same category or series before writing:
   - Snippets: `web/src/content/posts/snippets/**`
   - AWS Academy: `web/src/content/posts/aws-academy/**`
   - Books: `web/src/content/posts/books/**`
2. Confirm the article type:
   - Snippet: short, problem-led how-to.
   - AWS Academy: course-style tutorial with prerequisites, code, deploy/test/cleanup sections, and optional `series` metadata.
   - Concept explainer: definition, why it matters, when to use it, practical options.
   - Book/product note: concise value summary and call to action.
3. Draft valid Astro Markdown with frontmatter matching `web/src/content.config.ts`.
4. Prefer direct commands, concrete filenames, screenshots/image placeholders only when the asset exists or the user asks for one.
5. Preserve the CloudBytes voice while fixing obvious spelling, grammar, and technical clarity issues.
6. Run formatting for edited content when practical:

```bash
cd web && npx prettier --write src/content/posts/<path-to-post>.md
```

## Accuracy Rules

- Verify drift-prone technical instructions from primary documentation when the article depends on current versions, latest commands, cloud console labels, package names, pricing, quotas, or release behavior.
- Do not invent screenshots, command output, AWS IDs, or benchmark numbers.
- Do not add marketing-style introductions. Open with the reader's practical scenario or the exact technical problem.
- Do not preserve legacy typos as style. Preserve tone, structure, and pacing; improve correctness.
