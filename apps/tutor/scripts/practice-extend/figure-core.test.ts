/**
 * Tests for scripts/practice-extend/figure-core.ts (pure — no network, no
 * model; the no-db import keeps anything the renderer loads off a database).
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIGURE_QUALITY_CHECKS, FIGURE_STRICT_CHECKS, contestedFlags, qualityFlags, validateItem } from './core';
import {
  CHECKERS,
  FigureRuleError,
  axesOf,
  checkerCatalogue,
  compareDerived,
  describeFigure,
  examineFigureItem,
  hygieneDefects,
  normaliseSpec,
  restatesFigure,
  unreadableFeatures,
  kindChoiceOf,
  neededGroup,
  numbersIn,
  onGrid,
  pickFigureSample,
  readOff,
  runChecker,
  solverQuestion,
  validateFigureItem,
  type Derived,
  type FigureItem,
  type KindChoice,
} from './figure-core';
import { FIGURE_GENERATE_SYSTEM, buildKindPrompt } from './figure-prompts';
import { buildQualityPrompt } from './prompts';

let passed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL ${name}\n  ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

// ── fixtures: one spec per kind, every axis explicit ────────────────────────

const S: Record<string, PracticeFigureSpec> = {
  fn: { type: 'function_graph', params: { xRange: [-4, 4], yRange: [-6, 6], xStep: 1, yStep: 1, curves: [{ expr: 'x^2 - 4', label: 'f' }, { expr: 'x - 2', label: 'g' }], points: [{ x: 1, y: 3, label: 'P' }, { x: 3, y: -1, label: 'Q' }] } },
  motion: { type: 'motion_graph', params: { quantity: 'velocity', series: [{ points: [[0, 0], [2, 8], [6, 8], [8, 0], [10, -4]] }], tRange: [0, 10], yRange: [-6, 10], tStep: 1, yStep: 2 } },
  bars: { type: 'bar_chart', params: { categories: ['North', 'South', 'East', 'West'], values: [30, 45, 20, 45 - 10], yMin: 0, yMax: 50, yStep: 10, yLabel: 'Count' } },
  dots: { type: 'line_plot', params: { values: [1, 2, 2, 3, 3, 3, 4, 6], step: 1, xLabel: 'Items' } },
  scatter: { type: 'scatter_plot', params: { points: [{ x: 1, y: 2, label: 'A' }, { x: 3, y: 6, label: 'B' }, [2, 5], [4, 7], [5, 3]], xRange: [0, 6], yRange: [0, 10], xStep: 1, yStep: 2, trendLine: { slope: 2, intercept: 0 } } },
  field: { type: 'slope_field', params: { expr: 'x - y', xRange: [-3, 3], yRange: [-3, 3], xStep: 1, yStep: 1, gridStep: 1 } },
  rc: { type: 'reaction_coordinate', params: { reactantsEnergy: 40, productsEnergy: 20, activationEnergies: [60, 30], curveLabels: ['P', 'Q'] } },
  titration: { type: 'titration_curve', params: { analyte: { type: 'weak_acid', concentration: 0.1, volume: 20, pKa: 5 }, titrantConcentration: 0.1, maxVolume: 40 } },
  fbd: { type: 'free_body_diagram', params: { object: { shape: 'box', label: 'crate' }, surface: { type: 'horizontal' }, forces: [{ name: 'N', direction: 'up' }, { name: 'W', magnitude: '50 N', direction: 'down' }, { name: 'F', magnitude: '30 N', direction: 'right' }, { name: 'f', magnitude: '12 N', direction: 'left' }] } },
};

const value = (d: Derived): number => (d.kind === 'number' ? d.value : NaN);
const run = (spec: PracticeFigureSpec, checker: string, args: Record<string, unknown> = {}): Derived => runChecker(spec, { checker, args });
const refused = (fn: () => unknown, re: RegExp): void => { assert.throws(fn, (e: unknown) => e instanceof FigureRuleError && re.test((e as Error).message)); };

/** An item around a spec, for `compareDerived` / `examineFigureItem`. */
function item(spec: PracticeFigureSpec, over: Partial<FigureItem>): FigureItem {
  return {
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'numeric', problemText: 'Use the graph shown. What value does it give?', answer: '0', choices: [], hints: ['Read the grid.'],
    solutionText: 'Read it off.', difficulty: 2, covers: 'reading the figure', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A figure on a numbered grid.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rightAndWrong(spec: PracticeFigureSpec, checker: string, args: Record<string, unknown>, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker}: ${right} should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker}: ${wrong} should not match`);
}

// ── axes and the grid ───────────────────────────────────────────────────────

test('axes: every numbered axis must be explicit', () => {
  refused(() => axesOf({ type: 'function_graph', params: { xRange: [-4, 4], yRange: [-4, 4], curves: [{ expr: 'x' }] } }), /xStep must be given/);
  refused(() => axesOf({ type: 'bar_chart', params: { categories: ['a'], values: [1] } }), /yMin, yMax and yStep/);
  refused(() => axesOf({ type: 'motion_graph', params: { series: [{ points: [[0, 0], [1, 1]] }], tRange: [0, 5], tStep: 1 } }), /yRange must be given/);
  refused(() => axesOf({ type: 'titration_curve', params: { analyte: { type: 'strong_acid', concentration: 0.1, volume: 25 }, titrantConcentration: 0.1 } }), /maxVolume must be given/);
  refused(() => axesOf({ type: 'function_graph', params: { xRange: [-4.5, 4], yRange: [-4, 4], xStep: 1, yStep: 1 } }), /multiples of the step/);
  refused(() => axesOf({ type: 'function_graph', params: { xRange: [0, 100], yRange: [-4, 4], xStep: 1, yStep: 1 } }), /between 2 and 12 steps/);
  refused(() => axesOf({ type: 'line_plot', params: { values: [1, 1.5], step: 1 } }), /multiple of step/);
  refused(() => axesOf({ type: 'pie_chart', params: {} }), /unknown figure kind/);
});

test('axes: minor gridlines — halves of 1 and 2, fifths of 5', () => {
  assert.equal(axesOf(S.fn).x!.minor, 0.5);
  assert.equal(axesOf(S.motion).y!.minor, 1);
  assert.equal(axesOf({ type: 'bar_chart', params: { categories: ['a'], values: [1], yMin: 0, yMax: 50, yStep: 5 } }).y!.minor, 1);
  const y = axesOf(S.fn).y!;
  assert.equal(onGrid(2.5, y), true);
  assert.equal(onGrid(2.25, y), false);
  assert.equal(onGrid(7, y), false); // outside the range
});

test('axes: reaction energy axis as the renderer lays it out; titration volume axis', () => {
  const y = axesOf(S.rc).y!; // levels 20 … 100 → bounds from niceBounds(2.4, 106.4, 10)
  assert.deepEqual([y.min, y.max, y.step, y.minor], [0, 120, 20, 10]);
  assert.equal(axesOf({ ...S.rc, params: { ...S.rc.params, showAxisValues: false } }).y!.numbered, false);
  const x = axesOf(S.titration).x!;
  assert.deepEqual([x.min, x.max, x.step, x.minor], [0, 40, 5, 1]);
});

test('readOff: exact on a gridline, only a bracket between gridlines', () => {
  const y = axesOf(S.motion).y!;
  assert.equal(readOff(4, y), '4');
  assert.match(readOff(4.2, y), /^between 4 and 5 \(nearer 4; not on a gridline\)$/);
  assert.match(readOff(4.5, y), /about midway/);
  assert.match(readOff(99, y), /above the top/);
});

// ── transcription ───────────────────────────────────────────────────────────

test('describe: a curve is a table of readings, never its equation', () => {
  const d = describeFigure(S.fn);
  assert.ok(!/x\^2|x - 2|x²/.test(d.text), 'the formula must not appear');
  assert.match(d.text, /x = 2: y = 0/);
  assert.match(d.text, /x = -1: y = -3/);
  assert.match(d.text, /x = 0\.5: y = between -4 and -3\.5 \(about midway; not on a gridline\)/);
  assert.match(d.text, /x = 4: y = above the top of the plotted range/);
  assert.match(d.text, /Marked point labelled "P": a filled dot at \(1, 3\)/);
  assert.match(d.text, /trough at x = 0, y = -4/);
  // A peak between vertical gridlines: its height is exact, its position only bracketed.
  const wave = describeFigure({ type: 'function_graph', params: { xRange: [-6, 6], yRange: [-2, 4], xStep: 1, yStep: 1, curves: [{ expr: '2*cos(x) + 1' }] } }).text;
  assert.match(wave, /peak at x = 0, y = 3/);
  assert.match(wave, /trough at x = between 3 and 3\.5 \(nearer 3; not on a gridline\), y = -1/);
  assert.ok(!/Turning points/.test(describeFigure({ type: 'function_graph', params: { xRange: [0, 6], yRange: [0, 6], xStep: 1, yStep: 1, curves: [{ expr: 'x' }] } }).text));
  assert.match(describeFigure({ type: 'function_graph', params: { xRange: [0, 6], yRange: [0, 6], xStep: 1, yStep: 1, curves: [{ expr: '4 - x/3' }] } }).text, /It is a STRAIGHT line/);
  assert.match(d.text, /Curve 2 \(legend "g"\)[^\n]*It is a STRAIGHT line/);
  assert.ok(!/Curve 1 [^\n]*STRAIGHT/.test(d.text));
  assert.match(describeFigure({ type: 'function_graph', params: { xRange: [-4, 4], yRange: [-2, 4], xStep: 1, yStep: 1, curves: [{ expr: 'abs(x + 1) - 1' }] } }).text, /trough at x = -1, y = -1/);
  assert.ok(d.printed.some((l) => /legend entry: "f"/.test(l)) && d.printed.some((l) => /point label: "Q"/.test(l)));
  assert.match(d.text, /TEXT PRINTED ON THE FIGURE:[\s\S]*WHAT CAN BE READ OFF THE FIGURE:/);
});

test('describe: straight-segment graph — corners and gridline readings', () => {
  const d = describeFigure(S.motion);
  assert.match(d.text, /label "Velocity \(m\/s\)"/);
  assert.match(d.text, /\(2, 8\)/);
  assert.match(d.text, /at 1: 4\n/);
  assert.match(d.text, /at 9: -2/);
});

test('describe: bars, dots, scatter', () => {
  assert.match(describeFigure(S.bars).text, /South: 45/);
  assert.ok(!describeFigure(S.bars).printed.some((l) => /value of each bar/.test(l)));
  assert.ok(describeFigure({ ...S.bars, params: { ...S.bars.params, showValues: true } }).printed.some((l) => /South 45/.test(l)));
  assert.match(describeFigure(S.dots).text, /\n {2}3: 3\n/);
  assert.match(describeFigure(S.dots).text, /\n {2}5: 0\n/);
  const sc = describeFigure(S.scatter);
  assert.match(sc.text, /\(1, 2\) labelled "A"/);
  assert.match(sc.text, /x = 3: y = 6/);
  assert.ok(!sc.printed.some((l) => /equation/.test(l)));
  assert.ok(describeFigure({ ...S.scatter, params: { ...S.scatter.params, showEquation: true } }).printed.some((l) => /y = 2x \+ 0/.test(l)));
});

test('describe: energy profile, titration curve, slope field, free-body diagram', () => {
  const rc = describeFigure(S.rc).text;
  assert.match(rc, /Curve 1 \(legend "P"\): starts on a flat level at energy 40 .* peak at energy 100, then falls to a flat level at energy 20/);
  assert.ok(!/ΔH|Ea/.test(rc), 'no arrow is drawn unless annotate asks');
  const blind = describeFigure({ ...S.rc, params: { ...S.rc.params, showAxisValues: false } }).text;
  assert.match(blind, /NO numbers on it/);
  assert.match(blind, /LOWER than the starting level/);
  assert.ok(!/\b(?:40|100|20)\b/.test(blind.split('WHAT CAN BE READ')[1]), 'no energy value without a numbered axis');
  const ann = describeFigure({ ...S.rc, params: { ...S.rc.params, annotate: ['Ea', 'deltaH'], annotateValues: true } });
  assert.ok(ann.printed.some((l) => /"ΔH = -20 kJ\/mol"/.test(l)) && ann.printed.some((l) => /"Ea \(1\) = 60 kJ\/mol"/.test(l)));

  const ti = describeFigure(S.titration).text;
  assert.match(ti, /ONE near-vertical section, at volume 20/);
  assert.match(ti, /volume 10: pH 5\n/);
  assert.ok(!/pKa|0\.1/.test(ti), 'the chemistry behind the curve is not on the picture');

  const sf = describeFigure(S.field).text;
  assert.ok(!/x - y/.test(sf));
  assert.match(sf, /y = 1: .*x=2: 1;/);
  assert.match(sf, /y = -3: .*x=3: very steep \(rising\)/);
  assert.ok(describeFigure({ ...S.field, params: { ...S.field.params, showExpression: true } }).printed.some((l) => /dy\/dx = x - y/.test(l)));

  const fb = describeFigure(S.fbd);
  assert.match(fb.text, /arrow labelled "W = 50 N", pointing straight down/);
  assert.match(fb.text, /arrow labelled "N", pointing straight up/);
  assert.match(fb.text, /not to scale/);
  const tilted = describeFigure({ type: 'free_body_diagram', params: { surface: { type: 'inclined', angle: 30 }, forces: [{ name: 'T', magnitude: '8 N', direction: 37 }, { name: 'N', direction: 'normal' }] } }).text;
  assert.match(tilted, /θ = 30°/);
  assert.match(tilted, /angle is NOT printed/);
  assert.ok(!/37/.test(tilted), 'an unprinted angle is not in the transcription');
});

test('solverQuestion: the figure first, then the stem; no key', () => {
  const q = solverQuestion(describeFigure(S.bars).text, 'Which bar is tallest?');
  assert.match(q, /The figure IS included/i);
  assert.ok(q.indexOf('South: 45') < q.indexOf('Which bar is tallest?'));
});

// ── checkers: each with a right and a wrong key ─────────────────────────────

test('function_graph checkers', () => {
  rightAndWrong(S.fn, 'curve_value', { curve: 0, x: 3 }, '5', '9');
  rightAndWrong(S.fn, 'curve_slope', { curve: 1, x1: 0, x2: 2 }, '1', '2');
  rightAndWrong(S.fn, 'curve_slope', { curve: 0, x1: 1, x2: 3 }, '4', '2');
  rightAndWrong(S.fn, 'curve_y_intercept', { curve: 0 }, '-4', '4');
  rightAndWrong(S.fn, 'curve_zeros', { curve: 0, want: 'greatest' }, '2', '-2');
  rightAndWrong(S.fn, 'curve_zeros', { curve: 0, want: 'count' }, '2', '1');
  assert.deepEqual(run(S.fn, 'curve_zeros', { curve: 0, want: 'all' }), { kind: 'numbers', values: [-2, 2] });
  rightAndWrong(S.fn, 'curve_extremum', { curve: 0, which: 'min', want: 'value' }, '-4', '0');
  rightAndWrong(S.fn, 'curve_extremum', { curve: 0, which: 'min', want: 'x' }, '0', '-4');
  rightAndWrong(S.fn, 'curves_intersection', { a: 0, b: 1, want: 'greatest' }, '2', '-1');
  rightAndWrong(S.fn, 'point_coordinate', { point: 'Q', want: 'y' }, '-1', '3');
  rightAndWrong(S.fn, 'points_slope', { p1: 'P', p2: 'Q' }, '-2', '2');
});

test('function_graph checkers refuse what cannot be read', () => {
  refused(() => run(S.fn, 'curve_value', { curve: 0, x: 0.25 }), /does not lie on a gridline/);
  refused(() => run(S.fn, 'curve_value', { curve: 0, x: 4 }), /does not lie on a gridline/); // 12 is off the plot
  const offGrid: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [-4, 4], yRange: [-6, 6], xStep: 1, yStep: 1, curves: [{ expr: 'x^2 - 3' }] } };
  refused(() => run(offGrid, 'curve_zeros', { curve: 0, want: 'all' }), /does not fall on a gridline/);
  // A pole is not a zero.
  const pole: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [-4, 4], yRange: [-6, 6], xStep: 1, yStep: 1, curves: [{ expr: '1/(x - 0.3) + 100' }] } };
  assert.equal(value(run(pole, 'curve_zeros', { curve: 0, want: 'count' })), 0);
  refused(() => run(S.fn, 'curve_extremum', { curve: 0, which: 'max', want: 'value' }), /leaves the plot/);
  // A peak between vertical gridlines: its height can be read, its position cannot.
  const wave: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [-6, 6], yRange: [-4, 4], xStep: 1, yStep: 1, curves: [{ expr: '3*sin(x)', domain: [0, 3] }] } };
  assert.equal(value(run(wave, 'curve_extremum', { curve: 0, which: 'max', want: 'value' })), 3);
  refused(() => run(wave, 'curve_extremum', { curve: 0, which: 'max', want: 'x' }), /not at a vertical gridline/);
  refused(() => run({ ...wave, params: { ...wave.params, curves: [{ expr: '2.3*sin(x)' }] } }, 'curve_extremum', { curve: 0, which: 'max', want: 'value' }), /does not lie on a gridline/);
  refused(() => run(S.fn, 'series_value', { series: 0, t: 1 }), /is for motion_graph/);
  refused(() => run(S.fn, 'no_such', {}), /unknown derivation checker/);
});

test('straight-segment graph checkers', () => {
  rightAndWrong(S.motion, 'series_value', { series: 0, t: 1 }, '4', '8');
  rightAndWrong(S.motion, 'series_slope', { series: 0, t1: 0, t2: 2 }, '4', '8');
  rightAndWrong(S.motion, 'series_slope', { series: 0, t1: 6, t2: 8 }, '-4', '4');
  rightAndWrong(S.motion, 'series_extremum', { series: 0, which: 'min', want: 'value' }, '-4', '0');
  rightAndWrong(S.motion, 'series_extremum', { series: 0, which: 'min', want: 't' }, '10', '8');
  rightAndWrong(S.motion, 'series_area', { series: 0, t1: 0, t2: 8 }, '48', '64'); // 8 + 32 + 8
  rightAndWrong(S.motion, 'series_area', { series: 0, t1: 0, t2: 10 }, '44', '52'); // the part below the axis counts negative
  rightAndWrong(S.motion, 'series_crossing', { series: 0, value: 4, want: 'least' }, '1', '7');
  assert.deepEqual(run(S.motion, 'series_crossing', { series: 0, value: 4, want: 'all' }), { kind: 'numbers', values: [1, 7] });
  refused(() => run(S.motion, 'series_extremum', { series: 0, which: 'max', want: 't' }), /more than one corner/);
  refused(() => run(S.motion, 'series_crossing', { series: 0, value: 8, want: 'all' }), /whole stretch/);
  refused(() => run(S.motion, 'series_value', { series: 0, t: 12 }), /does not lie on a gridline/);
  refused(() => run({ ...S.motion, params: { ...S.motion.params, interpolation: 'smooth' } }, 'series_value', { series: 0, t: 1 }), /smooth/);
});

test('bar chart checkers', () => {
  rightAndWrong(S.bars, 'bar_value', { category: 'East' }, '20', '30');
  rightAndWrong(S.bars, 'bar_difference', { a: 'South', b: 'East' }, '25', '15');
  rightAndWrong(S.bars, 'bar_sum', {}, '130', '120');
  rightAndWrong(S.bars, 'bar_sum', { categories: ['North', 'East'] }, '50', '75');
  rightAndWrong(S.bars, 'bar_ratio', { a: 'North', b: 'East' }, '3/2', '2/3');
  const tallest = run(S.bars, 'bar_extreme', { which: 'largest' });
  assert.deepEqual(tallest, { kind: 'label', value: 'South' });
  const mcq = (answer: string) => item(S.bars, { responseFormat: 'mcq', choices: ['North', 'South', 'East', 'West'], answer });
  assert.equal(compareDerived(mcq('B'), tallest).match, true);
  assert.equal(compareDerived(mcq('A'), tallest).match, false);
  refused(() => run({ ...S.bars, params: { ...S.bars.params, values: [30, 45, 20, 45] } }, 'bar_extreme', { which: 'largest' }), /tie/);
  refused(() => run({ ...S.bars, params: { ...S.bars.params, values: [30, 45, 22, 35] } }, 'bar_value', { category: 'East' }), /does not lie on a gridline/);
});

test('dot plot checkers', () => {
  rightAndWrong(S.dots, 'dot_count', {}, '8', '6');
  rightAndWrong(S.dots, 'dot_count', { value: 3 }, '3', '2');
  rightAndWrong(S.dots, 'dot_count', { min: 3 }, '5', '2');
  rightAndWrong(S.dots, 'dot_mode', {}, '3', '2');
  rightAndWrong(S.dots, 'dot_median', {}, '3', '2.5');
  rightAndWrong(S.dots, 'dot_range', {}, '5', '6');
  rightAndWrong(S.dots, 'dot_extreme', { which: 'max' }, '6', '4');
  rightAndWrong(S.dots, 'dot_mean', {}, '3', '4');
  refused(() => run({ type: 'line_plot', params: { values: [1, 1, 2, 2], step: 1 } }, 'dot_mode', {}), /no single mode/);
});

test('scatter plot checkers', () => {
  rightAndWrong(S.scatter, 'point_coordinate', { point: 'B', want: 'y' }, '6', '3');
  rightAndWrong(S.scatter, 'points_slope', { p1: 'A', p2: 'B' }, '2', '1/2');
  rightAndWrong(S.scatter, 'scatter_count', { yMin: 4 }, '3', '2');
  rightAndWrong(S.scatter, 'trend_value', { x: 4 }, '8', '4');
  rightAndWrong(S.scatter, 'trend_slope', {}, '2', '0.5');
  refused(() => run(S.scatter, 'scatter_count', { yMin: 5 }), /exactly on one of the bounds/);
  refused(() => run({ ...S.scatter, params: { ...S.scatter.params, trendLine: { slope: 0.37, intercept: 1.1 } } }, 'trend_slope', {}), /two grid crossings/);
  refused(() => run({ ...S.scatter, params: { ...S.scatter.params, trendLine: undefined } }, 'trend_value', { x: 1 }), /no drawn line/);
});

test('slope field checker', () => {
  rightAndWrong(S.field, 'slope_at', { x: 2, y: 1 }, '1', '-1');
  rightAndWrong(S.field, 'slope_at', { x: -1, y: 1 }, '-2', '2');
  refused(() => run(S.field, 'slope_at', { x: 0.5, y: 1 }), /no segment is drawn/);
  refused(() => run(S.field, 'slope_at', { x: 3, y: -3 }), /told apart by eye/);
});

test('energy profile checkers', () => {
  rightAndWrong(S.rc, 'rc_delta_h', {}, '-20', '20');
  rightAndWrong(S.rc, 'rc_activation_energy', { curve: 0, direction: 'forward' }, '60', '100');
  rightAndWrong(S.rc, 'rc_activation_energy', { curve: 0, direction: 'reverse' }, '80', '60');
  rightAndWrong(S.rc, 'rc_activation_energy', { curve: 1, direction: 'forward' }, '30', '60');
  rightAndWrong(S.rc, 'rc_peak_energy', { curve: 1 }, '70', '30');
  rightAndWrong(S.rc, 'rc_peak_difference', { a: 0, b: 1 }, '30', '90');
  assert.deepEqual(run(S.rc, 'rc_direction', {}), { kind: 'label', value: 'exothermic' });
  refused(() => run({ ...S.rc, params: { ...S.rc.params, productsEnergy: 23 } }, 'rc_delta_h', {}), /product level = 23 does not lie on a gridline/);
  refused(() => run({ ...S.rc, params: { ...S.rc.params, showAxisValues: false } }, 'rc_delta_h', {}), /no numbers/);
});

test('titration curve checkers', () => {
  rightAndWrong(S.titration, 'titration_equivalence_volume', {}, '20', '40');
  rightAndWrong(S.titration, 'titration_half_equivalence_volume', {}, '10', '20');
  rightAndWrong(S.titration, 'titration_half_equivalence_ph', {}, '5', '7');
  const analyte = run(S.titration, 'titration_analyte', {});
  assert.deepEqual(analyte, { kind: 'label', value: 'weak acid' });
  const mcq = (answer: string) => item(S.titration, { responseFormat: 'mcq', choices: ['a strong acid', 'a weak acid', 'a strong base', 'a weak base'], answer });
  assert.equal(compareDerived(mcq('B'), analyte).match, true);
  assert.equal(compareDerived(mcq('A'), analyte).match, false);
  refused(() => run({ ...S.titration, params: { ...S.titration.params, analyte: { type: 'weak_acid', concentration: 0.1, volume: 23.3, pKa: 5 } } }, 'titration_equivalence_volume', {}), /does not lie on a gridline/);
  refused(() => run({ ...S.titration, params: { ...S.titration.params, analyte: { type: 'strong_acid', concentration: 0.1, volume: 20 } } }, 'titration_half_equivalence_ph', {}), /weak analyte only/);
});

test('free-body diagram checkers', () => {
  rightAndWrong(S.fbd, 'fbd_missing_force', { force: 'N' }, '50', '30');
  rightAndWrong(S.fbd, 'fbd_missing_force', { force: 'N', net: 10 }, '60', '50');
  const full: PracticeFigureSpec = { type: 'free_body_diagram', params: { forces: [{ name: 'W', magnitude: '50 N', direction: 'down' }, { name: 'L', magnitude: '80 N', direction: 'up' }, { name: 'F', magnitude: '30 N', direction: 'right' }, { name: 'f', magnitude: '12 N', direction: 'left' }] } };
  rightAndWrong(full, 'fbd_net_force', { axis: 'x' }, '18', '42');
  rightAndWrong(full, 'fbd_net_force', { axis: 'y' }, '30', '130');
  refused(() => run(S.fbd, 'fbd_net_force', { axis: 'y' }), /"N" has no printed size/);
  refused(() => run(S.fbd, 'fbd_missing_force', { force: 'W' }), /is printed on the figure/);
  refused(() => run({ type: 'free_body_diagram', params: { forces: [{ name: 'T', magnitude: '5 N', direction: 30 }, { name: 'W', direction: 'down' }] } }, 'fbd_missing_force', { force: 'W' }), /not along the horizontal or the vertical/);
});

test('every checker is documented for the writer, and tested above', () => {
  const cat = checkerCatalogue();
  for (const name of Object.keys(CHECKERS)) assert.ok(cat.includes(`- ${name} `), name);
  assert.ok(FIGURE_GENERATE_SYSTEM.includes('titration_equivalence_volume'));
});

// ── comparing a derived value with a key ────────────────────────────────────

test('numbersIn / compareDerived', () => {
  assert.deepEqual(numbersIn('−3 m/s'), [-3]);
  assert.deepEqual(numbersIn('x = 2 and x = 5'), [2, 5]);
  assert.deepEqual(numbersIn('3/4'), [0.75]);
  assert.deepEqual(numbersIn('4 m/s²'), [4]);
  const five: Derived = { kind: 'number', value: 5 };
  const mcq = (choices: string[], answer: string) => item(S.fn, { responseFormat: 'mcq', choices, answer });
  assert.equal(compareDerived(mcq(['3 m/s', '5 m/s', '−5 m/s', '9 m/s'], 'B'), five).match, true);
  assert.equal(compareDerived(mcq(['3 m/s', '5 m/s', '−5 m/s', '9 m/s'], 'C'), five).match, false);
  // Two options state the value → not a match; an option that is not one value → not comparable.
  assert.match(compareDerived(mcq(['5', '5.0', '6', '7'], 'A'), five).detail, /option B states as well/);
  assert.match(compareDerived(mcq(['between 4 and 6', '1', '2', '3'], 'A'), five).detail, /cannot be compared/);
  const set: Derived = { kind: 'numbers', values: [-2, 2] };
  assert.equal(compareDerived(mcq(['x = −2 and x = 2', 'x = 2 only', 'x = −4', 'x = 0'], 'A'), set).match, true);
  assert.equal(compareDerived(mcq(['x = −2 and x = 2', 'x = 2 only', 'x = −4', 'x = 0'], 'B'), set).match, false);
  assert.equal(compareDerived(item(S.fn, { responseFormat: 'numeric', answer: 'five' }), five).match, false);
});

// ── rule checks on a whole item ─────────────────────────────────────────────

const good = (): FigureItem => item(S.motion, { problemText: 'The graph shows the velocity of a cart. What is its acceleration, in m/s², between t = 0 s and t = 2 s?', answer: '4', derivation: { checker: 'series_slope', args: { series: 0, t1: 0, t2: 2 } }, alt: 'A velocity–time graph made of straight segments, with time from 0 to 10 seconds.' });

test('examine: a sound item is drawn, transcribed and derived', () => {
  const e = examineFigureItem(good());
  assert.deepEqual(e.defects, []);
  assert.ok(e.svg && e.svg.startsWith('<svg') && e.figureText);
  assert.equal(e.derivation.status, 'derived');
  assert.equal(e.derivation.value, '4');
});

test('examine: a wrong key is a mismatch; no checker is "not derived"', () => {
  const wrong = examineFigureItem({ ...good(), answer: '8' });
  assert.equal(wrong.derivation.status, 'mismatch');
  assert.ok(wrong.defects.some((d) => /does not agree with the figure/.test(d)));
  const none = examineFigureItem({ ...good(), derivation: { checker: 'none', args: {} } });
  assert.equal(none.derivation.status, 'not_derived');
  assert.deepEqual(none.defects, []);
  const off = examineFigureItem({ ...good(), derivation: { checker: 'series_slope', args: { series: 0, t1: 0, t2: 0.3 } } });
  assert.equal(off.derivation.status, 'error');
});

test('examine: a spec the renderer refuses, or with a default axis, is rejected', () => {
  const bad = examineFigureItem({ ...good(), figureSpec: { type: 'motion_graph', params: { series: [{ points: [[0, 0]] }], tRange: [0, 10], yRange: [0, 10], tStep: 1, yStep: 1 } } });
  assert.ok(!bad.svg && /figure spec was refused/.test(bad.defects[0]));
  const noAxis = examineFigureItem({ ...good(), figureSpec: { type: 'motion_graph', params: { series: [{ points: [[0, 0], [2, 8]] }] } } });
  assert.ok(/tRange must be given/.test(noAxis.defects[0]));
  const badExpr = examineFigureItem(item({ type: 'function_graph', params: { xRange: [-4, 4], yRange: [-4, 4], xStep: 1, yStep: 1, curves: [{ expr: 'foo(x)' }] } }, {}));
  assert.ok(/refused/.test(badExpr.defects[0]));
});

test('examine: stem rules — no drawing, must point at the figure, typed answers short', () => {
  assert.ok(examineFigureItem({ ...good(), problemText: 'Use the graph. Sketch the acceleration–time graph for the cart and give its first value.' }).defects.some((d) => /draw, sketch/.test(d)));
  assert.ok(examineFigureItem({ ...good(), problemText: 'A cart moves along a track. Shade the region that represents its displacement.' }).defects.some((d) => /draw, sketch/.test(d)));
  assert.ok(!examineFigureItem({ ...good(), problemText: 'The dot plot shows the scores. The graph of the data is shown; how many scores are there?' }).defects.some((d) => /draw, sketch/.test(d)));
  assert.ok(examineFigureItem({ ...good(), problemText: 'A cart speeds up from rest to 8 m/s in 2 s. What is its acceleration in m/s²?' }).defects.some((d) => /never refers to the figure/.test(d)));
  const argued = item(S.rc, { responseFormat: 'mcq', problemText: 'Use the energy profile shown. What is the sign of ΔH along pathway P?', choices: ['negative, because the products are lower', 'positive, because the peak is higher', 'negative, since energy is absorbed', 'zero'], answer: 'A', distractorRationales: ['correct', 'a', 'b', 'c'] });
  assert.ok(examineFigureItem(argued).defects.some((d) => /option carries a reason/.test(d)));
  assert.ok(examineFigureItem({ ...good(), responseFormat: 'free', answer: 'it speeds up and then moves steadily', derivation: { checker: 'none', args: {} } }).defects.some((d) => /single term/.test(d)));
});

test('examine: nothing printed may state the answer', () => {
  const titled = { ...good(), figureSpec: { ...S.motion, params: { ...S.motion.params, title: 'Acceleration 4 m/s² at first' } } };
  assert.ok(examineFigureItem(titled).defects.some((d) => /prints the answer/.test(d)));
  const eq = item({ ...S.fn, params: { ...S.fn.params, curves: [{ expr: 'x - 2', label: 'y = x − 2' }] } }, { answer: '1', derivation: { checker: 'curve_slope', args: { curve: 0, x1: 0, x2: 2 } } });
  assert.ok(examineFigureItem(eq).defects.some((d) => /displays an equation/.test(d)));
  const bars = item({ ...S.bars, params: { ...S.bars.params, showValues: true } }, { problemText: 'The bar chart shows counts. What is the count for East?', answer: '20', derivation: { checker: 'bar_value', args: { category: 'East' } } });
  assert.ok(examineFigureItem(bars).defects.some((d) => /showValues is on/.test(d)));
  const rc = item({ ...S.rc, params: { ...S.rc.params, annotate: ['deltaH'], annotateValues: true } }, { problemText: 'Use the energy profile shown. What is ΔH in kJ/mol?', answer: '-20', derivation: { checker: 'rc_delta_h', args: {} } });
  assert.ok(examineFigureItem(rc).defects.some((d) => /annotateValues is on/.test(d)));
  const field = item({ ...S.field, params: { ...S.field.params, showExpression: true } }, { problemText: 'In the slope field shown, what is the slope of the segment at (2, 1)?', answer: '1', derivation: { checker: 'slope_at', args: { x: 2, y: 1 } } });
  assert.ok(examineFigureItem(field).defects.some((d) => /not generated for now|showExpression is on/.test(d)));
});

test('examine: alt text — bounds, and it must not state the answer', () => {
  assert.ok(examineFigureItem({ ...good(), alt: '' }).defects.some((d) => /alt text must be between/.test(d)));
  assert.ok(examineFigureItem({ ...good(), alt: 'x'.repeat(601) }).defects.some((d) => /alt text must be between/.test(d)));
  assert.ok(examineFigureItem({ ...good(), alt: 'A velocity–time graph whose first segment has slope 4.' }).defects.some((d) => /alt text states the answer/.test(d)));
  // A number that is just an end of an axis is not the answer being stated.
  const ten = { ...good(), problemText: 'The graph shows the velocity of a cart. At what time, in s, is its velocity least?', answer: '10', derivation: { checker: 'series_extremum', args: { series: 0, which: 'min', want: 't' } } };
  assert.deepEqual(examineFigureItem(ten).defects, []);
  const worded = item(S.rc, { responseFormat: 'mcq', problemText: 'Use the energy profile shown. Which term describes the reaction along pathway P?', choices: ['exothermic', 'endothermic', 'isothermal', 'adiabatic'], answer: 'A', distractorRationales: ['correct', 'reads the levels the wrong way round', 'ignores the difference in levels', 'confuses heat flow with insulation'], derivation: { checker: 'rc_direction', args: {} }, alt: 'An energy profile for an exothermic reaction.' });
  assert.ok(examineFigureItem(worded).defects.some((d) => /alt text states the answer/.test(d)));
});

test('validateFigureItem: the writer\'s raw reply → item, with the params parsed from JSON text', () => {
  const raw = {
    objectiveLoId: 'gen-x.lo-1', figureType: 'motion_graph', figureParamsJson: JSON.stringify(S.motion.params), alt: 'A velocity–time graph made of straight segments.',
    responseFormat: 'mcq', problemText: 'The graph below shows the velocity of a cart. What is its acceleration between t = 0 s and t = 2 s?', choices: ['2 m/s²', '4 m/s²', '8 m/s²', '16 m/s²'], answer: 'B',
    distractorRationales: ['divides the time by the velocity change', 'correct', 'reads the velocity instead of the slope', 'multiplies velocity by time'],
    derivationChecker: 'series_slope', derivationArgsJson: '{"series":0,"t1":0,"t2":2}', hints: ['Slope of the first segment.'], solutionText: 'Rise 8 over run 2 gives 4.', difficulty: 2, covers: 'slope of v–t', taskType: 'slope from graph',
  };
  const ok = validateFigureItem(raw, ['gen-x.lo-1'], 'motion_graph');
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.exam?.derivation.status, 'derived');
  assert.ok(validateFigureItem({ ...raw, answer: 'C' }, ['gen-x.lo-1']).errors.some((e) => /does not agree with the figure/.test(e)));
  assert.ok(validateFigureItem({ ...raw, figureParamsJson: '{not json' }, ['gen-x.lo-1']).errors.some((e) => /not valid JSON/.test(e)));
  assert.ok(validateFigureItem(raw, ['gen-x.lo-1'], 'bar_chart').errors.some((e) => /assigned the kind "bar_chart"/.test(e)));
  // The text track still refuses a stem that points at a figure; the figure track does not.
  assert.ok(validateItem(raw, ['gen-x.lo-1']).errors.some((e) => /refers to a figure/.test(e)));
  assert.deepEqual(validateItem(raw, ['gen-x.lo-1'], { hasFigure: true }).errors, []);
});

// ── quality gate for figure items ───────────────────────────────────────────

test('quality: the figure checklist — one figure check for the reviewers, every check contested', () => {
  const ids = FIGURE_QUALITY_CHECKS.map((c) => c.id) as string[];
  assert.ok(!ids.includes('figure_workaround') && ids.includes('figure_states_answer'));
  // Decided by code, not by a reviewer:
  assert.ok(!ids.includes('answerable_without_figure') && !ids.includes('finer_than_grid'));
  assert.deepEqual([...FIGURE_STRICT_CHECKS], ids);
  const view = { objective: 'Read a graph.', otherObjectives: [], format: 'numeric', question: 'What does the graph give?', choices: [], answer: '4', earlier: [], figureText: describeFigure(S.motion).text };
  const p = buildQualityPrompt(view);
  assert.match(p.system, /figure_states_answer/);
  assert.match(p.system, /for EVERY check, flagged or not/);
  assert.match(p.user, /Figure shown with the question \(transcription\):/);
  assert.ok(!/EVERY check/.test(buildQualityPrompt({ ...view, figureText: undefined }).system));
  const flags = qualityFlags({ ambiguous: { flag: true, reason: 'two readings' }, figure_workaround: { flag: true, reason: 'x' } }, { format: 'numeric', hasEarlier: false }, FIGURE_QUALITY_CHECKS);
  assert.deepEqual(flags.map((f) => f.id), ['ambiguous']);
  // For a figure item one reviewer's flag on ANY check is put to the other; in the text track only the strict two.
  assert.equal(contestedFlags(flags, [], FIGURE_STRICT_CHECKS).length, 1);
  assert.equal(contestedFlags(flags, []).length, 0);
});

test('hygiene: one legend entry per curve, no legend for a lone curve, nothing on the edge', () => {
  const two: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [0, 6], yRange: [-3, 3], xStep: 1, yStep: 1, curves: [{ expr: 'x', domain: [0, 2], label: 'f' }, { expr: '4 - x', domain: [2, 6], label: 'f' }] } };
  const n = normaliseSpec(two, 'Using the graph of f, find the area.').params as { curves: Array<{ label?: string; color?: string }> };
  assert.deepEqual(n.curves.map((c) => c.label), ['f', undefined]);
  assert.ok(n.curves[0].color && n.curves[0].color === n.curves[1].color);
  // not referred to by its label → no legend at all
  assert.deepEqual((normaliseSpec(two, 'Find the area under the graph.').params as { curves: Array<{ label?: string }> }).curves.map((c) => c.label), [undefined, undefined]);
  assert.equal((normaliseSpec(S.fn, 'no names').params as { curves: Array<{ label?: string }> }).curves[0].label, 'f'); // two different curves keep their names
  const lone = normaliseSpec({ ...S.motion, params: { ...S.motion.params, series: [{ points: [[0, 0], [2, 8]], label: 'cart' }] } }, 'What is the acceleration?');
  assert.equal((lone.params as { series: Array<{ label?: string }> }).series[0].label, undefined);
  assert.equal((normaliseSpec(S.rc, 'compare P and Q').params as { curveLabels?: string[] }).curveLabels?.length, 2);
  // a peak, a marked point or a dot on the top edge gets one more step
  const edge = normaliseSpec({ type: 'function_graph', params: { xRange: [-6, 6], yRange: [-3, 3], xStep: 1, yStep: 1, curves: [{ expr: '3*cos(x)' }] } }, '');
  assert.deepEqual(edge.params.yRange, [-4, 4]);
  const dots = normaliseSpec({ type: 'scatter_plot', params: { points: [[0, 10], [4, 30], [8, 10]], xRange: [0, 8], yRange: [0, 30], xStep: 2, yStep: 10 } }, '');
  assert.deepEqual([dots.params.xRange, dots.params.yRange], [[0, 10], [0, 40]]);
  assert.deepEqual(normaliseSpec(S.motion, '').params.yRange, [-6, 10]); // nothing on an edge: unchanged
  assert.ok(hygieneDefects({ type: 'function_graph', params: { curves: [{ expr: 'x', label: 'f' }, { expr: 'x + 1', label: 'f' }] } }).some((d) => /twice/.test(d)));
  assert.ok(hygieneDefects(S.field).some((d) => /not generated for now/.test(d)));
  const four = { ...S.fbd };
  assert.ok(hygieneDefects(four).some((d) => /at most 3 forces/.test(d)));
  assert.deepEqual(hygieneDefects(S.fn), []);
  assert.ok(examineFigureItem(item(S.field, { problemText: 'In the slope field shown, which equation fits?' })).defects.some((d) => /not generated for now/.test(d)));
});

test('finer than the grid, by code: an underived item may not rest on off-grid features', () => {
  assert.deepEqual(unreadableFeatures(S.motion), []);
  const off: PracticeFigureSpec = { ...S.motion, params: { ...S.motion.params, series: [{ points: [[0, 0], [2.3, 8], [6, 7.5]] }] } };
  assert.equal(unreadableFeatures(off).length, 2);
  assert.ok(examineFigureItem(item(off, { problemText: 'Use the graph shown. Which statement fits it?', answer: '1' })).defects.some((d) => /finer than the grid/.test(d)));
  assert.ok(unreadableFeatures({ type: 'function_graph', params: { xRange: [-6, 6], yRange: [-4, 4], xStep: 1, yStep: 1, curves: [{ expr: '2.3*sin(x)' }] } }).some((f) => /turning point/.test(f)));
  assert.deepEqual(unreadableFeatures({ type: 'function_graph', params: { xRange: [-6, 6], yRange: [-4, 4], xStep: 1, yStep: 1, curves: [{ expr: '2*cos(x) + 1' }] } }), []);
  assert.ok(unreadableFeatures({ ...S.rc, params: { ...S.rc.params, productsEnergy: 23 } }).some((f) => /product level/.test(f)));
});

test('the stem may not describe the picture', () => {
  assert.equal(restatesFigure('The graph shows the force on a cart, forming a trapezoid shape. Find the impulse.'), true);
  assert.equal(restatesFigure('Near its peak the curve becomes steeper and steeper. What kind of point is it?'), true);
  assert.equal(restatesFigure('The plot of 1/[A] against time is a straight line. What is the order?'), true);
  assert.equal(restatesFigure('The curve oscillates evenly about the axis. What is its amplitude?'), true);
  assert.equal(restatesFigure('A force-time graph for a cart is shown. Find the impulse delivered between t = 2 s and t = 7 s.'), false);
  assert.equal(restatesFigure('The graph tracks a runner\'s position. During which interval is the runner stationary?'), false);
  assert.ok(examineFigureItem({ ...good(), problemText: 'The graph shows a velocity that is rising, then flat. What is the first acceleration in m/s²?' }).defects.some((d) => /describes what the figure shows/.test(d)));
});

// ── kind selection and the sample ───────────────────────────────────────────

test('kind selection: an unknown kind or a must-draw objective is unsupported', () => {
  assert.equal(kindChoiceOf('a.lo-1', 'S', { kind: 'bar_chart', student_must_draw: false, needed_figure: '', reason: 'r' }).kind, 'bar_chart');
  const draw = kindChoiceOf('a.lo-1', 'S', { kind: 'function_graph', student_must_draw: true, needed_figure: 'graph drawn by the student', reason: 'r' });
  assert.equal(draw.kind, 'unsupported');
  assert.match(neededGroup(draw), /student must draw/);
  assert.equal(kindChoiceOf('a.lo-1', 'S', { kind: 'venn diagram', needed_figure: 'venn diagram' }).kind, 'unsupported');
  assert.equal(kindChoiceOf('a.lo-1', 'S', undefined).neededFigure, 'not classified');
  const p = buildKindPrompt('Subject', 'Skill', [{ description: 'd', why: 'w' }]);
  assert.match(p.system, /free_body_diagram/);
  assert.deepEqual((p.schema as { required: string[] }).required, ['objectives']);
});

test('sample: every supported kind first, then spread over subjects; reproducible', () => {
  const mk = (i: number, subject: string, kind: string): KindChoice => ({ objectiveLoId: `gen-${String(i).padStart(2, '0')}.lo-1`, subject, kind, neededFigure: '', studentMustDraw: false, reason: '' });
  const pool: KindChoice[] = [
    ...Array.from({ length: 6 }, (_, i) => mk(i, 'A', 'function_graph')),
    mk(10, 'B', 'bar_chart'), mk(11, 'B', 'function_graph'), mk(12, 'B', 'motion_graph'), mk(13, 'C', 'titration_curve'), mk(14, 'C', 'function_graph'), mk(15, 'C', 'unsupported'),
  ];
  const s = pickFigureSample(pool, 6);
  assert.equal(s.length, 6);
  for (const k of ['function_graph', 'bar_chart', 'motion_graph', 'titration_curve']) assert.ok(s.some((c) => c.kind === k), k);
  assert.ok(!s.some((c) => c.kind === 'unsupported'));
  assert.deepEqual(s.map((c) => c.objectiveLoId), pickFigureSample([...pool].reverse(), 6).map((c) => c.objectiveLoId));
  const bySubject = (x: string) => s.filter((c) => c.subject === x).length;
  assert.ok(bySubject('A') <= 2 && bySubject('B') >= 2 && bySubject('C') >= 2, JSON.stringify(s.map((c) => c.subject)));
  assert.equal(pickFigureSample(pool, 99).length, 11);
});

console.log(`${passed} figure-core test(s) passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
