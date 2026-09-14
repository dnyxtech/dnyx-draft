'use client';

import { EyeOff } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MarkdownEditor, type MarkdownEditorRef } from '@/components/editor/MarkdownEditor';
import { StatusBar } from '@/components/editor/StatusBar';
import { AppHeader } from '@/components/navbar/AppHeader';
import { DocumentTabs } from '@/components/navbar/DocumentTabs';
import { MarkdownPreview } from '@/components/preview/MarkdownPreview';
import { ActivityBar } from '@/components/sidebar/ActivityBar';
import { WorkspaceSidebar } from '@/components/sidebar/WorkspaceSidebar';
import { FileViewerRouter } from '@/components/viewers/FileViewerRouter';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';

export default function WorkspacePage() {
  const { documents, activeDocumentId, isSidebarOpen, viewMode, setActiveDocument, initialize } =
    useWorkspaceStore();
  const { syncScroll, splitRatio, setSplitRatio, privateMode, setPrivateMode } = useSettingsStore();

  const editorRef = useRef<MarkdownEditorRef | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll position memory per document
  const editorScrolls = useRef<Record<string, number>>({});
  const previewScrolls = useRef<Record<string, number>>({});
  const prevActiveId = useRef<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!activeDocumentId && documents.length > 0) {
      setActiveDocument(documents[0].id);
    }
  }, [documents, activeDocumentId, setActiveDocument]);

  // Restore scroll position when switching documents
  useEffect(() => {
    if (!activeDocumentId || activeDocumentId === prevActiveId.current) return;
    prevActiveId.current = activeDocumentId;

    const savedPreviewScroll = previewScrolls.current[activeDocumentId] ?? 0;
    if (previewRef.current) {
      previewRef.current.scrollTop = savedPreviewScroll;
    }

    const savedEditorPct = editorScrolls.current[activeDocumentId] ?? 0;
    setTimeout(() => {
      editorRef.current?.scrollToPercent(savedEditorPct);
    }, 50);
  }, [activeDocumentId]);

  const activeDoc = documents.find((d) => d.id === activeDocumentId);

  // Sync scroll: editor → preview
  const handleEditorScroll = useCallback(
    (percent: number) => {
      if (!activeDocumentId) return;
      editorScrolls.current[activeDocumentId] = percent;

      if (!syncScroll || isScrollingRef.current === 'preview') return;
      isScrollingRef.current = 'editor';

      const preview = previewRef.current;
      if (preview) {
        const { scrollHeight, clientHeight } = preview;
        preview.scrollTop = percent * (scrollHeight - clientHeight);
      }

      setTimeout(() => {
        if (isScrollingRef.current === 'editor') isScrollingRef.current = null;
      }, 80);
    },
    [syncScroll, activeDocumentId],
  );

  // Sync scroll: preview → editor
  const handlePreviewScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const preview = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = preview;
      const percent = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;

      if (activeDocumentId) {
        previewScrolls.current[activeDocumentId] = scrollTop;
      }

      if (!syncScroll || isScrollingRef.current === 'editor') return;
      isScrollingRef.current = 'preview';

      editorRef.current?.scrollToPercent(percent);

      setTimeout(() => {
        if (isScrollingRef.current === 'preview') isScrollingRef.current = null;
      }, 80);
    },
    [syncScroll, activeDocumentId],
  );

  // Resizable split pane
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newRatio = Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSplitRatio]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <DocumentTabs />

      <main className="flex-1 flex overflow-hidden relative">
        {privateMode && (
          <button
            type="button"
            onClick={() => setPrivateMode(false)}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm cursor-pointer"
          >
            <EyeOff className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Private Mode — click to reveal
            </p>
          </button>
        )}
        <div
          className={`flex flex-1 overflow-hidden transition-all ${privateMode ? 'blur-2xl pointer-events-none select-none' : ''}`}
        >
          {/*
          Fix #12: ActivityBar dispatches custom DOM events.
          AppHeader listens and owns the single modal instances.
        */}
          <ActivityBar
            onOpenSettings={() => window.dispatchEvent(new Event('md:open-settings'))}
            onOpenPresentation={() => window.dispatchEvent(new Event('md:open-presentation'))}
          />

          {isSidebarOpen && <WorkspaceSidebar />}

          {/* Content area */}
          <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Non-markdown file viewer (full-pane) */}
            {activeDoc?.fileType && activeDoc.fileType !== 'markdown' ? (
              <div className="flex-1 overflow-hidden">
                <FileViewerRouter doc={activeDoc} />
              </div>
            ) : (
              <>
                {/* Editor pane */}
                {(viewMode === 'editor' || viewMode === 'split') && (
                  <div
                    className={`h-full overflow-hidden ${
                      viewMode === 'split'
                        ? 'border-r border-slate-200 dark:border-slate-800'
                        : 'w-full'
                    }`}
                    style={viewMode === 'split' ? { width: `${splitRatio}%` } : undefined}
                  >
                    <MarkdownEditor ref={editorRef} onScrollPercent={handleEditorScroll} />
                  </div>
                )}

                {/* Drag divider */}
                {viewMode === 'split' && (
                  <div
                    onMouseDown={handleDividerMouseDown}
                    className={`hidden md:flex w-1 flex-col items-center justify-center cursor-col-resize bg-slate-200 dark:bg-slate-800 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors group relative shrink-0 z-10 ${
                      isDragging ? 'bg-blue-500 dark:bg-blue-500' : ''
                    }`}
                    title="Drag to resize"
                  >
                    <div className="w-0.5 h-8 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors" />
                  </div>
                )}

                {/* Preview pane */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                  <div
                    className={`h-full overflow-hidden ${
                      viewMode === 'split' ? 'hidden md:block flex-1' : 'w-full'
                    }`}
                  >
                    <MarkdownPreview
                      ref={previewRef}
                      onScroll={handlePreviewScroll}
                      content={activeDoc?.content || ''}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
