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

const base = { enabled: true, voice: true, attempt: 0, fixedScript: true, noteDelivered: false, repeatAttempts: 0, moveOnRequested: false };
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
  pin(VTR, /const validatorHold = validatorTtsHold\(\{\s*enabled: TUTOR_VALIDATOR_TTS_HOLD,\s*voice: sessionMode !== 'text',\s*attempt,\s*fixedScript: isFixedScriptPlan\(lessonPlanRef\.current\),\s*noteDelivered: fixedScriptNoteDeliveredThisTurnRef\.current,\s*repeatAttempts: repeatAskTriesRef\.current\?\.segmentId === \(turnStartSegmentId \?\? ''\) \? \(repeatAskTriesRef\.current\?\.attempts \?\? 0\) : 0,\s*moveOnRequested: !!moveOnRequestSpan\(transcript\),\s*\}\);/);
  pin(VTR, /const gateTimer = setTimeout\(\(\) => \{\s*if \(validatorHold && gateState === 'gated'\) onDebugEvent\?\.\('validator_tts_hold_deadline', `\$\{pendingSentences\.length\} sentence\(s\) spoken before the validators`\);\s*openGate\(\);\s*\}, skipTurnMarkerPresent \? 3_600_000 : validatorHold \? VALIDATOR_TTS_HOLD_MS : 1000\);/);
  pin(VTR, /if \(!skipNoAdvanceAtStreamEnd\) \{\s*if \(validatorHold && gateState === 'gated'\) \{[\s\S]{0,300}?onDebugEvent\?\.\('validator_tts_hold_kept', `\$\{pendingSentences\.length\} sentence\(s\) wait for the validators`\);\s*\} else \{\s*openGate\(\);[\s\S]{0,700}?releaseVerdictHold\(\);\s*\}\s*\}/);
  pin(VTR, /if \(validatorHold && gateState === 'gated'\) onDebugEvent\?\.\('validator_tts_hold_released', `\$\{pendingSentences\.length\} sentence\(s\) after the validators`\);\s*openGate\(\);\s*releaseVerdictHold\(\);\s*break;/);
  // bot run r41 (heard=1 at the 137 / 617 / 1009 s kills): the fast opener and the rolling hold's lookahead / cap / engage flushes bypassed the gate
  pin(VTR, /gateState === 'gated' &&\s*\/\/[^\n]*\n\s*!validatorHold &&\s*isSafeOpener\(trimmedSentence\)/);
  pin(VTR, /if \(pendingSentences\.length > 0 && !validatorHold\) flushPending\(\);\s*pendingSentences\.push\(sentenceForSpeech\);/);
  pin(VTR, /if \(gateState === 'gated' && pendingSentences\.length > 0 && !validatorHold\) flushPending\(\);\s*\}, VALIDATE_BEFORE_SPEAK_CAP_MS\);/);
  pin(VTR, /if \(!validatorHold\) flushPending\(\);\s*vbsRolling = true;/);
  pin(read('src/lib/tutor/orchestrator/flags.ts'), /export const TUTOR_VALIDATOR_TTS_HOLD = process\.env\.NEXT_PUBLIC_TUTOR_VALIDATOR_TTS_HOLD !== 'off';/);
  pin(read('src/app/tutor-portal/embed/page.tsx'), /'validator_tts_hold_'/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall validator-tts-hold tests passed');
