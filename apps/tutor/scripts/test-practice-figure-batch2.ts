/**
 * Practice-figure renderer — batch 2 (2026-10-09): circuit_diagram,
 * phylogenetic_tree, geometric_figure, ray_diagram, field_diagram,
 * flow_diagram, solid_3d, spectrum (src/lib/tutor/practice-figure/kinds/).
 *
 * Under test:
 *   - adding batch 2 changed NOTHING that was there: the 72 fixtures of the
 *     nine first kinds and batch 1 still render to the very same bytes
 *     (sha-256 pinned at ca8cc0c4 in scripts/lib/practice-figure-pins-ca8cc0c4.json);
 *   - every batch-2 kind has ≥ 3 fixtures, one with a blank "?"; each uses
 *     only the pinned client vocabulary, sets no type under 10 px at 340 px,
 *     and is clean under `checkFigureLegibility` unless its note says "warns";
 *   - per kind: what is drawn, what each option hides, the model behind the
 *     picture (the solver, the tree, the optics, the field), the errors a
 *     bad spec raises and the kind's own legibility warnings.
 * The generic per-fixture checks (standalone root, safety validator,
 * determinism, labels inside the canvas, contract parse, a title only when
 * asked) run over these fixtures too in scripts/test-practice-figure-render.ts.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:practice-figure-batch2   (npx tsx scripts/test-practice-figure-batch2.ts)
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ALL_PRACTICE_FIGURE_KINDS, BATCH2_FIGURE_KINDS, PracticeFigureSpecError, renderPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { Reader } from '../src/lib/tutor/practice-figure/spec';
import { circuitModel, fNum, solveCircuit } from '../src/lib/tutor/practice-figure/kinds/circuit';
import { phyloModel } from '../src/lib/tutor/practice-figure/kinds/phylo-tree';
import { geometryModel } from '../src/lib/tutor/practice-figure/kinds/geometry';
import { rayModel, type InterfaceModel, type OpticsModel } from '../src/lib/tutor/practice-figure/kinds/ray-diagram';
import { fieldAt, fieldModel, lineCounts, magneticForceDirection, traceFieldLines, wireFieldDirection, wireSideField } from '../src/lib/tutor/practice-figure/kinds/field-diagram';
import { flowModel } from '../src/lib/tutor/practice-figure/kinds/flow-diagram';
import { revolutionVolume, solidModel } from '../src/lib/tutor/practice-figure/kinds/solid-3d';
import { spectrumModel } from '../src/lib/tutor/practice-figure/kinds/spectrum';
import { BATCH2_FIXTURES, FIGURE_FIXTURES } from './lib/practice-figure-fixtures';

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

type Params = Record<string, unknown>;
const svgOf = (type: string, params: Params): string => renderPracticeFigure({ type, params }).svg;
const texts = (svg: string): string[] => [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
  .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
const has = (svg: string, s: string): boolean => texts(svg).includes(s);
const throwsSpec = (type: string, params: Params, re: RegExp): void => {
  assert.throws(() => renderPracticeFigure({ type, params }), (e: unknown) => e instanceof PracticeFigureSpecError && re.test(e.message), `${type}: ${re}`);
};
const warn = (type: string, params: Params): string[] => checkFigureLegibility({ type, params }).map((w) => w.code);
const reader = (type: string, params: Params): Reader => new Reader(type, params);
const near = (a: number, b: number, tol = 1e-9): void => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);
const fx = (id: string): PracticeFigureSpec => (BATCH2_FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;

console.log('\nNothing that was there has changed:\n');

test('the 72 fixtures of the first nine kinds and batch 1 render to the very same bytes as at ca8cc0c4', () => {
  const pins = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'practice-figure-pins-ca8cc0c4.json'), 'utf8')) as Record<string, string>;
  assert.equal(Object.keys(pins).length, 72);
  const earlier = FIGURE_FIXTURES.filter((f) => !(BATCH2_FIGURE_KINDS as readonly string[]).includes(f.spec.type));
  assert.deepEqual(earlier.map((f) => f.id), Object.keys(pins), 'same fixtures, same order');
  for (const f of earlier) assert.equal(createHash('sha256').update(renderPracticeFigure(f.spec).svg).digest('hex'), pins[f.id], f.id);
});

test('batch 2 is a list of its own: eight kinds, none of them in the earlier lists', () => {
  assert.equal(BATCH2_FIGURE_KINDS.length, 8);
  for (const k of BATCH2_FIGURE_KINDS) assert.ok(!(ALL_PRACTICE_FIGURE_KINDS as readonly string[]).includes(k), k);
  assert.equal(FIGURE_FIXTURES.length, 72 + BATCH2_FIXTURES.length);
  throwsSpec('pie_chart', {}, /unknown figure kind .*function_graph.*circuit_diagram.*spectrum/);
});

console.log('\nEvery batch-2 fixture:\n');

const rendered = new Map<string, string>(BATCH2_FIXTURES.map((f) => [f.id, renderPracticeFigure(f.spec).svg]));
/** The element and attribute names of the pinned client fixture (academy
 *  tests/fixtures/engine-practice-figures.json) — the same two lists as in
 *  test-practice-figure-render.ts. */
const PINNED_ELEMENTS = ['circle', 'clipPath', 'defs', 'g', 'line', 'marker', 'path', 'polygon', 'rect', 'svg', 'text', 'tspan'];
const PINNED_ATTRS = ['clip-path', 'cx', 'cy', 'd', 'dominant-baseline', 'dy', 'fill', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'id', 'marker-end', 'markerHeight', 'markerWidth', 'orient', 'paint-order', 'points', 'preserveAspectRatio', 'r', 'refX', 'refY', 'role', 'rx', 'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'text-anchor', 'transform', 'viewBox', 'width', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2'];

test('every kind has ≥ 3 fixtures — a simple one, a dense or awkward one, and one with a blank "?" that the figure shows', () => {
  for (const kind of BATCH2_FIGURE_KINDS) {
    const mine = BATCH2_FIXTURES.filter((f) => f.spec.type === kind);
    assert.ok(mine.length >= 3, `${kind}: ${mine.length} fixtures`);
    assert.ok(mine.some((f) => /dense|awkward/.test(f.note)), `${kind}: a dense or awkward fixture`);
    const blank = mine.filter((f) => /blank/.test(f.id));
    assert.ok(blank.length >= 1, `${kind}: a fixture with a blank`);
    for (const b of blank) assert.ok(texts(rendered.get(b.id) as string).some((t) => t.includes('?')), `${b.id} shows a "?"`);
  }
});

test('only the pinned client vocabulary — no <ellipse>, <polyline>, opacity, style, data-*, aria-*, title, pattern, gradient, image, link', () => {
  for (const f of BATCH2_FIXTURES) {
    const svg = rendered.get(f.id) as string;
    for (const m of svg.matchAll(/<([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*\/?>/g)) {
      assert.ok(PINNED_ELEMENTS.includes(m[1]), `${f.id}: element <${m[1]}>`);
      for (const a of m[2].matchAll(/\s([\w:-]+)="/g)) assert.ok(PINNED_ATTRS.includes(a[1]), `${f.id}: attribute ${a[1]} on <${m[1]}>`);
    }
    assert.ok(!/opacity|<style|<title|<desc|data-|aria-|href|<pattern|Gradient|<image|<use/.test(svg), f.id);
    assert.ok(/^<svg [^>]*viewBox="0 0 360 \d+" role="img"/.test(svg) && svg.includes('fill="#ffffff"/>'), `${f.id}: root viewBox, role and white background`);
  }
});

test('no type under 10 px at 340 px (the lowered "o" / "i" of a distance symbol is a subscript, as "a" in Ea)', () => {
  for (const f of BATCH2_FIXTURES) {
    const sizes = [...(rendered.get(f.id) as string).matchAll(/<(?:text|tspan)\b[^>]*\sfont-size="([\d.]+)"/g)].map((m) => Number(m[1])).filter((s) => s !== 8);
    assert.ok(sizes.length > 0 && (Math.min(...sizes) * 340) / 360 >= 10, `${f.id}: ${Math.min(...sizes)}`);
  }
});

test('every fixture is clean under checkFigureLegibility unless its note says it warns', () => {
  for (const f of BATCH2_FIXTURES) {
    const w = checkFigureLegibility(f.spec);
    if (/warns/.test(f.note)) assert.ok(w.length > 0, `${f.id} should warn`);
    else assert.deepEqual(w, [], `${f.id}: ${w.map((x) => `${x.code}: ${x.message}`).join(' | ')}`);
  }
});

console.log('\nPer kind:\n');

test('circuit_diagram: labels as asked, switch states, the exact solution, refusals', () => {
  const two = (extra: Params = {}, r2: Params = {}) => ({ battery: { emf: 12, ...extra }, circuit: { series: [{ type: 'resistor', name: 'R₁', value: 4 }, { type: 'resistor', name: 'R₂', value: 2, ...r2 }] } });
  const svg = svgOf('circuit_diagram', two());
  assert.ok(has(svg, 'R₁ = 4 Ω') && has(svg, 'R₂ = 2 Ω') && has(svg, '12 V') && has(svg, '+') && has(svg, '−'));
  assert.ok(has(svgOf('circuit_diagram', two({}, { show: 'blank' })), 'R₂ = ?'));
  assert.ok(has(svgOf('circuit_diagram', two({}, { show: 'name' })), 'R₂') && !texts(svgOf('circuit_diagram', two({}, { show: 'name' }))).some((t) => t.includes('2 Ω')));
  assert.ok(!texts(svgOf('circuit_diagram', two({}, { show: 'none' }))).some((t) => t.includes('R₂')));
  assert.ok(!texts(svgOf('circuit_diagram', two({ show: 'none' }))).some((t) => t.includes('12')));
  assert.ok(texts(svgOf('circuit_diagram', two({ show: 'blank' }))).includes('?'));
  // A current arrow only when asked for.
  assert.equal((svg.match(/<polygon /g) ?? []).length, 0);
  assert.equal((svgOf('circuit_diagram', two({ current: 'I' })).match(/<polygon /g) ?? []).length, 1);
  // An open switch is drawn open (its arm leaves the wire); the meters carry their letters.
  const sw = (closed: boolean) => svgOf('circuit_diagram', { battery: { emf: 6 }, circuit: { series: [{ type: 'switch', closed }, { type: 'bulb' }, { type: 'ammeter' }, { parallel: [{ type: 'resistor', value: 3 }, { type: 'voltmeter' }] }] } });
  assert.notEqual(sw(true), sw(false));
  assert.ok(has(sw(true), 'A') && has(sw(true), 'V'));
  // Node dots where a parallel group joins the wire.
  assert.ok((sw(true).match(/<circle [^>]*r="2\.8"/g) ?? []).length >= 2);
  assert.ok(!svgOf('circuit_diagram', { battery: { emf: 6 }, nodeDots: false, circuit: { parallel: [{ type: 'resistor', value: 3 }, { type: 'resistor', value: 6 }] } }).includes('r="2.8"'));
  // The solver: series, parallel, a combination, an open branch, a voltmeter, a short.
  const solve = (params: Params, switches: Record<string, boolean> = {}) => solveCircuit(circuitModel(reader('circuit_diagram', params)), switches);
  const s1 = solve(two());
  near(fNum(s1.resistance as { n: number; d: number }), 6);
  near(fNum(s1.current), 2);
  assert.deepEqual(s1.leaves.map((l) => [fNum(l.I), fNum(l.V), fNum(l.P)]), [[2, 8, 16], [2, 4, 8]]);
  const dense = fx('circuit-combination-eight-components').params;
  near(fNum(solve(dense).resistance as { n: number; d: number }), 2 + 3 + 3);           // S open: 12 ∥ 4 = 3
  near(fNum(solve(dense, { S: true }).resistance as { n: number; d: number }), 2 + 2 + 3);   // 12 ∥ 6 ∥ 4 = 2
  assert.equal(solve({ battery: { emf: 6 }, circuit: { series: [{ type: 'resistor', value: 3 }, { type: 'switch', closed: false }] } }).resistance, null);
  assert.throws(() => solve({ battery: { emf: 6 }, circuit: { parallel: [{ type: 'resistor', value: 3 }, { type: 'wire' }] } }), /short-circuited/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, circuit: { type: 'diode' } }, /circuit\.type must be one of resistor/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, circuit: { series: [{ type: 'resistor', name: 'R' }, { type: 'bulb', name: 'R' }] } }, /"R" is used twice/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, circuit: { series: [{ type: 'resistor', value: 3 }] } }, /series must have between 2 and 8/);
  throwsSpec('circuit_diagram', { battery: { emf: 0 }, circuit: { type: 'bulb' } }, /battery\.emf must be greater than 0/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, circuit: { type: 'switch', value: 3 } }, /a switch has no value/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, circuit: { parallel: [1, 2, 3, 4].map((k) => ({ series: [1, 2, 3, 4, 5].map((j) => ({ type: 'resistor', name: `R${k}${j}`, value: 100 + j })) })) } }, /too wide to draw/);
  const nine = { battery: { emf: 6 }, circuit: { series: [{ parallel: [0, 1, 2].map(() => ({ type: 'bulb' })) }, { parallel: [0, 1, 2].map(() => ({ type: 'bulb' })) }, { parallel: [0, 1, 2].map(() => ({ type: 'bulb' })) }] } };
  assert.ok(warn('circuit_diagram', nine).includes('too_many_elements'));
  assert.ok(warn('circuit_diagram', two({}, { name: undefined, show: 'blank' })).includes('ambiguous_blank'));
});

test('phylogenetic_tree: tips in the order given, outgroup, node labels, trait names or a key, blanks, refusals', () => {
  const tree = { children: ['Lamprey', { node: 'A', traits: ['jaws'], children: ['Trout', { children: ['Frog', { name: 'Mouse', traits: ['hair'] }] }] }] };
  const svg = svgOf('phylogenetic_tree', { tree });
  for (const s of ['Lamprey', 'Trout', 'Frog', 'Mouse', 'A', 'jaws', 'hair']) assert.ok(has(svg, s), s);
  const m = phyloModel(reader('phylogenetic_tree', { tree }));
  assert.deepEqual(m.tips.map((t) => t.name), ['Lamprey', 'Trout', 'Frog', 'Mouse']);
  assert.deepEqual(m.root.children[1].tips, ['Trout', 'Frog', 'Mouse']);
  assert.equal(m.root.height, 3);
  // The tips sit in one column; a deeper node is further right than its parent.
  const tipX = [...svg.matchAll(/<text x="([\d.]+)"[^>]*font-weight="600"[^>]*>(?:Lamprey|Trout|Frog|Mouse)</g)].map((x) => x[1]);
  assert.equal(new Set(tipX).size, 1);
  assert.ok(has(svgOf('phylogenetic_tree', { tree, outgroup: 'Lamprey' }), '(outgroup)') && !has(svg, '(outgroup)'));
  const key = texts(svgOf('phylogenetic_tree', { tree, traitStyle: 'key' }));
  assert.ok(key.includes('1 = jaws') && key.includes('2 = hair') && key.includes('1') && !key.includes('jaws'));
  const blank = texts(svgOf('phylogenetic_tree', { tree: { children: ['Lamprey', { children: [{ name: 'Trout', blank: true }, { name: 'Frog', traits: [{ label: 'lungs', blank: true }] }] }] } }));
  assert.ok(blank.includes('?') && !blank.includes('Trout') && !blank.some((t) => t.includes('lungs')));
  assert.equal((svgOf('phylogenetic_tree', { tree, nodeDots: true }).match(/<circle /g) ?? []).length, 3);
  throwsSpec('phylogenetic_tree', { tree: 'Frog' }, /a single tip is not a tree/);
  throwsSpec('phylogenetic_tree', { tree: { children: ['Frog', 'Frog'] } }, /"Frog" appears twice/);
  throwsSpec('phylogenetic_tree', { tree: { children: ['Frog'] } }, /children must have between 2 and 4/);
  throwsSpec('phylogenetic_tree', { tree, outgroup: 'Mouse' }, /must be a tip that branches off at the root/);
  throwsSpec('phylogenetic_tree', { tree: { children: Array.from({ length: 4 }, (_, i) => ({ children: [`a${i}`, `b${i}`, `c${i}`, `d${i}`] })) } }, /16 tips — at most 12/);
  const chain = (n: number): unknown => (n === 0 ? 'Tip number zero here' : { children: [`Tip number ${n} here`, chain(n - 1)] });
  assert.ok(warn('phylogenetic_tree', { tree: chain(10) }).some((c) => c === 'crowded' || c === 'too_many_elements'));
});

test('geometric_figure: exact proportions, labels only as asked, marks, the five shapes, refusals', () => {
  const tri = svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], sideLabels: ['auto', 'auto', '?'], unit: 'cm' });
  assert.ok(has(tri, '3 cm') && has(tri, '4 cm') && has(tri, '?') && !has(tri, '5 cm'));
  for (const v of ['A', 'B', 'C']) assert.ok(has(tri, v));
  assert.ok(!texts(svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], vertices: null })).includes('A'));
  assert.deepEqual(texts(svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], vertices: null })), [], 'nothing printed that was not asked for');
  const m = geometryModel(reader('geometric_figure', { shape: 'triangle', sides: [3, 4, 5] })).poly!;
  near(m.angles[2], 90, 1e-6);
  near(m.angles[0], 36.8698976, 1e-6);
  // Drawn to scale: the drawn side lengths are in the ratio 3 : 4 : 5.
  const d = /<path d="M([\d.]+),([\d.]+)L([\d.]+),([\d.]+)L([\d.]+),([\d.]+)z"/.exec(tri)!.slice(1).map(Number);
  const len = (i: number, j: number) => Math.hypot(d[2 * i] - d[2 * j], d[2 * i + 1] - d[2 * j + 1]);
  near(len(1, 2) / len(0, 1), 3 / 5, 2e-3);
  near(len(0, 2) / len(0, 1), 4 / 5, 2e-3);
  // The right-angle square appears for a right angle only, and can be switched off.
  const squares = (svg: string) => (svg.match(/stroke-width="1\.3"\/>/g) ?? []).length;
  assert.equal(squares(svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], vertices: null })), 1);
  assert.equal(squares(svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], vertices: null, rightAngleMarks: false })), 0);
  assert.equal(squares(svgOf('geometric_figure', { shape: 'triangle', sides: [4, 4, 5], vertices: null })), 0);
  assert.ok(has(svgOf('geometric_figure', { shape: 'triangle', asa: [50, 6, 60], angleLabels: ['auto', 'auto', '?'] }), '50°'));
  near(geometryModel(reader('geometric_figure', { shape: 'triangle', sas: [5, 90, 12] })).poly!.sides[1], 13, 1e-9);
  const nts = svgOf('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], notToScale: true, drawn: { sides: [5, 5, 5] } });
  assert.ok(has(nts, 'not to scale') && !has(tri, 'not to scale'));
  throwsSpec('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], drawn: { sides: [5, 5, 5] } }, /only with notToScale/);
  throwsSpec('geometric_figure', { shape: 'triangle', sides: [1, 2, 5] }, /no triangle has sides 1, 2, 5/);
  throwsSpec('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], sas: [3, 90, 4] }, /exactly one of sides, sas, asa, points/);
  throwsSpec('geometric_figure', { shape: 'triangle', asa: [100, 5, 90] }, /add to less than 180/);
  throwsSpec('geometric_figure', { shape: 'hexagon' }, /shape must be one of/);
  throwsSpec('geometric_figure', { shape: 'polygon', points: [[0, 0], [1, 1], [2, 2], [0, 3]] }, /lie on one line/);
  // Polygon, circle, parallel lines, similar triangles.
  const reg = geometryModel(reader('geometric_figure', { shape: 'polygon', regular: { n: 6, side: 4 } })).poly!;
  assert.ok(reg.sides.every((s) => Math.abs(s - 4) < 1e-9) && reg.angles.every((a) => Math.abs(a - 120) < 1e-6));
  const circle = geometryModel(reader('geometric_figure', fx('geometry-circle-chords-tangent').params)).circle!;
  near(circle.angles[0].degrees, 80, 1e-9);
  near(circle.angles[1].degrees, 40, 1e-9);     // the inscribed angle is half the central angle on the same arc
  throwsSpec('geometric_figure', { shape: 'circle', radius: 3, points: [{ name: 'A', at: 0 }], chords: [{ from: 'A', to: 'Z' }] }, /"Z" is not one of the points/);
  const par = geometryModel(reader('geometric_figure', { shape: 'parallel_lines', angle: 65, labels: { 1: 'auto', 7: '?' } })).parallel!;
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((k) => par.values[k]), [115, 65, 65, 115, 115, 65, 65, 115]);
  assert.equal(par.labels[1], '115°');
  throwsSpec('geometric_figure', { shape: 'parallel_lines', angle: 5, labels: { 1: 'auto' } }, /between 20 and 160/);
  assert.ok(warn('geometric_figure', { shape: 'parallel_lines', angle: 60, labels: { 1: 'x', 2: '?' } }).includes('ambiguous_blank'));
  const sim = geometryModel(reader('geometric_figure', { shape: 'similar_triangles', sides: [6, 8, 9], scale: 1.5 })).similar!;
  assert.deepEqual(sim.second.sides.map((s) => Number(s.toFixed(6))).sort((a, b) => a - b), [9, 12, 13.5]);
  assert.ok(warn('geometric_figure', { shape: 'triangle', sides: [1, 20, 20], sideLabels: ['auto', 'auto', 'auto'] }).includes('crowded'));
});

test('ray_diagram: the thin-lens and mirror construction, what each option hides, the interface, refusals', () => {
  const lens = { element: 'converging_lens', focalLength: 10, objectDistance: 30, objectHeight: 4 };
  const m = rayModel(reader('ray_diagram', lens)) as OpticsModel;
  near(m.dI, 15);
  near(m.magnification, -0.5);
  near(m.hI, -2);
  assert.ok(m.real && !m.upright);
  const v = rayModel(reader('ray_diagram', { element: 'concave_mirror', focalLength: 12, objectDistance: 6 })) as OpticsModel;
  near(v.dI, -12);
  assert.ok(!v.real && v.upright && v.magnification === 2);
  near((rayModel(reader('ray_diagram', { element: 'diverging_lens', focalLength: 20, objectDistance: 20 })) as OpticsModel).dI, -10);
  near((rayModel(reader('ray_diagram', { element: 'convex_mirror', focalLength: 10, objectDistance: 15 })) as OpticsModel).dI, -6);
  const svg = svgOf('ray_diagram', lens);
  assert.ok(has(svg, 'F') && has(svg, '2F'));
  assert.ok(!texts(svg).some((t) => /cm|=/.test(t)), 'no distance is printed unless asked');
  const shownAll = texts(svgOf('ray_diagram', { ...lens, show: { objectDistance: 'value', imageDistance: 'blank', focalLength: 'value' } }));
  assert.ok(shownAll.includes('do = 30 cm') && shownAll.includes('di = ?') && shownAll.includes('f = 10 cm'));
  assert.ok(!shownAll.some((t) => t.includes('15')), 'the blank hides the image distance');
  // Three coloured rays by default; none with rays: 'none'; the image arrow is dashed only when virtual.
  const rayCount = (s: string) => new Set([...s.matchAll(/stroke="(#1d4ed8|#c2410c|#0f766e)"/g)].map((x) => x[1])).size;
  assert.equal(rayCount(svg), 3);
  assert.equal(rayCount(svgOf('ray_diagram', { ...lens, rays: 'none' })), 0);
  assert.equal(rayCount(svgOf('ray_diagram', { ...lens, rays: [1, 2] })), 2);
  const arrows = (s: string) => (s.match(/stroke-width="2\.6"/g) ?? []).length;
  assert.equal(arrows(svg), 2);
  assert.equal(arrows(svgOf('ray_diagram', { ...lens, showImage: false })), 1);
  assert.ok(!svg.includes('stroke-width="2.6" stroke-dasharray'));
  assert.ok(svgOf('ray_diagram', { element: 'concave_mirror', focalLength: 12, objectDistance: 6 }).includes('stroke-width="2.6" stroke-dasharray="5 3"'));
  assert.ok(!has(svgOf('ray_diagram', { ...lens, focalMarks: false }), 'F'));
  assert.ok(has(svgOf('ray_diagram', { element: 'concave_mirror', focalLength: 12, objectDistance: 30 }), 'C'));
  throwsSpec('ray_diagram', { ...lens, objectDistance: 10 }, /image is at infinity/);
  throwsSpec('ray_diagram', { ...lens, objectDistance: 10.5 }, /too large or too far to draw/);
  throwsSpec('ray_diagram', { ...lens, element: 'prism' }, /element must be one of/);
  throwsSpec('ray_diagram', { ...lens, rays: [4] }, /rays\[0\] must be 1, 2 or 3/);
  assert.ok(warn('ray_diagram', { ...lens, rays: 'none', showImage: false, focalMarks: false }).includes('ambiguous_blank'));
  // Plane interface.
  const face = { element: 'interface', n1: 1, n2: 1.5, incidentAngle: 30 };
  const im = rayModel(reader('ray_diagram', face)) as InterfaceModel;
  near(im.theta2 as number, 19.4712206, 1e-6);
  assert.equal(im.critical, null);
  const back = rayModel(reader('ray_diagram', { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 30 })) as InterfaceModel;
  near(back.theta2 as number, 48.5903779, 1e-6);
  near(back.critical as number, 41.8103149, 1e-6);
  const ft = texts(svgOf('ray_diagram', { ...face, media: ['air', 'glass'] }));
  assert.ok(ft.includes('normal') && ft.includes('air') && ft.includes('glass') && ft.includes('n = 1.00') && ft.includes('n = 1.50') && ft.includes('30°'));
  assert.ok(!ft.some((t) => t.includes('19')), 'the refraction angle is not printed unless asked');
  assert.ok(texts(svgOf('ray_diagram', { ...face, angleLabels: { refracted: 'auto' } })).includes('19.5°'));
  assert.ok(texts(svgOf('ray_diagram', { ...face, show: { n2: 'blank' } })).includes('n = ?'));
  throwsSpec('ray_diagram', { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 60 }, /totally internally reflected/);
  assert.ok(texts(svgOf('ray_diagram', { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 60, reflected: true })).includes('60°'));
  throwsSpec('ray_diagram', { ...face, incidentAngle: 90 }, /between 1 and 89/);
});

test('field_diagram: line counts follow the charges, the lines follow the field, forces are hidden until asked, refusals', () => {
  const dipole = { variant: 'point_charges', charges: [{ x: -2, y: 0, q: 1 }, { x: 2, y: 0, q: -1 }] };
  const m = fieldModel(reader('field_diagram', dipole));
  assert.ok(m.variant === 'point_charges');
  if (m.variant !== 'point_charges') return;
  assert.deepEqual(lineCounts(m), [8, 8]);
  const lines = traceFieldLines(m, 0.3);
  // Every line leaves the positive charge or arrives at the negative one; each charge is met by eight.
  assert.equal(lines.filter((l) => l.from === 0).length, 8);
  assert.equal(lines.filter((l) => l.to === 1).length, 8);
  // Each line runs along the field: its direction at a sample point matches E there.
  for (const l of lines) {
    const i = Math.floor(l.pts.length / 2);
    const [ex, ey] = fieldAt(m.charges, l.pts[i][0], l.pts[i][1]);
    const [dx, dy] = [l.pts[i + 1][0] - l.pts[i][0], l.pts[i + 1][1] - l.pts[i][1]];
    assert.ok((ex * dx + ey * dy) / (Math.hypot(ex, ey) * Math.hypot(dx, dy)) > 0.99);
  }
  const big = fieldModel(reader('field_diagram', { variant: 'point_charges', linesPerUnit: 4, charges: [{ x: -2, y: 0, q: 3 }, { x: 2.5, y: 0, q: -1 }] }));
  if (big.variant === 'point_charges') assert.deepEqual(lineCounts(big), [12, 4]);
  near(fieldAt([{ x: 0, y: 0, q: 2 }], 2, 0)[0], 0.5);
  const svg = svgOf('field_diagram', dipole);
  assert.ok(has(svg, '+') && has(svg, '−'));
  const hidden = svgOf('field_diagram', { ...dipole, charges: dipole.charges.map((c) => ({ ...c, showSign: false })) });
  assert.ok(!has(hidden, '+') && !has(hidden, '−'));
  assert.ok((svg.match(/<polygon /g) ?? []).length >= 12 && !svgOf('field_diagram', { ...dipole, arrows: false }).includes('<polygon'));
  assert.ok(warn('field_diagram', { ...dipole, arrows: false, charges: dipole.charges.map((c) => ({ ...c, showSign: false })) }).includes('ambiguous_blank'));
  assert.ok(warn('field_diagram', { variant: 'point_charges', linesPerUnit: 12, charges: [{ x: -2, y: 0, q: 4 }, { x: 2, y: 0, q: -4 }] }).includes('too_many_elements'));
  throwsSpec('field_diagram', { variant: 'point_charges', charges: [{ x: 0, y: 0, q: 0 }] }, /whole number from −4 to 4, not 0/);
  throwsSpec('field_diagram', { variant: 'point_charges', charges: [{ x: 0, y: 0, q: 1 }, { x: 0, y: 0, q: -1 }] }, /same place/);
  throwsSpec('field_diagram', { variant: 'gravity' }, /variant must be one of/);
  // The right-hand rule, negative charges included.
  assert.equal(magneticForceDirection(true, 'right', 'into'), 'up');
  assert.equal(magneticForceDirection(false, 'right', 'into'), 'down');
  assert.equal(magneticForceDirection(true, 'up', 'out'), 'right');
  assert.equal(magneticForceDirection(true, 'right', 'up'), 'out');
  assert.equal(magneticForceDirection(false, 'left', 'down'), 'into');
  assert.equal(magneticForceDirection(true, 'up', 'up'), null);
  assert.equal(wireFieldDirection('out', 'right'), 'up');
  assert.equal(wireFieldDirection('in', 'above'), 'right');
  assert.equal(wireSideField('right', 'above'), 'out');
  assert.equal(wireSideField('up', 'right'), 'into');
  // The force arrow is hidden unless asked for.
  const mf = { variant: 'magnetic_force', field: 'into', charge: { sign: '−', velocity: 'right' } };
  assert.ok(has(svgOf('field_diagram', mf), 'v') && !has(svgOf('field_diagram', mf), 'F'));
  assert.ok(has(svgOf('field_diagram', { ...mf, charge: { ...mf.charge, showForce: true } }), 'F'));
  assert.ok(has(svgOf('field_diagram', { ...mf, showField: false, charge: { ...mf.charge, showForce: true } }), 'B = ?'));
  assert.ok(warn('field_diagram', { ...mf, showField: false }).includes('ambiguous_blank'));
  assert.ok(warn('field_diagram', { variant: 'magnetic_force', field: 'up', charge: { sign: '+', velocity: 'up' } }).includes('ambiguous_blank'));
  const plates = { variant: 'uniform', direction: 'down', charge: { sign: '−' } };
  assert.ok(has(svgOf('field_diagram', plates), 'E') && !has(svgOf('field_diagram', plates), 'F'));
  assert.ok(has(svgOf('field_diagram', { ...plates, charge: { sign: '−', showForce: true } }), 'F'));
  assert.ok(texts(svgOf('field_diagram', { ...plates, separation: { value: 2, show: 'blank' }, voltage: { value: 120 } })).some((t) => t === 'plate separation d = ?'));
  throwsSpec('field_diagram', { variant: 'wire', view: 'cross_section', current: 'out', showCurrent: false, showDirection: false }, /nothing on the figure fixes the direction/);
  assert.ok(has(svgOf('field_diagram', { variant: 'wire', view: 'side', current: 'right' }), 'I'));
});

test('flow_diagram: boxes and arrows in the declared order, blanks, the pyramid, refusals', () => {
  const chain = { variant: 'chain', nodes: [{ id: 'a', label: 'Grass' }, { id: 'b', label: 'Rabbit' }, { id: 'c', label: 'Fox' }], steps: ['eaten by', { label: 'eaten by', blank: true }] };
  const svg = svgOf('flow_diagram', chain);
  assert.ok(has(svg, 'Grass') && has(svg, 'Rabbit') && has(svg, 'Fox') && has(svg, 'eaten by') && has(svg, '?'));
  assert.equal((svg.match(/<polygon /g) ?? []).length, 2, 'one arrowhead per arrow');
  assert.equal(texts(svg).filter((t) => t === 'eaten by').length, 1, 'the blank arrow hides its label');
  const m = flowModel(reader('flow_diagram', chain));
  assert.deepEqual(m.edges.map((e) => [e.from, e.to]), [['a', 'b'], ['b', 'c']]);
  const cyc = flowModel(reader('flow_diagram', { variant: 'cycle', nodes: chain.nodes, steps: [{ sign: '+' }, { sign: '-' }, { sign: '+' }] }));
  assert.deepEqual(cyc.edges.map((e) => [e.from, e.to, e.sign]), [['a', 'b', '+'], ['b', 'c', '−'], ['c', 'a', '+']]);
  const hiddenBox = texts(svgOf('flow_diagram', { ...chain, nodes: [chain.nodes[0], { ...chain.nodes[1], blank: true }, chain.nodes[2]] }));
  assert.ok(!hiddenBox.includes('Rabbit') && hiddenBox.includes('?'));
  const pyr = { variant: 'pyramid', unit: 'kJ', transferPercent: 10, levels: [{ label: 'Producers', value: 20000 }, { label: 'Herbivores', value: 2000, show: 'blank' }, { label: 'Carnivores', value: 200, show: 'none' }] };
  const pt = texts(svgOf('flow_diagram', pyr));
  assert.ok(pt.includes('Producers') && pt.includes('20 000 kJ') && pt.includes('?') && !pt.some((t) => /2 000|200 kJ|10/.test(t.replace('20 000', ''))));
  // The pyramid narrows upwards.
  const widths = [...svgOf('flow_diagram', pyr).matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="([\d.]+)" height="34"/g)].map((x) => [Number(x[1]), Number(x[2])]).sort((a, b) => b[0] - a[0]);
  assert.ok(widths.length === 3 && widths[0][1] > widths[1][1] && widths[1][1] > widths[2][1]);
  throwsSpec('flow_diagram', { variant: 'web', nodes: [{ id: 'a', label: 'A', col: 0, row: 0 }, { id: 'b', label: 'B', col: 1, row: 0 }], edges: [{ from: 'a', to: 'z' }] }, /"z" is not a node/);
  throwsSpec('flow_diagram', { variant: 'web', nodes: [{ id: 'a', label: 'A', col: 0, row: 0 }, { id: 'b', label: 'B', col: 0, row: 0 }], edges: [{ from: 'a', to: 'b' }] }, /two boxes at col 0, row 0/);
  throwsSpec('flow_diagram', { variant: 'chain', nodes: [{ id: 'a', label: 'A' }, { id: 'a', label: 'B' }] }, /id "a" is used twice/);
  throwsSpec('flow_diagram', { variant: 'chain', nodes: chain.nodes, steps: [{ blank: true }] }, /a blank arrow needs the label/);
  throwsSpec('flow_diagram', { variant: 'pyramid', levels: [{ label: 'Only' }] }, /levels must have between 2 and 6/);
  assert.ok(warn('flow_diagram', { variant: 'chain', nodes: [{ id: 'a', label: 'Photosynthesisinthechloroplaststroma' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }, { id: 'd', label: 'D' }] }).includes('crowded'));
  assert.ok(warn('flow_diagram', { variant: 'pyramid', levels: [{ label: 'A', value: 5, show: 'blank' }, { label: 'B' }] }).includes('ambiguous_blank'));
});

test('solid_3d: dimension labels as asked, hidden edges dashed, the composite, the solid of revolution, refusals', () => {
  const cyl = svgOf('solid_3d', { solid: 'cylinder', radius: 3, height: 8, unit: 'cm' });
  assert.ok(has(cyl, '3 cm') && has(cyl, '8 cm'));
  assert.ok(cyl.includes('stroke-dasharray="5 3"'), 'hidden edges are dashed');
  const lab = texts(svgOf('solid_3d', { solid: 'cylinder', radius: 3, height: 8, labels: { radius: 'r', height: '?' } }));
  assert.deepEqual(lab.sort(), ['?', 'r']);
  assert.deepEqual(texts(svgOf('solid_3d', { solid: 'cylinder', radius: 3, height: 8, labels: { radius: null, height: null } })), []);
  // A slant height is printed only when asked for.
  const cone = { solid: 'cone', radius: 5, height: 12 };
  assert.ok(!has(svgOf('solid_3d', cone), '13'));
  assert.ok(has(svgOf('solid_3d', { ...cone, labels: { slant: 'auto' } }), '13'));
  near(solidModel(reader('solid_3d', cone)).dims.slant, 13);
  near(solidModel(reader('solid_3d', { solid: 'composite', bottom: 'prism', top: 'pyramid', base: 6, height: 4, topHeight: 4 })).dims.slant, 5);
  for (const solid of ['prism', 'triangular_prism', 'sphere', 'hemisphere', 'pyramid']) {
    const params = { solid, length: 4, width: 3, height: 5, base: 4, radius: 3 } as Params;
    const allowed = { prism: ['length', 'width', 'height'], triangular_prism: ['base', 'height', 'length'], sphere: ['radius'], hemisphere: ['radius'], pyramid: ['base', 'height'] }[solid] as string[];
    const clean = Object.fromEntries(Object.entries(params).filter(([k]) => k === 'solid' || allowed.includes(k)));
    assert.equal(texts(svgOf('solid_3d', clean)).length, allowed.length, solid);
    assert.deepEqual(warn('solid_3d', clean), [], solid);
  }
  assert.ok(has(svgOf('solid_3d', { ...cone, notToScale: true }), 'not to scale'));
  throwsSpec('solid_3d', { solid: 'torus' }, /solid must be one of/);
  throwsSpec('solid_3d', { solid: 'cylinder', radius: 3 }, /height must be a finite number/);
  throwsSpec('solid_3d', { solid: 'cylinder', radius: 3, height: 8, labels: { slant: 'auto' } }, /no such dimension/);
  throwsSpec('solid_3d', { solid: 'composite', bottom: 'prism', top: 'cone', base: 4, height: 4, topHeight: 3 }, /top must be 'pyramid' on a prism/);
  assert.ok(warn('solid_3d', { solid: 'cylinder', radius: 3, height: 8, labels: { radius: 'r', height: '?' } }).includes('ambiguous_blank'));
  assert.ok(warn('solid_3d', { solid: 'cylinder', radius: 0.5, height: 40 }).includes('crowded'));
  // Solid of revolution: exact volumes (washers, disks, shells).
  const rev = (params: Params) => revolutionVolume(solidModel(reader('solid_3d', { solid: 'revolution', ...params })).revolution!);
  assert.deepEqual(rev({ axis: 'x', outer: { poly: [0, 1], sqrt: true }, inner: { poly: [0, 0, 1] }, from: 0, to: 1 }), { num: 3, den: 10 });
  assert.deepEqual(rev({ axis: 'x', outer: { poly: [0, 0, 1] }, from: 0, to: 2 }), { num: 32, den: 5 });
  assert.deepEqual(rev({ axis: 'y', outer: { poly: [0, 0, 1] }, from: 0, to: 2 }), { num: 8, den: 1 });
  assert.deepEqual(rev({ axis: 'x', outer: { poly: [3] }, from: 0, to: 5 }), { num: 45, den: 1 }, 'a cylinder of radius 3 and height 5');
  assert.equal(rev({ axis: 'y', outer: { poly: [0, 1], sqrt: true }, from: 0, to: 4 }), null);
  const rs = fx('solid-revolution-washer');
  const rt = texts(renderPracticeFigure(rs).svg);
  assert.ok(rt.includes('y = √x') && rt.includes('y = x²') && rt.includes('x') && rt.includes('y') && !rt.some((t) => t.includes('π')));
  throwsSpec('solid_3d', { solid: 'revolution', axis: 'x', outer: { poly: [0, 0, 1] }, inner: { poly: [0, 1], sqrt: true }, from: 0, to: 1 }, /outer ≥ inner ≥ 0 is needed/);
  throwsSpec('solid_3d', { solid: 'revolution', axis: 'y', outer: { poly: [1] }, from: -1, to: 1 }, /must not be negative/);
  throwsSpec('solid_3d', { solid: 'revolution', axis: 'z', outer: { poly: [1] }, from: 0, to: 1 }, /axis must be 'x' or 'y'/);
});

test('spectrum: values only as asked, the reversed logarithmic PES axis, line strips, the calibration line, refusals', () => {
  const mass = { variant: 'mass', peaks: [{ mz: 63, abundance: 69.2 }, { mz: 65, abundance: 30.8 }] };
  const svg = svgOf('spectrum', mass);
  assert.ok(has(svg, 'm/z') && has(svg, 'Relative abundance (%)') && has(svg, '63') && has(svg, '65'));
  assert.ok(!texts(svg).some((t) => /69\.2|30\.8/.test(t)), 'abundances are not printed');
  assert.ok(texts(svgOf('spectrum', { ...mass, showValues: true })).includes('69.2'));
  assert.equal((svg.match(/<rect [^>]*fill="#111827"\/>/g) ?? []).length, 2, 'one bar per peak');
  throwsSpec('spectrum', { variant: 'mass', peaks: [{ mz: 63, abundance: 1 }, { mz: 63, abundance: 2 }] }, /two peaks at m\/z 63/);
  throwsSpec('spectrum', { ...mass, yMax: 50 }, /yMax is below the tallest peak/);
  assert.ok(warn('spectrum', { variant: 'mass', peaks: Array.from({ length: 9 }, (_, i) => ({ mz: 100 + i, abundance: 10 + i })) }).includes('too_many_elements'));
  // PES: sorted by decreasing energy, and drawn that way from the left.
  const pes = { variant: 'pes', peaks: [{ energy: 0.5, electrons: 1 }, { energy: 104, electrons: 2 }, { energy: 3.67, electrons: 6 }, { energy: 6.84, electrons: 2 }] };
  const pm = spectrumModel(reader('spectrum', pes));
  assert.ok(pm.variant === 'pes' && pm.peaks.map((p) => p.energy).join() === '104,6.84,3.67,0.5');
  const ps = svgOf('spectrum', pes);
  const xOf = (s: string) => Number(new RegExp(`<text x="([\\d.]+)"[^>]*>${s}</text>`).exec(ps)?.[1]);
  assert.ok(xOf('1000') < xOf('100') && xOf('100') < xOf('10') && xOf('10') < xOf('1') && xOf('1') < xOf('0\\.1'), 'the axis increases to the left');
  assert.ok(xOf('104') < xOf('6\\.84') && xOf('6\\.84') < xOf('3\\.67') && xOf('3\\.67') < xOf('0\\.5'));
  assert.ok(!texts(svgOf('spectrum', { ...pes, showEnergies: false })).includes('104'));
  assert.ok(!texts(ps).includes('6') && texts(svgOf('spectrum', { ...pes, yNumbers: true })).includes('6'), 'electron counts are numbered only when asked');
  throwsSpec('spectrum', { variant: 'pes', peaks: [{ energy: 3.67, electrons: 6 }, { energy: 3.5, electrons: 2 }] }, /too close to draw as two peaks/);
  throwsSpec('spectrum', { variant: 'pes', peaks: [{ energy: 3.67, electrons: 12 }] }, /whole number from 1 to 10/);
  // Line spectra.
  const lines = { variant: 'lines', rows: [{ label: 'Unknown', lines: [656, 486] }, { label: 'Dark', lines: [589], kind: 'absorption' }] };
  const ls = svgOf('spectrum', lines);
  assert.ok(has(ls, 'Unknown') && has(ls, 'Dark') && has(ls, 'Wavelength (nm)') && has(ls, '400') && has(ls, '700'));
  assert.ok(ls.includes('fill="#374151"'), 'an absorption strip is dark');
  assert.ok(!texts(ls).some((t) => /656|486|589/.test(t)), 'wavelengths are not printed');
  throwsSpec('spectrum', { variant: 'lines', rows: [{ label: 'X', lines: [800] }] }, /outside the range 400–700/);
  assert.ok(warn('spectrum', { variant: 'lines', rows: [{ label: 'X', lines: [589, 589.6] }] }).includes('crowded'));
  // Calibration line.
  const cal = { variant: 'absorbance', slope: 1.5, xMax: 0.5, sample: { absorbance: 0.6 } };
  const cs = svgOf('spectrum', cal);
  assert.ok(has(cs, 'Absorbance') && has(cs, 'Concentration (mol/L)') && has(cs, 'sample'));
  assert.ok(!has(svgOf('spectrum', { ...cal, sample: { absorbance: 0.6, guide: false } }), 'sample'));
  // The guide stops at the line: it is never dropped to the concentration axis.
  assert.equal((cs.match(/stroke-dasharray="5 3"/g) ?? []).length, 1);
  assert.ok(/<path d="M[\d.]+,[\d.]+H[\d.]+" [^>]*stroke-dasharray="5 3"/.test(cs));
  throwsSpec('spectrum', { ...cal, sample: { absorbance: 2 } }, /off the calibration line/);
  throwsSpec('spectrum', { variant: 'nmr' }, /variant must be one of/);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
