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
import { resolveGradeItem, resolvePassageText, mongoPracticeSources, resolveAssessmentItem } from './adapters';
import { ProblemBank } from '@/models/ProblemBank';
import * as dbModule from '@/lib/db';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

// U1 FRQ-practice essay — carries passageId: 'evelyn.passage.douglass-fourth-of-july.v1'.
const ITEM_WITH_PASSAGE = 'evelyn.ap.englang.u1-frq-practice.v1::try-full-essay-douglass';
// ACT English grammar-rules try-yourself — no passageId at all.
const ITEM_WITHOUT_PASSAGE = 'evelyn.testprep.act.english.grammar-rules.v1::try-1';

(async () => {

await test('resolveGradeItem resolves passageId -> non-empty passageText for a passage-bearing try_yourself', () => {
  const item = resolveGradeItem(ITEM_WITH_PASSAGE);
  assert.ok(item, 'expected item to resolve');
  assert.ok(item!.rubric, 'expected the item to carry its rubric (sanity check on itemId)');
  assert.ok(item!.passageText && item!.passageText.length > 0, 'expected non-empty passageText');
  assert.ok(
    item!.passageText!.includes('Fourth of July'),
    'expected the resolved Douglass passage text',
  );
});

await test('resolveGradeItem leaves passageText undefined for a segment with no passageId (back-compat)', () => {
  const item = resolveGradeItem(ITEM_WITHOUT_PASSAGE);
  assert.ok(item, 'expected item to resolve');
  assert.equal(item!.passageText, undefined);
});

// Task 1 (APUSH Period-3 slice): 'document' packet label (Document 1..N) for
// DBQ document packets vs. the default 'source' label (Source A/B/C) used by
// Eng Lang Synthesis. Back-compat: no packetLabel arg -> 'source' (unchanged).
await test('document packet labels Document 1..N', () => {
  const ids = ['evelyn.passage.henry-give-me-liberty.v1']; // real seeded passage
  const out = resolvePassageText(undefined, [ids[0], ids[0]], 'document');
  assert.ok(out && out.includes('Document 1') && out.includes('Document 2'), 'expected Document N labels');
  assert.ok(!out!.includes('Source A'), 'should not use Source labels for document style');
});

await test('source packet still labels Source A/B/C (back-compat)', () => {
  const id = 'evelyn.passage.henry-give-me-liberty.v1';
  const out = resolvePassageText(undefined, [id, id]); // no packetLabel -> source
  assert.ok(out && out.includes('Source A') && out.includes('Source B'), 'expected Source labels by default');
});

// Task 2 (mock-exams platform): ProblemBank rows tagged bankScope:'mock'
// belong to full-length mock forms and must NEVER leak into practice/
// tutor/assessment serving (adapters.ts's safeBankQuery + resolveAssessmentItem
// choke points). These tests stub Mongo — connectDB (no-op) and the
// ProblemBank model's find/findOne (capture the filter, return empty) — so
// we can assert on the FILTER OBJECT the choke points build, with no real
// database. Assertion is on the filter shape only, not DB behavior.
const capturedFilters: Array<Record<string, unknown>> = [];
(dbModule as unknown as { default: () => Promise<void> }).default = async () => {};
(ProblemBank as unknown as {
  find: (filter: Record<string, unknown>) => { limit: () => { lean: () => Promise<unknown[]> } };
}).find = (filter) => {
  capturedFilters.push(filter);
  return { limit: () => ({ lean: async () => [] }) };
};
(ProblemBank as unknown as {
  findOne: (filter: Record<string, unknown>) => { lean: () => Promise<unknown | null> };
}).findOne = (filter) => {
  capturedFilters.push(filter);
  return { lean: async () => null };
};

await test('bankForTopic excludes mock-scoped rows', async () => {
  capturedFilters.length = 0;
  const sources = mongoPracticeSources();
  await sources.bankForTopic('digital-sat', 2);
  assert.deepEqual(capturedFilters[0]?.bankScope, { $ne: 'mock' });
});

await test('resolveAssessmentItem excludes mock-scoped rows', async () => {
  capturedFilters.length = 0;
  await resolveAssessmentItem('dsat-x-001');
  assert.deepEqual(capturedFilters[0]?.bankScope, { $ne: 'mock' });
});

// Practice-gen scoping fix: tutor-session brain-gen.* rows are answer-key-
// dirty scratch work from live tutoring sessions and must never surface in
// Practice retrieval (today's leak). practice-gen.* rows (the NEW generate-
// on-exhaustion write-back target, verified + banked permanently) must NOT
// be excluded by this filter — they are ordinary bank rows by construction.
await test('bankForLoId excludes brain-gen.* rows via the id filter', async () => {
  capturedFilters.length = 0;
  const sources = mongoPracticeSources();
  await sources.bankForLoId('apstats.normal-distribution', 2);
  assert.deepEqual(capturedFilters[0]?.id, { $not: /^brain-gen\./ });
});

await test('bankForTopic excludes brain-gen.* rows via the id filter', async () => {
  capturedFilters.length = 0;
  const sources = mongoPracticeSources();
  await sources.bankForTopic('digital-sat', 2);
  assert.deepEqual(capturedFilters[0]?.id, { $not: /^brain-gen\./ });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

})();
