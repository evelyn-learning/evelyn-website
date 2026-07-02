/**
 * AP Calculus BC — Unit 3 CED 3.5 + 3.6: Selecting Procedures for Calculating
 * Derivatives and Higher-Order Derivatives.
 *
 * Baseline curated from evelyn.ap.calcbc.higher-order-derivatives.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every span opens with a
 * non-digit.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.higher-order-derivatives';

export const BASELINE_AP_CALCBC_HIGHER_ORDER_DERIVATIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.higher-order-derivatives.v1',
  course: 'AP Calculus BC',
  cedUnit: 3,
  cedTopic: '3.5-3.6',
  cedTitle: 'Selecting Procedures and Higher-Order Derivatives',
  planId: 'evelyn.ap.calcbc.higher-order-derivatives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.higher-order-derivatives.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Higher-order derivatives',
      content:
        'A HIGHER-ORDER derivative is the result of differentiating more than once. The second derivative $f\'\'(x)$ is the derivative of $f\'(x)$; the third $f\'\'\'(x)$ is the derivative of $f\'\'(x)$; and so on. $f\'\'$ measures how $f\'$ is changing — the basis for concavity, acceleration, and Taylor series.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Notation for higher derivatives',
      content:
        'Prime notation runs $f\'$, $f\'\'$, $f\'\'\'$, then switches to superscripts: $f^{(4)}$, $f^{(5)}$, …, $f^{(n)}$. Leibniz notation runs $\\dfrac{dy}{dx}$, $\\dfrac{d^2y}{dx^2}$, $\\dfrac{d^3y}{dx^3}$, …, $\\dfrac{d^n y}{dx^n}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Patterns in repeated differentiation',
      content:
        'Some functions cycle or scale predictably: for $e^{ax}$, every derivative pulls out a factor $a$, so $\\dfrac{d^n}{dx^n}[e^{ax}] = a^n e^{ax}$; for $\\sin x$ the derivatives cycle with period four ($\\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x$); a degree-$n$ polynomial drops one degree per derivative and reaches zero after $n+1$ derivatives.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Strategy for selecting differentiation procedures',
      content:
        'Identify the OUTERMOST structure first, apply the matching rule, then recurse inward: SUM/DIFFERENCE → linearity (term-by-term); PRODUCT → product rule; QUOTIENT → quotient rule; COMPOSITION → chain rule; equation in $x$ and $y$ → implicit differentiation; INVERSE → inverse-function formula. Most problems combine several.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Implicit second derivatives',
      content:
        'To get $\\dfrac{d^2y}{dx^2}$ implicitly: differentiate the equation once for $\\dfrac{dy}{dx}$, differentiate that expression again (quotient/product rule as needed), then SUBSTITUTE the earlier $\\dfrac{dy}{dx}$ and the original equation to simplify to $x$ and $y$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'second derivative',
      content: '$f\'\'(x) = \\dfrac{d^2f}{dx^2}$, the derivative of $f\'(x)$; higher-order $f^{(n)}(x)$ comes from differentiating $n$ times.',
    },
  ],
  methods: [
    {
      title: 'Compute a higher-order derivative directly',
      when_to_use:
        'When asked for $f\'\'$, $f\'\'\'$, or a general $f^{(n)}$ of an explicit function.',
      steps: [
        'Differentiate $f$ once to get $f\'$, simplifying fully.',
        'Differentiate the simplified $f\'$ to get $f\'\'$, applying the chain rule again if needed.',
        'Repeat for each additional order required.',
        'For a general $f^{(n)}$, compute the first few derivatives, spot the pattern, and write the closed form.',
      ],
      example: {
        problem: 'Find $f\'\'(x)$ for $f(x) = \\sin(2x)$, and a formula for $f^{(n)}(x)$ when $f(x)=e^{2x}$.',
        solution:
          'For $\\sin(2x)$: $f\'(x) = 2\\cos(2x)$, then $f\'\'(x) = -4\\sin(2x)$. For $e^{2x}$: each derivative pulls out a factor of two, so $f^{(n)}(x) = 2^n e^{2x}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find an implicit second derivative d²y/dx²',
      when_to_use:
        'When a curve is given implicitly and the problem asks for $\\dfrac{d^2y}{dx^2}$ in terms of $x$ and $y$.',
      steps: [
        'Differentiate implicitly once and solve for $\\dfrac{dy}{dx}$.',
        'Differentiate that expression again with respect to $x$ (quotient rule if it is a fraction).',
        'Substitute the first-derivative result $\\dfrac{dy}{dx}$ wherever it appears.',
        'Use the ORIGINAL equation to simplify the answer.',
      ],
      example: {
        problem: 'For $x^2 + y^2 = 4$, find $\\dfrac{d^2y}{dx^2}$.',
        solution:
          'First: $\\dfrac{d}{dx}[x^2+y^2]=2x + 2y\\,\\dfrac{dy}{dx}=0 \\Rightarrow \\dfrac{dy}{dx} = -\\dfrac{x}{y}$. Differentiate: $\\dfrac{d^2y}{dx^2} = -\\dfrac{y - x\\,\\frac{dy}{dx}}{y^2}$. Substitute $\\dfrac{dy}{dx}=-\\dfrac{x}{y}$: $\\dfrac{d^2y}{dx^2} = -\\dfrac{y + x^2/y}{y^2} = -\\dfrac{y^2+x^2}{y^3}$. Using $x^2+y^2=4$: $\\dfrac{d^2y}{dx^2} = -\\dfrac{4}{y^3}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Select and sequence rules for a complex expression',
      when_to_use:
        'For expressions that stack several rules — a product or quotient of composites, or a composite of composites.',
      steps: [
        'Name the OUTERMOST operation (quotient, product, or composition).',
        'Apply that rule, leaving inner factors symbolic.',
        'Recurse into each inner factor, choosing the appropriate rule.',
        'Assemble and simplify.',
      ],
      example: {
        problem: 'Differentiate $y = \\arctan\\!\\big(e^{x^2}\\big)$.',
        solution:
          'Outermost is $\\arctan$; inner $e^{x^2}$; innermost $x^2$. Chain rule twice: $y\' = \\dfrac{1}{1+(e^{x^2})^2}\\cdot e^{x^2}\\cdot 2x = \\dfrac{2x\\,e^{x^2}}{1+e^{2x^2}}$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Simplify $f\'$ FULLY before differentiating again — carrying an unsimplified first derivative multiplies the algebra errors in $f\'\'$.', kind: 'tip' },
    { content: 'For an implicit $\\dfrac{d^2y}{dx^2}$, you must substitute the first derivative $\\dfrac{dy}{dx}$ back in; leaving it in the answer is incomplete.', kind: 'common-error' },
    { content: 'On the exam, "select an appropriate procedure" means naming the OUTERMOST structure first — misreading a quotient as a product derails the whole computation.', kind: 'frq-vocab' },
    { content: 'For a general $f^{(n)}$, verify your pattern against $f\'$, $f\'\'$, $f\'\'\'$ before generalizing; sign and factorial patterns are easy to get off by one.', kind: 'gotcha' },
    { content: 'The sin/cos derivative cycle has period four, so $f^{(n)}$ depends only on $n \\bmod 4$ — reduce the order before computing.', kind: 'edge-case' },
  ],
};
