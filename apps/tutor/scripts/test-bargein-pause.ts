/**
 * Pause-first barge-in decision core (src/lib/tutor/voice/bargein-pause.ts)
 * and its wiring (useOpenAIRealtime pauseSpeech/resumeSpeech, useCartesiaInkWS
 * onPartialTranscript, VoiceTutorRealtime).
 *
 * The cases are the 2026-10-17 GDI recordings: a human saying "Excuse me, can
 * you stop for a moment?" over the tutor (killed 1.5–2 s late by the final
 * transcript), a 37 ms blip at the opener, and the tutor's own Japanese echo.
 *
 * Run: npm run test:bargein-pause
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  decideBargeInPause,
  partialIsSubstantive,
  scorePartialSelfVoice,
  BARGEIN_PAUSE_MAX_MS,
  BARGEIN_PAUSE_MIN_PARTIAL_CHARS,
  BARGEIN_PAUSE_SELF_VOICE_MIN_CHARS,
  partialIsBackchannelOnly,
} from '../src/lib/tutor/voice/bargein-pause';
import { SELF_VOICE_THRESHOLD } from '../src/lib/tutor/voice/perception-classifier';
import { shouldPauseForOnset, BARGEIN_PAUSE_MAX_NO_EVIDENCE_PER_TURN } from '../src/lib/tutor/voice/bargein-pause';
import { TUTOR_BARGEIN_PAUSE_FIRST } from '../src/lib/tutor/orchestrator/flags';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}\n    ${(e as Error).message}`); failed++; }
}

const base = { state: 'speaking', elapsedMs: 400, speechStopped: false, partial: null as string | null, selfVoiceScore: null as number | null, energyGatePassed: false };

test('a real interruption kills on its first content partial, ~300–600 ms after the onset', () => {
  assert.equal(decideBargeInPause({ ...base, partial: 'stop please', selfVoiceScore: 0 }), 'kill');
  assert.equal(decideBargeInPause({ ...base, partial: 'Excuse me, can you', selfVoiceScore: 0.1 }), 'kill');
  assert.equal(decideBargeInPause({ ...base, partial: 'すみません、もう一度', selfVoiceScore: 0 }), 'kill');
  // Partial arrives after the student already stopped: still their words.
  assert.equal(decideBargeInPause({ ...base, speechStopped: true, partial: 'stop please', selfVoiceScore: 0 }), 'kill');
});

test("the tutor's own echo resumes: partial matches the TTS script", () => {
  assert.equal(decideBargeInPause({ ...base, partial: '今日は経験について', selfVoiceScore: 1 }), 'resume');
  assert.equal(decideBargeInPause({ ...base, partial: 'Let us practice talking', selfVoiceScore: SELF_VOICE_THRESHOLD }), 'resume');
  // embed-1792275630905: "Did you" scored 0.90 against "What did you do
  // yesterday?" while the student was saying "Did you stop in between?" —
  // too short to call echo; wait for the next partial.
  assert.equal(BARGEIN_PAUSE_SELF_VOICE_MIN_CHARS, 8);
  assert.equal(decideBargeInPause({ ...base, partial: 'Did you', selfVoiceScore: 0.9 }), 'wait');
  assert.equal(decideBargeInPause({ ...base, partial: 'Did you stop in', selfVoiceScore: 0.2 }), 'kill');
});

test('a backchannel-only partial is not an interruption yet (embed-1792275630905: "Okay" killed, then dropped as noise)', () => {
  for (const p of ['Okay', 'Okay, okay.', 'yeah', 'Mm-hmm', 'はい', 'うん、うん', 'Oh, okay']) assert.equal(partialIsBackchannelOnly(p), true, p);
  for (const p of ['Okay, can you wait', 'yes but', 'はい、ちょっと待って', 'stop']) assert.equal(partialIsBackchannelOnly(p), false, p);
  assert.equal(decideBargeInPause({ ...base, partial: 'Okay', selfVoiceScore: 0 }), 'wait');
  assert.equal(decideBargeInPause({ ...base, partial: 'Okay, okay.', selfVoiceScore: 0, speechStopped: true }), 'resume');
  assert.equal(decideBargeInPause({ ...base, partial: 'Okay, can you wait', selfVoiceScore: 0 }), 'kill');
});

test('a blip resumes: speech stopped before any words; nothing in time resumes too', () => {
  assert.equal(decideBargeInPause({ ...base, elapsedMs: 40, speechStopped: true }), 'resume');
  assert.equal(decideBargeInPause({ ...base, elapsedMs: 300, speechStopped: true, partial: 'Eh,' }), 'resume', 'too short to count');
  assert.equal(decideBargeInPause({ ...base, elapsedMs: 300, partial: 'Eh,' }), 'wait');
  assert.equal(decideBargeInPause({ ...base, elapsedMs: BARGEIN_PAUSE_MAX_MS - 1 }), 'wait');
  assert.equal(decideBargeInPause({ ...base, elapsedMs: BARGEIN_PAUSE_MAX_MS }), 'resume');
});

test('the energy gate still kills; a turn that ended on its own has nothing to protect', () => {
  assert.equal(decideBargeInPause({ ...base, energyGatePassed: true }), 'kill');
  assert.equal(decideBargeInPause({ ...base, state: 'listening', partial: 'stop please', selfVoiceScore: 0 }), 'resume');
});

test('content means ≥4 letters / kana / kanji, punctuation and spaces aside', () => {
  assert.equal(BARGEIN_PAUSE_MIN_PARTIAL_CHARS, 4);
  for (const p of ['stop', 'ちょっと', '今日は経', 'Can you']) assert.equal(partialIsSubstantive(p), true, p);
  for (const p of ['Eh,', 'um', 'はい', '...', '', null, undefined]) assert.equal(partialIsSubstantive(p), false, String(p));
});

test('self-voice: echo of the sentence playing scores high; the student does not', () => {
  const now = Date.now();
  const scripts = [
    { id: 1, text: '今日は「経験」について英語で話す練習をしましょう。', spokenStartedAt: now - 2500, spokenEndedAt: null },
    { id: 2, text: "Let's practice talking about your experiences in English today.", spokenStartedAt: now - 1200, spokenEndedAt: null },
    { id: 3, text: 'An earlier sentence that finished long ago.', spokenStartedAt: now - 40_000, spokenEndedAt: now - 36_000 },
  ];
  const onset = now - 700;
  assert.ok(scorePartialSelfVoice('今日は経験について', scripts, onset, now) >= SELF_VOICE_THRESHOLD);
  assert.ok(scorePartialSelfVoice("Let's practice talking about", scripts, onset, now) >= SELF_VOICE_THRESHOLD);
  for (const p of ['stop please', 'Excuse me, can you stop', 'すみません、もう一度', 'Wait, can you say that']) {
    assert.ok(scorePartialSelfVoice(p, scripts, onset, now) < SELF_VOICE_THRESHOLD, p);
  }
});

test('wiring: pause at a speaking onset, partials and stops decide, every kill or refusal resumes the clock', () => {
  assert.equal(TUTOR_BARGEIN_PAUSE_FIRST, true, 'default ON');
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes('if (canStage3) beginBargeInPause();'));
  assert.ok(vtr.includes("onPartialTranscript: perceptionOnPartialTranscript,"));
  assert.ok(vtr.includes('bargeInPauseRef.current.speechStopped = true;'));
  assert.equal(vtr.split('if (pausedForBargeIn) { try { realtime.resumeSpeech(); } catch {} }').length - 1, 3, 'all three kill refusals resume');
  for (const ev of ['perception_bargein_paused', 'perception_bargein_pause_kill', 'perception_bargein_pause_resume']) assert.ok(vtr.includes(`'${ev}'`), ev);
  const rt = readFileSync('src/app/tutor/hooks/useOpenAIRealtime.ts', 'utf8');
  assert.ok(rt.includes('void ctx.suspend().catch('));
  assert.ok(rt.includes('const clearSpeechQueue = useCallback((): Promise<void> => {\n    // A kill while paused for a barge-in'));
  const ink = readFileSync('src/app/tutor/hooks/useCartesiaInkWS.ts', 'utf8');
  assert.ok(ink.includes("onPartialTranscriptRef.current?.({ text: data.transcript, tMs })"));
  const embed = readFileSync('src/app/tutor-portal/embed/page.tsx', 'utf8');
  assert.ok(embed.includes("'perception_'"), 'pause events persist under the perception_ prefix');
});

test('echo-shaped turn (embed-1792354826479): after one no-evidence resume, later onsets in the same tutor turn do not pause; a new turn starts fresh', () => {
  assert.equal(BARGEIN_PAUSE_MAX_MS, 1000, 'max wait shortened: real interruptions were confirmed in 346–653 ms');
  assert.equal(BARGEIN_PAUSE_MAX_NO_EVIDENCE_PER_TURN, 1);
  assert.equal(shouldPauseForOnset({ noEvidenceResumesThisTurn: 0 }), true);
  assert.equal(shouldPauseForOnset({ noEvidenceResumesThisTurn: 1 }), false);
  const vtr = readFileSync('src/app/tutor/components/VoiceTutorRealtime.tsx', 'utf8');
  assert.ok(vtr.includes("'perception_bargein_pause_skipped'"));
  assert.ok(vtr.includes("if (reason === 'no evidence in time') bargeInNoEvidenceResumesRef.current += 1;"));
  assert.ok(vtr.includes('bargeInNoEvidenceResumesRef.current = 0;'), 'reset at each brain turn start');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
