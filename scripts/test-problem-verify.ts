/**
 * Unit tests for the brain-gen answer-verification helpers (content-variety
 * Phase 2). Run: npm run test:problem-verify
 * These gate the numeric/exact answer-agreement logic that decides whether a
 * generated problem is safe to serve (mismatch ⇒ fall back to authored).
 */
import { strict as assert } from 'node:assert';
import { extractAnswerNumber, answersAgree } from '../apps/marketing/src/lib/tutor/voice/problem-generator';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.log(`  ✗ ${name}\n      ${(e as Error).message}`); failed++; }
}

console.log('extractAnswerNumber:');
test('bare integer', () => assert.equal(extractAnswerNumber('48'), 48));
test('decimal', () => assert.equal(extractAnswerNumber('4.5'), 4.5));
test('with trailing units', () => assert.equal(extractAnswerNumber('15 square feet'), 15));
test('currency', () => assert.equal(extractAnswerNumber('$4.50'), 4.5));
test('comma thousands', () => assert.equal(extractAnswerNumber('300,000 J'), 300000));
test('fraction', () => assert.equal(extractAnswerNumber('3/4'), 0.75));
test('leading label then number', () => assert.equal(extractAnswerNumber('Area = 20'), 20));
test('negative', () => assert.equal(extractAnswerNumber('-7'), -7));
test('no number → null', () => assert.equal(extractAnswerNumber('competitive inhibition'), null));
test('empty → null', () => assert.equal(extractAnswerNumber('  '), null));

console.log('\nanswersAgree:');
test('exact numeric match', () => assert.equal(answersAgree('48', '48'), true));
test('numeric within 1% tolerance', () => assert.equal(answersAgree('100', '100.5'), true));
test('numeric outside tolerance', () => assert.equal(answersAgree('48', '49'), false));
test('units vs bare number agree', () => assert.equal(answersAgree('15 square feet', '15'), true));
test('fraction vs decimal agree', () => assert.equal(answersAgree('3/4', '0.75'), true));
test('short exact string (mcq letter) agree', () => assert.equal(answersAgree('B', 'b'), true));
test('short exact string mismatch', () => assert.equal(answersAgree('competitive', 'non-competitive'), false));
test('one-word answer agree ignoring punctuation', () => assert.equal(answersAgree('Competitive.', 'competitive'), true));
test('numeric vs prose → no false agree', () => assert.equal(answersAgree('5', 'the ball reaches five meters high'), false));
test('two different numbers disagree', () => assert.equal(answersAgree('5 m', '10 m'), false));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
