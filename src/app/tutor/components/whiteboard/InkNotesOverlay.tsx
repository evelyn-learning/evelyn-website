'use client';

/**
 * SmoothDraw Phase 3 — on-board tutor notes.
 *
 * Default board behavior since the 2026-07-11 legibility gate (kill switch
 * `NEXT_PUBLIC_TUTOR_INK_NOTES=off`, gated via inkNotesEnabled() at the
 * WhiteboardCanvas mount site): tutor_handwrite text and tutor_scribble
 * labels render as hand-written notes placed BESIDE their targets. This
 * is the ONLY place tutor notes render — the AnnotationStrip it replaced
 * is deleted, not a fallback. All spatial decisions come from the pure
 * slot engine (ink-placement.ts); this component only measures the DOM
 * and paints. Placement runs in command order and registers each result
 * into the occupied set, so later notes cannot collide with earlier
 * ones. Unresolved targets place in the margin column (silent — the
 * round-7 philosophy).
 *
 * Anchoring matches student ink: positions are computed in host-px and
 * rescaled proportionally on host width changes, so appended content
 * below never moves a note and resizes keep notes on their targets.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { WhiteboardCommand } from '@core/knowledge/types';
import { placeNote, applyUserPos, clampIntoPage, type Placement, type Rect } from '@/lib/tutor/whiteboard/ink-placement';
import { resolveNoteFontFamilies } from '@/lib/tutor/whiteboard/note-font';
import { arrowSpine, arrowHeads, strokeOutline, type Pt } from '@/lib/tutor/whiteboard/hand-stroke';
import { exceedsDragThreshold } from '@/lib/tutor/qpin-behavior';

type HandwriteCmd = Extract<WhiteboardCommand, { action: 'handwrite' }>;
type ScribbleCmd = Extract<WhiteboardCommand, { action: 'scribble' }>;
type LinkCmd = Extract<WhiteboardCommand, { action: 'link' }>;

const NOTE_MAX_W = 240;
const NOTE_LINE_H = 26;
const AMBER = '#a16207';

/** Round 29 follow-up: host-width delta (px) below which the placement
 *  cache SURVIVES. A scrollbar materializing (content growth via the
 *  noteOverflowPx spacer) narrows the host by ~15px — wiping the cache
 *  on that "resize" defeated the whole sticky-placement fix and let
 *  margin notes re-derive from the new content bottom (the drift bug).
 *  Genuine window/layout resizes exceed this and still wipe. Measured
 *  against the width at the LAST wipe, so a slow drag that accumulates
 *  past the tolerance wipes too. */
const CACHE_WIPE_WIDTH_TOLERANCE = 24;
/** Round-6e: below this host width there is no true margin column — a note
 *  that can't find a clean slot is skipped instead of overlapping content
 *  (see the skip branch in the placement loop). ~Phone portrait width. */
const NARROW_HOST_NOTE_SKIP_W = 560;

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
  /** R2 E3: undefined for arrow labels (no command of their own — never
   *  draggable). Present for handwrite/scribble notes; `id` may still be
   *  undefined for an edge case where the source command was never
   *  stamped with one (drag is disabled for that note — see the render
   *  gate below, same round-7 fail-soft philosophy as the rest of this
   *  file). */
  kind?: 'handwrite' | 'scribble';
  id?: string;
};

/** SmoothDraw P4: a measured arrow ready to render. `spine` is in
 *  host-px, computed once per measuring pass (same cadence as notes).
 *  On host-width change the render applies an SVG `scale()` transform
 *  — unlike notes (which rescale POSITION only, keeping their text
 *  size), this scales position AND stroke size. That divergence is
 *  transient and cosmetic: the width change re-runs the measuring
 *  effect, which recomputes spines from freshly-measured endpoint
 *  rects at the new width and resets hostW — the transform is only a
 *  stopgap between the resize frame and that remeasure. */
type ArrowEntry = {
  key: string;
  spine: Pt[];
  color: string;
  hostW: number;
};

/** Shared shape for the placement `sources` list: either a DOM-target
 *  note (targetId/targetFeature, resolved via targetRect) or an arrow
 *  label whose target is a literal rect (the spine midpoint) rather
 *  than a queryable element. */
type NoteSource = {
  key: string;
  text: string;
  color: string;
  targetId?: string;
  targetFeature?: string;
  /** SmoothDraw P4: arrow labels supply this instead of targetId/
   *  targetFeature — bypasses the DOM lookup in targetRect(). */
  explicitTarget?: Rect;
  /** SmoothDraw P4: set on arrow-label sources — the key of the arrow
   *  this label belongs to. The per-source occupied assembly SKIPS that
   *  arrow's padded bbox (same class of carve as defect A's own-item
   *  swap in the loop below): the label's midpoint target sits INSIDE
   *  its own arrow's bbox, so without the carve every right/above/
   *  below/left slot beside the waist collides with the arrow's own
   *  rect and the label always degrades to the margin column (proven
   *  on all diagonal seeds). Everyone ELSE still dodges every arrow. */
  ownerArrowKey?: string;
  /** R2 E3: which command array this source addresses (for the drag
   *  callback) and the command's own stamped `id` (undefined for arrow
   *  labels, which have no command of their own — those never offer
   *  drag). Addressing by id, not by position in a filtered array: the
   *  overlay only ever sees ONE page's commands, already page-relocated
   *  (cross-page scribble targeting) and dedup-filtered by
   *  WhiteboardCanvas's `pages` memo — an index recomputed from a
   *  filter predicate on the raw command stream cannot be trusted to
   *  name the same command back there. `id` sidesteps that. */
  kind?: 'handwrite' | 'scribble';
  id?: string;
  /** R2 E3: the command's stored drag offset, if the student already
   *  dragged this note — the placement effect applies it directly via
   *  applyUserPos, bypassing the slot engine. */
  userPos?: { dx: number; dy: number };
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
): { rect: Rect; itemEl: Element | null; el: Element } | null {
  const hostBox = host.getBoundingClientRect();
  let el: Element | null = null;
  let matchedFeature = false;
  if (targetId) {
    const item = host.querySelector(`[data-wb-item-id="${targetId.replace(/"/g, '\\"')}"]`);
    if (item && targetFeature) {
      const f = item.querySelector(`[data-feature="${targetFeature.replace(/"/g, '\\"')}"]`);
      matchedFeature = !!f;
      el = f ?? item;
    } else el = item;
  }
  if (!el && targetFeature) {
    el = host.querySelector(`[data-feature="${targetFeature.replace(/"/g, '\\"')}"]`);
    matchedFeature = !!el;
  }
  if (!el) return null;
  let b = el.getBoundingClientRect();
  if (b.width === 0 && b.height === 0) return null;
  // Round-17 (2026-07-17, session portal-ef215ea0): for FEATURE targets,
  // shrink the rect to the union of the element's children — the CONTENT
  // extent. An MCQ choice row is a full-width flex <li> whose text ends
  // early: with the container's rect as the target, the row's own trailing
  // whitespace counts as "inside the target" (unplaceable) and the 'right'
  // slot starts past the card edge, so every near slot failed and the
  // scribble labels ("correct") degraded to the below-page margin
  // extension, pooling under the LAST card — two verdicts for two
  // different problems read as a repeat under one problem. Content-extent
  // targets put the label beside the text, in the row's own whitespace.
  if (matchedFeature && el.children.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const child of Array.from(el.children)) {
      const cb = child.getBoundingClientRect();
      if (cb.width === 0 && cb.height === 0) continue;
      minX = Math.min(minX, cb.left); minY = Math.min(minY, cb.top);
      maxX = Math.max(maxX, cb.right); maxY = Math.max(maxY, cb.bottom);
    }
    if (minX < maxX && minY < maxY) {
      b = new DOMRect(minX, minY, maxX - minX, maxY - minY);
    }
  }
  return {
    rect: { x: b.left - hostBox.left, y: b.top - hostBox.top, w: b.width, h: b.height },
    itemEl: el.closest('[data-wb-item-id]'),
    el,
  };
}

export function InkNotesOverlay({
  hostRef,
  contentRef,
  notes,
  labeledScribbles,
  links,
  onOverflowChange,
  onNoteMoved,
  onNoteTap,
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
  /** SmoothDraw P4: hand-drawn arrows. Measured + placed in the SAME
   *  pass as notes so labels share one placement/occupied space. */
  links: LinkCmd[];
  /** Reports how far (px) the lowest note extends BELOW the content
   *  wrapper's bottom edge (0 when everything fits). The host renders
   *  an in-flow spacer of this height after the wrapper so extended
   *  margin notes (see ink-placement's exhausted-scan extension) are
   *  scrollable instead of clipped. */
  onOverflowChange?: (px: number) => void;
  /** R2 E3: fires when the student finishes dragging a note — the owner
   *  stamps `userPos` onto the source command (and persistence follows
   *  the existing whiteboardCommands pipeline for free). Addressed by
   *  the command's stamped `id`, NOT by array position — see NoteSource's
   *  doc comment for why an index can't be trusted here. */
  onNoteMoved?: (ref: { kind: 'handwrite' | 'scribble'; id: string; userPos: { dx: number; dy: number } }) => void;
  /** R2 fix-1 (review round 1): a note's own div is `pointer-events-auto`
   *  once it's draggable (required — an element can't conditionally
   *  intercept only long-presses in pure CSS), which means a plain tap on
   *  it no longer naturally falls through to WhiteboardCanvas's
   *  `pageWrapperRef` tap-to-mark wrapper (siblings, not ancestor/
   *  descendant — the fallthrough that made pre-drag tap-to-mark-a-note
   *  work relied on `pointer-events: none` letting the hit-test skip the
   *  note entirely). This is the replacement path: fired with the tap's
   *  raw client coordinates on a sub-threshold release (never on a
   *  completed drag, never on pointercancel) so the owner can forward to
   *  the SAME resolution a pass-through tap would have used
   *  (WhiteboardCanvas wires this to its own `fireStudentTap`, which
   *  internally already reads `data-wb-note` rects via `collectRects()`
   *  — so a tap landing on this exact note still resolves as a
   *  `feature: 'teacher-note'` mark, identical to pre-drag-feature
   *  behavior). Absent ⇒ a tap on a draggable note is simply inert
   *  (still no worse than not having a fallback at all). */
  onNoteTap?: (clientX: number, clientY: number) => void;
}) {
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [arrows, setArrows] = useState<ArrowEntry[]>([]);
  const [hostW, setHostW] = useState(0);
  const animatedRef = useRef<Set<string>>(new Set());

  // R2 E3: drag machinery — mirrors SessionStage's q-pin drag exactly
  // (5px tap/drag threshold via exceedsDragThreshold, capture ONLY once
  // the threshold is exceeded, pointercancel routes through the same end
  // handler WITHOUT arming any click suppression, a `buttons === 0` move
  // with no active drag self-heals a stale pre-threshold press). One drag
  // at a time — notes are few, a single ref is enough. All positions here
  // are UNSCALED content px (the overlay's own coordinate space before
  // the `scale` render factor); pointer client-px deltas are divided by
  // `scale` to land in that space.
  const dragRef = useRef<{
    key: string;
    kind: 'handwrite' | 'scribble';
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number; // note rect x, content px, at pointerdown
    originY: number;
    anchorX: number; // resolved target rect origin (content px), page origin if targetless
    anchorY: number;
    dragging: boolean;
  } | null>(null);
  const [dragOverridePos, setDragOverridePosState] = useState<{ key: string; x: number; y: number } | null>(null);
  // Mirrored into a ref so measureAndPlace (below) can read the CURRENT
  // override without depending on it — see the release-flash fix at that
  // effect's end for why. All existing call sites just say
  // `setDragOverridePos(...)`; this wrapper keeps that spelling while also
  // updating the ref synchronously (a raw useState setter has no synchronous
  // read-back — a ref is the standard escape hatch for "effect needs the
  // latest value without re-running on every change").
  const dragOverridePosRef = useRef<{ key: string; x: number; y: number } | null>(null);
  const setDragOverridePos = (v: { key: string; x: number; y: number } | null) => {
    dragOverridePosRef.current = v;
    setDragOverridePosState(v);
  };
  // Current page rect + each entry's resolved anchor, refreshed every
  // placement pass — read by the drag handlers (which run outside the
  // placement effect) to clamp/convert without re-measuring the DOM on
  // every pointermove.
  const pageRectRef = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const anchorsRef = useRef<Map<string, Rect | null>>(new Map());

  // Source list in command order: handwrites, then labelled scribbles —
  // each with its stamped target (if any). Key on content so React's
  // reconciliation (and the animateIn wipe-on, gated by animatedRef)
  // treats identical notes as the SAME element across re-renders — this
  // only stabilizes animation/identity, not placement: a page flip
  // changes `sources` (different page's commands) and the placement
  // effect below recomputes from scratch every time regardless.
  const sources = React.useMemo(() => {
    const s: NoteSource[] = [];
    notes.forEach((n, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = n as any;
      s.push({
        key: `hw-${i}-${n.text}`, text: n.text ?? '', color: n.color || AMBER,
        targetId: a.targetId, targetFeature: a.targetFeature,
        kind: 'handwrite', id: typeof a.id === 'string' ? a.id : undefined, userPos: a.userPos,
      });
    });
    labeledScribbles.forEach((sc, i) => {
      if (!sc.label || !sc.label.trim()) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = sc as any;
      s.push({
        key: `sl-${i}-${sc.label}`, text: sc.label, color: sc.color || AMBER,
        targetId: a.targetId, targetFeature: a.targetFeature,
        kind: 'scribble', id: typeof a.id === 'string' ? a.id : undefined, userPos: a.userPos,
      });
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
  // Round 29 (note drift): placement used to be recomputed from scratch on
  // EVERY new board command — placeNote's margin/extension fallback derives
  // its y from the page's current content bottom, so a note that fell
  // through to the margin migrated downward with each appended item (live:
  // "$10$ is even" descended across three renders). Cache each note's
  // placement by key: anchored notes ride their target's rect via a fixed
  // offset; unanchored (margin) notes freeze at their first-placed spot.
  // Invalidated on SUBSTANTIAL host-width change (beyond
  // CACHE_WIPE_WIDTH_TOLERANCE — the proportional-rescale path; a
  // scrollbar appearing when the overflow spacer grows shifts width by
  // ~15px and must NOT wipe) and pruned to live keys each pass. Page
  // flips are handled by that prune: the overlay is a SIBLING of the
  // keyed page wrapper (it does NOT remount on a flip) — a flip swaps
  // `sources` to the new page's commands, so the old page's keys fall
  // out of the cache in the prune-to-live-keys step below.
  const placedCacheRef = useRef(new Map<string, {
    anchor: Rect | null; dx: number; dy: number; w: number; h: number; placement: Placement;
  }>());
  const placedCacheWidthRef = useRef(0);

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
      if (Math.abs(placedCacheWidthRef.current - hostBox.width) > CACHE_WIPE_WIDTH_TOLERANCE) {
        placedCacheRef.current.clear();
        placedCacheWidthRef.current = hostBox.width;
      }
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
      // R2 E3: the drag handlers run outside this effect (pointer events
      // fire between passes) and need the current page rect to clamp a
      // live drag — mirror it into a ref every pass rather than
      // re-measuring the DOM on every pointermove.
      pageRectRef.current = page;
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
      // SmoothDraw P4: measure arrows BEFORE notes place. Both endpoints
      // must resolve to live rects on THIS page's DOM (targetRect returns
      // null when a stamped feature/item isn't currently rendered — the
      // other page, or a kill-recovered item) — missing either endpoint
      // or an empty spine (overlapping/too-close rects) skips the arrow
      // silently, same round-7 philosophy as scribble/handwrite misses.
      // Each spine's padded bbox goes into `occupied` so notes dodge the
      // arrow's path; a link's label (if any) becomes a placement source
      // of its own, targeting a literal rect at the spine midpoint (no
      // DOM element — see the NoteSource.explicitTarget doc).
      const linkArrows: ArrowEntry[] = [];
      const arrowRects: Rect[] = [];
      const arrowLabelSources: NoteSource[] = [];
      for (const link of links) {
        if (!link.fromFeature || !link.toFeature) continue;
        const fromT = targetRect(host, link.fromId, link.fromFeature);
        const toT = targetRect(host, link.toId, link.toFeature);
        if (!fromT || !toT) continue;
        const spine = arrowSpine(fromT.rect, toT.rect, `${link.fromFeature}->${link.toFeature}`);
        if (spine.length === 0) continue;
        const key = `link:${link.fromFeature}->${link.toFeature}`;
        const color = link.color || AMBER;
        linkArrows.push({ key, spine, color, hostW: hostBox.width });
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const p of spine) {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
        arrowRects.push({ x: minX - 6, y: minY - 6, w: maxX - minX + 12, h: maxY - minY + 12 });
        if (link.label && link.label.trim()) {
          const mid = spine[Math.floor(spine.length / 2)];
          arrowLabelSources.push({
            key: `al-${key}`,
            text: link.label,
            color,
            explicitTarget: { x: mid.x - 12, y: mid.y - 12, w: 24, h: 24 },
            ownerArrowKey: key,
          });
        }
      }
      // Rects of notes already placed this pass — every later note dodges
      // every earlier one regardless of which item it targets.
      const placedRects: Rect[] = [];
      const next: NoteEntry[] = [];
      // Arrow labels flow through the SAME placement loop as handwrite/
      // scribble notes, appended after scribble labels (command order),
      // so they get identical backdrop/animation/occupied treatment.
      const allSources = [...sources, ...arrowLabelSources];
      for (const src of allSources) {
        const m = measureNote(src.text);
        const t = src.explicitTarget
          ? { rect: src.explicitTarget, itemEl: null as Element | null, el: null as Element | null }
          : targetRect(host, src.targetId, src.targetFeature);
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
              // Round-17: skip the target element ITSELF (its shrunken
              // content rect is already the carve-protected target — its
              // full container rect here would re-block its own trailing
              // whitespace) and any feature that CONTAINS the target (an
              // enclosing list like data-feature="choices" wraps every
              // choice row; treating its whole rect as occupied made
              // every slot beside an interior choice collide with its own
              // container). Sibling features still block via their rects.
              if (t.el && (f === t.el || f.contains(t.el))) return;
              const r = toHostRect(f);
              if (r.w > 0 || r.h > 0) occupied.push(r);
            });
          } else {
            occupied.push(entry.rect);
          }
        }
        occupied.push(...sepRects);
        // Arrow bboxes block every source EXCEPT the arrow's own label
        // (the ownerArrowKey carve — see the NoteSource doc above).
        // arrowRects is index-aligned with linkArrows by construction.
        for (let i = 0; i < arrowRects.length; i++) {
          if (linkArrows[i].key !== src.ownerArrowKey) occupied.push(arrowRects[i]);
        }
        occupied.push(...placedRects);
        // R2 E3: a source the student already dragged carries `userPos` on
        // its command — that's the manual escape hatch, and it takes
        // ABSOLUTE precedence over both the sticky-placement cache and the
        // slot engine below. It still gets pushed into `placedRects` so
        // later auto-placed notes dodge it (design decision #1: dragging
        // doesn't retire the de-overlap guarantee for everyone else).
        // Anchor tracked in anchorsRef for the drag handlers regardless of
        // which branch places this source — including this one, so a note
        // already at a dragged spot can be picked up and dragged again.
        anchorsRef.current.set(src.key, t?.rect ?? null);
        if (src.userPos) {
          const rect = applyUserPos({ anchor: t?.rect ?? null }, src.userPos, { w: m.w, h: m.h }, page);
          const placement: Placement = { rect, slot: 'user' };
          placedCacheRef.current.set(src.key, {
            anchor: t?.rect ?? null,
            dx: placement.rect.x - (t?.rect?.x ?? 0),
            dy: placement.rect.y - (t?.rect?.y ?? 0),
            w: m.w,
            h: m.h,
            placement,
          });
          placedRects.push(placement.rect);
          next.push({ key: src.key, text: src.text, lines: m.lines, color: src.color, placement, hostW: hostBox.width, kind: src.kind, id: src.id });
          continue;
        }
        // Sticky placement (round 29): reuse the cached spot when it is
        // still valid — see placedCacheRef's doc above.
        const rectsIntersect = (a: Rect, b: Rect) =>
          a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        const cached = placedCacheRef.current.get(src.key);
        let placement: Placement | null = null;
        if (cached && cached.w === m.w && cached.h === m.h) {
          if (t?.rect && cached.anchor) {
            const rect = { x: t.rect.x + cached.dx, y: t.rect.y + cached.dy, w: m.w, h: m.h };
            if (!occupied.some((o) => rectsIntersect(rect, o))) {
              placement = { ...cached.placement, rect };
            } else if (cached.placement.slot === 'margin') {
              // Anchored note that already degraded to the margin column
              // (or its downward extension — same 'margin' slot): FREEZE
              // it, exactly like the unanchored branch below. Falling
              // through to placeNote here was the round-29 drift hole:
              // its margin/extension fallback derives y from the CURRENT
              // content bottom, so every appended item slid the note
              // further down. Drift is worse than overlap — the same
              // tradeoff the unanchored freeze already made.
              placement = cached.placement;
            } else {
              // Anchor-adjacent slot (right/above/below/left) now
              // collides. Only hand back to placeNote when the TARGET
              // actually moved (layout shift — the ridden rect is stale
              // in a way dx/dy can't express); if the target is where it
              // was and new content merely grew into the slot, freeze in
              // place — re-placing would degrade to the content-bottom
              // fallback and drift.
              const a = cached.anchor;
              const anchorMoved =
                Math.abs(t.rect.x - a.x) > 1 || Math.abs(t.rect.y - a.y) > 1 ||
                Math.abs(t.rect.w - a.w) > 1 || Math.abs(t.rect.h - a.h) > 1;
              if (!anchorMoved) placement = { ...cached.placement, rect };
              // else: placement stays null → full placeNote below.
            }
          } else if (!t?.rect && !cached.anchor) {
            // Margin/extension note: frozen at first placement for the
            // life of the page — never re-derived from the content bottom.
            placement = cached.placement;
          }
        }
        if (!placement) {
          placement = placeNote({ target: t?.rect ?? null, occupied, page, note: { w: m.w, h: m.h } });
        }
        // Round-6e (user call, IMG_7866): on phone-width hosts, a note that
        // could not find a clean slot is SKIPPED rather than overlapped or
        // degraded to the margin column — on a narrow page the "margin"
        // x-band IS the content column, so both the margin fallback and the
        // freeze-over-drift compromises above (which deliberately accept
        // overlap) end up sitting on top of components (IMG_7866). Product
        // call: annotations are good-to-have; the Q-pin is the must-show
        // surface. Skipped notes are NOT cached, so they re-try on every
        // pass and appear the moment layout makes room. Desktop (wide page,
        // real margin) keeps the never-fails behavior. 'user'-dragged notes
        // always render — the student put them there.
        if (page.w < NARROW_HOST_NOTE_SKIP_W && placement.slot !== 'user') {
          const collidesNow = occupied.some((o) => rectsIntersect(placement.rect, o));
          if (placement.slot === 'margin' || collidesNow) {
            continue;
          }
        }
        placedCacheRef.current.set(src.key, {
          anchor: t?.rect ?? null,
          dx: placement.rect.x - (t?.rect?.x ?? 0),
          dy: placement.rect.y - (t?.rect?.y ?? 0),
          w: m.w,
          h: m.h,
          placement,
        });
        placedRects.push(placement.rect);
        next.push({ key: src.key, text: src.text, lines: m.lines, color: src.color, placement, hostW: hostBox.width, kind: src.kind, id: src.id });
      }
      // Prune cache entries whose source is gone (kill-recovery, revise).
      const liveKeys = new Set(allSources.map((s) => s.key));
      for (const k of placedCacheRef.current.keys()) {
        if (!liveKeys.has(k)) placedCacheRef.current.delete(k);
      }
      // R2 E3: same prune for the drag anchor cache — otherwise it grows
      // unbounded across page flips over a long session.
      for (const k of anchorsRef.current.keys()) {
        if (!liveKeys.has(k)) anchorsRef.current.delete(k);
      }
      setEntries(next);
      setArrows(linkArrows);
      setHostW(hostBox.width);
      // R2 review-round-2 fix-2 (release-flash): endNoteDrag no longer
      // clears dragOverridePos itself — see that function's comment. This
      // is where it actually gets cleared, and ONLY once this pass has
      // produced a placement that reflects the drop: the `src.userPos`
      // branch above (which runs BEFORE the sticky-cache/placeNote
      // branches, unconditionally, whenever the source carries a userPos)
      // stamps `slot: 'user'` — that slot value appearing in `next` for the
      // dragged key IS the signal that this pass picked up the userPos the
      // drag just committed via onNoteMoved (that commit flows back down
      // through the owner's whiteboardCommands state → notes/
      // labeledScribbles props → the `sources` memo → this effect's deps,
      // which is why it can only happen on a LATER pass, never this same
      // render). Until then the override keeps rendering the note at
      // exactly where the pointer released, so there is nothing to repaint
      // out from under it — no pre-drag-position flash. If the dragged
      // key fell out of `sources` entirely (note removed mid-drag — e.g. a
      // `clear`/page-flip race), there is nothing left to reconcile with
      // either, so the override is dropped defensively rather than left to
      // dangle.
      if (dragOverridePosRef.current) {
        const key = dragOverridePosRef.current.key;
        const placed = next.find((n) => n.key === key);
        if (!liveKeys.has(key) || placed?.placement.slot === 'user') {
          dragOverridePosRef.current = null;
          setDragOverridePosState(null);
        }
      }
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
  }, [sources, links, hostRef, contentRef, hostW, fontsReady, onOverflowChange]);

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

  // R2 E3: shared position math for the drag move/end handlers — content-px
  // position clamped to the live page rect, from a client-px delta divided
  // by `scale` (the overlay renders at `scale` relative to the content px
  // the placement effect computed in). Kept as one function so move/end
  // agree exactly on where the pointer's current position maps to.
  const dragPosFromClient = (
    d: NonNullable<typeof dragRef.current>,
    scale: number,
    size: { w: number; h: number },
    clientX: number,
    clientY: number,
  ): { x: number; y: number } => {
    const s = scale > 0 ? scale : 1;
    const dx = (clientX - d.startClientX) / s;
    const dy = (clientY - d.startClientY) / s;
    const page = pageRectRef.current;
    // clampIntoPage (shared with applyUserPos — see its doc comment for
    // why the naive min-then-max clamp inverts when the note is wider/
    // taller than the page and would otherwise drag it to a negative
    // coordinate).
    return {
      x: clampIntoPage(d.originX + dx, page.x, page.w, size.w),
      y: clampIntoPage(d.originY + dy, page.y, page.h, size.h),
    };
  };

  const onNotePointerDown = (entry: NoteEntry, ev: React.PointerEvent<HTMLDivElement>) => {
    // No id/kind ⇒ this source's command couldn't be addressed for a
    // userPos mutation (see NoteEntry's doc comment) — round-7 fail soft:
    // render the note, just don't offer drag on it.
    if (!entry.id || !entry.kind || !onNoteMoved) return;
    // Only a CAPTURED drag blocks a new press (q-pin's second-finger-hijack
    // guard) — a pre-threshold entry may be stale (pointerup can land
    // off-element before capture starts), so a new press overwrites it.
    if (dragRef.current?.dragging) return;
    const anchor = anchorsRef.current.get(entry.key) ?? null;
    const page = pageRectRef.current;
    dragRef.current = {
      key: entry.key,
      kind: entry.kind,
      id: entry.id,
      pointerId: ev.pointerId,
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      originX: entry.placement.rect.x,
      originY: entry.placement.rect.y,
      anchorX: anchor ? anchor.x : page.x,
      anchorY: anchor ? anchor.y : page.y,
      dragging: false,
    };
  };

  const onNotePointerMove = (entry: NoteEntry, scale: number, ev: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== ev.pointerId || d.key !== entry.key) return;
    if (!d.dragging && ev.buttons === 0) {
      // Button-free move = the press already ended off-element (no capture
      // pre-threshold). Drop the stale entry so hovering can't ghost-drag.
      dragRef.current = null;
      return;
    }
    const dxClient = ev.clientX - d.startClientX;
    const dyClient = ev.clientY - d.startClientY;
    if (!d.dragging && !exceedsDragThreshold(dxClient, dyClient)) return;
    if (!d.dragging) {
      d.dragging = true;
      // Capture only once it IS a drag — capturing on pointerdown would
      // retarget a plain tap away from the note (and the board's tap-to-
      // mark system, which the note deliberately falls through to when
      // NOT dragging — see the render-site comment on pointer-events).
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    }
    const size = { w: entry.placement.rect.w, h: entry.placement.rect.h };
    const pos = dragPosFromClient(d, scale, size, ev.clientX, ev.clientY);
    setDragOverridePos({ key: entry.key, x: pos.x, y: pos.y });
  };

  const endNoteDrag = (entry: NoteEntry, scale: number, ev: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== ev.pointerId || d.key !== entry.key) return;
    if (d.dragging) {
      const size = { w: entry.placement.rect.w, h: entry.placement.rect.h };
      // Recompute from this event's own coordinates (not the last
      // dragOverridePos render) so the stored offset always matches
      // exactly where the pointer actually released.
      const pos = dragPosFromClient(d, scale, size, ev.clientX, ev.clientY);
      const userPos = { dx: pos.x - d.anchorX, dy: pos.y - d.anchorY };
      onNoteMoved?.({ kind: d.kind, id: d.id, userPos });
      // pointercancel never produces a trailing click — R23 qpin lesson:
      // there is no click-suppression state to arm here either way (the
      // note div has no onClick of its own), so cancel and up are handled
      // identically.
    } else if (ev.type === 'pointerup') {
      // R2 fix-1: never exceeded the drag threshold — a plain tap. Forward
      // to onNoteTap (WhiteboardCanvas wires its own fireStudentTap) so a
      // tap on a draggable note still resolves as a student mark, exactly
      // like the pre-drag-feature pointer-events-none pass-through did.
      // `d.dragging` is false here by construction — this branch and the
      // `if (d.dragging)` one above are mutually exclusive within the same
      // call, so a completed drag can never ALSO fire a tap on release.
      // Gated to `pointerup` specifically (not pointercancel): a cancelled
      // sub-threshold press isn't a completed tap either — matches
      // WhiteboardCanvas's own handleMarkPointerUp, which isn't wired to
      // onPointerCancel and so fires no mark on a cancelled press today.
      onNoteTap?.(ev.clientX, ev.clientY);
    }
    dragRef.current = null;
    // R2 review-round-2 fix-2: dragOverridePos is deliberately NOT cleared
    // here anymore (used to be `setDragOverridePos(null)`). Clearing it
    // synchronously unblocked a flash: `next.push({..., placement: ...})`
    // for this note is still the STALE pre-drag placement at this exact
    // moment (measureAndPlace's re-run is double-rAF-deferred AND gated on
    // `sources` changing, which itself waits on the owner's setState from
    // onNoteMoved above to propagate back down as new props) — so clearing
    // here paints the note back at its old spot for a couple of frames
    // before the real placement lands. Leaving the override in place means
    // the note keeps rendering exactly where the pointer released, with no
    // visible discontinuity, until measureAndPlace's placement pass proves
    // (via `slot: 'user'`) that it has picked up the drop — see the clear
    // site at the end of that effect for the other half of this fix.
  };

  // Per-word wipe-on, once per note key (WAAPI on the note div).
  const animateIn = (el: HTMLDivElement | null, key: string) => {
    if (!el || animatedRef.current.has(key)) return;
    animatedRef.current.add(key);
    el.animate(
      [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }],
      { duration: Math.min(900, 250 + el.textContent!.length * 12), easing: 'ease-out', fill: 'backwards' },
    );
  };

  // SmoothDraw P4: draw-on wipe for an arrow's <g>, once per arrow key —
  // SAME animatedRef Set as animateIn (key namespaces don't collide:
  // notes use hw-/sl-/al- prefixes, arrows use `link:`). Direction
  // follows the spine's dominant axis (the bigger of |dx|/|dy| between
  // its first and last point) so a left-to-right arrow wipes on from
  // the left, a bottom-to-top arrow wipes on from the bottom, etc. —
  // reads as the hand "drawing" the arrow toward its head.
  const animateArrowIn = (el: SVGGElement | null, key: string, spine: Pt[]) => {
    if (!el || animatedRef.current.has(key) || spine.length < 2) return;
    animatedRef.current.add(key);
    const start = spine[0];
    const end = spine[spine.length - 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let from: string;
    let to: string;
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) { from = 'inset(0 100% 0 0)'; to = 'inset(0 0% 0 0)'; } // wipe from left
      else { from = 'inset(0 0 0 100%)'; to = 'inset(0 0 0 0%)'; }       // wipe from right
    } else if (dy > 0) { from = 'inset(0 0 100% 0)'; to = 'inset(0 0 0% 0)'; } // wipe from top
    else { from = 'inset(100% 0 0 0)'; to = 'inset(0% 0 0 0)'; }              // wipe from bottom
    el.animate(
      [{ opacity: 0, clipPath: from }, { opacity: 1, clipPath: to }],
      { duration: 500, easing: 'ease-out', fill: 'backwards' },
    );
  };

  if (entries.length === 0 && arrows.length === 0) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }} aria-label="tutor notes">
      {/* SmoothDraw P4: arrow layer. Rendered ahead of the notes below
          (paint order — arbitrary choice, no overlap by construction
          since arrow bboxes are in the notes' `occupied` set) inside the
          SAME pointer-events-none root as notes. */}
      {arrows.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
          {arrows.map((a) => {
            const scale = a.hostW > 0 && hostW > 0 ? hostW / a.hostW : 1;
            const [b1, b2] = arrowHeads(a.spine, 12);
            return (
              <g key={a.key} ref={(el) => animateArrowIn(el, a.key, a.spine)} transform={`scale(${scale})`}>
                <path d={strokeOutline(a.spine, 7, `${a.key}-halo`)} fill="white" fillOpacity={0.95} />
                <path d={strokeOutline(a.spine, 4.5, a.key)} fill={a.color} />
                {[b1, b2].map((barb, i) => (
                  <React.Fragment key={i}>
                    <path d={strokeOutline(barb, 7, `${a.key}-b${i}-halo`)} fill="white" fillOpacity={0.95} />
                    <path d={strokeOutline(barb, 4.5, `${a.key}-b${i}`)} fill={a.color} />
                  </React.Fragment>
                ))}
              </g>
            );
          })}
        </svg>
      )}
      {entries.map((e) => {
        const scale = e.hostW > 0 && hostW > 0 ? hostW / e.hostW : 1;
        const override = dragOverridePos?.key === e.key ? dragOverridePos : null;
        const left = (override ? override.x : e.placement.rect.x) * scale;
        const top = (override ? override.y : e.placement.rect.y) * scale;
        // R2 E3: only a note whose source command was addressable (a
        // stamped `id` — see NoteEntry's doc comment) offers drag. Arrow
        // labels (no command of their own) and the fail-soft "no id"
        // edge case keep the ORIGINAL pointer-events-none pass-through —
        // taps there still fall through to the board's tap-to-mark system
        // exactly as before. A draggable note trades that fallthrough for
        // drag: pointer-events-auto makes the note itself the hit target,
        // so a plain tap on a DRAGGABLE note no longer also registers as
        // a board tap-to-mark (its drag handlers see the tap and, being
        // under threshold, simply do nothing). Marking the underlying
        // feature the note annotates is unaffected — only a tap on the
        // note's own rendered text is affected.
        const draggable = !!(e.id && e.kind && onNoteMoved);
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
            className={draggable ? 'pointer-events-auto touch-none cursor-grab active:cursor-grabbing' : undefined}
            onPointerDown={draggable ? (ev) => onNotePointerDown(e, ev) : undefined}
            onPointerMove={draggable ? (ev) => onNotePointerMove(e, scale, ev) : undefined}
            onPointerUp={draggable ? (ev) => endNoteDrag(e, scale, ev) : undefined}
            onPointerCancel={draggable ? (ev) => endNoteDrag(e, scale, ev) : undefined}
            // R2 review-round-2 fix-1: if this note unmounts mid-drag (a
            // page flip, `clear`, kill-recovery — anything that removes the
            // command while `dragRef.current.dragging` is true), the
            // browser releases pointer capture as part of tearing the node
            // down but NO pointerup/pointercancel ever fires on it (there's
            // no element left to dispatch one to by the time the user
            // eventually lifts the finger elsewhere) — `dragRef.current`
            // stays latched with `dragging: true` forever, and
            // onNotePointerDown's `if (dragRef.current?.dragging) return;`
            // then rejects every future press on every note. Precedent:
            // WhiteboardCanvas's pen-capture overlay binds
            // `onLostPointerCapture={handlePenUp}` for the identical
            // reason. Routing to the SAME endNoteDrag as pointerup/cancel
            // is safe: `ev.type` here is 'lostpointercapture', never
            // 'pointerup', so the `else if (ev.type === 'pointerup')` tap
            // branch can never fire off a lost-capture release (it is not
            // a completed tap). And on the ordinary end-of-drag path
            // (pointerup/cancel ALSO release capture, firing this right
            // after), it's a no-op: the pointerup/cancel handler already
            // ran first, already nulled `dragRef.current`, so this second
            // call's `if (!d || ...) return;` guard bails immediately —
            // state stays consistent for the next press either way.
            onLostPointerCapture={draggable ? (ev) => endNoteDrag(e, scale, ev) : undefined}
            style={{
              position: 'absolute',
              left,
              top,
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
