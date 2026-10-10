/**
 * Batch-5 fixtures, part "table" (data_table) — see
 * practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'table-simple-two-way',
    note: 'simple: a two-way frequency table — row names, a spanning heading over the two data columns, a totals row and a totals column',
    question: 'The table shows how the students of two grades travel to school. A student is chosen at random from those who walk. What is the probability that the student is in Grade 9?',
    alt: 'A two-way frequency table: rows for Grade 9, Grade 10 and the total; columns for walking, taking the bus and the total.',
    spec: {
      type: 'data_table',
      params: {
        columns: ['', 'Walk', 'Bus', 'Total'],
        rows: [['Grade 9', 30, 45, 75], ['Grade 10', 20, 55, 75], ['Total', 50, 100, 150]],
        rowHeaders: true, totalsRow: true, totalsColumn: true, columnGroup: 'Travel to school',
      },
    },
  },
  {
    id: 'table-dense-kinetics-six-by-eight',
    note: 'dense: 6 columns × 8 rows at the smallest type (10.4 px at 340 px) — time, three concentrations, ln and reciprocal columns, units in the headers',
    question: 'The table shows data for the decomposition 2 N₂O₅ → 4 NO₂ + O₂. Between t = 0 and t = 20 min, what is the average rate of disappearance of N₂O₅?',
    alt: 'A table of kinetics data with six columns — time, the concentrations of N₂O₅, NO₂ and O₂, the natural logarithm of the concentration of N₂O₅ and its reciprocal — and eight rows, one for each time.',
    spec: {
      type: 'data_table',
      params: {
        title: 'Decomposition of N₂O₅ at 45 °C',
        columns: [{ header: 'Time', unit: 'min' }, { header: '[N₂O₅]', unit: 'mol/L' }, { header: '[NO₂]', unit: 'mol/L' }, { header: '[O₂]', unit: 'mol/L' }, 'ln [N₂O₅]', { header: '1/[N₂O₅]', unit: 'L/mol' }],
        rows: [
          [0, '0.0100', '0.0000', '0.0000', '−4.605', '100.0'],
          [10, '0.0071', '0.0058', '0.0015', '−4.948', '140.8'],
          [20, '0.0050', '0.0100', '0.0025', '−5.298', '200.0'],
          [30, '0.0035', '0.0130', '0.0033', '−5.655', '285.7'],
          [40, '0.0025', '0.0150', '0.0038', '−5.991', '400.0'],
          [50, '0.0018', '0.0164', '0.0041', '−6.320', '555.6'],
          [60, '0.0013', '0.0174', '0.0044', '−6.645', '769.2'],
          [70, '0.0009', '0.0182', '0.0046', '−7.013', '1111'],
        ],
      },
    },
  },
  {
    id: 'table-blank-two-way-missing-cell',
    note: 'a "?" cell in a two-way table with totals — the missing count is found from its row total or its column total',
    question: 'The table shows the results of a survey of 200 people about a new park. How many of the people under 40 are against the park?',
    alt: 'A two-way frequency table of opinion by age group with a totals row and a totals column; one cell is left out and marked with a boxed question mark.',
    spec: {
      type: 'data_table',
      params: {
        columns: ['Age group', 'In favour', 'Against', 'No opinion', 'Total'],
        rows: [['Under 40', 62, '?', 8, 90], ['40 and over', 48, 50, 12, 110], ['Total', 110, 70, 20, 200]],
        rowHeaders: true, totalsRow: true, totalsColumn: true,
      },
    },
  },
  {
    id: 'table-initial-rates',
    note: 'a rate table for the method of initial rates: four experiments, two concentrations, rates in scientific notation',
    question: 'The table shows initial-rate data for the reaction 2 NO + O₂ → 2 NO₂. What is the order of the reaction with respect to NO?',
    alt: 'A table of four experiments giving the starting concentrations of NO and of O₂ and the initial rate of the reaction in each.',
    spec: {
      type: 'data_table',
      params: {
        columns: ['Experiment', { header: '[NO]', unit: 'M' }, { header: '[O₂]', unit: 'M' }, { header: 'Initial rate', unit: 'M/s' }],
        rows: [[1, '0.010', '0.010', '2.5 × 10⁻⁵'], [2, '0.020', '0.010', '1.0 × 10⁻⁴'], [3, '0.010', '0.020', '5.0 × 10⁻⁵'], [4, '0.020', '0.020', '2.0 × 10⁻⁴']],
      },
    },
  },
  {
    id: 'table-values-blank-function',
    note: 'a table of values of two functions with a "?" in each — equal steps of x, one linear and one exponential',
    question: 'The table shows values of the functions f and g. The function g is exponential. What is the value of g(4)?',
    alt: 'A table of values with columns for x, f(x) and g(x) and six rows; one value of f and one value of g are left out and marked with boxed question marks.',
    spec: {
      type: 'data_table',
      params: {
        columns: ['x', 'f(x)', 'g(x)'],
        rows: [[0, 5, 3], [1, 8, 6], [2, 11, 12], [3, '?', 24], [4, 17, '?'], [5, 20, 96]],
      },
    },
  },
  {
    id: 'table-long-headers-wrapped',
    note: 'long headers that wrap onto two lines, a text column and negative numbers — a table of standard enthalpies',
    question: 'The table gives the standard enthalpy of formation of four substances. Which substance releases the most energy per mole when it forms from its elements?',
    alt: 'A table of four substances with their physical states and standard enthalpies of formation in kilojoules per mole.',
    spec: {
      type: 'data_table',
      params: {
        columns: ['Substance', 'State at 25 °C', { header: 'Standard enthalpy of formation', unit: 'kJ/mol' }],
        rows: [['CO₂', 'gas', -393.5], ['H₂O', 'liquid', -285.8], ['CH₄', 'gas', -74.8], ['NO₂', 'gas', 33.2]],
        rowHeaders: true,
      },
    },
  },
];
