/**
 * Batch 4, part "bio" (sequence_strip — the `strands` and the `chromatogram`
 * variant): the TEXT transcription and the deterministic checkers.
 * Conventions: figure-core-batch4-kit.ts.
 *
 * The transcription says what is printed: a "?" cell is a blank, never the
 * base under it; a gap dash is a gap; a hidden base call of a read-out is not
 * transcribed — the ORDER OF THE PEAKS by trace is, because that is what the
 * picture shows (each trace has its own stroke pattern and marker, and a key).
 *
 * The checkers read a row 5′ → 3′ by its end labels (a row without end labels
 * is taken as written, left to right) and never across a blank cell. A DNA row
 * is never guessed to be the coding or the template strand — the derivation
 * says which (`strand`).
 *
 * Pure: no I/O, no network, no model, no database.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { TRACE_BASES, TRACE_SHAPE_WORDS, sequenceModel, type ChromatogramModel, type SeqRow, type StrandsModel } from '../../src/lib/tutor/practice-figure/kinds/sequence';
import { BLANK, argIndex, fail, isNum, label, measured, modelOf, num, pick, plural, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

// ── the genetic code ────────────────────────────────────────────────────────

const AA_ORDER = 'UCAG';
/** The standard code, first base U C A G, then second, then third. */
const AA_TABLE = [
  'Phe', 'Phe', 'Leu', 'Leu', 'Ser', 'Ser', 'Ser', 'Ser', 'Tyr', 'Tyr', 'Stop', 'Stop', 'Cys', 'Cys', 'Stop', 'Trp',
  'Leu', 'Leu', 'Leu', 'Leu', 'Pro', 'Pro', 'Pro', 'Pro', 'His', 'His', 'Gln', 'Gln', 'Arg', 'Arg', 'Arg', 'Arg',
  'Ile', 'Ile', 'Ile', 'Met', 'Thr', 'Thr', 'Thr', 'Thr', 'Asn', 'Asn', 'Lys', 'Lys', 'Ser', 'Ser', 'Arg', 'Arg',
  'Val', 'Val', 'Val', 'Val', 'Ala', 'Ala', 'Ala', 'Ala', 'Asp', 'Asp', 'Glu', 'Glu', 'Gly', 'Gly', 'Gly', 'Gly',
];
/** The amino acid (three-letter name) or "Stop" of an mRNA codon. */
export function aminoAcidOf(codon: string): string {
  const [a, b, c] = [...codon.toUpperCase().replace(/T/g, 'U')].map((ch) => AA_ORDER.indexOf(ch));
  if (codon.length !== 3 || a < 0 || b < 0 || c < 0) return fail(`"${codon}" is not a codon`);
  return AA_TABLE[a * 16 + b * 4 + c];
}
const COMP: Record<string, string> = { A: 'T', T: 'A', U: 'A', G: 'C', C: 'G' };
const complementOf = (s: string, rna: boolean): string => [...s].map((ch) => (ch === 'A' ? (rna ? 'U' : 'T') : COMP[ch])).join('');
const reverse = (s: string): string => [...s].reverse().join('');

// ── reading a row ───────────────────────────────────────────────────────────

function strands(spec: PracticeFigureSpec): StrandsModel {
  const m = modelOf(spec, sequenceModel);
  if (m.variant !== 'strands') return fail('this checker reads rows of bases — the figure is a sequencing read-out (use chromatogram_read / chromatogram_base)');
  return m;
}
function read(spec: PracticeFigureSpec): ChromatogramModel {
  const m = modelOf(spec, sequenceModel);
  if (m.variant !== 'chromatogram') return fail('this checker reads a sequencing read-out — the figure is rows of bases (use the seq_ checkers)');
  return m;
}
function rowOf(m: StrandsModel, a: P, k = 'row'): { row: SeqRow; index: number } {
  const index = argIndex(a, k, m.rows.length, 'row of the figure');
  return { row: m.rows[index], index };
}
/** The bases of a row, 5′ → 3′, gaps left out. Refused when a cell is a blank. */
function fiveToThree(row: SeqRow, what: string): string {
  const q = row.seq.indexOf('?');
  if (q >= 0) return fail(`${what}: position ${q + 1} of the row is a blank "?" — the figure does not say which base it is`);
  const s = row.seq.replace(/-/g, '');
  return row.fivePrime === 'right' ? reverse(s) : s;
}
const STRANDS = ['mrna', 'coding', 'template'] as const;
/** The mRNA a row stands for, 5′ → 3′: itself (RNA), the same letters with U for T (the coding strand), or the reverse complement (the template). */
function mrnaOf(row: SeqRow, a: P, what: string): string {
  const s = fiveToThree(row, what);
  if (row.type === 'RNA') {
    if (a.strand !== undefined && a.strand !== 'mrna') return fail(`${what}: the row is RNA (it has U) — "strand" can only be mrna`);
    return s;
  }
  if (a.strand === undefined) return fail(`${what}: derivation argument "strand" must say what the row is — one of ${STRANDS.join(' | ')} (a DNA row is not guessed to be the coding or the template strand)`);
  const strand = pick(a, 'strand', STRANDS);
  if (strand === 'mrna') return row.type === 'DNA' ? fail(`${what}: the row is DNA (it has T) — it is the coding or the template strand, not mRNA`) : s;
  return strand === 'coding' ? s.replace(/T/g, 'U') : reverse(complementOf(s, true));
}
/** 0-based start of the reading frame in the 5′ → 3′ mRNA: `start` (1-based) when given, else the first AUG. */
function frameStart(mrna: string, a: P, what: string): number {
  if (a.start !== undefined) {
    const s = a.start;
    if (!isNum(s) || !Number.isInteger(s) || s < 1 || s > mrna.length - 2) return fail(`derivation argument "start" must be a position from 1 to ${mrna.length - 2} of the mRNA read 5′ → 3′`);
    return s - 1;
  }
  const at = mrna.indexOf('AUG');
  if (at < 0) return fail(`${what}: the mRNA has no AUG — give "start", the position where the reading frame begins`);
  return at;
}
const codonsFrom = (mrna: string, start: number): string[] => {
  const out: string[] = [];
  for (let i = start; i + 3 <= mrna.length; i += 3) out.push(mrna.slice(i, i + 3));
  return out;
};
/** The amino acids of a frame up to (not including) the first stop codon. */
function translate(mrna: string, start: number): { chain: string[]; stopped: boolean } {
  const chain: string[] = [];
  for (const c of codonsFrom(mrna, start)) {
    const aa = aminoAcidOf(c);
    if (aa === 'Stop') return { chain, stopped: true };
    chain.push(aa);
  }
  return { chain, stopped: false };
}

// ── transcription ───────────────────────────────────────────────────────────

const cellWord = (ch: string): string => (ch === '?' ? '(blank)' : ch === '-' ? '(gap)' : ch);

function strandsText(m: StrandsModel, printed: string[], out: string[]): string {
  out.push(`${plural(m.rows.length, 'row')} of base letters, one letter to a cell${m.rows.length > 1 ? ', the rows aligned cell under cell' : ''}. A "(blank)" is a cell holding ${BLANK}; a "(gap)" is a cell holding a dash (no base).`);
  m.rows.forEach((row, i) => {
    if (row.name) printed.push(`row name: "${row.name}"`);
    const ends = row.fivePrime === 'none' ? 'its ends are not labelled' : `its left end is labelled "${row.fivePrime === 'left' ? '5′' : '3′'}" and its right end "${row.fivePrime === 'left' ? '3′' : '5′'}"`;
    out.push(`  Row ${i + 1}${row.name ? `, named "${row.name}"` : ''}, left to right: ${[...row.seq].map(cellWord).join(' ')} — ${ends}.`);
  });
  if (m.rows.some((q) => q.fivePrime !== 'none')) printed.push('end label: "5′"', 'end label: "3′"');
  if (m.pairTicks) out.push('A short tick joins each base of row 1 to the base of row 2 under it.');
  if (m.codons) {
    const c = m.codons;
    const row = m.rows[c.row];
    const groups = Array.from({ length: c.count }, (_, k) => [...row.seq.slice(c.start + 3 * k, c.start + 3 * k + 3)].map(cellWord).join(''));
    out.push(`A bracket is drawn under each group of three cells of row ${c.row + 1}, starting at position ${c.start + 1}: ${groups.join(' | ')}.`);
    if (m.aminoAcids.some((x) => x)) {
      out.push(`Under the brackets, in order: ${Array.from({ length: c.count }, (_, k) => { const x = m.aminoAcids[k]; return x === '?' ? BLANK : x ? `"${x}"` : '(nothing)'; }).join(', ')}.`);
      for (const x of m.aminoAcids) if (x && x !== '?') printed.push(`name under a bracket: "${x}"`);
    }
  }
  if (m.numberEvery) {
    const L = Math.max(...m.rows.map((q) => q.seq.length));
    const shownAt = Array.from({ length: L }, (_, i) => i + 1).filter((n) => n === 1 || n % m.numberEvery === 0);
    out.push(`Positions are numbered over the first row at ${shownAt.join(', ')}.`);
    for (const n of shownAt) printed.push(`position number: "${n}"`);
  }
  for (const h of m.highlight) out.push(`A box is drawn round position ${h.pos + 1} of row ${h.row + 1} (the cell holding ${cellWord(m.rows[h.row].seq[h.pos])}).`);
  return 'a nucleic-acid sequence written as rows of base letters';
}

const TRACE_PATTERN = ['a solid line', 'a dashed line', 'a dash-dot line', 'a dotted line'];

function chromatogramText(m: ChromatogramModel, printed: string[], out: string[]): string {
  out.push(`A sequencing read-out: ${m.seq.length} peaks along a baseline, read left to right${m.direction ? ' (the left end is labelled "5′", the right end "3′", with an arrow labelled "direction of the read")' : ''}.`);
  out.push(`A key under the plot names the four traces: ${TRACE_BASES.map((b, k) => `"${b}" is ${TRACE_PATTERN[k]} with ${TRACE_SHAPE_WORDS[k]} on each peak top`).join('; ')}.`);
  for (const b of TRACE_BASES) printed.push(`key entry: "${b}"`);
  if (m.direction) printed.push('end label: "5′"', 'end label: "3′"', 'label: "direction of the read"');
  if (m.positions) {
    const at = [...m.seq].map((_, i) => i + 1).filter((n) => n === 1 || n % 5 === 0);
    out.push(`Peaks are numbered under the baseline at ${at.join(', ')}.`);
    for (const n of at) printed.push(`position number: "${n}"`);
  }
  const callOf = (i: number): string => (m.blank.includes(i) ? `; over it ${BLANK}` : m.calls === 'all' ? `; the letter "${m.seq[i]}" is printed over it` : '');
  out.push('The peaks, left to right, by the trace each belongs to:');
  [...m.seq].forEach((b, i) => out.push(`  peak ${i + 1}: the "${b}" trace${callOf(i)}`));
  if (m.calls === 'none' && m.blank.length === 0) out.push('No letter is printed over any peak.');
  return 'a DNA sequencing read-out (a chromatogram)';
}

// ── checkers ────────────────────────────────────────────────────────────────

const MUTATION_EFFECTS = 'silent | missense | nonsense | frameshift | in-frame insertion | in-frame deletion';

const CHECKERS: Record<string, Batch4CheckerDef> = {
  seq_complement: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), as?: DNA | RNA (the row\'s own kind), written: aligned | 5to3 }',
    returns: 'the complementary strand of a row: "aligned" = base under base, left to right as the row is drawn; "5to3" = written from its own 5′ end (the reverse of that when the row runs 5′ → 3′ left to right)',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      const five = fiveToThree(row, 'seq_complement');
      const rna = pick(a, 'as', ['DNA', 'RNA'] as const, row.type === 'RNA' ? 'RNA' : 'DNA') === 'RNA';
      const written = pick(a, 'written', ['aligned', '5to3'] as const);
      const comp5 = reverse(complementOf(five, rna)); // the complement, 5′ → 3′
      const leftToRight = row.fivePrime === 'right' ? comp5 : reverse(comp5);
      return text(written === '5to3' ? comp5 : leftToRight);
    },
  },
  seq_transcribe: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), strand: coding | template }',
    returns: 'the mRNA made from a DNA row, written 5′ → 3′ — the coding strand with U for T, or the reverse complement of the template strand',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      if (row.type === 'RNA') return fail('seq_transcribe: the row is RNA (it has U) — transcription starts from DNA');
      const strand = pick(a, 'strand', ['coding', 'template'] as const);
      return text(mrnaOf(row, { strand }, 'seq_transcribe'));
    },
  },
  seq_translate: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), strand?: mrna | coding | template (needed for a DNA row), start?: position in the mRNA 5′ → 3′ (the first AUG), want?: chain | length | amino_acid (chain), codon?: n (with amino_acid: the n-th codon of the frame, from 1) }',
    returns: 'the polypeptide by the standard genetic code, three-letter names joined by hyphens, up to the first stop codon ("Met-Phe-Gly"); or its length (amino acids before the stop); or the amino acid of one codon ("Stop" for a stop codon)',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      const mrna = mrnaOf(row, a, 'seq_translate');
      const start = frameStart(mrna, a, 'seq_translate');
      const want = pick(a, 'want', ['chain', 'length', 'amino_acid'] as const, 'chain');
      if (want === 'amino_acid') {
        const all = codonsFrom(mrna, start);
        const k = a.codon;
        if (!isNum(k) || !Number.isInteger(k) || k < 1 || k > all.length) return fail(`derivation argument "codon" must be a whole number from 1 to ${all.length} (the complete codons of the frame)`);
        return label(aminoAcidOf(all[k - 1]));
      }
      const { chain } = translate(mrna, start);
      if (chain.length === 0) return fail('seq_translate: the reading frame begins with a stop codon — no amino acid is coded');
      return want === 'length' ? num(chain.length) : text(chain.join('-'));
    },
  },
  seq_codon: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), strand?: mrna | coding | template (needed for a DNA row), start?: position (the first AUG), want: count | codon | start_position | stop_position, codon?: n (with want: codon) }',
    returns: 'reading-frame facts of the mRNA a row stands for (read 5′ → 3′): the number of complete codons from the frame\'s start to the end of the row; the n-th codon as three letters; the position of the first base of the first AUG; or the position of the first base of the first in-frame stop codon',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      const mrna = mrnaOf(row, a, 'seq_codon');
      const want = pick(a, 'want', ['count', 'codon', 'start_position', 'stop_position'] as const);
      if (want === 'start_position') {
        const at = mrna.indexOf('AUG');
        return at < 0 ? fail('seq_codon: the mRNA has no AUG') : num(at + 1);
      }
      const start = frameStart(mrna, a, 'seq_codon');
      const all = codonsFrom(mrna, start);
      if (want === 'count') return num(all.length);
      if (want === 'stop_position') {
        const k = all.findIndex((c) => aminoAcidOf(c) === 'Stop');
        return k < 0 ? fail('seq_codon: no stop codon lies in the reading frame') : num(start + 3 * k + 1);
      }
      const k = a.codon;
      if (!isNum(k) || !Number.isInteger(k) || k < 1 || k > all.length) return fail(`derivation argument "codon" must be a whole number from 1 to ${all.length} (the complete codons of the frame)`);
      return text(all[k - 1]);
    },
  },
  seq_anticodon: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), strand?: mrna | coding | template (needed for a DNA row), start?: position (the first AUG), codon: n (from 1), written: 3to5 | 5to3 }',
    returns: 'the tRNA anticodon that pairs with the n-th codon of the frame: "3to5" = base under base with the codon (AUG → UAC), "5to3" = from the anticodon\'s own 5′ end (AUG → CAU)',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      const mrna = mrnaOf(row, a, 'seq_anticodon');
      const all = codonsFrom(mrna, frameStart(mrna, a, 'seq_anticodon'));
      const k = a.codon;
      if (!isNum(k) || !Number.isInteger(k) || k < 1 || k > all.length) return fail(`derivation argument "codon" must be a whole number from 1 to ${all.length} (the complete codons of the frame)`);
      if (aminoAcidOf(all[k - 1]) === 'Stop') return fail(`seq_anticodon: codon ${k} (${all[k - 1]}) is a stop codon — no tRNA pairs with it`);
      const aligned = complementOf(all[k - 1], true);
      return text(pick(a, 'written', ['3to5', '5to3'] as const) === '3to5' ? aligned : reverse(aligned));
    },
  },
  seq_mutation: {
    kinds: ['sequence_strip'], args: '{ from?: index (0), to?: index (1), strand?: mrna | coding | template (needed for DNA rows), start?: position (the first AUG of the "from" row), want: kind | effect | old_amino_acid | new_amino_acid | position }',
    returns: `the one change between two rows: its kind (substitution | insertion | deletion); its effect on the protein (${MUTATION_EFFECTS}); for a substitution the amino acid before / after; or the position of the first changed base in the mRNA read 5′ → 3′ — refused unless the rows differ by exactly one substitution or one run of inserted / deleted bases`,
    run: (s, a) => {
      const m = strands(s);
      const from = rowOf(m, { row: a.from ?? 0 }).row;
      const to = rowOf(m, { row: a.to ?? 1 }).row;
      if (from === to) return fail('seq_mutation: "from" and "to" are the same row');
      const x = mrnaOf(from, a, 'seq_mutation');
      const y = mrnaOf(to, a, 'seq_mutation');
      const want = pick(a, 'want', ['kind', 'effect', 'old_amino_acid', 'new_amino_acid', 'position'] as const);
      if (x === y) return fail('seq_mutation: the two rows are the same sequence');
      let pre = 0;
      while (pre < x.length && pre < y.length && x[pre] === y[pre]) pre++;
      if (x.length === y.length) {
        const diff = [...x].map((ch, i) => (ch === y[i] ? -1 : i)).filter((i) => i >= 0);
        if (diff.length !== 1) return fail(`seq_mutation: the rows differ at ${diff.length} positions (${diff.map((i) => i + 1).join(', ')}) — not one substitution`);
        if (want === 'kind') return label('substitution');
        if (want === 'position') return num(diff[0] + 1);
        const start = frameStart(x, a, 'seq_mutation');
        if (diff[0] < start) return fail('seq_mutation: the changed base lies before the start of the reading frame — its effect on the protein is not settled by the sequence');
        const k = Math.floor((diff[0] - start) / 3);
        const at = start + 3 * k;
        if (at + 3 > x.length) return fail('seq_mutation: the changed base lies in an incomplete codon at the end of the row');
        const stopBefore = codonsFrom(x, start).slice(0, k).some((c) => aminoAcidOf(c) === 'Stop');
        if (stopBefore) return fail('seq_mutation: the changed base lies after a stop codon of the reading frame — it is not translated');
        const before = aminoAcidOf(x.slice(at, at + 3));
        const after = aminoAcidOf(y.slice(at, at + 3));
        if (want === 'old_amino_acid') return label(before);
        if (want === 'new_amino_acid') return label(after);
        if (before === after) return label('silent');
        if (after === 'Stop') return label('nonsense');
        if (before === 'Stop') return fail('seq_mutation: the substitution removes a stop codon — none of silent, missense, nonsense names it');
        return label('missense');
      }
      const [longer, shorter] = x.length > y.length ? [x, y] : [y, x];
      const d = longer.length - shorter.length;
      let suf = 0;
      while (suf < shorter.length - pre && longer[longer.length - 1 - suf] === shorter[shorter.length - 1 - suf]) suf++;
      if (pre + suf < shorter.length) return fail('seq_mutation: the rows do not differ by one run of inserted or deleted bases');
      const kind = y.length > x.length ? 'insertion' : 'deletion';
      if (want === 'kind') return label(kind);
      if (want === 'position') return num(pre + 1);
      if (want !== 'effect') return fail(`seq_mutation: "${want}" is for a substitution — the rows differ by ${kind === 'insertion' ? 'an' : 'a'} ${kind} of ${plural(d, 'base')}`);
      return label(d % 3 === 0 ? `in-frame ${kind}` : 'frameshift');
    },
  },
  seq_base_count: {
    kinds: ['sequence_strip'], args: '{ row?: index (0), want: A | C | G | T | U | GC | AT | length | gc_percent | hydrogen_bonds }',
    returns: 'a count over one row (gaps left out): one base; G + C; A + T (or A + U); the number of bases; the G + C content in percent; or the hydrogen bonds it makes with its complementary strand (2 per A·T pair, 3 per G·C pair)',
    run: (s, a) => {
      const { row } = rowOf(strands(s), a);
      const seq = fiveToThree(row, 'seq_base_count');
      const want = pick(a, 'want', ['A', 'C', 'G', 'T', 'U', 'GC', 'AT', 'length', 'gc_percent', 'hydrogen_bonds'] as const);
      const n = (set: string): number => [...seq].filter((ch) => set.includes(ch)).length;
      if (want === 'T' && row.type === 'RNA') return fail('seq_base_count: the row is RNA — it has no T');
      if (want === 'U' && row.type === 'DNA') return fail('seq_base_count: the row is DNA — it has no U');
      if (want === 'length') return num(seq.length);
      if (want === 'GC') return num(n('GC'));
      if (want === 'AT') return num(n('ATU'));
      if (want === 'gc_percent') return measured((100 * n('GC')) / seq.length);
      if (want === 'hydrogen_bonds') return num(2 * n('ATU') + 3 * n('GC'));
      return num(n(want));
    },
  },
  chromatogram_read: {
    kinds: ['sequence_strip'], args: '{ written?: as_read | complement_5to3 (as_read), from?: position (1), to?: position (the last) }',
    returns: 'the sequence a read-out shows, peak by peak from the left (5′ → 3′) — or the complementary strand written from its own 5′ end',
    run: (s, a) => {
      const m = read(s);
      const from = a.from === undefined ? 1 : a.from;
      const to = a.to === undefined ? m.seq.length : a.to;
      if (!isNum(from) || !isNum(to) || !Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to > m.seq.length || to < from) return fail(`derivation arguments "from" and "to" must be peak numbers from 1 to ${m.seq.length}, from ≤ to`);
      const part = m.seq.slice(from - 1, to);
      return text(pick(a, 'written', ['as_read', 'complement_5to3'] as const, 'as_read') === 'as_read' ? part : reverse(complementOf(part, false)));
    },
  },
  chromatogram_base: {
    kinds: ['sequence_strip'], args: '{ position: n (from 1) } | { base: A | C | G | T }',
    returns: 'the base of the n-th peak from the left — or, given a base, how many peaks its trace has',
    run: (s, a) => {
      const m = read(s);
      if (a.base !== undefined) {
        const b = pick(a, 'base', TRACE_BASES);
        return num([...m.seq].filter((ch) => ch === b).length);
      }
      const k = a.position;
      if (!isNum(k) || !Number.isInteger(k) || k < 1 || k > m.seq.length) return fail(`derivation argument "position" must be a peak number from 1 to ${m.seq.length}`);
      return label(m.seq[k - 1]);
    },
  },
};

export const PART: Batch4Part = {
  kinds: ['sequence_strip'],
  describe: (spec, printed, out) => {
    if (spec.type !== 'sequence_strip') return '';
    const m = modelOf(spec, sequenceModel);
    return m.variant === 'chromatogram' ? chromatogramText(m, printed, out) : strandsText(m, printed, out);
  },
  checkers: CHECKERS,
};
