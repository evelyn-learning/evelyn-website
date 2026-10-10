/**
 * Batch 5, to-dos c and h — `describeForAlt` (figure-core.ts) and
 * `figureLetterClash` (figure-core-batch3.ts):
 *   c: role plurals ("branch probabilities", "velocities before", "names under
 *      the brackets"), an opener that says what is drawn (a curve AND a line;
 *      a bar chart of what), counts taken from what is drawn (the pieces of one
 *      function are one curve; every marked point of a conic is counted), the
 *      letters of a sequence strip and the printed values of a bar chart named
 *      — never a hidden one;
 *   h: multiple-choice options that are single base letters beside a sequence
 *      strip are flagged (they read as option letters A–D).
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/practice-extend/figure-core-batch5-alt.test.ts
 */
import '../lib/no-db-env';
import { strict as assert } from 'node:assert';
import { FIGURE_FIXTURES } from '../lib/practice-figure-fixtures';
import { makeRunner } from '../lib/practice-figure-test-kit';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { altRolePlural, describeForAlt, figureLetterClash } from './figure-core';

const { test, finish } = makeRunner();
const S = (type: string, params: Record<string, unknown>): PracticeFigureSpec => ({ type, params });
const fx = (id: string): PracticeFigureSpec => {
  const f = FIGURE_FIXTURES.find((x) => x.id === id);
  if (!f) throw new Error(`no fixture ${id}`);
  return f.spec;
};

console.log('\nc — describeForAlt:\n');

test('role plurals: the head noun takes the plural, whatever follows it', () => {
  const cases: Array<[string, string]> = [
    ['branch probability', 'branch probabilities'], ['velocity before', 'velocities before'], ['velocity after', 'velocities after'],
    ['name under a bracket', 'names under the brackets'], ['box', 'boxes'], ['energy over a peak', 'energies over the peaks'],
    ['value over a bar', 'values over the bars'], ['mass', 'masses'], ['radius', 'radii'], ['focal length f', 'focal lengths f'],
    ['object distance d_o', 'object distances d_o'], ['sign in the charge', 'signs in the charge'], ['legend entry', 'legend entries'],
    ['axis label', 'axis labels'], ['critical numbers', 'critical numbers'], ['bar names under the bars', 'bar names under the bars'],
    ['key', 'keys'], ['marks on the axis', 'marks on the axis'], ['angle label at the foot of the incline', 'angle labels at the foot of the incline'],
    ['speed', 'speeds'], ['current arrow at the battery', 'current arrows at the battery'], ['north arrow', 'north arrows'],
  ];
  for (const [one, many] of cases) {
    assert.equal(altRolePlural(one, 1), one);
    assert.equal(altRolePlural(one, 2), many, one);
  }
});

test('no alt of any fixture carries a broken plural', () => {
  for (const f of FIGURE_FIXTURES) {
    let alt: string;
    try { alt = describeForAlt(f.spec); } catch { continue; }
    assert.ok(!/[^aeiou]ys "|befores|afters|\ba \w+s "|boxs|[a-z](?:ss|us) "[^"]*", "/.test(alt), `${f.id}: ${alt}`);
  }
});

test('the reported cases read properly now', () => {
  const tree = describeForAlt(fx('tree-dense-three-stage'));
  assert.ok(/branch probabilities "/.test(tree), tree);
  const carts = describeForAlt(fx('mech-collision-dense-opposite'));
  assert.ok(!/befores|afters/.test(carts), carts);
});

test('the opener of a conic figure counts what is drawn: a curve, a curve and a straight line, two curves', () => {
  const circle = { type: 'circle', center: [-3, 2], radius: 2 };
  const base = { xRange: [-6, 4], yRange: [-2, 6], xStep: 1, yStep: 1 };
  assert.ok(describeForAlt(S('conic_graph', { ...base, conics: [circle] })).startsWith('A curve on a coordinate grid.'));
  assert.ok(describeForAlt(S('conic_graph', { ...base, conics: [circle], lines: [{ x: 3 }] })).startsWith('A curve and a straight line on a coordinate grid.'));
  assert.ok(describeForAlt(S('conic_graph', { ...base, conics: [circle], lines: [{ x: 3 }, { slope: 0, intercept: 5 }] })).startsWith('A curve and two straight lines on a coordinate grid.'));
  assert.ok(describeForAlt(S('conic_graph', { ...base, conics: [circle, { type: 'circle', center: [1, 2], radius: 1 }] })).startsWith('Two curves on a coordinate grid.'));
});

test('counts come from what is drawn: the pieces of one function are one curve; every mark of a conic is a marked point', () => {
  const piecewise = S('function_graph', { xRange: [-5, 6], yRange: [-3, 5], xStep: 1, yStep: 1, curves: [{ expr: 'x/2 + 2', domain: [-5, -2], to: 'open' }, { expr: 'x/2 + 2', domain: [-2, 2], from: 'open', to: 'closed' }, { expr: 'x - 3', domain: [2, 6], from: 'open' }], points: [{ x: -2, y: 3 }] });
  const alt = describeForAlt(piecewise);
  assert.ok(alt.startsWith('A graph of one function on a coordinate grid, drawn in three pieces, with one marked point.'), alt);
  const two = describeForAlt(S('function_graph', { xRange: [-4, 4], yRange: [-6, 6], xStep: 1, yStep: 1, curves: [{ expr: 'x/2+1', label: 'f' }, { expr: 'abs(x-2)', label: 'g' }] }));
  assert.ok(two.startsWith('A graph of curves on a coordinate grid, with two curves.'), two);
  const ellipse = describeForAlt(S('conic_graph', { xRange: [-7, 7], yRange: [-5, 5], xStep: 1, yStep: 1, conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { center: 'mark', foci: 'mark' } }] }));
  assert.ok(/with three marked points/.test(ellipse), ellipse);
  const withPoint = describeForAlt(S('conic_graph', { xRange: [-6, 6], yRange: [-3, 7], xStep: 1, yStep: 1, conics: [{ type: 'circle', center: [-1, 2], radius: 3 }], points: [{ x: 4, y: 4, label: 'P' }] }));
  assert.ok(/with one marked point\./.test(withPoint), withPoint);
});

test('a sequence strip: the alt gives the rows and the letters PRINTED in them — a hidden base stays a "?"', () => {
  const two = describeForAlt(S('sequence_strip', { rows: [{ seq: 'GATTCAGGCATCGA', name: 'upper' }, { seq: 'CTAAGTCCGTAGCT', name: 'lower' }], pairTicks: true }));
  assert.ok(two.startsWith('A nucleic-acid sequence written as rows of base letters, with two rows.'), two);
  assert.ok(two.includes('base letters "GATTCAGGCATCGA", "CTAAGTCCGTAGCT"'), two);
  const hidden = describeForAlt(S('sequence_strip', { rows: [{ seq: 'ATGGC?TGA', name: 'coding' }] }));
  assert.ok(hidden.includes('"ATGGC?TGA"') && /One place is left blank/.test(hidden), hidden);
  const key = describeForAlt(S('sequence_strip', { rows: [{ seq: 'ATGGCCTGA', name: 'coding' }] }), { hide: ['ATGGCCTGA'] });
  assert.ok(!key.includes('ATGGCCTGA'), key);
  const calls = describeForAlt(S('sequence_strip', { variant: 'chromatogram', seq: 'GATTACAG' }));
  assert.ok(calls.includes('"GATTACAG"'), calls);
  const read = describeForAlt(S('sequence_strip', { variant: 'chromatogram', seq: 'GATTACAG', calls: 'none' }));
  assert.ok(!/GATTACAG/.test(read), read);
  const part = describeForAlt(S('sequence_strip', { variant: 'chromatogram', seq: 'GATTACAG', blank: [3] }));
  assert.ok(!/GATTACAG/.test(part) && part.includes('"GA?TACAG"'), part);
});

test('a bar chart: the opener says what the bars measure; heights are never read off; printed values are named, a hidden one is not', () => {
  const plain = describeForAlt(S('bar_chart', { categories: ['10', '11'], values: [20, 80], xLabel: 'Mass number', yLabel: 'Relative abundance (%)', yMin: 0, yMax: 100, yStep: 20 }));
  assert.ok(plain.startsWith('A bar chart of "Relative abundance (%)", with two bars.'), plain);
  assert.ok(!/"20"|"80"/.test(plain), plain);
  const bare = describeForAlt(S('bar_chart', { categories: ['a', 'b', 'c'], values: [1, 2, 3] }));
  assert.ok(bare.startsWith('A bar chart, with three bars.'), bare);
});

test('the fix5-c / fix5-h fixtures carry exactly the alt the helper writes for them', () => {
  const mine = FIGURE_FIXTURES.filter((f) => /^fix5-[ch]-/.test(f.id));
  assert.ok(mine.length >= 4);
  for (const f of mine) assert.equal(f.alt, describeForAlt(f.spec), f.id);
});

console.log('\nh — figureLetterClash:\n');

test('options that are single base letters beside a sequence strip are flagged; other options and other figures are not', () => {
  const strip = S('sequence_strip', { rows: [{ seq: 'ATGGCCTGA', name: 'coding' }] });
  const clash = figureLetterClash(strip, ['A', 'C', 'G', 'T']);
  assert.ok(clash && /single base letters/.test(clash.message), JSON.stringify(clash));
  assert.deepEqual(clash?.letters, ['A', 'C']);
  assert.deepEqual(figureLetterClash(strip, ['G', 'U', 'T', 'adenine'])?.letters, []);
  assert.ok(figureLetterClash(S('sequence_strip', { variant: 'chromatogram', seq: 'GATTACAG', calls: 'none' }), ['T', 'G', 'C', 'A']));
  assert.equal(figureLetterClash(strip, ['adenine', 'cytosine', 'guanine', 'thymine']), null);
  assert.equal(figureLetterClash(strip, ['ATG', 'TGA', 'GCC', 'CCT']), null);
  assert.equal(figureLetterClash(strip, ['Met', 'Ala', 'Stop', 'Gly']), null);
  assert.equal(figureLetterClash(strip, []), null);
  // Another kind with options A–D that are not labels on it: nothing to flag.
  assert.equal(figureLetterClash(S('bar_chart', { categories: ['x', 'y'], values: [1, 2] }), ['A', 'C', 'G', 'T']), null);
});

void finish();
