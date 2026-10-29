# A1 — typed problem → homework set: implementation plan

Spec: `docs/superpowers/specs/2026-10-23-gac-typed-problem-set-design.md`.
Repo: academy worktree `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct` (branch `gac-29oct`). No engine change.

## Task 1 — API: shared gate + /learn/start branch (TDD)

- Add `typedHomeworkSetEnabled()` next to the per-problem gate: `HOMEWORK_HELP === '1' && HOMEWORK_PER_PROBLEM !== 'off' && HOMEWORK_TYPED_SET !== 'off'`.
- Failing integration tests in `tests/integration/homework-set.test.ts` (new describe "typed problems become sets"):
  - typed problem on /learn/start → 201 `homeworkSetId`, one problem, no Session, no SessionLock, plan-generate saw `goal: 'homework-help'`;
  - typed topic (no punctuation) → session as before;
  - `HOMEWORK_TYPED_SET=off` → session as before;
  - `genfail` topic → planless session (no set).
- Implement: in /learn/start, after the picker branch and before `startFreeformSession`, the set branch (mirrors /learn/material's: `createHomeworkSetFromPlan`, `recordHomeworkHelp` kind `ask`, 201 body with `homeworkSetId`, `problems`, `topic`, `courseKey`, `courseTitle`, `generatedPlanId`). Title = typed text.

## Task 2 — API: /learn/material paste-only

- Flip test (v-b): paste-only → set; add `HOMEWORK_TYPED_SET=off` paste-only → whole-sheet session.
- Implement: the branch's `files.length > 0` condition becomes `files.length > 0 || typedHomeworkSetEnabled()`. `persistAttachments` with no files is a no-op (check).

## Task 3 — Web routing

- Pure helper `homeworkSetLandingPath(id, problemCount)` in `apps/web/components/homework/status.ts`: 1 → `/app/homework/<id>/1`, else `/app/homework/<id>`. Unit test in `tests/unit/homework-status.test.ts`.
- `DashboardTopicSearch.runLearnStart`: a 201 with `homeworkSetId` → `router.push(helper(...))` before the session branch. `handleMaterialSet` uses the helper too (modal passes `problemCount`).

## Task 4 — Gate

- `npm test` at the academy worktree root (baseline 432 files / 7011). Fix any existing tests that typed punctuated problems on /learn/start expecting a session: switch their input to a topic, or set the switch off where the test is about the old path.
- typecheck web + api.

## Task 5 — Minimum live check (local stack, LIVE DBs: one run)

- One typed problem with a described figure at http://localhost:3016 → lands on the preview, figure + key present. Ask Praveen before any further live runs.
