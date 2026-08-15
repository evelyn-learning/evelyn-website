/**
 * AP Calculus BC — Unit 6 CED 6.13: Improper Integrals (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.improper-integrals.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: theory entries carry kind+title, methods are
 * humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \lim, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.improper-integrals';

export const BASELINE_AP_CALCBC_IMPROPER_INTEGRALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.improper-integrals.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.13',
  cedTitle: 'Improper Integrals (BC)',
  planId: 'evelyn.ap.calcbc.improper-integrals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.improper-integrals.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'What makes an integral improper',
      content:
        'An integral is IMPROPER if it has an infinite limit of integration (e.g. $\\displaystyle\\int_1^{\\infty}$) or an integrand with an infinite DISCONTINUITY on the interval (e.g. $\\tfrac{1}{\\sqrt{x}}$ at $x=0$). Either case is handled by replacing the trouble spot with a variable and taking a limit.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Type 1 — infinite limits',
      content:
        'Replace $\\infty$ with a variable and take a limit: $\\displaystyle\\int_a^{\\infty} f(x)\\,dx = \\lim_{b\\to\\infty}\\int_a^{b} f(x)\\,dx$. The integral CONVERGES if this limit is a finite number and DIVERGES otherwise.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Type 2 — discontinuous integrand',
      content:
        'If $f$ blows up at an endpoint, integrate up to a variable and take a one-sided limit, e.g. $\\displaystyle\\int_a^{b} f(x)\\,dx = \\lim_{t\\to a^{+}}\\int_t^{b} f(x)\\,dx$. For an INTERIOR discontinuity at $c$, SPLIT $\\int_a^b = \\int_a^c + \\int_c^b$; BOTH pieces must converge.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Converge vs diverge',
      content:
        'CONVERGES means the defining limit exists and is a finite real number (that value is the integral). DIVERGES means the limit is $\\pm\\infty$ or fails to exist. State which explicitly — an AP answer of just a number omits the convergence claim.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'The p-integral test',
      content:
        'Two benchmark families: $\\displaystyle\\int_1^{\\infty} \\dfrac{1}{x^{p}}\\,dx$ converges iff $p>1$, while $\\displaystyle\\int_0^{1} \\dfrac{1}{x^{p}}\\,dx$ converges iff $p<1$. The borderline $p=1$ diverges at infinity (logarithmic growth).',
    },
  ],
  methods: [
    {
      title: 'Evaluate a Type 1 (infinite-limit) improper integral',
      when_to_use:
        'When a limit of integration is $\\pm\\infty$.',
      steps: [
        'Rewrite with a variable bound: $\\int_a^{\\infty} f = \\lim_{b\\to\\infty}\\int_a^{b} f$.',
        'Antidifferentiate and evaluate $F(b) - F(a)$ as a function of $b$.',
        'Take the limit as $b\\to\\infty$.',
        'If the limit is finite, state CONVERGES to that value; otherwise DIVERGES.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int_0^{\\infty} e^{-x}\\,dx$.',
        solution:
          '$\\int_0^{b} e^{-x}\\,dx = \\big[-e^{-x}\\big]_0^{b} = 1 - e^{-b}$. As $b\\to\\infty$, $e^{-b}\\to 0$, so the limit is 1: the integral CONVERGES to 1.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Evaluate a Type 2 (discontinuous-integrand) improper integral',
      when_to_use:
        'When the integrand has a vertical asymptote at (or between) the limits of integration.',
      steps: [
        'Locate the discontinuity; if it is interior, split the integral there.',
        'Replace the offending bound with a variable and use a one-sided limit.',
        'Antidifferentiate and evaluate as a function of that variable.',
        'Take the one-sided limit; report CONVERGES (finite) or DIVERGES.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int_0^{1} \\dfrac{1}{\\sqrt{x}}\\,dx$.',
        solution:
          'The integrand blows up at $x=0$. $\\int_t^{1} x^{-1/2}\\,dx = \\big[2x^{1/2}\\big]_t^{1} = 2 - 2\\sqrt{t}$. As $t\\to 0^{+}$ this $\\to 2$: CONVERGES to 2. (Consistent with the $p$-test: $p=\\tfrac{1}{2}<1$.)',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Write the limit explicitly — replace $\\infty$ (or the bad point) with a variable and show $\\lim$; AP penalizes plugging $\\infty$ straight into an antiderivative.', kind: 'frq-vocab' },
    { content: 'For an INTERIOR discontinuity you must split; integrating straight across a vertical asymptote silently gives a wrong (often finite-looking) answer.', kind: 'common-error' },
    { content: 'The two $p$-tests point OPPOSITE ways: $\\int_1^{\\infty}$ wants $p>1$, but $\\int_0^{1}$ wants $p<1$ — mixing them up flips your conclusion.', kind: 'gotcha' },
    { content: 'A split improper integral converges only if EVERY piece converges; one divergent piece makes the whole thing diverge.', kind: 'edge-case' },
    { content: 'Use the $p$-integral test to predict convergence before computing — it tells you whether the decay is fast enough for finite area.', kind: 'tip' },
  ],
};
