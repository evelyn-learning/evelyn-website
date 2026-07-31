/**
 * Geometry — Right Triangles & Trigonometry: Special Right Triangles.
 *
 * The two triangles worth memorizing (CCSS G-SRT.B.4, G-SRT.C.8): a square
 * cut on its diagonal gives 45-45-90 (x : x : x√2), an equilateral triangle
 * cut by an altitude gives 30-60-90 (x : x√3 : 2x). Both ratios are
 * Pythagorean consequences, so the shortcut always survives a check.
 * Numeric answers stay on integer setups; radical answers live in MCQ text.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U7_SPECIAL_RIGHT_TRIANGLES: LessonPlan = {
  id: 'evelyn.hs.geom.special-right-triangles.v1',
  title: 'Special Right Triangles: 45-45-90 & 30-60-90',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.special-right-triangles',
      standard: 'GEOM-7.2',
      description:
        'Derive and apply the side ratios of 45-45-90 and 30-60-90 triangles — x : x : x√2 and x : x√3 : 2x — to find missing side lengths from any one given side (CCSS G-SRT.B.4, G-SRT.C.8).',
    },
  ],
  prerequisites: ['geom.pythagorean-theorem'],
  followUps: ['geom.trig-ratios'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the two special triangles as the shapes design and construction actually run on — worth memorizing because they show up everywhere.',
      script:
        'Open any drafting kit and you will find exactly two plastic triangles: one 45-45-90 and one 30-60-90. Not three, not ten. Those two shapes fall out of the square and the equilateral triangle — the two figures architects, carpenters, and game designers build with constantly. Because their angles are fixed, their side ratios are fixed too. That means one measurement hands you the whole triangle instantly, with no calculator and no decimals. Today you learn both ratios and, more importantly, how to tell which side you were actually handed.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-special-ratios',
      kind: 'concept',
      goal: 'Where both ratios come from, how to run them in either direction, and the two errors that wreck them.',
      keyIdeas: [
        'WHERE THEY COME FROM — slice a square along its diagonal and you get two 45-45-90 triangles. Drop the altitude of an equilateral triangle and you get two 30-60-90 triangles. These are not new rules; they are the Pythagorean theorem applied once and remembered.',
        '45-45-90 RATIO — the two legs are equal, so leg : leg : hypotenuse = x : x : x√2. Hypotenuse = leg × √2, and leg = hypotenuse ÷ √2. Check it: x² + x² = 2x², and √(2x²) = x√2.',
        '30-60-90 RATIO — short leg : long leg : hypotenuse = x : x√3 : 2x. The SHORT leg is opposite the 30° angle, the LONG leg is opposite the 60° angle, and the hypotenuse is opposite the right angle — always exactly twice the short leg.',
        'SOLVE FOR x FIRST — every side of a 30-60-90 is written in terms of x, the short leg. Whatever side you are handed, set it equal to its expression, solve for x, then read the other two sides straight off the ratio. Never guess your way sideways between the legs.',
        'BIGGER ANGLE FACES BIGGER SIDE — a built-in sanity check. Since √3 is about 1.73, the 30-60-90 sides run x, 1.73x, 2x in order. In a 45-45-90 the hypotenuse is about 1.41 times a leg. If your "hypotenuse" came out shorter than a leg, you inverted a step.',
        'CLASSIC ERROR — WRONG LEG. Students assume the given leg is the short leg. If the leg sits opposite the 60° angle it is the LONG leg, so x = (given) ÷ √3 must come first. Read which angle the side faces before touching the ratio.',
        'CLASSIC ERROR — DOUBLING THE WRONG SIDE. The hypotenuse is 2× the SHORT leg only. Doubling the long leg is the single most common wrong answer in this lesson. And √2 belongs to 45-45-90 while √3 belongs to 30-60-90 — swapping them is the other half of the damage.',
        'RATIONALIZING — dividing by a radical leaves an ugly form, so multiply top and bottom by that radical: 9 ÷ √3 = 9√3 ÷ 3 = 3√3, and 10 ÷ √2 = 10√2 ÷ 2 = 5√2. Same value, standard form.',
      ],
      vocabulary: [
        {
          term: '45-45-90 triangle',
          definition: 'an isosceles right triangle — half of a square cut along its diagonal, with sides in ratio x : x : x√2.',
        },
        {
          term: '30-60-90 triangle',
          definition: 'half of an equilateral triangle cut by an altitude, with sides in ratio x : x√3 : 2x, the short leg opposite the 30° angle.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-square-brace',
      kind: 'worked_example',
      problem:
        'A square gate measures 4 feet on each side. A carpenter runs a diagonal brace from one corner to the opposite corner. How long is the brace, in exact form?',
      steps: [
        'The diagonal cuts the square into two right triangles. Each has two legs of 4 (the sides of the square) and the two acute angles are equal, so each is 45°: this is a 45-45-90 triangle.',
        'Match the ratio x : x : x√2 to the triangle — the legs are x, so x = 4.',
        'The hypotenuse is x√2, so the brace = 4√2 feet.',
        'Verify with the Pythagorean theorem: 4² + 4² = 16 + 16 = 32, and √32 = √(16 × 2) = 4√2. ✓ The shortcut and the theorem agree — the ratio is just the theorem, pre-solved.',
      ],
      answer: 'The brace is 4√2 feet (about 5.7 feet).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-long-leg-trap',
      kind: 'worked_example',
      problem:
        'In right triangle ABC the right angle is at C and ∠A = 60°. The leg BC = 9. A student answers "hypotenuse = 18." Find the correct hypotenuse AB and the leg AC, and explain the student error.',
      steps: [
        'Find all three angles: ∠C = 90°, ∠A = 60°, so ∠B = 30°. This is a 30-60-90 triangle with ratio x : x√3 : 2x.',
        'Identify which side you were handed. BC sits opposite ∠A = 60°, so BC is the LONG leg, not the short leg. The student assumed BC was the short leg and doubled it — that is where 18 came from.',
        'Solve for x using the long-leg expression: x√3 = 9, so x = 9 ÷ √3 = 9√3 ÷ 3 = 3√3. The short leg AC = 3√3.',
        'Read off the hypotenuse: AB = 2x = 6√3, which is about 10.4. Sanity check the ordering — short leg 3√3 (about 5.2) < long leg 9 < hypotenuse 6√3 (about 10.4). ✓',
      ],
      answer: 'AB = 6√3 and AC = 3√3. The 18 came from treating the long leg as the short leg.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-45-45-90-hypotenuse',
      kind: 'try_yourself',
      problem:
        'In right triangle ABC the right angle is at C and ∠A = 45°. Leg AC = 6. What is the length of the hypotenuse AB?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6√2', correct: true },
        { id: 'b', text: '12' },
        { id: 'c', text: '3√2' },
        { id: 'd', text: '6√3' },
      ],
      expectedAnswer: '6√2',
      hints: [
        'Both acute angles are 45°, so this is a 45-45-90 triangle — which ratio applies, x : x : x√2 or x : x√3 : 2x?',
        'The legs are x, so x = 6, and the hypotenuse is x√2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-30-60-90-long-leg',
      kind: 'try_yourself',
      problem:
        'In right triangle PQR the right angle is at R and ∠Q = 30°. The leg QR = 5√3. What is the length of the hypotenuse PQ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '10', correct: true },
        { id: 'b', text: '10√3' },
        { id: 'c', text: '15' },
        { id: 'd', text: '5√6' },
      ],
      expectedAnswer: '10',
      hints: [
        'Which angle does QR face? Angle P is 60°, so QR is the long leg — do not double it.',
        'Set x√3 = 5√3 to get x = 5, then the hypotenuse is 2x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In right triangle DEF the right angle is at F and ∠E = 60°. The hypotenuse DE = 18. Find the length of EF and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'The angles are 90°, 60°, and 30°, so ∠D = 30° and EF is the side opposite it — the short leg.',
        'The hypotenuse is 2x, so 2x = 18. Solve for the short leg x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-double-long-leg',
      kind: 'misconception_check',
      question:
        'A 30-60-90 triangle has the leg opposite its 60° angle equal to 6. A student says "the hypotenuse is twice a leg, so it is 12." What went wrong?',
      commonErrors: [
        {
          answer: 'The hypotenuse is 12',
          misconception:
            'Applying "hypotenuse = 2 × leg" to whichever leg was given, instead of only to the short leg opposite the 30° angle.',
          correctsTo:
            'Only the SHORT leg doubles. The given 6 faces the 60° angle, so it is the long leg: x√3 = 6 gives x = 6 ÷ √3 = 2√3, and the hypotenuse is 2x = 4√3 (about 6.9). Check the ordering — 12 would have been nearly double the long leg, which no 30-60-90 triangle allows.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '45-45-90: legs equal, x : x : x√2 — hypotenuse = leg × √2, leg = hypotenuse ÷ √2.',
        '30-60-90: x : x√3 : 2x — short leg opposite 30°, long leg opposite 60°, hypotenuse twice the SHORT leg.',
        'Always identify which angle the given side faces, solve for x first, then read off the other sides.',
        'Sanity check by size: side opposite 30° < side opposite 60° < hypotenuse, since √3 is about 1.73 and √2 about 1.41.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Special Right Triangles: 45-45-90 & 30-60-90' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
