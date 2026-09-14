'use client';

import { ExternalLink, Megaphone, X } from 'lucide-react';
import type React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const APP_VERSION = '1.0.0';

const RELEASE_NOTES = [
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
    version: '0.2.0',
    date: '2026-08-31',
    highlights: [
      'Live Share for real-time collaboration',
      'Inline comments and threaded review system',
      'Extended diagram engines: PlantUML, Graphviz, D2, WaveDrom, ERD, Pikchr, Markmap, Vega-Lite, ABC notation, GeoJSON/TopoJSON maps, STL 3D models',
      'GitHub PAT vault (AES-GCM encrypted, up to 50 tokens)',
      'PDF export with diagram serialization',
      'Text alignment, RTL/LTR toggle, emoji picker, 17+ diagram templates',
      '15-language UI (EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, BG, TR, IT)',
      'Trash window, PWA support, IndexedDB v3',
    ],
  },
  {
    version: '0.1.0',
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
            href="https://github.com/dnyxtech/dnyx-draft/blob/main/CHANGELOG.md"
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
