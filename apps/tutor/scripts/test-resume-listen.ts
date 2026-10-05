// scripts/test-resume-listen.ts
// Run: npx tsx scripts/test-resume-listen.ts
import { strict as assert } from 'node:assert';
import {
  shouldStartListeningOnSessionStart,
  shouldLatchStartOnTypedSubmit,
  resolveTypedFirstMicTap,
  TYPED_FIRST_SAME_GESTURE_MS,
  shouldStartListeningOnGestureStart,
} from '../src/lib/tutor/session/resume-listen';

// Voice session, mic not muted ⇒ the resume gesture opens the recorder,
// exactly like the normal Start tap.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'voice', micMuted: false }),
  { start: true, reason: 'ok' },
);

// Muted before resuming ⇒ honour the mute; the unmute path opens the mic.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'voice', micMuted: true }),
  { start: false, reason: 'muted' },
);

// Text mode must never touch the mic — and that wins over everything else.
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'text', micMuted: false }),
  { start: false, reason: 'text-mode' },
);
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: true, sessionMode: 'text', micMuted: true }),
  { start: false, reason: 'text-mode' },
);

// Kill switch off ⇒ the pre-fix behaviour (resume never opens the recorder).
assert.deepEqual(
  shouldStartListeningOnSessionStart({ enabled: false, sessionMode: 'voice', micMuted: false }),
  { start: false, reason: 'flag-off' },
);

// ── Typed-first start in a VOICE session (2026-10-03) ───────────────────
// A student who opens a voice session by typing in the in-session composer:
// the submit did not latch hasStarted, the composer's focus had muted the
// hook (userMutedRef), blur only re-opens the mic once hasStarted is true —
// so the recorder stayed off, and the eventual mic tap resolved to 'start'
// and sent a SECOND [start lesson].
let typedCases = 0;
const eq = (got: unknown, want: unknown) => { assert.deepEqual(got, want); typedCases++; };

// The typed first message latches the start…
eq(shouldLatchStartOnTypedSubmit({ enabled: true, sessionMode: 'voice', hasStarted: false, hasResumeState: false }),
  { latch: true, reason: 'ok' });
// …once: a later typed message in a started session is not a start.
eq(shouldLatchStartOnTypedSubmit({ enabled: true, sessionMode: 'voice', hasStarted: true, hasResumeState: false }),
  { latch: false, reason: 'already-started' });
// A rehydrated session keeps its dedicated resumeContinue gesture.
eq(shouldLatchStartOnTypedSubmit({ enabled: true, sessionMode: 'voice', hasStarted: false, hasResumeState: true }),
  { latch: false, reason: 'resume' });
// Text mode has its own (existing) latch and no mic — this rule stays out.
eq(shouldLatchStartOnTypedSubmit({ enabled: true, sessionMode: 'text', hasStarted: false, hasResumeState: false }),
  { latch: false, reason: 'text-mode' });
// Kill switch off ⇒ pre-fix behaviour (no latch).
eq(shouldLatchStartOnTypedSubmit({ enabled: false, sessionMode: 'voice', hasStarted: false, hasResumeState: false }),
  { latch: false, reason: 'flag-off' });

// The next mic tap after a typed-first start OPENS THE MIC — it is never a
// start (no second [start lesson]) and never a stop toggle, whatever state
// the relay happens to be in (the composer's blur may already have put it in
// 'listening' a few ms before the click lands).
const tap = { enabled: true, sessionMode: 'voice' as const, hasStarted: true, typedFirstTapPending: true, micMuted: false };
eq(resolveTypedFirstMicTap(tap), { action: 'open-mic', reason: 'typed-first' });
// Explicitly muted ⇒ the tap neither starts the lesson again nor overrides
// the mute (the Mute button's unmute branch opens the mic).
eq(resolveTypedFirstMicTap({ ...tap, micMuted: true }), { action: 'stay-muted', reason: 'muted' });
// Not a typed-first session, or the first tap already handled ⇒ the
// ordinary tap rule (resolveStartTap) decides.
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false }), { action: 'defer', reason: 'not-typed-first' });
// Typed-first pending but the latch never took (flag flipped / resume) ⇒
// defer: the ordinary rule's pre-start invariant still owns it.
eq(resolveTypedFirstMicTap({ ...tap, hasStarted: false }), { action: 'defer', reason: 'not-started' });
// Text mode: no mic at all.
eq(resolveTypedFirstMicTap({ ...tap, sessionMode: 'text' }), { action: 'defer', reason: 'text-mode' });
eq(resolveTypedFirstMicTap({ ...tap, sessionMode: 'text', micMuted: true }), { action: 'defer', reason: 'text-mode' });
// Kill switch off ⇒ defer (pre-fix behaviour).
eq(resolveTypedFirstMicTap({ ...tap, enabled: false }), { action: 'defer', reason: 'flag-off' });


// ── 2026-10-04: the pending tap must not outlive the mic opening ─────────
// (a) Muted: 'stay-muted' tells the caller to CLEAR the pending state and
//     hand the tap to the ordinary rule — it used to return without
//     clearing, so every later orb tap was swallowed here (tap-to-interrupt
//     dead until the student unmuted and tapped once).
{
  const muted = resolveTypedFirstMicTap({ ...tap, micMuted: true });
  eq(muted, { action: 'stay-muted', reason: 'muted' });
  // …and once cleared, the next tap (still muted) is the ordinary rule's.
  eq(resolveTypedFirstMicTap({ ...tap, micMuted: true, typedFirstTapPending: false }), { action: 'defer', reason: 'not-typed-first' });
}
// (b) The composer's blur already opened the mic and cleared the pending
//     state. The click that CAUSED the blur lands a few ms later: same
//     gesture ⇒ ignored (it must not toggle the just-opened mic off).
eq(TYPED_FIRST_SAME_GESTURE_MS, 500);
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: 0 }), { action: 'ignore', reason: 'same-gesture' });
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: 40 }), { action: 'ignore', reason: 'same-gesture' });
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: 499 }), { action: 'ignore', reason: 'same-gesture' });
//     A tap minutes later is an ordinary tap (interrupt / stop listening).
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: 500 }), { action: 'defer', reason: 'not-typed-first' });
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: 180_000 }), { action: 'defer', reason: 'not-typed-first' });
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: null }), { action: 'defer', reason: 'not-typed-first' });
//     Junk timings never ignore a tap.
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: -5 }), { action: 'defer', reason: 'not-typed-first' });
eq(resolveTypedFirstMicTap({ ...tap, typedFirstTapPending: false, sinceBlurOpenedMicMs: Number.NaN }), { action: 'defer', reason: 'not-typed-first' });
//     The same-gesture window never applies in text mode / flag off, and a
//     still-pending tap is decided as before whatever the timing says.
eq(resolveTypedFirstMicTap({ ...tap, sessionMode: 'text', typedFirstTapPending: false, sinceBlurOpenedMicMs: 10 }), { action: 'defer', reason: 'text-mode' });
eq(resolveTypedFirstMicTap({ ...tap, enabled: false, typedFirstTapPending: false, sinceBlurOpenedMicMs: 10 }), { action: 'defer', reason: 'flag-off' });
eq(resolveTypedFirstMicTap({ ...tap, sinceBlurOpenedMicMs: 10 }), { action: 'open-mic', reason: 'typed-first' });

// ── gesture-first start (2026-10-04): upload as the FIRST gesture ──────────
let gestureCases = 0;
{
  const g = {
    enabled: true, sessionMode: 'voice' as 'voice' | 'text', micMuted: false,
    startLatchedNow: true, composerFocused: false, alreadyOpened: false,
  };
  const t = (over: Partial<typeof g>, want: { start: boolean; reason: string }) => {
    assert.deepEqual(shouldStartListeningOnGestureStart({ ...g, ...over }), want);
    gestureCases++;
  };
  // The live case: upload first, voice mode, not muted ⇒ open the mic.
  t({}, { start: true, reason: 'ok' });
  t({ micMuted: true }, { start: false, reason: 'muted' });
  t({ sessionMode: 'text' }, { start: false, reason: 'text-mode' });
  t({ sessionMode: 'text', startLatchedNow: false }, { start: false, reason: 'text-mode' });
  t({ enabled: false }, { start: false, reason: 'flag-off' });
  // Every later send runs the same helper — never a second open.
  t({ startLatchedNow: false }, { start: false, reason: 'not-a-start' });
  t({ alreadyOpened: true }, { start: false, reason: 'already-opened' });
  // Composer focused: its focus muted the mic; its blur re-opens it.
  t({ composerFocused: true }, { start: false, reason: 'typing' });
  // Mute outranks the softer guards.
  t({ micMuted: true, composerFocused: true }, { start: false, reason: 'muted' });
}

console.log(`resume-listen: 5 cases passed; typed-first: ${typedCases} cases passed; gesture-start: ${gestureCases} cases passed`);
