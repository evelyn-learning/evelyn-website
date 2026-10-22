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
import { solveGeometry, STEP_KINDS, HOMEWORK_ONLY_STEP_KINDS, getGeometryStepKindsDescriptionTail, type ConstructedGeometrySpec, type SolverOutput } from '../src/lib/tutor/diagrams/geometry-solver';

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

  // GAC acceptance 2026-10-22 (hw-14b problem 4, attempt 1): the proposer
  // translated B by the vector A→D as by: {from, to}; only {dx, dy} was read. (G7)
  test('translate_point accepts by: {from, to} (the vector from → to) as well as {dx, dy}', () => {
    const spec = {
      given: [{ id: 'A', kind: 'point', x: 0, y: 0 }, { id: 'B', kind: 'point', x: 6, y: 0 }, { id: 'D', kind: 'point', x: 1.5, y: 3.5 }],
      steps: [{ id: 'C', kind: 'translate_point', point: 'B', by: { from: 'A', to: 'D' } }],
    } as unknown as ConstructedGeometrySpec;
    const C = findPt(solveGeometry(spec), 'C');
    assert.equal(C.x, 7.5); assert.equal(C.y, 3.5);
    const dxdy = { ...spec, steps: [{ id: 'C', kind: 'translate_point', point: 'B', by: { dx: 1.5, dy: 3.5 } }] } as unknown as ConstructedGeometrySpec;
    const C2 = findPt(solveGeometry(dxdy), 'C');
    assert.equal(C2.x, 7.5); assert.equal(C2.y, 3.5);
    const bad = { ...spec, steps: [{ id: 'C', kind: 'translate_point', point: 'B', by: { x: 1 } }] } as unknown as ConstructedGeometrySpec;
    assert.throws(() => solveGeometry(bad), /by must be \{dx, dy\} or \{from, to\}/);
  });

  test("STEP_KINDS advertises 'point'", () => {
    assert.ok((STEP_KINDS as readonly string[]).includes('point'));
  });

  // GAC acceptance 2026-10-22 (hw-14b problem 5, G5): the sheet shades the four
  // circular segments between the circle and the inner square. The proposer
  // drew the inner square as a polygon, which the renderer fills 15 %, so the
  // wrong region read as shaded. A `region` step shades outer minus inner
  // shapes; a polygon with fill "none" draws unfilled. The stored p5 figure:
  const HW14B_P5 = JSON.parse('{"action":"showGeometryConstructed","given":[{"id":"A","kind":"point","x":0,"y":0,"label":""},{"id":"B","kind":"point","x":12,"y":0,"label":""},{"id":"C","kind":"point","x":12,"y":12,"label":""},{"id":"D","kind":"point","x":0,"y":12,"label":""},{"id":"O","kind":"point","x":6,"y":6,"label":""},{"id":"c1","kind":"circle","center":"O","radius":6}],"steps":[{"id":"sAB","kind":"segment","from":"A","to":"B","label":"12 cm"},{"id":"sBC","kind":"segment","from":"B","to":"C"},{"id":"sCD","kind":"segment","from":"C","to":"D"},{"id":"sDA","kind":"segment","from":"D","to":"A"},{"id":"P","kind":"midpoint","of":"sAB","label":""},{"id":"Q","kind":"midpoint","of":"sBC","label":""},{"id":"R","kind":"midpoint","of":"sCD","label":""},{"id":"S","kind":"midpoint","of":"sDA","label":""},{"id":"inner","kind":"polygon","vertices":["P","Q","R","S"]}],"display":{"grid":false,"axes":false,"keepLabels":true}}') as ConstructedGeometrySpec & { steps: Array<Record<string, unknown>> };
  const p5WithRegion = (region: Record<string, unknown>) => ({
    ...HW14B_P5,
    steps: [...HW14B_P5.steps.map((s) => (s.id === 'inner' ? { ...s, fill: 'none' } : s)), region],
  }) as unknown as ConstructedGeometrySpec;

  test('a region step shades the circle minus the inner square; the inner square carries fill "none" (G5)', () => {
    const out = solveGeometry(p5WithRegion({ id: 'shade', kind: 'region', outer: 'c1', inner: ['inner'] }));
    assert.equal(out.regions.length, 1);
    const r = out.regions[0];
    assert.equal(r.id, 'shade');
    // 48 samples, i = 0..47, and no repeated closing vertex: the renderer closes
    // every ring of the evenodd path with Z, so a 49th point equal to the first
    // (solveSector repeats it because its arc is OPEN and returns to the apex)
    // would add a zero-length edge and a hidden point for nothing.
    assert.equal(r.outer.length, 48);
    assert.deepEqual(r.holes, [['P', 'Q', 'R', 'S']]);
    assert.equal(r.label, undefined);
    assert.equal(new Set(r.outer).size, 48, 'distinct sample ids');
    for (const id of r.outer) {
      const p = findPt(out, id);
      assert.equal(p.hidden, true, `${id} is a hidden helper, never a dot`);
      assert.ok(Math.abs(Math.hypot(p.x - 6, p.y - 6) - 6) < 0.02, `${id} lies on c1`);
      assert.equal(p.label, undefined);
    }
    const inner = out.polygons.find((p) => p.label === undefined && p.vertices[0] === 'P');
    assert.ok(inner, 'the inner square is still a polygon');
    assert.equal(inner!.fill, 'none');
    assert.equal(out.circles.length, 1, 'the circle outline is still drawn');
    assert.equal(out.circles[0].id, 'c1');
    // A given polygon takes fill too; a polygon without one is unchanged.
    const given = solveGeometry({ given: [{ id: 'A', kind: 'point', x: 0, y: 0 }, { id: 'B', kind: 'point', x: 2, y: 0 }, { id: 'C', kind: 'point', x: 0, y: 2 },
      { id: 't', kind: 'polygon', vertices: ['A', 'B', 'C'], fill: 'none' }, { id: 'u', kind: 'polygon', vertices: ['A', 'B', 'C'] }] } as unknown as ConstructedGeometrySpec);
    assert.equal(given.polygons[0].fill, 'none');
    assert.equal(given.polygons[1].fill, undefined);
    assert.equal(given.regions.length, 0, 'no region step, no regions');
  });

  test('a region takes a polygon outer with a circle hole, a sector, and a colour; one naming a missing or non-area shape throws (G5)', () => {
    const base = {
      given: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A' }, { id: 'B', kind: 'point', x: 12, y: 0, label: 'B' }, { id: 'C', kind: 'point', x: 12, y: 12 }, { id: 'D', kind: 'point', x: 0, y: 12 },
        { id: 'O', kind: 'point', x: 6, y: 6, label: 'O' }, { id: 'c1', kind: 'circle', center: 'O', radius: 3 }, { id: 'sq', kind: 'polygon', vertices: ['A', 'B', 'C', 'D'] }],
      steps: [{ id: 'sAB', kind: 'segment', from: 'A', to: 'B' }],
    };
    const out = solveGeometry({ ...base, steps: [...base.steps, { id: 'ring', kind: 'region', outer: 'sq', inner: ['c1'], label: 'shaded' }], display: { colors: { ring: '#e67e22' } } } as unknown as ConstructedGeometrySpec);
    assert.deepEqual(out.regions[0].outer, ['A', 'B', 'C', 'D']);
    assert.equal(out.regions[0].holes.length, 1);
    assert.equal(out.regions[0].holes[0].length, 48);
    assert.equal(out.regions[0].label, 'shaded');
    assert.equal(out.regions[0].color, '#e67e22');
    // A sector's polygon is an area too; `inner` may be absent.
    const sec = solveGeometry({ ...base, steps: [
      { id: 'P', kind: 'point_on_circle', on: 'c1', angle: 0 }, { id: 'Q', kind: 'point_on_circle', on: 'c1', angle: 90 },
      { id: 'sec', kind: 'sector', on: 'c1', from: 'P', to: 'Q' }, { id: 'sh', kind: 'region', outer: 'sec' }] } as unknown as ConstructedGeometrySpec);
    assert.equal(sec.regions[0].outer.length, 1 + 25, 'the sector polygon as drawn: apex + 25 arc samples');
    assert.deepEqual(sec.regions[0].holes, []);
    for (const bad of [{ outer: 'c9', inner: ['sq'] }, { outer: 'sq', inner: ['nope'] }, { outer: 'sAB' }, { outer: 'A' }]) {
      assert.throws(() => solveGeometry({ ...base, steps: [...base.steps, { id: 'shade', kind: 'region', ...bad }] } as unknown as ConstructedGeometrySpec), /region "shade"/, JSON.stringify(bad));
    }
    assert.throws(() => solveGeometry({ ...base, steps: [...base.steps, { id: 'shade', kind: 'region', outer: 'c9' }] } as unknown as ConstructedGeometrySpec), /c9/);
    assert.throws(() => solveGeometry({ ...base, steps: [...base.steps, { id: 'shade', kind: 'region', outer: 'sAB' }] } as unknown as ConstructedGeometrySpec), /not a circle or polygon/);
  });

  test("'region' is a homework-only kind: the live tool-description tail and STEP_KINDS do not change (engine freeze)", () => {
    assert.ok((HOMEWORK_ONLY_STEP_KINDS as readonly string[]).includes('region'));
    assert.ok(!(STEP_KINDS as readonly string[]).includes('region'));
    assert.doesNotMatch(getGeometryStepKindsDescriptionTail(), /region/);
  });

  // 2026-10-19 (GAC Geometry, portal-9d615e3a): labelled lines drew nothing
  // and their helper points showed as lettered dots.
  test('a labelled line is drawn; the points only placing it are hidden', () => {
    const out = solveGeometry({
      given: [
        { id: 'A', kind: 'point', x: -3, y: 3 }, { id: 'B', kind: 'point', x: 3, y: 3 },
        { id: 'C', kind: 'point', x: -3, y: -1 }, { id: 'D', kind: 'point', x: 3, y: -1 },
        { id: 'E', kind: 'point', x: -1, y: 5 }, { id: 'F', kind: 'point', x: 1, y: -3 },
      ],
      steps: [
        { id: 'l', kind: 'line', through: ['A', 'B'], label: 'l' },
        { id: 'm', kind: 'line', through: ['C', 'D'], label: 'm' },
        { id: 't', kind: 'line', through: ['E', 'F'], label: 't' },
        { id: 'P1', kind: 'intersect', of: ['l', 't'] },
        { id: 'a1', kind: 'angle_marker', vertex: 'P1', from: 'A', to: 'F', label: '(3x + 15)°' },
      ],
    } as ConstructedGeometrySpec);
    assert.deepEqual(out.segments.map((s) => s.label).sort(), ['l', 'm', 't']);
    for (const id of ['A', 'B', 'C', 'D', 'E', 'F']) assert.equal(out.points.find((p) => p.id === id)?.hidden, true, id);
    assert.ok(out.points.find((p) => p.id === 'P1') && !out.points.find((p) => p.id === 'P1')!.hidden, 'the intersection is shown');
    assert.equal(out.angles?.[0]?.label, '(3x + 15)°');
  });
  test('an unlabelled line stays scaffolding; a point the figure names stays shown', () => {
    const out = solveGeometry({
      given: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A' }, { id: 'B', kind: 'point', x: 2, y: 0 }, { id: 'C', kind: 'point', x: 0, y: 2 }],
      steps: [{ id: 'k', kind: 'line', through: ['A', 'B'] }, { id: 'n', kind: 'line', through: ['A', 'C'], label: 'n' }, { id: 's', kind: 'segment', from: 'A', to: 'B' }],
    } as ConstructedGeometrySpec);
    assert.deepEqual(out.segments.map((s) => s.label ?? '').sort(), ['', 'n']);
    assert.ok(!out.points.find((p) => p.id === 'A')!.hidden, 'a named point stays');
    assert.ok(!out.points.find((p) => p.id === 'B')!.hidden, 'a point used by a segment stays');
    assert.equal(out.points.find((p) => p.id === 'C')!.hidden, true, 'a point only placing a labelled line is hidden');
  });

  // 2026-10-20 (GAC Geometry upload portal-0886d151): the brain marked the
  // angles of a parallel-lines figure with `to` equal to the vertex
  // ({vertex:'P1', from:'A', to:'P1'}); the marker had one arm and drew as a
  // wrong angle. A marker whose arm is its own vertex is dropped, not drawn.
  test('an angle_marker whose from or to IS the vertex is dropped; a proper one at an intersection stays', () => {
    const out = solveGeometry({
      given: [
        { id: 'A', kind: 'point', x: 0, y: 4 }, { id: 'B', kind: 'point', x: 10, y: 4 },
        { id: 'C', kind: 'point', x: 0, y: 0 }, { id: 'D', kind: 'point', x: 10, y: 0 },
      ],
      steps: [
        { id: 'l', kind: 'line', through: ['A', 'B'], label: 'l' },
        { id: 'm', kind: 'line', through: ['C', 'D'], label: 'm' },
        { id: 't', kind: 'line', through: [{ x: 2, y: 6 }, { x: 7, y: -2 }], label: 't' },
        { id: 'P1', kind: 'intersect', of: ['l', 't'] },
        { id: 'P2', kind: 'intersect', of: ['m', 't'] },
        { id: 'bad1', kind: 'angle_marker', vertex: 'P1', from: 'A', to: 'P1', label: '(3x+15)°' },
        { id: 'bad2', kind: 'angle_marker', vertex: 'P2', from: 'P2', to: 'D', label: '(5x-25)°' },
        { id: 'good', kind: 'angle_marker', vertex: 'P1', from: 'A', to: 'P2', label: '(3x+15)°' },
      ],
    } as ConstructedGeometrySpec);
    assert.equal(out.angles.length, 1, 'only the proper marker survives');
    const good = out.angles[0];
    assert.equal(good.label, '(3x+15)°');
    assert.equal(good.vertex, 'P1');
    assert.notEqual(good.from, good.vertex);
    assert.notEqual(good.to, good.vertex);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
