/**
 * G5 — Order of operations (PEMDAS / GEMS).
 *
 * The hierarchy that decides what to compute first when an expression
 * mixes operations. Parentheses → Exponents → Multiplication / Division
 * (left-to-right) → Addition / Subtraction (left-to-right). Same-level
 * pairs are equally ranked — the LEFT-TO-RIGHT rule is what most
 * students miss.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_ORDER_OF_OPERATIONS: LessonPlan = {
  id: 'evelyn.g5.math.order-of-operations.v1',
  title: 'Order of Operations (PEMDAS)',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'expressions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.oa.a.1',
      description: 'Use parentheses, brackets, or braces in numerical expressions; evaluate using the standard order.',
      standard: 'CCSS.MATH.CONTENT.5.OA.A.1',
    },
  ],
  prerequisites: ['ccss.math.4.oa.a.3'],
  followUps: ['ccss.math.6.ee.a.2'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the SAME expression can give two different answers depending on what you do first.',
      script: '3 + 4 × 2. What is it? If you add first, you get 7 × 2 = 14. If you multiply first, you get 3 + 8 = 11. Same expression, two answers — that can\'t be right. Math needs ONE rule. That rule is the order of operations.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pemdas',
      kind: 'concept',
      goal: 'PEMDAS hierarchy with the critical "same-level → left-to-right" rule.',
      keyIdeas: [
        'PEMDAS = the order to compute things in. Top of the list goes first.',
        'P — Parentheses (and brackets and braces): everything inside, first.',
        'E — Exponents (and roots).',
        'M / D — Multiplication and Division: SAME LEVEL. Go left-to-right.',
        'A / S — Addition and Subtraction: SAME LEVEL. Go left-to-right.',
        'CRITICAL: M and D are TIED — neither beats the other. Same with A and S. Whichever appears LEFTMOST goes first.',
        'Example: 12 ÷ 4 × 3. Tempting to multiply first → 12 ÷ 12 = 1. WRONG. Left-to-right: 12 ÷ 4 = 3, then 3 × 3 = 9.',
        'Common phrase: "Please Excuse My Dear Aunt Sally."',
      ],
      vocabulary: [
        { term: 'expression', definition: 'a math phrase with numbers and operations, no equals sign.' },
        { term: 'parentheses', definition: 'the grouping symbols ( ) — what\'s inside is computed first.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mixed',
      kind: 'worked_example',
      problem: 'Compute  6 + 4 × (8 - 5)².',
      steps: [
        'Parentheses first: (8 - 5) = 3. Now: 6 + 4 × 3².',
        'Exponents next: 3² = 9. Now: 6 + 4 × 9.',
        'M/D next, left-to-right: 4 × 9 = 36. Now: 6 + 36.',
        'A/S last: 6 + 36 = 42.',
        'Answer: 42.',
      ],
      answer: '42',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-tied',
      kind: 'worked_example',
      problem: 'Compute  20 - 4 + 3.',
      steps: [
        'No parentheses, no exponents, no multiplication/division.',
        'A and S are tied — go left-to-right.',
        'Left first: 20 - 4 = 16.',
        'Next: 16 + 3 = 19.',
        'Answer: 19. (Sub-then-add gave 19. If you added first by mistake — 4+3=7, then 20-7=13 — you\'d get the wrong answer. Left-to-right is the tiebreaker.)',
      ],
      answer: '19',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute  2 × (3 + 5) - 4.',
      expectedAnswer: '12',
      responseFormat: 'numeric',
      hints: [
        'Parentheses first: (3 + 5) = 8.',
        'Then multiplication: 2 × 8 = 16.',
        'Then subtraction: 16 - 4 = 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-md-order',
      kind: 'misconception_check',
      question: 'Sami computes 24 ÷ 6 × 2 by doing the multiplication first: 24 ÷ 12 = 2. Right?',
      commonErrors: [
        {
          answer: 'yes — M comes before D in PEMDAS',
          misconception: 'Reading PEMDAS as a strict order where M always beats D.',
          correctsTo: 'Wrong. M and D are TIED — same level. The rule is left-to-right when they\'re tied. So 24 ÷ 6 = 4 first, then 4 × 2 = 8. Same goes for A and S.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Order: Parentheses → Exponents → ×/÷ → +/-.',
        '×/÷ are TIED. Left-to-right.',
        '+/- are TIED. Left-to-right.',
        'Parentheses ALWAYS first — the writer is telling you "do this part as one piece."',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute  100 - 2 × (5 + 3²).',
      hint: 'Inside parentheses first: 3² = 9, then 5 + 9 = 14. Now 100 - 2 × 14 = 100 - 28 = 72.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
