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
import { solveGeometry, type ConstructedGeometrySpec, type SolverOutput } from '../apps/marketing/src/lib/tutor/diagrams/geometry-solver';

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

  // ── tangent_at (conic) — the 2026-06-19 Console5 Img2/3 fix ───────────────
  // Slope of the tangent segment, and the midpoint of from/to (which is P,
  // since the segment is centered on the point of tangency).
  const tanSlope = (out: SolverOutput, id: string) => {
    const f = findPt(out, `${id}_from`), t = findPt(out, `${id}_to`);
    return (t.y - f.y) / (t.x - f.x);
  };
  const tanMidpoint = (out: SolverOutput, id: string) => {
    const f = findPt(out, `${id}_from`), t = findPt(out, `${id}_to`);
    return { x: (f.x + t.x) / 2, y: (f.y + t.y) / 2 };
  };

  test('tangent_at ellipse x²/9+y²/4=1 at (√5,4/3) → slope −√5/3, centered on P', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }, { id: 'P', kind: 'point', x: 2.236, y: 1.333 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'tan', kind: 'tangent_at', on: 'e', point: 'P' },
      ],
    });
    assert.ok(hasSeg(out, 'tan_from', 'tan_to'), 'tangent segment present');
    approx(tanSlope(out, 'tan'), -Math.sqrt(5) / 3, 0.02); // −0.745: tangent, NOT the secant through V₂
    const mid = tanMidpoint(out, 'tan');
    approx(mid.x, 2.236, 0.05); approx(mid.y, 1.333, 0.05);
  });

  test('tangent_at hyperbola x²/4−y²/9=1 at (√13,9/2) → slope √13/2', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }, { id: 'P', kind: 'point', x: 3.606, y: 4.5 }],
      steps: [
        { id: 'h', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'tan', kind: 'tangent_at', on: 'h', point: 'P' },
      ],
    });
    approx(tanSlope(out, 'tan'), Math.sqrt(13) / 2, 0.03); // 1.803
  });

  test('tangent_at parabola y²=4x at (1,2) → slope 1 (y=x+1)', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }, { id: 'P', kind: 'point', x: 1, y: 2 }],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'tan', kind: 'tangent_at', on: 'p', point: 'P' },
      ],
    });
    approx(tanSlope(out, 'tan'), 1, 0.02);
  });

  test('tangent_at REJECTS a point not on the conic (fail-safe)', () => {
    assert.throws(() => solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }, { id: 'P', kind: 'point', x: 3, y: 3 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'tan', kind: 'tangent_at', on: 'e', point: 'P' },
      ],
    }), /not on the conic/);
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

  // ── point_on_conic (Pillar 3 solver-deferred) ───────────────────────────────
  test('point_on_conic hyperbola at [√13, 4.5] → exact on-curve point (the measured kill case)', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'hyp', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'P', kind: 'point_on_conic', on: 'hyp', at: [Math.sqrt(13), 4.5] },
      ],
    });
    const p = findPt(out, 'P');
    approx(p.x, Math.sqrt(13)); approx(p.y, 4.5);
    // x²/4 − y²/9 = 1 must hold exactly.
    approx((p.x * p.x) / 4 - (p.y * p.y) / 9, 1);
  });

  test('point_on_conic → tangent_at flows without rejection (replaces point_on_circle misuse)', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'hyp', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'P', kind: 'point_on_conic', on: 'hyp', at: [Math.sqrt(13), 4.5] },
        { id: 'tang', kind: 'tangent_at', on: 'hyp', point: 'P', length: 6 },
      ],
    });
    assert.ok(hasSeg(out, 'tang_from', 'tang_to'), 'tangent segment present (no solver rejection)');
  });

  test('point_on_conic ellipse at [√5, 4/3] → exact on-curve (measured ellipse case)', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'P', kind: 'point_on_conic', on: 'e', at: [Math.sqrt(5), 4 / 3] },
      ],
    });
    const p = findPt(out, 'P');
    approx((p.x * p.x) / 9 + (p.y * p.y) / 4, 1);
  });

  test('point_on_conic SNAPS an off-curve intended point onto the curve (solver-deferred core)', () => {
    // Intended [3.5, 0] is OUTSIDE the a=3 ellipse; solver snaps to the vertex (3,0).
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'P', kind: 'point_on_conic', on: 'e', at: [3.5, 0] },
      ],
    });
    const p = findPt(out, 'P');
    approx(p.x, 3); approx(p.y, 0);
    approx((p.x * p.x) / 9 + (p.y * p.y) / 4, 1);
  });

  test('point_on_conic ellipse parametric angle=90 → top co-vertex (0, b)', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'P', kind: 'point_on_conic', on: 'e', angle: 90 },
      ],
    });
    const p = findPt(out, 'P');
    approx(p.x, 0); approx(p.y, 2);
  });

  test('point_on_conic angle on a hyperbola is rejected with a helpful hint', () => {
    assert.throws(() => solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'h', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'P', kind: 'point_on_conic', on: 'h', angle: 30 },
      ],
    }), /ellipse only/);
  });

  // ── normal_at (Pillar 3 solver gaps) ────────────────────────────────────────
  test('normal_at circle at (5,0) → horizontal radius line', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'c', kind: 'circle', center: 'O', radius: 5 },
        { id: 'P', kind: 'point_on_circle', on: 'c', angle: 0 },
        { id: 'n', kind: 'normal_at', on: 'c', point: 'P', length: 4 },
      ],
    });
    const f = findPt(out, 'n_from'), t = findPt(out, 'n_to');
    approx(f.y, 0); approx(t.y, 0); // along the radius (horizontal at angle 0)
    assert.ok(hasSeg(out, 'n_from', 'n_to'), 'normal segment present');
  });

  test('normal_at hyperbola at (√13, 9/2) → slope = −2/√13 (⊥ tangent √13/2)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'P', kind: 'point', x: Math.sqrt(13), y: 4.5 },
      ],
      steps: [
        { id: 'h', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'n', kind: 'normal_at', on: 'h', point: 'P', length: 6 },
      ],
    });
    const f = findPt(out, 'n_from'), t = findPt(out, 'n_to');
    const slope = (t.y - f.y) / (t.x - f.x);
    approx(slope, -2 / Math.sqrt(13), 0.02);
  });

  // ── intersect line∩conic (Pillar 3 solver gaps) ─────────────────────────────
  test('intersect vertical line x=1 ∩ parabola y²=4x → (1, ±2)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'L1', kind: 'point', x: 1, y: -5 },
        { id: 'L2', kind: 'point', x: 1, y: 5 },
      ],
      steps: [
        { id: 'par', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        { id: 'L', kind: 'line', through: ['L1', 'L2'] },
        { id: 'X', kind: 'intersect', of: ['L', 'par'], secondId: 'X2' },
      ],
    });
    hasPointNear(out, 1, 2); hasPointNear(out, 1, -2);
  });

  test('intersect x-axis ∩ ellipse a=3,b=2 → vertices (±3, 0)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'A', kind: 'point', x: -5, y: 0 },
        { id: 'B', kind: 'point', x: 5, y: 0 },
      ],
      steps: [
        { id: 'e', kind: 'ellipse', center: 'O', a: 3, b: 2 },
        { id: 'L', kind: 'line', through: ['A', 'B'] },
        { id: 'X', kind: 'intersect', of: ['L', 'e'], secondId: 'X2' },
      ],
    });
    hasPointNear(out, 3, 0); hasPointNear(out, -3, 0);
  });

  test('intersect x-axis ∩ hyperbola a=2,b=3 → vertices (±2, 0)', () => {
    const out = solveGeometry({
      given: [
        { id: 'O', kind: 'point', x: 0, y: 0 },
        { id: 'A', kind: 'point', x: -8, y: 0 },
        { id: 'B', kind: 'point', x: 8, y: 0 },
      ],
      steps: [
        { id: 'h', kind: 'hyperbola', center: 'O', a: 2, b: 3 },
        { id: 'L', kind: 'line', through: ['A', 'B'] },
        { id: 'X', kind: 'intersect', of: ['L', 'h'], secondId: 'X2' },
      ],
    });
    hasPointNear(out, 2, 0); hasPointNear(out, -2, 0);
  });

  // ── resolveRefId: generic object-where-id-expected coercion (2026-06-22) ──
  // The brain occasionally passes an OBJECT where a step-id string is expected
  // (JEE parabola → "Expected circle '[object Object]'", which failed the whole
  // construction). The solver now coerces it generically.
  test('coerce: INLINE conic def passed as point_on_conic.on registers + resolves', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        // `on` is an inline parabola OBJECT, not an id — used to throw "[object Object]".
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 'V', kind: 'point_on_conic', on: { kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' }, at: [1, 2] } as any,
      ],
    });
    const v = findPt(out, 'V');
    approx(v.x, 1); approx(v.y, 2); // point lands ON the inlined parabola
  });

  test('coerce: { id } wrapper object resolves to the inner id', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'p', kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 'lr', kind: 'latus_rectum', conic: { id: 'p' } } as any,
      ],
    });
    assert.ok(hasSeg(out, 'lr_a', 'lr_b'), 'latus_rectum resolved via the { id } wrapper');
  });

  test('coerce: inline conic on normal_at.on (the exact failure shape) now works', () => {
    const out = solveGeometry({
      given: [{ id: 'O', kind: 'point', x: 0, y: 0 }, { id: 'P', kind: 'point', x: 1, y: 2 }],
      steps: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: 'n', kind: 'normal_at', on: { kind: 'parabola', vertex: 'O', focalLength: 1, opens: 'right' }, point: 'P' } as any,
      ],
    });
    assert.ok(segsTouching(out, 'n') >= 0, 'normal_at on an inlined conic did not throw');
    assert.ok(out.segments.length > 0, 'a normal segment was produced');
  });

  test('coerce: a bare partial object (no kind/id) still throws a CLEAR error', () => {
    assert.throws(
      () => solveGeometry({
        given: [{ id: 'O', kind: 'point', x: 0, y: 0 }],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        steps: [{ id: 'lr', kind: 'latus_rectum', conic: { foo: 'bar' } } as any],
      }),
      /expected a step id/,
    );
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
