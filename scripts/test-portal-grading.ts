/**
 * Phase 3(d) — FRQ grading tests (pure `gradeFreeResponse`, injected graders).
 *
 * Run: `npm run test:portal-grading`
 * Style mirrors scripts/test-cross-session-promotion.ts. No model calls.
 */

import assert from 'node:assert';
import {
  gradeFreeResponse,
  type GradeDeps,
  type GradeItem,
} from '@/lib/tutor/portal/grade-free-response';
import type { GradeFreeResponseRequest } from '@evelyn/portal-contract/v1';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

const req = (text = 'student answer'): GradeFreeResponseRequest => ({
  studentId: 's',
  itemId: 'frq-1',
  response: { text },
});

/** Grader that awards a fixed score per criterionId (from a table). */
function fakeDeps(table: Record<string, number>, judgeCorrect = true): GradeDeps {
  return {
    async gradeRubricPart(args) {
      return { pointsAwarded: table[args.criterionId] ?? 0, feedback: `fb:${args.criterionId}` };
    },
    async judgeSingleAnswer(args) {
      return { correct: judgeCorrect, feedback: 'judged', modelResponse: args.expectedAnswer };
    },
  };
}

const threePartRubric: GradeItem = {
  itemId: 'frq-1',
  rubric: {
    parts: [
      { criterionId: 'states-hypotheses', maxPoints: 1, scoringCriteria: 'H0/Ha stated', modelResponse: 'H0: p=0.5' },
      { criterionId: 'checks-conditions', maxPoints: 2, scoringCriteria: 'all conditions', modelResponse: 'random, 10%, large' },
      { criterionId: 'conclusion', maxPoints: 1, scoringCriteria: 'links p-value to context', modelResponse: 'reject H0' },
    ],
  },
};

(async () => {
  console.log('\nPhase 3(d) gradeFreeResponse:\n');

  await test('3-part rubric + partial answer → per-part points + correct total (acceptance)', async () => {
    const deps = fakeDeps({ 'states-hypotheses': 1, 'checks-conditions': 1, conclusion: 0 });
    const r = await gradeFreeResponse(req(), threePartRubric, deps);
    assert.strictEqual(r.maxPoints, 4);
    assert.strictEqual(r.totalPoints, 2);
    assert.strictEqual(r.parts.length, 3);
    assert.deepStrictEqual(
      r.parts.map((p) => [p.criterionId, p.pointsAwarded, p.maxPoints]),
      [
        ['states-hypotheses', 1, 1],
        ['checks-conditions', 1, 2],
        ['conclusion', 0, 1],
      ],
    );
  });

  await test('per-part award is clamped to the criterion maxPoints', async () => {
    const deps = fakeDeps({ 'states-hypotheses': 9, 'checks-conditions': -3, conclusion: 1 });
    const r = await gradeFreeResponse(req(), threePartRubric, deps);
    assert.deepStrictEqual(r.parts.map((p) => p.pointsAwarded), [1, 0, 1]);
    assert.strictEqual(r.totalPoints, 2);
  });

  await test('full credit', async () => {
    const deps = fakeDeps({ 'states-hypotheses': 1, 'checks-conditions': 2, conclusion: 1 });
    const r = await gradeFreeResponse(req(), threePartRubric, deps);
    assert.strictEqual(r.totalPoints, 4);
    assert.strictEqual(r.totalPoints, r.maxPoints);
  });

  await test('legacy: expectedAnswer-only FRQ → single-answer judge path (correct)', async () => {
    const item: GradeItem = { itemId: 'frq-2', expectedAnswer: '42' };
    const r = await gradeFreeResponse(req('42'), item, fakeDeps({}, true));
    assert.strictEqual(r.maxPoints, 1);
    assert.strictEqual(r.totalPoints, 1);
    assert.strictEqual(r.parts[0].criterionId, 'overall');
    assert.strictEqual(r.modelResponse, '42');
  });

  await test('legacy: incorrect answer → 0/1', async () => {
    const item: GradeItem = { itemId: 'frq-2', expectedAnswer: '42' };
    const r = await gradeFreeResponse(req('41'), item, fakeDeps({}, false));
    assert.strictEqual(r.totalPoints, 0);
    assert.strictEqual(r.parts[0].pointsAwarded, 0);
  });

  await test('rubric takes precedence when both rubric and expectedAnswer present', async () => {
    const item: GradeItem = { ...threePartRubric, expectedAnswer: 'should be ignored' };
    const r = await gradeFreeResponse(req(), item, fakeDeps({ 'states-hypotheses': 1, 'checks-conditions': 2, conclusion: 1 }));
    assert.strictEqual(r.maxPoints, 4); // rubric path, not the 1-pt legacy path
  });

  await test('empty rubric parts falls back to legacy judge', async () => {
    const item: GradeItem = { itemId: 'frq-3', rubric: { parts: [] }, expectedAnswer: 'x' };
    const r = await gradeFreeResponse(req('x'), item, fakeDeps({}, true));
    assert.strictEqual(r.maxPoints, 1);
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
