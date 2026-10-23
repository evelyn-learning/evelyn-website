/**
 * Tests for the per-problem homework build (src/lib/tutor/homework-build/).
 * Sections 2-5 are appended by later tasks; keep helpers reusable.
 *
 * Section 1 needs a local mongod: TEST_MONGODB_URI, else
 * mongodb://127.0.0.1:27017/evelyn-test-homework-build. Never port 2710
 * (that is the production tunnel). Skipped (exit 0) when unreachable.
 *
 * Run: npx tsx scripts/test-homework-build.ts  (npm run test:homework-build)
 */

// Env first: @core/db reads MONGODB_URI at module load.
const TEST_URI = process.env.TEST_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/evelyn-test-homework-build';
process.env.MONGODB_URI = TEST_URI;
if (/:2710(\/|$)/.test(TEST_URI)) { console.error('Refusing to run against port 2710 (prod tunnel)'); process.exit(1); }

import { strict as assert } from 'node:assert';
import mongoose from 'mongoose';

let passed = 0;
let failed = 0;
async function section(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function assertTestDb(): void {
  const name = mongoose.connection.name;
  if (!/test/i.test(name)) { console.error(`Refusing to drop database "${name}": name must contain "test"`); process.exit(1); }
}

async function main() {
  // 2026-10-22 (hw-14 p8): the stored figure as the HomeworkBuild dump has it — `expression`, not `expr`.
  const HW14_P8 = "The graph of y = a cos(bx) + d is shown (x in degrees). [Graph: A cosine curve on a grid. The x-axis runs from 0 to 360, labelled at 60, 120, 180, 240, 300, and 360. The y-axis is labelled 3, 2, 1, −1, −2. The curve has maxima of 3 at x = 0, 120, 240, and 360. It has minima of −2 at x = 60, 180, and 300. A horizontal line is drawn at y = 0.]\n(a) Find the amplitude, period, and midline.\n(b) Find a, b, and d.";
  const hw14p8Fig = () => ({ action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [0, 360], yRange: [-2.5, 3.5], xAxisStep: 60, yAxisStep: 1, functions: [{ expression: '2.5*cos(3*x*pi/180)+0.5' }] } });
  // ---- 2 validate (pure; runs before any Mongo work) ----
  console.log('2 validate');
  {
    const { validateFigure, labelIsFromText, checkClaims } =
      await import('../src/lib/tutor/homework-build/figure-validate');
    type Fig = Parameters<typeof validateFigure>[0];
    const P5 = "In △ABC, DE ∥ BC. Find the values of x and y. [Figure: Triangle with A at the top, B at the bottom left, and C at the bottom right. D is on AB and E is on AC. Segment DE is drawn, and both DE and BC carry a single arrow mark (parallel). Labels: AD = 6, DB = x, AE = 12, EC = y, DE = 9, BC = 15.]";
    const P8 = "The graph of y = a sin(bx) + d is shown. [Graph: The x-axis is marked π/2, π, 3π/2, 2π; the y-axis is marked 4, 2, −2. A horizontal line is drawn at y = 1. The sinusoid starts at x = 0 near y = 1 rising. It peaks at y = 4 near x = π/4, reaches its minimum at y = −2 near x = 3π/4, peaks again at 4 near 5π/4, reaches its minimum at −2 near 7π/4, and rises back to 1 at 2π.]\\n(a) Find the amplitude, period, midline.\\n(b) Find a, b, and d.";
    const claims = [
      { kind: 'on_segment' as const, point: 'D', segment: ['A', 'B'] as [string, string] },
      { kind: 'on_segment' as const, point: 'E', segment: ['A', 'C'] as [string, string] },
      { kind: 'parallel' as const, a: ['D', 'E'] as [string, string], b: ['B', 'C'] as [string, string] },
    ];
    const pt = (id: string, x: number, y: number) => ({ id, kind: 'point', x, y, label: id });
    const seg = (id: string, from: string, to: string, label?: string) => ({ id, kind: 'segment', from, to, label });
    const ws3p5Bad: Fig = {
      action: 'showGeometryConstructed',
      given: [pt('A', 0, 4), pt('B', -3, 0), pt('C', 3, 0), pt('D', -1.2, 1.6), pt('E', 1.2, 1.6),
        seg('AB', 'A', 'B'), seg('AC', 'A', 'C'), seg('BC', 'B', 'C', 'BC = 15'), seg('DE', 'D', 'E', 'DE = 9')],
      steps: [],
    };
    const goodFig = (dbLabel = 'DB = x'): Fig => ({
      action: 'showGeometryConstructed',
      given: [pt('A', 0, 5), pt('B', -3, 0), pt('C', 3, 0)],
      steps: [
        { id: 'D', kind: 'section_point', of: { from: 'A', to: 'B' }, ratio: [6, 9], label: 'D' },
        { id: 'E', kind: 'section_point', of: { from: 'A', to: 'C' }, ratio: [12, 18], label: 'E' },
        seg('AB', 'A', 'B'), seg('AC', 'A', 'C'), seg('BC', 'B', 'C', 'BC = 15'), seg('DE', 'D', 'E', 'DE = 9'),
        seg('AD', 'A', 'D', 'AD = 6'), seg('DB', 'D', 'B', dbLabel), seg('AE', 'A', 'E', 'AE = 12'), seg('EC', 'E', 'C', 'EC = y'),
      ],
    });
    const reasonsOf = (v: ReturnType<typeof validateFigure>) => (v.ok ? [] : v.reasons);

    await section('null figure is ok', () => assert.deepEqual(validateFigure(null, { problemText: P5, claims: [] }), { ok: true }));
    await section('ws3p5Bad: off-segment points fail on_segment', () => {
      const v = validateFigure(ws3p5Bad, { problemText: P5, claims });
      assert.equal(v.ok, false);
      assert.ok(reasonsOf(v).some((r) => r.includes('on_segment D')), reasonsOf(v).join(' | '));
    });
    await section('ws3p5Good: constructed figure passes', () => {
      const v = validateFigure(goodFig(), { problemText: P5, claims });
      assert.deepEqual(v, { ok: true });
    });
    await section('labelLeak: DB = 9 (computed value) fails with a label reason', () => {
      const v = validateFigure(goodFig('DB = 9'), { problemText: P5, claims });
      assert.equal(v.ok, false);
      assert.ok(reasonsOf(v).some((r) => r.includes('label') && r.includes('DB = 9')), reasonsOf(v).join(' | '));
    });
    await section('a point named in the description but not drawn fails', () => {
      const f = goodFig() as { steps: unknown[] };
      f.steps = f.steps.filter((s) => !/E/.test((s as { id: string }).id));
      const v = validateFigure(f as Fig, { problemText: P5, claims: [] });
      assert.ok(reasonsOf(v).some((r) => r.includes('point E')), reasonsOf(v).join(' | '));
    });
    await section('labelIsFromText rules', () => {
      assert.ok(labelIsFromText('AD = 6', P5)); assert.ok(labelIsFromText('x', P5)); assert.ok(labelIsFromText('B', P5));
      assert.ok(labelIsFromText('AD 6', P5)); assert.ok(labelIsFromText('DE = 9', P5));
      assert.ok(!labelIsFromText('DB = 9', P5)); assert.ok(!labelIsFromText('Z', P5)); assert.ok(!labelIsFromText('AD = 7', P5));
      assert.ok(labelIsFromText('AD is 6'.replace(' is', ' ='), 'AD is 6 cm'));
      assert.ok(labelIsFromText('−2', P8)); assert.ok(labelIsFromText('π/4', P8)); assert.ok(!labelIsFromText('3π/4 + 1', P8));
      assert.ok(!labelIsFromText('DB = 12', P5), 'neighbouring label must not supply the value');
      assert.ok(!labelIsFromText('-5', P5)); assert.ok(!labelIsFromText('3π/4 + 4', P8)); assert.ok(!labelIsFromText('AD + DB', P5));
      assert.ok(labelIsFromText('AD=6', P5)); assert.ok(!labelIsFromText('AD - 6', P5));
      // 2026-10-21 (GAC acceptance): an expression label written verbatim on the sheet.
      const T1 = 'Lines p ∥ q are cut by transversal r. [Figure: Angles, one at a time: - (5x + 10)°: its arc is at the crossing of r and p. - (8x − 56)°: its arc is at the crossing of r and q.] Find x.';
      assert.ok(labelIsFromText('(5x + 10)°', T1)); assert.ok(labelIsFromText('(8x − 56)°', T1)); assert.ok(labelIsFromText('(8x - 56)°', T1));
      assert.ok(labelIsFromText('4x + 6', 'The angles measure (4x + 6)° and (2x + 10)°.'));
      assert.ok(!labelIsFromText('5x + 11', T1)); assert.ok(!labelIsFromText('(5x + 1)°', T1));
      assert.ok(!labelIsFromText('Rectangle with semicircle cut out', P5));
      assert.ok(!labelIsFromText('6', 'AD = 16'), 'a digit inside a number is not the word');
    });
    await section('first-sentence article "A" is not a point', () => {
      const text = 'Find the radius. [Figure: A circle with centre O and radius 5.]';
      const fig: Fig = { action: 'showGeometryConstructed', given: [pt('O', 0, 0)], steps: [] };
      assert.deepEqual(validateFigure(fig, { problemText: text, claims: [] }), { ok: true });
    });
    await section('malformed figures return a verdict instead of throwing', () => {
      const ctx = { problemText: P5, claims: [] };
      for (const f of [
        { action: 'showGeometryConstructed', given: undefined, steps: [] },
        { action: 'showGeometryConstructed', given: [], steps: 'nope' },
        { action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [0, 1], functions: [{ expr: 'x' }], points: [{ x: 0, y: 0 }] } },
        { action: 'showGraph', type: 'function' },
      ]) {
        const v = validateFigure(f as unknown as Fig, ctx);
        assert.equal(v.ok, false);
      }    });
    await section('checkClaims: perpendicular, collinear, between, on_circle, missing id', () => {
      const pts = { A: { x: 0, y: 0 }, B: { x: 4, y: 0 }, C: { x: 0, y: 3 }, M: { x: 2, y: 0 }, O: { x: 0, y: 0 }, R: { x: 5, y: 0 } };
      const circ = { c: { cx: 0, cy: 0, r: 5 } };
      assert.deepEqual(checkClaims(pts, circ, [
        { kind: 'perpendicular', a: ['A', 'B'], b: ['A', 'C'] }, { kind: 'collinear', points: ['A', 'M', 'B'] },
        { kind: 'between', point: 'M', ends: ['A', 'B'] }, { kind: 'on_circle', point: 'R', circle: 'c' }], 1e-6), []);
      assert.equal(checkClaims(pts, circ, [{ kind: 'between', point: 'R', ends: ['A', 'B'] }]).length, 1);
      assert.equal(checkClaims(pts, circ, [{ kind: 'on_circle', point: 'M', circle: 'c' }]).length, 1);
      assert.equal(checkClaims(pts, circ, [{ kind: 'parallel', a: ['A', 'B'], b: ['A', 'C'] }]).length, 1);
      assert.match(checkClaims(pts, circ, [{ kind: 'on_segment', point: 'Q', segment: ['A', 'B'] }])[0], /no such point/);
      // 2026-10-21 (GAC acceptance): the sheet's "the circle" with one circle drawn is that circle; two circles stay ambiguous.
      assert.deepEqual(checkClaims(pts, circ, [{ kind: 'on_circle', point: 'R', circle: 'circle' }]), []);
      assert.match(checkClaims(pts, { ...circ, d: { cx: 1, cy: 1, r: 1 } }, [{ kind: 'on_circle', point: 'R', circle: 'circle' }])[0], /no such circle/);
      // Coordinates written to three decimals: 0.002 off a 5-wide figure passes by default, not at 1e-6.
      const near = { ...pts, N: { x: 2, y: 0.002 } };
      assert.deepEqual(checkClaims(near, circ, [{ kind: 'collinear', points: ['A', 'N', 'B'] }]), []);
      assert.equal(checkClaims(near, circ, [{ kind: 'collinear', points: ['A', 'N', 'B'] }], 1e-6).length, 1);
    });

    await section('checkClaims (hw-14b p4): a collinear claim over one polygon\'s vertices is skipped, not checked', () => {
      const pts = { A: { x: 0, y: 0 }, B: { x: 6, y: 0 }, C: { x: 8, y: 3.5 }, D: { x: 2, y: 3.5 }, E: { x: 4, y: 1.75 } };
      const polygons = [['A', 'B', 'C', 'D']];
      const vertexTriples = [['D', 'A', 'B'], ['A', 'B', 'C'], ['B', 'C', 'D'], ['A', 'D', 'C']].map((points) => ({ kind: 'collinear' as const, points }));
      assert.equal(checkClaims(pts, {}, vertexTriples).length, 4, 'without the polygon the claims fail as before');
      assert.deepEqual(checkClaims(pts, {}, vertexTriples, undefined, undefined, polygons), []);
      // A point that is not a vertex (E, on diagonal AC) is still checked.
      assert.deepEqual(checkClaims(pts, {}, [{ kind: 'collinear', points: ['A', 'E', 'C'] }], undefined, undefined, polygons), []);
      assert.match(checkClaims(pts, {}, [{ kind: 'collinear', points: ['A', 'E', 'B'] }], undefined, undefined, polygons)[0], /collinear \[A,E,B\] fails/);
      // Vertices of two different polygons do not combine into one skip.
      assert.equal(checkClaims(pts, {}, [{ kind: 'collinear', points: ['A', 'B', 'C'] }], undefined, undefined, [['A', 'B', 'E'], ['C', 'D', 'E']]).length, 1);
    });
    await section('validateFigure (hw-14b p4): parallelogram ABCD with its angle names read as collinear triples still gets its figure', () => {
      const P4 = 'ABCD is a parallelogram. [Figure: Parallelogram ABCD with A at bottom left, B at bottom right, C at top right, D at top left. Diagonals AC and BD intersect at E. Segment AE = 2x + 1, segment EC = 3x − 4. Angle DAB = (2y + 20)°, angle ABC = (4y + 10)°.]';
      const fig: Fig = {
        action: 'showGeometryConstructed',
        given: [pt('A', 0, 0), pt('B', 6, 0), pt('D', 2, 3.5)],
        steps: [
          { id: 'C', kind: 'translate_point', point: 'B', by: { from: 'A', to: 'D' }, label: 'C' },
          { id: 'pg', kind: 'polygon', vertices: ['A', 'B', 'C', 'D'], fill: 'none' },
          { id: 'E', kind: 'midpoint', of: { from: 'A', to: 'C' }, label: 'E' },
          seg('sAE', 'A', 'E', '2x + 1'), seg('sEC', 'E', 'C', '3x − 4'), seg('sDB', 'D', 'B'),
          { id: 'mA', kind: 'angle_marker', vertex: 'A', from: 'B', to: 'D', style: 'arc', label: '(2y + 20)°' },
          { id: 'mB', kind: 'angle_marker', vertex: 'B', from: 'C', to: 'A', style: 'arc', label: '(4y + 10)°' },
        ],
        display: { grid: false, axes: false },
      } as unknown as Fig;
      // The four claims the live run emitted (engine log 2026-10-22, n=4 attempts 1 and 2): the parallelogram's angle names.
      const live = [['D', 'A', 'B'], ['A', 'B', 'C'], ['B', 'C', 'D'], ['A', 'D', 'C']].map((points) => ({ kind: 'collinear' as const, points }));
      assert.deepEqual(validateFigure(fig, { problemText: P4, claims: [...live, { kind: 'on_segment', point: 'E', segment: ['A', 'C'] }] }), { ok: true });
      // A collinear claim the figure really breaks still rejects it.
      const v = validateFigure(fig, { problemText: P4, claims: [{ kind: 'collinear', points: ['A', 'E', 'B'] }] });
      assert.ok(!v.ok && v.reasons.some((r) => /collinear \[A,E,B\] fails/.test(r)), JSON.stringify(v));
    });
    await section('hw-15 p4 (quarter circles in a rectangle): sector is documented for the proposer; hidden circles + unfilled sectors + region validate and solve', async () => {
      const { FIGURE_PROPOSE_SYSTEM } = await import('../src/lib/tutor/homework-build/figure-build');
      const { solveGeometry } = await import('../src/lib/tutor/diagrams/geometry-solver');
      assert.ok(FIGURE_PROPOSE_SYSTEM.includes('sector: { kind: "sector", on: circleId, from: pointId, to: pointId'), 'sector shape documented');
      assert.ok(FIGURE_PROPOSE_SYSTEM.includes('hidden: true'), 'hidden circle documented');
      const P4 = 'Two quarter circles are drawn inside a 16 cm by 8 cm rectangle. Find the area and perimeter of the shaded region. [Figure: A rectangle 16 cm wide (labelled on the top edge) and 8 cm tall (labelled on the left side). Two quarter circles of radius 8, one centered at each bottom corner; their arcs meet at the midpoint of the bottom edge. Shaded region: the area below the top edge and above both arcs. It is hatched.]';
      const fig = {
        action: 'showGeometryConstructed',
        // The sheet letters no corner: helper points, no labels.
        given: [{ id: 'D', kind: 'point', x: 0, y: 0 }, { id: 'C', kind: 'point', x: 16, y: 0 }, { id: 'B', kind: 'point', x: 16, y: 8 }, { id: 'A', kind: 'point', x: 0, y: 8 }, { id: 'rect', kind: 'polygon', vertices: ['D', 'C', 'B', 'A'], fill: 'none' }],
        steps: [
          { id: 'M', kind: 'midpoint', of: { from: 'D', to: 'C' } },
          { id: 'c1', kind: 'circle', center: 'D', radius: 8, hidden: true },
          { id: 'c2', kind: 'circle', center: 'C', radius: 8, hidden: true },
          { id: 's1', kind: 'sector', on: 'c1', from: 'M', to: 'A', fill: 'none' },
          { id: 's2', kind: 'sector', on: 'c2', from: 'B', to: 'M', fill: 'none' },
          seg('top', 'A', 'B', '16 cm'), seg('left', 'D', 'A', '8 cm'),
          { id: 'sh', kind: 'region', outer: 'rect', inner: ['s1', 's2'] },
        ],
        display: { grid: false, axes: false },
      } as unknown as Fig;
      assert.deepEqual(validateFigure(fig, { problemText: P4, claims: [] }), { ok: true });
      const solved = solveGeometry(fig as never);
      assert.equal(solved.circles.length, 0, 'hidden circles are not drawn');
      assert.deepEqual(solved.polygons.filter((p) => p.vertices.length > 4).map((p) => p.fill), ['none', 'none'], 'the sectors are outlines only');
      assert.equal(solved.regions.length, 1);
      assert.equal(solved.regions[0].holes.length, 2);
      // A sector on a circle that is drawn keeps today's shape (no fill field → renderer default).
      const plain = solveGeometry({ action: 'showGeometryConstructed', given: [pt('O', 0, 0)], steps: [{ id: 'c', kind: 'circle', center: 'O', radius: 4 }, { id: 'P', kind: 'point_on_circle', on: 'c', angle: 0 }, { id: 'Q', kind: 'point_on_circle', on: 'c', angle: 90 }, { id: 's', kind: 'sector', on: 'c', from: 'P', to: 'Q' }] } as never);
      assert.equal(plain.circles.length, 1);
      assert.equal(plain.polygons[0].fill, undefined);
    });
    await section('hw-15 p8 (shaded segment): a region on a sector validates — the sector\'s apex and arc ends coincide with labelled points and stay as hidden points', async () => {
      const { solveGeometry } = await import('../src/lib/tutor/diagrams/geometry-solver');
      const P8 = 'Circle O has radius 6 and ∠AOB = 120°. Find the area of the shaded segment (between chord AB and the arc). [Figure: A circle with center O. A is on the upper right and B is on the upper left. Chord AB is horizontal near the top. - Radii OA and OB are drawn, and OA is labelled 6. - 120°: an arc at O, above O, between OB and OA. - The region between chord AB and the upper arc is hatched (shaded).]';
      // The proposer's first attempt on 2026-10-22 (engine log): rejected as "inner tri is not inside outer sec".
      const fig = {
        action: 'showGeometryConstructed',
        given: [pt('O', 0, 0), { id: 'c', kind: 'circle', center: 'O', radius: 6 }],
        steps: [
          { id: 'A', kind: 'point_on_circle', on: 'c', angle: 30, label: 'A' }, { id: 'B', kind: 'point_on_circle', on: 'c', angle: 150, label: 'B' },
          { id: 'sec', kind: 'sector', on: 'c', from: 'A', to: 'B', direction: 'ccw', fill: 'none' },
          { id: 'tri', kind: 'polygon', vertices: ['O', 'A', 'B'], fill: 'none' },
          { id: 'reg', kind: 'region', outer: 'sec', inner: ['tri'] },
          seg('oa', 'O', 'A', '6'), seg('ob', 'O', 'B'), seg('ab', 'A', 'B'),
          { id: 'ang', kind: 'angle_marker', vertex: 'O', from: 'A', to: 'B', style: 'arc', label: '120°' },
        ],
        display: { grid: false, axes: false },
      } as unknown as Fig;
      assert.deepEqual(validateFigure(fig, { problemText: P8, claims: [] }), { ok: true });
      const solved = solveGeometry(fig as never);
      const byId = new Map(solved.points.map((p) => [p.id, p]));
      for (const id of solved.regions[0].outer) assert.ok(byId.has(id), `ring vertex ${id} reaches the output`);
      // The apex sits on O and the arc ends on A and B: present, but never drawn as dots.
      assert.equal(byId.get('sec_apex')?.hidden, true); assert.equal(byId.get('sec_arc0')?.hidden, true);
      assert.equal(byId.get('O')?.hidden, undefined, 'the labelled point itself is still drawn');
      assert.equal(solved.points.filter((p) => !p.hidden).length, 3, 'exactly O, A, B are visible dots');
    });
    await section('claims prompts (hw-14b p4): an angle or polygon name is not a collinear statement', async () => {
      const { FIGURE_CLAIMS_SYSTEM, FIGURE_PROPOSE_SYSTEM } = await import('../src/lib/tutor/homework-build/figure-build');
      for (const s of [FIGURE_CLAIMS_SYSTEM, FIGURE_PROPOSE_SYSTEM]) {
        assert.ok(s.includes('collinear only when the text says the points lie on one line'), s.slice(0, 200));
        assert.ok(s.includes('an angle name (angle ABC, ∠ABC) or a polygon name (ABCD) is not a collinear statement'), s.slice(0, 200));
      }
    });

    const PI = Math.PI;
    const graph = (over: Record<string, unknown> = {}, fnLabel?: string): Fig => ({
      action: 'showGraph', type: 'function',
      data: {
        xLabel: 'x', yLabel: 'y', xRange: [0, 2 * PI], yRange: [-3, 5], xAxisStep: 'pi/2',
        functions: [{ expr: '3\\sin(2x)+1', ...(fnLabel ? { label: fnLabel } : {}) }],
        points: [
          { x: PI / 4, y: 4, label: '4' }, { x: (3 * PI) / 4, y: -2, label: '-2' }, { x: (5 * PI) / 4, y: 4 }, { x: (7 * PI) / 4, y: -2 },
          { x: 0, y: 1 }, { x: PI / 2, y: 1 }, { x: PI, y: 1 }, { x: (3 * PI) / 2, y: 1 }, { x: 2 * PI, y: 1 },
        ],
        ...over,
      },
    } as Fig);
    await section('graphLegend: legend label fails', () => {
      const v = validateFigure(graph({}, 'y = 3\\sin(2x)+1'), { problemText: P8, claims: [] });
      assert.equal(v.ok, false); assert.ok(reasonsOf(v).some((r) => r.includes('legend')), reasonsOf(v).join(' | '));
    });
    await section('graph without legend and with pi axis step passes', () =>
      assert.deepEqual(validateFigure(graph(), { problemText: P8, claims: [] }), { ok: true }));
    await section('graph without xAxisStep fails on axis', () => {
      const v = validateFigure(graph({ xAxisStep: undefined }), { problemText: P8, claims: [] });
      assert.equal(v.ok, false); assert.ok(reasonsOf(v).some((r) => r.includes('axis')), reasonsOf(v).join(' | '));
    });
    await section('I4 figure text fields: title / axis labels / annotations must come from the sheet', () => {
      const answerTitle = validateFigure({ ...goodFig(), title: 'x = 20' } as Fig, { problemText: P5, claims });
      assert.equal(answerTitle.ok, false);
      assert.ok(reasonsOf(answerTitle).some((r) => r === 'label "x = 20" does not come from the problem text'), reasonsOf(answerTitle).join(' | '));
      assert.deepEqual(validateFigure({ ...goodFig(), title: 'In △ABC, DE ∥ BC' } as Fig, { problemText: P5, claims }), { ok: true }, 'title copied from the sheet');
      assert.deepEqual(validateFigure({ ...goodFig(), title: 'DE = 9' } as Fig, { problemText: P5, claims }), { ok: true }, 'a given as title');
      const gt = validateFigure(graph({ title: 'amplitude = 3' }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(gt).some((r) => r.includes('"amplitude = 3"')), reasonsOf(gt).join(' | '));
      assert.deepEqual(validateFigure(graph({ title: 'The graph of y = a sin(bx) + d' }), { problemText: P8, claims: [] }), { ok: true });
      const ax = validateFigure(graph({ xLabel: 'period = π', yLabel: 'y' }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(ax).some((r) => r.includes('"period = π"')), reasonsOf(ax).join(' | '));
      assert.deepEqual(validateFigure(graph({ xLabel: 't', yLabel: 'y' }), { problemText: P8, claims: [] }), { ok: true }, 'one-letter axis names always pass');
      const an = validateFigure(graph({ annotations: [{ type: 'point-label', at: 0, label: 'd = 1' }] }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(an).some((r) => r.includes('"d = 1"')), reasonsOf(an).join(' | '));
    });
    await section('graph point off the curve fails; invented point label fails', () => {
      const off = validateFigure(graph({ points: [{ x: PI / 4, y: 3.2 }] }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(off).some((r) => r.includes('not on any plotted function')), reasonsOf(off).join(' | '));
      const lab = validateFigure(graph({ points: [{ x: PI / 4, y: 4, label: 'max = 4' }] }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(lab).some((r) => r.includes('label')), reasonsOf(lab).join(' | '));
      const inv = validateFigure(graph({ points: [{ x: 0, y: 3.7 }] }), { problemText: P8, claims: [] });
      assert.equal(inv.ok, false);          // an axis position alone is not an intercept
      const yi = validateFigure(graph({ points: [{ x: 0, y: 1 }, { x: PI / 2, y: 1 }] }), { problemText: P8, claims: [] });
      assert.equal(yi.ok, true);            // the curve's own y-intercept / midline crossing
    });

    // 2026-10-21 (GAC acceptance round 3, hw-10 build notes) — four figure failures with structural causes.
    await section('a function written with the sheet\'s π is read as pi', () => {
      const P8c = 'The graph of y = a cos(bx) + d is shown. [Graph: A grid with x from 0 to 8 and y from 0 to 6. The curve starts at (0, 1), rises to a maximum at (2, 5), falls to a minimum at (4, 1).] (a) Find a, b, and d.';
      const g = (fn: string): Fig => ({ action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [0, 8], yRange: [0, 6], functions: [{ fn }], points: [{ x: 0, y: 1 }, { x: 2, y: 5 }, { x: 4, y: 1 }] } as never });
      assert.deepEqual(validateFigure(g('-2cos(πx/2)+3'), { problemText: P8c, claims: [] }), { ok: true });
      assert.deepEqual(validateFigure(g('3 - 2cos((π/2)x)'), { problemText: P8c, claims: [] }), { ok: true });
      assert.equal(validateFigure(g('2cos(πx/2)+3'), { problemText: P8c, claims: [] }).ok, false, 'the wrong curve still fails');
    });
    await section('a caption-like label (words only, not on the sheet) is dropped, never a failure; a value label still fails', async () => {
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const cap = { ...goodFig(), steps: [...goodFig().steps, { id: 'tri', kind: 'polygon', vertices: ['A', 'B', 'C'], label: 'Triangle with a parallel cut' }] } as Fig;
      assert.deepEqual(validateFigure(cap, { problemText: P5, claims }), { ok: true });
      const out = normalizeFigureDisplay(cap, P5) as { steps: Array<{ id: string; label?: string }> };
      assert.equal(out.steps.find((s) => s.id === 'tri')?.label, undefined, 'the caption is gone from the stored figure');
      assert.equal(validateFigure(goodFig('DB = 9'), { problemText: P5, claims }).ok, false, 'a computed value is still a failure');
      const two = { ...goodFig(), steps: [...goodFig().steps, { id: 'tri', kind: 'polygon', vertices: ['A', 'B', 'C'], label: 'Answer here' }] } as Fig;
      assert.equal(validateFigure(two, { problemText: P5, claims }).ok, false, 'two words are a label, not a caption');
      assert.equal(validateFigure(goodFig('DB = the rest'), { problemText: P5, claims }).ok, false, 'a relation is a label, not a caption');
    });
    await section('a dropped caption on a helper point: normalising twice equals normalising once (final review, F8-cache)', async () => {
      // The runner normalises a cached figure that was normalised when built;
      // the second pass must not hide a helper letter the first pass left shown.
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const g = goodFig();
      const cap = { ...g, given: [...g.given, { id: 'P1', kind: 'point', x: 1, y: 1, label: 'the helper point here' }] } as Fig;
      const once = normalizeFigureDisplay(cap, P5);
      assert.deepEqual(normalizeFigureDisplay(once, P5), once);
      const p1 = (once as unknown as { given: Array<{ id: string; label?: string }> }).given.find((o) => o.id === 'P1');
      assert.equal(p1?.label, '', 'the helper the sheet never names is unlettered on pass 1');
    });
    await section('hw-13 p4: a stored figure keeps the sheet\'s length labels even when the drawing is not to scale', async () => {
      // GAC acceptance 2026-10-22: the pyramid's slant height "13" vanished —
      // the solver drops a numeric segment label that disagrees with the drawn
      // length by >5 % (a live-board guard against tutor mislabels). A sheet
      // figure in oblique projection is never to scale; its labels are the
      // sheet's and stay. normalizeFigureDisplay marks the figure keepLabels.
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const { solveGeometry } = await import('../src/lib/tutor/diagrams/geometry-solver');
      const text = 'A square pyramid has base edge 10 cm and slant height 13 cm. [Figure: a square pyramid; the slant segment from the apex to the midpoint M of an edge is labelled 13.] (a) Find the height h.';
      const fig = { action: 'showGeometryConstructed', given: [{ id: 'P', kind: 'point', x: 7, y: 12 }, { id: 'M', kind: 'point', x: 12, y: 2, label: 'M' }], steps: [{ id: 'sPM', kind: 'segment', from: 'P', to: 'M', label: '13' }] } as unknown as Fig;
      const stored = normalizeFigureDisplay(fig, text) as { display?: Record<string, unknown>; given: Array<{ id: string; label?: string }> };
      assert.equal(stored.display?.keepLabels, true);
      const solved = solveGeometry({ given: stored.given, steps: (stored as unknown as Fig & { steps: unknown[] }).steps, display: stored.display } as never);
      assert.equal(solved.segments[0].label, '13', 'the label survives the length check');
      const live = solveGeometry({ given: fig.given, steps: (fig as unknown as { steps: unknown[] }).steps } as never);
      assert.equal(live.segments[0].label, undefined, 'the live board (no keepLabels) still drops it');
      // The given point P has no label key and the text names no point P
      // ("A square pyramid" is an article, not a point): it is drawn unlettered.
      assert.equal(stored.given.find((g) => g.id === 'P')?.label, '', 'an unnamed given point is blanked');
      assert.equal(stored.given.find((g) => g.id === 'M')?.label, 'M');
      const art = normalizeFigureDisplay({ ...fig, given: [{ id: 'A', kind: 'point', x: 0, y: 0 }] } as never, text) as { given: Array<{ id: string; label?: string }> };
      assert.equal(art.given[0].label, '', 'the article "A" at the start of a sentence is not the point A');
    });
    await section('hw-13 p1: an angle label on a bare point is rejected — it belongs on an angle marker', () => {
      // GAC acceptance 2026-10-22: "(3x − 5)°" was drawn as a free-floating
      // labelled point near C instead of the angle at C, so the figure showed
      // an angle nobody could read. A label with a degree sign is an angle.
      const text = 'Lines p ∥ q. [Figure: The label (3x − 5)° is printed inside the triangle near C. The angle labelled 55° has its arc at A.] (a) Find x.';
      const bad = { ...goodFig(), steps: [...goodFig().steps, { id: 't', kind: 'point', x: 1, y: 0.5, label: '(3x − 5)°' }] } as Fig;
      const v = validateFigure(bad, { problemText: text, claims: [] });
      assert.equal(v.ok, false);
      assert.match(reasonsOf(v).join('; '), /angle label "\(3x − 5\)°" is on a bare point; attach it to an angle_marker at its vertex/);
      const good = { ...goodFig(), steps: [...goodFig().steps, { id: 'm', kind: 'angle_marker', vertex: 'C', from: 'A', to: 'B', style: 'arc', label: '(3x − 5)°' }] } as Fig;
      assert.ok(!reasonsOf(validateFigure(good, { problemText: text, claims: [] })).some((r) => /bare point/.test(r)));
    });
    await section('a claim naming a prose word (apex, center) instead of a point id is skipped; a missing letter id still fails', () => {
      const pts = { A: { x: 0, y: 0 }, B: { x: 4, y: 0 }, C: { x: 0, y: 3 } };
      assert.deepEqual(checkClaims(pts, {}, [{ kind: 'perpendicular', a: ['apex', 'center'], b: ['center', 'edge'] }]), []);
      assert.deepEqual(checkClaims(pts, {}, [{ kind: 'on_segment', point: 'centre', segment: ['A', 'B'] }]), []);
      assert.match(checkClaims(pts, {}, [{ kind: 'on_segment', point: 'D', segment: ['A', 'B'] }])[0], /no such point/);
      assert.match(checkClaims(pts, {}, [{ kind: 'between', point: 'P1', ends: ['A', 'B'] }])[0], /no such point/);
    });
    await section('a solver crash names the step, so the retry can fix it', () => {
      const bad = { ...goodFig(), steps: [...goodFig().steps, { id: 'T', kind: 'translate_point', point: 'A', dx: 1, dy: 1 }] } as Fig;
      const r = reasonsOf(validateFigure(bad, { problemText: P5, claims }));
      assert.equal(r.length, 1, r.join(' | '));
      assert.match(r[0], /translate_point "T"/);
      assert.match(r[0], /by/);
      assert.doesNotMatch(r[0], /undefined/);
      const unknown = { ...goodFig(), steps: [...goodFig().steps, { id: 'M', kind: 'midpoint', of: ['A', 'Z'] }] } as Fig;
      assert.match(reasonsOf(validateFigure(unknown, { problemText: P5, claims }))[0], /midpoint "M"/);
    });

    // 2026-10-21 round 4 (hw-11 build notes).
    await section('a hyphenated caption is still a caption; "circle A" is the circle centred at A; two circles on A are ambiguous', async () => {
      const { isCaptionLabel } = await import('../src/lib/tutor/homework-build/figure-validate');
      assert.equal(isCaptionLabel('Square ABCD with two quarter-circle arcs'), true);
      assert.equal(isCaptionLabel('x - 5'), false);
      const P = 'ABCD is a square with side 10 cm. Arcs BD are quarter circles centered at A and C. [Figure: square ABCD, arcs from B to D centred at A and at C.]';
      const sq: Fig = { action: 'showGeometryConstructed', given: [pt('A', 0, 0), pt('B', 10, 0), pt('C', 10, 10), pt('D', 0, 10)],
        steps: [{ id: 'cA', kind: 'circle', center: 'A', radius: 10 }, { id: 'cC', kind: 'circle', center: 'C', radius: 10 }] };
      const cl = [{ kind: 'on_circle' as const, point: 'B', circle: 'A' }, { kind: 'on_circle' as const, point: 'D', circle: 'C' }];
      assert.deepEqual(validateFigure(sq, { problemText: P, claims: cl }), { ok: true });
      const far: Fig = { ...sq, given: [pt('A', 0, 0), pt('B', 10, 0), pt('C', 10, 10), pt('D', 0, 12)] };
      assert.ok(reasonsOf(validateFigure(far, { problemText: P, claims: cl })).some((r) => /on_circle D/.test(r)), 'the alias is checked, not skipped');
      const two: Fig = { ...sq, steps: [...sq.steps, { id: 'cA2', kind: 'circle', center: 'A', radius: 5 }] };
      assert.ok(reasonsOf(validateFigure(two, { problemText: P, claims: cl })).some((r) => /no such circle/.test(r)));
    });
    await section('a graph with a field the board cannot draw (segments) fails, saying what a graph holds', () => {
      const g = graph({ segments: [{ from: [9, 2], to: [18, 2] }] } as never);
      const r = reasonsOf(validateFigure(g, { problemText: P8, claims: [] }));
      assert.ok(r.some((x) => /"segments" cannot be drawn/.test(x)), r.join(' | '));
    });
    await section('figureToSvg: a geometry figure gives one svg document; a graph or a bad spec gives null', async () => {
      const { figureToSvg } = await import('../src/lib/tutor/homework-build/figure-svg');
      const svg = await figureToSvg({ ...goodFig(), display: { grid: false, axes: false } } as Fig);   // as stored: normalizeFigureDisplay turns the plane off
      assert.ok(svg && svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') && svg.endsWith('</svg>'), String(svg).slice(0, 120));
      const vb = /viewBox="([^"]+)"/.exec(svg!)![1].split(' ').map(Number);
      assert.ok(vb[2] < 500 || vb[3] < 400, `cropped to the content, not the canvas: ${vb.join(' ')}`);
      assert.ok(vb[2] > 100 && vb[3] > 100, `a real box: ${vb.join(' ')}`);
      assert.ok(!/<svg[^>]* (class|style)=/.test(svg!), 'no sizing classes on the root');
      assert.ok(svg!.includes('DE = 9') && svg!.includes('>A<'), 'labels are drawn');
      const gs = await figureToSvg({ action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [0, 6.4], yRange: [-4, 2], xAxisStep: 'pi/4', yAxisStep: 1, functions: [{ expression: '2.25*sin(x - pi/4) - 1.25' }], points: [{ x: 0, y: 1, label: 'P' }] } as never });
      assert.ok(gs && gs.startsWith('<svg xmlns=') && gs.includes('<path d="M') && gs.includes('π/4') && gs.includes('>P<'), String(gs).slice(0, 200));
      const { graphToSvg } = await import('../src/lib/tutor/homework-build/graph-svg');
      assert.equal(graphToSvg({ xRange: [1, 0], yRange: [0, 1] } as never), null, 'an empty range gives nothing');
      assert.ok(graphToSvg({ xLabel: '', yLabel: '', xRange: [-5, 5], yRange: [-5, 5], functions: [{ fn: '1/x' }] } as never)!.includes('<path'), 'a pole breaks the path, never the svg');
      assert.equal(await figureToSvg({ action: 'showGeometryConstructed', given: [], steps: [{ id: 'M', kind: 'midpoint', of: ['A', 'Z'] }] } as Fig), null);
      assert.equal(await figureToSvg(null), null);
    });
    await section('figureToSvg (hw-14b p3, G3): a 125-unit-wide figure keeps its edge label "60 m" and the 40° arc inside the thumbnail', async () => {
      // The stored lighthouse figure (hw14b-dump n=3). With ± 1.5 units of padding (≈ 1 % of the width)
      // the content crop met the canvas edge at x = 0 and whatever sat left of T/B was cut off.
      const { figureToSvg } = await import('../src/lib/tutor/homework-build/figure-svg');
      const fig = {"action":"showGeometryConstructed","given":[{"id":"B","kind":"point","x":0,"y":0,"label":""},{"id":"T","kind":"point","x":0,"y":60,"label":""},{"id":"A","kind":"point","x":71.5,"y":0,"label":""},{"id":"C","kind":"point","x":112.8,"y":0,"label":""},{"id":"H","kind":"point","x":125,"y":60,"label":""}],"steps":[{"id":"sTB","kind":"segment","from":"B","to":"T","label":"60 m"},{"id":"sBC","kind":"segment","from":"B","to":"C"},{"id":"sTA","kind":"segment","from":"T","to":"A"},{"id":"sTC","kind":"segment","from":"T","to":"C"},{"id":"sTH","kind":"segment","from":"T","to":"H"},{"id":"m1","kind":"angle_marker","vertex":"T","from":"H","to":"A","style":"arc","label":"40°"},{"id":"m2","kind":"angle_marker","vertex":"T","from":"H","to":"C","style":"arc","label":"28°"},{"id":"m3","kind":"angle_marker","vertex":"B","from":"T","to":"A","style":"right"}],"display":{"grid":false,"axes":false,"keepLabels":true}} as Fig;
      const svg = await figureToSvg(fig);
      assert.ok(svg, 'the figure renders');
      const [vx, vy, vw, vh] = /viewBox="([^"]+)"/.exec(svg!)![1].split(' ').map(Number);
      const textAt = (label: string) => {
        const m = new RegExp(`<text x="([^"]+)" y="([^"]+)"[^>]*>${label}</text>`).exec(svg!);
        assert.ok(m, `a <text> for ${label}`);
        return { x: Number(m![1]), y: Number(m![2]) };
      };
      const m60 = textAt('60 m');
      assert.ok(m60.x >= vx, `"60 m" at x ${m60.x} is right of the viewBox x ${vx}`);
      const a40 = textAt('40°');
      assert.ok(a40.x >= vx && a40.x <= vx + vw && a40.y >= vy && a40.y <= vy + vh, `40° at (${a40.x}, ${a40.y}) inside ${[vx, vy, vw, vh].join(' ')}`);
      // The crop has room on every side: it is not clamped to the canvas edge.
      assert.ok(vx > 0 && vy > 0 && vx + vw < 500 && vy + vh < 400, `the content box is not clamped by the canvas: ${[vx, vy, vw, vh].join(' ')}`);
      // Every point dot (cx − r) sits inside the viewBox with a margin.
      for (const c of svg!.matchAll(/<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"[^>]*data-feature="point-/g)) {
        const [cx, cy, r] = [Number(c[1]), Number(c[2]), Number(c[3])];
        assert.ok(cx - r >= vx + 4 && cy - r >= vy + 4 && cx + r <= vx + vw - 4 && cy + r <= vy + vh - 4, `point dot at (${cx}, ${cy}) inside ${[vx, vy, vw, vh].join(' ')}`);
      }
    });
    await section('figureToSvg (hw-14b p5, G5): a region shades the circle minus the inner square as one evenodd path; the inner square is unfilled; a figure with no regions renders byte-identically', async () => {
      // The stored p5 figure (hw14b-dump n=5): the sheet shades the four circular
      // segments between the circle and the inner square; the inner square was a
      // filled polygon, so the thumbnail and the board shaded the wrong region.
      const { figureToSvg } = await import('../src/lib/tutor/homework-build/figure-svg');
      const { renderToStaticMarkup } = await import('react-dom/server');
      const { createHash } = await import('node:crypto');
      const { renderGeometryTree } = await import('../src/app/tutor/components/whiteboard/GeometryRenderer');
      const { GEOMETRY_FREEZE_EXPECTED, GEOMETRY_FREEZE_FIXTURE } = await import('./fixtures/geometry-freeze-fixture');
      const stored = JSON.parse('{"action":"showGeometryConstructed","given":[{"id":"A","kind":"point","x":0,"y":0,"label":""},{"id":"B","kind":"point","x":12,"y":0,"label":""},{"id":"C","kind":"point","x":12,"y":12,"label":""},{"id":"D","kind":"point","x":0,"y":12,"label":""},{"id":"O","kind":"point","x":6,"y":6,"label":""},{"id":"c1","kind":"circle","center":"O","radius":6}],"steps":[{"id":"sAB","kind":"segment","from":"A","to":"B","label":"12 cm"},{"id":"sBC","kind":"segment","from":"B","to":"C"},{"id":"sCD","kind":"segment","from":"C","to":"D"},{"id":"sDA","kind":"segment","from":"D","to":"A"},{"id":"P","kind":"midpoint","of":"sAB","label":""},{"id":"Q","kind":"midpoint","of":"sBC","label":""},{"id":"R","kind":"midpoint","of":"sCD","label":""},{"id":"S","kind":"midpoint","of":"sDA","label":""},{"id":"inner","kind":"polygon","vertices":["P","Q","R","S"]}],"display":{"grid":false,"axes":false,"keepLabels":true}}') as Fig & { steps: Array<Record<string, unknown>> };
      const fig = { ...stored, steps: [...stored.steps.map((s) => (s.id === 'inner' ? { ...s, fill: 'none' } : s)), { id: 'shade', kind: 'region', outer: 'c1', inner: ['inner'] }] } as Fig;
      const svg = await figureToSvg(fig);
      assert.ok(svg, 'the figure renders');
      const region = /<path d="([^"]+)" fill-rule="evenodd" fill="#4f8cff" fill-opacity="0.25" stroke="none"><\/path>/.exec(svg!);
      assert.ok(region, `one evenodd region path: ${svg!.slice(0, 400)}`);
      const d = region![1];
      assert.equal((d.match(/M/g) ?? []).length, 2, 'two rings: the circle and the square hole');
      assert.equal((d.match(/Z/g) ?? []).length, 2, 'both rings closed');
      // 48 circle samples (47 L after the M) + the 4-vertex hole (3 L after its M).
      assert.equal((d.match(/L/g) ?? []).length, 47 + 3, d.slice(0, 200));
      // The inner square is drawn with no fill and no fill-opacity; the region is drawn before it.
      const inner = /<path d="M[^"]+ Z" fill="none" stroke="#4f8cff" stroke-width="2"><\/path>/.exec(svg!);
      assert.ok(inner, 'the inner square path has fill="none" and no fill-opacity');
      assert.ok(region!.index < inner!.index, 'the region is painted before the polygons');
      assert.ok(!/fill="#4f8cff" fill-opacity="0.15"/.test(svg!), 'no 15 %-filled polygon remains');
      // The samples are named after the CIRCLE (`c1_r0..47`, geometry-solver solveRegion), not the
      // region, and featSlug writes the id's underscore as a hyphen: an un-hidden sample's dot is
      // data-feature="point-c1-r9" (checked by un-hiding them: this assertion then fails).
      assert.ok(!/point-c1-r\d+/.test(svg!), 'the 48 circle samples are hidden helpers, never dots');
      assert.ok(!/data-feature="point-[^"]*-r\d+"/.test(svg!), 'no sample of any circle is a dot');
      assert.ok(/<ellipse cx="[^"]+" cy="[^"]+" rx="[^"]+" ry="[^"]+" fill="none"/.test(svg!), 'the circle outline is still drawn');
      // Engine freeze (controller ruling R1): a geometry with no regions and no polygon fill is byte-identical.
      const html = renderToStaticMarkup(renderGeometryTree(GEOMETRY_FREEZE_FIXTURE));
      assert.equal(html.length, GEOMETRY_FREEZE_EXPECTED.markupLength);
      assert.equal(createHash('sha256').update(html).digest('hex'), GEOMETRY_FREEZE_EXPECTED.markupSha256, 'the no-region render is unchanged');
      const filled = renderToStaticMarkup(renderGeometryTree({ ...GEOMETRY_FREEZE_FIXTURE, polygons: [{ vertices: ['A', 'B', 'C'] }] }));
      assert.ok(filled.includes('fill="#4f8cff" fill-opacity="0.15"'), 'a polygon without fill still fills 15 % as before');
    });
    await section('figureToSvg: the minimum new-kind set gives an svg document', async () => {
      const { figureToSvg, FIGURE_SVG_MAX_CHARS } = await import('../src/lib/tutor/homework-build/figure-svg');
      const F = await import('./fixtures/homework-figure-fixtures');
      const cases: Array<[string, Fig]> = [
        ['boxplot', F.boxFig()], ['boxplot hw-11 p6', F.hw11p6Fig()], ['histogram', F.histFig()], ['dotplot', F.dotFig()],
        ['bar', F.barFig()], ['table', F.tableFig()], ['number line', F.nlFig()], ['solid_3d cone', F.coneFig()],
        ['pie', F.pieFig()], ['scatter', F.scatFig()],
      ];
      const out: Record<string, string> = {};
      for (const [id, fig] of cases) {
        const svg = await figureToSvg(fig);
        assert.ok(svg && /^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && /viewBox=/.test(svg) && !/^<svg[^>]* (class|style)=/.test(svg) && svg.endsWith('</svg>'), `${id}: ${String(svg).slice(0, 120)}`);
        assert.ok(svg.length <= FIGURE_SVG_MAX_CHARS, id);
        assert.equal(await figureToSvg(fig), svg, `${id}: deterministic`);
        assert.ok(!/NaN|undefined|Infinity/.test(svg), `${id}: no NaN/undefined in the markup`);
        out[id] = svg;
      }
      assert.ok(out.table.includes('>Score<') && out.table.includes('>Frequency<'), 'the table headers are drawn');
      assert.equal((out.dotplot.match(/<circle /g) ?? []).length, 10, 'one dot per value');
      assert.ok(out.boxplot.includes('<rect') && out.boxplot.includes('>Homework Minutes<'), 'the box and its title');
      assert.equal((out.histogram.match(/data-bar=/g) ?? []).length, 5, 'one bar per bin');
      assert.equal((out.bar.match(/data-bar=/g) ?? []).length, 3, 'one bar per category');
      assert.ok(out.bar.includes('>Apple<') && out.bar.includes('>Cherry<'), 'category labels');
      assert.ok(out['solid_3d cone'].includes('r=4') && out['solid_3d cone'].includes('h=9'), 'the cone carries its stated dims');
      assert.equal((out.pie.match(/data-wedge=/g) ?? []).length, 3, 'one wedge per slice');
      assert.equal((out.scatter.match(/<circle /g) ?? []).length, 5, 'one dot per point');
      // Number line: the interval ends at max, so it is a ray (an arrow to the edge), with no circle at 5; one open circle at −2.
      const nl = out['number line'];
      assert.equal((nl.match(/<circle /g) ?? []).length, 1, `one circle (the open −2), none at the ray's end: ${nl}`);
      assert.ok(/<circle [^>]*fill="#ffffff"/.test(nl), 'the −2 circle is open');
      assert.ok(nl.includes('data-ray="right"'), 'the interval runs off the right edge as a ray');
      // A closed interval inside the line draws both ends as circles.
      const closed = await figureToSvg({ action: 'showNumberLine', min: 0, max: 10, step: 1, intervals: [{ from: 2, to: 7, fromInclusive: true, toInclusive: false }] } as Fig);
      assert.equal((closed!.match(/<circle /g) ?? []).length, 2, 'both ends of an inner interval');
      assert.ok(!closed!.includes('data-ray='), 'no ray');
    });
    await section('figureToSvg: a 40-row table keeps 6 rows plus one … row; text is escaped; pie/scatter never reject; a malformed figure gives null', async () => {
      const { figureToSvg, FIGURE_SVG_MAX_CHARS } = await import('../src/lib/tutor/homework-build/figure-svg');
      const rows = Array.from({ length: 40 }, (_, i) => [String(i + 1), `x<${i}> & "y"`]);
      const svg = await figureToSvg({ action: 'showTable', headers: ['n', 'a<b'], rows } as Fig);
      assert.ok(svg && svg.length <= FIGURE_SVG_MAX_CHARS);
      assert.equal((svg.match(/data-row=/g) ?? []).length, 7, 'six rows and the ellipsis row');
      assert.ok(svg.includes('…') && !svg.includes('>7<'), 'row 7 is not drawn');
      assert.ok(svg.includes('a&lt;b') && svg.includes('x&lt;0&gt; &amp; &quot;y&quot;') && !svg.includes('a<b'), 'cells are XML-escaped');
      const short = await figureToSvg({ action: 'showTable', headers: ['n'], rows: [['1'], ['2']] } as Fig);
      assert.equal((short!.match(/data-row=/g) ?? []).length, 2, 'no ellipsis row when every row fits');
      for (const fig of [{ action: 'showStats', type: 'pie', pie: { slices: [{ label: 'A', value: 0 }] } }, { action: 'showStats', type: 'pie' }, { action: 'showScatterPlot', points: [] }, { action: 'showScatterPlot', points: [{ x: 1, y: 1 }] }]) {
        const r = await figureToSvg(fig as unknown as Fig);
        assert.ok(r === null || typeof r === 'string', JSON.stringify(fig));
      }
      for (const bad of [
        { action: 'showStats', type: 'boxplot', boxplot: {} },
        { action: 'showStats', type: 'histogram', bins: 'x' },
        { action: 'showStats', type: 'dotplot', data: [] },
        { action: 'showStats', type: 'bar', bar: { categories: ['a'], values: [] } },
        { action: 'showTable', headers: [], rows: [] },
        { action: 'showNumberLine', min: 5, max: 1 },
        { action: 'showDiagram', type: 'solid_3d', params: { shape: 'blob' } },
        { action: 'showDiagram', type: 'solid_3d', params: { shape: 'cone', dims: { radius: 4 } } },
        { action: 'showDiagram', type: 'tape_diagram', params: {} },
      ]) assert.equal(await figureToSvg(bad as unknown as Fig), null, JSON.stringify(bad));
    });
    await section('figureToSvg: Venn and tree thumbnails draw the stated figure, escape text, and never throw', async () => {
      const { figureToSvg, FIGURE_SVG_MAX_CHARS } = await import('../src/lib/tutor/homework-build/figure-svg');
      const F = await import('./fixtures/homework-figure-fixtures');
      const shape = (svg: string | null, id: string) => {
        assert.ok(svg && /^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && /viewBox=/.test(svg) && svg.endsWith('</svg>'), `${id}: ${String(svg).slice(0, 120)}`);
        assert.ok(svg.length <= FIGURE_SVG_MAX_CHARS && !/NaN|undefined|Infinity/.test(svg), id);
        return svg;
      };
      const venn = shape(await figureToSvg(F.vennFig()), 'venn');
      assert.equal((venn.match(/data-set=/g) ?? []).length, 2, 'two circles');
      assert.ok(venn.includes('>Soccer<') && venn.includes('>Band<'), 'set labels');
      for (const v of ['8', '5', '10', '7']) assert.ok(venn.includes(`>${v}<`), `region value ${v}`);
      assert.equal(await figureToSvg(F.vennFig()), venn, 'deterministic');
      const venn3 = shape(await figureToSvg(F.venn3Fig()), 'venn3');
      assert.equal((venn3.match(/data-set=/g) ?? []).length, 3, 'three circles');
      const tree = shape(await figureToSvg(F.treeFig()), 'tree');
      assert.equal((tree.match(/data-node=/g) ?? []).length, 7, 'root, two, four');
      assert.equal((tree.match(/data-branch=/g) ?? []).length, 6, 'one line per branch');
      for (const p of ['2/5', '3/5', '1/4', '3/4', '2/4']) assert.ok(tree.includes(`>${p}<`), `branch probability ${p}`);
      // Leaf products are never drawn by the thumbnail (showLeafProbabilities passes only when stated; the board draws them).
      assert.ok(!tree.includes('1/10'), 'no computed product');
      const esc = shape(await figureToSvg({ action: 'showVennDiagram', title: 'a<b', sets: [{ label: 'x & "y"' }, { label: "<z>" }], regions: { onlyA: { items: ['<i>'] } } } as unknown as Fig), 'escaped venn');
      assert.ok(esc.includes('x &amp; &quot;y&quot;') && esc.includes('&lt;z&gt;') && esc.includes('&lt;i&gt;') && !esc.includes('<z>') && !esc.includes('<i>'), 'venn text escaped');
      const escT = shape(await figureToSvg({ action: 'showTree', root: { label: '<r>', children: [{ label: 'a&b', probability: '1/2', node: { label: '"n"' } }] } } as unknown as Fig), 'escaped tree');
      assert.ok(escT.includes('&lt;r&gt;') && escT.includes('a&amp;b') && escT.includes('&quot;n&quot;') && !escT.includes('<r>'), 'tree text escaped');
      for (const bad of [
        { action: 'showVennDiagram' }, { action: 'showVennDiagram', sets: 'x' }, { action: 'showVennDiagram', sets: [{ label: 'A' }], regions: null },
        { action: 'showVennDiagram', sets: [null, 5], regions: { onlyA: null, ABC: { items: 'x' } } },
        { action: 'showTree' }, { action: 'showTree', root: null }, { action: 'showTree', root: { children: 'x' } },
        { action: 'showTree', root: { label: 7, children: [null, { node: null }, { probability: 0.5, node: { label: 'a' } }] } },
      ]) {
        const r = await figureToSvg(bad as unknown as Fig);
        assert.ok(r === null || typeof r === 'string', JSON.stringify(bad));
      }
      // A very deep or wide tree is drawn bounded (the svg cap holds).
      let deep: Record<string, unknown> = { label: 'leaf' };
      for (let i = 0; i < 30; i++) deep = { label: `n${i}`, children: Array.from({ length: 2 }, () => ({ label: 'b', probability: '1/2', node: deep })) };
      const big = await figureToSvg({ action: 'showTree', root: deep } as unknown as Fig);
      assert.ok(big === null || big.length <= FIGURE_SVG_MAX_CHARS, 'bounded');
    });
    await section('figureToSvg: fraction bar, tape and area model thumbnails draw the stated figure, escape text, and never throw', async () => {
      const { figureToSvg, FIGURE_SVG_MAX_CHARS } = await import('../src/lib/tutor/homework-build/figure-svg');
      const F = await import('./fixtures/homework-figure-fixtures');
      const shape = (svg: string | null, id: string) => {
        assert.ok(svg && /^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && /viewBox=/.test(svg) && svg.endsWith('</svg>'), `${id}: ${String(svg).slice(0, 120)}`);
        assert.ok(svg.length <= FIGURE_SVG_MAX_CHARS && !/NaN|undefined|Infinity/.test(svg), id);
        return svg;
      };
      const frac = shape(await figureToSvg(F.fracFig()), 'fraction bar');
      assert.equal((frac.match(/data-part=/g) ?? []).length, 7, 'four parts and three parts');
      assert.equal((frac.match(/data-shaded="1"/g) ?? []).length, 5, 'three shaded and two shaded');
      assert.ok(frac.includes('>3/4<') && frac.includes('>2/3<'), 'default labels are the stated fractions');
      assert.equal(await figureToSvg(F.fracFig()), frac, 'deterministic');
      const circ = shape(await figureToSvg({ action: 'showFractionBar', items: [{ numerator: 1, denominator: 3, style: 'circle' }, { numerator: 2, denominator: 4, style: 'grid' }] } as unknown as Fig), 'circle + grid');
      assert.equal((circ.match(/data-part=/g) ?? []).length, 7);
      const tape = shape(await figureToSvg(F.tapeFig()), 'tape');
      assert.equal((tape.match(/data-segment=/g) ?? []).length, 3, 'three segments');
      assert.equal((tape.match(/>x</g) ?? []).length, 3, 'each part labelled x');
      assert.ok(tape.includes('>24<'), 'the stated total');
      assert.ok(!tape.includes('>8<'), 'no computed part');
      const area = shape(await figureToSvg(F.areaFig()), 'area');
      assert.equal((area.match(/data-cell=/g) ?? []).length, 4, 'two by two');
      for (const v of ['20', '3', '10', '4']) assert.ok(area.includes(`>${v}<`), `side ${v}`);
      for (const p of ['200', '80', '30', '12']) assert.ok(!area.includes(`>${p}<`), `no product ${p} with showProducts false`);
      const withP = shape(await figureToSvg({ action: 'showDiagram', type: 'area_model', params: { rows: [20, 3], cols: [10, 4] } } as unknown as Fig), 'area products');
      for (const p of ['200', '80', '30', '12']) assert.ok(withP.includes(`>${p}<`), `stated product ${p} drawn as the board does`);
      const escF = shape(await figureToSvg({ action: 'showFractionBar', title: 'a<b', items: [{ numerator: 1, denominator: 2, label: 'x & "y"' }] } as unknown as Fig), 'escaped frac');
      assert.ok(escF.includes('x &amp; &quot;y&quot;') && escF.includes('a&lt;b') && !escF.includes('a<b'), 'frac text escaped');
      const escT = shape(await figureToSvg({ action: 'showDiagram', type: 'tape_diagram', params: { title: '<t>', bars: [{ name: '<n>', segments: [{ length: 2, label: 'a&b' }], totalLabel: '"z"' }] } } as unknown as Fig), 'escaped tape');
      assert.ok(escT.includes('&lt;t&gt;') && escT.includes('&lt;n&gt;') && escT.includes('a&amp;b') && escT.includes('&quot;z&quot;') && !escT.includes('<n>'), 'tape text escaped');
      const escA = shape(await figureToSvg({ action: 'showDiagram', type: 'area_model', params: { rows: [1], cols: [1], cellLabels: [['<c>']] } } as unknown as Fig), 'escaped area');
      assert.ok(escA.includes('&lt;c&gt;') && !escA.includes('<c>'), 'area text escaped');
      for (const bad of [
        { action: 'showFractionBar' }, { action: 'showFractionBar', items: 'x' }, { action: 'showFractionBar', items: [null, { numerator: 'a', denominator: 0 }] },
        { action: 'showFractionBar', items: [{ numerator: 3, denominator: 1e9 }] },
        { action: 'showDiagram', type: 'tape_diagram', params: { bars: [null, { segments: 'x' }] } },
        { action: 'showDiagram', type: 'tape_diagram', params: { bars: Array.from({ length: 500 }, () => ({ segments: Array.from({ length: 500 }, () => ({ length: 1, label: 'x' })) })) } },
        { action: 'showDiagram', type: 'area_model', params: { rows: [0], cols: 'x' } },
        { action: 'showDiagram', type: 'area_model', params: { rows: Array(400).fill(1), cols: Array(400).fill(1) } },
      ]) {
        const r = await figureToSvg(bad as unknown as Fig);
        assert.ok(r === null || (typeof r === 'string' && r.length <= FIGURE_SVG_MAX_CHARS), JSON.stringify(bad).slice(0, 80));
      }
    });
    await section('graph svg (hw-14 p8, F8): y tick labels stay inside the plot when the y-axis is at the left edge', async () => {
      // The plot is clipped to x ≥ M.l (44). With xRange [0, 360] the y-axis sits
      // on that edge, so labels drawn right-aligned at axisX − 6 were clipped away.
      const { graphToSvg } = await import('../src/lib/tutor/homework-build/graph-svg');
      const yLabels = (svg: string) => [...svg.matchAll(/<text x="([-\d.]+)" y="[-\d.]+" text-anchor="(start|end)" font-size="11"[^>]*>([^<]+)<\/text>/g)]
        .map((m) => ({ x: Number(m[1]), anchor: m[2], text: m[3] }));
      const left = (l: { x: number; anchor: string; text: string }) => (l.anchor === 'end' ? l.x - 7 * l.text.length : l.x);
      const svg = graphToSvg(hw14p8Fig().data as never)!;
      const ys = yLabels(svg);
      for (const t of ['3', '-2']) {
        const l = ys.find((y) => y.text === t);
        assert.ok(l, `y label ${t} drawn: ${JSON.stringify(ys)}`);
        assert.ok(l!.x >= 0 && left(l!) >= 44, `y label ${t} inside the plot: ${JSON.stringify(l)}`);
      }
      // A graph whose y-axis is mid-plot keeps its labels right-aligned left of the axis.
      const mid = yLabels(graphToSvg({ xLabel: '', yLabel: '', xRange: [-5, 5], yRange: [-5, 5], functions: [{ fn: 'x' }] } as never)!);
      assert.ok(mid.length > 0 && mid.every((l) => l.anchor === 'end' && l.x === 258), JSON.stringify(mid.slice(0, 2)));
    });

    await section('vocabulary: env, kind ids, gate', async () => {
      const { figureVocabularyFromEnv, figureKindId, isFigureKindAllowed } = await import('../src/lib/tutor/homework-build/figure-vocabulary');
      const warn = console.warn; const warned: string[] = [];
      console.warn = (...a: unknown[]) => { warned.push(a.map(String).join(' ')); };
      try {
        assert.equal(figureVocabularyFromEnv({}), 'all');
        assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'all' }), 'all');
        assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: ' Geometry ' }), 'geometry');
        assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'ALL' }), 'all');
        assert.equal(warned.length, 0, warned.join('\n'));
        assert.equal(figureVocabularyFromEnv({ HOMEWORK_FIGURE_KINDS: 'nonsense' }), 'all');   // default ON
        assert.deepEqual(warned, ['[homework-build] HOMEWORK_FIGURE_KINDS="nonsense" not recognised, using all']);
      } finally { console.warn = warn; }
      assert.equal(figureKindId({ action: 'showStats', type: 'boxplot' }), 'showStats:boxplot');
      assert.equal(figureKindId({ action: 'showDiagram', type: 'solid_3d' }), 'showDiagram:solid_3d');
      assert.equal(figureKindId({ action: 'showTable' }), 'showTable');
      assert.ok(isFigureKindAllowed('showGraph', 'geometry') && isFigureKindAllowed('showGeometryConstructed', 'geometry'));
      assert.ok(isFigureKindAllowed('showGraph', 'all') && isFigureKindAllowed('showGeometryConstructed', 'all'));
      assert.ok(!isFigureKindAllowed('showMolecule', 'all') && !isFigureKindAllowed('showMolecule', 'geometry'));
      const v = validateFigure({ action: 'showMolecule' } as never, { problemText: 'x', claims: [] });
      assert.deepEqual(v, { ok: false, reasons: ['unsupported figure kind "showMolecule"'] });
      // The catalog transformation kind is not in the vocabulary (controller ruling).
      assert.deepEqual(validateFigure({ action: 'showDiagram', type: 'transformation', params: {} } as never, { problemText: 'x', claims: [] }),
        { ok: false, reasons: ['unsupported figure kind "showDiagram:transformation"'] });
      // Under geometry, a graph and a geometry figure still reach their validators (the same verdicts as under all).
      for (const [fig, text] of [[goodFig(), P5], [ws3p5Bad, P5]] as const) {
        assert.deepEqual(validateFigure(fig, { problemText: text, claims, vocabulary: 'geometry' }), validateFigure(fig, { problemText: text, claims }));
      }
      // A figure with no action is named by what it is.
      assert.deepEqual(validateFigure({} as never, { problemText: 'x', claims: [] }), { ok: false, reasons: ['unsupported figure kind "undefined"'] });
    });
    await section('vocabulary drift: docs, actions, stats types and diagram kinds agree; every diagram kind has a solver', async () => {
      const { FIGURE_ACTIONS, FIGURE_STATS_TYPES, FIGURE_DIAGRAM_KINDS, FIGURE_KIND_DOCS, isFigureKindAllowed } = await import('../src/lib/tutor/homework-build/figure-vocabulary');
      const { isImplementedKind } = await import('../src/lib/tutor/diagrams/catalog/manifest');
      assert.deepEqual(FIGURE_ACTIONS.slice(0, 2), ['showGeometryConstructed', 'showGraph']);
      assert.equal(new Set(FIGURE_KIND_DOCS.map((d) => d.id)).size, FIGURE_KIND_DOCS.length, 'doc ids are unique');
      const docsFor = (id: string) => FIGURE_KIND_DOCS.filter((d) => d.id === id || d.id.startsWith(`${id}:`));
      for (const d of FIGURE_KIND_DOCS) {
        const [action, type] = d.id.split(':');
        assert.ok(FIGURE_ACTIONS.includes(action), `doc ${d.id}: action in FIGURE_ACTIONS`);
        if (action === 'showStats') assert.ok((FIGURE_STATS_TYPES as readonly string[]).includes(type), `doc ${d.id}: type in FIGURE_STATS_TYPES`);
        if (action === 'showDiagram') assert.ok((FIGURE_DIAGRAM_KINDS as readonly string[]).includes(type), `doc ${d.id}: kind in FIGURE_DIAGRAM_KINDS`);
        assert.ok(isFigureKindAllowed(d.id, 'all') && !isFigureKindAllowed(d.id, 'geometry'), `doc ${d.id}: allowed under all only`);
      }
      for (const t of FIGURE_STATS_TYPES) assert.equal(docsFor(`showStats:${t}`).length, 1, `stats type ${t} has one doc`);
      for (const k of FIGURE_DIAGRAM_KINDS) {
        assert.equal(docsFor(`showDiagram:${k}`).length, 1, `diagram kind ${k} has one doc`);
        assert.ok(isImplementedKind(k), `diagram kind ${k} has a solver`);
      }
      assert.ok(!(FIGURE_DIAGRAM_KINDS as readonly string[]).includes('transformation'), 'transformation is dropped');
      for (const a of FIGURE_ACTIONS.slice(2)) {
        const n = docsFor(a).length;
        if (a === 'showStats' || a === 'showDiagram') assert.ok(n >= 1, `${a} has at least one doc`);
        else assert.equal(n, 1, `${a} has exactly one doc`);
      }
    });

    await section('figureBoxMode: data figures in the fixed box, tables and number lines at natural height; agrees with FIGURE_KIND_DOCS', async () => {
      const { figureBoxMode, FIGURE_BOX_MODES } = await import('../src/lib/tutor/homework-build/figure-box');
      const { FIGURE_KIND_DOCS } = await import('../src/lib/tutor/homework-build/figure-vocabulary');
      const F = await import('./fixtures/homework-figure-fixtures');
      for (const fig of [F.boxFig(), F.histFig(), F.scatFig(), F.coneFig(), F.vennFig(), F.treeFig(), F.fracFig(), F.tapeFig(), F.areaFig()]) assert.equal(figureBoxMode(fig), 'fixed', JSON.stringify(fig).slice(0, 60));
      for (const fig of [F.tableFig(), F.nlFig(), hw14p8Fig() as never]) assert.equal(figureBoxMode(fig), 'natural', JSON.stringify(fig).slice(0, 60));
      assert.equal(figureBoxMode(goodFig()), 'fixed', 'a geometry figure is in the fixed box');
      // The client-safe table cannot drift from the proposer's docs.
      assert.deepEqual(Object.fromEntries(FIGURE_KIND_DOCS.map((d) => [d.id, d.box])),
        Object.fromEntries(Object.entries(FIGURE_BOX_MODES).filter(([id]) => id !== 'showGraph' && id !== 'showGeometryConstructed')));
    });

    await section('figure kinds section: generated from the vocabulary, rules 11–12 verbatim, geometry prompt unchanged', async () => {
      const { figureProposeSystem, FIGURE_PROPOSE_SYSTEM } = await import('../src/lib/tutor/homework-build/figure-build');
      const { FIGURE_KIND_DOCS, figureKindsSection } = await import('../src/lib/tutor/homework-build/figure-vocabulary');
      const { getDiagramKind } = await import('../src/lib/tutor/diagrams/catalog/manifest');
      const { createHash } = await import('node:crypto');
      const all = figureProposeSystem('all'), geo = figureProposeSystem('geometry');
      // Kill switch: under geometry the prompt is byte-identical to the prompt before the vocabulary (2026-10-23, 11858 chars).
      assert.equal(geo.length, 11858);
      assert.equal(createHash('sha256').update(geo).digest('hex'), '176bad9a01ebce24960c78180e1549facb97aba087e650885744bf21cd3f399b');
      assert.equal(figureKindsSection('geometry'), '');
      const cut = geo.indexOf('\n\nStep reference');
      assert.ok(cut > 0);
      assert.ok(all.startsWith(geo.slice(0, cut)) && all.endsWith(geo.slice(cut)));
      assert.equal(all, geo.slice(0, cut) + figureKindsSection('all') + geo.slice(cut));
      assert.ok(all.includes('Figure kinds (figure_json holds ONE of these when the sheet\'s figure is not a geometry construction or a function graph):'));
      for (const d of FIGURE_KIND_DOCS) {
        assert.ok(all.includes(d.shape), d.id);
        assert.ok(all.includes(`- ${d.when} ${d.shape}`), `${d.id}: one line, when then shape`);
      }
      assert.ok(all.includes(getDiagramKind('solid_3d')!.paramSchema));
      assert.ok(all.includes('11. Numbers are copied from the problem text as written there. A statistic the problem asks for, or a value you would have to compute, is never drawn — leave it off and say so in note.'));
      assert.ok(all.includes('12. Pick the kind the description names; when the description names none of the kinds you have, return "" with a note.'));
      assert.ok(!geo.includes('Figure kinds') && !geo.includes('11. Numbers are copied'));
      assert.equal(FIGURE_PROPOSE_SYSTEM, all);
    });

    // ---- 3 build figure (pure: stub deps, no Mongo, no model) ----
    console.log('3 build figure');
    const { buildFigure, FIGURE_PROPOSE_SYSTEM, parseProposal, normalizeClaims } = await import('../src/lib/tutor/homework-build/figure-build');
    type Deps = Parameters<typeof buildFigure>[1];
    const mkDeps = (propose: Deps['propose'], extra: FigureClaimList = claims): Deps & { calls: Array<{ feedback?: string[]; previous?: unknown }> } => {
      const calls: Array<{ feedback?: string[]; previous?: unknown }> = [];
      return { calls, async propose(i) { calls.push({ feedback: i.feedback, previous: i.previous }); return propose(i); }, async extractClaims() { return { claims: extra }; } };
    };
    type FigureClaimList = typeof claims;
    await section('bad first proposal is retried with feedback and the good one wins', async () => {
      const good = goodFig();
      const d = mkDeps(async (i) => ({ figure: i.feedback?.length ? good : ws3p5Bad, claims: [] }));
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.deepEqual(r.figure, { ...good, display: { grid: false, axes: false, keepLabels: true } }); assert.equal(r.attempts, 2);
      assert.ok(d.calls[1].feedback!.some((f) => f.includes('on_segment')), String(d.calls[1].feedback));
      assert.deepEqual(d.calls[1].previous, ws3p5Bad);
      assert.equal(r.claims.length, 3);
    });
    await section('tokens sum propose + extractClaims usage across attempts; absent when none reported', async () => {
      const good = goodFig();
      const d: Deps = {
        async propose(i) { return { figure: i.feedback?.length ? good : ws3p5Bad, claims: [], usage: { in: 10, out: 5 } }; },
        async extractClaims() { return { claims, usage: { in: 3, out: 2 } }; },
      };
      const r = await buildFigure({ n: 1, text: P5 }, d);
      assert.equal(r.attempts, 2);
      assert.deepEqual(r.tokens, { in: 23, out: 12 });
      assert.equal((await buildFigure({ n: 1, text: P5 }, mkDeps(async () => ({ figure: null, claims: [] }), []))).tokens, undefined);
    });
    await section('always-bad proposals give null with the reasons after maxAttempts', async () => {
      const d = mkDeps(async () => ({ figure: ws3p5Bad, claims }));   // duplicate claims dedupe
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.equal(r.figure, null); assert.equal(r.attempts, 2); assert.match(r.note ?? '', /on_segment/);
      assert.equal(r.claims.length, 3);
    });
    await section('text-only problem returns after one attempt', async () => {
      const d = mkDeps(async () => ({ figure: null, claims: [], note: 'no figure' }), []);
      const r = await buildFigure({ n: 1, text: 'Solve 2x = 4.' }, d);
      assert.equal(r.figure, null); assert.equal(r.attempts, 1); assert.equal(d.calls.length, 1);
    });
    await section('a throwing dep never makes buildFigure throw', async () => {
      const d: Deps = { async propose() { throw new Error('boom'); }, async extractClaims() { throw new Error('boom2'); } };
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.equal(r.figure, null); assert.equal(r.attempts, 2); assert.match(r.note ?? '', /propose_failed/);
    });
    await section('propose_failed note from a dep counts as an attempt and is surfaced', async () => {
      const d = mkDeps(async () => ({ figure: null, claims: [], note: 'propose_failed:APIError' }), []);
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.equal(r.figure, null); assert.equal(r.attempts, 2); assert.match(r.note ?? '', /propose_failed:APIError/);
    });
    await section('propose fails on attempt 1, succeeds on attempt 2', async () => {
      const good = goodFig();
      const d = mkDeps(async (i) => i.feedback || d.calls.length > 1 ? { figure: good, claims: [] } : { figure: null, claims: [], note: 'propose_failed:APIError' });
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.deepEqual(r.figure, { ...good, display: { grid: false, axes: false, keepLabels: true } }); assert.equal(r.attempts, 2);
    });
    await section('validator reasons survive a failed second propose', async () => {
      const d = mkDeps(async () => (d.calls.length > 1 ? { figure: null, claims: [], note: 'propose_failed:APIError' } : { figure: ws3p5Bad, claims: [] }));
      const r = await buildFigure({ n: 5, text: P5 }, d);
      assert.equal(r.figure, null); assert.match(r.note ?? '', /on_segment/);
    });
    await section('a graph proposed with `expression` and a labelled point is accepted on attempt 1 and stored with `expr` (final review, F8)', async () => {
      const T = 'The line y = 2x + 1 passes through point P.';
      const proposed = { action: 'showGraph', type: 'function', data: { xLabel: 'x', yLabel: 'y', xRange: [-5, 5], yRange: [-5, 5], functions: [{ expression: '2*x+1' }], points: [{ x: 0, y: 1, label: 'P' }] } } as unknown as Fig;
      const d = mkDeps(async () => ({ figure: proposed, claims: [] }), []);
      const r = await buildFigure({ n: 3, text: T }, d);
      assert.equal(r.attempts, 1, r.note);
      assert.equal(d.calls.length, 1);
      const fns = (r.figure as unknown as { data: { functions: Array<Record<string, unknown>> } }).data.functions;
      assert.deepEqual(fns, [{ expr: '2*x+1' }]);
    });
    await section('a synchronously throwing extractClaims cannot escape', async () => {
      const d: Deps = { async propose() { return { figure: null, claims: [], note: 'no figure' }; }, extractClaims() { throw new Error('sync'); } };
      const r = await buildFigure({ n: 1, text: 'x' }, d);
      assert.equal(r.attempts, 1);
    });
    await section('parseProposal / normalizeClaims: malformed figure_json -> null; bad claims dropped', () => {
      const bad = parseProposal({ figure_json: '{nope', claims: [{ kind: 'on_segment', point: 'D', segment: ['A', 'B'] }] });
      assert.equal(bad.figure, null); assert.equal(bad.note, 'propose_failed:parse'); assert.equal(bad.claims.length, 1);
      assert.equal(parseProposal({ figure_json: '', claims: [] }).figure, null);
      assert.deepEqual(parseProposal({ figure_json: '{"action":"nope"}', claims: [] }).figure, { action: 'nope' }, 'an unknown action is the validator\'s to name');
      assert.equal(parseProposal({ figure_json: '{"x":1}', claims: [] }).figure, null);
      const ok = parseProposal({ figure_json: JSON.stringify(goodFig()), claims: [] });
      assert.deepEqual(ok.figure, JSON.parse(JSON.stringify(goodFig())));
      const cl = normalizeClaims([
        { kind: 'on_segment', point: 'D', segment: ['A', 'B'] },
        { kind: 'on_segment', point: 'E', segment: ['A'] },
        { kind: 'parallel', a: ['D', 'E'], b: ['B', 'C'] },
        { kind: 'collinear', points: ['A', 'B'] },
        { kind: 'bogus' }, null,
      ]);
      assert.equal(cl.length, 2);
    });
    await section('parseFigure keeps an unknown action for the validator to name', async () => {
      const { parseFigure } = await import('../src/lib/tutor/homework-build/figure-build');
      assert.deepEqual(parseFigure('{"action":"showMolecule"}'), { action: 'showMolecule' });
      assert.throws(() => parseFigure('{"x":1}'));
      assert.throws(() => parseFigure('{"action":3}'));
      assert.throws(() => parseFigure('[1]'));
      assert.throws(() => parseFigure('{nope'));
      assert.equal(parseFigure(''), null);
    });
    await section('a figure kind outside the vocabulary fails both attempts with the kind named', async () => {
      const seen: unknown[] = [];
      const d: Deps = {
        async propose(i) { seen.push(i.vocabulary); return { figure: { action: 'showStats', type: 'distribution' } as never, claims: [] }; },
        async extractClaims() { return { claims: [] }; },
      };
      const r = await buildFigure({ n: 1, text: 'A normal curve [Figure: a bell curve]' }, d);
      assert.equal(r.figure, null);
      assert.match(r.note ?? '', /unsupported figure kind "showStats:distribution"/);
      assert.equal(r.attempts, 2);
      assert.deepEqual(seen, ['all', 'all'], 'buildFigure passes its vocabulary (default all) to propose');
      // vocabulary geometry reaches propose and the validator: a graph passes, the same stats figure still fails.
      seen.length = 0;
      const g = await buildFigure({ n: 1, text: 'x' }, d, { vocabulary: 'geometry' });
      assert.equal(g.figure, null); assert.deepEqual(seen, ['geometry', 'geometry']);
    });
    await section('the proposer is given the build\'s vocabulary', async () => {
      const seen: unknown[] = [];
      const d: Deps = {
        async propose(i) { seen.push(i.vocabulary); return { figure: null, claims: [], note: 'text only' }; },
        async extractClaims() { return { claims: [] }; },
      };
      await buildFigure({ n: 1, text: 'x' }, d, { vocabulary: 'geometry' });
      assert.deepEqual(seen, ['geometry']);
      seen.length = 0;
      await buildFigure({ n: 1, text: 'x' }, d);
      assert.deepEqual(seen, ['all']);
    });
    await section('a caption-like stats title not on the sheet is dropped, not fatal', async () => {
      const { BOX, boxFig } = await import('./fixtures/homework-figure-fixtures');
      const withTitle = (title: string) => ({ ...(boxFig() as object), title }) as never;
      const stub = (fig: unknown): Deps => ({
        async propose() { return { figure: fig as never, claims: [] }; },
        async extractClaims() { return { claims: [] }; },
      });
      const r = await buildFigure({ n: 1, text: BOX }, stub(withTitle('Distribution Of Student Homework Times')));
      assert.ok(r.figure, r.note);
      assert.equal(r.attempts, 1);
      assert.ok(!('title' in (r.figure as object)), JSON.stringify(r.figure));
      const k = await buildFigure({ n: 1, text: BOX }, stub(withTitle('Homework Minutes')));
      assert.equal((k.figure as { title?: string } | null)?.title, 'Homework Minutes');
      // A diagram's params.title is the same rule; a caption the sheet does state is kept.
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const dia = { action: 'showDiagram', type: 'solid_3d', params: { shape: 'cone', dims: { r: 4, h: 9 }, title: 'A Lovely Cone Picture' } } as never;
      assert.ok(!('title' in (normalizeFigureDisplay(dia, BOX) as { params: object }).params));
      const kept = { action: 'showStats', type: 'boxplot', title: 'minutes students spent on homework', boxplot: { datasets: [] } } as never;
      assert.equal((normalizeFigureDisplay(kept, BOX) as { title?: string }).title, 'minutes students spent on homework');
      // Every other new-kind figure passes through unchanged (the same object).
      const plain = boxFig();
      assert.equal(normalizeFigureDisplay(plain, BOX), plain);
    });
    await section('normalizeClaims / FIGURE_CLAIMS_SYSTEM (hw-14b p1, G1): stated relative positions are claims', async () => {
      const { FIGURE_CLAIMS_SYSTEM } = await import('../src/lib/tutor/homework-build/figure-build');
      const cl = normalizeClaims([
        { kind: 'right_of', point: 'E', of: 'A' },
        { kind: 'right_of', point: 'E' },
        { kind: 'left_of', point: 'A', of: 'E' },
        { kind: 'above', point: 'T', of: 'B' },
        { kind: 'below', point: 'B', of: '' },
      ]);
      assert.deepEqual(cl, [
        { kind: 'right_of', point: 'E', of: 'A' },
        { kind: 'left_of', point: 'A', of: 'E' },
        { kind: 'above', point: 'T', of: 'B' },
      ]);
      assert.ok(FIGURE_CLAIMS_SYSTEM.includes('stated relative positions of named points (left of, right of, above, below)'), FIGURE_CLAIMS_SYSTEM);
      for (const k of ['left_of', 'right_of', 'above', 'below']) assert.ok(FIGURE_CLAIMS_SYSTEM.includes(`${k} (point, of)`), k);
    });
    await section('normalizeFigureDisplay (hw-14 p8, F8): a graph function stored as `expression` is stored as `expr`', async () => {
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const out = normalizeFigureDisplay(hw14p8Fig() as Fig, HW14_P8) as { data: { functions: Array<Record<string, unknown>>; xRange: number[] } };
      assert.equal(out.data.functions[0].expr, '2.5*cos(3*x*pi/180)+0.5');
      assert.ok(!('expression' in out.data.functions[0]), JSON.stringify(out.data.functions[0]));
      assert.deepEqual(out.data.xRange, [0, 360], 'the rest of the data kept');
      // An `expr` already present wins; x = f(y) curves are normalised the same way.
      const both = normalizeFigureDisplay({ action: 'showGraph', type: 'function', data: { xRange: [0, 1], yRange: [0, 1], functions: [{ expr: 'x', expression: 'x^2' }], functionsOfY: [{ expression: 'y^2' }] } } as never, '') as { data: { functions: Array<Record<string, unknown>>; functionsOfY: Array<Record<string, unknown>> } };
      assert.equal(both.data.functions[0].expr, 'x');
      assert.deepEqual(both.data.functionsOfY[0], { expr: 'y^2' });
    });
    await section('I5 geometry display: grid/axes off unless the text is on a coordinate plane', async () => {
      const { normalizeFigureDisplay } = await import('../src/lib/tutor/homework-build/figure-build');
      const g = goodFig();
      const off = normalizeFigureDisplay(g, P5) as { display?: Record<string, unknown> };
      assert.deepEqual(off.display, { grid: false, axes: false, keepLabels: true });
      const kept = normalizeFigureDisplay({ ...g, display: { showLabels: true, grid: true } } as Fig, P5) as { display?: Record<string, unknown> };
      assert.deepEqual(kept.display, { showLabels: true, grid: false, axes: false, keepLabels: true }, 'other display keys kept');
      for (const t of [`${P5} The triangle is drawn on the coordinate plane.`, 'Plot A(2, 3) and B(-1, 4).', 'Reflect the triangle over the x-axis.', 'Name the ordered pair of the vertex.']) {
        assert.deepEqual((normalizeFigureDisplay(g, t) as { display?: unknown }).display, { ...(g.display ?? {}), keepLabels: true }, t);
      }
      // 2026-10-21 (GAC acceptance): invented helper points (P1, Q1, R2) came out lettered
      // on the board — an unlabelled point the text never names gets an empty label.
      const helpers = {
        ...g,
        given: [
          { id: 'P1', kind: 'point', x: 0, y: 0 }, { id: 'A', kind: 'point', x: 1, y: 0 },
          { id: 'B', kind: 'point', x: 2, y: 0, label: 'B' }, { id: 'ln', kind: 'line', pointA: 'P1', pointB: 'A', label: 'p' },
        ],
        steps: [{ id: 'M1', kind: 'midpoint', of: ['P1', 'A'] }, { id: 'E', kind: 'midpoint', of: ['A', 'B'] }],
      } as unknown as Fig;
      const un = normalizeFigureDisplay(helpers, P5) as { given: Array<{ id: string; label?: string }>; steps: Array<{ id: string; label?: string }> };
      assert.equal(un.given[0].label, '', 'P1 unnamed');
      assert.equal(un.given[1].label, undefined, 'A is named in the text');
      assert.equal(un.given[2].label, 'B', 'an explicit label is left for the validator');
      assert.equal(un.given[3].label, 'p', 'lines untouched');
      assert.equal(un.steps[0].label, '', 'constructed helper unnamed');
      assert.equal(un.steps[1].label, undefined);
      assert.match(FIGURE_PROPOSE_SYSTEM, /never a segment, and never a point carrying the letter as its label/);
      const gr = graph();
      assert.equal(normalizeFigureDisplay(gr, 'no coordinates mentioned here at all'), gr, 'graphs untouched');
      assert.match(FIGURE_PROPOSE_SYSTEM, /no coordinate grid and no axes/);
    });
    await section('system prompt carries the structural rules', async () => {
      assert.match(FIGURE_PROPOSE_SYSTEM, /section_point: \{ kind: "section_point", of: [^\n]*ratio: \[m, n\]/);
      assert.match(FIGURE_PROPOSE_SYSTEM, /parallel_through: \{ kind: "parallel_through", through: pointId/);
      assert.match(FIGURE_PROPOSE_SYSTEM, /never.*free coordinates/i);
      assert.match(FIGURE_PROPOSE_SYSTEM, /xAxisStep/);
      assert.match(FIGURE_PROPOSE_SYSTEM, /translate_point: \{ kind: "translate_point", point: pointId, by: \{ dx, dy \} \| \{ from: pointId, to: pointId \}/, 'the proposer prompt names both by shapes (G7)');
      // G5: the region vocabulary and the shading rule live in the homework proposer prompt only.
      // No `label?` on region: the renderer draws no region label, so a word written there would vanish (review, Minor 3).
      assert.match(FIGURE_PROPOSE_SYSTEM, /region: \{ kind: "region", outer: circleId\|polygonId, inner\?: \[circleId\|polygonId, \.\.\.\] \}/, 'the proposer prompt names region with outer/inner and no label (G5)');
      assert.doesNotMatch(FIGURE_PROPOSE_SYSTEM, /kind: "region"[^\n]*label\?/, 'region offers no label');
      assert.match(FIGURE_PROPOSE_SYSTEM, /fill: "none"/, 'the proposer prompt names the polygon fill "none" field (G5)');
      assert.ok(FIGURE_PROPOSE_SYSTEM.includes('10. Shade exactly what the sheet shades: a region step whose outer is the shape whose inside is shaded and whose inner shapes are cut out; when the sheet shades a region, every polygon it leaves unshaded carries fill "none"; never shade a polygon to stand in for the sheet\'s shading.'), 'rule 10 verbatim (G5)');
      const { GEOMETRY_STEP_DOCS, GEOMETRY_STEP_DOCS_EXTRA } = await import('../src/lib/tutor/diagrams/geometry-step-docs');
      const { getGeometryStepKindsDescriptionTail } = await import('../src/lib/tutor/diagrams/geometry-solver');
      assert.doesNotMatch(GEOMETRY_STEP_DOCS + GEOMETRY_STEP_DOCS_EXTRA + getGeometryStepKindsDescriptionTail(), /region|fill: "none"/, 'the live session vocabulary is unchanged (engine freeze)');
    });
  }

  // ---- 4 key (pure: stub solvers, no Mongo, no model) ----
  console.log('4 key');
  {
    const { solveKey, partsAgree, KEY_SOLVE_SYSTEM, KEY_SOLVE_SCHEMA, normalizeKeyParts, normalizeKeySteps } = await import('../src/lib/tutor/homework-build/key-solve');
    type AP = Parameters<typeof partsAgree>[0];
    const num = (final: string, value: number, label = '', units?: string): AP[number] =>
      ({ label, final, canonical: { kind: 'number', value, ...(units ? { units } : {}) } });
    const txt = (final: string, label = ''): AP[number] => ({ label, final, canonical: { kind: 'text', value: final } });
    type KS = Array<{ relation: string; value?: string }>;
    const mk = (a: AP | null, b: AP | null, t: AP | null, steps: { a?: KS; b?: KS; t?: KS } = {}) => {
      const calls = { a: 0, b: 0, t: 0 };
      return { calls, names: ['A', 'B', 'T'] as [string, string, string],
        solveA: async () => { calls.a++; return { parts: a, ...(steps.a ? { steps: steps.a } : {}), usage: { in: 100, out: 10 } }; }, solveB: async () => { calls.b++; return { parts: b, ...(steps.b ? { steps: steps.b } : {}), usage: { in: 100, out: 10 } }; }, solveTieBreak: async () => { calls.t++; return { parts: t, ...(steps.t ? { steps: steps.t } : {}), usage: { in: 50, out: 5 } }; } };
    };
    await section('round 11: steps ride the solve; the Opus solver\'s path is stored; agreement stays finals-only', async () => {
      const sA = [{ relation: 'base angles equal', value: '∠B = ∠C = 21' }];
      const sB = [{ relation: 'exterior angle = sum of remote interior', value: '(5x + 5) = 40 + ∠B' }, { relation: 'solve', value: 'x = 21' }];
      const d = mk([num('x = 21', 21, 'a')], [num('x = 21', 21, 'a')], null, { a: sA, b: sB });
      const r = await solveKey({ n: 1, text: 'q' }, { ...d, names: ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'] });
      assert.deepEqual(r.key!.steps, sB, 'the plangen-vision (Opus) path');
      const r2 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('21', 21)], [num('21', 21)], null, { a: sA }), names: ['A', 'B', 'T'] });
      assert.deepEqual(r2.key!.steps, sA, 'first agreeing solver when neither is plangen-vision');
      const r3 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('1', 1)], [num('21', 21)], [num('21', 21)], { b: sB }), names: ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'] });
      assert.deepEqual(r3.key!.solvers, ['plangen-vision', 'plangen-vision-tiebreak']); assert.deepEqual(r3.key!.steps, sB);
      assert.equal((await solveKey({ n: 1, text: 'q' }, mk([num('1', 1)], [num('1', 1)], null))).key!.steps, undefined, 'no steps → field absent');
    });
    await section('final review (I1): the tie-break counts as the Opus role; a stepless Opus path yields to the other agreeing path; steps keyed by slot', async () => {
      const N: [string, string, string] = ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'];
      const sA = [{ relation: 'A route', value: 'x = 3' }];
      const sB = [{ relation: 'B route', value: 'x = 4' }];
      const sT = [{ relation: 'T route', value: 'x = 3' }];
      const withA = await solveKey({ n: 1, text: 'q' }, { ...mk([num('3', 3)], [num('4', 4)], [num('3', 3)], { a: sA, b: sB, t: sT }), names: N });
      assert.deepEqual(withA.key!.solvers, ['content-verify', 'plangen-vision-tiebreak']);
      assert.deepEqual(withA.key!.steps, sT, 'withA: the tie-break (Opus) path, not content-verify\'s');
      const withB = await solveKey({ n: 1, text: 'q' }, { ...mk([num('3', 3)], [num('4', 4)], [num('4', 4)], { a: sA, b: sB, t: [{ relation: 'T', value: 'x = 4' }] }), names: N });
      assert.deepEqual(withB.key!.steps, sB, 'withB: plangen-vision over its tie-break');
      const r6 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('3', 3)], [num('3', 3)], null, { a: sA }), names: N });
      assert.deepEqual(r6.key!.steps, sA, 'R6: Opus returned no steps, the other agreeing path is stored');
      // Same parts array returned by two solvers: slot keying keeps their paths apart.
      const shared = [num('3', 3)];
      const sameArr = await solveKey({ n: 1, text: 'q' }, { ...mk(shared, shared, null, { a: sA, b: [{ relation: 'B', value: 'x = 3' }] }), names: N });
      assert.deepEqual(sameArr.key!.steps, [{ relation: 'B', value: 'x = 3' }], 'one parts array, two solvers: the Opus slot\'s path');
    });
    await section('round 11: normalizeKeySteps drops empty relations, caps at 8, trims, omits empty values', () => {
      assert.deepEqual(normalizeKeySteps([{ relation: ' a ', value: ' 1 ' }, { relation: '', value: '2' }, { relation: 'b', value: '' }, null, 'x']), [{ relation: 'a', value: '1' }, { relation: 'b' }]);
      assert.equal(normalizeKeySteps(Array.from({ length: 10 }, (_, i) => ({ relation: `s${i}` }))).length, 8);
      assert.deepEqual(normalizeKeySteps(undefined), []);
    });
    await section('final review (I6): a path that does not reach every number final is dropped', async () => {
      const N: [string, string, string] = ['content-verify', 'plangen-vision', 'plangen-vision-tiebreak'];
      const two = (): AP => [num('x = 21', 21, 'a'), num('70°', 70, 'b', '°')];
      const reach = [{ relation: 'exterior angle', value: '(5x + 5) = 40 + ∠B' }, { relation: 'solve', value: 'x = 21' }, { relation: 'substitute', value: '∠B = 70°' }];
      const kept = await solveKey({ n: 1, text: 'q' }, { ...mk(two(), two(), null, { b: reach }), names: N });
      assert.deepEqual(kept.key!.steps, reach, 'every final reached → kept');
      const miss = reach.slice(0, 2);
      const warns: string[] = []; const w = console.warn; console.warn = (m: string) => { warns.push(String(m)); };
      let dropped;
      try { dropped = await solveKey({ n: 4, text: 'q' }, { ...mk(two(), two(), null, { b: miss }), names: N }); } finally { console.warn = w; }
      assert.equal('steps' in dropped.key!, false, '70 never on the path → steps absent');
      assert.ok(warns.some((m) => m === '[homework-build] n=4 steps dropped: finals not reachable from the path'), JSON.stringify(warns));
      const rad = [num('56√3 ≈ 96.99', 96.99)];
      const rk = await solveKey({ n: 1, text: 'q' }, { ...mk(rad, rad, null, { b: [{ relation: 'area of the triangle', value: 'A = 56√3' }] }), names: N });
      assert.deepEqual(rk.key!.steps, [{ relation: 'area of the triangle', value: 'A = 56√3' }], 'a radical value reaches its decimal final');
      const rk2 = await solveKey({ n: 1, text: 'q' }, { ...mk([num('96.99', 96.99)], [num('96.99', 96.99)], null, { b: [{ relation: 'r', value: '56 sqrt 3' }] }), names: N });
      assert.ok(rk2.key!.steps, '"c sqrt n" parses as c·√n');
      const tx = await solveKey({ n: 1, text: 'q' }, { ...mk([txt('y = 3x + 2')], [txt('y = 3x + 2')], null, { b: [{ relation: 'slope', value: 'm = 3' }] }), names: N });
      assert.ok(tx.key!.steps, 'a text-kind part imposes no requirement');
      const sub = await solveKey({ n: 1, text: 'q' }, { ...mk([num('x = −4', -4)], [num('x = −4', -4)], null, { b: [{ relation: 'solve', value: 'so X = -4' }] }), names: N });
      assert.ok(sub.key!.steps, 'final reached as a normalised substring (unicode minus, case)');
    });
    await section('final review (I7): normalizeKeySteps collapses whitespace and caps relation 200 / value 80', () => {
      assert.deepEqual(normalizeKeySteps([{ relation: 'line one\n  line two', value: 'x =\n 3' }]), [{ relation: 'line one line two', value: 'x = 3' }]);
      const [cap] = normalizeKeySteps([{ relation: 'r'.repeat(300), value: 'v'.repeat(120) }]);
      assert.equal(cap.relation.length, 200); assert.equal(cap.value!.length, 80);
    });
    await section('round 11: KEY_SOLVE_SYSTEM asks for steps; the schema carries them', () => {
      assert.ok(KEY_SOLVE_SYSTEM.includes('6. steps:'));
      assert.ok((KEY_SOLVE_SCHEMA.properties as Record<string, unknown>).steps);
    });
    await section('A = B: agreed, two solvers, tie-break not called', async () => {
      const d = mk([num('x = 20', 20)], [num('x = 20', 20)], null);
      const r = await solveKey({ n: 1, text: 'q' }, d);
      assert.equal(r.agreed, true); assert.deepEqual(r.key!.solvers, ['A', 'B']); assert.equal(d.calls.t, 0);
    });
    await section('tokens sum over the solves made', async () => {
      assert.deepEqual((await solveKey({ n: 1, text: 'q' }, mk([num('x = 20', 20)], [num('x = 20', 20)], null))).tokens, { in: 200, out: 20 });
      assert.deepEqual((await solveKey({ n: 1, text: 'q' }, mk([num('1', 1)], [num('2', 2)], [num('1', 1)]))).tokens, { in: 250, out: 25 });
    });
    await section('tie-break agrees with A within 1 %', async () => {
      const d = mk([num('35.42', 35.42)], [num('31.42', 31.42)], [num('35.4', 35.4)]);
      const r = await solveKey({ n: 1, text: 'q' }, d);
      assert.equal(r.agreed, true); assert.deepEqual(r.key!.solvers, ['A', 'T']); assert.equal(r.key!.parts[0].final, '35.42');
    });
    await section('one solver null -> tie-break decides; null contributes (no answer)', async () => {
      const d = mk(null, [num('7', 7)], [num('7', 7)]);
      const r = await solveKey({ n: 1, text: 'q' }, d);
      assert.equal(r.agreed, true); assert.deepEqual(r.key!.solvers, ['B', 'T']);
      const d2 = mk(null, [num('7', 7)], [num('9', 9)]);
      const r2 = await solveKey({ n: 1, text: 'q' }, d2);
      assert.equal(r2.key, null); assert.deepEqual(r2.candidates, ['A: (no answer)', 'B: 7', 'T: 9']);
    });
    await section('all three differ -> null key, 3 candidates', async () => {
      const r = await solveKey({ n: 1, text: 'q' }, mk([num('1', 1)], [num('2', 2)], [num('3', 3)]));
      assert.equal(r.key, null); assert.equal(r.agreed, false); assert.equal(r.candidates.length, 3);
    });
    await section('two parts: (a) agrees, (b) differs, tie-break matches neither -> no partial key', async () => {
      const r = await solveKey({ n: 1, text: 'q' }, mk(
        [num('5', 5, 'a'), num('7', 7, 'b')], [num('5', 5, 'a'), num('8', 8, 'b')], [num('6', 6, 'a'), num('9', 9, 'b')]));
      assert.equal(r.key, null); assert.equal(r.candidates[0], 'A: a) 5; b) 7');
    });
    await section('tie-break matching both disagreeing solvers is refused as ambiguous', async () => {
      const r = await solveKey({ n: 1, text: 'q' }, mk([num('100', 100)], [num('102', 102)], [num('101', 101)]));
      assert.equal(r.key, null); assert.match(r.note ?? '', /ambiguous/);
    });
    await section('throwing deps never reject', async () => {
      const boom = async () => { throw new Error('x'); };
      const r = await solveKey({ n: 1, text: 'q' }, { names: ['A', 'B', 'T'], solveA: boom, solveB: boom, solveTieBreak: boom });
      assert.equal(r.key, null);
    });
    await section('partsAgree table', () => {
      assert.equal(partsAgree([num('20°', 20)], [num('20', 20)]), true);
      assert.equal(partsAgree([num('35.42 cm', 35.42, '', 'cm')], [num('35.4', 35.4)]), true);
      assert.equal(partsAgree([txt('1/2')], [num('0.5', 0.5)]), false);
      assert.equal(partsAgree([num('1', 1, 'a'), num('2', 2, 'b')], [num('2', 2, 'b'), num('1', 1, 'a')]), true);
      assert.equal(partsAgree([num('1', 1, 'a'), num('2', 2, 'b')], [num('1', 1, 'a')]), false);
      // 2026-10-22 (hw-15 p4, "find the area and perimeter"): three solvers agreed on
      // 27.47 cm² / 41.13 cm and labelled the parts "area/perimeter", "" and "a/b" —
      // the key was refused on the labels alone. Same count, every part equal in
      // order → agreement, whatever the labels; duplicate labels still refuse.
      assert.equal(partsAgree([num('1', 1, 'a')], [num('1', 1, 'b')]), true);
      assert.equal(partsAgree([num('27.47 cm²', 27.47, 'area', 'cm²'), num('41.13 cm', 41.13, 'perimeter', 'cm')],
        [num('27.47 cm²', 27.47, 'a', 'cm²'), num('41.13 cm', 41.13, 'b', 'cm')]), true);
      assert.equal(partsAgree([num('27.47', 27.47, 'area'), num('41.13', 41.13, 'perimeter')], [num('41.13', 41.13, 'a'), num('27.47', 27.47, 'b')]), false, 'different labels compare by position');
      assert.equal(partsAgree([num('27.47', 27.47), num('41.13', 41.13)], [num('27.47', 27.47, 'a'), num('41.13', 41.13, 'b')]), false, 'duplicate (empty) labels still refuse');
      assert.equal(partsAgree([num('27.47', 27.47, 'area'), num('41.13', 41.13, 'perimeter')], [num('27.47', 27.47, 'a'), num('40', 40, 'b')]), false);
      assert.equal(partsAgree([num('5 cm', 5, '', 'cm')], [num('5 m', 5, '', 'm')]), false);
      assert.equal(partsAgree([num('20', 20)], [num('21', 21)]), false);
      assert.equal(partsAgree([txt('Parallel.')], [txt('  parallel')]), true);
      assert.equal(partsAgree([txt('parallel')], [txt('perpendicular')]), false);
      assert.equal(partsAgree([], []), false);
      assert.equal(partsAgree([num('1', 1, 'a'), num('2', 2, 'a')], [num('1', 1, 'a'), num('2', 2, 'a')]), false);
      assert.equal(partsAgree([num('20', 20)], [num('x', Number.NaN)]), false);
      assert.equal(partsAgree([num('0', 0)], [num('0.005', 0.005)]), false);   // zero vs near-zero is not agreement
    });
    await section('normalizeKeyParts strips trailing units from number finals; ill-posed -> null', () => {
      const p = normalizeKeyParts({ parts: [{ label: ' (a) ', final: '35.42 cm', canonical: { kind: 'number', number: 35.42, text: '', units: '' } }] })!;
      assert.equal(p[0].label, 'a'); assert.deepEqual(p[0].canonical, { kind: 'number', value: 35.42, units: 'cm' });
      assert.equal(normalizeKeyParts({ parts: [], ill_posed: 'no figure' }), null);
      assert.equal(normalizeKeyParts({ parts: [{ label: '', final: '', canonical: { kind: 'text', number: 0, text: '', units: '' } }] }), null);
      assert.equal(normalizeKeyParts({ nope: 1 }), null);
    });
    await section('system prompt: per-part and ill_posed', () => {
      assert.match(KEY_SOLVE_SYSTEM, /one entry per lettered part/);
      assert.match(KEY_SOLVE_SYSTEM, /ill_posed/);
    });
  }

  console.log('1 types+store');
  try {
    await mongoose.connect(TEST_URI, { serverSelectionTimeoutMS: 2000, bufferCommands: false });
  } catch (err) {
    console.log(`SKIP: no test mongod at ${TEST_URI} (${(err as Error).message})`);
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exit(failed ? 1 : 0);
  }
  assertTestDb();
  await mongoose.connection.dropDatabase();

  const { problemHash } = await import('../src/lib/tutor/homework-build/types');
  const { ensureHomeworkBuild, getHomeworkBuild, patchProblemBuild, findCachedProblem } =
    await import('../src/lib/tutor/homework-build/store');

  await section('problemHash collapses whitespace', () => {
    assert.equal(problemHash('a  b\n c'), problemHash('a b c'));
    assert.equal(problemHash('  a b c '), problemHash('a b c'));
    assert.equal(problemHash('a b c').length, 16);
    assert.notEqual(problemHash('a b c'), problemHash('a b d'));
  });

  await section('ensure is idempotent; patch recomputes done; cache lookup', async () => {
    const doc = await ensureHomeworkBuild('gen-p1', 'greenapple', [{ n: 1, text: 'P1' }, { n: 2, text: 'P2' }]);
    assert.equal(doc.problems.length, 2); assert.equal(doc.problems[0].status, 'preparing'); assert.equal(doc.done, false);
    await ensureHomeworkBuild('gen-p1', 'greenapple', [{ n: 1, text: 'CHANGED' }]);   // no-op
    assert.equal((await getHomeworkBuild('gen-p1'))!.problems[0].text, 'P1');
    await patchProblemBuild('gen-p1', 1, { status: 'ready', key: { parts: [], solvers: ['a', 'b'] }, verify: { agreed: true } });
    assert.equal((await getHomeworkBuild('gen-p1'))!.done, false);
    await patchProblemBuild('gen-p1', 2, { status: 'unverified', verify: { agreed: false, candidates: ['3', '4'] } });
    assert.equal((await getHomeworkBuild('gen-p1'))!.done, true);
    assert.equal((await findCachedProblem(problemHash('P1')))!.status, 'ready');
    assert.equal(await findCachedProblem(problemHash('P1'), 0), null);
    assert.equal(await findCachedProblem(problemHash('nope')), null);
    assert.equal(await getHomeworkBuild('missing'), null);
  });

  await section('cache ignores preparing problems and returns the newest', async () => {
    await ensureHomeworkBuild('gen-p2', 'greenapple', [{ n: 1, text: 'P1' }, { n: 2, text: 'Z' }]);
    assert.equal((await findCachedProblem(problemHash('Z'))), null);       // still preparing
    await new Promise((r) => setTimeout(r, 10));
    await patchProblemBuild('gen-p2', 1, { status: 'unverified', verify: { agreed: false } });
    assert.equal((await findCachedProblem(problemHash('P1')))!.status, 'unverified');   // newer than gen-p1's
  });

  await section('concurrent first ensure calls resolve to the same doc', async () => {
    const probs = [{ n: 1, text: 'C1' }, { n: 2, text: 'C2' }];
    const rs = await Promise.all(Array.from({ length: 6 }, () => ensureHomeworkBuild('gen-race', 'greenapple', probs)));
    for (const r of rs) { assert.equal(r._id, 'gen-race'); assert.equal(r.problems.length, 2); }
  });

  await section('I6 erase: deleteHomeworkBuilds removes the erased plans\' builds only; erase wires it', async () => {
    const { deleteHomeworkBuilds } = await import('../src/lib/tutor/homework-build/store');
    await ensureHomeworkBuild('gen-erase-1', 'greenapple', [{ n: 1, text: 'E1' }]);
    await ensureHomeworkBuild('gen-erase-keep', 'greenapple', [{ n: 1, text: 'E2' }]);
    assert.equal(await deleteHomeworkBuilds([]), 0);
    assert.equal(await deleteHomeworkBuilds(['gen-erase-1', 'gen-not-there']), 1);
    assert.equal(await getHomeworkBuild('gen-erase-1'), null);
    assert.ok(await getHomeworkBuild('gen-erase-keep'), 'another plan\'s build survives');
    const fs = await import('node:fs');
    const erase = fs.readFileSync('src/lib/tutor/student-erase/erase.ts', 'utf8');
    assert.match(erase, /hasPlans \? deleteHomeworkBuilds\(deletablePlanIds\)/);
    assert.match(erase, /homeworkBuilds,/);
  });

  await section('I6 retention: TTL index on updatedAt, 90 days', async () => {
    const { HomeworkBuildModel, HOMEWORK_BUILD_TTL_SECONDS } = await import('../src/models/HomeworkBuild');
    assert.equal(HOMEWORK_BUILD_TTL_SECONDS, 90 * 24 * 3600);
    await HomeworkBuildModel.syncIndexes();
    const idx = (await HomeworkBuildModel.collection.indexes()) as Array<{ key: Record<string, number>; expireAfterSeconds?: number }>;
    const ttl = idx.find((i) => JSON.stringify(i.key) === JSON.stringify({ updatedAt: 1 }));
    assert.ok(ttl, JSON.stringify(idx));
    assert.equal(ttl.expireAfterSeconds, 90 * 24 * 3600);
  });

  // ---- 5 runner (Mongo-backed: inserts plans) ----
  console.log('5 runner');
  {
    const fs = await import('node:fs');
    const { runHomeworkBuild, BUILD_STALE_MS } = await import('../src/lib/tutor/homework-build/runner');
    const { upsertLessonPlan } = await import('../src/lib/tutor/lesson-plan/store');
    const { LESSON_PLAN_SCHEMA_VERSION } = await import('../src/lib/tutor/lesson-plan/types');
    type RD = NonNullable<NonNullable<Parameters<typeof runHomeworkBuild>[2]>['deps']>;
    const mkPlan = async (id: string, texts: string[]) => {
      await upsertLessonPlan({
        id, title: 'Homework help', curriculum: 'freestyle', grade: '8', subject: 'math', topic: 'hw', locale: 'en',
        los: [{ id: `${id}.hw`, description: 'Work the problems.', shortTitle: 'hw', estimatedMinutes: 20 }],
        estimatedMinutes: 20,
        segments: [{ id: 'homework', kind: 'concept', goal: 'Work them.', keyIdeas: ['x'] }],
        prerequisites: [], followUps: [], schemaVersion: LESSON_PLAN_SCHEMA_VERSION,
        metadata: { kind: 'homework-help', problems: texts.map((text, i) => ({ n: i + 1, text })) },
      });
    };
    const mkDeps = (opts: { throwOn?: string } = {}) => {
      const order: string[] = [];
      const deps: RD = {
        figure: {
          async propose({ text }) { order.push(text); if (opts.throwOn === text) throw new Error('boom'); return { figure: null, claims: [] }; },
          async extractClaims() { return { claims: [], usage: { in: 4, out: 1 } }; },
        },
        key: {
          names: ['A', 'B', 'T'],
          async solveA() { return { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], steps: [{ relation: 'solve', value: 'x = 5' }], usage: { in: 20, out: 2 } }; },
          async solveB() { return { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], steps: [{ relation: 'solve', value: 'x = 5' }], usage: { in: 20, out: 2 } }; },
          async solveTieBreak() { return { parts: null }; },
        },
      };
      return { deps, order };
    };

    await section('first problem first, then ascending; all ready; done', async () => {
      await mkPlan('gen-r1', ['Alpha 1', 'Beta 2', 'Gamma 3']);
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-r1', 'greenapple', { first: 3, deps, concurrency: 1 });
      assert.deepEqual(order, ['Gamma 3', 'Alpha 1', 'Beta 2']);
      const b = (await getHomeworkBuild('gen-r1'))!;
      assert.equal(b.done, true);
      assert.deepEqual(b.problems.map((p) => p.status), ['ready', 'ready', 'ready']);
      assert.equal(b.problems[0].verify.agreed, true);
      assert.equal(typeof b.problems[0].ms, 'number');
      assert.deepEqual(b.problems[0].tokens, { in: 44, out: 5 });
    });

    await section('a second run makes zero dep calls', async () => {
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-r1', 'greenapple', { deps, concurrency: 1 });
      assert.equal(order.length, 0);
    });

    await section('identical problem text copies the cache', async () => {
      await mkPlan('gen-r2', ['Alpha 1', 'Fresh 2']);
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-r2', 'greenapple', { deps, concurrency: 1 });
      assert.deepEqual(order, ['Fresh 2']);
      const b = (await getHomeworkBuild('gen-r2'))!;
      assert.equal(b.problems[0].status, 'ready'); assert.equal(b.problems[0].ms, 0);
      assert.equal(b.problems[0].key!.parts[0].final, '5');
    });

    await section('a cached ready entry with no figure on a problem that has one reuses the key and retries the figure', async () => {
      // GAC acceptance 2026-10-21: six of eight figures failed validation and were
      // cached as ready-without-figure; a re-upload must not copy that verdict.
      const text = 'Fig 1 [Figure: a box ABCD]';
      await ensureHomeworkBuild('gen-f0', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-f0', 1, {
        status: 'ready', figure: null, figureNote: 'label "Q" does not come from the problem text',
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-f1', [text, 'Plain 2']);
      const { deps, order } = mkDeps();
      let solves = 0;
      deps.key.solveA = async () => { solves++; return { parts: [{ label: '', final: '7', canonical: { kind: 'number', value: 7 } }], usage: { in: 1, out: 1 } }; };
      await runHomeworkBuild('gen-f1', 'greenapple', { deps, concurrency: 1 });
      assert.deepEqual(order, [text, 'Plain 2'], 'the figure was proposed again; the key was not re-solved');
      assert.equal(solves, 1, 'only Plain 2 solved');
      const b = (await getHomeworkBuild('gen-f1'))!;
      assert.equal(b.problems[0].status, 'ready');
      assert.equal(b.problems[0].key!.parts[0].final, '5', 'verified key reused');
      // A cached ready entry without a figure on a problem with no description is still copied.
      await ensureHomeworkBuild('gen-f2', 'greenapple', [{ n: 1, text: 'Nofig 1' }]);
      await patchProblemBuild('gen-f2', 1, { status: 'ready', figure: null, key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9 });
      await mkPlan('gen-f3', ['Nofig 1']);
      const r = mkDeps();
      await runHomeworkBuild('gen-f3', 'greenapple', { deps: r.deps });
      assert.deepEqual(r.order, []);
      assert.equal((await getHomeworkBuild('gen-f3'))!.problems[0].ms, 0);
    });

    await section('a cached ready figure that fails today\'s validator is retried, the key reused', async () => {
      // GAC acceptance 2026-10-21 (round 5 audit): hw-11's box plot was cached
      // as a showGraph made of `segments` (undrawable) before the graph-field
      // check existed; a re-upload within 24 h copied it. A cached figure is
      // re-validated against the current rules before it is copied.
      const text = 'Box 1 [Figure: box plot from 0 to 50]';
      const stale = { action: 'showGraph', type: 'function', data: { xRange: [0, 50], yRange: [0, 4], segments: [{ from: [9, 2], to: [18, 2] }] } };
      await ensureHomeworkBuild('gen-s0', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-s0', 1, {
        status: 'ready', figure: stale as never,
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-s1', [text]);
      const { deps, order } = mkDeps();
      let solves = 0;
      deps.key.solveA = async () => { solves++; return { parts: [{ label: '', final: '7', canonical: { kind: 'number', value: 7 } }], usage: { in: 1, out: 1 } }; };
      await runHomeworkBuild('gen-s1', 'greenapple', { deps, concurrency: 1 });
      assert.deepEqual(order, [text], 'the figure was proposed again');
      assert.equal(solves, 0, 'the verified key was not re-solved');
      const b = (await getHomeworkBuild('gen-s1'))!;
      assert.equal(b.problems[0].status, 'ready');
      assert.equal(b.problems[0].figure, null, 'the stale graph was not copied');
      assert.equal(b.problems[0].key!.parts[0].final, '5');
    });

    await section('HOMEWORK_FIGURE_KINDS: a valid cached box plot is copied under all, retried under geometry', async () => {
      // Controller ruling: the seed passes under `all` and fails only under `geometry`.
      const { BOX, boxFig } = await import('./fixtures/homework-figure-fixtures');
      const { validateFigure } = await import('../src/lib/tutor/homework-build/figure-validate');
      const text = BOX;
      const statsFig = boxFig();
      assert.deepEqual(validateFigure(statsFig, { problemText: text, claims: [] }), { ok: true }, 'the seed is valid under all');
      await ensureHomeworkBuild('gen-v2', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-v2', 1, {
        status: 'ready', figure: statsFig as never,
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-v3', [text]);
      const all = mkDeps();
      const prevAll = process.env.HOMEWORK_FIGURE_KINDS;
      delete process.env.HOMEWORK_FIGURE_KINDS;
      try {
        await runHomeworkBuild('gen-v3', 'greenapple', { deps: all.deps, concurrency: 1 });
      } finally {
        if (prevAll !== undefined) process.env.HOMEWORK_FIGURE_KINDS = prevAll;
      }
      assert.deepEqual(all.order, [], 'under all the cached box plot is copied, not rebuilt');
      assert.deepEqual((await getHomeworkBuild('gen-v3'))!.problems[0].figure, statsFig, 'the box plot was copied');

      await ensureHomeworkBuild('gen-v0', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-v0', 1, {
        status: 'ready', figure: statsFig as never,
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-v1', [text]);
      const { deps, order } = mkDeps();
      const vocabs: unknown[] = [];
      const inner = deps.figure.propose.bind(deps.figure);
      deps.figure.propose = async (i) => { vocabs.push(i.vocabulary); return inner(i); };
      const prev = process.env.HOMEWORK_FIGURE_KINDS;
      process.env.HOMEWORK_FIGURE_KINDS = 'geometry';
      try {
        await runHomeworkBuild('gen-v1', 'greenapple', { deps, concurrency: 1 });
      } finally {
        if (prev === undefined) delete process.env.HOMEWORK_FIGURE_KINDS; else process.env.HOMEWORK_FIGURE_KINDS = prev;
      }
      assert.deepEqual(order, [text], 'the figure was proposed again');
      assert.deepEqual(vocabs, ['geometry'], 'propose was told the vocabulary');
      const b = (await getHomeworkBuild('gen-v1'))!;
      assert.equal(b.problems[0].figure, null, 'the out-of-vocabulary figure was not copied');
      assert.equal(b.problems[0].key!.parts[0].final, '5', 'the verified key was reused');
    });

    await section('a cached ready graph stored with `expression` is copied with `expr` (hw-14 p8, F8)', async () => {
      // The board's renderers read expr | latex | fn; a cached figure is copied
      // through the same normaliser as a fresh one.
      await ensureHomeworkBuild('gen-e0', 'greenapple', [{ n: 1, text: HW14_P8 }]);
      await patchProblemBuild('gen-e0', 1, {
        status: 'ready', figure: hw14p8Fig() as never,
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'], steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-e1', [HW14_P8]);
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-e1', 'greenapple', { deps, concurrency: 1 });
      assert.deepEqual(order, [], 'copied, not rebuilt');
      const f = (await getHomeworkBuild('gen-e1'))!.problems[0].figure as unknown as { data: { functions: Array<Record<string, unknown>> } };
      assert.deepEqual(f.data.functions[0], { expr: '2.5*cos(3*x*pi/180)+0.5' });
    });
    await section('round 11: a cached key without a solution path is re-solved, the cached figure and svg are copied', async () => {
      const text = 'Steps 1 [Figure: a segment AB]';
      const fig = { action: 'showGeometryConstructed', given: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A' }, { id: 'B', kind: 'point', x: 4, y: 0, label: 'B' }], steps: [] };
      await ensureHomeworkBuild('gen-k0', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-k0', 1, {
        status: 'ready', figure: fig as never, figureSvg: '<svg/>',
        key: { parts: [{ label: '', final: '20', canonical: { kind: 'number', value: 20 } }], solvers: ['A', 'B'] }, verify: { agreed: true }, ms: 9,
      });
      await mkPlan('gen-k1', [text]);
      const { deps, order } = mkDeps();
      const keyed = async () => ({ parts: [{ label: '', final: '20', canonical: { kind: 'number', value: 20 } as const }], steps: [{ relation: 'r', value: 'x = 20' }], usage: { in: 3, out: 1 } });
      deps.key.solveA = keyed; deps.key.solveB = keyed;
      await runHomeworkBuild('gen-k1', 'greenapple', { deps, concurrency: 1 });
      assert.deepEqual(order, [], 'the figure was not rebuilt');
      const p = (await getHomeworkBuild('gen-k1'))!.problems[0];
      assert.equal(p.status, 'ready');
      assert.deepEqual((p.figure as unknown as typeof fig).given, fig.given, 'the cached figure is copied');
      assert.equal(p.figureSvg, '<svg/>');
      assert.deepEqual(p.key!.steps, [{ relation: 'r', value: 'x = 20' }]);
      assert.deepEqual(p.tokens, { in: 6, out: 2 });
    });
    await section('round 11: a failed-figure cache with a stepless key retries the figure AND re-solves the key; with steps the key is kept', async () => {
      const text = 'Retry 1 [Figure: a box ABCD]';
      const key = { parts: [{ label: '', final: '5', canonical: { kind: 'number' as const, value: 5 } }], solvers: ['A', 'B'] };
      await ensureHomeworkBuild('gen-b0', 'greenapple', [{ n: 1, text }]);
      await patchProblemBuild('gen-b0', 1, { status: 'ready', figure: null, key, verify: { agreed: true }, ms: 9 });
      await mkPlan('gen-b1', [text]);
      const a = mkDeps();
      let solves = 0;
      const keyed = async () => { solves++; return { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } as const }], steps: [{ relation: 'r', value: 'x = 5' }], usage: { in: 3, out: 1 } }; };
      a.deps.key.solveA = keyed; a.deps.key.solveB = keyed;
      await runHomeworkBuild('gen-b1', 'greenapple', { deps: a.deps, concurrency: 1 });
      assert.deepEqual(a.order, [text], 'the figure was proposed again');
      assert.equal(solves, 2, 'the stepless key was re-solved');
      const p = (await getHomeworkBuild('gen-b1'))!.problems[0];
      assert.equal(p.status, 'ready');
      assert.deepEqual(p.key!.steps, [{ relation: 'r', value: 'x = 5' }]);
      assert.deepEqual(p.tokens, { in: 6 + 4, out: 2 + 1 }, 'figure and key tokens summed');
      // With steps already stored, the key is kept and not re-solved.
      await ensureHomeworkBuild('gen-b2', 'greenapple', [{ n: 1, text: 'Retry 2 [Figure: a box ABCD]' }]);
      await patchProblemBuild('gen-b2', 1, { status: 'ready', figure: null, key: { ...key, steps: [{ relation: 'x = 5' }] }, verify: { agreed: true }, ms: 9 });
      await mkPlan('gen-b3', ['Retry 2 [Figure: a box ABCD]']);
      const c = mkDeps();
      let solves2 = 0;
      c.deps.key.solveA = async () => { solves2++; return { parts: null }; };
      await runHomeworkBuild('gen-b3', 'greenapple', { deps: c.deps, concurrency: 1 });
      assert.deepEqual(c.order, ['Retry 2 [Figure: a box ABCD]']);
      assert.equal(solves2, 0, 'a key with steps is kept');
      assert.deepEqual((await getHomeworkBuild('gen-b3'))!.problems[0].key!.steps, [{ relation: 'x = 5' }]);
    });

    await section('final review (I2): a stepless re-solve that yields no key keeps the verified key (figure copied; figure retried)', async () => {
      const key = { parts: [{ label: '', final: '20', canonical: { kind: 'number' as const, value: 20 } }], solvers: ['A', 'B'] };
      const verify = { agreed: true };
      const fig = { action: 'showGeometryConstructed', given: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A' }, { id: 'B', kind: 'point', x: 4, y: 0, label: 'B' }], steps: [] };
      const failing = async () => ({ parts: null, usage: { in: 3, out: 1 } });
      // Branch 1: the cached figure is copied, the key re-solve fails.
      await ensureHomeworkBuild('gen-d0', 'greenapple', [{ n: 1, text: 'Demote 1 [Figure: a segment AB]' }]);
      await patchProblemBuild('gen-d0', 1, { status: 'ready', figure: fig as never, figureSvg: '<svg/>', key, verify, ms: 9 });
      await mkPlan('gen-d1', ['Demote 1 [Figure: a segment AB]']);
      const a = mkDeps();
      a.deps.key.solveA = failing; a.deps.key.solveB = failing;
      await runHomeworkBuild('gen-d1', 'greenapple', { deps: a.deps, concurrency: 1 });
      assert.deepEqual(a.order, [], 'the figure was not rebuilt');
      const p1 = (await getHomeworkBuild('gen-d1'))!.problems[0];
      assert.equal(p1.status, 'ready', 'never demoted to unverified');
      assert.deepEqual(p1.key, key, 'kept, and NOT marked tried: a failed re-solve retries later (B9 review)'); assert.deepEqual(p1.verify, verify);
      assert.deepEqual((p1.figure as unknown as typeof fig).given, fig.given); assert.equal(p1.figureSvg, '<svg/>');
      assert.deepEqual(p1.tokens, { in: 6, out: 2 }, 'tokens still summed');
      // Branch 3: the figure is retried, the key re-solve fails.
      await ensureHomeworkBuild('gen-d2', 'greenapple', [{ n: 1, text: 'Demote 2 [Figure: a box ABCD]' }]);
      await patchProblemBuild('gen-d2', 1, { status: 'ready', figure: null, key, verify, ms: 9 });
      await mkPlan('gen-d3', ['Demote 2 [Figure: a box ABCD]']);
      const b = mkDeps();
      b.deps.key.solveA = failing; b.deps.key.solveB = failing;
      await runHomeworkBuild('gen-d3', 'greenapple', { deps: b.deps, concurrency: 1 });
      assert.deepEqual(b.order, ['Demote 2 [Figure: a box ABCD]'], 'the figure dep was called');
      const p2 = (await getHomeworkBuild('gen-d3'))!.problems[0];
      assert.equal(p2.status, 'ready');
      assert.deepEqual(p2.key, key); assert.deepEqual(p2.verify, verify);
    });

    await section('B9: a stepless key marked stepsTried is copied on a cache hit, not re-solved', async () => {
      const key = { parts: [{ label: '', final: '9', canonical: { kind: 'number' as const, value: 9 } }], solvers: ['A', 'B'], stepsTried: true };
      await ensureHomeworkBuild('gen-t0', 'greenapple', [{ n: 1, text: 'Tried 1' }]);
      await patchProblemBuild('gen-t0', 1, { status: 'ready', figure: null, key, verify: { agreed: true }, ms: 9 });
      await mkPlan('gen-t1', ['Tried 1']);
      const d = mkDeps();
      let solves = 0;
      d.deps.key.solveA = async () => { solves++; return { parts: null }; };
      d.deps.key.solveB = async () => { solves++; return { parts: null }; };
      await runHomeworkBuild('gen-t1', 'greenapple', { deps: d.deps, concurrency: 1 });
      assert.equal(solves, 0, 'not re-solved');
      assert.deepEqual((await getHomeworkBuild('gen-t1'))!.problems[0].key, key);
    });

    await section('an unverified cached entry is ignored and rebuilt', async () => {
      await ensureHomeworkBuild('gen-u0', 'greenapple', [{ n: 1, text: 'Unver 1' }]);
      await patchProblemBuild('gen-u0', 1, { status: 'unverified', verify: { agreed: false } });
      await mkPlan('gen-u1', ['Unver 1']);
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-u1', 'greenapple', { deps });
      assert.deepEqual(order, ['Unver 1']);
      assert.equal((await getHomeworkBuild('gen-u1'))!.problems[0].status, 'ready');
    });

    await section('an infrastructure throw leaves the problem preparing; a later run builds it', async () => {
      await mkPlan('gen-r3', ['Thrower 1', 'Ok 2', 'Ok 3']);
      const { deps } = mkDeps();
      // solveKey/buildFigure are total; a throw around a problem is infrastructure
      // (here: names throwing on its first read) and must not become a verdict.
      let reads = 0;
      const names = deps.key.names;
      Object.defineProperty(deps.key, 'names', { get() { if (reads++ === 0) throw new Error('boom'); return names; } });
      await runHomeworkBuild('gen-r3', 'greenapple', { first: 1, deps, concurrency: 1 });
      let b = (await getHomeworkBuild('gen-r3'))!;
      assert.deepEqual(b.problems.map((p) => p.status), ['preparing', 'ready', 'ready']);
      assert.equal(b.done, false);
      const again = mkDeps();
      await runHomeworkBuild('gen-r3', 'greenapple', { deps: again.deps, concurrency: 1 });
      assert.deepEqual(again.order, ['Thrower 1']);
      b = (await getHomeworkBuild('gen-r3'))!;
      assert.equal(b.done, true); assert.equal(b.problems[0].status, 'ready');
    });

    await section('buildStatusResponse carries figureSvg only when the build has one', async () => {
      const { buildStatusResponse } = await import('../src/lib/tutor/homework-build/status');
      await ensureHomeworkBuild('gen-svg', 'greenapple', [{ n: 1, text: 'Svg 1' }, { n: 2, text: 'Svg 2' }]);
      await patchProblemBuild('gen-svg', 1, { status: 'ready', figure: { action: 'showGeometryConstructed', given: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A' }], steps: [] }, figureSvg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>', key: null, verify: { agreed: false } });
      const r = buildStatusResponse((await getHomeworkBuild('gen-svg'))!, 'greenapple')!;
      assert.equal(r.problems[0].figureSvg, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
      assert.equal(r.problems[0].hasFigure, true);
      assert.equal('figureSvg' in r.problems[1], false);
    });
    await section('buildStatusResponse: partner-scoped, finals only when agreed, no key/canonical leak', async () => {
      const { buildStatusResponse } = await import('../src/lib/tutor/homework-build/status');
      const b = (await getHomeworkBuild('gen-r1'))!;
      assert.equal(buildStatusResponse(b, 'other'), null);
      const r = buildStatusResponse(b, 'greenapple')!;
      assert.deepEqual(r.problems[0].finals, ['5']);
      const json = JSON.stringify(r);
      assert.doesNotMatch(json, /canonical|"key"|solvers/);
      const unagreed = { ...b, problems: [{ ...b.problems[0], verify: { agreed: false, candidates: ['1', '2'] }, key: null }] };
      const u = buildStatusResponse(unagreed, 'greenapple')!;
      assert.equal('finals' in u.problems[0], false);
      assert.deepEqual(u.problems[0].verify.candidates, ['1', '2']);
    });

    await section('a non-homework or missing plan is a no-op', async () => {
      const { deps, order } = mkDeps();
      await runHomeworkBuild('gen-nope', 'greenapple', { deps });
      assert.equal(order.length, 0);
      assert.equal(await getHomeworkBuild('gen-nope'), null);
    });

    await section('constants; plan-generate never kicks a build (R18)', () => {
      assert.equal(BUILD_STALE_MS, 180_000);
      const src = fs.readFileSync('src/app/api/portal/v1/plan-generate/route.ts', 'utf8');
      // R18: plan-generate never starts a build; the academy's POST
      // /homework-build and the mint route's kick-if-missing are the triggers.
      assert.doesNotMatch(src, /kickHomeworkBuild/);
      assert.match(fs.readFileSync('src/app/api/portal/v1/homework-build/route.ts', 'utf8'), /kickHomeworkBuild\(/);
      assert.match(fs.readFileSync('src/app/api/portal/v1/homework-problem-plan/route.ts', 'utf8'), /kickHomeworkBuild\(/);
    });
  }

  assertTestDb();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
