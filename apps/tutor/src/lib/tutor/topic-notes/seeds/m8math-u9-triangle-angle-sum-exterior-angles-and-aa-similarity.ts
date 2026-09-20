/**
 * Grade 8 Math — Unit 9 CED 9.2: Triangle Angle Sum, Exterior Angles & AA Similarity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.triangle-angle-sum-exterior-angles-and-aa-similarity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U9_TRIANGLE_ANGLE_SUM_EXTERIOR_ANGLES_AND_AA_SIMILARITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.triangle-angle-sum-exterior-angles-and-aa-similarity.v1',
  course: 'Grade 8 Math',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Triangle Angle Sum, Exterior Angles & AA Similarity',
  planId: 'evelyn.ms.m8math.triangle-angle-sum-exterior-angles-and-aa-similarity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.triangle-angle-sum-exterior-angles-and-aa-similarity.v1' }],
  theory: [
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'The corners line up because of a parallel line', content: `THE CORNERS LINE UP BECAUSE OF A PARALLEL LINE — take any triangle ABC with BC along the bottom, and draw the line through the top vertex A that is parallel to BC. Sides AB and AC are now two transversals cutting a pair of parallel lines. The angle at B and the angle tucked against A on the left are alternate interior angles, so they are equal, and the angle at C and the angle tucked against A on the right are alternate interior angles, so they are equal too. The three angles at A along the parallel line, the copy of B, the triangle's own angle A, and the copy of C, fill a straight line, so they add to 180°. Those three are the triangle's three angles. That is the whole reason.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'It works for every triangle at once', content: `IT WORKS FOR EVERY TRIANGLE AT ONCE — the argument never measured anything. It used only two facts you own: alternate interior angles of parallel lines are equal, and angles on a straight line add to 180°. Swap in any triangle and the same two copies slide up to the top and fill the same straight line. So two known angles always force the third: a triangle with angles 48° and 67° must have a third angle of 180 - 48 - 67 = 65°.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'An exterior angle sits on a straight line with its neighbor', content: `AN EXTERIOR ANGLE SITS ON A STRAIGHT LINE WITH ITS NEIGHBOR — extend one side of the triangle past a vertex. The angle between that extension and the other side at the vertex is an exterior angle of the triangle. It sits on the straight line you just drew, right next to the interior angle at that vertex, so the two add to 180°. If the interior angle at C is 70°, the exterior angle at C is 180 - 70 = 110°.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'An exterior angle equals the two remote interior angles', content: `AN EXTERIOR ANGLE EQUALS THE TWO REMOTE INTERIOR ANGLES — two totals are both 180° and both contain the interior angle at C: the three interior angles add to 180°, and the interior angle at C plus the exterior angle at C add to 180°. Take angle C out of both, and what is left over must match: the exterior angle at C equals angle A plus angle B. Those two are the remote interior angles, the two that do not touch the exterior angle. With A = 50° and B = 60°, the exterior angle at C is 50 + 60 = 110°, and 110 + 70 = 180 confirms it. The interior angle right next door is never one of the two that add up.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'Two matching angles force the third, so two are enough for similar', content: `TWO MATCHING ANGLES FORCE THE THIRD, SO TWO ARE ENOUGH FOR SIMILAR — if one triangle has angles 40° and 75° and a second triangle also has angles 40° and 75°, each third angle is 180 - 40 - 75 = 65°, so all three angles match. Three matching angles means the two triangles are the same shape, one just a resized copy of the other, which is exactly what similar means: a dilation followed by slides, flips or turns lands one on the other. So you never need to check the third angle or a single side length. Two matching angles is the angle-angle test for similar triangles.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'framework', title: 'Solving is the same routine as always', content: `SOLVING IS THE SAME ROUTINE AS ALWAYS — name the fact, write its equation, solve, substitute back to get the ANGLE. Three interior angles give a sum of 180. An exterior angle gives either "exterior plus its neighbor is 180" or "exterior equals the two remote interior angles", and both routes always land on the same number, so the second is a check on the first. Any algebra that shows up is algebra you own, up to a variable on both sides.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'definition', title: 'interior angle', content: 'one of the three angles inside a triangle, at a vertex between two sides.' },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'definition', title: 'exterior angle', content: `the angle between one side of a triangle and the extension of a neighboring side past the vertex; it sits on a straight line with the interior angle at that vertex.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'definition', title: 'remote interior angles', content: `the two interior angles of a triangle that do not touch a given exterior angle; their sum equals that exterior angle.` },
    { loId: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity', kind: 'definition', title: 'angle-angle (AA) similarity', content: `the fact that two triangles with two matching angle measures are similar, because the third angles are forced to match as well.` },
  ],
  methods: [
    {
      title: 'Worked parallel line argument',
      steps: [
        `Draw the line through A that is parallel to BC. Side AB now cuts across two parallel lines, so it is a transversal, and so is side AC.`,
        `Look at transversal AB. Angle B, inside the parallel lines on one side of AB, and the angle tucked against A on the left, inside the parallel lines on the other side of AB, are alternate interior angles. Parallel lines make alternate interior angles equal, so the left angle at A is a copy of B: 48°.`,
        `Look at transversal AC the same way. Angle C and the angle tucked against A on the right are alternate interior angles, so the right angle at A is a copy of C: 67°.`,
        `Now read across the parallel line at A. Left copy, then the triangle's own angle A, then right copy, and together they fill a straight line: 48 + A + 67 = 180.`,
        'Add the two copies: 48 + 67 = 115. So A = 180 - 115 = 65. Angle A is 65°.',
        `Check by adding all three interior angles: 48 + 67 + 65 = 180. Then notice what the argument never used: the numbers. Replace 48 and 67 with any two angles and the same two copies slide up to A and fill the same straight line, which is why EVERY triangle's angles add to 180°.`,
      ],
      example: { problem: `Triangle ABC has angle B = 48° and angle C = 67°, with side BC along the bottom. Use the line through A parallel to BC to explain why the three angles add to 180°, then find angle A.`, solution: `Angle A = 65°; the two base angles reappear at A as alternate interior copies, and those copies plus angle A fill a straight line, so the three angles add to 180°` },
      relatedLoIds: ['m8math.triangle-angle-sum-exterior-angles-and-aa-similarity'],
    },
    {
      title: 'Worked exterior angle and aa',
      steps: [
        `Picture it. The extension RS continues side PR in a straight line, so P, R and S line up. The exterior angle QRS sits between the extension RS and side RQ, and the interior angle PRQ sits right next to it on that straight line.`,
        `Route one, through the interior angle at R. The three interior angles add to 180: 38 + 64 = 102, so angle R = 180 - 102 = 78. Then the exterior angle and angle R fill a straight line: exterior = 180 - 78 = 102°.`,
        `Route two, the shortcut. The exterior angle equals the sum of the two REMOTE interior angles, the two that do not touch R, which are P and Q: 38 + 64 = 102°. Same answer in one step.`,
        `WRONG: adding the interior angle next door, 78 + 64 = 142°, and calling that the exterior angle. CORRECT: the angle next door already shares a straight line with the exterior angle, so 78 + 102 = 180 and it can never be one of the two that add up to the exterior angle. Only the two remote angles, 38 and 64, go into the sum. The check exposes the slip: 142 + 78 = 220, not 180.`,
        `For (b), find the third angle of the second triangle: 180 - 38 - 78 = 64. Its three angles are 38°, 78° and 64°, and triangle PQR has 38°, 64° and 78°. All three match.`,
        `WRONG: saying the triangles are not similar because the second triangle's given angles, 38 and 78, do not match PQR's given angles, 38 and 64. CORRECT: the third angle is forced by the other two, so compute it before you judge. The order the angles are listed in does not matter, only whether the same three measures appear.`,
        `Check: 38 + 64 + 78 = 180 for both triangles, and two matching angles, 38° and 78°, were already enough to know the third would match. The second triangle is similar to PQR by angle-angle.`,
      ],
      example: { problem: `In triangle PQR, angle P = 38° and angle Q = 64°. Side PR is extended past R to a point S. (a) Find the exterior angle QRS two ways. (b) A second triangle has angles 38° and 78°. Is it similar to triangle PQR?`, solution: `(a) The exterior angle QRS is 102°, by 180 - 78 and by 38 + 64. (b) Yes, the second triangle is similar to triangle PQR, because its third angle is 64° and all three angles match` },
      relatedLoIds: ['m8math.triangle-angle-sum-exterior-angles-and-aa-similarity'],
    },
  ],
  pointers: [
    { content: `Students often say "The exterior angle at C is 145°." — The exterior angle at C equals the sum of the two remote interior angles, A and B: 35 + 85 = 120°. Confirm it the other way: the interior angle at C is 180 - 35 - 85 = 60°, and 60 + 120 = 180, a straight line. The 35° angle at A is nowhere near that straight line, so 180 - 35 measures nothing in the picture.`, kind: 'common-error' },
    { content: `Students often say "The second triangle is not similar, because 60 is not 35." — Find every third angle first. Triangle ABC has 35°, 85° and 180 - 35 - 85 = 60°. The second triangle has 60°, 85° and 180 - 60 - 85 = 35°. The same three measures, 35°, 60° and 85°, appear in both, so the triangles are similar. Two matching angles, 60° and 85°, were already enough to guarantee it.`, kind: 'common-error' },
    { content: `A line through one vertex parallel to the opposite side turns the other two angles into alternate interior copies at that vertex, and the three angles there fill a straight line. That is why every triangle's angles add to 180°.`, kind: 'tip' },
    { content: 'Two known angles force the third: subtract both from 180.', kind: 'tip' },
    { content: `An exterior angle sits on a straight line with the interior angle next to it, so the two add to 180°.`, kind: 'tip' },
    { content: `An exterior angle equals the sum of the two REMOTE interior angles, the two that do not touch it. The angle next door is never part of that sum.`, kind: 'tip' },
    { content: `Two matching angles force the third to match, so two matching angles are enough to say two triangles are similar (angle-angle). Compute the third angle before you judge; the listed order does not matter.`, kind: 'tip' },
    { content: `To solve: name the fact, write the equation, solve for x, then substitute back to get the angle. Both exterior-angle routes must agree.`, kind: 'tip' },
    { content: `**Don't use the interior angle next door in the exterior angle sum.** An exterior angle equals the two *remote* interior angles—the ones that don't touch it. The adjacent interior angle sits on the same straight line, so it adds to 180° with the exterior, never into the sum.`, kind: 'common-error' },
    { content: `Always compute the third angle before deciding if two triangles are similar. Two matching angles force the third to match, but you must find it first—it's never given for free. The order angles are listed doesn't matter.`, kind: 'tip' },
    { content: `An **exterior angle** and its **interior angle neighbor** are supplementary (add to 180°), but an **exterior angle** equals the sum of the two **remote interior angles**. Both facts are true; use whichever route fits the problem.`, kind: 'vocab-note' },
    { content: `When you extend a side past a vertex, the exterior angle is the angle *between the extension and the other side at that vertex*, not the full angle on the other side of the line.`, kind: 'gotcha' },
    { content: `If the problem gives you two angles of a triangle and asks for an exterior angle, find the interior angle at that vertex first (subtract from 180), then use the straight-line rule or the remote-angle sum. Both must give the same number—that's your check.`, kind: 'tip' },
    { content: `The parallel-line argument doesn't measure any angles—it only uses 'alternate interior angles are equal' and 'angles on a straight line sum to 180°'. That's why it proves *every* triangle has angles summing to 180°, not just the ones you drew.`, kind: 'tip' },
    { content: `In angle-angle (AA) similarity, two matching angle measures are enough; you do *not* need to check side lengths or the third angle. But you *must* compute the third angle to confirm the match exists.`, kind: 'edge-case' },
  ],
};
