'use client';

import { Sigma as SymbolsIcon } from 'lucide-react';
import type React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SymbolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (char: string) => void;
}

const CATEGORIES: { id: string; label: string; chars: string[] }[] = [
  {
    id: 'arrows',
    label: 'Arrows',
    chars: ['→', '←', '↑', '↓', '↔', '↕', '⇒', '⇐', '⇔', '⇑', '⇓', '↗', '↘', '↙', '↖'],
  },
  {
    id: 'math',
    label: 'Math',
    chars: [
      '±',
      '×',
      '÷',
      '≈',
      '≠',
      '≤',
      '≥',
      '∞',
      '√',
      '∑',
      '∏',
      '∫',
      '∂',
      '∆',
      '°',
      '¹',
      '²',
      '³',
      '½',
      '¼',
      '¾',
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    chars: ['€', '£', '¥', '₹', '¢', '₩', '₽', '₿'],
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    chars: ['"', '"', "'", "'", '…', '–', '—', '§', '¶', '•', '‰', '¡', '¿'],
  },
  {
    id: 'greek',
    label: 'Greek',
    chars: [
      'α',
      'β',
      'γ',
      'δ',
      'ε',
      'θ',
      'λ',
      'μ',
      'π',
      'σ',
      'φ',
      'ω',
      'Σ',
      'Δ',
      'Ω',
      'Φ',
      'Π',
      'Λ',
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    chars: ['©', '®', '™', '✓', '✗', '★', '☆', '♥', '♦', '♣', '♠', '⚠', 'ℹ'],
  },
];

export const SymbolsModal: React.FC<SymbolsModalProps> = ({ open, onOpenChange, onSelect }) => {
  const handlePick = (char: string) => {
    onSelect(char);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SymbolsIcon className="h-5 w-5 text-blue-500" />
            Symbols &amp; HTML Entities
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={CATEGORIES[0].id}>
          <TabsList className="w-full grid grid-cols-3 h-auto gap-1 bg-transparent p-0">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="text-xs bg-slate-100 dark:bg-slate-800 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="grid grid-cols-8 gap-1">
                {cat.chars.map((char, i) => (
                  <button
                    key={`${char}-${i}`}
                    type="button"
                    onClick={() => handlePick(char)}
                    title={char}
                    className="h-9 w-9 flex items-center justify-center text-lg rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
