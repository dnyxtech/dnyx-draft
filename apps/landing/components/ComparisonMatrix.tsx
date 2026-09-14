'use client';

import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type React from 'react';
import { Section, SectionHeader } from './ui/Section';

type Status = 'yes' | 'partial' | 'no';
interface Cell {
  status: Status;
  label: string;
}

const COMPETITORS = ['notion', 'obsidian', 'typora', 'hackmd'] as const;
type CompetitorKey = (typeof COMPETITORS)[number];
const COMPETITOR_LABEL: Record<CompetitorKey, string> = {
  notion: 'Notion',
  obsidian: 'Obsidian',
  typora: 'Typora',
  hackmd: 'HackMD',
};

interface ComparisonRow {
  feature: string;
  dnyx: Cell;
  notion: Cell;
  obsidian: Cell;
  typora: Cell;
  hackmd: Cell;
}

const PRICING_ROW: ComparisonRow = {
  feature: 'Pricing',
  dnyx: { status: 'yes', label: 'Free & Open Source' },
  notion: { status: 'no', label: 'Free / $10 Plus / $20 Business per mo' },
  obsidian: { status: 'partial', label: 'Free (personal); Sync $4/mo, Commercial $50/yr' },
  typora: { status: 'partial', label: '$14.99 one-time license' },
  hackmd: { status: 'partial', label: 'Free (3 seats); Prime Team $5/user/mo' },
};

const COMPARISONS: ComparisonRow[] = [
  {
    feature: 'Local-First Offline Persistence',
    dnyx: { status: 'yes', label: '100% Offline (IndexedDB)' },
    notion: { status: 'no', label: 'Cloud-Required' },
    obsidian: { status: 'yes', label: 'Local Files' },
    typora: { status: 'yes', label: 'Local Files' },
    hackmd: { status: 'no', label: 'Cloud-Required' },
  },
  {
    feature: 'Runs in the Browser (No Install)',
    dnyx: { status: 'yes', label: 'Zero-Install Web App' },
    notion: { status: 'yes', label: 'Web + Desktop' },
    obsidian: { status: 'no', label: 'Desktop App Only' },
    typora: { status: 'no', label: 'Desktop App Only' },
    hackmd: { status: 'yes', label: 'Web App' },
  },
  {
    feature: 'BYOK AI Writing Assistant',
    dnyx: { status: 'yes', label: 'Your Own Anthropic/OpenAI Key' },
    notion: { status: 'partial', label: 'Notion AI Add-on ($)' },
    obsidian: { status: 'partial', label: 'Via Plugin' },
    typora: { status: 'no', label: 'Not Supported' },
    hackmd: { status: 'no', label: 'Not Supported' },
  },
  {
    feature: 'Real-Time Collaboration',
    dnyx: { status: 'yes', label: 'Live Share, No Account' },
    notion: { status: 'yes', label: 'Supported' },
    obsidian: { status: 'partial', label: 'Paid Sync Plugin' },
    typora: { status: 'no', label: 'Not Supported' },
    hackmd: { status: 'yes', label: 'Supported' },
  },
  {
    feature: 'Multi-Format File Viewer',
    dnyx: { status: 'yes', label: 'CSV, JSON, XLSX, PDF, Jupyter…' },
    notion: { status: 'partial', label: 'Embeds Only' },
    obsidian: { status: 'partial', label: 'Via Plugins' },
    typora: { status: 'no', label: 'Markdown Only' },
    hackmd: { status: 'no', label: 'Markdown Only' },
  },
  {
    feature: '12+ Diagram Engines',
    dnyx: { status: 'yes', label: 'Mermaid, D2, Graphviz, PlantUML…' },
    notion: { status: 'partial', label: 'Mermaid Only' },
    obsidian: { status: 'partial', label: 'Mermaid via Plugin' },
    typora: { status: 'partial', label: 'Mermaid Only' },
    hackmd: { status: 'partial', label: 'Mermaid Only' },
  },
  {
    feature: 'Client-Side Password Encryption',
    dnyx: { status: 'yes', label: 'AES-256-GCM Vault' },
    notion: { status: 'no', label: 'No File Passwords' },
    obsidian: { status: 'partial', label: 'Via Plugin' },
    typora: { status: 'no', label: 'No Encryption' },
    hackmd: { status: 'no', label: 'No File Passwords' },
  },
  {
    feature: 'Direct Word (.docx) & ZIP Export',
    dnyx: { status: 'yes', label: 'Instant Client-side' },
    notion: { status: 'no', label: 'HTML/PDF Only' },
    obsidian: { status: 'partial', label: 'Via Pandoc CLI' },
    typora: { status: 'yes', label: 'Via Pandoc' },
    hackmd: { status: 'no', label: 'PDF/HTML Only' },
  },
  {
    feature: 'Account / Registration Required',
    dnyx: { status: 'yes', label: 'No Login (Instant)' },
    notion: { status: 'no', label: 'Mandatory Login' },
    obsidian: { status: 'yes', label: 'No Account (Free)' },
    typora: { status: 'yes', label: 'No Account (Paid App)' },
    hackmd: { status: 'no', label: 'Mandatory Login' },
  },
];

const STATUS_ICON: Record<Status, React.ReactNode> = {
  yes: <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />,
  partial: <AlertCircle className="h-3.5 w-3.5 text-accent-warn shrink-0" />,
  no: <XCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />,
};

const STATUS_TEXT: Record<Status, string> = {
  yes: 'text-foreground',
  partial: 'text-accent-warn',
  no: 'text-muted-foreground',
};

const StatusCell: React.FC<{ data: Cell }> = ({ data }) => (
  <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${STATUS_TEXT[data.status]}`}>
    {STATUS_ICON[data.status]}
    <span>{data.label}</span>
  </div>
);

const ROWS = [PRICING_ROW, ...COMPARISONS];

export const ComparisonMatrix: React.FC = () => {
  return (
    <Section id="comparison" tone="muted" spacing="loose">
      <SectionHeader
        align="center"
        title="How Dnyx Draft compares"
        description="Dnyx Draft is free and open source — no seats, no tiers, no upsell. See how it stacks up against the note-taking and Markdown tools people already pay for."
      />

      {/* Table — tablet and up */}
      <div className="hidden md:block max-w-6xl mx-auto overflow-x-auto border border-border rounded-[var(--radius)] bg-card">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="p-4 font-semibold text-sm text-foreground">Capability</th>
              <th className="p-4 font-semibold text-sm text-primary bg-primary/5">Dnyx Draft</th>
              {COMPETITORS.map((key) => (
                <th key={key} className="p-4 font-medium">
                  {COMPETITOR_LABEL[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((row) => (
              <tr
                key={row.feature}
                className={`hover:bg-secondary/30 transition-colors ${row === PRICING_ROW ? 'bg-secondary/20' : ''}`}
              >
                <td className="p-4 font-medium text-foreground">{row.feature}</td>
                <td className="p-4 bg-primary/5">
                  <StatusCell data={row.dnyx} />
                </td>
                {COMPETITORS.map((key) => (
                  <td key={key} className="p-4">
                    <StatusCell data={row[key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card fallback — mobile only, same data source */}
      <div className="md:hidden space-y-4 max-w-xl mx-auto">
        <div className="rounded-[var(--radius)] border-l-2 border-primary bg-card border border-border p-5">
          <h3 className="font-mono font-medium text-sm text-primary mb-3">Dnyx Draft</h3>
          <dl className="space-y-3">
            {ROWS.map((row) => (
              <div key={row.feature} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">{row.feature}</dt>
                <dd>
                  <StatusCell data={row.dnyx} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {COMPETITORS.map((key) => (
          <div key={key} className="rounded-[var(--radius)] bg-secondary/30 border border-border p-5">
            <h3 className="font-mono font-medium text-sm text-foreground mb-3">
              {COMPETITOR_LABEL[key]}
            </h3>
            <dl className="space-y-3">
              {ROWS.map((row) => (
                <div key={row.feature} className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">{row.feature}</dt>
                  <dd>
                    <StatusCell data={row[key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
};
