# SmoothDraw Phase 3 — On-Board Ink Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tutor written notes (`tutor_handwrite`, `tutor_scribble.label`) move out of the AnnotationStrip and onto the board beside their targets, at positions the runtime computes — hand-written (Caveat), wipe-on per word, never overlapping content.

**Architecture:** A pure slot engine (`ink-placement.ts` — target rect + occupied rects + page bounds + measured text size in, placement out; slot order right → above → below → left → margin) does all spatial reasoning. A new page-level `InkNotesOverlay` measures DOM rects, runs the engine in command order, and renders the notes; the orchestrator resolves `tutor_handwrite.near` through the catalog (stamping `targetFeature`/`targetId`) instead of stripping it. Everything rides a NEW flag `NEXT_PUBLIC_TUTOR_INK_NOTES` (brain-visible docstrings change → separate from DRAW_ON); flag-off is byte-identical to today. Strip DELETION is explicitly out of scope — the strip stops receiving entries under the flag, and its removal happens after the user's live legibility gate.

**Tech Stack:** TypeScript, React, WAAPI, canvas `measureText`. No new deps. Spec: `docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md` §5. Phases 1–2 merged (de548a9, be9e41b).

## Global Constraints

- New flag: `NEXT_PUBLIC_TUTOR_INK_NOTES === 'true'` gates EVERYTHING here (tool docstrings, orchestrator resolution, overlay, strip bypass, PDF). Flag-off = byte-identical current behavior at every surface.
- **System prompt / tool docstrings are session-static** — live tests of flag-on behavior need FRESH sessions (round-7 memory rule).
- Round-7 guardrails: `near` resolution failure is SILENT (margin placement, never a rejection, never a retry); the handwrite legacy-field stripping for `position`/`margin` stays unconditional; META_ACTIONS untouched; dedup untouched.
- Notes NEVER overlap content — the 2026-05-13 lesson that created the strip. The slot engine's occupied set is authoritative; when nothing fits, margin column.
- Determinism: placement depends only on command order + measured rects; no `Math.random`/`Date.now` in placement or rendering.
- Tutor note color defaults to warm amber `#a16207` (today's strip bullet default); explicit `cmd.color` wins. Student ink stays blue — visual identity rule.
- PDF mirrors ride the same flag: feature-anchored notes bake into the target item's capture; margin/unresolved notes keep today's caption-line rendering (documented divergence — the PDF is a linear item stack, not a spatial page).
- **No voice tokens in testing:** harness default silent TTS; NEVER set `TUTOR_E2E_TTS`. No app-source edits while an e2e run is live. Each scenario runs once (one diagnostic re-run for harness/env failures only).
- Every commit: `npx tsc --noEmit` clean first; repo test-script style (`npx tsx`, `check()`, non-zero exit); commits end with the project trailer (Co-Authored-By: Claude Fable 5 + Claude-Session link).

---

### Task 1: Pure slot engine — `ink-placement.ts` + unit suite

**Files:**
- Create: `src/lib/tutor/whiteboard/ink-placement.ts`
- Create: `scripts/test-ink-placement.ts`
- Modify: `package.json` (add `"test:ink-placement": "npx tsx scripts/test-ink-placement.ts"` next to `"test:hand-stroke"`)

**Interfaces:**
- Consumes: nothing (pure).
- Produces (used by Tasks 3 & 5):
  - `type Rect = { x: number; y: number; w: number; h: number }`
  - `type NoteSlot = 'right' | 'above' | 'below' | 'left' | 'margin'`
  - `type Placement = { rect: Rect; slot: NoteSlot }`
  - `placeNote(input: { target: Rect | null; occupied: Rect[]; page: Rect; note: { w: number; h: number }; gap?: number }): Placement` — `target: null` (unresolved `near`) goes straight to margin.
  - `rectsOverlap(a: Rect, b: Rect, pad?: number): boolean`

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-ink-placement.ts
/**
 * Unit suite for the SmoothDraw Phase-3 note slot engine (pure).
 * Run: npm run test:ink-placement
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §5
 */
import { placeNote, rectsOverlap, type Rect } from '../src/lib/tutor/whiteboard/ink-placement';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const page: Rect = { x: 0, y: 0, w: 800, h: 600 };
const note = { w: 160, h: 40 };
const target: Rect = { x: 300, y: 200, w: 120, h: 60 };

// ── slot preference order ─────────────────────────────────────
{
  const p = placeNote({ target, occupied: [], page, note });
  check('empty page → right slot', p.slot === 'right');
  check('right slot sits beside the target', p.rect.x > target.x + target.w && Math.abs((p.rect.y + p.rect.h / 2) - (target.y + target.h / 2)) < note.h);
}
{
  // Block the right slot → falls to above.
  const blocker: Rect = { x: target.x + target.w + 2, y: target.y - 20, w: 300, h: 120 };
  const p = placeNote({ target, occupied: [blocker], page, note });
  check('right blocked → above', p.slot === 'above');
  check('above sits over the target', p.rect.y + p.rect.h <= target.y);
}
{
  // Target flush against the right page edge → right can't fit → above.
  const edgeTarget: Rect = { x: page.w - 130, y: 200, w: 120, h: 60 };
  const p = placeNote({ target: edgeTarget, occupied: [], page, note });
  check('no room right of edge target → not right', p.slot !== 'right');
}

// ── never overlaps anything ───────────────────────────────────
{
  const occupied: Rect[] = [
    { x: 430, y: 180, w: 300, h: 100 },  // blocks right
    { x: 280, y: 130, w: 200, h: 60 },   // blocks above
    { x: 280, y: 270, w: 200, h: 60 },   // blocks below
    { x: 120, y: 180, w: 170, h: 100 },  // blocks left
  ];
  const p = placeNote({ target, occupied, page, note });
  check('all four slots blocked → margin', p.slot === 'margin');
  check('margin placement overlaps nothing', occupied.every((o) => !rectsOverlap(p.rect, o)) && !rectsOverlap(p.rect, target));
}
{
  const p = placeNote({ target, occupied: [], page, note });
  check('placement never overlaps its own target', !rectsOverlap(p.rect, target));
}

// ── page clamping ─────────────────────────────────────────────
{
  const topTarget: Rect = { x: 300, y: 4, w: 120, h: 30 };
  const blocker: Rect = { x: 430, y: 0, w: 370, h: 80 }; // blocks right
  const p = placeNote({ target: topTarget, occupied: [blocker], page, note });
  check('above cannot fit at page top → falls further down the order', p.slot !== 'above');
  check('placement stays inside the page', p.rect.x >= 0 && p.rect.y >= 0 && p.rect.x + p.rect.w <= page.w && p.rect.y + p.rect.h <= page.h);
}

// ── margin column stacks ──────────────────────────────────────
{
  const first = placeNote({ target: null, occupied: [], page, note });
  check('null target → margin', first.slot === 'margin');
  const second = placeNote({ target: null, occupied: [first.rect], page, note });
  check('second margin note stacks without overlap', second.slot === 'margin' && !rectsOverlap(first.rect, second.rect));
  check('margin notes share the right column', Math.abs(first.rect.x - second.rect.x) < 1);
}

// ── determinism ───────────────────────────────────────────────
{
  const a = placeNote({ target, occupied: [], page, note });
  const b = placeNote({ target, occupied: [], page, note });
  check('same input → identical placement', JSON.stringify(a) === JSON.stringify(b));
}

// ── rectsOverlap sanity ───────────────────────────────────────
{
  check('overlap true', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }));
  check('overlap false when apart', !rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 10, h: 10 }));
  check('pad expands the test', rectsOverlap({ x: 0, y: 0, w: 10, h: 10 }, { x: 12, y: 0, w: 10, h: 10 }, 3));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: Add npm script, run to verify FAIL (module missing)**

Run: `npm run test:ink-placement` → FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/whiteboard/ink-placement.ts
/**
 * SmoothDraw Phase 3 — pure note slot engine.
 *
 * All spatial reasoning for on-board tutor notes lives here: given the
 * target's rect, everything already occupying the page, the page bounds,
 * and the measured note size, pick the first fitting slot in a fixed
 * order (right → above → below → left → margin column). The margin
 * column NEVER fails: it clamps into the page's right edge below any
 * occupant. Notes must never overlap content — the 2026-05-13 lesson
 * that created the AnnotationStrip; this engine is what makes on-board
 * notes safe enough to retire it.
 *
 * Pure and deterministic: DOM measurement happens in the caller
 * (InkNotesOverlay live; whiteboard-capture for PDFs).
 */

export type Rect = { x: number; y: number; w: number; h: number };
export type NoteSlot = 'right' | 'above' | 'below' | 'left' | 'margin';
export type Placement = { rect: Rect; slot: NoteSlot };

export function rectsOverlap(a: Rect, b: Rect, pad = 0): boolean {
  return a.x - pad < b.x + b.w && a.x + a.w + pad > b.x && a.y - pad < b.y + b.h && a.y + a.h + pad > b.y;
}

const GAP = 8;          // breathing room between a note and its target
const CLEAR_PAD = 4;    // minimum clearance from other occupants
const MARGIN_W = 12;    // inset from the page's right edge for the margin column

function inside(page: Rect, r: Rect): boolean {
  return r.x >= page.x && r.y >= page.y && r.x + r.w <= page.x + page.w && r.y + r.h <= page.y + page.h;
}

function clear(r: Rect, occupied: Rect[], target: Rect | null): boolean {
  if (target && rectsOverlap(r, target, CLEAR_PAD)) return false;
  return occupied.every((o) => !rectsOverlap(r, o, CLEAR_PAD));
}

export function placeNote(input: {
  target: Rect | null;
  occupied: Rect[];
  page: Rect;
  note: { w: number; h: number };
  gap?: number;
}): Placement {
  const { target, occupied, page, note } = input;
  const gap = input.gap ?? GAP;

  if (target) {
    const candidates: Array<{ slot: NoteSlot; rect: Rect }> = [
      { slot: 'right', rect: { x: target.x + target.w + gap, y: target.y + target.h / 2 - note.h / 2, w: note.w, h: note.h } },
      { slot: 'above', rect: { x: target.x + target.w / 2 - note.w / 2, y: target.y - gap - note.h, w: note.w, h: note.h } },
      { slot: 'below', rect: { x: target.x + target.w / 2 - note.w / 2, y: target.y + target.h + gap, w: note.w, h: note.h } },
      { slot: 'left', rect: { x: target.x - gap - note.w, y: target.y + target.h / 2 - note.h / 2, w: note.w, h: note.h } },
    ];
    for (const c of candidates) {
      // Nudge horizontally-centered slots back inside the page before
      // testing (a wide note above a left-edge target shouldn't fail
      // solely on the x clamp), but never nudge INTO the target.
      const r = { ...c.rect };
      if (c.slot === 'above' || c.slot === 'below') {
        r.x = Math.min(Math.max(r.x, page.x), page.x + page.w - r.w);
      }
      if (inside(page, r) && clear(r, occupied, target)) return { slot: c.slot, rect: r };
    }
  }

  // Margin column: right edge, stacked below whatever already occupies
  // the column. Scan down in note-height steps; if the page is truly
  // full, clamp to the bottom (overlap the least-bad way — never returns
  // failure, the round-7 silent-drop philosophy applied to placement).
  const x = page.x + page.w - note.w - MARGIN_W;
  let y = page.y + MARGIN_W;
  const step = note.h + CLEAR_PAD * 2;
  while (y + note.h <= page.y + page.h) {
    const r: Rect = { x, y, w: note.w, h: note.h };
    if (clear(r, occupied, target)) return { slot: 'margin', rect: r };
    y += step;
  }
  return { slot: 'margin', rect: { x, y: page.y + page.h - note.h, w: note.w, h: note.h } };
}
```

- [ ] **Step 4: Run until green + typecheck** — `npm run test:ink-placement && npx tsc --noEmit`. Fix engine math, never tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/whiteboard/ink-placement.ts scripts/test-ink-placement.ts package.json
git commit -m "feat(tutor): SmoothDraw P3 — pure note slot engine + unit suite"
```

---

### Task 2: Tool surface + orchestrator resolution (flag-gated)

**Files:**
- Modify: `src/app/tutor/hooks/toolDefinitions.ts` — the `tutor_handwrite` tool definition (search `name: 'tutor_handwrite'`) and its mapping in `mapFunctionCallToCommand` (search `funcName === 'tutor_handwrite'`).
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` — the handwrite legacy-field stripping loop (search `Post-redesign (2026-05-13): tutor_handwrite is now a pure`).
- Modify: `scripts/test-tick-render.ts` — flag-aware assertions.

**Interfaces:**
- Consumes: `catalogRef.current.resolveTarget(raw)` (existing, returns `{ ok, canonical, itemId, … }`), env flag.
- Produces (Task 3 relies on): flag-on handwrite commands may carry `near?: string`, `targetFeature?: string`, `targetId?: string`. Flag-off commands carry none of these (byte-identical today). Export a helper `inkNotesEnabled(): boolean` from `toolDefinitions.ts` reading `process.env.NEXT_PUBLIC_TUTOR_INK_NOTES === 'true'` **at call time** (so tsx tests can toggle it via `process.env` before calls).

- [ ] **Step 1: Flag helper + schema**

In toolDefinitions.ts, near the top:

```ts
/** SmoothDraw Phase 3: on-board ink notes. Read at CALL time (not module
 *  init) so unit tests can toggle process.env; in the browser bundle
 *  Next.js inlines the env var, making this a constant. */
export function inkNotesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TUTOR_INK_NOTES === 'true';
}
```

In the `tutor_handwrite` definition, make `parameters.properties` conditional at array build time is NOT possible (static literal) — instead append the `near` property ALWAYS but describe the gate honestly, and let the mapping drop it when the flag is off:

```ts
        near: { type: 'string', description: 'Optional: the feature or item this note is about (same target grammar as tutor_scribble). When provided, the note is hand-written on the board BESIDE that target at a position the runtime computes — never overlapping content. Omit for a general note (margin).' },
```

…and update the tool's `description` first sentence to: `'Write a short hand-written note. With `near`, the note lands on the board beside its target; without it, in the margin. ≤80 chars.'` (keep the rest of the existing description).

**Adjudicated risk (do not "fix" silently):** the `near` param docstring becomes brain-visible even flag-off, but the MAPPING drops the field when the flag is off, so flag-off behavior stays byte-identical at the command level; a stale brain emitting `near` flag-off is already handled by today's stripping. This is deliberate — conditional tool schemas would fork the brain's cached prompt on an env read and break the static-literal pattern of WHITEBOARD_TOOLS.

- [ ] **Step 2: Mapping carries `near` only when the flag is on**

In `mapFunctionCallToCommand`'s `tutor_handwrite` branch, where the command object is built (it currently keeps only `text`/`color`):

```ts
    const cmd: WhiteboardCommand = { action: 'handwrite', text: trimmed, ...(funcArgs.color ? { color: String(funcArgs.color) } : {}) };
    if (inkNotesEnabled() && typeof funcArgs.near === 'string' && funcArgs.near.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmd as any).near = funcArgs.near.trim();
    }
    return cmd;
```

(Adapt to the branch's actual local variable names — read it first; the key behavior: flag-off output is IDENTICAL to today's.)

- [ ] **Step 3: Orchestrator resolves instead of strips (flag on)**

Replace the handwrite field-stripping loop body in VoiceTutorRealtime.tsx with:

```ts
    for (const cmd of processed) {
      if (cmd.action !== 'handwrite') continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cmdAny = cmd as any;
      // Legacy spatial fields are ALWAYS stripped (pre-2026-05-13 brains).
      if ('position' in cmdAny) delete cmdAny.position;
      if ('margin' in cmdAny) delete cmdAny.margin;
      if (inkNotesEnabled() && typeof cmdAny.near === 'string' && cmdAny.near.trim()) {
        // SmoothDraw P3: resolve `near` through the catalog exactly like
        // scribble targets. Failure is SILENT (round-7): the note keeps
        // no target stamp and the overlay places it in the margin column.
        const res = catalogRef.current.resolveTarget(cmdAny.near);
        if (res.ok) {
          cmdAny.targetFeature = res.canonical;
          cmdAny.targetId = res.itemId;
        } else {
          delete cmdAny.targetFeature;
          delete cmdAny.targetId;
        }
        delete cmdAny.near; // resolved (or margin) — the raw string never renders
      } else {
        if ('near' in cmdAny) delete cmdAny.near;
        if ('targetId' in cmdAny) delete cmdAny.targetId;
        if ('targetFeature' in cmdAny) delete cmdAny.targetFeature;
      }
      if ('targetItemIndex' in cmdAny) delete cmdAny.targetItemIndex;
      if ('targetPageIndex' in cmdAny) delete cmdAny.targetPageIndex;
      if ('targetPageTitle' in cmdAny) delete cmdAny.targetPageTitle;
    }
```

Import `inkNotesEnabled` from `@/app/tutor/hooks/toolDefinitions` (VTR already imports from that module — extend the existing import).

- [ ] **Step 4: Flag-aware tests**

In scripts/test-tick-render.ts, the handwrite assertions (`should NOT carry near`) hold with the env unset — leave them. APPEND a flag-on block at the end of section 2:

```ts
// (e) SmoothDraw P3: with the ink-notes flag ON, `near` rides the command.
process.env.NEXT_PUBLIC_TUTOR_INK_NOTES = 'true';
const inkNote = mapFunctionCallToCommand('tutor_handwrite', { text: 'a = 3 here', near: 'the vertex' });
expect(inkNote !== null, 'flag-on handwrite maps');
if (inkNote && inkNote.action === 'handwrite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((inkNote as any).near === 'the vertex', 'flag-on handwrite carries near');
}
delete process.env.NEXT_PUBLIC_TUTOR_INK_NOTES;
const offAgain = mapFunctionCallToCommand('tutor_handwrite', { text: 'x', near: 'y' });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
expect(offAgain !== null && !('near' in (offAgain as any)), 'flag-off drops near again');
```

- [ ] **Step 5: Battery + commit**

Run: `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:process-tool-call && npm run test:ink-placement`
Expected: all green.

```bash
git add src/app/tutor/hooks/toolDefinitions.ts src/app/tutor/components/VoiceTutorRealtime.tsx scripts/test-tick-render.ts
git commit -m "feat(tutor): SmoothDraw P3 — handwrite near resolution through the catalog (flag-gated)"
```

---

### Task 3: `InkNotesOverlay` — measured placement + wipe-on rendering

**Files:**
- Create: `src/app/tutor/components/whiteboard/InkNotesOverlay.tsx`

**Interfaces:**
- Consumes: `placeNote`, `rectsOverlap`, `Rect` (Task 1); handwrite commands possibly carrying `targetFeature`/`targetId` (Task 2); scribble commands carrying `label` + `targetFeature`/`targetId` (existing).
- Produces (Task 4 mounts it): `<InkNotesOverlay hostRef={pageOuterRef} notes={handwrites} labeledScribbles={scribbles} currentPageWidth={…} />` — exact props below. Rendered notes carry `data-wb-note` (student-marks parity with today's strip entries).

- [ ] **Step 1: Write the component**

```tsx
// src/app/tutor/components/whiteboard/InkNotesOverlay.tsx
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

/** Measure and wrap note text to ≤3 lines (ellipsis on overflow) using a
 *  shared canvas 2d context. Returns wrapped lines + the box size. */
function measureNote(text: string): { lines: string[]; w: number; h: number } {
  const canvas = measureNote._c ?? (measureNote._c = document.createElement('canvas'));
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
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace measureNote { let _c: HTMLCanvasElement | undefined; }

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
  hostRef: React.RefObject<HTMLElement | null>;
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
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` clean. (No unit test — DOM/measure/WAAPI; the pure engine is Task 1's suite; live behavior is Task 6's scenario.)

- [ ] **Step 3: Commit**

```bash
git add src/app/tutor/components/whiteboard/InkNotesOverlay.tsx
git commit -m "feat(tutor): SmoothDraw P3 — InkNotesOverlay (measured placement, wipe-on notes)"
```

---

### Task 4: WhiteboardCanvas wiring — overlay in, strip bypassed (flag on)

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` — the `<AnnotationStrip …/>` render site (search `<AnnotationStrip`) and the `pageOuterRef` host block; one import.

**Interfaces:**
- Consumes: `InkNotesOverlay` (Task 3), `inkNotesEnabled` (Task 2), existing `pageOuterRef`, `scribbles`, `handwrites` memos.
- Produces: flag on → notes overlay hosted on `pageOuterRef` (same host as student ink, so gutter placement works) and `AnnotationStrip` renders nothing new; flag off → strip exactly as today.

- [ ] **Step 1: Wire**

Import `InkNotesOverlay` and `inkNotesEnabled`. At the AnnotationStrip site:

```tsx
        {/* SmoothDraw P3: on-board notes replace the strip under the flag.
            The strip component stays in the tree flag-off; its DELETION is
            deferred until the live legibility gate passes (spec §5). */}
        {inkNotesEnabled()
          ? null
          : <AnnotationStrip scribbles={scribbles} handwrites={handwrites} />}
```

Inside the `pageOuterRef` host div (next to the student-ink SVG block), add:

```tsx
        {inkNotesEnabled() && (
          <InkNotesOverlay hostRef={pageOuterRef} notes={handwrites} labeledScribbles={scribbles} />
        )}
```

- [ ] **Step 2: Battery**

Run: `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:process-tool-call && npm run test:page-grouping && npm run test:draw-on && npm run test:hand-stroke && npm run test:ink-placement && npm run test:student-marks`
Expected: all green (flag unset in test env → strip path untouched; test-tick-render's strip assertions still hold).

- [ ] **Step 3: Commit**

```bash
git add src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx
git commit -m "feat(tutor): SmoothDraw P3 — ink notes overlay wired; strip bypassed under flag"
```

---

### Task 5: PDF mirrors — feature-anchored notes baked into item captures

**Files:**
- Modify: `src/lib/utils/export/whiteboard-capture.ts` — extend the scribble-bake path (search `overlayScribbles`) with notes.
- Modify: `src/lib/utils/export/pdf-tutor-session.ts` — the handwrite caption-line renderer (search `handwrites are strip entries`) gates on resolution: feature-anchored notes are baked (skip the caption line); margin/unresolved notes keep the caption line.

**Interfaces:**
- Consumes: `placeNote` + `Rect` (Task 1), `inkNotesEnabled` (Task 2), each capture site's existing feature-rect data (`data-feature` attrs in the captured SVG).
- Produces: PDF parity — a note that rendered beside a feature on the live board appears beside that feature in the item's PDF image; margin notes appear as today's caption lines. Document the divergence in a comment: the PDF is a LINEAR item stack, so page-level margin placement has no equivalent — caption lines are the honest mirror.

- [ ] **Step 1: Bake feature-anchored notes in `overlayScribbles`**

Extend `overlayScribbles(svgString, scribbles)` to accept an optional third arg `inkNotes?: Array<{ text: string; color?: string; targetFeature?: string }>` (only passed when `inkNotesEnabled()`). For each note whose `targetFeature` matches a `data-feature` element in the parsed SVG: compute the feature rect from the element's `data-feature-cx/cy/w/h` attrs (the Phase-2b convention) or `getBBox`-equivalent attrs already used by the scribble bake; run `placeNote` against the item's viewBox as the page with `occupied = []`; append a `<text>` group (Caveat family string `'Caveat, Kalam, cursive'`, font-size scaled to viewBox like the tick math, fill = note color or `#a16207`) with one `<tspan>` per wrapped line (wrap at ~24 chars — canvas measureText is unavailable inside the capture's string pipeline; a character-count wrap is the documented approximation). Notes without a matching feature return unbaked (caller keeps their caption line).
Return shape: change to `{ svg: string; bakedTexts: string[] }` OR keep the string return and add an out-param — pick the minimal change that lets the PDF caller know which notes were baked; document the choice.

- [ ] **Step 2: Gate the caption lines**

In pdf-tutor-session.ts's handwrite renderer: when `inkNotesEnabled()` and the note was baked into an item capture (per Step 1's baked list, threaded through the export loop), skip its caption line; otherwise render the caption line exactly as today with a small `↳ margin note` suffix when the flag is on (so exports distinguish placed vs margin notes).

- [ ] **Step 3: Battery + commit**

Run: `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:ink-placement && npm run test:process-tool-call`
Expected: green.

```bash
git add src/lib/utils/export/whiteboard-capture.ts src/lib/utils/export/pdf-tutor-session.ts
git commit -m "feat(tutor): SmoothDraw P3 — PDF bakes feature-anchored notes; margin notes keep caption lines"
```

---

### Task 6: Gate — fresh-session e2e, overlap audit, round-7, user handoff

**Files:**
- Create: `scripts/tutor-e2e/scenarios/ink-notes.ts`
- Modify: `.env.local` (add `NEXT_PUBLIC_TUTOR_INK_NOTES=true`, dev only — NOT `.env.local.production`)

**Interfaces:** consumes everything above. The dev server must be RESTARTED after the env change (NEXT_PUBLIC inlining) — coordinate with the controller if a server is already running.

- [ ] **Step 1: Scenario**

```ts
// scripts/tutor-e2e/scenarios/ink-notes.ts
import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-3 gate: on-board ink notes. FRESH SESSION required —
 * the tutor_handwrite docstring changed (session-static prompt).
 * Requires NEXT_PUBLIC_TUTOR_INK_NOTES=true (and DRAW_ON) in .env.local
 * + dev-server restart. Run with TUTOR_E2E_VIDEO=1.
 */
const scenario: Scenario = {
  name: 'ink-notes',
  description: 'Notes land beside targets, never overlap, margin fallback works.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Draw the triangle with vertices (0,0), (6,0) and (0,4), and write a short note next to the vertex at the origin reminding me it is the right angle.',
      watchFor: 'Figure renders; a hand-written amber note sits BESIDE the origin vertex (not on the figure, not in a strip below); note wipes on.',
      timeoutMs: 150_000,
    },
    {
      say: 'Add another note near the hypotenuse about its length, and also jot a general reminder that area is half base times height.',
      watchFor: 'Second note beside the hypotenuse without overlapping the first note or the figure; the general reminder lands in the right margin column.',
      timeoutMs: 150_000,
    },
    {
      say: 'Can you highlight the vertex at (6,0) and label it "the far corner"?',
      watchFor: 'Scribble label renders as an on-board note beside (6,0) — NOT a strip entry; no overlap with existing notes.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
```

- [ ] **Step 2: Env + restart coordination** — add the flag to `.env.local`; the CONTROLLER restarts the dev server (it owns the background process). Verify `curl localhost:3006/tutor` → 200 before running.

- [ ] **Step 3: Commit scenario, then run once**

```bash
git add scripts/tutor-e2e/scenarios/ink-notes.ts
git commit -m "test(tutor): SmoothDraw P3 — ink-notes gate scenario"
TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- ink-notes
```

Analyze: screenshots + frames — (a) notes beside targets (slot engine visibly working), (b) ZERO overlap of notes with content or each other (measure pixel boxes in frames if borderline), (c) margin fallback for the general note, (d) NO AnnotationStrip section below items, (e) wipe-on animation visible, (f) PDF: feature-anchored notes beside their features in item images; margin note as caption line.

- [ ] **Step 4: Full battery + round-7**

Run: the Task-4 battery command + `npm run test:tutor-e2e -- round7-regression` (0 anomalies, 0 MAX_VALIDATOR_RETRIES — flag-on run also proves the docstring change doesn't destabilize guardrails).

- [ ] **Step 5: User handoff** — the LEGIBILITY GATE (spec §5): user drives real sessions and judges note legibility/placement. Strip code deletion is a SEPARATE post-gate cleanup commit, only after explicit user sign-off. Update ledger + memory.

---

## Self-review notes

- Spec §5 coverage: pure engine (T1), computed placement + silent margin fallback (T1/T2), `near` regained via catalog resolution (T2), Caveat wipe-on notes + px anchoring + amber identity (T3), strip stops receiving entries but survives flag-off (T4), PDF mirrors with documented linear-layout divergence (T5), fresh-session discipline + legibility gate + deferred deletion (T6).
- Type consistency: `Rect`/`Placement`/`placeNote`/`rectsOverlap` (T1) consumed in T3/T5; `inkNotesEnabled` (T2) consumed in T3-usage path, T4, T5; handwrite stamps `targetFeature`/`targetId` (T2) consumed by T3's `targetRect` and T5's bake.
- Known approximations, stated in-plan: PDF text wrap is character-count (no canvas in the string pipeline); margin notes have no spatial PDF equivalent (caption lines); occupied set uses whole-item rects (a note never sits INSIDE another item even where that item has whitespace) — conservative by design.
- No placeholders; code steps carry code.
