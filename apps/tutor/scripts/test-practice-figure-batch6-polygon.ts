/**
 * Practice-figure renderer — batch 6, part "polygon" (coordinate_polygon):
 * what the grid draws, refuses and warns about.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch6-polygon.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { inspectPracticeFigure, renderPracticeFigure } from '../src/lib/tutor/practice-figure/render';
import { polygonModel } from '../src/lib/tutor/practice-figure/kinds/coordinate-polygon';
import { validateFigureSvg } from '../src/lib/tutor/practice-figure/svg-safety';
import { FIXTURES } from './lib/practice-figure-fixtures-b6-polygon';
import { count, has, makeRunner, minTypeAt340, outsideVocabulary, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const K = 'coordinate_polygon';
const P = (params: Params): string => svgOf(K, params);
const fx = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(id)).spec.params;
const base = (polygons: unknown[], more: Params = {}): Params => ({ xRange: [-6, 6], yRange: [-6, 6], polygons, ...more });
const TRI = { vertices: [[0, 0], [3, 0], [0, 2]], labels: ['P', 'Q', 'R'] };

console.log('\ncoordinate_polygon:\n');

test('every fixture: safe SVG, the pinned vocabulary, no type under 10 px at 340 px, clean legibility, deterministic', () => {
  for (const f of FIXTURES) {
    const svg = renderPracticeFigure(f.spec).svg;
    assert.equal(validateFigureSvg(svg).ok, true, `${f.id}: ${JSON.stringify(validateFigureSvg(svg))}`);
    assert.deepEqual(outsideVocabulary(svg), [], f.id);
    assert.ok(minTypeAt340(svg) >= 10, `${f.id}: ${minTypeAt340(svg)}`);
    assert.deepEqual(warn(f.spec.type, f.spec.params), [], `${f.id}: ${JSON.stringify(warn(f.spec.type, f.spec.params))}`);
    assert.equal(renderPracticeFigure(JSON.parse(JSON.stringify(f.spec))).svg, svg, f.id);
  }
});

test('each vertex label is printed once, in its own <text>; captions go in a legend with the stroke pattern', () => {
  const svg = P(fx('poly-dense-three-figures'));
  for (const l of ['P', 'Q', 'R', 'S', 'P′', 'Q′', 'R′', 'S′', 'P″', 'Q″', 'R″', 'S″', 'ℓ', 'Figure 1', 'Figure 2', 'Figure 3']) assert.equal(texts(svg).filter((t) => t === l).length, 1, l);
  // Three outlines, each with its own pattern (solid + two dashes), repeated in the legend swatches.
  const dashes = [...svg.matchAll(/<path d="M[^"]*z" fill="none" stroke="#[0-9a-f]{6}" stroke-width="2.2"(?: stroke-dasharray="([^"]+)")?/g)].map((m) => m[1] ?? '');
  assert.equal(dashes.length, 3);
  assert.equal(new Set(dashes).size, 3);
  // The tick numbers of a step-1 grid are there.
  assert.ok(has(svg, '−8') || has(svg, '−6'));
  assert.ok(has(svg, '4'));
});

test('a vertex is a dot in its polygon colour; marks are reported for every vertex and point', () => {
  const { facts } = inspectPracticeFigure({ type: K, params: fx('poly-dilation-half-shaded') });
  assert.equal(facts.marks.length, 7);
  assert.ok(facts.marks.some((m) => m.what === 'points[0] "M"'));
  assert.ok(facts.marks.some((m) => m.what === 'polygons[1].vertices[2] "U′"'));
  assert.equal(facts.curveCount, 2);
});

test('shading is a pale fill drawn UNDER the grid, so the squares can still be counted', () => {
  const svg = P(fx('poly-dilation-half-shaded'));
  const fill = svg.search(/<path d="M[^"]*z" fill="#[0-9a-f]{6}" stroke="none"/);
  const grid = svg.indexOf('stroke="#cbd5e1"');
  assert.ok(fill > 0 && grid > fill, `fill at ${fill}, grid at ${grid}`);
  assert.equal(count(P(base([TRI])), /stroke="none"/g), 0);
});

test('coordinates printed beside the labels as separate texts; lines and arrows drawn', () => {
  const svg = P(fx('poly-segment-coordinates'));
  for (const t of ['M', 'N', 'M′', 'N′', '(−3, −2)', '(3, 2)', '(2, −3)', '(−2, 3)']) assert.ok(has(svg, t), t);
  const refl = P(fx('poly-reflection-y-equals-x'));
  assert.ok(has(refl, 'y = x'));
  assert.ok(/stroke-dasharray="11 5"/.test(refl), 'the line is a guide line');
  const tr = P(fx('poly-simple-translation'));
  assert.ok(/<path d="M[^"]*z" fill="#111827"/.test(tr), 'an arrowhead');
});

test('model: a step of 1 by default up to a span of 24; given steps must agree; primes normalised', () => {
  const m = polygonModel(reader(K, base([{ vertices: [[0, 0], [2, 0], [0, 2]], labels: ["P'", "Q''", 'R'] }])));
  assert.equal(m.step, 1);
  assert.deepEqual(m.polygons[0].labels, ['P′', 'Q″', 'R']);
  assert.equal(polygonModel(reader(K, { xRange: [-20, 20], yRange: [-20, 20], polygons: [TRI] })).step, 5);
  assert.equal(polygonModel(reader(K, base([TRI], { xStep: 2 }))).step, 2);
});

test('refusals name the param', () => {
  throwsSpec(K, base([]), /polygons must have between 1 and 3 entries/);
  throwsSpec(K, base([TRI, TRI, TRI, TRI]), /polygons must have between 1 and 3/);
  throwsSpec(K, base([{ vertices: [[0, 0]] }]), /polygons\[0\]\.vertices must have between 2 and 8/);
  throwsSpec(K, base([{ vertices: [[0, 0], [9, 0], [0, 2]] }]), /polygons\[0\]\.vertices\[1\] \(9, 0\) is outside the grid/);
  throwsSpec(K, base([{ vertices: [[0, 0], [3, 0], [0, 2]], labels: ['P', 'Q'] }]), /polygons\[0\]\.labels must have one label per vertex \(3\)/);
  throwsSpec(K, base([{ vertices: [[0, 0], [3, 0], [0, 2]], labels: ['P', 'Q', 'TOOLONG'] }]), /polygons\[0\]\.labels\[2\] is longer than 3/);
  throwsSpec(K, base([TRI, { vertices: [[1, 1], [2, 1], [1, 3]], labels: ['P', 'X', 'Y'] }]), /the label "P" is used twice/);
  throwsSpec(K, base([{ vertices: [[0, 0], [2, 2], [2, 0], [0, 2]] }]), /polygons\[0\] crosses itself/);
  throwsSpec(K, base([{ vertices: [[0, 0], [1, 1], [2, 2]] }]), /polygons\[0\]: the vertices are all on one line/);
  throwsSpec(K, base([{ vertices: [[0, 0], [0, 0], [2, 2]] }]), /polygons\[0\]\.vertices\[1\] repeats/);
  throwsSpec(K, base([TRI], { xStep: 1, yStep: 2 }), /xStep and yStep must be equal/);
  throwsSpec(K, { xRange: [-10, 10], yRange: [-2, 2], polygons: [TRI] }, /yRange.*too flat/);
  throwsSpec(K, base([TRI], { lines: [{ kind: 'vertical', x: 9 }] }), /lines\[0\] does not cross the grid/);
  throwsSpec(K, base([TRI], { lines: [{ kind: 'slanted', x: 1 }] }), /lines\[0\]\.kind must be vertical, horizontal or through/);
  throwsSpec(K, base([TRI], { arrows: [{ from: [0, 0], to: [0, 0] }] }), /arrows\[0\]: from and to are the same point/);
  throwsSpec(K, base([{ vertices: [[0, 0], [3, 0], [0, 2]], style: 'dotted' }]), /polygons\[0\]\.style must be solid or dashed/);
});

test('legibility: an off-grid vertex warns off_grid (not when coordinates are printed); a vertex on the border warns', () => {
  assert.ok(warn(K, base([{ vertices: [[0, 0], [2.5, 0], [0, 2]] }])).includes('off_grid'));
  assert.ok(!warn(K, base([{ vertices: [[0, 0], [2.5, 0], [0, 2]] }], { showVertexCoordinates: true })).includes('off_grid'));
  assert.ok(warn(K, base([{ vertices: [[0, 0], [6, 0], [0, 2]] }])).includes('feature_on_border'));
});

test('labels stay clear of each other on a crowded figure (three triangles sharing a corner region)', () => {
  const crowd = base([
    { vertices: [[0, 0], [2, 0], [0, 2]], labels: ['P', 'Q', 'R'] },
    { vertices: [[0, 0], [-2, 0], [0, -2]], labels: ['P′', 'Q′', 'R′'], style: 'dashed' },
    { vertices: [[1, 1], [3, 1], [1, 3]], labels: ['P″', 'Q″', 'R″'], style: 'dashed' },
  ]);
  // P and P′ sit on one point: their labels must still not overlap.
  assert.ok(!warn(K, crowd).includes('labels_overlap'), JSON.stringify(warn(K, crowd)));
});

void finish();
