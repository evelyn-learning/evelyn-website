# GAC homework round 11 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The answer key carries a verified solution path the live tutor follows; the question pin sits in the whiteboard flow under the figure; the homework list polls after "Back to list" as it does after a finish.

**Architecture:** Engine (Next.js app `apps/tutor` in the `gac-29oct` worktree): the two key solves also emit `steps`; the agreeing Opus path is stored on `AnswerKey.steps`, rendered into the homework `<active_problem>` block and the model check's facts; the pin moves from a static row in SessionStage to a context-fed slot in WhiteboardCanvas. Academy (`apps/api` + `apps/web` in its `gac-29oct` worktree): a pause marks `checking` like a finish and the list page polls on `?paused=n`.

**Tech Stack:** TypeScript, Next.js, React 19, mongoose (engine); Express + Next.js + vitest (academy). Engine tests are `npx tsx scripts/test-*.ts` scripts with a local `section()` helper; academy tests are vitest.

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-22-gac-homework-round11-design.md`

## Global Constraints

- Engine worktree: `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct` (branch `gac-29oct`, HEAD `8ef5aca5`). Academy worktree: `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` (branch `gac-29oct`). Never run commands from the main checkouts; never `git stash`.
- No model calls in tests; every solve/propose dep is stubbed (`KeySolveDeps`, `FigureBuildDeps`). `npm run test:all` makes one pre-existing live vision call; nothing new may.
- Engine tests that need Mongo use `TEST_MONGODB_URI` or `mongodb://127.0.0.1:27017/evelyn-test-…`; never port 2710 (prod tunnel).
- Shared solver/renderer behaviour for sessions without `problemPanel` is byte-identical (GAC pinned engine); the static-markup pins in `scripts/test-stage-qpin-static.tsx` for non-one-problem sessions must keep passing unchanged.
- Prompt text added to the live frame is generic: no topic examples (feedback_generic_prompts).
- Copy fixed by the spec is used verbatim (the solution-path heading and rule; the KEY_SOLVE rule 6 wording below).
- Commit after each task with the Co-Authored-By / Claude-Session trailer used on `8ef5aca5`.

## Review Focus

1. A key whose solver returned `steps` with an empty `relation` or more than 8 entries: the extra/empty steps are dropped, the finals still agree, the key is stored (Task 1 test).
2. A cached problem built before this round (key without `steps`, figure present): the re-upload re-solves the key only, keeps `figure`/`figureSvg`, and stores `steps` (Task 2 test).
3. A verified key with no steps at all (solver omitted them): the live frame prints no path heading and no rule (Task 3 test).
4. A one-problem session on board page 2 (no lead figure on that page): the pin renders at the top of that page, still sticky; a session without `problemPanel` renders no slot content and the floating pin exactly as before (Task 4 tests).
5. A pause whose outcome lands `in_progress`: the list shows "Checking your work…" while `checking`, then "In progress", and stops polling within the min window + one read; a pause pressed twice (second end call) is a no-op (Task 5/6 tests).

---

### Task 1: `AnswerKey.steps` from the solves (engine)

**Files:**
- Modify: `apps/tutor/src/lib/tutor/homework-build/types.ts` (AnswerKey, ~line 36)
- Modify: `apps/tutor/src/lib/tutor/homework-build/key-solve.ts` (KEY_SOLVE_SYSTEM rules, KEY_SOLVE_SCHEMA, `SolveOutcome`, `normalizeKeyParts`, `solveKey`)
- Test: `apps/tutor/scripts/test-homework-build.ts` section `4 key`

**Interfaces:**
- Produces: `export interface KeyStep { relation: string; value?: string }`; `AnswerKey = { parts: AnswerPart[]; solvers: string[]; steps?: KeyStep[] }`; `export function normalizeKeySteps(raw: unknown): KeyStep[]` (drops entries without a non-empty `relation`, trims, keeps the first 8, `value` only when non-empty); `SolveOutcome = { parts: AnswerPart[] | null; steps?: KeyStep[]; usage? }`; `solveKey` result `key.steps` = steps of the agreeing solver named `'plangen-vision'` when it is one of the agreeing pair (`names` index 1 or the tie-break's name when that is the Opus role — use the dep name, not the index), else the first agreeing solver's; omitted when that solver returned none.

- [ ] **Step 1: Write the failing tests** in section `4 key`:

```ts
await section('round 11: steps ride the solve; the Opus solver\'s path is stored; agreement stays finals-only', async () => {
  const sA = [{ relation: 'base angles equal', value: '∠B = ∠C' }];
  const sB = [{ relation: 'exterior angle = sum of remote interior', value: '(5x + 5) = 40 + ∠B' }, { relation: 'solve', value: 'x = 21' }];
  const d = mk([num('x = 21', 21, 'a')], [num('x = 21', 21, 'a')], null, { a: sA, b: sB });   // mk gains an optional steps map
  const r = await solveKey({ n: 1, text: 'q' }, { ...d, names: ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'] });
  assert.deepEqual(r.key!.steps, sB, 'the plangen-vision (Opus) path');
  const r2 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('1', 1)], [num('1', 1)], null, { a: sA }), names: ['A', 'B', 'T'] });
  assert.deepEqual(r2.key!.steps, sA, 'first agreeing solver when neither is plangen-vision');
  const r3 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('1', 1)], [num('2', 2)], [num('2', 2)], { b: sB }), names: ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'] });
  assert.deepEqual(r3.key!.solvers, ['plangen-vision', 'plangen-vision-tiebreak']); assert.deepEqual(r3.key!.steps, sB);
  assert.equal((await solveKey({ n: 1, text: 'q' }, mk([num('1', 1)], [num('1', 1)], null))).key!.steps, undefined, 'no steps → field absent');
});
await section('round 11: normalizeKeySteps drops empty relations, caps at 8, trims, omits empty values', () => {
  const { normalizeKeySteps } = …;
  assert.deepEqual(normalizeKeySteps([{ relation: ' a ', value: ' 1 ' }, { relation: '', value: '2' }, { relation: 'b', value: '' }, null, 'x']), [{ relation: 'a', value: '1' }, { relation: 'b' }]);
  assert.equal(normalizeKeySteps(Array.from({ length: 10 }, (_, i) => ({ relation: `s${i}` }))).length, 8);
  assert.deepEqual(normalizeKeySteps(undefined), []);
});
await section('round 11: KEY_SOLVE_SYSTEM asks for steps; the schema carries them', () => {
  assert.ok(KEY_SOLVE_SYSTEM.includes('6. steps:'));
  assert.ok((KEY_SOLVE_SCHEMA.properties as Record<string, unknown>).steps);
});
```

- [ ] **Step 2: Run** `cd /Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/apps/tutor && npx tsx scripts/test-homework-build.ts 2>&1 | grep -E "✗|round 11|passed, "` — expected: the three new sections FAIL.

- [ ] **Step 3: Implement.** Rule 6 appended to `KEY_SOLVE_SYSTEM`, verbatim: `6. steps: the solution path a tutor would walk the student along — one entry per step, in order. relation is the fact, theorem or equation the step uses (one sentence, at most 25 words); value is that step's intermediate result exactly as a student would write it ("AE = 4", "(5x + 5) = 40 + ∠B"), or "" when the step yields none. At most 8 steps. Every number in the finals must be reachable from these steps.` Schema: `steps: { type: 'array', items: { type: 'object', properties: { relation: { type: 'string' }, value: { type: 'string' } }, required: ['relation', 'value'], additionalProperties: false } }` and `required: ['parts', 'steps']`. `callSolve` returns `{ parts, steps: normalizeKeySteps(json.steps), usage }`. `solveKey`'s `safe` keeps each solver's steps alongside its parts; the agreeing branch picks per the Interfaces rule and sets `steps` only when non-empty. `mk` in the test gains a 4th optional argument `{ a?, b?, t? }` of steps.

- [ ] **Step 4: Run** the same command — expected: all sections pass (75 + 3). Then `npx tsc --noEmit -p tsconfig.json` — clean.

- [ ] **Step 5: Commit** `feat(homework-build): the answer key carries the agreeing solver's solution path (round 11)`.

### Task 2: Cached key without steps re-solves the key only (engine)

**Files:**
- Modify: `apps/tutor/src/lib/tutor/homework-build/runner.ts:56-118` (`buildOne`)
- Test: `apps/tutor/scripts/test-homework-build.ts` — the runner section that drives `runHomeworkBuild` with stub deps and a local mongod (section 1; skipped without Mongo — keep the test there and also add a pure test if a pure seam exists; the implementer reports which ran)

**Interfaces:**
- Consumes: Task 1's `AnswerKey.steps`.
- Produces: in `buildOne`, `const keyStale = cached?.status === 'ready' && !!cached.key && !cached.key.steps?.length;` — when `keyStale`, the figure fields are copied exactly as the cached-copy branch does (figure normalised + re-validated, `figureSvg`), `solveKey(p, deps.key)` runs, and `patch.key`/`patch.verify`/`status` come from that solve (`unverified` when it fails, keeping the figure).

- [ ] **Step 1: Write the failing test**: seed a `HomeworkBuild` doc for another plan whose problem (same text hash) is `ready` with `figure` (a trivial valid geometry), `figureSvg: '<svg/>'`, `key: { parts: [num 20], solvers: ['A','B'] }` (no steps); run `runHomeworkBuild` for a new plan with the same problem text and stub deps where `solveKey` returns `{ parts, steps: [{ relation: 'r', value: 'v' }] }` and the figure dep would throw if called. Assert: the new problem is `ready`, `figure` equals the cached figure, `figureSvg === '<svg/>'`, `key.steps` is the stub's, the figure dep was never called.

- [ ] **Step 2: Run** `npx tsx scripts/test-homework-build.ts` with `TEST_MONGODB_URI` pointing at a local mongod (start one if needed: `mongod --dbpath <scratch> --port 27017`; never 2710) — expected: FAIL (the cached copy is used, no steps).

- [ ] **Step 3: Implement** the `keyStale` branch in `buildOne` between the cached-copy branch and the figure-retry branch, with the comment `round 11: a key built before the solution path is re-solved; the figure is copied`.

- [ ] **Step 4: Run** the suite — pass; `tsc` clean.

- [ ] **Step 5: Commit** `fix(homework-build): a cached key without a solution path re-solves the key, keeps the figure (round 11)`.

### Task 3: The path in the live frame (engine)

**Files:**
- Modify: `apps/tutor/src/lib/tutor/voice/homework-problem-turn.ts:60-82`
- Modify: `apps/tutor/src/lib/tutor/voice/claude-brain.ts` (`activeProblem` type ~line 405-425; `formatActiveProblemBlock` homework branch)
- Modify: `apps/tutor/src/lib/tutor/voice/keyed-verdict.ts` (`keyedProblemFacts`)
- Test: `apps/tutor/scripts/test-homework-problem-brain.ts` (the `activeProblem` assertion at ~line 430; the `formatActiveProblemBlock` test at ~line 767)

**Interfaces:**
- Consumes: `AnswerKey.steps` (Task 1).
- Produces: `export function solutionPathLines(key: AnswerKey): string[]` in `keyed-verdict.ts` (`"<relation> → <value>"`, or `"<relation>"` without value; `[]` when no steps); `activeProblem.solutionPath?: string[]` on `BrainTurnInput`; `keyedProblemFacts(key)` = today's line + (when steps) `\nVerified intermediate steps: ` + lines joined by `; `.

- [ ] **Step 1: Write the failing tests**: (a) the turn test at ~430 with a key carrying two steps asserts `activeProblem.solutionPath` equals `['base angles equal → ∠B = ∠C', 'solve']`; with no steps the field is absent. (b) `formatActiveProblemBlock({ statement: 'S', source: 'homework', expectedAnswer: 'A', solutionPath: ['r1 → v1', 'r2'] }, { homework: true, partScope: false })` contains `Verified solution path (the derivation the key was checked with):`, the two lines on their own lines, and the spec's rule sentence starting `Guide along this path.`; without `solutionPath` neither the heading nor the rule appears (byte-identical to today's output — pin today's string first). (c) `keyedProblemFacts` with steps contains `Verified intermediate steps: r1 → v1; r2`; without steps it is unchanged.

- [ ] **Step 2: Run** `npx tsx scripts/test-homework-problem-brain.ts 2>&1 | grep -E "✗|round 11|passed, "` — expected: the new assertions FAIL.

- [ ] **Step 3: Implement** per Interfaces; the heading and rule copied verbatim from the spec §1 "Live use". The path block goes right after the `VERIFIED expected answer` line inside the homework branch, before the reveal suffixes.

- [ ] **Step 4: Run** the suite (136 + new pass) and `tsc`.

- [ ] **Step 5: Commit** `feat(tutor): the homework frame carries the verified solution path; the model check sees the steps (round 11)`.

### Task 4: Q-pin in the board flow (engine)

**Files:**
- Create: `apps/tutor/src/app/tutor/components/whiteboard/board-lead-pin-context.ts` — `export const BoardLeadPinContext = createContext<ReactNode | null>(null)`.
- Modify: `apps/tutor/src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx` (~1755-1770: after the `showLead` block, and at the top of the page wrapper on other pages)
- Modify: `apps/tutor/src/app/tutor/components/session/SessionStage.tsx` (~609 `qpinStatic`; ~1209 the static row; ~1795 the floating branch; wrap the board column children in `BoardLeadPinContext.Provider`)
- Test: `apps/tutor/scripts/test-stage-qpin-static.tsx` (existing pins must keep passing for non-one-problem sessions); add sections for the slot.

**Interfaces:**
- Produces: WhiteboardCanvas renders `<div data-wb-lead-pin="1" className="sticky top-0 z-20">{pin}</div>` when the context value is non-null: on page 1 directly after the lead item's separator (inside the `data-wb-lead-item` block when there is a lead, else as the page wrapper's first child); on any other page as the page wrapper's first child. SessionStage: `const pinInBoard = qpinStatic && qpinMode === 'expanded' ? questionPin : null;` provided via the context; the `question-pin-static` row is deleted; the floating branch condition stays `!qpinStatic`. The collapsed chip is unchanged.

- [ ] **Step 1: Write the failing tests** in `test-stage-qpin-static.tsx`: (a) one-problem session markup contains no `question-pin-static`; (b) a stub board child that reads `BoardLeadPinContext` renders the pin text when `problemPanel` is set and `questionPin` given, and `null` when `problemPanel` is absent; (c) WhiteboardCanvas rendered to static markup with `leadItem` and a context pin: in the markup `data-wb-lead-item` comes before `data-wb-lead-pin`, and `data-wb-lead-pin` comes before the first `data-wb-item-index`; with `currentIndex`/pages set to page 2 the slot is the page wrapper's first child; without a context value no `data-wb-lead-pin` is rendered (today's markup byte-identical — pin it first). Keep Part 1's byte-for-byte pins for the other session kinds.

- [ ] **Step 2: Run** `npx tsx scripts/test-stage-qpin-static.tsx` — expected: new sections FAIL, old pass.

- [ ] **Step 3: Implement** per Interfaces. Keep the F1 `flex-col items-center` / `flex-1 min-h-0` classes (harmless without the row).

- [ ] **Step 4: Run** the script (all pass; the headless-chromium part may report skipped) and `tsc`.

- [ ] **Step 5: Commit** `feat(session-stage): the one-problem question pin lives in the board flow under the figure (round 11)`.

### Task 5: A pause marks `checking` (academy API)

**Files:**
- Modify: `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct/apps/api/src/services/HomeworkSetService.ts:225-300` (`recordHomeworkOutcome`)
- Test: `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct/tests/integration/homework-set.test.ts` (~395-575)

**Interfaces:**
- Produces: `recordHomeworkOutcome` marks `checking` for every call whose problem is in `CHECKABLE` (finish or pause); `finished` still only controls the engine query param; restore-on-failure unchanged.

- [ ] **Step 1: Write/flip the tests**: `'a pause never sets "checking"'` becomes `'a pause marks "checking" and lands as in_progress'` (GET after `/sessions/ended` sees `checking` before the record lands, then `in_progress` with `outcomeRecordedFor` unset — a non-terminal verdict); keep `'a pause (/sessions/ended) sends no finished'`; add `'a pause whose outcome call fails leaves the status it had'` mirroring the finish test at ~561.

- [ ] **Step 2: Run** `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npx vitest run tests/integration/homework-set.test.ts` — expected: the flipped test FAILS.

- [ ] **Step 3: Implement** — drop the `a.finished ?` gate on the `checking` mark (the `findOneAndUpdate` runs for both paths).

- [ ] **Step 4: Run** the file — pass.

- [ ] **Step 5: Commit** `fix(api): a homework pause marks the problem checking like a finish (round 11)`.

### Task 6: The list polls on `?paused=n` (academy web)

**Files:**
- Modify: `apps/web/components/homework/status.ts` (`listAwaitingVerdict`, `listNeedsRefresh`, add `pausedSetPath`, `parsePausedParam` = `parseFinishedParam`)
- Modify: `apps/web/components/homework/HomeworkProblemSession.tsx:125-142` (`end` pushes `pausedPath` for `/api/sessions/ended`; prefetch it too)
- Modify: `apps/web/components/homework/HomeworkProblemList.tsx` (`paused?: number` prop, same mount/replaceState handling as `finished`)
- Modify: `apps/web/app/app/homework/[setId]/page.tsx` (parse `paused`)
- Test: `tests/unit/homework-status.test.ts`, `tests/unit/homework-problem-list-refresh.test.ts`

**Interfaces:**
- Produces: `listAwaitingVerdict(set, finished?, paused?)` — unchanged for `finished`; `paused` adds nothing beyond the `checking` scan. `listNeedsRefresh(set, waitingSince, now, finished?, paused?)` — with `paused` defined: re-read while `listAwaitingVerdict` (cap 90 s), else for `FINISH_MIN_WINDOW_MS` since arrival. `pausedSetPath(setId, n)` = `${homeworkSetPath(setId)}?paused=${n}`.

- [ ] **Step 1: Write the failing tests**: status: `listNeedsRefresh(inProgressSet, arrival, arrival + 1000, undefined, 1) === true`, `… arrival + 6000 … === false` (nothing checking), `checkingSet … arrival + 30_000 … === true`, `… arrival + 91_000 … === false`; list: `'on ?paused=n it re-reads while the problem is checking, shows "Checking your work…", then settles to In progress and stops'` and `'drops ?paused from the address after mount'`; session: the pause path pushes `pausedSetPath` (extend the existing push assertion if one exists, else add).

- [ ] **Step 2: Run** `npx vitest run tests/unit/homework-status.test.ts tests/unit/homework-problem-list-refresh.test.ts` — FAIL.

- [ ] **Step 3: Implement** per Interfaces.

- [ ] **Step 4: Run** those files, then `npx tsc --noEmit -p apps/web/tsconfig.json` (or the repo's typecheck script) — pass.

- [ ] **Step 5: Commit** `feat(web): the homework list polls after Back to list (?paused=n) (round 11)`.

### Task 7: Gates and local stack

- [ ] Engine: `npm run test:all > <scratch>/engine-test-all-r11.txt 2>&1` — expected: only `test:embed-debug-coverage` and `test:portal-student-scoping` FAIL (baseline); `npx tsc --noEmit -p tsconfig.json` clean.
- [ ] Academy: `npm test` in the academy worktree — green (known flakes: referral `code_taken`; rerun alone).
- [ ] Restart the local stack on both heads: `bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh stop && bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh start` (api is not hot-reloaded).
- [ ] Record heads in the ledger (`.superpowers/sdd/2026-10-22-gac-homework-round8-plan/progress.md`, "Round 11").
