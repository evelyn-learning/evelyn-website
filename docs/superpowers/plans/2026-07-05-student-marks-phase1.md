# Student Whiteboard Marks — Phase 1 (Tap-to-Point) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Students tap anything on the whiteboard; the tap resolves semantically (item + feature) and reaches the brain as a `<student_marks>` block attached to their next turn (or standalone after ~4s idle).

**Architecture:** A tap listener on the WhiteboardCanvas page wrapper (plus thin overlays over the two iframe renderers) captures normalized points + candidate feature rects; a pure module resolves point→feature/item/page and formats the block; VoiceTutorRealtime buffers marks, attaches them in `callBrainOnce` (openingDirective pattern: client → route clamp → claude-brain twins), and idle-sends via `sendTextMessage`. One generic BASE_PROMPT clause teaches the brain the block. Spec: `docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md` (this plan = Phase 1 only; pen/ink = Phase 2, vision fallback = Phase 3).

**Tech Stack:** React 19 pointer events, WhiteboardCatalog feature registry, claude-brain SSE orchestrator, ts-node plain-assert tests.

## Global Constraints

- Flag `NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true'` — **default OFF** (new student-facing UX; pedagogy-opener precedent). Flag off ⇒ no listeners mounted, no handle method calls, brain request byte-identical.
- claude-brain engine only (the transport lives in `callBrainOnce`; other engines never see the buffer).
- Marks NEVER interrupt: no interaction with perception/cancel/kill/render-sync machinery. Buffer is read only at turn-start and idle-send.
- Idle-send: ~4000 ms after the last mark, only when the tutor is not speaking and no brain call is in flight; re-arm otherwise.
- Buffer cap 12 (oldest dropped + debug event).
- Prompt clause and formatter wording must be GENERIC — no topic-specific examples (`feedback_generic_prompts`).
- Taps on interactive elements (buttons/inputs/links) never register as marks.
- Route clamps `studentMarks` to ≤2000 chars (openingDirective precedent).
- Run `npx tsc --noEmit` after every code task; keep `npm run test:caption-sync`, `test:render-sync`, `test:recordings` green.

---

### Task 1: Pure module `student-marks.ts` + `test:student-marks` (TDD)

**Files:**
- Create: `src/lib/tutor/whiteboard/student-marks.ts`
- Create: `scripts/test-student-marks.ts`
- Modify: `package.json` (script next to `test:recordings`)

**Interfaces (produced — later tasks import exactly these):**

```ts
export interface CapturedRect {
  x: number; y: number; w: number; h: number;   // normalized to the page wrapper (0..1)
  itemIndex: number;                             // 1-based, matches data-wb-item-index
  itemId?: string;                               // data-wb-item-id when present
  feature?: string;                              // data-feature name; undefined = the item wrapper itself
}
export interface StudentMarkEvent {
  type: 'point';
  pageIndex: number;
  pageTitle?: string;
  point: { x: number; y: number };               // normalized to the page wrapper
  rects: CapturedRect[];
}
export interface ResolvedMark {
  kind: 'point';
  pageIndex: number;
  pageTitle?: string;
  itemIndex?: number;
  itemId?: string;
  feature?: string;
  point: { x: number; y: number };
}
export const MAX_PENDING_MARKS = 12;
export function resolvePointMark(ev: StudentMarkEvent): ResolvedMark;
export interface MarkLabels { featureLabel?: string; itemLabel?: string; }
export function formatStudentMarks(
  marks: ResolvedMark[],
  lookup: (mark: ResolvedMark) => MarkLabels | null,
): string;
```

- [ ] **Step 1: Write the failing test script**

Create `scripts/test-student-marks.ts`:

```ts
/**
 * Unit tests for student-marks resolution + formatting (Phase 1: points).
 * Run: npm run test:student-marks
 * Design: docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md
 */
import {
  resolvePointMark,
  formatStudentMarks,
  MAX_PENDING_MARKS,
  type CapturedRect,
  type StudentMarkEvent,
  type ResolvedMark,
} from '../src/lib/tutor/whiteboard/student-marks';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const item1: CapturedRect = { x: 0.1, y: 0.1, w: 0.8, h: 0.4, itemIndex: 1, itemId: 'showTable-1' };
const cell: CapturedRect = { x: 0.4, y: 0.2, w: 0.2, h: 0.05, itemIndex: 1, itemId: 'showTable-1', feature: 'cell-r2-c3' };
const row: CapturedRect = { x: 0.1, y: 0.2, w: 0.8, h: 0.05, itemIndex: 1, itemId: 'showTable-1', feature: 'row-2' };
const item2: CapturedRect = { x: 0.1, y: 0.6, w: 0.8, h: 0.3, itemIndex: 2, itemId: 'showEquation-1' };

function ev(x: number, y: number, rects: CapturedRect[]): StudentMarkEvent {
  return { type: 'point', pageIndex: 1, pageTitle: 'Practice', point: { x, y }, rects };
}

// ── resolution ────────────────────────────────────────────────────
{
  const r = resolvePointMark(ev(0.45, 0.22, [item1, row, cell, item2]));
  check('smallest containing feature wins (cell over row)', r.feature === 'cell-r2-c3' && r.itemIndex === 1);
}
{
  const r = resolvePointMark(ev(0.15, 0.22, [item1, row, cell, item2]));
  check('point in row but not cell resolves to row', r.feature === 'row-2');
}
{
  // 0.02 to the right of the cell rect edge — inside the near threshold
  const r = resolvePointMark(ev(0.62, 0.22, [item1, row, cell]));
  check('near-miss within threshold snaps to nearest feature', r.feature === 'row-2' || r.feature === 'cell-r2-c3');
}
{
  const r = resolvePointMark(ev(0.5, 0.45, [item1, row, cell, item2]));
  check('point in item but no feature → whole item', r.itemIndex === 1 && r.feature === undefined);
}
{
  const r = resolvePointMark(ev(0.95, 0.95, [item1, row, cell, item2]));
  check('point outside everything → page-only', r.itemIndex === undefined && r.feature === undefined);
  check('page metadata carried', r.pageIndex === 1 && r.pageTitle === 'Practice');
}
{
  const r = resolvePointMark(ev(0.5, 0.7, [item1, item2]));
  check('second item resolves by containment', r.itemIndex === 2 && r.itemId === 'showEquation-1');
}

// ── formatting ────────────────────────────────────────────────────
const mk = (over: Partial<ResolvedMark>): ResolvedMark => ({
  kind: 'point', pageIndex: 0, point: { x: 0.5, y: 0.5 }, ...over,
});
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 1, itemId: 'showTable-1', feature: 'row-2', pageTitle: 'States' })],
    () => ({ featureLabel: 'the "Compressibility" row', itemLabel: 'the comparison table' }),
  );
  check('feature wording', text === 'The student pointed at the "Compressibility" row of the comparison table (page 1, "States").');
}
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 2, itemId: 'showEquation-1' })],
    () => ({ itemLabel: 'the equation' }),
  );
  check('whole-item wording', text === 'The student pointed at the equation (page 1).');
}
{
  const text = formatStudentMarks([mk({})], () => null);
  check('page-only wording', text === 'The student pointed at empty space on page 1.');
}
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 3, itemId: 'gone-1', feature: 'step-2' })],
    () => null,
  );
  check('stale lookup degrades to page wording', text === 'The student pointed at something on page 1.');
}
{
  const a = mk({ itemIndex: 1, feature: 'row-2' });
  const text = formatStudentMarks([a, { ...a }, mk({ itemIndex: 2 })], (m) =>
    m.itemIndex === 1 ? { featureLabel: 'the second row', itemLabel: 'the table' } : { itemLabel: 'the graph' },
  );
  check('consecutive duplicate marks collapse to one line', text.split('\n').length === 2);
  check('distinct marks keep their own lines', text.includes('the graph'));
}
{
  check('MAX_PENDING_MARKS is 12', MAX_PENDING_MARKS === 12);
}

console.log(`\nstudent-marks: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Add npm script; verify failure**

In `package.json` next to `test:recordings`:

```json
"test:student-marks": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-student-marks.ts",
```

Run: `npm run test:student-marks` — Expected: FAIL, module not found.

- [ ] **Step 3: Implement the module**

Create `src/lib/tutor/whiteboard/student-marks.ts`:

```ts
/**
 * Student whiteboard marks — Phase 1 (tap-to-point) pure logic.
 *
 * The WhiteboardCanvas tap layer captures a normalized point plus the
 * bounding rects of every [data-feature] element and item wrapper on the
 * page; this module resolves the point to the most specific target
 * (smallest containing feature → nearest feature within a threshold →
 * containing item → page-only) and formats resolved marks into the
 * <student_marks> block the brain receives. Pure — rects in, words out —
 * so it unit-tests without DOM.
 *
 * Wording stays GENERIC (no topic interpolation beyond catalog labels):
 * feedback_generic_prompts.
 *
 * Design: docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md
 */

export interface CapturedRect {
  x: number;
  y: number;
  w: number;
  h: number;
  itemIndex: number;
  itemId?: string;
  /** data-feature name; undefined = the item wrapper itself. */
  feature?: string;
}

export interface StudentMarkEvent {
  type: 'point';
  pageIndex: number;
  pageTitle?: string;
  point: { x: number; y: number };
  rects: CapturedRect[];
}

export interface ResolvedMark {
  kind: 'point';
  pageIndex: number;
  pageTitle?: string;
  itemIndex?: number;
  itemId?: string;
  feature?: string;
  point: { x: number; y: number };
}

/** Pending-buffer cap; oldest marks drop beyond this (with a debug event). */
export const MAX_PENDING_MARKS = 12;

/** Snap distance (normalized page units) for near-miss taps. */
const NEAR_THRESHOLD = 0.03;

function contains(r: CapturedRect, p: { x: number; y: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

function edgeDistance(r: CapturedRect, p: { x: number; y: number }): number {
  const dx = Math.max(r.x - p.x, 0, p.x - (r.x + r.w));
  const dy = Math.max(r.y - p.y, 0, p.y - (r.y + r.h));
  return Math.hypot(dx, dy);
}

function area(r: CapturedRect): number {
  return r.w * r.h;
}

export function resolvePointMark(ev: StudentMarkEvent): ResolvedMark {
  const base: ResolvedMark = {
    kind: 'point',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: ev.point,
  };
  const features = ev.rects.filter((r) => r.feature);
  const items = ev.rects.filter((r) => !r.feature);

  // 1. Smallest feature rect containing the point.
  const containing = features.filter((r) => contains(r, ev.point));
  if (containing.length > 0) {
    const best = containing.reduce((a, b) => (area(b) < area(a) ? b : a));
    return { ...base, itemIndex: best.itemIndex, itemId: best.itemId, feature: best.feature };
  }
  // 2. Nearest feature within the snap threshold.
  let nearest: CapturedRect | null = null;
  let nearestDist = Infinity;
  for (const r of features) {
    const d = edgeDistance(r, ev.point);
    if (d < nearestDist) { nearest = r; nearestDist = d; }
  }
  if (nearest && nearestDist <= NEAR_THRESHOLD) {
    return { ...base, itemIndex: nearest.itemIndex, itemId: nearest.itemId, feature: nearest.feature };
  }
  // 3. Containing item wrapper (whole-item).
  const item = items.filter((r) => contains(r, ev.point))
    .reduce<CapturedRect | null>((a, b) => (a === null || area(b) < area(a) ? b : a), null);
  if (item) {
    return { ...base, itemIndex: item.itemIndex, itemId: item.itemId };
  }
  // 4. Page-only.
  return base;
}

export interface MarkLabels {
  featureLabel?: string;
  itemLabel?: string;
}

function sameTarget(a: ResolvedMark, b: ResolvedMark): boolean {
  return a.itemIndex === b.itemIndex && a.feature === b.feature && a.pageIndex === b.pageIndex;
}

/**
 * Render resolved marks as the <student_marks> body. `lookup` supplies
 * catalog-backed human labels; returning null (stale/unknown item)
 * degrades gracefully. Consecutive identical targets collapse (double-tap).
 */
export function formatStudentMarks(
  marks: ResolvedMark[],
  lookup: (mark: ResolvedMark) => MarkLabels | null,
): string {
  const lines: string[] = [];
  let prev: ResolvedMark | null = null;
  for (const mark of marks) {
    if (prev && sameTarget(prev, mark)) continue;
    prev = mark;
    const page = `page ${mark.pageIndex + 1}${mark.pageTitle ? `, "${mark.pageTitle}"` : ''}`;
    if (mark.itemIndex === undefined) {
      lines.push(`The student pointed at empty space on ${page}.`);
      continue;
    }
    const labels = lookup(mark);
    if (!labels || (!labels.featureLabel && !labels.itemLabel)) {
      lines.push(`The student pointed at something on ${page}.`);
      continue;
    }
    if (mark.feature && labels.featureLabel) {
      const of = labels.itemLabel ? ` of ${labels.itemLabel}` : '';
      lines.push(`The student pointed at ${labels.featureLabel}${of} (${page}).`);
    } else {
      lines.push(`The student pointed at ${labels.itemLabel ?? 'something'} (${page}).`);
    }
  }
  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests + typecheck**

Run: `npm run test:student-marks` — Expected: `student-marks: 14 passed, 0 failed`.
Run: `npx tsc --noEmit` — clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/whiteboard/student-marks.ts scripts/test-student-marks.ts package.json
git commit -m "feat(tutor): student-marks pure module — tap resolution + <student_marks> formatting"
```

---

### Task 2: Brain plumbing — claude-brain twins, route clamp, prompt clause

**Files:**
- Modify: `src/lib/tutor/voice/claude-brain.ts` (BrainTurnInput field ~line 81; block render at BOTH twin sites ~lines 965 and 1132 — grep `openingDirectiveBlock`)
- Modify: `src/app/api/tutor/brain/stream/route.ts` (field doc ~57, telemetry ~441, passthrough ~488 — grep `openingDirective` for all three)
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts` (new always-on clause in BASE_PROMPT, placed directly after Rule 15 — grep `Rule 15 —`)

**Interfaces:**
- Consumes: nothing from Task 1 (string in, block out).
- Produces: `BrainTurnInput.studentMarks?: string` → `<student_marks>` block; route accepts `body.studentMarks` (≤2000 chars). Task 3/4 rely on the exact field name `studentMarks`.

- [ ] **Step 1: claude-brain.ts — input field + block at both twins**

Next to the `openingDirective` field on the input interface:

```ts
  /** Student whiteboard marks (Phase 1: tap-to-point). One-per-line plain
   *  sentences produced by formatStudentMarks. Surfaces as a
   *  `<student_marks>` block in the turn's user content. Absent ⇒ block
   *  omitted ⇒ request byte-identical. */
  studentMarks?: string;
```

At EACH of the two `openingDirectiveBlock` build sites, add the sibling:

```ts
  const studentMarksBlock = input.studentMarks
    ? `<student_marks>\n${input.studentMarks}\n</student_marks>\n\n` : '';
```

and concatenate `studentMarksBlock +` directly after `openingDirectiveBlock +` in the same user-content assembly both times.

- [ ] **Step 2: route passthrough with clamp + telemetry**

Mirroring the three `openingDirective` sites in `src/app/api/tutor/brain/stream/route.ts`:

```ts
  /** Student whiteboard marks block body (tap-to-point). Clamped ≤2000
   *  chars. See BrainTurnInput.studentMarks. */
  studentMarks?: string;
```

```ts
      if (body.studentMarks) {
        console.log(`[student-marks] block attached (${String(body.studentMarks.length)} chars)`);
      }
```

```ts
          studentMarks:
            typeof body.studentMarks === 'string' && body.studentMarks.length <= 2000
              ? body.studentMarks
              : undefined,
```

(Place each exactly parallel to its openingDirective counterpart.)

- [ ] **Step 3: BASE_PROMPT clause**

Insert directly after the Rule 15 paragraph in `system-prompt-builder.ts`, as its own paragraph with blank lines around it. Use this text verbatim (deliberately generic — no topic-specific examples, per the repo's prompt rule):

```
**Student marks on the board.** A `<student_marks>` block in the student's turn lists where the student physically pointed on the whiteboard — their finger on the page. Treat it as part of the utterance: "this one" plus a mark on a feature MEANS that feature. Respond to the marked target by its name, connect it to what the student said, and answer about THAT target. Do not re-render the item they marked — it is already on the board; scribble against it if you need to point back. A mark on empty space or an unclear target is an invitation to ask what they meant. Never ignore a mark: the student physically reached out and touched the board.
```

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:student-marks` — green.

```bash
git add src/lib/tutor/voice/claude-brain.ts src/app/api/tutor/brain/stream/route.ts src/lib/tutor/ai/system-prompt-builder.ts
git commit -m "feat(tutor): <student_marks> brain plumbing — input field, route clamp, prompt clause"
```

---

### Task 3: WhiteboardCanvas tap capture — listener, ping, iframe overlays, dev hook

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx`

**Interfaces:**
- Consumes: `StudentMarkEvent`, `CapturedRect` types (Task 1).
- Produces: new optional prop `onStudentMark?: (ev: StudentMarkEvent) => void` — Task 4 wires it. Dev hook `window.__tutorTestTap(xFrac, yFrac)` (non-production only) runs the REAL tap path.

- [ ] **Step 1: Prop + tap capture on the page wrapper**

Read the file around the page wrapper (grep `wb-page-enter-forward`, ~line 855) and the component props. Add to the props interface:

```ts
  /** Student marks (Phase 1): fires on a resolved tap on the board. When
   *  absent, no listeners mount and behavior is byte-identical. */
  onStudentMark?: (ev: StudentMarkEvent) => void;
```

Import the types:

```ts
import type { StudentMarkEvent, CapturedRect } from '@/lib/tutor/whiteboard/student-marks';
```

Inside the component add refs/state + the capture logic:

```tsx
  // ── Student marks (Phase 1: tap-to-point) ──────────────────────────
  // Pointer-based tap detection on the page wrapper (bubble phase — taps
  // on interactive elements are filtered, scroll/drag is excluded by a
  // movement threshold). Coordinates + candidate rects are normalized to
  // the page wrapper so downstream resolution is pure math.
  const pageWrapperRef = useRef<HTMLDivElement | null>(null);
  const tapStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const [pings, setPings] = useState<{ id: number; x: number; y: number }[]>([]);
  const pingIdRef = useRef(0);

  const collectRects = useCallback((): CapturedRect[] => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper) return [];
    const wRect = wrapper.getBoundingClientRect();
    if (wRect.width === 0 || wRect.height === 0) return [];
    const out: CapturedRect[] = [];
    const norm = (r: DOMRect) => ({
      x: (r.left - wRect.left) / wRect.width,
      y: (r.top - wRect.top) / wRect.height,
      w: r.width / wRect.width,
      h: r.height / wRect.height,
    });
    wrapper.querySelectorAll<HTMLElement>('[data-wb-item-index]').forEach((itemEl) => {
      const itemIndex = parseInt(itemEl.getAttribute('data-wb-item-index') || '0', 10);
      if (!itemIndex) return;
      const itemId = itemEl.getAttribute('data-wb-item-id') || undefined;
      out.push({ ...norm(itemEl.getBoundingClientRect()), itemIndex, itemId });
      itemEl.querySelectorAll<HTMLElement>('[data-feature]').forEach((featEl) => {
        const feature = featEl.getAttribute('data-feature') || undefined;
        if (!feature) return;
        out.push({ ...norm(featEl.getBoundingClientRect()), itemIndex, itemId, feature });
      });
    });
    return out;
  }, []);

  const fireStudentTap = useCallback((clientX: number, clientY: number) => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper || !onStudentMark) return;
    const wRect = wrapper.getBoundingClientRect();
    if (wRect.width === 0 || wRect.height === 0) return;
    const point = { x: (clientX - wRect.left) / wRect.width, y: (clientY - wRect.top) / wRect.height };
    const id = ++pingIdRef.current;
    setPings((p) => [...p, { id, x: point.x, y: point.y }]);
    setTimeout(() => setPings((p) => p.filter((q) => q.id !== id)), 2000);
    onStudentMark({
      type: 'point',
      pageIndex: currentPage,
      pageTitle: pages[currentPage]?.title || undefined,
      point,
      rects: collectRects(),
    });
  }, [onStudentMark, collectRects, currentPage, pages]);

  const handleMarkPointerDown = useCallback((e: React.PointerEvent) => {
    tapStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, []);
  const handleMarkPointerUp = useCallback((e: React.PointerEvent) => {
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start || !onStudentMark) return;
    // Movement/duration thresholds: a scroll or drag is not a tap.
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) return;
    if (Date.now() - start.t > 600) return;
    // Interactive elements keep their own semantics — never a mark.
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"]')) return;
    fireStudentTap(e.clientX, e.clientY);
  }, [onStudentMark, fireStudentTap]);
```

Wire the page wrapper div (the one with `className={pageDir === 'forward' ? 'wb-page-enter-forward' : ...}`): add

```tsx
          ref={pageWrapperRef}
          onPointerDown={onStudentMark ? handleMarkPointerDown : undefined}
          onPointerUp={onStudentMark ? handleMarkPointerUp : undefined}
```

(NOTE: check whether that div already has a ref; if so, merge with a callback ref that sets both.)

- [ ] **Step 2: Ping rendering**

Inside the page wrapper (after the items, before the annotation strip), render:

```tsx
        {pings.map((p) => (
          <span
            key={p.id}
            className="wb-student-ping"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          />
        ))}
```

Add the CSS (next to the existing `wb-` animation styles — grep `wb-item-enter` to find where those styles live; if they're in a global css file, add there):

```css
.wb-student-ping {
  position: absolute;
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: -11px;
  border-radius: 9999px;
  border: 3px solid #2563eb;
  pointer-events: none;
  z-index: 20;
  animation: wb-student-ping-anim 1.8s ease-out forwards;
}
@keyframes wb-student-ping-anim {
  0% { transform: scale(0.4); opacity: 0.9; }
  55% { transform: scale(1.15); opacity: 0.75; }
  100% { transform: scale(1.6); opacity: 0; }
}
```

- [ ] **Step 3: Iframe overlays (Desmos/Ketcher whole-item taps)**

Pointer events over an iframe never reach the parent. In the item-wrapper render (BOTH the single-item branch at ~858 and the multi-item branch at ~885), for iframe-bearing renderers, add a transparent tap layer INSIDE the item wrapper div, after `<ScribbleOverlays .../>`:

```tsx
                    {onStudentMark && isIframeCommand(cmd) && (
                      <div
                        className="absolute inset-0 z-10"
                        onPointerDown={handleMarkPointerDown}
                        onPointerUp={handleMarkPointerUp}
                      />
                    )}
```

with the helper (module level):

```ts
// Desmos (showGraph / show_function_graph route) and Ketcher (showMolecule)
// render third-party iframes that swallow pointer events; a transparent
// layer above them restores tap-to-point at whole-item granularity. Their
// viewports are locked (DesmosGraphRenderer lockViewport), so intercepting
// pointer input does not remove student-facing interactivity.
function isIframeCommand(cmd: WhiteboardCommand): boolean {
  const a = (cmd as { action?: string }).action;
  return a === 'showGraph' || a === 'showMolecule';
}
```

In the single-item branch the variable is `renderableCommands[0]`, not `cmd` — adjust accordingly.

- [ ] **Step 4: Dev hook (real-path test tap)**

Next to the component's other effects:

```tsx
  // Dev/test hook: __tutorTestTap(xFrac, yFrac) simulates a student tap at
  // a page-relative position through the REAL capture path (rect
  // collection, resolution, ping, transport). NODE_ENV-guarded like the
  // page-level __tutorTest* hooks.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !onStudentMark) return;
    const w = window as unknown as { __tutorTestTap?: (x: number, y: number) => boolean };
    w.__tutorTestTap = (xFrac: number, yFrac: number) => {
      const wrapper = pageWrapperRef.current;
      if (!wrapper) return false;
      const r = wrapper.getBoundingClientRect();
      fireStudentTap(r.left + xFrac * r.width, r.top + yFrac * r.height);
      return true;
    };
    return () => { delete w.__tutorTestTap; };
  }, [onStudentMark, fireStudentTap]);
```

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:student-marks && npm run test:render-sync` — green.

```bash
git add src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx
git commit -m "feat(tutor): whiteboard tap capture — page tap listener, ping, iframe overlays, __tutorTestTap"
```

(If the ping CSS went into a separate css file, add it to the commit.)

---

### Task 4: Transport — flag, handle method, buffer, idle-send, turn attachment, wiring

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (flag const near `TUTOR_RENDER_SYNC` ~265; `RealtimeHandle` interface ~146; refs near `captionSyncRef`; `callBrainOnce` body-field assembly next to `openingDirective` ~6960 and the POST body that carries it; handle population `useEffect` ~11690)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (flag const next to `TUTOR_CAPTION_SYNC`; pass `onStudentMark` on the `<WhiteboardCanvas>` at ~291)

**Interfaces:**
- Consumes: `resolvePointMark`, `formatStudentMarks`, `MAX_PENDING_MARKS`, types (Task 1); `body.studentMarks` route field (Task 2); `onStudentMark` prop (Task 3).
- Produces: `RealtimeHandle.pushStudentMark(ev: StudentMarkEvent): void`.

- [ ] **Step 1: Flag + refs in VoiceTutorRealtime**

Next to `TUTOR_RENDER_SYNC` (~265):

```ts
// Student whiteboard marks (Phase 1, 2026-07-05): tap-to-point. Default
// OFF — new student-facing input surface. See student-marks design spec.
const TUTOR_STUDENT_MARKS =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true';
```

Imports:

```ts
import {
  resolvePointMark,
  formatStudentMarks,
  MAX_PENDING_MARKS,
  type StudentMarkEvent,
  type ResolvedMark,
} from '@/lib/tutor/whiteboard/student-marks';
```

Refs (near `captionSyncRef`):

```ts
  // Student marks (Phase 1): pending tap buffer + idle-send timer. Marks
  // NEVER interrupt anything — the buffer is read only at brain-turn start
  // (callBrainOnce) and by the idle-send below.
  const pendingStudentMarksRef = useRef<ResolvedMark[]>([]);
  const studentMarkIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

- [ ] **Step 2: Formatter lookup + buffer/idle logic**

Add near the other catalog-reading callbacks:

```ts
  // Catalog-backed labels for formatStudentMarks. Feature labels come from
  // the item's feature registry (same labels tutor_scribble resolves
  // against); item labels from the item's action + title. Null (stale id /
  // missing item) → the formatter degrades to page-level wording.
  const lookupMarkLabels = useCallback((mark: ResolvedMark) => {
    if (!mark.itemId) return mark.itemIndex !== undefined ? {} : null;
    const item = catalogRef.current.getItem(mark.itemId);
    if (!item) return null;
    const itemLabel = item.pageTitle
      ? `the ${getCommandTypeLabel(item.action)} ("${item.pageTitle}")`
      : `the ${getCommandTypeLabel(item.action)}`;
    if (!mark.feature) return { itemLabel };
    const feat = item.features.find((f) => f.canonical === mark.feature || f.labels?.includes(mark.feature!));
    return { itemLabel, featureLabel: feat ? `"${feat.labels?.[0] || feat.canonical}"` : `"${mark.feature}"` };
  }, []);

  // Format + drain the pending buffer. Returns undefined when empty.
  const drainStudentMarks = useCallback((): string | undefined => {
    const marks = pendingStudentMarksRef.current;
    if (marks.length === 0) return undefined;
    pendingStudentMarksRef.current = [];
    if (studentMarkIdleTimerRef.current) {
      clearTimeout(studentMarkIdleTimerRef.current);
      studentMarkIdleTimerRef.current = null;
    }
    return formatStudentMarks(marks, lookupMarkLabels);
  }, [lookupMarkLabels]);

  // Idle-send: fires ~4s after the last mark, ONLY when the tutor is not
  // speaking and no brain call is in flight; otherwise re-arms and checks
  // again. Sends through the existing bracketed context-injection path
  // (DrawPad precedent) so it flows as a normal student turn.
  const STUDENT_MARK_IDLE_MS = 4000;
  const armStudentMarkIdleSend = useCallback(() => {
    if (studentMarkIdleTimerRef.current) clearTimeout(studentMarkIdleTimerRef.current);
    studentMarkIdleTimerRef.current = setTimeout(() => {
      studentMarkIdleTimerRef.current = null;
      if (pendingStudentMarksRef.current.length === 0) return;
      const busy = stateRef.current === 'speaking' || brainCallInFlightRef.current;
      if (busy) { armStudentMarkIdleSend(); return; }
      const block = drainStudentMarks();
      if (block) {
        onDebugEvent?.('student_mark_idle_send', block.slice(0, 90));
        sendTextMessageRef.current?.(`[${block} Respond to what they are pointing at.]`);
      }
    }, STUDENT_MARK_IDLE_MS);
  }, [drainStudentMarks, onDebugEvent]);
```

IMPLEMENTATION NOTES for this step (verify against the actual file):
- `stateRef` — the engine state ref exists in the HOOK, not the component. In VoiceTutorRealtime use the component's mirror of voice state; grep for how `callBrainOnce`/kill paths check "tutor speaking" (e.g. a `voiceStateRef`, or `realtime.isSpeaking` mirrored into a ref). If only `realtime.state` state exists, add a one-line ref mirror next to the other realtime-fn ref wires (`speakTextRef` block ~10880): `const isSpeakingRef = useRef(false); isSpeakingRef.current = realtime.isSpeaking;` and use `isSpeakingRef.current`.
- `brainCallInFlightRef` — grep for the existing in-flight serialization ref used by `handleStudentTranscriptForBrain` (the "only one brain call in flight" mechanism, ~10280). Use THAT ref's actual name; if it's a boolean state, mirror it into a ref the same way.
- `getCommandTypeLabel` — already exists in WhiteboardCanvas; check if it's exported or duplicated in VoiceTutorRealtime. If neither, use `item.action` directly as the label (acceptable degradation; note it in your report).
- `sendTextMessageRef` — exists (~10880).

- [ ] **Step 3: Handle method**

`RealtimeHandle` interface (~146):

```ts
  /** Student marks (Phase 1): push a resolved-at-capture tap event from the
   *  whiteboard. Resolution + buffering + brain transport happen inside the
   *  engine. No-op when the flag is off or the engine is not claude-brain. */
  pushStudentMark: (ev: StudentMarkEvent) => void;
```

Handle population useEffect:

```ts
        pushStudentMark: (ev: StudentMarkEvent) => {
          if (!TUTOR_STUDENT_MARKS || !claudeBrainMode) return;
          const resolved = resolvePointMark(ev);
          const buf = pendingStudentMarksRef.current;
          buf.push(resolved);
          if (buf.length > MAX_PENDING_MARKS) {
            buf.shift();
            onDebugEvent?.('student_mark_dropped', 'buffer cap');
          }
          onDebugEvent?.(
            'student_mark',
            `${resolved.feature ?? (resolved.itemId ?? 'page')} p${resolved.pageIndex + 1}`,
          );
          armStudentMarkIdleSend();
        },
```

Add any new deps the effect now closes over (e.g. `armStudentMarkIdleSend`, `onDebugEvent`) to its dependency array.

- [ ] **Step 4: Turn attachment in callBrainOnce**

Directly after the `styleReminder` assembly (~6985), add:

```ts
        // Student marks (Phase 1): drain the pending tap buffer into a
        // <student_marks> block riding THIS turn. Flag off / empty buffer ⇒
        // field stays undefined ⇒ request byte-identical.
        const studentMarks = TUTOR_STUDENT_MARKS ? drainStudentMarks() : undefined;
```

Then find the brain POST body where `openingDirective` is sent (grep `openingDirective` in the fetch body construction below this point) and add `studentMarks,` alongside it.

NOTE: `callBrainOnce` is a long closure — confirm `drainStudentMarks` is declared BEFORE it in the component (move the Step-2 block above `callBrainOnce` if needed) and add it to `callBrainOnce`'s dependency array if it has one.

- [ ] **Step 5: TutorSession wiring**

Next to `TUTOR_CAPTION_SYNC`:

```ts
// Student whiteboard marks (Phase 1): tap-to-point. Default OFF.
const TUTOR_STUDENT_MARKS =
  process.env.NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true';
```

Import the type: `import type { StudentMarkEvent } from '@/lib/tutor/whiteboard/student-marks';`

In the component:

```ts
  const handleStudentMark = useCallback((ev: StudentMarkEvent) => {
    realtimeHandleRef.current?.pushStudentMark?.(ev);
  }, [realtimeHandleRef]);
```

On the `<WhiteboardCanvas>` in `boardEl` (~291):

```tsx
        onStudentMark={TUTOR_STUDENT_MARKS ? handleStudentMark : undefined}
```

- [ ] **Step 6: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:student-marks && npm run test:caption-sync && npm run test:render-sync && npm run test:recordings` — all green.

```bash
git add src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor/components/session/TutorSession.tsx
git commit -m "feat(tutor): student-marks transport — buffer, idle-send, <student_marks> turn attachment, flag"
```

---

### Task 5: Verification gate

**Files:** none; gates completion. Requires `NEXT_PUBLIC_TUTOR_STUDENT_MARKS=true` in `.env.local` for the live/harness checks (add it, gitignored; do NOT add to `.env.local.production` — ships dark until user sign-off).

- [ ] **Step 1: Full local gate**

Run: `npm run test:student-marks && npm run test:caption-sync && npm run test:render-sync && npm run test:recordings && npx tsc --noEmit`
Expected: all green.

- [ ] **Step 2: Harness round-trip**

Dev server on 3006 (RESTART it if it was already running — flag env + any TutorSession schema interplay need a fresh process). Run a claude-brain session via the e2e harness or manually with the browser console:
1. Start a session that renders at least one item.
2. `__tutorTestTap(0.5, 0.3)` → a blue ping appears; server log shows `[student-marks] block attached` on the NEXT student turn (send a typed message within 4s), OR after ~4s idle the `student_mark_idle_send` debug event fires and the tutor responds to the pointed target.
3. Verify the tutor's response actually references the marked feature/item.
4. Tap a button (e.g. a try-yourself choice) → NO mark registered (debug events clean).

- [ ] **Step 3: Live checklist (user, by hand)**

1. Tap a table cell while the tutor is talking → tutor finishes uninterrupted; your next utterance gets a response that references the cell.
2. Tap and stay silent → ~4s after the tutor goes quiet, it responds to the point.
3. Tap a Desmos graph → whole-item response ("the graph").
4. Mobile: tap works, scroll doesn't ping.
5. Flag off → no pings, no listeners, sessions byte-identical.

- [ ] **Step 4: Report honestly**

Failures return to their task; unverified boxes stay unchecked.
