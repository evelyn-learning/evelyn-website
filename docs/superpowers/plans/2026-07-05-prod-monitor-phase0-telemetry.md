# Prod-Monitor Phase 0 — Telemetry Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **DEFERRED BUILD (design 2026-07-05).** Re-validate every file path / line reference against current code before implementing — this repo's large orchestrator files drift. Design source: `docs/superpowers/specs/2026-07-05-prod-monitoring-agent-design.md`.

**Goal:** Make the engine's per-session signal queryable and version-attributable, so a later analyzer can reason over it — without a single stdout scrape.

**Architecture:** Three independent, low-risk additions: (1) stamp each `TutorSession` with the code version it ran on; (2) give `debugEvents.type` a typed, validated vocabulary; (3) route the engine's LLM calls through an adopted tracing tool for per-turn token/latency/cost. No live turn-path behaviour changes.

**Tech Stack:** Next.js app router, Mongoose, existing `TutorSession` model, the chosen LLM-tracing SDK (Langfuse/Helicone — decide first, see spec §12 Q1), PM2 deploy script.

## Global Constraints
- Node/Next versions: match existing repo (do not bump).
- No behaviour change to the live turn path — these are additive telemetry-only edits.
- Follow the repo's existing large-file conventions; do not restructure `VoiceTutorRealtime.tsx`.
- All new env vars documented in `.env.local.example`.
- TS strict; `npx tsc --noEmit` must stay clean.

---

### Task 1: Stamp sessions with `codeVersion`

**Files:**
- Modify: `src/models/TutorSession.ts` (add field to interface + schema)
- Modify: `src/app/api/tutor/session-usage/route.ts` (accept + persist `codeVersion` on upsert)
- Modify: session-start client (`src/app/tutor/page.tsx` where the initial `saveSessionUsage` fires) to send `process.env.NEXT_PUBLIC_EVELYN_BUILD_SHA`
- Modify: `deploy-to-production.sh` (export `NEXT_PUBLIC_EVELYN_BUILD_SHA=$(git rev-parse --short HEAD)` into the build env before `npm run build`)
- Modify: `.env.local.example` (document `NEXT_PUBLIC_EVELYN_BUILD_SHA`)
- Test: `scripts/test-monitor-telemetry.ts` (new)

**Interfaces:**
- Produces: `TutorSession.codeVersion?: string` (git short SHA or `"dev"`), settable via the session-usage POST body `{ codeVersion }`.

- [ ] **Step 1: Write the failing test** — assert the session-usage upsert persists `codeVersion`.
```ts
// scripts/test-monitor-telemetry.ts
import assert from 'node:assert';
import { buildSessionUpdate } from '../src/app/api/tutor/session-usage/helpers'; // extract pure helper in step 3
let passed = 0;
function check(l: string, f: () => void) { try { f(); passed++; console.log(`  ✓ ${l}`); } catch (e) { console.error(`  ✗ ${l}\n    ${e}`); process.exitCode = 1; } }
check('codeVersion flows into the update doc', () => {
  const upd = buildSessionUpdate({ sessionId: 's1', codeVersion: 'abc1234' });
  assert.equal(upd.$set.codeVersion, 'abc1234');
});
check('missing codeVersion → undefined, not crash', () => {
  const upd = buildSessionUpdate({ sessionId: 's1' });
  assert.equal(upd.$set.codeVersion, undefined);
});
console.log(`\nmonitor-telemetry: ${passed} checks passed`);
```
- [ ] **Step 2: Run it, verify it fails** — `npx tsx scripts/test-monitor-telemetry.ts` → FAIL (`buildSessionUpdate` / helpers module not found).
- [ ] **Step 3: Extract a pure `buildSessionUpdate` helper** from the existing inline upsert logic in `session-usage/route.ts` into `src/app/api/tutor/session-usage/helpers.ts`, add `codeVersion` to its `$set`. Add `codeVersion?: string` to `ITutorSession` + a `String` schema field in `TutorSession.ts`.
- [ ] **Step 4: Run it, verify it passes** — `npx tsx scripts/test-monitor-telemetry.ts` → PASS.
- [ ] **Step 5: Wire the client + deploy script** — client sends `NEXT_PUBLIC_EVELYN_BUILD_SHA` (fallback `"dev"`); `deploy-to-production.sh` exports the SHA before build; document in `.env.local.example`.
- [ ] **Step 6: Typecheck + add npm script** — add `"test:monitor-telemetry": "tsx scripts/test-monitor-telemetry.ts"` to `package.json`; `npx tsc --noEmit` clean.
- [ ] **Step 7: Commit** — `git commit -m "feat(monitor): stamp TutorSession with codeVersion (phase 0)"`.

---

### Task 2: Typed `debugEvents` vocabulary

**Files:**
- Create: `src/lib/tutor/telemetry/debug-event-types.ts` (the canonical union + a runtime `Set` + a `normalizeDebugEventType` fn)
- Modify: `src/app/api/tutor/session-usage/route.ts` (normalize/tag unknown types on persist, never reject)
- Modify: `src/models/TutorSession.ts` (`IDebugEvent.type` references the exported union)
- Test: extend `scripts/test-monitor-telemetry.ts`

**Interfaces:**
- Produces: `DEBUG_EVENT_TYPES: readonly string[]`, `type DebugEventType`, `normalizeDebugEventType(raw: string): { type: string; known: boolean }`.

- [ ] **Step 1: Write the failing test.**
```ts
check('known type passes through', () => {
  const r = normalizeDebugEventType('fatigue_detected');
  assert.equal(r.type, 'fatigue_detected'); assert.equal(r.known, true);
});
check('unknown type tagged, not dropped', () => {
  const r = normalizeDebugEventType('typo_evnt');
  assert.equal(r.type, 'typo_evnt'); assert.equal(r.known, false);
});
```
- [ ] **Step 2: Run, verify fail** (module not found).
- [ ] **Step 3: Implement** `debug-event-types.ts` — enumerate the ~90 real types by grepping `onDebugEvent?.(` in `VoiceTutorRealtime.tsx`; export the union, a `Set`, and `normalizeDebugEventType` (returns `known:false` for unseen types but never throws — dashboards must tolerate unknowns).
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Use it on persist** — in `session-usage/route.ts`, tag persisted events with `known` (or log a one-line warn on unknown) so a typo is observable, never silently swallowed. Do NOT reject unknowns (forward-compat).
- [ ] **Step 6: Typecheck clean. Commit** — `git commit -m "feat(monitor): typed debugEvent vocabulary + normalize-on-persist (phase 0)"`.

---

### Task 3: Route engine LLM calls through the tracing tool

**Files:**
- Create: `src/lib/tutor/telemetry/tracer.ts` (thin wrapper around the chosen tracing SDK; no-op if `MONITOR_TRACING=off`)
- Modify: `src/app/api/tutor/brain/stream/route.ts` + `brain/route.ts` (wrap the brain call; attach `sessionId`, `turnIndex`, `codeVersion` as trace metadata)
- Modify: `src/app/api/tutor/judge/route.ts` (wrap the judge call)
- Modify: `src/app/api/tutor/perception-classify/route.ts` (wrap the Haiku classify call)
- Modify: `.env.local.example` (tracing SDK keys + `MONITOR_TRACING`)
- Test: extend `scripts/test-monitor-telemetry.ts` (tracer no-ops cleanly when disabled)

**Interfaces:**
- Consumes: `codeVersion` (Task 1).
- Produces: `traceTurn({ sessionId, turnIndex, codeVersion, kind }, fn)` — wraps an LLM call, records tokens/latency/model/cost to the tracer, returns `fn`'s result unchanged. `traceId` returned for optional persistence on the session.

- [ ] **Step 1: Decide the tracing tool** (spec §12 Q1) — Langfuse (self-host, PII-friendly) recommended. Add its SDK dep.
- [ ] **Step 2: Write the failing test** — with `MONITOR_TRACING=off`, `traceTurn` returns the inner result and makes zero network calls.
```ts
check('tracer no-ops when disabled', async () => {
  process.env.MONITOR_TRACING = 'off';
  const out = await traceTurn({ sessionId: 's', turnIndex: 0, kind: 'brain' }, async () => 42);
  assert.equal(out, 42);
});
```
- [ ] **Step 3: Run, verify fail.**
- [ ] **Step 4: Implement `tracer.ts`** — fail-open no-op wrapper; when enabled, opens a span with metadata and records usage from the LLM response. NEVER let a tracing failure break a live turn (wrap in try/catch, swallow).
- [ ] **Step 5: Run, verify pass.**
- [ ] **Step 6: Wire the 3 call sites** — brain (stream + json), judge, perception-classify. Pass `sessionId`/`turnIndex`/`codeVersion`. Turn-index: use the existing turn counter in the orchestrator; thread it into the brain request body. This closes the split-brain (server timing now correlatable by `sessionId+turnIndex`).
- [ ] **Step 7: Typecheck clean; manual smoke** — run one local dev session with `MONITOR_TRACING=on`, confirm traces appear in the tool with correct `codeVersion`/`turnIndex`. Confirm `off` is byte-neutral.
- [ ] **Step 8: Commit** — `git commit -m "feat(monitor): route brain/judge/perception LLM calls through tracer (phase 0)"`.

---

## Self-review (done)
- Spec §3.8 gaps 1 (split-brain/turn-id), 2 (codeVersion), 4 (typed vocabulary) → Tasks 3, 1, 2 respectively. ✓
- Gap 3 (judge cost/latency) → covered by Task 3 (tracer records judge tokens/latency). Full-claim-text widening deferred to Phase 1 (only needed when the analyzer consumes it).
- No autonomous prod writes introduced; all edits additive + fail-open. ✓
- Note: exact `session-usage/route.ts` upsert shape + the orchestrator turn counter name must be re-confirmed at build time.
