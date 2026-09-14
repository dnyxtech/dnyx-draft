'use client';

import type React from 'react';
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.min.css';
import { Check, Copy, Link2, Palette } from 'lucide-react';
import { db } from '@/lib/db';
import { type PreviewTheme, useSettingsStore } from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { cn } from '@/lib/utils';
import { ABCViewer } from './diagrams/ABCViewer';
import { GeoMapViewer } from './diagrams/GeoMapViewer';
import { KrokiViewer } from './diagrams/KrokiViewer';
import { MarkmapViewer } from './diagrams/MarkmapViewer';
import { STLViewer } from './diagrams/STLViewer';
import { VegaLiteViewer } from './diagrams/VegaLiteViewer';
import { MermaidViewer } from './MermaidViewer';
import { TableOfContents } from './TableOfContents';

interface MarkdownPreviewProps {
  content: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  findQuery?: string;
}

const THEME_LABELS: Record<PreviewTheme, string> = {
  github: 'GitHub',
  dracula: 'Dracula',
  minimal: 'Minimal',
  academic: 'Academic',
  serif: 'Serif',
};

const THEME_CLASSES: Record<PreviewTheme, string> = {
  github: 'preview-theme-github',
  dracula: 'preview-theme-dracula',
  minimal: 'preview-theme-minimal',
  academic: 'preview-theme-academic',
  serif: 'preview-theme-serif',
};

// Allow safe custom tags while blocking dangerous elements. Also allow the
// `dnyx-blob:` protocol on img[src] so locally-stored inline images (see
// InlineBlobImage below) aren't stripped by the sanitizer before they reach
// the custom img renderer.
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'mark', 'sup', 'sub'],
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? []), 'dnyx-blob'],
  },
};

const INLINE_BLOB_PREFIX = 'dnyx-blob:';

// react-markdown runs its own URL sanitizer (independent of rehype-sanitize)
// with a hardcoded protocol allowlist that doesn't include custom schemes.
// Let `dnyx-blob:` URIs through; defer to the default behavior otherwise.
function urlTransform(value: string): string {
  return value.startsWith(INLINE_BLOB_PREFIX) ? value : defaultUrlTransform(value);
}

// Reference-counted cache of resolved object URLs, keyed by blobId, so the
// same inline image referenced multiple times (or re-rendered) doesn't
// re-fetch from Dexie or leak duplicate object URLs. Revoked once the last
// consumer unmounts.
const inlineBlobUrlCache = new Map<string, { url: string; refCount: number }>();

function useInlineBlobUrl(blobId: string | null) {
  const [state, setState] = useState<{ url: string | null; status: 'loading' | 'ready' | 'error' }>(
    { url: null, status: 'loading' },
  );

  useEffect(() => {
    if (!blobId) {
      setState({ url: null, status: 'error' });
      return;
    }

    const cached = inlineBlobUrlCache.get(blobId);
    if (cached) {
      cached.refCount++;
      setState({ url: cached.url, status: 'ready' });
      return () => {
        cached.refCount--;
        if (cached.refCount <= 0) {
          URL.revokeObjectURL(cached.url);
          inlineBlobUrlCache.delete(blobId);
        }
      };
    }

    let cancelled = false;
    setState({ url: null, status: 'loading' });

    (async () => {
      if (!db) return;
      const blob = await db.blobs.get(blobId);
      if (cancelled) return;
      if (!blob) {
        setState({ url: null, status: 'error' });
        return;
      }
      const url = URL.createObjectURL(new Blob([blob.data], { type: blob.mimeType }));
      inlineBlobUrlCache.set(blobId, { url, refCount: 1 });
      setState({ url, status: 'ready' });
    })();

    return () => {
      cancelled = true;
      const entry = inlineBlobUrlCache.get(blobId);
      if (entry) {
        entry.refCount--;
        if (entry.refCount <= 0) {
          URL.revokeObjectURL(entry.url);
          inlineBlobUrlCache.delete(blobId);
        }
      }
    };
  }, [blobId]);

  return state;
}

function InlineBlobImage({
  src,
  alt,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src?: string | Blob }) {
  const srcString = typeof src === 'string' ? src : undefined;
  const isInlineBlob = srcString?.startsWith(INLINE_BLOB_PREFIX) ?? false;
  const blobId = isInlineBlob ? (srcString as string).slice(INLINE_BLOB_PREFIX.length) : null;
  const { url, status } = useInlineBlobUrl(blobId);

  if (!isInlineBlob) {
    return <img src={srcString} alt={alt} {...props} />;
  }
  if (status === 'loading') {
    return (
      <span className="inline-block px-3 py-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
        Loading image…
      </span>
    );
  }
  if (status === 'error' || !url) {
    return (
      <span className="inline-block px-3 py-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 rounded">
        Image not found
      </span>
    );
  }
  return <img src={url} alt={alt} {...props} />;
}

// Highlight find query matches in plain text content
function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  } catch {
    return text;
  }
}

const CodeBlock = ({
  language,
  value,
  nodes,
  findQuery,
}: {
  language: string;
  value: string;
  nodes: React.ReactNode;
  findQuery?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0b0f19] shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/60 select-none">
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 rounded transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed !bg-transparent">
        <code className={language ? `language-${language}` : ''}>
          {findQuery ? highlightMatches(value, findQuery) : nodes}
        </code>
      </pre>
    </div>
  );
};

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content, onScroll, findQuery }, ref) => {
    const {
      documents,
      activeDocumentId,
      setActiveDocument,
      createDocument,
      previewScrollPositions,
      setPreviewScrollPosition,
    } = useWorkspaceStore();
    const { previewTheme, setPreviewTheme, textDirection } = useSettingsStore();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [themePanelOpen, setThemePanelOpen] = useState(false);
    const themePanelRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Restore scroll position when the active document changes.
    // biome-ignore lint/correctness/useExhaustiveDependencies: restoring on doc switch is intentional
    useLayoutEffect(() => {
      if (!scrollContainerRef.current || !activeDocumentId) return;
      const saved = previewScrollPositions[activeDocumentId] ?? 0;
      scrollContainerRef.current.scrollTop = saved;
    }, [activeDocumentId]);

    // Close theme panel on click-outside.
    useEffect(() => {
      if (!themePanelOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) {
          setThemePanelOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [themePanelOpen]);

    // Pre-process content: WikiLinks + ==highlight== + ^sup^
    const processedContent = useMemo(() => {
      return content
        .replace(/\[\[(.*?)\]\]/g, (_, title) => {
          const cleanTitle = title.trim();
          return `[🔗 ${cleanTitle}](#wikilink:${encodeURIComponent(cleanTitle)})`;
        })
        .replace(/==([^=]+)==/g, '<mark>$1</mark>')
        .replace(/\^([^^]+)\^/g, '<sup>$1</sup>');
    }, [content]);

    const handleScrollInternal = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const progress =
        target.scrollHeight > target.clientHeight
          ? (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100
          : 0;
      setScrollProgress(progress);
      if (activeDocumentId) {
        setPreviewScrollPosition(activeDocumentId, target.scrollTop);
      }
      onScroll?.(e);
    };

    const handleWikiLinkClick = (title: string) => {
      const match = documents.find(
        (d) =>
          !d.isTrash &&
          (d.title.toLowerCase() === title.toLowerCase() ||
            d.title.toLowerCase() === `${title.toLowerCase()}.md`),
      );
      if (match) {
        setActiveDocument(match.id);
      } else {
        const create = confirm(`Document "${title}" not found. Create it?`);
        if (create) createDocument(title.endsWith('.md') ? title : `${title}.md`);
      }
    };

    return (
      <div
        className={cn(
          'relative h-full flex flex-col bg-white dark:bg-[#090d16] transition-colors',
          THEME_CLASSES[previewTheme],
        )}
        dir={textDirection}
      >
        {/* Reading Progress Bar */}
        <div
          className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-75 z-10 shrink-0"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress))}%` }}
        />

        {/* Theme switcher button */}
        <div className="absolute top-3 right-3 z-20" ref={themePanelRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemePanelOpen((p) => !p)}
              className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs backdrop-blur-sm transition-all"
              title="Change preview theme"
            >
              <Palette className="h-3.5 w-3.5" />
            </button>

            {themePanelOpen && (
              <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 min-w-[130px] z-50">
                {(Object.keys(THEME_LABELS) as PreviewTheme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setPreviewTheme(t);
                      setThemePanelOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all',
                      previewTheme === t
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                    )}
                  >
                    {THEME_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          ref={(node) => {
            scrollContainerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onScroll={handleScrollInternal}
          className="relative flex-1 overflow-y-auto"
        >
          <TableOfContents content={content} />

          <div className={cn('mx-auto markdown-body', getThemeContentClass(previewTheme))}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath, [remarkEmoji, { accessible: true }]]}
              rehypePlugins={[
                rehypeRaw,
                [rehypeSanitize, sanitizeSchema],
                rehypeKatex,
                rehypeHighlight,
              ]}
              urlTransform={urlTransform}
              components={{
                img: InlineBlobImage,
                a({ href, children, ...props }) {
                  if (href?.startsWith('#wikilink:')) {
                    const docTitle = decodeURIComponent(href.replace('#wikilink:', ''));
                    return (
                      <button
                        type="button"
                        onClick={() => handleWikiLinkClick(docTitle)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200 dark:border-blue-800/60 hover:underline cursor-pointer align-baseline mx-0.5"
                      >
                        <Link2 className="h-3 w-3 text-blue-500" />
                        <span>{children}</span>
                      </button>
                    );
                  }
                  return (
                    <a href={href} target="_blank" rel="noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeText = String(children).replace(/\n$/, '');

                  // Diagram routing
                  if (language === 'mermaid') return <MermaidViewer chart={codeText} />;
                  if (language === 'markmap') return <MarkmapViewer source={codeText} />;
                  if (language === 'vega-lite' || language === 'vegalite')
                    return <VegaLiteViewer spec={codeText} />;
                  if (language === 'abc') return <ABCViewer notation={codeText} />;
                  if (language === 'plantuml')
                    return <KrokiViewer source={codeText} engine="plantuml" />;
                  if (language === 'dot' || language === 'graphviz')
                    return <KrokiViewer source={codeText} engine="graphviz" />;
                  if (language === 'd2') return <KrokiViewer source={codeText} engine="d2" />;
                  if (language === 'wavedrom')
                    return <KrokiViewer source={codeText} engine="wavedrom" />;
                  if (language === 'erd') return <KrokiViewer source={codeText} engine="erd" />;
                  if (language === 'pikchr')
                    return <KrokiViewer source={codeText} engine="pikchr" />;
                  if (language === 'geojson')
                    return <GeoMapViewer data={codeText} type="geojson" />;
                  if (language === 'topojson')
                    return <GeoMapViewer data={codeText} type="topojson" />;
                  if (language === 'stl') return <STLViewer source={codeText} />;

                  if (className?.includes('language-'))
                    return (
                      <CodeBlock
                        language={language}
                        value={codeText}
                        nodes={children}
                        findQuery={findQuery}
                      />
                    );

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  },
);

MarkdownPreview.displayName = 'MarkdownPreview';

function getThemeContentClass(theme: PreviewTheme): string {
  switch (theme) {
    case 'minimal':
      return 'max-w-2xl px-6 md:px-10 py-8';
    case 'academic':
      return 'max-w-3xl px-8 md:px-12 py-10';
    case 'dracula':
      return 'max-w-4xl px-6 md:px-10 py-8';
    case 'serif':
      return 'max-w-3xl px-6 md:px-10 py-8';
    default:
      return 'max-w-4xl px-6 md:px-10 py-8';
  }
}
