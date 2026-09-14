'use client';

import { BarChart3, Layers, Menu, Moon, Sun, Users, Wand2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { Button } from './ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import { APP_URL, REPO_URL } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/#features', label: 'Features', icon: Layers },
  { href: '/#ai', label: 'AI Assistant', icon: Wand2 },
  { href: '/#use-cases', label: 'Who It’s For', icon: Users },
  { href: '/#comparison', label: 'Comparison', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : true;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-mono font-medium text-lg tracking-tight shrink-0">
          <div className="h-8 w-8 rounded-[var(--radius)] bg-primary flex items-center justify-center text-primary-foreground text-sm">
            D
          </div>
          <span className="text-foreground">Dnyx Draft</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors py-1.5 px-3 rounded-[var(--radius)] hover:bg-secondary/60"
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-[var(--radius)] text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-[var(--radius)] text-foreground hover:bg-secondary/60 border border-border transition-colors"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

          <a href={APP_URL} target="_blank" rel="noreferrer">
            <Button size="sm" className="font-medium text-sm h-9 px-4">
              Open App
            </Button>
          </a>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-[var(--radius)] text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono font-medium text-sm text-foreground">Menu</span>
                <SheetClose asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="p-2 rounded-[var(--radius)] text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="space-y-1">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <SheetClose asChild key={href}>
                    <a
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium text-foreground hover:bg-secondary/60"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="sm:hidden flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium text-foreground hover:bg-secondary/60"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
