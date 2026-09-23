/**
 * `toResponse` (plan-generate-contract.ts) homework-help shaping.
 *
 * Pure: no LLM, no DB — a plan whose `metadata` carries `kind`/`problems`
 * (as `buildHomeworkPlanFields` stamps it) must produce a response with
 * `kind === 'homework-help'` and the same problems; a plan without them
 * must produce a response carrying neither key.
 *
 * Usage: npx tsx scripts/test-homework-plan.ts
 *        (npm run test:homework-plan)
 */
import { toResponse } from '../src/lib/tutor/lesson-plan/plan-generate-contract';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

const basePlan: Omit<LessonPlan, 'metadata'> = {
  id: 'gen-test-1',
  title: 'Homework help',
  curriculum: 'freestyle',
  grade: 'g8',
  subject: 'math',
  locale: 'en',
  los: [{ id: 'gen-test-1.lo-1', description: 'Work the uploaded problems in order.' }],
  estimatedMinutes: 30,
  segments: [{ id: 's1', kind: 'concept', goal: 'Work the problems.', keyIdeas: [] }],
  prerequisites: [],
  followUps: [],
  schemaVersion: 1,
};

const homeworkPlan: LessonPlan = {
  ...basePlan,
  metadata: {
    kind: 'homework-help',
    problems: [
      { n: 1, text: 'Solve b + 5 = 12' },
      { n: 2, text: '2y = 8' },
    ],
  },
};

const normalPlan: LessonPlan = {
  ...basePlan,
  metadata: { generatedFromText: true, generatorOk: true },
};

const hwRes = toResponse(homeworkPlan, { cached: false, sessionMinutes: 30 });
assert(hwRes.kind === 'homework-help', 'homework plan: kind === homework-help');
assert(Array.isArray(hwRes.problems) && hwRes.problems.length === 2, 'homework plan: 2 problems');

const normalRes = toResponse(normalPlan, { cached: false, sessionMinutes: 30 });
assert(!('kind' in normalRes), 'normal plan: no kind key');
assert(!('problems' in normalRes), 'normal plan: no problems key');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
