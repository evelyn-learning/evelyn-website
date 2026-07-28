/**
 * STAGE-2 no-verdict timeout-RESTORE (round-28, live 2026-07-18, session
 * portal-f31017f0).
 *
 * Incident: the student said a few words while the tutor was 'processing' →
 * STAGE-2 cancel aborted the in-flight brain turn, but the interrupting
 * utterance never resolved to a transcript, so no perception verdict ever
 * ran, RESTORE never re-fired, and the tutor sat silent for 38s until the
 * student spoke again ("stale checkpoint cleared by watchdog (age=68669ms)").
 * The opening-turn variant of this class was fixed earlier by suppressing
 * cancels pre-first-turn (VoiceTutorRealtime.tsx ~793); mid-session had no
 * recovery.
 *
 * `decideStage2TimeoutRestore` is the pure verdict for the recovery timer:
 *   'restore' → re-fire the original transcript now
 *   'defer'   → student is (still) mid-utterance; re-arm and check again
 *   'drop'    → checkpoint resolved / turn delivered / out of scope — do nothing
 *
 * Run: npx tsx scripts/test-stage2-restore.ts
 */
import { decideStage2TimeoutRestore, STAGE2_NO_VERDICT_RESTORE_MS } from '../src/lib/tutor/voice/stage2-restore';

let failures = 0;
function check(name: string, actual: string, expected: string) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

const base = {
  checkpointActive: true,
  cancelledDuringState: 'processing' as const,
  brainWasInFlight: true,
  brainTurnAborted: true,
  midUtterance: false,
  newBrainCallInFlight: false,
  ageMs: STAGE2_NO_VERDICT_RESTORE_MS + 100,
};

// The live incident shape: aborted mid-processing, utterance evaporated,
// nothing dispatched since → restore.
check('incident shape (aborted in processing, no verdict, quiet mic) → restore',
  decideStage2TimeoutRestore(base), 'restore');

// Verdict already resolved the checkpoint → nothing to do.
check('checkpoint no longer active → drop',
  decideStage2TimeoutRestore({ ...base, checkpointActive: false }), 'drop');

// A real student turn already dispatched (new brain call running) — the
// stall self-resolved; re-firing would duplicate.
check('new brain call in flight → drop',
  decideStage2TimeoutRestore({ ...base, newBrainCallInFlight: true }), 'drop');

// Student is still talking — their transcript will resolve the checkpoint
// (or the mid-utterance watchdog clears in 30s). Check again later.
check('student mid-utterance → defer',
  decideStage2TimeoutRestore({ ...base, midUtterance: true }), 'defer');

// Timer fired early somehow → wait out the full window.
check('age below the window → defer',
  decideStage2TimeoutRestore({ ...base, ageMs: 1_000 }), 'defer');

// Round-6c (portal-28ee6557): a 'speaking' cancel with NO unplayed snapshot
// but a genuinely aborted in-flight brain (this base) now RESTORES — the
// cancel cut a response whose emitted sentences were already dispatched to
// TTS (queue empty) while the rest was still streaming; dropping swallowed
// the whole turn (27s dead air observed). Pre-R32 this shape was "out of
// scope"; R32 added resume-tts for snapshot-bearing cancels; this closes
// the empty-snapshot corner.
check("stage-3 'speaking' cancel, aborted brain, no snapshot → restore",
  decideStage2TimeoutRestore({ ...base, cancelledDuringState: 'speaking' }), 'restore');

// Mirrors the RESTORE-after-finished guard: if the brain wasn't genuinely
// cut off, the answer was already delivered — re-firing would duplicate it.
check('brain was not in flight at cancel → drop',
  decideStage2TimeoutRestore({ ...base, brainWasInFlight: false }), 'drop');
check('brain stream finished before the abort landed → drop',
  decideStage2TimeoutRestore({ ...base, brainTurnAborted: false }), 'drop');

// Stale-beyond-reason checkpoint (the next-turn watchdog owns cleanup).
check('very stale checkpoint (>60s) → drop',
  decideStage2TimeoutRestore({ ...base, ageMs: 61_000 }), 'drop');

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll stage2-restore checks passed.');
