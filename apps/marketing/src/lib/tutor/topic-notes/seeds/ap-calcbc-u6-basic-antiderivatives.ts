/**
 * AP Calculus BC — Unit 6 CED 6.8: Basic Antiderivatives and Indefinite
 * Integrals.
 *
 * Baseline curated from evelyn.ap.calcbc.basic-antiderivatives.v1 to the gold
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

const LO = 'apcalcbc.basic-antiderivatives';

export const BASELINE_AP_CALCBC_BASIC_ANTIDERIVATIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.basic-antiderivatives.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.8',
  cedTitle: 'Basic Antiderivatives',
  planId: 'evelyn.ap.calcbc.basic-antiderivatives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.basic-antiderivatives.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Indefinite integral and the constant of integration',
      content:
        'The INDEFINITE INTEGRAL $\\displaystyle\\int f(x)\\,dx = F(x) + C$ names the whole FAMILY of antiderivatives of $f$. The arbitrary constant $C$ is required because adding any constant to $F$ leaves the derivative unchanged: $(F+C)\' = f$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Reverse power rule',
      content:
        'Raise the exponent and divide: $\\displaystyle\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$ for $n \\ne -1$. The single excluded case is $n=-1$, which gives $\\displaystyle\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Trigonometric antiderivatives',
      content:
        '$\\displaystyle\\int \\sin x\\,dx = -\\cos x + C$, $\\displaystyle\\int \\cos x\\,dx = \\sin x + C$, $\\displaystyle\\int \\sec^2 x\\,dx = \\tan x + C$, $\\displaystyle\\int \\sec x\\tan x\\,dx = \\sec x + C$, $\\displaystyle\\int \\csc^2 x\\,dx = -\\cot x + C$, and $\\displaystyle\\int \\csc x\\cot x\\,dx = -\\csc x + C$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Exponential and inverse-trig antiderivatives',
      content:
        'Exponentials: $\\displaystyle\\int e^x\\,dx = e^x + C$ and $\\displaystyle\\int a^x\\,dx = \\dfrac{a^x}{\\ln a} + C$. Inverse trig: $\\displaystyle\\int \\dfrac{dx}{\\sqrt{1-x^2}} = \\arcsin x + C$ and $\\displaystyle\\int \\dfrac{dx}{1+x^2} = \\arctan x + C$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Linearity of antidifferentiation',
      content:
        'Constants factor out and sums split term by term: $\\displaystyle\\int \\big[c\\,f(x)+d\\,g(x)\\big]\\,dx = c\\int f(x)\\,dx + d\\int g(x)\\,dx$. Integrate each standard piece, then add ONE combined $+C$.',
    },
  ],
  methods: [
    {
      title: 'Compute an indefinite integral of a basic function',
      when_to_use:
        'When the integrand is a sum of power, trig, exponential, or inverse-trig terms that each match a table entry directly.',
      steps: [
        'Split the integrand with linearity and pull out constant factors.',
        'Rewrite radicals and reciprocals as powers of $x$ (e.g. $\\sqrt{x}=x^{1/2}$, $\\tfrac{1}{x^2}=x^{-2}$) so the reverse power rule applies.',
        'Antidifferentiate each term from the standard table.',
        'Add a single constant of integration $+C$.',
        'Check by differentiating: the derivative should return the original integrand.',
      ],
      example: {
        problem:
          'Compute $\\displaystyle\\int \\Big(\\dfrac{1}{x} + \\dfrac{1}{x^2}\\Big)\\,dx$ and $\\displaystyle\\int \\sqrt{x}\\,dx$.',
        solution:
          'First: $\\int \\tfrac{1}{x}\\,dx = \\ln|x|$ and $\\int x^{-2}\\,dx = \\dfrac{x^{-1}}{-1} = -\\tfrac{1}{x}$, so the answer is $\\ln|x| - \\tfrac{1}{x} + C$. Second: $\\int x^{1/2}\\,dx = \\dfrac{x^{3/2}}{3/2} = \\tfrac{2}{3}x^{3/2} + C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Evaluate a definite integral of a basic function',
      when_to_use:
        'When the integrand is table-standard and you need a numerical value $\\int_a^b f$ — antidifferentiate, then apply FTC Part 2.',
      steps: [
        'Find an antiderivative $F$ (drop the $+C$ — it cancels).',
        'Compute $F(b)$ and $F(a)$.',
        'Subtract to get $F(b) - F(a)$.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int_1^4 \\dfrac{1}{\\sqrt{x}}\\,dx$.',
        solution:
          'Rewrite as $\\int_1^4 x^{-1/2}\\,dx$ with antiderivative $F(x)=2x^{1/2}$. Then $F(4)-F(1) = 2\\sqrt{4} - 2\\sqrt{1} = 4 - 2 = 2$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Always append $+C$ to an INDEFINITE integral; omitting it is the most common (and most penalized) antiderivative error.', kind: 'common-error' },
    { content: 'The reverse power rule fails at $n=-1$ — that lone case is $\\int x^{-1}\\,dx = \\ln|x| + C$, not $\\tfrac{x^0}{0}$.', kind: 'gotcha' },
    { content: 'Use $\\ln|x|$ (with absolute value) for $\\int \\tfrac{1}{x}\\,dx$ so the antiderivative is valid for negative $x$ too.', kind: 'edge-case' },
    { content: 'Definite integrals drop the $+C$: it cancels in $F(b)-F(a)$, so include it only on indefinite answers.', kind: 'frq-vocab' },
    { content: 'When unsure, differentiate your answer — if you recover the integrand, the antiderivative is correct.', kind: 'tip' },
  ],
};
