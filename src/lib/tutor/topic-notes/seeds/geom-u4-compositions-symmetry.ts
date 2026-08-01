/**
 * Geometry — Unit 4 CED 4.4: Compositions of Rigid Motions & Symmetry.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.compositions-symmetry.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U4_COMPOSITIONS_SYMMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.compositions-symmetry.v1',
  course: 'Geometry',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Compositions of Rigid Motions & Symmetry',
  planId: 'evelyn.hs.geom.compositions-symmetry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.compositions-symmetry.v1' }],
  theory: [
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'What a composition is', content: `WHAT A COMPOSITION IS — apply one rigid motion, then apply another to the RESULT. Every rigid motion preserves length and angle measure, so a composition of rigid motions is itself a rigid motion: the final image is still congruent to the original.` },
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'Read the notation backward', content: `READ THE NOTATION BACKWARD — the composition written (T ∘ r)(P) means "do r FIRST, then T," exactly like function composition. Written in words instead, say "reflect, then translate" and do it in that spoken order.` },
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'Order matters', content: `ORDER MATTERS — reflecting then translating usually lands somewhere different from translating then reflecting. Composition is not commutative, so never reorder the steps to make the arithmetic easier.` },
    { loId: 'geom.compositions-symmetry', content: `TWO REFLECTIONS, PARALLEL MIRRORS = TRANSLATION — reflecting across line m and then across line n, where m ∥ n and the lines sit d apart, translates the figure perpendicular to the lines a distance of 2d, in the direction from m toward n. The classic error is answering d instead of 2d.` },
    { loId: 'geom.compositions-symmetry', content: `TWO REFLECTIONS, INTERSECTING MIRRORS = ROTATION — if m and n meet at the point P forming an angle of θ, reflecting across m and then across n rotates the figure about P through 2θ, turning from m toward n. Again the error is answering θ instead of 2θ.` },
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'Glide reflection', content: `GLIDE REFLECTION — a reflection composed with a translation PARALLEL to the line of reflection; a line of footprints down a beach is the standard picture. This is the one composition where the order genuinely does not matter.` },
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'Line symmetry', content: `LINE SYMMETRY — a figure has a line of symmetry if reflecting across that line maps the figure exactly onto itself. A regular n-gon has exactly n lines of symmetry.` },
    { loId: 'geom.compositions-symmetry', kind: 'framework', title: 'Rotational symmetry', content: `ROTATIONAL SYMMETRY — a figure has rotational symmetry if some rotation of less than 360° about its center maps it onto itself; for a regular n-gon the smallest such angle is 360°/n. A full 360° turn does NOT count — it maps every figure onto itself, so it would make the idea meaningless. Line symmetry and rotational symmetry are independent: a slanted parallelogram has 180° rotational symmetry and no line of symmetry at all.` },
    { loId: 'geom.compositions-symmetry', kind: 'definition', title: 'composition of transformations', content: `a sequence of two or more transformations where each one is applied to the image produced by the previous one.` },
    { loId: 'geom.compositions-symmetry', kind: 'definition', title: 'rotational symmetry', content: `the property of a figure that some rotation of less than 360° about its center maps the figure onto itself.` },
  ],
  methods: [
    {
      title: 'Worked coordinate composition',
      steps: [
        `Do the FIRST motion only. Reflection across the x-axis: (x, y) → (x, -y). A(1, 2) → (1, -2), B(4, 2) → (4, -2), C(1, 6) → (1, -6).`,
        `Feed those images into the SECOND motion. Translation 3 right and 1 up: (x, y) → (x + 3, y + 1).`,
        `(1, -2) → (4, -1), (4, -2) → (7, -1), (1, -6) → (4, -5). Final triangle: (4, -1), (7, -1), (4, -5).`,
        `Now test the reverse order. Translating first gives (4, 3), (7, 3), (4, 7); reflecting those across the x-axis gives (4, -3), (7, -3), (4, -7) — a different triangle.`,
        `Same two motions, different order, different image. Both images are congruent to △ABC, since each step was a rigid motion, but they sit in different places.`,
      ],
      example: { problem: `△ABC has vertices A(1, 2), B(4, 2), and C(1, 6). Reflect it across the x-axis, then translate the image 3 units right and 1 unit up. Give the final coordinates, and check whether reversing the order would give the same answer.`, solution: `(4, -1), (7, -1), (4, -5) — and no, the reverse order gives (4, -3), (7, -3), (4, -7)` },
      relatedLoIds: ['geom.compositions-symmetry'],
    },
    {
      title: 'Worked parallel mirrors',
      steps: [
        `Reflect P(1, 4) across m, the line x = 2. P sits 1 unit to the LEFT of m, so its image sits 1 unit to the RIGHT of m: (3, 4).`,
        `Reflect (3, 4) across n, the line x = 5. That point sits 2 units to the left of n, so its image sits 2 units to the right of n: (7, 4).`,
        `Compare start and finish: (1, 4) → (7, 4). The point moved 6 units right, not 3. The y-coordinate never changed, so the net motion is a horizontal translation.`,
        `Check the rule: the translation distance is 2d = 2(3) = 6, perpendicular to the mirrors, in the direction from m toward n. The student halved the answer by reporting the gap between the mirrors instead of twice the gap.`,
        `Test a second point to be sure: Q(0, 1) → (4, 1) across m → (6, 1) across n. Again 6 units right — every point of the figure shifts the same way, which is exactly what makes the composition a translation.`,
      ],
      example: { problem: `Lines m and n are the vertical lines x = 2 and x = 5, so they are parallel and 3 units apart. A figure is reflected across m and then across n. A student says "the two mirrors are 3 apart, so the figure slides 3 units right." Track the point P(1, 4) and settle it.`, solution: 'A translation of 6 units to the right (2 × 3), not 3 units.' },
      relatedLoIds: ['geom.compositions-symmetry'],
    },
  ],
  pointers: [
    { content: `Reflect the parallelogram across a diagonal and the halves swap but do not land back on the original outline — the slanted sides tip the wrong way. A general parallelogram has NO lines of symmetry; what it does have is 180° rotational symmetry about the intersection of its diagonals. (Add equal sides and you get a rhombus, with the diagonals finally becoming true lines of symmetry.)`, kind: 'common-error' },
    { content: `A composition applies each motion to the previous image; order matters, and notation like (T ∘ r) is read right to left.`, kind: 'tip' },
    { content: `Two reflections across parallel mirrors d apart = a translation of 2d, perpendicular to the mirrors, first mirror toward second.`, kind: 'tip' },
    { content: `Two reflections across mirrors meeting at θ = a rotation of 2θ about the intersection point. Double it — do not report d or θ.`, kind: 'tip' },
    { content: `A composition of rigid motions is a rigid motion, so the final image is always congruent to the original.`, kind: 'tip' },
    { content: `Symmetry = a rigid motion that maps the figure onto itself: n lines and 360°/n rotation for a regular n-gon; 360° never counts, and line and rotational symmetry can occur without each other.`, kind: 'tip' },
    { content: `In \`(T ∘ r)(P)\`, do **r first**, then T — read the symbol right to left like function composition. But when a problem says "reflect, then translate" in words, do it in the spoken left-to-right order. Mixing these two conventions is the #1 setup error.`, kind: 'gotcha' },
    { content: `Double it: parallel mirrors *d* apart give a translation of **2d**; mirrors meeting at **θ** give a rotation of **2θ**. Reporting *d* or *θ* is the standard error — track one test point to confirm the doubling.`, kind: 'common-error' },
    { content: `Don't accept "cuts the figure into two congruent halves" as a line of symmetry. The test is whether the **reflection maps the figure onto itself** — same outline, same position. A parallelogram's diagonals fail this test.`, kind: 'common-error' },
    { content: `Line symmetry and rotational symmetry are independent. A slanted parallelogram has 180° rotational symmetry and **zero** lines of symmetry; other figures have lines but no rotational symmetry. Never infer one from the other.`, kind: 'gotcha' },
    { content: `A 360° turn does **not** count as rotational symmetry — it maps every figure onto itself. Rotational symmetry requires an angle strictly less than 360°.`, kind: 'edge-case' },
    { content: `A **glide reflection** is a reflection plus a translation *parallel to the mirror line*. It's the one composition where order truly doesn't matter — but that exception doesn't license reordering other compositions.`, kind: 'vocab-note' },
    { content: `After a composition of rigid motions, the final figure is still **congruent** to the original — never similar-but-smaller. If your image changed size or shape, you made an arithmetic slip, not a legitimate transformation.`, kind: 'tip' },
    { content: `In coordinate compositions, feed the **image** coordinates into step two, not the original vertices. Label them A′ then A″ so you can see which set you're using.`, kind: 'common-error' },
  ],
};
