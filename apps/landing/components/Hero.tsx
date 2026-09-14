'use client';

import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Play } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { APP_URL } from '@/lib/constants';
import { tabCrossfade } from '@/lib/motion';

const FADE_UP = 'opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]';

const TABS = [
  { id: 'math', label: 'LaTeX Math' },
  { id: 'diagram', label: 'Mermaid Flow' },
  { id: 'ai', label: 'AI Rewrite' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TRUST_BADGES = [
  '100% Offline (IndexedDB)',
  'BYOK AI — Keys Never Leave Your Browser',
  'Live Share & Real-Time Collaboration',
  'No Account Required',
];

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('math');

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 blur-[140px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1
          className={`${FADE_UP} font-mono text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground max-w-4xl mx-auto leading-[1.05] mb-6`}
        >
          The private, AI-powered Markdown workspace.
        </h1>

        <p
          style={{ animationDelay: '80ms' }}
          className={`${FADE_UP} text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed`}
        >
          A local-first editor with live preview, LaTeX math, 12+ diagram engines, a full multi-format
          file viewer, bring-your-own-key AI writing, and real-time collaboration — all stored in your
          browser. No account, no server, no lock-in.
        </p>

        <div
          style={{ animationDelay: '160ms' }}
          className={`${FADE_UP} flex flex-col sm:flex-row items-center justify-center gap-4 mb-12`}
        >
          <a href={APP_URL} target="_blank" rel="noreferrer">
            <Button size="lg" className="w-full sm:w-auto font-medium text-sm h-12 px-8">
              Launch Web Editor Free
            </Button>
          </a>
          <a href="#demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium text-sm h-12 px-6">
              <Play className="h-4 w-4 mr-2" /> See Interactive Demo
            </Button>
          </a>
        </div>

        <div
          style={{ animationDelay: '240ms' }}
          className={`${FADE_UP} flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground mb-12`}
        >
          {TRUST_BADGES.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        <div
          style={{ animationDelay: '320ms' }}
          className={`${FADE_UP} relative max-w-5xl mx-auto rounded-[var(--radius)] border border-border bg-card overflow-hidden text-left`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-secondary/30 text-xs select-none">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-accent-warn/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
              </div>
              <span className="text-muted-foreground font-mono text-[11px]">Dnyx Draft — quantum-spec.md</span>
            </div>

            <div className="flex items-center gap-1 bg-secondary/60 p-0.5 rounded-[var(--radius)] text-[11px] font-medium">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-card text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabCrossfade}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-background font-mono text-xs p-5 sm:p-6 min-h-[300px]"
            >
              <div className="space-y-2.5 pr-0 md:pr-4 text-foreground overflow-hidden">
                {activeTab === 'math' && (
                  <>
                    <div className="text-primary font-semibold"># Quantum State Evolution</div>
                    <div className="text-muted-foreground">The Lindblad master equation for open quantum systems:</div>
                    <div className="p-2.5 rounded-[var(--radius)] bg-secondary/40 text-foreground font-medium text-[11px]">
                      {
                        '$$\\frac{d\\rho}{dt} = -\\frac{i}{\\hbar}[H, \\rho] + \\sum_{k} \\left( L_k \\rho L_k^\\dagger - \\frac{1}{2}\\{L_k^\\dagger L_k, \\rho\\} \\right)$$'
                      }
                    </div>
                    <div className="text-muted-foreground italic text-[11px]">&gt; Stored securely in Dexie.js IndexedDB.</div>
                  </>
                )}

                {activeTab === 'diagram' && (
                  <>
                    <div className="text-primary font-semibold"># Architecture Flow</div>
                    <div className="p-2.5 rounded-[var(--radius)] bg-secondary/40 text-foreground font-medium text-[11px] leading-relaxed">
                      ```mermaid
                      <br />
                      flowchart LR
                      <br />
                      &nbsp;&nbsp;Editor[Editor Input] --&gt; Parser[12+ Diagram Engines]
                      <br />
                      &nbsp;&nbsp;Parser --&gt; DB[(IndexedDB)]
                      <br />
                      &nbsp;&nbsp;DB --&gt; Vault[AES-256 Vault]
                      <br />
                      ```
                    </div>
                  </>
                )}

                {activeTab === 'ai' && (
                  <>
                    <div className="text-primary font-semibold"># Release Notes (draft)</div>
                    <div className="text-muted-foreground">fixd the bug where users cant export</div>
                    <div className="text-muted-foreground">their doc as word file its really annoying</div>
                    <div className="p-2.5 rounded-[var(--radius)] bg-accent-warn/5 text-accent-warn font-medium text-[11px] border border-dashed border-accent-warn/30">
                      &gt; Selection sent to your own Anthropic / OpenAI key — “Fix grammar”
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3.5 pl-0 md:pl-4 pt-4 md:pt-0 font-sans">
                {activeTab === 'math' && (
                  <>
                    <h2 className="text-base font-medium text-foreground border-b border-border pb-1">
                      Quantum State Evolution
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      The Lindblad master equation for open quantum systems:
                    </p>
                    <div className="p-3 rounded-[var(--radius)] bg-primary/5 border border-primary/20 text-center text-sm text-primary font-medium">
                      {'dρ/dt = -(i/ℏ)[H, ρ] + 𝒟[ρ]'}
                    </div>
                  </>
                )}

                {activeTab === 'diagram' && (
                  <>
                    <h2 className="text-base font-medium text-foreground border-b border-border pb-1">
                      Architecture Flow
                    </h2>
                    <div className="p-3 rounded-[var(--radius)] bg-secondary/40 border border-border flex flex-wrap items-center justify-around gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded bg-primary text-primary-foreground font-medium">Editor Input</span>
                      <span className="text-muted-foreground">&rarr;</span>
                      <span className="px-2.5 py-1 rounded bg-foreground text-background font-medium">IndexedDB</span>
                      <span className="text-muted-foreground">&rarr;</span>
                      <span className="px-2.5 py-1 rounded bg-accent-warn text-accent-warn-foreground font-medium">AES-256 Vault</span>
                    </div>
                  </>
                )}

                {activeTab === 'ai' && (
                  <>
                    <h2 className="text-base font-medium text-foreground border-b border-border pb-1">
                      Release Notes (draft)
                    </h2>
                    <p className="text-foreground text-xs leading-relaxed">
                      Fixed the bug where users couldn&apos;t export their document as a Word file — it was
                      really annoying.
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-accent-warn font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-warn" />
                      <span>Rewritten with your own API key — nothing sent to Dnyx servers</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-border bg-secondary/30 text-[11px] text-muted-foreground select-none">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">
                  Ctrl+K
                </kbd>{' '}
                Command Palette
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">
                  Alt+H
                </kbd>{' '}
                Version Diff
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">
                  Ctrl+F
                </kbd>{' '}
                Find &amp; Replace
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-primary font-medium">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Local Engine Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
