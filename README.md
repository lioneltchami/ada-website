# ADA Website

Production website for Apoti Development Association, available at [apotidev.org](https://apotidev.org).

This is a bilingual Astro + Cloudflare site with Sanity CMS content, Stripe donations, Supabase donor accounts/history, project archive documentation, and date-based project lifecycle behavior.

## What This Site Does

The website is built to support ADA's public-facing needs:

- Explain ADA's mission, leadership, programs, governance, and transparency model.
- Present active projects and donation campaigns.
- Automatically age projects from active/current into completed/archive-style presentation based on project dates.
- Accept one-time and monthly Stripe donations.
- Send contact, newsletter, and donation receipt emails.
- Store verified donation history in Supabase.
- Let donors sign in and view their donation history.
- Publish bilingual English/French pages.
- Publish annual reports, project reports, financial reports, Terms of Reference documents, and policies.
- Deploy to Cloudflare through GitHub Actions.

## Technology Stack

| Layer          | Technology                  | Purpose                                                          |
| :------------- | :-------------------------- | :--------------------------------------------------------------- |
| Site framework | Astro 6                     | Static/server-rendered pages and API routes                      |
| UI islands     | React 19                    | Interactive forms: donations, auth, newsletter, gallery lightbox |
| Styling        | Tailwind CSS 4              | Utility styling through Vite integration                         |
| CMS            | Sanity                      | Editable content, project data, team, stories, gallery, metrics  |
| Payments       | Stripe                      | One-time donations, monthly subscriptions, webhooks              |
| Donor data     | Supabase                    | Auth and persisted donation history                              |
| Email          | Resend-compatible API       | Contact emails, newsletter confirmations, receipts               |
| Hosting        | Cloudflare Workers + assets | Production runtime and static assets                             |
| CI/CD          | GitHub Actions              | Tests, builds, scheduled lifecycle refresh, Cloudflare deploy    |
| Tests          | Vitest                      | Unit tests for API helpers, donations, receipts, lifecycle       |

## Project Structure

```text
.
├── .github/workflows/
│   ├── ci.yml                  # Test/build workflow for pushes and PRs
│   └── deploy.yml              # Cloudflare deploy workflow plus biweekly scheduled refresh
├── public/
│   ├── _headers                # Cloudflare/static header rules
│   ├── docs/                   # Annual reports, project PDFs, policies
│   ├── favicon.*               # Site icons
│   └── robots.txt
├── sanity/
│   ├── sanity.config.ts        # Sanity Studio configuration
│   ├── schemas/                # CMS document schemas
│   └── seed*.ts                # Historical seed/translation scripts
├── src/
│   ├── components/
│   │   ├── islands/            # React interactive components
│   │   ├── layout/             # Header, footer, sections, page hero
│   │   └── resources/          # Resource/document library UI
│   ├── data/                   # Local organization constants and fallback project data
│   ├── i18n/                   # English/French labels and locale helpers
│   ├── layouts/                # Base HTML/SEO layout and page shell
│   ├── lib/                    # Sanity, Stripe, Supabase, lifecycle, email, helpers
│   ├── middleware.ts           # Security headers and auth-sensitive route behavior
│   └── pages/                  # Astro pages and API routes
├── supabase/
│   └── donations.sql           # Donation table, index, RLS policy, trigger
├── tests/                      # Vitest test suites
├── astro.config.mjs
├── wrangler.jsonc
└── package.json
```

## Core Concepts

### Astro Pages

Most public pages are Astro files under `src/pages`.

Important route groups:

| Route                      | Source                                    | Purpose                                          |
| :------------------------- | :---------------------------------------- | :----------------------------------------------- |
| `/`                        | `src/pages/index.astro`                   | English homepage                                 |
| `/fr/`                     | `src/pages/fr/index.astro`                | French homepage                                  |
| `/projects`                | `src/pages/projects/index.astro`          | Current projects and recently completed projects |
| `/fr/projects`             | `src/pages/fr/projects/index.astro`       | French project listing                           |
| `/projects/[slug]`         | `src/pages/projects/[slug].astro`         | Current project detail pages                     |
| `/projects/archive`        | `src/pages/projects/archive/index.astro`  | Project archive / track record                   |
| `/projects/archive/[slug]` | `src/pages/projects/archive/[slug].astro` | Archive project record detail                    |
| `/donate`                  | `src/pages/donate.astro`                  | Donation page                                    |
| `/sponsor`                 | `src/pages/sponsor.astro`                 | Sponsor conversion path and sponsor packet CTA   |
| `/partners`                | `src/pages/partners.astro`                | Deeper funder/institutional partnership page     |
| `/auth/*`                  | `src/pages/auth/*`                        | Donor auth screens                               |
| `/dashboard/*`             | `src/pages/dashboard/*`                   | Donor dashboard                                  |
| `/api/*`                   | `src/pages/api/*`                         | Server API routes                                |

Astro builds many pages ahead of time. Dynamic project/story pages use `getStaticPaths()`, so changes in Sanity or dates become visible after a rebuild/deploy.

### React Islands

Astro renders static/server HTML by default. React is only used where interactivity is needed:

| Component              | Purpose                                  |
| :--------------------- | :--------------------------------------- |
| `DonationForm.tsx`     | Stripe Elements donation flow            |
| `NewsletterSignup.tsx` | Newsletter form                          |
| `LoginForm.tsx`        | Supabase email/password login            |
| `RegisterForm.tsx`     | Supabase signup                          |
| `PhotoLightbox.tsx`    | Gallery/archive photo lightbox           |
| `Chatbot.tsx`          | FAQ/chat interaction if enabled on pages |

## Content Sources

The site uses three content layers:

1. **Sanity CMS**
   - Primary editable content.
   - Used for projects, project records, homepage fields, impact metrics, team, testimonials, gallery, stories, site settings, donation tiers, FAQs, etc.

2. **Local TypeScript data**
   - Stable organization constants and fallbacks.
   - Example: `src/data/impact.ts` is the single source of truth for public impact numbers (homepage fallbacks, transparency progress, scorecard, Sanity seed metrics).
   - Example: `src/data/organization.ts` stores registration number, annual report paths, archive project slugs, and breadcrumb labels.
   - Example: `src/data/projects.ts` is fallback project data if Sanity is unavailable during build.
   - Partners/transparency page copy lives in `src/data/partners-copy.ts` and `src/data/transparency-copy.ts` (shared EN/FR components).

3. **Static documents in `public/docs`**
   - Annual reports, project reports, financial reports, Terms of Reference, policies, registration certificate.
   - These files are served directly as static assets and are canonical for project PDFs (Sanity `projectRecord` holds metadata/photos; archive pages resolve to `/docs/projects/{slug}/…` when present).
   - Project document grouping is handled by `src/lib/project-archive.ts`.

## Sanity CMS

### Sanity Client

Sanity access is centralized in `src/lib/sanity.ts`.

It uses:

- `SANITY_PROJECT_ID`, defaulting to `rj2m21gk`
- `SANITY_DATASET`, defaulting to `production`
- `SANITY_TOKEN` or `SANITY_API_TOKEN`
- `apiVersion: 2026-03-28`

When a token exists, `useCdn` is disabled so builds receive fresh authenticated reads. Without a token, the client uses the CDN.

### Key Sanity Schemas

| Schema          | File                              | Purpose                                                    |
| :-------------- | :-------------------------------- | :--------------------------------------------------------- |
| `project`       | `sanity/schemas/project.ts`       | Current/fundraising project records                        |
| `projectRecord` | `sanity/schemas/projectRecord.ts` | Archive/track-record project records                       |
| `blogPost`      | `sanity/schemas/blogPost.ts`      | Stories/news/blog content                                  |
| `galleryImage`  | `sanity/schemas/galleryImage.ts`  | Gallery content                                            |
| `homePage`      | `sanity/schemas/homePage.ts`      | Core homepage copy                                         |
| `aboutPage`     | `sanity/schemas/aboutPage.ts`     | About page content                                         |
| `impactMetric`  | `sanity/schemas/impactMetric.ts`  | Homepage counters (keep aligned with `src/data/impact.ts`) |
| `testimonial`   | `sanity/schemas/testimonial.ts`   | Featured impact quotes                                     |
| `teamMember`    | `sanity/schemas/teamMember.ts`    | Team profiles                                              |
| `donationTier`  | `sanity/schemas/donationTier.ts`  | Donation impact examples                                   |
| `siteSettings`  | `sanity/schemas/siteSettings.ts`  | Contact/social/settings                                    |
| `faqResponse`   | `sanity/schemas/faqResponse.ts`   | FAQ/chat responses                                         |

## Project Lifecycle

Yes: project movement is **a date-based lifecycle computed by the website whenever project data is fetched/rendered**.

This means:

- Sanity stores project facts and dates.
- The website computes the public-facing effective status from those dates.
- The public static site changes after rebuilds.
- The GitHub deploy workflow runs on a biweekly schedule gate so date-based changes become visible automatically.
- Sanity is not rewritten every day by a bot.

### Two Project Models

There are two related but different project document types:

| Type            | Meaning                                    | Public location                                 |
| :-------------- | :----------------------------------------- | :---------------------------------------------- |
| `project`       | Current/fundraising project or campaign    | `/projects`, `/projects/[slug]`                 |
| `projectRecord` | Historical/archive project evidence record | `/projects/archive`, `/projects/archive/[slug]` |

This separation is intentional:

- A `project` is donor-facing and campaign-oriented.
- A `projectRecord` is evidence-facing and can hold outcomes, photos, final report, financial report, and Terms of Reference.

### Current Project Lifecycle Fields

Current `project` documents support:

| Field                     | Purpose                                                                         |
| :------------------------ | :------------------------------------------------------------------------------ |
| `status`                  | Editorial/manual status: `active`, `completed`, or `paused`                     |
| `demographic`             | Archive grouping: widows, orphans, young women, pregnant women, IDPs, community |
| `startDate`               | When the project starts or started                                              |
| `endDate`                 | When the project itself ends                                                    |
| `archiveAfterDate`        | Optional date after which the public site should treat it as completed          |
| `autoArchiveAfterEndDate` | Turn off only when a project should remain active after its date passes         |
| `archiveRecord`           | Strict link to the final archive record for this exact project/campaign         |

### Archive Record Fields

`projectRecord` documents support:

| Field                   | Purpose                                                  |
| :---------------------- | :------------------------------------------------------- |
| `sourceProject`         | Optional link back to the program family/current project |
| `year`                  | Archive timeline grouping                                |
| `status`                | Archive status: `completed`, `ongoing`, or `planned`     |
| `demographic`           | Archive filtering                                        |
| `startDate` / `endDate` | Project record dates                                     |
| `beneficiaries`         | People reached                                           |
| `budget`                | USD budget/investment                                    |
| `termsOfReference`      | PDF file                                                 |
| `finalReport`           | PDF file                                                 |
| `financialReport`       | PDF file                                                 |
| `photo` / `photos`      | Project image and gallery                                |
| `outcomes`              | Key outcomes                                             |

### Effective Status Rules

The rules live in `src/lib/project-lifecycle.ts`.

The core logic:

```text
completionDate = archiveAfterDate || endDate

if status is active
and autoArchiveAfterEndDate is not false
and completionDate is before today
then effectiveStatus = completed
else effectiveStatus = status
```

Important details:

- Dates are compared as `YYYY-MM-DD` strings, not loosely with `new Date(...)`, to avoid timezone surprises.
- A project ending today remains active for the day. It becomes completed the day after.
- `archiveAfterDate` can delay completion after `endDate`.
- `autoArchiveAfterEndDate: false` preserves editorial control.
- `paused` remains paused, even if dates pass.
- `completed` remains completed, even if dates are future.

### Where Lifecycle Is Used

| Area                                           | Behavior                                                                                       |
| :--------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `/projects` and `/fr/projects`                 | Main grid shows non-completed projects; completed projects move to “Recently completed”        |
| `/projects/[slug]` and `/fr/projects/[slug]`   | Completed projects show completion copy and stop project-specific donation CTAs                |
| `/projects/archive` and `/fr/projects/archive` | Includes full archive records and date-completed current projects without final archive record |
| `/donate` and `/fr/donate`                     | Donation project dropdown only includes effectively active projects                            |
| Footer                                         | Program links only include effectively active projects                                         |

### Archive Links vs Source Links

There are two relationship fields, and they mean different things:

- `projectRecord.sourceProject`
  - Broad relationship.
  - Means “this archive record belongs to this program family.”
  - Example: multiple widow archive records can point to `Widow Support Program`.

- `project.archiveRecord`
  - Strict final-report relationship.
  - Means “this archive record is the final report page for this exact current project/campaign.”
  - Only set this when the final archive record is accurate and ready.

Do not use `archiveRecord` for loose program-family relationships. It changes visitor CTAs and can send people to a misleading report.

### Biweekly Lifecycle Refresh

The deploy workflow in `.github/workflows/deploy.yml` has a scheduled trigger:

```yaml
schedule:
  - cron: "15 23 * * 0"
```

This weekly cron acts as a gate for a biweekly refresh. On even ISO weeks, it rebuilds/redeploys the site shortly after the weekly UTC trigger, which keeps date-based project lifecycle behavior fresh without running every week.

The lifecycle is:

```text
Sanity dates -> Astro build computes effective status -> Cloudflare deploy publishes refreshed pages
```

It is not:

```text
Bot edits Sanity statuses every day
```

## Donations And Stripe

### User Flow

1. Visitor opens `/donate` or `/fr/donate`.
2. `DonationForm.tsx` lets them select:
   - one-time or monthly
   - amount
   - project
   - donor name/email
   - anonymous option
3. The form calls:
   - `/api/create-payment-intent` for one-time gifts
   - `/api/create-subscription` for monthly gifts
4. Stripe Elements collects payment details.
5. Stripe redirects to `/donate/thank-you`.
6. Stripe webhook confirms payment server-side.
7. Verified webhook writes donation history to Supabase, sends the receipt/thank-you email, and marks the gift for a 30-day impact follow-up.

### Payment API Routes

| Route                             | File                                     | Purpose                                                            |
| :-------------------------------- | :--------------------------------------- | :----------------------------------------------------------------- |
| `POST /api/create-payment-intent` | `src/pages/api/create-payment-intent.ts` | Creates Stripe PaymentIntent for one-time donation                 |
| `POST /api/create-subscription`   | `src/pages/api/create-subscription.ts`   | Creates Stripe customer/subscription for monthly donation          |
| `POST /api/webhooks/stripe`       | `src/pages/api/webhooks/stripe.ts`       | Verifies Stripe signatures and handles completed payments/invoices |
| `POST /api/performance-metrics`   | `src/pages/api/performance-metrics.ts`   | Receives sampled Core Web Vitals from the browser                  |

### Payment Security

The payment/contact/newsletter API routes use shared helpers in `src/lib/api-requests.ts`:

- Reject invalid origins.
- Reject oversized bodies.
- Parse JSON safely.
- Return JSON responses consistently.

Origin checking is implemented in `src/lib/origin.ts`.

### Stripe Webhook Events

The webhook handles:

- `payment_intent.succeeded`
- `invoice.payment_succeeded`

Webhook security:

- Requires `stripe-signature`.
- Requires `STRIPE_WEBHOOK_SECRET`.
- Verifies HMAC signature before trusting the event.
- Handles malformed JSON only after signature validation.

### Donation Persistence

Donation mapping and persistence lives in `src/lib/donations.ts`.

One-time donations become records from Stripe PaymentIntents.
Monthly donations become records from paid invoices.

Records are upserted into Supabase by:

- `stripe_payment_intent_id`, or
- `stripe_invoice_id`

That protects against duplicate webhook deliveries.

The donation record also tracks:

- `receipt_id`
- `locale`
- `thank_you_sent_at`
- `follow_up_due_at`
- `follow_up_status`

This powers the post-donation follow-up sequence:

1. A verified Stripe event creates or updates the donation record.
2. The donor receives one locale-aware email containing the PDF receipt, thank-you, "what happens next," and the expected 30-day update date.
3. ADA receives an internal follow-up task email with the donor, amount, project, receipt ID, Stripe reference, and due date.
4. Thank-you emails are claim-locked via `thank_you_sent_at` before send, so Stripe retries and concurrent deliveries cannot double-email. Failed sends clear the claim so Stripe can retry.

The site does not pretend to have a full external CRM queue by itself. The reliable automation implemented here is webhook-backed recording plus immediate donor/admin follow-up. The actual 30-day impact message still needs ADA staff or a future email automation platform to send the field update, unless a scheduled worker/CRM is added later.

## Supabase

Supabase is used for:

- Donor authentication.
- Donation history storage.
- Dashboard donation lookup.

### Database Setup

Before using live Stripe webhooks, apply:

```text
supabase/donations.sql
```

That migration creates:

- `public.donations`
- unique Stripe ID columns
- donor email/date index
- follow-up due-date index
- row-level security
- policy allowing donors to read their own donations
- `updated_at` trigger

### Supabase Auth

Client auth happens in:

- `src/components/islands/LoginForm.tsx`
- `src/components/islands/RegisterForm.tsx`

Server/session routes:

| Route                   | Purpose                                          |
| :---------------------- | :----------------------------------------------- |
| `/api/auth/set-session` | Stores Supabase access/refresh tokens in cookies |
| `/api/auth/logout`      | Clears cookies and signs out                     |
| `/api/auth/profile`     | Updates profile metadata for signed-in donor     |

Dashboard pages use the cookie/session data to show donor-specific pages.

## Email And Receipts

Email helpers live in `src/lib/email.ts`.

The site sends:

- contact notifications
- newsletter confirmations
- donation receipt/thank-you emails
- internal 30-day donation follow-up task emails

Donation receipt HTML/PDF support lives in `src/lib/receipt.ts`.

In production, missing email/Supabase settings should fail loudly rather than silently losing receipts or donation history.

## Performance Monitoring

`src/layouts/BaseLayout.astro` includes a small no-dependency browser beacon for sampled Core Web Vitals:

- TTFB
- FCP
- LCP
- CLS
- INP when supported by the browser

The beacon posts only compact technical metrics to `/api/performance-metrics`:

- metric name/value/rating
- path
- mobile/desktop classification
- browser connection type when available

No donor name, email, amount, payment details, or query string is sent. Cloudflare observability is also enabled in `wrangler.jsonc`, so these metrics can be reviewed through Worker logs/observability without adding visible page weight.

## Public Documents And Resource Library

The `public/docs` folder contains:

- annual reports
- project Terms of Reference
- project financial reports
- project completion/final reports
- policies
- sponsor readiness packet

The resource library is powered by:

- `src/lib/project-archive.ts`
- `src/components/resources/DocumentLibrary.astro`
- `src/pages/resources.astro`
- `src/pages/fr/resources.astro`

`src/data/organization.ts` contains the list of archive project slugs used to group and display project document bundles.

## Bilingual System

The site supports English and French.

English routes are at root:

```text
/about
/projects
/donate
```

French routes are under `/fr`:

```text
/fr/about
/fr/projects
/fr/donate
```

Locale utilities live in `src/i18n`.

Important files:

- `src/i18n/en.ts`
- `src/i18n/fr.ts`
- `src/i18n/index.ts`

`PageLayout.astro` and `BaseLayout.astro` handle localized layout behavior, SEO metadata, hreflang alternates, and floating donate button visibility.

## SEO, Metadata, And Security Headers

### SEO

`src/layouts/BaseLayout.astro` manages:

- title and description
- Open Graph metadata
- Twitter metadata
- canonical URLs
- hreflang alternates
- robots/noindex behavior

Sitemap generation is configured in `astro.config.mjs`.

The sitemap excludes:

- auth pages
- dashboard pages
- donation thank-you page

### Security Headers

`src/middleware.ts` adds response security headers.

`public/_headers` contains Cloudflare/static header rules.

Sensitive routes such as auth/dashboard/thank-you receive noindex behavior where appropriate.

## Cloudflare Hosting

The site deploys to Cloudflare using the Astro Cloudflare adapter.

Important files:

- `astro.config.mjs`
- `wrangler.jsonc`
- `.github/workflows/deploy.yml`

`wrangler.jsonc` defines:

- Worker name: `ada-website`
- Worker entrypoint from Astro
- static asset directory: `dist/client`
- routes:
  - `apotidev.org/*`
  - `www.apotidev.org/*`
- observability enabled

## GitHub Actions

### CI

Workflow: `.github/workflows/ci.yml`

Runs on:

- pushes to `main`
- pull requests to `main`

Steps:

1. checkout
2. setup Node 22
3. `npm ci`
4. `npm test`
5. `npm run build`
6. verify at least 20 HTML pages were generated

### Deploy

Workflow: `.github/workflows/deploy.yml`

Runs on:

- successful `CI` runs on `main` via `workflow_run`
- `repository_dispatch` event `sanity-content-update`
- manual workflow dispatch
- biweekly schedule gate

Steps:

1. checkout the exact CI-passed commit for `workflow_run` runs
2. setup Node 22
3. `npm ci`
4. `npm run build`
5. deploy with `cloudflare/wrangler-action`

The biweekly schedule gate is important for date-based project lifecycle refreshes.

## Environment Variables

### Required For Production

| Variable                        | Purpose                                                            |
| :------------------------------ | :----------------------------------------------------------------- |
| `SANITY_PROJECT_ID`             | Sanity project ID                                                  |
| `SANITY_DATASET`                | Sanity dataset, normally `production`                              |
| `SANITY_TOKEN`                  | Authenticated Sanity reads during builds                           |
| `PUBLIC_SITE_URL`               | Expected public origin, used for API origin checks                 |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements browser key                                        |
| `STRIPE_SECRET_KEY`             | Server-side Stripe API key                                         |
| `STRIPE_WEBHOOK_SECRET`         | Stripe webhook signature verification secret                       |
| `RESEND_API_KEY`                | Email sending API key                                              |
| `FROM_EMAIL`                    | Sender identity for emails                                         |
| `PUBLIC_SUPABASE_URL`           | Supabase URL for client/server auth                                |
| `PUBLIC_SUPABASE_ANON_KEY`      | Supabase anonymous key                                             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only Supabase key for donation persistence/dashboard lookup |
| `DONATION_FOLLOWUP_CRON_SECRET` | Bearer secret for the 30-day donation follow-up cron endpoint      |
| `CLOUDFLARE_API_TOKEN`          | GitHub Actions deploy to Cloudflare                                |
| `CLOUDFLARE_ACCOUNT_ID`         | Cloudflare account for deploy workflow                             |

### Optional/Related

| Variable                        | Purpose                                                       |
| :------------------------------ | :------------------------------------------------------------ |
| `SANITY_API_TOKEN`              | Legacy/fallback token name; `SANITY_TOKEN` is preferred       |
| `SUPABASE_URL`                  | Server-side fallback if `PUBLIC_SUPABASE_URL` is not used     |
| `PUBLIC_UMAMI_WEBSITE_ID`       | Umami analytics website ID                                    |
| `PUBLIC_UMAMI_URL`              | Umami script URL                                              |
| `PUBLIC_WEB_VITALS_SAMPLE_RATE` | Optional browser performance sampling rate, defaults to `0.2` |

### Local `.env`

`.env` is ignored by git and should never be committed.

Use `.env.example` as the template.

## Local Development

### Requirements

- Node.js `>=22.12.0`
- npm
- Access to Sanity project if working with live content
- Stripe/Supabase credentials if testing payments/auth

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

Default Astro dev URL:

```text
http://localhost:4321
```

### Run Tests

```bash
npm test
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Common Workflows

### Add Or Update A Current Project

In Sanity, edit/create a `project` document.

Required/important fields:

- title
- slug
- status
- demographic
- location
- description
- beneficiaries
- goal amount
- raised amount
- main image with alt text
- start date
- end date if there is a known campaign/project end
- archive after date if completion should be delayed
- auto-complete enabled unless there is a reason not to

If the project should be donation-selectable, its effective status must be active.

### Complete A Project

Recommended flow:

1. Set or confirm `endDate`.
2. Set `archiveAfterDate` if reporting needs a grace period.
3. Leave `autoArchiveAfterEndDate` enabled.
4. Create a `projectRecord` when final evidence is ready.
5. Upload Terms of Reference, final report, financial report, photos, and outcomes.
6. Link `project.archiveRecord` only when the record is the exact final archive page.

The website will stop treating the project as actively fundraiseable once the computed completion date passes.

### Add A Project Archive Record

In Sanity, create a `projectRecord`.

Set:

- title
- slug
- source project, if related to a current/fundraising project family
- demographic
- year
- status
- location
- start/end dates
- beneficiaries
- budget
- description
- outcomes
- project photo/photos
- Terms of Reference PDF
- final report PDF
- financial report PDF

### Add Static Project Documents

Static documents live under:

```text
public/docs/projects/{project-slug}/
```

Typical files:

```text
tor.md
tor.pdf
financial.md
financial.pdf
report.md
report.pdf
```

If the document bundle should appear in the resource library, ensure the slug is listed in `documentArchiveProjects` in `src/data/organization.ts`.

### Update Homepage Copy

Some homepage content comes from Sanity `homePage`.

Some newer trust/credibility sections are local arrays inside:

- `src/pages/index.astro`
- `src/pages/fr/index.astro`

This was intentional to avoid overcomplicating the CMS until those sections are stable.

### Update Donation Options

Donation project options are derived from Sanity `project` documents whose effective lifecycle status is active.

Donation impact tiers come from Sanity `donationTier`.

If a project no longer appears in the donation dropdown, check:

- `status`
- `endDate`
- `archiveAfterDate`
- `autoArchiveAfterEndDate`

### Update Donor Dashboard

Donation history comes from Supabase records created by verified Stripe webhooks.

If a donor cannot see donations:

1. Confirm the donor is logged in with the same email used for the donation.
2. Confirm Stripe webhook delivered successfully.
3. Confirm donation exists in Supabase.
4. Confirm Supabase RLS policy is active.

## API Routes

| Route                        | Method | Purpose                           |
| :--------------------------- | :----- | :-------------------------------- |
| `/api/create-payment-intent` | POST   | Create Stripe PaymentIntent       |
| `/api/create-subscription`   | POST   | Create Stripe subscription        |
| `/api/webhooks/stripe`       | POST   | Handle verified Stripe webhooks   |
| `/api/contact`               | POST   | Send contact message notification |
| `/api/newsletter`            | POST   | Newsletter signup confirmation    |
| `/api/auth/set-session`      | POST   | Store Supabase session cookies    |
| `/api/auth/logout`           | POST   | Clear session cookies             |
| `/api/auth/profile`          | POST   | Update donor profile              |

Runtime API routes use `export const prerender = false`.

## Testing

Tests are in `tests/`.

Current coverage includes:

- API route request validation
- origin handling
- Stripe webhook signature verification
- donation record mapping
- receipt helpers
- email helpers
- project lifecycle date logic

Run all tests:

```bash
npm test
```

The project lifecycle tests are especially important because date logic affects donations, project listings, and archive behavior.

## Deployment Checklist

Before pushing to `main`:

1. Run tests.

```bash
npm test
```

2. Run a production build.

```bash
npm run build
```

3. Check `git status`.

```bash
git status --short
```

4. Ensure no secrets are staged.

Useful scan pattern:

```bash
rg -n "(sk_live|sk_test|SANITY_TOKEN=.+\\S|STRIPE_SECRET_KEY=.+\\S|SUPABASE_SERVICE_ROLE_KEY=.+\\S|BEGIN (RSA|OPENSSH|PRIVATE)|ghp_|xoxb-)" . --glob '!node_modules/**' --glob '!dist/**' --glob '!sanity/node_modules/**' --glob '!.git/**'
```

5. Commit and push to `main`.

GitHub Actions will run CI and deploy.

## Troubleshooting

### Project Did Not Move To Completed

Check the Sanity `project` document:

- Is `status` `active`?
- Is `endDate` or `archiveAfterDate` set?
- Is the date before today?
- Is `autoArchiveAfterEndDate` enabled?
- Has the site rebuilt since the date passed?

Remember: the website computes lifecycle status during build/render. Static public pages need a rebuild.

### Project Still Appears In Donation Dropdown

The project is still effectively active.

Check:

- `status`
- `archiveAfterDate`
- `endDate`
- `autoArchiveAfterEndDate`
- last successful deploy time

### Archive Record Exists But Project Does Not Link To It

Check whether `project.archiveRecord` is set.

`projectRecord.sourceProject` alone is not enough for final-report CTAs. It only means the archive record belongs to that program family.

### Donation Payment Fails

Check:

- `PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- API origin via `PUBLIC_SITE_URL`
- browser console/network response
- Stripe dashboard logs

### Donation Paid But Not In Dashboard

Check:

- Stripe webhook endpoint is configured.
- `STRIPE_WEBHOOK_SECRET` matches the endpoint.
- Webhook delivery succeeded.
- `SUPABASE_SERVICE_ROLE_KEY` exists in production.
- `supabase/donations.sql` was applied.
- Donor dashboard login email matches donation email.

### Build Fails On Sanity

Check:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_TOKEN`
- schema fields for recently edited content
- missing required image alt text

### Daily Lifecycle Did Not Refresh

Check:

- GitHub Actions `Deploy on Content Change` workflow.
- Scheduled run exists and succeeded.
- Cloudflare deploy completed.
- Public site cache/header behavior.

## Important Safety Notes

- Do not commit `.env`, `.dev.vars`, API keys, or Sanity tokens.
- Do not set `project.archiveRecord` unless the archive record is the exact final report page for that current project.
- Do not treat `sourceProject` and `archiveRecord` as interchangeable.
- Do not advertise tax-deductible donation language unless registration/fiscal sponsorship is confirmed.
- Do not promise sponsor benefits beyond agreed recognition, useful reporting, and documented stewardship.
- Do not reintroduce live donation totals unless they are sourced and reconciled.
- Do not mutate Sanity lifecycle status from the website runtime; compute effective status from dates.
- Keep English and French project behavior in parity.

## Current Manual Operations

These still require human/administrator action:

- Creating final project reports.
- Uploading PDFs and photos.
- Linking exact final `archiveRecord` entries.
- Configuring Stripe products/prices/webhooks in Stripe.
- Applying Supabase SQL migrations.
- Managing production secrets in GitHub/Cloudflare.
- Confirming legal/tax wording for donation pages.

## High-Level Data Flow

```text
Sanity CMS
  -> Astro build fetches content
  -> project lifecycle helper computes effective status
  -> Astro generates pages
  -> GitHub Actions deploys to Cloudflare
  -> visitors browse/donate
  -> Stripe confirms payment via webhook
  -> Supabase stores donation record
  -> email helper sends receipt and 30-day follow-up task
  -> donor dashboard reads donation history
```

## Key Files To Know

| File                                        | Why it matters                                   |
| :------------------------------------------ | :----------------------------------------------- |
| `src/lib/sanity.ts`                         | Sanity client, types, fetch helpers              |
| `src/lib/project-lifecycle.ts`              | Date-based current/completed project rules       |
| `src/pages/projects/index.astro`            | English project listing                          |
| `src/pages/fr/projects/index.astro`         | French project listing                           |
| `src/pages/projects/archive/index.astro`    | English archive timeline                         |
| `src/pages/fr/projects/archive/index.astro` | French archive timeline                          |
| `src/components/islands/DonationForm.tsx`   | Donation UI and Stripe Elements flow             |
| `src/pages/api/webhooks/stripe.ts`          | Stripe webhook verification and persistence      |
| `src/lib/donations.ts`                      | Stripe-to-Supabase donation mapping              |
| `src/lib/email.ts`                          | Email sending                                    |
| `src/lib/receipt.ts`                        | Donation receipt HTML/PDF helpers                |
| `src/middleware.ts`                         | Security headers and route behavior              |
| `sanity/schemas/project.ts`                 | Current project CMS model                        |
| `sanity/schemas/projectRecord.ts`           | Archive record CMS model                         |
| `.github/workflows/deploy.yml`              | Cloudflare deploy and biweekly lifecycle refresh |
| `supabase/donations.sql`                    | Donation persistence database setup              |
