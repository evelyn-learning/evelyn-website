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
import { resolveNoteFontFamilies } from '@/lib/tutor/whiteboard/note-font';

type HandwriteCmd = Extract<WhiteboardCommand, { action: 'handwrite' }>;
type ScribbleCmd = Extract<WhiteboardCommand, { action: 'scribble' }>;

const NOTE_MAX_W = 240;
const NOTE_LINE_H = 26;
const AMBER = '#a16207';

// Canvas font strings cannot contain `var(...)` — CanvasRenderingContext2D's
// font parser only accepts concrete family names, so assigning
// `ctx.font = '22px var(--font-caveat), var(--font-kalam), cursive'`
// silently no-ops (invalid value ignored, prior/default font kept) and
// measurement ran at the canvas default (~10px sans-serif) — placement
// rects roughly HALF the size of the rendered note, breaking the overlap
// invariant placeNote is supposed to guarantee. next/font registers its
// hashed family names ONLY reachable via these CSS custom properties (a
// literal 'Caveat' would not match the loaded font), so resolve the vars
// via getComputedStyle once and cache the concrete font string.
// 2026-07-11 round 3: the var-resolution itself moved to the shared
// note-font module — whiteboard-capture's PDF note bake hit the same
// hashed-family class of bug (baked notes rendered serif) and now
// resolves through the same helper.
let resolvedNoteFont: string | null = null;
function noteFont(): string {
  if (resolvedNoteFont) return resolvedNoteFont;
  resolvedNoteFont = `22px ${resolveNoteFontFamilies()}`;
  return resolvedNoteFont;
}

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
  ctx.font = noteFont();
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
  /** Full original note text (pre-wrap) — the student-marks label source
   *  for data-wb-note-text; NOT the wrapped/ellipsized display lines. */
  text: string;
  lines: string[];
  color: string;
  placement: Placement;
  /** Host width at placement time — proportional rescale reference. */
  hostW: number;
};

/** Resolve a note's target rect (host-relative px): prefer the feature's
 *  element, fall back to the whole item, else null (margin). Mirrors the
 *  ScribbleOverlays / student-marks measurement conventions. Also returns
 *  the CONTAINING item element, so the placement loop can swap that
 *  item's whole-card rect out of the occupied set (see the loop below —
 *  the 2026-07-11 gate's defect A). */
function targetRect(
  host: HTMLElement,
  targetId?: string,
  targetFeature?: string,
): { rect: Rect; itemEl: Element | null } | null {
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
  return {
    rect: { x: b.left - hostBox.left, y: b.top - hostBox.top, w: b.width, h: b.height },
    itemEl: el.closest('[data-wb-item-id]'),
  };
}

export function InkNotesOverlay({
  hostRef,
  contentRef,
  notes,
  labeledScribbles,
  onOverflowChange,
}: {
  // Deviation from the task-3 brief: the brief types this
  // `React.RefObject<HTMLElement | null>`. WhiteboardCanvas's
  // `pageOuterRef` (the ref Task 4 will pass in) is declared
  // `useRef<HTMLDivElement | null>(null)`, so this is narrowed to match
  // exactly rather than the looser `HTMLElement`.
  hostRef: React.RefObject<HTMLDivElement | null>;
  /** The page CONTENT wrapper (WhiteboardCanvas's pageWrapperRef) — the
   *  placement page rect is measured from THIS box, not the host's.
   *  The host also contains the overflow spacer this component drives
   *  (via onOverflowChange); measuring the host would make placement a
   *  function of its own output (spacer grows host → next placement
   *  sees a taller page → different slots → different overflow → …).
   *  The wrapper's box is spacer-independent — the spacer is a SIBLING
   *  rendered after it — so placement stays a pure function of content.
   *  Optional: when absent, falls back to the host box (pre-spacer
   *  behavior). */
  contentRef?: React.RefObject<HTMLDivElement | null>;
  notes: HandwriteCmd[];
  labeledScribbles: ScribbleCmd[];
  /** Reports how far (px) the lowest note extends BELOW the content
   *  wrapper's bottom edge (0 when everything fits). The host renders
   *  an in-flow spacer of this height after the wrapper so extended
   *  margin notes (see ink-placement's exhausted-scan extension) are
   *  scrollable instead of clipped. */
  onOverflowChange?: (px: number) => void;
}) {
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [hostW, setHostW] = useState(0);
  const animatedRef = useRef<Set<string>>(new Set());

  // Source list in command order: handwrites, then labelled scribbles —
  // each with its stamped target (if any). Key on content so React's
  // reconciliation (and the animateIn wipe-on, gated by animatedRef)
  // treats identical notes as the SAME element across re-renders — this
  // only stabilizes animation/identity, not placement: a page flip
  // changes `sources` (different page's commands) and the placement
  // effect below recomputes from scratch every time regardless.
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

  // Refit measurement once web fonts finish loading — the very first
  // placement pass can run before Caveat/Kalam are ready (canvas falls
  // back to whatever font WAS resolved, e.g. a system serif), producing
  // rects sized off the wrong glyph metrics. `document.fonts.ready`
  // resolves once, so this bumps `fontsReady` (a dep of the placement
  // effect below) exactly once to force a recompute with true metrics.
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    let live = true;
    if (typeof document === 'undefined' || !document.fonts?.ready) return;
    document.fonts.ready.then(() => {
      if (live) setFontsReady((v) => v + 1);
    });
    return () => {
      live = false;
    };
  }, []);

  // Measure + place after layout. Re-runs when sources change and when
  // the host resizes (ResizeObserver below bumps hostW).
  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let cancelled = false;

    // Entrance animations (wb-page-enter-* translateX, wb-item-enter —
    // see WhiteboardCanvas) can still be mid-transform when this effect
    // first fires; getBoundingClientRect bakes in whatever transform is
    // live at read time, so measuring immediately can freeze offset
    // placements relative to where targets end up once the animation
    // settles. Defer the actual measure/place to a double rAF — same
    // precedent as WhiteboardCanvas's scrollToNewest/runInPageScrolls —
    // so paint has a couple of frames to catch up before we read boxes.
    // Honest caveat: a 280ms page-slide is NOT fully settled after two
    // frames (~33ms) — this is a cheap skew reducer, not a full
    // settle-gate. Placements recompute again on the next
    // sources/hostW/fontsReady change, and a page flip changes `sources`
    // itself (new page's commands), so the flip case recomputes anyway.
    const measureAndPlace = () => {
      if (cancelled) return;
      const host = hostRef.current;
      if (!host) return;
      const hostBox = host.getBoundingClientRect();
      if (hostBox.width === 0) return;
      // Page rect for the slot engine, in host-relative px. Prefer the
      // content wrapper's box (spacer-independent — see the contentRef
      // prop doc); fall back to the host box when no wrapper is passed.
      const contentBox = contentRef?.current?.getBoundingClientRect();
      const page: Rect = contentBox && contentBox.width > 0
        ? {
            x: contentBox.left - hostBox.left,
            y: contentBox.top - hostBox.top,
            w: contentBox.width,
            h: Math.max(contentBox.height, 1),
          }
        : { x: 0, y: 0, w: hostBox.width, h: Math.max(hostBox.height, 1) };
      const toHostRect = (el: Element): Rect => {
        const b = el.getBoundingClientRect();
        return { x: b.left - hostBox.left, y: b.top - hostBox.top, w: b.width, h: b.height };
      };
      // Occupied set starts with every rendered item's rect — notes must
      // dodge CONTENT first, then each other. Keep the ELEMENT alongside
      // each rect: a note targeting a feature INSIDE an item needs that
      // item's whole-card rect swapped for finer-granularity rects (below).
      const itemEntries: Array<{ el: Element; rect: Rect }> = [];
      host.querySelectorAll('[data-wb-item-id]').forEach((item) => {
        itemEntries.push({ el: item, rect: toHostRect(item) });
      });
      // 2026-07-11 user round: a live note struck the "EQUATION"
      // item-separator label — that dashed row sits BETWEEN item rects (see
      // WhiteboardCanvas's data-wb-sep), so it was outside every
      // [data-wb-item-id] rect above and placeNote had no reason to dodge
      // it. Collect separator rows into occupied too, alongside the item
      // rects (not swapped for feature rects — they're never a note's own
      // target, so the itemEntries carve-out logic below doesn't apply).
      const sepRects: Rect[] = [];
      host.querySelectorAll('[data-wb-sep]').forEach((sep) => {
        const r = toHostRect(sep);
        if (r.w > 0 || r.h > 0) sepRects.push(r);
      });
      // Rects of notes already placed this pass — every later note dodges
      // every earlier one regardless of which item it targets.
      const placedRects: Rect[] = [];
      const next: NoteEntry[] = [];
      for (const src of sources) {
        const m = measureNote(src.text);
        const t = targetRect(host, src.targetId, src.targetFeature);
        // Defect A of the 2026-07-11 gate: a feature (say, vertex O) lives
        // INSIDE its item's card, so every right/above/below/left slot
        // beside it overlaps the card's own bounding rect — with that rect
        // in `occupied`, placeNote could NEVER sit beside an interior
        // feature and every near-targeted note silently degraded to the
        // margin column. Fix: for the note's own CONTAINING item, replace
        // the whole-card rect with the rects of its [data-feature]
        // descendants — the real content within the card the note must
        // dodge — so the note may use the card's whitespace beside its
        // target. All OTHER items still block via their whole rect, and
        // placeNote's target carve-out keeps the note off the target
        // itself.
        const occupied: Rect[] = [];
        for (const entry of itemEntries) {
          if (t?.itemEl && entry.el === t.itemEl) {
            entry.el.querySelectorAll('[data-feature]').forEach((f) => {
              const r = toHostRect(f);
              if (r.w > 0 || r.h > 0) occupied.push(r);
            });
          } else {
            occupied.push(entry.rect);
          }
        }
        occupied.push(...sepRects);
        occupied.push(...placedRects);
        const placement = placeNote({ target: t?.rect ?? null, occupied, page, note: { w: m.w, h: m.h } });
        placedRects.push(placement.rect);
        next.push({ key: src.key, text: src.text, lines: m.lines, color: src.color, placement, hostW: hostBox.width });
      }
      setEntries(next);
      setHostW(hostBox.width);
      // Report how far the lowest note extends below the page (content)
      // bottom so the host can grow via an in-flow spacer. Computed
      // against the same spacer-independent `page` rect placement used,
      // so this cannot feed back into placement (see contentRef doc).
      if (onOverflowChange) {
        const maxBottom = next.reduce((b, e) => Math.max(b, e.placement.rect.y + e.placement.rect.h), 0);
        onOverflowChange(Math.max(0, Math.ceil(maxBottom - (page.y + page.h))));
      }
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measureAndPlace);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [sources, hostRef, contentRef, hostW, fontsReady, onOverflowChange]);

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
            // Student-marks parity with the AnnotationStrip entries
            // (WhiteboardCanvas collectRects): data-wb-note registers the
            // note as a first-class mark target, data-wb-note-text is the
            // label a student mark on this note resolves to — the tutor's
            // original words (strip's exact 80-char cap), not the
            // wrapped/ellipsized display lines.
            data-wb-note="true"
            data-wb-note-text={e.text.length > 80 ? `${e.text.slice(0, 80)}…` : e.text}
            style={{
              position: 'absolute',
              left: e.placement.rect.x * scale,
              top: e.placement.rect.y * scale,
              maxWidth: NOTE_MAX_W,
              fontFamily: 'var(--font-caveat), var(--font-kalam), cursive',
              fontSize: 22,
              lineHeight: `${NOTE_LINE_H}px`,
              color: e.color,
              // 2026-07-11 round 2: notes crossing axis/grid lines. The
              // round-1 text-shadow halo alone was too weak where a line
              // passes through the text MIDLINE (user session: "the far
              // corner" visibly struck through by the x-axis) — the soft
              // white backdrop is the guarantee; the shadow stays layered
              // under it to feather glyph edges. Placement unchanged
              // (measureNote's box already carries +8px slack ≈ the 2×4px
              // padding). PDF lockstep: whiteboard-capture.ts's note-bake
              // path paints the SVG equivalent (white 0.72-opacity rounded
              // rect + dual-text halo) — see that file's comment
              // referencing here.
              background: 'rgba(255,255,255,0.72)',
              borderRadius: 4,
              padding: '0 4px',
              textShadow: '0 1px 2px #fff, 0 -1px 2px #fff, 1px 0 2px #fff, -1px 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff',
            }}
          >
            {e.lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        );
      })}
    </div>
  );
}
