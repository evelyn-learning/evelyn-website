/**
 * Homework/image upload flow — pure decision logic
 * (src/app/tutor/components/session/upload-flow.ts).
 *
 * Bug: on /tutor under the new session UI a `claude-brain` upload went to the
 * page-level legacy handler, which only wrote page state nobody was looking
 * at — nothing boarded, nothing sent to the brain, nothing spoken, nothing
 * saved. These tests pin the contracts the fix depends on, including the two
 * CROSS-MODULE ones a refactor of the strings would silently break:
 *   - the success marker must still be recognised by extractStudentEcho
 *     (else the student's problem never reaches the saved transcript);
 *   - every marker must still match VoiceTutorRealtime's student-board-action
 *     prefix (else an upload before the mic tap never starts the session).
 *
 * Run: cd apps/tutor && npx tsx scripts/test-upload-flow.ts
 */
import { strict as assert } from 'node:assert';
import {
  pageOwnsUpload,
  classifyExtraction,
  buildStudentMediaBrainInput,
  buildUploadedProblemCard,
  studentMediaNotice,
  wrapCardText,
  extractionUsage,
  runWithAbortTimeout,
  EXTRACTION_TIMEOUT_MS,
} from '../src/app/tutor/components/session/upload-flow';
import { extractStudentEcho } from '../src/lib/tutor/voice/marker-student-echo';

let n = 0;
const ok = (name: string, fn: () => void) => { fn(); n++; console.log(`  ok  ${name}`); };
const pendingAsync: Array<Promise<void>> = [];
const okAsync = (name: string, fn: () => Promise<void>) => {
  pendingAsync.push(fn().then(() => { n++; console.log(`  ok  ${name}`); }));
};

// Copy of the handle's gate in VoiceTutorRealtime.tsx (sendTextMessage):
// a bracketed send only starts the session clock / unlocks audio when it is a
// real student gesture.
const STUDENT_BOARD_ACTION = /^\s*\[(?:The student (?:wrote|drew|uploaded)|Via their review-agenda menu)/i;

// ---- which handler owns an upload ------------------------------------------
ok('only the legacy `realtime` engine keeps the page-level handler', () => {
  assert.equal(pageOwnsUpload('realtime'), true);
});
ok('the production engine (claude-brain) and the other session-UI engines use the session path', () => {
  for (const e of ['claude-brain', 'realtime-2', 'realtime-validated']) {
    assert.equal(pageOwnsUpload(e), false, e);
  }
});
ok('unknown / missing engine never falls into the page handler', () => {
  assert.equal(pageOwnsUpload(undefined), false);
  assert.equal(pageOwnsUpload(''), false);
  assert.equal(pageOwnsUpload('gemini'), false);
});

// ---- extraction outcome -----------------------------------------------------
ok('200 with a problem → extracted (trimmed)', () => {
  assert.deepEqual(
    classifyExtraction({ httpOk: true, body: { extractedProblem: '  A 2 kg block slides…  ' } }),
    { kind: 'extracted', problem: 'A 2 kg block slides…' },
  );
});
ok('200 with no / blank / non-string problem → unreadable (the image arrived, nothing legible in it)', () => {
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: null } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: '   ' } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: { extractedProblem: 42 } }), { kind: 'unreadable' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: {} }), { kind: 'unreadable' });
});
ok('server error is a FAILURE, not "unreadable" — even if the error body parses as JSON', () => {
  assert.deepEqual(classifyExtraction({ httpOk: false, body: { error: 'Failed to extract problem' } }), { kind: 'failed' });
  // A 500 must not be treated as success just because a body field is present.
  assert.deepEqual(classifyExtraction({ httpOk: false, body: { extractedProblem: 'x' } }), { kind: 'failed' });
});
ok('network error / non-JSON body (e.g. proxy 413 HTML) → failed', () => {
  assert.deepEqual(classifyExtraction({ threw: true }), { kind: 'failed' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: null }), { kind: 'failed' });
  assert.deepEqual(classifyExtraction({ httpOk: true, body: 'oops' }), { kind: 'failed' });
});

// ---- brain input ------------------------------------------------------------
const PROBLEM = 'A 2 kg block is pushed with "F = 10 N" up a 30° incline. Find a.';

ok('success marker carries the problem and survives the transcript-echo extractor', () => {
  const m = buildStudentMediaBrainInput('image', { kind: 'extracted', problem: PROBLEM });
  assert.equal(extractStudentEcho(m), PROBLEM); // quotes inside the problem survive
  const d = buildStudentMediaBrainInput('drawing', { kind: 'extracted', problem: 'x^2 + 1' });
  assert.equal(extractStudentEcho(d), 'x^2 + 1');
});
ok('failure markers never produce a student echo (nothing the student "said")', () => {
  for (const type of ['image', 'drawing'] as const) {
    for (const kind of ['unreadable', 'failed'] as const) {
      assert.equal(extractStudentEcho(buildStudentMediaBrainInput(type, { kind })), null, `${type}/${kind}`);
    }
  }
});
ok('every marker is a bracketed student-board action (starts the session like a real gesture)', () => {
  for (const type of ['image', 'drawing'] as const) {
    for (const o of [{ kind: 'extracted', problem: PROBLEM }, { kind: 'unreadable' }, { kind: 'failed' }] as const) {
      const m = buildStudentMediaBrainInput(type, o);
      assert.match(m, STUDENT_BOARD_ACTION, `${type}/${o.kind}`);
      assert.ok(m.startsWith('[') && m.endsWith(']'), `${type}/${o.kind} bracketed`);
    }
  }
});
ok('an UPLOAD is never described as a drawing, and a drawing never as an upload', () => {
  for (const o of [{ kind: 'extracted', problem: PROBLEM }, { kind: 'unreadable' }, { kind: 'failed' }] as const) {
    const img = buildStudentMediaBrainInput('image', o);
    assert.match(img, /uploaded/i);
    assert.doesNotMatch(img, /\bdrew\b|\bdrawing\b/i, `image/${o.kind}`);
    const drw = buildStudentMediaBrainInput('drawing', o);
    assert.match(drw, /\bdrew\b/i);
    assert.doesNotMatch(drw, /upload/i, `drawing/${o.kind}`);
  }
});
ok('a failed/unreadable upload tells the tutor to say so and ask for another try', () => {
  for (const kind of ['unreadable', 'failed'] as const) {
    const m = buildStudentMediaBrainInput('image', { kind });
    assert.match(m, /try (uploading )?(it )?again/i, kind);
    assert.match(m, /have not seen/i, kind); // tutor must not pretend it read the image
  }
  // The two causes are worded differently: a technical failure is not the student's photo's fault.
  assert.notEqual(
    buildStudentMediaBrainInput('image', { kind: 'failed' }),
    buildStudentMediaBrainInput('image', { kind: 'unreadable' }),
  );
});

// ---- persisted board card ---------------------------------------------------
ok('problem card is a small showSvgDiagram command with the text XML-escaped', () => {
  const card = buildUploadedProblemCard('If a < b & b > c, is "a" < c?') as unknown as { action: string; title: string; svg: string };
  assert.equal(card.action, 'showSvgDiagram');
  assert.equal(card.title, 'Uploaded problem');
  assert.ok(card.svg.includes('a &lt; b &amp; b &gt; c'));
  assert.doesNotMatch(card.svg, /data:image/); // text only — never the image bytes
  // well-formed enough: no raw < or & inside any <text> body
  for (const m of card.svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)) {
    assert.doesNotMatch(m[1].replace(/&(amp|lt|gt|quot);/g, ''), /[<>&]/);
  }
});
ok('card stays bounded for a very long extraction and grows with line count', () => {
  const short = buildUploadedProblemCard('Find x.') as unknown as { svg: string };
  const long = buildUploadedProblemCard('word '.repeat(5000)) as unknown as { svg: string };
  assert.ok(long.svg.length < 6000, `svg length ${long.svg.length}`);
  assert.ok(long.svg.includes('…'), 'truncation is marked');
  const h = (s: string) => Number(/viewBox="0 0 400 (\d+)"/.exec(s)![1]);
  assert.ok(h(long.svg) > h(short.svg));
});
ok('wrapCardText: wraps on words, keeps explicit line breaks, hard-splits an unbroken run', () => {
  assert.deepEqual(wrapCardText('aaa bbb ccc', 7, 10), ['aaa bbb', 'ccc']);
  assert.deepEqual(wrapCardText('one\ntwo', 20, 10), ['one', 'two']);
  assert.deepEqual(wrapCardText('abcdefghij', 4, 10), ['abcd', 'efgh', 'ij']);
  const capped = wrapCardText('a b c d e f', 1, 3);
  assert.equal(capped.length, 3);
  assert.ok(capped[2].endsWith('…'));
  assert.deepEqual(wrapCardText('   ', 10, 10), []);
});

// ---- visible notice ---------------------------------------------------------
ok('in-progress and failure notices exist for both kinds and name the right thing', () => {
  const p = studentMediaNotice('image', 'analyzing');
  assert.equal(p.tone, 'progress');
  assert.match(p.text, /upload/i);
  assert.equal(studentMediaNotice('drawing', 'analyzing').tone, 'progress');
  assert.match(studentMediaNotice('drawing', 'analyzing').text, /drawing/i);
  for (const phase of ['unreadable', 'failed', 'not-ready'] as const) {
    const f = studentMediaNotice('image', phase);
    assert.equal(f.tone, 'error', phase);
    assert.match(f.text, /again/i, phase);
    assert.doesNotMatch(f.text, /drawing|drew/i, phase);
  }
});

// ---- extraction token usage -------------------------------------------------
ok('extraction usage is read from the response body for the session cost channel', () => {
  assert.deepEqual(
    extractionUsage({ extractedProblem: 'x', usage: { inputTokens: 1200, outputTokens: 340 } }),
    { inputTokens: 1200, outputTokens: 340, cacheReadTokens: 0, cacheCreationTokens: 0 },
  );
  // An unreadable image still cost the Vision call.
  assert.deepEqual(
    extractionUsage({ extractedProblem: null, usage: { inputTokens: 900, outputTokens: 0 } }),
    { inputTokens: 900, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 },
  );
});
ok('missing / malformed / all-zero usage reports nothing (never NaN into the cost total)', () => {
  for (const body of [null, 'oops', {}, { usage: null }, { usage: 'x' }, { usage: { inputTokens: 'a', outputTokens: 1 } },
    { usage: { inputTokens: 0, outputTokens: 0 } }, { usage: { inputTokens: -5, outputTokens: 2 } },
    { usage: { inputTokens: Number.NaN, outputTokens: 2 } }]) {
    assert.equal(extractionUsage(body), null, JSON.stringify(body));
  }
});

// ---- extraction timeout -----------------------------------------------------
ok('extraction timeout is 45 s', () => { assert.equal(EXTRACTION_TIMEOUT_MS, 45_000); });
okAsync('a hung extraction is aborted at the timeout and lands on the FAILED path', async () => {
  // A fetch that never settles on its own — only the abort signal ends it.
  const hung = (signal: AbortSignal) => new Promise<never>((_res, rej) => {
    signal.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError')));
  });
  const t0 = Date.now();
  let outcome;
  try {
    const body = await runWithAbortTimeout(30, hung);
    outcome = classifyExtraction({ httpOk: true, body });
  } catch {
    outcome = classifyExtraction({ threw: true });
  }
  assert.deepEqual(outcome, { kind: 'failed' });
  assert.ok(Date.now() - t0 < 2000, 'did not hang');
  // Same marker / notice as a network error: try again.
  assert.match(buildStudentMediaBrainInput('image', outcome), /try uploading it again/i);
  assert.match(studentMediaNotice('image', outcome.kind).text, /again/i);
});
okAsync('a request that finishes in time returns its value and is not aborted afterwards', async () => {
  let seen: AbortSignal | null = null;
  const v = await runWithAbortTimeout(30, async (signal) => { seen = signal; return 'done'; });
  assert.equal(v, 'done');
  await new Promise((r) => setTimeout(r, 60));
  assert.equal((seen as AbortSignal | null)?.aborted, false, 'timer cleared on completion');
});
okAsync('a request that throws on its own rethrows (network error path unchanged)', async () => {
  await assert.rejects(runWithAbortTimeout(30, async () => { throw new TypeError('Failed to fetch'); }), /Failed to fetch/);
});

Promise.all(pendingAsync).then(
  () => { console.log(`upload-flow: all ${n} checks passed`); },
  (err) => { console.error(err); process.exit(1); },
);
