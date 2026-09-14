import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

const SITE_URL = 'https://draft.dnyxgroup.com';
const APP_NAME = 'Dnyx Draft';
const APP_TITLE = 'Dnyx Draft — Online Markdown Editor & Live Preview';
const APP_DESCRIPTION =
  'Fast, local-first Markdown editor with real-time GitHub-Flavored preview, LaTeX math formulas, Mermaid diagrams, multi-document workspace, and instant export.';

/** All 15 supported hreflang locales. */
const LOCALE_ALTERNATES: Record<string, string> = {
  en: SITE_URL,
  'zh-Hans': `${SITE_URL}/?lang=zh`,
  ja: `${SITE_URL}/?lang=ja`,
  ko: `${SITE_URL}/?lang=ko`,
  fr: `${SITE_URL}/?lang=fr`,
  de: `${SITE_URL}/?lang=de`,
  es: `${SITE_URL}/?lang=es`,
  'pt-BR': `${SITE_URL}/?lang=pt-BR`,
  ru: `${SITE_URL}/?lang=ru`,
  ar: `${SITE_URL}/?lang=ar`,
  hi: `${SITE_URL}/?lang=hi`,
  bg: `${SITE_URL}/?lang=bg`,
  tr: `${SITE_URL}/?lang=tr`,
  it: `${SITE_URL}/?lang=it`,
  nl: `${SITE_URL}/?lang=nl`,
  'x-default': SITE_URL,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: 'Dnyx Tech', url: 'https://github.com/dnyxtech' }],
  generator: 'Next.js',
  keywords: [
    'Markdown editor',
    'Markdown live preview',
    'online markdown viewer',
    'LaTeX math editor',
    'Mermaid diagram viewer',
    'local first markdown',
    'browser markdown editor',
    'GFM previewer',
    'developer markdown tool',
    'редактор markdown',
    'markdown Bearbeitung',
    'éditeur markdown',
    'editor markdown online',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Dnyx Tech',
  publisher: 'Dnyx Tech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: LOCALE_ALTERNATES,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/logo_trans.png',
    apple: '/assets/logo_trans.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: [
      'zh_CN',
      'ja_JP',
      'ko_KR',
      'fr_FR',
      'de_DE',
      'es_ES',
      'pt_BR',
      'ru_RU',
      'ar_SA',
      'hi_IN',
      'bg_BG',
      'tr_TR',
      'it_IT',
    ],
    url: SITE_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/assets/logo_with_name.png',
        width: 2000,
        height: 2000,
        alt: 'Dnyx Draft Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ['/assets/logo_with_name.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification token here.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: APP_NAME,
  url: SITE_URL,
  description: APP_DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  inLanguage: [
    'en',
    'zh',
    'ja',
    'ko',
    'fr',
    'de',
    'es',
    'pt-BR',
    'ru',
    'ar',
    'hi',
    'bg',
    'tr',
    'it',
    'nl',
  ],
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Live GitHub Flavored Markdown (GFM) preview',
    'Full LaTeX math support with KaTeX',
    'Interactive Mermaid diagram rendering',
    'Local-first offline storage via IndexedDB',
    'AES-256-GCM client-side encrypted secret workspace',
    'Multi-document tab manager & folder explorer',
    'Export to Markdown, HTML, PDF, DOCX, and PNG',
    'Instant read-only snapshot sharing',
    'Live collaborative editing',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning prevents false positives from browser extensions injecting scripts */}
      <head suppressHydrationWarning>
        {/* Critical font preloads for LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data */}
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
