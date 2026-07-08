# Prod-Monitor Phases 2–4 — Plan Outline

> **DEFERRED + DEPENDENT.** These phases depend on Phase 0 + Phase 1 having landed and on the tracing-tool choice (spec §12 Q1) and a real prod baseline (severity thresholds). Task boundaries and files are specified here; full bite-sized TDD steps get filled in at prioritization time (per superpowers:writing-plans) once the dependencies are concrete — writing them now would be speculative against code that will drift. Design source: `docs/superpowers/specs/2026-07-05-prod-monitoring-agent-design.md` (§8, §9). This document IS the plan skeleton; expand a phase into its own dated plan file when it's picked up.

---

## Phase 2 — Regression tracking (depends on Phase 0 `codeVersion` + Phase 1 batch)

**Goal:** Weigh the app's performance against the fixes we ship — every metric plotted over code version, deploys marked, regressions auto-flagged.

**Task 1 — `MonitorMetricSnapshot` model.**
- Create `src/models/MonitorMetricSnapshot.ts` per spec §5.2 (no TTL). Index on `{metric, codeVersion, window.to}`.
- Test: `scripts/test-monitor-metrics.ts` — model round-trip + a `snapshotKey` uniqueness helper.
- Deliverable: persistent metric-over-version store.

**Task 2 — Metric snapshotting in the batch run.**
- Modify `src/lib/tutor/monitor/run-batch.ts` (Phase 1 Task 5): after Tier-A aggregation, write one `MonitorMetricSnapshot` per tracked metric per window, tagged with the dominant `codeVersion` in that window.
- Pure helper `computeSnapshots(rates, engagement, latency, window, codeVersion): MetricSnapshot[]` — unit-tested.
- Deliverable: each batch run records the metric time-series.

**Task 3 — Regression detection rule.**
- Extend `flagIssues` (Phase 1 Task 2) with a codeVersion-boundary rule: when a metric's post-deploy window worsens > N× vs the pre-deploy window, emit a `category:'latency'|'content-quality'|...` issue tagged `signalKind:'regression:<metric>'` naming the suspect SHA.
- Test: synthetic pre/post windows → regression candidate emitted.
- Deliverable: "regression appeared after SHA Y" auto-cards.

**Task 4 — Metric charts + deploy markers on the dashboard.**
- Create `src/app/admin/monitor/components/MetricChart.tsx` — time series per metric with vertical deploy-marker lines at each `codeVersion` change; follow the `dataviz` skill for the chart.
- Add a "Metrics" tab to `/admin/monitor` (Phase 1 Task 7); wire an authed `api/admin/monitor/metrics` read route.
- Backfill card sparklines (the Phase 1 placeholder) from snapshots.
- Deliverable: "did fix X move metric Y?" answerable visually.

---

## Phase 3 — Fix-assist agent, human-gated (depends on Phase 1 dashboard)

**Goal:** On card Approve, draft a fix as a PR with green fast-tests — human reviews/merges/deploys. Never autonomous prod writes. (Spec §8.)

**Task 1 — Fix-job record + enqueue on approve.**
- Create `src/models/MonitorFixJob.ts` (`{issueId, status, branch, prUrl, testOutput, log[]}`).
- Modify the Issues PATCH route (Phase 1 Task 6): `status:'approved'` enqueues a fix job; sets issue `status:'in-progress'`.
- Deliverable: approval creates a tracked job.

**Task 2 — Fix-agent runner (out-of-band, NOT on the prod VPS).**
- Create `scripts/monitor/run-fix-agent.ts` — polls open fix jobs; for each: assembles context (issue + affected transcripts + deep-linked replay + candidate source files + REQUIRED read of `project_tutor_round7_architecture.md` guardrails), invokes a headless Claude Code / Agent-SDK run in a worktree, has it attempt the change on branch `monitor-fix/<issueId>`.
- Decide runtime host (spec §12 Q6). Deliverable: an agent that produces a candidate diff in isolation.

**Task 3 — Test gate + PR.**
- After the agent's change: run the fast deterministic `test:*` suite (spec §3.7 list) + `next build`; capture output into the job.
- If green → `gh pr create` with diff + failing-session link + test output + risk note; set issue `status:'pr-open'`, store `prUrl`.
- If the change touches a "do-not-touch-without-strong-reason" file (VoiceTutorRealtime / system-prompt-builder / claude-brain) and fast tests can't prove safety → open a **draft PR flagged "needs careful human review."**
- If red → job `status:'failed'`, surface the failure on the card; do not open a PR.
- Deliverable: approved cards yield reviewable PRs, never prod writes.

**Task 4 — Dashboard PR status + guardrails surfacing.**
- Show `pr.url` + test output + risk note on the card; column PR-open → Done on merge (poll `gh` or a manual "mark merged").
- Deliverable: closed loop, human at every merge/deploy gate.

**Non-negotiable guardrails (from spec §8):** agent never pushes to `main`, never runs the deploy script; must read the round-7 guardrail memory before editing orchestrator/prompt files; no subject-specific prompt examples (`feedback_generic_prompts`).

---

## Phase 4 — Real-time in-session watcher (DEFERRED — maybe never)

**Goal (if ever):** react within a live session to a frustration/latency spike (alert, not intervene).

**Sketch only (do not build without a hard requirement):**
- A lightweight in-session subscriber to the `debugEvents` stream + pacing state that maintains a rolling engagement/latency score and raises an alert (dashboard/notification) when it crosses a threshold — WITHOUT touching the live turn path (observe-only, same invariant as the batch analyzer).
- Overlaps the engine's own live guardrails; high complexity, unclear marginal value over the batch loop. Revisit only if live alerting becomes a stated need.

---

## Cross-phase notes
- Every phase keeps the **read-only-over-prod** invariant (writes only monitor collections / git branches).
- Resolve spec §12 open questions (tracing tool, cadence, PII policy, severity rubric, cron host, fix-agent runtime) before expanding Phase 1→2→3 into dated plans.
- ⚠ Flag separately (not in scope): the hardcoded fallback admin (`admin123`) in `src/lib/auth.ts` must be removed before exposing monitor data (spec §10).
