/**
 * Grades 9-10 Math — Systems of Equations: Substitution Method.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_SYSTEMS_SUBSTITUTION: LessonPlan = {
  id: 'evelyn.g910.math.systems.substitution.v1',
  title: 'Systems of Equations — Substitution Method',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'systems-of-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.systems.substitution',
      description: 'Solve a system of two linear equations using the substitution method.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.C.6',
    },
  ],
  prerequisites: ['g9.math.algebra.systems-linear'],
  followUps: ['g910.math.systems.elimination'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Substitution turns a 2-variable problem into a 1-variable problem.',
      script: 'A system of two equations has two unknowns. The substitution trick: solve one equation for one variable, then plug that into the OTHER equation. Now you have one equation in one unknown — easy. Then back-substitute to find the second.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-substitution',
      kind: 'concept',
      goal: 'When to use substitution, the procedure, sanity-checking solutions.',
      keyIdeas: [
        'A SOLUTION to a system is an (x, y) pair that satisfies BOTH equations simultaneously. Geometrically: the intersection of the two lines.',
        'SUBSTITUTION method, four steps:',
        '  1. SOLVE one equation for one variable (pick the easiest — usually one with a coefficient of 1).',
        '  2. SUBSTITUTE that expression into the OTHER equation.',
        '  3. SOLVE for the remaining variable.',
        '  4. BACK-SUBSTITUTE to find the other variable.',
        'BEST FOR: systems where one equation is already solved for a variable, or where solving for one is easy (coefficient ±1).',
        'CHECK by plugging your (x, y) into BOTH original equations. Both should be true.',
        'NO SOLUTION: substitution leads to a false statement like 5 = 7. Geometrically the lines are parallel.',
        'INFINITELY MANY SOLUTIONS: substitution leads to a true statement like 0 = 0. The two equations represent the same line.',
      ],
      vocabulary: [
        { term: 'system of equations', definition: 'two or more equations considered together; a solution must satisfy all of them simultaneously.' },
        { term: 'back-substitution', definition: 'plugging a found value back into one of the original equations to recover the other variable.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve by substitution: y = 2x − 3 and 3x + 2y = 8.',
      steps: [
        'Equation 1 is already solved for y. Use that.',
        'Substitute y = 2x − 3 into equation 2: 3x + 2(2x − 3) = 8.',
        'Expand: 3x + 4x − 6 = 8.',
        'Combine: 7x − 6 = 8 ⟹ 7x = 14 ⟹ x = 2.',
        'Back-substitute into equation 1: y = 2(2) − 3 = 1.',
        'Solution: (2, 1).',
        'Verify in equation 2: 3(2) + 2(1) = 6 + 2 = 8 ✓.',
      ],
      answer: '(x, y) = (2, 1)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve by substitution: x + y = 7 and 2x − y = 5.',
      expectedAnswer: 'From eq 1: y = 7 − x. Substitute into eq 2: 2x − (7 − x) = 5 ⟹ 3x − 7 = 5 ⟹ x = 4. Back-sub: y = 7 − 4 = 3. Solution (4, 3). Check eq 2: 2(4) − 3 = 5 ✓.',
      responseFormat: 'free',
      hints: [
        'Solve eq 1 for whichever variable is easiest.',
        'Watch the sign when distributing the negative.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-distribute-sign',
      kind: 'misconception_check',
      question: 'A student substitutes y = 7 − x into 2x − y = 5 and writes 2x − 7 − x = 5 (without parentheses). Why is the answer wrong?',
      commonErrors: [
        {
          answer: 'Drops parens around 7 − x',
          misconception: 'Forgetting that −y means −(7 − x), not −7 − x.',
          correctsTo: 'Replacing y with the expression 7 − x means putting it INSIDE parentheses, then distributing the negative: 2x − (7 − x) = 2x − 7 + x = 3x − 7. The error 2x − 7 − x = x − 7 fails to flip the sign on the second term, giving x = 12 (wrong). ALWAYS use parentheses when substituting expressions into terms with leading signs.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solve one equation for one variable, substitute into the other.',
        'Use parentheses around the substituted expression to handle signs.',
        'Back-substitute to find the second variable.',
        'Check in both original equations.',
        'False statement = no solution; true tautology = infinite solutions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
