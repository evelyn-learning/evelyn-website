/**
 * Practice-figure renderer — batch 4, part "bars": bar_chart with `series`
 * (grouped bars: 2–3 series side by side in each category).
 *
 * Under test: a chart given by `values` is drawn as before; the series are
 * told apart without colour (solid / hatched / outline) and named in a
 * legend; a `null` value is a "?" box and a zero has no bar; `showValues`
 * stays opt-in; the refusals; the kind's own legibility notes; and the
 * shared invariants of every fixture (scripts/lib/practice-figure-test-kit.ts).
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-bars.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-bars';
import { count, fixtureInvariants, has, makeRunner, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();

console.log('\nEvery grouped-bar fixture:\n');
const rendered = fixtureInvariants(test, FIXTURES, { 'bar_chart (grouped)': 'bars-grouped-' });

console.log('\nbar_chart with series:\n');

const base: Params = { categories: ['P', 'Q', 'R'], series: [{ label: 'Before', values: [10, 20, 30] }, { label: 'After', values: [30, 20, 10] }], yMin: 0, yMax: 40, yStep: 10 };
const SOLID = /<rect [^>]*fill="#1d4ed8"\/>/g;
const HATCHED_BOX = /<rect [^>]*fill="#ffffff" stroke="#c2410c" stroke-width="1\.3"\/>/g;
const HATCH = /<path d="[^"]*" fill="none" stroke="#c2410c" stroke-width="1\.1"\/>/g;
const OUTLINE = /<rect [^>]*fill="#ffffff" stroke="#0f766e" stroke-width="2"\/>/g;

test('a chart given by `values` does not take the grouped path: no legend, no hatch, one solid bar per category', () => {
  const plain = svgOf('bar_chart', { categories: ['P', 'Q', 'R'], values: [10, 20, 30], yMin: 0, yMax: 40, yStep: 10 });
  assert.equal(count(plain, SOLID), 3);
  assert.equal(count(plain, HATCHED_BOX) + count(plain, HATCH), 0);
  assert.equal(svgOf('bar_chart', { categories: ['P', 'Q', 'R'], values: [10, 20, 30], yMin: 0, yMax: 40, yStep: 10, series: null }), plain, '`series: null` is "not given"');
});

test('each series has a texture of its own — solid, hatched inside an outline, outline only — repeated in its legend swatch', () => {
  const two = svgOf('bar_chart', base);
  assert.equal(count(two, SOLID), 3 + 1, 'three bars and the swatch');
  assert.equal(count(two, HATCHED_BOX), 3 + 1);
  assert.equal(count(two, HATCH), 3 + 1, 'every hatched bar and the swatch carry hatch lines');
  assert.equal(count(two, OUTLINE), 0);
  assert.deepEqual(texts(two).filter((t) => !/^[\d−.]+$/.test(t)), ['P', 'Q', 'R', 'Before', 'After']);
  const three = svgOf('bar_chart', { ...base, series: [...(base.series as unknown[]), { label: 'Later', values: [5, 15, 25] }] });
  assert.equal(count(three, OUTLINE), 3 + 1);
  assert.ok(has(three, 'Later'));
  // No clip path, no id: the hatch lines are cut to the bar by hand.
  assert.ok(!/clipPath|clip-path| id="/.test(two));
});

test('hatch lines stay inside their bar', () => {
  const svg = svgOf('bar_chart', base);
  const boxes = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="#ffffff" stroke="#c2410c"/g)].map((m) => m.slice(1).map(Number));
  const hatches = [...svg.matchAll(HATCH)].map((m) => [...m[0].matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((q) => [Number(q[1]), Number(q[2])]));
  assert.equal(boxes.length, hatches.length);
  hatches.forEach((pts, i) => {
    const [x, y, w, h] = boxes[i];
    assert.ok(pts.length >= 2, 'a hatched bar has lines');
    for (const [px, py] of pts) assert.ok(px >= x - 0.8 && px <= x + w + 0.8 && py >= y - 0.8 && py <= y + h + 0.8, `(${px}, ${py}) outside bar ${i}`);
  });
});

test('bars are to scale: equal values of two series reach the same height; a negative value hangs below the baseline', () => {
  const svg = svgOf('bar_chart', { ...base, series: [{ label: 'Before', values: [20, -10, 30] }, { label: 'After', values: [20, 20, 10] }], yMin: -20 });
  const solid = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="#1d4ed8"\/>/g)].map((m) => m.slice(1).map(Number));
  const hatched = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="#ffffff" stroke="#c2410c"/g)].map((m) => m.slice(1).map(Number));
  // Category P: 20 and 20 — tops level (the outline is drawn inside the bar's box: 0.65 lower, same box top).
  assert.ok(Math.abs(solid[0][1] - (hatched[0][1] - 0.65)) < 0.02, `${solid[0][1]} vs ${hatched[0][1]}`);
  const baseline = Number(/<line x1="[\d.]+" y1="([\d.]+)"[^>]*stroke-width="1\.4"\/>/.exec(svg)?.[1]);
  assert.ok(Math.abs(solid[0][1] + solid[0][3] - baseline) < 0.02, 'a positive bar stands on the baseline');
  assert.ok(Math.abs(solid[1][1] - baseline) < 0.02, 'a negative bar hangs from it');
  assert.ok(Math.abs(solid[1][3] * 2 - solid[0][3]) < 0.05, '−10 is half as long as 20');
});

test('a null value is a bar left out — a dashed "?" box in its slot; a zero has no bar and no box', () => {
  const blank = rendered.get('bars-grouped-blank-allele-frequency') as string;
  assert.equal(texts(blank).filter((t) => t === '?').length, 1);
  assert.equal(count(blank, /stroke-dasharray="3 2"/g), 1);
  assert.equal(count(blank, HATCHED_BOX), 1 + 1, 'one hatched bar drawn (and the swatch) — the other is the blank');
  const zero = svgOf('bar_chart', { ...base, series: [{ label: 'Before', values: [0, 20, 30] }, { label: 'After', values: [30, 0, 10] }] });
  assert.equal(count(zero, SOLID), 2 + 1);
  assert.equal(count(zero, HATCHED_BOX), 2 + 1);
  assert.ok(!has(zero, '?'));
});

test('values are printed over the bars only when asked', () => {
  assert.ok(!texts(svgOf('bar_chart', base)).includes('30') || texts(svgOf('bar_chart', base)).filter((t) => t === '30').length === 1, 'only the axis number');
  const shown = svgOf('bar_chart', { ...base, showValues: true });
  assert.equal(texts(shown).filter((t) => t === '30').length, 1 + 2, 'the axis number and two bars');
  const fx = rendered.get('bars-grouped-values-printed') as string;
  for (const v of ['24', '7', '95']) assert.ok(has(fx, v), v);
  for (const f of FIXTURES.filter((q) => q.id !== 'bars-grouped-values-printed')) assert.ok(!(f.spec.params as Params).showValues, f.id);
});

test('refusals name the param', () => {
  throwsSpec('bar_chart', { ...base, values: [1, 2, 3] }, /either values .* or series .*, not both/);
  throwsSpec('bar_chart', { ...base, series: [{ label: 'Only', values: [1, 2, 3] }] }, /series must have between 2 and 3 entries/);
  throwsSpec('bar_chart', { ...base, series: [{ label: 'A', values: [1, 2] }, { label: 'B', values: [1, 2, 3] }] }, /series\[0\]\.values must have between 3 and 3 entries/);
  throwsSpec('bar_chart', { ...base, series: [{ label: 'A', values: [1, 2, 'x'] }, { label: 'B', values: [1, 2, 3] }] }, /series\[0\]\.values\[2\] must be a finite number/);
  throwsSpec('bar_chart', { ...base, series: [{ label: 'A', values: [1, 2, 3] }, { label: 'A', values: [1, 2, 3] }] }, /every series needs its own label/);
  throwsSpec('bar_chart', { ...base, series: [{ values: [1, 2, 3] }, { label: 'B', values: [1, 2, 3] }] }, /series\[0\]\.label must be a non-empty string/);
  throwsSpec('bar_chart', { ...base, series: [{ label: 'A', values: [null, null, null] }, { label: 'B', values: [null, null, null] }] }, /every value is left out/);
  throwsSpec('bar_chart', { ...base, yMax: 25 }, /a value lies outside yMin\.\.yMax/);
  const cats = ['a', 'b', 'c', 'd', 'e', 'f'];
  throwsSpec('bar_chart', { categories: cats, series: ['X', 'Y', 'Z'].map((label) => ({ label, values: cats.map(() => 1) })) }, /6 categories × 3 series is 18 bars — at most 16/);
});

test('legibility: thin bars and printed values wider than their bars are reported; the axis is chosen round when left out', () => {
  const cats = ['a', 'b', 'c', 'd', 'e'];
  const many = { categories: cats, series: ['X', 'Y', 'Z'].map((label, k) => ({ label, values: cats.map((_c, i) => 1000 + 100 * i + k) })) };
  assert.deepEqual(warn('bar_chart', many), []);
  assert.ok(warn('bar_chart', { ...many, showValues: true }).includes('crowded'));
  const eight = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  assert.deepEqual(warn('bar_chart', { categories: eight, series: ['X', 'Y'].map((label) => ({ label, values: eight.map((_c, i) => i + 1) })) }), []);
  const auto = svgOf('bar_chart', { categories: ['P', 'Q'], series: [{ label: 'A', values: [12, 47] }, { label: 'B', values: [30, 8] }] });
  assert.ok(has(auto, '0') && has(auto, '50'), texts(auto).join(' '));
});

void finish();
