/**
 * Grade 7 Math — Unit 7 CED 7.2: Conditions That Determine a Triangle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.triangle-side-and-angle-conditions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U7_TRIANGLE_SIDE_AND_ANGLE_CONDITIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.triangle-side-and-angle-conditions.v1',
  course: 'Grade 7 Math',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Conditions That Determine a Triangle',
  planId: 'evelyn.ms.m7math.triangle-side-and-angle-conditions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.triangle-side-and-angle-conditions.v1' }],
  theory: [
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'framework', title: 'The triangle inequality', content: `THE TRIANGLE INEQUALITY — the sum of any two sides must be GREATER than the third side. Not equal to it. Greater than it. Think of it as walking: going from one corner to another the long way around, along two sides, has to be a longer trip than cutting straight across the third side.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'framework', title: 'Test all three pairs', content: `TEST ALL THREE PAIRS — with sides a, b, and c you have three checks to run: a + b compared to c, a + c compared to b, and b + c compared to a. Most students test one pair, see it pass, and stop. That is exactly how a bad set of lengths sneaks through. Run all three, every time.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'framework', title: 'The shortcut, and why it works', content: `THE SHORTCUT, AND WHY IT WORKS — if the two SHORTEST sides add up to more than the longest side, the other two checks are guaranteed to pass, because each of them already has the longest side on the winning team. So the shortcut is legal, but you have to find the longest side first.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'framework', title: 'Equal is not enough', content: `EQUAL IS NOT ENOUGH — with 4, 9, and 13 the check is 4 + 9 = 13, which is not greater than 13. The two short sides lie flat along the long one and the shape has zero height. Flat is not a triangle. The rule uses "greater than" for a reason.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', content: `THE ANGLE SUM IS ALWAYS 180° — the three angles inside any triangle add to 180°, no exceptions. So 42° and 65° force the third angle to be 180 − 42 − 65 = 73°. Angle measures that add to anything other than 180° describe no triangle at all.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'framework', title: 'One triangle, many, or none', content: `ONE TRIANGLE, MANY, OR NONE — three side lengths that pass the inequality build exactly ONE triangle; the shape is locked and cannot flex. Three ANGLES that add to 180° build MANY triangles: same shape, any size you like, like a photo printed small or poster-sized. And side lengths that fail the inequality, or angles that do not total 180°, build NONE.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'definition', title: 'triangle inequality', content: `the rule that the sum of any two sides of a triangle must be greater than the third side.` },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'definition', title: 'angle sum', content: 'the total of the three inside angles of a triangle, which is always 180°.' },
    { loId: 'm7math.triangle-side-and-angle-conditions', kind: 'definition', title: 'unique triangle', content: `a set of conditions that can be built in exactly one way, with no choices left over.` },
  ],
  methods: [
    {
      title: 'Worked inequality all three',
      steps: [
        `Run all three checks, not one. Check one: 4 + 9 = 13. Compare that to the third side, 13. Is 13 greater than 13? No. It is equal, and equal fails.`,
        `Keep going so you can see how a careless student gets fooled. Check two: 4 + 13 = 17, which IS greater than 9. Passes. Check three: 9 + 13 = 22, which IS greater than 4. Passes.`,
        `Two checks passed and one failed. One failure is enough to kill it. The answer is NO, 4, 9, and 13 cannot form a triangle. A student who only ran checks two and three would have said yes and been wrong.`,
        `Now the second question. Call the third side x. It has to beat both other checks. From 4 + x > 9 we get x > 5. From 4 + 9 > x we get x < 13.`,
        `So x must sit strictly between 5 and 13, with both ends left out: 5 < x < 13. Notice the ends are the difference 9 − 4 = 5 and the sum 9 + 4 = 13.`,
        `List the whole numbers strictly inside that gap: 6, 7, 8, 9, 10, 11, 12. Spot-check the smallest one: sides 4, 6, 9 give 4 + 6 = 10 > 9. Passes.`,
      ],
      example: { problem: `Can side lengths of 4 cm, 9 cm, and 13 cm form a triangle? Then list every whole-number length that COULD be the third side with 4 cm and 9 cm.`, solution: `No, 4, 9, and 13 cannot form a triangle. With sides 4 and 9 the third side can be 6, 7, 8, 9, 10, 11, or 12.` },
      relatedLoIds: ['m7math.triangle-side-and-angle-conditions'],
    },
    {
      title: 'Worked angle sum and how many',
      steps: [
        `Write what you know as an equation. Call the missing angle x. The three angles add to 180°, so 42 + 65 + x = 180.`,
        'Add the two known angles: 42 + 65 = 107. The equation becomes 107 + x = 180.',
        'Subtract 107 from both sides: x = 73. The third angle is 73°.',
        'Check by adding all three back up: 42 + 65 + 73 = 180. Correct.',
        `Now the second question. Sketch a triangle with those angles small enough to fit on a sticky note. Now sketch the same three angles big enough to fill a poster. Both are real triangles, and the angles never changed.`,
        `So three angles that add to 180° give MORE THAN ONE triangle. They lock in the SHAPE but not the SIZE. To pin down exactly one triangle you need at least one side length in the mix.`,
      ],
      example: { problem: `A triangle has angles of 42° and 65°. Find the third angle. Then decide: do those three angle measures describe exactly one triangle, more than one, or none?`, solution: `The third angle is 73°, and those three angles describe more than one triangle — many different sizes, all the same shape.` },
      relatedLoIds: ['m7math.triangle-side-and-angle-conditions'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, 5, 5, and 10 form a triangle" — There are three checks, and every one of them has to pass. Check one: 5 + 10 = 15 > 5, passes. Check two: 5 + 10 = 15 > 5, passes again. Check three, the one that got skipped: 5 + 5 = 10, and the third side is 10. Is 10 greater than 10? No. That check FAILS, so the answer is no triangle. Faster route: find the longest side first, which is 10, then test the two shortest against it. That is the check that actually decides it.`, kind: 'common-error' },
    { content: `Students often say "Yes, because 5 + 5 lands exactly on 10" — Landing exactly on the third side means the two short sides lie flat along the long one with nothing left over to lift into a corner. The shape has zero height, so it is a line segment, not a triangle. The sum must EXCEED the third side. If the two shorter sides were 5 and 5.1, then 5 + 5.1 = 10.1 > 10 and you would get a very thin but real triangle.`, kind: 'common-error' },
    { content: `The sum of any two sides must be GREATER than the third side. Equal to it is a fail.`, kind: 'tip' },
    { content: `Test all three pairs, or find the longest side and test the two shortest against it.`, kind: 'tip' },
    { content: `The three angles of a triangle always add to 180°, so two angles force the third.`, kind: 'tip' },
    { content: 'Three side lengths that pass the inequality build exactly ONE triangle.', kind: 'tip' },
    { content: `Three angles that add to 180° build MANY triangles — same shape, different sizes. Lengths that fail, or angles that do not total 180°, build none.`, kind: 'tip' },
    { content: `One failed check kills the whole set. Don't stop at the first pair that passes — 4 + 13 > 9 and 9 + 13 > 4 both pass, but 4 + 9 = 13 fails, so 4, 9, 13 is NOT a triangle.`, kind: 'common-error' },
    { content: `"Greater than" means strictly greater. If the two shorter sides add to exactly the longest side (5 + 5 = 10), the shape lies flat with zero height. Flat is not a triangle.`, kind: 'gotcha' },
    { content: `If you use the shortcut, find the LONGEST side first, then add the other two. Adding the first two numbers you see only works if you got lucky with the order.`, kind: 'tip' },
    { content: `Sides vs. angles: three valid SIDE lengths make exactly ONE triangle. Three angles adding to 180° make MANY triangles — same shape, any size. Angles lock the shape, not the size.`, kind: 'vocab-note' },
    { content: `For the third side with sides 4 and 9, the range is 5 < x < 13 — the difference and the sum, with BOTH ends excluded. 5 and 13 themselves are not allowed.`, kind: 'edge-case' },
    { content: `"Largest whole-number third side" is not the same as the upper bound. With 7 and 10, x < 17, so the largest whole number is 16, not 17.`, kind: 'common-error' },
    { content: `Angles that don't total 180° describe NO triangle — not a small one, not a weird one. Always add your three angles back up as a check: 42 + 65 + 73 = 180.`, kind: 'tip' },
    { content: `Keep units with your answer and don't mix them. 4 cm and 9 cm need a third side in cm; comparing 7 inches to 10 cm is meaningless.`, kind: 'vocab-note' },
  ],
};
