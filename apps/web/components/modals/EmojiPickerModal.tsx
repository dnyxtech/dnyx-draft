'use client';

import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmojiPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (emoji: string) => void;
}

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  // A plain ref isn't enough here: Radix's Dialog portals/mounts its content
  // on a later commit than the one where `open` flips true, so a mount
  // effect keyed only on `open` can fire while the ref is still null and
  // never re-run. Track the element via state (set by a callback ref) so
  // the effect below re-fires once it's actually mounted.
  const [pickerEl, setPickerEl] = useState<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Keep latest callbacks in refs so the mount effect below doesn't re-run
  // (and tear down/rebuild the emoji-mart picker) just because the parent
  // re-rendered and passed new function identities for onSelect/onOpenChange.
  const onSelectRef = useRef(onSelect);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onSelectRef.current = onSelect;
    onOpenChangeRef.current = onOpenChange;
  }, [onSelect, onOpenChange]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCount is a deliberate unused re-run trigger
  useEffect(() => {
    if (!open || !pickerEl) return;

    let picker: { remove: () => void } | null = null;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const init = async () => {
      try {
        // biome-ignore lint/suspicious/noExplicitAny: third-party emoji-mart has no TS types for React 19
        const EmojiPicker = (await import('@emoji-mart/react')).default as React.ComponentType<any>;
        const data = (await import('@emoji-mart/data')).default;

        if (cancelled) return;

        // Dynamically render the picker into the div using a second React
        // root (rather than JSX) so this third-party, custom-element-based
        // widget stays isolated from React 19 interop quirks.
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(pickerEl);
        root.render(
          <EmojiPicker
            data={data}
            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            onEmojiSelect={(emoji: { native: string; shortcodes?: string }) => {
              onSelectRef.current(emoji.shortcodes ?? emoji.native);
              onOpenChangeRef.current(false);
            }}
            previewPosition="none"
            skinTonePosition="none"
          />,
        );

        picker = { remove: () => root.unmount() };
      } catch {
        if (!cancelled) setError('Failed to load emoji picker.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      picker?.remove();
    };
  }, [open, pickerEl, resolvedTheme, retryCount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-sm">Insert Emoji</DialogTitle>
        </DialogHeader>
        {loading && !error && (
          <div className="py-10 text-center text-xs text-slate-400">Loading emoji picker…</div>
        )}
        {error && (
          <div className="py-10 text-center space-y-2">
            <p className="text-xs text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        <div
          ref={setPickerEl}
          hidden={loading || !!error}
          className="[&_em-emoji-picker]:w-full [&_em-emoji-picker]:border-0"
        />
      </DialogContent>
    </Dialog>
  );
};
