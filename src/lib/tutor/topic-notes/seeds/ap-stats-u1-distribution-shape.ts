/**
 * AP Statistics — Unit 1 CED 1.6: Distribution Shape (SOCS).
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.distribution-shape.v1). Theory re-tagged, method cleaned
 * up, pointers enriched to the calibration standard
 * (ap-macro-u4-loanable-funds.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.distribution-shape';

export const BASELINE_AP_STATS_DISTRIBUTION_SHAPE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.distribution-shape.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Distribution Shape (SOCS)',
  planId: 'evelyn.ap.stats.distribution-shape.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.distribution-shape.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'SOCS — the description checklist',
      content:
        'Describe a distribution with **S**hape, **O**utliers, **C**enter, **S**pread — always IN CONTEXT (name the variable and its units). Omitting context or omitting any of the four is the standard way to lose rubric points.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Shape descriptors',
      content:
        'SYMMETRIC: left and right halves mirror each other. SKEWED RIGHT (positive): long tail to the right. SKEWED LEFT (negative): long tail to the left. UNIFORM: roughly equal frequency. Also note modality: UNIMODAL (one peak), BIMODAL (two), MULTIMODAL.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Skew drags the mean',
      content:
        'The mean is pulled toward the long tail; the median resists it. So **mean > median ⇒ skewed right**, **mean < median ⇒ skewed left**, **mean ≈ median ⇒ roughly symmetric**. This is the fastest numeric check for skew direction.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Outliers',
      content:
        'Values that fall far from the rest of the data. Informally, "obviously separated" points count; the formal 1.5×IQR rule (next topic) makes this precise. Always flag outliers separately — they affect the choice of center and spread.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing center & spread from shape',
      content:
        'If SKEWED or OUTLIERS present → report MEDIAN (center) and IQR (spread), both resistant. If SYMMETRIC with no outliers → report MEAN (center) and STANDARD DEVIATION (spread). Pair them: mean-with-SD, median-with-IQR.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'skewed right',
      content: 'a long tail extends to the right; a few large values pull the mean above the median.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'outlier',
      content: 'a value far from the rest of the data; formally, more than 1.5×IQR below Q1 or above Q3.',
    },
  ],
  methods: [
    {
      title: 'Describe a distribution with SOCS',
      when_to_use:
        'Any FRQ that shows a graph (histogram, dotplot, stemplot) and asks you to describe or summarize the distribution.',
      steps: [
        'SHAPE: state symmetric / skewed-left / skewed-right and modality, with a reason ("long right tail").',
        'OUTLIERS: note any clearly separated values (formally check 1.5×IQR when summary stats are given).',
        'CENTER: pick MEDIAN if skewed/outliers, MEAN if symmetric; estimate or report the value.',
        'SPREAD: pick IQR if skewed, SD if symmetric; estimate or report the value.',
        'Write ONE sentence tying all four together IN CONTEXT (variable + units).',
      ],
      example: {
        problem:
          'A histogram of household income ($1000s) rises sharply through $20–50k, peaks at $40–50k, then has a long tail past $200k. Describe the distribution.',
        solution:
          'Right-skewed (long upper tail of high incomes), unimodal, with a few apparent high outliers past $200k. Because it is skewed, report the MEDIAN (≈ $45k) and IQR (≈ $55k): "Household income is right-skewed with a median near $45k and an IQR of about $55k, plus a few high-end outliers."',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'SOCS: Shape, Outliers, Center, Spread — always IN CONTEXT (variable + units).', kind: 'tip' },
    { content: 'Skew drags the mean: mean > median = right skew; mean < median = left skew.', kind: 'tip' },
    { content: 'Use MEDIAN + IQR when skewed/outliers; MEAN + SD when symmetric. Never pair mean with IQR.', kind: 'common-error' },
    { content: "FRQ vocab: 'skewed right' = tail points right (toward large values), regardless of where the peak sits. Justify the direction.", kind: 'frq-vocab' },
    { content: 'Saying "skewed" without a reason, or forgetting context, each costs a rubric point.', kind: 'gotcha' },
    { content: 'Bimodal data often signals two mixed groups — mention it; a single center can be misleading.', kind: 'edge-case' },
  ],
};
