# Prod-Monitor Phase 1 — Batch Analyzer + Issues Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **DEFERRED BUILD (design 2026-07-05).** Depends on Phase 0 landing (codeVersion + typed events + tracer). Re-validate paths at build time. Design source: `docs/superpowers/specs/2026-07-05-prod-monitoring-agent-design.md`.

**Goal:** A scheduled batch agent that turns live sessions into deduped, severity-ranked issue cards on a Trello-style admin dashboard — read-only over prod data, touching no live turn path.

**Architecture:** `node-cron` job (blog-scheduler pattern) → Tier-A deterministic aggregation (pure, no LLM) → Tier-B LLM classification on flagged sessions only → dedup/cluster → upsert `MonitorIssue` → `/admin/monitor` board reads it and deep-links to the existing replay UI.

**Tech Stack:** Mongoose (`MonitorIssue` model), `node-cron`, Anthropic SDK (reuse `/api/ai/claude` template), NextAuth (existing admin gate), React admin UI reusing `ReplayPlayer` + filters.

## Global Constraints
- Analyzer is READ-ONLY over `TutorSession`/`StudentProfile`; writes only `MonitorIssue`.
- Two-tier: no LLM call unless Tier-A flags a session. Cap LLM analyses/batch and `log()` what was dropped.
- Dashboard tolerates unknown `debugEvents.type` (never crash).
- New admin route adds its OWN `getServerSession` check (middleware does not gate `/admin`).
- Dedup is first-class (one card per recurring issue, with a count) to avoid alert fatigue.
- TS strict; `npx tsc --noEmit` clean; each deterministic unit has a `test:*` script.

---

### Task 1: `MonitorIssue` model + dedup key

**Files:**
- Create: `src/models/MonitorIssue.ts`
- Test: `scripts/test-monitor-issues.ts` (new) + `"test:monitor-issues"` in package.json

**Interfaces:**
- Produces: `MonitorIssue` model per spec §5.1; `computeDedupKey(signalKind: string, title: string): string`.

- [ ] **Step 1: Failing test** for `computeDedupKey` (stable, case/space-insensitive).
```ts
check('dedupKey stable across whitespace/case', () => {
  assert.equal(computeDedupKey('render_stall', 'Desmos  Stall'), computeDedupKey('render_stall', 'desmos stall'));
});
check('different signalKind → different key', () => {
  assert.notEqual(computeDedupKey('a', 'x'), computeDedupKey('b', 'x'));
});
```
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** `MonitorIssue.ts` — schema per spec §5.1 with `dedupKey` unique index, `status` enum, no TTL. Export `computeDedupKey` (normalize → hash).
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `git commit -m "feat(monitor): MonitorIssue model + dedup key (phase 1)"`.

---

### Task 2: Tier-A deterministic aggregator (pure)

**Files:**
- Create: `src/lib/tutor/monitor/aggregate.ts` (pure functions over an array of lean session docs)
- Test: extend `scripts/test-monitor-issues.ts`

**Interfaces:**
- Consumes: lean `TutorSession[]` (transcript/debugEvents/tokenUsage/codeVersion/duration).
- Produces:
  - `computeRates(sessions): Record<string, { count: number; perTurn: number }>` — rate per debugEvent type.
  - `computeEngagementSignals(sessions): { fatigueRate: number; boredomCueRate: number; incorrectStreakP90: number; walkthroughInsistenceRate: number }`.
  - `flagIssues(current, baseline, thresholds): CandidateIssue[]` — threshold + N×-baseline + codeVersion-boundary spike rules.
  - `type CandidateIssue = { signalKind: string; category: string; title: string; sessions: {sessionId:string;turnIndex?:number;codeVersion?:string}[]; metrics: Record<string,number> }`.

- [ ] **Step 1: Failing test** — a synthetic session set with 5 `tool_call_error` events over 10 turns yields a `tool_call_error` rate of 0.5 and (given baseline 0.05) a flagged candidate.
```ts
const sessions = [mkSession({ turns: 10, events: Array(5).fill('tool_call_error') })];
check('computeRates counts per-turn', () => {
  assert.equal(computeRates(sessions)['tool_call_error'].perTurn, 0.5);
});
check('flagIssues flags a 10x-over-baseline rate', () => {
  const c = flagIssues(computeRates(sessions), { tool_call_error: { perTurn: 0.05 } }, DEFAULT_THRESHOLDS);
  assert.ok(c.find(i => i.signalKind === 'tool_call_error'));
});
```
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** `aggregate.ts` — pure, no I/O. Rates normalized by turn count; engagement signals derived from `fatigue_detected`/`pacing_cue`/incorrect-streak events + walk-through markers; `flagIssues` applies absolute thresholds AND relative (N× trailing baseline) AND codeVersion-boundary deltas.
- [ ] **Step 4: Run, verify pass** (add cases: zero-division safety, empty input, codeVersion spike).
- [ ] **Step 5: Commit** — `git commit -m "feat(monitor): Tier-A deterministic aggregator (phase 1)"`.

---

### Task 3: Dedup / cluster + upsert into `MonitorIssue`

**Files:**
- Create: `src/lib/tutor/monitor/upsert-issues.ts`
- Test: extend `scripts/test-monitor-issues.ts` (in-memory mongo or a mocked model)

**Interfaces:**
- Consumes: `CandidateIssue[]` (Task 2), `computeDedupKey` (Task 1).
- Produces: `upsertIssues(candidates, model): Promise<{ created: number; updated: number }>` — new dedupKey → insert `status:'triage'`; existing → `occurrences++`, append sessions (capped), bump `lastSeen`, merge metrics.

- [ ] **Step 1: Failing test** — same candidate twice → 1 created then 1 updated with `occurrences=2`.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — dedup by key; near-duplicate title clustering (normalized-string similarity ≥ threshold merges into the existing card) BEFORE insert; cap `affectedSessions` array length (keep newest N + count).
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `git commit -m "feat(monitor): dedup/cluster + issue upsert (phase 1)"`.

---

### Task 4: Tier-B LLM classifier (flagged sessions only)

**Files:**
- Create: `src/app/api/admin/monitor/classify/route.ts` (authed; structured-output Claude call, reuse `/api/ai/claude` rate-limit/error template)
- Create: `src/lib/tutor/monitor/classify.ts` (prompt builder + schema; pure prompt assembly is unit-tested, the LLM call is not)
- Test: extend `scripts/test-monitor-issues.ts` (prompt-builder shape only)

**Interfaces:**
- Consumes: a flagged session (transcript + key events + behavioural evidence).
- Produces: `buildClassifyPrompt(session, candidate): { system: string; user: string }`; endpoint returns `{ category, confirmed: boolean, title, description, recommendation, severity }` (structured output).

- [ ] **Step 1: Failing test** — `buildClassifyPrompt` includes the transcript excerpt + the behavioural evidence block and asks the model to CONFIRM-or-DENY the flag (reduce false issues).
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — prompt gives the LLM the behavioural TRIGGER (streaks/silences/miscorrections/latency) and asks it to explain + label + confirm, NOT to detect from scratch (spec §6.2). Structured-output schema forces the return shape. Endpoint enforces auth + a per-batch analysis cap; `log()` dropped-over-cap counts.
- [ ] **Step 4: Run, verify pass** (prompt-shape assertions only; no live LLM in the deterministic test).
- [ ] **Step 5: Commit** — `git commit -m "feat(monitor): Tier-B LLM classifier endpoint (phase 1)"`.

---

### Task 5: Cron wiring + run-now toggle

**Files:**
- Create: `src/lib/services/monitor-scheduler.ts` (mirror `blog-scheduler.ts`: `startMonitorScheduler`/`stop`/`triggerMonitorRun`)
- Create: `src/lib/tutor/monitor/run-batch.ts` (the orchestration: fetch window → Tier-A → Tier-B on flags → upsert)
- Create: `src/app/api/admin/monitor/run/route.ts` (authed manual trigger)
- Test: `scripts/test-monitor-batch.ts` (drive `run-batch` with an injected fake session source + fake classifier; assert issues created)

**Interfaces:**
- Consumes: aggregator (Task 2), upsert (Task 3), classifier (Task 4).
- Produces: `runBatch({ from, to, deps }): Promise<{ analyzed, flagged, created, updated, droppedOverCap }>` — deps injected (session source, classifier) so it's testable without Mongo/LLM.

- [ ] **Step 1: Failing test** — `runBatch` with 1 flagged session + a stub classifier that confirms → `created ≥ 1`, and `droppedOverCap` reported.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** `run-batch.ts` (pure orchestration, deps injected) + `monitor-scheduler.ts` (node-cron, in-process, idempotent — catches up next run if PM2 restarted) + the authed run route.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Add `"test:monitor-batch"` script; typecheck clean. Commit** — `git commit -m "feat(monitor): batch orchestration + cron scheduler + run route (phase 1)"`.

---

### Task 6: Issues API (list + status update)

**Files:**
- Create: `src/app/api/admin/monitor/issues/route.ts` (GET list w/ filters; PATCH status)
- Test: none new (thin CRUD; covered by manual + the model test)

**Interfaces:**
- Produces: `GET /api/admin/monitor/issues?status=&category=&severity=` → `MonitorIssue[]`; `PATCH` `{ issueId, status }` → updated issue. Both behind `getServerSession`.

- [ ] **Step 1: Implement** the authed route (reuse the `getServerSession(authOptions)` + 401 pattern from `api/admin/video-curator/topics/route.ts`). Validate `status` against the enum.
- [ ] **Step 2: Manual verify** — authed GET returns issues; unauth → 401; PATCH moves a card.
- [ ] **Step 3: Commit** — `git commit -m "feat(monitor): issues list/update API (phase 1)"`.

---

### Task 7: `/admin/monitor` Trello board UI

**Files:**
- Create: `src/app/admin/monitor/page.tsx` (server component: auth gate + initial issues fetch)
- Create: `src/app/admin/monitor/components/IssueBoard.tsx` (columns Triage→Approved→In-progress→PR-open→Done; drag = PATCH status)
- Create: `src/app/admin/monitor/components/IssueCard.tsx` (category chip, severity, occurrence count, first/last seen, description, recommendation, "open replay" deep-link)
- Modify: `src/app/admin/page.tsx` (add a Monitor card to the admin hub grid)

**Interfaces:**
- Consumes: Issues API (Task 6). Deep-link: `/admin/tutor-sessions/[sessionId]?t=<turnIndex>` (ReplayPlayer already supports scrub; pass the turn's timestamp).

- [ ] **Step 1: Implement** the server page with the existing auth-gate pattern (`getServerSession` + `redirect('/admin/login')`).
- [ ] **Step 2: Implement** the board + card. Unknown `signalKind`/category → render under "Other," never crash (defensive per Global Constraints). Occurrence count + sparkline placeholder (real sparkline lands in Phase 2).
- [ ] **Step 3: Wire** the "open replay" deep-link to the existing session detail/replay route at the offending turn.
- [ ] **Step 4: Add** the Monitor card to `admin/page.tsx` hub.
- [ ] **Step 5: Manual verify** — board renders real issues from a local batch run; drag updates status; replay link jumps to the turn; `npx tsc --noEmit` clean.
- [ ] **Step 6: Commit** — `git commit -m "feat(monitor): /admin/monitor Trello issues board (phase 1)"`.

---

## Self-review (done)
- Spec §6.1 Tier-A → Task 2; §6.2 Tier-B → Task 4; §6.3 dedup/cluster → Task 3; §6.4 cost caps → Tasks 4+5 (`droppedOverCap` logged); §7 dashboard → Tasks 6+7; §5.1 model → Task 1; cron precedent → Task 5. ✓
- Read-only-over-prod invariant held: only `MonitorIssue` is written. ✓
- Auth gate added per-route/page (Tasks 6, 7) since middleware doesn't cover `/admin`. ✓
- Dedup/alert-fatigue is first-class (Task 3), not an afterthought. ✓
- Defers to Phase 2: metric snapshots + sparklines + deploy-marker charts; Phase 3: the fix-assist agent triggered on Approve. Those are separate plans (not yet written — write when prioritized).
- ⚠ Re-validate at build: `session-usage` lean-doc shape, the orchestrator turn counter, ReplayPlayer's scrub-to-turn API, and the exact `getServerSession` import path.
