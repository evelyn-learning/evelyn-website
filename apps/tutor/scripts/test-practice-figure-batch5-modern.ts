/**
 * Practice-figure renderer — batch 5, part "modern":
 *   - doppler_wavefronts (kinds/doppler.ts): the fronts are circles centred
 *     where the source WAS, so the spacing ahead / behind is (1 ∓ vₛ/v)·λ; the
 *     shock cone; what each option prints, hides, refuses and warns about;
 *   - photoelectric_setup (kinds/photoelectric.ts): the tube and the
 *     KE_max–frequency graph — the model (hf − φ), the labels and their
 *     blanks, the refusals, the warnings.
 * Every fixture of the part holds the shared invariants of the test kit.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-modern.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { dopplerGeometry, dopplerModel, machAngle } from '../src/lib/tutor/practice-figure/kinds/doppler';
import { H14, photoelectricModel, type PhotoGraphModel, type PhotoTubeModel } from '../src/lib/tutor/practice-figure/kinds/photoelectric';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-modern';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const P = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;
const BLANK_BOX = /stroke-dasharray="3 2"/g;

console.log('\nEvery fixture of the part:\n');
const rendered = fixtureInvariants(test, FIXTURES, { doppler_wavefronts: 'doppler-', 'photoelectric_setup (tube)': 'photo-tube-', 'photoelectric_setup (KE graph)': 'photo-graph-' }, [], 'fix5');
const svg = (id: string): string => rendered.get(id) ?? assert.fail(`no fixture ${id}`);
/** The wavefronts of a drawn figure: its unfilled blue circles, newest (smallest) first. */
const fronts = (s: string): Array<{ cx: number; cy: number; r: number }> => [...s.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.-]+)" fill="none" stroke="#1d4ed8"/g)].map((m) => ({ cx: Number(m[1]), cy: Number(m[2]), r: Number(m[3]) }));

console.log('\ndoppler_wavefronts:\n');

test('the fronts are circles one wavelength apart in radius, each centred where the source was: spacing (1 − r)·λ ahead and (1 + r)·λ behind', () => {
  for (const [ratio, n, direction] of [[0.5, 5, 'right'], [0.3, 7, 'left'], [0, 4, 'right'], [0.8, 3, 'right']] as const) {
    const s = svgOf('doppler_wavefronts', { speedRatio: ratio, fronts: n, direction });
    const f = fronts(s);
    assert.equal(f.length, n);
    const lambda = f[0].r;
    f.forEach((c, i) => near(c.r, (i + 1) * lambda, 0.02));
    const dir = direction === 'right' ? 1 : -1;
    for (let i = 1; i < n; i++) {
      near(dir * ((f[i].cx + dir * f[i].r) - (f[i - 1].cx + dir * f[i - 1].r)), (1 - ratio) * lambda, 0.03);
      near(dir * ((f[i - 1].cx - dir * f[i - 1].r) - (f[i].cx - dir * f[i].r)), (1 + ratio) * lambda, 0.03);
    }
    // The newest front is centred one period's travel behind the source.
    const g = dopplerGeometry(dopplerModel(reader('doppler_wavefronts', { speedRatio: ratio, fronts: n, direction })), 8);
    near(dir * (g.xs - f[0].cx), ratio * lambda, 0.02);
    assert.ok(f.every((c) => c.cy === f[0].cy), 'all on the line of motion');
  }
  // Given as two speeds, the ratio is theirs.
  near(dopplerModel(reader('doppler_wavefronts', { waveSpeed: 340, sourceSpeed: 85 })).ratio, 0.25, 1e-12);
  // Everything stays inside the 360-wide canvas, whatever the ratio.
  for (const ratio of [0, 0.5, 1, 1.5, 3]) {
    const g = dopplerGeometry(dopplerModel(reader('doppler_wavefronts', { speedRatio: ratio, fronts: 8, observers: [{ position: 'ahead' }, { position: 'behind' }] })), 8);
    for (const c of g.circles) assert.ok(c.cx - c.r >= 10 && c.cx + c.r <= 350, `ratio ${ratio}`);
    for (const o of g.observers) assert.ok(o.x >= 14 && o.x <= 346, `ratio ${ratio}`);
  }
});

test('simple: only the names are printed; the observers sit outside the fronts, ahead on the side the arrow points to', () => {
  const s = svg('doppler-simple-half-speed');
  assert.deepEqual(texts(s), ['S', 'X', 'Y', 'source', 'observers (at rest)']);
  const g = dopplerGeometry(dopplerModel(reader('doppler_wavefronts', P('doppler-simple-half-speed'))), 8);
  const [x, y] = [g.observers.find((o) => o.label === 'X'), g.observers.find((o) => o.label === 'Y')];
  assert.ok(x && y && x.x > g.xs && y.x < g.xs);
  assert.equal(count(s, /<polygon /g), 1, 'one velocity arrow');
  const left = dopplerGeometry(dopplerModel(reader('doppler_wavefronts', { ...P('doppler-simple-half-speed'), direction: 'left' })), 8);
  assert.ok((left.observers.find((o) => o.label === 'X') as { x: number }).x < left.xs, 'moving left, "ahead" is on the left');
});

test('speeds, ratio and frequency: each printed, a "?" or absent; a value that is hidden is nowhere on the figure', () => {
  const dense = svg('doppler-dense-speeds-frequency');
  for (const t of ['102 m/s', 'Wave speed: 340 m/s', 'Source frequency: 500 Hz', '1', '2', 'A siren moving past two listeners']) assert.ok(has(dense, t), t);
  assert.ok(!has(dense, 'P') && !has(dense, 'Q'), 'letterLabels: numerals');
  assert.equal(count(dense, /r="1\.9"/g), 7, 'an emission point per front');
  const blank = svg('doppler-blank-source-speed');
  assert.equal(count(blank, BLANK_BOX), 1);
  assert.ok(!texts(blank).some((t) => t.includes('68')), 'the hidden source speed is not printed');
  const base = { waveSpeed: 340, sourceSpeed: 34, frequency: 500 };
  const none = svgOf('doppler_wavefronts', { ...base, showSourceSpeed: 'none', showWaveSpeed: 'none', showFrequency: 'none' });
  assert.deepEqual(texts(none), ['S', 'source (moving as the arrow shows)']);
  const all = svgOf('doppler_wavefronts', { ...base, showSourceSpeed: 'blank', showWaveSpeed: 'blank', showFrequency: 'blank', showRatio: 'blank' });
  assert.equal(count(all, BLANK_BOX), 4);
  assert.ok(!/340|34 m|500|0\.1/.test(texts(all).join('|')));
  assert.ok(has(svgOf('doppler_wavefronts', { ...base, showRatio: 'value' }), 'Source speed ÷ wave speed: 0.1'));
  assert.ok(has(svgOf('doppler_wavefronts', { speedRatio: 0.5, letterLabels: 'roman', observers: [{ position: 'behind', label: 'A' }, { position: 'ahead', label: 'B' }] }), 'II'));
});

test('supersonic: the Mach lines leave the source at asin(v/vₛ) and touch every front; the angle is a value, a "?" or absent', () => {
  near(machAngle(2), 30, 1e-9);
  near(machAngle(1.5), 41.8103, 1e-4);
  near(machAngle(3), 19.4712, 1e-4);
  const s = svg('doppler-supersonic-cone');
  assert.equal(count(s, BLANK_BOX), 1);
  assert.ok(has(s, 'Source speed ÷ wave speed: 2') && !texts(s).some((t) => t.includes('30')));
  const g = dopplerGeometry(dopplerModel(reader('doppler_wavefronts', P('doppler-supersonic-cone'))), 8);
  const lines = [...s.matchAll(/<path d="M([\d.-]+),([\d.-]+)L([\d.-]+),([\d.-]+)" fill="none" stroke="#111827" stroke-width="2\.2"\/>/g)].map((m) => m.slice(1).map(Number));
  assert.equal(lines.length, 2);
  for (const [x1, y1, x2, y2] of lines) {
    near(x1, g.xs, 0.01);
    near(Math.abs(Math.atan2(y2 - y1, x1 - x2)) * (180 / Math.PI), 30, 0.05);
    // Tangent: the distance from each front's centre to the line is that front's radius.
    for (const c of g.circles) near(Math.abs((y2 - y1) * c.cx - (x2 - x1) * g.yc + x2 * y1 - y2 * x1) / Math.hypot(y2 - y1, x2 - x1), c.r, 0.05);
  }
  for (const c of g.circles) assert.ok(c.cx + c.r < g.xs, 'the source is ahead of every front');
  assert.ok(has(svgOf('doppler_wavefronts', { speedRatio: 2, shockCone: true, coneAngle: 'value' }), '30°'));
  assert.equal(count(svgOf('doppler_wavefronts', { speedRatio: 2 }), /stroke-width="2\.2"/g), 0, 'no cone unless asked');
});

test('doppler: refusals name the param; a ratio that merges the fronts warns', () => {
  throwsSpec('doppler_wavefronts', {}, /speedRatio .* is required/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, waveSpeed: 340, sourceSpeed: 34 }, /not both/);
  throwsSpec('doppler_wavefronts', { waveSpeed: 340 }, /sourceSpeed must be a finite number/);
  throwsSpec('doppler_wavefronts', { speedRatio: 3.5 }, /above 3/);
  throwsSpec('doppler_wavefronts', { speedRatio: -1 }, /speedRatio must be 0 or more/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, fronts: 9 }, /fronts must be a whole number from 3 to 8/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, direction: 'up' }, /direction must be one of right, left/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, observers: [{ position: 'ahead' }, { position: 'ahead', label: 'Z' }] }, /two observers ahead/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, observers: [{ position: 'beside' }] }, /observers\[0\]\.position/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, observers: [{ position: 'ahead', label: 'S' }] }, /also the label of an observer/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, showSourceSpeed: 'value' }, /showSourceSpeed: "value" needs waveSpeed and sourceSpeed/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, showFrequency: 'value' }, /needs frequency/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, shockCone: true }, /only when the source is faster/);
  throwsSpec('doppler_wavefronts', { speedRatio: 2, coneAngle: 'value' }, /coneAngle needs shockCone/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, letterLabels: 'greek' }, /letterLabels must be one of numerals, roman/);
  throwsSpec('doppler_wavefronts', { speedRatio: 0.5, showRatio: 'yes' }, /showRatio must be one of value, blank, none/);
  assert.deepEqual(warn('doppler_wavefronts', { speedRatio: 0.9, fronts: 8 }), ['crowded']);
  assert.deepEqual(warn('doppler_wavefronts', { speedRatio: 1.05, fronts: 3, shockCone: true, coneAngle: 'blank' }), ['crowded']);
  assert.deepEqual(warn('doppler_wavefronts', { speedRatio: 3, fronts: 3, shockCone: true, coneAngle: 'blank' }), []);
  assert.deepEqual(warn('doppler_wavefronts', { speedRatio: 0.8, fronts: 4 }), []);
});

console.log('\nphotoelectric_setup — tube:\n');

test('tube: the model is hf − φ (frequency in 10¹⁴ Hz or wavelength in nm); the labels print what is asked', () => {
  const m = photoelectricModel(reader('photoelectric_setup', P('photo-tube-simple-sodium'))) as PhotoTubeModel;
  near(m.photonEnergy, 3.1, 1e-12);
  near(m.keMax, 0.82, 1e-12);
  const k = photoelectricModel(reader('photoelectric_setup', P('photo-tube-dense-stopping-voltage'))) as PhotoTubeModel;
  near(k.photonEnergy, 3.102, 1e-12);
  const s = svg('photo-tube-simple-sodium');
  assert.deepEqual(texts(s).sort(), ['+', 'collector', 'electrons', 'evacuated tube', 'light, λ = 400 nm', 'sodium plate', 'variable voltage', 'µA', 'φ = 2.28 eV', '−'].sort());
  assert.equal(count(s, / rx="24"/g), 1, 'the tube is a rounded rectangle');
  assert.equal(count(s, /stroke="#c2410c"/g), 3, 'three rays of light');
  const d = svg('photo-tube-dense-stopping-voltage');
  for (const t of ['light, f = 7.5 × 10¹⁴ Hz', 'potassium plate', 'φ = 2.3 eV', 'stopping voltage: 0.8 V', 'Measuring the stopping voltage']) assert.ok(has(d, t), t);
});

test('tube: light, work function and stopping voltage can each be a "?" or absent; electrons are drawn only when asked', () => {
  const b = svg('photo-tube-blank-work-function');
  assert.equal(count(b, BLANK_BOX), 2);
  assert.ok(has(b, 'φ =') && has(b, 'stopping voltage:') && !texts(b).some((t) => /4\.31|0\.65/.test(t)));
  assert.ok(!has(b, 'electrons'), 'no electrons unless asked — the picture does not say whether any leave');
  const base = { variant: 'tube', frequency: 6, workFunction: 2.14 };
  const none = svgOf('photoelectric_setup', { ...base, showLight: 'none', showWorkFunction: 'none' });
  assert.deepEqual(texts(none).sort(), ['+', 'collector', 'evacuated tube', 'light', 'metal plate', 'variable voltage', 'µA', '−'].sort());
  const lightBlank = svgOf('photoelectric_setup', { ...base, showLight: 'blank' });
  assert.ok(has(lightBlank, 'light, f =') && count(lightBlank, BLANK_BOX) === 1 && !texts(lightBlank).some((t) => t.includes('6 ×')));
  // Light too weak to eject anything: drawable (the question may ask just that), but never with electrons or a stopping voltage.
  const weak = { variant: 'tube', wavelength: 400, workFunction: 4.7, metal: 'copper' };
  assert.ok(has(svgOf('photoelectric_setup', weak), 'copper plate'));
  throwsSpec('photoelectric_setup', { ...weak, showElectrons: true }, /showElectrons: the light \(3\.1 eV per photon\) cannot eject electrons/);
  throwsSpec('photoelectric_setup', { ...weak, showStoppingVoltage: 'value' }, /no stopping voltage to print/);
  assert.equal(count(svgOf('photoelectric_setup', { ...weak, showStoppingVoltage: 'blank' }), BLANK_BOX), 1);
});

test('tube: refusals name the param', () => {
  throwsSpec('photoelectric_setup', {}, /variant must be one of tube, graph/);
  throwsSpec('photoelectric_setup', { variant: 'tube', workFunction: 2 }, /exactly one of frequency .* and wavelength/);
  throwsSpec('photoelectric_setup', { variant: 'tube', frequency: 6, wavelength: 500, workFunction: 2 }, /exactly one of/);
  throwsSpec('photoelectric_setup', { variant: 'tube', frequency: 6e14, workFunction: 2 }, /frequency is in units of 10¹⁴ Hz/);
  throwsSpec('photoelectric_setup', { variant: 'tube', wavelength: 4e-7, workFunction: 2 }, /wavelength is in nm/);
  throwsSpec('photoelectric_setup', { variant: 'tube', frequency: 6 }, /workFunction must be a finite number/);
  throwsSpec('photoelectric_setup', { variant: 'tube', frequency: 6, workFunction: 2, metal: 'molybdenum' }, /metal is longer than 9 characters/);
  throwsSpec('photoelectric_setup', { variant: 'tube', frequency: 6, workFunction: 2, showLight: 'hidden' }, /showLight must be one of value, blank, none/);
});

console.log('\nphotoelectric_setup — graph:\n');

/** The data lines of a graph (stroke width 2.4): [x1, y1, x2, y2] in canvas units. */
const dataLines = (s: string): number[][] => [...s.matchAll(/<path d="M([\d.-]+),([\d.-]+)L([\d.-]+),([\d.-]+)" fill="none" stroke="#[0-9a-f]{6}" stroke-width="2\.4"/g)].map((m) => m.slice(1).map(Number));

test('graph: each line starts on the frequency axis at the threshold and has the slope h on the axes drawn', () => {
  const m = photoelectricModel(reader('photoelectric_setup', P('photo-graph-simple-one-metal'))) as PhotoGraphModel;
  near(m.metals[0].workFunction, 5 * H14, 1e-12);
  const s = svg('photo-graph-simple-one-metal');
  const [line] = dataLines(s);
  // Canvas → data through the numbered grid: the x ticks 0 … 12 and the y ticks of the frame.
  const two = svg('photo-graph-dense-two-metals-extended');
  const [a, b] = dataLines(two);
  near((a[3] - a[1]) / (a[2] - a[0]), (b[3] - b[1]) / (b[2] - b[0]), 0.002);   // parallel
  assert.ok(b[0] > a[0], 'the larger threshold starts further right');
  near(a[1], b[1], 0.01);
  assert.ok(line[3] < line[1] && line[2] > line[0], 'rises to the right');
  const wf = photoelectricModel(reader('photoelectric_setup', { variant: 'graph', metals: [{ workFunction: 2.28 }] })) as PhotoGraphModel;
  near(wf.metals[0].threshold, 2.28 / 0.4136, 1e-12);
  assert.deepEqual(wf.xRange, [0, 12]);
  // The dense graph: second metal dashed, both continued by thin dashes; a legend names them.
  assert.equal(count(two, /stroke-width="1\.3" stroke-dasharray="3 3"/g), 2);
  assert.equal(count(two, /stroke-width="2\.4" stroke-dasharray="6 5"/g), 1);
  for (const t of ['metal P', 'metal Q', 'R', 'S', 'Frequency (× 10¹⁴ Hz)', 'Maximum kinetic energy (eV)']) assert.ok(has(two, t), t);
  near(m.marks.length, 0);
  const marks = (photoelectricModel(reader('photoelectric_setup', P('photo-graph-dense-two-metals-extended'))) as PhotoGraphModel).marks;
  near(marks[0].ke, 6 * H14, 1e-12);
  near(marks[1].ke, 5 * H14, 1e-12);
});

test('graph: nothing is labelled unless asked; threshold, intercept and slope are each a value, a "?" or absent', () => {
  const s = svg('photo-graph-simple-one-metal');
  assert.ok(!texts(s).some((t) => /f₀|slope|eV$/.test(t)));
  const b = svg('photo-graph-blank-threshold-slope');
  assert.equal(count(b, BLANK_BOX), 2);
  assert.deepEqual(texts(b).filter((t) => t !== '?').sort(), ['Frequency', 'Maximum kinetic energy', 'f₀ =', 'slope =', '−2.28 eV'].sort());
  assert.ok(!texts(b).some((t) => /5\.51|4\.14/.test(t)), 'the hidden threshold and slope are nowhere on the figure');
  const v = svg('photo-graph-labelled-values');
  for (const t of ['f₀ = 5.51', 'slope =', '4.14 × 10⁻¹⁵ eV·s']) assert.ok(has(v, t), t);
  assert.equal(count(v, BLANK_BOX), 0);
});

test('graph: refusals name the param; labels that have no room warn', () => {
  throwsSpec('photoelectric_setup', { variant: 'graph' }, /metals must be an array/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{}] }, /metals\[0\]: give exactly one of workFunction/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ workFunction: 2, threshold: 5 }] }, /exactly one of/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }, { threshold: 5 }] }, /would coincide/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }, { threshold: 7 }], thresholdLabel: 'value' }, /thresholdLabel is for a graph of one metal/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }], workFunctionLabel: 'value' }, /workFunctionLabel needs extend/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }], fMax: 6 }, /fMax \(6\) leaves no line to see/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }], extend: true, yRange: [-1, 4] }, /yRange must start at −2\.07 or below/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }], marks: [{ frequency: 3 }] }, /marks\[0\]\.frequency \(3\) is not on the line/);
  throwsSpec('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 5 }], marks: [{ frequency: 8, metal: 1 }] }, /marks\[0\]\.metal must be the 0-based index/);
  assert.ok(warn('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 1 }], fMax: 12, thresholdLabel: 'value' }).includes('crowded'));
  assert.ok(warn('photoelectric_setup', { variant: 'graph', metals: [{ threshold: 9 }], fMax: 12, slopeLabel: 'value' }).includes('crowded'));
});

void finish();
