import { strict as assert } from 'node:assert';
import { rubricFromPointedKey } from './key-rubric';
import { gradeFreeResponse, type GradeDeps } from './grade-free-response';
import { resolveGradeItem } from './adapters';

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); } catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

const MARBLES = '(a) P(R₁) = 5/8. P(R₂ | R₁) = 4/7. P(both) = 5/14. (1.5)\n(b) P(R then B) = 15/56. (1.5)\n(c) NOT INDEPENDENT: P(R₂ | R₁) = 4/7 ≠ 5/8. (2)\nTotal: 5 points.';


async function run() {
  await test('splits a point-marked key into parts with their points, marks removed', () => {
  const r = rubricFromPointedKey(MARBLES)!;
  assert.deepEqual(r.parts.map((p) => [p.criterionId, p.maxPoints]), [['a', 1.5], ['b', 1.5], ['c', 2]]);
  assert.equal(r.parts[1].modelResponse, 'P(R then B) = 15/56.');
  assert.ok(r.parts[0].scoringCriteria.includes('Part (a) only'));
});

  await test('reads "(N points: how)" and "(1 point for each … = N points)" markers, and parts on one line', () => {
  const r = rubricFromPointedKey('(a) Multiplier = 5. (1 point) (b) ΔAD = $250B. (2 points: 1 for setup, 1 for correct number)\n(c) Two costs listed. (1 point for each cost = 2 points)\nTotal: 5 points.')!;
  assert.deepEqual(r.parts.map((p) => p.maxPoints), [1, 2, 2]);
  assert.ok(r.parts[1].scoringCriteria.includes('How the points split: 1 for setup, 1 for correct number'));
  assert.equal(r.parts[0].modelResponse, 'Multiplier = 5.');
});

  await test('keeps the single judge (null) for keys it cannot read safely', () => {
  assert.equal(rubricFromPointedKey(undefined), null);
  assert.equal(rubricFromPointedKey('5/14'), null);                               // plain key
  assert.equal(rubricFromPointedKey('(a) 5/14 (1.5)'), null);                     // one part only
  assert.equal(rubricFromPointedKey('(a) 5/14. (1.5)\n(b) 15/56.'), null);         // a part with no points
  assert.equal(rubricFromPointedKey('(a) x. (1)\n(c) y. (1)'), null);              // labels skip
  assert.equal(rubricFromPointedKey('(a) x. (3)\n(b) y. (3) z. (3)\nTotal: 9 points.'), null); // points don't add up
  assert.equal(rubricFromPointedKey('Setup first.\n(a) x. (1)\n(b) y. (1)'), null); // text before (a)
  assert.equal(rubricFromPointedKey('(a) x where (n ≥ 2)\n(b) y. (1)'), null);      // not a points marker
});

  await test('graded part by part: partial credit, answer shown without the point marks', async () => {
  const deps: GradeDeps = {
    gradeRubricPart: async (a) => ({ pointsAwarded: a.criterionId === 'c' ? 0 : a.maxPoints, feedback: `part ${a.criterionId}` }),
    judgeSingleAnswer: async () => { throw new Error('single judge must not run'); },
  };
  const res = await gradeFreeResponse({ itemId: 'x', studentId: '', response: { text: 'my answer' } } as any,
    { itemId: 'x', expectedAnswer: MARBLES, rubric: rubricFromPointedKey(MARBLES)! }, deps);
  assert.equal(res.totalPoints, 3);
  assert.equal(res.maxPoints, 5);
  assert.equal(res.parts.length, 3);
  assert.ok(res.modelResponse.startsWith('(a) P(R₁) = 5/8.'));
  assert.ok(!/\(1\.5\)|Total:/.test(res.modelResponse));
});

  await test('resolveGradeItem gives a seed FRQ with a point-marked key its parts', async () => {
  const item = await resolveGradeItem('evelyn.ap.stats.conditional-independence.v1::try-multiplication');
  assert.ok(item);
  assert.deepEqual(item!.rubric?.parts.map((p) => p.maxPoints), [1.5, 1.5, 2]);
});

}

void run().then(() => {
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
});
