/**
 * AP Statistics — Unit 4 CED 4.8: Combining Random Variables.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.combining-rv.v1).
 * Theory tagged with kind/title to the calibration standard set by
 * ap-stats-u1-normal-distribution.ts / ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.combining-rv';

export const BASELINE_AP_STATS_COMBINING_RV: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.combining-rv.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.8',
  cedTitle: 'Combining Random Variables',
  planId: 'evelyn.ap.stats.combining-rv.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.combining-rv.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Linear transformation of a random variable',
      content:
        'For $Y = a + bX$ (shift by a, scale by b): $\\mu_Y = a + b\\mu_X$ (the mean shifts and scales), $\\sigma_Y = |b|\\cdot\\sigma_X$ (the SD scales by the size of b — a shift alone does not change spread), and $\\sigma^2_Y = b^2 \\cdot \\sigma^2_X$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Sum and difference of two random variables',
      content:
        'For any two random variables X and Y: $\\mu_{X+Y} = \\mu_X + \\mu_Y$ and $\\mu_{X-Y} = \\mu_X - \\mu_Y$ — means always add or subtract, independence not required. IF X and Y are INDEPENDENT: $\\sigma^2_{X+Y} = \\sigma^2_X + \\sigma^2_Y$ and $\\sigma^2_{X-Y} = \\sigma^2_X + \\sigma^2_Y$ — variance ALWAYS adds, even for a difference.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Variance always adds, even for differences (independent RVs)',
      content:
        'Intuitively, subtracting a noisy variable still adds its noise to the total uncertainty. So $\\sigma_{X\\pm Y} = \\sqrt{\\sigma^2_X + \\sigma^2_Y}$ when X and Y are independent — NEVER $\\sigma_X + \\sigma_Y$ and NEVER $\\sigma_X - \\sigma_Y$. The common mistake $\\sigma_{X+Y} = \\sigma_X + \\sigma_Y$ is always wrong for independent variables (it overstates the combined SD).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Common applications',
      content:
        'Total of N independent identical items: $\\mu_{\\text{total}} = N\\cdot\\mu$, $\\sigma^2_{\\text{total}} = N\\cdot\\sigma^2$. Difference between two independent measurements (e.g. two test scores): $\\mu_{\\text{diff}} = \\mu_A - \\mu_B$, $\\sigma^2_{\\text{diff}} = \\sigma^2_A + \\sigma^2_B$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'linear transformation',
      content: '$Y = a + bX$; the mean shifts by a and scales by b, and the SD scales by |b|.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'independent random variables',
      content: 'random variables where knowing the value of one gives no information about the other — required for the variance-addition rule.',
    },
  ],
  methods: [
    {
      title: 'Apply a linear transformation Y = a + bX',
      when_to_use:
        'When a random variable is rescaled and/or shifted (e.g. converting a count into a dollar amount).',
      steps: [
        'Identify a (the shift) and b (the scale factor) in Y = a + bX.',
        'Compute μ_Y = a + b·μ_X.',
        'Compute σ_Y = |b|·σ_X (use the absolute value of b).',
        'State both results with correct units.',
      ],
      example: {
        problem:
          'X = number of cars sold per day, with μ_X = 2.0, σ_X = 1.1. A salesperson earns Y = 50 + 200X dollars per day. Find μ_Y and σ_Y.',
        solution:
          'a = 50, b = 200. μ_Y = 50 + 200(2.0) = 450 dollars. σ_Y = 200(1.1) = 220 dollars (the shift of 50 does not affect the SD).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Combine two independent random variables (sum or difference)',
      when_to_use:
        'When two independent quantities are added or subtracted (e.g. total of two boxes, or the difference between two independent draws).',
      steps: [
        'Confirm (or assume, as stated) that the two random variables are independent.',
        'For the mean of the sum or difference, add or subtract the individual means directly.',
        'For the variance, ALWAYS add the two individual variances (σ² + σ²), regardless of sum or difference.',
        'Take the square root of the summed variance to get the combined SD.',
        'Never add or subtract the SDs directly.',
      ],
      example: {
        problem:
          'X = pens drawn from a box (μ_X = 3, σ_X = 1); Y = pencils drawn from an unrelated, independent box (μ_Y = 5, σ_Y = 2). Find the mean and SD of the total (X + Y) and of the difference (Y − X).',
        solution:
          'Total: μ_{X+Y} = 3 + 5 = 8. σ²_{X+Y} = 1² + 2² = 5, so σ_{X+Y} = √5 ≈ 2.236. Difference: μ_{Y−X} = 5 − 3 = 2. σ²_{Y−X} = 1² + 2² = 5 (variance still adds), so σ_{Y−X} = √5 ≈ 2.236.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Adding a constant shifts the mean but leaves the SD unchanged; multiplying by a constant scales both the mean and the SD.', kind: 'tip' },
    { content: 'FRQ vocab: justify a combined SD by writing "variances add" explicitly — do not just state the numeric answer.', kind: 'frq-vocab' },
    { content: 'σ_{X+Y} = σ_X + σ_Y is WRONG. Always add the variances first, then take the square root: σ_{X+Y} = √(σ²_X + σ²_Y).', kind: 'common-error' },
    { content: 'For X − Y, the variances still ADD (never subtract) — only the means subtract.', kind: 'gotcha' },
    { content: 'The variance-adds rule requires X and Y to be INDEPENDENT; if they are correlated, this simple addition no longer holds.', kind: 'edge-case' },
  ],
};
