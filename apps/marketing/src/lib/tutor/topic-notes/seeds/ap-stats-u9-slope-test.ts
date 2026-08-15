/**
 * AP Statistics — Unit 9 CED 9.4–9.5: Significance Test for the Slope
 * of a Regression Model.
 *
 * Hand-curated to the calibration standard (ap-stats-u2-*.ts, ap-stats-
 * u9-slope-ci.ts) from the source plan evelyn.ap.stats.slope-test.v1.
 * Theory covers hypotheses, the t-statistic, reading output, the
 * CI/test equivalence, and the correlation connection.
 *
 * KaTeX note: inline math must not START with a digit; every `$...$` opens
 * with a letter or command.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.slope-test';

export const BASELINE_AP_STATS_SLOPE_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.slope-test.v1',
  course: 'AP Statistics',
  cedUnit: 9,
  cedTopic: '9.4-9.5',
  cedTitle: 'Significance Test for a Slope',
  planId: 'evelyn.ap.stats.slope-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.slope-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Hypotheses and the t test statistic for the slope',
      content:
        'The hypotheses concern the POPULATION SLOPE $\\beta$: $H_0: \\beta = 0$ (no linear association between x and y) versus $H_a: \\beta \\ne 0$ (or the one-sided $H_a: \\beta > 0$ / $H_a: \\beta < 0$). The TEST STATISTIC is $t = \\dfrac{b - 0}{SE_b} = \\dfrac{b}{SE_b}$, with $df = n-2$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading the test statistic and p-value from output',
      content:
        'Computer output reports T = $b/SE_b$ directly in the x-row, and its P column is the TWO-SIDED p-value (matching $H_a: \\beta \\ne 0$). For a ONE-SIDED $H_a$, halve the reported p — but only when the sample $b$ points in the direction claimed by $H_a$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Stating the conclusion',
      content:
        'Template: "Because $p = [\\#]$ is [≤ / >] $\\alpha = [\\#]$, we [reject / fail to reject] $H_0$. There [is / is not] convincing statistical evidence of a linear association between [x in context] and [y in context]." Rejecting $H_0$ shows evidence of association, not causation, and does not confirm the relationship IS linear — only that the slope isn\'t 0 on average.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Connection to the correlation test',
      content:
        'Because $r \\ne 0$ if and only if $b \\ne 0$, testing $H_0: \\beta = 0$ is EQUIVALENT to testing $H_0: \\rho = 0$ (population correlation is 0) — both use the same $t$ and the same p-value.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'test statistic for the slope',
      content: '$t = b/SE_b$, with $df = n-2$; measures how many standard errors the sample slope is from 0.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'p-value (slope test)',
      content: 'the probability, if $H_0: \\beta = 0$ were true, of getting a $t$ statistic at least as extreme as the one observed; software reports it two-sided by default.',
    },
  ],
  methods: [
    {
      title: 'Conduct a t-test for the population slope',
      when_to_use:
        'When a computer regression output (or b, SE_b, and n) is given and the question asks whether there is a linear association — whether β ≠ 0, or one-directional.',
      steps: [
        'State hypotheses: $H_0: \\beta = 0$; $H_a: \\beta \\ne 0$ (or a one-sided $H_a$ if the question claims a direction).',
        'State/verify the LINER conditions.',
        'Compute $t = b/SE_b$ — or read T straight from the output.',
        '$df = n-2$; find or read the p-value (output reports two-sided; halve for a one-sided $H_a$ when the direction matches).',
        'Compare p to $\\alpha$: reject $H_0$ if $p \\le \\alpha$.',
        'Conclude in context, naming both variables, and avoid causal language.',
      ],
      example: {
        problem:
          'A regression of home price (y, in thousands of dollars) on square footage (x) for 50 homes gives:\nPredictor | Coef | SE Coef | T | P\nConstant | 25.4 | 12.8 | 1.98 | 0.053\nSqFt | 0.18 | 0.025 | 7.20 | 0.000\nAt α = 0.05, test whether home price increases linearly with square footage.',
        solution:
          'H0: β = 0; Ha: β > 0 (one-sided, since the claim is "increases"). t = 0.18/0.025 = 7.20, matching the output\'s T column. df = 50 − 2 = 48. The output\'s reported P = 0.000 is two-sided; since b > 0 matches Ha\'s direction, halve it: one-sided p ≈ 0.000 (< 0.001). Because p < 0.001 < α = 0.05, reject H0. There is convincing statistical evidence that home price increases linearly with square footage.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Reconcile a slope CI and a two-sided slope test',
      when_to_use: 'When asked whether a confidence interval and a significance test for the same slope give consistent conclusions.',
      steps: [
        'Build (or read) the C% CI for β: $b \\pm t^*\\,SE_b$, matching the test\'s significance level when $C = 100(1-\\alpha)$.',
        'Check whether 0 falls inside the CI.',
        'If 0 is OUTSIDE the CI, the two-sided test at $\\alpha = 1-C$ rejects $H_0$; if 0 is INSIDE, it fails to reject.',
        'State the equivalence explicitly: a 95% CI excluding 0 matches rejecting $H_0: \\beta = 0$ at $\\alpha = 0.05$ (two-sided).',
      ],
      example: {
        problem:
          'For a regression of test score on study hours (n = 30), b = 4.2 and SE_b = 0.9. At α = 0.05, the two-sided test gives t ≈ 4.67, df = 28, p < 0.001. Does a 95% CI for β corroborate this?',
        solution:
          't* for 95% with df = 28 ≈ 2.048. ME = 2.048(0.9) ≈ 1.843. CI: 4.2 ± 1.843 = (2.357, 6.043). Zero is NOT in the interval, consistent with rejecting H0: β = 0 at α = 0.05 — both procedures agree there is convincing evidence of a positive linear association between study hours and test score.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: '$t = b/SE_b$; $df = n-2$ — the same recipe as any one-sample t-statistic, just estimating β instead of μ.', kind: 'tip' },
    { content: 'Conclusion needs BOTH: compare p to α, AND a context sentence — "there is/is not convincing statistical evidence of a linear association between [x] and [y]."', kind: 'frq-vocab' },
    { content: 'Output reports the TWO-SIDED p-value by default — halve it for a one-sided Ha only when the sample b points in Ha\'s direction.', kind: 'common-error' },
    { content: 'Rejecting $H_0: \\beta = 0$ shows a linear association, not causation, and does not confirm the relationship IS linear — only that the slope isn\'t 0 on average.', kind: 'gotcha' },
    { content: 'A CI and a two-sided test at matching confidence/α levels always agree: 0 outside the CI ⟺ reject H0 — use whichever the question requests.', kind: 'edge-case' },
  ],
};
