/**
 * Task 24 §C1 (GDI run 12, 977 s): the transition turn's ask must be about the
 * new part — lesson-plan/transition-ask.ts.
 * Run: npx tsx scripts/test-transition-ask.ts   (npm run test:transition-ask)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { askOffNewPart, transitionAskSentence, contentTokens, TRANSITION_ASK_REASON } from '../src/lib/tutor/lesson-plan/transition-ask';

let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ok  ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
}

const CARD = 'Would you like to practice your pronunciation? You can choose: 1) individual words, 2) a complete sentence, 3) speaking more naturally, or 4) skip and continue.';
const T977 = '"About twenty-five people came to the seminar." That\'s clear and correct, and the past simple fits a finished event. Did the seminar take place last year, or more recently?';

test('977 s: the seminar follow-up vs the pronunciation card → off the new part', () => {
  const ask = transitionAskSentence(T977);
  assert.equal(ask, 'Did the seminar take place last year, or more recently?');
  assert.equal(askOffNewPart(ask!, CARD), true);
});
test('the new part\'s own question → on the part', () => {
  assert.equal(askOffNewPart('Would you like to practice your pronunciation: individual words, a complete sentence, or skip?', CARD), false);
  const T1051 = 'The seminar took place last year, and that is the correct past simple. Please try the pronunciation options now: would you like individual words, a complete sentence, speaking more naturally, or to skip?';
  assert.equal(askOffNewPart(transitionAskSentence(T1051)!, CARD), false);
});
test('a Japanese ask (no Latin tokens) is never flagged', () => {
  assert.equal(askOffNewPart('発音を練習しますか？', CARD), false);
  assert.equal(transitionAskSentence('では次へ。発音を練習しますか？'), '発音を練習しますか？');
});
test('numbers are ignored; a card with < 2 content tokens checks nothing; no ask ⇒ null', () => {
  assert.deepEqual(contentTokens('About 25 people came in 2024.'), ['people', 'came']);
  assert.equal(askOffNewPart('Did the seminar take place last year?', 'Part 7'), false);
  assert.equal(transitionAskSentence('Good. Here is the card.'), null);
});
test('fix round 1 (I-2): short asks and the card\'s own question are on-part; 977 s still off', () => {
  const INTRO = '1. We use simple sentences to talk about our job: I work in sales. / I help customers. / I work with international clients. / I joined my company three years ago.\n2. Practice question: What do you do at work? Answer with one or two sentences.';
  assert.equal(askOffNewPart('What do you do at work?', INTRO), false);
  assert.equal(askOffNewPart('Which would you like to start with?', INTRO), false);
  assert.equal(askOffNewPart('What do you do at work, in one or two sentences?', INTRO), false, 'every token in the card');
  assert.equal(askOffNewPart('Ready?', CARD), false);
  assert.equal(askOffNewPart('Which one would you like to try?', CARD), false, 'all stopwords ⇒ 0 content tokens');
  assert.equal(askOffNewPart('Did the seminar take place last year or more recently?', CARD), true);
});
test('the retry reason, verbatim; VTR kills once per turn on the FACT-note turn', () => {
  assert.equal(TRANSITION_ASK_REASON, "The lesson has moved to the next part. Reply to the student's last answer in ONE sentence with no follow-up question about it, then present the new part's card and end with that part's own question. Apply this silently; never mention this note.");
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes("rejectionsThisAttempt.push({ action: 'transition_ask_off_part', reason: TRANSITION_ASK_REASON });"));
  assert.ok(v.includes('if (!attemptKilled && !transitionAskRejected && attemptText && fixedScriptNoteDeliveredThisTurnRef.current'));
  assert.ok(v.includes("onDebugEvent?.('transition_ask_off_part', "));
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall transition-ask tests passed');
