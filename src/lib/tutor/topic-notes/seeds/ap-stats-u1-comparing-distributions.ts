/**
 * AP Statistics — Unit 1 CED 1.9: Comparing Distributions.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.comparing-distributions.v1). Theory re-tagged, the rambling
 * extracted "compare" worked example rewritten clean, pointers enriched to the
 * calibration standard (ap-macro-u4-loanable-funds.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.comparing-distributions';

export const BASELINE_AP_STATS_COMPARING_DISTRIBUTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.comparing-distributions.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.9',
  cedTitle: 'Comparing Distributions',
  planId: 'evelyn.ap.stats.comparing-distributions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.comparing-distributions.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Compare, don’t just describe',
      content:
        'A comparison uses explicit comparative language — HIGHER / LOWER, MORE / LESS, GREATER SPREAD — and a connecting word (while, whereas, compared to). Two back-to-back standalone descriptions do NOT earn the comparison: the relationship must be stated in one breath.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Displays for comparison',
      content:
        'PARALLEL BOXPLOTS: side-by-side on one shared scale — best for comparing center, spread, and outliers. BACK-TO-BACK STEMPLOT: shared stems, leaves left and right. DUAL HISTOGRAMS: same axes, stacked. Whatever the display, the two groups must share the SAME scale.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Compare on all four of SOCS',
      content:
        'SHAPE (e.g. "A is roughly symmetric while B is right-skewed"), OUTLIERS (present in which group?), CENTER (which median/mean is higher, by how much), SPREAD (which IQR/SD is larger). Hit each of the four with a comparative phrase, in context.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'parallel boxplots',
      content: 'two or more boxplots drawn on a single shared scale for direct comparison of groups.',
    },
  ],
  methods: [
    {
      title: 'Write a SOCS comparison of two groups',
      when_to_use:
        'When an FRQ shows two (or more) distributions — usually parallel boxplots or a back-to-back stemplot — and asks you to compare them.',
      steps: [
        'CENTER: compare medians (or means if symmetric); state which is higher and the gap.',
        'SPREAD: compare IQRs (or SDs); state which group is more variable.',
        'SHAPE: compare skew/symmetry of the two groups.',
        'OUTLIERS: note which group has them and where.',
        'Combine into comparative sentences using "while/whereas" and naming the variable + units (context).',
      ],
      example: {
        problem:
          'Parallel boxplots of test scores: Class A (min 50, Q1 68, median 78, Q3 85, max 98, no outliers) vs Class B (min 40, Q1 55, median 65, Q3 80, max 92, low outlier at 40). Compare.',
        solution:
          'Class A had a HIGHER median than Class B (78 vs 65, a 13-point gap) and was LESS variable (IQR 17 vs 25), whereas Class B was more spread out and had a low outlier at 40 that Class A lacked. Both distributions are roughly symmetric.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'COMPARE with explicit words — higher/lower, greater/smaller spread — and a connector. Two separate descriptions are NOT a comparison (no point).', kind: 'common-error' },
    { content: 'Hit all four of SOCS, each with a comparative phrase.', kind: 'tip' },
    { content: 'Always include context: name the variable and units in the comparison sentence.', kind: 'frq-vocab' },
    { content: 'Groups must be on the SAME scale before you compare a display — mismatched axes invalidate a visual comparison.', kind: 'gotcha' },
    { content: 'When skew/outliers are present in EITHER group, compare medians and IQRs (resistant), not means and SDs.', kind: 'edge-case' },
  ],
};
