'use client';

import { AlertTriangle } from 'lucide-react';

interface SvgPreviewPaneProps {
  lastValidSource: string;
  error: string | null;
}

export function SvgPreviewPane({ lastValidSource, error }: SvgPreviewPaneProps) {
  const srcDoc = `<!doctype html><html><head><style>html,body{margin:0;height:100%;display:flex;align-items:center;justify-content:center;background:transparent}svg{width:90%;height:90%;max-width:90%;max-height:90%}</style></head><body>${lastValidSource}</body></html>`;

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-start gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
      )}
      <div className={`flex-1 min-h-0 ${error ? 'opacity-50' : ''}`}>
        {lastValidSource ? (
          <iframe
            key={lastValidSource}
            sandbox=""
            srcDoc={srcDoc}
            title="SVG preview"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            Nothing to preview yet
          </div>
        )}
      </div>
    </div>
  );
}
