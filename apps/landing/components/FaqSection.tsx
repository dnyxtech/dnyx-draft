'use client';

import {
  Database,
  DollarSign,
  FileCode2,
  FolderOpen,
  GitCompare,
  Globe,
  Lock,
  Mic,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Section, SectionHeader } from './ui/Section';

interface FaqItem {
  question: string;
  answer: string;
  icon: LucideIcon;
}

const FAQS: FaqItem[] = [
  {
    icon: Database,
    question: 'Where is my data stored? Does it touch any servers?',
    answer:
      'All your documents, folders, and settings are stored 100% client-side inside your browser’s IndexedDB database using Dexie.js. No documents, keystrokes, or metadata are transmitted to any remote server.',
  },
  {
    icon: Lock,
    question: 'How does client-side AES-256 password encryption work?',
    answer:
      'When you lock a document, your passphrase derives a 256-bit AES key via PBKDF2 (100,000 rounds) using the WebCrypto API. The document content is encrypted using AES-GCM and stored as ciphertext in IndexedDB. Without your secret passphrase, it cannot be decrypted even with direct disk access.',
  },
  {
    icon: FileCode2,
    question: 'Can I export my notes to Microsoft Word or a ZIP archive?',
    answer:
      'Yes. You can export any document directly as a styled Microsoft Word document (.docx) or download your complete workspace organized by folders in a single .zip file at any time with one click.',
  },
  {
    icon: GitCompare,
    question: 'How does Document Version History and Diff comparison work?',
    answer:
      'You can create version snapshots with custom descriptions at any milestone. The built-in diff viewer provides a Git-style line-by-line comparison with green added and red deleted highlights, with instant one-click rollback.',
  },
  {
    icon: Mic,
    question: 'Is voice-to-text dictation really free with no subscription?',
    answer:
      'Yes. Voice dictation is powered entirely by the browser’s built-in Web Speech API. There are no API keys, no subscription tiers, and no cloud service fees required.',
  },
  {
    icon: FolderOpen,
    question: 'Can I open directories from my local hard drive?',
    answer:
      'Yes. Dnyx Draft supports the Web File System Access API. Click the HardDrive icon in the sidebar to open any folder from your PC and edit markdown files in-place.',
  },
  {
    icon: FileCode2,
    question: 'Which syntax formats and diagram types are supported?',
    answer:
      'Dnyx Draft supports standard GitHub Flavored Markdown (GFM), inline and block LaTeX math formulas via KaTeX ($...$ and $$...$$), 12+ diagram engines (Mermaid, Markmap, Vega-Lite, PlantUML, Graphviz/DOT, D2, WaveDrom, ERD, Pikchr, ABC notation, GeoJSON maps, and 3D STL models), syntax-highlighted code blocks, and WikiLinks ([[Document Title]]).',
  },
  {
    icon: Sparkles,
    question: 'How does the AI writing assistant work, and is it really private?',
    answer:
      'Dnyx Draft is bring-your-own-key (BYOK): you add your own Anthropic (Claude) or OpenAI API key, which is AES-GCM encrypted and stored locally, unlocked per session with a passphrase. When you use an AI action — summarize, fix grammar, rewrite, shorten, or generate a diagram — the request goes directly from your browser to the provider. Dnyx Draft has no backend in the loop and never sees your key, prompts, or documents.',
  },
  {
    icon: Users,
    question: 'How does Live Share collaboration work without an account?',
    answer:
      'Start a Live Share session from any document and send collaborators an invite link. You choose whether they join as a host, editor, or viewer. Content polls and syncs roughly every two seconds, so everyone sees near-real-time edits — no sign-up required on either side.',
  },
  {
    icon: FileCode2,
    question: 'What is the README Builder?',
    answer:
      'A dedicated wizard at /readme-builder that generates a polished, exportable README section by section — title, description, features, tech stack, install steps, folder structure, API reference, FAQ, and more. Point it at a GitHub repo (using an encrypted personal access token vault) to pull in live metadata automatically.',
  },
  {
    icon: DollarSign,
    question: 'Is Dnyx Draft really free? What about Notion, Obsidian, and other alternatives?',
    answer:
      'Yes — Dnyx Draft is free and open source, with no seats, tiers, or paywalled features. Compare that to Notion (free tier, then $10–$20/user/month), Obsidian (free personally, $50/user/year suggested for commercial use, $4/month for Sync), Typora ($14.99 one-time license), or HackMD (free for 3 seats, then $5/user/month) — Dnyx Draft has no plan to upgrade into.',
  },
  {
    icon: Globe,
    question: 'Does Dnyx Draft work offline and in other languages?',
    answer:
      'Yes. Dnyx Draft is a PWA with a service worker for offline caching, so you can install it as a standalone app and keep working without a connection. The interface is fully localized across 15 languages, including English, Chinese, Japanese, Korean, French, German, Spanish, Portuguese, Russian, Arabic, Hindi, Bulgarian, Turkish, Italian, and Dutch.',
  },
];

export const FaqSection: React.FC = () => {
  return (
    <Section id="faq" tone="default" containerClassName="max-w-3xl">
      <SectionHeader
        align="center"
        title="Frequently asked questions"
        description="Everything you need to know about privacy, storage, and engine capabilities."
      />

      <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
        {FAQS.map((faq, idx) => (
          <AccordionItem key={faq.question} value={`item-${idx}`}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <faq.icon className="h-4 w-4 text-primary shrink-0" />
                <span>{faq.question}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};
