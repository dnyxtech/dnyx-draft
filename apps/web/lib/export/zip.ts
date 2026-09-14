import type JSZip from 'jszip';
import { db } from '../db';
import type { DocumentItem, FolderItem } from '../db/schema';

const INLINE_BLOB_PATTERN = /dnyx-blob:([A-Za-z0-9_-]+)/g;

/**
 * Replaces every `dnyx-blob:<id>` reference in a document's content with a
 * relative path into an `assets/` folder, writing the referenced blob's raw
 * bytes into that folder so the exported ZIP stays portable and browsable
 * outside the app (rather than embedding images as base64 inside the .md).
 */
async function resolveInlineBlobs(
  content: string,
  assetsZip: JSZip | null,
  writtenAssets: Set<string>,
  // Documents inside a (single-level) folder sit one directory deeper than
  // the `assets/` folder, which always lives at the zip root.
  isNested: boolean,
): Promise<string> {
  if (!db || !assetsZip) return content;

  const ids = [...content.matchAll(INLINE_BLOB_PATTERN)].map((m) => m[1]);
  if (ids.length === 0) return content;

  const assetPrefix = isNested ? '../assets/' : 'assets/';
  let rewritten = content;
  for (const blobId of new Set(ids)) {
    const blob = await db.blobs.get(blobId);
    if (!blob) continue;

    const sanitizedName = blob.name.replace(/[/\\?%*:|"<>]/g, '_');
    const assetFilename = `${blobId}-${sanitizedName}`;
    if (!writtenAssets.has(assetFilename)) {
      assetsZip.file(assetFilename, blob.data);
      writtenAssets.add(assetFilename);
    }
    rewritten = rewritten.split(`dnyx-blob:${blobId}`).join(`${assetPrefix}${assetFilename}`);
  }
  return rewritten;
}

/**
 * Generates a ZIP archive Blob containing all workspace documents organized by folder hierarchy.
 */
export async function generateWorkspaceZip(
  documents: DocumentItem[],
  folders: FolderItem[],
): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const assetsZip = zip.folder('assets');
  const writtenAssets = new Set<string>();

  // Create folder maps
  const folderMap = new Map<string, typeof zip>();
  for (const folder of folders) {
    const sanitizedName = folder.name.replace(/[/\\?%*:|"<>]/g, '_');
    const folderZip = zip.folder(sanitizedName);
    if (folderZip) {
      folderMap.set(folder.id, folderZip);
    }
  }

  // Add files to respective folders or root
  for (const doc of documents) {
    if (doc.isTrash) continue;
    const filename = doc.title.endsWith('.md') ? doc.title : `${doc.title}.md`;
    const sanitizedFilename = filename.replace(/[/\\?%*:|"<>]/g, '_');
    const isNested = !!doc.folderId && folderMap.has(doc.folderId);
    const content = await resolveInlineBlobs(doc.content, assetsZip, writtenAssets, isNested);

    if (isNested) {
      const folderZip = folderMap.get(doc.folderId as string);
      folderZip?.file(sanitizedFilename, content);
    } else {
      zip.file(sanitizedFilename, content);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}
