# GAC homework upload minutes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An uploaded sheet is billed as one tutoring minute per problem, once, into the student's fair-use ledger, the pool, the admin roster/cost and the daily report.

**Architecture:** Academy only. `UsageLedger.uploadSecondsUsed` is a second accrual bucket on the existing `(userId, period)` row; a tiny `usedSecondsOf(row)` helper makes every reader sum both buckets; `poolUsedSeconds` sums both in its aggregation. `HomeworkSetService.chargeHomeworkBuild` runs from `refreshHomeworkSetBuild` when `buildDone` is first observed, guarded by a CAS on `HomeworkSet.buildBilledAt`. The web roster bills upload seconds at the text rate.

**Tech Stack:** Express + mongoose (api), Next.js (web), vitest (unit + integration with the in-memory Mongo harness used by `tests/integration/homework-set.test.ts` and `admin-usage.test.ts`).

**Spec:** `/Users/luke/Dev/evelynlearning/docs/superpowers/specs/2026-10-22-gac-homework-upload-minutes-design.md`

## Global Constraints

- Academy worktree `/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, branch `gac-29oct` (HEAD `25ac4090`); never the main checkout; never `git stash`; leave `.env.gac-local` alone.
- `UPLOAD_SECONDS_PER_PROBLEM = 60`, exported from `apps/api/src/services/UsageLedgerService.ts` with the ruling comment (2026-10-22, Praveen; ≈ $0.07–0.10 actual per problem vs the $0.12 text minute).
- The ledger row charged is the one `periodFor(tiered, plan, now)` resolves for the user — the same resolution `tickUsage` / `gateFairUse` use (extract a shared helper if `tickUsage` computes it inline; do not re-implement the rule).
- "Used seconds" = `voiceSecondsUsed + uploadSecondsUsed` in every reader; the heartbeat tick keeps writing `voiceSecondsUsed` only.
- Exactly one charge per set (CAS on `buildBilledAt` absent); trial users never charged.
- Commit trailer: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01Q4Nu3g3ap8MJQvqRcbiozq`.

## Review Focus

1. A set whose build completes while the student is at 80 %+ of the cap: the charge lands, `warn80`/`exhausted` reflect it on the next gate read — Task 1 gate test.
2. Two concurrent refreshes both observing `done`: one ledger `$inc` — Task 2 test (two `refreshHomeworkSetBuild` calls, or a direct double `chargeHomeworkBuild`).
3. A free-plan student (lifetime row): the charge lands on the lifetime row — Task 2 test via `periodFor`.
4. A set with zero problems (should not exist, but `problems.length === 0`): no charge, `buildBilledAt` still set — Task 2 test.
5. The admin roster for a period with upload seconds but no session seconds still shows cost > 0 — Task 3 test.

---

### Task 1: Ledger bucket and every reader (api)

**Files:**
- Modify: `apps/api/src/models/UsageLedger.ts` (add `uploadSecondsUsed: { type: Number, default: 0, required: true }`)
- Modify: `apps/api/src/services/UsageLedgerService.ts` (export `UPLOAD_SECONDS_PER_PROBLEM`, export `usedSecondsOf(row)`, use it at ~312, ~332, ~372; export the period-resolution helper used by `tickUsage` if not already exported)
- Modify: `apps/api/src/services/usagePool.ts:43` (`$sum: { $add: ['$voiceSecondsUsed', { $ifNull: ['$uploadSecondsUsed', 0] }] }`)
- Modify: `apps/api/src/http/routes/admin.ts:~998` (usedSeconds via `usedSecondsOf`; add `uploadSeconds: row?.uploadSecondsUsed ?? 0` to each student row)
- Modify: `apps/api/src/services/DailyUsageReport.ts` (`DailyUsageRow.uploadSeconds`; rows include it; `minutesOf` and `totalMinutes` include it; a row with only upload seconds is still emitted)
- Test: `tests/integration/fair-use-gate.test.ts`, `tests/integration/admin-usage.test.ts`, `tests/unit/daily-usage-report.test.ts` (or the integration one — whichever holds the row/total assertions), a pool test if one exists (grep `poolUsedSeconds`)

**Interfaces:**
- Produces: `export const UPLOAD_SECONDS_PER_PROBLEM = 60`; `export function usedSecondsOf(row: { voiceSecondsUsed?: number | null; uploadSecondsUsed?: number | null } | null | undefined): number`; `export async function ledgerPeriodForUser(user, now, deps?)` (name as fits the existing code) returning the period string the tick uses; admin roster row `uploadSeconds: number`; `DailyUsageRow.uploadSeconds: number`.

- [ ] **Step 1: Write the failing tests**: gate — a ledger row with `voiceSecondsUsed: 0, uploadSecondsUsed: cap − 30` makes `gateFairUse` refuse (`fair_use_exhausted`) and `remainingFor` report < 60; pool — `poolUsedSeconds` sums upload seconds; admin roster — `usedSeconds` includes upload and `uploadSeconds` is present; daily report — a student with only `uploadSecondsUsed: 600` appears with `uploadSeconds: 600` and `totalMinutes` 10.
- [ ] **Step 2: Run** `cd /Users/luke/Dev/academy/.claude/worktrees/gac-29oct && npx vitest run tests/integration/fair-use-gate.test.ts tests/integration/admin-usage.test.ts tests/unit/daily-usage-report.test.ts` — FAIL.
- [ ] **Step 3: Implement** per Interfaces (every reader through `usedSecondsOf`; grep `voiceSecondsUsed` afterwards — the only remaining direct uses are the two `$inc`s in `tickUsage`, the model, the aggregation and `usedSecondsOf`).
- [ ] **Step 4: Run** the files (pass) + `npm run typecheck`.
- [ ] **Step 5: Commit** `feat(api): upload minutes bucket on the fair-use ledger, counted by the gate, pool, roster and daily report`.

### Task 2: Charge on build completion (api)

**Files:**
- Modify: `apps/api/src/models/HomeworkSet.ts` (`buildBilledAt?: Date`, `buildBilledSeconds?: number`)
- Modify: `apps/api/src/services/HomeworkSetService.ts` (`refreshHomeworkSetBuild`: after `status.done` is observed true and the `$set` lands, `await chargeHomeworkBuild(set, now)`; new exported `chargeHomeworkBuild(set, now): Promise<{ charged: boolean; seconds: number }>`)
- Test: `tests/integration/homework-set.test.ts`

**Interfaces:**
- Consumes: Task 1's `UPLOAD_SECONDS_PER_PROBLEM`, `ledgerPeriodForUser`, `isTrialId` (`apps/api/src/services/TrialService.ts` or wherever it lives — grep).
- Produces: `chargeHomeworkBuild`: trial user → `{ charged: false, seconds: 0 }` without touching the set; CAS `HomeworkSet.updateOne({ _id: set._id, buildBilledAt: { $exists: false } }, { $set: { buildBilledAt: now, buildBilledSeconds } })`; `modifiedCount === 0` → `{ charged: false }`; else `UsageLedger.findOneAndUpdate({ userId, period }, { $inc: { uploadSecondsUsed: seconds } }, { upsert: true })` with `seconds = problems.length * UPLOAD_SECONDS_PER_PROBLEM`, log `[homework] upload billed: set=<id> problems=<n> seconds=<s> period=<p>`.

- [ ] **Step 1: Write the failing tests** (the mock engine's build status can be driven to `done` — see how the existing tests do it): (a) first refresh seeing `done` → ledger row `uploadSecondsUsed === problems × 60`, set `buildBilledAt` set; (b) a second refresh / a direct second `chargeHomeworkBuild` → no change; (c) two concurrent `chargeHomeworkBuild` calls → one `$inc`; (d) a trial user's set → no ledger row; (e) zero problems → `buildBilledAt` set, no ledger row; (f) a free-plan student → the `lifetime` row.
- [ ] **Step 2: Run** `npx vitest run tests/integration/homework-set.test.ts` — FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the file + `npm run typecheck` — pass.
- [ ] **Step 5: Commit** `feat(api): a finished homework build charges one tutoring minute per problem, once`.

### Task 3: Roster cost and labels (web)

**Files:**
- Modify: `apps/web/lib/billing.ts` (`rosterCostUsd(ss: { text: number; voice: number; upload?: number }, rates)` — upload at the text rate)
- Modify: `apps/web/lib/admin-students.ts` (roster row type gains `uploadSeconds?: number`)
- Modify: `apps/web/components/admin/PilotStudentRoster.tsx` (cost passes `upload: s.uploadSeconds`; a muted "incl. N min uploads" line under the cost when `uploadSeconds > 0`)
- Test: the existing billing unit test (grep `rosterCostUsd` under `tests/unit`), and a roster render test if one exists (grep `PilotStudentRoster`)

- [ ] **Step 1: Write the failing tests**: `rosterCostUsd({ text: 0, voice: 0, upload: 600 }, { textPerMinUsd: 0.12, voicePerMinUsd: 0.15 }) === 1.2`; `{ text: 60, voice: 60, upload: 60 }` → 0.12 + 0.15 + 0.12 = 0.39; the roster shows "incl. 10 min uploads" for `uploadSeconds: 600`.
- [ ] **Step 2: Run** the test file(s) — FAIL. **Step 3: Implement.** **Step 4: Run** + `npm run typecheck`. **Step 5: Commit** `feat(web): admin roster cost includes upload minutes at the text rate`.

### Task 4: Gate

- [ ] `npm test` in the academy worktree — green (known flake: referral `code_taken`, rerun alone); restart the api on the local stack (`bash /Users/luke/Dev/evelynlearning/scripts/ops/gac-local.sh stop && … start`) since the api is not hot-reloaded.
