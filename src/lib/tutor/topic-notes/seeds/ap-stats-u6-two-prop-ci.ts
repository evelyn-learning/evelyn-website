/**
 * AP Statistics — Unit 6 CED 6.8–6.9: Two-Proportion z-Interval.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.two-prop-ci.v1).
 * Theory tagged with kind/title + an inline bar_chart comparing the two
 * sample proportions being contrasted, method humanized (interval
 * construction + reading a given interval for a difference), pointers
 * enriched to the calibration standard.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.two-prop-ci';

export const BASELINE_AP_STATS_TWO_PROP_CI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.two-prop-ci.v1',
  course: 'AP Statistics',
  cedUnit: 6,
  cedTopic: '6.8-6.9',
  cedTitle: 'Two-Proportion z-Interval',
  planId: 'evelyn.ap.stats.two-prop-ci.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.two-prop-ci.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-proportion z-interval',
      content:
        'To estimate the DIFFERENCE between two population proportions, build the interval around $\\hat{p}_1-\\hat{p}_2$: $(\\hat{p}_1-\\hat{p}_2)\\pm z^*\\sqrt{\\hat{p}_1(1-\\hat{p}_1)/n_1+\\hat{p}_2(1-\\hat{p}_2)/n_2}$. The two sample proportions stay SEPARATE (not pooled) — pooling is reserved for the significance test. The variances of the two samples ADD under the square root.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Sample proportions being compared before building the CI for the difference',
          categories: ['Men', 'Women'],
          values: [0.3, 0.16],
          yLabel: 'Sample proportion who smoke',
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions (verify in BOTH samples)',
      content:
        '**Random** — independent random samples or random assignment. **Large Counts** — in EACH sample: $n_1\\hat{p}_1\\ge10$, $n_1(1-\\hat{p}_1)\\ge10$, $n_2\\hat{p}_2\\ge10$, $n_2(1-\\hat{p}_2)\\ge10$. **10%** — each sample is less than 10% of its own population. The most common AP error is checking Large Counts in only ONE sample — both must be verified.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Interpreting the interval',
      content:
        'State the interval as a claim about the TRUE DIFFERENCE, always naming the order of subtraction: "We are C% confident that the true difference $p_1-p_2$ ([group 1] minus [group 2]) is between [lower] and [upper]." Swapping the subtraction order flips every sign in the interval, so name which group is first.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Using the interval to assess a difference',
      content:
        'If zero is INSIDE the interval, the data do not give convincing evidence that the two proportions differ at this confidence level. If zero is OUTSIDE the interval, the data give evidence of a real difference — and the sign of the bounds tells you which group is larger.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'two-proportion z-interval',
      content: '$(\\hat{p}_1-\\hat{p}_2)\\pm z^*\\sqrt{\\hat{p}_1(1-\\hat{p}_1)/n_1+\\hat{p}_2(1-\\hat{p}_2)/n_2}$ — a range of plausible values for the difference between two population proportions, built from separate (unpooled) sample proportions.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'pooled vs. unpooled proportion',
      content: 'a CI for a difference uses SEPARATE sample proportions $\\hat{p}_1,\\hat{p}_2$; the significance TEST instead uses one POOLED proportion $\\hat{p}_c$ — do not pool when constructing a confidence interval.',
    },
  ],
  methods: [
    {
      title: 'Construct and interpret a two-proportion z-interval',
      when_to_use:
        'When comparing an unknown difference between two population proportions from two independent samples.',
      steps: [
        'Compute both sample proportions: $\\hat{p}_1=x_1/n_1$ and $\\hat{p}_2=x_2/n_2$, then the difference $\\hat{p}_1-\\hat{p}_2$.',
        'Verify conditions in BOTH samples: Random, Large Counts (four checks), 10%.',
        'Find $z^*$ for the stated confidence level.',
        'Compute $SE=\\sqrt{\\hat{p}_1(1-\\hat{p}_1)/n_1+\\hat{p}_2(1-\\hat{p}_2)/n_2}$ and $ME=z^*\\cdot SE$.',
        'Build the interval $(\\hat{p}_1-\\hat{p}_2)\\pm ME$.',
        'Interpret in context, naming the subtraction order, and check whether zero is inside or outside.',
      ],
      example: {
        problem: 'A study finds 60 of 200 men smoke and 40 of 250 women smoke. Construct a 95% confidence interval for $p_{\\text{men}}-p_{\\text{women}}$.',
        solution:
          '$\\hat{p}_{\\text{men}}=60/200=0.30$, $\\hat{p}_{\\text{women}}=40/250=0.16$. The difference is $\\hat{p}_{\\text{men}}-\\hat{p}_{\\text{women}}=0.30-0.16=0.14$. Conditions: Random ✓ (assume independent samples). Large Counts (both samples): $n_1\\hat{p}_1=200(0.30)=60\\ge10$, $n_1(1-\\hat{p}_1)=200(0.70)=140\\ge10$, $n_2\\hat{p}_2=250(0.16)=40\\ge10$, $n_2(1-\\hat{p}_2)=250(0.84)=210\\ge10$ ✓. 10%: assume large populations ✓. $z^*=1.96$ for 95%. $SE=\\sqrt{0.30(0.70)/200+0.16(0.84)/250}\\approx0.0399$. $ME=1.96(0.0399)\\approx0.0782$. Interval: $\\hat{p}_{\\text{men}}-\\hat{p}_{\\text{women}}\\pm ME=0.14\\pm0.0782=(0.062, 0.218)$. "We are 95% confident that the true difference in smoking rates, men minus women, is between about 6.2% and 21.8%." Since zero is not in the interval, there is evidence men smoke at a higher rate.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Use a two-proportion interval to judge a difference',
      when_to_use:
        'When given a computed CI for $p_1-p_2$ and asked what it shows about whether the groups differ.',
      steps: [
        'Check whether zero falls inside or outside the stated interval (by eye, no calculation needed).',
        'If zero is INSIDE: conclude the data do not provide convincing evidence of a difference at this confidence level.',
        'If zero is OUTSIDE: conclude there is evidence of a real difference, and read the SIGN of the bounds to say which group is larger.',
        'Note that a WIDER interval (from a higher confidence level) is more likely to contain zero than a narrower one — the conclusion can change across confidence levels.',
      ],
      example: {
        problem: 'A 90% CI for $p_A-p_B$ (treatment minus control) is the interval from −0.02 to 0.08. What can be concluded about the difference?',
        solution:
          'Since zero falls inside $p_A-p_B\\in(-0.02, 0.08)$, the data do NOT give convincing statistical evidence that $p_A$ and $p_B$ differ at the 90% confidence level — the results are consistent with $p_A=p_B$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'CI for a difference: $(\\hat{p}_1-\\hat{p}_2)\\pm z^*\\sqrt{\\hat{p}_1(1-\\hat{p}_1)/n_1+\\hat{p}_2(1-\\hat{p}_2)/n_2}$ — separate p̂s, variances add.', kind: 'tip' },
    { content: 'Checking Large Counts in only one sample is the most common error — all four checks ($n_1\\hat{p}_1$, $n_1(1-\\hat{p}_1)$, $n_2\\hat{p}_2$, $n_2(1-\\hat{p}_2)$) are required.', kind: 'common-error' },
    { content: 'Name the subtraction order in every interpretation ("men minus women") — the interval\'s sign depends entirely on which group is subtracted first.', kind: 'frq-vocab' },
    { content: 'A CI never proves equality — zero inside the interval only means the data are CONSISTENT with no difference, not that there is no difference.', kind: 'gotcha' },
    { content: 'Use the two-proportion CI only when the two samples are INDEPENDENT — matched-pairs or before/after designs on the same subjects need a different procedure.', kind: 'edge-case' },
  ],
};
