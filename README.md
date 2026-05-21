# ADA Website

Astro + Cloudflare site for Apoti Development Association, with Sanity content, Stripe donations, Supabase donor accounts, and bilingual public pages.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server |
| `npm test` | Run Vitest checks |
| `npm run build` | Build production output |
| `npm run preview` | Preview production build locally |

## Required Production Environment

| Variable | Purpose |
| :-- | :-- |
| `SANITY_TOKEN` | Sanity API token used for authenticated content reads during server builds |
| `PUBLIC_SITE_URL` | Allowed origin for payment API requests |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements client key |
| `STRIPE_SECRET_KEY` | Server-side Stripe API access |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook signatures |
| `RESEND_API_KEY` | Sends contact, newsletter, and donation receipt emails |
| `PUBLIC_SUPABASE_URL` | Supabase project URL for auth |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase browser/server auth key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for donation persistence and dashboard lookups |

Apply [supabase/donations.sql](/supabase/donations.sql) before enabling live Stripe webhooks so donation history can be persisted.

## Notes

Donation records are written from verified Stripe webhooks. Missing `RESEND_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` fails loudly in production so operational problems surface quickly instead of silently losing receipts or history.
