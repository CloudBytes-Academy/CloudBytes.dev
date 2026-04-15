/frontend-design 
I am tring to refactor this pelican blog into an astro project. 
The new project under @web is going to be
- **Framework**: Astro 6 with React 19 islands, Tailwind CSS v4 (via `@tailwindcss/vite`), and DaisyUI v5
- **Routing**: File-based under `web/src/pages/` (lowercase filenames by route)
- **Components**: `web/src/components/` — Astro components in `PascalCase`; 
- **Layouts**: `web/src/layouts/Layout.astro` — base page shell
- **Import alias**: Use `@/` for imports from `web/src/`
- **Formatting**: `npx prettier --write web/src` (prettier-plugin-astro + prettier-plugin-tailwindcss)

Additionally, 
Dark mode will be default. Use the following code as a sample to configure in layout
        <script is:inline>
            // Apply the saved theme immediately to prevent flash of unstyled content
            const savedTheme = localStorage.getItem("theme") || "business";
            document.documentElement.setAttribute("data-theme", savedTheme);
        </script>

## User browser
whenever making any design changes, ensure you rview is using @Browser tool

## Design guidelines
1. this is a static website so avoid using JS / React wherever possible. 

## Task
I want you to do the following
0. Create an AGENT.md file with the project information and coding standards
1. modify the @web/src/styles/global.css to match the current theme @design/alexis/static/css/style.css . name of the theme should be bethany
2. rebuild & modernise the theme @web/src/styles/global.css . 
3. build the layout #1 -> Layout (default), this will include the following
- a top navbar (instead of the current sidebar). This will include
  - logo with name on the left
  - categories -> dropdown
  - search bar
  - github link 
  - theme toggle
- the main content -> this will be a slot
- a sidebar on the right -> this will be a slot
- footer
3. build the layout #2 -> Page -> this will lsit all the articles so ability to fill the main slot with list of cards. Each card is name, description, and tags for a post (similar to @design/alexis/templates/page.html )
4. build the  layout  #3 (post) which will be used to show the article. THis will be similar to @design/alexis/templates/article.html . 
- a top navbar (same
5. Create a content system to match the existing setup
6. rebuild search feature using algolia 
7. We also need pagination where needed, e.g. on Page 

