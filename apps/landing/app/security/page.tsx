import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Database,
  KeyRound,
  Lock,
  ServerOff,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';

export default function SecurityPolicyPage() {
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
            Security &amp; Cryptography Model
          </h1>
          <p className="text-xs text-muted-foreground">
            Dnyx Tech &bull; Zero-Knowledge Client-Side Architecture
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 mb-10 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-foreground leading-relaxed">
            <strong className="block font-bold mb-1">Zero-Knowledge Guarantee</strong>
            Dnyx Draft uses the W3C WebCrypto API natively inside your browser. All encryption keys are derived on-the-fly and never leave client memory.
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">1. Key Derivation: PBKDF2</h2>
            <p>
              When you set a password for a document, your passphrase is converted into a 256-bit symmetric key using <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong>:
            </p>
            <div className="p-4 rounded-xl bg-secondary/40 font-mono text-xs text-foreground space-y-1 border border-border">
              <div>Algorithm: PBKDF2</div>
              <div>Hash Digest: SHA-256</div>
              <div>Iteration Count: 100,000 rounds</div>
              <div>Salt: 16 bytes cryptographically secure random (window.crypto.getRandomValues)</div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">2. Symmetric Cipher: AES-256-GCM</h2>
            <p>
              Document payloads are encrypted using <strong>AES-GCM (Galois/Counter Mode)</strong> with a 256-bit key length. GCM provides both confidentiality and built-in cryptographic integrity authentication:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Initialization Vector (IV):</strong> 12 bytes unique random per document encryption.</li>
              <li><strong>Authentication Tag:</strong> 128-bit authentication tag to prevent tampering.</li>
              <li><strong>Ciphertext format:</strong> Base64 encoded payload containing salt, IV, and ciphertext.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">3. Local-First Sandboxing</h2>
            <p>
              Data is stored in browser <code>IndexedDB</code>. Browsers strictly enforce the Same-Origin Policy (SOP), ensuring that other websites or browser tabs cannot access your Markdown documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">4. Corporate Attribution</h2>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1 text-xs">
              <div className="font-medium text-foreground">Dnyx Tech</div>
              <div className="text-muted-foreground">A Division of Dnyx Business Solutions Private Limited</div>
              <div className="text-muted-foreground">Dnyx Group Corporate Governance</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
