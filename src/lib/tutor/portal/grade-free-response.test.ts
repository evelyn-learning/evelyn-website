import { strict as assert } from 'node:assert';
import { gradeFreeResponse, type GradeDeps, type GradeItem } from './grade-free-response';

let passed = 0, failed = 0;
function test(name: string, fn: () => Promise<void>): Promise<void> {
  return fn().then(() => { passed++; console.log(`  ok - ${name}`); })
             .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

const req = { itemId: 'x', response: { text: 'my essay' } } as any;

async function run() {
  await test('passageText is forwarded to gradeRubricPart', async () => {
    const seen: (string | undefined)[] = [];
    const deps: GradeDeps = {
      gradeRubricPart: async (a: any) => { seen.push(a.passageText); return { pointsAwarded: 1, feedback: 'ok' }; },
      judgeSingleAnswer: async () => ({ correct: true, feedback: 'ok' }),
    };
    const item: GradeItem = {
      itemId: 'x',
      passageText: 'DOUGLASS PASSAGE TEXT',
      rubric: { parts: [
        { criterionId: 'A', maxPoints: 1, scoringCriteria: 'thesis', modelResponse: 'm' },
      ] },
    };
    const res = await gradeFreeResponse(req, item, deps);
    assert.equal(res.maxPoints, 1);
    assert.deepEqual(seen, ['DOUGLASS PASSAGE TEXT']);
  });

  await test('absent passageText forwards undefined (back-compat)', async () => {
    let seen: string | undefined = 'sentinel';
    const deps: GradeDeps = {
      gradeRubricPart: async (a: any) => { seen = a.passageText; return { pointsAwarded: 2, feedback: 'ok' }; },
      judgeSingleAnswer: async () => ({ correct: true, feedback: 'ok' }),
    };
    const item: GradeItem = {
      itemId: 'x',
      rubric: { parts: [{ criterionId: 'A', maxPoints: 4, scoringCriteria: 'ev', modelResponse: 'm' }] },
    };
    await gradeFreeResponse(req, item, deps);
    assert.equal(seen, undefined);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
