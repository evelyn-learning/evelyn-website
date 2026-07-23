# Q-pin Collapse + Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The tutor-question Q-pin auto-collapses to a small docked `Q` chip a few seconds after the tutor finishes speaking, and the expanded pin is draggable (mouse + touch), so it stops covering whiteboard ink for the whole turn.

**Architecture:** All new behavior lives in `SessionStage.tsx`, which already owns pin placement and already receives `voiceState` (the tutor-speaking signal). Pure, testable logic (drag threshold, collapse-deadline precedence, position clamping) is extracted to a new `src/lib/tutor/qpin-behavior.ts` module tested by a standalone `scripts/test-*.ts` script (repo convention — no jest/vitest here). `TutorSession.tsx` changes only by passing one new prop (`questionPinKey`, the pin's turn id) so SessionStage can reset per-turn state.

**Tech Stack:** Next.js/React 18 client components, Tailwind classes, pointer events. Tests: plain `npx tsx` scripts with a pass/fail counter (see `scripts/test-question-gist-text.ts` for the house style).

**Spec:** `docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md`

## Global Constraints

- Collapse trigger: tutor-finished-speaking **+ 6s**; hard fallback **15s** after pin-show (whichever is earlier).
- Drag/tap threshold: **5px** pointer movement.
- Chip: docked in the existing top-right tools cluster, hit target ≥ **40×40px**.
- Custom pin position: fractional (x%, y% of stage), session-lifetime only (React state, not persisted), re-clamped on window resize.
- ✕ keeps its existing meaning (dismiss for the turn, no chip); tap-pin-opens-transcript and Enter/Space activation must keep working.
- Mobile: pointer events + `touch-action: none` on the pin wrapper only (never the board); no hover-required affordances.
- The hiccup pin (board-bottom) is untouched.
- Engine repo (`/Users/luke/Dev/evelynlearning`), work on `main`, TypeScript must pass `npx tsc --noEmit`.

---

### Task 1: Pure behavior module (`qpin-behavior.ts`) + tests

**Files:**
- Create: `src/lib/tutor/qpin-behavior.ts`
- Create: `scripts/test-qpin-behavior.ts`
- Modify: `package.json` (add `test:qpin` script next to `test:question-gist-text`)

**Interfaces:**
- Produces (Tasks 2–3 import these exact names from `@/lib/tutor/qpin-behavior`):
  - `exceedsDragThreshold(dx: number, dy: number): boolean`
  - `qpinCollapseDeadline(shownAt: number, speechEndedAt: number | null): number`
  - `clampQpinFraction(pos: QpinFraction, stage: {width: number; height: number}, pin: {width: number; height: number}): QpinFraction`
  - `interface QpinFraction { x: number; y: number }` (fractions of stage size, top-left corner of the pin)
  - Constants: `QPIN_DRAG_THRESHOLD_PX = 5`, `QPIN_POST_SPEECH_MS = 6000`, `QPIN_HARD_CAP_MS = 15000`, `QPIN_TOP_MIN_PX = 60`, `QPIN_BOTTOM_RESERVED_PX = 96`, `QPIN_SIDE_PX = 8`

- [ ] **Step 1: Write the failing test**

Create `scripts/test-qpin-behavior.ts`:

```ts
/**
 * Unit tests for Q-pin collapse/drag behavior helpers (2026-07-23 spec:
 * docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md).
 *
 * Run: npx tsx scripts/test-qpin-behavior.ts
 */
import {
  exceedsDragThreshold,
  qpinCollapseDeadline,
  clampQpinFraction,
  QPIN_POST_SPEECH_MS,
  QPIN_HARD_CAP_MS,
  QPIN_TOP_MIN_PX,
  QPIN_BOTTOM_RESERVED_PX,
  QPIN_SIDE_PX,
} from '../src/lib/tutor/qpin-behavior';

let pass = 0;
let fail = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${ok ? '' : `  — got: ${JSON.stringify(got)}  want: ${JSON.stringify(want)}`}`);
  if (ok) pass++; else fail++;
}

// --- exceedsDragThreshold ---------------------------------------------
check('4px straight move is a tap', exceedsDragThreshold(4, 0), false);
check('exactly 5px is still a tap (strict >)', exceedsDragThreshold(5, 0), false);
check('6px straight move is a drag', exceedsDragThreshold(6, 0), true);
check('diagonal 4,4 (~5.7px) is a drag', exceedsDragThreshold(4, 4), true);
check('negative deltas use magnitude', exceedsDragThreshold(-6, 0), true);

// --- qpinCollapseDeadline ---------------------------------------------
const T0 = 1_000_000;
check('speech ended → end + 6s', qpinCollapseDeadline(T0, T0 + 2000), T0 + 2000 + QPIN_POST_SPEECH_MS);
check('no speech-end signal → hard cap 15s', qpinCollapseDeadline(T0, null), T0 + QPIN_HARD_CAP_MS);
check(
  'late speech end (14s) → capped at 15s',
  qpinCollapseDeadline(T0, T0 + 14_000),
  T0 + QPIN_HARD_CAP_MS,
);
check(
  'speech ended before show (re-expand while silent) → shownAt + 6s',
  qpinCollapseDeadline(T0, T0),
  T0 + QPIN_POST_SPEECH_MS,
);

// --- clampQpinFraction ------------------------------------------------
const STAGE = { width: 1000, height: 800 };
const PIN = { width: 400, height: 60 };

check(
  'in-bounds position unchanged',
  clampQpinFraction({ x: 0.3, y: 0.5 }, STAGE, PIN),
  { x: 0.3, y: 0.5 },
);
check(
  'left overflow clamps to side gutter',
  clampQpinFraction({ x: -0.5, y: 0.5 }, STAGE, PIN),
  { x: QPIN_SIDE_PX / STAGE.width, y: 0.5 },
);
check(
  'right overflow clamps so pin stays fully visible',
  clampQpinFraction({ x: 0.99, y: 0.5 }, STAGE, PIN),
  { x: (STAGE.width - PIN.width - QPIN_SIDE_PX) / STAGE.width, y: 0.5 },
);
check(
  'top overflow clamps below the floating header band',
  clampQpinFraction({ x: 0.3, y: 0 }, STAGE, PIN),
  { x: 0.3, y: QPIN_TOP_MIN_PX / STAGE.height },
);
check(
  'bottom overflow clamps above the floating tutor bar band',
  clampQpinFraction({ x: 0.3, y: 1 }, STAGE, PIN),
  { x: 0.3, y: (STAGE.height - PIN.height - QPIN_BOTTOM_RESERVED_PX) / STAGE.height },
);
check(
  'degenerate tiny stage: min bounds win (no NaN/negative)',
  clampQpinFraction({ x: 0.5, y: 0.5 }, { width: 100, height: 100 }, PIN),
  { x: QPIN_SIDE_PX / 100, y: QPIN_TOP_MIN_PX / 100 },
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/luke/Dev/evelynlearning && npx tsx scripts/test-qpin-behavior.ts`
Expected: FAIL — `Cannot find module '../src/lib/tutor/qpin-behavior'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/tutor/qpin-behavior.ts`:

```ts
/**
 * Q-pin collapse/drag behavior — pure helpers, unit-tested by
 * scripts/test-qpin-behavior.ts. Spec:
 * docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md
 */

/** Pointer must move MORE than this (px, euclidean) before a press counts as a drag. */
export const QPIN_DRAG_THRESHOLD_PX = 5;
/** Collapse this long after the tutor finishes speaking the ask. */
export const QPIN_POST_SPEECH_MS = 6000;
/** Collapse no later than this after the pin appears (covers a missing TTS-end signal). */
export const QPIN_HARD_CAP_MS = 15000;

// Reserved bands inside the stage (px) the dragged pin may not enter: the
// floating header (top) and the floating caption+dock bar (bottom), plus a
// small side gutter. The stage rect already includes iOS safe-area insets
// (the stage root is `fixed inset-0`).
export const QPIN_TOP_MIN_PX = 60;
export const QPIN_BOTTOM_RESERVED_PX = 96;
export const QPIN_SIDE_PX = 8;

/** Pin top-left corner as fractions of the stage size — survives resizes/rotation. */
export interface QpinFraction {
  x: number;
  y: number;
}

export function exceedsDragThreshold(dx: number, dy: number): boolean {
  return Math.hypot(dx, dy) > QPIN_DRAG_THRESHOLD_PX;
}

/**
 * Absolute epoch-ms deadline for auto-collapse. speechEndedAt is null while
 * the tutor is still speaking (or the signal never arrived) — then only the
 * hard cap applies. The cap also bounds a very late speech-end.
 */
export function qpinCollapseDeadline(shownAt: number, speechEndedAt: number | null): number {
  const cap = shownAt + QPIN_HARD_CAP_MS;
  if (speechEndedAt === null) return cap;
  return Math.min(speechEndedAt + QPIN_POST_SPEECH_MS, cap);
}

export function clampQpinFraction(
  pos: QpinFraction,
  stage: { width: number; height: number },
  pin: { width: number; height: number },
): QpinFraction {
  const minX = QPIN_SIDE_PX;
  const maxX = Math.max(minX, stage.width - pin.width - QPIN_SIDE_PX);
  const minY = QPIN_TOP_MIN_PX;
  const maxY = Math.max(minY, stage.height - pin.height - QPIN_BOTTOM_RESERVED_PX);
  const px = Math.min(Math.max(pos.x * stage.width, minX), maxX);
  const py = Math.min(Math.max(pos.y * stage.height, minY), maxY);
  return { x: px / stage.width, y: py / stage.height };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scripts/test-qpin-behavior.ts`
Expected: PASS ×15, `15 passed, 0 failed`, exit 0

- [ ] **Step 5: Add the npm script**

In `package.json`, directly after the `"test:question-gist-text"` line, add:

```json
    "test:qpin": "npx tsx scripts/test-qpin-behavior.ts",
```

Run: `npm run test:qpin` — Expected: same PASS output.

- [ ] **Step 6: Commit**

```bash
cd /Users/luke/Dev/evelynlearning
git add src/lib/tutor/qpin-behavior.ts scripts/test-qpin-behavior.ts package.json
git commit -m "feat(tutor): qpin-behavior helpers — drag threshold, collapse deadline, clamp"
```

---

### Task 2: Auto-collapse to chip (SessionStage + questionPinKey prop)

**Files:**
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (props ~line 63; state ~line 253; question-pin block ~lines 716–723; tools cluster ~lines 589–639)
- Modify: `src/app/tutor/components/session/TutorSession.tsx` (SessionStage call ~line 1117)

**Interfaces:**
- Consumes: `qpinCollapseDeadline`, `QPIN_POST_SPEECH_MS` from Task 1.
- Produces: new optional SessionStage props `questionPinKey?: string` (turn id of the current pin; undefined when no pin) — Task 3 builds on the same state names: `qpinMode`, `qpinShownAt`, `qpinSpeechEndedAt`, `qpinDragged`, `setQpinMode`, `setQpinShownAt`, `setQpinSpeechEndedAt`, `setQpinDragged`.
- Note: `voiceState` is ALREADY a SessionStage prop — `voiceState === 'speaking'` is the tutor-speaking signal; no new speaking prop is needed.

- [ ] **Step 1: Add the prop**

In `SessionStageProps` (next to `questionPin?: ReactNode;` ~line 63) add:

```ts
  /** Turn id of the current question pin — resets collapse/drag state per turn. */
  questionPinKey?: string;
```

Destructure `questionPinKey` alongside `questionPin` (~line 176).

In `TutorSession.tsx` at the SessionStage call (line 1117), add below `questionPin={questionPinEl}`:

```tsx
        questionPinKey={questionPinEl && questionPin ? questionPin.turnId : undefined}
```

- [ ] **Step 2: Add collapse state + timers in SessionStage**

Next to the existing state (~line 253):

```tsx
  // ===== Q-pin collapse/drag (2026-07-23 spec) — the expanded pin auto-
  // collapses to a docked chip after speech-end + 6s (15s hard cap), so it
  // stops covering top-of-board ink for the whole turn. =====
  const [qpinMode, setQpinMode] = useState<'expanded' | 'chip'>('expanded');
  const [qpinShownAt, setQpinShownAt] = useState(0);
  const [qpinSpeechEndedAt, setQpinSpeechEndedAt] = useState<number | null>(null);
  const [qpinDragged, setQpinDragged] = useState(false); // deliberate placement → no auto-collapse this turn

  // New turn's pin → back to expanded at the default/custom spot.
  useEffect(() => {
    if (!questionPinKey) return;
    setQpinMode('expanded');
    setQpinDragged(false);
    setQpinShownAt(Date.now());
    setQpinSpeechEndedAt(voiceState !== 'speaking' ? Date.now() : null);
    // voiceState deliberately not a dep: only the pin's identity resets the cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionPinKey]);

  // Stamp the moment the tutor stops speaking (starts the +6s countdown).
  useEffect(() => {
    if (!questionPinKey || qpinSpeechEndedAt !== null) return;
    if (voiceState !== 'speaking') setQpinSpeechEndedAt(Date.now());
  }, [voiceState, questionPinKey, qpinSpeechEndedAt]);

  // Schedule the collapse.
  useEffect(() => {
    if (!questionPin || !questionPinKey || qpinMode !== 'expanded' || qpinDragged) return;
    const deadline = qpinCollapseDeadline(qpinShownAt, qpinSpeechEndedAt);
    const t = window.setTimeout(() => setQpinMode('chip'), Math.max(0, deadline - Date.now()));
    return () => window.clearTimeout(t);
  }, [questionPin, questionPinKey, qpinMode, qpinDragged, qpinShownAt, qpinSpeechEndedAt]);
```

Import at top of file: `import { qpinCollapseDeadline } from '@/lib/tutor/qpin-behavior';`
(Match the file's existing import alias style — check its other `@/` imports; if the file uses relative imports, use `../../../../lib/tutor/qpin-behavior`.)

- [ ] **Step 3: Gate the expanded pin + add the chip**

Change the question-pin block (~lines 716–723) to render only in expanded mode:

```tsx
      {questionPin && qpinMode === 'expanded' && (
        <div className={`absolute ${showSwitcher ? 'top-[100px]' : 'top-16'} left-1/2 -translate-x-1/2 z-20 max-w-[min(88vw,560px)]`}>
          {questionPin}
        </div>
      )}
```

In the tools cluster card (`flex flex-col` div at ~line 590), add as the LAST child of the column (after the `toolsOpen && (...)` block, inside the card), so the chip docks under the wrench rail:

```tsx
          {questionPin && qpinMode === 'chip' && (
            <button
              type="button"
              aria-label="Show the tutor's question"
              title="Show the tutor's question"
              onClick={() => {
                setQpinShownAt(Date.now());
                setQpinSpeechEndedAt(voiceState !== 'speaking' ? Date.now() : null);
                setQpinMode('expanded');
              }}
              className="ss-cap relative grid place-items-center w-9 h-9 rounded-xl bg-amber-400 text-white text-xs font-bold hover:bg-amber-500 after:absolute after:-inset-1 after:content-['']"
            >
              Q
            </button>
          )}
```

(The `after:-inset-1` pseudo-element extends the 36px visual button to a ~44px touch target without changing the rail's visual rhythm — the spec's ≥40px requirement.)

- [ ] **Step 4: Typecheck + tests**

Run: `cd /Users/luke/Dev/evelynlearning && npx tsc --noEmit`
Expected: no errors.
Run: `npm run test:qpin && npm run test:question-gist-text`
Expected: all PASS.

- [ ] **Step 5: Manual smoke (desktop)**

Start dev (`npm run dev`, port per repo default), open a tutor session, trigger a question turn. Verify: pin shows expanded → collapses to the amber `Q` chip under the wrench ~6s after speech ends (≤15s always); chip tap re-expands and it collapses again ~6s later; ✕ dismisses with NO chip for the rest of the turn; next tutor question shows expanded again.

- [ ] **Step 6: Commit**

```bash
git add src/app/tutor/components/session/SessionStage.tsx src/app/tutor/components/session/TutorSession.tsx
git commit -m "feat(tutor): Q-pin auto-collapses to a docked chip after speech-end + 6s"
```

---

### Task 3: Drag the expanded pin (pointer events, position memory, resize clamp)

**Files:**
- Modify: `src/app/tutor/components/session/SessionStage.tsx` (question-pin block from Task 2; state block from Task 2)

**Interfaces:**
- Consumes: `exceedsDragThreshold`, `clampQpinFraction`, `QpinFraction` from Task 1; `stageRef` (already exists, ~line 253, attached to the `fixed inset-0` stage root — the pin's absolute containing block); Task 2's state (`setQpinDragged`).
- Produces: nothing consumed later.

- [ ] **Step 1: Add drag state + handlers**

Below Task 2's Q-pin state block:

```tsx
  // Dragging: pointer events (one path for mouse + touch). A <5px press is a
  // tap and falls through to the pin's own click (transcript). A real drag
  // is a deliberate placement: it cancels auto-collapse for the turn and the
  // fractional position is remembered for later pins this session.
  const [qpinCustomPos, setQpinCustomPos] = useState<QpinFraction | null>(null);
  const qpinBoxRef = useRef<HTMLDivElement>(null);
  const qpinDrag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number; // pin top-left relative to stage, px, at pointerdown
    originY: number;
    dragging: boolean;
  } | null>(null);
  const qpinJustDragged = useRef(false); // suppress the click that ends a drag

  const onQpinPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current?.getBoundingClientRect();
    const box = qpinBoxRef.current?.getBoundingClientRect();
    if (!stage || !box) return;
    qpinDrag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: box.left - stage.left,
      originY: box.top - stage.top,
      dragging: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onQpinPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = qpinDrag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.dragging && !exceedsDragThreshold(dx, dy)) return;
    d.dragging = true;
    const stage = stageRef.current?.getBoundingClientRect();
    const box = qpinBoxRef.current?.getBoundingClientRect();
    if (!stage || !box) return;
    setQpinCustomPos(
      clampQpinFraction(
        { x: (d.originX + dx) / stage.width, y: (d.originY + dy) / stage.height },
        stage,
        { width: box.width, height: box.height },
      ),
    );
  };

  const onQpinPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = qpinDrag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.dragging) {
      setQpinDragged(true); // no auto-collapse this turn
      qpinJustDragged.current = true;
    }
    qpinDrag.current = null;
  };

  // Custom position survives stage resizes/rotation via re-clamping.
  useEffect(() => {
    if (!qpinCustomPos) return;
    const onResize = () => {
      const stage = stageRef.current?.getBoundingClientRect();
      const box = qpinBoxRef.current?.getBoundingClientRect();
      if (!stage || !box) return;
      setQpinCustomPos((p) =>
        p ? clampQpinFraction(p, stage, { width: box.width, height: box.height }) : p,
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [qpinCustomPos !== null]); // eslint-disable-line react-hooks/exhaustive-deps
```

Extend the Task 1 import: `import { qpinCollapseDeadline, exceedsDragThreshold, clampQpinFraction, type QpinFraction } from '@/lib/tutor/qpin-behavior';`

- [ ] **Step 2: Wire the wrapper**

Replace Task 2's expanded-pin block with:

```tsx
      {questionPin && qpinMode === 'expanded' && (
        <div
          ref={qpinBoxRef}
          onPointerDown={onQpinPointerDown}
          onPointerMove={onQpinPointerMove}
          onPointerUp={onQpinPointerEnd}
          onPointerCancel={onQpinPointerEnd}
          onClickCapture={(e) => {
            // A drag's trailing click must not open the transcript.
            if (qpinJustDragged.current) {
              qpinJustDragged.current = false;
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          style={
            qpinCustomPos
              ? { left: `${qpinCustomPos.x * 100}%`, top: `${qpinCustomPos.y * 100}%`, transform: 'none' }
              : undefined
          }
          className={`absolute ${showSwitcher ? 'top-[100px]' : 'top-16'} left-1/2 -translate-x-1/2 z-20 max-w-[min(88vw,560px)] touch-none cursor-grab active:cursor-grabbing`}
        >
          {questionPin}
        </div>
      )}
```

Notes for the implementer:
- The inline `style` (left/top/transform) overrides the Tailwind default-position classes — that is intentional; no class juggling needed.
- `touch-none` (touch-action: none) is on the pin wrapper ONLY. Taps still fire click; board scrolling is unaffected because the wrapper is just the pin.
- The pin's inner ✕ button still works mid-press: a tap on ✕ never exceeds the threshold, so the click reaches it. If a drag ends ON the ✕, `onClickCapture` swallows it — dismiss requires a clean tap, which is fine.
- Keyboard (Enter/Space) activation on the inner `role="button"` is untouched — drag is a pointer-only enhancement.

- [ ] **Step 3: Typecheck + tests**

Run: `npx tsc --noEmit && npm run test:qpin`
Expected: no errors, all PASS.

- [ ] **Step 4: Manual verification — desktop**

In a live dev session with a question pin showing:
- Drag the pin by its body to mid-board: it follows the pointer, clamps at all four edges (never under the header, tools cluster side gutter, or floating tutor bar), and does NOT auto-collapse afterwards.
- Plain click (no movement) still opens the transcript drawer; ✕ still dismisses.
- Dismiss, wait for the next tutor question: the new pin appears at the dragged position, then auto-collapses normally (drag-cancel is per-turn).
- Resize the window with a custom-positioned pin: it stays fully visible.

- [ ] **Step 5: Manual verification — mobile (iOS Safari + Android Chrome, inside the academy embed)**

- Touch-drag the pin: page/board does not scroll or zoom while dragging; pin tracks the finger.
- Tap (no drag) opens the transcript; tap ✕ dismisses; tap the `Q` chip re-expands (comfortable hit target).
- Rotate the device with a custom position: pin re-clamps on-screen.
- Landscape phone: pin cannot be parked over the floating tutor bar or under the header.

- [ ] **Step 6: Commit**

```bash
git add src/app/tutor/components/session/SessionStage.tsx
git commit -m "feat(tutor): Q-pin draggable (pointer events) with per-session position memory"
```

---

### Task 4: Final verification + ship gate

**Files:** none new.

- [ ] **Step 1: Full check**

```bash
cd /Users/luke/Dev/evelynlearning
npx tsc --noEmit
npm run lint
npm run test:qpin
npm run test:question-gist-text
```

Expected: all clean/PASS. (`next lint` may surface pre-existing warnings — only NEW errors in the two touched components block.)

- [ ] **Step 2: User live-test round**

Per the house live-test flow: user drives a real voice session (AP Stats U1.9 reproduces the original collision) on desktop + phone before any deploy. Deploy to prod is `./deploy-update.sh` ONLY (never `npm run deploy`), and only when the user says ship.
