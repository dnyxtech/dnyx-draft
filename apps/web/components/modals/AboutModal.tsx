'use client';

import { ExternalLink, FileText, Megaphone, MessageCircleQuestion, Scale } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CHANGELOG_URL, NEW_ISSUE_URL, REPO_URL } from '@/lib/constants';
import { APP_VERSION } from './ReleaseNotesModal';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINKS = [
  {
    href: REPO_URL,
    icon: ExternalLink,
    label: 'View source on GitHub',
    description: 'Dnyx Draft is fully open source, MIT licensed',
  },
  {
    href: `${REPO_URL}/blob/main/LICENSE`,
    icon: Scale,
    label: 'MIT License',
    description: 'Free to use, modify, and self-host',
  },
  {
    href: CHANGELOG_URL,
    icon: Megaphone,
    label: 'Release notes & changelog',
    description: `Currently on v${APP_VERSION}`,
  },
  {
    href: 'https://draft.dnyxgroup.com/#faq',
    icon: MessageCircleQuestion,
    label: 'Frequently asked questions',
    description: 'Answers on privacy, storage, and features',
  },
];

export const AboutModal: React.FC<AboutModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* biome-ignore lint/performance/noImgElement: small static brand mark, next/image is overkill */}
            <img src="/assets/logo_trans.png" alt="Dnyx Draft" className="h-8 w-8" />
            Dnyx Draft
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              v{APP_VERSION}
            </span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          A local-first Markdown workspace with live preview, diagram engines, and zero-login
          IndexedDB storage. Developed and maintained by{' '}
          <span className="font-medium text-slate-800 dark:text-slate-200">Dnyx Tech</span>.
        </p>

        <div className="space-y-1">
          {LINKS.map(({ href, icon: Icon, label, description }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{description}</p>
              </div>
            </a>
          ))}
        </div>

        <a
          href={`${NEW_ISSUE_URL}?title=${encodeURIComponent('[Bug]: ')}&body=${encodeURIComponent(
            `**Describe the bug**\n\n\n**Steps to reproduce**\n\n\n**Environment**\n- App version: v${APP_VERSION}\n- Browser: \n`,
          )}&labels=bug`}
          target="_blank"
          rel="noreferrer"
        >
          <Button type="button" variant="outline" className="w-full">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Report an Issue
          </Button>
        </a>
      </DialogContent>
    </Dialog>
  );
};
