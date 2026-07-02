/**
 * AP Calculus BC — Unit 8 CED 8.12: Washer Method Revolving Around Other Axes.
 *
 * Baseline curated from evelyn.ap.calcbc.washer-other-axes.v1 to the gold
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

const LO = 'apcalcbc.washer-other-axes';

export const BASELINE_AP_CALCBC_WASHER_OTHER_AXES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.washer-other-axes.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.12',
  cedTitle: 'Volume with Washer Method: Revolving Around Other Axes',
  planId: 'evelyn.ap.calcbc.washer-other-axes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.washer-other-axes.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Washer formula is unchanged',
      content:
        'Revolving about a line other than a coordinate axis uses the SAME washer formula, $V = \\pi\\int \\big(R^2 - r^2\\big)\\,dx$ (or $dy$). Only the way you COMPUTE the radii $R$ (outer) and $r$ (inner) changes — the axis of revolution never alters the formula itself.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Radius is distance to the axis (with offset)',
      content:
        'A radius is always the DISTANCE from a bounding curve to the axis of revolution, taken as a non-negative quantity. When the axis is not a coordinate axis, every radius picks up an OFFSET. Revolving about $y = -1$, a curve at height $y$ is a distance $y - (-1) = y + 1$ away — not $y$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Horizontal axis y = c',
      content:
        'For a horizontal axis $y = c$, slice vertically and integrate in $x$. The distance from a curve at height $y$ to the axis is $\\lvert y - c\\rvert$. The boundary FARTHER from $y = c$ gives $R$; the closer boundary gives $r$. If the axis lies below a region between $\\text{top}$ and $\\text{bottom}$: $R = \\text{top} - c$, $r = \\text{bottom} - c$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Vertical axis x = k',
      content:
        'For a vertical axis $x = k$, slice horizontally and integrate in $y$. The distance from a curve at horizontal position $x$ to the axis is $\\lvert x - k\\rvert$. The boundary farther from $x = k$ gives $R$; the closer boundary gives $r$. Solve each curve for $x$ as a function of $y$ first.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Which boundary is the outer radius',
      content:
        'The FARTHER boundary from the axis sweeps the bigger circle, so it is always the OUTER radius $R$; the closer boundary is the inner radius $r$. When the axis lies ABOVE the region, the LOWER curve is farther (bigger $R$); when the axis lies BELOW, the UPPER curve is farther. Label distances before assigning $R$ and $r$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'offset radius (one-line)',
      content: 'Radius $= \\lvert \\text{curve} - \\text{axis}\\rvert$; revolving about $y = c$ or $x = k$ adds that offset to each radius.',
    },
  ],
  methods: [
    {
      title: 'Washer about a horizontal line y = c',
      when_to_use:
        'Revolving a region between two curves about a horizontal line $y = c$ that is not the $x$-axis.',
      steps: [
        'Sketch the region and the axis $y = c$; find the $x$-bounds from the curves\' intersections.',
        'Write each radius as a distance to the axis: $R = \\text{(farther curve)} - c$ (or $c - \\text{curve}$), $r = \\text{(closer curve)} - c$, kept non-negative.',
        'Set up $V = \\pi\\int_a^b \\big(R^2 - r^2\\big)\\,dx$.',
        'Expand each squared radius separately, subtract, then integrate.',
      ],
      example: {
        problem: 'Revolve the region between $y = \\sqrt{x}$ (top) and $y = x$ (bottom), on $[0,1]$, about $y = -1$.',
        solution:
          'The axis is below the region, so $R = \\sqrt{x} - (-1) = \\sqrt{x} + 1$ and $r = x + 1$. $V = \\pi\\int_0^1 \\big[(\\sqrt{x}+1)^2 - (x+1)^2\\big]\\,dx = \\pi\\int_0^1 \\big(-x^2 - x + 2\\sqrt{x}\\big)\\,dx = \\pi\\big(-\\tfrac{1}{3} - \\tfrac{1}{2} + \\tfrac{4}{3}\\big) = \\tfrac{\\pi}{2}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Washer about a vertical line x = k',
      when_to_use:
        'Revolving a region about a vertical line $x = k$ (e.g. $x = 2$) that is not the $y$-axis.',
      steps: [
        'Solve the boundary curves for $x$ as functions of $y$; find the $y$-bounds.',
        'At a generic $y$, write $R$ and $r$ as horizontal distances to $x = k$ (axis-value minus curve, or curve minus axis, kept non-negative).',
        'Set up $V = \\pi\\int_c^d \\big(R^2 - r^2\\big)\\,dy$.',
        'Square each radius separately, subtract, then integrate.',
      ],
      example: {
        problem: 'Revolve the region bounded by $y = x^2$, $y = 0$, and $x = 1$ about $x = 2$. Set up the washer integral in $y$.',
        solution:
          'Solve $x = \\sqrt{y}$; at height $y$ the region runs from $x = \\sqrt{y}$ to $x = 1$, with the axis $x = 2$ to the right. Farther boundary is $x = \\sqrt{y}$, so $R = 2 - \\sqrt{y}$; closer is $x = 1$, so $r = 2 - 1 = 1$. With $y \\in [0,1]$: $V = \\pi\\int_0^1 \\big[(2 - \\sqrt{y})^2 - (1)^2\\big]\\,dy$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Never forget the OFFSET: revolving about $y = -1$, the radius of a curve at height $y$ is $y + 1$, not $y$. Sketch the axis and label each distance before squaring.', kind: 'common-error' },
    { content: 'Square each radius separately: $(\\text{top} - c)^2 - (\\text{bottom} - c)^2 \\ne (\\text{top} - \\text{bottom})^2$. Collapsing the radii destroys the hole.', kind: 'gotcha' },
    { content: 'When the axis is ABOVE the region, the LOWER curve is farther away and becomes the OUTER radius $R$ — counterintuitive, so justify it on FRQs.', kind: 'edge-case' },
    { content: 'Slices are perpendicular to the axis: horizontal axis $\\Rightarrow$ integrate $dx$; vertical axis $\\Rightarrow$ integrate $dy$.', kind: 'tip' },
    { content: 'For full FRQ credit, state each radius as a clean non-negative distance ("$R = 3 - x^2$ because the axis $y = 3$ is above the region") before writing the integral.', kind: 'frq-vocab' },
  ],
};
