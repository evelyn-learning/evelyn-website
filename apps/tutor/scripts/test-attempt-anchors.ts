/**
 * Resumed-session recording/replay (2026-10-03).
 *
 * Pins, with the numbers from the production session that exposed the bug:
 *   attempt 1 wall 0–1754 s · remount at 1761.3 s · resume tap at 1764.5 s ·
 *   student file 1754.0 s · tutor file 2266.6 s · timeline end 2272.3 s ·
 *   `duration` = 511 s (latest attempt only)
 *
 *  - the per-attempt anchor bookkeeping the session-audio route runs
 *    (attempt-anchors.ts → nextAttemptAnchors),
 *  - the wall→audio map (wallToAudioMs) from anchors AND from the legacy
 *    debug-event derivation,
 *  - buildCompressedTimeline's attempt-mapped mode (audio wall-aligned inside
 *    an attempt, only the inter-attempt gap collapsed),
 *  - the real session span (session-span.ts) the inspector uses instead of
 *    `duration`.
 *
 *   npx tsx scripts/test-attempt-anchors.ts
 */
import assert from 'node:assert';
import {
  ANCHOR_MAX_AGE_MS,
  ANCHOR_MAX_FUTURE_MS,
  attemptsFromAnchors,
  createKeyedSerializer,
  deriveLegacyAttempts,
  deriveRemountOffsetsMs,
  nextAttemptAnchors,
  parseAttemptAnchors,
  saneAnchorParams,
  wallToAudioMs,
  type AttemptAnchor,
  type LegacyDebugEvent,
} from '../src/lib/tutor/recordings/attempt-anchors';
import { buildCompressedTimeline, GAP_CAP_MS } from '../src/lib/tutor/recordings/compressed-timeline';
import { parseAttemptSpans, resolveSessionSpan } from '../src/lib/tutor/recordings/session-span';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}
async function checkAsync(label: string, fn: () => Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}
const near = (actual: number | null, expected: number, tolMs: number, what: string) => {
  assert.ok(actual !== null && Math.abs(actual - expected) <= tolMs, `${what}: expected ${expected}±${tolMs}, got ${actual}`);
};

// ── The production session ─────────────────────────────────────────────────
const RATE = 24000;
const BYTES_PER_MS = (RATE * 2) / 1000;
const T0 = Date.parse('2026-10-01T15:00:00.000Z'); // session startedAt
const ATTEMPT1_END = 1_754_000;
const REMOUNT = 1_761_300;
const RESUME_TAP = 1_764_500;
const TIMELINE_END = 2_272_300;
const STUDENT_FILE_MS = 1_754_000;
const TUTOR_FILE_MS = 2_266_600;
const DURATION_MS = 511_000; // what the doc's `duration` says (attempt 2 only)

// Timeline items: irregular gaps inside each attempt — several far longer
// than the 8 s cap, which is exactly what the old resumed mode skipped while
// the audio still contained them.
function itemsBetween(fromMs: number, toMs: number): number[] {
  const out: number[] = [];
  const steps = [4_000, 11_000, 37_000, 6_500, 52_000, 9_000, 23_000];
  let t = fromMs;
  for (let i = 0; t < toMs; i++) { out.push(t); t += steps[i % steps.length]; }
  out.push(toMs);
  return out;
}
const attempt1Items = itemsBetween(0, ATTEMPT1_END);
const attempt2Items = itemsBetween(RESUME_TAP, TIMELINE_END);
const allItems = [...attempt1Items, REMOUNT, ...attempt2Items];
const events: LegacyDebugEvent[] = [
  { type: 'embed_config', message: 'practice_locator=no', offsetMs: 400 },
  { type: 'start_tap', message: 'action=start', offsetMs: 2_000 },
  { type: 'embed_config', message: 'practice_locator=no', offsetMs: REMOUNT },
  { type: 'start_tap', message: 'action=resume_continue', offsetMs: RESUME_TAP },
];

console.log('nextAttemptAnchors — server bookkeeping');

check('first chunk of a fresh recording anchors at byte 0', () => {
  assert.deepStrictEqual(
    nextAttemptAnchors([], { attemptStartMs: T0, attemptBytesBefore: 0, fileBytes: 0 }),
    [{ wallStartMs: T0, byteOffset: 0 }],
  );
});

check('later chunks of the same attempt change nothing', () => {
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: T0, attemptBytesBefore: 480_000, fileBytes: 480_000 }), null);
});

check('a resumed mount anchors at the existing end of file', () => {
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  const fileBytes = ATTEMPT1_END * BYTES_PER_MS;
  const next = nextAttemptAnchors(a, { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: 0, fileBytes });
  assert.deepStrictEqual(next, [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0 + REMOUNT, byteOffset: fileBytes }]);
});

check('a lost first chunk heals on the next one (anchor derivable from any chunk)', () => {
  // Chunk 0 of the resumed attempt was rejected: nothing appended, the client
  // rolled its counter back, so the next chunk still starts at the origin.
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  const next = nextAttemptAnchors(a, { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: 0, fileBytes: 1_000_000 });
  assert.deepStrictEqual(next?.[1], { wallStartMs: T0 + REMOUNT, byteOffset: 1_000_000 });
  // …and a sidecar write that failed on chunk 0 is recovered from chunk 1.
  const healed = nextAttemptAnchors(a, { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: 96_000, fileBytes: 1_096_000 });
  assert.deepStrictEqual(healed?.[1], { wallStartMs: T0 + REMOUNT, byteOffset: 1_000_000 });
});

check('recording over a legacy file (no anchors) anchors the new attempt only', () => {
  const next = nextAttemptAnchors([], { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: 0, fileBytes: 5_000 });
  assert.deepStrictEqual(next, [{ wallStartMs: T0 + REMOUNT, byteOffset: 5_000 }]);
});

check('old clients (no params) and stragglers from an older attempt mint nothing', () => {
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0 + REMOUNT, byteOffset: 1_000 }];
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: null, attemptBytesBefore: null, fileBytes: 2_000 }), null);
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: T0, attemptBytesBefore: 1_000, fileBytes: 2_500 }), null);
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: 9_999, fileBytes: 2_500 }), null);
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: NaN, attemptBytesBefore: 0, fileBytes: 2_500 }), null);
});

check('a lost-response duplicate chunk (server appended, client rolled back) mints no anchor', () => {
  // Chunk 1 (10 s = 480 000 bytes) was appended but the client saw the POST
  // fail and rolled its counter back, so chunk 2 reports before = 0 + chunk 0
  // only. fileBytes − before then points one chunk past the real origin, on
  // the SAME wall origin: that is NOT a new attempt.
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  const CHUNK = 480_000;
  assert.strictEqual(nextAttemptAnchors(a, { attemptStartMs: T0, attemptBytesBefore: CHUNK, fileBytes: 2 * CHUNK }), null);
  // Same thing inside a resumed attempt.
  const b: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0 + REMOUNT, byteOffset: 1_000_000 }];
  assert.strictEqual(nextAttemptAnchors(b, { attemptStartMs: T0 + REMOUNT, attemptBytesBefore: CHUNK, fileBytes: 1_000_000 + 2 * CHUNK }), null);
  // The map therefore stays exact before the hiccup (was: wall 20 s → audio 30 s).
  near(wallToAudioMs(attemptsFromAnchors(a, T0, RATE), 20_000), 20_000, 1, 'wall 20 s');
});

check('a genuine same-origin remount (before = 0, same T0, later in the file) still mints an anchor', () => {
  const a: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  assert.deepStrictEqual(
    nextAttemptAnchors(a, { attemptStartMs: T0, attemptBytesBefore: 0, fileBytes: 4_800_000 }),
    [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0, byteOffset: 4_800_000 }],
  );
});

console.log('\nsaneAnchorParams — bounds on the unauthenticated anchor params');

const NOW = T0 + 3_600_000; // server clock, one hour into the session
check('a normal chunk passes through unchanged', () => {
  assert.deepStrictEqual(
    saneAnchorParams({ attemptStartMs: T0, attemptBytesBefore: 480_000, fileBytes: 480_000, nowMs: NOW }),
    { attemptStartMs: T0, attemptBytesBefore: 480_000 },
  );
  // Modest client clock skew ahead of the server is tolerated…
  assert.ok(saneAnchorParams({ attemptStartMs: NOW + ANCHOR_MAX_FUTURE_MS, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }));
  // …as is a session resumed at the very edge of the resume window.
  assert.ok(saneAnchorParams({ attemptStartMs: NOW - ANCHOR_MAX_AGE_MS, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }));
});

check('old clients (no params) ⇒ null, i.e. exactly the legacy path', () => {
  assert.strictEqual(saneAnchorParams({ attemptStartMs: null, attemptBytesBefore: null, fileBytes: 100, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: T0, attemptBytesBefore: null, fileBytes: 100, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: null, attemptBytesBefore: 0, fileBytes: 100, nowMs: NOW }), null);
});

check('a far-future or impossibly old attemptStartMs is ignored', () => {
  assert.strictEqual(saneAnchorParams({ attemptStartMs: NOW + ANCHOR_MAX_FUTURE_MS + 1, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: 9_999_999_999_999, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: NOW - ANCHOR_MAX_AGE_MS - 1, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: 0, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }), null);
  assert.strictEqual(saneAnchorParams({ attemptStartMs: NaN, attemptBytesBefore: 0, fileBytes: 0, nowMs: NOW }), null);
});

check('attemptBytesBefore must be an even integer no larger than the file', () => {
  const p = { attemptStartMs: T0, fileBytes: 1_000, nowMs: NOW };
  assert.strictEqual(saneAnchorParams({ ...p, attemptBytesBefore: 1_002 }), null, 'past end of file');
  assert.strictEqual(saneAnchorParams({ ...p, attemptBytesBefore: 501 }), null, 'odd (PCM16 samples are 2 bytes)');
  assert.strictEqual(saneAnchorParams({ ...p, attemptBytesBefore: 500.5 }), null, 'fractional');
  assert.strictEqual(saneAnchorParams({ ...p, attemptBytesBefore: -2 }), null, 'negative');
  assert.strictEqual(saneAnchorParams({ ...p, attemptBytesBefore: Infinity }), null, 'non-finite');
  assert.ok(saneAnchorParams({ ...p, attemptBytesBefore: 1_000 }));
  assert.ok(saneAnchorParams({ ...p, attemptBytesBefore: 0 }));
});

check('THE POISONING (pinned): one far-future request no longer blocks every later real anchor', () => {
  let anchors: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];
  const apply = (attemptStartMs: number, attemptBytesBefore: number, fileBytes: number) => {
    const sane = saneAnchorParams({ attemptStartMs, attemptBytesBefore, fileBytes, nowMs: NOW });
    const next = nextAttemptAnchors(anchors, { attemptStartMs: sane?.attemptStartMs ?? null, attemptBytesBefore: sane?.attemptBytesBefore ?? null, fileBytes });
    if (next) anchors = next;
  };
  apply(T0 + 400 * 24 * 3_600_000, 0, 1_000_000); // forged: a year ahead
  assert.strictEqual(anchors.length, 1, 'forged anchor must not be recorded');
  apply(T0 + REMOUNT, 0, 1_200_000); // the real resumed attempt
  assert.deepStrictEqual(anchors[1], { wallStartMs: T0 + REMOUNT, byteOffset: 1_200_000 });
});

check('parseAttemptAnchors: old sidecars and corrupt data yield no anchors', () => {
  assert.deepStrictEqual(parseAttemptAnchors(undefined), []);
  assert.deepStrictEqual(parseAttemptAnchors([{ wallStartMs: 'x', byteOffset: 0 }]), []);
  assert.deepStrictEqual(parseAttemptAnchors([{ wallStartMs: 5, byteOffset: 10 }, { wallStartMs: 6, byteOffset: 10 }]), []);
  assert.deepStrictEqual(parseAttemptAnchors([{ wallStartMs: 5, byteOffset: 0, extra: 1 }]), [{ wallStartMs: 5, byteOffset: 0 }]);
});

console.log('\nwallToAudioMs — the map itself');

const tutorAnchors: AttemptAnchor[] = [
  { wallStartMs: T0, byteOffset: 0 },
  { wallStartMs: T0 + REMOUNT, byteOffset: ATTEMPT1_END * BYTES_PER_MS },
];
const studentAnchors: AttemptAnchor[] = [{ wallStartMs: T0, byteOffset: 0 }];

check('anchors: attempt-1 moments map to their wall offset; attempt-2 to 1754 s + (wall − anchor)', () => {
  const tutor = attemptsFromAnchors(tutorAnchors, T0, RATE);
  for (const w of attempt1Items.filter((v) => v < ATTEMPT1_END)) near(wallToAudioMs(tutor, w), w, 1, `tutor @${w}`);
  for (const w of attempt2Items) near(wallToAudioMs(tutor, w), ATTEMPT1_END + (w - REMOUNT), 1, `tutor @${w}`);
  // The tutor file's last sample lands 1.6 s past the last timeline item.
  near(wallToAudioMs(tutor, REMOUNT + (TUTOR_FILE_MS - ATTEMPT1_END)), TUTOR_FILE_MS, 1, 'tutor end of file');
});

check('anchors: the collapsed inter-attempt gap holds no audio', () => {
  const tutor = attemptsFromAnchors(tutorAnchors, T0, RATE);
  assert.strictEqual(wallToAudioMs(tutor, ATTEMPT1_END + 3_000), null);
  assert.strictEqual(wallToAudioMs(tutor, -5), null);
});

check('anchors: a first anchor past byte 0 implies a legacy attempt on the session origin', () => {
  const attempts = attemptsFromAnchors([{ wallStartMs: T0 + REMOUNT, byteOffset: ATTEMPT1_END * BYTES_PER_MS }], T0, RATE);
  assert.strictEqual(attempts.length, 2);
  near(wallToAudioMs(attempts, 60_000), 60_000, 1, 'implicit attempt 1');
  near(wallToAudioMs(attempts, REMOUNT + 10_000), ATTEMPT1_END + 10_000, 1, 'anchored attempt 2');
});

check('anchors: a same-origin remount (second attempt re-pads from the SAME T0) resolves by coverage', () => {
  // Attempt 2 kept attempt 1's origin and silence-padded from it, appended
  // at 100 s of file. Attempt 1 owns what it recorded; attempt 2 the rest.
  const attempts = attemptsFromAnchors([{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0, byteOffset: 100_000 * BYTES_PER_MS }], T0, RATE);
  near(wallToAudioMs(attempts, 40_000), 40_000, 1, 'attempt 1');
  near(wallToAudioMs(attempts, 400_000), 100_000 + 400_000, 1, 'attempt 2');
});

console.log('\nderiveLegacyAttempts — recordings without anchors');

check('remount found from embed_config; the resume tap inside it adds no second attempt', () => {
  assert.deepStrictEqual(deriveRemountOffsetsMs(events), [REMOUNT]);
});

check('a resume tap with no mount marker stands in for the mount', () => {
  const only = events.filter((e) => e.type !== 'embed_config');
  assert.deepStrictEqual(deriveRemountOffsetsMs(only), [RESUME_TAP]);
});

check('real numbers, tutor track: boundary at 1754 s, attempt 2 anchored at the remount', () => {
  const tutor = deriveLegacyAttempts({ events, itemOffsetsMs: allItems, fileMs: TUTOR_FILE_MS });
  assert.ok(tutor && tutor.length === 2);
  assert.deepStrictEqual(tutor[1], { wallStartMs: REMOUNT, audioStartMs: ATTEMPT1_END, wallEndMs: TIMELINE_END });
  for (const w of attempt1Items.filter((v) => v < ATTEMPT1_END)) near(wallToAudioMs(tutor, w), w, 1_000, `tutor @${w}`);
  for (const w of attempt2Items) near(wallToAudioMs(tutor, w), ATTEMPT1_END + (w - REMOUNT), 1_000, `tutor @${w}`);
});

check('real numbers, student track (no audio after the resume): attempt 2 points past the end of file, never into attempt 1', () => {
  const student = deriveLegacyAttempts({ events, itemOffsetsMs: allItems, fileMs: STUDENT_FILE_MS });
  assert.ok(student);
  for (const w of attempt1Items.filter((v) => v < ATTEMPT1_END)) near(wallToAudioMs(student, w), w, 1_000, `student @${w}`);
  for (const w of attempt2Items) {
    const a = wallToAudioMs(student, w);
    assert.ok(a !== null && a >= STUDENT_FILE_MS, `student @${w} mapped INTO the file (${a})`);
  }
});

check('no remount evidence, or a file the model cannot explain ⇒ null (caller keeps old behaviour)', () => {
  assert.strictEqual(deriveLegacyAttempts({ events: events.slice(0, 2), itemOffsetsMs: allItems, fileMs: TUTOR_FILE_MS }), null);
  // File far longer than "re-anchored at each mount" predicts.
  assert.strictEqual(deriveLegacyAttempts({ events, itemOffsetsMs: allItems, fileMs: TUTOR_FILE_MS + 600_000 }), null);
});

console.log('\nbuildCompressedTimeline — attempt-mapped mode');

const legacyTracks = {
  student: { attempts: deriveLegacyAttempts({ events, itemOffsetsMs: allItems, fileMs: STUDENT_FILE_MS })!, fileMs: STUDENT_FILE_MS },
  tutor: { attempts: deriveLegacyAttempts({ events, itemOffsetsMs: allItems, fileMs: TUTOR_FILE_MS })!, fileMs: TUTOR_FILE_MS },
};
const anchorTracks = {
  student: { attempts: attemptsFromAnchors(studentAnchors, T0, RATE), fileMs: STUDENT_FILE_MS },
  tutor: { attempts: attemptsFromAnchors(tutorAnchors, T0, RATE), fileMs: TUTOR_FILE_MS },
};

check('THE BUG (pinned): without attempts, the playhead runs far ahead of the audio', () => {
  const tl = buildCompressedTimeline(allItems, DURATION_MS, { hasAudio: true });
  const last1 = attempt1Items[attempt1Items.length - 2];
  const lag = last1 - tl.toAudio(tl.toCompressed(last1));
  assert.ok(lag > 300_000, `expected the old mode to lag by minutes, got ${lag} ms`);
});

for (const [name, tracks] of [['legacy-derived', legacyTracks], ['anchors', anchorTracks]] as const) {
  check(`${name}: attempt-1 moments play audio at their wall offset (±1 s), both tracks`, () => {
    const tl = buildCompressedTimeline(allItems, DURATION_MS, { hasAudio: true, audioTracks: tracks });
    for (const w of attempt1Items.filter((v) => v < ATTEMPT1_END)) {
      near(tl.toAudioFor('tutor', tl.toCompressed(w)), w, 1_000, `tutor @${w}`);
      near(tl.toAudioFor('student', tl.toCompressed(w)), w, 1_000, `student @${w}`);
    }
  });

  check(`${name}: attempt-2 moments map to 1754 s + (wall − attempt-2 anchor)`, () => {
    const tl = buildCompressedTimeline(allItems, DURATION_MS, { hasAudio: true, audioTracks: tracks });
    for (const w of attempt2Items) near(tl.toAudioFor('tutor', tl.toCompressed(w)), ATTEMPT1_END + (w - REMOUNT), 1_000, `tutor @${w}`);
  });

  check(`${name}: no gap cap inside an attempt; only the inter-attempt gap is collapsed`, () => {
    const tl = buildCompressedTimeline(allItems, DURATION_MS, { hasAudio: true, audioTracks: tracks });
    // Inside attempt 1 the axis is wall time.
    for (const w of attempt1Items) near(tl.toCompressed(w), w, 1, `toCompressed(${w})`);
    // The 7.3 s gap is shorter than the cap, so it survives intact here…
    near(tl.toCompressed(REMOUNT), REMOUNT, 1, 'remount');
    near(tl.totalMs, TIMELINE_END + 3_000, 1, 'totalMs');
    // …the playhead must re-seek the sources where attempt 2 begins.
    assert.ok(tl.audioReseekEndsMs.some((c) => Math.abs(c - tl.toCompressed(REMOUNT)) < 1), `re-seek points: ${tl.audioReseekEndsMs}`);
    // Nothing plays inside the gap.
    assert.strictEqual(tl.toAudioFor('tutor', tl.toCompressed(ATTEMPT1_END + 3_000)), null);
    assert.strictEqual(tl.toReal(tl.toCompressed(1_000_000)), 1_000_000);
  });
}

check('a 4.5 h pause between attempts collapses to the 8 s beat; audio stays exact either side', () => {
  const PAUSE = 4.5 * 3600_000;
  const shifted2 = attempt2Items.map((w) => w + PAUSE);
  const items = [...attempt1Items, REMOUNT + PAUSE, ...shifted2];
  const anchors: AttemptAnchor[] = [tutorAnchors[0], { wallStartMs: T0 + REMOUNT + PAUSE, byteOffset: tutorAnchors[1].byteOffset }];
  const tl = buildCompressedTimeline(items, DURATION_MS, {
    hasAudio: true,
    audioTracks: { tutor: { attempts: attemptsFromAnchors(anchors, T0, RATE), fileMs: TUTOR_FILE_MS }, student: anchorTracks.student },
  });
  near(tl.toCompressed(REMOUNT + PAUSE), ATTEMPT1_END + GAP_CAP_MS, 1, 'gap collapsed to the cap');
  near(tl.totalMs, ATTEMPT1_END + GAP_CAP_MS + (TIMELINE_END - REMOUNT) + 3_000, 1, 'totalMs');
  for (const w of attempt1Items.filter((v) => v < ATTEMPT1_END)) near(tl.toAudioFor('tutor', tl.toCompressed(w)), w, 1, `tutor @${w}`);
  for (const w of shifted2) near(tl.toAudioFor('tutor', tl.toCompressed(w)), ATTEMPT1_END + (w - REMOUNT - PAUSE), 1, `tutor @${w}`);
});

check('a track whose first attempt ended early (the "45.5 s late" session) goes silent, then lands exactly', () => {
  const SHORT = ATTEMPT1_END - 45_500; // tutor's attempt-1 audio stops 45.5 s before the attempt does
  const anchors: AttemptAnchor[] = [tutorAnchors[0], { wallStartMs: T0 + REMOUNT, byteOffset: SHORT * BYTES_PER_MS }];
  const tl = buildCompressedTimeline(allItems, DURATION_MS, {
    hasAudio: true,
    audioTracks: { tutor: { attempts: attemptsFromAnchors(anchors, T0, RATE), fileMs: TUTOR_FILE_MS - 45_500 }, student: anchorTracks.student },
  });
  assert.strictEqual(tl.toAudioFor('tutor', tl.toCompressed(SHORT + 10_000)), null, 'tutor must be silent, not playing attempt-2 bytes');
  near(tl.toAudioFor('student', tl.toCompressed(SHORT + 10_000)), SHORT + 10_000, 1, 'student keeps playing');
  near(tl.toAudioFor('tutor', tl.toCompressed(REMOUNT + 20_000)), SHORT + 20_000, 1, 'attempt 2');
  // The tutor source must be stopped where its attempt-1 audio runs out.
  assert.ok(tl.audioReseekEndsMs.some((c) => Math.abs(c - tl.toCompressed(SHORT)) < 1), `re-seek points: ${tl.audioReseekEndsMs}`);
  // The student track still has audio there, so that stretch is NOT collapsed.
  near(tl.toCompressed(ATTEMPT1_END) - tl.toCompressed(SHORT), 45_500, 1, 'student-covered stretch stays real-time');
});

check('single attempt with an anchor: wall axis, corrected for the recorder origin', () => {
  // Origin 1.2 s after startedAt (first-chunk-wins fallback).
  const attempts = attemptsFromAnchors([{ wallStartMs: T0 + 1_200, byteOffset: 0 }], T0, RATE);
  const tl = buildCompressedTimeline([0, 5_000, 70_000], 78_000, { hasAudio: true, audioTracks: { tutor: { attempts } } });
  assert.strictEqual(tl.totalMs, 78_000);
  near(tl.toAudioFor('tutor', 70_000), 68_800, 1, 'tutor');
  assert.strictEqual(tl.toAudioFor('student', 70_000), 70_000, 'a track with no attempts stays on the wall clock');
  // Before the anchor the tutor track has no audio (the player stops it), so
  // the anchor itself must be a re-seek point or the track never starts.
  assert.strictEqual(tl.toAudioFor('tutor', 0), null);
  assert.deepStrictEqual(tl.audioReseekEndsMs, [1_200]);
  near(tl.toAudioFor('tutor', tl.audioReseekEndsMs[0]), 0, 1, 'tutor audio starts at the anchor');
});

check('first attempt starting late on BOTH tracks: playing from zero starts the audio when the timeline reaches the anchor', () => {
  // Single anchor 90 s after startedAt on both tracks (review finding: this
  // used to yield no re-seek point at all — silent until the user scrubbed).
  const attempts = attemptsFromAnchors([{ wallStartMs: T0 + 90_000, byteOffset: 0 }], T0, RATE);
  const tl = buildCompressedTimeline([0, 5_000, 95_000, 150_000], 160_000, {
    hasAudio: true, audioTracks: { tutor: { attempts }, student: { attempts } },
  });
  assert.strictEqual(tl.toAudioFor('tutor', 0), null);
  assert.strictEqual(tl.toAudioFor('student', 0), null);
  assert.deepStrictEqual(tl.audioReseekEndsMs, [tl.toCompressed(90_000)]);
  const at = tl.audioReseekEndsMs[0];
  near(tl.toAudioFor('tutor', at), 0, 1, 'tutor starts at file offset 0');
  near(tl.toAudioFor('student', at), 0, 1, 'student starts at file offset 0');
  near(tl.toAudioFor('tutor', tl.toCompressed(95_000)), 5_000, 1, 'tutor after the anchor');
});

check('a first attempt on (or skewed before) the session origin adds no re-seek point', () => {
  for (const skew of [0, -400]) {
    const attempts = attemptsFromAnchors([{ wallStartMs: T0 + skew, byteOffset: 0 }], T0, RATE);
    const tl = buildCompressedTimeline([0, 5_000, 70_000], 78_000, { hasAudio: true, audioTracks: { tutor: { attempts } } });
    assert.deepStrictEqual(tl.audioReseekEndsMs, [], `skew ${skew}`);
  }
});

check('guards: attempts are ignored without audio, and for a resumed session with a single audio attempt', () => {
  const base = buildCompressedTimeline(allItems, DURATION_MS);
  const noAudio = buildCompressedTimeline(allItems, DURATION_MS, { audioTracks: anchorTracks });
  assert.strictEqual(noAudio.totalMs, base.totalMs);
  const single = buildCompressedTimeline(allItems, DURATION_MS, { hasAudio: true, audioTracks: { student: anchorTracks.student } });
  assert.strictEqual(single.totalMs, base.totalMs);
  assert.strictEqual(single.toAudioFor('student', 50_000), base.toAudio(50_000));
  // Explicit `resumed` (attemptSpans) behaves like the overhang heuristic.
  const hinted = buildCompressedTimeline(allItems, TIMELINE_END, { hasAudio: true, resumed: true });
  assert.strictEqual(hinted.totalMs, buildCompressedTimeline(allItems, TIMELINE_END).totalMs);
  assert.strictEqual(hinted.toAudio(50_000), 50_000);
});

console.log('\nresolveSessionSpan — what the inspector measures against');

check('attemptSpans: wall span to the last attempt\'s end, active = spans summed', () => {
  const s = resolveSessionSpan({
    startedAtMs: T0, durationSec: 511,
    attemptSpans: [{ startedAt: new Date(T0).toISOString(), duration: 1754 }, { startedAt: new Date(T0 + REMOUNT).toISOString(), duration: 511 }],
  });
  assert.deepStrictEqual(s, { resumed: true, attemptCount: 2, wallSpanSec: 2272.3, activeSec: 2265, source: 'attempt-spans' });
});

check('legacy resumed session: boundaries from debug events', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 511, events, itemOffsetsMs: allItems });
  assert.strictEqual(s.resumed, true);
  assert.strictEqual(s.attemptCount, 2);
  assert.strictEqual(s.source, 'debug-events');
  near(s.wallSpanSec, 2272.3, 0.01, 'wallSpanSec');
  near(s.activeSec, 1754 + 511, 0.01, 'activeSec');
});

check('resumed with no recoverable boundaries: flagged, active span unknown', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 511, itemOffsetsMs: allItems });
  assert.deepStrictEqual(s, { resumed: true, attemptCount: null, wallSpanSec: 2272.3, activeSec: null, source: 'overhang' });
});

check('single attempt: duration means what it says', () => {
  const s = resolveSessionSpan({ startedAtMs: T0, durationSec: 600, itemOffsetsMs: [0, 590_000], events: events.slice(0, 2) });
  assert.deepStrictEqual(s, { resumed: false, attemptCount: 1, wallSpanSec: 600, activeSec: 600, source: 'duration' });
  assert.deepStrictEqual(parseAttemptSpans([{ startedAt: 'nope', duration: 5 }, { startedAt: new Date(T0), duration: 7 }]), [{ startedAtMs: T0, durationSec: 7 }]);
});

async function serializerChecks() {
  console.log('\ncreateKeyedSerializer — the sidecar read-modify-write lock');
  const tick = (ms = 2) => new Promise<void>((r) => setTimeout(r, ms));

  await checkAsync('same key: read-modify-write sections never interleave (no lost update)', async () => {
    const lock = createKeyedSerializer();
    // A "sidecar" updated the way the route does it: read, await, write.
    let meta: Record<string, unknown> = {};
    const rmw = (patch: Record<string, unknown>, ms: number) => lock('s1/tutor', async () => {
      const read = { ...meta };
      await tick(ms);
      meta = { ...read, ...patch };
    });
    // Chunk (attempts) and finalize (finalizedAt) racing, slow one first.
    await Promise.all([rmw({ attempts: [1] }, 8), rmw({ finalizedAt: 'x' }, 1)]);
    assert.deepStrictEqual(meta, { attempts: [1], finalizedAt: 'x' });
  });

  await checkAsync('same key runs in call order; different keys do not block each other', async () => {
    const lock = createKeyedSerializer();
    const log: string[] = [];
    const job = (key: string, name: string, ms: number) => lock(key, async () => { log.push(`${name}+`); await tick(ms); log.push(`${name}-`); });
    await Promise.all([job('a', 'a1', 10), job('a', 'a2', 1), job('b', 'b1', 1)]);
    assert.ok(log.indexOf('a1-') < log.indexOf('a2+'), `a2 entered before a1 left: ${log}`);
    assert.ok(log.indexOf('b1-') < log.indexOf('a1-'), `b waited on a: ${log}`);
  });

  await checkAsync('a failing section rejects its own caller only; the queue keeps going and returns values', async () => {
    const lock = createKeyedSerializer();
    const bad = lock('k', async () => { await tick(); throw new Error('boom'); });
    const good = lock('k', async () => 42);
    await assert.rejects(bad, /boom/);
    assert.strictEqual(await good, 42);
    assert.strictEqual(await lock('k', () => 7), 7, 'sync sections work too');
  });

  await checkAsync('idle keys are released (no per-session leak)', async () => {
    const lock = createKeyedSerializer();
    await Promise.all([lock('x', () => tick()), lock('x', () => tick()), lock('y', () => tick())]);
    await tick();
    assert.strictEqual(lock.pendingKeys(), 0);
  });
}

serializerChecks().then(() => {
  console.log(`\n${passed} checks passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
});
