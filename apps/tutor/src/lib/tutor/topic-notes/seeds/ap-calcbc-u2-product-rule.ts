/**
 * AP Calculus BC — Unit 2 CED 2.8: The Product Rule.
 *
 * Curated from evelyn.ap.calcbc.product-rule.v1 to the gold standard of
 * seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.product-rule';

export const BASELINE_AP_CALCBC_PRODUCT_RULE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.product-rule.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.8',
  cedTitle: 'The Product Rule',
  planId: 'evelyn.ap.calcbc.product-rule.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.product-rule.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Product rule',
      content:
        '$\\dfrac{d}{dx}\\left[f(x)\\,g(x)\\right] = f\'(x)\\,g(x) + f(x)\\,g\'(x)$. Two terms: differentiate ONE factor at a time and keep the other, then sum.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Mnemonic and when to use',
      content:
        '"First-prime times second, plus first times second-prime." Use it whenever you have a PRODUCT of two functions that each carry their own $x$: $x\\sin x$, $e^x \\ln x$, $(x^2+1)\\cos x$, $(3x^2+5)(x-4)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Derivatives do NOT distribute over products',
      content:
        '$\\dfrac{d}{dx}[f\\,g] \\ne f\'\\,g\'$. Counterexample: with $f=g=x$, the product is $x^2$ so $\\dfrac{d}{dx}[x^2] = 2x$, but $f\'g\' = 1\\cdot 1 = 1$. Differentiation distributes over ADDITION (linearity), never over multiplication.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When you do not need it',
      content:
        'For polynomial products that expand easily, expanding first is often faster: $(x+2)(x-3) = x^2 - x - 6 \\to 2x - 1$. Reserve the product rule for factors that cannot be simplified, e.g. $x\\,e^x$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Extension to three or more factors',
      content:
        'Each factor takes a turn: $\\dfrac{d}{dx}\\left[f\\,g\\,h\\right] = f\'gh + fg\'h + fgh\'$. Derived by applying the two-factor rule twice.',
    },
  ],
  methods: [
    {
      title: 'Differentiate a product of two functions',
      when_to_use:
        'When $f(x)$ is written as a product $u(x)\\,v(x)$ where each factor depends on $x$ and cannot be trivially combined.',
      steps: [
        'Name the factors $u$ and $v$.',
        'Compute $u\'$ and $v\'$ separately.',
        'Assemble $u\'v + uv\'$.',
        'Simplify or expand only if the problem asks (or to evaluate at a point).',
      ],
      example: {
        problem: 'Differentiate $f(x) = (3x^2 + 1)\\sin x$.',
        solution:
          'Let $u = 3x^2+1$ (so $u\' = 6x$) and $v = \\sin x$ (so $v\' = \\cos x$). Then $f\'(x) = u\'v + uv\' = 6x\\sin x + (3x^2+1)\\cos x$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Differentiate a product of three factors',
      when_to_use:
        'When $f = fgh$ is a product of three functions each depending on $x$.',
      steps: [
        'Group as $(fg)\\cdot h$ and apply the two-factor rule, then apply it again to $(fg)\'$.',
        'This yields the symmetric pattern $f\'gh + fg\'h + fgh\'$ — each factor differentiated once while the others are held.',
        'Substitute the individual derivatives and factor out common pieces.',
      ],
      example: {
        problem: 'Differentiate $f(x) = x^2\\,\\sin x\\,e^x$.',
        solution:
          'With $f=x^2$ ($f\'=2x$), $g=\\sin x$ ($g\'=\\cos x$), $h=e^x$ ($h\'=e^x$): $\\dfrac{d}{dx} = 2x\\sin x\\,e^x + x^2\\cos x\\,e^x + x^2\\sin x\\,e^x = e^x\\,x\\left(2\\sin x + x\\cos x + x\\sin x\\right)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The product rule has TWO terms; writing only $f\'g\'$ is the single most-tested error. Differentiate one factor at a time and add.', kind: 'common-error' },
    { content: 'Derivatives distribute over addition but NOT multiplication: $\\dfrac{d}{dx}[fg] = f\'g + fg\'$, never $f\'g\'$.', kind: 'gotcha' },
    { content: 'For an easy polynomial product, expanding first can be faster than the product rule — both give the same answer.', kind: 'tip' },
    { content: 'Three factors follow the symmetric pattern $f\'gh + fg\'h + fgh\'$: each factor is differentiated exactly once per term.', kind: 'edge-case' },
    { content: 'When a table gives $f(a)$, $f\'(a)$, $g(a)$, $g\'(a)$, an FRQ product-rule value is $(fg)\'(a) = f\'(a)g(a) + f(a)g\'(a)$ — plug the given numbers in directly.', kind: 'frq-vocab' },
  ],
};
