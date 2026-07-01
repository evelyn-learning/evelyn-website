/**
 * AP Statistics — Unit 5 CED 5.3: The Central Limit Theorem.
 *
 * Hand-curated from the source plan
 * evelyn.ap.stats.central-limit-theorem.v1. Theory tagged with kind/title +
 * an inline normal_curve for the sampling distribution of x̄ from the adult
 * heights worked example, method humanized, pointers enriched to the
 * calibration standard (ap-stats-u1-*.ts, ap-stats-u2-correlation.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.central-limit-theorem';

export const BASELINE_AP_STATS_CENTRAL_LIMIT_THEOREM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.central-limit-theorem.v1',
  course: 'AP Statistics',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Central Limit Theorem',
  planId: 'evelyn.ap.stats.central-limit-theorem.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.central-limit-theorem.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'The Central Limit Theorem (CLT)',
      content:
        'For an SRS of size $n$ from ANY population with mean $\\mu$ and SD $\\sigma$, as $n$ increases, the sampling distribution of $\\bar{x}$ becomes approximately Normal — **regardless of the shape of the population**. Center: $\\mu_{\\bar{x}} = \\mu$. Spread: $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$. Shape: approximately Normal when $n$ is large (AP rule of thumb: $n \\ge 30$). This is the theorem that makes confidence intervals and significance tests possible.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Sampling distribution of x̄: N(70, 0.8), n = 25',
          mean: 70,
          sd: 0.8,
          xMin: 67.6,
          xMax: 72.4,
          showSDLines: true,
          shadeRegion: { from: 71 },
          markValues: [
            { x: 70, label: 'μ_x̄ = 70' },
            { x: 71, label: 'x̄ = 71' },
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When x̄ is Normal: two different routes',
      content:
        'There are two distinct justifications for treating $\\bar{x}$ as Normal — never conflate them. (1) The population itself is Normal → the sampling distribution of $\\bar{x}$ is **exactly** Normal for ANY sample size, even $n = 2$. (2) The population is NOT known to be Normal (or is skewed) → the CLT says the sampling distribution of $\\bar{x}$ is only **approximately** Normal, and only once $n$ is large ($n \\ge 30$).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three distributions — do not confuse them',
      content:
        'The **population distribution** is the distribution of individual values in the whole population. The **distribution of sample data** is the histogram of ONE sample\'s values — it resembles the population distribution and does not smooth out as $n$ grows. The **sampling distribution** is the distribution of $\\bar{x}$ across all possible samples of size $n$ — this is what the CLT describes and what narrows ($\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$) as $n$ grows.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Standard error of x̄',
      content:
        '$\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ — the SD of the sampling distribution of $\\bar{x}$, also called the **standard error**. As $n$ grows, individual high and low sample values average out, so variability shrinks by a factor of $\\sqrt{n}$ (not $n$).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'central limit theorem',
      content: 'the sampling distribution of $\\bar{x}$ approaches Normal as $n$ increases, regardless of the population\'s shape.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error',
      content: 'the SD of a sampling distribution; for $\\bar{x}$, $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$.',
    },
  ],
  methods: [
    {
      title: 'Describe the sampling distribution of x̄ and compute a probability',
      when_to_use:
        'When given a population mean/SD (or "roughly Normal"/"skewed" description) and an SRS of size n, and asked for a probability or shape of the sampling distribution of x̄.',
      steps: [
        'State the center: μ_x̄ = μ.',
        'Compute the spread: σ_x̄ = σ/√n.',
        'Justify the shape: population Normal → x̄ exactly Normal for any n; OR n ≥ 30 → approximately Normal by CLT.',
        'To find a probability, standardize: z = (x̄ − μ_x̄)/σ_x̄, then use normalcdf / the z-table.',
        'Answer in context, stating the probability as a percent.',
      ],
      example: {
        problem: 'Daily home power use is right-skewed with μ = 40 kWh, σ = 15 kWh. An SRS of 100 homes is taken. Describe the sampling distribution of x̄ and justify.',
        solution:
          'μ_x̄ = 40 kWh. σ_x̄ = 15/√100 = 1.5 kWh. Because n = 100 ≥ 30, the CLT applies even though the population is skewed, so the sampling distribution of x̄ is approximately N(40, 1.5).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'CLT: sampling distribution of x̄ → approximately Normal as n grows, REGARDLESS of population shape.', kind: 'tip' },
    { content: '$\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ — variability shrinks with √n, not n. Don\'t divide σ by n by mistake.', kind: 'common-error' },
    { content: 'FRQ justification must name the RIGHT route: "population is Normal" (exact, any n) OR "n ≥ 30" (approximate, via CLT) — never both muddled together.', kind: 'frq-vocab' },
    { content: 'Saying "x̄ is Normal because the population is Normal" when the population is actually skewed is a classic wrong justification — check which condition actually holds.', kind: 'gotcha' },
    { content: 'If neither the population is Normal NOR n ≥ 30, you cannot assume the sampling distribution of x̄ is Normal — say so rather than forcing the calculation.', kind: 'edge-case' },
  ],
};
