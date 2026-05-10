# Sanity CMS Migration Plan — ADA Website

> **Project:** Apoti Development Association website
> **Sanity Project ID:** `rj2m21gk`
> **Dataset:** `production`
> **Estimated Duration:** 2-3 hours
> **Date:** May 2026

---

## Overview

Migrate all hardcoded content from Astro page templates into Sanity CMS so the ADA team can edit content without code changes.

### Current State
- All content is hardcoded in `.astro` files and `src/data/projects.ts`
- Sanity account exists but has no schemas or content
- `src/lib/sanity.ts` has a client configured but unused

### Target State
- 8 Sanity schemas deployed
- 23 initial documents seeded
- Astro pages fetch from Sanity at build time
- `src/data/projects.ts` becomes a fallback only

---

## Schemas to Create (8 total)

### 1. `project` (6 records)

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| title | string | ✅ | e.g. "Widow Support Program" |
| slug | slug | ✅ | Source: title. URL key |
| status | string | ✅ | Options: active, completed, paused |
| location | string | ✅ | e.g. "Bamenda" |
| description | text | ✅ | Plain text, max 500 chars |
| beneficiaries | number | ✅ | Integer |
| goalAmount | number | ✅ | USD |
| raisedAmount | number | ✅ | USD |
| mainImage | image | | With hotspot + alt |
| isFeatured | boolean | | Default false |
| sortOrder | number | | Display order |

### 2. `siteSettings` (1 singleton)

| Field | Type | Notes |
|-------|------|-------|
| siteName | string | "Apoti Development Association" |
| tagline | text | Footer/meta description |
| contactEmail | string | info@apotidev.org |
| contactPhone | string | +237 676 282 346 |
| officeHours | string | "Mon–Fri, 8AM–5PM CAT" |
| socialFacebook | url | https://facebook.com/apotidev |
| socialInstagram | url | https://instagram.com/apotidev |
| socialTwitter | url | https://twitter.com/apotidev |

### 3. `impactMetric` (4 records)

| Field | Type | Notes |
|-------|------|-------|
| label | string | e.g. "Lives Impacted" |
| value | number | e.g. 200 |
| suffix | string | e.g. "+" |
| displayOrder | number | Sort order |

### 4. `volunteerRole` (6 records)

| Field | Type | Notes |
|-------|------|-------|
| title | string | e.g. "Community Outreach Coordinator" |
| description | text | Role description |
| timeCommitment | string | e.g. "10-15 hrs/week" |
| location | string | Options: On-site, Remote |
| isActive | boolean | Default true |
| sortOrder | number | Display order |

### 5. `donationTier` (6 records)

| Field | Type | Notes |
|-------|------|-------|
| amount | number | Dollar amount |
| impactDescription | string | e.g. "School supplies for 2 children" |
| sortOrder | number | Display order |

### 6. `teamMember` (0 records initially)

| Field | Type | Notes |
|-------|------|-------|
| name | string | Required |
| role | string | Job title |
| bio | text | Short bio |
| photo | image | With hotspot + alt |
| isActive | boolean | Default true |
| sortOrder | number | Display order |

### 7. `galleryImage` (0 records initially)

| Field | Type | Notes |
|-------|------|-------|
| title | string | Caption |
| photo | image | Required, with hotspot + alt |
| category | string | Options: food-distribution, skills-training, education, community |
| dateTaken | date | Optional |

### 8. `testimonial` (0 records initially)

| Field | Type | Notes |
|-------|------|-------|
| name | string | Beneficiary name |
| quote | text | Testimonial text |
| location | string | e.g. "Bamenda" |
| program | string | Which program helped them |
| photo | image | Optional |
| isFeatured | boolean | Show on homepage |

---

## Data to Seed (23 documents)

### Projects (6)

| slug | title | status | location | beneficiaries | goal | raised |
|------|-------|--------|----------|:-------------:|:----:|:------:|
| widow-support | Widow Support Program | active | Bamenda | 15 | $8,000 | $6,500 |
| education-orphans | Education for Orphans | completed | Douala | 20 | $7,000 | $7,000 |
| women-empowerment | Young Women Empowerment | active | Yaoundé | 10 | $6,000 | $3,500 |
| emergency-relief | Emergency Relief Fund | active | Multiple Regions | 50 | $10,000 | $4,800 |
| education-drive | Annual Education Drive | active | Rural Areas | 20 | $8,000 | $2,200 |
| christmas-giving | Christmas Giving Campaign | paused | Bamenda & surrounding villages | 50 | $5,000 | $1,000 |

### Impact Metrics (4)

| label | value | suffix | order |
|-------|:-----:|:------:|:-----:|
| Lives Impacted | 200 | + | 1 |
| Communities Served | 5 | | 2 |
| Widows Supported | 15 | + | 3 |
| Years of Service | 5 | | 4 |

### Volunteer Roles (6)

| title | time | location | order |
|-------|------|----------|:-----:|
| Community Outreach Coordinator | 10-15 hrs/week | On-site | 1 |
| Education Mentor | 5-10 hrs/week | On-site | 2 |
| Skills Training Facilitator | 8-12 hrs/week | On-site | 3 |
| Healthcare Support Volunteer | 5-8 hrs/week | On-site | 4 |
| Digital Media & Communications | 5-10 hrs/week | Remote | 5 |
| Fundraising & Events | Flexible | Remote | 6 |

### Donation Tiers (6)

| amount | impactDescription | order |
|:------:|-------------------|:-----:|
| 25 | School supplies for 2 children | 1 |
| 50 | Widow support for a week | 2 |
| 100 | Skills training for one woman | 3 |
| 250 | Healthcare for 5 families | 4 |
| 500 | Agricultural training for 3 farmers | 5 |
| 1000 | Community clean-up initiative | 6 |

### Site Settings (1)

| field | value |
|-------|-------|
| siteName | Apoti Development Association |
| tagline | Empowering vulnerable communities in Cameroon through faith-based programs supporting widows, orphans, and young women since 2021. |
| contactEmail | info@apotidev.org |
| contactPhone | +237 676 282 346 |
| officeHours | Mon–Fri, 8AM–5PM CAT |
| socialFacebook | https://facebook.com/apotidev |
| socialInstagram | https://instagram.com/apotidev |
| socialTwitter | https://twitter.com/apotidev |

---

## Execution Plan (7 Parallel Tracks)

### Track 1: Sanity Studio Setup
1. Create `ada-website/sanity/` directory
2. Initialize Sanity Studio config (`sanity.config.ts`, `sanity.cli.ts`)
3. Configure Studio structure (singleton for siteSettings)
4. Add `package.json` with Sanity dependencies

### Track 2: Schema Definitions
1. Create `sanity/schemas/project.ts`
2. Create `sanity/schemas/siteSettings.ts`
3. Create `sanity/schemas/impactMetric.ts`
4. Create `sanity/schemas/volunteerRole.ts`
5. Create `sanity/schemas/donationTier.ts`
6. Create `sanity/schemas/teamMember.ts`
7. Create `sanity/schemas/galleryImage.ts`
8. Create `sanity/schemas/testimonial.ts`
9. Create `sanity/schemas/index.ts` (exports all)

### Track 3: Seed Script
1. Create `sanity/seed.ts` script
2. Uses `@sanity/client` to create all 23 documents
3. Handles idempotency (createOrReplace by `_id`)
4. Run with `npx tsx sanity/seed.ts`

### Track 4: Update Sanity Client Library
1. Update `src/lib/sanity.ts` with new query functions:
   - `getProjects()` → fetch all projects ordered by sortOrder
   - `getImpactMetrics()` → fetch metrics ordered by displayOrder
   - `getVolunteerRoles()` → fetch active roles
   - `getDonationTiers()` → fetch active tiers
   - `getSiteSettings()` → fetch singleton
   - `getTeamMembers()` → fetch active members
   - `getGalleryImages()` → fetch images by category
2. Add TypeScript return types matching schema

### Track 5: Update Project Pages
1. `src/pages/projects/index.astro` → fetch from Sanity, fallback to `src/data/projects.ts`
2. `src/pages/projects/[slug].astro` → fetch from Sanity, fallback to static data
3. Keep `src/data/projects.ts` as build-time fallback

### Track 6: Update Content Pages
1. `src/pages/index.astro` → fetch impactMetrics from Sanity
2. `src/pages/donate.astro` → fetch donationTiers from Sanity
3. `src/pages/get-involved.astro` → fetch volunteerRoles from Sanity
4. `src/pages/team.astro` → fetch teamMembers from Sanity
5. `src/pages/gallery.astro` → fetch galleryImages from Sanity
6. `src/components/layout/Footer.astro` → fetch siteSettings from Sanity

### Track 7: Deploy & Verify
1. Deploy Sanity Studio (`npx sanity deploy`)
2. Run seed script
3. Verify all pages render with CMS data
4. Test build succeeds
5. Verify Studio is accessible at `ada-website.sanity.studio`

---

## Fallback Strategy

Since Sanity CDN may be unavailable during builds or if the project has no data yet:

```typescript
// Pattern for all pages
const projects = await getProjects().catch(() => null);
const data = projects ?? fallbackProjects; // from src/data/projects.ts
```

This ensures the site always builds even if Sanity is unreachable.

---

## Post-Migration Checklist

- [ ] All 8 schemas visible in Sanity Studio
- [ ] All 23 documents created and editable
- [ ] Astro pages render correctly with CMS data
- [ ] Build succeeds with Sanity data
- [ ] Build succeeds without Sanity (fallback works)
- [ ] ADA team can log into Studio and edit content
- [ ] Studio deployed at `ada-website.sanity.studio`

---

## Content NOT Migrated (stays hardcoded)

These items are structural/design and don't need CMS management:

- Navigation links (Header.astro)
- Page titles and meta descriptions
- Legal pages (privacy.astro, terms.astro)
- Auth page content
- Dashboard page structure
- Chatbot FAQ responses (could migrate later)
- Core values and programs on About page (could migrate later)
- Timeline milestones (could migrate later)

---

## Dependencies

| Requirement | Status |
|-------------|--------|
| Sanity account | ✅ Exists (rj2m21gk) |
| Sanity API token (editor role) | ✅ Available (needs rotation) |
| Node 22+ | ✅ Available |
| `@sanity/client` installed | ✅ In package.json |
| Network access to Sanity API | ✅ |

---

## Ready to Execute

All information needed for migration is documented above. Execute Tracks 1-7 in parallel to complete the migration in one session.
