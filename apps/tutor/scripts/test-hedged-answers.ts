/**
 * Hedged answers (2026-10-05, 21 scripted Homework Help sessions).
 *
 * Step 4 of every script typed "I don't know, maybe <answer>?". In five
 * sessions the value was exactly right and was told "Not quite" or not
 * credited; in AP Calculus AB the denial was then counted as a wrong answer
 * and the partner feed reported "Needs Support". Three things are pinned:
 *   1. the hedged-value predicate reads a unit, an inequality / expression
 *      and a trailing reason;
 *   2. the per-turn prompt blocks: "I don't know" ALONE is a non-answer, "I
 *      don't know, maybe X" is the answer X; in multi-part homework the
 *      tracked problem's key applies only to an answer to that part;
 *   3. a tutor denial of a hedged answer is counted against the student only
 *      when a verified key or the judge agrees it was wrong.
 *
 * Run: npx tsx scripts/test-hedged-answers.ts (npm run test:hedged-answers)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isHedgedValueAnswer, isSelfReport, isHedgedProposal, studentTurnShape, isStudentQuestion } from '../src/lib/tutor/orchestrator/student-turn-shape';
import { inferWrongEvent, hedgedDenialCounts, isAnswerAttempt } from '../src/lib/tutor/orchestrator/answer-attempt';
import { isLedgerStuckCue } from '../src/lib/tutor/orchestrator/struggle-ledger';
import {
  formatVerdictGuardBlock, formatActiveProblemBlock, ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX, ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX,
} from '../src/lib/tutor/voice/claude-brain';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

console.log('\n1. hedged proposed values');
/** Step "4-hedge" of the recorded sessions whose proposal is a value. */
const RECORDED_VALUE_HEDGES: Array<[string, string]> = [
  ['physics', "I don't know, maybe 30 m/s?"],
  ['algebra-2', "I don't know, maybe -10 < x < 2?"],
  ['ap-environmental-science', "I don't know, maybe 4 kcal/m^2/yr, because it's 10% twice?"],
  ['ap-calculus-ab', "I don't know, maybe 1/6?"],
  ['ap-calculus-bc', "I don't know, maybe 1/4?"],
  ['chemistry', "I don't know, maybe 9000 seconds?"],
  ['precalculus', "I don't know, maybe 3x + 1?"],
  ['geometry', "I don't know, maybe x = 17?"],
  ['algebra-1', "I don't know, maybe y = -2?"],
];
for (const [session, a] of RECORDED_VALUE_HEDGES) {
  test(`${session}: "${a}" is a hedged value answer, not a self-report, not a stuck cue`, () => {
    assert.equal(isHedgedValueAnswer(a), true);
    assert.equal(isSelfReport(a), false);
    assert.equal(studentTurnShape(a), 'answer_like');
    assert.equal(isLedgerStuckCue(a), false);
    assert.equal(isAnswerAttempt(a), true);
    assert.equal(isHedgedProposal(a), true);
  });
}
test('the three forms named in the report were NOT read before (wideValues:false)', () => {
  for (const a of [RECORDED_VALUE_HEDGES[0][1], RECORDED_VALUE_HEDGES[1][1], RECORDED_VALUE_HEDGES[2][1]]) {
    assert.equal(isHedgedValueAnswer(a, { wideValues: false }), false, a);
  }
});
test('more of each form: unit, inequality / interval / expression, trailing reason', () => {
  for (const a of [
    "I don't know, 30 m/s?", "I'm not sure, 5 meters per second", "I don't know, maybe 12 cm^3", "I'm not sure but 45%", 'I forgot, maybe 2.7 g/cm^3?',
    "I'm not sure, x > -10", "I don't know, maybe x = 4 or x = -2", "I don't know, maybe (-10, 2)?", "I don't know, is it 2x + 6?", "I can't remember, maybe x^2 - 4?",
    "I don't know, maybe 5 because it's half", "I don't know, maybe 5, because it's half of ten?", "I'm not sure, 12 since 3 times 4 is 12",
  ]) {
    assert.equal(isHedgedValueAnswer(a), true, a);
    assert.equal(isSelfReport(a), false, a);
  }
});
test('real self-reports and questions keep their shape', () => {
  for (const a of [
    'I am not good at 2 digit multiplication', "I don't know how to do step 2", "I don't know what 5 means", "I don't know, can you repeat question 3",
    "I don't understand, why 5?", "I don't know, one sec", "I'm stuck on problem 3", "I don't understand 3x + 1", "I don't know", "I don't know.",
    "I don't get it because the 5 is negative", "I don't know because I forgot 2 steps", "I'm confused about the 10 m/s part",
  ]) {
    assert.equal(isHedgedValueAnswer(a), false, a);
    assert.equal(isSelfReport(a), true, a);
  }
  for (const q of ['which is bigger, 5 or 6?', 'how to solve: x>5 or x<3', 'why is it 30 m/s?']) {
    assert.equal(isHedgedValueAnswer(q), false, q);
    assert.equal(isStudentQuestion(q), true, q);
  }
});
test('the predicate is still the hedged-VALUE rule (cases pinned on 2026-10-04 unchanged)', () => {
  for (const a of ['5', 'is it 5?', "I think it's 7", "I don't know, maybe the commutative property", '']) assert.equal(isHedgedValueAnswer(a), false, a);
  for (const a of ["I don't know, 5?", "I don't know 5", "I don't know. 7.", 'I dont know but 5', "I don't know, maybe five", 'I forgot the sign, negative 3']) assert.equal(isHedgedValueAnswer(a), true, a);
});

console.log('\n2. prompt blocks');
test('verdict guard: "I don\'t know" alone is a non-answer; "I don\'t know, maybe X" is the answer X', () => {
  const g = formatVerdictGuardBlock("I don't know, maybe 30 m/s?", 'What does 10 times 3 give you?');
  assert.match(g, /^<verdict_guard>/);
  assert.match(g, /A statement of not knowing that goes on to PROPOSE something \("I don't know, maybe X"\) is the answer X/);
  assert.match(g, /check X on its merits exactly as if it had been stated plainly, and if X is right say so/);
  assert.match(g, /Only a statement of not knowing with nothing proposed is a non-answer/);
  assert.match(g, /"I don't know" ALONE with nothing proposed/);
  assert.match(g, /A hedged correct answer is still correct/);
  // The conflict is gone: "I don't know" no longer appears as an unqualified non-answer.
  assert.doesNotMatch(g, /a question about the material, "I don't know", conversation/);
});
test('verdict guard: generic wording — no subject content, no numbers', () => {
  const g = formatVerdictGuardBlock('maybe 1/6?', 'What is the limit?');
  const added = g.slice(g.indexOf('A statement of not knowing'), g.indexOf('If it is wrong'));
  assert.doesNotMatch(added, /\d|m\/s|limit|equation|fraction/i);
});
test('verdict guard: hedgeRule:false is the previous text; the continuation guard is untouched', () => {
  const old = formatVerdictGuardBlock('maybe 5?', 'What is it?', { hedgeRule: false });
  assert.match(old, /a question about the material, "I don't know", conversation/);
  assert.doesNotMatch(old, /PROPOSE something/);
  assert.match(formatVerdictGuardBlock('Yes.', 'Ready for the next one?'), /^<continuation_guard>/);
});
test('<active_problem> in homework: the key applies only to an answer to THIS problem (all three variants)', () => {
  const variants: Array<Parameters<typeof formatActiveProblemBlock>[0]> = [
    { statement: 'lim as x -> 2 of (x^2 - 4)/(x - 2)', expectedAnswer: '4', source: 'student' },
    { statement: 'lim as x -> 2 of (x^2 - 4)/(x - 2)', expectedAnswer: '4', source: 'card' },
    { statement: 'lim as x -> 2 of (x^2 - 4)/(x - 2)', expectedAnswer: '4' },
  ];
  for (const active of variants) {
    const hw = formatActiveProblemBlock(active, { homework: true });
    assert.ok(hw.includes(`given up.${ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX}${ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX}\n`), `part scope follows the reveal suffix (${active?.source ?? 'pipeline'})`);
    assert.match(hw, /applies ONLY when the student's reply is an answer to THIS problem/);
    assert.match(hw, /judge it against the part it actually answers/);
    assert.match(hw, /never mark it wrong for not matching this one/);
    const plain = formatActiveProblemBlock(active);
    assert.equal(plain.includes(ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX), false, 'not outside homework');
    assert.equal(formatActiveProblemBlock(active, { homework: true, partScope: false }).includes(ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX), false, 'flag off');
  }
});
test('<active_problem> in homework with no verified answer still carries the part scope', () => {
  const b = formatActiveProblemBlock({ statement: 'lim as x -> 2 of (x^2 - 4)/(x - 2)' }, { homework: true });
  assert.ok(b.includes(ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX.trim()));
  assert.equal(formatActiveProblemBlock({ statement: 'x' }).includes(ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX.trim()), false);
});
test('the part-scope sentence is generic (no part letters, no subject words)', () => {
  assert.doesNotMatch(ACTIVE_PROBLEM_HOMEWORK_PART_SUFFIX, /\(a\)|\(b\)|limit|\d/);
});

console.log('\n3. a denial of a hedged answer needs confirming before it counts');
const CALC_AB_STUDENT = "I don't know, maybe 1/6?";
const CALC_AB_TUTOR = "Not quite on $\\sqrt{9}$ — it's actually $3$, not something that cancels to zero. But that $1/6$ guess is really interesting — hold that thought!";
const base = { objectiveCorrect: false, turnShapeGate: true, widenedCorrection: true, ackExclusion: true };
test('AP Calculus AB (recorded): "maybe 1/6?" + "Not quite on √9…" was a wrong event before', () => {
  assert.equal(inferWrongEvent({ ...base, studentText: CALC_AB_STUDENT, tutorText: CALC_AB_TUTOR }), true);
  assert.equal(inferWrongEvent({ ...base, studentText: 'maybe 1/6?', tutorText: CALC_AB_TUTOR }), true);
});
test('…and is NOT one now: no verified key, and the judge faulted the denial', () => {
  const hedgedDenial = { enabled: true, verifiedWrong: false, judgeAgreedWrong: false };
  assert.equal(inferWrongEvent({ ...base, studentText: CALC_AB_STUDENT, tutorText: CALC_AB_TUTOR, hedgedDenial }), false);
  assert.equal(inferWrongEvent({ ...base, studentText: 'maybe 1/6?', tutorText: CALC_AB_TUTOR, hedgedDenial }), false);
  assert.equal(hedgedDenialCounts({ enabled: true, studentText: CALC_AB_STUDENT }), false);
});
test('the other recorded denials of a correct hedge are not counted either', () => {
  for (const [s, t] of [
    ["I don't know, maybe 30 m/s?", "Not quite. Let's check it directly: v = v0 + gt. What does 10 times 3 give you?"],
    ["I don't know, maybe 4 kcal/m^2/yr, because it's 10% twice?", "Not quite — let's check that step by step."],
  ]) assert.equal(inferWrongEvent({ ...base, studentText: s, tutorText: t, hedgedDenial: { enabled: true } }), false, s);
});
test('a hedged answer that a verified key says is wrong IS counted', () => {
  assert.equal(inferWrongEvent({ ...base, studentText: "I don't know, maybe 15 m/s?", tutorText: "Not quite. Let's look again.", hedgedDenial: { enabled: true, verifiedWrong: true } }), true);
  assert.equal(hedgedDenialCounts({ enabled: true, studentText: "I don't know, maybe 15 m/s?", verifiedWrong: true }), true);
});
test('a hedged answer whose denial the judge reviewed and did not fault IS counted', () => {
  assert.equal(inferWrongEvent({ ...base, studentText: 'maybe 12?', tutorText: "Not quite. Let's look again.", hedgedDenial: { enabled: true, judgeAgreedWrong: true } }), true);
});
test('an answer with no hedge is counted exactly as before, whatever the confirmation', () => {
  for (const s of ['12', 'x = 4', 'the answer is 12', '3x - 1', 'Country B']) {
    assert.equal(hedgedDenialCounts({ enabled: true, studentText: s }), true, s);
    assert.equal(inferWrongEvent({ ...base, studentText: s, tutorText: "Not quite. Let's look again.", hedgedDenial: { enabled: true } }), true, s);
  }
});
test('hedged proposals: with and without a self-report lead; never a question or a bare self-report', () => {
  for (const s of ['maybe 1/6?', "I think it's 5", 'probably Country A', 'is it 4?', 'could it be x = 3?', "I guess 12", "I don't know, maybe Country A for cars, because 2 tons of wheat is less", "um, maybe 7"]) {
    assert.equal(isHedgedProposal(s), true, s);
  }
  for (const s of ["I don't know", "I don't know how to start", 'why is it 5?', 'can you explain that again', '12', 'x = 4', '[start lesson]', '', 'The answer is 5 and the reason is probably that the denominators match after we multiply both of them']) {
    assert.equal(isHedgedProposal(s), false, s);
  }
});
test('flag off / parameter omitted: the previous behaviour', () => {
  assert.equal(inferWrongEvent({ ...base, studentText: CALC_AB_STUDENT, tutorText: CALC_AB_TUTOR, hedgedDenial: { enabled: false } }), true);
  assert.equal(hedgedDenialCounts({ enabled: false, studentText: CALC_AB_STUDENT }), true);
});
test('an affirmed hedged answer is still never a wrong event', () => {
  assert.equal(inferWrongEvent({ ...base, studentText: CALC_AB_STUDENT, tutorText: 'Right. One sixth it is.', hedgedDenial: { enabled: true, verifiedWrong: true } }), false);
});

console.log('\nwiring');
test('VoiceTutorRealtime: pacing and ledger both ask hedgedDenialCounts with the key / judge signals', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes("decision.credit === 'incorrect' && !hedgedDenialCounts({"), 'pacing: an unconfirmed denial of a hedged answer is not an incorrect');
  assert.ok(vtr.includes("onDebugEvent?.('pacing_hedged_denial_unconfirmed'"), 'pacing: debug event');
  assert.ok(vtr.includes('hedgedDenial: { ...hedgedDenialSignalRef.current },'), 'ledger: inferWrongEvent gets the same signals');
  assert.ok(vtr.includes('hedgedDenialSignalRef.current = { verifiedWrong: false, judgeAgreedWrong: false };'), 'the signals are reset at turn start');
  assert.ok(vtr.includes('hedgedDenialSignalRef.current.judgeAgreedWrong = true;'), 'a judge pass sets the judge signal');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
