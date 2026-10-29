# GAC Homework Help — Acceptance Round 7 Fix Plan (hw-14, worksheet6_clean.png)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Every task that fixes a reported defect follows superpowers:systematic-debugging: the root cause below was pinned from logs and the stored build row, but each task still reproduces it with a failing test before changing code.

**Goal:** Fix the nine defects Praveen found on 2026-10-22 with `/Users/luke/Downloads/worksheet6_clean.png` (set hw-14, engine plan `gen-737ba255-f5af-4461-b3d4-f16ae83df414`) without changing behaviour for any session that is not a one-problem homework session.

**Architecture:** Same two worktrees as the per-problem redesign. Engine: `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct` (`apps/tutor`, branch `gac-29oct`, HEAD `2e886942`). Academy: `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` (branch `gac-29oct`, HEAD `58871e91`). Both repos deliberately NOT merged with `origin/main`. Local stack for live checks: `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh start|stop|status` → `http://localhost:3016` (engine :3007, api :4015, web :3016, tunnel :2710 = LIVE DBs).

**Tech Stack:** TypeScript; engine tests are `apps/tutor/scripts/test-*.ts` run with `npx tsx` (registered as `test:*`); academy tests are vitest run from the worktree root with `tests/...` paths plus the mock engine in `apps/mock-engine`.

**Parent spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-20-gac-homework-per-problem-design.md` · **Parent plan:** `/Users/luke/Dev/evelynlearning/docs/superpowers/plans/2026-10-20-gac-homework-per-problem-plan.md` · **Ledger:** `/Users/luke/Dev/evelynlearning/docs/superpowers/plans/2026-10-20-gac-homework-per-problem-ledger.md`

## Evidence (read before any task)

Pulled on 2026-10-22 from `/Users/luke/.evelyn/gac-local/engine.log` and a read-only dump of the engine's `HomeworkBuild` row + `TutorSession` rows (the dump is at `/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/15830315-d582-4d0a-9242-e8fb900a72aa/scratchpad/hw14-dump.txt` while that scratchpad lives; the facts below are what matter):

| # | Praveen's finding | Root cause (pinned unless marked OPEN) |
|---|---|---|
| F1 | "the image showed up and then it vanished when the Q-pin showed up" (problem 1) | **OPEN.** Problem 1 has NO pre-built figure (build rejected, see F4a); the tutor drew it live with `show_geometry` in the opener turn (text session). The session's debug events show `tool_call showGeometry`, `auto_new_page_first`, then `qpin_set` — no clear, no page change. Task 9 reproduces it. |
| F2 | "problem drawer still shows the figure description" | `ProblemPanel` calls `problemTextForDisplay(text, !!figure)` — the `[Figure: …]` block is stripped only when a figure was drawn. Problems 1–3 had none. |
| F3 | "'saving your work' screen (takes longer when I click finished the problem)" | `HomeworkProblemSession.end()` awaits `/api/sessions/live-result` on finish; the API's `recordHomeworkOutcome` awaits the engine's outcome + prior-note model call before answering. Pause is already non-blocking, but `router.push(listPath)` still compiles/renders the list route (no prefetch). |
| F4 | "thumbnails not showing on some problems" | Not a thumbnail bug: problems 1, 2, 3 have `figure=no` because the validator rejected every attempt (F4a–c). Problems 4–8 have thumbnails. |
| F4a | problem 1 figure rejected | `point V is in the figure description but not drawn` — the description says `Segments AE and BE form a "V" shape`; `namedPointsIn` takes the quoted V as a point. |
| F4b | problem 2 figure rejected ("Prob #2 - Fig incorrect" is the tutor's live sketch) | Attempt 1 used the solver's `incircle` step (`{"id":"inc","kind":"incircle","vertices":[…]}`); `validateGeometry` registers circles only for specs with a string `center` field, so NO circle was registered and every `on_circle` claim failed ("names circle incircle / inc but the solver has no such circle"). Attempt 2 used `triangle_center`+`circle` (center I): `circles` then held `inc` AND the alias `I`, so the "exactly one circle" fallback for the claim name `incircle` did not fire. |
| F4c | problem 3 figure rejected ("height not labeled on the lighthouse" is the tutor's live sketch; the rejected pre-built figure DID carry `"60 m"`) | Claims reader named `Boat1`, `Base`, `Boat2` (the sheet's words); the figure labels its points `"Boat 1"`/`"Boat 2"` with ids `P1`/`P2` and leaves the base point unlabeled. `checkClaims` resolves names by point id only and skips unresolvable names only when they match `/^[a-z]{3,}$/` (lower case). |
| F5 | problem 7 cost an extra attempt | `label "x°" does not come from the problem text` although the text says `x° at the lower-left vertex` — `labelIsFromText` tokenises the text to `x` + `°` so the single token `x°` is not a word. Passed on attempt 2 with label `x` (so the board shows `x`, the sheet shows `x°`). |
| F6 | "prob #4 - it didn't catch my 'complimentary' angles error" | Student wrote "Consecutive angles are complimentary: 6y + 30 = 180 …". The keyed verdict confirmed part (b) by VALUES (`[keyed-verdict] part=b verdict=correct`), the `checked-correct-denial` guard armed, and the brain's keyed-correct frame says nothing about the student's stated reasoning, so the tutor restated the correct working and never named the wrong word. |
| F7 | "prob #5 - it denied my first answer about the diagonal of the inner square!" | Tutor asked "what's the diagonal of that inner square?"; student typed `12 cm`; `keyedVerdicts` → single-part key `41.10 cm²` → `bareNumber("12 cm")` is an *explicit* candidate → `judgeValues` → `incorrect` → `[keyed-verdict] part= verdict=incorrect` → the tutor denied a correct intermediate answer. A bare number is judged as if it were the final answer whatever the tutor just asked. |
| F8 | "prob #8 fig is incorrectly drawn" | Stored figure: `{"action":"showGraph","type":"function","data":{…,"functions":[{"expression":"2.5*cos(3*x*pi/180)+0.5"}]}}`. The validator and the build-time thumbnail accept `expression` (`functionSourceOf`), and the stored thumbnail is right (maxima 3 at 0/120/240/360). The LIVE board renderers read only `expr | latex | fn`: `DesmosGraphRenderer.getLatex` returns `"x"` and the Mafs fallback uses `parseFunctionString(fn.expr || fn.latex || fn.fn || 'x')` — the board draws **y = x**. Also the thumbnail's y-axis tick labels sit at `axisX − 6` with `text-anchor=end`, which is outside the SVG when the y-axis is at the left edge (xRange starts at 0): the PNG of the stored SVG shows no y labels. |
| F9 | (not reported, seen in the dump) problem 3's live sketch and problem 2's live sketch were wrong | Consequence of F4b/F4c: no pre-built figure → the opener draws from the description. Fixed by F4. No separate task. |

## Global Constraints

- **GAC engine frozen for non-homework sessions.** Every engine change below is either inside `homework-build/`, inside a `homeworkProblemRef.current != null` / one-problem branch, or an additive field read (Task 7's renderer fallback reads a field no existing session ever sent). No system-prompt text outside the homework-problem block changes; if a prompt file under the shared-cache hash set changes, run `npx tsx scripts/gen-system-prompt-hashes.ts`.
- **No API spend in tests.** Model calls stay behind the injectable `deps`; tests inject stubs. Live verification = Praveen re-uploads worksheet6 on `http://localhost:3016` (Task 12).
- **The key never reaches the browser** (unchanged). **No portal-contract bump**: the academy's new `checking` status is local to the academy.
- Prompts stay generic (never a topic-specific example such as "complementary"): rules are stated structurally.
- Commit per task on `gac-29oct` in the relevant repo; message body names the finding (F-number) and the cause; trailer lines `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01Q4Nu3g3ap8MJQvqRcbiozq`. No push, no amend, no deploy.
- Engine gate after the last engine task: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npm run test:all` (baseline: exactly 2 failures, `test:embed-debug-coverage` and `test:portal-student-scoping`; exit 1 as always) and `npx tsc --noEmit -p .`. Academy gate: `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npm test` (typecheck + vitest; 6934 green at `3d4af2f1`).
- Cached figures: `runner.ts` re-validates a cached ready figure with the current validator before copying it, so a re-upload of worksheet6 within 24 h rebuilds problems 1–3 (they are not cached as ready) and re-checks 4–8. Task 7 must make the cached problem-8 graph come out with `expr` (normalise on copy or reject so it rebuilds).

## Review Focus

1. **A bare number that is wrong for the final answer but right for the tutor's intermediate question** (F7) must never be `incorrect` from the keyed verdict; a bare number that matches the key still confirms. Pinned by Task 5's table.
2. **Values right, words wrong** (F6): the tutor confirms the values and corrects the term in one sentence, and the `checked-correct-denial` guard does not withhold that sentence. Pinned by Task 6.
3. **Claims that name points by the sheet's words** (F4c) resolve by label when a label matches after normalisation and are skipped (not failed) when nothing matches; a missing single-letter id still fails. Pinned by Task 2.
4. **`incircle`/`circumcircle` steps** register their circle for claims (F4b). Pinned by Task 3.
5. **Finish is as instant as Back-to-list** (F3), the list shows "Checking your work…" until the record lands, and the final chip is still right. Pinned by Task 10.
6. **No behaviour change outside one-problem sessions** — every engine test file that exists today still passes with the same counts; the two baseline failures stay exactly two.

---

## File structure

**Engine** (`/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor/`)
- Modify `src/lib/tutor/homework-build/figure-validate.ts` — `namedPointsIn` (quoted letters, "V shape"), `labelIsFromText` (trailing `°` on a single token), `checkClaims` (resolve names by id/label, skip unresolvable words of any case, one-circle fallback counts distinct circles), `validateGeometry` (register circles by solver id).
- Modify `src/lib/tutor/diagrams/geometry-solver.ts` — solved circles carry `id` (additive).
- Modify `src/lib/tutor/homework-build/figure-build.ts` — `normalizeFigureDisplay` (or a sibling `normalizeGraphFigure`) rewrites `functions[].expression` → `expr`.
- Modify `src/lib/tutor/homework-build/runner.ts` — the cached-figure copy path normalises graphs too.
- Modify `src/lib/tutor/homework-build/graph-svg.ts` — y tick labels stay inside the SVG when the axis is at the left edge.
- Modify `src/app/tutor/components/whiteboard/DesmosGraphRenderer.tsx` (`getLatex`) and `GraphRenderer.tsx` — accept `expression` as a last fallback (additive).
- Modify `src/lib/tutor/voice/keyed-verdict.ts` — bare / unnamed values confirm but never deny.
- Modify `src/lib/tutor/voice/claude-brain.ts` (keyed-correct frame) and/or `src/lib/tutor/voice/homework-problem-turn.ts` — "values confirmed; correct a wrong stated term".
- Modify `src/lib/tutor/lesson-plan/homework-problem-meta.ts` / `src/app/tutor/components/session/ProblemPanel.tsx` — description always stripped from the drawer.
- Investigate/modify `src/app/tutor/components/session/SessionStage.tsx`, `TutorSession.tsx`, `whiteboard/WhiteboardCanvas.tsx` for F1.
- Tests: `scripts/test-homework-figure.ts`, `scripts/test-homework-build.ts`, `scripts/test-homework-problem-brain.ts`, `scripts/test-problem-panel.ts`, `scripts/test-stage-geometry.ts` (+ a new `scripts/test-graph-svg.ts` only if no graph-svg test exists — check `grep -l graph-svg scripts/*.ts` first).

**Academy** (`/Users/luke/Dev/academy/.claude/worktrees/gac-29oct/`)
- Modify `apps/api/src/services/HomeworkSetService.ts` (`WorkStatus` + `checking`, `recordHomeworkOutcome` sets `checking` first), `apps/api/src/http/routes/core.ts` or `SessionService.ts` (live-result for a homework problem answers before the outcome), `apps/web/components/homework/status.ts` (chip), `HomeworkProblemList.tsx` (poll while `checking`), `HomeworkProblemSession.tsx` (`end()` never awaits; `router.prefetch(listPath)`), `apps/mock-engine/src/server.ts` (slow-outcome hook already exists: `slowoutcome`).
- Tests: `tests/integration/homework-set.test.ts`, `tests/unit/homework-status.test.ts`, `tests/unit/embedded-session-end-request.test.ts` (unchanged unless the finish path moves).

---

## Task 1: `namedPointsIn` ignores quoted letters and letter-shapes (F4a)

**Files:** `src/lib/tutor/homework-build/figure-validate.ts`, `scripts/test-homework-figure.ts`

- [ ] **Red:** add to `test-homework-figure.ts` a case: `namedPointsIn('Segments AE and BE form a "V" shape that points right, with its vertex at E. Point A is on p.')` → `Set {A, E, B}` (no `V`). Also `'an "L" shape'`, `'a V-shaped notch'`, `'the letter T'` → no point. Keep: `'Point V lies on q'` → `V`. Run `npx tsx scripts/test-homework-figure.ts` → the new assertions fail.
- [ ] **Green:** in `namedPointsIn`, before the single-capital match, remove (a) a single capital inside straight or curly quotes (`"V"`, `'V'`, `“V”`, `‘V’`), (b) a single capital followed by `-shape`, ` shape`, `-shaped`, ` shaped`, and (c) `letter X`. Comment: `GAC acceptance 2026-10-22 (hw-14 p1): "V" shape`.
- [ ] Run the file → all pass; commit `fix(homework-build): a quoted letter or a "V shape" in the figure description is not a point (F4a)`.

## Task 2: Claims resolve point names by label; unresolvable words are skipped, not failed (F4c)

**Files:** `src/lib/tutor/homework-build/figure-validate.ts` (`checkClaims`, `validateGeometry`), `scripts/test-homework-figure.ts`

- [ ] **Red:** fixture = the hw-14 problem 3 figure from the evidence (points `B`,`T`,`P1` label `"Boat 1"`,`P2` label `"Boat 2"`,`H`,`G`; segments; angle markers) with claims `[{on_segment, point:'Boat1', segment:['Base','Boat2']}, {between, point:'Boat1', ends:['Base','Boat2']}]`. Expect `validateFigure(...).ok === true` (Boat1 → P1 by label, Boat2 → P2, `Base` unresolvable → the claim is skipped). Add: a claim naming `Q` (single letter, not drawn) still fails; a claim naming `apex` still skipped (existing rule).
- [ ] **Green:** `validateGeometry` builds `nameToId`: every solved point id, plus every given/step point `label` normalised with `normValueName`-style folding (lower case, no spaces, no punctuation) → its id. `checkClaims` takes that map (new optional parameter, default = identity) and resolves each claim name through it before `missing()`. Unresolvable names that are not a bare id shape (`/^[A-Z]\d?$/` or `/^[A-Z]{1,2}\d*$/`) are treated like the existing prose-word rule (claim skipped) regardless of case. Keep the lower-case rule's comment and extend it with the hw-14 p3 note.
- [ ] Run `test-homework-figure.ts` + `test-homework-build.ts` → green; commit `fix(homework-build): figure claims resolve the sheet's point names by label and skip words no drawing can carry (F4c)`.

## Task 3: `incircle`/`circumcircle` circles are registered for claims; the one-circle fallback counts distinct circles (F4b)

**Files:** `src/lib/tutor/diagrams/geometry-solver.ts` (circle output gains `id`), `src/lib/tutor/homework-build/figure-validate.ts`, `scripts/test-homework-figure.ts`

- [ ] **Red:** two fixtures from the evidence: (i) attempt 1 (`{"id":"inc","kind":"incircle","vertices":["A","B","C"]}` + section points D/E/F with the sheet's ratios) with claims `on_circle D incircle`, `on_circle E incircle`, `on_circle F incircle` → expect ok (D, E, F are the tangent points only if the ratios are right — if the fixture's section ratios put them off the incircle the honest expectation is a `fails: … off the circle` reason, NOT `has no such circle`; assert on the reason text). (ii) attempt 2 (`triangle_center` incenter `I` + `circle` id `inc` center `I`) with the same claims → the circle resolves (`incircle` → the only circle). Both fail today with "has no such circle".
- [ ] **Green:** (a) `geometry-solver.ts`: push `id: obj.id` onto each solved circle (additive; the renderer ignores it — confirm `GeometryRenderer` props tolerate the extra field, `npx tsc --noEmit -p .`). (b) `validateGeometry`: match a spec circle to a solved one by `id` first, then the existing centre/radius match; register any solved circle not claimed by a spec under its own id too. (c) the one-circle fallback uses the count of DISTINCT circle objects (dedupe the alias map by identity), and a claim's circle name that matches no id/alias after folding resolves to the single circle when there is one.
- [ ] Run `test-homework-figure.ts`, `test-homework-build.ts`, `npx tsx scripts/test-geometry-solver.ts` if it exists (check `ls scripts | grep -i solver`) → green; commit `fix(homework-build): incircle and circumcircle steps register their circle for figure claims (F4b)`.

## Task 4: `labelIsFromText` accepts a single token with a trailing degree sign (F5)

**Files:** `src/lib/tutor/homework-build/figure-validate.ts`, `scripts/test-homework-figure.ts`

- [ ] **Red:** `labelIsFromText('x°', 'x° at the lower-left vertex, inside the pentagon.')` → true; `labelIsFromText('y°', same)` → false; `labelIsFromText('42°', '42° at B')` still true.
- [ ] **Green:** in the `pieces.length === 1` branch, when the token ends in `°`/`º` and is not itself a word of the text, test the token without the sign. Comment with the hw-14 p7 note.
- [ ] Commit `fix(homework-build): an angle label "x°" is from the text when the sheet writes x° (F5)`.

## Task 5: Keyed verdict — a bare or unnamed value confirms but never denies (F7)

**Files:** `src/lib/tutor/voice/keyed-verdict.ts`, `scripts/test-homework-problem-brain.ts` (the keyed table lives there — `grep -n "keyedVerdict" scripts/test-homework-problem-brain.ts`)

- [ ] **Red:** with key `{parts:[{label:'',final:'41.10 cm²',canonical:{kind:'number',value:41.1,units:'cm²'}}]}`: `12 cm` → `undecided`; `12` → `undecided`; `41.1` → `correct`; `41.1 cm²` → `correct`; `the answer is 12` → `incorrect`; `it's 12 cm²` → `incorrect`; `area = 12` → `incorrect` only if `keyVarOf(part)` matches (it does not here → `undecided`). With key `x = 27` (part a of a 3-part key): `x = 20` → `incorrect` (unchanged); `20` alone → `undecided` (today: multi-part keys already only confirm unlabeled values — assert it); `a) 20` → `incorrect` (label = explicit offer).
- [ ] **Green:** in `judgeValues`, a candidate counts as an explicit final offer only when it was named (assigned to the key's variable via `keyVar`, placed after a part label, or introduced by an answer phrase — "the answer is", "it is/it's", "I get/got … as the answer", "= value" as the whole message's last equation when the lhs is the key's variable). The `bareNumber` candidate and a head candidate with no lead become `explicit: false`. Update the file's header comment (the "as the whole message" clause goes; say why: hw-14 p5, the tutor's intermediate question). Keep `textMatchesPart` confirmations.
- [ ] Run `npx tsx scripts/test-homework-problem-brain.ts` (114 today) → green with the new rows; commit `fix(keyed-verdict): a bare number answers the tutor's question, not the key — it confirms but never denies (F7)`.

## Task 6: Values confirmed, wrong term corrected (F6)

**Files:** `src/lib/tutor/voice/claude-brain.ts` (where `keyedPrecheckResult` is turned into the verdict frame, ~line 2511) and/or `src/lib/tutor/voice/homework-problem-turn.ts`; `scripts/test-homework-problem-brain.ts`

- [ ] **Red:** a prompt-shape test: build the keyed-correct frame for a confirmed part and assert it contains a rule of this shape (generic wording, no example topic): the key confirms the VALUES only; when the student's message also states a reason, name, or relationship, check it against the problem's facts; if a stated term is wrong, confirm the values AND correct the term in one sentence; never let a confirmed value stand in for a wrong explanation. Also assert `deniesCheckedAnswer('That value is right; the pair is supplementary, not complementary.', '110')` is false (the guard must not withhold a term correction).
- [ ] **Green:** add the clause to the keyed-correct frame (one-problem sessions only — the frame is built only when `hpKey` exists). If `deniesCheckedAnswer` would trip on "not …" phrasing, narrow it to denials of the VALUE (it already matches the confirmed value string; verify, do not widen).
- [ ] Run the brain test → green; if any prompt text under the shared-cache hash set changed, run `npx tsx scripts/gen-system-prompt-hashes.ts` and commit the hash file with it. Commit `fix(homework-problem): a keyed-correct turn corrects a wrong stated term while confirming the values (F6)`.

## Task 7: Graph figures carry `expr`; renderers accept `expression`; thumbnail y labels stay inside (F8)

**Files:** `src/lib/tutor/homework-build/figure-build.ts`, `runner.ts`, `graph-svg.ts`, `src/app/tutor/components/whiteboard/DesmosGraphRenderer.tsx`, `GraphRenderer.tsx`; tests `scripts/test-homework-build.ts`, `scripts/test-homework-figure.ts` (+ graph-svg test if present)

- [ ] **Red:** (a) `normalizeFigureDisplay(<the hw-14 p8 showGraph figure>, text).data.functions[0]` has `expr === '2.5*cos(3*x*pi/180)+0.5'` and no `expression`. (b) runner test: a cached ready graph figure whose function has only `expression` is copied with `expr` (extend the existing cached-figure re-validation test). (c) `getLatex({ expression: 'x^2' } as any)` → `'x^{2}'`-shaped latex, not `'x'`; `GraphRenderer`'s evaluator source helper (extract the `fn.expr || fn.latex || fn.fn || 'x'` expression into a tiny exported helper so it is testable) returns the `expression` text. (d) graph-svg: for `xRange:[0,360]` the SVG contains `<text … >3</text>` and `>-2<` y labels at `x ≥ 0`.
- [ ] **Green:** (a) `normalizeFigureDisplay` handles `showGraph`: for each `data.functions[i]` with `expression` and no `expr`, move it to `expr` (also `functionsOfY` if the type has them). (b) runner: pass the cached figure through the same normaliser when copying. (c) `getLatex`: `fn.expression` as the last fallback before `variable`; same in `GraphRenderer`. (d) `graph-svg.ts`: when `axisX - labelWidth < M.l`, either widen `M.l` to fit the widest y label (measure ≈ 7 px per character) or place y labels at `axisX + 6` with `text-anchor=start`.
- [ ] Run `test-homework-build.ts` (63), `test-homework-figure.ts` (8+), `npx tsc --noEmit -p .` → green; commit `fix(homework-build): graph figures store expr so the board draws the same curve as the thumbnail; y tick labels stay inside (F8)`.

## Task 8: The problem drawer never shows the figure description (F2)

**Files:** `src/app/tutor/components/session/ProblemPanel.tsx` (and `problemTextForDisplay` if a cleaner signature is wanted), `scripts/test-problem-panel.ts`

- [ ] **Red:** render `ProblemPanel` with `figure: null` and text containing `[Figure: …]` → the rendered text does not contain `[Figure:`; with `[Graph: …]` likewise. The tutor prompt path (`homeworkProblemOf`/the block builder) still carries the full text — assert via the existing brain/plan test that the description reaches the brain block.
- [ ] **Green:** `problemTextForDisplay(text, true)` in the panel (or drop the `hasFigure` parameter and update its two callers); update the panel's doc comment (the owner's ruling 2026-10-22: the drawer carries the problem text only; the student has the sheet).
- [ ] Run `test-problem-panel.ts` (27) → green; commit `fix(problem-panel): the drawer shows the problem text only, never the read's figure description (F2)`.

## Task 9: Live-drawn figure vanishes when the Q-pin appears (F1) — reproduce, then fix

**Files:** TBD by the investigation — `src/app/tutor/components/session/SessionStage.tsx` (static pin row above the board card, line ~1198), `TutorSession.tsx`, `whiteboard/WhiteboardCanvas.tsx`; tests `scripts/test-stage-geometry.ts` / `test-problem-panel.ts`

- [ ] **Reproduce** (superpowers:systematic-debugging Phase 1): start the local stack, open hw-14 problem 1 (no pre-built figure; the tutor draws `show_geometry` in the opener) in a TEXT session; watch the board after `qpin_set`. Capture: the board card's height before/after the pin row appears (`boardCardRef`), the canvas `currentIndex`/page count, and horizontal scroll (`allowHorizontalScroll` is on in text mode). Also check the `renderableCommands.length === 1 && !showLead` single-item layout and whether `suppressEmptyState` / `boardEmpty` flip. If the local stack cannot be used (no API spend for the opener? — one opener turn ≈ $0.02, acceptable; ask Praveen only if a second attempt is needed), reproduce in a jsdom/React test by rendering `SessionStage` with `problemPanel` set, one `showGeometry` command, then toggling `questionPin` from null to a node, and asserting the board item is still in the DOM with a non-zero box.
- [ ] **Hypotheses to test in order:** (1) the pin row (`shrink-0`, `mb-2`) is a flex sibling of a board card that is `h-full`; the card overflows and the canvas re-measures to a smaller/zero content box → the first page's single-item layout hides or clips the item; (2) in text mode the single-item layout centers/scrolls horizontally and the item is scrolled out of view; (3) the `tutorBusy` → not-busy transition at turn end (same moment as the pin) triggers a page/`currentIndex` change in `WhiteboardCanvas`. Write the failing test for the confirmed hypothesis, fix at the root (e.g. the card becomes `flex-1 min-h-0` when the static pin is present, or the pin row lives inside the card header), keep the change inside the `qpinStatic` branch.
- [ ] Run `test-stage-geometry.ts` (55), `test-problem-panel.ts`, `test-host-lesson.ts` (61) → green; commit `fix(session-stage): the board keeps its drawing when the static Q-pin row appears in a one-problem session (F1)`. If the reproduction fails twice, STOP and record the evidence in the ledger instead of guessing.

## Task 10 (academy): Finish hands over at once; the card says "Checking your work…" until the record lands (F3)

**Files:** `apps/api/src/services/HomeworkSetService.ts`, the live-result handler that calls `recordHomeworkOutcome` (grep `recordHomeworkOutcome` under `apps/api/src`), `apps/web/components/homework/status.ts`, `HomeworkProblemList.tsx`, `HomeworkProblemSession.tsx`, `apps/mock-engine/src/server.ts` (`slowoutcome` hook), tests `tests/integration/homework-set.test.ts`, `tests/unit/homework-status.test.ts`

- [ ] **Red (API):** integration test with the mock engine's `slowoutcome` hook (outcome answers after ~3 s): POST `/api/sessions/live-result` for a problem session returns within 500 ms; immediately after, GET the set → that problem's `work.status === 'checking'`; after the mock's delay the status is `done` (use `allconfirmed`) and `outcomeRecordedFor` is set. A pause (`/sessions/ended`) never sets `checking`. A `done` problem re-finished never drops to `checking` (mergeOutcomeStatus).
- [ ] **Red (web):** `problemChip({build:'ready', work:{status:'checking'}})` → `{label:'Checking your work…', tone:'brand'}`; `setProgressLabel` ignores `checking`; the list's poll predicate (extract/reuse the "still preparing" refresh predicate) is true while any problem is `checking` and stops after it resolves or after 90 s.
- [ ] **Green:** `WorkStatus` gains `'checking'` (API type + web type + Mongo enum if the schema enumerates it); `recordHomeworkOutcome({finished:true})` first does a conditional `updateOne` setting `work.status='checking'` (only when the current status is `in_progress`/`not_started`/`needs_review`, never `done`), then continues as today; the live-result handler calls `recordHomeworkOutcome` without awaiting it (`void …` with its own catch; the handler already answers the browser) — keep the session's own finalisation awaited as it is today. Web: `end()` no longer awaits any path (`keepalive: true` for both), `router.prefetch(listPath)` in a mount effect, and the list page's existing refresh loop also runs while a chip is `checking`. The chip copy must pass `e2e/greenapple-copy.spec.ts` (no banned words).
- [ ] Run `npx vitest run tests/integration/homework-set.test.ts tests/unit/homework-status.test.ts tests/unit/embedded-session-end-request.test.ts`, `npm run typecheck`, `npm run typecheck:web` → green; commit `fix(homework): finishing a problem returns to the list at once; the card reads "Checking your work…" until the outcome is recorded (F3)`.

## Task 11: Gates

- [ ] Engine: `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npm run test:all 2>&1 | tee /private/tmp/claude-501/-Users-luke-Dev-evelynlearning/<session>/scratchpad/engine-test-all-r7.txt | tail -n 5` → exactly the two baseline FAILs; `npx tsc --noEmit -p .` clean.
- [ ] Academy: `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npm test` → green; `npx playwright test --project=greenapple e2e/greenapple-homework.spec.ts e2e/greenapple-copy.spec.ts` → green.
- [ ] Restart the local stack: `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh stop; bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh start; bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh status`.

## Task 12: Live acceptance (Praveen)

- [ ] Re-upload `/Users/luke/Downloads/worksheet6_clean.png` on `http://localhost:3016` (problems 1–3 rebuild; 4–8 come from the cache, re-validated and re-normalised). Expected: thumbnails on all eight cards (p1 parallel lines, p2 incircle, p3 lighthouse with "60 m"), p8 board curve = thumbnail curve with y labels, drawer = text only, problem 5 "12 cm" to the diagonal question not denied, problem 4 "complimentary" named and corrected, finish → list at once with "Checking your work…" → Done.
- [ ] Then: TEST-CASES.md §2b remaining items (Done/reopen, idle timeout, teacher view) → deploys after telling GAC (frozen engine): `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct && ./deploy-tutor-gac.sh`, then `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && ./deploy-greenapple.sh`, nginx `proxy_read_timeout 120s` by hand, `git push origin gac-29oct` in both.

## Deferred (not in this round)

- Figure vocabulary expansion (stats displays, tables, number lines, 3D solids, Venn/tree, fraction/tape/area models): `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-21-gac-homework-figure-vocabulary-design.md` → superpowers:writing-plans → SDD in its own session (Praveen's ruling 2026-10-22).
- "Reading problem 1 of 8" progress copy — impossible (one read call); the bar already names the stages.
- The reopen-after-pause race (prior-work note written in the background) — bounded by the recap call; no fix planned.
