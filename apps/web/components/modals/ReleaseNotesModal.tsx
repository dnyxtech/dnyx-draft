'use client';

import { ExternalLink, Megaphone, X } from 'lucide-react';
import type React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CHANGELOG_URL } from '@/lib/constants';

const APP_VERSION = '1.2.0';

const RELEASE_NOTES = [
  {
    version: '1.2.0',
    date: '2026-09-14',
    highlights: [
      'New: Secret Workspace — a seeded folder showing off zero-knowledge document locking, unlocked by default with instructions',
      'New: Diagrams & More rebuilt — 5 categories (Flowcharts, Mind Maps, Data Viz, Technical Notation, 3D & Maps) with live preview, editable code, and reference/citation fields before insert',
      'New: Markdown alert blocks (Note/Tip/Important/Warning/Caution), a Symbols & HTML Entities picker, horizontal rule and copy-document toolbar buttons',
      'New: Live Share is now easy to find in the top bar, with a clearer edit/view access toggle',
      'New: About Dnyx Draft — license, changelog, FAQ, and one-click "Report an Issue" prefilled with your app version',
      'New: Settings → Storage & Backup (configurable trash retention, clear browser data, reset workspace) and a one-click Private Mode screen-blur toggle',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-09-14',
    highlights: [
      'New: Insert image, GIF, or video — upload a file (stored locally, no server) or paste a media URL',
      'Fixed: Emoji picker now renders correctly and inserts emojis reliably',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-09-14',
    highlights: [
      '🚀 Public launch of Dnyx Draft — first stable public release',
      'New: SVG Editor — live code-to-preview SVG playground with sandboxed rendering, inline parse-error detection, copy & .svg download',
    ],
  },
  {
    version: '0.8.0',
    date: '2026-09-08',
    highlights: [
      'Landing page FAQ section and interactive product demo added',
      'Footer finalized with tool links and legal pages',
    ],
  },
  {
    version: '0.7.0',
    date: '2026-09-08',
    highlights: [
      'Landing site scaffolded: navbar, hero, footer, and providers',
      'Feature grid, use-cases, comparison matrix, and architecture sections built',
    ],
  },
  {
    version: '0.6.0',
    date: '2026-09-08',
    highlights: [
      'Turborepo pipeline wired with build and deploy scripts',
      'Root-level dev/build/deploy commands for both apps',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-09-07',
    highlights: [
      'Cloudflare Workers deployment configured for the web app and landing site',
      'Vite build config and Wrangler manifests added per app',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-09-07',
    highlights: [
      'Repository prepared for open source',
      'Conventional commit linting added',
      'Monorepo package manifests cleaned up (crypto-vault, markdown-engine, storage, ui)',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-09-07',
    highlights: [
      'Initial commit of the full editor engine and workspace to the public repository',
      'README Builder — guided README generator with GitHub auto-fill',
    ],
  },
  {
    version: '0.0.4',
    date: '2026-09-03',
    highlights: [
      'Workspace Safety & Trash: safer document-scoped persistence, conflict-copy preservation, responsive multi-select Trash with 30-day retention',
      'More reliable Markdown parsing for math, footnotes, headings, and tables — plus a quick table selector',
      'Preview & review reliability: per-document scroll position, stabilized comment highlights',
      'Export appearance: remembered Light/Dark controls for HTML, PDF, and PNG exports',
      'Restored production Live Share routing; all 15 localized URLs independently indexable',
    ],
  },
  {
    version: '0.0.3',
    date: '2026-09-01',
    highlights: [
      'Comments rebuilt around precise text selections with synchronized highlights and nested replies',
      'Consolidated header toolbar and reorganized Markdown formatting controls',
      "Added the branded in-app release-notes tab (what you're reading now)",
      'Expanded the interface from 14 to 15 languages, adding Bulgarian',
      'Locked Playwright testing tooling; updated DOMPurify and js-yaml',
    ],
  },
  {
    version: '0.0.2',
    date: '2026-08-31',
    highlights: [
      'Live Share for real-time collaboration',
      'Inline comments and threaded review system',
      'Extended diagram engines: PlantUML, Graphviz, D2, WaveDrom, ERD, Pikchr, Markmap, Vega-Lite, ABC notation, GeoJSON/TopoJSON maps, STL 3D models',
      'GitHub PAT vault (AES-GCM encrypted, up to 50 tokens)',
      'PDF export with diagram serialization',
      'Text alignment, RTL/LTR toggle, emoji picker, 17+ diagram templates',
      '14-language UI foundation',
      'Trash window, PWA support, IndexedDB v3',
    ],
  },
  {
    version: '0.0.1',
    date: '2026-08-22',
    highlights: [
      'Migrated to Next.js 16, React 19, strict TypeScript, and a Turborepo monorepo',
      'Tailwind CSS v4 design system with light/dark themes',
      'Microsoft Word (.docx) export engine',
      'Presentation slide deck mode',
      'Synchronized editor/preview scrolling',
      'Interactive table builder, CSV/TSV converter, auto-formatter',
      'Document diagnostics & readability analytics',
      'Find & replace, local folder mounting, template hub, floating TOC',
      'SEO/AEO/GEO metadata and crawler support',
    ],
  },
];

interface ReleaseNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-blue-500" />
            What&apos;s New
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              v{APP_VERSION}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {RELEASE_NOTES.map((release) => (
            <div key={release.version}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  v{release.version}
                </h3>
                <span className="text-[11px] text-slate-400">{release.date}</span>
              </div>
              <ul className="space-y-1.5">
                {release.highlights.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Full changelog
          </a>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <X className="h-3 w-3" />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { APP_VERSION };
