# SmoothDraw Phase 2 — Hand-Stroke Marks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tutor marks (ticks, highlights) become animated hand-drawn strokes — variable-width, tapered, deterministically wobbled — in the live overlay and both PDF mirrors; plus close Phase 1's carried verification debt (translucent settle, barge-in mid-draw, resume/reload).

**Architecture:** A pure module (`hand-stroke.ts`) turns a spine polyline into a closed variable-width outline path with seeded wobble (no `Math.random` — replay/PDF determinism). ScribbleOverlays renders marks from it when the draw-on flag is on (flag-off keeps today's geometric marks, byte-identical) and animates new marks on with a ~400ms WAAPI reveal. The two PDF capture sites consume the same pure module so exports match the live board.

**Tech Stack:** TypeScript, React, WAAPI. No new deps. Spec: `docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md` §4 (+ §2 interrupts). Phase 1 is merged (de548a9).

## Global Constraints

- Flag parity with Phase 1: hand marks render ONLY when `NEXT_PUBLIC_TUTOR_DRAW_ON === 'true'` (same gate as the engine, per the spec's phase table; reuse `drawOnEnabled()` from `src/app/tutor/components/whiteboard/useDrawOn.ts`). Flag-off = today's geometric tick/highlight, byte-identical.
- Determinism: wobble is seeded from mark content (target/feature), NEVER `Math.random` — re-renders, replay, and PDF must produce the identical mark.
- PDF capture sites (`src/lib/utils/export/whiteboard-capture.ts`, BOTH sites) change in lockstep with the live overlay, always.
- Round-7 guardrails: scribble failure paths stay silent-drop; do not touch resolution, dedup, or the anchor/clamp math shipped in a7c124a.
- **No voice tokens in testing:** all tutor-e2e runs use the harness default silent TTS; NEVER set `TUTOR_E2E_TTS`.
- Do not edit app source while an e2e run is live (HMR poisons the run). Each e2e scenario runs once (real brain cost); one diagnostic re-run for harness/env failures only.
- Every commit: `npx tsc --noEmit` clean first. Commits end with the project trailer (Co-Authored-By: Claude Fable 5 + Claude-Session link).
- Repo test style: `npx tsx scripts/test-*.ts`, `check(name, cond)` counter, non-zero exit on failure.

---

### Task 1: Pure hand-stroke geometry — `hand-stroke.ts` + unit suite

**Files:**
- Create: `src/lib/tutor/whiteboard/hand-stroke.ts`
- Create: `scripts/test-hand-stroke.ts`
- Modify: `package.json` (add `"test:hand-stroke": "npx tsx scripts/test-hand-stroke.ts"` next to `"test:draw-on"`)

**Interfaces:**
- Consumes: nothing (pure).
- Produces (used by Tasks 2–3):
  - `type Pt = { x: number; y: number }`
  - `strokeOutline(spine: Pt[], baseWidth: number, seed: string): string` — closed SVG path `d` (fill it, don't stroke it)
  - `tickSpine(tx: number, ty: number, size: number): Pt[]` — the ✓ spine through the existing anchor point
  - `highlightBand(rect: { x: number; y: number; w: number; h: number }, seed: string): { spine: Pt[]; width: number } | null` — marker-swipe geometry, or null when the rect is too tall for a swipe (caller keeps the translucent rect)

- [ ] **Step 1: Write the failing test**

```ts
// scripts/test-hand-stroke.ts
/**
 * Unit suite for SmoothDraw Phase-2 hand-stroke geometry (pure, seeded).
 * Run: npm run test:hand-stroke
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md §4
 */
import { strokeOutline, tickSpine, highlightBand, type Pt } from '../src/lib/tutor/whiteboard/hand-stroke';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const spine: Pt[] = [{ x: 10, y: 50 }, { x: 40, y: 80 }, { x: 90, y: 20 }];

// ── determinism ───────────────────────────────────────────────
{
  const a = strokeOutline(spine, 8, 'point-3-0');
  const b = strokeOutline(spine, 8, 'point-3-0');
  const c = strokeOutline(spine, 8, 'point-neg3-0');
  check('same seed → identical path', a === b);
  check('different seed → different wobble', a !== c);
  check('no Math.random dependence (runs stable across calls)', strokeOutline(spine, 8, 'x') === strokeOutline(spine, 8, 'x'));
}

// ── path shape ────────────────────────────────────────────────
{
  const d = strokeOutline(spine, 8, 's');
  check('path is closed', /Z\s*$/.test(d));
  check('path starts with M', d.startsWith('M'));
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  check('outline has many points (resampled, not 3)', nums.length > 40);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  // Outline must stay within spine bbox inflated by baseWidth (wobble margin included).
  check('outline bounded by spine bbox + width', Math.min(...xs) >= 10 - 8 && Math.max(...xs) <= 90 + 8
    && Math.min(...ys) >= 20 - 8 && Math.max(...ys) <= 80 + 8);
}

// ── taper: ends thinner than middle ───────────────────────────
{
  // Straight horizontal spine: outline y-extent at the ends must be
  // smaller than at the midpoint (variable width with end taper).
  const flat: Pt[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
  const d = strokeOutline(flat, 10, 't');
  const pairs = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const pts: Pt[] = [];
  for (let i = 0; i + 1 < pairs.length; i += 2) pts.push({ x: pairs[i], y: pairs[i + 1] });
  const widthAt = (x0: number, x1: number) => {
    const ys = pts.filter((p) => p.x >= x0 && p.x <= x1).map((p) => p.y);
    return ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  };
  const endW = Math.max(widthAt(0, 12), widthAt(88, 100));
  const midW = widthAt(44, 56);
  check('mid width exceeds end width (taper)', midW > endW && midW > 0);
}

// ── degenerate spines never throw ─────────────────────────────
{
  check('single-point spine → empty path', strokeOutline([{ x: 5, y: 5 }], 8, 's') === '');
  check('empty spine → empty path', strokeOutline([], 8, 's') === '');
  const dup = strokeOutline([{ x: 5, y: 5 }, { x: 5, y: 5 }], 8, 's');
  check('zero-length spine → empty path', dup === '');
}

// ── tick spine geometry ───────────────────────────────────────
{
  const t = tickSpine(100, 50, 20);
  check('tick spine has 3 points', t.length === 3);
  check('tick cusp is below the wings', t[1].y > t[0].y && t[1].y > t[2].y);
  check('tick sweeps left to right', t[0].x < t[1].x && t[1].x < t[2].x);
  check('tick long arm rises above anchor', t[2].y < 50);
}

// ── highlight band ────────────────────────────────────────────
{
  const wide = highlightBand({ x: 0, y: 0, w: 200, h: 30 }, 'h');
  check('wide rect → band returned', wide !== null);
  if (wide) {
    check('band spine spans the rect width', Math.abs(wide.spine[0].x - 0) < 12 && Math.abs(wide.spine[wide.spine.length - 1].x - 200) < 12);
    check('band width ≤ rect height', wide.width <= 30);
    check('band deterministic', JSON.stringify(highlightBand({ x: 0, y: 0, w: 200, h: 30 }, 'h')) === JSON.stringify(wide));
  }
  const tall = highlightBand({ x: 0, y: 0, w: 40, h: 300 }, 'h');
  check('tall region → null (caller keeps rect fill)', tall === null);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: Add npm script, run to verify failure**

Add to `package.json` scripts next to `test:draw-on`:
```json
"test:hand-stroke": "npx tsx scripts/test-hand-stroke.ts",
```
Run: `npm run test:hand-stroke`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/tutor/whiteboard/hand-stroke.ts
/**
 * SmoothDraw Phase 2 — pure hand-stroke geometry.
 *
 * Turns a spine polyline into a CLOSED variable-width outline path (fill
 * it, don't stroke it): tapered at both ends, slightly wobbled. Wobble is
 * seeded (FNV-1a → mulberry32) from mark content so re-renders, replay,
 * and the PDF mirrors produce the IDENTICAL mark — Math.random is banned
 * here (spec §4).
 *
 * Consumers: ScribbleOverlays (live) + whiteboard-capture.ts (both PDF
 * sites). Keep the three in lockstep.
 */

export type Pt = { x: number; y: number };

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resample a polyline to ~STEP-px spacing so the outline bends smoothly. */
const STEP = 6;
function resample(spine: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < spine.length; i++) {
    const a = spine[i];
    const b = spine[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.round(len / STEP));
    for (let k = 0; k < n; k++) {
      out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
    }
  }
  if (spine.length > 0) out.push(spine[spine.length - 1]);
  return out;
}

/** Width profile: taper over the first/last 15% of arc, floor 30%. */
function widthFactor(t: number): number {
  const ramp = Math.min(1, t / 0.15, (1 - t) / 0.15);
  return 0.3 + 0.7 * Math.max(0, ramp);
}

export function strokeOutline(spine: Pt[], baseWidth: number, seed: string): string {
  const pts = resample(spine);
  if (pts.length < 2) return '';
  let total = 0;
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  if (total === 0) return '';

  const rng = mulberry32(fnv1a(seed));
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(next.y - prev.y);
    let ny = next.x - prev.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl;
    ny /= nl;
    const t = cum[i] / total;
    // Wobble: ±12% of baseWidth on the half-width, per point, seeded.
    const noise = (rng() - 0.5) * 0.24;
    const half = Math.max(0.4, (baseWidth * (widthFactor(t) + noise)) / 2);
    left.push({ x: pts[i].x + nx * half, y: pts[i].y + ny * half });
    right.push({ x: pts[i].x - nx * half, y: pts[i].y - ny * half });
  }
  const fmt = (p: Pt) => `${Math.round(p.x * 100) / 100} ${Math.round(p.y * 100) / 100}`;
  return `M ${fmt(left[0])} L ${left.slice(1).map(fmt).join(' L ')} L ${right.reverse().map(fmt).join(' L ')} Z`;
}

/** The ✓ spine through the existing corner anchor (tx, ty) — same
 *  three-point geometry as the a7c124a tick path so anchor/clamp math
 *  in callers is unchanged. */
export function tickSpine(tx: number, ty: number, size: number): Pt[] {
  const half = size / 2;
  return [
    { x: tx - half, y: ty },
    { x: tx - half * 0.25, y: ty + half * 0.7 },
    { x: tx + half, y: ty - half * 0.6 },
  ];
}

/** Marker-swipe band for a highlight rect: a near-horizontal spine across
 *  the rect's vertical middle with seeded end jitter. Returns null when
 *  the rect is too tall for a single swipe to read as "highlighted" —
 *  the caller keeps the translucent rect fill for those regions. */
export function highlightBand(
  rect: { x: number; y: number; w: number; h: number },
  seed: string,
): { spine: Pt[]; width: number } | null {
  const width = Math.min(rect.h, Math.max(14, rect.h * 0.7), 44);
  if (rect.h > width * 2) return null;
  const rng = mulberry32(fnv1a(seed));
  const midY = rect.y + rect.h / 2;
  const jitter = () => (rng() - 0.5) * rect.h * 0.12;
  return {
    spine: [
      { x: rect.x + rect.w * 0.02, y: midY + jitter() },
      { x: rect.x + rect.w * 0.5, y: midY + jitter() },
      { x: rect.x + rect.w * 0.98, y: midY + jitter() },
    ],
    width,
  };
}
```

- [ ] **Step 4: Run until green + typecheck**

Run: `npm run test:hand-stroke && npx tsc --noEmit`
Expected: all checks pass; tsc clean. Fix implementation math (never weaken tests) on failures.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/whiteboard/hand-stroke.ts scripts/test-hand-stroke.ts package.json
git commit -m "feat(tutor): SmoothDraw P2 — pure hand-stroke geometry + unit suite"
```

---

### Task 2: Live hand marks in ScribbleOverlays + ~400ms mark draw-on

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` — inside `ScribbleOverlays` only (search `function ScribbleOverlays`); the tick/highlight render block (search `Tick anchor: just OUTSIDE`).

**Interfaces:**
- Consumes (Task 1): `strokeOutline`, `tickSpine`, `highlightBand`. Also `drawOnEnabled` from `./useDrawOn`.
- Produces: when `drawOnEnabled()` — ticks/highlights render as filled hand-stroke outlines and animate on over ~400ms; flag-off renders today's geometric marks byte-identically. Later tasks rely on the seed convention: `` `${s.targetFeature ?? s.target ?? 'mark'}` ``.

- [ ] **Step 1: Add imports and a seen-marks ref inside ScribbleOverlays**

At the top of WhiteboardCanvas.tsx imports:

```tsx
import { strokeOutline, tickSpine, highlightBand } from '@/lib/tutor/whiteboard/hand-stroke';
```

(`drawOnEnabled` is already imported for the Phase-1 wiring.)

Inside `ScribbleOverlays`, next to its existing refs:

```tsx
  // Phase 2: animate each mark on ONCE (WAAPI on the mark's <g>). Marks
  // re-render whenever the scribbles array changes; the seen-set keys on
  // the mark's content seed so re-renders never replay. Kill-recovery
  // removes the scribble command entirely → the node unmounts with its
  // animation — no finishAll wiring needed (unlike items, marks cannot
  // outlive their command).
  const seenMarkSeedsRef = useRef<Set<string>>(new Set());
  const handMarks = drawOnEnabled();
  const animateMark = (el: SVGGElement | null, seed: string) => {
    if (!el || !handMarks || seenMarkSeedsRef.current.has(seed)) return;
    seenMarkSeedsRef.current.add(seed);
    el.animate(
      [
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
      ],
      { duration: 400, easing: 'ease-out', fill: 'backwards' },
    );
  };
```

- [ ] **Step 2: Branch the mark rendering**

In the scribbles map, compute the seed and replace the mark JSX. The existing code (post-a7c124a) computes `tickSize`, `half`, `tx`, `ty` with corner-anchor + clamps, and `isHighlight`/`r`. KEEP all of that math. Then:

```tsx
        const seed = `${s.targetFeature ?? s.target ?? 'mark'}`;

        let mark: React.ReactNode;
        if (isHighlight) {
          // Hand marker swipe when the flag is on and the region is
          // swipe-shaped; translucent rect otherwise (tall regions, flag off).
          const band = handMarks ? highlightBand(r, seed) : null;
          mark = band ? (
            <path d={strokeOutline(band.spine, band.width, seed)} fill={color} fillOpacity="0.3" stroke="none" />
          ) : (
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={color} fillOpacity="0.25" stroke="none" />
          );
        } else if (handMarks) {
          // Hand-drawn ✓: same spine geometry as the stroked path below,
          // rendered as two filled variable-width outlines (white halo
          // underneath for any-background readability — same rationale
          // as the dual-stroke version).
          const spine = tickSpine(tx, ty, tickSize);
          const inner = Math.max(3, tickSize * 0.25);
          mark = (
            <g>
              <path d={strokeOutline(spine, inner + Math.max(2, tickSize * 0.14) + 2, `${seed}-halo`)} fill="#ffffff" opacity={0.95} stroke="none" />
              <path d={strokeOutline(spine, inner + 1.5, seed)} fill={color} stroke="none" />
            </g>
          );
        } else {
          // …existing dual-stroke tick path JSX stays here UNCHANGED…
        }
```

The final `return <g key={i}>{mark}</g>;` becomes:

```tsx
        return <g key={i} ref={(el) => animateMark(el, seed)}>{mark}</g>;
```

(With `handMarks` false, `animateMark` no-ops and the JSX is today's — byte-identical flag-off.)

- [ ] **Step 3: Verification battery**

Run: `npx tsc --noEmit && npm run test:hand-stroke && npm run test:draw-on && npm run test:process-tool-call && npx tsx scripts/test-tick-render.ts`
Expected: all green. test-tick-render still passes because the geometric tick block and its anchor formulas remain in the flag-off branch.

- [ ] **Step 4: Commit**

```bash
git add src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx
git commit -m "feat(tutor): SmoothDraw P2 — hand-stroke ticks/highlights with 400ms draw-on (flag-gated)"
```

---

### Task 3: PDF capture mirrors + tick-render gate update

**Files:**
- Modify: `src/lib/utils/export/whiteboard-capture.ts` — BOTH tick sites (search `Corner-outside anchor + clamps` — two occurrences) and both highlight `rect` branches directly above them.
- Modify: `scripts/test-tick-render.ts` — extend the static assertions.

**Interfaces:**
- Consumes (Task 1): `strokeOutline`, `tickSpine`, `highlightBand`. The flag: capture runs in the same browser session — reuse `drawOnEnabled()` from `@/app/tutor/components/whiteboard/useDrawOn` so PDFs match what the student saw.
- Produces: PDF marks identical in geometry to the live overlay for the same seed.

- [ ] **Step 1: Mirror the live branching at both capture sites**

At the top of whiteboard-capture.ts:

```ts
import { strokeOutline, tickSpine, highlightBand } from '@/lib/tutor/whiteboard/hand-stroke';
import { drawOnEnabled } from '@/app/tutor/components/whiteboard/useDrawOn';
```

At EACH of the two mark-drawing sites, the highlight branch becomes (using that site's own `rect`-building variables and `doc`/`document` + `setAttrs`/`addAttrs` conventions — repeat at both sites):

```ts
      const seed = `${(s as { targetFeature?: string; target?: string }).targetFeature ?? (s as { target?: string }).target ?? 'mark'}`;
      const band = drawOnEnabled() ? highlightBand({ x: rx, y: ry, w: rw, h: rh }, seed) : null;
      if (band) {
        const swipe = document.createElementNS(SVG_NS, 'path');
        setAttrs(swipe, { d: strokeOutline(band.spine, band.width, seed), fill: color, 'fill-opacity': '0.3', stroke: 'none' });
        group.appendChild(swipe);
      } else {
        const rect = document.createElementNS(SVG_NS, 'rect');
        setAttrs(rect, { x: rx, y: ry, width: rw, height: rh, fill: color, 'fill-opacity': '0.25', stroke: 'none' });
        group.appendChild(rect);
      }
```

And each tick site: keep the anchor/clamp math (`tx`, `ty`, `tickSize`, `half`, `inner`), then:

```ts
      if (drawOnEnabled()) {
        const spine = tickSpine(tx, ty, tickSize);
        const halo = document.createElementNS(SVG_NS, 'path');
        setAttrs(halo, { d: strokeOutline(spine, inner + Math.max(2, tickSize * 0.14) + 2, `${seed}-halo`), fill: '#ffffff', opacity: '0.95', stroke: 'none' });
        group.appendChild(halo);
        const handTick = document.createElementNS(SVG_NS, 'path');
        setAttrs(handTick, { d: strokeOutline(spine, inner + 1.5, seed), fill: color, stroke: 'none' });
        group.appendChild(handTick);
      } else {
        // …existing dual-stroke halo+tick path creation stays here UNCHANGED…
      }
```

(At the second site use `doc.createElementNS` and `addAttrs`, matching its local convention. Define `seed` at that site the same way from its scribble input.)

- [ ] **Step 2: Extend test-tick-render**

Append to the PDF-capture section of `scripts/test-tick-render.ts`:

```ts
// Phase-2 hand marks: both capture sites branch on drawOnEnabled() and
// consume the shared hand-stroke module, mirroring the live overlay.
expect(
    (captureSource.match(/drawOnEnabled\(\)/g) ?? []).length >= 4,
    'both PDF capture sites gate hand marks on drawOnEnabled() (tick + highlight each)',
);
expect(
    captureSource.includes("from '@/lib/tutor/whiteboard/hand-stroke'"),
    'PDF capture imports the shared hand-stroke module',
);
expect(
    wbSource.includes('tickSpine(tx, ty, tickSize)'),
    'live overlay builds the hand tick from the shared spine',
);
expect(
    wbSource.includes('seenMarkSeedsRef'),
    'live overlay animates each mark once (seed-keyed seen set)',
);
```

- [ ] **Step 3: Verification battery**

Run: `npx tsc --noEmit && npx tsx scripts/test-tick-render.ts && npm run test:hand-stroke && npm run test:process-tool-call`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils/export/whiteboard-capture.ts scripts/test-tick-render.ts
git commit -m "feat(tutor): SmoothDraw P2 — PDF capture mirrors hand-stroke marks (both sites)"
```

---

### Task 4: Verification-debt harness — barge-in mid-draw, resume reload, translucent settle

**Files:**
- Modify: `scripts/tutor-e2e/types.ts` — add `triggerDelayMs?: number` to `ScenarioTurn` and `reloadAfterTurn?: number` to `Scenario`.
- Modify: `scripts/tutor-e2e/run.ts` — honor both fields.
- Create: `scripts/tutor-e2e/scenarios/draw-on-verify-debt.ts`

**Interfaces:**
- Consumes: Phase-1 dev hooks (`__tutorForceFalseBargein` exists in page.tsx; `window.__tutorFinishDrawOn` exists when the flag is on), the existing resume flow (reload → "Continue lesson" overlay → `resumeContinue`).
- Produces: a repeatable gate for the three items Phase 1 left open.

- [ ] **Step 1: types.ts additions**

In `ScenarioTurn`: `triggerDelayMs?: number;` with doc comment "fire `trigger` this many ms AFTER `say` is dispatched (mid-turn triggers, e.g. barge-in while a render is drawing on); default = fire before `say` as today."
In `Scenario`: `reloadAfterTurn?: number;` with doc comment "after test turn N completes (0-based), hard-reload the page, click the Continue overlay if present, screenshot immediately and again after 3s — verifies resume boards render instantly (bulk-mount cap)."

- [ ] **Step 2: run.ts — delayed trigger**

In `runTurn`, replace the trigger block with:

```ts
      const fireTrigger = async () => {
        log(`trigger ${t.trigger}(${t.triggerArg ?? ''})`);
        await page.evaluate(({ trig, arg }) => (window as unknown as Record<string, (a?: string) => void>)[trig]?.(arg), { trig: t.trigger!, arg: t.triggerArg });
      };
      if (t.trigger && !t.triggerDelayMs) await fireTrigger();
      let delayedTrigger: Promise<void> | null = null;
      if (t.trigger && t.triggerDelayMs) {
        delayedTrigger = (async () => { await sleep(t.triggerDelayMs!); await fireTrigger(); })();
      }
```

…and `await delayedTrigger;` immediately after the existing `waitForTurn(...)` call inside the `if (t.say)` block.

- [ ] **Step 3: run.ts — reload/resume check**

After the test-turns loop (both the cooperative and fixed-turn branches converge before PDF export), add:

```ts
    if (typeof scenario.reloadAfterTurn === 'number') {
      log('resume check: hard reload');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof window.__tutorTestState === 'function', { timeout: 30_000 }).catch(() => null);
      await sleep(2000);
      const cont = page.getByRole('button', { name: /continue lesson/i }).first();
      if (await cont.isVisible().catch(() => false)) await cont.click();
      await shot('resume-immediate');
      await sleep(3000);
      await shot('resume-settled');
    }
```

(Note for the implementer: this appends two screenshots named `resume-immediate` / `resume-settled` to the bundle; the analysis compares them — the board must already be visually complete in `resume-immediate` modulo at most one item.)

- [ ] **Step 4: The scenario**

```ts
// scripts/tutor-e2e/scenarios/draw-on-verify-debt.ts
import type { Scenario } from '../types';

/**
 * Phase-1 carried verification debt (user delegated 2026-07-10):
 *  1. Translucent fills settle at design opacity (no flash/snap) — steer
 *     the brain to a CATALOG shaded figure, away from Desmos.
 *  2. Barge-in mid-draw fast-forwards animations (turn-end finishAll).
 *  3. Resume/reload renders the restored board instantly (bulk-mount cap).
 * Run with TUTOR_E2E_VIDEO=1; requires NEXT_PUBLIC_TUTOR_DRAW_ON=true.
 */
const scenario: Scenario = {
  name: 'draw-on-verify-debt',
  description: 'Translucent settle + barge-in mid-draw + resume instant board.',
  start: { subject: 'math', level: 'High School', topic: 'jee-math', lessonPlanId: 'evelyn.jee.coordinate-geometry.v1', studentName: 'Test Student' },
  seedTurns: [],
  testTurns: [
    {
      say: 'Show me a diagram of the inequality y is less than x plus 2, with the solution region shaded — a drawn diagram please, not a graphing calculator.',
      watchFor: 'Catalog inequality/shaded figure (NOT Desmos iframe); shaded region fades in and SETTLES at translucent design opacity — no flash-to-opaque, no snap at animation end.',
      timeoutMs: 150_000,
    },
    {
      say: 'Now draw the triangle with vertices at (0,0), (4,0) and (0,3) and mark the right angle.',
      trigger: '__tutorForceFalseBargein',
      triggerDelayMs: 9000,
      watchFor: 'Barge-in lands while the figure may still be drawing; all strokes must jump to complete instantly — no frozen half-drawn figure in subsequent frames.',
      timeoutMs: 150_000,
    },
  ],
  reloadAfterTurn: 1,
};

export default scenario;
```

- [ ] **Step 5: Commit the harness changes BEFORE running**

```bash
git add scripts/tutor-e2e/types.ts scripts/tutor-e2e/run.ts scripts/tutor-e2e/scenarios/draw-on-verify-debt.ts
git commit -m "test(tutor): SmoothDraw P2 — verification-debt scenario (translucent, barge-in mid-draw, resume)"
```

- [ ] **Step 6: Run once and analyze**

Run: `TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- draw-on-verify-debt`
Then: extract frames (fps=6, into the session scratchpad only) around (a) the shaded figure's settle — verify translucency is stable across the last ~1s of its animation window; (b) t≈9s into turn 2 — verify no half-drawn strokes persist in any later frame; (c) compare `resume-immediate` vs `resume-settled` screenshots — visually complete board immediately (≤1 item difference). If the brain STILL picks Desmos for turn 1, note it honestly: the translucent verdict then rides on whichever catalog fills appeared elsewhere in the run (the triangle turn's marks include translucent highlight fills if the brain scribbles).
Record all three verdicts with frame references in the report.

---

### Task 5: Phase-2 gate

**Files:** none (verification only).

- [ ] **Step 1: Full battery**

Run: `npm run test:hand-stroke && npm run test:draw-on && npm run test:feature-slug && npm run test:process-tool-call && npm run test:page-grouping && npm run test:board-map && npm run test:student-marks && npm run test:render-sync && npx tsx scripts/test-tick-render.ts && npx tsc --noEmit`
Expected: all green.

- [ ] **Step 2: Scribble-heavy e2e with video + perf budget**

Run: `TUTOR_E2E_VIDEO=1 npm run test:tutor-e2e -- ui-audit-visuals`
Gate: perf.json — non-input CLS ≤ 0.05; no long tasks >100ms inside render windows (post-session jsPDF tail excluded, per the Phase-1 finding). Scrub video at scribble moments: hand ticks draw on ~400ms, wobble visible but legible, halo intact on colored backgrounds.

- [ ] **Step 3: Round-7 regression**

Run: `npm run test:tutor-e2e -- round7-regression`
Gate: 0 anomalies; `grep -c MAX_VALIDATOR_RETRIES console.log` = 0.

- [ ] **Step 4: PDF spot-check**

Open the ui-audit-visuals bundle's session.pdf: any tick/highlight present must be the hand-stroke version and match the live screenshots' geometry.

- [ ] **Step 5: Hand to the user**

User live session judging: mark feel (wobble amount, halo, swipe highlights), plus anything Task 4 left inconclusive. Prod flag flip remains the user's call. Update the ledger + `project_tutor_wb_ui_audit_2026_07_10` memory with Phase-2 status.

---

## Self-review notes

- Spec §4 coverage: variable-width taper+wobble strokes (T1), seeded determinism (T1), live marks + 400ms draw-on (T2), PDF lockstep both sites (T3), tick anchor geometry preserved (T1 tickSpine + T2/T3 keeping anchor math). §2 interrupts for marks: adjudicated in T2 comment (marks die with their command; no finishAll needed). Carried debt → T4. Gates → T5.
- Type consistency: `Pt`, `strokeOutline(spine, baseWidth, seed): string`, `tickSpine(tx, ty, size): Pt[]`, `highlightBand(rect, seed): {spine, width} | null` used identically in T1/T2/T3; seed convention `targetFeature ?? target ?? 'mark'` identical in T2/T3.
- No placeholders; all code steps carry code.
