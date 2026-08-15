/**
 * AP Calculus BC — Unit 2 CED 2.9+2.10: The Quotient Rule + Finding the
 * Derivatives of tan, cot, sec, and csc.
 *
 * Curated from evelyn.ap.calcbc.quotient-rule.v1 to the gold standard of
 * seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.quotient-rule';

export const BASELINE_AP_CALCBC_QUOTIENT_RULE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.quotient-rule.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.9-2.10',
  cedTitle: 'Quotient Rule and Trig Derivatives',
  planId: 'evelyn.ap.calcbc.quotient-rule.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.quotient-rule.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Quotient rule',
      content:
        '$\\dfrac{d}{dx}\\left[\\dfrac{f(x)}{g(x)}\\right] = \\dfrac{f\'(x)\\,g(x) - f(x)\\,g\'(x)}{\\left[g(x)\\right]^2}$. The MINUS sits in the middle and the denominator is squared.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Mnemonic and sign order',
      content:
        '"Low d-high minus high d-low, over the square of what\'s below" — i.e. $\\dfrac{(\\text{bottom})(\\text{top}\')-(\\text{top})(\\text{bottom}\')}{(\\text{bottom})^2}$. The sign order is CRITICAL: reversing to $\\dfrac{f g\' - f\'g}{g^2}$ negates the answer.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When to use it',
      content:
        'Use it for a visible quotient where both numerator and denominator are functions: $\\dfrac{x^2+1}{x-3}$, $\\dfrac{\\sin x}{x}$, $\\dfrac{e^x}{x^2+1}$. For $\\dfrac{f}{c}$ with $c$ constant, just use linearity: $\\dfrac{d}{dx}\\left[\\tfrac{f}{c}\\right] = \\tfrac{f\'}{c}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The four trig derivatives',
      content:
        '$\\dfrac{d}{dx}[\\tan x] = \\sec^2 x$; $\\dfrac{d}{dx}[\\cot x] = -\\csc^2 x$; $\\dfrac{d}{dx}[\\sec x] = \\sec x\\tan x$; $\\dfrac{d}{dx}[\\csc x] = -\\csc x\\cot x$. The two co-functions (cot, csc) carry a NEGATIVE sign. Memorize all four.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Deriving tan and sec',
      content:
        'From $\\tan x = \\dfrac{\\sin x}{\\cos x}$, the quotient rule gives $\\dfrac{\\cos x\\cos x - \\sin x(-\\sin x)}{\\cos^2 x} = \\dfrac{\\cos^2 x + \\sin^2 x}{\\cos^2 x} = \\dfrac{1}{\\cos^2 x} = \\sec^2 x$. Likewise $\\sec x = \\dfrac{1}{\\cos x}$ gives $\\sec x\\tan x$.',
    },
  ],
  methods: [
    {
      title: 'Differentiate a quotient of two functions',
      when_to_use:
        'When $f(x)$ is a fraction $\\dfrac{\\text{top}}{\\text{bottom}}$ with a non-constant denominator.',
      steps: [
        'Identify top and bottom and compute top$\'$ and bottom$\'$.',
        'Assemble the numerator in the correct order: $(\\text{top}\')(\\text{bottom}) - (\\text{top})(\\text{bottom}\')$.',
        'Divide by (bottom)$^2$.',
        'Expand / simplify the numerator only if asked; leave the squared denominator factored.',
      ],
      example: {
        problem: 'Differentiate $f(x) = \\dfrac{x^2+1}{x^3-5}$.',
        solution:
          'Top $= x^2+1$ (top$\'=2x$); bottom $= x^3-5$ (bottom$\'=3x^2$). $f\'(x) = \\dfrac{2x(x^3-5) - (x^2+1)(3x^2)}{(x^3-5)^2} = \\dfrac{-x^4 - 3x^2 - 10x}{(x^3-5)^2}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Derive a trig derivative with the quotient rule',
      when_to_use:
        'When asked to prove a standard trig derivative (e.g. $\\tan$, $\\cot$, $\\sec$, $\\csc$) from $\\sin$ and $\\cos$.',
      steps: [
        'Rewrite the function as a quotient of $\\sin x$ and $\\cos x$ (or a reciprocal).',
        'Apply the quotient rule with the correct sign order.',
        'Simplify the numerator using the Pythagorean identity $\\sin^2 x + \\cos^2 x = 1$.',
        'Convert back to $\\sec$ / $\\csc$ / etc. form.',
      ],
      example: {
        problem: 'Derive $\\dfrac{d}{dx}[\\tan x] = \\sec^2 x$.',
        solution:
          '$\\tan x = \\dfrac{\\sin x}{\\cos x}$. Quotient rule: $\\dfrac{\\cos x\\cos x - \\sin x(-\\sin x)}{\\cos^2 x} = \\dfrac{\\cos^2 x + \\sin^2 x}{\\cos^2 x} = \\dfrac{1}{\\cos^2 x} = \\sec^2 x$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Sign order is everything: the numerator is $(\\text{top}\')(\\text{bottom}) - (\\text{top})(\\text{bottom}\')$. Swapping the two products flips the sign of the whole derivative.', kind: 'common-error' },
    { content: 'Do not forget to SQUARE the denominator — the $g^2$ is part of the rule, not optional.', kind: 'gotcha' },
    { content: 'The co-functions get the minus sign: $\\dfrac{d}{dx}[\\cot x] = -\\csc^2 x$ and $\\dfrac{d}{dx}[\\csc x] = -\\csc x\\cot x$.', kind: 'tip' },
    { content: 'For $\\dfrac{f}{c}$ with constant $c$, skip the quotient rule and use $\\dfrac{f\'}{c}$; the quotient rule still works but wastes time.', kind: 'edge-case' },
    { content: 'Memorize all four trig derivatives ($\\tan\\to\\sec^2$, $\\cot\\to-\\csc^2$, $\\sec\\to\\sec\\tan$, $\\csc\\to-\\csc\\cot$) — they recur throughout AP MCQ and FRQ.', kind: 'frq-vocab' },
  ],
};
