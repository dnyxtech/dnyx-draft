import { ArrowLeft, FileText, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <h1 className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} &bull; Dnyx Tech (Dnyx Group)
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Dnyx Draft (&quot;the Service&quot;), provided by Dnyx Tech (A Division of Dnyx Business Solutions Private Limited), you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">2. Open-Source &amp; Local-First Software</h2>
            <p>
              Dnyx Draft is provided as free, open-source software under the MIT License. You have complete freedom to use, modify, distribute, and execute the software for personal, academic, or commercial purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">3. User Data Responsibility</h2>
            <p>
              Because Dnyx Draft is a local-first application operating on your device&apos;s IndexedDB storage without cloud backups, you maintain complete ownership and responsibility for backing up your files (using the built-in ZIP archive export). Dnyx Tech is not responsible for data loss resulting from cleared browser caches or device malfunction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">4. Encryption Passwords</h2>
            <p>
              When utilizing client-side AES-256 password encryption, Dnyx Tech does not store your passwords. If you forget your password for an encrypted note, the content cannot be recovered by any party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">5. Disclaimer of Warranty</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">6. Organization &amp; Legal Entity</h2>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1 text-xs">
              <div className="font-medium text-foreground">Dnyx Tech</div>
              <div className="text-muted-foreground">A Division of Dnyx Business Solutions Private Limited</div>
              <div className="text-muted-foreground">Part of Dnyx Group</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
