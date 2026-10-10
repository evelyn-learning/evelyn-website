/**
 * Tests for scripts/practice-extend/figure-core-batch4-chem.ts (energy_levels,
 * heating_curve, electrochemical_cell), reached the way the job reaches it —
 * through figure-core.ts (`describeFigure`, `describeForAlt`, `runChecker`,
 * `compareDerived`, `examineFigureItem`, `checkerCatalogue`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected,
 * and textbook-standard cases with known answers. Per kind: the transcription
 * says what is printed, keeps a blank blank, and never names what is hidden.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch4-chem.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b4-chem';
import { BATCH4_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART, orbitalViolation } from './figure-core-batch4-chem';

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
const S = (type: string, params: Args): PracticeFigureSpec => ({ type, params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;
const orb = (...diagrams: Args[]): PracticeFigureSpec => S('energy_levels', { variant: 'orbital_boxes', diagrams });
const cfg = (config: string, extra: Args = {}): PracticeFigureSpec => orb({ config, ...extra });
const hyd = (nMax: number, transitions: Args[] = [], extra: Args = {}): PracticeFigureSpec => S('energy_levels', { variant: 'levels', hydrogen: { nMax }, transitions, ...extra });
const WATER = { mass: 10, meltingPoint: 0, boilingPoint: 100, cSolid: 2.09, cLiquid: 4.18, cGas: 2.01, heatFusion: 334, heatVaporization: 2260 };
const cell = (left: string, right: string, anode: 'left' | 'right', extra: Args = {}): PracticeFigureSpec => S('electrochemical_cell', { left: { electrode: left }, right: { electrode: right }, anode, ...extra });

// ── registration ────────────────────────────────────────────────────────────

test('the part is registered: its kinds, its checkers in the catalogue, every fixture transcribed', () => {
  assert.deepEqual([...PART.kinds], ['energy_levels', 'heating_curve', 'electrochemical_cell']);
  for (const name of Object.keys(PART.checkers)) assert.equal(BATCH4_CHECKERS[name], PART.checkers[name], name);
  const cat = checkerCatalogue(['energy_levels', 'heating_curve', 'electrochemical_cell'] as never);
  for (const name of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${name} `), name);
  for (const f of FIXTURES) assert.ok(/^The figure is an? /.test(textOf(f.spec)), f.id);
  refused(() => run(fx('heating-simple-lettered'), 'orbital_count', { want: 'electrons' }), /is for energy_levels, not for heating_curve/);
});

// ── orbital boxes ───────────────────────────────────────────────────────────

test('orbital boxes: the transcription lists every box as drawn, wrong fillings included; a "?" box stays blank', () => {
  const t = textOf(fx('orbital-dense-which-ground-state'));
  assert.ok(t.includes('the diagram labelled "III" — "1s": [up, down]; "2s": [up, up]; "2p": [up, down] [up] [up]; "3s": [empty].'), t);
  assert.ok(!/Hund|Pauli|Aufbau|ground/.test(t), 'no rule is named');
  const b = textOf(fx('orbital-blank-oxygen-2p'));
  assert.ok(b.includes('"2p": [(blank — a "?" box)] [(blank — a "?" box)] [(blank — a "?" box)]'), b);
  const d = describeFigure(orb({ core: 'Ar', config: '4s2 3d10 4p3' }));
  assert.ok(d.printed.includes('core: "[Ar]"') && d.printed.includes('subshell label: "3d"'));
  const none = textOf(S('energy_levels', { variant: 'orbital_boxes', subshellLabels: 'none', diagrams: [{ config: '1s2 2s2 2p2' }] }));
  assert.ok(none.includes('a group of 3 boxes: [up] [up] [empty]') && !none.includes('"2p"'), none);
});

test('orbital_count: electrons, unpaired electrons, paired and empty orbitals — textbook atoms', () => {
  // N: 7 electrons, 3 unpaired. O: 8, 2. Fe: 26, 4. Cr ([Ar] 4s1 3d5): 24, 6. As with an [Ar] core: 33, 3.
  rw(cfg('1s2 2s2 2p3'), 'orbital_count', { want: 'electrons' }, '7', '5');
  rw(cfg('1s2 2s2 2p3'), 'orbital_count', { want: 'unpaired' }, '3', '1');
  rw(cfg('1s2 2s2 2p4'), 'orbital_count', { want: 'unpaired' }, '2', '4');
  rw(fx('orbital-ladder-iron'), 'orbital_count', { want: 'unpaired' }, '4', '6');
  rw(fx('orbital-ladder-iron'), 'orbital_count', { want: 'electrons' }, '26', '24');
  rw(cfg('4s1 3d5', { core: 'Ar' }), 'orbital_count', { want: 'unpaired' }, '6', '4');
  rw(fx('orbital-core-wrap-arsenic'), 'orbital_count', { want: 'electrons' }, '33', '15');
  rw(cfg('1s2 2s2 2p4'), 'orbital_count', { want: 'paired_orbitals' }, '3', '4');
  rw(cfg('1s2 2s2 2p1'), 'orbital_count', { want: 'empty_orbitals' }, '2', '1');
  rw(fx('orbital-dense-which-ground-state'), 'orbital_count', { want: 'unpaired', diagram: 'IV' }, '4', '2');
  refused(() => run(fx('orbital-blank-oxygen-2p'), 'orbital_count', { want: 'unpaired' }), /a box of the diagram is blank/);
  refused(() => run(cfg('1s2'), 'orbital_count', { want: 'electrons', diagram: 'Z' }), /no diagram is labelled "Z"/);
});

test('orbital_configuration and orbital_element: the configuration as drawn; the neutral atom', () => {
  rw(cfg('1s2 2s2 2p3'), 'orbital_configuration', {}, '1s² 2s² 2p³', '1s² 2s² 2p⁴');
  rw(cfg('1s2 2s2 2p6 3s1'), 'orbital_configuration', { style: 'plain' }, '1s2 2s2 2p6 3s1', '1s2 2s2 2p6');
  rw(fx('orbital-core-wrap-arsenic'), 'orbital_configuration', {}, '[Ar] 4s² 3d¹⁰ 4p³', '[Ar] 4s² 4p³');
  rw(cfg('1s2 2s2 2p3'), 'orbital_element', {}, 'nitrogen', 'oxygen');
  rw(cfg('1s2 2s2 2p6 3s2 3p5'), 'orbital_element', {}, 'chlorine', 'sulfur');
  rw(fx('orbital-ladder-iron'), 'orbital_element', { as: 'symbol' }, 'Fe', 'F');
  rw(fx('orbital-core-wrap-arsenic'), 'orbital_element', {}, 'arsenic', 'phosphorus');
  rw(cfg('4s1 3d10', { core: 'Ar' }), 'orbital_element', { as: 'symbol' }, 'Cu', 'Zn');
  refused(() => run(cfg('2s2 2p3'), 'orbital_element', {}), /leaves out a lower subshell/);
  refused(() => run(fx('orbital-blank-oxygen-2p'), 'orbital_element', {}), /blank/);
});

test('orbital_violation and orbital_ground_state: Pauli, Aufbau and Hund on purpose-drawn wrong diagrams', () => {
  const f = fx('orbital-dense-which-ground-state');
  rw(f, 'orbital_violation', { diagram: 'I' }, "Hund's rule", 'Pauli exclusion principle');
  rw(f, 'orbital_violation', { diagram: 'III' }, 'Pauli exclusion principle', "Hund's rule");
  rw(f, 'orbital_violation', { diagram: 'IV' }, 'Aufbau principle', "Hund's rule");
  refused(() => run(f, 'orbital_violation', { diagram: 'II' }), /valid ground-state filling/);
  rw(f, 'orbital_ground_state', {}, 'II', 'III');
  // Unlike single spins break Hund's rule; chromium and copper are not Aufbau mistakes; 4s before 3d is the right order.
  assert.equal(orbitalViolation({ subshells: [{ name: '2p', n: 2, l: 1, boxes: ['u', 'd', ''] }] }), "Hund's rule");
  refused(() => run(cfg('4s1 3d5', { core: 'Ar' }), 'orbital_violation', {}), /valid ground-state/);
  refused(() => run(cfg('4s1 3d10', { core: 'Ar' }), 'orbital_violation', {}), /valid ground-state/);
  rw(orb({ core: 'Ar', subshells: [{ name: '4s', electrons: 0 }, { name: '3d', electrons: 3 }] }), 'orbital_violation', {}, 'Aufbau principle', 'Pauli exclusion principle');
  refused(() => run(orb({ subshells: [{ name: '1s', boxes: ['uu'] }, { name: '2p', boxes: ['ud', '', ''] }] }), 'orbital_violation', {}), /more than one rule/);
  refused(() => run(orb({ label: 'I', config: '1s2' }, { label: 'II', config: '1s2 2s1' }), 'orbital_ground_state', {}), /2 of the 2 diagrams are valid/);
});

// ── level ladders ───────────────────────────────────────────────────────────

test('levels: the transcription gives the levels bottom-up, arrows by direction, the blank as a blank, and says when it is not to scale', () => {
  const t = textOf(fx('levels-blank-hydrogen-n3'));
  assert.ok(t.includes('3. labelled "n = 3" on the left; its energy is (blank — a "?" box).'), t);
  assert.ok(!t.includes('1.51'), 'the hidden energy is not transcribed');
  assert.ok(t.includes('the arrow labelled "X" points down from the level labelled "n = 3" to the level labelled "n = 2".'), t);
  assert.ok(t.includes('"not to scale" is printed'), t);
  const d = describeFigure(fx('levels-dense-hydrogen-five-transitions'));
  assert.ok(d.printed.includes('energy label: "−13.6 eV"') && d.printed.includes('level label: "n = ∞"') && d.printed.includes('arrow label: "S"'));
  assert.ok(d.text.includes('the arrow labelled "S" points up from'), d.text);
  assert.ok(textOf(fx('levels-simple-three-levels')).includes('spaced in proportion'));
});

test('level_transition_energy / level_photon: the hydrogen lines every textbook lists', () => {
  const h = hyd(4, [{ from: 2, to: 1, label: 'L' }, { from: 3, to: 2, label: 'A' }, { from: 4, to: 2, label: 'B' }, { from: 1, to: 3, label: 'U' }]);
  // Lyman-α 10.2 eV / 121.6 nm; H-α 1.89 eV / 656 nm; H-β 2.55 eV / 486.2 nm (a rounded value needs a decimal in the key unless it is whole).
  rw(h, 'level_transition_energy', { transition: 'L' }, '10.2', '13.6');
  rw(h, 'level_transition_energy', { transition: 'A' }, '1.89', '1.51');
  rw(h, 'level_transition_energy', { transition: 'B' }, '2.55', '2.25');
  rw(h, 'level_transition_energy', { transition: 'U' }, '12.09', '10.2');
  rw(h, 'level_photon', { transition: 'A', want: 'wavelength_nm' }, '656', '486');
  rw(h, 'level_photon', { transition: 'B', want: 'wavelength_nm' }, '486.2', '434.0');
  rw(h, 'level_photon', { transition: 'L', want: 'wavelength_nm' }, '121.6', '102.6');
  rw(h, 'level_photon', { transition: 'A', want: 'frequency_1e14_Hz' }, '4.57', '6.17');
  rw(h, 'level_photon', { transition: 'L', want: 'frequency_1e14_Hz' }, '24.7', '4.57');
  rw(fx('levels-simple-three-levels'), 'level_transition_energy', { transition: 'A' }, '9', '6');
  // Joules: a 3.0 × 10⁻¹⁹ J gap is a 662.1 nm photon.
  const j = S('energy_levels', { variant: 'levels', units: 'J', levels: [{ energy: 0 }, { energy: 3e-19 }], transitions: [{ from: 2, to: 1 }] });
  rw(j, 'level_photon', { transition: 0, want: 'wavelength_nm' }, '662.1', '456.0');
  const kj = S('energy_levels', { variant: 'levels', units: 'kJ/mol', levels: [{ energy: 0 }, { energy: 300 }], transitions: [{ from: 2, to: 1 }] });
  refused(() => run(kj, 'level_photon', { transition: 0, want: 'wavelength_nm' }), /eV or J, not "kJ\/mol"/);
});

test('levels: a hidden energy is refused unless the ladder is hydrogen with its n printed; level_energy recomputes a "?"', () => {
  const custom = S('energy_levels', { variant: 'levels', levels: [{ energy: -8 }, { energy: -3, energy_shown: 'blank' }, { energy: -1 }], transitions: [{ from: 2, to: 1, label: 'A' }, { from: 3, to: 1, label: 'B' }] });
  refused(() => run(custom, 'level_transition_energy', { transition: 'A' }), /not printed on the figure \(a "\?" box\)/);
  rw(custom, 'level_transition_energy', { transition: 'B' }, '7', '5');
  const b = fx('levels-blank-hydrogen-n3');
  rw(b, 'level_energy', { level: 3 }, '-1.51', '-3.4');
  rw(b, 'level_energy', { level: 2 }, '−3.4', '−1.51');
  rw(b, 'level_transition_energy', { transition: 'X' }, '1.89', '2.55');
  refused(() => run(hyd(4, [{ from: 3, to: 2 }], { energies: 'none', levelLabels: 'none' }), 'level_transition_energy', { transition: 0 }), /not printed/);
  refused(() => run(custom, 'level_energy', { level: 2 }), /only a hydrogen ladder/);
  refused(() => run(hyd(3), 'level_transition_energy', { transition: 0 }), /no transition arrows/);
});

test('level_extreme_transition and level_transition_kind', () => {
  const f = fx('levels-dense-hydrogen-five-transitions');
  // P 2→1 10.2 eV, Q 4→2 2.55, R 6→3 1.13, S 1→3 12.09 (absorption), T 5→4 0.306.
  rw(f, 'level_extreme_transition', { want: 'shortest_wavelength', among: 'emission' }, 'P', 'S');
  rw(f, 'level_extreme_transition', { want: 'largest_energy' }, 'S', 'P');
  rw(f, 'level_extreme_transition', { want: 'longest_wavelength' }, 'T', 'R');
  rw(f, 'level_extreme_transition', { want: 'lowest_frequency', among: 'emission' }, 'T', 'Q');
  rw(f, 'level_transition_kind', { transition: 'S' }, 'absorption', 'emission');
  rw(f, 'level_transition_kind', { transition: 'Q' }, 'emission', 'absorption');
  refused(() => run(f, 'level_extreme_transition', { want: 'largest_energy', among: 'absorption' }), /is one transition to compare/);
  refused(() => run(hyd(3, [{ from: 2, to: 1, label: 'A' }, { from: 1, to: 2, label: 'B' }]), 'level_extreme_transition', { want: 'largest_energy' }), /tie/);
});

// ── heating curves ──────────────────────────────────────────────────────────

test('heating curve: the transcription gives the segments by shape and (numbered axes only) by corner — never a phase name; blanks stay blank', () => {
  const t = textOf(fx('heating-simple-lettered'));
  assert.ok(t.includes('2. labelled "B": flat from (2, 0) to (8, 0).') && t.includes('1. labelled "A": rises from (0, −20) to (2, 0).'), t);
  assert.ok(!/solid|liquid|gas|melt|boil/i.test(t), 'no phase or change of state is named');
  const c = textOf(fx('heating-blank-plateaus-cooling'));
  assert.ok(c.includes('A cooling curve') && c.includes('2. labelled "II": flat; its temperature is (blank — a "?" box).') && c.includes('without numbers'), c);
  assert.ok(!/100|\b20\b/.test(c), 'no hidden temperature leaks');
  const d = describeFigure(fx('heating-dense-water-computed'));
  assert.ok(d.printed.includes('plateau label: "100 °C"') && d.printed.includes('point label: "Q"') && d.printed.includes('segment label: "E"'));
});

test('heating_segment / heating_segment_for / heating_point: water, a cooling curve, and what a three-segment curve cannot settle', () => {
  const f = fx('heating-simple-lettered');
  rw(f, 'heating_segment', { segment: 'B', want: 'process' }, 'melting', 'boiling');
  rw(f, 'heating_segment', { segment: 'D', want: 'process' }, 'boiling', 'melting');
  rw(f, 'heating_segment', { segment: 'B', want: 'state' }, 'solid and liquid', 'liquid and gas');
  rw(f, 'heating_segment', { segment: 'E', want: 'state' }, 'gas', 'liquid');
  rw(f, 'heating_segment_for', { want: 'liquid' }, 'C', 'B');
  rw(f, 'heating_segment_for', { want: 'boiling' }, 'D', 'B');
  rw(f, 'heating_point', { want: 'melting_point' }, '0', '80');
  rw(f, 'heating_point', { want: 'boiling_point' }, '80', '100');
  const cool = S('heating_curve', { corners: [[0, 140], [3, 100], [12, 100], [17, 20], [21, 20], [24, -10]], segmentLabels: 'letters', yStep: 20 });
  rw(cool, 'heating_segment', { segment: 'B', want: 'process' }, 'condensing', 'freezing');
  rw(cool, 'heating_segment', { segment: 'D', want: 'process' }, 'freezing', 'melting');
  rw(cool, 'heating_segment', { segment: 0, want: 'state' }, 'gas', 'solid');
  rw(cool, 'heating_point', { want: 'melting_point' }, '20', '100');
  const w = S('heating_curve', { substance: WATER, startTemp: -40, endTemp: 140, segmentLabels: 'letters', plateauLabels: 'value' });
  rw(w, 'heating_point', { want: 'boiling_point' }, '100', '0');
  rw(w, 'heating_segment_for', { want: 'melting' }, 'B', 'D');
  refused(() => run(f, 'heating_segment', { segment: 'A', want: 'process' }), /single phase/);
  refused(() => run(fx('heating-blank-plateaus-cooling'), 'heating_point', { want: 'melting_point' }), /"\?" box and the temperature axis has no numbers/);
  const three = S('heating_curve', { corners: [[0, 20], [4, 60], [10, 60], [12, 80]], segmentLabels: 'letters' });
  refused(() => run(three, 'heating_segment', { segment: 'B', want: 'process' }), /does not show both changes of state/);
  refused(() => run(S('heating_curve', { substance: WATER, startTemp: 20, endTemp: 80 }), 'heating_point', { want: 'boiling_point' }), /no boiling plateau/);
});

test('heating_heat / heating_time / heating_specific_heat / heating_latent_heat: read off the axes, or from the data — water\'s textbook numbers', () => {
  const f = fx('heating-simple-lettered');
  rw(f, 'heating_heat', { segment: 'D' }, '12', '26');
  rw(f, 'heating_heat', { segment: 'B' }, '6', '8');
  rw(f, 'heating_heat', {}, '28', '26');
  // 20 g sample: C rises 80 °C on 6 kJ → 3.75 J/(g·°C); B takes 6 kJ → 300 J/g; D 12 kJ → 600 J/g.
  rw(f, 'heating_specific_heat', { segment: 'C', mass: 20 }, '3.75', '0.27');
  rw(f, 'heating_latent_heat', { segment: 'B', mass: 20 }, '300', '600');
  rw(f, 'heating_latent_heat', { segment: 'D', mass: 20 }, '600', '300');
  // 10 g of water from its constants: melt 3.34 kJ, warm 0→100 4.18 kJ, boil 22.6 kJ; all of −40 → 140: 31.76 kJ.
  const w = S('heating_curve', { substance: WATER, startTemp: -40, endTemp: 140, segmentLabels: 'letters' });
  rw(w, 'heating_heat', { segment: 'B', fromData: true }, '3.34', '33.4');
  rw(w, 'heating_heat', { segment: 'C', fromData: true }, '4.18', '41.8');
  rw(w, 'heating_heat', { segment: 'D', fromData: true }, '22.6', '2.26');
  rw(w, 'heating_heat', { fromData: true }, '31.76', '30.12');
  refused(() => run(w, 'heating_heat', { segment: 'B' }), /between gridlines/);
  refused(() => run(f, 'heating_heat', { segment: 'B', fromData: true }), /given by its corners/);
  refused(() => run(fx('heating-blank-plateaus-cooling'), 'heating_heat', { segment: 1 }), /no numbers/);
  // Time axis: 500 W heater, 100 g of water: melting takes 33 400 J / 500 W = 66.8 s.
  const timed = S('heating_curve', { substance: { ...WATER, mass: 100 }, startTemp: 0, endTemp: 50, xQuantity: 'time', timeUnit: 's', power: 500 });
  rw(timed, 'heating_heat', { segment: 0, fromData: true }, '33.4', '66.8');
  const tc = S('heating_curve', { corners: [[0, 20], [4, 60], [10, 60], [12, 80]], xQuantity: 'time' });
  rw(tc, 'heating_time', { segment: 1 }, '6', '10');
  refused(() => run(tc, 'heating_heat', { segment: 1 }), /no heating power is given/);
  refused(() => run(f, 'heating_time', { segment: 1 }), /heat, not time/);
  refused(() => run(f, 'heating_specific_heat', { segment: 'B', mass: 20 }), /flat/);
  refused(() => run(f, 'heating_latent_heat', { segment: 'C', mass: 20 }), /sloped/);
});

// ── electrochemical cells ───────────────────────────────────────────────────

test('cell: the transcription names what is printed; the anode is not given away unless the figure shows it', () => {
  const t = textOf(fx('cell-simple-daniell'));
  assert.ok(t.includes('Left: electrode labelled "Zn"; solution labelled "1.0 M ZnSO₄" under the beaker.'), t);
  assert.ok(!/anode|cathode|oxidi|toward/i.test(t), 'nothing says which electrode is the anode');
  const b = textOf(fx('cell-blank-roles-and-flow'));
  assert.ok(b.includes('the label over it is (blank — a "?" box)') && b.includes('the direction of electron flow is not shown') && b.includes('Under the voltmeter: (blank — a "?" box).'), b);
  assert.ok(!/anode|cathode/i.test(b));
  const d = describeFigure(fx('cell-dense-all-labels'));
  assert.ok(d.printed.includes('role label: "anode"') && d.printed.includes('ion label: "NO₃⁻"') && d.printed.includes('meter reading: "0.46 V"') && d.printed.includes('sign: "+"'));
  assert.ok(d.text.includes('"NO₃⁻" with an arrow pointing toward the right beaker') && d.text.includes('pointing from the right electrode toward the left electrode'), d.text);
  const e = textOf(fx('cell-electrolytic-simple-molten'));
  assert.ok(e.includes('the long thin plate (the positive terminal) is on the side of the left electrode') && e.includes('The liquid is labelled "molten NaCl".'), e);
});

test('cell_electrode / cell_electron_flow / cell_ion_migration: Daniell, silver–copper, iron–nickel', () => {
  const zn = fx('cell-simple-daniell');
  const E = { leftE: -0.76, rightE: 0.34 };
  rw(zn, 'cell_electrode', { want: 'anode', ...E }, 'Zn', 'Cu');
  rw(zn, 'cell_electrode', { want: 'cathode', ...E }, 'Cu', 'Zn');
  rw(zn, 'cell_electrode', { want: 'positive', ...E }, 'Cu', 'Zn');
  rw(zn, 'cell_electron_flow', E, 'from Zn to Cu', 'from Cu to Zn');
  rw(zn, 'cell_ion_migration', { ion: 'anion', ...E }, 'Zn', 'Cu');
  rw(zn, 'cell_ion_migration', { ion: 'cation', ...E }, 'Cu', 'Zn');
  refused(() => run(zn, 'cell_electrode', { want: 'anode' }), /nothing on the figure shows which electrode is the anode/);
  refused(() => run(zn, 'cell_electrode', { want: 'anode', leftE: 0.34, rightE: -0.76 }), /would run the other way/);
  const fe = fx('cell-blank-roles-and-flow');
  rw(fe, 'cell_electrode', { want: 'anode', leftE: -0.25, rightE: -0.44 }, 'Fe', 'Ni');
  rw(fe, 'cell_electron_flow', { leftE: -0.25, rightE: -0.44 }, 'Fe to Ni', 'Ni to Fe');
  const ag = fx('cell-dense-all-labels');
  rw(ag, 'cell_electrode', { want: 'anode' }, 'Cu', 'Ag');
  rw(ag, 'cell_electrode', { want: 'negative' }, 'Cu', 'Ag');
  refused(() => run(ag, 'cell_electron_flow', {}), /electron arrow is printed/);
  refused(() => run(ag, 'cell_ion_migration', { ion: 'anion' }), /ion arrows are printed/);
  // Electrolytic: the battery shows it. Anode = the electrode on the positive terminal.
  const na = fx('cell-electrolytic-simple-molten');
  rw(na, 'cell_electrode', { want: 'cathode' }, 'Y', 'X');
  rw(na, 'cell_electrode', { want: 'positive' }, 'X', 'Y');
  rw(na, 'cell_ion_migration', { ion: 'cation' }, 'Y', 'X');
  rw(fx('cell-electrolytic-blank-roles'), 'cell_electrode', { want: 'cathode' }, 'P', 'Q');
  refused(() => run(cell('?', 'Cu', 'left', { roles: 'value' }), 'cell_electrode', { want: 'anode' }), /name is a "\?" box/);
});

test('cell_potential / cell_delta_g / cell_mass_deposited: standard textbook cells', () => {
  // Zn|Cu 1.10 V, ΔG° = −212 kJ; Cu|Ag 0.46 V, −88.8 kJ; Fe|Ni 0.19 V; Al|Cu (n = 6) 2.00 V, −1158 kJ.
  rw(fx('cell-simple-daniell'), 'cell_potential', { leftE: -0.76, rightE: 0.34 }, '1.10', '0.42');
  rw(fx('cell-blank-roles-and-flow'), 'cell_potential', { leftE: -0.25, rightE: -0.44 }, '0.19', '0.69');
  rw(cell('Cu', 'Ag', 'left'), 'cell_potential', { leftE: 0.34, rightE: 0.8 }, '0.46', '1.14');
  rw(fx('cell-simple-daniell'), 'cell_delta_g', { leftE: -0.76, rightE: 0.34, n: 2 }, '-212.3', '212.3');
  rw(cell('Cu', 'Ag', 'left'), 'cell_delta_g', { leftE: 0.34, rightE: 0.8, n: 2 }, '−88.8', '−44.4');
  rw(cell('Al', 'Cu', 'left'), 'cell_delta_g', { leftE: -1.66, rightE: 0.34, n: 6 }, '-1157.8', '-386.0');
  refused(() => run(fx('cell-dense-all-labels'), 'cell_potential', { leftE: 0.8, rightE: 0.34 }), /voltmeter reading is printed/);
  refused(() => run(fx('cell-simple-daniell'), 'cell_potential', {}), /leftE.*rightE.*needed/);
  // Electrolysis of molten NaCl: E°(Na⁺/Na) = −2.71 at the cathode (right), E°(Cl₂/Cl⁻) = +1.36 at the anode (left) → −4.07 V.
  rw(fx('cell-electrolytic-simple-molten'), 'cell_potential', { leftE: 1.36, rightE: -2.71 }, '-4.07', '4.07');
  // Faraday: 2.00 A for 965 s plates 2.16 g Ag; 1.50 A for 3600 s plates 1.78 g Cu; 10.0 A for 3600 s gives 3.36 g Al.
  const e = fx('cell-electrolytic-dense-plating');
  rw(e, 'cell_mass_deposited', { current: 2, time: 965, n: 1, molarMass: 107.87 }, '2.16', '1.08');
  rw(e, 'cell_mass_deposited', { current: 1.5, time: 3600, n: 2, molarMass: 63.55 }, '1.78', '3.56');
  rw(e, 'cell_mass_deposited', { current: 10, time: 3600, n: 3, molarMass: 26.98 }, '3.36', '10.07');
  refused(() => run(fx('cell-simple-daniell'), 'cell_mass_deposited', { current: 2, time: 965, n: 1, molarMass: 107.87 }), /electrolytic/);
});

// ── through the job's own gates ─────────────────────────────────────────────

test('describeForAlt: names only what is printed, counts the blanks, never the hidden value; hide drops a label', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && /^[A-Z]/.test(alt), `${f.id}: ${alt}`);
  }
  const alt = describeForAlt(fx('levels-blank-hydrogen-n3'));
  assert.ok(/One place is left blank/.test(alt) && !alt.includes('1.51') && alt.includes('"n = 3"'), alt);
  assert.ok(/Three places are left blank/.test(describeForAlt(fx('orbital-blank-oxygen-2p'))));
  assert.ok(/Four places are left blank/.test(describeForAlt(fx('cell-blank-roles-and-flow'))));
  const hidden = describeForAlt(fx('cell-dense-all-labels'), { hide: ['anode', 'cathode'] });
  assert.ok(!/anode|cathode/.test(hidden) && hidden.includes('"Ag"'), hidden);
  assert.ok(/^A heating curve/.test(describeForAlt(fx('heating-simple-lettered'))) && !/marked point/.test(describeForAlt(fx('heating-simple-lettered'))));
});

test('examineFigureItem: a right key is derived, a wrong key is a defect, a hidden reading is an error', () => {
  const good = examineFigureItem(item(fx('orbital-ladder-iron'), { problemText: 'The orbital diagram of a neutral atom is shown. How many unpaired electrons does it have?', answer: '4', alt: 'An orbital energy diagram with rows of boxes.', derivation: { checker: 'orbital_count', args: { want: 'unpaired' } } }));
  assert.deepEqual(good.defects, []);
  assert.equal(good.derivation.status, 'derived');
  const bad = examineFigureItem(item(fx('heating-simple-lettered'), { responseFormat: 'mcq', problemText: 'The heating curve of a substance is shown. On which segment is it boiling?', choices: ['A', 'B', 'C', 'D'], answer: 'B', alt: 'A heating curve with lettered segments.', derivation: { checker: 'heating_segment_for', args: { want: 'boiling' } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const hid = examineFigureItem(item(fx('cell-simple-daniell'), { responseFormat: 'free', problemText: 'In the cell shown, which electrode is the anode?', answer: 'Zn', alt: 'A galvanic cell.', derivation: { checker: 'cell_electrode', args: { want: 'anode' } } }));
  assert.equal(hid.derivation.status, 'error');
});

test('every checker of the part was exercised', () => {
  for (const name of Object.keys(PART.checkers)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch4-chem test(s) passed`);
