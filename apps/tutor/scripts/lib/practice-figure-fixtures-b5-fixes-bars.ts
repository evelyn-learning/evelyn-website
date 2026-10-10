/**
 * Batch-5 fixtures, part "fixes-bars" (fixes b, g) — see
 * practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  // b — a bar left out of a chart with one bar per category; printed values beside a bar left out.
  {
    id: 'fix5-b-bars-plain-blank-bar',
    note: 'b: a chart with ONE bar per category and one bar left out as a "?" (values: [..., null, ...]) — was refused; the checkers now read the bars that are drawn and solve for the one left out from a total',
    question: 'The chart shows the number of books a class borrowed in each of five weeks. The class borrowed 150 books in all. How many books did it borrow in week 4?',
    alt: 'A bar chart of books borrowed in each of five weeks; the bar for week 4 is left out and marked with a boxed question mark.',
    spec: { type: 'bar_chart', params: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], values: [20, 35, 30, null, 25], yMin: 0, yMax: 50, yStep: 10, yLabel: 'Books borrowed' } },
  },
  {
    id: 'fix5-b-bars-values-printed-blank',
    note: 'b: showValues on a grouped chart with a bar left out — every drawn bar carries its value (so they need not sit on gridlines), the hidden one is the "?" box; accepted with bar_missing',
    question: 'A 0.50 kg ball falls with no air resistance. The chart shows its kinetic and gravitational potential energy at three positions. What is its kinetic energy at position 2?',
    alt: 'A grouped bar chart with two bars, kinetic energy and gravitational potential energy, for each of three positions, with the value printed over each bar; the kinetic energy bar at position 2 is left out and marked with a boxed question mark.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Position 1', 'Position 2', 'Position 3'],
        series: [{ label: 'Kinetic energy', values: [6.5, null, 37] }, { label: 'Gravitational potential energy', values: [42.5, 27, 12] }],
        yMin: 0, yMax: 50, yStep: 10, yLabel: 'Energy (J)', showValues: true,
      },
    },
  },
  // g — values read off the lighter gridlines.
  {
    id: 'fix5-g-bars-on-minor-lines',
    note: 'g: three of the four bars end on a LIGHTER gridline (between two numbers) — the grid is drawn one step darker so 30, 50 and 70 can be read; bars on numbered lines only leave it as it was',
    question: 'The chart shows the mass of four samples. What is the mass of sample R?',
    alt: 'A bar chart of the mass in grams of four samples named P to S.',
    spec: { type: 'bar_chart', params: { categories: ['Sample P', 'Sample Q', 'Sample R', 'Sample S'], values: [30, 80, 50, 70], yMin: 0, yMax: 100, yStep: 20, yLabel: 'Mass (g)' } },
  },
  {
    id: 'fix5-g-heating-on-minor-lines',
    note: 'g: plateaus at 10 °C and 90 °C and corners at 5 and 9 kJ sit on lighter gridlines (steps of 20 °C and 2 kJ) — the grid is drawn one step darker',
    question: 'The heating curve of a pure substance is shown. What is the melting point of the substance?',
    alt: 'A heating curve: temperature in degrees Celsius against heat added in kilojoules, rising in three sloped segments separated by two flat segments.',
    spec: { type: 'heating_curve', params: { corners: [[0, -30], [2, 10], [5, 10], [9, 90], [24, 90], [26, 130]], xStep: 2, yStep: 20 } },
  },
  {
    id: 'fix5-g-bars-off-grid-warns',
    note: 'g: warns (off_grid) — on a fixed axis in steps of 10 the bars 37 and 12 end on no gridline (the lines are 5 apart) and can only be estimated',
    question: 'The chart shows the number of red and blue marbles in a bag. About how many more red marbles than blue marbles are there?',
    alt: 'A bar chart with two bars, one for red marbles and one for blue marbles.',
    spec: { type: 'bar_chart', params: { categories: ['Red', 'Blue'], values: [37, 12], yMin: 0, yMax: 40, yStep: 10, yLabel: 'Number of marbles' } },
  },
];
