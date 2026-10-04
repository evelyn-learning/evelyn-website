// scripts/test-relation-step-check.ts
// Run: npx tsx scripts/test-relation-step-check.ts
//
// Tiered, TELEMETRY-ONLY relation check for a boarded show_equation
// (src/lib/tutor/voice/relation-step-check.ts), over the exact comparator in
// relation-sampling.ts. A disagreement is COUNTED only when it cannot be a
// legitimate step: `unknown` is never counted, and an adds-only step against
// the problem is a legitimate half of a split compound inequality.
import { strict as assert } from 'node:assert';
import { extractProblemRelation, parseRelation } from '../src/lib/tutor/voice/relation-sampling';
import {
  checkEquationRelations,
  syncRelationTrail,
  describeRelationCheck,
  isDeliberateWrongStepLabel,
  claimedAnswerContradictsProblem,
  type BoardedRelation,
} from '../src/lib/tutor/voice/relation-step-check';

const R = String.raw;
let n = 0;
const ok = (cond: unknown, msg: string): void => { assert.ok(cond, msg); n++; };
const eq = <T>(a: T, b: T, msg: string): void => { assert.deepEqual(a, b, msg); n++; };

const problem = (statement: string) => {
  const p = extractProblemRelation(statement);
  assert.ok(p.ok, `test setup: problem must parse — ${statement} → ${JSON.stringify(p)}`);
  return p;
};
const boarded = (latex: string, partial = false): BoardedRelation => {
  const p = parseRelation(latex);
  assert.ok(p.ok, `test setup: ${latex} must parse`);
  if (!p.ok) throw new Error('unreachable');
  return { latex, relation: p.relation, partial };
};

// ── production: 45 + 12t ≥ 20 + 18t  (⇔ t ≤ 25/6) ─────────────────────────
const TRIPS = problem(R`Solve: $45 + 12t \ge 20 + 18t$`);
{
  const r = checkEquationRelations({ latex: R`t \ge \frac{25}{6}`, label: 'Step 3', problemRelation: TRIPS, previous: null });
  eq(r.tier, 'vs-problem', 'flipped final step: tier');
  ok(r.counted, 'flipped final step: counted');
  ok(r.compare?.verdict === 'differs' && (r.compare.kind === 'drops' || r.compare.kind === 'both'), 'flipped final step: drops/both');
  ok(describeRelationCheck(r).includes('witness='), 'counted description carries a witness');
}
{
  const r = checkEquationRelations({ latex: R`25 \ge 6t`, label: 'Step 2', problemRelation: TRIPS, previous: null });
  eq([r.tier, r.compare?.verdict, r.counted], ['vs-problem', 'equivalent', false], 'correct intermediate step: equivalent, not counted');
  ok(r.boarded !== null && r.boarded.partial === false, 'equivalent step is remembered as the previous relation');
}
{
  const r = checkEquationRelations({ latex: R`t \ge 5 \text{ whole trips}`, label: 'Answer', problemRelation: TRIPS, previous: null });
  eq([r.tier, r.compare?.verdict, r.counted], ['vs-problem', 'unknown', false], 'prose inside the step: unknown, never counted');
  ok(r.compare?.verdict === 'unknown' && r.compare.reason.length > 0, 'unknown carries its reason');
  eq(r.boarded, null, 'an unreadable step is not remembered');
}

// ── production: -4 < (3x+2)/(-2) ≤ 5  (⇔ -4 ≤ x < 2) ──────────────────────
const COMPOUND = problem(R`Solve: $-4 < \frac{3x+2}{-2} \le 5$`);
{
  const r = checkEquationRelations({ latex: R`8 \ge 3x+2 > -10`, label: 'Multiply by -2', problemRelation: COMPOUND, previous: null });
  eq([r.tier, r.counted], ['vs-problem', true], 'strict/non-strict swapped while flipping: counted');
}
{
  const r = checkEquationRelations({ latex: R`-4 < x \le 2`, label: 'Solution', problemRelation: COMPOUND, previous: null });
  eq([r.tier, r.counted], ['vs-problem', true], 'wrong final interval: counted');
}
{
  const r = checkEquationRelations({ latex: R`8 > 3x+2 \ge -10`, label: 'Multiply by -2', problemRelation: COMPOUND, previous: null });
  eq([r.tier, r.compare?.verdict, r.counted], ['vs-problem', 'equivalent', false], 'the correct flip is equivalent');
}

// ── chain inside one card ─────────────────────────────────────────────────
{
  const r = checkEquationRelations({ latex: R`-3 < 2x+1 \le 7 \Longleftrightarrow 2 < x < 7`, label: 'Solve', problemRelation: null, previous: null });
  eq([r.tier, r.counted], ['chain', true], '⟺ with different solution sets: chain, counted');
  ok(r.referenceLatex === R`-3 < 2x+1 \le 7` && r.stepLatex === '2 < x < 7', 'chain reports both sides');
}
{
  const r = checkEquationRelations({ latex: R`-3 < 2x+1 \le 7 \iff -2 < x \le 3`, label: 'Solve', problemRelation: null, previous: null });
  eq([r.tier, r.compare?.verdict, r.counted], ['chain', 'equivalent', false], 'a correct ⟺ chain is equivalent');
  ok(r.boarded?.latex === R`-2 < x \le 3`, 'the chain\'s last relation is what is remembered');
}
{
  // ⟹ : a weaker consequence (adds) is legitimate; losing solutions is not.
  const weaker = checkEquationRelations({ latex: R`x > 3 \Rightarrow x > 1`, label: '', problemRelation: null, previous: null });
  eq([weaker.tier, weaker.counted], ['chain', false], '⟹ to a weaker statement (adds) is not counted');
  const loses = checkEquationRelations({ latex: R`x > 1 \Rightarrow x > 3`, label: '', problemRelation: null, previous: null });
  eq([loses.tier, loses.counted], ['chain', true], '⟹ that drops solutions is counted');
  const addsIff = checkEquationRelations({ latex: R`x > 3 \iff x > 1`, label: '', problemRelation: null, previous: null });
  eq([addsIff.tier, addsIff.counted], ['chain', true], '⟺ counts ANY differs, adds included');
}
{
  // A chain that is internally consistent but starts from a relation that is
  // not the problem's.
  const r = checkEquationRelations({ latex: R`6t \ge 25 \iff t \ge \frac{25}{6}`, label: 'Step', problemRelation: TRIPS, previous: null });
  eq([r.tier, r.counted], ['vs-problem', true], 'consistent chain off a wrong start is counted against the problem');
}
{
  const r = checkEquationRelations({ latex: R`2x < 6 \iff \text{so } x \text{ is small}`, label: '', problemRelation: null, previous: null });
  eq([r.tier, r.compare?.verdict, r.counted], ['chain', 'unknown', false], 'unreadable chain segment: unknown, not counted');
}

// ── adds-only half of a split compound ────────────────────────────────────
const SPLIT = problem(R`Solve: $-3 < 2x+1 \le 7$`);
{
  const left = checkEquationRelations({ latex: R`-3 < 2x+1`, label: 'Left part', problemRelation: SPLIT, previous: null });
  eq([left.tier, left.counted], ['vs-problem', false], 'left half (adds only) is not counted');
  ok(left.compare?.verdict === 'differs' && left.compare.kind === 'adds', 'left half is an adds');
  ok(left.boarded?.partial === true, 'a half is remembered as partial');
  const right = checkEquationRelations({ latex: R`2x+1 \le 7`, label: 'Right part', problemRelation: SPLIT, previous: left.boarded });
  eq([right.tier, right.counted], ['vs-problem', false], 'right half is not counted (and is NOT compared with the left half)');
}

// ── adjacent tier ─────────────────────────────────────────────────────────
{
  const prev = boarded(R`2x + 1 \le 7`);
  const good = checkEquationRelations({ latex: R`2x \le 6`, label: 'Step 2', problemRelation: null, previous: prev });
  eq([good.tier, good.compare?.verdict, good.counted], ['adjacent', 'equivalent', false], 'no problem relation: adjacent, equivalent');
  const bad = checkEquationRelations({ latex: R`x \ge 3`, label: 'Step 3', problemRelation: null, previous: prev });
  eq([bad.tier, bad.counted], ['adjacent', true], 'adjacent step that flips the comparator is counted');
  const widened = checkEquationRelations({ latex: R`x \le 4`, label: 'Step 3', problemRelation: null, previous: prev });
  eq([widened.tier, widened.counted], ['adjacent', false], 'adjacent adds-only is not counted');
  ok(widened.boarded?.partial === true, 'adjacent adds-only is remembered as partial');
  // After a half, the next relation may be the OTHER half — never counted.
  const afterHalf = checkEquationRelations({ latex: R`x > -2`, label: '', problemRelation: null, previous: boarded(R`x \le 3`, true) });
  eq([afterHalf.tier, afterHalf.counted], ['adjacent', false], 'a step after a partial relation is not counted');
}
{
  // Different variable from the problem ⇒ vs-problem is unknown ⇒ fall to adjacent.
  const prev = boarded(R`2u < 6`);
  const r = checkEquationRelations({ latex: R`u > 3`, label: '', problemRelation: SPLIT, previous: prev });
  eq([r.tier, r.counted], ['adjacent', true], 'vs-problem unknown → adjacent decides');
}
{
  const r = checkEquationRelations({ latex: R`2x \le 6`, label: '', problemRelation: null, previous: null });
  eq([r.tier, r.counted, r.skipped], ['none', false, 'nothing-to-compare'], 'no problem relation and no previous: nothing to compare');
  ok(r.boarded !== null, '…but the relation is remembered for the next step');
}

// ── skips ─────────────────────────────────────────────────────────────────
for (const label of ['Common mistake', 'Spot the error', 'Incorrect step', 'Wrong!', 'Your work', "Student's attempt", '✗ Not this', 'ERROR: sign']) {
  const r = checkEquationRelations({ latex: R`t \ge \frac{25}{6}`, label, problemRelation: TRIPS, previous: null });
  eq([r.tier, r.counted, r.skipped, r.boarded], ['none', false, 'label', null], `label "${label}" is skipped entirely`);
  ok(isDeliberateWrongStepLabel(label), `label "${label}" reads as deliberate`);
}
ok(!isDeliberateWrongStepLabel('Step 2: subtract 9') && !isDeliberateWrongStepLabel('') && !isDeliberateWrongStepLabel('Final answer ✓'), 'ordinary labels are not skipped');
{
  // Word problem: the comparator works over the reals and cannot know an
  // integer / non-negative domain.
  const wordProblem = extractProblemRelation('A van carries 12 boxes per trip. How many whole trips until 45 + 12t >= 20 + 18t?');
  ok(!wordProblem.ok, 'test setup: word problem does not yield a relation');
  const r = checkEquationRelations({ latex: R`t \ge \frac{25}{6}`, label: 'Step', problemRelation: wordProblem, previous: boarded(R`25 \ge 6t`) });
  eq([r.tier, r.counted, r.skipped, r.boarded], ['none', false, 'word-problem', null], 'word problem: skipped entirely, even with a previous relation');
}
{
  // Never throws on junk.
  for (const junk of ['', '   ', '\\', '{{{{', 'x'.repeat(5000), undefined, null, 42]) {
    assert.doesNotThrow(() => checkEquationRelations({ latex: junk as unknown as string, label: junk as unknown as string, problemRelation: TRIPS, previous: null }));
    n++;
  }
}

// ── the trail: reset on a new problem and on a new page ───────────────────
{
  const a = syncRelationTrail(null, { statement: R`Solve: $-3 < 2x+1 \le 7$`, pageKey: 'P1', epoch: 1 });
  ok(a.problemChanged && a.trail.problemRelation?.ok === true && a.trail.previous === null, 'first sync parses the problem');
  a.trail.previous = boarded(R`-2 < x \le 3`);
  const same = syncRelationTrail(a.trail, { statement: R`Solve: $-3 < 2x+1 \le 7$`, pageKey: 'P1', epoch: 1 });
  ok(!same.problemChanged && same.trail.previous !== null && same.trail.problemRelation === a.trail.problemRelation, 'same problem, same page: trail kept, problem not re-parsed');
  const page = syncRelationTrail(same.trail, { statement: R`Solve: $-3 < 2x+1 \le 7$`, pageKey: 'P2', epoch: 1 });
  ok(!page.problemChanged && page.trail.previous === null && page.trail.problemRelation?.ok === true, 'new page: previous cleared, problem kept');
  page.trail.previous = boarded(R`x \le 3`);
  const next = syncRelationTrail(page.trail, { statement: 'Solve: 2x < 6', pageKey: 'P2', epoch: 2 });
  ok(next.problemChanged && next.trail.previous === null, 'new problem: previous cleared, problem re-parsed');
  const none = syncRelationTrail(next.trail, { statement: null, pageKey: 'P2', epoch: 2 });
  ok(none.problemChanged && none.trail.problemRelation === null, 'no active problem: problemRelation null (adjacent/chain only)');
  const word = syncRelationTrail(null, { statement: 'How many whole trips are needed?', pageKey: 'P1', epoch: 1 });
  ok(word.trail.problemRelation !== null && word.trail.problemRelation.ok === false, 'word problem: not-ok relation (checks are skipped)');
}

// ── answer-key override: "agreeing" answers that contradict the problem ───
{
  const st = R`Solve: $-4 < \frac{3x+2}{-2} \le 5$`;
  const wrong = claimedAnswerContradictsProblem({ statement: st, claimed: R`-4 < x \le 2` });
  ok(wrong.contradicts && wrong.compare.verdict === 'differs', 'boundary-swapped key contradicts the problem');
  const right = claimedAnswerContradictsProblem({ statement: st, claimed: R`-4 \le x < 2` });
  ok(!right.contradicts && right.compare.verdict === 'equivalent', 'the correct key does not');
  ok(!claimedAnswerContradictsProblem({ statement: st, claimed: '[-4, 2)' }).contradicts, 'unreadable answer: never contradicts');
  ok(!claimedAnswerContradictsProblem({ statement: 'How many whole trips?', claimed: 't >= 5' }).contradicts, 'word problem: never contradicts');
  ok(!claimedAnswerContradictsProblem({ statement: 'Find the mean of 2, 4, 6.', claimed: '4' }).contradicts, 'non-relation problem: never contradicts');
  assert.doesNotThrow(() => claimedAnswerContradictsProblem({ statement: undefined as unknown as string, claimed: null as unknown as string })); n++;
}

console.log(`relation-step-check: ${n} cases passed`);
