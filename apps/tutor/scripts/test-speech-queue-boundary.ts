/**
 * Task 17 (GDI live, embed-1793326847152 02:35:44): a repeat_after_correct /
 * required_phrase_missing kill lets the sentence in flight finish instead of
 * cutting it mid-word — speech-queue-boundary.ts + static pins on the hook
 * and the orchestrator.
 *
 * Run: npx tsx scripts/test-speech-queue-boundary.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  partitionQueueAtSentenceBoundary,
  shouldFinishInFlightSentence,
  resumeTailAfterBoundary,
  SENTENCE_BOUNDARY_KILL_ACTIONS,
  SENTENCE_BOUNDARY_CAP_MS,
} from '../src/lib/tutor/voice/speech-queue-boundary';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const A = 'Thanks for telling us.';
const B = 'Your IT manager checks the servers every day.';
const C = 'Could you say the whole sentence once more?';

console.log('partitionQueueAtSentenceBoundary');
test('three sentences, the middle one in flight: keep its remaining chunks, drop the third', () => {
  // A already played; B is playing with 2 chunks left (one may still be a
  // streamed tail); C is queued with 2 chunks.
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [B, B, C, C], scriptIds: [2, 2, 3, 3] },
    { sentence: B, scriptId: 2 },
  );
  assert.equal(p.keepCount, 2);
  assert.deepEqual(p.droppedScriptIds, [3]);
});
test('only the in-flight sentence queued: keep everything, drop nothing', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [B, B, B], scriptIds: [2, 2, 2] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 3);
  assert.deepEqual(p.droppedScriptIds, []);
});
test('empty queue (last chunk playing / tail still arriving): keep 0', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [], scriptIds: [] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 0);
});
test('a later repeat of the same text is a different utterance: only the head run is kept', () => {
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [B, C, B], scriptIds: [2, 3, 4] },
    { sentence: B, scriptId: 2 },
  );
  assert.equal(p.keepCount, 1);
  assert.deepEqual(p.droppedScriptIds, [3, 4]);
});
test('same text under a different scriptId is not the current sentence', () => {
  const p = partitionQueueAtSentenceBoundary({ sentences: [B], scriptIds: [9] }, { sentence: B, scriptId: 2 });
  assert.equal(p.keepCount, 0);
  assert.deepEqual(p.droppedScriptIds, [9]);
});
test('unlabelled scriptIds (kill bridge / greeting) match undefined and stamp nothing', () => {
  const p = partitionQueueAtSentenceBoundary(
    { sentences: [A, A, C], scriptIds: [undefined, undefined, undefined] },
    { sentence: A, scriptId: undefined },
  );
  assert.equal(p.keepCount, 2);
  assert.deepEqual(p.droppedScriptIds, []);
});

console.log('shouldFinishInFlightSentence');
test('exactly the two actions whose offending sentence is never the first', () => {
  assert.deepEqual([...SENTENCE_BOUNDARY_KILL_ACTIONS].sort(), ['repeat_after_correct', 'required_phrase_missing']);
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 1), true);
  assert.equal(shouldFinishInFlightSentence('required_phrase_missing', 3), true);
});
test('other actions, nothing heard, or the flag off ⇒ hard clear', () => {
  for (const a of ['judge_ungrounded', 'show_segment_card_narration_mismatch', 'dev_forced_kill', undefined]) {
    assert.equal(shouldFinishInFlightSentence(a, 3), false, String(a));
  }
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 0), false);
  assert.equal(shouldFinishInFlightSentence('repeat_after_correct', 2, false), false);
});

console.log('resumeTailAfterBoundary');
test('the live shape: [in-flight, re-ask] ⇒ resume only the re-ask', () => {
  assert.deepEqual(resumeTailAfterBoundary([B, C], B), [C]);
});
test('in-flight only ⇒ nothing to resume', () => {
  assert.deepEqual(resumeTailAfterBoundary([B], B), []);
});
test('first entry not the kept sentence ⇒ tail unchanged', () => {
  assert.deepEqual(resumeTailAfterBoundary([C], B), [C]);
  assert.deepEqual(resumeTailAfterBoundary([B, C], null), [B, C]);
});
test('cap is 4000 ms', () => assert.equal(SENTENCE_BOUNDARY_CAP_MS, 4000));

console.log('static pins');
const root = join(__dirname, '..');
const hook = readFileSync(join(root, 'src/app/tutor/hooks/useOpenAIRealtime.ts'), 'utf8');
const gemini = readFileSync(join(root, 'src/app/tutor/hooks/useGeminiLive.ts'), 'utf8');
const vtr = readFileSync(join(root, 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const flags = readFileSync(join(root, 'src/lib/tutor/orchestrator/flags.ts'), 'utf8');
test('hook: clearSpeechQueue accepts { afterCurrentSentence } and falls back to the hard clear', () => {
  assert.match(hook, /clearSpeechQueue: \(opts\?: ClearSpeechQueueOptions\) => Promise<ClearSpeechQueueResult \| void>;/);
  assert.match(hook, /const clearSpeechQueue = useCallback\(\(opts\?: ClearSpeechQueueOptions\)/);
  assert.match(hook, /!opts\?\.afterCurrentSentence \|\|[\s\S]{0,400}return clearSpeechQueueHard\(\);/);
  assert.match(hook, /partitionQueueAtSentenceBoundary\(/);
  assert.match(hook, /setTimeout\(\(\) => \{[\s\S]{0,300}SENTENCE_BOUNDARY_CAP_MS[\s\S]{0,80}clearSpeechQueueHard\(\)/);
});
test('hook: the sentence end settles the wait before the next-sentence advance', () => {
  const i = hook.indexOf('boundary.ended();');
  const j = hook.indexOf('speakTextQueueRef.current.length > 0\n      ) {');
  const hold = hook.indexOf('if (pendingTailRef.current && pendingTailRef.current.epoch === speakEpochRef.current) {');
  assert.ok(hold > 0 && i > hold && j > i, `hold=${hold} ended=${i} advance=${j}`);
});
test('hook: a hard clear settles a pending boundary wait', () => {
  assert.match(hook, /const clearSpeechQueueHard = useCallback\(\(\): Promise<void> => \{[\s\S]{0,300}boundary\.preempted\(\);/);
});
test('gemini: accepts the option and ignores it', () => {
  assert.match(gemini, /clearSpeechQueue: \(_opts\?: \{ afterCurrentSentence\?: boolean \}\): Promise<void> =>/);
});
test('orchestrator: the option is passed only behind shouldFinishInFlightSentence(last rejection action)', () => {
  const uses = vtr.match(/afterCurrentSentence: true/g) ?? [];
  assert.equal(uses.length, 1);
  assert.match(vtr, /const killAction = rejectionsThisAttempt\[rejectionsThisAttempt\.length - 1\]\?\.action;\s*if \(shouldFinishInFlightSentence\(killAction, audibleSentenceCount, TUTOR_KILL_SENTENCE_BOUNDARY\)\) \{[\s\S]{0,200}await clearSpeechQueueRef\.current\?\.\(\{ afterCurrentSentence: true \}\)/);
  assert.match(vtr, /judge_kill_sentence_boundary', `waited=\$\{res\.waitedMs\}/);
  assert.match(vtr, /· finishing in-flight sentence`/);
  assert.match(vtr, /resumeTailAfterBoundary\(tail, res\.keptSentence\)/);
});
test('orchestrator: both kill sites push their action immediately before performKill', () => {
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'required_phrase_missing', reason \}\);\s*await performKill\(\);/);
  assert.match(vtr, /rejectionsThisAttempt\.push\(\{ action: 'repeat_after_correct', reason: REPEAT_AFTER_CORRECT_REASON \}\);\s*await performKill\(\);/);
});
test('flag declared, default ON', () => {
  assert.match(flags, /export const TUTOR_KILL_SENTENCE_BOUNDARY = process\.env\.NEXT_PUBLIC_TUTOR_KILL_SENTENCE_BOUNDARY !== 'off';/);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
