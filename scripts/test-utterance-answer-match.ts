/**
 * Unit test for the tri-state utterance-vs-answer comparator.
 * Usage: npx tsx scripts/test-utterance-answer-match.ts
 */
import { matchUtteranceToAnswer, canonicalizeMathExpression } from '../src/lib/tutor/voice/utterance-answer-match';

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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
