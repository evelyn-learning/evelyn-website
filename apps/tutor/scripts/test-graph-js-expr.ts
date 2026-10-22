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
import { jsExprToLatex, getLatex } from '../src/app/tutor/components/whiteboard/DesmosGraphRenderer';
import { latexToJs } from '../src/lib/tutor/whiteboard/intersection-validator';
import { functionSourceOf } from '../src/lib/tutor/whiteboard/graph-function-source';

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

// 2026-10-22 (hw-14 p8, F8): a stored homework graph carried `expression`; the
// renderers read only expr | latex | fn and drew y = x.
check('getLatex({ expression }) → its latex, not the variable', getLatex({ expression: 'x^2' } as never) === 'x^{2}' || getLatex({ expression: 'x^2' } as never) === 'x^2', getLatex({ expression: 'x^2' } as never));
check('getLatex({ expression }) keeps pi a symbol (hw-14 p8)', getLatex({ expression: '2.5*cos(3*x*pi/180)+0.5' } as never) === getLatex({ expr: '2.5*cos(3*x*pi/180)+0.5' } as never) && getLatex({ expression: '2.5*cos(3*x*pi/180)+0.5' } as never).includes('\\pi'), getLatex({ expression: '2.5*cos(3*x*pi/180)+0.5' } as never));
check('getLatex: expr still wins over expression', getLatex({ expr: 'x+1', expression: 'x^2' } as never) === 'x+1', getLatex({ expr: 'x+1', expression: 'x^2' } as never));
check('functionSourceOf reads expression last', functionSourceOf({ expression: '2.5*cos(3*x*pi/180)+0.5' }) === '2.5*cos(3*x*pi/180)+0.5');
check('functionSourceOf order expr > latex > fn > expression', functionSourceOf({ fn: 'c', latex: 'b', expression: 'd' }) === 'b' && functionSourceOf({ fn: 'c', expression: 'd' }) === 'c' && functionSourceOf({}) === '');

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
