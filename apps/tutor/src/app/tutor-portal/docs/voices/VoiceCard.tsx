'use client';

import { useState } from 'react';

interface VoiceCardProps {
  code: string;
  tags: string[];
  description: string;
}

/** One voice in the gallery: listen, read the tags, copy the code. */
export function VoiceCard({ code, tags, description }: VoiceCardProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the code is on screen to select */
    }
  };
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <code className="rounded bg-slate-100 px-2 py-0.5 text-sm font-semibold text-slate-900">{code}</code>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          aria-label={`Copy voice code ${code}`}
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{t}</span>
        ))}
      </div>
      <p className="text-sm text-slate-600">{description}</p>
      <audio controls preload="none" src={`/voice-samples/${code}.mp3`} className="w-full">
        Your browser cannot play this sample.
      </audio>
    </div>
  );
}
