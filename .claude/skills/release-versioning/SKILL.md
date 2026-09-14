---
name: release-versioning
description: Cut a new release of Dnyx Draft — pick the right version bump, update the changelog (CHANGELOG.md + in-app What's New modal), bump every package.json, and tag the release in git. Use whenever the user asks to "release", "bump the version", "cut a release", "tag this", or after shipping a feature/fix that should be reflected in version history.
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(git log *), Bash(git tag *), Bash(git describe *), Bash(git show *), Bash(pnpm --filter * typecheck), Bash(pnpm check)
---

# Release Versioning

Dnyx Draft follows [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This repo is public since
v1.0.0 (2026-09-14) — the pre-1.0 history (0.1.0–0.8.0) was reconstructed from the
project's actual development history (an older internal `CHANGELOG.md` plus git
commit dates) precisely so future releases have a real, traceable baseline. Keep
that baseline honest: don't invent version numbers, and don't skip this process
when a release-worthy change lands.

## Where version state lives (all four must move together)

1. `package.json` (repo root)
2. `apps/web/package.json`
3. `apps/landing/package.json`
4. `apps/web/components/modals/ReleaseNotesModal.tsx` — `APP_VERSION` constant
   plus a new entry prepended to the `RELEASE_NOTES` array (newest first). This
   auto-opens the "What's New" modal for every user on their next visit
   (`lastSeenVersion !== APP_VERSION` check in `AppHeader.tsx`), so keep entries
   short and user-facing — 2-5 punchy bullets, not a raw commit log.
5. `CHANGELOG.md` (repo root) — the exhaustive, technical counterpart. Use
   Keep a Changelog `### Added` / `### Changed` / `### Deprecated` / `### Removed` /
   `### Fixed` / `### Security` subsections here. This is what the modal's
   "Full changelog" link points to on GitHub.

The two changelogs serve different audiences: `RELEASE_NOTES` in the modal is
marketing-toned and brief; `CHANGELOG.md` is the complete technical record. A
release should update both, but they don't need identical wording.

## Picking the version bump

This repo enforces Conventional Commits (`commitlint.config.js` extends
`@commitlint/config-conventional`). Use that to classify what changed since the
last tag:

```bash
git describe --tags --abbrev=0        # last release tag
git log <last-tag>..HEAD --oneline    # commits since then
```

- Any `feat:` commit, or a new user-facing capability → **MINOR** bump
  (`1.x.0`) once past 1.0.0; pre-1.0 (`0.x.0`) also just bumps MINOR per
  [semver §4](https://semver.org/#spec-item-4) — anything may change at 0.y.z,
  so there's no separate "patch vs. minor" judgment call before 1.0.0.
- Any `fix:` commit only, no new capability, post-1.0 → **PATCH** bump
  (`1.0.x`).
- A `BREAKING CHANGE:` footer or `!` after the type (e.g. `feat!:`), post-1.0
  only → **MAJOR** bump. Pre-1.0, breaking changes still just bump MINOR
  (semver explicitly allows anything to change at 0.y.z).

When in doubt, default to the smallest bump that's still honest — don't round up
version numbers for marketing effect.

## Release checklist

1. Determine the new version number (above).
2. Update all four files in "Where version state lives."
3. New `RELEASE_NOTES` entry goes **first** in the array (newest first); new
   `CHANGELOG.md` section goes **first** too, right after the `---` under the
   Keep a Changelog preamble.
4. Run `pnpm --filter web typecheck` and `pnpm check` (Biome) — a version bump
   touching JSON/TSX should never fail either.
5. If this release includes a new standalone feature/page, also run the
   [[landing-feature-sync]] skill before tagging — the landing site should
   reflect the app, not lag behind it.
6. **Confirm with the user before tagging or pushing.** Creating a local
   annotated tag is low-risk and reversible (`git tag -d vX.Y.Z`), but still
   ask first — and never push a tag without explicit confirmation:
   ```bash
   git add <changed files>
   git commit -m "chore(release): vX.Y.Z"
   git tag -a vX.Y.Z -m "vX.Y.Z"
   # git push origin vX.Y.Z   -- only on explicit request, never by default
   ```

## Historical tags (reference)

Tags `v0.1.0` through `v0.8.0` point at the specific pre-existing commits/dates
documented in `CHANGELOG.md`, not at HEAD — they mark when each milestone
actually happened, reconstructed after the fact. `v1.0.0` is the first tag
that should point at a commit made *at* that version's release, going forward
every release should tag the commit that ships it, not be backfilled later.
