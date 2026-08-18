/**
 * Audio-finalize decision (2026-08-17 triage): the session-audio route's
 * finalize branch used to write {role}.meta.json and $set hasAudio:true
 * even when ZERO chunks had ever arrived — dead sessions (portal-96a436f0,
 * portal-a4f7499d, portal-d2b9a6ce) all showed hasAudio:true with no PCM
 * on disk (the admin "audio-flag-drift" warning). The rule: no bytes, no
 * flag, no meta.
 */
import { resolveAudioFinalize } from '../src/lib/tutor/recordings/finalize-audio';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log('resolveAudioFinalize');
check(
  'no pcm file → no meta, no hasAudio (the empty-beacon drift bug)',
  resolveAudioFinalize({ pcmBytes: null }),
  { writeMeta: false, markHasAudio: false },
);
check(
  'zero-byte pcm file → no meta, no hasAudio',
  resolveAudioFinalize({ pcmBytes: 0 }),
  { writeMeta: false, markHasAudio: false },
);
check(
  'real audio → meta + hasAudio',
  resolveAudioFinalize({ pcmBytes: 16_781_296 }),
  { writeMeta: true, markHasAudio: true },
);
check(
  'even a single sample counts as real audio',
  resolveAudioFinalize({ pcmBytes: 2 }),
  { writeMeta: true, markHasAudio: true },
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll finalize-audio checks passed.');
