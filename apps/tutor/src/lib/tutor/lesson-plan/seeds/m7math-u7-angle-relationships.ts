/**
 * Grade 7 Math — Geometry: Angle Relationships.
 *
 * Where algebra meets shapes (CCSS 7.G.B.5). The named pairs come first —
 * complementary, supplementary, adjacent, vertical — but the real grade-7
 * skill is turning a picture into an EQUATION and solving it for an unknown
 * angle. The two mirror-image slips this plan is built to kill are setting a
 * supplementary pair equal to each other and adding a vertical pair to 180°.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U7_ANGLE_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.ms.m7math.angle-relationships.v1',
  title: 'Angle Relationships',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.angle-relationships',
      standard: 'M7MATH-7.1',
      description:
        'Use complementary, supplementary, adjacent, and vertical angle relationships to write and solve a simple equation for an unknown angle in a figure (CCSS 7.G.B.5).',
    },
  ],
  prerequisites: ['m7math.solving-and-graphing-inequalities'],
  followUps: ['m7math.triangle-side-and-angle-conditions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one known angle in a figure forces all the others, so the student wants the rules.',
      script:
        'Open a pair of scissors halfway and look at the X the blades make. There are four angles sitting around that center point. Here is the strange part: if I tell you just ONE of them, you can tell me the other three without measuring anything. The angles are locked to each other. Today you learn the handful of rules that do the locking, and then you learn the real grade seven move — turning a picture into an equation and solving it for an angle nobody labeled.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-relationships',
      kind: 'concept',
      goal: 'The four named relationships, and the four-step routine for turning a figure into an equation.',
      keyIdeas: [
        'ANGLES ARE MEASURED IN DEGREES — a square corner is 90°, a straight line is 180°, and a full spin is 360°. Those three numbers are the only totals you need in this whole lesson, so keep them close.',
        'COMPLEMENTARY MEANS 90°, SUPPLEMENTARY MEANS 180° — two angles are complementary when their measures add to 90°, and supplementary when they add to 180°. This is only about the NUMBERS. The two angles can be touching, or they can sit on opposite sides of the page. C comes before S in the alphabet, and 90 comes before 180.',
        'ADJACENT ANGLES SHARE A VERTEX AND A SIDE — they sit right next to each other like two slices of the same pizza, sharing a corner point and one edge, with no overlap. When two adjacent angles together make a straight line, they must add to 180°. That is the picture that hands you a supplementary equation for free.',
        'VERTICAL ANGLES ARE EQUAL — when two straight lines cross they make an X, and the two angles that sit directly across from each other are vertical angles. Vertical angles always have the SAME measure. They are never added to 180°. That is the neighbor angle next door, not the one across the X.',
        'ONE ANGLE UNLOCKS FOUR — at any crossing the four angles read around the X as x, 180° − x, x, 180° − x. Two copies of the small one and two copies of the big one, and all four together add to 360°. If one angle is 70°, the four are 70°, 110°, 70°, 110°.',
        'THE EQUATION MOVE — this is the part that matters most. Step one, name the relationship out loud. Step two, write its equation: equal angles give expression = expression, and a supplementary pair gives expression + expression = 180. Step three, solve for x. Step four, put x back in to get the ANGLE, because the question almost always asks for the angle, not for x.',
      ],
      vocabulary: [
        { term: 'complementary angles', definition: 'two angles whose measures add to 90°.' },
        { term: 'supplementary angles', definition: 'two angles whose measures add to 180°.' },
        { term: 'adjacent angles', definition: 'two angles that share a vertex and a side and do not overlap.' },
        { term: 'vertical angles', definition: 'the two angles directly across from each other where two lines cross; they are always equal.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-one-angle-unlocks-four',
      kind: 'worked_example',
      problem: 'Two straight lines cross at point P. One of the four angles measures 62°. Find the other three.',
      steps: [
        'Picture the X. Label the known 62° angle at the top. Going clockwise, call the others the right angle-space, the bottom, and the left.',
        'The angle directly across the X from the 62° one is a vertical angle, so it is also 62°. No arithmetic needed — vertical angles are equal.',
        'The angle right next to the 62° one sits with it on a straight line, so the two are supplementary: 180° − 62° = 118°.',
        'The last angle is vertical to that 118° one, so it is 118° too.',
        'Check the total. All four should circle back to a full spin: 62 + 118 + 62 + 118 = 360. That works, and the answers come in two matching pairs, which is exactly what an X should give.',
      ],
      answer: 'The other three angles are 62°, 118°, and 118°.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-supplementary-equation',
      kind: 'worked_example',
      problem: 'Angle P and angle Q are supplementary. The measure of angle P is (2x + 10)° and the measure of angle Q is (3x − 5)°. Find x and the measure of each angle.',
      steps: [
        'Name the relationship first: supplementary. That means the two measures ADD to 180. It does NOT mean they are equal. WRONG equation to avoid: 2x + 10 = 3x − 5. RIGHT equation: (2x + 10) + (3x − 5) = 180.',
        'Combine the like terms on the left. The x terms are 2x and 3x, which give 5x. The plain numbers are +10 and −5, which give +5. So the equation is 5x + 5 = 180.',
        'Undo the +5 by subtracting 5 from both sides: 5x = 175.',
        'Undo the times 5 by dividing both sides by 5: x = 35.',
        'The question asks for ANGLES, so put 35 back in. Angle P is 2(35) + 10 = 70 + 10 = 80°. Angle Q is 3(35) − 5 = 105 − 5 = 100°.',
        'Check by adding: 80 + 100 = 180. Supplementary, just as the problem said. The work holds up.',
      ],
      answer: 'x = 35, angle P = 80° and angle Q = 100°',
      estimatedMinutes: 3,
    },
    {
      id: 'try-complementary',
      kind: 'try_yourself',
      problem: 'Angle A and angle B are complementary. Angle A measures 34°. What is the measure of angle B?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '146°' },
        { id: 'b', text: '56°', correct: true },
        { id: 'c', text: '34°' },
        { id: 'd', text: '66°' },
      ],
      expectedAnswer: '56°',
      hints: [
        'Complementary or supplementary? Decide which total you need before you subtract anything.',
        'Complementary angles add to 90°, so the missing angle is 90 − 34.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-straight-line-equation',
      kind: 'try_yourself',
      problem: 'Two adjacent angles together form a straight line. One measures (x + 25)° and the other measures (4x)°. What is the value of x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 41' },
        { id: 'b', text: 'x = 13' },
        { id: 'c', text: 'x = 31', correct: true },
        { id: 'd', text: 'x = 36' },
      ],
      expectedAnswer: 'x = 31',
      hints: [
        'Two angles that together make a straight line are supplementary. Write the sum equation before you touch any numbers.',
        'The equation is (x + 25) + 4x = 180, so 5x + 25 = 180. Subtract the 25 first, then divide.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-linear-pair',
      kind: 'try_yourself',
      problem: 'Two straight lines cross. One of the four angles measures 137°. What is the measure, in degrees, of the angle right next to it? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '43',
      hints: [
        'The angle next door sits on the same straight line as the 137° angle. What do two angles on a straight line add up to?',
        'They are supplementary, so subtract: 180 − 137.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vertical-angles-add-to-180',
      kind: 'misconception_check',
      question:
        'Two lines cross. The two angles directly across the X from each other measure (5x)° and (3x + 24)°. A student writes 5x + (3x + 24) = 180 and gets x = 19.5. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 19.5',
          misconception: 'Using the supplementary equation for a pair of VERTICAL angles. The 180° rule belongs to the angle next door on the straight line, not to the angle across the X.',
          correctsTo:
            'Angles directly across the X from each other are vertical angles, and vertical angles are EQUAL. So the right equation sets the two expressions equal: 5x = 3x + 24. Subtract 3x from both sides to get 2x = 24, so x = 12. Now find the angles: 5(12) = 60° and 3(12) + 24 = 36 + 24 = 60°. Both are 60°, which is exactly what equal means. Name the relationship first, and the equation writes itself.',
        },
        {
          answer: 'Both angles must be 90°',
          misconception: 'Hearing "supplementary" and assuming the two angles have to be the same size, so each takes half of 180°.',
          correctsTo:
            'Supplementary only says the two measures ADD to 180°. It says nothing about them being equal. 130° and 50° are supplementary. So are 179° and 1°. Two supplementary angles are both 90° only in the special case where the lines cross square, and that has to be given, never guessed from how the picture looks.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Complementary angles add to 90°. Supplementary angles add to 180°.',
        'Two adjacent angles that form a straight line are supplementary, so they add to 180°.',
        'Vertical angles sit across the X from each other and are always EQUAL. Never add them to 180°.',
        'To find an unknown angle, name the relationship, write the equation, solve for x, then substitute back.',
        'Equal angles give expression = expression. A supplementary pair gives expression + expression = 180.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Angle Relationships' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
