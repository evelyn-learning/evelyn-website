'use client';

/**
 * SmoothDraw Phase 3 — on-board tutor notes.
 *
 * Replaces the AnnotationStrip (flag TUTOR_INK_NOTES): tutor_handwrite
 * text and tutor_scribble labels render as hand-written notes placed
 * BESIDE their targets. All spatial decisions come from the pure slot
 * engine (ink-placement.ts); this component only measures the DOM and
 * paints. Placement runs in command order and registers each result
 * into the occupied set, so later notes cannot collide with earlier
 * ones. Unresolved targets place in the margin column (silent — the
 * round-7 philosophy).
 *
 * Anchoring matches student ink: positions are computed in host-px and
 * rescaled proportionally on host width changes, so appended content
 * below never moves a note and resizes keep notes on their targets.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { WhiteboardCommand } from '@/lib/knowledge/types';
import { placeNote, type Placement, type Rect } from '@/lib/tutor/whiteboard/ink-placement';

type HandwriteCmd = Extract<WhiteboardCommand, { action: 'handwrite' }>;
type ScribbleCmd = Extract<WhiteboardCommand, { action: 'scribble' }>;

const NOTE_FONT = '22px var(--font-caveat), var(--font-kalam), cursive';
const NOTE_MAX_W = 240;
const NOTE_LINE_H = 26;
const AMBER = '#a16207';

// Deviation from the task-3 brief: the brief measures via a
// `declare namespace measureNote { let _c: ... }` merged onto the
// function so the canvas cache lives on `measureNote._c`. That pattern
// fights this repo's `@typescript-eslint/no-namespace` lint posture
// more than it's worth for a private cache slot, so it's replaced here
// with an equivalent module-level variable — same one-canvas-per-module
// semantics, no namespace merging.
let measureCanvas: HTMLCanvasElement | undefined;

/** Measure and wrap note text to ≤3 lines (ellipsis on overflow) using a
 *  shared canvas 2d context. Returns wrapped lines + the box size. */
function measureNote(text: string): { lines: string[]; w: number; h: number } {
  const canvas = measureCanvas ?? (measureCanvas = document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  if (!ctx) return { lines: [text], w: NOTE_MAX_W, h: NOTE_LINE_H };
  ctx.font = NOTE_FONT;
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width <= NOTE_MAX_W || !line) line = probe;
    else {
      lines.push(line);
      line = word;
      if (lines.length === 3) break;
    }
  }
  if (lines.length < 3 && line) lines.push(line);
  else if (line && lines.length === 3) lines[2] = `${lines[2].slice(0, -1)}…`;
  const w = Math.min(NOTE_MAX_W, Math.max(...lines.map((l) => ctx.measureText(l).width), 24)) + 8;
  return { lines, w, h: lines.length * NOTE_LINE_H + 4 };
}

type NoteEntry = {
  key: string;
  lines: string[];
  color: string;
  placement: Placement;
  /** Host width at placement time — proportional rescale reference. */
  hostW: number;
};

/** Resolve a note's target rect (host-relative px): prefer the feature's
 *  element, fall back to the whole item, else null (margin). Mirrors the
 *  ScribbleOverlays / student-marks measurement conventions. */
function targetRect(host: HTMLElement, targetId?: string, targetFeature?: string): Rect | null {
  const hostBox = host.getBoundingClientRect();
  let el: Element | null = null;
  if (targetId) {
    const item = host.querySelector(`[data-wb-item-id="${targetId.replace(/"/g, '\\"')}"]`);
    if (item && targetFeature) el = item.querySelector(`[data-feature="${targetFeature.replace(/"/g, '\\"')}"]`) ?? item;
    else el = item;
  }
  if (!el && targetFeature) el = host.querySelector(`[data-feature="${targetFeature.replace(/"/g, '\\"')}"]`);
  if (!el) return null;
  const b = el.getBoundingClientRect();
  if (b.width === 0 && b.height === 0) return null;
  return { x: b.left - hostBox.left, y: b.top - hostBox.top, w: b.width, h: b.height };
}

export function InkNotesOverlay({
  hostRef,
  notes,
  labeledScribbles,
}: {
  // Deviation from the task-3 brief: the brief types this
  // `React.RefObject<HTMLElement | null>`. WhiteboardCanvas's
  // `pageOuterRef` (the ref Task 4 will pass in) is declared
  // `useRef<HTMLDivElement | null>(null)`, so this is narrowed to match
  // exactly rather than the looser `HTMLElement`.
  hostRef: React.RefObject<HTMLDivElement | null>;
  notes: HandwriteCmd[];
  labeledScribbles: ScribbleCmd[];
}) {
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [hostW, setHostW] = useState(0);
  const animatedRef = useRef<Set<string>>(new Set());

  // Source list in command order: handwrites, then labelled scribbles —
  // each with its stamped target (if any). Key on content so re-renders
  // and page flips never replace placements.
  const sources = React.useMemo(() => {
    const s: Array<{ key: string; text: string; color: string; targetId?: string; targetFeature?: string }> = [];
    notes.forEach((n, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = n as any;
      s.push({ key: `hw-${i}-${n.text}`, text: n.text ?? '', color: n.color || AMBER, targetId: a.targetId, targetFeature: a.targetFeature });
    });
    labeledScribbles.forEach((sc, i) => {
      if (!sc.label || !sc.label.trim()) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = sc as any;
      s.push({ key: `sl-${i}-${sc.label}`, text: sc.label, color: sc.color || AMBER, targetId: a.targetId, targetFeature: a.targetFeature });
    });
    return s;
  }, [notes, labeledScribbles]);

  // Measure + place after layout. Re-runs when sources change and when
  // the host resizes (ResizeObserver below bumps hostW).
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostBox = host.getBoundingClientRect();
    if (hostBox.width === 0) return;
    const page: Rect = { x: 0, y: 0, w: hostBox.width, h: Math.max(hostBox.height, 1) };
    // Occupied set starts with every rendered item's rect — notes must
    // dodge CONTENT first, then each other.
    const occupied: Rect[] = [];
    host.querySelectorAll('[data-wb-item-id]').forEach((item) => {
      const b = item.getBoundingClientRect();
      occupied.push({ x: b.left - hostBox.left, y: b.top - hostBox.top, w: b.width, h: b.height });
    });
    const next: NoteEntry[] = [];
    for (const src of sources) {
      const m = measureNote(src.text);
      const t = targetRect(host, src.targetId, src.targetFeature);
      // A feature rect INSIDE an item is fine to sit beside — carve the
      // feature out of the occupied test by passing it as the target;
      // the whole-item rects in `occupied` still block slots that would
      // cover OTHER content. When the target IS a whole item, the right/
      // above/below/left slots naturally sit outside it.
      const placement = placeNote({ target: t, occupied, page, note: { w: m.w, h: m.h } });
      occupied.push(placement.rect);
      next.push({ key: src.key, lines: m.lines, color: src.color, placement, hostW: hostBox.width });
    }
    setEntries(next);
    setHostW(hostBox.width);
  }, [sources, hostRef, hostW]);

  // Host width tracking (student-ink pattern): proportional rescale.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(() => {
      const w = host.getBoundingClientRect().width;
      setHostW((prev) => (Math.abs(prev - w) > 1 ? w : prev));
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [hostRef]);

  // Per-word wipe-on, once per note key (WAAPI on the note div).
  const animateIn = (el: HTMLDivElement | null, key: string) => {
    if (!el || animatedRef.current.has(key)) return;
    animatedRef.current.add(key);
    el.animate(
      [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }],
      { duration: Math.min(900, 250 + el.textContent!.length * 12), easing: 'ease-out', fill: 'backwards' },
    );
  };

  if (entries.length === 0) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }} aria-label="tutor notes">
      {entries.map((e) => {
        const scale = e.hostW > 0 && hostW > 0 ? hostW / e.hostW : 1;
        return (
          <div
            key={e.key}
            ref={(el) => animateIn(el, e.key)}
            data-wb-note
            style={{
              position: 'absolute',
              left: e.placement.rect.x * scale,
              top: e.placement.rect.y * scale,
              maxWidth: NOTE_MAX_W,
              fontFamily: 'var(--font-caveat), var(--font-kalam), cursive',
              fontSize: 22,
              lineHeight: `${NOTE_LINE_H}px`,
              color: e.color,
            }}
          >
            {e.lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        );
      })}
    </div>
  );
}
