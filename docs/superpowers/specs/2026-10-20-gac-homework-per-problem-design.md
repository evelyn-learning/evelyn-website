# GAC Homework Help — per-problem sessions (design)

**Date:** 2026-10-20 · **Owner:** Praveen · **Status:** APPROVED direction (decisions 1–3 below taken 2026-10-20 evening) · **Target:** GreenApple (GAC) text tutor, before 29 Oct 2026 · **Branches:** `gac-29oct` in both repos (engine `/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct`, academy `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`). GAC's pinned engine (`evelyn-tutor-gac` :3008) deploys ONLY via `deploy-tutor-gac.sh`; `gac-29oct` is deliberately NOT merged with `origin/main`.

Companion implementation plan: `docs/superpowers/plans/2026-10-20-gac-homework-per-problem-plan.md`.

## 1. Why (what nine live rounds showed)

Rounds 1–9 of the GAC live test (ISSUES.md items 1–71 in `docs/whitelabel/greenapple/integration/live-test-2026-10-16/ISSUES.md`) fixed one symptom per round and a different one broke the next round. The photo read is now solved (Opus 5.5 at low effort: 15 s, transcript matches the sheet). Every remaining failure happens inside the **live turn**, where one streamed brain call must: track an 8-problem ledger, obey ~50 prompt rules, choose among 55 tools, **construct a figure from coordinates in its head**, **solve the problem to grade the student**, and speak in two sentences with short thinking — and where each guard we bolted on (verdict precheck, text-thinking deadline, board-anchor and correction follow-ups) is another serial model call with its own timeout (the 29 s stall = 12 s precheck timeout + 14 s thinking deadline + re-issue).

The design error is that the hard, checkable work (figure geometry, the answer) is done live and unverified, while the easy work (reading) is done offline with time. This redesign inverts that, and removes the multi-problem ledger from the prompt altogether.

## 2. Decisions taken

1. **One problem = one engine session.** The upload produces a *homework set*; the student opens problems one at a time from a list. (Alternative rejected: one session + a side picker — keeps the ledger, the figure scrolling, the "forgot the last problem" class.)
2. **Build & test properly; ship before 29 Oct.** No further symptom fixes on the current whole-sheet flow.
3. **The teacher sees the list**: per-problem status and the *unverified* flag in the staff view.

## 3. Student flow

1. **Upload** (existing modal, plus drag-and-drop): title, optional paste, up to 4 files → `POST /api/learn/material`. Response: a homework-set id. **No session is started.**
2. **Problem list page** `/app/homework/<setId>`: one card per problem — number, the problem text (math typeset), a thumbnail of the pre-built figure when there is one, a status chip (*Not started · In progress · Done · Needs review · Still preparing*), and "Work on this". Cards appear immediately after the read; figure thumbnails and the *ready* state fill in as the background build finishes (poll every 3 s until all problems are `ready` or `unverified`). A problem can be opened before its build finishes — the session then runs in *unverified* mode (see §6).
3. **Problem session** `/app/homework/<setId>/<n>`: a two-pane layout. Left (fixed, never scrolls away): the problem statement and the pre-rendered figure/graph; a "Back to list" link. Right: the tutor (the existing embed) whose whiteboard is only for the work on this problem. The session's plan has exactly one problem; the brain has no ledger, no `set_current_problem`, no page jumping.
4. **Finishing a problem**: the tutor's verified verdict (student's final answer matches the key) marks the problem *Done*; "Back to list" or the session ending without a verified match leaves it *In progress*, with a two-line *prior-work note* saved for next time. Opening a problem again starts a **new** engine session seeded with that note.
5. **Next problem**: from the list, or the tutor's closing line offers "Back to your list". No automatic chaining.

## 4. Data model (academy, Mongo)

`HomeworkSet` (new collection `homeworksets`):
- `_id`, `userId`, `partnerId`, `title` (the student's title), `files[]` (as stored today for materials), `createdAt`
- `lessonPlanId` (the engine's read plan, kept for the transcript), `subject`, `courseKey`
- `problems[]`: `{ n, text, figureDescription?, status: 'preparing'|'ready'|'unverified', figure?: FigureSpec, figurePng?: string(url/dataless id), key?: AnswerKey, verify: { agreed: boolean, solver: string[], note?: string }, work: { status: 'not_started'|'in_progress'|'done'|'needs_review', lastSessionId?, priorNote?: string, attempts: number, minutes: number, updatedAt } }`
- Indexes: `{userId, createdAt}`, `{partnerId, createdAt}`.

`Session` gains `homeworkSetId?`, `problemN?` (so staff views and usage group by set).

**Status vocabulary** (two independent axes, never mixed):
- *build status* per problem: `preparing` → `ready` | `unverified` (figure or key failed verification; the session still runs, see §6).
- *work status* per problem: `not_started` → `in_progress` → `done` | `needs_review` (the tutor could not verify the student's answer against the key, or the key is unverified and the student says they are finished).

## 5. Build pass (engine, after the read)

Runs in the engine as a background job started by `plan-generate` for homework-goal plans (or by a new `POST /api/portal/v1/homework-build` that academy calls right after `plan-generate` returns — the plan picks whichever the engine already supports safely; §6 of the plan). Per problem, two independent steps:

**5a. Figure.** Input: the problem text + the `[Figure: …]` description the read produced. Output: a `FigureSpec` — either a `show_geometry_constructed` payload (points → constructed steps; every on-segment point via `section_point`/`midpoint`/`intersect`, never free coordinates) or a `show_function_graph` payload (with `xAxisStep` for π scales), or `none`. Model: `plangen-vision` (Opus 5.5, low effort) working from the problem text and the read's `[Figure: …]` description (v1; feeding the original image crop is a follow-up once the read's descriptions prove insufficient). A second, independent model call (Sonnet 5) extracts the figure's stated relations (*claims*: point on segment, point on circle, parallel, perpendicular, collinear) from the description alone; every claim is checked numerically against the solved figure. Validation (deterministic, no model): the existing constructed-geometry solver resolves every step; every label in the spec appears verbatim in the problem text or figure description (no computed lengths, no answers); no `expr` label on a homework graph (the legend is hidden); point count/segment count matches the description's named points. A spec that fails is retried once with the validator's message, then marked `unverified` (no figure shown; the tutor sketches nothing and refers to "your sheet").

**5b. Answer key.** Two **independent fresh-context solves**: solve A on `content-verify` (Sonnet 5, adaptive thinking) and solve B on a second role (`plangen-vision` = Opus 5.5 at medium effort) — each returns `{ parts: [{ label: 'a'|'b'|…|'', final: string, canonical: number|string, units?: string, steps: string[] }] }`. Agreement = every part's `canonical` equal (numeric within 0.5 % or exact string after normalisation). Where Wolfram is configured, numeric parts are additionally evaluated through the existing Wolfram client; a Wolfram disagreement overrides. Agreed → `key` stored, `verify.agreed=true`. Disagreed after one re-solve → `unverified` (no key; the tutor never asserts correctness for that problem; the teacher sees the flag and both candidate answers).

Budget per problem: ≤ 60 s wall, ≤ ~$0.05 (8 problems ≈ $0.40 per upload at Opus/Sonnet rates). Cached by `sha256(problem text + figure description)` for 24 h so a re-upload of the same sheet is free.

## 6. The one-problem session (engine)

- Plan: a one-problem lesson plan (`metadata.kind = 'homework-problem'`, `metadata.problem = { n, text, figure?, key?, verified, priorNote? }`), minted per open; the parent read plan id kept in metadata.
- Prompt: **no** `<homework_session>` ledger, **no** `set_current_problem`. A new short `<homework_problem>` block: the problem text; "the figure is on the student's screen" (or "no figure could be drawn, refer to the sheet"); the verified key *in a server-only block the brain uses to check, never to tell*; the prior-work note; and the rule: a recall fact the student says they do not know is told after one miss.
- Verdict: the precheck compares the student's stated final answer against `key.parts[].canonical` mechanically (numbers within 1 % after unit stripping); only an undecided message goes to the model, capped at 4 s; the brain receives the verdict as today (still injected before the turn, now fast because it no longer solves). On an `unverified` problem the precheck is skipped and the brain is told it must not pronounce correctness, only work through.
- Figure: rendered by the **client from the stored spec at session start** (the same renderers the whiteboard uses), in the fixed left pane; the brain is told the figure is on screen and never redraws it; `show_geometry*`/`show_function_graph` remain available for *new* sketches the tutor wants to add on the board. (A `highlight_figure` tool to mark a point/segment/angle by id is a follow-up, not v1.)
- Latency: text-thinking stays at low effort with an 8 s deadline in these sessions (the keyed verdict costs ≤ 4 s, usually 0); board-anchor and correction follow-up turns are not issued in homework-problem sessions. Target first sentence ≤ 8 s median, ≤ 15 s p95.
- End: when the verdict is *verified correct* for every part, the brain closes the problem (`work.status = done`) and offers the list; session-result carries `{ homeworkSetId, n, outcome: 'done'|'in_progress'|'needs_review', priorNote }`.

## 7. Teacher view (academy staff)

In the existing student sessions view: a **Homework sets** section — title, date, N problems, per-problem chips (work status) and an *unverified* badge where `verify.agreed=false` with both candidate answers on hover; click → the problem's sessions. No new permissions.

## 8. Non-goals (this release)

Voice mode for homework (GAC ships text only); automatic chaining to the next problem; editing the read (student corrects a misread problem) — the teacher can see the text; multi-image problems spanning pages; the lesson-segment version of the same idea (clickable progress chips) — later, built on the same per-part context mechanism.

## 9. Acceptance (what "right 100 % of the time" means here)

1. A figure shown to a student is always one the solver resolved and whose labels all come from the sheet. Otherwise no figure.
2. The tutor never states that an answer is right or wrong unless the key was verified by two independent solves (and Wolfram where available).
3. No turn waits on a serial guard ladder: first sentence ≤ 8 s median on the GAC box, ≤ 15 s p95, measured over the test sheets.
4. Every problem on the sheet is reachable from the list; none can be forgotten; status survives reloads and days.
5. The three test sheets (`/Users/luke/Downloads/worksheet_clean.png`, `worksheet2_clean.png`, `worksheet3_clean.png` + `worksheet3_photo.jpg`) produce 8/8 ready problems each, with figures a human reviewer accepts, before the deploy.
