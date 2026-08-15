/**
 * Pins buildAlignedChunks (src/lib/tutor/recordings/track-align.ts) — the
 * wall-clock alignment both recorded tracks flush through.
 *
 * Regression under test (session-1784194326500, 2026-07-19): the student
 * track concatenated mic chunks with no interior gap fill, so stop-listening
 * / reconnect windows collapsed out of the file (50.8s of a 65s session) and
 * replay played every later student utterance early — the tutor audibly
 * talked over the student. Tutor-track semantics (fill any positive gap)
 * must stay byte-identical.
 *
 * Run: npx tsx scripts/test-track-align.ts
 */
import { buildAlignedChunks, type TimedChunk } from '../src/lib/tutor/recordings/track-align';

const RATE = 24000;
const STUDENT_MIN_GAP = Math.floor(0.5 * RATE); // mirrors useAudioRecorder

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { console.log(`  ok  ${name}`); }
  else { failures++; console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`); }
}
function chunk(offsetMs: number, samples: number, fill = 0.5): TimedChunk {
  const data = new Float32Array(samples).fill(fill);
  return { data, offsetMs };
}
function totalSamples(arrs: Float32Array[]): number {
  return arrs.reduce((n, a) => n + a.length, 0);
}

// ── Tutor semantics (minGap 0): every positive gap filled ────────────────
{
  const chunks = [chunk(1000, 2400), chunk(2000, 2400)];
  const r = buildAlignedChunks(chunks, 0, RATE, 0);
  // 24000 silence + 2400 audio + (48000-26400) silence + 2400 audio
  check('tutor: leading gap filled to offset', r.aligned[0].length === 24000);
  check('tutor: interior gap filled', totalSamples(r.aligned) === 48000 + 2400);
  check('tutor: samplesWritten advances', r.samplesWritten === 50400);
}
{
  // Late/overlapping chunk (negative gap): appended, never trimmed
  const r = buildAlignedChunks([chunk(0, 4800), chunk(100, 2400)], 0, RATE, 0);
  check('tutor: negative gap appends without silence', totalSamples(r.aligned) === 7200);
}

// ── Student semantics (minGap 0.5s): jitter ignored, real holes filled ───
{
  // Continuous ~170ms chunks with ±30ms jitter — must stay contiguous.
  const chunks: TimedChunk[] = [];
  for (let i = 0; i < 10; i++) chunks.push(chunk(i * 170 + (i % 2 ? 30 : 0), 4096));
  const r = buildAlignedChunks(chunks, 0, RATE, STUDENT_MIN_GAP);
  check('student: jitter gaps not filled', totalSamples(r.aligned) === 40960,
    `got ${totalSamples(r.aligned)}`);
}
{
  // The bug: a 5s stop-listening hole mid-session MUST become silence.
  const before = chunk(0, 24000); // 1s of speech at t=0
  const after = chunk(6000, 24000); // next capture at t=6s
  const r = buildAlignedChunks([before, after], 0, RATE, STUDENT_MIN_GAP);
  const silence = totalSamples(r.aligned) - 48000;
  check('student: real capture hole filled', silence === 5 * RATE, `silence=${silence}`);
  // The after-chunk must start at its true wall offset
  check('student: post-hole chunk lands at wall offset', r.samplesWritten === 6 * RATE + 24000);
}
{
  // Leading silence (mic permission delay) comes from the same gap logic.
  const r = buildAlignedChunks([chunk(3000, 4096)], 0, RATE, STUDENT_MIN_GAP);
  check('student: leading gap filled', r.aligned[0].length === 3 * RATE);
}
{
  // Counter must persist across flushes: second flush sees prior samplesWritten.
  const f1 = buildAlignedChunks([chunk(0, 24000)], 0, RATE, STUDENT_MIN_GAP);
  const f2 = buildAlignedChunks([chunk(4000, 24000)], f1.samplesWritten, RATE, STUDENT_MIN_GAP);
  check('student: cross-flush gap filled', totalSamples(f2.aligned) === 3 * RATE + 24000);
}

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nOK — track-align invariants validated');
