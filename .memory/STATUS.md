# ADA Website - Project Memory

## Status: LIVE ✅
- **URL:** https://ada-website.apoti.workers.dev
- **Repo:** https://github.com/lioneltchami/ada-website
- **Sanity Studio:** https://ada-website.sanity.studio
- **Stack:** Astro 6 + React 19 + Tailwind v4 + Sanity CMS + Stripe + Resend + Cloudflare Workers

## Key Credentials (references only - actual values in Cloudflare secrets)
- Sanity Project ID: rj2m21gk
- Stripe Account: Kavora Systems (profile: ada)
- Cloudflare Account: apotitech (4d09fd6387eaad164e0236ab73ff09c7)
- Resend: configured (domain needs verification for production sending)

## What's Done
- 60+ pages (EN + FR bilingual)
- 12 Sanity schemas, 60+ documents
- Stripe payments (test mode) with PDF receipt emails
- 12 blog posts
- 14 gallery photos
- 5 team members with photos
- 6 projects with detailed descriptions + images
- Transparency & Partners pages (Canadian sponsor criteria 1-10)
- Newsletter + Contact form APIs (Resend)
- FAQ Chatbot
- Campaign progress bar
- Mobile floating donate button
- Non-blocking fonts, zero-JS static pages

## What's Next (Priority Order)

### HIGH - Next Session
1. **ADD REGISTRATION NUMBER** — Update /transparency page with actual NGO registration number (currently placeholder)
2. **Set up Sanity webhook** - Auto-rebuild on content change (so edits appear without manual deploy)
3. **Custom domain** - Point apotidev.org to Cloudflare Workers
4. **Switch Stripe to live mode** - When ready to accept real donations

### MEDIUM
5. **Real photos** - Replace Unsplash placeholders with actual ADA program photos
6. **Umami analytics** - Set up at cloud.umami.is, add PUBLIC_UMAMI_WEBSITE_ID
7. **Supabase** - For form data persistence (contact submissions, newsletter list, volunteer applications)
8. **More blog content** - Regular posting schedule for SEO

### LOW
9. **Video support** - YouTube embeds in gallery
10. **Lightbox** - Click-to-enlarge on gallery photos
11. **Dark mode** - Optional
12. **PWA/Service Worker** - Offline support for African mobile users

## Architecture Notes
- All content editable via Sanity Studio (no code changes needed)
- Fallback data in code if Sanity is unreachable
- French pages mirror English 1:1 (except blog content stays in English from CMS)
- Images served from Sanity CDN (cdn.sanity.io)
- API routes run on Cloudflare Workers (SSR)
- Static pages are zero-JS (except /donate which loads Stripe)

## Sanity Schemas
project, siteSettings, homePage, aboutPage, impactMetric, volunteerRole, donationTier, teamMember, galleryImage, testimonial, faqResponse, blogPost

## Secrets on Cloudflare
STRIPE_SECRET_KEY, PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, SANITY_PROJECT_ID, SANITY_DATASET, PUBLIC_SITE_URL
