/**
 * AP Statistics — Unit 4 CED 4.11: Geometric Distribution.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.geometric-distribution.v1).
 * Theory tagged with kind/title + an inline bar_chart of the Geometric(0.4)
 * PMF, to the calibration standard set by ap-stats-u1-normal-distribution.ts /
 * ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.geometric-distribution';

export const BASELINE_AP_STATS_GEOMETRIC_DISTRIBUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.geometric-distribution.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.11',
  cedTitle: 'Geometric Distribution',
  planId: 'evelyn.ap.stats.geometric-distribution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.geometric-distribution.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Geometric setting: BITS conditions',
      content:
        'A GEOMETRIC setting counts the trial number of the FIRST success, with no fixed number of trials. Check BITS: **B**inary — success/failure; **I**ndependent trials; **T** — keep going until the first success (T = trial number of the first success, not fixed n); **S**ame probability of success p on every trial. If BITS holds, $X \\sim \\text{Geometric}(p)$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Geometric probability (PMF)',
      content:
        '$P(X = k) = (1-p)^{k-1} \\cdot p$, for $k = 1, 2, 3, \\dots$ — read as (k−1) failures then a success on trial k. On the calculator: geompdf(p, k) gives $P(X=k)$; geomcdf(p, k) gives $P(X \\le k)$.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Geometric(p = 0.4) distribution (first 8 trials)',
          categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
          values: [0.4, 0.24, 0.144, 0.0864, 0.0518, 0.0311, 0.0187, 0.0112],
          yLabel: 'P(X = k)',
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Mean and SD of a geometric random variable',
      content:
        '$\\mu_X = \\dfrac{1}{p}$ — the average number of trials needed for the first success. $\\sigma_X = \\dfrac{\\sqrt{1-p}}{p}$. Example: rolling a fair die until the first 6 has $p = 1/6$, so $\\mu = 6$ trials on average.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Shape, and binomial vs. geometric',
      content:
        'A geometric distribution is ALWAYS skewed right, with a long tail of large k values and most weight near $k = 1$ — never symmetric. Contrast with binomial: binomial has a FIXED n and counts successes; geometric has NO fixed n and counts the trial of the first success. "Number of heads in 10 flips" is binomial; "number of flips until the first head" is geometric.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'geometric random variable',
      content: 'the trial number of the first success in a sequence of independent Bernoulli trials with constant success probability p.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'BITS',
      content: 'Binary, Independent, Trials continue until first success (not fixed), Same probability of success — the four checks for a geometric setting.',
    },
  ],
  methods: [
    {
      title: 'Compute a geometric probability P(X = k)',
      when_to_use: 'When asked for the probability that the first success occurs on exactly trial k.',
      steps: [
        'Verify BITS and identify p (the probability of the event you are waiting for).',
        'Write X ~ Geometric(p).',
        'Apply P(X = k) = (1−p)^(k−1)·p, or use geompdf(p, k) on the calculator.',
        'State the result in context.',
      ],
      example: {
        problem: 'A basketball player has p = 0.4 free-throw success. Find the probability she misses the first 3 shots and makes the 4th.',
        solution:
          'X = trial of first made shot, p = 0.4. P(X = 4) = (0.6)³ · 0.4 = 0.216 · 0.4 = 0.0864. Or: geompdf(0.4, 4) ≈ 0.0864.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find mean/SD and cumulative geometric probabilities',
      when_to_use: 'When asked for μ, σ, or P(X ≤ k) / P(X ≥ k) in a geometric setting.',
      steps: [
        'Identify p and confirm the geometric setting.',
        'Compute μ = 1/p.',
        'Compute σ = √(1−p) / p.',
        'For P(X ≤ k), sum the individual PMF terms or use geomcdf(p, k).',
        'For P(X ≥ k), use the complement: P(X ≥ k) = 1 − P(X ≤ k − 1), or equivalently (1−p)^(k−1) (all first k−1 trials fail).',
      ],
      example: {
        problem: 'Roll a fair 6-sided die until you get a 6. Let X = trial number of the first 6. Find μ_X, σ_X, and P(X ≤ 3).',
        solution:
          'p = 1/6. μ = 1/(1/6) = 6. σ = √(5/6)/(1/6) = 6·√(5/6) ≈ 5.477. P(X ≤ 3) = P(1) + P(2) + P(3) = 1/6 + (5/6)(1/6) + (5/6)²(1/6) ≈ 0.1667 + 0.1389 + 0.1157 ≈ 0.4213 (matches geomcdf(1/6, 3)).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'μ = 1/p is the average wait for the first success; larger p means a shorter expected wait.', kind: 'tip' },
    { content: 'FRQ vocab: when defining p, state explicitly what event counts as "success" — it is sometimes the less obvious outcome (e.g. a filter MISSING a phishing email).', kind: 'frq-vocab' },
    { content: 'Do not confuse binomial (fixed n, count successes) with geometric (n not fixed, count trials until first success) — check which quantity is fixed.', kind: 'common-error' },
    { content: 'Geometric always has an unbounded upper tail (k = 1, 2, 3, … with no maximum) — the distribution is never symmetric.', kind: 'gotcha' },
    { content: 'P(X ≥ k) equals P(the first k−1 trials all fail) = (1−p)^(k−1) — often faster than summing the complement of a cdf.', kind: 'edge-case' },
  ],
};
