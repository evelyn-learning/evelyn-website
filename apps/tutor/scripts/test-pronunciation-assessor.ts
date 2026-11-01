/**
 * Pronunciation assessor (Task 6, GDI trial lesson) — vendor selection and the
 * "unavailable" reasons, clip limits, 24 → 16 kHz resampling, the brain note,
 * the /api/tutor/pronunciation/assess request parsing + tenant gate, and the
 * claim guard's `measured` bypass. No network: vendors are stubbed.
 *
 * Usage: npx tsx scripts/test-pronunciation-assessor.ts   (npm run test:pronunciation-assessor)
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { assessPronunciation, formatPronunciationNote, isMeasuredResult, PRONUNCIATION_NOT_ATTEMPTED_NOTE, PRONUNCIATION_UNAVAILABLE_NOTE, PRONUNCIATION_SCORE_EXCELLENT, PRONUNCIATION_SCORE_GOOD } from '../src/lib/tutor/pronunciation/assessor';
import { resamplePcm16 } from '../src/lib/tutor/pronunciation/resample';
import { parseAssessBody, pronunciationRouteEnabled, MAX_AUDIO_BYTES, MAX_REQUEST_BYTES, sessionAllowsAssess, CallBudget, MAX_ASSESS_CALLS_PER_SESSION, readBodyCapped } from '../src/lib/tutor/pronunciation/assess-request';
import { normalizeAzure } from '../src/lib/tutor/pronunciation/normalize';
import { isPronunciationClaimSentence, claimsPronunciation } from '../src/lib/tutor/voice/pronunciation-claim';
import type { PronunciationResult } from '../src/lib/tutor/pronunciation/types';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

const FIX = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'pronunciation', 'fixtures');
const azureFixture: PronunciationResult = normalizeAzure(JSON.parse(fs.readFileSync(path.join(FIX, 'azure-rest-sample.json'), 'utf8')));
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const pcm24 = (seconds: number) => Buffer.alloc(Math.round(seconds * 24000) * 2);
const REF = 'We went to the countryside.';

(async () => {
  console.log('\nassessPronunciation:\n');
  await test('no vendor env ⇒ unavailable/no_vendor', async () => {
    assert.deepEqual(await assessPronunciation({ pcm16: pcm24(1), sampleRate: 24000, referenceText: REF }, {}), { status: 'unavailable', reason: 'no_vendor' });
    assert.deepEqual(await assessPronunciation({ pcm16: pcm24(1), sampleRate: 24000, referenceText: REF }, { TUTOR_PRONUNCIATION_VENDOR: 'google' }), { status: 'unavailable', reason: 'no_vendor' });
  });
  await test('vendor set, key missing ⇒ no_key (azure needs key AND region)', async () => {
    const i = { pcm16: pcm24(1), sampleRate: 24000 as const, referenceText: REF };
    assert.deepEqual(await assessPronunciation(i, { TUTOR_PRONUNCIATION_VENDOR: 'azure' }), { status: 'unavailable', reason: 'no_key' });
    assert.deepEqual(await assessPronunciation(i, { TUTOR_PRONUNCIATION_VENDOR: 'azure', AZURE_SPEECH_KEY: 'k' }), { status: 'unavailable', reason: 'no_key' });
    assert.deepEqual(await assessPronunciation(i, { TUTOR_PRONUNCIATION_VENDOR: 'speechace' }), { status: 'unavailable', reason: 'no_key' });
  });
  const azureEnv = { TUTOR_PRONUNCIATION_VENDOR: 'azure', AZURE_SPEECH_KEY: 'secret-key', AZURE_SPEECH_REGION: 'eastus' };
  let calls: Array<{ bytes: number; ref: string; env: unknown }> = [];
  const deps = {
    azure: async (pcm: Buffer, ref: string, env: unknown) => { calls.push({ bytes: pcm.length, ref, env }); return azureFixture; },
    speechace: async (pcm: Buffer, ref: string, env: unknown) => { calls.push({ bytes: pcm.length, ref, env }); return { ...azureFixture, vendor: 'speechace' as const }; },
  };
  await test('0.2 s clip ⇒ clip_too_short (no vendor call)', async () => {
    calls = [];
    assert.deepEqual(await assessPronunciation({ pcm16: pcm24(0.2), sampleRate: 24000, referenceText: REF }, azureEnv, deps), { status: 'unavailable', reason: 'clip_too_short' });
    assert.equal(calls.length, 0);
  });
  await test('16 s clip ⇒ clip_too_long (no vendor call)', async () => {
    calls = [];
    assert.deepEqual(await assessPronunciation({ pcm16: pcm24(16), sampleRate: 24000, referenceText: REF }, azureEnv, deps), { status: 'unavailable', reason: 'clip_too_long' });
    assert.equal(calls.length, 0);
  });
  let okOut: Awaited<ReturnType<typeof assessPronunciation>> | null = null;
  await test('stubbed Azure ⇒ ok; vendor gets 16 kHz audio + env key/region', async () => {
    calls = [];
    okOut = await assessPronunciation({ pcm16: pcm24(1.5), sampleRate: 24000, referenceText: REF }, azureEnv, deps);
    assert.equal(okOut.status, 'ok');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].bytes, 1.5 * 16000 * 2);
    assert.equal(calls[0].ref, REF);
    assert.deepEqual(calls[0].env, { key: 'secret-key', region: 'eastus' });
  });
  await test('speechace vendor selected by env, host optional', async () => {
    calls = [];
    const out = await assessPronunciation({ pcm16: pcm24(1), sampleRate: 24000, referenceText: REF }, { TUTOR_PRONUNCIATION_VENDOR: 'speechace', SPEECHACE_KEY: 'sk', SPEECHACE_HOST: 'https://api2.speechace.co' }, deps);
    assert.equal(out.status, 'ok');
    assert.deepEqual(calls[0].env, { key: 'sk', host: 'https://api2.speechace.co' });
  });
  await test('vendor throws ⇒ vendor_error; one warn line, key never logged', async () => {
    const warns: string[] = [];
    const orig = console.warn;
    console.warn = (...a: unknown[]) => { warns.push(a.map(String).join(' ')); };
    try {
      const out = await assessPronunciation({ pcm16: pcm24(1), sampleRate: 24000, referenceText: REF }, azureEnv, {
        ...deps, azure: async () => { throw new Error('azure: HTTP 401 key=secret-key rejected'); },
      });
      assert.deepEqual(out, { status: 'unavailable', reason: 'vendor_error' });
    } finally { console.warn = orig; }
    assert.equal(warns.length, 1);
    assert.match(warns[0], /HTTP 401/);
    assert.ok(!warns[0].includes('secret-key'), warns[0]);
  });

  console.log('\nformatPronunciationNote:\n');
  await test('ok note names countryside and /k/, overall, prosody; ≤ 80 words', () => {
    assert.ok(okOut && okOut.status === 'ok');
    const note = formatPronunciationNote(okOut!, REF);
    assert.match(note, /countryside/);
    assert.match(note, /\/k\/ 0/);
    assert.match(note, /71|70\.6|71\/100/);
    assert.match(note, /[Pp]rosody 6[45]/);
    assert.ok(words(note) <= 80, `${words(note)} words: ${note}`);
  });
  await test('at most two weak words, worst first, stress flag shown', () => {
    const r: PronunciationResult = {
      vendor: 'speechace', overall: 55, latencyMs: 1,
      words: [
        { word: 'alpha', score: 60, errorType: 'mispronunciation', phonemes: [{ ipa: 'æ', score: 40 }, { ipa: 'l', score: 90 }] },
        { word: 'beta', score: 20, errorType: 'mispronunciation', phonemes: [{ ipa: 'b', score: 10 }], stress: 'wrong' },
        { word: 'gamma', score: 50, errorType: 'mispronunciation', phonemes: [{ ipa: 'ɡ', score: 30 }] },
        { word: 'delta', score: 95, errorType: 'none', phonemes: [] },
      ],
    };
    const note = formatPronunciationNote({ status: 'ok', result: r }, 'alpha beta gamma delta');
    assert.match(note, /beta/); assert.match(note, /gamma/);
    assert.ok(!/"alpha"/.test(note), note);
    assert.ok(note.indexOf('"beta"') < note.indexOf('"gamma"'), note);
    assert.match(note, /stress wrong/);
    assert.ok(!/[Pp]rosody/.test(note), 'no prosody when absent');
  });
  await test('Task 25 §E: every measured note ends with the score order — "79 out of 100", the bands', () => {
    const r: PronunciationResult = {
      vendor: 'speechace', overall: 79, latencyMs: 1,
      words: [
        { word: 'for', score: 44, errorType: 'mispronunciation', phonemes: [{ ipa: 'ɔɹ', score: 43 }] },
        { word: 'international', score: 70, errorType: 'mispronunciation', phonemes: [{ ipa: 'n', score: 60 }] },
        { word: 'customers', score: 92, errorType: 'none', phonemes: [] },
      ],
    };
    const note = formatPronunciationNote({ status: 'ok', result: r }, 'for international customers');
    assert.ok(note.includes('79 out of 100'), note);
    assert.ok(note.endsWith('a score of 90 or more is "excellent", 75–89 "good", below 75 "needs work" — say which.'), note);
    assert.ok(note.indexOf('Feed back only on these measured items.') < note.indexOf('Tell the student the overall score'), note);
    assert.ok(formatPronunciationNote({ status: 'ok', result: { ...r, overall: 96.4 } }, 'for international customers').includes('"96 out of 100"'));
    assert.equal(PRONUNCIATION_SCORE_EXCELLENT, 90); assert.equal(PRONUNCIATION_SCORE_GOOD, 75);
    assert.ok(!PRONUNCIATION_UNAVAILABLE_NOTE.includes('out of 100') && !PRONUNCIATION_NOT_ATTEMPTED_NOTE.includes('out of 100'));
  });
  await test('long reference text still ≤ 80 words', () => {
    const long = Array.from({ length: 70 }, (_, i) => `word${i}`).join(' ');
    const note = formatPronunciationNote(okOut!, long);
    assert.ok(words(note) <= 80, `${words(note)} words`);
  });
  await test('unavailable ⇒ the exact sentence, for every reason', () => {
    assert.equal(PRONUNCIATION_UNAVAILABLE_NOTE, 'No measured result: coach stress and linking from your model; do not describe sounds.');
    for (const reason of ['no_vendor', 'no_key', 'clip_too_short', 'clip_too_long', 'vendor_error'] as const) {
      assert.equal(formatPronunciationNote({ status: 'unavailable', reason }, REF), PRONUNCIATION_UNAVAILABLE_NOTE);
    }
  });

  console.log('\nnon-attempt (final review #1c):\n');
  const mk = (types: Array<'none' | 'omission' | 'mispronunciation' | 'insertion'>, completeness?: number): PronunciationResult => ({
    vendor: 'azure', overall: 30, latencyMs: 1,
    ...(completeness === undefined ? {} : { completeness }),
    words: types.map((errorType, i) => ({ word: `w${i}`, score: errorType === 'omission' ? 0 : 80, errorType, phonemes: [] })),
  });
  await test('half the reference words omitted ⇒ not measured, the not-attempted note', () => {
    const r = { status: 'ok' as const, result: mk(['omission', 'omission', 'none', 'none']) };
    assert.equal(isMeasuredResult(r), false);
    assert.equal(formatPronunciationNote(r, 'a b c d'), PRONUNCIATION_NOT_ATTEMPTED_NOTE);
    assert.equal(PRONUNCIATION_NOT_ATTEMPTED_NOTE, 'The learner did not say the target text; nothing was measured. Ask them to repeat it, or coach from your model.');
  });
  await test('every word omitted ⇒ not measured', () => {
    assert.equal(isMeasuredResult({ status: 'ok', result: mk(['omission', 'omission', 'omission']) }), false);
  });
  await test('fewer than half omitted ⇒ measured (insertions are not reference words)', () => {
    const r = { status: 'ok' as const, result: mk(['omission', 'none', 'none', 'insertion', 'insertion']) };
    assert.equal(isMeasuredResult(r), true);
    assert.notEqual(formatPronunciationNote(r, 'a b c'), PRONUNCIATION_NOT_ATTEMPTED_NOTE);
  });
  await test('Azure completeness < 50 ⇒ not measured even with few omissions', () => {
    assert.equal(isMeasuredResult({ status: 'ok', result: mk(['none', 'none'], 40) }), false);
    assert.equal(isMeasuredResult({ status: 'ok', result: mk(['none', 'none'], 50) }), true);
  });
  await test('no words at all ⇒ not measured; unavailable ⇒ not measured', () => {
    assert.equal(isMeasuredResult({ status: 'ok', result: mk([]) }), false);
    assert.equal(isMeasuredResult({ status: 'unavailable', reason: 'vendor_error' }), false);
  });
  await test('the fixture result is measured', () => {
    assert.ok(okOut && isMeasuredResult(okOut));
  });

  console.log('\nresamplePcm16:\n');
  await test('24 → 16 kHz length ratio 2/3', () => {
    const out = resamplePcm16(Buffer.alloc(24000 * 2), 24000, 16000);
    assert.equal(out.length, 16000 * 2);
    assert.equal(resamplePcm16(new Int16Array(300), 24000, 16000).length, 200 * 2);
  });
  await test('a constant signal stays constant', () => {
    const inp = new Int16Array(2400).fill(1234);
    const out = resamplePcm16(inp, 24000, 16000);
    for (let i = 0; i < out.length / 2; i++) assert.equal(out.readInt16LE(i * 2), 1234);
  });
  await test('a ramp is interpolated, not repeated', () => {
    const inp = Int16Array.from({ length: 30 }, (_, i) => i * 300);
    const out = resamplePcm16(inp, 24000, 16000);
    assert.equal(out.readInt16LE(2), 450); // source position 1.5
  });
  await test('0-length input ⇒ empty buffer', () => {
    assert.equal(resamplePcm16(Buffer.alloc(0), 24000, 16000).length, 0);
  });

  console.log('\nassess-request:\n');
  const b64 = (n: number) => Buffer.alloc(n).toString('base64');
  await test('valid body parses; odd trailing byte dropped', () => {
    const r = parseAssessBody({ sessionId: 'embed-1', referenceText: '  We went.  ', audio: b64(48001) });
    assert.ok(r.ok);
    if (r.ok) { assert.equal(r.sessionId, 'embed-1'); assert.equal(r.referenceText, 'We went.'); assert.equal(r.pcm16.length, 48000); }
  });
  await test('missing / bad fields ⇒ 400', () => {
    for (const body of [null, 'x', {}, { sessionId: 'a', referenceText: 'b' }, { sessionId: '', referenceText: 'b', audio: b64(10) }, { sessionId: 'a', referenceText: '   ', audio: b64(10) }, { sessionId: 'a', referenceText: 'x'.repeat(501), audio: b64(10) }, { sessionId: 'a', referenceText: 'b', audio: 42 }]) {
      const r = parseAssessBody(body);
      assert.ok(!r.ok && r.status === 400, JSON.stringify(body)?.slice(0, 60));
    }
  });
  await test('audio over 1.5 MB decoded ⇒ 413', () => {
    assert.equal(MAX_AUDIO_BYTES, 1.5 * 1024 * 1024);
    const r = parseAssessBody({ sessionId: 'a', referenceText: 'b', audio: b64(MAX_AUDIO_BYTES + 2) });
    assert.ok(!r.ok && r.status === 413);
    assert.ok(parseAssessBody({ sessionId: 'a', referenceText: 'b', audio: b64(MAX_AUDIO_BYTES) }).ok);
  });
  await test('gate: flag AND partner pronunciation, else closed', () => {
    assert.equal(pronunciationRouteEnabled(true, 'gdi-demo'), true);
    assert.equal(pronunciationRouteEnabled(false, 'gdi-demo'), false);
    for (const p of ['crimsora', 'greenapple', '', null, undefined, 'unknown']) assert.equal(pronunciationRouteEnabled(true, p), false, String(p));
  });

  await test('only a live session may assess (active, no endedAt)', () => {
    assert.equal(sessionAllowsAssess({ status: 'active' }), true);
    assert.equal(sessionAllowsAssess({ status: 'active', endedAt: null }), true);
    assert.equal(sessionAllowsAssess({ status: 'active', endedAt: new Date() }), false);
    assert.equal(sessionAllowsAssess({ status: 'completed', endedAt: new Date() }), false);
    assert.equal(sessionAllowsAssess({ status: 'abandoned' }), false);
    assert.equal(sessionAllowsAssess({}), false);
    assert.equal(sessionAllowsAssess(null), false);
  });
  await test('call budget: 40 ok, the 41st rejected, other sessions unaffected', () => {
    assert.equal(MAX_ASSESS_CALLS_PER_SESSION, 40);
    const b = new CallBudget();
    for (let i = 0; i < 40; i++) assert.equal(b.take('s1'), true, `call ${i + 1}`);
    assert.equal(b.take('s1'), false);
    assert.equal(b.take('s1'), false);
    assert.equal(b.take('s2'), true);
  });
  await test('call budget: entries older than the TTL are evicted on insert', () => {
    let t = 0;
    const b = new CallBudget(2, 1000, () => t);
    b.take('old'); b.take('old');
    assert.equal(b.take('old'), false);
    t = 500; b.take('mid');
    assert.equal(b.size, 2);
    t = 1200; b.take('new');            // sweep: 'old' (1200 ms) gone, 'mid' (700 ms) kept
    assert.equal(b.size, 2);
    assert.equal(b.take('old'), true, 'an expired key starts a fresh budget');
  });
  await test('request byte cap ≈ 2.1 MB covers the largest valid body', () => {
    assert.ok(MAX_REQUEST_BYTES > Buffer.alloc(MAX_AUDIO_BYTES).toString('base64').length + 600);
    assert.ok(MAX_REQUEST_BYTES < 2.2 * 1024 * 1024);
  });

  console.log('\nchunked body cap (final review #6):\n');
  const streamOf = (parts: string[]) => new ReadableStream<Uint8Array>({
    start(c) { for (const p of parts) c.enqueue(new TextEncoder().encode(p)); c.close(); },
  });
  await test('readBodyCapped: fits ⇒ the text; over ⇒ null; absent ⇒ empty', async () => {
    assert.equal(await readBodyCapped(streamOf(['{"a":', '1}']), 100), '{"a":1}');
    assert.equal(await readBodyCapped(streamOf(['12345', '67890']), 10), '1234567890');
    assert.equal(await readBodyCapped(streamOf(['12345', '678901']), 10), null);
    assert.equal(await readBodyCapped(null, 10), '');
  });
  await test('readBodyCapped: stops reading at the cap (stream cancelled)', async () => {
    let pulls = 0, cancelled = false;
    const big = new ReadableStream<Uint8Array>({
      pull(c) { pulls++; c.enqueue(new Uint8Array(1024)); },
      cancel() { cancelled = true; },
    });
    assert.equal(await readBodyCapped(big, 4096), null);
    assert.ok(cancelled, 'cancelled');
    assert.ok(pulls <= 6, `pulls=${pulls}`);
  });
  await test('route: no Content-Length ⇒ capped stream read before JSON parse; response carries measured', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'api', 'tutor', 'pronunciation', 'assess', 'route.ts'), 'utf8');
    const capIdx = src.indexOf('readBodyCapped(request.body, MAX_REQUEST_BYTES)');
    assert.ok(capIdx > 0, 'capped read');
    assert.ok(capIdx < src.indexOf('JSON.parse(text)'), 'cap before parse');
    assert.ok(capIdx < src.indexOf('TutorSession.findOne'), 'cap before the tenant gate');
    assert.match(src, /if \(text === null\) return notFound\(\);/);
    assert.match(src, /contentLength !== null && Number\(contentLength\) > MAX_REQUEST_BYTES\) return notFound\(\)/);
    assert.match(src, /const measured = isMeasuredResult\(out\);[\s\S]*measured \}\);/);
  });

  console.log('\npronunciation claim guard — measured bypass:\n');
  await test('measured:true never drops; default unchanged', () => {
    const s = 'It sounded like "bent" there.';
    assert.equal(isPronunciationClaimSentence(s, 'I went'), true);
    assert.equal(isPronunciationClaimSentence(s, 'I went', {}), true);
    assert.equal(isPronunciationClaimSentence(s, 'I went', { measured: false }), true);
    assert.equal(isPronunciationClaimSentence(s, 'I went', { measured: true }), false);
    assert.equal(isPronunciationClaimSentence('「last」の音が少し変わってしまいましたね。', 'the rest week', { measured: true }), false);
    assert.equal(claimsPronunciation(s, 'I went'), true);
    assert.equal(claimsPronunciation(s, 'I went', { measured: true }), false);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed) process.exit(1);
})();
