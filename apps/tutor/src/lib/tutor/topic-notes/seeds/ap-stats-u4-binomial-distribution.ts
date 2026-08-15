/**
 * AP Statistics — Unit 4 CED 4.9–4.10: Binomial Distribution.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.binomial-distribution.v1).
 * Theory tagged with kind/title + an inline bar_chart of the Binomial(10, 0.7)
 * PMF, to the calibration standard set by ap-stats-u1-normal-distribution.ts /
 * ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.binomial-distribution';

export const BASELINE_AP_STATS_BINOMIAL_DISTRIBUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.binomial-distribution.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.9-4.10',
  cedTitle: 'Binomial Distribution',
  planId: 'evelyn.ap.stats.binomial-distribution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.binomial-distribution.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Binomial setting: BINS conditions',
      content:
        'A BINOMIAL setting counts successes in a fixed number of independent trials. Check BINS: **B**inary — each trial has two outcomes (success/failure); **I**ndependent trials; **N** — a fixed number of trials n; **S**ame probability of success p on every trial. If BINS holds, $X \\sim \\text{Binomial}(n, p)$ where X = number of successes.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Binomial probability (PMF)',
      content:
        '$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$, where $\\binom{n}{k} = \\dfrac{n!}{k!(n-k)!}$ counts the ways to choose k successes from n trials. On the calculator: binompdf(n, p, k) gives $P(X=k)$; binomcdf(n, p, k) gives $P(X \\le k)$.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Binomial(n = 10, p = 0.7) distribution',
          categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          values: [0.0000, 0.0001, 0.0014, 0.0090, 0.0368, 0.1029, 0.2001, 0.2668, 0.2335, 0.1211, 0.0282],
          yLabel: 'P(X = k)',
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Mean and SD of a binomial random variable',
      content: '$\\mu_X = np$ and $\\sigma_X = \\sqrt{np(1-p)}$ — no need to build the full distribution just for these.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Shape and the 10% condition',
      content:
        'The binomial distribution is skewed when p is far from 0.5, symmetric when $p = 0.5$, and approximately normal when $np \\ge 10$ AND $n(1-p) \\ge 10$ (the Large Counts condition, used later in inference for proportions). The 10% CONDITION: sampling without replacement is not strictly independent, but if the sample size n is at most 10% of the population, the binomial model is still a reasonable approximation.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'binomial random variable',
      content: 'the count of successes in n independent trials with constant success probability p.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'BINS',
      content: 'Binary, Independent, fixed Number of trials, Same probability of success — the four checks for a binomial setting.',
    },
  ],
  methods: [
    {
      title: 'Compute a binomial probability P(X = k)',
      when_to_use: 'When asked for the probability of an EXACT number of successes in a fixed number of trials.',
      steps: [
        'Verify BINS and identify n and p.',
        'Write X ~ Binomial(n, p).',
        'Apply P(X = k) = C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ, or use binompdf(n, p, k) on the calculator.',
        'State the result in context.',
      ],
      example: {
        problem: 'A free-throw shooter has p = 0.7 and shoots 10 free throws. Find P(X = 7), where X = number made.',
        solution:
          'BINS holds: X ~ Binomial(10, 0.7). P(X = 7) = C(10,7)·0.7⁷·0.3³ = 120 · 0.0823543 · 0.027 ≈ 0.2668. Or: binompdf(10, 0.7, 7) ≈ 0.2668.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Verify a binomial setting and compute mean/SD',
      when_to_use: 'When asked to justify why a random variable is binomial before computing μ and σ.',
      steps: [
        'Check each BINS letter explicitly in context (binary outcome, independent trials, fixed n, constant p).',
        'State X ~ Binomial(n, p).',
        'Compute μ = np.',
        'Compute σ = √(np(1−p)).',
      ],
      example: {
        problem:
          'A standardized test has 20 multiple-choice questions, each with 4 options. A student guesses on every question. Let X = number correct. Why is X binomial, and find μ_X and σ_X.',
        solution:
          'BINS: Binary (right/wrong); Independent (different questions); N = 20 fixed; Same p = 0.25 (random guess on 4 options). X ~ Binomial(20, 0.25). μ = 20(0.25) = 5. σ = √(20·0.25·0.75) = √3.75 ≈ 1.936.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'μ = np and σ = √(np(1−p)) give mean/SD directly — no need to sum the full PMF for these.', kind: 'tip' },
    { content: 'FRQ vocab: to justify a binomial setting, check each BINS letter explicitly in context, not just assert "it\'s binomial."', kind: 'frq-vocab' },
    { content: 'binompdf gives P(X = k) (exact); binomcdf gives P(X ≤ k) (cumulative). Using the wrong one is a frequent error.', kind: 'common-error' },
    { content: 'Sampling without replacement is not exactly binomial — trials aren\'t strictly independent — but the 10% condition (n ≤ 10% of population) makes it a good approximation.', kind: 'gotcha' },
    { content: 'The distribution is only approximately normal when np ≥ 10 AND n(1−p) ≥ 10 (Large Counts); otherwise it can be strongly skewed.', kind: 'edge-case' },
  ],
};
