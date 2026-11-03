/**
 * Task 24 §C1 (GDI run 12, 977 s): the transition turn's ask must be about the
 * new part — lesson-plan/transition-ask.ts.
 * Run: npx tsx scripts/test-transition-ask.ts   (npm run test:transition-ask)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { askOffNewPart, transitionAskSentence, contentTokens, TRANSITION_ASK_REASON, transitionAskCheckDue, cardAsksOrOffersChoices } from '../src/lib/tutor/lesson-plan/transition-ask';

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
  // Task 29 §M: the student's correction / question is answered first.
  assert.ok(TRANSITION_ASK_REASON.startsWith('If the student just corrected you or asked something, answer that first in ONE sentence; the move comes after it. '));
  assert.equal(TRANSITION_ASK_REASON, "If the student just corrected you or asked something, answer that first in ONE sentence; the move comes after it. The lesson has moved to the next part. Reply to the student's last answer in ONE sentence with no follow-up question about it, then present the new part's card and end with that part's own question. If that answer did not answer the question you asked, do not praise it or call it correct; acknowledge it briefly (\"Noted.\") and go straight to the new part. Start directly with your reply — no opener such as Okay / Alright / Let's keep going / Sorry about that. Apply this silently; never mention this note.");
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes("rejectionsThisAttempt.push({ action: 'transition_ask_off_part', reason: TRANSITION_ASK_REASON });"));
  // Task 29 fix round 1 (I-1): the offer turn is skipped (taOfferTurn).
  assert.ok(v.includes('if (!attemptKilled && !transitionAskRejected && attemptText && !taOfferTurn\n          && (fixedScriptNoteDeliveredThisTurnRef.current || (TUTOR_TRANSITION_ASK_EVERY_ADVANCE && currentSegmentIdRef.current !== turnStartSegmentId))) {'));
  assert.ok(v.includes("onDebugEvent?.('transition_ask_off_part', "));
});

// Task 27 §E1 (GDI run 14, 955–958 s): the brain's own advance_lesson into a choice-menu part.
test('27E1: the 958 s turn — brain advance, ask "read the sentence on the board" vs the menu card → reject', () => {
  const T958 = 'Good, you learned that presenting to the team helps everyone learn. "I learned that presenting to the team helps everyone learn" is clear. That\'s a good place to close this part. Next, we\'ll practice pronunciation. Can you read the sentence on the board aloud for me?';
  const ask = transitionAskSentence(T958);
  assert.equal(ask, 'Can you read the sentence on the board aloud for me?');
  assert.equal(cardAsksOrOffersChoices(CARD), true);
  const due = transitionAskCheckDue({ factNoteDelivered: false, advancedThisTurn: true, fixedScript: true, card: CARD });
  assert.equal(due, true);
  assert.equal(askOffNewPart(ask!, CARD), true);
  // not due: no advance and no FACT note; not a fixed script; a card that neither asks nor offers choices; the flag off
  assert.equal(transitionAskCheckDue({ factNoteDelivered: false, advancedThisTurn: false, fixedScript: true, card: CARD }), false);
  assert.equal(transitionAskCheckDue({ factNoteDelivered: false, advancedThisTurn: true, fixedScript: false, card: CARD }), false);
  assert.equal(transitionAskCheckDue({ factNoteDelivered: false, advancedThisTurn: true, fixedScript: true, card: 'We use the past simple for finished events.' }), false);
  assert.equal(transitionAskCheckDue({ factNoteDelivered: false, advancedThisTurn: true, fixedScript: true, card: CARD, everyAdvance: false }), false);
  // the FACT-note turn as before (any card)
  assert.equal(transitionAskCheckDue({ factNoteDelivered: true, advancedThisTurn: false, fixedScript: true, card: 'We use the past simple for finished events.' }), true);
  assert.equal(transitionAskCheckDue({ factNoteDelivered: true, advancedThisTurn: true, fixedScript: true, card: '' }), false);
  const v = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(v.includes('advancedThisTurn: currentSegmentIdRef.current !== turnStartSegmentId,'));
});

test('27 r1 m-7: a pick question on a choice-menu card is on-part', () => {
  for (const x of ['Shall we pick one of these options?', 'Which option would you like to practise?', 'Which number would you like?']) assert.equal(askOffNewPart(x, CARD), false, x);
  assert.equal(askOffNewPart('Can you read the sentence on the board aloud for me?', CARD), true, '958 s still off');
  assert.equal(askOffNewPart('Which seminar did you attend last year?', 'We use the past simple for finished events at a time in the past.'), true, 'no menu ⇒ the token rule');
});

test('Task 28 r1 m-2: an imperative on-part ask (now seen by turnEndsWithAsk) → not off the part', () => {
  const T = 'Good, that is the past simple. Now we move to pronunciation. Take a look at the board, and choose one: individual words, a complete sentence, speaking more naturally, or skip.';
  const ask = transitionAskSentence(T);
  assert.ok(ask, 'the imperative last sentence is the ask');
  assert.equal(askOffNewPart(ask!, CARD), false);
  // an imperative ask about the old topic is still off the part
  const off = transitionAskSentence('Good. Tell me one more thing about the seminar last year.');
  assert.ok(off);
  assert.equal(askOffNewPart(off!, CARD), true);
});

if (failed) { console.log(`\n${failed} failed`); process.exit(1); }
console.log('\nall transition-ask tests passed');
