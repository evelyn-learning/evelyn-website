/**
 * Grades 3-5 Math — Order of Operations (PEMDAS / GEMS).
 */

import type { LessonPlan } from '../types';

export const SEED_G35_MATH_ORDER_OF_OPERATIONS: LessonPlan = {
  id: 'evelyn.g35.math.order-of-operations.v1',
  title: 'Grades 3-5 Math — Order of Operations',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'order-of-operations',
  locale: 'en',
  los: [
    {
      id: 'g35.math.order-of-operations',
      description: 'Evaluate numerical expressions using the conventional order of operations (parentheses, exponents, multiplication/division, addition/subtraction).',
      standard: 'CCSS.MATH.CONTENT.5.OA.A.1',
    },
  ],
  prerequisites: ['g35.math.multiplication-division'],
  followUps: ['g68.math.expressions-equations'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Without an agreed order, the same expression gives different answers — which is no good.',
      script: 'Try this: 2 + 3 × 4. If you do it left to right, you get 5 × 4 = 20. If you multiply first, you get 2 + 12 = 14. Two different answers from the same problem! That\'s why mathematicians agreed on a rule called the order of operations. Today we learn it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pemdas',
      kind: 'concept',
      goal: 'PEMDAS / GEMS, left-to-right tie-breaks, common pitfalls.',
      keyIdeas: [
        'PEMDAS (or GEMS) gives the order: Parentheses, Exponents, Multiplication and Division, Addition and Subtraction.',
        'STEP 1 — PARENTHESES first: anything inside ( ) gets evaluated as if it\'s its own little problem.',
        'STEP 2 — EXPONENTS next: powers like 3² or 2³.',
        'STEP 3 — MULTIPLICATION AND DIVISION: SAME priority. Do them left to right as you meet them.',
        'STEP 4 — ADDITION AND SUBTRACTION: SAME priority. Do them left to right as you meet them.',
        'KEY MISCONCEPTION: PEMDAS does NOT mean "all multiplication, then all division." It means M and D are at the same level. So 12 ÷ 4 × 2 is (12 ÷ 4) × 2 = 3 × 2 = 6 — left to right.',
        'Same for A and S: 10 − 3 + 2 is (10 − 3) + 2 = 7 + 2 = 9, NOT 10 − (3 + 2) = 5.',
        'When you see nested parentheses, work from the INSIDE out: ((2 + 3) × 4) → first do 2 + 3 = 5, then 5 × 4 = 20.',
      ],
      vocabulary: [
        { term: 'expression', definition: 'a combination of numbers and operations like 3 + 4 × 2. Expressions evaluate to a single value.' },
        { term: 'parentheses', definition: 'the brackets ( ) that group operations and tell us to evaluate inside first.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pemdas',
      kind: 'worked_example',
      problem: 'Evaluate: 4 + 3 × (8 − 5)² ÷ 9',
      steps: [
        'P first: (8 − 5) = 3. Expression becomes: 4 + 3 × 3² ÷ 9.',
        'E next: 3² = 9. Expression becomes: 4 + 3 × 9 ÷ 9.',
        'M and D, left to right: 3 × 9 = 27. Expression: 4 + 27 ÷ 9.',
        'Continue M and D: 27 ÷ 9 = 3. Expression: 4 + 3.',
        'A: 4 + 3 = 7.',
        'Final answer: 7.',
      ],
      answer: '7',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate: 20 − 2 × (1 + 3)',
      expectedAnswer: '12',
      responseFormat: 'numeric',
      hints: [
        'Parentheses first: (1 + 3) = ?',
        'Then multiplication before subtraction: 2 × your-answer = ?',
        'Finally subtract from 20.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-md-priority',
      kind: 'misconception_check',
      question: 'A student evaluates 12 ÷ 4 × 3 by doing all the multiplication first and gets 12 ÷ 12 = 1. What did they do wrong?',
      commonErrors: [
        {
          answer: '12 ÷ 12 = 1',
          misconception: 'Believing PEMDAS means "do multiplication before division."',
          correctsTo: 'Multiplication and division have the SAME priority — you do them left to right as you encounter them. So 12 ÷ 4 × 3: first you meet ÷, do 12 ÷ 4 = 3. Then you meet ×, do 3 × 3 = 9. The correct answer is 9, not 1. Same rule for addition and subtraction. The PEMDAS letters don\'t encode strict separate orders for M-then-D or A-then-S.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Order: P, E, MD (left to right), AS (left to right).',
        'Parentheses first, working inside out for nested ones.',
        'M and D are equal-priority; same for A and S.',
        'Without an agreed order, expressions are ambiguous.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
