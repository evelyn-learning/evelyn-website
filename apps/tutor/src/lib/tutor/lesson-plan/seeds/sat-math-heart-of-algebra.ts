/**
 * SAT — Math: Heart of Algebra (linear equations, systems, inequalities).
 *
 * The SAT's "Heart of Algebra" domain is roughly 1/3 of the math
 * section. Linear equations in one variable, linear systems (2x2),
 * linear inequalities — focused on the SAT-specific traps:
 * disguised setups, equivalent-form recognition, "no solution" /
 * "infinite solutions" classification.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_HEART_OF_ALGEBRA: LessonPlan = {
  id: 'evelyn.testprep.sat.math.heart-of-algebra.v1',
  title: 'SAT Math: Heart of Algebra',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [
    {
      id: 'sat.math.heart-of-algebra',
      description: 'Solve linear equations, linear systems, and linear inequalities; recognize equivalent forms.',
    },
  ],
  prerequisites: ['ccss.math.hsa.rei.b.3'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up Heart of Algebra as roughly 1/3 of SAT Math — a high-leverage domain.',
      script: 'On the SAT, "Heart of Algebra" is 19 of 58 math questions — roughly 1 in 3. Every one is a linear equation, system, or inequality. The good news: there are only about 5 question types repeated with different numbers. Master the patterns and you bank a third of the math section.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-patterns',
      kind: 'concept',
      goal: 'Five recurring SAT linear patterns + the "no solution / infinite solutions" trick.',
      keyIdeas: [
        'PATTERN 1 — Solve for a variable in a multi-step linear equation. ax + b = cx + d. Move x-terms to one side, constants to the other.',
        'PATTERN 2 — Word problem to equation. "Janet earns $15/hour plus $50 base; total is $200; how many hours?" → 15h + 50 = 200 → h = 10.',
        'PATTERN 3 — Linear system (2x2). Solve by SUBSTITUTION (one equation already solved for a variable, plug into the other) or ELIMINATION (multiply equations to cancel a variable, then add).',
        'PATTERN 4 — Linear inequality. Same as solving an equation BUT flip the sign when multiplying or dividing by a negative.',
        'PATTERN 5 — Equivalent forms. The SAT asks "which equation has the same solution?" Often disguised by distributing, combining like terms, or rearranging.',
        'NO SOLUTION CASE: when two linear equations are PARALLEL (same slope, different intercepts), the system has no solution. Algebraically: same x-coefficient ratio AND y-coefficient ratio, but DIFFERENT constant ratio.',
        'INFINITE SOLUTIONS CASE: same line written two ways. ALL three coefficient ratios match.',
        'SAT TRAP: a question asks for a special k value to make a system have no solution. Set the slopes equal but constants unequal.',
      ],
      vocabulary: [
        { term: 'linear equation', definition: 'an equation where variables only have power 1 (no x² or √x).' },
        { term: 'linear system', definition: 'two or more linear equations in the same variables.' },
        { term: 'no solution case', definition: 'parallel lines — system never intersects.' },
        { term: 'infinite solutions case', definition: 'two equations describing the same line.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-system',
      kind: 'worked_example',
      problem: 'Solve the system: 2x + 3y = 12 and x − y = 1.',
      steps: [
        'From the second equation, x = y + 1. (Substitution-friendly.)',
        'Plug into first: 2(y + 1) + 3y = 12 → 2y + 2 + 3y = 12 → 5y = 10 → y = 2.',
        'Back-substitute: x = y + 1 = 3.',
        'Solution: x = 3, y = 2.',
        'Check both equations: 2(3) + 3(2) = 12 ✓; 3 − 2 = 1 ✓.',
      ],
      answer: '(3, 2)',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-no-solution',
      kind: 'worked_example',
      problem: 'For what value of k does the system  2x + 3y = 7  and  4x + ky = 5  have NO solution?',
      steps: [
        'No solution requires the two lines to be PARALLEL but not identical.',
        'Parallel: x-coefficient ratio = y-coefficient ratio. 4/2 = k/3 → k = 6.',
        'Verify constants are NOT in the same ratio: 5/7 ≠ 4/2. Yes, different. So this is parallel, not identical → no solution.',
        'k = 6.',
      ],
      answer: 'k = 6',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve  3(x − 2) + 4 = 2x + 5.',
      expectedAnswer: '7',
      responseFormat: 'numeric',
      hints: [
        'Distribute first: 3x − 6 + 4 = 2x + 5 → 3x − 2 = 2x + 5.',
        'Move x-terms: x = 7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flip-direction',
      kind: 'misconception_check',
      question: 'Solving -2x ≥ 8, Sage divides by -2 and writes x ≥ -4. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Forgetting the flip rule when dividing an inequality by a negative.',
          correctsTo: 'Wrong. Dividing both sides by NEGATIVE flips the inequality. -2x ≥ 8 → x ≤ -4. Sense-check x = 0: -2(0) = 0; is 0 ≥ 8? No. So x = 0 should fail your solution. Sage\'s "x ≥ -4" includes 0 (wrong); the corrected "x ≤ -4" excludes 0 (right).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Heart of Algebra = ~1/3 of SAT Math.',
        'Five recurring patterns: solve, word→equation, system, inequality, equivalent form.',
        'No solution: parallel lines (same slopes, different intercepts).',
        'Infinite solutions: same line, two equations.',
        'Inequality: flip the sign on multiply/divide by NEGATIVE.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For what value of c do the system  6x + 2y = c  and  3x + y = 4  have INFINITE solutions?',
      hint: 'Same line: every coefficient ratio equal. 6/3 = 2 means the first is 2× the second. So c = 2 × 4 = 8.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
