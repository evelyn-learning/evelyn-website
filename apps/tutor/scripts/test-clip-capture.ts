/**
 * Pronunciation check (GDI trial, 2026-10-28, design §3): after the tutor
 * models a word or sentence and calls `request_pronunciation_check`, the
 * learner's NEXT turn is captured from the mic tap as one clip, scored
 * server-side, and the result reaches the next brain turn as a note.
 * This suite pins the pure capture state machine
 * (lib/tutor/pronunciation/clip-capture.ts).
 *
 * Run: npx tsx scripts/test-clip-capture.ts
 */
import { strict as assert } from 'node:assert';
import {
  ClipCapture, CLIP_MAX_MS, CLIP_SAMPLE_RATE, CLIP_NO_SPEECH_TIMEOUT_MS,
  float32ToPcm16, pcm16ToBase64, PRONUNCIATION_UNAVAILABLE_NOTE, pronunciationNoteForBrain,
} from '../src/lib/tutor/pronunciation/clip-capture';
import { PRONUNCIATION_UNAVAILABLE_NOTE as SERVER_UNAVAILABLE_NOTE } from '../src/lib/tutor/pronunciation/assessor';
import { ttsLanguageFor } from '../src/lib/tutor/voice/tts-language';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const SR = 24000;
const chunk = (n: number, v: number) => new Float32Array(n).fill(v);
const make = () => new ClipCapture({ maxMs: 10000, sampleRate: 24000 });

test('constants: 10 s max, 24 kHz, 20 s no-speech timeout', () => {
  assert.equal(CLIP_MAX_MS, 10000);
  assert.equal(CLIP_SAMPLE_RATE, 24000);
  assert.equal(CLIP_NO_SPEECH_TIMEOUT_MS, 20000);
});

test('not armed ⇒ push ignored and onSpeechStop null', () => {
  const c = make();
  assert.equal(c.isArmed(), false);
  c.onSpeechStart();
  c.push(chunk(2400, 0.5));
  assert.equal(c.onSpeechStop(), null);
  assert.equal(c.isArmed(), false);
});

test('armed but no speech start ⇒ push ignored (tutor audio before the learner speaks)', () => {
  const c = make();
  c.arm('I think so.');
  c.push(chunk(2400, 0.5));
  assert.equal(c.isCapturing(), false);
  c.onSpeechStart();
  c.push(chunk(2400, 0.25));
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.pcm16.length, 2400);
  assert.equal(clip.pcm16[0], Math.round(0.25 * 32767));
});

test('armed ⇒ chunks between start and stop concatenated as PCM16, duration correct', () => {
  const c = make();
  c.arm('Three things.');
  assert.equal(c.isArmed(), true);
  c.onSpeechStart();
  assert.equal(c.isCapturing(), true);
  c.push(chunk(12000, 0.5));
  c.push(chunk(12000, -0.5));
  c.push(chunk(12000, 0));
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.referenceText, 'Three things.');
  assert.ok(clip.pcm16 instanceof Int16Array);
  assert.equal(clip.pcm16.length, 36000);
  assert.equal(clip.durationMs, 1500);
  assert.ok(clip.pcm16[0] > 16000 && clip.pcm16[0] < 16500);
  assert.ok(clip.pcm16[12000] < -16000 && clip.pcm16[12000] > -16500);
  assert.equal(clip.pcm16[24000], 0);
});

test('one clip per arm: disarmed after the stop; a resume does not re-open it', () => {
  const c = make();
  c.arm('Thank you.');
  c.onSpeechStart();
  c.push(chunk(24000, 0.1));
  assert.ok(c.onSpeechStop());
  assert.equal(c.isArmed(), false);
  c.onSpeechStart(); // turn.resume after the eager_end
  c.push(chunk(24000, 0.1));
  assert.equal(c.onSpeechStop(), null);
});

test('stop with < 0.4 s buffered still returns the clip (the server answers clip_too_short)', () => {
  const c = make();
  c.arm('Thanks.');
  c.onSpeechStart();
  c.push(chunk(2400, 0.1)); // 0.1 s
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.durationMs, 100);
});

test('stop after start with nothing buffered ⇒ null, and the capture stays armed for the real turn', () => {
  const c = make();
  c.arm('Thanks.');
  c.onSpeechStart();
  assert.equal(c.onSpeechStop(), null);
  assert.equal(c.isArmed(), true);
});

test('maxMs truncates: push returns the clip at 10 s and disarms; later stop is null', () => {
  const c = make();
  c.arm('A long sentence.');
  c.onSpeechStart();
  let got = null;
  for (let i = 0; i < 11 && !got; i++) got = c.push(chunk(SR, 0.2)); // 1 s chunks
  assert.ok(got, 'push returned the clip on reaching maxMs');
  assert.equal(got.pcm16.length, 10 * SR);
  assert.equal(got.durationMs, 10000);
  assert.equal(c.isArmed(), false);
  assert.equal(c.onSpeechStop(), null);
});

test('maxMs: a chunk straddling the limit is cut to exactly maxMs', () => {
  const c = make();
  c.arm('x');
  c.onSpeechStart();
  assert.equal(c.push(chunk(9.5 * SR, 0.1)), null);
  const clip = c.push(chunk(SR, 0.1));
  assert.ok(clip);
  assert.equal(clip.pcm16.length, 10 * SR);
});

test('a second arm before the stop replaces the reference text', () => {
  const c = make();
  c.arm('first');
  c.arm('second');
  c.onSpeechStart();
  c.push(chunk(SR, 0.1));
  c.arm('third'); // during capture: text replaced, audio kept
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.referenceText, 'third');
  assert.equal(clip.pcm16.length, SR);
});

test('disarm drops everything', () => {
  const c = make();
  c.arm('x');
  c.onSpeechStart();
  c.push(chunk(SR, 0.1));
  c.disarm();
  assert.equal(c.isArmed(), false);
  assert.equal(c.isCapturing(), false);
  assert.equal(c.onSpeechStop(), null);
});

test('push copies: mutating the source buffer after push does not change the clip', () => {
  const c = make();
  c.arm('x');
  c.onSpeechStart();
  const buf = chunk(SR, 0.1);
  c.push(buf);
  buf.fill(0.9);
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.pcm16[0], Math.round(0.1 * 32767));
});

test('float32ToPcm16 clamps out-of-range samples', () => {
  const out = float32ToPcm16(new Float32Array([2, -2, 1, -1, 0, NaN]));
  assert.deepEqual(Array.from(out), [32767, -32768, 32767, -32768, 0, 0]);
});

test('pcm16ToBase64: little-endian bytes', () => {
  const b64 = pcm16ToBase64(new Int16Array([1, -1, 256]));
  assert.deepEqual(Array.from(Buffer.from(b64, 'base64')), [1, 0, 0xff, 0xff, 0, 1]);
});

test('client unavailable note === the server\'s exact sentence', () => {
  assert.equal(PRONUNCIATION_UNAVAILABLE_NOTE, SERVER_UNAVAILABLE_NOTE);
  assert.equal(PRONUNCIATION_UNAVAILABLE_NOTE, 'No measured result: coach stress and linking from your model; do not describe sounds.');
});

test('planted note uses the runtime-note convention and carries the route note verbatim', () => {
  const n = pronunciationNoteForBrain('Measured pronunciation of "Thank you.": overall 60/100.');
  assert.ok(n.startsWith('[pronunciation check result — not from the student] '));
  assert.ok(n.endsWith('Measured pronunciation of "Thank you.": overall 60/100.'));
});

test('TTS: an all-Latin model sentence in a bilingual (en+ja) session is voiced as English', () => {
  assert.equal(ttsLanguageFor('Repeat after me: I think three things.', ['en', 'ja']), 'en');
  assert.equal(ttsLanguageFor('もう一度言ってください。', ['en', 'ja']), 'ja');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
