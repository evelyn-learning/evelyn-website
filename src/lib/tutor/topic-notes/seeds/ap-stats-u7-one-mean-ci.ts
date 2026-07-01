/**
 * AP Statistics — Unit 7 CED 7.1–7.4: One-Sample t-Interval for a Mean.
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.one-mean-ci.v1).
 * Key ideas consolidated into framework/formula entries + an inline
 * normal_curve illustrating the (heavier-tailed) t-distribution's middle
 * confidence region; methods humanized from the worked example + a small-n
 * conditions check; pointers enriched to the calibration standard
 * (ap-stats-u1-normal-distribution.ts / ap-stats-u2-*.ts).
 *
 * KaTeX note: inline math must not START with a digit, so every opener is a
 * letter or backslash (`$\bar{x}$`, `$t = ...$`, `$df = n-1$`).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.one-mean-ci';

export const BASELINE_AP_STATS_ONE_MEAN_CI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.one-mean-ci.v1',
  course: 'AP Statistics',
  cedUnit: 7,
  cedTopic: '7.1-7.4',
  cedTitle: 'One-Sample t-Interval for a Mean',
  planId: 'evelyn.ap.stats.one-mean-ci.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.one-mean-ci.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Why t, not z?',
      content:
        'When estimating a population mean, $\\sigma$ is almost always UNKNOWN, so we use the sample SD $s$ in its place. Substituting $s$ for $\\sigma$ adds extra uncertainty, so $(\\bar{x}-\\mu)/(s/\\sqrt{n})$ follows a t-DISTRIBUTION — bell-shaped and symmetric like the normal, but with HEAVIER TAILS, and it approaches the standard normal as $df \\to \\infty$. Because the tails are heavier, $t^* > z^*$ for the same confidence level, so a t-interval is always WIDER than a (hypothetical) z-interval built from the same data — the price of not knowing $\\sigma$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 't-distribution: middle 95% for df = 19 (illustrative)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { from: -2.093, to: 2.093 },
          markValues: [
            { x: -2.093, label: '−t*' },
            { x: 2.093, label: '+t*' },
          ],
          showSDLines: false,
          shadeArea: 0.95,
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'One-sample t-interval for μ',
      content:
        '$\\bar{x} \\pm t^*\\,\\dfrac{s}{\\sqrt{n}}$, with $df = n-1$. The margin of error is $t^*\\cdot s/\\sqrt{n}$: $t^*$ is the critical value from the t-distribution at confidence level C and $df=n-1$; $s/\\sqrt{n}$ is the standard error of $\\bar{x}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions for a t-interval',
      content:
        '**Random**: an SRS or random assignment. **Normal/Large**: the population is (approximately) Normal, OR $n \\ge 30$ (CLT applies regardless of shape), OR a graph of the sample data (dotplot, stemplot, boxplot) shows no strong skew or outliers. **10%**: check $n \\le 0.10N$ when sampling without replacement, for independence.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 't-distribution',
      content:
        'the distribution of $(\\bar{x}-\\mu)/(s/\\sqrt{n})$ when sampling from a Normal population; bell-shaped, symmetric about 0, with heavier tails than $N(0,1)$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'degrees of freedom (df)',
      content:
        '$df = n-1$ for a one-sample t-procedure on a mean; determines exactly which t-distribution (and which $t^*$) applies.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error (SE)',
      content:
        '$SE = s/\\sqrt{n}$: the estimated standard deviation of the sampling distribution of $\\bar{x}$, used in place of $\\sigma/\\sqrt{n}$.',
    },
  ],
  methods: [
    {
      title: 'Construct a one-sample t-interval for a mean',
      when_to_use:
        'When asked for a confidence interval for a single population mean μ and σ is unknown (the usual case).',
      steps: [
        'Check conditions: Random; Normal/Large (population Normal, or n ≥ 30, or the sample plot shows no strong skew/outliers); 10%.',
        'Find df = n − 1 and look up $t^*$ for the stated confidence level (table or invT).',
        'Compute the standard error: $SE = s/\\sqrt{n}$.',
        'Compute the margin of error: $ME = t^*\\cdot SE$.',
        'Form the interval: $\\bar{x} \\pm ME$.',
        'Interpret in context: "We are C% confident that the true mean [parameter] is between [lower] and [upper]."',
      ],
      example: {
        problem:
          'A sample of 20 batteries: x̄ = 850 hours, s = 60 hours. Construct a 95% CI for the mean lifetime, assuming the population is approximately normal.',
        solution:
          'n = 20, df = 19. Conditions: Random ✓ (assumed); Normal/Large — population stated approximately normal ✓; 10% ✓ (assumed large population). t* for 95% with df = 19 ≈ 2.093. SE = 60/√20 ≈ 13.42. ME = 2.093(13.42) ≈ 28.08. CI: 850 ± 28.08 = (821.92, 878.08). "We are 95% confident that the mean lifetime of these batteries is between 822 and 878 hours."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Check conditions before trusting a small-sample t-interval',
      when_to_use:
        'When n < 30 and you must justify the Normal/Large condition from a graph, or decide a t-interval is NOT appropriate.',
      steps: [
        'If n ≥ 30, the Normal/Large condition is satisfied by the CLT regardless of population shape — proceed.',
        'If n < 30, examine a graph (dotplot/stemplot/boxplot) of the sample: no strong skew and no outliers → condition met.',
        'If the sample shows strong skew or an outlier and n is small, the t-interval is UNRELIABLE — do not compute it blindly.',
        'Options when conditions fail: investigate/verify the outlier, collect a larger sample (n ≥ 30), or use a nonparametric method (outside AP scope).',
      ],
      example: {
        problem:
          'A SRS of 8 reaction times has mean x̄ = 0.45 sec, s = 0.08 sec. The dotplot shows ONE clear outlier at 0.28 sec. (a) Are conditions met for a t-CI? (b) What might you do?',
        solution:
          '(a) Random ✓; 10% ✓. Normal/Large: n = 8 < 30 AND the dotplot has an outlier → NOT met. (b) Investigate the outlier (error vs genuine — remove and recheck if it is an error), take a larger sample (n ≥ 30) so the CLT applies regardless of shape, or use a non-parametric method (beyond AP scope). Do not blindly compute the t-CI.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The t-interval formula is $\\bar{x} \\pm t^*\\,s/\\sqrt{n}$ with $df=n-1$ — always find $t^*$ from the t-table (or invT), never the z-table.', kind: 'tip' },
    { content: 'Using $n \\ge 30$ alone is not enough if the problem describes strong skew or an outlier for a small n — check the graph, don’t default to CLT.', kind: 'common-error' },
    { content: 'A t-interval is always wider than a z-interval built from the same data (heavier tails), so don’t be surprised the margin of error looks larger than expected.', kind: 'gotcha' },
    { content: 'Interpretation must name the CONFIDENCE LEVEL, the PARAMETER in context, and the INTERVAL — a bare number range earns no credit.', kind: 'frq-vocab' },
    { content: 'Small n (< 30) with strong skew or an outlier in the sample plot makes the t-interval unreliable — the Normal/Large condition fails and the method should not be used blindly.', kind: 'edge-case' },
  ],
};
