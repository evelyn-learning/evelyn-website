# Student Whiteboard Interactivity ("student marks") — Design

**Date:** 2026-07-05
**Status:** Approved (user-grilled, 8 decisions locked)
**Queue:** User-ordered fixes queue 2026-07-04, item 3
**Phasing:** 3 phases; Phase 1 implemented first (this spec covers all three;
the accompanying plan covers Phase 1 only)

## Goal

Students convey meaning to the tutor by acting directly ON the whiteboard —
pointing at, circling, underlining, crossing out, or writing over anything
the tutor has rendered (figures, table cells, equation steps, text) — instead
of describing it in words or using the detached scratch-pad. Marks reach the
brain as first-class conversational input.

## Decisions locked (user-confirmed 2026-07-05)

1. **Gesture vocabulary v1:** point (tap/click) + circle + freehand ink. Two
   tools max in the UI (tap is toolless; ink behind one pen button).
2. **Transport: semantic refs first.** Marks resolve to itemId + feature via
   the catalog/DOM machinery and render as a `<student_marks>` text block.
   Vision is a fallback (below), not the primary channel.
3. **Turn semantics: attach to utterance + idle send.** Marks buffer; they
   attach to the student's next turn (voice or typed). Mark-only + ~4s of
   student silence + tutor idle → standalone send.
4. **Mark lifecycle: student ink layer, fades after turn.** Distinct student
   color (blue vs the tutor's amber). Points ping-and-fade (~2s); ink
   persists until the tutor's next turn completes, then fades. The board
   remains the tutor's canvas; marks are conversational gestures.
5. **Ink interpretation: shape classes + vision fallback.** Strokes classify
   geometrically (circle / underline / cross-out / arrow / other) against
   feature rects. Ink resolving to NO feature (margin sketches, written
   words/numbers) rasterizes and goes through the EXISTING
   `/api/tutor/extract-homework` vision endpoint — the DrawPad path — so
   written answers still arrive as text.
6. **Barge-in: marks never interrupt.** Marking is silent; zero interaction
   with the perception/cancel machinery. Idle-send fires only when the tutor
   is not speaking.
7. **Activation: tap always live; ink behind a pen tool.** Taps don't
   conflict with scroll. Pen mode locks board scroll while active (touch
   safety). Exiting pen mode restores scroll.
8. **Scope: claude-brain only, flag `NEXT_PUBLIC_TUTOR_STUDENT_MARKS`,**
   ships on `/tutor` AND the embed (shared TutorSession). DrawPad
   scratch-pad stays for now; retirement is a Phase-3 decision.

## Architecture (4 units)

### 1. Capture — `StudentInkOverlay` (new component in WhiteboardCanvas)

A per-page overlay layer, sibling of the existing `ScribbleOverlays`,
rendered above all items (including the Desmos/Ketcher iframes — marks over
iframes resolve to the whole item, never inside, which is the accepted
limit).

- **Tap/click** (always active when the flag is on): renders a transient
  blue ping (~2s CSS animation) at the point and emits a point-mark.
  Distinguished from scroll/drag by pointer-movement threshold; does not
  preventDefault on anything scroll-related.
- **Pen mode** (Phase 2): toggled by a pen button in the session dock.
  While active: board scroll locked, pointer drags captured as polylines
  (normalized page-relative coordinates), rendered as blue ink strokes.
  Exiting pen mode (or idle timeout) restores scroll.
- **Fade lifecycle:** the overlay owns rendering; the orchestrator signals
  "tutor turn complete" to start ink fade-out. Points self-fade.
- Emits `StudentMarkEvent { type: 'point' | 'stroke', pageIndex, pointNorm |
  polylineNorm, capturedRects }` upward via a callback prop. At capture time
  it collects `capturedRects`: the bounding rects (normalized to the page)
  of every `[data-feature]` element and item wrapper on the active page,
  tagged with `{ itemId/index, featureName }` — so resolution downstream is
  pure math, no DOM.

### 2. Resolution — pure module `src/lib/tutor/whiteboard/student-marks.ts`

`resolveStudentMark(event) → ResolvedMark`:

- **Point:** the smallest feature rect containing the point; else the
  nearest feature within a small threshold; else the containing item
  (whole-item); else page-only ("pointed at empty space on page N").
- **Stroke (Phase 2):** shape class via geometric heuristics — closed loop
  (end near start, encloses area) = `circle`; low-aspect horizontal stroke
  sitting under a text feature = `underline`; self-intersecting X/zigzag
  over a feature = `cross-out`; long directional stroke = `arrow` (with
  from/to features when both ends land on features); anything else =
  `ink`. Covered features = rect-intersection area above a threshold,
  smallest-first.
- Output: `ResolvedMark { kind: 'point'|'circle'|'underline'|'cross-out'|
  'arrow'|'ink', itemIndex?, feature?, pageIndex, bboxNorm, polyline? }`.
- `formatStudentMarks(resolved[], catalogLookup) → string` renders the
  `<student_marks>` block, using catalog feature labels/descriptions for
  human-readable references (enrichment happens in the orchestrator where
  `catalogRef` lives). Example output shape (illustrative, not a template
  the code interpolates topics into):
  `The student pointed at the "Compressibility" row of the comparison table
  (page 2).` / `The student circled the "x = 4" step of the solution.`
- Fully unit-testable: rects and points in, classifications out.
  `npm run test:student-marks`.

### 3. Transport — pending buffer + turn attachment (VoiceTutorRealtime)

- `pendingStudentMarksRef: ResolvedMark[]` fills from the overlay callback
  (marks never trigger anything by themselves — decision 6).
- **Attachment:** when a student turn starts (voice transcript or typed
  input reaching `callBrainOnce`), non-empty buffer → formatter renders a
  `<student_marks>` block appended to the turn's user content (same
  per-turn-block pattern as `<opening_directive>` / transient context).
  Buffer clears on attach.
- **Idle send:** buffer non-empty + no student speech + tutor not speaking
  + ~4s elapsed since last mark → send the block standalone via the
  existing bracketed `sendTextMessage` context-injection path (DrawPad
  precedent). Timer resets on each new mark; suppressed entirely while the
  tutor is speaking (re-armed after).
- **Vision fallback (Phase 3):** marks with `kind:'ink'` and no covered
  features rasterize (polyline → offscreen canvas PNG) → existing
  `/api/tutor/extract-homework` → extracted text appended to the block
  ("the student wrote: …"). Async like DrawPad's flow.
- Each mark emits `onDebugEvent('student_mark', summary)` — visible in the
  session-recordings all-events lane.
- Kill/retry, perception verdicts, render-sync: untouched. The buffer is
  read only at turn-start/idle-send.

### 4. Brain side — one generic prompt clause (BASE_PROMPT)

`<student_marks>` blocks are the student's deictic gestures on the board:
treat them as pointing/selection integrated with the utterance ("this one" +
a point = that feature); reference marked features by their labels; do NOT
re-render the item they marked (it is already on the board); a cross-out
usually signals disagreement or correction; a circle usually signals
selection or emphasis. Generic wording — no topic-specific examples
(feedback_generic_prompts).

## Phasing

- **Phase 1 (now): tap-to-point vertical slice.** Overlay (tap+ping only),
  point resolution, buffer + attach + idle-send, prompt clause, flag,
  debug events, unit tests, harness verification. No pen button yet.
- **Phase 2: pen tool.** Dock button, stroke capture, scroll-lock, shape
  classification, ink render + fade lifecycle, more unit tests.
- **Phase 3: vision fallback + polish.** extract-homework wiring for
  unresolved ink, replay/PDF integration decision, DrawPad retirement
  decision, touch-device tuning from live evidence.

## Error handling

- A tap that resolves to nothing still pings (student feedback) but emits a
  page-only mark; the formatter says "empty space" — the brain can ask.
- Marks on a page the student then navigates away from stay valid (marks
  carry pageIndex; the formatter page-qualifies).
- Flag off / non-claude-brain: overlay not mounted; zero behavior change.
- Buffer cap (~12 marks): oldest dropped with a debug event — a turn's
  block stays readable.
- If the formatter finds a stale itemIndex (item superseded/removed), it
  degrades to page-level wording, never throws.

## Testing

- Unit (`scripts/test-student-marks.ts`): point-in-rect resolution
  (smallest-wins, threshold, whole-item and page fallbacks), Phase-2 shape
  classification table, formatter wording incl. degraded cases, buffer cap.
- Harness: drive a session, inject marks via a dev hook
  (`__tutorTestMark(x, y)` on the page, NODE_ENV-guarded like the other
  hooks), assert the `<student_marks>` block reaches the brain (telemetry
  log) and the brain references the feature.
- Live: tap during tutor speech (no interrupt, attaches to next utterance);
  tap + silence (idle-send fires after tutor finishes); tap on a Desmos
  graph (whole-item wording); mobile tap (no scroll conflict).

## Amendments (2026-07-05, from the user's Phase-2 live test)

Live evidence: answering by drawing (tick on an option, circle as answer,
handwriting "x² + y² = r²") was read deictically ("you're pointing at the
figure") and multi-stroke gestures fragmented into per-stroke noise; the
1.2s next-turn fade read as "ink-vanish". Three amendments, user-locked:

1. **Ink lifecycle (revises decision 4):** ink persists through the tutor's
   acknowledging turn and fades slowly (~4s) after the SECOND tutor-turn
   completion. Points keep the 2s ping.
2. **Answer comprehension (prompt):** when the tutor has just asked a
   question and the student's turn is marks-only, the marks ARE the answer —
   a circle/tick on an option means "this one"; evaluate the choice instead
   of describing what was marked.
3. **Writing detection → vision (Phase-3 core pulled forward):** strokes
   group into GESTURES (quiet-window ~1.2s); a 2-stroke gesture classifies
   as tick (V-angle) or cross-out (crossing lines); ≥3 strokes (or an
   unresolvable 2-stroke) = likely WRITING → rasterize the gesture's ink
   (bbox crop, white bg) → existing `/api/tutor/extract-homework` OCR →
   mark arrives as `The student wrote on the board near {target}: "…"`.
   OCR is async (DrawPad precedent): the mark enters the pending buffer on
   resolve; failure degrades to "wrote something (unreadable)". New
   ResolvedMark kinds: `tick`, `writing` (with `text?`).
4. **Typing-awareness (second live-test round):** the idle-send busy
   predicate also waits while the dock's text input is FOCUSED
   (`studentTypingRef` via the input's existing focus/blur handlers) — a
   mark followed by a typed message attaches to that message instead of
   idle-sending mid-composition. Junk-OCR containment
   (`sanitizeInkOcrText`) and an OCR-in-flight idle gate were added by
   the same round's final review.

## Out of scope (all phases)

- Marks inside Desmos/Ketcher iframes (whole-item only, accepted).
- Multi-student / collaborative marking.
- Tutor responding with marks ON student ink (tutor machinery unchanged).
- Persistence of student marks into checkpoints/resume.
