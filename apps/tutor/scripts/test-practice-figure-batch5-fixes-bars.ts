/**
 * Practice-figure renderer — batch 5, part "fixes-bars": the to-dos
 *   b — bar_chart: a bar left out as a "?" in a chart with one bar per
 *       category (was refused), beside printed values (`showValues`);
 *   g — bar_chart and heating_curve: a value that has to be read off a
 *       LIGHTER gridline makes the grid one step darker; a value on no line
 *       of an axis the spec fixed is reported (`off_grid`).
 * The checkers' side of (b) is in scripts/practice-extend/figure-core.test.ts.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-fixes-bars.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { buildFrame, gridPlace, minorStepOf } from '../src/lib/tutor/practice-figure/plot-frame';
import { FIGURE_FIXTURES } from './lib/practice-figure-fixtures';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-fixes-bars';
import { count, has, makeRunner, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const fx = (id: string): Params => ([...FIXTURES, ...FIGURE_FIXTURES].find((f) => f.id === id) ?? assert.fail(id)).spec.params;
const B = (params: Params): string => svgOf('bar_chart', params);
const H = (params: Params): string => svgOf('heating_curve', params);
const FAINT = /stroke="#e9eef4" stroke-width="0\.7"/;
const STRONG_MINOR = /stroke="#cbd5e1" stroke-width="0\.8"/;
const STRONG_MAJOR = /stroke="#94a3b8" stroke-width="1\.1"/;
const isStrong = (svg: string): boolean => STRONG_MINOR.test(svg) && STRONG_MAJOR.test(svg) && !FAINT.test(svg);
const isFaint = (svg: string): boolean => FAINT.test(svg) && !STRONG_MINOR.test(svg) && !STRONG_MAJOR.test(svg);

console.log('\nb — a bar left out, beside printed values:\n');

test('b: a chart with one bar per category draws a bar given as null (or "?") as the dashed "?" box — no bar, no value; the other bars as ever', () => {
  const p = fx('fix5-b-bars-plain-blank-bar');
  const svg = B(p);
  assert.equal(texts(svg).filter((t) => t === '?').length, 1);
  assert.equal(count(svg, /stroke-dasharray="3 2"/g), 1);
  assert.equal(count(svg, /<rect [^>]*fill="#1d4ed8"\/>/g), 4, 'four bars drawn, the fifth left out');
  assert.equal(B({ ...p, values: [20, 35, 30, '?', 25] }), svg, '"?" is the same as null');
  // The bars that are drawn stand exactly where they stand in the full chart (the hidden one is 40: inside the same axis).
  const full = B({ ...p, values: [20, 35, 30, 40, 25] });
  const rects = (s: string): string[] => [...s.matchAll(/<rect [^>]*fill="#1d4ed8"\/>/g)].map((m) => m[0]);
  assert.deepEqual(rects(svg), rects(full).filter((_, i) => i !== 3));
  // The "?" box is drawn after the baseline (it stands on it).
  assert.ok(svg.indexOf('stroke-dasharray="3 2"') > svg.lastIndexOf('<line '));
});

test('b: showValues prints the value over every drawn bar and nothing over the one left out — in a plain and in a grouped chart', () => {
  const p = fx('fix5-b-bars-plain-blank-bar');
  const svg = B({ ...p, showValues: true });
  for (const v of ['20', '35', '30', '25']) assert.ok(count(svg, new RegExp(`font-weight="600"[^>]*>${v}</text>`, 'g')) === 1, v);
  assert.equal(texts(svg).filter((t) => t === '?').length, 1);
  const g = B(fx('fix5-b-bars-values-printed-blank'));
  for (const v of ['6.5', '42.5', '27', '37', '12']) assert.ok(has(g, v), v);
  assert.equal(texts(g).filter((t) => t === '?').length, 1);
  assert.ok(!has(g, '22'), 'the hidden kinetic energy is nowhere in the picture');
  const series = (fx('fix5-b-bars-values-printed-blank').series as Array<{ label: string; values: unknown[] }>).map((s, k) => (k === 0 ? { ...s, values: [6.5, '?', 37] } : s));
  assert.equal(B({ ...fx('fix5-b-bars-values-printed-blank'), series }), g, 'a "?" in a series is a bar left out too');
});

test('b: refusals and warnings — every bar left out; a text that is not "?"; a "?" box wider than its column', () => {
  throwsSpec('bar_chart', { categories: ['a', 'b'], values: [null, '?'] }, /values: every bar is left out — there is nothing to draw/);
  throwsSpec('bar_chart', { categories: ['a', 'b'], values: [3, 'x'] }, /values must be 2 numbers/);
  throwsSpec('bar_chart', { categories: ['a', 'b'], series: [{ label: 's', values: [1, 'x'] }, { label: 't', values: [1, 2] }] }, /series\[0\]\.values\[1\] must be a finite number/);
  const many = { categories: Array.from({ length: 20 }, (_, i) => `c${i}`), values: Array.from({ length: 20 }, (_, i) => (i === 7 ? null : 10)), yMin: 0, yMax: 20, yStep: 10 };
  assert.ok(warn('bar_chart', many).includes('crowded'));
  assert.deepEqual(warn('bar_chart', fx('fix5-b-bars-plain-blank-bar')), []);
  assert.deepEqual(warn('bar_chart', fx('fix5-b-bars-values-printed-blank')), []);
});

console.log('\ng — values on the lighter gridlines:\n');

test('g: gridPlace / minorStepOf — a numbered line, a lighter line between two, or neither', () => {
  assert.equal(minorStepOf(20), 10);
  assert.equal(minorStepOf(5), 1);
  assert.equal(minorStepOf(0.1), 0.05);
  assert.deepEqual([40, 30, 35, 0, -10].map((v) => gridPlace(v, 20)), ['major', 'minor', 'off', 'major', 'minor']);
  assert.deepEqual([0.3, 0.35, 0.33].map((v) => gridPlace(v, 0.1)), ['major', 'minor', 'off']);
  assert.deepEqual([15, 12, 12.5].map((v) => gridPlace(v, 5)), ['major', 'minor', 'off']);
});

test('g: buildFrame `minorGridStrong` is opt-in — without it the frame is byte-identical; with it both kinds of line are one step darker', () => {
  const o = { xRange: [0, 10] as [number, number], yRange: [0, 100] as [number, number], xStep: 2, yStep: 20 };
  assert.equal(buildFrame({ ...o, minorGridStrong: false }).svg, buildFrame(o).svg);
  assert.ok(isFaint(buildFrame(o).svg));
  const strong = buildFrame({ ...o, minorGridStrong: true }).svg;
  assert.ok(isStrong(strong));
  assert.equal(strong.replace(STRONG_MINOR, 'stroke="#e9eef4" stroke-width="0.7"').replace(STRONG_MAJOR, 'stroke="#cbd5e1" stroke-width="0.9"'), buildFrame(o).svg, 'only the two grid strokes differ');
  assert.ok(isFaint(buildFrame({ ...o, minorGrid: false, minorGridStrong: true }).svg.replace(/stroke="#cbd5e1" stroke-width="0\.9"/, 'stroke="#e9eef4" stroke-width="0.7"')), 'with no lighter lines there is nothing to darken');
});

test('g: a bar chart is darker exactly when a bar ends on a lighter line; `strongGrid` overrides; printed values need no grid', () => {
  const p = fx('fix5-g-bars-on-minor-lines');
  assert.ok(isStrong(B(p)), '30, 50 and 70 end on lighter lines');
  assert.ok(isFaint(B({ ...p, values: [40, 80, 60, 20] })), 'every bar on a numbered line: as ever');
  assert.ok(isFaint(B({ ...p, strongGrid: false })));
  assert.ok(isStrong(B({ ...p, values: [40, 80, 60, 20], strongGrid: true })));
  assert.ok(isFaint(B({ ...p, showValues: true })), 'the values are printed: nothing is read off the grid');
  throwsSpec('bar_chart', { ...p, strongGrid: 'yes' }, /strongGrid must be true or false/);
  // Only the grid strokes change: the bars, the numbers and the labels are where they were.
  assert.equal(B(p).replace(STRONG_MINOR, 'stroke="#e9eef4" stroke-width="0.7"').replace(STRONG_MAJOR, 'stroke="#cbd5e1" stroke-width="0.9"'), B({ ...p, strongGrid: false }));
  // Grouped bars follow the same rule; a bar left out does not count.
  const grouped = { categories: ['a', 'b'], series: [{ label: 's', values: [10, null] }, { label: 't', values: [20, 30] }], yMin: 0, yMax: 40, yStep: 10 };
  assert.ok(isFaint(B(grouped)));
  assert.ok(isStrong(B({ ...grouped, series: [{ label: 's', values: [15, null] }, { label: 't', values: [20, 30] }] })));
  // The earlier fixtures the round redrew for this: bars on lighter lines of an automatic axis.
  assert.ok(isStrong(B(fx('bar-books-sold'))) && isStrong(B(fx('bar-many-long-labels-negative'))));
  for (const id of ['bars-grouped-observed-expected', 'bars-grouped-energy-three-states', 'bars-grouped-blank-allele-frequency', 'bars-grouped-values-printed', 'bar-wrapped-labels-values']) assert.ok(isFaint(B(fx(id))), id);
});

test('g: off_grid — a bar on no line of an axis the spec fixed is reported; an automatic axis, printed values and bars on lines are not', () => {
  const w = checkFigureLegibility({ type: 'bar_chart', params: fx('fix5-g-bars-off-grid-warns') });
  assert.deepEqual(w.map((x) => x.code), ['off_grid']);
  assert.match(w[0].message, /2 bars end on no gridline \(37, 12\) — the lines are 5 apart; use values on a line, change yStep, or print the values \(showValues\)/);
  assert.deepEqual(warn('bar_chart', { ...fx('fix5-g-bars-off-grid-warns'), showValues: true }), []);
  assert.deepEqual(warn('bar_chart', { categories: ['Red', 'Blue'], values: [37, 12] }), [], 'an axis left to the layout promises no exact reading');
  assert.deepEqual(warn('bar_chart', fx('fix5-g-bars-on-minor-lines')), []);
  assert.match(checkFigureLegibility({ type: 'bar_chart', params: { categories: ['a', 'b'], series: [{ label: 's', values: [3, 10] }, { label: 't', values: [20, 30] }], yMin: 0, yMax: 40, yStep: 10 } })[0].message, /^a bar ends on no gridline \(3\)/);
});

test('g: a heating curve is darker when a corner or a mark sits on a lighter line; a corner on no line of a fixed step is reported; a computed curve never is', () => {
  const p = fx('fix5-g-heating-on-minor-lines');
  assert.ok(isStrong(H(p)), 'plateaus at 10 °C and 90 °C, corners at 5 and 9 kJ');
  assert.deepEqual(warn('heating_curve', p), []);
  assert.ok(isFaint(H({ ...p, strongGrid: false })));
  const major = { corners: [[0, -20], [4, 0], [8, 0], [12, 80], [24, 80], [28, 100]], xStep: 4, yStep: 20 };
  assert.ok(isFaint(H(major)), 'every corner on numbered lines: as ever');
  assert.ok(isStrong(H({ ...major, marks: [{ x: 6, label: 'P' }] })), 'a mark on a lighter line');
  assert.ok(isStrong(H({ ...major, strongGrid: true })));
  // Unnumbered axes have no lines to read.
  assert.ok(!STRONG_MINOR.test(H(fx('heating-blank-plateaus-cooling'))));
  const off = checkFigureLegibility({ type: 'heating_curve', params: { corners: [[0, -20], [3, 0], [8, 0], [12, 85], [24, 85], [28, 100]], xStep: 4, yStep: 20 } });
  assert.deepEqual(off.map((x) => x.code), ['off_grid']);
  assert.match(off[0].message, /corners: x = 3, 85 °C are on no gridline \(the lines are 2 apart across and 10 °C apart up\)/);
  // Steps left to the layout: nothing is promised, nothing is reported.
  assert.deepEqual(warn('heating_curve', { corners: [[0, -20], [3, 0], [8, 0], [12, 85], [24, 85], [28, 100]] }), []);
  assert.ok(!warn('heating_curve', fx('heating-dense-water-computed')).includes('off_grid'));
  assert.deepEqual(warn('heating_curve', fx('heating-simple-lettered')), []);
  assert.ok(isStrong(H(fx('heating-simple-lettered'))), 'corners at 2, 14 and 26 kJ on lighter lines (steps of 4)');
});

void finish();
