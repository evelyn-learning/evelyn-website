/**
 * R32b (session-1784829643398): the brain emitted a JAVASCRIPT expression
 * ("(-3) + (10/(1 + 2*Math.exp(-1.5*(x-3))))") in show_function_graph's
 * `expr` — Desmos can't parse Math.exp, so the curve silently vanished
 * while the legend entry and points still rendered. getLatex now routes
 * JS-shaped expressions through jsExprToLatex (which learned Math.exp with
 * one level of paren nesting), and latexToJs lets Math.exp/floor/ceil/…
 * through so the numeric graph validators can still evaluate such curves.
 *
 * Usage: npx tsx scripts/test-graph-js-expr.ts  (npm run test:graph-js-expr)
 */
import { jsExprToLatex, getLatex } from '../apps/marketing/src/app/tutor/components/whiteboard/DesmosGraphRenderer';
import { latexToJs } from '../apps/marketing/src/lib/tutor/whiteboard/intersection-validator';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const SESSION_EXPR = '(-3) + (10/(1 + 2*Math.exp(-1.5*(x-3))))';

// jsExprToLatex: Math.exp with nested parens
const latex = jsExprToLatex(SESSION_EXPR);
check('Math.exp(nested parens) → e^{…} (full argument kept)',
  latex.includes('e^{-1.5(x-3)}') || latex.includes('e^{-1.5*(x-3)}'), latex);
check('no Math. residue in latex', !/Math\./.test(latex), latex);

check('Math.exp(simple) → e^{…}', jsExprToLatex('Math.exp(2x)').includes('e^{2x}'), jsExprToLatex('Math.exp(2x)'));
check('Math.sqrt still converts', jsExprToLatex('Math.sqrt(x+1)').includes('\\sqrt{x+1}'));

// getLatex: JS-shaped expr/latex fields route through the converter
check('getLatex(expr with Math.) converts', !/Math\./.test(getLatex({ expr: SESSION_EXPR, label: 'f' } as never)));
check('getLatex(expr with **) converts', getLatex({ expr: 'x**2 + 1', label: 'f' } as never).includes('x^2'));
check('getLatex(plain latex) untouched path', getLatex({ expr: 'e^{2x} - 1', label: 'f' } as never).includes('e^{2x}'));

// latexToJs: JS expression is evaluable → numeric validators see the curve
const js = latexToJs(SESSION_EXPR, 'x');
check('latexToJs accepts the JS expression', js !== null, String(js));
if (js) {
  // eslint-disable-next-line no-new-func
  const f = new Function('x', `"use strict"; return (${js});`) as (x: number) => number;
  check('f(1) ≈ -2.76 (curve near its labeled f(1) = -3)', Math.abs(f(1) - -2.759) < 0.05, String(f(1)));
  check('f(5) ≈ 6.09', Math.abs(f(5) - 6.089) < 0.05, String(f(5)));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
