/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";

// Theme configuration is now handled in global.css using @plugin "daisyui/theme"

export default {
    content: {
        files: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    },
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    // daisyUI configuration is handled in global.css
};
