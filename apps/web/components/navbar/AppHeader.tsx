'use client';

import {
  Activity,
  BookOpen,
  ChevronDown,
  Code2,
  Columns,
  Command,
  Edit3,
  Eye,
  FileDown,
  FolderInput,
  GanttChart,
  History,
  LayoutTemplate,
  Lock,
  Maximize,
  Menu,
  Minimize,
  Moon,
  Search,
  Settings,
  Share2,
  Sparkles,
  Sun,
  Tv,
  Unlock,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { formatMarkdownTables } from '@/lib/utils/markdown-formatter';
import { GithubIcon } from '../icons/GithubIcon';
import { CommandPaletteModal } from '../modals/CommandPaletteModal';
import { CommentsModal } from '../modals/CommentsModal';
import { DocumentDiagnosticsModal } from '../modals/DocumentDiagnosticsModal';
import { EncryptVaultModal } from '../modals/EncryptVaultModal';
import { ExportModal } from '../modals/ExportModal';
import { GitHubImportModal } from '../modals/GitHubImportModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';
import { ImportFileModal } from '../modals/ImportFileModal';
import { LiveShareModal } from '../modals/LiveShareModal';
import { PresentationModal } from '../modals/PresentationModal';
import { APP_VERSION, ReleaseNotesModal } from '../modals/ReleaseNotesModal';
import { SettingsModal } from '../modals/SettingsModal';
import { ShareModal } from '../modals/ShareModal';
import { TemplatePickerModal } from '../modals/TemplatePickerModal';
import { TrashModal } from '../modals/TrashModal';
import { VersionHistoryModal } from '../modals/VersionHistoryModal';

export const AppHeader: React.FC = () => {
  const {
    documents,
    activeDocumentId,
    updateDocument,
    toggleSidebar,
    viewMode,
    setViewMode,
    isSidebarOpen,
    createDocument,
  } = useWorkspaceStore();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { lastSeenVersion, setLastSeenVersion } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const activeDoc = documents.find((d) => d.id === activeDocumentId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    setMounted(true);
    // Auto-show release notes when app version changes
    if (lastSeenVersion !== APP_VERSION) {
      setReleaseNotesOpen(true);
      setLastSeenVersion(APP_VERSION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : true;

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [encryptVaultOpen, setEncryptVaultOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [liveShareOpen, setLiveShareOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [importFileOpen, setImportFileOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleZenMode = () => {
    if (!zenMode) {
      if (isSidebarOpen) toggleSidebar();
      setZenMode(true);
    } else {
      if (!isSidebarOpen) toggleSidebar();
      setZenMode(false);
    }
  };

  const handleFormatDocument = () => {
    if (!activeDoc) return;
    const formatted = formatMarkdownTables(activeDoc.content);
    updateDocument(activeDoc.id, { content: formatted });
  };

  // Fix #12: listen for custom events dispatched by ActivityBar so modals
  // are rendered in exactly one place (here in AppHeader).
  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    const openPresentation = () => setPresentationOpen(true);
    const openTrash = () => setTrashOpen(true);
    const openComments = () => setCommentsOpen(true);
    const openReleaseNotes = () => setReleaseNotesOpen(true);
    const openLiveShare = () => setLiveShareOpen(true);
    window.addEventListener('md:open-settings', openSettings);
    window.addEventListener('md:open-presentation', openPresentation);
    window.addEventListener('md:open-trash', openTrash);
    window.addEventListener('md:open-comments', openComments);
    window.addEventListener('md:open-release-notes', openReleaseNotes);
    window.addEventListener('md:open-live-share', openLiveShare);
    return () => {
      window.removeEventListener('md:open-settings', openSettings);
      window.removeEventListener('md:open-presentation', openPresentation);
      window.removeEventListener('md:open-trash', openTrash);
      window.removeEventListener('md:open-comments', openComments);
      window.removeEventListener('md:open-release-notes', openReleaseNotes);
      window.removeEventListener('md:open-live-share', openLiveShare);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inEditor = target.tagName === 'TEXTAREA' || !!target.closest('.cm-editor');

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 'P' || e.key === 'k' || e.key === 'K')
      ) {
        if (target.tagName !== 'TEXTAREA' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setCommandPaletteOpen((prev) => !prev);
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
        // Fix #16: Ctrl+N creates a new document (skip when typing in editor).
        if (!inEditor) {
          e.preventDefault();
          createDocument();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        if (!inEditor) {
          e.preventDefault();
          toggleSidebar();
        }
      } else if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setVersionHistoryOpen((prev) => !prev);
      } else if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setPresentationOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setTemplateOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, createDocument]);

  return (
    <>
      <header className="h-13 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md px-3 sm:px-4 select-none z-20 shadow-xs transition-colors">
        {/* Left: Sidebar Toggle, Logo & Document Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar (Ctrl+B)</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="hidden md:inline font-semibold">Dnyx Draft</span>
          </div>

          {activeDoc && (
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block shrink-0" />
          )}

          {activeDoc && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-[180px] sm:max-w-xs">
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => updateDocument(activeDoc.id, { title: e.target.value })}
                className="text-xs sm:text-sm font-semibold px-2 py-1 rounded-md bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-blue-500 outline-none text-slate-800 dark:text-slate-100 truncate transition-all w-full"
                title="Click to rename document"
              />
              {activeDoc.isSecret && (
                <span className="text-[10px] text-amber-500 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded font-mono shrink-0 flex items-center gap-0.5">
                  <Lock className="h-2.5 w-2.5" /> Locked
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Command Palette & View Switcher */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="h-8 text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 hidden sm:flex items-center gap-2 px-2.5"
          >
            <Command className="h-3.5 w-3.5 text-blue-500" />
            <span>Commands</span>
            <kbd className="text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
              Ctrl+P
            </kbd>
          </Button>

          <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="h-3.5 w-3.5" /> Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Right: Primary actions + Tools dropdown + Utility icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Export */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="text-xs h-8 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FileDown className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Share — primary CTA */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setShareOpen(true)}
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs shadow-blue-500/20"
          >
            <Share2 className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Tools dropdown — secondary document actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1"
              >
                <GanttChart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tools</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Create & Insert</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTemplateOpen(true)}>
                <LayoutTemplate className="text-blue-500" />
                Templates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPresentationOpen(true)}>
                <Tv className="text-purple-500" />
                Present as Slides
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGithubOpen(true)}>
                <GithubIcon className="text-slate-600 dark:text-slate-400" />
                Import from GitHub
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportFileOpen(true)}>
                <FolderInput className="text-emerald-500" />
                Import File…
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/readme-builder" className="flex items-center gap-2 cursor-pointer">
                  <BookOpen className="text-emerald-500" />
                  README Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/svg-editor" className="flex items-center gap-2 cursor-pointer">
                  <Code2 className="text-blue-500" />
                  SVG Editor
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setGlobalSearchOpen(true)}>
                <Search className="text-blue-500" />
                Global Search
                <DropdownMenuShortcut>Ctrl+Shift+F</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCommandPaletteOpen(true)}>
                <Command className="text-slate-500" />
                Command Palette
                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Document</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setVersionHistoryOpen(true)}>
                <History className="text-indigo-500" />
                Version History
                <DropdownMenuShortcut>Alt+H</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEncryptVaultOpen(true)}>
                {activeDoc?.isSecret ? (
                  <Unlock className="text-amber-500" />
                ) : (
                  <Lock className="text-blue-500" />
                )}
                {activeDoc?.isSecret ? 'Decrypt Document' : 'Encrypt Document'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDiagnosticsOpen(true)}>
                <Activity className="text-emerald-500" />
                Diagnostics & Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Zen Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleZenMode}
                className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {zenMode ? (
                  <Minimize className="h-4 w-4 text-blue-500" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{zenMode ? 'Exit Zen Mode' : 'Zen Focus Mode'}</TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle {isDark ? 'Light' : 'Dark'} Mode</TooltipContent>
          </Tooltip>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings (Ctrl+,)</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Modals */}
      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <CommandPaletteModal
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        onOpenExport={() => setExportOpen(true)}
        onOpenTemplates={() => setTemplateOpen(true)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        onOpenPresentation={() => setPresentationOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenVersionHistory={() => setVersionHistoryOpen(true)}
        onOpenEncryptVault={() => setEncryptVaultOpen(true)}
        onFormatDocument={handleFormatDocument}
      />
      <VersionHistoryModal open={versionHistoryOpen} onOpenChange={setVersionHistoryOpen} />
      <EncryptVaultModal open={encryptVaultOpen} onOpenChange={setEncryptVaultOpen} />
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
      <GitHubImportModal open={githubOpen} onOpenChange={setGithubOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
      <TemplatePickerModal open={templateOpen} onOpenChange={setTemplateOpen} />
      <PresentationModal
        open={presentationOpen}
        onOpenChange={setPresentationOpen}
        content={activeDoc?.content || ''}
        title={activeDoc?.title || 'Presentation'}
      />
      <DocumentDiagnosticsModal
        open={diagnosticsOpen}
        onOpenChange={setDiagnosticsOpen}
        content={activeDoc?.content || ''}
        title={activeDoc?.title || 'Document'}
      />
      <TrashModal open={trashOpen} onOpenChange={setTrashOpen} />
      <CommentsModal open={commentsOpen} onOpenChange={setCommentsOpen} />
      <ReleaseNotesModal open={releaseNotesOpen} onOpenChange={setReleaseNotesOpen} />
      <LiveShareModal open={liveShareOpen} onOpenChange={setLiveShareOpen} />
      <ImportFileModal open={importFileOpen} onOpenChange={setImportFileOpen} />
    </>
  );
};
