/**
 * Batch-4 fixtures, part "fixes-d" — see practice-figure-fixtures-batch4.ts for the conventions.
 * To-do (b): bio_schematic division — the cells fill the frame, the hollow chromosomes read as
 * hollow, and a Roman-numeral label stands on a label plate.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix4-b-division-single-cell-roman',
    note: 'b: one cell alone (it used to take a third of the canvas, with chromosomes too small to tell filled from hollow) under the lone Roman label "I" (it read as a tick mark)',
    question: 'Cell I of an organism with 2n = 6 is shown during meiosis. How many chromatids does the cell hold?',
    alt: 'One large schematic cell holding stick chromosomes, some filled and some outlined, paired side by side across the middle and joined to the two ends by thin lines. It is labelled with a Roman numeral.',
    spec: { type: 'bio_schematic', params: { variant: 'division', n: 3, cells: [{ stage: 'metaphase_I', label: 'I' }] } },
  },
  {
    id: 'fix4-b-division-roman-pair',
    note: 'b: two cells labelled I and II — telophase I beside prophase I, filled and hollow homologues at full size',
    question: 'Two cells of a meiosis in an organism with 2n = 4 are shown. Which cell is the earlier stage?',
    alt: 'Two schematic cells holding stick chromosomes, some filled and some outlined, each labelled with a Roman numeral: in one the cell is pinched in the middle with a group at each end; in the other the chromosomes lie in pairs inside a dashed circle.',
    spec: { type: 'bio_schematic', params: { variant: 'division', n: 2, cells: [{ stage: 'telophase_I', label: 'I' }, { stage: 'prophase_I', label: 'II' }] } },
  },
];
