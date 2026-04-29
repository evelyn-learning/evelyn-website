/**
 * G7 — Integer operations (all four ops with negatives).
 *
 * Builds on G6 integer intro. The full set of rules: + and - on
 * integers via "same sign add, different signs subtract"; × and ÷
 * via the "two negatives make a positive" sign rule. Connects each
 * rule to a real-world context (debt, temperature) so the rules
 * aren't pure memorization.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_INTEGER_OPERATIONS: LessonPlan = {
  id: 'evelyn.g7.math.integer-operations.v1',
  title: 'Operations with Integers',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'integers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ns.a.1',
      description: 'Apply properties of operations to add and subtract rational numbers.',
      standard: 'CCSS.MATH.CONTENT.7.NS.A.1',
    },
    {
      id: 'ccss.math.7.ns.a.2',
      description: 'Apply properties of operations to multiply and divide rational numbers.',
      standard: 'CCSS.MATH.CONTENT.7.NS.A.2',
    },
  ],
  prerequisites: ['ccss.math.6.ns.c.5'],
  followUps: ['ccss.math.7.ee.b.4'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame negatives as "owing" — a context where signs have real meaning.',
      script: 'You owe your sister $5 (write that as -5). She forgives the debt — that\'s subtracting -5, which is the same as adding +5. Suddenly you\'re $5 better off. Negatives aren\'t a math trick; they\'re a way to track direction.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-add-sub-rules',
      kind: 'concept',
      goal: 'Same-sign add, different-sign subtract — and "subtract a negative" = "add the positive".',
      keyIdeas: [
        'ADDING with the SAME SIGN: add the absolute values, keep the sign. -3 + (-7) = -(3+7) = -10. 3 + 7 = 10.',
        'ADDING with DIFFERENT SIGNS: subtract the smaller absolute value from the bigger; keep the sign of the bigger. -8 + 3 = -(8-3) = -5. -2 + 9 = +(9-2) = 7.',
        'SUBTRACTING: rewrite as adding the opposite. a - b = a + (-b). 5 - 8 = 5 + (-8) = -3. 4 - (-6) = 4 + 6 = 10.',
        'Always rewrite subtraction first, then apply the addition rules.',
      ],
      vocabulary: [],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-mult-div-rules',
      kind: 'concept',
      goal: 'Sign rules for multiplication and division: like signs → positive, unlike signs → negative.',
      keyIdeas: [
        'MULTIPLY / DIVIDE — sign rules:',
        '  positive × positive = positive  (4 × 3 = 12)',
        '  negative × negative = positive  (-4 × -3 = 12) — two negatives make a positive',
        '  positive × negative = negative  (4 × -3 = -12)',
        '  negative × positive = negative  (-4 × 3 = -12)',
        'Same rules apply to division.',
        'Why does negative × negative = positive? Think of "removing 4 debts of $3 each" — you\'re $12 better off (positive).',
        'Quick rule: count the negatives. EVEN number of negatives → positive result. ODD number → negative result.',
      ],
      vocabulary: [],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-mixed',
      kind: 'worked_example',
      problem: 'Compute -6 + 9 - (-4) × (-2).',
      steps: [
        'PEMDAS: multiplication first. (-4) × (-2): two negatives → positive. 4 × 2 = 8. So -4 × -2 = +8.',
        'Now: -6 + 9 - 8.',
        'Left to right: -6 + 9 = 3.',
        'Then 3 - 8 = -5.',
        'Answer: -5.',
      ],
      answer: '-5',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute -12 ÷ (-3) + 2 × (-5).',
      expectedAnswer: '-6',
      responseFormat: 'numeric',
      hints: [
        'Division first (left of multiplication, but same priority — left to right): -12 ÷ -3 = 4.',
        'Multiplication: 2 × -5 = -10.',
        'Add: 4 + (-10) = -6.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-two-minuses',
      kind: 'misconception_check',
      question: 'Liu sees "-(-7)" and writes -7. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reading two negatives as one negative without applying the rule.',
          correctsTo: 'No. -(-7) means "the opposite of -7", which is +7. Two negatives cancel. The same logic that makes -3 × -2 = +6 makes -(-7) = +7.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '+/- with same sign: add absolute values, keep sign.',
        '+/- with different signs: subtract, keep sign of the bigger absolute value.',
        '"Subtract" = "add the opposite."',
        '×/÷ with like signs → positive. With unlike signs → negative.',
        'Two negatives in a row cancel. -(-7) = 7. (-3)(-2) = 6.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute (-2)³.',
      hint: '(-2)³ = -2 × -2 × -2. (-2 × -2) = 4 (two negatives cancel). 4 × -2 = -8. Three negatives → negative result.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
