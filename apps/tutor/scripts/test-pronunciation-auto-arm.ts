/**
 * Task 14 §F — pronunciation auto-arm detector (pronunciation/auto-arm.ts).
 * Run: npx tsx scripts/test-pronunciation-auto-arm.ts
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectPronunciationTarget, pronunciationTargetsOf, syllablePatternFor, shouldRearmPronunciation, notAttemptedDetail } from '../src/lib/tutor/pronunciation/auto-arm';
import { isRetryAsk } from '../src/lib/tutor/voice/retry-cap';
import { isSayItAsk } from '../src/lib/tutor/voice/correct-retry';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}
const T = pronunciationTargetsOf({ pronunciation: {
  words: ['responsibilities', 'international', 'communicate', 'customers', 'developed'],
  sentences: ['I have worked with international customers for several years.', 'I was responsible for communicating with our customers.'],
} })!;

test('live run 4: "responsibilities." quoted ⇒ armed with "responsibilities", gloss re-spon-si-BIL-i-ties', () => {
  const turn = 'Here\'s the first word: "responsibilities." Please listen and repeat it after me. The main stress is on the fourth syllable: re-spon-si-BIL-i-ties.';
  assert.deepEqual(detectPronunciationTarget(turn, T), { referenceText: 'responsibilities', kind: 'word', gloss: 're-spon-si-BIL-i-ties' });
});
test('a listed sentence quoted (curly / 「」) ⇒ that sentence, kind sentence, no gloss', () => {
  assert.deepEqual(
    detectPronunciationTarget('Now the sentence: “I have worked with international customers for several years.” Try it.', T),
    { referenceText: 'I have worked with international customers for several years.', kind: 'sentence' },
  );
  assert.equal(detectPronunciationTarget('「I was responsible for communicating with our customers.」 どうぞ。', T)?.kind, 'sentence');
});
test('an unlisted quote with a say/repeat ask at the end ⇒ that quote', () => {
  assert.deepEqual(detectPronunciationTarget('Good. Now say "project manager" for me.', T), { referenceText: 'project manager', kind: 'sentence' });
  assert.deepEqual(detectPronunciationTarget('Listen: "schedule." Repeat after me.', T), { referenceText: 'schedule', kind: 'word' });
});
test('no quote, or a quote without an ask and not listed ⇒ null', () => {
  assert.equal(detectPronunciationTarget('Let\'s practise some words now. Are you ready?', T), null);
  assert.equal(detectPronunciationTarget('You said "I sell machines" earlier, nice. What else do you do?', T), null);
});
test('syllable pattern must spell the word; 2-part compounds are not syllable patterns', () => {
  assert.equal(syllablePatternFor('in-ter-NA-tion-al is the stress', 'international'), 'in-ter-NA-tion-al');
  assert.equal(syllablePatternFor('com-MU-ni-cate', 'international'), undefined);
  assert.equal(syllablePatternFor('front-load', 'frontload'), undefined);
});
test('targets: none without metadata.pronunciation', () => {
  assert.equal(pronunciationTargetsOf({}), null);
  assert.equal(pronunciationTargetsOf(undefined), null);
  assert.equal(pronunciationTargetsOf({ pronunciation: { words: [] } }), null);
});
test('VTR wiring: pronunciation active, segment targets, brain tool wins, once per turn, same arm path, card with gloss', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/if \(pronunciationActive && !opts\?\.prefetchOnly && !totalToolNamesSeen\.includes\('request_pronunciation_check'\)\)/.test(VTR), 'gate');
  assert.ok(/armPronunciationCheckRef\.current\(auto\.referenceText, auto\.kind\);/.test(VTR), 'same arm path as the tool');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_auto_armed', `\"${auto.referenceText}\"`);"), 'debug');
  assert.ok(/action: 'showSentence',\s*sentence: auto\.referenceText,\s*\.\.\.\(auto\.gloss \? \{ gloss: auto\.gloss \} : \{\}\),/.test(VTR), 'card');
  // before the sentence board, so the card (with its gloss) is the one that stays
  assert.ok(VTR.indexOf("'pronunciation_auto_armed'") < VTR.indexOf('const cards = planSentenceBoard({'));
});

// ── Task 18 §C: re-arm on a repeat-ask, and say what the vendor heard ──
test('rearm: the live case — no quote, same part, say-it ask ⇒ re-arm the last target', () => {
  const ask = "Please say the sentence once more, and I'll check the words.";
  const last = { referenceText: 'I was responsible for communicating with our customers.', kind: 'sentence', segId: 'pronunciation' };
  const targets = { words: ['responsibilities'], sentences: [last.referenceText] };
  const detected = detectPronunciationTarget(ask, targets);
  assert.equal(detected, null);
  const isRepeatAsk = isRetryAsk(ask) || isSayItAsk(ask);
  assert.equal(isRepeatAsk, true);
  const base = { last, detected, toolCalled: false, isRepeatAsk, segId: 'pronunciation' };
  assert.equal(shouldRearmPronunciation(base), true);
  assert.equal(shouldRearmPronunciation({ ...base, detected: { referenceText: 'responsibilities', kind: 'word' } }), false, 'a detected target wins');
  assert.equal(shouldRearmPronunciation({ ...base, segId: 'summary' }), false, 'different segment');
  assert.equal(shouldRearmPronunciation({ ...base, isRepeatAsk: false }), false, 'not a repeat-ask');
  assert.equal(shouldRearmPronunciation({ ...base, toolCalled: true }), false, 'the brain called the tool');
  assert.equal(shouldRearmPronunciation({ ...base, last: null }), false, 'nothing armed yet');
});
test('not_attempted detail: recognised words and omitted count', () => {
  const r = { words: [
    { word: 'I', errorType: 'none' }, { word: 'was', errorType: 'omission' }, { word: 'responsible', errorType: 'mispronunciation' },
    { word: 'for', errorType: 'omission' }, { word: 'uh', errorType: 'insertion' },
  ] };
  assert.equal(notAttemptedDetail(r), 'recognized="I responsible uh" omitted=2/4');
  assert.equal(notAttemptedDetail(null), 'recognized="" omitted=0/0');
});
test('VTR wiring (§C): last target kept at every arm, re-arm branch, not_attempted carries the detail', () => {
  const VTR = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(/capture\.arm\(referenceText\);[\s\S]{0,200}lastPronunciationTargetRef\.current = \{ referenceText, kind, segId: currentSegmentIdRef\.current \?\? '' \};/.test(VTR), 'set at the arm');
  assert.ok(/\} else if \(shouldRearmPronunciation\(\{\n\s*last: lastPronunciationTargetRef\.current,\n\s*detected: auto,/.test(VTR), 're-arm branch');
  assert.ok(/isRepeatAsk: isRetryAsk\(fullText\) \|\| isSayItAsk\(fullText\),/.test(VTR), 'repeat-ask');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_rearmed',"), 'event');
  assert.ok(VTR.includes("onDebugEvent?.('pronunciation_unavailable', `not_attempted ${notAttemptedDetail(data.result)}`)"), 'detail');
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall passed');
