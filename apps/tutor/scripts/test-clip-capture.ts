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
  ClipCapture, CLIP_MAX_MS, CLIP_PRE_ROLL_MS, CLIP_MIN_MS, CLIP_SAMPLE_RATE, CLIP_NO_SPEECH_TIMEOUT_MS, PRONUNCIATION_ARM_MAX_MS, PRONUNCIATION_NOTE_WAIT_MS,
  float32ToPcm16, pcm16ToBase64, PRONUNCIATION_UNAVAILABLE_NOTE, pronunciationNoteForBrain, clipPeakDbfs, CLIP_SILENT_DBFS,
} from '../src/lib/tutor/pronunciation/clip-capture';
import { PRONUNCIATION_UNAVAILABLE_NOTE as SERVER_UNAVAILABLE_NOTE, MAX_CLIP_SECONDS } from '../src/lib/tutor/pronunciation/assessor';
import { MAX_AUDIO_BYTES } from '../src/lib/tutor/pronunciation/assess-request';
import { ttsLanguageFor } from '../src/lib/tutor/voice/tts-language';
import { withPronunciationCheckResult, PRONUNCIATION_ARM_MAX_MS, CLIP_NO_SPEECH_TIMEOUT_MS } from '../src/lib/tutor/pronunciation/clip-capture';
import { WHITEBOARD_TOOLS, REQUEST_PRONUNCIATION_CHECK_TOOL, mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';
import { NON_RENDER_TOOL_NAMES } from '../src/lib/tutor/voice/rule8-client';
import { isBoardContentTool } from '../src/lib/tutor/voice/question-anchor';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const SR = 24000;
const chunk = (n: number, v: number) => new Float32Array(n).fill(v);
const make = () => new ClipCapture({ maxMs: 10000, sampleRate: 24000 });

test('constants: 15 s max (W9-B1: run 5 cut both 9-word clips at 9.4 s), 24 kHz, 60 s no-speech timeout (Task 23 §G3 40 s; Task 30 fix round 1 60 s)', () => {
  assert.equal(CLIP_MAX_MS, 15000);
  // the max clip (pre-roll included) still fits the server: MAX_CLIP_SECONDS and the route's audio cap
  assert.ok(CLIP_MAX_MS / 1000 <= MAX_CLIP_SECONDS, 'clip max within the assessor clip_too_long cap');
  assert.ok((CLIP_MAX_MS / 1000) * CLIP_SAMPLE_RATE * 2 <= MAX_AUDIO_BYTES, 'clip max within the route audio cap');
  assert.ok(CLIP_PRE_ROLL_MS < CLIP_MAX_MS);
  // review F6: a 15 s clip's assessment (upload + ~2.5 s vendor) must land before the brain turn gives up on the note
  assert.equal(PRONUNCIATION_NOTE_WAIT_MS, 6000);
  assert.equal(CLIP_SAMPLE_RATE, 24000);
  assert.equal(CLIP_NO_SPEECH_TIMEOUT_MS, 60000);
  assert.ok(CLIP_NO_SPEECH_TIMEOUT_MS < PRONUNCIATION_ARM_MAX_MS, 'below the arm lifetime');
});
test('Task 23 §G3: the reason is no_speech_60s; the idle nudge stands down while a clip is armed', () => {
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes("plantPronunciationUnavailable('no_speech_60s');"));
  assert.ok(!v.includes("'no_speech_20s'"));
  assert.match(v, /const pronClipArmed = !!clipCaptureRef\.current\?\.isArmed\(\);\s*const busy =\s*pronClipArmed \|\|/);
  assert.match(v, /hardBusy:\s*pronClipArmed \|\|/);
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

test('pre-roll: the last preRollMs before the speech start opens the clip; older audio dropped', () => {
  const c = new ClipCapture({ maxMs: 10000, sampleRate: 24000, preRollMs: 500 });
  c.arm('Think.');
  c.push(chunk(SR, 0.1));          // 1 s of older audio
  c.push(chunk(SR / 4, 0.2));      // 250 ms
  c.push(chunk(SR / 4, 0.3));      // 250 ms — pre-roll = these two
  c.onSpeechStart();
  c.push(chunk(SR / 2, 0.4));
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.pcm16.length, SR);   // pre-roll + learner audio are uploaded
  assert.equal(clip.durationMs, 500);    // …but only the learner's audio counts
  assert.equal(clip.preRollMs, 500);
  assert.equal(clip.pcm16[0], Math.round(0.2 * 32767));
  assert.equal(clip.pcm16[SR / 4], Math.round(0.3 * 32767));
  assert.equal(clip.pcm16[SR / 2], Math.round(0.4 * 32767));
});

test('pre-roll: a single chunk longer than the window keeps only its tail; nothing kept when not armed', () => {
  const c = new ClipCapture({ maxMs: 10000, sampleRate: 24000, preRollMs: 500 });
  c.push(chunk(SR, 0.9)); // not armed
  c.arm('x');
  const big = new Float32Array(SR); big.fill(0.1); big.fill(0.2, SR - SR / 2);
  c.push(big);
  c.onSpeechStart();
  assert.equal(c.bufferedMs(), 0, 'pre-roll is not learner audio');
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.pcm16.length, SR / 2);
  assert.ok(clip.pcm16.every((v) => v === Math.round(0.2 * 32767)));
});

test('constant: production pre-roll 600 ms, minimum 400 ms', () => {
  assert.equal(CLIP_PRE_ROLL_MS, 600);
  assert.equal(CLIP_MIN_MS, 400);
});

const prod = () => new ClipCapture({ maxMs: 10000, sampleRate: 24000, preRollMs: 600, minMs: 400 });

test('minMs: a stop with only pre-roll (echo/noise blip) keeps the arm; the next real turn is the clip', () => {
  const c = prod();
  c.arm('I think so.');
  c.push(chunk(SR, 0.1));           // fills the 600 ms pre-roll
  c.onSpeechStart();                // blip
  c.push(chunk(SR / 10, 0.2));      // 100 ms after the start
  assert.equal(c.onSpeechStop(), null, 'blip dropped');
  assert.equal(c.isArmed(), true);
  assert.equal(c.isCapturing(), false);
  c.push(chunk(SR, 0.3));           // new pre-roll
  c.onSpeechStart();
  c.push(chunk(SR, 0.4));           // 1 s of the learner
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.durationMs, 1000);
  assert.equal(clip.preRollMs, 600);
  assert.equal(clip.referenceText, 'I think so.');
  assert.equal(clip.pcm16[0], Math.round(0.3 * 32767), 'the old blip audio is gone');
});

test('minMs: the SECOND short stop sends anyway (the learner is never stuck)', () => {
  const c = prod();
  c.arm('Thanks.');
  c.onSpeechStart();
  c.push(chunk(SR / 10, 0.2));
  assert.equal(c.onSpeechStop(), null);
  c.onSpeechStart();
  c.push(chunk(SR / 5, 0.2));       // 200 ms
  const clip = c.onSpeechStop();
  assert.ok(clip);
  assert.equal(clip.durationMs, 200);
  assert.equal(c.isArmed(), false);
});

test('minMs: a stop at ≥ minMs of learner audio is sent first time; pre-roll never makes up the difference', () => {
  const c = prod();
  c.arm('x');
  c.push(chunk(SR, 0.1));
  c.onSpeechStart();
  c.push(chunk(SR * 0.3, 0.2));     // 300 ms learner + 600 ms pre-roll = 900 ms total
  assert.equal(c.onSpeechStop(), null, '300 ms of learner audio is a blip despite the pre-roll');
  const d = prod();
  d.arm('x');
  d.onSpeechStart();
  d.push(chunk(SR * 0.4, 0.2));
  assert.ok(d.onSpeechStop());
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
  assert.equal(PRONUNCIATION_UNAVAILABLE_NOTE, 'No measured result: the recording of this sentence could not be measured. Say so in one short sentence (never say you cannot hear), ask for one more repeat and say the sentence again as the last sentence of your turn; coach stress and linking from your model only; do not describe sounds.'); // W9-B3
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

test('Task 24 §A2: clipPeakDbfs — zeros ⇒ −Infinity; full scale ⇒ 0; −40 dB clip above the silence floor', () => {
  assert.equal(clipPeakDbfs(new Int16Array(24000)), -Infinity);
  assert.equal(clipPeakDbfs(new Int16Array(0)), -Infinity);
  assert.equal(clipPeakDbfs(Int16Array.from([0, -32768, 5])), 0);
  const quiet = clipPeakDbfs(Int16Array.from([0, 328, -100]));
  assert.ok(Math.abs(quiet - -40) < 0.1, String(quiet));
  assert.equal(CLIP_SILENT_DBFS, -60);
  assert.ok(quiet >= CLIP_SILENT_DBFS);
  assert.ok(!(clipPeakDbfs(Int16Array.from([0, 16, -16])) >= CLIP_SILENT_DBFS));
});

// ── Wiring ────────────────────────────────────────────────────────────
const pending: Promise<void>[] = [];
function atest(name: string, fn: () => Promise<void>) {
  pending.push(fn().then(() => console.log(`  ok  ${name}`), (e) => { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }));
}
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');

test('tool: exact description, args, and NOT in the shared catalogue (other tenants\' cached prefix unchanged)', () => {
  assert.equal(REQUEST_PRONUNCIATION_CHECK_TOOL.name, 'request_pronunciation_check');
  assert.equal(REQUEST_PRONUNCIATION_CHECK_TOOL.description, 'Call right AFTER you have modelled the exact text and asked the student to repeat it; the next student turn is measured.');
  const params = REQUEST_PRONUNCIATION_CHECK_TOOL.parameters as { properties: Record<string, { enum?: string[] }>; required: string[] };
  assert.deepEqual(params.required, ['referenceText', 'kind']);
  assert.deepEqual(params.properties.kind.enum, ['word', 'sentence', 'natural']);
  assert.ok(!WHITEBOARD_TOOLS.some((t) => t.name === 'request_pronunciation_check'));
});

test('tool: maps to a bookkeeping command; never paints, never board content', () => {
  const cmd = mapFunctionCallToCommand('request_pronunciation_check', { referenceText: '  I think so. ', kind: 'sentence' }) as unknown as Record<string, unknown>;
  assert.deepEqual(cmd, { action: 'requestPronunciationCheck', referenceText: 'I think so.', kind: 'sentence' });
  const bad = mapFunctionCallToCommand('request_pronunciation_check', { kind: 'nonsense' }) as unknown as Record<string, unknown>;
  assert.deepEqual(bad, { action: 'requestPronunciationCheck', referenceText: '', kind: 'sentence' });
  assert.ok(NON_RENDER_TOOL_NAMES.has('request_pronunciation_check'));
  assert.equal(isBoardContentTool('request_pronunciation_check'), false);
});

atest('route result: {ok, armed, referenceText}; other tools pass through or get the default ack', async () => {
  const p = withPronunciationCheckResult(async (n) => `inner:${n}`);
  assert.deepEqual(JSON.parse(await p('request_pronunciation_check', { referenceText: ' Thank you. ', kind: 'sentence' })), { ok: true, armed: true, referenceText: 'Thank you.' });
  assert.equal(await p('show_text', {}), 'inner:show_text');
  assert.equal(await withPronunciationCheckResult(undefined)('show_text', {}), 'show_text executed successfully.');
});

test('route: tool appended and result wrapped only under pronunciationCheck && TUTOR_PRONUNCIATION_ASSESS', () => {
  const r = src('src/app/api/tutor/brain/stream/route.ts');
  assert.match(r, /if \(body\.pronunciationCheck === true && TUTOR_PRONUNCIATION_ASSESS\) \{[\s\S]{0,300}REQUEST_PRONUNCIATION_CHECK_TOOL\]/);
  assert.match(r, /body\.pronunciationCheck === true && TUTOR_PRONUNCIATION_ASSESS\s*\?\s*withPronunciationCheckResult\(withLevel\)\s*:\s*withLevel/);
});

test('runtime: gate, request field only when active, RT-2 site, learner mic tap, speech hooks', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(v, /const pronunciationActive = TUTOR_PRONUNCIATION_ASSESS && pronunciation && sessionMode !== 'text' && !!sessionId;/);
  assert.match(v, /pronunciationCheck: pronunciationActive \? true : undefined,/);
  assert.match(v, /pronunciationActive \? \[REQUEST_PRONUNCIATION_CHECK_TOOL\] : \[\]/);
  // Task 24 §A1: the realtime tap feeds the clip only with TUTOR_CLIP_FROM_PERCEPTION off.
  assert.match(v, /onStudentAudioChunk: pronunciationActive && !TUTOR_CLIP_FROM_PERCEPTION\s*\? [\s\S]{0,250}clipTapFrame\('realtime'\)\(float32\);[\s\S]{0,40}: audioRecordEnabled \? audioRecorder\.pushStudentChunk : undefined,/);
  assert.match(v, /const perceptionOnSpeechStart = useCallback\(\(e: PerceptionSpeechEvent\) => \{[\s\S]{0,700}if \(productionStateRef\.current === 'speaking' \|\| wasTutorSpeakingAt\(Date\.now\(\)\)\) \{\s*onDebugEvent\?\.\('pronunciation_start_ignored_tutor_speaking'[\s\S]{0,120}\} else \{\s*pronunciationCapture\.onSpeechStart\(\);/);
  assert.match(v, /new ClipCapture\(\{ maxMs: CLIP_MAX_MS, sampleRate: CLIP_SAMPLE_RATE, preRollMs: CLIP_PRE_ROLL_MS, minMs: CLIP_MIN_MS \}\)/);
  assert.match(v, /const perceptionOnSpeechStop = useCallback\(\(e: PerceptionSpeechEvent\) => \{[\s\S]{0,200}clipCaptureRef\.current\?\.onSpeechStop\(\);/);
  assert.ok(v.includes("'/api/tutor/pronunciation/assess'"));
});

test('runtime: note planted for the next turn; measured opens BOTH claim-guard sites for that turn only', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(v, /pronunciationMeasuredThisTurn = pronunciationMeasuredRef\.current;\s*(?:pronunciationLowScoreThisTurn = pronunciationLowScoreRef\.current;\s*pronunciationLowScoreRef\.current = false;\s*)?(?:\/\/[^\n]*\n\s*)?pronunciationNoteThisTurn = pronunciationResultNoteRef\.current;\s*pronunciationResultNoteRef\.current = null;\s*pronunciationMeasuredRef\.current = false;/);
  assert.match(v, /isPronunciationClaimSentence\(updatedSentence, transcript, pronunciationMeasuredThisTurn \? \{ measured: true \} : undefined\)/);
  assert.match(v, /claimsPronunciation\(fullText, transcript, pronunciationMeasuredThisTurn \? \{ measured: true \} : undefined\)/);
  assert.match(v, /data\.status === 'ok' && typeof data\.note === 'string'[\s\S]{0,400}plantPronunciationNote\(data\.note, measured(?:, measured && pronunciationLowScore\(data\.result, PRONUNCIATION_LOW_SCORE\))?\)/);
  assert.match(v, /PRONUNCIATION_NOTE_WAIT_MS/);
});

test('runtime (review r1): 20 s window starts at playback idle; the hold skips the call once the session is ending', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(v, /if \(productionStateRef\.current === 'speaking'\) \{\s*pronunciationTimerAwaitsIdleRef\.current = true;\s*return;\s*\}/);
  assert.match(v, /if \(realtime\.state !== 'speaking' && pronunciationTimerAwaitsIdleRef\.current\) \{\s*startPronunciationNoSpeechTimerRef\.current\(\);/);
  assert.match(v, /PRONUNCIATION_NOTE_WAIT_MS\); \}\)\]\);[\s\S]{0,200}if \(endingRef\.current \|\| farewellSealedRef\.current\) \{\s*onDebugEvent\?\.\('pronunciation_hold_skipped'[\s\S]{0,120}return;/);
});

test('runtime (final review #1a; Task 23 r1 m9): the arm has an absolute 75 s lifetime, then disarms + plants unavailable', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.equal(PRONUNCIATION_ARM_MAX_MS, 75000);
  // Task 30 fix round 1 ruling: 75 s stays the hard cap over the 60 s
  // no-speech window (a long model line can now reach the cap first).
  assert.ok(PRONUNCIATION_ARM_MAX_MS >= CLIP_NO_SPEECH_TIMEOUT_MS + 15000);
  // Started at the arm itself, BEFORE the playback-state branch (so a tutor
  // still speaking does not defer it).
  const armIdx = v.indexOf('const armPronunciationCheck = ');
  const timerIdx = v.indexOf('}, PRONUNCIATION_ARM_MAX_MS);', armIdx);
  const speakingIdx = v.indexOf("if (productionStateRef.current === 'speaking')", armIdx);
  assert.ok(armIdx > 0 && timerIdx > armIdx && timerIdx < speakingIdx, 'timer set at the arm, before the speaking branch');
  const body = v.slice(armIdx, timerIdx);
  assert.match(body, /if \(!capture\.isArmed\(\)\) return;\s*capture\.disarm\(\);[\s\S]{0,200}plantPronunciationUnavailable\('arm_expired_75s'\);/);
  // A sent clip ends the arm's lifetime timer.
  assert.match(v, /const sendPronunciationClip = \(clip: PronunciationClip\) => \{\s*clearPronunciationNoSpeechTimer\(\);\s*clearPronunciationArmMaxTimer\(\);/);
});

test('runtime (final review #1b): a segment change disarms the capture', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(v, /const disarmPronunciationOnSegmentAdvance = \(from: string, to: string\) => \{\s*const capture = clipCaptureRef\.current;\s*if \(!capture\?\.isArmed\(\) \|\| from === to\) return;\s*capture\.disarm\(\);[\s\S]{0,300}onDebugEvent\?\.\('pronunciation_disarmed_segment_advance'/);
  // applyResolvedAdvance (next / previous / id / Skip), free release, homework resume.
  assert.match(v, /disarmPronunciationOnSegmentAdvanceRef\.current\(currentSegmentIdRef\.current, next\);\s*currentSegmentIdRef\.current = next;/);
  assert.match(v, /disarmPronunciationOnSegmentAdvanceRef\.current\(currentSegmentIdRef\.current, ''\);\s*currentSegmentIdRef\.current = '';/);
  assert.match(v, /disarmPronunciationOnSegmentAdvanceRef\.current\(currentSegmentIdRef\.current, hwSeg\);\s*currentSegmentIdRef\.current = hwSeg;/);
});

test('runtime (final review #1c): an ok-but-not-measured route answer keeps the claim guard shut', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.match(v, /const measured = data\.measured === true;[\s\S]{0,200}plantPronunciationNote\(data\.note, measured(?:, measured && pronunciationLowScore\(data\.result, PRONUNCIATION_LOW_SCORE\))?\);/);
  assert.ok(!v.includes('plantPronunciationNote(data.note, true)'), 'no unconditional measured plant');
});

test('Task 24 §A1/§A2 wiring: clip from the recogniser frames (flag), silent clip not posted', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  const e = src('src/app/tutor-portal/embed/page.tsx');
  assert.match(v, /onStudentAudioChunk: pronunciationActive && !TUTOR_CLIP_FROM_PERCEPTION/);
  assert.equal((v.match(/onStudentAudioFrame: perceptionClipFrame,/g) ?? []).length, 2, 'both recogniser hooks');
  assert.ok(v.includes("const perceptionClipFrame = pronunciationActive && TUTOR_CLIP_FROM_PERCEPTION ? clipTapFrame('perception') : undefined;"));
  assert.ok(v.includes("onDebugEvent?.('pronunciation_tap', tap);"));
  assert.ok(v.includes('plantPronunciationUnavailable(`clip_silent peak=${peakLabel}dBFS`);'));
  for (const name of ['pronunciation_tap', 'pronunciation_note_rewritten']) assert.ok(e.includes(`'${name}'`), `embed persists ${name}`);
  for (const h of ['src/app/tutor/hooks/usePerceptionWS.ts', 'src/app/tutor/hooks/useCartesiaInkWS.ts']) {
    const t = src(h);
    const tap = t.indexOf('onStudentAudioFrameRef.current?.(');
    const guard = t.indexOf('readyState !== WebSocket.OPEN) return;', t.indexOf('processor.onaudioprocess'));
    assert.ok(tap > 0 && guard > tap, `${h}: the tap runs before the WS guard`);
    assert.ok(t.indexOf('if (mutedRef.current)', t.indexOf('processor.onaudioprocess')) < tap, `${h}: after the mute check`);
  }
});

test('debug events: the four exact names are emitted and persisted by the embed', () => {
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  const e = src('src/app/tutor-portal/embed/page.tsx');
  for (const name of ['pronunciation_armed', 'pronunciation_clip_sent', 'pronunciation_note_planted', 'pronunciation_unavailable', 'pronunciation_start_ignored_tutor_speaking', 'pronunciation_hold_skipped', 'pronunciation_disarmed_segment_advance']) {
    assert.ok(v.includes(`onDebugEvent?.('${name}'`), `emits ${name}`);
    assert.ok(e.includes(`'${name}'`), `embed persists ${name}`);
  }
  assert.match(e, /pronunciation=\{sessionOptions\.pronunciation\}/);
});

// Task 30 fix round 1 (§I1 ruling): the inert nudge-started timer is gone; the no-speech window is 60 s (from the model line's end), the 75 s arm lifetime the cap.
test('30I1 r1: CLIP_NO_SPEECH_TIMEOUT_MS = 60 000, started as before; PRONUNCIATION_ARM_MAX_MS = 75 000', () => {
  assert.equal(CLIP_NO_SPEECH_TIMEOUT_MS, 60000);
  assert.equal(PRONUNCIATION_ARM_MAX_MS, 75000);
  const v = src('src/app/tutor/components/VoiceTutorRealtime.tsx');
  assert.ok(!v.includes('pronunciationNudgeFiredRef'), 'no nudge-started timer');
  assert.ok(v.includes("plantPronunciationUnavailable('arm_expired_75s');"), 'the arm-max timer is kept');
  assert.ok(/if \(productionStateRef\.current === 'speaking'\) \{\s*pronunciationTimerAwaitsIdleRef\.current = true;\s*return;\s*\}\s*startPronunciationNoSpeechTimerRef\.current\(\);/.test(v), 'started at the arm (after the model line plays) as before');
});

void Promise.all(pending).then(() => {
if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
});
