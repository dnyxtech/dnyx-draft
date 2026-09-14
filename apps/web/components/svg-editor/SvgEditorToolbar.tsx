'use client';

import { ArrowLeft, Check, ClipboardCopy, Code2, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SvgEditorToolbarProps {
  source: string;
}

export function SvgEditorToolbar({ source }: SvgEditorToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!source.trim()) {
      toast.error('Nothing to copy yet!');
      return;
    }
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Could not access clipboard');
    }
  };

  const handleDownload = () => {
    if (!source.trim()) {
      toast.error('Nothing to download yet!');
      return;
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'drawing.svg';
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success('drawing.svg downloaded!');
  };

  return (
    <header className="h-13 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md px-4 shrink-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Editor</span>
        </Link>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">SVG Editor</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={!source.trim()}
          className="text-xs h-8 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <FileDown className="h-3.5 w-3.5 sm:mr-1" />
          <span className="hidden sm:inline">Download .svg</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!source.trim()}
          className="text-xs h-8"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 sm:mr-1 text-emerald-500" />
          ) : (
            <ClipboardCopy className="h-3.5 w-3.5 sm:mr-1" />
          )}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy SVG'}</span>
        </Button>
      </div>
    </header>
  );
}
