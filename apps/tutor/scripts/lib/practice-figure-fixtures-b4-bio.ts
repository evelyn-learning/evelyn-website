/**
 * Batch-4 fixtures, part "bio" — see practice-figure-fixtures-batch4.ts for the conventions.
 * sequence_strip: the `strands` variant (seq-strands-…) and the `chromatogram` variant (seq-chromatogram-…).
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  // --- sequence_strip · strands ---------------------------------------------
  {
    id: 'seq-strands-simple-template',
    note: 'simple: one DNA strand with its ends labelled — nothing else',
    question: 'The template strand of a short stretch of DNA is shown. Write the mRNA transcribed from it, from its 5′ end to its 3′ end.',
    alt: 'One strand of DNA written as a row of base letters, named template, with its two ends labelled.',
    spec: { type: 'sequence_strip', params: { rows: [{ seq: 'TACGGCATTAGC', name: 'template', fivePrime: 'right' }] } },
  },
  {
    id: 'seq-strands-dense-gene-to-protein',
    note: 'dense: a double-stranded stretch with base-pair ticks, the mRNA under it in bracketed codons with amino acids, position numbers — thirty bases over two lines',
    question: 'The figure shows part of a gene, the mRNA made from it and the start of the polypeptide. Which strand of the DNA was the template for this mRNA?',
    alt: 'Two paired strands of DNA with ticks between their bases, and under them a strand of mRNA whose bases are bracketed in threes with an amino acid named under each bracket. The rows wrap over two lines and positions are numbered.',
    spec: {
      type: 'sequence_strip',
      params: {
        rows: [
          { seq: 'ATGGCTGAAGTTCACCTGACTCCTGAGTAA', name: 'strand 1' },
          { seq: 'TACCGACTTCAAGTGGACTGAGGACTCATT', name: 'strand 2' },
          { seq: 'AUGGCUGAAGUUCACCUGACUCCUGAGUAA', name: 'mRNA' },
        ],
        pairTicks: true, codons: { row: 2 }, numberEvery: 5,
        aminoAcids: ['Met', 'Ala', 'Glu', 'Val', 'His', 'Leu', 'Thr', 'Pro', 'Glu', 'Stop'],
      },
    },
  },
  {
    id: 'seq-strands-blank-codon-table',
    note: 'an mRNA in codons with one amino acid a "?" box, and one base of the DNA above it a "?"',
    question: 'An mRNA and the amino acids it codes for are shown. Use a codon table to name the amino acid marked with the question mark.',
    alt: 'A strand of DNA with one base left blank, and under it a strand of mRNA whose bases are bracketed in threes; an amino acid is named under each bracket but one, which is left blank.',
    spec: {
      type: 'sequence_strip',
      params: {
        rows: [{ seq: 'TACAAACT?CCGATT', name: 'template', fivePrime: 'right' }, { seq: 'AUGUUUGAAGGCUAA', name: 'mRNA' }],
        codons: { row: 1 }, aminoAcids: ['Met', 'Phe', '?', 'Gly', 'Stop'],
      },
    },
  },
  {
    id: 'seq-strands-mutation-boxed',
    note: 'wild type over mutant: the changed base boxed in both rows (a box, not a colour), codons bracketed under the mutant',
    question: 'The mRNA of a normal allele and of a mutant allele are shown, with the changed base boxed. What kind of mutation is this?',
    alt: 'Two strands of mRNA, one named normal and one named mutant, written one over the other; one base is boxed in each, and the bases of the lower strand are bracketed in threes.',
    spec: {
      type: 'sequence_strip',
      params: {
        rows: [{ seq: 'AUGGUGCACCUGACUCCUGAGGAG', name: 'normal' }, { seq: 'AUGGUGCACCUGACUCCUGUGGAG', name: 'mutant' }],
        codons: { row: 1 }, highlight: [{ row: 0, pos: 20 }, { row: 1, pos: 20 }],
      },
    },
  },
  {
    id: 'seq-strands-deletion-gap',
    note: 'a deleted base drawn as a gap dash in the mutant row; no names of ends, no codons — the frame is the question',
    question: 'A stretch of a coding sequence is shown before and after a mutation. How many bases were deleted, and does the deletion shift the reading frame?',
    alt: 'Two strands of DNA written one over the other, named before and after; in the lower one, one position holds a dash where a base is missing.',
    spec: { type: 'sequence_strip', params: { rows: [{ seq: 'ATGCCGTTAGGACAT', name: 'before', fivePrime: 'none' }, { seq: 'ATGCC-TTAGGACAT', name: 'after', fivePrime: 'none' }], highlight: [{ row: 1, pos: 6 }] } },
  },
  // --- sequence_strip · chromatogram ----------------------------------------
  {
    id: 'seq-chromatogram-simple-called',
    note: 'simple: eight peaks, every base called over its peak',
    question: 'A sequencing read-out of a short stretch of DNA is shown. What is the sequence of the complementary strand, written 5′ to 3′?',
    alt: 'A sequencing read-out: a row of peaks along a baseline, each with a base letter over it, in four stroke patterns with a marker on each peak top; a key under the plot names the four traces.',
    spec: { type: 'sequence_strip', params: { variant: 'chromatogram', seq: 'GATTCAGC' } },
  },
  {
    id: 'seq-chromatogram-dense-uncalled',
    note: 'dense: sixteen peaks and no base calls — the read is the question',
    question: 'The read-out of a Sanger sequencing run is shown. Read the sequence of the DNA from its 5′ end.',
    alt: 'A sequencing read-out: a row of peaks of differing heights along a numbered baseline, in four stroke patterns with a marker on each peak top; a key under the plot names the four traces. No base letters are printed over the peaks.',
    spec: { type: 'sequence_strip', params: { variant: 'chromatogram', seq: 'ATGGCCTTAGCAGTCA', calls: 'none' } },
  },
  {
    id: 'seq-chromatogram-blank-two-calls',
    note: 'ten peaks called except two, whose calls are "?" boxes',
    question: 'In the sequencing read-out shown, two base calls are missing. Which bases belong in the two boxes, from left to right?',
    alt: 'A sequencing read-out: a row of peaks along a numbered baseline, most with a base letter over them and two with a boxed question mark; four stroke patterns with a marker on each peak top are named in a key.',
    spec: { type: 'sequence_strip', params: { variant: 'chromatogram', seq: 'CTGAAGTCCA', blank: [4, 8] } },
  },
  {
    id: 'seq-chromatogram-twenty-warns',
    note: 'twenty peaks, the most that are drawn — warns that the stroke patterns crowd (the markers still tell the traces apart)',
    question: 'The read-out of a sequencing run is shown. Which base is at position 12?',
    alt: 'A sequencing read-out: a long row of narrow peaks along a numbered baseline, in four stroke patterns with a marker on each peak top; a key under the plot names the four traces.',
    spec: { type: 'sequence_strip', params: { variant: 'chromatogram', seq: 'GGATCCATGCTAGCTTAACG', calls: 'none', direction: false } },
  },
];
