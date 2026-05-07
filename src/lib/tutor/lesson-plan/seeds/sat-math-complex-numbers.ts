/**
 * SAT Math — Complex Numbers.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_COMPLEX_NUMBERS: LessonPlan = {
  id: 'evelyn.testprep.sat-math.complex-numbers.v1',
  title: 'SAT Math — Complex Numbers (Operations + i Powers)',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.complex-numbers', description: 'Apply complex number arithmetic and i powers on SAT.', standard: 'CCSS.MATH.HSN.CN' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 12,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Complex numbers are 1-2 SAT questions per test — easy points if you know the rules.', script: 'i² = −1. That\'s the magic. Plus standard arithmetic (treat i as a variable until you simplify with i² = −1). Today: the operations + key SAT tests.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'i, complex form, operations, conjugates, powers of i.', keyIdeas: [
      'IMAGINARY UNIT: i = √(−1). So i² = −1.',
      'COMPLEX NUMBER: a + bi where a, b are real. a is REAL part, b is IMAGINARY part.',
      'POWERS OF i (cycle every 4):',
      '  i¹ = i.',
      '  i² = −1.',
      '  i³ = −i.',
      '  i⁴ = 1.',
      '  i⁵ = i (back to start).',
      '  To find i^n: compute n mod 4. Use that to find which power.',
      'ADDITION/SUBTRACTION: combine real parts + imaginary parts separately.',
      '  (3 + 2i) + (4 − 5i) = 7 − 3i.',
      'MULTIPLICATION: distribute, then simplify i².',
      '  (2 + 3i)(1 + i) = 2 + 2i + 3i + 3i² = 2 + 5i + 3(−1) = −1 + 5i.',
      'COMPLEX CONJUGATE of a + bi is a − bi.',
      '  Used to RATIONALISE the denominator when dividing.',
      '  (a + bi)(a − bi) = a² + b² (always real, no i).',
      'DIVISION: multiply numerator and denominator by conjugate of denominator.',
      '  (3 + 2i)/(1 + i) = (3 + 2i)(1 − i) / [(1 + i)(1 − i)] = (3 − 3i + 2i − 2i²)/(1 + 1) = (3 − i + 2)/2 = (5 − i)/2.',
      'STANDARD FORM: a + bi (real part first).',
      '  After computation, simplify to this form.',
      'SAT TRICK: simplify by treating i as a variable (with i² = −1) and applying standard algebra. Don\'t overthink.',
    ], vocabulary: [{ term: 'imaginary unit', definition: 'i = √(−1); satisfies i² = −1.' }, { term: 'complex conjugate', definition: 'conjugate of a + bi is a − bi; product (a + bi)(a − bi) = a² + b² is always real.' }], estimatedMinutes: 4 },
    { id: 'worked', kind: 'worked_example', problem: 'Simplify (2 − 3i)(2 + 3i).', steps: [
      'These are conjugates: (a − bi)(a + bi) = a² + b².',
      'a = 2, b = 3.',
      'Result: 2² + 3² = 4 + 9 = 13.',
      'Notice: no i in result — conjugate product is always real.',
    ], answer: '13', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'What is i¹⁰⁰?', expectedAnswer: '100 mod 4 = 0. i⁰ = 1 (technically i^4 = 1 cycle). So i¹⁰⁰ = (i⁴)²⁵ = 1²⁵ = 1.', responseFormat: 'numeric', hints: ['Powers of i cycle every 4.', 'Compute n mod 4 to find which.'], estimatedMinutes: 2 },
    { id: 'misconception-i-rules', kind: 'misconception_check', question: 'A student writes i² = 1 (not −1). Why does this trip them up everywhere?', commonErrors: [{ answer: 'i² = 1', misconception: 'Confusing i² = −1 with regular squaring.', correctsTo: 'BY DEFINITION, i² = −1. This is what makes complex numbers different from real numbers. Forgetting this changes EVERY computation. Memorise i² = −1, then drill it. (1 + i)² = 1 + 2i + i² = 1 + 2i − 1 = 2i, not 2 + 2i. Always substitute −1 for i² when simplifying.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['i = √(−1). i² = −1.', 'Powers of i cycle every 4: i, −1, −i, 1.', 'Add/sub: combine real and imaginary parts.', 'Multiply: distribute, replace i² with −1.', 'Divide: multiply by conjugate of denominator.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
