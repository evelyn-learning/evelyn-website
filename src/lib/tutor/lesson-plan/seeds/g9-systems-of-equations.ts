/**
 * G9 — Solving systems of two linear equations.
 *
 * Builds on G8 single-variable equations. The student learns three
 * methods (graphing, substitution, elimination) and the meaning of
 * an "intersection" — the (x, y) that makes BOTH equations true at
 * once. Uses show_diagram (cartesian plane via lines) and show_equation.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_SYSTEMS_OF_EQUATIONS: LessonPlan = {
  id: 'evelyn.g9.math.algebra.systems-linear.v1',
  title: 'Systems of Two Linear Equations',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'systems-of-equations',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.ee.c.8',
      description: 'Analyze and solve pairs of simultaneous linear equations.',
      standard: 'CCSS.MATH.CONTENT.8.EE.C.8',
    },
    {
      id: 'ccss.math.hsa.rei.c.6',
      description: 'Solve systems of linear equations exactly and approximately.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.C.6',
    },
    {
      id: 'ncert.math.g10.linear-equations.pairs',
      description: 'Solve pair of linear equations in two variables.',
      standard: 'NCERT-Math-Class-10-Ch-3',
    },
  ],
  prerequisites: ['ccss.math.8.ee.c.7', 'ccss.math.hsa.rei.b.3'],
  followUps: ['ccss.math.hsa.rei.c.7'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a system as "two clues, one mystery." Two equations narrow down the (x, y) pair to exactly one point — usually.',
      script: 'Two friends are buying tickets. One spent $40 on 3 movie tickets and 2 popcorn. The other spent $35 on 2 movies and 3 popcorn. Each ticket costs the same; each popcorn costs the same. Can we figure out the prices?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-meaning',
      kind: 'concept',
      goal: 'A system of two equations in (x, y) has a solution = the (x, y) that satisfies BOTH equations. Geometrically: the intersection of two lines.',
      keyIdeas: [
        'A solution to ONE linear equation is a whole line of (x, y) pairs.',
        'A solution to TWO linear equations at once is the (x, y) on BOTH lines — i.e. their INTERSECTION.',
        'Three cases: lines cross once (one solution), lines are parallel (no solution), lines are the same (infinite solutions).',
        'Algebra and geometry are saying the same thing two ways.',
      ],
      vocabulary: [
        { term: 'system', definition: 'two or more equations considered together.' },
        { term: 'solution to a system', definition: 'an (x, y) that makes EVERY equation in the system true.' },
        { term: 'consistent / inconsistent', definition: 'consistent = at least one solution; inconsistent = no solution.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-substitution',
      kind: 'worked_example',
      problem: 'Solve  y = 2x + 1  and  3x + y = 11  using substitution.',
      steps: [
        'The first equation already gives us y in terms of x.',
        'Substitute (2x + 1) for y in the second equation: 3x + (2x + 1) = 11.',
        'Combine: 5x + 1 = 11  →  5x = 10  →  x = 2.',
        'Plug x = 2 back into y = 2x + 1 to find y = 5.',
        'CHECK: in the second equation, 3(2) + 5 = 11. ✓',
      ],
      answer: '(2, 5)',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-elimination',
      kind: 'worked_example',
      problem: 'Solve  3x + 2y = 12  and  5x − 2y = 4  using elimination.',
      steps: [
        'Stack the equations. Notice +2y and −2y will cancel if we add.',
        '(3x + 2y) + (5x − 2y) = 12 + 4  →  8x = 16  →  x = 2.',
        'Plug x = 2 into the first equation: 3(2) + 2y = 12  →  2y = 6  →  y = 3.',
        'CHECK in the OTHER equation: 5(2) − 2(3) = 10 − 6 = 4. ✓',
      ],
      answer: '(2, 3)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Your turn: solve  x + y = 7  and  x − y = 1. Use any method you like.',
      expectedAnswer: '(4, 3)',
      responseFormat: 'frq',
      hints: [
        'Add the two equations — what cancels?',
        'After adding: 2x = 8, so x = 4. Now use either equation to find y.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-parallel',
      kind: 'misconception_check',
      question: 'A friend tries to solve  y = 2x + 3  and  y = 2x − 1, and gets stuck. What do you tell them?',
      commonErrors: [
        {
          answer: 'just keep substituting',
          misconception: 'Assuming every system has a single (x, y) solution, even when the lines are parallel.',
          correctsTo: 'Both lines have slope 2 but different y-intercepts — they\'re PARALLEL and never meet. The system has NO solution. The algebra confirms this when you substitute: 2x + 3 = 2x − 1 leads to 3 = −1, a contradiction.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A system\'s solution is the (x, y) that satisfies EVERY equation.',
        'Substitution: solve one equation for one variable, plug into the other.',
        'Elimination: line up like terms and add or subtract to cancel a variable.',
        'Geometrically the solution is the intersection of the lines.',
        'Parallel lines = no solution. Same line = infinite solutions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When neither variable\'s coefficient cancels directly (e.g.  2x + 3y = 12  and  5x + 4y = 23), how can you make elimination work?',
      hint: 'Multiply each equation by something so the coefficients of one variable become opposites.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
