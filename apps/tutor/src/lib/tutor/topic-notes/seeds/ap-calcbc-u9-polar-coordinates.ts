/**
 * AP Calculus BC — Unit 9 CED 9.7: Polar Coordinates and Differentiation.
 *
 * Baseline curated from evelyn.ap.calcbc.polar-coordinates.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: every theory entry carries kind+title, methods
 * are humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (r, x, \theta, \frac, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.polar-coordinates';

export const BASELINE_AP_CALCBC_POLAR_COORDINATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.polar-coordinates.v1',
  course: 'AP Calculus BC',
  cedUnit: 9,
  cedTopic: '9.7',
  cedTitle: 'Polar Coordinates',
  planId: 'evelyn.ap.calcbc.polar-coordinates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.polar-coordinates.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Polar coordinates',
      content:
        'A point is $(r, \\theta)$, where $r$ is the DISTANCE from the origin (pole) and $\\theta$ is the ANGLE from the positive $x$-axis. Polar form is natural for circles, spirals, cardioids, and rose curves that are awkward in Cartesian form.',
      diagram: {
        type: 'polar_graph',
        params: {
          title: 'r = 2 cos(theta)  (circle, center (1,0))',
          exprLabel: 'r=2\\cos\\theta',
          curve: [
            { theta: -1.5708, r: 0 },
            { theta: -1.0472, r: 1 },
            { theta: -0.5236, r: 1.7321 },
            { theta: 0, r: 2 },
            { theta: 0.5236, r: 1.7321 },
            { theta: 1.0472, r: 1 },
            { theta: 1.5708, r: 0 },
          ],
          highlightPoint: { theta: 0, r: 2, label: '(r,θ)=(2,0)' },
        },
      },
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Converting between polar and Cartesian',
      content:
        'Polar to Cartesian: $x = r\\cos\\theta$, $y = r\\sin\\theta$. Cartesian to polar: $r^2 = x^2 + y^2$ and $\\tan\\theta = \\dfrac{y}{x}$. Always pick $\\theta$ using the QUADRANT of $(x, y)$ — the arctangent alone cannot distinguish opposite directions.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'A polar curve is a parametric curve in $\\theta$',
      content:
        'Treat $\\theta$ as the parameter: $x(\\theta) = r(\\theta)\\cos\\theta$, $y(\\theta) = r(\\theta)\\sin\\theta$. All parametric machinery then applies, with $\\theta$ playing the role of $t$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Slope of a polar curve',
      content:
        'By the product rule on $x = r\\cos\\theta$ and $y = r\\sin\\theta$: $\\dfrac{dx}{d\\theta} = r\'\\cos\\theta - r\\sin\\theta$ and $\\dfrac{dy}{d\\theta} = r\'\\sin\\theta + r\\cos\\theta$. The tangent slope is $\\dfrac{dy}{dx} = \\dfrac{dy/d\\theta}{dx/d\\theta}$, where $r\' = \\dfrac{dr}{d\\theta}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Common polar-curve families',
      content:
        'CIRCLES: $r = a\\cos\\theta$ or $r = a\\sin\\theta$ (through the origin, diameter $|a|$). LIMAÇONS: $r = a + b\\cos\\theta$ (a cardioid when $|a| = |b|$; an inner loop when $|a| < |b|$). ROSES: $r = a\\cos(n\\theta)$ or $a\\sin(n\\theta)$ have $n$ petals when $n$ is odd and twice that many when $n$ is even.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'polar coordinates (one-line)',
      content: '$(r, \\theta)$: signed distance $r$ from the pole at angle $\\theta$ from the positive $x$-axis; $x = r\\cos\\theta$, $y = r\\sin\\theta$.',
    },
  ],
  methods: [
    {
      title: 'Convert a point between polar and Cartesian form',
      when_to_use:
        'Given $(r, \\theta)$ and asked for $(x, y)$, or given $(x, y)$ and asked for $(r, \\theta)$.',
      steps: [
        'Polar to Cartesian: substitute into $x = r\\cos\\theta$, $y = r\\sin\\theta$.',
        'Cartesian to polar: compute $r = \\sqrt{x^2 + y^2}$.',
        'Find $\\theta$ from $\\tan\\theta = \\dfrac{y}{x}$, then ADJUST to the correct quadrant of $(x, y)$.',
        'Report $(r, \\theta)$; state a valid choice of $\\theta$ (e.g. in $[0, 2\\pi)$).',
      ],
      example: {
        problem: 'Convert $(-1, \\sqrt{3})$ to polar form.',
        solution:
          '$r = \\sqrt{(-1)^2 + (\\sqrt{3})^2} = \\sqrt{4} = 2$. The point is in Quadrant II, so although $\\tan\\theta = -\\sqrt{3}$, the correct angle is $\\theta = \\pi - \\dfrac{\\pi}{3} = \\dfrac{2\\pi}{3}$. Polar form: $\\left(2,\\ \\dfrac{2\\pi}{3}\\right)$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find the slope $\\dfrac{dy}{dx}$ of a polar curve',
      when_to_use:
        'Given $r = r(\\theta)$ and asked for the tangent slope (or horizontal/vertical tangents) at an angle.',
      steps: [
        'Compute $r\' = \\dfrac{dr}{d\\theta}$.',
        'Form $\\dfrac{dx}{d\\theta} = r\'\\cos\\theta - r\\sin\\theta$ and $\\dfrac{dy}{d\\theta} = r\'\\sin\\theta + r\\cos\\theta$.',
        'Divide: $\\dfrac{dy}{dx} = \\dfrac{dy/d\\theta}{dx/d\\theta}$.',
        'For horizontal tangents set $\\dfrac{dy}{d\\theta} = 0$ (with $\\dfrac{dx}{d\\theta} \\ne 0$); for vertical, set $\\dfrac{dx}{d\\theta} = 0$ (with $\\dfrac{dy}{d\\theta} \\ne 0$).',
        'Substitute the angle LAST.',
      ],
      example: {
        problem: 'For the cardioid $r = 1 + \\cos\\theta$, find $\\dfrac{dy}{dx}$ at $\\theta = \\dfrac{\\pi}{2}$.',
        solution:
          '$r\' = -\\sin\\theta$. $\\dfrac{dx}{d\\theta} = -\\sin\\theta\\cos\\theta - (1 + \\cos\\theta)\\sin\\theta$; at $\\theta = \\tfrac{\\pi}{2}$ this is $-(1)(0) - (1)(1) = -1$. $\\dfrac{dy}{d\\theta} = -\\sin^2\\theta + (1 + \\cos\\theta)\\cos\\theta$; at $\\theta = \\tfrac{\\pi}{2}$ this is $-1 + 0 = -1$. So $\\dfrac{dy}{dx} = \\dfrac{-1}{-1} = 1$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'When converting $(x, y) \\to (r, \\theta)$, fix $\\theta$ by the QUADRANT of the point; $\\arctan(y/x)$ alone collapses Quadrants II/IV onto I/III.', kind: 'common-error' },
    { content: 'Polar slope is $\\dfrac{dy}{dx} = \\dfrac{dy/d\\theta}{dx/d\\theta}$, NOT $\\dfrac{dr}{d\\theta}$. The derivative $\\dfrac{dr}{d\\theta}$ is only an ingredient, not the slope.', kind: 'gotcha' },
    { content: 'For a rose $r = \\sin(n\\theta)$ or $\\cos(n\\theta)$: $n$ petals when $n$ is odd, and double that (an even count) when $n$ is even — state which when identifying the curve on an FRQ.', kind: 'frq-vocab' },
    { content: 'A single geometric point has infinitely many polar names: $(r, \\theta) = (r, \\theta + 2\\pi k)$, and also $(-r, \\theta + \\pi)$ with a NEGATIVE radius pointing the opposite way.', kind: 'edge-case' },
    { content: 'Memorize $\\dfrac{dx}{d\\theta} = r\'\\cos\\theta - r\\sin\\theta$ and $\\dfrac{dy}{d\\theta} = r\'\\sin\\theta + r\\cos\\theta$ as the product rule on $r\\cos\\theta$ and $r\\sin\\theta$ — you never need to memorize a separate polar-slope formula.', kind: 'tip' },
  ],
};
