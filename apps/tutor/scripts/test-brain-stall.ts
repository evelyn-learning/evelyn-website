/**
 * Unit test for the brain-stream stall guard
 * (src/lib/tutor/voice/brain-stall.ts).
 *
 * Why it exists (R49, 2026-08-20, session portal-2d53e403): the brain fetch
 * at VoiceTutorRealtime's callBrainOnce carries an AbortController used ONLY
 * by the perception layer for barge-in cancellation — there is no request or
 * stream timeout anywhere on that path. One call ran 125143ms
 * (`brain_turn Brain 125143ms`). The student answered at 159.6s and again at
 * 193.4s (both `perception_direct_dispatch`, neither reaching a transcript
 * entry) and sat in 78 SECONDS of dead air before the 90s
 * `brain_watchdog_reset` requeued them as one joined turn. The watchdog only
 * frees the busy flag; it never aborts the wedged fetch.
 *
 * Run: npx tsx scripts/test-brain-stall.ts  (npm run test:brain-stall)
 * No framework — matches test:render-sync / test:idle-nudge. Pure.
 */

import { strict as assert } from 'node:assert';
import {
  shouldAbortStalledBrain,
  BRAIN_STALL_PRE_AUDIO_MS,
  BRAIN_STALL_MID_TURN_MS,
} from '../src/lib/tutor/voice/brain-stall';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const base = { enabled: true, spokeAnySentence: false, alreadyAborted: false };

// ── flag ────────────────────────────────────────────────────────────────
test('flag off ⇒ never aborts, however long the stall', () => {
  assert.equal(shouldAbortStalledBrain({ ...base, enabled: false, msSinceLastFrame: 999_999 }), false);
});

// ── pre-audio: the student is sitting in silence ────────────────────────
test('pre-audio stall under the window is tolerated', () => {
  assert.equal(shouldAbortStalledBrain({ ...base, msSinceLastFrame: BRAIN_STALL_PRE_AUDIO_MS - 1 }), false);
});
test('pre-audio stall at the window aborts', () => {
  assert.equal(shouldAbortStalledBrain({ ...base, msSinceLastFrame: BRAIN_STALL_PRE_AUDIO_MS }), true);
});
test('pre-audio window is comfortably under the 90s watchdog it exists to pre-empt', () => {
  assert.ok(BRAIN_STALL_PRE_AUDIO_MS < 90_000 / 2,
    'must fire well before brain_watchdog_reset, or it changes nothing');
});

// ── mid-turn: audio is already playing, a cut is worse than a wait ──────
test('mid-turn uses the longer window — a stall behind playing audio is not dead air', () => {
  assert.ok(BRAIN_STALL_MID_TURN_MS > BRAIN_STALL_PRE_AUDIO_MS);
  assert.equal(
    shouldAbortStalledBrain({ ...base, spokeAnySentence: true, msSinceLastFrame: BRAIN_STALL_PRE_AUDIO_MS + 1 }),
    false, 'the pre-audio window must not cut a turn that is mid-delivery');
});
test('mid-turn stall past its own window still aborts', () => {
  assert.equal(
    shouldAbortStalledBrain({ ...base, spokeAnySentence: true, msSinceLastFrame: BRAIN_STALL_MID_TURN_MS }),
    true);
});

// ── never fight the perception layer ────────────────────────────────────
test('an already-aborted call is never re-aborted (perception barge-in owns that signal)', () => {
  assert.equal(
    shouldAbortStalledBrain({ ...base, alreadyAborted: true, msSinceLastFrame: 999_999 }),
    false, 'a student barge-in abort must not be reported as a stall');
});

// ── 2026-10-20 (GAC Geometry upload portal-4cc98574, 23:04:31Z) ──────────
// The cover layer's 45 s give-up aborted a turn the stall guard never caught
// (keepalive frames kept arriving). That abort was filed as a perception
// cancel — silent — and the give-up's reset line was SPOKEN into a typed
// session: nothing shown for 83 s. The give-up now only aborts, and the catch
// treats it as a stall: retry once, then the apology where the student looks.
{
  const fs = require('node:fs') as typeof import('node:fs');
  const path = require('node:path') as typeof import('node:path');
  const src = fs.readFileSync(path.join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  test('the 45 s give-up no longer speaks a reset line of its own', () => {
    assert.equal(src.includes("I lost my thread. Say that once more"), false);
  });
  test('the give-up abort is a stall to the catch: opener retry and stall recovery both see it', () => {
    assert.match(src, /const stalledOrGaveUp = stallState\.stalled \|\| gaveUp;/);
    assert.match(src, /shouldRetryStalledOpener\(\{\s*stalled: stalledOrGaveUp,/);
    assert.match(src, /decideStallRecovery\(\{\s*stalled: stalledOrGaveUp,/);
    assert.equal(src.includes('cover_giveup_abort_swallowed'), false, 'the swallow branch that pre-empted stall recovery is gone');
  });
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
