'use client';

import { KeyRound, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import type React from 'react';
import { Section } from './ui/Section';

const AI_ACTIONS = ['Fix grammar', 'Summarize selection', 'Rewrite tone', 'Shorten paragraph', 'Generate Mermaid diagram'];

const AI_POINTS = [
  {
    icon: <KeyRound className="h-4.5 w-4.5" />,
    title: 'Encrypted key vault',
    description: 'Your API key is AES-GCM encrypted in IndexedDB — never stored in plaintext, never uploaded.',
  },
  {
    icon: <Sparkles className="h-4.5 w-4.5" />,
    title: 'Inline writing actions',
    description: 'Summarize, fix grammar, rewrite, or shorten any selection — or the whole document — in one click.',
  },
  {
    icon: <Workflow className="h-4.5 w-4.5" />,
    title: 'AI diagram generation',
    description: 'Describe a flow in plain language and get a ready-to-insert Mermaid diagram back.',
  },
];

export const AiSection: React.FC = () => {
  return (
    <Section id="ai">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-mono text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4 leading-tight">
            AI writing help, without giving up your privacy.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            Plug in your own Anthropic (Claude) or OpenAI API key and get inline writing actions —
            summarize, fix grammar, rewrite, shorten — plus AI diagram generation that turns a plain
            description into a ready-to-insert Mermaid block. Your key is AES-GCM encrypted at rest and
            unlocked locally with a passphrase; requests go straight from your browser to the provider.
            Dnyx Draft&apos;s servers never see your key, your prompts, or your documents.
          </p>

          <div className="space-y-4">
            {AI_POINTS.map((point) => (
              <div key={point.title} className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 rounded-[var(--radius)] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {point.icon}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{point.title}</div>
                  <p className="text-xs text-muted-foreground">{point.description}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-[var(--radius)] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">Zero server relay</div>
                <p className="text-xs text-muted-foreground">
                  Requests go straight from your browser to your chosen provider — Dnyx Draft never proxies or logs them.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-[var(--radius)] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">AI Actions</span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Your key, connected directly
            </span>
          </div>
          <div className="p-5 space-y-2.5">
            {AI_ACTIONS.map((action) => (
              <div
                key={action}
                className="flex items-center justify-between px-4 py-3 rounded-[var(--radius)] border border-border bg-secondary/20"
              >
                <span className="text-xs font-medium text-foreground">{action}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <div className="rounded-[var(--radius)] border border-dashed border-border p-3 text-[11px] text-muted-foreground font-mono">
              POST https://api.anthropic.com/v1/messages
              <br />
              <span className="text-muted-foreground/70"># sent directly from your browser</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
