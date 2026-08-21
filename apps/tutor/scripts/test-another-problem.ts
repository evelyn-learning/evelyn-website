/**
 * Unit test — "give me another one" detection
 * (src/lib/tutor/voice/another-problem-request.ts).
 *
 * ROOT CAUSE (R49b, live portal-2d53e403 at 1429.1s): the student said
 * "Yeah, sure. Uh, let's try fractions." — an explicit request for ANOTHER
 * fraction problem. The brain re-posed the IDENTICAL one (-1/4 + 1/2).
 * show_*-dedup correctly dropped the duplicate render, and the validator
 * handed the brain a retry reason whose opening line is "The student is
 * still looking at the previous problem." The brain took that literally and
 * narrated the OLD card from the top — "Fourths — since half is just two
 * fourths, we can write everything in fourths. That's already up on the
 * board." — a verbatim replay of its own turn from 1006.7s, 7 minutes
 * earlier. The student got the same problem twice, introduced as if new.
 *
 * The retry message was blind to what the student had just asked for. This
 * is the signal that makes it not blind.
 *
 * Run: npx tsx scripts/test-another-problem.ts (npm run test:another-problem)
 */

import { strict as assert } from 'node:assert';
import { detectAnotherProblemRequest } from '../src/lib/tutor/voice/another-problem-request';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const yes = (s: string) => assert.equal(detectAnotherProblemRequest(s), true, `should detect: ${s}`);
const no  = (s: string) => assert.equal(detectAnotherProblemRequest(s), false, `should NOT detect: ${s}`);

test('the live utterance', () => yes("Yeah, sure. Uh, let's try fractions."));

test('explicit another/one-more shapes', () => {
  yes('can I try another one');
  yes('give me another');
  yes('one more please');
  yes("let's do another one");
  yes('can we try a different one');
  yes('next one');
});

test('lets-try / lets-do a topic', () => {
  yes("let's try decimals next");
  yes('can we do fractions now');
});

// ── the guards ──────────────────────────────────────────────────────────
test('a retry of the SAME problem is not a request for a new one', () => {
  no('let me try again');
  no("I'll try that again");
  no('can I have another go at this one');
});

test('a student answering is never a request', () => {
  no('I think it is 3/4');
  no('um, 10.5');
  no('the positive side wins by one fourth');
});

test('asking for help is not asking for a new problem', () => {
  no('can you repeat that');
  no('I need a hint');
  no("I don't understand this one");
});

test('empty / junk is total', () => {
  no('');
  no('   ');
  no('mm-hmm');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
