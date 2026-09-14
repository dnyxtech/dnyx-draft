'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_SVG } from '@/components/svg-editor/constants';
import { SvgCodeEditor } from '@/components/svg-editor/SvgCodeEditor';
import { SvgEditorToolbar } from '@/components/svg-editor/SvgEditorToolbar';
import { SvgPreviewPane } from '@/components/svg-editor/SvgPreviewPane';

function parseSvgSource(source: string): { valid: boolean; error: string | null } {
  if (!source.trim()) return { valid: false, error: null };
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    return { valid: false, error: parserError.textContent?.trim() || 'Invalid SVG/XML markup' };
  }
  if (doc.documentElement.nodeName.toLowerCase() !== 'svg') {
    return { valid: false, error: 'Root element must be <svg>' };
  }
  return { valid: true, error: null };
}

export default function SvgEditorPage() {
  const [source, setSource] = useState(DEFAULT_SVG);
  const [lastValidSource, setLastValidSource] = useState(DEFAULT_SVG);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = parseSvgSource(source);
      setError(result.error);
      if (result.valid) setLastValidSource(source);
    }, 180);
    return () => clearTimeout(timer);
  }, [source]);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0d1117] text-slate-900 dark:text-slate-100 overflow-hidden">
      <SvgEditorToolbar source={source} />
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        <div className="flex-1 min-w-0 min-h-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <SvgCodeEditor value={source} onChange={setSource} />
        </div>
        <div className="flex-1 min-w-0 min-h-0">
          <SvgPreviewPane lastValidSource={lastValidSource} error={error} />
        </div>
      </div>
    </div>
  );
}
