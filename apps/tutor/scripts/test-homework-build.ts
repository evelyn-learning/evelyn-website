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
    await section('a synchronously throwing extractClaims cannot escape', async () => {
      const d: Deps = { async propose() { return { figure: null, claims: [], note: 'no figure' }; }, extractClaims() { throw new Error('sync'); } };
      const r = await buildFigure({ n: 1, text: 'x' }, d);
      assert.equal(r.attempts, 1);
    });
    await section('parseProposal / normalizeClaims: malformed figure_json -> null; bad claims dropped', () => {
      const bad = parseProposal({ figure_json: '{nope', claims: [{ kind: 'on_segment', point: 'D', segment: ['A', 'B'] }] });
      assert.equal(bad.figure, null); assert.equal(bad.note, 'propose_failed:parse'); assert.equal(bad.claims.length, 1);
      assert.equal(parseProposal({ figure_json: '', claims: [] }).figure, null);
      assert.equal(parseProposal({ figure_json: '{"action":"nope"}', claims: [] }).figure, null);
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
    await section('system prompt carries the structural rules', () => {
      assert.match(FIGURE_PROPOSE_SYSTEM, /section_point: \{ kind: "section_point", of: [^\n]*ratio: \[m, n\]/);
      assert.match(FIGURE_PROPOSE_SYSTEM, /parallel_through: \{ kind: "parallel_through", through: pointId/);
      assert.match(FIGURE_PROPOSE_SYSTEM, /never.*free coordinates/i);
      assert.match(FIGURE_PROPOSE_SYSTEM, /xAxisStep/);
    });
  }

  // ---- 4 key (pure: stub solvers, no Mongo, no model) ----
  console.log('4 key');
  {
    const { solveKey, partsAgree, KEY_SOLVE_SYSTEM, normalizeKeyParts } = await import('../src/lib/tutor/homework-build/key-solve');
    type AP = Parameters<typeof partsAgree>[0];
    const num = (final: string, value: number, label = '', units?: string): AP[number] =>
      ({ label, final, canonical: { kind: 'number', value, ...(units ? { units } : {}) } });
    const txt = (final: string, label = ''): AP[number] => ({ label, final, canonical: { kind: 'text', value: final } });
    const mk = (a: AP | null, b: AP | null, t: AP | null) => {
      const calls = { a: 0, b: 0, t: 0 };
      return { calls, names: ['A', 'B', 'T'] as [string, string, string],
        solveA: async () => { calls.a++; return { parts: a, usage: { in: 100, out: 10 } }; }, solveB: async () => { calls.b++; return { parts: b, usage: { in: 100, out: 10 } }; }, solveTieBreak: async () => { calls.t++; return { parts: t, usage: { in: 50, out: 5 } }; } };
    };
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
      assert.equal(partsAgree([num('1', 1, 'a')], [num('1', 1, 'b')]), false);
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
          async solveA() { return { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], usage: { in: 20, out: 2 } }; },
          async solveB() { return { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], usage: { in: 20, out: 2 } }; },
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
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'] }, verify: { agreed: true }, ms: 9,
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
      await patchProblemBuild('gen-f2', 1, { status: 'ready', figure: null, key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'] }, verify: { agreed: true }, ms: 9 });
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
        key: { parts: [{ label: '', final: '5', canonical: { kind: 'number', value: 5 } }], solvers: ['A', 'B'] }, verify: { agreed: true }, ms: 9,
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
