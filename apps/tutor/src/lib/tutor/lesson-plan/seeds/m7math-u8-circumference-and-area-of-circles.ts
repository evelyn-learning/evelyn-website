/**
 * Grade 7 Math — Measurement: Circumference & Area of Circles.
 *
 * The two circle formulas and the one thing that separates them (CCSS
 * 7.G.B.4). C = πd = 2πr is a LENGTH in plain units; A = πr² is a surface in
 * square units. The defining error is dropping the diameter straight into
 * πr², which inflates the area by a factor of four, so that gets the
 * misconception check. π is taken as 3.14 throughout, and results that do not
 * terminate are rounded to two decimal places.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U8_CIRCUMFERENCE_AND_AREA_OF_CIRCLES: LessonPlan = {
  id: 'evelyn.ms.m7math.circumference-and-area-of-circles.v1',
  title: 'Circumference & Area of Circles',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.circumference-and-area-of-circles',
      standard: 'M7MATH-8.2',
      description:
        'Use the formulas C = πd = 2πr and A = πr² to find the circumference and area of a circle, and work backwards from a circumference to find the radius (CCSS 7.G.B.4).',
    },
  ],
  prerequisites: ['m7math.area-of-polygons'],
  followUps: ['m7math.surface-area-of-prisms-and-pyramids'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn the two circle formulas into a question about pizza that the student wants answered.',
      script:
        'A 12 inch pizza costs 10 dollars. A 14 inch pizza costs 13 dollars. Only two inches bigger, so that seems like a rip-off, right? It is not. The bigger pizza gives you about a third more pizza, because the crust around the edge grows a little while the cheese in the middle grows a lot. Those are two different measurements of the same circle: the distance around it, and the surface inside it. Today we learn a formula for each one, and we learn how to stop mixing them up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-circle-formulas',
      kind: 'concept',
      goal: 'Define radius, diameter and π, then separate circumference from area by what each one measures and what units it gets.',
      keyIdeas: [
        'RADIUS AND DIAMETER — the radius r runs from the center of the circle out to the edge. The diameter d runs all the way across, through the center, so it is exactly two radii: d = 2r, and r = d ÷ 2. Almost every circle mistake starts by mixing these two up, so name which one you have been given before you touch a formula.',
        'π IS ONE FIXED NUMBER — wrap a string around any circle and compare it to the distance across. The string is always about 3.14 times as long, for every circle that has ever existed. That ratio is π. We will use π ≈ 3.14 in this lesson, and because it is rounded, our answers are approximate too — use ≈ instead of = when you round, and give two decimal places when the answer does not stop on its own.',
        'CIRCUMFERENCE IS A DISTANCE AROUND — C = πd, and since d = 2r you can also write C = 2πr. Both give the same number. Circumference is a length, like the length of a piece of string, so it gets plain units: cm, m, in. Never square units.',
        'AREA IS THE SURFACE INSIDE — A = πr². The little 2 means r × r, so square the radius FIRST and then multiply by π. Area gets square units: cm², m², in². Circumference is the crust, area is the cheese.',
        'AREA ALWAYS WANTS THE RADIUS — the formula says r, and it means r. If the problem gives you a diameter, cut it in half before you square anything. Squaring the diameter instead makes your answer four times too big, which is the single most common circle error there is.',
        'YOU CAN RUN THE FORMULA BACKWARDS — if you know the circumference and want the radius, undo the multiplication: C = 2πr means r = C ÷ (2π), so divide by 6.28. A circumference of 62.8 ft gives r = 62.8 ÷ 6.28 = 10 ft. Check it by going forwards again.',
      ],
      vocabulary: [
        { term: 'radius', definition: 'the distance from the center of a circle to its edge; half the diameter.' },
        { term: 'diameter', definition: 'the distance straight across a circle through the center; twice the radius.' },
        { term: 'circumference', definition: 'the distance all the way around a circle, measured in plain units of length.' },
        { term: 'π', definition: 'the number you get when you divide any circle circumference by its diameter, about 3.14.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-diameter-to-both',
      kind: 'worked_example',
      problem: 'A round clock face has a diameter of 10 cm. Find its circumference and its area. Use π ≈ 3.14.',
      steps: [
        'Write down what you were given: d = 10 cm. That is the diameter, not the radius. Say it out loud so you do not forget it later.',
        'Circumference first, because C = πd takes the diameter exactly as it is: C ≈ 3.14 × 10 = 31.4 cm. Plain centimeters, because that is a distance around.',
        'Now switch to area, and area needs the radius. Halve the diameter: r = 10 ÷ 2 = 5 cm.',
        'Apply A = πr². Square the radius first: 5² = 5 × 5 = 25.',
        'Then multiply by π: A ≈ 3.14 × 25 = 78.5 cm². Square centimeters, because that is a surface.',
        'So C ≈ 31.4 cm and A ≈ 78.5 cm². WRONG answer to avoid: 3.14 × 10² = 314 cm², which comes from dropping the diameter into the area formula. RIGHT answer: 78.5 cm². That wrong answer is four times too big, every single time.',
      ],
      answer: 'C ≈ 31.4 cm and A ≈ 78.5 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-circumference-backwards',
      kind: 'worked_example',
      problem: 'A hula hoop has a circumference of 251.2 cm. How wide is it across, and how much floor does it enclose? Use π ≈ 3.14.',
      steps: [
        'This one is backwards: the distance around is known and the radius is missing. Start from C = 2πr and put the number in: 251.2 = 2 × 3.14 × r.',
        'Simplify the front: 2 × 3.14 = 6.28, so 251.2 = 6.28r.',
        'Undo the multiplication by dividing both sides by 6.28: r = 251.2 ÷ 6.28 = 40 cm.',
        'Check it forwards before going on: 6.28 × 40 = 251.2. That matches, so the radius is right.',
        'The width across is the diameter: d = 2r = 2 × 40 = 80 cm.',
        'For the floor inside, use A = πr². Square first: 40² = 1600. Then A ≈ 3.14 × 1600 = 5024 cm². So the hoop is 80 cm across and encloses about 5024 cm².',
      ],
      answer: 'r = 40 cm, d = 80 cm, and A ≈ 5024 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'try-area-from-diameter',
      kind: 'try_yourself',
      problem: 'A pizza has a diameter of 14 in. What is its area? Use π ≈ 3.14.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '615.44 in²' },
        { id: 'b', text: '153.86 in²', correct: true },
        { id: 'c', text: '43.96 in' },
        { id: 'd', text: '87.92 in' },
      ],
      expectedAnswer: '153.86 in²',
      hints: [
        'The area formula asks for the radius. You were handed the diameter, so fix that before anything else.',
        'r = 14 ÷ 2 = 7. Now square the 7 before you multiply by 3.14, and give the answer in square inches.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-circumference-from-radius',
      kind: 'try_yourself',
      problem: 'A round pond has a radius of 6 m. A fence will run all the way around the edge. How long must the fence be? Use π ≈ 3.14.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '18.84 m' },
        { id: 'b', text: '113.04 m²' },
        { id: 'c', text: '37.68 m', correct: true },
        { id: 'd', text: '75.36 m' },
      ],
      expectedAnswer: '37.68 m',
      hints: [
        'A fence around the edge is a distance around, so this is circumference, not area. The answer gets plain meters.',
        'You have the radius, so use C = 2πr: multiply 2 × 3.14 × 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-radius-from-circumference',
      kind: 'try_yourself',
      problem: 'A circular garden has a circumference of 62.8 ft. What is its radius, in feet? Use π ≈ 3.14. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '10',
      hints: [
        'Start from C = 2πr and put the 62.8 where the C goes.',
        '2 × 3.14 = 6.28, so 62.8 = 6.28r. Divide both sides by 6.28.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diameter-in-area',
      kind: 'misconception_check',
      question: 'A circle has a diameter of 12 cm. A student writes A = 3.14 × 12² = 452.16 cm². What went wrong?',
      commonErrors: [
        {
          answer: '452.16 cm²',
          misconception: 'Dropping whatever number the problem printed straight into A = πr², without checking whether that number is the radius or the diameter.',
          correctsTo: 'The formula A = πr² wants the RADIUS. Here 12 cm is the diameter, so halve it first: r = 12 ÷ 2 = 6 cm. Then 6² = 36, and A ≈ 3.14 × 36 = 113.04 cm². Notice 452.16 is exactly four times 113.04 — using the diameter always multiplies your area by four, because squaring a doubled number quadruples it. Circle the word diameter or radius in the problem before you start.',
        },
        {
          answer: '37.68 cm²',
          misconception: 'Reading r² as 2r and doubling the radius instead of squaring it.',
          correctsTo: 'The exponent 2 means the radius times itself, not the radius times 2. With r = 6 that is 6 × 6 = 36, not 6 × 2 = 12. So A ≈ 3.14 × 36 = 113.04 cm², not 3.14 × 12 = 37.68. Write out r × r the long way whenever the little 2 tempts you.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The diameter is twice the radius: d = 2r, and r = d ÷ 2. Name which one you have before choosing a formula.',
        'Circumference is the distance around: C = πd = 2πr, and it gets plain units like cm or ft.',
        'Area is the surface inside: A = πr², and it gets square units like cm² or in².',
        'Area needs the RADIUS. Squaring the diameter by mistake makes the answer four times too big.',
        'Working backwards from a circumference: r = C ÷ (2π), so divide by 6.28 when π ≈ 3.14.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Circumference & Area of Circles' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
