# Prod Monitoring & Fix-Assist Agent — Design Spec

**Status:** DESIGN ONLY — implementation deferred (locked 2026-07-05). Build later.
**Author:** investigation + design pass 2026-07-05.
**Related plans:** `docs/superpowers/plans/2026-07-05-prod-monitor-phase0-telemetry.md`, `...-phase1-analyzer-dashboard.md`.

---

## 1. What this is

A system that watches the live Voice Tutor engine in production, continuously analyses real student↔tutor sessions, and surfaces **issue cards** (bugs, pedagogy problems, content-quality problems, student-engagement problems, latency regressions) onto a Trello-like admin dashboard for a human to triage and approve. On approval, a **fix-assist agent** drafts a code change on a branch, runs the deterministic test suite, and opens a PR — a human reviews, merges, and deploys. The agent never writes to production directly.

### Locked decisions (2026-07-05)

| Decision | Choice | Consequence |
|---|---|---|
| Fix autonomy | **Human-gated PR.** Agent drafts branch + runs fast tests + opens PR. Human merges & deploys. | No autonomous prod writes. Phase 3 = PR generation only. |
| Analysis timing | **Batch first.** Cron agent over completed sessions every N hours. | No in-session real-time watcher in MVP. Real-time is a deferred Phase 4 maybe. |
| Raw LLM tracing | **Adopt an off-the-shelf tool** (Langfuse/Helicone-style) for per-turn token/latency/cost/prompt traces. | Phase 0 wires the engine's LLM calls to the tracer instead of hand-rolling a turn-trace collection. We build only the pedagogy-specific analysis + dashboard. |
| Scope now | **Specs only, implement later.** | These docs are the deliverable; nothing ships yet. |

---

## 2. Goals & non-goals

### Goals
1. Detect and cluster **technical issues** (errors, tool-call failures, render stalls, duplicate responses, context loss) from live sessions.
2. Detect **pedagogy issues & recommendations** (bad explanations, skipped Socratic steps, over-rendering, wrong difficulty progression) by analysing transcripts + engine signals.
3. Detect **content-quality issues** grounded in engine signals: judge advisories/would-be-kills, validator rejections, Wolfram disagreements (`wrong_final_answer`), tutor mis-corrections of correct student answers (`answer_miscorrection`), false whiteboard claims.
4. Detect **student-engagement problems**: boredom, frustration, feeling unattended-to, latency pain — fused from behavioural signals, not vibes.
5. **Regression tracking**: tie each metric to the deployed code version so we can weigh app performance against the fixes/enhancements we ship (did fix X move metric Y?).
6. Surface everything as **deduped, severity-ranked issue cards** on a Trello-style board, each linking to the exact session/turn in the existing replay UI.
7. On approval, **draft a fix as a PR** with the diff, the failing session, and green fast-test output.

### Non-goals (explicitly out of scope)
- Autonomous production deploys. (No CI; single manually-deployed VPS. Human at the merge gate, always.)
- Real-time in-session intervention/alerting (deferred Phase 4).
- Replacing the engine's own live judge/validator — this system observes *post-hoc*, it does not gate live turns.
- A new sentiment/emotion ML model. Engagement is inferred from behavioural signals + LLM explanation, not a trained affect classifier.
- Building our own raw LLM-trace store (we adopt a tool for that layer).

---

## 3. Current-state findings (what the engine already gives us)

This section is the factual basis; verify against code at implementation time (file paths drift).

### 3.1 Already persisted per session — `src/models/TutorSession.ts`
The `TutorSession` document IS the recording. Per session:
- `transcript[]` — `{role: student|tutor|system, text, timestamp, whiteboardCommands?, pedagogicalIntent?}`
- `whiteboardCommands[]` — `{action, data, timestamp, sourceMessageIndex}`
- `tokenUsage[]` + `totalInputTokens/OutputTokens` + `estimatedCost`
- **`debugEvents[]`** — `{type, message (≤500 chars), timestamp, data?}` — the richest signal (~90 distinct client-emitted `type` strings; **no enum enforcement** at the Mongoose layer, so all persist)
- `weakTopics[]`, `topicsCovered[]`, `lessonProgress {lessonPlanId, currentSegmentId, completedSegmentIds[]}`
- metadata: `voiceEngine`, `source`/`sourcePartnerId`/`sourceHost`, `status`, `duration`, `messageCount`, `whiteboardItemCount`, `hasAudio`
- **TTL: auto-deleted after 180 days.**
- Written via `POST/GET /api/tutor/session-usage` (upsert). `debugEvents` flushed **incrementally** from `src/app/tutor/page.tsx` (~30s cadence, only new events sliced since last flush).
- **Audio** = raw PCM16 files on the VPS filesystem (`TUTOR_AUDIO_DIR`, `{sessionId}/{student,tutor}.pcm` + `.meta.json`), NOT in Mongo. Only `hasAudio` boolean in the DB.

### 3.2 The `debugEvents` signal vocabulary (the analyzer's primary input)
Emitted from `src/app/tutor/components/VoiceTutorRealtime.tsx` via `onDebugEvent(type, message, data)`. Representative types by category (grep `onDebugEvent?.(` for the full list):
- **Technical/bugs:** `tool_call_error`, `error`, `context_loss`, `render_sync_stall_flush`, `duplicate_response`, `rule8_retry`, `dedup_surfaced_as_rejection`.
- **Content-quality/correctness:** `wrong_final_answer` (Wolfram disagreed), `answer_miscorrection` (tutor rejected a correct student answer), `whiteboard_false_claim`, `judge_pass`, `judge_advisory_flag`, `judge_advisory_was_kill` (judge is advisory-only now — "Pillar 2b"), `judge_kill_wolfram_override`, `judge_kill_grounding_override`, `judge_kill_resume`, many `tool_call` "validated/rejected via wolfram".
- **Kill/retry lifecycle:** `kill_bridge_spoken`, `killed_render_rollback`, `killed_render_kept_restatement`, `killed_render_confirmed`, `self_correction_retry`, `contradiction_inversion_retry`, `kill_suppressed_final_attempt`.
- **Engagement/pacing:** `fatigue_detected`, `pacing_cue`, `pacing_segment_mastered`, `brain_turn` (carries per-turn client latency), `noise_nag_armed`, perception verdicts (`perception_stage*_*`).
- Note: `MAX_VALIDATOR_RETRIES = 2`; there is no canonical "retry N/2" field — retries are visible only via these events.

### 3.3 Engagement signals that exist today (all proxies, no emotion model)
- **Fatigue** = short-answer-streak (`VoiceTutorRealtime.tsx` ~1849): ≥5 of last 6 replies ≤2 words → `fatigue_detected` + prompt injection. Cooldown 5 min.
- **Boredom-cue regex** (~1448): `/\b(i know this|obviously|skip|duh|easy|boring|next|too fast|slow down|slower|faster|speed up)\b/i` → `pacing_cue` + `<student_state>` hint.
- **Pacing v2** infers **struggle** (incorrect-streak), **mastery** (correct-streak, `segmentMastered`), **speed preference** (`paceBias` −2..+2). Persisted to `localStorage evelyn:pacing-v2:<planId>` and resumed cross-session.
- **Help-request** detection (`isHelpRequest`), **walk-through insistence** counter ("just give me the answer" repetition), **correction frequency** (`brainCorrectionRegex`).
- **Perception layer** (turn-taking only, NOT affect): barge-in / false-barge-in / self-voice / filler / noise / VAD silence / STT latency / mic RMS. Gated by `NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE`.

### 3.4 Cross-session derived state — `src/models/StudentProfile.ts`
`mastery{}`, `gaps[]` (with diagnostic signal codes), `recentSessions[]` (`SessionMemory`: sessionId/subject/topic/losTouched/summary/masteryDeltas, pruned to a cap), `preferences`, `planContentSeen`. Written by `commitSessionToProfile` + `upsertSessionMemory`. This is derived pedagogy, not raw telemetry.

### 3.5 Admin / replay infra (dashboard foundation)
- `/admin/tutor-sessions` — server-component list, MongoDB-backed, paginated 50/page, **rich filters** (`src/lib/tutor/recordings/filters.ts`: source chips, date chips, partner/host facets).
- Detail page `[sessionId]/page.tsx` — metadata cards + embedded replay + full transcript render (color-coded, timestamps, `pedagogicalIntent`).
- **ReplayPlayer** (`components/ReplayPlayer.tsx`) — time-synced whiteboard replay + PCM16 audio (student/tutor tracks) + transcript stream + scrub/speed.
- **Curated timeline** (`src/lib/tutor/recordings/timeline-events.ts`) — already categorizes debug events into labeled dots (kill/retry, barge-in, mic, upload, error).
- **Auth:** NextAuth v4 (JWT, 24h), `src/lib/auth.ts`, `CredentialsProvider` vs `AdminUser` model. **Enforced per-page/route** (`getServerSession` + `redirect`), NOT via middleware (`src/middleware.ts` only does hostname rewrites). ⚠ A hardcoded fallback admin (`admin@evelynlearning.com` / `admin123`) exists in `auth.ts` — a security weak point to flag separately.

### 3.6 Batch/scheduled-job precedent (analyzer foundation)
- **`node-cron` in-process scheduler**: `src/lib/services/blog-scheduler.ts` (`startAutoBlogScheduler`/`stopAutoBlogScheduler`/`triggerAutoBlogGeneration`) + `auto-blog-generator.ts` (`INTERVAL_CRON_EXPRESSIONS`). Toggled via authed API `api/ai/blog/auto`. Queue model `BlogQueue.ts`. **Closest existing analog to "scheduled batch LLM analysis."** Caveat: in-process, dies/restarts with the single PM2 process.
- **Video-curator** (`admin/video-curator/` + `api/admin/video-curator/`) — admin-triggered batch LLM/media job precedent.
- **`/api/ai/claude/route.ts`** — reusable LLM endpoint template: model whitelist, `MAX_TOKENS_LIMIT`, in-memory rate limit (20/min), daily-limit check, structured API-error classification.

### 3.7 Deploy / test reality (constrains the fix agent)
- **NO CI/CD.** No `.github/workflows`, no `vercel.json`. Deploy = manual shell script `deploy-to-production.sh`: build locally with `.env.local.production`, zip `.next`+`src`, `scp` to **Contabo VPS root@84.247.185.169:/root/evelynlearning**, `npm ci --omit=dev`, PM2 restart (`next start -p 3001`). No test gate; a failing test does NOT block deploy (only a build failure does). Backup = one `cp -r` dir. Single process, no staging/blue-green.
- **~70 `test:*` scripts** (standalone `tsx` under `scripts/`):
  - *Fast deterministic (ideal fix-agent gate):* `test:process-tool-call`, `test:conic`, `test:graph-consistency`, `test:graph-math`, `test:timeline`, `test:caption-sync`, `test:sketch-validate/render`, `test:board-map`, `test:page-model`, `test:orchestrator-helpers`, `test:recordings`, `test:student-marks`, `test:resume-seed`, `test:kill-keep`, `test:gaps`, `test:portal` (9 sub-tests).
  - *Slow / LLM / needs live server (verification, not a tight gate):* `test:render-tools|harvest|judge`, `test:tutor-e2e` (Playwright + real brain on :3006), `test:tutor-judge`, ~25 `test:pedagogy-*`.

### 3.8 The gaps that must be closed before analysis is possible
1. **Per-turn latency/tokens/stop-reason/tools/RULE8 are STDOUT-ONLY** (`[brain.stream]` serverlog lines in `api/tutor/brain/stream/route.ts` ~650) — never in the DB. Split-brain: server stdout vs client `debugEvents`, **no shared turn-id**. → Phase 0 fixes this (via the adopted tracing tool + a turn-id).
2. **No deploy/version stamp on sessions.** Can't A/B a metric across a fix. → Phase 0 adds `codeVersion`.
3. **Judge cost/latency not persisted**; full judge claim/why truncated to 500 chars; cache tokens not persisted. → tracing tool covers cost/latency; Phase 0 optionally widens the judge event.
4. **`debugEvents.type` unvalidated** (typos persist); flush lossy on hard crash. → Phase 0 adds a typed constant + defensive dashboard reads.
5. **180-day TTL** caps long-horizon trends → the Issue store and rolled-up metrics live in a **separate collection without the TTL**.
6. **No engagement/frustration index** — signals are logged independently, never fused. → Phase 1 builds the scorer.

---

## 4. Architecture (phased)

```
                    ┌─────────────────────────────────────────────┐
   PROD ENGINE  ──▶ │ Phase 0: telemetry unification              │
  (TutorSession,    │  • adopt tracing tool for turn traces       │
   debugEvents,     │  • stamp sessions w/ codeVersion            │
   serverlogs)      │  • typed debugEvent vocabulary + turn-id    │
                    └───────────────────┬─────────────────────────┘
                                        │  (clean, queryable signal)
                    ┌───────────────────▼─────────────────────────┐
                    │ Phase 1: batch analyzer (node-cron)         │
                    │  • cheap deterministic pass (thresholds)    │
                    │  • LLM pass on flagged sessions only        │
                    │  • dedup + cluster + severity rank          │
                    │        ──▶  Issue store (new collection)    │
                    └───────────────────┬─────────────────────────┘
                                        │
              ┌─────────────────────────▼──────────────────────────┐
              │ Phase 1: Issues dashboard (/admin/monitor)          │
              │  Trello board: Triage→Approved→In-progress→Done     │
              │  each card → deep-links to existing replay@turn     │
              └─────────────────────────┬──────────────────────────┘
                                        │  (human approves a card)
              ┌─────────────────────────▼──────────────────────────┐
              │ Phase 3: fix-assist agent (human-gated)             │
              │  branch → attempt fix → run fast test:* → open PR   │
              │  human reviews / merges / deploys (existing script) │
              └────────────────────────────────────────────────────┘

   Phase 2: regression tracking — metrics-over-codeVersion, woven into the dashboard.
   Phase 4 (deferred): real-time in-session watcher/alerting.
```

**Data-flow principle:** the analyzer is **read-only over production data** and writes only to its own `MonitorIssue` collection. It never touches the live turn path. The fix agent writes only to git (a branch/PR), never to the running server.

---

## 5. Data model (new)

New Mongoose models in `src/models/`. These live OUTSIDE the 180-day-TTL session collection so history survives.

### 5.1 `MonitorIssue`
```ts
interface IMonitorIssue {
  issueId: string;              // stable slug, e.g. "render-stall-desmos-2026-07"
  category: 'bug' | 'pedagogy' | 'content-quality' | 'engagement' | 'latency' | 'other';
  title: string;                // one-line human summary
  description: string;          // LLM-written detail + evidence
  severity: 'p0' | 'p1' | 'p2' | 'p3';
  status: 'triage' | 'approved' | 'in-progress' | 'pr-open' | 'done' | 'wontfix' | 'dismissed';
  signalKind: string;           // machine tag, e.g. "render_sync_stall_flush" | "answer_miscorrection" | "engagement.frustration"
  occurrences: number;          // how many sessions/turns exhibit it (dedup count)
  firstSeen: Date; lastSeen: Date;
  affectedSessions: Array<{ sessionId: string; turnIndex?: number; codeVersion?: string; excerpt?: string }>;
  metrics?: Record<string, number>;   // e.g. { rate: 0.12, baselineRate: 0.03 }
  recommendation?: string;      // LLM/analysis proposed fix direction
  pr?: { branch: string; url?: string; status: string; testOutput?: string };
  createdAt: Date; updatedAt: Date;
  // dedup key = hash(signalKind + normalized(title))
  dedupKey: string;             // unique index
}
```

### 5.2 `MonitorMetricSnapshot` (Phase 2 — regression tracking)
```ts
interface IMonitorMetricSnapshot {
  window: { from: Date; to: Date };
  codeVersion: string;          // git SHA / deploy tag active in this window
  metric: string;              // "kill_rate" | "miscorrection_rate" | "p95_first_sentence_ms" | "fatigue_rate" | ...
  value: number;
  sampleSize: number;          // sessions/turns in window
  createdAt: Date;
}
```

### 5.3 Session additions (Phase 0, on `TutorSession`)
- `codeVersion?: string` — git SHA (or deploy tag) the session ran on. Injected at session start from a build-time env (`process.env.EVELYN_BUILD_SHA`, set by the deploy script).
- Optional `traceId?: string` — correlation id to the adopted tracing tool.

---

## 6. The analysis pipeline (Phase 1 detail)

Two-tier to keep cost bounded. **Cheap first, LLM only on flags.**

### 6.1 Tier A — deterministic aggregation (no LLM)
Over each batch window of completed sessions:
- **Rate metrics** per `debugEvents.type` (normalized by turn count): error rate, `tool_call_error` rate, `render_sync_stall_flush` rate, `duplicate_response` rate, `wrong_final_answer` rate, `answer_miscorrection` rate, `whiteboard_false_claim` rate, `judge_advisory_was_kill` rate, kill/retry rate.
- **Latency** percentiles from the tracing tool (p50/p95/p99 first-sentence, first-tool, total) — and per-model token/cost.
- **Engagement rates**: `fatigue_detected` rate, `pacing_cue` rate, incorrect-streak distribution, walk-through-insistence incidence, barge-in frequency, mean inter-turn silence (from VAD timestamps if available in traces).
- **Threshold + trend rules** produce candidate issues: a rate crossing an absolute threshold OR deviating > N× from the trailing baseline OR spiking after a `codeVersion` change → flag the session set.
- Deterministic issues (e.g. "`tool_call_error` for kind X up 4× this week") become cards WITHOUT any LLM call.

### 6.2 Tier B — LLM classification (only on flagged sessions)
For sessions flagged by Tier A (or a sampled subset for pedagogy/engagement which have no crisp deterministic trigger):
- Feed the **transcript** (+ optional key `debugEvents`, + optional audio-derived features) to Claude with a structured-output schema.
- Ask it to: classify category, confirm/deny the flag (reduce false issues), write a plain-English title + description grounded in cited turns, propose a recommendation, and assign a preliminary severity.
- **Engagement:** the LLM is given the behavioural evidence (short-answer streak, silences, walk-through insistence, corrections, latency) and asked to *explain and label* frustration/boredom/feeling-unattended — it is NOT the sole detector; the behavioural signal is the trigger, the LLM is the narrator. This directly counters the "LLM vibes" failure mode.
- Reuse the `/api/ai/claude` rate-limit/error-classification template; run under the `node-cron` scheduler like `blog-scheduler`.

### 6.3 Dedup & clustering
- Compute `dedupKey = hash(signalKind + normalizedTitle)`. Upsert into `MonitorIssue`: existing key → increment `occurrences`, append session, bump `lastSeen`; new key → new card in `triage`.
- Cluster near-duplicate LLM titles (embedding or normalized-string similarity) before insert so 40 identical stalls = one card, count 40. **This is the same alert-fatigue problem the engine's own judge has; treat it as first-class, not an afterthought.**

### 6.4 Scale/cost controls (log what's dropped)
- Cap LLM analyses per batch (top-N by severity/occurrence); `log()` the number of flagged-but-not-analyzed sessions so silent truncation never reads as "clean."
- Sample pedagogy/engagement LLM review (e.g. X% of sessions + all Tier-A-flagged) rather than 100%.

---

## 7. The dashboard (Phase 1 detail)

New admin area `src/app/admin/monitor/` (gated by the existing NextAuth `getServerSession` per-page pattern — add its own check; middleware does not cover `/admin`).
- **Board view** — columns Triage → Approved → In-progress → PR-open → Done, cards drag between columns (status update via a new authed API `api/admin/monitor/issues`).
- **Card** — category chip, severity, occurrence count, first/last seen, sparkline of the metric over time (Phase 2), the LLM description + recommendation, and a **"open replay"** deep-link to `/admin/tutor-sessions/[sessionId]` at the offending `turnIndex` (reuse ReplayPlayer scrubbing).
- **Approve action** — moves card to Approved and (Phase 3) enqueues the fix agent.
- Built defensively over `debugEvents.type` (unvalidated field) — unknown types render as "other," never crash.
- Reuse the existing filters + session-list components where possible.

---

## 8. The fix-assist agent (Phase 3 detail — human-gated)

On card **Approve**:
1. Enqueue a fix job (a `MonitorIssue.status='in-progress'` + a job record).
2. Agent (a Claude Code-style headless run, or a scripted Agent-SDK job) receives: the issue, the affected sessions' transcripts/events, the deep-linked replay, and the relevant source files.
3. Agent creates a branch `monitor-fix/<issueId>`, attempts the change, and runs the **fast deterministic `test:*` gates** (§3.7) + `next build` (Next type-check). It does NOT run the slow LLM/e2e suite in the tight loop (too slow/flaky) but MAY attach a recommended manual verification (e.g. "run `test:tutor-e2e` scenario Z").
4. Agent opens a **PR** (via `gh`) with: the diff, the failing session link, the green test output, and a risk note. Sets `MonitorIssue.status='pr-open'`, stores `pr.url`.
5. **Human reviews, merges, deploys** via the existing `deploy-to-production.sh`. On merge, card → Done.

**Guardrails (non-negotiable given the engine's fragility):**
- The agent MUST read the round-7 guardrail memory (`project_tutor_round7_architecture.md`) context before touching `VoiceTutorRealtime.tsx` / `system-prompt-builder.ts` / `claude-brain.ts` — these files have dozens of load-bearing invariants a naive fix will regress.
- Never edit the system prompt with subject-specific examples (`feedback_generic_prompts`).
- If the fix touches a "do not touch without strong reason" file and the fast tests can't prove safety, the agent opens a **draft PR flagged "needs careful human review"** rather than a normal PR.
- The agent never pushes to `main`, never runs the deploy script.

---

## 9. Regression tracking (Phase 2 detail)

Answers "weigh the app's performance in relation to the fixes we made."
- Requires `TutorSession.codeVersion` (Phase 0).
- The batch job writes `MonitorMetricSnapshot` rows per metric per `codeVersion` window.
- Dashboard shows each metric as a time series with **deploy markers** (vertical lines at each `codeVersion` change). A fix that lands and drops `answer_miscorrection` rate is visible; a regression that appears after a SHA is flagged as an issue automatically (Tier-A trend rule keyed on codeVersion boundaries).
- Enables "did shipping fix X actually help?" and "which deploy introduced regression Y?" — the core of the user's regression-monitoring ask.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Auto-fixing a fragile pedagogy engine regresses a subtle invariant. | Human-gated PR only; fast-test gate + guardrail-memory read; draft-PR flag for risky files; never auto-deploy. |
| The monitor's LLM produces false issues → alert fatigue (reinvents the judge problem). | Behavioural triggers first, LLM explains not detects; dedup + clustering + severity ranking first-class; confidence gating. |
| LLM cost of analysing every session. | Two-tier (deterministic first); cap analyses/batch; sample pedagogy/engagement; adopt-tool for raw traces. |
| Student conversation + audio privacy (PII to an LLM). | Deliberate data-handling decision before Phase 1; consider redaction; keep issue store access behind admin auth; document retention. |
| 180-day session TTL + no version stamp limit history. | Issue store + metric snapshots live TTL-free; Phase 0 adds `codeVersion`. |
| In-process cron dies with the single PM2 process. | Acceptable for batch (idempotent, catches up next run); note as a known limitation; external scheduler is a later hardening. |
| Hardcoded fallback admin (`admin123`) exposes the new dashboard. | Out of scope for this build but FLAG loudly — fix before exposing monitor data. |

---

## 11. Phasing & effort (rough)

| Phase | Deliverable | Depends on | Rough effort |
|---|---|---|---|
| **0** | Telemetry unification: adopt tracing tool, `codeVersion` stamp, typed debugEvent vocabulary + turn-id. | — | S–M |
| **1** | Batch analyzer (cron, 2-tier) + `MonitorIssue` store + read-only Trello dashboard. | 0 | L (the MVP) |
| **2** | Regression tracking: `MonitorMetricSnapshot` + metric-over-version charts + deploy markers. | 0, 1 | M |
| **3** | Fix-assist agent: approve→branch→test→PR (human-gated). | 1 | M–L |
| **4** | (Deferred) real-time in-session watcher/alerting. | 1 | L (maybe never) |

**Recommended build order:** 0 → 1 → 2 → 3. Ship 0+1 as the MVP (delivers ~80% of value, touches no prod code path). Add 2 once `codeVersion` is flowing. Do 3 last and keep it human-gated.

---

## 12. Open questions (resolve before Phase 1 build)
1. **Which tracing tool?** Langfuse (self-hostable, OSS) vs Helicone vs other. Self-host matters for the PII posture. Decide before Phase 0.
2. **Batch cadence & window** — hourly? every 6h? nightly? Depends on session volume (unknown here — measure first).
3. **PII/redaction policy** for transcripts sent to the analysis LLM.
4. **Severity rubric** — concrete thresholds per metric (needs a baseline from real prod data first).
5. **Where does the cron run?** In-process (blog-scheduler pattern, dies with PM2) vs a separate small worker. In-process is fine for MVP.
6. **Fix-agent runtime** — Claude Code headless vs Agent SDK job; where it executes (not the prod VPS).

---

## 13. Pointers (verify at implementation time — paths drift)
- Session model: `src/models/TutorSession.ts`; persistence route `src/app/api/tutor/session-usage/route.ts`; client flush `src/app/tutor/page.tsx` (~454–494).
- Debug-event emitters: `src/app/tutor/components/VoiceTutorRealtime.tsx` (grep `onDebugEvent?.(`).
- Brain telemetry (stdout): `src/app/api/tutor/brain/stream/route.ts` (~650); judge `src/app/api/tutor/judge/route.ts`.
- Engagement signals: `VoiceTutorRealtime.tsx` ~1448 (boredom regex), ~1849 (fatigue); pacing in `claude-brain.ts` (~640–749) + `pedagogy/grade-profile.ts`.
- Admin/replay: `src/app/admin/tutor-sessions/`, `components/ReplayPlayer.tsx`, `src/lib/tutor/recordings/{filters,timeline-events}.ts`.
- Cron precedent: `src/lib/services/blog-scheduler.ts`. LLM endpoint template: `src/app/api/ai/claude/route.ts`. Auth: `src/lib/auth.ts`.
- Deploy: `deploy-to-production.sh`. Guardrails to respect: memory `project_tutor_round7_architecture.md`.
