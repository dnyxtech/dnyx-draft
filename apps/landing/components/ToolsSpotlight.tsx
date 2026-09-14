'use client';

import {
  ArrowUpRight,
  Code2,
  GitBranch,
  Link2,
  MessageSquare,
  Radio,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type React from 'react';
import { APP_URL, README_BUILDER_URL, SVG_EDITOR_URL } from '@/lib/constants';

export const ToolsSpotlight: React.FC = () => {
  return (
    <section
      id="collaborate"
      className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070a11] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Radio className="h-3.5 w-3.5" />
            <span>Beyond Solo Editing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Share, Collaborate &amp; Ship Docs Faster
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Purpose-built tools that go beyond a single-player editor — real-time collaboration, a
            dedicated README generator, and a live SVG playground, all running on the same local-first
            engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Live Share card */}
          <div className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Live Share
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Real-time collaborative editing, no server account needed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 flex-1">
              Invite collaborators with a link and assign host, editor, or viewer roles. Content syncs
              every two seconds, so your team can review and edit the same document together — then it
              goes back to living entirely on your device.
            </p>
            <div className="space-y-2 mb-6">
              {['Host / editor / viewer roles', 'Shareable invite links', '2-second content sync', 'Threaded, anchored comments'].map(
                (line) => (
                  <div key={line} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{line}</span>
                  </div>
                ),
              )}
            </div>
            <a
              href={APP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-auto"
            >
              Start a Live Share session <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* README Builder card */}
          <div className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <GitBranch className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                README Builder
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              A guided wizard that writes your project&apos;s README for you
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 flex-1">
              Point it at a public or private GitHub repo — using an encrypted personal access token
              vault — and build a polished README section by section: badges, tech stack, install steps,
              folder structure, API reference, FAQ, and more.
            </p>
            <div className="space-y-2 mb-6">
              {['Pulls live metadata from GitHub', '15 optional sections & badges', 'Encrypted PAT vault (up to 50 tokens)', 'Exports clean, ready-to-commit Markdown'].map(
                (line) => (
                  <div key={line} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <Link2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{line}</span>
                  </div>
                ),
              )}
            </div>
            <a
              href={README_BUILDER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-auto"
            >
              Try the README Builder <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* SVG Editor card */}
          <div className="p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                SVG Editor
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Write raw SVG, see it rendered instantly
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 flex-1">
              A live code-to-preview playground for hand-writing SVG markup. Edit in a syntax-highlighted
              editor and watch the split-pane preview update as you type — with parse errors caught
              inline instead of a blank canvas.
            </p>
            <div className="space-y-2 mb-6">
              {['Live split-pane preview', 'Inline parse-error detection', 'Sandboxed rendering — scripts never execute', 'One-click copy & .svg download'].map(
                (line) => (
                  <div key={line} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                    <span>{line}</span>
                  </div>
                ),
              )}
            </div>
            <a
              href={SVG_EDITOR_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-auto"
            >
              Open the SVG Editor <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
