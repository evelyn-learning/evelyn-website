import { decideStage2TimeoutRestore } from '../src/lib/tutor/voice/stage2-restore';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}
const base = {
  cancelledDuringState: 'speaking' as const,
  brainWasInFlight: false,
  brainTurnAborted: false,
  ageMs: 8_000,
  timeoutMs: 7_000,
  midUtterance: false,
  hasUnplayedSnapshot: true,
};
// R32: a 'speaking' cancel whose interrupting sound never transcribes used to
// dangle forever (silence audit H3). Timed out + unplayed sentences → resume.
check('speaking-timeout-resumes', decideStage2TimeoutRestore(base) === 'resume-tts');
check('speaking-no-snapshot-drops', decideStage2TimeoutRestore({ ...base, hasUnplayedSnapshot: false }) === 'drop');
// Round-6c (portal-28ee6557): same shape but the brain was genuinely cut
// mid-stream (in flight + aborted) → the turn was never delivered; restore.
check('speaking-no-snapshot-aborted-brain-restores', decideStage2TimeoutRestore({
  ...base, hasUnplayedSnapshot: false, brainWasInFlight: true, brainTurnAborted: true,
}) === 'restore');
// …but not while the student is talking (defer), and not before the window.
check('speaking-no-snapshot-aborted-mid-utterance-defers', decideStage2TimeoutRestore({
  ...base, hasUnplayedSnapshot: false, brainWasInFlight: true, brainTurnAborted: true, midUtterance: true,
}) === 'defer');
check('speaking-no-snapshot-aborted-young-defers', decideStage2TimeoutRestore({
  ...base, hasUnplayedSnapshot: false, brainWasInFlight: true, brainTurnAborted: true, ageMs: 3_000,
}) === 'defer');
// Completed turn (in flight but stream finished before the abort) stays drop.
check('speaking-no-snapshot-finished-brain-drops', decideStage2TimeoutRestore({
  ...base, hasUnplayedSnapshot: false, brainWasInFlight: true, brainTurnAborted: false,
}) === 'drop');
check('speaking-mid-utterance-defers', decideStage2TimeoutRestore({ ...base, midUtterance: true }) === 'defer');
check('speaking-young-defers', decideStage2TimeoutRestore({ ...base, ageMs: 3_000 }) === 'defer');
check('speaking-stale-drops', decideStage2TimeoutRestore({ ...base, ageMs: 61_000 }) === 'drop');
// Final-review Finding 1: a new brain turn already speaking means the
// stall self-resolved — replaying old unplayed sentences now would talk
// over it. Mirrors the 'processing' branch's own newBrainCallInFlight guard.
check('speaking-newBrainCallInFlight-drops', decideStage2TimeoutRestore({ ...base, newBrainCallInFlight: true }) === 'drop');
// existing 'processing' behavior unchanged
check('processing-restore-still-works', decideStage2TimeoutRestore({
  ...base, cancelledDuringState: 'processing', brainWasInFlight: true, brainTurnAborted: true,
}) === 'restore');
// Round-6d (portal-37c0e0bf): a 'processing' cancel in the inter-sentence
// gap kills TTS the brain already emitted — brain-done + queued snapshot
// must resume, not drop (the demo intro was cut to one sentence).
check('processing-brain-done-with-snapshot-resumes', decideStage2TimeoutRestore({
  ...base, cancelledDuringState: 'processing', brainWasInFlight: false, brainTurnAborted: false,
}) === 'resume-tts');
check('processing-brain-done-no-snapshot-drops', decideStage2TimeoutRestore({
  ...base, cancelledDuringState: 'processing', brainWasInFlight: false, brainTurnAborted: false, hasUnplayedSnapshot: false,
}) === 'drop');
check('processing-brain-done-with-snapshot-mid-utterance-defers', decideStage2TimeoutRestore({
  ...base, cancelledDuringState: 'processing', brainWasInFlight: false, brainTurnAborted: false, midUtterance: true,
}) === 'defer');

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all stage2-restore r32 checks passed');
