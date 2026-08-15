/**
 * Tests for show_equation authoring guards (text-heuristics).
 *
 * duplicateFunctionDef: round-21 guard extracted + hardened — the inline VTR
 * version failed open on `\\`-separated multi-line cards (second definition
 * swallowed into the first body capture) and on `\left(x\right)` delimiters.
 *
 * Usage: npx tsx scripts/test-equation-guards.ts  (npm run test:equation-guards)
 */
import { duplicateFunctionDef, latexProseFiller } from '../src/lib/tutor/orchestrator/text-heuristics';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// --- The round-21 case (comma-separated) ---
check('round-21: "g(x)=2x^2-3, g(x)=x+4" → dup g',
  duplicateFunctionDef('g(x)=2x^2-3, g(x)=x+4') === 'g');

// --- The failed-open classes ---
check('multi-line: "g(x)=2x^2-3 \\\\ g(x)=x+4" → dup g (was MISSED)',
  duplicateFunctionDef('g(x)=2x^2-3 \\\\ g(x)=x+4') === 'g');
check('left/right delims: "f\\left(x\\right)=2x, f\\left(x\\right)=x+1" → dup f (was MISSED)',
  duplicateFunctionDef('f\\left(x\\right)=2x, f\\left(x\\right)=x+1') === 'f');
check('quad separator: "h(x)=x^2 \\quad h(x)=3x" → dup h',
  duplicateFunctionDef('h(x)=x^2 \\quad h(x)=3x') === 'h');

// --- Must NOT flag ---
check('distinct names pass: "f(x)=2x, g(x)=x+4"',
  duplicateFunctionDef('f(x)=2x, g(x)=x+4') === null);
check('identical repeat passes: "f(x)=2x, f(x)=2x"',
  duplicateFunctionDef('f(x)=2x, f(x)=2x') === null);
check('identical repeat modulo spacing passes: "f(x)=2 x \\\\ f(x)=2x"',
  duplicateFunctionDef('f(x)=2 x \\\\ f(x)=2x') === null);
check('\\sin(x) is not a function named n: "\\sin(x)=1, n(x)=2"',
  duplicateFunctionDef('\\sin(x)=1, n(x)=2') === null);
check('prime is a different function: "f(x)=x^2, f\'(x)=2x"',
  duplicateFunctionDef("f(x)=x^2, f'(x)=2x") === null);
check('subscripted names distinct: "f_1(x)=x, f_2(x)=2x"',
  duplicateFunctionDef('f_1(x)=x, f_2(x)=2x') === null);
check('subscripted dup flagged: "f_1(x)=x \\\\ f_1(x)=3x"',
  duplicateFunctionDef('f_1(x)=x \\\\ f_1(x)=3x') === 'f_1');
check('empty / no defs pass', duplicateFunctionDef('') === null && duplicateFunctionDef('x^2+2x') === null);
check('piecewise-ish single def passes: "f(x)=\\begin{cases}x&x>0\\\\-x&x\\le0\\end{cases}"',
  duplicateFunctionDef('f(x)=\\begin{cases}x&x>0\\\\-x&x\\le0\\end{cases}') === null);

// --- latexProseFiller regression (existing behavior unchanged) ---
check('filler: "e^x \\sin x\' \\cdot wait" → wait', latexProseFiller("e^x \\sin x' \\cdot wait") === 'wait');
check('filler: \\text{waiting time} passes', latexProseFiller('\\text{waiting time}') === null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
