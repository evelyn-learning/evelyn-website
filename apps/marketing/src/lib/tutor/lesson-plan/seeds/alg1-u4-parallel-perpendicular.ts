/**
 * Algebra 1 — Linear Functions: Equations of Parallel & Perpendicular
 * Lines.
 *
 * Slope carries the whole geometric relationship (CCSS G-GPE.B.5, treated
 * algebraically): equal slopes mean parallel, opposite-reciprocal slopes
 * mean perpendicular. Combine that with point-slope form and you can build
 * any line the problem describes — the move that sets up systems, and later
 * every "find the line through..." question in the course.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U4_PARALLEL_PERPENDICULAR: LessonPlan = {
  id: 'evelyn.hs.alg1.parallel-perpendicular.v1',
  title: 'Equations of Parallel & Perpendicular Lines',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.parallel-perpendicular',
      standard: 'ALG1-4.5',
      description:
        'Use slope to decide whether two lines are parallel or perpendicular, and write the equation of the line through a given point that is parallel or perpendicular to a given line (CCSS G-GPE.B.5).',
    },
  ],
  prerequisites: ['alg1.point-slope-standard-form'],
  followUps: ['alg1.systems-by-graphing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame slope as the number that already knows the geometry — parallel and perpendicular are just two slope facts away.',
      script:
        'Look at the streets on any map: the ones that never cross climb at exactly the same rate, and the ones that meet at a square corner tilt in opposite directions. Slope has that information built in. Learn two short rules today — same slope, and flipped-and-negated slope — and you can write the equation of a road parallel to one street or perpendicular to another in about fifteen seconds.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-relationships',
      kind: 'concept',
      goal: 'The two slope rules, the special horizontal/vertical case, and the three-step recipe for writing the new line.',
      keyIdeas: [
        'PARALLEL — same slope, different y-intercept. If both lines had the same slope AND the same intercept they would be the same line, not a parallel pair.',
        'PERPENDICULAR — opposite reciprocals: flip the fraction AND change the sign. Slope 2 pairs with −1/2; slope −3/4 pairs with 4/3; slope 1 pairs with −1. The two slopes always multiply to −1.',
        'BOTH FLIPS ARE REQUIRED — a perpendicular pair always has one positive slope and one negative slope, so if your two slopes share a sign you have made an error. Just reciprocating (2 to 1/2) or just negating (2 to −2) is not enough.',
        'READ THE SLOPE BEFORE YOU USE IT — a line given in standard form like 4x + 2y = 10 does NOT have slope 4. Solve for y first: y = −2x + 5, so the slope is −2.',
        'THREE-STEP RECIPE — 1) find the given line\'s slope m, 2) build the new slope (m for parallel, −1/m for perpendicular), 3) drop that slope and the given point into point-slope form y − y₁ = m(x − x₁), then simplify to y = mx + b.',
        'THE POINT PICKS THE INTERCEPT — the slope rule alone gives infinitely many lines. The given point is what selects the single one, so always substitute it back at the end to confirm it satisfies your equation.',
        'SPECIAL CASE — a horizontal line y = c has slope 0 and a vertical line x = k has undefined slope. They are perpendicular even though 0 has no reciprocal; handle this pair by picture, not by the −1/m formula.',
      ],
      vocabulary: [
        { term: 'opposite reciprocal', definition: 'flip the fraction and change the sign — the opposite reciprocal of 3/4 is −4/3.' },
        { term: 'point-slope form', definition: 'y − y₁ = m(x − x₁), the fastest way to build a line from one point and a slope.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-parallel',
      kind: 'worked_example',
      problem: 'Write the equation of the line parallel to y = (2/3)x − 4 that passes through (6, 1).',
      steps: [
        'Read the slope of the given line: m = 2/3.',
        'Parallel means the SAME slope, so the new line also has slope 2/3.',
        'Point-slope with (6, 1): y − 1 = (2/3)(x − 6).',
        'Distribute: (2/3)(−6) = −4, so y − 1 = (2/3)x − 4.',
        'Add 1 to both sides: y = (2/3)x − 3.',
        'Check the point: (2/3)(6) − 3 = 4 − 3 = 1 ✓. And the intercept −3 differs from −4, so it is a genuinely different line. ✓',
      ],
      answer: 'y = (2/3)x − 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-perpendicular-standard-form',
      kind: 'worked_example',
      problem: 'Write the equation of the line perpendicular to 4x + 2y = 10 that passes through (−4, 3).',
      steps: [
        'The line is in standard form, so the slope is NOT 4 — solve for y first: 2y = −4x + 10, then y = −2x + 5. The slope is −2.',
        'Perpendicular slope is the opposite reciprocal of −2: flip to −1/2, then change the sign to get 1/2. (Careful: −1/2 is the trap — it keeps the original sign.)',
        'Sanity check the pair: (−2) × (1/2) = −1 ✓.',
        'Point-slope with (−4, 3): y − 3 = (1/2)(x + 4). Subtracting a negative x-coordinate makes a plus sign.',
        'Distribute and simplify: y − 3 = (1/2)x + 2, so y = (1/2)x + 5.',
        'Check the point: (1/2)(−4) + 5 = −2 + 5 = 3 ✓.',
      ],
      answer: 'y = (1/2)x + 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-perpendicular-slope',
      kind: 'try_yourself',
      problem: 'Which line is perpendicular to y = (3/5)x + 1?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = (5/3)x − 2' },
        { id: 'b', text: 'y = −(5/3)x + 4', correct: true },
        { id: 'c', text: 'y = −(3/5)x + 4' },
        { id: 'd', text: 'y = (3/5)x − 2' },
      ],
      expectedAnswer: 'y = −(5/3)x + 4',
      hints: [
        'Flip 3/5 to get 5/3 — but you are not done yet.',
        'Change the sign too. Check your pick by multiplying: the two slopes must give −1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-through-point',
      kind: 'try_yourself',
      problem: 'Which equation describes the line through (−2, 5) that is parallel to 2x − y = 7?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 2x + 9', correct: true },
        { id: 'b', text: 'y = −2x + 1' },
        { id: 'c', text: 'y = −(1/2)x + 4' },
        { id: 'd', text: 'y = 2x + 1' },
      ],
      expectedAnswer: 'y = 2x + 9',
      hints: [
        'Solve 2x − y = 7 for y before you read the slope — watch the sign when you divide by −1.',
        'Slope 2 with the point (−2, 5): y − 5 = 2(x + 2). Then simplify.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-intercept',
      kind: 'try_yourself',
      problem: 'Line L passes through (−2, 3) and is perpendicular to y = −(1/2)x + 7. Write L in slope-intercept form and type its y-intercept as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'The opposite reciprocal of −1/2 is 2.',
        'y − 3 = 2(x + 2) → y = 2x + 4 + 3. The y-intercept is the constant that is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flip-only',
      kind: 'misconception_check',
      question: 'A student says the line perpendicular to y = −(3/4)x + 2 has slope −4/3, because "you flip the fraction." What went wrong?',
      commonErrors: [
        {
          answer: 'slope = −4/3',
          misconception: 'Flipping the fraction but carrying the original negative sign along, so both slopes end up negative.',
          correctsTo: 'Opposite reciprocal means flip AND change the sign: −3/4 becomes 4/3. Test it — (−3/4) × (4/3) = −1 ✓, while (−3/4) × (−4/3) = +1 ✗. Two negative slopes both fall left-to-right, so they can never meet at a square corner.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parallel = same slope, different y-intercept.',
        'Perpendicular = opposite reciprocal: flip the fraction and change the sign, so the slopes multiply to −1.',
        'Solve for y before reading a slope out of standard form.',
        'Slope + given point + point-slope form y − y₁ = m(x − x₁) builds the line; substitute the point back to check.',
        'Horizontal and vertical lines are the perpendicular pair the −1/m rule cannot handle.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.5', cedTitle: 'Equations of Parallel & Perpendicular Lines' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
