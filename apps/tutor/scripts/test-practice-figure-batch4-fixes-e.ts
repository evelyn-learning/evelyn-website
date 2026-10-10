/**
 * Practice-figure renderer — batch 4 (2026-10-14), the to-dos a, c and e of
 * the round (src/lib/tutor/practice-figure/kinds/molecule.ts, bar-magnet.ts,
 * field-diagram.ts):
 *   a  molecular_structure — lone pairs on a central atom stand apart AS
 *      PAIRS; a dotted (hydrogen-bond) line can carry a label; condensed
 *      formulas side by side keep their bonds as lines;
 *   c  bar_magnet — up to six marked points; force arrows over two magnets
 *      (`showInteraction`), which fix a blank magnet's poles;
 *   e  field_diagram, two unlike charges of unequal size — lines in the
 *      region beyond the point of zero field, the line count still ∝ charge.
 * Each has a fixture that reproduces what a reader complained about
 * (scripts/lib/practice-figure-fixtures-b4-fixes-e.ts).
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-fixes-e.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { barMagnetModel } from '../src/lib/tutor/practice-figure/kinds/bar-magnet';
import { beyondNull, fieldModel, lineCounts, nominalLineCounts, traceFieldLines, CHARGE_RADIUS, fieldScale } from '../src/lib/tutor/practice-figure/kinds/field-diagram';
import { moleculeModel, visibleBond } from '../src/lib/tutor/practice-figure/kinds/molecule';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-fixes-e';
import { count, fixtureInvariants, has, makeRunner, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const P = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;

console.log('\nEvery fixture of the to-dos a, c, e:\n');
const rendered = fixtureInvariants(test, FIXTURES, {}, ['a', 'c', 'e']);
const svg = (id: string): string => rendered.get(id) as string;

// ── a. molecular_structure ──────────────────────────────────────────────────
console.log('\na. molecular_structure:\n');

type Pt = [number, number];
/** The lone pairs of a drawing: the centre of each pair of dots, and its two dots (dots are emitted pair by pair). */
function pairs(s: string): Array<{ c: Pt; dots: [Pt, Pt] }> {
  const dots = [...s.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)" r="1\.7"/g)].map((m): Pt => [Number(m[1]), Number(m[2])]);
  assert.equal(dots.length % 2, 0, 'dots come in pairs');
  return Array.from({ length: dots.length / 2 }, (_, i) => ({ c: [(dots[2 * i][0] + dots[2 * i + 1][0]) / 2, (dots[2 * i][1] + dots[2 * i + 1][1]) / 2] as Pt, dots: [dots[2 * i], dots[2 * i + 1]] as [Pt, Pt] }));
}
const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const atomAt = (s: string, el: string): Pt[] => [...s.matchAll(/<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]*)<\/text>/g)].filter((m) => m[3] === el).map((m): Pt => [Number(m[1]), Number(m[2]) - 15 * 0.36]);
const mol = (atoms: Params[], bonds: Params[], extra: Params = {}): Params => ({ molecules: [{ atoms, bonds, ...extra }] });
const Fl = (id: string, x: number, y: number): Params => ({ id, el: 'F', x, y, lonePairs: 3 });

test('a: every lone pair reads as a PAIR — its two dots 5.8 apart, and any dot of another pair at least 1.6 × that away (XeF₂, XeF₄, ClF₃, I₃⁻, SF₄, water)', () => {
  const cases: Record<string, Params> = {
    xenon: P('fix4-a-xenon-lone-pairs'),
    clf3: P('fix4-a-t-shaped-lone-pairs'),
    triiodide: mol([{ id: 'I', el: 'I', x: 0, y: 0, lonePairs: 3 }, { id: 'a', el: 'I', x: -1.4, y: 0, lonePairs: 3 }, { id: 'b', el: 'I', x: 1.4, y: 0, lonePairs: 3 }], [{ a: 'I', b: 'a' }, { a: 'I', b: 'b' }]),
    sf4: mol([{ id: 'S', el: 'S', x: 0, y: 0, lonePairs: 1 }, Fl('a', -1.3, 0), Fl('b', 1.3, 0), Fl('c', -0.75, -1.05), Fl('d', 0.75, -1.05)], [{ a: 'S', b: 'a' }, { a: 'S', b: 'b' }, { a: 'S', b: 'c' }, { a: 'S', b: 'd' }]),
    water: mol([{ id: 'O', el: 'O', lonePairs: 2 }, { id: 'H1', el: 'H' }, { id: 'H2', el: 'H' }], [{ a: 'O', b: 'H1' }, { a: 'O', b: 'H2' }], { layout: { type: 'bent', center: 'O', around: ['H1', 'H2'] } }),
  };
  for (const [name, params] of Object.entries(cases)) {
    const ps = pairs(svgOf('molecular_structure', params));
    assert.ok(ps.length > 0, name);
    for (const [i, p] of ps.entries()) {
      assert.ok(Math.abs(dist(p.dots[0], p.dots[1]) - 5.8) < 0.02, `${name}: the two dots of a pair`);
      for (const q of ps.slice(i + 1)) for (const a of p.dots) for (const b of q.dots) assert.ok(dist(a, b) >= 5.8 * 1.6, `${name}: dots of two pairs ${dist(a, b).toFixed(1)} apart`);
    }
    assert.deepEqual(warn('molecular_structure', params), [], name);
  }
});

test('a: XeF₂ — the two pairs that share the upper side of xenon are 90° apart round it (they were 60° apart, one arc of four dots); XeF₄ — the two pairs sit in OPPOSITE corners', () => {
  const s = svg('fix4-a-xenon-lone-pairs');
  const [xe4, xe2] = atomAt(s, 'Xe');
  const near = (c: Pt) => pairs(s).filter((p) => dist(p.c, c) < 24).map((p) => (Math.atan2(c[1] - p.c[1], p.c[0] - c[0]) * 180) / Math.PI);
  const on2 = near(xe2).sort((a, b) => a - b);
  assert.equal(on2.length, 3);
  assert.ok(Math.abs(on2[0] + 90) < 1 && Math.abs(on2[1] - 45) < 1 && Math.abs(on2[2] - 135) < 1, JSON.stringify(on2));
  const on4 = near(xe4);
  assert.equal(on4.length, 2);
  assert.ok(Math.abs(Math.abs(on4[0] - on4[1]) - 180) < 1, JSON.stringify(on4));
  // The more bonds, the further out: a pair on the four-bonded xenon is further from its centre than one on the two-bonded xenon in the same direction would need.
  const d4 = Math.min(...pairs(s).filter((p) => dist(p.c, xe4) < 24).map((p) => dist(p.c, xe4)));
  assert.ok(d4 >= 15, `pairs of the square-planar xenon are ${d4.toFixed(1)} from its centre`);
});

test('a: ClF₃ drawn T-shaped — both lone pairs of chlorine are on the open side, each at least 8 units off the line of the bonds', () => {
  const s = svg('fix4-a-t-shaped-lone-pairs');
  const [cl] = atomAt(s, 'Cl');
  const mine = pairs(s).filter((p) => dist(p.c, cl) < 24);
  assert.equal(mine.length, 2);
  for (const p of mine) assert.ok(p.c[1] - cl[1] >= 8 && Math.abs(p.c[0] - cl[0]) >= 8, JSON.stringify(p.c));
  assert.ok(mine[0].c[0] < cl[0] !== mine[1].c[0] < cl[0], 'one on each side of the stem');
});

test('a: terminal atoms and bent centres are drawn as they were (their pairs were never the complaint)', () => {
  // Three pairs on a terminal atom: opposite the bond and at right angles to it.
  const s = svgOf('molecular_structure', mol([{ id: 'H', el: 'H', x: 0, y: 0 }, { id: 'F', el: 'F', x: 1, y: 0, lonePairs: 3 }], [{ a: 'H', b: 'F' }]));
  const [f] = atomAt(s, 'F');
  const angs = pairs(s).map((p) => Math.round((Math.atan2(f[1] - p.c[1], p.c[0] - f[0]) * 180) / Math.PI)).sort((a, b) => a - b);
  assert.deepEqual(angs, [-90, 0, 90]);
});

test('a: a dotted line can carry a label beside it — text, or a "?" box; it is refused when too long', () => {
  const s = svg('fix4-a-hbond-labels');
  assert.ok(has(s, '1') && has(s, '2'));
  assert.equal(count(s, /stroke-dasharray="1\.5 3\.5"/g), 2);
  const m = moleculeModel(reader('molecular_structure', P('fix4-a-hbond-labels')));
  assert.deepEqual(m.hbonds.map((h) => h.label), ['1', '2']);
  const p = JSON.parse(JSON.stringify(P('fix4-a-hbond-labels'))) as { hbonds: Array<Record<string, unknown>> };
  p.hbonds[0].label = '?';
  const blank = svgOf('molecular_structure', p as unknown as Params);
  assert.ok(has(blank, '?') && !has(blank, '1') && has(blank, '2'));
  p.hbonds[0].label = 'bond 1';
  throwsSpec('molecular_structure', p as unknown as Params, /hbonds\[0\]\.label is longer than 4 characters/);
  // Without labels the figure is what it was (the pinned mol-hbond-water-pair says so byte for byte).
  delete p.hbonds[0].label;
  delete p.hbonds[1].label;
  assert.deepEqual(texts(svgOf('molecular_structure', p as unknown as Params)).filter((t) => /^\d$/.test(t)), []);
});

test('a: three condensed formulas are set two to a row and one below — every bond between written groups shows at least 11 units of line (side by side it was a hyphen of 2)', () => {
  const params = P('fix4-a-three-condensed');
  const s = svg('fix4-a-three-condensed');
  const rows = new Set([...s.matchAll(/<text x="[\d.-]+" y="([\d.-]+)" font-size="15"/g)].map((m) => m[1]));
  assert.equal(rows.size, 2, 'two rows of formulas');
  const m = moleculeModel(reader('molecular_structure', params));
  // Three to a row the bond length would be (348 − 3 × 44 − 2 × 14) / 6 ≈ 31: CH₂–OH would show about 2 units.
  assert.ok(visibleBond(m.molecules[0], m.molecules[0].bonds[1], 31.3) < 4);
  for (const mo of m.molecules) for (const b of mo.bonds) assert.ok(visibleBond(mo, b, 46) >= 11, `${mo.label}: ${visibleBond(mo, b, 46)}`);
  // The drawn bond lines themselves: none shorter than 11.
  const lens = [...s.matchAll(/<path d="M([\d.-]+),([\d.-]+)L([\d.-]+),([\d.-]+)" fill="none" stroke="#111827" stroke-width="1\.8"/g)].map((q) => Math.hypot(Number(q[3]) - Number(q[1]), Number(q[4]) - Number(q[2])));
  assert.equal(lens.length, 6);
  assert.ok(Math.min(...lens) >= 11, `shortest bond ${Math.min(...lens).toFixed(1)}`);
  assert.deepEqual(warn('molecular_structure', params), []);
});

test('a: a bond that no layout can save says so — which bond, how short, what to do; formulas of bare symbols are laid out as before', () => {
  const squeezed = mol([{ id: 'a', el: 'C', x: 0, y: 0, h: 3 }, { id: 'b', el: 'C', x: 0.75, y: 0, h: 2 }, { id: 'c', el: 'O', x: 1.5, y: 0, h: 1 }], [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }]);
  const w = checkFigureLegibility({ type: 'molecular_structure', params: squeezed });
  assert.ok(w.length === 1 && w[0].code === 'crowded' && /molecules\[0\]\.bonds\[1\] \(b–c\) shows only \d+ units of line between its two labels — it reads as a hyphen/.test(w[0].message), JSON.stringify(w));
  // Three structures of bare symbols still share one row (the pinned carbonate fixture says so byte for byte).
  const plain = (label: string) => ({ label, atoms: [{ id: 'a', el: 'C', x: 0, y: 0 }, { id: 'b', el: 'O', x: 1, y: 0 }, { id: 'c', el: 'N', x: 2, y: 0 }], bonds: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }] });
  const s = svgOf('molecular_structure', { molecules: [plain('X'), plain('Y'), plain('Z')] });
  assert.equal(new Set([...s.matchAll(/<text x="[\d.-]+" y="([\d.-]+)" font-size="15"/g)].map((q) => q[1])).size, 1);
});

// ── c. bar_magnet ───────────────────────────────────────────────────────────
console.log('\nc. field_diagram, bar_magnet:\n');

const magnet = (extra: Params): Params => ({ variant: 'bar_magnet', magnets: [{ north: 'right' }], ...extra });
const spot = (x: number, y: number, label: string): Params => ({ x, y, label });

test('c: up to six marked points (the cap was three); a seventh is refused; two that would run together are reported', () => {
  const s = svg('fix4-c-magnet-five-points');
  for (const l of ['K', 'L', 'M', 'R', 'T']) assert.ok(has(s, l), l);
  assert.equal(count(s, /<circle [^>]*r="3\.4"/g), 5);
  const six = [spot(0, 1.75, 'K'), spot(0, -1.75, 'L'), spot(2.55, 0, 'M'), spot(-2.55, 0, 'R'), spot(2.3, 1.5, 'T'), spot(-2.3, -1.5, 'U')];
  assert.equal(barMagnetModel(reader('field_diagram', magnet({ points: six }))).points.length, 6);
  throwsSpec('field_diagram', magnet({ points: [...six, spot(-2.3, 1.5, 'W')] }), /points must have between 0 and 6 entries \(has 7\)/);
  const close = checkFigureLegibility({ type: 'field_diagram', params: magnet({ lines: false, points: [spot(2, 1.5, 'K'), spot(2.3, 1.5, 'L')] }) });
  assert.ok(close.some((w) => w.code === 'crowded' && /"K" and "L" are under 22 units apart/.test(w.message)), JSON.stringify(close));
  assert.deepEqual(warn('field_diagram', magnet({ lines: false, points: [spot(2, 1.5, 'K'), spot(2.6, 1.5, 'L')] })), []);
});

test('c: showInteraction draws a force arrow labelled "F" over each of two magnets — apart when like poles face, towards each other when unlike; refused for one magnet', () => {
  const two = (second: Params, extra: Params = {}): Params => ({ variant: 'bar_magnet', magnets: [{ north: 'right' }, second], lines: false, showInteraction: true, ...extra });
  const tips = (s: string): number[] => [...s.matchAll(/<polygon points="([\d.-]+),[\d.-]+ [^"]*" fill="#c2410c"\/>/g)].map((m) => Number(m[1]));
  const repel = svg('fix4-c-magnet-blank-interaction');
  assert.equal(texts(repel).filter((t) => t === 'F').length, 2);
  assert.equal(texts(repel).filter((t) => t === '?').length, 2, 'the right-hand magnet keeps its two blanks');
  const [l1, r1] = tips(repel);
  assert.ok(l1 < 100 && r1 > 260, `repel: the arrow tips point outward (${l1}, ${r1})`);
  const [l2, r2] = tips(svgOf('field_diagram', two({ north: 'right', poles: 'blank' })));
  assert.ok(l2 > l1 && r2 < r1 && l2 < r2, `attract: the arrow tips point at each other (${l2}, ${r2})`);
  assert.equal(barMagnetModel(reader('field_diagram', two({ north: 'left' }))).interaction, 'repel');
  // Off by default: nothing of it is drawn (the pinned magnet fixtures say so byte for byte).
  assert.equal(count(svgOf('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'right' }, { north: 'left' }] }), /#c2410c/g), 0);
  throwsSpec('field_diagram', magnet({ showInteraction: true }), /showInteraction: .* there is only one magnet/);
  // One magnet's poles printed: the figure is not reported as ambiguous. Neither printed: it still is.
  assert.deepEqual(warn('field_diagram', P('fix4-c-magnet-blank-interaction')), []);
  assert.deepEqual(warn('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'right', poles: 'blank' }, { north: 'left', poles: 'blank' }], lines: false, showInteraction: true }), ['ambiguous_blank']);
});

// ── e. field_diagram: unequal unlike charges ────────────────────────────────
console.log('\ne. field_diagram, two unlike charges of unequal size:\n');

const charges = (params: Params) => fieldModel(reader('field_diagram', { variant: 'point_charges', ...params })) as Extract<ReturnType<typeof fieldModel>, { variant: 'point_charges' }>;
const linesIn = (m: ReturnType<typeof charges>): number => {
  const far = beyondNull(m) ?? assert.fail('no region');
  return traceFieldLines(m, CHARGE_RADIUS / fieldScale(m)).filter((ln) => ln.pts.some((q) => far.inRegion(q[0], q[1]))).length;
};

test('e: the point of zero field lies beyond the smaller charge, at d / (√(Q/q) − 1) from it; there is none for equal, like or far-apart charges', () => {
  const m = charges(P('fix4-e-unequal-null-region'));
  const far = beyondNull(m) ?? assert.fail('no region');
  assert.equal(far.larger, 0);
  assert.ok(Math.abs(far.at[0] - 3 / (Math.sqrt(3) - 1)) < 1e-9 && Math.abs(far.at[1]) < 1e-9);
  assert.ok(far.inRegion(5, 0.5) && !far.inRegion(3, 0.5) && !far.inRegion(-5, 0));
  assert.equal(beyondNull(charges({ charges: [{ x: -2, y: 0, q: 1 }, { x: 2, y: 0, q: -1 }] })), null, 'equal and opposite');
  assert.equal(beyondNull(charges({ charges: [{ x: -2, y: 0, q: 3 }, { x: 2, y: 0, q: 1 }] })), null, 'like charges');
  assert.equal(beyondNull(charges({ linesPerUnit: 4, charges: [{ x: -2, y: 0, q: 3 }, { x: 2.5, y: 0, q: -1 }], xRange: [-6.5, 6.5], yRange: [-4.6, 4.6] })), null, 'the null point is outside the picture');
});

test('e: two lines of the larger charge pass through the region beyond the null point (there were none), and the counts are still charge × linesPerUnit', () => {
  for (const id of ['fix4-e-unequal-null-region', 'fix4-e-unequal-negative-larger']) {
    const m = charges(P(id));
    assert.equal(linesIn(m), 2, id);
    assert.deepEqual(lineCounts(m), nominalLineCounts(m), id);
    assert.deepEqual(warn('field_diagram', P(id)), [], id);
  }
  assert.deepEqual(lineCounts(charges(P('fix4-e-unequal-null-region'))), [12, 4]);
  // Whatever the ratio and the separation, when the picture has room for the region.
  for (const Q of [2, 3, 4]) for (const d of [1.5, 2, 3]) {
    const m = charges({ charges: [{ x: -d, y: 0, q: Q }, { x: 0, y: 0, q: -1 }], xRange: [-7, 9], yRange: [-4, 4], linesPerUnit: 4 });
    assert.equal(linesIn(m), 2, `${Q}:1 at ${d}`);
    assert.deepEqual(lineCounts(m), [Q * 4, 4], `${Q}:1 at ${d}`);
  }
  // Every line that escapes still leaves the larger charge at a different angle (none drawn twice).
  const m = charges(P('fix4-e-unequal-null-region'));
  const starts = traceFieldLines(m, CHARGE_RADIUS / fieldScale(m)).filter((ln) => ln.from === 0 && ln.to < 0).map((ln) => Math.atan2(ln.pts[0][1], ln.pts[0][0] + 3).toFixed(3));
  assert.equal(new Set(starts).size, 8);
});

test('e: in a low picture the aimed lines leave it over the smaller charge and come back in beyond the null point; where even that fails the figure says precisely which region is empty', () => {
  const low = { charges: [{ x: -2, y: 0, q: 2 }, { x: 0, y: 0, q: -1 }], xRange: [-7, 9], yRange: [-2.5, 2.5], linesPerUnit: 4 };
  assert.equal(linesIn(charges(low)), 2);
  assert.ok(!checkFigureLegibility({ type: 'field_diagram', params: { variant: 'point_charges', ...low } }).some((w) => /zero field/.test(w.message)));
  const strip = { ...low, yRange: [-1.5, 1.5] };
  const w = checkFigureLegibility({ type: 'field_diagram', params: { variant: 'point_charges', ...strip } }).filter((x) => /zero field/.test(x.message));
  assert.equal(w.length, 1);
  assert.equal(w[0].code, 'not_to_scale');
  assert.ok(/no field line is drawn in the region beyond the point of zero field \(to the right of charges\[1\], past x = 4\.8, y = 0\)/.test(w[0].message), w[0].message);
});

test('e: equal-and-opposite, like and three-charge figures are traced exactly as before', () => {
  // (The pinned fixtures field-dipole, field-three-charges-equipotentials and field-blank-unknown-charges say so byte for byte.)
  const dipole = charges({ charges: [{ x: -2, y: 0, q: 1 }, { x: 2, y: 0, q: -1 }] });
  assert.deepEqual(lineCounts(dipole), [8, 8]);
  const like = charges({ charges: [{ x: -2, y: 0, q: 3 }, { x: 1, y: 0, q: 1 }], xRange: [-6, 6], yRange: [-4, 4], linesPerUnit: 4 });
  assert.deepEqual(lineCounts(like), [12, 4]);
});

void finish();
