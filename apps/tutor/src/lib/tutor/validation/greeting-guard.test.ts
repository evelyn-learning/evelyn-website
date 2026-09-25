/**
 * Greeting-guard predicate — regression test for the mock-review live-gate
 * bug (2026-07-21): on a mock-review session's opening turn the guard
 * dropped the mandated first-missed-item card 3×, driving the validator
 * retry/kill loop (32s stalled opening, empty board). A session with mock
 * review context is EXPECTED to present a problem unprompted.
 * Run: npx tsx src/lib/tutor/validation/greeting-guard.test.ts
 */
import { strict as assert } from 'node:assert';
import { computeGreetingGuard } from './continuity';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

test('active on a plain freestyle opening turn', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: '', mockReviewActive: false,
  }), true);
});

test('inactive when mock-review context is loaded (the live-gate bug)', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: '', mockReviewActive: true,
  }), false);
});

test('inactive once the student asked for content', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 1, lastStudentText: 'give me a problem', mockReviewActive: false,
  }), false);
});

test('inactive during an authored lesson plan', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: true, priorStudentTurns: 0, lastStudentText: 'hi', mockReviewActive: false,
  }), false);
});

test('inactive after the second student turn', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 2, lastStudentText: 'hello', mockReviewActive: false,
  }), false);
});

// GameClass sandbox opener (embed-1790368730414, 2026-09-25): a homework-help
// session launched WITH a topic (the partner passes the exact question as
// `topic`). The synthetic '[start session]' kickoff leaves lastStudentText
// empty, the guard treated that as "the student only said hi", rejected
// show_problem 3×, and the validator retry loop cut the opener's audio
// mid-sentence ("Hey Maya, here's the p—"). A homework-help session that
// arrives with a topic IS a problem request — the guard must stand down.
test('inactive on a homework-help opener that arrived with a topic (GameClass live bug)', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: '', mockReviewActive: false,
    problemContextActive: true,
  }), false);
});

test('still active on a homework-help opener with NO topic', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: '', mockReviewActive: false,
    problemContextActive: false,
  }), true);
});

test('problemContextActive is optional — omitted keeps the historical verdict', () => {
  assert.equal(computeGreetingGuard({
    lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: 'hi', mockReviewActive: false,
  }), true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
