# Student Whiteboard Marks — Phase 2b (Answer Gestures + Writing→Vision) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drawing an answer works: multi-stroke gestures group and classify (tick / cross-out / writing), handwriting OCRs through the existing vision endpoint, the brain reads silent marks after a question as the ANSWER, and ink lingers two tutor turns with a slow fade.

**Architecture:** Amendments to the approved spec (§Amendments, user-locked 2026-07-05) executed ON the existing `student-marks-phase2` branch. Capture gains a gesture grouper (1.2s quiet window) emitting multi-stroke events; the pure module gains `classifyGesture` with `tick`/`writing` kinds; VoiceTutorRealtime rasterizes writing gestures and OCRs them via `/api/tutor/extract-homework` (async, DrawPad precedent) before buffering; the prompt clause gains the answer-comprehension sentence; the ink fade threshold moves to epoch+2 with a 4s transition. Spec: `docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md` §Amendments.

**Tech Stack:** Existing pipeline; offscreen `<canvas>` rasterization; extract-homework vision endpoint (`{imageData, mimeType, subject, topic, level}` — VTR has subject/topic/level as props).

## Global Constraints

- Same gates as before: flag + claude-brain; flag off ⇒ byte-identical. Transport buffer/idle-send/turn-attach semantics unchanged except: a writing gesture's mark enters the buffer only when its OCR resolves (in-flight OCR that misses a turn rides the next one).
- Ink lifecycle: strokes fade when `inkEpoch >= stroke.epoch + 2`; fade transition 4s; removal ~4.3s after fade start. Points keep the 2s ping.
- Gesture quiet window 1200 ms; strokes of one gesture render as ink immediately as drawn (grouping delays only the EMIT, never the rendering).
- Classification: 1 stroke → existing `classifyStroke`; 2 strokes → tick (V-angle) or cross-out (crossing lines) or fall through to writing; ≥3 strokes → writing. Writing rasterizes bbox-cropped, white background, dark strokes, longest side ~640px.
- Prompt text generic (no topic examples).
- `npx tsc --noEmit` clean after every task; all four suites green.

---

### Task 1: Pure module — `classifyGesture`, tick/writing kinds, wordings (TDD)

**Files:**
- Modify: `src/lib/tutor/whiteboard/student-marks.ts`
- Modify: `scripts/test-student-marks.ts` (append before summary)

**Interfaces (produced):**

```ts
export interface GestureMarkEvent {
  type: 'gesture';
  pageIndex: number; pageTitle?: string;
  strokes: { x: number; y: number }[][];   // ≥1 polylines, capture order
  rects: CapturedRect[];
}
export type StudentMarkEvent = PointMarkEvent | StrokeMarkEvent | GestureMarkEvent;
// ResolvedMark.kind gains 'tick' | 'writing'; new optional field text?: string
// (filled by the OCR layer for kind 'writing'), plus strokesBBox?: BBoxLike
// {x,y,w,h} so the rasterizer can crop without re-deriving.
export function classifyGesture(ev: GestureMarkEvent): ResolvedMark;
// resolveStudentMark dispatches all three event types.
```

- [ ] **Step 1: Append failing tests**

```ts
// ── Phase 2b: gesture classification ───────────────────────────────
function gesture(strokes: { x: number; y: number }[][], rects: CapturedRect[]) {
  return { type: 'gesture' as const, pageIndex: 1, pageTitle: 'Practice', strokes, rects };
}
// single-stroke gesture defers to classifyStroke
{
  const m = classifyGesture(gesture([loopAround(0.5, 0.225, 0.13)], [item1, row, cell]));
  check('1-stroke gesture → classifyStroke path (circle)', m.kind === 'circle' && m.feature === 'cell-r2-c3');
}
// tick: short down-stroke + longer up-stroke forming a V over the cell
{
  const s1 = [{ x: 0.46, y: 0.21 }, { x: 0.49, y: 0.245 }];
  const s2 = [{ x: 0.49, y: 0.245 }, { x: 0.56, y: 0.205 }];
  const m = classifyGesture(gesture([s1, s2], [item1, row, cell]));
  check('2-stroke V over a feature → tick', m.kind === 'tick' && m.feature === 'cell-r2-c3');
}
// X: two crossing lines over the cell → cross-out
{
  const s1 = [{ x: 0.42, y: 0.205 }, { x: 0.58, y: 0.245 }];
  const s2 = [{ x: 0.58, y: 0.205 }, { x: 0.42, y: 0.245 }];
  const m = classifyGesture(gesture([s1, s2], [item1, row, cell]));
  check('2 crossing strokes over a feature → cross-out', m.kind === 'cross-out' && m.feature === 'cell-r2-c3');
}
// writing: 4 small strokes in a band → writing with bbox + target
{
  const strokes = [0, 1, 2, 3].map((i) => [
    { x: 0.42 + i * 0.04, y: 0.31 }, { x: 0.43 + i * 0.04, y: 0.35 }, { x: 0.44 + i * 0.04, y: 0.31 },
  ]);
  const m = classifyGesture(gesture(strokes, [item1, row, cell]));
  check('≥3 strokes → writing', m.kind === 'writing');
  check('writing carries strokesBBox', !!m.strokesBBox && m.strokesBBox.w > 0.1);
  check('writing targets the containing item', m.itemIndex === 1);
}
// ambiguous 2-stroke (parallel short lines, no V, no crossing) → writing
{
  const s1 = [{ x: 0.42, y: 0.31 }, { x: 0.5, y: 0.31 }];
  const s2 = [{ x: 0.42, y: 0.34 }, { x: 0.5, y: 0.34 }];
  const m = classifyGesture(gesture([s1, s2], [item1, row, cell]));
  check('unresolvable 2-stroke → writing fallback', m.kind === 'writing');
}
// dispatcher
{
  const g = resolveStudentMark(gesture([loopAround(0.5, 0.225, 0.13)], [item1, row, cell]));
  check('resolveStudentMark dispatches gesture', g.kind === 'circle');
}
// wordings
{
  const text = formatStudentMarks(
    [{ kind: 'tick', pageIndex: 0, point: { x: 0.5, y: 0.2 }, itemIndex: 1, feature: 'row-2' }],
    () => ({ featureLabel: 'the second row', itemLabel: 'the table' }),
  );
  check('tick wording', text === 'The student put a tick on the second row of the table (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'writing', pageIndex: 0, point: { x: 0.5, y: 0.3 }, itemIndex: 1, itemId: 'showTable-1', text: 'x^2 + y^2 = r^2' }],
    () => ({ itemLabel: 'the table' }),
  );
  check('writing wording carries the OCR text', text === 'The student wrote on the board near the table (page 1): "x^2 + y^2 = r^2"');
}
{
  const text = formatStudentMarks(
    [{ kind: 'writing', pageIndex: 0, point: { x: 0.5, y: 0.3 } }],
    () => null,
  );
  check('unreadable writing wording', text === 'The student wrote something on the board (page 1), but it could not be read.');
}
```

- [ ] **Step 2: Run to verify failure** — `npm run test:student-marks` FAILS (missing `classifyGesture`).

- [ ] **Step 3: Implement**

Add to `student-marks.ts`:

```ts
export interface GestureMarkEvent {
  type: 'gesture';
  pageIndex: number;
  pageTitle?: string;
  strokes: { x: number; y: number }[][];
  rects: CapturedRect[];
}
```

Extend the union + `ResolvedMark` (`kind` gains `'tick' | 'writing'`; add `text?: string; strokesBBox?: { x: number; y: number; w: number; h: number };`).

```ts
/** Angle at the junction of two strokes sharing an endpoint region —
 *  a tick is a short down-stroke meeting a longer up-stroke in a V. */
function isTick(a: { x: number; y: number }[], b: { x: number; y: number }[]): boolean {
  const join = dist(a[a.length - 1], b[0]) <= 0.03 || dist(a[a.length - 1], b[b.length - 1]) <= 0.03;
  if (!join) return false;
  const dirA = { x: a[a.length - 1].x - a[0].x, y: a[a.length - 1].y - a[0].y };
  const dirB = { x: b[b.length - 1].x - b[0].x, y: b[b.length - 1].y - b[0].y };
  // A tick's first leg heads DOWN (+y), second leg heads UP (−y).
  return dirA.y > 0.01 && dirB.y < -0.01;
}

function segIntersect(p1: {x:number;y:number}, p2: {x:number;y:number}, p3: {x:number;y:number}, p4: {x:number;y:number}): boolean {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function strokesCross(a: { x: number; y: number }[], b: { x: number; y: number }[]): boolean {
  return segIntersect(a[0], a[a.length - 1], b[0], b[b.length - 1]);
}

function combinedBBox(strokes: { x: number; y: number }[][]): BBox {
  return polyBBox(strokes.flat());
}

export function classifyGesture(ev: GestureMarkEvent): ResolvedMark {
  const { strokes } = ev;
  if (strokes.length === 1) {
    return classifyStroke({ type: 'stroke', pageIndex: ev.pageIndex, pageTitle: ev.pageTitle, polyline: strokes[0], rects: ev.rects });
  }
  const bb = combinedBBox(strokes);
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const target = targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects);
  const base: ResolvedMark = {
    kind: 'writing',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: center,
    strokesBBox: bb,
    ...(target ? { itemIndex: target.itemIndex, itemId: target.itemId, feature: target.feature } : {}),
  };
  if (strokes.length === 2) {
    const [a, b] = strokes;
    if (target?.feature && (isTick(a, b) || isTick(b, a))) return { ...base, kind: 'tick' };
    if (target?.feature && strokesCross(a, b)) return { ...base, kind: 'cross-out' };
  }
  return base; // ≥3 strokes, or unresolvable 2-stroke → writing (OCR upstream)
}
```

Dispatcher: `resolveStudentMark` adds the gesture arm. Formatter: `VERBS` gains `tick: 'put a tick on'`; `writing` gets its own branch BEFORE the generic path:

```ts
    if (mark.kind === 'writing') {
      const labels = mark.itemIndex !== undefined ? lookup(mark) : null;
      const near = labels?.featureLabel
        ? `${labels.featureLabel}${labels.itemLabel ? ` of ${labels.itemLabel}` : ''}`
        : labels?.itemLabel;
      lines.push(
        mark.text
          ? `The student wrote on the board${near ? ` near ${near}` : ''} (${page}): "${mark.text}"`
          : `The student wrote something on the board (${page}), but it could not be read.`,
      );
      continue;
    }
```

(Place after the empty-space branch, before the generic lookup path; `sameTarget` collapsing must NOT collapse two writings — `kind` is already compared, and two writings with different `text` should both surface: extend `sameTarget` to return false when either mark is `kind==='writing'`.)

- [ ] **Step 4: Run** — `npm run test:student-marks` → `37 passed, 0 failed` (26 + 11). `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `feat(tutor): gesture classification — tick / cross-out / writing kinds + wordings`

---

### Task 2: Canvas — gesture grouping + ink lifecycle (2 turns, slow fade)

**Files:**
- Modify: `src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `GestureMarkEvent` (Task 1).
- Produces: `onStudentMark` now emits `type:'gesture'` for pen strokes (never bare `'stroke'` — the single-stroke case rides a 1-polyline gesture). Tap path unchanged (`'point'`).

- [ ] **Step 1: Gesture grouping**

Replace the emit-per-stroke in `finishStroke` with gesture accumulation (read the current code first; keep ink rendering per stroke exactly as-is — grouping delays only the EMIT):

```tsx
  // Gesture grouping: strokes within GESTURE_QUIET_MS of each other form ONE
  // gesture (a tick = 2 strokes, handwriting = many). The group emits as a
  // single type:'gesture' event when the quiet window elapses. Ink renders
  // per stroke immediately — grouping never delays what the student sees.
  const GESTURE_QUIET_MS = 1200;
  const gestureStrokesRef = useRef<{ x: number; y: number }[][]>([]);
  const gestureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitGesture = useCallback(() => {
    gestureTimerRef.current = null;
    const strokes = gestureStrokesRef.current;
    gestureStrokesRef.current = [];
    if (strokes.length === 0 || !onStudentMark) return;
    onStudentMark({
      type: 'gesture',
      pageIndex: currentIndex,
      pageTitle: safeCurrentPage?.title || undefined,
      strokes,
      rects: collectRects(),
    });
  }, [onStudentMark, collectRects, currentIndex, safeCurrentPage]);
```

In `finishStroke`, replace the `onStudentMark({type:'stroke', ...})` call with:

```tsx
    gestureStrokesRef.current.push(pts);
    if (gestureTimerRef.current) clearTimeout(gestureTimerRef.current);
    gestureTimerRef.current = setTimeout(emitGesture, GESTURE_QUIET_MS);
```

(keep the ink-stroke state push exactly as-is). The discard effect (page nav / pen exit) must ALSO flush-or-drop the pending gesture — extend it to clear `gestureStrokesRef` + timer (DISCARD, consistent with the stroke discard); add unmount cleanup for the timer. Add `emitGesture`'s deps where needed.

- [ ] **Step 2: Ink lifecycle**

Fade threshold and duration per the amendment:
- In the fade effect: `s.epoch < inkEpoch` → `s.epoch + 2 <= inkEpoch`; removal timeout `1300` → `4300`.
- In `globals.css`: `.wb-student-ink-fading` transition `1.2s` → `4s`.

- [ ] **Step 3: Dev hook**

`__tutorTestStroke` currently finishes one stroke (now feeding the gesture buffer — good). Add `__tutorTestGesture(strokesArr)` that pushes N polylines and emits immediately:

```tsx
    const wGesture = window as unknown as { __tutorTestGesture?: (strokes: [number, number][][]) => boolean };
    wGesture.__tutorTestGesture = (strokes) => {
      if (!onStudentMark || strokes.length === 0) return false;
      gestureStrokesRef.current = strokes.map((s) => s.map(([x, y]) => ({ x, y })));
      emitGesture();
      return true;
    };
```

(cleanup alongside the others; note `__tutorTestStroke` now emits after the 1.2s quiet window — Task 4's driver must wait for it or use `__tutorTestGesture`.)

- [ ] **Step 4: Verify + commit** — tsc clean; suites green. `feat(tutor): gesture grouping window + 2-turn slow ink fade`

---

### Task 3: Transport — writing→OCR, answer-comprehension prompt

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx`
- Modify: `src/lib/tutor/ai/system-prompt-builder.ts`

**Interfaces:**
- Consumes: `resolveStudentMark` (already wired), `ResolvedMark.kind === 'writing'` + `strokesBBox`, extract-homework endpoint (`{imageData, mimeType, subject, topic, level}` — `subject`/`topic`/`level` are existing VTR props).

- [ ] **Step 1: Rasterizer + OCR in `pushStudentMark`**

Add a module-level helper (top of file region near other helpers, or adjacent to the student-marks block):

```ts
/** Rasterize a writing gesture for OCR: bbox-cropped strokes, white bg,
 *  dark ink, longest side ~640px. Returns a base64 PNG (no data: prefix). */
function rasterizeGestureStrokes(
  strokes: { x: number; y: number }[][],
  bbox: { x: number; y: number; w: number; h: number },
): string | null {
  const pad = 0.02;
  const bw = bbox.w + pad * 2;
  const bh = bbox.h + pad * 2;
  if (bw <= 0 || bh <= 0) return null;
  const scale = 640 / Math.max(bw, bh);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(32, Math.round(bw * scale));
  canvas.height = Math.max(32, Math.round(bh * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const stroke of strokes) {
    ctx.beginPath();
    stroke.forEach((p, i) => {
      const x = (p.x - bbox.x + pad) * scale;
      const y = (p.y - bbox.y + pad) * scale;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  return canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
}
```

In the handle's `pushStudentMark`, after `const resolved = resolveStudentMark(ev);`, branch:

```ts
          if (resolved.kind === 'writing' && ev.type === 'gesture' && resolved.strokesBBox) {
            // Async OCR (DrawPad precedent): the mark joins the buffer only
            // when the text resolves; failure degrades to the unreadable
            // wording. An OCR that misses this turn rides the next one.
            const imageData = rasterizeGestureStrokes(ev.strokes, resolved.strokesBBox);
            const enqueue = (mark: ResolvedMark) => {
              const buf = pendingStudentMarksRef.current;
              buf.push(mark);
              if (buf.length > MAX_PENDING_MARKS) {
                buf.shift();
                onDebugEvent?.('student_mark_dropped', 'buffer cap');
              }
              onDebugEvent?.('student_mark', `writing p${mark.pageIndex + 1} "${(mark.text || '').slice(0, 40)}"`);
              armStudentMarkIdleSend();
            };
            if (!imageData) { enqueue(resolved); return; }
            void (async () => {
              try {
                const resp = await fetch('/api/tutor/extract-homework', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ imageData, mimeType: 'image/png', subject, topic, level }),
                });
                const data = await resp.json();
                enqueue({ ...resolved, text: typeof data.extractedProblem === 'string' && data.extractedProblem ? data.extractedProblem : undefined });
              } catch {
                enqueue(resolved);
              }
            })();
            return;
          }
```

(The existing push/cap/debug/arm code stays for all other kinds. Keep declaration order valid — the branch uses `armStudentMarkIdleSend`, already in scope at the handle site.)

- [ ] **Step 2: Answer-comprehension prompt sentence**

In `system-prompt-builder.ts`, extend the existing `**Student marks on the board.**` paragraph — append these sentences at its end (verbatim, generic):

```
When you have just asked a question and the student's turn is marks with no words, the marks ARE the answer: a tick or circle on one of the things you offered means "this one" — evaluate that choice as their answer, right or wrong, instead of describing what they marked. Text the student wrote on the board is exactly as if they had said it aloud.
```

- [ ] **Step 3: Verify + commit** — tsc clean; suites green. `feat(tutor): writing gestures OCR to text; marks-after-question read as answers`

---

### Task 4: Verification gate

- [ ] **Step 1: Full local gate** — all four suites + tsc (student-marks 37).
- [ ] **Step 2: Driver round-trip** (fresh dev server): use `__tutorTestGesture` with 4 short strokes spelling a simple shape near an item → debug event `student_mark | writing … "<OCR text>"`; idle-send wording contains `wrote on the board`; the tutor responds to the CONTENT. Then a 2-stroke V over a feature → `tick` classification. Confirm ink persists through the tutor's acknowledging turn (screenshot) and fades after the second.
- [ ] **Step 3: Live checklist (user)**: write an actual answer in ink → tutor treats it as the spoken answer; tick an option after a question → evaluated as a choice; ink survives the acknowledgment and fades slowly after the following turn.
- [ ] **Step 4: Report honestly.**
