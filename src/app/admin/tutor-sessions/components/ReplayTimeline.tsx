'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { MicOff, Upload, AlertTriangle, Zap, Ear, ListTree } from 'lucide-react';
import { curateEvents, categorizeEvent, EVENT_CATEGORIES, type EventCategory } from '@/lib/tutor/recordings/timeline-events';
import { buildSpeakerSegments } from '@/lib/tutor/recordings/segments';

export interface TimelineEvent {
  type: 'transcript' | 'whiteboard' | 'debug';
  offsetMs: number;
  data: {
    role?: string;
    type?: string;
    message?: string;
    [key: string]: unknown;
  };
}

interface ReplayTimelineProps {
  events: TimelineEvent[];
  totalDurationMs: number;
  currentTimeMs: number;
  onSeek: (timeMs: number) => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const CATEGORY_ICONS: Record<EventCategory['key'], typeof MicOff> = {
  kill: Zap,
  perception: Ear,
  mic: MicOff,
  upload: Upload,
  error: AlertTriangle,
};

export default function ReplayTimeline({ events, totalDurationMs, currentTimeMs, onSeek }: ReplayTimelineProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const laneRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Guard note: `!(totalDurationMs > 0)` — NOT `totalDurationMs <= 0`. For a
  // NaN totalDurationMs (a malformed-session edge case; see ab39e4a7's
  // marker-side "NaN% guard"), `x <= 0` and `x > 0` are BOTH false, so the
  // old `<= 0` guard here let a click through (computing `onSeek(pct * NaN)`)
  // while progressPct's `> 0` guard below froze the handle at 0% — two
  // guards that silently disagreed only when the shared value was NaN. Using
  // the same `> 0` test (negated) as the render guard means this component's
  // own "is totalDurationMs usable" check can never diverge from itself.
  // (ReplayPlayer additionally now guarantees totalDurationMs itself is never
  // NaN/≤0 — see buildCompressedTimeline's `totalMs` — so this is defense in
  // depth, not the only fix.)
  // Shared position math (byte-identical to the pre-pointer-events click/drag
  // handlers this replaced) — see scripts/test-replay-scrubber.ts's mirror
  // block for the click<->render invariant this guard/formula pair locks in.
  const seekFromClientX = useCallback((clientX: number) => {
    if (!barRef.current || !(totalDurationMs > 0)) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(pct * totalDurationMs);
  }, [totalDurationMs, onSeek]);

  // Pointer Events (mirrors the repo's own idiom in
  // WhiteboardCanvas.tsx's handlePenDown/handlePenMove/handlePenUp +
  // StudentInputBar's startDraw/draw/endDraw) subsume mouse, touch, and
  // stylus in one handler set. setPointerCapture on down means move/up
  // keep arriving even once the pointer leaves the thin strip's bounds
  // (the old buttons===1 mousemove died the instant the cursor left the
  // element) and iOS Safari — which only ever synthesizes tap-shaped mouse
  // events for a finger drag, never a mousemove stream — now gets real
  // continuous pointermove events instead.
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    // try/catch mirrors StudentInputBar's startDraw/endDraw a few hundred
    // lines into WhiteboardCanvas.tsx: setPointerCapture can throw
    // (NotFoundError) if the UA doesn't consider the pointerId an active
    // pointer — seen directly while writing this fix's Playwright coverage
    // (script-dispatched touch PointerEvents in WebKit). A real finger/mouse
    // pointerdown always has an active pointerId, so this is defense in
    // depth, not a workaround for a reachable production path — the drag
    // must keep working (isDraggingRef + the seek below) even if capture
    // itself is refused.
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    seekFromClientX(e.clientX);
  }, [seekFromClientX]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Defense: if setPointerCapture failed silently (try/catch in handlePointerDown),
    // a mouse release outside the bar leaves isDraggingRef true. Bail if we see a
    // mouse with no buttons pressed (stale drag state, not a real drag).
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      isDraggingRef.current = false;
      return;
    }
    if (!isDraggingRef.current) return;
    e.preventDefault();
    seekFromClientX(e.clientX);
  }, [seekFromClientX]);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  const progressPct = totalDurationMs > 0 ? (currentTimeMs / totalDurationMs) * 100 : 0;

  // Curated debug markers — only categorized events reach the bar; the full
  // stream lives in the toggleable lane below.
  const debugEvents = useMemo(() => events.filter((e) => e.type === 'debug'), [events]);
  const markers = useMemo(
    () => (totalDurationMs > 0 ? curateEvents(debugEvents) : []),
    [debugEvents, totalDurationMs],
  );

  // Speaker segments with the 20s gap cap (silence renders as neutral track).
  const segments = useMemo(() => {
    const entries = events
      .filter((e) => e.type === 'transcript')
      .map((e) => ({ offsetMs: e.offsetMs, role: (e.data.role as string) || 'tutor' }));
    return buildSpeakerSegments(entries, totalDurationMs);
  }, [events, totalDurationMs]);

  // Auto-follow: keep the last-passed event visible in the lane.
  const lastPassedIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < debugEvents.length; i++) {
      if (debugEvents[i].offsetMs <= currentTimeMs) idx = i;
      else break;
    }
    return idx;
  }, [debugEvents, currentTimeMs]);
  useEffect(() => {
    if (!showAllEvents || lastPassedIndex < 0 || !laneRef.current) return;
    const row = laneRef.current.querySelector<HTMLElement>(`[data-evt-idx="${lastPassedIndex}"]`);
    row?.scrollIntoView({ block: 'nearest' });
  }, [showAllEvents, lastPassedIndex]);

  return (
    <div className="space-y-1">
      {/* Time display + lane toggle. The toggle (and the debug-category
          legend chips below) are debug/admin tooling — the student replay
          page always passes debugEvents=[], so gate both on there being
          anything to show; admin sessions (non-empty debugEvents) are
          unaffected. */}
      <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono px-0.5">
        <span>{formatTime(currentTimeMs)}</span>
        {debugEvents.length > 0 && (
          <button
            onClick={() => setShowAllEvents((v) => !v)}
            className={`flex items-center gap-1 rounded px-1.5 py-0.5 font-sans text-[10px] font-medium transition-colors ${
              showAllEvents ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <ListTree className="w-3 h-3" />
            {showAllEvents ? 'Hide events' : `All events (${debugEvents.length})`}
          </button>
        )}
        <span>{formatTime(totalDurationMs)}</span>
      </div>

      {/* Timeline bar */}
      <div
        ref={barRef}
        className="relative h-6 bg-gray-200 rounded-full cursor-pointer select-none overflow-hidden"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`absolute top-0 h-full ${
              seg.role === 'student' ? 'bg-blue-100' : seg.role === 'tutor' ? 'bg-gray-300' : 'bg-yellow-100'
            }`}
            style={{ left: `${(seg.start / totalDurationMs) * 100}%`, width: `${((seg.end - seg.start) / totalDurationMs) * 100}%` }}
          />
        ))}

        <div
          className="absolute top-0 left-0 h-full bg-blue-500/30 rounded-l-full"
          style={{ width: `${progressPct}%` }}
        />

        {markers.map((ev, i) => {
          const Icon = CATEGORY_ICONS[ev.category.key];
          return (
            <button
              key={`marker-${i}`}
              type="button"
              className="absolute top-0.5 -translate-x-1/2 group"
              style={{ left: `${(ev.offsetMs / totalDurationMs) * 100}%` }}
              onClick={(e) => { e.stopPropagation(); onSeek(ev.offsetMs); }}
              onPointerDown={(e) => e.stopPropagation()}
              title={`${ev.data.type}: ${(ev.data.message as string) || ''}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${ev.category.color}`}>
                <Icon className="w-2 h-2 text-white" />
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                {formatTime(ev.offsetMs)} · {ev.data.type}: {((ev.data.message as string) || '').slice(0, 60)}
              </div>
            </button>
          );
        })}

        <div
          className="absolute top-0 h-full w-0.5 bg-blue-600"
          style={{ left: `${progressPct}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
        </div>
      </div>

      {/* Legend — one entry per curated category + speakers */}
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-400 px-0.5">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-100 border border-blue-200" /> Student</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-gray-300" /> Tutor</span>
        {debugEvents.length > 0 && EVENT_CATEGORIES.map((c) => (
          <span key={c.key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${c.color}`} /> {c.label}
          </span>
        ))}
      </div>

      {/* All-events lane */}
      {showAllEvents && (
        <div ref={laneRef} className="max-h-36 overflow-y-auto rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
          {debugEvents.map((ev, i) => {
            const cat = ev.data.type ? categorizeEvent(ev.data.type) : null;
            return (
              <button
                key={`lane-${i}`}
                type="button"
                data-evt-idx={i}
                onClick={() => onSeek(ev.offsetMs)}
                className={`w-full flex items-center gap-2 px-2 py-1 text-left text-[11px] hover:bg-blue-50 ${
                  i === lastPassedIndex ? 'bg-blue-50/70' : ''
                }`}
              >
                <span className="font-mono text-gray-400 shrink-0">{formatTime(ev.offsetMs)}</span>
                <span className={`shrink-0 rounded px-1 text-[10px] font-medium ${cat ? `${cat.color} text-white` : 'bg-gray-100 text-gray-500'}`}>
                  {ev.data.type}
                </span>
                <span className="truncate text-gray-600">{(ev.data.message as string) || ''}</span>
              </button>
            );
          })}
          {debugEvents.length === 0 && (
            <div className="px-2 py-2 text-[11px] text-gray-400">No debug events in this session.</div>
          )}
        </div>
      )}
    </div>
  );
}
