// scripts/test-relation-sampling.ts
//
// Exact comparator for one-variable linear relations
// (src/lib/tutor/voice/relation-sampling.ts). The overriding property under
// test: `unknown` — never a wrong verdict — whenever the module is not certain
// it parsed both sides.
import { strict as assert } from 'node:assert';
import {
  parseRelation,
  splitRelationChain,
  extractProblemRelation,
  compareRelations,
  compareRelationTexts,
  formatWitness,
  adjudicateAnswerDispute,
  type Rational,
  type SetCompare,
} from '../src/lib/tutor/voice/relation-sampling';

const R = String.raw;
let checks = 0;
const ok = (cond: unknown, msg: string): void => { assert.ok(cond, msg); checks++; };
const eq = <T>(actual: T, expected: T, msg: string): void => { assert.deepEqual(actual, expected, msg); checks++; };

/** Independent membership predicate in INTEGER arithmetic: x = n/d, d > 0. */
type Pred = (n: number, d: number) => boolean;

function expectDiffers(a: string, b: string, kinds: Array<'drops' | 'adds' | 'both'>, predA: Pred, predB: Pred): Extract<SetCompare, { verdict: 'differs' }> {
  const res = compareRelationTexts(a, b);
  const tag = `${a}  vs  ${b}`;
  assert.equal(res.verdict, 'differs', `${tag}: expected differs, got ${JSON.stringify(res)}`);
  if (res.verdict !== 'differs') throw new Error('unreachable');
  ok(kinds.includes(res.kind), `${tag}: kind ${res.kind} not in ${kinds.join('/')}`);
  const w = res.witness;
  ok(Number.isSafeInteger(w.n) && Number.isSafeInteger(w.d) && w.d > 0, `${tag}: witness malformed`);
  // The witness must REALLY distinguish the two, by independent re-evaluation.
  eq(predA(w.n, w.d), res.aHolds, `${tag}: aHolds wrong at ${formatWitness(w)}`);
  eq(predB(w.n, w.d), res.bHolds, `${tag}: bHolds wrong at ${formatWitness(w)}`);
  ok(res.aHolds !== res.bHolds, `${tag}: witness ${formatWitness(w)} does not distinguish`);
  if (res.kind === 'drops') ok(res.aHolds && !res.bHolds, `${tag}: drops witness must satisfy a only`);
  if (res.kind === 'adds') ok(!res.aHolds && res.bHolds, `${tag}: adds witness must satisfy b only`);
  return res;
}

function expectEquivalent(a: string, b: string): void {
  const res = compareRelationTexts(a, b);
  eq(res.verdict, 'equivalent', `${a}  vs  ${b}: expected equivalent, got ${JSON.stringify(res)}`);
  const rev = compareRelationTexts(b, a);
  eq(rev.verdict, 'equivalent', `${b}  vs  ${a}: expected equivalent (reversed), got ${JSON.stringify(rev)}`);
}

function expectUnknown(a: string, b: string): void {
  const res = compareRelationTexts(a, b);
  eq(res.verdict, 'unknown', `${a}  vs  ${b}: expected unknown, got ${JSON.stringify(res)}`);
  if (res.verdict === 'unknown') ok(res.reason.length > 0, 'unknown must carry a reason');
}

function expectUnparseable(text: string): void {
  const p = parseRelation(text);
  eq(p.ok, false, `parseRelation(${JSON.stringify(text)}) should be not-ok`);
  if (!p.ok) ok(p.reason.length > 0, 'not-ok must carry a reason');
  // …and so any comparison involving it is unknown, in either position.
  expectUnknown(text, 'x < 3');
  expectUnknown('x < 3', text);
}

// ── predicates for the production cases (x = n/d, d > 0) ────────────────────
// 45 + 12t >= 20 + 18t
const tripsProblem: Pred = (n, d) => 45 * d + 12 * n >= 20 * d + 18 * n;
// -4 < (3x+2)/(-2) <= 5   ⇔   3x+2 < 8  and  3x+2 >= -10
const compoundProblem: Pred = (n, d) => 3 * n + 2 * d < 8 * d && 3 * n + 2 * d >= -10 * d;

// ════════════════════════════ MUST DIFFER ═══════════════════════════════════

// 1. Wrong flip: t = 4 satisfies the original (93 ≥ 92) but not t ≥ 25/6.
{
  const res = expectDiffers(R`45 + 12t \ge 20 + 18t`, R`t \ge \frac{25}{6}`, ['drops', 'both'], tripsProblem, (n, d) => 6 * n >= 25 * d);
  ok(res.kind === 'drops' || res.kind === 'both', 'case 1: kind includes drops');
  ok(tripsProblem(4, 1) && !(6 * 4 >= 25), 'case 1 sanity: t = 4 distinguishes');
}

// 2. Compound with a negative divisor.
expectDiffers(R`-4 < \frac{3x+2}{-2} \le 5`, R`8 \ge 3x+2 > -10`, ['drops', 'adds', 'both'], compoundProblem, (n, d) => 8 * d >= 3 * n + 2 * d && 3 * n + 2 * d > -10 * d);
{
  const res = expectDiffers(R`-4 < \frac{3x+2}{-2} \le 5`, R`-4 < x \le 2`, ['drops', 'both'], compoundProblem, (n, d) => -4 * d < n && n <= 2 * d);
  ok(res.aHolds && !res.bHolds, 'case 2: witness is a DROP (a solution of the original the answer loses)');
  ok(compoundProblem(-4, 1), 'case 2 sanity: x = -4 satisfies the original (5 <= 5)');
}

// 3. A chain whose two ends are not equivalent.
{
  const chain = splitRelationChain(R`-3 < 2x+1 \le 7 \Longleftrightarrow 2 < x < 7`);
  ok(chain !== null, 'case 3: chain recognised');
  if (chain) {
    eq(chain.segments.length, 2, 'case 3: two segments');
    eq(chain.connectors, ['iff'], 'case 3: iff connector');
    expectDiffers(chain.segments[0], chain.segments[1], ['drops', 'adds', 'both'],
      (n, d) => -3 * d < 2 * n + d && 2 * n + d <= 7 * d,
      (n, d) => 2 * d < n && n < 7 * d);
    ok(-3 < 2 * 0 + 1 && 2 * 0 + 1 <= 7 && !(2 < 0), 'case 3 sanity: x = 0 distinguishes');
  }
}

// 4. Different endpoints and strictness.
expectDiffers('-7<x<8', '-7 <= x < 5', ['drops', 'adds', 'both'], (n, d) => -7 * d < n && n < 8 * d, (n, d) => -7 * d <= n && n < 5 * d);

// 5. Answer dispute: the solved answer is right, the claimed one is not.
{
  const res = adjudicateAnswerDispute({ statement: 'Solve: $-4 < \\frac{3x+2}{-2} \\le 5$', claimed: '-4 <= x < 20/3', solved: '$-4 \\le x < 2$' });
  eq(res.winner, 'solved', `case 5: winner, got ${JSON.stringify(res)}`);
  ok(res.witnessClaimed !== undefined, 'case 5: witness for the claimed answer');
  if (res.witnessClaimed) {
    const { n, d } = res.witnessClaimed;
    ok(compoundProblem(n, d) !== (-4 * d <= n && 3 * n < 20 * d), 'case 5: witness really separates claimed from the problem');
  }
  eq(res.witnessSolved, undefined, 'case 5: no witness against the correct answer');
}

// 6. Strictness swapped at BOTH ends — the exact-boundary production bug.
{
  const res = expectDiffers(R`-4 < x \le 2`, R`-4 \le x < 2`, ['both'], (n, d) => -4 * d < n && n <= 2 * d, (n, d) => -4 * d <= n && n < 2 * d);
  eq(res.kind, 'both', 'case 6: kind both');
}

// Extra boundary cases: strict vs non-strict at a NON-integer root; a decimal
// approximation of a fraction is not the fraction.
{
  const res = expectDiffers('x < 19/6', 'x <= 19/6', ['adds'], (n, d) => 6 * n < 19 * d, (n, d) => 6 * n <= 19 * d);
  eq(formatWitness(res.witness), '19/6', 'boundary witness is the root itself');
}
expectDiffers('3x < 5', 'x < 1.6667', ['adds'], (n, d) => 3 * n < 5 * d, (n, d) => 10000 * n < 16667 * d);
// A 10-decimal approximation exceeds the exact-arithmetic budget: unknown is
// acceptable, "equivalent" never is.
ok(compareRelationTexts('3x < 5', 'x < 1.6666666667').verdict !== 'equivalent', 'long decimal approximation is never equivalent');
expectDiffers('2x + 1 = 7', 'x = 4', ['both'], (n, d) => 2 * n + d === 7 * d, (n, d) => n === 4 * d);
expectDiffers('x = 3', R`x \le 3`, ['adds'], (n, d) => n === 3 * d, (n, d) => n <= 3 * d);

// ══════════════════════════ MUST BE EQUIVALENT ══════════════════════════════
expectEquivalent(R`25 \ge 6t`, R`45 + 12t \ge 20 + 18t`);
expectEquivalent(R`x \le 6`, R`4x + 9 \le 33`);
expectEquivalent(R`5 > x \ge -7`, R`-7 \le x < 5`);
expectEquivalent(R`-4 \le x < 2`, R`-4 < \frac{3x+2}{-2} \le 5`);
expectEquivalent(R`\frac{1}{2}x < 3`, 'x/2 < 3');
expectEquivalent('x/2 < 3', '0.5x < 3');
expectEquivalent(R`\frac{1}{2}x < 3`, '0.5x < 3');
expectEquivalent('2x + 1 = 7', 'x = 3');
expectEquivalent(R`-4 \le x < 2`, R`$ -4\le   x<2 $`);
expectEquivalent(R`$$4x+9\leq 33$$`, R`4 x + 9 ≤ 33`);
// more forms the grammar promises
expectEquivalent(R`\dfrac{x}{2} < 3`, R`\tfrac{1}{2} \cdot x < 3`);
expectEquivalent(R`3\left(x+1\right) \geq 2x`, R`x ≥ −3`);
expectEquivalent('(2)(x) - x(3) > 1', 'x < -1');
expectEquivalent(R`2 \times x \,<\; 6`, '6 > 2x');
expectEquivalent('0.1x + 0.2x < 0.3', 'x < 1'); // the float trap: 0.1 + 0.2 !== 0.3
expectEquivalent('-(x - 3) >= 2', 'x <= 1');
expectEquivalent('x < 6.', 'x < 6'); // trailing sentence period

// ═══════════════════════════ MUST BE UNKNOWN ════════════════════════════════
expectUnparseable(R`t \ge 5 \text{ whole trips}`);
expectUnparseable('x + y < 3');
expectUnknown(R`x \le 5`, R`t \le 5`); // different letters: unknown, NOT differs
expectUnparseable('x^2 < 9');
expectUnparseable('|x| < 3');
expectUnparseable(R`\frac{1}{x} > 2`);
expectUnparseable(R`2\frac{1}{2} < x`);
expectUnparseable(R`x \ne 3`);
expectUnparseable('x ≠ 3');
expectUnparseable('1 < x > 0');
expectUnparseable(R`x < -3 \text{ or } x > 5`);
expectUnparseable('x < -3 or x > 5');
expectUnparseable('x > 2 and x < 5');
expectUnparseable('The answer is every number less than three.');
expectUnparseable('so x < 3');
expectUnparseable('');
expectUnparseable('   ');
expectUnparseable('x < 99999999999999999999'); // literal overflows 2^53
expectUnknown('123456789012x < 1', '987654321098x < 1'); // arithmetic overflows 2^53
expectUnparseable(R`\sqrt{x} < 3`);
expectUnparseable('(2, 5]'); // interval notation
expectUnparseable(R`x \in (2, 5]`);
expectUnparseable('x < 1,000');
expectUnparseable('1/x > 2');
expectUnparseable('x * x < 9');
expectUnparseable('1/2x < 3'); // (1/2)x or 1/(2x)? ambiguous
expectUnparseable(R`x > 3 \quad x > 5`); // two relations, not a chain
expectUnparseable('x > 3 x > 5');
expectUnparseable('x > 3, x < 5');
expectUnparseable(R`x > 3 \\ x < 5`);
expectUnparseable('2x = 6 = 6');
expectUnparseable('3 < 5'); // no variable
expectUnparseable('x < 3 < 4 < 5');
expectUnparseable(R`x \le 2 \Rightarrow x < 3`); // a chain is not one relation
expectUnparseable('x_1 < 3');
expectUnparseable(R`x < 3\%`);
expectUnparseable('x < 5/0');
expectUnparseable('x < (3');
expectUnparseable('< 3');

// never throws on hostile input
for (const junk of [undefined, null, 42, {}, '\\', '$', '((((', '<<<', '\\frac{', 'x'.repeat(5000), '('.repeat(5000) + 'x' + ')'.repeat(5000) + '<1']) {
  assert.doesNotThrow(() => parseRelation(junk as unknown as string));
  assert.doesNotThrow(() => compareRelationTexts(junk as unknown as string, junk as unknown as string));
  assert.doesNotThrow(() => extractProblemRelation(junk as unknown as string));
  assert.doesNotThrow(() => splitRelationChain(junk as unknown as string));
  assert.doesNotThrow(() => adjudicateAnswerDispute({ statement: junk as unknown as string, claimed: junk as unknown as string, solved: junk as unknown as string }));
  eq(compareRelationTexts(junk as unknown as string, 'x < 3').verdict, 'unknown', 'junk compares unknown');
  checks += 5;
}
assert.doesNotThrow(() => compareRelations(null as never, undefined as never));
eq(compareRelations(null as never, undefined as never).verdict, 'unknown', 'null relations are unknown');

// ═══════════════════════════ ADDS-ONLY (legit split) ════════════════════════
{
  const res = expectDiffers(R`-10 < 3x+2 \le 8`, R`-10 < 3x + 2`, ['adds'],
    (n, d) => -10 * d < 3 * n + 2 * d && 3 * n + 2 * d <= 8 * d,
    (n, d) => -10 * d < 3 * n + 2 * d);
  eq(res.kind, 'adds', 'compound vs its half: adds only');
  // …and the other direction is a pure drop.
  const rev = expectDiffers(R`-10 < 3x + 2`, R`-10 < 3x+2 \le 8`, ['drops'],
    (n, d) => -10 * d < 3 * n + 2 * d,
    (n, d) => -10 * d < 3 * n + 2 * d && 3 * n + 2 * d <= 8 * d);
  eq(rev.kind, 'drops', 'half vs compound: drops only');
}

// ═══════════════════════════ parseRelation shape ════════════════════════════
{
  const p = parseRelation(R`-4 < \frac{3x+2}{-2} \le 5`);
  ok(p.ok, 'compound parses');
  if (p.ok) {
    eq(p.relation.variable, 'x', 'variable');
    eq(p.relation.ops, ['<', '<='], 'ops');
    eq(p.relation.parts.length, 3, 'three parts');
    eq(p.relation.source, R`-4 < \frac{3x+2}{-2} \le 5`, 'source preserved');
  }
  const q = parseRelation(R`45 + 12t \ge 20 + 18t`);
  ok(q.ok, 'two-part parses');
  if (q.ok) {
    eq(q.relation.variable, 't', 'variable t');
    eq(q.relation.ops, ['>='], 'ops');
    eq(q.relation.parts.length, 2, 'two parts');
  }
}

// ═══════════════════════════ splitRelationChain ═════════════════════════════
eq(splitRelationChain(R`x \le 2`), null, 'no connector → null');
eq(splitRelationChain(R`x > 3, \quad x < 5 \\ x = 1. \dots`), null, 'commas, quad, line breaks, dots are not connectors');
eq(splitRelationChain(''), null, 'empty → null');
eq(splitRelationChain(R`2x < 6 \iff x < 3`), { segments: ['2x < 6', 'x < 3'], connectors: ['iff'] }, 'iff');
eq(splitRelationChain(R`2x < 6 \Leftrightarrow x < 3`)?.connectors, ['iff'], 'Leftrightarrow');
eq(splitRelationChain('2x < 6 ⟺ x < 3')?.connectors, ['iff'], 'unicode iff');
eq(splitRelationChain(R`2x < 6 \Rightarrow x < 3`)?.connectors, ['implies'], 'Rightarrow');
eq(splitRelationChain(R`2x < 6 \implies x < 3`)?.connectors, ['implies'], 'implies');
eq(splitRelationChain(R`2x < 6 \Longrightarrow x < 3`)?.connectors, ['implies'], 'Longrightarrow');
eq(splitRelationChain('2x < 6 ⟹ x < 3')?.connectors, ['implies'], 'unicode implies');
eq(
  splitRelationChain(R`4x + 9 \le 33 \iff 4x \le 24 \Rightarrow x \le 6`),
  { segments: [R`4x + 9 \le 33`, R`4x \le 24`, R`x \le 6`], connectors: ['iff', 'implies'] },
  'three-segment chain keeps order',
);

// ═══════════════════════════ extractProblemRelation ═════════════════════════
{
  const a = extractProblemRelation(R`Solve and graph: $4x + 9 \le 33$`);
  ok(a.ok, `delimited statement: ${JSON.stringify(a)}`);
  if (a.ok) eq(compareRelations(a.relation, (parseRelation('x <= 6') as { ok: true; relation: never }).relation).verdict, 'equivalent', 'extracted relation is the problem');

  const b = extractProblemRelation(R`Solve: -4 < (3x+2)/(-2) \le 5`);
  ok(b.ok, `plain statement: ${JSON.stringify(b)}`);
  if (b.ok) {
    eq(b.relation.ops, ['<', '<='], 'plain statement ops');
    eq(compareRelations(b.relation, (parseRelation('-4 <= x < 2') as { ok: true; relation: never }).relation).verdict, 'equivalent', 'plain statement relation is the problem');
  }

  const c = extractProblemRelation(R`$-4 < \frac{3x+2}{-2} \le 5$`);
  ok(c.ok, 'bare relation statement');
  const d = extractProblemRelation('Solve the inequality 3x - 2 < 10 and graph the solution.');
  ok(d.ok, `prose around a plain relation: ${JSON.stringify(d)}`);

  const notOk = (s: string, why: string): void => {
    const r = extractProblemRelation(s);
    eq(r.ok, false, `${why}: ${JSON.stringify(s)} → ${JSON.stringify(r)}`);
    if (!r.ok) ok(r.reason.length > 0, 'not-ok carries a reason');
  };
  notOk('A taxi charges 45 dollars plus 12 dollars per trip. How many trips can Maya afford?', 'word problem, no relation');
  notOk(R`Solve $2x < 6$ and $x + 1 > 0$.`, 'two relations');
  notOk('Solve 2x < 6 or x > 9', 'two plain relations');
  notOk(R`Solve $2x < 6$ where x > 0`, 'relation outside the delimiters');
  notOk(R`Solve $2x < 7$ where $x$ is a positive integer.`, 'domain restriction changes the solution set');
  notOk(R`If $3x < 5$, what is the greatest value of $x$?`, 'not a solve-for-the-set question');
  notOk('Solve: twice x < 5', 'relation truncated by prose');
  notOk('Solve x < 1,000', 'thousands separator');
  notOk('', 'empty');
  notOk(R`Solve: $x^2 < 9$`, 'non-linear problem');
}

// ═══════════════════════════ adjudicateAnswerDispute ════════════════════════
{
  const st = R`Solve: $-4 < \frac{3x+2}{-2} \le 5$`;
  eq(adjudicateAnswerDispute({ statement: st, claimed: R`-4 \le x < 2`, solved: '-4 <= x < 20/3' }).winner, 'claimed', 'claimed wins');
  eq(adjudicateAnswerDispute({ statement: st, claimed: R`-4 \le x < 2`, solved: R`2 > x \ge -4` }).winner, 'both', 'both right');
  const neither = adjudicateAnswerDispute({ statement: st, claimed: R`-4 < x \le 2`, solved: 'x < 2' });
  eq(neither.winner, 'neither', 'neither right');
  ok(neither.witnessClaimed !== undefined && neither.witnessSolved !== undefined, 'neither: both witnesses');
  // One answer unparseable ⇒ unknown, never a win by default (it might be the
  // same set in a notation we cannot read).
  eq(adjudicateAnswerDispute({ statement: st, claimed: '[-4, 2)', solved: R`-4 \le x < 2` }).winner, 'unknown', 'interval-notation answer → unknown');
  eq(adjudicateAnswerDispute({ statement: 'How many trips?', claimed: 't >= 5', solved: 't <= 4' }).winner, 'unknown', 'no problem relation → unknown');
  eq(adjudicateAnswerDispute({ statement: st, claimed: R`-4 \le t < 2`, solved: R`-4 \le x < 2` }).winner, 'unknown', 'different variable → unknown');
}

// ═══════════════════════════ formatWitness ══════════════════════════════════
const w = (n: number, d: number): Rational => ({ n, d });
eq(formatWitness(w(4, 1)), '4', 'integer');
eq(formatWitness(w(-4, 1)), '-4', 'negative integer');
eq(formatWitness(w(0, 1)), '0', 'zero');
eq(formatWitness(w(19, 6)), '19/6', 'fraction');
eq(formatWitness(w(-7, 2)), '-7/2', 'negative fraction');

// Prefer an integer witness when one exists.
{
  const res = compareRelationTexts('x < 7/2', 'x < 9/2');
  ok(res.verdict === 'differs' && res.witness.d === 1 && res.witness.n === 4, `integer witness preferred: ${JSON.stringify(res)}`);
  const res2 = compareRelationTexts('x < 1/3', 'x < 2/3');
  ok(res2.verdict === 'differs' && res2.witness.d !== 1, `no integer between the roots → rational witness: ${JSON.stringify(res2)}`);
  if (res2.verdict === 'differs') ok(3 * res2.witness.n >= res2.witness.d && 3 * res2.witness.n < 2 * res2.witness.d, 'rational witness lies in [1/3, 2/3)');
}

console.log(`relation-sampling: all ${checks} assertions passed`);
