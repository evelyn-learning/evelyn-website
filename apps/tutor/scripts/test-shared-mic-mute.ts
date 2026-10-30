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
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveSharedMicEnabled, submitDespiteMute, SUBMIT_AFTER_MUTE_MS } from '../src/lib/tutor/voice/shared-mic';

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

// Task 20 §H (GDI run 8): unmute 77.8 s, speech, mute 81.4 s, transcript 81.5 s.
check('H: speech began before the mute ⇒ submitted',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: 78_200, now: 81_500 }) === true);
check('H: speech began after the mute (ambient) ⇒ dropped',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: 82_000, now: 84_000 }) === false);
check('H: start unknown, transcript ≤ 1500 ms after the mute ⇒ submitted',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: undefined, now: 81_400 + SUBMIT_AFTER_MUTE_MS }) === true);
check('H: start unknown, transcript later than that ⇒ dropped',
  submitDespiteMute({ mutedAt: 81_400, speechStartedAt: undefined, now: 81_400 + SUBMIT_AFTER_MUTE_MS + 1 }) === false);
check('H: not muted by the student (null) ⇒ never',
  submitDespiteMute({ mutedAt: null, speechStartedAt: 1, now: 2 }) === false);
{
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  check('H: VTR stamps the mute and clears it on unmute',
    vtr.includes('micMutedAtRef.current = Date.now();') && vtr.includes('micMutedAtRef.current = null;'));
  check('H: VTR submits by timing through the perception_submit_on_mute branch',
    /submitDespiteMute\(\{ mutedAt: micMutedAtRef\.current[\s\S]{0,200}if \(submitPendingUtteranceRef\.current \|\| submitByTiming\)[\s\S]{0,600}'perception_submit_on_mute'/.test(vtr));
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
