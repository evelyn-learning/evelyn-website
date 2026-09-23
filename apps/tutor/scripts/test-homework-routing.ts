/**
 * Round 3 (A1, A2): homework-help uploads are never classified, and only a REAL
 * enumeration makes a homework plan — a fail-open falls back to a normal plan.
 * Pure helpers + a source wiring check on the route (no LLM, no DB).
 * Usage: npx tsx scripts/test-homework-routing.ts (npm run test:homework-routing)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { shouldClassifyMaterial, homeworkPlanDecision } from '../src/lib/tutor/lesson-plan/homework';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

assert(shouldClassifyMaterial('homework-help') === false, 'A1: homework-help skips the classifier');
assert(shouldClassifyMaterial(undefined) === true, 'A1: no goal keeps the classifier');
assert(shouldClassifyMaterial('concept-review') === true, 'A1: any other goal keeps the classifier');

const ten = Array.from({ length: 10 }, (_, i) => ({ n: i + 1, text: `x + ${i} = ${2 * i}` }));
const hw = homeworkPlanDecision({ problems: ten, failedOpen: false });
assert(hw.kind === 'homework' && hw.problems.length === 10, 'A2: a real split → homework plan with every problem');
const one = homeworkPlanDecision({ problems: [{ n: 1, text: 'Solve 2x + 3 = 7' }], failedOpen: false });
assert(one.kind === 'homework' && one.problems.length === 1, 'A2: a genuine single problem stays homework');
const fo = homeworkPlanDecision({ problems: [{ n: 1, text: 'Solving Linear Inequalities One Variable' }], failedOpen: true });
assert(fo.kind === 'normal', 'A2: fail-open → normal plan');
assert(homeworkPlanDecision({ problems: [], failedOpen: false }).kind === 'normal', 'A2: zero problems → normal plan');

const route = readFileSync(join(__dirname, '..', 'src/app/api/portal/v1/plan-generate/route.ts'), 'utf8');
assert(route.includes('if (shouldClassifyMaterial(goal))'), 'wiring: classifyMaterial runs only when shouldClassifyMaterial(goal)');
assert(route.includes('homeworkPlanDecision('), 'wiring: route decides homework vs normal via homeworkPlanDecision');
assert(!route.includes('} else if (isHomework) {'), 'wiring: a fail-open typed request is no longer forced past the cache chain');
assert(route.includes('if (homeworkProblems) {'), 'wiring: the homework build branch keys on real problems');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
