/**
 * Geometry — Unit 9 CED 9.4: Equations of Circles in the Coordinate Plane.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.circle-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U9_CIRCLE_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.circle-equations.v1',
  course: 'Geometry',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Equations of Circles in the Coordinate Plane',
  planId: 'evelyn.hs.geom.circle-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.circle-equations.v1' }],
  theory: [
    { loId: 'geom.circle-equations', kind: 'framework', title: 'Where it comes from', content: `WHERE IT COMES FROM — a point (x, y) is on the circle exactly when its distance to the center (h, k) equals r. The distance formula says √((x - h)² + (y - k)²) = r. Square both sides and the radical disappears. The circle equation IS the Pythagorean Theorem in disguise.` },
    { loId: 'geom.circle-equations', kind: 'framework', title: 'Standard form', content: `STANDARD FORM — (x - h)² + (y - k)² = r². Center (h, k), radius r. Centered at the origin it collapses to x² + y² = r².` },
    { loId: 'geom.circle-equations', content: `TRAP 1: SIGN FLIP — h and k are the OPPOSITE of the sign written inside the parentheses, because the form subtracts them. (x - 3)² means h = 3; (y + 2)² is really (y - (-2))², so k = -2. Center (3, -2).` },
    { loId: 'geom.circle-equations', content: `TRAP 2: r² IS NOT r — the right side is the radius SQUARED. In (x - 1)² + (y - 4)² = 49 the radius is √49 = 7, not 49. Take the square root every single time.` },
    { loId: 'geom.circle-equations', kind: 'framework', title: 'Writing the equation from a description', content: `WRITING THE EQUATION FROM A DESCRIPTION — center plus radius: plug straight in. Center plus a point ON the circle: substituting that point gives r² directly, so you never have to simplify a radical. Endpoints of a DIAMETER: the midpoint is the center and HALF the distance is the radius.` },
    { loId: 'geom.circle-equations', kind: 'framework', title: 'General form → complete the square', content: `GENERAL FORM → COMPLETE THE SQUARE — given x² + y² + Dx + Ey + F = 0, group the x-terms and the y-terms, move the constant to the right, then add (coefficient/2)² for each variable to BOTH sides. Forgetting the right side is the classic wreck: the center survives, the radius does not.` },
    { loId: 'geom.circle-equations', kind: 'framework', title: 'Leading-coefficient check', content: `LEADING-COEFFICIENT CHECK — if the x² and y² terms carry a coefficient other than 1 (like 3x² + 3y² + ... = 0), divide EVERY term by it first. Completing the square before clearing that coefficient scrambles the center and the radius together.` },
    { loId: 'geom.circle-equations', kind: 'framework', title: 'Inside, on, or outside', content: `INSIDE, ON, OR OUTSIDE — substitute a point into the left side of standard form and compare to r²: less than r² is inside, equal is on the circle, greater is outside. That is the coverage test in one line.` },
    { loId: 'geom.circle-equations', kind: 'definition', title: 'standard form', content: `the circle equation written as (x - h)² + (y - k)² = r², with the center (h, k) and radius r readable directly.` },
    { loId: 'geom.circle-equations', kind: 'definition', title: 'general form', content: `the same circle expanded to x² + y² + Dx + Ey + F = 0, where the center and radius are hidden until you complete the square.` },
  ],
  methods: [
    {
      title: 'Worked complete the square',
      steps: [
        `The x² and y² terms both have coefficient 1, so no dividing is needed. Group by variable and move the constant to the right: (x² - 6x) + (y² + 4y) = 12.`,
        `Complete the square on the x-group: half of -6 is -3, and (-3)² = 9. On the y-group: half of 4 is 2, and 2² = 4.`,
        `Add BOTH numbers to BOTH sides: (x² - 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4, so the right side becomes 25.`,
        'Factor each group into a perfect square: (x - 3)² + (y + 2)² = 25.',
        `Read it with the sign flip: h = 3 and k = -2, so the center is (3, -2). The right side is r², so r = √25 = 5.`,
      ],
      example: { problem: 'Find the center and radius of the circle x² + y² - 6x + 4y - 12 = 0.', solution: 'Center (3, -2), radius 5' },
      relatedLoIds: ['geom.circle-equations'],
    },
    {
      title: 'Worked diameter endpoints error',
      steps: [
        `The center of a circle is the midpoint of any diameter: midpoint of A(1, 2) and B(9, 8) is ((1 + 9)/2, (2 + 8)/2) = (5, 5). The student used the endpoint A as the center — error one.`,
        `The distance from A to B is the DIAMETER: horizontal run 9 - 1 = 8, vertical rise 8 - 2 = 6, so AB = √(8² + 6²) = √100 = 10. That is a 6-8-10 right triangle.`,
        `The radius is half the diameter: r = 10/2 = 5, so r² = 25. The student squared the whole diameter and wrote 100 — error two.`,
        'Assemble standard form with h = 5, k = 5, r² = 25: (x - 5)² + (y - 5)² = 25.',
        `Check by substituting the endpoint A(1, 2): (1 - 5)² + (2 - 5)² = 16 + 9 = 25 ✓ — A really does sit on the circle.`,
      ],
      example: { problem: `A circle has a diameter whose endpoints are A(1, 2) and B(9, 8). A student writes the equation (x - 1)² + (y - 2)² = 100. Find the correct equation and name the two errors.`, solution: `(x - 5)² + (y - 5)² = 25 — the student used an endpoint as the center and used the full diameter as the radius.` },
      relatedLoIds: ['geom.circle-equations'],
    },
  ],
  pointers: [
    { content: `The form subtracts the center: (x + 3)² is (x - (-3))², so h = -3, and (y - 5)² gives k = 5. The center is (-3, 5) — the exact opposite of what was reported.`, kind: 'common-error' },
    { content: 'r² = 49, so r = √49 = 7. A radius of 49 would need 2401 on the right side.', kind: 'common-error' },
    { content: `Standard form (x - h)² + (y - k)² = r² is the distance formula squared — the definition of a circle written in algebra.`, kind: 'tip' },
    { content: `Flip the signs inside the parentheses to get the center, and take the square root of the right side to get the radius.`, kind: 'tip' },
    { content: `Building an equation: center plus a point gives r² directly; diameter endpoints give the center as the midpoint and the radius as half the distance.`, kind: 'tip' },
    { content: `From general form, group, move the constant, and add (coefficient/2)² for each variable to BOTH sides — divide out any leading coefficient first.`, kind: 'tip' },
    { content: `Flip the sign inside each parenthesis to get the center. \`(x + 3)²\` means h = **-3**, not 3. Rewrite it mentally as \`(x - (-3))²\` until the flip is automatic.`, kind: 'common-error' },
    { content: `The right side is r², never r. In \`... = 49\` the radius is 7. Conversely, when you're *writing* an equation with r = 6, put 36 on the right — not 6.`, kind: 'common-error' },
    { content: `With diameter endpoints, the distance between them is the **diameter**, not the radius. Halve it before squaring — or halve then square, never square then halve.`, kind: 'gotcha' },
    { content: `An endpoint of a diameter is *on* the circle, not the center. The center is the **midpoint** of the two endpoints.`, kind: 'common-error' },
    { content: `When completing the square, add (coefficient/2)² to **both** sides. Skipping the right side leaves the center correct but the radius wrong — a mistake that looks half-right and is easy to miss.`, kind: 'gotcha' },
    { content: `If x² and y² have a coefficient other than 1 (e.g. \`3x² + 3y² - 12x + 6 = 0\`), divide **every** term by it before completing the square.`, kind: 'edge-case' },
    { content: `Say "standard form" for (x - h)² + (y - k)² = r² and "general form" for x² + y² + Dx + Ey + F = 0. Only standard form lets you *read* the center and radius; general form hides them.`, kind: 'vocab-note' },
    { content: `Quick self-check: plug a known point into the left side of standard form. Less than r² = inside, equal = on the circle, greater = outside. Any point you were given should return exactly r².`, kind: 'tip' },
  ],
};
