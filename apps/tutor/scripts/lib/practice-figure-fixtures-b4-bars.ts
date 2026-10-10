/**
 * Batch-4 fixtures, part "bars" — bar_chart with `series` (grouped bars). Conventions:
 * practice-figure-fixtures-batch4.ts.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'bars-grouped-observed-expected',
    note: 'simple: two series (solid, hatched) over four phenotype classes — a chi-square set-up',
    question: 'The chart shows the observed and expected numbers of offspring in each phenotype class of a dihybrid cross. For which class is the difference between observed and expected the greatest?',
    alt: 'A grouped bar chart with two bars, observed and expected, for each of four phenotype classes.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Round yellow', 'Round green', 'Wrinkled yellow', 'Wrinkled green'],
        series: [{ label: 'Observed', values: [80, 40, 30, 10] }, { label: 'Expected', values: [90, 30, 30, 10] }],
        yMin: 0, yMax: 100, yStep: 10, yLabel: 'Number of offspring',
      },
    },
  },
  {
    id: 'bars-grouped-energy-three-states',
    note: 'dense: three series (solid, hatched, outline) over five categories with a negative value — energy bars at three instants',
    question: 'The chart shows the energies of a cart–spring system at three instants. Friction acts between the second and third instants. How much mechanical energy has been lost by the third instant?',
    alt: 'A grouped bar chart with three bars, one for each of three instants, for each of five kinds of energy; one group of bars is below zero.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Kinetic', 'Gravitational', 'Elastic', 'Thermal', 'Total mechanical'],
        series: [{ label: 'Instant I', values: [0, -20, 60, 0, 40] }, { label: 'Instant II', values: [40, -20, 20, 0, 40] }, { label: 'Instant III', values: [20, 0, 10, 10, 30] }],
        yMin: -30, yMax: 70, yStep: 10, yLabel: 'Energy (J)',
      },
    },
  },
  {
    id: 'bars-grouped-blank-allele-frequency',
    note: 'two series with one bar left out as a "?" — the frequency a Hardy–Weinberg question asks for',
    question: 'The chart shows the frequencies of the alleles A and a in a population in two generations. What is the frequency of allele a in generation 2?',
    alt: 'A grouped bar chart of allele frequency with two bars, one for each of two generations, for each of two alleles; one bar is left out and marked with a boxed question mark.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Allele A', 'Allele a'],
        series: [{ label: 'Generation 1', values: [0.6, 0.4] }, { label: 'Generation 2', values: [0.7, null] }],
        yMin: 0, yMax: 1, yStep: 0.1, yLabel: 'Allele frequency', xLabel: 'Allele',
      },
    },
  },
  {
    id: 'bars-grouped-values-printed',
    note: 'showValues with long category names that are set at an angle — the values over the bars, the legend under the axis label',
    question: 'The chart shows the mass of each substance before and after a reaction in a sealed flask. What mass of the limiting reactant was used up?',
    alt: 'A grouped bar chart with two bars, before and after, for each of three substances, with the value printed over each bar.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Magnesium ribbon', 'Hydrochloric acid', 'Magnesium chloride'],
        series: [{ label: 'Before', values: [24, 80, 0] }, { label: 'After', values: [0, 7, 95] }],
        yMin: 0, yMax: 100, yStep: 20, yLabel: 'Mass (g)', showValues: true,
      },
    },
  },
];
