import { strict as assert } from 'node:assert';
import { formatMockReviewBlock } from './claude-brain';
import type { MockReviewContext } from '@/lib/tutor/mock-exam/review-focus';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

const ctx: MockReviewContext = {
  formLabel: 'AP Statistics Practice Exam A', composite: 3, compositeMax: 5, totalMissed: 12,
  pinnedCount: 0,
  focusItems: [{
    itemId: 'i1', sectionLabel: 'Section I', problemText: 'What is the median of 1,2,9?',
    choices: ['1', '2', '4', '9'], studentAnswer: 'C', correctAnswer: 'B',
    solutionText: 'Order the values; the middle one is 2.', loId: 'apstats.summary-stats',
  }],
  remainingMissSummary: [{ unitLabel: 'apstats.inference', missed: 4 }],
  allMisses: [],
};

test('empty without context', () => assert.equal(formatMockReviewBlock(undefined), ''));
test('renders score, items, answers, remainder, directives', () => {
  const block = formatMockReviewBlock(ctx);
  assert.ok(block.startsWith('<mock_review>'));
  assert.ok(block.includes('3 / 5'));
  assert.ok(block.includes('What is the median of 1,2,9?'));
  assert.ok(block.includes('Student answered: C'));
  assert.ok(block.includes('Correct answer: B'));
  assert.ok(block.includes('apstats.inference'));
  assert.ok(block.includes('MOCK-EXAM REVIEW session'));
  assert.ok(/never .*all .*items at once/i.test(block) || block.includes('one item at a time'));
});

test('no pinned directive when pinnedCount is 0', () => {
  const block = formatMockReviewBlock(ctx);
  assert.ok(!block.includes('just SELECTED Item'));
});

test('pinned directive present (singular) when pinnedCount is 1', () => {
  const block = formatMockReviewBlock({ ...ctx, pinnedCount: 1 });
  assert.ok(block.includes('the student just SELECTED Item 1 from their on-screen review agenda'));
  assert.ok(block.includes('begin working on Item 1 immediately'));
  assert.ok(!block.includes('Item 1–'));
});

test('pinned directive spans a range when pinnedCount > 1', () => {
  const block = formatMockReviewBlock({ ...ctx, pinnedCount: 3 });
  assert.ok(block.includes('just SELECTED Item 1–3 from their on-screen review agenda'));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
