/**
 * Practice-figure renderer — batch 5, part "fixes-bio" (2026-10-16):
 *   (e) bio_schematic compartments — a pH printed with a named intermembrane
 *       space stays inside that space (it was drawn across the inner membrane);
 *   (i) molecular_structure — Roman-numeral captions stand on label plates,
 *       as the cell labels of a division figure do.
 * Both leave every figure without the defect byte for byte as it was (the
 * pins of test-practice-figure-batch5.ts say so for the fixtures).
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-fixes-bio.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-fixes-bio';
import { count, fixtureInvariants, makeRunner, svgOf, texts, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
console.log('\nEvery fixture of the part:\n');
const rendered = fixtureInvariants(test, FIXTURES, {}, ['e', 'i'], 'fix5');
const P = (id: string): Params => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;
const PLATE = /<rect [^>]*rx="4" fill="#f1f5f9"/g;
/** x, y and content of each <text>. */
const placed = (svg: string): Array<{ x: number; y: number; s: string }> => [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]), s: m[3] }));
/** The two nested boxes of a compartments figure: [outer, inner] as { y0, y1 }. */
const boxes = (svg: string): Array<{ x0: number; y0: number; x1: number; y1: number }> => [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" rx="[\d.]+" fill="#[0-9a-f]{6}" stroke="#111827" stroke-width="2"\/>/g)]
  .map((m) => ({ x0: Number(m[1]), y0: Number(m[2]), x1: Number(m[1]) + Number(m[3]), y1: Number(m[2]) + Number(m[4]) }));

console.log('\n(e) compartments — labels inside their compartment:\n');

test('e: the pH of a named intermembrane space is printed inside the space — above the inner membrane, not across it', () => {
  for (const id of ['fix5-e-compartments-mito-label-and-ph', 'fix5-e-compartments-mito-letter-and-ph']) {
    const svg = rendered.get(id) as string;
    const [outer, inner] = boxes(svg);
    assert.ok(outer && inner, `${id}: two boxes`);
    const sp = (P(id).spaces as Array<{ pH: number }>)[0];
    const ph = placed(svg).find((t) => t.s === `pH ${String(sp.pH)}`) ?? assert.fail(`${id}: the pH of the outer space is printed`);
    // 12 px type: the ink reaches about 3 units under the baseline; the membrane is a 2-unit line.
    assert.ok(ph.y + 3 < inner.y0 - 1 && ph.y - 10 > outer.y0 + 1, `${id}: baseline ${ph.y} between the outer wall (${outer.y0}) and the inner membrane (${inner.y0})`);
    // … and to the right of the name, on its line.
    const name = placed(svg).find((t) => t.y === ph.y && t.s !== ph.s) ?? assert.fail(`${id}: the name is on the same line`);
    assert.ok(ph.x > name.x + 10 && ph.x < outer.x1 - 40);
    // The matrix keeps its two lines, inside the inner box.
    const mph = placed(svg).find((t) => /^pH /.test(t.s) && t.s !== ph.s) as { x: number; y: number };
    assert.ok(mph.y > inner.y0 + 20 && mph.y < inner.y1 - 8);
  }
  assert.deepEqual(texts(rendered.get('fix5-e-compartments-mito-label-and-ph') as string).slice(0, 4), ['intermembrane space', 'pH 6.8', 'matrix', 'pH 7.8']);
});

test('e: a "?" name with a pH keeps both inside the space; a pH with NO name (label: null) is on the first line as before', () => {
  const svg = svgOf('bio_schematic', { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: '?', pH: 5 }, { id: 'matrix', pH: 8 }] });
  const [, inner] = boxes(svg);
  const ph = placed(svg).find((t) => t.s === 'pH 5') as { x: number; y: number };
  assert.ok(ph.y + 3 < inner.y0 - 1);
  assert.equal(count(svg, /stroke-dasharray="3 2"\/>/g), 1);
  const bare = svgOf('bio_schematic', { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: null, pH: 5 }, { id: 'matrix', label: null, pH: 8 }] });
  const [, inner2] = boxes(bare);
  assert.ok((placed(bare).find((t) => t.s === 'pH 5') as { y: number }).y + 3 < inner2.y0 - 1);
});

test('e: the chloroplast (a tall stroma) keeps its two-line labels', () => {
  const svg = svgOf('bio_schematic', { variant: 'compartments', organelle: 'chloroplast', spaces: [{ id: 'stroma', label: 'X', pH: 8 }, { id: 'thylakoid_lumen', label: 'Y', pH: 5 }], synthase: true, showFlow: true });
  const t = placed(svg);
  const x = t.find((q) => q.s === 'X') as { x: number; y: number };
  const ph = t.find((q) => q.s === 'pH 8') as { x: number; y: number };
  assert.ok(ph.y === x.y + 15 && ph.x === x.x);
});

console.log('\n(i) molecule captions — Roman numerals on label plates:\n');

test('i: captions I, II, III each stand on a plate, bold, 13-unit type', () => {
  const svg = rendered.get('fix5-i-molecule-roman-captions') as string;
  assert.equal(count(svg, PLATE), 3);
  for (const s of ['I', 'II', 'III']) assert.ok(new RegExp(`<text [^>]*font-size="13" font-weight="700"[^>]*>${s}</text>`).test(svg), s);
  // Each plate is wide enough for its numeral and is under the molecule, inside the picture.
  const H = Number(/viewBox="0 0 360 (\d+)"/.exec(svg)?.[1]);
  for (const m of svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="19" rx="4" fill="#f1f5f9"/g)) {
    assert.ok(Number(m[3]) >= 24 && Number(m[1]) > 0 && Number(m[1]) + Number(m[3]) < 360 && Number(m[2]) + 19 <= H - 2);
  }
});

test('i: letter captions, mixed captions and a "?" caption are drawn as before — no plate', () => {
  const mol = (label: string): Params => ({ atoms: [{ id: 'O1', el: 'O', lonePairs: 2 }, { id: 'C', el: 'C' }, { id: 'O2', el: 'O', lonePairs: 2 }], bonds: [{ a: 'C', b: 'O1', order: 2 }, { a: 'C', b: 'O2', order: 2 }], layout: { type: 'linear', center: 'C', around: ['O1', 'O2'] }, center: 'C', label });
  for (const labels of [['A', 'B'], ['X', 'Y'], ['I', 'B'], ['?'], ['1', '2']]) {
    const svg = svgOf('molecular_structure', { molecules: labels.map(mol) });
    assert.equal(count(svg, PLATE), 0, labels.join(','));
  }
  // A blank among Roman captions: the numerals are plated, the blank is the dashed box.
  const svg = svgOf('molecular_structure', { molecules: [mol('I'), mol('?')] });
  assert.equal(count(svg, PLATE), 1);
  assert.equal(count(svg, /stroke-dasharray="3 2"\/>/g), 1);
});

void finish();
