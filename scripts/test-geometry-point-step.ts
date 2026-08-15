/**
 * Unit test for declare-`point` steps in the geometry solver
 * (src/lib/tutor/diagrams/geometry-solver.ts) and the unknown-step-kind
 * guard. Root cause of live session portal-7f483853 (2026-08-12): the brain
 * declared raw points inside `steps` (kind:'point'), solveStep's switch had
 * no case for it and no default, so the points silently no-op'd and every
 * roof segment/polygon referencing them was dropped at render — the student
 * saw only the base segment while the tutor narrated squares and triangles.
 *
 * Run: npm run test:geometry-point-step
 * No framework — matches test:conic-primitives. Pure solver, no brain.
 */

import { strict as assert } from 'node:assert';
import { solveGeometry, STEP_KINDS, type ConstructedGeometrySpec, type SolverOutput } from '../apps/marketing/src/lib/tutor/diagrams/geometry-solver';

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
const hasSeg = (out: SolverOutput, a: string, b: string) =>
  out.segments.some((s) => (s.from === a && s.to === b) || (s.from === b && s.to === a));

function main() {
  console.log('Geometry solver — declare-point steps + unknown-kind guard\n');

  // ── point declared in steps ───────────────────────────────────────────────
  test('point step lands in output points', () => {
    const spec: ConstructedGeometrySpec = {
      given: [{ id: 'A', kind: 'point', x: 0, y: 0 }],
      steps: [{ id: 'P', kind: 'point', x: 2, y: 3, label: 'P' }],
    };
    const out = solveGeometry(spec);
    const p = findPt(out, 'P');
    assert.equal(p.x, 2);
    assert.equal(p.y, 3);
    assert.equal(p.label, 'P');
  });

  test('segments referencing step-declared points render (portal-7f483853 roofs, cmd 2 shape)', () => {
    // Verbatim structure of showGeometryConstructed-2 from the live session:
    // square roof built from step points + segments, triangle from step apex.
    const spec: ConstructedGeometrySpec = {
      given: [
        { id: 'base', kind: 'point', x: 0, y: 0 },
        { id: 'xpt', kind: 'point', x: 2, y: 0 },
      ],
      steps: [
        { id: 'seg_base', kind: 'segment', from: 'base', to: 'xpt', label: 'length at this x' },
        { id: 'sq_c1', kind: 'point', x: 0, y: 2 },
        { id: 'sq_c2', kind: 'point', x: 2, y: 2 },
        { id: 'sq_top', kind: 'segment', from: 'sq_c1', to: 'sq_c2', label: 'square roof' },
        { id: 'sq_l', kind: 'segment', from: 'base', to: 'sq_c1' },
        { id: 'sq_r', kind: 'segment', from: 'xpt', to: 'sq_c2' },
        { id: 'tri_apex', kind: 'point', x: 1, y: 3.2 },
        { id: 'tri_l', kind: 'segment', from: 'base', to: 'tri_apex', label: 'triangle side' },
        { id: 'tri_r', kind: 'segment', from: 'xpt', to: 'tri_apex' },
      ],
    };
    const out = solveGeometry(spec);
    findPt(out, 'sq_c1'); findPt(out, 'sq_c2'); findPt(out, 'tri_apex');
    assert.ok(hasSeg(out, 'base', 'xpt'), 'base segment');
    assert.ok(hasSeg(out, 'sq_c1', 'sq_c2'), 'square top');
    assert.ok(hasSeg(out, 'base', 'sq_c1'), 'square left');
    assert.ok(hasSeg(out, 'xpt', 'sq_c2'), 'square right');
    assert.ok(hasSeg(out, 'base', 'tri_apex'), 'triangle left');
    assert.ok(hasSeg(out, 'xpt', 'tri_apex'), 'triangle right');
  });

  test('polygons referencing step-declared points render (portal-7f483853 roofs, cmd 3 shape)', () => {
    // Verbatim structure of showGeometryConstructed-3 from the live session.
    const spec: ConstructedGeometrySpec = {
      given: [
        { id: 'A', kind: 'point', x: -1, y: 0 },
        { id: 'B', kind: 'point', x: 1, y: 0 },
      ],
      steps: [
        { id: 'base', kind: 'segment', from: 'A', to: 'B', label: 'base length s' },
        { id: 'sqC', kind: 'point', x: -1, y: 2 },
        { id: 'sqD', kind: 'point', x: 1, y: 2 },
        { id: 'square', kind: 'polygon', vertices: ['A', 'B', 'sqD', 'sqC'], label: 'square roof' },
        { id: 'triApex', kind: 'point', x: 0, y: 1.73 },
        { id: 'triangle', kind: 'polygon', vertices: ['A', 'B', 'triApex'], label: 'triangle roof' },
      ],
    };
    const out = solveGeometry(spec);
    assert.equal(out.polygons.length, 2, `expected 2 polygons, got ${out.polygons.length}`);
    const square = out.polygons.find((p) => p.label === 'square roof');
    const triangle = out.polygons.find((p) => p.label === 'triangle roof');
    assert.ok(square && square.vertices.length === 4, 'square has 4 vertices');
    assert.ok(triangle && triangle.vertices.length === 3, 'triangle has 3 vertices');
  });

  test('step point can seed later constructions (midpoint of step-declared segment ends)', () => {
    const spec: ConstructedGeometrySpec = {
      given: [],
      steps: [
        { id: 'A', kind: 'point', x: 0, y: 0 },
        { id: 'B', kind: 'point', x: 4, y: 0 },
        { id: 'AB', kind: 'segment', from: 'A', to: 'B' },
        { id: 'M', kind: 'midpoint', of: 'AB' },
      ],
    };
    const out = solveGeometry(spec);
    const m = findPt(out, 'M');
    assert.equal(m.x, 2);
    assert.equal(m.y, 0);
  });

  test('kindless {id,x,y} step entry is treated as a point (given-path parity)', () => {
    const spec = {
      given: [{ id: 'A', kind: 'point', x: 0, y: 0 }],
      steps: [
        { id: 'P', x: 2, y: 3 },
        { id: 'AP', kind: 'segment', from: 'A', to: 'P' },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as ConstructedGeometrySpec;
    const out = solveGeometry(spec);
    const p = findPt(out, 'P');
    assert.equal(p.x, 2);
    assert.equal(p.y, 3);
    assert.ok(hasSeg(out, 'A', 'P'), 'segment to kindless point');
  });

  test('point step with non-finite coords throws instead of registering NaN geometry', () => {
    const bad = [
      { id: 'P', kind: 'point' },
      { id: 'P', kind: 'point', x: '2', y: 3 },
      { id: 'P', kind: 'point', x: NaN, y: 0 },
    ];
    for (const step of bad) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spec = { given: [], steps: [step] } as any as ConstructedGeometrySpec;
      assert.throws(() => solveGeometry(spec), /finite/, `should throw for ${JSON.stringify(step)}`);
    }
  });

  // ── unknown-kind guard ────────────────────────────────────────────────────
  test('unknown step kind throws instead of silently no-opping', () => {
    const spec = {
      given: [{ id: 'A', kind: 'point', x: 0, y: 0 }],
      steps: [{ id: 'z', kind: 'zorble', x: 1, y: 1 }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any as ConstructedGeometrySpec;
    assert.throws(() => solveGeometry(spec), /zorble/);
  });

  test("STEP_KINDS advertises 'point'", () => {
    assert.ok((STEP_KINDS as readonly string[]).includes('point'));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
