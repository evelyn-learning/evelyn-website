/**
 * Batch-5 fixtures, part "bio" (replication_fork, operon_map, cell_cycle_wheel) — see
 * practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  // --- replication_fork ------------------------------------------------------
  {
    id: 'fork-simple-lettered-strands',
    note: 'simple: the fork with the 5′ / 3′ ends of the parental strands, the two new strands lettered X and Y — nothing named',
    question: 'The figure shows a replication fork. Which new strand, X or Y, is the lagging strand?',
    alt: 'A DNA replication fork: the two parental strands part at the fork, their ends labelled 5 prime and 3 prime. One new strand is a single long arrow pointing toward the fork; the other is three short arrows pointing away from it. The two new strands carry letters.',
    spec: { type: 'replication_fork', params: { strandLabels: { leading: 'X', lagging: 'Y' } } },
  },
  {
    id: 'fork-dense-numbered-enzymes',
    note: 'dense: four enzyme markers numbered 1–4 (wedge, disc, square, diamond), primers with their key, named strands, a lettered Okazaki fragment, every end printed',
    question: 'In the replication fork shown, which numbered enzyme joins the fragments of the lagging strand?',
    alt: 'A DNA replication fork with every strand end labelled 5 prime or 3 prime. The leading and lagging strands are named, the lagging strand is in three fragments and one fragment carries a letter. Four enzyme markers of different shapes are numbered, and thick blocks mark the RNA primers.',
    spec: { type: 'replication_fork', params: { newEnds: 'value', strandLabels: { leading: 'leading strand', lagging: 'lagging strand' }, fragmentLabel: 'Z', primers: true, enzymes: [{ type: 'helicase', label: '1' }, { type: 'polymerase', label: '2' }, { type: 'primase', label: '3' }, { type: 'ligase', label: '4' }] } },
  },
  {
    id: 'fork-blank-template-end',
    note: 'a "?" on the open end of the lagging-strand template; the fork runs to the LEFT with the leading strand on the lower arm; enzymes named',
    question: 'In the replication fork shown, what belongs at the strand end marked "?": 5′ or 3′?',
    alt: 'A DNA replication fork opening to the right, with the leading strand on the lower arm. Helicase and DNA polymerase are named. Three ends of the parental strands are labelled 5 prime or 3 prime; the fourth is marked with a boxed question mark.',
    spec: { type: 'replication_fork', params: { leading: 'bottom', forkDirection: 'left', ends: { template_lagging_open: 'blank' }, enzymes: [{ type: 'helicase' }, { type: 'polymerase' }] } },
  },
  {
    id: 'fork-named-enzymes-fragment',
    note: 'every marker and the fragment NAMED (the longest labels the rows hold): helicase, DNA polymerase, primase, DNA ligase, Okazaki fragment',
    question: 'In the replication fork shown, why is one new strand made as separate fragments?',
    alt: 'A DNA replication fork with helicase, DNA polymerase, primase and DNA ligase named beside their markers and one piece of the discontinuous strand named an Okazaki fragment.',
    spec: { type: 'replication_fork', params: { fragmentLabel: 'Okazaki fragment', enzymes: [{ type: 'helicase' }, { type: 'polymerase' }, { type: 'primase' }, { type: 'ligase' }] } },
  },
  {
    id: 'fork-blank-direction-enzyme',
    note: 'no arrowheads (the direction of synthesis is asked), the new ends printed, a "?" for the name of the wedge at the fork, two fragments',
    question: 'What is the enzyme marked "?" in the figure, which separates the two parental strands?',
    alt: 'A DNA replication fork whose new strands are drawn without arrowheads, one continuous and one in two pieces, with the ends of all strands labelled 5 prime or 3 prime. A wedge at the fork is marked with a boxed question mark.',
    spec: { type: 'replication_fork', params: { arrows: false, fragments: 2, newEnds: 'value', enzymes: [{ type: 'helicase', label: '?' }] } },
  },
  // --- operon_map --------------------------------------------------------------
  {
    id: 'operon-simple-lac-repressed',
    note: 'simple: the lac operon with no lactose — the repressor sits on the operator, the transcription arrow is stopped',
    question: 'The figure shows the lac operon of a bacterium. Why are the genes lacZ, lacY and lacA not being transcribed?',
    alt: 'A strip of boxes along a DNA line: a regulator gene, then a promoter, an operator and three structural genes. A repressor protein sits on the operator and the transcription arrow over the genes is stopped with a cross.',
    spec: { type: 'operon_map', params: { system: 'lac' } },
  },
  {
    id: 'operon-dense-lac-induced-cap',
    note: 'dense: lactose present and glucose absent, with the CAP site — repressor off the operator with allolactose on it, CAP on its site, RNA polymerase on the promoter, the arrow running; conditions printed; a three-entry key',
    question: 'Under the conditions shown, the lac operon is transcribed at a high rate. Which two proteins must be in the places shown for that?',
    alt: 'The lac operon as a strip of boxes: regulator gene, CAP site, promoter, operator and three structural genes, under a line stating the sugars in the medium. The repressor floats above the operator with a small molecule on it, an activator sits on the CAP site, RNA polymerase sits on the promoter and a transcription arrow runs over the genes.',
    spec: { type: 'operon_map', params: { system: 'lac', lactose: true, glucose: false, capSite: true, showConditions: true } },
  },
  {
    id: 'operon-blank-trp-transcription',
    note: 'a "?" in place of the transcription arrow: the trp operon with tryptophan present — the repressor, with tryptophan on it, sits on the operator',
    question: 'The figure shows the trp operon in a cell with plenty of tryptophan. Are the five genes transcribed in the state shown?',
    alt: 'The trp operon as a strip of boxes: a regulator gene, a promoter, an operator and five structural genes. A repressor carrying a small molecule sits on the operator. The place of the transcription arrow is marked with a boxed question mark.',
    spec: { type: 'operon_map', params: { system: 'trp', tryptophan: true, transcription: 'blank' } },
  },
  {
    id: 'operon-lac-low-glucose-present',
    note: 'lactose AND glucose present: the repressor is off, CAP is not on its site — a thin dashed arrow, "low transcription"',
    question: 'In the state shown, lactose and glucose are both present. Why is transcription of the lac genes only weak?',
    alt: 'The lac operon as a strip of boxes with a CAP site. The repressor floats above the operator with a small molecule on it, nothing sits on the CAP site, RNA polymerase is on the promoter and a thin dashed transcription arrow runs over the genes.',
    spec: { type: 'operon_map', params: { system: 'lac', lactose: true, glucose: true, capSite: true } },
  },
  {
    id: 'operon-blank-operator-numbered',
    note: 'the boxes numbered, the operator a "?"; the repressor tag is a letter; no transcription arrow',
    question: 'In the lac operon shown, protein X is bound to the region marked "?". What is that region called?',
    alt: 'An operon as a strip of numbered boxes along a DNA line. A protein with a letter on it sits on one box, which is marked with a boxed question mark.',
    spec: { type: 'operon_map', params: { system: 'lac', transcription: 'none', labels: { promoter: '1', operator: '?', genes: ['2', '3', '4'], repressor: 'X' } } },
  },
  {
    id: 'operon-trp-operator-mutant',
    note: 'a mutation mark under the operator: tryptophan is present but the repressor cannot bind — it floats with tryptophan on it and the genes are transcribed',
    question: 'A mutation has destroyed the function of the region marked ✕ in the trp operon shown. Tryptophan is present. What happens to transcription of the trp genes?',
    alt: 'The trp operon as a strip of boxes with a cross under the operator. A repressor carrying a small molecule floats above the operator, RNA polymerase sits on the promoter and a transcription arrow runs over the five genes.',
    spec: { type: 'operon_map', params: { system: 'trp', tryptophan: true, mutation: 'operator' } },
  },
  // --- cell_cycle_wheel --------------------------------------------------------
  {
    id: 'cycle-simple-four-phases',
    note: 'simple: G1, S, G2 and M as sectors in proportion to an 11 + 8 + 4 + 1 hour cycle, each duration printed outside its sector',
    question: 'The wheel shows the cell cycle of a cultured cell. What fraction of the cycle does the cell spend in S phase?',
    alt: 'A ring divided into four sectors read clockwise from the top, named G1, S, G2 and M, each as wide as its share of the cycle and each with its duration in hours printed beside it. An arrow inside the ring shows the clockwise direction.',
    spec: { type: 'cell_cycle_wheel', params: {} },
  },
  {
    id: 'cycle-dense-checkpoints-interphase',
    note: 'dense: three checkpoints named on the rim (two boundaries and the middle of M), the interphase arc, the cycle length in the hole, durations printed',
    question: 'At which checkpoint shown does the cell verify that every chromosome is attached to the spindle?',
    alt: 'A cell-cycle ring of four sectors named G1, S, G2 and M with their durations in hours. Three triangles on the rim mark named checkpoints, an outer arc spans the three phases of interphase, and the length of one cycle is printed in the middle.',
    spec: { type: 'cell_cycle_wheel', params: { phases: [{ name: 'G1', duration: 9 }, { name: 'S', duration: 7 }, { name: 'G2', duration: 5 }, { name: 'M', duration: 3 }], total: 'value', interphase: true, checkpoints: [{ at: 'G1/S' }, { at: 'G2/M' }, { at: 'M' }] } },
  },
  {
    id: 'cycle-blank-duration-s',
    note: 'a "?" for the duration of S; the other three durations and the cycle length are printed, so it is a subtraction',
    question: 'One full cycle of the cell shown takes 24 hours. How long is S phase, marked "?"?',
    alt: 'A cell-cycle ring of four sectors named G1, S, G2 and M. The durations of three phases are printed in hours and the length of one cycle is printed in the middle; the duration of S is marked with a boxed question mark.',
    spec: { type: 'cell_cycle_wheel', params: { phases: [{ name: 'G1', duration: 10 }, { name: 'S', duration: 8, showDuration: 'blank' }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }], total: 'value' } },
  },
  {
    id: 'cycle-blank-name-equal-not-to-scale',
    note: 'equal sectors, "not to scale" printed; G1 and M named, one sector a "?" and one lettered X; no durations; numbered checkpoints',
    question: 'In the cell cycle shown, during which phase, marked "?", is the DNA replicated?',
    alt: 'A cell-cycle ring of four equal sectors read clockwise, marked not to scale. Two sectors are named G1 and M, one carries a letter and one is marked with a boxed question mark. Two numbered triangles on the rim mark checkpoints.',
    spec: { type: 'cell_cycle_wheel', params: { scale: 'equal', durations: 'none', phases: [{ name: 'G1', duration: 11 }, { name: 'S', duration: 8, label: '?' }, { name: 'G2', duration: 4, label: 'X' }, { name: 'M', duration: 1 }], checkpoints: [{ at: 'G1/S', label: '1' }, { at: 'G2/M', label: '2' }] } },
  },
  {
    id: 'cycle-blank-total-short-m',
    note: 'a fast-dividing cell: a short G1 and a very short M whose name moves outside its sector; a "?" for the cycle length in the hole',
    question: 'How long is one full cycle of the cell shown, marked "?" in the middle of the wheel?',
    alt: 'A cell-cycle ring of four sectors named G1, S, G2 and M with their durations in hours; the M sector is very narrow. The length of one cycle, in the middle, is marked with a boxed question mark.',
    spec: { type: 'cell_cycle_wheel', params: { phases: [{ name: 'G1', duration: 5 }, { name: 'S', duration: 7 }, { name: 'G2', duration: 3 }, { name: 'M', duration: 1 }], total: 'blank' } },
  },
];
