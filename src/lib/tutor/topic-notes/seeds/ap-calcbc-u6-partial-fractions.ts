/**
 * AP Calculus BC — Unit 6 CED 6.12: Integration Using Partial Fractions
 * (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.partial-fractions.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: theory entries carry kind+title, methods are
 * humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \dfrac, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.partial-fractions';

export const BASELINE_AP_CALCBC_PARTIAL_FRACTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.partial-fractions.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.12',
  cedTitle: 'Partial Fractions (BC)',
  planId: 'evelyn.ap.calcbc.partial-fractions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.partial-fractions.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'When partial fractions applies',
      content:
        'Use partial fractions when the integrand is a PROPER rational function ($\\deg(\\text{numerator}) < \\deg(\\text{denominator})$) whose denominator factors into DISTINCT LINEAR factors. Each factor then contributes one simple fraction that integrates to a logarithm.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The decomposition template',
      content:
        'Write $\\dfrac{p(x)}{(x-a)(x-b)} = \\dfrac{A}{x-a} + \\dfrac{B}{x-b}$ with unknown constants $A,B$. Each distinct linear factor $x-r$ in the denominator gets its own term $\\dfrac{\\text{const}}{x-r}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding the constants (cover-up)',
      content:
        'Clear denominators to get an identity, e.g. $p(x) = A(x-b) + B(x-a)$. SUBSTITUTE the roots one at a time: plugging $x=a$ kills the $B$-term and isolates $A$; plugging $x=b$ isolates $B$. This "cover-up" trick finds each constant instantly.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Integrating the pieces',
      content:
        'Every piece is a log: $\\displaystyle\\int \\dfrac{A}{x-a}\\,dx = A\\ln|x-a| + C$. So the whole integral is a sum of logarithm terms, e.g. $\\dfrac{1}{3}\\ln|x-1| - \\dfrac{1}{3}\\ln|x+2| + C$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Improper integrands: divide first',
      content:
        'If $\\deg(\\text{numerator}) \\ge \\deg(\\text{denominator})$, the fraction is IMPROPER — do polynomial long division first to get a polynomial plus a PROPER remainder, then apply partial fractions to the remainder.',
    },
  ],
  methods: [
    {
      title: 'Decompose and integrate a proper rational function',
      when_to_use:
        'When the integrand is a proper rational function whose denominator factors into distinct linear factors.',
      steps: [
        'Factor the denominator into distinct linear factors.',
        'Write the decomposition with one $\\dfrac{\\text{const}}{x-r}$ term per factor.',
        'Clear denominators and substitute each root to solve for the constants.',
        'Integrate each term as a logarithm.',
        'Combine and add $+C$.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int \\dfrac{x+4}{(x-1)(x+2)}\\,dx$.',
        solution:
          'Set $\\dfrac{x+4}{(x-1)(x+2)} = \\dfrac{A}{x-1} + \\dfrac{B}{x+2}$, so $x+4 = A(x+2)+B(x-1)$. Substituting $x=1$ gives $A=\\tfrac{5}{3}$; substituting $x=-2$ gives $B=-\\tfrac{2}{3}$. Integrate: $\\tfrac{5}{3}\\ln|x-1| - \\tfrac{2}{3}\\ln|x+2| + C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Handle an improper rational integrand before decomposing',
      when_to_use:
        'When the numerator degree is $\\ge$ the denominator degree, so the fraction is not yet ready for partial fractions.',
      steps: [
        'Long-divide to write the integrand as (polynomial quotient) $+$ (proper remainder over the denominator).',
        'Integrate the polynomial quotient with the reverse power rule.',
        'Apply partial fractions to the proper remainder if its denominator still factors.',
        'Combine all terms and add $+C$.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int \\dfrac{x^2+3x+2}{x-1}\\,dx$.',
        solution:
          'The numerator degree exceeds the denominator degree, so divide: $\\dfrac{x^2+3x+2}{x-1} = x + 4 + \\dfrac{6}{x-1}$. Integrate term by term: $\\tfrac{x^2}{2} + 4x + 6\\ln|x-1| + C$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Check "proper" FIRST: if $\\deg(\\text{top})\\ge\\deg(\\text{bottom})$ you must long-divide before decomposing.', kind: 'common-error' },
    { content: 'Keep absolute values in each $\\ln|x-r|$; the linear factors change sign across their roots.', kind: 'gotcha' },
    { content: 'A repeated factor $(x-a)^2$ needs BOTH $\\dfrac{A}{x-a}$ and $\\dfrac{B}{(x-a)^2}$ — a single term is not enough (rare on AP, but tested).', kind: 'edge-case' },
    { content: 'Plugging the roots into the cleared identity isolates each constant one at a time — the fastest way to justify $A$, $B$ on an FRQ.', kind: 'frq-vocab' },
    { content: 'Sanity-check by recombining your fractions over a common denominator; it should reproduce the original numerator.', kind: 'tip' },
  ],
};
