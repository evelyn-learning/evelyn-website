/**
 * SAT Math — Systems of Linear Equations.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_SYSTEMS_EQUATIONS: LessonPlan = {
  id: 'evelyn.testprep.sat-math.systems-equations.v1',
  title: 'SAT Math — Systems of Linear Equations',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.systems', description: 'Solve 2-variable linear systems on SAT using substitution, elimination, and recognise no/infinite solution cases.', standard: 'CCSS.MATH.HSA.REI.C.6' }],
  prerequisites: ['satmath.linear-word-problems'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Systems of equations show up 4-5 times on every SAT Math — substitution + elimination is your toolkit.', script: 'Two equations, two unknowns. The SAT loves them: cost questions, mixture problems, intersection of lines. Knowing when substitution beats elimination saves time.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Substitution + elimination, when to use each, no/infinite solutions, SAT tricks.', keyIdeas: [
      'A SYSTEM OF LINEAR EQUATIONS has 2 (or more) equations in the same variables.',
      'SUBSTITUTION method:',
      '  Solve one equation for one variable (pick the easiest).',
      '  Plug into the other equation.',
      '  Solve resulting one-variable equation.',
      '  Back-substitute.',
      '  BEST when one equation is already solved (e.g., y = 3x + 2).',
      'ELIMINATION method:',
      '  Multiply equations so one variable\'s coefficients are equal-and-opposite.',
      '  Add equations to eliminate that variable.',
      '  Solve.',
      '  BEST when neither equation is solved for a variable (most word problems).',
      'NO SOLUTION case: lines are PARALLEL (same slope, different y-intercept). The two equations contradict — no point satisfies both.',
      '  Algebraic test: same coefficient ratios for x and y, but DIFFERENT constant ratio.',
      'INFINITE SOLUTIONS case: same line written two ways. ALL three coefficient ratios match.',
      'SAT TRICK 1: "For what value of k does this system have NO SOLUTION?" Set the slope condition, then set constant condition NOT to match.',
      'SAT TRICK 2: "What is x + y?" Sometimes you can ADD the equations directly to get x + y, without solving for each.',
      'CHECK by substituting your (x, y) into BOTH equations.',
    ], vocabulary: [{ term: 'system of linear equations', definition: 'two or more linear equations considered together; a solution must satisfy all.' }, { term: 'no solution case', definition: 'parallel lines — system never intersects.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Solve: 3x + 2y = 11 and 5x − 2y = 13.', steps: [
      'Notice y-coefficients are +2 and −2: equal and opposite.',
      'ADD the equations: (3x + 2y) + (5x − 2y) = 11 + 13. → 8x = 24. → x = 3.',
      'Back-substitute into either: 3(3) + 2y = 11 → 9 + 2y = 11 → 2y = 2 → y = 1.',
      'Check eq 2: 5(3) − 2(1) = 15 − 2 = 13 ✓.',
      'Solution: (3, 1).',
    ], answer: '(3, 1)', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'For what value of k does the system 2x + 3y = 7 and kx + 6y = 12 have NO SOLUTION?', expectedAnswer: 'No solution = parallel lines (same slope, different intercept). Slope of eq 1: −2/3. Slope of eq 2: −k/6. Set equal: −2/3 = −k/6 → k = 4. Verify constants don\'t scale: eq 2 with k = 4: 4x + 6y = 12 → divide by 2 → 2x + 3y = 6. Different constant from eq 1 (7) — confirms different lines, parallel ✓.', responseFormat: 'numeric', hints: ['No solution = parallel = slopes equal but lines different.', 'Find k that makes slopes equal.'], estimatedMinutes: 4 },
    { id: 'misconception-divide-zero', kind: 'misconception_check', question: 'A student tries to solve a system by dividing both sides of one equation by 0. Why is this a problem?', commonErrors: [{ answer: 'Divide by 0', misconception: 'Forgetting that division by 0 is undefined.', correctsTo: 'Division by 0 is UNDEFINED in math. If you find yourself wanting to divide by 0 (often happens when a variable equals 0), use a different method. The SAT may give you situations where one variable could be 0; check your method handles this case.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Substitution: when one eq solved for a variable.', 'Elimination: when neither solved.', 'No solution: same slope, different intercept (parallel).', 'Infinite: same line.', 'SAT trick: sometimes adding gives x+y without solving each.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
