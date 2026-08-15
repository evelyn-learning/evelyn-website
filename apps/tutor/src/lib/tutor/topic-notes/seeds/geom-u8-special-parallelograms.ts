/**
 * Geometry — Unit 8 CED 8.3: Rectangles, Rhombuses & Squares.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.special-parallelograms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U8_SPECIAL_PARALLELOGRAMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.special-parallelograms.v1',
  course: 'Geometry',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Rectangles, Rhombuses & Squares',
  planId: 'evelyn.hs.geom.special-parallelograms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.special-parallelograms.v1' }],
  theory: [
    { loId: 'geom.special-parallelograms', kind: 'framework', title: 'They are parallelograms first', content: `THEY ARE PARALLELOGRAMS FIRST — a rectangle, a rhombus, and a square each inherit EVERY parallelogram property: opposite sides ∥ and ≅, opposite angles ≅, consecutive angles supplementary, and diagonals that bisect each other. Then each adds one condition of its own.` },
    { loId: 'geom.special-parallelograms', content: `RECTANGLE = parallelogram + four right angles. Bonus property: THE DIAGONALS ARE CONGRUENT (in rectangle ABCD, AC = BD). Because they also bisect each other, the intersection point sits the same distance from all four vertices.` },
    { loId: 'geom.special-parallelograms', content: `RHOMBUS = parallelogram + four congruent sides. Two bonus properties: the diagonals are PERPENDICULAR (AC ⊥ BD), and each diagonal BISECTS the two angles it runs between.` },
    { loId: 'geom.special-parallelograms', content: `SQUARE = both at once — four right angles AND four equal sides. A square owns every rectangle property and every rhombus property: its diagonals are congruent, perpendicular, bisect each other, and cut each 90° corner into two 45° angles.` },
    { loId: 'geom.special-parallelograms', kind: 'framework', title: 'Diagonals build right triangles', content: `DIAGONALS BUILD RIGHT TRIANGLES — in a rhombus the two diagonals cut the figure into four congruent right triangles whose legs are HALF of each diagonal and whose hypotenuse is a SIDE. That is the bridge to the Pythagorean theorem: (half of one diagonal)² + (half of the other diagonal)² = side².` },
    { loId: 'geom.special-parallelograms', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — READING THE TREE BACKWARDS. Every square is a rectangle and every square is a rhombus, but a rectangle need not be a square. Properties travel DOWN the tree to the more special shapes, never back up.` },
    { loId: 'geom.special-parallelograms', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — SWAPPING THE DIAGONAL SIGNATURES. Congruent diagonals mean rectangle; perpendicular diagonals mean rhombus. A rhombus that is not a square has diagonals of DIFFERENT lengths; a rectangle that is not a square has diagonals that are NOT perpendicular. Only the square gets both.` },
    { loId: 'geom.special-parallelograms', content: `THE CONDITIONS (used to classify) — a parallelogram with congruent diagonals is a rectangle; a parallelogram with perpendicular diagonals, or with a diagonal that bisects an angle, is a rhombus; a parallelogram with both is a square.` },
    { loId: 'geom.special-parallelograms', kind: 'definition', title: 'rhombus', content: 'a parallelogram with four congruent sides.' },
    { loId: 'geom.special-parallelograms', kind: 'definition', title: 'perpendicular bisector', content: `a line that cuts a segment into two equal halves at a 90° angle — in a rhombus each diagonal is the perpendicular bisector of the other.` },
  ],
  methods: [
    {
      title: 'Worked rectangle diagonals',
      steps: [
        `Use the inherited property first: a rectangle is a parallelogram, so its diagonals bisect each other. E is the midpoint of AC, which makes AC = 2 · AE = 2(2x + 5) = 4x + 10.`,
        `Now use the rectangle-only property: the diagonals are congruent, so AC = BD. That gives the equation 4x + 10 = 6x + 2.`,
        `Solve: subtract 4x from both sides to get 10 = 2x + 2, then subtract 2 to get 8 = 2x, so x = 4.`,
        `Substitute back: AC = 4(4) + 10 = 26. Check against the other diagonal: BD = 6(4) + 2 = 26 ✓. Half-diagonal AE = 13, so E is 13 units from all four corners.`,
      ],
      example: { problem: `In rectangle ABCD the diagonals AC and BD intersect at point E. AE = 2x + 5 and BD = 6x + 2. Find x and the length of AC.`, solution: 'x = 4 and AC = 26 (BD = 26 as well)' },
      relatedLoIds: ['geom.special-parallelograms'],
    },
    {
      title: 'Worked rhombus side trap',
      steps: [
        `Name the properties in play: the diagonals of a rhombus bisect each other AND meet at right angles, so they slice the rhombus into four congruent right triangles.`,
        `Halve each diagonal: half of JL is 8 and half of KM is 6. In each little triangle those two halves are the LEGS, and the hypotenuse is a side of the rhombus.`,
        `Apply the Pythagorean theorem: side² = 6² + 8² = 36 + 64 = 100, so each side is 10 (the 3-4-5 triple, doubled to 6-8-10).`,
        `The error: adding 8 + 6 treats the two half-diagonals as if they lay end-to-end along the side. They meet at a 90° corner instead, so the side is the hypotenuse — always shorter than the two legs combined. 10 < 14 ✓.`,
      ],
      example: { problem: `Rhombus JKLM has diagonals JL = 16 and KM = 12. A student says each side is 14, because half of 16 plus half of 12 is 8 + 6 = 14. Find the actual side length and explain the error.`, solution: `Each side is 10 — the half-diagonals are the legs of a right triangle, not pieces of the side.` },
      relatedLoIds: ['geom.special-parallelograms'],
    },
  ],
  pointers: [
    { content: `Perpendicular diagonals prove RHOMBUS only — four equal sides, but the corners can still be slanted and the two diagonals can have very different lengths. A square needs BOTH signatures: diagonals perpendicular (rhombus) AND congruent (rectangle).`, kind: 'common-error' },
    { content: `All three are parallelograms first — they inherit opposite sides ∥ and ≅, opposite angles ≅, and diagonals that bisect each other.`, kind: 'tip' },
    { content: `Rectangle adds four right angles → congruent diagonals. Rhombus adds four equal sides → perpendicular diagonals that also bisect the angles.`, kind: 'tip' },
    { content: `A square is both, so it gets both diagonal properties; every square is a rectangle and a rhombus, but never the reverse.`, kind: 'tip' },
    { content: `Rhombus diagonals build four right triangles: half of one diagonal and half of the other are the legs, and the side is the hypotenuse — the Pythagorean route to a missing side.`, kind: 'tip' },
    { content: `Don't add half-diagonals to get a side. In a rhombus the two half-diagonals are the **legs** of a right triangle and the side is the **hypotenuse** — so side² = (½d₁)² + (½d₂)². With d = 16 and 12, the side is 10, not 8 + 6 = 14.`, kind: 'common-error' },
    { content: `Keep the diagonal signatures straight: **congruent diagonals → rectangle**, **perpendicular diagonals → rhombus**. Only a square has both. A non-square rhombus has diagonals of different lengths; a non-square rectangle has diagonals that are not perpendicular.`, kind: 'gotcha' },
    { content: `Perpendicular diagonals alone never prove 'square' — they only prove rhombus. Before you write 'square', check that BOTH conditions hold (perpendicular AND congruent).`, kind: 'common-error' },
    { content: `Read the family tree one direction only: every square is a rectangle and a rhombus, but a rectangle need not be a square. Properties flow DOWN to more special figures, never back up. 'Some rectangles are rhombuses' is true; 'all' is false.`, kind: 'vocab-note' },
    { content: `Use inherited properties before special ones. Diagonals bisecting each other comes from being a parallelogram, so AE = ½AC in *any* of these figures — that's how you turn AE = 2x + 5 into AC = 4x + 10 before setting AC = BD.`, kind: 'tip' },
    { content: `A rhombus diagonal bisects the angles it connects, so if ∠ABC = 70°, then ∠ABD = 35° — not 70° and not 90°. The 90° belongs to the intersection point of the diagonals, not to the vertex angles.`, kind: 'gotcha' },
    { content: `In a square each diagonal splits a 90° corner into two **45°** angles, and the four triangles formed are 45-45-90. Don't carry that 45° over to a non-square rhombus — there the two halves of a vertex angle are half of whatever that angle measures.`, kind: 'edge-case' },
    { content: `Say 'perpendicular bisector' precisely: in a rhombus each diagonal is the perpendicular bisector of the *other*. Bisecting each other alone (any parallelogram) is not enough — the 90° is the rhombus part.`, kind: 'vocab-note' },
  ],
};
