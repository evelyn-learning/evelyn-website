/**
 * Tests for scripts/practice-extend/figure-core-batch3.ts, reached the way the
 * job reaches it — through figure-core.ts (`describeFigure`, `describeForAlt`,
 * `runChecker`, `compareDerived`, `examineFigureItem`, `checkerCatalogue`,
 * `axesOf`, `figureLetterClash`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * for the chemistry / biology / physics checkers, textbook-standard cases with
 * known answers. Per kind: the transcription says what is printed, keeps a
 * blank blank and never names what a question asks for.
 *
 * Pure — no network, no model; the no-db import keeps anything the renderer
 * loads off a database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch3.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { BATCH3_FIXTURES, FIGURE_FIXTURES } from '../lib/practice-figure-fixtures';
import { BATCH2_CHECKERS, BATCH3_CHECKERS, BATCH3_FIGURE_KINDS, CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';
import { describeBatch3, isBatch3Spec } from './figure-core-batch3';
import { Batch2RuleError } from './figure-core-batch2';

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
const fx = (id: string): PracticeFigureSpec => (FIGURE_FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;
const mol = (atoms: Args[], bonds: Args[], extra: Args = {}): PracticeFigureSpec => S('molecular_structure', { molecules: [{ atoms, bonds, ...extra }] });

// ── registration ────────────────────────────────────────────────────────────

test('batch 3 is reached through figure-core.ts and shadows nothing', () => {
  for (const name of Object.keys(BATCH3_CHECKERS)) assert.ok(!(name in CHECKERS) && !(name in BATCH2_CHECKERS), `${name} must not shadow an earlier checker`);
  const cat = checkerCatalogue([...BATCH3_FIGURE_KINDS, 'field_diagram']);
  for (const kind of BATCH3_FIGURE_KINDS) assert.ok(cat.includes(`${kind}:\n`), kind);
  for (const [name, d] of Object.entries(BATCH3_CHECKERS)) assert.ok(cat.includes(`- ${name} ${d.args} → ${d.returns}`), name);
  assert.ok(cat.includes('- field_direction_at ') && cat.includes('- magnet_north_end '), 'field_diagram lists the checkers of both files');
  assert.ok(!checkerCatalogue().includes('mol_'), "the writer's own catalogue is unchanged");
  for (const f of BATCH3_FIXTURES) assert.deepEqual(axesOf(f.spec), {}, f.id);
  refused(() => run(fx('gel-simple-pcr-presence'), 'mol_formula'), /is for molecular_structure, not for gel_electrophoresis/);
  used.delete('mol_formula');
  // A bar-magnet checker on another field variant, and the reverse, are refused with the reason.
  refused(() => run(fx('field-dipole'), 'magnet_north_end'), /bar_magnet variant/);
  refused(() => run(fx('magnet-single-field-lines'), 'field_line_count', { charge: 0 }), /variant must be one of point_charges/);
  // A refusal inside this file surfaces as figure-core's own error class.
  assert.throws(() => describeBatch3(S('gel_electrophoresis', { ladder: { sizes: [1] }, lanes: [] }), [], []), Batch2RuleError);
  refused(() => describeFigure(S('gel_electrophoresis', { ladder: { sizes: [1] }, lanes: [] })), /ladder\.sizes must have between 2 and 10/);
  assert.equal(isBatch3Spec(fx('magnet-blank-poles')), true);
  assert.equal(isBatch3Spec(fx('field-dipole')), false);
});

test('every fixture has a transcription and an alt draft; a blank is transcribed as a blank', () => {
  for (const f of BATCH3_FIXTURES) {
    const d = describeFigure(f.spec);
    assert.ok(/^The figure is \S/.test(d.text) && d.text.includes('TEXT PRINTED ON THE FIGURE:') && d.readable.length > 0, f.id);
    assert.ok(!/undefined|NaN|\[object/.test(d.text), `${f.id}: ${d.text}`);
    if (/blank/.test(f.id)) assert.ok(/blank/.test(d.text), `${f.id}: the blank is transcribed as a blank`);
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && !/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: ${alt}`);
  }
});

test('a transcription says what is printed, never what is under a blank, and never names what a question asks for', () => {
  const cy = textOf(fx('mol-blank-formal-charge-candidates'));
  assert.ok(cy.includes('a formal-charge mark that is (blank') && cy.includes('captioned "I"') && cy.includes('a triple bond (3 lines)'));
  assert.equal((cy.match(/formal-charge mark "−"/g) ?? []).length, 1, 'only the charge that is drawn (on N of structure II)');
  const sk = textOf(fx('mol-skeletal-functional-groups'));
  assert.ok(sk.includes('an unlabelled corner (a carbon atom)') && sk.includes('"NH₂"') && sk.includes('A dashed outline marked "Y"') && !/carboxyl|amino|C3H7/.test(sk));
  const hidden = textOf(mol([{ id: 'a', el: 'N', x: 0, y: 0, lonePairs: 1, show: { lonePairs: 'none' } }, { id: 'b', el: 'N', x: 1, y: 0, lonePairs: 1, show: { lonePairs: 'blank' } }], [{ a: 'a', b: 'b', order: 3, show: 'blank' }]));
  assert.ok(!/1 lone pair/.test(hidden) && hidden.includes('its lone pairs are replaced by (blank') && hidden.includes('a bond whose order is (blank') && !/triple/.test(hidden));
  const gel = textOf(fx('gel-blank-ladder-label'));
  assert.ok(gel.includes('"4", "2", (blank — a "?" box), "0.5"') && gel.includes('level with the marker whose label is (blank') && !/"1"/.test(gel) && gel.includes('(a thicker band)'));
  assert.ok(!/\b(3|700)\b.*kb/.test(gel.split('Lane 2')[1]), 'a sample band is placed against the ladder, never given its size');
  const dense = textOf(fx('gel-dense-paternity-six-lanes'));
  assert.ok(dense.includes('Lane 3, labelled "Child": 4 bands') && dense.includes('level with the "700" marker (a thicker band)'));
  const amp = textOf(fx('amp-dense-four-samples'));
  assert.ok(amp.includes('crossing the threshold at cycle 15') && amp.includes('named "NTC" stays flat'));
  assert.ok(textOf(fx('amp-blank-sample-name')).includes('the curve named (blank — a "?" box)'));
  const cell = textOf(fx('bio-cell-animal-lettered'));
  assert.ok(cell.includes('a capsule with a zig-zag line inside — labelled "Q"') && !/mitochond|nucleus|Golgi|lysosome|reticulum/i.test(cell), 'shapes, not names');
  assert.ok(textOf(fx('bio-cell-blank-label')).includes('a stack of bowed lines with small circles beside it — labelled (blank'));
  const mem = textOf(fx('bio-membrane-dense-pump-carrier-labels'));
  assert.ok(mem.includes('10 above the membrane, 2 below it') && mem.includes('"ATP" is printed beside its inner end') && mem.includes('joins "R" to the branched chain') && !/carrier|channel|pump|cholesterol|carbohydrate|active|facilitated/i.test(mem));
  const div = textOf(fx('bio-division-mitosis-strip'));
  assert.ok(div.includes('Cell 3, labelled "Z": 4 X-shaped chromosomes') && !/metaphase|anaphase|prophase/.test(div));
  assert.ok(/stage name: "metaphase"/.test(textOf(fx('bio-division-blank-stage-name'))) && !/telophase/.test(textOf(fx('bio-division-blank-stage-name'))));
  const mito = textOf(fx('bio-compartments-blank-space'));
  assert.ok(mito.includes('is labelled (blank') && mito.includes('it holds 16 dots') && mito.includes('labelled "matrix"') && !/intermembrane/.test(mito));
  const map = textOf(fx('map-blank-region-label'));
  assert.ok(map.includes('Region 2, labelled (blank') && map.includes('"300 km"') && map.includes('A dot labelled "L" at (9, 4), inside region 2'));
  assert.ok(textOf(S('schematic_map', { ...fx('map-islands-simple').params, scale: { squares: 2, length: 100, show: 'blank' } })).includes('labelled "0" and (blank') );
  const mag = textOf(fx('magnet-blank-poles'));
  assert.ok(mag.includes('each half holds (blank') && mag.includes('they leave the left end') && !/marked "N"/.test(mag));
  const two = textOf(fx('magnet-dense-two-magnets-compasses'));
  assert.ok(two.includes('labelled "3" below the line of the magnets, at the middle of the figure') && two.includes('it is empty — no needle is drawn') && two.includes('labelled "1"') && /"1"[^\n]*dark end points up/.test(two));
  // The third round's changes to earlier kinds read through too.
  assert.ok(textOf(fx('fix3-ray-diverging-abs-f')).includes('size of the focal length |f| = 12 cm'));
  assert.ok(textOf(S('ray_diagram', { ...fx('fix3-ray-diverging-abs-f').params, focalLabel: 'signed' })).includes('focal length f = −12 cm'));
  const lamp = textOf(fx('fix3-nested-similar-lamp-post'));
  assert.ok(lamp.includes('A segment inside it') && lamp.includes('the inner segment: labelled "1.8 m"') && lamp.includes('labelled (blank') && !/5\.4/.test(lamp));
  assert.ok(textOf(fx('fix3-phylo-numerals')).includes('node "2"') && !textOf(fx('fix3-phylo-numerals')).includes('node "B"'));
  assert.ok(textOf(fx('fix3-interface-tir')).includes('No refracted ray is drawn'));
});

test('describeForAlt names only what is drawn: no hidden value, no stage, no size of a sample band', () => {
  const never: Array<[string, string[]]> = [
    ['mol-blank-formal-charge-candidates', ['formal charge', 'triple']], ['gel-dense-paternity-six-lanes', ['F2 ', 'father']], ['gel-blank-ladder-label', ['"1"', '"3"']],
    ['amp-dense-four-samples', ['"15"', '"25"', '1024']], ['bio-cell-animal-lettered', ['mitochond', 'nucleus']], ['bio-division-mitosis-strip', ['metaphase', 'anaphase']],
    ['bio-compartments-blank-space', ['intermembrane']], ['bio-membrane-dense-pump-carrier-labels', ['active', 'carbohydrate']], ['magnet-blank-poles', ['"N"', 'north']], ['map-blank-region-label', ['"L" ']],
  ];
  for (const [id, texts] of never) {
    const alt = describeForAlt(fx(id));
    for (const t of texts) assert.ok(!alt.includes(t), `${id}: the alt contains ${t} — ${alt}`);
  }
  assert.ok(describeForAlt(fx('gel-simple-pcr-presence')).includes('ladder labels "1000", "750", "500", "250", "100"'));
  assert.ok(!describeForAlt(fx('gel-simple-pcr-presence'), { hide: [500] }).includes('"500"'));
  assert.ok(describeForAlt(fx('bio-division-blank-stage-name')).includes('stage name "metaphase"') && describeForAlt(fx('bio-division-blank-stage-name')).includes('One place is left blank'));
});

// ── molecular structures ────────────────────────────────────────────────────

test('mol_count / mol_formal_charge: water, carbonate, cyanate, carbon monoxide, ammonium', () => {
  const water = fx('mol-lewis-water');
  rw(water, 'mol_count', { want: 'lone_pairs' }, '2', '4');
  rw(water, 'mol_count', { want: 'bonding_pairs' }, '2', '4');
  rw(water, 'mol_count', { want: 'valence_electrons' }, '8', '10');
  rw(water, 'mol_count', { want: 'lone_pairs', atom: 'H1' }, '0', '1');
  const co3 = fx('mol-dense-resonance-carbonate');
  rw(co3, 'mol_count', { want: 'lone_pairs' }, '8', '6');
  rw(co3, 'mol_count', { want: 'valence_electrons', molecule: 2 }, '24', '22');
  rw(co3, 'mol_count', { want: 'sigma_bonds' }, '3', '4');
  rw(co3, 'mol_count', { want: 'pi_bonds' }, '1', '2');
  rw(co3, 'mol_formal_charge', { atom: 'O2' }, '-1', '0');
  rw(co3, 'mol_formal_charge', { atom: 'O2', molecule: 1 }, '0', '-1');
  rw(co3, 'mol_formal_charge', { atom: 'C' }, '0', '1');
  // The charge under a "?" box is what the checker is for.
  rw(fx('mol-blank-formal-charge-candidates'), 'mol_formal_charge', { atom: 'O' }, '−1', '0');
  const co = mol([{ id: 'C', el: 'C', x: 0, y: 0, lonePairs: 1 }, { id: 'O', el: 'O', x: 1, y: 0, lonePairs: 1 }], [{ a: 'C', b: 'O', order: 3 }]);
  rw(co, 'mol_formal_charge', { atom: 'C' }, '-1', '0');
  rw(co, 'mol_formal_charge', { atom: 'O' }, '+1', '-1');
  rw(co, 'mol_count', { want: 'pi_bonds' }, '2', '3');
  const nh4 = mol([{ id: 'N', el: 'N', x: 0, y: 0, lonePairs: 0, h: 4 }], []);
  rw(nh4, 'mol_formal_charge', { atom: 'N' }, '1', '0');
  rw(nh4, 'mol_count', { want: 'valence_electrons' }, '8', '9');
  refused(() => run(mol([{ id: 'a', el: 'O', x: 0, y: 0 }, { id: 'b', el: 'H', x: 1, y: 0 }], [{ a: 'a', b: 'b' }]), 'mol_count', { want: 'lone_pairs' }), /"a" has no lonePairs in the spec/);
  refused(() => run(water, 'mol_formal_charge', { atom: 'Q' }), /no atom with id "Q"/);
});

test('mol_vsepr / mol_polarity: CO₂, BF₃, CH₄, NH₃, H₂O, SF₄, XeF₂, SF₆, XeF₄', () => {
  const around = (center: Args, el: string, n: number, lp = 3): PracticeFigureSpec => mol(
    [{ id: 'X', x: 0, y: 0, ...center }, ...Array.from({ length: n }, (_, i) => ({ id: `a${i}`, el, lonePairs: el === 'H' ? undefined : lp, x: Math.cos((2 * Math.PI * i) / n) * 1.2, y: Math.sin((2 * Math.PI * i) / n) * 1.2 }))],
    Array.from({ length: n }, (_, i) => ({ a: 'X', b: `a${i}` })), { center: 'X' });
  /** [spec, steric, electron geometry, molecular geometry, hybridisation, polarity]. */
  const cases: Array<[PracticeFigureSpec, number, string, string, string, string]> = [
    [mol([{ id: 'X', el: 'C', x: 0, y: 0, lonePairs: 0 }, { id: 'a', el: 'O', x: -1, y: 0, lonePairs: 2 }, { id: 'b', el: 'O', x: 1, y: 0, lonePairs: 2 }], [{ a: 'X', b: 'a', order: 2 }, { a: 'X', b: 'b', order: 2 }], { center: 'X' }), 2, 'linear', 'linear', 'sp', 'nonpolar'],
    [around({ el: 'B', lonePairs: 0 }, 'F', 3), 3, 'trigonal planar', 'trigonal planar', 'sp2', 'nonpolar'],
    [around({ el: 'C', lonePairs: 0 }, 'H', 4), 4, 'tetrahedral', 'tetrahedral', 'sp3', 'nonpolar'],
    [around({ el: 'N', lonePairs: 1 }, 'H', 3), 4, 'tetrahedral', 'trigonal pyramidal', 'sp3', 'polar'],
    [fx('mol-lewis-water'), 4, 'tetrahedral', 'bent', 'sp3', 'polar'],
    [around({ el: 'S', lonePairs: 1 }, 'F', 4), 5, 'trigonal bipyramidal', 'seesaw', 'sp3d', 'polar'],
    [around({ el: 'Xe', lonePairs: 3 }, 'F', 2), 5, 'trigonal bipyramidal', 'linear', 'sp3d', 'nonpolar'],
    [around({ el: 'S', lonePairs: 0 }, 'F', 6), 6, 'octahedral', 'octahedral', 'sp3d2', 'nonpolar'],
    [around({ el: 'Xe', lonePairs: 2 }, 'F', 4), 6, 'octahedral', 'square planar', 'sp3d2', 'nonpolar'],
    [fx('mol-tetrahedral-wedge-dash'), 4, 'tetrahedral', 'tetrahedral', 'sp3', 'polar'],
  ];
  for (const [spec, steric, electron, molecular, hyb, polarity] of cases) {
    assert.deepEqual(run(spec, 'mol_vsepr', { want: 'steric_number' }), { kind: 'number', value: steric });
    assert.deepEqual(run(spec, 'mol_vsepr', { want: 'electron_geometry' }), { kind: 'label', value: electron });
    assert.deepEqual(run(spec, 'mol_vsepr', { want: 'molecular_geometry' }), { kind: 'label', value: molecular });
    assert.deepEqual(run(spec, 'mol_vsepr', { want: 'hybridisation' }), { kind: 'label', value: hyb });
    assert.deepEqual(run(spec, 'mol_polarity'), { kind: 'label', value: polarity }, `${molecular}`);
  }
  rw(fx('mol-lewis-water'), 'mol_vsepr', { want: 'molecular_geometry' }, 'bent', 'linear');
  rw(fx('mol-lewis-water'), 'mol_vsepr', { want: 'steric_number' }, '4', '2');
  rw(fx('mol-lewis-water'), 'mol_polarity', {}, 'polar', 'nonpolar');
  rw(mol([{ id: 'a', el: 'H', x: 0, y: 0 }, { id: 'b', el: 'Cl', x: 1, y: 0, lonePairs: 3 }], [{ a: 'a', b: 'b' }]), 'mol_polarity', {}, 'polar', 'nonpolar');
  rw(mol([{ id: 'a', el: 'N', x: 0, y: 0, lonePairs: 1 }, { id: 'b', el: 'N', x: 1, y: 0, lonePairs: 1 }], [{ a: 'a', b: 'b', order: 3 }]), 'mol_polarity', {}, 'nonpolar', 'polar');
  // The carbonate ion has a centre from its layout; a chain has none until one is named.
  rw(fx('mol-dense-resonance-carbonate'), 'mol_vsepr', { want: 'hybridisation' }, 'sp2', 'sp3');
  refused(() => run(fx('mol-skeletal-functional-groups'), 'mol_vsepr', { want: 'steric_number' }), /name the central atom/);
  refused(() => run(fx('mol-skeletal-functional-groups'), 'mol_vsepr', { want: 'steric_number', atom: 'N' }), /needs its lonePairs/);
});

test('mol_functional_group / mol_hbond / mol_formula / mol_best_structure / mol_bond_order', () => {
  const sk = fx('mol-skeletal-functional-groups');
  rw(sk, 'mol_functional_group', { group: 0 }, 'amino', 'hydroxyl');
  rw(sk, 'mol_functional_group', { group: 1 }, 'carboxyl', 'carbonyl');
  rw(sk, 'mol_formula', {}, 'C3H7NO2', 'C3H6NO2');
  rw(sk, 'mol_hbond', { want: 'donors' }, '3', '2');
  rw(sk, 'mol_hbond', { want: 'acceptors' }, '3', '2');
  rw(sk, 'mol_count', { want: 'sigma_bonds' }, '12', '5');
  rw(fx('mol-lewis-water'), 'mol_hbond', { want: 'donors' }, '2', '1');
  rw(fx('mol-lewis-water'), 'mol_hbond', { want: 'acceptors' }, '1', '2');
  rw(fx('mol-lewis-water'), 'mol_formula', {}, 'H2O', 'HO');
  /** A two-carbon skeleton with one group on the second carbon. */
  const withGroup = (atoms: Args[], bonds: Args[], group: string[]): PracticeFigureSpec => mol(
    [{ id: 'C1', el: 'C', x: 0, y: 0 }, { id: 'C2', el: 'C', x: 0.87, y: 0.5 }, ...atoms], [{ a: 'C1', b: 'C2' }, ...bonds], { skeletal: true, highlight: [{ atoms: group, label: 'G' }] });
  const groups: Array<[PracticeFigureSpec, string, string]> = [
    [withGroup([{ id: 'O', el: 'O', h: 1, x: 1.73, y: 0 }], [{ a: 'C2', b: 'O' }], ['O']), 'hydroxyl', 'C2H6O'],
    [withGroup([{ id: 'O', el: 'O', x: 1.73, y: 0 }], [{ a: 'C2', b: 'O', order: 2 }], ['C2', 'O']), 'aldehyde', 'C2H4O'],
    [withGroup([{ id: 'O', el: 'O', x: 0.87, y: 1.5 }, { id: 'C3', el: 'C', x: 1.73, y: 0 }], [{ a: 'C2', b: 'O', order: 2 }, { a: 'C2', b: 'C3' }], ['C2', 'O']), 'ketone', 'C3H6O'],
    [withGroup([{ id: 'O', el: 'O', x: 0.87, y: 1.5 }, { id: 'O2', el: 'O', x: 1.73, y: 0 }, { id: 'C3', el: 'C', x: 2.6, y: 0.5 }], [{ a: 'C2', b: 'O', order: 2 }, { a: 'C2', b: 'O2' }, { a: 'O2', b: 'C3' }], ['C2', 'O', 'O2']), 'ester', 'C3H6O2'],
    [withGroup([{ id: 'O', el: 'O', x: 0.87, y: 1.5 }, { id: 'N', el: 'N', h: 2, x: 1.73, y: 0 }], [{ a: 'C2', b: 'O', order: 2 }, { a: 'C2', b: 'N' }], ['C2', 'O', 'N']), 'amide', 'C2H5NO'],
    [withGroup([{ id: 'S', el: 'S', h: 1, x: 1.73, y: 0 }], [{ a: 'C2', b: 'S' }], ['S']), 'sulfhydryl', 'C2H6S'],
    [withGroup([{ id: 'O', el: 'O', x: 1.73, y: 0 }, { id: 'C3', el: 'C', x: 2.6, y: 0.5 }], [{ a: 'C2', b: 'O' }, { a: 'O', b: 'C3' }], ['O']), 'ether', 'C3H8O'],
    [withGroup([], [], ['C1']), 'methyl', 'C2H6'],
  ];
  for (const [spec, name, formula] of groups) {
    assert.deepEqual(run(spec, 'mol_functional_group', {}), { kind: 'label', value: name });
    assert.deepEqual(run(spec, 'mol_formula', {}), { kind: 'text', value: formula }, name);
  }
  refused(() => run(fx('mol-lewis-water'), 'mol_functional_group', {}), /no outlined group/);
  // Cyanate: −1 on O (the more electronegative atom) beats −1 on N.
  rw(fx('mol-blank-formal-charge-candidates'), 'mol_best_structure', {}, 'I', 'II');
  refused(() => run(fx('mol-dense-resonance-carbonate'), 'mol_best_structure', {}), /do not separate the candidates/);
  // Formal charges of zero beat separated charges (two candidate structures of CO₂).
  const co2 = (label: string, oa: number, ob: number, la: number, lb: number) => ({ label, layout: { type: 'linear', center: 'C', around: ['Oa', 'Ob'] }, atoms: [{ id: 'C', el: 'C', lonePairs: 0 }, { id: 'Oa', el: 'O', lonePairs: la }, { id: 'Ob', el: 'O', lonePairs: lb }], bonds: [{ a: 'C', b: 'Oa', order: oa }, { a: 'C', b: 'Ob', order: ob }] });
  rw(S('molecular_structure', { molecules: [co2('P', 1, 3, 3, 1), co2('Q', 2, 2, 2, 2)] }), 'mol_best_structure', {}, 'Q', 'P');
  rw(fx('mol-dense-resonance-carbonate'), 'mol_bond_order', { a: 'C', b: 'O1', molecule: 'average' }, '1.33', '1.5');
  rw(fx('mol-dense-resonance-carbonate'), 'mol_bond_order', { a: 'C', b: 'O1' }, '2', '1');
  rw(fx('mol-dense-resonance-carbonate'), 'mol_bond_order', { a: 'C', b: 'O1', molecule: 1 }, '1', '2');
  refused(() => run(fx('mol-lewis-water'), 'mol_bond_order', { a: 'H1', b: 'H2' }), /are not bonded/);
});

// ── gels and amplification plots ────────────────────────────────────────────

test('gel checkers: presence, shared bands, sizes with a stated tolerance, zygosity, matches, fragments', () => {
  const pcr = fx('gel-simple-pcr-presence');
  rw(pcr, 'gel_presence', { lane: '1', size: 500 }, 'yes', 'no');
  rw(pcr, 'gel_presence', { lane: '2', size: 500 }, 'no', 'yes');
  rw(pcr, 'gel_lanes_with_band', { size: 500 }, '1, 3', '1, 2');
  rw(pcr, 'gel_lanes_with_band', { size: 500, want: 'count' }, '2', '3');
  rw(pcr, 'gel_lanes_with_band', { size: 250 }, 'none', '1');
  rw(pcr, 'gel_zygosity', { lane: '1' }, 'homozygous', 'heterozygous');
  rw(S('gel_electrophoresis', { ladder: { sizes: [500, 400, 300, 200, 100] }, lanes: [{ label: 'P1', bands: [400, 200] }, { label: 'P2', bands: [300] }] }), 'gel_zygosity', { lane: 'P1' }, 'heterozygous', 'homozygous');
  refused(() => run(pcr, 'gel_zygosity', { lane: '2' }), /has 0 bands/);
  const dna = fx('gel-dense-paternity-six-lanes');
  rw(dna, 'gel_shared_bands', { a: 'Mother', b: 'Child' }, '2', '3');
  rw(dna, 'gel_match', { mode: 'paternity', child: 'Child', mother: 'Mother', candidates: ['F1', 'F2', 'F3', 'F4'] }, 'F2', 'F3');
  refused(() => run(dna, 'gel_match', { mode: 'paternity', child: 'Child', mother: 'Mother', candidates: ['F1', 'F3'] }), /no candidate matches/);
  const crime = S('gel_electrophoresis', { ladder: { sizes: [1000, 800, 600, 400, 200] }, lanes: [{ label: 'E', bands: [800, 400] }, { label: 'S1', bands: [800, 600] }, { label: 'S2', bands: [800, 400] }, { label: 'S3', bands: [400] }] });
  rw(crime, 'gel_match', { mode: 'identity', sample: 'E', candidates: ['S1', 'S2', 'S3'] }, 'S2', 'S1');
  rw(dna, 'gel_band_size', { lane: 'Child', band: 1 }, '700', '500');
  rw(dna, 'gel_fragment_count', { lane: 'Child' }, '4', '3');
  // Read by interpolation: a claimed key is accepted within 10 % and on the right side of every marker.
  const cut = fx('gel-blank-ladder-label');
  rw(cut, 'gel_band_size', { lane: 'uncut' }, '3', '2.8');
  rw(cut, 'gel_band_size', { lane: 'uncut', claimed: 2.8 }, '2.8', '3.5');
  assert.deepEqual(run(cut, 'gel_band_size', { lane: 'uncut', claimed: 3.5 }), { kind: 'number', value: 3 }, 'over 10 % off: the true size comes back');
  assert.deepEqual(run(cut, 'gel_band_size', { lane: 'uncut', claimed: 3.5, tolerancePct: 20 }), { kind: 'number', value: 3.5 });
  assert.deepEqual(run(dna, 'gel_band_size', { lane: 'Child', band: 1, claimed: 720 }), { kind: 'number', value: 700 }, 'a band level with a marker has that marker\'s size, nothing near it');
  assert.deepEqual(run(cut, 'gel_band_size', { lane: 'uncut', claimed: 4.05, tolerancePct: 25 }), { kind: 'number', value: 3 }, 'on the wrong side of the 4 kb marker');
  // The lane labelled "?" is reached by its index; the band under the blank ladder label is 1 kb.
  rw(cut, 'gel_band_size', { lane: 1, band: 1 }, '1', '0.5');
  rw(cut, 'gel_fragment_count', { lane: 1, want: 'cut_sites', dna: 'circular' }, '2', '1');
  rw(cut, 'gel_fragment_count', { lane: 1, want: 'cut_sites' }, '1', '2');
  refused(() => run(cut, 'gel_band_size', { lane: 'nobody' }), /must be the label of one sample lane/);
  refused(() => run(fx('amp-two-samples'), 'gel_presence', { lane: 0, size: 500 }), /for a gel, not an amplification plot/);
});

test('amplification-plot checkers: Ct, fold difference (2 to the ΔCt), the sample with most template', () => {
  rw(fx('amp-two-samples'), 'amp_ct', { sample: 'S1' }, '18', '23');
  rw(fx('amp-two-samples'), 'amp_fold_difference', { more: 'S1', less: 'S2' }, '32', '5');
  const four = fx('amp-dense-four-samples');
  rw(four, 'amp_fold_difference', { more: 'P', less: 'R' }, '1024', '10');
  rw(four, 'amp_fold_difference', { more: 'Q', less: 'R' }, '32', '25');
  rw(four, 'amp_fold_difference', { more: 'R', less: 'P' }, '0.001', '1024');
  rw(four, 'amp_extreme', { want: 'most' }, 'P', 'R');
  rw(four, 'amp_extreme', { want: 'least' }, 'R', 'NTC');
  refused(() => run(four, 'amp_ct', { sample: 'NTC' }), /never crosses the threshold/);
  refused(() => run(four, 'amp_fold_difference', { more: 'P', less: 'NTC' }), /never crosses/);
  // The curve whose name is a "?" is reached by its index.
  rw(fx('amp-blank-sample-name'), 'amp_ct', { sample: 1 }, '26', '20');
  rw(fx('amp-blank-sample-name'), 'amp_fold_difference', { more: 'Standard', less: 1 }, '64', '6');
  refused(() => run(S('gel_electrophoresis', { variant: 'amplification_plot', samples: [{ label: 'x', ct: 18.5 }] }), 'amp_ct', { sample: 'x' }), /between two gridlines/);
  refused(() => run(S('gel_electrophoresis', { variant: 'amplification_plot', showThreshold: false, samples: [{ label: 'x', ct: 18 }] }), 'amp_ct', { sample: 'x' }), /threshold line is not drawn/);
});

// ── bio schematics ──────────────────────────────────────────────────────────

test('bio_identify / bio_label_of across the four variants', () => {
  const cell = fx('bio-cell-animal-lettered');
  rw(cell, 'bio_identify', { label: 'Q' }, 'mitochondrion', 'nucleus');
  rw(cell, 'bio_identify', { label: 'R' }, 'the Golgi apparatus', 'the rough ER');
  rw(cell, 'bio_identify', { label: 'S' }, 'rough ER', 'smooth ER');
  rw(cell, 'bio_label_of', { part: 'mitochondrion' }, 'Q', 'P');
  rw(cell, 'bio_label_of', { part: 'golgi' }, 'R', 'S');
  const plant = fx('bio-cell-plant-dense');
  rw(plant, 'bio_identify', { label: '1' }, 'cell wall', 'cell membrane');
  rw(plant, 'bio_identify', { label: '5' }, 'chloroplast', 'mitochondrion');
  rw(plant, 'bio_identify', { label: '4' }, 'central vacuole', 'nucleus');
  rw(fx('bio-cell-blank-label'), 'bio_identify', { label: '?' }, 'Golgi apparatus', 'smooth ER');
  refused(() => run(fx('bio-cell-blank-label'), 'bio_label_of', { part: 'smooth_er' }), /carries no printed label/);
  refused(() => run(cell, 'bio_identify', { label: 'Z' }), /no part of the figure is labelled "Z"/);
  const mem = fx('bio-membrane-dense-pump-carrier-labels');
  rw(mem, 'bio_identify', { label: 'R' }, 'carbohydrate', 'cholesterol');
  rw(mem, 'bio_identify', { label: 'Q' }, 'fatty acid tails', 'phospholipid head');
  rw(mem, 'bio_identify', { label: 'S' }, 'peripheral protein', 'channel protein');
  rw(mem, 'bio_label_of', { part: 'cholesterol' }, 'T', 'S');
  rw(fx('bio-membrane-blank-part-label'), 'bio_identify', { label: '?' }, 'carbohydrate', 'protein');
  rw(fx('bio-division-mitosis-strip'), 'bio_identify', { label: 'Z' }, 'metaphase', 'anaphase');
  rw(fx('bio-compartments-chloroplast-dense'), 'bio_identify', { label: 'Y' }, 'thylakoid lumen', 'stroma');
  rw(fx('bio-compartments-blank-space'), 'bio_identify', { label: '?' }, 'intermembrane space', 'matrix');
});

test('membrane_net_movement / membrane_transport: down the gradient is passive, against it needs the ATP pump', () => {
  const simple = fx('bio-membrane-channel-gradient');
  rw(simple, 'membrane_net_movement', {}, 'into the cell', 'out of the cell');
  refused(() => run(simple, 'membrane_transport', {}), /has no arrow on the figure/);
  const dense = fx('bio-membrane-dense-pump-carrier-labels');
  rw(dense, 'membrane_net_movement', { solute: 'solute 2' }, 'into the cell', 'out of the cell');
  rw(dense, 'membrane_transport', { solute: 0 }, 'facilitated diffusion', 'active transport');
  rw(dense, 'membrane_transport', { solute: 'solute 2' }, 'active transport', 'facilitated diffusion');
  rw(dense, 'membrane_transport', { solute: 1, as: 'active_or_passive' }, 'active', 'passive');
  rw(dense, 'membrane_transport', { solute: 0, as: 'active_or_passive' }, 'passive', 'active');
  const m = (solute: Args, proteins: Args[] = [{ type: 'carrier' }]): PracticeFigureSpec => S('bio_schematic', { variant: 'membrane', proteins, solutes: [solute] });
  rw(m({ outside: 2, inside: 9, through: 'bilayer', arrow: 'out' }), 'membrane_transport', {}, 'simple diffusion', 'facilitated diffusion');
  rw(m({ outside: 2, inside: 9, through: 0, arrow: 'out' }), 'membrane_transport', {}, 'facilitated diffusion', 'simple diffusion');
  rw(m({ outside: 2, inside: 9 }), 'membrane_net_movement', {}, 'out of the cell', 'into the cell');
  rw(m({ outside: 5, inside: 5 }), 'membrane_net_movement', {}, 'no net movement', 'into the cell');
  refused(() => run(m({ outside: 2, inside: 9, through: 0, arrow: 'in' }), 'membrane_transport', {}), /against the gradient through something that shows no ATP/);
  refused(() => run(m({ outside: 2, inside: 9, through: 0, arrow: 'out' }, [{ type: 'pump' }]), 'membrane_transport', {}), /DOWN the gradient through a pump/);
  refused(() => run(m({ outside: 5, inside: 5, through: 0, arrow: 'in' }), 'membrane_transport', {}), /there is no gradient/);
  refused(() => run(fx('bio-cell-animal-lettered'), 'membrane_net_movement', {}), /membrane variant, not cell/);
});

test('division_count / division_stage: mitosis and meiosis of 2n = 4 and 2n = 6', () => {
  const mit = fx('bio-division-mitosis-strip');
  rw(mit, 'division_stage', { cell: 'Z' }, 'metaphase', 'anaphase');
  rw(mit, 'division_stage', { cell: 'X' }, 'anaphase', 'telophase');
  rw(mit, 'division_stage', { cell: 1 }, 'prophase', 'metaphase');
  rw(mit, 'division_count', { cell: 'Z', want: 'chromosomes' }, '4', '8');
  rw(mit, 'division_count', { cell: 'Z', want: 'chromatids' }, '8', '4');
  rw(mit, 'division_count', { cell: 'X', want: 'chromosomes' }, '8', '4');
  rw(mit, 'division_count', { cell: 'X', want: 'dna_molecules' }, '8', '16');
  refused(() => run(mit, 'division_count', { cell: 'X', want: 'chromatids' }), /sister chromatids of that cell have separated/);
  const mei = fx('bio-division-meiosis-dense');
  rw(mei, 'division_stage', { cell: '1' }, 'metaphase I', 'metaphase II');
  rw(mei, 'division_stage', { cell: '2' }, 'anaphase I', 'anaphase II');
  rw(mei, 'division_stage', { cell: '4' }, 'anaphase II', 'anaphase I');
  rw(mei, 'division_count', { cell: '1', want: 'chromosomes' }, '6', '12');
  rw(mei, 'division_count', { cell: '2', want: 'chromatids' }, '12', '6');
  rw(mei, 'division_count', { cell: '3', want: 'chromosomes' }, '3', '6');
  rw(mei, 'division_count', { cell: '3', want: 'dna_molecules' }, '6', '3');
  rw(mei, 'division_count', { cell: '4', want: 'chromosomes' }, '6', '3');
  rw(fx('bio-division-blank-stage-name'), 'division_stage', { cell: '?' }, 'telophase', 'anaphase');
  refused(() => run(fx('bio-division-blank-stage-name'), 'division_stage', { cell: 'metaphase' }), /printed under it/);
});

test('compartment_gradient: more dots or a lower pH is more H⁺; flow through ATP synthase runs down the gradient', () => {
  const mito = fx('bio-compartments-mitochondrion');
  rw(mito, 'compartment_gradient', { want: 'higher' }, 'intermembrane space', 'matrix');
  rw(mito, 'compartment_gradient', { want: 'lower' }, 'matrix', 'intermembrane space');
  rw(mito, 'compartment_gradient', { want: 'flow_to' }, 'matrix', 'intermembrane space');
  const chl = fx('bio-compartments-chloroplast-dense');
  rw(chl, 'compartment_gradient', { want: 'higher' }, 'Y', 'X');
  rw(chl, 'compartment_gradient', { want: 'higher', as: 'name' }, 'thylakoid lumen', 'stroma');
  rw(chl, 'compartment_gradient', { want: 'flow_to' }, 'X', 'Y');
  rw(chl, 'compartment_gradient', { want: 'flow_from', as: 'name' }, 'thylakoid lumen', 'stroma');
  // A space whose label is a blank is named by what it is.
  rw(fx('bio-compartments-blank-space'), 'compartment_gradient', { want: 'higher' }, 'intermembrane space', 'matrix');
  refused(() => run(fx('bio-compartments-blank-space'), 'compartment_gradient', { want: 'flow_to' }), /ATP synthase is not drawn/);
  refused(() => run(S('bio_schematic', { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'matrix', ions: 5 }, { id: 'intermembrane_space', ions: 5 }] }), 'compartment_gradient', { want: 'higher' }), /no H⁺ gradient/);
});

// ── maps and magnets ────────────────────────────────────────────────────────

test('schematic_map checkers: distance by the scale bar, direction, extreme and counted regions, the region of a marker', () => {
  const simple = fx('map-islands-simple');
  rw(simple, 'map_distance', { from: 'P', to: 'Q' }, '300', '6');
  rw(simple, 'map_distance', { from: 'Q', to: 'R' }, '100', '2');
  rw(simple, 'map_direction', { from: 'P', to: 'Q' }, 'east', 'west');
  rw(simple, 'map_direction', { from: 'Q', to: 'R' }, 'south', 'north');
  rw(simple, 'map_marker_region', { marker: 'R' }, 'Isla Sur', 'Isla Norte');
  rw(simple, 'map_marker_region', { marker: 'P' }, 'Mainland', 'Isla Sur');
  refused(() => run(simple, 'map_marker_region', { marker: 'Q' }), /lies in no region/);
  refused(() => run(simple, 'map_direction', { from: 'P', to: 'R' }), /not within 12° of one of the eight/);
  refused(() => run(simple, 'map_extreme_region', { want: 'highest' }), /fewer than two regions carry a value/);
  const dense = fx('map-dense-choropleth-arrows');
  rw(dense, 'map_extreme_region', { want: 'highest' }, 'Mainland', 'P');
  rw(dense, 'map_extreme_region', { want: 'lowest' }, 'S', 'R');
  rw(dense, 'map_region_count', { op: 'above', value: 5 }, '3', '2');
  rw(dense, 'map_region_count', { op: 'equal', value: 6 }, '2', '1');
  rw(dense, 'map_region_count', { op: 'at_most', value: 3 }, '2', '3');
  rw(dense, 'map_distance', { from: 'W', to: 'X' }, '447.2', '400');
  rw(dense, 'map_distance', { from: 'X', to: 'R' }, '447.2', '200');
  rw(dense, 'map_direction', { from: 'Y', to: 'Z' }, 'southeast', 'northeast');
  rw(dense, 'map_direction', { from: 'Mainland', to: 'R' }, 'east', 'northeast');
  // A marker on the region whose label is a "?" box: the region is named by its `name` (or its number).
  const blank = fx('map-blank-region-label');
  rw(blank, 'map_marker_region', { marker: 'L' }, 'region 2', 'Tern I.');
  rw(blank, 'map_direction', { from: 'K', to: 'L' }, 'east', 'north');
  rw(blank, 'map_distance', { from: 'K', to: 'L' }, '800', '8');
});

test('bar-magnet checkers: field direction, compass needles, which end is north, attract or repel', () => {
  const one = fx('magnet-single-field-lines');
  rw(one, 'magnet_field_direction', { point: 'P' }, 'left', 'right');
  rw(one, 'magnet_north_end', {}, 'right', 'left');
  refused(() => run(one, 'magnet_interaction', {}), /only one magnet/);
  rw(fx('magnet-blank-poles'), 'magnet_north_end', {}, 'left', 'right');
  refused(() => run(S('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left', poles: 'none' }], arrows: false }), 'magnet_north_end', {}), /nothing on the figure fixes which end is north/);
  const two = fx('magnet-dense-two-magnets-compasses');
  rw(two, 'magnet_interaction', {}, 'repel', 'attract');
  rw(two, 'magnet_compass_direction', { compass: '1' }, 'up', 'down');
  rw(two, 'magnet_compass_direction', { compass: '3' }, 'down', 'up');
  rw(two, 'magnet_compass_direction', { compass: '2' }, 'right', 'left');
  rw(two, 'magnet_north_end', { magnet: 1 }, 'left', 'right');
  rw(S('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'left' }, { north: 'left' }] }), 'magnet_interaction', {}, 'attract', 'repel');
  // Standard cases round one magnet (N on the right): beyond N the field points away from the magnet,
  // beyond S toward it, beside the middle from N back to S.
  const probe = (x: number, y: number): Derived => run(S('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'right' }], points: [{ x, y, label: 'K' }] }), 'magnet_field_direction', { point: 'K' });
  assert.deepEqual([probe(2.6, 0), probe(-2.6, 0), probe(0, 1.4), probe(0, -1.4)].map((d) => (d as { value: string }).value), ['right', 'right', 'left', 'left']);
  // Off the eight directions (73° here) the checker refuses rather than round.
  refused(() => run(S('field_diagram', { variant: 'bar_magnet', magnets: [{ north: 'right' }, { north: 'left' }], points: [{ x: 3.2, y: -1.45, label: 'K' }] }), 'magnet_field_direction', { point: 'K' }), /not within 12° of one of the eight/);
});

// ── the option-letter guard ─────────────────────────────────────────────────

test('figureLetterClash: option letters that are also labels printed on the figure', () => {
  const four = ['one', 'two', 'three', 'four'];
  const tree = { children: ['Lamprey', { node: 'A', children: ['Trout', { node: 'B', children: ['Frog', { node: 'E', children: ['Lizard', 'Mouse'] }] }] }] };
  const clash = figureLetterClash(S('phylogenetic_tree', { tree }), four);
  assert.deepEqual(clash?.letters, ['A', 'B']);
  assert.ok(/prints the labels "A", "B".*option letters.*letterLabels: 'numerals'/.test(clash?.message ?? ''));
  // The param it recommends removes the clash; so do later letters, a typed answer, and fewer options.
  assert.equal(figureLetterClash(S('phylogenetic_tree', { tree, letterLabels: 'numerals' }), four), null);
  assert.equal(figureLetterClash(S('phylogenetic_tree', { tree, letterLabels: 'roman' }), four), null);
  assert.equal(figureLetterClash(S('phylogenetic_tree', { tree }), []), null);
  assert.deepEqual(figureLetterClash(S('phylogenetic_tree', { tree }), ['yes', 'no'])?.letters, ['A', 'B']);
  assert.equal(figureLetterClash(S('phylogenetic_tree', { tree: { children: ['x', { node: 'E', children: ['y', 'z'] }] } }), four), null);
  assert.deepEqual(figureLetterClash(S('spectrum', { variant: 'pes', showEnergies: false, peaks: [{ energy: 100, electrons: 2, label: 'A' }, { energy: 10, electrons: 2, label: 'D' }] }), four)?.letters, ['A', 'D']);
  assert.deepEqual(figureLetterClash(S('unit_circle', { angles: [{ degrees: 30, name: 'C' }] }), four)?.letters, ['C']);
  assert.equal(figureLetterClash(S('unit_circle', { letterLabels: 'numerals', angles: [{ degrees: 30, name: 'C' }] }), four), null);
  // Kinds without the param are told to relabel; it sees the drawn picture, so a hidden label is no clash.
  const cellClash = figureLetterClash(S('bio_schematic', { variant: 'cell', cellType: 'animal', organelles: [{ type: 'nucleus', label: 'A' }, { type: 'golgi', label: 'D' }] }), four);
  assert.ok(cellClash && /relabel them with numbers/.test(cellClash.message) && cellClash.letters.join('') === 'AD');
  assert.equal(figureLetterClash(S('geometric_figure', { shape: 'triangle', sides: [3, 4, 5], vertices: null }), four), null);
  assert.deepEqual(figureLetterClash(S('geometric_figure', { shape: 'triangle', sides: [3, 4, 5] }), four)?.letters, ['A', 'B', 'C']);
  // Element symbols are not names either: the C of carbon is no clash, a caption or a group letter is.
  assert.equal(figureLetterClash(fx('mol-dense-resonance-carbonate'), four), null);
  const lettered = S('molecular_structure', { molecules: [{ label: 'A', atoms: [{ id: 'c', el: 'C', x: 0, y: 0 }, { id: 'o', el: 'O', x: 1, y: 0 }], bonds: [{ a: 'c', b: 'o', order: 2 }], highlight: [{ atoms: ['o'], label: 'B' }] }] });
  assert.deepEqual(figureLetterClash(lettered, four)?.letters, ['A', 'B']);
  // A circuit's meter symbols are not names.
  assert.equal(figureLetterClash(fx('circuit-series-two-resistors'), four), null);
  // None of this round's fixtures clashes with A–D.
  for (const f of BATCH3_FIXTURES) assert.equal(figureLetterClash(f.spec, four), null, f.id);
});

// ── the item as a whole ─────────────────────────────────────────────────────

test('a batch-3 item is examined like any other: the key is recomputed from the spec', () => {
  const mc = item(fx('bio-division-mitosis-strip'), {
    responseFormat: 'mcq', problemText: 'The figure shows three cells of one organism during mitosis. In which stage is cell Z?', choices: ['prophase', 'metaphase', 'anaphase', 'telophase'], answer: 'B',
    alt: 'Three schematic cells with stick chromosomes, lettered X, Y and Z.', derivation: { checker: 'division_stage', args: { cell: 'Z' } },
  });
  const ok = examineFigureItem(mc);
  assert.equal(ok.derivation.status, 'derived', JSON.stringify(ok));
  assert.equal(examineFigureItem({ ...mc, answer: 'C' }).derivation.status, 'mismatch');
  const num = item(fx('amp-dense-four-samples'), { problemText: 'Using the amplification plot shown, how many times more target DNA did sample P start with than sample R?', answer: '1024', alt: 'An amplification plot with four curves and a threshold line.', derivation: { checker: 'amp_fold_difference', args: { more: 'P', less: 'R' } } });
  assert.equal(examineFigureItem(num).derivation.status, 'derived');
  assert.equal(examineFigureItem({ ...num, answer: '10' }).derivation.status, 'mismatch');
  const bad = examineFigureItem({ ...num, derivation: { checker: 'gel_presence', args: { lane: 0, size: 500 } } });
  assert.equal(bad.derivation.status, 'error');
  assert.ok(bad.defects.some((d) => /not an amplification plot/.test(d)));
  const magnet = item(fx('magnet-blank-poles'), { responseFormat: 'mcq', problemText: 'The diagram shows the field lines of a bar magnet. Which end of the magnet is its north pole?', choices: ['the left end', 'the right end', 'both ends', 'neither end'], answer: 'A', alt: 'A bar magnet with field lines carrying arrowheads.', derivation: { checker: 'magnet_north_end', args: {} } });
  assert.equal(examineFigureItem(magnet).derivation.status, 'derived', JSON.stringify(examineFigureItem(magnet)));
});

test('every batch-3 checker was exercised above', () => {
  for (const name of Object.keys(BATCH3_CHECKERS)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch3 test(s) passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
