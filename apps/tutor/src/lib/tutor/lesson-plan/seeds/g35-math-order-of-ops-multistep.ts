/**
 * Grades 3-5 Math — Order of Operations: Multi-Step Expressions.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_MATH_ORDER_OF_OPS_MULTISTEP: LessonPlan = {
  id: 'evelyn.g35.math.order-of-ops-multistep.v1',
  title: 'Order of Operations — Multi-Step Expressions',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'order-of-operations',
  locale: 'en',
  los: [{ id: 'g35.math.order-of-ops-multistep', description: 'Evaluate multi-step expressions with parentheses, exponents, and mixed operations correctly.', standard: 'CCSS.MATH.CONTENT.5.OA.A.1' }],
  prerequisites: ['g35.math.order-of-operations'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Once you know PEMDAS, you can evaluate ANY expression — but the trick is staying disciplined.', script: 'Big multi-step expressions look scary. The cure: do ONE step at a time, in PEMDAS order, rewriting the expression each time. Today we drill that discipline.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'PEMDAS reminder, nested parentheses, working systematically.', keyIdeas: [
      'PEMDAS order: Parentheses, Exponents, Multiplication/Division (left-to-right), Addition/Subtraction (left-to-right).',
      'NESTED PARENTHESES: work from the INNERMOST out.',
      '  Example: 2 × (3 + (4 × 2)) → first do 4 × 2 = 8 → then 3 + 8 = 11 → then 2 × 11 = 22.',
      'WRITE OUT EACH STEP. Don\'t try to do too much in your head. Mistakes happen when you skip steps.',
      'M and D are SAME priority: do them left-to-right as encountered. Same for A and S.',
      'CHECK YOUR WORK: re-evaluate the original expression to confirm.',
      'Common errors:',
      '  Doing multiplication ALL before division (wrong — they\'re same priority).',
      '  Skipping parentheses (always do them first!).',
      '  Forgetting an exponent.',
    ], vocabulary: [{ term: 'nested parentheses', definition: 'parentheses inside other parentheses; work from innermost to outermost.' }], estimatedMinutes: 4 },
    { id: 'worked', kind: 'worked_example', problem: 'Evaluate: 8 + 3 × (12 − 7)² ÷ 5', steps: [
      'P: parentheses (12 − 7) = 5. Expression: 8 + 3 × 5² ÷ 5.',
      'E: exponents 5² = 25. Expression: 8 + 3 × 25 ÷ 5.',
      'M and D, left to right. 3 × 25 = 75. Expression: 8 + 75 ÷ 5.',
      'Continue M/D: 75 ÷ 5 = 15. Expression: 8 + 15.',
      'A: 8 + 15 = 23. ✓',
    ], answer: '23', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Evaluate: (6 + 4) × 2 − 3²', expectedAnswer: 'P: (6+4) = 10. → 10 × 2 − 3². E: 3² = 9. → 10 × 2 − 9. M: 10 × 2 = 20. → 20 − 9. S: 11. Answer: 11.', responseFormat: 'numeric', hints: ['Parens first, then exponents, then multiplication, then subtraction.', 'Rewrite the expression after each step.'], estimatedMinutes: 3 },
    { id: 'misconception-mult-before-div', kind: 'misconception_check', question: 'A student evaluates 12 ÷ 4 × 3 by doing all M before D, getting 12 ÷ 12 = 1. What\'s the right answer?', commonErrors: [{ answer: '12 ÷ (4 × 3) = 1', misconception: 'Treating multiplication as higher priority than division.', correctsTo: 'M and D are SAME priority. Do them left-to-right. 12 ÷ 4 = 3 first, THEN 3 × 3 = 9. The right answer is 9, not 1. Memorise: when M and D are mixed, ALWAYS go left to right.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Order: P, E, M/D (left-to-right), A/S (left-to-right).', 'Nested parens: innermost first.', 'Rewrite the expression after each step.', 'M and D have SAME priority — left-to-right.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
