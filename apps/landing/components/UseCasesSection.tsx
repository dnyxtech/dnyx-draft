'use client';

import { BookOpen, CheckCircle2, GraduationCap, Lock, Terminal } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Section, SectionHeader } from './ui/Section';

const USE_CASES = [
  {
    icon: <Terminal className="h-6 w-6" />,
    role: 'Software Engineers & Architects',
    tagline: 'Technical RFCs, API specs & code documentation',
    description:
      'Write architecture decision records with interactive Mermaid, Graphviz, and D2 diagrams, syntax-highlighted code blocks, and a fuzzy command palette.',
    bullets: [
      '12+ interactive diagram engines (Mermaid, D2, Graphviz…)',
      'AI-generated diagrams from a plain-text description',
      'Native local disk folder mounting via File System Access',
      'Live Share for pairing on RFCs in real time',
    ],
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    role: 'Students, Academics & Researchers',
    tagline: 'Mathematical proofs, equations & research papers',
    description:
      'Draft mathematical derivations with instant KaTeX LaTeX formula rendering. Cross-reference related research papers using internal [[WikiLinks]].',
    bullets: [
      'Fast inline & block LaTeX math ($...$ & $$...$$)',
      'Bidirectional [[WikiLinks]] note connectivity',
      'Word count & reading pace metrics in real-time',
      'One-click Table of Contents generation',
    ],
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    role: 'Technical Writers & Content Creators',
    tagline: 'Structured documentation, guides & Word export',
    description:
      'Build complex data tables with the visual table editor, convert raw CSVs into markdown grids, and generate a polished README with the guided builder.',
    bullets: [
      'Direct export to Microsoft Word (.docx)',
      'Dedicated README Builder pulling live GitHub metadata',
      'AI-assisted summarize, rewrite & grammar fixes (BYOK)',
      'Flesch Reading Ease readability scoring',
    ],
  },
  {
    icon: <Lock className="h-6 w-6" />,
    role: 'Privacy-Conscious Professionals',
    tagline: 'Confidential notes & zero-knowledge vaults',
    description:
      'Store sensitive business strategies, passwords, and private journals with military-grade PBKDF2 + AES-256-GCM client-side encryption.',
    bullets: [
      'Zero-knowledge AES-256 password lock',
      '100% offline local storage (IndexedDB)',
      'Zero server tracking or telemetry',
      'Complete workspace backup as ZIP archive',
    ],
  },
];

export const UseCasesSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const current = USE_CASES[active];

  return (
    <Section id="use-cases" tone="muted">
      <SectionHeader
        align="center"
        title="Built for high-velocity thinking"
        description="Whether you are writing a distributed systems RFC, solving calculus equations, or securing proprietary notes, Dnyx Draft adapts to your workflow."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {USE_CASES.map((item, idx) => (
            <button
              key={item.role}
              type="button"
              onClick={() => setActive(idx)}
              className={`shrink-0 lg:shrink flex items-center gap-3 text-left px-4 py-3 rounded-[var(--radius)] border transition-colors ${
                idx === active
                  ? 'border-primary bg-card text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-secondary/40'
              }`}
            >
              <span className={idx === active ? 'text-primary' : ''}>{item.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap lg:whitespace-normal">{item.role}</span>
            </button>
          ))}
        </div>

        <div key={current.role} className="p-7 md:p-8 rounded-[var(--radius)] border border-border bg-card">
          <h3 className="text-xl font-medium text-foreground mb-2">{current.tagline}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            {current.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {current.bullets.map((bullet) => (
              <div key={bullet} className="flex items-center gap-2 text-sm text-foreground font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
