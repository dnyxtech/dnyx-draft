# Changelog

All notable changes to **Dnyx Draft** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-09-14

🚀 **Public launch of Dnyx Draft.**

### Added
- **SVG Editor** (`/svg-editor`): live code-to-preview SVG playground. CodeMirror 6 (`@codemirror/lang-xml`) source editor with a split-pane live preview, debounced parse validation via `DOMParser`, and an inline error banner that keeps the last valid render visible instead of going blank. The preview renders inside a sandboxed `<iframe sandbox="">` (no `allow-scripts`/`allow-same-origin`) so pasted SVG containing `<script>` or event-handler attributes cannot execute. Copy-to-clipboard and `.svg` download actions.
- Linked from the app's Tools menu, and from the landing site's Tools Spotlight and Feature Grid sections.

---

## [0.8.0] - 2026-09-08

### Added
- Landing page FAQ section and interactive product demo.
- Footer finalized with tool links and legal pages (privacy, security, terms).

---

## [0.7.0] - 2026-09-08

### Added
- Landing site scaffolded: navbar, hero, footer, theme provider.
- Feature grid, use-cases, comparison matrix, and architecture sections.

---

## [0.6.0] - 2026-09-08

### Added
- Turborepo pipeline wired with `vinext` build and deploy scripts.
- Root-level `dev`/`build`/`deploy` commands covering both the web app and landing site.

---

## [0.5.0] - 2026-09-07

### Added
- Cloudflare Workers deployment configured (via `vinext-cloudflare`) for the web app and landing site.
- Vite build config and Wrangler manifests added per app.

---

## [0.4.0] - 2026-09-07

### Added
- Conventional Commits linting (`commitlint`).
- Workspace package manifests for the open-source packages: `crypto-vault`, `markdown-engine`, `storage`, `ui`.

### Changed
- Repository structure prepared for open source.

---

## [0.3.0] - 2026-09-07

### Added
- Initial commit of the full editor engine and workspace to the public repository.
- **README Builder** (`/readme-builder`): guided README generator with GitHub metadata auto-fill and an encrypted PAT vault.

---

## [0.2.0] - 2026-08-31

_Originally shipped internally as "4.0.0, Sprint 1-8 Complete."_

### Added
- **Live Share**: polling-based real-time collaboration with host/editor/viewer roles, invite URL generation, participant presence list, and 2-second content sync. In-memory room store with 6-hour expiry and 30-second stale-participant pruning via `/api/live-room` (POST/GET/PATCH/DELETE).
- **Comments & Reviews**: threaded comment system backed by IndexedDB — anchor text, threaded replies, resolve/reopen, delete, filter-by-resolved.
- **Extended diagram engines**: PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, and Pikchr via Kroki; interactive Markmap mind maps; Vega-Lite charts with theme detection; ABC music notation with Web Audio playback; GeoJSON/TopoJSON maps via Leaflet; STL 3D models via Three.js. Shared diagram toolbar (zoom, pan, copy SVG, download PNG, fullscreen).
- **GitHub PAT Vault**: AES-GCM encrypted personal access token store, up to 50 named tokens.
- **PDF Export**: client-side generation via `jsPDF` + `html2canvas`, with diagram serialization to PNG before capture.
- **Editor toolbar**: text alignment, RTL/LTR toggle, emoji picker, Insert Diagram modal with 17 templates across 9 categories.
- **15-language UI**: EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, BG, TR, IT.
- **Trash window**: restore or permanently delete documents.
- **PWA support**: service worker, cache-first static assets, network-first navigation/API.
- **IndexedDB v3**: added `blobs`, `comments`, and `tokens` tables.

---

## [0.1.0] - 2026-08-22

_Originally shipped internally as "4.0.0."_

### Added
- Migrated to **Next.js 16 (App Router)**, React 19, and strict TypeScript.
- Restructured into a **Turborepo monorepo** (`apps/`, `packages/`) with pnpm workspaces.
- **Tailwind CSS v4** design system with light/dark themes via `next-themes`.
- Microsoft Word (`.docx`) export engine.
- Marp-style presentation slide deck mode with keyboard navigation.
- AST-synchronized bidirectional scrolling between editor and preview.
- Interactive table builder; CSV/TSV-to-Markdown converter; auto-table formatter.
- Document diagnostics: Flesch reading ease, word/syllable counts, reading/speaking time.
- In-editor find & replace with regex support.
- Local folder mounting via the File System Access API.
- Template hub with 6 starter templates.
- Floating table of contents with click-to-scroll navigation.
- SEO/AEO/GEO metadata: OpenGraph, JSON-LD, sitemap, robots.txt, `llms.txt`.

### Removed
- Legacy vanilla-JS implementation.
