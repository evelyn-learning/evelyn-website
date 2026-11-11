'use client';
/**
 * Tester's flag bar for tutor brain v2 — LOCAL DEVELOPMENT ONLY (see api/tutor/v2-flag).
 *
 * Flag (key `): the tutor pauses and the tester's next words are a note, not an answer. Pressing again saves
 * the note with the turn and the board at the moment the flag was raised, and the lesson goes on.
 * Shot (key \): a picture of the tab as it is now, whichever board page is in view. The browser asks once
 * per session which tab to share; pictures taken while a flag is open are listed in that flag.
 */
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { createPortal } from 'react-dom';

export const V2_FLAGS_ON = process.env.NODE_ENV === 'development';
/** Words can still be on their way from the recogniser when the flag is closed. */
const TRAILING_WORDS_MS = 2500;

export interface V2FlagState { active: boolean; words: string[] }

export function V2FlagBar(props: {
  session: string;
  flagRef: MutableRefObject<V2FlagState>;
  /** What the session looked like when the flag was raised. */
  snapshot: () => Record<string, unknown>;
  onStart: () => void;
  onStop: () => void;
}) {
  const p = useRef(props); p.current = props;
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'open' | 'saving'>('idle');
  const phaseRef = useRef(phase); phaseRef.current = phase;
  const [words, setWords] = useState('');
  const [status, setStatus] = useState('');
  const countRef = useRef({ flags: 0, shots: 0 });
  const openRef = useRef<{ at: number; snapshot: Record<string, unknown>; shots: string[] } | null>(null);
  const streamRef = useRef<{ stream: MediaStream; video: HTMLVideoElement } | null>(null);

  useEffect(() => { setMounted(true); return () => { streamRef.current?.stream.getTracks().forEach((t) => t.stop()); }; }, []);
  useEffect(() => {
    if (phase === 'idle') return;
    const t = setInterval(() => setWords(p.current.flagRef.current.words.join(' ')), 300);
    return () => clearInterval(t);
  }, [phase]);

  const post = useCallback((query: string, init: RequestInit) => fetch(`/api/tutor/v2-flag?session=${encodeURIComponent(p.current.session)}${query}`, { method: 'POST', ...init }), []);

  const shot = useCallback(async () => {
    try {
      if (!streamRef.current || !streamRef.current.stream.active) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' }, audio: false, preferCurrentTab: true } as DisplayMediaStreamOptions);
        const video = document.createElement('video');
        video.srcObject = stream; video.muted = true;
        await video.play();
        // The first frames of a new capture are blank.
        await new Promise((r) => setTimeout(r, 400));
        streamRef.current = { stream, video };
      }
      const { video } = streamRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d')!.drawImage(video, 0, 0);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
      if (!blob) throw new Error('no picture');
      countRef.current.shots += 1;
      const name = `shot-${String(countRef.current.shots).padStart(2, '0')}-${new Date().toTimeString().slice(0, 8).replace(/:/g, '')}`;
      const res = await post(`&name=${name}`, { headers: { 'content-type': 'image/png' }, body: blob });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      openRef.current?.shots.push(`${name}.png`);
      setStatus(`${name}.png saved`);
    } catch (err) {
      setStatus(`Shot failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [post]);

  const toggle = useCallback(() => {
    if (phaseRef.current === 'saving') return;
    if (phaseRef.current === 'idle') {
      p.current.flagRef.current = { active: true, words: [] };
      openRef.current = { at: Date.now(), snapshot: p.current.snapshot(), shots: [] };
      p.current.onStart();
      setWords(''); setStatus(''); setPhase('open');
      // A picture goes with every flag once the tab is shared; the first share needs the tester's own click.
      if (streamRef.current?.stream.active) void shot();
      return;
    }
    setPhase('saving');
    setTimeout(() => {
      const open = openRef.current!; openRef.current = null;
      const note = p.current.flagRef.current.words.join(' ').trim();
      p.current.flagRef.current = { active: false, words: [] };
      countRef.current.flags += 1;
      const n = countRef.current.flags;
      void post('', { headers: { 'content-type': 'application/json' }, body: JSON.stringify({ n, at: new Date(open.at).toISOString(), closedAt: new Date().toISOString(), note, shots: open.shots, ...open.snapshot }) })
        .then((res) => setStatus(res.ok ? `Flag ${n} saved${note ? '' : ' (no words heard)'}` : `Flag ${n} NOT saved (${res.status})`))
        .catch(() => setStatus(`Flag ${n} NOT saved`));
      p.current.onStop();
      setPhase('idle');
    }, TRAILING_WORDS_MS);
  }, [post, shot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))) return;
      if (e.key === '`') { e.preventDefault(); toggle(); }
      else if (e.key === '\\') { e.preventDefault(); void shot(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, shot]);

  if (!mounted) return null;
  const btn = 'px-2.5 py-1 rounded-md text-xs font-medium border shadow-sm';
  return createPortal(
    <div data-v2-flag-bar className="fixed bottom-16 left-3 z-[9999] flex flex-col items-start gap-1.5 max-w-sm">
      {phase !== 'idle' && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900 shadow">
          <div className="font-semibold">{phase === 'open' ? 'Flag open: the tutor is paused. Say what went wrong.' : 'Saving…'}</div>
          {words && <div className="mt-1 text-red-800">{words}</div>}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={toggle} className={`${btn} ${phase === 'idle' ? 'bg-white border-gray-300 text-gray-700' : 'bg-red-600 border-red-700 text-white'}`}>{phase === 'idle' ? 'Flag  `' : 'Done  `'}</button>
        <button type="button" onClick={() => void shot()} className={`${btn} bg-white border-gray-300 text-gray-700`}>Shot  \</button>
        {status && <span className="text-[11px] text-gray-500 bg-white/90 rounded px-1.5 py-0.5">{status}</span>}
      </div>
    </div>,
    document.body,
  );
}
