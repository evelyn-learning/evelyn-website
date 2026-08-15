/**
 * AP Statistics — Unit 7 CED 7.9–7.10: Two-Sample t-Test for Means.
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.two-mean-test.v1).
 * Key ideas consolidated into framework entries + an inline normal_curve
 * illustrating a p-value tail region; methods humanized from the
 * independent-samples worked example + a matched-pairs variant; pointers
 * enriched to the calibration standard.
 *
 * KaTeX note: inline math must not START with a digit, so every opener is a
 * letter or backslash.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.two-mean-test';

export const BASELINE_AP_STATS_TWO_MEAN_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.two-mean-test.v1',
  course: 'AP Statistics',
  cedUnit: 7,
  cedTopic: '7.9-7.10',
  cedTitle: 'Two-Sample t-Test for Means',
  planId: 'evelyn.ap.stats.two-mean-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.two-mean-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-sample t-test for μ₁ − μ₂ (independent samples)',
      content:
        '$H_0: \\mu_1=\\mu_2$ against a one- or two-sided $H_a$. Test statistic: $t=\\dfrac{\\bar{x}_1-\\bar{x}_2}{\\sqrt{s_1^2/n_1+s_2^2/n_2}}$, with conservative $df=\\min(n_1-1,n_2-1)$ by hand (or Welch df on a calculator).',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'p-value: upper-tail area beyond t = 2.883 (illustrative, df = 24)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { from: 2.883 },
          markValues: [{ x: 2.883, label: 't = 2.883' }],
          showSDLines: false,
          shadeArea: 0.00417,
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Matched-pairs t-test',
      content:
        'When data are PAIRED, test the mean difference instead: $H_0:\\mu_d=0$ against the appropriate $H_a$. Test statistic $t=\\dfrac{\\bar{d}-0}{s_d/\\sqrt{n}}$, with $df=n-1$ (n = number of pairs) — this is just the one-sample t-test applied to the differences.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing independent vs paired: the critical decision',
      content:
        '**Independent**: two separate groups with NO natural correspondence between individual observations (e.g., a random split into treatment/control). **Paired**: each unit contributes BOTH measurements, or there is a natural link (twins, couples, before/after on the same subject). Pick the test from the STUDY DESIGN, not from how the groups are labeled — "husbands and wives" sounds like two groups but is paired by couple.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions & conclusion',
      content:
        'Independent test: Random, Normal/Large in EACH sample, 10% in each population, independence between samples. Paired test: random sample of pairs, Normal/Large of the differences. Conclusion template: "Because $p=[\\#]$ is [$\\le$ / >] $\\alpha=[\\#]$, we [reject / fail to reject] $H_0$. There [is / is not] convincing statistical evidence that [claim in context]."',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'two-sample t-statistic',
      content:
        '$t=(\\bar{x}_1-\\bar{x}_2)/\\sqrt{s_1^2/n_1+s_2^2/n_2}$: how many standard errors the observed difference in sample means is from 0 (independent samples).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'matched-pairs t-test',
      content:
        'a one-sample t-test applied to the within-pair differences $d_i$, used when the two sets of measurements are linked rather than independent.',
    },
  ],
  methods: [
    {
      title: 'Carry out a two-sample t-test (independent samples)',
      when_to_use:
        'When comparing means of two independent groups and testing whether they differ.',
      steps: [
        'State hypotheses: $H_0:\\mu_1=\\mu_2$ vs the appropriate (one- or two-sided) $H_a$.',
        'Check conditions: Random; Normal/Large in each sample; 10% in each population; independence between samples.',
        'Compute $SE=\\sqrt{s_1^2/n_1+s_2^2/n_2}$ and $t=(\\bar{x}_1-\\bar{x}_2)/SE$.',
        'Find df (conservative $\\min(n_1-1,n_2-1)$, or technology/Welch) and the matching p-value.',
        'Compare p to α; reject $H_0$ if $p\\le\\alpha$, otherwise fail to reject.',
        'Conclude in context using the template.',
      ],
      example: {
        problem:
          'Two random samples of starting salaries (in thousands of dollars): Engineering: n = 25, x̄ = 72, s = 8. Business: n = 30, x̄ = 65, s = 10. Both data plots roughly symmetric. At α = 0.05, test whether engineering salaries are higher.',
        solution:
          'H0: μE = μB. Ha: μE > μB (one-sided). Conditions: Random ✓; Normal/Large ✓; 10% ✓; independence ✓. SE = √(8²/25 + 10²/30) = √(2.56 + 3.333) = √5.893 ≈ 2.428. t = (72 − 65)/2.428 ≈ 2.883, conservative df = min(24, 29) = 24. p-value = P(T24 ≥ 2.883) ≈ 0.00417. Since 0.00417 < 0.05, reject H0. "Because p = 0.0042 < α = 0.05, we reject H0. There IS convincing statistical evidence that mean starting salaries are higher for engineering than business graduates."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Carry out a matched-pairs t-test',
      when_to_use:
        'When the data are paired (before/after, twins, natural correspondence) rather than two independent groups.',
      steps: [
        'Compute the difference $d_i$ for each pair, consistent in direction.',
        'State hypotheses in terms of the mean difference: $H_0:\\mu_d=0$ vs the appropriate $H_a$.',
        'Compute $t=(\\bar{d}-0)/(s_d/\\sqrt{n})$ with $df=n-1$.',
        'Find the p-value matching the direction of $H_a$.',
        'Compare p to α and conclude in context, referencing the mean difference (not two separate means).',
      ],
      example: {
        problem:
          '15 students each take a math pretest and posttest. Differences (post − pre): mean d̄ = 6.4, s_d = 8.2. Test at α = 0.05 whether posttest scores are higher.',
        solution:
          'PAIRED. H0: μd = 0. Ha: μd > 0. Conditions: random sample of pairs ✓; Normal/Large of differences (assume) ✓. t = (6.4 − 0)/(8.2/√15) = 6.4/2.117 ≈ 3.024, df = 14. p-value = P(T14 ≥ 3.024) ≈ 0.00457. Since 0.00457 < 0.05, reject H0. "Because p = 0.0046 < α = 0.05, we reject H0. There IS convincing statistical evidence that the mean post-test score is higher than the mean pre-test score."',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Same conditions/logic as the one-sample t-test, just with the two-sample (or paired) SE and statistic plugged in.', kind: 'tip' },
    { content: 'Using the two-sample SE formula on paired data inflates the SE and gives a wrong t — always identify pairing first.', kind: 'common-error' },
    { content: 'Conservative df ($\\min(n_1-1,n_2-1)$) can give a noticeably larger p-value than the calculator’s Welch df — check which the problem expects.', kind: 'gotcha' },
    { content: 'When asked to choose a test, justify the choice by describing the STUDY DESIGN (natural pairing vs independent groups), not just the sample sizes.', kind: 'frq-vocab' },
    { content: 'A design that pairs subjects by a natural link (couples, twins, same-subject before/after) is matched-pairs even when the two "groups" have different sizes or labels — pairing overrides how the groups are described.', kind: 'edge-case' },
  ],
};
