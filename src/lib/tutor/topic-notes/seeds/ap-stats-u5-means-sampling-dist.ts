/**
 * AP Statistics — Unit 5 CED 5.7–5.8: Sampling Distribution of x̄.
 *
 * Hand-curated from the source plan
 * evelyn.ap.stats.means-sampling-dist.v1. Theory tagged with kind/title +
 * an inline normal_curve for the sampling distribution of x̄ from the IQ
 * worked example, method humanized, pointers enriched to the calibration
 * standard (ap-stats-u1-*.ts, ap-stats-u2-correlation.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.means-sampling-dist';

export const BASELINE_AP_STATS_MEANS_SAMPLING_DIST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.means-sampling-dist.v1',
  course: 'AP Statistics',
  cedUnit: 5,
  cedTopic: '5.7-5.8',
  cedTitle: 'Sampling Distribution of x-bar',
  planId: 'evelyn.ap.stats.means-sampling-dist.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.means-sampling-dist.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Sampling distribution of x̄ (one sample)',
      content:
        'For an SRS of size $n$ from a population with mean $\\mu$ and SD $\\sigma$, the sampling distribution of $\\bar{x}$ has: center $\\mu_{\\bar{x}} = \\mu$ and spread $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$. Its shape is approximately Normal if the population is Normal, or (by the CLT) if $n \\ge 30$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Sampling distribution of x̄: N(100, 3), n = 25',
          mean: 100,
          sd: 3,
          xMin: 91,
          xMax: 109,
          showSDLines: true,
          shadeRegion: { from: 105 },
          markValues: [
            { x: 100, label: 'μ_x̄ = 100' },
            { x: 105, label: 'x̄ = 105' },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions to verify (RANDOM, NORMAL/LARGE, 10%)',
      content:
        '**RANDOM**: the data come from an SRS or a randomized experiment. **NORMAL/LARGE**: the population is Normal, OR $n \\ge 30$ (CLT), OR a sample graph is roughly symmetric with no extreme outliers. **10% CONDITION**: $n$ is less than 10% of the population size $N$ (independence when sampling without replacement). All three should be checked and stated before doing inference with $\\bar{x}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-sample difference of means',
      content:
        'For independent samples with means $\\bar{x}_1, \\bar{x}_2$: center $\\mu_{\\bar{x}_1 - \\bar{x}_2} = \\mu_1 - \\mu_2$; spread $\\sigma_{\\bar{x}_1 - \\bar{x}_2} = \\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}$ — **variances add** from independence. Shape is approximately Normal if EITHER both populations are Normal, OR $n_1 \\ge 30$ AND $n_2 \\ge 30$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Standard deviation vs standard error',
      content:
        'When $\\sigma$ is known, call $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ the SD of the sampling distribution. When $\\sigma$ is unknown and you substitute the sample SD $s$, the resulting $s/\\sqrt{n}$ is called the **standard error** of $\\bar{x}$ (this distinction matters starting Unit 7, where t-procedures use $s$).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error of x̄',
      content: '$s/\\sqrt{n}$ — the sample-based estimate of $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$, used when the population SD is unknown.',
    },
  ],
  methods: [
    {
      title: 'Describe the sampling distribution of x̄, verify conditions, compute a probability',
      when_to_use:
        'When given a population mean/SD and an SRS of size n, and asked to describe or use the sampling distribution of x̄ — the standard one-sample setup for FRQs.',
      steps: [
        'RANDOM: confirm SRS or random assignment is stated.',
        'NORMAL/LARGE: population Normal, OR n ≥ 30 (CLT), OR sample data roughly symmetric with no extreme outliers.',
        '10%: confirm n ≤ 0.10·N (state a population-size assumption if not given).',
        'State center μ_x̄ = μ and spread σ_x̄ = σ/√n.',
        'Standardize: z = (x̄ − μ_x̄)/σ_x̄, then use normalcdf/invNorm.',
        'Answer in context and interpret what the probability implies about the claim.',
      ],
      example: {
        problem: 'IQ scores are N(100, 15). An SRS of 25 people is taken. Describe the sampling distribution of x̄ and find P(x̄ > 105).',
        solution:
          'RANDOM: SRS stated. NORMAL/LARGE: population is Normal, so x̄ is exactly Normal for any n. 10%: assume the population is large relative to 25. μ_x̄ = 100, σ_x̄ = 15/√25 = 3, so x̄ ~ N(100, 3). z = (105 − 100)/3 ≈ 1.667, so P(x̄ > 105) = P(Z > 1.667) ≈ 0.048, about 4.8%.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'μ_x̄ = μ; σ_x̄ = σ/√n. Always verify RANDOM, NORMAL/LARGE, and 10% before treating x̄ as Normal.', kind: 'tip' },
    { content: 'For a two-sample difference, variances ADD (never SDs directly): $\\sigma_{\\bar{x}_1-\\bar{x}_2}^2 = \\sigma_1^2/n_1 + \\sigma_2^2/n_2$.', kind: 'common-error' },
    { content: '"Standard deviation" (σ known) vs "standard error" (σ unknown, uses s) — FRQ graders expect the correct term for the correct situation.', kind: 'frq-vocab' },
    { content: 'NORMAL/LARGE has two distinct justifications — "population Normal" (exact, any n) or "n ≥ 30" (approximate, CLT). Naming the wrong one loses the condition point even if the arithmetic is right.', kind: 'gotcha' },
    { content: 'If the population shape is unknown and n < 30, you cannot assume x̄ is approximately Normal — a sample dotplot/boxplot with no strong skew or outliers is the fallback justification, not a guarantee.', kind: 'edge-case' },
  ],
};
