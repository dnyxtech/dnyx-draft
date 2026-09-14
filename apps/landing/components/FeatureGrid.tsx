'use client';

import {
  Activity,
  Archive,
  Code2,
  Command,
  Download,
  FolderTree,
  Globe,
  HardDrive,
  History,
  Layers3,
  Lock,
  Mic,
  Network,
  Palette,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import type React from 'react';

const CATEGORIES: {
  name: string;
  items: { icon: React.ReactNode; title: string; description: string }[];
}[] = [
  {
    name: 'Editing & Preview',
    items: [
      {
        icon: <Command className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        title: 'Command Palette & Find/Replace',
        description:
          'Fuzzy-search every document and action with Ctrl/Cmd+K, plus in-editor and workspace-wide find & replace with regex support.',
      },
      {
        icon: <Layers3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        title: '12+ Diagram Engines',
        description:
          'Mermaid, Markmap mind maps, Vega-Lite charts, PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, Pikchr, ABC music notation, GeoJSON maps, and 3D STL models.',
      },
      {
        icon: <Network className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
        title: 'Knowledge Graph & WikiLinks',
        description:
          'Force-directed graph of every document linked by [[wikilinks]], plus a template hub, table builder, and format converters.',
      },
      {
        icon: <Code2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
        title: 'SVG Editor',
        description:
          'Write raw SVG and watch it render live in a split pane, with inline parse-error detection and sandboxed rendering that keeps untrusted markup fully contained.',
      },
    ],
  },
  {
    name: 'Files & Workspace',
    items: [
      {
        icon: <FolderTree className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
        title: 'Multi-Format File Viewer',
        description:
          'Beyond Markdown: view and edit CSV/TSV, JSON/XML/YAML trees, XLSX, Jupyter notebooks, PDFs, images, code, and browse ZIP archives.',
      },
      {
        icon: <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        title: 'Local Folder Mounting',
        description:
          'Open a real folder from your computer via the File System Access API and edit files in place — no upload required.',
      },
      {
        icon: <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        title: 'Universal Import & Export',
        description:
          'Import .docx/.html/.pdf as Markdown; export to Markdown, HTML, Word, JSON, PDF, or a full workspace ZIP.',
      },
    ],
  },
  {
    name: 'Security & Safety',
    items: [
      {
        icon: <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        title: 'Zero-Knowledge AES-256 Vault',
        description:
          'Lock any document with WebCrypto AES-256-GCM. Unencrypted plaintext never touches storage.',
      },
      {
        icon: <History className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
        title: 'Version History & Diffs',
        description:
          'Per-document revision snapshots with Git-style line-by-line diffing and one-click rollback.',
      },
      {
        icon: <Archive className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
        title: 'Trash & Recovery',
        description: 'Deleted documents land in a dedicated trash window — restore or permanently delete anytime.',
      },
    ],
  },
  {
    name: 'Platform',
    items: [
      {
        icon: <HardDrive className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
        title: '100% Offline, Local-First',
        description: 'Zero server latency. Documents, folders, and settings persist in Dexie.js (IndexedDB).',
      },
      {
        icon: <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        title: '15-Language Interface',
        description: 'EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, BG, TR, IT, and NL — fully localized UI.',
      },
      {
        icon: <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        title: 'Installable PWA',
        description: 'Service worker with offline caching — install Dnyx Draft as a standalone desktop or mobile app.',
      },
      {
        icon: <Mic className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
        title: 'Free Voice Dictation',
        description: 'Dictate notes with the browser-native Web Speech API — zero third-party API costs.',
      },
      {
        icon: <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
        title: 'Document Diagnostics',
        description: 'Real-time Flesch reading ease, word counts, reading/speaking time, and syntax linting.',
      },
      {
        icon: <Palette className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
        title: 'Adaptive Dark & Light Themes',
        description: 'Seamless theme sync across editor, preview, syntax highlighting, and diagram SVGs.',
      },
    ],
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Engineered for Power Users
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Every tool you need to write technical specifications, documentation, academic papers, and
          private notes — without vendor lock-in.
        </p>
      </div>

      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
              {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {category.items.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] hover:border-blue-500/80 dark:hover:border-blue-500/80 shadow-xs hover:shadow-xl transition-all duration-200"
                >
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
