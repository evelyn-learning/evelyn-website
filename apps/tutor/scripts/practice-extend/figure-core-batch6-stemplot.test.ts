/**
 * Tests for scripts/practice-extend/figure-core-batch6-stemplot.ts (stemplot),
 * reached the way the job reaches it — through figure-core.ts.
 *
 * Per checker: right keys accepted, wrong keys rejected; textbook cases with
 * known answers (AP quartiles: the median of each half, the overall median
 * left out when n is odd; 1.5 × IQR fences); refusals for what the figure
 * cannot settle (a hidden leaf, a borderline shape, a tie). The transcription
 * gives every leaf; the alt text stays short and names no leaf.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch6-stemplot.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b6-stemplot';
import { BATCH6_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch6-stemplot';

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

type Args = Record<string, unknown>;
const used = new Set<string>();
const run = (spec: PracticeFigureSpec, checker: string, args: Args = {}): Derived => {
  used.add(checker);
  return runChecker(spec, { checker, args });
};
const refused = (fn: () => unknown, re: RegExp): void => { assert.throws(fn, (e: unknown) => e instanceof FigureRuleError && re.test((e as Error).message), String(re)); };
function item(spec: PracticeFigureSpec, over: Partial<FigureItem>): FigureItem {
  return {
    objectiveLoId: 'apstats.quantitative-graphs', responseFormat: 'numeric', problemText: 'Use the stemplot shown. What value does it give?', answer: '0', choices: [], hints: ['Read the stemplot.'],
    solutionText: 'Work it out from the stemplot.', difficulty: 2, covers: 'reading a stemplot', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A stem-and-leaf plot.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
function rwText(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const S = (params: Args): PracticeFigureSpec => ({ type: 'stemplot', params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

const scores = fx('stem-simple-test-scores');       // 62 66 | 70 73 75 78 79 | 80 81 82 84 88 | 91 95
const commute = fx('stem-skewed-commute-outlier');  // 5 8 | 10 12 12 14 15 17 18 | 20 21 23 25 28 | 30 34 | 41 | 58
const classes = fx('stem-back-to-back-classes');    // A: 58 62 65 67 70 71 74 76 78 82 83 85 91; B: 64 69 72 75 78 80 83 84 86 87 89 90 92 95
const battery = fx('stem-split-decimal-battery');   // 3.1 3.4 | 3.5 3.7 3.8 3.9 | 4.0 4.0 4.2 4.3 4.4 | 4.5 4.6 4.8 | — | 5.9
const blank = fx('stem-blank-missing-leaf');        // 18 | 22 25 29 | 30 33 ? 36 | 44 47
// Left-skewed with a low outlier: 41 | 55 | 62 68 | 71 74 77 79 | 81 82 84 85 86 88 89 | 90 92 94
const leftSkew = S({ key: { stem: 8, leaf: 1 }, stems: [4, 5, 6, 7, 8, 9], leaves: [[1], [5], [2, 8], [1, 4, 7, 9], [1, 2, 4, 5, 6, 8, 9], [0, 2, 4]] });
// Mean well above the median but balanced tails: no single shape word.
const borderline = S({ key: { stem: 2, leaf: 0 }, stems: [2, 3, 4], leaves: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [], [0, 1, 2, 3, 4]] });

test('registration: the part speaks for stemplot; its checkers are in BATCH6_CHECKERS and in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['stemplot']);
  assert.ok(Object.keys(PART.checkers).length >= 10);
  for (const k of Object.keys(PART.checkers)) {
    assert.ok(k.startsWith('stem_'), k);
    assert.equal(BATCH6_CHECKERS[k], PART.checkers[k], k);
  }
  const cat = checkerCatalogue(['stemplot']);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
  assert.ok(/AP method/.test(PART.checkers.stem_stat.returns), 'the quartile method is stated');
});

test('transcription: the key, the labels and every stem row with its leaves exactly as printed', () => {
  const t = textOf(scores);
  assert.ok(t.startsWith('The figure is a stem-and-leaf plot.'), t.split('\n')[0]);
  assert.ok(t.includes('- key: "Key: 6 | 2 = 62 points"'), t);
  assert.ok(t.includes('- title: "Unit test scores"') && t.includes('- column heading: "Stem"') && t.includes('- column heading: "Leaf"'), t);
  for (const row of ['6 | 2 6', '7 | 0 3 5 8 9', '8 | 0 1 2 4 8', '9 | 1 5']) assert.ok(t.includes(`  ${row}`), `${row} in\n${t}`);
  assert.ok(/14 values/.test(t), t);
  // An empty stem is a row with no leaves.
  assert.ok(textOf(commute).includes('  4 | 1') && /  3 \| 0 4/.test(textOf(commute)));
  const b = textOf(classes);
  assert.ok(b.startsWith('The figure is a back-to-back stem-and-leaf plot, "Class A" on the left and "Class B" on the right.'), b.split('\n')[0]);
  assert.ok(b.includes('  7 5 2 | 6 | 4 9') && b.includes('  8 6 4 1 0 | 7 | 2 5 8'), b);
  assert.ok(b.includes('  8 | 5 | (none)') || b.includes('  8 | 5 |'), b);
  assert.ok(b.includes('Key: 1 | 7 | 4 means 71 points for Class A and 74 points for Class B'), b);
  const s = textOf(battery);
  assert.ok(s.includes('  3 | 1 4   (leaves 0–4)') && s.includes('  3 | 5 7 8 9   (leaves 5–9)') && s.includes('  5 |    (leaves 0–4)'), s);
  const k = textOf(blank);
  assert.ok(k.includes('  3 | 0 3 ? 6') && /One leaf is left out/.test(k), k);
});

test('describeForAlt: short, names the plot and its key and stems — never a leaf; hide drops what holds the value', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length > 20 && alt.length <= 320, `${f.id}: ${alt.length}: ${alt}`);
    assert.ok(/^A (back-to-back )?stem-and-leaf plot/.test(alt), `${f.id}: ${alt}`);
  }
  const alt = describeForAlt(scores);
  assert.ok(alt.includes('"Key: 6 | 2 = 62 points"') && alt.includes('"Unit test scores"') && /stems "6", "7", "8", "9"/.test(alt), alt);
  for (const n of ['70', '73', '79.5', '95']) assert.ok(!new RegExp(`(?<![\\d.])${n.replace('.', '\\.')}(?![\\d.])`).test(alt), `${n} in: ${alt}`);
  const hid = describeForAlt(scores, { hide: [62] });
  assert.ok(!hid.includes('Key:'), hid);
  assert.ok(describeForAlt(classes).includes('"Class A"') && describeForAlt(classes).includes('"Class B"'));
});

test('stem_values and stem_stat n/min/max/range/sum: read from every leaf; a back-to-back plot needs a side', () => {
  rw(scores, 'stem_values', {}, '62, 66, 70, 73, 75, 78, 79, 80, 81, 82, 84, 88, 91, 95', '62, 66, 70, 73, 75, 78, 79, 80, 81, 82, 84, 88, 91');
  rw(battery, 'stem_values', {}, '3.1, 3.4, 3.5, 3.7, 3.8, 3.9, 4.0, 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.8, 5.9', '31, 34, 35, 37, 38, 39, 40, 40, 42, 43, 44, 45, 46, 48, 59');
  rw(scores, 'stem_stat', { stat: 'n' }, '14', '13');
  rw(scores, 'stem_stat', { stat: 'min' }, '62', '60');
  rw(scores, 'stem_stat', { stat: 'max' }, '95', '9');
  rw(scores, 'stem_stat', { stat: 'range' }, '33', '35');
  rw(scores, 'stem_stat', { stat: 'sum' }, '1104', '1105');
  rw(classes, 'stem_stat', { side: 'left', stat: 'n' }, '13', '14');
  rw(classes, 'stem_stat', { side: 'Class B', stat: 'n' }, '14', '13');
  rw(classes, 'stem_stat', { side: 'all', stat: 'n' }, '27', '14');
  rw(classes, 'stem_stat', { side: 'right', stat: 'range' }, '31', '33');
  refused(() => run(classes, 'stem_stat', { stat: 'median' }), /back-to-back.*"side"/);
  refused(() => run(scores, 'stem_stat', { side: 'left', stat: 'median' }), /one set of leaves/);
  refused(() => run(classes, 'stem_stat', { side: 'Class C', stat: 'n' }), /"side" must be/);
  refused(() => run(scores, 'stem_stat', { stat: 'sd' }), /"stat" must be one of/);
});

test('stem_stat median / q1 / q3 / iqr by the AP method (the median of each half; the overall median left out when n is odd)', () => {
  rw(scores, 'stem_stat', { stat: 'median' }, '79.5', '79');
  rw(scores, 'stem_stat', { stat: 'q1' }, '73', '72');
  rw(scores, 'stem_stat', { stat: 'q3' }, '84', '85');
  rw(scores, 'stem_stat', { stat: 'iqr' }, '11', '12');
  // n = 13 (odd): the median 74 sits in neither half.
  rw(classes, 'stem_stat', { side: 'left', stat: 'median' }, '74', '76');
  rw(classes, 'stem_stat', { side: 'left', stat: 'q1' }, '66', '65');
  rw(classes, 'stem_stat', { side: 'left', stat: 'q3' }, '82.5', '83');
  rw(classes, 'stem_stat', { side: 'left', stat: 'iqr' }, '16.5', '17');
  rw(classes, 'stem_stat', { side: 'right', stat: 'median' }, '83.5', '84');
  rw(battery, 'stem_stat', { stat: 'median' }, '4.0', '4.2');
  rw(battery, 'stem_stat', { stat: 'q1' }, '3.7', '3.6');
  rw(battery, 'stem_stat', { stat: 'iqr' }, '0.8', '0.7');
  rw(commute, 'stem_stat', { stat: 'median' }, '19', '20');
  refused(() => run(S({ key: { stem: 1, leaf: 0 }, stems: [1], leaves: [[1, 2, 3]] }), 'stem_stat', { stat: 'q1' }), /at least 4 values/);
});

test('stem_stat mean: exact when it terminates, a rounded value otherwise; stem_five_number', () => {
  rw(battery, 'stem_stat', { stat: 'mean' }, '4.14', '4.1');
  rw(scores, 'stem_stat', { stat: 'mean' }, '78.86', '78.8');
  rw(scores, 'stem_stat', { stat: 'mean' }, '78.9', '79.0');
  rw(commute, 'stem_stat', { stat: 'mean' }, '21.7', '19');
  rw(scores, 'stem_five_number', {}, '62, 73, 79.5, 84, 95', '62, 73, 79, 84, 95');
  rw(classes, 'stem_five_number', { side: 'right' }, '64, 75, 83.5, 89, 95', '64, 72, 83.5, 89, 95');
});

test('stem_mode: every most-frequent value; refused when every value appears once', () => {
  rw(commute, 'stem_mode', {}, '12', '58');
  rw(battery, 'stem_mode', {}, '4.0', '4.4');
  rw(fx('stem-dense-reaction-times'), 'stem_mode', {}, '130, 131, 132, 133, 134, 135, 136, 138', '130');
  refused(() => run(scores, 'stem_mode', {}), /every value appears once/);
});

test('stem_count_where: >, ≥, <, ≤, = and between (inclusive); as a count, a proportion or a percent', () => {
  rw(scores, 'stem_count_where', { op: 'gt', value: 80 }, '6', '7');
  rw(scores, 'stem_count_where', { op: '>=', value: 80 }, '7', '6');
  rw(scores, 'stem_count_where', { op: 'lt', value: 70 }, '2', '3');
  rw(scores, 'stem_count_where', { op: '<=', value: 70 }, '3', '2');
  rw(commute, 'stem_count_where', { op: 'eq', value: 12 }, '2', '1');
  rw(scores, 'stem_count_where', { op: 'between', value: 70, to: 79 }, '5', '7');
  rw(battery, 'stem_count_where', { op: 'gt', value: 4.4 }, '4', '5');
  rw(scores, 'stem_count_where', { op: 'gt', value: 80, as: 'proportion' }, '3/7', '6/13');
  rw(scores, 'stem_count_where', { op: 'ge', value: 80, as: 'percent' }, '50', '7');
  rw(classes, 'stem_count_where', { side: 'right', op: 'ge', value: 90 }, '3', '1');
  refused(() => run(scores, 'stem_count_where', { op: 'between', value: 80 }), /"to"/);
  refused(() => run(scores, 'stem_count_where', { op: 'between', value: 80, to: 70 }), /"to" must be greater/);
  refused(() => run(scores, 'stem_count_where', { op: 'over', value: 80 }), /"op" must be one of/);
});

test('stem_rank: the k-th smallest or largest value', () => {
  rw(scores, 'stem_rank', { rank: 3 }, '70', '73');
  rw(scores, 'stem_rank', { rank: 2, from: 'largest' }, '91', '95');
  rw(commute, 'stem_rank', { rank: 4, from: 'smallest' }, '12', '14');
  refused(() => run(scores, 'stem_rank', { rank: 15 }), /"rank" must be a whole number from 1 to 14/);
});

test('stem_fence and stem_outliers: the 1.5 × IQR rule (strictly beyond a fence); "none" when nothing is', () => {
  rw(commute, 'stem_fence', { which: 'upper' }, '52', '58');
  rw(commute, 'stem_fence', { which: 'lower' }, '-12', '12');
  rw(commute, 'stem_outliers', {}, '58', '41');
  rw(commute, 'stem_outliers', { which: 'high' }, '58', '41, 58');
  rwText(commute, 'stem_outliers', { which: 'low' }, 'none', '5');
  rwText(scores, 'stem_outliers', {}, 'none', '95');
  rw(battery, 'stem_outliers', {}, '5.9', '4.8');
  rw(leftSkew, 'stem_outliers', {}, '41', '55');
  rw(classes, 'stem_fence', { side: 'left', which: 'upper' }, '107.25', '107');
  // A value exactly on a fence is refused: students are split on it.
  const onFence = S({ key: { stem: 1, leaf: 0 }, stems: [1, 2, 3, 4], leaves: [[0, 2, 4, 6], [0], [], [8]] }); // 10 12 14 16 20 48: Q1 12, Q3 20, IQR 8 → upper fence 32
  rw(onFence, 'stem_outliers', {}, '48', '20');
  const exact = S({ key: { stem: 1, leaf: 0 }, stems: [1, 2, 3], leaves: [[0, 2, 4, 6], [0], [2]] }); // 10 12 14 16 20 32 → fence 32
  refused(() => run(exact, 'stem_outliers', {}), /exactly on the upper fence \(32\)/);
});

test('stem_shape: symmetric / skewed right / skewed left only when mean−median and the tails agree; borderline refused', () => {
  rwText(scores, 'stem_shape', {}, 'roughly symmetric', 'skewed left');
  rwText(commute, 'stem_shape', {}, 'skewed right', 'skewed left');
  rwText(leftSkew, 'stem_shape', {}, 'skewed left', 'skewed right');
  const mcq = run(commute, 'stem_shape', {});
  assert.equal(compareDerived(item(commute, { responseFormat: 'mcq', answer: 'B', choices: ['Roughly symmetric', 'Skewed right', 'Skewed left', 'Uniform'] }), mcq).match, true);
  refused(() => run(borderline, 'stem_shape', {}), /borderline/);
  refused(() => run(S({ key: { stem: 1, leaf: 0 }, stems: [1, 2], leaves: [[1, 2, 3], [4, 5]] }), 'stem_shape', {}), /at least 10 values/);
  refused(() => run(classes, 'stem_shape', {}), /"side"/);
  rwText(classes, 'stem_shape', { side: 'Class A' }, 'symmetric', 'skewed right');
});

test('stem_compare and stem_compare_difference: which side has the larger statistic, and by how much', () => {
  rwText(classes, 'stem_compare', { stat: 'median' }, 'Class B', 'Class A');
  rwText(classes, 'stem_compare', { stat: 'median', which: 'less' }, 'Class A', 'Class B');
  rwText(classes, 'stem_compare', { stat: 'iqr' }, 'Class A', 'Class B');
  rwText(classes, 'stem_compare', { stat: 'range' }, 'Class A', 'Class B');
  rw(classes, 'stem_compare_difference', { stat: 'median' }, '9.5', '10');
  rw(classes, 'stem_compare_difference', { stat: 'iqr' }, '2.5', '2');
  const tie = S({ key: { stem: 1, leaf: 0 }, stems: [1, 2], left: { label: 'P', leaves: [[1, 2], [3]] }, right: { label: 'Q', leaves: [[0, 2], [4]] } });
  refused(() => run(tie, 'stem_compare', { stat: 'median' }), /the same median/);
  refused(() => run(scores, 'stem_compare', { stat: 'median' }), /back-to-back/);
});

test('a hidden leaf: counts the row settles are read; anything that needs the value is refused; stem_missing_leaf solves it from a stated mean', () => {
  rw(blank, 'stem_stat', { stat: 'n' }, '10', '9');
  rw(blank, 'stem_count_where', { op: 'gt', value: 40 }, '2', '3');
  // The "?" sits between leaves 3 and 6 of stem 3: it is 33 to 36 — at least 33 either way.
  rw(blank, 'stem_count_where', { op: 'ge', value: 33 }, '5', '4');
  refused(() => run(blank, 'stem_count_where', { op: 'gt', value: 35 }), /left out.*settle/);
  refused(() => run(blank, 'stem_stat', { stat: 'median' }), /left out/);
  refused(() => run(blank, 'stem_values', {}), /left out/);
  rw(blank, 'stem_missing_leaf', { mean: 32 }, '36', '6');
  refused(() => run(blank, 'stem_missing_leaf', { mean: 40 }), /would be 116.*not a value the row/);
  refused(() => run(scores, 'stem_missing_leaf', { mean: 70 }), /no leaf is left out/);
});

test('refusals from the model reach the checkers in the renderer\'s words', () => {
  refused(() => run(S({ key: { stem: 1, leaf: 0 }, stems: [1, 2], leaves: [[3, 1], [2]] }), 'stem_stat', { stat: 'n' }), /leaves\[0\] must be in increasing order/);
  refused(() => run(S({ stems: [1, 2], leaves: [[1], [2]] }), 'stem_stat', { stat: 'n' }), /key/);
});

test('examineFigureItem: a right key is derived, a wrong key is a mismatch', () => {
  const q = 'The stemplot shows the commute times of 18 workers. Which commute time is an outlier by the 1.5 × IQR rule?';
  const ok = examineFigureItem(item(commute, { problemText: q, answer: '58', alt: describeForAlt(commute, { hide: [58] }), derivation: { checker: 'stem_outliers', args: {} } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  const bad = examineFigureItem(item(commute, { problemText: q, answer: '41', alt: describeForAlt(commute), derivation: { checker: 'stem_outliers', args: {} } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const med = examineFigureItem(item(classes, { responseFormat: 'mcq', problemText: 'The back-to-back stemplot shows quiz scores for two classes. Which class has the greater median score?', answer: 'B', choices: ['Class A', 'Class B'], alt: 'A back-to-back stem-and-leaf plot of the quiz scores of two classes, with a key.', derivation: { checker: 'stem_compare', args: { stat: 'median' } } }));
  assert.deepEqual(med.defects, []);
  // An alt that names the group the key names states the answer of a "which group" item: the writer words it generically.
  const named = examineFigureItem(item(classes, { responseFormat: 'mcq', problemText: 'The back-to-back stemplot shows quiz scores for two classes. Which class has the greater median score?', answer: 'B', choices: ['Class A', 'Class B'], alt: describeForAlt(classes), derivation: { checker: 'stem_compare', args: { stat: 'median' } } }));
  assert.ok(named.defects.some((x) => /alt text states the answer/.test(x)), named.defects.join(' | '));
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), `${k} has no test`);
});

console.log(`${passed} figure-core-batch6-stemplot test(s) passed`);
