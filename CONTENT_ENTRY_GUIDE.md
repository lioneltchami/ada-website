# ADA Website — Content Entry Guide

> **Sanity Studio URL:** https://ada-website.sanity.studio/
> **Login:** Use the email associated with your Sanity account

---

## How to Edit Content

1. Go to https://ada-website.sanity.studio/
2. Log in with your Sanity account
3. Select the content type from the left sidebar
4. Edit fields and click **Publish** when done
5. Changes appear on the website after the next build (automatic on deploy)

---

## Content Types You Can Edit

### Site Settings (1 document)
Global settings that appear across the site (footer, contact page).
- **Site Name** — Organization name
- **Tagline** — Short description shown in footer
- **Contact Email** — Primary email (currently info@apotidev.org)
- **Contact Phone** — Phone/WhatsApp number
- **Office Hours** — When you're available
- **Social Links** — Facebook, Instagram, Twitter URLs

### Projects (6 documents)
Your active programs and campaigns.
- **Title** — Project name
- **Slug** — URL-friendly name (auto-generated from title)
- **Status** — Active, Completed, or Paused
- **Location** — Where the project operates
- **Description** — What the project does (max 500 chars)
- **Beneficiaries** — Number of people helped
- **Goal Amount** — Fundraising target (USD)
- **Raised Amount** — Amount raised so far (USD)
- **Main Image** — Project photo (recommended: 1200x800px)
- **Featured** — Show on homepage

### Impact Metrics (4 documents)
The big numbers shown on the homepage.
- **Label** — e.g. "Lives Impacted"
- **Value** — The number (e.g. 200)
- **Suffix** — Text after the number (e.g. "+")
- **Display Order** — Order on the page (1 = first)

### Team Members (add new)
Your team profiles shown on the Team page.
- **Name** — Full name
- **Role** — Job title or position
- **Bio** — Short biography (2-3 sentences)
- **Photo** — Headshot (recommended: 400x400px, square)
- **Active** — Toggle to show/hide
- **Sort Order** — Display order

### Gallery Images (add new)
Upload only genuine ADA program photos to the Gallery. A CMS upload alone is not clearance to publish.
- **Caption and alt text** — In English and French, describe what the photo actually shows. If the photo shows only part of a group, say “some,” not a total.
- **Photo** — Keep the approved derivative (recommended: 1200x800px where the original permits). Use a copy that does not retain location metadata or unapproved pixels.
- **Category and date taken** — Enter only verified details. Never reuse placeholder metadata or infer a date from a filename. Leave unknown dates blank.
- **Project/report link** — Confirm that the exact asset shows the same activity as the linked record. Use the canonical archive entry for a historical project; if there is no verified match, display the cleared photo without a project link. Use a separate report link only if the matching public PDF works.
- **Publication clearance** — Keep source and permissions private. Ask the web maintainer to review the exact asset for the Gallery and any other intended placement before publishing.

### Testimonials (add new)
Stories from beneficiaries shown on the site.
- **Name** — Person's name (can be changed for privacy)
- **Quote** — Their testimonial text
- **Location** — Where they're from
- **Program** — Which program helped them
- **Photo** — Their photo (with consent)
- **Featured** — Show on homepage

### Volunteer Roles (6 documents)
Positions shown on the Get Involved page.
- **Title** — Role name
- **Description** — What the role involves
- **Time Commitment** — Hours per week
- **Location** — On-site or Remote
- **Active** — Toggle to show/hide

### Donation Tiers (6 documents)
Impact examples shown on the Donate page.
- **Amount** — Dollar amount
- **Impact Description** — What this amount provides
- **Active** — Toggle to show/hide

### Home Page (1 document)
Homepage content (hero, mission section, CTA).
- **Hero Badge** — Small text above the headline
- **Hero Headline** — Main heading
- **Hero Subtitle** — Description below heading
- **Mission Heading** — Section title
- **Mission Body** — Mission description
- **Mission Cards** — 3 cards with icon, title, description
- **CTA Heading** — Call-to-action section title
- **CTA Body** — CTA description

### About Page (1 document)
About page content.
- **Mission Statement** — Full mission text
- **Story Heading** — "Called to Serve" section title
- **Core Values** — 6 values with icon, title, description
- **Programs** — 6 programs with icon, title, description
- **Financial Split** — Percentage breakdown (must total 100%)
- **Timeline** — Year + event milestones

### FAQ Responses (5 documents)
Chatbot responses.
- **Keywords** — Words that trigger this response
- **Response** — The chatbot's reply
- **Sort Order** — Priority order

---

## Image Guidelines

| Type | Size | Format | Notes |
|------|------|--------|-------|
| Project images | 1200x800px | JPG/WebP | Landscape orientation |
| Team headshots | 400x400px | JPG/WebP | Square, face centered |
| Gallery photos | 1200x800px | JPG/WebP | Any orientation |
| Testimonial photos | 400x400px | JPG/WebP | Square |

**Important:**
- Obtain and record applicable written consent for identifiable people; keep records private. Use any existing permission only for the exact person, asset, and allowed use.
- For back-to-school documentation, show supplies or the team's work rather than identifiable children. Other possible uses involving identifiable children still require a separate safeguarding decision and appropriate permission.
- Never use stock in the Gallery or as evidence of ADA's work. Where an individual project is authorized to use a temporary stock illustration, label it clearly and retain the license and source so it can be replaced later.
- Optimize approved copies before upload; do not send private original photos to third-party compression services by default.

---

## What to Add First (Priority Order)

1. ⭐ **Team Members** — Add at least 3-5 team profiles with photos
2. ⭐ **Gallery Photos** — Verify and clear genuine program photos before upload
3. ⭐ **Project Images** — Add a main image to each of the 6 projects
4. **Testimonials** — Add 2-3 beneficiary stories (with consent)
5. **Update Impact Metrics** — If numbers have changed since last update

---

## Need Help?

Contact the development team or email info@apotidev.org for assistance with the CMS.

## Naming present and archived outreaches

- Keep the permanent slug and document URLs unchanged when correcting a title. Link a future archive record to its source outreach or keep the same slug; do not create a second entry to record the same event.
- Use the same English and French series labels for recurring outreaches. Store only the series label in the title fields and put the confirmed venue or locality in the location fields. Keep the date separate. Do not add an unconfirmed location or invent a date.
- For a new event in a maintained series, add its slug, series and confirmed display locality (if known) to `config/outreach-naming.json`. The website combines them as `Outreach Name · Location`. Keep the same name on the Terms of Reference and report. Keep full venue details separate.
- This convention applies to individual outreach records, not standing campaigns or editorial story headlines.
