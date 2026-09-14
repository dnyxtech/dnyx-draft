'use client';

import { Clock, FileText, KeyRound, RotateCcw, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';

interface TrashModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysUntilExpiry(trashedAt: number | undefined, retentionDays: number): number | null {
  if (!trashedAt) return null;
  const elapsed = Date.now() - trashedAt;
  const remaining = retentionDays - Math.floor(elapsed / MS_PER_DAY);
  return Math.max(0, remaining);
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const TrashModal: React.FC<TrashModalProps> = ({ open, onOpenChange }) => {
  const { documents, restoreDocument, deleteDocument, emptyTrash } = useWorkspaceStore();
  const { trashRetentionDays } = useSettingsStore();
  const trashedDocs = documents.filter((d) => d.isTrash);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === trashedDocs.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(trashedDocs.map((d) => d.id)));
    }
  };

  const handleRestore = async (id: string, title: string) => {
    await restoreDocument(id);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    toast.success(`"${title}" restored`);
  };

  const handlePermanentDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;
    await deleteDocument(id, true);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    toast.success(`"${title}" permanently deleted`);
  };

  const handleBatchRestore = async () => {
    const ids = [...selected];
    for (const id of ids) {
      await restoreDocument(id);
    }
    setSelected(new Set());
    toast.success(`${ids.length} document${ids.length > 1 ? 's' : ''} restored`);
  };

  const handleBatchDelete = async () => {
    const ids = [...selected];
    const count = ids.length;
    if (!confirm(`Permanently delete ${count} item${count > 1 ? 's' : ''}? This cannot be undone.`))
      return;
    for (const id of ids) {
      await deleteDocument(id, true);
    }
    setSelected(new Set());
    toast.success(`${count} item${count > 1 ? 's' : ''} permanently deleted`);
  };

  const handleEmptyTrash = async () => {
    if (trashedDocs.length === 0) return;
    if (
      !confirm(
        `Permanently delete all ${trashedDocs.length} items in Trash? This cannot be undone.`,
      )
    )
      return;
    await emptyTrash();
    setSelected(new Set());
    toast.success('Trash emptied');
  };

  const allSelected = trashedDocs.length > 0 && selected.size === trashedDocs.length;
  const someSelected = selected.size > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[75vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-slate-500" />
            Trash
          </DialogTitle>
          <DialogDescription className="text-xs">
            Items are permanently deleted after {trashRetentionDays} days. Select multiple items for
            batch actions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {trashedDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Trash2 className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Trash is empty</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Select-all row */}
              <div className="flex items-center gap-2 pb-1 px-1">
                <input
                  type="checkbox"
                  id="trash-select-all"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 rounded accent-blue-600 cursor-pointer"
                />
                <label
                  htmlFor="trash-select-all"
                  className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                >
                  {allSelected ? 'Deselect all' : `Select all (${trashedDocs.length})`}
                </label>
              </div>

              {trashedDocs.map((doc) => {
                const days = daysUntilExpiry(doc.trashedAt, trashRetentionDays);
                const isUrgent = days !== null && days <= 3;
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selected.has(doc.id)
                        ? 'border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      className="h-3.5 w-3.5 rounded accent-blue-600 cursor-pointer shrink-0"
                      aria-label={`Select ${doc.title}`}
                    />

                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {doc.isSecret ? (
                        <KeyRound className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {doc.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3 w-3" />
                            Deleted {formatDate(doc.trashedAt ?? doc.updatedAt)}
                          </span>
                          {days !== null && (
                            <span
                              className={`font-medium ${
                                isUrgent
                                  ? 'text-red-500 dark:text-red-400'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              · {days === 0 ? 'Expires today' : `${days}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRestore(doc.id, doc.title)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors font-medium"
                        title="Restore document"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePermanentDelete(doc.id, doc.title)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors font-medium"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Batch actions (shown when items are selected) */}
          {someSelected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{selected.size} selected</span>
              <button
                type="button"
                onClick={handleBatchRestore}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors font-medium border border-emerald-200 dark:border-emerald-800/60"
              >
                <RotateCcw className="h-3 w-3" />
                Restore selected
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-medium border border-red-200 dark:border-red-800/60"
              >
                <Trash2 className="h-3 w-3" />
                Delete selected
              </button>
            </div>
          ) : (
            <span />
          )}

          {trashedDocs.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEmptyTrash}
              className="text-xs h-8 ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Empty Trash ({trashedDocs.length})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
