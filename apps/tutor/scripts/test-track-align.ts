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
import { buildAlignedChunks, resolveRecorderOrigin, STALE_ORIGIN_MS, type TimedChunk } from '../src/lib/tutor/recordings/track-align';
import { attemptsFromAnchors, nextAttemptAnchors, wallToAudioMs, type AttemptAnchor } from '../src/lib/tutor/recordings/attempt-anchors';

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

// ── Resumed mounts (2026-10-03): recorder origin + per-attempt anchors ────
// A resumed mount is a NEW recorder (counter back at 0) appending to the
// file the first mount wrote. Simulate recorder → server → replay end to end
// and require every chunk to be found at its true wall time.
{
  const T0 = 1_790_000_000_000; // session startedAt (epoch ms)
  check('origin: a fresh session keeps startedAt as T0', resolveRecorderOrigin(T0, T0 + 900) === T0);
  check('origin: no startedAt ⇒ 0 (first-chunk-wins fallback, unchanged)', resolveRecorderOrigin(undefined, T0) === 0);
  check('origin: just under the stale threshold is still a start',
    resolveRecorderOrigin(T0, T0 + STALE_ORIGIN_MS) === T0);
  // A resumed page hands the new recorder the ORIGINAL startedAt 30 min on:
  // padding from it would put 30 min of zeros in the first upload.
  const mount2 = T0 + 30 * 60_000;
  check('origin: a stale startedAt is re-seeded to the mount time', resolveRecorderOrigin(T0, mount2) === mount2);

  // The "file" on the server, plus the sidecar anchors, for one track.
  let file: Float32Array[] = [];
  let anchors: AttemptAnchor[] = [];
  const fileSamples = () => totalSamples(file);
  // One recorder attempt: flushes are (chunks, ok?) — a rejected flush rolls
  // the counter back exactly like useAudioRecorder does.
  // `lostResponse`: the server DID append the chunk but the client saw the
  // request fail (timeout / dropped response) — it rolls back all the same.
  function runAttempt(originMs: number, flushes: Array<{ chunks: TimedChunk[]; rejected?: boolean; lostResponse?: boolean }>, minGap: number) {
    let written = 0;
    for (const f of flushes) {
      const before = written;
      const r = buildAlignedChunks(f.chunks, written, RATE, minGap);
      if (f.rejected) continue; // POST failed: nothing appended, counter stays at `before`
      const next = nextAttemptAnchors(anchors, { attemptStartMs: originMs, attemptBytesBefore: before * 2, fileBytes: fileSamples() * 2 });
      if (next) anchors = next;
      file = file.concat(r.aligned);
      if (f.lostResponse) continue; // appended, but the client's counter stays at `before`
      written = r.samplesWritten;
    }
  }
  // Read `n` samples of the file at the audio offset the replay map gives for
  // wall time `wallMs` — must be the marker value the chunk was filled with.
  function sampleAtWall(wallMs: number): number | null {
    const at = wallToAudioMs(attemptsFromAnchors(anchors, T0, RATE), wallMs);
    if (at === null) return null;
    let idx = Math.round((at / 1000) * RATE);
    for (const a of file) { if (idx < a.length) return a[idx]; idx -= a.length; }
    return null;
  }

  // Attempt 1: speech at 2s (0.1) and 20s (0.2), then the page reloads at 60s
  // — the track's audio ends at 21s, well short of the attempt's wall span.
  runAttempt(T0, [{ chunks: [chunk(2000, RATE, 0.1)] }, { chunks: [chunk(20_000, RATE, 0.2)] }], 0);
  check('resume: attempt 1 anchored at byte 0', anchors.length === 1 && anchors[0].byteOffset === 0);
  // Attempt 2: mounted 90s in (origin re-anchored there, as the embed does).
  // Its first flush is REJECTED; the second carries speech at +5s (0.3), a
  // third at +40s (0.4).
  const origin2 = T0 + 90_000;
  const eof1 = fileSamples();
  runAttempt(origin2, [
    { chunks: [chunk(1000, RATE, 0.9)], rejected: true },
    { chunks: [chunk(5000, RATE, 0.3)] },
    { chunks: [chunk(40_000, RATE, 0.4)] },
  ], 0);
  check('resume: attempt 2 anchored at the old end of file despite a rejected first chunk',
    anchors.length === 2 && anchors[1].byteOffset === eof1 * 2 && anchors[1].wallStartMs === origin2,
    JSON.stringify(anchors));
  check('resume: attempt-2 counter restarted at 0 (file = attempt 1 + 41s)', fileSamples() === eof1 + 41 * RATE);
  check('resume: attempt-1 audio found at its wall time', Math.abs((sampleAtWall(2500) ?? 0) - 0.1) < 1e-6);
  check('resume: attempt-1 later audio found at its wall time', Math.abs((sampleAtWall(20_500) ?? 0) - 0.2) < 1e-6);
  check('resume: nothing plays between the attempts', sampleAtWall(45_000) === null && sampleAtWall(89_000) === null);
  check('resume: attempt-2 audio found at its wall time (not 69s early)', Math.abs((sampleAtWall(95_500) ?? 0) - 0.3) < 1e-6,
    `got ${sampleAtWall(95_500)}`);
  check('resume: attempt-2 later audio found at its wall time', Math.abs((sampleAtWall(130_500) ?? 0) - 0.4) < 1e-6);
  check('resume: attempt-2 leading silence is silence', sampleAtWall(92_000) === 0);

  // Lost response (review 2026-10-03): the chunk carrying speech at 20s is
  // appended but the client rolls back, so the next chunk reports a
  // bytes-before one chunk short. That must NOT mint a second same-origin
  // anchor — it used to hand the real attempt only the first chunk-length of
  // wall time and shift everything else before the hiccup.
  file = []; anchors = [];
  runAttempt(T0, [
    { chunks: [chunk(2000, RATE, 0.1)] },
    { chunks: [chunk(20_000, RATE, 0.2)], lostResponse: true },
    { chunks: [chunk(40_000, RATE, 0.4)] },
  ], 0);
  check('lost response: still exactly one anchor, at byte 0',
    anchors.length === 1 && anchors[0].byteOffset === 0 && anchors[0].wallStartMs === T0, JSON.stringify(anchors));
  check('lost response: audio before the hiccup found at its wall time', Math.abs((sampleAtWall(2500) ?? 0) - 0.1) < 1e-6,
    `got ${sampleAtWall(2500)}`);
  check('lost response: the appended chunk itself found at its wall time', Math.abs((sampleAtWall(20_500) ?? 0) - 0.2) < 1e-6,
    `got ${sampleAtWall(20_500)}`);
}

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nOK — track-align invariants validated');
