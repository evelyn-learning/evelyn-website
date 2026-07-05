# Noise-nagging tutor reaction — design

**Date:** 2026-07-05 · **Queue:** engine fixes v2, item 2 · **Status:** approved-by-memo (user away; decisions resolved from the 2026-07-06 queue memo + codebase evidence)

## Problem

The perception layer correctly classifies environmental sounds as noise and resumes
speech (Stage 3.1 resume-from-cut), but the tutor never *acknowledges* the pattern.
A student in a noisy room experiences the tutor repeatedly pausing mid-sentence with
no explanation. A human tutor would say something after the third interruption:
"there seems to be noise in your background and I keep getting interrupted — either
reduce the noise or mute your mic and type instead."

This is also the first entry in a running "how would a human tutor react" playbook
(user memo), so the mechanism must be reusable: **situation counter → one-time
spoken suggestion**.

## Design

### Trigger (what counts as a noise interruption)

Every entry into `applyPerceptionVerdict`'s noise-family branch
(`verdict ∈ {noise, filler, drop_self_voice}`) with an open checkpoint. A checkpoint
means a cancel actually fired — the tutor was audibly paused ('speaking') or its
thinking was aborted ('processing'). All three verdicts are mic-pickup false
positives, and the suggested remedies (reduce noise / mute + type) apply to all
three. Entry-filter noise drops (`classifyTranscript` at perception entry) do NOT
count — they never interrupt anything.

### Counter (pure module `src/lib/tutor/voice/tutor-reactions.ts`)

- `TutorReactionRule { id, threshold, windowMs, maxFiresPerSession, directive }`
- `ReactionState { events: number[], fires: number }` — held in a VTR ref, so it is
  session-scoped by construction (VTR remounts per session via `key={sessionId}`).
- `recordReactionEvent(state, rule, nowMs): boolean` — pushes the timestamp, prunes
  events older than `windowMs`, returns true exactly when
  `events.length ≥ threshold && fires < maxFiresPerSession`; on fire, increments
  `fires` and clears events.
- Rule shipped now: `NOISE_INTERRUPTION_REACTION` — **3 noise cancels within
  3 minutes, fires once per session.** (Memo: "3-4 within N minutes"; 3-in-3min
  keeps it responsive in genuinely noisy rooms while making a false-positive-only
  trigger unlikely.)
- Future reactions = add a rule + call `recordReactionEvent` at the trigger site;
  the delivery below is shared.

### Delivery (one-time spoken suggestion)

Mirror of the proven student-marks idle-send:

- On fire, stash the rule's directive in `pendingReactionDirectiveRef` and arm a 4s
  timer.
- Timer body: if busy (`productionStateRef === 'speaking'` || `brainBusyRef` ||
  `perceptionMidUtteranceRef` || `awaitingDispatchTimerRef` || `studentTypingRef`)
  → re-arm; else dispatch the directive via
  `handleStudentTranscriptForBrain(directive, { silent: true })`.
- `silent: true` = no student chat bubble (same as `[start lesson]` /
  `[Session-resumed…]`); the tutor's spoken response appears as a normal tutor turn,
  so the suggestion is voiced AND lands in the transcript record.
- Why idle-send rather than attach-to-next-turn: noise cancels happen while the
  tutor monologues; the next natural student turn may be minutes away, and a
  directive can't attach mid-turn. Idle-send delivers at the next quiet beat.

### Directive wording (generic — feedback_generic_prompts)

> [System note: background sounds have repeatedly interrupted this session in the
> last few minutes. In one or two kind sentences, let the student know there seems
> to be noise in their background that keeps interrupting you, and suggest they
> either reduce the background noise or mute the mic and type instead. Do not scold
> or dwell on it. Then continue from where you left off.]

No subject-specific content; brain phrases it in-persona.

### Flag

`TUTOR_NOISE_NAG` in `src/lib/tutor/orchestrator/flags.ts` — **default ON**, kill
switch `NEXT_PUBLIC_TUTOR_NOISE_NAG=off` (TUTOR_RENDER_SYNC pattern). Low risk: the
trigger needs 3 real cancels in 3 minutes; worst-case false fire is one polite
sentence.

### Telemetry

`onDebugEvent('noise_nag_armed', …)` at threshold crossing;
`onDebugEvent('noise_nag_sent', …)` at dispatch. Both visible in the admin
recordings debug stream.

## What this does NOT change

- No perception-layer classification changes; no cancel/resume behavior changes.
- No BASE_PROMPT change (zero token cost when the situation never occurs).
- No server/API changes — client orchestrator + one pure module only.

## Testing

- `scripts/test-tutor-reactions.ts` (`npm run test:tutor-reactions`): threshold
  crossing, sliding-window pruning, once-per-session, post-fire event clearing,
  independent states.
- Type-check + existing tutor gates unaffected (no shared code touched).
- Live verify (needs a real noisy session or `__tutorForceFalseBargein()` ×3 within
  3 min): expect `noise_nag_armed` → quiet beat → tutor speaks the suggestion once,
  never again that session.
