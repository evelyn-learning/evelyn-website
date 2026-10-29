# GAC homework round 11 — verified solution path, Q-pin in the board flow, pause-path poll

Date: 2026-10-22. Owner: Praveen. Engine worktree `gac-29oct` (`/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct`), academy worktree `gac-29oct` (`/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`).

Evidence (hw-15, worksheet7, round-8 ledger "Round 10"): the live tutor's own errors (p3 "∠B = 40 + ∠C"; p6 "the base extends by h√3 = 12", "so h = 12?") all happened in the derivation, where the key gives the tutor only the finals. Praveen's decisions: build the solution-path key now; the Q-pin goes below the figure on the whiteboard, never above it; the list polls after "Back to list" like it does after a finish.

## 1. Verified solution path in the answer key

**What.** Each solve already works the problem; it now also reports the path it took. `AnswerKey` gains `steps?: KeyStep[]`, `KeyStep = { relation: string; value?: string }`: `relation` is the fact, theorem or equation the step uses (one sentence, ≤ 25 words); `value` is that step's intermediate result exactly as a student would write it (`"AE = 4"`, `"(5x + 5) = 40 + ∠B"`), absent when the step yields none. At most 8 steps, in order; every number in the finals must be reachable from them.

**Verification.** Agreement stays finals-only (`partsAgree`). The stored path comes from the agreeing solver that ran on `plangen-vision` (Opus 5.5) when it is one of the agreeing pair, else from the first agreeing solver. No extra model call.

**Cost.** Output grows by the steps (≈ 150–400 tokens per solve, 2–3 solves per problem). At Opus 5.5 $20/M output and Sonnet 5 $10/M that is ≈ $0.01–0.02 per problem, ≈ 20–30 % of today's ≈ $0.07 per problem build. The live session carries the path inside the per-session frame (≈ 100–250 tokens), which the prompt cache serves after the first turn: no measurable per-turn cost.

**Live use.** `homework-problem-turn.ts` passes the path as `activeProblem.solutionPath: string[]` (`"<relation> → <value>"` per step; `"<relation>"` when no value). `formatActiveProblemBlock` (homework branch) prints it after the verified expected answer under the heading `Verified solution path (the derivation the key was checked with):` followed by this rule, verbatim: `Guide along this path. Never state a relation or an intermediate value that contradicts it; when your own working disagrees with a step, the step is right — re-check your working instead of asserting yours. A student who takes a different valid route is not wrong: judge that route by its own logic and its finals against the verified finals. Do not read the path out or reveal a step's value before the student has reached it.` `keyedProblemFacts` (the model answer check's facts) appends `Verified intermediate steps: <path joined by "; ">` so an intermediate claim is judged against the path.

**Cache.** A cached problem (per-problem build cache, 24 h by text hash) whose key has no `steps` re-solves the key only; its figure fields are copied as today. So Praveen's re-upload of an old sheet gets paths without rebuilding figures.

**Out of scope.** Deterministic keyed verdicts on intermediate values (the model check sees the path; a keyed intermediate credit is a later round). Carrying confirmations across sessions of one problem (not decided).

## 2. Q-pin below the figure, on the whiteboard

**What.** In a one-problem session (`problemPanel != null`) the question pin is a board node: it renders inside the whiteboard page flow directly after the lead figure (page 1) or at the top of the page (no lead figure, or any later page), never over anything. Later board items flow below it, so the figure never moves when the pin appears. The node is `position: sticky; top: 0` inside the board's scroll container so the current question stays visible as the board grows. Collapse-to-chip and auto-collapse behave as today (same node, same mode state in SessionStage).

**How.** SessionStage owns the pin and its mode; the board is a child element built by TutorSession. SessionStage provides the expanded pin node through a React context (`BoardLeadPinContext`, value `ReactNode | null`); `WhiteboardCanvas` reads it and renders it in a slot `data-wb-lead-pin="1"` (`sticky top-0 z-20`). When `problemPanel` is null the context value is null and SessionStage keeps the floating pin exactly as today. The static row above the card (`question-pin-static`, round 6) is removed; the F1 column classes stay.

## 3. Pause path polls like a finish

**API** (`HomeworkSetService.recordHomeworkOutcome`): a pause marks the problem `checking` the same way a finish does (same `CHECKABLE` gate, same restore-on-failure); only the engine call still differs (`finished` only on a finish). A pause therefore also hits the 10 s start guard (409 `checking`), as a finish does.

**Web.** "Back to list" (pause) navigates to `pausedSetPath(setId, n)` = `/app/homework/<set>?paused=<n>`. The set page parses `paused` like `finished`; `HomeworkProblemList` takes `paused?: number`; `listAwaitingVerdict(set, finished, paused)` waits while any problem is `checking`, or while the finished problem has no verdict (as today); `listNeedsRefresh` gives a pause the same `FINISH_MIN_WINDOW_MS` re-read window (the mark can land after the list renders), then stops once nothing is `checking` — a pause may legitimately end `in_progress`. The 90 s cap applies to both. The address drops `?paused` after mount like `?finished`.

## Acceptance (Praveen, local stack)

Upload worksheet7 again: every ready problem's key carries `steps` (admin dump / Mongo); p3 and p6 sessions follow the path (no "∠B = 40 + ∠C", extension 4 not 12). Open a problem: the pin appears under the figure, the figure does not move; scroll the board — the pin stays. Finish a problem, press "Back to list": the card says "Checking your work…" and settles to Done without a refresh.
