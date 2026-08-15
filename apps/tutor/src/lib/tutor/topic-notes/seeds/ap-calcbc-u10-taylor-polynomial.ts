/**
 * AP Calculus BC — Unit 10 CED 10.11–10.12: Taylor Polynomials and the
 * Lagrange Error Bound.
 *
 * Baseline curated from evelyn.ap.calcbc.taylor-polynomial.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (T, \sum, \dfrac, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.taylor-polynomial';

export const BASELINE_AP_CALCBC_TAYLOR_POLYNOMIAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.taylor-polynomial.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.11-10.12',
  cedTitle: 'Taylor Polynomials',
  planId: 'evelyn.ap.calcbc.taylor-polynomial.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.taylor-polynomial.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Taylor polynomial',
      content:
        'The degree-$n$ TAYLOR POLYNOMIAL of $f$ about $x = c$ is $T_n(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(c)}{k!}(x - c)^{k} = f(c) + f\'(c)(x - c) + \\dfrac{f\'\'(c)}{2!}(x - c)^{2} + \\cdots + \\dfrac{f^{(n)}(c)}{n!}(x - c)^{n}$. Each coefficient is a derivative of $f$ at $c$ divided by a factorial.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Maclaurin polynomial',
      content:
        'A MACLAURIN POLYNOMIAL is a Taylor polynomial centered at $c = 0$: $T_n(x) = f(0) + f\'(0)\\,x + \\dfrac{f\'\'(0)}{2!}x^{2} + \\cdots + \\dfrac{f^{(n)}(0)}{n!}x^{n}$. It is the special (and most common) case of the Taylor formula.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Matching property and interpretation',
      content:
        'By construction, $T_n$ agrees with $f$ in value AND in every derivative through order $n$ at the center: $T_n^{(k)}(c) = f^{(k)}(c)$ for $k = 0, 1, \\dots, n$. Geometrically $T_1$ is the TANGENT LINE at $c$ (the linearization), $T_2$ adds curvature, and higher-degree $T_n$ hug $f$ more closely near $c$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Lagrange error bound',
      content:
        'The remainder $R_n(x) = f(x) - T_n(x)$ satisfies $|R_n(x)| \\le \\dfrac{M\\,|x - c|^{\\,n+1}}{(n+1)!}$, where $M$ is any bound on $|f^{(n+1)}(t)|$ for $t$ between $c$ and $x$. The error looks like the "next" Taylor term with $f^{(n+1)}$ replaced by its maximum $M$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Applying the Lagrange bound',
      content:
        'To bound $|f(x) - T_n(x)|$: (1) find $M = \\max |f^{(n+1)}(t)|$ on the interval between $c$ and $x$; (2) compute $\\dfrac{M\\,|x - c|^{\\,n+1}}{(n+1)!}$; (3) that value is the maximum possible error. Example: for $|e^{x} - T_3(x)|$ at $x = 0.5$, $c = 0$, since $f^{(4)} = e^{x} \\le e^{0.5} < 2$ on $[0, 0.5]$, take $M = 2$: error $\\le \\dfrac{2\\,(0.5)^{4}}{4!} \\approx 0.0052$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Taylor polynomial (one-line)',
      content: '$T_n(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(c)}{k!}(x - c)^{k}$; Maclaurin is the case $c = 0$.',
    },
  ],
  methods: [
    {
      title: 'Build a Taylor polynomial about x = c',
      when_to_use:
        'When asked for $T_n(x)$ of a specific $f$ centered at $c$ (or a Maclaurin polynomial, $c = 0$).',
      steps: [
        'Compute the derivatives $f, f\', f\'\', \\dots, f^{(n)}$ and EVALUATE each at $x = c$.',
        'Divide the $k$-th derivative value by $k!$ to get the coefficient of $(x - c)^{k}$.',
        'Assemble $T_n(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(c)}{k!}(x - c)^{k}$ and simplify.',
      ],
      example: {
        problem: 'Find $T_3(x)$ for $f(x) = \\ln x$ about $x = 1$.',
        solution:
          '$f(1) = 0$; $f\'(x) = \\tfrac{1}{x}$, $f\'(1) = 1$; $f\'\'(x) = -\\tfrac{1}{x^{2}}$, $f\'\'(1) = -1$; $f\'\'\'(x) = \\tfrac{2}{x^{3}}$, $f\'\'\'(1) = 2$. So $T_3(x) = 0 + 1\\,(x - 1) + \\dfrac{-1}{2!}(x - 1)^{2} + \\dfrac{2}{3!}(x - 1)^{3} = (x - 1) - \\dfrac{(x - 1)^{2}}{2} + \\dfrac{(x - 1)^{3}}{3}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Approximate a value and bound the error with Lagrange',
      when_to_use:
        'When asked to estimate $f$ at a nearby point using $T_n$ and to certify the accuracy of that estimate.',
      steps: [
        'Evaluate $T_n$ at the target $x$ to get the approximation.',
        'Identify $f^{(n+1)}$ and find a bound $M$ for $|f^{(n+1)}(t)|$ on the interval between $c$ and $x$.',
        'Compute the Lagrange bound $\\dfrac{M\\,|x - c|^{\\,n+1}}{(n+1)!}$ — the maximum possible error.',
      ],
      example: {
        problem: 'Bound $|\\sin(0.5) - T_3(0.5)|$ where $T_3$ is the third-degree Maclaurin polynomial of $\\sin x$.',
        solution:
          '$T_3(x) = x - \\dfrac{x^{3}}{6}$ and $f^{(4)}(x) = \\sin x$ with $|\\sin x| \\le 1$, so $M = 1$. Then $|R_3(0.5)| \\le \\dfrac{1\\cdot(0.5)^{4}}{4!} = \\dfrac{0.0625}{24} \\approx 0.0026$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Do not forget the factorial: the coefficient of $(x - c)^{k}$ is $\\dfrac{f^{(k)}(c)}{k!}$, not $f^{(k)}(c)$.', kind: 'common-error' },
    { content: 'The Lagrange bound uses $f^{(n+1)}$ (one order ABOVE the polynomial degree) and $(x - c)^{n+1}/(n+1)!$ — index the next term, not the last.', kind: 'gotcha' },
    { content: 'For $M$, take the MAXIMUM of $|f^{(n+1)}|$ on the whole interval between $c$ and $x$; a rough over-estimate is fine and keeps the bound valid.', kind: 'tip' },
    { content: 'A Taylor polynomial matches $f$ only NEAR $c$; accuracy degrades as $|x - c|$ grows, which is exactly what the $|x - c|^{n+1}$ factor reflects.', kind: 'edge-case' },
    { content: 'On an FRQ, present the Lagrange bound as $\\dfrac{M\\,|x - c|^{n+1}}{(n+1)!}$ with $M$ named and justified — an unstated $M$ loses the error-bound point.', kind: 'frq-vocab' },
  ],
};
