/**
 * AP Statistics — Unit 4 CED 4.6–4.7: Random Variables.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.random-variables.v1).
 * Theory tagged with kind/title + an inline bar_chart of a discrete
 * probability distribution, to the calibration standard set by
 * ap-stats-u1-normal-distribution.ts / ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.random-variables';

export const BASELINE_AP_STATS_RANDOM_VARIABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.random-variables.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.6-4.7',
  cedTitle: 'Random Variables',
  planId: 'evelyn.ap.stats.random-variables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.random-variables.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Random variables and their probability distributions',
      content:
        'A RANDOM VARIABLE X assigns a number to each outcome of a random process. A DISCRETE random variable takes a countable set of values (e.g. number of heads in 10 flips: 0, 1, …, 10); a CONTINUOUS random variable takes any value in an interval (e.g. height, time). The PROBABILITY DISTRIBUTION of a discrete X is a table of values $x_i$ and their probabilities $P(X = x_i)$ — the probabilities must sum to 1.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Distribution of X = number of heads in 2 fair coin flips',
          categories: ['0', '1', '2'],
          values: [0.25, 0.5, 0.25],
          yLabel: 'P(X = x)',
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Mean (expected value) of a discrete random variable',
      content:
        '$\\mu_X = E(X) = \\sum x_i \\cdot P(X = x_i)$ — the weighted average of the possible values, weighted by their probabilities.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Variance and standard deviation of a discrete random variable',
      content:
        '$\\sigma^2_X = \\sum (x_i - \\mu_X)^2 \\cdot P(X = x_i)$ is the VARIANCE; $\\sigma_X = \\sqrt{\\sigma^2_X}$ is the standard deviation. Compute the mean first, then the squared deviations weighted by probability, then sum and take the square root.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Interpreting the mean and SD of a random variable',
      content:
        'The mean is the LONG-RUN AVERAGE value of X over many repetitions of the random process — it need not equal any single possible value of X (e.g. a mean of 2.5 cars sold per day). The SD is the TYPICAL amount X deviates from its mean over those repetitions.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'random variable',
      content: 'a numerical outcome of a random process, denoted with a capital letter (X).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'expected value',
      content: 'the mean of a random variable; the long-run average value over many trials.',
    },
  ],
  methods: [
    {
      title: 'Compute the mean and SD of a discrete random variable',
      when_to_use:
        'When given a probability distribution table and asked for μ and σ (or to interpret them in context).',
      steps: [
        'List the possible values of X and confirm the probabilities sum to 1.',
        'Compute μ = Σ x·P(x).',
        'For each value, compute (x − μ)², then multiply by P(x).',
        'Sum those weighted squared deviations to get σ².',
        'Take the square root to get σ.',
        'If asked to interpret, describe μ as the long-run average and σ as the typical deviation, in context.',
      ],
      example: {
        problem: 'X = number of heads in 2 fair coin flips. Find the distribution, mean, and SD.',
        solution:
          'Values: 0, 1, 2 with P(0) = 1/4, P(1) = 2/4, P(2) = 1/4 (sum to 1). μ = 0(1/4) + 1(2/4) + 2(1/4) = 1. σ² = (0−1)²(1/4) + (1−1)²(2/4) + (2−1)²(1/4) = 0.25 + 0 + 0.25 = 0.5. σ = √0.5 ≈ 0.707.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'A discrete distribution\'s probabilities must sum to 1 — check this before computing μ or σ.', kind: 'tip' },
    { content: 'FRQ vocab: interpret μ as "the long-run average value of X" and σ as "the typical deviation from that average," both in context.', kind: 'frq-vocab' },
    { content: 'Compute μ completely before starting the variance sum — using the wrong (or rounded) μ in (x − μ)² throws off every term.', kind: 'common-error' },
    { content: 'The mean of a random variable need not be a value X can actually take (e.g. an average of 2.5 cars sold per day).', kind: 'gotcha' },
    { content: 'These mean/SD formulas apply to DISCRETE random variables; continuous random variables use density-based methods instead.', kind: 'edge-case' },
  ],
};
