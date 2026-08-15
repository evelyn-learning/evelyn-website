/**
 * AP Statistics — Unit 7 CED 7.7–7.8: Two-Sample t-Interval for Means.
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.two-mean-ci.v1).
 * Key ideas consolidated into framework entries + an inline normal_curve
 * illustrating the sampling distribution's middle confidence region;
 * methods humanized from the independent-samples worked example + a
 * matched-pairs variant; pointers enriched to the calibration standard.
 *
 * KaTeX note: inline math must not START with a digit, so every opener is a
 * letter or backslash.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.two-mean-ci';

export const BASELINE_AP_STATS_TWO_MEAN_CI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.two-mean-ci.v1',
  course: 'AP Statistics',
  cedUnit: 7,
  cedTopic: '7.7-7.8',
  cedTitle: 'Two-Sample t-Interval for Means',
  planId: 'evelyn.ap.stats.two-mean-ci.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.two-mean-ci.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-sample t-interval for μ₁ − μ₂',
      content:
        'For two INDEPENDENT samples: $(\\bar{x}_1-\\bar{x}_2) \\pm t^*\\sqrt{\\dfrac{s_1^2}{n_1}+\\dfrac{s_2^2}{n_2}}$. Because the samples are independent, VARIANCES ADD: $SE=\\sqrt{s_1^2/n_1+s_2^2/n_2}$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'Sampling distribution of x̄₁ − x̄₂: middle 95% (illustrative)',
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
      kind: 'framework',
      title: 'Degrees of freedom: conservative vs technology',
      content:
        'By hand, AP uses the CONSERVATIVE df $= \\min(n_1-1, n_2-1)$ — a smaller df means a larger $t^*$, so this is a safe (wider) choice. A calculator instead reports the Welch–Satterthwaite df, typically larger, giving a slightly narrower interval.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions',
      content:
        '**Random**: independent random samples or random assignment. **Normal/Large**: each population Normal, OR each $n_i \\ge 30$, OR each sample plot shows no strong skew/outliers. **10%**: check in EACH population when sampling without replacement. **Independence** between the two samples (no pairing).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Matched pairs is NOT a two-sample procedure',
      content:
        'When each subject contributes a PAIR of measurements (before/after, twins, left/right hand), compute the differences $d_i$ and run a ONE-SAMPLE t-interval on the differences — $\\bar{d} \\pm t^*\\, s_d/\\sqrt{n}$ with $df=n-1$ (n = number of pairs). Do NOT use the two-sample formula on paired data; it ignores the within-pair correlation and gives the wrong SE.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'matched-pairs design',
      content:
        'a design where each experimental unit yields a pair of measurements (e.g., before/after); analyzed with a one-sample t-procedure on the differences, not the two-sample formula.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error of x̄₁ − x̄₂',
      content:
        '$SE=\\sqrt{s_1^2/n_1+s_2^2/n_2}$: the estimated SD of the sampling distribution of the difference in sample means, valid only when the two samples are independent.',
    },
  ],
  methods: [
    {
      title: 'Construct a two-sample t-interval for μ₁ − μ₂ (independent samples)',
      when_to_use:
        'When comparing means of two independent groups and asked for a confidence interval for the difference.',
      steps: [
        'Check conditions: Random (independent samples/random assignment); Normal/Large in each group; 10% in each population; independence between samples.',
        'Compute the difference in sample means: $\\bar{x}_1-\\bar{x}_2$.',
        'Compute $SE=\\sqrt{s_1^2/n_1+s_2^2/n_2}$.',
        'Find df: conservative $\\min(n_1-1,n_2-1)$ by hand, or technology (Welch) df on a calculator; look up $t^*$.',
        'Compute $ME=t^*\\cdot SE$ and form $(\\bar{x}_1-\\bar{x}_2)\\pm ME$.',
        'Interpret in context, noting which group minus which, and whether 0 is in the interval.',
      ],
      example: {
        problem:
          'Compare height of two breeds of dog. Breed A: 25 dogs, x̄ = 14.2 in, s = 1.8. Breed B: 20 dogs, x̄ = 12.6 in, s = 2.1. Both samples random; data plots approximately normal. Construct a 95% CI for μA − μB.',
        solution:
          'Conditions: Random ✓; Normal/Large ✓; 10% ✓. Diff = 14.2 − 12.6 = 1.6. SE = √(1.8²/25 + 2.1²/20) = √(0.1296 + 0.2205) = √0.3501 ≈ 0.5917. Conservative df = min(24, 19) = 19, t* for 95% ≈ 2.093 (calculator Welch df ≈ 38, t* ≈ 2.024 — narrower). ME = 2.093(0.5917) ≈ 1.238. CI: 1.6 ± 1.238 = (0.36, 2.84) inches. "We are 95% confident that the true difference (Breed A − Breed B) in height is between 0.36 and 2.84 inches. Since 0 is not in the interval, there is evidence Breed A is taller on average."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Construct a matched-pairs t-interval',
      when_to_use:
        'When the data are PAIRED (each subject/unit gives two linked measurements) — check this before choosing a method.',
      steps: [
        'Compute the difference $d_i$ for each pair (careful and consistent about the order of subtraction).',
        'Treat the differences as ONE sample: find $\\bar{d}$, $s_d$, and $n$ = number of pairs.',
        'Check conditions on the DIFFERENCES: random sample of pairs; Normal/Large of the differences; 10%.',
        'Find df $=n-1$ and $t^*$ for the confidence level.',
        'Compute $ME=t^*\\cdot s_d/\\sqrt{n}$ and form $\\bar{d}\\pm ME$.',
        'Interpret in context as the true mean difference (paired).',
      ],
      example: {
        problem:
          'A study measures blood pressure of 12 patients before and after taking a drug. Differences (before − after): mean d̄ = 8 mmHg, s_d = 5 mmHg. Construct a 90% CI for the true mean reduction.',
        solution:
          'PAIRED data: treat differences as one sample. n = 12, df = 11. t* for 90% with df = 11 ≈ 1.796. SE = 5/√12 ≈ 1.443. ME = 1.796(1.443) ≈ 2.592. CI: 8 ± 2.592 = (5.41, 10.59). Conditions: Random (assume) ✓; Normal/Large of differences — n = 12 < 30, assume roughly symmetric ✓; 10% ✓. "We are 90% confident that the true mean reduction in blood pressure is between 5.41 and 10.59 mmHg."',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Independent samples → variances ADD under the square root: $SE=\\sqrt{s_1^2/n_1+s_2^2/n_2}$.', kind: 'tip' },
    { content: 'Applying the two-sample formula to PAIRED data is the most common AP error — always ask "does each subject give one measurement or two linked ones?" first.', kind: 'common-error' },
    { content: 'By-hand conservative df ($\\min(n_1-1,n_2-1)$) gives a WIDER interval than the calculator’s Welch df — both are acceptable, but be consistent within a problem.', kind: 'gotcha' },
    { content: 'Interpretation must state which mean is subtracted from which (order matters) and note whether 0 falls in the interval (evidence of a difference or not).', kind: 'frq-vocab' },
    { content: 'If a design pairs subjects (twins, couples, before/after) even though the groups "sound" separate, the correct method is still matched-pairs, not two-sample.', kind: 'edge-case' },
  ],
};
