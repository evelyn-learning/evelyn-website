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
import fs from 'node:fs';
import path from 'node:path';
import { normalizeAzure, normalizeSpeechace, azureProsodyFlags } from '../src/lib/tutor/pronunciation/normalize';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (err) { failed++; console.log(`  ✗ ${name} — ${(err as Error).message}`); }
}

const FIX = path.join(__dirname, '..', 'src', 'lib', 'tutor', 'pronunciation', 'fixtures');
const azureJson = JSON.parse(fs.readFileSync(path.join(FIX, 'azure-sample.json'), 'utf8'));
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
test('status error throws with the vendor short_message', () => {
  assert.throws(() => normalizeSpeechace({ status: 'error', short_message: 'error_invalid_parameters', detail_message: 'key' }), /error_invalid_parameters/);
  assert.throws(() => normalizeSpeechace(undefined), /speechace/i);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
