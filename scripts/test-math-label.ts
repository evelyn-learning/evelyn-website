/**
 * prettyMathLabel tests (round-6f — graph legend "y = 0.5(x-2)^2 - 4"
 * rendered raw, portal-8fded37f).
 *
 * Run: npm run test:math-label
 */
import { prettyMathLabel } from '../apps/marketing/src/lib/tutor/whiteboard/math-label';

let pass = 0;
let fail = 0;
function check(input: string, expected: string) {
  const got = prettyMathLabel(input);
  const ok = got === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${JSON.stringify(input)} -> ${JSON.stringify(got)}${ok ? '' : `  (want ${JSON.stringify(expected)})`}`);
  if (ok) pass++; else fail++;
}

// The live incident string.
check('y = 0.5(x-2)^2 - 4', 'y = 0.5(x-2)² - 4');
// Mixed prose + math stays prose.
check('f(x) = x + 2, hole at x=2', 'f(x) = x + 2, hole at x=2');
// Braced and bare scripts, subscripts, index forms.
check('y = x^2 - 4x + 3', 'y = x² - 4x + 3');
check('x^{10}', 'x¹⁰');
check('a_n and a_{n}', 'aₙ and aₙ');
check('r_1 and r_2', 'r₁ and r₂');
check('2^{-3}', '2⁻³');
// Non-convertible script bodies are left alone (no half conversions).
check('e^x', 'e^x');
check('x^{ab}', 'x^{ab}');
// $-spans are KaTeX's business — untouched.
check('$x^2$ and x^2', '$x^2$ and x²');
// Empty / plain.
check('', '');
check('vertex', 'vertex');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
