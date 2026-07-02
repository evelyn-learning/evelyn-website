/**
 * AP Calculus BC — Unit 2 CED 2.7: Derivatives of cos x, sin x, e^x, and
 * ln x.
 *
 * Curated from evelyn.ap.calcbc.transcendental-derivatives.v1 to the gold
 * standard of seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.transcendental-derivatives';

export const BASELINE_AP_CALCBC_TRANSCENDENTAL_DERIVATIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.transcendental-derivatives.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.7',
  cedTitle: 'Derivatives of sin, cos, e^x, ln x',
  planId: 'evelyn.ap.calcbc.transcendental-derivatives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.transcendental-derivatives.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The four core derivatives',
      content:
        '$\\dfrac{d}{dx}[\\sin x] = \\cos x$; $\\dfrac{d}{dx}[\\cos x] = -\\sin x$ (note the NEGATIVE sign); $\\dfrac{d}{dx}[e^x] = e^x$; $\\dfrac{d}{dx}[\\ln x] = \\dfrac{1}{x}$ (for $x>0$). These four must be instant recall.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The exponential is its own derivative',
      content:
        '$e^x$ is the unique elementary function with $\\dfrac{d}{dx}[e^x] = e^x$ — this self-derivative property is exactly what pins down the number $e \\approx 2.71828$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where sin and cos derivatives come from',
      content:
        'From the limit definition with the special limits $\\lim_{h\\to 0}\\dfrac{\\sin h}{h} = 1$ and $\\lim_{h\\to 0}\\dfrac{1-\\cos h}{h} = 0$ (CED 1.6/1.8). These yield $\\dfrac{d}{dx}[\\sin x]=\\cos x$ and $\\dfrac{d}{dx}[\\cos x]=-\\sin x$.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Sin / cos derivatives cycle with period 4',
      content:
        'Differentiating $\\sin x$ repeatedly cycles: $\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x$. After four derivatives you return to the start, so $\\dfrac{d^4}{dx^4}[\\sin x] = \\sin x$. For high orders, reduce the order $\\bmod 4$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Only basic functions (no compositions yet)',
      content:
        'These rules apply to the bare functions $\\sin x$, $\\cos x$, $e^x$, $\\ln x$. Compositions like $\\sin(2x)$, $e^{3x}$, $\\ln(x^2+1)$ need the CHAIN RULE (CED 3.1) — do not apply the basic rule directly to an inside function.',
    },
  ],
  methods: [
    {
      title: 'Differentiate a linear combination of transcendental terms',
      when_to_use:
        'When $f$ is a sum of constant multiples of $\\sin x$, $\\cos x$, $e^x$, $\\ln x$, and powers of $x$.',
      steps: [
        'Differentiate each term with its core rule (watch the negative sign on $\\cos$).',
        'Keep constant multiples out front (linearity).',
        'Combine term by term.',
        'For any $\\ln x$ term, note the domain restriction $x>0$.',
      ],
      example: {
        problem: 'Find $f\'(x)$ for $f(x) = 4\\sin x - 3\\cos x + 2e^x - 5\\ln x + x^3$.',
        solution:
          '$\\dfrac{d}{dx}[4\\sin x] = 4\\cos x$; $\\dfrac{d}{dx}[-3\\cos x] = 3\\sin x$; $\\dfrac{d}{dx}[2e^x] = 2e^x$; $\\dfrac{d}{dx}[-5\\ln x] = -\\dfrac{5}{x}$; $\\dfrac{d}{dx}[x^3] = 3x^2$. So $f\'(x) = 4\\cos x + 3\\sin x + 2e^x - \\dfrac{5}{x} + 3x^2$ (defined for $x>0$).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Only $\\cos$ carries the minus: $\\dfrac{d}{dx}[\\cos x] = -\\sin x$, while $\\dfrac{d}{dx}[\\sin x] = +\\cos x$. Swapping the sign is the most common slip.', kind: 'common-error' },
    { content: '$\\dfrac{d}{dx}[e^x] = e^x$ — the exponential is unchanged. Do NOT bring down an exponent as if it were a power of $x$.', kind: 'gotcha' },
    { content: 'These rules are for the BARE functions only; $\\sin(2x)$ or $e^{3x}$ require the chain rule (CED 3.1). Applying $\\cos(2x)$ as the derivative of $\\sin(2x)$ drops the inside factor.', kind: 'edge-case' },
    { content: 'For high-order derivatives of $\\sin$ or $\\cos$, reduce the order modulo four and read off the cycle $\\sin \\to \\cos \\to -\\sin \\to -\\cos$.', kind: 'tip' },
    { content: 'The $\\ln x$ rule assumes $x>0$; state the domain when a problem or FRQ involves $\\ln x$.', kind: 'frq-vocab' },
  ],
};
