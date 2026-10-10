/**
 * Practice-figure renderer — batch 5, part "table" (data_table): what the
 * table draws, hides, refuses and warns about.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-table.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { TABLE_MAX_WIDTH, cellNumber, tableLayout, tableModel } from '../src/lib/tutor/practice-figure/kinds/data-table';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-table';
import { count, has, makeRunner, minTypeAt340, outsideVocabulary, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const T = (params: Params): string => svgOf('data_table', params);
const fx = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(id)).spec.params;
const TWO_WAY = fx('table-simple-two-way');
const DENSE = fx('table-dense-kinetics-six-by-eight');

console.log('\ndata_table:\n');

test('every header and every cell is printed once, in reading order; numbers get a real minus sign; a unit follows its header', () => {
  const t = texts(T(TWO_WAY));
  assert.deepEqual(t, ['Travel to school', 'Walk', 'Bus', 'Total', 'Grade 9', '30', '45', '75', 'Grade 10', '20', '55', '75', 'Total', '50', '100', '150']);
  const d = T(DENSE);
  assert.ok(has(d, '−7.013') && has(d, '0.0100') && has(d, 'Decomposition of N₂O₅ at 45 °C'));
  // A header that wraps puts its unit on a line of its own.
  assert.ok(has(d, 'Time') && has(d, '(min)') && has(d, '[N₂O₅]') && has(d, '(mol/L)') && has(d, '(L/mol)'));
  assert.ok(has(T({ columns: ['x', 'y'], rows: [[-3, 2.5], ['-1', '0.50']] }), '−3') && has(T({ columns: ['x', 'y'], rows: [[-3, 2.5], ['-1', '0.50']] }), '−1') && has(T({ columns: ['x', 'y'], rows: [[-3, 2.5], ['-1', '0.50']] }), '0.50'));
});

test('a "?" cell is the dashed blank box and nothing else is printed there; null and "" leave the cell empty', () => {
  const svg = T(fx('table-blank-two-way-missing-cell'));
  assert.equal(texts(svg).filter((t) => t === '?').length, 1);
  assert.equal(count(svg, /stroke-dasharray="3 2"/g), 1);
  const two = T(fx('table-values-blank-function'));
  assert.equal(texts(two).filter((t) => t === '?').length, 2);
  assert.ok(!has(two, '14') && !has(two, '48'), 'the hidden values are nowhere in the picture');
  const empty = T({ columns: ['x', 'y'], rows: [[1, null], [2, ''], [3, 9]] });
  assert.deepEqual(texts(empty), ['x', 'y', '1', '2', '3', '9']);
  assert.equal(count(empty, /stroke-dasharray/g), 0);
});

test('emphasis without colour: headers, row names and totals are bold; heavy rules under the header, after the row names and before the totals', () => {
  const svg = T(TWO_WAY);
  const bold = [...svg.matchAll(/<text\b[^>]*font-weight="700"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  assert.deepEqual(bold, ['Travel to school', 'Walk', 'Bus', 'Total', 'Grade 9', '75', 'Grade 10', '75', 'Total', '50', '100', '150']);
  const heavy = /<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1.6"\/>/.exec(svg);
  assert.ok(heavy, 'a heavy-rule path');
  assert.equal((heavy[1].match(/M/g) ?? []).length, 4, 'header rule, row-name rule, totals-column rule, totals-row rule');
  const plain = T({ columns: ['x', 'y'], rows: [[1, 2], [3, 4]] });
  assert.equal((/<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1.6"\/>/.exec(plain)?.[1].match(/M/g) ?? []).length, 1, 'only the header rule');
  // Every fill and stroke is ink, grey or the header tint — no hue carries meaning.
  for (const m of svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/g)) assert.ok(['#111827', '#4b5563', '#94a3b8', '#f1f5f9', '#ffffff'].includes(m[1]), m[1]);
});

test('alignment: a numeric column is right-aligned on one edge, a text column centred, row names set left; `align` overrides', () => {
  const svg = T(fx('table-long-headers-wrapped'));
  const el = (s: string): string => new RegExp(`<text\\b[^>]*>${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</text>`).exec(svg)?.[0] ?? assert.fail(s);
  const xOf = (s: string): string => /\sx="([\d.]+)"/.exec(el(s))?.[1] ?? '';
  assert.ok(el('−393.5').includes('text-anchor="end"') && el('33.2').includes('text-anchor="end"'));
  assert.equal(xOf('−393.5'), xOf('33.2'));
  assert.ok(el('liquid').includes('text-anchor="middle"') && el('CO₂').includes('text-anchor="start"'));
  const m = tableModel(reader('data_table', { columns: ['Name', { header: 'n', align: 'center' }], rows: [['a', 1], ['b', 22]] }));
  assert.deepEqual(m.columns.map((c) => [c.align, c.numeric]), [['center', false], ['center', true]]);
  throwsSpec('data_table', { columns: ['a', { header: 'b', align: 'middle' }], rows: [[1, 2]] }, /columns\[1\]\.align must be left, center or right/);
});

test('size: 12-unit type when it fits, 11 (10.4 px at 340 px) when it only fits so, never smaller; never wider than the card', () => {
  for (const f of FIXTURES) {
    const svg = svgOf(f.spec.type, f.spec.params);
    assert.ok(minTypeAt340(svg) >= 10, `${f.id}: ${minTypeAt340(svg)}`);
    assert.deepEqual(outsideVocabulary(svg), [], f.id);
    const r = reader('data_table', f.spec.params);
    const L = tableLayout(tableModel(r), r);
    const w = L.widths.reduce((a, b) => a + b, 0);
    assert.ok(w <= TABLE_MAX_WIDTH + 0.1, `${f.id}: ${w}`);
    const frame = /<rect x="([\d.]+)" y="[\d.]+" width="([\d.]+)" height="[\d.]+" fill="none" stroke="#111827"/.exec(svg);
    assert.ok(frame && Number(frame[1]) >= 7.9 && Number(frame[1]) + Number(frame[2]) <= 352.1, `${f.id}: the frame is inside the card`);
  }
  const small = reader('data_table', TWO_WAY);
  assert.equal(tableLayout(tableModel(small), small).fs, 12);
  const dense = reader('data_table', DENSE);
  const L = tableLayout(tableModel(dense), dense);
  assert.equal(L.fs, 11);
  // Sibling headers are wrapped by one rule: every header of the dense table is on two lines.
  assert.deepEqual(L.headerLines.map((l) => l.length), [2, 2, 2, 2, 2, 2]);
});

test('refusals name the param: too wide for the card, too many columns or rows, ragged rows, duplicate headers, nothing to read', () => {
  const wide = { columns: ['Name of the substance', 'Molar mass (g/mol)', 'Melting point (°C)', 'Boiling point (°C)', 'Density (g/cm³)', 'Solubility (g/100 g)'], rows: [['Sodium chloride', 58.44, 801, 1413, 2.165, 35.9]] };
  throwsSpec('data_table', wide, /the table is \d+ units too wide for a 340 px card at 10 px type \(6 columns\) — shorten the headers or the cell texts, or use fewer columns/);
  throwsSpec('data_table', { columns: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], rows: [[1, 2, 3, 4, 5, 6, 7]] }, /columns must have between 2 and 6 entries \(has 7\)/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: Array.from({ length: 9 }, (_, i) => [i, i]) }, /rows must have between 1 and 8 entries \(has 9\)/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: [[1, 2], [3]] }, /rows\[1\] must have one cell per column \(2\)/);
  throwsSpec('data_table', { columns: ['a', 'a'], rows: [[1, 2]] }, /two columns have the same header/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: [['?', null]] }, /every cell is empty or left out/);
  throwsSpec('data_table', { columns: ['a', '?'], rows: [[1, 2]] }, /columns\[1\]: a header cannot be left out/);
  throwsSpec('data_table', { columns: ['', 'b'], rows: [[1, 2]] }, /columns\[0\] must be a non-empty string/);
  throwsSpec('data_table', { columns: ['', 'b'], rows: [['?', 2]], rowHeaders: true }, /rows\[0\]\[0\]: with rowHeaders the first cell of a row is its name/);
  throwsSpec('data_table', { columns: ['', 'b'], rows: [['x', 2], ['x', 3]], rowHeaders: true }, /two rows have the same name/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: [[1, 2]], totalsRow: true }, /totalsRow needs at least one row above the totals/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: [[1, { v: 2 }]] }, /rows\[0\]\[1\] must be a non-empty string/);
  throwsSpec('data_table', { columns: ['a', 'b'], rows: [[1, Infinity]] }, /rows\[0\]\[1\] must be a finite number/);
});

test('legibility: clean for the fixtures; warns for a header on three lines and for a table that is mostly blanks', () => {
  for (const f of FIXTURES) assert.deepEqual(warn(f.spec.type, f.spec.params), [], f.id);
  const three = { columns: ['Substance', 'State', 'Standard molar enthalpy of formation', 'Entropy', 'Gibbs energy'], rows: [['CO₂', 'gas', -393.5, 213.7, -394.4]] };
  assert.ok(warn('data_table', three).includes('crowded'), JSON.stringify(warn('data_table', three)));
  assert.ok(warn('data_table', { columns: ['x', 'y'], rows: [[1, '?'], [2, '?'], [3, '?'], [4, '?'], [5, '?'], [6, 1]] }).includes('ambiguous_blank'));
});

test('cellNumber: plain, signed, thousands, e-notation and "a × 10ⁿ"; a percentage or a text is not a number', () => {
  assert.equal(cellNumber('12'), 12);
  assert.equal(cellNumber('−0.50'), -0.5);
  assert.equal(cellNumber('1,200'), 1200);
  assert.equal(cellNumber('3.1e-4'), 3.1e-4);
  assert.equal(cellNumber('2.5 × 10⁻⁵'), 2.5e-5);
  assert.equal(cellNumber('1.0 x 10^3'), 1000);
  assert.equal(cellNumber('25%'), undefined);
  assert.equal(cellNumber('gas'), undefined);
  assert.equal(cellNumber('1/2'), undefined);
});

test('deterministic, and the title wraps above the table', () => {
  assert.equal(T(DENSE), T(JSON.parse(JSON.stringify(DENSE)) as Params));
  const long = T({ title: 'Number of students in each grade who chose each way of travelling to school on the day of the survey', columns: ['a', 'b'], rows: [[1, 2]] });
  assert.ok(count(long, /font-weight="600"/g) >= 2, 'the title is set on two lines');
});

void finish();
