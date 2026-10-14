/**
 * Tests for scripts/practice-extend/figure-core-batch6-polygon.ts
 * (coordinate_polygon), reached the way the job reaches it — through
 * figure-core.ts.
 *
 * Per checker: right keys accepted, wrong keys rejected; textbook cases
 * (reflection of (2, 3) across y = x → (3, 2); a quarter turn (x, y) → (−y, x);
 * a dilation by 1/2); refusals of what the figure cannot settle. The
 * transcription says what is printed; the alt names the vertex labels and
 * can hold values back.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch6-polygon.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { applySequence, applyTransform, parseTransform, transformName } from '../../src/lib/tutor/practice-figure/kinds/coordinate-polygon';
import { FIXTURES } from '../lib/practice-figure-fixtures-b6-polygon';
import { BATCH6_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { figureLetterClash } from './figure-core-batch3';
import { PART } from './figure-core-batch6-polygon';

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
    objectiveLoId: 'geom.translations', responseFormat: 'numeric', problemText: 'Use the figure shown. What value does it give?', answer: '0', choices: [], hints: ['Read the grid.'],
    solutionText: 'Work it out from the grid.', difficulty: 2, covers: 'transformations', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A coordinate grid.', derivation: { checker: 'none', args: {} }, ...over,
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
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const G = (polygons: unknown[], more: Args = {}): PracticeFigureSpec => ({ type: 'coordinate_polygon', params: { xRange: [-8, 8], yRange: [-8, 8], polygons, ...more } });
const one = (vertices: number[][], labels?: string[]): PracticeFigureSpec => G([{ vertices, ...(labels ? { labels } : {}) }]);
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

const trans = fx('poly-simple-translation');
const refl = fx('poly-reflection-y-equals-x');
const rot = fx('poly-rotation-90-origin');
const dil = fx('poly-dilation-half-shaded');
const dense = fx('poly-dense-three-figures');
const oct = fx('poly-symmetry-octagon');
const seg = fx('poly-segment-coordinates');

test('registration: the part speaks for coordinate_polygon; its checkers are in BATCH6_CHECKERS and the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['coordinate_polygon']);
  assert.ok(Object.keys(PART.checkers).length >= 13);
  for (const k of Object.keys(PART.checkers)) {
    assert.ok(k.startsWith('poly_'), k);
    assert.equal(BATCH6_CHECKERS[k], PART.checkers[k], k);
  }
  const cat = checkerCatalogue(['coordinate_polygon']);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
});

test('applyTransform / applySequence: the textbook rules', () => {
  const at = (t: unknown, p: [number, number]): [number, number] => applyTransform(parseTransform(t, 't'), p);
  assert.deepEqual(at({ reflect: 'y = x' }, [2, 3]), [3, 2]);
  assert.deepEqual(at({ reflect: 'y=-x' }, [2, 3]), [-3, -2]);
  assert.deepEqual(at({ reflect: 'x-axis' }, [2, 3]), [2, -3]);
  assert.deepEqual(at({ reflect: 'y-axis' }, [2, 3]), [-2, 3]);
  assert.deepEqual(at({ reflect: 'x = 1' }, [3, 5]), [-1, 5]);
  assert.deepEqual(at({ reflect: 'y = −2' }, [3, 5]), [3, -9]);
  assert.deepEqual(at({ reflect: 'y = x + 1' }, [3, 0]), [-1, 4]);
  assert.deepEqual(at({ rotate: 90 }, [2, 3]), [-3, 2]);
  assert.deepEqual(at({ rotate: 90, direction: 'cw' }, [2, 3]), [3, -2]);
  assert.deepEqual(at({ rotate: -90 }, [2, 3]), [3, -2]);
  assert.deepEqual(at({ rotate: 180 }, [2, 3]), [-2, -3]);
  assert.deepEqual(at({ rotate: 270 }, [2, 3]), [3, -2]);
  assert.deepEqual(at({ rotate: 90, about: [1, 1] }, [3, 1]), [1, 3]);
  assert.deepEqual(at({ dilate: 0.5 }, [4, -2]), [2, -1]);
  assert.deepEqual(at({ dilate: 2, about: [2, 2] }, [3, 3]), [4, 4]);
  assert.deepEqual(at({ translate: [3, -2] }, [1, 1]), [4, -1]);
  assert.deepEqual(applySequence([parseTransform({ reflect: 'y-axis' }, 'a'), parseTransform({ translate: [0, -3] }, 'b')], [2, 5]), [-2, 2]);
  assert.throws(() => parseTransform({ rotate: 45 }, 'steps[0]'), /steps\[0\].*multiple of 90/);
  assert.throws(() => parseTransform({ dilate: 0 }, 't'), /not 0/);
  assert.throws(() => parseTransform({ reflect: 'y = 2x' }, 't'), /x-axis/);
  assert.equal(transformName(parseTransform({ rotate: 90 }, 't'), 'name'), 'rotation 90° counterclockwise about (0, 0)');
  assert.equal(transformName(parseTransform({ rotate: 270 }, 't'), 'name'), 'rotation 90° clockwise about (0, 0)');
  assert.equal(transformName(parseTransform({ rotate: 90 }, 't'), 'rule'), '(x, y) → (−y, x)');
  assert.equal(transformName(parseTransform({ reflect: 'y = 1' }, 't'), 'rule'), '(x, y) → (x, 2 − y)');
  assert.equal(transformName(parseTransform({ translate: [3, -2] }, 't'), 'rule'), '(x, y) → (x + 3, y − 2)');
  assert.equal(transformName(parseTransform({ dilate: 0.5 }, 't'), 'name'), 'dilation by scale factor 1/2 about (0, 0)');
});

test('transcription: axes, captions, styles, vertex labels with readable coordinates, lines, points, arrows', () => {
  const t = textOf(trans);
  assert.ok(t.startsWith('The figure is a coordinate grid with two triangles'), t.split('\n')[0]);
  for (const l of ['- caption: "pre-image"', '- caption: "image"', '- vertex label: "P"', '- vertex label: "Q′"']) assert.ok(t.includes(l), l);
  assert.ok(t.includes('x from −6 to 6') && t.includes('every 1 unit'), t);
  assert.ok(t.includes('P (−5, 1)') && t.includes('Q′ (4, −3)'), t);
  assert.ok(/dashed/.test(t) && /arrow from \(−5, 1\) to \(1, −3\)/.test(t), t);
  const r = textOf(refl);
  assert.ok(r.includes('- line label: "y = x"') && /line through \(0, 0\) and \(1, 1\)/.test(r), r);
  assert.ok(textOf(dil).includes('- point label: "M"') && textOf(dil).includes('M at (−4, 4)') && /shaded/.test(textOf(dil)));
  assert.ok(textOf(seg).includes('- vertex coordinates: "(−3, −2)"'), textOf(seg));
  assert.ok(textOf(oct).startsWith('The figure is a coordinate grid with one octagon'));
});

test('describeForAlt: names what is drawn and the vertex labels, stays short, and can keep values back', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length > 20 && alt.length <= 350, `${f.id}: ${alt.length} ${alt}`);
    assert.ok(/^A coordinate grid with /.test(alt), alt);
  }
  const alt = describeForAlt(dense);
  assert.ok(alt.includes('"P″"') && alt.includes('"Figure 3"') && alt.includes('"ℓ"'), alt);
  const s = describeForAlt(seg);
  assert.ok(s.includes('(−3, −2)'), s);
  const hidden = describeForAlt(seg, { hide: ['(2, −3)'] });
  assert.ok(!hidden.includes('(2, −3)'), hidden);
});

test('poly_vertex: a labelled vertex or vertex i of polygon j; off-grid refused; unknown label refused', () => {
  rwText(trans, 'poly_vertex', { vertex: 'Q′' }, '(4, −3)', '(−3, 4)');
  rwText(trans, 'poly_vertex', { vertex: "Q'" }, '(4,-3)', '(4, 3)');
  rwText(trans, 'poly_vertex', { polygon: 1, index: 2 }, '(2, 0)', '(0, 2)');
  rw(trans, 'poly_vertex', { vertex: 'R', coordinate: 'y' }, '4', '-4');
  rwText(dil, 'poly_vertex', { vertex: 'M' }, '(−4, 4)', '(4, −4)');
  rwText(dense, 'poly_vertex', { polygon: 'Figure 3', index: 0 }, '(−5, −1)', '(5, 1)');
  refused(() => run(trans, 'poly_vertex', { vertex: 'Z' }), /no vertex or point is labelled "Z"/);
  refused(() => run(one([[0, 0], [2.5, 0], [0, 3]], ['P', 'Q', 'R']), 'poly_vertex', { vertex: 'Q' }), /between gridlines/);
  rwText(G([{ vertices: [[0, 0], [2.5, 0], [0, 3]], labels: ['P', 'Q', 'R'] }], { showVertexCoordinates: true }), 'poly_vertex', { vertex: 'Q' }, '(2.5, 0)', '(2, 0)');
});

test('poly_side_length, poly_perimeter, poly_area: exact, radical or rounded on request; refused otherwise', () => {
  const tri = one([[0, 0], [4, 0], [0, 3]], ['P', 'Q', 'R']);
  rw(tri, 'poly_side_length', { from: 'Q', to: 'R' }, '5', '7');
  rw(tri, 'poly_side_length', { polygon: 0, side: 0 }, '4', '3');
  rw(tri, 'poly_perimeter', { polygon: 0 }, '12', '14');
  rw(tri, 'poly_area', { polygon: 0 }, '6', '12');
  rw(trans, 'poly_area', { polygon: 'image' }, '4.5', '9');
  rw(oct, 'poly_area', {}, '28', '36');
  refused(() => run(trans, 'poly_side_length', { from: 'Q', to: 'R' }), /√13.*allow/);
  rwText(trans, 'poly_side_length', { from: 'Q', to: 'R', allow: 'radical' }, '√13', '13');
  rwText(one([[0, 0], [2, 4], [0, 4]]), 'poly_side_length', { polygon: 0, side: 0, allow: 'radical' }, '2√5', '√20');
  rw(trans, 'poly_side_length', { from: 'Q', to: 'R', allow: 'approx' }, '3.61', '3.5');
  refused(() => run(trans, 'poly_perimeter', { polygon: 0 }), /not a whole number/);
  rw(trans, 'poly_perimeter', { polygon: 0, allow: 'approx' }, '9.77', '9.7');
  refused(() => run(seg, 'poly_area', { polygon: 0 }), /a segment has no area/);
  refused(() => run(trans, 'poly_side_length', { from: 'P', to: 'Q′' }), /not on one polygon/);
});

test('poly_image_vertex: the image of a labelled vertex under a STATED transformation or sequence', () => {
  const j = one([[2, 3], [5, 3], [2, 6]], ['P', 'Q', 'R']);
  rwText(j, 'poly_image_vertex', { vertex: 'P', transform: { reflect: 'y = x' } }, '(3, 2)', '(2, 3)');
  rwText(j, 'poly_image_vertex', { vertex: 'P', transform: { rotate: 90 } }, '(−3, 2)', '(3, −2)');
  rwText(j, 'poly_image_vertex', { vertex: 'P', transform: { rotate: 90, direction: 'cw' } }, '(3, −2)', '(−3, 2)');
  rwText(j, 'poly_image_vertex', { vertex: 'P', transform: { rotate: 180 } }, '(−2, −3)', '(2, −3)');
  rwText(j, 'poly_image_vertex', { vertex: 'Q', transform: { rotate: 90, about: [1, 1] } }, '(−1, 5)', '(5, −1)');
  rwText(j, 'poly_image_vertex', { vertex: 'R', transform: { dilate: 0.5 } }, '(1, 3)', '(4, 12)');
  rw(j, 'poly_image_vertex', { vertex: 'Q', transform: { reflect: 'y = 1' }, coordinate: 'y' }, '-1', '1');
  rwText(j, 'poly_image_vertex', { vertex: 'P', steps: [{ reflect: 'y-axis' }, { translate: [0, -3] }] }, '(−2, 0)', '(2, 0)');
  rw(j, 'poly_image_vertex', { vertex: 'Q', transform: { translate: [-4, 2] }, coordinate: 'x' }, '1', '9');
  refused(() => run(j, 'poly_image_vertex', { vertex: 'P' }), /"transform".*or "steps"/);
  refused(() => run(j, 'poly_image_vertex', { vertex: 'P', transform: { rotate: 30 } }), /multiple of 90/);
});

test('poly_identify: the single transformation, by name, rule or type; refused when none or several fit', () => {
  rwText(trans, 'poly_identify', { from: 0, to: 1 }, 'translation by (6, −4)', 'translation by (−6, 4)');
  rwText(trans, 'poly_identify', { from: 'pre-image', to: 'image', form: 'rule' }, '(x, y) → (x + 6, y − 4)', '(x, y) → (x − 6, y + 4)');
  rwText(refl, 'poly_identify', { from: 0, to: 1 }, 'reflection across the line y = x', 'reflection across the line y = −x');
  rwText(refl, 'poly_identify', { from: 0, to: 1, form: 'type' }, 'reflection', 'rotation');
  rwText(rot, 'poly_identify', { from: 0, to: 1 }, 'rotation 90° counterclockwise about (0, 0)', 'rotation 90° clockwise about (0, 0)');
  rwText(rot, 'poly_identify', { from: 0, to: 1, form: 'rule' }, '(x, y) → (−y, x)', '(x, y) → (y, −x)');
  rwText(rot, 'poly_identify', { from: 1, to: 0 }, 'rotation 90° clockwise about (0, 0)', 'rotation 90° counterclockwise about (0, 0)');
  rwText(dil, 'poly_identify', { from: 0, to: 1 }, 'dilation by scale factor 1/2 about (−4, 4)', 'dilation by scale factor 2 about (−4, 4)');
  rwText(dense, 'poly_identify', { from: 'Figure 1', to: 'Figure 2' }, 'reflection across the line x = −1', 'reflection across the y-axis');
  rwText(dense, 'poly_identify', { from: 'Figure 2', to: 'Figure 3' }, 'rotation 180° about (0, 0)', 'reflection across the x-axis');
  rwText(seg, 'poly_identify', { from: 0, to: 1 }, 'rotation 90° counterclockwise about (0, 0)', 'rotation 180° about (0, 0)');
  // A glide reflection is no single transformation of the families.
  refused(() => run(dense, 'poly_identify', { from: 'Figure 1', to: 'Figure 3' }), /no single translation, reflection, rotation or dilation/);
  // A segment moved straight up fits a translation AND a reflection: every fit is named.
  refused(() => run(G([{ vertices: [[0, 0], [2, 0]] }, { vertices: [[0, 2], [2, 2]] }]), 'poly_identify', { from: 0, to: 1 }), /several.*translation by \(0, 2\).*reflection across the line y = 1/);
  refused(() => run(G([{ vertices: [[0, 0], [2, 0], [0, 2]] }, { vertices: [[0, 0], [2, 0], [0, 2]], style: 'dashed' }]), 'poly_identify', { from: 0, to: 1 }), /coincide/);
  refused(() => run(G([{ vertices: [[1, 1], [3, 1], [1, 4]], labels: ['P', 'Q', 'R'] }, { vertices: [[1, -1], [3, -1], [1, -4]], labels: ['Q′', 'P′', 'R′'] }]), 'poly_identify', { from: 0, to: 1 }), /labels do not correspond/);
  refused(() => run(trans, 'poly_identify', { from: 0, to: 0 }), /two different polygons/);
});

test('poly_sequence_maps and poly_which_sequence: a stated sequence of motions, checked vertex by vertex', () => {
  const steps = [{ reflect: 'x = -1' }, { rotate: 180 }];
  rwText(dense, 'poly_sequence_maps', { from: 'Figure 1', to: 'Figure 3', steps }, 'yes', 'no');
  rwText(dense, 'poly_sequence_maps', { from: 'Figure 1', to: 'Figure 3', steps: [{ reflect: 'x-axis' }, { translate: [2, 0] }] }, 'yes', 'no');
  rwText(dense, 'poly_sequence_maps', { from: 'Figure 1', to: 'Figure 3', steps: [{ reflect: 'x-axis' }] }, 'no', 'yes');
  const candidates = [[{ reflect: 'x-axis' }], [{ reflect: 'x-axis' }, { translate: [2, 0] }], [{ rotate: 180 }], [{ reflect: 'y-axis' }, { translate: [2, 0] }]];
  rwText(dense, 'poly_which_sequence', { from: 'Figure 1', to: 'Figure 3', candidates }, 'reflection across the x-axis, then translation by (2, 0)', 'reflection across the x-axis');
  refused(() => run(dense, 'poly_which_sequence', { from: 'Figure 1', to: 'Figure 3', candidates: [[{ rotate: 180 }]] }), /none of the candidates/);
  refused(() => run(dense, 'poly_which_sequence', { from: 'Figure 1', to: 'Figure 3', candidates: [steps, [{ reflect: 'x-axis' }, { translate: [2, 0] }]] }), /candidates 0 and 1 both map/);
  refused(() => run(dense, 'poly_sequence_maps', { from: 0, to: 2, steps: [] }), /"steps" must be a list of 1 to 4/);
});

test('poly_scale_factor, poly_congruent, poly_orientation', () => {
  rw(dil, 'poly_scale_factor', { from: 0, to: 1 }, '1/2', '2');
  rw(dil, 'poly_scale_factor', { from: 1, to: 0 }, '2', '0.5');
  rw(trans, 'poly_scale_factor', { from: 0, to: 1 }, '1', '2');
  refused(() => run(G([{ vertices: [[0, 0], [2, 0], [0, 2]] }, { vertices: [[0, 0], [4, 0], [0, 3]] }]), 'poly_scale_factor', { from: 0, to: 1 }), /not similar/);
  rwText(trans, 'poly_congruent', { a: 0, b: 1 }, 'yes', 'no');
  rwText(dil, 'poly_congruent', { a: 0, b: 1 }, 'no', 'yes');
  // Same triangle listed from another vertex: congruent only when any correspondence is allowed.
  const shifted = G([{ vertices: [[0, 0], [4, 0], [0, 3]] }, { vertices: [[5, 3], [1, 0], [5, 0]] }]);
  rwText(shifted, 'poly_congruent', { a: 0, b: 1, match: 'any' }, 'yes', 'no');
  rwText(shifted, 'poly_congruent', { a: 0, b: 1 }, 'no', 'yes');
  rwText(rot, 'poly_orientation', { from: 0, to: 1 }, 'preserved', 'reversed');
  rwText(refl, 'poly_orientation', { from: 0, to: 1 }, 'reversed', 'preserved');
  refused(() => run(seg, 'poly_orientation', { from: 0, to: 1 }), /at least three vertices/);
});

test('poly_symmetry_lines and poly_rotational_symmetry: exact geometry', () => {
  rw(one([[0, 0], [2, 0], [2, 2], [0, 2]]), 'poly_symmetry_lines', { polygon: 0 }, '4', '2');
  rw(one([[0, 0], [4, 0], [4, 2], [0, 2]]), 'poly_symmetry_lines', {}, '2', '4');
  rw(one([[0, 0], [4, 0], [2, 3]]), 'poly_symmetry_lines', {}, '1', '0');
  rw(one([[0, 0], [4, 0], [1, 3]]), 'poly_symmetry_lines', {}, '0', '1');
  rw(one([[0, 0], [2, 1], [4, 0], [2, 5]]), 'poly_symmetry_lines', {}, '1', '2'); // a dart (non-convex)
  rw(oct, 'poly_symmetry_lines', {}, '4', '8');
  rw(seg, 'poly_symmetry_lines', { polygon: 0 }, '2', '1');
  rw(one([[0, 0], [2, 0], [2, 2], [0, 2]]), 'poly_rotational_symmetry', {}, '4', '2');
  rw(one([[0, 0], [4, 0], [4, 2], [0, 2]]), 'poly_rotational_symmetry', {}, '2', '4');
  rw(one([[0, 0], [4, 0], [5, 2], [1, 2]]), 'poly_rotational_symmetry', {}, '2', '1'); // parallelogram: 0 lines, order 2
  rw(one([[0, 0], [4, 0], [5, 2], [1, 2]]), 'poly_symmetry_lines', {}, '0', '2');
  rw(oct, 'poly_rotational_symmetry', {}, '4', '8');
  rw(one([[0, 0], [4, 0], [1, 3]]), 'poly_rotational_symmetry', {}, '1', '3');
  refused(() => run(one([[0, 0], [2, 0], [4, 0], [2, 3]]), 'poly_symmetry_lines', {}), /lies on a straight side/);
  refused(() => run(dense, 'poly_symmetry_lines', {}), /name the polygon/);
});

test('examineFigureItem: a right key is derived, a wrong key is a mismatch', () => {
  const q = 'Triangle JKL is reflected across the line y = x to give triangle J′K′L′, as shown. What are the coordinates of K′?';
  const ok = examineFigureItem(item(refl, { responseFormat: 'free', problemText: q, answer: '(7, 2)', alt: describeForAlt(refl, { hide: ['(7, 2)'] }), derivation: { checker: 'poly_vertex', args: { vertex: 'K′' } } }));
  assert.equal(ok.derivation.status, 'derived', JSON.stringify(ok));
  assert.ok(ok.figureText?.includes('a coordinate grid with two triangles'));
  const bad = examineFigureItem(item(refl, { responseFormat: 'free', problemText: q, answer: '(2, 7)', alt: describeForAlt(refl), derivation: { checker: 'poly_vertex', args: { vertex: 'K′' } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const mcq = examineFigureItem(item(rot, {
    responseFormat: 'mcq', problemText: 'Quadrilateral KLMN is mapped to quadrilateral K′L′M′N′ as shown. Which rule describes the transformation?', answer: 'B',
    choices: ['(x, y) → (y, −x)', '(x, y) → (−y, x)', '(x, y) → (−x, −y)', '(x, y) → (−x, y)'], alt: describeForAlt(rot),
    derivation: { checker: 'poly_identify', args: { from: 0, to: 1, form: 'rule' } },
  }));
  assert.equal(mcq.derivation.status, 'derived', JSON.stringify(mcq.derivation));
});

test('figureLetterClash works for the kind: A, B, C vertex labels clash with options; P, Q, R do not', () => {
  const abc = one([[0, 0], [4, 0], [0, 3]], ['A', 'B', 'C']);
  assert.deepEqual(figureLetterClash(abc, ['1', '2', '3', '4'])?.letters, ['A', 'B', 'C']);
  assert.equal(figureLetterClash(trans, ['1', '2', '3', '4']), null);
  const coords = G([{ vertices: [[0, 0], [4, 0], [0, 3]], labels: ['A', 'Q', 'R'] }], { showVertexCoordinates: true });
  assert.deepEqual(figureLetterClash(coords, ['1', '2', '3', '4'])?.letters, ['A']);
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), `${k} has no test`);
});

console.log(`${passed} figure-core-batch6-polygon test(s) passed`);
