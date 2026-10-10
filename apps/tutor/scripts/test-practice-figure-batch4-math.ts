/**
 * Practice-figure renderer — batch 4, part "math": conic_graph, venn_diagram,
 * probability_tree (src/lib/tutor/practice-figure/kinds/conic.ts, venn-tree.ts).
 *
 * Under test: the shared fixture invariants (scripts/lib/practice-figure-test-kit.ts)
 * over this part's fixtures; per kind what is drawn, what each option hides,
 * the model behind the picture, the refusals and the kind's own warnings.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-math.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { inspectPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { conicModel, lineConicIntersections, lineOf, verticalLine } from '../src/lib/tutor/practice-figure/kinds/conic';
import { treeModel, vennModel } from '../src/lib/tutor/practice-figure/kinds/venn-tree';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-math';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const P = (id: string): Params => fx(id).params;
const BLANK_BOX = /stroke-dasharray="3 2"/g;
const DOT = /<circle [^>]*r="3\.4"/g;

console.log('\nEvery fixture of the part:\n');

const GROUPS: Record<string, string> = {
  'conic_graph (circle)': 'conic-circle-', 'conic_graph (ellipse)': 'conic-ellipse-', 'conic_graph (hyperbola)': 'conic-hyperbola-', 'conic_graph (parabola)': 'conic-parabola-',
  'conic_graph (two conics)': 'conic-system-', venn_diagram: 'venn-', probability_tree: 'tree-',
};
const { 'conic_graph (two conics)': _two, ...NEW } = GROUPS;
void _two;
const rendered = fixtureInvariants(test, FIXTURES.filter((f) => !f.id.startsWith('conic-system-')), NEW);
test('the two-conic fixture holds the same invariants (it is one more conic fixture, not a variant of its own)', () => {
  const f = FIXTURES.find((x) => x.id === 'conic-system-two-conics') ?? assert.fail('missing');
  assert.deepEqual(checkFigureLegibility(f.spec), []);
  assert.equal(count(svgOf(f.spec.type, f.spec.params), DOT), 4);
});

console.log('\nconic_graph:\n');

const base = (conic: Params, extra: Params = {}): Params => ({ xRange: [-10, 10], yRange: [-10, 10], conics: [conic], ...extra });

test('conic_graph: equal scales — the plot is as tall as its ranges say, so a circle is a circle', () => {
  for (const [xr, yr] of [[[-4, 8], [-6, 4]], [[-6, 6], [-4, 4]], [[-9, 7], [-9, 11]]] as Array<[[number, number], [number, number]]>) {
    const { facts } = inspectPracticeFigure({ type: 'conic_graph', params: { xRange: xr, yRange: yr, conics: [{ type: 'circle', center: [0, 0], radius: 1 }] } });
    const plot = facts.plot ?? assert.fail('no plot');
    near(plot.w / (xr[1] - xr[0]), plot.h / (yr[1] - yr[0]), 0.02 * (plot.w / (xr[1] - xr[0])));
  }
  throwsSpec('conic_graph', { xRange: [-10, 10], yRange: [-2, 2], conics: [{ type: 'circle', center: [0, 0], radius: 1 }] }, /equal scales.*0\.2 times as tall.*between 0\.4 and 1\.4/);
  throwsSpec('conic_graph', { xRange: [-2, 2], yRange: [-10, 10], conics: [{ type: 'circle', center: [0, 0], radius: 1 }] }, /5 times as tall/);
});

test('conic_graph: nothing is printed unless asked — a bare conic has only the axis numbers and the axis names', () => {
  for (const id of ['conic-circle-simple', 'conic-ellipse-simple']) {
    const t = texts(rendered.get(id) as string).filter((s) => !/^[−-]?\d+(\.\d+)?$/.test(s));
    assert.deepEqual(t.sort(), ['x', 'y'], id);
    assert.equal(count(rendered.get(id) as string, DOT), 0);
  }
  const hyp = rendered.get('conic-hyperbola-simple') as string;
  assert.equal(count(hyp, /stroke-dasharray="11 5"/g), 2, 'two dashed asymptotes');
  assert.equal(count(hyp, /stroke="#1d4ed8" stroke-width="2\.2"/g), 2, 'two branches');
  assert.ok(!texts(hyp).some((s) => /=/.test(s)));
});

test('conic_graph: the model — vertices, co-vertices, foci, asymptotes, directrix, standard form (textbook cases)', () => {
  const m = (c: Params) => conicModel(reader('conic_graph', base(c))).conics[0];
  const e = m({ type: 'ellipse', center: [0, 0], rx: 5, ry: 3 });
  assert.equal(e.axis, 'x');
  near(e.c, 4);
  assert.deepEqual(e.foci.map((q) => q.coords), ['(−4, 0)', '(4, 0)']);
  assert.deepEqual(e.vertices.map((q) => q.coords), ['(−5, 0)', '(5, 0)']);
  assert.deepEqual(e.coVertices.map((q) => q.coords), ['(0, −3)', '(0, 3)']);
  assert.equal(e.equation, 'x²/25 + y²/9 = 1');
  const ev = m({ type: 'ellipse', center: [1, -2], rx: 3, ry: 4 });
  assert.equal(ev.axis, 'y');
  assert.deepEqual(ev.foci.map((q) => q.coords), ['(1, −2 − √7)', '(1, −2 + √7)']);
  assert.deepEqual(ev.vertices.map((q) => [q.x, q.y]), [[1, -6], [1, 2]]);
  const h = m({ type: 'hyperbola', center: [0, 0], a: 3, b: 4, axis: 'x' });
  near(h.c, 5);
  assert.deepEqual(h.asymptotes.map((l) => l.equation), ['y = (4/3)x', 'y = −(4/3)x']);
  assert.equal(h.equation, 'x²/9 − y²/16 = 1');
  const hv = m({ type: 'hyperbola', center: [3, 1], a: 3, b: 2, axis: 'y' });
  assert.deepEqual(hv.foci.map((q) => q.coords), ['(3, 1 − √13)', '(3, 1 + √13)']);
  assert.deepEqual(hv.asymptotes.map((l) => l.equation), ['y = (3/2)x − 7/2', 'y = −(3/2)x + 11/2']);
  const p = m({ type: 'parabola', vertex: [1, -2], p: 3, axis: 'y' });
  assert.equal(p.foci[0].coords, '(1, 1)');
  assert.equal(p.directrix?.equation, 'y = −5');
  assert.equal(p.equation, '(x − 1)² = 12(y + 2)');
  const pl = m({ type: 'parabola', vertex: [2, 1], p: -2, axis: 'x' });
  assert.equal(pl.foci[0].coords, '(0, 1)');
  assert.equal(pl.directrix?.equation, 'x = 4');
  assert.equal(pl.equation, '(y − 1)² = −8(x − 2)');
  assert.equal(m({ type: 'circle', center: [2, -1], radius: 4 }).equation, '(x − 2)² + (y + 1)² = 16');
  assert.equal(lineOf(-1, 0).equation, 'y = −x');
  assert.equal(lineOf(0, 3).equation, 'y = 3');
  assert.equal(lineOf(0.5, -2).equation, 'y = (1/2)x − 2');
  assert.equal(verticalLine(-2).equation, 'x = −2');
  // Intersections: x² + y² = 25 with y = x + 1 → (−4, −3), (3, 4); a tangent → one point; a miss → none.
  const c = m({ type: 'circle', center: [0, 0], radius: 5 });
  assert.deepEqual(lineConicIntersections(c, lineOf(1, 1)).map(([x, y]) => [Math.round(x * 1e6) / 1e6, Math.round(y * 1e6) / 1e6]), [[-4, -3], [3, 4]]);
  assert.equal(lineConicIntersections(c, lineOf(0, 5)).length, 1);
  assert.equal(lineConicIntersections(c, verticalLine(6)).length, 0);
});

test('conic_graph: every feature is none (default) / mark (dot + name) / value (name + coordinates or equation) / blank ("?")', () => {
  const ell = (show: Params): string => svgOf('conic_graph', { xRange: [-8, 8], yRange: [-6, 6], conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show }] });
  for (const [feature, names, coords] of [['center', ['C'], ['C (0, 0)']], ['vertices', ['V₁', 'V₂'], ['V₁ (−5, 0)', 'V₂ (5, 0)']], ['coVertices', ['B₁', 'B₂'], ['B₁ (0, −3)', 'B₂ (0, 3)']], ['foci', ['F₁', 'F₂'], ['F₁ (−4, 0)', 'F₂ (4, 0)']]] as Array<[string, string[], string[]]>) {
    const none = ell({});
    for (const s of [...names, ...coords]) assert.ok(!has(none, s), `${feature} none: ${s}`);
    const mark = ell({ [feature]: 'mark' });
    assert.equal(count(mark, DOT), names.length, feature);
    for (const s of names) assert.ok(has(mark, s), `${feature} mark: ${s}`);
    assert.ok(!texts(mark).some((s) => /\(/.test(s)), `${feature} mark prints no coordinates`);
    const value = ell({ [feature]: 'value' });
    for (const s of coords) assert.ok(has(value, s), `${feature} value: ${s}`);
    const blank = ell({ [feature]: 'blank' });
    assert.equal(count(blank, BLANK_BOX), names.length, `${feature} blank`);
    assert.equal(count(blank, DOT), names.length);
    for (const s of names) assert.ok(has(blank, s));
    assert.ok(!texts(blank).some((s) => /\(/.test(s)), `${feature} blank prints no coordinates`);
  }
  // Lines: asymptotes, directrix, axis.
  const hyp = (show: Params): string => svgOf('conic_graph', { xRange: [-10, 10], yRange: [-7, 7], conics: [{ type: 'hyperbola', center: [0, 0], a: 4, b: 3, axis: 'x', show }] });
  assert.equal(count(hyp({}), /stroke-dasharray="11 5"/g), 0);
  assert.equal(count(hyp({ asymptotes: 'mark' }), /stroke-dasharray="11 5"/g), 2);
  assert.ok(has(hyp({ asymptotes: 'value' }), 'y = (3/4)x') && has(hyp({ asymptotes: 'value' }), 'y = −(3/4)x'));
  assert.equal(count(hyp({ asymptotes: 'blank' }), BLANK_BOX), 2);
  assert.ok(!texts(hyp({ asymptotes: 'blank' })).some((s) => /=/.test(s)));
  assert.equal(count(hyp({ box: 'mark' }), /stroke-dasharray="2 3"/g), 1);
  const par = (show: Params): string => svgOf('conic_graph', { xRange: [-7, 9], yRange: [-7, 7], conics: [{ type: 'parabola', vertex: [1, -2], p: 3, axis: 'y', show }] });
  assert.equal(count(par({ directrix: 'mark' }), /stroke-dasharray="7 3 2 3"/g), 1);
  assert.ok(has(par({ directrix: 'value' }), 'y = −5') && !has(par({ directrix: 'mark' }), 'y = −5'));
  assert.equal(count(par({ directrix: 'blank' }), BLANK_BOX), 1);
  assert.ok(has(par({ axis: 'value' }), 'x = 1'));
  assert.ok(has(par({ focus: 'value', vertex: 'value' }), 'F (1, 1)') && has(par({ focus: 'value', vertex: 'value' }), 'V (1, −2)'));
  assert.ok(has(par({ focus: 'mark' }), 'F') && !has(par({ focus: 'mark' }), 'F (1, 1)'));
  // A circle's radius: a segment with "r", the length, or a "?".
  const circ = (radius: string): string => svgOf('conic_graph', { xRange: [-6, 6], yRange: [-6, 6], conics: [{ type: 'circle', center: [0, 0], radius: 4, show: { radius } }] });
  assert.ok(has(circ('mark'), 'r') && has(circ('value'), '4') && count(circ('blank'), BLANK_BOX) === 1 && !texts(circ('blank')).includes('r'));
});

test('conic_graph: two conics get a dash pattern each and a legend; lines are solid, points are dots', () => {
  const svg = rendered.get('conic-system-two-conics') ?? svgOf('conic_graph', P('conic-system-two-conics'));
  assert.ok(has(svg, 'circle') && has(svg, 'parabola'));
  assert.ok(/stroke="#c2410c" stroke-width="2\.2" stroke-linejoin="round" stroke-dasharray="6 5"/.test(svg), 'the second conic is dashed');
  const noLabels = svgOf('conic_graph', { xRange: [-6, 6], yRange: [-6, 6], conics: [{ type: 'circle', center: [0, 0], radius: 5 }, { type: 'ellipse', center: [0, 0], rx: 3, ry: 2 }] });
  assert.ok(has(noLabels, 'curve 1') && has(noLabels, 'curve 2'), 'a default legend never names the kind of curve');
  const sys = rendered.get('conic-circle-dense-line-system') as string;
  assert.ok(has(sys, 'ℓ') && has(sys, 'P') && has(sys, 'Q') && has(sys, 'C (0, 0)') && has(sys, '5'));
  assert.equal(count(sys, DOT), 3);
});

test('conic_graph: refusals name the param', () => {
  throwsSpec('conic_graph', { xRange: [-5, 5], yRange: [-5, 5] }, /conics must be an array/);
  throwsSpec('conic_graph', base({ type: 'spiral' }), /conics\[0\]\.type must be one of circle, ellipse, hyperbola, parabola/);
  throwsSpec('conic_graph', base({ type: 'circle', center: [0, 0], radius: 0 }), /conics\[0\]\.radius must be greater than 0/);
  throwsSpec('conic_graph', base({ type: 'circle', center: [8, 0], radius: 5 }), /conics\[0\]: the circle runs from x = 3 to 13 .* widen xRange/);
  throwsSpec('conic_graph', base({ type: 'ellipse', center: [0, 0], rx: 3, ry: 3 }), /rx and ry are equal — that is a circle/);
  throwsSpec('conic_graph', base({ type: 'hyperbola', center: [0, 0], a: 3, b: 4 }), /conics\[0\]\.axis must be 'x'/);
  throwsSpec('conic_graph', base({ type: 'parabola', vertex: [0, 0], p: 0, axis: 'y' }), /conics\[0\]\.p must not be 0/);
  throwsSpec('conic_graph', base({ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { foci: 'mark' } }), /conics\[0\]\.show\.foci: a parabola has no such feature — one of vertex, focus, directrix, axis/);
  throwsSpec('conic_graph', base({ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { foci: 'yes' } }), /conics\[0\]\.show\.foci must be one of value, mark, blank, none/);
  throwsSpec('conic_graph', { xRange: [-6, 6], yRange: [-6, 6], conics: [{ type: 'hyperbola', center: [0, 0], a: 3, b: 6, axis: 'x', show: { foci: 'value' } }] }, /conics\[0\]\.show\.foci: F₁ \(−√45, 0\) is outside xRange/);
  throwsSpec('conic_graph', { xRange: [-6, 6], yRange: [-4, 6], conics: [{ type: 'parabola', vertex: [0, 0], p: 5, axis: 'y', show: { directrix: 'mark' } }] }, /show\.directrix: the directrix y = −5 is outside the ranges/);
  throwsSpec('conic_graph', base({ type: 'circle', center: [0, 0], radius: 2 }, { lines: [{ slope: 0, intercept: 20 }] }), /lines\[0\] \(y = 20\) does not cross the plot/);
  throwsSpec('conic_graph', base({ type: 'circle', center: [0, 0], radius: 2 }, { points: [{ x: 11, y: 0 }] }), /points\[0\] \(11, 0\) is outside/);
  throwsSpec('conic_graph', { xRange: [-5, 5], yRange: [-5, 5], conics: [1, 2, 3].map(() => ({ type: 'circle', center: [0, 0], radius: 1 })) }, /conics must have between 1 and 2 entries/);
});

test('conic_graph: legibility — two dots that touch are reported; a mark on the border is reported', () => {
  // Foci 0.2 units from the vertices: at 18 px per unit the dots touch.
  const close = { xRange: [-10, 10], yRange: [-7, 7], conics: [{ type: 'ellipse', center: [0, 0], rx: 8, ry: 2, show: { foci: 'mark', vertices: 'mark' } }] };
  assert.ok(warn('conic_graph', close).includes('crowded'), JSON.stringify(checkFigureLegibility({ type: 'conic_graph', params: close })));
  assert.ok(warn('conic_graph', { xRange: [-5, 5], yRange: [-5, 5], conics: [{ type: 'circle', center: [0, 0], radius: 5, show: { center: 'mark' } }], points: [{ x: 5, y: 0 }] }).includes('feature_on_border'));
});

console.log('\nvenn_diagram:\n');

test('venn_diagram: circles, names, one number per region; a region may be a "?", empty, or hatched', () => {
  const two = rendered.get('venn-simple-two-sets') as string;
  assert.equal(count(two, /<circle /g), 2);
  assert.deepEqual(texts(two).sort(), ['12', '5', '7', '8', 'Soccer', 'Tennis']);
  const three = rendered.get('venn-dense-three-sets-shaded') as string;
  assert.equal(count(three, /<circle /g), 3);
  for (const s of ['French', 'Spanish', 'German', '60 students', '14', '11', '9', '6', '4', '5', '3', '8']) assert.ok(has(three, s), s);
  assert.equal(count(three, /stroke="#4b5563" stroke-width="1"\/>/g), 1, 'one hatch path');
  const blank = rendered.get('venn-blank-probability') as string;
  assert.equal(count(blank, BLANK_BOX), 1);
  assert.ok(!has(blank, '0.2') && has(blank, '0.3') && has(blank, '0.35') && has(blank, '0.15'));
  const none = svgOf('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 3, show: 'none' }, { in: ['B'], value: 4 }] });
  assert.deepEqual(texts(none).sort(), ['4', 'A', 'B']);
  assert.ok(!/opacity/.test(blank));
});

test('venn_diagram: the hatching covers the named region only', () => {
  // Hatch segments of the A∩B-only lens of the three-set fixture stay inside circles A and B and outside C.
  const svg = rendered.get('venn-dense-three-sets-shaded') as string;
  const d = /<path d="([^"]+)" fill="none" stroke="#4b5563" stroke-width="1"\/>/.exec(svg)?.[1] ?? assert.fail('no hatch');
  const pts = [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(pts.length >= 8);
  const circles = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]);
  for (const [x, y] of pts) {
    const inside = circles.map(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r + 1);
    const outside = circles.map(([cx, cy, r]) => Math.hypot(x - cx, y - cy) > r - 1);
    assert.ok(inside[0] && inside[1] && outside[2], `(${x}, ${y})`);
  }
});

test('venn_diagram: the model, refusals and warnings', () => {
  const m = vennModel(reader('venn_diagram', P('venn-dense-three-sets-shaded')));
  assert.deepEqual(m.regions.map((g) => g.mask), [1, 2, 4, 3, 5, 6, 7, 0]);
  assert.equal(m.regions.reduce((t, g) => t + g.value, 0), 60);
  throwsSpec('venn_diagram', { sets: ['A'], regions: [{ in: ['A'], value: 1 }] }, /sets must have between 2 and 3 entries/);
  throwsSpec('venn_diagram', { sets: ['A', 'A'], regions: [{ in: ['A'], value: 1 }] }, /two sets have the same name/);
  throwsSpec('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['C'], value: 1 }] }, /regions\[0\]\.in names "C", which is not one of the sets \(A, B\)/);
  throwsSpec('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 1 }, { in: ['A'], value: 2 }] }, /regions\[1\]: the region inside A only is listed twice/);
  throwsSpec('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 1.5 }] }, /regions\[0\]\.value must be a whole number/);
  throwsSpec('venn_diagram', { sets: ['A', 'B'], values: 'probability', regions: [{ in: ['A'], value: 0.5 }, { in: ['B'], value: 0.2 }, { in: ['A', 'B'], value: 0.2 }, { in: [], value: 0.2 }] }, /the probabilities total 1\.1, not 1/);
  throwsSpec('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 1, show: 'hidden' }] }, /regions\[0\]\.show must be one of value, blank, none/);
  assert.ok(warn('venn_diagram', { sets: ['A', 'B'], regions: [{ in: ['A'], value: 3, show: 'blank' }, { in: ['B'], value: 4, show: 'blank' }] }).includes('ambiguous_blank'));
  assert.ok(warn('venn_diagram', { sets: ['A', 'B', 'C'], regions: [{ in: ['A', 'B', 'C'], value: 123456 }] }).includes('crowded'));
  // Two names of the longest allowed length still sit side by side; a long corner label under a third set does not.
  assert.deepEqual(warn('venn_diagram', { sets: ['Plays an instrument!', 'Sings in the choir!!'], regions: [{ in: [], value: 1 }] }), []);
  assert.ok(warn('venn_diagram', { sets: ['A', 'B', 'A long third name'], universeLabel: 'The whole year group', regions: [{ in: [], value: 1 }] }).includes('labels_overlap'));
});

console.log('\nprobability_tree:\n');

test('probability_tree: branches, labels, probabilities as written; blanks; outcomes and path products', () => {
  const simple = rendered.get('tree-simple-two-stage') as string;
  assert.deepEqual(texts(simple), ['0.4', 'Bag 1', '0.7', 'Red', '0.3', 'Blue', '0.6', 'Bag 2', '0.2', 'Red', '0.8', 'Blue']);
  const dense = rendered.get('tree-dense-three-stage') as string;
  for (const s of ['1st toss', '2nd toss', '3rd toss', 'HHH', 'TTT', '8/27', '4/27', '2/27', '1/27']) assert.ok(has(dense, s), s);
  assert.equal(texts(dense).filter((s) => s === '2/3').length, 7);
  const blank = rendered.get('tree-blank-without-replacement') as string;
  assert.equal(count(blank, BLANK_BOX), 3, 'two branches and one path value');
  assert.ok(!has(blank, '2/7') && !has(blank, '4/7') && !has(blank, '3/28') && has(blank, '5/7') && has(blank, '3/7'));
  const none = svgOf('probability_tree', { branches: [{ label: 'A', p: 0.5, show: 'none' }, { label: 'B', p: 0.5 }] });
  assert.deepEqual(texts(none), ['A', '0.5', 'B']);
  // A per-leaf product overrides the default.
  const mixed = svgOf('probability_tree', { products: 'value', branches: [{ label: 'A', p: 0.25, product: 'none' }, { label: 'B', p: 0.75 }] });
  assert.deepEqual(texts(mixed), ['0.25', 'A', '0.75', 'B', '0.75']);
});

test('probability_tree: the model — path products (fractions stay fractions), leaves, depth', () => {
  const m = treeModel(reader('probability_tree', P('tree-blank-without-replacement')));
  assert.equal(m.depth, 2);
  assert.deepEqual(m.leaves.map((n) => n.pathText), ['3/28', '15/56', '15/56', '5/14']);
  near(m.leaves.reduce((t, n) => t + n.pathP, 0), 1);
  const d = treeModel(reader('probability_tree', P('tree-simple-two-stage')));
  assert.deepEqual(d.leaves.map((n) => n.pathText), ['0.28', '0.12', '0.12', '0.48']);
  assert.deepEqual(d.leaves[1].path, ['Bag 1', 'Blue']);
});

test('probability_tree: refusals name the param', () => {
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: 1 }] }, /branches must have between 2 and 4 entries/);
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: 0.5 }, { label: 'B', p: 0.4 }] }, /branches: the probabilities of one split total 0\.9, not 1/);
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: 0.5 }, { label: 'A', p: 0.5 }] }, /two branches of one split have the same label/);
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: 1.5 }, { label: 'B', p: -0.5 }] }, /branches\[0\]\.p must be a probability between 0 and 1/);
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: '1/0' }, { label: 'B', p: 0.5 }] }, /denominator 0/);
  throwsSpec('probability_tree', { branches: [{ label: 'A', p: 0.5, outcome: 'x', children: [{ label: 'C', p: 0.5 }, { label: 'D', p: 0.5 }] }, { label: 'B', p: 0.5 }] }, /only a leaf/);
  const deep = (n: number): Params[] => ['A', 'B'].map((l) => ({ label: l, p: 0.5, ...(n > 1 ? { children: deep(n - 1) } : {}) }));
  throwsSpec('probability_tree', { branches: deep(4) }, /at most 3 stages/);
  const wide = (n: number): Params[] => ['A', 'B', 'C', 'D'].map((l) => ({ label: l, p: 0.25, ...(n > 1 ? { children: wide(n - 1) } : {}) }));
  throwsSpec('probability_tree', { branches: wide(2) }, /ends in 16 leaves — at most 12/);
  const long = ['First option here', 'Second option xx'].map((l) => ({ label: l.slice(0, 16), p: 0.5, children: ['Third option here', 'Fourth option xx'].map((k) => ({ label: k.slice(0, 16), p: 0.5, outcome: 'a long outcome', children: undefined })) }));
  throwsSpec('probability_tree', { products: 'value', branches: long.map((b) => ({ ...b, children: b.children.map((c) => ({ label: c.label, p: c.p, children: ['Yes indeed it is', 'No it is not so'].map((k) => ({ label: k, p: 0.5, outcome: 'a long outcome' })) })) })) }, /does not fit a phone-width card.*shorten the labels/);
});

void finish();
