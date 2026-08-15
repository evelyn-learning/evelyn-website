/**
 * AP Calculus BC — Unit 10 CED 10.8–10.9: Ratio Test; Absolute and Conditional
 * Convergence.
 *
 * Baseline curated from evelyn.ap.calcbc.ratio-test.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\sum, \lim, \left, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.ratio-test';

export const BASELINE_AP_CALCBC_RATIO_TEST: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.ratio-test.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.8-10.9',
  cedTitle: 'Ratio Test',
  planId: 'evelyn.ap.calcbc.ratio-test.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.ratio-test.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Ratio test',
      content:
        'For a series $\\sum a_n$ with $a_n \\ne 0$, compute $L = \\lim_{n\\to\\infty} \\left|\\dfrac{a_{n+1}}{a_n}\\right|$. Then: if $L < 1$ the series CONVERGES ABSOLUTELY; if $L > 1$ (or $L = \\infty$) it DIVERGES; if $L = 1$ the test is INCONCLUSIVE. Because it uses the ratio of consecutive terms, it thrives on factorials and exponentials.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When to reach for the ratio test',
      content:
        'The ratio test is the workhorse when the general term contains FACTORIALS ($n!$), EXPONENTIALS ($c^{n}$), or products that telescope when you form $\\dfrac{a_{n+1}}{a_n}$. It is also the standard tool for finding the radius of convergence of a POWER SERIES. It gives no information exactly at $L = 1$ — polynomials-over-polynomials often land there, so use a $p$-series comparison instead.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Absolute convergence',
      content:
        'A series CONVERGES ABSOLUTELY if the series of magnitudes $\\sum |a_n|$ converges. This is the STRONG form: absolute convergence implies the original $\\sum a_n$ converges too. A ratio-test result $L < 1$ always yields absolute convergence.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Conditional convergence',
      content:
        'A series CONVERGES CONDITIONALLY if $\\sum a_n$ converges BUT $\\sum |a_n|$ DIVERGES. This is the WEAK form and occurs only for sign-changing series whose magnitudes diverge. Example: the alternating harmonic series $\\sum \\dfrac{(-1)^{n+1}}{n}$ converges (AST), while $\\sum \\tfrac{1}{n}$ diverges — so it is conditional.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Absolute vs. conditional decision',
      content:
        'Given a sign-changing series that converges: test $\\sum |a_n|$ with the positive-term tools ($p$-series, comparison, ratio). If $\\sum |a_n|$ CONVERGES, the series is ABSOLUTELY convergent; if $\\sum |a_n|$ DIVERGES but the original converges (e.g. by AST), it is CONDITIONALLY convergent. Contrast $\\sum \\dfrac{(-1)^{n}}{n^{2}}$ (absolute, since $\\sum \\tfrac{1}{n^{2}}$ converges) with the alternating harmonic series (conditional).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'ratio test (one-line)',
      content: '$L = \\lim_{n\\to\\infty} \\left|\\dfrac{a_{n+1}}{a_n}\\right|$; $L < 1$ converges, $L > 1$ diverges, $L = 1$ inconclusive.',
    },
  ],
  methods: [
    {
      title: 'Apply the ratio test',
      when_to_use:
        'When the term has a factorial or exponential, or whenever forming $\\dfrac{a_{n+1}}{a_n}$ produces heavy cancellation.',
      steps: [
        'Write $a_{n+1}$ by replacing every $n$ with $n + 1$.',
        'Form $\\left|\\dfrac{a_{n+1}}{a_n}\\right|$ and CANCEL — factorials collapse via $\\dfrac{(n+1)!}{n!} = n + 1$ and exponentials via $\\dfrac{c^{n+1}}{c^{n}} = c$.',
        'Take $L = \\lim_{n\\to\\infty}$ of the simplified ratio.',
        'Conclude: $L < 1$ converges absolutely, $L > 1$ diverges, $L = 1$ inconclusive (switch tests).',
      ],
      example: {
        problem: 'Test $\\sum_{n=1}^{\\infty} \\dfrac{2^{n}}{n!}$.',
        solution:
          '$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{2^{n+1}}{(n+1)!}\\cdot\\dfrac{n!}{2^{n}} = \\dfrac{2}{n + 1}$. Then $L = \\lim_{n\\to\\infty} \\dfrac{2}{n + 1} = 0 < 1$, so the series CONVERGES ABSOLUTELY.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Classify as absolute, conditional, or divergent',
      when_to_use:
        'For a sign-changing series, to decide the STRENGTH of convergence rather than just yes/no.',
      steps: [
        'Test the ORIGINAL series for convergence (ratio test, or AST if alternating).',
        'Separately test $\\sum |a_n|$ using positive-term tools ($p$-series, comparison, ratio).',
        'If $\\sum |a_n|$ converges: ABSOLUTE. If it diverges but the original converges: CONDITIONAL. If the original diverges: DIVERGENT.',
      ],
      example: {
        problem: 'Classify $\\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n}}{n + 1}$.',
        solution:
          'Original: $b_n = \\dfrac{1}{n + 1}$ decreases to zero, so it converges by the AST. Magnitudes: $\\sum \\dfrac{1}{n + 1}$ behaves like the harmonic series and DIVERGES. Converges but not absolutely $\\Rightarrow$ CONDITIONALLY CONVERGENT.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The ratio test uses ABSOLUTE VALUES, so it ignores signs — a "$L < 1$" result always gives ABSOLUTE convergence, even for alternating series.', kind: 'tip' },
    { content: 'At $L = 1$ the ratio test says NOTHING. Do not conclude divergence — switch to a $p$-series or comparison test.', kind: 'gotcha' },
    { content: 'Absolute convergence implies convergence, but NOT conversely: a conditionally convergent series converges without converging absolutely.', kind: 'edge-case' },
    { content: 'Ratio-test algebra error: $\\dfrac{(n+1)!}{n!} = n + 1$, not $n! + 1$. Expand factorials as products before cancelling.', kind: 'common-error' },
    { content: 'On an FRQ, show the ratio, the limit $L$, and the comparison "$L < 1$", then name the conclusion — a bare "converges" loses justification points.', kind: 'frq-vocab' },
  ],
};
