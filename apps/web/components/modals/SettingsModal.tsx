'use client';

import {
  Bot,
  Check,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  Target,
  Trash2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  deleteApiKey,
  hasStoredKey,
  loadApiKey,
  saveApiKey,
  setSessionPassphrase,
  testApiKey,
} from '@/lib/ai/key-store';
import {
  type AppLanguage,
  type PreviewTheme,
  useSettingsStore,
} from '@/lib/store/useSettingsStore';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { cn } from '@/lib/utils';

const LANGUAGES: { value: AppLanguage; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'zh', label: 'Chinese', native: '中文' },
  { value: 'ja', label: 'Japanese', native: '日本語' },
  { value: 'ko', label: 'Korean', native: '한국어' },
  { value: 'fr', label: 'French', native: 'Français' },
  { value: 'de', label: 'German', native: 'Deutsch' },
  { value: 'es', label: 'Spanish', native: 'Español' },
  { value: 'pt-BR', label: 'Portuguese (BR)', native: 'Português' },
  { value: 'ru', label: 'Russian', native: 'Русский' },
  { value: 'ar', label: 'Arabic', native: 'العربية' },
  { value: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { value: 'bg', label: 'Bulgarian', native: 'Български' },
  { value: 'tr', label: 'Turkish', native: 'Türkçe' },
  { value: 'it', label: 'Italian', native: 'Italiano' },
];

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PREVIEW_THEMES: { value: PreviewTheme; label: string; desc: string }[] = [
  { value: 'github', label: 'GitHub', desc: 'Clean & familiar' },
  { value: 'dracula', label: 'Dracula', desc: 'Dark & vibrant' },
  { value: 'minimal', label: 'Minimal', desc: 'Focus & clarity' },
  { value: 'academic', label: 'Academic', desc: 'Scholarly serif' },
  { value: 'serif', label: 'Serif', desc: 'Warm & readable' },
];

type AiProvider = 'anthropic' | 'openai';

function AiSection() {
  const [provider, setProvider] = useState<AiProvider>('anthropic');
  const [passphrase, setPassphrase] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    hasStoredKey(provider).then(setHasKey);
  }, [provider]);

  const handleSave = async () => {
    if (!passphrase) {
      toast.error('Passphrase required');
      return;
    }
    if (!apiKey) {
      toast.error('API key required');
      return;
    }
    setSaving(true);
    try {
      setSessionPassphrase(passphrase);
      await saveApiKey(provider, apiKey, passphrase);
      setHasKey(true);
      setApiKey('');
      toast.success(`${provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} key saved`);
    } catch (e) {
      toast.error(`Failed to save: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!passphrase) {
      toast.error('Enter your passphrase first');
      return;
    }
    setTesting(true);
    try {
      setSessionPassphrase(passphrase);
      const key = apiKey || (await loadApiKey(provider));
      if (!key) {
        toast.error('No key found — save a key first');
        return;
      }
      const ok = await testApiKey(provider, key);
      if (ok) toast.success('Connection successful');
      else toast.error('Connection failed — check your key');
    } catch (e) {
      toast.error(`Test failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleDelete = async () => {
    await deleteApiKey(provider);
    setHasKey(false);
    toast.success('Key removed');
  };

  return (
    <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Bot className="h-3.5 w-3.5 text-violet-500" /> AI Assistant (BYOK)
      </label>
      <p className="text-[10px] text-slate-400 -mt-2">
        Keys are encrypted with AES-256 and stored locally. Your passphrase never leaves your
        device.
      </p>

      {/* Provider */}
      <div className="flex gap-2">
        {(['anthropic', 'openai'] as AiProvider[]).map((p) => (
          <Button
            key={p}
            type="button"
            size="sm"
            variant={provider === p ? 'default' : 'outline'}
            onClick={() => setProvider(p)}
            className="flex-1 capitalize"
          >
            {p === 'anthropic' ? 'Anthropic' : 'OpenAI'}
            {hasKey && provider === p && <Check className="h-3 w-3 ml-1 text-emerald-400" />}
          </Button>
        ))}
      </div>

      {/* Passphrase */}
      <div className="relative">
        <input
          type={showPassphrase ? 'text' : 'password'}
          placeholder="Session passphrase (encrypts key)"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full px-3 py-2 pr-9 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        />
        <button
          type="button"
          onClick={() => setShowPassphrase((p) => !p)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* API Key */}
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          placeholder={hasKey ? '••••••••••••• (key stored)' : 'Paste API key here'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full px-3 py-2 pr-9 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        />
        <button
          type="button"
          onClick={() => setShowKey((p) => !p)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save Key'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleTest} disabled={testing}>
          {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Test'}
        </Button>
        {hasKey && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </section>
  );
}

type DestructiveAction = 'reset-workspace' | 'clear-data' | null;

function StorageBackupSection({
  trashRetentionDays,
  setTrashRetentionDays,
}: {
  trashRetentionDays: number;
  setTrashRetentionDays: (days: number) => void;
}) {
  const { resetWorkspace } = useWorkspaceStore();
  const [pending, setPending] = useState<DestructiveAction>(null);
  const [confirmText, setConfirmText] = useState('');
  const [working, setWorking] = useState(false);

  const confirmWord = pending === 'reset-workspace' ? 'RESET' : 'DELETE';

  const cancel = () => {
    setPending(null);
    setConfirmText('');
  };

  const handleConfirm = async () => {
    if (confirmText !== confirmWord) return;
    setWorking(true);
    try {
      if (pending === 'reset-workspace') {
        await resetWorkspace();
        toast.success('Workspace reset — starting fresh.');
        cancel();
      } else if (pending === 'clear-data') {
        const { clearAllBrowserData } = await import('@/lib/utils/clear-browser-data');
        await clearAllBrowserData(); // reloads the page on success
      }
    } catch {
      toast.error('Something went wrong — please try again.');
      setWorking(false);
    }
  };

  return (
    <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Storage &amp; Backup
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Trash retention
          </span>
          <p className="text-[10px] text-slate-400">
            Deleted documents stay in Trash before being permanently removed
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={365}
            value={trashRetentionDays}
            onChange={(e) => {
              const v = Math.min(365, Math.max(1, Number(e.target.value) || 1));
              setTrashRetentionDays(v);
            }}
            className="w-16 px-2 py-1 text-xs text-right rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
          />
          <span className="text-xs text-slate-400">days</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {pending === null ? (
          <>
            <button
              type="button"
              onClick={() => setPending('reset-workspace')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-left hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
            >
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Reset Workspace
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-500">
                Deletes all documents & folders
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPending('clear-data')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-left hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            >
              <span className="text-xs font-medium text-red-700 dark:text-red-400">
                Clear Browser Data
              </span>
              <span className="text-[10px] text-red-600 dark:text-red-500">
                Wipes everything, including settings
              </span>
            </button>
          </>
        ) : (
          <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 space-y-2">
            <p className="text-xs text-red-700 dark:text-red-400">
              {pending === 'reset-workspace'
                ? 'This permanently deletes every document and folder in your workspace. This cannot be undone.'
                : 'This wipes all documents, files, settings, and cached data — as if you never visited this site. This cannot be undone.'}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Type <span className="font-mono font-bold">{confirmWord}</span> to confirm.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={confirmWord}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-red-500"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={confirmText !== confirmWord || working}
                onClick={handleConfirm}
              >
                {working ? 'Working…' : 'Confirm'}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const {
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    tabSize,
    setTabSize,
    wordWrap,
    setWordWrap,
    lineNumbers,
    setLineNumbers,
    syncScroll,
    setSyncScroll,
    liveMermaid,
    setLiveMermaid,
    autoSaveDelay,
    setAutoSaveDelay,
    vimMode,
    setVimMode,
    previewTheme,
    setPreviewTheme,
    splitRatio,
    setSplitRatio,
    writingGoalWords,
    setWritingGoalWords,
    enablePomodoroTimer,
    setEnablePomodoroTimer,
    language,
    setLanguage,
    textDirection,
    setTextDirection,
    trashRetentionDays,
    setTrashRetentionDays,
    privateMode,
    setPrivateMode,
  } = useSettingsStore();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Settings className="h-5 w-5 text-blue-500" /> Editor Preferences
          </DialogTitle>
          <DialogDescription>
            Customize your typing experience, fonts, and interface themes. Settings persist across
            sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2 max-h-[65vh] overflow-y-auto pr-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Appearance
          </p>
          {/* App Color Theme */}
          <section>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              App Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" /> Light
              </Button>
              <Button
                type="button"
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" /> Dark
              </Button>
              <Button
                type="button"
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" /> System
              </Button>
            </div>
          </section>

          {/* Preview Theme */}
          <section>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Palette className="h-3.5 w-3.5 text-purple-500" /> Preview Theme
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PREVIEW_THEMES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPreviewTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-lg border text-center transition-all',
                    previewTheme === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400',
                  )}
                >
                  <span className="text-[11px] font-semibold">{label}</span>
                  <span className="text-[9px] opacity-60 leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Language */}
          <section>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-500" /> Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {LANGUAGES.map(({ value, label, native }) => (
                <option key={value} value={value}>
                  {native} — {label}
                </option>
              ))}
            </select>
          </section>

          {/* Text Direction */}
          <section>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Preview Text Direction
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={textDirection === 'ltr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextDirection('ltr')}
                className="flex-1"
              >
                LTR (Left-to-Right)
              </Button>
              <Button
                type="button"
                variant={textDirection === 'rtl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTextDirection('rtl')}
                className="flex-1"
              >
                RTL (Right-to-Left)
              </Button>
            </div>
          </section>

          {/* Font Size */}
          <section>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Font Size
              </label>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>12px</span>
              <span>24px</span>
            </div>
          </section>

          {/* Font Family */}
          <section>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Editor Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="monospace">System Mono (Default)</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              <option value="'Fira Code', monospace">Fira Code</option>
              <option value="'Source Code Pro', monospace">Source Code Pro</option>
              <option value="'Cascadia Code', monospace">Cascadia Code</option>
            </select>
          </section>

          {/* Tab Size */}
          <section>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tab Size
            </label>
            <div className="flex gap-2">
              {[2, 4, 8].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={tabSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTabSize(size)}
                  className="flex-1"
                >
                  {size} spaces
                </Button>
              ))}
            </div>
          </section>

          {/* Auto-save Delay */}
          <section>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Auto-Save Delay
              </label>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {autoSaveDelay}ms
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={autoSaveDelay}
              onChange={(e) => setAutoSaveDelay(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>100ms (Fast)</span>
              <span>2000ms (Battery saver)</span>
            </div>
          </section>

          {/* Split Panel Ratio */}
          <section>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Split Panel Ratio
              </label>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                {splitRatio}% editor
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={splitRatio}
              onChange={(e) => setSplitRatio(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>More Preview</span>
              <span>More Editor</span>
            </div>
          </section>

          {/* Writing Goal */}
          <section>
            <div className="flex justify-between items-center mb-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Target className="h-3.5 w-3.5 text-emerald-500" /> Writing Goal
              </label>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {writingGoalWords === 0 ? 'Disabled' : `${writingGoalWords.toLocaleString()} words`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={writingGoalWords}
              onChange={(e) => setWritingGoalWords(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Off</span>
              <span>500</span>
              <span>1,000</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </section>

          {/* Toggle Switches */}
          <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Word Wrapping
                </span>
                <p className="text-[10px] text-slate-400">Wrap long lines in the editor</p>
              </div>
              <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Line Numbers
                </span>
                <p className="text-[10px] text-slate-400">Show line numbers in the gutter</p>
              </div>
              <Switch checked={lineNumbers} onCheckedChange={setLineNumbers} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Sync Scroll
                </span>
                <p className="text-[10px] text-slate-400">
                  Synchronize editor and preview scrolling
                </p>
              </div>
              <Switch checked={syncScroll} onCheckedChange={setSyncScroll} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Live Mermaid Diagrams
                </span>
                <p className="text-[10px] text-slate-400">
                  Render Mermaid charts in real-time as you type
                </p>
              </div>
              <Switch checked={liveMermaid} onCheckedChange={setLiveMermaid} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Pomodoro Focus Timer
                </span>
                <p className="text-[10px] text-slate-400">
                  Display 25-min deep work sprint countdown in status bar & rail
                </p>
              </div>
              <Switch checked={enablePomodoroTimer} onCheckedChange={setEnablePomodoroTimer} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Vim Mode
                </span>
                <p className="text-[10px] text-slate-400">Enable Vim keybindings in the editor</p>
              </div>
              <Switch checked={vimMode} onCheckedChange={setVimMode} />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Private Mode
                </span>
                <p className="text-[10px] text-slate-400">
                  Instantly blur the sidebar and document — for when someone walks by
                </p>
              </div>
              <Switch checked={privateMode} onCheckedChange={setPrivateMode} />
            </label>
          </section>

          <StorageBackupSection
            trashRetentionDays={trashRetentionDays}
            setTrashRetentionDays={setTrashRetentionDays}
          />

          <AiSection />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
