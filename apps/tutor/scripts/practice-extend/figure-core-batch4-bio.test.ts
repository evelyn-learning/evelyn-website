/**
 * Tests for scripts/practice-extend/figure-core-batch4-bio.ts (sequence_strip:
 * strands and chromatogram), reached the way the job reaches it — through
 * figure-core.ts (`describeFigure`, `describeForAlt`, `runChecker`,
 * `compareDerived`, `examineFigureItem`, `checkerCatalogue`, `axesOf`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected,
 * and textbook-standard cases with known answers (AUG = Met; UAA / UAG / UGA
 * stop; sickle cell GAG → GUG = Glu → Val). Per variant: the transcription
 * says what is printed, keeps a blank blank, and gives the peaks of a read-out
 * by trace.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch4-bio.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b4-bio';
import { BATCH2_CHECKERS, BATCH3_CHECKERS, BATCH4_CHECKERS, CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART, aminoAcidOf } from './figure-core-batch4-bio';

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
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'free', problemText: 'Use the figure shown. What does it give?', answer: '0', choices: [], hints: ['Read the figure.'],
    solutionText: 'Work it out from the figure.', difficulty: 2, covers: 'reading the figure', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A figure.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  const fmt = /^[−-]?[\d.]+%?$/.test(right) ? 'numeric' : 'free';
  assert.equal(compareDerived(item(spec, { answer: right, responseFormat: fmt }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong, responseFormat: fmt }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const S = (params: Args): PracticeFigureSpec => ({ type: 'sequence_strip', params });
const rows = (...seqs: Array<string | Args>): PracticeFigureSpec => S({ rows: seqs.map((q) => (typeof q === 'string' ? { seq: q } : q)) });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

test('the part is registered through figure-core.ts and shadows nothing', () => {
  assert.deepEqual([...PART.kinds], ['sequence_strip']);
  for (const name of Object.keys(PART.checkers)) {
    assert.ok(!(name in CHECKERS) && !(name in BATCH2_CHECKERS) && !(name in BATCH3_CHECKERS), `${name} must not shadow an earlier checker`);
    assert.equal(BATCH4_CHECKERS[name], PART.checkers[name], name);
  }
  const cat = checkerCatalogue(['sequence_strip']);
  for (const [name, d] of Object.entries(PART.checkers)) assert.ok(cat.includes(`- ${name} ${d.args} → ${d.returns}`), name);
  for (const f of FIXTURES) assert.deepEqual(axesOf(f.spec), {}, f.id);
  refused(() => run(fx('seq-chromatogram-simple-called'), 'seq_complement', { written: 'aligned' }), /the figure is a sequencing read-out/);
  refused(() => run(fx('seq-strands-simple-template'), 'chromatogram_read'), /the figure is rows of bases/);
  refused(() => describeFigure(S({ rows: [{ seq: 'ATXG' }] })), /"X" at position 3 is not a base/);
});

test('every fixture has a transcription and an alt draft; a blank is transcribed as a blank and never as the base under it', () => {
  for (const f of FIXTURES) {
    const d = describeFigure(f.spec);
    assert.ok(/^The figure is \S/.test(d.text) && d.text.includes('TEXT PRINTED ON THE FIGURE:') && d.readable.length > 0, f.id);
    assert.ok(!/undefined|NaN|\[object/.test(d.text), `${f.id}: ${d.text}`);
    if (/blank/.test(f.id)) assert.ok(/blank/.test(d.text), `${f.id}: the blank is transcribed as a blank`);
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && !/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: ${alt}`);
    // Base letters are not names: no clash with the option letters A–D.
    assert.equal(figureLetterClash(f.spec, ['w', 'x', 'y', 'z']), null, f.id);
  }
  const t = textOf(fx('seq-strands-blank-codon-table'));
  assert.ok(t.includes('T A C A A A C T (blank) C C G A T T'), t);
  assert.ok(t.includes('"Met", "Phe", (blank — a "?" box), "Gly", "Stop"') && !/"Glu"/.test(t), 'the amino acid under the blank is not named');
  assert.ok(t.includes('AUG | UUU | GAA | GGC | UAA') && t.includes('its left end is labelled "3′" and its right end "5′"'));
  assert.ok(describeForAlt(fx('seq-strands-blank-codon-table')).includes('left blank'));
  assert.ok(!/Glu/.test(describeForAlt(fx('seq-strands-blank-codon-table'))));
  const del = textOf(fx('seq-strands-deletion-gap'));
  assert.ok(del.includes('A T G C C (gap) T T A') && del.includes('its ends are not labelled') && del.includes('A box is drawn round position 6 of row 2 (the cell holding (gap))'));
  const dense = textOf(fx('seq-strands-dense-gene-to-protein'));
  assert.ok(dense.includes('A short tick joins each base of row 1 to the base of row 2 under it.') && dense.includes('Positions are numbered over the first row at 1, 5, 10, 15, 20, 25, 30.'));
  // What the spec does not print is not mentioned: no codons, no amino acids, no "mRNA" on a single strand.
  const simple = textOf(fx('seq-strands-simple-template'));
  assert.ok(!/bracket|amino|mRNA|tick/i.test(simple) && simple.includes('named "template"'));
});

test('a read-out is transcribed peak by peak by TRACE (that is what is drawn); a hidden call is not printed, a blank call is a blank', () => {
  const hidden = textOf(fx('seq-chromatogram-dense-uncalled'));
  assert.ok(hidden.includes('peak 1: the "A" trace') && hidden.includes('peak 16: the "A" trace') && hidden.includes('No letter is printed over any peak.') && !/is printed over it/.test(hidden));
  assert.ok(hidden.includes('"G" is a dash-dot line with a triangle on each peak top'));
  const blank = textOf(fx('seq-chromatogram-blank-two-calls'));
  assert.ok(blank.includes('peak 4: the "A" trace; over it (blank — a "?" box)') && blank.includes('peak 1: the "C" trace; the letter "C" is printed over it'));
  const alt = describeForAlt(fx('seq-chromatogram-dense-uncalled'));
  assert.ok(/key entries "A", "C", "G", "T"/.test(alt), alt);
});

test('the standard genetic code: AUG is Met, the three stop codons, a full count of 64', () => {
  assert.equal(aminoAcidOf('AUG'), 'Met');
  assert.equal(aminoAcidOf('UGG'), 'Trp');
  for (const stop of ['UAA', 'UAG', 'UGA']) assert.equal(aminoAcidOf(stop), 'Stop');
  assert.equal(aminoAcidOf('GAG'), 'Glu');
  assert.equal(aminoAcidOf('GUG'), 'Val');
  assert.equal(aminoAcidOf('TTT'), 'Phe', 'a DNA coding codon is read with U for T');
  const all: string[] = [];
  for (const a of 'UCAG') for (const b of 'UCAG') for (const c of 'UCAG') all.push(aminoAcidOf(a + b + c));
  assert.equal(all.length, 64);
  assert.equal(all.filter((x) => x === 'Stop').length, 3);
  assert.equal(new Set(all).size, 21);
  const tally = (x: string) => all.filter((y) => y === x).length;
  assert.deepEqual([tally('Leu'), tally('Ser'), tally('Arg'), tally('Met'), tally('Trp'), tally('Ile')], [6, 6, 6, 1, 1, 3]);
});

test('seq_complement: base pairing, aligned or written 5′ → 3′, DNA or RNA; never across a blank', () => {
  const one = rows('ATGC');
  rw(one, 'seq_complement', { written: 'aligned' }, 'TACG', 'GCAT');
  rw(one, 'seq_complement', { written: '5to3' }, 'GCAT', 'TACG');
  rw(one, 'seq_complement', { written: 'aligned', as: 'RNA' }, 'UACG', 'TACG');
  // A row drawn 3′ → 5′: its complement written 5′ → 3′ is base under base.
  rw(fx('seq-strands-simple-template'), 'seq_complement', { written: '5to3' }, 'ATGCCGTAATCG', 'CGATTACGGCAT');
  rw(fx('seq-strands-simple-template'), 'seq_complement', { written: 'aligned' }, 'ATGCCGTAATCG', 'TACGGCATTAGC');
  // The two strands of the dense fixture are each other's complement.
  assert.deepEqual(run(fx('seq-strands-dense-gene-to-protein'), 'seq_complement', { row: 0, written: 'aligned' }), { kind: 'text', value: 'TACCGACTTCAAGTGGACTGAGGACTCATT' });
  refused(() => run(fx('seq-strands-blank-codon-table'), 'seq_complement', { row: 0, written: 'aligned' }), /position 9 of the row is a blank/);
  refused(() => run(one, 'seq_complement', {}), /"written" must be one of aligned \| 5to3/);
  refused(() => run(one, 'seq_complement', { row: 2, written: 'aligned' }), /0-based index of a row/);
});

test('seq_transcribe: the template strand gives its reverse complement, the coding strand its own letters with U', () => {
  rw(fx('seq-strands-simple-template'), 'seq_transcribe', { strand: 'template' }, 'AUGCCGUAAUCG', 'UACGGCAUUAGC');
  rw(rows('ATGGCT'), 'seq_transcribe', { strand: 'coding' }, 'AUGGCU', 'UACCGA');
  rw(rows('ATGGCT'), 'seq_transcribe', { strand: 'template' }, 'AGCCAU', 'AUGGCU');
  // Strand 2 of the gene (drawn 3′ → 5′) is the template of the mRNA printed under it.
  assert.deepEqual(run(fx('seq-strands-dense-gene-to-protein'), 'seq_transcribe', { row: 1, strand: 'template' }), { kind: 'text', value: 'AUGGCUGAAGUUCACCUGACUCCUGAGUAA' });
  refused(() => run(rows('AUGGCU'), 'seq_transcribe', { strand: 'template' }), /the row is RNA/);
  refused(() => run(rows('ATGGCT'), 'seq_transcribe', {}), /"strand" must be one of coding \| template/);
});

test('seq_translate: from the first AUG to the stop — chain, length, one codon; a DNA row needs its strand', () => {
  const dense = fx('seq-strands-dense-gene-to-protein');
  rw(dense, 'seq_translate', { row: 2 }, 'Met-Ala-Glu-Val-His-Leu-Thr-Pro-Glu', 'Met-Ala-Glu-Val-His-Leu-Thr-Pro-Glu-Stop');
  rw(dense, 'seq_translate', { row: 2, want: 'length' }, '9', '10');
  rw(dense, 'seq_translate', { row: 2, want: 'amino_acid', codon: 4 }, 'Val', 'Glu');
  rw(dense, 'seq_translate', { row: 2, want: 'amino_acid', codon: 10 }, 'Stop', 'Glu');
  rw(dense, 'seq_translate', { row: 0, strand: 'coding', want: 'length' }, '9', '30');
  rw(dense, 'seq_translate', { row: 1, strand: 'template' }, 'Met-Ala-Glu-Val-His-Leu-Thr-Pro-Glu', 'Tyr-Arg-Leu');
  rw(fx('seq-strands-blank-codon-table'), 'seq_translate', { row: 1, want: 'amino_acid', codon: 3 }, 'Glu', 'Asp');
  // The frame starts at the first AUG, not at the first base; `start` overrides it.
  rw(rows('GGAUGUUUUAG'), 'seq_translate', {}, 'Met-Phe', 'Gly-Cys-Phe');
  rw(rows('GGAUGUUUUAG'), 'seq_translate', { start: 1 }, 'Gly-Cys-Phe', 'Met-Phe');
  // The three stop codons each end the chain.
  for (const stop of ['UAA', 'UAG', 'UGA']) rw(rows(`AUGGGG${stop}GGG`), 'seq_translate', { want: 'length' }, '2', '3');
  refused(() => run(dense, 'seq_translate', { row: 0 }), /"strand" must say what the row is/);
  refused(() => run(rows('GGGCCCUUU'), 'seq_translate', {}), /has no AUG/);
  refused(() => run(rows('GGGCCC'), 'seq_translate', {}), /"strand" must say what the row is/);
  refused(() => run(rows('UAAGGG'), 'seq_translate', { start: 1 }), /begins with a stop codon/);
  refused(() => run(dense, 'seq_translate', { row: 2, strand: 'template' }), /the row is RNA/);
});

test('seq_codon: count, n-th codon, start and stop positions', () => {
  const m = fx('seq-strands-blank-codon-table');
  rw(m, 'seq_codon', { row: 1, want: 'count' }, '5', '15');
  rw(m, 'seq_codon', { row: 1, want: 'codon', codon: 2 }, 'UUU', 'AUG');
  rw(m, 'seq_codon', { row: 1, want: 'stop_position' }, '13', '5');
  rw(rows('GGAUGUUUUAG'), 'seq_codon', { want: 'start_position' }, '3', '1');
  rw(rows('GGAUGUUUUAG'), 'seq_codon', { want: 'count' }, '3', '2');
  refused(() => run(rows('AUGGGGCCC'), 'seq_codon', { want: 'stop_position' }), /no stop codon lies in the reading frame/);
  refused(() => run(m, 'seq_codon', { row: 1, want: 'codon', codon: 6 }), /from 1 to 5/);
});

test('seq_anticodon: AUG pairs with UAC (written 3′ → 5′) = CAU (5′ → 3′); no tRNA for a stop codon', () => {
  const m = fx('seq-strands-blank-codon-table');
  rw(m, 'seq_anticodon', { row: 1, codon: 1, written: '3to5' }, 'UAC', 'CAU');
  rw(m, 'seq_anticodon', { row: 1, codon: 1, written: '5to3' }, 'CAU', 'UAC');
  rw(m, 'seq_anticodon', { row: 1, codon: 3, written: '3to5' }, 'CUU', 'GAA');
  rw(rows('ATGTGG'), 'seq_anticodon', { strand: 'coding', codon: 2, written: '3to5' }, 'ACC', 'UGG');
  refused(() => run(m, 'seq_anticodon', { row: 1, codon: 5, written: '3to5' }), /is a stop codon/);
  refused(() => run(m, 'seq_anticodon', { row: 1, codon: 1 }), /"written" must be one of 3to5 \| 5to3/);
});

test('seq_mutation: silent / missense / nonsense substitutions; frameshift and in-frame insertions and deletions', () => {
  // Sickle cell: codon 7 of β-globin, GAG → GUG, glutamic acid → valine.
  const sickle = fx('seq-strands-mutation-boxed');
  rw(sickle, 'seq_mutation', { want: 'effect' }, 'missense', 'silent');
  rw(sickle, 'seq_mutation', { want: 'kind' }, 'substitution', 'deletion');
  rw(sickle, 'seq_mutation', { want: 'old_amino_acid' }, 'Glu', 'Val');
  rw(sickle, 'seq_mutation', { want: 'new_amino_acid' }, 'Val', 'Glu');
  rw(sickle, 'seq_mutation', { want: 'position' }, '20', '7');
  // The same change on the DNA: coding strand GAG → GTG.
  rw(rows('ATGGAGGAG', 'ATGGTGGAG'), 'seq_mutation', { strand: 'coding', want: 'new_amino_acid' }, 'Val', 'Glu');
  // Third-base change that keeps the amino acid (GAA and GAG are both Glu).
  rw(rows('AUGGAAUAA', 'AUGGAGUAA'), 'seq_mutation', { want: 'effect' }, 'silent', 'missense');
  // UAC (Tyr) → UAG (stop).
  rw(rows('AUGUACGGG', 'AUGUAGGGG'), 'seq_mutation', { want: 'effect' }, 'nonsense', 'missense');
  // One base deleted: a frameshift; three deleted: in frame.
  const del = fx('seq-strands-deletion-gap');
  rw(del, 'seq_mutation', { strand: 'coding', want: 'effect' }, 'frameshift', 'in-frame deletion');
  rw(del, 'seq_mutation', { strand: 'coding', want: 'kind' }, 'deletion', 'insertion');
  rw(rows('AUGCCGUUAGGA', 'AUG---UUAGGA'), 'seq_mutation', { want: 'effect' }, 'in-frame deletion', 'frameshift');
  rw(rows('AUGCCGUUAGGA', 'AUGCCGAUUAGGA'), 'seq_mutation', { want: 'effect' }, 'frameshift', 'in-frame insertion');
  rw(rows('AUGCCGUUAGGA', 'AUGCCGAAAUUAGGA'), 'seq_mutation', { want: 'effect' }, 'in-frame insertion', 'frameshift');
  rw(rows('AUGCCGUUAGGA', 'AUGCCGAAAUUAGGA'), 'seq_mutation', { want: 'position' }, '7', '6');
  refused(() => run(rows('AUGCCGUUA', 'AUGCGGUAA'), 'seq_mutation', { want: 'effect' }), /differ at 2 positions/);
  refused(() => run(rows('AUGCCG', 'AUGCCG'), 'seq_mutation', { want: 'kind' }), /the same sequence/);
  refused(() => run(del, 'seq_mutation', { want: 'effect' }), /"strand" must say what the row is/);
  refused(() => run(del, 'seq_mutation', { strand: 'coding', want: 'new_amino_acid' }), /is for a substitution/);
  refused(() => run(rows('AUGUAAGGG', 'AUGUAAGCG'), 'seq_mutation', { want: 'effect' }), /after a stop codon/);
});

test('seq_base_count: bases, G + C content, hydrogen bonds with the complement', () => {
  const one = rows('ATGCGC');
  rw(one, 'seq_base_count', { want: 'G' }, '2', '3');
  rw(one, 'seq_base_count', { want: 'GC' }, '4', '2');
  rw(one, 'seq_base_count', { want: 'AT' }, '2', '4');
  rw(one, 'seq_base_count', { want: 'length' }, '6', '5');
  rw(one, 'seq_base_count', { want: 'hydrogen_bonds' }, '16', '12');
  rw(rows('ATGCGCAT'), 'seq_base_count', { want: 'gc_percent' }, '50', '4');
  rw(fx('seq-strands-deletion-gap'), 'seq_base_count', { row: 1, want: 'length' }, '14', '15');
  refused(() => run(rows('AUGC'), 'seq_base_count', { want: 'T' }), /the row is RNA/);
  refused(() => run(fx('seq-strands-blank-codon-table'), 'seq_base_count', { row: 0, want: 'A' }), /is a blank/);
});

test('chromatogram_read / chromatogram_base: the peaks settle the sequence, called or not', () => {
  const dense = fx('seq-chromatogram-dense-uncalled');
  rw(dense, 'chromatogram_read', {}, 'ATGGCCTTAGCAGTCA', 'ATGGCCTTAGCAGTCT');
  rw(dense, 'chromatogram_read', { from: 1, to: 6 }, 'ATGGCC', 'ATGGCG');
  rw(dense, 'chromatogram_read', { from: 1, to: 6, written: 'complement_5to3' }, 'GGCCAT', 'TACCGG');
  rw(dense, 'chromatogram_base', { position: 9 }, 'A', 'T');
  rw(dense, 'chromatogram_base', { base: 'G' }, '4', '3');
  const blank = fx('seq-chromatogram-blank-two-calls');
  rw(blank, 'chromatogram_base', { position: 4 }, 'A', 'G');
  rw(blank, 'chromatogram_base', { position: 8 }, 'C', 'T');
  rw(fx('seq-chromatogram-twenty-warns'), 'chromatogram_base', { position: 12 }, 'A', 'G');
  refused(() => run(dense, 'chromatogram_base', { position: 17 }), /from 1 to 16/);
  refused(() => run(dense, 'chromatogram_read', { from: 5, to: 2 }), /from ≤ to/);
});

test('a sequence item is examined like any other: the key is recomputed from the spec', () => {
  const mc = item(fx('seq-strands-mutation-boxed'), {
    responseFormat: 'mcq', problemText: 'The figure shows the mRNA of a normal allele and of a mutant allele. What kind of mutation is it?', choices: ['silent', 'missense', 'nonsense', 'frameshift'], answer: 'B',
    alt: 'Two strands of mRNA written one over the other with one base boxed in each.', derivation: { checker: 'seq_mutation', args: { want: 'effect' } },
  });
  const ok = examineFigureItem(mc);
  assert.equal(ok.derivation.status, 'derived', JSON.stringify(ok));
  assert.deepEqual(ok.defects, []);
  assert.equal(examineFigureItem({ ...mc, answer: 'A' }).derivation.status, 'mismatch');
  const free = item(fx('seq-chromatogram-dense-uncalled'), { problemText: 'Using the sequencing read-out shown, which base is at position 9?', answer: 'A', alt: 'A sequencing read-out with peaks in four stroke patterns.', derivation: { checker: 'chromatogram_base', args: { position: 9 } } });
  assert.equal(examineFigureItem(free).derivation.status, 'derived', JSON.stringify(examineFigureItem(free)));
  assert.equal(examineFigureItem({ ...free, answer: 'T' }).derivation.status, 'mismatch');
  const bad = examineFigureItem({ ...free, derivation: { checker: 'seq_translate', args: {} } });
  assert.equal(bad.derivation.status, 'error');
});

test('every checker of the part was exercised above', () => {
  for (const name of Object.keys(PART.checkers)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch4-bio test(s) passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
