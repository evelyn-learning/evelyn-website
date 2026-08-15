/**
 * AP Statistics — Unit 1 CED 1.7–1.8: Summary Statistics and Boxplots.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.summary-statistics.v1). Theory re-tagged with kind/title,
 * method humanized, pointers enriched to the calibration standard
 * (ap-macro-u4-loanable-funds.ts). No boxplot diagram kind exists in the
 * solver, so boxplot content stays textual.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.summary-statistics';

export const BASELINE_AP_STATS_SUMMARY_STATISTICS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.summary-statistics.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.7-1.8',
  cedTitle: 'Summary Statistics and Boxplots',
  planId: 'evelyn.ap.stats.summary-statistics.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.summary-statistics.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Measures of center',
      content:
        'MEAN $\\bar{x} = \\frac{\\sum x_i}{n}$ — the balance point; sensitive to outliers. MEDIAN — the middle value of the sorted data; RESISTANT to outliers. Choose median for skewed data, mean for symmetric.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Measures of spread',
      content:
        'RANGE = max − min (one-number, very sensitive). STANDARD DEVIATION (below) — typical distance from the mean, sensitive. IQR = Q3 − Q1 — spread of the middle 50%, RESISTANT. Pair spread with center: mean-with-SD, median-with-IQR.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Standard deviation',
      content:
        'Sample SD $s = \\sqrt{\\dfrac{\\sum (x_i - \\bar{x})^2}{n-1}}$ — the typical distance of a value from the mean. Divide by $n-1$ (not $n$) for the *sample* SD. Larger $s$ ⇒ more spread.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Quartiles & the 5-number summary',
      content:
        'Q1 = median of the lower half, Q3 = median of the upper half (TPS convention: exclude the overall median when n is odd). The 5-NUMBER SUMMARY is min, Q1, median, Q3, max — it drives the boxplot.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: '1.5×IQR outlier rule',
      content:
        'A value is an OUTLIER if it is below $Q_1 - 1.5\\cdot IQR$ (lower fence) or above $Q_3 + 1.5\\cdot IQR$ (upper fence). Always state the fences explicitly when identifying outliers on an FRQ.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Boxplot',
      content:
        'A box spans Q1 to Q3 with a line at the median; whiskers extend to the most extreme values that are NOT outliers (i.e. to the data values just inside the fences), and outliers are drawn as separate dots. Boxplots are ideal for comparing groups but HIDE modality (you cannot see bimodality in a boxplot).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'IQR',
      content: 'Q3 − Q1, the spread of the middle 50% of the data; resistant to outliers.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'resistant',
      content: 'a statistic is resistant if extreme values (outliers) do not change it much (median, IQR are; mean, SD, range are not).',
    },
  ],
  methods: [
    {
      title: 'Compute the 5-number summary and check for outliers',
      when_to_use:
        'When given a dataset and asked for quartiles, IQR, a boxplot, or whether any values are outliers.',
      steps: [
        'Sort the data and record n.',
        'Median = middle value (average the two middle values if n is even).',
        'Q1 = median of the lower half; Q3 = median of the upper half (exclude the overall median when n is odd).',
        'IQR = Q3 − Q1; range = max − min.',
        'Compute fences: lower = Q1 − 1.5·IQR, upper = Q3 + 1.5·IQR.',
        'Any value outside [lower, upper] is an outlier; report the 5-number summary and list outliers.',
      ],
      example: {
        problem: 'Find the 5-number summary, IQR, and any outliers for: 42, 47, 50, 52, 55, 58, 60, 65, 71, 88.',
        solution:
          'n = 10. Median = (55+58)/2 = 56.5. Lower half 42,47,50,52,55 → Q1 = 50. Upper half 58,60,65,71,88 → Q3 = 65. IQR = 15. Fences: 50 − 22.5 = 27.5 and 65 + 22.5 = 87.5. Since 88 > 87.5, **88 is an outlier**. 5-number summary: (42, 50, 56.5, 65, 88).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Pair them: MEAN with SD, MEDIAN with IQR. Never report mean with IQR or median with SD.', kind: 'common-error' },
    { content: '5-number summary: min, Q1, median, Q3, max.', kind: 'tip' },
    { content: 'Outlier rule: outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR]. State the fences in your work.', kind: 'frq-vocab' },
    { content: 'Median & IQR are RESISTANT; mean, SD, and range are not.', kind: 'tip' },
    { content: 'Sample SD divides by n − 1, not n — a frequent calculator/formula slip.', kind: 'gotcha' },
    { content: 'Boxplots hide modality: a bimodal distribution can look identical to a unimodal one in a boxplot. Use a histogram/dotplot to see peaks.', kind: 'edge-case' },
  ],
};
