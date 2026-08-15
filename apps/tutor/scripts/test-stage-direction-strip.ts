/**
 * Unit tests for stripStageDirections (live 2026-07-30, session
 * portal-589b451a: the brain wrote "…what does that give
 * you?(waiting for the student's answer)" and TTS spoke the
 * parenthetical). No framework — node:assert + tiny test() harness,
 * matching test-sentence-spacing.ts. Run: npm run test:stage-direction-strip
 */

import { strict as assert } from 'node:assert';
import { stripStageDirections } from '../src/lib/tutor/voice/sentence-spacing';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

console.log('stripStageDirections');

// — The live leak, verbatim —

test('strips the live "(waiting for the student\'s answer)" leak', () => {
  assert.equal(
    stripStageDirections("So $3(x-2)$ becomes $3 \\cdot x$ minus $3 \\cdot 2$ — what does that give you?(waiting for the student's answer)"),
    'So $3(x-2)$ becomes $3 \\cdot x$ minus $3 \\cdot 2$ — what does that give you?',
  );
});

// — Same class, other spellings —

test('strips "(pause)"', () => {
  assert.equal(stripStageDirections('What do you get? (pause)'), 'What do you get?');
});

test('strips "(pauses for the student)"', () => {
  assert.equal(stripStageDirections('Try it. (pauses for the student)'), 'Try it.');
});

test('strips "(waits for response)"', () => {
  assert.equal(stripStageDirections('Your move. (waits for response)'), 'Your move.');
});

test('strips "(awaiting the answer)"', () => {
  assert.equal(stripStageDirections('Go ahead. (awaiting the answer)'), 'Go ahead.');
});

test('strips "(silence)" and "(beat)"', () => {
  assert.equal(stripStageDirections('Think about it. (silence)'), 'Think about it.');
  assert.equal(stripStageDirections('Think about it. (beat)'), 'Think about it.');
});

test('strips "(student responds)"', () => {
  assert.equal(stripStageDirections('What is 7 + 1? (student responds)'), 'What is 7 + 1?');
});

test('strips "(no response)"', () => {
  assert.equal(stripStageDirections('Still there? (no response)'), 'Still there?');
});

test('strips "(listening)"', () => {
  assert.equal(stripStageDirections('Walk me through it. (listening)'), 'Walk me through it.');
});

test('a sentence that is ONLY a stage direction strips to empty', () => {
  assert.equal(stripStageDirections("(waiting for the student's answer)"), '');
});

test('collapses the double space a mid-sentence strip leaves behind', () => {
  assert.equal(
    stripStageDirections('Take your time (pause) and check the sign.'),
    'Take your time and check the sign.',
  );
});

// — Must NOT touch legitimate parentheticals —

test('keeps math parentheticals', () => {
  assert.equal(stripStageDirections('Distribute the 3 in $3(x-2)$ first.'), 'Distribute the 3 in $3(x-2)$ first.');
  assert.equal(stripStageDirections('So 3(x - 2) + 5 = 2x + 7.'), 'So 3(x - 2) + 5 = 2x + 7.');
});

test('keeps ordinary asides', () => {
  assert.equal(
    stripStageDirections('That allowance (about an hour a day) resets monthly.'),
    'That allowance (about an hour a day) resets monthly.',
  );
});

test('keeps content that merely mentions waiting outside parens', () => {
  assert.equal(
    stripStageDirections('The bus is waiting for the student.'),
    'The bus is waiting for the student.',
  );
});

test('keeps a parenthetical where a stage verb appears mid-content', () => {
  assert.equal(
    stripStageDirections('Newton kept working (his rivals were waiting) and published anyway.'),
    'Newton kept working (his rivals were waiting) and published anyway.',
  );
});

test('no-op on empty / plain text', () => {
  assert.equal(stripStageDirections(''), '');
  assert.equal(stripStageDirections('Right — 8.'), 'Right — 8.');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
