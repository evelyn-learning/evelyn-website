/**
 * AP Statistics — Unit 5 CED 5.1–5.4: Sampling Distribution Concept.
 *
 * Hand-curated from the source plan
 * evelyn.ap.stats.sampling-distribution-concept.v1. Theory tagged with
 * kind/title + an inline normal_curve illustrating the sampling distribution
 * of p̂ from the worked marble example, method humanized, pointers enriched
 * to the calibration standard (ap-stats-u1-*.ts, ap-stats-u2-correlation.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.sampling-distribution-concept';

export const BASELINE_AP_STATS_SAMPLING_DISTRIBUTION_CONCEPT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.sampling-distribution-concept.v1',
  course: 'AP Statistics',
  cedUnit: 5,
  cedTopic: '5.1-5.4',
  cedTitle: 'Sampling Distribution Concept',
  planId: 'evelyn.ap.stats.sampling-distribution-concept.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.sampling-distribution-concept.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Parameter vs statistic',
      content:
        'A **PARAMETER** is a number describing the POPULATION — usually unknown. Notation: $\\mu$ (population mean), $p$ (population proportion), $\\sigma$ (population SD). A **STATISTIC** is a number computed from a SAMPLE, used to estimate the parameter. Notation: $\\bar{x}$ (sample mean), $\\hat{p}$ (sample proportion), $s$ (sample SD). Greek letters describe the population; hats and bars describe a sample.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The sampling distribution',
      content:
        'Every sample gives a different statistic — this is **sampling variability**. The **SAMPLING DISTRIBUTION** of a statistic is the distribution of that statistic over ALL possible samples of a fixed size $n$ drawn from the population. It has a **center** ($\\mu_{\\bar{x}}$ or $\\mu_{\\hat{p}}$), a **spread** ($\\sigma_{\\bar{x}}$ or $\\sigma_{\\hat{p}}$, which tells how much the statistic varies from sample to sample), and a **shape** that depends on $n$, the parameter, and the population\'s own distribution.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Sampling distribution of p̂ (n = 20, p = 0.60)',
          mean: 0.6,
          sd: 0.11,
          xMin: 0.27,
          xMax: 0.93,
          showSDLines: true,
          markValues: [
            { x: 0.6, label: 'μ_p̂ = 0.60' },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Bias vs variability',
      content:
        'An **UNBIASED ESTIMATOR** is one whose sampling distribution is centered exactly at the parameter — its mean over all possible samples equals the parameter. $\\bar{x}$ is unbiased for $\\mu$; $\\hat{p}$ is unbiased for $p$. **Bias** describes whether the center is right; **variability** (spread of the sampling distribution) describes how precise the estimator is. **Larger $n$ reduces variability but does NOT change bias** — bias is a property of the estimator\'s design, not the sample size. A good statistic needs to address BOTH: low bias (centers on the parameter) and low variability (small spread).',
    },
    {
      loId: LO,
      kind: 'gotcha',
      title: 'Why sample SD uses n − 1',
      content:
        'The sample SD $s$ (with an $n-1$ denominator) is only approximately unbiased for $\\sigma$. Using $n$ instead of $n-1$ would systematically UNDERESTIMATE $\\sigma$ on average — that underestimation bias is exactly why the $n-1$ correction ("Bessel\'s correction") exists.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'unbiased estimator',
      content: 'an estimator whose sampling distribution has mean equal to the parameter it estimates.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'sampling distribution',
      content: 'the distribution of a statistic (e.g. $\\bar{x}$ or $\\hat{p}$) over all possible samples of a fixed size $n$.',
    },
  ],
  methods: [
    {
      title: 'Evaluate whether an estimator is "good": bias and variability',
      when_to_use:
        'When an FRQ asks you to compare two estimators, or to comment on whether a statistic is a good estimator of a parameter.',
      steps: [
        'Identify the parameter being estimated and the candidate statistic(s).',
        'Check BIAS: does the sampling distribution of the statistic center on the parameter? State it explicitly (e.g. "unbiased because its mean equals μ").',
        'Check VARIABILITY: compare the spread of the competing statistics\' sampling distributions — smaller SD is more precise.',
        'If sample size is mentioned, note that larger $n$ reduces variability for either estimator but does not fix bias.',
        'Conclude by naming BOTH properties together — a rubric typically awards separate points for bias and for variability.',
      ],
      example: {
        problem: 'A bag has 60% red marbles. A student takes 50 SRSs of size 20 and computes p̂ each time, observing p̂ ranging from 0.40 to 0.85 with mean ≈ 0.60. Comment on p̂ as an estimator of p.',
        solution:
          'Parameter: p = 0.60. The observed mean of the 50 sample proportions (≈ 0.60) matches p, confirming p̂ is unbiased — its sampling distribution is centered at p. The wide range (0.40 to 0.85) reflects sample-to-sample variability, which is large here because n = 20 is small; a larger n would tighten that spread without changing the center.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Greek letters (μ, p, σ) = parameter (population); hats/bars (p̂, x̄, s) = statistic (sample).', kind: 'tip' },
    { content: 'Unbiased means the sampling distribution is CENTERED at the parameter — it says nothing about how spread out it is.', kind: 'frq-vocab' },
    { content: 'Bigger n reduces variability, not bias. Don\'t claim a larger sample "removes bias" — bias is fixed by the estimator\'s design.', kind: 'common-error' },
    { content: 'A rubric asking "is this a good estimator?" wants TWO separate ideas: bias (center) AND variability (spread) — one alone is incomplete.', kind: 'gotcha' },
    { content: 'The sample SD s uses n − 1 in the denominator because using n would underestimate σ on average — an edge case worth knowing, not just memorizing.', kind: 'edge-case' },
  ],
};
