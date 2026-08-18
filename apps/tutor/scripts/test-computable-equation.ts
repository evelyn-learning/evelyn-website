/**
 * Computable-equation evaluator (2026-08-17 triage, portal-e3af265a): the
 * tutor posed `24 \div 4 \cdot 3 - 5` via show_equation and asked "what do
 * you think that equals?" — the student typed 13 (correct) and the brain
 * opened "Not quite." No guard could catch it: arithmetic-claim-check needs
 * an inline "A op B is C" claim, inverse-verdict-check needs a verified
 * expectedAnswer, and a bare show_equation produces neither. This module
 * evaluates a plain arithmetic equation latex at dispatch so the value can
 * ride the EXISTING inverse-verdict kill tier.
 */
import { evaluateComputableLatex } from '../src/lib/tutor/voice/computable-equation';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log('evaluates plain arithmetic');
check('the e3af265a expression', evaluateComputableLatex('24 \\div 4 \\cdot 3 - 5')?.value, 13);
check('addition/subtraction', evaluateComputableLatex('7 + 2 - 4')?.value, 5);
check('\\times', evaluateComputableLatex('3 \\times 4')?.value, 12);
check('parentheses', evaluateComputableLatex('(2 + 3) \\cdot 4')?.value, 20);
check('unicode operators', evaluateComputableLatex('24 ÷ 4 × 3 − 5')?.value, 13);
check('decimals', evaluateComputableLatex('1.5 \\cdot 4')?.value, 6);
check('simple \\frac', evaluateComputableLatex('\\frac{24}{4} \\cdot 3 - 5')?.value, 13);
check('left-to-right same-rank order (division before later multiplication)', evaluateComputableLatex('24 \\div 4 \\cdot 3')?.value, 18);
check('float noise collapsed in display', evaluateComputableLatex('0.1 + 0.2')?.display, '0.3');

console.log('refuses anything that is not a bare numeric expression');
check('variables', evaluateComputableLatex('2x + 3'), null);
check('an identity/step (contains =)', evaluateComputableLatex('24 \\div 4 = 6'), null);
check('inequality', evaluateComputableLatex('3 < 5'), null);
check('latex text', evaluateComputableLatex('\\text{Tax power} + \\text{Army power}'), null);
check('a lone number (nothing to compute — no verdict leverage)', evaluateComputableLatex('42'), null);
check('division by zero', evaluateComputableLatex('5 \\div 0'), null);
check('empty string', evaluateComputableLatex(''), null);
check('exponent notation left alone (renderer-only syntax)', evaluateComputableLatex('2^3'), null);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll computable-equation checks passed.');
