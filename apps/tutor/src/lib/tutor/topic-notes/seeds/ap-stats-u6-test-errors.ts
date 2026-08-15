/**
 * AP Statistics — Unit 6 CED 6.7: Type I/II Errors and Power.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.test-errors.v1).
 * Theory tagged with kind/title (no inline diagram — no catalog kind fits
 * error-type/power reasoning cleanly), methods humanized (identify errors
 * in context + interpret/increase power), pointers enriched to the
 * calibration standard.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.test-errors';

export const BASELINE_AP_STATS_TEST_ERRORS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.test-errors.v1',
  course: 'AP Statistics',
  cedUnit: 6,
  cedTopic: '6.7',
  cedTitle: 'Type I/II Errors and Power',
  planId: 'evelyn.ap.stats.test-errors.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.test-errors.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Type I error',
      content:
        'A TYPE I ERROR is rejecting $H_0$ when it is actually TRUE — a false alarm. $P(\\text{Type I error}) = \\alpha$, the significance level chosen before the test (commonly $\\alpha=0.05$).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Type II error',
      content:
        'A TYPE II ERROR is failing to reject $H_0$ when it is actually FALSE — a missed detection. $P(\\text{Type II error}) = \\beta$, which depends on how far the true parameter value is from $H_0$; lower $\\beta$ is better.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Power',
      content:
        'POWER is the probability of correctly REJECTING $H_0$ when it is false: $\\text{power} = 1-\\beta$. Power is always computed FOR A SPECIFIC alternative value of p — it increases as that true value moves further from $p_0$. A common target is $\\text{power}\\ge0.80$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The α–β trade-off and increasing power',
      content:
        'For a fixed n, lowering $\\alpha$ (e.g. to 0.01) reduces Type I errors but increases $\\beta$ (lowers power); raising $\\alpha$ does the reverse. Without changing $\\alpha$, power increases by: **increasing sample size n**, testing against a **larger effect size** (true value further from $p_0$), **reducing variability**, or using a **one-sided test** when a directional $H_a$ is justified.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing α from context',
      content:
        'When Type I error is the more serious consequence (e.g., wrongly approving an unsafe treatment), use a SMALL $\\alpha$ (0.01). When Type II error is more serious (e.g., missing a real disease or effect), use a LARGER $\\alpha$ (0.10) or invest in a bigger sample. The choice is always justified by the CONSEQUENCES in context, not a fixed rule.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Type I error',
      content: 'rejecting a true $H_0$; probability $=\\alpha$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Type II error',
      content: 'failing to reject a false $H_0$; probability $=\\beta$.',
    },
  ],
  methods: [
    {
      title: 'Identify Type I and Type II errors in context',
      when_to_use:
        'When a scenario states $H_0$/$H_a$ and asks you to describe the two error types (or which is worse) IN CONTEXT.',
      steps: [
        'Restate $H_0$ and $H_a$ for the scenario.',
        'Type I: describe what it means to REJECT $H_0$ when $H_0$ is actually TRUE, in the scenario\'s words.',
        'Type II: describe what it means to FAIL TO REJECT $H_0$ when $H_0$ is actually FALSE, in the scenario\'s words.',
        'State the real-world consequence of each error, then judge which is worse given the stakes described.',
      ],
      example: {
        problem: 'A drug company tests whether a new drug is more effective than the standard ($H_0$: same; $H_a$: better). Describe a Type I error and a Type II error in context, and say which is worse.',
        solution:
          'Type I error: rejecting $H_0$ when the drugs are actually the SAME — concluding the new drug is better when it is not, so patients get prescribed an ineffective (possibly riskier) drug. Type II error: failing to reject $H_0$ when the new drug actually IS better — concluding no improvement when there really is one, so patients miss out on a real benefit. Which is worse depends on context: if the new drug has side effects or replaces a working treatment, Type I is worse (use a small $\\alpha$); if patients are suffering with no good alternative, Type II is worse (use a larger $\\alpha$ or a bigger sample).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Interpret a stated power value and increase it',
      when_to_use:
        'When given a numeric power (or $\\beta$) against a specific alternative and asked to interpret it or improve it.',
      steps: [
        'Convert between power and $\\beta$: $\\beta = 1-\\text{power}$.',
        'State power as a DETECTION probability: "if the true parameter is [alternative value], there is a [power] chance the test correctly rejects $H_0$."',
        'State the complement as a MISS probability: $\\beta$ chance of failing to detect a real effect at that alternative.',
        'Propose a way to raise power without changing $\\alpha$: bigger n, larger effect, or less variability.',
      ],
      example: {
        problem: 'A factory tests whether a process change reduced a 5% defective rate ($H_0: p=0.05$, $H_a: p<0.05$), $n=200$. The true rate is now 3%, and power against this alternative is 0.65. Interpret this and suggest one way to increase power.',
        solution:
          'A stated $\\text{power}=0.65$ means: if the true defective rate really has dropped to 3%, there is a 65% chance the test correctly rejects $H_0$ and detects the improvement — and a $\\beta=0.35$ (35%) chance of missing that real improvement (Type II error). To raise power without changing $\\alpha$, increase the sample size beyond $n=200$ (e.g., to 400 or 600) or reduce measurement noise in the inspection process.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: '$\\alpha=P(\\text{Type I})$; $\\beta=P(\\text{Type II})$; $\\text{power}=1-\\beta$. Memorize these three probability identities.', kind: 'tip' },
    { content: 'Power is not "the probability the test is right in general" — it is defined FOR one specific alternative value; it changes as that value moves.', kind: 'common-error' },
    { content: 'Describe each error as an ACTION plus a TRUTH: "reject $H_0$ [action] when $H_0$ is true [truth]" for Type I; swap both for Type II.', kind: 'frq-vocab' },
    { content: 'Lowering $\\alpha$ to reduce Type I errors automatically raises $\\beta$ (lowers power) for a fixed n — you cannot shrink both risks at once without more data.', kind: 'gotcha' },
    { content: 'When asked "which error is worse," there is no universal answer — credit depends on correctly tying the consequence in context to the choice of a larger or smaller $\\alpha$.', kind: 'edge-case' },
  ],
};
