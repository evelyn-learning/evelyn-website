/**
 * G7 — Two-step equations.
 *
 * Builds directly on one-step. Form: ax + b = c. Order matters:
 * undo addition / subtraction FIRST, then undo multiplication /
 * division. Reverse PEMDAS. Once they get this rhythm, equation
 * solving generalizes to anything.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_TWO_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.g7.math.two-step-equations.v1',
  title: 'Solving Two-Step Equations',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'equations',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ee.b.4.a',
      description: 'Solve word problems leading to equations of the form px + q = r.',
      standard: 'CCSS.MATH.CONTENT.7.EE.B.4.A',
    },
  ],
  prerequisites: ['ccss.math.6.ee.b.7'],
  followUps: ['ccss.math.8.ee.c.7'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Build a real-world equation that takes two undo-steps.',
      script: 'You buy 3 movie tickets and a $5 popcorn. Your total is $32. How much was each ticket? You\'d set it up as 3x + 5 = 32, where x is the ticket price. Now there are TWO things wrapped around x — a multiplication AND an addition. We have to undo both, in the right order.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-undo-order',
      kind: 'concept',
      goal: 'Undo + and - first, then × and ÷ — reverse PEMDAS.',
      keyIdeas: [
        'A two-step equation has TWO operations wrapped around the variable.',
        'Standard form: ax + b = c (multiplication AND addition).',
        'Order to undo: REVERSE PEMDAS. Undo + and - first, THEN undo × and ÷.',
        'Why reverse order? Imagine putting on socks then shoes. To undo, take off shoes (last on, first off), then socks. Same with equations.',
        '3x + 5 = 32. The +5 was the LAST thing done to x. Undo it first: subtract 5 from both sides → 3x = 27.',
        'Now undo the ×3: divide both sides by 3 → x = 9.',
        'CHECK by substituting: 3(9) + 5 = 27 + 5 = 32. ✓',
      ],
      vocabulary: [],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-tickets',
      kind: 'worked_example',
      problem: 'Solve 3x + 5 = 32.',
      steps: [
        'Two operations on x: × 3 and + 5. Undo + 5 first.',
        'Subtract 5 from both sides: 3x + 5 - 5 = 32 - 5.',
        '3x = 27.',
        'Now undo × 3: divide both sides by 3: x = 27 / 3 = 9.',
        'Check: 3(9) + 5 = 27 + 5 = 32. ✓',
      ],
      answer: '9',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-negative',
      kind: 'worked_example',
      problem: 'Solve 2x - 7 = 11.',
      steps: [
        'Undo - 7 first by adding 7 to both sides: 2x - 7 + 7 = 11 + 7.',
        '2x = 18.',
        'Undo × 2: divide both sides by 2: x = 9.',
        'Check: 2(9) - 7 = 18 - 7 = 11. ✓',
      ],
      answer: '9',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve 5x + 3 = 28.',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: [
        'First undo the + 3: subtract 3 from both sides.',
        'Then undo the × 5: divide both sides by 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divide-first',
      kind: 'misconception_check',
      question: 'Eli solves 4x + 8 = 24 by dividing by 4 first, getting "x + 8 = 6 → x = -2". Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Dividing by the coefficient too early — it works ONLY if you also divide the +8 term, which Eli forgot.',
          correctsTo: 'Wrong answer (real answer is x = 4). If you divide the WHOLE side by 4 first, you must divide every term: (4x + 8)/4 = 24/4 → x + 2 = 6 → x = 4. The standard rule "subtract first, divide second" avoids this trap entirely.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two-step: undo + and - FIRST, then × and ÷.',
        'Reverse PEMDAS — undo in opposite order to how operations would be applied.',
        'Same op to BOTH sides every step.',
        'Always check by substituting back.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve x/3 - 4 = 2.',
      hint: 'Add 4 to both sides: x/3 = 6. Multiply both sides by 3: x = 18.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
