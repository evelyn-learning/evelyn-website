/**
 * R53 — how pacing reads the tutor's words to credit an answer.
 *
 * Live failure, portal-8d15f85c: the student answered "Quito" correctly and
 * was affirmed — twice — and pacing recorded `incorrect=2`. The tutor then
 * said "that Quito question is still hanging out there waiting for your
 * answer" and made them answer a third time, then remarked "Nice work
 * catching that one twice now" without recognising its own error.
 *
 * Measured over 591 real claude-brain tutor turns, old patterns vs new:
 * 35 turns change classification — 27 none→correct, 7 incorrect→none,
 * 1 incorrect→correct, and ZERO that previously had credit lose it. That
 * asymmetry is the safety property; if a future change makes any turn go
 * correct→(none|incorrect), re-measure before shipping it.
 *
 * Run: npx tsx scripts/test-pacing-verdict.ts
 */
import { strict as assert } from 'node:assert';
import { readPacingVerdict } from '../src/lib/tutor/voice/pacing-verdict';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}
/** The same decision decidePacingCredit makes from these two booleans. */
const credit = (t: string) => {
  const r = readPacingVerdict(t);
  return r.isAffirm && !r.isCorrection ? 'correct' : r.isCorrection ? 'incorrect' : 'none';
};

console.log('\nR53 — pacing verdict reading');

// --- The two live turns, verbatim.
const LIVE_1 = "Ah, Quito — got it. Right, Quito stays cooler! Same latitude as Guayaquil, but way up in those thin Andes mountains, so the heat just doesn't stick around.";
const LIVE_2 = "Right — Quito stays cooler because of the elevation! That's exactly the trick — climbing up mountains does the same job as traveling toward the pole. Now let's chase down that dry desert on our map — the one where rain almost never falls.";

test('LIVE 1: an affirmation after a lead-in sentence is credited', () => {
  // Was 'none': the pattern was ^-anchored and the head began "Ah,".
  assert.equal(credit(LIVE_1), 'correct');
  assert.equal(readPacingVerdict(LIVE_1).affirmSentence, 1, 'affirmation is in the SECOND sentence');
});

test('LIVE 2: prose "almost" no longer marks a correct answer wrong', () => {
  // Was 'incorrect': "rain almost never falls" matched the correction list.
  assert.equal(credit(LIVE_2), 'correct');
});

test('a subordinate "but" AFTER the affirmation does not cancel it', () => {
  // LIVE_1's "but way up in those thin Andes mountains" is ordinary prose.
  assert.equal(readPacingVerdict(LIVE_1).isAffirm, true);
});

// --- Reversals must still be refused. These are the expensive direction:
// crediting a hedge marks a wrong answer as mastered.
test('"Right, but you missed a step" is NOT credited', () => {
  assert.notEqual(credit('Right, but you missed a step on the way there.'), 'correct');
});
test('"Right. But actually, hold on — that isn\'t it." is NOT credited', () => {
  assert.notEqual(credit("Right. But actually, hold on — that isn't it."), 'correct');
});
test('"Exactly — well, not quite." is NOT credited', () => {
  assert.notEqual(credit('Exactly — well, not quite. Look at the sign again.'), 'correct');
});

// --- Genuine corrections must still read as corrections.
test('"Not quite." is a correction', () => {
  assert.equal(credit("Not quite. One would be a floor number, not the distance."), 'incorrect');
});
test('evaluative "Almost —" is a correction', () => {
  assert.equal(credit('Almost — you have the right idea, check the sign.'), 'incorrect');
});
test('"you\'re almost right" is a correction', () => {
  assert.equal(credit("You're almost right, but the denominator needs another look."), 'incorrect');
});
test('"almost there" is a correction', () => {
  assert.equal(credit('Almost there! Try the last step once more.'), 'incorrect');
});

// --- Adverbial "almost" is not a verdict about the student.
test('adverbial "almost" in prose is not a correction', () => {
  assert.equal(readPacingVerdict('That desert gets almost no rain at all.').isCorrection, false);
  assert.equal(readPacingVerdict('Almost every JEE coordinate question hides a circle.').isCorrection, false);
});

test('an OPENING turn is never scored as a correction', () => {
  // Live: opener turns containing adverbial "almost" were scoring the
  // student incorrect before they had said anything at all.
  const opener = "Hi — I'm Elena! Circles and lines look totally different written out, but almost every JEE coordinate question mixes them.";
  assert.equal(readPacingVerdict(opener).isCorrection, false);
});

// --- Plain affirmations unchanged.
test('a clean affirmation is credited', () => {
  assert.equal(credit('Exactly. Sixty-two point five percent.'), 'correct');
  assert.equal(credit('Perfect — that is the one.'), 'correct');
});

test('a third-sentence affirmation is OUTSIDE the window', () => {
  // The window is deliberately two sentences; a "right" deep in prose must
  // not qualify, or ordinary explanation starts crediting answers.
  assert.equal(readPacingVerdict('One. Two. Right, that is it.').affirmSentence, -1);
});

test('empty and junk inputs are total, never throw', () => {
  assert.equal(credit(''), 'none');
  assert.equal(credit('...'), 'none');
  assert.equal(readPacingVerdict('').affirmSentence, -1);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
