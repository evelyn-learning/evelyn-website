# Learning-gaps blending into live sessions — design

**Date:** 2026-07-05 · **Queue:** engine fixes v2, item 3 · **Status:** approved-by-memo (user away; scope per memo = "small plumbing + prompt clause; the intelligence rides item 4")

## Investigation findings (answer to "does the tutor use the gaps?")

**Yes — the read side already works, for any session with a `studentId`:**

- VTR fetches `GET /api/tutor/student-profile/:id` at mount and attaches the
  rendered `<student_profile>` block to **every** brain turn
  (`studentProfileBlockRef` → `claude-brain.ts`). The portal embed passes
  `config.student_id`; `/tutor?studentId=` works for dev. Demo sessions have no
  studentId and are ephemeral by design.
- The block (`student-profile/render.ts`) carries up to 5 open gaps
  (candidate/confirmed, TTL-filtered) with observation + verbatim student
  quotes + confidence, top-8 mastery labels, and the last 3 session memories.
- Existing guidance: open with a verbatim-quote callback when the session topic
  touches a gap (live-verified 2026-05-08), plus "address opportunistically" /
  "let it shape pacing".
- Record side: `record_gap` / `flag_prerequisite_gap` tools + orchestrator
  signal stamping accumulate into `sessionAccumRef`; the commit endpoint runs
  the full promote/resolve lifecycle.

**The load-bearing defect is on the WRITE side:**

1. `commitSessionToProfile` fires at exactly ONE site — the End/Pause button
   click. Tab close, mobile swipe-away, reload, network drop, or the embed
   being torn down ⇒ the entire session's mastery deltas + gap evidence are
   silently lost. For enrolled students this makes gap accumulation unreliable,
   so there is often nothing to blend. (Same failure class the
   transcript/whiteboard persistence fixed in 2026-04 by moving to periodic
   flushes.)
2. `appendSessionMemory` blindly appends — the commit endpoint is NOT
   idempotent per sessionId, which is what blocks naive repeated commits.
3. Mid-session guidance is opener-focused; nothing tells the brain to probe a
   gap when the current material exercises it, or to acknowledge growth when
   the student demonstrates a previously-gapped concept.

## Approaches considered

- **A (chosen): make the commit idempotent, then flush incrementally.**
  Merge-upsert SessionMemory by sessionId; debounced intermediate commits when
  the accumulator gains entries; `pagehide` keepalive commit; End button stays
  the final commit. Deltas/gaps stay incremental (accumulator resets per
  commit) — `recordGap` already merges re-fires per session, and
  `applyCrossSessionPromotion` already dedupes by sessionId.
- B: piggyback profile deltas on the existing 30s session-usage flush —
  couples two stores/endpoints with different trust models; rejected.
- C: pagehide beacon only — misses mobile OS-kill where pagehide never fires;
  kept as one trigger of A, rejected as the only mechanism.

## Design

### 1. Idempotent commit (store + route)

`upsertSessionMemory(profile, memory)` in `student-profile/store.ts` replaces
`appendSessionMemory` in the commit route. Match on `sessionId`:

- no existing entry → append (today's behavior);
- existing → merge: union `losTouched`; concat `masteryDeltas`; sum
  `notesOverlaysAddedThisSession` per bucket; take the newer `endedAt` /
  `durationMinutes`; `summary` = new non-empty wins, else keep old;
  `subject`/`topic`/`grade`/`lessonPlanId` = keep existing, fill from new if
  absent.

`appendSessionMemory` stays exported (other callers unaffected) — the route is
the only caller that switches.

### 2. Incremental flushes (VTR)

`commitSessionToProfile(opts?: { final?: boolean })`:

- **final** (End/Pause button, unchanged behavior): full body incl. transcript,
  summary generation on.
- **intermediate**: omit `transcript`, send `generateNotes: false` — no
  LLM-summary cost, small payload.

Triggers:

- `scheduleProfileFlush()` — 20s debounce, called at the three accumulation
  sites (mastery delta push, both gap pushes). Coalesces bursts; each flush
  sends only the increment since the last commit.
- `pagehide` listener (registered when `studentId` set): intermediate commit
  via `fetch(..., { keepalive: true })` so abnormal exits still persist deltas
  + gaps (summary sacrificed — acceptable).
- Debounce timer cleared on unmount.

### 3. Mid-session weave guidance (render.ts tail — only present when gaps exist)

Extend the existing tail instruction with the "fill along the way, close
intelligently" behaviors:

- When the material being taught exercises an open gap, work in one quick
  check on it and scaffold based on the result — don't announce that a
  record says the student is weak.
- When the student demonstrates a previously-gapped concept correctly,
  acknowledge the growth concretely (contrast with the "student previously
  said" quote when available).
- (Recording/resolution stays on the existing lifecycle: re-fire `record_gap`
  on re-demonstration — already in the tool description; LO gaps resolve via
  mastery at commit; prereq gaps decay via TTL until the concept registry.)

Generic wording only — no subject examples. Token cost is zero when the
student has no open gaps.

## What this does NOT do (deferred / item-4 territory)

- No new resolution machinery (registry path stays deferred per gaps-v1 locks).
- No plan seeding from gaps, no per-student modality memory — item 4.
- No profile-block re-fetch mid-session (brain has in-session context).

## Testing

- Extend `scripts/test-cross-session-promotion.ts` (`npm run test:gaps`):
  upsert merge semantics, same-session idempotency, distinct-session append,
  bucket summing, summary preference.
- Type-check; existing tutor gates untouched.
- Live verify: seed a profile with a confirmed gap (+quote) via POST, run a
  session with `?studentId=`, assert (a) the opener does the verbatim-quote
  callback, (b) an intermediate commit lands after a segment completes
  (profile shows the SessionMemory entry + deltas before the session ends),
  (c) closing the tab without End still persists (pagehide path).
