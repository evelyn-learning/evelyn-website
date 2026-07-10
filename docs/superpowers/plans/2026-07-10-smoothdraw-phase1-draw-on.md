# SmoothDraw Phase 1 — Draw-On Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** New whiteboard items animate on — SVG content draws stroke-by-stroke, HTML content wipes on, iframes fade — replacing the instant pop-in, gated behind `NEXT_PUBLIC_TUTOR_DRAW_ON`.

**Architecture:** A pure planner (`draw-on.ts`, no DOM — fully unit-testable) computes a timeline from drawable descriptors; a thin client hook (`useDrawOn.ts`) collects drawables from a mounted item's DOM, applies the timeline with the Web Animations API, and exposes `finishAll` for interrupts. WhiteboardCanvas calls the hook at the item-wrapper seam where `wb-item-enter` fires today; `seenAnimIdsRef` (already on main, a7c124a) stays the animate-once authority.

**Tech Stack:** TypeScript, React, Web Animations API (no new deps). Spec: `docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md`.

## Global Constraints

- Flag: engine runs only when `process.env.NEXT_PUBLIC_TUTOR_DRAW_ON === 'true'` AND `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`. Flag-off = byte-identical current behavior (`wb-item-enter` entrance).
- Presentation-only: no changes to command stream, catalog, dedup, persistence, PDFs, replay.
- Budget per item: `clamp(800ms, 80ms × strokeCount, 1500ms)`. Multi-item serial spacing 300ms. Stroke batching above 40 elements.
- WAAPI/CSS compositor only — no rAF loops, no React state during animation.
- READ `project_tutor_round7_architecture.md` before touching WhiteboardCanvas; do not regress dedup/silent-drop guardrails.
- Repo test-script style: plain `npx tsx scripts/test-*.ts` with a `check(name, cond)` counter and non-zero exit on failure (see `scripts/test-feature-slug.ts` as the template).
- Every commit: `npx tsc --noEmit` clean first. Do not edit app code while a tutor-e2e run is live (HMR poisons the run).
- **No voice tokens in testing (user directive 2026-07-10):** all tutor-e2e runs use the harness default silent TTS. NEVER set `TUTOR_E2E_TTS=cartesia` or `=mini` in this plan's steps; real-voice ear-tests are exclusively the user's live sign-off step.

---

### Task 1: Pure planner — `draw-on.ts` + unit suite

**Files:**
- Create: `src/lib/tutor/whiteboard/draw-on.ts`
- Create: `scripts/test-draw-on.ts`
- Modify: `package.json` (add `"test:draw-on": "npx tsx scripts/test-draw-on.ts"` next to `"test:feature-slug"`)

**Interfaces:**
- Consumes: nothing (pure).
- Produces (used by Task 2's hook):
  - `type Drawable = { kind: 'stroke'; length: number } | { kind: 'fill' }`
  - `type DrawStep = { index: number; delayMs: number; durMs: number; mode: 'stroke' | 'fade' }`
  - `type DrawPlan = { steps: DrawStep[]; totalMs: number }`
  - `planSvgDrawOn(drawables: Drawable[]): DrawPlan`
  - `planHtmlWipe(rowCount: number): DrawPlan` (steps' `mode` is `'fade'`; step i = row i)
  - `IFRAME_FADE_MS = 300`, `SERIAL_SPACING_MS = 300`, `STROKE_BATCH = 40`

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-draw-on.ts
/**
 * Unit suite for the SmoothDraw Phase-1 pure planner.
 * Run: npm run test:draw-on
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md
 */
import {
  planSvgDrawOn,
  planHtmlWipe,
  IFRAME_FADE_MS,
  SERIAL_SPACING_MS,
  STROKE_BATCH,
  type Drawable,
} from '../src/lib/tutor/whiteboard/draw-on';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const strokes = (n: number): Drawable[] =>
  Array.from({ length: n }, () => ({ kind: 'stroke' as const, length: 100 }));

// ── budget clamp ──────────────────────────────────────────────
{
  check('1 stroke → floor budget 800ms', planSvgDrawOn(strokes(1)).totalMs === 800);
  check('12 strokes → 12×80 = 960ms', planSvgDrawOn(strokes(12)).totalMs === 960);
  check('40 strokes → ceiling 1500ms', planSvgDrawOn(strokes(40)).totalMs === 1500);
  check('200 strokes → still ceiling 1500ms', planSvgDrawOn(strokes(200)).totalMs === 1500);
}

// ── stagger shape ─────────────────────────────────────────────
{
  const plan = planSvgDrawOn(strokes(5));
  check('one step per drawable', plan.steps.length === 5);
  check('first step starts at 0', plan.steps[0].delayMs === 0);
  const starts = plan.steps.map((s) => s.delayMs);
  check('starts are non-decreasing', starts.every((v, i) => i === 0 || v >= starts[i - 1]));
  const last = plan.steps[plan.steps.length - 1];
  check('last step ends at totalMs', last.delayMs + last.durMs === plan.totalMs);
  const overlaps = plan.steps.slice(1).map((s, i) => plan.steps[i].delayMs + plan.steps[i].durMs - s.delayMs);
  check('consecutive strokes overlap (continuous drawing)', overlaps.every((o) => o > 0));
}

// ── fills fade after their preceding stroke group ─────────────
{
  const mixed: Drawable[] = [
    { kind: 'stroke', length: 50 }, { kind: 'fill' },
    { kind: 'stroke', length: 50 }, { kind: 'fill' },
  ];
  const plan = planSvgDrawOn(mixed);
  check('fill steps use fade mode', plan.steps[1].mode === 'fade' && plan.steps[3].mode === 'fade');
  const s0 = plan.steps[0], f1 = plan.steps[1];
  check('fill starts when its preceding stroke completes', f1.delayMs >= s0.delayMs + s0.durMs - 1);
}

// ── batching above STROKE_BATCH ───────────────────────────────
{
  const plan = planSvgDrawOn(strokes(120));
  const uniqueStarts = new Set(plan.steps.filter((s) => s.mode === 'stroke').map((s) => s.delayMs));
  check(`>${STROKE_BATCH} strokes batch into shared slots`, uniqueStarts.size <= STROKE_BATCH);
  check('batched plan still fits ceiling', plan.totalMs === 1500);
}

// ── degenerate inputs ─────────────────────────────────────────
{
  check('zero drawables → empty plan, 0ms', planSvgDrawOn([]).totalMs === 0 && planSvgDrawOn([]).steps.length === 0);
  const fillsOnly = planSvgDrawOn([{ kind: 'fill' }, { kind: 'fill' }]);
  check('fills-only item fades within floor budget', fillsOnly.totalMs === 800 && fillsOnly.steps.every((s) => s.mode === 'fade'));
}

// ── HTML wipe ─────────────────────────────────────────────────
{
  const one = planHtmlWipe(1);
  check('single-region wipe uses floor budget', one.totalMs === 800 && one.steps.length === 1);
  const rows = planHtmlWipe(6);
  check('6 rows → 6 steps, staggered, ends at totalMs',
    rows.steps.length === 6
    && rows.steps[0].delayMs === 0
    && rows.steps[5].delayMs + rows.steps[5].durMs === rows.totalMs);
  check('row wipes budget scales with rows, capped', planHtmlWipe(30).totalMs === 1500);
}

// ── constants ─────────────────────────────────────────────────
{
  check('iframe fade is 300ms', IFRAME_FADE_MS === 300);
  check('serial spacing is 300ms', SERIAL_SPACING_MS === 300);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: Add the npm script and run to verify failure**

Add to `package.json` scripts (next to `test:feature-slug`):
```json
"test:draw-on": "npx tsx scripts/test-draw-on.ts",
```
Run: `npm run test:draw-on`
Expected: FAIL — `Cannot find module '../src/lib/tutor/whiteboard/draw-on'`.

- [ ] **Step 3: Implement the planner**

```ts
// src/lib/tutor/whiteboard/draw-on.ts
/**
 * SmoothDraw Phase 1 — pure draw-on planner (no DOM).
 *
 * Computes an animation timeline for a newly mounted whiteboard item.
 * The DOM walking + Web Animations application live in the client hook
 * (useDrawOn.ts); keeping this module pure makes the timing math fully
 * unit-testable (npm run test:draw-on).
 *
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md
 * Budget: clamp(800, 80 × strokeCount, 1500) ms. Strokes stagger with
 * overlap so the item reads as ONE continuous drawing; fills/text fade
 * in as the stroke immediately before them (document order) completes.
 * Above STROKE_BATCH strokes, strokes share start slots so dense
 * figures still finish inside the ceiling.
 */

export type Drawable = { kind: 'stroke'; length: number } | { kind: 'fill' };
export type DrawStep = { index: number; delayMs: number; durMs: number; mode: 'stroke' | 'fade' };
export type DrawPlan = { steps: DrawStep[]; totalMs: number };

export const IFRAME_FADE_MS = 300;
export const SERIAL_SPACING_MS = 300;
export const STROKE_BATCH = 40;

const FLOOR_MS = 800;
const CEIL_MS = 1500;
const PER_STROKE_MS = 80;
const FADE_MS = 250;

function budgetFor(strokeCount: number): number {
  if (strokeCount === 0) return FLOOR_MS;
  return Math.max(FLOOR_MS, Math.min(CEIL_MS, strokeCount * PER_STROKE_MS));
}

export function planSvgDrawOn(drawables: Drawable[]): DrawPlan {
  if (drawables.length === 0) return { steps: [], totalMs: 0 };
  const strokeIdx = drawables
    .map((d, i) => ({ d, i }))
    .filter((x) => x.d.kind === 'stroke')
    .map((x) => x.i);
  const n = strokeIdx.length;
  const total = budgetFor(n);

  const steps: DrawStep[] = [];
  // Slot count: one per stroke up to STROKE_BATCH, then strokes share.
  const slots = Math.max(1, Math.min(n, STROKE_BATCH));
  // Each stroke draws for durPer; slot starts spread so the LAST slot
  // ends exactly at `total`, and consecutive slots overlap (~40%).
  const durPer = slots === 1 ? total : Math.min(600, Math.max(120, (total / slots) * 1.6));
  const lastStart = total - durPer;
  const slotStart = (slot: number) => (slots === 1 ? 0 : Math.round((lastStart * slot) / (slots - 1)));

  const strokeEnd = new Map<number, number>(); // drawable index → end time
  strokeIdx.forEach((di, k) => {
    const slot = Math.floor((k * slots) / n); // batches strokes into slots when n > slots
    const delayMs = slotStart(slot);
    const durMs = slot === slots - 1 ? total - delayMs : durPer;
    steps.push({ index: di, delayMs, durMs, mode: 'stroke' });
    strokeEnd.set(di, delayMs + durMs);
  });

  // Fills fade in when the nearest PRECEDING stroke (document order)
  // completes; a fill before any stroke fades at t=0.
  drawables.forEach((d, di) => {
    if (d.kind !== 'fill') return;
    let precedingEnd = 0;
    for (let j = di - 1; j >= 0; j--) {
      if (strokeEnd.has(j)) { precedingEnd = strokeEnd.get(j)!; break; }
    }
    steps.push({ index: di, delayMs: Math.min(precedingEnd, total - FADE_MS < 0 ? 0 : Math.min(precedingEnd, total - FADE_MS)), durMs: FADE_MS, mode: 'fade' });
  });

  steps.sort((a, b) => a.index - b.index);
  return { steps, totalMs: total };
}

export function planHtmlWipe(rowCount: number): DrawPlan {
  const rows = Math.max(1, rowCount);
  const total = Math.max(FLOOR_MS, Math.min(CEIL_MS, rows * 200));
  const durPer = rows === 1 ? total : Math.min(500, (total / rows) * 1.6);
  const lastStart = total - durPer;
  const steps: DrawStep[] = Array.from({ length: rows }, (_, i) => {
    const delayMs = rows === 1 ? 0 : Math.round((lastStart * i) / (rows - 1));
    const durMs = i === rows - 1 ? total - delayMs : durPer;
    return { index: i, delayMs, durMs, mode: 'fade' as const };
  });
  return { steps, totalMs: total };
}
```

- [ ] **Step 4: Run tests until green, fix planner math (not tests) on failures**

Run: `npm run test:draw-on`
Expected: all checks pass, exit 0. Also run `npx tsc --noEmit` — clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/whiteboard/draw-on.ts scripts/test-draw-on.ts package.json
git commit -m "feat(tutor): SmoothDraw P1 — pure draw-on planner + unit suite"
```

---

### Task 2: Client hook — `useDrawOn.ts` (collect, apply, finish)

**Files:**
- Create: `src/app/tutor/components/whiteboard/useDrawOn.ts`

**Interfaces:**
- Consumes (Task 1): `planSvgDrawOn`, `planHtmlWipe`, `Drawable`, `IFRAME_FADE_MS`, `SERIAL_SPACING_MS`.
- Produces (used by Task 3):
  - `drawOnEnabled(): boolean` — flag + reduced-motion gate.
  - `useDrawOn(): { animateItem: (el: HTMLElement) => void; finishAll: () => void }`
  - `animateItem` is idempotent per element (guarded by a `data-draw-on` stamp).

- [ ] **Step 1: Write the hook**

```ts
// src/app/tutor/components/whiteboard/useDrawOn.ts
'use client';

/**
 * SmoothDraw Phase 1 — DOM side of the draw-on engine.
 *
 * Collects drawables from a freshly mounted item wrapper, plans the
 * timeline with the pure planner (draw-on.ts), and applies it with the
 * Web Animations API. Compositor-only: stroke-dashoffset / clip-path /
 * opacity. No React state, no rAF loops.
 *
 * finishAll() jumps every tracked animation to its end state — wired by
 * WhiteboardCanvas to kill-recovery (revisingIds), turn end, and the
 * __tutorFinishDrawOn dev hook. Unmount/page-switch needs no handling:
 * the page subtree remounts and seenAnimIdsRef prevents re-animation,
 * so a fresh mount renders the final (un-animated) state.
 */

import { useCallback, useEffect, useRef } from 'react';
import { planSvgDrawOn, planHtmlWipe, IFRAME_FADE_MS, SERIAL_SPACING_MS, type Drawable } from '@/lib/tutor/whiteboard/draw-on';

export function drawOnEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_TUTOR_DRAW_ON !== 'true') return false;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch { /* matchMedia unavailable — treat as no preference */ }
  return true;
}

const STROKE_SELECTOR = 'path, line, polyline, polygon, circle, ellipse, rect';

function isStrokeDrawable(el: SVGGeometryElement): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  if (cs.stroke === 'none' || cs.stroke === '') return false;
  if (parseFloat(cs.strokeWidth || '0') <= 0) return false;
  return true;
}

export function useDrawOn() {
  const animsRef = useRef<Set<Animation>>(new Set());
  // Serial queue across items in the same batch: the next item's
  // animation starts SERIAL_SPACING_MS after the previous item's ends.
  const queueEndAtRef = useRef(0);

  const track = useCallback((a: Animation) => {
    animsRef.current.add(a);
    const drop = () => animsRef.current.delete(a);
    a.addEventListener('finish', drop);
    a.addEventListener('cancel', drop);
  }, []);

  const finishAll = useCallback(() => {
    for (const a of Array.from(animsRef.current)) {
      try { a.finish(); } catch { try { a.cancel(); } catch { /* detached */ } }
    }
    animsRef.current.clear();
    queueEndAtRef.current = 0;
  }, []);

  const animateItem = useCallback((wrapper: HTMLElement) => {
    if (wrapper.dataset.drawOn) return; // idempotent per element
    wrapper.dataset.drawOn = '1';

    const now = performance.now();
    const baseDelay = Math.max(0, queueEndAtRef.current - now);

    const iframe = wrapper.querySelector('iframe');
    const svg = wrapper.querySelector('svg');

    if (iframe || !svg) {
      // Iframe content (Desmos/Ketcher) or pure-HTML content (KaTeX
      // equations, cards, tables): wipe/fade. Row-detect for tables.
      const rows = wrapper.querySelectorAll('tr');
      if (!iframe && rows.length > 1) {
        const plan = planHtmlWipe(rows.length);
        plan.steps.forEach((s) => {
          const el = rows[s.index] as HTMLElement;
          track(el.animate(
            [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)' }],
            { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-out', fill: 'backwards' },
          ));
        });
        queueEndAtRef.current = now + baseDelay + plan.totalMs + SERIAL_SPACING_MS;
        return;
      }
      const dur = iframe ? IFRAME_FADE_MS : planHtmlWipe(1).totalMs;
      const frames = iframe
        ? [{ opacity: 0, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }]
        : [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
      track(wrapper.animate(frames, { delay: baseDelay, duration: dur, easing: 'ease-out', fill: 'backwards' }));
      queueEndAtRef.current = now + baseDelay + dur + SERIAL_SPACING_MS;
      return;
    }

    // SVG content: stroke-by-stroke draw-on.
    const els = Array.from(svg.querySelectorAll<SVGElement>(`${STROKE_SELECTOR}, text, image, foreignObject`));
    const drawables: Drawable[] = [];
    const domFor: SVGElement[] = [];
    for (const el of els) {
      if (el instanceof SVGGeometryElement && isStrokeDrawable(el)) {
        let length = 0;
        try { length = el.getTotalLength(); } catch { /* zero-size geometry */ }
        drawables.push({ kind: 'stroke', length });
      } else {
        drawables.push({ kind: 'fill' });
      }
      domFor.push(el);
    }
    const plan = planSvgDrawOn(drawables);
    plan.steps.forEach((s) => {
      const el = domFor[s.index];
      if (s.mode === 'stroke') {
        const geo = el as SVGGeometryElement;
        let len = 0;
        try { len = geo.getTotalLength(); } catch { /* skip */ }
        if (!len || !isFinite(len)) {
          track(el.animate([{ opacity: 0 }, { opacity: 1 }], { delay: baseDelay + s.delayMs, duration: s.durMs, fill: 'backwards' }));
          return;
        }
        el.style.strokeDasharray = `${len}`;
        const a = el.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-in-out', fill: 'backwards' },
        );
        a.addEventListener('finish', () => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; });
        track(a);
      } else {
        track(el.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { delay: baseDelay + s.delayMs, duration: s.durMs, easing: 'ease-out', fill: 'backwards' },
        ));
      }
    });
    queueEndAtRef.current = now + baseDelay + plan.totalMs + SERIAL_SPACING_MS;
  }, [track]);

  // Safety: finish everything if the hook's owner unmounts mid-animation.
  useEffect(() => () => { finishAll(); }, [finishAll]);

  return { animateItem, finishAll };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean. (No unit test — DOM/WAAPI; behavior is exercised by Task 4's harness scenario and the Task 5 e2e.)

- [ ] **Step 3: Commit**

```bash
git add src/app/tutor/components/whiteboard/useDrawOn.ts
git commit -m "feat(tutor): SmoothDraw P1 — useDrawOn hook (collect/apply/finish, WAAPI)"
```

---

### Task 3: WhiteboardCanvas integration at the item-mount seam

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` — the `itemEnterClass` block (search for `seenAnimIdsRef`), the two item-wrapper render sites (search for `itemEnterClass(`), and the `revisingIds` memo (search for `const revisingIds`).

**Interfaces:**
- Consumes (Task 2): `useDrawOn`, `drawOnEnabled`.
- Produces: item wrappers call `animateItem` on first mount when enabled; `wb-item-enter` class only applies when the engine is OFF (flag-off/reduced-motion → today's behavior, byte-identical). `finishAll` fires on kill-recovery and turn end. Dev hook `window.__tutorFinishDrawOn`.

- [ ] **Step 1: Wire the hook beside `itemEnterClass`**

In WhiteboardCanvas (top of component, near `seenAnimIdsRef`):

```tsx
  const { animateItem, finishAll } = useDrawOn();
  const drawOnActive = drawOnEnabled();
```

Change `itemEnterClass` so the CSS entrance only applies when draw-on is inactive (the draw-on engine REPLACES wb-item-enter; both together would double-animate):

```tsx
  const itemEnterClass = (cmd: WhiteboardCommand): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (cmd as any).id as string | undefined;
    if (id && seenAnimIdsRef.current.has(id)) return '';
    return drawOnActive ? '' : 'wb-item-enter';
  };
```

Add a ref-callback helper next to it — first mount of an UNSEEN item triggers draw-on (seen items render final-state instantly, preserving animate-once across page flips):

```tsx
  // Draw-on trigger: runs in the item wrapper's ref callback on first
  // mount. Must check seenAnimIdsRef BEFORE the post-commit effect below
  // marks the id seen — ref callbacks fire pre-effect, so ordering holds.
  const maybeDrawOn = (cmd: WhiteboardCommand, el: HTMLElement | null) => {
    if (!el || !drawOnActive) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (cmd as any).id as string | undefined;
    if (id && seenAnimIdsRef.current.has(id)) return;
    animateItem(el);
  };
```

- [ ] **Step 2: Call it from both item-wrapper render sites**

Single-item branch (wrapper already has a ref storing into `itemRefsRef`) — extend the existing ref callback:

```tsx
            ref={(el) => { itemRefsRef.current[0] = el; maybeDrawOn(renderableCommands[0], el); }}
```

Multi-item branch (inner wrapper with `data-wb-item-index={i + 1}`) — same extension:

```tsx
                    ref={(el) => { itemRefsRef.current[i] = el; maybeDrawOn(cmd, el); }}
```

- [ ] **Step 3: Interrupt wiring**

Add one effect below the `revisingIds` memo — kill-recovery dims/replaces items; running strokes must land in final state first. Also finish on turn end (`tutorBusy` → false), which covers barge-in (barge-in ends the turn):

```tsx
  // SmoothDraw interrupts: kill-recovery (revisingIds change) and turn
  // end (tutorBusy → false, which includes barge-in) fast-forward all
  // running draw-on animations to their final state. Page-switch needs
  // nothing: the subtree remounts and seenAnimIdsRef renders seen items
  // instantly. Spec §2.
  const prevTutorBusyRef = useRef(tutorBusy);
  useEffect(() => {
    if (revisingIds.size > 0) finishAll();
  }, [revisingIds, finishAll]);
  useEffect(() => {
    if (prevTutorBusyRef.current && !tutorBusy) finishAll();
    prevTutorBusyRef.current = tutorBusy;
  }, [tutorBusy, finishAll]);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__tutorFinishDrawOn = finishAll;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { delete (window as any).__tutorFinishDrawOn; };
  }, [finishAll]);
```

Add the import at the top of the file:

```tsx
import { useDrawOn, drawOnEnabled } from './useDrawOn';
```

- [ ] **Step 4: Verify flag-off is byte-identical + suites green**

Run: `npx tsc --noEmit && npm run test:process-tool-call && npm run test:page-grouping && npx tsx scripts/test-tick-render.ts && npm run test:draw-on`
Expected: all green. With `NEXT_PUBLIC_TUTOR_DRAW_ON` unset, `drawOnActive` is false → `itemEnterClass` returns exactly what it returns on main today and `maybeDrawOn` no-ops.

- [ ] **Step 5: Commit**

```bash
git add src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx
git commit -m "feat(tutor): SmoothDraw P1 — draw-on wired at the item-mount seam (flag-gated)"
```

---

### Task 4: Kill-mid-animation harness scenario + dev flag

**Files:**
- Create: `scripts/tutor-e2e/scenarios/draw-on-kill.ts`
- Modify: `.env.local` (add `NEXT_PUBLIC_TUTOR_DRAW_ON=true` near the other `NEXT_PUBLIC_TUTOR_*` flags, dev only — do NOT touch `.env.local.production`)

**Interfaces:**
- Consumes: the harness `trigger` mechanism (`__tutorForceKill`, see `scripts/tutor-e2e/types.ts`) and the Task 3 dev hook.
- Produces: a repeatable scenario proving a judge kill mid-draw lands the board in the correct final state.

- [ ] **Step 1: Write the scenario**

```ts
// scripts/tutor-e2e/scenarios/draw-on-kill.ts
import type { Scenario } from '../types';

/**
 * SmoothDraw Phase-1 gate: a judge kill arriving while an item is mid
 * draw-on must fast-forward the animation — the retry's board state must
 * be complete/correct, never a half-drawn figure. Requires
 * NEXT_PUBLIC_TUTOR_DRAW_ON=true in .env.local (dev). Run with
 * TUTOR_E2E_VIDEO=1 and scrub the video around the kill.
 */
const scenario: Scenario = {
  name: 'draw-on-kill',
  description: 'Judge kill mid-draw-on fast-forwards animations; board lands complete.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'ellipses' }],
  testTurns: [
    {
      say: 'Draw the ellipse x squared over 9 plus y squared over 4 equals 1 with its foci.',
      watchFor: 'Figure draws on stroke-by-stroke (video); final frame complete.',
      timeoutMs: 150_000,
    },
    {
      trigger: '__tutorForceKill',
      say: 'Now add the directrices to that figure.',
      watchFor: 'Kill fires during the turn; no half-drawn strokes persist after retry; board state correct.',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
```

- [ ] **Step 2: Enable the dev flag**

Add to `.env.local` (dev only):
```
NEXT_PUBLIC_TUTOR_DRAW_ON=true
```
Restart the dev server (NEXT_PUBLIC vars are inlined at build).

- [ ] **Step 3: Run the scenario with video**

Run: `TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- draw-on-kill`
Expected: 0 anomalies. Extract frames around the render turns (`ffmpeg -ss <t> -t 6 -i <bundle>/*.webm -vf fps=4 frames-%02d.png`) and verify: strokes progressively appear across frames; the post-kill board shows only complete figures.

- [ ] **Step 4: Commit**

```bash
git add scripts/tutor-e2e/scenarios/draw-on-kill.ts
git commit -m "test(tutor): SmoothDraw P1 — kill-mid-animation harness scenario"
```

---

### Task 5: Phase-1 gate — perf budget + full regression + live sign-off prep

**Files:**
- None created; verification only.

**Interfaces:**
- Consumes: everything above; the jank probe (`perf.json` in every e2e bundle).

- [ ] **Step 1: Full unit battery**

Run: `npm run test:draw-on && npm run test:feature-slug && npm run test:process-tool-call && npm run test:page-grouping && npm run test:page-model && npm run test:board-map && npm run test:student-marks && npm run test:render-sync && npx tsx scripts/test-tick-render.ts && npx tsc --noEmit`
Expected: all green.

- [ ] **Step 2: Render-heavy e2e with video + perf budget check**

Run: `TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- ui-audit-visuals`
Then inspect the bundle's `perf.json`:
Expected: total CLS (non-input) ≤ 0.05; zero long tasks > 100ms. Compare against the 2026-07-10 baselines (CLS 0.023–0.043, max task 107ms) — the engine must not add measurable jank. Scrub the video: items draw on; no flash-then-redraw.

- [ ] **Step 3: Round-7 regression session**

Run the incoherence plan per `project_tutor_round7_architecture.md` (plan id `evelyn.test.incoherence.v1`, Mathematics → College Intro → Intro Statistics → "[TEST] Problem-injection incoherence") through the harness or live — no kill cascades, dedup intact, no animation artifacts on retry turns.

- [ ] **Step 4: Hand to the user for live eyeball**

Dev server with the flag on; user drives a real session and judges the feel (stagger order, speed, whether equations' wipe reads as writing). The prod env flag flip is the USER's call after this gate — not part of this plan.

- [ ] **Step 5: Update memory + commit any doc touches**

Update `project_tutor_wb_ui_audit_2026_07_10` memory: Phase 1 status, gotchas found, next = Phase 2 (hand-stroke marks).

---

## Self-review notes

- Spec coverage: engine (§1 → Tasks 1–3), interrupts (§2 → Task 3 step 3 + Task 4), perf guardrails (§3 → Task 5 step 2), flags/reduced-motion (§2 → Task 2), phases/gates (Phase-1 rows → Tasks 4–5). Marks/notes/arrows are Phases 2–4 — separate plans.
- Type consistency: `Drawable`/`DrawPlan`/`planSvgDrawOn`/`planHtmlWipe` names match across Tasks 1–2; `animateItem`/`finishAll`/`drawOnEnabled` match across Tasks 2–3.
- No placeholders; every code step carries the code.
