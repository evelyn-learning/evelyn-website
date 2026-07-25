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

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all stage2-restore r32 checks passed');
