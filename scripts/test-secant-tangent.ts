/**
 * Tests for the secant/tangent (MVT-class) graph consistency validator +
 * the tangent-clobber guard in validateGraphLinearConsistency.
 *
 * Repro source: AP Calc BC session 2026-07-23 (U5.1 MVT) — the brain placed
 * point c ON the secant (not the curve), the secant endpoints off the curve,
 * and the "tangent at c" line then got refit onto the secant by the linear-
 * consistency guard → legend showed a tangent but none was visible.
 *
 * Usage: npx tsx scripts/test-secant-tangent.ts
 */
import {
  parseLinear,
  validateGraphLinearConsistency,
} from '../apps/marketing/src/lib/tutor/whiteboard/graph-consistency-validator';
import { validateSecantTangentGraph } from '../apps/marketing/src/lib/tutor/whiteboard/secant-tangent-validator';
import { latexToJs } from '../apps/marketing/src/lib/tutor/whiteboard/intersection-validator';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

function evalExpr(expr: string, x: number): number {
  const js = latexToJs(expr, 'x');
  if (!js) return NaN;
  // eslint-disable-next-line no-new-func
  return new Function('x', `"use strict"; return (${js});`)(x) as number;
}

// ─── 1. Clobber guard: linear-consistency must never refit a tangent ───

console.log('\nclobber guard (graph-consistency-validator)');

check('parseLinear rejects point-slope "7.29 - 0.05(x - 2.7)" (was garbage-parsed m=1)',
  parseLinear('7.29 - 0.05(x - 2.7)') === null);
check('parseLinear still parses "2x + 3"',
  JSON.stringify(parseLinear('2x + 3')) === JSON.stringify({ m: 2, b: 3 }));

// Session item #4: a,c,b collinear on the secant (c misplaced by the brain).
// The correct tangent misses those points BY DESIGN — must not be refit.
const item4 = {
  title: 'Tangent at c parallel to secant AB',
  xRange: [-1, 6] as [number, number],
  yRange: [5, 6.5] as [number, number],
  functions: [
    { latex: '6 + 0.22x(5 - x)', label: 'f(x)', color: '#2563eb' },
    { latex: '6 - 0.05x', label: 'secant AB', color: '#f59e0b' },
    { latex: '7.29 - 0.05x', label: 'tangent at c', color: '#16a34a' },
  ],
  points: [
    { x: 0, y: 6, label: 'a' },
    { x: 2.7, y: 5.86, label: 'c' },
    { x: 5, y: 5.75, label: 'b' },
  ],
};
const afterLinear = validateGraphLinearConsistency(item4);
const tanAfter = afterLinear.functions!.find(f => /tangent/i.test(f.label || ''));
check('tangent-labeled line NOT refit onto the secant',
  tanAfter?.latex === '7.29 - 0.05x', tanAfter?.latex);

// ─── 2. MVT repair: session item #4 (tangent present but everything misplaced) ───

console.log('\nvalidateSecantTangentGraph — item #4 shape (tangent present)');

const out4 = validateSecantTangentGraph(item4);
check('fired (new object)', out4 !== item4);

const f4 = (x: number) => 6 + 0.22 * x * (5 - x);
const pa = out4.points!.find(p => p.label === 'a')!;
const pb = out4.points!.find(p => p.label === 'b')!;
const pc = out4.points!.find(p => p.label === 'c')!;
check('a snapped onto curve', Math.abs(pa.y - f4(pa.x)) < 0.05, `a=(${pa.x},${pa.y})`);
check('b snapped onto curve', Math.abs(pb.y - f4(pb.x)) < 0.05, `b=(${pb.x},${pb.y})`);
check('c snapped onto curve', Math.abs(pc.y - f4(pc.x)) < 0.05, `c=(${pc.x},${pc.y})`);

// secant through the snapped endpoints: f(0)=6, f(5)=6 → y=6 (slope 0)
const sec4 = out4.functions!.find(f => /secant/i.test(f.label || ''))!;
check('secant passes through a', Math.abs(evalExpr(sec4.latex!, pa.x) - f4(pa.x)) < 0.05, sec4.latex);
check('secant passes through b', Math.abs(evalExpr(sec4.latex!, pb.x) - f4(pb.x)) < 0.05, sec4.latex);

// MVT: c* where f'(c)=secant slope 0 → vertex x=2.5
check('c moved to true MVT point (x≈2.5)', Math.abs(pc.x - 2.5) < 0.05, `c.x=${pc.x}`);

const tan4 = out4.functions!.find(f => /tangent/i.test(f.label || ''))!;
const secSlope4 = (f4(pb.x) - f4(pa.x)) / (pb.x - pa.x);
const tSlope4 = (evalExpr(tan4.latex!, pc.x + 0.5) - evalExpr(tan4.latex!, pc.x - 0.5)) / 1;
check('tangent slope == secant slope', Math.abs(tSlope4 - secSlope4) < 0.01, tan4.latex);
check('tangent touches curve at c', Math.abs(evalExpr(tan4.latex!, pc.x) - f4(pc.x)) < 0.05, tan4.latex);
check('tangent visually distinct from secant (differs at a)',
  Math.abs(evalExpr(tan4.latex!, pa.x) - evalExpr(sec4.latex!, pa.x)) > 0.1
  || Math.abs(tSlope4 - secSlope4) > 0.01
  || Math.abs(f4(pc.x) - evalExpr(sec4.latex!, pc.x)) < 0.05);
check('tangent domain trimmed to a segment', Array.isArray(tan4.domain), JSON.stringify(tan4.domain));

// yRange must contain the curve (max ~7.38 > requested top 6.5)
check('yRange expanded to contain curve', out4.yRange![1] >= 7.3, JSON.stringify(out4.yRange));

// ─── 3. Session item #2: secant + narrated tangent, but NO tangent function ───

console.log('\nvalidateSecantTangentGraph — item #2 shape (tangent backfill)');

const item2 = {
  title: 'MVT: secant slope = tangent slope somewhere in between',
  xRange: [0, 5.5] as [number, number],
  yRange: [4, 7] as [number, number],
  functions: [
    { latex: '6 + 0.3x(x - 2)(x - 4)', label: 'f(x)', color: '#2563eb' },
    { latex: '6 - 0.05x', label: 'secant line through endpoints', color: '#92400e' },
  ],
  points: [
    { x: 0, y: 6 },
    { x: 2.7, y: 5.86 },
    { x: 5, y: 5.75 },
  ],
};
const f2 = (x: number) => 6 + 0.3 * x * (x - 2) * (x - 4);
const out2 = validateSecantTangentGraph(item2);
check('fired (new object)', out2 !== item2);

const pts2 = [...out2.points!].sort((p, q) => p.x - q.x);
const [a2, c2, b2] = pts2;
check('endpoints snapped onto curve',
  Math.abs(a2.y - f2(a2.x)) < 0.05 && Math.abs(b2.y - f2(b2.x)) < 0.06,
  JSON.stringify([a2, b2]));
check('interior point snapped onto curve', Math.abs(c2.y - f2(c2.x)) < 0.06, JSON.stringify(c2));

const sec2 = out2.functions!.find(f => /secant/i.test(f.label || ''))!;
const m2 = (f2(b2.x) - f2(a2.x)) / (b2.x - a2.x);
check('secant refit through curve endpoints',
  Math.abs(evalExpr(sec2.latex!, 0) - f2(0)) < 0.05 && Math.abs(evalExpr(sec2.latex!, 5) - f2(5)) < 0.06,
  sec2.latex);

const tan2 = out2.functions!.find(f => /tangent/i.test(f.label || ''));
check('tangent BACKFILLED (title mentions tangent, none was plotted)', !!tan2);
if (tan2) {
  const ts = (evalExpr(tan2.latex!, c2.x + 0.5) - evalExpr(tan2.latex!, c2.x - 0.5)) / 1;
  check('backfilled tangent slope == secant slope', Math.abs(ts - m2) < 0.02, tan2.latex);
  check('backfilled tangent touches curve at c', Math.abs(evalExpr(tan2.latex!, c2.x) - f2(c2.x)) < 0.06, tan2.latex);
  check('interior point sits at MVT c (f\'(c)=secant slope)',
    Math.abs((f2(c2.x + 0.001) - f2(c2.x - 0.001)) / 0.002 - m2) < 0.05, `c.x=${c2.x}`);
}

// ─── 4. No false positives ───

console.log('\nno false positives');

const plainParabola = {
  title: 'Graph of y = x^2',
  xRange: [-3, 3] as [number, number],
  yRange: [0, 9] as [number, number],
  functions: [{ latex: 'x^2', label: 'y = x^2' }],
  points: [{ x: 1, y: 1 }, { x: 2, y: 4 }],
};
check('no secant/tangent context → untouched', validateSecantTangentGraph(plainParabola) === plainParabola);

const consistent = {
  title: 'Tangent at c parallel to secant AB',
  xRange: [-1, 6] as [number, number],
  yRange: [4, 8] as [number, number],
  functions: [
    { latex: '6 + 0.22x(5 - x)', label: 'f(x)' },
    { latex: '6', label: 'secant AB' },
    { latex: '7.375', label: 'tangent at c', domain: [1.5, 3.5] as [number, number] },
  ],
  points: [
    { x: 0, y: 6, label: 'a' },
    { x: 2.5, y: 7.375, label: 'c' },
    { x: 5, y: 6, label: 'b' },
  ],
};
check('already-consistent MVT graph → untouched', validateSecantTangentGraph(consistent) === consistent);

const unparseable = {
  title: 'Tangent line demo',
  xRange: [0, 5] as [number, number],
  yRange: [0, 5] as [number, number],
  functions: [
    { latex: '\\operatorname{weird}(x)', label: 'f(x)' },
    { latex: '2x', label: 'tangent at c' },
  ],
  points: [{ x: 0, y: 0, label: 'a' }, { x: 4, y: 4, label: 'b' }],
};
check('unparseable curve → conservative bail', validateSecantTangentGraph(unparseable) === unparseable);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
