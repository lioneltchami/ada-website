# Design — Apoti Development Association

A locked design system for apotidev.org. Every page redesign reads this file
before emitting code. Do not regenerate per page — extend or amend this file
when the system needs to grow.

## Genre

editorial

## Macrostructure family

- Marketing pages: Photographic (full-bleed field photography + left-biased captions) with Split Studio proof bands where needed
- Content pages: Long Document (stories, about, resources, transparency)
- Conversion pages: Split Studio (donate, sponsor, monthly — form + proof)

## Theme

Anchored on existing ADA green / orange. Paper is warm, not pure white.
Accent orange is for primary donate CTAs only (≤ 5% of viewport).

- `--color-paper` oklch(98.5% 0.008 95)
- `--color-paper-2` oklch(96% 0.012 95)
- `--color-ink` oklch(22% 0.02 145)
- `--color-ink-2` oklch(42% 0.02 145)
- `--color-rule` oklch(88% 0.01 145)
- `--color-accent` oklch(42% 0.12 145) /* forest green — primary brand */
- `--color-cta` oklch(65% 0.18 45) /* warm orange — donate only */
- `--color-focus` oklch(42% 0.12 145)

Map to Tailwind: `primary-*` = accent green, `secondary-*` = CTA orange,
`gray-50` paper-2, body on paper.

## Typography

- Display: Plus Jakarta Sans, weight 700–800, style normal (never italic headers)
- Body: Source Serif 4, weight 400–600
- Mono: ui-monospace (system) for registration numbers only
- Display tracking: -0.02em on large headings
- Type scale anchor: display = clamp(2.25rem, 4vw, 3.75rem)

## Spacing

4-point named scale via Tailwind spacing. Prefer `py-16` / `py-24` section
breaks; avoid stacking many equal `gap-8` card grids.

## Motion

- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- Reveal: none by default; opacity ≤ 150ms on reduced-motion
- No perpetual pulse, no hover card lift, no backdrop-blur sticky glass

## Microinteractions stance

- Silent success
- Hover delay soft; focus-visible instant ring (primary-600)
- Borders over shadows; hairline `border-gray-200` instead of `shadow-card`

## CTA voice

- Primary CTA: solid secondary (orange), `rounded-md` (6px), no gradient fill, no pulse
- Secondary CTA: text link with underline-offset, or outline hairline on dark

## Nav (N6 masthead)

- One masthead row: approved symbol and wordmark at left, desktop links centered, language selector immediately left of Donate at right. No separate language strip or second desktop navigation row.
- Language: English / Français on wider screens; EN / FR with full accessible names on narrow phones. Selected language is filled green and underlined. Both choices remain outside the mobile menu.
- Responsive: preserve the larger approved brand at tablet/desktop; use the approved symbol alone on narrow phones. Collapse navigation before the row gets crowded.
- Solid paper background when sticky; no blur glass

## Footer (Ft5 statement)

- Large closing statement + single Donate
- Newsletter once
- Compact inline link row (not 3–4 link columns)
- Registration colophon line

## Per-page allowances

- Marketing MAY use real Sanity/gallery photography full-bleed
- App/dashboard: no enrichment
- Content: typography + one documentary photo max per fold
- No emoji-as-icon systems
- No numbered 01–06 marketing tiles unless content is truly sequential process
- No centered PageHero; left-align title blocks

## What pages MUST share

- Wordmark `/brand/ada-logo.png`
- Accent green + CTA orange placement rules
- Display + body fonts
- CTA voice (shape, radius, no gradient)
- Left-biased section heads (eyebrow above heading, same column)

## What pages MAY differ on

- Macrostructure within family
- Photo vs prose weight
- Presence of CurrentWork / mosaic on homepage only

## Exports

### tokens.css (mirrored in `src/styles/global.css` @theme)

See `src/styles/global.css` for live Tailwind v4 tokens.

Hallmark stamp reference:
`/* Hallmark · genre: editorial · macrostructure: Photographic · design-system: design.md · designed-as-app */`
