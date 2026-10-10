/**
 * Practice-figure renderer — batch 4, part "bio" (2026-10-14):
 * sequence_strip (the `strands` and the `chromatogram` variant) and to-do (b),
 * bio_schematic division (cells that fill the frame, chromosomes that read as
 * filled or hollow, Roman-numeral labels on a label plate).
 *
 * Under test: the shared invariants of every fixture of the part
 * (scripts/lib/practice-figure-test-kit.ts); per variant what is drawn, what
 * each option hides, the model behind the picture, the refusals and the
 * kind's own legibility notes; for the fix, what a reader at 340 px now sees.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-bio.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { renderPracticeFigure } from '../src/lib/tutor/practice-figure/render';
import { chromatogramLayout, sequenceModel, strandLines, type ChromatogramModel, type StrandsModel } from '../src/lib/tutor/practice-figure/kinds/sequence';
import { FIGURE_FIXTURES } from './lib/practice-figure-fixtures';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-bio';
import { FIXTURES as FIXES } from './lib/practice-figure-fixtures-b4-fixes-d';
import { count, fixtureInvariants, has, makeRunner, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const GROUPS: Record<string, string> = { 'sequence_strip (strands)': 'seq-strands-', 'sequence_strip (chromatogram)': 'seq-chromatogram-' };

console.log('\nEvery fixture of the part:\n');
const rendered = fixtureInvariants(test, [...FIXTURES, ...FIXES], GROUPS, ['b']);
const P = (id: string): Params => ([...FIXTURES, ...FIXES].find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec.params;
const strands = (params: Params): StrandsModel => sequenceModel(reader('sequence_strip', params)) as StrandsModel;
const BLANK_BOX = /stroke-dasharray="3 2"\/>/g;
const BRACKET = /M[\d.]+,[\d.]+v4H[\d.]+v-4/g;

console.log('\nsequence_strip · strands:\n');

test('strands: one <text> per base in its own cell, end labels by the 5′ end, the name left of the row — and nothing that was not asked for', () => {
  const svg = rendered.get('seq-strands-simple-template') as string;
  assert.deepEqual(texts(svg), ['template', '3′', '5′', 'T', 'A', 'C', 'G', 'G', 'C', 'A', 'T', 'T', 'A', 'G', 'C']);
  assert.equal(count(svg, BRACKET), 0);
  assert.equal(count(svg, /<rect /g), 1, 'the background only');
  const m = strands(P('seq-strands-simple-template'));
  assert.deepEqual([m.rows[0].type, m.rows[0].fivePrime, m.pairTicks, m.codons, m.numberEvery], ['DNA', 'right', false, null, 0]);
  // Base cells are evenly spaced, 13 units apart.
  const xs = [...svg.matchAll(/<text x="([\d.]+)" y="[\d.]+" font-size="13"/g)].map((q) => Number(q[1]));
  assert.equal(xs.length, 12);
  for (let i = 1; i < xs.length; i++) assert.ok(Math.abs(xs[i] - xs[i - 1] - 13) < 1e-6);
});

test('strands: defaults of the 5′ end — left; the second row of a ticked pair runs the other way; RNA and DNA are told by U and T', () => {
  const m = strands({ rows: [{ seq: 'ATGC' }, { seq: 'TACG' }, { seq: 'AUGC' }, { seq: 'AAGG' }], pairTicks: true });
  assert.deepEqual(m.rows.map((q) => q.fivePrime), ['left', 'right', 'left', 'left']);
  assert.deepEqual(m.rows.map((q) => q.type), ['DNA', 'DNA', 'RNA', null]);
  assert.deepEqual(strands({ rows: [{ seq: 'ATGC' }, { seq: 'TACG' }] }).rows.map((q) => q.fivePrime), ['left', 'left'], 'without ticks nothing says the rows are a pair');
  const none = svgOf('sequence_strip', { rows: [{ seq: 'ATGC', fivePrime: 'none' }] });
  assert.ok(!has(none, '5′') && !has(none, '3′'));
  // Lower case and spaces are accepted; a typographic minus is a gap.
  assert.equal(strands({ rows: [{ seq: 'atg cc−g' }] }).rows[0].seq, 'ATGCC-G');
});

test('strands: codon brackets, amino acids, ticks, numbers and boxes are each drawn only when asked — and each can be left out or blanked', () => {
  const dense = rendered.get('seq-strands-dense-gene-to-protein') as string;
  assert.equal(count(dense, BRACKET), 10);
  assert.deepEqual(texts(dense).filter((t) => /^[A-Z][a-z]{2,3}$/.test(t)), ['Met', 'Ala', 'Glu', 'Val', 'His', 'Leu', 'Thr', 'Pro', 'Glu', 'Stop']);
  assert.deepEqual(texts(dense).filter((t) => /^\d+$/.test(t)), ['1', '5', '10', '15', '20', '25', '30']);
  assert.equal(count(dense, /M[\d.]+,[\d.]+v6/g), 30, 'one tick per base pair');
  // Without the amino acids the same figure prints none; without codons, no bracket.
  const p = P('seq-strands-dense-gene-to-protein');
  const bare = svgOf('sequence_strip', { ...p, aminoAcids: undefined });
  assert.equal(texts(bare).filter((t) => /^[A-Z][a-z]{2,3}$/.test(t)).length, 0);
  assert.equal(count(bare, BRACKET), 10);
  assert.equal(count(svgOf('sequence_strip', { ...p, aminoAcids: undefined, codons: null }), BRACKET), 0);
  // codons: { start, count } sets the frame: two brackets from position 2.
  const framed = svgOf('sequence_strip', { rows: [{ seq: 'GAUGGCUUAA' }], codons: { start: 2, count: 2 } });
  assert.equal(count(framed, BRACKET), 2);
  // A "?" amino acid and a "?" base are dashed boxes; the letter under them is not in the SVG.
  const blank = rendered.get('seq-strands-blank-codon-table') as string;
  assert.equal(count(blank, BLANK_BOX), 2);
  assert.ok(!has(blank, 'Glu') && texts(blank).filter((t) => t === '?').length === 2);
  assert.equal(texts(blank).filter((t) => /^[ACGTU]$/.test(t)).length, 29, '15 + 15 bases less the blanked one');
  // amino acid null = nothing under that bracket.
  const some = svgOf('sequence_strip', { rows: [{ seq: 'AUGUUUUAA' }], codons: {}, aminoAcids: ['Met', null, 'Stop'] });
  assert.deepEqual(texts(some).filter((t) => /^[A-Z][a-z]+$/.test(t)), ['Met', 'Stop']);
  // A highlight is a drawn box (a rect with a dark outline), not a colour; a gap is a dash, not a letter.
  const mut = rendered.get('seq-strands-mutation-boxed') as string;
  assert.equal(count(mut, /<rect [^>]*rx="2\.5" fill="#ffffff" stroke="#111827" stroke-width="1\.6"\/>/g), 2);
  assert.ok(!/fill="#(?!ffffff|111827|4b5563)[0-9a-f]{6}"/.test(mut), 'no colour carries meaning');
  const del = rendered.get('seq-strands-deletion-gap') as string;
  assert.equal(texts(del).filter((t) => /^[ACGT]$/.test(t)).length, 29);
  assert.equal(count(del, /h6\.8" fill="none" stroke="#4b5563"/g), 1);
});

test('strands: a long sequence wraps over lines (the type never shrinks), between codons, with every row in the same columns', () => {
  const m = strands(P('seq-strands-dense-gene-to-protein'));
  const avail = 360 - (8 + 62 + 17) - 17 - 8;
  const lines = strandLines(m, avail);
  assert.ok(lines.length === 2 && lines[0][0] === 0 && lines[1][1] === 30);
  assert.equal(lines[0][1] % 3, 0, 'the line breaks between codons');
  const svg = rendered.get('seq-strands-dense-gene-to-protein') as string;
  assert.ok([...svg.matchAll(/font-size="([\d.]+)"/g)].every((q) => Number(q[1]) >= 11));
  // 72 bases in one row: still 13-unit type, more lines.
  const long = svgOf('sequence_strip', { rows: [{ seq: 'ATGC'.repeat(18) }] });
  assert.equal(texts(long).filter((t) => /^[ACGT]$/.test(t)).length, 72);
  assert.ok(/font-size="13"/.test(long));
  // perLine sets the line length; one that cannot fit is refused.
  assert.equal(strandLines(strands({ rows: [{ seq: 'ATGCATGCATGC' }], perLine: 6 }), 300).length, 2);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGC'.repeat(10) }], perLine: 40 }, /perLine: 40 bases do not fit one line at a legible size here \(at most \d+\)/);
});

test('strands: refusals name the param', () => {
  throwsSpec('sequence_strip', { rows: [] }, /rows must have between 1 and 4 entries/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATXG' }] }, /rows\[0\]\.seq: "X" at position 3 is not a base \(A, C, G, T or U\), "\?" or "-"/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATUG' }] }, /has both T and U/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'AT' }] }, /between 3 and 72 positions/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGC'.repeat(19) }] }, /between 3 and 72 positions \(has 76\)/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGC' }], pairTicks: true }, /pairTicks needs two rows/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGC' }, { seq: 'TAC' }], pairTicks: true }, /must be the same length \(they have 4 and 3\)/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGC' }], aminoAcids: ['Met'] }, /aminoAcids needs codons/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC' }], codons: {}, aminoAcids: ['Met', 'Pro', 'Gly'] }, /aminoAcids has 3 entries for 2 codons/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC' }], codons: { start: 5 } }, /codons\.start must be a position from 1 to 4/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC' }], codons: { row: 1 } }, /codons\.row must be the 0-based index of a row/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC' }], highlight: [{ row: 0, pos: 7 }] }, /highlight\[0\]\.pos must be a position from 1 to 6/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC' }], numberEvery: 2 }, /numberEvery must be a whole number of at least 3/);
  throwsSpec('sequence_strip', { rows: [{ seq: 'ATGCCC', fivePrime: 'top' }] }, /fivePrime must be one of left, right, none/);
  throwsSpec('sequence_strip', { variant: 'karyotype' }, /variant must be one of strands, chromatogram/);
});

test('strands: legibility — more than nine rows of bases, or no base at all, is reported', () => {
  assert.deepEqual(warn('sequence_strip', { rows: [{ seq: 'ATGC'.repeat(18) }, { seq: 'TACG'.repeat(18) }, { seq: 'AUGC'.repeat(18) }] }), ['too_many_elements']);
  assert.deepEqual(warn('sequence_strip', { rows: [{ seq: '???' }] }), ['ambiguous_blank']);
  assert.deepEqual(warn('sequence_strip', P('seq-strands-dense-gene-to-protein')), []);
});

console.log('\nsequence_strip · chromatogram:\n');

test('chromatogram: one peak per base in its own trace pattern with its own marker; a key names the four traces without relying on colour', () => {
  const svg = rendered.get('seq-chromatogram-simple-called') as string;
  const m = sequenceModel(reader('sequence_strip', P('seq-chromatogram-simple-called'))) as ChromatogramModel;
  assert.equal(m.seq, 'GATTCAGC');
  // Eight peak paths: A solid, C dashed, G dash-dot, T dotted.
  const peaks = [...svg.matchAll(/<path d="M[^"]*" fill="none" stroke="(#[0-9a-f]{6})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"( stroke-dasharray="([^"]*)")?\/>/g)];
  assert.equal(peaks.length, 8);
  const dashOf = new Map(peaks.map((q) => [q[1], q[3] ?? '']));
  assert.equal(dashOf.size, 4);
  assert.equal(new Set(dashOf.values()).size, 4, 'four colours, four stroke patterns');
  // The calls, in order, then the key letters.
  assert.deepEqual(texts(svg).filter((t) => /^[ACGT]$/.test(t)), ['G', 'A', 'T', 'T', 'C', 'A', 'G', 'C', 'A', 'C', 'G', 'T']);
  assert.ok(has(svg, '5′') && has(svg, '3′') && has(svg, 'direction of the read'));
  // The layout: evenly spaced peaks, heights within the plot.
  const lay = chromatogramLayout(m);
  assert.equal(lay.xs.length, 8);
  for (const h of lay.peakH) assert.ok(h >= 0.4 * 64 && h <= 64);
  // Markers: 2 round dots (A) on the peaks + 1 in the key.
  assert.equal(count(svg, /<circle [^>]*r="3\.3"/g), 3);
});

test('chromatogram: the calls can be hidden (the read is the question) or blanked one by one; positions and the direction can be left out', () => {
  const hidden = rendered.get('seq-chromatogram-dense-uncalled') as string;
  assert.deepEqual(texts(hidden).filter((t) => /^[ACGT]$/.test(t)), ['A', 'C', 'G', 'T'], 'only the key');
  assert.deepEqual(texts(hidden).filter((t) => /^\d+$/.test(t)), ['1', '5', '10', '15']);
  const blank = rendered.get('seq-chromatogram-blank-two-calls') as string;
  assert.equal(count(blank, BLANK_BOX), 2);
  assert.deepEqual(texts(blank).slice(0, 10), ['C', 'T', 'G', '?', 'A', 'G', 'T', '?', 'C', 'A']);
  // calls: 'none' with blank positions: only the "?" boxes mark the peaks asked for.
  const only = svgOf('sequence_strip', { variant: 'chromatogram', seq: 'ACGTAC', calls: 'none', blank: [2] });
  assert.equal(count(only, BLANK_BOX), 1);
  assert.deepEqual(texts(only).filter((t) => /^[ACGT]$/.test(t)), ['A', 'C', 'G', 'T']);
  const plain = svgOf('sequence_strip', { variant: 'chromatogram', seq: 'ACGTAC', positions: false, direction: false });
  assert.ok(!has(plain, '5′') && !has(plain, 'direction of the read') && texts(plain).every((t) => !/^\d+$/.test(t)));
  // Given heights are used as given.
  const m = sequenceModel(reader('sequence_strip', { variant: 'chromatogram', seq: 'ACGT', heights: [1, 0.5, 0.5, 1] })) as ChromatogramModel;
  assert.deepEqual(chromatogramLayout(m).peakH, [64, 32, 32, 64]);
});

test('chromatogram: refusals and the crowding note', () => {
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGU' }, /seq: "U" at position 4 is not a base a sequencing read-out calls/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACG' }, /between 4 and 20 bases \(has 3\)/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGT'.repeat(6) }, /between 4 and 20 bases \(has 24\) — a longer read-out does not fit a 340 px card/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGT', calls: 'some' }, /calls must be one of all, none/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGT', blank: [5] }, /blank\[0\] must be a position from 1 to 4/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGT', heights: [1, 1, 1] }, /heights must have between 4 and 4 entries/);
  throwsSpec('sequence_strip', { variant: 'chromatogram', seq: 'ACGT', heights: [1, 1, 1, 0.1] }, /heights\[3\] must be between 0\.4 and 1/);
  assert.deepEqual(warn('sequence_strip', P('seq-chromatogram-twenty-warns')), ['crowded']);
  assert.deepEqual(warn('sequence_strip', P('seq-chromatogram-dense-uncalled')), []);
});

console.log('\nTo-do (b) — bio_schematic division:\n');

const viewH = (svg: string): number => Number(/viewBox="0 0 360 (\d+)"/.exec(svg)?.[1]);
/** The outline ellipse(s) of the cells: [rx, ry] of each `A rx,ry` oval drawn in ink at width 2.4. */
const ovals = (svg: string): Array<[number, number]> => [...svg.matchAll(/<path d="M[\d.]+,[\d.]+A([\d.]+),([\d.]+) [^"]*" fill="#ffffff" stroke="#111827" stroke-width="2\.4"/g)].map((q) => [Number(q[1]), Number(q[2])]);

test('b: a single cell fills the frame (it took a third of it), and its chromosomes are scaled with it', () => {
  const svg = rendered.get('fix4-b-division-single-cell-roman') as string;
  const [[rx, ry]] = ovals(svg);
  assert.ok(2 * rx >= 0.8 * 360, `the cell is ${2 * rx} of 360 wide`);
  assert.ok(2 * ry >= 0.8 * (viewH(svg) - 40), 'and most of the height');
  // Sticks: thicker than the 3.4 they were, and the hollow ones keep a white core of at least 3 units.
  const dark = [...svg.matchAll(/stroke="#111827" stroke-width="([\d.]+)" stroke-linecap="round" stroke-linejoin="round"\/>/g)].map((q) => Number(q[1]));
  const core = [...svg.matchAll(/stroke="#ffffff" stroke-width="([\d.]+)" stroke-linecap="round" stroke-linejoin="round"\/>/g)].map((q) => Number(q[1]));
  assert.equal(dark.length, 12, '2n = 6 replicated chromosomes: twelve sticks');
  assert.equal(core.length, 6, 'one homologue of each pair is hollow');
  assert.ok(Math.min(...dark) >= 6 && Math.min(...core) >= 3 && Math.min(...dark) - Math.max(...core) >= 2.2, `${dark[0]} / ${core[0]}`);
  // The tallest chromosome is over a tenth of the canvas height (it was 13 units).
  const ys = [...svg.matchAll(/<path d="M[\d.]+,([\d.]+)L[\d.]+,([\d.]+)" fill="none" stroke="#111827" stroke-width="[\d.]+" stroke-linecap="round"/g)].map((q) => Math.abs(Number(q[2]) - Number(q[1])));
  assert.ok(Math.max(...ys) >= 36, `${Math.max(...ys)}`);
});

test('b: two, three and four cells share the frame; every earlier option still draws', () => {
  const two = ovals(renderPracticeFigure({ type: 'bio_schematic', params: { variant: 'division', n: 2, cells: [{ stage: 'metaphase' }, { stage: 'anaphase' }] } }).svg);
  assert.ok(two.length === 2 && two[0][0] >= 80, `two cells: rx ${two[0]?.[0]}`);
  const strip = FIGURE_FIXTURES.find((f) => f.id === 'bio-division-mitosis-strip')!;
  const three = ovals(renderPracticeFigure(strip.spec).svg);
  assert.ok(three.length === 3 && three[0][0] >= 52 && three[0][1] >= 58);
  const four = ovals(renderPracticeFigure(FIGURE_FIXTURES.find((f) => f.id === 'bio-division-meiosis-dense')!.spec).svg);
  assert.ok(four.length === 4 && four[0][0] >= 80 && four[0][1] >= 70);
  for (const stage of ['prophase', 'metaphase', 'anaphase', 'telophase', 'prophase_I', 'metaphase_I', 'anaphase_I', 'telophase_I', 'metaphase_II', 'anaphase_II', 'telophase_II']) {
    for (const n of [1, 2, 3]) assert.doesNotThrow(() => renderPracticeFigure({ type: 'bio_schematic', params: { variant: 'division', n, cells: [{ stage, label: 'P' }, { stage }] } }), `${stage} n=${n}`);
  }
  // No label at all: no room is kept for one.
  const bare = renderPracticeFigure({ type: 'bio_schematic', params: { variant: 'division', n: 2, cells: [{ stage: 'metaphase' }] } }).svg;
  assert.ok(viewH(bare) < viewH(rendered.get('fix4-b-division-single-cell-roman') as string));
});

test('b: Roman-numeral labels stand on a label plate; letters, numbers, names and "?" are drawn as before', () => {
  const PLATE = /<rect [^>]*rx="4" fill="#f1f5f9" stroke="#4b5563" stroke-width="1"\/>/g;
  assert.equal(count(rendered.get('fix4-b-division-single-cell-roman') as string, PLATE), 1);
  const pair = rendered.get('fix4-b-division-roman-pair') as string;
  assert.equal(count(pair, PLATE), 2);
  assert.ok(has(pair, 'I') && has(pair, 'II'));
  const div = (labels: Array<string | null>): string => svgOf('bio_schematic', { variant: 'division', n: 2, cells: labels.map((label) => ({ stage: 'metaphase', label })) });
  assert.equal(count(div(['X', 'Y', 'Z']), PLATE), 0, 'X among Y and Z is a letter');
  assert.equal(count(div(['1', '2']), PLATE), 0);
  assert.equal(count(div(['metaphase', 'I']), PLATE), 0, 'a mixed set is not a set of numerals');
  assert.equal(count(div(['IV', 'X', null]), PLATE), 2, 'IV and X are numerals; an unlabelled cell has no plate');
  const q = div(['I', '?']);
  assert.equal(count(q, PLATE), 1, 'a "?" stays the dashed blank box');
  assert.equal(count(q, BLANK_BOX), 1);
});

void finish();
