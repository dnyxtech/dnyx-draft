'use client';

import { Database, KeyRound, ServerOff, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { Section, SectionHeader } from './ui/Section';

const PILLARS = [
  {
    icon: <ServerOff className="h-5 w-5" />,
    title: '100% Client-Side Execution',
    description:
      'All Markdown parsing, diagram compilation, and Word document bundling runs inside your web browser using pure TypeScript.',
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: 'Dexie.js IndexedDB Engine',
    description:
      'Documents and folder structures are indexed locally in browser IndexedDB with debounced auto-saving and full offline persistence.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'WebCrypto AES-256 Vault',
    description:
      'Standardized WebCrypto PBKDF2 key derivation and AES-GCM encryption guarantee that locked notes cannot be read even from direct storage dumps.',
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: 'BYOK AI, Direct to Provider',
    description:
      'AI requests go straight from your browser to Anthropic or OpenAI using your own encrypted key. Dnyx Draft’s servers never see your prompts.',
  },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <Section id="architecture" tone="default">
      <SectionHeader
        align="center"
        title="Zero-knowledge architecture"
        description="No accounts, no tracking cookies, and no background database synchronization. Your data remains strictly inside your machine."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border border-y border-border">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="py-8 px-2 lg:px-6 first:pt-0 lg:first:pt-8">
            <div className="text-primary mb-4">{pillar.icon}</div>
            <h3 className="font-medium text-base text-foreground mb-2">{pillar.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
