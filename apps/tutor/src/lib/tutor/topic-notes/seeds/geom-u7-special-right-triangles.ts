/**
 * Geometry — Unit 7 CED 7.2: Special Right Triangles: 45-45-90 & 30-60-90.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.special-right-triangles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U7_SPECIAL_RIGHT_TRIANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.special-right-triangles.v1',
  course: 'Geometry',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Special Right Triangles: 45-45-90 & 30-60-90',
  planId: 'evelyn.hs.geom.special-right-triangles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.special-right-triangles.v1' }],
  theory: [
    { loId: 'geom.special-right-triangles', kind: 'framework', title: 'Where they come from', content: `WHERE THEY COME FROM — slice a square along its diagonal and you get two 45-45-90 triangles. Drop the altitude of an equilateral triangle and you get two 30-60-90 triangles. These are not new rules; they are the Pythagorean theorem applied once and remembered.` },
    { loId: 'geom.special-right-triangles', content: `45-45-90 RATIO — the two legs are equal, so leg : leg : hypotenuse = x : x : x√2. Hypotenuse = leg × √2, and leg = hypotenuse ÷ √2. Check it: x² + x² = 2x², and √(2x²) = x√2.` },
    { loId: 'geom.special-right-triangles', content: `30-60-90 RATIO — short leg : long leg : hypotenuse = x : x√3 : 2x. The SHORT leg is opposite the 30° angle, the LONG leg is opposite the 60° angle, and the hypotenuse is opposite the right angle — always exactly twice the short leg.` },
    { loId: 'geom.special-right-triangles', content: `SOLVE FOR x FIRST — every side of a 30-60-90 is written in terms of x, the short leg. Whatever side you are handed, set it equal to its expression, solve for x, then read the other two sides straight off the ratio. Never guess your way sideways between the legs.` },
    { loId: 'geom.special-right-triangles', kind: 'framework', title: 'Bigger angle faces bigger side', content: `BIGGER ANGLE FACES BIGGER SIDE — a built-in sanity check. Since √3 is about 1.73, the 30-60-90 sides run x, 1.73x, 2x in order. In a 45-45-90 the hypotenuse is about 1.41 times a leg. If your "hypotenuse" came out shorter than a leg, you inverted a step.` },
    { loId: 'geom.special-right-triangles', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — WRONG LEG. Students assume the given leg is the short leg. If the leg sits opposite the 60° angle it is the LONG leg, so x = (given) ÷ √3 must come first. Read which angle the side faces before touching the ratio.` },
    { loId: 'geom.special-right-triangles', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — DOUBLING THE WRONG SIDE. The hypotenuse is 2× the SHORT leg only. Doubling the long leg is the single most common wrong answer in this lesson. And √2 belongs to 45-45-90 while √3 belongs to 30-60-90 — swapping them is the other half of the damage.` },
    { loId: 'geom.special-right-triangles', kind: 'framework', title: 'Rationalizing', content: `RATIONALIZING — dividing by a radical leaves an ugly form, so multiply top and bottom by that radical: 9 ÷ √3 = 9√3 ÷ 3 = 3√3, and 10 ÷ √2 = 10√2 ÷ 2 = 5√2. Same value, standard form.` },
    { loId: 'geom.special-right-triangles', kind: 'definition', title: '45-45-90 triangle', content: `an isosceles right triangle — half of a square cut along its diagonal, with sides in ratio x : x : x√2.` },
    { loId: 'geom.special-right-triangles', kind: 'definition', title: '30-60-90 triangle', content: `half of an equilateral triangle cut by an altitude, with sides in ratio x : x√3 : 2x, the short leg opposite the 30° angle.` },
  ],
  methods: [
    {
      title: 'Worked square brace',
      steps: [
        `The diagonal cuts the square into two right triangles. Each has two legs of 4 (the sides of the square) and the two acute angles are equal, so each is 45°: this is a 45-45-90 triangle.`,
        'Match the ratio x : x : x√2 to the triangle — the legs are x, so x = 4.',
        'The hypotenuse is x√2, so the brace = 4√2 feet.',
        `Verify with the Pythagorean theorem: 4² + 4² = 16 + 16 = 32, and √32 = √(16 × 2) = 4√2. ✓ The shortcut and the theorem agree — the ratio is just the theorem, pre-solved.`,
      ],
      example: { problem: `A square gate measures 4 feet on each side. A carpenter runs a diagonal brace from one corner to the opposite corner. How long is the brace, in exact form?`, solution: 'The brace is 4√2 feet (about 5.7 feet).' },
      relatedLoIds: ['geom.special-right-triangles'],
    },
    {
      title: 'Worked long leg trap',
      steps: [
        `Find all three angles: ∠C = 90°, ∠A = 60°, so ∠B = 30°. This is a 30-60-90 triangle with ratio x : x√3 : 2x.`,
        `Identify which side you were handed. BC sits opposite ∠A = 60°, so BC is the LONG leg, not the short leg. The student assumed BC was the short leg and doubled it — that is where 18 came from.`,
        `Solve for x using the long-leg expression: x√3 = 9, so x = 9 ÷ √3 = 9√3 ÷ 3 = 3√3. The short leg AC = 3√3.`,
        `Read off the hypotenuse: AB = 2x = 6√3, which is about 10.4. Sanity check the ordering — short leg 3√3 (about 5.2) < long leg 9 < hypotenuse 6√3 (about 10.4). ✓`,
      ],
      example: { problem: `In right triangle ABC the right angle is at C and ∠A = 60°. The leg BC = 9. A student answers "hypotenuse = 18." Find the correct hypotenuse AB and the leg AC, and explain the student error.`, solution: 'AB = 6√3 and AC = 3√3. The 18 came from treating the long leg as the short leg.' },
      relatedLoIds: ['geom.special-right-triangles'],
    },
  ],
  pointers: [
    { content: `Only the SHORT leg doubles. The given 6 faces the 60° angle, so it is the long leg: x√3 = 6 gives x = 6 ÷ √3 = 2√3, and the hypotenuse is 2x = 4√3 (about 6.9). Check the ordering — 12 would have been nearly double the long leg, which no 30-60-90 triangle allows.`, kind: 'common-error' },
    { content: `45-45-90: legs equal, x : x : x√2 — hypotenuse = leg × √2, leg = hypotenuse ÷ √2.`, kind: 'tip' },
    { content: `30-60-90: x : x√3 : 2x — short leg opposite 30°, long leg opposite 60°, hypotenuse twice the SHORT leg.`, kind: 'tip' },
    { content: `Always identify which angle the given side faces, solve for x first, then read off the other sides.`, kind: 'tip' },
    { content: `Sanity check by size: side opposite 30° < side opposite 60° < hypotenuse, since √3 is about 1.73 and √2 about 1.41.`, kind: 'tip' },
    { content: `Before using any ratio, label which angle each given side faces. "Leg = 9" means nothing until you know whether it's opposite the 30° or the 60° angle — the two answers differ by a factor of √3.`, kind: 'common-error' },
    { content: `Hypotenuse = 2 × **short** leg only. Never double the long leg. If you doubled a side opposite 60°, your "hypotenuse" is about 3.46x instead of 2x — impossible for a 30-60-90.`, kind: 'gotcha' },
    { content: `√2 belongs to 45-45-90; √3 belongs to 30-60-90. Never write x√3 for an isosceles right triangle or x√2 for a half-equilateral one.`, kind: 'common-error' },
    { content: `Say "short leg" and "long leg," not "first leg" or "the leg." In a 30-60-90 the two legs are never equal, so vague naming guarantees you'll plug into the wrong expression.`, kind: 'vocab-note' },
    { content: `When you're handed the long leg or the hypotenuse, solve for x first (x = long ÷ √3, or x = hyp ÷ 2), then read the other sides off x : x√3 : 2x. Don't jump directly from one leg to the other.`, kind: 'tip' },
    { content: `Rationalize before you stop: 9 ÷ √3 = 3√3, and 10 ÷ √2 = 5√2. A radical left in a denominator isn't wrong in value but isn't finished form — and the tidy form makes size-checking easier.`, kind: 'tip' },
    { content: `Sanity-check by size every time: side opposite 30° < side opposite 60° < hypotenuse (ratios ≈ 1 : 1.73 : 2), and in a 45-45-90 the hypotenuse ≈ 1.41 × leg. A hypotenuse shorter than a leg means you divided when you should have multiplied.`, kind: 'tip' },
    { content: `You only need one angle plus the right angle. If a right triangle has a 45° angle it's 45-45-90 (legs equal); one 60° angle makes it 30-60-90. Also: "the two legs are equal" alone is enough to call it 45-45-90.`, kind: 'edge-case' },
  ],
};
