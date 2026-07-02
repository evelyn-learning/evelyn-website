/**
 * AP Calculus BC — Unit 2 CED 2.5+2.6: Applying the Power Rule + Derivative
 * Rules for Constant, Sum, Difference, and Constant Multiple (linearity).
 *
 * Curated from evelyn.ap.calcbc.power-rule-linearity.v1 to the gold standard of
 * seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit (\frac, \dfrac, f, x, a sign, ...).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.power-rule';

export const BASELINE_AP_CALCBC_POWER_RULE_LINEARITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.power-rule-linearity.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.5-2.6',
  cedTitle: 'The Power Rule and Linearity',
  planId: 'evelyn.ap.calcbc.power-rule-linearity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.power-rule-linearity.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Power rule',
      content:
        'For ANY real number $n$: $\\dfrac{d}{dx}\\left[x^n\\right] = n\\,x^{n-1}$. Works for positive integers ($x^2 \\to 2x$), negatives ($x^{-1} \\to -x^{-2}$), fractions ($x^{1/2} \\to \\tfrac{1}{2}x^{-1/2}$), and arbitrary reals ($x^{\\pi} \\to \\pi\\,x^{\\pi-1}$).',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Constant rule',
      content:
        'The derivative of a constant is zero: $\\dfrac{d}{dx}\\left[c\\right] = 0$. A constant has no rate of change.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Constant-multiple rule',
      content:
        'Constants factor out: $\\dfrac{d}{dx}\\left[c\\,f(x)\\right] = c\\,f\'(x)$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Sum / difference rule',
      content:
        'Differentiation distributes over addition and subtraction: $\\dfrac{d}{dx}\\left[f(x) \\pm g(x)\\right] = f\'(x) \\pm g\'(x)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Linearity (combined)',
      content:
        'Together the rules give LINEARITY: $\\dfrac{d}{dx}\\left[c_1 f(x) + c_2 g(x)\\right] = c_1 f\'(x) + c_2 g\'(x)$. Differentiate a polynomial TERM BY TERM. Example: $\\dfrac{d}{dx}\\left[x^5 + 2x^3 - 7x + 4\\right] = 5x^4 + 6x^2 - 7$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Rewrite to power form first',
      content:
        'The power rule only "sees" $x^n$, so convert radicals and reciprocals: $\\tfrac{1}{x} = x^{-1}$, $\\sqrt{x} = x^{1/2}$, $\\tfrac{1}{x^3} = x^{-3}$, $\\sqrt[3]{x}=x^{1/3}$. Differentiate, then convert back to the original form if desired.',
    },
  ],
  methods: [
    {
      title: 'Differentiate a polynomial / power function with power rule + linearity',
      when_to_use:
        'For any sum of terms of the form $c\\,x^n$ (including radicals and reciprocals $\\tfrac{1}{x^n}$ once rewritten). This handles the bulk of mechanical differentiation.',
      steps: [
        'Rewrite every term as $c\\,x^n$ (turn roots into fractional powers and reciprocals into negative powers).',
        'Differentiate each term with the power rule: $c\\,x^n \\to c\\,n\\,x^{n-1}$; constants go to zero.',
        'Combine the term-by-term results (linearity).',
        'Convert back to radical / fraction form if the problem expects it.',
      ],
      example: {
        problem: 'Differentiate $f(x) = 3x^4 - 5x^3 + \\dfrac{2}{x} - \\sqrt{x} + 7$.',
        solution:
          'Rewrite: $f(x) = 3x^4 - 5x^3 + 2x^{-1} - x^{1/2} + 7$. Term by term: $f\'(x) = 12x^3 - 15x^2 - 2x^{-2} - \\tfrac{1}{2}x^{-1/2}$. Back in original form, $f\'(x) = 12x^3 - 15x^2 - \\dfrac{2}{x^2} - \\dfrac{1}{2\\sqrt{x}}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find a tangent line using the derivative',
      when_to_use:
        'When asked for the equation (or slope) of the tangent to $y=f(x)$ at $x=a$.',
      steps: [
        'Differentiate $f$ to get $f\'(x)$.',
        'Evaluate the slope $m = f\'(a)$.',
        'Evaluate the point $(a, f(a))$.',
        'Write point-slope: $y - f(a) = f\'(a)(x - a)$.',
      ],
      example: {
        problem: 'Find the tangent line to $y = x^3 - 2x$ at $x=1$.',
        solution:
          '$y\' = 3x^2 - 2$, so the slope is $y\'(1) = 3 - 2 = 1$. The point is $(1,\\ 1-2) = (1,-1)$. Tangent: $y - (-1) = 1\\cdot(x-1)$, i.e. $y = x - 2$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Rewrite radicals and reciprocals as powers BEFORE differentiating: $\\sqrt{x}=x^{1/2}$, $\\tfrac{1}{x^3}=x^{-3}$. This prevents most power-rule errors.', kind: 'tip' },
    { content: 'The exponent DROPS by one: $x^{-2} \\to -2x^{-3}$, not $-2x^{-1}$. With negative exponents "$n-1$" moves further negative.', kind: 'common-error' },
    { content: 'The derivative of a constant is zero, not the constant. In $x^5 + 4$, the $+4$ contributes nothing to $f\'$.', kind: 'gotcha' },
    { content: 'Each derivative lowers a polynomial\'s degree by one, so a degree-$n$ polynomial has $f^{(n)}$ constant and $f^{(n+1)}=0$.', kind: 'edge-case' },
    { content: 'FRQ tangent-line answers should be an explicit equation in point-slope or slope-intercept form, using $f\'(a)$ as the slope and $(a,f(a))$ as the point.', kind: 'frq-vocab' },
  ],
};
