import { strict as assert } from 'node:assert';
import { memoryMockStores, startOrResume, saveResponses, advance } from './service';
import { FIXTURE_FORM, FIXTURE_ITEMS } from './fixtures';
import { getMockReviewContext } from './review-context';
import { getReport } from './report';
import type { GradeDeps } from '@/lib/tutor/portal/grade-free-response';

// Minimal fakes so getReport can flip the fixture (which has an FRQ) to
// 'completed' without a model call or a Mongo profile store.
const fakeGradeDeps: GradeDeps = {
  async gradeRubricPart(args) { return { pointsAwarded: args.maxPoints, feedback: 'ok' }; },
  async judgeSingleAnswer() { return { correct: true, feedback: 'ok' }; },
};
function fakeProfileStore() {
  const profiles = new Map<string, Record<string, unknown>>();
  return {
    async getOrCreate(id: string) {
      const p = profiles.get(id) ?? { id, mastery: {}, gaps: [], recentSessions: [] };
      profiles.set(id, p); return p;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async save(p: any) { profiles.set(p.id, p); return p; },
  };
}

let passed = 0, failed = 0;
async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

async function completeFixtureAttempt(stores: ReturnType<typeof memoryMockStores>, studentId: string) {
  // Fixture: sec1 m1 (2 mcq) -> routed m2 (1 item) -> sec2 (1 frq). Answer
  // m1 wrong so routing goes easy and both m1 items count as misses.
  const s = await startOrResume(stores, { studentId, topicId: 'fixture', formId: 'fixture-form-a' });
  await saveResponses(stores, { studentId, attemptId: s.attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
    responses: [{ itemId: 'fx-m1-1', answer: 'B' }, { itemId: 'fx-m1-2', answer: 'C', markedForReview: true }] });
  let st = await advance(stores, { studentId, attemptId: s.attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 } });
  await saveResponses(stores, { studentId, attemptId: s.attemptId, cursor: st.cursor, responses: [{ itemId: 'fx-m2e-1', answer: 'C' }] });
  st = await advance(stores, { studentId, attemptId: s.attemptId, fromCursor: st.cursor });
  // sec1 has breakAfterMin -> closing m2 lands the attempt at_break (sec2 not
  // yet opened); one more advance() opens sec2 before responses can be saved.
  if (st.status === 'at_break') {
    st = await advance(stores, { studentId, attemptId: s.attemptId, fromCursor: st.cursor });
  }
  await saveResponses(stores, { studentId, attemptId: s.attemptId, cursor: st.cursor, responses: [{ itemId: 'fx-frq-1', frqText: 'because 2k+2m=2(k+m)' }] });
  st = await advance(stores, { studentId, attemptId: s.attemptId, fromCursor: st.cursor });
  return s.attemptId;
}

async function run() {
  await test('not_ready while grading; context after completion', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await completeFixtureAttempt(stores, 'stu-1');
    // fixture has an FRQ -> attempt lands in 'grading'; context must refuse
    await assert.rejects(() => getMockReviewContext(stores, 'stu-1', attemptId), /not_ready/);
  });

  await test('ownership enforced', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await completeFixtureAttempt(stores, 'stu-1');
    await assert.rejects(() => getMockReviewContext(stores, 'intruder', attemptId), /forbidden|attempt_not_open|not_found/);
  });

  await test('pinItemIds flow through to focusItems ordering', async () => {
    const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
    const attemptId = await completeFixtureAttempt(stores, 'stu-1');
    // Grade the FRQ so the attempt flips to 'completed' (idempotent grader).
    await getReport(stores, 'stu-1', attemptId, { gradeDeps: fakeGradeDeps, profileStore: fakeProfileStore() });
    const ctx = await getMockReviewContext(stores, 'stu-1', attemptId, ['fx-m2e-1']);
    assert.equal(ctx.focusItems[0]?.itemId, 'fx-m2e-1');   // pinned item first
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
