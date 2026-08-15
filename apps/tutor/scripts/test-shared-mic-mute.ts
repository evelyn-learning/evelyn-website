/**
 * Unit tests for the shared-mic per-consumer mute-intent resolution
 * (round-6 fix, 2026-07-28 — the mute-grace regression from round-5a).
 *
 * The bug: `muteInput()` hardware-disabled the shared capture for every
 * consumer, and Ink2's software `setMuted(false)` could not undo it — so the
 * mute-grace window ("perception listens briefly to capture the in-flight
 * utterance, then mutes") heard nothing. The track must go hardware-off only
 * once EVERY consumer with an expressed intent is muted.
 *
 * Run: npm run test:shared-mic
 */
import { resolveSharedMicEnabled } from '../src/lib/tutor/voice/shared-mic';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

// Fresh capture, nobody has expressed an intent yet → live (pre-fix default).
check('no expressed intents → enabled', resolveSharedMicEnabled([]) === true);

// THE mute-grace window (the regression this fix closes): the student hit
// mute mid-utterance — production WS registers muted, but the start-gate is
// holding Ink2 unmuted for the grace period so the VAD can commit the tail.
check('grace window: prod muted + ink2 listening → enabled',
  resolveSharedMicEnabled([true, false]) === true);

// Grace expired: the start-gate applied Ink2's mute → now truly silent.
check('post-grace: both muted → disabled',
  resolveSharedMicEnabled([true, true]) === false);

// Pre-start: Ink2 is start-gate-muted and the production WS hasn't
// startListening()'d yet (no intent) → the mic must not be hot.
check('pre-start: only ink2 intent, muted → disabled',
  resolveSharedMicEnabled([true]) === false);

// Normal listening: both consumers live.
check('mid-session: both unmuted → enabled',
  resolveSharedMicEnabled([false, false]) === true);

// Unmute round-trip: startListening withdraws the production mute first;
// the track must come back even before the start-gate unmutes Ink2.
check('unmute: prod unmuted + ink2 still muted → enabled',
  resolveSharedMicEnabled([false, true]) === true);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
