'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { APP_URL, README_BUILDER_URL, REPO_URL, SPONSOR_URL } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-12 select-none">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-[var(--radius)] bg-primary flex items-center justify-center text-primary-foreground font-mono text-sm">
                D
              </div>
              <span className="font-mono font-medium text-foreground text-base tracking-tight">Dnyx Draft</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The local-first Markdown workspace with BYOK AI writing, live collaboration, and a
              multi-format file viewer — built for software engineers, technical writers, and
              researchers. Zero cloud lock-in, 100% privacy.
            </p>

            <div className="pt-2 text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">Dnyx Tech</div>
              <div>A Division of Dnyx Business Solutions Private Limited</div>
              <div className="text-[11px] text-muted-foreground/70">Part of Dnyx Group</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-medium text-foreground">Product</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href={APP_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Launch Web App
                </a>
              </li>
              <li>
                <a href={README_BUILDER_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  README Builder
                </a>
              </li>
              <li>
                <a href="#ai" className="hover:text-primary transition-colors">
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-primary transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-primary transition-colors">
                  Comparison Matrix
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-medium text-foreground">Architecture &amp; Privacy</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {[
                '100% Client-Side Engine',
                'Dexie.js IndexedDB Storage',
                'WebCrypto AES-256-GCM Vault',
                'BYOK AI — Direct to Provider',
              ].map((line) => (
                <li key={line} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-medium text-foreground">Legal &amp; Policies</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-primary transition-colors">
                  Security Model
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Dnyx Tech. A Division of Dnyx Business Solutions Private Limited (Dnyx Group). All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/security" className="hover:underline">Security</Link>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <GithubIcon className="h-3.5 w-3.5" /> Source
            </a>
            <a href={SPONSOR_URL} target="_blank" rel="noreferrer" className="hover:underline">
              Sponsor
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
