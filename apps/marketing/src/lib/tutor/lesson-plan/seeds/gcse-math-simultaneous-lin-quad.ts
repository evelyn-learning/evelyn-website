/**
 * GCSE Math Higher — Simultaneous Equations: Linear + Quadratic.
 * Substitution method, intersection of line and curve.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_SIMULTANEOUS_LIN_QUAD: LessonPlan = {
  id: 'evelyn.gcse.math.simultaneous-lin-quad.v1',
  title: 'GCSE Higher — Simultaneous: Linear + Quadratic',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.simultaneous-lin-quad',
      description: 'Solve a pair of simultaneous equations where one is linear and one is quadratic, by substitution; interpret the solution as line-curve intersection.',
      standard: 'GCSE-MATH-A19/A21',
    },
  ],
  prerequisites: ['gcse.math.quadratic-complete-square'],
  followUps: ['gcse.math.functions-transformations'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Most exam papers test linear-quadratic systems — they tie three big ideas (substitution, factorising, line meets curve) into one question.',
      script: 'Two linear equations meet at one point. A line and a parabola can meet at zero, one, or two points — and which it is gets decided by the discriminant of the quadratic that comes out of substitution. Understanding this gives you both the algebraic skill AND a geometric picture.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-substitution',
      kind: 'concept',
      goal: 'Substitution algorithm + geometric interpretation.',
      keyIdeas: [
        'METHOD: rearrange the LINEAR equation to make y (or x) the subject. Substitute into the QUADRATIC. Solve the resulting one-variable quadratic. Back-substitute each solution to find paired values.',
        'EXAMPLE: y = 2x + 1 and y = x² − 2x − 3. Substitute: x² − 2x − 3 = 2x + 1 → x² − 4x − 4 = 0.',
        'NUMBER OF SOLUTIONS = number of intersections of line and curve. Two real roots → two intersections. One repeated root → tangent (one touch). No real roots → no intersection.',
        'DISCRIMINANT TEST: after substitution gives ax² + bx + c = 0, compute Δ = b² − 4ac. Δ > 0 → two intersections. Δ = 0 → tangent. Δ < 0 → no intersection.',
        'FOR (x − a)² + (y − b)² = r² (circle equation): same substitution method. Sub the linear in for y, expand, collect into quadratic in x.',
        'BACK-SUBSTITUTION TRAP: pair each x with its y FROM THE LINE (not the quadratic). The line is simpler and avoids ambiguity. Solutions come as (x₁, y₁), (x₂, y₂).',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'b² − 4ac for ax² + bx + c = 0; sign tells you the number of real roots.' },
        { term: 'tangent', definition: 'a line that touches a curve at exactly one point; corresponds to a repeated root of the substitution quadratic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-line-curve',
      kind: 'worked_example',
      problem: 'Solve simultaneously: y = 3x − 2 and x² + y² = 20.',
      steps: [
        'Substitute the linear into the quadratic: x² + (3x − 2)² = 20.',
        'Expand (3x − 2)² = 9x² − 12x + 4.',
        'Combined: x² + 9x² − 12x + 4 = 20 → 10x² − 12x + 4 = 20 → 10x² − 12x − 16 = 0.',
        'Divide by 2: 5x² − 6x − 8 = 0.',
        'Factorise: a·c = −40. Need two numbers that multiply to −40 and add to −6. → −10 and 4. Split: 5x² − 10x + 4x − 8 = 0 → 5x(x − 2) + 4(x − 2) = 0 → (x − 2)(5x + 4) = 0.',
        'So x = 2 or x = −4/5.',
        'Back-substitute into y = 3x − 2: when x = 2, y = 4. When x = −4/5, y = 3(−4/5) − 2 = −12/5 − 10/5 = −22/5.',
        'Solutions: (2, 4) and (−4/5, −22/5).',
      ],
      answer: '(2, 4) and (−4/5, −22/5)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve: y = x + 3 and y = x² + 1. State the coordinates of intersection.',
      expectedAnswer: '(2, 5) and (−1, 2)',
      responseFormat: 'free',
      hints: [
        'Set the y-expressions equal: x² + 1 = x + 3.',
        'Rearrange to x² − x − 2 = 0 and factorise.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-back-sub',
      kind: 'misconception_check',
      question: 'Two students solve y = x + 1, y = x² − 1 and both get x = 2 and x = −1. Student A pairs them as (2, 3), (−1, 0) using the line. Student B pairs them as (2, 3), (−1, 0) using the quadratic. Both got the same y-values — does that always happen?',
      commonErrors: [
        {
          answer: 'Yes always — substitution gives the y-value either way',
          misconception: 'Believing the choice of which equation to back-substitute into doesn\'t matter.',
          correctsTo: 'For VALID solutions, both equations give the same y by definition (that\'s why they\'re solutions). But algebraic mistakes show up MUCH faster if you back-substitute into the LINE — fewer operations, fewer chances to slip. Reserve the quadratic for verification only. If the two methods disagree, you\'ve made an error and should re-solve.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Substitute the linear equation into the quadratic — never the other way.',
        'Back-substitute solutions into the LINEAR equation for the partner variable.',
        'Number of real solutions to the substitution quadratic = number of intersection points.',
        'Discriminant Δ = b² − 4ac decides the geometry: > 0 secant, = 0 tangent, < 0 miss.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For what values of k does the line y = kx + 2 NOT intersect the parabola y = x² + 1?',
      hint: 'Set kx + 2 = x² + 1 → x² − kx − 1 = 0. Discriminant Δ = k² − 4(1)(−1) = k² + 4. This is always > 0 for any real k, so the line always meets the parabola at two points. There is NO value of k that produces no intersection. Geometric reason: as k → ∞, the line eventually crosses any given parabola.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
