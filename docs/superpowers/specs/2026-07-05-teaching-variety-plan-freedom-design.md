# Teaching variety / plan-freedom — design

**Date:** 2026-07-05 · **Queue:** engine fixes v2, item 4 (BIG) · **Status:** grilled + locked with user 2026-07-05; awaiting spec sign-off before implementation-plan.

## Problem (user's words, refined in the grill)

For **enrolled** students, a lesson plan is followed like a fixed script — the
same hook, the same worked example, the same try-yourself numbers every time
the plan is taught. Re-serving identical material is jarring: no student wants
to re-attend a lesson knowing the exact same content will repeat. The plan's
**pedagogical architecture** (LO decomposition, segment sequence, the specific
misconception each check targets, difficulty ramp, vocabulary) is the valuable,
tested part and must be conserved. The **content used to explain** — the hook's
story, the example's objects/numbers, the try-yourself problem — is one
instantiation of that architecture and should be fresh on repeat visits.

The plan is a **blueprint with fixed slots and swappable fillings.**

- **Fixed slots (the contract):** LOs, prerequisites, vocabulary (terms+defs),
  concept `keyIdeas` (the substantive facts), the misconception *target*,
  difficulty level, segment kinds + order, recap.
- **Swappable fillings (vary on repeat):** hook, worked_example, try_yourself,
  misconception_check *scenario*, extension question.

## Grounded findings (from code investigation)

1. **PROBLEM-LOCK is not about protecting authored words** — it keeps the
   *rendered* problem and the *validated* answer in sync (`claude-brain.ts`
   `problemLock`). Fresh problems are compatible: render the new problem
   verbatim, validate against *its* answer. The lock target moves from "the
   authored text" to "whatever was rendered this turn."
2. **The verified generator already exists, stubbed.** `problem-generator.ts`
   is a designed 4-layer waterfall returning `{canonicalText, expectedAnswer,
   responseFormat, choices, hints, provenance}`. **Layer 2 = "Opus generates a
   fresh problem → Sonnet independently solves it in fresh context → 1 retry on
   mismatch"** — a verified answer key for a novel problem. Fully wired
   (telemetry, provenance, `brainGenState: disabled|shadow|beta|live`) but the
   body `brainGenWithVerify()` returns `null`. This is the long-deferred
   "Phase-2 brain-gen." **Graded-slot variation = finishing this.**
3. **C1 plan-as-seed framing** (`claude-brain.ts`, flag-gated) already tells the
   subscribed brain "seed, not a script … swap in an example freely" — but only
   under the pedagogy flag, and it sits in tension with PROBLEM-LOCK's "render
   the EXACT problem text." This initiative resolves that tension.
4. **Seen-memory has a precedent to copy:** the opener-recency loop
   (`LastOpenerRecord` write-back). Content-seen is engine-internal
   personalization keyed by `studentId`, so it rides the same `StudentProfile`
   store as mastery/gaps — **no contract change** (unlike opener-recency, which
   round-trips through academy).

## Locked decisions (grill, 2026-07-05)

1. Scope = **content freshness only.** Same teaching approach; only the specific
   hook/example/problem content changes. Per-student **modality-selection
   intelligence** (choose doodle vs solved-example vs story by what's worked)
   is **deferred** to a later build.
2. **Don't vary the first session** — authored content is the tested, cheap,
   highest-confidence path. Variation earns its cost on *return* visits.
3. Generation locus = **live, hybrid.** Narrative slots improvised brain-side
   live (no answer key needed); graded slots route through the
   `generate_problem` verified pipeline (Phase 2). No pre-session batch, no new
   generation infra beyond finishing Layer 2.
4. Trigger = **per-plan seen-memory.** Vary only when this `planId` was taught
   to this student before; feed the actual prior fillings as an exclusion set so
   new content is *guaranteed* different, not blindly re-rolled.
5. Seen-capture = **store actual fillings, show the brain.** Persist the real
   content used (bounded: last 3 renditions of each slot, as text) keyed by
   `(studentId, planId)`; next session hands the brain "already seen — differ
   from these."
6. Slot list: **vary** hook, worked_example, try_yourself, misconception
   *scenario*, extension. **Fixed:** LOs, prereqs, vocab, concept `keyIdeas`,
   recap. (PROBLEM-LOCK covers try_yourself / worked_example /
   misconception_check / extension text — verified in code; only `hook` is
   outside it. But *validation against a student answer* only happens for
   try_yourself + misconception_check, which is what sets the phase boundary in
   #7, not PROBLEM-LOCK membership.)
7. Build **phased** on the boundary *"does the student submit a validated
   answer against this slot?"* — Phase 1 = the slots where they DON'T (hook,
   worked_example, extension) + full seen-memory loop (this build); Phase 2 =
   the slots where they DO (try_yourself, misconception_check) via finished
   Layer-2 brain-gen+verify (fast-follow).

## Architecture

### Seen-memory (both phases)

- **Type** (`student-profile/types.ts`): add
  `planContentSeen?: Record<string, PlanContentSeen>` to `StudentProfile`, where
  `PlanContentSeen = { hooks: string[]; examples: string[]; problems: string[] }`.
  Each array is FIFO-capped at 3 (newest kept).
- **Capture** (`student-profile/[id]/route.ts` commit): fold filling-extraction
  into the *existing* session-summary LLM pass (one call emits summary **and**
  `{hooks, examples, problems}` used this session — a short descriptor per
  narrative filling, canonicalText for problems). Merge into
  `planContentSeen[lessonPlanId]` via a pure `recordPlanContentSeen(profile,
  planId, fillings)` in `store.ts` (cap+FIFO+dedup). Gated on the flag (so
  flag-off adds zero LLM cost and is byte-identical); runs on the **final**
  commit only (which carries the transcript), **every** flagged session incl.
  the first — the first session's authored fillings become the baseline session
  2 diverges from. First session after the flag is enabled has no baseline yet,
  so it doesn't vary but starts capturing — correct.
- **Read + inject** (`claude-brain.ts` plan-framing): a pure
  `buildContentVarietyDirective(planContentSeen[planId])` renders a
  `<content_variety>` block into the lesson-plan context **iff** flag on AND
  `planContentSeen[planId]` is non-empty (≥1 prior session). Generic wording
  (feedback_generic_prompts): teach the same LOs and target the same
  misconceptions at the same difficulty, but make the hook / worked example /
  try-yourself / misconception scenario / extension materially different from
  the authored version and from what the student has already seen: `<list>`.
  Absent block ⇒ byte-identical to today.

### Phase 1 — no-validated-answer slots (this build)

- Vary **hook, worked_example, extension** — the slots where the student does
  **not** submit an answer that a validator checks. The worked_example is
  tutor-demonstrated (the tutor renders AND solves its own fresh problem, so
  there's no student-answer/rendered-answer desync to guard); the hook is
  outside PROBLEM-LOCK entirely; the extension is discussion. The two slots the
  student is graded on (try_yourself, misconception_check) stay **authored** in
  Phase 1 — so no student answer is ever validated against varied content.
- Delivery is purely the `<content_variety>` directive; the brain improvises
  fresh content live. No pipeline, no verifier. A freshly-worked example still
  passes through the existing tutor math guards + judge, exactly like any live
  tutor computation — this is not a new risk surface.
- Fallback: if the brain produces nothing usable, the authored hook/example
  stands — never a blank/degraded turn (brain already owns this).

### Phase 2 — validated-answer slots (fast-follow)

- Finish `brainGenWithVerify()` (Layer 2): Opus generates a fresh problem at the
  authored slot's difficulty (anchor = authored problem, difficulty = "same"),
  Sonnet solves it fresh-context, 1 retry on mismatch, else fall through to bank
  (Layer 3) → authored (Layer 4). Ramp via the existing `brainGenState`
  (shadow → beta → live).
- On a repeat session, try_yourself + misconception_check render the *generated*
  problem; PROBLEM-LOCK re-targets to the generated text + verified answer.
  Never varies unless verify succeeds — else authored stands.

### Flag / rollout

- `NEXT_PUBLIC_TUTOR_CONTENT_VARIETY` (orchestrator flags), **default OFF**,
  ships dark. Flag-off ⇒ no `<content_variety>` block AND no capture-extraction
  — byte-identical teaching path, zero added LLM cost.
- Flag-on but first-session / no-studentId (demo, anon) / no prior on this plan
  ⇒ authored content, unchanged (capture runs to seed the baseline).

## What this does NOT do

- No modality-selection intelligence (deferred).
- No pre-session generation / caching / new storage beyond `planContentSeen`.
- No contract change (engine-internal, keyed by the shared `studentId`).
- Phase 1 changes no answer-bearing content — zero PROBLEM-LOCK/validation risk.

## Testing

- **Unit** (`test:gaps` sibling or new `test:content-variety`):
  `recordPlanContentSeen` (FIFO cap 3, per-plan keying, dedup) +
  `buildContentVarietyDirective` (present iff non-empty seen; absent ⇒ empty
  string; generic wording; lists seen fillings).
- **Live (Phase 1):** same studentId + same plan, two sessions. Assert (a)
  session 1 uses authored hook and captures it into `planContentSeen`; (b)
  session 2's hook is materially different from the authored hook AND from the
  captured session-1 hook; (c) LOs/vocab/difficulty unchanged; (d) flag-off run
  is byte-identical (authored hook both sessions).
- Type-check; existing tutor gates (gaps, resume-seed, reactions,
  page-grouping) untouched.

## Open follow-ups (post-Phase-2)

- Modality-selection intelligence (the deferred half of memo item 4).
- Whether `planContentSeen` should ever surface to the academy (today
  engine-only; opener-recency's cross-device rationale doesn't clearly apply).
