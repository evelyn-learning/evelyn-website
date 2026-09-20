/**
 * Grade 8 Math — Unit 9 CED 9.1: Parallel Lines Cut by a Transversal.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.parallel-lines-cut-by-a-transversal.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U9_PARALLEL_LINES_CUT_BY_A_TRANSVERSAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.parallel-lines-cut-by-a-transversal.v1',
  course: 'Grade 8 Math',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Parallel Lines Cut by a Transversal',
  planId: 'evelyn.ms.m8math.parallel-lines-cut-by-a-transversal.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.parallel-lines-cut-by-a-transversal.v1' }],
  theory: [
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'framework', title: 'The setup is two crossings, eight angles', content: `THE SETUP IS TWO CROSSINGS, EIGHT ANGLES — a transversal is a line that cuts across two other lines. It makes four angles at each crossing, eight in all. The four angles that sit BETWEEN the two lines are interior; the four that sit outside are exterior. To talk about them, number the angles 1 to 4 around the top crossing (upper-left, upper-right, lower-left, lower-right) and 5 to 8 the same way around the bottom crossing. So 3, 4, 5 and 6 are interior, and 1, 2, 7 and 8 are exterior.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'framework', title: 'Name a pair by position', content: `NAME A PAIR BY POSITION — CORRESPONDING angles sit in the same spot at each crossing, so 1 and 5 are both upper-left, and 4 and 8 are both lower-right. ALTERNATE INTERIOR angles are both interior and on opposite sides of the transversal: 3 and 6, or 4 and 5. ALTERNATE EXTERIOR angles are both exterior and on opposite sides: 1 and 8, or 2 and 7. SAME-SIDE INTERIOR angles are both interior and on the same side of the transversal: 3 and 5, or 4 and 6. Ask two questions and the name falls out: inside or outside, and same side or opposite sides.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', content: `WHY CORRESPONDING ANGLES ARE EQUAL: THE SLIDE — take the whole top crossing and translate it straight down the transversal until the top line lands on the bottom line. Because the two lines are parallel, the top line lands exactly on top of the bottom line, and the transversal slides along itself, so the top crossing lands exactly on the bottom crossing. A translation keeps every angle measure, which you already verified when you slid figures on the coordinate plane. So angle 1 lands on angle 5 with the same measure, angle 2 on angle 6, angle 3 on angle 7, and angle 4 on angle 8. Corresponding angles are equal, and the slide is the reason. If the lines were not parallel, the slide would miss, and the pairs would promise nothing.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'framework', title: 'Alternate angles are equal in two hops', content: `ALTERNATE ANGLES ARE EQUAL IN TWO HOPS — start at angle 3. Hop to its corresponding angle: 3 = 7. Now hop across the bottom crossing to the vertical angle: 7 = 6, because vertical angles are equal. So 3 = 6, and those two are alternate interior angles. The same two hops work outside: 1 = 5 by the slide, then 5 = 8 across the X, so 1 = 8, and those are alternate exterior angles. Every "alternate" pair is equal, and the reason is always the slide plus a vertical pair.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', content: `SAME-SIDE INTERIOR ANGLES ADD TO 180°, THEY ARE NOT EQUAL — start at angle 3 again and hop to its corresponding angle: 3 = 7. But 7 and 5 sit next to each other on the bottom line, a straight line, so 5 + 7 = 180. Swap the 7 for the 3 it equals and you get 3 + 5 = 180. That is the only pair on the list that ADDS instead of matches, and "parallel" does not mean "equal" for it. If angle 3 is 110°, angle 5 is 70°.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'framework', title: 'Only two sizes, then the equation move', content: `ONLY TWO SIZES, THEN THE EQUATION MOVE — put the pieces together and all eight angles are one of two numbers that add to 180°: four copies of the small one and four copies of the big one. If the transversal happens to cross square, all eight are 90°. That is your check on any answer. To find an unknown angle, do what you did with vertical and straight-line pairs: name the pair, write its equation (equal pairs give expression = expression, a same-side interior pair gives expression + expression = 180), solve, then put the value back in to get the angle.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'transversal', content: 'a line that cuts across two other lines, making four angles at each crossing.' },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'interior angles', content: 'the four angles that sit between the two lines the transversal crosses.' },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'exterior angles', content: 'the four angles that sit outside the two lines the transversal crosses.' },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'corresponding angles', content: `two angles in the same position at the two crossings, such as both upper-left; equal when the lines are parallel.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'alternate interior angles', content: `two interior angles on opposite sides of the transversal; equal when the lines are parallel.` },
    { loId: 'm8math.parallel-lines-cut-by-a-transversal', kind: 'definition', title: 'same-side interior angles', content: `two interior angles on the same side of the transversal; they add to 180° when the lines are parallel.` },
  ],
  methods: [
    {
      title: 'Worked fill all eight',
      steps: [
        `Start at the top crossing, where you already know the rules. Angle 3 is directly across the X from angle 2, so it is a vertical angle and equals 115°. Angles 1 and 4 each sit on a straight line with angle 2, so each is 180 - 115 = 65°.`,
        `Now slide the top crossing down the transversal onto the bottom crossing. Every angle lands on its corresponding angle with the same measure: angle 6 corresponds to angle 2, so angle 6 = 115°; angle 5 corresponds to angle 1, so angle 5 = 65°; angle 7 corresponds to angle 3, so angle 7 = 115°; angle 8 corresponds to angle 4, so angle 8 = 65°.`,
        `Read the pairs back off the finished picture. Alternate interior: angles 3 and 6 are both 115°, and angles 4 and 5 are both 65°, equal as promised. Alternate exterior: angles 1 and 8 are both 65°, and angles 2 and 7 are both 115°.`,
        `Same-side interior: angles 3 and 5 are 115° and 65°, and 115 + 65 = 180. Angles 4 and 6 are 65° and 115°, and 65 + 115 = 180. They add, they do not match.`,
        `Check with the two-sizes rule. Only 115° and 65° appear, four of each, and 115 + 65 = 180. All eight together: 4 × 115 + 4 × 65 = 460 + 260 = 720, which is two full turns of 360°, one at each crossing.`,
      ],
      example: { problem: `Lines m and n are parallel and are cut by transversal t. Number the angles 1 to 4 around the top crossing (upper-left, upper-right, lower-left, lower-right) and 5 to 8 the same way around the bottom crossing. Angle 2 measures 115°. Find all seven other angles.`, solution: 'Angles 3, 6 and 7 are 115°; angles 1, 4, 5 and 8 are 65°' },
      relatedLoIds: ['m8math.parallel-lines-cut-by-a-transversal'],
    },
    {
      title: 'Worked same side equation',
      steps: [
        `Name the pair first. Angle 4 is lower-right at the top crossing, and angle 6 is upper-right at the bottom crossing. Both are between the lines, so both are interior, and both are on the right of the transversal, so they are on the SAME side. Angles 4 and 6 are same-side interior angles.`,
        `WRONG: calling 4 and 6 alternate interior because both are interior, and writing 3x + 10 = 2x + 20, which gives x = 10 and two angles of 40°. CORRECT: "alternate" needs opposite sides of the transversal, and these two are on the same side. Same-side interior angles add to 180°, so the equation is (3x + 10) + (2x + 20) = 180. The wrong answer fails its own check: two same-side interior angles of 40° and 40° add to 80, not 180.`,
        'Combine like terms on the left: 3x + 2x = 5x and 10 + 20 = 30, so 5x + 30 = 180.',
        `Clear the constant first: subtract 30 from both sides, 5x = 150. Then divide both sides by 5: x = 30.`,
        `The question asks for angles, so substitute x = 30 back in. Angle 4 = 3(30) + 10 = 90 + 10 = 100°. Angle 6 = 2(30) + 20 = 60 + 20 = 80°.`,
        `Check: 100 + 80 = 180, so the same-side interior pair adds to 180° as it must, and the two-sizes rule says every angle in the picture is either 100° or 80°.`,
      ],
      example: { problem: `Lines p and q are parallel and are cut by transversal t, with the angles numbered 1 to 8 as before. Angle 4 measures (3x + 10)° and angle 6 measures (2x + 20)°. Find x and the measure of each angle.`, solution: 'x = 30; angle 4 = 100° and angle 6 = 80°' },
      relatedLoIds: ['m8math.parallel-lines-cut-by-a-transversal'],
    },
  ],
  pointers: [
    { content: `Students often say "Angle 5 is 70°." — Angles 3 and 5 are both interior and both on the left of the transversal, so they are same-side interior angles, the one pair that adds to 180° instead of matching. Run the two hops: 3 = 7 by the slide, and 7 + 5 = 180 because 7 and 5 sit on the straight line n, so 3 + 5 = 180 and angle 5 = 180 - 70 = 110°. Parallel lines make corresponding and alternate pairs equal; they make same-side interior pairs supplementary.`, kind: 'common-error' },
    { content: `Students often say "Angle 7 is 110°." — Angles 3 and 7 are both lower-left, one at each crossing, so they are corresponding angles. Slide the top crossing down the transversal: because m and n are parallel, angle 3 lands exactly on angle 7, and a translation keeps the measure, so angle 7 = 70°. The 180° rule belongs to two angles side by side on one straight line, and angles 3 and 7 are not on one straight line together. The two-sizes check settles it: every angle here is 70° or 110°, and angle 7 is one of the 70° ones.`, kind: 'common-error' },
    { content: `A transversal cutting two lines makes eight angles, four at each crossing. Interior angles sit between the two lines; exterior angles sit outside.`, kind: 'tip' },
    { content: `Name a pair with two questions: inside or outside, and same side or opposite sides of the transversal. Corresponding angles share a position at the two crossings.`, kind: 'tip' },
    { content: `When the lines are parallel, corresponding angles are equal, because sliding one crossing along the transversal lands it exactly on the other, and a slide keeps every angle measure.`, kind: 'tip' },
    { content: `Alternate interior and alternate exterior angles are equal: hop to the corresponding angle, then across the X to the vertical angle.`, kind: 'tip' },
    { content: `Same-side interior angles add to 180°. They are the one pair that adds instead of matches.`, kind: 'tip' },
    { content: `With parallel lines, all eight angles are one of two sizes that add to 180°. To solve, name the pair, write equal or add to 180, solve, then substitute back to get the angle.`, kind: 'tip' },
  ],
};
