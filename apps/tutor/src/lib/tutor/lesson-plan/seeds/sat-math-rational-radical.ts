/**
 * SAT Math — Rational Expressions and Radical Equations.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_RATIONAL_RADICAL: LessonPlan = {
  id: 'evelyn.testprep.sat-math.rational-radical.v1',
  title: 'SAT Math — Rational Expressions and Radical Equations',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.rational-radical', description: 'Simplify rational expressions, solve rational + radical equations, identify extraneous solutions on SAT.', standard: 'CCSS.MATH.HSA.REI.A.2' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Rational + radical equations have a HIDDEN TRAP — extraneous solutions. Always check.', script: 'Solving 1/(x − 2) = 3 or √(x + 4) = 5? Algebra works — but you can introduce solutions that don\'t actually work in the original equation. Today: the algebra + the check.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Simplify rational expressions, solve rational equations, solve radical equations, check for extraneous.', keyIdeas: [
      'RATIONAL EXPRESSION: a fraction with polynomial numerator + denominator. e.g., (x + 3)/(x − 2).',
      'SIMPLIFY by FACTORING and CANCELLING common factors.',
      '  (x² − 4)/(x + 2) = (x − 2)(x + 2)/(x + 2) = x − 2 (for x ≠ −2).',
      'DOMAIN of rational expression: exclude values that make denominator 0.',
      'ADDING / SUBTRACTING rational expressions: common denominator (LCD), then combine numerators.',
      'MULTIPLYING: multiply numerators × multiply denominators. Then simplify.',
      'DIVIDING: invert and multiply.',
      'RATIONAL EQUATION solving:',
      '  Multiply both sides by LCD to clear fractions.',
      '  Solve resulting polynomial equation.',
      '  CHECK: plug solutions back into ORIGINAL equation to ensure no division by 0.',
      'EXTRANEOUS SOLUTION: a candidate that satisfies the manipulated equation but NOT the original (because it makes a denominator 0). REJECT IT.',
      'RADICAL EQUATION solving:',
      '  Isolate the radical on one side.',
      '  Square BOTH sides to eliminate the radical.',
      '  Solve resulting (often quadratic) equation.',
      '  CHECK candidates in original — squaring can introduce extraneous.',
      'EXAMPLE: √(x + 6) = x. Square: x + 6 = x² → x² − x − 6 = 0 → (x − 3)(x + 2) = 0 → x = 3 or x = −2. Check: √(3 + 6) = 3 ✓. √(−2 + 6) = 2 ≠ −2 ✗. So x = −2 is EXTRANEOUS. Only solution: x = 3.',
      'SAT TRICK: every rational/radical equation question expects you to check for extraneous solutions. The "wrong" answers often include extraneous values.',
    ], vocabulary: [{ term: 'extraneous solution', definition: 'a candidate that satisfies a manipulated equation but not the original; must be rejected.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Solve: 1/(x − 3) + 2/x = 1.', steps: [
      'LCD = x(x − 3). Multiply both sides:',
      'x(x − 3) · [1/(x − 3) + 2/x] = x(x − 3) · 1.',
      'Distribute: x + 2(x − 3) = x(x − 3).',
      'Expand: x + 2x − 6 = x² − 3x.',
      '3x − 6 = x² − 3x.',
      '0 = x² − 6x + 6. Quadratic formula: x = (6 ± √(36 − 24))/2 = (6 ± √12)/2 = 3 ± √3.',
      'CHECK: both candidates ≠ 0 and ≠ 3. Both valid.',
      'Solutions: x = 3 + √3 and x = 3 − √3.',
    ], answer: 'x = 3 ± √3', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Solve: √(2x + 5) = x + 1.', expectedAnswer: 'Square both sides: 2x + 5 = (x + 1)² = x² + 2x + 1. → 5 = x² + 1 → x² = 4 → x = ±2. CHECK in original: x = 2: √9 = 3 = 2 + 1 ✓. x = −2: √1 = 1 = −2 + 1 = −1 ✗ (left side positive, right side negative). So x = −2 is EXTRANEOUS. Only solution: x = 2.', responseFormat: 'free', hints: ['Square both sides to eliminate radical.', 'CHECK each candidate in the original equation.'], estimatedMinutes: 3 },
    { id: 'misconception-skip-check', kind: 'misconception_check', question: 'A student solves a radical equation and reports both candidates. Why is this often wrong?', commonErrors: [{ answer: 'Reports both candidates', misconception: 'Forgetting that squaring can introduce extraneous solutions.', correctsTo: 'When you SQUARE both sides of an equation, you can ADD solutions that don\'t actually satisfy the original. Example: x = −3 squared gives x² = 9, with solutions ±3. But ±3 don\'t both satisfy x = −3 — only −3 does. CHECK every candidate in the ORIGINAL equation. Reject any that fail. SAT often gives both as answer choices to test this.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Rational eq: multiply by LCD, then solve.', 'Radical eq: isolate radical, square both sides.', 'CHECK candidates in original — reject extraneous.', 'Domain excludes division by 0 + sqrt of negative.', 'Squaring can introduce solutions that don\'t actually work.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
