/**
 * Practice-figure renderer — batch 6, part "stemplot": what a stem-and-leaf
 * plot draws, refuses and warns about.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch6-stemplot.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { stemplotModel, stemValue } from '../src/lib/tutor/practice-figure/kinds/stemplot';
import { FIXTURES } from './lib/practice-figure-fixtures-b6-stemplot';
import { count, fixtureInvariants, has, makeRunner, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const T = (params: Params): string => svgOf('stemplot', params);
const fx = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(id)).spec.params;
const SCORES = fx('stem-simple-test-scores');
const CLASSES = fx('stem-back-to-back-classes');

console.log('\nstemplot:\n');

fixtureInvariants(test, FIXTURES, { stemplot: 'stem-' });

/** The x of every <text> whose content is `s`, in document order. */
const xsOf = (svg: string, s: string): number[] => [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].filter((m) => m[3] === s).map((m) => Number(m[1]));
/** Every <text>: [x, y, content]. */
const all = (svg: string): Array<[number, number, string]> => [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => [Number(m[1]), Number(m[2]), m[3]]);

test('every stem and every leaf is printed once, as its own text; the key and the headings are printed', () => {
  const svg = T(SCORES);
  const t = texts(svg);
  assert.ok(has(svg, 'Key: 6 | 2 = 62 points') && has(svg, 'Unit test scores') && has(svg, 'Stem') && has(svg, 'Leaf'));
  for (const s of ['6', '7', '8', '9']) assert.ok(t.includes(s), s);
  // 4 stems + 14 leaves are single digits.
  assert.equal(t.filter((x) => /^\d$/.test(x)).length, 18);
});

test('leaves are evenly spaced on a row and line up in columns across rows; a vertical rule divides stems from leaves', () => {
  const svg = T(SCORES);
  const row = all(svg).filter(([, , s]) => /^\d$/.test(s));
  const byY = new Map<number, number[]>();
  for (const [x, y] of row) byY.set(y, [...(byY.get(y) ?? []), x]);
  const rows = [...byY.values()].map((xs) => xs.slice(1)); // drop the stem
  const gaps = rows.flatMap((xs) => xs.slice(1).map((x, i) => Number((x - xs[i]).toFixed(2))));
  assert.equal(new Set(gaps).size, 1, `one spacing: ${gaps}`);
  const firsts = new Set(rows.map((xs) => xs[0]));
  assert.equal(firsts.size, 1, 'the first leaf of every row sits in one column');
  assert.ok(/<path d="M[\d.]+,[\d.]+V[\d.]+" fill="none" stroke="#111827" stroke-width="1.4"\/>/.test(svg), 'the vertical rule');
});

test('back-to-back: left leaves read outward from the stem (increasing to the left), right leaves outward to the right; group names head their sides', () => {
  const svg = T(CLASSES);
  assert.ok(has(svg, 'Class A') && has(svg, 'Class B'));
  // Stem 6, Class A leaves 2 5 7: drawn 7 5 2 | 6 — the 2 nearest the stem.
  const [stem6] = xsOf(svg, '6').length ? [all(svg).find(([, , s]) => s === '6') as [number, number, string]] : [];
  const y6 = stem6[1];
  const leftRow = all(svg).filter(([x, y, s]) => y === y6 && x < stem6[0] && /^\d$/.test(s)).sort((a, b) => a[0] - b[0]).map(([, , s]) => s);
  assert.deepEqual(leftRow, ['7', '5', '2']);
  const rightRow = all(svg).filter(([x, y, s]) => y === y6 && x > stem6[0] && /^\d$/.test(s)).sort((a, b) => a[0] - b[0]).map(([, , s]) => s);
  assert.deepEqual(rightRow, ['4', '9']);
  assert.equal(count(svg, /stroke-width="1\.4"/g), 1, 'one path holds both rules');
  assert.equal((/<path d="([^"]+)" fill="none" stroke="#111827" stroke-width="1\.4"\/>/.exec(svg)?.[1].match(/M/g) ?? []).length, 2);
  assert.ok(has(svg, 'Key: 1 | 7 | 4 means 71 points for Class A and') || texts(svg).join(' ').includes('Key: 1 | 7 | 4 means 71 points for Class A and 74 points for Class B'));
});

test('everything sits inside the 360-wide card', () => {
  for (const f of FIXTURES) {
    const svg = svgOf(f.spec.type, f.spec.params);
    for (const [x, , s] of all(svg)) {
      assert.ok(x >= 4 && x <= 356, `${f.id}: "${s}" at x=${x}`);
    }
    const H = Number(/viewBox="0 0 360 ([\d.]+)"/.exec(svg)?.[1]);
    for (const [, y, s] of all(svg)) assert.ok(y > 0 && y < H, `${f.id}: "${s}" at y=${y} (H ${H})`);
  }
});

test('a "?" leaf is the dashed blank box; nothing else is printed there', () => {
  const svg = T(fx('stem-blank-missing-leaf'));
  assert.equal(count(svg, /stroke-dasharray="3 2"/g), 1);
  assert.equal(texts(svg).filter((t) => t === '?').length, 1);
});

test('the model: values from stem × 10 + leaf in leaf units; split stems name their halves; empty stems are rows', () => {
  const m = stemplotModel(reader('stemplot', fx('stem-split-decimal-battery')));
  assert.equal(m.rows.length, 6);
  assert.deepEqual(m.rows.map((r) => r.half), ['low', 'high', 'low', 'high', 'low', 'high']);
  assert.equal(stemValue(m, 4, 3), 4.3);
  assert.equal(stemValue(stemplotModel(reader('stemplot', SCORES)), 6, 2), 62);
  const lone = stemplotModel(reader('stemplot', { key: { stem: 3, leaf: 7 }, split: true, stems: [3, 4], leaves: [[7, 8], [1]] }));
  assert.deepEqual(lone.rows.map((r) => r.half), ['high', 'low']);
  assert.equal(stemValue(stemplotModel(reader('stemplot', { key: { stem: 3, leaf: 7 }, leafUnit: 10, stems: [3], leaves: [[7]] })), 3, 7), 370);
});

test('refusals name the param', () => {
  const base = { key: { stem: 1, leaf: 0 }, stems: [1, 2], leaves: [[1, 2], [3]] };
  throwsSpec('stemplot', { ...base, key: undefined }, /key is required/);
  throwsSpec('stemplot', { ...base, key: { stem: 1, leaf: 12 } }, /key\.leaf must be a whole number from 0 to 9/);
  throwsSpec('stemplot', { ...base, leaves: [[1, 12], [3]] }, /leaves\[0\]\[1\] must be a whole number from 0 to 9/);
  throwsSpec('stemplot', { ...base, leaves: [[2, 1], [3]] }, /leaves\[0\] must be in increasing order/);
  assert.ok(svgOf('stemplot', { ...base, leaves: [[2, 1], [3]], ordered: false }).includes('<text'));
  throwsSpec('stemplot', { ...base, stems: [1, 3] }, /stems must be consecutive/);
  throwsSpec('stemplot', { ...base, stems: [1, 2, 3] }, /leaves must have one array per stem row \(3\)/);
  throwsSpec('stemplot', { ...base, stems: [-1, 0] }, /stems\[0\] must be a whole number ≥ 0/);
  throwsSpec('stemplot', { ...base, leafUnit: 0.5 }, /leafUnit must be a power of ten/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, stems: Array.from({ length: 15 }, (_, i) => i), leaves: Array.from({ length: 15 }, () => [1]) }, /stems must have between 1 and 14 entries/);
  throwsSpec('stemplot', { ...base, leaves: [[], [3]] }, /the first stem row has no leaves/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, split: true, stems: [1, 1], leaves: [[1, 7], [8]] }, /leaves\[0\]\[1\]: a split stem's first row holds leaves 0–4/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, split: true, stems: [1, 2, 2, 2], leaves: [[7], [1], [6], [1]] }, /split stems must run/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, stems: [1], leaves: [Array.from({ length: 40 }, () => 1)] }, /too many leaves on one row for a 340 px card/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, stems: [1], leaves: [[1]], left: { label: 'A', leaves: [[1]] }, right: { label: 'B', leaves: [[2]] } }, /either `leaves` \(one set\) or `left` and `right`/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, stems: [1], left: { leaves: [[1]] }, right: { label: 'B', leaves: [[2]] } }, /left\.label must be a non-empty string/);
  throwsSpec('stemplot', { key: { stem: 1, leaf: 0 }, stems: [1], left: { label: 'Same', leaves: [[1]] }, right: { label: 'Same', leaves: [[2]] } }, /two sides have the same label/);
  throwsSpec('stemplot', { ...base, leaves: [['?', '?'], [3]] }, /at most one leaf may be left out/);
});

test('legibility: fixtures clean unless they warn; a row of more than 25 leaves is "crowded"', () => {
  for (const f of FIXTURES) if (!/warns/.test(f.note)) assert.deepEqual(warn(f.spec.type, f.spec.params), [], f.id);
  assert.ok(warn('stemplot', fx('stem-dense-reaction-times')).includes('crowded'));
});

test('deterministic, and a long title and key wrap', () => {
  assert.equal(T(CLASSES), T(JSON.parse(JSON.stringify(CLASSES)) as Params));
  const long = T({ ...SCORES, title: 'Scores of every student in the three sections of the unit test given in the autumn term' });
  assert.ok(count(long, /font-weight="600"/g) >= 2, 'the title is set on two lines');
});

void finish();
