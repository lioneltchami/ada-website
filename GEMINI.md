# GEMINI.md - ADA Website (Apoti Dev)

This project is a modern, high-performance website for ADA (Apoti Dev), built with Astro, React, and Sanity CMS.

## Project Overview

*   **Framework:** [Astro](https://astro.build/) (v6+) using Server-Side Rendering (SSR).
*   **Adapter:** [Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) for deployment on Cloudflare Pages/Workers.
*   **Frontend Library:** [React](https://reactjs.org/) (v19+) used for interactive "islands".
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4+) via the Vite plugin.
*   **CMS:** [Sanity Studio](https://www.sanity.io/) (v3) located in the `/sanity` directory.
*   **Database & Auth:** [Supabase](https://supabase.com/).
*   **Payments:** [Stripe](https://stripe.com/) for handling donations.
*   **Internationalization:** Custom I18n setup in `src/i18n` supporting English (`en`) and French (`fr`).

## Directory Structure

*   `/src`: Main application source code.
    *   `/src/pages`: Astro routes (including `/fr` for French translations).
    *   `/src/components`: UI components (Astro and React).
    *   `/src/lib`: Logic for Sanity, Stripe, Supabase, and utilities.
    *   `/src/i18n`: Localization files and translation logic.
    *   `/src/layouts`: Base and Page layouts.
*   `/sanity`: Sanity Studio configuration, schemas, and seeding scripts.
*   `/public`: Static assets (images, icons, robots.txt).
*   `/docs`: Project-related documentation and annual reports (PDF/Markdown).

## Building and Running

### Main Application (Root)

| Command | Action |
| :--- | :--- |
| `npm install` | Install all dependencies. |
| `npm run dev` | Start the Astro development server at `http://localhost:4321`. |
| `npm run build` | Build the production site into `./dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run generate-types` | Generate TypeScript types for Cloudflare Wrangler. |

### Sanity Studio (`/sanity`)

| Command | Action |
| :--- | :--- |
| `cd sanity && npm install` | Install Sanity-specific dependencies. |
| `npm run dev` | Start Sanity Studio at `http://localhost:3333`. |
| `npm run build` | Build Sanity Studio for production. |
| `npm run deploy` | Deploy Sanity Studio to the Sanity cloud. |
| `npm run seed` | Seed the Sanity dataset with initial content. |

## Development Conventions

*   **Astro Islands:** Use React components only when client-side interactivity is required (e.g., `client:load`). Prefer static Astro components for SEO and performance.
*   **Styling:** Use Tailwind CSS v4 classes directly in `.astro` and React files. Global styles are managed in `src/styles/global.css`.
*   **Internationalization:**
    *   Translations are stored in `src/i18n/en.ts` and `src/i18n/fr.ts`.
    *   Use the `t(locale)` function to retrieve translations.
    *   The `getLocale(pathname)` helper identifies the current language from the URL.
*   **Data Fetching:**
    *   All Sanity GROQ queries and client logic reside in `src/lib/sanity.ts`.
    *   Environment variables like `SANITY_PROJECT_ID` should be set for production but have defaults for development.
*   **Types:** Rigorous TypeScript usage is encouraged. Sanity interfaces are defined in `src/lib/sanity.ts`.
*   **Formatting:** Prettier is configured with `prettier-plugin-astro` for consistent code style.

## Deployment

The site is configured for Cloudflare Pages. Routes and assets are managed via `wrangler.jsonc`. Ensure your environment variables (Stripe keys, Sanity IDs, Supabase URL) are configured in the Cloudflare dashboard.
