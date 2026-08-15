/**
 * AP Statistics — Unit 1 CED 1.10: Normal Distribution.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.normal-distribution.v1). Theory re-tagged with kind/title +
 * an inline normal_curve diagram, method humanized, pointers enriched to the
 * calibration standard (ap-macro-u4-loanable-funds.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.normal-distribution';

export const BASELINE_AP_STATS_NORMAL_DISTRIBUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.normal-distribution.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.10',
  cedTitle: 'Normal Distribution',
  planId: 'evelyn.ap.stats.normal-distribution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.normal-distribution.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The normal model N(μ, σ)',
      content:
        'A NORMAL distribution is symmetric and bell-shaped with mean μ (center) and SD σ (controls width). Notation: $X \\sim N(\\mu, \\sigma)$. Many natural measurements are approximately normal, which is why it underpins later inference.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Empirical rule: 68–95–99.7',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          showSDLines: true,
          markValues: [
            { x: -1, label: '−1σ' },
            { x: 1, label: '+1σ' },
            { x: -2, label: '−2σ' },
            { x: 2, label: '+2σ' },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Empirical rule (68–95–99.7)',
      content:
        'For any normal distribution: ~68% of values lie within μ ± σ, ~95% within μ ± 2σ, and ~99.7% within μ ± 3σ. Use it for quick estimates when a value sits at a whole number of SDs from the mean.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Z-score (standardizing)',
      content:
        '$z = \\dfrac{x - \\mu}{\\sigma}$ — the number of SDs x lies above (+) or below (−) the mean. Standardizing converts any normal distribution to the STANDARD NORMAL $N(0,1)$, so one table/calculator works for all.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding a probability (area)',
      content:
        'For $X \\sim N(\\mu,\\sigma)$: $P(X \\le x) = P\\!\\left(Z \\le \\frac{x-\\mu}{\\sigma}\\right)$. Look the z-score up in the standard normal table, or use normalcdf(lower, upper, μ, σ). Always sketch the curve and shade the region you want.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding a value from a percentile (reverse)',
      content:
        'Given a probability p, find the z with $P(Z \\le z) = p$ (invNorm), then un-standardize: $x = \\mu + z\\sigma$. This is the "what score is at the 90th percentile" direction.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'z-score',
      content: '$z = (x-\\mu)/\\sigma$: how many standard deviations a value is from the mean.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard normal',
      content: 'the normal distribution with mean 0 and SD 1, $N(0,1)$, to which any normal is standardized.',
    },
  ],
  methods: [
    {
      title: 'Normal probability with the empirical rule',
      when_to_use:
        'When the boundary values land on whole-number SDs from the mean — the fastest route, no table needed.',
      steps: [
        'Standardize each boundary: z = (x − μ)/σ.',
        'If the z-values are whole numbers, sketch the curve and mark ±1, ±2, ±3 SD.',
        'Add the empirical-rule slices between the boundaries (68% within ±1σ split as 34%/34%; the next ring out to ±2σ adds 13.5% each side; to ±3σ adds 2.35% each side).',
        'Sum the relevant slices for the requested region.',
      ],
      example: {
        problem: 'SAT scores are approximately N(1050, 200). What percent of test-takers score between 850 and 1450?',
        solution:
          'z(850) = (850 − 1050)/200 = −1; z(1450) = (1450 − 1050)/200 = +2. Region from −1σ to +2σ = 34% (−1→0) + 34% (0→+1) + 13.5% (+1→+2) = 81.5%. About 81.5% of test-takers score between 850 and 1450.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Normal probability with z-table / calculator',
      when_to_use:
        'When boundaries are NOT whole-number SDs, or you need a precise probability or percentile.',
      steps: [
        'Standardize: z = (x − μ)/σ.',
        'For P(X ≤ x): read the table value for that z, or normalcdf(−1E99, x, μ, σ).',
        'For a between-probability: normalcdf(low, high, μ, σ).',
        'For a percentile (reverse): z = invNorm(p), then x = μ + zσ.',
        'Sketch and shade to confirm the area matches what was asked.',
      ],
      example: {
        problem: 'For N(1050, 200), what score is at the 90th percentile?',
        solution: 'z = invNorm(0.90) ≈ 1.28; x = 1050 + 1.28(200) ≈ 1306. A score of about 1306 is at the 90th percentile.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Empirical rule: 68 / 95 / 99.7% within ±1σ / ±2σ / ±3σ.', kind: 'tip' },
    { content: 'z = (x − μ)/σ standardizes any normal to N(0,1). Negative z = below the mean.', kind: 'tip' },
    { content: 'Use the empirical rule only when boundaries are whole SDs; otherwise use the table / normalcdf.', kind: 'common-error' },
    { content: 'normalcdf → probability (area) from values; invNorm → value (score) from a probability. Don’t swap them.', kind: 'frq-vocab' },
    { content: 'Always sketch and shade the normal curve before computing — it catches "area to the left vs right" sign errors.', kind: 'gotcha' },
    { content: 'The empirical rule and z-procedures require the distribution to be (approximately) NORMAL — they don’t apply to a clearly skewed distribution.', kind: 'edge-case' },
  ],
};
