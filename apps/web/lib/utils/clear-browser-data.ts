import { db } from '@/lib/db';

/**
 * Full local reset: wipes every IndexedDB table, unregisters the service
 * worker, clears its caches, and clears localStorage — as if the site had
 * never been visited. Reloads the page afterward. Irreversible; callers are
 * responsible for confirming with the user first.
 */
export async function clearAllBrowserData(): Promise<void> {
  if (db) {
    await Promise.all([
      db.documents.clear(),
      db.folders.clear(),
      db.revisions.clear(),
      db.blobs.clear(),
      db.comments.clear(),
      db.tokens.clear(),
    ]);
  }

  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }

  localStorage.clear();
  window.location.reload();
}
