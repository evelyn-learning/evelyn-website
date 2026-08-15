/**
 * Geometry — Unit 1 CED 1.2: Segment Measure, Distance & Midpoint.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.segments-distance-midpoint.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U1_SEGMENTS_DISTANCE_MIDPOINT: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.segments-distance-midpoint.v1',
  course: 'Geometry',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Segment Measure, Distance & Midpoint',
  planId: 'evelyn.hs.geom.segments-distance-midpoint.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.segments-distance-midpoint.v1' }],
  theory: [
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Segment vs length', content: `SEGMENT VS LENGTH — segment AB is a set of points: A, B, and everything between. AB written alone is a NUMBER, its length. So you say segment AB ≅ segment CD (congruent shapes) but AB = CD (equal numbers). Never write a segment equal to a number, and never write a length congruent to a length.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Segment addition postulate', content: `SEGMENT ADDITION POSTULATE — if point B lies BETWEEN A and C on the same line, then AB + BC = AC. The whole equals the sum of its parts. Betweenness must be given or proven — if B is not between them, the equation is simply false.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Midpoint', content: `MIDPOINT — the point M on segment AB with AM = MB. It cuts the segment into two congruent halves, so AM = MB = ½ · AB, and going the other direction, AB = 2 · AM. A SEGMENT BISECTOR is any line, ray, segment, or plane that passes through the midpoint.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Distance on a number line', content: `DISTANCE ON A NUMBER LINE — the distance between coordinates a and b is |a − b|. Absolute value is why order does not matter: |3 − 10| and |10 − 3| both give 7. Length is never negative.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Distance formula', content: `DISTANCE FORMULA — for (x₁, y₁) and (x₂, y₂): d = √[(x₂ − x₁)² + (y₂ − y₁)²]. This is nothing but the Pythagorean theorem: the horizontal gap and the vertical gap are the legs of a right triangle, and the segment is the hypotenuse. Squaring erases sign errors, so a negative Δx is harmless.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Midpoint formula', content: `MIDPOINT FORMULA — M = ((x₁ + x₂)/2, (y₁ + y₂)/2). AVERAGE the x-coordinates, AVERAGE the y-coordinates. Distance SUBTRACTS; midpoint ADDS. Swapping the two is the number-one error in this unit — say "midpoint has no subtraction in it" out loud.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'The root does not distribute', content: `THE ROOT DOES NOT DISTRIBUTE — √(6² + 8²) = √(36 + 64) = √100 = 10, NOT 6 + 8 = 14. You must finish the addition INSIDE the radical before taking the root. If your distance comes out equal to the two gaps added, you skipped a step.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'framework', title: 'Working backward', content: `WORKING BACKWARD — given midpoint M and one endpoint A, the other endpoint is a reflection of A across M: x₂ = 2·x_M − x₁ and y₂ = 2·y_M − y₁. Do not average M with A — that lands you a quarter of the way along, not at the far end.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'definition', title: 'midpoint', content: `the point that divides a segment into two congruent segments — exactly halfway between the endpoints.` },
    { loId: 'geom.segments-distance-midpoint', kind: 'definition', title: 'segment bisector', content: `a line, ray, segment, or plane that passes through the midpoint of a segment, cutting it into two congruent halves.` },
  ],
  methods: [
    {
      title: 'Worked distance and midpoint',
      steps: [
        `Distance first. Horizontal gap: x₂ − x₁ = 5 − (−3) = 8. Vertical gap: y₂ − y₁ = 8 − 2 = 6. Subtracting a negative added, so the gap is 8, not 2.`,
        `Square and add INSIDE the radical: d = √(8² + 6²) = √(64 + 36) = √100 = 10. Note it is 10, not 8 + 6 = 14 — the root never distributes.`,
        `Midpoint next, and switch operations: average, do not subtract. x of M = (−3 + 5)/2 = 2/2 = 1. y of M = (2 + 8)/2 = 10/2 = 5.`,
        `Sanity check: (1, 5) should sit between the endpoints on both axes — 1 is between −3 and 5, and 5 is between 2 and 8. ✓ And the 8-6-10 gaps are a scaled 3-4-5 triangle, which confirms the length.`,
      ],
      example: { problem: `Point A is at (−3, 2) and point B is at (5, 8) in the coordinate plane. Find the length AB and the coordinates of the midpoint of segment AB.`, solution: 'AB = 10; midpoint = (1, 5)' },
      relatedLoIds: ['geom.segments-distance-midpoint'],
    },
    {
      title: 'Worked missing endpoint',
      steps: [
        `Name the error: averaging M with A finds the midpoint of segment AM — the point a QUARTER of the way from A to B. The midpoint formula only runs forward, from two endpoints to the middle.`,
        `Set up the formula with B unknown: (−3 + x₂)/2 = 1 and (4 + y₂)/2 = −2. Solve each by multiplying both sides by 2 first.`,
        'x: −3 + x₂ = 2, so x₂ = 5. y: 4 + y₂ = −4, so y₂ = −8. B is at (5, −8).',
        `Shortcut worth keeping: B = (2·x_M − x_A, 2·y_M − y_A) = (2·1 − (−3), 2·(−2) − 4) = (5, −8). Same answer, one line.`,
        `Check by running the midpoint formula forward on A(−3, 4) and B(5, −8): ((−3 + 5)/2, (4 + (−8))/2) = (1, −2) = M. ✓`,
      ],
      example: { problem: `M(1, −2) is the midpoint of segment AB, and endpoint A is at (−3, 4). A student averages M and A to get (−1, 1) and calls that B. Find the real coordinates of B and explain the error.`, solution: `B is at (5, −8) — the student found the midpoint of AM instead of reflecting A across M.` },
      relatedLoIds: ['geom.segments-distance-midpoint'],
    },
  ],
  pointers: [
    { content: `Midpoint AVERAGES: M = ((2 + 8)/2, (7 + 3)/2) = (5, 5). Distance subtracts, midpoint adds and halves. Always check that the midpoint lands BETWEEN the endpoints on both axes — 5 is between 2 and 8, and between 7 and 3. ✓`, kind: 'common-error' },
    { content: `Segment AB is a shape (use ≅); AB alone is a number, its length (use =). If B is between A and C, then AB + BC = AC.`, kind: 'tip' },
    { content: `A midpoint splits a segment into congruent halves: AM = MB = ½AB, so AB = 2AM. A segment bisector is anything passing through the midpoint.`, kind: 'tip' },
    { content: `Distance = √[(x₂ − x₁)² + (y₂ − y₁)²] — Pythagoras in disguise. Finish the addition inside the radical; the root never distributes.`, kind: 'tip' },
    { content: `Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) — average, never subtract. To recover a missing endpoint, reflect: x₂ = 2·x_M − x₁.`, kind: 'tip' },
    { content: `Distance SUBTRACTS, midpoint ADDS. If you ever write a minus sign inside the midpoint formula, stop. Quick check: the midpoint's x must land between x₁ and x₂, and its y between y₁ and y₂ — for A(2,7), B(8,3) a midpoint of (6,−4) is impossible.`, kind: 'common-error' },
    { content: `Use ≅ for segments (shapes) and = for lengths (numbers). Write $\\overline{AB} \\cong \\overline{CD}$ or $AB = CD$ — never $\\overline{AB} = 6$ and never $AB \\cong CD$.`, kind: 'vocab-note' },
    { content: `√(a² + b²) ≠ a + b. Finish the addition inside the radical first: √(8² + 6²) = √100 = 10, not 14. If your distance equals the horizontal gap plus the vertical gap, you distributed the root.`, kind: 'common-error' },
    { content: `Given a midpoint and ONE endpoint, do NOT average them — that gives the midpoint of the half-segment, a quarter of the way along. Reflect instead: x₂ = 2·x_M − x₁, y₂ = 2·y_M − y₁, then verify by running the midpoint formula forward.`, kind: 'gotcha' },
    { content: `AB + BC = AC only if B is BETWEEN A and C. If B is not on the segment (or betweenness isn't stated or proven), the equation is false — check the diagram or the given wording before writing it.`, kind: 'edge-case' },
    { content: `Subtracting a negative coordinate widens the gap: 5 − (−3) = 8, not 2. Put parentheses around negative coordinates every time you substitute into the distance or midpoint formula.`, kind: 'common-error' },
    { content: `Length is never negative. Distance on a number line is |a − b|, so |3 − 10| = |10 − 3| = 7 — order doesn't matter. Same in the distance formula: squaring erases sign, so a negative Δx is harmless.`, kind: 'tip' },
    { content: `A midpoint is a POINT; a segment bisector is a line, ray, segment, or plane through that point. And 'exact distance' means leave it as a simplified radical like 5√2 — don't round to 7.07 unless asked.`, kind: 'vocab-note' },
  ],
};
