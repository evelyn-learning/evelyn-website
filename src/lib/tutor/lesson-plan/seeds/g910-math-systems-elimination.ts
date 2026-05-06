/**
 * Grades 9-10 Math — Systems of Equations: Elimination Method.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_SYSTEMS_ELIMINATION: LessonPlan = {
  id: 'evelyn.g910.math.systems.elimination.v1',
  title: 'Systems of Equations — Elimination Method',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'systems-of-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.systems.elimination',
      description: 'Solve systems of linear equations by adding/subtracting equations to eliminate a variable.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.C.5',
    },
  ],
  prerequisites: ['g910.math.systems.substitution'],
  followUps: ['g910.math.systems.word-problems'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Elimination is fast when neither equation is solved for a variable — most word problems.',
      script: 'When both equations look like 3x + 2y = 7 and 5x − 2y = 1, substitution is awkward (you\'d have fractions). But notice: the y-terms are +2y and −2y. Add the equations together — y vanishes! Elimination is the move when the coefficients align (or can be made to align).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-elimination',
      kind: 'concept',
      goal: 'Aligning coefficients, eliminating, when to scale equations, special cases.',
      keyIdeas: [
        'IF a variable\'s coefficients in the two equations are EQUAL AND OPPOSITE (e.g. +2y and −2y), ADDING the equations eliminates that variable.',
        'IF the coefficients are EQUAL (e.g. +3x and +3x), SUBTRACTING eliminates.',
        'IF neither match, MULTIPLY one or both equations by constants to make coefficients line up. Example: to eliminate y from 2x + 3y = 8 and 5x + 2y = 11, multiply eq 1 by 2 and eq 2 by 3 to get 4x + 6y = 16 and 15x + 6y = 33; subtract.',
        'PROCEDURE:',
        '  1. Identify which variable is easier to eliminate.',
        '  2. Multiply equation(s) so that variable\'s coefficients are equal-and-opposite or equal.',
        '  3. Add or subtract to eliminate.',
        '  4. Solve the resulting one-variable equation.',
        '  5. Back-substitute into either ORIGINAL equation to find the other variable.',
        'WHY YOU CAN ADD EQUATIONS: equal quantities added to equal quantities give equal quantities. If A = B and C = D, then A + C = B + D. Multiplying both sides of an equation by a constant preserves the equation.',
        'NO SOLUTION: elimination leads to a false statement (e.g. 0 = 5). Lines are parallel.',
        'INFINITELY MANY SOLUTIONS: elimination leads to 0 = 0. Same line.',
      ],
      vocabulary: [
        { term: 'elimination method', definition: 'a procedure for solving a system by combining the equations (after scaling) so that one variable cancels.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve by elimination: 3x + 2y = 16 and 2x − 3y = −11.',
      steps: [
        'Pick variable to eliminate: y. Coefficients are 2 and −3. LCM is 6.',
        'Multiply eq 1 by 3: 9x + 6y = 48.',
        'Multiply eq 2 by 2: 4x − 6y = −22.',
        'ADD: 13x = 26 ⟹ x = 2.',
        'Back-substitute into original eq 1: 3(2) + 2y = 16 ⟹ 2y = 10 ⟹ y = 5.',
        'Solution (2, 5). Verify in eq 2: 2(2) − 3(5) = 4 − 15 = −11 ✓.',
      ],
      answer: '(x, y) = (2, 5)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve by elimination: 4x + y = 14 and 2x − 3y = 0.',
      expectedAnswer: 'Multiply eq 1 by 3: 12x + 3y = 42. Add to eq 2: 14x = 42 ⟹ x = 3. Back-sub: 4(3) + y = 14 ⟹ y = 2. Solution (3, 2). Check eq 2: 2(3) − 3(2) = 0 ✓.',
      responseFormat: 'free',
      hints: [
        'The y-coefficients are 1 and −3. Multiply eq 1 by 3 to make them +3 and −3.',
        'Then add the equations to eliminate y.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-multiply-one-side',
      kind: 'misconception_check',
      question: 'A student multiplies the LEFT side of an equation by 3 but forgets to multiply the right side. What happens?',
      commonErrors: [
        {
          answer: 'Multiplies only one side',
          misconception: 'Forgetting that scaling an equation requires scaling BOTH sides.',
          correctsTo: 'An equation is a balance: LHS = RHS. Multiplying only one side breaks the equality. 2x + y = 5 multiplied by 3 must become 6x + 3y = 15 (BOTH sides scaled). Doing 6x + 3y = 5 produces a different (incorrect) equation. After every elimination scaling, double-check that both sides got the same multiplier.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pick the easier variable to eliminate.',
        'Scale equations so that variable\'s coefficients are equal (subtract) or opposite (add).',
        'Multiply BOTH sides when scaling — never one side only.',
        'Back-substitute into an ORIGINAL equation, not a scaled one.',
        'Verify in BOTH original equations.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
