/**
 * Grade 7 Math — Unit 7 CED 7.1: Angle Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.angle-relationships.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U7_ANGLE_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.angle-relationships.v1',
  course: 'Grade 7 Math',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Angle Relationships',
  planId: 'evelyn.ms.m7math.angle-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.angle-relationships.v1' }],
  theory: [
    { loId: 'm7math.angle-relationships', kind: 'framework', title: 'Angles are measured in degrees', content: `ANGLES ARE MEASURED IN DEGREES — a square corner is 90°, a straight line is 180°, and a full spin is 360°. Those three numbers are the only totals you need in this whole lesson, so keep them close.` },
    { loId: 'm7math.angle-relationships', content: `COMPLEMENTARY MEANS 90°, SUPPLEMENTARY MEANS 180° — two angles are complementary when their measures add to 90°, and supplementary when they add to 180°. This is only about the NUMBERS. The two angles can be touching, or they can sit on opposite sides of the page. C comes before S in the alphabet, and 90 comes before 180.` },
    { loId: 'm7math.angle-relationships', kind: 'framework', title: 'Adjacent angles share a vertex and a side', content: `ADJACENT ANGLES SHARE A VERTEX AND A SIDE — they sit right next to each other like two slices of the same pizza, sharing a corner point and one edge, with no overlap. When two adjacent angles together make a straight line, they must add to 180°. That is the picture that hands you a supplementary equation for free.` },
    { loId: 'm7math.angle-relationships', kind: 'framework', title: 'Vertical angles are equal', content: `VERTICAL ANGLES ARE EQUAL — when two straight lines cross they make an X, and the two angles that sit directly across from each other are vertical angles. Vertical angles always have the SAME measure. They are never added to 180°. That is the neighbor angle next door, not the one across the X.` },
    { loId: 'm7math.angle-relationships', kind: 'framework', title: 'One angle unlocks four', content: `ONE ANGLE UNLOCKS FOUR — at any crossing the four angles read around the X as x, 180° − x, x, 180° − x. Two copies of the small one and two copies of the big one, and all four together add to 360°. If one angle is 70°, the four are 70°, 110°, 70°, 110°.` },
    { loId: 'm7math.angle-relationships', kind: 'framework', title: 'The equation move', content: `THE EQUATION MOVE — this is the part that matters most. Step one, name the relationship out loud. Step two, write its equation: equal angles give expression = expression, and a supplementary pair gives expression + expression = 180. Step three, solve for x. Step four, put x back in to get the ANGLE, because the question almost always asks for the angle, not for x.` },
    { loId: 'm7math.angle-relationships', kind: 'definition', title: 'complementary angles', content: 'two angles whose measures add to 90°.' },
    { loId: 'm7math.angle-relationships', kind: 'definition', title: 'supplementary angles', content: 'two angles whose measures add to 180°.' },
    { loId: 'm7math.angle-relationships', kind: 'definition', title: 'adjacent angles', content: 'two angles that share a vertex and a side and do not overlap.' },
    { loId: 'm7math.angle-relationships', kind: 'definition', title: 'vertical angles', content: `the two angles directly across from each other where two lines cross; they are always equal.` },
  ],
  methods: [
    {
      title: 'Worked one angle unlocks four',
      steps: [
        `Picture the X. Label the known 62° angle at the top. Going clockwise, call the others the right angle-space, the bottom, and the left.`,
        `The angle directly across the X from the 62° one is a vertical angle, so it is also 62°. No arithmetic needed — vertical angles are equal.`,
        `The angle right next to the 62° one sits with it on a straight line, so the two are supplementary: 180° − 62° = 118°.`,
        'The last angle is vertical to that 118° one, so it is 118° too.',
        `Check the total. All four should circle back to a full spin: 62 + 118 + 62 + 118 = 360. That works, and the answers come in two matching pairs, which is exactly what an X should give.`,
      ],
      example: { problem: `Two straight lines cross at point P. One of the four angles measures 62°. Find the other three.`, solution: 'The other three angles are 62°, 118°, and 118°.' },
      relatedLoIds: ['m7math.angle-relationships'],
    },
    {
      title: 'Worked supplementary equation',
      steps: [
        `Name the relationship first: supplementary. That means the two measures ADD to 180. It does NOT mean they are equal. WRONG equation to avoid: 2x + 10 = 3x − 5. RIGHT equation: (2x + 10) + (3x − 5) = 180.`,
        `Combine the like terms on the left. The x terms are 2x and 3x, which give 5x. The plain numbers are +10 and −5, which give +5. So the equation is 5x + 5 = 180.`,
        'Undo the +5 by subtracting 5 from both sides: 5x = 175.',
        'Undo the times 5 by dividing both sides by 5: x = 35.',
        `The question asks for ANGLES, so put 35 back in. Angle P is 2(35) + 10 = 70 + 10 = 80°. Angle Q is 3(35) − 5 = 105 − 5 = 100°.`,
        `Check by adding: 80 + 100 = 180. Supplementary, just as the problem said. The work holds up.`,
      ],
      example: { problem: `Angle P and angle Q are supplementary. The measure of angle P is (2x + 10)° and the measure of angle Q is (3x − 5)°. Find x and the measure of each angle.`, solution: 'x = 35, angle P = 80° and angle Q = 100°' },
      relatedLoIds: ['m7math.angle-relationships'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 19.5" — Angles directly across the X from each other are vertical angles, and vertical angles are EQUAL. So the right equation sets the two expressions equal: 5x = 3x + 24. Subtract 3x from both sides to get 2x = 24, so x = 12. Now find the angles: 5(12) = 60° and 3(12) + 24 = 36 + 24 = 60°. Both are 60°, which is exactly what equal means. Name the relationship first, and the equation writes itself.`, kind: 'common-error' },
    { content: `Students often say "Both angles must be 90°" — Supplementary only says the two measures ADD to 180°. It says nothing about them being equal. 130° and 50° are supplementary. So are 179° and 1°. Two supplementary angles are both 90° only in the special case where the lines cross square, and that has to be given, never guessed from how the picture looks.`, kind: 'common-error' },
    { content: 'Complementary angles add to 90°. Supplementary angles add to 180°.', kind: 'tip' },
    { content: `Two adjacent angles that form a straight line are supplementary, so they add to 180°.`, kind: 'tip' },
    { content: `Vertical angles sit across the X from each other and are always EQUAL. Never add them to 180°.`, kind: 'tip' },
    { content: `To find an unknown angle, name the relationship, write the equation, solve for x, then substitute back.`, kind: 'tip' },
    { content: `Equal angles give expression = expression. A supplementary pair gives expression + expression = 180.`, kind: 'tip' },
    { content: `Vertical angles (across the X) are EQUAL. Neighbor angles (next door on a straight line) add to 180°. Mixing these up is the #1 error here — point at the two angles and ask "across or next door?" before writing anything.`, kind: 'common-error' },
    { content: `Solving for x is not the finish line. If the problem asks for the angle measure, plug x back into the expression like (2x + 10). Answering "x = 35" when the question wanted 80° loses the point.`, kind: 'gotcha' },
    { content: `Supplementary does NOT mean the two angles are the same size. 179° and 1° are supplementary. Only assume both are 90° if the problem tells you the angles are right angles.`, kind: 'common-error' },
    { content: `Complementary = 90°, supplementary = 180°. Memory hook: C before S in the alphabet, 90 before 180 on the number line. Also, Corner (90°) starts with C and Straight (180°) starts with S.`, kind: 'vocab-note' },
    { content: `Complementary and supplementary are about NUMBERS only. The two angles don't have to touch or be in the same picture. Adjacent is the word for sharing a vertex and a side — being adjacent doesn't automatically make angles add to 180°.`, kind: 'vocab-note' },
    { content: `Never measure with your eyes or a ruler on a figure. Drawings aren't to scale — an angle that looks like a right angle may be 85°. Use only the numbers and relationships the problem states.`, kind: 'tip' },
    { content: `When two lines cross, one angle gives you all four: x, 180 − x, x, 180 − x. Check your set by adding all four — it must total 360°. If it doesn't, you copied a vertical pair wrong.`, kind: 'tip' },
    { content: `Watch the signs when combining expressions. (2x + 10) + (3x − 5) = 180 becomes 5x + 5 = 180, not 5x + 15. The −5 stays negative when you add the constants.`, kind: 'common-error' },
  ],
};
