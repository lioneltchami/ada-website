// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://apotidev.org",
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes("/auth/") &&
        !page.includes("/dashboard/") &&
        !page.includes("/donate/thank-you"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
