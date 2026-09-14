'use client';

import {
  AlertTriangle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Bot,
  CheckSquare,
  Code,
  FileSpreadsheet,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Info,
  Italic,
  Laugh,
  Lightbulb,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTree,
  Loader2,
  Mic,
  MicOff,
  Quote,
  Search,
  Shapes,
  Sigma,
  Sparkles,
  Strikethrough,
  Table as TableIcon,
  Type,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { hasSessionPassphrase, loadApiKey } from '@/lib/ai/key-store';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { formatMarkdownDocument } from '@/lib/utils/markdown-formatter';
import { DataConverterModal } from '../modals/DataConverterModal';
import { EmojiPickerModal } from '../modals/EmojiPickerModal';
import { InsertDiagramModal } from '../modals/InsertDiagramModal';
import { InsertMediaModal } from '../modals/InsertMediaModal';
import { TableBuilderModal } from '../modals/TableBuilderModal';

interface EditorToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  onToggleFindReplace: () => void;
  selectionStats?: { words: number; chars: number } | null;
  selectedText?: string | null;
}

interface CustomSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onInsert,
  onToggleFindReplace,
  selectionStats,
  selectedText,
}) => {
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [converterModalOpen, setConverterModalOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [quickTableOpen, setQuickTableOpen] = useState(false);
  const [quickTableHover, setQuickTableHover] = useState<[number, number]>([0, 0]);
  const quickTableRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<CustomSpeechRecognition | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [diagramPromptOpen, setDiagramPromptOpen] = useState(false);
  const [diagramDescription, setDiagramDescription] = useState('');

  const { documents, activeDocumentId, updateDocument } = useWorkspaceStore();
  const { textDirection, setTextDirection } = useSettingsStore();
  const activeDoc = documents.find((d) => d.id === activeDocumentId);

  const handleAutoFormat = () => {
    if (!activeDoc) return;
    const formatted = formatMarkdownDocument(activeDoc.content);
    updateDocument(activeDoc.id, { content: formatted });
    toast.success('Aligned tables and formatted document');
  };

  const handleQuickTable = useCallback(
    (rows: number, cols: number) => {
      const header = `| ${Array.from({ length: cols }, (_, i) => `Col ${i + 1}`).join(' | ')} |`;
      const sep = `| ${Array.from({ length: cols }, () => '---').join(' | ')} |`;
      const body = Array.from(
        { length: rows },
        () => `| ${Array.from({ length: cols }, () => '').join(' | ')} |`,
      );
      onInsert([header, sep, ...body].join('\n') + '\n\n', '');
      setQuickTableOpen(false);
      toast.success(`Inserted ${rows}×${cols} table`);
    },
    [onInsert],
  );

  // Close quick-table picker on click outside
  useEffect(() => {
    if (!quickTableOpen) return;
    const handler = (e: MouseEvent) => {
      if (quickTableRef.current && !quickTableRef.current.contains(e.target as Node)) {
        setQuickTableOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [quickTableOpen]);

  const handleInsertTOC = () => {
    if (!activeDoc) return;
    const lines = activeDoc.content.split('\n');
    const tocItems: string[] = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const anchor = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        const indent = '  '.repeat(level - 1);
        tocItems.push(`${indent}- [${title}](#${anchor})`);
      }
    }

    if (tocItems.length === 0) {
      toast.error('No headings found to generate Table of Contents.');
      return;
    }

    const tocBlock = `## Table of Contents\n\n${tocItems.join('\n')}\n\n---\n\n`;
    onInsert(tocBlock, '');
    toast.success(`Generated Table of Contents with ${tocItems.length} headings`);
  };

  const handleInsertCallout = (type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION') => {
    onInsert(`> [!${type}]\n> `, '', 'Enter callout message here...');
    toast.success(`Inserted [!${type}] callout block`);
  };

  const callAi = async (prompt: string, key: string): Promise<string> => {
    if (key.startsWith('sk-ant-')) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      return data?.content?.[0]?.text ?? '';
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? '';
  };

  const getAiKey = async (): Promise<string | null> => {
    if (!hasSessionPassphrase()) {
      toast.error('Open Settings → AI and unlock with your passphrase first.');
      return null;
    }
    const key =
      (await loadApiKey('anthropic').catch(() => null)) ??
      (await loadApiKey('openai').catch(() => null));
    if (!key) {
      toast.error('No AI key stored. Open Settings → AI to save one.');
      return null;
    }
    return key;
  };

  const handleAiAction = async (action: 'summarize' | 'fix-grammar' | 'concise') => {
    if (!activeDoc) return;
    const key = await getAiKey();
    if (!key) return;
    setAiLoading(true);
    try {
      // Use selected text if available, otherwise fall back to full document
      const input =
        selectedText && selectedText.trim().length > 0
          ? selectedText.trim()
          : activeDoc.content.slice(0, 8000);
      const isSelection = !!(selectedText && selectedText.trim().length > 0);
      const prompts: Record<typeof action, string> = {
        summarize: `Summarize the following markdown in 3-5 bullet points. Output only markdown:\n\n${input}`,
        'fix-grammar': `Fix grammar and spelling in the following markdown. Preserve all formatting. Output only the corrected markdown:\n\n${input}`,
        concise: `Make the following markdown more concise. Preserve structure. Output only markdown:\n\n${input}`,
      };
      const result = await callAi(prompts[action], key);
      if (!result) {
        toast.error('AI returned empty response');
        return;
      }
      if (isSelection) {
        onInsert(result, '');
        toast.success(`Selection updated by AI (${action})`);
      } else {
        updateDocument(activeDoc.id, { content: result });
        toast.success(`Document updated by AI (${action})`);
      }
    } catch (e) {
      toast.error(`AI action failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiDiagram = async () => {
    if (!diagramDescription.trim()) {
      toast.error('Please describe the diagram first.');
      return;
    }
    const key = await getAiKey();
    if (!key) return;
    setAiLoading(true);
    setDiagramPromptOpen(false);
    try {
      const prompt = `Generate a Mermaid diagram for the following description. Output ONLY a fenced mermaid code block, nothing else:\n\n${diagramDescription.trim()}`;
      const result = await callAi(prompt, key);
      if (!result) {
        toast.error('AI returned empty response');
        return;
      }
      onInsert('\n\n' + result + '\n\n', '');
      setDiagramDescription('');
      toast.success('Diagram inserted');
    } catch (e) {
      toast.error(`Diagram generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Browser-native Web Speech API setup
  const toggleVoiceDictation = () => {
    if (typeof window === 'undefined') return;

    // @ts-expect-error - Web Speech API
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      toast.error('Voice dictation is supported in Chrome, Edge, Safari, and Chromium browsers.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition: CustomSpeechRecognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim();
          if (transcript) {
            onInsert(` ${transcript} `, '');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 px-2.5 py-1 backdrop-blur-sm select-none transition-colors">
        {/* Text Styles */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('**', '**', 'bold text')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('*', '*', 'italic text')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('~~', '~~', 'strikethrough')}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </Button>

          {/* Typography & Callouts Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                title="Callouts & Admonitions"
              >
                <Type className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Markdown Callout Blocks</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleInsertCallout('NOTE')}>
                <Info className="h-4 w-4 text-blue-500 mr-2" /> Note Callout
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertCallout('TIP')}>
                <Lightbulb className="h-4 w-4 text-emerald-500 mr-2" /> Tip Callout
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertCallout('IMPORTANT')}>
                <AlertTriangle className="h-4 w-4 text-purple-500 mr-2" /> Important
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertCallout('WARNING')}>
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" /> Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleInsertCallout('CAUTION')}>
                <AlertTriangle className="h-4 w-4 text-rose-500 mr-2" /> Caution
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('# ', '', 'Heading 1')}
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('## ', '', 'Heading 2')}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('### ', '', 'Heading 3')}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Lists & Checklist */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('- ', '', 'List item')}
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('1. ', '', 'Numbered item')}
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('- [ ] ', '', 'Task item')}
            title="Task Checklist"
          >
            <CheckSquare className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Blocks, Math, Code, Link */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('> ', '', 'Quote text')}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('```ts\n', '\n```', 'console.log("Hello, World!");')}
            title="Code Block"
          >
            <Code className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('$$\n', '\n$$', 'E = mc^2')}
            title="LaTeX Math Formula"
          >
            <Sigma className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => onInsert('[', '](https://example.com)', 'Link title')}
            title="Insert Hyperlink"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => setMediaModalOpen(true)}
            title="Insert Image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Power Tools */}
        <div className="flex items-center gap-0.5">
          {/* Quick table picker + custom dialog */}
          <div className="relative" ref={quickTableRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60"
              onClick={() => setQuickTableOpen((p) => !p)}
              title="Insert Table — click for quick picker, or use custom builder"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </Button>

            {quickTableOpen && (
              <div className="absolute left-0 top-8 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 min-w-[200px]">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  {quickTableHover[0] > 0
                    ? `${quickTableHover[1]}×${quickTableHover[0]} table`
                    : 'Quick table'}
                </p>
                <div className="grid grid-cols-8 gap-0.5 mb-2">
                  {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => {
                      const r = row + 1;
                      const c = col + 1;
                      const active = r <= quickTableHover[0] && c <= quickTableHover[1];
                      return (
                        <button
                          key={`${r}-${c}`}
                          type="button"
                          className={`h-5 w-5 rounded-sm border transition-colors ${
                            active
                              ? 'bg-blue-500 border-blue-600'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                          }`}
                          onMouseEnter={() => setQuickTableHover([r, c])}
                          onMouseLeave={() => setQuickTableHover([0, 0])}
                          onClick={() => handleQuickTable(r, c)}
                          aria-label={`Insert ${r}×${c} table`}
                        />
                      );
                    }),
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuickTableOpen(false);
                    setTableModalOpen(true);
                  }}
                  className="w-full text-xs text-center px-2 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-medium transition-colors"
                >
                  Custom table builder…
                </button>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
            onClick={() => setConverterModalOpen(true)}
            title="Convert CSV / Excel to Markdown Table"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60"
            onClick={handleAutoFormat}
            title="Auto-Align Tables & Format Document"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
            onClick={handleInsertTOC}
            title="Generate & Insert Table of Contents"
          >
            <ListTree className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={onToggleFindReplace}
            title="Find and Replace (Ctrl+F)"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>

          {/* Text Alignment */}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() =>
              onInsert('<div style="text-align:left">\n', '\n</div>', 'Left aligned text')
            }
            title="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() =>
              onInsert('<div style="text-align:center">\n', '\n</div>', 'Centered text')
            }
            title="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() =>
              onInsert('<div style="text-align:right">\n', '\n</div>', 'Right aligned text')
            }
            title="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() =>
              onInsert('<div style="text-align:justify">\n', '\n</div>', 'Justified text')
            }
            title="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* RTL/LTR toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-7 px-2 w-auto text-[11px] font-bold transition-colors ${
              textDirection === 'rtl'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                : 'text-slate-700 dark:text-slate-300'
            }`}
            onClick={() => setTextDirection(textDirection === 'ltr' ? 'rtl' : 'ltr')}
            title={textDirection === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
          >
            {textDirection === 'ltr' ? 'LTR' : 'RTL'}
          </Button>

          {/* Emoji picker */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60"
            onClick={() => setEmojiPickerOpen(true)}
            title="Insert Emoji"
          >
            <Laugh className="h-3.5 w-3.5" />
          </Button>

          {/* Insert Diagram */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/60"
            onClick={() => setDiagramModalOpen(true)}
            title="Insert Diagram"
          >
            <Shapes className="h-3.5 w-3.5" />
          </Button>

          {/* Voice Dictation (100% Free Browser Web Speech API) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleVoiceDictation}
            className={`h-7 w-7 transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30 hover:bg-red-600'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60'
            }`}
            title={
              isListening
                ? 'Stop Voice Dictation'
                : 'Voice-to-Text Dictation (100% Free Web Speech)'
            }
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </Button>

          {/* AI Actions */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={aiLoading}
                  className="h-7 w-7 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/60"
                  title={selectedText ? 'AI Actions — acts on selected text' : 'AI Actions (BYOK)'}
                >
                  {aiLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-[10px] text-slate-400">
                  {selectedText ? 'AI — acts on selection' : 'AI — acts on document'}
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleAiAction('summarize')}>
                  Summarize
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAiAction('fix-grammar')}>
                  Fix grammar &amp; spelling
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAiAction('concise')}>
                  Make more concise
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiagramPromptOpen(true)}>
                  Generate diagram…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Diagram description inline dialog */}
            {diagramPromptOpen && (
              <div className="absolute right-0 top-8 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Describe the diagram
                </p>
                <textarea
                  rows={3}
                  value={diagramDescription}
                  onChange={(e) => setDiagramDescription(e.target.value)}
                  placeholder="e.g. A flowchart showing user login, password check, and redirect to dashboard"
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAiDiagram}
                    disabled={aiLoading}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? 'Generating…' : 'Generate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiagramPromptOpen(false);
                      setDiagramDescription('');
                    }}
                    className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selection stats */}
        {selectionStats && (
          <>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full select-none whitespace-nowrap">
              {selectionStats.words}w · {selectionStats.chars}ch selected
            </span>
          </>
        )}
      </div>

      {/* Modals */}
      <TableBuilderModal
        open={tableModalOpen}
        onOpenChange={setTableModalOpen}
        onInsertTable={(tableText) => onInsert(tableText, '')}
      />
      <DataConverterModal
        open={converterModalOpen}
        onOpenChange={setConverterModalOpen}
        onInsertMarkdown={(mdText) => onInsert(mdText, '')}
      />
      <EmojiPickerModal
        open={emojiPickerOpen}
        onOpenChange={setEmojiPickerOpen}
        onSelect={(emoji) => onInsert(emoji, '')}
      />
      <InsertDiagramModal
        open={diagramModalOpen}
        onOpenChange={setDiagramModalOpen}
        onInsert={(template) => onInsert(template, '')}
      />
      <InsertMediaModal
        open={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        onInsert={(markdown) => onInsert(markdown, '')}
      />
    </>
  );
};
