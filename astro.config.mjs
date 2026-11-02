// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import { getCspPolicy } from "./src/lib/csp-policy.mjs";

const cspPolicy = getCspPolicy(process.env);

export default defineConfig({
  site: "https://apotidev.org",
  adapter: cloudflare(),
  security: {
    csp: {
      directives: cspPolicy.directives.filter(
        (directive) =>
          !directive.startsWith("script-src ") &&
          !directive.startsWith("style-src ") &&
          !directive.startsWith("style-src-attr ") &&
          !directive.startsWith("frame-ancestors "),
      ),
      scriptDirective: { resources: cspPolicy.scriptSources },
      styleDirective: { resources: cspPolicy.styleSources },
    },
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes("/auth/") &&
        !page.includes("/dashboard/") &&
        !page.includes("/donate/thank-you") &&
        !/^https:\/\/apotidev\.org\/(?:fr\/)?stories\/[^/]+\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["stripe", "zod"],
    },
    ssr: {
      optimizeDeps: {
        exclude: ["stripe", "zod"],
      },
    },
  },
});
