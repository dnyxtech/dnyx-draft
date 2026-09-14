import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PreviewTheme = 'github' | 'dracula' | 'minimal' | 'academic' | 'serif';
export type TextDirection = 'ltr' | 'rtl';
export type AppLanguage =
  | 'en'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'fr'
  | 'de'
  | 'es'
  | 'pt-BR'
  | 'ru'
  | 'ar'
  | 'hi'
  | 'bg'
  | 'tr'
  | 'it';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  syncScroll: boolean;
  liveMermaid: boolean;
  autoSaveDelay: number;
  vimMode: boolean;
  previewTheme: PreviewTheme;
  splitRatio: number; // 0–100, editor width %
  writingGoalWords: number; // 0 = disabled
  enablePomodoroTimer: boolean;
  textDirection: TextDirection;
  language: AppLanguage;
  lastSeenVersion: string;
  trashRetentionDays: number;
  privateMode: boolean;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
  setLineNumbers: (show: boolean) => void;
  setSyncScroll: (sync: boolean) => void;
  setLiveMermaid: (live: boolean) => void;
  setAutoSaveDelay: (delay: number) => void;
  setVimMode: (vim: boolean) => void;
  setPreviewTheme: (theme: PreviewTheme) => void;
  setSplitRatio: (ratio: number) => void;
  setWritingGoalWords: (words: number) => void;
  setEnablePomodoroTimer: (enabled: boolean) => void;
  setTextDirection: (dir: TextDirection) => void;
  setLanguage: (lang: AppLanguage) => void;
  setLastSeenVersion: (version: string) => void;
  setTrashRetentionDays: (days: number) => void;
  setPrivateMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 15,
      fontFamily: 'monospace',
      tabSize: 2,
      wordWrap: true,
      lineNumbers: true,
      syncScroll: true,
      liveMermaid: true,
      autoSaveDelay: 300,
      vimMode: false,
      previewTheme: 'github',
      splitRatio: 50,
      writingGoalWords: 0,
      enablePomodoroTimer: true,
      textDirection: 'ltr',
      language: 'en',
      lastSeenVersion: '',
      trashRetentionDays: 30,
      privateMode: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setSyncScroll: (syncScroll) => set({ syncScroll }),
      setLiveMermaid: (liveMermaid) => set({ liveMermaid }),
      setAutoSaveDelay: (autoSaveDelay) => set({ autoSaveDelay }),
      setVimMode: (vimMode) => set({ vimMode }),
      setPreviewTheme: (previewTheme) => set({ previewTheme }),
      setSplitRatio: (splitRatio) => set({ splitRatio }),
      setWritingGoalWords: (writingGoalWords) => set({ writingGoalWords }),
      setEnablePomodoroTimer: (enablePomodoroTimer) => set({ enablePomodoroTimer }),
      setTextDirection: (textDirection) => set({ textDirection }),
      setLanguage: (language) => set({ language }),
      setLastSeenVersion: (lastSeenVersion) => set({ lastSeenVersion }),
      setTrashRetentionDays: (trashRetentionDays) => set({ trashRetentionDays }),
      // Not persisted (see partialize below) — a quick screen-privacy toggle
      // should default back to visible on a fresh page load, not stay
      // hidden indefinitely if the user forgets to turn it off.
      setPrivateMode: (privateMode) => set({ privateMode }),
    }),
    {
      name: 'md-viewer-settings',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        tabSize: state.tabSize,
        wordWrap: state.wordWrap,
        lineNumbers: state.lineNumbers,
        syncScroll: state.syncScroll,
        liveMermaid: state.liveMermaid,
        autoSaveDelay: state.autoSaveDelay,
        vimMode: state.vimMode,
        previewTheme: state.previewTheme,
        splitRatio: state.splitRatio,
        writingGoalWords: state.writingGoalWords,
        enablePomodoroTimer: state.enablePomodoroTimer,
        textDirection: state.textDirection,
        language: state.language,
        lastSeenVersion: state.lastSeenVersion,
        trashRetentionDays: state.trashRetentionDays,
      }),
    },
  ),
);
