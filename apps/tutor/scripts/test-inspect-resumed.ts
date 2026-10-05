/**
 * Session inspector vs. resumed sessions (2026-10-03).
 *
 * inspect-tutor-session.ts divided sample counts by the doc's `duration`,
 * which covers only the LATEST attempt of a resumed session — so every
 * resumed session was reported as `audio-rate-mismatch` (with a suggestion to
 * run the rate-rescue script, which would have corrupted a good recording)
 * and `transcript-overhang`. Pinned with the production session's numbers.
 *
 *   npx tsx scripts/test-inspect-resumed.ts
 */
import assert from 'node:assert';
import { detectIssues, sessionSpan, activeSecondsText, renderReport, type AudioStats, type SessionDoc } from './inspect-tutor-session';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

const T0 = Date.parse('2026-10-01T15:00:00.000Z');
const at = (sec: number) => new Date(T0 + sec * 1000);
function audio(seconds: number, attempts: AudioStats['attempts'] = []): AudioStats {
  return {
    exists: true, bytes: seconds * 48000, samples: seconds * 24000,
    durationAt24kSec: seconds, durationAt48kSec: seconds / 2,
    peakInt16: 9000, peakDbfs: -11, rmsInt16: 900, rmsDbfs: -31, silentSamplePct: 60,
    longSilenceRuns: [], longSilenceCount: 0, clippedSampleCount: 0, metaSampleRate: 24000, attempts,
  };
}
function transcript(fromSec: number, toSec: number) {
  const out: NonNullable<SessionDoc['transcript']> = [];
  for (let t = fromSec; t <= toSec; t += 30) out.push({ role: out.length % 2 ? 'student' : 'tutor', text: 'x', timestamp: at(t) });
  out.push({ role: 'tutor', text: 'x', timestamp: at(toSec) });
  return out;
}

// attempt 1 wall 0–1754 s · remount 1761.3 s · resume tap 1764.5 s ·
// student file 1754.0 s · tutor file 2266.6 s · timeline end 2272.3 s
const resumed: SessionDoc = {
  sessionId: 'portal-test', subject: 'math', topic: 't', level: '8', inputMode: 'voice', voiceEngine: 'claude-brain',
  startedAt: at(0), endedAt: at(2272.3), duration: 511, status: 'completed', hasAudio: true,
  transcript: [...transcript(1, 1754), ...transcript(1766, 2272.3)],
  debugEvents: [
    { type: 'embed_config', message: 'practice_locator=no', timestamp: at(0.4) },
    { type: 'embed_config', message: 'practice_locator=no', timestamp: at(1761.3) },
    { type: 'start_tap', message: 'action=resume_continue', timestamp: at(1764.5) },
  ],
};
const student = audio(1754.0);
const tutor = audio(2266.6);

check('resumed session: labelled resumed, with the real spans', () => {
  const span = sessionSpan(resumed, student, tutor);
  assert.strictEqual(span.resumed, true);
  assert.strictEqual(span.attemptCount, 2);
  assert.ok(Math.abs(span.wallSpanSec! - 2272.3) < 0.01, `wallSpanSec ${span.wallSpanSec}`);
  assert.ok(Math.abs(span.activeSec! - (1754 + 511)) < 0.01, `activeSec ${span.activeSec}`);
  const tags = detectIssues(resumed, student, tutor).map((i) => i.tag);
  assert.ok(tags.includes('resumed-session'), tags.join(','));
});

check('resumed session: no audio-rate-mismatch, no transcript-overhang, no rescue-script advice', () => {
  // Old arithmetic, for the record: 1754 s of student audio / 511 s = 3.43×.
  assert.ok(student.samples / (resumed.duration! * 24000) > 3.4);
  const issues = detectIssues(resumed, student, tutor);
  const tags = issues.map((i) => i.tag);
  assert.ok(!tags.includes('audio-rate-mismatch'), tags.join(','));
  assert.ok(!tags.includes('transcript-overhang'), tags.join(','));
  assert.ok(!tags.includes('tutor-track-short') && !tags.includes('audio-truncated'), tags.join(','));
  assert.ok(!issues.some((i) => /Run scripts\/rescue-tutor-audio-rates/.test(i.message)), 'must not suggest the rescue script');
});

check('resumed session with recorded attemptSpans: same verdict without any debug events', () => {
  const doc: SessionDoc = { ...resumed, debugEvents: [], attemptSpans: [{ startedAt: at(0), duration: 1754 }, { startedAt: at(1761.3), duration: 511 }] };
  const span = sessionSpan(doc, student, tutor);
  assert.deepStrictEqual([span.resumed, span.attemptCount, span.source], [true, 2, 'attempt-spans']);
  assert.ok(!detectIssues(doc, student, tutor).some((i) => i.tag === 'audio-rate-mismatch' || i.tag === 'transcript-overhang'));
});

check('resumed session, nothing derivable: flagged resumed, length checks skipped rather than guessed', () => {
  const doc: SessionDoc = { ...resumed, debugEvents: [] };
  const issues = detectIssues(doc, student, tutor);
  const tags = issues.map((i) => i.tag);
  assert.ok(tags.includes('resumed-session'));
  assert.ok(!tags.includes('audio-rate-mismatch') && !tags.includes('transcript-overhang'), tags.join(','));
});

check('resumed session whose track really is far too long: warned, but never pointed at the rescue script', () => {
  const issues = detectIssues(resumed, audio(2265 * 2), tutor);
  const hit = issues.find((i) => i.tag === 'audio-longer-than-active-span');
  assert.ok(hit && hit.severity === 'warn');
  assert.ok(!issues.some((i) => i.tag === 'audio-rate-mismatch'));
  assert.ok(/do NOT run rescue-tutor-audio-rates/.test(hit.message));
});

check('sidecar anchors alone mark a session resumed', () => {
  const doc: SessionDoc = { ...resumed, debugEvents: [], transcript: transcript(1, 500), duration: 511, endedAt: at(511) };
  const anchored = audio(700, [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0 + 300_000, byteOffset: 9_600_000 }]);
  assert.strictEqual(sessionSpan(doc, anchored, anchored).resumed, true);
});

check('single-attempt session: unchanged — a 2× student track is still audio-rate-mismatch', () => {
  const doc: SessionDoc = { ...resumed, debugEvents: [], transcript: transcript(1, 590), duration: 600, endedAt: at(600) };
  assert.strictEqual(sessionSpan(doc).resumed, false);
  const issues = detectIssues(doc, audio(1200), audio(598));
  const hit = issues.find((i) => i.tag === 'audio-rate-mismatch');
  assert.ok(hit && /rescue-tutor-audio-rates\.ts --apply/.test(hit.message));
  assert.ok(!issues.some((i) => i.tag === 'resumed-session'));
  assert.deepStrictEqual(detectIssues(doc, audio(598), audio(598)).map((i) => i.tag), []);
});

// 2026-10-04 — a retail /tutor session reloaded mid-way: the page keeps its
// original startedAt, so the doc has ONE span covering the whole wall time,
// while the sidecar anchors show two recording attempts. Printed "active ?s".
{
  const retail: SessionDoc = {
    ...resumed, sessionId: 'tutor-retail', debugEvents: [], duration: 2272, endedAt: at(2272),
    transcript: transcript(1, 2270), attemptSpans: [{ startedAt: at(0), duration: 2272 }],
  };
  const anchors: AudioStats['attempts'] = [{ wallStartMs: T0, byteOffset: 0 }, { wallStartMs: T0 + 1_761_000, byteOffset: 84_192_000 }];
  const studentA = audio(1754, anchors);
  const tutorA = audio(2260, anchors);
  const metadata = (report: string) => report.slice(report.indexOf('## Metadata'), report.indexOf('## Audio quality'));

  check('resumed retail session (one span, two anchors): the active figure is the span\'s duration, never "?"', () => {
    const span = sessionSpan(retail, studentA, tutorA);
    assert.deepStrictEqual([span.resumed, span.attemptCount, span.activeSec], [true, 2, null], 'still resumed; sittings still unsized for the audio checks');
    const active = activeSecondsText(retail, span);
    assert.strictEqual(active.text, '2272.0s');
    assert.strictEqual(active.seconds, 2272);
    assert.ok(/one recorded attempt span/.test(active.note));
  });

  check('…the report\'s metadata block prints it (37:52, 2272.0s) and holds no "?"', () => {
    const issues = detectIssues(retail, studentA, tutorA);
    const meta = metadata(renderReport(retail, studentA, tutorA, issues));
    assert.ok(/^active:\s+37:52 {2}\(2272\.0s\)/m.test(meta), meta);
    assert.ok(/^wall span:\s+37:52 {2}\(2272\.0s\)/m.test(meta), meta);
    assert.ok(/^resumed:\s+yes — 2 attempts/m.test(meta), meta);
    assert.ok(!meta.includes('?'), meta);
    const info = issues.find((i) => i.tag === 'resumed-session');
    assert.ok(info && /active 2272\.0s \(the one recorded attempt span/.test(info.message) && !/\?s/.test(info.message), info?.message);
  });

  check('…and its audio length checks stay skipped (the span includes the reload pause; nothing is guessed)', () => {
    const tags = detectIssues(retail, studentA, tutorA).map((i) => i.tag);
    assert.ok(!tags.includes('audio-rate-mismatch') && !tags.includes('audio-truncated') && !tags.includes('tutor-track-short') && !tags.includes('audio-longer-than-active-span'), tags.join(','));
  });

  check('a sized resumed session prints its active seconds as before', () => {
    const doc: SessionDoc = { ...resumed, debugEvents: [], attemptSpans: [{ startedAt: at(0), duration: 1754 }, { startedAt: at(1761.3), duration: 511 }] };
    const span = sessionSpan(doc, student, tutor);
    assert.deepStrictEqual(activeSecondsText(doc, span), { text: '2265.0s', seconds: 2265, note: '' });
    const meta = metadata(renderReport(doc, student, tutor, detectIssues(doc, student, tutor)));
    assert.ok(/^active:\s+37:45 {2}\(2265\.0s\)$/m.test(meta), meta);
    assert.ok(!meta.includes('?'), meta);
  });

  check('resumed with NO recorded span and nothing derivable: "unknown", still never "?"', () => {
    const doc: SessionDoc = { ...resumed, debugEvents: [] };
    const span = sessionSpan(doc, student, tutor);
    assert.strictEqual(span.activeSec, null);
    assert.strictEqual(activeSecondsText(doc, span).text, 'unknown');
    const issues = detectIssues(doc, student, tutor);
    const meta = metadata(renderReport(doc, student, tutor, issues));
    assert.ok(/^active:\s+unknown/m.test(meta), meta);
    assert.ok(!meta.includes('?'), meta);
    assert.ok(!/\?s/.test(issues.find((i) => i.tag === 'resumed-session')!.message));
  });

  check('a session with no duration at all prints n/a, not "?"', () => {
    const doc: SessionDoc = { ...resumed, debugEvents: [], duration: undefined, endedAt: undefined, transcript: [] };
    const meta = metadata(renderReport(doc, audio(10), audio(10), []));
    assert.ok(/^duration:\s+n\/a$/m.test(meta) && !meta.includes('?'), meta);
  });
}

console.log(`\n${passed} checks passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
