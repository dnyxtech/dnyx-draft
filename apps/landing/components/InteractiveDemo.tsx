'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Copy,
  Diff,
  FileSpreadsheet,
  Lock,
  Sigma,
  Workflow,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Section, SectionHeader } from './ui/Section';
import { tabCrossfade } from '@/lib/motion';

interface DemoTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  markdown: string;
  renderedTitle: string;
  renderedHtml: React.ReactNode;
}

const DEMO_TABS: DemoTab[] = [
  {
    id: 'math',
    name: 'LaTeX Math Formulas',
    icon: <Sigma className="h-4 w-4" />,
    markdown: `### Standard Normal Distribution

The Gaussian probability density function:

$$
f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}
$$

Inline equations work seamlessly too: $E = mc^2$ and $e^{i\\pi} + 1 = 0$.`,
    renderedTitle: 'Standard Normal Distribution',
    renderedHtml: (
      <div className="space-y-4">
        <p className="text-muted-foreground text-xs">
          The Gaussian probability density function:
        </p>
        <div className="p-4 rounded-[var(--radius)] bg-primary/5 border border-primary/20 text-center text-base text-primary">
          f(x) = (1 / σ√(2π)) · e<sup>-½((x-μ)/σ)²</sup>
        </div>
        <p className="text-muted-foreground text-xs">
          Inline equations work seamlessly too:{' '}
          <span className="font-mono font-medium bg-secondary/60 px-1.5 py-0.5 rounded">
            E = mc²
          </span>{' '}
          and{' '}
          <span className="font-mono font-medium bg-secondary/60 px-1.5 py-0.5 rounded">
            e<sup>iπ</sup> + 1 = 0
          </span>
          .
        </p>
      </div>
    ),
  },
  {
    id: 'mermaid',
    name: 'Diagrams (12+ Engines)',
    icon: <Workflow className="h-4 w-4" />,
    markdown: `\`\`\`mermaid
flowchart TD
  User([User Input]) --> Editor[Markdown Editor]
  Editor --> Parser[AST Lexer Engine]
  Parser --> KaTeX[LaTeX Math Engine]
  Parser --> Highlight[Syntax Highlighter]
  Parser --> Mermaid[Diagram Renderer]
  KaTeX & Highlight & Mermaid --> Preview[Live Split Preview]
\`\`\``,
    renderedTitle: 'System Processing Architecture',
    renderedHtml: (
      <div className="p-4 rounded-[var(--radius)] bg-secondary/40 border border-border space-y-3">
        <div className="flex justify-center">
          <div className="px-3 py-1.5 rounded-full bg-foreground text-background font-semibold text-[11px]">
            User Input
          </div>
        </div>
        <div className="text-center text-muted-foreground text-xs">↓</div>
        <div className="flex justify-center">
          <div className="px-4 py-2 rounded-[var(--radius)] bg-primary text-primary-foreground font-semibold text-xs">
            AST Lexer &amp; Parser Engine
          </div>
        </div>
        <div className="text-center text-muted-foreground text-xs">↓</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-[var(--radius)] bg-primary/10 text-primary font-semibold border border-primary/20">
            KaTeX Math
          </div>
          <div className="p-2 rounded-[var(--radius)] bg-accent-warn/10 text-accent-warn font-semibold border border-accent-warn/20">
            highlight.js
          </div>
          <div className="p-2 rounded-[var(--radius)] bg-primary/10 text-primary font-semibold border border-primary/20">
            Mermaid SVG
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tables',
    name: 'Formatted Tables & CSV',
    icon: <FileSpreadsheet className="h-4 w-4" />,
    markdown: `| Engine | Offline Support | DOCX Export | LaTeX Math |
| :--- | :---: | :---: | :---: |
| **Dnyx Draft** | Supported (Local) | Native Client-side | KaTeX (Full) |
| Notion | Cloud-Only | PDF Export Only | Basic |
| Dillinger | Partial | Not Supported | Not Supported |`,
    renderedTitle: 'Formatted Comparison Table',
    renderedHtml: (
      <div className="overflow-hidden border border-border rounded-[var(--radius)] text-xs">
        <table className="w-full text-left">
          <thead className="bg-secondary/40 border-b border-border font-semibold">
            <tr>
              <th className="p-2.5">Engine</th>
              <th className="p-2.5 text-center">Offline Support</th>
              <th className="p-2.5 text-center">DOCX Export</th>
              <th className="p-2.5 text-center">LaTeX Math</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-primary/5 font-medium">
              <td className="p-2.5 text-primary font-semibold">Dnyx Draft</td>
              <td className="p-2.5 text-center text-primary font-semibold">Supported (Local)</td>
              <td className="p-2.5 text-center text-primary font-semibold">Native Client-side</td>
              <td className="p-2.5 text-center text-primary font-semibold">KaTeX (Full)</td>
            </tr>
            <tr>
              <td className="p-2.5">Notion</td>
              <td className="p-2.5 text-center text-muted-foreground">Cloud-Only</td>
              <td className="p-2.5 text-center text-muted-foreground">PDF Export Only</td>
              <td className="p-2.5 text-center text-muted-foreground">Basic</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: 'vault',
    name: 'AES-256 Crypto Vault',
    icon: <Lock className="h-4 w-4" />,
    markdown: `🔒 ENCRYPTED VAULT FILE (AES-256-GCM)
---
U2FsdGVkX19G4L6eM0Z28/w... [Zero-Knowledge Ciphertext]

* Password protection prevents plaintext exposure in browser storage.
* PBKDF2 with 100,000 iterations for military-grade key derivation.`,
    renderedTitle: 'Zero-Knowledge Security Architecture',
    renderedHtml: (
      <div className="p-4 rounded-[var(--radius)] bg-accent-warn/5 border border-accent-warn/20 space-y-2.5">
        <div className="flex items-center gap-2 text-accent-warn font-semibold text-xs">
          <Lock className="h-4 w-4" /> Password-Protected Document
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          The document content is encrypted using WebCrypto AES-256-GCM before writing to IndexedDB.
          Even with direct disk access, content cannot be decrypted without your password.
        </p>
      </div>
    ),
  },
  {
    id: 'diff',
    name: 'Visual Version Diffs',
    icon: <Diff className="h-4 w-4" />,
    markdown: `@@ Revision 2 -> Revision 3 @@
- const databaseUrl = "http://localhost:8000";
+ const databaseUrl = "indexeddb://local-vault";

  // Initialize storage layer
+ await db.revisions.add(snapshot);`,
    renderedTitle: 'Git-Style Line-by-Line Changes',
    renderedHtml: (
      <div className="p-3 font-mono text-xs space-y-1 bg-secondary/40 rounded-[var(--radius)] border border-border">
        <div className="p-1 rounded bg-destructive/15 text-destructive line-through">
          - const databaseUrl = &quot;http://localhost:8000&quot;;
        </div>
        <div className="p-1 rounded bg-primary/15 text-primary">
          + const databaseUrl = &quot;indexeddb://local-vault&quot;;
        </div>
        <div className="p-1 text-muted-foreground">  // Initialize storage layer</div>
        <div className="p-1 rounded bg-primary/15 text-primary">
          + await db.revisions.add(snapshot);
        </div>
      </div>
    ),
  },
];

export const InteractiveDemo: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('math');
  const [copied, setCopied] = useState<boolean>(false);
  const activeTab = DEMO_TABS.find((t) => t.id === activeTabId) || DEMO_TABS[0];

  return (
    <Section id="demo" tone="muted">
      <SectionHeader
        align="center"
        title="Experience the markdown engine"
        description="Switch between capabilities to see how Dnyx Draft transforms plain text into rich diagrams, formulas, tables, and secure vaults."
      />

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {DEMO_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] text-xs font-medium transition-colors cursor-pointer ${
              activeTabId === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:bg-secondary/60'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto rounded-[var(--radius)] border border-border bg-card overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">
                Markdown Source Input
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeTab.markdown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-primary">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeTab.id}
                variants={tabCrossfade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 rounded-[var(--radius)] bg-secondary/40 font-mono text-xs text-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed border border-border"
              >
                {activeTab.markdown}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6 bg-secondary/20 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="text-[10px] font-semibold tracking-wide text-primary block mb-2">
              Instant Rendered Result
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                variants={tabCrossfade}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 rounded-[var(--radius)] bg-card border border-border"
              >
                <h4 className="font-medium text-sm text-foreground mb-3">
                  {activeTab.renderedTitle}
                </h4>
                {activeTab.renderedHtml}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
};
