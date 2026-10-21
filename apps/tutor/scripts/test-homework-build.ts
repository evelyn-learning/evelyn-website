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
    const { validateFigure, labelIsFromText, allowedLabelTokens, checkClaims } =
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
      assert.ok(allowedLabelTokens(P5).has('AD = 6')); assert.ok(!allowedLabelTokens(P5).has('DB = 9'));
    });
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
    await section('graph point off the curve fails; invented point label fails', () => {
      const off = validateFigure(graph({ points: [{ x: PI / 4, y: 3.2 }] }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(off).some((r) => r.includes('not on any plotted function')), reasonsOf(off).join(' | '));
      const lab = validateFigure(graph({ points: [{ x: PI / 4, y: 4, label: 'max = 4' }] }), { problemText: P8, claims: [] });
      assert.ok(reasonsOf(lab).some((r) => r.includes('label')), reasonsOf(lab).join(' | '));
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

  assertTestDb();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
