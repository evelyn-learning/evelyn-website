/**
 * AP Calculus BC — Unit 3 CED 3.3 + 3.4: Derivatives of Inverse Functions and
 * Inverse Trigonometric Functions.
 *
 * Baseline curated from evelyn.ap.calcbc.derivatives-inverse-functions.v1 to the
 * gold standard set by seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every span opens with a
 * non-digit.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.derivatives-inverse-functions';

export const BASELINE_AP_CALCBC_DERIVATIVES_INVERSE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.derivatives-inverse-functions.v1',
  course: 'AP Calculus BC',
  cedUnit: 3,
  cedTopic: '3.3-3.4',
  cedTitle: 'Derivatives of Inverse Functions and Inverse Trig',
  planId: 'evelyn.ap.calcbc.derivatives-inverse-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.derivatives-inverse-functions.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Inverse-function derivative formula',
      content:
        'If $f$ and $g$ are inverses ($g(f(x))=x$) and $f$ is differentiable at $a$ with $f\'(a)\\ne 0$, then $g\'(f(a)) = \\dfrac{1}{f\'(a)}$. Equivalently, $\\big(f^{-1}\\big)\'(b) = \\dfrac{1}{f\'\\big(f^{-1}(b)\\big)}$. Graphically, since inverses reflect across $y=x$, their slopes at corresponding points are reciprocals.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Why the formula holds',
      content:
        'Differentiate the identity $g(f(x)) = x$ with respect to $x$ using the chain rule: $g\'(f(x))\\,f\'(x) = 1$, so $g\'(f(x)) = \\dfrac{1}{f\'(x)}$. Writing $f(x)=b$ gives $x = f^{-1}(b)$, hence $\\big(f^{-1}\\big)\'(b) = \\dfrac{1}{f\'(f^{-1}(b))}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Inverse trig derivatives (memorize)',
      content:
        'The three core formulas: $\\dfrac{d}{dx}[\\arcsin x] = \\dfrac{1}{\\sqrt{1-x^2}}$ (for $|x|<1$); $\\dfrac{d}{dx}[\\arccos x] = -\\dfrac{1}{\\sqrt{1-x^2}}$ (the NEGATIVE of arcsin\'s); $\\dfrac{d}{dx}[\\arctan x] = \\dfrac{1}{1+x^2}$ (all $x$).',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The negative-pair inverse trig derivatives',
      content:
        'The co-functions are the negatives of their partners: $\\dfrac{d}{dx}[\\operatorname{arccot} x] = -\\dfrac{1}{1+x^2}$; $\\dfrac{d}{dx}[\\operatorname{arcsec} x] = \\dfrac{1}{|x|\\sqrt{x^2-1}}$ (for $|x|>1$); $\\dfrac{d}{dx}[\\operatorname{arccsc} x] = -\\dfrac{1}{|x|\\sqrt{x^2-1}}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Chain rule with inverse trig',
      content:
        'Composed with an inner function $g(x)$, each formula gains a factor $g\'(x)$: $\\dfrac{d}{dx}[\\arcsin(g(x))] = \\dfrac{g\'(x)}{\\sqrt{1-g(x)^2}}$ and $\\dfrac{d}{dx}[\\arctan(g(x))] = \\dfrac{g\'(x)}{1+g(x)^2}$, and similarly for the rest.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'inverse-function derivative formula',
      content: '$\\big(f^{-1}\\big)\'(b) = \\dfrac{1}{f\'(f^{-1}(b))}$ — the derivative of the inverse is the reciprocal of $f\'$ evaluated at the matching input.',
    },
  ],
  methods: [
    {
      title: 'Compute (f⁻¹)′(b) with the inverse-function formula',
      when_to_use:
        'When you are asked for the derivative of an inverse at a value $b$ without a closed form for $f^{-1}$.',
      steps: [
        'Write the formula $\\big(f^{-1}\\big)\'(b) = \\dfrac{1}{f\'(f^{-1}(b))}$.',
        'Find $f^{-1}(b)$: solve $f(x) = b$ (often by inspection of a nice integer).',
        'Compute $f\'(x)$ and evaluate it at that $x = f^{-1}(b)$.',
        'Take the reciprocal.',
      ],
      example: {
        problem: 'For $f(x) = x^3 + x + 2$ (one-to-one), find $\\big(f^{-1}\\big)\'(4)$.',
        solution:
          'Solve $f(x)=4$: $x=1$ works since $f(1)=1+1+2=4$, so $f^{-1}(4)=1$. Then $f\'(x)=3x^2+1$, so $f\'(1)=4$. Therefore $\\big(f^{-1}\\big)\'(4) = \\dfrac{1}{f\'(1)} = \\dfrac{1}{4}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Differentiate an inverse-trig expression',
      when_to_use:
        'When differentiating $\\arcsin$, $\\arccos$, $\\arctan$ (etc.) possibly composed with an inner function.',
      steps: [
        'Identify which inverse-trig formula applies and write it down.',
        'Substitute the inner function $g(x)$ into the formula.',
        'Multiply by the inner derivative $g\'(x)$ (chain rule).',
        'Simplify the radical or rational expression.',
      ],
      example: {
        problem: 'Differentiate $y = \\arcsin(2x)$ and $y = \\arctan(x^2)$.',
        solution:
          'First: $\\dfrac{d}{dx}[\\arcsin(2x)] = \\dfrac{1}{\\sqrt{1-(2x)^2}}\\cdot 2 = \\dfrac{2}{\\sqrt{1-4x^2}}$. Second: $\\dfrac{d}{dx}[\\arctan(x^2)] = \\dfrac{1}{1+(x^2)^2}\\cdot 2x = \\dfrac{2x}{1+x^4}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Derive an inverse-trig derivative from scratch',
      when_to_use:
        'AP synthesis prompts that ask you to DERIVE (not just quote) a formula such as $\\dfrac{d}{dx}[\\arctan x]$.',
      steps: [
        'Set $y = \\arctan x$, so $\\tan y = x$.',
        'Differentiate both sides implicitly: $\\sec^2 y\\,\\dfrac{dy}{dx} = 1$.',
        'Solve: $\\dfrac{dy}{dx} = \\dfrac{1}{\\sec^2 y} = \\cos^2 y$.',
        'Convert back to $x$ using a reference triangle / Pythagorean identity.',
      ],
      example: {
        problem: 'Derive $\\dfrac{d}{dx}[\\arctan x] = \\dfrac{1}{1+x^2}$.',
        solution:
          'From $\\tan y = x$, a right triangle with opposite side $x$ and adjacent side of length one has hypotenuse $\\sqrt{x^2+1}$, so $\\cos y = \\dfrac{1}{\\sqrt{x^2+1}}$ and $\\cos^2 y = \\dfrac{1}{x^2+1}$. Hence $\\dfrac{dy}{dx} = \\dfrac{1}{1+x^2}$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Read $f\'$ at $f^{-1}(b)$, NOT at $b$: the most common error is evaluating $f\'$ at the wrong input. Find $f^{-1}(b)$ first.', kind: 'common-error' },
    { content: 'Remember the negative pairs: $\\arccos$, $\\operatorname{arccot}$, $\\operatorname{arccsc}$ carry a minus sign relative to $\\arcsin$, $\\arctan$, $\\operatorname{arcsec}$.', kind: 'gotcha' },
    { content: 'To justify invertibility on an FRQ, show $f\'>0$ (or $f\'<0$) everywhere so $f$ is strictly monotonic — a required setup step.', kind: 'frq-vocab' },
    { content: 'Do not forget the chain-rule factor: $\\dfrac{d}{dx}[\\arctan(x^2)]$ gains an inner-derivative factor, giving $\\dfrac{2x}{1+x^4}$, not $\\dfrac{1}{1+x^4}$.', kind: 'tip' },
    { content: 'The inverse-function formula needs $f\'(f^{-1}(b))\\ne 0$; where $f\'=0$ the inverse has a vertical tangent and $\\big(f^{-1}\\big)\'$ is undefined.', kind: 'edge-case' },
  ],
};
