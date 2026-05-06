/**
 * Grades 9-10 Math — Linear Functions: Point-Slope Form.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_LINEAR_POINT_SLOPE: LessonPlan = {
  id: 'evelyn.g910.math.linear.point-slope.v1',
  title: 'Linear Functions — Point-Slope Form',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'linear-functions',
  locale: 'en',
  los: [
    {
      id: 'g910.math.linear.point-slope',
      description: 'Write a linear equation in point-slope form given a point and slope, and convert to slope-intercept or standard form.',
      standard: 'CCSS.MATH.CONTENT.HSA.CED.A.2',
    },
  ],
  prerequisites: ['g910.math.linear.slope-intercept'],
  followUps: ['g910.math.linear.parallel-perpendicular'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Point-slope is the form you start writing FIRST — when you have a slope and any one point.',
      script: 'A line passes through (3, −2) with slope 4. Slope-intercept form requires you to find b first. Point-slope skips the algebra: y − (−2) = 4(x − 3). Done. Point-slope is the most natural form when you have a point and a slope, and it cleans up to slope-intercept when needed.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-point-slope',
      kind: 'concept',
      goal: 'Form, derivation, when to use it, conversions.',
      keyIdeas: [
        'POINT-SLOPE FORM: y − y₁ = m(x − x₁), where (x₁, y₁) is any point on the line and m is the slope.',
        'DERIVATION: slope between (x, y) and (x₁, y₁) is (y − y₁)/(x − x₁). Set equal to m and clear the denominator: y − y₁ = m(x − x₁). Same idea as slope formula, rearranged.',
        'WHEN TO USE: anytime you\'re given a point and slope. Faster than computing b. Used heavily in calculus (tangent line at a point).',
        'CONVERSIONS:',
        '  Point-slope ⟶ slope-intercept: distribute m, then solve for y. y − y₁ = m(x − x₁) ⟶ y = mx − mx₁ + y₁ ⟶ y = mx + (y₁ − mx₁). The y-intercept is b = y₁ − mx₁.',
        '  Point-slope ⟶ standard form Ax + By = C: distribute, then move x and y to one side. Multiply through by an integer to clear fractions if needed.',
        'GIVEN TWO POINTS: compute slope first, then use either point in point-slope. Both points yield equivalent equations after simplification.',
        'ANY POINT WORKS — using (x₁, y₁) = (3, −2) or (5, 6) on the same line gives equations that simplify to the same slope-intercept form.',
      ],
      vocabulary: [
        { term: 'point-slope form', definition: 'y − y₁ = m(x − x₁); the most direct way to write a line\'s equation given a point and slope.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Write the equation of the line through (−2, 5) with slope −3 in point-slope form, then convert to slope-intercept form.',
      steps: [
        'Plug into y − y₁ = m(x − x₁) with (x₁, y₁) = (−2, 5) and m = −3:',
        'y − 5 = −3(x − (−2)).',
        'Simplify the inside: y − 5 = −3(x + 2). ← POINT-SLOPE FORM.',
        'Distribute: y − 5 = −3x − 6.',
        'Add 5 to both sides: y = −3x − 1. ← SLOPE-INTERCEPT FORM.',
        'Verify with the original point: y = −3(−2) − 1 = 6 − 1 = 5 ✓.',
      ],
      answer: 'Point-slope: y − 5 = −3(x + 2); Slope-intercept: y = −3x − 1.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A line passes through (1, 7) and (4, 1). Write its equation in point-slope form using the point (4, 1).',
      expectedAnswer: 'Slope m = (1 − 7)/(4 − 1) = −6/3 = −2. Using (4, 1): y − 1 = −2(x − 4). Verify with the other point: 7 − 1 = 6 and −2(1 − 4) = 6 ✓.',
      responseFormat: 'free',
      hints: [
        'Compute slope from the two points first.',
        'Then plug into y − y₁ = m(x − x₁) using (4, 1).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sign-inside',
      kind: 'misconception_check',
      question: 'A student uses point (−2, 5) and writes y − 5 = m(x − 2) instead of y − 5 = m(x + 2). What went wrong?',
      commonErrors: [
        {
          answer: 'Drops the negation on x₁',
          misconception: 'Plugging x₁ in directly without negating its sign.',
          correctsTo: 'Point-slope is y − y₁ = m(x − x₁). When x₁ = −2, the term becomes (x − (−2)) = (x + 2). The minus stays — it operates on x₁. So negative x₁ flips the sign INSIDE the parentheses. Writing (x − 2) plugs in the wrong point. Always evaluate (x − x₁) carefully when x₁ is negative — write the substitution before simplifying.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y − y₁ = m(x − x₁): use immediately when you have a point and slope.',
        'Negative x₁ becomes +|x₁| inside the parens.',
        'Distribute and solve for y to get slope-intercept.',
        'Any point on the line works — the result is the same line.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
