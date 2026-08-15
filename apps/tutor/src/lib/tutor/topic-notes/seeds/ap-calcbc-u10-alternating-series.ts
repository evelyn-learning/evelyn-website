/**
 * AP Calculus BC — Unit 10 CED 10.7–10.10: Alternating Series Test and the
 * Alternating Series Error Bound.
 *
 * Baseline curated from evelyn.ap.calcbc.alternating-series.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\sum, \lim, \tfrac, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.alternating-series';

export const BASELINE_AP_CALCBC_ALTERNATING_SERIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.alternating-series.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.7-10.10',
  cedTitle: 'Alternating Series',
  planId: 'evelyn.ap.calcbc.alternating-series.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.alternating-series.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Alternating series',
      content:
        'An ALTERNATING SERIES has signs that flip every term: $\\sum (-1)^{n} b_n$ or $\\sum (-1)^{n+1} b_n$ where $b_n > 0$ is the MAGNITUDE of the $n$-th term. The factor $(-1)^{n}$ carries the sign; the $b_n$ are the positive "sizes" that the alternating series test and error bound work with.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Alternating series test (AST)',
      content:
        'The alternating series $\\sum (-1)^{n} b_n$ (with $b_n > 0$) CONVERGES if BOTH conditions hold: (1) $b_n$ is DECREASING, $b_{n+1} \\le b_n$ for all $n$ past some point; and (2) $\\lim_{n\\to\\infty} b_n = 0$. Both are required. Example: the alternating harmonic series $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n}$ converges (its sum is $\\ln 2$) because $\\tfrac{1}{n}$ decreases to zero.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Alternating series error bound',
      content:
        'If $\\sum (-1)^{n} b_n$ satisfies the AST and converges to $S$, then the error of the partial sum $S_N$ is bounded by the FIRST OMITTED TERM: $|S - S_N| \\le b_{N+1}$. The true sum is trapped between consecutive partial sums, so the remainder is at most the size of the next term you did not add.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Using the error bound to hit a tolerance',
      content:
        'To approximate $S$ within a tolerance $\\varepsilon$, force the first omitted term below it: solve $b_{N+1} \\le \\varepsilon$ for the smallest $N$, then $S_N$ is guaranteed accurate to $\\varepsilon$. Example: for $\\sum \\dfrac{(-1)^{n+1}}{n^{2}}$ within a tolerance of 0.01, need $\\dfrac{1}{(N+1)^{2}} \\le 0.01$, i.e. $(N+1)^{2} \\ge 100$, so $N \\ge 9$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When the AST does not apply',
      content:
        'If $\\lim_{n\\to\\infty} b_n \\ne 0$, the AST condition (2) fails AND the original series DIVERGES by the nth-term test (its terms do not shrink to zero). The AST and its error bound require ALTERNATING signs, DECREASING magnitudes, and limit zero — never apply the error bound to a non-alternating series or one whose terms do not decrease to zero.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'error bound (one-line)',
      content: '$|S - S_N| \\le b_{N+1}$ — the error is at most the first omitted term in magnitude.',
    },
  ],
  methods: [
    {
      title: 'Confirm convergence with the alternating series test',
      when_to_use:
        'When the terms alternate in sign — a $(-1)^{n}$ or $(-1)^{n+1}$ factor times positive $b_n$.',
      steps: [
        'Strip the sign and identify the positive magnitude $b_n$.',
        'Check that $b_n$ is DECREASING (compare $b_{n+1}$ with $b_n$, or show the magnitude function is decreasing).',
        'Check $\\lim_{n\\to\\infty} b_n = 0$.',
        'If both hold, conclude the series CONVERGES by the AST. If $\\lim b_n \\ne 0$, the series DIVERGES instead.',
      ],
      example: {
        problem: 'Does $\\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n}}{2n + 1}$ converge?',
        solution:
          'Here $b_n = \\dfrac{1}{2n + 1} > 0$. It is decreasing since $b_{n+1} = \\tfrac{1}{2n + 3} < \\tfrac{1}{2n + 1} = b_n$, and $\\lim_{n\\to\\infty} \\dfrac{1}{2n + 1} = 0$. Both AST conditions hold, so the series CONVERGES (its sum is $\\tfrac{\\pi}{4}$).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Bound the error of a partial sum',
      when_to_use:
        'When asked how accurate $S_N$ is, or how many terms guarantee a given accuracy, for a series that satisfies the AST.',
      steps: [
        'Confirm the AST applies (alternating, $b_n$ decreasing, $b_n \\to 0$).',
        'Write the error bound $|S - S_N| \\le b_{N+1}$, the magnitude of the first omitted term.',
        'To hit a tolerance $\\varepsilon$, solve $b_{N+1} \\le \\varepsilon$ for the smallest integer $N$.',
      ],
      example: {
        problem: 'For $\\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1}}{n!}$, bound $|S - S_4|$.',
        solution:
          '$b_n = \\dfrac{1}{n!}$ decreases to zero, so the AST error bound applies: $|S - S_4| \\le b_5 = \\dfrac{1}{5!} = \\dfrac{1}{120} \\approx 0.0083$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The error bound is the FIRST OMITTED term $b_{N+1}$, not the last included term $b_N$ — off-by-one here is a classic slip.', kind: 'common-error' },
    { content: 'Watch the index convention for $S_N$: some sums start at $n = 0$, so "$S_3$" may already contain four terms. Count actual terms.', kind: 'gotcha' },
    { content: 'The AST error bound needs all three: alternating signs, decreasing magnitudes, and $b_n \\to 0$. Do not apply it to positive-term series.', kind: 'edge-case' },
    { content: 'If $\\lim b_n \\ne 0$, do not just say "AST fails" — the series actually DIVERGES by the nth-term test; state that.', kind: 'frq-vocab' },
    { content: 'The error bound gives an INTERVAL for $S$: $S \\in [S_N - b_{N+1},\\, S_N + b_{N+1}]$. Use it to sandwich the true value.', kind: 'tip' },
  ],
};
