/**
 * Unit test for the conic-construction PRIMITIVES added to the geometry solver
 * (src/lib/tutor/diagrams/geometry-solver.ts): latus_rectum, chord_of_contact,
 * and conic-extended tangents_from_external. See
 * project_tutor_figure_identity_design.md (Img11/Img12 fix).
 *
 * Run: npm run test:conic-primitives
 * No framework — matches test:page-grouping / test:conic. Pure solver, no brain.
 */

import { strict as assert } from 'node:assert';
import { solveGeometry, type ConstructedGeometrySpec, type SolverOutput } from '../src/lib/tutor/diagrams/geometry-solver';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const findPt = (out: SolverOutput, id: string) => {
  const p = out.points.find((q) => q.id === id);
  if (!p) throw new Error(`point "${id}" not in solver output (have: ${out.points.map((q) => q.id).join(', ')})`);
  return p;
};
const approx = (a: number, b: number, tol = 0.01) => {
  if (Math.abs(a - b) > tol) throw new Error(`expected ≈${b}, got ${a}`);
};
/** Assert a point with these coords exists (order-independent). */
const hasPointNear = (out: SolverOutput, x: number, y: number, tol = 0.01) => {
  const hit = out.points.some((p) => Math.abs(p.x - x) <= tol && Math.abs(p.y - y) <= tol);
  if (!hit) throw new Error(`no point near (${x}, ${y}); points: ${out.points.map((p) => `(${p.x},${p.y})`).join(' ')}`);
};
/** Segment between two point ids (GeometrySegment has from/to, no id). */
const hasSeg = (out: SolverOutput, a: string, b: string) =>
  out.segments.some((s) => (s.from === a && s.to === b) || (s.from === b && s.to === a));
const segsTouching = (out: SolverOutput, id: string) =>
  out.segments.filter((s) => s.from === id || s.to === id).length;

function main() {
  console.log('Conic primitives — latus_rectum / chord_of_contact / tangents_from_external\n');

  // ── latus_rectum ──────────────────────────────────────────────────────────
  test('latus_rectum parabola y²=4x → endpoints (1, ±2)', () => {
    const spec: ConstructedGeometrySpec = {
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'lr', kind: 'latus_rectum', conic: 'p' },
      ],
    };
    const out = solveGeometry(spec);
    const a = findPt(out, 'lr_a'), b = findPt(out, 'lr_b');
    approx(a.x, 1); approx(Math.abs(a.y), 2);
    approx(b.x, 1); approx(Math.abs(b.y), 2);
    assert.ok(a.y !== b.y, 'endpoints should be distinct ±2a');
    assert.ok(out.segments.some((s) => s.from === 'lr_a' && s.to === 'lr_b'), 'chord segment present');
  });

  test('latus_rectum ellipse a=3,b=2 → both foci, semi=b²/a=4/3 at x=±√5', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'lr', kind: 'latus_rectum', conic: 'e', which: 'both' },
      ],
    });
    // f=√5≈2.236, semi=4/3≈1.333
    hasPointNear(out, 2.236, 1.333);
    hasPointNear(out, 2.236, -1.333);
    hasPointNear(out, -2.236, 1.333);
    hasPointNear(out, -2.236, -1.333);
  });

  test('latus_rectum hyperbola a=2,b=3 → foci ±√13, semi=b²/a=4.5', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'h', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'lr', kind: 'latus_rectum', conic: 'h', which: 'both' },
      ],
    });
    hasPointNear(out, 3.606, 4.5);
    hasPointNear(out, -3.606, -4.5);
  });

  // ── chord_of_contact ──────────────────────────────────────────────────────
  test('chord_of_contact parabola y²=4x from (−3,0) → touch (3, ±2√3), chord x=3, 3 segments', () => {
    // The headline Img12 case. Polar of (−3,0) wrt y²=4x is x=3.
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: -3, y: 0 },
      ],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'coc', kind: 'chord_of_contact', conic: 'p', external: 'P' },
      ],
    });
    const t1 = findPt(out, 'coc_T1'), t2 = findPt(out, 'coc_T2');
    approx(t1.x, 3); approx(t2.x, 3);                         // both touch points at x=3
    approx(Math.abs(t1.y), 3.464); approx(Math.abs(t2.y), 3.464); // ±2√3
    // chord + 2 tangent lines all present
    assert.ok(hasSeg(out, 'coc_T1', 'coc_T2'), 'chord segment (T1-T2)');
    assert.ok(hasSeg(out, 'P', 'coc_T1'), 'tangent line P-T1');
    assert.ok(hasSeg(out, 'P', 'coc_T2'), 'tangent line P-T2');
  });

  test('chord_of_contact ellipse a=3,b=2 from (6,0) → polar x=1.5, touch (1.5, ±√3)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: 6, y: 0 },
      ],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'coc', kind: 'chord_of_contact', conic: 'e', external: 'P' },
      ],
    });
    const t1 = findPt(out, 'coc_T1'), t2 = findPt(out, 'coc_T2');
    approx(t1.x, 1.5); approx(t2.x, 1.5);
    approx(Math.abs(t1.y), 1.732); approx(Math.abs(t2.y), 1.732);
  });

  test('chord_of_contact tangents:false → chord only, no tangent lines', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: -3, y: 0 },
      ],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'coc', kind: 'chord_of_contact', conic: 'p', external: 'P', tangents: false },
      ],
    });
    assert.ok(hasSeg(out, 'coc_T1', 'coc_T2'), 'chord present');
    assert.ok(segsTouching(out, 'P') === 0, 'no tangent lines from external point');
  });

  // ── conic-extended tangents_from_external ─────────────────────────────────
  test('tangents_from_external on a parabola → 2 tangent segments + 2 touch points', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: -3, y: 0 },
      ],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'tg', kind: 'tangents_from_external', on: 'p', external: 'P' },
      ],
    });
    hasPointNear(out, 3, 3.464);
    hasPointNear(out, 3, -3.464);
    assert.ok(segsTouching(out, 'P') === 2, 'two tangent segments from external point');
  });

  // ── circle (kind:'circle', not a conic) ──────────────────────────────────
  test('chord_of_contact on a CIRCLE x²+y²=9 from (4,0) → polar x=9/4, touch (2.25, ±1.984)', () => {
    // Img15: the brain correctly emitted chord_of_contact on the circle, but the
    // solver rejected it (circle isn't a conic). Now supported.
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: 4, y: 0 },
      ],
      steps: [
        { id: 'circ', kind: 'circle', center: 'O', radius: 3 },
        { id: 'coc', kind: 'chord_of_contact', conic: 'circ', external: 'P' },
      ],
    });
    const t1 = findPt(out, 'coc_T1'), t2 = findPt(out, 'coc_T2');
    approx(t1.x, 2.25); approx(t2.x, 2.25);
    approx(Math.abs(t1.y), 1.984); approx(Math.abs(t2.y), 1.984);
    assert.ok(hasSeg(out, 'coc_T1', 'coc_T2'), 'chord present');
    assert.ok(hasSeg(out, 'P', 'coc_T1') && hasSeg(out, 'P', 'coc_T2'), 'both tangent lines present');
  });

  test('tangents_from_external on a CIRCLE still works (refactor regression)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: 4, y: 0 },
      ],
      steps: [
        { id: 'circ', kind: 'circle', center: 'O', radius: 3 },
        { id: 'tg', kind: 'tangents_from_external', on: 'circ', external: 'P' },
      ],
    });
    hasPointNear(out, 2.25, 1.984);
    hasPointNear(out, 2.25, -1.984);
    assert.ok(segsTouching(out, 'P') === 2, 'two tangent segments');
  });

  // ── degenerate / fail-safe ────────────────────────────────────────────────
  test('chord_of_contact REJECTS a point ON the conic (the vertex:"ext" self-correction)', () => {
    // (1,2) lies on y²=4x (4=4). The brain's vertex:"ext" bug puts the external
    // point on the curve → no real tangents → reject-with-hint, not garbage.
    assert.throws(() => solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: 1, y: 2 },
      ],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'coc', kind: 'chord_of_contact', conic: 'p', external: 'P' },
      ],
    }), /not outside the curve/);
  });

  test('chord_of_contact REJECTS a point inside an ellipse', () => {
    assert.throws(() => solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: 0.5, y: 0.5 },
      ],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'coc', kind: 'chord_of_contact', conic: 'e', external: 'P' },
      ],
    }), /not outside the curve/);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
