/**
 * Practice-figure renderer — batch 5, part "fixes-math": what the fixes a, d
 * and j draw, hide, refuse and warn about (k is a checker fix: its fixture is
 * the slope field its tests use — scripts/practice-extend/figure-core.test.ts).
 *   a  conic_graph: a marked point under another name (`names`), one-letter
 *      names as numerals (`letterLabels`);
 *   d  distribution_curve: a bound between two ticks is printed only when
 *      asked (`boundLabels`), default not;
 *   j  solid_3d: the frustum of a pyramid (a new variant: `solid-frustum-`).
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-fixes-math.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { renderPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { conicModel } from '../src/lib/tutor/practice-figure/kinds/conic';
import { boundText, distributionModel } from '../src/lib/tutor/practice-figure/kinds/distribution';
import { solidModel } from '../src/lib/tutor/practice-figure/kinds/solid-3d';
import { FIGURE_FIXTURES } from './lib/practice-figure-fixtures';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-fixes-math';
import { count, fixtureInvariants, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const P = (id: string): Params => fx(id).params;
const svg = (id: string): string => svgOf(fx(id).type, P(id));
const sha = (spec: PracticeFigureSpec): string => createHash('sha256').update(renderPracticeFigure(spec).svg).digest('hex');
const PINS = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'practice-figure-pins-b85c7ae5.json'), 'utf8')) as Record<string, string>;
const BLANK_BOX = /stroke-dasharray="3 2"/g;
const DASHED = /stroke-dasharray="5 3"/g;

console.log('\nEvery fixture of the part:\n');

fixtureInvariants(test, FIXTURES, { 'solid_3d (frustum of a pyramid)': 'solid-frustum-' }, ['a', 'd', 'j', 'k'], 'fix5');

console.log('\na — conic_graph, marks under other names:\n');

const circle = (extra: Params = {}, top: Params = {}): Params => ({ xRange: [-4, 8], yRange: [-6, 4], conics: [{ type: 'circle', center: [2, -1], radius: 4, show: { center: 'mark' }, ...extra }], ...top });

test('a: without names / letterLabels every conic fixture of b85c7ae5 is byte-identical (40 production rows are conics)', () => {
  const conics = FIGURE_FIXTURES.filter((f) => f.spec.type === 'conic_graph' && f.id in PINS);
  assert.ok(conics.length >= 13, `${conics.length} conic fixtures`);
  for (const f of conics) assert.equal(sha(f.spec), PINS[f.id], f.id);
  assert.deepEqual(texts(svgOf('conic_graph', circle())).filter((t) => /^[A-Z]$/.test(t)), ['C']);
});

test('a: names — the centre, a parabola\'s vertex and focus, the vertices / co-vertices / foci each print the name given', () => {
  assert.deepEqual(texts(svg('fix5-a-conic-centre-named')).filter((t) => /^[A-Z]$/.test(t)).sort(), ['O', 'P']);
  const t = texts(svgOf('conic_graph', { xRange: [-7, 7], yRange: [-5, 5], conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { center: 'mark', vertices: 'mark', coVertices: 'mark', foci: 'value' }, names: { center: 'M', vertices: ['P', 'Q'], coVertices: ['R', 'S'], foci: ['G', 'H'] } }] }));
  for (const n of ['M', 'P', 'Q', 'R', 'S', 'G (−4, 0)', 'H (4, 0)']) assert.ok(t.includes(n), `${n} in ${t.join(' | ')}`);
  for (const n of ['C', 'V₁', 'B₂', 'F₁ (−4, 0)']) assert.ok(!t.includes(n), n);
  const par = texts(svgOf('conic_graph', { xRange: [-6, 6], yRange: [-3, 7], conics: [{ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { vertex: 'mark', focus: 'blank' }, names: { vertex: 'T', focus: 'S' } }] }));
  assert.ok(par.includes('T') && par.includes('S') && par.includes('?') && !par.includes('V') && !par.includes('F'), par.join(' | '));
  const m = conicModel(reader('conic_graph', P('fix5-a-conic-centre-named')));
  assert.equal(m.conics[0].center?.name, 'O');
  assert.equal(m.conics[0].center?.coords, '(2, −1)');
});

test('a: names — refused with the param named: an unknown point, a name too long, one name for a pair, two marks sharing a name', () => {
  throwsSpec('conic_graph', circle({ names: { vertex: 'T' } }), /conics\[0\]\.names\.vertex: a circle has no such named point — one of center/);
  throwsSpec('conic_graph', circle({ names: { center: 'Centre' } }), /conics\[0\]\.names\.center is longer than 4 characters/);
  throwsSpec('conic_graph', circle({ names: { center: '' } }), /conics\[0\]\.names\.center must be a non-empty string/);
  throwsSpec('conic_graph', circle({ names: 'O' }), /conics\[0\]\.names must be an object/);
  const ell = (names: Params, show: Params = { foci: 'mark', center: 'mark' }): Params => ({ xRange: [-7, 7], yRange: [-5, 5], conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show, names }] });
  throwsSpec('conic_graph', ell({ foci: 'P' }), /conics\[0\]\.names\.foci must be two names/);
  throwsSpec('conic_graph', ell({ foci: ['P', 'P'] }), /conics\[0\]\.names\.foci: the two names must differ/);
  throwsSpec('conic_graph', ell({ foci: ['P', 'C'] }), /conics\[0\]\.names: the name "C" is used for two marked points/);
  // A name that is not drawn cannot collide.
  assert.doesNotThrow(() => svgOf('conic_graph', ell({ foci: ['P', 'C'] }, { foci: 'mark' })));
});

test('a: letterLabels — every one-capital-letter name becomes 1, 2, 3 … (I, II, III …) in drawing order; longer names stay; a bad value is refused', () => {
  assert.deepEqual(texts(svg('fix5-a-conic-numerals')).filter((t) => /^[A-Z]$|^\d$/.test(t) && !/^[0-9]$/.test(t)), []);
  const m = conicModel(reader('conic_graph', P('fix5-a-conic-numerals')));
  assert.deepEqual([m.conics[0].vertices[0].name, m.conics[0].foci[0].name, m.points[0].label], ['1', '2', '3']);
  const r = conicModel(reader('conic_graph', P('fix5-a-conic-foci-named-roman')));
  assert.deepEqual([r.conics[0].center?.name, ...r.conics[0].foci.map((q) => q.name)], ['I', 'II', 'III']);
  const romans = texts(svg('fix5-a-conic-foci-named-roman')).filter((t) => /^[IVX]+$/.test(t));
  assert.deepEqual(romans.sort(), ['I', 'II', 'III']);
  // Two-character names (V₁, F₂) are not option letters and stay as they are; a line's and a legend's one-letter label is renamed too.
  const t = texts(svgOf('conic_graph', { xRange: [-7, 7], yRange: [-5, 5], letterLabels: 'numerals', conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, label: 'E', show: { vertices: 'mark' } }], lines: [{ slope: 0, intercept: 4, label: 'L' }], points: [{ x: 0, y: 3, label: 'B' }, { x: 3, y: 2.4, label: 'P₁' }] }));
  assert.ok(t.includes('V₁') && t.includes('V₂') && t.includes('P₁') && !t.some((x) => /^[A-Z]$/.test(x)), t.join(' | '));
  for (const n of ['1', '2', '3']) assert.ok(t.includes(n), `${n} in ${t.join(' | ')}`);
  // The same letter keeps one numeral (two circles both marked C).
  const two = conicModel(reader('conic_graph', { xRange: [-8, 8], yRange: [-6, 6], letterLabels: 'roman', conics: [{ type: 'circle', center: [-3, 0], radius: 2, show: { center: 'mark' } }, { type: 'circle', center: [3, 0], radius: 2, show: { center: 'mark' } }] }));
  assert.deepEqual(two.conics.map((c) => c.center?.name), ['I', 'I']);
  throwsSpec('conic_graph', circle({}, { letterLabels: 'greek' }), /letterLabels must be one of numerals, roman/);
});

console.log('\nd — distribution_curve, the label of a bound between two ticks:\n');

/** The picture without its clip-path ids (they are a hash of the whole spec, so one more param changes them). */
const dist = (params: Params): string => svgOf('distribution_curve', params).replace(/pf[0-9a-z]+-shade/g, 'ID-shade');

test('d: by default a bound between two ticks prints nothing — no value, no second row, no leader under the axis; the firm bound line stays', () => {
  const hidden = dist(P('fix5-d-bound-hidden-by-default'));
  assert.ok(!texts(hidden).includes('1.25'), texts(hidden).join(' | '));
  const given = dist({ ...P('fix5-d-bound-hidden-by-default'), boundLabels: 'value' });
  assert.ok(texts(given).includes('1.25'));
  const height = (s: string): number => Number(/viewBox="0 0 360 (\d+)"/.exec(s)?.[1]);
  assert.ok(height(hidden) < height(given), 'the row for the bound label is not reserved');
  assert.equal(count(hidden, /stroke="#1d4ed8" stroke-width="2"\/>/g), 1, 'the bound itself is drawn');
  assert.equal(count(hidden, /stroke="#1d4ed8" stroke-width="1\.2"\/>/g), 0, 'no leader down to a label');
  assert.equal(count(given, /stroke="#1d4ed8" stroke-width="1\.2"\/>/g), 1);
  assert.deepEqual(warn('distribution_curve', P('fix5-d-bound-hidden-by-default')), []);
});

test('d: boundLabels — value (as before this round), blank (a "?" box), none; a bound ON a tick and a labelled bound are untouched by it', () => {
  const blank = svg('fix5-d-bound-blank');
  assert.equal(count(blank, BLANK_BOX), 1);
  assert.ok(texts(blank).includes('?') && !texts(blank).some((t) => /87/.test(t)));
  assert.deepEqual(texts(svg('fix5-d-bound-value')).filter((t) => t === '166' || t === '182'), ['166', '182']);
  const m = distributionModel(reader('distribution_curve', P('fix5-d-bound-value')));
  assert.equal(boundText(m, m.shade[0], 166), '166');
  assert.equal(boundText({ ...m, boundLabels: 'none' }, m.shade[0], 166), '');
  assert.equal(boundText({ ...m, boundLabels: 'blank' }, m.shade[0], 166), '?');
  assert.equal(boundText({ ...m, boundLabels: 'blank' }, m.shade[0], 178), '', 'a bound on a tick is read off the axis');
  assert.equal(boundText({ ...m, boundLabels: 'none' }, { ...m.shade[0], label: 'k' }, 166), 'k');
  // On a tick: the three settings draw the same picture. With a label: likewise.
  const onTick = (b?: string): string => dist({ axis: 'z', shade: [{ from: -1, to: 2 }], ...(b ? { boundLabels: b } : {}) });
  assert.equal(onTick('value'), onTick());
  assert.equal(onTick('blank'), onTick());
  const labelled = (b?: string): string => dist({ mean: 70, sd: 5, axis: 'none', shade: [{ from: 79.8, to: null, label: '?' }], ...(b ? { boundLabels: b } : {}) });
  assert.equal(labelled('none'), labelled());
  assert.equal(labelled('blank'), labelled());
  // z axis: the value is the z-score.
  assert.ok(texts(dist({ mean: 100, sd: 15, axis: 'z', shade: [{ from: null, to: 122.5 }], boundLabels: 'value' })).includes('1.5'));
});

test('d: what the new default changes among the fixtures of b85c7ae5 — exactly the two whose unlabelled bounds fall between ticks; with boundLabels "value" they are the old bytes', () => {
  const all = FIGURE_FIXTURES.filter((f) => f.spec.type === 'distribution_curve' && f.id in PINS);
  assert.deepEqual(all.filter((f) => sha(f.spec) !== PINS[f.id]).map((f) => f.id), ['normal-x-two-tails-area', 'polish-normal-tail-beyond-2-sigma']);
  // Every other one draws the same picture whatever boundLabels says; the two print their bounds again with 'value'.
  for (const f of all.filter((x) => sha(x.spec) === PINS[x.id] && x.spec.params.axis !== 'sigma' && x.spec.params.axis !== 'none')) assert.equal(dist({ ...f.spec.params, boundLabels: 'value' }), dist(f.spec.params), f.id);
  const tails = all.find((f) => f.id === 'normal-x-two-tails-area') ?? assert.fail('missing');
  assert.ok(!texts(dist(tails.spec.params)).some((t) => t === '350' || t === '650'));
  assert.deepEqual(texts(dist({ ...tails.spec.params, boundLabels: 'value' })).filter((t) => t === '350' || t === '650'), ['350', '650']);
  const strip = all.find((f) => f.id === 'polish-normal-tail-beyond-2-sigma') ?? assert.fail('missing');
  assert.ok(!texts(dist(strip.spec.params)).includes('−2.5') && texts(dist({ ...strip.spec.params, boundLabels: 'value' })).includes('−2.5'));
});

test('d: refused — a boundLabels that is not one of the three; "value" on an axis that carries no numbers', () => {
  throwsSpec('distribution_curve', { shade: [{ from: 0.5, to: null }], boundLabels: 'hide' }, /boundLabels must be one of value, blank, none/);
  throwsSpec('distribution_curve', { axis: 'sigma', shade: [{ from: 0.5, to: null }], boundLabels: 'value' }, /boundLabels: 'value' needs a numbered axis .* give the bound a label instead/);
  assert.doesNotThrow(() => dist({ axis: 'sigma', shade: [{ from: 0.5, to: null }], boundLabels: 'blank' }));
});

console.log('\nj — solid_3d, the frustum of a pyramid:\n');

const frustum = (p: Params): Params => ({ solid: 'pyramid_frustum', ...p });

test('j: the model — square faces by default, rectangles of one shape with `width`; the slant heights from the height and half the differences', () => {
  const sq = solidModel(reader('solid_3d', P('solid-frustum-blank-height')));
  near(sq.dims.slant, 10);
  near(sq.dims.slantSide, 10);
  assert.equal(sq.dims.topWidth, undefined);
  assert.deepEqual(sq.labels, { base: '16 m', topBase: '4 m', height: '?', slant: '10 m' });
  const rect = solidModel(reader('solid_3d', P('solid-frustum-dense-rectangular')));
  near(rect.dims.topWidth, 4);
  near(rect.dims.slant, Math.sqrt(20));
  near(rect.dims.slantSide, 5);
  assert.deepEqual(rect.labels, { base: '12 cm', topBase: '6 cm', height: '4 cm', width: '8 cm', slant: '4.47 cm', topWidth: '4 cm' });
  assert.equal(rect.hiddenEdges, 'few', 'with the slant height drawn the far edges are left out by default');
  assert.equal(solidModel(reader('solid_3d', P('solid-frustum-simple'))).hiddenEdges, 'all');
});

test('j: the drawing — three faces in solid lines, the three far edges dashed (or left out), every label value / "?" / text / hidden', () => {
  const simple = svg('solid-frustum-simple');
  assert.deepEqual(texts(simple).sort(), ['3 cm', '4 cm', '6 cm']);
  assert.equal(count(simple, DASHED), 1, 'one dashed path: the hidden edges and the axis');
  const hiddenPath = /<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1\.2" stroke-dasharray="5 3"\/>/.exec(simple)?.[1] ?? '';
  assert.equal((hiddenPath.match(/M/g) ?? []).length, 4, 'three far edges and the height axis');
  const few = svg('fix5-j-pyramid-frustum-few-edges');
  assert.equal((/<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1\.2" stroke-dasharray="5 3"\/>/.exec(few)?.[1].match(/M/g) ?? []).length, 1, 'only the height axis');
  assert.deepEqual(texts(few).sort(), ['4 cm', '6 cm', 'x']);
  const blank = svg('solid-frustum-blank-height');
  assert.equal(count(blank, BLANK_BOX), 1);
  assert.deepEqual(texts(blank).sort(), ['10 m', '16 m', '4 m', '?']);
  assert.ok(!texts(blank).includes('8 m'), 'the hidden height is nowhere');
  assert.deepEqual(texts(svg('solid-frustum-dense-rectangular')).sort(), ['12 cm', '4 cm', '4 cm', '4.47 cm', '6 cm', '8 cm', 'not to scale']);
  assert.deepEqual(texts(svgOf('solid_3d', frustum({ base: 6, topBase: 3, height: 4, labels: { base: null, topBase: null, height: 'h' } }))), ['h']);
  // No height label: no axis, no dimension line.
  assert.equal(count(svgOf('solid_3d', frustum({ base: 6, topBase: 3, height: 4, hiddenEdges: 'few', labels: { height: null } })), /stroke="#4b5563"/g), 0);
});

test('j: refused with the param named; a flat or needle-topped frustum warns; the cone frustum and every earlier solid are untouched', () => {
  throwsSpec('solid_3d', frustum({ base: 6, topBase: 6, height: 4 }), /topBase: equal to base — that is a prism, not a frustum/);
  throwsSpec('solid_3d', frustum({ base: 3, topBase: 6, height: 4 }), /topBase: larger than base .* \(swap base and topBase\)/);
  throwsSpec('solid_3d', frustum({ base: 6, height: 4 }), /topBase must be a finite number/);
  throwsSpec('solid_3d', frustum({ base: 6, topBase: 3, height: 4, width: -2 }), /width must be greater than 0/);
  throwsSpec('solid_3d', frustum({ base: 6, topBase: 3, height: 4, labels: { topWidth: 'auto' } }), /labels\.topWidth: this solid has no such dimension \(base, topBase, height, slant\)/);
  throwsSpec('solid_3d', frustum({ base: 6, topBase: 3, height: 4, labels: { radius: 'r' } }), /labels\.radius: this solid has no such dimension/);
  throwsSpec('solid_3d', { solid: 'wedge' }, /solid must be one of .*frustum, pyramid_frustum/);
  assert.deepEqual(warn('solid_3d', frustum({ base: 20, topBase: 16, height: 1.5 })), ['crowded']);
  assert.deepEqual(warn('solid_3d', frustum({ base: 20, topBase: 1, height: 20 })), ['crowded']);
  assert.deepEqual(warn('solid_3d', frustum({ base: 6, topBase: 3, height: 4, labels: { base: 'a', topBase: 'b', height: 'h' } })), ['ambiguous_blank']);
  for (const f of FIGURE_FIXTURES.filter((x) => x.spec.type === 'solid_3d' && x.id in PINS)) assert.equal(sha(f.spec), PINS[f.id], f.id);
});

void finish();
