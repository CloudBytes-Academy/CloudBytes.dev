/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
        testTimeout: 60000,
    },
});

