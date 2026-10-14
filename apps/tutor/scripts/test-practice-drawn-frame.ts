/**
 * Drawn answers (contract v1.22.0) — the coordinate frame a figure is drawn
 * on, exported beside its SVG so the academy's drawing overlay lines up with
 * the picture (practice-figure/render.ts `renderPracticeFigureWithFrame`).
 *
 * Under test:
 *   - `coordinate_grid`: a blank numbered grid (the base of a plot-points /
 *     plot-a-line item) — its frame is the `buildFrame` plot rect and ranges,
 *     and it is exactly the rect drawn in the SVG;
 *   - `number_line`: its frame (`y`, `x0`, `x1`, `min`, `max`) puts every tick
 *     at the x the SVG draws it, and the SVG is the same string as before;
 *   - the frame's viewBox is the SVG root's viewBox;
 *   - a kind with no frame returns none.
 *
 * Pure: no database, no network. Run: npm run test:practice-drawn-frame
 */
import { strict as assert } from 'node:assert';
import { DrawnGridFrameSchema, DrawnNumberLineFrameSchema } from '@evelyn/portal-contract/v1';
import { inspectPracticeFigure, renderPracticeFigure, renderPracticeFigureWithFrame } from '@/lib/tutor/practice-figure/render';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

const viewBoxOf = (svg: string): [number, number] => {
  const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  assert.ok(m, 'svg has a viewBox');
  return [Number(m[1]), Number(m[2])];
};
const close = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `${a} ≈ ${b}`);

console.log('\ncoordinate_grid:\n');

test('a blank grid renders, with a grid frame whose plot rect is the one drawn', () => {
  const spec = { type: 'coordinate_grid', params: { xRange: [-5, 5], yRange: [-4, 4] } };
  const { svg, frame } = renderPracticeFigureWithFrame(spec);
  assert.ok(frame && frame.kind === 'grid');
  assert.deepEqual(frame.xRange, [-5, 5]);
  assert.deepEqual(frame.yRange, [-4, 4]);
  assert.deepEqual(frame.viewBox, viewBoxOf(svg));
  const p = frame.plot;
  // The frame border buildFrame draws: fill="none" stroke rect at exactly the plot rect.
  const rect = new RegExp(`<rect x="${+p.x.toFixed(2)}" y="${+p.y.toFixed(2)}" width="${+p.w.toFixed(2)}" height="${+p.h.toFixed(2)}" fill="none"`);
  assert.ok(rect.test(svg), 'the plot rect is drawn where the frame says');
  // Data → SVG: the y = 0 axis line sits at Y(0).
  const y0 = p.y + p.h - ((0 - -4) / 8) * p.h;
  assert.ok(svg.includes(`y1="${+y0.toFixed(2)}"`), 'the x-axis is at Y(0)');
  // Contract shape (minus the engine-only `kind` tag).
  const { kind: _k, ...wire } = frame;
  DrawnGridFrameSchema.parse(wire);
  assert.equal(svg, renderPracticeFigure(spec).svg, 'the same picture as the plain renderer');
});

test('a blank grid draws no data: no point, curve or series colour', () => {
  const { svg } = renderPracticeFigureWithFrame({ type: 'coordinate_grid', params: { xRange: [0, 10], yRange: [0, 10], xLabel: 'x', yLabel: 'y' } });
  assert.ok(!/<circle/.test(svg));
  assert.ok(!svg.includes('#1d4ed8'));
});

test('bad params name the param', () => {
  assert.throws(() => renderPracticeFigureWithFrame({ type: 'coordinate_grid', params: { xRange: [5, -5], yRange: [0, 1] } }), /xRange/);
  assert.throws(() => renderPracticeFigureWithFrame({ type: 'coordinate_grid', params: { yRange: [0, 1] } }), /xRange/);
});

console.log('\nnumber_line:\n');

test('the frame maps every tick to the x the SVG draws it at; viewBox matches', () => {
  const spec = { type: 'number_line', params: { min: -6, max: 6, step: 1 } };
  const { svg, frame } = renderPracticeFigureWithFrame(spec);
  assert.ok(frame && frame.kind === 'number-line');
  assert.deepEqual(frame.viewBox, viewBoxOf(svg));
  assert.equal(frame.min, -6);
  assert.equal(frame.max, 6);
  const X = (v: number) => frame.x0 + ((v - frame.min) / (frame.max - frame.min)) * (frame.x1 - frame.x0);
  for (const v of [-6, -1, 0, 3, 6]) {
    const x = +X(v).toFixed(2);
    assert.ok(svg.includes(`<line x1="${x}" y1="${+(frame.y - 6).toFixed(2)}" x2="${x}" y2="${+(frame.y + 6).toFixed(2)}"`), `tick ${v} at x=${x}, around y=${frame.y}`);
  }
  const { kind: _k, ...wire } = frame;
  DrawnNumberLineFrameSchema.parse(wire);
});

test('adding the frame did not change the number_line SVG', () => {
  const spec = { type: 'number_line', params: { min: 0, max: 10, intervals: [{ from: 2, to: null, fromOpen: true }] } };
  assert.equal(renderPracticeFigureWithFrame(spec).svg, inspectPracticeFigure(spec).svg);
  assert.equal(renderPracticeFigureWithFrame(spec).svg, renderPracticeFigure(spec).svg);
});

console.log('\nOther kinds:\n');

test('a kind without a frame returns the svg and no frame', () => {
  const r = renderPracticeFigureWithFrame({ type: 'function_graph', params: { xRange: [-4, 4], yRange: [-4, 4], curves: [{ expr: 'x' }] } });
  assert.ok(r.svg.startsWith('<svg'));
  assert.equal(r.frame, undefined);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
