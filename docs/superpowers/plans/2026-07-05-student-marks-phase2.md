# Student Whiteboard Marks — Phase 2 (Pen Tool) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Students draw freehand ink on the whiteboard; strokes classify geometrically (circle / underline / cross-out / arrow / ink) against board features and reach the brain through the Phase-1 `<student_marks>` pipeline; ink renders blue and fades after the tutor's next turn.

**Architecture:** Phase 1 (shipped, `main` d3cfc3e) built tap-to-point end to end. Phase 2 adds: a stroke event type + `classifyStroke` geometry + a `resolveStudentMark` dispatcher in the pure module; a pen mode in WhiteboardCanvas (capture overlay, scroll lock, live SVG ink, epoch-based fade); a pen ToolBtn in SessionStage with the mode owned by TutorSession; and the pretty-label polish (`getCommandTypeLabel` exported). Transport (buffer/idle-send/turn-attach) is untouched — new mark kinds ride the existing pipeline. Spec: `docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md` §Phase 2. Vision fallback for unresolved ink is Phase 3 — this phase reports unresolved ink textually ("drew something on page N").

**Tech Stack:** React pointer events + SVG polylines, pure geometry (no deps), existing student-marks pipeline.

## Global Constraints

- Everything stays behind `NEXT_PUBLIC_TUTOR_STUDENT_MARKS === 'true'` (default OFF) + claude-brain engine — same gates as Phase 1; flag off ⇒ byte-identical.
- Pen mode is explicit (ToolBtn toggle); while active, board scroll is LOCKED (`overflow-hidden` on the scroll container + `touch-action: none` on the capture overlay); exiting restores scroll.
- Marks never interrupt; transport untouched (no changes to buffer/idle-send/attach logic beyond the resolver dispatch).
- Ink strokes render blue (#2563eb family, matching the Phase-1 ping) and FADE after the tutor's next turn completes (epoch mechanism below); points keep their 2s self-fade.
- Formatter wording stays generic; classification heuristics are pure and unit-tested.
- Run `npx tsc --noEmit` after every code task; keep `test:student-marks`, `test:caption-sync`, `test:render-sync`, `test:recordings` green.
- Deliberate deferral: the spec's parenthetical pen-mode "idle timeout" auto-exit is NOT built this phase (manual toggle only); revisit with Phase-3 polish if live use shows students stranded in pen mode.

---

### Task 1: Pure module Phase 2 — stroke types, `classifyStroke`, dispatcher, formatter wordings (TDD)

**Files:**
- Modify: `src/lib/tutor/whiteboard/student-marks.ts`
- Modify: `scripts/test-student-marks.ts` (append Phase-2 blocks before the summary)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (ONE identifier: the handle's `pushStudentMark` currently calls `resolvePointMark(ev)`; once `StudentMarkEvent` becomes a union that call no longer type-checks — swap the import + call to `resolveStudentMark` IN THIS TASK so tsc stays green at every commit)

**Interfaces (produced):**

```ts
export interface PointMarkEvent {           // renamed shape of the Phase-1 event (type field narrows)
  type: 'point';
  pageIndex: number; pageTitle?: string;
  point: { x: number; y: number };
  rects: CapturedRect[];
}
export interface StrokeMarkEvent {
  type: 'stroke';
  pageIndex: number; pageTitle?: string;
  polyline: { x: number; y: number }[];     // normalized page coords, ≥2 points
  rects: CapturedRect[];
}
export type StudentMarkEvent = PointMarkEvent | StrokeMarkEvent;
export interface ResolvedMark {
  kind: 'point' | 'circle' | 'underline' | 'cross-out' | 'arrow' | 'ink';
  pageIndex: number; pageTitle?: string;
  itemIndex?: number; itemId?: string; feature?: string;   // primary target (arrow: the TO end)
  fromItemIndex?: number; fromItemId?: string; fromFeature?: string;  // arrow FROM end only
  point: { x: number; y: number };          // point marks: the tap; strokes: bbox center
}
export function classifyStroke(ev: StrokeMarkEvent): ResolvedMark;
export function resolveStudentMark(ev: StudentMarkEvent): ResolvedMark; // dispatcher: point→resolvePointMark, stroke→classifyStroke
// resolvePointMark, formatStudentMarks, MAX_PENDING_MARKS unchanged in signature;
// formatStudentMarks gains wordings for the new kinds.
```

Phase-1 code in `VoiceTutorRealtime.tsx` imports `resolvePointMark` and the old `StudentMarkEvent` shape — the union type is backward-compatible (the point arm is identical); Task 3 switches the call site to `resolveStudentMark`.

- [ ] **Step 1: Append the failing tests**

In `scripts/test-student-marks.ts`, add imports for `classifyStroke`, `resolveStudentMark`, and `type StrokeMarkEvent`; then append these blocks BEFORE the final `console.log` summary:

```ts
// ── Phase 2: stroke classification ─────────────────────────────────
function stroke(polyline: { x: number; y: number }[], rects: CapturedRect[]): StrokeMarkEvent {
  return { type: 'stroke', pageIndex: 1, pageTitle: 'Practice', polyline, rects };
}
function loopAround(cx: number, cy: number, r: number, n = 16): { x: number; y: number }[] {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * 0.6 * Math.sin(a) });
  }
  return pts;
}

// circle around the cell (cell center 0.5, 0.225)
{
  const m = classifyStroke(stroke(loopAround(0.5, 0.225, 0.13), [item1, row, cell, item2]));
  check('closed loop around a feature → circle on that feature', m.kind === 'circle' && m.feature === 'cell-r2-c3');
}
// closed loop enclosing nothing (empty corner)
{
  const m = classifyStroke(stroke(loopAround(0.93, 0.93, 0.04), [item1, row, cell, item2]));
  check('closed loop over empty space → circle, page-only', m.kind === 'circle' && m.itemIndex === undefined);
}
// underline: flat stroke just under the cell (cell bottom = 0.25)
{
  const pts = Array.from({ length: 10 }, (_, i) => ({ x: 0.41 + i * 0.019, y: 0.262 + (i % 2) * 0.004 }));
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('flat stroke under a feature → underline on it', m.kind === 'underline' && (m.feature === 'cell-r2-c3' || m.feature === 'row-2'));
}
// cross-out: zigzag back and forth across the cell
{
  const pts = [
    { x: 0.42, y: 0.21 }, { x: 0.58, y: 0.24 }, { x: 0.43, y: 0.22 },
    { x: 0.57, y: 0.21 }, { x: 0.44, y: 0.24 }, { x: 0.58, y: 0.22 },
  ];
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('zigzag over a feature → cross-out', m.kind === 'cross-out' && m.feature === 'cell-r2-c3');
}
// arrow: straight line from the cell down into item2
{
  const pts = Array.from({ length: 8 }, (_, i) => ({ x: 0.5 + i * 0.01, y: 0.22 + i * 0.07 }));
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('directional line feature→item → arrow with both ends', m.kind === 'arrow' && m.fromFeature === 'cell-r2-c3' && m.itemIndex === 2);
}
// open squiggle in empty space → ink, page-only
{
  const pts = [{ x: 0.91, y: 0.9 }, { x: 0.94, y: 0.93 }, { x: 0.92, y: 0.96 }];
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('unresolved squiggle → ink, page-only', m.kind === 'ink' && m.itemIndex === undefined);
}
// dispatcher routes both event types
{
  const p = resolveStudentMark(ev(0.45, 0.22, [item1, row, cell]));
  const s = resolveStudentMark(stroke(loopAround(0.5, 0.225, 0.13), [item1, row, cell]));
  check('resolveStudentMark dispatches point and stroke', p.kind === 'point' && s.kind === 'circle');
}

// ── Phase 2: formatter wordings ────────────────────────────────────
{
  const text = formatStudentMarks(
    [{ kind: 'circle', pageIndex: 0, point: { x: 0.5, y: 0.2 }, itemIndex: 1, itemId: 'showTable-1', feature: 'row-2' }],
    () => ({ featureLabel: 'the second row', itemLabel: 'the table' }),
  );
  check('circle wording', text === 'The student circled the second row of the table (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'cross-out', pageIndex: 0, point: { x: 0.5, y: 0.2 }, itemIndex: 1, feature: 'step-2' }],
    () => ({ featureLabel: 'step 2', itemLabel: 'the solution' }),
  );
  check('cross-out wording', text === 'The student crossed out step 2 of the solution (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'arrow', pageIndex: 0, point: { x: 0.5, y: 0.4 }, itemIndex: 2, itemId: 'showEquation-1', fromItemIndex: 1, fromItemId: 'showTable-1', fromFeature: 'row-2' }],
    (m) => (m.itemIndex === 2 ? { itemLabel: 'the equation' } : { featureLabel: 'the second row', itemLabel: 'the table' }),
  );
  check('arrow wording names both ends', text === 'The student drew an arrow from the second row of the table to the equation (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'ink', pageIndex: 2, point: { x: 0.9, y: 0.9 } }],
    () => null,
  );
  check('unresolved ink wording', text === 'The student drew something on page 3.');
}
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:student-marks` — Expected: FAIL (missing exports `classifyStroke`/`resolveStudentMark`).

- [ ] **Step 3: Implement**

In `src/lib/tutor/whiteboard/student-marks.ts`: rename the existing event interface to `PointMarkEvent` (keeping the exact fields), add:

```ts
export interface StrokeMarkEvent {
  type: 'stroke';
  pageIndex: number;
  pageTitle?: string;
  /** Normalized page coords, ≥2 points, capture order. */
  polyline: { x: number; y: number }[];
  rects: CapturedRect[];
}

export type StudentMarkEvent = PointMarkEvent | StrokeMarkEvent;
```

Extend `ResolvedMark` with the new kinds + arrow FROM fields per the interface block above. Add the geometry (below the point-resolution code):

```ts
// ── Phase 2: stroke classification ──────────────────────────────────
// Heuristic order: circle (closed loop) → cross-out (zigzag over a
// feature) → underline (flat stroke at a feature's baseline) → arrow
// (directional line with distinct ends) → ink (anything else). All
// thresholds are in normalized page units and deliberately forgiving —
// a misclassified shape still names the right TARGET, which is what the
// brain mostly needs.

interface BBox { x: number; y: number; w: number; h: number; }

function polyBBox(pts: { x: number; y: number }[]): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Direction reversals along the dominant axis — a zigzag scribble has many. */
function reversals(pts: { x: number; y: number }[], bb: BBox): number {
  const horizontal = bb.w >= bb.h;
  let count = 0;
  let lastSign = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = horizontal ? pts[i].x - pts[i - 1].x : pts[i].y - pts[i - 1].y;
    const sign = d > 0.004 ? 1 : d < -0.004 ? -1 : 0;
    if (sign !== 0 && lastSign !== 0 && sign !== lastSign) count++;
    if (sign !== 0) lastSign = sign;
  }
  return count;
}

function rectCenterIn(r: CapturedRect, bb: BBox): boolean {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return cx >= bb.x && cx <= bb.x + bb.w && cy >= bb.y && cy <= bb.y + bb.h;
}

/** Smallest feature whose center falls inside the bbox; else smallest
 *  containing item; else nothing. */
function targetForRegion(bb: BBox, rects: CapturedRect[]): CapturedRect | null {
  const feats = rects.filter((r) => r.feature && rectCenterIn(r, bb));
  if (feats.length > 0) return feats.reduce((a, b) => (area(b) < area(a) ? b : a));
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const items = rects.filter((r) => !r.feature && contains(r, center));
  if (items.length > 0) return items.reduce((a, b) => (area(b) < area(a) ? b : a));
  return null;
}

function targetAtPoint(p: { x: number; y: number }, rects: CapturedRect[]): CapturedRect | null {
  const feats = rects.filter((r) => r.feature && contains(r, p));
  if (feats.length > 0) return feats.reduce((a, b) => (area(b) < area(a) ? b : a));
  const items = rects.filter((r) => !r.feature && contains(r, p));
  if (items.length > 0) return items.reduce((a, b) => (area(b) < area(a) ? b : a));
  return null;
}

export function classifyStroke(ev: StrokeMarkEvent): ResolvedMark {
  const pts = ev.polyline;
  const bb = polyBBox(pts);
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const base: ResolvedMark = {
    kind: 'ink',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: center,
  };
  if (pts.length < 2) return base;
  const diag = Math.hypot(bb.w, bb.h);
  const withTarget = (kind: ResolvedMark['kind'], t: CapturedRect | null): ResolvedMark =>
    t
      ? { ...base, kind, itemIndex: t.itemIndex, itemId: t.itemId, feature: t.feature }
      : { ...base, kind };

  // 1. Circle: endpoints close relative to size, with real extent.
  const closed = diag > 0.03 && dist(pts[0], pts[pts.length - 1]) <= Math.max(0.03, diag * 0.25);
  if (closed) return withTarget('circle', targetForRegion(bb, ev.rects));

  // 2. Cross-out: many reversals scribbled over a feature.
  const rev = reversals(pts, bb);
  if (rev >= 3) {
    const t = targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects);
    if (t && t.feature) return withTarget('cross-out', t);
  }

  // 3. Underline: flat, wide stroke sitting at a feature's baseline —
  //    horizontally overlapping it and vertically at/just below its bottom.
  if (bb.h <= 0.03 && bb.w >= bb.h * 3) {
    let best: CapturedRect | null = null;
    let bestArea = Infinity;
    for (const r of ev.rects) {
      if (!r.feature) continue;
      const overlapX = Math.min(bb.x + bb.w, r.x + r.w) - Math.max(bb.x, r.x);
      if (overlapX < bb.w * 0.5) continue;
      const dy = center.y - (r.y + r.h);
      const inBottomBand = center.y >= r.y + r.h * 0.6 && center.y <= r.y + r.h;
      if ((dy >= -0.005 && dy <= 0.04) || inBottomBand) {
        if (area(r) < bestArea) { best = r; bestArea = area(r); }
      }
    }
    if (best) return withTarget('underline', best);
  }

  // 4. Arrow: direct stroke whose two ends land on different targets.
  if (rev <= 1 && diag >= 0.06) {
    const from = targetAtPoint(pts[0], ev.rects);
    const to = targetAtPoint(pts[pts.length - 1], ev.rects);
    if (from && to && (from.itemIndex !== to.itemIndex || from.feature !== to.feature)) {
      return {
        ...base,
        kind: 'arrow',
        itemIndex: to.itemIndex,
        itemId: to.itemId,
        feature: to.feature,
        fromItemIndex: from.itemIndex,
        fromItemId: from.itemId,
        fromFeature: from.feature,
      };
    }
  }

  // 5. Ink: keep the best available target for wording.
  return withTarget('ink', targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects));
}

export function resolveStudentMark(ev: StudentMarkEvent): ResolvedMark {
  return ev.type === 'point' ? resolvePointMark(ev) : classifyStroke(ev);
}
```

Extend `formatStudentMarks` — replace the line-building body so each kind gets its verb (keep the dedupe/collapse logic and the page suffix helper):

```ts
const VERBS: Record<ResolvedMark['kind'], string> = {
  point: 'pointed at',
  circle: 'circled',
  underline: 'underlined',
  'cross-out': 'crossed out',
  arrow: 'drew an arrow to',
  ink: 'drew near',
};

// inside the loop, replacing the point-specific wording:
    const verb = VERBS[mark.kind];
    if (mark.itemIndex === undefined) {
      lines.push(
        mark.kind === 'point'
          ? `The student pointed at empty space on ${page}.`
          : mark.kind === 'circle'
            ? `The student drew a circle on empty space on ${page}.`
            : `The student drew something on ${page}.`,
      );
      continue;
    }
    const labels = lookup(mark);
    if (!labels || (!labels.featureLabel && !labels.itemLabel)) {
      lines.push(`The student ${mark.kind === 'point' ? 'pointed at' : 'marked'} something on ${page}.`);
      continue;
    }
    const targetText = mark.feature && labels.featureLabel
      ? `${labels.featureLabel}${labels.itemLabel ? ` of ${labels.itemLabel}` : ''}`
      : (labels.itemLabel ?? 'something');
    if (mark.kind === 'arrow' && (mark.fromItemIndex !== undefined || mark.fromFeature)) {
      const fromLabels = lookup({ ...mark, kind: 'point', itemIndex: mark.fromItemIndex, itemId: mark.fromItemId, feature: mark.fromFeature });
      const fromText = fromLabels
        ? (mark.fromFeature && fromLabels.featureLabel
            ? `${fromLabels.featureLabel}${fromLabels.itemLabel ? ` of ${fromLabels.itemLabel}` : ''}`
            : (fromLabels.itemLabel ?? 'something'))
        : 'something';
      lines.push(`The student drew an arrow from ${fromText} to ${targetText} (${page}).`);
      continue;
    }
    lines.push(`The student ${verb} ${targetText} (${page}).`);
```

Also update `sameTarget` to include `kind` (a tap then a circle on the same feature are different gestures — both should surface):

```ts
function sameTarget(a: ResolvedMark, b: ResolvedMark): boolean {
  return a.kind === b.kind && a.itemIndex === b.itemIndex && a.feature === b.feature && a.pageIndex === b.pageIndex;
}
```

- [ ] **Step 4: Run tests + typecheck**

Also apply the Files-list VoiceTutorRealtime edit now: in the handle's `pushStudentMark`, change `resolvePointMark(ev)` to `resolveStudentMark(ev)` and update the import from `@/lib/tutor/whiteboard/student-marks` accordingly (drop `resolvePointMark` from the import if now unused there).

Run: `npm run test:student-marks` — Expected: `student-marks: 26 passed, 0 failed` (15 Phase-1 + 11 new).
Run: `npx tsc --noEmit` — clean (the dispatcher swap above is what keeps VoiceTutorRealtime compiling against the new union).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tutor/whiteboard/student-marks.ts scripts/test-student-marks.ts src/app/tutor/components/VoiceTutorRealtime.tsx
git commit -m "feat(tutor): student-marks Phase 2 geometry — classifyStroke + resolveStudentMark + stroke wordings"
```

---

### Task 2: WhiteboardCanvas pen mode — capture overlay, live ink, scroll lock, fade, dev hook

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx`
- Modify: `src/app/globals.css` (ink styles next to `.wb-student-ping`)

**Interfaces:**
- Consumes: `StrokeMarkEvent` type (Task 1).
- Produces: new optional props on WhiteboardCanvas:

```ts
  /** Phase 2 pen mode: while true, the board captures freehand strokes on a
   *  scroll-locking overlay and emits type:'stroke' events via onStudentMark. */
  penMode?: boolean;
  /** Bumped by the parent when a tutor turn completes; ink strokes created
   *  at an earlier epoch fade out. */
  inkEpoch?: number;
```

Plus dev hook `window.__tutorTestStroke(points: [number, number][])` (non-production, real path). Task 3 wires both props.

- [ ] **Step 1: Stroke state + capture overlay**

Read the Phase-1 student-marks region (grep `fireStudentTap`) and the page wrapper. Add state/refs next to the Phase-1 ones:

```tsx
  // ── Phase 2: pen mode (freehand ink) ────────────────────────────────
  // Strokes live at canvas level tagged with pageIndex + inkEpoch; they
  // render on their own page and fade once the tutor's next turn completes
  // (parent bumps inkEpoch). A stroke drawn while the tutor is mid-turn is
  // tagged one epoch ahead so the CURRENT turn's completion doesn't fade
  // it before the tutor ever saw it.
  interface InkStroke { id: number; pageIndex: number; polyline: { x: number; y: number }[]; epoch: number; fading?: boolean; }
  const [inkStrokes, setInkStrokes] = useState<InkStroke[]>([]);
  const strokeIdRef = useRef(0);
  const activeStrokeRef = useRef<{ x: number; y: number }[] | null>(null);
  const [liveStroke, setLiveStroke] = useState<{ x: number; y: number }[] | null>(null);
```

Capture handlers (same normalization pattern as `fireStudentTap`):

```tsx
  const penPoint = useCallback((clientX: number, clientY: number) => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper) return null;
    const r = wrapper.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
  }, []);

  const finishStroke = useCallback(() => {
    const pts = activeStrokeRef.current;
    activeStrokeRef.current = null;
    setLiveStroke(null);
    if (!pts || pts.length < 2 || !onStudentMark) return;
    const id = ++strokeIdRef.current;
    setInkStrokes((s) => [...s, {
      id,
      pageIndex: currentIndex,
      polyline: pts,
      epoch: (inkEpoch ?? 0) + (tutorBusy ? 1 : 0),
    }]);
    onStudentMark({
      type: 'stroke',
      pageIndex: currentIndex,
      pageTitle: safeCurrentPage?.title || undefined,
      polyline: pts,
      rects: collectRects(),
    });
  }, [onStudentMark, collectRects, currentIndex, safeCurrentPage, inkEpoch, tutorBusy]);

  const handlePenDown = useCallback((e: React.PointerEvent) => {
    const p = penPoint(e.clientX, e.clientY);
    if (!p) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    activeStrokeRef.current = [p];
    setLiveStroke([p]);
  }, [penPoint]);
  const handlePenMove = useCallback((e: React.PointerEvent) => {
    if (!activeStrokeRef.current) return;
    const p = penPoint(e.clientX, e.clientY);
    if (!p) return;
    const pts = activeStrokeRef.current;
    const last = pts[pts.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 0.004) return; // decimate
    pts.push(p);
    setLiveStroke([...pts]);
  }, [penPoint]);
  const handlePenUp = useCallback(() => { finishStroke(); }, [finishStroke]);
```

(Adapt `currentIndex` / `safeCurrentPage` to the ACTUAL Phase-1 variable names in the file — they were resolved there; reuse them.)

- [ ] **Step 2: Overlay + ink render inside the page wrapper**

Inside the page wrapper, after the Phase-1 pings block, add:

```tsx
        {/* Phase 2: ink strokes for THIS page + the in-progress stroke. */}
        {(inkStrokes.some((s) => s.pageIndex === currentIndex) || liveStroke) && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {inkStrokes.filter((s) => s.pageIndex === currentIndex).map((s) => (
              <polyline
                key={s.id}
                points={s.polyline.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')}
                className={s.fading ? 'wb-student-ink wb-student-ink-fading' : 'wb-student-ink'}
              />
            ))}
            {liveStroke && (
              <polyline points={liveStroke.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')} className="wb-student-ink" />
            )}
          </svg>
        )}
        {/* Phase 2: pen-mode capture overlay — blocks item interaction and
            (with touch-action none) touch scrolling while the pen is active. */}
        {penMode && onStudentMark && (
          <div
            className="absolute inset-0 z-20 cursor-crosshair"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePenDown}
            onPointerMove={handlePenMove}
            onPointerUp={handlePenUp}
            onPointerCancel={handlePenUp}
          />
        )}
```

NOTE: the `viewBox="0 0 100 100"` + `preserveAspectRatio="none"` pair makes the percent-scaled points fill the wrapper; stroke width must be set with `vector-effect: non-scaling-stroke` (in the CSS below) so ink doesn't distort.

- [ ] **Step 3: Scroll lock + fade effect**

Scroll lock — find the board scroll container (the `overflow-auto` div wrapping the page content; `scrollContainerRef` points at it). Apply conditionally:

```tsx
// on that div's className, replace the static overflow class:
className={`flex-1 ${penMode ? 'overflow-hidden' : 'overflow-auto'} ...rest unchanged`}
```

Fade — when `inkEpoch` advances past a stroke's epoch, mark it fading, remove after the transition:

```tsx
  useEffect(() => {
    if (inkEpoch === undefined) return;
    setInkStrokes((strokes) => {
      if (!strokes.some((s) => !s.fading && s.epoch < inkEpoch)) return strokes;
      return strokes.map((s) => (!s.fading && s.epoch < inkEpoch ? { ...s, fading: true } : s));
    });
    const t = setTimeout(() => {
      setInkStrokes((strokes) => strokes.filter((s) => !s.fading));
    }, 1300);
    return () => clearTimeout(t);
  }, [inkEpoch]);
```

CSS in `src/app/globals.css` next to `.wb-student-ping`:

```css
.wb-student-ink {
  fill: none;
  stroke: #2563eb;
  stroke-width: 2.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  opacity: 0.85;
}
.wb-student-ink-fading {
  opacity: 0;
  transition: opacity 1.2s ease-out;
}
```

- [ ] **Step 4: Dev hook**

Extend the Phase-1 dev-hook effect (same guard) with:

```tsx
    const wStroke = window as unknown as { __tutorTestStroke?: (pts: [number, number][]) => boolean };
    wStroke.__tutorTestStroke = (fracPts: [number, number][]) => {
      const wrapper = pageWrapperRef.current;
      if (!wrapper || fracPts.length < 2 || !onStudentMark) return false;
      activeStrokeRef.current = fracPts.map(([x, y]) => ({ x, y }));
      finishStroke();
      return true;
    };
```

and delete it in the same cleanup. Add `finishStroke` to the effect deps.

- [ ] **Step 5: Verify + commit**

Run: `npx tsc --noEmit` — clean. `npm run test:student-marks && npm run test:render-sync` — green.

```bash
git add src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx src/app/globals.css
git commit -m "feat(tutor): whiteboard pen mode — stroke capture overlay, live ink, scroll lock, epoch fade, __tutorTestStroke"
```

---

### Task 3: Pen ToolBtn, mode ownership, dispatcher switch, pretty labels, epoch plumbing

**Files:**
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (ToolBtn row ~line 308; props)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (pen state, epoch state, canvas + stage props)
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` (resolver dispatch + label polish)
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` (one-word change: export the label helper)

**Interfaces:**
- Consumes: `resolveStudentMark` (Task 1); `penMode`/`inkEpoch` props (Task 2).
- Produces: SessionStage props `boardPenActive?: boolean; onToggleBoardPen?: () => void`.

- [ ] **Step 1: SessionStage pen ToolBtn**

Add the two optional props to `SessionStageProps` (documented: "Phase 2 student marks — present only when the feature is enabled"). Destructure them. In the ToolBtn row (next to the existing Draw button at ~308), render conditionally:

```tsx
          {onToggleBoardPen && (
            <ToolBtn active={!!boardPenActive} title="Draw on the board" onClick={onToggleBoardPen}>
              <PenLine className="w-[18px] h-[18px]" />
            </ToolBtn>
          )}
```

Import `PenLine` from lucide-react (distinct from the scratch-pad `Pencil`).

- [ ] **Step 2: TutorSession — mode + epoch state, prop threading**

Next to the student-marks wiring from Phase 1:

```tsx
  // Phase 2: pen mode + ink-fade epoch. The epoch bumps when a tutor turn
  // completes (isProcessing falling edge) — strokes older than the current
  // epoch fade on the board.
  const [boardPenActive, setBoardPenActive] = useState(false);
  const [inkEpoch, setInkEpoch] = useState(0);
  const prevProcessingRef = useRef(false);
  useEffect(() => {
    if (prevProcessingRef.current && !isProcessing) setInkEpoch((e) => e + 1);
    prevProcessingRef.current = isProcessing;
  }, [isProcessing]);
  const studentMarksOn = TUTOR_STUDENT_MARKS && voiceEngine === 'claude-brain';
```

Refactor the Phase-1 gate to use `studentMarksOn` (it already computes the same expression inline). Thread:
- `<WhiteboardCanvas ... penMode={studentMarksOn && boardPenActive} inkEpoch={inkEpoch} />`
- `<SessionStage ... boardPenActive={boardPenActive} onToggleBoardPen={studentMarksOn ? () => setBoardPenActive(v => !v) : undefined} />`

(Verify `isProcessing` is the state TutorSession already holds for `tutorBusy` — grep `isProcessing` in the file; use the actual name.)

- [ ] **Step 3: VoiceTutorRealtime — pretty labels** (the dispatcher swap already landed in Task 1)

1. In `WhiteboardCanvas.tsx`, export the existing helper: `export function getCommandTypeLabel(...)` (one word).
2. In `VoiceTutorRealtime.tsx`, in `lookupMarkLabels`, replace the raw `item.action` label with the pretty label:

```ts
import { getCommandTypeLabel } from '@/app/tutor/components/whiteboard/WhiteboardCanvas';
// ...
    const pretty = getCommandTypeLabel(item.action).toLowerCase();
    const itemLabel = item.pageTitle
      ? `the ${pretty} ("${item.pageTitle}")`
      : `the ${pretty}`;
```

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit` — clean. All four suites green.

```bash
git add src/app/tutor/components/session/SessionStage.tsx src/app/tutor/components/session/TutorSession.tsx src/app/tutor/components/VoiceTutorRealtime.tsx src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx
git commit -m "feat(tutor): pen ToolBtn + mode/epoch wiring + stroke dispatcher + pretty mark labels"
```

---

### Task 4: Verification gate

**Files:** none. Dev flag `NEXT_PUBLIC_TUTOR_STUDENT_MARKS=true` already in `.env.local`; prod stays dark.

- [ ] **Step 1: Full local gate**

Run: `npm run test:student-marks && npm run test:caption-sync && npm run test:render-sync && npm run test:recordings && npx tsc --noEmit`
Expected: all green (student-marks 26).

- [ ] **Step 2: Driver round-trip (fresh dev server on 3006)**

RESTART the dev server (new code + flag). Drive a claude-brain session (browser console or a Playwright one-off like Phase 1's):
1. Start a session with a rendered item; open pen mode is NOT needed for the hook — `__tutorTestStroke([[0.35,0.15],[0.4,0.1],[0.55,0.1],[0.6,0.15],[0.6,0.25],[0.5,0.3],[0.38,0.25],[0.35,0.16]])` (a loop around the top item region) → blue ink renders; after ~4s idle the tutor should respond to a "circled" mark (check the `student_mark_idle_send` debug event wording says "circled").
2. Confirm the wording now uses the PRETTY item label (e.g. "the equation", not "the showEquation").
3. After the tutor's response completes, the ink fades out (~1.2s).
4. Pen ToolBtn: toggle on → drag draws (board doesn't scroll), toggle off → scroll restored.
5. Server log shows `[student-marks] block attached` when a stroke is followed by a typed message.

- [ ] **Step 3: Live checklist (user)**

1. Pen on (button next to Draw), circle something while talking — tutor references the circled target with your words.
2. Cross out a wrong step → tutor treats it as disagreement.
3. Underline a line of text → "underlined".
4. Mobile: pen on = finger draws (no scroll); pen off = scroll normal.
5. Ink fades after the tutor's reply; taps still ping as in Phase 1.

- [ ] **Step 4: Report honestly**

Failures return to their task; unverified boxes stay unchecked.
