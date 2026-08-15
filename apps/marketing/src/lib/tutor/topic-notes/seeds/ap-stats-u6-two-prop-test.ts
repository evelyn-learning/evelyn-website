/**
 * AP Statistics — Unit 6 CED 6.10–6.11: Two-Proportion z-Test.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.two-prop-test.v1).
 * Theory tagged with kind/title + an inline normal_curve illustrating a
 * left-tail p-value, method humanized (pooled four-step test + the
 * pool-vs-don't-pool decision), pointers enriched to the calibration
 * standard.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.two-prop-test';

export const BASELINE_AP_STATS_TWO_PROP_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.two-prop-test.v1',
  course: 'AP Statistics',
  cedUnit: 6,
  cedTopic: '6.10-6.11',
  cedTitle: 'Two-Proportion z-Test',
  planId: 'evelyn.ap.stats.two-prop-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.two-prop-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Hypotheses for a two-proportion test',
      content:
        '$H_0: p_1=p_2$ (equivalently $p_1-p_2=0$). $H_a$ is $p_1\\ne p_2$, $p_1<p_2$, or $p_1>p_2$, chosen from the question before seeing the data.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Pooled proportion',
      content:
        'Under $H_0$, both samples come from ONE common proportion, so pool them: $\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$ — combine successes and combine sample sizes, then divide.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Test statistic',
      content:
        'The test statistic uses the POOLED proportion in the SE: $z=\\dfrac{\\hat{p}_1-\\hat{p}_2}{\\sqrt{\\hat{p}_c(1-\\hat{p}_c)\\left(1/n_1+1/n_2\\right)}}$. This is the key contrast with the two-proportion CI, whose SE uses separate (unpooled) $\\hat{p}_1,\\hat{p}_2$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'p-value: left-tail area (vaccine reduces flu, one-sided test)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { to: -2.7 },
          markValues: [{ x: -2.7, label: 'z ≈ −2.70' }],
          shadeArea: 0.0035,
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions (using the pooled proportion)',
      content:
        '**Random** — independent random samples or random assignment. **Large Counts**, using $\\hat{p}_c$ in BOTH samples: $n_1\\hat{p}_c\\ge10$, $n_1(1-\\hat{p}_c)\\ge10$, $n_2\\hat{p}_c\\ge10$, $n_2(1-\\hat{p}_c)\\ge10$. **10%** — each sample less than 10% of its population.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Pooled (test) vs. unpooled (interval) — do not mix them up',
      content:
        'The CONFIDENCE INTERVAL for $p_1-p_2$ uses separate sample proportions in its SE because it does not assume the proportions are equal. The SIGNIFICANCE TEST pools them into $\\hat{p}_c$ because $H_0$ explicitly assumes $p_1=p_2$, so it estimates that single common value from all the data. Using separate p̂s in a test SE is the single most common AP error on this topic.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'pooled proportion',
      content: '$\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$: the combined success proportion across both samples, used only in the SE of the two-proportion test statistic.',
    },
  ],
  methods: [
    {
      title: 'Run a two-proportion z-test (pooled)',
      when_to_use:
        'When testing whether two population proportions are equal from two independent samples.',
      steps: [
        'State hypotheses: $H_0: p_1=p_2$ and $H_a$ (one- or two-sided) from the question.',
        'Compute the pooled proportion $\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$.',
        'Verify conditions using $\\hat{p}_c$ in BOTH samples: Random, Large Counts (four checks), 10%.',
        'Compute the test statistic $z=(\\hat{p}_1-\\hat{p}_2)/\\sqrt{\\hat{p}_c(1-\\hat{p}_c)(1/n_1+1/n_2)}$.',
        'Find the p-value matching the direction of $H_a$ and compare to $\\alpha$.',
        'Conclude in context: reject or fail to reject $H_0$, referencing the p-value and $\\alpha$.',
      ],
      example: {
        problem: 'A vaccine trial: 35 of 500 vaccinated patients got the flu; 60 of 500 placebo patients got the flu. At α = 0.05, test whether the vaccine reduces flu rate.',
        solution:
          '$\\hat{p}_{\\text{vac}}=35/500=0.07$, $\\hat{p}_{\\text{plac}}=60/500=0.12$. $H_0: p_{\\text{vac}}=p_{\\text{plac}}$. $H_a: p_{\\text{vac}}<p_{\\text{plac}}$ (one-sided — testing for a REDUCTION). Pooled: $\\hat{p}_c=(35+60)/(500+500)=95/1000=0.095$. Conditions: Random (assume randomized trial) ✓. Large Counts: $n_1\\hat{p}_c=500(0.095)=47.5\\ge10$ and $n_1(1-\\hat{p}_c)=500(0.905)=452.5\\ge10$ (symmetric checks pass for the placebo group too) ✓. $SE=\\sqrt{\\hat{p}_c(1-\\hat{p}_c)(1/500+1/500)}\\approx0.0185$. $z=(0.07-0.12)/0.0185\\approx-2.70$. Left-tail $p\\text{-value}=P(Z\\le-2.70)\\approx0.0035$. Since $p\\text{-value}=0.0035<\\alpha=0.05$, reject $H_0$: "Because the p-value of 0.0035 is less than α = 0.05, we reject H₀. There is convincing statistical evidence that the vaccine reduces the flu rate compared to placebo."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide: pool or don\'t pool?',
      when_to_use:
        'Anytime you are comparing two proportions and unsure whether the SE should use pooled or separate estimates.',
      steps: [
        'Ask: does the calculation ASSUME $p_1=p_2$? A significance test does (that is what $H_0$ states) — pool.',
        'A confidence interval does NOT assume equality (it is estimating the unknown difference) — use separate $\\hat{p}_1,\\hat{p}_2$.',
        'If pooling, compute $\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$ and use it in BOTH the SE and the Large Counts check.',
        'If not pooling, use each sample\'s own $\\hat{p}$ in the SE and in its own Large Counts check.',
      ],
      example: {
        problem: 'Given the same two-sample count data, would you pool to build a 95% CI for $p_1-p_2$, or to test $H_0: p_1=p_2$?',
        solution:
          'Pool ONLY for the test — $H_0: p_1=p_2$ assumes one common proportion, so $\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$ estimates it from all the data. The confidence interval makes no such assumption (it is trying to estimate the size of a possibly nonzero difference), so it uses the separate $\\hat{p}_1$ and $\\hat{p}_2$ in its SE.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Pool for the TEST ($\\hat{p}_c=(x_1+x_2)/(n_1+n_2)$); keep proportions SEPARATE for the CI. One phrase to remember: "test pools, interval doesn\'t."', kind: 'tip' },
    { content: 'Using separate $\\hat{p}_1,\\hat{p}_2$ in the test\'s SE (instead of pooling) is the single most common error on this topic.', kind: 'common-error' },
    { content: 'Verify Large Counts with $\\hat{p}_c$ in BOTH samples for a test — not with each sample\'s own $\\hat{p}$.', kind: 'frq-vocab' },
    { content: '$H_0: p_1=p_2$ is equivalent to $H_0: p_1-p_2=0$ — either form is acceptable, but be consistent with how you write $H_a$.', kind: 'gotcha' },
    { content: 'A large sample-size imbalance ($n_1\\ne n_2$) does not change the pooling formula — $\\hat{p}_c$ still combines total successes over total trials.', kind: 'edge-case' },
  ],
};
