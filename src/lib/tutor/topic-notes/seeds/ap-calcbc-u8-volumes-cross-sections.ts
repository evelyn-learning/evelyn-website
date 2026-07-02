/**
 * AP Calculus BC — Unit 8 CED 8.7–8.8: Volumes with Known Cross Sections.
 *
 * Baseline curated from evelyn.ap.calcbc.volumes-cross-sections.v1 to the gold
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

const LO = 'apcalcbc.volumes-cross-sections';

export const BASELINE_AP_CALCBC_VOLUMES_CROSS_SECTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.volumes-cross-sections.v1',
  course: 'AP Calculus BC',
  cedUnit: 8,
  cedTopic: '8.7-8.8',
  cedTitle: 'Volumes with Cross Sections',
  planId: 'evelyn.ap.calcbc.volumes-cross-sections.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.volumes-cross-sections.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Volume by integrating cross-sectional area',
      content:
        'Slice a solid perpendicular to an axis into thin slabs. If the slab at position $x$ has cross-sectional area $A(x)$ and thickness $dx$, its volume is $A(x)\\,dx$. Summing all slabs gives $V = \\int_a^b A(x)\\,dx$ (or $\\int_c^d A(y)\\,dy$ when slicing perpendicular to the $y$-axis). All cross-section problems reduce to writing $A$ correctly.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The side/diameter comes from the base',
      content:
        'The base of the solid is a planar region bounded by curves. At each position, the cross-section\'s SIDE (or diameter) equals the length of the base segment there: $\\text{top} - \\text{bottom}$ when slicing perpendicular to the $x$-axis, or $\\text{right} - \\text{left}$ when slicing perpendicular to the $y$-axis. Get this length first, then plug into the area formula for the given shape.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Square and rectangular cross sections',
      content:
        'For a SQUARE cross-section with side $s$, $A = s^2$; if the side spans two curves, $A = \\big(\\text{top} - \\text{bottom}\\big)^2$. For a RECTANGLE of height $h$ and width $w$, $A = h\\,w$, with $h$ and $w$ read from the geometry of the problem.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Triangular and semicircular cross sections',
      content:
        'EQUILATERAL TRIANGLE of side $s$: $A = \\dfrac{\\sqrt{3}}{4}\\,s^2$. SEMICIRCLE whose DIAMETER is $d$ (so radius $d/2$): $A = \\dfrac{1}{2}\\pi\\Big(\\dfrac{d}{2}\\Big)^2 = \\dfrac{\\pi d^2}{8}$. Watch whether the base segment is the side, the diameter, or the radius before substituting.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing dx or dy',
      content:
        'Cross sections are always taken PERPENDICULAR to a stated axis. Perpendicular to the $x$-axis $\\Rightarrow$ each slab sits at an $x$-value, so integrate $A(x)\\,dx$. Perpendicular to the $y$-axis $\\Rightarrow$ integrate $A(y)\\,dy$, which means rewriting the boundary curves as functions of $y$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'cross-section volume (one-line)',
      content: '$V = \\int_a^b A(x)\\,dx$ — stack the cross-sectional areas along the axis.',
    },
  ],
  methods: [
    {
      title: 'Volume from known cross sections perpendicular to the x-axis',
      when_to_use:
        'A solid has a described base and cross sections of a named shape (square, triangle, semicircle, ...) perpendicular to the $x$-axis.',
      steps: [
        'Sketch the base and find the $x$-bounds from where the boundary curves meet / the given limits.',
        'At a generic $x$, write the base length: $\\text{top} - \\text{bottom}$ (this is the side or diameter).',
        'Substitute into the area formula for the given shape to get $A(x)$.',
        'Evaluate $V = \\int_a^b A(x)\\,dx$.',
      ],
      example: {
        problem: 'The base is bounded by $y = \\sqrt{x}$ and the $x$-axis on $[0,4]$. Cross sections perpendicular to the $x$-axis are squares. Find the volume.',
        solution:
          'Side $= \\sqrt{x} - 0 = \\sqrt{x}$, so $A(x) = (\\sqrt{x})^2 = x$. $V = \\int_0^4 x\\,dx = \\big[\\tfrac{x^2}{2}\\big]_0^4 = 8$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Cross sections that are triangles or semicircles',
      when_to_use:
        'When the named cross-section is an equilateral triangle or a semicircle, so the area formula introduces a shape constant.',
      steps: [
        'Find the base length between the bounding curves at a generic position.',
        'Decide whether that length is the SIDE (triangle) or the DIAMETER (semicircle).',
        'Apply $A = \\tfrac{\\sqrt{3}}{4}s^2$ (equilateral triangle) or $A = \\tfrac{\\pi d^2}{8}$ (semicircle on the diameter).',
        'Integrate $A$ over the interval; keep the shape constant outside the integral.',
      ],
      example: {
        problem: 'The base is bounded by $y = x$ and $y = x^2$ on $[0,1]$. Cross sections perpendicular to the $x$-axis are equilateral triangles. Find the volume.',
        solution:
          'Side $= x - x^2$, so $A = \\tfrac{\\sqrt{3}}{4}(x - x^2)^2$. $V = \\tfrac{\\sqrt{3}}{4}\\int_0^1 (x^2 - 2x^3 + x^4)\\,dx = \\tfrac{\\sqrt{3}}{4}\\big(\\tfrac{1}{3} - \\tfrac{1}{2} + \\tfrac{1}{5}\\big) = \\tfrac{\\sqrt{3}}{4}\\cdot\\tfrac{1}{30} = \\tfrac{\\sqrt{3}}{120}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Cross sections perpendicular to the y-axis',
      when_to_use:
        'When the problem specifies cross sections perpendicular to the $y$-axis, forcing a $dy$ setup.',
      steps: [
        'Rewrite the boundary curves as functions of $y$.',
        'Find the $y$-bounds of the base.',
        'At a generic $y$, the base segment length is $\\text{right} - \\text{left}$; build $A(y)$ from the shape.',
        'Evaluate $V = \\int_c^d A(y)\\,dy$.',
      ],
      example: {
        problem: 'The base is the first-quadrant region bounded by $y = x^2$, the $x$-axis, and $x = 2$. Cross sections perpendicular to the $y$-axis are squares. Set up the volume integral.',
        solution:
          'At height $y$, the segment runs from $x = \\sqrt{y}$ to $x = 2$, so side $= 2 - \\sqrt{y}$ and $A(y) = (2 - \\sqrt{y})^2$. With $y \\in [0,4]$: $V = \\int_0^4 (2 - \\sqrt{y})^2\\,dy$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'For a semicircle, the base segment is the DIAMETER, so the radius is HALF of it: $A = \\tfrac{1}{2}\\pi(d/2)^2 = \\tfrac{\\pi d^2}{8}$. Plugging the segment in as the radius quadruples the area.', kind: 'common-error' },
    { content: '"Perpendicular to the $y$-axis" means slabs stack in the $y$-direction $\\Rightarrow$ integrate $dy$ and write the base length as right-minus-left in terms of $y$.', kind: 'gotcha' },
    { content: 'This is NOT a solid of revolution — there is no factor of $\\pi$ unless the cross-section itself is (semi)circular. Do not reflexively multiply by $\\pi$.', kind: 'edge-case' },
    { content: 'On FRQs, "set up but do not evaluate" wants a fully specified definite integral: correct integrand $A$, correct limits, correct variable of integration.', kind: 'frq-vocab' },
    { content: 'Read whether the base segment is the SIDE, the DIAMETER, or the RADIUS before substituting — the same length feeds different formulas for different shapes.', kind: 'tip' },
  ],
};
