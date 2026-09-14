'use client';

import { Check, Copy, Eye, Pencil, Users, Wifi, WifiOff } from 'lucide-react';
import { nanoid } from 'nanoid';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'editor' | 'viewer';
}

interface LiveShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LiveShareModal: React.FC<LiveShareModalProps> = ({ open, onOpenChange }) => {
  const { documents, activeDocumentId, updateDocument } = useWorkspaceStore();
  const activeDoc = documents.find((d) => d.id === activeDocumentId);

  const [displayName, setDisplayName] = useState(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('md-live-name') || 'Anonymous'
      : 'Anonymous',
  );
  const [accessMode, setAccessMode] = useState<'edit' | 'view'>('edit');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clientId = useRef(nanoid());

  const stopRoom = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setConnected(false);
    setRoomId(null);
    setInviteUrl(null);
    setParticipants([]);
  }, []);

  const startRoom = async () => {
    if (!activeDoc) return;
    setStarting(true);
    try {
      const res = await fetch('/api/live-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: activeDoc.content,
          title: activeDoc.title,
          hostName: displayName,
          hostId: clientId.current,
          accessMode,
        }),
      });
      if (!res.ok) throw new Error('Failed to create room');
      const data = await res.json();
      const id: string = data.roomId;
      setRoomId(id);
      const url = `${window.location.origin}?live=${id}&name=${encodeURIComponent(displayName)}`;
      setInviteUrl(url);
      setConnected(true);
      localStorage.setItem('md-live-name', displayName);

      // Poll for room updates every 2s
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`/api/live-room?id=${id}&clientId=${clientId.current}`);
          if (!r.ok) return;
          const d = await r.json();
          setParticipants(d.participants ?? []);
          // Apply remote content changes if we're not the one who just saved
          if (d.content !== undefined && d.content !== activeDoc?.content) {
            if (activeDocumentId) {
              updateDocument(activeDocumentId, { content: d.content });
            }
          }
        } catch {
          // ignore poll errors
        }
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start live share');
    } finally {
      setStarting(false);
    }
  };

  // Push content updates to room
  // biome-ignore lint/correctness/useExhaustiveDependencies: activeDoc excluded — content is the trigger
  useEffect(() => {
    if (!roomId || !connected || !activeDoc) return;
    fetch('/api/live-room', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, content: activeDoc.content, clientId: clientId.current }),
    }).catch(() => {});
  }, [activeDoc?.content, roomId, connected]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) stopRoom();
  }, [open, stopRoom]);

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {connected ? (
              <Wifi className="h-4 w-4 text-emerald-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-slate-400" />
            )}
            Live Share
          </DialogTitle>
          <DialogDescription>
            Collaborate in real-time on &quot;{activeDoc?.title}&quot;
          </DialogDescription>
        </DialogHeader>

        {!connected ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Your display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] outline-none focus:border-blue-500"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Participant access
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      mode: 'edit',
                      icon: Pencil,
                      label: 'Can edit',
                      hint: 'Participants can make changes',
                    },
                    {
                      mode: 'view',
                      icon: Eye,
                      label: 'View only',
                      hint: 'Participants can only watch',
                    },
                  ] as const
                ).map(({ mode, icon: Icon, label, hint }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAccessMode(mode)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-sm font-medium border transition-colors ${
                      accessMode === mode
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    <span
                      className={`text-[10px] font-normal ${accessMode === mode ? 'text-blue-100' : 'text-slate-400'}`}
                    >
                      {hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={startRoom}
              disabled={starting || !displayName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {starting ? 'Starting…' : 'Start Live Share'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Live · Room {roomId?.slice(0, 8)}
              </span>
            </div>

            {/* Invite link */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Invite link ({accessMode === 'edit' ? 'Can edit' : 'View only'})
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteUrl ?? ''}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono truncate"
                />
                <Button type="button" size="sm" onClick={handleCopy} variant="outline">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Participants */}
            {participants.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Users className="h-3.5 w-3.5" />
                  Participants ({participants.length})
                </div>
                <div className="space-y-1">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900/50"
                    >
                      <span className="text-xs text-slate-700 dark:text-slate-200">{p.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          p.role === 'host'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                            : p.role === 'editor'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="destructive"
              onClick={stopRoom}
              className="w-full text-sm"
            >
              Stop Live Share
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
