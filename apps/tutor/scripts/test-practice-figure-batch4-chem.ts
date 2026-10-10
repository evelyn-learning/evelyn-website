/**
 * Practice-figure renderer — batch 4, part "chem": energy_levels
 * (orbital_boxes, levels), heating_curve, electrochemical_cell.
 *
 * Under test: the shared fixture invariants (kit), and per kind / variant
 * what is drawn, what each option hides, the model behind the picture, the
 * refusals (each names its param) and the kind's own legibility warnings.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-chem.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { energyLevelsModel, hundFill, levelsLayout, type LevelsModel, type OrbitalModel } from '../src/lib/tutor/practice-figure/kinds/energy-levels';
import { heatingModel } from '../src/lib/tutor/practice-figure/kinds/heating-curve';
import { cellModel, positiveSide, showsAnode } from '../src/lib/tutor/practice-figure/kinds/electrochemical-cell';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-chem';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const P = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;

console.log('\nEvery chem fixture:\n');

const GROUPS: Record<string, string> = {
  'energy_levels (orbital_boxes)': 'orbital-', 'energy_levels (levels)': 'levels-', heating_curve: 'heating-',
  'electrochemical_cell (galvanic)': 'cell-', 'electrochemical_cell (electrolytic)': 'cell-electrolytic-',
};
const rendered = fixtureInvariants(test, FIXTURES, GROUPS);
const R = (id: string): string => rendered.get(id) ?? assert.fail(`no fixture ${id}`);

const BOXES = /<rect [^>]*width="22" height="22" fill="#ffffff" stroke="#111827"/g;
const ARROWHEADS = /<polygon /g;
const BLANKS = /stroke-dasharray="3 2"/g;

console.log('\nenergy_levels — orbital_boxes:\n');

test('orbital boxes: one box per orbital, one arrow per electron, Hund filling from a config, labels under the groups', () => {
  const n = R('orbital-simple-nitrogen');
  assert.equal(count(n, BOXES), 5);
  assert.equal(count(n, ARROWHEADS), 7, 'seven electrons');
  assert.deepEqual(texts(n), ['1s', '2s', '2p']);
  assert.deepEqual(hundFill(1, 4), ['ud', 'u', 'u']);
  assert.deepEqual(hundFill(2, 6), ['ud', 'u', 'u', 'u', 'u']);
  assert.deepEqual(hundFill(0, 0), ['']);
  const m = energyLevelsModel(reader('energy_levels', P('orbital-ladder-iron'))) as OrbitalModel;
  assert.deepEqual(m.diagrams[0].subshells.map((s) => `${s.name}:${s.boxes.join('|')}`).slice(-2), ['4s:ud', '3d:ud|u|u|u|u']);
  // Up arrows point up: the head's tip is above its base; a pair has one of each.
  const pair = svgOf('energy_levels', { variant: 'orbital_boxes', diagrams: [{ config: '1s2' }] });
  const tips = [...pair.matchAll(/<polygon points="[\d.]+,([\d.]+) [\d.]+,([\d.]+)/g)].map((q) => Number(q[1]) < Number(q[2]));
  assert.deepEqual(tips, [true, false]);
});

test('orbital boxes: wrong fillings are drawn as given; several diagrams sit on labelled plates; a core is printed', () => {
  const d = R('orbital-dense-which-ground-state');
  assert.equal(count(d, BOXES), 4 * 6);
  assert.equal(count(d, ARROWHEADS), 8 * 4, 'eight electrons in each of the four');
  for (const l of ['I', 'II', 'III', 'IV']) assert.ok(has(d, l), l);
  assert.equal(count(d, /<rect [^>]*rx="4"/g), 4, 'each label on a plate (a lone "I" is not a stroke)');
  const uu = svgOf('energy_levels', { variant: 'orbital_boxes', diagrams: [{ subshells: [{ name: '2s', boxes: ['uu'] }] }] });
  const ys = [...uu.matchAll(/<polygon points="[\d.]+,([\d.]+) [\d.]+,([\d.]+)/g)].map((q) => Number(q[1]) < Number(q[2]));
  assert.deepEqual(ys, [true, true], 'two up arrows in one box');
  assert.ok(has(R('orbital-core-wrap-arsenic'), '[Ar]'));
});

test('orbital boxes: what can be hidden — subshell labels, and any box as a "?"', () => {
  const b = R('orbital-blank-oxygen-2p');
  assert.equal(count(b, BLANKS), 3);
  assert.equal(count(b, BOXES), 2, 'a blank box replaces the box');
  assert.equal(count(b, ARROWHEADS), 4, 'nothing of the hidden electrons is drawn');
  const none = svgOf('energy_levels', { variant: 'orbital_boxes', subshellLabels: 'none', diagrams: [{ config: '1s2 2s2 2p2' }] });
  assert.deepEqual(texts(none), []);
});

test('orbital boxes: a long configuration wraps onto a second line; the ladder puts 4s under 3d beside an Energy arrow', () => {
  const kr = svgOf('energy_levels', { variant: 'orbital_boxes', diagrams: [{ config: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6' }] });
  const ysOf = (svg: string) => new Set([...svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="22"/g)].map((q) => q[1]));
  assert.equal(ysOf(kr).size, 2, 'two lines of boxes');
  assert.ok([...kr.matchAll(/<rect x="([\d.]+)" y="[\d.]+" width="22"/g)].every((q) => Number(q[1]) + 22 <= 351), 'inside the figure');
  const fe = R('orbital-ladder-iron');
  assert.ok(has(fe, 'Energy'));
  const yOf = (name: string) => Number(new RegExp(`<text x="[\\d.]+" y="([\\d.]+)"[^>]*>${name}</text>`).exec(fe)?.[1]);
  assert.ok(yOf('3d') < yOf('4s') && yOf('4s') < yOf('3p') && yOf('2s') < yOf('1s'), '3d above 4s above 3p');
});

test('orbital boxes: refusals name the param', () => {
  const one = (d: Params, extra: Params = {}) => ({ variant: 'orbital_boxes', diagrams: [d], ...extra });
  throwsSpec('energy_levels', {}, /variant must be one of orbital_boxes, levels/);
  throwsSpec('energy_levels', one({ config: '1s2 2x3' }), /diagrams\[0\]\.config: "2x3" is not a subshell/);
  throwsSpec('energy_levels', one({ config: '1s3' }), /a 1s subshell holds at most 2 electrons/);
  throwsSpec('energy_levels', one({ config: '1p2' }), /there is no 1p subshell/);
  throwsSpec('energy_levels', one({ subshells: [{ name: '2p', boxes: ['u', 'u'] }] }), /diagrams\[0\]\.subshells\[0\]\.boxes must have between 3 and 3 entries/);
  throwsSpec('energy_levels', one({ subshells: [{ name: '2p', boxes: ['u', 'x', ''] }] }), /boxes\[1\] must be one of/);
  throwsSpec('energy_levels', one({ subshells: [{ name: '2p', electrons: 7 }] }), /electrons must be a whole number from 0 to 6/);
  throwsSpec('energy_levels', one({ subshells: [{ name: '2p', electrons: 2, boxes: ['u', 'u', ''] }] }), /give electrons or boxes, not both/);
  throwsSpec('energy_levels', one({ config: '1s2 1s1' }), /a subshell is listed twice/);
  throwsSpec('energy_levels', one({ config: '1s2', core: 'Xe' }), /core must be one of He, Ne, Ar, Kr/);
  throwsSpec('energy_levels', { variant: 'orbital_boxes', layout: 'ladder', diagrams: [{ config: '1s2' }, { config: '1s1' }] }, /layout "ladder" draws one diagram/);
  throwsSpec('energy_levels', one({ config: '1s2' }, { subshellLabels: 'blank' }), /subshellLabels must be one of value, none/);
  assert.ok(warn('energy_levels', { variant: 'orbital_boxes', diagrams: [1, 2, 3, 4].map(() => ({ config: '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6' })) }).includes('too_many_elements'));
});

console.log('\nenergy_levels — levels:\n');

test('levels: lines labelled left (name) and right (energy); a down arrow for emission, an up arrow for absorption', () => {
  const s = R('levels-simple-three-levels');
  assert.deepEqual(texts(s), ['Energy (eV)', 'E₁', '−10 eV', 'E₂', '−4 eV', 'E₃', '−1 eV', 'A']);
  assert.equal(count(s, /stroke-width="2"\/>/g), 3, 'three level lines');
  const d = R('levels-dense-hydrogen-five-transitions');
  for (const t of ['n = 1', 'n = 6', 'n = ∞', '−13.6 eV', '−3.4 eV', '−1.51 eV', '−0.85 eV', '0 eV', 'P', 'Q', 'R', 'S', 'T', 'not to scale']) assert.ok(has(d, t), t);
  // Four heads point down (tip below base), one up; each tip sits on its target level.
  const heads = [...d.matchAll(/<polygon points="([\d.]+),([\d.]+) [\d.]+,([\d.]+)/g)].slice(1).map((q) => Number(q[2]) > Number(q[3]));
  assert.deepEqual(heads, [true, true, true, false, true]);
  const m = energyLevelsModel(reader('energy_levels', P('levels-dense-hydrogen-five-transitions'))) as LevelsModel;
  assert.deepEqual(m.levels.map((l) => l.energy), [-13.6, -3.4, -1.51, -0.85, -0.544, -0.378]);
});

test('levels: to scale when the lines can be told apart, evenly spaced with "not to scale" printed when not; forced true scale warns', () => {
  const simple = energyLevelsModel(reader('energy_levels', P('levels-simple-three-levels'))) as LevelsModel;
  const lay = levelsLayout(simple);
  assert.ok(lay.toScale && !lay.crowded);
  near((lay.ys[0] - lay.ys[1]) / (lay.ys[1] - lay.ys[2]), 6 / 3, 1e-9);
  const h = levelsLayout(energyLevelsModel(reader('energy_levels', { variant: 'levels', hydrogen: { nMax: 4 } })) as LevelsModel);
  assert.ok(!h.toScale);
  near(h.ys[0] - h.ys[1], h.ys[2] - h.ys[3], 1e-9);
  assert.ok(!has(R('levels-simple-three-levels'), 'not to scale'));
  assert.ok(warn('energy_levels', P('levels-true-scale-hydrogen-warns')).includes('crowded'));
  assert.ok(!has(R('levels-true-scale-hydrogen-warns'), 'not to scale'));
  assert.deepEqual(warn('energy_levels', { variant: 'levels', hydrogen: { nMax: 6 }, scale: 'even' }), []);
});

test('levels: every energy can be printed, blanked or left out; level labels can go', () => {
  const b = R('levels-blank-hydrogen-n3');
  assert.equal(count(b, BLANKS), 1);
  assert.ok(!has(b, '−1.51 eV') && has(b, '−3.4 eV') && has(b, 'n = 3'));
  const hide = svgOf('energy_levels', { variant: 'levels', hydrogen: { nMax: 3, hide: [2] } });
  assert.ok(!has(hide, '−3.4 eV') && has(hide, '−13.6 eV') && count(hide, BLANKS) === 0);
  const bare = svgOf('energy_levels', { variant: 'levels', hydrogen: { nMax: 3 }, energies: 'none', levelLabels: 'none', transitions: [{ from: 3, to: 1 }] });
  assert.deepEqual(texts(bare), ['Energy (eV)'], 'three hydrogen levels are far enough apart to be drawn to scale');
  const per = svgOf('energy_levels', { variant: 'levels', levels: [{ energy: 0, energy_shown: 'none' }, { energy: 2, energy_shown: 'blank' }, { energy: 5 }], units: 'kJ/mol' });
  assert.ok(has(per, '5 kJ/mol') && !has(per, '0 kJ/mol') && count(per, BLANKS) === 1);
});

test('levels: refusals name the param; too many close transitions warn', () => {
  throwsSpec('energy_levels', { variant: 'levels' }, /levels must be an array/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 9 } }, /hydrogen\.nMax must be a whole number from 2 to 7/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 3 }, levels: [] }, /give hydrogen or levels, not both/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 3, blank: [4] } }, /hydrogen\.blank\[0\] must be a level n from 1 to 3/);
  throwsSpec('energy_levels', { variant: 'levels', levels: [{ energy: 1 }, { energy: 1 }] }, /two levels have the same energy/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 3 }, transitions: [{ from: 4, to: 1 }] }, /transitions\[0\]\.from must be a level number from 1 \(the lowest level\) to 3/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 3 }, transitions: [{ from: 2, to: 2 }] }, /from and to are the same level/);
  throwsSpec('energy_levels', { variant: 'levels', levels: [{ energy: 0 }, { energy: 3 }], ionization: true }, /ionization: .* below 0/);
  throwsSpec('energy_levels', { variant: 'levels', hydrogen: { nMax: 3 }, scale: 'log' }, /scale must be one of auto, true, even/);
});

console.log('\nheating_curve:\n');

test('heating curve: computed from the substance — water\'s five stages, corners in kJ, the cooling curve its mirror image', () => {
  const m = heatingModel(reader('heating_curve', P('heating-dense-water-computed')));
  assert.deepEqual(m.segments.map((s) => s.kind), ['solid', 'melting', 'liquid', 'boiling', 'gas']);
  near(m.segments[0].x1, 0.836, 1e-9);                      // 10 g × 2.09 × 40 °C
  near(m.segments[1].x1 - m.segments[1].x0, 3.34, 1e-9);    // 10 g × 334 J/g
  near(m.segments[2].x1 - m.segments[2].x0, 4.18, 1e-9);
  near(m.segments[3].x1 - m.segments[3].x0, 22.6, 1e-9);
  near(m.segments[4].x1, 31.76, 1e-6);
  assert.ok(!m.cooling && m.xLabel === 'Heat added (kJ)' && m.yLabel === 'Temperature (°C)');
  const c = heatingModel(reader('heating_curve', { substance: P('heating-dense-water-computed').substance, startTemp: 140, endTemp: -40 }));
  assert.deepEqual(c.segments.map((s) => s.kind), ['gas', 'condensing', 'liquid', 'freezing', 'solid']);
  assert.ok(c.cooling && c.xLabel === 'Heat removed (kJ)');
  near(c.segments[1].x1 - c.segments[1].x0, 22.6, 1e-9);
  // A curve that starts at the melting point includes the whole plateau; one within a phase has one segment.
  assert.deepEqual(heatingModel(reader('heating_curve', { substance: P('heating-dense-water-computed').substance, startTemp: 0, endTemp: 50 })).segments.map((s) => s.kind), ['melting', 'liquid']);
  assert.deepEqual(heatingModel(reader('heating_curve', { substance: P('heating-dense-water-computed').substance, startTemp: 20, endTemp: 80 })).segments.map((s) => s.kind), ['liquid']);
  // Time axis: x = heat ÷ power.
  const t = heatingModel(reader('heating_curve', { substance: P('heating-dense-water-computed').substance, startTemp: 0, endTemp: 50, xQuantity: 'time', timeUnit: 's', power: 100 }));
  near(t.segments[0].x1, 33.4, 1e-9);
  assert.equal(t.xLabel, 'Time (s)');
});

test('heating curve: one line through the corners; letters, plateau temperatures and marks only when asked', () => {
  const s = R('heating-simple-lettered');
  assert.deepEqual(texts(s).filter((t) => /^[A-E]$/.test(t)), ['A', 'B', 'C', 'D', 'E']);
  assert.equal(count(s, /<path d="M[^"]*" fill="none" stroke="#1d4ed8" stroke-width="2\.4"/g), 1);
  assert.ok(has(s, 'Heat added (kJ)') && has(s, 'Temperature (°C)') && has(s, '−20') && has(s, '28'));
  const plain = svgOf('heating_curve', { corners: [[0, -20], [2, 0], [8, 0], [14, 80]] });
  assert.ok(!texts(plain).some((t) => /^[A-E]$/.test(t) || /°C$/.test(t)), 'nothing but the axes');
  assert.ok(!/solid|liquid|gas|melting|boiling/i.test(texts(R('heating-dense-water-computed')).join(' ')), 'no phase is ever named');
  const d = R('heating-dense-water-computed');
  assert.ok(has(d, '0 °C') && has(d, '100 °C') && has(d, 'P') && has(d, 'Q'));
  assert.equal(count(d, /<circle [^>]*r="3\.8"/g), 2);
  const own = svgOf('heating_curve', { corners: [[0, 0], [2, 10], [5, 10]], segmentLabels: ['X', null] });
  assert.ok(has(own, 'X') && texts(own).filter((t) => /^[A-Z]$/.test(t)).length === 1);
});

test('heating curve: what can be hidden — axis numbers (then no grid), plateau temperatures as "?" boxes', () => {
  const b = R('heating-blank-plateaus-cooling');
  assert.equal(count(b, BLANKS), 2);
  assert.deepEqual(texts(b).filter((t) => /\d/.test(t)), [], 'no number anywhere');
  assert.ok(has(b, 'Time') && has(b, 'Temperature'));
  const yOnly = svgOf('heating_curve', { corners: [[0, 0], [2, 10], [5, 10]], xNumbers: false });
  assert.ok(has(yOnly, 'Heat added') && has(yOnly, 'Temperature (°C)') && has(yOnly, '10'));
});

test('heating curve: refusals name the param; a stage too short to label warns', () => {
  const w = P('heating-dense-water-computed').substance as Params;
  throwsSpec('heating_curve', {}, /corners must be an array/);
  throwsSpec('heating_curve', { substance: w, startTemp: 0, endTemp: 50, corners: [] }, /give substance .* or corners, not both/);
  throwsSpec('heating_curve', { substance: { ...w, boilingPoint: -5 }, startTemp: 0, endTemp: 50 }, /boilingPoint must be above substance\.meltingPoint/);
  throwsSpec('heating_curve', { substance: w, startTemp: 20, endTemp: 20 }, /startTemp and endTemp must differ/);
  throwsSpec('heating_curve', { substance: w, startTemp: 0, endTemp: 50, xQuantity: 'time' }, /power must be a finite number/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10], [1, 20]] }, /corners\[2\]: x must increase/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10], [4, 5]] }, /must only rise .* or only fall/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 0], [4, 0]] }, /never changes/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10]], segmentLabels: ['A', 'B'] }, /segmentLabels must have one entry per segment \(1\)/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10]], marks: [{ x: 5 }] }, /marks\[0\]\.x \(5\) is not on the curve/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10]], yRange: [2, 8] }, /yRange does not contain the whole curve/);
  throwsSpec('heating_curve', { corners: [[0, 0], [2, 10]], xMax: 1 }, /xMax \(1\) is before the end of the curve/);
  assert.deepEqual(warn('heating_curve', P('heating-short-stage-warns')), ['crowded']);
});

console.log('\nelectrochemical_cell:\n');

test('galvanic cell: two beakers, a salt bridge, a voltmeter; only the names asked for are printed', () => {
  const s = R('cell-simple-daniell');
  assert.deepEqual(texts(s).sort(), ['1.0 M CuSO₄', '1.0 M ZnSO₄', 'Cu', 'V', 'Zn', 'salt bridge'].sort());
  assert.equal(count(s, /<circle [^>]*r="15"/g), 1, 'the voltmeter');
  assert.equal(count(s, /stroke-width="13"/g), 1, 'the salt bridge tube');
  assert.equal(count(s, /<polygon /g), 0, 'no arrow gives the anode away');
  const m = cellModel(reader('electrochemical_cell', P('cell-simple-daniell')));
  assert.ok(!showsAnode(m) && positiveSide(m) === 'right');
  assert.ok(!has(svgOf('electrochemical_cell', { ...P('cell-simple-daniell'), saltBridge: false }), 'salt bridge'));
});

test('galvanic cell: roles, electron arrow (anode → cathode), signs (cathode +), bridge ions (anions → anode), meter reading', () => {
  const d = R('cell-dense-all-labels');
  for (const t of ['anode', 'cathode', 'e⁻', '+', '−', 'KNO₃', 'NO₃⁻', 'K⁺', '0.46 V', 'Ag', 'Cu']) assert.ok(has(d, t), t);
  const xOf = (svg: string, s: string) => Number(new RegExp(`<text x="([\\d.]+)"[^>]*>${s.replace(/[+]/g, '\\+')}</text>`).exec(svg)?.[1]);
  assert.ok(xOf(d, 'anode') > 180 && xOf(d, 'cathode') < 180, 'the anode is the right electrode');
  assert.ok(xOf(d, '−') > 180 && xOf(d, '+') < 180, 'the cathode of a galvanic cell is positive');
  // Electron arrow: on the anode's half of the wire, its tip toward the middle (the cathode's side).
  const head = [...d.matchAll(/<polygon points="([\d.]+),([\d.]+) ([\d.]+),/g)][2];
  assert.ok(Number(head[1]) > 180 && Number(head[1]) < Number(head[3]), 'points left, from the right-hand anode');
  const flip = svgOf('electrochemical_cell', { ...P('cell-dense-all-labels'), anode: 'left' });
  assert.ok(xOf(flip, 'anode') < 180 && xOf(flip, '+') > 180);
  assert.ok(showsAnode(cellModel(reader('electrochemical_cell', P('cell-dense-all-labels')))));
});

test('cell: what can be blanked — both roles, the electron direction, the meter reading, an electrode name', () => {
  const b = R('cell-blank-roles-and-flow');
  assert.equal(count(b, BLANKS), 4);
  assert.ok(!has(b, 'anode') && !has(b, 'cathode') && has(b, 'e⁻'));
  assert.equal(count(b, /<polygon /g), 0, 'no arrow at all');
  // The blank drawing is the same whichever electrode is the anode.
  assert.equal(svgOf('electrochemical_cell', { ...P('cell-blank-roles-and-flow'), anode: 'left' }), b);
  const q = svgOf('electrochemical_cell', { left: { electrode: '?', solution: '?' }, right: { electrode: 'Cu' }, anode: 'left' });
  assert.equal(count(q, BLANKS), 2);
});

test('electrolytic cell: one container, a battery whose long plate (positive) faces the anode; signs on request', () => {
  const s = R('cell-electrolytic-simple-molten');
  assert.deepEqual(texts(s).sort(), ['X', 'Y', 'molten NaCl']);
  assert.equal(count(s, /<circle /g), 0, 'no voltmeter');
  assert.equal(count(s, /stroke-width="13"/g), 0, 'no salt bridge');
  const plates = (svg: string) => ({ long: Number(/<path d="M([\d.]+),[\d.]+L[\d.]+,[\d.]+" fill="none" stroke="#111827" stroke-width="1\.6"\/><path d="M([\d.]+),[\d.]+L[\d.]+,[\d.]+" fill="none" stroke="#111827" stroke-width="4"/.exec(svg)?.[1]), short: Number(/stroke-width="1\.6"\/><path d="M([\d.]+),[\d.]+L[\d.]+,[\d.]+" fill="none" stroke="#111827" stroke-width="4"/.exec(svg)?.[1]) });
  assert.ok(plates(s).long < plates(s).short, 'anode left: the long plate is on the left');
  const r = R('cell-electrolytic-blank-roles');
  assert.ok(plates(r).long > plates(r).short, 'anode right: the long plate is on the right');
  assert.equal(count(r, BLANKS), 2);
  const d = R('cell-electrolytic-dense-plating');
  for (const t of ['anode', 'cathode', 'e⁻', '+', '−', 'spoon', 'Ag', 'AgNO₃(aq)']) assert.ok(has(d, t), t);
  const m = cellModel(reader('electrochemical_cell', P('cell-electrolytic-dense-plating')));
  assert.ok(positiveSide(m) === 'right' && m.container === 'one' && showsAnode(m));
  // Two beakers and a bridge are still possible for an electrolytic cell.
  assert.equal(count(svgOf('electrochemical_cell', { variant: 'electrolytic', container: 'two', left: { electrode: 'Zn' }, right: { electrode: 'Cu' }, anode: 'right' }), /stroke-width="13"/g), 1);
});

test('cell: refusals name the param', () => {
  const base = { left: { electrode: 'Zn' }, right: { electrode: 'Cu' }, anode: 'left' };
  throwsSpec('electrochemical_cell', { ...base, anode: 'zinc' }, /anode must be one of left, right/);
  throwsSpec('electrochemical_cell', { ...base, left: {} }, /left\.electrode must be a non-empty string/);
  throwsSpec('electrochemical_cell', { ...base, variant: 'fuel' }, /variant must be one of galvanic, electrolytic/);
  throwsSpec('electrochemical_cell', { ...base, roles: 'show' }, /roles must be one of value, blank, none/);
  throwsSpec('electrochemical_cell', { ...base, left: { electrode: 'Zn', solution: '1.0 M zinc sulfate heptahydrate' } }, /left\.solution is longer than 18 characters/);
  throwsSpec('electrochemical_cell', { ...base, container: 'one', right: { electrode: 'Cu', solution: 'x' } }, /right\.solution: with one container/);
  throwsSpec('electrochemical_cell', { ...base, container: 'one', bridgeIons: { anion: 'Cl⁻' } }, /bridgeIons needs two containers/);
  throwsSpec('electrochemical_cell', { ...base, bridgeIons: {} }, /bridgeIons must name an anion, a cation or both/);
  throwsSpec('electrochemical_cell', { ...base, variant: 'electrolytic', meterLabel: '2 V' }, /only a galvanic cell has a voltmeter/);
});

void finish();
