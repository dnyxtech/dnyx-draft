import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import type React from 'react';
import '../styles/globals.css';
import { Providers } from './providers';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dnyx Draft — Local-First Markdown Workspace with BYOK AI',
  description:
    'Private, local-first Markdown editor with live preview, LaTeX math, 12+ diagram engines, a multi-format file viewer, bring-your-own-key AI writing, and real-time collaboration.',
  keywords: [
    'markdown editor',
    'live preview',
    'katex math',
    'mermaid diagrams',
    'byok ai writing assistant',
    'real-time collaboration',
    'aes-256 vault',
    'local first',
    'docx export',
    'readme generator',
  ],
  authors: [{ name: 'Dnyx Tech', url: 'https://github.com/dnyxtech' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plexSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
