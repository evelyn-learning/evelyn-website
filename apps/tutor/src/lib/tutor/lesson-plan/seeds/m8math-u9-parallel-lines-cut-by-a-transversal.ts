/**
 * Grade 8 Math — Angles & the Pythagorean Theorem: Parallel Lines Cut by a
 * Transversal.
 *
 * CONCEPT-LED. The student arrives owning vertical angles and straight-line
 * (supplementary) pairs at a single crossing; what is new is a SECOND
 * crossing, made by the same transversal through a parallel line, and the
 * fact that the eight angles it produces are locked to each other
 * (CCSS 8.G.A.5). The mental model built here is the slide: translate the
 * first crossing along the transversal until it lands on the second, and
 * because the lines are parallel it lands exactly, so every angle lands on
 * its corresponding angle with the same measure. Everything else follows in
 * one extra hop — alternate interior and alternate exterior angles are equal
 * by corresponding-then-vertical, and same-side interior angles add to 180°
 * by corresponding-then-straight-line. The four pair names are taught by
 * position (which crossing, inside or outside, which side of the
 * transversal), and the lesson ends where the Grade 7 angle lesson ended:
 * name the relationship, write the equation, solve, substitute back. The
 * error this plan is built to kill is reading a same-side interior pair as
 * equal because "parallel means equal".
 *
 * SCOPE GUARD: Grade 8 row 9.1 identifies corresponding, alternate interior,
 * alternate exterior and same-side interior angle pairs, argues informally
 * (a translation along the transversal, Unit 8) why corresponding and
 * alternate interior angles are equal, and solves for unknown angles.
 * Assumes vertical/supplementary angles from
 * `m7math-u7-angle-relationships.ts`. Withholds: theorem-level justification
 * with named reasons and the converses (proving lines parallel) ->
 * `geom-u3-parallel-lines-transversals.ts`,
 * `geom-u3-proving-lines-parallel.ts`. Concretely: every problem in this plan
 * STATES that its two lines are parallel, and the plan never runs the other
 * direction — it never concludes that two lines are parallel from an angle
 * pair. The "why" is always the slide plus a vertical pair or a straight
 * line, told in plain words; no step cites a postulate or theorem by name as
 * a reason, and nothing is written as a proof. Naming which pair two angles
 * form IS in scope (it is the identification skill of the row), so an item
 * may ask for the pair name or a choice may state it; what is withheld is
 * the reason-chain justification. Sideways: the parallel-line facts are
 * never used to argue the triangle angle sum or an exterior angle (row 9.2).
 * Below, used and not re-taught: vertical angles are equal and angles on a
 * straight line add to 180° (recalled in a clause each), the
 * name-the-relationship-then-write-the-equation routine, and the algebra
 * that finishes each solve (a two-step equation, or one with the variable on
 * both sides, which is row 4.1 and Grade 7 ground). Also allowed and why: the
 * slide argument recalls in one sentence that a translation keeps every
 * angle measure, which row 8.1 already verified; that recall is the whole of
 * what this plan borrows from Unit 8.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U9_PARALLEL_LINES_CUT_BY_A_TRANSVERSAL: LessonPlan = {
  id: 'evelyn.ms.m8math.parallel-lines-cut-by-a-transversal.v1',
  title: 'Parallel Lines Cut by a Transversal',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.parallel-lines-cut-by-a-transversal',
      standard: 'M8MATH-9.1',
      description:
        'Identify corresponding, alternate interior, alternate exterior and same-side interior angle pairs, argue informally (a translation along the transversal) why corresponding and alternate interior angles are equal, and solve for unknown angles (CCSS 8.G.A.5).',
    },
  ],
  prerequisites: ['m8math.dilations-and-similarity'],
  followUps: ['m8math.triangle-angle-sum-exterior-angles-and-aa-similarity'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put eight angles in front of the student and make the one-measurement promise feel real before any pair is named.',
      script:
        'Behind the school, two streets run side by side, perfectly parallel, and the bike path cuts across both of them at a slant. Where the path crosses the first street, four angles form. Where it crosses the second street, four more. Eight angles, and here is the promise: measure ONE of them at the first street and you can call out all eight without a protractor. The reason is a move you already own. Slide the first crossing along the bike path until it lands on the second crossing. Because the streets are parallel, it lands perfectly, angle for angle. Today you learn the four names for the angle pairs that slide gives you, why each pair is equal or adds to 180°, and how to solve for an angle nobody labeled.',
      suggestedTools: ['show_geometry_constructed'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-eight-angles-two-sizes',
      kind: 'concept',
      goal: 'Set up the eight-angle picture, name the four pairs by position, give the slide argument for corresponding angles, and derive the other three pairs from it in one hop each.',
      keyIdeas: [
        'THE SETUP IS TWO CROSSINGS, EIGHT ANGLES — a transversal is a line that cuts across two other lines. It makes four angles at each crossing, eight in all. The four angles that sit BETWEEN the two lines are interior; the four that sit outside are exterior. To talk about them, number the angles 1 to 4 around the top crossing (upper-left, upper-right, lower-left, lower-right) and 5 to 8 the same way around the bottom crossing. So 3, 4, 5 and 6 are interior, and 1, 2, 7 and 8 are exterior.',
        'NAME A PAIR BY POSITION — CORRESPONDING angles sit in the same spot at each crossing, so 1 and 5 are both upper-left, and 4 and 8 are both lower-right. ALTERNATE INTERIOR angles are both interior and on opposite sides of the transversal: 3 and 6, or 4 and 5. ALTERNATE EXTERIOR angles are both exterior and on opposite sides: 1 and 8, or 2 and 7. SAME-SIDE INTERIOR angles are both interior and on the same side of the transversal: 3 and 5, or 4 and 6. Ask two questions and the name falls out: inside or outside, and same side or opposite sides.',
        'WHY CORRESPONDING ANGLES ARE EQUAL: THE SLIDE — take the whole top crossing and translate it straight down the transversal until the top line lands on the bottom line. Because the two lines are parallel, the top line lands exactly on top of the bottom line, and the transversal slides along itself, so the top crossing lands exactly on the bottom crossing. A translation keeps every angle measure, which you already verified when you slid figures on the coordinate plane. So angle 1 lands on angle 5 with the same measure, angle 2 on angle 6, angle 3 on angle 7, and angle 4 on angle 8. Corresponding angles are equal, and the slide is the reason. If the lines were not parallel, the slide would miss, and the pairs would promise nothing.',
        'ALTERNATE ANGLES ARE EQUAL IN TWO HOPS — start at angle 3. Hop to its corresponding angle: 3 = 7. Now hop across the bottom crossing to the vertical angle: 7 = 6, because vertical angles are equal. So 3 = 6, and those two are alternate interior angles. The same two hops work outside: 1 = 5 by the slide, then 5 = 8 across the X, so 1 = 8, and those are alternate exterior angles. Every "alternate" pair is equal, and the reason is always the slide plus a vertical pair.',
        'SAME-SIDE INTERIOR ANGLES ADD TO 180°, THEY ARE NOT EQUAL — start at angle 3 again and hop to its corresponding angle: 3 = 7. But 7 and 5 sit next to each other on the bottom line, a straight line, so 5 + 7 = 180. Swap the 7 for the 3 it equals and you get 3 + 5 = 180. That is the only pair on the list that ADDS instead of matches, and "parallel" does not mean "equal" for it. If angle 3 is 110°, angle 5 is 70°.',
        'ONLY TWO SIZES, THEN THE EQUATION MOVE — put the pieces together and all eight angles are one of two numbers that add to 180°: four copies of the small one and four copies of the big one. If the transversal happens to cross square, all eight are 90°. That is your check on any answer. To find an unknown angle, do what you did with vertical and straight-line pairs: name the pair, write its equation (equal pairs give expression = expression, a same-side interior pair gives expression + expression = 180), solve, then put the value back in to get the angle.',
      ],
      vocabulary: [
        { term: 'transversal', definition: 'a line that cuts across two other lines, making four angles at each crossing.' },
        { term: 'interior angles', definition: 'the four angles that sit between the two lines the transversal crosses.' },
        { term: 'exterior angles', definition: 'the four angles that sit outside the two lines the transversal crosses.' },
        { term: 'corresponding angles', definition: 'two angles in the same position at the two crossings, such as both upper-left; equal when the lines are parallel.' },
        { term: 'alternate interior angles', definition: 'two interior angles on opposite sides of the transversal; equal when the lines are parallel.' },
        { term: 'same-side interior angles', definition: 'two interior angles on the same side of the transversal; they add to 180° when the lines are parallel.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fill-all-eight',
      kind: 'worked_example',
      problem:
        'Lines m and n are parallel and are cut by transversal t. Number the angles 1 to 4 around the top crossing (upper-left, upper-right, lower-left, lower-right) and 5 to 8 the same way around the bottom crossing. Angle 2 measures 115°. Find all seven other angles.',
      steps: [
        'Start at the top crossing, where you already know the rules. Angle 3 is directly across the X from angle 2, so it is a vertical angle and equals 115°. Angles 1 and 4 each sit on a straight line with angle 2, so each is 180 - 115 = 65°.',
        'Now slide the top crossing down the transversal onto the bottom crossing. Every angle lands on its corresponding angle with the same measure: angle 6 corresponds to angle 2, so angle 6 = 115°; angle 5 corresponds to angle 1, so angle 5 = 65°; angle 7 corresponds to angle 3, so angle 7 = 115°; angle 8 corresponds to angle 4, so angle 8 = 65°.',
        'Read the pairs back off the finished picture. Alternate interior: angles 3 and 6 are both 115°, and angles 4 and 5 are both 65°, equal as promised. Alternate exterior: angles 1 and 8 are both 65°, and angles 2 and 7 are both 115°.',
        'Same-side interior: angles 3 and 5 are 115° and 65°, and 115 + 65 = 180. Angles 4 and 6 are 65° and 115°, and 65 + 115 = 180. They add, they do not match.',
        'Check with the two-sizes rule. Only 115° and 65° appear, four of each, and 115 + 65 = 180. All eight together: 4 × 115 + 4 × 65 = 460 + 260 = 720, which is two full turns of 360°, one at each crossing.',
      ],
      answer: 'Angles 3, 6 and 7 are 115°; angles 1, 4, 5 and 8 are 65°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-side-equation',
      kind: 'worked_example',
      problem:
        'Lines p and q are parallel and are cut by transversal t, with the angles numbered 1 to 8 as before. Angle 4 measures (3x + 10)° and angle 6 measures (2x + 20)°. Find x and the measure of each angle.',
      steps: [
        'Name the pair first. Angle 4 is lower-right at the top crossing, and angle 6 is upper-right at the bottom crossing. Both are between the lines, so both are interior, and both are on the right of the transversal, so they are on the SAME side. Angles 4 and 6 are same-side interior angles.',
        'WRONG: calling 4 and 6 alternate interior because both are interior, and writing 3x + 10 = 2x + 20, which gives x = 10 and two angles of 40°. CORRECT: "alternate" needs opposite sides of the transversal, and these two are on the same side. Same-side interior angles add to 180°, so the equation is (3x + 10) + (2x + 20) = 180. The wrong answer fails its own check: two same-side interior angles of 40° and 40° add to 80, not 180.',
        'Combine like terms on the left: 3x + 2x = 5x and 10 + 20 = 30, so 5x + 30 = 180.',
        'Clear the constant first: subtract 30 from both sides, 5x = 150. Then divide both sides by 5: x = 30.',
        'The question asks for angles, so substitute x = 30 back in. Angle 4 = 3(30) + 10 = 90 + 10 = 100°. Angle 6 = 2(30) + 20 = 60 + 20 = 80°.',
        'Check: 100 + 80 = 180, so the same-side interior pair adds to 180° as it must, and the two-sizes rule says every angle in the picture is either 100° or 80°.',
      ],
      answer: 'x = 30; angle 4 = 100° and angle 6 = 80°',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-pair',
      kind: 'try_yourself',
      problem:
        'Two parallel lines are cut by a transversal, with the angles numbered 1 to 4 around the top crossing (upper-left, upper-right, lower-left, lower-right) and 5 to 8 the same way around the bottom crossing. Which name describes the pair angle 4 and angle 5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Corresponding angles' },
        { id: 'b', text: 'Same-side interior angles' },
        { id: 'c', text: 'Alternate interior angles', correct: true },
        { id: 'd', text: 'Alternate exterior angles' },
      ],
      expectedAnswer: 'Alternate interior angles',
      hints: [
        'Ask the two questions. Are both angles between the lines or outside them? Are they on the same side of the transversal or on opposite sides?',
        'Angle 4 is lower-right at the top crossing and angle 5 is upper-left at the bottom crossing. Both are between the lines, and one is on the right of the transversal while the other is on the left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-side-measure',
      kind: 'try_yourself',
      problem:
        'Lines m and n are parallel and are cut by transversal t, with the angles numbered 1 to 8 as in the lesson. Angle 3 measures 124°. Which statement about angle 5 is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Angle 5 is 56°, because angles 3 and 5 are same-side interior angles and add to 180°', correct: true },
        { id: 'b', text: 'Angle 5 is 124°, because angles 3 and 5 are same-side interior angles and are equal' },
        { id: 'c', text: 'Angle 5 is 124°, because angles 3 and 5 are alternate interior angles and are equal' },
        { id: 'd', text: 'Angle 5 is 56°, because angles 3 and 5 are corresponding angles, which add to 180°' },
      ],
      expectedAnswer: 'Angle 5 is 56°, because angles 3 and 5 are same-side interior angles and add to 180°',
      hints: [
        'Locate both angles. Angle 3 is lower-left at the top crossing and angle 5 is upper-left at the bottom crossing. Both are between the lines, and both are on the left of the transversal.',
        'Same side of the transversal means this is the one pair that ADDS instead of matches. Slide angle 3 down to angle 7, then remember that 7 and 5 sit on a straight line.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-corresponding-equation',
      kind: 'try_yourself',
      problem:
        'Lines a and b are parallel and are cut by transversal t, with the angles numbered 1 to 8 as in the lesson. Angle 4 measures (5x - 20)° and angle 8 measures (3x + 30)°. What is the measure of angle 8, in degrees? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '105',
      hints: [
        'Angles 4 and 8 are both lower-right, one at each crossing, so name the pair first and decide whether the equation says equal or adds to 180.',
        'Corresponding angles are equal: 5x - 20 = 3x + 30. Collect the x terms on one side, solve for x, then substitute back into 3x + 30 to get the angle, not just x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parallel-means-equal',
      kind: 'misconception_check',
      question:
        'Lines m and n are parallel and are cut by transversal t, with the angles numbered 1 to 8 as in the lesson. Angle 3 measures 70°. One student says angle 5 is 70° because the lines are parallel. Another student says angle 7 is 110° because angle 3 and angle 7 are at different crossings, so they must add to 180°. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Angle 5 is 70°.',
          misconception: 'Reading a same-side interior pair as equal, because "parallel" gets shortened to "equal" for every pair in the picture.',
          correctsTo:
            'Angles 3 and 5 are both interior and both on the left of the transversal, so they are same-side interior angles, the one pair that adds to 180° instead of matching. Run the two hops: 3 = 7 by the slide, and 7 + 5 = 180 because 7 and 5 sit on the straight line n, so 3 + 5 = 180 and angle 5 = 180 - 70 = 110°. Parallel lines make corresponding and alternate pairs equal; they make same-side interior pairs supplementary.',
        },
        {
          answer: 'Angle 7 is 110°.',
          misconception: 'Treating corresponding angles as a straight-line pair that adds to 180°, because they sit at different crossings.',
          correctsTo:
            'Angles 3 and 7 are both lower-left, one at each crossing, so they are corresponding angles. Slide the top crossing down the transversal: because m and n are parallel, angle 3 lands exactly on angle 7, and a translation keeps the measure, so angle 7 = 70°. The 180° rule belongs to two angles side by side on one straight line, and angles 3 and 7 are not on one straight line together. The two-sizes check settles it: every angle here is 70° or 110°, and angle 7 is one of the 70° ones.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A transversal cutting two lines makes eight angles, four at each crossing. Interior angles sit between the two lines; exterior angles sit outside.',
        'Name a pair with two questions: inside or outside, and same side or opposite sides of the transversal. Corresponding angles share a position at the two crossings.',
        'When the lines are parallel, corresponding angles are equal, because sliding one crossing along the transversal lands it exactly on the other, and a slide keeps every angle measure.',
        'Alternate interior and alternate exterior angles are equal: hop to the corresponding angle, then across the X to the vertical angle.',
        'Same-side interior angles add to 180°. They are the one pair that adds instead of matches.',
        'With parallel lines, all eight angles are one of two sizes that add to 180°. To solve, name the pair, write equal or add to 180, solve, then substitute back to get the angle.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Parallel Lines Cut by a Transversal' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
