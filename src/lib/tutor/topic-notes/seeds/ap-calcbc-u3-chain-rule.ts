/**
 * AP Calculus BC — Unit 3 CED 3.1: The Chain Rule.
 *
 * Baseline curated from evelyn.ap.calcbc.chain-rule.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries
 * kind+title, methods are humanized with when_to_use + a worked example,
 * pointers are a kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\frac, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.chain-rule';

export const BASELINE_AP_CALCBC_CHAIN_RULE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.chain-rule.v1',
  course: 'AP Calculus BC',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'The Chain Rule',
  planId: 'evelyn.ap.calcbc.chain-rule.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.chain-rule.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Composition of functions',
      content:
        'A COMPOSITION $f(g(x))$ feeds one function into another: $g$ (the INNER function) acts first, and its output is fed to $f$ (the OUTER function). Recognizing a function as a composition is the trigger for the chain rule — look for a function sitting INSIDE another, e.g. $\\sin(2x)$, $e^{x^2}$, $\\ln(3x+1)$, $(x^2+1)^{100}$, $\\sqrt{x^2+1}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The chain rule',
      content:
        'For a composite function, $\\dfrac{d}{dx}\\big[f(g(x))\\big] = f\'(g(x))\\,g\'(x)$ — "derivative of the OUTER (evaluated at the inner) times the derivative of the INNER." In Leibniz notation with $y=f(u)$ and $u=g(x)$: $\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}$, which makes the chain explicit.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Identifying the outer and inner functions',
      content:
        'When you see $f(\\text{stuff})$, the OUTER function is $f$ and the INNER is the "stuff." Examples: for $\\sin(2x)$, outer $=\\sin$, inner $=2x$; for $e^{x^2}$, outer $=e^{(\\cdot)}$, inner $=x^2$; for $(x^2+1)^{100}$, outer $=(\\cdot)^{100}$, inner $=x^2+1$. Differentiate the outer while holding the inner intact, then multiply by the inner\'s derivative.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'General power rule (power + chain)',
      content:
        'The most-tested chain-rule pattern combines the power rule with the chain rule: $\\dfrac{d}{dx}\\big[(g(x))^{n}\\big] = n\\,(g(x))^{n-1}\\,g\'(x)$. Example: $\\dfrac{d}{dx}\\big[(x^2+1)^{100}\\big] = 100\\,(x^2+1)^{99}\\cdot 2x = 200x\\,(x^2+1)^{99}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Nested compositions',
      content:
        'When functions are nested three or more deep, apply the chain rule REPEATEDLY from the outside in — each layer contributes a factor. For $\\sin\\!\\big(e^{2x}\\big)$: $\\dfrac{d}{dx}\\big[\\sin(e^{2x})\\big] = \\cos(e^{2x})\\cdot\\dfrac{d}{dx}[e^{2x}] = \\cos(e^{2x})\\cdot e^{2x}\\cdot 2 = 2e^{2x}\\cos(e^{2x})$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'chain rule (one-line)',
      content: '$\\dfrac{d}{dx}\\big[f(g(x))\\big] = f\'(g(x))\\,g\'(x)$ — outer-derivative-at-inner times inner-derivative.',
    },
  ],
  methods: [
    {
      title: 'Differentiate a composite function with the chain rule',
      when_to_use:
        'Whenever a function sits INSIDE another — $\\sin(\\cdot)$, $e^{(\\cdot)}$, $\\ln(\\cdot)$, $(\\cdot)^n$, $\\sqrt{\\cdot}$, etc.',
      steps: [
        'IDENTIFY the outer function $f$ and the inner function $g(x)$.',
        'DIFFERENTIATE the outer, holding the inner intact — this gives $f\'(g(x))$.',
        'MULTIPLY by the derivative of the inner, $g\'(x)$.',
        'If the inner is itself a composition, RECURSE: apply the chain rule again to $g\'(x)$.',
        'SIMPLIFY and collect factors.',
      ],
      example: {
        problem: 'Differentiate $y = (3x^2 + 2x)^5$ and $y = \\ln(x^2 + 5)$.',
        solution:
          'First: outer $=(\\cdot)^5$, inner $=3x^2+2x$ with derivative $g\'=6x+2$. Chain: $y\' = 5(3x^2+2x)^4(6x+2)$. Second: outer $=\\ln$, inner $=x^2+5$ with derivative $g\'=2x$. Chain: $y\' = \\dfrac{1}{x^2+5}\\cdot 2x = \\dfrac{2x}{x^2+5}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Combine the chain rule with the product or quotient rule',
      when_to_use:
        'When a composite appears as a factor in a product or quotient, e.g. $x^2\\,e^{3x}$ or $\\dfrac{\\sin(2x)}{x}$.',
      steps: [
        'Identify the OUTERMOST structure first (product, quotient, or composition).',
        'Apply the product or quotient rule at the top level.',
        'When you reach a factor that is a composition, apply the chain rule INSIDE that factor.',
        'Assemble the pieces and factor common terms to simplify.',
      ],
      example: {
        problem: 'Differentiate $y = x^2\\,e^{3x}$.',
        solution:
          'Product rule: $y\' = 2x\\,e^{3x} + x^2\\cdot\\dfrac{d}{dx}[e^{3x}]$. The inner derivative uses the chain rule: $\\dfrac{d}{dx}[e^{3x}] = 3e^{3x}$. So $y\' = 2x\\,e^{3x} + 3x^2 e^{3x} = x\\,e^{3x}(2 + 3x)$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Apply the chain rule to tabulated function values',
      when_to_use:
        'AP-style problems that give values of $f$, $g$ and their derivatives at points and ask for $\\dfrac{d}{dx}[f(g(x))]$ at $x=a$.',
      steps: [
        'Write the chain rule symbolically: $\\dfrac{d}{dx}[f(g(x))] = f\'(g(x))\\,g\'(x)$.',
        'Evaluate the INNER value $g(a)$ first — this tells you WHERE to read $f\'$.',
        'Look up $f\'(g(a))$ and $g\'(a)$ from the table.',
        'Multiply the two values.',
      ],
      example: {
        problem: 'Given $g(1)=2$, $g\'(1)=4$, $f(2)=5$, $f\'(2)=3$, find $\\dfrac{d}{dx}[f(g(x))]$ at $x=1$.',
        solution:
          'At $x=1$: $f\'(g(1))\\,g\'(1) = f\'(2)\\cdot 4 = 3\\cdot 4 = 12$. The value $f(2)=5$ is a distractor — only the DERIVATIVE $f\'(2)$ enters.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Do not forget the inner derivative $g\'(x)$ — dropping the "$\\cdot\\,g\'(x)$" factor is the single most common chain-rule error.', kind: 'common-error' },
    { content: 'Evaluate the outer derivative AT the inner function, not at $x$: $\\dfrac{d}{dx}[\\sin(2x)] = \\cos(2x)\\cdot 2$, not $\\cos(x)\\cdot 2$.', kind: 'gotcha' },
    { content: 'On tabulated-value problems, find $g(a)$ FIRST so you read $f\'$ at the right input; the value $f(g(a))$ itself never enters the derivative.', kind: 'frq-vocab' },
    { content: 'For nested compositions, work strictly outside-in and keep one un-differentiated inner at each stage — a factor is generated at every layer.', kind: 'tip' },
    { content: 'The general power rule $\\dfrac{d}{dx}[(g(x))^n] = n\\,(g(x))^{n-1}\\,g\'(x)$ needs the base to be a FUNCTION of $x$; for a constant base like $b^x$ use $\\dfrac{d}{dx}[b^x]=b^x\\ln b$ instead.', kind: 'edge-case' },
  ],
};
