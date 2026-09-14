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
} from 'lucide-react';
import type React from 'react';
import { Section, SectionHeader } from './ui/Section';

const CATEGORIES: {
  name: string;
  items: { icon: React.ReactNode; title: string; description: string }[];
}[] = [
  {
    name: 'Editing & Preview',
    items: [
      {
        icon: <Command className="h-5 w-5" />,
        title: 'Command Palette & Find/Replace',
        description:
          'Fuzzy-search every document and action with Ctrl/Cmd+K, plus in-editor and workspace-wide find & replace with regex support.',
      },
      {
        icon: <Layers3 className="h-5 w-5" />,
        title: '12+ Diagram Engines',
        description:
          'Mermaid, Markmap mind maps, Vega-Lite charts, PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, Pikchr, ABC music notation, GeoJSON maps, and 3D STL models.',
      },
      {
        icon: <Network className="h-5 w-5" />,
        title: 'Knowledge Graph & WikiLinks',
        description:
          'Force-directed graph of every document linked by [[wikilinks]], plus a template hub, table builder, and format converters.',
      },
      {
        icon: <Code2 className="h-5 w-5" />,
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
        icon: <FolderTree className="h-5 w-5" />,
        title: 'Multi-Format File Viewer',
        description:
          'Beyond Markdown: view and edit CSV/TSV, JSON/XML/YAML trees, XLSX, Jupyter notebooks, PDFs, images, code, and browse ZIP archives.',
      },
      {
        icon: <HardDrive className="h-5 w-5" />,
        title: 'Local Folder Mounting',
        description:
          'Open a real folder from your computer via the File System Access API and edit files in place — no upload required.',
      },
      {
        icon: <Download className="h-5 w-5" />,
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
        icon: <Lock className="h-5 w-5" />,
        title: 'Zero-Knowledge AES-256 Vault',
        description: 'Lock any document with WebCrypto AES-256-GCM. Unencrypted plaintext never touches storage.',
      },
      {
        icon: <History className="h-5 w-5" />,
        title: 'Version History & Diffs',
        description: 'Per-document revision snapshots with Git-style line-by-line diffing and one-click rollback.',
      },
      {
        icon: <Archive className="h-5 w-5" />,
        title: 'Trash & Recovery',
        description: 'Deleted documents land in a dedicated trash window — restore or permanently delete anytime.',
      },
    ],
  },
  {
    name: 'Platform',
    items: [
      {
        icon: <HardDrive className="h-5 w-5" />,
        title: '100% Offline, Local-First',
        description: 'Zero server latency. Documents, folders, and settings persist in Dexie.js (IndexedDB).',
      },
      {
        icon: <Globe className="h-5 w-5" />,
        title: '15-Language Interface',
        description: 'EN, ZH, JA, KO, FR, DE, ES, PT-BR, RU, AR, HI, BG, TR, IT, and NL — fully localized UI.',
      },
      {
        icon: <Smartphone className="h-5 w-5" />,
        title: 'Installable PWA',
        description: 'Service worker with offline caching — install Dnyx Draft as a standalone desktop or mobile app.',
      },
      {
        icon: <Mic className="h-5 w-5" />,
        title: 'Free Voice Dictation',
        description: 'Dictate notes with the browser-native Web Speech API — zero third-party API costs.',
      },
      {
        icon: <Activity className="h-5 w-5" />,
        title: 'Document Diagnostics',
        description: 'Real-time Flesch reading ease, word counts, reading/speaking time, and syntax linting.',
      },
      {
        icon: <Palette className="h-5 w-5" />,
        title: 'Adaptive Dark & Light Themes',
        description: 'Seamless theme sync across editor, preview, syntax highlighting, and diagram SVGs.',
      },
    ],
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <Section id="features">
      <SectionHeader
        align="center"
        title="Engineered for power users"
        description="Every tool you need to write technical specifications, documentation, academic papers, and private notes — without vendor lock-in."
      />

      <div className="space-y-12">
        {CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <span className="h-px w-6 bg-border" />
              {category.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {category.items.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-[var(--radius)] border border-border bg-card hover:border-primary/60 transition-colors"
                >
                  <div className="p-2.5 rounded-[var(--radius)] bg-secondary/40 border border-border w-fit mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm md:text-base font-medium text-foreground mb-2">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
