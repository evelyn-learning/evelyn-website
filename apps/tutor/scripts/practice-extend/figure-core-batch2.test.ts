/**
 * Tests for scripts/practice-extend/figure-core-batch2.ts, reached the way the
 * job reaches it — through figure-core.ts (`describeFigure`, `runChecker`,
 * `compareDerived`, `examineFigureItem`, `checkerCatalogue`, `axesOf`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * for the physics / chemistry / biology checkers, three or more
 * textbook-standard cases with known answers. Per kind: the text
 * transcription says what is printed and keeps a blank blank.
 *
 * Pure — no network, no model; the no-db import keeps anything the renderer
 * loads off a database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch2.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { BATCH2_FIXTURES } from '../lib/practice-figure-fixtures';
import { BATCH2_CHECKERS, BATCH2_FIGURE_KINDS, CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { Batch2RuleError, describeBatch2 } from './figure-core-batch2';

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
const fx = (id: string): PracticeFigureSpec => (BATCH2_FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

// ── registration ────────────────────────────────────────────────────────────

test('batch 2 is reached through figure-core.ts and leaves its own lists alone', () => {
  for (const name of Object.keys(BATCH2_CHECKERS)) assert.ok(!(name in CHECKERS), `${name} must not shadow an earlier checker`);
  const cat = checkerCatalogue(BATCH2_FIGURE_KINDS);
  for (const kind of BATCH2_FIGURE_KINDS) assert.ok(cat.includes(`${kind}:\n`), kind);
  for (const [name, d] of Object.entries(BATCH2_CHECKERS)) {
    assert.ok(cat.includes(`- ${name} ${d.args} → ${d.returns}`), name);
    for (const k of d.kinds) assert.ok((BATCH2_FIGURE_KINDS as readonly string[]).includes(k));
  }
  assert.ok(!checkerCatalogue().includes('circuit_'), "the writer's own catalogue is unchanged");
  for (const f of BATCH2_FIXTURES) assert.deepEqual(axesOf(f.spec), {}, f.id);
  refused(() => run(fx('circuit-series-two-resistors'), 'phylo_mrca', { taxa: ['a', 'b'] }), /is for phylogenetic_tree, not for circuit_diagram/);
  refused(() => run(fx('circuit-series-two-resistors'), 'no_such_checker'), /unknown derivation checker/);
  used.delete('no_such_checker');
  // A refusal inside this file surfaces as figure-core's own error class, never as a bare one.
  assert.throws(() => describeBatch2(S('circuit_diagram', { battery: { emf: 6 }, circuit: { type: 'diode' } }), [], []), Batch2RuleError);
  refused(() => describeFigure(S('circuit_diagram', { battery: { emf: 6 }, circuit: { type: 'diode' } })), /circuit\.type must be one of/);
});

test('every fixture has a transcription: what kind of figure, what is printed, what can be read', () => {
  for (const f of BATCH2_FIXTURES) {
    const d = describeFigure(f.spec);
    assert.ok(/^The figure is \S/.test(d.text) && d.text.includes('TEXT PRINTED ON THE FIGURE:') && d.readable.length > 0, f.id);
    assert.ok(!/undefined|NaN|\[object/.test(d.text), `${f.id}: ${d.text}`);
    if (/blank/.test(f.id)) assert.ok(/blank/.test(d.text), `${f.id}: the blank is transcribed as a blank`);
  }
});

test('a transcription says what is printed and never what is under a blank', () => {
  const circuit = textOf(fx('circuit-blank-parallel-bulbs'));
  assert.ok(/bulb .* labelled "A"/.test(circuit) && circuit.includes('3 parallel branches') && circuit.includes('"C₁ = (blank)"'));
  assert.ok(!/9 V|10 μF|6 Ω/.test(circuit), 'the EMF, the capacitance and the bulb resistances are not on the figure');
  assert.ok(/drawn OPEN/.test(textOf(fx('circuit-combination-eight-components'))) && /drawn CLOSED/.test(textOf(fx('circuit-series-two-resistors'))));
  const tree = textOf(fx('phylo-blank-tip-and-trait'));
  assert.ok(tree.includes('"Green algae"') && tree.includes('(blank — a "?" box)') && !tree.includes('Conifers') && !tree.includes('"seeds"'));
  assert.ok(textOf(fx('phylo-five-vertebrates')).includes('followed by "(outgroup)"'));
  const sim = textOf(fx('geometry-blank-similar-triangles'));
  assert.ok(sim.includes('"not to scale"') && sim.includes('labelled "13.5"') && sim.includes('labelled (blank') && !/"12"/.test(sim));
  const par = textOf(fx('geometry-blank-parallel-lines'));
  assert.ok(par.includes('"115°"') && par.includes('"2x + 5°"') && !par.includes('"65°"'));
  const ray = textOf(fx('ray-blank-diverging-lens'));
  assert.ok(ray.includes('object distance d_o = 20 cm') && ray.includes('image distance d_i = (blank)') && !ray.includes('= 10 cm') && /dashed arrow/.test(ray));
  const face = textOf(fx('ray-blank-refraction-interface'));
  assert.ok(face.includes('"air"') && face.includes('n = (blank)') && !face.includes('1.34') && face.includes('"35°"'));
  const field = textOf(fx('field-blank-unknown-charges'));
  assert.ok(field.includes('an empty circle (its sign is not shown)') && field.includes('12 lines meet it') && field.includes('4 lines meet it') && !/marked "[+−]"/.test(field));
  assert.ok(textOf(fx('field-magnetic-force-negative-charge')).includes('No force arrow is drawn'));
  const loop = textOf(fx('flow-blank-feedback-loop'));
  assert.ok(loop.includes('the box holding a "?"') && !loop.includes('Sweating') && loop.includes('carrying a "?" (blank)'));
  const pyr = textOf(fx('flow-blank-energy-pyramid'));
  assert.ok(pyr.includes('"50000 kJ"') && pyr.includes('"Secondary consumers", with the value (blank') && !/"500 kJ"/.test(pyr) && !/10 ?%|transfer/.test(pyr));
  const cone = textOf(fx('solid-blank-cone-slant'));
  assert.ok(cone.includes('"5 cm"') && cone.includes('"12 cm"') && cone.includes('(blank — a "?" box) on the slant height') && !cone.includes('13'));
  assert.ok(!/π|3\/10/.test(textOf(fx('solid-revolution-washer'))));
  const mass = textOf(fx('spectrum-blank-mass-magnesium'));
  assert.ok(mass.includes('"²⁴Mg"') && mass.includes('labelled (blank') && !mass.includes('²⁵Mg'));
  const pes = textOf(fx('spectrum-pes-sodium'));
  assert.ok(pes.includes('INCREASES TO THE LEFT') && pes.includes('peak 3: "3.67" printed over it; height 6 units') && !/2p|sodium/i.test(pes));
});

// ── circuits ────────────────────────────────────────────────────────────────

const R = (name: string, value: number) => ({ type: 'resistor', name, value });
const bulb = (name: string) => ({ type: 'bulb', name, value: 6, show: 'name' });
const circuit = (emf: number, tree: unknown) => S('circuit_diagram', { battery: { emf }, circuit: tree });

test('circuit checkers: series, parallel and combination circuits with textbook answers', () => {
  // 12 V across 4 Ω + 2 Ω in series: 6 Ω, 2 A, 8 V and 4 V, 16 W and 8 W.
  const series = circuit(12, { series: [R('R1', 4), R('R2', 2)] });
  rw(series, 'circuit_equivalent_resistance', {}, '6 Ω', '1.33 Ω');
  rw(series, 'circuit_component', { component: 'battery', quantity: 'current' }, '2 A', '3 A');
  rw(series, 'circuit_component', { component: 'R1', quantity: 'voltage' }, '8 V', '4 V');
  rw(series, 'circuit_component', { component: 'R2', quantity: 'power' }, '8 W', '16 W');
  // 12 V across 6 Ω ∥ 3 Ω: 2 Ω, 6 A in all, 2 A and 4 A in the branches.
  const parallel = circuit(12, { parallel: [R('R1', 6), R('R2', 3)] });
  rw(parallel, 'circuit_equivalent_resistance', {}, '2', '9');
  rw(parallel, 'circuit_component', { component: 'R1', quantity: 'current' }, '2', '4');
  rw(parallel, 'circuit_component', { component: 'R2', quantity: 'current' }, '4', '2');
  rw(parallel, 'circuit_component', { component: 'battery', quantity: 'power' }, '72', '24');
  // 12 V, 4 Ω in series with (6 Ω ∥ 3 Ω): 6 Ω, 2 A; 4 V across the pair; 0.67 A and 1.33 A.
  const combo = circuit(12, { series: [R('R1', 4), { parallel: [R('R2', 6), R('R3', 3)] }] });
  rw(combo, 'circuit_equivalent_resistance', {}, '6', '13');
  rw(combo, 'circuit_component', { component: 'R2', quantity: 'voltage' }, '4', '8');
  rw(combo, 'circuit_component', { component: 'R2', quantity: 'current' }, '0.67', '0.66');
  rw(combo, 'circuit_component', { component: 'R3', quantity: 'current' }, '1.33', '2');
  // Meters: an ammeter reads the series current, a voltmeter the voltage of what it is across.
  const meters = circuit(9, { series: [{ type: 'ammeter', name: 'A1' }, R('R1', 1), { parallel: [R('R2', 2), { type: 'voltmeter', name: 'V1' }] }] });
  rw(meters, 'circuit_component', { component: 'A1', quantity: 'current' }, '3', '4.5');
  rw(meters, 'circuit_component', { component: 'V1', quantity: 'voltage' }, '6', '9');
  rw(meters, 'circuit_component', { component: 'V1', quantity: 'current' }, '0', '3');
  // The dense fixture: S open → 2 + (12 ∥ 4) + 3 = 8 Ω; S closed → 2 + (12 ∥ 6 ∥ 4) + 3 = 7 Ω.
  const dense = fx('circuit-combination-eight-components');
  rw(dense, 'circuit_equivalent_resistance', {}, '8', '7');
  rw(dense, 'circuit_equivalent_resistance', { switches: { S: true } }, '7', '8');
  rw(dense, 'circuit_component', { component: 'R₃', quantity: 'current' }, '0', '1');
  rw(dense, 'circuit_component', { component: 'A', quantity: 'current' }, '3', '3.43');
  rw(dense, 'circuit_component', { component: 'R₄', quantity: 'voltage' }, '9', '10.3');
  refused(() => run(series, 'circuit_component', { component: 'R9', quantity: 'current' }), /no component named "R9"/);
  refused(() => run(series, 'circuit_component', { component: 'R1', quantity: 'charge' }), /must be one of current \| voltage \| power/);
  refused(() => run(circuit(6, { parallel: [R('R1', 3), { type: 'wire' }] }), 'circuit_equivalent_resistance'), /short-circuited/);
  refused(() => run(circuit(6, { series: [R('R1', 3), { type: 'switch', name: 'S', closed: false }] }), 'circuit_equivalent_resistance'), /circuit is open/);
  refused(() => run(circuit(6, { series: [R('R1', 3), { type: 'bulb', name: 'B' }] }), 'circuit_equivalent_resistance'), /has no value/);
});

test('circuit checkers: brightness of identical bulbs, the effect of opening a switch, capacitor networks', () => {
  // A in series with (B ∥ C): A carries all the current.
  const abc = fx('circuit-blank-parallel-bulbs');
  rw(abc, 'circuit_brightness_order', {}, 'A > B = C', 'A = B = C');
  rw(circuit(6, { series: [bulb('A'), bulb('B'), bulb('C')] }), 'circuit_brightness_order', {}, 'A = B = C', 'A > B > C');
  rw(circuit(6, { parallel: [bulb('A'), { series: [bulb('B'), bulb('C')] }] }), 'circuit_brightness_order', {}, 'A > B = C', 'B = C > A');
  // Opening the switch in C's branch: the whole current falls, A dims, B (now in series with A) brightens.
  const sw = circuit(6, { series: [bulb('A'), { parallel: [bulb('B'), { series: [{ type: 'switch', name: 'S' }, bulb('C')] }] }] });
  rw(sw, 'circuit_switch_effect', { switch: 'S', component: 'A', quantity: 'brightness' }, 'decreases', 'increases');
  rw(sw, 'circuit_switch_effect', { switch: 'S', component: 'B', quantity: 'brightness' }, 'It increases', 'It stays the same');
  rw(sw, 'circuit_switch_effect', { switch: 'S', component: 'C', quantity: 'current' }, 'decreases', 'stays the same');
  rw(sw, 'circuit_switch_effect', { switch: 'S', component: 'battery', quantity: 'current' }, 'decreases', 'increases');
  rw(sw, 'circuit_switch_effect', { switch: 'S', quantity: 'resistance' }, 'increases', 'decreases');
  rw(sw, 'circuit_brightness_order', { switches: { S: false } }, 'A = B > C', 'A > B = C');
  // Bulbs in parallel across an ideal battery: opening one branch leaves the other as bright.
  const par = circuit(6, { parallel: [bulb('A'), { series: [{ type: 'switch', name: 'S' }, bulb('B')] }] });
  rw(par, 'circuit_switch_effect', { switch: 'S', component: 'A', quantity: 'brightness' }, 'stays the same', 'increases');
  refused(() => run(sw, 'circuit_switch_effect', { switch: 'A', component: 'B', quantity: 'current' }), /"A" is not a switch/);
  refused(() => run(circuit(6, { series: [R('R1', 2), bulb('A')] }), 'circuit_brightness_order'), /at least two bulbs/);
  // Capacitors: 6 μF and 3 μF — 2 μF in series, 9 μF in parallel; 4 μF in series with (2 ∥ 2) = 2 μF.
  const C = (name: string, value: number) => ({ type: 'capacitor', name, value });
  rw(circuit(12, { series: [C('C1', 6), C('C2', 3)] }), 'circuit_equivalent_capacitance', {}, '2 μF', '9 μF');
  rw(circuit(12, { parallel: [C('C1', 6), C('C2', 3)] }), 'circuit_equivalent_capacitance', {}, '9', '2');
  rw(circuit(12, { series: [C('C1', 4), { parallel: [C('C2', 2), C('C3', 2)] }] }), 'circuit_equivalent_capacitance', {}, '2', '8');
  refused(() => run(circuit(12, { series: [C('C1', 4), R('R1', 2)] }), 'circuit_equivalent_capacitance'), /network of capacitors only/);
});

// ── cladograms ──────────────────────────────────────────────────────────────

test('tree checkers on the vertebrate cladogram and on the nine-taxon tree', () => {
  const v = S('phylogenetic_tree', { tree: { node: 'W', children: ['Lamprey', { node: 'X', traits: ['jaws'], children: ['Trout', { node: 'Y', traits: ['four limbs'], children: ['Frog', { node: 'Z', traits: ['amniotic egg'], children: ['Lizard', { name: 'Mouse', traits: ['hair'] }] }] }] }] } });
  rw(v, 'phylo_mrca', { taxa: ['Frog', 'Mouse'] }, 'Y', 'Z');
  rw(v, 'phylo_mrca', { taxa: ['Lizard', 'Mouse'] }, 'node Z', 'node Y');
  rw(v, 'phylo_mrca', { taxa: ['Lamprey', 'Lizard'] }, 'W', 'X');
  rw(v, 'phylo_sister', { taxon: 'Mouse' }, 'Lizard', 'Frog');
  rw(v, 'phylo_sister', { taxon: 'Frog' }, 'Lizard, Mouse', 'Trout');
  rw(v, 'phylo_sister', { taxon: 'Lamprey' }, 'Trout, Frog, Lizard, Mouse', 'Trout');
  rw(v, 'phylo_shared_trait', { trait: 'four limbs' }, 'Frog, Lizard, Mouse', 'Lizard, Mouse');
  rw(v, 'phylo_shared_trait', { trait: 'jaws', want: 'count' }, '4', '5');
  rw(v, 'phylo_shared_trait', { trait: 'hair' }, 'Mouse', 'Lizard');
  rw(v, 'phylo_monophyletic', { taxa: ['Frog', 'Lizard', 'Mouse'] }, 'Yes', 'No');
  rw(v, 'phylo_monophyletic', { taxa: ['Trout', 'Frog'] }, 'No', 'Yes');           // leaves out descendants of their ancestor
  rw(v, 'phylo_monophyletic', { taxa: ['Lamprey', 'Trout'] }, 'No', 'Yes');        // "fish": not a clade
  rw(v, 'phylo_clade_count', {}, '4', '5');
  rw(v, 'phylo_closer_relative', { taxon: 'Frog', a: 'Mouse', b: 'Trout' }, 'Mouse', 'Trout');
  rw(v, 'phylo_closer_relative', { taxon: 'Trout', a: 'Lamprey', b: 'Lizard' }, 'Lizard', 'Lamprey');
  refused(() => run(v, 'phylo_closer_relative', { taxon: 'Trout', a: 'Mouse', b: 'Lizard' }), /equally related/);
  refused(() => run(v, 'phylo_mrca', { taxa: ['Frog', 'Newt'] }), /no tip named "Newt"/);
  refused(() => run(v, 'phylo_shared_trait', { trait: 'feathers' }), /marks no trait "feathers"/);
  const nine = fx('phylo-nine-taxa-labelled-nodes');
  rw(nine, 'phylo_mrca', { taxa: ['Crocodile', 'Sparrow', 'Turtle'] }, 'F', 'D');
  rw(nine, 'phylo_mrca', { taxa: ['Human', 'Sparrow'] }, 'D', 'C');
  rw(nine, 'phylo_monophyletic', { taxa: ['Turtle', 'Crocodile'] }, 'no', 'yes');  // "reptiles" without birds
  rw(nine, 'phylo_monophyletic', { taxa: ['Platypus', 'Kangaroo', 'Human'] }, 'yes', 'no');
  rw(nine, 'phylo_clade_count', {}, '7', '9');
  rw(nine, 'phylo_shared_trait', { trait: 'amniotic egg', want: 'count' }, '6', '7');
  refused(() => run(nine, 'phylo_sister', { taxon: 'Human' }), /three or more branches/);
  refused(() => run(nine, 'phylo_mrca', { taxa: ['Crocodile', 'Sparrow'] }), /unlabelled node/);
  const blank = fx('phylo-blank-tip-and-trait');
  rw(blank, 'phylo_blank', {}, 'Conifers', 'Ferns');
  rw(blank, 'phylo_blank', { what: 'trait' }, 'seeds', 'flowers');
  refused(() => run(v, 'phylo_blank'), /0 blank tips/);
});

// ── geometry ────────────────────────────────────────────────────────────────

test('geometry checkers: Pythagoras, trigonometry, angle sums, similarity, circle theorems, measures', () => {
  const t345 = S('geometric_figure', { shape: 'triangle', sides: [3, 4, 5] });
  rw(t345, 'geo_side', { side: 2 }, '5', '7');
  rw(t345, 'geo_angle', { vertex: 2 }, '90°', '60°');
  rw(t345, 'geo_angle', { vertex: 0 }, '36.9', '53.1');
  rw(t345, 'geo_area', {}, '6', '12');
  rw(t345, 'geo_perimeter', {}, '12', '6');
  // SAS with a right angle: the hypotenuse of a 5–12 triangle; ASA: the third angle and the law of sines.
  rw(S('geometric_figure', { shape: 'triangle', sas: [5, 90, 12] }), 'geo_side', { side: 0 }, '13', '17');
  const asa = S('geometric_figure', { shape: 'triangle', asa: [30, 10, 60] });
  rw(asa, 'geo_angle', { vertex: 2 }, '90', '100');
  rw(asa, 'geo_side', { side: 0 }, '5', '8.66');          // opposite the 30° angle
  rw(asa, 'geo_side', { side: 1 }, '8.66', '5');
  rw(S('geometric_figure', { shape: 'triangle', sides: [7, 7, 7] }), 'geo_angle', { vertex: 1 }, '60', '90');
  // Polygons.
  const trap = fx('geometry-polygon-isosceles-trapezoid');
  rw(trap, 'geo_perimeter', {}, '32', '27');
  rw(trap, 'geo_area', {}, '44', '56');
  rw(trap, 'geo_side', { side: 1 }, '5', '4');
  rw(S('geometric_figure', { shape: 'polygon', regular: { n: 5, side: 2 } }), 'geo_angle', { vertex: 3 }, '108', '120');
  // Similar triangles.
  const sim = fx('geometry-blank-similar-triangles');
  rw(sim, 'geo_similar', { want: 'side', side: 1 }, '12', '10');
  rw(sim, 'geo_similar', { want: 'ratio' }, '1.5', '2');
  rw(sim, 'geo_similar', { want: 'area_ratio' }, '2.25', '1.5');
  rw(sim, 'geo_side', { side: 2, triangle: 1 }, '13.5', '9');
  // Parallel lines: corresponding and alternate angles equal, co-interior angles supplementary.
  const par = fx('geometry-blank-parallel-lines');
  rw(par, 'geo_angle', { position: 7 }, '65°', '115°');
  rw(par, 'geo_angle', { position: 5 }, '115', '65');
  rw(par, 'geo_angle', { position: 4 }, '115', '65');
  // Circle theorems: an inscribed angle is half the central angle; the angle in a semicircle is 90°; tangent ⟂ radius.
  const circ = fx('geometry-circle-chords-tangent');
  rw(circ, 'geo_angle', { angle: 1 }, '40°', '80°');
  rw(circ, 'geo_angle', { angle: 0 }, '80', '40');
  rw(circ, 'geo_circle', { want: 'centre_to_external_point' }, '7.81', '11');
  const thales = S('geometric_figure', { shape: 'circle', radius: 4, points: [{ name: 'A', at: 0 }, { name: 'B', at: 180 }, { name: 'C', at: 70 }], chords: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'C' }], angles: [{ vertex: 'C', from: 'A', to: 'B', label: '?' }] });
  rw(thales, 'geo_angle', { angle: 0 }, '90', '70');
  rw(thales, 'geo_circle', { want: 'chord_length', chord: 0 }, '8', '4');
  const tan = S('geometric_figure', { shape: 'circle', radius: 5, points: [{ name: 'T', at: 0 }], radii: [{ to: 'T' }], tangent: { at: 'T', length: 12, end: 'P' } });
  rw(tan, 'geo_circle', { want: 'centre_to_external_point' }, '13', '17');
  // Arc length and sector area: r = 6, 60° → 2π and 6π; circumference 12π; area 36π.
  const sector = S('geometric_figure', { shape: 'circle', radius: 6, points: [{ name: 'A', at: 0 }, { name: 'B', at: 60 }], sector: { from: 'A', to: 'B' } });
  rw(sector, 'geo_circle', { want: 'arc_length', as: 'pi' }, '2π', '6π');
  rw(sector, 'geo_circle', { want: 'sector_area', as: 'pi' }, '6π', '2π');
  rw(sector, 'geo_circle', { want: 'sector_area' }, '18.85', '18.9');
  rw(sector, 'geo_circle', { want: 'circumference', as: 'pi' }, '12π', '36π');
  rw(sector, 'geo_circle', { want: 'area', as: 'pi' }, '36π', '12π');
  rw(S('geometric_figure', { shape: 'circle', radius: 5, points: [{ name: 'A', at: 10 }, { name: 'B', at: 130 }], arc: { from: 'A', to: 'B', label: '?' } }), 'geo_circle', { want: 'arc_length', as: 'pi' }, '10π/3', '5π/3');
  refused(() => run(t345, 'geo_circle', { want: 'area' }), /is for a circle/);
  refused(() => run(sector, 'geo_side', { side: 0 }), /triangle, a polygon or a pair/);
  refused(() => run(t345, 'geo_side', { side: 3 }), /0-based index of a side/);
});

// ── ray diagrams ────────────────────────────────────────────────────────────

test('ray checkers: the thin-lens / mirror equation on six standard cases, and Snell\'s law', () => {
  const optic = (element: string, focalLength: number, objectDistance: number) => S('ray_diagram', { element, focalLength, objectDistance });
  // Converging lens f = 10: object at 30 → 15, m = −½, real, inverted, reduced.
  const a = optic('converging_lens', 10, 30);
  rw(a, 'ray_image_distance', {}, '15 cm', '−15 cm');
  rw(a, 'ray_magnification', {}, '−0.5', '0.5');
  rw(a, 'ray_magnification', { signed: false }, '0.5', '2');
  rw(a, 'ray_image_nature', { want: 'type' }, 'real', 'virtual');
  rw(a, 'ray_image_nature', { want: 'orientation' }, 'inverted', 'upright');
  rw(a, 'ray_image_nature', { want: 'size' }, 'reduced', 'enlarged');
  rw(S('ray_diagram', { element: 'converging_lens', focalLength: 10, objectDistance: 30, objectHeight: 4 }), 'ray_image_height', {}, '2', '4');
  // Object at 15 (between F and 2F) → 30, m = −2. Object at 2F → same size.
  rw(optic('converging_lens', 10, 15), 'ray_image_distance', {}, '30', '6');
  rw(optic('converging_lens', 10, 15), 'ray_image_nature', { want: 'size' }, 'enlarged', 'reduced');
  rw(optic('converging_lens', 10, 20), 'ray_image_nature', { want: 'size' }, 'same size', 'enlarged');
  // Object inside F (5) → −10, m = +2: virtual, upright, enlarged (a magnifying glass).
  const mag = optic('converging_lens', 10, 5);
  rw(mag, 'ray_image_distance', {}, '−10', '10');
  rw(mag, 'ray_image_distance', { signed: false }, '10', '3.33');
  rw(mag, 'ray_magnification', {}, '2', '−2');
  rw(mag, 'ray_image_nature', { want: 'type' }, 'virtual', 'real');
  rw(mag, 'ray_image_nature', { want: 'orientation' }, 'upright', 'inverted');
  // Diverging lens f = 20, object at 20 → −10, m = ½. Concave mirror f = 12, object at 6 → −12; at 36 → 18.
  rw(optic('diverging_lens', 20, 20), 'ray_image_distance', {}, '-10', '10');
  rw(optic('diverging_lens', 20, 20), 'ray_magnification', {}, '0.5', '-0.5');
  rw(optic('concave_mirror', 12, 6), 'ray_image_distance', {}, '−12', '4');
  rw(optic('concave_mirror', 12, 36), 'ray_image_distance', {}, '18', '−18');
  rw(optic('concave_mirror', 12, 36), 'ray_image_nature', { want: 'orientation' }, 'inverted', 'upright');
  // Convex mirror f = 10, object at 15 → −6, m = 0.4: always virtual, upright, reduced.
  const cv = optic('convex_mirror', 10, 15);
  rw(cv, 'ray_image_distance', {}, '−6', '6');
  rw(cv, 'ray_magnification', {}, '0.4', '−0.4');
  rw(cv, 'ray_image_nature', { want: 'size' }, 'reduced', 'enlarged');
  refused(() => run(S('ray_diagram', { element: 'converging_lens', focalLength: 10, objectDistance: 10, rays: 'none', showImage: false }), 'ray_image_distance'), /no image is formed/);
  // Snell: air → glass (1.50) at 30° → 19.5°; air → water (1.33) at 45° → 32.1°; glass → air at 30° → 48.6°.
  const face = (n1: number, n2: number, incidentAngle: number, extra: Args = {}) => S('ray_diagram', { element: 'interface', n1, n2, incidentAngle, ...extra });
  rw(face(1, 1.5, 30), 'ray_snell', { want: 'refraction_angle' }, '19.5°', '20.5°');
  rw(face(1, 1.33, 45), 'ray_snell', { want: 'refraction_angle' }, '32.1', '45');
  rw(face(1.5, 1, 30), 'ray_snell', { want: 'refraction_angle' }, '48.6', '19.5');
  // Critical angles: glass (1.50) 41.8°, water (1.33) 48.8°, diamond (2.42) 24.4°.
  rw(face(1.5, 1, 30), 'ray_snell', { want: 'critical_angle' }, '41.8', '48.6');
  rw(face(1.33, 1, 30), 'ray_snell', { want: 'critical_angle' }, '48.8', '41.8');
  rw(face(2.42, 1, 10), 'ray_snell', { want: 'critical_angle' }, '24.4', '65.6');
  rw(face(1, 1.5, 30, { reflected: true }), 'ray_snell', { want: 'reflection_angle' }, '30', '60');
  rw(fx('ray-blank-refraction-interface'), 'ray_snell', { want: 'n2' }, '1.34', '1.50');
  refused(() => run(face(1, 1.5, 30), 'ray_snell', { want: 'critical_angle' }), /no critical angle/);
  refused(() => run(face(1.5, 1, 60, { reflected: true }), 'ray_snell', { want: 'refraction_angle' }), /totally internally reflected/);
  refused(() => run(a, 'ray_snell', { want: 'n1' }), /plane interface/);
  refused(() => run(face(1, 1.5, 30), 'ray_image_distance'), /lens or a mirror/);
});

// ── fields ──────────────────────────────────────────────────────────────────

test('field checkers: directions, signs and sizes from the lines, forces by the right-hand rule', () => {
  const charges = (list: Array<[number, number, number]>, points: Array<[number, number, string]>, extra: Args = {}) => S('field_diagram', { variant: 'point_charges', charges: list.map(([x, y, q]) => ({ x, y, q })), points: points.map(([x, y, label]) => ({ x, y, label })), xRange: [-6, 6], yRange: [-5, 5], ...extra });
  // One positive charge: the field points away from it. One negative: towards it.
  const plus = charges([[0, 0, 1]], [[3, 0, 'P'], [0, -3, 'Q'], [2, 2, 'R']]);
  rw(plus, 'field_direction_at', { point: 'P' }, 'right', 'left');
  rw(plus, 'field_direction_at', { point: 'Q' }, 'down', 'up');
  rw(plus, 'field_direction_at', { point: 'R' }, 'up and to the right', 'down and to the left');
  rw(charges([[0, 0, -2]], [[3, 0, 'P']]), 'field_direction_at', { point: 'P' }, 'left', 'right');
  // A dipole (+ on the left): on the perpendicular bisector the field points from + to −.
  rw(fx('field-dipole'), 'field_direction_at', { point: 'P' }, 'to the right', 'to the left');
  // Two equal positive charges: above the midpoint the field points straight up; AT the midpoint it is zero.
  const two = charges([[-2, 0, 1], [2, 0, 1]], [[0, 2, 'P'], [0, 0, 'M'], [3, 3, 'X']]);
  rw(two, 'field_direction_at', { point: 'P' }, 'up', 'down');
  rw(two, 'field_direction_at', { point: 'P', as: 'degrees' }, '90', '270');
  refused(() => run(two, 'field_direction_at', { point: 'M' }), /field is zero/);
  refused(() => run(two, 'field_direction_at', { point: 'X' }), /not close to one of the eight/);
  refused(() => run(two, 'field_direction_at', { point: 'Z' }), /marks no point "Z"/);
  // Signs and sizes from the lines.
  const unk = fx('field-blank-unknown-charges');
  rw(unk, 'field_charge_sign', { charge: 0 }, 'positive', 'negative');
  rw(unk, 'field_charge_sign', { charge: 1 }, 'negative', 'positive');
  rw(unk, 'field_line_count', { charge: 0 }, '12', '4');
  rw(unk, 'field_line_count', { charge: 1 }, '4', '12');
  rw(unk, 'field_charge_ratio', { a: 0, b: 1 }, '3', '1/3');
  // Three charges: the lines bunch and the drawn counts are not the charges' ratio (the figure's own
  // legibility note says so) — the ratio is refused rather than read off lines that do not show it.
  refused(() => run(fx('field-three-charges-equipotentials'), 'field_charge_ratio', { a: 0, b: 2 }), /cannot be read by counting lines/);
  rw(S('field_diagram', { variant: 'point_charges', linesPerUnit: 4, charges: [{ x: -2, y: 0, q: 2 }, { x: 2, y: 0, q: 1 }] }), 'field_charge_ratio', { a: 0, b: 1 }, '2', '1');
  // Electric force between plates: along the field for +, against it for −. E = V/d.
  const plates = (direction: string, sign: string) => S('field_diagram', { variant: 'uniform', direction, charge: { sign }, separation: { value: 2, unit: 'cm' }, voltage: { value: 120 } });
  rw(plates('down', '−'), 'field_force_direction', {}, 'up', 'down');
  rw(plates('down', '+'), 'field_force_direction', {}, 'down', 'up');
  rw(plates('right', '-'), 'field_force_direction', {}, 'left', 'right');
  rw(plates('down', '−'), 'field_uniform_magnitude', {}, '6000 V/m', '60 V/m');
  rw(S('field_diagram', { variant: 'uniform', direction: 'up', separation: { value: 5, unit: 'mm' }, voltage: { value: 9 } }), 'field_uniform_magnitude', {}, '1800', '1.8');
  rw(S('field_diagram', { variant: 'uniform', direction: 'up', separation: { value: 0.5, unit: 'm' }, voltage: { value: 12 } }), 'field_uniform_magnitude', {}, '24', '6');
  // Magnetic force F = qv × B.
  const mf = (field: string, sign: string, velocity: string) => S('field_diagram', { variant: 'magnetic_force', field, charge: { sign, velocity } });
  rw(mf('into', '+', 'right'), 'field_force_direction', {}, 'up', 'down');
  rw(mf('into', '−', 'right'), 'field_force_direction', {}, 'down', 'up');             // an electron: reversed
  rw(mf('out', '+', 'up'), 'field_force_direction', {}, 'right', 'left');
  rw(mf('out', '−', 'up'), 'field_force_direction', {}, 'left', 'right');
  rw(mf('up', '+', 'right'), 'field_force_direction', {}, 'out of the page', 'into the page');
  rw(mf('up', '−', 'right'), 'field_force_direction', {}, 'into the page', 'out of the page');
  rw(mf('left', '+', 'down'), 'field_force_direction', {}, 'into the page', 'up');
  rw(fx('field-magnetic-force-negative-charge'), 'field_force_direction', {}, 'down', 'up');
  refused(() => run(mf('up', '+', 'up'), 'field_force_direction'), /magnetic force is zero/);
  refused(() => run(fx('field-dipole'), 'field_force_direction'), /between plates or in a magnetic field/);
  // A straight wire: counter-clockwise round a current out of the page.
  const wire = (current: string, side?: string) => S('field_diagram', { variant: 'wire', view: 'cross_section', current, ...(side ? { point: { side } } : {}) });
  rw(wire('out', 'right'), 'field_wire_direction', {}, 'up', 'down');
  rw(wire('out', 'above'), 'field_wire_direction', {}, 'left', 'right');
  rw(wire('in', 'right'), 'field_wire_direction', {}, 'down', 'up');
  rw(wire('in'), 'field_wire_direction', { side: 'below' }, 'left', 'right');
  const side = (current: string) => S('field_diagram', { variant: 'wire', view: 'side', current });
  rw(side('right'), 'field_wire_direction', { side: 'above' }, 'out of the page', 'into the page');
  rw(side('right'), 'field_wire_direction', { side: 'below' }, 'into the page', 'out of the page');
  rw(side('up'), 'field_wire_direction', { side: 'left' }, 'out of the page', 'into the page');
  refused(() => run(side('right'), 'field_wire_direction', { side: 'left' }), /along the wire/);
  refused(() => run(fx('field-dipole'), 'field_wire_direction'), /wire variant/);
});

// ── flow diagrams ───────────────────────────────────────────────────────────

test('flow checkers: energy up a pyramid, what a blank must be, the sign of a loop, levels and chains of a web', () => {
  const pyr = fx('flow-blank-energy-pyramid');
  rw(pyr, 'flow_energy_at_level', { level: 2 }, '500 kJ', '5000 kJ');
  rw(pyr, 'flow_energy_at_level', { level: 3 }, '50', '500');
  // The 10 % rule on three textbook pyramids; another transfer percentage.
  const p = (base: number, n: number, extra: Args = {}) => S('flow_diagram', { variant: 'pyramid', levels: Array.from({ length: n }, (_, i) => ({ label: `Level ${i + 1}`, ...(i === 0 ? { value: base } : {}) })), ...extra });
  rw(p(10000, 4), 'flow_energy_at_level', { level: 1 }, '1000', '100');
  rw(p(10000, 4), 'flow_energy_at_level', { level: 3 }, '10', '100');
  rw(p(2500, 3), 'flow_energy_at_level', { level: 2 }, '25', '250');
  rw(p(8000, 3, { transferPercent: 20 }), 'flow_energy_at_level', { level: 2 }, '320', '80');
  rw(p(8000, 3), 'flow_energy_at_level', { level: 1, percent: 5 }, '400', '800');
  // Downwards too: from a printed top value to the level below it.
  rw(S('flow_diagram', { variant: 'pyramid', levels: [{ label: 'Producers' }, { label: 'Herbivores', value: 300 }] }), 'flow_energy_at_level', { level: 0 }, '3000', '30');
  refused(() => run(S('flow_diagram', { variant: 'pyramid', levels: [{ label: 'A' }, { label: 'B' }] }), 'flow_energy_at_level', { level: 1 }), /no other level has a printed value/);
  // Blanks.
  const loop = fx('flow-blank-feedback-loop');
  rw(loop, 'flow_blank', {}, 'Sweating', 'Shivering');
  rw(loop, 'flow_blank', { what: 'arrow' }, '−', '+');
  rw(S('flow_diagram', { variant: 'chain', nodes: [{ id: 'a', label: 'DNA' }, { id: 'b', label: 'mRNA', blank: true }, { id: 'c', label: 'Protein' }], steps: ['transcription', { label: 'translation', blank: true }] }), 'flow_blank', { what: 'arrow' }, 'translation', 'transcription');
  rw(S('flow_diagram', { variant: 'pyramid', levels: [{ label: 'Producers', blank: true }, { label: 'Herbivores' }] }), 'flow_blank', {}, 'Producers', 'Herbivores');
  refused(() => run(fx('flow-chain-cellular-respiration'), 'flow_blank'), /0 blank nodes/);
  // Loop signs: an odd number of − arrows is negative feedback.
  const signs = (...s: string[]) => S('flow_diagram', { variant: 'cycle', nodes: s.map((_, i) => ({ id: `n${i}`, label: `Box ${i}` })), steps: s.map((sign) => ({ sign })) });
  rw(loop, 'flow_loop_sign', {}, 'negative feedback', 'positive feedback');
  rw(signs('+', '+'), 'flow_loop_sign', {}, 'positive', 'negative');       // e.g. warming → less ice → more warming
  rw(signs('−', '−'), 'flow_loop_sign', {}, 'positive', 'negative');
  rw(signs('+', '−', '+'), 'flow_loop_sign', {}, 'negative', 'positive');  // e.g. predator and prey
  rw(signs('−', '+', '−', '−'), 'flow_loop_sign', {}, 'negative', 'positive');
  refused(() => run(S('flow_diagram', { variant: 'cycle', nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], steps: [{ sign: '+' }] }), 'flow_loop_sign'), /every arrow of the loop needs a sign/);
  // The food web: producers 1, herbivores 2; the hawk is reached by chains of three lengths.
  const web = fx('flow-food-web-nine');
  rw(web, 'flow_trophic_level', { node: 'Grass' }, '1', '2');
  rw(web, 'flow_trophic_level', { node: 'Rabbit' }, '2', '3');
  rw(web, 'flow_trophic_level', { node: 'Frog' }, '3', '2');
  rw(web, 'flow_trophic_level', { node: 'snake' }, '3 and 4', '3');
  rw(web, 'flow_trophic_level', { node: 'Hawk' }, '3, 4 and 5', '4 and 5');
  rw(web, 'flow_chain_count', {}, '12', '13');
  rw(S('flow_diagram', { variant: 'chain', nodes: ['Grass', 'Mouse', 'Owl'].map((label) => ({ id: label, label })) }), 'flow_trophic_level', { node: 'Owl' }, '3', '2');
  rw(S('flow_diagram', { variant: 'chain', nodes: ['Grass', 'Mouse', 'Owl'].map((label) => ({ id: label, label })) }), 'flow_chain_count', {}, '1', '3');
  refused(() => run(web, 'flow_trophic_level', { node: 'Wolf' }), /no box "Wolf"/);
  refused(() => run(loop, 'flow_chain_count'), /chain or a web/);
});

// ── solids ──────────────────────────────────────────────────────────────────

test('solid checkers: volumes, surface areas and slant heights of the standard solids; exact volumes of revolution', () => {
  const solid = (params: Args) => S('solid_3d', params);
  const cyl = fx('solid-cylinder');                        // r = 3, h = 8
  rw(cyl, 'solid_volume', { as: 'pi' }, '72π', '24π');
  rw(cyl, 'solid_volume', {}, '226.19', '226.2 or 72');
  rw(cyl, 'solid_surface_area', { as: 'pi' }, '66π', '48π');
  rw(cyl, 'solid_surface_area', { part: 'lateral', as: 'pi' }, '48π', '66π');
  const cone = fx('solid-blank-cone-slant');               // r = 5, h = 12
  rw(cone, 'solid_slant_height', {}, '13 cm', '17 cm');
  rw(cone, 'solid_volume', { as: 'pi' }, '100π', '300π');
  rw(cone, 'solid_surface_area', { as: 'pi' }, '90π', '65π');
  rw(cone, 'solid_surface_area', { part: 'lateral', as: 'pi' }, '65π', '90π');
  rw(solid({ solid: 'sphere', radius: 3 }), 'solid_volume', { as: 'pi' }, '36π', '108π');
  rw(solid({ solid: 'sphere', radius: 3 }), 'solid_surface_area', { as: 'pi' }, '36π', '9π');
  rw(solid({ solid: 'hemisphere', radius: 3 }), 'solid_volume', { as: 'pi' }, '18π', '36π');
  rw(solid({ solid: 'hemisphere', radius: 3 }), 'solid_surface_area', { as: 'pi' }, '27π', '18π');
  rw(solid({ solid: 'prism', length: 2, width: 3, height: 4 }), 'solid_volume', {}, '24', '9');
  rw(solid({ solid: 'prism', length: 2, width: 3, height: 4 }), 'solid_surface_area', {}, '52', '26');
  rw(fx('solid-triangular-prism'), 'solid_volume', {}, '120', '240');
  rw(fx('solid-triangular-prism'), 'solid_surface_area', {}, '184', '160');
  rw(solid({ solid: 'pyramid', base: 6, height: 4 }), 'solid_volume', {}, '48', '144');
  rw(solid({ solid: 'pyramid', base: 6, height: 4 }), 'solid_slant_height', {}, '5', '7.21');
  rw(solid({ solid: 'pyramid', base: 6, height: 4 }), 'solid_surface_area', {}, '96', '60');
  rw(fx('solid-composite-prism-pyramid'), 'solid_volume', {}, '192', '288');
  rw(fx('solid-composite-prism-pyramid'), 'solid_surface_area', {}, '192', '228');   // 4 walls 96 + 4 triangles 60 + the floor 36
  rw(fx('solid-composite-prism-pyramid'), 'solid_slant_height', {}, '5', '4');
  rw(fx('solid-silo-cylinder-hemisphere'), 'solid_volume', { as: 'pi' }, '88π/3', '40π');
  rw(solid({ solid: 'composite', bottom: 'cylinder', top: 'cone', radius: 3, height: 5, topHeight: 4 }), 'solid_volume', { as: 'pi' }, '57π', '81π');
  rw(solid({ solid: 'composite', bottom: 'cylinder', top: 'cone', radius: 3, height: 5, topHeight: 4 }), 'solid_surface_area', { as: 'pi' }, '54π', '63π');
  refused(() => run(solid({ solid: 'prism', length: 2, width: 3, height: 4 }), 'solid_volume', { as: 'pi' }), /no π in its volume/);
  refused(() => run(cyl, 'solid_slant_height'), /no slant height/);
  refused(() => run(solid({ solid: 'cylinder', radius: 1.7, height: Math.SQRT2 }), 'solid_volume', { as: 'pi' }), /not a simple fraction times π/);
  // Revolution: √x and x² about x → 3π/10; x² on [0, 2] about x → 32π/5; about y (shells) → 8π;
  // y = x on [0, 3] about x is a cone → 9π; y = 2 on [1, 4] about x is a cylinder → 12π.
  const rev = (params: Args) => solid({ solid: 'revolution', ...params });
  rw(fx('solid-revolution-washer'), 'solid_revolution_volume', {}, '3π/10', '7π/10');
  rw(fx('solid-revolution-washer'), 'solid_revolution_volume', { as: 'decimal' }, '0.942', '0.3');
  rw(rev({ axis: 'x', outer: { poly: [0, 0, 1] }, from: 0, to: 2 }), 'solid_revolution_volume', {}, '32π/5', '8π/3');
  rw(rev({ axis: 'y', outer: { poly: [0, 0, 1] }, from: 0, to: 2 }), 'solid_revolution_volume', {}, '8π', '32π/5');
  rw(rev({ axis: 'x', outer: { poly: [0, 1] }, from: 0, to: 3 }), 'solid_revolution_volume', {}, '9π', '27π');
  rw(rev({ axis: 'x', outer: { poly: [2] }, from: 1, to: 4 }), 'solid_revolution_volume', {}, '12π', '6π');
  rw(rev({ axis: 'x', outer: { poly: [4, 0, -1], sqrt: true }, from: 0, to: 2 }), 'solid_revolution_volume', {}, '16π/3', '32π/3');   // a hemisphere of radius 2
  rw(rev({ axis: 'y', outer: { poly: [2] }, inner: { poly: [0, 1] }, from: 0, to: 2 }), 'solid_revolution_volume', {}, '8π/3', '4π');
  refused(() => run(rev({ axis: 'y', outer: { poly: [0, 1], sqrt: true }, from: 0, to: 4 }), 'solid_revolution_volume'), /no exact form/);
  refused(() => run(cyl, 'solid_revolution_volume'), /revolution variant/);
  refused(() => run(fx('solid-revolution-washer'), 'solid_volume'), /use solid_revolution_volume/);
});

// ── spectra ─────────────────────────────────────────────────────────────────

test('spectrum checkers: average atomic mass and element, PES configurations, the calibration line, matching lines', () => {
  const mass = (...peaks: Array<[number, number]>) => S('spectrum', { variant: 'mass', peaks: peaks.map(([mz, abundance]) => ({ mz, abundance })) });
  // Copper 63 / 65 (69.2 / 30.8) → 63.62; chlorine 35 / 37 (75.8 / 24.2) → 35.48;
  // magnesium 24 / 25 / 26 (79 / 10 / 11) → 24.32; boron 10 / 11 (19.9 / 80.1) → 10.80.
  rw(fx('spectrum-mass-copper'), 'spectrum_average_mass', {}, '63.62', '64.00');
  rw(fx('spectrum-mass-copper'), 'spectrum_element', {}, 'copper', 'zinc');
  rw(fx('spectrum-mass-copper'), 'spectrum_most_abundant', {}, '63', '65');
  rw(mass([35, 75.8], [37, 24.2]), 'spectrum_average_mass', {}, '35.48', '36.00');
  rw(mass([35, 75.8], [37, 24.2]), 'spectrum_element', {}, 'Chlorine', 'Argon');
  rw(fx('spectrum-blank-mass-magnesium'), 'spectrum_average_mass', {}, '24.32', '25.00');
  rw(fx('spectrum-blank-mass-magnesium'), 'spectrum_element', {}, 'magnesium', 'sodium');
  rw(mass([10, 19.9], [11, 80.1]), 'spectrum_average_mass', {}, '10.8', '10.5');
  rw(mass([10, 19.9], [11, 80.1]), 'spectrum_element', {}, 'boron', 'carbon');
  refused(() => run(mass([150, 50], [152, 50]), 'spectrum_element'), /does not single out one element/);
  // PES: sodium 2, 2, 6, 1; nitrogen 2, 2, 3; calcium 2, 2, 6, 2, 6, 2; neon 2, 2, 6.
  const pes = (...peaks: Array<[number, number]>) => S('spectrum', { variant: 'pes', peaks: peaks.map(([energy, electrons]) => ({ energy, electrons })) });
  const na = fx('spectrum-pes-sodium');
  rw(na, 'spectrum_configuration', {}, '1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ 3s²');
  rw(na, 'spectrum_element', {}, 'sodium', 'magnesium');
  rw(na, 'spectrum_peak_subshell', { peak: 2 }, '2p', '2s');
  rw(na, 'spectrum_peak_subshell', { peak: 0 }, '1s', '3s');
  rw(na, 'spectrum_peak_subshell', { peak: 3 }, 'the 3s subshell', 'the 2p subshell');
  const n = pes([39.6, 2], [2.45, 2], [1.4, 3]);
  rw(n, 'spectrum_configuration', {}, '1s²2s²2p³', '1s²2s²2p⁵');
  rw(n, 'spectrum_element', {}, 'nitrogen', 'oxygen');
  const ca = pes([390, 2], [42.7, 2], [34, 6], [4.65, 2], [2.9, 6], [0.59, 2]);
  rw(ca, 'spectrum_configuration', {}, '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²', '1s² 2s² 2p⁶ 3s² 3p⁶');
  rw(ca, 'spectrum_element', {}, 'calcium', 'argon');
  rw(ca, 'spectrum_peak_subshell', { peak: 4 }, '3p', '3s');
  rw(pes([84, 2], [4.68, 2], [2.08, 6]), 'spectrum_element', {}, 'neon', 'fluorine');
  refused(() => run(pes([84, 2], [4.68, 1], [2.08, 6]), 'spectrum_configuration'), /not full although a later subshell is occupied/);
  refused(() => run(pes([84, 4]), 'spectrum_configuration'), /more than the 1s subshell holds/);
  // Beer's law: A = 1.5 c.
  const cal = fx('spectrum-absorbance-calibration');
  rw(cal, 'spectrum_concentration', {}, '0.4 mmol/L', '0.9 mmol/L');
  rw(cal, 'spectrum_concentration', { absorbance: 0.3 }, '0.2', '0.45');
  rw(S('spectrum', { variant: 'absorbance', slope: 0.2, intercept: 0.05, xMax: 5 }), 'spectrum_concentration', { absorbance: 0.65 }, '3', '3.25');
  refused(() => run(cal, 'spectrum_concentration', { absorbance: 3 }), /off the line as drawn/);
  // Line spectra: every line of hydrogen and of sodium is in the unknown; helium's 471 nm and 668 nm lines are not.
  const mix = fx('spectrum-lines-unknown-mixture');
  rw(mix, 'spectrum_lines_present', {}, 'Hydrogen, Sodium (absorption)', 'Hydrogen, Helium');
  rw(S('spectrum', { variant: 'lines', rows: [{ label: 'Star', lines: [410, 434, 486, 656] }, { label: 'Hydrogen', lines: [410, 434, 486, 656] }, { label: 'Helium', lines: [447, 588] }] }), 'spectrum_lines_present', {}, 'Hydrogen', 'Helium');
  rw(S('spectrum', { variant: 'lines', rows: [{ label: 'Star', lines: [500] }, { label: 'Hydrogen', lines: [656] }] }), 'spectrum_lines_present', {}, 'None', 'Hydrogen');
  refused(() => run(na, 'spectrum_average_mass'), /mass variant, not pes/);
});

// ── the item as a whole ─────────────────────────────────────────────────────

test('a batch-2 item is examined like any other: the key is recomputed from the spec', () => {
  const mc = item(fx('ray-converging-lens-real-image'), {
    responseFormat: 'mcq', problemText: 'The ray diagram shows an object in front of a converging lens. How far from the lens does the image form?', choices: ['7.5 cm', '15 cm', '20 cm', '30 cm'], answer: 'B',
    alt: 'A ray diagram of a converging lens with an object arrow on the left and focal points marked.', derivation: { checker: 'ray_image_distance', args: {} },
  });
  const ok = examineFigureItem(mc);
  assert.equal(ok.derivation.status, 'derived', JSON.stringify(ok));
  assert.equal(examineFigureItem({ ...mc, answer: 'D' }).derivation.status, 'mismatch');
  const bad = examineFigureItem({ ...mc, derivation: { checker: 'ray_snell', args: { want: 'n1' } } });
  assert.equal(bad.derivation.status, 'error');
  assert.ok(bad.defects.some((d) => /plane interface/.test(d)));
  const num = item(fx('circuit-series-two-resistors'), { problemText: 'In the circuit shown, the switch is closed. What is the reading on the ammeter, in amperes?', answer: '2', alt: 'A circuit with a battery, a switch, two resistors and an ammeter in one loop.', derivation: { checker: 'circuit_component', args: { component: 'battery', quantity: 'current' } } });
  assert.equal(examineFigureItem(num).derivation.status, 'derived');
  assert.equal(examineFigureItem({ ...num, answer: '3' }).derivation.status, 'mismatch');
});

test('every batch-2 checker was exercised above', () => {
  for (const name of Object.keys(BATCH2_CHECKERS)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch2 test(s) passed`);
