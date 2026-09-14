'use client';

import { ImagePlus, Link2, Upload } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';

interface InsertMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (markdown: string) => void;
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const inputCls =
  'w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors placeholder:text-slate-400';
const labelCls =
  'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';

export const InsertMediaModal: React.FC<InsertMediaModalProps> = ({
  open,
  onOpenChange,
  onInsert,
}) => {
  const { createInlineBlob } = useWorkspaceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [inserting, setInserting] = useState(false);

  const reset = () => {
    setFile(null);
    setUploadDescription('');
    setMediaUrl('');
    setUrlDescription('');
    setIsDragOver(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleFileSelect = (files: FileList | null) => {
    const picked = files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith('image/') && !picked.type.startsWith('video/')) {
      toast.error('Please choose an image, GIF, or video file');
      return;
    }
    setFile(picked);
    if (!uploadDescription) setUploadDescription(picked.name.replace(/\.[^.]+$/, ''));
  };

  const handleUploadInsert = async () => {
    if (!file) return;
    setInserting(true);
    try {
      const blobId = await createInlineBlob(file);
      onInsert(`![${uploadDescription || file.name}](dnyx-blob:${blobId})`);
      handleClose(false);
    } catch {
      toast.error('Failed to store the file locally');
    } finally {
      setInserting(false);
    }
  };

  const handleUrlInsert = () => {
    if (!isValidUrl(mediaUrl)) return;
    onInsert(`![${urlDescription || 'image'}](${mediaUrl.trim()})`);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-blue-500" />
            Insert image, GIF, or video
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="upload">Upload Image, GIF, or Video</TabsTrigger>
            <TabsTrigger value="url">External Media (URL)</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileSelect(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              {file ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {file.name}
                </p>
              ) : (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Drop a file here
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                or use the button below
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
            <div>
              <label htmlFor="upload-description" className={labelCls}>
                Description
              </label>
              <input
                id="upload-description"
                type="text"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Describe the image"
                className={inputCls}
              />
            </div>
            <Button
              type="button"
              className="w-full"
              disabled={!file || inserting}
              onClick={handleUploadInsert}
            >
              {inserting ? 'Inserting…' : 'Insert'}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-3">
            <div>
              <label htmlFor="media-url" className={labelCls}>
                Media URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="media-url"
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://"
                  className={`${inputCls} pl-8`}
                />
              </div>
              {mediaUrl.trim() && !isValidUrl(mediaUrl) && (
                <p className="text-[11px] text-amber-500 mt-1">
                  ⚠ Enter a valid URL starting with https://
                </p>
              )}
            </div>
            <div>
              <label htmlFor="url-description" className={labelCls}>
                Description
              </label>
              <input
                id="url-description"
                type="text"
                value={urlDescription}
                onChange={(e) => setUrlDescription(e.target.value)}
                placeholder="Describe the image"
                className={inputCls}
              />
            </div>
            <Button
              type="button"
              className="w-full"
              disabled={!isValidUrl(mediaUrl)}
              onClick={handleUrlInsert}
            >
              Insert
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
