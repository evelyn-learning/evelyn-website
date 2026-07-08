/**
 * Unit tests for normalizeSentenceSpacing (session-quality C1).
 * No framework — node:assert + tiny test() harness, matching
 * extract-social-threads.test.ts. Run: npm run test:sentence-spacing
 */

import { strict as assert } from 'node:assert';
import { normalizeSentenceSpacing } from '../src/lib/tutor/voice/sentence-spacing';

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

console.log('normalizeSentenceSpacing');

// — The four observed merges from portal-9549e3af / portal-aa2444c9 —

test('repairs "independent.Let\'s build"', () => {
  assert.equal(
    normalizeSentenceSpacing("Each row is independent.Let's build the table together."),
    "Each row is independent. Let's build the table together.",
  );
});

test('repairs "one step at a time.Take a look"', () => {
  assert.equal(
    normalizeSentenceSpacing('We go one step at a time.Take a look at the first row.'),
    'We go one step at a time. Take a look at the first row.',
  );
});

test('repairs "Exactly right.Ten out of fifty"', () => {
  assert.equal(
    normalizeSentenceSpacing('Exactly right.Ten out of fifty is one fifth.'),
    'Exactly right. Ten out of fifty is one fifth.',
  );
});

test('repairs "proportions.Proportions are"', () => {
  assert.equal(
    normalizeSentenceSpacing('Now think in proportions.Proportions are just fractions.'),
    'Now think in proportions. Proportions are just fractions.',
  );
});

test('repairs question-mark merge', () => {
  assert.equal(
    normalizeSentenceSpacing('What do you notice?Take a second to compare the rows.'),
    'What do you notice? Take a second to compare the rows.',
  );
});

test('repairs digit-final sentence merge ("...is 42.Let\'s move on")', () => {
  assert.equal(
    normalizeSentenceSpacing("So the mean is 42.Let's move on."),
    "So the mean is 42. Let's move on.",
  );
});

// — Guards: things that must NOT change —

test('leaves real decimals alone', () => {
  const s = 'The mean is 45.5 and the median is 85.4 — nice work.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('leaves coefficient decimals alone (0.5x)', () => {
  const s = 'Multiply by 0.5x and simplify.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('leaves acronyms alone (U.S.A., A.M.)', () => {
  const s = 'The U.S.A. census runs at 9 A.M. sharp.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('leaves $…$ math spans alone', () => {
  const s = 'Compute $4{,}987 \\times 202$ on the board.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('never splits inside a math span even with a glued pattern', () => {
  const s = 'Consider $ab.Xy$ as a token.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('still repairs text AFTER a math span', () => {
  assert.equal(
    normalizeSentenceSpacing('So $2^x=32$ gives five.Now try the next one.'),
    'So $2^x=32$ gives five. Now try the next one.',
  );
});

test('leaves lowercase-after alone (filenames, domains)', () => {
  const s = 'See catalog.ts and example.com for details.';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('leaves ellipses alone', () => {
  const s = 'Well...So what do you think?';
  assert.equal(normalizeSentenceSpacing(s), s);
});

test('idempotent (safe to re-apply to a growing stream buffer)', () => {
  const once = normalizeSentenceSpacing('Exactly right.Ten out of fifty.');
  assert.equal(normalizeSentenceSpacing(once), once);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
