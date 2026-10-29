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
import { assessPronunciation, formatPronunciationNote, PRONUNCIATION_UNAVAILABLE_NOTE } from '../src/lib/tutor/pronunciation/assessor';
import { resamplePcm16 } from '../src/lib/tutor/pronunciation/resample';
import { parseAssessBody, pronunciationRouteEnabled, MAX_AUDIO_BYTES } from '../src/lib/tutor/pronunciation/assess-request';
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
