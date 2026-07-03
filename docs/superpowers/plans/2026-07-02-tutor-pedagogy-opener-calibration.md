# Tutor Pedagogy: Human Opener, Calibration & Context Loop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AI tutor open like a human teacher — act first with an eye-catching board, calibrate the student conversationally, adapt its path from context, and remember what the student tells it about themselves — with the lesson plan demoted from a rail to a seed, differently for demo vs subscribed students.

**Architecture:** Three layers. (1) The **portal-contract** carries a progress digest inbound and activates the frozen `socialMemoryDelta` write-back. (2) The **engine** takes a proactive first turn on session start, runs a brain-owned conversational opener+calibration phase (no state machine), treats the lesson plan as path-flexible / coverage-faithful, gates completion behind live demonstration ("compress-and-confirm"), and runs a session-end extraction sweep. (3) **Academy** stores the suggested social threads and re-feeds them with recency for anti-repetition. Everything keys off `isTrial || no-portal-context` = "demo mode."

**Tech Stack:** Next.js (engine + academy web), Node/Express API (academy), Zod (portal-contract), MongoDB (both), Anthropic SDK (brain = Sonnet; extraction = Haiku).

**Testing:** Two-layer pedagogy harness (deterministic gates + Sonnet rubric judge) driven by a Haiku **student-simulator** that role-plays fixture personas so conversational behavior can be stress-tested. Extends the existing `test:tutor-e2e` Playwright harness + render-audit `processToolCall` seam. Every feature task ends with a harness run + a results report presented to the user before the next task starts (see **Testing & Reporting Protocol** and **Scenario Matrix**).

## Global Constraints

- **Brain trust, not bloat.** No rigid buckets, no `set_entry_level` routing tool, no per-plan authored "below-level example." Calibration is conversational; the brain holds context and steers. (Ref: user feedback `feedback_generic_prompts` — prefer generic prompts over deterministic bloat.)
- **Completion is always earned.** No LO/node is marked complete without live demonstrated evidence *this session* (v1 = compress-and-confirm only). A calibration knowledge-*claim* is a candidate hint, never a mastery write. Pure-skip (prior-evidence + probe, near-zero-teach) is **explicitly deferred to a later phase.**
- **Path-free, destination-faithful.** For subscribed students the brain may reorder / compress / detour / re-theme freely, but the plan's LOs remain the coverage contract so `Enrollment` progress + `milestone` emits stay truthful. For demo students the plan is a pure seed with zero coverage obligation.
- **Demo detection:** demo behaviors fire when `isTrial === true` OR there is no portal `StudentContext` at all (logged-out showcase). Subscribed-non-trial gets warm-resume + progress fidelity.
- **Privacy split:** demo = full social warmth, **session-only, nothing persisted anywhere.** Subscribed = `socialMemoryLevel` defaults to `'light'` behind a visible parent/student toggle; the existing `parentalOptOut` ceiling is always respected.
- **Brain never initiates a sell.** The teaching is the pitch; the UI owns the enrol CTA. The brain may *respond* to an explicit "how do I keep going?" but never *initiate* a sales beat.
- **Contract changes are additive only** (Rule-0: existing portal integrations must not break). Bump the contract minor version; new fields optional with safe defaults.
- **Fail-to-simple on the opener.** A fancy first-turn render that fails validation falls back to a clean minimal visual; the student never sees a blank board on their first impression.
- **Session mode gates everything (from `target.kind`).** `diagnostic` sessions are assessment, not teaching — the opener/calibration/completion features **must no-op** there. `freestyle` sessions have no lesson plan — plan-as-seed is N/A and completion-gating is **disabled** (node marks `studied` on completion, no LO gate). Only `lessonNode` gets the full feature set. See the **Session-Mode & Journey Matrix**.
- **No calibration state machine.** (Reaffirming decisions #1/#11 against a tempting investigation recommendation.) The brain owns the opener/calibration conversationally inside its normal turn flow. The orchestrator does **not** route student input to a separate "calibration handler" or count exchanges. Its only new duties: fire the opening turn, **suppress the existing `[orchestrator: Begin teaching immediately]` auto-start injection** (page.tsx ~775, `pendingAutoStartPlanIdRef`) until the brain transitions itself, skip the opener on resume, and gate by mode.
- **Trial wall is milestone-boxed, not a timer.** It fires on the `first_concept_complete` milestone. For an academy **trial**, the demo's "satisfying stop" must be engineered to land ON that milestone (the win == the wall == the conversion moment). The time/engagement budget framing applies only to the **logged-out showcase** demo, which has no wall and no contract.
- **`socialMemoryDelta` real shape is `{ new: SocialThread[], referenced: string[] }`** and must pass through `stripNullsDeep` before the wire (the null-vs-optional trap that 500s the portal). Trial/opt-out sessions emit it absent.
- **Attempt tracking excludes tutor-side retries.** Completion's "demonstrated correct" signal counts only genuine student answers — never validator-kill or judge-restatement retries of the tutor's own narration (those don't inflate mastery or session length).
- **Features gate to the `claude-brain` engine** (the Sonnet brain). Realtime-v2/Gemini paths are unaffected by these flags; calibration copy is model-agnostic but we ship/verify on claude-brain first.

---

## Session-Mode & Journey Matrix

This is the behavioral spec. Every task's behavior is conditioned on **(1) session mode** (`target.kind`) and **(2) journey/user state**. Derived from the engine lifecycle, Academy enrollment machinery, and the contract surface.

### Gate 1 — Session mode (`target.kind`)

| Mode | Opener + calibration | Plan-as-seed | Completion gating | Write-back | Notes |
|---|---|---|---|---|---|
| **`diagnostic`** | **NO** (assessment, not teaching; its own low-pressure "let's see where you're starting" framing already exists) | N/A | N/A | seeded mastery/gaps via existing `/assessment/submit` | Our features **must detect and no-op**. Silent (no score shown). |
| **`freestyle`** | **YES** (opener + calibration or warm-resume) | N/A — no plan; brain teaches from `freestyleMaterial` text | **DISABLED** — no segments/LOs; node marks `studied` on completion | social threads + learning-state as usual | No progress pills. `currentSegmentId` empty ⇒ gating off. |
| **`lessonNode`** | **YES** | full (path-free, coverage-faithful) | full (compress-and-confirm) | full | The main path; journey gate below applies. |

### Gate 2 — Journey / user state (within a teaching mode)

| Journey | Detected by | Opener behavior | Calibration | Completion | Persistence |
|---|---|---|---|---|---|
| **Logged-out showcase** | no portal context / no `studentId` | proactive human opener, full warmth | full (grade from picker; name may be absent → nameless opener) | compress-and-confirm | **none** (ephemeral); CTA = sign-up UI; engagement-boxed stop |
| **Academy trial** | `isTrial === true` | proactive opener, warmth is **prompt-manner only** (threads forced `off`, profile is placeholder `"Trial student"`/grade `"unknown"` → opener stays graceful, calibration gathers grade) | full | compress-and-confirm | **none persisted** (trial); **stop == `first_concept_complete` == the wall**; on claim → reparent + diagnostic |
| **Subscribed, brand-new, diagnostic skipped** | `perNodeState.length === 0` & `diagnostic.takenAt == null` | warm welcome (has name/grade/course) | **light** — no "tell me about yourself" interrogation | compress-and-confirm | persists (`light`) |
| **Subscribed, new, diagnostic taken** | `diagnostic.takenAt != null`, low exposures | warm welcome referencing the start, **warmstart from seeded mastery** | **none/near-none** — do NOT re-quiz; teach into diagnosed gaps | compress-and-confirm | persists |
| **Returning mid-course** | `perNodeState.length > 0`, prior mastery | **warm-resume** (unused social thread / last-session callback / progress arc); anti-repetition | **none** (has history) | compress-and-confirm | persists |
| **Resume mid-node** | in-progress `Session` + live `currentSegmentId` (≤30d) | **"pick up where we left off"** — no opener/calibration; restore position | none | resumes prior segment state | checkpoint continuity (same `sessionId`) |
| **Resume, stale checkpoint** | checkpoint > resume window | graceful **cold restart of the node** + a light re-orient (not full calibration) | light re-orient | compress-and-confirm | fresh node start |
| **Revisit a completed node** | node in `completedSegmentIds`/`studied` | "want a quick refresher or move on?" — review framing | none | review (already `studied`) | persists |
| **Course complete** | `progressPercent === 100` | brief celebration + next-course/retake (rare) | none | n/a | persists |
| **Course switch** | different `courseId`, same user | fresh course context, **same learner voice + interests** (threads are per-user) | per new-course journey | per mode | per mode; no cross-course pedagogical bleed |
| **Parent opt-out** | `socialMemoryLevel: 'off'` / `parentalOptOut` | warmth is **prompt-manner only**; no threads in or out | per journey | compress-and-confirm | mastery/gaps persist; **no social threads** persisted |

### Reconciliations captured (so nothing silently breaks)

- **Trial already forces `socialMemoryLevel:'off'`** (Academy `ContextAssemblyService`), which is *compatible* with "demo = session-only warmth" — demo warmth is the brain's manner + what the student says this session, never a thread load (there are none). Do NOT wire demo warmth to a thread-load.
- **`pendingAutoStartPlanIdRef` / two-phase plan expansion** can inject "begin teaching" before the brain has opened. Suppress during the opening turn.
- **`firstTutorTurnOkRef`** already shields turn-0 TTS from barge-in — extend its window to cover opener + the first calibration beat so the student can't derail the opener.
- **Judge-kill / restatement retries** must not increment the completion attempt counter, and resume-from-cut must be inert during the opener (no mid-sentence breaks in the greeting).
- **Session-end extraction** fires in `handleEndSession` before `stage='summary'`, with an idempotency guard (it can also fire on `beforeunload`/unmount) and a timeout fallback (simple recap if the sweep is slow). Skipped entirely for demo (nothing to persist).

---

## Testing & Reporting Protocol

Because most of this feature is *behavioral*, tests come in two layers, mirroring the existing render-audit harness:

- **Layer 1 — Deterministic gates (hard pass/fail, block the task).** Structural facts that must hold: contract parses, the completion guard fires, `socialMemoryLevel` gating in `render.ts`, **zero persistence for demo sessions**, `progressDigest` present, `referencedThreadIds` bump `lastReferencedAt`, the proactive first turn fires, the fail-to-simple fallback renders on a bad draw, the brain never emits a sell-initiating utterance (banned-phrase check). A failing gate blocks the task.

- **Layer 2 — Pedagogy judge (Sonnet, rubric scored 1–5, ADVISORY + always surfaced).** Properties no string-match can verify: human-feel opener, non-repetition across sessions, calibration-without-quizzing, warm-resume-not-quiz for returning students, prerequisite seeding correctness, adapts-on-confusion, tasteful (not greasy) conversion close, no over-doodling. Consistent with the codebase's "judge is advisory, not a killer" stance — scores below threshold (default **< 4/5**) are *flagged for human review*, never auto-fail; full transcripts + board screenshots are always attached.

- **Student-simulator (Haiku).** `simulateStudent(persona, tutorUtterance, history)` role-plays each fixture persona turn-by-turn so calibration is a real exchange — including adversarial personas (a **bluffer** who claims mastery then fumbles the confirm probe, a **beginner** who underclaims, an **anxious short-attention** kid who gives terse replies and bails if bored).

- **Reporting checkpoint — MANDATORY final step of every feature task (B2 onward).** Run `npm run test:pedagogy -- <task-id>`, generate the per-scenario report (scenario, Layer-1 pass/fail, Layer-2 rubric scores, transcript excerpts, board screenshots, anomalies + a roll-up), and **present it to the user. Do not start the next task until acknowledged.** The exact assertions + rubric items + personas for each task live in the **Scenario Matrix** below.

### Fixture Personas (the "test accounts")

Built in Phase H. Cover the matrix demo/subscribed × new/returning × honest/bluffer/beginner × privacy-on/off × intent.

**Demo (logged-out or `isTrial`, no durable persistence):**
- **D1 "Maya"** — Grade 9, Quadratics. Says "know a little, I remember factoring." Intent: just exploring. *(The canonical example.)*
- **D2 "Leo"** — Grade 9, Quadratics. **Bluffer:** "I know all this, just give me hard problems" — actually shaky; fumbles the confirm probe.
- **D3 "Aria"** — Grade 6, Fractions. "I don't really know any of this." Genuine beginner → tests prerequisite seeding from below.
- **D4 "Sam"** — Grade 11, Calculus. Intent: "honestly I'm thinking about signing up" → tests conversion-close lean.
- **D5 "(anonymous)"** — no name entered, Grade 8, Ratios → tests graceful nameless opener.

**Subscribed (seeded User + Enrollment + SocialMemory):**
- **S1 "Priya"** — Grade 10, mid-course: 6 of 9 units done, ~2 months in. Threads: `interest:football`, `event:bio test Friday`, `interest:Spiderman (referencedLast=true)`, `socialMemoryLevel:light`. → warm-resume + progress-arc + **must NOT reopen with Spiderman** (anti-repetition) + football-themed example.
- **S2 "Noah"** — new subscribed, 0 prior sessions, `light`, no threads → first-session-subscribed (has grade/course, light calibration, no "what do you know?" interrogation).
- **S3 "Zoe"** — returning, `socialMemoryLevel:off` + `parentalOptOut:true` → privacy gate: no social opener, no threads rendered to brain, **nothing persisted**.
- **S4 "Kai"** — returning, mastery shows one LO already ≥0.8 + one **confirmed gap** → compress-and-confirm on the known LO (fast + probe), targeted teaching on the gap.
- **S5 "Diego"** — subscribed, just took the placement **diagnostic** (`diagnostic.takenAt` set, low-exposure seeded mastery + a candidate gap) → warmstart-from-seeding, **no re-quiz**; also runs a `target:'diagnostic'` session variant to prove the opener/calibration **no-ops** there.
- **S6 "Ravi"** — subscribed, **resume mid-node**: in-progress checkpoint with a live `currentSegmentId` (fresh, ≤30d) + a stale-checkpoint variant (>window) → "pick up where we left off" vs graceful cold-restart.

**Mode variants** (applied as scenario flags, not new personas): `target:'freestyle'` (no plan — opener fires, gating disabled) on Maya/Priya; `target:'diagnostic'` on Diego; `isTrial` trial-wall run on Sam (stop lands on `first_concept_complete`).

---

## File Map (what changes, by repo)

**portal-contract** (`/Users/luke/Dev/portal-contract`)
- Modify `src/v1/schemas.ts` — add `progressDigest` to `StudentContextSchema`; confirm/extend `SocialMemoryDeltaSchema` for activation; add `sessionMode`/demo signal if not derivable.
- Modify `src/v1/types.ts` — mirror types.
- Modify `README.md` + version bump (minor).

**engine** (`/Users/luke/Dev/evelynlearning`)
- Modify `src/lib/tutor/student-profile/render.ts` — stop omitting `interests`; render social threads + progress digest into the brain block, gated by level.
- Modify `src/lib/tutor/voice/claude-brain.ts` — opener/calibration prompt clause; demo-vs-subscribed branch; plan-as-seed framing; compress-and-confirm clause; self-report two-channel clause.
- Modify `src/app/tutor/.../VoiceTutorRealtime.tsx` — proactive first turn on Start; fail-to-simple opener fallback; wire progress digest + social threads into `buildLessonPlanContext`/turn input; budget-aware stop; capture demo-intent.
- Modify `src/app/tutor/.../page.tsx` — fire the proactive opener off the Start click (the audio-gesture); pass demo-mode + budget.
- Create `src/lib/tutor/portal/extract-social-threads.ts` — session-end Haiku extraction → `socialMemoryDelta`.
- Modify `src/lib/tutor/portal/session-result.ts` — populate `socialMemoryDelta` (currently intentionally omitted).
- Modify `src/app/api/portal/v1/context/route.ts` — accept + surface `progressDigest`.
- Modify system-prompt builder (`buildSystemPrompt`) — demo directives: budget-aware satisfying stop, show-range-not-perform, soft conversion close.

**academy** (`/Users/luke/Dev/academy`)
- Modify `apps/api/src/services/ContextAssemblyService.ts` — assemble + send `progressDigest`; keep sending social threads with `lastReferencedAt`.
- Modify `apps/api/src/models/SocialMemory.ts` — ensure `lastReferencedAt` bump path on ingest of `socialMemoryDelta`.
- Modify the session-result ingest handler — persist `socialMemoryDelta` threads (dedupe, retention, `parentalOptOut`).
- Modify enrollment UI — parent/student `socialMemoryLevel` toggle (default `'light'`).
- Modify `apps/web/components` enrol CTA card surfaced at demo-close.

**harness** (`/Users/luke/Dev/evelynlearning/scripts/tutor/pedagogy-harness/`)
- Create `fixtures/personas/*.json` — the 9 personas (StudentContext + StudentProfile + threads + progressDigest).
- Create `seed-personas.ts` — seed academy DB (User+Enrollment+SocialMemory) for S1–S4.
- Create `student-simulator.ts` — Haiku persona role-player.
- Create `run-harness.ts` — drives real brain turns via the simulator → artifact bundle per scenario.
- Create `assertions.ts` — Layer-1 deterministic gates.
- Create `judge.ts` — Layer-2 Sonnet rubric + report generator.
- Modify `package.json` — add `test:pedagogy` script.

---

## Phase A — Contract & plumbing (unblocks everything)

### Task A1: Add `progressDigest` to inbound StudentContext (portal-contract)

**Files:**
- Modify: `src/v1/schemas.ts` (near `StudentContextSchema`, ~lines 332-343)
- Modify: `src/v1/types.ts`
- Test: `src/v1/__tests__/schemas.test.ts` (or the repo's existing schema test file)

**Interfaces:**
- Produces: `ProgressDigestSchema` = `{ unitsCompleted: number, unitsTotal: number, percentComplete: number, weeksElapsed?: number, paceNote?: string }`, added as optional `progressDigest?` on `StudentContextSchema`.

- [ ] **Step 1: Write the failing test** — a `StudentContext` object with a valid `progressDigest` parses, and one with `progressDigest` omitted still parses (additive/optional).
- [ ] **Step 2: Run it, verify it fails** (`progressDigest` unknown key or missing schema).
- [ ] **Step 3: Add `ProgressDigestSchema` and attach as `.optional()`** on `StudentContextSchema`; mirror in `types.ts`.
- [ ] **Step 4: Run tests, verify pass.**
- [ ] **Step 5: Commit** — `feat(contract): add optional progressDigest to StudentContext`.

### Task A2: Document `socialMemoryDelta` activation (portal-contract)

> **Correction from investigation:** the schema ALREADY exists and is `SocialMemoryDeltaSchema = { new: SocialThread[], referenced: string[] }` (schemas.ts ~425-430), attached optional on `SessionResult` (~447). `new` = threads picked up this session; `referenced` = ids of stored threads the tutor used (the anti-repetition bump signal). **No schema change is needed** — activation is engine-side (Task D3) + Academy-side (Task D4). This task only removes the "Phase-2 frozen / emits absent" note and documents the activation, so downstream implementers use the real field names.

**Files:**
- Modify: `README.md` (remove "behavior ships in Phase 2 / emits absent" note; document that the engine now populates it)
- Test: confirm existing schema test still asserts `{ new, referenced }` parses.

- [ ] **Step 1: Confirm** the existing `SocialMemoryDeltaSchema` shape and that a `SessionResult` with a populated `{ new, referenced }` already parses (add the assertion if missing).
- [ ] **Step 2: Update README** to mark the field active and document `new`/`referenced` semantics.
- [ ] **Step 3: Commit** — `docs(contract): document socialMemoryDelta activation (new/referenced)`.

### Task A3: Version bump + changelog (portal-contract)

- [ ] Bump minor version in `package.json`; update `README.md` version table; note additive-only.
- [ ] Re-sync the built package into both consumers' `node_modules/@evelyn/portal-contract` per the existing sibling-repo sync process (see memory `project_portal_contract_v1_2`).
- [ ] Commit — `chore(contract): vX.(Y+1).0 — progressDigest + socialMemoryDelta`.

---

## Phase H — Pedagogy testing harness (built before feature phases use it)

> Depends on Phase A types. Everything downstream (B–E) reports through this. Build it once, extend scenarios per task.

### Task H1: Fixture personas (all 9)

**Files:**
- Create: `scripts/tutor/pedagogy-harness/fixtures/personas/{maya,leo,aria,sam,anon,priya,noah,zoe,kai}.json`
- Create: `scripts/tutor/pedagogy-harness/fixtures/personas/index.ts` (typed loader)
- Test: `fixtures/personas/personas.test.ts`

**Interfaces:**
- Produces: `loadPersona(id): Persona` where `Persona = { id, mode:'demo'|'subscribed', studentContext?: StudentContext, profile?: StudentProfile, simProfile: { grade, topic, claim, actualLevel, intent, style } }`. `simProfile` drives the student-simulator; `studentContext`/`profile` are the durable state seeded for subscribed personas.

- [ ] **Step 1: Write failing test** — every persona loads and validates: subscribed personas have a `studentContext` that parses against the contract's `StudentContextSchema`; demo personas have none; S1 has a `Spiderman` thread with `referencedLast:true`; S3 has `socialMemoryLevel:'off'` + `parentalOptOut:true`.
- [ ] **Step 2: Run, verify fail** (files absent).
- [ ] **Step 3: Author the 9 JSON fixtures** with realistic social/personal/pedagogical detail per the roster above, plus the typed loader.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(tutor): pedagogy harness fixture personas`.

### Task H2: Academy seed script for subscribed personas

**Files:**
- Create: `scripts/tutor/pedagogy-harness/seed-personas.ts`
- Test: `seed-personas.test.ts` (against a test DB)

**Interfaces:**
- Produces: `seedPersonas(): Promise<void>` — upserts User + Enrollment + SocialMemory for S1–S4 into the academy test DB; idempotent; `teardownPersonas()` removes them.

- [ ] **Step 1: Write failing test** — after `seedPersonas()`, Priya's User exists with `engineStudentId`, an Enrollment showing 6/9 units, and 3 SocialMemory threads; Zoe has `parentalOptOut:true`.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the seed + teardown (idempotent upserts).
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(academy): seed subscribed harness personas`.

### Task H3: Haiku student-simulator

**Files:**
- Create: `scripts/tutor/pedagogy-harness/student-simulator.ts`
- Test: `student-simulator.test.ts`

**Interfaces:**
- Produces: `simulateStudent(persona, tutorUtterance, history): Promise<{ text: string; ended: boolean }>` — Haiku (`claude-haiku-4-5-20251001`) role-plays `persona.simProfile`. Behaviors encoded in the sim prompt: the **bluffer** (Leo) claims mastery but answers a genuinely hard probe wrong; the **beginner** (Aria) consistently underclaims; the **anxious** persona gives ≤8-word replies and sets `ended:true` if the tutor opens boringly or lectures too long.

- [ ] **Step 1: Write failing test** — `simulateStudent(leo, "Quick check: factor x²−5x+6", [])` returns a *wrong* factoring (persona lies about knowing it); `simulateStudent(aria, "do you know what a fraction is?", [])` underclaims.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the Haiku role-player with per-persona behavior in the system prompt. Keep it deterministic-ish via low temperature; the test asserts *category* of response (wrong vs right), not exact text.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(tutor): Haiku student-simulator`.

### Task H4: Harness driver → artifact bundle

**Files:**
- Create: `scripts/tutor/pedagogy-harness/run-harness.ts`
- Read first: existing `test:tutor-e2e` harness + render-audit `processToolCall` seam to reuse the brain-session + render-capture path.
- Test: `run-harness.test.ts` (smoke: one persona, ≤3 turns, asserts a bundle is produced)

**Interfaces:**
- Produces: `runScenario(persona, { maxTurns, taskId }): Promise<Bundle>` where `Bundle = { persona, turns: { tutorText, toolCalls, boardState, studentReply }[], sessionResult, meta }`. Runs the REAL brain (opening turn included) against the student-simulator for up to `maxTurns`, capturing tool calls + board render states + the emitted `SessionResult`.

- [ ] **Step 1: Write failing smoke test** — `runScenario(maya, {maxTurns:3})` returns a bundle whose turn 1 has a proactive tutor utterance (no student input first) and at least one board tool call.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the driver on top of the existing e2e/render-audit seams.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(tutor): pedagogy harness driver + bundle capture`.

### Task H5: Deterministic assertions + Sonnet judge + report generator

**Files:**
- Create: `scripts/tutor/pedagogy-harness/assertions.ts`
- Create: `scripts/tutor/pedagogy-harness/judge.ts`
- Create: `scripts/tutor/pedagogy-harness/report.ts`
- Test: `judge.test.ts`, `assertions.test.ts`

**Interfaces:**
- Consumes: `Bundle` from H4.
- Produces: `runGates(bundle, taskId): GateResult[]` (Layer-1, pass/fail); `judgeBundle(bundle, rubric): Promise<JudgeResult>` (Sonnet, 1–5 per rubric item + rationale); `renderReport(scenarioResults): string` (markdown + embedded screenshot refs + roll-up).

- [ ] **Step 1: Write failing test** — `runGates` on a bundle where a demo session persisted a thread returns a FAIL for the "zero-persistence-demo" gate; `judgeBundle` returns a structured 1–5 score per rubric item.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the gate runner (per-`taskId` gate set from the Scenario Matrix), the Sonnet rubric judge (advisory), and the report renderer.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(tutor): pedagogy gates + judge + report`.

### Task H6: `test:pedagogy` runner script

**Files:** Modify `package.json`; Create `scripts/tutor/pedagogy-harness/cli.ts`; Test: invoking `test:pedagogy -- H` runs a no-op-safe smoke.

- [ ] **Step 1: Write failing test** — `npm run test:pedagogy -- --list` prints the task→scenario map.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the CLI: `test:pedagogy -- <taskId|all>` seeds (if subscribed personas involved) → runs scenarios → gates + judge → writes `artifacts/pedagogy/<taskId>/report.md` → prints the roll-up path.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `test(tutor): test:pedagogy CLI runner`.

---

## Phase B — The human opener + conversational calibration (demo value ships here)

> Ships standalone value for demo/logged-out students with zero dependency on Academy write-back.

### Task B1: Read + document the current first-turn flow (investigation, no code)

**Files:** `VoiceTutorRealtime.tsx` (~lines 6065-6640 `callBrainOnce`, ~6215-6221 synthetic greeting, ~11259-11296 systemPrompt, ~5886 first-segment set), `page.tsx` (~877-983 `handleStartSession`).

- [ ] Read those regions and write a 10-line note in the task branch describing: where the mic-tap gate lives, how the synthetic "Hey Praveen!" greeting is injected, and where segment 1 is auto-set to the hook. This grounds B2–B4. **No behavior change; no commit needed beyond the note.**

### Task B2: Proactive first turn on Start (engine)

**Files:**
- Modify: `page.tsx` `handleStartSession` (~877-983)
- Modify: `VoiceTutorRealtime.tsx` first-turn path (~6065+)
- Test: component/integration test that a session-start dispatches a brain turn with no student utterance and `openingPhase: true`.

**Interfaces:**
- Produces: brain turn input gains `openingPhase: boolean` and `sessionMode: 'demo' | 'subscribed'`.

- [ ] **Step 1: Write failing test** — clicking Start (or calling `handleStartSession`) triggers exactly one brain call with `openingPhase: true` and no prior student message, and (voice mode) requests TTS without waiting for a mic tap. Assert the Start click is the audio-play gesture.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — on Start, dispatch the opening brain turn; remove the mic-tap precondition *for the first turn only*; replace the synthetic-greeting injection with the real opening turn (the brain now greets for real). Stop auto-forcing segment 1 = hook; leave `currentSegmentId` unset until the brain advances.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): proactive opening turn on session start`.

### Task B3: Fail-to-simple opener render fallback (engine)

**Files:**
- Modify: `VoiceTutorRealtime.tsx` opener render path
- Test: given an opener tool call that fails validation, assert a minimal fallback visual is rendered and the spoken opener still plays; the board is never blank after the first turn.

- [ ] **Step 1: Write failing test** — simulate a first-turn `show_*` that fails the structural validator; assert (a) a minimal fallback card renders, (b) TTS of the opener still fires.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — wrap the first-turn render in a try/validate; on failure render a clean minimal visual (topic title card done *tastefully*, not the "boring bold title" — e.g. a single clean prompt object) and continue speech.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): fail-to-simple fallback for opening render`.

### Task B4: Opener + calibration prompt clause (engine, brain prompt)

**Files:**
- Modify: `claude-brain.ts` (system-prompt / turn-context construction) + `buildSystemPrompt`
- Test: prompt-snapshot test asserting the opening clause is present in demo mode and the warm-resume clause in subscribed-returning mode.

- [ ] **Step 1: Write failing test** — `buildSystemPrompt({ sessionMode:'demo', openingPhase:true, ... })` contains the calibration directive; `buildSystemPrompt({ sessionMode:'subscribed', hasPriorSessions:true })` contains the warm-resume directive and NOT the "ask what you already know" directive.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement the clause.** Demo/first-ever: "Open by acting first — put one intriguing, level-appropriate thing about the topic on the board, greet them by name, then get to know them briefly like a real teacher would: roughly where they're at with this topic, their grade if unclear, and what they're hoping to get from this session (just exploring, thinking about joining, curious how an AI teaches). Don't quiz them or use fixed categories — have a short human exchange, then teach informed by it. Never open with 'Today we are going to learn…' or a bold title card." Subscribed-returning: "Open warm and personal from what you know about them — vary it every time (a social thread you haven't used recently, a note from last session, or their overall progress arc). Never repeat an opener or the same *kind* of opener twice in a row. Do NOT ask a returning student what they already know — you have their history; use it."
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): opener + calibration prompt clause`.

### Task B5: Self-report two-channel clause (engine, brain prompt)

**Files:** `claude-brain.ts` prompt; Test: prompt-snapshot.

- [ ] **Step 1: Write failing test** — prompt contains the two-channel rule.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — clause: "When a student tells you about themselves, route it: things about *them* (hobbies, an upcoming test, what they enjoy) are for rapport and themed examples; claims about *what they already know* are hints to act on, NOT proof of mastery — confirm them by what they actually demonstrate before treating anything as learned."
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): self-report two-channel routing clause`.

### Task B6: Session-mode & journey gating (the branch that wraps B2–B5)

**Files:**
- Read first: how `target.kind` / resume state / `isTrial` / `studentId` reach the client (page.tsx embed params + `resumeState` prop + VoiceTutorRealtime mount).
- Modify: `VoiceTutorRealtime.tsx` + `page.tsx` — compute a `sessionMode` + `journey` descriptor at session start and gate the opener.
- Modify: `claude-brain.ts` — select the opener/resume/none framing from the descriptor.
- Test: `session-mode-gating.test.ts`.

**Interfaces:**
- Produces: `resolveOpeningBehavior(input): { mode:'lessonNode'|'freestyle'|'diagnostic', journey: Journey, opener:'proactive'|'warm-resume'|'pickup'|'none', calibration:'full'|'light'|'none' }` per the Journey Matrix. Consumed by B2 (whether/what to fire) and B4 (which prompt clause).

- [ ] **Step 1: Write failing tests** — one per matrix row that matters: `diagnostic` → `opener:'none'` (no proactive turn, no calibration clause); `freestyle` → opener fires + completion-gating disabled; resume-with-live-`currentSegmentId` → `opener:'pickup'`; `completedSegmentIds.length>0` → `opener:'warm-resume'`, `calibration:'none'`; `isTrial` → demo behaviors + placeholder-name-safe; logged-out (no studentId) → demo + ephemeral.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** `resolveOpeningBehavior` + wire it so: the proactive turn (B2) only fires when `opener !== 'none'`; the `[Begin teaching immediately]` auto-start injection is suppressed until the brain transitions; diagnostic mode bypasses opener/calibration/gating entirely; placeholder `"Trial student"`/`"unknown"` grade never leak into the spoken opener.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): session-mode & journey gating for the opener`.

---

## Phase C — Plan-as-seed + compress-and-confirm completion (subscribed fidelity)

### Task C1: Plan-as-seed framing in the plan-context block (engine)

**Files:**
- Modify: `claude-brain.ts` `formatLessonPlanContext` (~356-448), specifically the instruction block (~441-447) and PROBLEM-LOCK note (~418-430).
- Test: prompt-snapshot — demo mode shows "seed, no coverage obligation"; subscribed shows "path-free, cover the LOs."

- [ ] **Step 1: Write failing test** — assert the two framings render by mode; assert PROBLEM-LOCK text still present (unchanged) for authored problems.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.** Subscribed clause: "This plan is a seed, not a script. You may reorder, compress what they already show they know, detour through a prerequisite, swap in an example themed to their interests, or explain a different way — freely. But the plan's learning objectives are your coverage contract: by the end, each core LO must be genuinely taught or demonstrated, because that is how progress is recorded. Freedom over the *path*; faithfulness to the *destination*." Demo clause: "This plan is raw material only — no obligation to cover it. Spend the time on whatever teaches this student best and shows what great teaching feels like." Keep PROBLEM-LOCK: "When you *do* use an authored problem, render its text verbatim." Add prerequisite-seeding hint: "To meet a student below the topic, step down to the nearest prerequisite (use the plan's `prerequisites` and the taxonomy as hints) and build up — e.g. multiply two linear factors before naming it a quadratic."
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): plan-as-seed framing by session mode`.

### Task C2: Compress-and-confirm completion gate (engine orchestrator)

**Files:**
- Read first: the segment-advance + milestone/`lessonProgress` emit path in `VoiceTutorRealtime.tsx` and `session-result.ts` (how `milestone`/`completedSegmentIds` are set today).
- Modify: the completion-marking path so an LO/segment is only recorded complete when there is a demonstrated correct attempt this session (reuse existing try-yourself grading / mastery-emit signals).
- Modify: `claude-brain.ts` prompt — the confirm directive.
- Test: (a) orchestrator unit test — advancing past a segment without any demonstrated success does NOT add it to `completedSegmentIds`/does NOT fire its milestone; with a graded-correct attempt it does. (b) prompt-snapshot for the confirm directive.

**Interfaces:**
- Consumes: existing per-segment correctness signal (the streak/grading refs surfaced in `<student_state>`). The confirm-probe can **reuse the existing `/practice` (retrieve an item for the LO) + `/grade` (rubric grading) endpoints** rather than build new grading.
- Produces: completion write is guarded by `hasDemonstratedThisSession(loId)`; a per-segment attempt counter that **increments only on a genuine graded-correct student answer** — never on validator-kill or judge-restatement retries. In `freestyle` mode (empty `currentSegmentId`) the gate is a **no-op** (nothing to gate).

- [ ] **Step 1: Write failing test** — simulate advancing through a `concept` + `try-yourself` where the try-yourself was skipped/never answered correctly; assert the LO is not marked complete and no `first_try_yourself_success`/`recap_reached` milestone that implies mastery fires purely from advancement.
- [ ] **Step 2: Run, verify fail** (today advancement alone marks progress).
- [ ] **Step 3: Implement** the guard: completion/milestone writes require a demonstrated-correct signal for the LO; otherwise the segment is "visited, not mastered." Prompt directive: "Never skip a to-be-learned objective on a student's say-so. If they claim they already know it, confirm fast — one quick problem — then move on. Going fast is fine; marking something learned without seeing it is not."
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): gate completion behind live demonstration (compress-and-confirm)`.

---

## Phase D — Context write-back loop + personalization activation (returning-student magic)

### Task D1: Activate interests + social + progress in the brain block (engine)

**Files:**
- Modify: `src/lib/tutor/student-profile/render.ts` (~20-111; currently omits `interests` at ~line 35)
- Modify: `render.ts` to also render social threads (gated by `socialMemoryLevel`) and the `progressDigest`.
- Test: `render.ts` unit test — interests appear when level allows; omitted when `socialMemoryLevel==='off'`/`parentalOptOut`; progress digest renders when present.

- [ ] **Step 1: Write failing test** — assert interests + eligible social threads + progress digest appear in the `<student_profile>` block under `'light'`/`'warm'`, and are absent under `'off'`.
- [ ] **Step 2: Run, verify fail** (interests currently omitted).
- [ ] **Step 3: Implement** — include interests; include social threads with their `kind` and `lastReferencedAt` (so the brain can avoid recently-used ones); include the progress-arc line. Respect the `socialMemoryLevel` ceiling and `parentalOptOut`.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): render interests, social threads, progress digest to brain`.

### Task D2: Session-end social-thread extraction (engine)

**Files:**
- Create: `src/lib/tutor/portal/extract-social-threads.ts`
- Test: `extract-social-threads.test.ts` with a fixture transcript.

**Interfaces:**
- Produces: `extractSocialThreads(transcript, existingThreads): Promise<{ suggestedThreads: SocialThread[]; referencedThreadIds: string[] }>` — one Haiku pass; returns candidate `{kind,note}` threads and the ids of existing threads the tutor actually referenced this session (for `lastReferencedAt` bump). Dedupe against `existingThreads`.

- [ ] **Step 1: Write failing test** — given a transcript where the student mentions playing football and having a bio test Friday, `extractSocialThreads` returns an `interest` thread and an `event` thread; given the tutor opened with an existing "Spiderman" thread, that thread's id appears in `referencedThreadIds`; already-known threads are not re-suggested.
- [ ] **Step 2: Run, verify fail** (function absent).
- [ ] **Step 3: Implement** — Haiku call with a tight extraction prompt (model `claude-haiku-4-5-20251001`), structured JSON out, dedupe. **Demo mode: skip entirely — nothing is persisted.**
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): session-end social-thread extraction (Haiku)`.

### Task D3: Populate `socialMemoryDelta` in the session result (engine)

**Files:**
- Modify: `src/lib/tutor/portal/session-result.ts` (currently intentionally omits `socialMemoryDelta`)
- Test: session-result builder test.

- [ ] **Step 1: Write failing test** — for a subscribed session, the emitted `SessionResult.socialMemoryDelta` carries the extractor's `suggestedThreads` + `referencedThreadIds`; for a demo session it's absent.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — call `extractSocialThreads` (subscribed only), attach to the result.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): emit socialMemoryDelta on session result`.

### Task D4: Academy stores threads + bumps recency (academy)

**Files:**
- Modify: session-result ingest handler (academy API)
- Modify: `apps/api/src/models/SocialMemory.ts`
- Test: ingest test — new threads persisted (respecting retention + `parentalOptOut`); `referencedThreadIds` bump `lastReferencedAt`; no duplicates.

- [ ] **Step 1: Write failing test** — POSTing a `SessionResult` with `socialMemoryDelta` creates the new threads and updates `lastReferencedAt` on referenced ones; with `parentalOptOut` set, nothing persists.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the upsert + recency bump + opt-out guard.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(academy): persist socialMemoryDelta + bump recency`.

### Task D5: Academy assembles progressDigest + sends threads (academy)

**Files:**
- Modify: `apps/api/src/services/ContextAssemblyService.ts` (~42-127)
- Test: assembly test — `progressDigest` computed from `Enrollment`; social threads sent with `lastReferencedAt` when `socialMemoryLevel!=='off'`.

- [ ] **Step 1: Write failing test** — `assembleForNode` returns a `StudentContext` with a `progressDigest` derived from the enrollment (units done/total/%, weeks elapsed) and, when eligible, social threads.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(academy): assemble progressDigest into StudentContext`.

### Task D6: `socialMemoryLevel` toggle in enrollment UI, default `'light'` (academy)

**Files:** enrollment/settings UI (`apps/web/components`), `User.preferences.socialMemoryLevel`; Test: default is `'light'` for new subscribed users; toggle persists.

- [ ] **Step 1: Write failing test** — a new subscribed user has `socialMemoryLevel==='light'`; toggling to `'off'` persists and stops thread assembly.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the default + a visible parent/student control.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(academy): social-memory toggle, default light`.

---

## Phase E — Demo experience polish (conversion)

### Task E1: Budget-aware satisfying stop (engine)

> **Two stop mechanics** (from investigation): an **academy trial** is *milestone-boxed* — the wall fires on `first_concept_complete`, so the "satisfying win" must be engineered to land ON that milestone (win == wall == conversion). A **logged-out showcase** is *time/engagement-boxed* (no wall). The directive must cover both; the descriptor from B6 says which applies.

**Files:** `VoiceTutorRealtime.tsx` (pass demo budget + stop-mode), `claude-brain.ts`/`buildSystemPrompt` (directive); Test: prompt-snapshot + a turn-input test that the stop descriptor is threaded.

- [ ] **Step 1: Write failing test** — trial turn input carries `stopMode:'milestone'` (aim the first satisfying win at `first_concept_complete`); showcase carries `stopMode:'time'` + `demoBudgetMinutes`/`minutesElapsed`; prompt contains the "land a real win at/before the stop, never end mid-example" directive for both.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — thread the budget; directive: "You have about {N} minutes. Pace so the student reaches one genuine 'I get it now' moment and a clean stopping point before time runs out — never end mid-concept. Show what great teaching feels like through the *right* visual and by adapting when they're confused, not by drawing extra pictures."
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): budget-aware satisfying stop for demo`.

### Task E2: Soft conversion close + UI CTA card (engine + academy web)

**Files:** `claude-brain.ts` prompt (close directive), demo UI CTA card (`apps/web/components` / showcase page); Test: prompt-snapshot; UI test that the CTA card renders at demo end.

- [ ] **Step 1: Write failing test** — prompt close directive present ("close warm and in-character, never sell; if they explicitly ask how to continue, tell them plainly, then hand off"); demo-end renders the enrol CTA card.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** the directive + the CTA card surfaced on demo session end. Brain never initiates the sell; UI owns the CTA.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): soft conversion close + enrol CTA card`.

### Task E3: Capture demo-intent to analytics (engine)

**Files:** `VoiceTutorRealtime.tsx` (+ `useDemoTracker`); Test: when the brain surfaces the student's stated intent, it's recorded to demo analytics, not to any student record.

- [ ] **Step 1: Write failing test** — a demo session where the student says "thinking about enrolling" records an intent signal via the demo tracker; nothing is written to a durable student profile.
- [ ] **Step 2: Run, verify fail.**
- [ ] **Step 3: Implement** — lightweight intent capture (from a brain-emitted signal or the extraction pass, demo-scoped) → `useDemoTracker`; also used to tune E2's close lean.
- [ ] **Step 4: Run, verify pass.**
- [ ] **Step 5: Commit** — `feat(tutor): capture demo intent to analytics`.

---

## Scenario Matrix

Each feature task's mandatory reporting step runs `npm run test:pedagogy -- <task-id>` against these. **L1** = deterministic gates (block). **L2** = Sonnet rubric (advisory, flagged < 4/5). Report presented to user before the next task.

| Task | Personas | L1 gates (block) | L2 rubric (advisory) |
|---|---|---|---|
| **B2** proactive turn | D1, D5, S1 | Turn 1 fires with no student input; TTS requested without mic-tap; segment 1 NOT auto-forced to hook | Opener acts first & feels intentional, not templated |
| **B3** fail-to-simple | D1 (fault-injected render) | On forced render-fail: fallback visual present AND opener TTS still plays; board never blank | Fallback reads as clean/tasteful, not a boring title card |
| **B4** opener+calibration prompt | D1, D2, D3, D4, D5, S1, S2, S3 | Demo prompt carries calibration clause; subscribed-returning carries warm-resume clause & NOT "what do you know?"; S3 renders no social thread | Human-feel opener; calibrates without quizzing; S1 warm-resume varies & does **not** reuse Spiderman; grade/intent surfaced naturally |
| **B5** self-report two-channel | D2 (bluffer), D1 | A knowledge-claim does not write mastery; an "about them" mention is available for later theming | Correctly treats "I know it" as a hint to verify, not a fact |
| **B6** session-mode & journey gating | S5 (diagnostic), S6 (resume ×2), Maya/Priya (freestyle), Sam (trial-wall) | `diagnostic`→no proactive turn & no calibration clause; `freestyle`→opener fires & completion-gating disabled; live-checkpoint→`opener:'pickup'`; `completedSegmentIds>0`→warm-resume & no calibration; placeholder name/grade never spoken; auto-start injection suppressed until brain transitions | pickup reads as continuity not a cold restart; stale-resume re-orients lightly (not full calibration); diagnostic keeps its own low-pressure framing |
| **C1** plan-as-seed framing | D3, S1, S4 | Demo shows "seed/no coverage"; subscribed shows "cover the LOs"; PROBLEM-LOCK text intact | D3: seeds from linear factors below quadratics (prereq correct); S1: re-themes an example to football tastefully |
| **C2** compress-and-confirm | D2 (bluffer), S4 | Advancing without a demonstrated-correct signal does NOT mark the LO complete / does NOT fire mastery milestone; a graded-correct attempt DOES | Bluffer (Leo) is caught by the probe & re-taught without shaming; S4 known LO is confirmed fast, gap is targeted |
| **D1** render interests/social/progress | S1, S3, S4 | Interests + eligible threads + progressDigest present under `light`/`warm`; ALL absent under S3 (`off`/opt-out) | Uses a thread the brain hasn't used recently; progress-arc opener lands ("6 units in, great progress") |
| **D2** extraction sweep | S1, D1 | Extracts football/bio-test threads from a seeded transcript; dedupes existing; **demo (D1) extraction skipped entirely** | Extracted notes are accurate & non-creepy |
| **D3** emit socialMemoryDelta | S1, D1 | Subscribed result carries suggestedThreads + referencedThreadIds; demo result omits socialMemoryDelta | — |
| **D4** academy stores + recency | S1, S3 | New threads persisted; referencedThreadIds bump `lastReferencedAt`; S3 opt-out persists nothing; no dupes | — |
| **D5** assemble progressDigest | S1, S2 | `assembleForNode` returns progressDigest from Enrollment (6/9, weeks); threads sent when eligible | — |
| **D6** social toggle default | S2 | New subscribed user defaults `light`; toggling `off` stops assembly | Toggle copy is clear/parent-legible |
| **E1** budget-aware stop | D1, D4 | `demoBudgetMinutes`+`minutesElapsed` threaded; prompt carries the stop directive | Lands a real "I get it" beat before the wall; no over-doodling; ends clean, not mid-example |
| **E2** conversion close + CTA | D4 (high intent), D1 (low intent) | Brain emits NO sell-initiating phrase (banned-phrase gate); CTA card renders at demo end | Close is warm/in-character; leans in only for D4; never greasy |
| **E3** demo-intent capture | D4 | Intent recorded to demo analytics; NOTHING written to a durable student record | — |

**Cross-cutting regression (run on `all` before merge):** a two-session replay of **S1** to prove anti-repetition (session 2's opener differs in content AND kind from session 1) — this is the single most important behavioral guarantee and can't be tested in one session.

## Explicitly deferred (post-v1)

- **Pure-skip / near-zero-teach completion** (prior-mastery-evidence + one probe → mark done with minimal teaching). Requires more trust in the framework; revisit after compress-and-confirm proves out.
- **Unit-level diagnostic fast-forward** (a short diagnostic that skips several early nodes at once). The contract already has `target: 'diagnostic'` and a reusable `DiagnosticQuiz` — natural follow-on.
- **Structured mid-session `remember_this` tool** (inline thread capture). Session-end extraction is the v1 mechanism; revisit only if extraction misses too much.

## Self-Review notes

- **Spec coverage:** opener (B2/B3/B4), calibration (B4/B5), plan-as-seed (C1), compress-and-confirm (C2), demo-vs-subscribed (B4/C1 branching + demo detection in Global Constraints), context write-back to Academy (D2/D3/D4), anti-repetition (D1 recency render + D2 `referencedThreadIds` + D4 bump), progress-arc opener (A1/D5/D1), interests consumption (D1), demo impress/budget/conversion (E1/E2/E3), privacy split + toggle (D6 + Global Constraints). All user asks map to a task.
- **Deferred items** are called out so no reviewer expects them in v1.
- **Investigation-first tasks** (B1, and the read-steps in C2/H4) are deliberate: they touch orchestrator internals whose exact local signatures must be confirmed before writing the guard/flow, rather than inventing them here.
- **Testing coverage:** Phase H builds the harness (9 personas, Haiku simulator, driver, gates, judge, CLI) before any feature task consumes it. Every feature task B2→E3 has a Scenario Matrix row (personas + L1 gates + L2 rubric) and a mandatory report-to-user checkpoint. The two-session anti-repetition replay is called out as the top cross-cutting guarantee. Dependency: Phase order is **A → H → B → C → D → E** (H needs A's types; D4/D5/D6 need academy seed from H2).
- **Cost/nondeterminism honesty:** the harness runs real Sonnet brain turns + a Haiku simulator + a Sonnet judge, so runs cost tokens and vary. L1 gates are the hard contract; L2 is advisory with transcripts always attached for human eyes — matching the codebase's "judge is advisory, not a killer" stance.
- **Session-mode / journey coverage:** the Session-Mode & Journey Matrix enumerates 3 modes × ~11 journeys; Task B6 implements the gate and its Scenario Matrix row exercises the non-teaching modes (diagnostic no-op, freestyle gating-off, resume pickup, trial-wall). Explicitly out of scope for v1 depth but *acknowledged in the matrix*: course-complete celebration and revisit-completed-node framing (light prompt-only handling, no dedicated tasks).
