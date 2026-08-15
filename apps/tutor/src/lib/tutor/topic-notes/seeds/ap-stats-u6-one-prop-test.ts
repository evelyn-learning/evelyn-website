/**
 * AP Statistics — Unit 6 CED 6.4–6.6: One-Proportion z-Test.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.one-prop-test.v1).
 * Theory tagged with kind/title + an inline normal_curve illustrating a
 * left-tail p-value, method humanized (four-step test + p-value
 * interpretation trap), pointers enriched to the calibration standard.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.one-prop-test';

export const BASELINE_AP_STATS_ONE_PROP_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.one-prop-test.v1',
  course: 'AP Statistics',
  cedUnit: 6,
  cedTopic: '6.4-6.6',
  cedTitle: 'One-Proportion z-Test',
  planId: 'evelyn.ap.stats.one-prop-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.one-prop-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Hypotheses for a one-proportion test',
      content:
        'A SIGNIFICANCE TEST asks whether sample evidence is strong enough to reject a default claim about the population proportion p. $H_0: p = p_0$ states the status-quo value (chosen from the problem, not the data). $H_a$ is one-sided ($p < p_0$ or $p > p_0$) or two-sided ($p \\ne p_0$), chosen from the question BEFORE seeing the data — never after.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Test statistic',
      content:
        'The test statistic uses the HYPOTHESIZED $p_0$ in the standard error, not $\\hat{p}$: $z = \\dfrac{\\hat{p}-p_0}{\\sqrt{p_0(1-p_0)/n}}$. This is the key difference from a confidence interval, whose SE uses $\\hat{p}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The p-value',
      content:
        'The P-VALUE is the probability of obtaining a test statistic at least as extreme as the one observed, ASSUMING $H_0$ is true. For $H_a: p > p_0$ (right-tail): $p\\text{-value} = P(Z \\ge z_{obs})$. For $H_a: p < p_0$ (left-tail): $P(Z \\le z_{obs})$. For $H_a: p \\ne p_0$ (two-tail): $p\\text{-value}=2\\cdot P(Z \\ge |z_{obs}|)$. It is NOT the probability that $H_0$ is true — it is the probability of the data given $H_0$.',
      diagram: {
        type: 'normal_curve',
        params: {
          title: 'p-value: left-tail area under H0 (coach free-throw example)',
          mean: 0,
          sd: 1,
          xMin: -4,
          xMax: 4,
          shadeRegion: { to: -1.54 },
          markValues: [{ x: -1.54, label: 'z ≈ −1.54' }],
          shadeArea: 0.062,
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Decision and conclusion',
      content:
        'Compare the p-value to the significance level $\\alpha$ (commonly 0.05). If $p\\text{-value} \\le \\alpha$: REJECT $H_0$ — convincing evidence for $H_a$. If $p\\text{-value} > \\alpha$: FAIL TO REJECT $H_0$ — not convincing evidence for $H_a$. Never say "accept $H_0$" — failing to reject is not proof $H_0$ is true. Template: "Because the p-value of [#] is [≤/>] $\\alpha=$[#], we [reject/fail to reject] $H_0$. There [is/is not] convincing statistical evidence that [$H_a$ in context]."',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions (using p0)',
      content:
        'Same three conditions as a CI, but Large Counts uses the HYPOTHESIZED $p_0$ (since $H_0$ is assumed true for the test): **Random** — SRS or random assignment. **Large Counts** — $np_0 \\ge 10$ and $n(1-p_0)\\ge10$. **10%** — $n \\le 0.10N$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'null hypothesis H0',
      content: 'the default claim being tested, usually $p=p_0$; assumed true until the data give convincing evidence otherwise.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'p-value',
      content: 'the probability of seeing a test statistic this extreme or more, computed ASSUMING $H_0$ is true — not the probability that $H_0$ is true.',
    },
  ],
  methods: [
    {
      title: 'Run a one-proportion z-test (four-step process)',
      when_to_use:
        'When asked to test a claim about a single population proportion against a hypothesized value $p_0$.',
      steps: [
        'State hypotheses: $H_0: p=p_0$ and $H_a$ (one- or two-sided) chosen from the question.',
        'Verify conditions: Random, Large Counts ($np_0\\ge10$ and $n(1-p_0)\\ge10$), 10%.',
        'Compute the test statistic $z=(\\hat{p}-p_0)/\\sqrt{p_0(1-p_0)/n}$.',
        'Find the p-value from the standard normal, matching the direction of $H_a$.',
        'Compare the p-value to $\\alpha$ and decide: reject or fail to reject $H_0$.',
        'State the conclusion in context, referencing the p-value and $\\alpha$.',
      ],
      example: {
        problem: 'A coach claims 70% of his free throws go in. In 50 attempts he makes 30. At α = 0.05, is there convincing evidence the coach is overstating his rate?',
        solution:
          '$\\hat{p}=30/50=0.60$, $n=50$, hypothesized $p_0=0.70$. $H_0: p=0.70$. $H_a: p<0.70$ (overstating means the true rate is lower). Conditions: Random (assume independent attempts) ✓; Large Counts: $np_0=50(0.70)=35\\ge10$ and $n(1-p_0)=50(0.30)=15\\ge10$ ✓. Test statistic $z=\\dfrac{0.60-0.70}{\\sqrt{0.70(0.30)/50}}\\approx-1.54$. Left-tail p-value: $P(Z\\le-1.54)\\approx0.062$. Since $p\\text{-value}=0.062>\\alpha=0.05$, fail to reject $H_0$: "Because the p-value of 0.062 is greater than α = 0.05, we fail to reject H₀. There is not convincing statistical evidence that the coach\'s true free-throw success rate is less than 70%."',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Interpret a p-value correctly',
      when_to_use:
        'When an AP question tests whether you understand what a p-value conditions on (a common multiple-choice/synthesis trap).',
      steps: [
        'Identify what event the p-value is the probability OF: data at least as extreme as observed.',
        'Identify what it is CONDITIONED ON: the null hypothesis being true.',
        'Reject readings that put the probability on $H_0$ or $H_a$ being true — AP Statistics is frequentist; parameters are fixed, not random.',
        'State the correct reading: "If $H_0$ is true, the probability of a result this extreme (or more) is [p-value]."',
      ],
      example: {
        problem: 'A test gives a p-value of 0.03. Which is the correct interpretation? (A) There is a 3% probability $H_0$ is true. (B) If $H_0$ is true, the probability of data this extreme or more is 3%. (C) There is a 3% probability $H_a$ is true.',
        solution:
          '(B) is correct. The p-value is the probability of the OBSERVED DATA (or more extreme), computed ASSUMING $H_0$ is true — a statement about the data given $H_0$, not a probability attached to $H_0$ or $H_a$ themselves. (A) and (C) both reverse the conditional direction, which only makes sense under a Bayesian prior on the hypothesis — not the frequentist framework used in AP Statistics.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Test uses $p_0$ in the SE; CI uses $\\hat{p}$. That is the one formula difference to remember between the two procedures.', kind: 'tip' },
    { content: 'Choosing $H_a$ after peeking at the data is invalid — the direction must come from the question, decided in advance.', kind: 'common-error' },
    { content: 'Never write "accept $H_0$." Say "fail to reject $H_0$" — insufficient evidence is not proof the null is true.', kind: 'frq-vocab' },
    { content: 'The p-value is $P(\\text{data} \\mid H_0)$, not $P(H_0 \\mid \\text{data})$ — reversing the conditional is the single most common AP misread.', kind: 'gotcha' },
    { content: 'Two-sided test: p-value $=2\\cdot P(Z\\ge|z_{obs}|)$ — double the one-tail area, and check the sign of $z_{obs}$ against $H_a$ before doubling.', kind: 'edge-case' },
  ],
};
