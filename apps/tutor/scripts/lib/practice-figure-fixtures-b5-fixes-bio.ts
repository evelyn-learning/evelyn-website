/**
 * Batch-5 fixtures, part "fixes-bio" (fixes e, i) — see
 * practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const lewis = (label: string, nLp: number, nc: number, co: number, oLp: number): Record<string, unknown> => ({
  atoms: [{ id: 'N', el: 'N', lonePairs: nLp }, { id: 'C', el: 'C', lonePairs: 0 }, { id: 'O', el: 'O', lonePairs: oLp }],
  bonds: [{ a: 'N', b: 'C', order: nc }, { a: 'C', b: 'O', order: co }],
  layout: { type: 'linear', center: 'C', around: ['N', 'O'] }, center: 'C', label,
});

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix5-e-compartments-mito-label-and-ph',
    note: 'e: a mitochondrion whose intermembrane space carries a name AND a pH — the pH used to be printed a line lower, across the inner membrane; it now stands beside the name, inside the space',
    question: 'The figure shows the pH of two compartments of a mitochondrion. In which direction do H⁺ ions move through ATP synthase?',
    alt: 'A mitochondrion drawn as two nested boxes, each space labelled with its name and its pH, with an ATP synthase in the inner membrane.',
    spec: { type: 'bio_schematic', params: { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', pH: 6.8 }, { id: 'matrix', pH: 7.8 }], synthase: true } },
  },
  {
    id: 'fix5-e-compartments-mito-letter-and-ph',
    note: 'e: the same with lettered spaces (P, Q) — a short name and its pH on one line in the narrow outer space',
    question: 'Spaces P and Q of a mitochondrion have the pH values shown. Which space is the matrix?',
    alt: 'A mitochondrion drawn as two nested boxes. The outer space and the inner space carry a letter and a pH each.',
    spec: { type: 'bio_schematic', params: { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: 'P', pH: 7 }, { id: 'matrix', label: 'Q', pH: 8 }], synthase: true, showFlow: true } },
  },
  {
    id: 'fix5-i-molecule-roman-captions',
    note: 'i: three Lewis structures captioned I, II, III — a lone Roman "I" read as a tick mark; Roman-numeral captions now stand on label plates, as under the cells of a division figure',
    question: 'Three candidate Lewis structures for the cyanate ion, OCN⁻, are shown without their formal charges. Which structure contributes most to the real ion?',
    alt: 'Three Lewis structures of an ion made of nitrogen, carbon and oxygen in a row, differing in their bond orders and lone pairs, captioned with the Roman numerals one to three.',
    spec: { type: 'molecular_structure', params: { molecules: [lewis('I', 1, 3, 1, 3), lewis('II', 2, 2, 2, 2), lewis('III', 3, 1, 3, 1)], showFormalCharges: false } },
  },
];
