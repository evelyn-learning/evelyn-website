/**
 * Phase 10 ship-gate test — calculus manifests + renderer DOM wiring
 * (riemann_sum, slope_field, parametric_curve, polar_graph,
 * taylor_polynomial_overlay).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase10-calculus.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildRiemannSumManifest,
  buildSlopeFieldManifest,
  buildParametricCurveManifest,
  buildPolarGraphManifest,
  buildTaylorPolynomialOverlayManifest,
  riemannSumFeatureNames,
  slopeFieldFeatureNames,
  parametricCurveFeatureNames,
  polarGraphFeatureNames,
  taylorPolynomialFeatureNames,
  solveRiemannSum,
  solveSlopeField,
  solveParametricCurve,
  solvePolarGraph,
  solveTaylorPolynomialOverlay,
} from '../src/lib/tutor/diagrams/catalog/kinds/math-calculus';

type Fail = { msg: string };
const failures: Fail[] = [];
function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const READ = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
const dispatcherSource = READ('src/lib/tutor/diagrams/manifests.ts');
const riemannSource = READ('src/app/tutor/components/whiteboard/RiemannSumRenderer.tsx');
const slopeSource = READ('src/app/tutor/components/whiteboard/SlopeFieldRenderer.tsx');
const paramSource = READ('src/app/tutor/components/whiteboard/ParametricCurveRenderer.tsx');
const polarSource = READ('src/app/tutor/components/whiteboard/PolarGraphRenderer.tsx');
const taylorSource = READ('src/app/tutor/components/whiteboard/TaylorOverlayRenderer.tsx');

// ── 1. riemann_sum ──────────────────────────────────────────────────────────
{
  const figure = solveRiemannSum({
    curve: [[0, 0], [1, 1], [2, 4], [3, 9]],
    rectangles: [[0, 1, 0], [1, 1, 1], [2, 1, 4]],
    method: 'left',
    exprLabel: 'f(x) = x²',
    approxArea: 5,
    exactArea: 9,
  });
  const m = buildRiemannSumManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(riemannSumFeatureNames.diagram), 'riemann_sum has root');
  expect(names.has(riemannSumFeatureNames.curve), 'riemann_sum has curve');
  expect(names.has(riemannSumFeatureNames.rectangles), 'riemann_sum has rectangles collective');
  expect(names.has(riemannSumFeatureNames.rectangle(0)), 'riemann_sum has rectangle-0');
  expect(names.has(riemannSumFeatureNames.exprLabel), 'riemann_sum has expr-label');
  expect(names.has(riemannSumFeatureNames.approxArea), 'riemann_sum has approx-area');
  expect(names.has(riemannSumFeatureNames.exactArea), 'riemann_sum has exact-area');
  // Verbose description-format label (brain emits this verbatim).
  const rect2 = m.find((f) => f.name === riemannSumFeatureNames.rectangle(1));
  expect(
    !!rect2?.labels?.some((l) => l.startsWith('rectangle 2 at x =')),
    'riemann rectangle carries the verbose `rectangle N at x = ... (width ..., height ...)` description-format label',
  );
  expect(riemannSource.includes('riemannSumFeatureNames'), 'riemann renderer imports helper');
  expect(riemannSource.includes('data-feature={N.curve}'), 'riemann renderer marks curve');
  expect(riemannSource.includes('data-feature={N.rectangles}'), 'riemann renderer marks rectangles group');
  expect(riemannSource.includes('N.rectangle(i)'), 'riemann renderer marks per-rectangle');
  expect(riemannSource.includes('smoothPath'), 'riemann renderer uses smoothPath for curve');
}

// ── 2. slope_field ──────────────────────────────────────────────────────────
{
  const figure = solveSlopeField({
    samples: [[0, 0, 1], [1, 0, 1], [0, 1, -1]],
    solutionCurve: [[-1, 0.5], [0, 0], [1, 0.5]],
    highlightPoint: { x: 0, y: 0 },
    exprLabel: 'dy/dx = x',
  });
  const m = buildSlopeFieldManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(slopeFieldFeatureNames.diagram), 'slope_field has root');
  expect(names.has(slopeFieldFeatureNames.field), 'slope_field has segments');
  expect(names.has(slopeFieldFeatureNames.solutionCurve), 'slope_field has solution curve');
  expect(names.has(slopeFieldFeatureNames.highlightPoint), 'slope_field has highlight point');
  expect(names.has(slopeFieldFeatureNames.exprLabel), 'slope_field has expr-label');
  expect(slopeSource.includes('slopeFieldFeatureNames'), 'slope renderer imports helper');
  expect(slopeSource.includes('data-feature={N.field}'), 'slope renderer marks field group');
  expect(slopeSource.includes('data-feature={N.solutionCurve}'), 'slope renderer marks solution curve');
  expect(slopeSource.includes('smoothPath'), 'slope renderer uses smoothPath for solution curve');
  const sol = m.find((f) => f.name === slopeFieldFeatureNames.solutionCurve);
  expect(
    !!sol?.labels?.includes('integral curve (particular solution)'),
    'solution curve carries verbose `integral curve (particular solution)` label',
  );
}

// ── 3. parametric_curve ─────────────────────────────────────────────────────
{
  const figure = solveParametricCurve({
    curve: [[1, 0], [0.707, 0.707], [0, 1], [-0.707, 0.707], [-1, 0]],
    highlightT: { t: 1.0, x: 0.54, y: 0.84, label: 'P' },
    tangentAtT: { x: 0.54, y: 0.84, dx: -0.84, dy: 0.54 },
    exprLabel: 'x = cos t, y = sin t',
  });
  const m = buildParametricCurveManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(parametricCurveFeatureNames.diagram), 'parametric_curve has root');
  expect(names.has(parametricCurveFeatureNames.curve), 'parametric_curve has curve');
  expect(names.has(parametricCurveFeatureNames.highlightT), 'parametric_curve has highlight point');
  expect(names.has(parametricCurveFeatureNames.tangent), 'parametric_curve has tangent vector');
  const hl = m.find((f) => f.name === parametricCurveFeatureNames.highlightT);
  expect(!!hl?.labels?.includes('P'), 'highlight point carries its label "P"');
  expect(paramSource.includes('parametricCurveFeatureNames'), 'param renderer imports helper');
  expect(paramSource.includes('data-feature={N.curve}'), 'param renderer marks curve');
  expect(paramSource.includes('data-feature={N.tangent}'), 'param renderer marks tangent vector');
  expect(paramSource.includes('smoothPath'), 'param renderer uses smoothPath for the curve trace');
}

// ── 4. polar_graph ──────────────────────────────────────────────────────────
{
  const figure = solvePolarGraph({
    curve: [[0, 2], [Math.PI / 2, 2], [Math.PI, 2], [3 * Math.PI / 2, 2], [2 * Math.PI, 2]],
    shadeRegion: [[0, 2], [Math.PI / 4, 2], [Math.PI / 2, 2]],
    highlightPoint: { theta: Math.PI / 4, r: 2, label: 'P' },
    exprLabel: 'r = 2',
  });
  const m = buildPolarGraphManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(polarGraphFeatureNames.diagram), 'polar_graph has root');
  expect(names.has(polarGraphFeatureNames.curve), 'polar_graph has curve');
  expect(names.has(polarGraphFeatureNames.shadeRegion), 'polar_graph has shaded region');
  expect(names.has(polarGraphFeatureNames.highlightPoint), 'polar_graph has highlight point');
  expect(polarSource.includes('polarGraphFeatureNames'), 'polar renderer imports helper');
  expect(polarSource.includes('data-feature={N.shadeRegion}'), 'polar renderer marks shaded region');
  expect(polarSource.includes('smoothPath'), 'polar renderer uses smoothPath');
}

// ── 5. taylor_polynomial_overlay ────────────────────────────────────────────
{
  const figure = solveTaylorPolynomialOverlay({
    baseCurve: [[-3, -0.14], [-2, -0.91], [-1, -0.84], [0, 0], [1, 0.84], [2, 0.91], [3, 0.14]],
    approximations: [
      { degree: 1, curve: [[-3, -3], [3, 3]] },
      { degree: 3, curve: [[-3, -3], [-1, -1], [0, 0], [1, 1], [3, 3]] },
    ],
    center: 0,
    exprLabel: 'f(x) = sin x',
  });
  const m = buildTaylorPolynomialOverlayManifest(figure);
  const names = new Set(m.map((f) => f.name));
  expect(names.has(taylorPolynomialFeatureNames.diagram), 'taylor has root');
  expect(names.has(taylorPolynomialFeatureNames.baseCurve), 'taylor has base curve');
  expect(names.has(taylorPolynomialFeatureNames.approximation(1)), 'taylor has T_1');
  expect(names.has(taylorPolynomialFeatureNames.approximation(3)), 'taylor has T_3');
  const t3 = m.find((f) => f.name === taylorPolynomialFeatureNames.approximation(3));
  expect(!!t3?.labels?.includes('T3'), 'T_3 carries short label "T3"');
  expect(!!t3?.labels?.includes('T3(x)'), 'T_3 carries label "T3(x)"');
  expect(!!t3?.labels?.includes('degree 3'), 'T_3 carries "degree 3" label');
  expect(taylorSource.includes('taylorPolynomialFeatureNames'), 'taylor renderer imports helper');
  expect(taylorSource.includes('data-feature={N.baseCurve}'), 'taylor renderer marks base curve');
  expect(taylorSource.includes('N.approximation(a.degree)'), 'taylor renderer marks each approximation');
  expect(taylorSource.includes('smoothPath'), 'taylor renderer uses smoothPath');
}

// ── 6. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of [
  'riemann_sum',
  'slope_field',
  'parametric_curve',
  'polar_graph',
  'taylor_polynomial_overlay',
]) {
  expect(dispatcherSource.includes(`case '${kind}'`), `manifests.ts dispatcher has case for '${kind}'`);
}

if (failures.length === 0) {
  console.log('✓ Phase 10 calculus: 5 kinds × manifest + renderer wiring + dispatcher, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
