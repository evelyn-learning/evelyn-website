/**
 * AP Statistics — Unit 1 CED 1.5: Quantitative Graphs.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.quantitative-graphs.v1). Theory re-tagged, method
 * humanized + given an inline histogram diagram, pointers enriched to the
 * calibration standard (ap-macro-u4-loanable-funds.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.quantitative-graphs';

export const BASELINE_AP_STATS_QUANTITATIVE_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.quantitative-graphs.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Quantitative Graphs',
  planId: 'evelyn.ap.stats.quantitative-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.quantitative-graphs.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Dotplot',
      content:
        'Each value is a dot above its position on a number line; repeated values stack. KEEPS every individual value. Best for small datasets (n ≲ 50) and for seeing exact gaps and clusters.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Stemplot (stem-and-leaf)',
      content:
        'Split each value into a STEM (leading digits) and a LEAF (final digit): stem 4, leaf 7 → 47. Sort leaves left-to-right. KEEPS every value and shows shape at a glance. **Always include a KEY** (e.g. "4 | 7 means 47") — a stemplot with no key loses a point.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Back-to-back stemplot',
      content:
        'Compares two distributions that share one column of stems: one group’s leaves grow to the right, the other’s to the left. Same scale automatically → a clean comparison display.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Histogram',
      content:
        'Bars over equal-width INTERVALS (bins); bar HEIGHT = frequency or relative frequency. Bars TOUCH — no gaps (this is what distinguishes a histogram from a bar chart). Histograms summarize large datasets but LOSE individual values — you can read approximate counts per bin, not exact data points.',
      diagram: {
        type: 'histogram',
        params: {
          title: 'Histogram (equal-width bins)',
          xLabel: 'value',
          yLabel: 'frequency',
          mode: 'count',
          showCounts: true,
          xMin: 60,
          xMax: 100,
          yMax: 5,
          bins: [
            { lower: 60, upper: 70, count: 2 },
            { lower: 70, upper: 80, count: 5 },
            { lower: 80, upper: 90, count: 5 },
            { lower: 90, upper: 100, count: 2 },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing bin width',
      content:
        'Bin width is a judgment call: too wide hides features, too narrow looks noisy. Rule of thumb: 5–15 bins. Changing the bins can change the apparent shape, so an FRQ answer should describe the shape that is robust to reasonable bin choices.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'histogram',
      content: 'a graph of frequencies over equal-width intervals; bars touch.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'bin',
      content: 'one equal-width interval of values represented by a single bar in a histogram.',
    },
  ],
  methods: [
    {
      title: 'Construct and read a stemplot',
      when_to_use:
        'When asked to build a stemplot (or back-to-back stemplot) from a small dataset, or to describe shape from one.',
      steps: [
        'Sort the data and decide the stem unit (usually the tens digit for two-digit data).',
        'List each distinct stem once, in order, in a vertical column.',
        'Write each value’s leaf next to its stem; sort leaves left-to-right.',
        'Add a KEY stating what stem|leaf means.',
        'Read shape directly: where the leaves pile up is the center; long thin runs of stems are tails.',
      ],
      example: {
        problem:
          'Construct a stemplot for these test scores: 62, 75, 80, 81, 84, 73, 66, 91, 88, 79, 70, 82, 95, 78.',
        solution:
          'Sorted: 62 66 | 70 73 75 78 79 | 80 81 82 84 88 | 91 95.\n  6 | 2 6\n  7 | 0 3 5 8 9\n  8 | 0 1 2 4 8\n  9 | 1 5\n  KEY: 6 | 2 means 62.\nShape: roughly mound-shaped, slight left skew.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Dotplot & stemplot keep every value; histogram groups into bins and loses individual values.', kind: 'tip' },
    { content: 'Histogram bars TOUCH; bar-chart bars have gaps. Mixing them up is a classic give-away error.', kind: 'common-error' },
    { content: 'Always put a KEY on a stemplot — and label the axes on a histogram — or lose the display point.', kind: 'frq-vocab' },
    { content: 'Bin width controls apparent shape; 5–15 bins is typical. Describe the shape that survives reasonable bin changes.', kind: 'edge-case' },
    { content: 'A histogram lets you estimate counts per bin, never exact data values — don’t claim a precise data point from one.', kind: 'gotcha' },
  ],
};
