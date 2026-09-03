/**
 * Grade 8 Math — Angles & the Pythagorean Theorem: Triangle Angle Sum,
 * Exterior Angles & AA Similarity.
 *
 * CONCEPT-LED. The student arrives already USING the 180° angle sum as a
 * handed-down fact and already owning the parallel-line angle pairs from the
 * previous lesson; what is new is the WHY, and the two facts that fall out of
 * it (CCSS 8.G.A.5). The mental model built here is one picture: draw the
 * line through the top vertex parallel to the base, and the two base angles
 * slide up to the top as alternate interior copies, where they sit with the
 * third angle on a straight line. That one picture explains the 180° sum for
 * every triangle at once. The same sum, combined with a straight line at one
 * vertex, hands over the exterior-angle rule (an exterior angle equals the
 * two remote interior angles) as a leftover rather than a new thing to
 * memorize, and hands over angle-angle similarity as arithmetic (two matching
 * angles force the third to match, and same three angles means same shape).
 * The lesson ends where the Grade 7 angle lesson ended: name the fact, write
 * the equation, solve, substitute back. The two errors this plan is built to
 * kill are pulling the ADJACENT interior angle into the exterior-angle sum,
 * and judging two triangles not similar because their two GIVEN angles do not
 * match, without computing the third.
 *
 * SCOPE GUARD: Grade 8 row 9.2 gives the informal argument (a parallel line
 * through a vertex plus row 9.1) that a triangle's angles sum to 180°,
 * derives that an exterior angle equals the sum of the two remote interior
 * angles, and the angle-angle criterion for similar triangles (two equal
 * angles force the third); solves for unknown angles.
 * `m7math-u7-triangle-side-and-angle-conditions.ts` USED the 180° sum as a
 * fact — this row explains why. Withholds: formal theorems,
 * isosceles/equilateral results → `geom-u5-triangle-angle-relationships.ts`,
 * `geom-u5-isosceles-equilateral.ts`; polygon angle sums →
 * `geom-u8-polygon-angle-sums.ts`. Concretely: no fact in this plan is cited
 * by a theorem name or used as a named reason in a proof — the words
 * "theorem", "postulate" and "proof" appear nowhere in the lesson body (only
 * in this comment and in the next row's id under followUps), and the why is
 * always the parallel-line picture and a straight line, told in plain words.
 * The words "isosceles" and "equilateral" appear nowhere in the lesson body,
 * no result about equal SIDES
 * is stated or used, and every triangle that exists in this plan has three
 * different angle measures. No figure with more than three sides appears and
 * no angle total other than 180° (a triangle or a straight line) is ever
 * used. AA similarity is taught as an angle fact only: two matching angles
 * force the third to match, and three matching angles means same shape,
 * which is what "similar" was defined to mean in row 8.4 (a dilation
 * followed by rigid motions maps one figure onto the other — recalled in one
 * clause, never re-taught). No proportional-sides test, no side length, no
 * scale factor and no SSS or SAS similarity appears (`geom-u6-*`). Sideways:
 * the four parallel-line pair names and the fact that alternate interior
 * angles of parallel lines are equal are row 9.1 ground, used here in a
 * clause each and never re-argued; nothing about right triangles or side
 * lengths is done (rows 9.3-9.4). Below, used and not re-taught: angles on a
 * straight line add to 180° (`m7math-u7-angle-relationships.ts`), the
 * name-the-fact-then-write-the-equation routine, and the algebra that
 * finishes each solve (a two-step equation, or one with the variable on both
 * sides, which is row 4.1 ground). Also allowed and why: finding a third
 * angle from two known ones IS done here, because it is the computation the
 * argument produces and the skill the row names; the Grade 7 lesson did that
 * arithmetic as a fact and this lesson does it knowing why.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U9_TRIANGLE_ANGLE_SUM_EXTERIOR_ANGLES_AND_AA_SIMILARITY: LessonPlan = {
  id: 'evelyn.ms.m8math.triangle-angle-sum-exterior-angles-and-aa-similarity.v1',
  title: 'Triangle Angle Sum, Exterior Angles & AA Similarity',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.triangle-angle-sum-exterior-angles-and-aa-similarity',
      standard: 'M8MATH-9.2',
      description:
        "Give the informal argument (a parallel line through a vertex) that a triangle's angles sum to 180°, derive that an exterior angle equals the sum of the two remote interior angles, and the angle-angle criterion for similar triangles (two equal angles force the third); solve for unknown angles (CCSS 8.G.A.5).",
    },
  ],
  prerequisites: ['m8math.parallel-lines-cut-by-a-transversal'],
  followUps: ['m8math.the-pythagorean-theorem-and-its-converse'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn the 180° fact the student already uses into a question, so the parallel-line picture arrives as the answer to something.',
      script:
        'Cut a triangle out of any scrap of paper, a ticket stub or the back of a worksheet, and make it as lopsided as you like. Tear off the three corners and push the torn tips together, point to point, on your desk. They fit along a straight line, every time, whether the triangle was thin as a sliver or wide as a slice of pizza. You have known for a long time that the three angles of a triangle add to 180°, and you have used it to find a missing angle. Nobody told you why it works. Today you find out, and the reason is a picture you already own from the last lesson: a pair of parallel lines cut by a transversal. Once that picture is in your head, two more facts drop out for free, one about an angle on the OUTSIDE of a triangle and one that tells you two triangles are the same shape from just two angles.',
      suggestedTools: ['show_geometry_constructed'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parallel-line-through-a-vertex',
      kind: 'concept',
      goal: 'Build the one picture that explains the 180° sum, then read the exterior-angle rule and angle-angle similarity out of it as consequences, and set up the equation routine for solving.',
      keyIdeas: [
        'THE CORNERS LINE UP BECAUSE OF A PARALLEL LINE — take any triangle ABC with BC along the bottom, and draw the line through the top vertex A that is parallel to BC. Sides AB and AC are now two transversals cutting a pair of parallel lines. The angle at B and the angle tucked against A on the left are alternate interior angles, so they are equal, and the angle at C and the angle tucked against A on the right are alternate interior angles, so they are equal too. The three angles at A along the parallel line, the copy of B, the triangle\'s own angle A, and the copy of C, fill a straight line, so they add to 180°. Those three are the triangle\'s three angles. That is the whole reason.',
        'IT WORKS FOR EVERY TRIANGLE AT ONCE — the argument never measured anything. It used only two facts you own: alternate interior angles of parallel lines are equal, and angles on a straight line add to 180°. Swap in any triangle and the same two copies slide up to the top and fill the same straight line. So two known angles always force the third: a triangle with angles 48° and 67° must have a third angle of 180 - 48 - 67 = 65°.',
        'AN EXTERIOR ANGLE SITS ON A STRAIGHT LINE WITH ITS NEIGHBOR — extend one side of the triangle past a vertex. The angle between that extension and the other side at the vertex is an exterior angle of the triangle. It sits on the straight line you just drew, right next to the interior angle at that vertex, so the two add to 180°. If the interior angle at C is 70°, the exterior angle at C is 180 - 70 = 110°.',
        'AN EXTERIOR ANGLE EQUALS THE TWO REMOTE INTERIOR ANGLES — two totals are both 180° and both contain the interior angle at C: the three interior angles add to 180°, and the interior angle at C plus the exterior angle at C add to 180°. Take angle C out of both, and what is left over must match: the exterior angle at C equals angle A plus angle B. Those two are the remote interior angles, the two that do not touch the exterior angle. With A = 50° and B = 60°, the exterior angle at C is 50 + 60 = 110°, and 110 + 70 = 180 confirms it. The interior angle right next door is never one of the two that add up.',
        'TWO MATCHING ANGLES FORCE THE THIRD, SO TWO ARE ENOUGH FOR SIMILAR — if one triangle has angles 40° and 75° and a second triangle also has angles 40° and 75°, each third angle is 180 - 40 - 75 = 65°, so all three angles match. Three matching angles means the two triangles are the same shape, one just a resized copy of the other, which is exactly what similar means: a dilation followed by slides, flips or turns lands one on the other. So you never need to check the third angle or a single side length. Two matching angles is the angle-angle test for similar triangles.',
        'SOLVING IS THE SAME ROUTINE AS ALWAYS — name the fact, write its equation, solve, substitute back to get the ANGLE. Three interior angles give a sum of 180. An exterior angle gives either "exterior plus its neighbor is 180" or "exterior equals the two remote interior angles", and both routes always land on the same number, so the second is a check on the first. Any algebra that shows up is algebra you own, up to a variable on both sides.',
      ],
      vocabulary: [
        { term: 'interior angle', definition: 'one of the three angles inside a triangle, at a vertex between two sides.' },
        { term: 'exterior angle', definition: 'the angle between one side of a triangle and the extension of a neighboring side past the vertex; it sits on a straight line with the interior angle at that vertex.' },
        { term: 'remote interior angles', definition: 'the two interior angles of a triangle that do not touch a given exterior angle; their sum equals that exterior angle.' },
        { term: 'angle-angle (AA) similarity', definition: 'the fact that two triangles with two matching angle measures are similar, because the third angles are forced to match as well.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-parallel-line-argument',
      kind: 'worked_example',
      problem:
        'Triangle ABC has angle B = 48° and angle C = 67°, with side BC along the bottom. Use the line through A parallel to BC to explain why the three angles add to 180°, then find angle A.',
      steps: [
        'Draw the line through A that is parallel to BC. Side AB now cuts across two parallel lines, so it is a transversal, and so is side AC.',
        'Look at transversal AB. Angle B, inside the parallel lines on one side of AB, and the angle tucked against A on the left, inside the parallel lines on the other side of AB, are alternate interior angles. Parallel lines make alternate interior angles equal, so the left angle at A is a copy of B: 48°.',
        'Look at transversal AC the same way. Angle C and the angle tucked against A on the right are alternate interior angles, so the right angle at A is a copy of C: 67°.',
        'Now read across the parallel line at A. Left copy, then the triangle\'s own angle A, then right copy, and together they fill a straight line: 48 + A + 67 = 180.',
        'Add the two copies: 48 + 67 = 115. So A = 180 - 115 = 65. Angle A is 65°.',
        'Check by adding all three interior angles: 48 + 67 + 65 = 180. Then notice what the argument never used: the numbers. Replace 48 and 67 with any two angles and the same two copies slide up to A and fill the same straight line, which is why EVERY triangle\'s angles add to 180°.',
      ],
      answer: 'Angle A = 65°; the two base angles reappear at A as alternate interior copies, and those copies plus angle A fill a straight line, so the three angles add to 180°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-exterior-angle-and-aa',
      kind: 'worked_example',
      problem:
        'In triangle PQR, angle P = 38° and angle Q = 64°. Side PR is extended past R to a point S. (a) Find the exterior angle QRS two ways. (b) A second triangle has angles 38° and 78°. Is it similar to triangle PQR?',
      steps: [
        'Picture it. The extension RS continues side PR in a straight line, so P, R and S line up. The exterior angle QRS sits between the extension RS and side RQ, and the interior angle PRQ sits right next to it on that straight line.',
        'Route one, through the interior angle at R. The three interior angles add to 180: 38 + 64 = 102, so angle R = 180 - 102 = 78. Then the exterior angle and angle R fill a straight line: exterior = 180 - 78 = 102°.',
        'Route two, the shortcut. The exterior angle equals the sum of the two REMOTE interior angles, the two that do not touch R, which are P and Q: 38 + 64 = 102°. Same answer in one step.',
        'WRONG: adding the interior angle next door, 78 + 64 = 142°, and calling that the exterior angle. CORRECT: the angle next door already shares a straight line with the exterior angle, so 78 + 102 = 180 and it can never be one of the two that add up to the exterior angle. Only the two remote angles, 38 and 64, go into the sum. The check exposes the slip: 142 + 78 = 220, not 180.',
        'For (b), find the third angle of the second triangle: 180 - 38 - 78 = 64. Its three angles are 38°, 78° and 64°, and triangle PQR has 38°, 64° and 78°. All three match.',
        'WRONG: saying the triangles are not similar because the second triangle\'s given angles, 38 and 78, do not match PQR\'s given angles, 38 and 64. CORRECT: the third angle is forced by the other two, so compute it before you judge. The order the angles are listed in does not matter, only whether the same three measures appear.',
        'Check: 38 + 64 + 78 = 180 for both triangles, and two matching angles, 38° and 78°, were already enough to know the third would match. The second triangle is similar to PQR by angle-angle.',
      ],
      answer: '(a) The exterior angle QRS is 102°, by 180 - 78 and by 38 + 64. (b) Yes, the second triangle is similar to triangle PQR, because its third angle is 64° and all three angles match',
      estimatedMinutes: 3,
    },
    {
      id: 'try-exterior-angle',
      kind: 'try_yourself',
      problem: 'In triangle ABC, angle A = 42° and angle B = 59°. Side AC is extended past C. What is the measure of the exterior angle at C?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '79°' },
        { id: 'b', text: '138°' },
        { id: 'c', text: '121°' },
        { id: 'd', text: '101°', correct: true },
      ],
      expectedAnswer: '101°',
      hints: [
        'The exterior angle at C equals the sum of the two remote interior angles, the two that do not touch C. Which two angles are those?',
        'Add 42 and 59. To check, find the interior angle at C from the 180° sum and confirm that it and your exterior angle add to 180.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-aa-similarity',
      kind: 'try_yourself',
      problem: 'Triangle 1 has angles measuring 50° and 70°. Which triangle must be similar to triangle 1?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A triangle with angles 50° and 62°' },
        { id: 'b', text: 'A triangle with angles 70° and 60°', correct: true },
        { id: 'c', text: 'A triangle with angles 50°, 70° and 65°' },
        { id: 'd', text: 'A triangle with angles 60° and 65°' },
      ],
      expectedAnswer: 'A triangle with angles 70° and 60°',
      hints: [
        'Start by finding the third angle of triangle 1 from the 180° sum. Then you know all three of its angles, not just the two you were given.',
        'Two matching angles are enough, but they must both match. For each choice, find its third angle, and make sure the three angles really add to 180 before you trust it. One matching angle proves nothing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-exterior-angle-equation',
      kind: 'try_yourself',
      problem:
        'In triangle DEF, side DF is extended past F to a point G. The exterior angle EFG measures (5x)°. The two remote interior angles measure 40° and (3x + 10)°. What is the measure of the exterior angle EFG, in degrees? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '125',
      hints: [
        'The exterior angle equals the sum of the two remote interior angles: 5x = 40 + (3x + 10). Collect the x terms on one side, the way you solve any equation with the variable on both sides.',
        '5x = 3x + 50, so 2x = 50 and x = 25. The question asks for the angle, not for x, so substitute back into 5x. Check that the two remote angles add to the same number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-adjacent-angle-and-given-angles-only',
      kind: 'misconception_check',
      question:
        'Triangle ABC has angle A = 35° and angle B = 85°, and side AC is extended past C. Student one says the exterior angle at C is 145°, because 180 - 35 = 145. Student two looks at a second triangle with angles 60° and 85° and says it cannot be similar to triangle ABC, because 60 is not 35. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The exterior angle at C is 145°.',
          misconception: 'Treating the exterior angle as supplementary to one REMOTE interior angle, when the only angle it shares a straight line with is the interior angle right next to it, at C.',
          correctsTo:
            'The exterior angle at C equals the sum of the two remote interior angles, A and B: 35 + 85 = 120°. Confirm it the other way: the interior angle at C is 180 - 35 - 85 = 60°, and 60 + 120 = 180, a straight line. The 35° angle at A is nowhere near that straight line, so 180 - 35 measures nothing in the picture.',
        },
        {
          answer: 'The second triangle is not similar, because 60 is not 35.',
          misconception: 'Comparing only the two GIVEN angles of each triangle and never computing the third, when two matching angles force the third to match and the order the angles are listed in does not matter.',
          correctsTo:
            'Find every third angle first. Triangle ABC has 35°, 85° and 180 - 35 - 85 = 60°. The second triangle has 60°, 85° and 180 - 60 - 85 = 35°. The same three measures, 35°, 60° and 85°, appear in both, so the triangles are similar. Two matching angles, 60° and 85°, were already enough to guarantee it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A line through one vertex parallel to the opposite side turns the other two angles into alternate interior copies at that vertex, and the three angles there fill a straight line. That is why every triangle\'s angles add to 180°.',
        'Two known angles force the third: subtract both from 180.',
        'An exterior angle sits on a straight line with the interior angle next to it, so the two add to 180°.',
        'An exterior angle equals the sum of the two REMOTE interior angles, the two that do not touch it. The angle next door is never part of that sum.',
        'Two matching angles force the third to match, so two matching angles are enough to say two triangles are similar (angle-angle). Compute the third angle before you judge; the listed order does not matter.',
        'To solve: name the fact, write the equation, solve for x, then substitute back to get the angle. Both exterior-angle routes must agree.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Triangle Angle Sum, Exterior Angles & AA Similarity' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
