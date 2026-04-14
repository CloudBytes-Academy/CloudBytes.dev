# CloudBytes (Astro) — Project Standards

This repository is being refactored from a Pelican blog into an **Astro 6** static site under `web/`.

## Stack
- **Framework**: Astro 6
- **Islands**: React 19 **only when required** (client state / complex interactions). Prefer Astro components.
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **UI**: DaisyUI v5 (themes configured in CSS via `@plugin`)

## Project structure
- **Web app root**: `web/`
- **Routes**: `web/src/pages/` (file-based)
  - Keep filenames **lowercase** where the filename represents a route segment.
  - Prefer directory routes (`/foo/` via `foo/index.astro`) for content pages.
- **Layouts**: `web/src/layouts/`
  - `Layout.astro` is the base shell (navbar + main + sidebar slot + footer).
  - `Page.astro` is for listing pages (card lists + pagination).
  - `Post.astro` is for individual articles.
- **Components**: `web/src/components/`
  - Astro components in **PascalCase** (`Navbar.astro`, `ArticleCard.astro`).
  - Any interactive bits should be minimal and localized (small inline scripts or narrowly-scoped islands).
- **Styles**: `web/src/styles/global.css`
  - Contains Tailwind import and DaisyUI theme definitions.

## Theming (DaisyUI)
- **Default theme (dark)**: `bethany`
- **Light theme**: `bethany-light`
- **Rule**: use DaisyUI semantic tokens (e.g. `bg-base-100`, `text-base-content`, `border-base-300`, `btn`, `card`).
  - Avoid raw Tailwind colors like `text-gray-600`, `bg-white`, `bg-slate-900`, etc.
- **Theme persistence**: stored in `localStorage` under the key `theme`.
- **Anti-flash**: the base layout must set `data-theme` in `<head>` synchronously:

```html
<script is:inline>
  const savedTheme = localStorage.getItem("theme") || "bethany";
  document.documentElement.setAttribute("data-theme", savedTheme);
</script>
```

## JS / React usage policy
This is a static site. Avoid client JavaScript wherever possible.

Allowed client-side JS:
- **Theme toggle**
- **Algolia search autocomplete**

Prefer:
- Build-time data (Astro `getCollection`, `getStaticPaths`)
- `<script is:inline>` for tiny interactions instead of full React islands
- The most restrictive `client:*` directive when islands are unavoidable

## Imports / alias
- Use `@/` to import from `web/src/` (configured via `tsconfig.json`).

## Formatting
- Run: `npx prettier --write web/src`
- Prettier config lives in `web/.prettierrc` (4-space indentation, Astro + Tailwind plugins).

