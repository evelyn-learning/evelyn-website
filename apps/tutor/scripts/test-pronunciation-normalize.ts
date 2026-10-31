/**
 * Pronunciation normalisers — pins that the Azure Pronunciation Assessment and
 * Speechace Score Text v9 responses both map onto the one PronunciationResult
 * shape the bake-off (and later the tutor's pronunciation tool) reads.
 *
 * Fixtures are hand-written from each vendor's documented response shape
 * (src/lib/tutor/pronunciation/fixtures/). No network.
 *
 * Usage: npx tsx scripts/test-pronunciation-normalize.ts   (npm run test:pronunciation-normalize)
 */
import assert from 'node:assert';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { normalizeAzure, normalizeSpeechace, azureProsodyFlags } from '../src/lib/tutor/pronunciation/normalize';
import { buildAzureRequest } from '../src/lib/tutor/pronunciation/azure';
import { assessSpeechaceRaw } from '../src/lib/tutor/pronunciation/speechace';
import { wavToPcm16Mono } from './tutor/voice-harness/audio-util';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

const FIX = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'pronunciation', 'fixtures');
const azureJson = JSON.parse(fs.readFileSync(path.join(FIX, 'azure-sample.json'), 'utf8'));
const azureRestJson = JSON.parse(fs.readFileSync(path.join(FIX, 'azure-rest-sample.json'), 'utf8'));
const speechaceJson = JSON.parse(fs.readFileSync(path.join(FIX, 'speechace-sample.json'), 'utf8'));

console.log('\nnormalizeAzure:\n');
const az = normalizeAzure(azureJson);
test('vendor + overall = PronScore', () => {
  assert.equal(az.vendor, 'azure');
  assert.equal(az.overall, 70.6);
});
test('prosody and fluency come from the NBest[0] summary', () => {
  assert.equal(az.prosody, 64.5);
  assert.equal(az.fluency, 88);
});
test('every reference word is present, in order (omissions included)', () => {
  assert.deepEqual(az.words.map((w) => w.word), ['we', 'went', 'to', 'the', 'countryside']);
});
test('countryside: score 30, mispronunciation, phoneme k scored 0 (IPA)', () => {
  const w = az.words.find((x) => x.word === 'countryside')!;
  assert.equal(w.score, 30);
  assert.equal(w.errorType, 'mispronunciation');
  assert.deepEqual(w.phonemes[0], { ipa: 'k', score: 0 });
  assert.equal(w.phonemes.length, 9);
  assert.equal(w.phonemes[4].ipa, 'ɹ');
});
test('omitted word maps to errorType omission with no phonemes', () => {
  const w = az.words.find((x) => x.word === 'to')!;
  assert.equal(w.errorType, 'omission');
  assert.equal(w.score, 0);
  assert.deepEqual(w.phonemes, []);
});
test('clean words map to errorType none', () => {
  assert.equal(az.words[0].errorType, 'none');
  assert.equal(az.words[3].errorType, 'none');
});
test('Azure carries no syllable-stress verdict', () => {
  assert.ok(az.words.every((w) => w.stress === undefined));
});
test('latencyMs defaults to 0 (the client stamps it)', () => assert.equal(az.latencyMs, 0));
test('Task 24 §A3: display = NBest[0].Display (server diagnostics)', () => {
  assert.equal(az.display, 'We went the countryside.');
  assert.equal(normalizeAzure(azureRestJson).display, 'We went the countryside.');
});
test('prosody flags list break + monotone errors per word', () => {
  assert.deepEqual(azureProsodyFlags(azureJson), ['the: UnexpectedBreak', 'countryside: Monotone']);
});
test('prosody-only ErrorTypes (UnexpectedBreak/MissingBreak/Monotone) are not word errors', () => {
  const j = structuredClone(azureJson);
  j.NBest[0].Words[1].PronunciationAssessment.ErrorType = 'MissingBreak';
  assert.equal(normalizeAzure(j).words[1].errorType, 'none');
});
test('insertion maps to insertion', () => {
  const j = structuredClone(azureJson);
  j.NBest[0].Words[0].PronunciationAssessment.ErrorType = 'Insertion';
  assert.equal(normalizeAzure(j).words[0].errorType, 'insertion');
});
test('a NoMatch / empty response throws a readable error', () => {
  assert.throws(() => normalizeAzure({ RecognitionStatus: 'NoMatch' }), /NoMatch/);
  assert.throws(() => normalizeAzure(null), /azure/i);
});

console.log('\nnormalizeAzure — REST short-audio shape (flat scores):\n');
const azr = normalizeAzure(azureRestJson);
test('REST: same result as the SDK-shape fixture', () => assert.deepEqual(azr, az));
test('REST: countryside score 30, mispronunciation, k = 0', () => {
  const w = azr.words.find((x) => x.word === 'countryside')!;
  assert.equal(w.score, 30);
  assert.equal(w.errorType, 'mispronunciation');
  assert.deepEqual(w.phonemes[0], { ipa: 'k', score: 0 });
});
test('REST: overall / prosody / fluency read from NBest[0] directly', () => {
  assert.equal(azr.overall, 70.6);
  assert.equal(azr.prosody, 64.5);
  assert.equal(azr.fluency, 88);
});
test('REST: prosody flags', () => {
  assert.deepEqual(azureProsodyFlags(azureRestJson), ['the: UnexpectedBreak', 'countryside: Monotone']);
});
test('REST: omission keeps errorType omission', () => {
  assert.equal(azr.words.find((x) => x.word === 'to')!.errorType, 'omission');
});

console.log('\nnormalizeAzure — missing scores are an error, not 0:\n');
test('Success response without pronunciation scores throws (REST shape)', () => {
  const j = structuredClone(azureRestJson);
  for (const k of ['AccuracyScore', 'FluencyScore', 'ProsodyScore', 'CompletenessScore', 'PronScore']) delete j.NBest[0][k];
  assert.throws(() => normalizeAzure(j), /azure: no pronunciation scores in response/);
});
test('Success response without pronunciation scores throws (SDK shape)', () => {
  const j = structuredClone(azureJson);
  delete j.NBest[0].PronunciationAssessment;
  assert.throws(() => normalizeAzure(j), /azure: no pronunciation scores in response/);
});
test('plain recognition result (header ignored: no scores anywhere) throws', () => {
  assert.throws(() => normalizeAzure({ RecognitionStatus: 'Success', NBest: [{ Lexical: 'we went', Words: [{ Word: 'we' }, { Word: 'went' }] }] }), /no pronunciation scores/);
});
test('a scored word missing AccuracyScore throws; an omission without one scores 0', () => {
  const j = structuredClone(azureRestJson);
  delete j.NBest[0].Words[2].AccuracyScore; // 'to', Omission
  assert.equal(normalizeAzure(j).words[2].score, 0);
  delete j.NBest[0].Words[0].AccuracyScore; // 'we', None
  assert.throws(() => normalizeAzure(j), /azure: no score for word "we"/);
});
test('a phoneme missing AccuracyScore throws', () => {
  const j = structuredClone(azureRestJson);
  delete j.NBest[0].Words[4].Phonemes[0].AccuracyScore;
  assert.throws(() => normalizeAzure(j), /azure: no score for phoneme "k" in "countryside"/);
});

console.log('\nnormalizeSpeechace:\n');
const sa = normalizeSpeechace(speechaceJson);
test('vendor + overall = speechace_score.pronunciation', () => {
  assert.equal(sa.vendor, 'speechace');
  assert.equal(sa.overall, 72);
});
test('no fluency/prosody when the response has none', () => {
  assert.equal(sa.fluency, undefined);
  assert.equal(sa.prosody, undefined);
});
test('fluency read from speechace_score.fluency when present', () => {
  const j = structuredClone(speechaceJson);
  j.text_score.speechace_score.fluency = 81;
  assert.equal(normalizeSpeechace(j).fluency, 81);
});
test('words in order with quality_score as score', () => {
  assert.deepEqual(sa.words.map((w) => [w.word, w.score]), [['We', 98], ['developed', 54], ['it', 95]]);
});
test('developed: mispronunciation, stress wrong', () => {
  const w = sa.words[1];
  assert.equal(w.errorType, 'mispronunciation');
  assert.equal(w.stress, 'wrong');
});
test('ARPAbet phones convert to IPA (v → v, ih → ɪ, unstressed ah → ə)', () => {
  const w = sa.words[1];
  assert.deepEqual(w.phonemes.map((p) => p.ipa), ['d', 'ɪ', 'v', 'ɛ', 'l', 'ə', 'p', 't']);
  assert.deepEqual(w.phonemes[2], { ipa: 'v', score: 22 });
});
test('passing words: errorType none; monosyllables carry no stress verdict', () => {
  assert.equal(sa.words[0].errorType, 'none');
  assert.equal(sa.words[0].stress, undefined);
  assert.equal(sa.words[2].stress, undefined);
});
test('multi-syllable word with correct stress → stress ok', () => {
  const j = structuredClone(speechaceJson);
  for (const s of j.text_score.word_score_list[1].syllable_score_list) { s.stress_score = 95; s.predicted_stress_level = s.stress_level; }
  assert.equal(normalizeSpeechace(j).words[1].stress, 'ok');
});
test('success response without speechace_score.pronunciation throws', () => {
  const j = structuredClone(speechaceJson);
  delete j.text_score.speechace_score;
  assert.throws(() => normalizeSpeechace(j), /speechace: no pronunciation scores in response/);
});
test('a word missing quality_score throws', () => {
  const j = structuredClone(speechaceJson);
  delete j.text_score.word_score_list[1].quality_score;
  assert.throws(() => normalizeSpeechace(j), /speechace: no score for word "developed"/);
});
test('status error throws with the vendor short_message', () => {
  assert.throws(() => normalizeSpeechace({ status: 'error', short_message: 'error_invalid_parameters', detail_message: 'key' }), /error_invalid_parameters/);
  assert.throws(() => normalizeSpeechace(undefined), /speechace/i);
});

console.log('\nbuildAzureRequest (REST short audio, no network):\n');
const pcm = Buffer.from([1, 0, 2, 0, 3, 0, 4, 0]);
const req = buildAzureRequest(pcm, "I have worked with international customers.", { key: 'k123', region: 'eastus' });
test('URL: regional short-audio endpoint, en-US, detailed', () => {
  assert.equal(req.url, 'https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed');
});
test('headers: key, 16 kHz WAV content type, JSON accept', () => {
  assert.equal(req.headers['Ocp-Apim-Subscription-Key'], 'k123');
  assert.equal(req.headers['Content-Type'], 'audio/wav; codecs=audio/pcm; samplerate=16000');
  assert.equal(req.headers.Accept, 'application/json');
});
test('Pronunciation-Assessment header = base64 JSON: scripted, Phoneme, IPA, miscue, prosody, Comprehensive', () => {
  assert.deepEqual(JSON.parse(Buffer.from(req.headers['Pronunciation-Assessment'], 'base64').toString('utf8')), {
    ReferenceText: 'I have worked with international customers.',
    GradingSystem: 'HundredMark', Granularity: 'Phoneme', PhonemeAlphabet: 'IPA',
    EnableMiscue: true, EnableProsodyAssessment: true, Dimension: 'Comprehensive',
  });
});
test('body is a 16 kHz mono PCM16 WAV wrapping the samples unchanged', () => {
  const { sampleRate, pcm: back } = wavToPcm16Mono(req.body);
  assert.equal(sampleRate, 16000);
  assert.deepEqual([...back], [...pcm]);
});

async function testAsync(name: string, fn: () => Promise<void>) {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

(async () => {
  console.log('\nassessSpeechaceRaw timeout (local stalled server, no vendor call):\n');
  // mode 'headers': send 200 + headers, then never finish the body (covers res.text()).
  // mode 'silent': read the upload, never answer.
  const sockets = new Set<import('node:net').Socket>();
  const server = http.createServer((req, res) => {
    req.resume();
    if (req.url?.includes('user_id=headers')) { res.writeHead(200, { 'content-type': 'application/json' }); res.write('{"status":'); }
  });
  server.on('connection', (s) => { sockets.add(s); s.on('close', () => sockets.delete(s)); });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const host = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const pcm16 = Buffer.alloc(3200);
  for (const mode of ['silent', 'headers']) {
    await testAsync(`times out (${mode}) with a readable error`, async () => {
      const t0 = Date.now();
      await assert.rejects(assessSpeechaceRaw(pcm16, 'developed', { key: 'k', host, userId: mode }, { timeoutMs: 300 }), /speechace: no result after 300 ms/);
      assert.ok(Date.now() - t0 < 3000, 'gave up promptly');
    });
  }
  for (const s of sockets) s.destroy();
  server.close();

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
