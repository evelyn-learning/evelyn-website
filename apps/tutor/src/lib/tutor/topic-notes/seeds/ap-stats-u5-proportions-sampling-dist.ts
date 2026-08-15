/**
 * AP Statistics — Unit 5 CED 5.5–5.6: Sampling Distribution of p̂.
 *
 * Hand-curated from the source plan
 * evelyn.ap.stats.proportions-sampling-dist.v1. Theory tagged with
 * kind/title + an inline normal_curve for the sampling distribution of p̂
 * from the town-voters worked example, method humanized, pointers enriched
 * to the calibration standard (ap-stats-u1-*.ts, ap-stats-u2-correlation.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.proportions-sampling-dist';

export const BASELINE_AP_STATS_PROPORTIONS_SAMPLING_DIST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.proportions-sampling-dist.v1',
  course: 'AP Statistics',
  cedUnit: 5,
  cedTopic: '5.5-5.6',
  cedTitle: 'Sampling Distribution of p-hat',
  planId: 'evelyn.ap.stats.proportions-sampling-dist.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.proportions-sampling-dist.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Sampling distribution of p̂',
      content:
        'For an SRS of size $n$ from a population with true success proportion $p$, the sampling distribution of $\\hat{p}$ has: center $\\mu_{\\hat{p}} = p$ (unbiased) and spread $\\sigma_{\\hat{p}} = \\sqrt{p(1-p)/n}$. Its shape is approximately Normal only when the **Large Counts condition** holds.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Sampling distribution of p̂: N(0.60, 0.0346), n = 200',
          mean: 0.6,
          sd: 0.0346,
          xMin: 0.496,
          xMax: 0.704,
          showSDLines: true,
          shadeRegion: { to: 0.55 },
          markValues: [
            { x: 0.6, label: 'μ_p̂ = 0.60' },
            { x: 0.55, label: 'p̂ = 0.55' },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Conditions for Normality: Large Counts and 10%',
      content:
        '**Large Counts condition** (shape): $np \\ge 10$ AND $n(1-p) \\ge 10$ — enough expected successes and failures for the distribution to be roughly symmetric and bell-shaped. **10% condition** (independence): $n$ is less than 10% of the population size $N$ (i.e. $n \\le 0.10N$) when sampling without replacement. These check two DIFFERENT things — shape vs independence — and an AP rubric expects both verified before claiming $\\hat{p}$ is approximately Normal.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Standardizing p̂',
      content:
        '$z = \\dfrac{\\hat{p} - p}{\\sigma_{\\hat{p}}} = \\dfrac{\\hat{p} - p}{\\sqrt{p(1-p)/n}}$. Once conditions are verified, standardize and use normalcdf / the standard Normal table exactly as with any Normal variable.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-sample difference of proportions',
      content:
        'For independent samples with proportions $\\hat{p}_1$ and $\\hat{p}_2$: center $\\mu_{\\hat{p}_1 - \\hat{p}_2} = p_1 - p_2$; spread $\\sigma_{\\hat{p}_1 - \\hat{p}_2} = \\sqrt{p_1(1-p_1)/n_1 + p_2(1-p_2)/n_2}$ — **variances add** because the samples are independent. Shape is approximately Normal only if Large Counts holds in BOTH samples: $n_1p_1, n_1(1-p_1), n_2p_2, n_2(1-p_2)$ all $\\ge 10$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Large Counts condition',
      content: '$np \\ge 10$ and $n(1-p) \\ge 10$ — checks that the sampling distribution of $\\hat{p}$ is approximately Normal.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error of p̂',
      content: '$\\sigma_{\\hat{p}} = \\sqrt{p(1-p)/n}$ — the SD of the sampling distribution of $\\hat{p}$.',
    },
  ],
  methods: [
    {
      title: 'Describe the sampling distribution of p̂ and compute a probability',
      when_to_use:
        'When given a population proportion p, a sample size n, and asked for the sampling distribution of p̂ or a probability involving p̂.',
      steps: [
        'State the center: μ_p̂ = p.',
        'Compute the spread: σ_p̂ = √(p(1−p)/n).',
        'Verify Large Counts: np ≥ 10 AND n(1−p) ≥ 10.',
        'Verify 10% condition: n ≤ 0.10 · N (state the population assumption if not given directly).',
        'If both hold, standardize (z = (p̂ − p)/σ_p̂) and use normalcdf/invNorm for the requested probability or percentile.',
        'State the conclusion in context.',
      ],
      example: {
        problem: '60% of a town\'s voters support a measure. An SRS of 200 voters is taken. Describe the sampling distribution of p̂ and find P(p̂ < 0.55).',
        solution:
          'μ_p̂ = 0.60. σ_p̂ = √(0.6·0.4/200) = √0.0012 ≈ 0.0346. Large Counts: np = 120 ≥ 10 ✓, n(1−p) = 80 ≥ 10 ✓. 10%: assuming the town has at least 2000 voters, 200 ≤ 0.10(2000) ✓. So p̂ ~ N(0.60, 0.0346) approximately. z = (0.55 − 0.60)/0.0346 ≈ −1.45, so P(p̂ < 0.55) = P(Z < −1.45) ≈ 0.074, about 7.4%.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'μ_p̂ = p (unbiased); σ_p̂ = √(p(1−p)/n) — memorize both formulas together, they are always paired.', kind: 'tip' },
    { content: 'Large Counts (np ≥ 10 and n(1−p) ≥ 10, shape) and the 10% condition (n ≤ 0.10N, independence) check TWO different things — verify both, never substitute one for the other.', kind: 'frq-vocab' },
    { content: 'AP uses 10 as the Large Counts threshold, not 5 — using the wrong threshold is a common point loss.', kind: 'common-error' },
    { content: 'When p is small (or close to 1) and n is modest, Large Counts can fail even though n "feels" large — always compute np and n(1−p) explicitly rather than eyeballing.', kind: 'gotcha' },
    { content: 'If Large Counts fails, do not force a Normal approximation — state that the sampling distribution is skewed and the Normal model does not apply.', kind: 'edge-case' },
  ],
};
