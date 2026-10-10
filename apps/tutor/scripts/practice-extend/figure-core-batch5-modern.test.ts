/**
 * Tests for scripts/practice-extend/figure-core-batch5-modern.ts
 * (doppler_wavefronts, photoelectric_setup), reached the way the job reaches
 * it — through figure-core.ts.
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * textbook-standard cases with known answers; the transcription says what is
 * printed, keeps a blank blank and never names what a question asks for.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch5-modern.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b5-modern';
import { BATCH5_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch5-modern';

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
const D = (params: Args): PracticeFigureSpec => ({ type: 'doppler_wavefronts', params });
const Tube = (params: Args): PracticeFigureSpec => ({ type: 'photoelectric_setup', params: { variant: 'tube', ...params } });
const Graph = (params: Args): PracticeFigureSpec => ({ type: 'photoelectric_setup', params: { variant: 'graph', ...params } });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;
const BOTH = [{ position: 'ahead' }, { position: 'behind' }];

test('registration: the part speaks for its two kinds; its checkers are in BATCH5_CHECKERS and in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['doppler_wavefronts', 'photoelectric_setup']);
  for (const k of Object.keys(PART.checkers)) assert.equal(BATCH5_CHECKERS[k], PART.checkers[k], k);
  const cat = checkerCatalogue(['doppler_wavefronts', 'photoelectric_setup']);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
  refused(() => run({ type: 'bar_chart', params: { categories: ['a'], values: [1] } }, 'doppler_mach_number'), /is for doppler_wavefronts, not for bar_chart/);
  refused(() => run(fx('doppler-simple-half-speed'), 'photo_ke_max'), /is for photoelectric_setup, not for doppler_wavefronts/);
});

test('doppler transcription: what is drawn and printed; a "?" stays a blank; no ratio, speed or pitch that is not printed', () => {
  const simple = textOf(fx('doppler-simple-half-speed'));
  assert.ok(/The figure is a wavefront diagram of a moving source\./.test(simple));
  assert.ok(/5 circular wavefronts/.test(simple) && /points to the right/.test(simple) && /closer together on the right of the source \(ahead of it\)/.test(simple));
  assert.ok(simple.includes('observer label: "X"') && /labelled "X" .* to the right of the source: the source is moving towards it/.test(simple));
  assert.ok(/labelled "Y" .* to the left of the source: the source is moving away from it/.test(simple));
  assert.ok(!/0\.5|higher|lower|pitch/.test(simple), 'the hidden ratio and the answer are not in the text');
  const dense = textOf(fx('doppler-dense-speeds-frequency'));
  for (const w of ['arrow label: "102 m/s"', 'key line: "Wave speed: 340 m/s"', 'key line: "Source frequency: 500 Hz"', 'observer label: "1"', 'observer label: "2"']) assert.ok(dense.includes(w), w);
  assert.ok(/points to the left/.test(dense) && /labelled "1" .* to the left of the source: the source is moving towards it/.test(dense) && /A small dot marks the centre of each front/.test(dense));
  const blank = textOf(fx('doppler-blank-source-speed'));
  assert.ok(blank.includes('arrow label: (blank — a "?" box)') && !blank.includes('68'));
  const cone = textOf(fx('doppler-supersonic-cone'));
  assert.ok(/The source is outside every front/.test(cone) && /edges of a cone/.test(cone) && cone.includes('cone angle label: (blank — a "?" box)') && cone.includes('key line: "Source speed ÷ wave speed: 2"'));
  assert.ok(!/30/.test(cone), 'the hidden angle is not in the text');
  assert.ok(/Every front passes through the source itself/.test(textOf(fx('doppler-sonic-fronts-touch'))));
  assert.ok(/concentric circles, evenly spaced/.test(textOf(D({ speedRatio: 0 }))));
});

test('photoelectric transcription: tube and graph; a "?" stays a blank; hidden values are never named', () => {
  const tube = textOf(fx('photo-tube-simple-sodium'));
  assert.ok(/The figure is a diagram of a photoelectric tube\./.test(tube));
  for (const w of ['light label: "light, λ = 400 nm"', 'plate label: "sodium plate"', 'work function label: "φ = 2.28 eV"', 'word: "electrons"', 'meter label: "µA"', 'source label: "variable voltage"']) assert.ok(tube.includes(w), w);
  assert.ok(!/0\.82|3\.1\b/.test(tube), 'neither the photon energy nor KE_max is in the text');
  const blank = textOf(fx('photo-tube-blank-work-function'));
  assert.ok(blank.includes('work function label: "φ =" (blank — a "?" box)') && blank.includes('source label: "stopping voltage:" (blank — a "?" box)') && /No electrons are drawn/.test(blank));
  assert.ok(!/4\.31|0\.65/.test(blank));
  const dense = textOf(fx('photo-tube-dense-stopping-voltage'));
  assert.ok(dense.includes('source label: "stopping voltage: 0.8 V"') && dense.includes('light label: "light, f = 7.5 × 10¹⁴ Hz"'));
  const graph = textOf(fx('photo-graph-simple-one-metal'));
  assert.ok(/The figure is a graph of maximum kinetic energy against frequency for the photoelectric effect\./.test(graph));
  assert.ok(/numbered from 0 to 12 in steps of 2/.test(graph) && /rises to the right from a point on the frequency axis at 5\b/.test(graph));
  const two = textOf(fx('photo-graph-dense-two-metals-extended'));
  assert.ok(two.includes('legend entry: "metal P"') && /straight dashed line \(legend: "metal Q"\) .* at 7; thin dashes continue it/.test(two) && /The two lines are parallel/.test(two));
  assert.ok(/lettered "S" is on the dashed line at frequency 12/.test(two) && two.includes('point label: "R"'));
  const hidden = textOf(fx('photo-graph-blank-threshold-slope'));
  assert.ok(hidden.includes('threshold label: "f₀ =" (blank — a "?" box)') && hidden.includes('slope label: "slope =" (blank — a "?" box)') && hidden.includes('intercept label: "−2.28 eV"'));
  assert.ok(!/5\.51|4\.14|at 5/.test(hidden) && /the frequency axis not numbered/.test(hidden));
  // A threshold between gridlines is not read out.
  assert.ok(!/axis at/.test(textOf(Graph({ metals: [{ workFunction: 2.28 }] }))));
});

test('describeForAlt: names only what is printed, counts blanks, never a hidden value', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && /^[A-Z]/.test(alt) && /\.$/.test(alt), `${f.id}: ${alt}`);
  }
  const blank = describeForAlt(fx('doppler-blank-source-speed'));
  assert.ok(/One place is left blank/.test(blank) && !blank.includes('68') && blank.includes('"Wave speed: 340 m/s"'), blank);
  const cone = describeForAlt(fx('doppler-supersonic-cone'));
  assert.ok(/One place is left blank/.test(cone) && !/30/.test(cone), cone);
  const tube = describeForAlt(fx('photo-tube-blank-work-function'));
  assert.ok(/Two places are left blank/.test(tube) && !/4\.31|0\.65/.test(tube) && tube.includes('"light, λ = 250 nm"'), tube);
  const graph = describeForAlt(fx('photo-graph-blank-threshold-slope'));
  assert.ok(/Two places are left blank/.test(graph) && !/5\.51|4\.14/.test(graph), graph);
  assert.ok(!describeForAlt(fx('photo-tube-simple-sodium'), { hide: ['2.28 eV'] }).includes('2.28'));
});

test('doppler_observed_frequency / doppler_wavelength: textbook cases ahead and behind; hidden values must be given', () => {
  // Sound at 340 m/s, a 500 Hz source at 34 m/s: 555.6 Hz ahead, 454.5 Hz behind; fronts 0.612 m and 0.748 m apart.
  const a = D({ waveSpeed: 340, sourceSpeed: 34, frequency: 500, observers: BOTH });
  rw(a, 'doppler_observed_frequency', { observer: 'X' }, '555.6', '454.5');
  rw(a, 'doppler_observed_frequency', { observer: 'Y' }, '454.5', '555.6');
  rw(a, 'doppler_wavelength', { observer: 'X' }, '0.612', '0.68');
  rw(a, 'doppler_wavelength', { observer: 'Y' }, '0.748', '0.68');
  // An ambulance siren of 700 Hz at 30 m/s, sound at 343 m/s: 767.1 Hz approaching, 643.7 Hz receding.
  const b = D({ waveSpeed: 343, sourceSpeed: 30, frequency: 700, observers: BOTH });
  rw(b, 'doppler_observed_frequency', { observer: 'X' }, '767.1', '761.2');
  rw(b, 'doppler_observed_frequency', { observer: 'Y' }, '643.7', '638.8');
  // A train whistle of 400 Hz at 20 m/s, sound at 340 m/s: 425 Hz exactly ahead, 377.8 Hz behind.
  const c = D({ waveSpeed: 340, sourceSpeed: 20, frequency: 400, observers: BOTH });
  rw(c, 'doppler_observed_frequency', { observer: 'X' }, '425', '423.5');
  rw(c, 'doppler_observed_frequency', { observer: 'Y' }, '377.8', '376.5');
  // Only the ratio printed: f′ = f/(1 − r).
  rw(D({ speedRatio: 0.2, showRatio: 'value', frequency: 440, observers: BOTH }), 'doppler_observed_frequency', { observer: 'X' }, '550', '528');
  // The dense fixture (102 m/s in 340 m/s, 500 Hz): observer "1" is ahead.
  rw(fx('doppler-dense-speeds-frequency'), 'doppler_observed_frequency', { observer: '1' }, '714.3', '384.6');
  // Hidden: the drawing alone settles nothing.
  refused(() => run(fx('doppler-simple-half-speed'), 'doppler_observed_frequency', { observer: 'X' }), /does not print it — give it as a derivation argument .*"waveSpeed" and "sourceSpeed", or "speedRatio"/);
  refused(() => run(fx('doppler-blank-source-speed'), 'doppler_observed_frequency', { observer: 'X' }), /"waveSpeed" and "sourceSpeed", or "speedRatio"/);
  rw(fx('doppler-blank-source-speed'), 'doppler_observed_frequency', { observer: 'X', sourceSpeed: 68 }, '600', '400');
  refused(() => run(D({ waveSpeed: 340, sourceSpeed: 34, observers: BOTH }), 'doppler_observed_frequency', { observer: 'X' }), /the source frequency: .*"frequency"/);
  refused(() => run(a, 'doppler_observed_frequency', { observer: 'Q' }), /must be the label of an observer on the figure \("X", "Y"\)/);
  refused(() => run(D({ speedRatio: 2, showRatio: 'value', frequency: 500, observers: BOTH }), 'doppler_observed_frequency', { observer: 'X' }), /no wavefront has reached a point ahead/);
  refused(() => run(D({ speedRatio: 0.2, showRatio: 'value', frequency: 440, observers: BOTH }), 'doppler_wavelength', { observer: 'X' }), /the wave speed: .*"waveSpeed"/);
});

test('doppler_source_speed / doppler_higher_frequency: the speed behind a "?"; who hears the higher pitch', () => {
  // 480 Hz heard as 600 Hz ahead in 340 m/s sound: 68 m/s.
  rw(fx('doppler-blank-source-speed'), 'doppler_source_speed', { observer: 'X', observedFrequency: 600 }, '68', '85');
  // 500 Hz heard as 454.5 Hz behind: about 34 m/s; as 555.6 Hz ahead likewise.
  const a = D({ waveSpeed: 340, sourceSpeed: 34, showSourceSpeed: 'blank', frequency: 500, observers: BOTH });
  rw(a, 'doppler_source_speed', { observer: 'Y', observedFrequency: 454.5454545454545 }, '34', '30.9');
  rw(a, 'doppler_source_speed', { observer: 'X', observedFrequency: 555.5555555555555 }, '34', '37.8');
  rw(D({ waveSpeed: 343, sourceSpeed: 30, showSourceSpeed: 'blank', frequency: 700, observers: BOTH }), 'doppler_source_speed', { observer: 'X', observedFrequency: 767.1 }, '30.0', '27.4');
  refused(() => run(a, 'doppler_source_speed', { observer: 'X', observedFrequency: 450 }), /receives a HIGHER frequency/);
  refused(() => run(a, 'doppler_source_speed', { observer: 'X' }), /"observedFrequency" must be a number/);
  const who = run(fx('doppler-simple-half-speed'), 'doppler_higher_frequency');
  assert.deepEqual(who, { kind: 'label', value: 'X' });
  const mcq = { responseFormat: 'mcq' as const, choices: ['Observer X', 'Observer Y', 'Both the same', 'Neither receives any waves'] };
  assert.equal(compareDerived(item(fx('doppler-simple-half-speed'), { ...mcq, answer: 'A' }), who).match, true);
  assert.equal(compareDerived(item(fx('doppler-simple-half-speed'), { ...mcq, answer: 'B' }), who).match, false);
  assert.deepEqual(run(fx('doppler-dense-speeds-frequency'), 'doppler_higher_frequency'), { kind: 'label', value: '1' });
  refused(() => run(fx('doppler-blank-source-speed'), 'doppler_higher_frequency'), /needs an observer ahead of the source and one behind/);
  refused(() => run(D({ speedRatio: 0, observers: BOTH }), 'doppler_higher_frequency'), /not moving/);
});

test('doppler_mach_number / doppler_cone_angle: sin θ = v/vₛ — Mach 2 → 30°, Mach 1.5 → 41.8°, Mach 3 → 19.5°', () => {
  rw(fx('doppler-supersonic-cone'), 'doppler_cone_angle', {}, '30', '60');
  rw(D({ speedRatio: 1.5, showRatio: 'value' }), 'doppler_cone_angle', {}, '41.8', '48.2');
  rw(D({ speedRatio: 3, showRatio: 'value' }), 'doppler_cone_angle', {}, '19.5', '70.5');
  rw(D({ waveSpeed: 340, sourceSpeed: 680 }), 'doppler_cone_angle', {}, '30', '26.6');
  rw(D({ waveSpeed: 340, sourceSpeed: 680 }), 'doppler_mach_number', {}, '2', '0.5');
  rw(D({ waveSpeed: 340, sourceSpeed: 85 }), 'doppler_mach_number', {}, '0.25', '4');
  // From a printed cone angle alone: 1 ÷ sin 30° = 2.
  rw(D({ speedRatio: 2, shockCone: true, coneAngle: 'value' }), 'doppler_mach_number', {}, '2', '1.15');
  refused(() => run(D({ speedRatio: 2, shockCone: true }), 'doppler_mach_number'), /does not print it/);
  refused(() => run(D({ speedRatio: 2, shockCone: true, coneAngle: 'blank' }), 'doppler_cone_angle'), /does not print it/);
  rw(D({ speedRatio: 2, shockCone: true, coneAngle: 'blank' }), 'doppler_cone_angle', { waveSpeed: 340, sourceSpeed: 510 }, '41.8', '30');
  refused(() => run(D({ waveSpeed: 340, sourceSpeed: 170 }), 'doppler_cone_angle'), /only when the source is faster/);
});

test('photo_photon_energy / photo_ke_max / photo_stopping_voltage: textbook metals (sodium 2.28 eV, potassium 2.30, zinc 4.31, caesium 2.14)', () => {
  // Sodium, 400 nm: 3.10 eV photons, KE_max 0.82 eV, stopping voltage 0.82 V.
  const na = fx('photo-tube-simple-sodium');
  rw(na, 'photo_photon_energy', {}, '3.1', '2.28');
  rw(na, 'photo_ke_max', {}, '0.82', '3.1');
  rw(na, 'photo_stopping_voltage', {}, '0.82', '5.38');
  // Potassium, 7.5 × 10¹⁴ Hz: 3.102 eV photons, 0.80 eV.
  const k = Tube({ frequency: 7.5, workFunction: 2.3 });
  rw(k, 'photo_photon_energy', {}, '3.10', '3.00');
  rw(k, 'photo_ke_max', {}, '0.80', '0.90');
  // Zinc, 250 nm: 4.96 eV photons, 0.65 eV.
  const zn = Tube({ wavelength: 250, workFunction: 4.31 });
  rw(zn, 'photo_photon_energy', {}, '4.96', '4.31');
  rw(zn, 'photo_ke_max', {}, '0.65', '9.27');
  rw(zn, 'photo_stopping_voltage', {}, '0.65', '0.56');
  // Caesium, 6.0 × 10¹⁴ Hz: 2.48 eV photons, 0.34 eV.
  rw(Tube({ frequency: 6, workFunction: 2.14 }), 'photo_ke_max', {}, '0.34', '0.43');
  // The printed stopping voltage is the kinetic energy in eV.
  rw(fx('photo-tube-dense-stopping-voltage'), 'photo_stopping_voltage', {}, '0.8', '2.3');
  // From the graph: threshold 5.0, light of 10 × 10¹⁴ Hz → 0.4136 × 5 = 2.068 eV.
  rw(fx('photo-graph-simple-one-metal'), 'photo_ke_max', { frequency: 10 }, '2.07', '4.14');
  rw(fx('photo-graph-dense-two-metals-extended'), 'photo_ke_max', { frequency: 12, metal: 1 }, '2.07', '3.31');
  rw(fx('photo-graph-simple-one-metal'), 'photo_stopping_voltage', { frequency: 8 }, '1.24', '3.31');
  // Copper (4.70 eV) under 400 nm light: nothing leaves.
  refused(() => run(Tube({ wavelength: 400, workFunction: 4.7 }), 'photo_ke_max'), /no electrons are emitted/);
  // Hidden values are refused, or supplied.
  const hidden = fx('photo-tube-blank-work-function');
  refused(() => run(hidden, 'photo_ke_max'), /work function is hidden behind a "\?"/);
  rw(hidden, 'photo_ke_max', { workFunction: 4.31 }, '0.65', '0.56');
  rw(hidden, 'photo_ke_max', { stoppingVoltage: 0.65 }, '0.65', '4.31');
  refused(() => run(Tube({ wavelength: 400, workFunction: 2.28, showLight: 'blank' }), 'photo_photon_energy'), /wavelength of the light is hidden behind a "\?"/);
  rw(Tube({ wavelength: 400, workFunction: 2.28, showLight: 'blank' }), 'photo_photon_energy', { wavelength: 400 }, '3.1', '2.28');
  refused(() => run(fx('photo-graph-simple-one-metal'), 'photo_ke_max'), /give the light as the derivation argument "frequency"/);
  refused(() => run(na, 'photo_stopping_voltage', { stoppingVoltage: 1 }), /is what this checker finds/);
  refused(() => run(na, 'photo_photon_energy', { frequency: 5, wavelength: 600 }), /not both/);
});

test('photo_work_function / photo_threshold_frequency / photo_planck_slope: read, labelled, or found from a stopping voltage', () => {
  // φ = hf − eV_stop: 250 nm (4.96 eV), 0.65 V → 4.31 eV (zinc); threshold 4.31 / 0.4136 = 10.42 × 10¹⁴ Hz.
  const hidden = fx('photo-tube-blank-work-function');
  rw(hidden, 'photo_work_function', { stoppingVoltage: 0.65 }, '4.31', '5.61');
  rw(hidden, 'photo_threshold_frequency', { stoppingVoltage: 0.65 }, '10.42', '11.99');
  refused(() => run(hidden, 'photo_work_function'), /hidden behind a "\?" — give "workFunction", or the measured "stoppingVoltage"/);
  refused(() => run(hidden, 'photo_work_function', { workFunction: 4.31 }), /is what this checker finds/);
  // Sodium: 2.28 eV ↔ 5.51 × 10¹⁴ Hz; caesium 2.14 eV ↔ 5.17; potassium 2.30 eV ↔ 5.56.
  rw(fx('photo-tube-simple-sodium'), 'photo_work_function', {}, '2.28', '3.1');
  rw(fx('photo-tube-simple-sodium'), 'photo_threshold_frequency', {}, '5.51', '7.5');
  rw(Tube({ frequency: 6, workFunction: 2.14 }), 'photo_threshold_frequency', {}, '5.17', '6');
  rw(Tube({ frequency: 7.5, workFunction: 2.3 }), 'photo_threshold_frequency', {}, '5.56', '7.5');
  // The graph: a threshold on a gridline is read; one between gridlines is not, unless labelled.
  rw(fx('photo-graph-simple-one-metal'), 'photo_threshold_frequency', {}, '5', '12');
  rw(fx('photo-graph-simple-one-metal'), 'photo_work_function', {}, '2.07', '5');
  rw(fx('photo-graph-dense-two-metals-extended'), 'photo_threshold_frequency', { metal: 1 }, '7', '4');
  rw(fx('photo-graph-dense-two-metals-extended'), 'photo_work_function', { metal: 0 }, '1.65', '2.90');
  refused(() => run(Graph({ metals: [{ workFunction: 2.28 }] }), 'photo_threshold_frequency'), /does not leave the frequency axis on a gridline/);
  rw(fx('photo-graph-labelled-values'), 'photo_threshold_frequency', {}, '5.51', '5');
  rw(fx('photo-graph-blank-threshold-slope'), 'photo_threshold_frequency', {}, '5.51', '5.15');   // the printed −2.28 eV intercept ÷ h
  refused(() => run(Graph({ metals: [{ workFunction: 2.28 }], xNumbers: false, thresholdLabel: 'blank' }), 'photo_work_function'), /frequency axis is not numbered and the label is a "\?"/);
  refused(() => run(fx('photo-graph-simple-one-metal'), 'photo_threshold_frequency', { metal: 1 }), /0-based index of a metal/);
  // The slope is h = 4.14 × 10⁻¹⁵ eV·s whatever the metal.
  rw(fx('photo-graph-simple-one-metal'), 'photo_planck_slope', {}, '4.14', '6.63');
  rw(fx('photo-graph-labelled-values'), 'photo_planck_slope', {}, '4.136', '2.28');
  refused(() => run(fx('photo-graph-blank-threshold-slope'), 'photo_planck_slope'), /its label is a "\?" and the axes are not both numbered/);
  refused(() => run(fx('photo-tube-simple-sodium'), 'photo_planck_slope'), /graph variant/);
});

test('photo_emits / photo_larger_work_function: above or below threshold; which line starts further right', () => {
  const yes = run(fx('photo-tube-simple-sodium'), 'photo_emits');
  assert.deepEqual(yes, { kind: 'label', value: 'yes' });
  const mcq = { responseFormat: 'mcq' as const, choices: ['Yes', 'No', 'Only with brighter light', 'Only after a delay'] };
  assert.equal(compareDerived(item(fx('photo-tube-simple-sodium'), { ...mcq, answer: 'A' }), yes).match, true);
  assert.equal(compareDerived(item(fx('photo-tube-simple-sodium'), { ...mcq, answer: 'B' }), yes).match, false);
  // Copper (4.70 eV) under 400 nm; zinc (4.31 eV) under 300 nm (4.13 eV): no. Zinc under 250 nm: yes.
  assert.deepEqual(run(Tube({ wavelength: 400, workFunction: 4.7 }), 'photo_emits'), { kind: 'label', value: 'no' });
  assert.deepEqual(run(Tube({ wavelength: 300, workFunction: 4.31 }), 'photo_emits'), { kind: 'label', value: 'no' });
  assert.deepEqual(run(Tube({ wavelength: 250, workFunction: 4.31 }), 'photo_emits'), { kind: 'label', value: 'yes' });
  // On the graph: threshold 5 — light of 4 × 10¹⁴ Hz does not, 6 × 10¹⁴ Hz does.
  assert.deepEqual(run(fx('photo-graph-simple-one-metal'), 'photo_emits', { frequency: 4 }), { kind: 'label', value: 'no' });
  assert.deepEqual(run(fx('photo-graph-simple-one-metal'), 'photo_emits', { frequency: 6 }), { kind: 'label', value: 'yes' });
  refused(() => run(fx('photo-graph-simple-one-metal'), 'photo_emits', { frequency: 5 }), /borderline/);
  refused(() => run(fx('photo-tube-blank-work-function'), 'photo_emits'), /work function is hidden/);
  const larger = run(fx('photo-graph-dense-two-metals-extended'), 'photo_larger_work_function');
  assert.deepEqual(larger, { kind: 'label', value: 'metal Q' });
  const two = { responseFormat: 'mcq' as const, choices: ['metal P', 'metal Q', 'They are equal', 'It cannot be told'] };
  assert.equal(compareDerived(item(fx('photo-graph-dense-two-metals-extended'), { ...two, answer: 'B' }), larger).match, true);
  assert.equal(compareDerived(item(fx('photo-graph-dense-two-metals-extended'), { ...two, answer: 'A' }), larger).match, false);
  refused(() => run(fx('photo-graph-simple-one-metal'), 'photo_larger_work_function'), /one metal only/);
});

test('examineFigureItem: a right key is derived, a wrong key is a mismatch', () => {
  const spec = fx('doppler-blank-source-speed');
  const base = { problemText: 'The observer X in the figure hears a frequency of 600 Hz. What is the speed of the source marked "?", in m/s?', alt: describeForAlt(spec), derivation: { checker: 'doppler_source_speed', args: { observer: 'X', observedFrequency: 600 } } };
  const ok = examineFigureItem(item(spec, { ...base, answer: '68' }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  assert.equal(examineFigureItem(item(spec, { ...base, answer: '85' })).derivation.status, 'mismatch');
  const tube = fx('photo-tube-simple-sodium');
  const t = examineFigureItem(item(tube, { problemText: 'Light falls on the sodium plate in the figure. What is the maximum kinetic energy of the electrons, in eV? (hc = 1240 eV·nm)', answer: '0.82', alt: describeForAlt(tube), derivation: { checker: 'photo_ke_max', args: {} } }));
  assert.deepEqual(t.defects, []);
  assert.equal(t.derivation.status, 'derived');
  assert.ok(t.figureText?.includes('photoelectric tube'));
  const graph = fx('photo-graph-simple-one-metal');
  const g = examineFigureItem(item(graph, { problemText: 'The graph shows the maximum kinetic energy of photoelectrons from a metal. What is its threshold frequency, in units of 10¹⁴ Hz?', answer: '5', alt: describeForAlt(graph), derivation: { checker: 'photo_threshold_frequency', args: {} } }));
  assert.deepEqual(g.defects, []);
  assert.equal(g.derivation.status, 'derived');
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), `${k} has no test`);
});

console.log(`${passed} figure-core-batch5-modern test(s) passed`);
