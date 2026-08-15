/**
 * AP Calculus BC — Unit 10 CED 10.13: Power Series — Radius and Interval of
 * Convergence.
 *
 * Baseline curated from evelyn.ap.calcbc.power-series.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\sum, R, \lim, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.power-series';

export const BASELINE_AP_CALCBC_POWER_SERIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.power-series.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.13',
  cedTitle: 'Power Series',
  planId: 'evelyn.ap.calcbc.power-series.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.power-series.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Power series',
      content:
        'A POWER SERIES centered at $c$ is $\\sum_{n=0}^{\\infty} a_n (x - c)^{n}$ — a series whose terms contain the VARIABLE $x$. For each fixed $x$ it is an ordinary numeric series that may converge or diverge; the question is FOR WHICH $x$ it converges.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Radius of convergence',
      content:
        'Every power series has a RADIUS OF CONVERGENCE $R \\in [0, \\infty]$ such that it converges for $|x - c| < R$ and diverges for $|x - c| > R$. At the endpoints $|x - c| = R$ the behavior must be checked separately. The convergence set is thus symmetric about the center $c$ apart from endpoint effects.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Interval of convergence',
      content:
        'The INTERVAL OF CONVERGENCE (IOC) is the actual set of $x$ for which the series converges. It is one of $(c - R,\\, c + R)$, $[c - R,\\, c + R)$, $(c - R,\\, c + R]$, or $[c - R,\\, c + R]$ — the open interval of radius $R$ about $c$, possibly with one or both endpoints attached.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding R with the ratio test',
      content:
        'Apply the ratio test to the terms: $\\lim_{n\\to\\infty} \\left|\\dfrac{a_{n+1}(x - c)^{n+1}}{a_n (x - c)^{n}}\\right| = |x - c|\\cdot\\lim_{n\\to\\infty}\\left|\\dfrac{a_{n+1}}{a_n}\\right|$. Set this $< 1$ and solve for $|x - c| < R$ to read off $R$. Then test each endpoint $x = c \\pm R$ with a numeric convergence test.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Special cases of R',
      content:
        'Two extremes: $R = 0$ means the series converges ONLY at $x = c$ (typical of $n!$-style coefficients that blow up); $R = \\infty$ means it converges for ALL real $x$ (as for the Maclaurin series of $e^{x}$, $\\sin x$, $\\cos x$). When the ratio-test limit is zero for every $x$, $R = \\infty$; when it is $\\infty$ unless $x = c$, $R = 0$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'radius (one-line)',
      content: 'Converges for $|x - c| < R$, diverges for $|x - c| > R$; endpoints checked separately.',
    },
  ],
  methods: [
    {
      title: 'Find the radius and interval of convergence',
      when_to_use:
        'For any power series $\\sum a_n (x - c)^{n}$ when asked for $R$ and/or the IOC.',
      steps: [
        'Form the ratio $\\left|\\dfrac{a_{n+1}(x - c)^{n+1}}{a_n (x - c)^{n}}\\right|$ and simplify to $|x - c|\\cdot\\lim\\left|\\dfrac{a_{n+1}}{a_n}\\right|$.',
        'Set the limit $< 1$ and solve for $|x - c| < R$; read off $R$.',
        'TEST EACH ENDPOINT $x = c - R$ and $x = c + R$ by substituting and applying a numeric test ($p$-series, AST, nth-term).',
        'Assemble the IOC, attaching each endpoint that converges.',
      ],
      example: {
        problem: 'Find $R$ and the IOC of $\\sum_{n=1}^{\\infty} \\dfrac{(x - 2)^{n}}{n^{2}}$.',
        solution:
          'Ratio: $|x - 2|\\cdot\\dfrac{n^{2}}{(n+1)^{2}} \\to |x - 2|$. Convergence needs $|x - 2| < 1$, so $R = 1$ and convergence holds on $x \\in (1, 3)$. Endpoints: $x = 1$ gives $\\sum \\dfrac{(-1)^{n}}{n^{2}}$ (converges absolutely); $x = 3$ gives $\\sum \\dfrac{1}{n^{2}}$ ($p = 2$, converges). IOC $= [1, 3]$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Handle infinite and zero radius',
      when_to_use:
        'When the coefficients involve factorials — either $n!$ in the denominator (suspect $R = \\infty$) or numerator (suspect $R = 0$).',
      steps: [
        'Form the ratio and take the limit as a function of $|x - c|$.',
        'If the limit is zero for every $x$, the series converges everywhere: $R = \\infty$, IOC $= (-\\infty, \\infty)$.',
        'If the limit is $\\infty$ for every $x \\ne c$, it converges only at the center: $R = 0$, IOC $= \\{c\\}$.',
      ],
      example: {
        problem: 'Find the radius of convergence of $\\sum_{n=0}^{\\infty} \\dfrac{(x - 1)^{n}}{n!}$.',
        solution:
          'Ratio: $\\dfrac{|x - 1|^{n+1}}{(n+1)!}\\cdot\\dfrac{n!}{|x - 1|^{n}} = \\dfrac{|x - 1|}{n + 1} \\to 0$ for all $x$. So it converges everywhere: $R = \\infty$, IOC $= (-\\infty, \\infty)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'ALWAYS test the endpoints separately — the ratio test is silent at $|x - c| = R$, and each endpoint can independently converge or diverge.', kind: 'common-error' },
    { content: 'The interval of convergence is centered at $c$, not at $x = 0$: for $\\sum a_n (x - c)^{n}$ solve $|x - c| < R$, giving $c - R < x < c + R$.', kind: 'gotcha' },
    { content: 'At an endpoint the series becomes NUMERIC — pick the matching test: $\\sum \\tfrac{(-1)^{n}}{n}$ (AST), $\\sum \\tfrac{1}{n^{p}}$ ($p$-series), or nth-term for obvious divergence.', kind: 'tip' },
    { content: 'Factorials in the denominator drive the ratio limit to zero ($R = \\infty$); factorials in the numerator drive it to $\\infty$ ($R = 0$).', kind: 'edge-case' },
    { content: 'On an FRQ, state $R$, both endpoint tests with their verdicts, and the final IOC using correct bracket/parenthesis notation.', kind: 'frq-vocab' },
  ],
};
