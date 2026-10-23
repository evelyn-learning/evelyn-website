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
