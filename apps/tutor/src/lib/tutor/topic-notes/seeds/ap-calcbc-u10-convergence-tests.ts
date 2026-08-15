/**
 * AP Calculus BC — Unit 10 CED 10.3–10.6: Integral Test, p-Series, and the
 * Comparison Tests.
 *
 * Baseline curated from evelyn.ap.calcbc.convergence-tests.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\sum, \int, \lim, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.convergence-tests';

export const BASELINE_AP_CALCBC_CONVERGENCE_TESTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.convergence-tests.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.3-10.6',
  cedTitle: 'Convergence Tests',
  planId: 'evelyn.ap.calcbc.convergence-tests.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.convergence-tests.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Integral test',
      content:
        'If $a_n = f(n)$ where $f$ is POSITIVE, CONTINUOUS, and DECREASING on $[N, \\infty)$, then $\\sum_{n=N}^{\\infty} a_n$ and $\\int_{N}^{\\infty} f(x)\\,dx$ either BOTH converge or BOTH diverge. It links a series to an improper integral you can actually evaluate. Note the sum and the integral generally converge to DIFFERENT values — the test only shares their convergence status.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'p-series test',
      content:
        'A $p$-SERIES is $\\sum_{n=1}^{\\infty} \\dfrac{1}{n^{p}}$. It CONVERGES if and only if $p > 1$, and DIVERGES if $p \\le 1$. Memorize the anchors: $p = 1$ is the harmonic series (diverges); $p = 2$ gives $\\sum \\tfrac{1}{n^{2}} = \\tfrac{\\pi^{2}}{6}$ (converges); $p = \\tfrac{1}{2}$ gives $\\sum \\tfrac{1}{\\sqrt{n}}$ (diverges).',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Direct comparison test',
      content:
        'For positive-term series with $a_n \\le b_n$ and $a_n, b_n \\ge 0$: if the LARGER series $\\sum b_n$ CONVERGES, then the smaller $\\sum a_n$ converges ("smaller than convergent" converges); if the SMALLER series $\\sum a_n$ DIVERGES, then the larger $\\sum b_n$ diverges ("bigger than divergent" diverges). You must bound in the RIGHT direction for the conclusion you want.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Limit comparison test',
      content:
        'For positive-term series $\\sum a_n$ and $\\sum b_n$, if $\\lim_{n\\to\\infty} \\dfrac{a_n}{b_n} = L$ with $L \\in (0, \\infty)$, then BOTH converge or BOTH diverge. It is the go-to when a direct inequality is awkward: pick $b_n$ from the dominant behavior of $a_n$ and let the finite nonzero limit transfer the verdict.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing a comparison series',
      content:
        'Compare against the DOMINANT term. For a ratio of polynomials, keep only the leading powers: $\\dfrac{n + 1}{n^{3} + 2} \\approx \\dfrac{n}{n^{3}} = \\dfrac{1}{n^{2}}$, so compare with the $p$-series $\\sum \\tfrac{1}{n^{2}}$ ($p = 2$, converges). Match the degree difference between numerator and denominator to the $p$ of a $p$-series.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'p-series (one-line)',
      content: '$\\sum_{n=1}^{\\infty} \\dfrac{1}{n^{p}}$; converges iff $p > 1$.',
    },
  ],
  methods: [
    {
      title: 'Classify with the p-series test',
      when_to_use:
        'When the series is exactly $\\sum \\tfrac{1}{n^{p}}$ (a power of $n$ in the denominator, constant numerator), including roots like $\\sqrt{n} = n^{1/2}$.',
      steps: [
        'Write the general term as $\\dfrac{1}{n^{p}}$ and read off $p$ (a root gives a fractional $p$).',
        'Compare $p$ with 1: converges if $p > 1$, diverges if $p \\le 1$.',
        'State the verdict, citing "$p$-series with $p = \\ldots$".',
      ],
      example: {
        problem: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{1}{\\sqrt{n}}$ converge?',
        solution:
          '$\\dfrac{1}{\\sqrt{n}} = \\dfrac{1}{n^{1/2}}$, a $p$-series with $p = \\tfrac{1}{2} \\le 1$. It DIVERGES.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Use the limit comparison test',
      when_to_use:
        'For positive-term rational or algebraic expressions where a clean inequality is hard but the dominant behavior is obvious.',
      steps: [
        'Identify the dominant behavior of $a_n$ and choose $b_n$ (usually a $p$-series) that matches it.',
        'Compute $L = \\lim_{n\\to\\infty} \\dfrac{a_n}{b_n}$.',
        'If $L \\in (0, \\infty)$, the two series share a verdict; look up $\\sum b_n$ (via $p$-series) and conclude the same for $\\sum a_n$.',
      ],
      example: {
        problem: 'Test $\\sum_{n=1}^{\\infty} \\dfrac{n + 1}{n^{3} + 2}$.',
        solution:
          'Dominant behavior $\\dfrac{n}{n^{3}} = \\dfrac{1}{n^{2}}$, so take $b_n = \\tfrac{1}{n^{2}}$. $L = \\lim_{n\\to\\infty} \\dfrac{(n+1)/(n^{3}+2)}{1/n^{2}} = \\lim_{n\\to\\infty} \\dfrac{n^{3} + n^{2}}{n^{3} + 2} = 1$. Since $L \\in (0, \\infty)$ and $\\sum \\tfrac{1}{n^{2}}$ ($p = 2$) CONVERGES, the given series CONVERGES.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Apply the integral test',
      when_to_use:
        'When $a_n = f(n)$ for a function you can integrate, and $f$ is positive, continuous, and decreasing (often after a $u$-substitution).',
      steps: [
        'Verify $f$ is positive, continuous, and DECREASING on $[N, \\infty)$ (check $f\'< 0$ or that terms shrink).',
        'Evaluate the improper integral $\\int_{N}^{\\infty} f(x)\\,dx$ as a limit.',
        'If the integral is finite, the series converges; if it is infinite, the series diverges.',
      ],
      example: {
        problem: 'Test $\\sum_{n=2}^{\\infty} \\dfrac{1}{n \\ln n}$.',
        solution:
          '$f(x) = \\dfrac{1}{x \\ln x}$ is positive, continuous, decreasing on $[2, \\infty)$. With $u = \\ln x$: $\\int_{2}^{\\infty} \\dfrac{dx}{x \\ln x} = \\int_{\\ln 2}^{\\infty} \\dfrac{du}{u} = \\big[\\ln u\\big]_{\\ln 2}^{\\infty} = \\infty$. The integral diverges, so the series DIVERGES.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'All four tests here require POSITIVE terms. For sign-changing series switch to the alternating series test or the ratio test on $|a_n|$.', kind: 'gotcha' },
    { content: 'For direct comparison, aim the inequality correctly: to prove CONVERGENCE bound ABOVE by a convergent series; to prove DIVERGENCE bound BELOW by a divergent one.', kind: 'common-error' },
    { content: 'The integral test shares only the CONVERGENCE STATUS — the sum of the series is not equal to the value of the integral.', kind: 'edge-case' },
    { content: 'Limit comparison needs a strictly finite, strictly positive limit: if $L = 0$ or $L = \\infty$ the basic form is inconclusive.', kind: 'edge-case' },
    { content: 'On an FRQ, name the comparison series and state its verdict explicitly, e.g. "compare with the $p$-series $\\sum \\tfrac{1}{n^{2}}$, which converges."', kind: 'frq-vocab' },
  ],
};
