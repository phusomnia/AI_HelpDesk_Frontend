// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import pages from 'astro-pages';

const groupPattern = (/\/?\([^/]+?\)/g);

// https://astro.build/config
export default defineConfig({
    server: {
        port: 3000,
    },
    vite: {
        plugins: [tailwindcss()]
    },
    output: "server",
    integrations: [
        react(),
        // Pages
        pages({
            dir: "app",
            pattern: ({ pattern }) => {
                const group = pattern.replace(groupPattern, "");
                return group;
            },
            log: "verbose"
        })
    ]
});
