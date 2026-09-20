# Pedagogy round — investigation findings (2026-09-05, pre-brainstorm)

Grounding for the three-thread round briefed in memory
`project_tutor_inferred_gaps_and_consented_recap`. Every claim below was read from code in
worktree `tutor-rounds` @ `b1dace0c` (== origin/main), the academy repo, the portal-contract repo
(v1.14.0), or a read-only prod Mongo query through the local 2710 tunnel. Nothing was changed.

## Headline: a learner model already exists and the tutor cannot see it in prod

`src/lib/tutor/learner-model/` (shipped 2026-08-10/11, spec in
`academy/docs/superpowers/specs/2026-08-11-learner-model-phase-c-design.md`) is an append-only
per-item evidence log + per-LO projection (estimate / confidence / trend / `reviewDueAt`) + Elo +
nightly snapshot job. MEMORY.md carries no entry for it.

Prod counts (read-only, 2026-09-05):

| collection | count |
|---|---|
| evidenceevents by source | practice 769 · session 690 · assessment 549 · diagnostic 321 · mock 225 |
| learnerstateprojections | 655 rows over 59 students |
| projections with `reviewDueAt <= now` | 171 |
| studentprofiles with ≥1 gap | 48 |

The `<learner_context>` boot block (`learner-model/context-block.ts`: per-plan-LO standing band +
"DUE FOR REVIEW" + top 3 confirmed gaps) is built by
`api/tutor/student-profile/[id]` only when `TUTOR_LEARNER_CONTEXT === 'on'`. That variable is
**absent from `.env.local.production`** (only `ENABLE_LEARNER_MODEL_SNAPSHOT=true` is set), so in
prod the block never renders. Note the flag is the older `=== 'on'` style, not `!== 'off'`.

## Thread 3 — what the tutor knows today about practice / quiz / mock

**Flows INTO the engine (all live):**
- Practice drill attempt → academy `attemptPractice` → engine `session-result` with
  `evidence[]` (source `practice`, per item: itemId, outcome, difficulty, latencyMs, hintUsed),
  a ×0.4 mastery nudge, and a candidate gap when <50% (`ArtifactService.ts:175-260`).
- Quiz → `assessmentSubmit` → `diag:` evidence rows (source `quiz`/`assessment`/`diagnostic`),
  mastery delta, candidate gap, and a `quiz-*` entry in `studentprofiles.recentSessions`
  (`portal/assessment.ts:300-360`). 14 such rows in prod.
- Mock → per-item evidence (source `mock`) + gaps/mastery keyed `mock:<attemptId>`
  (`mock-exam/report.ts:259-342`).

**What the brain actually reads (prod):** the `<student_profile>` block only — mastery scores
(indirectly moved by the above), gaps (4 practice-sourced in prod, observation text
"Practice: 1/4 correct on <lo>"), and recent sessions including `quiz-*` rows with LOs but **no
score**. Never per-item outcomes, item ids, review-due state, or mock scaled scores. The one
exception is a `mock-review` session, which gets a `<mock_review>` block for a single attempt.

**Is the practice set fixed per unit?** No. Each drill fetches 3 items from the engine bank by
(LO, difficulty hint from mean mastery, `excludeIds` of everything the student has seen, generate
on exhaustion) and stores a `PracticeSet` doc with `attempts[]` (`PracticeView.tsx:640`,
`portal/practice.ts`). A "redo the misses" pill row already reads the last attempt per item. So a
tutor-customised set is a new **selection input + a new PracticeSet source**, not a replacement of
a fixed list.

**Remediation machinery that already exists academy-side:** `POST /reviews/start` picks
review-due LOs from `learner-state` (or a mock's weakest LOs) → engine `review-plan` composer
(`compose-review-plan.ts`: recall + try-yourself per LO, weakest first, never cached) → a
freeform session. This is the "something to remediate WITH" the 2026-09-03 audit said was missing,
for manifest LOs (not for lower-grade prerequisites).

## Thread 1 — gap lifecycle in prod confirms "fires once, never re-fires"

| status / kind | n | multi-session | firstSeenAt == lastSeenAt |
|---|---|---|---|
| candidate / lo | 150 | 0 | 150 |
| confirmed / lo | 14 | 13 | 1 |
| candidate / prerequisite | 6 | 0 | 6 |
| confirmed / prerequisite | 2 | 1 | 1 |
| resolved / lo | 2 | 0 | 0 |

Every candidate is a single observation that never updated. Two causes, both structural:
1. The system prompt says *"Per session, fire at most once per (loId, distinct issue)"*
   (`system-prompt-builder.ts:814`) — in-session recurrence is forbidden by rule.
2. The orchestrator stamps objective signals only at brain tool-call time
   (`VoiceTutorRealtime.tsx:6256-6300`); it keeps no per-LO tally of wrong answers, hints or
   non-recovery across segments, so it cannot detect recurrence on its own.
The store already supports re-fire (`recordGap` merges by loId, bumps `sessionIds`/`lastSeenAt`,
promotes at 2 sessions). The 13 multi-session confirmations prove the cross-session path works.

**Opener composition:** `buildOpenerClause` (returning subscribed) mandates exactly ONE
continuity sentence and bans recaps; `STALE_CHECKPOINT_REORIENT_CLAUSE` is the precedent for a
one-line directive prepended to the opening directive. The `<opening_directive>` is a per-turn
user-content block that retires on `advance_lesson` or after 4 brain turns.

**In-session detour tools that work today:** `advance_lesson({to:'free'})` releases the plan
cursor and `advance_lesson({to:'next'})` resumes it (same plan, `segmentBeforeFreeRef`). Plan
swap is unwired in the embed; no plan stack; prereq data never reaches the prompt (unchanged
since the 09-03 audit).

## Thread 2 — why the three live instances escaped the guards

- `praise-contradiction.ts` needs the later sentence to say `not <affirmed phrase>` or to
  substitute a math value. Instance 3's opener is bare *"Right, let's check the reasoning…"* —
  the capture is prose, so neither branch can fire. Instance 2's *"Not quite, close."* restates
  nothing.
- `praise-echo-check.ts` needs a math token or an MCQ letter in the opener capture; bare "Right,"
  has neither.
- The verdict hold releases after the opener + 2 clean sentences or `VERDICT_HOLD_CAP_MS` = 1500
  ms; instance 3's reversal came several sentences later, after audio.
- What IS available at the call site: the student's utterance, the verified expected answer
  and MCQ choices (`currentProblemRef`), and `matchUtteranceToAnswer` returning `disagree`. In
  instance 3 the student's MCQ pick disagreed with the verified key, so a praise-class opener was
  false **before any later text existed**. That is same-claim scoping by construction: the claim
  is the student's answer to the posed problem. The two-part case (roots right, vertex wrong)
  yields `unknown`/partial from the comparator, so it cannot fire.

## Contract state

`@evelyn/portal-contract` is at **v1.14.0** (both repos pin it; memories saying v1.5/1.6 are
stale). Relevant additive surfaces already present: `SessionEmitRequest.evidence[]` (v1.12),
`learner-state` read + `review-plan` (v1.12/1.13), `PlanGenerateRequest.studentId` (v1.13),
`AssessmentSubmission.purpose` (v1.13). `SessionResult` has no slot for an assigned-practice
result; `StudentContext` has no slot for homework status.
