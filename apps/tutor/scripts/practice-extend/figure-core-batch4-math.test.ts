/**
 * Tests for scripts/practice-extend/figure-core-batch4-math.ts (conic_graph,
 * venn_diagram, probability_tree), reached the way the job reaches it —
 * through figure-core.ts (`describeFigure`, `describeForAlt`, `runChecker`,
 * `compareDerived`, `examineFigureItem`, `checkerCatalogue`, `axesOf`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected.
 * Per kind: the transcription says what is printed, keeps a blank blank and
 * never names what a question asks for.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch4-math.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b4-math';
import { BATCH4_CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch4-math';

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
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'numeric', problemText: 'Use the figure shown. What value does it give?', answer: '0', choices: [], hints: ['Read the figure.'],
    solutionText: 'Work it out from the figure.', difficulty: 2, covers: 'reading the figure', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A figure.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const S = (type: string, params: Args): PracticeFigureSpec => ({ type, params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;
const conic = (c: Args, extra: Args = {}): PracticeFigureSpec => S('conic_graph', { xRange: [-10, 10], yRange: [-10, 10], conics: [c], ...extra });

// ── registration ────────────────────────────────────────────────────────────

test('registration: the part speaks for its three kinds; its checkers are reached through figure-core.ts and listed in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['conic_graph', 'venn_diagram', 'probability_tree']);
  for (const name of Object.keys(PART.checkers)) assert.equal(BATCH4_CHECKERS[name], PART.checkers[name], name);
  const cat = checkerCatalogue(['conic_graph', 'venn_diagram', 'probability_tree']);
  for (const name of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${name} `), name);
  for (const f of FIXTURES) assert.deepEqual(axesOf(f.spec), {}, f.id);
  refused(() => runChecker(fx('venn-simple-two-sets'), { checker: 'conic_type', args: {} }), /is for conic_graph, not for venn_diagram/);
});

// ── conic_graph ─────────────────────────────────────────────────────────────

const CIRCLE = conic({ type: 'circle', center: [2, -1], radius: 4 });
const ELLIPSE = conic({ type: 'ellipse', center: [0, 0], rx: 5, ry: 3 });
const ELLIPSE_V = conic({ type: 'ellipse', center: [1, -2], rx: 3, ry: 4 });
const HYP = conic({ type: 'hyperbola', center: [0, 0], a: 3, b: 4, axis: 'x' });
const HYP_V = conic({ type: 'hyperbola', center: [3, 1], a: 3, b: 2, axis: 'y' });
const PAR = conic({ type: 'parabola', vertex: [1, -2], p: 3, axis: 'y' });
const PAR_L = conic({ type: 'parabola', vertex: [2, 1], p: -2, axis: 'x' });

test('conic_type, conic_center, conic_orientation', () => {
  rw(CIRCLE, 'conic_type', {}, 'circle', 'ellipse');
  rw(ELLIPSE, 'conic_type', {}, 'ellipse', 'hyperbola');
  rw(HYP, 'conic_type', {}, 'hyperbola', 'parabola');
  rw(PAR, 'conic_type', {}, 'parabola', 'circle');
  rw(CIRCLE, 'conic_center', {}, '(2, −1)', '(−2, 1)');
  rw(HYP_V, 'conic_center', {}, '(3, 1)', '(1, 3)');
  refused(() => run(PAR, 'conic_center'), /no centre/);
  rw(PAR, 'conic_orientation', {}, 'up', 'down');
  rw(PAR_L, 'conic_orientation', {}, 'left', 'right');
  rw(HYP, 'conic_orientation', {}, 'left and right', 'up and down');
  rw(ELLIPSE_V, 'conic_orientation', {}, 'vertical', 'horizontal');
  refused(() => run(CIRCLE, 'conic_orientation'), /no orientation/);
});

test('conic_point: vertices, co-vertices and foci — textbook cases, irrational foci in exact form', () => {
  // x²/25 + y²/9 = 1: vertices (±5, 0), co-vertices (0, ±3), foci (±4, 0).
  rw(ELLIPSE, 'conic_point', { feature: 'vertex', which: 1 }, '(5, 0)', '(0, 5)');
  rw(ELLIPSE, 'conic_point', { feature: 'co_vertex', which: 0 }, '(0, −3)', '(−3, 0)');
  rw(ELLIPSE, 'conic_point', { feature: 'focus', which: 0 }, '(−4, 0)', '(−5, 0)');
  // (x−1)²/9 + (y+2)²/16 = 1: vertical, c = √7, foci (1, −2 ± √7).
  rw(ELLIPSE_V, 'conic_point', { feature: 'focus', which: 1 }, '(1, −2 + √7)', '(1 + √7, −2)');
  rw(ELLIPSE_V, 'conic_point', { feature: 'vertex', which: 0 }, '(1, −6)', '(−2, −2)');
  // x²/9 − y²/16 = 1: vertices (±3, 0), foci (±5, 0).
  rw(HYP, 'conic_point', { feature: 'focus', which: 1 }, '(5, 0)', '(4, 0)');
  rw(HYP_V, 'conic_point', { feature: 'focus', which: 1 }, '(3, 1 + √13)', '(3, 4)');
  // (x−1)² = 12(y+2): vertex (1, −2), focus (1, 1).
  rw(PAR, 'conic_point', { feature: 'focus' }, '(1, 1)', '(1, −5)');
  rw(PAR_L, 'conic_point', { feature: 'focus' }, '(0, 1)', '(4, 1)');
  rw(PAR, 'conic_point', { feature: 'vertex' }, '(1, −2)', '(−2, 1)');
  refused(() => run(CIRCLE, 'conic_point', { feature: 'focus' }), /a circle has no focus/);
  refused(() => run(PAR, 'conic_point', { feature: 'co_vertex' }), /no co-vertex/);
  refused(() => run(ELLIPSE, 'conic_point', { feature: 'vertex', which: 2 }), /0 to 1/);
});

test('conic_measure: a, b, c, axis lengths, focal distance, eccentricity, radius, p, focal width', () => {
  rw(CIRCLE, 'conic_measure', { want: 'radius' }, '4', '16');
  rw(CIRCLE, 'conic_measure', { want: 'diameter' }, '8', '4');
  rw(CIRCLE, 'conic_measure', { want: 'eccentricity' }, '0', '1');
  rw(ELLIPSE, 'conic_measure', { want: 'a' }, '5', '3');
  rw(ELLIPSE, 'conic_measure', { want: 'b' }, '3', '5');
  rw(ELLIPSE, 'conic_measure', { want: 'c' }, '4', '5');
  rw(ELLIPSE, 'conic_measure', { want: 'major_axis' }, '10', '5');
  rw(ELLIPSE, 'conic_measure', { want: 'minor_axis' }, '6', '3');
  rw(ELLIPSE, 'conic_measure', { want: 'focal_distance' }, '8', '4');
  rw(ELLIPSE, 'conic_measure', { want: 'eccentricity' }, '0.8', '1.25');
  rw(ELLIPSE_V, 'conic_measure', { want: 'c' }, '2.65', '7');
  rw(HYP, 'conic_measure', { want: 'c' }, '5', '4');
  rw(HYP, 'conic_measure', { want: 'transverse_axis' }, '6', '8');
  rw(HYP, 'conic_measure', { want: 'conjugate_axis' }, '8', '6');
  rw(HYP, 'conic_measure', { want: 'eccentricity' }, '5/3', '3/5');
  rw(PAR, 'conic_measure', { want: 'p' }, '3', '12');
  rw(PAR_L, 'conic_measure', { want: 'p' }, '−2', '2');
  rw(PAR, 'conic_measure', { want: 'focal_width' }, '12', '3');
  rw(PAR, 'conic_measure', { want: 'eccentricity' }, '1', '0');
  refused(() => run(PAR, 'conic_measure', { want: 'a' }), /not a measure of a parabola/);
  refused(() => run(HYP, 'conic_measure', { want: 'major_axis' }), /not a measure of a hyperbola/);
  refused(() => run(HYP, 'conic_measure', { want: 'width' }), /must be one of/);
});

test('conic_asymptote, conic_line, conic_equation', () => {
  rw(HYP, 'conic_asymptote', { which: 'positive' }, '4/3', '3/4');
  rw(HYP, 'conic_asymptote', { which: 'negative' }, '−4/3', '4/3');
  rw(HYP, 'conic_asymptote', { which: 'positive', want: 'equation' }, 'y = (4/3)x', 'y = (3/4)x');
  // (y−1)²/9 − (x−3)²/4 = 1: slopes ±3/2 through (3, 1).
  rw(HYP_V, 'conic_asymptote', { which: 'positive', want: 'equation' }, 'y = (3/2)x − 7/2', 'y = (2/3)x − 1');
  rw(HYP_V, 'conic_asymptote', { which: 'negative', want: 'equation' }, 'y = −(3/2)x + 11/2', 'y = (3/2)x + 11/2');
  refused(() => run(ELLIPSE, 'conic_asymptote', { which: 'positive' }), /an ellipse has no asymptotes/);
  rw(PAR, 'conic_line', { want: 'directrix' }, 'y = −5', 'y = 1');
  rw(PAR_L, 'conic_line', { want: 'directrix' }, 'x = 4', 'x = 0');
  rw(PAR, 'conic_line', { want: 'axis' }, 'x = 1', 'y = −2');
  rw(ELLIPSE_V, 'conic_line', { want: 'axis' }, 'x = 1', 'y = −2');
  refused(() => run(ELLIPSE, 'conic_line', { want: 'directrix' }), /no directrix/);
  refused(() => run(CIRCLE, 'conic_line', { want: 'axis' }), /no single axis/);
  rw(CIRCLE, 'conic_equation', {}, '(x − 2)² + (y + 1)² = 16', '(x + 2)² + (y − 1)² = 16');
  rw(conic({ type: 'circle', center: [0, 0], radius: 5 }), 'conic_equation', {}, 'x² + y² = 25', 'x² + y² = 5');
  rw(ELLIPSE, 'conic_equation', {}, 'x²/25 + y²/9 = 1', 'x²/9 + y²/25 = 1');
  rw(ELLIPSE_V, 'conic_equation', {}, '(x − 1)²/9 + (y + 2)²/16 = 1', '(x − 1)²/16 + (y + 2)²/9 = 1');
  rw(HYP, 'conic_equation', {}, 'x²/9 − y²/16 = 1', 'y²/9 − x²/16 = 1');
  rw(HYP_V, 'conic_equation', {}, '(y − 1)²/9 − (x − 3)²/4 = 1', '(x − 3)²/4 − (y − 1)²/9 = 1');
  rw(PAR, 'conic_equation', {}, '(x − 1)² = 12(y + 2)', '(x − 1)² = 3(y + 2)');
  rw(PAR_L, 'conic_equation', {}, '(y − 1)² = −8(x − 2)', '(y − 1)² = 8(x − 2)');
  rw(conic({ type: 'parabola', vertex: [0, 0], p: 0.25, axis: 'y' }), 'conic_equation', {}, 'x² = y', 'x² = 4y');
});

test('conic_line_intersections and conic_conic_intersections: secant, tangent, miss; two conics', () => {
  const sys = fx('conic-circle-dense-line-system');
  rw(sys, 'conic_line_intersections', {}, '2', '1');
  rw(sys, 'conic_line_intersections', { want: 'point', which: 0 }, '(−4, −3)', '(3, 4)');
  rw(sys, 'conic_line_intersections', { want: 'point', which: 1 }, '(3, 4)', '(4, 3)');
  const c5 = { type: 'circle', center: [0, 0], radius: 5 };
  rw(conic(c5, { lines: [{ slope: 0, intercept: 5 }] }), 'conic_line_intersections', {}, '1', '2');
  rw(conic(c5, { lines: [{ x: 7 }] }), 'conic_line_intersections', {}, '0', '1');
  // y = x² and y = x + 2 meet at (−1, 1) and (2, 4).
  const par = conic({ type: 'parabola', vertex: [0, 0], p: 0.25, axis: 'y' }, { lines: [{ slope: 1, intercept: 2 }] });
  rw(par, 'conic_line_intersections', { want: 'point', which: 1 }, '(2, 4)', '(4, 2)');
  // A line parallel to an asymptote meets the hyperbola once.
  rw(conic({ type: 'hyperbola', center: [0, 0], a: 3, b: 4, axis: 'x' }, { lines: [{ slope: 4 / 3, intercept: 2 }] }), 'conic_line_intersections', {}, '1', '2');
  refused(() => run(conic(c5, { lines: [{ slope: 1, intercept: 2 }] }), 'conic_line_intersections', { want: 'point' }), /not a point that can be read exactly/);
  refused(() => run(CIRCLE, 'conic_line_intersections'), /no line/);
  rw(fx('conic-system-two-conics'), 'conic_conic_intersections', {}, '4', '2');
  // y = x² − 5 touches x² + y² = 25 at (0, −5) and crosses it twice: a drawing cannot settle the count.
  refused(() => run(S('conic_graph', { xRange: [-6, 6], yRange: [-6, 6], conics: [c5, { type: 'parabola', vertex: [0, -5], p: 0.25, axis: 'y' }] }), 'conic_conic_intersections'), /touch or nearly touch near/);
  const two = (second: Args): PracticeFigureSpec => S('conic_graph', { xRange: [-10, 10], yRange: [-10, 10], conics: [c5, second] });
  rw(two({ type: 'ellipse', center: [0, 0], rx: 7, ry: 3 }), 'conic_conic_intersections', {}, '4', '2');
  rw(two({ type: 'circle', center: [0, 0], radius: 2 }), 'conic_conic_intersections', {}, '0', '2');
  rw(two({ type: 'hyperbola', center: [0, 0], a: 3, b: 3, axis: 'x' }), 'conic_conic_intersections', {}, '4', '2');
  refused(() => run(two({ type: 'circle', center: [7, 0], radius: 2 }), 'conic_conic_intersections'), /touch or nearly touch/);
  refused(() => run(CIRCLE, 'conic_conic_intersections'), /two conics/);
});

test('conic transcription: what is seen, never the name of the curve or its equation; a "?" stays a blank', () => {
  for (const f of FIXTURES.filter((x) => x.spec.type === 'conic_graph')) {
    const t = textOf(f.spec);
    const labels = (f.spec.params.conics as Args[]).map((c) => String(c.label ?? ''));
    for (const word of ['circle', 'ellipse', 'hyperbola', 'parabola', 'focus', 'foci', 'vertex', 'vertices', 'directrix', 'asymptote', 'radius']) {
      if (labels.includes(word)) continue;
      assert.ok(!new RegExp(`\\b${word}`, 'i').test(t), `${f.id}: the transcription says "${word}"`);
    }
    assert.ok(!/²/.test(t), `${f.id}: an equation of the curve`);
  }
  const t = textOf(fx('conic-ellipse-blank-foci'));
  assert.ok(/a marked point "F₁" \(on the longer axis, inside the curve\); its coordinates are a blank "\?" box/.test(t), t);
  assert.ok(!/\(−4, 0\)|\(4, 0\)/.test(t), 'the hidden foci are not given away');
  assert.ok(/"V₂" \(an end of the longer axis\), labelled with its coordinates \(5, 0\)/.test(t));
  const h = textOf(fx('conic-hyperbola-blank-asymptote'));
  assert.ok(/a dashed line \(the branches approach it\), through \(0, 0\), rising 0\.75 for every 1 across, labelled with a blank "\?" box/.test(h), h);
  assert.ok(!/y = /.test(h));
  const p = textOf(fx('conic-parabola-blank-focus'));
  assert.ok(/labelled "y = −5"/.test(p) && /"F" \(on the axis of symmetry, inside the curve\); its coordinates are a blank/.test(p), p);
  assert.ok(!/\(1, 1\)/.test(p));
  assert.equal(describeFigure(fx('conic-circle-simple')).printed.length, 0);
});

// ── venn_diagram ────────────────────────────────────────────────────────────

const V2 = fx('venn-simple-two-sets');
const V3 = fx('venn-dense-three-sets-shaded');
const VP = fx('venn-blank-probability');

test('venn_region and venn_count: one region, a set, only, union, intersection, neither, total, exactly one, complement', () => {
  rw(V2, 'venn_region', { in: ['Soccer'] }, '12', '17');
  rw(V2, 'venn_region', { in: ['Soccer', 'Tennis'] }, '5', '12');
  rw(V2, 'venn_region', { in: [] }, '7', '5');
  rw(V2, 'venn_count', { want: 'set', sets: ['Soccer'] }, '17', '12');
  rw(V2, 'venn_count', { want: 'only', sets: ['Tennis'] }, '8', '13');
  rw(V2, 'venn_count', { want: 'union', sets: ['Soccer', 'Tennis'] }, '25', '30');
  rw(V2, 'venn_count', { want: 'intersection', sets: ['Soccer', 'Tennis'] }, '5', '25');
  rw(V2, 'venn_count', { want: 'neither' }, '7', '25');
  rw(V2, 'venn_count', { want: 'total' }, '32', '25');
  rw(V2, 'venn_count', { want: 'exactly_one' }, '20', '25');
  rw(V2, 'venn_count', { want: 'complement', sets: ['Soccer'] }, '15', '17');
  // Three sets: French 14+6+4+3 = 27; French ∩ Spanish 6+3 = 9; French ∪ German 14+6+4+3+5+9 = 41.
  rw(V3, 'venn_count', { want: 'set', sets: ['French'] }, '27', '14');
  rw(V3, 'venn_count', { want: 'intersection', sets: ['French', 'Spanish'] }, '9', '6');
  rw(V3, 'venn_count', { want: 'only', sets: ['French', 'Spanish'] }, '6', '9');
  rw(V3, 'venn_count', { want: 'union', sets: ['French', 'German'] }, '41', '52');
  rw(V3, 'venn_count', { want: 'intersection', sets: ['French', 'Spanish', 'German'] }, '3', '18');
  rw(V3, 'venn_count', { want: 'exactly_one' }, '34', '52');
  rw(V3, 'venn_count', { want: 'total' }, '60', '52');
  rw(V3, 'venn_count', { want: 'neither', sets: ['French', 'Spanish'] }, '17', '8');
  refused(() => run(V2, 'venn_count', { want: 'union', sets: ['Soccer'] }), /needs two or more sets/);
  refused(() => run(V2, 'venn_count', { want: 'set', sets: ['Golf'] }), /not one of the sets/);
  // The "?" is what venn_region is for; a sum over it is refused.
  rw(VP, 'venn_region', { in: ['A', 'B'] }, '0.2', '0.5');
  refused(() => run(VP, 'venn_count', { want: 'set', sets: ['A'] }), /is not printed \(it is a "\?"\)/);
  const twoHidden = S('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 3, show: 'blank' }, { in: ['A', 'B'], value: 2, show: 'blank' }, { in: ['B'], value: 4 }] });
  refused(() => run(twoHidden, 'venn_region', { in: ['A'] }), /another region is hidden as well/);
  refused(() => run(twoHidden, 'venn_count', { want: 'total' }), /outside every circle has no value/);
});

test('venn_probability: P(A), P(A or B), P(A | B) from counts and from probabilities', () => {
  rw(V2, 'venn_probability', { want: 'set', sets: ['Soccer'] }, '17/32', '12/32');
  rw(V2, 'venn_probability', { want: 'union', sets: ['Soccer', 'Tennis'] }, '25/32', '5/32');
  rw(V2, 'venn_probability', { want: 'set', sets: ['Soccer'], givenWant: 'set', givenSets: ['Tennis'] }, '5/13', '5/17');
  rw(V2, 'venn_probability', { want: 'neither' }, '7/32', '7/25');
  rw(V3, 'venn_probability', { want: 'set', sets: ['German'], givenWant: 'set', givenSets: ['French'] }, '7/27', '7/21');
  rw(V3, 'venn_probability', { want: 'total' }, '1', '60');
  const full = S('venn_diagram', { sets: ['A', 'B'], values: 'probability', regions: [{ in: ['A'], value: 0.3 }, { in: ['A', 'B'], value: 0.2 }, { in: ['B'], value: 0.35 }, { in: [], value: 0.15 }] });
  rw(full, 'venn_probability', { want: 'set', sets: ['A'] }, '0.5', '0.3');
  rw(full, 'venn_probability', { want: 'union', sets: ['A', 'B'] }, '0.85', '1.05');
  rw(full, 'venn_probability', { want: 'set', sets: ['A'], givenWant: 'set', givenSets: ['B'] }, '4/11', '0.2');
  rw(full, 'venn_probability', { want: 'complement', sets: ['B'] }, '0.45', '0.55');
  refused(() => run(VP, 'venn_probability', { want: 'set', sets: ['A'], givenWant: 'set', givenSets: ['B'] }), /is not printed/);
});

test('venn transcription: every region by where it is; a "?" is a blank and its number is never said', () => {
  const t = textOf(V3);
  assert.ok(/the region inside "French" and "Spanish" but outside "German": 6 \(this region is hatched\)/.test(t), t);
  assert.ok(/the region outside every circle: 8/.test(t) && /"60 students" is printed in a corner/.test(t));
  const b = describeFigure(VP);
  assert.ok(/the region inside "A" and "B": a blank "\?" box/.test(b.text), b.text);
  assert.ok(!/0\.2\b/.test(b.text), 'the hidden value is not in the transcription');
  assert.ok(b.printed.includes('region value: (blank — a "?" box)') && b.printed.includes('set name: "A"'));
  assert.ok(/the region outside every circle: 0\.15 \(this region is hatched\)/.test(b.text));
});

// ── probability_tree ────────────────────────────────────────────────────────

const T2 = fx('tree-simple-two-stage');
const T3 = fx('tree-dense-three-stage');
const TB = fx('tree-blank-without-replacement');

test('tree_path, tree_outcome, tree_conditional (Bayes), tree_branch', () => {
  rw(T2, 'tree_path', { path: ['Bag 1', 'Red'] }, '0.28', '1.1');
  rw(T2, 'tree_path', { path: ['Bag 2'] }, '0.6', '0.4');
  // P(Red) = 0.4·0.7 + 0.6·0.2 = 0.40; P(Bag 1 | Red) = 0.28 / 0.40 = 0.7.
  rw(T2, 'tree_outcome', { label: 'Red' }, '0.4', '0.9');
  rw(T2, 'tree_outcome', { label: 'Blue' }, '0.6', '1.1');
  rw(T2, 'tree_conditional', { label: 'Bag 1', stage: 1, givenLabel: 'Red' }, '0.7', '0.28');
  rw(T2, 'tree_conditional', { label: 'Red', givenLabel: 'Bag 2', givenStage: 1 }, '0.2', '0.12');
  rw(T2, 'tree_branch', { path: ['Bag 2', 'Blue'] }, '0.8', '0.48');
  // Three tosses of a 2/3 coin: P(HHT) = 4/27; P(third toss H) = 2/3; P(first H | third H) = 2/3.
  rw(T3, 'tree_path', { path: ['H', 'H', 'T'] }, '4/27', '8/27');
  rw(T3, 'tree_outcome', { label: 'H' }, '2/3', '1/3');
  rw(T3, 'tree_outcome', { label: 'T', stage: 2 }, '1/3', '2/3');
  rw(T3, 'tree_conditional', { label: 'H', stage: 1, givenLabel: 'H', givenStage: 3 }, '2/3', '4/9');
  // Without replacement, 3 red and 5 green: the hidden branches are 2/7 and 4/7; P(second R) = 3/8.
  rw(TB, 'tree_branch', { path: ['R', 'R'] }, '2/7', '3/7');
  rw(TB, 'tree_branch', { path: ['G', 'G'] }, '4/7', '5/7');
  rw(TB, 'tree_path', { path: ['R', 'R'] }, '3/28', '6/56 + 1');
  rw(TB, 'tree_outcome', { label: 'R' }, '3/8', '5/8');
  rw(TB, 'tree_conditional', { label: 'R', stage: 1, givenLabel: 'R', givenStage: 2 }, '2/7', '3/8');
  refused(() => run(T2, 'tree_path', { path: ['Bag 3'] }), /no branch "Bag 3"/);
  refused(() => run(T2, 'tree_outcome', { label: 'Green' }), /no branch of stage 2 is labelled "Green"/);
  refused(() => run(T2, 'tree_outcome', { label: 'Red', stage: 3 }), /stage number, 1 to 2/);
  const hidden = S('probability_tree', { branches: [{ label: 'A', p: 0.5, show: 'blank' }, { label: 'B', p: 0.3, show: 'none' }, { label: 'C', p: 0.2 }] });
  refused(() => run(hidden, 'tree_path', { path: ['A'] }), /is not printed and cannot be had from its neighbours/);
  refused(() => run(hidden, 'tree_branch', { path: ['A'] }), /hidden and so is one of its neighbours/);
  rw(hidden, 'tree_branch', { path: ['C'] }, '0.2', '0.5');
  // A hidden branch with a hidden neighbour is still settled by a printed end-of-path value.
  const viaProduct = S('probability_tree', { branches: [{ label: 'A', p: 0.5, children: [{ label: 'X', p: 0.2, show: 'blank', product: 'value' }, { label: 'Y', p: 0.3, show: 'blank' }, { label: 'Z', p: 0.5 }] }, { label: 'B', p: 0.5 }] });
  rw(viaProduct, 'tree_branch', { path: ['A', 'X'] }, '0.2', '0.1');
  refused(() => run(viaProduct, 'tree_branch', { path: ['A', 'Y'] }), /does not settle it/);
});

test('tree transcription: every branch with what is on it; a "?" branch and a "?" path value stay blank', () => {
  const t = describeFigure(TB);
  assert.ok(/from "R": a branch to "R", with a blank "\?" box on it; outcome "RR" printed beside it; a blank "\?" box at the end of the path/.test(t.text), t.text);
  assert.ok(/from the start: a branch to "G", with 5\/8 on it/.test(t.text));
  assert.ok(!/2\/7|4\/7|3\/28/.test(t.text), 'the hidden probabilities are not in the transcription');
  assert.ok(t.printed.includes('stage title: "1st draw"') && t.printed.includes('branch probability: "5/7"') && t.printed.includes('path value: (blank — a "?" box)'));
  assert.ok(/"8\/27" printed at the end of the path/.test(textOf(T3)));
});

// ── across the part ─────────────────────────────────────────────────────────

test('describeForAlt on every fixture: only text the figure prints, no number of its own, blanks counted not named', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && /^[A-Z]/.test(alt) && /\.$/.test(alt), `${f.id}: ${alt}`);
    assert.ok(!/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: a digit outside a quoted label — ${alt}`);
    if (/blank/.test(f.id)) assert.ok(/left blank, shown as a boxed question mark/.test(alt), `${f.id}: ${alt}`);
  }
  assert.ok(!/0\.2"/.test(describeForAlt(VP)));
  assert.ok(/^A Venn diagram\./.test(describeForAlt(V2)));
  assert.ok(/^A probability tree diagram\./.test(describeForAlt(T2)));
  assert.ok(/^A curve on a coordinate grid/.test(describeForAlt(fx('conic-ellipse-simple'))));
  assert.ok(!/"\(−4, 0\)"|F₁ \(/.test(describeForAlt(fx('conic-ellipse-blank-foci'))));
});

test('examineFigureItem: a right key passes, a wrong key is a defect, for one item of each kind', () => {
  const ok = examineFigureItem(item(ELLIPSE, { problemText: 'The figure shows a curve on a grid. What is the distance between its foci?', answer: '8', alt: 'A closed curve on a coordinate grid.', derivation: { checker: 'conic_measure', args: { want: 'focal_distance' } } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  const bad = examineFigureItem(item(ELLIPSE, { problemText: 'The figure shows a curve on a grid. What is the distance between its foci?', answer: '4', alt: 'A closed curve on a coordinate grid.', derivation: { checker: 'conic_measure', args: { want: 'focal_distance' } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const venn = examineFigureItem(item(V2, { problemText: 'Use the Venn diagram shown. How many students play at least one of the two sports?', answer: '25', alt: describeForAlt(V2, { hide: [] }).replace(/Printed on it:.*$/, ''), derivation: { checker: 'venn_count', args: { want: 'union', sets: ['Soccer', 'Tennis'] } } }));
  assert.equal(venn.derivation.status, 'derived', JSON.stringify(venn));
  const mcq = item(T2, { responseFormat: 'mcq', problemText: 'Use the tree diagram shown. What is the probability of drawing a red ball?', choices: ['0.28', '0.40', '0.90', '0.12'], answer: 'B', alt: 'A probability tree diagram.', derivation: { checker: 'tree_outcome', args: { label: 'Red' } } });
  assert.equal(examineFigureItem(mcq).derivation.status, 'derived');
  assert.equal(examineFigureItem({ ...mcq, answer: 'A' }).derivation.status, 'mismatch');
});

// ── round 5 (a): a conic's marks under other names ──────────────────────────

test('round 5 a. conic_graph: a mark is transcribed by the name that is PRINTED (names, letterLabels); option letters no longer clash', () => {
  const four = ['one', 'two', 'three', 'four'];
  const plain = conic({ type: 'circle', center: [2, -1], radius: 4, show: { center: 'mark' } });
  assert.ok(textOf(plain).includes('a marked point "C" (the centre)'));
  assert.deepEqual(figureLetterClash(plain, four)?.letters, ['C']);
  const named = conic({ type: 'circle', center: [2, -1], radius: 4, show: { center: 'value' }, names: { center: 'O' } });
  assert.ok(textOf(named).includes('point label: "O (2, −1)"') && !/"C/.test(textOf(named)), textOf(named));
  assert.equal(figureLetterClash(named, four), null);
  assert.ok(describeForAlt(named).includes('"O (2, −1)"'));
  const par = conic({ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { vertex: 'mark', focus: 'mark' } }, { letterLabels: 'numerals', points: [{ x: 4, y: 2, label: 'A' }] });
  const t = textOf(par);
  assert.ok(t.includes('a marked point "1" (where the curve turns)') && t.includes('a marked point "2" (on the axis of symmetry, inside the curve)') && t.includes('point label: "3"') && !/"[VFA]"/.test(t), t);
  assert.equal(figureLetterClash(par, ['a', 'b', 'c', 'd', 'e', 'f']), null);
  assert.deepEqual(figureLetterClash(conic({ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { focus: 'mark' } }), ['a', 'b', 'c', 'd', 'e', 'f'])?.letters, ['F']);
  const ell = conic({ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { center: 'mark', foci: 'blank' }, names: { foci: ['P', 'Q'] } }, { letterLabels: 'roman' });
  const te = textOf(ell);
  assert.ok(te.includes('a marked point "I" (the centre)') && te.includes('point label: "II" (blank') && te.includes('point label: "III" (blank') && !te.includes('(4, 0)'), te);
  // The checkers read the same conic whatever its marks are called.
  rw(named, 'conic_measure', { want: 'radius' }, '4', '16');
  rw(named, 'conic_center', {}, '(2, −1)', '(−2, 1)');
  rw(ell, 'conic_measure', { want: 'focal_distance' }, '8', '10');
  rw(ell, 'conic_point', { feature: 'focus', which: 1 }, '(4, 0)', '(5, 0)');
});

test('every checker of the part was exercised', () => {
  for (const name of Object.keys(PART.checkers)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch4-math test(s) passed`);
