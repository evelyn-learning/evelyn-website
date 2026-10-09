/**
 * Tests for scripts/practice-extend/figure-core.ts (pure — no network, no
 * model; the no-db import keeps anything the renderer loads off a database).
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import { renderPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIGURE_FIXTURES } from '../lib/practice-figure-fixtures';
import { FIGURE_QUALITY_CHECKS, FIGURE_STRICT_CHECKS, contestedFlags, qualityFlags, validateItem } from './core';
import {
  ALL_PRACTICE_FIGURE_KINDS,
  CHECKERS,
  FigureRuleError,
  axesOf,
  axisText,
  checkerCatalogue,
  compareDerived,
  describeFigure,
  describeForAlt,
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
  svgTexts,
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

// ── batch 1 kinds (2026-10-09): transcription and checkers ──────────────────

const B: Record<string, PracticeFigureSpec> = {
  uc: { type: 'unit_circle', params: { angles: [{ degrees: 150, coords: 'blank_y', arc: true, name: 'P' }, { pi: [5, 4], coords: 'show' }, { degrees: 20, label: 'none' }, { degrees: 90 }] } },
  vec: { type: 'vector_diagram', params: { xRange: [-2, 8], yRange: [-4, 8], vectors: [{ head: [3, 4], label: 'a' }, { tail: [1, 0], head: [1, -2], label: 'b' }, { components: [-1, 1], label: 'c' }], resultant: { label: '?' } } },
  fbd2: { type: 'free_body_diagram_v2', params: { object: { shape: 'box', label: 'crate' }, forces: [{ label: 'N', direction: 'up', magnitude: 60 }, { label: 'W', direction: 'down', magnitude: 60 }, { label: 'F', direction: 'right', magnitude: 45 }, { label: 'f', direction: 'left', magnitude: 20 }] } },
  hang: { type: 'free_body_diagram_v2', params: { object: { shape: 'dot' }, lengths: 'equal', forces: [{ label: 'T₁', direction: 30, magnitude: 80, showAngle: true }, { label: '?', direction: 150, showAngle: true }, { label: 'W', direction: 'down', magnitude: 80 }] } },
  under: { type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'under_curve', expr: '0.5*x + 2', from: 1, to: 5 } } },
  between: { type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'between_curves', upper: { expr: 'x/2 + 4', label: 'f' }, lower: { expr: 'x/2' }, from: 0, to: 4 } } },
  system: { type: 'shaded_region', params: { xRange: [-1, 9], yRange: [-1, 9], region: { type: 'inequalities', markVertices: true, inequalities: [{ a: 1, b: 1, op: '<=', c: 8 }, { a: 1, b: -1, op: '<', c: 2 }, { a: 1, b: 0, op: '>=', c: 0 }, { a: 0, b: 1, op: '>=', c: 1 }] } } },
  line: { type: 'number_line', params: { min: -1, max: 2, denominator: 4, intervals: [{ from: null, to: -0.5 }, { from: 1.25, to: null, fromOpen: true }], points: [{ x: 0.5, label: 'P' }] } },
  seg: { type: 'number_line', params: { min: -6, max: 6, step: 1, intervals: [{ from: -3, to: 4, fromOpen: true }] } },
  signs: { type: 'sign_chart', params: { critical: [-2, 1, 5], rows: [{ label: 'f′(x)', signs: ['-', '+', '-', '+'], at: ['0', '0', '0'], blankSigns: [2] }, { label: 'f″(x)', signs: ['+', '-', '-', '+'], at: ['0', '', 'und'] }] } },
  normal: { type: 'distribution_curve', params: { axis: 'z', shade: [{ from: -1, to: 2 }] } },
  tails: { type: 'distribution_curve', params: { mean: 500, sd: 100, shade: [{ from: null, to: 350 }, { from: 650, to: null, label: '?' }] } },
  hist: { type: 'histogram', params: { binStart: 100, binWidth: 10, counts: [3, 7, 12, 6, 2], xLabel: 'Mass (g)', blankBins: [3] } },
  box: { type: 'box_plot', params: { plots: [{ label: 'A', min: 4, q1: 12, median: 18, q3: 26, max: 36 }, { label: 'B', min: 8, q1: 10, median: 22, q3: 24, max: 30, outliers: [2, 40] }], range: [0, 40], step: 4 } },
  complex: { type: 'polar_complex', params: { plane: 'complex', range: 6, points: [{ re: 3, im: 4, label: 'z', showModulus: true }, { re: -2, im: 1, label: 'w' }, { re: -3, im: 3 }] } },
  polar: { type: 'polar_complex', params: { plane: 'polar', rMax: 4, angleStep: 30, points: [{ r: 3, theta: 120, label: 'P' }], curve: { expr: '4*cos(2*theta)' } } },
  punnett: { type: 'punnett_square', params: { top: ['A', 'a'], side: ['A', 'a'], blankCells: [[1, 1]], blankTop: [0], phenotypes: [{ label: 'purple', genotypes: ['AA', 'Aa'] }, { label: 'white', genotypes: ['aa'] }] } },
  pedigree: {
    type: 'pedigree',
    params: {
      individuals: [
        { id: 'g1', sex: 'M', affected: true }, { id: 'g2', sex: 'F' },
        { id: 'a', sex: 'F', father: 'g1', mother: 'g2', carrier: true }, { id: 'ah', sex: 'M' }, { id: 'b', sex: 'M', father: 'g1', mother: 'g2' },
        { id: 'a1', sex: 'M', father: 'ah', mother: 'a', affected: true }, { id: 'a2', sex: 'F', father: 'ah', mother: 'a', unknown: true },
      ],
    },
  },
};
/** A small family: parents `[father, mother]` and children, each `'M' | 'F'` with a trailing `*` when affected. */
const family = (father: string, mother: string, ...children: string[]): PracticeFigureSpec => ({
  type: 'pedigree',
  params: {
    individuals: [
      { id: 'f', sex: 'M', affected: father.endsWith('*') }, { id: 'm', sex: 'F', affected: mother.endsWith('*') },
      ...children.map((c, i) => ({ id: `c${i}`, sex: c[0], affected: c.endsWith('*'), father: 'f', mother: 'm' })),
    ],
  },
});

test('batch 1: axes — none is left to a default, and none is needed', () => {
  for (const spec of Object.values(B)) assert.deepEqual(axesOf(spec), {});
  refused(() => axesOf({ type: 'pie_chart', params: {} }), /unknown figure kind/);
  refused(() => describeFigure({ type: 'unit_circle', params: { angles: [] } }), /angles must have between 1 and 16/);
});

test('batch 1 describe: exactly what is visible — a blank is transcribed as a blank, never as its value', () => {
  const uc = describeFigure(B.uc);
  assert.ok(uc.text.includes('a unit circle'));
  assert.ok(uc.printed.includes('point label: "P(−√3/2, ?)"'));
  assert.ok(uc.printed.includes('angle label: "150°"') && uc.printed.includes('point label: "(−√2/2, −√2/2)"'));
  assert.ok(!uc.text.includes('1/2'), 'the hidden y-coordinate of P appears nowhere');
  assert.ok(uc.readable.some((l) => /second quadrant/.test(l)) && uc.readable.some((l) => /no angle label/.test(l)));

  const vec = describeFigure(B.vec);
  assert.ok(vec.readable.some((l) => /arrow labelled "a".*from \(0, 0\) to \(3, 4\)/.test(l)));
  assert.ok(vec.readable.some((l) => /heavier arrow labelled "\?".*from \(0, 0\) to \(2, 3\)/.test(l)), 'the resultant is drawn, so where it ends can be read');
  assert.ok(!describeFigure({ type: 'vector_diagram', params: { ...B.vec.params, resultant: false } }).text.includes('(2, 3)'));

  const fbd = describeFigure(B.fbd2);
  assert.ok(fbd.printed.includes('arrow label: "F = 45 N"'));
  assert.ok(fbd.readable.some((l) => /to scale/.test(l)));
  const hang = describeFigure(B.hang);
  assert.ok(hang.printed.includes('arrow label: "?"') && hang.printed.includes('angle label: "30°"'));
  assert.ok(hang.readable.some((l) => /same length/.test(l)) && !/"\? = /.test(hang.text), 'the missing size is nowhere');
  assert.ok(hang.readable.some((l) => /arrow labelled "\?".*up and to the left.*30° above the horizontal/.test(l)));

  const under = describeFigure(B.under);
  assert.ok(under.readable.some((l) => /hatched.*between the line and the x-axis.*x = 1 to x = 5/i.test(l)));
  assert.ok(!/0\.5\s*\*?\s*x/.test(under.text), 'no equation');
  const sys = describeFigure(B.system);
  assert.ok(sys.readable.some((l) => /Boundary line 2: a DASHED straight line through \(1, -1\) and \(9, 7\)/.test(l)));
  assert.ok(sys.readable.some((l) => /corner.*\(0, 1\).*filled/.test(l)) && sys.readable.some((l) => /\(5, 3\).*open/.test(l)));
  assert.ok(!/≤|<=|≥/.test(sys.text), 'the inequalities are not stated');

  const line = describeFigure(B.line);
  assert.ok(line.readable.some((l) => /runs on to the left.*filled.*−1\/2/.test(l)) && line.readable.some((l) => /open circle at the unnumbered tick 1 tick to the right of 1 and runs on to the right/.test(l)));
  assert.ok(line.printed.includes('point label: "P"') && line.readable.some((l) => /filled dot at 1\/2/.test(l)));
  assert.ok(line.readable.some((l) => /Only these ticks are numbered: −1, −1\/2, 0, 1\/2, 1, 3\/2, 2\./.test(l)), 'the thinned numbering is transcribed as drawn');

  const sc = describeFigure(B.signs);
  assert.ok(sc.readable.some((l) => /f′\(x\).*−2 and 1: \+.*1 and 5: \(blank — a "\?" box\)/.test(l)), sc.text);
  assert.ok(sc.readable.some((l) => /f″\(x\).*at 5: und/.test(l)));

  const nd = describeFigure(B.normal);
  assert.ok(nd.readable.some((l) => /hatched from −1 to 2/i.test(l)) && !/0\.8/.test(nd.text));
  const tails = describeFigure(B.tails);
  assert.ok(tails.readable.some((l) => /left tail.*up to 350/i.test(l)) && tails.readable.some((l) => /marked "\?"/.test(l)));
  assert.ok(!tails.text.includes('650'), 'the blank bound is not transcribed');

  const hist = describeFigure(B.hist);
  assert.ok(hist.readable.some((l) => /120 to 130: 12/.test(l)) && hist.readable.some((l) => /130 to 140: \(blank — a "\?" box/.test(l)));
  assert.ok(!hist.readable.some((l) => /130 to 140: 6/.test(l)));

  const box = describeFigure(B.box);
  assert.ok(box.readable.some((l) => /"A".*whisker from 4.*box from 12 to 26.*line inside the box at 18.*whisker to 36/.test(l)));
  assert.ok(box.readable.some((l) => /"B".*separate dots at 2 and 40/.test(l)));

  const cx = describeFigure(B.complex);
  assert.ok(cx.readable.some((l) => /"z".*\(3, 4\).*segment from the origin/.test(l)) && !/modulus|\b5\b(?!\))/.test(cx.readable.filter((l) => /"z"/.test(l)).join(' ')));
  const pl = describeFigure(B.polar);
  assert.ok(pl.readable.some((l) => /"P".*third circle.*120° ray/.test(l)) && pl.readable.some((l) => /curve/.test(l)) && !pl.text.includes('cos'));

  const pn = describeFigure(B.punnett);
  assert.ok(pn.readable.some((l) => /top edge.*\(blank — a "\?" box\), a\./.test(l)));
  assert.ok(pn.readable.some((l) => /row 2.*Aa.*\(blank — a "\?" box\)/.test(l)) && !pn.text.includes('aa'));
  assert.ok(pn.printed.includes('legend entry: "purple" (hatched /)'));

  const pd = describeFigure(B.pedigree);
  assert.ok(pd.readable.some((l) => /I-1: male, affected \(filled\); partner of I-2/.test(l)));
  assert.ok(pd.readable.some((l) => /II-2: female, carrier \(half-filled\).*child of I-1 and I-2.*partner of II-1/.test(l) || /II-\d: female, carrier \(half-filled\)/.test(l)));
  assert.ok(pd.readable.some((l) => /III-2: female, status not shown \("\?"\)/.test(l)));
});

test('unit circle checkers', () => {
  rightAndWrong(B.uc, 'uc_coordinates', { angle: 0 }, '(−√3/2, 1/2)', '(√3/2, 1/2)');
  rightAndWrong(B.uc, 'uc_coordinates', { angle: 0 }, '( -√3/2 , 1/2 )', '(1/2, −√3/2)');
  rightAndWrong(B.uc, 'uc_coordinates', { angle: 0, want: 'y' }, '1/2', '−1/2');
  rightAndWrong(B.uc, 'uc_reference_angle', { angle: 0 }, '30', '60');
  rightAndWrong(B.uc, 'uc_reference_angle', { angle: 1, unit: 'radians' }, 'π/4', '5π/4');
  rightAndWrong(B.uc, 'uc_quadrant', { angle: 0 }, 'Quadrant II', 'Quadrant III');
  rightAndWrong(B.uc, 'uc_quadrant', { angle: 1 }, 'III', 'II');
  rightAndWrong(B.uc, 'uc_trig_value', { angle: 0, fn: 'tan' }, '−√3/3', '√3/3');
  rightAndWrong(B.uc, 'uc_trig_value', { angle: 1, fn: 'sin' }, '-√2/2', '√2/2');
  rightAndWrong(B.uc, 'uc_trig_value', { angle: 0, fn: 'sec' }, '−2√3/3', '−2');
  rightAndWrong(B.uc, 'uc_trig_value', { angle: 3, fn: 'tan' }, 'undefined', '0');
  rightAndWrong(B.uc, 'uc_trig_value', { angle: 3, fn: 'sin' }, '1', '0');
  refused(() => run(B.uc, 'uc_coordinates', { angle: 2 }), /not a multiple of 30° or 45°/);
  refused(() => run(B.uc, 'uc_quadrant', { angle: 3 }), /on an axis/);
  refused(() => run(B.uc, 'uc_coordinates', { angle: 9 }), /0-based index/);
});

test('vector diagram checkers', () => {
  rightAndWrong(B.vec, 'vec_components', { vector: 0, want: 'x' }, '3', '4');
  rightAndWrong(B.vec, 'vec_components', { vector: 1, want: 'y' }, '−2', '2');
  rightAndWrong(B.vec, 'vec_components', { vector: 0, want: 'pair' }, '⟨3, 4⟩', '(4, 3)');
  rightAndWrong(B.vec, 'vec_magnitude', { vector: 0 }, '5', '7');
  rightAndWrong(B.vec, 'vec_direction', { vector: 1 }, '270', '90');
  rightAndWrong(B.vec, 'vec_direction', { vector: 2 }, '135°', '45°');
  rightAndWrong(B.vec, 'vec_resultant', { want: 'pair' }, '(2, 3)', '(3, 2)');
  rightAndWrong(B.vec, 'vec_resultant', { want: 'x', of: [0, 1] }, '3', '2');
  rightAndWrong(B.vec, 'vec_resultant', { want: 'magnitude', of: [0, 2] }, '5.39', '5');
  rightAndWrong({ type: 'vector_diagram', params: { xRange: [0, 8], yRange: [0, 8], vectors: [{ head: [3, 4] }, { head: [3, 0] }] } }, 'vec_resultant', { want: 'magnitude' }, '7.211', '10');
  refused(() => run(B.vec, 'vec_components', { vector: 7, want: 'x' }), /0-based index/);
  refused(() => run({ type: 'vector_diagram', params: { xRange: [0, 4], yRange: [0, 4], vectors: [{ head: [1.3, 2] }] } }, 'vec_components', { vector: 0, want: 'x' }), /not on a gridline/);
});

test('free-body diagram (v2) checkers', () => {
  rightAndWrong(B.fbd2, 'fbd2_net_force', { axis: 'x' }, '25', '65');
  rightAndWrong(B.fbd2, 'fbd2_net_force', { axis: 'y' }, '0', '120');
  rightAndWrong(B.fbd2, 'fbd2_net_force', { axis: 'magnitude' }, '25 N', '65 N');
  rightAndWrong(B.hang, 'fbd2_missing_force', { force: '?' }, '80', '40');
  rightAndWrong(B.hang, 'fbd2_missing_force', { force: 1, net: 10 }, '90', '80');
  const incline: PracticeFigureSpec = { type: 'free_body_diagram_v2', params: { incline: { angle: 30 }, forces: [{ label: 'N', direction: 'normal' }, { label: 'W', direction: 'down', magnitude: 40 }, { label: 'f', direction: 'up-slope', magnitude: 12 }] } };
  rightAndWrong(incline, 'fbd2_net_force', { axis: 'along' }, '−8', '8');
  rightAndWrong(incline, 'fbd2_missing_force', { force: 'N' }, '34.64', '40');
  refused(() => run(B.hang, 'fbd2_net_force', { axis: 'x' }), /"\?" has no printed size/);
  refused(() => run(B.fbd2, 'fbd2_missing_force', { force: 'N' }), /is printed on the figure/);
  refused(() => run({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'T', direction: 40, magnitude: 5 }, { label: 'W', direction: 'down', magnitude: 3 }] } }, 'fbd2_net_force', { axis: 'x' }), /direction of "T" is not printed/);
  refused(() => run({ type: 'free_body_diagram_v2', params: { forces: [{ label: 'A', direction: 'up' }, { label: 'B', direction: 'down' }] } }, 'fbd2_missing_force', { force: 'A' }), /"B" .* no printed size either/);
});

test('shaded region checkers', () => {
  rightAndWrong(B.under, 'region_area', {}, '14', '18');
  rightAndWrong(B.between, 'region_area', {}, '16', '20');
  rightAndWrong(B.system, 'region_area', {}, '20.5', '41');
  rightAndWrong(B.system, 'region_contains', { x: 2, y: 3 }, 'Yes', 'No');
  rightAndWrong(B.system, 'region_contains', { x: 5, y: 3 }, 'no', 'yes');
  rightAndWrong(B.system, 'region_contains', { x: 4, y: 4 }, 'yes', 'no');
  rightAndWrong(B.system, 'region_contains', { x: 6, y: 1 }, 'no', 'yes');
  rightAndWrong(B.under, 'region_contains', { x: 3, y: 1 }, 'yes', 'no');
  rightAndWrong(B.under, 'region_contains', { x: 6, y: 1 }, 'no', 'yes');
  rightAndWrong(B.system, 'region_vertex_count', {}, '4', '3');
  const below: PracticeFigureSpec = { type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-4, 4], region: { type: 'under_curve', expr: 'x - 2', from: 0, to: 6 } } };
  rightAndWrong(below, 'region_area', {}, '10', '6');
  refused(() => run({ type: 'shaded_region', params: { xRange: [-3, 3], yRange: [-1, 6], region: { type: 'under_curve', expr: '4 - x^2', from: -2, to: 2 } } }, 'region_area', {}), /not a straight line/);
  refused(() => run({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'under_curve', expr: 'x/3 + 1', from: 1, to: 5 } } }, 'region_area', {}), /not on a gridline/);
  refused(() => run({ type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'inequalities', inequalities: [{ a: 1, b: 1, op: '<=', c: 6 }] } } }, 'region_area', {}), /edge of the plot/);
});

test('number line and sign chart checkers', () => {
  rightAndWrong(B.seg, 'nl_interval_notation', {}, '(−3, 4]', '[−3, 4)');
  rightAndWrong(B.seg, 'nl_interval_notation', {}, '(-3,4]', '(−3, 4)');
  rightAndWrong(B.line, 'nl_interval_notation', {}, '(−∞, −1/2] ∪ {1/2} ∪ (5/4, ∞)', '(−∞, −1/2) ∪ {1/2} ∪ (5/4, ∞)');
  rightAndWrong(B.line, 'nl_interval_notation', {}, '(-inf, -1/2] U {1/2} U (5/4, inf)', '(−∞, −1/2] ∪ [5/4, ∞)');
  rightAndWrong(B.seg, 'nl_contains', { x: 4 }, 'yes', 'no');
  rightAndWrong(B.seg, 'nl_contains', { x: -3 }, 'no', 'yes');
  rightAndWrong(B.line, 'nl_point_value', { point: 0 }, '1/2', '1/4');
  rightAndWrong({ type: 'number_line', params: { min: 0, max: 10, intervals: [{ from: 1, to: 4 }, { from: 3, to: 6, toOpen: true }, { from: 6, to: 8, fromOpen: true }] } }, 'nl_interval_notation', {}, '[1, 6) ∪ (6, 8]', '[1, 8]');
  rightAndWrong({ type: 'number_line', params: { min: 0, max: 10, intervals: [{ from: 1, to: 4 }, { from: 4, to: 6, fromOpen: true }] } }, 'nl_interval_notation', {}, '[1, 6]', '[1, 4] ∪ (4, 6]');
  refused(() => run({ type: 'number_line', params: { min: 0, max: 10 } }, 'nl_interval_notation', {}), /shows no set/);

  rightAndWrong(B.signs, 'sc_sign', { row: 0, interval: 2 }, 'negative', 'positive');
  rightAndWrong(B.signs, 'sc_sign', { row: 1, interval: 0 }, 'positive', 'negative');
  rightAndWrong(B.signs, 'sc_local_extrema', { row: 0, which: 'max', want: 'only' }, '1', '−2');
  rightAndWrong(B.signs, 'sc_local_extrema', { row: 0, which: 'min', want: 'all' }, 'x = −2 and x = 5', 'x = 1');
  rightAndWrong(B.signs, 'sc_local_extrema', { row: 0, which: 'min', want: 'count' }, '2', '1');
  rightAndWrong(B.signs, 'sc_sign_change', { row: 1, want: 'all' }, 'x = −2 and x = 5', '−2');
  rightAndWrong(B.signs, 'sc_sign_change', { row: 1, want: 'count' }, '2', '3');
  rightAndWrong(B.signs, 'sc_intervals', { row: 0, sign: 'positive' }, '(−2, 1) ∪ (5, ∞)', '(−∞, −2) ∪ (1, 5)');
  refused(() => run(B.signs, 'sc_sign', { row: 0, interval: 9 }), /0-based index/);
  refused(() => run({ type: 'sign_chart', params: { critical: [0], rows: [{ label: 'f′', signs: ['+', '-'], at: ['und'] }] } }, 'sc_local_extrema', { row: 0, which: 'max', want: 'only' }), /undefined at 0/);
});

test('distribution, histogram and box plot checkers', () => {
  rightAndWrong(B.normal, 'normal_shaded_area', { method: 'empirical' }, '0.815', '0.8186');
  rightAndWrong(B.normal, 'normal_shaded_area', { method: 'exact' }, '0.8186', '0.815');
  rightAndWrong(B.normal, 'normal_shaded_area', { method: 'empirical', as: 'percent' }, '81.5 %', '0.815');
  rightAndWrong(B.tails, 'normal_shaded_area', { method: 'exact' }, '0.1336', '0.0668');
  rightAndWrong(B.tails, 'normal_bound', { shade: 1, end: 'from' }, '650', '350');
  rightAndWrong(B.tails, 'normal_bound', { shade: 1, end: 'from', as: 'z' }, '1.5', '−1.5');
  rightAndWrong({ type: 'distribution_curve', params: { mean: 70, sd: 5, shade: [{ from: 80, to: null }] } }, 'normal_shaded_area', { method: 'empirical' }, '0.025', '0.05');
  rightAndWrong({ type: 'distribution_curve', params: { shade: [{ from: null, to: -3 }, { from: 0, to: 1 }] } }, 'normal_shaded_area', { method: 'empirical' }, '0.3415', '0.34');
  refused(() => run(B.tails, 'normal_shaded_area', { method: 'empirical' }), /whole number of standard deviations/);
  refused(() => run({ type: 'distribution_curve', params: {} }, 'normal_shaded_area', { method: 'exact' }), /nothing is shaded/);

  rightAndWrong(B.hist, 'hist_count', { bin: 2 }, '12', '7');
  rightAndWrong(B.hist, 'hist_count', { bin: 3 }, '6', '2');
  rightAndWrong(B.hist, 'hist_total', {}, '30', '24');
  rightAndWrong({ type: 'histogram', params: { ...B.hist.params, blankBins: [] } }, 'hist_modal_class', {}, '120–130', '110–120');
  refused(() => run(B.hist, 'hist_modal_class', {}), /a class is blank/);
  rightAndWrong(B.hist, 'hist_count_between', { from: 100, to: 120 }, '10', '22');
  refused(() => run(B.hist, 'hist_count_between', { from: 105, to: 120 }), /not a class boundary/);
  refused(() => run({ type: 'histogram', params: { binStart: 0, binWidth: 1, counts: [4, 4, 1] } }, 'hist_modal_class', {}), /two classes share/);

  rightAndWrong(B.box, 'box_stat', { plot: 0, stat: 'median' }, '18', '22');
  rightAndWrong(B.box, 'box_stat', { plot: 0, stat: 'q1' }, '12', '4');
  rightAndWrong(B.box, 'box_stat', { plot: 0, stat: 'iqr' }, '14', '32');
  rightAndWrong(B.box, 'box_stat', { plot: 0, stat: 'range' }, '32', '14');
  rightAndWrong(B.box, 'box_stat', { plot: 1, stat: 'range' }, '38', '22');
  rightAndWrong(B.box, 'box_compare', { stat: 'median', which: 'greatest' }, 'B', 'A');
  rightAndWrong(B.box, 'box_compare', { stat: 'range', which: 'least' }, 'Plot A', 'Plot B');
  refused(() => run(B.box, 'box_compare', { stat: 'iqr', which: 'least' }), /share/);
  refused(() => run(B.box, 'box_stat', { plot: 5, stat: 'median' }), /0-based index/);
  refused(() => run({ type: 'box_plot', params: { plots: [{ min: 1, q1: 2.3, median: 3, q3: 4, max: 5 }], range: [0, 6], step: 1 } }, 'box_stat', { plot: 0, stat: 'q1' }), /not on a gridline/);
});

test('complex plane and polar grid checkers', () => {
  rightAndWrong(B.complex, 'pc_modulus', { point: 0 }, '5', '7');
  rightAndWrong(B.complex, 'pc_argument', { point: 2 }, '135', '45');
  rightAndWrong(B.complex, 'pc_argument', { point: 2, unit: 'radians' }, '3π/4', 'π/4');
  rightAndWrong(B.complex, 'pc_sum', { points: [0, 1] }, '1 + 5i', '5 + 5i');
  rightAndWrong(B.complex, 'pc_sum', { points: [0, 1], want: 're' }, '1', '5');
  rightAndWrong(B.complex, 'pc_product', { points: [0, 1] }, '−10 − 5i', '−6 + 4i');
  rightAndWrong(B.complex, 'pc_product', { points: [0, 1], want: 'im' }, '−5', '5');
  rightAndWrong(B.complex, 'pc_product', { points: [0, 1], want: 'modulus' }, '11.18', '10');
  rightAndWrong(B.polar, 'pc_modulus', { point: 0 }, '3', '120');
  rightAndWrong(B.polar, 'pc_argument', { point: 0 }, '120°', '60°');
  refused(() => run(B.complex, 'pc_sum', { points: [0] }), /two different points/);
  refused(() => run({ type: 'polar_complex', params: { plane: 'complex', range: 6, points: [{ re: 1, im: 2 }] } }, 'pc_argument', { point: 0, unit: 'radians' }), /not a multiple of 15°/);
});

test('Punnett square checkers', () => {
  rightAndWrong(B.punnett, 'punnett_genotype_ratio', { genotypes: ['AA', 'Aa', 'aa'] }, '1 : 2 : 1', '1 : 1 : 2');
  rightAndWrong(B.punnett, 'punnett_phenotype_ratio', {}, '3:1', '1:3');
  rightAndWrong(B.punnett, 'punnett_probability', { genotype: 'Aa' }, '1/2', '1/4');
  rightAndWrong(B.punnett, 'punnett_probability', { phenotype: 'white' }, '0.25', '0.75');
  rightAndWrong(B.punnett, 'punnett_probability', { phenotype: 'purple', as: 'percent' }, '75%', '25%');
  rightAndWrong(B.punnett, 'punnett_cell', { row: 1, col: 1 }, 'aa', 'Aa');
  rightAndWrong(B.punnett, 'punnett_gamete', { edge: 'top', index: 0 }, 'A', 'a');
  const di: PracticeFigureSpec = { type: 'punnett_square', params: { top: ['RY', 'Ry', 'rY', 'ry'], side: ['RY', 'Ry', 'rY', 'ry'], phenotypes: [{ label: 'round yellow', genotypes: ['RRYY', 'RRYy', 'RrYY', 'RrYy'] }, { label: 'round green', genotypes: ['RRyy', 'Rryy'] }, { label: 'wrinkled yellow', genotypes: ['rrYY', 'rrYy'] }, { label: 'wrinkled green', genotypes: ['rryy'] }] } };
  rightAndWrong(di, 'punnett_phenotype_ratio', {}, '9:3:3:1', '9:3:4');
  rightAndWrong(di, 'punnett_probability', { genotype: 'RrYy' }, '1/4', '1/16');
  refused(() => run(B.punnett, 'punnett_probability', { genotype: 'AB' }), /does not occur/);
  refused(() => run({ type: 'punnett_square', params: { top: ['A', 'a'], side: ['A', 'a'] } }, 'punnett_phenotype_ratio', {}), /no phenotypes/);
});

test('pedigree checkers: counts, and each inheritance mode against known pedigrees', () => {
  rightAndWrong(B.pedigree, 'pedigree_count', { status: 'affected' }, '2', '3');
  rightAndWrong(B.pedigree, 'pedigree_count', { sex: 'F' }, '3', '4');
  rightAndWrong(B.pedigree, 'pedigree_count', { sex: 'M', status: 'unaffected' }, '2', '4');
  rightAndWrong(B.pedigree, 'pedigree_count', { generation: 2 }, '3', '2');
  const modes = (spec: PracticeFigureSpec) => (['autosomal_dominant', 'autosomal_recessive', 'x_linked_dominant', 'x_linked_recessive'] as const).filter((mode) => (run(spec, 'pedigree_mode_consistent', { mode }) as { value: string }).value === 'yes');
  // Unaffected parents, affected daughter: only autosomal recessive (an X-linked recessive daughter needs an affected father).
  assert.deepEqual(modes(family('M', 'F', 'F*')), ['autosomal_recessive']);
  // Unaffected parents, affected son: recessive, autosomal or X-linked.
  assert.deepEqual(modes(family('M', 'F', 'M*')), ['autosomal_recessive', 'x_linked_recessive']);
  // Two affected parents, an unaffected daughter: dominant and autosomal (an X-linked dominant father passes it to every daughter).
  assert.deepEqual(modes(family('M*', 'F*', 'F')), ['autosomal_dominant']);
  // Two affected parents, an unaffected son: dominant, either way.
  assert.deepEqual(modes(family('M*', 'F*', 'M')), ['autosomal_dominant', 'x_linked_dominant']);
  // Affected father, unaffected mother, affected son and unaffected daughter: not X-linked dominant.
  assert.deepEqual(modes(family('M*', 'F', 'M*', 'F')), ['autosomal_dominant', 'autosomal_recessive', 'x_linked_recessive']);
  // Affected mother, unaffected father, unaffected son: not X-linked recessive (every son of an affected mother is affected).
  assert.deepEqual(modes(family('M', 'F*', 'M')), ['autosomal_dominant', 'autosomal_recessive', 'x_linked_dominant']);
  // Affected father, unaffected mother, affected daughter and unaffected son: every mode fits.
  assert.deepEqual(modes(family('M*', 'F', 'F*', 'M')), ['autosomal_dominant', 'autosomal_recessive', 'x_linked_dominant', 'x_linked_recessive']);
  // Affected father, unaffected mother, unaffected daughter: not X-linked dominant.
  assert.ok(!modes(family('M*', 'F', 'F')).includes('x_linked_dominant'));
  // A classic three-generation X-linked recessive chart with its carriers marked: recessive only.
  assert.deepEqual(modes(B.pedigree), ['autosomal_recessive', 'x_linked_recessive']);
  // The same chart, with the carrier's father UNAFFECTED: a carrier daughter is still possible, but a
  // half-filled symbol has no meaning under a dominant mode.
  assert.ok(!modes(B.pedigree).includes('autosomal_dominant'));
  // Three generations: affected grandfather, unaffected children, an affected granddaughter by an
  // unrelated unaffected father — X-linked recessive is ruled out, autosomal recessive is not.
  const skip: PracticeFigureSpec = { type: 'pedigree', params: { individuals: [{ id: 'gf', sex: 'M', affected: true }, { id: 'gm', sex: 'F' }, { id: 'd', sex: 'F', father: 'gf', mother: 'gm' }, { id: 'h', sex: 'M' }, { id: 'gd', sex: 'F', father: 'h', mother: 'd', affected: true }] } };
  assert.deepEqual(modes(skip), ['autosomal_recessive']);
  rightAndWrong(skip, 'pedigree_mode_consistent', { mode: 'x_linked_recessive' }, 'No', 'Yes');
  rightAndWrong(skip, 'pedigree_only_mode', {}, 'autosomal recessive', 'X-linked recessive');
  refused(() => run(family('M*', 'F', 'F*', 'M'), 'pedigree_only_mode', {}), /4 of the four modes fit/);
  refused(() => run(skip, 'pedigree_mode_consistent', { mode: 'y_linked' }), /must be one of/);
});

test('batch 1: a whole item — the key is recomputed from the spec; a wrong key is a mismatch', () => {
  const it = item(B.box, { problemText: 'The box plots show two classes. What is the interquartile range of class A?', answer: '14', alt: 'Two box plots over one numbered axis.', derivation: { checker: 'box_stat', args: { plot: 0, stat: 'iqr' } } });
  const ok = examineFigureItem(it);
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  assert.ok(ok.figureText?.includes('box plot'));
  assert.equal(examineFigureItem({ ...it, answer: '32' }).derivation.status, 'mismatch');
  const mc = item(B.uc, { responseFormat: 'mcq', problemText: 'The unit circle shows point P. What is the missing coordinate?', choices: ['−1/2', '1/2', '√3/2', '−√3/2'], answer: 'B', alt: 'A unit circle with marked points.', derivation: { checker: 'uc_coordinates', args: { angle: 0, want: 'y' } } });
  assert.equal(examineFigureItem(mc).derivation.status, 'derived');
  assert.equal(examineFigureItem({ ...mc, answer: 'A' }).derivation.status, 'mismatch');
});

test('every checker is documented for the writer, and tested above', () => {
  const cat = checkerCatalogue(ALL_PRACTICE_FIGURE_KINDS);
  // The writer's own prompt lists only the kinds the job generates for.
  assert.ok(!checkerCatalogue().includes('uc_coordinates') && checkerCatalogue().includes('curve_value'));
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

// ── polish round 2026-10-11: π axes (g), alt descriptions (k), the redrawn kinds ──

const PI = Math.PI;
const piGraph: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [-2 * PI, 2 * PI], yRange: [-2, 2], yStep: 1, xTickUnit: 'pi', xTickDivisor: 2, curves: [{ expr: 'sin(x)', label: 'f' }], points: [{ x: PI / 2, y: 1, label: 'P' }], asymptotes: [{ x: -PI }] } };

test('g. axesOf reads a π axis: numbered gridlines every π ÷ divisor, one lighter line between, values on it written as multiples of π', () => {
  const ax = axesOf(piGraph);
  assert.ok(ax.x && ax.y);
  assert.equal(ax.x.pi, 2);
  assert.ok(Math.abs(ax.x.step - PI / 2) < 1e-12 && Math.abs(ax.x.minor - PI / 4) < 1e-12 && ax.x.numbered);
  assert.ok(Math.abs(ax.x.min + 2 * PI) < 1e-12 && Math.abs(ax.x.max - 2 * PI) < 1e-12);
  assert.equal(ax.y.pi, undefined);
  assert.ok(onGrid(PI / 4, ax.x) && onGrid(-3 * PI / 2, ax.x) && !onGrid(1, ax.x) && !onGrid(PI / 3, ax.x));
  assert.equal(axisText(3 * PI / 4, ax.x), '3π/4');
  assert.equal(axisText(-PI, ax.x), '-π');
  assert.equal(axisText(0, ax.x), '0');
  assert.equal(axisText(2, ax.y), '2');
  assert.equal(readOff(PI / 2, ax.x), 'π/2');
  assert.match(readOff(1, ax.x), /^between π\/4 and π\/2 /);
  // The same grid the renderer draws: a major line at every multiple of π/2, a minor at every π/4.
  const svg = renderPracticeFigure(piGraph).svg;
  const count = (stroke: string) => (new RegExp(`<path d="([^"]+)" stroke="${stroke}"`).exec(svg)?.[1].match(/M[-\d.]+,[-\d.]+V/g) ?? []).length;
  assert.equal(count('#cbd5e1'), 9, '−2π … 2π in steps of π/2');
  assert.equal(count('#e9eef4'), 17, 'and in steps of π/4');
  // y can be a π axis too; a divisor needs the unit; step and unit together are refused; the range must end on ticks.
  assert.equal(axesOf({ type: 'function_graph', params: { xRange: [-2, 2], xStep: 1, yRange: [-PI, PI], yTickUnit: 'pi', curves: [{ expr: 'atan(x)' }] } }).y?.pi, 1);
  refused(() => axesOf({ type: 'function_graph', params: { ...piGraph.params, xStep: 1 } }), /give xStep or xTickUnit, not both/);
  refused(() => axesOf({ type: 'function_graph', params: { ...piGraph.params, xTickUnit: 'tau' } }), /xTickUnit must be 'pi'/);
  refused(() => axesOf({ type: 'function_graph', params: { ...piGraph.params, xTickDivisor: 2.5 } }), /xTickDivisor must be a whole number from 1 to 12/);
  refused(() => axesOf({ type: 'function_graph', params: { ...piGraph.params, xRange: [-6.6, 6.6] } }), /both ends of the range must be multiples of the step \(π\/2/);
  refused(() => axesOf({ type: 'function_graph', params: { ...piGraph.params, xTickUnit: undefined } }), /xStep must be given/);
});

test('g. the transcription and the checkers run on a π-tick graph directly', () => {
  const d = describeFigure(piGraph);
  assert.match(d.text, /x axis: label "x"; runs from -2π to 2π; numbered gridlines every π\/2 \(labelled as multiples of π\), lighter gridlines every π\/4\./);
  assert.ok(d.readable.includes('  x = π/2: y = 1') && d.readable.includes('  x = -3π/2: y = 1') && d.readable.includes('  x = π: y = 0'));
  assert.ok(d.readable.some((l) => /Marked point labelled "P": a filled dot at \(π\/2, 1\)\./.test(l)));
  assert.ok(d.readable.some((l) => /Dashed vertical guide line at x = -π\./.test(l)));
  assert.equal(value(run(piGraph, 'curve_value', { curve: 0, x: PI / 2 })), 1);
  assert.ok(Math.abs(value(run(piGraph, 'curve_value', { curve: 0, x: -PI / 2 })) + 1) < 1e-12);
  assert.ok(Math.abs(value(run(piGraph, 'point_coordinate', { point: 'P', want: 'x' })) - PI / 2) < 1e-9);
  refused(() => run(piGraph, 'curve_value', { curve: 0, x: 1 }), /does not lie on a gridline/);
  // The whole item check passes on it.
  const exam = examineFigureItem(item(piGraph, { answer: '1', derivation: { checker: 'curve_value', args: { curve: 0, x: PI / 2 } } }));
  assert.deepEqual(exam.defects, [], exam.defects.join(' | '));
  assert.equal(exam.derivation.status, 'derived', exam.derivation.detail);
  assert.match(exam.figureText ?? '', /numbered gridlines every π\/2/);
});

test('the redrawn kinds are transcribed as drawn: no half-unit grid on a vector diagram, a double (not dashed) lower curve, marked points, angle arcs, lettered titration points', () => {
  const vec: PracticeFigureSpec = { type: 'vector_diagram', params: { xRange: [-1, 5], yRange: [-1, 5], vectors: [{ head: [3, 2], label: 'v', angle: { label: '?' } }] } };
  assert.match(describeFigure(vec).text, /gridlines every 1\./);
  assert.match(describeFigure({ type: 'vector_diagram', params: { ...vec.params, minorGrid: true } }).text, /gridlines every 0\.5\./);
  assert.ok(describeFigure(vec).readable.some((l) => /an arc at its tail marks the angle it makes with the positive x-direction, measured counter-clockwise, labelled with \(blank/.test(l)));
  assert.ok(!/33\.7|33\.69/.test(describeFigure(vec).text), 'the size of a blank angle is not transcribed');
  // A head on a half unit is no longer "on the grid" unless the half-unit lines are drawn.
  const half: PracticeFigureSpec = { type: 'vector_diagram', params: { xRange: [-1, 5], yRange: [-1, 5], vectors: [{ head: [3, 2.5], label: 'v' }] } };
  refused(() => run(half, 'vec_components', { vector: 0, want: 'y' }), /not on a gridline/);
  assert.equal(value(run({ type: 'vector_diagram', params: { ...half.params, minorGrid: true } }, 'vec_components', { vector: 0, want: 'y' })), 2.5);
  const between: PracticeFigureSpec = { type: 'shaded_region', params: { xRange: [-4, 4], yRange: [-4, 6], region: { type: 'between_curves', upper: { expr: '4 - x^2', label: 'f' }, lower: { expr: 'x + 2', label: 'g' }, from: -2, to: 1 }, points: [{ x: 1, y: 3, label: 'P' }, { x: 0, y: 0, label: '?', open: true }] } };
  const t = describeFigure(between);
  assert.ok(t.readable.some((l) => /^Lower curve \(legend "g"\): a DOUBLE STRAIGHT line \(two thin parallel lines side by side/.test(l)));
  assert.ok(!/dashed/i.test(t.text), 'nothing between two curves is called dashed');
  assert.ok(t.readable.includes('Marked point labelled "P": a filled dot at (1, 3).'));
  assert.ok(t.readable.some((l) => /^Marked point labelled with \(blank — a "\?" box\): an open circle at \(0, 0\)\.$/.test(l)));
  assert.ok(t.printed.includes('point label: "P"'));
  const titr: PracticeFigureSpec = { type: 'titration_curve', params: { analyte: { type: 'weak_acid', concentration: 0.1, volume: 25, pKa: 5 }, titrantConcentration: 0.1, maxVolume: 50, points: [{ volume: 10, label: 'B' }, { volume: 25, label: 'C' }] } };
  const tt = describeFigure(titr);
  assert.ok(tt.printed.includes('point label: "B"') && tt.printed.includes('point label: "C"'));
  assert.ok(tt.readable.some((l) => /^A dot ON the curve lettered "B" at volume 10, pH between 4 and 5 .* \(no guide lines\)\.$/.test(l)));
  assert.ok(tt.readable.some((l) => /^A dot ON the curve lettered "C" at volume 25, /.test(l)));
});

test('k. describeForAlt: specific — the kind, its components in words, and the labels printed on the figure by role', () => {
  const chart: PracticeFigureSpec = { type: 'sign_chart', params: { critical: [-2, 1, 5], rows: [{ label: 'f′(x)', signs: ['-', '+', '-', '+'], at: ['0', '0', '0'], blankSigns: [2] }] } };
  assert.equal(describeForAlt(chart), 'A sign chart. Printed on it: critical numbers "−2", "1", "5"; row label "f′(x)". One place is left blank, shown as a boxed question mark.');
  assert.equal(
    describeForAlt({ type: 'vector_diagram', params: { xRange: [-1, 9], yRange: [-1, 7], tipToTail: true, vectors: [{ components: [3, 1], label: 'a' }, { components: [1, 4], label: 'b' }] } }),
    'A diagram of vectors drawn as arrows on a numbered grid, with two arrows. Printed on it: axis labels "x", "y"; arrow labels "a", "b".',
  );
  // An axis left to a layout default: `describeFigure` refuses, the alt is still made — from the picture's own text.
  const loose: PracticeFigureSpec = { type: 'function_graph', params: { xRange: [-4, 4], yRange: [-4, 6], curves: [{ expr: 'x^2 - 2', label: 'f' }, { expr: 'x', label: 'g' }], points: [{ x: 2, y: 2 }] } };
  refused(() => describeFigure(loose), /xStep must be given/);
  assert.equal(describeForAlt(loose), 'A graph of curves on a coordinate grid, with two curves, one marked point. Printed on it: labels "y", "x", "f", "g".');
  // Never longer than an alt may be.
  const long = describeForAlt({ type: 'bar_chart', params: { categories: Array.from({ length: 24 }, (_, i) => `Category number ${i + 1} with a long name`), values: Array.from({ length: 24 }, (_, i) => i), yMin: 0, yMax: 25, yStep: 5 } });
  assert.ok(long.length <= 600 && long.length >= 12, String(long.length));
  const names = describeForAlt({ type: 'bar_chart', params: { categories: Array.from({ length: 24 }, (_, i) => `Item ${i + 1} of the survey list`), values: Array.from({ length: 24 }, (_, i) => i), yMin: 0, yMax: 25, yStep: 5, yLabel: 'A rather long label for the value axis of this chart', title: 'A long title that the alt does not need to repeat in full but may' } });
  assert.ok(names.length <= 600, String(names.length));
});

/** Everything in an alt that could be a value: its quoted labels and its digits. */
function altIsOnlyWhatIsDrawn(spec: PracticeFigureSpec, alt: string, id: string): void {
  const drawn = svgTexts(renderPracticeFigure(spec).svg);
  const squash = (t: string) => t.replace(/[₀-₉]/g, (c) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))).replace(/ₒ/g, 'o').replace(/ᵢ/g, 'i').replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase();
  const all = squash(drawn.join(''));
  for (const q of alt.matchAll(/"([^"]*)"/g)) assert.ok(all.includes(squash(q[1])), `${id}: the alt names "${q[1]}", which the figure does not print`);
  // Outside the quoted labels an alt carries no digit at all (counts are words).
  assert.ok(!/\d/.test(alt.replace(/"[^"]*"/g, '')), `${id}: a digit outside a quoted label — ${alt}`);
}

test('k. describeForAlt is answer-safe by construction: over every fixture it names only text the rendered figure prints, and no number of its own', () => {
  let made = 0;
  for (const f of FIGURE_FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600, `${f.id}: ${alt.length} characters`);
    assert.ok(/^[A-Z]/.test(alt) && /\.$/.test(alt), f.id);
    altIsOnlyWhatIsDrawn(f.spec, alt, f.id);
    assert.equal(describeForAlt(JSON.parse(JSON.stringify(f.spec))), alt, `${f.id}: deterministic`);
    made++;
  }
  assert.equal(made, FIGURE_FIXTURES.length);
  assert.ok(made >= 129);
});

test('k. describeForAlt never includes a value the spec hides', () => {
  /** [what is hidden, the spec, the texts that must not appear]. */
  const cases: Array<[string, PracticeFigureSpec, string[]]> = [
    ['a blank sign-chart cell and a blank value at a critical number', { type: 'sign_chart', params: { critical: [{ value: 0.5, label: 'a' }, 7], rows: [{ label: 'g(x)', signs: ['+', '-', '+'], at: ['und', '0'], blankSigns: [1], blankAt: [0] }] } }, ['und', '0.5', '−"', '"-"']],
    ['a blank Punnett cell and gamete', { type: 'punnett_square', params: { top: ['T', 't'], side: ['T', 't'], blankCells: [[1, 1]], blankSide: [1], blankTop: [0] } }, ['"tt"', 'Tt', 'recessive']],
    ['a "?" dimension of a solid', { type: 'solid_3d', params: { solid: 'cone', radius: 5, height: 12, unit: 'cm', labels: { slant: '?' } } }, ['13']],
    ['a hidden resultant', { type: 'vector_diagram', params: { xRange: [-1, 9], yRange: [-1, 9], tipToTail: true, vectors: [{ components: [3, 1], label: 'a' }, { components: [4, 6], label: 'b' }] } }, ['resultant', '"R"', '7']],
    ['a blank angle arc', { type: 'vector_diagram', params: { xRange: [-5, 5], yRange: [-1, 5], vectors: [{ head: [-3, 3], label: 'B', angle: { label: '?' } }] } }, ['135']],
    ['the sign of a charge', { type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: -2, y: 0, q: 1, showSign: false, label: 'A' }, { x: 2, y: 0, q: -1, showSign: false, label: 'B' }] } }, ['"+"', '"−"', 'positive', 'negative']],
    ['a blank image distance and height', { type: 'ray_diagram', params: { element: 'converging_lens', focalLength: 10, objectDistance: 30, objectHeight: 4, show: { objectDistance: 'value', imageDistance: 'blank', imageHeight: 'blank', objectHeight: 'value' } } }, ['15', '"2 cm"', 'real', 'inverted']],
    ['bar values', { type: 'bar_chart', params: { categories: ['Red', 'Blue'], values: [37, 12], yMin: 0, yMax: 40, yStep: 10 } }, ['37', '12']],
    ['an equivalence point that is not marked', { type: 'titration_curve', params: { analyte: { type: 'strong_acid', concentration: 0.1, volume: 25 }, titrantConcentration: 0.125, maxVolume: 40 } }, ['equivalence', '"20"', 'strong']],
    ['a shaded area that is not printed', { type: 'distribution_curve', params: { mean: 500, sd: 100, shade: [{ from: 650, to: null, label: '?' }] } }, ['0.0668', '650', '6.68']],
    ['the force on a moving charge', { type: 'field_diagram', params: { variant: 'magnetic_force', field: 'into', charge: { sign: '−', velocity: 'right' } } }, ['down', '"F"', 'force label']],
    ['an unknown individual of a pedigree', { type: 'pedigree', params: { individuals: [{ id: 'f', sex: 'M', affected: true }, { id: 'm', sex: 'F' }, { id: 'c', sex: 'F', father: 'f', mother: 'm', unknown: true }] } }, ['recessive', 'dominant']],
  ];
  for (const [what, spec, never] of cases) {
    const alt = describeForAlt(spec);
    altIsOnlyWhatIsDrawn(spec, alt, what);
    for (const t of never) assert.ok(!alt.includes(t), `${what}: the alt contains ${t} — ${alt}`);
  }
  // The same figures WITH the value shown do name it — the description follows the picture.
  assert.ok(describeForAlt({ type: 'solid_3d', params: { solid: 'cone', radius: 5, height: 12, unit: 'cm', labels: { slant: 'auto' } } }).includes('"13 cm"'));
  assert.ok(describeForAlt({ type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: -2, y: 0, q: 1, label: 'A' }, { x: 2, y: 0, q: -1, label: 'B' }] } }).includes('"+"'));
});

test('k. describeForAlt `hide`: a printed label that gives the answer away is left out; a value that is part of the figure itself is refused', () => {
  const solid: PracticeFigureSpec = { type: 'solid_3d', params: { solid: 'cylinder', radius: 3, height: 8, unit: 'cm' } };
  assert.ok(describeForAlt(solid).includes('"3 cm"') && describeForAlt(solid).includes('"8 cm"'));
  const hidden = describeForAlt(solid, { hide: [8] });
  assert.ok(hidden.includes('"3 cm"') && !hidden.includes('8'), hidden);
  assert.ok(!describeForAlt(solid, { hide: ['3 CM', 8] }).includes('cm'), 'texts are matched without regard to case or spacing');
  const chart: PracticeFigureSpec = { type: 'sign_chart', params: { critical: [-2, 1], rows: [{ label: 'f′(x)', signs: ['-', '+', '-'] }] } };
  assert.ok(!describeForAlt(chart, { hide: ['-2'] }).includes('2'), 'a number is matched as a number (−2 printed with a real minus)');
  assert.ok(describeForAlt(chart, { hide: ['-2'] }).includes('"1"'));
  refused(() => describeForAlt(chart, { hide: ['sign chart'] }), /a value to hide .* is part of what the figure itself is/);
  assert.equal(describeForAlt(chart, { hide: [] }), describeForAlt(chart));
});

console.log(`${passed} figure-core test(s) passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
