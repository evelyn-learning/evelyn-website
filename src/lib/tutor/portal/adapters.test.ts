/**
 * Focused regression test for Task 13 (final-branch-review fix): the two
 * GradeItem producers must resolve `passageId` -> `passageText` so
 * passage-aware grading (grade-free-response.ts's "verify cited evidence
 * against the stimulus" branch) actually fires in production, instead of
 * silently forwarding `passageText: undefined` for every englang FRQ.
 *
 * node:assert + tiny harness, matching grade-free-response.test.ts /
 * extract-social-threads.test.ts style. No model calls, no DB —
 * `resolveGradeItem` only reads the in-memory SEED_PLANS + SEED_PASSAGES.
 *
 * Run: npm run test:adapters-passage
 */
import { strict as assert } from 'node:assert';
import { resolveGradeItem } from './adapters';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

// U1 FRQ-practice essay — carries passageId: 'evelyn.passage.douglass-fourth-of-july.v1'.
const ITEM_WITH_PASSAGE = 'evelyn.ap.englang.u1-frq-practice.v1::try-full-essay-douglass';
// ACT English grammar-rules try-yourself — no passageId at all.
const ITEM_WITHOUT_PASSAGE = 'evelyn.testprep.act.english.grammar-rules.v1::try-1';

test('resolveGradeItem resolves passageId -> non-empty passageText for a passage-bearing try_yourself', () => {
  const item = resolveGradeItem(ITEM_WITH_PASSAGE);
  assert.ok(item, 'expected item to resolve');
  assert.ok(item!.rubric, 'expected the item to carry its rubric (sanity check on itemId)');
  assert.ok(item!.passageText && item!.passageText.length > 0, 'expected non-empty passageText');
  assert.ok(
    item!.passageText!.includes('Fourth of July'),
    'expected the resolved Douglass passage text',
  );
});

test('resolveGradeItem leaves passageText undefined for a segment with no passageId (back-compat)', () => {
  const item = resolveGradeItem(ITEM_WITHOUT_PASSAGE);
  assert.ok(item, 'expected item to resolve');
  assert.equal(item!.passageText, undefined);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
