/**
 * AP Calculus BC — Unit 9 CED 9.1+9.2: Parametric Equations and
 * Differentiation.
 *
 * Baseline curated from evelyn.ap.calcbc.parametric.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix (tip / frq-vocab / gotcha /
 * edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\frac, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.parametric';

export const BASELINE_AP_CALCBC_PARAMETRIC: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.parametric.v1',
  course: 'AP Calculus BC',
  cedUnit: 9,
  cedTopic: '9.1-9.2',
  cedTitle: 'Parametric Differentiation',
  planId: 'evelyn.ap.calcbc.parametric.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.parametric.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Parametric equations',
      content:
        'A PARAMETRIC CURVE is given by $x = f(t)$ and $y = g(t)$, where the PARAMETER $t$ traces out points $(x, y)$ in the plane. This describes curves that need not be functions of $x$ — e.g. $x = \\cos t,\\ y = \\sin t$ traces the unit circle, and $x = t,\\ y = t^2$ re-parameterizes the parabola $y = x^2$.',
      diagram: {
        type: 'parametric_curve',
        params: {
          title: 'x = t^2 - 4,  y = t^3 - 3t',
          exprLabel: 'x=t^2-4,\\ y=t^3-3t',
          curve: [
            { t: -2, x: 0, y: -2 },
            { t: -1.5, x: -1.75, y: 1.125 },
            { t: -1, x: -3, y: 2 },
            { t: -0.5, x: -3.75, y: 1.375 },
            { t: 0, x: -4, y: 0 },
            { t: 0.5, x: -3.75, y: -1.375 },
            { t: 1, x: -3, y: -2 },
            { t: 1.5, x: -1.75, y: -1.125 },
            { t: 2, x: 0, y: 2 },
          ],
          highlightT: { t: 1, x: -3, y: -2, label: 'horizontal tangent (t=1)' },
          tangentAtT: { x: -3, y: -2, dx: 2, dy: 0, length: 2 },
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'First derivative of a parametric curve',
      content:
        'The slope of the tangent line is $\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt} = \\dfrac{g\'(t)}{f\'(t)}$, provided $\\dfrac{dx}{dt} \\ne 0$. This is the chain rule solved for $\\dfrac{dy}{dx}$: since $\\dfrac{dy}{dt} = \\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$, divide by $\\dfrac{dx}{dt}$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Second derivative of a parametric curve',
      content:
        'The concavity uses $\\dfrac{d^2y}{dx^2} = \\dfrac{\\frac{d}{dt}\\!\\left[\\frac{dy}{dx}\\right]}{dx/dt}$ — differentiate the SLOPE $\\dfrac{dy}{dx}$ with respect to $t$, then divide again by $\\dfrac{dx}{dt}$. It is NOT $\\dfrac{d^2y/dt^2}{d^2x/dt^2}$, a very common trap.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Horizontal and vertical tangents',
      content:
        'A HORIZONTAL tangent occurs where $\\dfrac{dy}{dx} = 0$: set $\\dfrac{dy}{dt} = 0$ while $\\dfrac{dx}{dt} \\ne 0$. A VERTICAL tangent occurs where $\\dfrac{dy}{dx}$ is undefined: set $\\dfrac{dx}{dt} = 0$ while $\\dfrac{dy}{dt} \\ne 0$. Always confirm the OTHER derivative is nonzero at that $t$.',
    },
    {
      loId: LO,
      kind: 'edge-case',
      title: 'Cusps: both derivatives vanish',
      content:
        'When $\\dfrac{dx}{dt} = 0$ AND $\\dfrac{dy}{dt} = 0$ at the same $t$, the point is a CUSP and $\\dfrac{dy}{dx} = \\dfrac{0}{0}$ is indeterminate. The tangent direction must be found by a limit of $\\dfrac{dy/dt}{dx/dt}$ as $t$ approaches that value (it may be a specific slope or DNE).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'parametric curve (one-line)',
      content: 'a curve $(x, y) = (f(t), g(t))$ whose points are traced by a parameter $t$; slope $\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$.',
    },
  ],
  methods: [
    {
      title: 'Compute $\\dfrac{dy}{dx}$ and $\\dfrac{d^2y}{dx^2}$ for a parametric curve',
      when_to_use:
        'Given $x = f(t)$, $y = g(t)$ and asked for slope or concavity at a value of $t$ (or as a function of $t$).',
      steps: [
        'Compute $\\dfrac{dx}{dt} = f\'(t)$ and $\\dfrac{dy}{dt} = g\'(t)$.',
        'Form the slope $\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$.',
        'For the second derivative, differentiate $\\dfrac{dy}{dx}$ with respect to $t$ (quotient rule).',
        'Divide that result by $\\dfrac{dx}{dt}$ to get $\\dfrac{d^2y}{dx^2}$.',
        'Substitute the requested $t$-value LAST, once the symbolic derivative is in hand.',
      ],
      example: {
        problem: 'For $x = t^2$, $y = t^3 + t$, find $\\dfrac{dy}{dx}$ and $\\dfrac{d^2y}{dx^2}$ at $t = 1$.',
        solution:
          '$\\dfrac{dx}{dt} = 2t$, $\\dfrac{dy}{dt} = 3t^2 + 1$, so $\\dfrac{dy}{dx} = \\dfrac{3t^2 + 1}{2t}$; at $t=1$ this is $\\dfrac{4}{2} = 2$. Then $\\dfrac{d}{dt}\\!\\left[\\dfrac{3t^2+1}{2t}\\right] = \\dfrac{(6t)(2t) - (3t^2+1)(2)}{4t^2} = \\dfrac{6t^2 - 2}{4t^2}$, which is $\\dfrac{4}{4} = 1$ at $t=1$. Divide by $\\dfrac{dx}{dt} = 2$: $\\dfrac{d^2y}{dx^2} = \\dfrac{1}{2}$ at $t=1$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Locate horizontal and vertical tangents',
      when_to_use:
        'Asked where a parametric curve has a horizontal or vertical tangent line.',
      steps: [
        'Compute $\\dfrac{dx}{dt}$ and $\\dfrac{dy}{dt}$.',
        'HORIZONTAL: solve $\\dfrac{dy}{dt} = 0$; keep only the $t$-values where $\\dfrac{dx}{dt} \\ne 0$.',
        'VERTICAL: solve $\\dfrac{dx}{dt} = 0$; keep only the $t$-values where $\\dfrac{dy}{dt} \\ne 0$.',
        'Discard any $t$ where both vanish (a cusp — analyze separately).',
        'Back-substitute each surviving $t$ into $x, y$ to report the point $(x, y)$.',
      ],
      example: {
        problem: 'For $x = t^2 - 4$, $y = t^3 - 3t$, find all horizontal and vertical tangents.',
        solution:
          '$\\dfrac{dx}{dt} = 2t$, $\\dfrac{dy}{dt} = 3t^2 - 3$. Horizontal: $\\dfrac{dy}{dt} = 3t^2 - 3 = 0$ gives $t = \\pm 1$, and $\\dfrac{dx}{dt} = \\pm 2 \\ne 0$ — points $(-3, -2)$ at $t = 1$ and $(-3, 2)$ at $t = -1$. Vertical: $\\dfrac{dx}{dt} = 2t = 0$ gives $t = 0$, and $\\dfrac{dy}{dt} = -3 \\ne 0$ — point $(-4, 0)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The second derivative is $\\dfrac{d^2y}{dx^2} = \\dfrac{\\frac{d}{dt}[dy/dx]}{dx/dt}$ — NOT $\\dfrac{d^2y/dt^2}{d^2x/dt^2}$. This is the single most common parametric error.', kind: 'common-error' },
    { content: 'For a vertical tangent, check that $\\dfrac{dy}{dt} \\ne 0$; for a horizontal tangent, check that $\\dfrac{dx}{dt} \\ne 0$. If BOTH are zero you have a cusp, not a clean tangent.', kind: 'gotcha' },
    { content: 'On FRQs, state "$\\dfrac{dy}{dx}$ at $t = a$" by evaluating $\\dfrac{dy/dt}{dx/dt}$ at that $t$; do not eliminate the parameter unless the prompt asks for a Cartesian equation.', kind: 'frq-vocab' },
    { content: 'Do not divide $\\dfrac{d}{dt}[dy/dx]$ by anything other than $\\dfrac{dx}{dt}$ — the extra $\\dfrac{1}{dx/dt}$ factor is what converts the $t$-derivative back to an $x$-derivative.', kind: 'edge-case' },
    { content: 'Sanity-check a slope by eliminating the parameter on a simple curve (e.g. $x = t$, $y = t^2$ gives $\\dfrac{dy}{dx} = 2t = 2x$), which matches $\\dfrac{d}{dx}[x^2]$.', kind: 'tip' },
  ],
};
