/**
 * AP Calculus BC — Unit 8 CED 8.4–8.6: Area Between Curves.
 *
 * Baseline curated from evelyn.ap.calcbc.area-between-curves.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry
 * carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.area-between-curves';

export const BASELINE_AP_CALCBC_AREA_BETWEEN_CURVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.area-between-curves.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.4-8.6',
  cedTitle: 'Area Between Curves',
  planId: 'evelyn.ap.calcbc.area-between-curves.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.area-between-curves.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Area between two curves (in x)',
      content:
        'If $f(x) \\ge g(x)$ on $[a,b]$, the area of the region between them is $A = \\int_a^b \\big[f(x) - g(x)\\big]\\,dx$ — "TOP minus BOTTOM." Each vertical slice has height $f(x) - g(x)$ and width $dx$; integrating sweeps the slices across $[a,b]$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finding the bounds of integration',
      content:
        'The limits $a$ and $b$ come from the INTERSECTIONS of the curves: solve $f(x) = g(x)$. The solutions are where the region opens and closes (and, if the curves cross in the interior, where "top" and "bottom" swap). On a numeric calculator part, find intersections with the intersect/solver feature.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When the curves swap: split the integral',
      content:
        'If $f$ and $g$ cross at $x = c$ inside $(a,b)$ — with $f \\ge g$ on $[a,c]$ but $g \\ge f$ on $[c,b]$ — you must SPLIT: $A = \\int_a^c (f - g)\\,dx + \\int_c^b (g - f)\\,dx$. Each piece keeps top-minus-bottom so every contribution stays positive.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Integrating with respect to y',
      content:
        'When the curves are naturally functions of $y$ (e.g. $x = y^2$), or a $dx$ setup would need several pieces, integrate horizontally: $A = \\int_c^d \\big[\\,x_{\\text{right}}(y) - x_{\\text{left}}(y)\\,\\big]\\,dy$ — "RIGHT minus LEFT." Slices are horizontal, with bounds from the $y$-values of the intersections.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'area between curves (one-line)',
      content: '$A = \\int \\big[\\text{top} - \\text{bottom}\\big]\\,dx$ (or $\\int \\big[\\text{right} - \\text{left}\\big]\\,dy$).',
    },
  ],
  methods: [
    {
      title: 'Area between two curves integrating in x',
      when_to_use:
        'Given two curves $y = f(x)$ and $y = g(x)$ and asked for the area they enclose (or the area on a stated interval).',
      steps: [
        'Find intersections by solving $f(x) = g(x)$; these give the bounds $a$ and $b$.',
        'Decide which curve is TOP: test an $x$-value between the bounds, or sketch the region.',
        'Write $A = \\int_a^b \\big[\\text{top} - \\text{bottom}\\big]\\,dx$.',
        'Evaluate the integral (antiderivative on a no-calculator part, or numeric integration otherwise).',
      ],
      example: {
        problem: 'Find the area between $y = x^2$ and $y = 2x$.',
        solution:
          'Intersections: $x^2 = 2x \\Rightarrow x(x - 2) = 0 \\Rightarrow x = 0, 2$. Test $x = 1$: the line gives $y = 2$, the parabola gives $y = 1$, so the line is on top. $A = \\int_0^2 (2x - x^2)\\,dx = \\big[x^2 - \\tfrac{x^3}{3}\\big]_0^2 = 4 - \\tfrac{8}{3} = \\tfrac{4}{3}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Area integrating with respect to y',
      when_to_use:
        'When both boundaries are functions of $y$, or a curve fails the vertical-line test over the region, making $dx$ awkward.',
      steps: [
        'Rewrite each boundary as $x$ in terms of $y$.',
        'Find intersections by solving for the $y$-values; these give the bounds $c$ and $d$.',
        'Decide which curve is on the RIGHT by testing a $y$-value in the interval.',
        'Write and evaluate $A = \\int_c^d \\big[\\text{right} - \\text{left}\\big]\\,dy$.',
      ],
      example: {
        problem: 'Find the area enclosed by $x = y^2$ and $x = y + 2$.',
        solution:
          'Intersect: $y^2 = y + 2 \\Rightarrow (y - 2)(y + 1) = 0 \\Rightarrow y = -1, 2$. Test $y = 0$: the line gives $x = 2$, the parabola gives $x = 0$, so the line $x = y + 2$ is on the right. $A = \\int_{-1}^{2} \\big[(y + 2) - y^2\\big]\\,dy = \\big[\\tfrac{y^2}{2} + 2y - \\tfrac{y^3}{3}\\big]_{-1}^{2} = \\tfrac{11}{2}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Area when the curves cross inside the interval',
      when_to_use:
        'When the two curves intersect at an interior point so that top and bottom swap, or the region has multiple lobes.',
      steps: [
        'Find ALL intersections in the interval, not just the endpoints.',
        'On each subinterval, determine which curve is on top (test a point).',
        'Integrate top-minus-bottom on each subinterval separately.',
        'Add the pieces — every piece is positive because you always subtract the lower curve.',
      ],
      example: {
        problem: 'Set up the area between $y = \\sin x$ and $y = x^2$ on $[0, \\tfrac{\\pi}{2}]$, where they cross near $x \\approx 0.876$.',
        solution:
          'On $[0, 0.876]$, $\\sin x \\ge x^2$; on $[0.876, \\tfrac{\\pi}{2}]$, $x^2 \\ge \\sin x$. So $A = \\int_0^{0.876} (\\sin x - x^2)\\,dx + \\int_{0.876}^{\\pi/2} (x^2 - \\sin x)\\,dx$, with the crossing found numerically.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Always SKETCH the region first — the single biggest source of errors is misidentifying which curve is top vs. bottom (or right vs. left).', kind: 'tip' },
    { content: 'If the curves cross inside the interval, integrating $f - g$ straight through lets positive and negative pieces cancel and UNDERSTATES the area. Split at each crossing.', kind: 'common-error' },
    { content: 'On the calculator part, "area" wants a NUMERIC value — state the definite-integral setup, then report the decimal (three digits) for full credit.', kind: 'frq-vocab' },
    { content: 'Choose the integration variable that minimizes splitting: a region bounded by $x = h(y)$ curves is usually one clean $dy$ integral but several $dx$ integrals.', kind: 'edge-case' },
    { content: 'When a region is bounded by a curve and a vertical/horizontal line, one "curve" may just be a constant (e.g. bottom $= 0$ for area under a curve).', kind: 'gotcha' },
  ],
};
