/**
 * Homework Help: the student's typed text is the material (2026-10-05).
 *
 * 21 scripted sessions on the GreenApple sandbox: `hasProblemSignals`
 * returned false for 6 of the 21 typed questions, which then got a generated
 * multi-objective lesson with invented examples; one got an objective picker.
 * All 21 must take the homework path; a bare topic must not.
 *
 * Run: npx tsx scripts/test-homework-own-material.ts (npm run test:homework-own-material)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  hasProblemSignals, typedHomeworkIsOwnMaterial, isBareTopicRequest, typedHomeworkPlanDecision,
  capObjectivesForHomework, typedEnumerationText,
} from '../src/lib/tutor/lesson-plan/homework';
import { formatHomeworkSessionBlock } from '../src/lib/tutor/voice/claude-brain';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

/** The 21 typed questions, verbatim (transcripts/*.md "Typed question"). */
const TYPED: Array<[subject: string, text: string]> = [
  ['ALGEBRA_1', "I'm stuck on these two equations from my homework: (a) 3(x - 2) + 4 = 2x + 7 and (b) 5(2y + 1) = 3y - 9. Can you help me solve them?"],
  ['GEOMETRY', "Two homework problems I can't finish: (a) Two angles are supplementary and one is three times the other. Find both angles. (b) Angle 1 = (2x + 10) degrees and angle 2 = (3x - 5) degrees are complementary. Find x and both angles."],
  ['BIOLOGY', "Homework questions on enzymes: (a) Why does an enzyme stop working when the temperature gets too high? (b) What does a competitive inhibitor do to an enzyme's active site?"],
  ['CHEMISTRY', 'Two chemistry homework problems: (a) A block has mass 54 g and volume 20 cm^3. What is its density? (b) Convert 2.5 hours to seconds using dimensional analysis.'],
  ['AP_CALCULUS_BC', 'I need help with two limits: (a) lim as x -> 3 of (x^2 - 9)/(x - 3) and (b) lim as x -> 0 of (sqrt(x + 4) - 2)/x.'],
  ['AP_STATISTICS', 'Stats homework: the data set is 4, 8, 15, 16, 23, 42. (a) Find the median and the IQR. (b) Is 42 an outlier by the 1.5 x IQR rule?'],
  ['AP_ENVIRONMENTAL_SCIENCE', 'APES homework: (a) A field has a GPP of 1000 kcal/m^2/yr and the plants use 600 kcal/m^2/yr in respiration. What is the NPP? (b) About how much of that energy reaches the secondary consumers, two trophic levels above the plants?'],
  ['AP_PSYCHOLOGY', 'AP Psych homework: (a) What happens during the refractory period of a neuron? (b) What is the difference between an excitatory and an inhibitory neurotransmitter?'],
  ['AP_MACROECONOMICS', 'Macro homework: Country A can make 10 cars or 20 tons of wheat. Country B can make 5 cars or 15 tons of wheat. (a) What is the opportunity cost of one car in each country? (b) Which country has the comparative advantage in cars?'],
  ['HS_ENGLISH', "English homework: (a) Fix the pronoun error in this sentence: 'Each of the students brought their own lunch.' (b) Which is correct, 'between you and I' or 'between you and me', and why?"],
  ['WORLD_HISTORY', 'History homework: (a) Why did the Roman Republic turn into an empire? (b) What was the role of the Senate in the Roman Republic?'],
  ['AP_US_GOVERNMENT', "I have an AP Gov FRQ: 'Describe how the principle of checks and balances is illustrated when the Senate rejects a presidential nominee, and explain one way the president could respond.' Can you help me plan my answer?"],
  ['AP_US_HISTORY', "APUSH short-answer question: 'Briefly explain ONE difference between the New England colonies and the Chesapeake colonies in the 1600s.' Can you help me write a response?"],
  ['AP_WORLD_HISTORY', "AP World short-answer question: 'Identify ONE way the Mongol Empire facilitated trade across Eurasia in the 13th and 14th centuries.' Can you help me answer it?"],
  ['AP_ENGLISH_LANGUAGE', "AP Lang argument essay: the prompt is 'Should schools require students to complete community service to graduate?' I need help writing a defensible thesis."],
  ['PHYSICS', 'Physics homework: (a) A ball is dropped from the top of a 45 m building. How long does it take to hit the ground? Use g = 10 m/s^2. (b) What is its speed just before it hits the ground?'],
  ['PRECALCULUS', 'Precalc homework: (a) Find the inverse of f(x) = 2x + 6. (b) Find the inverse of g(x) = (x - 1)/3 and verify that g(g^-1(x)) = x.'],
  ['ALGEBRA_2', 'Algebra 2 homework: (a) Solve |2x - 3| = 7. (b) Solve |x + 4| < 6.'],
  ['AP_CALCULUS_AB', 'AP Calc AB homework: (a) lim as x -> 2 of (x^2 - 4)/(x - 2). (b) lim as x -> 0 of (sqrt(x + 9) - 3)/x.'],
  ['AP_BIOLOGY', 'AP Bio homework: (a) What happens to water during dehydration synthesis? (b) How many water molecules are needed to break a chain of 10 glucose units completely into monomers?'],
  ['AP_CHEMISTRY', 'AP Chem homework: (a) A compound is 40.0% C, 6.7% H and 53.3% O by mass. Find its empirical formula. (b) The molar mass is 180 g/mol. What is the molecular formula?'],
];
assert(TYPED.length === 21, 'fixture: 21 typed questions');
const missedBefore = TYPED.filter(([, t]) => !hasProblemSignals(t)).map(([s]) => s);
console.log(`  (hasProblemSignals alone misses: ${missedBefore.join(', ')})`);
assert(missedBefore.length >= 5, 'precondition: the regex gate alone misses the FRQ / essay / data / sentence questions');
for (const [subject, text] of TYPED) {
  assert(typedHomeworkIsOwnMaterial(text) === true, `${subject}: the typed question is the student's own material → homework path`);
  assert(typedHomeworkIsOwnMaterial(typedEnumerationText(undefined, text)) === true, `${subject}: same through typedEnumerationText`);
}

// Single signals, one each.
const OWN: string[] = [
  '(a) Find the median. (b) Find the IQR.',
  "The prompt is 'Should schools require students to complete community service to graduate?'",
  'My data set is 4, 8, 15, 16, 23, 42',
  'Identify one way the Mongol Empire facilitated trade across Eurasia.',
  'Fix the pronoun error in this sentence: Each of the students brought their own lunch.',
  'Why did the Roman Republic turn into an empire?',
  'Which country has the comparative advantage in cars?',
  'Can you check my thesis: “Schools should require service because it builds civic habits.”',
  'Describe how the principle of checks and balances is illustrated when the Senate rejects a nominee',
  'Write a paragraph explaining one cause of the First World War and one consequence of it for Europe',
  '2x + 3 = 7',
  'Solve for x\nGraph the line',
];
for (const t of OWN) assert(typedHomeworkIsOwnMaterial(t) === true, `own material: ${JSON.stringify(t.slice(0, 60))}`);

// Bare topics: no task → the ordinary lesson path.
const TOPICS: string[] = [
  'help me with fractions',
  'Help me with fractions please',
  'Can you help me with fractions?',
  'I need help with photosynthesis',
  'I need help with the quadratic formula.',
  "I'm stuck on factoring",
  "I don't understand logarithms",
  'teach me about the French Revolution',
  'explain photosynthesis',
  'How do I factor a quadratic?',
  'what is a mole?',
  'What are covalent bonds',
  'Solving Linear Inequalities One Variable',
  'Grade 8 fractions',
  'fractions',
  'The causes of World War One',
  'homework on enzymes',
  'Linear Equations',
  '   ',
];
for (const t of TOPICS) {
  assert(isBareTopicRequest(t) === true, `bare topic: ${JSON.stringify(t)}`);
  assert(typedHomeworkIsOwnMaterial(t) === false, `bare topic is not own material: ${JSON.stringify(t)}`);
}
// A frame does not hide a real task.
assert(typedHomeworkIsOwnMaterial('help me with 3(x - 2) + 4 = 2x + 7') === true, 'a request frame around an equation is still a problem');
assert(typedHomeworkIsOwnMaterial("I need help with this sentence: 'Each of the students brought their own lunch.'") === true, 'a request frame around a quoted sentence is still the material');
// Flag off: exactly the old gate.
for (const [subject, text] of TYPED) {
  assert(typedHomeworkIsOwnMaterial(text, { enabled: false }) === hasProblemSignals(text), `flag off = hasProblemSignals (${subject})`);
}
// A host focus preamble with a plain topic still does not enumerate (I2).
const preamble = 'Focus this session on what the student has not covered yet:\n- Objective one: graph a line\n- Objective two: find the slope';
assert(typedHomeworkIsOwnMaterial(typedEnumerationText('Linear Equations', `${preamble}\n\nTopic: Linear Equations`)) === false, 'I2 kept: preamble + plain topic → no enumeration');

// A failed split of the student's own typed text is still their material.
const essay = TYPED[14][1];
const failOpen = { problems: [{ n: 1, text: essay }], failedOpen: true };
const d1 = typedHomeworkPlanDecision(failOpen, { ownMaterial: true });
assert(d1.kind === 'homework' && d1.problems.length === 1 && d1.problems[0].text === essay, 'fail-open + own material → one-problem homework plan holding the text verbatim');
assert(typedHomeworkPlanDecision(failOpen, { ownMaterial: false }).kind === 'normal', 'fail-open without own material (upload / flag off) → normal plan, as before');
assert(typedHomeworkPlanDecision({ problems: [], failedOpen: false }, { ownMaterial: true }).kind === 'normal', 'zero problems → normal plan');
const real = typedHomeworkPlanDecision({ problems: [{ n: 1, text: 'a' }, { n: 2, text: 'b' }], failedOpen: false }, { ownMaterial: true });
assert(real.kind === 'homework' && real.problems.length === 2, 'a real split is unchanged');

// Never a picker for homework-help.
assert(capObjectivesForHomework([1, 2, 3, 4, 5, 6], 5).length === 5, 'six objectives, room for five → five, no picker');
assert(capObjectivesForHomework([1, 2], 5).length === 2, 'fewer than the cap → unchanged');
assert(capObjectivesForHomework([1, 2, 3], 0).length === 1, 'never empty');

// Route wiring.
const route = readFileSync(join(__dirname, '..', 'src/app/api/portal/v1/plan-generate/route.ts'), 'utf8');
assert(route.includes('typedHomeworkIsOwnMaterial(typedProblemText, { enabled: TUTOR_HOMEWORK_OWN_MATERIAL })'), 'wiring: the typed gate is typedHomeworkIsOwnMaterial under the flag');
assert(route.includes('typedHomeworkPlanDecision(enumerated, { ownMaterial: typedOwnMaterial && !hasMaterials })'), 'wiring: a failed split of typed own material stays homework');
assert(route.includes('const homeworkNoPicker = isHomework && TUTOR_HOMEWORK_OWN_MATERIAL;'), 'wiring: homework-help never takes the picker branch');
assert(/stage1\.los\.length > X && !homeworkNoPicker/.test(route), 'wiring: the picker branch excludes homework-help');
assert(route.includes('capObjectivesForHomework(stage1.los, X)'), 'wiring: the objectives are capped instead');

// The homework session block coaches an open-response prompt on the student's own prompt.
const block = formatHomeworkSessionBlock({ problems: [{ n: 1, text: essay }], current: 1 });
assert(block.includes(essay), 'session block: carries the student\'s prompt verbatim');
assert(/never (?:replace|substitute)/i.test(block) && /open-response|no single correct answer/i.test(block), 'session block: open-response rule — coach on the student\'s own prompt, never another');
assert(!/community service/i.test(block.replace(essay, '')), 'session block: the rule itself is generic (no topic words)');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
