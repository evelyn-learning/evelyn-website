/**
 * Practice-figure renderer — batch 4, part "wave" and the to-dos d and g:
 *   - wave_diagram (kinds/wave.ts): transverse and standing — what is drawn,
 *     what each option hides, the model, the refusals, the warnings;
 *   - d: a motion graph that starts on an axis no longer warns; the top and
 *     right edges, and a vertex outside the plot, still do;
 *   - g: circuit_diagram with an internal resistance and / or a second
 *     battery in series (kinds/circuit.ts); the frustum of solid_3d.
 * Every fixture of the part holds the shared invariants of the test kit.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-wave.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { checkFigureLegibility } from '../src/lib/tutor/practice-figure/legibility';
import { circuitModel, fNum, solveCircuit } from '../src/lib/tutor/practice-figure/kinds/circuit';
import { solidModel } from '../src/lib/tutor/practice-figure/kinds/solid-3d';
import { standingPoints, standingShape, standingWavelengthFactor, waveExtrema, waveModel, waveY, type TransverseModel } from '../src/lib/tutor/practice-figure/kinds/wave';
import { FIXTURES as FIXES } from './lib/practice-figure-fixtures-b4-fixes-f';
import { FIXTURES as WAVES } from './lib/practice-figure-fixtures-b4-wave';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const ALL = [...WAVES, ...FIXES];
const P = (id: string): Params => (ALL.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;
const BLANK_BOX = /stroke-dasharray="3 2"/g;

console.log('\nEvery fixture of the part:\n');
const rendered = fixtureInvariants(test, ALL, { 'wave_diagram (transverse)': 'wave-transverse-', 'wave_diagram (standing)': 'wave-standing-' }, ['d', 'g']);
const svg = (id: string): string => rendered.get(id) ?? assert.fail(`no fixture ${id}`);

console.log('\nwave_diagram — transverse:\n');

test('transverse: the curve, the equilibrium line, the two dimensions with their values; nothing else is printed', () => {
  const s = svg('wave-transverse-simple');
  assert.deepEqual(texts(s).sort(), ['0.2 m', '1.5 m']);
  assert.equal(count(s, /stroke-dasharray="6 4"/g), 1, 'the dashed equilibrium line');
  assert.equal(count(s, /<polygon /g), 2, 'the amplitude arrow has two heads');
  const m = waveModel(reader('wave_diagram', P('wave-transverse-simple'))) as TransverseModel;
  near(waveY(m, 0.375), 0.2, 1e-12);
  near(waveY(m, 1.125), -0.2, 1e-12);
  assert.deepEqual(waveExtrema(m, 1), [0.375, 1.875]);
  assert.deepEqual(waveExtrema(m, -1), [1.125, 2.625]);
  // The drawn curve really is that sinusoid: its highest and lowest points are 2 × 40 units apart.
  const d = /<path d="(M[^"]+)" fill="none" stroke="#1d4ed8" stroke-width="2\.4"/.exec(s)?.[1] ?? assert.fail('no curve');
  const ys = [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((q) => Number(q[2]));
  near(Math.max(...ys) - Math.min(...ys), 80, 0.05);
});

test('transverse: every value can be hidden or made a "?"; words, points and the direction arrow are opt-in', () => {
  const base = { variant: 'transverse', amplitude: 0.5, wavelength: 2.4 };
  assert.deepEqual(texts(svgOf('wave_diagram', { ...base, showAmplitude: 'none', showWavelength: 'none' })), []);
  const blank = svgOf('wave_diagram', { ...base, showAmplitude: 'blank', showWavelength: 'blank' });
  assert.deepEqual(texts(blank), ['?', '?']);
  assert.equal(count(blank, BLANK_BOX), 2);
  assert.ok(!blank.includes('2.4') || !texts(blank).includes('2.4 m'));
  const one = svg('wave-transverse-blank-wavelength');
  assert.deepEqual(texts(one).sort(), ['0.5 m', '?', 'v = 12 m/s']);
  assert.ok(!texts(one).some((t) => t.includes('2.4')), 'the hidden wavelength is nowhere on the figure');
  const dense = svg('wave-transverse-dense-labels-points');
  for (const w of ['crest', 'trough', 'equilibrium position', 'P', 'Q', 'v = 12 cm/s', '3 cm', '8 cm']) assert.ok(has(dense, w), w);
  // On a time axis the horizontal dimension is the period, in seconds.
  assert.ok(has(svg('wave-transverse-time-blank-amplitude'), '0.4 s') && has(svg('wave-transverse-time-blank-amplitude'), '?'));
  // The direction arrow turns round.
  const head = (dir: string) => /<polygon points="([\d.]+),/.exec(svgOf('wave_diagram', { ...base, showAmplitude: 'none', showWavelength: 'none', direction: dir }))?.[1];
  assert.ok(Number(head('right')) > Number(head('left')));
});

test('transverse with scale: numbered axes, nothing printed on the wave; amplitude and wavelength sit on gridlines', () => {
  const s = svg('wave-transverse-scale-read-off');
  const t = texts(s);
  for (const w of ['Position (m)', 'Displacement (cm)', '4', '−4', '0.5', '2.0', 'P', 'Q', 'v']) assert.ok(t.includes(w), w);
  assert.ok(!t.some((x) => /\d (m|cm)$/.test(x)), 'no value with a unit is printed');
  assert.deepEqual(warn('wave_diagram', P('wave-transverse-scale-read-off')), []);
  assert.deepEqual(warn('wave_diagram', { variant: 'transverse', amplitude: 3, wavelength: 2, scale: true, yStep: 4 }), ['not_to_scale']);
  assert.deepEqual(warn('wave_diagram', { variant: 'transverse', amplitude: 4, wavelength: 2, scale: true, xStep: 1.5 }), ['not_to_scale']);
  assert.ok(texts(svgOf('wave_diagram', { variant: 'transverse', axis: 'time', amplitude: 2, period: 4, scale: true })).includes('Time (s)'));
});

test('transverse: refusals name the param', () => {
  const base = { variant: 'transverse', amplitude: 1, wavelength: 2 };
  throwsSpec('wave_diagram', {}, /variant must be one of transverse, standing/);
  throwsSpec('wave_diagram', { variant: 'transverse', wavelength: 2 }, /amplitude must be a finite number/);
  throwsSpec('wave_diagram', { ...base, cycles: 5 }, /cycles must be from 1 to 4, in quarter steps/);
  throwsSpec('wave_diagram', { ...base, cycles: 1.3 }, /quarter steps/);
  throwsSpec('wave_diagram', { ...base, cycles: 1 }, /not two crests \(or two troughs\) to measure between/);
  throwsSpec('wave_diagram', { ...base, axis: 'time' }, /give period/);
  throwsSpec('wave_diagram', { ...base, period: 3 }, /has a wavelength, not a period/);
  throwsSpec('wave_diagram', { variant: 'transverse', axis: 'time', amplitude: 1, period: 2, direction: 'right' }, /no direction of travel/);
  throwsSpec('wave_diagram', { ...base, speedLabel: 'v' }, /speedLabel needs direction/);
  throwsSpec('wave_diagram', { ...base, points: [{ x: 9, label: 'P' }] }, /points\[0\]\.x is outside the drawn wave \(0 to 4\)/);
  throwsSpec('wave_diagram', { ...base, points: [{ x: 1, label: 'P' }, { x: 2, label: 'P' }] }, /same label/);
  throwsSpec('wave_diagram', { ...base, scale: true, showAmplitude: 'value' }, /showAmplitude: with scale the value is read off/);
  throwsSpec('wave_diagram', { ...base, scale: true, labels: ['crest'] }, /labels: not drawn on a scaled graph/);
  throwsSpec('wave_diagram', { ...base, scale: true, yMax: 0.5 }, /yMax is smaller than the amplitude/);
  throwsSpec('wave_diagram', { ...base, labels: ['peak'] }, /labels\[0\] must be one of crest, trough, equilibrium/);
  assert.deepEqual(warn('wave_diagram', { ...base, cycles: 4 }), ['crowded']);
});

console.log('\nwave_diagram — standing:\n');

test('standing: nodes, antinodes and wavelengths of each medium (the model the picture is drawn from)', () => {
  assert.deepEqual(standingPoints('string', 3), { nodes: [0, 1 / 3, 2 / 3, 1].map((v) => Number(v.toFixed(9))), antinodes: [1 / 6, 0.5, 5 / 6].map((v) => Number(v.toFixed(9))) });
  assert.deepEqual(standingPoints('open_open', 2), { nodes: [0.25, 0.75], antinodes: [0, 0.5, 1] });
  assert.deepEqual(standingPoints('open_closed', 1), { nodes: [0], antinodes: [1] });
  assert.deepEqual(standingPoints('open_closed', 3), { nodes: [0, Number((2 / 3).toFixed(9))], antinodes: [Number((1 / 3).toFixed(9)), 1] });
  assert.deepEqual(standingPoints('open_closed', 5).nodes.length, 3);
  for (const [medium, n] of [['string', 4], ['open_open', 3], ['open_closed', 5]] as const) {
    const pts = standingPoints(medium, n);
    for (const s of pts.nodes) near(standingShape(medium, n, s), 0, 1e-8);
    for (const s of pts.antinodes) near(Math.abs(standingShape(medium, n, s)), 1, 1e-8);
  }
  near(standingWavelengthFactor('string', 3), 2 / 3);
  near(standingWavelengthFactor('open_open', 2), 1);
  near(standingWavelengthFactor('open_closed', 3), 4 / 3);
});

test('standing: one solid and one dashed curve per row, a dot per node, a ring per antinode; letters, numbers and the length are opt-in', () => {
  const NODE = /<circle [^>]*r="3\.4" fill="#111827"/g;
  const RING = /<circle [^>]*r="3\.6" fill="#ffffff"/g;
  const third = svg('wave-standing-simple-third-harmonic');
  assert.deepEqual(texts(third), ['1.2 m']);
  assert.equal(count(third, NODE), 4);
  assert.equal(count(third, RING), 0);
  assert.equal(count(third, /stroke="#1d4ed8" stroke-width="2\.3"/g), 1);
  assert.equal(count(third, /stroke="#1d4ed8" stroke-width="1\.6" stroke-dasharray="5 4"/g), 1);
  const dense = svg('wave-standing-dense-three-harmonics');
  assert.equal(count(dense, NODE), 2 + 3 + 4);
  assert.equal(count(dense, RING), 1 + 2 + 3);
  assert.equal(texts(dense).filter((t) => t === 'N').length, 9);
  assert.equal(texts(dense).filter((t) => t === 'A').length, 6);
  for (const w of ['n = 1', 'n = 2', 'n = 3', '0.9 m']) assert.ok(has(dense, w), w);
  // Hidden: nothing printed, no marks — only the shapes.
  const bare = svgOf('wave_diagram', { variant: 'standing', harmonics: [4], nodes: 'none', length: 2, showLength: 'none' });
  assert.deepEqual(texts(bare), []);
  assert.equal(count(bare, /<circle /g), 0);
  // Blanks: "n = ?" on each row and "?" for the length — and the true length is nowhere.
  const pipe = svg('wave-standing-blank-pipe-closed');
  assert.deepEqual(texts(pipe).sort(), ['?', '?', '?', 'n =', 'n =']);
  assert.equal(count(pipe, BLANK_BOX), 3);
  assert.ok(!pipe.includes('0.6 m'));
  assert.equal(count(pipe, NODE), 1 + 2);
  assert.equal(count(pipe, RING), 1 + 2);
  assert.ok(has(svg('wave-standing-open-pipe-lettered'), 'L'));
  // A tube has walls; only a closed end has a cap (one heavy vertical stroke), a string has two clamps.
  assert.equal(count(pipe, /stroke-width="4"/g), 2, 'one cap per row');
  assert.equal(count(svg('wave-standing-open-pipe-lettered'), /stroke-width="4"/g), 0);
  assert.equal(count(third, /stroke-width="4"/g), 1, 'the two clamps are one path');
});

test('standing: refusals and warnings', () => {
  const base = { variant: 'standing' };
  throwsSpec('wave_diagram', { ...base }, /harmonics must be an array/);
  throwsSpec('wave_diagram', { ...base, harmonics: [1, 2, 3, 4] }, /harmonics must have between 1 and 3 entries/);
  throwsSpec('wave_diagram', { ...base, harmonics: [7] }, /whole number from 1 to 6/);
  throwsSpec('wave_diagram', { ...base, harmonics: [1.5] }, /whole number from 1 to 6/);
  throwsSpec('wave_diagram', { ...base, medium: 'open_closed', harmonics: [1, 2] }, /harmonics\[1\]: a tube closed at one end has odd harmonics only .* 2 cannot stand in it/);
  throwsSpec('wave_diagram', { ...base, medium: 'drum', harmonics: [1] }, /medium must be one of string, open_open, open_closed/);
  throwsSpec('wave_diagram', { ...base, harmonics: [1], showLength: 'value' }, /showLength: "value" needs length/);
  throwsSpec('wave_diagram', { ...base, harmonics: [1], length: -1 }, /length must be greater than 0/);
  throwsSpec('wave_diagram', { ...base, harmonics: [1], nodes: 'stars' }, /nodes must be one of dots, labels, none/);
  assert.deepEqual(warn('wave_diagram', { ...base, harmonics: [6], nodes: 'labels', antinodes: 'labels' }), ['crowded']);
  assert.deepEqual(warn('wave_diagram', { ...base, harmonics: [6], nodes: 'labels' }), []);
});

console.log('\nto-do d — motion_graph:\n');

test('d: a start on the axis is not "a feature on the border"; the top and right edges and a vertex outside the plot still are', () => {
  assert.deepEqual(checkFigureLegibility({ type: 'motion_graph', params: P('fix4-d-motion-starts-on-axis') }), []);
  const codes = (points: number[][], extra: Params = {}) => warn('motion_graph', { series: [{ points }], tRange: [0, 10], yRange: [0, 8], ...extra });
  assert.deepEqual(codes([[0, 0], [5, 4]]), []);
  assert.deepEqual(codes([[0, 6], [4, 0], [8, 3]]), [], 'a value of zero on the time axis');
  assert.deepEqual(codes([[0, 0], [5, 8]]), ['feature_on_border']);
  assert.deepEqual(codes([[0, 0], [10, 4]]), ['feature_on_border']);
  assert.deepEqual(codes([[0, 8], [5, 4]]), ['feature_on_border'], 'a start in the top-left corner is on the top edge');
  assert.deepEqual(codes([[0, 0], [12, 4]]), ['feature_on_border']);
  assert.ok(/series\[0\]\.points\[1\] lies outside the plot/.test(checkFigureLegibility({ type: 'motion_graph', params: { series: [{ points: [[0, 0], [12, 4]] }], tRange: [0, 10], yRange: [0, 8] } })[0].message));
  // The foot of the plot is an axis only when it is the zero line; the left edge only for the first point.
  assert.deepEqual(warn('motion_graph', { series: [{ points: [[0, 4], [5, 2], [8, 6]] }], tRange: [0, 10], yRange: [2, 8] }), ['feature_on_border']);
  assert.deepEqual(warn('motion_graph', { quantity: 'velocity', series: [{ points: [[0, -4], [4, 0], [8, 4]] }], tRange: [0, 10], yRange: [-6, 6] }), []);
});

console.log('\nto-do g — circuit_diagram, solid_3d:\n');

test('g: internal resistance — a second zigzag inside a dashed boundary with the cells, labelled r; I = ε/(R + r), terminal voltage ε − Ir', () => {
  const s = svg('fix4-g-internal-resistance');
  for (const w of ['ε = 12 V', 'r = 0.5 Ω', 'R = 5.5 Ω', '+', '−']) assert.ok(has(s, w), w);
  assert.equal(count(s, /stroke-dasharray="5 3"/g), 1, 'one dashed battery boundary');
  const m = circuitModel(reader('circuit_diagram', P('fix4-g-internal-resistance')));
  const sol = solveCircuit(m);
  near(fNum(sol.current), 2);
  near(fNum(sol.terminal), 11);
  near(fNum(sol.internal), 0.5);
  near(fNum(sol.leaves[m.leaves.findIndex((l) => l.name === 'V')].V), 11, 1e-12);
  // "r = ?" hides the value, 'none' prints nothing, 'name' the letter alone.
  const blank = svg('fix4-g-internal-resistance-blank');
  assert.ok(has(blank, 'r = ?') && !texts(blank).some((t) => /1 Ω/.test(t)));
  const mk = (internalShow: string) => texts(svgOf('circuit_diagram', { battery: { emf: 9, internalResistance: 1, internalShow }, circuit: { type: 'resistor', value: 5 } }));
  assert.ok(!mk('none').some((t) => /r/.test(t)) && mk('name').includes('r') && mk('value').includes('1 Ω'));
  // A short across a real battery is solvable: I = ε / r.
  const short = solveCircuit(circuitModel(reader('circuit_diagram', { battery: { emf: 6, internalResistance: 2 }, circuit: { series: [{ type: 'ammeter', name: 'A' }, { type: 'wire' }] } })));
  near(fNum(short.current), 3);
  near(fNum(short.terminal), 0);
  throwsSpec('circuit_diagram', { battery: { emf: 9, internalResistance: 0 }, circuit: { type: 'resistor', value: 5 } }, /battery\.internalResistance must be greater than 0/);
  throwsSpec('circuit_diagram', { battery: { emf: 9, internalShow: 'blank' }, circuit: { type: 'resistor', value: 5 } }, /battery\.internalResistance must be given/);
});

test('g: two batteries in series — each with its own + and −; aiding adds, opposing subtracts; the lower one is drawn turned round', () => {
  const aid = svg('fix4-g-two-batteries-aiding');
  assert.equal(texts(aid).filter((t) => t === '+').length, 2);
  assert.equal(texts(aid).filter((t) => t === '−').length, 2);
  for (const w of ['ε₁ = 9 V', 'ε₂ = 3 V']) assert.ok(has(aid, w), w);
  const solA = solveCircuit(circuitModel(reader('circuit_diagram', P('fix4-g-two-batteries-aiding'))));
  near(fNum(solA.emf), 12);
  near(fNum(solA.current), 2);
  const opp = svg('fix4-g-two-batteries-opposing');
  const solO = solveCircuit(circuitModel(reader('circuit_diagram', P('fix4-g-two-batteries-opposing'))));
  near(fNum(solO.emf), 6);
  near(fNum(solO.current), 1);            // 6 V / (4.5 + 1 + 0.5) Ω
  near(fNum(solO.terminal), 4.5);
  assert.equal(count(opp, /stroke-dasharray="5 3"/g), 2);
  // Polarity: the + of the lower battery is above its cells when aiding, below them when opposing.
  const plusYs = (s: string) => [...s.matchAll(/<text x="[\d.]+" y="([\d.]+)"[^>]*>\+<\/text>/g)].map((q) => Number(q[1]));
  const minusYs = (s: string) => [...s.matchAll(/<text x="[\d.]+" y="([\d.]+)"[^>]*>−<\/text>/g)].map((q) => Number(q[1]));
  assert.ok(plusYs(aid)[1] < minusYs(aid)[1], 'aiding: + on top again');
  assert.ok(plusYs(opp)[1] > minusYs(opp)[1], 'opposing: − on top');
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, battery2: { emf: 9, sense: 'opposing' }, circuit: { type: 'resistor', value: 5 } }, /an opposing second battery must have the smaller EMF/);
  throwsSpec('circuit_diagram', { battery: { emf: 6 }, battery2: { emf: 6, sense: 'against' }, circuit: { type: 'resistor', value: 5 } }, /battery2\.sense must be 'aiding' or 'opposing'/);
  throwsSpec('circuit_diagram', { battery: { emf: 6, name: 'ε' }, battery2: { emf: 3, name: 'ε' }, circuit: { type: 'resistor', value: 5 } }, /is the first battery's name/);
  // One ideal battery is solved exactly as before.
  const plain = solveCircuit(circuitModel(reader('circuit_diagram', { battery: { emf: 12 }, circuit: { type: 'resistor', value: 6 } })));
  near(fNum(plain.current), 2);
  near(fNum(plain.terminal), 12);
  near(fNum(plain.internal), 0);
});

test('g: frustum — two circles of different sizes, the slant from the two radii and the height; every label value / "?" / hidden', () => {
  const m = solidModel(reader('solid_3d', P('fix4-g-frustum')));
  near(m.dims.slant, 5);
  const s = svg('fix4-g-frustum');
  assert.deepEqual(texts(s).sort(), ['3 cm', '4 cm', '6 cm', '?']);
  assert.ok(!texts(s).some((t) => t.startsWith('5')), 'the slant height asked for is not printed');
  assert.deepEqual(texts(svg('fix4-g-frustum-bucket')).sort(), ['2 cm', '5 cm', '6 cm']);
  assert.deepEqual(texts(svgOf('solid_3d', { solid: 'frustum', radius: 6, topRadius: 3, height: 4, labels: { radius: null, topRadius: 'r', height: null, slant: 'auto' } })).sort(), ['5', 'r']);
  throwsSpec('solid_3d', { solid: 'frustum', radius: 3, topRadius: 3, height: 4 }, /topRadius: equal to radius — that is a cylinder/);
  throwsSpec('solid_3d', { solid: 'frustum', radius: 3, height: 4 }, /topRadius must be a finite number/);
  throwsSpec('solid_3d', { solid: 'frustum', radius: 3, topRadius: 1, height: 4, labels: { base: 'x' } }, /labels\.base: this solid has no such dimension \(radius, topRadius, height, slant\)/);
  assert.deepEqual(warn('solid_3d', { solid: 'frustum', radius: 9, topRadius: 7, height: 2 }), ['crowded']);
  assert.deepEqual(warn('solid_3d', P('fix4-g-frustum-bucket')), []);
});

void finish();
