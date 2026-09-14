<div align="center">

  <img src="assets/logo_trans.png" alt="Dnyx Draft logo" width="96" height="96" />

  <h1>Dnyx Draft</h1>

  **A local-first Markdown workspace: editor, live preview, multi-format file viewer, and BYOK AI writing assistant.**

  Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Shadcn UI**, **Zustand**, and **Dexie.js**.

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Framework](https://img.shields.io/badge/framework-Next.js%2016-black.svg)](https://nextjs.org/)
  [![Language](https://img.shields.io/badge/language-TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
  [![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS%20v4-38BDF8.svg)](https://tailwindcss.com/)

</div>

---

## 🚀 Key Features

### Editing & Preview
- **⚡ Real-Time Live Preview**: Split-screen or full-screen rendering of GitHub Flavored Markdown (GFM) with AST-synchronized bidirectional scrolling.
- **🧮 LaTeX Math**: Inline (`$E = mc^2$`) and block equation rendering powered by KaTeX.
- **📊 Extended Diagram Engines**: Mermaid, Markmap (mind maps), Vega-Lite (charts), PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, Pikchr (via Kroki), ABC music notation (with audio playback), GeoJSON/TopoJSON maps (Leaflet), and a 3D STL model viewer (Three.js) — every engine shares a zoom/pan/copy-SVG/download-PNG/fullscreen toolbar.
- **🔍 Find & Replace**: In-editor search (`Ctrl+F`) with match count, case sensitivity, whole word, and regex support, plus a workspace-wide global search/replace across all documents.
- **📐 Insert Diagram**: Searchable modal with 17 diagram templates across 9 categories.
- **📊 Interactive Table Builder**: Visual spreadsheet-style modal to create, align, resize, and insert Markdown tables.
- **🔄 Format & Data Converters**: CSV/TSV → Markdown table converter, plus a JSON ⇄ XML ⇄ YAML ⇄ CSV data format converter.
- **🧹 Auto-Formatter**: AST-based linter that aligns Markdown table columns and normalizes document structure.
- **📈 Document Diagnostics**: Flesch Reading Ease score, word/syllable counts, reading time, and speaking time.
- **🎤 Voice Dictation**: Speech-to-text input via the Web Speech API.
- **↔️ Text Direction & Alignment**: LTR/RTL toggle plus left/center/right/justify alignment.
- **😊 Emoji Picker**: Full emoji database via `@emoji-mart/react` with cursor insertion.
- **📽️ Presentation Mode**: Marp-style full-screen slide deck with keyboard navigation and progress tracking.
- **📚 Template Hub**: Pre-built starter templates (READMEs, technical RFCs, API specs, academic papers, meeting notes, feature tours).
- **🕸️ Knowledge Graph View**: Force-directed graph of all documents linked by `[[wikilinks]]`/references, with zoom, pan, and click-to-open.
- **🧭 Command Palette**: Keyboard-driven `Cmd/Ctrl+K` command palette for navigating actions, documents, and settings.

### AI (Bring Your Own Key)
- **🤖 AI Writing Actions**: Summarize, fix grammar, rewrite, and shorten selected text or the whole document using your own Anthropic (Claude) or OpenAI API key.
- **🪄 AI Diagram Generation**: Describe a diagram in plain language and get a ready-to-insert Mermaid block.
- **🔐 Encrypted Key Vault**: API keys are AES-GCM encrypted at rest in IndexedDB, unlocked per-session with a local passphrase — keys never touch a Dnyx Draft server.

### Files & Workspace
- **📁 Folder Explorer & Tabs**: Multi-document tabs, nested folders, search filtering, and favorites.
- **🗂️ Multi-Format File Viewer**: Beyond Markdown — view and edit CSV/TSV tables, JSON/XML/YAML trees, XLSX spreadsheets, Jupyter notebooks, PDFs, images, code files (syntax highlighted), config files, and browse ZIP/archive contents, all in one workspace.
- **💻 Local Folder Mounting**: Open and edit a real folder on your computer via the native File System Access API — no upload required.
- **📥 Import Anything**: Convert `.docx`, `.html`, and `.pdf` files to Markdown on import; import whole folders at once.
- **📤 Smart Export**: Export to Markdown, HTML, Word (`.docx`), JSON, PDF (with diagram serialization), or a full ZIP of the workspace.
- **🌐 GitHub Import**: Pull Markdown files from public or private repositories using an encrypted Personal Access Token vault (AES-GCM, up to 50 tokens).
- **📝 README Builder**: Dedicated `/readme-builder` tool — a guided, section-by-section wizard (features, tech stack, install steps, badges, folder structure, FAQ, etc.) that pulls live metadata from a GitHub repo and renders a polished, exportable README.
- **🔒 Document Encryption Vault**: Password-protect any individual document with AES-GCM.
- **🕓 Version History**: Per-document revision snapshots with line-by-line diffing and one-click restore.
- **🗑️ Trash & Recovery**: Dedicated trash window with restore and permanent delete.
- **💬 Comments**: Threaded, anchored comment system with resolve/reopen, backed by IndexedDB.
- **🤝 Live Share**: Polling-based real-time collaboration with host/editor/viewer roles, invite links, and 2-second content sync.
- **🔗 Share Snapshots**: Fast, ephemeral read-only shareable links.

### Platform
- **💾 Local-First & Privacy-First**: Zero login required. All documents, folders, revisions, comments, and tokens persist locally via IndexedDB (Dexie.js).
- **🎨 Light & Dark Themes**: High-contrast light theme and deep dark theme with zero FOUC via `next-themes`.
- **🌍 15-Language UI**: EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, BG, TR, IT.
- **📱 PWA**: Service worker with offline caching; installable as a standalone app.
- **🌐 Marketing Site**: Standalone landing app (`apps/landing`) showcasing the product.

---

## 🛠️ Tech Stack & Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **Framework**: Next.js 16 (App Router) with Server Components & Streaming SSR, React 19
- **Language**: 100% Strict TypeScript (zero JavaScript)
- **UI Components**: Shadcn UI & Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Local Storage**: Dexie.js (IndexedDB)
- **Validation**: Zod + React Hook Form
- **Error Handling**: Sentry error boundaries
- **Testing**: Vitest (unit/integration/benchmarks) + Playwright (E2E) + React Testing Library + jsdom
- **Tooling & Linter**: Biome + Husky (commit-msg & pre-commit hooks) + Turborepo
- **Edge/Serverless**: Cloudflare Pages Functions (`functions/api`) mirror the Next.js API routes for edge deployment
- **Containerization**: Docker + docker-compose

---

## 📦 Project Structure

```
Dnyx-Draft/
├── apps/
│   ├── web/                     # Next.js 16 (App Router) main application
│   │   ├── app/                 # Routes: editor, /readme-builder, /s/[id] (share), api/*
│   │   ├── components/          # editor, preview, viewers, modals, sidebar, navbar, graph
│   │   └── lib/                 # ai, crypto, db, export, format, import, i18n, store, utils
│   └── landing/                 # Marketing/landing site (Next.js)
├── packages/
│   ├── @dnyx-draft/engine        # Shared Markdown AST parsing library
│   ├── @dnyx-draft/crypto-vault  # AES-256-GCM encryption package
│   ├── @dnyx-draft/storage       # Dexie.js database schemas
│   └── @dnyx-draft/ui            # Shared UI design tokens & theme library
├── functions/
│   └── api/live-room.ts         # Cloudflare Pages Function mirror of Live Share API
├── docs/                        # Full documentation suite
│   ├── llms/                    # AI/LLM cheatsheets (Next.js, Tailwind, shadcn, TS)
│   ├── wiki/                    # GitHub-wiki-style guides
│   ├── architecture.md          # Architecture & data flow
│   ├── DESIGN.md                # UI & design tokens specification
│   ├── PRD.md / BRD.md / TRD.md # Product/business/technical requirements
│   ├── PRODUCT.md               # Product vision & user personas
│   ├── setup.md                 # Local setup & installation
│   ├── testing.md               # Vitest & Playwright testing guide
│   ├── deployment.md            # Vercel, Docker, and Cloudflare deployment
│   └── troubleshooting.md       # Common solutions & FAQ
├── tests/                       # unit, integration, e2e (Playwright), performance benches
├── scripts/                     # setup-env.ts and other dev scripts
└── .github/                     # Workflows & Copilot instructions
```

---

## 💻 Quick Start

### 1. Prerequisites
- Node.js >= 20.x
- pnpm >= 10.x

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/dnyxtech/dnyx-draft.git
cd dnyx-draft

# Install dependencies
pnpm install

# Start development server (web app)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Other dev commands
```bash
pnpm dev:landing    # Run only the landing site
pnpm dev:all        # Run every app in the monorepo
pnpm build          # Production build of the web app
pnpm build:all      # Production build of every app
```

---

## 🧪 Testing & Code Quality

```bash
pnpm test           # Run Vitest unit/integration suite
pnpm test:watch     # Vitest in watch mode
pnpm test:e2e       # Playwright end-to-end tests
pnpm bench          # Vitest performance benchmarks
pnpm typecheck      # Type check all workspaces (Turborepo)
pnpm check          # Biome format & lint (auto-fix)
pnpm lint           # Lint all workspaces (Turborepo)
```

---

## 🐳 Docker

```bash
docker compose up --build
```

See [`docs/deployment.md`](docs/deployment.md) for Vercel and Cloudflare deployment guides.

---

## 💖 Sponsor This Project

<div align="center">

  [![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?logo=githubsponsors&logoColor=white&style=for-the-badge)](https://github.com/sponsors/dnyxtech)

  If Dnyx Draft saves you time, consider [sponsoring the project on GitHub](https://github.com/sponsors/dnyxtech) — it helps fund ongoing development and maintenance. ⭐ Starring the repo helps too!

</div>

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
