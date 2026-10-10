/**
 * Practice-figure renderer — batch 3 (2026-10-12): molecular_structure,
 * gel_electrophoresis (and its amplification_plot variant), bio_schematic,
 * schematic_map, the bar-magnet variant of field_diagram, and the fixes a–f
 * of the third round (src/lib/tutor/practice-figure/kinds/).
 *
 * Under test:
 *   - nothing that was there changed unasked: all 129 fixtures of 9613fe5e are
 *     pinned (scripts/lib/practice-figure-pins-9613fe5e.json); the ones this
 *     round redrew are listed one by one, each with the fix (a–f) it was
 *     redrawn for, in practice-figure-changes-since-9613fe5e.json;
 *   - every new kind or variant has ≥ 3 fixtures (simple, dense, a "?" blank),
 *     each within the pinned client vocabulary, no type under 10 px at 340 px,
 *     clean under `checkFigureLegibility` unless its note says "warns", and
 *     UNALTERED by the academy client's own sanitiser under jsdom;
 *   - per kind: what is drawn, what each option hides, the model behind the
 *     picture, the refusals and the kind's own legibility warnings;
 *   - per fix: what a reader at 340 px now sees.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:practice-figure-batch3   (npx tsx scripts/test-practice-figure-batch3.ts)
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { BATCH2_FIGURE_KINDS, PracticeFigureSpecError, renderPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { Reader } from '../src/lib/tutor/practice-figure/spec';
import { BATCH3_FIGURE_KINDS } from '../src/lib/tutor/practice-figure/kinds/batch3';
import { formalCharge, moleculeFormula, moleculeModel, vsepr } from '../src/lib/tutor/practice-figure/kinds/molecule';
import { amplification, gelModel } from '../src/lib/tutor/practice-figure/kinds/gel';
import { bioModel, divisionCounts } from '../src/lib/tutor/practice-figure/kinds/bio-schematic';
import { mapModel } from '../src/lib/tutor/practice-figure/kinds/schematic-map';
import { barMagnetModel, magnetFieldAt } from '../src/lib/tutor/practice-figure/kinds/bar-magnet';
import { fieldModel, traceFieldLines } from '../src/lib/tutor/practice-figure/kinds/field-diagram';
import { BATCH3_FIXTURES, FIGURE_FIXTURES } from './lib/practice-figure-fixtures';

let passed = 0;
let failed = 0;
const pending: Array<Promise<void>> = [];
function test(name: string, fn: () => void | Promise<void>): void {
  const done = (e?: unknown) => {
    if (e === undefined) { passed++; console.log(`  ok - ${name}`); } else { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
  };
  try {
    const r = fn();
    if (r instanceof Promise) pending.push(r.then(() => done(), (e) => done(e ?? new Error('rejected'))));
    else done();
  } catch (e) {
    done(e);
  }
}

type Params = Record<string, unknown>;
const svgOf = (type: string, params: Params): string => renderPracticeFigure({ type, params }).svg;
const texts = (svg: string): string[] => [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
  .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
const has = (svg: string, s: string): boolean => texts(svg).includes(s);
const count = (svg: string, re: RegExp): number => (svg.match(re) ?? []).length;
const throwsSpec = (type: string, params: Params, re: RegExp): void => {
  assert.throws(() => renderPracticeFigure({ type, params }), (e: unknown) => e instanceof PracticeFigureSpecError && re.test(e.message), `${type}: ${re}`);
};
const warn = (type: string, params: Params): string[] => checkFigureLegibility({ type, params }).map((w) => w.code);
const reader = (type: string, params: Params): Reader => new Reader(type, params);
const near = (a: number, b: number, tol = 1e-9): void => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);
const fx = (id: string): PracticeFigureSpec => (FIGURE_FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const P = (id: string): Params => fx(id).params;
const LONE_DOT = /<circle [^>]*r="1\.7"/g;

console.log('\nNothing that was there has changed unasked:\n');

const readJson = (name: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', name), 'utf8')) as Record<string, string>;
const sha = (spec: PracticeFigureSpec): string => createHash('sha256').update(renderPracticeFigure(spec).svg).digest('hex');
const BATCH3_IDS = new Set(BATCH3_FIXTURES.map((f) => f.id));

test('all 129 fixtures as they were at 9613fe5e: byte-identical, except exactly the ones listed (with the fix a–f) as redrawn by this round', () => {
  const pins = readJson('practice-figure-pins-9613fe5e.json');
  const redrawn = readJson('practice-figure-changes-since-9613fe5e.json');
  assert.equal(Object.keys(pins).length, 129);
  const before = FIGURE_FIXTURES.filter((f) => !BATCH3_IDS.has(f.id));
  assert.deepEqual(before.map((f) => f.id), Object.keys(pins), 'same fixtures, same order');
  for (const id of Object.keys(redrawn)) {
    assert.ok(id in pins, `${id} is listed as changed but was not a fixture at 9613fe5e`);
    assert.ok(/^[a-f] — /.test(redrawn[id]), `${id}: the reason names the fix (a–f) it was changed for`);
  }
  const changed = before.filter((f) => sha(f.spec) !== pins[f.id]).map((f) => f.id);
  assert.deepEqual(changed, Object.keys(redrawn), 'the fixtures that changed are exactly the listed ones, in fixture order');
});

test('batch 3 is a list of its own: four kinds, none in the earlier lists; bar_magnet is a variant of field_diagram', () => {
  assert.deepEqual([...BATCH3_FIGURE_KINDS], ['molecular_structure', 'gel_electrophoresis', 'bio_schematic', 'schematic_map']);
  for (const k of BATCH3_FIGURE_KINDS) assert.ok(!(BATCH2_FIGURE_KINDS as readonly string[]).includes(k), k);
  throwsSpec('pie_chart', {}, /unknown figure kind .*function_graph.*spectrum.*molecular_structure.*schematic_map/);
  throwsSpec('field_diagram', { variant: 'solenoid' }, /variant must be one of point_charges, uniform, wire, magnetic_force, bar_magnet/);
});

console.log('\nEvery batch-3 fixture:\n');

const rendered = new Map<string, string>(BATCH3_FIXTURES.map((f) => [f.id, renderPracticeFigure(f.spec).svg]));
const PINNED_ELEMENTS = ['circle', 'clipPath', 'defs', 'g', 'line', 'marker', 'path', 'polygon', 'rect', 'svg', 'text', 'tspan'];
const PINNED_ATTRS = ['clip-path', 'cx', 'cy', 'd', 'dominant-baseline', 'dy', 'fill', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'id', 'marker-end', 'markerHeight', 'markerWidth', 'orient', 'paint-order', 'points', 'preserveAspectRatio', 'r', 'refX', 'refY', 'role', 'rx', 'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'text-anchor', 'transform', 'viewBox', 'width', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2'];
/** New kind or variant → the id prefix of its fixtures. */
const GROUPS: Record<string, string> = {
  molecular_structure: 'mol-', 'gel_electrophoresis (gel)': 'gel-', 'gel_electrophoresis (amplification_plot)': 'amp-',
  'bio_schematic (cell)': 'bio-cell-', 'bio_schematic (membrane)': 'bio-membrane-', 'bio_schematic (division)': 'bio-division-', 'bio_schematic (compartments)': 'bio-compartments-',
  schematic_map: 'map-', 'field_diagram (bar_magnet)': 'magnet-',
};

test('every new kind and variant has ≥ 3 fixtures — a simple one, a dense one, and one with a blank "?" that the figure shows; every fix a–f has one', () => {
  for (const [what, prefix] of Object.entries(GROUPS)) {
    const mine = BATCH3_FIXTURES.filter((f) => f.id.startsWith(prefix));
    assert.ok(mine.length >= 3, `${what}: ${mine.length} fixtures`);
    assert.ok(mine.some((f) => /^simple/.test(f.note)), `${what}: a simple fixture`);
    assert.ok(mine.some((f) => /dense/.test(f.note)), `${what}: a dense fixture`);
    const blank = mine.filter((f) => /blank/.test(f.id));
    assert.ok(blank.length >= 1, `${what}: a fixture with a blank`);
    for (const b of blank) assert.ok(texts(rendered.get(b.id) as string).some((t) => t.includes('?')), `${b.id} shows a "?"`);
  }
  const fixes = BATCH3_FIXTURES.filter((f) => f.id.startsWith('fix3-'));
  for (const letter of 'abcdef') assert.ok(fixes.some((f) => f.note.startsWith(`${letter}: `)), `fix ${letter} has a fixture`);
});

test('only the pinned client vocabulary — no <ellipse>, <polyline>, opacity, style, data-*, aria-*, title, pattern, gradient, image, link', () => {
  for (const f of BATCH3_FIXTURES) {
    const svg = rendered.get(f.id) as string;
    for (const m of svg.matchAll(/<([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*\/?>/g)) {
      assert.ok(PINNED_ELEMENTS.includes(m[1]), `${f.id}: element <${m[1]}>`);
      for (const a of m[2].matchAll(/\s([\w:-]+)="/g)) assert.ok(PINNED_ATTRS.includes(a[1]), `${f.id}: attribute ${a[1]} on <${m[1]}>`);
    }
    assert.ok(!/opacity|<style|<title|<desc|data-|aria-|href|<pattern|Gradient|<image|<use/.test(svg), f.id);
    assert.ok(/^<svg [^>]*viewBox="0 0 360 \d+" role="img"/.test(svg) && svg.includes('fill="#ffffff"/>'), `${f.id}: root viewBox, role and white background`);
  }
});

test('no type under 10 px at 340 px (a lowered subscript letter apart)', () => {
  for (const f of BATCH3_FIXTURES) {
    const sizes = [...(rendered.get(f.id) as string).matchAll(/<(?:text|tspan)\b[^>]*\sfont-size="([\d.]+)"/g)].map((m) => Number(m[1])).filter((s) => s !== 8);
    assert.ok(sizes.length > 0 && (Math.min(...sizes) * 340) / 360 >= 10, `${f.id}: ${Math.min(...sizes)}`);
  }
});

test('every fixture is clean under checkFigureLegibility unless its note says it warns', () => {
  for (const f of BATCH3_FIXTURES) {
    const w = checkFigureLegibility(f.spec);
    if (/warns/.test(f.note)) assert.ok(w.length > 0, `${f.id} should warn`);
    else assert.deepEqual(w, [], `${f.id}: ${w.map((x) => `${x.code}: ${x.message}`).join(' | ')}`);
  }
});

const ACADEMY = '/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot';
test("the academy client's own sanitiser (apps/web/lib/figure-svg.ts, unaltered, under jsdom) passes every fixture without altering it", async () => {
  if (!fs.existsSync(path.join(ACADEMY, 'apps/web/lib/figure-svg.ts'))) {
    console.log('    (skipped: the academy worktree is not on this machine)');
    return;
  }
  const req = createRequire(path.join(ACADEMY, 'package.json'));
  const { JSDOM } = req('jsdom') as { JSDOM: new (html: string) => { window: Record<string, unknown> } };
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  const g = globalThis as Record<string, unknown>;
  for (const k of ['document', 'DOMParser', 'Node', 'Element', 'NodeFilter', 'HTMLTemplateElement', 'DocumentFragment', 'NamedNodeMap', 'HTMLFormElement']) g[k] = dom.window[k];
  g.window = dom.window;
  const client = (await import(path.join(ACADEMY, 'apps/web/lib/figure-svg.ts'))) as { inspectFigureSvg(svg: string): { svg: string } | { problem: string } };
  for (const f of FIGURE_FIXTURES) {
    const res = client.inspectFigureSvg(renderPracticeFigure(f.spec).svg);
    assert.ok(!('problem' in res), `${f.id}: ${'problem' in res ? res.problem : ''}`);
  }
});

console.log('\nmolecular_structure:\n');

test('molecular_structure: atoms, bonds by order, lone pairs as pairs of dots, formal charges computed from the structure', () => {
  const water = rendered.get('mol-lewis-water') as string;
  assert.deepEqual(texts(water).sort(), ['H', 'H', 'O']);
  assert.equal(count(water, LONE_DOT), 4, 'two lone pairs = four dots');
  const m = moleculeModel(reader('molecular_structure', P('mol-lewis-water')));
  const [o, h1, h2] = m.molecules[0].atoms;
  // The named layout: bent at 104.5°, both bonds one unit long.
  near(Math.hypot(h1.x - o.x, h1.y - o.y), 1, 1e-9);
  const ang = (Math.acos(((h1.x - o.x) * (h2.x - o.x) + (h1.y - o.y) * (h2.y - o.y))) * 180) / Math.PI;
  near(ang, 104.5, 1e-6);
  // Carbonate: C 0, =O 0, −O −1; the charges are drawn (a ringed minus), 8 lone pairs per structure.
  const co3 = moleculeModel(reader('molecular_structure', P('mol-dense-resonance-carbonate')));
  assert.deepEqual(co3.molecules[0].atoms.map((a) => formalCharge(co3.molecules[0], a.id)), [0, 0, -1, -1]);
  assert.deepEqual(co3.molecules[1].atoms.map((a) => formalCharge(co3.molecules[1], a.id)), [0, -1, 0, -1]);
  const svg = rendered.get('mol-dense-resonance-carbonate') as string;
  assert.equal(count(svg, LONE_DOT), 3 * 8 * 2);
  assert.equal(texts(svg).filter((t) => t === '−').length, 6);
  assert.equal(texts(svg).filter((t) => t === '↔').length, 0, 'the resonance arrow is drawn, not a glyph');
  assert.equal(count(svg, /<polygon /g), 4, 'two double-headed arrows');
  assert.ok(has(svg, 'I') && has(svg, 'II') && has(svg, 'III'));
  // A double bond is two parallel strokes, a triple bond three.
  const strokes = (order: number) => count(svgOf('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'N', x: 0, y: 0 }, { id: 'b', el: 'N', x: 1, y: 0 }], bonds: [{ a: 'a', b: 'b', order }] }] }), /<path d="M[^"]*" fill="none" stroke="#111827" stroke-width="1\.8"/g);
  assert.deepEqual([strokes(1), strokes(2), strokes(3)], [1, 2, 3]);
});

test('molecular_structure: every label, lone-pair set, charge and bond order can be hidden or made a "?"', () => {
  const base = (atom: Params = {}, bond: Params = {}, top: Params = {}) => ({ ...top, molecules: [{ atoms: [{ id: 'C', el: 'C', x: 0, y: 0, lonePairs: 1, ...atom }, { id: 'O', el: 'O', x: 1, y: 0, lonePairs: 1 }], bonds: [{ a: 'C', b: 'O', order: 3, ...bond }] }] });
  const full = svgOf('molecular_structure', base());
  assert.ok(has(full, 'C') && has(full, 'O') && has(full, '−') && has(full, '+'));
  assert.equal(count(full, LONE_DOT), 4);
  assert.ok(!has(svgOf('molecular_structure', base({ show: { label: 'none' } })), 'C'));
  assert.ok(has(svgOf('molecular_structure', base({ show: { label: 'blank' } })), '?'));
  assert.equal(count(svgOf('molecular_structure', base({ show: { lonePairs: 'none' } })), LONE_DOT), 2);
  const lpBlank = svgOf('molecular_structure', base({ show: { lonePairs: 'blank' } }));
  assert.ok(count(lpBlank, LONE_DOT) === 2 && has(lpBlank, '?'));
  assert.ok(!has(svgOf('molecular_structure', base({ show: { charge: 'none' } })), '−'));
  const chBlank = svgOf('molecular_structure', base({ show: { charge: 'blank' } }));
  assert.ok(has(chBlank, '?') && !has(chBlank, '−') && has(chBlank, '+'));
  assert.equal(count(svgOf('molecular_structure', base({}, {}, { showLonePairs: false })), LONE_DOT), 0);
  assert.ok(!has(svgOf('molecular_structure', base({}, {}, { showFormalCharges: false })), '+'));
  const boBlank = svgOf('molecular_structure', base({}, { show: 'blank' }));
  assert.ok(has(boBlank, '?') && count(boBlank, /stroke-width="1\.8"/g) === 1, 'a "?" bond is one (dashed) stroke with a box on it');
  const blanked = rendered.get('mol-blank-formal-charge-candidates') as string;
  assert.equal(texts(blanked).filter((t) => t === '?').length, 1);
  assert.equal(texts(blanked).filter((t) => t === '−').length, 1, 'only structure B shows its charge (on N)');
});

test('molecular_structure: wedge and dash, skeletal carbons, condensed hydrogens, group outlines, partial charges, dipoles, hydrogen bonds', () => {
  const tet = rendered.get('mol-tetrahedral-wedge-dash') as string;
  assert.equal(count(tet, /<polygon /g), 1, 'one solid wedge');
  assert.equal(count(tet, /<path d="(?:M[^M"]*){5,}" fill="none" stroke="#111827" stroke-width="1\.5"\/>/g), 1, 'one dashed (hashed) wedge');
  assert.deepEqual(texts(tet).sort(), ['Br', 'C', 'Cl', 'F', 'H']);
  const sk = rendered.get('mol-skeletal-functional-groups') as string;
  assert.ok(!has(sk, 'C') && has(sk, 'NH₂') && has(sk, 'OH') && has(sk, 'O') && has(sk, 'X') && has(sk, 'Y'));
  assert.equal(count(sk, /<rect [^>]*rx="9"[^>]*stroke-dasharray="5 3"/g), 2, 'two dashed outlines');
  const sm = moleculeModel(reader('molecular_structure', P('mol-skeletal-functional-groups')));
  assert.equal(moleculeFormula(sm.molecules[0]), 'C3H7NO2');
  const hb = rendered.get('mol-hbond-water-pair') as string;
  assert.equal(texts(hb).filter((t) => t === 'δ+').length, 3);
  assert.equal(texts(hb).filter((t) => t === 'δ−').length, 2);
  assert.equal(count(hb, /stroke-dasharray="1\.5 3\.5"/g), 1, 'one dotted hydrogen bond');
  assert.equal(count(hb, /<polygon /g), 1, 'one dipole arrowhead');
});

test('molecular_structure: VSEPR from the structure; refusals name the param; no layout is guessed from a formula', () => {
  const tm = moleculeModel(reader('molecular_structure', P('mol-tetrahedral-wedge-dash')));
  assert.deepEqual(vsepr(tm.molecules[0], 'C'), { steric: 4, lonePairs: 0, electron: 'tetrahedral', molecular: 'tetrahedral', hybridisation: 'sp3' });
  const wm = moleculeModel(reader('molecular_structure', P('mol-lewis-water')));
  assert.deepEqual(vsepr(wm.molecules[0], 'O'), { steric: 4, lonePairs: 2, electron: 'tetrahedral', molecular: 'bent', hybridisation: 'sp3' });
  throwsSpec('molecular_structure', { formula: 'H2O' }, /formula: .*not laid out from a formula.*atoms/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O' }, { id: 'b', el: 'H', x: 1, y: 0 }], bonds: [{ a: 'a', b: 'b' }] }] }, /molecules\[0\]\.atoms\[0\] \("a"\) has no position/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0 }, { id: 'a', el: 'H', x: 1, y: 0 }], bonds: [] }] }, /"a" is used twice/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0 }, { id: 'b', el: 'H', x: 1, y: 0 }], bonds: [{ a: 'a', b: 'z' }] }] }, /bonds\[0\]\.b: "z" is not one of the atoms/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0 }, { id: 'b', el: 'H', x: 0.1, y: 0 }], bonds: [] }] }, /are drawn on top of each other/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0, lonePairs: 3, charge: 1 }, { id: 'b', el: 'H', x: 1, y: 0 }], bonds: [{ a: 'a', b: 'b' }] }] }, /charge is 1 but .* gives −1/);
  throwsSpec('molecular_structure', { molecules: [{ layout: { type: 'tetrahedral', center: 'C', around: ['a', 'b'] }, atoms: [{ id: 'C', el: 'C' }, { id: 'a', el: 'H' }, { id: 'b', el: 'H' }], bonds: [] }] }, /layout\.around must name 4 atoms for tetrahedral/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: Array.from({ length: 14 }, (_, i) => ({ id: `c${i}`, el: 'C', x: i, y: 0 })), bonds: [] }] }, /too wide to draw/);
  throwsSpec('molecular_structure', { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0 }], bonds: [] }], hbonds: [{ from: { mol: 0, atom: 'a' }, to: { mol: 1, atom: 'a' } }] }, /hbonds\[0\]\.to\.mol/);
  // Lone pairs that land on a neighbour are reported, not silently drawn over it.
  const crowded = { molecules: [{ atoms: [{ id: 'a', el: 'O', x: 0, y: 0, lonePairs: 2 }, { id: 'b', el: 'F', x: 1, y: 0, lonePairs: 3 }, { id: 'c', el: 'F', x: 0.7, y: 0.55, lonePairs: 3 }], bonds: [{ a: 'a', b: 'b' }, { a: 'a', b: 'c' }] }] };
  assert.ok(warn('molecular_structure', crowded).includes('crowded'));
});

console.log('\ngel_electrophoresis:\n');

test('gel: bands on a log scale under their wells; size labels only on the ladder; labels can be hidden or "?"', () => {
  const svg = rendered.get('gel-simple-pcr-presence') as string;
  for (const s of ['1000', '750', '500', '250', '100', 'bp', '1', '2', '3']) assert.ok(has(svg, s), s);
  assert.equal(count(svg, /<rect [^>]*fill="#111827"\/>/g), 5 + 2, 'five ladder bands and two sample bands');
  assert.equal(count(svg, /<rect [^>]*fill="#ffffff" stroke="#111827" stroke-width="1"\/>/g), 4, 'a well per lane');
  const m = gelModel(reader('gel_electrophoresis', P('gel-simple-pcr-presence')));
  if (m.variant !== 'gel') assert.fail('variant');
  // Equal ratios are equal distances: 1000→500 is as far as 500→250.
  near(m.position(500) - m.position(1000), m.position(250) - m.position(500), 1e-9);
  assert.ok(m.position(100) > m.position(1000), 'small fragments run further');
  // A sample band's size is never printed unless asked.
  const dense = rendered.get('gel-dense-paternity-six-lanes') as string;
  assert.equal(texts(dense).filter((t) => t === '700').length, 1, 'only the ladder says 700');
  const labelled = svgOf('gel_electrophoresis', { ladder: { sizes: [1000, 500, 100] }, lanes: [{ label: 'S', bands: [{ size: 300, label: 'size' }] }] });
  assert.ok(has(labelled, '300'));
  const blank = rendered.get('gel-blank-ladder-label') as string;
  assert.ok(has(blank, '4') && has(blank, '2') && has(blank, '0.5') && !has(blank, '1') && has(blank, 'kb') && has(blank, 'uncut'));
  assert.equal(texts(blank).filter((t) => t === '?').length, 2);
  const hidden = svgOf('gel_electrophoresis', { ladder: { sizes: [1000, 500, 100], hide: [500], label: null }, lanes: [{ label: null, bands: [500] }] });
  assert.ok(!has(hidden, '500') && !has(hidden, 'Ladder') && has(hidden, '1000'));
  // Thickness.
  assert.ok(/<rect [^>]*height="7" fill="#111827"\/>/.test(blank));
});

test('gel: refusals and warnings', () => {
  throwsSpec('gel_electrophoresis', { ladder: { sizes: [1000] }, lanes: [{ bands: [500] }] }, /ladder\.sizes must have between 2 and 10/);
  throwsSpec('gel_electrophoresis', { ladder: { sizes: [1000, 100] }, lanes: [{ bands: [5000] }] }, /lanes\[0\]\.bands\[0\] \(5000\) is outside the range the ladder spans/);
  throwsSpec('gel_electrophoresis', { ladder: { sizes: [1000, 100] }, lanes: [] }, /lanes must have between 1 and 7/);
  throwsSpec('gel_electrophoresis', { ladder: { sizes: [1000, 100], blank: [300] }, lanes: [{ bands: [500] }] }, /ladder\.blank: 300 is not one of the ladder sizes/);
  throwsSpec('gel_electrophoresis', { variant: 'northern', ladder: { sizes: [1000, 100] }, lanes: [{ bands: [500] }] }, /variant must be one of gel, amplification_plot/);
  assert.ok(warn('gel_electrophoresis', { ladder: { sizes: [1000, 950, 900, 100] }, lanes: [{ label: '1', bands: [500] }] }).includes('crowded'));
  assert.ok(warn('gel_electrophoresis', { ladder: { sizes: [1000, 100] }, lanes: [{ label: '1', bands: [500, 480] }] }).includes('crowded'));
});

test('amplification_plot: each curve crosses the threshold exactly at its Ct, doubling per cycle before it; a control stays flat', () => {
  near(amplification(20, 20, 0.1), 0.1, 1e-12);
  near(amplification(20, 17, 0.1) / amplification(20, 16, 0.1), 2, 0.02);
  assert.ok(amplification(20, 40, 0.1) > 0.99 && amplification(20, 0, 0.1) < 1e-5);
  assert.equal(amplification(null, 30, 0.1), 0);
  const svg = rendered.get('amp-dense-four-samples') as string;
  for (const s of ['P', 'Q', 'R', 'NTC', 'Cycle', 'threshold', '0', '10', '20', '30', '40']) assert.ok(has(svg, s), s);
  // No Ct is printed: "15" and "25" appear once each, as tick numbers on the cycle axis.
  for (const ct of ['15', '25']) assert.equal(texts(svg).filter((t) => t === ct).length, 1, ct);
  assert.ok(!texts(rendered.get('amp-two-samples') as string).some((t) => t === '18' || t === '23'));
  assert.ok(has(rendered.get('amp-two-samples') as string, 'S1'));
  const noLine = svgOf('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'A', ct: 18 }], showThreshold: false });
  assert.ok(!has(noLine, 'threshold'));
  assert.ok(texts(rendered.get('amp-blank-sample-name') as string).includes('?'));
  throwsSpec('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'A', ct: 45 }], cycles: 40 }, /samples\[0\]\.ct must be between 5 and 37/);
  throwsSpec('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'A', ct: 18 }, { label: 'A', ct: 20 }] }, /the label "A" is used twice/);
  assert.ok(warn('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'A', ct: 18.4 }] }).includes('crowded'), 'a Ct between gridlines cannot be read');
  assert.ok(warn('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'A', ct: 18 }, { label: 'B', ct: 18 }] }).includes('crowded'), 'two curves on top of each other');
});

console.log('\nbio_schematic:\n');

test('cell: each organelle is a shape of its own with a leader to its label; nothing names a shape unless the spec does', () => {
  const svg = rendered.get('bio-cell-animal-lettered') as string;
  assert.deepEqual(texts(svg).sort(), ['P', 'Q', 'R', 'S', 'T']);
  const m = bioModel(reader('bio_schematic', P('bio-cell-plant-dense')));
  if (m.variant !== 'cell') assert.fail('variant');
  assert.equal(m.organelles.length, 9);
  assert.deepEqual(texts(rendered.get('bio-cell-plant-dense') as string).sort(), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  const blank = rendered.get('bio-cell-blank-label') as string;
  assert.ok(has(blank, 'nucleus') && has(blank, 'mitochondrion') && has(blank, '?') && !texts(blank).some((t) => /golgi|smooth/i.test(t)));
  // An unlabelled organelle is still drawn (the picture changes), with no leader.
  const p = P('bio-cell-blank-label');
  const without = svgOf('bio_schematic', { ...p, organelles: (p.organelles as Params[]).slice(0, 3) });
  assert.ok(blank.length > without.length);
  throwsSpec('bio_schematic', { variant: 'cell', cellType: 'animal', organelles: [{ type: 'chloroplast', label: 'A' }] }, /organelles\[0\]\.type: an animal cell has no chloroplast/);
  throwsSpec('bio_schematic', { variant: 'cell', cellType: 'plant', organelles: [{ type: 'nucleus' }, { type: 'nucleus' }] }, /organelles\[1\]\.type: nucleus is listed twice/);
  throwsSpec('bio_schematic', { variant: 'cell', cellType: 'animal', organelles: [{ type: 'nephron' }] }, /organelles\[0\]\.type must be one of/);
  throwsSpec('bio_schematic', { variant: 'neuron' }, /variant must be one of cell, membrane, division, compartments/);
});

test('membrane: a bilayer with the proteins asked for; solute counts are the dots drawn; arrows, ATP and labels only when asked', () => {
  const simple = rendered.get('bio-membrane-channel-gradient') as string;
  assert.ok(has(simple, 'Outside the cell') && has(simple, 'Inside the cell'));
  assert.equal(count(simple, /<circle [^>]*r="3\.2" fill="#1d4ed8"/g), 15, '12 + 3 solute dots');
  assert.equal(count(simple, /<polygon /g), 0, 'no arrow unless asked');
  assert.ok(!has(simple, 'ATP'));
  const dense = rendered.get('bio-membrane-dense-pump-carrier-labels') as string;
  for (const s of ['P', 'Q', 'R', 'S', 'T', 'ATP']) assert.ok(has(dense, s), s);
  assert.equal(count(dense, /<polygon /g), 2, 'two transport arrows');
  const m = bioModel(reader('bio_schematic', P('bio-membrane-dense-pump-carrier-labels')));
  if (m.variant !== 'membrane') assert.fail('variant');
  assert.deepEqual(m.solutes.map((s) => [s.outside, s.inside, s.arrow]), [[10, 2, 'in'], [9, 3, 'out']]);
  const noAtp = svgOf('bio_schematic', { variant: 'membrane', proteins: [{ type: 'pump', atp: false }] });
  assert.ok(!has(noAtp, 'ATP'));
  assert.ok(!has(svgOf('bio_schematic', { variant: 'membrane', proteins: [{ type: 'channel' }], sideLabels: null }), 'Outside the cell'));
  const blank = rendered.get('bio-membrane-blank-part-label') as string;
  assert.ok(has(blank, 'phospholipid') && has(blank, 'protein') && has(blank, '?'));
  throwsSpec('bio_schematic', { variant: 'membrane', proteins: [{ type: 'channel' }], labels: [{ target: 'pump', label: 'A' }] }, /labels\[0\]\.target: the figure has no pump/);
  throwsSpec('bio_schematic', { variant: 'membrane', proteins: [{ type: 'channel' }], solutes: [{ outside: 4, inside: 2, through: 3 }] }, /solutes\[0\]\.through must be the index of a protein/);
  throwsSpec('bio_schematic', { variant: 'membrane', proteins: [{ type: 'peripheral' }], solutes: [{ outside: 4, inside: 2, through: 0 }] }, /a peripheral protein does not span the membrane/);
  throwsSpec('bio_schematic', { variant: 'membrane', proteins: [{ type: 'channel' }], solutes: [{ outside: 40, inside: 2 }] }, /solutes\[0\]\.outside must be a whole number from 0 to 14/);
});

test('division: chromosome sticks counted per stage; pairing, alignment and separation are in the picture', () => {
  assert.deepEqual(divisionCounts('metaphase', 2), { chromosomes: 4, chromatids: 8, dna: 8, cells: 1 });
  assert.deepEqual(divisionCounts('anaphase', 2), { chromosomes: 8, chromatids: null, dna: 8, cells: 1 });
  assert.deepEqual(divisionCounts('telophase', 2), { chromosomes: 8, chromatids: null, dna: 8, cells: 1 });
  assert.deepEqual(divisionCounts('metaphase_I', 3), { chromosomes: 6, chromatids: 12, dna: 12, cells: 1 });
  assert.deepEqual(divisionCounts('anaphase_I', 3), { chromosomes: 6, chromatids: 12, dna: 12, cells: 1 });
  assert.deepEqual(divisionCounts('metaphase_II', 3), { chromosomes: 3, chromatids: 6, dna: 6, cells: 1 });
  assert.deepEqual(divisionCounts('anaphase_II', 3), { chromosomes: 6, chromatids: null, dna: 6, cells: 1 });
  const strip = rendered.get('bio-division-mitosis-strip') as string;
  assert.deepEqual(texts(strip).sort(), ['X', 'Y', 'Z']);
  // One <path> per chromatid stick: 8 + 8 + 8 for 2n = 4.
  assert.equal(count(strip, /<path [^>]*stroke-width="3\.4" stroke-linecap="round"\/>/g), 24);
  const blank = rendered.get('bio-division-blank-stage-name') as string;
  assert.ok(has(blank, 'metaphase') && has(blank, '?') && !has(blank, 'telophase'));
  throwsSpec('bio_schematic', { variant: 'division', n: 2, cells: [{ stage: 'metaphase' }, { stage: 'metaphase_II' }] }, /cells mix stages of mitosis and of meiosis/);
  throwsSpec('bio_schematic', { variant: 'division', n: 5, cells: [{ stage: 'metaphase' }] }, /n must be 1, 2 or 3/);
  throwsSpec('bio_schematic', { variant: 'division', n: 2, cells: [{ stage: 'cytokinesis' }] }, /cells\[0\]\.stage must be one of/);
});

test('compartments: nested boxes with the spaces named or lettered, an ion gradient as dots or as printed values', () => {
  const mito = rendered.get('bio-compartments-mitochondrion') as string;
  assert.ok(has(mito, 'intermembrane space') && has(mito, 'matrix') && has(mito, '= one H⁺ ion'));
  assert.equal(count(mito, /<circle [^>]*r="2\.4" fill="#111827"/g), 18 + 4 + 1, 'the dots, and one in the key');
  assert.equal(count(mito, /<polygon /g), 0, 'the direction of flow is not drawn unless asked');
  const chl = rendered.get('bio-compartments-chloroplast-dense') as string;
  assert.ok(has(chl, 'X') && has(chl, 'Y') && has(chl, 'pH 8') && has(chl, 'pH 5') && !has(chl, 'stroma'));
  assert.equal(count(chl, /<polygon /g), 1);
  assert.ok(has(rendered.get('bio-compartments-blank-space') as string, '?'));
  throwsSpec('bio_schematic', { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'stroma' }] }, /spaces\[0\]\.id must be one of intermembrane_space, matrix/);
  throwsSpec('bio_schematic', { variant: 'compartments', organelle: 'chloroplast', spaces: [{ id: 'stroma', ions: 5 }, { id: 'thylakoid_lumen', ions: 5 }], synthase: true, showFlow: true }, /showFlow: the two spaces hold the same number of ions/);
  assert.ok(warn('bio_schematic', { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'matrix', label: 'A' }, { id: 'intermembrane_space', label: 'B' }] }).includes('ambiguous_blank'), 'no gradient is shown at all');
});

console.log('\nschematic_map:\n');

test('schematic_map: regions, markers, scale bar, north arrow; a hatch per value with a legend; what can be hidden', () => {
  const svg = rendered.get('map-islands-simple') as string;
  for (const s of ['Mainland', 'Isla Norte', 'Isla Sur', 'P', 'Q', 'R', 'N', '0', '100 km']) assert.ok(has(svg, s), s);
  const m = mapModel(reader('schematic_map', P('map-islands-simple')));
  near(m.unitsPerSquare, 50);
  const dense = rendered.get('map-dense-choropleth-arrows') as string;
  for (const s of ['Finch species', '1', '3', '6', '12', 'P', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z']) assert.ok(has(dense, s), s);
  assert.equal(count(dense, /<clipPath /g), 4 + 3, 'a hatch for every class above the lowest, on the map and in the legend');
  assert.equal(count(dense, /<polygon [^>]*fill="#111827"\/>/g), 2 + 1, 'two arrows and the north arrow');
  const bare = svgOf('schematic_map', { ...P('map-islands-simple'), north: false, scale: { squares: 2, length: 100, unit: 'km', show: 'blank' }, showGrid: false });
  assert.ok(!has(bare, 'N') && has(bare, '?') && !has(bare, '100 km'));
  assert.ok(texts(rendered.get('map-blank-region-label') as string).includes('?'));
  throwsSpec('schematic_map', { grid: { cols: 12, rows: 8 }, scale: { squares: 2, length: 100 }, regions: [{ label: 'A', points: [[0, 0], [20, 0], [0, 5]] }] }, /regions\[0\]\.points\[1\] is outside the grid/);
  throwsSpec('schematic_map', { grid: { cols: 12, rows: 8 }, scale: { squares: 2, length: 100 }, regions: [{ label: 'A', points: [[0, 0], [2, 0]] }] }, /regions\[0\]\.points must have between 3 and 10/);
  throwsSpec('schematic_map', { grid: { cols: 12, rows: 8 }, scale: { squares: 2, length: 100 }, regions: [1, 2, 3, 4, 5].map((v) => ({ label: `R${v}`, value: v, points: [[v, 0], [v + 1, 0], [v + 1, 1]] })) }, /5 different values — at most 4 hatch classes/);
  throwsSpec('schematic_map', { grid: { cols: 12, rows: 8 }, scale: { squares: 2, length: 100 }, regions: [{ label: 'A', points: [[0, 0], [2, 0], [0, 2]] }], markers: [{ x: 1, y: 1, label: 'P' }, { x: 3, y: 3, label: 'P' }] }, /the label "P" is used twice/);
  throwsSpec('schematic_map', { grid: { cols: 30, rows: 8 }, scale: { squares: 2, length: 100 }, regions: [] }, /grid\.cols must be a whole number from 4 to 16/);
});

console.log('\nfield_diagram — bar magnet:\n');

test('bar magnet: lines leave N and enter S; the model gives the field at a point and each needle; poles, arrows and needles can be hidden', () => {
  const m = barMagnetModel(reader('field_diagram', P('magnet-single-field-lines')));
  // N on the right: above the middle of the magnet the field runs from N back to S — to the left.
  const [bx, by] = magnetFieldAt(m, 0, 1.3);
  assert.ok(bx < 0 && Math.abs(by) < 1e-9);
  // Just beyond the N end it points away from the magnet; beyond the S end, toward it.
  assert.ok(magnetFieldAt(m, 2.4, 0)[0] > 0 && magnetFieldAt(m, -2.4, 0)[0] > 0);
  const svg = rendered.get('magnet-single-field-lines') as string;
  assert.ok(has(svg, 'N') && has(svg, 'S') && has(svg, 'P'));
  assert.ok(count(svg, /<polygon /g) >= 8, 'arrowheads on the lines');
  assert.equal(count(svgOf('field_diagram', { ...P('magnet-single-field-lines'), arrows: false }), /<polygon /g), 0);
  const blank = rendered.get('magnet-blank-poles') as string;
  assert.ok(!has(blank, 'N') && !has(blank, 'S') && texts(blank).filter((t) => t === '?').length === 2);
  const none = svgOf('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left', poles: 'none' }] });
  assert.ok(!has(none, 'N') && !has(none, '?'));
  // Two magnets, three compasses: two needles drawn, one hidden.
  const two = rendered.get('magnet-dense-two-magnets-compasses') as string;
  assert.equal(texts(two).filter((t) => t === 'N').length, 2);
  assert.equal(count(two, /<circle [^>]*r="11" fill="#ffffff" stroke="#111827"/g), 3);
  assert.equal(count(two, /<path [^>]*fill="#111827" stroke="#111827" stroke-width="1" stroke-linejoin="round"\/>/g), 2, 'two dark needle halves');
  const tm = barMagnetModel(reader('field_diagram', P('magnet-dense-two-magnets-compasses')));
  assert.equal(tm.interaction, 'repel');
  // Between two facing N poles, above the gap, the field points straight up (and below it straight down).
  assert.ok(magnetFieldAt(tm, 0, -1.5)[1] < 0 && magnetFieldAt(tm, -4.05, 0)[0] > 0 && Math.abs(magnetFieldAt(tm, -4.05, 0)[1]) < 1e-9);
  const [ux, uy] = magnetFieldAt(tm, 0, 1.5);
  assert.ok(Math.abs(ux) < 1e-9 && uy > 0);
  assert.equal(barMagnetModel(reader('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'right' }, { north: 'right' }] })).interaction, 'attract');
  throwsSpec('field_diagram', { variant: 'bar_magnet', magnets: [] }, /magnets must have between 1 and 2/);
  throwsSpec('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'up' }] }, /magnets\[0\]\.north must be one of left, right/);
  throwsSpec('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left' }], points: [{ x: 0, y: 0, label: 'P' }] }, /points\[0\] is inside a magnet/);
  throwsSpec('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left' }], compasses: [{ x: 9, y: 0, label: '1' }] }, /compasses\[0\] is outside the figure/);
  assert.ok(warn('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left', poles: 'blank' }], arrows: false }).includes('ambiguous_blank'));
});

console.log('\nThe fixes of the third round:\n');

test('a. ray_diagram: the focal length of a diverging element is printed as a magnitude, "|f| = …", or signed when asked', () => {
  const sub = (svg: string): string[] => texts(svg).filter((t) => /f/.test(t));
  assert.deepEqual(sub(rendered.get('fix3-ray-diverging-abs-f') as string), ['|f| = 12 cm']);
  assert.deepEqual(sub(svgOf('ray_diagram', { ...P('fix3-ray-diverging-abs-f'), focalLabel: 'signed' })), ['f = −12 cm']);
  assert.deepEqual(sub(svgOf('ray_diagram', { ...P('fix3-ray-diverging-abs-f'), element: 'convex_mirror' })), ['|f| = 12 cm']);
  // A converging element is unchanged: "f = 12 cm" either way.
  const conv = { ...P('fix3-ray-diverging-abs-f'), element: 'converging_lens' };
  assert.deepEqual(sub(svgOf('ray_diagram', conv)), ['f = 12 cm']);
  assert.deepEqual(sub(svgOf('ray_diagram', { ...conv, focalLabel: 'signed' })), ['f = 12 cm']);
  throwsSpec('ray_diagram', { ...conv, focalLabel: 'loud' }, /focalLabel must be one of magnitude, signed/);
});

test('b. field_diagram: the smaller of two unequal charges has lines on every side; point labels sit clear of the lines; the wire arrowhead is one shape', () => {
  const m = fieldModel(reader('field_diagram', P('fix3-field-unequal-charges-labels')));
  if (m.variant !== 'point_charges') assert.fail('variant');
  const lines = traceFieldLines(m, 0.2);
  const meets = (i: number) => lines.filter((l) => l.from === i || l.to === i);
  assert.equal(meets(0).length, 12);
  assert.equal(meets(1).length, 4);
  // Of the four lines on the −q charge, two arrive on its far (right-hand) side.
  const far = meets(1).filter((l) => { const p = l.pts[l.pts.length - 2]; return p[0] > 0; });
  assert.equal(far.length, 2);
  // Equal and opposite charges are drawn exactly as before (the pins say so for the dipole fixtures).
  assert.deepEqual(checkFigureLegibility(fx('fix3-field-unequal-charges-labels')), []);
  // No drawn line passes through the box of a point label.
  const svg = rendered.get('fix3-field-unequal-charges-labels') as string;
  const d = /<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1\.25"/.exec(svg)?.[1] ?? assert.fail('no field lines');
  const pts = [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((q) => [Number(q[1]), Number(q[2])]);
  for (const name of ['P', 'Q', 'R']) {
    const t = new RegExp(`<text x="(-?[\\d.]+)" y="(-?[\\d.]+)" font-size="13"[^>]*text-anchor="(start|end)"[^>]*>${name}</text>`).exec(svg) ?? assert.fail(`no label ${name}`);
    const [x, y] = [Number(t[1]), Number(t[2])];
    const box = t[3] === 'start' ? [x - 1, y - 11, x + 10, y + 3] : [x - 10, y - 11, x + 1, y + 3];
    // Densely sampled along every segment.
    let hit = false;
    for (let i = 1; i < pts.length && !hit; i++) {
      if (Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) > 60) continue; // a move to the next line
      for (let s = 0; s <= 10; s++) {
        const qx = pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * s) / 10;
        const qy = pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * s) / 10;
        if (qx > box[0] && qx < box[2] && qy > box[1] && qy < box[3]) hit = true;
      }
    }
    assert.ok(!hit, `a field line runs through the label ${name}`);
  }
  const wire = rendered.get('fix3-wire-arrowhead') as string;
  assert.ok(!/stroke="#ffffff" stroke-width="1\.4"/.test(wire), 'no white stroke over the wire');
  assert.equal(count(wire, /<polygon /g), 1);
});

test('c. letterLabels: letters given as node, peak or point names are printed as numerals (or Roman numerals)', () => {
  const tree = rendered.get('fix3-phylo-numerals') as string;
  assert.ok(has(tree, '1') && has(tree, '2') && has(tree, '3') && !has(tree, 'A') && !has(tree, 'B'));
  const roman = svgOf('phylogenetic_tree', { ...P('fix3-phylo-numerals'), letterLabels: 'roman' });
  assert.ok(has(roman, 'I') && has(roman, 'II') && has(roman, 'III'));
  const pes = (extra: Params) => svgOf('spectrum', { variant: 'pes', showEnergies: false, peaks: [{ energy: 100, electrons: 2, label: 'A' }, { energy: 10, electrons: 2, label: 'B' }, { energy: 1, electrons: 1, label: 'C' }], ...extra });
  assert.ok(has(pes({}), 'A') && has(pes({ letterLabels: 'numerals' }), '3') && !has(pes({ letterLabels: 'numerals' }), 'A') && has(pes({ letterLabels: 'roman' }), 'III'));
  const mass = svgOf('spectrum', { variant: 'mass', letterLabels: 'roman', peaks: [{ mz: 35, abundance: 76, label: 'A' }, { mz: 37, abundance: 24, label: 'B' }] });
  assert.ok(has(mass, 'I') && has(mass, 'II'));
  const uc = svgOf('unit_circle', { letterLabels: 'numerals', angles: [{ degrees: 30, name: 'A' }, { degrees: 150, name: 'B' }] });
  assert.ok(has(uc, '1') && has(uc, '2') && !has(uc, 'A'));
  // A name that is not a single letter is left as written.
  assert.ok(has(svgOf('phylogenetic_tree', { letterLabels: 'numerals', tree: { children: ['x', { node: 'N1', children: ['y', 'z'] }] } }), 'N1'));
  throwsSpec('phylogenetic_tree', { ...P('fix3-phylo-numerals'), letterLabels: 'greek' }, /letterLabels must be one of numerals, roman/);
});

/** Is (x, y) inside the triangle? */
const inTri = (x: number, y: number, t: number[][]): boolean => {
  const s = (a: number[], b: number[]) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  const [d1, d2, d3] = [s(t[0], t[1]), s(t[1], t[2]), s(t[2], t[0])];
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
};
test('d. geometric_figure: an angle label sits inside its triangle; similar triangles without vertex letters; the nested (lamp-post) variant', () => {
  const svg = rendered.get('fix3-geometry-theta-inside') as string;
  const outline = /<path d="M([\d.]+),([\d.]+)L([\d.]+),([\d.]+)L([\d.]+),([\d.]+)z"/.exec(svg) ?? assert.fail('no outline');
  const tri = [[Number(outline[1]), Number(outline[2])], [Number(outline[3]), Number(outline[4])], [Number(outline[5]), Number(outline[6])]];
  const th = /<text x="(-?[\d.]+)" y="(-?[\d.]+)" font-size="12" text-anchor="(\w+)"[^>]*>θ<\/text>/.exec(svg) ?? assert.fail('no θ');
  const cx = Number(th[1]) + (th[3] === 'start' ? 3.5 : th[3] === 'end' ? -3.5 : 0);
  assert.ok(inTri(cx, Number(th[2]) - 4, tri), `θ at (${cx}, ${Number(th[2]) - 4}) is outside the triangle`);
  const sim = rendered.get('fix3-similar-no-vertices') as string;
  assert.deepEqual(texts(sim).sort(), ['10', '6', '8', '9', 'x']);
  const named = svgOf('geometric_figure', { ...P('fix3-similar-no-vertices'), vertices: undefined });
  assert.ok(has(named, 'A') && has(named, 'F'));
  const half = svgOf('geometric_figure', { ...P('fix3-similar-no-vertices'), vertices: [['P', 'Q', 'R'], null] });
  assert.ok(has(half, 'P') && !has(half, 'D'));
  const lamp = rendered.get('fix3-nested-similar-lamp-post') as string;
  assert.deepEqual(texts(lamp).sort(), ['1.8 m', '2 m', '4 m', '?']);
  assert.equal(count(lamp, /<path d="M[\d.]+,[\d.]+L[\d.]+,[\d.]+L[\d.]+,[\d.]+z"/g), 1, 'one outline: the small triangle is cut off inside the big one');
  throwsSpec('geometric_figure', { shape: 'similar_triangles', nested: true, sides: [10, 8, 6], scale: 1.5 }, /scale must be between 0\.15 and 0\.85 for nested triangles/);
});

test('e. ray_diagram interface: total internal reflection with nothing beyond the interface when the spec says `refracted: false`', () => {
  const svg = rendered.get('fix3-interface-tir') as string;
  assert.equal(count(svg, /<polygon /g), 1, 'the incident ray alone');
  assert.ok(has(svg, 'glass') && has(svg, 'air') && has(svg, '50°'));
  assert.equal(count(svgOf('ray_diagram', { ...P('fix3-interface-tir'), reflected: true }), /<polygon /g), 2);
  // Left to its default (`refracted` true) a spec past the critical angle is still refused — and told both ways out.
  throwsSpec('ray_diagram', { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 50 }, /totally internally reflected .* set reflected: true, or refracted: false/);
  throwsSpec('ray_diagram', { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 50, refracted: true, reflected: true }, /refracted: true .* there is no refracted ray/);
});

test('f. spectrum PES: peaks closer than a 1.5 energy ratio are drawn apart on a tightened axis with narrower peaks; under 8 units apart is refused', () => {
  const svg = rendered.get('fix3-pes-third-period') as string;
  const xs = [...svg.matchAll(/<path d="M([\d.]+),([\d.]+)C[^"]*z" fill="#111827"/g)].map((m) => Number(m[1]));
  assert.equal(xs.length, 5);
  const gaps = xs.slice(1).map((x, i) => x - xs[i]);
  assert.ok(Math.min(...gaps) >= 13, `the closest peaks start ${Math.min(...gaps)} units apart`);
  for (const s of ['239', '22.7', '16.5', '2.05', '1', '10', '100']) assert.ok(has(svg, s), s);
  // The whole third period draws.
  const period3: Array<[string, number[][]]> = [
    ['Na', [[104, 2], [6.84, 2], [3.67, 6], [0.5, 1]]], ['Mg', [[126, 2], [9.07, 2], [5.31, 6], [0.74, 2]]], ['Al', [[151, 2], [12.1, 2], [7.79, 6], [1.09, 2], [0.58, 1]]],
    ['Si', [[178, 2], [15.1, 2], [10.3, 6], [1.46, 2], [0.79, 2]]], ['P', [[208, 2], [18.7, 2], [13.5, 6], [1.95, 2], [1.01, 3]]],
    ['Cl', [[273, 2], [26.8, 2], [20.2, 6], [2.44, 2], [1.25, 5]]], ['Ar', [[309, 2], [31.5, 2], [24.1, 6], [2.82, 2], [1.52, 6]]],
  ];
  for (const [el, peaks] of period3) {
    const spec = { type: 'spectrum', params: { variant: 'pes', peaks: peaks.map(([energy, electrons]) => ({ energy, electrons })) } };
    assert.doesNotThrow(() => renderPracticeFigure(spec), el);
    assert.ok(!checkFigureLegibility(spec).some((w) => w.code === 'labels_overlap'), `${el}: ${JSON.stringify(checkFigureLegibility(spec))}`);
  }
  // A spectrum with every pair at least 1.5 apart is drawn as before (the pins say so for the three fixtures).
  throwsSpec('spectrum', { variant: 'pes', peaks: [{ energy: 500, electrons: 2 }, { energy: 11, electrons: 2 }, { energy: 10, electrons: 6 }, { energy: 0.01, electrons: 1 }] }, /peaks: the binding energies 11 and 10 .* too close to draw as two peaks/);
});

Promise.all(pending).then(() => {
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
});
