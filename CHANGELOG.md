# Changelog

All notable changes to **Dnyx Draft** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.2.0] - 2026-09-14

### Added
- **Secret Workspace**: a seeded folder created on first run alongside the existing `Welcome.md`, containing an unlocked welcome document that walks the user through the app's zero-knowledge document lock feature and how to lock it themselves. Never seeded pre-locked, since the encryption is zero-knowledge and no password is ever stored.
- **Diagrams & More** (replaces the old Insert Diagram modal): reorganized into 5 categories — Flowcharts & Diagrams (Mermaid/PlantUML/Graphviz/D2), Mind Maps (Markmap), Data Visualization (Vega-Lite), Technical Notation (WaveDrom/ABC), and 3D & Maps (STL/GeoJSON). Selecting a template now shows an editable code pane with a live render preview (reusing the app's existing diagram viewers) before insert, plus optional reference fields (title, reference #, link) that append a citation caption to the inserted block.
- **Markdown alert blocks**: GitHub-style `[!NOTE]`/`[!TIP]`/`[!IMPORTANT]`/`[!WARNING]`/`[!CAUTION]` blockquotes now render as styled callout boxes with per-type icon and color in the preview pane, in addition to the existing toolbar insertion shortcut.
- **Symbols & HTML Entities picker**: a new toolbar modal with categorized Unicode symbols (arrows, math, currency, punctuation, Greek, misc) for one-click insertion.
- **Copy document** and **horizontal rule** toolbar buttons.
- **Live Share** is now surfaced directly in the top toolbar (previously only reachable via the side activity bar), and the participant access-mode toggle was redesigned for clarity between "Can edit" and "View only".
- **About Dnyx Draft** modal: license, changelog link, FAQ link, "developed and maintained by" attribution, and a "Report an Issue" button that opens a prefilled GitHub issue (including the current app version).
- **Settings → Storage & Backup**: configurable trash retention period (replacing two previously hardcoded, drifted constants), a "Clear Browser Data" action that wipes local documents/settings/service-worker caches, and a "Reset Workspace" action that restores the first-run seeded state — both gated behind type-to-confirm.
- **Private Mode**: a one-click screen-privacy toggle (Settings or a header icon) that blurs the sidebar and document content behind a "click to reveal" overlay. Purely visual — does not touch document encryption or storage.
- Settings' existing theme sections are now grouped under an explicit "Appearance" heading.

---

## [1.1.0] - 2026-09-14

### Added
- **Insert Media modal**: "Insert image, GIF, or video" with an Upload tab (stores the file locally in IndexedDB via a new `dnyx-blob:` URI scheme — no server involved) and an External Media (URL) tab. Replaces the previous one-click toolbar button that inserted a placeholder-URL Markdown snippet. `MarkdownPreview` resolves `dnyx-blob:` references to cached, reference-counted object URLs; workspace ZIP export writes them out as real files under `assets/` with rewritten relative paths.

### Fixed
- **Emoji picker**: the mount effect was keyed on a plain ref, but Radix's Dialog portals its content on a later commit than the one where the dialog opens — the effect could run once while the ref was still `null` and never retry, leaving the picker stuck loading indefinitely. Now tracked via a callback ref in state so the effect re-fires once the element mounts. Also corrected a CSS selector that targeted a direct child instead of the actual nested custom element, and added loading/error/retry states.

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

## [0.0.4] - 2026-09-03

### Added
- **Workspace Safety & Trash**: document-scoped, revision-aware persistence replacing unsafe whole-workspace write paths; preserved conflict copies, interrupted edits, and orphaned content; transactional browser backup and Secret Workspace replacement; journaled desktop moves and index writes; responsive, multi-select Trash for normal and encrypted documents with safe 30-day retention.
- **Markdown Editing & Rendering**: grammar-aware parsing for math, footnotes, headings, definition lists, code, and adjacent lists, replacing document-wide formatting rewrites; accessible 8×8 quick table selector plus a custom table dialog; refined toolbar icons.
- **Preview & Review Reliability**: per-document Preview scroll position; stabilized comment highlights across complete and formatted nodes; blocked link navigation while selecting comments; preserved linked-image and commented-image geometry.
- **Export Appearance & Rich Content**: remembered Light/Dark appearance controls for HTML, browser-print PDF, raster PDF, and PNG exports; every supported diagram and rich-content type rendered before capture; Markmaps fitted to printable bounds without changing the visible app theme.
- **Search, Performance & Collaboration**: all 15 localized URLs independently indexable with canonical, hreflang, social, structured-data, and sitemap coverage; Bulgarian and Google verification metadata; real redirect/404 handling; restored production Live Share WebSocket routing through Cloudflare Pages Functions.

### Changed
- Kept maps and STL diagram viewers responsive during the Markdown parsing rework.
- Corrected dark/light rendering of tables, alerts, dividers, backgrounds, and frontmatter in exports.

### Fixed
- Preserved editor selections when opening the context menu.

---

## [0.0.3] - 2026-09-01

### Added
- **Comments & Collaboration**: selection-first anchored comments; synchronized document highlights and thread cards; nested editable replies; clearer open/resolved states; responsive panel layouts; Live Share identities that follow participant name changes, including for view-only collaborators.
- **Interface & Editing**: familiar formatting, navigation, file, view, and fullscreen keyboard shortcuts across web and desktop where browser-reserved keys permit.
- **Release Experience**: a branded, read-only in-app release-notes tab with first-run and upgrade visibility, version-aware seen tracking, section navigation, and an About action.
- **Localization**: expanded the interface from 14 to 15 languages, adding Bulgarian.
- **Testing**: locked local Playwright tooling with static checks, Chromium end-to-end coverage, and cross-browser smoke tests.

### Changed
- Consolidated document actions into a clearer header toolbar; reorganized Markdown formatting controls; refined disabled, dropdown, theme, and Private mode states.
- Dragging any selected file now moves the complete multi-file selection; widened expanded-folder drop targets.
- Word, character, and reading-time statistics refresh on every render and reopened document.

### Fixed
- Clipboard success feedback now waits for the actual copy result instead of assuming success.

### Security
- Updated DOMPurify and js-yaml; corrected integrity-checked browser assets; synchronized desktop dependencies; restored WebKit local-development support.

---

## [0.0.2] - 2026-08-31

_Originally shipped internally as "4.0.0, Sprint 1-8 Complete."_

### Added
- **Collaboration**
  - **Live Share**: polling-based real-time collaboration with host/editor/viewer roles, invite URL generation, participant presence list, and 2-second content sync. In-memory room store with 6-hour expiry and 30-second stale-participant pruning via `/api/live-room` (POST/GET/PATCH/DELETE).
  - **Comments & Reviews**: threaded comment system backed by IndexedDB — anchor text, threaded replies, resolve/reopen, delete, filter-by-resolved. Author name persisted in `localStorage`.
- **Extended Diagram Engines**
  - **KrokiViewer**: renders PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, and Pikchr via the Kroki API as SVG.
  - **MarkmapViewer**: interactive mind maps using `markmap-lib` + `markmap-view` with D3 zoom/pan.
  - **VegaLiteViewer**: data charts via `vega-embed` with automatic dark/light theme detection.
  - **ABCViewer**: ABC music notation rendered by `abcjs` with Play/Stop audio synthesis via the Web Audio API.
  - **GeoMapViewer**: interactive GeoJSON and TopoJSON maps via Leaflet; TopoJSON converted client-side using `topojson-client`.
  - **STLViewer**: 3D model viewer using Three.js + STLLoader + OrbitControls with a grid helper and auto-center/scale.
  - **DiagramToolbar**: shared diagram toolbar (zoom in/out/reset, copy SVG, download PNG, fullscreen) used by all diagram viewers.
  - **MarkdownPreview**: routes 14 fenced code block languages to their correct viewer.
- **Security & Import**
  - **GitHub PAT Vault**: AES-GCM encrypted personal access token store (`lib/crypto/pat-vault.ts`). Supports up to 50 named tokens; each token encrypted with a device-derived key stored in the IndexedDB `tokens` table.
  - **GitHub Import**: PAT selection UI with add/delete flow; token-authenticated `Authorization` header on fetch.
- **Export**
  - **PDF Export**: client-side PDF generation via `jsPDF` + `html2canvas` with SVG serialization; serializes Mermaid and other SVG diagrams to PNG before capture, then pages content for A4.
- **Editor Toolbar**
  - **Text Alignment**: left, center, right, justify buttons insert `<div style="text-align:...">` wrappers.
  - **RTL/LTR Toggle**: reads and sets `textDirection` from `useSettingsStore`; applied as `dir` attribute on the preview container.
  - **Emoji Picker**: opens `EmojiPickerModal` backed by `@emoji-mart/react` (dynamic import); inserts emoji shortcode at cursor.
  - **Insert Diagram**: opens `InsertDiagramModal` with 17 searchable diagram templates across 9 categories.
- **Localization & Settings**
  - **Multi-language UI**: complete translation map in `lib/i18n/index.ts` — EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, TR, IT (14 total; see 0.0.3 for the addition of Bulgarian).
  - **Language Selector**: dropdown in SettingsModal to switch interface language; persisted via `useSettingsStore`.
  - **Text Direction**: LTR/RTL toggle in SettingsModal.
- **Workspace Management**
  - **TrashModal**: dedicated trash window — restore or permanently delete individual documents, Empty Trash button with count.
  - **ReleaseNotesModal**: branded release notes; auto-shows on first run after a version bump via `lastSeenVersion` comparison.
- **ActivityBar & Navigation**
  - Added Live Share (Wifi), Comments (MessageSquare), Trash (Trash2), and What's New (Newspaper) buttons to the ActivityBar's bottom utility section. Each dispatches a `md:open-*` custom event caught by AppHeader.
- **PWA**
  - **Service Worker** (`public/sw.js`): cache-first for static assets, network-first for navigation and API routes. Registered in `app/providers.tsx` on mount.
- **Database**
  - **IndexedDB v3**: added `blobs`, `comments`, and `tokens` tables. New interfaces: `BlobItem`, `CommentItem`, `ReplyItem`, `TokenItem`.

---

## [0.0.1] - 2026-08-22

_Originally shipped internally as "4.0.0."_ The very first working version of Dnyx Draft.

### Added
- **Major Framework & Architecture Migration**
  - **Next.js 16 (App Router)**: completely migrated from legacy vanilla JavaScript to Next.js 16, React 19, and 100% strict TypeScript.
  - **Turborepo Monorepo**: restructured into `apps/web`, `apps/desktop`, and `packages/` with centralized pnpm workspace configuration.
  - **Tailwind CSS v4**: modern design system supporting a crisp Light Theme and sleek Dark Theme via `next-themes`.
- **New Features & Capabilities**
  - **Microsoft Word (`.docx`) Export Engine**: client-side document builder converting Markdown headings, styled tables, lists, and code blocks into standard Word `.docx` documents.
  - **Interactive Presentation Slide Deck Mode**: Marp-style full-screen presentation deck with keyboard navigation (Arrow keys, Spacebar, PageUp/Down) and progress tracking.
  - **AST Synchronized Scrolling**: line-matched proportional bidirectional scrolling between editor and preview panes.
  - **Interactive Table Builder**: visual spreadsheet modal allowing users to create, align (left, center, right), resize, and insert Markdown tables.
  - **CSV / TSV to Markdown Converter**: instant client-side converter to turn tabular spreadsheet data into Markdown tables.
  - **Auto-Table & Document Formatter**: AST linter to align table columns with uniform padding.
  - **Document Diagnostics & Readability Analytics**: Flesch Reading Ease score (/100), word/syllable counts, reading time, and speaking time calculations.
  - **In-Editor Find & Replace Bar**: search with match count, case sensitivity, whole word, and regex support (`Ctrl+F`).
  - **Native Web File System Access API**: mount and edit local PC folders directly in the browser via `showDirectoryPicker`.
  - **Pre-Built Professional Template Hub**: 6 starter templates for READMEs, Technical RFCs, API Specifications, Academic papers, Meeting notes, and Feature tours.
  - **Interactive Floating Table of Contents (TOC)**: auto-generated outline from `#` headers with smooth click-to-scroll navigation.
- **SEO, AEO & GEO Enhancements**
  - Added OpenGraph, Twitter card metadata, and Google-compliant JSON-LD `WebApplication` schema.
  - Generated `sitemap.xml`, `robots.txt`, `public/llms.txt`, and `public/.well-known/llms.txt` for search engines and AI crawlers.

### Removed
- Legacy vanilla-JS implementation and old single-file implementations.
