/**
 * AP Calculus BC — Unit 9 CED 9.8+9.9: Areas Using Polar Curves.
 *
 * Baseline curated from evelyn.ap.calcbc.polar-area.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use + a
 * worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (A, \frac, r, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.polar-area';

export const BASELINE_AP_CALCBC_POLAR_AREA: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.polar-area.v1',
  course: 'AP Calculus BC',
  cedUnit: 9,
  cedTopic: '9.8-9.9',
  cedTitle: 'Polar Areas',
  planId: 'evelyn.ap.calcbc.polar-area.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.polar-area.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Area enclosed by a polar curve',
      content:
        'The area swept by $r = r(\\theta)$ as $\\theta$ runs from $\\alpha$ to $\\beta$ is $A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta \\big[r(\\theta)\\big]^2\\,d\\theta$. The region is built from thin PIE SLICES, not rectangles.',
      diagram: {
        type: 'polar_graph',
        params: {
          title: 'r = 1 + cos(theta)  (cardioid)',
          exprLabel: 'r=1+\\cos\\theta',
          curve: [
            { theta: 0, r: 2 },
            { theta: 0.5236, r: 1.866 },
            { theta: 1.0472, r: 1.5 },
            { theta: 1.5708, r: 1 },
            { theta: 2.0944, r: 0.5 },
            { theta: 2.618, r: 0.134 },
            { theta: 3.1416, r: 0 },
            { theta: 3.6652, r: 0.134 },
            { theta: 4.1888, r: 0.5 },
            { theta: 4.7124, r: 1 },
            { theta: 5.236, r: 1.5 },
            { theta: 5.7596, r: 1.866 },
            { theta: 6.2832, r: 2 },
          ],
          highlightPoint: { theta: 0, r: 2, label: 'r=2 at θ=0' },
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Where the $\\tfrac{1}{2}r^2$ comes from',
      content:
        'A circular SECTOR of radius $r$ subtending angle $d\\theta$ has area $\\dfrac{1}{2}r^2\\,d\\theta$ (from $\\tfrac{1}{2}r^2\\theta$ for a full sector). Summing these infinitesimal wedges over $[\\alpha, \\beta]$ gives the integral $\\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta r^2\\,d\\theta$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Area between two polar curves',
      content:
        'For an OUTER curve $r_{\\text{out}}(\\theta)$ and an INNER curve $r_{\\text{in}}(\\theta)$ over the same angular interval, $A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta \\big[r_{\\text{out}}^2 - r_{\\text{in}}^2\\big]\\,d\\theta$. Square each radius FIRST, then subtract — never subtract the radii before squaring.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding the limits of integration',
      content:
        'The bounds $\\alpha$, $\\beta$ come from the geometry: for ONE petal or loop, use consecutive $\\theta$ where $r = 0$; for area BETWEEN curves, set $r_{\\text{out}} = r_{\\text{in}}$ and solve for the intersection angles. Choosing bad limits is the top source of lost points.',
    },
    {
      loId: LO,
      kind: 'edge-case',
      title: 'Integrating $\\sin^2$ and $\\cos^2$',
      content:
        'The squared radius almost always produces $\\sin^2\\theta$ or $\\cos^2\\theta$. Use the power-reduction identities $\\cos^2\\theta = \\dfrac{1 + \\cos 2\\theta}{2}$ and $\\sin^2\\theta = \\dfrac{1 - \\cos 2\\theta}{2}$ so the integrand becomes elementary.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'polar area (one-line)',
      content: '$A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta r^2\\,d\\theta$ — half the integral of the squared radius over the swept angle.',
    },
  ],
  methods: [
    {
      title: 'Compute the area enclosed by one polar curve (or one loop)',
      when_to_use:
        'Asked for the area inside a single polar curve, or the area of one petal/loop.',
      steps: [
        'Determine the angular bounds $\\alpha$, $\\beta$ — for a full closed curve usually $\\alpha = 0$ to $\\beta = 2\\pi$; for one loop, take consecutive angles where $r = 0$.',
        'Write $A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta r^2\\,d\\theta$.',
        'Expand $r^2$ and apply a power-reduction identity to any $\\sin^2$ or $\\cos^2$.',
        'Integrate term by term; full-period integrals of $\\cos\\theta$, $\\sin\\theta$, $\\cos 2\\theta$ vanish.',
        'Multiply by $\\dfrac{1}{2}$ and simplify.',
      ],
      example: {
        problem: 'Find the total area enclosed by the cardioid $r = 1 + \\cos\\theta$.',
        solution:
          '$A = \\dfrac{1}{2}\\displaystyle\\int_0^{2\\pi} (1 + \\cos\\theta)^2\\,d\\theta$. Expand: $(1 + \\cos\\theta)^2 = 1 + 2\\cos\\theta + \\cos^2\\theta$, and use $\\cos^2\\theta = \\tfrac{1 + \\cos 2\\theta}{2}$ to get $\\tfrac{3}{2} + 2\\cos\\theta + \\tfrac{1}{2}\\cos 2\\theta$. Over $[0, 2\\pi]$ the cosine terms integrate to zero, leaving $\\displaystyle\\int_0^{2\\pi}\\tfrac{3}{2}\\,d\\theta = 3\\pi$. So $A = \\dfrac{1}{2}(3\\pi) = \\dfrac{3\\pi}{2}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compute the area between two polar curves',
      when_to_use:
        'Asked for the area inside one curve and outside another (e.g. inside a cardioid, outside a circle).',
      steps: [
        'Set $r_{\\text{out}} = r_{\\text{in}}$ and solve for the intersection angles to get $\\alpha$, $\\beta$.',
        'Decide which curve is OUTER on that interval (test a sample angle).',
        'Write $A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta \\big[r_{\\text{out}}^2 - r_{\\text{in}}^2\\big]\\,d\\theta$.',
        'Expand and square each radius before subtracting; apply power-reduction identities.',
        'Integrate and simplify.',
      ],
      example: {
        problem: 'Find the area inside $r = 2 + 2\\sin\\theta$ but outside $r = 2$.',
        solution:
          'Intersections: $r_{\\text{out}} = r_{\\text{in}}$ gives $\\sin\\theta = 0$, so $\\theta = 0, \\pi$; the cardioid is outer where $\\sin\\theta > 0$, i.e. $\\theta \\in (0, \\pi)$. Then $A = \\dfrac{1}{2}\\displaystyle\\int_0^\\pi \\big[(2 + 2\\sin\\theta)^2 - 4\\big]\\,d\\theta = \\dfrac{1}{2}\\displaystyle\\int_0^\\pi \\big(8\\sin\\theta + 4\\sin^2\\theta\\big)\\,d\\theta$. Using $\\sin^2\\theta = \\tfrac{1 - \\cos 2\\theta}{2}$, this is $\\dfrac{1}{2}\\displaystyle\\int_0^\\pi \\big(8\\sin\\theta + 2 - 2\\cos 2\\theta\\big)\\,d\\theta = \\dfrac{1}{2}\\big[-8\\cos\\theta + 2\\theta - \\sin 2\\theta\\big]_0^\\pi = \\dfrac{1}{2}\\big[(8 + 2\\pi) - (-8)\\big] = 8 + \\pi$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Square BEFORE subtracting: area between curves is $\\dfrac{1}{2}\\int (r_{\\text{out}}^2 - r_{\\text{in}}^2)\\,d\\theta$, not $\\dfrac{1}{2}\\int (r_{\\text{out}} - r_{\\text{in}})^2\\,d\\theta$.', kind: 'common-error' },
    { content: 'Do not forget the leading $\\dfrac{1}{2}$ — the polar area factor is easy to drop when you focus on the integral.', kind: 'gotcha' },
    { content: 'On an FRQ, justify the limits: state the angles where $r = 0$ (one loop) or where the curves intersect (between-curves) before writing the integral.', kind: 'frq-vocab' },
    { content: 'For a rose $r = \\sin(n\\theta)$, integrate ONE petal over consecutive zeros of $r$, then multiply by the petal count — integrating over $\\theta \\in [0, 2\\pi]$ can double-count overlapping petals.', kind: 'edge-case' },
    { content: 'Sanity-check against a known area: the cardioid $r = 1 + \\cos\\theta$ enclosing $\\dfrac{3\\pi}{2}$, and $r = a$ enclosing $\\pi a^2$, confirm your setup and $\\tfrac{1}{2}$ factor.', kind: 'tip' },
  ],
};
