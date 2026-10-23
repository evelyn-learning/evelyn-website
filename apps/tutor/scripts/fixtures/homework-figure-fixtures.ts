/**
 * Shared fixtures for the homework figure vocabulary tests: problem texts in
 * the photo read's own style (a sentence of the sheet, then the bracketed
 * `[Figure: …]` description) and a good proposal for each, built from the
 * numbers the text states. Each kind task appends its own. Pure data.
 *
 * Every proposal is a fresh object (a function), so a test may mutate it.
 */

import type { FigureCommand } from '../../src/lib/tutor/homework-build/types';

export type Fig = FigureCommand;

// ---------------------------------------------------------------- stats (Task 4)

export const BOX = 'The box plot shows the minutes students spent on homework. Find the interquartile range. [Figure: A box plot titled "Homework Minutes" above a number line from 0 to 60 marked every 10. The left whisker starts at 12, the box runs from 20 to 41 with the median line at 30, and the right whisker ends at 55.]';
export const HIST = '[Figure: A histogram of "Test Scores". Bars: 50–60 has height 3, 60–70 has 7, 70–80 has 12, 80–90 has 11, 90–100 has 7. The vertical axis is labelled Frequency.]';
export const DOT = '[Figure: A dot plot of "Pets per household": two dots at 0, four dots at 1, three dots at 2, one dot at 4.]';
export const BAR = '[Figure: A bar graph "Favorite Fruit": Apple 8, Banana 5, Cherry 3.]';
export const PIE = '[Figure: A pie chart of 40 votes: Red 10, Blue 18, Green 12.]';

/**
 * hw-11 problem 6, verbatim as stored (homeworkbuilds gen-2eecf977-…, read
 * read-only over the tunnel 2026-10-22). The read writes the five numbers in
 * prose; IQR (16) and range (38) are the answers and are not in it.
 */
export const HW11_P6 = 'The box plot shows quiz scores for a class. [Figure: box plot titled "Quiz Scores" above a number line from 0 to 50, labelled every 5 with minor ticks every 1. The left whisker end is at 8, the box runs from 17 to 33 with the median line at 24, and the right whisker end is at 46.]\n(a) Find the median and the IQR.\n(b) Find the range.\n(c) Is the maximum an outlier? Justify using the 1.5 × IQR rule.';

export const boxFig = () => ({
  action: 'showStats', type: 'boxplot', title: 'Homework Minutes',
  boxplot: { datasets: [{ label: '', min: 12, q1: 20, median: 30, q3: 41, max: 55 }] },
}) as unknown as Fig;

export const hw11p6Fig = () => ({
  action: 'showStats', type: 'boxplot', title: 'Quiz Scores',
  boxplot: { datasets: [{ label: '', min: 8, q1: 17, median: 24, q3: 33, max: 46 }] },
}) as unknown as Fig;

export const histFig = () => ({
  action: 'showStats', type: 'histogram', title: 'Test Scores', yLabel: 'Frequency',
  bins: [[50, 60, 3], [60, 70, 7], [70, 80, 12], [80, 90, 11], [90, 100, 7]],
}) as unknown as Fig;

export const dotFig = () => ({
  action: 'showStats', type: 'dotplot', title: 'Pets per household',
  data: [0, 0, 1, 1, 1, 1, 2, 2, 2, 4],
}) as unknown as Fig;

export const barFig = () => ({
  action: 'showStats', type: 'bar', title: 'Favorite Fruit',
  bar: { categories: ['Apple', 'Banana', 'Cherry'], values: [8, 5, 3] },
}) as unknown as Fig;

export const pieFig = () => ({
  action: 'showStats', type: 'pie',
  pie: { slices: [{ label: 'Red', value: 10 }, { label: 'Blue', value: 18 }, { label: 'Green', value: 12 }] },
}) as unknown as Fig;

// ---------------------------------------------------------------- table and number line (Task 5)

export const TABLE = '[Figure: A frequency table with columns "Score" and "Frequency": 1 – 4, 2 – 6, 3 – 5, 4 – 2.]';
export const NL = 'Write the inequality shown. [Figure: A number line from −5 to 5 marked every 1. An open circle at −2 with an arrow shading to the right.]';

export const tableFig = () => ({
  action: 'showTable', headers: ['Score', 'Frequency'],
  rows: [['1', '4'], ['2', '6'], ['3', '5'], ['4', '2']],
}) as unknown as Fig;

export const nlFig = () => ({
  action: 'showNumberLine', min: -5, max: 5, step: 1,
  intervals: [{ from: -2, to: 5, fromInclusive: false }],
  points: [{ value: -2, style: 'open' }],
}) as unknown as Fig;

// ---------------------------------------------------------------- scatter plot (Task 6)

export const SCAT = '[Figure: A scatter plot of hours studied (x) and score (y) with points (1, 62), (2, 70), (3, 75), (4, 83), (5, 88).]';

export const scatFig = () => ({
  action: 'showScatterPlot', xLabel: 'x', yLabel: 'y',
  points: [{ x: 1, y: 62 }, { x: 2, y: 70 }, { x: 3, y: 75 }, { x: 4, y: 83 }, { x: 5, y: 88 }],
}) as unknown as Fig;

// ---------------------------------------------------------------- 3D solid (Task 7)

export const CONE = 'Find the volume of the cone. Leave your answer in terms of π. [Figure: A cone with a radius of 4 cm drawn from the centre of the base to its edge and a height of 9 cm drawn as a dashed line from the apex to the centre of the base.]';
export const SLANT = '[Figure: A cone with radius 3 and slant height 5.]';

/**
 * hw-9/10 problem 4 (the cone). NOT the stored text: the read-only tunnel
 * read was refused by the session's permission layer on 2026-10-22, so this
 * is hand-written in the photo read's style (sheet sentence, then the
 * bracketed description, then the parts). Answers (V = 100π cm³, slant
 * height 13 cm) are not in it.
 */
export const HW910_P4 = 'A cone has a radius of 5 cm and a height of 12 cm. [Figure: a cone with its radius of 5 cm drawn from the centre of the base to its edge and its height of 12 cm drawn as a dashed line from the apex to the centre of the base.]\n(a) Find the volume of the cone. Leave your answer in terms of π.\n(b) Find the slant height of the cone.';

export const coneFig = () => ({
  action: 'showDiagram', type: 'solid_3d', params: { shape: 'cone', dims: { radius: 4, height: 9 } },
}) as unknown as Fig;

export const hw910p4Fig = () => ({
  action: 'showDiagram', type: 'solid_3d', params: { shape: 'cone', dims: { radius: 5, height: 12 } },
}) as unknown as Fig;

// ---------------------------------------------------------------- Venn and tree diagrams (Task 14)

export const VENN = '[Figure: A Venn diagram of 30 students with circles "Soccer" and "Band": 8 in Soccer only, 5 in both, 10 in Band only, 7 outside both circles.]';
export const VENN3 = '[Figure: A Venn diagram with three circles "Math", "Art" and "Music": 4 in Math only, 6 in Art only, 3 in Music only, 2 in Math and Art only, 1 in all three, 9 outside.]';
export const TREE = '[Figure: A tree diagram. First branch: Red 2/5, Blue 3/5. After Red: Red 1/4, Blue 3/4. After Blue: Red 2/4, Blue 2/4.]';

export const vennFig = () => ({
  action: 'showVennDiagram',
  sets: [{ label: 'Soccer' }, { label: 'Band' }],
  regions: { onlyA: { value: '8' }, intersection: { value: '5' }, onlyB: { value: '10' }, neither: { value: '7' } },
}) as unknown as Fig;

export const venn3Fig = () => ({
  action: 'showVennDiagram',
  sets: [{ label: 'Math' }, { label: 'Art' }, { label: 'Music' }],
  regions: { onlyA: { value: '4' }, onlyB: { value: '6' }, onlyC: { value: '3' }, AB: { value: '2' }, ABC: { value: '1' }, neither: { value: '9' } },
}) as unknown as Fig;

/** Outcomes in the node boxes, the stated probability on each branch; the root box is blank (the sheet names no root). */
export const treeFig = () => ({
  action: 'showTree', type: 'probability',
  root: {
    label: '',
    children: [
      { label: '', probability: '2/5', node: { label: 'Red', children: [
        { label: '', probability: '1/4', node: { label: 'Red' } },
        { label: '', probability: '3/4', node: { label: 'Blue' } },
      ] } },
      { label: '', probability: '3/5', node: { label: 'Blue', children: [
        { label: '', probability: '2/4', node: { label: 'Red' } },
        { label: '', probability: '2/4', node: { label: 'Blue' } },
      ] } },
    ],
  },
}) as unknown as Fig;

// ---------------------------------------------------------------- fraction bar, tape diagram, area model (Task 15)

export const FRAC = '[Figure: Two fraction bars: the top shows 3/4 shaded, the bottom shows 2/3 shaded.]';
export const TAPE = '[Figure: A tape diagram split into 3 equal parts labelled x, with a total of 24 marked above.]';
export const AREA = '[Figure: An area model for 23 × 14 with the rows split 20 and 3 and the columns split 10 and 4.]';

export const fracFig = () => ({
  action: 'showFractionBar', layout: 'vertical',
  items: [{ numerator: 3, denominator: 4 }, { numerator: 2, denominator: 3 }],
}) as unknown as Fig;

/** Three unknown parts labelled x (their lengths are proportions, not printed); the stated total on the brace. */
export const tapeFig = () => ({
  action: 'showDiagram', type: 'tape_diagram',
  params: { bars: [{ segments: [1, 2, 3].map(() => ({ length: 1, label: 'x', unknown: true })), totalLabel: '24' }] },
}) as unknown as Fig;

/** The split sides only: the partial products are what the student finds, so showProducts is false. */
export const areaFig = () => ({
  action: 'showDiagram', type: 'area_model',
  params: { rows: [20, 3], cols: [10, 4], showProducts: false },
}) as unknown as Fig;
