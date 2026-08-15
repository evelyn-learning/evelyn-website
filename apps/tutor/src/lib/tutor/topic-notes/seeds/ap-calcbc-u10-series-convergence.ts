/**
 * AP Calculus BC — Unit 10 CED 10.1–10.2: Series, Sequences, and Geometric
 * Series.
 *
 * Baseline curated from evelyn.ap.calcbc.series-convergence.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix (tip / frq-vocab / gotcha /
 * edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\sum, \lim, \tfrac, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.series-convergence';

export const BASELINE_AP_CALCBC_SERIES_CONVERGENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.series-convergence.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.1-10.2',
  cedTitle: 'Series and Geometric Series',
  planId: 'evelyn.ap.calcbc.series-convergence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.series-convergence.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Sequence vs. series',
      content:
        'A SEQUENCE is an ordered list of terms $a_1, a_2, a_3, \\dots$ — "what each term is." A SERIES is the running SUM of those terms, $\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots$ — "what the cumulative addition is." Convergence of a sequence (do the $a_n$ approach a limit?) is a different question from convergence of a series (does the sum of the $a_n$ approach a limit?).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Partial sums and convergence',
      content:
        'The $N$-th PARTIAL SUM is $S_N = \\sum_{n=1}^{N} a_n$ — just the first $N$ terms added up. The series $\\sum a_n$ CONVERGES if $\\lim_{N\\to\\infty} S_N$ exists and is a finite number, and its value IS that limit; otherwise the series DIVERGES. So an infinite series is defined as the limit of its sequence of partial sums.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Geometric series test',
      content:
        'A GEOMETRIC SERIES has a constant ratio between consecutive terms: $\\sum_{n=0}^{\\infty} a\\,r^{n} = a + ar + ar^{2} + ar^{3} + \\cdots$, where $a$ is the first term and $r$ is the common ratio. It CONVERGES if and only if $|r| < 1$, in which case $\\sum_{n=0}^{\\infty} a\\,r^{n} = \\dfrac{a}{1 - r}$. If $|r| \\ge 1$ it diverges.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'nth-term divergence test',
      content:
        'If $\\lim_{n\\to\\infty} a_n \\ne 0$ (or the limit does not exist), then $\\sum a_n$ DIVERGES. This is the contrapositive of the fact that a convergent series must have $a_n \\to 0$. WARNING: the converse is FALSE — $a_n \\to 0$ is NECESSARY but NOT SUFFICIENT for convergence, so this test can only prove divergence, never convergence.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Harmonic series — the key counterexample',
      content:
        'The HARMONIC SERIES $\\sum_{n=1}^{\\infty} \\tfrac{1}{n} = 1 + \\tfrac{1}{2} + \\tfrac{1}{3} + \\cdots$ DIVERGES even though its terms $\\tfrac{1}{n} \\to 0$. It is the canonical proof that "terms shrink to zero" does not force convergence. Do not confuse it with a geometric series: $\\sum r^n$ needs $|r| < 1$, whereas the harmonic series is $\\sum n^{-p}$ with $p = 1$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'geometric series (one-line)',
      content: '$\\sum_{n=0}^{\\infty} a\\,r^{n}$; converges iff $|r| < 1$, with sum $\\dfrac{a}{1 - r}$.',
    },
  ],
  methods: [
    {
      title: 'Test a geometric series and find its sum',
      when_to_use:
        'When the terms have a constant ratio $r$ (each term is the previous one times $r$) — recognizable as $\\sum a\\,r^{n}$, including exponentials like $\\sum 2^{-n}$.',
      steps: [
        'Write the series in the form $\\sum a\\,r^{n}$ and READ OFF the first term $a$ and the common ratio $r$ (divide any term by the one before it).',
        'Check $|r| < 1$. If $|r| \\ge 1$, STOP — the series diverges.',
        'If $|r| < 1$, the series converges; compute the sum $\\dfrac{a}{1 - r}$, where $a$ is the ACTUAL first term of the series (mind the starting index).',
      ],
      example: {
        problem: 'Determine whether $\\sum_{n=0}^{\\infty} 3\\left(\\tfrac{2}{3}\\right)^{n}$ converges, and if so find its sum.',
        solution:
          'Geometric with $a = 3$ and $r = \\tfrac{2}{3}$. Since $|r| = \\tfrac{2}{3} < 1$, it converges. Sum $= \\dfrac{a}{1 - r} = \\dfrac{3}{1 - \\tfrac{2}{3}} = \\dfrac{3}{\\,\\tfrac{1}{3}\\,} = 9$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert a repeating decimal to an exact fraction',
      when_to_use:
        'When a repeating decimal must be written as an exact rational value — the repeating block IS a geometric series.',
      steps: [
        'Write the decimal as a sum of its repeating blocks, e.g. 0.444… = 0.4 + 0.04 + 0.004 + ⋯.',
        'Identify $a$ (the first block) and $r = 10^{-k}$ where $k$ is the block length.',
        'Apply $\\dfrac{a}{1 - r}$ and simplify to a fraction.',
      ],
      example: {
        problem: 'Express the repeating decimal 0.444… as an exact fraction.',
        solution:
          'As a geometric series, $\\sum_{n=0}^{\\infty} 0.4\\,(0.1)^{n}$ has $a = 0.4$ and $r = 0.1$. Sum $= \\dfrac{0.4}{1 - 0.1} = \\dfrac{0.4}{0.9} = \\dfrac{4}{9}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Apply the nth-term divergence test',
      when_to_use:
        'As a FIRST screen on any series: check whether the terms fail to go to zero before reaching for a harder test.',
      steps: [
        'Compute $\\lim_{n\\to\\infty} a_n$.',
        'If the limit is nonzero or does not exist, conclude the series DIVERGES.',
        'If the limit is zero, the test is INCONCLUSIVE — the series may still converge or diverge; use another test.',
      ],
      example: {
        problem: 'Does $\\sum_{n=1}^{\\infty} \\dfrac{n}{2n + 1}$ converge or diverge?',
        solution:
          '$\\lim_{n\\to\\infty} \\dfrac{n}{2n + 1} = \\dfrac{1}{2} \\ne 0$. By the nth-term divergence test the series DIVERGES.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The nth-term test only PROVES divergence. If $a_n \\to 0$ it says nothing — do not write "converges because terms go to zero."', kind: 'common-error' },
    { content: 'The harmonic series $\\sum \\tfrac{1}{n}$ diverges even though $\\tfrac{1}{n} \\to 0$: keep it in mind as the standard counterexample.', kind: 'gotcha' },
    { content: 'In $\\dfrac{a}{1 - r}$, use the ACTUAL first term for $a$. If the sum starts at $n = 1$, the first term is $a r$, not $a$ — re-index carefully.', kind: 'edge-case' },
    { content: 'On an FRQ, name the test and state its condition: "geometric with $|r| = \\ldots < 1$, so it converges to $\\dfrac{a}{1 - r}$."', kind: 'frq-vocab' },
    { content: 'A repeating decimal is always a geometric series with $r$ a power of $\\tfrac{1}{10}$ — convert it that way to get an exact fraction.', kind: 'tip' },
  ],
};
