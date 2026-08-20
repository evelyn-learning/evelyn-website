/**
 * Grade 7 Math — Geometry: Conditions That Determine a Triangle.
 *
 * When can a triangle exist at all (CCSS 7.G.A.2)? The triangle inequality is
 * the gate: the sum of any two sides must EXCEED the third, and all three
 * pairs have to be tested, not just the convenient one. Equal is not enough —
 * the shape collapses flat. Angle sum 180° is the second gate, and the lesson
 * closes by sorting side and angle sets into unique, many, or none.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U7_TRIANGLE_SIDE_AND_ANGLE_CONDITIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.triangle-side-and-angle-conditions.v1',
  title: 'Conditions That Determine a Triangle',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.triangle-side-and-angle-conditions',
      standard: 'M7MATH-7.2',
      description:
        'Use the triangle inequality and the 180° angle sum to decide whether a given set of side lengths or angle measures determines exactly one triangle, more than one triangle, or no triangle at all (CCSS 7.G.A.2).',
    },
  ],
  prerequisites: ['m7math.angle-relationships'],
  followUps: ['m7math.scale-drawings'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that some side lengths simply refuse to close into a triangle.',
      script:
        'Grab three drinking straws and cut them to 4 inches, 9 inches, and 13 inches. Now try to lay them down into a triangle. You cannot. Put the 4 and the 9 end to end and they stretch exactly 13 inches, which lays perfectly flat along the long straw with nothing left over to lift into a corner. No matter how you turn them, no triangle. Some sets of lengths build a triangle and some do not, and there is a rule that tells you which is which before you ever pick up a straw. Today you learn that rule, plus the one about angles.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-triangle-conditions',
      kind: 'concept',
      goal: 'The triangle inequality tested on all three pairs, the 180° angle sum, and what pins down exactly one triangle.',
      keyIdeas: [
        'THE TRIANGLE INEQUALITY — the sum of any two sides must be GREATER than the third side. Not equal to it. Greater than it. Think of it as walking: going from one corner to another the long way around, along two sides, has to be a longer trip than cutting straight across the third side.',
        'TEST ALL THREE PAIRS — with sides a, b, and c you have three checks to run: a + b compared to c, a + c compared to b, and b + c compared to a. Most students test one pair, see it pass, and stop. That is exactly how a bad set of lengths sneaks through. Run all three, every time.',
        'THE SHORTCUT, AND WHY IT WORKS — if the two SHORTEST sides add up to more than the longest side, the other two checks are guaranteed to pass, because each of them already has the longest side on the winning team. So the shortcut is legal, but you have to find the longest side first.',
        'EQUAL IS NOT ENOUGH — with 4, 9, and 13 the check is 4 + 9 = 13, which is not greater than 13. The two short sides lie flat along the long one and the shape has zero height. Flat is not a triangle. The rule uses "greater than" for a reason.',
        'THE ANGLE SUM IS ALWAYS 180° — the three angles inside any triangle add to 180°, no exceptions. So 42° and 65° force the third angle to be 180 − 42 − 65 = 73°. Angle measures that add to anything other than 180° describe no triangle at all.',
        'ONE TRIANGLE, MANY, OR NONE — three side lengths that pass the inequality build exactly ONE triangle; the shape is locked and cannot flex. Three ANGLES that add to 180° build MANY triangles: same shape, any size you like, like a photo printed small or poster-sized. And side lengths that fail the inequality, or angles that do not total 180°, build NONE.',
      ],
      vocabulary: [
        { term: 'triangle inequality', definition: 'the rule that the sum of any two sides of a triangle must be greater than the third side.' },
        { term: 'angle sum', definition: 'the total of the three inside angles of a triangle, which is always 180°.' },
        { term: 'unique triangle', definition: 'a set of conditions that can be built in exactly one way, with no choices left over.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-inequality-all-three',
      kind: 'worked_example',
      problem: 'Can side lengths of 4 cm, 9 cm, and 13 cm form a triangle? Then list every whole-number length that COULD be the third side with 4 cm and 9 cm.',
      steps: [
        'Run all three checks, not one. Check one: 4 + 9 = 13. Compare that to the third side, 13. Is 13 greater than 13? No. It is equal, and equal fails.',
        'Keep going so you can see how a careless student gets fooled. Check two: 4 + 13 = 17, which IS greater than 9. Passes. Check three: 9 + 13 = 22, which IS greater than 4. Passes.',
        'Two checks passed and one failed. One failure is enough to kill it. The answer is NO, 4, 9, and 13 cannot form a triangle. A student who only ran checks two and three would have said yes and been wrong.',
        'Now the second question. Call the third side x. It has to beat both other checks. From 4 + x > 9 we get x > 5. From 4 + 9 > x we get x < 13.',
        'So x must sit strictly between 5 and 13, with both ends left out: 5 < x < 13. Notice the ends are the difference 9 − 4 = 5 and the sum 9 + 4 = 13.',
        'List the whole numbers strictly inside that gap: 6, 7, 8, 9, 10, 11, 12. Spot-check the smallest one: sides 4, 6, 9 give 4 + 6 = 10 > 9. Passes.',
      ],
      answer: 'No, 4, 9, and 13 cannot form a triangle. With sides 4 and 9 the third side can be 6, 7, 8, 9, 10, 11, or 12.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-angle-sum-and-how-many',
      kind: 'worked_example',
      problem: 'A triangle has angles of 42° and 65°. Find the third angle. Then decide: do those three angle measures describe exactly one triangle, more than one, or none?',
      steps: [
        'Write what you know as an equation. Call the missing angle x. The three angles add to 180°, so 42 + 65 + x = 180.',
        'Add the two known angles: 42 + 65 = 107. The equation becomes 107 + x = 180.',
        'Subtract 107 from both sides: x = 73. The third angle is 73°.',
        'Check by adding all three back up: 42 + 65 + 73 = 180. Correct.',
        'Now the second question. Sketch a triangle with those angles small enough to fit on a sticky note. Now sketch the same three angles big enough to fill a poster. Both are real triangles, and the angles never changed.',
        'So three angles that add to 180° give MORE THAN ONE triangle. They lock in the SHAPE but not the SIZE. To pin down exactly one triangle you need at least one side length in the mix.',
      ],
      answer: 'The third angle is 73°, and those three angles describe more than one triangle — many different sizes, all the same shape.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-set-works',
      kind: 'try_yourself',
      problem: 'Which set of side lengths can form a triangle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3, 4, 8' },
        { id: 'b', text: '5, 5, 11' },
        { id: 'c', text: '6, 8, 13', correct: true },
        { id: 'd', text: '2, 6, 8' },
      ],
      expectedAnswer: '6, 8, 13',
      hints: [
        'For each set, find the longest side first, then add the other two together.',
        'The two shorter sides must add to MORE than the longest side. Exactly equal does not count.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-third-angle',
      kind: 'try_yourself',
      problem: 'Two angles of a triangle measure 55° and 80°. What is the third angle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '135°' },
        { id: 'b', text: '45°', correct: true },
        { id: 'c', text: '25°' },
        { id: 'd', text: '35°' },
      ],
      expectedAnswer: '45°',
      hints: [
        'The three angles of any triangle add to 180°. Write that as an equation with x for the missing angle.',
        'Add the two you were given, then subtract that total from 180.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-largest-third-side',
      kind: 'try_yourself',
      problem: 'Two sides of a triangle are 7 inches and 10 inches. What is the largest whole-number length the third side can be? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '16',
      hints: [
        'The third side has to be shorter than the two known sides added together, and it cannot be equal to that sum.',
        '7 + 10 = 17, so the third side must be less than 17. What is the largest whole number that is still less than 17?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-tested-one-pair',
      kind: 'misconception_check',
      question:
        'A student says that 5 cm, 5 cm, and 10 cm form a triangle, because 5 + 10 = 15 and 15 is greater than 5. What went wrong?',
      commonErrors: [
        {
          answer: 'Yes, 5, 5, and 10 form a triangle',
          misconception: 'Testing only one pair of sides. The pair the student picked happened to pass, so they stopped before reaching the pair that fails.',
          correctsTo:
            'There are three checks, and every one of them has to pass. Check one: 5 + 10 = 15 > 5, passes. Check two: 5 + 10 = 15 > 5, passes again. Check three, the one that got skipped: 5 + 5 = 10, and the third side is 10. Is 10 greater than 10? No. That check FAILS, so the answer is no triangle. Faster route: find the longest side first, which is 10, then test the two shortest against it. That is the check that actually decides it.',
        },
        {
          answer: 'Yes, because 5 + 5 lands exactly on 10',
          misconception: 'Reading "greater than" as "greater than or equal to" and accepting a sum that ties the third side.',
          correctsTo:
            'Landing exactly on the third side means the two short sides lie flat along the long one with nothing left over to lift into a corner. The shape has zero height, so it is a line segment, not a triangle. The sum must EXCEED the third side. If the two shorter sides were 5 and 5.1, then 5 + 5.1 = 10.1 > 10 and you would get a very thin but real triangle.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The sum of any two sides must be GREATER than the third side. Equal to it is a fail.',
        'Test all three pairs, or find the longest side and test the two shortest against it.',
        'The three angles of a triangle always add to 180°, so two angles force the third.',
        'Three side lengths that pass the inequality build exactly ONE triangle.',
        'Three angles that add to 180° build MANY triangles — same shape, different sizes. Lengths that fail, or angles that do not total 180°, build none.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Conditions That Determine a Triangle' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
