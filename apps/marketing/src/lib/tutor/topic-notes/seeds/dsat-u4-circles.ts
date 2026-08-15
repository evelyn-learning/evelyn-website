/**
 * Digital SAT — Unit 4 CED 4.4: Circles: Equations, Arcs & Sectors.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.circles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U4_CIRCLES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.circles.v1',
  course: 'Digital SAT',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Circles: Equations, Arcs & Sectors',
  planId: 'evelyn.testprep.dsat.circles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.circles.v1' }],
  theory: [
    { loId: 'dsat.circles', content: `STANDARD FORM: (x − h)² + (y − k)² = r². Center (h, k), radius r. Read h and k as the OPPOSITE of the sign inside the parentheses — (x − 3)² means h = 3, but (y + 2)² means k = −2.` },
    { loId: 'dsat.circles', content: `GENERAL FORM → COMPLETE THE SQUARE. When the SAT gives x² + y² + Dx + Ey + F = 0, group the x-terms and y-terms and move the constant to the right, then complete the square on each variable: add (coefficient/2)² for x and for y — to BOTH sides.` },
    { loId: 'dsat.circles', kind: 'framework', title: 'Trap', content: `TRAP — LEADING COEFFICIENT ≠ 1. If the equation is written as Ax² + Ay² + ... = 0 with A ≠ 1, divide EVERY term by A first. Completing the square before clearing that coefficient scrambles both the center and the radius.` },
    { loId: 'dsat.circles', kind: 'framework', title: 'Trap', content: `TRAP — r² VS r. The right side of standard form is r², not r. Forgetting to take the square root at the end is the single most common circle-equation error on the digital SAT.` },
    { loId: 'dsat.circles', content: `ARC LENGTH and SECTOR AREA are fractions of the whole circle, using the central angle θ: Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². The central angle IS the arc measure it cuts off, in degrees.` },
    { loId: 'dsat.circles', content: `TANGENT LINE is perpendicular to the radius at the point of tangency — this is how "find the slope of the tangent" questions get solved.` },
    { loId: 'dsat.circles', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — type the equation straight into the calculator to read the center and radius off the graph, or graph the circle to sanity-check a sector-area answer.` },
    { loId: 'dsat.circles', kind: 'definition', title: 'general form', content: `a circle equation expanded out as x² + y² + Dx + Ey + F = 0, before completing the square.` },
    { loId: 'dsat.circles', kind: 'definition', title: 'sector', content: 'a "pie slice" of a circle, bounded by two radii and an arc.' },
    { loId: 'dsat.circles', kind: 'definition', title: 'tangent', content: `a line that touches a circle at exactly one point, perpendicular to the radius there.` },
  ],
  methods: [
    {
      title: 'Worked complete square',
      steps: [
        `Group the x-terms and y-terms, and move the constant to the right: (x² − 6x) + (y² + 4y) = 3.`,
        `Complete the square on each: half of −6 is −3, squared is 9; half of 4 is 2, squared is 4. Add both to BOTH sides: (x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4 = 16.`,
        'Factor: (x − 3)² + (y + 2)² = 16. Center (3, −2), radius √16 = 4.',
      ],
      example: { problem: 'Find the center and radius of the circle x² + y² − 6x + 4y − 3 = 0.', solution: 'Center (3, −2), radius 4' },
      relatedLoIds: ['dsat.circles'],
    },
    {
      title: 'Worked leading coefficient trap',
      steps: [
        `TRAP — the leading coefficient is 2, not 1. Divide every term by 2 first: x² + y² + 8x − 2y − 8 = 0.`,
        `Group the x-terms and y-terms, and move the constant to the right: (x² + 8x) + (y² − 2y) = 8.`,
        `Complete the square: half of 8 is 4, squared 16; half of −2 is −1, squared 1. Add both to BOTH sides: (x² + 8x + 16) + (y² − 2y + 1) = 8 + 16 + 1 = 25.`,
        'Factor: (x + 4)² + (y − 1)² = 25. Center (−4, 1), radius √25 = 5.',
      ],
      example: { problem: 'Find the center and radius of the circle 2x² + 2y² + 16x − 4y − 16 = 0.', solution: 'Center (−4, 1), radius 5' },
      relatedLoIds: ['dsat.circles'],
    },
  ],
  pointers: [
    { content: `(x² − 8x + 16) + (y² + 2y + 1) = 8 + 16 + 1 = 25, so (x − 4)² + (y + 1)² = 25 and the radius is √25 = 5, not √8.`, kind: 'common-error' },
    { content: `Standard form (x − h)² + (y − k)² = r²: center (h, k) is the OPPOSITE sign inside the parentheses; the right side is r², so take the square root for the radius.`, kind: 'tip' },
    { content: `From general form, group x- and y-terms, then complete the square — adding (coefficient/2)² to BOTH sides for each variable. If the leading coefficient isn't 1, divide everything by it FIRST.`, kind: 'tip' },
    { content: `Arc length = (θ/360) × 2πr; sector area = (θ/360) × πr². The central angle equals the arc it cuts off.`, kind: 'tip' },
    { content: `Desmos graphs the circle instantly — use it to check a center/radius or sector answer, not to skip the algebra.`, kind: 'tip' },
    { content: `Read the last line of the stem before answering: circle questions ask for the radius, the **diameter**, the **area**, or the sum/product of the center coordinates. After completing the square you have all of them — losing the point by reporting r when they asked for 2r is the cheapest miss on this topic.`, kind: 'gotcha' },
    { content: `If the question asks for the **area** of the circle, stop at r² — it's already the right side of standard form. Don't take the square root and then square it again; that round-trip is where sign/arithmetic slips creep in.`, kind: 'tip' },
    { content: `"Which equation represents the circle..." choices usually share one correct-looking half. Check BOTH the signs inside the parentheses AND the right side: a common distractor set is correct center with r instead of r², or correct r² with flipped h and k signs.`, kind: 'gotcha' },
    { content: `When endpoints of a **diameter** are given, the center is the midpoint of the two points and the radius is HALF the distance between them. Using the full distance as r is the standard trap in these items.`, kind: 'common-error' },
    { content: `Arc length uses 2πr; sector area uses πr². Both are multiplied by θ/360 — the only difference is the circle formula inside. If your "length" answer has an r² in it, you grabbed the wrong one.`, kind: 'common-error' },
    { content: `If the central angle is given in **radians**, θ/360 is wrong — use θ/2π, or the shortcuts arc = rθ and sector area = ½r²θ. A π in the angle (like 5π/6) is your signal you're in radians, not degrees.`, kind: 'edge-case' },
    { content: `When a problem gives you the **arc** or the shaded region, decide whether the angle you want is the minor arc or the major arc (360° − θ). Sketch it — sectors described as "the larger region" or "the remaining region" flip the fraction.`, kind: 'edge-case' },
    { content: `For tangent-line questions, the tangent slope is the **negative reciprocal** of the radius slope from the center to the point of tangency — not the radius slope itself. Compute the radius slope first, then flip and negate.`, kind: 'gotcha' },
  ],
};
