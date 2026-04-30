/**
 * G11 — Complex numbers.
 *
 * i = √(-1). Complex form a + bi. Adding, subtracting, multiplying.
 * Why we need them — fundamental theorem of algebra hint.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_COMPLEX_NUMBERS: LessonPlan = {
  id: 'evelyn.g11.alg2.complex-numbers.v1',
  title: 'Complex numbers: a + bi',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'algebra-2',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsn-cn.a.1',
      description: 'Know there is a complex number i such that i² = -1, and every complex number has the form a + bi.',
      standard: 'CCSS.MATH.CONTENT.HSN.CN.A.1',
    },
    {
      id: 'ccss.math.hsn-cn.a.2',
      description: 'Use the relation i² = -1 and properties of operations to add, subtract, and multiply complex numbers.',
      standard: 'CCSS.MATH.CONTENT.HSN.CN.A.2',
    },
  ],
  prerequisites: ['ccss.math.hsa-rei.b.4'],
  followUps: ['ccss.math.hsn-cn.c.7'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose √(-1) as the moment math had to invent a new number.',
      script: 'What\'s the square root of -1? "Impossible" — that\'s what mathematicians said for centuries. Then they decided: fine, we\'ll just CALL it i. And out of that one trick fell an entire branch of math.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-i-and-form',
      kind: 'concept',
      goal: 'Introduce i, the standard form a + bi, and the basic operations.',
      keyIdeas: [
        'DEFINITION: i = √(-1), so i² = -1.',
        'Higher powers cycle: i¹ = i, i² = -1, i³ = -i, i⁴ = 1, then repeats.',
        'A COMPLEX NUMBER has the form a + bi where a and b are real. a is the REAL part, b is the IMAGINARY part.',
        'ADD/SUBTRACT: combine real with real, imaginary with imaginary. (3 + 2i) + (1 + 5i) = 4 + 7i.',
        'MULTIPLY: distribute (FOIL), then replace i² with -1. (1 + 2i)(3 + i) = 3 + i + 6i + 2i² = 3 + 7i - 2 = 1 + 7i.',
        'WHY WE NEED i: every quadratic equation has a solution in complex numbers — even ones with negative discriminant.',
      ],
      vocabulary: [
        { term: 'imaginary unit', definition: 'i, defined so that i² = -1.' },
        { term: 'complex number', definition: 'a number of the form a + bi where a, b are real.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-add',
      kind: 'worked_example',
      problem: 'Add (4 - 3i) + (-2 + 5i).',
      steps: [
        'Group real parts: 4 + (-2) = 2.',
        'Group imaginary parts: -3i + 5i = 2i.',
        'Combine: 2 + 2i.',
      ],
      answer: '2 + 2i',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-multiply',
      kind: 'worked_example',
      problem: 'Multiply (2 + 3i)(1 - 4i).',
      steps: [
        'FOIL: 2·1 + 2·(-4i) + 3i·1 + 3i·(-4i).',
        'Simplify: 2 - 8i + 3i - 12i².',
        'Replace i² with -1: 2 - 8i + 3i - 12(-1) = 2 - 8i + 3i + 12.',
        'Combine: (2 + 12) + (-8 + 3)i = 14 - 5i.',
      ],
      answer: '14 - 5i',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Multiply (3 + i)(3 - i).',
      expectedAnswer: '10',
      responseFormat: 'free',
      hints: [
        'FOIL it out: 9 - 3i + 3i - i².',
        'The middle terms cancel; replace i² with -1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-i-squared',
      kind: 'misconception_check',
      question: 'Is i² equal to 1, since "anything squared is positive"?',
      commonErrors: [
        {
          answer: '1',
          misconception: 'Applying real-number intuition to imaginary numbers.',
          correctsTo: 'No — i is DEFINED so that i² = -1. That\'s the whole point. The "anything squared is non-negative" rule only holds for real numbers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'i = √(-1), so i² = -1.',
        'Complex numbers have form a + bi.',
        'Add: combine like parts. Multiply: FOIL, then swap i² → -1.',
        'Powers of i cycle every 4: i, -1, -i, 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A complex CONJUGATE pair is a + bi and a - bi. What is (a + bi)(a - bi)? Why is the answer always real?',
      hint: 'Foil it: a² - (bi)² = a² - b²i² = a² + b². The i² flips the sign and the result is purely real.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
