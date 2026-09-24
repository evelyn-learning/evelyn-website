/**
 * Round 3 (A1, A2): homework-help uploads are never classified, and only a REAL
 * enumeration makes a homework plan — a fail-open falls back to a normal plan.
 * Pure helpers + a source wiring check on the route (no LLM, no DB).
 * Usage: npx tsx scripts/test-homework-routing.ts (npm run test:homework-routing)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { shouldClassifyMaterial, homeworkPlanDecision, hasProblemSignals, typedEnumerationText, stripFocusPreamble } from '../src/lib/tutor/lesson-plan/homework';

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

// Round 4 (E1): typed text is enumerated only when it looks like problems.
assert(hasProblemSignals('Solving Linear Inequalities One Variable') === false, 'E1: a topic title has no problem signals');
assert(hasProblemSignals('How do I factor a quadratic?') === false, 'E1: one plain question has no problem signals');
assert(hasProblemSignals('Grade 8 fractions') === false, 'E1: digits without an operator');
assert(hasProblemSignals('   ') === false, 'E1: blank');
assert(hasProblemSignals('2x + 3 = 7') === true, 'E1: digits + relation');
assert(hasProblemSignals('Solve 2x + 3 < 7') === true, 'E1: digits + inequality');
assert(hasProblemSignals('Solve for x\nGraph the line') === true, 'E1: two lines');
assert(hasProblemSignals('1) solve for x 2) graph the line') === true, 'E1: numbered list on one line');
assert(hasProblemSignals('a) find the slope b) find the intercept') === true, 'E1: lettered list');
assert(hasProblemSignals('What is a slope? Why is it constant?') === true, 'E1: two questions');
// Final fix wave (I2): a host focus preamble must not read as a problem list.
const preamble = 'Focus this session on what the student has not covered yet:\n- Objective one: graph a line\n- Objective two: find the slope\n- Objective three: write the equation';
const withPlain = `${preamble}\n\nTopic: Linear Equations`;
assert(hasProblemSignals(withPlain) === true, 'I2 precondition: the raw preamble text trips the signal check');
assert(hasProblemSignals(typedEnumerationText('Linear Equations', withPlain)) === false, 'I2: preamble + plain topic field → no enumeration');
assert(hasProblemSignals(typedEnumerationText(undefined, withPlain)) === false, 'I2: preamble + plain topic, no topic field → the marker strip → no enumeration');
const problems = '1) 2x + 3 = 7\n2) 5x - 4 = 11\n3) x/2 = 9';
assert(hasProblemSignals(typedEnumerationText(problems, `${preamble}\n\nTopic: ${problems}`)) === true, 'I2: preamble + a real problem list in the topic → enumeration');
assert(hasProblemSignals(typedEnumerationText(undefined, `${preamble}\n\nTopic: ${problems}`)) === true, 'I2: preamble + a real problem list after the marker → enumeration');
assert(typedEnumerationText(undefined, `${preamble}\n\nTopic: ${problems}`) === problems, 'I2: enumeration input is the post-marker text only');
assert(stripFocusPreamble('Solve 2x + 3 = 7\nGraph y = x') === 'Solve 2x + 3 = 7\nGraph y = x', 'I2: no marker → text unchanged');
assert(typedEnumerationText('   ', 'Topic words') === 'Topic words', 'I2: a blank topic field falls back to the text');
assert(route.includes('const typedProblemText = typedEnumerationText(requestTopic, text);'), 'wiring: the typed gate reads the topic / stripped text');
assert(route.includes('const enumerate = isHomework && (hasMaterials || hasProblemSignals(typedProblemText));'), 'wiring: enumeration gated on materials or problem signals');
assert(route.includes('enumerateProblems(materialText ?? typedProblemText,'), 'wiring: typed enumeration splits the stripped text, never the preamble');
assert(route.includes("homework-help: no problem signals → normal plan"), 'wiring: the skip is logged');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
