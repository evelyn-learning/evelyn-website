/**
 * Tests for scripts/practice-extend/figure-core-batch5-table.ts (data_table),
 * reached the way the job reaches it — through figure-core.ts.
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * textbook-standard cases with known answers (initial rates: four of them);
 * the transcription says what is printed, keeps a blank blank and the alt
 * text names the headers, never the numbers.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch5-table.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b5-table';
import { BATCH5_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch5-table';

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
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'numeric', problemText: 'Use the table shown. What value does it give?', answer: '0', choices: [], hints: ['Read the table.'],
    solutionText: 'Work it out from the table.', difficulty: 2, covers: 'reading the table', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A table.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
function rwText(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: right }), d).match, true, `${checker}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: wrong }), d).match, false, `${checker}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const T = (params: Args): PracticeFigureSpec => ({ type: 'data_table', params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

const twoWay = fx('table-simple-two-way');
const missing = fx('table-blank-two-way-missing-cell');
const rates = fx('table-initial-rates');
const values = fx('table-values-blank-function');
const kinetics = fx('table-dense-kinetics-six-by-eight');

test('registration: the part speaks for data_table; its checkers are in BATCH5_CHECKERS and in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['data_table']);
  for (const k of Object.keys(PART.checkers)) assert.equal(BATCH5_CHECKERS[k], PART.checkers[k], k);
  const cat = checkerCatalogue(['data_table']);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
});

test('transcription: row by row under the column headers; a blank stays a blank; totals are named', () => {
  const t = textOf(missing);
  assert.ok(t.startsWith('The figure is a table with five columns and three rows under a header row.'), t.split('\n')[0]);
  assert.ok(t.includes('- column header: "In favour"') && t.includes('- row name: "Under 40"'));
  assert.ok(t.includes('Age group: "Under 40"; In favour: "62"; Against: (blank — a "?" box); No opinion: "8"; Total: "90"'), t);
  assert.ok(t.includes('(the totals row)') && t.includes('One cell is left out'));
  // The value under the "?" (20) is in no line of the transcription.
  assert.ok(!t.includes('Against: "20"'), 'the value under the "?" is not transcribed');
  const k = textOf(kinetics);
  assert.ok(k.includes('- title: "Decomposition of N₂O₅ at 45 °C"') && k.includes('- column header: "1/[N₂O₅] (L/mol)"'));
  assert.ok(k.includes('Time (min): "70"; [N₂O₅] (mol/L): "0.0009"; [NO₂] (mol/L): "0.0182"; [O₂] (mol/L): "0.0046"; ln [N₂O₅]: "−7.013"; 1/[N₂O₅] (L/mol): "1111"'), k);
  assert.ok(textOf(twoWay).includes('The heading "Travel to school" spans the data columns.') && textOf(twoWay).includes('(an empty corner)'));
});

test('describeForAlt: names the headers and counts the blanks, never a cell value', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length > 20 && alt.length <= 600, `${f.id}: ${alt.length}`);
    assert.ok(/^A table with /.test(alt), `${f.id}: ${alt}`);
  }
  const alt = describeForAlt(missing);
  assert.ok(alt.includes('"In favour"') && alt.includes('"Under 40"') && /One place is left blank/.test(alt), alt);
  for (const n of ['62', '48', '110', '200', '20']) assert.ok(!new RegExp(`\\b${n}\\b`).test(alt), `${n} in: ${alt}`);
  assert.ok(!/0\.\d/.test(describeForAlt(rates)), describeForAlt(rates));
});

test('table_cell and table_lookup: a printed cell is read; a blank, an empty cell and a missing row are refused', () => {
  rw(twoWay, 'table_cell', { row: 'Grade 9', column: 'Bus' }, '45', '30');
  rw(kinetics, 'table_cell', { row: 2, column: '[N₂O₅]' }, '0.005', '0.0025');
  rw(kinetics, 'table_cell', { row: 3, column: 'ln [N₂O₅]' }, '-5.655', '5.655');
  rw(rates, 'table_cell', { row: 1, column: 'Initial rate (M/s)' }, '0.0001', '0.001');
  rwText(fx('table-long-headers-wrapped'), 'table_cell', { row: 'H₂O', column: 1 }, 'liquid', 'gas');
  refused(() => run(missing, 'table_cell', { row: 'Under 40', column: 'Against' }), /left out on the figure \(a "\?" box\).*table_missing_cell/);
  refused(() => run(twoWay, 'table_cell', { row: 'Grade 11', column: 'Bus' }), /"row" must be the name of a row \("Grade 9", "Grade 10", "Total"\)/);
  refused(() => run(twoWay, 'table_cell', { row: 0, column: 'Train' }), /"column" must be the header/);
  rw(values, 'table_lookup', { where: 'x', equals: 2, find: 'f(x)' }, '11', '12');
  rw(values, 'table_lookup', { where: 'g(x)', equals: 24, find: 'x' }, '3', '4');
  refused(() => run(values, 'table_lookup', { where: 'x', equals: 3, find: 'f(x)' }), /left out on the figure/);
  refused(() => run(values, 'table_lookup', { where: 'x', equals: 9, find: 'f(x)' }), /no row has 9 under "x"/);
});

test('table_missing_cell: solved from the row total and the column total (they must agree); refused when nothing fixes it', () => {
  rw(missing, 'table_missing_cell', {}, '20', '28');
  rw(missing, 'table_missing_cell', { row: 'Under 40', column: 'Against' }, '20', '70');
  // A missing TOTAL is the sum of its parts.
  const tot = T({ columns: ['', 'Yes', 'No', 'Total'], rows: [['Boys', 12, 18, 30], ['Girls', 15, 5, '?'], ['Total', 27, 23, 50]], rowHeaders: true, totalsRow: true, totalsColumn: true });
  rw(tot, 'table_missing_cell', {}, '20', '30');
  // Only a totals column: solved along the row.
  rw(T({ columns: ['', 'Yes', 'No', 'Total'], rows: [['Boys', 12, '?', 30], ['Girls', 15, 5, 20]], rowHeaders: true, totalsColumn: true }), 'table_missing_cell', {}, '18', '12');
  refused(() => run(values, 'table_missing_cell', { row: 3, column: 'f(x)' }), /nothing printed on the table fixes the cell/);
  refused(() => run(values, 'table_missing_cell', {}), /has 2 cells left out/);
  refused(() => run(twoWay, 'table_missing_cell', { row: 'Grade 9', column: 'Bus' }), /is not left out/);
  // Row total says 20, column total says 22: the table contradicts itself.
  refused(() => run(T({ columns: ['', 'Yes', 'No', 'Total'], rows: [['Boys', 12, '?', 32], ['Girls', 15, 5, 20], ['Total', 27, 27, 52]], rowHeaders: true, totalsRow: true, totalsColumn: true }), 'table_missing_cell', {}), /different values for the cell left out \(20 and 22\)/);
  // Two blanks in one row: the row total cannot fix either, the column totals can.
  const two = T({ columns: ['', 'Yes', 'No', 'Total'], rows: [['Boys', '?', '?', 30], ['Girls', 15, 5, 20], ['Total', 27, 23, 50]], rowHeaders: true, totalsRow: true, totalsColumn: true });
  rw(two, 'table_missing_cell', { row: 'Boys', column: 'Yes' }, '12', '18');
});

test('table_total: a row, a column, the whole table — from the cells, never from a blank', () => {
  rw(twoWay, 'table_total', { row: 'Grade 10' }, '75', '150');
  rw(twoWay, 'table_total', { column: 'Walk' }, '50', '30');
  rw(twoWay, 'table_total', {}, '150', '300');
  // A blank a printed total fixes is counted in the whole-table total; a row sum over it is refused.
  rw(missing, 'table_total', {}, '200', '180');
  refused(() => run(missing, 'table_total', { row: 'Under 40' }), /left out on the figure/);
  refused(() => run(twoWay, 'table_total', { row: 'Total' }), /IS the totals row/);
  refused(() => run(twoWay, 'table_total', { column: 'Total' }), /holds the totals or the row names/);
  refused(() => run(values, 'table_total', {}), /needs row names/);
  // Printed totals that contradict the cells settle nothing.
  refused(() => run(T({ columns: ['', 'Yes', 'No', 'Total'], rows: [['Boys', 12, 18, 31], ['Girls', 15, 5, 20]], rowHeaders: true, totalsColumn: true }), 'table_total', {}), /printed total of "Boys" \(31\) is not the sum of its cells \(30\)/);
});

test('table_relative_frequency: joint, marginal and both conditionals of a two-way table (textbook cases), as fractions', () => {
  // 150 students: Grade 9 walk 30 / bus 45; Grade 10 walk 20 / bus 55.
  rw(twoWay, 'table_relative_frequency', { row: 'Grade 9', column: 'Walk' }, '0.2', '0.6');           // joint 30/150
  rw(twoWay, 'table_relative_frequency', { row: 'Grade 9' }, '0.5', '0.4');                            // marginal 75/150
  rw(twoWay, 'table_relative_frequency', { column: 'Bus' }, '2/3', '1/3');                             // marginal 100/150
  rw(twoWay, 'table_relative_frequency', { row: 'Grade 9', givenColumn: 'Walk' }, '0.6', '0.4');       // P(G9 | walk) = 30/50
  rw(twoWay, 'table_relative_frequency', { column: 'Walk', givenRow: 'Grade 9' }, '0.4', '0.6');       // P(walk | G9) = 30/75
  rw(twoWay, 'table_relative_frequency', { column: 'Bus', givenRow: 'Grade 10' }, '11/15', '55/100');  // 55/75
  // The classic "survey of 200": P(against | under 40) = 20/90 = 2/9 — through the cell the totals fix.
  rw(missing, 'table_relative_frequency', { column: 'Against', givenRow: 'Under 40' }, '2/9', '2/7');
  rw(missing, 'table_relative_frequency', { row: '40 and over', givenColumn: 'No opinion' }, '0.6', '0.4'); // 12/20
  // Without printed totals the margins are still counted.
  rw(T({ columns: ['', 'Pass', 'Fail'], rows: [['Studied', 36, 4], ['Did not study', 9, 11]], rowHeaders: true }), 'table_relative_frequency', { column: 'Pass', givenRow: 'Studied' }, '0.9', '0.8');
  refused(() => run(twoWay, 'table_relative_frequency', { row: 'Total', column: 'Walk' }), /must name a data row, not the totals/);
  refused(() => run(twoWay, 'table_relative_frequency', { row: 'Grade 9', givenRow: 'Grade 10' }), /with givenRow, name the column/);
  refused(() => run(twoWay, 'table_relative_frequency', {}), /name a row, a column, or both/);
  refused(() => run(values, 'table_relative_frequency', { row: 0 }), /needs row names/);
});

test('table_average_rate, table_slope, table_common_ratio, table_pattern: rates of change between rows', () => {
  // Δ[N₂O₅]/Δt from 0 to 20 min: (0.0050 − 0.0100)/20 = −0.00025 mol/(L·min).
  rw(kinetics, 'table_average_rate', { x: 'Time (min)', y: '[N₂O₅] (mol/L)', from: 0, to: 2 }, '-0.00025', '0.00025');
  rw(kinetics, 'table_average_rate', { x: 'Time', y: '[O₂]', from: 0, to: 2 }, '0.000125', '0.00025');
  refused(() => run(kinetics, 'table_average_rate', { x: 'Time', y: '[O₂]', from: 1, to: 1 }), /different values in the x column/);
  const lin = T({ columns: ['x', 'f(x)', 'g(x)', 'h(x)'], rows: [[0, 5, 3, 1], [1, 8, 6, 2], [2, 11, 12, 5], [3, 14, 24, 10]] });
  rw(lin, 'table_slope', { x: 'x', y: 'f(x)' }, '3', '5');
  refused(() => run(lin, 'table_slope', { x: 'x', y: 'g(x)' }), /not constant from row to row/);
  rw(lin, 'table_common_ratio', { x: 'x', y: 'g(x)' }, '2', '3');
  refused(() => run(lin, 'table_common_ratio', { x: 'x', y: 'f(x)' }), /not constant — the table is not exponential/);
  rwText(lin, 'table_pattern', { x: 'x', y: 'f(x)' }, 'linear', 'exponential');
  rwText(lin, 'table_pattern', { x: 'x', y: 'g(x)' }, 'exponential', 'linear');
  rwText(lin, 'table_pattern', { x: 'x', y: 'h(x)' }, 'neither', 'linear');
  // Half-life data: [A] halves every 100 s — a ratio of 1/2 per 100 s step.
  rw(T({ columns: [{ header: 'Time', unit: 's' }, { header: '[A]', unit: 'M' }], rows: [[0, 0.8], [100, 0.4], [200, 0.2], [300, 0.1]] }), 'table_common_ratio', { x: 'Time', y: '[A]' }, '0.5', '2');
  refused(() => run(T({ columns: ['x', 'y'], rows: [[0, 1], [1, 2], [3, 4]] }), 'table_pattern', { x: 'x', y: 'y' }), /equal steps in the x column/);
  refused(() => run(values, 'table_slope', { x: 'x', y: 'f(x)' }), /left out on the figure/);
  refused(() => run(lin, 'table_slope', { x: 'x', y: 'x' }), /same column/);
});

test('table_extreme: the row with the greatest or least value; a tie is refused', () => {
  rwText(fx('table-long-headers-wrapped'), 'table_extreme', { column: 2, which: 'smallest' }, 'CO₂', 'NO₂');
  rwText(fx('table-long-headers-wrapped'), 'table_extreme', { column: 2, which: 'largest' }, 'NO₂', 'CH₄');
  refused(() => run(twoWay, 'table_extreme', { column: 'Total', which: 'largest' }), /two rows tie/);
  refused(() => run(values, 'table_extreme', { column: 'f(x)', which: 'largest' }), /needs row names/);
});

test('method of initial rates against textbook cases: orders, overall order and rate constant', () => {
  // (1) The fixture: rate = k[NO]²[O₂], k = 2.5e-5 / (0.010² × 0.010) = 25 M⁻²s⁻¹.
  rw(rates, 'table_reaction_order', { rate: 'Initial rate (M/s)', concentration: '[NO] (M)' }, '2', '1');
  rw(rates, 'table_reaction_order', { rate: 'Initial rate', concentration: '[O₂]' }, '1', '2');
  rw(rates, 'table_overall_order', { rate: 'Initial rate' }, '3', '2');
  rw(rates, 'table_rate_constant', { rate: 'Initial rate' }, '25', '2.5');
  // (2) NH₄⁺ + NO₂⁻ → N₂ + 2 H₂O (Brown, LeMay): first order in each, k = 2.7 × 10⁻⁴ M⁻¹s⁻¹.
  const nh4 = T({
    columns: ['Experiment', { header: '[NH₄⁺]', unit: 'M' }, { header: '[NO₂⁻]', unit: 'M' }, { header: 'Initial rate', unit: 'M/s' }],
    rows: [[1, '0.0100', '0.200', '5.4 × 10⁻⁷'], [2, '0.0200', '0.200', '10.8 × 10⁻⁷'], [3, '0.200', '0.0202', '10.8 × 10⁻⁷'], [4, '0.200', '0.0404', '21.6 × 10⁻⁷']],
  });
  rw(nh4, 'table_reaction_order', { rate: 'Initial rate', concentration: '[NH₄⁺]' }, '1', '2');
  rw(nh4, 'table_reaction_order', { rate: 'Initial rate', concentration: '[NO₂⁻]' }, '1', '0');
  rw(nh4, 'table_rate_constant', { rate: 'Initial rate' }, '0.00027', '0.0027');
  // (3) BrO₃⁻ + 5 Br⁻ + 6 H⁺ (Zumdahl): orders 1, 1, 2; overall 4; k = 8.0 M⁻³s⁻¹.
  const bro3 = T({
    columns: ['Trial', '[BrO₃⁻]', '[Br⁻]', '[H⁺]', { header: 'Rate', unit: 'M/s' }],
    rows: [[1, 0.1, 0.1, 0.1, '8.0 × 10⁻⁴'], [2, 0.2, 0.1, 0.1, '1.6 × 10⁻³'], [3, 0.2, 0.2, 0.1, '3.2 × 10⁻³'], [4, 0.1, 0.1, 0.2, '3.2 × 10⁻³']],
  });
  rw(bro3, 'table_reaction_order', { rate: 'Rate', concentration: '[BrO₃⁻]' }, '1', '2');
  rw(bro3, 'table_reaction_order', { rate: 'Rate', concentration: '[Br⁻]' }, '1', '2');
  rw(bro3, 'table_reaction_order', { rate: 'Rate', concentration: '[H⁺]' }, '2', '1');
  rw(bro3, 'table_overall_order', { rate: 'Rate' }, '4', '3');
  rw(bro3, 'table_rate_constant', { rate: 'Rate' }, '8', '0.8');
  // (4) A zero-order reactant: doubling [B] leaves the rate unchanged; second order in A.
  const zero = T({ columns: ['Run', '[A]', '[B]', 'Rate'], rows: [[1, 0.1, 0.1, 0.02], [2, 0.2, 0.1, 0.08], [3, 0.1, 0.2, 0.02]] });
  rw(zero, 'table_reaction_order', { rate: 'Rate', concentration: '[B]' }, '0', '1');
  rw(zero, 'table_reaction_order', { rate: 'Rate', concentration: '[A]', concentrations: ['[A]', '[B]'] }, '2', '1');
  rw(zero, 'table_rate_constant', { rate: 'Rate' }, '2', '0.2');
  // Refusals: an order that cannot be isolated; an order that is not a whole or half number; rows that disagree.
  refused(() => run(T({ columns: ['Run', '[A]', '[B]', 'Rate'], rows: [[1, 0.1, 0.1, 0.02], [2, 0.2, 0.2, 0.08]] }), 'table_reaction_order', { rate: 'Rate', concentration: '[A]' }), /no two rows change "\[A\]" alone/);
  refused(() => run(T({ columns: ['Run', '[A]', 'Rate'], rows: [[1, 0.1, 0.02], [2, 0.2, 0.05]] }), 'table_reaction_order', { rate: 'Rate', concentration: '[A]' }), /do not give a whole \(or half\) order/);
  refused(() => run(T({ columns: ['Run', '[A]', 'Rate'], rows: [[1, 0.1, 0.02], [2, 0.2, 0.04], [3, 0.4, 0.16]] }), 'table_reaction_order', { rate: 'Rate', concentration: '[A]' }), /different pairs of rows give different orders/);
  refused(() => run(rates, 'table_reaction_order', { rate: 'Initial rate', concentration: 'Initial rate' }), /not one of the concentration columns/);
});

test('examineFigureItem: a right key is derived, a wrong key is a defect; an alt that states the key is caught', () => {
  const q = 'In the table shown, one count has been left out. How many of the people under 40 are against the park?';
  const ok = examineFigureItem(item(missing, { problemText: q, answer: '20', alt: describeForAlt(missing), derivation: { checker: 'table_missing_cell', args: {} } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  assert.ok(ok.figureText?.includes('a table with five columns'));
  const bad = examineFigureItem(item(missing, { problemText: q, answer: '28', alt: describeForAlt(missing), derivation: { checker: 'table_missing_cell', args: {} } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const mcq = examineFigureItem(item(rates, { responseFormat: 'mcq', problemText: 'Initial-rate data for a reaction are shown. What is the order of the reaction with respect to NO?', answer: 'C', choices: ['0', '1', '2', '3'], alt: 'A table of four experiments giving the starting concentrations of the reactants and the initial rate.', derivation: { checker: 'table_reaction_order', args: { rate: 'Initial rate', concentration: '[NO]' } } }));
  assert.deepEqual(mcq.defects, []);
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), `${k} has no test`);
});

console.log(`${passed} figure-core-batch5-table test(s) passed`);
