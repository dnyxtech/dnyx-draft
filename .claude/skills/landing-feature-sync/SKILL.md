---
name: landing-feature-sync
description: Sync a new or changed feature in the main Dnyx Draft app (apps/web) out to the marketing landing site (apps/landing). Use whenever a feature ships in apps/web that a prospective user would want to know about — a new tool/page, a major capability, a workflow change — before considering the work "done."
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(pnpm --filter landing typecheck), Bash(pnpm check)
---

# Landing Feature Sync

The main app (`apps/web`) and the marketing site (`apps/landing`) are separate
Next.js apps in this Turborepo monorepo — nothing wires them together
automatically. Every time a feature ships in the app, it goes stale on the
landing site until someone updates it by hand. Treat that update as part of
shipping the feature, not a follow-up task.

## Decide how big the feature is

- **Standalone tool/page** (its own route, like `/readme-builder` or
  `/svg-editor`) → gets a dedicated card in `ToolsSpotlight.tsx` with a direct
  CTA link, *and* a `FeatureGrid.tsx` tile.
- **Capability inside the main editor** (not its own page) → `FeatureGrid.tsx`
  tile only, in whichever category fits (see below); skip `ToolsSpotlight`,
  which is reserved for things you navigate to.
- **Minor/internal change** → usually nothing to sync. Don't force an entry.

## Touchpoints, in priority order

1. **`apps/landing/lib/constants.ts`** — if the feature has its own route, add
   a `_URL` constant here first (`` `${APP_URL}/your-route` ``), matching the
   `README_BUILDER_URL` / `SVG_EDITOR_URL` pattern. Every other file below
   should import the URL from here, never hardcode it.
2. **`apps/landing/components/FeatureGrid.tsx`** — the canonical feature list,
   grouped into `CATEGORIES` (`Editing & Preview`, `Files & Workspace`,
   `Security & Safety`, `Platform`). Add a `{ icon, title, description }` entry
   to the category that fits; each category renders as a `md:grid-cols-3`
   grid, so it's fine for a category to overflow into a new row. This is the
   lowest-friction, always-do-it touchpoint.
3. **`apps/landing/components/ToolsSpotlight.tsx`** — only for standalone
   tools. Follow the existing card shape exactly (icon block, uppercase badge,
   heading, description, bullet list with an icon per line, CTA link with
   `ArrowUpRight`). Pick an accent color not already used by a sibling card.
   The grid is `lg:grid-cols-<N>` where N = card count — update it when adding
   a card. Also revisit the section's intro paragraph (just above the grid) if
   it enumerates the tools by name or count.
4. **`apps/web/components/modals/ReleaseNotesModal.tsx`** — if this feature
   ship is also a version bump, see the [[release-versioning]] skill; don't
   duplicate that logic here.

## Lower-priority touchpoints (update when the feature is significant enough to warrant it, not every time)

- **`apps/landing/components/Footer.tsx`** — has a direct tool-links list
  (currently links to README Builder). Add a standalone tool here too.
- **`apps/landing/components/FaqSection.tsx`** — has `category`-tagged Q&A
  entries (`'Collaboration'`, `'Tooling'`, etc.). Worth a new entry if the
  feature is something a skeptical visitor would specifically ask about.
- **`apps/landing/components/UseCasesSection.tsx`** — per-persona bullet lists
  of why that persona would use the product. Only touch if the feature is
  relevant to one of the existing personas.
- **`apps/landing/components/Hero.tsx`** — top-of-page trust badges (e.g.
  "Live Share & Real-Time Collaboration"). Reserve for flagship-level features,
  not routine additions — this is prime real estate.
- **`apps/landing/components/ComparisonMatrix.tsx`** — competitor comparison
  rows. Only relevant if the feature is a genuine differentiator worth a
  head-to-head row.
- **`apps/landing/components/Navbar.tsx`** — `NAV_LINKS` are section anchors
  (`/#features`, `/#ai`, etc.), not individual tools. Essentially never needs a
  per-feature update.

## Verification

- `pnpm --filter landing typecheck` and `pnpm check` after any edit.
- If you have browser tooling available, load the affected section(s) and
  actually look at it — icon color, grid wrapping, and copy length are easy to
  get subtly wrong and won't show up in a type error.
