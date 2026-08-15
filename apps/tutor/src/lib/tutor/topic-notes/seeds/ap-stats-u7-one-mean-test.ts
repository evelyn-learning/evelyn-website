/**
 * AP Statistics — Unit 7 CED 7.5–7.6: One-Sample t-Test for a Mean.
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.one-mean-test.v1).
 * Key ideas consolidated into framework/formula entries + an inline
 * normal_curve illustrating a p-value tail region; methods humanized from the
 * two-sided worked example + a one-sided variant; pointers enriched to the
 * calibration standard.
 *
 * KaTeX note: inline math must not START with a digit, so every opener is a
 * letter or backslash.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.one-mean-test';

export const BASELINE_AP_STATS_ONE_MEAN_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.one-mean-test.v1',
  course: 'AP Statistics',
  cedUnit: 7,
  cedTopic: '7.5-7.6',
  cedTitle: 'One-Sample t-Test for a Mean',
  planId: 'evelyn.ap.stats.one-mean-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.one-mean-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Hypotheses for a one-sample t-test',
      content:
        'Test a claim about a population mean μ. $H_0: \\mu = \\mu_0$ against $H_a: \\mu < \\mu_0$, $H_a: \\mu > \\mu_0$, or $H_a: \\mu \\ne \\mu_0$ (two-sided), chosen from the wording of the claim.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 't-statistic and df',
      content:
        '$t = \\dfrac{\\bar{x}-\\mu_0}{s/\\sqrt{n}}$, with $df = n-1$. This measures how many standard errors $\\bar{x}$ is from the hypothesized $\\mu_0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'p-value from the t-distribution',
      content:
        'The p-value is the probability, assuming $H_0$ is true, of a test statistic at least as extreme as the one observed. Right-tailed: $P(T_{df} \\ge t_{obs})$. Left-tailed: $P(T_{df} \\le t_{obs})$. Two-tailed: $P(T_{df} \\ge |t_{obs}|)\\cdot 2$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'p-value: upper-tail area beyond t = 2.143 (illustrative)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { from: 2.143 },
          markValues: [{ x: 2.143, label: 't = 2.143' }],
          showSDLines: false,
          shadeArea: 0.0212,
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions & conclusion template',
      content:
        'Conditions are identical to the t-interval: **Random**, **Normal/Large** (population Normal, or $n \\ge 30$, or the sample plot shows no strong skew/outliers), **10%**. Conclusion template: "Because $p = [\\#]$ is [$\\le$ / >] $\\alpha = [\\#]$, we [reject / fail to reject] $H_0$. There [is / is not] convincing statistical evidence that [claim in context]." Never say "accept $H_0$."',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 't-statistic',
      content:
        '$t=(\\bar{x}-\\mu_0)/(s/\\sqrt{n})$ with $df=n-1$: how many standard errors the sample mean is from the null value.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'p-value',
      content:
        'the probability, assuming $H_0$ is true, of getting a test statistic at least as extreme as the one observed.',
    },
  ],
  methods: [
    {
      title: 'Carry out a one-sample t-test for a mean',
      when_to_use:
        'When testing a claim about a single population mean μ and σ is unknown — the standard AP setup.',
      steps: [
        'State hypotheses: $H_0: \\mu=\\mu_0$ vs the appropriate $H_a$ from the claim’s wording.',
        'Check conditions: Random; Normal/Large; 10%.',
        'Compute the test statistic: $t=(\\bar{x}-\\mu_0)/(s/\\sqrt{n})$ and $df=n-1$.',
        'Find the p-value from the t-distribution (table or tcdf), matching the direction of $H_a$.',
        'Compare p to $\\alpha$: if $p \\le \\alpha$, reject $H_0$; otherwise fail to reject.',
        'Conclude in context using the template — never "accept $H_0$."',
      ],
      example: {
        problem:
          'A nutrition label claims the mean fat content is 8 g per serving. A SRS of 25 servings has x̄ = 8.6 g, s = 1.4 g. Histogram is roughly symmetric. At α = 0.05, test whether the actual fat content differs from the claim.',
        solution:
          'H0: μ = 8. Ha: μ ≠ 8 (two-sided). Conditions: Random ✓; Normal/Large — n = 25 < 30 but histogram roughly symmetric ✓; 10% ✓. t = (8.6 − 8)/(1.4/√25) = 0.6/0.28 ≈ 2.143, df = 24. p-value = 2·P(T24 ≥ 2.143) ≈ 0.0424. Since 0.0424 < 0.05, reject H0. "Because p = 0.0424 < α = 0.05, we reject H0. There IS convincing statistical evidence that the mean fat content differs from 8 g per serving."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'One-sided t-test',
      when_to_use:
        'When the claim specifies a direction ("at least", "less than", "more than") rather than "differs from."',
      steps: [
        'Hypotheses use a one-sided $H_a$ (e.g., $H_a: \\mu < \\mu_0$).',
        'The p-value is a single tail, matching the direction of $H_a$ — not doubled.',
        'All other steps (conditions, t-statistic, comparison to α, conclusion) are unchanged from the two-sided procedure.',
      ],
      example: {
        problem:
          'A teacher claims her students average at least 80 on the SAT. A SRS of 16 students has x̄ = 76, s = 12. The data look approximately normal. At α = 0.05, test whether the true mean is below 80.',
        solution:
          'H0: μ = 80. Ha: μ < 80. Conditions: Random ✓; Normal/Large (data approx normal) ✓; 10% ✓. t = (76 − 80)/(12/√16) = −4/3 ≈ −1.333, df = 15. p-value = P(T15 ≤ −1.333) ≈ 0.1014. Since 0.1014 > 0.05, fail to reject H0. "Because p ≈ 0.10 > α = 0.05, we fail to reject H0. There is NOT convincing statistical evidence that the true mean SAT is below 80."',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: '$t=(\\bar{x}-\\mu_0)/(s/\\sqrt{n})$, $df=n-1$ — same denominator (SE) as the t-interval.', kind: 'tip' },
    { content: 'Doubling (or forgetting to double) the tail probability: two-sided tests need $P(T\\ge|t|)\\cdot 2$; one-sided tests use a single tail only.', kind: 'common-error' },
    { content: 'The conclusion NEVER says "accept $H_0$" — only "reject" or "fail to reject," since failing to find evidence isn’t proof $H_0$ is true.', kind: 'gotcha' },
    { content: 'Conclusion must restate α, compare it to p explicitly, and finish "in context" naming the actual quantity being tested.', kind: 'frq-vocab' },
    { content: 'If the sample plot shows strong skew or an outlier and $n<30$, the Normal/Large condition fails — do not run the t-test blindly.', kind: 'edge-case' },
  ],
};
