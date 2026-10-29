# GAC Homework Help — Acceptance Round 8 Fix Plan (hw-14 again, worksheet6_clean.png, plan gen-00a69e1b)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Every task that fixes a reported defect follows superpowers:systematic-debugging: the root cause below was pinned from the engine log, the stored build row and the sheet image; each task still reproduces it with a failing test before changing code.

**Goal:** Fix the five defects Praveen found on 2026-10-21 night re-uploading worksheet6 (set hw-14 again, engine plan `gen-00a69e1b-4129-4d72-b380-c56152493942`), plus the cost regression he asked about (every re-upload rebuilds every problem), without changing behaviour for any session that is not a one-problem homework session.

**Architecture:** Same engine worktree as rounds 1–7: `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct` (`apps/tutor`, branch `gac-29oct`, HEAD `e454d33c`). No academy task this round. Local stack: `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh start|stop|status` → `http://localhost:3016` (engine :3007, tunnel :2710 = LIVE DBs — never run a live session from a task).

**Tech Stack:** TypeScript; engine tests are `apps/tutor/scripts/test-*.ts` run with `npx tsx` (registered as `test:*`).

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-20-gac-homework-per-problem-design.md` · **Round 7 plan (patterns, constraints):** `/Users/luke/Dev/evelynlearning/docs/superpowers/plans/2026-10-22-gac-homework-round7-plan.md` · **Round 7 ledger:** `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/.superpowers/sdd/2026-10-22-gac-homework-round7-plan/progress.md`

## Evidence (read before any task)

Pulled 2026-10-21 21:40–22:10 PDT from `/Users/luke/.evelyn/gac-local/engine.log`, a read-only dump of the `homeworkbuilds` row `_id=gen-00a69e1b-…` (`/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/.superpowers/sdd/2026-10-22-gac-homework-round7-plan/hw14b-dump.txt`, texts + stored figures) and the sheet `/Users/luke/Downloads/worksheet6_clean.png`.

| # | Praveen's finding | Root cause (pinned) |
|---|---|---|
| G1 | "#1 fig is wrong" (the V points left; on the sheet E is RIGHT of A and B) | The photo read's description this time says `Segments AE and BE form a "<" shape` and `Angle AEB at E (left side …)` — the read mirrored the figure; the proposer drew the description faithfully. Round 7's read of the same pixels said `"V" shape that points right`. Glyph-shaped descriptions mirror; nothing validates orientation. |
| G2 | "#2 thumbnail not showing" | Both attempts rejected: `label "A" does not come from the problem text` (B, C too). This round's description names the points only inside `△ABC`, `AB`, `AC`, `BC`, `AD`, `BE`, `FC`; `labelIsFromText` needs the single letter as a word. Round 7's description happened to say "A is at the top". p6 lost attempt 1 the same way (`Sector OBA`). |
| G3 | "#3 fig is not complete, part of it got cut off" (the "60 m" label reads "m", the 40° arc is clipped) | `GeometryRenderer` auto view range pads by `PADDING = 1.5` math units; the lighthouse figure is 125 units wide, so the left edge sits ~1 % past the lighthouse and the label/arc drawn left of x = 0 fall outside the svg (`fit="content"` then clamps the crop to the canvas). |
| G4 | "#5 the tutor stalled" after `12 cm` ("…so it equals the diameter: 12 cm. That's the value you gave.") | Keyed verdict → `undecided` (round 7, F7) → model check `open_question / correct` → the frame's rule is "say that the result is the value they gave. Do not ask them to check it again." — nothing asks for the next move; the reply was two sentences and no question (`[brain-orchestrator] bare-praise-ending ADVISORY … cadence note planted for next turn`), so the student had to type again. |
| G5 | "#5 why isn't the shaded region shown?" (the sheet shades the four circular segments between the circle and the inner square; the board shades the inner square) | The read said it right ("The four circular segments between the circle and inner square are shaded"); the figure vocabulary has no region shading, and the renderer fills every polygon at 15 %, so the proposer's `inner` polygon reads as the shaded part. |
| G6 | (cost question) "costs of running these sessions for solving each problem … has gone up" | (a) Build: every problem rebuilt (`ms` 6–20 s on all eight; round 7 copied 4–8 from the cache). The photo-read cache is an in-memory `Map` in `material-extract.ts` (`TRANSCRIPTION_TTL_MS` 1 h, lost on restart); the re-read produced different wording for all eight problems → every `problems.hash` changed → zero cache hits; plus five problems burned a second Opus proposer attempt on G2/titles/`translate_point`. (b) Sessions: per message flat (~$0.03–0.06 both rounds); a fixed ~$0.43 on turn 1 is the ~108k-token prefix (core prompt ≈ 55k tokens, 55 tool schemas ≈ 30k, session part ≈ 9k) written to the 1 h cache (`cache_creation=108544`). The prefix is out of scope here (reported to Praveen as a proposal). |
| G7 | (log only) p3 and p5 lost attempt 1 to `label "Lighthouse and two boats" / "Square, inscribed circle, inner square" does not come from the problem text` (a caption-like title); p4 lost attempt 1 to `translate_point "C": by must be {dx, dy}` (the proposer sent `by:{from:"A",to:"D"}`) | Each wasted attempt ≈ one Opus call. |

## Global Constraints

- **GAC engine frozen for non-homework sessions.** Every change is inside `homework-build/`, inside a `hpKey`/one-problem branch, or an additive vocabulary read no live session ever sent (`region` step, polygon `fill`, `translate_point.by {from,to}`, relative-position claims). The renderer's padding change is gated on `fit === 'content'` (only the homework thumbnail and `ProblemFigure` use it). No system-prompt text outside the homework-problem block changes; `scripts/gen-system-prompt-hashes.ts` hashes `buildSystemPrompt` output only — run it if a hashed file changes.
- **The photo read prompt (`DIAGRAM_RULE`, Task 7) and the read cache (Task 8) are shared by every partner's material upload.** Task 7 only adds specificity to what the read already must say; Task 8 changes nothing in the text produced, only how long an identical read is remembered. Both are called out to Praveen in the handoff.
- **No API spend in tests.** Model calls stay behind injectable `deps`; tests inject stubs. No live sessions from any task.
- Prompts stay generic (no topic-specific example).
- Commit per task on `gac-29oct`; message body names the finding (G-number) and the cause; trailers `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01Q4Nu3g3ap8MJQvqRcbiozq`. No push, no amend, no deploy. Never `git add -A` (untracked `.env.local.stale-2026-10-15`, `.superpowers/`).
- Engine gate after the last task: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npm run test:all` → exactly the 2 baseline FAILs (`test:embed-debug-coverage`, `test:portal-student-scoping`); `npx tsc --noEmit -p .` clean. `test:brain-route-cache-blocks` flaked once under full load on 10-21 (passes alone) — re-run alone before calling it a regression.

## Review Focus

1. **A single-letter point label whose letter appears only inside a compound name** (`△ABC`, `AB`, `OBA`) is accepted (G2); a letter that appears nowhere (`G` on the p2 text) is still rejected; `namedPointsIn` is NOT widened (an acronym must never demand a point). Pinned by Task 1.
2. **A figure whose labels sit outside the point bounding box** (a label left of a vertical segment at x = 0, an angle arc at the top-left vertex) renders whole in the thumbnail and on the board, and a `fit="canvas"` render is byte-identical to before. Pinned by Task 4.
3. **Shading** draws exactly the region the sheet shades (outer shape minus inner shapes) and a polygon the sheet leaves white can be drawn unfilled; a region naming a missing shape fails honestly. Pinned by Task 5.
4. **A one-problem reply that confirms a value** ends with the next question or the problem-done line, in the same reply, for keyed, model-checked and carried verdicts; a session without `hpKey` gets byte-identical frames. Pinned by Task 6.
5. **A mirrored figure** (E left of A when the description says E is right of A) is rejected with a reason naming the points, once the read states positions instead of glyphs. Pinned by Task 7.
6. **A re-upload of the same image bytes after an engine restart** returns the same text without a vision call (Task 8), so every problem hits the build cache; a changed read prompt or model misses on purpose.

---

## File structure

**Engine** (`/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor/`)
- Modify `src/lib/tutor/homework-build/figure-validate.ts` — `labelIsFromText` (compound point names), `validateGeometry` (caption-like title dropped, region ids), `checkClaims` (relative-position kinds).
- Modify `src/lib/tutor/homework-build/figure-build.ts` — `normalizeFigureDisplay` drops a caption-like title; proposer prompt gains the region/fill vocabulary (rule 10) and `translate_point.by` shape; `FIGURE_CLAIMS_SYSTEM` + `CLAIM_ITEM_SCHEMA` gain `left_of|right_of|above|below`.
- Modify `src/lib/tutor/homework-build/types.ts` — `FigureClaim` union gains the four position kinds.
- Modify `src/lib/tutor/diagrams/geometry-solver.ts` — `StepTranslatePoint.by` accepts `{from,to}`; new `StepRegion`; `SolverOutput.regions`; polygon `fill` passthrough.
- Modify `src/app/tutor/components/whiteboard/GeometryRenderer.tsx` — `regions` prop + `renderRegions` (evenodd path); content-fit padding via the pure helper.
- Create `src/lib/tutor/whiteboard/geometry-view-range.ts` — `autoViewRange(...)` extracted from the renderer so the padding rule is unit-testable.
- Modify `src/lib/tutor/homework-build/figure-svg.ts` (passes `regions` through if it maps fields by hand — check) and `src/lib/tutor/diagrams/manifests.ts` only if it enumerates output keys.
- Modify `src/lib/tutor/voice/verdict-precheck-shared.ts` + `src/lib/tutor/voice/claude-brain.ts` — `nextMoveAfterConfirm` option on the correct frames, gated on `hpKey`.
- Modify `src/lib/tutor/lesson-plan/material-extract.ts` — `DIAGRAM_RULE` positions sentence; transcription cache read-through/write-through to Mongo with a prompt-version in the key. Create `src/models/TranscriptionCache.ts`.
- Tests: `scripts/test-homework-figure.ts` (22 today), `scripts/test-homework-build.ts` (68), `scripts/test-geometry-point-step.ts` (11), `scripts/test-homework-problem-brain.ts` (130), `scripts/test-material-extract*.ts` (check `grep -l transcriptionCache scripts/*.ts`), a new `scripts/test-geometry-view-range.ts` (registered in `package.json` `test:`), and the renderer static-markup assertions where `test-practice-figure-render.ts` keeps them.

---

## Task 1: Single-letter labels are from the text when the letter sits inside a compound point name (G2)

**Files:** `src/lib/tutor/homework-build/figure-validate.ts` (`labelIsFromText`), `scripts/test-homework-figure.ts`

- [ ] **Red:** fixture `P2TEXT` = this round's n=2 text (from hw14b-dump.txt: `The circle is inscribed in △ABC and AC = 13. [Figure: Triangle ABC with inscribed circle touching AB at D, AC at F, and BC at E. Segment AD = 5, segment BE = 7, segment FC = x.]\n(a) Find x.\n(b) Find the perimeter of △ABC.`). Assert `labelIsFromText(l, P2TEXT)` is true for `A`, `B`, `C`, `D`, `E`, `F`, `x`, `5`, `7`; false for `G` and for `AB` is unchanged from today (assert whatever it returns today and say so in the test). Also the p6 text (`Sector OBA`) → `O`, `B`, `A` true. Run → `A`/`B`/`C`/`O` fail today.
- [ ] **Green:** in the `pieces.length === 1` branch, when `/^[A-Z]\d?['′]?$/.test(w)` (a point-id shape), accept it if any text token, after stripping a leading `△▲∠` and trailing `'′`, matches `/^[A-Z]{2,4}\d?$/` and contains the letter. Comment: `GAC acceptance 2026-10-22 (hw-14 p2, round 8): the sheet names points only inside △ABC / AB`. Do not touch `namedPointsIn` (a compound token may be an acronym; permitting a label is safe, demanding a point is not).
- [ ] Run `npx tsx scripts/test-homework-figure.ts` → green; commit `fix(homework-build): a point label is from the text when its letter sits inside a compound name like △ABC or AB (G2)`.

## Task 2: A caption-like title is dropped, not fatal; `translate_point.by` accepts `{from, to}` (G7)

**Files:** `src/lib/tutor/homework-build/figure-validate.ts` (title check in `validateGeometry`), `src/lib/tutor/homework-build/figure-build.ts` (`normalizeFigureDisplay`), `src/lib/tutor/diagrams/geometry-solver.ts` (`StepTranslatePoint`, `solveTranslatePoint`), tests `scripts/test-homework-figure.ts`, `scripts/test-homework-build.ts`, `scripts/test-geometry-point-step.ts`

- [ ] **Red (title):** p3's attempt-1 figure (engine.log line 97: `"title":"Lighthouse and two boats"`, the rest = the stored n=3 figure) with the n=3 text → `validateFigure(...).ok === true` and `normalizeFigureDisplay(fig, text).title === undefined`; a title that is a label (`"AB = 5"`) is still checked and still fails when absent from the text. Run → fails today (`label "Lighthouse and two boats" does not come from the problem text`).
- [ ] **Red (translate):** `solveGeometry({ given: A(0,0), B(6,0), D(1.5,3.5), steps: [{ id:'C', kind:'translate_point', point:'B', by:{ from:'A', to:'D' } }] })` → point C at (7.5, 3.5). Run → throws today.
- [ ] **Green:** `isCaptionLabel(fig.title)` → skip `textFieldReasons` for it and delete `title` in the normaliser (comment: a caption is the proposer's own words, never the sheet's). `StepTranslatePoint.by: { dx: number; dy: number } | { from: string; to: string }`; the solver resolves `{from,to}` to `to − from` from resolved points; the error message now reads `by must be {dx, dy} or {from, to}`. The proposer prompt's vocabulary line for `translate_point` names both shapes.
- [ ] Run the three files → green; commit `fix(homework-build): a caption-like title is dropped, not fatal; translate_point accepts a vector by two points (G7)`.

## Task 3: Content-fit padding keeps edge labels and arcs inside the figure (G3)

**Files:** Create `src/lib/tutor/whiteboard/geometry-view-range.ts`; modify `src/app/tutor/components/whiteboard/GeometryRenderer.tsx` (the auto range block ~1552–1600 calls the helper); test `scripts/test-geometry-view-range.ts` (new, register `"test:geometry-view-range"`), `scripts/test-homework-build.ts` (thumbnail assertion)

**Interfaces:** `export function autoViewRange(a: { points: {x:number;y:number}[]; circles: {center:{x:number;y:number};radius:number}[]; conics: {center:{x:number;y:number};a:number;b?:number}[]; fit: 'canvas' | 'content' }): { x: [number, number]; y: [number, number] }` — exactly today's arithmetic for `fit:'canvas'` (`PADDING = 1.5`, the `< 1` widening), and for `fit:'content'` a padding of `Math.max(1.5, 0.12 * Math.max(xMax − xMin, yMax − yMin))` on every side.

- [ ] **Red:** `autoViewRange({ points: [(0,0),(0,60),(71.5,0),(112.8,0),(125,60)], circles: [], conics: [], fit: 'content' }).x[0] === -15` (0.12 × 125) and `.y[0] === -15`; same input with `fit: 'canvas'` → `x[0] === -1.5`, `y[0] === -1.5` (today's values); a 4-unit triangle → `fit:'content'` pads 1.5 (the floor). Thumbnail: `figureToSvg(<stored n=3 figure>)` (hw14b-dump.txt) → the svg has a `<text …>60 m</text>` whose `x` ≥ the viewBox's x, and a `40°` text inside the viewBox horizontally and vertically (parse `viewBox="x y w h"`). Run → the content values and the thumbnail assertion fail today.
- [ ] **Green:** extract the helper (pure, no React); the renderer calls it with `fit`. Engine-freeze pin: a static render of any geometry with the default `fit` must be byte-identical before and after — assert in the test by rendering `renderGeometryTree(fixture)` (fit canvas) and comparing to the markup produced by a copy of the old arithmetic (compute the expected viewBox `0 0 500 400` and the first point's `cx/cy` from the old ±1.5 range and assert them literally).
- [ ] Run both files + `npx tsc --noEmit -p .` → green; commit `fix(geometry-renderer): a content-fit figure pads by a share of its extent so edge labels and arcs stay inside (G3)`.

## Task 4: `region` shading and unfilled polygons (G5)

**Files:** `src/lib/tutor/diagrams/geometry-solver.ts` (new `StepRegion`, polygon `fill`, `SolverOutput.regions`), `src/app/tutor/components/whiteboard/GeometryRenderer.tsx` (`regions` prop, `renderRegions`), `src/lib/tutor/homework-build/figure-validate.ts` (region ids), `src/lib/tutor/homework-build/figure-build.ts` (proposer rule 10 + vocabulary), tests `scripts/test-geometry-point-step.ts` (solver), `scripts/test-homework-figure.ts`, `scripts/test-homework-build.ts` (thumbnail markup + prompt source check)

**Interfaces:**
- Step: `{ id: string; kind: 'region'; outer: string; inner?: string[]; label?: string }` where `outer`/each `inner` is the id of a circle (given or step) or a polygon (given or step, including `sector`'s polygon). A circle is sampled into 48 helper points `${id}_r${i}` (same pattern as `solveSector`).
- Polygon (given and step) gains `fill?: string` (`'none'` or a colour), passed to the output polygon's existing `fill` field; the renderer already honours `poly.fill`, and `fill="none"` must suppress the 15 % default — confirm `fillOpacity` does not re-apply (set opacity 0 when fill is `'none'` or render `fill="none"` without opacity).
- `SolverOutput.regions: Array<{ id: string; outer: string[]; holes: string[][]; label?: string; color?: string }>` (vertex ids; widened locally, `@core` untouched). Renderer: `regions?: SolverOutput['regions']`; `renderRegions` emits one `<path d="M… Z M… Z" fill-rule="evenodd" fill={color ?? '#4f8cff'} fillOpacity={0.25} stroke="none" />` per region, drawn before polygons.

- [ ] **Red (solver):** the stored n=5 figure plus `{ id:'shade', kind:'region', outer:'c1', inner:['inner'] }` and `inner` with `fill:'none'` → `solveGeometry(...).regions[0]` has `outer.length === 49`, `holes` `[['P','Q','R','S']]`, and `polygons.find(p => p.label === undefined && p.vertices[0] === 'P').fill === 'none'`. Run → `region` is an unknown kind today.
- [ ] **Red (renderer):** `renderToStaticMarkup(renderGeometryTree({ …solved }))` contains `fill-rule="evenodd"` and a polygon with `fill="none"`; a geometry with no regions renders byte-identically to before (reuse Task 3's freeze pin fixture).
- [ ] **Red (validator):** a region naming `c9` → reason `region "shade" names c9 but the figure has no such shape`; the n=5 figure with the region passes.
- [ ] **Red (prompt):** source check that the proposer system prompt names `region` with `outer`/`inner` and `fill:"none"` with the rule: *Shade exactly what the sheet shades: a region step whose outer is the shape whose inside is shaded and whose inner shapes are cut out; when the sheet shades a region, every polygon it leaves unshaded carries fill "none"; never shade a polygon to stand in for the sheet's shading.*
- [ ] **Green:** implement the four; thumbnails get it free through `renderGeometryTree` (confirm `figure-svg.ts`/`manifests.ts` pass `regions` through if they map keys by hand).
- [ ] Run the four files + tsc → green; commit `feat(homework-build): a region step shades the area between shapes; unshaded polygons draw with no fill (G5)`.

## Task 5: A confirmed answer in a one-problem session ends with the next move (G4)

**Files:** `src/lib/tutor/voice/verdict-precheck-shared.ts` (`formatAnswerCheckBlock` opts), `src/lib/tutor/voice/claude-brain.ts` (the three call sites that pass `statedReasonCheck`), `scripts/test-homework-problem-brain.ts`

**Interfaces:** `opts.nextMoveAfterConfirm?: boolean` — when true and the verdict is correct (any `answers` value), the block gains, before the shared closing line: `Then, in the same reply, move the problem forward: ask the next question toward what the problem still asks, or, when every part is now confirmed, say the problem is done. Never end on the confirmation alone.` claude-brain passes it exactly where `statedReasonCheck` is passed (`hpKey && verdict correct`, fresh and both carry paths).

- [ ] **Red:** `formatAnswerCheckBlock({ answers:'open_question', verdict:'correct', … }, { workThenMatch:true, nextMoveAfterConfirm:true })` contains the sentence; without the option the block is byte-identical to today; the brain harness: `hpKey` + model-check correct (the "12 cm" shape: keyed undecided → stub check correct) → the injected block contains it; no `hpKey` → absent; carry paths (reuse round 7's carry test) → present with `hpKey`.
- [ ] **Green:** add the option and wire it; `gen-system-prompt-hashes` is unaffected (per-turn block) — state it in the report.
- [ ] Run the brain test + `test-homework-session-block.ts` → green; commit `fix(homework-problem): a confirmed answer in a one-problem session ends with the next question, not the confirmation alone (G4)`.

## Task 6: The read states positions, not glyphs; relative-position claims are validated (G1)

**Files:** `src/lib/tutor/lesson-plan/material-extract.ts` (`DIAGRAM_RULE`), `src/lib/tutor/homework-build/types.ts` (`FigureClaim`), `src/lib/tutor/homework-build/figure-build.ts` (`FIGURE_CLAIMS_SYSTEM`, `CLAIM_ITEM_SCHEMA`, `normalizeClaims`), `src/lib/tutor/homework-build/figure-validate.ts` (`checkClaims`), tests `scripts/test-homework-figure.ts`, `scripts/test-homework-build.ts`, `scripts/test-material-extract*.ts` (source check on the rule)

**Interfaces:** `FigureClaim` gains `{ kind: 'left_of' | 'right_of' | 'above' | 'below'; point: string; of: string }`. `checkClaims`: `left_of` ⇒ `points[point].x < points[of].x − dtol`, `right_of` ⇒ `>` + dtol, `above` ⇒ `y >` + dtol, `below` ⇒ `y <` − dtol (y up, the solver's convention); failure reason `right_of E A fails: E is left of A` (or `… is level with …` when within tolerance). Names resolve through `nameToId` like every other claim; unresolvable prose words are skipped by the existing rule.

- [ ] **Red (validator):** the stored n=1 figure of THIS round (hw14b-dump.txt, E at the left) with claims `[{right_of, point:'E', of:'A'}, {right_of, point:'E', of:'B'}]` → `ok:false` with `right_of E A fails: E is left of A`; the same figure mirrored in x (negate every x) → `ok:true`; `above`/`below` on the lighthouse (T above B) → true.
- [ ] **Red (claims reader):** `normalizeClaims` keeps `{kind:'right_of', point:'E', of:'A'}` and drops `{kind:'right_of', point:'E'}` (no `of`); the claims system prompt names the four kinds as *stated relative positions of named points (left of, right of, above, below)*.
- [ ] **Red (read rule):** source check that `DIAGRAM_RULE` contains a sentence of this shape: *Never describe a figure's shape by a letter or symbol it resembles — say where each named point sits relative to the others (left or right of, above or below) and which way each angle opens, name a landmark for every side word, and check the word against the landmark.*
- [ ] **Green:** implement; the read prompt change moves the read's output for every partner's uploads — it only adds specificity, and Task 8's cache key includes the prompt version so old cached reads are not reused.
- [ ] Run the files → green; commit `fix(homework-build): the photo read states where points sit; stated positions are validated on the drawn figure (G1)`.

## Task 7: The photo-read cache survives restarts and keys on the prompt (G6a)

**Files:** Create `src/models/TranscriptionCache.ts`; modify `src/lib/tutor/lesson-plan/material-extract.ts` (`transcriptionCacheKey`, `recallTranscription`, `rememberTranscription`, `transcribeImagesBatch`); test `scripts/test-material-extract*.ts` (find the existing cache tests: `grep -ln "recallTranscription\|transcriptionCacheKey" scripts/*.ts`)

**Interfaces:** `TranscriptionCacheModel` — `{ _id: string (the key), texts: string[], createdAt: Date }` with a TTL index of 7 days on `createdAt`. `transcriptionCacheKey(items, modelId, promptVersion = sha8(DIAGRAM_RULE + buildBatchTranscribePrompt(items.length)))`. `recallTranscription(key, now?, store?)` and `rememberTranscription(key, texts, now?, store?)` become `async`, read-through (memory → `store.get(key)` → null) and write-through (memory + `store.set(key, texts)`); `store` defaults to a thin Mongo adapter `{ get, set }` whose failures are logged `[material-extract] transcription store <op> failed` and treated as a miss; tests inject an in-memory store.

- [ ] **Red:** with an injected store and a stub vision call: first `transcribeImagesBatch` → 1 model call and `store.set` called with the key; `clearTranscriptionCache()` (memory only) then a second call → 0 model calls, texts from the store; a different `promptVersion` → a new key → model called again; a store that throws → the read still runs and succeeds.
- [ ] **Green:** implement; keep the in-flight join as is; memory TTL stays 1 h, the store TTL 7 days.
- [ ] Run the material-extract tests + tsc → green; commit `feat(material-extract): the photo-read cache is stored in Mongo for a week and keyed on the read prompt, so a re-upload reproduces the same text and every problem hits the build cache (G6)`.

## Task 8: Gates

- [ ] Engine: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npm run test:all 2>&1 | tee /private/tmp/claude-501/-Users-luke-Dev-evelynlearning/69c99f4c-1ff6-47dd-a53d-ee5a5cfb9d62/scratchpad/engine-test-all-r8.txt | tail -n 5` → exactly the two baseline FAILs; `npx tsc --noEmit -p .` clean.
- [ ] Restart the local stack: `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh stop; … start; … status`.

## Task 9: Live acceptance (Praveen)

- [ ] Re-upload `/Users/luke/Downloads/worksheet6_clean.png` on `http://localhost:3016/app`. The restart emptied the in-memory read cache; with Task 7 the read is remembered in Mongo from this upload on — the NEXT re-upload should rebuild nothing (watch `[material-extract] vision transcription reused` and `[homework-build] … ms=0`). Expected: p1 V points right (E right of A and B); p2 thumbnail present (incircle); p3 whole lighthouse with "60 m" and both arcs; p5 shaded ring segments, inner square white; p5 "12 cm" confirmed AND followed by the next question in the same reply.
- [ ] Then the deploys as in the round-7 plan (tell GAC first).

## Deferred / proposals (for Praveen)

- **Session prefix cost (G6b):** the brain's cached prefix is ≈108k tokens (core system prompt ≈ 55k, 55 tool schemas ≈ 30k, session part ≈ 9k). A one-problem session could send a homework-only tool subset (≈ 12 tools, ≈ 8k tokens) and the long-deferred prompt audit could trim the core. Each new session that finds the shared cache cold pays ≈ $0.43 for the write; every call reads the prefix at ≈ $0.02. Not in this round — a decision for Praveen.
- **Vision verification of the built figure against the sheet** (render the thumbnail to PNG with `sharp`, ask a vision model to compare with the page, feed differences back once). Needs the sheet bytes at build time (today they are not persisted). Would also catch G1-class read errors the position claims cannot. Not in this round.
- Figure vocabulary expansion spec — unchanged, separate session.
