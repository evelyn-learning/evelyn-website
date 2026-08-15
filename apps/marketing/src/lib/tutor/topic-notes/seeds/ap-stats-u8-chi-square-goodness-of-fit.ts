/**
 * AP Statistics — Unit 8 CED 8.1–8.3: Chi-Square Goodness-of-Fit Test.
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.chi-square-goodness-of-fit.v1).
 * Theory covers hypotheses/expected counts/statistic/df/p-value/conditions,
 * an inline bar chart contrasts observed vs expected M&M counts, the method
 * carries a full GOF test end to end, pointers enriched to the calibration
 * standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.chi-square-goodness-of-fit';

export const BASELINE_AP_STATS_CHI_SQUARE_GOODNESS_OF_FIT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.chi-square-goodness-of-fit.v1',
  course: 'AP Statistics',
  cedUnit: 8,
  cedTopic: '8.1-8.3',
  cedTitle: 'Chi-Square Goodness of Fit',
  planId: 'evelyn.ap.stats.chi-square-goodness-of-fit.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.chi-square-goodness-of-fit.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'One variable, a claimed distribution',
      content:
        'The CHI-SQUARE GOODNESS-OF-FIT (GOF) test uses ONE categorical variable with two or more categories, comparing observed counts to a distribution CLAIMED by $H_0$. $H_0$: the population proportions are as stated (e.g. $p_1 = 0.40, p_2 = 0.30, p_3 = 0.30$). $H_a$: at least one stated proportion is incorrect.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Expected counts and the test statistic',
      content:
        'Expected count in category i: $E_i = np_i$, where n is the total sample size and $p_i$ is the claimed proportion. Test statistic: $\\chi^2 = \\sum \\dfrac{(O_i-E_i)^2}{E_i}$, summed over all k categories. A larger $\\chi^2$ (bigger gap between observed and claimed) is stronger evidence against $H_0$.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Observed vs. expected M&M counts (n = 200)',
          yLabel: 'Count',
          categories: ['Brown O', 'Brown E', 'Yellow O', 'Yellow E', 'Red O', 'Red E', 'Blue O', 'Blue E', 'Orange O', 'Orange E', 'Green O', 'Green E'],
          values: [32, 26, 28, 28, 24, 26, 50, 48, 38, 40, 28, 32],
          colors: ['#3b82f6', '#9ca3af', '#3b82f6', '#9ca3af', '#3b82f6', '#9ca3af', '#3b82f6', '#9ca3af', '#3b82f6', '#9ca3af', '#3b82f6', '#9ca3af'],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Degrees of freedom and the p-value',
      content:
        '$df = k-1$ where k is the number of categories. The p-value is $P(\\chi^2 \\ge \\chi^2_{obs})$ read from the chi-square distribution with that df — ALWAYS a right-tail test (the chi-square distribution is skewed right, takes only non-negative values, and its peak shifts right as df grows).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions',
      content:
        '**Random**: the data come from a random sample. **Large Counts**: every expected count $E_i$ is at least 5 — check ALL of them, not the observed counts. **10%**: if sampling without replacement, the sample size is no more than 10% of the population. All three must hold before trusting the p-value.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'goodness-of-fit test',
      content: "a chi-square procedure testing whether one categorical variable's observed distribution matches a distribution claimed by $H_0$.",
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'expected count',
      content: "$E_i = np_i$ — the count you'd expect in category i if $H_0$ were exactly true.",
    },
  ],
  methods: [
    {
      title: 'Carry out a chi-square goodness-of-fit test',
      when_to_use: "When one categorical variable's observed counts need to be compared against a claimed (hypothesized) distribution.",
      steps: [
        'State $H_0$ (population proportions equal the claimed values) and $H_a$ (at least one differs).',
        'Compute expected counts $E_i = np_i$ for every category.',
        'Check conditions: Random, Large Counts (all $E_i \\ge 5$), 10%.',
        'Compute $\\chi^2 = \\sum (O_i-E_i)^2/E_i$ and $df = k-1$.',
        'Find the p-value $= P(\\chi^2 \\ge \\chi^2_{obs})$ with that df (right-tail).',
        'Compare the p-value to $\\alpha$ and state the decision and conclusion in context.',
      ],
      example: {
        problem:
          'A bag of M&Ms is claimed to have color proportions brown 13%, yellow 14%, red 13%, blue 24%, orange 20%, green 16%. A random sample of 200 M&Ms gives observed counts 32, 28, 24, 50, 38, 28 respectively. Test at α = 0.05 whether the actual distribution matches the claim.',
        solution:
          'H₀: p_brown=0.13, p_yellow=0.14, p_red=0.13, p_blue=0.24, p_orange=0.20, p_green=0.16 (claim holds). Hₐ: at least one proportion differs. Expected: E = 200·p → 26, 28, 26, 48, 40, 32 (all ≥ 5 ✓; Random ✓; 10% ✓, assuming large production). χ² = (32−26)²/26 + (28−28)²/28 + (24−26)²/26 + (50−48)²/48 + (38−40)²/40 + (28−32)²/32 = 1.385 + 0 + 0.154 + 0.083 + 0.100 + 0.500 ≈ 2.22. df = 6 − 1 = 5. p-value = P(χ²₅ ≥ 2.22) ≈ 0.82. Since 0.82 > 0.05, we fail to reject H₀ — there is not convincing evidence that the actual color distribution differs from the claim.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'GOF compares ONE categorical variable\'s observed counts to a CLAIMED distribution — always right-tailed, always $df = k-1$.', kind: 'tip' },
    { content: "Conclusion must name the claim: 'there IS/IS NOT convincing evidence the [population] distribution differs from the claimed distribution,' in context.", kind: 'frq-vocab' },
    { content: 'Large Counts checks the EXPECTED counts ($E_i \\ge 5$), not the observed counts — a very common point loss.', kind: 'common-error' },
    { content: 'Expected counts rarely come out as whole numbers ($E_i = np_i$) — do not round them before computing $\\chi^2$.', kind: 'gotcha' },
    { content: 'If any expected count is below 5, the chi-square approximation is unreliable — categories may need to be combined before testing.', kind: 'edge-case' },
  ],
};
