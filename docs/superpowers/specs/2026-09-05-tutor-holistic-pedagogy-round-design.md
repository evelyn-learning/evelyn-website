# Tutor holistic-pedagogy round — design spec

**Date:** 2026-09-05 · **Status:** approved in brainstorm, awaiting written review · **Owner:** Praveen
**Repos:** engine (`evelynlearning`, worktree `tutor-rounds`) · portal-contract (→ additive v1.15.0) · academy
**Grounding:** `docs/superpowers/reports/2026-09-05-pedagogy-round-investigation.md` (every claim below about
current behaviour was read from code or prod data on 2026-09-05; file anchors are valid at `b1dace0c`).
**Brief:** memory `project_tutor_inferred_gaps_and_consented_recap` (three threads) plus Praveen's mid-brainstorm
ask: *"a holistic tutoring experience that feels like the tutor knows, and continues to know, the student well
enough to guide them towards success."*

## 0. Goal and shape

Four sections, one spec, two implementation plans:

| § | What | Repos | Plan |
|---|---|---|---|
| A | Struggle ledger: infer gaps from behaviour, detect recurrence, re-fire | engine | 1 |
| B | Consent-gated recap at three triggers | engine | 1 |
| C | Homework loop + widened "knows the student" boot context | engine + contract + academy | 1 (engine side) → 2 (contract + academy) |
| D | False-praise-opener guard | engine | 1 |

**Plan 1 is engine-only and ships first.** Plan 2 is the cross-repo homework surface. Section C is written so
that the engine half is inert for the student until the academy declares it renders the card (see C.6).

### 0.1 Locked decisions (Praveen, 2026-09-05 — implementers do not revisit)

1. **Homework is engine-owned.** The engine keeps the assignment record and checks status next session from its
   own evidence rows; it also emits the assignment to the academy. Nothing new about homework rides inbound.
2. **On decline:** drop for the session, record the decline as a signal, one soft re-offer next session, then
   silent-weave only.
3. **Offer eligibility:** recurred this session, or confirmed / review-due across sessions. A single candidate
   never interrupts.
4. **Recap form:** in-session free detour via `advance_lesson({to:'free'})` → bounded recall-first recap →
   `advance_lesson({to:'next'})`. Evidence only, never course progress. Same mechanism for all three triggers.
5. **Assignment authorship:** brain tool at close + deterministic fallback at final commit.
6. **Locator:** the academy passes a transient display locator on the embed config; absent ⇒ generic wording.
7. **`TUTOR_LEARNER_CONTEXT` goes ON in the prod env** (existing `=== 'on'` flag, server-runtime read).
8. **Guard tier:** kill on a verified, single-valued, full-parse disagree; advisory otherwise.
9. **Additions folded in:** next-time continuity; trajectory + practice/quiz/mock digest; cadence + honest
   progress answers; goals via the social-thread extractor.
10. **Carried rules:** new tutor flags default ON (`!== 'off'`); prompt rules stay generic
    ([[feedback_generic_prompts]]); contract stays additive v1; every regex in a kill path is replayed
    against the live sentences before its test is written; worktree-only; Praveen gates every deploy.

### 0.2 Non-goals (recorded, not built this round)

Prerequisite detours with a plan stack (09-03 audit); parent/guardian digest; cross-LO misconception
signatures (needs the dormant concept normalizer); "what worked" per-student move memory; persistent affect
labels (affect stays session-scoped per the Cartesia Phase 4 design); any change to brain/model config; any
change to barge-in or turn-taking.

## 1. Architecture

```
 IN SESSION (client orchestrator, VoiceTutorRealtime.tsx)
   student turn ─▶ struggle ledger (A) ─▶ detection ─▶ inferred gap push ─┐
                                        └▶ recurrence ─▶ <recap_offer> (B) ─▶ reply classifier
                                                              accept ─▶ <recap_go> ─▶ free detour ─▶ return
   brain close ─▶ close_session_notes tool (C) ─▶ /api/tutor/practice-assign ─▶ PracticeAssignment (engine)
   final commit ─▶ student-profile POST: gaps (+recurrences, +recap), nextSessionIntent, auto-assign fallback

 NEXT SESSION BOOT (server, /api/tutor/student-profile/[id]?lessonPlanId=)
   <student_profile> (existing) + <learner_context> (widened, C.4) incl. homework status (evidence self-join),
   recap candidate (B trigger 3), trajectory / digest / cadence / next-time intent
   client prepends opener clauses: homework check → next-time intent → recap offer

 ACADEMY (Plan 2)
   embed token += practice_locator, goal_note      SessionResult += assignedPractice, nextSessionIntent
   Practice tab "From your tutor" card ◀── POST /api/portal/v1/assigned-practice (authoritative read)
   attempts ─▶ /artifacts/practice/attempt ─▶ engine evidence (unchanged) ─▶ homework status next boot
```

## 2. Section A — Struggle ledger, inferred gaps, recurrence

### A.1 Problem
Prod: 150 of 150 candidate LO gaps are single observations that never updated. The prompt forbids in-session
re-fire (`system-prompt-builder.ts:814`); the orchestrator only stamps signals at brain tool-call time
(`VoiceTutorRealtime.tsx:6256-6300`) and keeps no per-LO tally. Detection is disclosure-driven; the silent
student is invisible.

### A.2 Module — `src/lib/tutor/orchestrator/struggle-ledger.ts` (pure, tested)
```ts
type LedgerEventKind = 'wrong' | 'no_recovery' | 'stuck_cue' | 'slow_segment' | 'confusion' | 'brain_gap';
interface LedgerEvent { kind: LedgerEventKind; loId: string; segId: string; atMs: number }
interface LoLedger { score: number; events: LedgerEvent[]; detections: number; lastDetectionAtMs?: number;
                     lastDetectionSegId?: string; inferredPushed: boolean; recovered?: boolean }
type LedgerState = Map<string /* loId or prereq:<label> */, LoLedger>;
applyLedgerEvent(state, ev, now): { state; detection?: { loId; count; signals: GapSignalCode[] } }
markRecovered(state, loId): LedgerState   // a correct answer on the LO after a detection
```
- Weights: `wrong` 1, `no_recovery` 1, `stuck_cue` 1, `confusion` 1, `slow_segment` 0.5, `brain_gap` 2.
  Detection when `score ≥ 2` (`TUNING`-style constants at the top of the module). After a detection the score
  resets to 0 so the next detection needs fresh evidence.
- Cooldown: a second detection on the same LO requires a different `segId` from the last detection OR ≥ 90 s
  since it — one bad minute is one detection, not two.
- `detections ≥ 2` ⇒ **recurrence** (returned in the detection object; Section B consumes it).
- Signals reported on a detection map 1:1 to existing `GapSignalCode` values (`INCORRECT_STREAK_2_PLUS`,
  `STUCK_CUE`, `SLOW_SEGMENT`, `NO_RECOVERY`, `STUDENT_VERBALIZED_CONFUSION`). **No new enum value** — the
  academy parses `GapsRead` with a closed enum and an unknown code would break its Gaps tab.

### A.3 Event sources (orchestrator wiring, all existing sites)
| event | source |
|---|---|
| `wrong` | incorrect-streak increment (`VoiceTutorRealtime.tsx:~14350`) |
| `no_recovery` | the same site when the streak was already ≥ 1 (a wrong after the tutor's intervening turn) |
| `stuck_cue` | the `STUCK_CUE` regex now at `:6265`, moved into the ledger module and shared |
| `slow_segment` | `segmentTurnCountRef` crossing 6, once per segment |
| `confusion` | student final transcript matching a generic confusion regex (`i don't get|i'm confused|doesn't make sense|i'm lost|what do you mean|makes no sense`) — module-owned, tested |
| `brain_gap` | `recordGap` / `flagPrerequisiteGap` handler (`:6256`); prerequisite gaps key as `prereq:<conceptLabel>` |
| recovery | correct-answer path (streak reset at `:14290`) → `markRecovered` |

LO for a segment: the same segment→LO resolution the `segmentOutcomes` builder uses (`:805`); free mode (no
segment LO) attributes to the active recap LO if a recap is running (B), else drops the event.

### A.4 Inferred gap push
On the FIRST detection for an LO with no `brain_gap` event on that LO in the same segment, the orchestrator
pushes into `sessionAccumRef.current.gaps`:
```ts
{ kind: 'lo', loId, inferred: true, observation: 'Inferred from behaviour: <n> incorrect attempts and
  <signal words> on this objective; the student did not name the difficulty.', studentQuotes: [], signals }
```
(prefix `Inferred from behaviour:` is a fixed string so the renderer and analytics can tell inferred from
disclosed). Once per LO per session. Debug event `gap_inferred`.
**Server cap:** `recordGap` clamps confidence for `inferred: true` entries to `≤ 0.5`, so an inferred gap is
always a `candidate` until a second session confirms it — inference can never auto-confirm.

### A.5 Recurrence
A detection with `count ≥ 2` on an LO that already has an accumulator entry (brain or inferred) increments
`recurrences` on that entry and sets `lastRecurrenceAtMs`; debug event `gap_recurred`. A brain re-fire on an
LO that already has an entry is treated the same way (dedupe: no second entry). Section B receives the
recurrence event.

### A.6 Prompt and tool changes
- `record_gap` / `flag_prerequisite_gap` gain optional `recurrence: boolean`.
- `system-prompt-builder.ts:814` "at most once per (loId, distinct issue)" becomes: fire once per distinct
  issue; **if the same issue returns later in the session, fire again with `recurrence: true`** — that is how
  the system learns a gap is not a slip. Wording stays structural, no subject examples.

### A.7 Persistence (engine only, wire-safe)
- `CommitBody.gaps[]` += `recurrences?: number`, `inferred?: boolean`, `recap?: RecapRecord` (B.6).
- `GapEvidence` (`student-profile/types.ts`) += `recurrenceCount?: number`, `inferred?: boolean`,
  `recap?: RecapRecord`. `recordGap` on an existing match bumps `lastSeenAt` (already) and adds
  `recurrences` to `recurrenceCount`.
- Contract `GapEntrySchema` is a non-strict zod object (verified: no `.strict()` on it), so the new engine
  fields are **stripped** on the wire, not rejected. No contract change for Section A.
- Resume: the ledger is in-memory and starts empty after a reload. Accepted; recorded here.

### A.8 Flag
`NEXT_PUBLIC_TUTOR_STRUGGLE_LEDGER` (orchestrator `flags.ts`, `!== 'off'`). Off ⇒ no ledger events, no
inferred pushes, no recurrence, Section B trigger 2 never arms.

## 3. Section B — Consent-gated recap

### B.1 State (orchestrator refs)
```ts
recapRef: Map<loId, { source: 'recurrence' | 'session-start'; offeredAtMs: number;
                      outcome: 'pending' | 'accepted' | 'declined' | 'unclear'; }>
pendingRecapOfferRef: { loId; loTitle; source; soft: boolean } | null   // one-turn directive
activeRecapRef: { loId; startedAtMs; turns: number; wrapNudged: boolean } | null
```

### B.2 Trigger 1 — first detection, in session
No new machinery. The existing prompt already permits inline remediation; the detour stays untracked as
course progress because free mode never marks plan segments. The ledger's `markRecovered` records whether it
worked.

### B.3 Trigger 2 — recurrence, mid-session
A recurrence event (A.5) for an LO with no `recapRef` entry arms `pendingRecapOfferRef`. The next brain turn
carries a one-turn `<recap_offer>` block in the volatile user content (new `BrainTurnInput.recapOffer`,
rendered in `claude-brain.ts` beside `<demo_stop>`; never in the cached system prefix):

> You have now seen the student stumble more than once on: **<LO title>**. In THIS turn, after responding to
> what they just said, offer a short recap of that idea: say in one sentence that you think a quick two- to
> three-minute recap might help, ask whether they want it now, then STOP and wait for their answer. Do not begin
> the recap in this turn. Speak from what you observed; never say a record or system shows they are weak.

The block retires after the turn dispatches; the entry becomes `pending`. Debug event `recap_offer_armed`.

### B.4 Reply classification — `src/lib/tutor/voice/recap-reply.ts` (pure, tested)
On the next accepted student final transcript while an entry is `pending`:
`classifyRecapReply(text) → 'accept' | 'decline' | 'unclear'`.
- accept: the existing bare-affirmative shapes (`claude-brain.ts:1041`) plus `sure|please|go ahead|let's do
  it|that would help|why not|yes please|quick one`.
- decline: `no|nah|not now|later|skip|let's keep going|move on|i'm fine|i'm good|i get it|straight in`.
- everything else: `unclear` (treated as a soft decline: no record, no re-offer this session, no directive).
The classifier result is also passed to the brain as a one-line `<recap_offer_reply>` note so it never re-asks.
Debug event `recap_offer_reply:<accept|decline|unclear>`.

### B.5 Accepted — `<recap_go>` and the bounded detour
One-turn block:
> The student accepted a recap of **<LO title>**. Do it now: first call `advance_lesson({to:"free"})`, then run
> a recall-first recap — ask them to say what they remember, fix the one idea that was wrong, then one short
> check they do themselves. Keep it under about three minutes. When they get the check right (or after two
> tries), call `advance_lesson({to:"next"})` to return to the lesson and say you are picking up where you left
> off.

`activeRecapRef` is set when the orchestrator sees `advance_lesson({to:'free'})` after the directive; cleared
(`recap_returned`) on `advance_lesson({to:'next'})`. Wrap nudge: after 6 brain turns or 4 minutes active, one
`<recap_wrap>` block ("one sentence of closure, then `advance_lesson({to:"next"})`"), `recap_wrap_nudged`. If
still active two turns later: `recap_overrun` is logged; the orchestrator never force-advances (a forced cursor
move would desync the lesson state the brain believes in).
Ledger during a recap: events attribute to the recap LO; a correct check → `markRecovered` → the accumulator
gap entry gets `recap.lastOutcome = 'improved'`, otherwise `'still_struggling'` at return.

### B.6 Declined — persistence
Entry `declined`; no further offers for that LO this session; the accumulator gap entry carries
`recap: { offered: 1, outcome: 'declined' }`. Store merges into `GapEvidence.recap`:
```ts
RecapRecord = { offers: number; accepts: number; declines: number; lastOfferAt: string;
                lastOutcome?: 'accepted' | 'declined' | 'improved' | 'still_struggling' }
```
Engine-only field, stripped on the wire (A.7).

### B.7 Trigger 3 — next session start (server, inside the widened block)
`pickRecapCandidate({ planLos, projections, gaps, homework, now })` (pure, in a new sibling
`learner-model/recap-candidate.ts`, tested; `context-block.ts` calls it) returns one candidate or null:
1. homework on a plan LO with status partial/weak (C.4) → reason `homework-weak`;
2. confirmed gap on a plan LO whose `recurrenceCount ≥ 1` → `recurred`;
3. review-due projection on a plan LO with estimate below the moderate band → `review-due`;
4. any confirmed, non-stale gap on a plan LO → `confirmed`.
Exclusions: `recap.declines ≥ 2`; declined in the most recent session ⇒ still eligible once, `soft: true`;
`isGapStale`. Rendered as a `recap_candidate:` line in `<learner_context>` AND returned structured as
`recapCandidate` in the boot response.
Client: when present, the flag is on, and the opening journey is subscribed-returning (never diagnostic,
resume-live, or trial), prepend to the opening directive (constant in `system-prompt-builder.ts`, generic):
> Your ONE continuity sentence this session is an OFFER: mention that <LO title> gave them some trouble last
> time (or that it is a good moment to revisit it), and ask whether they would like a two-minute recap of it
> before today's lesson or to go straight in. Wait for their answer before the day's hook.
Soft variant appends: "They said no to this once before — make the offer light and easy to decline."
Accept → the same `<recap_go>` path; the recap runs before `segments[0]` and `advance_lesson({to:'next'})`
lands on the plan's first segment (Plan 1 verifies the free→next transition from a fresh plan position).
This clause REPLACES the R28 continuity callback for that session; the directive says so explicitly.
Prepending the clause also creates the `recapRef` entry (`source: 'session-start'`, `outcome: 'pending'`) so
the B.4 reply classifier runs on the student's first answer exactly as it does mid-session.

### B.8 Flag
`NEXT_PUBLIC_TUTOR_RECAP_OFFER` (`!== 'off'`). Trigger 3 additionally needs the server flag
`TUTOR_LEARNER_CONTEXT=on` (decision 7).

## 4. Section C — Homework loop and the widened boot context

### C.1 Close tool — `close_session_notes` (silent, additive)
```ts
close_session_notes({ assignLoIds?: string[]; reason?: string; nextTimeIntent?: string })
```
Prompt section "Closing the session (silent)": when the session is wrapping (the student signals ending — the
existing session-end signal detector at `VoiceTutorRealtime.tsx:9167` —, the recap segment is reached, the
time-box wrap phase, or a goodbye), call it once. `assignLoIds` = the one or two objectives where you saw real
difficulty this session (omit when none; never for slips); `reason` = one plain sentence the student will read
on their homework card; `nextTimeIntent` = what you plan to open with next session (≤ 20 words). Then tell the
student in ONE sentence where the homework is, naming the practice locator when one is given; with no locator,
say nothing about homework. At most once per session.

### C.2 Orchestrator on the tool call
Validate `assignLoIds ⊆ plan LOs ∪ ledger LOs`; POST the new embed-token-gated internal route
`/api/tutor/practice-assign` (auth via `checkEmbedAuthAsync`, identity via `resolveProfileIdOrRaw`, mirroring
`mock-review-context/route.ts`) with `{ sessionId, lessonPlanId, courseId?, loIds, reason, locator? }`.
Store `nextTimeIntent` in the accumulator for the final commit. On success set `accum.assignmentMade`, log
`practice_assigned`; on failure `practice_assign_failed` (the final-commit fallback covers it).

### C.3 Server — resolver and record
`src/lib/tutor/practice-assign/` :
- `resolveAssignment({ profileId, partnerId, loIds, learnerBand, seenItemIds }, sources)` (pure over injected
  `PracticeSources`, tested): per LO `retrievePractice` with `scope:{loId}`, `count: 4`, `difficulty` from the
  learner band (`building`→1-2, `steady`→2-3, `strong`→3), `excludeIds` = item ids already present in this
  student's `EvidenceEvent` rows for that LO; cap 8 items total, weakest LO first.
- Model `PracticeAssignment`: `{ _id, studentId (profileId), partnerId, sessionId, lessonPlanId?, courseId?,
  los: [{ loId, title, reason, items: PracticeItem[] }], nextTimeIntent?, locator?, assignedAt, acknowledgedAt? }`,
  upsert keyed by `sessionId` (a second call in the same session replaces).
- Response `{ assigned: [{ loId, title, count }] }`; the end-of-session summary screen (TutorSession end screen
  and `/tutor` summary) shows "Homework: N questions on <title> · <locator | Practice tab>".
- **Fallback at final commit** (`student-profile/[id]` POST): if no assignment exists for the session and the
  commit's gaps include an entry with `recurrences ≥ 1` or `signals.length ≥ 2`, auto-assign for the top LO with
  reason "Your tutor noticed <title> needed more practice this session." The commit body carries
  `practiceLocator?` (from the embed config) so the fallback record is stamped with the same locator the
  tool-time route receives; without it the record is still written but stays behind the C.6 gate. Debug event `practice_assigned_auto`;
  the commit response carries `assigned` for the summary screen.
- `nextTimeIntent` also lands on the profile: `StudentProfile.nextSessionIntent = { text, sessionId, at }`
  (commit body field, engine-only).

### C.4 Widened `<learner_context>` (server, `context-block.ts`, flag `TUTOR_LEARNER_CONTEXT`)
Renderer stays pure; the DB join grows. Lines, all capped (≤ 8 LOs, ≤ 3 gaps, one homework line per LO,
total block ≤ ~600 tokens; a size test pins it):
- per plan LO: `<title>: <band> (<confidence>) <trend ↑ → ↓> [— DUE FOR REVIEW] · practice 3/5 on 09-02 ·
  quiz 6/8 pts on 08-30 · mock 1/3 (09-01)` — trend via the existing read-time `trendOf` against the 14-day
  snapshot (as the learner-state route does); practice/quiz/mock from `EvidenceEvent` rows by `source`
  (`practice` → last set's k/n; `assessment|quiz|diagnostic` → last pointsAwarded/maxPoints; `mock` → last
  attempt's correct/total on that LO). Mock line only when mock rows exist.
- `ability: <band>` (from `getLearnerHints`), `gaps resolved in the last 90 days: N`.
- `cadence: last session <n> days ago (<date>); <k> sessions in the last 7 days` from `recentSessions`.
- `next time (your own note from last session): "<nextSessionIntent>"` when present and ≤ 14 days old.
- `homework (assigned <date>): <title> — untouched | 3 of 5 attempted, 2 correct | done 5/5` — join
  `EvidenceEvent { studentId, itemId ∈ assignment items, occurredAt ≥ assignedAt }`; only assignments with a
  `locator` (C.6) and not yet `acknowledgedAt`, within 21 days. The commit that ends a session in which the
  homework line rendered sets `acknowledgedAt`.
- `recap_candidate: <title> — <reason>[ (soft)]` (B.7).
- `goal: …` for any social thread whose note starts `Goal:` (C.5) — the academy already sends those threads.
- Directive lines (generic): fast-track strong / probe developing / resolve a listed gap rather than
  re-explain (existing); **cadence:** after 7+ days open with a one-minute warm-up on the last LO before the
  hook, after ≤ 2 days skip re-orientation; **progress questions:** when the student asks how they are doing,
  answer from these lines — name the trend, one gap that is closing, the homework status and the next step —
  specifically and honestly, never inventing progress; **never read this block aloud or cite it as a record**.
Structured extras on the boot response: `recapCandidate`, `homework` (for the client's opener clauses).

### C.5 Goals via the social-thread extractor (engine only, no contract change)
`extract-social-threads.ts` JOB 1 gains: *"a goal or target the student stated (a grade, a score, an exam
date, a skill they want) — emit it as kind `context` with the note starting `Goal: `."* `VALID_KINDS` is
unchanged because the contract's `SocialThreadSchema.kind` is a closed enum; a new value would fail the
academy's parse of `socialMemoryDelta`. The renderer detects the `Goal: ` prefix.

### C.6 Opener composition and the locator gate
Client, when the boot response carries `homework` and/or `recapCandidate` and/or `nextSessionIntent`, prepend
ONE clause set to the opening directive, in this precedence (the directive says: this is the single continuity
move — pick the most relevant, do not stack):
1. homework present → "Open by checking the homework in ONE sentence: done well → acknowledge specifically and
   move on; partial or weak → that is the recap offer that follows; untouched → ask lightly, no guilt, and offer
   the two-minute recap instead."
2. next-time intent → "You said last time you would start with <intent> — honor it unless the homework result
   argues otherwise."
3. recap offer (B.7).
**Locator gate:** an assignment without a `locator` is recorded but never spoken about, never shown on the
summary screen, and never rendered as a homework line. The locator's presence on the embed config is the
academy's declaration that it renders the card. This is what makes Plan 1 safe to deploy before Plan 2: no
locator ⇒ the student is never told about homework they cannot see.

### C.7 Transient inbound fields (embed config, engine `EmbedConfig` + academy `embedToken.ts`; not contract)
- `practice_locator?: string` — academy mints `"Unit ${node.unit} · Practice"` for node sessions.
- `goal_note?: string` — academy composes from `Enrollment.goal` when present (e.g. "SAT on 2026-03-14, target
  1400"). Rendered by `transient-context.ts` as `goal:`; complements C.5.
Both read for this session only, never persisted engine-side (same semantics as `readiness_note`).

### C.8 Contract v1.15.0 (additive)
- `SessionResultSchema` += `assignedPractice?: Array<{ loId, title?, itemIds: string[], reason, assignedAt }>`
  and `nextSessionIntent?: string`. Populated in `emitSessionResult` from `PracticeAssignment` by `sessionId`,
  best-effort: the client's tool-time write normally precedes the academy's `/sessions/result` emit, but the
  two are independent requests, so this field may be absent on a fast finish. The read below is authoritative.
- New `POST /api/portal/v1/assigned-practice` (`withPortalAuth`):
  `AssignedPracticeRequestSchema { studentId, courseId?, includeAcknowledged?: boolean }` →
  `AssignedPracticeResponseSchema { assignments: [{ assignmentId, sessionId, assignedAt, los: [{ loId, title?,
  reason, items: PracticeItem[], status: { attempted, correct, total, lastAttemptAt? } }] }] }`.
  Items include answer keys exactly as `/practice` does (decision 14 of the P&Q build: local grading).
- Process per `project_portal_contract_v1_2`: edit sibling `src/`, build, rsync dist into BOTH `node_modules`,
  tag `v1.15.0`, bump both pins. Tag before any pin bump.

### C.9 Academy (Plan 2)
- `PracticeSet.source` enum += `'tutor-assigned'`.
- `SessionService.startSession` node branch mints `practiceLocator` + `goalNote` → `buildEmbedUrl`.
- `processResult` stores `result.assignedPractice` summary and `nextSessionIntent` on the `Session` row
  ("Homework assigned" chip on My Sessions).
- `GET /me/assigned-practice` (api → engine read) and the BFF route; `PracticeTab` passes assignments to
  `PracticeView`; a "From your tutor" card at the top of the unit containing the LO's node (`CourseNode.unit`)
  with the reason, item count and status pills; Start → `POST /artifacts/practice/assigned { assignmentId,
  loId }` creates (or reuses) a `PracticeSet { source: 'tutor-assigned', scope: { loId }, items }` and opens
  the existing `PracticeDrill`. Attempts flow through `attemptPractice` unchanged, so evidence reaches the
  engine with the assigned item ids and the next boot computes status.
- Absent data ⇒ no card, byte-identical tab. No academy flag.

### C.10 Flags
`NEXT_PUBLIC_TUTOR_CLOSE_NOTES` (`!== 'off'`) gates the tool, the assign route call, the fallback and the
summary line. The widened block, trajectory, cadence, digest, goals and homework lines all ride the server
flag `TUTOR_LEARNER_CONTEXT=on` (env line added to `.env.local.production` in root AND worktree, byte-identical;
runtime read, no build dependency — deploy anyway so the env and build move together).

## 5. Section D — False-praise-opener guard

### D.1 Problem
Three live instances of praise-then-reverse. `praise-contradiction.ts` needs `not <affirmed phrase>` or a math
substitution; `praise-echo-check.ts` needs a math token or MCQ letter in the opener capture. A bare "Right,"
followed by prose satisfies neither, and the verdict hold releases after two clean sentences or 1.5 s.

### D.2 Module — `src/lib/tutor/voice/false-praise-opener.ts` (pure, tested)
```ts
checkFalsePraiseOpener({ sentence, studentUtterance, verifiedExpectedAnswer?, unverifiedCardAnswer?,
                         choices?, problemContext?, spokenMoneyEnabled? })
  → { verdict: 'ok' | 'false_praise' | 'advisory_false_praise'; expected?; matchReason? }
```
- `PRAISE_OPENER_STRICT_RE`: `right|yes|yep|exactly|correct|perfect|spot on|bingo|that's (right|correct|it)|
  you (got|nailed|have) it|well done|nice (work|job|one)|great (work|job)` at sentence start, followed by
  punctuation. Excludes `right (idea|track|direction|thinking|start)`, `close`, `almost`, `nearly`, `you're
  close` — those are partial verdicts, not affirmations.
- Fires only on the FIRST sentence of attempt 0 (the opener), when the student utterance is answer-shaped
  (not a question, not a pure acknowledgment per `isPureAcknowledgment`).
- Verified tier: `matchUtteranceToAnswer(studentUtterance, verifiedExpectedAnswer, choices, …)` returns
  full-parse `disagree` AND `isSingleValued(expected)` (no `,`, ` and `, `;`, at most one `=`, ≤ 40 chars)
  ⇒ `false_praise` ⇒ kill + retry with reason: *The student answered "<utt>", but the verified answer is
  <expected>; your opener affirmed it. Re-emit: open with the true verdict, then guide.*
- Unverified tier (`unverifiedCardAnswer` only) ⇒ `advisory_false_praise` ⇒ correction note, never a kill.
- `agree` / `unknown` / multi-valued ⇒ `ok`. Same expected-answer sourcing as the inverse-verdict site
  (`VoiceTutorRealtime.tsx:11033`: staged spoken answer newer than the card wins; 2-minute freshness).
Debug events `false_praise_opener_kill` / `false_praise_opener_advisory`.

### D.3 Praise-contradiction widening
`detectPraiseContradiction(turnText, opts?: { studentUtterance?: string })` gains a third branch for a
NON-math opener capture (bare praise + prose): a later sentence that starts with `DENIAL_RE` or contains
`isn't (quite )?(it|right|correct)` / `not quite (it|right)` fires when that sentence either names the student's
utterance value (normalized) or names **no** value or math token at all (a bare denial can only be about the
one claim on the table). It does NOT fire when the denial names a different value — the two-part case.
Existing branches untouched.

### D.4 Replay set (before tests are written; the standing rule)
Instance 1 two-part *"The roots part is right … Not quite on the vertex"* → must NOT fire on either module;
instance 2 *"Right. Sixteen plus … that's thirty-eight." / "Not quite, close."*; instance 3 *"Right, let's check
the reasoning behind it. … so x=9 isn't quite it here."* with a verified MCQ key ≠ the student's pick; the R38
sentences; every existing `praise-contradiction` and `praise-echo` case; `"Right. Here's the next one: …"` after
a correct answer (must not fire); `"Right idea — but check the sign."` (must not fire).

### D.5 Flag
`NEXT_PUBLIC_TUTOR_FALSE_PRAISE_OPENER` (`!== 'off'`) gates both D.2 and the D.3 branch.

## 6. Telemetry
New debug events (added to `EMBED_DEBUG_EVENT_PREFIXES` in `tutor-portal/embed/page.tsx`; the
`test:embed-debug-coverage` battery enforces it): `gap_inferred`, `gap_recurred`, `recap_offer_armed`,
`recap_offer_reply`, `recap_started`, `recap_returned`, `recap_wrap_nudged`, `recap_overrun`,
`practice_assigned`, `practice_assigned_auto`, `practice_assign_failed`, `homework_checked`,
`false_praise_opener_kill`, `false_praise_opener_advisory`. Server logs: `[practice-assign]`,
`[learner-context]` timing.

## 7. Testing and verification
- Pure batteries (node:assert, `npx tsx scripts/test-*.ts`, registered in `test:all`): `test:struggle-ledger`,
  `test:recap-reply`, `test:recap-candidate`, `test:practice-assign` (injected sources), `test:false-praise-opener`,
  `test:praise-contradiction` (extended), `test:learner-context` (renderer + size cap), `test:portal-contract`
  (v1.15 parse round-trips), academy tests for the read route and the PracticeSet source.
- Gate at ship: tsc clean, build clean, `test:all` with only the 4 known reds.
- Typed-input prod probes (all four sections are deterministic and need no voice): a scripted student who
  answers wrong twice on one LO → `gap_inferred`, third time → `gap_recurred` + `recap_offer_armed`; reply
  "sure" → `recap_started` … `recap_returned`; reply "not now" → declined, no re-offer; close with a
  difficulty → `practice_assigned`; next session on the same student → block shows homework/next-time/recap
  lines (`homework_checked`). Guard: a wrong MCQ answer followed by a "Right," opener → `false_praise_opener_kill`.
- Plan 2 live check (crimsora test account): assign → card → attempt → next session block shows status.

## 8. Sequencing
- **Plan 1 (engine, worktree `tutor-rounds`):** A, B, D, C.1–C.6 (tool, route, resolver, record, fallback,
  widened block, goals, opener clauses, locator gate), env line `TUTOR_LEARNER_CONTEXT=on`. Deploy via
  `./deploy-tutor.sh` after Praveen's go. Because of the locator gate, nothing homework-related reaches a student
  until Plan 2.
- **Plan 2 (contract + academy):** C.8, C.9, C.7 academy side. Order: tag v1.15.0 → engine pin + read route →
  engine deploy → academy pin + card + mint fields → academy deploy (both tenants).

## 9. Risks and mitigations
| risk | mitigation |
|---|---|
| Inference over-fires on slips | threshold 2 with cooldown; inferred gaps capped at candidate (≤ 0.5); watch `gap_inferred` rate in the first live week |
| Recap overruns the lesson | 6-turn / 4-minute nudge; overrun logged; never force-advance |
| Block grows the prompt | hard caps + size test (~600 tokens); lines only when data exists |
| `assignedPractice` missing on SessionResult (race) | the read route is authoritative; the academy card never depends on the emit |
| New enum values on the wire | none added (signals, thread kinds); engine-only fields are stripped by non-strict zod objects |
| Ledger lost on reload | accepted; resume sessions start a fresh ledger |
| Praise kill on a correct answer | verified + single-valued + full-parse disagree only; unverified is advisory; replay set in D.4 |
| Nagging | one offer per LO per session; two declines end offers; unclear counts as a soft decline |
