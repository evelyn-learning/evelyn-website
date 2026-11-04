/**
 * Task 43 §F (voice run 21, embed-1793719782028, 441 / 624 / 874 / 1116 s):
 * the end-of-turn validators (transition ask off part, offer missing, repeat
 * ask third version, move-on ignored, required phrase missing) killed turns
 * whose first sentences had already played — the learner heard "Please…" /
 * "You went with your…" cut off, then the retry. On validator-prone turns the
 * attempt's TTS gate stays closed until the validators pass (capped), so a
 * kill drops the sentences pre-audio — validator-tts-hold.ts.
 *
 * Run: npx tsx scripts/test-validator-tts-hold.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validatorTtsHold, VALIDATOR_TTS_HOLD_MS } from '../src/lib/tutor/voice/validator-tts-hold';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const pin = (src: string, re: RegExp) => assert.ok(re.test(src), `missing ${re}`);

const base = { enabled: true, voice: true, attempt: 0, fixedScript: true, noteDelivered: false, repeatAttempts: 0, moveOnRequested: false, requiredPhrasesPending: false };
test('F: a part whose required phrases are still unchecked holds (required_phrase_missing — bot run r43, 1203 s)', () => {
  assert.equal(validatorTtsHold({ ...base, requiredPhrasesPending: true }), true);
});
test('F: a fixed-script voice turn that carries an urgent runtime note (offer / advance / entry / close) holds', () => {
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true }), true);
});
test('F: the third try of a repeat ask holds (repeat_ask_third_version)', () => {
  assert.equal(validatorTtsHold({ ...base, repeatAttempts: 2 }), true);
  assert.equal(validatorTtsHold({ ...base, repeatAttempts: 1 }), false);
});
test('F: a move-on request holds (move_on_ignored)', () => {
  assert.equal(validatorTtsHold({ ...base, moveOnRequested: true }), true);
});
test('F: an ordinary turn never holds; text sessions, retries, non-fixed plans and the flag off never hold', () => {
  assert.equal(validatorTtsHold(base), false);
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true, voice: false }), false);
  // bot run r42 (554 s): the retry after a pre-audio kill was cut audibly — attempt 1 holds too; later attempts never
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true, attempt: 1 }), true);
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true, attempt: 2 }), false);
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true, fixedScript: false }), false);
  assert.equal(validatorTtsHold({ ...base, noteDelivered: true, enabled: false }), false);
});
test('F: the hold is capped (bounded latency) — 3.5 s from the attempt start', () => {
  assert.equal(VALIDATOR_TTS_HOLD_MS, 3500);
});
test('F: VTR wiring — prone turns gate until the validators pass; stream end keeps the gate; the success path opens it (pins)', () => {
  const VTR = read('src/app/tutor/components/VoiceTutorRealtime.tsx');
  pin(VTR, /const validatorHold = validatorTtsHold\(\{\s*enabled: TUTOR_VALIDATOR_TTS_HOLD,\s*voice: sessionMode !== 'text',\s*attempt,\s*fixedScript: isFixedScriptPlan\(lessonPlanRef\.current\),\s*noteDelivered: fixedScriptNoteDeliveredThisTurnRef\.current,\s*repeatAttempts: repeatAskTriesRef\.current\?\.segmentId === \(turnStartSegmentId \?\? ''\) \? \(repeatAskTriesRef\.current\?\.attempts \?\? 0\) : 0,\s*moveOnRequested: !!moveOnRequestSpan\(transcript\),\s*requiredPhrasesPending: rpPendingHold,[\s\S]{0,500}?pronunciationRepeatProne: [\s\S]{0,400}?\}\);/);
  pin(VTR, /const gateTimer = setTimeout\(\(\) => \{\s*if \(validatorHold && gateState === 'gated'\) onDebugEvent\?\.\('validator_tts_hold_deadline', `\$\{pendingSentences\.length\} sentence\(s\) spoken before the validators`\);\s*openGate\(\);\s*\}, skipTurnMarkerPresent \? 3_600_000 : validatorHold \? VALIDATOR_TTS_HOLD_MS : 1000\);/);
  pin(VTR, /if \(!skipNoAdvanceAtStreamEnd\) \{\s*if \(validatorHold && gateState === 'gated'\) \{[\s\S]{0,300}?onDebugEvent\?\.\('validator_tts_hold_kept', `\$\{pendingSentences\.length\} sentence\(s\) wait for the validators`\);\s*\} else \{\s*openGate\(\);[\s\S]{0,700}?releaseVerdictHold\(\);\s*\}\s*\}/);
  pin(VTR, /if \(validatorHold && gateState === 'gated'\) onDebugEvent\?\.\('validator_tts_hold_released', `\$\{pendingSentences\.length\} sentence\(s\) after the validators`\);\s*openGate\(\);\s*releaseVerdictHold\(\);\s*break;/);
  // final review C-1 / I-2: the gate opens once the kill-capable validators have run — BEFORE the engine appends its lines and before the continuation decision
  pin(VTR, /if \(validatorHold && gateState === 'gated' && !attemptKilled\) \{\s*onDebugEvent\?\.\('validator_tts_hold_released', `\$\{pendingSentences\.length\} sentence\(s\) after the validators`\);\s*openGate\(\);\s*releaseVerdictHold\(\);\s*\}\s*if \(validatorHoldTimer\) clearTimeout\(validatorHoldTimer\);\s*if \(!attemptKilled && engineOfferLines && engineOfferSeg/);
  // final review I-3: the cap has its own timer that no tool path clears
  pin(VTR, /const validatorHoldTimer = validatorHold \? setTimeout\(\(\) => \{\s*if \(gateState !== 'gated'\) return;\s*onDebugEvent\?\.\('validator_tts_hold_deadline', `\$\{pendingSentences\.length\} sentence\(s\) spoken before the validators`\);\s*openGate\(\);\s*releaseVerdictHold\(\);\s*\}, VALIDATOR_TTS_HOLD_MS\) : null;/);
  pin(VTR, /releaseVerdictHold\(\);\s*\}\s*if \(validatorHoldTimer\) clearTimeout\(validatorHoldTimer\);\s*if \(!attemptKilled && engineOfferLines/);
  // final review I-5: the required-phrases reason holds once per part
  pin(VTR, /requiredPhrasesPending: rpPendingHold,/);
  pin(VTR, /if \(rpPendingHold && validatorHold\) requiredPhrasesHoldSegsRef\.current\.add\(currentSegmentIdRef\.current \?\? ''\);/);
  // bot run r41 (heard=1 at the 137 / 617 / 1009 s kills): the fast opener and the rolling hold's lookahead / cap / engage flushes bypassed the gate
  pin(VTR, /gateState === 'gated' &&\s*\/\/[^\n]*\n\s*!validatorHold &&\s*isSafeOpener\(trimmedSentence\)/);
  pin(VTR, /if \(pendingSentences\.length > 0 && !validatorHold\) flushPending\(\);\s*pendingSentences\.push\(sentenceForSpeech\);/);
  pin(VTR, /if \(gateState === 'gated' && pendingSentences\.length > 0 && !validatorHold\) flushPending\(\);\s*\}, VALIDATE_BEFORE_SPEAK_CAP_MS\);/);
  pin(VTR, /if \(!validatorHold\) flushPending\(\);\s*vbsRolling = true;/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_VALIDATOR_TTS_HOLD = process\.env\.NEXT_PUBLIC_TUTOR_VALIDATOR_TTS_HOLD !== 'off';/);
  pin(read('src/app/tutor-portal/embed/page.tsx'), /'validator_tts_hold_'/);
});

test('45 §7a: the pronunciation part with an item already practised is validator-prone (pronunciation_item_repeated kills pre-audio)', () => {
  const base = { enabled: true, voice: true, attempt: 0, fixedScript: true, noteDelivered: false, repeatAttempts: 0, moveOnRequested: false, requiredPhrasesPending: false };
  assert.equal(validatorTtsHold({ ...base, pronunciationRepeatProne: true }), true);
  assert.equal(validatorTtsHold({ ...base, pronunciationRepeatProne: false }), false);
  assert.equal(validatorTtsHold({ ...base, pronunciationRepeatProne: true, attempt: 2 }), false, 'attempt 2 never holds');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall validator-tts-hold tests passed');
