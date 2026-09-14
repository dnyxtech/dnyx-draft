import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../db';
import type { DocumentItem, FolderItem, RevisionItem } from '../db/schema';

const SAMPLE_MARKDOWN = `# Welcome to Dnyx Draft ✨

A modern, fast, local-first **Markdown Editor & Live Preview** built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🚀 Features at a Glance
- **Instant Live Preview**: Render GitHub Flavored Markdown with smooth scrolling.
- **LaTeX Math Formulas**: Inline $E = mc^2$ and block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
- **Diagrams**: Mermaid sequence, flowchart, and class diagrams.
- **Tables & Task Lists**:
  - [x] Create modular components
  - [x] Add Zustand state management
  - [ ] Start writing documentation

| Feature | Support | Engine |
| :--- | :--- | :--- |
| GFM Tables | Full | remark-gfm |
| Math Formula | Full | KaTeX |
| Dark Mode | System / Manual | next-themes |
| Local Storage | Offline-first | Dexie.js (IndexedDB) |

\`\`\`typescript
// Pure TypeScript sample
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
`;

// Per-document debounce timers — prevents data loss when switching documents quickly.
const dbSaveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Auto-snapshot: track when we last saved a revision per document.
const lastRevisionTimes: Record<string, number> = {};
const REVISION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REVISIONS_PER_DOC = 50;

function debouncedDbSave(
  id: string,
  updates: Partial<DocumentItem>,
  onSaving: () => void,
  onSaved: () => void,
  delay = 300,
) {
  onSaving();
  if (dbSaveTimers[id]) clearTimeout(dbSaveTimers[id]);
  dbSaveTimers[id] = setTimeout(async () => {
    delete dbSaveTimers[id];
    if (!db) return;
    try {
      const updatedAt = Date.now();
      await db.documents.update(id, { ...updates, updatedAt });
      onSaved();

      // Auto-save revision snapshot when content changes.
      if (updates.content !== undefined) {
        const now = Date.now();
        const lastTime = lastRevisionTimes[id] ?? 0;
        if (now - lastTime >= REVISION_INTERVAL_MS) {
          const doc = await db.documents.get(id);
          if (doc) {
            lastRevisionTimes[id] = now;
            const rev: RevisionItem = {
              id: nanoid(),
              documentId: id,
              title: doc.title,
              content: doc.content,
              timestamp: now,
            };
            await db.revisions.add(rev);
            // Prune: keep only the most recent MAX_REVISIONS_PER_DOC revisions.
            const all = await db.revisions.where('documentId').equals(id).sortBy('timestamp');
            if (all.length > MAX_REVISIONS_PER_DOC) {
              const toDelete = all.slice(0, all.length - MAX_REVISIONS_PER_DOC).map((r) => r.id);
              await db.revisions.bulkDelete(toDelete);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to persist document update:', err);
    }
  }, delay);
}

type SaveStatus = 'idle' | 'saving' | 'saved';
type SortBy = 'name' | 'modified' | 'created' | 'wordcount';
type SortOrder = 'asc' | 'desc';

export type ActivityTab =
  | 'explorer'
  | 'search'
  | 'outline'
  | 'templates'
  | 'graph'
  | 'history'
  | 'diagnostics';

interface WorkspaceState {
  documents: DocumentItem[];
  folders: FolderItem[];
  activeDocumentId: string | null;
  openTabs: string[];
  pinnedTabs: string[];
  searchQuery: string;
  selectedTag: string | null;
  viewMode: 'split' | 'editor' | 'preview';
  isSidebarOpen: boolean;
  saveStatus: SaveStatus;
  sortBy: SortBy;
  sortOrder: SortOrder;
  activeActivityTab: ActivityTab;

  // Pomodoro Focus Timer State
  pomodoroActive: boolean;
  pomodoroSecondsLeft: number;
  pomodoroMode: 'work' | 'break';
  pomodoroDailyWords: number;
  pomodoroGoalWords: number;

  // Per-document preview scroll positions (not persisted to IndexedDB)
  previewScrollPositions: Record<string, number>;
  setPreviewScrollPosition: (id: string, pos: number) => void;

  // Actions
  initialize: () => Promise<void>;
  createDocument: (title?: string, folderId?: string | null, content?: string) => Promise<string>;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => Promise<void>;
  deleteDocument: (id: string, permanent?: boolean) => Promise<void>;
  restoreDocument: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  renameDocument: (id: string, newTitle: string) => Promise<void>;
  duplicateDocument: (id: string) => Promise<string>;
  moveDocument: (docId: string, targetFolderId: string | null) => Promise<void>;
  setActiveDocument: (id: string) => void;
  openTab: (id: string) => void;
  closeTab: (id: string) => void;
  reorderTabs: (sourceIndex: number, destIndex: number) => void;
  pinTab: (id: string) => void;
  unpinTab: (id: string) => void;
  createFolder: (name: string, parentId?: string | null) => Promise<string>;
  deleteFolder: (id: string) => Promise<void>;
  renameFolder: (id: string, newName: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  toggleSidebar: () => void;
  setSaveStatus: (status: SaveStatus) => void;
  setSortBy: (by: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  setActiveActivityTab: (tab: ActivityTab) => void;
  togglePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  setPomodoroGoalWords: (words: number) => void;
  incrementDailyWords: (count: number) => void;
  createBlobDocument: (file: File) => Promise<string>;
  createInlineBlob: (file: File) => Promise<string>;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      documents: [],
      folders: [],
      activeDocumentId: null,
      openTabs: [],
      pinnedTabs: [],
      searchQuery: '',
      selectedTag: null,
      viewMode: 'split',
      isSidebarOpen: true,
      saveStatus: 'idle',
      sortBy: 'modified',
      sortOrder: 'desc',
      activeActivityTab: 'explorer',
      previewScrollPositions: {},

      pomodoroActive: false,
      pomodoroSecondsLeft: 25 * 60,
      pomodoroMode: 'work',
      pomodoroDailyWords: 0,
      pomodoroGoalWords: 500,

      initialize: async () => {
        if (!db) return;
        try {
          let docs = await db.documents.toArray();
          const folders = await db.folders.toArray();

          // Auto-expire: permanently remove documents that have been in trash > 30 days.
          const now = Date.now();
          const expired = docs.filter(
            (d) => d.isTrash && d.trashedAt && now - d.trashedAt > TRASH_RETENTION_MS,
          );
          if (expired.length > 0) {
            const expiredIds = expired.map((d) => d.id);
            if (db) await db.documents.bulkDelete(expiredIds);
            docs = docs.filter((d) => !expiredIds.includes(d.id));
          }

          if (docs.length === 0) {
            const initialDoc: DocumentItem = {
              id: nanoid(),
              title: 'Welcome.md',
              content: SAMPLE_MARKDOWN,
              isFavorite: true,
              isTrash: false,
              tags: ['welcome', 'guide'],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            await db.documents.add(initialDoc);
            set({
              documents: [initialDoc],
              folders,
              activeDocumentId: initialDoc.id,
              openTabs: [initialDoc.id],
            });
          } else {
            const validIds = new Set(docs.map((d) => d.id));
            const persistedTabs = get().openTabs.filter((id) => validIds.has(id));
            const persistedActive = get().activeDocumentId;

            const restoredTabs =
              persistedTabs.length > 0
                ? persistedTabs
                : ([docs.find((d) => !d.isTrash)?.id].filter(Boolean) as string[]);

            const restoredActive =
              persistedActive && validIds.has(persistedActive)
                ? persistedActive
                : restoredTabs[0] || null;

            set({
              documents: docs,
              folders,
              openTabs: restoredTabs,
              activeDocumentId: restoredActive,
            });
          }
        } catch (err) {
          console.error('Failed to load IndexedDB workspace:', err);
        }
      },

      createDocument: async (
        title = 'Untitled.md',
        folderId = null,
        content = '# Untitled\n\nStart typing...',
      ) => {
        const newDoc: DocumentItem = {
          id: nanoid(),
          title,
          content,
          folderId: folderId ?? undefined,
          isFavorite: false,
          isTrash: false,
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (db) await db.documents.add(newDoc);
        set((state) => ({
          documents: [newDoc, ...state.documents],
          activeDocumentId: newDoc.id,
          openTabs: state.openTabs.includes(newDoc.id)
            ? state.openTabs
            : [...state.openTabs, newDoc.id],
        }));
        return newDoc.id;
      },

      updateDocument: async (id, updates) => {
        const updatedAt = Date.now();
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt } : d,
          ),
        }));
        if ('content' in updates && Object.keys(updates).length === 1) {
          debouncedDbSave(
            id,
            updates,
            () => set({ saveStatus: 'saving' }),
            () => {
              set({ saveStatus: 'saved' });
              setTimeout(
                () => set((s) => (s.saveStatus === 'saved' ? { saveStatus: 'idle' } : {})),
                2000,
              );
            },
          );
        } else {
          if (db) await db.documents.update(id, { ...updates, updatedAt });
        }
      },

      deleteDocument: async (id, permanent = false) => {
        if (permanent) {
          if (db) await db.documents.delete(id);
          set((state) => {
            const newDocs = state.documents.filter((d) => d.id !== id);
            const newTabs = state.openTabs.filter((tabId) => tabId !== id);
            return {
              documents: newDocs,
              openTabs: newTabs,
              activeDocumentId:
                state.activeDocumentId === id ? newTabs[0] || null : state.activeDocumentId,
            };
          });
        } else {
          const trashedAt = Date.now();
          if (db) await db.documents.update(id, { isTrash: true, trashedAt });
          set((state) => {
            const newDocs = state.documents.map((d) =>
              d.id === id ? { ...d, isTrash: true, trashedAt } : d,
            );
            const newTabs = state.openTabs.filter((tabId) => tabId !== id);
            return {
              documents: newDocs,
              openTabs: newTabs,
              activeDocumentId:
                state.activeDocumentId === id ? newTabs[0] || null : state.activeDocumentId,
            };
          });
        }
      },

      restoreDocument: async (id) => {
        if (db) await db.documents.update(id, { isTrash: false });
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, isTrash: false } : d)),
        }));
      },

      // Fix #18: use bulkDelete instead of sequential deletes.
      emptyTrash: async () => {
        const trashIds = get()
          .documents.filter((d) => d.isTrash)
          .map((d) => d.id);
        if (db) await db.documents.bulkDelete(trashIds);
        set((state) => ({ documents: state.documents.filter((d) => !d.isTrash) }));
      },

      renameDocument: async (id, newTitle) => {
        const updatedAt = Date.now();
        if (db) await db.documents.update(id, { title: newTitle, updatedAt });
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, title: newTitle, updatedAt } : d,
          ),
        }));
      },

      // Fix #19: throw instead of returning empty string.
      duplicateDocument: async (id) => {
        const doc = get().documents.find((d) => d.id === id);
        if (!doc) throw new Error(`Document "${id}" not found`);
        const newDoc: DocumentItem = {
          ...doc,
          id: nanoid(),
          title: `${doc.title.replace(/\.md$/, '')} (Copy).md`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (db) await db.documents.add(newDoc);
        set((state) => ({
          documents: [newDoc, ...state.documents],
          activeDocumentId: newDoc.id,
          openTabs: [...state.openTabs, newDoc.id],
        }));
        return newDoc.id;
      },

      // Fix #9: use null consistently for "no folder" in both DB and state.
      moveDocument: async (docId, targetFolderId) => {
        const updatedAt = Date.now();
        const folderId = targetFolderId ?? null;
        if (db) await db.documents.update(docId, { folderId, updatedAt });
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === docId ? { ...d, folderId, updatedAt } : d,
          ),
        }));
      },

      setActiveDocument: (id) => {
        set((state) => ({
          activeDocumentId: id,
          openTabs: state.openTabs.includes(id) ? state.openTabs : [...state.openTabs, id],
        }));
      },

      openTab: (id) => {
        set((state) => ({
          activeDocumentId: id,
          openTabs: state.openTabs.includes(id) ? state.openTabs : [...state.openTabs, id],
        }));
      },

      // Fix #13: select the left-adjacent tab instead of the last tab.
      closeTab: (id) => {
        set((state) => {
          const remaining = state.openTabs.filter((tabId) => tabId !== id);
          let nextActive = state.activeDocumentId;
          if (state.activeDocumentId === id) {
            const currentIndex = state.openTabs.indexOf(id);
            nextActive = remaining[Math.min(currentIndex, remaining.length - 1)] ?? null;
          }
          return { openTabs: remaining, activeDocumentId: nextActive };
        });
      },

      reorderTabs: (sourceIndex, destIndex) => {
        set((state) => {
          const newTabs = [...state.openTabs];
          const [moved] = newTabs.splice(sourceIndex, 1);
          newTabs.splice(destIndex, 0, moved);
          return { openTabs: newTabs };
        });
      },

      pinTab: (id) => {
        set((state) => ({
          pinnedTabs: state.pinnedTabs.includes(id) ? state.pinnedTabs : [...state.pinnedTabs, id],
        }));
      },

      unpinTab: (id) => {
        set((state) => ({
          pinnedTabs: state.pinnedTabs.filter((tabId) => tabId !== id),
        }));
      },

      // Fix #4: returns the new folder's ID so callers avoid stale-closure lookups.
      createFolder: async (name, parentId = null) => {
        const newFolder: FolderItem = {
          id: nanoid(),
          name,
          parentId,
          createdAt: Date.now(),
        };
        if (db) await db.folders.add(newFolder);
        set((state) => ({ folders: [...state.folders, newFolder] }));
        return newFolder.id;
      },

      // Fix #7: recursively delete all nested subfolders.
      deleteFolder: async (id) => {
        const allFolders = get().folders;

        const collectDescendantIds = (parentId: string): string[] => {
          const children = allFolders.filter((f) => f.parentId === parentId);
          return [parentId, ...children.flatMap((f) => collectDescendantIds(f.id))];
        };
        const folderIds = collectDescendantIds(id);

        if (db) {
          await db.folders.bulkDelete(folderIds);
          for (const fid of folderIds) {
            await db.documents.where('folderId').equals(fid).modify({ folderId: null });
          }
        }
        set((state) => ({
          folders: state.folders.filter((f) => !folderIds.includes(f.id)),
          documents: state.documents.map((d) =>
            folderIds.includes(d.folderId as string) ? { ...d, folderId: null } : d,
          ),
        }));
      },

      renameFolder: async (id, newName) => {
        if (db) await db.folders.update(id, { name: newName });
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name: newName } : f)),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSaveStatus: (saveStatus) => set({ saveStatus }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),

      // Fix #11: simplified — just switch tab and always open sidebar.
      // ActivityBar handles the toggle-close case itself via toggleSidebar().
      setActiveActivityTab: (tab) => set({ activeActivityTab: tab, isSidebarOpen: true }),

      togglePomodoro: () => set((state) => ({ pomodoroActive: !state.pomodoroActive })),
      resetPomodoro: () =>
        set((state) => ({
          pomodoroActive: false,
          pomodoroSecondsLeft: state.pomodoroMode === 'work' ? 25 * 60 : 5 * 60,
        })),
      tickPomodoro: () =>
        set((state) => {
          if (!state.pomodoroActive) return state;
          if (state.pomodoroSecondsLeft <= 1) {
            const nextMode = state.pomodoroMode === 'work' ? 'break' : 'work';
            return {
              pomodoroMode: nextMode,
              pomodoroSecondsLeft: nextMode === 'work' ? 25 * 60 : 5 * 60,
              pomodoroActive: false,
            };
          }
          return { pomodoroSecondsLeft: state.pomodoroSecondsLeft - 1 };
        }),
      setPomodoroGoalWords: (words) => set({ pomodoroGoalWords: words }),
      incrementDailyWords: (count) =>
        set((state) => ({ pomodoroDailyWords: Math.max(0, state.pomodoroDailyWords + count) })),

      setPreviewScrollPosition: (id, pos) =>
        set((state) => ({
          previewScrollPositions: { ...state.previewScrollPositions, [id]: pos },
        })),

      createBlobDocument: async (file) => {
        if (!db) throw new Error('Database not available');
        const blobId = nanoid();
        const arrayBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
        const isPdf = ext === 'pdf';
        const isArchive = ext === 'zip';
        const fileType = isImage ? 'image' : isPdf ? 'pdf' : isArchive ? 'archive' : 'image';

        await db.blobs.add({
          id: blobId,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: arrayBuffer,
          createdAt: Date.now(),
        });

        const title = file.name.replace(/\.[^.]+$/, '');
        const newDoc: DocumentItem = {
          id: nanoid(),
          title,
          content: '',
          isFavorite: false,
          isTrash: false,
          tags: [],
          fileType,
          blobId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await db.documents.add(newDoc);
        set((state) => ({
          documents: [newDoc, ...state.documents],
          activeDocumentId: newDoc.id,
          openTabs: state.openTabs.includes(newDoc.id)
            ? state.openTabs
            : [...state.openTabs, newDoc.id],
        }));

        // For PDFs: extract searchable text in the background
        if (isPdf) {
          (async () => {
            try {
              const pdfjsLib = await import('pdfjs-dist');
              pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url,
              ).toString();
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              const pages: string[] = [];
              for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const tc = await page.getTextContent();
                const text = (tc.items as Array<Record<string, unknown>>)
                  .filter((i) => typeof i.str === 'string')
                  .map((i) => i.str as string)
                  .join(' ');
                if (text.trim()) pages.push(text);
              }
              const searchableText = pages.join('\n');
              if (searchableText) {
                await db.documents.update(newDoc.id, { searchableText });
                set((state) => ({
                  documents: state.documents.map((d) =>
                    d.id === newDoc.id ? { ...d, searchableText } : d,
                  ),
                }));
              }
            } catch {
              /* non-critical */
            }
          })();
        }

        return newDoc.id;
      },

      createInlineBlob: async (file) => {
        if (!db) throw new Error('Database not available');
        const blobId = nanoid();
        const arrayBuffer = await file.arrayBuffer();
        await db.blobs.add({
          id: blobId,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: arrayBuffer,
          createdAt: Date.now(),
        });
        return blobId;
      },
    }),
    {
      name: 'md-viewer-workspace',
      // Only persist UI state — document content lives in IndexedDB.
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        viewMode: state.viewMode,
        openTabs: state.openTabs,
        activeDocumentId: state.activeDocumentId,
        pinnedTabs: state.pinnedTabs,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        activeActivityTab: state.activeActivityTab,
        pomodoroDailyWords: state.pomodoroDailyWords,
        pomodoroGoalWords: state.pomodoroGoalWords,
      }),
    },
  ),
);
