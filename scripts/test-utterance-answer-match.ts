/**
 * Unit test for the tri-state utterance-vs-answer comparator.
 * Usage: npx tsx scripts/test-utterance-answer-match.ts
 */
import { matchUtteranceToAnswer, canonicalizeMathExpression, normalizeSpokenMath } from '../src/lib/tutor/voice/utterance-answer-match';

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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
