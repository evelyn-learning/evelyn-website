/**
 * AP Calculus BC — Unit 8 CED 8.9–8.11: Volumes of Revolution
 * (Disc and Washer methods).
 *
 * Baseline curated from evelyn.ap.calcbc.volumes-revolution.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry
 * carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\pi, a letter, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.volumes-revolution';

export const BASELINE_AP_CALCBC_VOLUMES_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.volumes-revolution.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.9-8.11',
  cedTitle: 'Volumes of Revolution',
  planId: 'evelyn.ap.calcbc.volumes-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.volumes-revolution.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Disc method',
      content:
        'When the region touches the axis of revolution, each cross-section of the solid is a full DISC (circle). Its area is $\\pi r^2$, so $V = \\pi\\int_a^b [r(x)]^2\\,dx$, where $r(x)$ is the distance from the axis to the bounding curve. Revolving about the $x$-axis with top curve $f$ gives $V = \\pi\\int_a^b [f(x)]^2\\,dx$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Washer method',
      content:
        'When there is a GAP between the region and the axis, each cross-section is an annulus (WASHER) with outer radius $R$ and inner radius $r$. Its area is $\\pi(R^2 - r^2)$, so $V = \\pi\\int_a^b \\big([R(x)]^2 - [r(x)]^2\\big)\\,dx$. $R$ reaches the FARTHER boundary from the axis; $r$ reaches the CLOSER one.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Revolving about the x-axis vs. the y-axis',
      content:
        'About the $x$-axis, radii are functions of $x$ and you integrate $dx$. About the $y$-axis, rewrite the curves as functions of $y$ and integrate $dy$: $V = \\pi\\int_c^d [x(y)]^2\\,dy$ (disc) or $\\pi\\int_c^d \\big(R(y)^2 - r(y)^2\\big)\\,dy$ (washer). The slices are always perpendicular to the axis of revolution.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Radius is the distance from the axis',
      content:
        'The radius is always the DISTANCE from the axis of revolution to the bounding curve. About the $x$-axis this distance is just the curve value; about the $y$-axis it is the $x$-value of the curve. This distance principle is what extends cleanly to revolution about shifted lines (CED 8.12).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'disc & washer (one-line)',
      content: 'Disc: $V = \\pi\\int r^2\\,dx$ (region touches axis). Washer: $V = \\pi\\int (R^2 - r^2)\\,dx$ (gap from axis).',
    },
  ],
  methods: [
    {
      title: 'Disc method',
      when_to_use:
        'Revolving a region that TOUCHES the axis of revolution (no gap) — the solid is filled, with circular cross sections.',
      steps: [
        'Sketch the region and the axis; confirm the region meets the axis (disc, not washer).',
        'Write the radius $r$ as the distance from the axis to the bounding curve.',
        'Set up $V = \\pi\\int_a^b [r]^2\\,dx$ (or $dy$ if revolving about a vertical axis).',
        'Square, integrate, and evaluate.',
      ],
      example: {
        problem: 'Revolve $y = x^2$, $y = 0$, $x = 0$, $x = 2$ about the $x$-axis.',
        solution:
          'The region touches the $x$-axis, so use discs with $r(x) = x^2$. $V = \\pi\\int_0^2 (x^2)^2\\,dx = \\pi\\int_0^2 x^4\\,dx = \\pi\\big[\\tfrac{x^5}{5}\\big]_0^2 = \\tfrac{32\\pi}{5}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Washer method',
      when_to_use:
        'Revolving a region bounded by TWO curves so there is a hollow core between the region and the axis.',
      steps: [
        'Sketch the region; identify the OUTER boundary (farther from axis $\\to R$) and INNER boundary (closer $\\to r$).',
        'Write $R$ and $r$ as distances from the axis to those curves.',
        'Set up $V = \\pi\\int_a^b \\big(R^2 - r^2\\big)\\,dx$.',
        'Square each radius SEPARATELY, subtract, then integrate.',
      ],
      example: {
        problem: 'Revolve the region between $y = x$ and $y = x^2$ on $[0,1]$ about the $x$-axis.',
        solution:
          'On $[0,1]$, $y = x$ is above $y = x^2$, so $R = x$, $r = x^2$. $V = \\pi\\int_0^1 \\big(x^2 - x^4\\big)\\,dx = \\pi\\big[\\tfrac{x^3}{3} - \\tfrac{x^5}{5}\\big]_0^1 = \\pi\\big(\\tfrac{1}{3} - \\tfrac{1}{5}\\big) = \\tfrac{2\\pi}{15}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Revolving about the y-axis',
      when_to_use:
        'When the axis of revolution is the $y$-axis (or the region is more naturally described in $y$).',
      steps: [
        'Solve each boundary curve for $x$ as a function of $y$.',
        'Find the $y$-bounds of the region.',
        'Write the radius (or radii) as the $x$-distance from the $y$-axis; choose disc or washer.',
        'Evaluate $V = \\pi\\int_c^d [\\,\\cdot\\,]\\,dy$.',
      ],
      example: {
        problem: 'Revolve the first-quadrant region bounded by $y = x^2$ and $y = 4$ about the $y$-axis.',
        solution:
          'Rewrite $x = \\sqrt{y}$; the region touches the $y$-axis, so use discs with $r = \\sqrt{y}$ and $y \\in [0,4]$. $V = \\pi\\int_0^4 (\\sqrt{y})^2\\,dy = \\pi\\int_0^4 y\\,dy = \\pi\\big[\\tfrac{y^2}{2}\\big]_0^4 = 8\\pi$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Washers require squaring EACH radius separately: $\\pi\\int(R^2 - r^2)\\,dx$, never $\\pi\\int (R - r)^2\\,dx$. The two are not equal — the hole is genuine.', kind: 'common-error' },
    { content: 'Use a washer whenever the region does not touch the axis; use a disc only when it does. A quick sketch of the gap settles which.', kind: 'tip' },
    { content: 'Do not drop the leading $\\pi$ — it multiplies the ENTIRE integral. Factor it out front so it is not forgotten.', kind: 'gotcha' },
    { content: 'Revolving about the $y$-axis forces a $dy$ integral with $x$ written as a function of $y$; mixing $dx$ limits into a $dy$ setup is a classic slip.', kind: 'edge-case' },
    { content: 'On FRQs, name the method ("washer, outer radius $R = \\ldots$, inner radius $r = \\ldots$") and show the setup before evaluating — setup earns most of the points.', kind: 'frq-vocab' },
  ],
};
