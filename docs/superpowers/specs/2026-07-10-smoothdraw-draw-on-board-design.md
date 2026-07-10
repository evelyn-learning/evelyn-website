# SmoothDraw — the board draws itself (design)

Approved 2026-07-10 after the WB UI audit (evidence bundles:
`artifacts/tutor-e2e/*-2026-07-10T*`; audit memory:
`project_tutor_wb_ui_audit_2026_07_10`). Successor to the "SmoothDraw
shared-canvas" north star recorded in `project_student_wb_marks`.

## What this delivers

The whiteboard stops *appearing* and starts *being drawn*. Content renders
animate on stroke-by-stroke as the tutor speaks; tutor marks become
hand-drawn strokes; the tutor's written notes move out of the annotation
strip and onto the board beside the things they describe, at positions the
runtime computes. The board should feel like a live teacher writing.

## Locked decisions (user, 2026-07-10)

1. **Core outcome = presence.** Hand-drawn feel + animation is the point,
   not merely strip retirement (which rides along as Phase 3).
2. **Everything draws on.** Content (diagrams, geometry, equations, cards,
   tables) AND marks — via a generic engine, not per-renderer work.
   Iframes (Desmos/Ketcher) fade; that's accepted.
3. **Fixed-duration at flush.** Draw-on runs 0.8–1.5s from the moment
   render-sync flushes the item at its sentence start. No stretching to
   spoken-audio length (fragile against kills/typed turns/silent runs).
4. **Clean content, handy marks.** Teaching content keeps crisp rendering —
   it only ANIMATES. Hand-drawn stroke character (taper, wobble) applies
   to tutor marks and written notes only. (rough.js-style restyling of
   content is explicitly rejected — "unrecognizable blobs" precedent.)
5. **Strip retires, phased.** Scribble labels + handwrites become
   on-board hand-written text with COMPUTED placement (never
   brain-guessed). The strip is deleted only after a live legibility gate.

Approach chosen: **A — generic post-render animator** (one seam at item
mount). Rejected: B (per-renderer choreography — per-renderer work across
140+ renderers, the scaling trap the catalog exists to avoid) and
C (rasterize-and-reveal — fake feel, breaks student-mark hit-testing).

## Architecture

### 1. Draw-on engine

New pure module `src/lib/tutor/whiteboard/draw-on.ts` + thin hook
`useDrawOn`, consumed by WhiteboardCanvas at the item wrapper — the seam
where `itemEnterClass`/`wb-item-enter` lives today. Draw-on REPLACES the
entrance animation for items whose id hasn't animated yet.
`seenAnimIdsRef` remains the single animate-once authority: page flips
and re-renders never replay (2026-07-10 perf work is a prerequisite and
is already on main).

On new-item mount, classify the item's DOM and animate:

- **SVG content**: walk visible `path/line/polyline/circle/ellipse/rect`
  in DOM order. Stroke-bearing elements get
  `stroke-dasharray = getTotalLength()` + a WAAPI `stroke-dashoffset`
  animation. Item budget `clamp(0.8s, 0.08s × strokeCount, 1.5s)`,
  elements staggered inside it with ~60ms overlap so it reads as one
  continuous drawing. Non-stroke elements (fills, `<text>`, `<image>`)
  fade+scale in when the nearest preceding stroke group completes.
  Beyond ~40 stroke elements, batch the remainder into groups so dense
  figures (anatomy, circuits) still finish inside the budget.
- **HTML content** (KaTeX equations, problem/segment cards, worked
  examples, tables): left→right `clip-path: inset()` wipe over the same
  budget. Tables wipe row-by-row when rows are trivially detectable
  (`tr` / direct grid children); otherwise one wipe.
- **Iframes** (Desmos, Ketcher): 300ms fade+scale. The engine cannot
  reach across the boundary; accepted.

Multiple items flushed on the same sentence queue serially with ~300ms
spacing (render-sync already delivers per-sentence batches).

### 2. Interrupt semantics (hard rules)

`finishAllAnimations(container)` jumps every running animation to its
final state via `Animation.finish()`. It runs on:

- judge kill / retry (BEFORE dim + removeItems apply),
- barge-in / student interrupt,
- page switch away from the animating page,
- `reviseItems` targeting an animating item,
- PDF export start,
- component unmount.

`prefers-reduced-motion` always disables the engine (current instant
behavior). Rollout: `NEXT_PUBLIC_TUTOR_DRAW_ON=true` enables it; the
flag ships dark (unset in prod env, set in dev) until live sign-off,
then flips on in prod env — the recent flags' pattern (CONTENT_VARIETY,
CAPTION_SYNC).

Animation is **presentation-only**. The command stream, catalog state,
dedup signatures, replay data, session persistence, and PDF content are
byte-identical with the flag on or off.

### 3. Perf guardrails

WAAPI/CSS compositor animations only — no rAF loops, no React re-renders
during animation. The engine mutates DOM it owns post-mount; memoized
renderers (a7c124a) guarantee an animating item is not re-rendered
mid-stroke. Explicit budget, verified per phase with the harness jank
probe: **no new long tasks >100ms; CLS unchanged** vs the 2026-07-10
baselines (0.02–0.04).

### 4. Hand-stroke marks

ScribbleOverlays keeps its resolution machinery (catalog →
`data-feature` rects, incl. the ff73a04 sign-slug and a7c124a
corner-anchor fixes) — rendering upgrades:

- Ticks, highlights, and (Phase 4) arrows render as **variable-width
  outline strokes** with taper and slight wobble — pencil, not
  `<path stroke>`.
- Wobble is **deterministically seeded from the target id**: re-renders,
  replay, and the PDF mirror produce the identical mark. No
  `Math.random`.
- Marks draw on in ~400ms through the same stroke animator.
- PDF capture mirrors the outline geometry (both capture sites in
  `whiteboard-capture.ts`, in lockstep, as today).

### 5. On-board written notes + placement engine

`tutor_scribble.label` and `tutor_handwrite` stop feeding the
AnnotationStrip and render as hand-written text (Caveat 22px, wrapped
≤3 lines, per-word clip-wipe so the text *writes on*) placed beside
their target.

New pure module `src/lib/tutor/whiteboard/ink-placement.ts`:

- **Inputs**: target feature rect (wrapper-relative, same measurement
  path as student-marks CapturedRects), occupied rects on the page
  (items + previously placed notes), page bounds, measured text size
  (`canvas.measureText`).
- **Slot order**: right → above → below → left → margin column. First
  fit wins; placement registers into the occupied set so later notes
  cannot collide. Notes NEVER overlap content (the 2026-05-13 lesson
  that created the strip).
- **Fallback**: a `near` that fails catalog resolution places in the
  margin column SILENTLY — never a rejection, never a retry
  (round-7 guardrail).
- Pure and unit-testable without a browser.

Anchoring: notes are px-anchored to the page wrapper exactly like
student ink (proportional rescale on width change; content appending
below does not move them). Persistence/dedup/replay: unchanged command
stream (`handwrite`, scribble `label`), presentation differs only.
Identity: tutor notes default warm amber (today's strip bullet color);
student ink keeps blue.

`tutor_handwrite` regains an optional `near` (resolved via
catalog.resolveTarget). Docstring changes ride Phase 3's flag.

### 6. Arrows — `tutor_link` (Phase 4)

`{ from, to, label?, color? }`: resolve two feature rects, route a curved
hand stroke between nearest edges, label at the midpoint via the slot
picker. Covers the connection/causation utterance classes (D/I in the
2026-05-13 taxonomy) — the top missing primitive. Misses on either
endpoint silent-drop like scribbles.

## Phases + gates

| Phase | Ships | Flag | Gate |
|---|---|---|---|
| 1 | draw-on.ts + useDrawOn + interrupts + reduced-motion | `NEXT_PUBLIC_TUTOR_DRAW_ON` (dark) | `test:draw-on` unit suite; render-harness pass; e2e with `TUTOR_E2E_VIDEO=1` reviewed; kill-mid-animation harness scenario; user live eyeball |
| 2 | hand-stroke tick/highlight + PDF mirror | same flag | test-tick-render extended; PDF spot-check; live |
| 3 | ink-placement.ts + on-board notes; strip stops receiving entries | `TUTOR_INK_NOTES` (docstring changes → fresh-session testing discipline) | `test:ink-placement` unit suite; PDF mirror; **user legibility sign-off over live sessions**; only then delete strip code |
| 4 | tutor_link arrows + minimal generic prompt touch-ups | same | live sessions; round-7 regression |

Every phase: full WB unit battery, round-7 incoherence plan regression,
jank-probe e2e against the perf budget.

## Guardrails (do not regress)

- Round-7 scribble **silent-drop** on all rejection paths — placement
  fallback layers on top; the drop stays silent.
- Cross-turn dedup (`structuralAxesFor`, buildShowSignature) untouched.
- No subject-specific examples in prompts/docstrings
  (`feedback_generic_prompts`).
- System prompt is session-static — Phase 3+ live tests need fresh
  sessions.
- META_ACTIONS constraint (counter-drift class) if any new non-render
  action is added.
- PDF capture sites change in lockstep with live rendering, always.

## Risks accepted

- DOM-order stagger occasionally draws an unusual SVG in an odd sequence
  (fallback: fade; revisit per-family hints only on evidence).
- Stroke-less filled shapes fade rather than draw.
- Desmos/Ketcher content never draws on.
- Caveat-font "writing" is a wipe, not true glyph strokes (real stroke
  fonts rejected as heavy; revisit only if the wipe reads poorly live).
