/**
 * 2026-10-02 (live portal-bf533c4b) — rule-based `wrong` ledger events from
 * answer attempts. Six wrong/confused answers to one system of equations fed
 * the ledger ZERO `wrong` events (one credit decision, withheld by the
 * advisory judge), so the gap carried STUCK_CUE only and never raised
 * `repeated_difficulty`. These pin the two predicates the fallback uses.
 *
 * Run: npm run test:answer-attempt
 */
import { strict as assert } from 'node:assert';
import { isAnswerAttempt, inferWrongEvent } from './answer-attempt';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
  }
}

console.log('\nanswer-attempt — isAnswerAttempt');
const ATTEMPTS = ['x = 1 and y = 5', 'I think x = 2, y = 3', 'Is it x = 4, y = 2?', '4', 'a circle'];
for (const s of ATTEMPTS) test(`attempt: "${s}"`, () => assert.equal(isAnswerAttempt(s), true));
const NON_ATTEMPTS = [
  'I dont know, maybe x = 5?',
  'can you explain that again',
  'give me another example',
  'I still dont get it',
  'well I was thinking that the whole thing sort of moves along with the other one when you push hard',
];
for (const s of NON_ATTEMPTS) test(`not an attempt: "${s}"`, () => assert.equal(isAnswerAttempt(s), false));
test('the 20-word control sentence really is 20 words with no digits', () => {
  const s = NON_ATTEMPTS[4];
  assert.equal(s.split(/\s+/).length, 20);
  assert.equal(/\d/.test(s), false);
});

console.log('\nanswer-attempt — inferWrongEvent');
const attempt = 'x = 1 and y = 5';
for (const tutorText of [
  "Not quite. Let's check that in the second equation: 1 minus 5 is not 2.",
  'Close, but the second equation does not hold with those values.',
  'Hmm, not exactly. Plug them back into the first equation and see.',
]) {
  test(`correction + attempt → true: "${tutorText.slice(0, 30)}…"`, () =>
    assert.equal(inferWrongEvent({ studentText: attempt, tutorText, objectiveCorrect: false }), true));
}
test('affirm opener → false', () =>
  assert.equal(inferWrongEvent({ studentText: 'x = 3, y = 1', tutorText: 'Right. x = 3 and y = 1 satisfy both equations.', objectiveCorrect: false }), false));
test('correction + objectiveCorrect → false', () =>
  assert.equal(inferWrongEvent({ studentText: attempt, tutorText: "Not quite. Let's check that.", objectiveCorrect: true }), false));
test('correction + non-attempt → false', () =>
  assert.equal(inferWrongEvent({ studentText: 'can you explain that again', tutorText: "Not quite. Let's check that.", objectiveCorrect: false }), false));
test('synthetic bracketed turn → false', () =>
  assert.equal(inferWrongEvent({ studentText: '[validator feedback — not from the student]', tutorText: "Not quite. Let's check that.", objectiveCorrect: false }), false));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
