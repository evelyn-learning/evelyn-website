/**
 * AP Calculus BC — Unit 6 CED 6.10: Integrating Using Long Division and
 * Completing the Square.
 *
 * Baseline curated from evelyn.ap.calcbc.long-division-completing-square.v1 to
 * the gold standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: theory entries carry kind+title, methods are
 * humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \dfrac, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.long-division-completing-square';

export const BASELINE_AP_CALCBC_LONG_DIVISION_COMPLETING_SQUARE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.long-division-completing-square.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.10',
  cedTitle: 'Integrating Using Long Division and Completing the Square',
  planId: 'evelyn.ap.calcbc.long-division-completing-square.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.long-division-completing-square.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Improper rational function — the long-division trigger',
      content:
        'A rational integrand $\\dfrac{p(x)}{q(x)}$ is IMPROPER when $\\deg(p) \\ge \\deg(q)$. You cannot antidifferentiate it directly — you must LONG-DIVIDE first to lower the numerator degree.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What long division produces',
      content:
        'Division rewrites $\\dfrac{p(x)}{q(x)} = (\\text{polynomial quotient}) + \\dfrac{r(x)}{q(x)}$, where the remainder $r(x)$ has degree SMALLER than $q(x)$. Now integrate term by term: the polynomial with the reverse power rule, and the proper remainder by substitution, log, or arctan.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Completing the square — the arctan/arcsin trigger',
      content:
        'When the denominator is an IRREDUCIBLE quadratic $x^2+bx+c$ (no real rational roots), rewrite it as $(x+h)^2 \\pm a^2$ by completing the square. This exposes a substitution $u=x+h$ that lands on an inverse-trig form.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Target inverse-trig forms',
      content:
        'After completing the square aim for $\\displaystyle\\int \\dfrac{du}{u^2+a^2} = \\dfrac{1}{a}\\arctan\\!\\Big(\\dfrac{u}{a}\\Big) + C$ or $\\displaystyle\\int \\dfrac{du}{\\sqrt{a^2-u^2}} = \\arcsin\\!\\Big(\\dfrac{u}{a}\\Big) + C$, with $u=x+h$ from the completed square $(x+h)^2 + a^2$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Decision checklist and correct order',
      content:
        'Before integrating any rational function: (1) is $\\deg(\\text{top}) \\ge \\deg(\\text{bottom})$? → long-divide; (2) does the denominator FACTOR? → partial fractions (6.12); (3) is the denominator an irreducible quadratic? → complete the square toward arctan/arcsin; (4) is the numerator the derivative of the denominator? → $u$-sub to a log. Division ALWAYS comes before completing the square.',
    },
  ],
  methods: [
    {
      title: 'Integrate an improper rational function by long division',
      when_to_use:
        'When the numerator degree is $\\ge$ the denominator degree, so the fraction cannot be integrated as-is.',
      steps: [
        'Confirm $\\deg(p)\\ge\\deg(q)$ — the improper signal.',
        'Long-divide to write $\\dfrac{p}{q} = (\\text{quotient}) + \\dfrac{r}{q}$ with $\\deg(r)<\\deg(q)$.',
        'Integrate the polynomial quotient with the reverse power rule.',
        'Integrate the proper remainder $\\dfrac{r}{q}$ (often a log or arctan).',
        'Combine and add $+C$.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int \\dfrac{x^2 + 3x + 5}{x+1}\\,dx$.',
        solution:
          'The numerator degree exceeds the denominator degree, so divide: $\\dfrac{x^2+3x+5}{x+1} = x + 2 + \\dfrac{3}{x+1}$. Integrate term by term: $\\tfrac{x^2}{2} + 2x + 3\\ln|x+1| + C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Integrate a constant over an irreducible quadratic by completing the square',
      when_to_use:
        'When the denominator is a quadratic with no rational factors and the numerator is a constant (or a constant after splitting off the derivative piece).',
      steps: [
        'Complete the square on the denominator: $x^2+bx+c = (x+\\tfrac{b}{2})^2 + a^2$.',
        'Substitute $u = x+\\tfrac{b}{2}$, $du = dx$.',
        'Match the arctan form $\\displaystyle\\int \\dfrac{du}{u^2+a^2} = \\dfrac{1}{a}\\arctan\\!\\big(\\tfrac{u}{a}\\big)$.',
        'Back-substitute $u=x+\\tfrac{b}{2}$ and add $+C$.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int \\dfrac{1}{x^2 + 4x + 5}\\,dx$.',
        solution:
          'Complete the square: $x^2+4x+5 = (x+2)^2 + 1$. With $u=x+2$, $\\int \\dfrac{du}{u^2+1} = \\arctan(u)+C = \\arctan(x+2)+C$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Do the long division FIRST — trying to complete the square or split an improper fraction before dividing leads nowhere.', kind: 'common-error' },
    { content: 'Halve the middle coefficient when completing the square: $x^2+bx+c=(x+\\tfrac{b}{2})^2 + (c-\\tfrac{b^2}{4})$; forgetting the $\\tfrac{1}{2}$ is the usual error.', kind: 'gotcha' },
    { content: 'If the numerator is the derivative of the quadratic denominator (up to a constant), the answer is a LOG, not an arctan — check that before completing the square.', kind: 'edge-case' },
    { content: 'When a linear numerator sits over an irreducible quadratic, SPLIT it into a "derivative-of-denominator" part (→ $\\ln$) plus a constant part (→ $\\arctan$).', kind: 'frq-vocab' },
    { content: 'Match $(x+h)^2 + a^2$ carefully: the $a$ in $\\tfrac{1}{a}\\arctan(\\tfrac{u}{a})$ is the SQUARE ROOT of the constant term, not the constant itself.', kind: 'tip' },
  ],
};
