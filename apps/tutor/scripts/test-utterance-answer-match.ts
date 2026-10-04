/**
 * Unit test for the tri-state utterance-vs-answer comparator.
 * Usage: npx tsx scripts/test-utterance-answer-match.ts
 */
import { matchUtteranceToAnswer, canonicalizeMathExpression, normalizeSpokenMath, gradeRelationAnswer, relationMatchOpts } from '../src/lib/tutor/voice/utterance-answer-match';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

// — MCQ path —
check('mcq letter agree', matchUtteranceToAnswer('C', 'C', [{letter:'A',text:'1'},{letter:'C',text:'3'}]).verdict === 'agree');
check('mcq letter disagree', matchUtteranceToAnswer('B', 'C', [{letter:'B',text:'2'},{letter:'C',text:'3'}]).verdict === 'disagree');
check('mcq unresolvable utterance is unknown, not disagree', matchUtteranceToAnswer('the third one', 'C', [{letter:'C',text:'3'}]).verdict === 'unknown');
// — numeric path (answersAgree tolerance semantics) —
check('numeric agree with tolerance', matchUtteranceToAnswer('0.785', 'π/4').verdict === 'agree');
check('fraction vs decimal agree', matchUtteranceToAnswer('1/2', '0.5').verdict === 'agree');
check('numeric disagree', matchUtteranceToAnswer('15', '13').verdict === 'disagree');
check('multi-value utterance is unknown', matchUtteranceToAnswer('m is 4 and b is -2', '4').verdict === 'unknown');
// — expression path —
check('expression exact agree', matchUtteranceToAnswer('3x + 2', '3x+2').verdict === 'agree');
check('expression commuted agree', matchUtteranceToAnswer('2 + 3x', '3x+2').verdict === 'agree');
check('frac form agree', matchUtteranceToAnswer('(x+1)/2', '\\frac{x+1}{2}').verdict === 'agree');
check('the session case: -2e^(-2t)', matchUtteranceToAnswer('-2e^(-2t)', '-2e^{-2t}').verdict === 'agree');
check('expression disagree, both fully parsed', matchUtteranceToAnswer('2x', '3x').verdict === 'disagree');
check('unparsed residue is unknown', matchUtteranceToAnswer('something like 3x maybe with a constant', '3x+2').verdict === 'unknown');
check('empty utterance unknown', matchUtteranceToAnswer('', '3x').verdict === 'unknown');
check('empty expected unknown', matchUtteranceToAnswer('3x', '').verdict === 'unknown');
// — canonicalizer directly —
check('canon strips $ and braces', canonicalizeMathExpression('$\\frac{1}{2}x$') === '(1)/(2)x' || canonicalizeMathExpression('$\\frac{1}{2}x$') === 'x(1)/(2)');
check('canon rejects prose', canonicalizeMathExpression('walk me through it') === null);
check('canon unicode minus', canonicalizeMathExpression('−3') === '-3');

// — round-2 review: Finding 1, false agree via numeric-eval fallback —
// extractAnswerNumber greps the first digit run, it does not evaluate the
// expression; the fallback must not fire when either side has un-evaluated
// variable letters.
check('numeric-eval gate: different variables, same digit is disagree', matchUtteranceToAnswer('5a', '5b').verdict === 'disagree');
check('numeric-eval gate: matching digit, mismatched variable is disagree', matchUtteranceToAnswer('3x + 2', '3y + 2').verdict === 'disagree');
check('numeric-eval gate: symbolic multi-assignment (=) is unknown', matchUtteranceToAnswer('x=4, y=-2', '4').verdict === 'unknown');

// — round-2 review: Finding 2, false disagree on regrouped nested arithmetic —
// termMultiset only compares top-level terms; when either side still has
// unresolved grouping after normalization, a mismatch must fall back to
// unknown rather than assert disagree.
check('nested-paren regrouping is unknown, not disagree', matchUtteranceToAnswer('3+(2-(1+4))', '2-(1+4)+3').verdict === 'unknown');
check('regression: flat mismatch still disagree', matchUtteranceToAnswer('2x', '3x').verdict === 'disagree');
check('regression: exponent parens still agree', matchUtteranceToAnswer('-2e^(-2t)', '-2e^{-2t}').verdict === 'agree');

// — round-2 re-review: plain-text sqrt is asymmetric between canonicalization
// (produces literal "sqrt(...)" text) and extractAnswerNumber (only
// evaluates LaTeX \sqrt{} and unicode √ — bare "sqrt(4)" digit-greps to 4,
// not 2). Whitelisting 'sqrt' in the numeric-eval gate reintroduced exactly
// the false-agree class Finding 1 eliminated: sqrt(4)=2 read as agreeing
// with 4. Must land on unknown (unresolved grouping), never agree.
check('sqrt text vs plain number: not agree', matchUtteranceToAnswer('sqrt(4)', '4').verdict !== 'agree');
check('sqrt text vs plain number: is unknown', matchUtteranceToAnswer('sqrt(4)', '4').verdict === 'unknown');
check('pi still whitelisted: π/4 vs 0.785 still agrees', matchUtteranceToAnswer('π/4', '0.785').verdict === 'agree');

// — Task 2: spoken-form normalization —
check('spoken linear form', matchUtteranceToAnswer('three x plus two', '3x+2').verdict === 'agree');
check('hedged question form', matchUtteranceToAnswer('is it 3x + 2?', '3x+2').verdict === 'agree');
check('the answer is prefix', matchUtteranceToAnswer("I think the answer is 15", '15').verdict === 'agree');
check('negative spoken', matchUtteranceToAnswer('negative two e to the negative two t', '-2e^{-2t}').verdict === 'agree');
check('over as division', matchUtteranceToAnswer('minus 3 over 6', '-3/6').verdict === 'agree');
check('spoken fraction words', matchUtteranceToAnswer('one half', '1/2').verdict === 'agree');
check('squared', matchUtteranceToAnswer('x squared plus one', 'x^2+1').verdict === 'agree');
check('hedge does not flip verdict', matchUtteranceToAnswer('maybe 2x?', '3x').verdict === 'disagree');
check('pure prose still unknown', matchUtteranceToAnswer('can you walk me through it', '3x+2').verdict === 'unknown');
check('normalizeSpokenMath direct', normalizeSpokenMath('is it three x plus two?') === '3x+2' || normalizeSpokenMath('is it three x plus two?') === '3 x + 2');

// — review finding: spoken decimals ("point") must collapse cleanly, or
// extractAnswerNumber digit-greps just the integer part before the
// space-padded "." and produces a false disagree on a correct decimal.
check('spoken decimal agree', matchUtteranceToAnswer('three point five', '3.5').verdict === 'agree');
check('spoken decimal disagree outside tolerance', matchUtteranceToAnswer('three point five', '3.6').verdict === 'disagree');
check('normalizeSpokenMath decimal direct', normalizeSpokenMath('three point five') === '3.5');

// — round-3 review: Finding 1, assignment-form utterance vs bare expected —
// "x equals five" normalizes to "x=5"; the expected side is bare "5". Strip
// a single leading assignment prefix off the UTTERANCE only, before the
// prefix ever reaches the numeric/expression paths.
check('assignment-form spoken agree: x equals five vs 5', matchUtteranceToAnswer('x equals five', '5').verdict === 'agree');
check('assignment-form spoken agree: y equals two x plus three vs 2x+3', matchUtteranceToAnswer('y equals two x plus three', '2x+3').verdict === 'agree');
check('assignment-form prefix-strip does not mask a real disagreement', matchUtteranceToAnswer('x equals five', '7').verdict === 'disagree');
check('multi-value guard still runs first (do not reorder away)', matchUtteranceToAnswer('x=4, y=-2', '4').verdict === 'unknown');

// — round-3 review: Finding 2, exact-integer carve-out on the numeric path —
// A blanket 1%-relative tolerance let plain integers off by a little read
// as agreement ('359' vs '360'); exact equality is required when BOTH
// canonical sides are plain integer literals. Non-integer forms keep the
// tolerance.
check('exact integers: 359 vs 360 disagree', matchUtteranceToAnswer('359', '360').verdict === 'disagree');
check('exact integers: 99 vs 100 disagree', matchUtteranceToAnswer('99', '100').verdict === 'disagree');
check('exact integers: identical decimals still agree', matchUtteranceToAnswer('3.5', '3.5').verdict === 'agree');
check('exact integers: comma thousands-separator does not break exactness', matchUtteranceToAnswer('12,000', '12000').verdict === 'agree');
// pi/fraction tolerance paths untouched by the integer carve-out (already
// covered above at lines 18-19, re-asserted here to anchor the finding):
check('non-integer tolerance path unaffected: π/4 vs 0.785 still agree', matchUtteranceToAnswer('0.785', 'π/4').verdict === 'agree');
check('non-integer tolerance path unaffected: 1/2 vs 0.5 still agree', matchUtteranceToAnswer('1/2', '0.5').verdict === 'agree');

// — Task 4: hedge-list extension (negative-question / contracted-future
// forms) + trailing-.0 decimal normalization. Two live sessions had correct
// answers land on `unknown` because these hedge prefixes weren't stripped.
check('negative-question hedge', matchUtteranceToAnswer("shouldn't it be uh 9.0 e to the power of 3 x?", '9e^{3x}').verdict === 'agree');
check('contracted-future hedge', matchUtteranceToAnswer("it'll be just 3 x squared e to the 3 x", '3x^2e^{3x}').verdict === 'agree');
check('wouldnt-it hedge', matchUtteranceToAnswer("wouldn't it be 15?", '15').verdict === 'agree');
check('isnt-it hedge', matchUtteranceToAnswer("isn't it 3x + 2?", '3x+2').verdict === 'agree');
check('trailing .0 normalized', matchUtteranceToAnswer('9.0', '9').verdict === 'agree');
check('trailing .0 in expression', canonicalizeMathExpression('9.0e^(3x)') === canonicalizeMathExpression('9e^(3x)'));
check('non-trailing decimal untouched', matchUtteranceToAnswer('9.05', '9').verdict === 'disagree');
check('hedge does not flip a wrong answer', matchUtteranceToAnswer("shouldn't it be 7?", '9').verdict === 'disagree');

// — review follow-up: either-integer branch must use an absolute epsilon,
// not strict equality — a calculator-artifact utterance ('6.999', '7.001')
// against an integer expected answer ('7') is the same number and must
// still agree; a genuinely different decimal ('9.05' vs '9', '99.5' vs
// '100') must still disagree.
check('float rounding artifact just under: 6.999 vs 7 agree', matchUtteranceToAnswer('6.999', '7').verdict === 'agree');
check('float rounding artifact just over: 7.001 vs 7 agree', matchUtteranceToAnswer('7.001', '7').verdict === 'agree');
check('non-trailing decimal still disagrees: 9.05 vs 9', matchUtteranceToAnswer('9.05', '9').verdict === 'disagree');
check('non-trailing decimal still disagrees: 99.5 vs 100', matchUtteranceToAnswer('99.5', '100').verdict === 'disagree');

// ─── R58b (live, portal-14e07a20): worked-then-result utterances.
// "So that'll be 5 minus 4 = 1." refused as prose residue, so the
// tutor's false denial of a correct answer survived every deterministic
// kill. A single-equation utterance ending in "= <value>" proposes that
// terminal value as the answer — compare the RHS. Multi-assignment
// utterances ("x=4, y=-2") have ≥2 '=' and must keep refusing. ───
check('R58b live fixture: "So that\'ll be 5 minus 4 = 1." vs 1 agree',
  matchUtteranceToAnswer("So that'll be 5 minus 4 = 1.", '1').verdict === 'agree');
check('R58b: wrong terminal RHS disagrees: "5 minus 4 = 2" vs 1',
  matchUtteranceToAnswer('5 minus 4 = 2.', '1').verdict === 'disagree');
check('R58b: worked equation with negative result: "-8 minus 3 = -11" vs -11 agree',
  matchUtteranceToAnswer('-8 minus 3 = -11.', '-11').verdict === 'agree');
check('R58b: multi-assignment still refuses: "x=4, y=-2" vs 4',
  matchUtteranceToAnswer('x=4, y=-2', '4').verdict === 'unknown');
check('R58b: fraction RHS: "so 26 over 2 = 13" vs 13 agree',
  matchUtteranceToAnswer('so 26 over 2 = 13', '13').verdict === 'agree');

// — 2026-10-03: exact grading of inequality answers (flag NEXT_PUBLIC_TUTOR_RELATION_GRADING) —
// Production: a typed "-7<x<8" against expected "-7 <= x < 5" was praised as
// "exactly it" because any answer containing < > ≤ ≥ returned `unknown`.
{
  // 2026-10-04: `disagree` needs POSITIVE evidence of a pure real-number
  // solve — a statement that extracts to one relation equivalent to the key.
  const PURE = { problemText: 'Solve: $-9 \\le 2x + 5 < 15$' }; // ⇔ -7 ≤ x < 5
  const S6LE = { problemText: 'Solve: $2x \\le 12$' };           // ⇔ x ≤ 6
  const S6LT = { problemText: 'Solve: $3x < 18$' };               // ⇔ x < 6
  const wrong = matchUtteranceToAnswer('-7<x<8', '-7 <= x < 5', undefined, PURE);
  check('relation: the production case, with NO statement, is unknown', matchUtteranceToAnswer('-7<x<8', '-7 <= x < 5').verdict === 'unknown');
  check('relation: the production case disagrees', wrong.verdict === 'disagree');
  check('relation: disagree carries a witness', !!wrong.witness && wrong.witness.variable === 'x' && wrong.witness.value !== '');
  check('relation: witness is a real counterexample (one side holds, the other does not)',
    !!wrong.witness && wrong.witness.submittedHolds !== wrong.witness.expectedHolds);
  check('relation: reason names the witness', /^relation differs at x = /.test(wrong.reason));
  check('relation: reversed + LaTeX form agrees', matchUtteranceToAnswer('5 > x \\ge -7', '-7 \\le x < 5').verdict === 'agree');
  check('relation: unicode vs LaTeX agrees', matchUtteranceToAnswer('x ≤ 6', 'x \\le 6').verdict === 'agree');
  check('relation: $-wrapped expected agrees', matchUtteranceToAnswer('x<=6', '$x \\leq 6$').verdict === 'agree');
  check('relation: strict vs non-strict disagrees', matchUtteranceToAnswer('x < 6', 'x \\le 6', undefined, S6LE).verdict === 'disagree');
  check('relation: flipped comparator disagrees', matchUtteranceToAnswer('x > 6', 'x < 6', undefined, S6LT).verdict === 'disagree');
  check('relation: leading hedge is peeled', matchUtteranceToAnswer("I think it's x < 6", 'x < 6').verdict === 'agree');
  check('relation: trailing question mark is fine', matchUtteranceToAnswer('is it x > 6?', 'x < 6', undefined, S6LT).verdict === 'disagree');
  check('relation: a differing pair with no statement is unknown', matchUtteranceToAnswer('x > 6', 'x < 6').verdict === 'unknown');

  // ── defect 1 (2026-10-04): `agree` only for a SOLVED-FORM submission ──
  // Card "Solve the inequality: $2x + 3 < 13$", key x < 5. An equivalent but
  // unsolved submission is not wrong, just unfinished → unknown (the tutor
  // decides); it must never be `agree` (✓ Correct! / false-denial kill).
  const CARD = { problemText: 'Solve the inequality: $2x + 3 < 13$' };
  for (const o of [undefined, CARD]) {
    const tag = o ? 'with statement' : 'no statement';
    check(`solved form: half-solved "2x < 10" vs key "x < 5" → unknown (${tag})`, matchUtteranceToAnswer('2x < 10', 'x < 5', undefined, o).verdict === 'unknown');
    check(`solved form: the retyped problem "2x + 3 < 13" → unknown (${tag})`, matchUtteranceToAnswer('2x + 3 < 13', 'x < 5', undefined, o).verdict === 'unknown');
    check(`solved form: "x < 5" → agree (${tag})`, matchUtteranceToAnswer('x < 5', 'x < 5', undefined, o).verdict === 'agree');
    check(`solved form: reversed "5 > x" → agree (${tag})`, matchUtteranceToAnswer('5 > x', 'x < 5', undefined, o).verdict === 'agree');
  }
  check('solved form: "-x > -5" (variable not isolated) → unknown', matchUtteranceToAnswer('-x > -5', 'x < 5').verdict === 'unknown');
  check('solved form: "x < 2 + 3" (arithmetic left undone) → unknown', matchUtteranceToAnswer('x < 2 + 3', 'x < 5').verdict === 'unknown');
  check('solved form: compound half-solved "-14 <= 2x < 10" → unknown', matchUtteranceToAnswer('-14 <= 2x < 10', '-7 \\le x < 5', undefined, PURE).verdict === 'unknown');
  check('solved form: fraction bound "x < 7/2" vs "x < 3.5" → agree', matchUtteranceToAnswer('x < 7/2', 'x < 3.5').verdict === 'agree');
  check('solved form: an unsolved but WRONG submission still disagrees (with evidence)',
    matchUtteranceToAnswer('2x < 12', 'x < 5', undefined, CARD).verdict === 'disagree');
  check('solved form: the unsolved gradeRelationAnswer reason says so',
    (() => { const g = gradeRelationAnswer('2x < 10', 'x < 5', CARD); return g.verdict === 'unknown' && /solved form/.test(g.reason); })());
  // an EXPECTED key that is not itself in solved form grades nothing
  check('unsolved key: equivalent solved submission → unknown', gradeRelationAnswer('x < 5', '2x < 10', { problemText: 'Solve: $2x < 10$' }).verdict === 'unknown');
  check('unsolved key: differing submission → unknown', gradeRelationAnswer('x < 6', '2x < 10', { problemText: 'Solve: $2x < 10$' }).verdict === 'unknown');
  check('unsolved key: identical text → unknown from the relation path', gradeRelationAnswer('2x < 10', '2x < 10').verdict === 'unknown');

  // ── defect 2 (2026-10-04): no `disagree` without positive evidence ──
  // Implicit-integer problems: no veto word, yet the real-number comparison
  // is the wrong test. Reproduced as false "disagree" by the review.
  const implicit: Array<[string, string, string]> = [
    ['x > 3', 'x \\geq 4', 'A club needs more than 3 members. Write an inequality for the number of members x.'],
    ['x <= 3', 'x < 3.4', 'Tickets cost $5 and Sam has $17. Write an inequality for the number of tickets x he can buy.'],
    ['x ≤ 4', 'x < 5', 'Write an inequality for x, where x is a counting number less than 5.'],
  ];
  for (const [sub, key, stmt] of implicit) {
    const r = matchUtteranceToAnswer(sub, key, undefined, { problemText: stmt });
    check(`implicit-integer: "${sub}" vs "${key}" → unknown, no witness`, r.verdict === 'unknown' && r.witness === undefined);
    check(`implicit-integer: gradeRelationAnswer "${sub}" vs "${key}" → unknown`, gradeRelationAnswer(sub, key, { problemText: stmt }).verdict === 'unknown');
  }
  check('evidence: statement relation NOT equivalent to the key → unknown',
    matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, { problemText: 'Solve 2x < 7.' }).verdict === 'unknown');
  check('evidence: statement with two relations → unknown',
    matchUtteranceToAnswer('x < 6', 'x < 5', undefined, { problemText: 'Solve $2x < 10$ and $x > 0$.' }).verdict === 'unknown');
  check('evidence: statement that does not ask to solve → unknown',
    matchUtteranceToAnswer('x < 6', 'x < 5', undefined, { problemText: 'Maria wrote $2x < 10$ on the board.' }).verdict === 'unknown');
  check('evidence: pure solve whose solution is the key → disagree',
    matchUtteranceToAnswer('x < 6', 'x < 5', undefined, CARD).verdict === 'disagree');
  check('evidence: agree stands without any statement', matchUtteranceToAnswer('x < 5', 'x < 5').verdict === 'agree');
  check('evidence: agree stands under a domain-restricted statement (equal over the reals ⇒ equal on any domain)',
    matchUtteranceToAnswer('3 >= x', 'x \\le 3', undefined, { problemText: 'x is a positive integer. Solve 2x < 7.' }).verdict === 'agree');
  check('\\lt / \\gt spellings are read', matchUtteranceToAnswer('x \\lt 5', '5 \\gt x').verdict === 'agree');
  // unknown, exactly as today, whenever the utterance is not itself a relation
  check('relation: spoken prose is unknown', matchUtteranceToAnswer('between negative seven and five', '-7 <= x < 5').verdict === 'unknown');
  check('relation: relation buried in a sentence is NOT force-parsed',
    matchUtteranceToAnswer('so twice x < 12 means the boundary moves', 'x < 6').verdict === 'unknown');
  check('relation: a bare number against an inequality is unknown', matchUtteranceToAnswer('5', 'x < 5').verdict === 'unknown');
  check('relation: an equation against an inequality is unknown', matchUtteranceToAnswer('x = 5', 'x < 5').verdict === 'unknown');
  check('relation: different variable is unknown', matchUtteranceToAnswer('y < 5', 'x < 5').verdict === 'unknown');
  check('relation: unsupported expected (union) is unknown', matchUtteranceToAnswer('x < 2', 'x < 2 or x > 7').verdict === 'unknown');
  check('relation: quadratic expected is unknown', matchUtteranceToAnswer('x^2 < 4', 'x^2 < 4').verdict === 'unknown');
  // a domain restriction in the problem changes what a right answer is
  check('relation: problem restricts the domain → unknown',
    matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, { problemText: 'x is a positive integer. Solve 2x < 7.' }).verdict === 'unknown');
  check('relation: same pair without the restriction disagrees',
    matchUtteranceToAnswer('x \\le 3', 'x < 3.5', undefined, { problemText: 'Solve 2x < 7.' }).verdict === 'disagree');
  // MCQ still resolves when the utterance is a letter
  const ch = [{ letter: 'A', text: 'x < 5' }, { letter: 'B', text: 'x \\le 5' }];
  check('relation: mcq letter still resolves against a relation-valued expected', matchUtteranceToAnswer('B', 'B', ch).verdict === 'agree');
  {
    // a letter against relation TEXT: whatever the pre-existing paths decide, unchanged
    const on = matchUtteranceToAnswer('A', 'x \\le 5', ch);
    process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING = 'off';
    const off = matchUtteranceToAnswer('A', 'x \\le 5', ch);
    delete process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING;
    check('relation: mcq letter vs relation-text expected falls through unchanged', on.verdict === off.verdict && on.reason === off.reason);
  }
  // the comparator directly
  const g = gradeRelationAnswer('-7<x<8', '-7 <= x < 5', PURE);
  check('gradeRelationAnswer: disagree + witness', g.verdict === 'disagree' && g.witness.variable === 'x');
  check('gradeRelationAnswer: same pair, no statement → unknown', gradeRelationAnswer('-7<x<8', '-7 <= x < 5').verdict === 'unknown');
  check('gradeRelationAnswer: expected without an inequality is unknown', gradeRelationAnswer('x < 5', '5').verdict === 'unknown');
  // kill switch
  const prev = process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING;
  process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING = 'off';
  check('relation: flag off → unknown as before', matchUtteranceToAnswer('-7<x<8', '-7 <= x < 5', undefined, PURE).verdict === 'unknown');
  if (prev === undefined) delete process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING;
  else process.env.NEXT_PUBLIC_TUTOR_RELATION_GRADING = prev;
  // non-relation answers are untouched by the new path
  check('relation path leaves numeric alone', matchUtteranceToAnswer('15', '13').verdict === 'disagree');
  check('relation path leaves expressions alone', matchUtteranceToAnswer('2 + 3x', '3x+2').verdict === 'agree');
  check('relation path leaves equation-form expected alone', matchUtteranceToAnswer('5', 'x=5').verdict === 'unknown');
}

// ─── 2026-10-03 integration: opt-out, shared domain regex, key spellings ───
{
  // A caller with no problem statement cannot see a domain restriction, and a
  // real-number `disagree` there can arm a kill of a correct turn.
  check('relationGrading:false → an inequality pair is unknown (no disagree)',
    matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, { relationGrading: false }).verdict === 'unknown');
  check('relationGrading:false → an equivalent pair is unknown too (path is off, not half-on)',
    matchUtteranceToAnswer('2x < 10', 'x < 5', undefined, { relationGrading: false }).verdict === 'unknown');
  check('relationGrading:false leaves the numeric path alone',
    matchUtteranceToAnswer('5', '6', undefined, { relationGrading: false }).verdict === 'disagree');
  check('relationMatchOpts(statement) passes the statement through',
    JSON.stringify(relationMatchOpts('Solve 2x < 7.')) === JSON.stringify({ problemText: 'Solve 2x < 7.' }));
  check('relationMatchOpts(undefined) opts out', relationMatchOpts(undefined).relationGrading === false);
  check('relationMatchOpts("") opts out', relationMatchOpts('').relationGrading === false);
  check('relationMatchOpts(whitespace) opts out', relationMatchOpts('   ').relationGrading === false);
  check('via relationMatchOpts: no statement → unknown',
    matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, relationMatchOpts(undefined)).verdict === 'unknown');
  check('via relationMatchOpts: unrestricted statement → disagree',
    matchUtteranceToAnswer('x \\le 3', 'x < 3.5', undefined, relationMatchOpts('Solve 2x < 7.')).verdict === 'disagree');
  check('via relationMatchOpts: integer-restricted statement → unknown',
    matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, relationMatchOpts('x is a positive integer. Solve 2x < 7.')).verdict === 'unknown');
  for (const stmt of ['Find all whole numbers n with 2n < 7.', 'x is non-negative. Solve 2x < 7.', 'How many values of x satisfy 2x < 7?']) {
    check(`domain veto (shared DOMAIN_VETO_RE): "${stmt}" → unknown`,
      matchUtteranceToAnswer('x < 3.5', 'x \\le 3', undefined, { problemText: stmt }).verdict === 'unknown');
  }
  // 2026-10-04: an integer clause no veto word can catch. Key x < 5, the
  // student's x ≤ 4 is the SAME answer over the integers — never a disagree.
  for (const stmt of [
    'Solve 2x + 3 < 13 for x, where x is a counting number',
    'Solve the inequality $2x + 3 < 13$, where x is the number of students.',
  ]) {
    check(`integer clause on a solve statement: "${stmt}" → unknown`,
      matchUtteranceToAnswer('x \\le 4', 'x < 5', undefined, { problemText: stmt }).verdict === 'unknown');
  }
  check('integer clause: "Sam solves … for the number of tickets x he can buy." → unknown',
    matchUtteranceToAnswer('x \\le 3', 'x < 17/5', undefined, { problemText: 'Sam solves the inequality $5x < 17$ for the number of tickets x he can buy.' }).verdict === 'unknown');
  check('integer clause: "… for the number of people n." → unknown',
    matchUtteranceToAnswer('n \\ge 4', 'n > 3', undefined, { problemText: 'Solve the inequality $n + 2 > 5$ for the number of people n.' }).verdict === 'unknown');
  check('same pair on the pure statement still disagrees',
    matchUtteranceToAnswer('x \\le 4', 'x < 5', undefined, { problemText: 'Solve the inequality: $2x + 3 < 13$' }).verdict === 'disagree');
  check('pure "Find all x such that …" disagrees',
    matchUtteranceToAnswer('x \\le 4', 'x < 5', undefined, { problemText: 'Find all x such that $2x + 3 < 13$.' }).verdict === 'disagree');
  check('gradeRelationAnswer honours the same veto',
    gradeRelationAnswer('x < 3.5', 'x \\le 3', { problemText: 'x is an integer.' }).verdict === 'unknown');

  // Answer-key spellings pinned by answer-dispute-tiebreak.ts: LaTeX
  // comparators from the solver, ASCII comparators from the brain.
  const latexKey = '-4 \\le x < 2';
  check('LaTeX key: ASCII submission agrees', matchUtteranceToAnswer('-4 <= x < 2', latexKey).verdict === 'agree');
  check('LaTeX key: unicode submission agrees', matchUtteranceToAnswer('−4 ≤ x < 2', latexKey).verdict === 'agree');
  check('LaTeX key: reversed submission agrees', matchUtteranceToAnswer('2 > x >= -4', latexKey).verdict === 'agree');
  const tieSt = { problemText: 'Solve: $-4 < \\frac{3x+2}{-2} \\le 5$' }; // ⇔ -4 ≤ x < 2
  check('LaTeX key: wrong bound disagrees', matchUtteranceToAnswer('-4 < x < 2', latexKey, undefined, tieSt).verdict === 'disagree');
  const asciiKey = '-4 <= x < 20/3';
  check('ASCII key: LaTeX submission agrees', matchUtteranceToAnswer('-4 \\le x < \\frac{20}{3}', asciiKey).verdict === 'agree');
  check('ASCII key: ASCII submission agrees', matchUtteranceToAnswer('-4 <= x < 20/3', asciiKey).verdict === 'agree');
  check('ASCII key: wrong bound disagrees',
    matchUtteranceToAnswer('-4 <= x < 2', asciiKey, undefined, { problemText: 'Solve: $-12 \\le 3x < 20$' }).verdict === 'disagree');
  check('ASCII key vs LaTeX key of the same set agree with each other',
    matchUtteranceToAnswer('-4 \\le x < 2', '-4 <= x < 2').verdict === 'agree');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
