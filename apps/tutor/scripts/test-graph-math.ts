/**
 * Regression test for the function-graph math-expression normalizer.
 * Bug: show_function_graph's LaTeX Gaussian rendered as a flat line.
 *   npm run test:graph-math
 */
import assert from 'node:assert';
import { parseFunctionString } from '../src/lib/tutor/whiteboard/math-expr';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}
const approx = (a: number, b: number, t = 1e-3) => Math.abs(a - b) <= t;

console.log('graph math-expr: LaTeX (the bug)');
check('standard normal density — symmetric bell, not a line', () => {
  const f = parseFunctionString('\\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}');
  assert.ok(approx(f(0), 0.39894), `f(0)=${f(0)}`);
  assert.ok(approx(f(1), 0.24197), `f(1)=${f(1)}`);
  assert.ok(approx(f(1), f(-1)), 'symmetric');
  assert.ok(f(0) > f(1) && f(1) > f(3), 'peaks at 0 and decays (not a line)');
});
check('e^{-x} negative exponent', () => {
  const f = parseFunctionString('e^{-x}');
  assert.ok(approx(f(0), 1));
  assert.ok(approx(f(1), 0.36788));
});
check('\\frac and \\sqrt', () => {
  const f = parseFunctionString('\\frac{x}{\\sqrt{4}}');
  assert.ok(approx(f(8), 4));
});

console.log('graph math-expr: plain expressions unchanged (no regression)');
check('quadratic x^2 - 2*x + 1', () => {
  const f = parseFunctionString('x^2 - 2*x + 1');
  assert.equal(f(0), 1); assert.equal(f(1), 0); assert.equal(f(3), 4);
});
check('line 2*x + 5', () => {
  const f = parseFunctionString('2*x + 5');
  assert.equal(f(0), 5); assert.equal(f(2), 9);
});
check('sin(x)', () => {
  const f = parseFunctionString('sin(x)');
  assert.ok(approx(f(0), 0)); assert.ok(approx(f(Math.PI / 2), 1));
});
check('implicit multiplication 2x', () => {
  assert.equal(parseFunctionString('2x')(3), 6);
});

console.log(`\ngraph math-expr: ${passed} checks passed`);
