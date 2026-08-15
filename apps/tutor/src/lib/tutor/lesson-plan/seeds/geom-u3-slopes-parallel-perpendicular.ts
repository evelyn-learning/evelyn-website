/**
 * Geometry — Parallel & Perpendicular Lines: Slopes & Equations of
 * Parallel and Perpendicular Lines.
 *
 * Where the angle story becomes arithmetic (CCSS G-GPE.B.5): on the
 * coordinate plane you no longer hunt for congruent angle pairs — you
 * compute two slopes and compare them. Equal billing for the three
 * errors that cost the most: reciprocal without the negative, reading
 * the slope straight off standard form, and calling two copies of the
 * same line "parallel".
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U3_SLOPES_PARALLEL_PERPENDICULAR: LessonPlan = {
  id: 'evelyn.hs.geom.slopes-parallel-perpendicular.v1',
  title: 'Slopes & Equations of Parallel and Perpendicular Lines',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.slopes-parallel-perpendicular',
      standard: 'GEOM-3.3',
      description:
        'Use slope to decide whether two lines in the coordinate plane are parallel, perpendicular, or neither, and write the equation of the line through a given point that is parallel or perpendicular to a given line (CCSS G-GPE.B.5).',
    },
  ],
  prerequisites: ['geom.proving-lines-parallel'],
  followUps: ['geom.translations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Move the parallel/perpendicular question off the diagram and onto the coordinate grid, where it becomes a two-number check.',
      script:
        'Until now, proving two lines parallel meant hunting for a congruent angle pair. Put those lines on a coordinate grid and the whole question collapses into arithmetic: compute two slopes and compare them. That is exactly what a drafting program does when an architect drags a wall — it checks one product to decide whether the corner is truly square, thousands of times a second. Today you learn the two slope tests, and how to build the equation of a line that runs alongside or squares off against a line you are given.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-tests',
      kind: 'concept',
      goal: 'Slope as a direction fingerprint, the two tests, the special horizontal/vertical pair, and the point-slope build.',
      keyIdeas: [
        'SLOPE IS DIRECTION — for two points on a line, m = rise/run = (y2 - y1)/(x2 - x1). Slope is the single number that encodes which way the line points, so two lines point the same way exactly when their slopes are equal.',
        'PARALLEL TEST — two DIFFERENT lines are parallel exactly when their slopes are equal. In y = mx + b form, equal m, different b. Written ∥.',
        'SAME SLOPE, SAME INTERCEPT IS NOT PARALLEL — if m and b both match, the two equations describe the SAME line (coincident). Parallel lines share no points at all, so the intercepts must differ.',
        'PERPENDICULAR TEST — two lines are perpendicular (⊥) exactly when their slopes are negative reciprocals: flip the fraction AND change the sign. Equivalent check: the product of the two slopes is -1. Slope 3/4 pairs with -4/3; slope 5 pairs with -1/5.',
        'WHY NEGATIVE RECIPROCAL — turning a line 90° turns its slope triangle on its side: the rise becomes the run and the run becomes the rise, and one of the two changes sign. So rise/run becomes -run/rise. A quick sanity check: perpendicular slopes always have OPPOSITE signs, because one line must rise while the other falls.',
        'THE ONE EXCEPTION — a horizontal line (y = c) has slope 0 and a vertical line (x = k) has undefined slope. They are perpendicular, but the product test cannot be run because "undefined" is not a number. Handle this pair by inspection, not by multiplying.',
        'SOLVE FOR y BEFORE COMPARING — in standard form Ax + By = C the slope is NOT A. Isolate y first: 2x + 3y = 12 becomes y = -2/3 x + 4, so the slope is -2/3. Every comparison starts from y = mx + b form.',
        'BUILDING THE NEW LINE — the relationship gives the slope (copy it for parallel, negative-reciprocal it for perpendicular); the given point gives everything else. Substitute into point-slope form y - y1 = m(x - x1), then simplify to y = mx + b. Check both conditions at the end: the slope relationship holds, and the point satisfies your equation.',
      ],
      vocabulary: [
        { term: 'negative reciprocal', definition: 'the result of flipping a fraction and changing its sign — the negative reciprocal of 2/5 is -5/2.' },
        { term: 'point-slope form', definition: 'y - y1 = m(x - x1) — the equation of the line with slope m through the point (x1, y1).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-write-perpendicular',
      kind: 'worked_example',
      problem:
        'Line k has equation y = (2/3)x + 5. Write the equation of the line perpendicular to k that passes through the point (6, -1). Give your answer in slope-intercept form.',
      steps: [
        'Read the slope of k straight off slope-intercept form: m = 2/3.',
        'Take the negative reciprocal for the perpendicular slope: flip 2/3 to 3/2, then change the sign, giving -3/2. Check: (2/3)(-3/2) = -1. ✓',
        'Substitute the slope -3/2 and the point (6, -1) into point-slope form: y - (-1) = -3/2 (x - 6), which is y + 1 = -3/2 (x - 6).',
        'Distribute and solve for y: y + 1 = -3/2 x + 9, so y = -3/2 x + 8.',
        'Check the point: at x = 6, y = -3/2 (6) + 8 = -9 + 8 = -1. ✓ The line passes through (6, -1) and has the required perpendicular slope.',
      ],
      answer: 'y = -3/2 x + 8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-standard-form-trap',
      kind: 'worked_example',
      problem:
        'A student is asked whether 2x + 3y = 12 and 3x - 2y = 6 are parallel, perpendicular, or neither. They answer: "The slopes are 2 and 3, so neither." Find the true relationship and name the error.',
      steps: [
        'Spot the error: in Ax + By = C the coefficient A is not the slope. The equations must be solved for y first.',
        'First line: 2x + 3y = 12 becomes 3y = -2x + 12, so y = -2/3 x + 4. Its slope is -2/3.',
        'Second line: 3x - 2y = 6 becomes -2y = -3x + 6, so y = 3/2 x - 3. Its slope is 3/2.',
        'Compare: the slopes have opposite signs and the fraction is flipped, so they are negative reciprocals. Product check: (-2/3)(3/2) = -6/6 = -1. ✓',
        'The lines are PERPENDICULAR. The student compared the x-coefficients instead of the slopes, which only works when the y-coefficient happens to be 1.',
      ],
      answer: 'Perpendicular — the slopes are -2/3 and 3/2, whose product is -1. The error was reading the slope off standard form without solving for y.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-perpendicular-slope',
      kind: 'try_yourself',
      problem: 'Line m has slope -5/2. What is the slope of any line perpendicular to line m?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2/5', correct: true },
        { id: 'b', text: '-2/5' },
        { id: 'c', text: '5/2' },
        { id: 'd', text: '-5/2' },
      ],
      expectedAnswer: '2/5',
      hints: [
        'Perpendicular means negative reciprocal — two moves, not one: flip the fraction, then change the sign.',
        'Flipping -5/2 gives -2/5; changing the sign makes it positive. Check your answer by multiplying it with -5/2 — you should get -1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-through-point',
      kind: 'try_yourself',
      problem: 'Which equation describes the line that is parallel to y = -4x + 7 and passes through the point (2, 3)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = -4x + 11', correct: true },
        { id: 'b', text: 'y = -4x + 3' },
        { id: 'c', text: 'y = 4x - 5' },
        { id: 'd', text: 'y = (1/4)x + 5/2' },
      ],
      expectedAnswer: 'y = -4x + 11',
      hints: [
        'Parallel means the slope is copied unchanged: m = -4. The point then decides the y-intercept.',
        'Substitute (2, 3) into y = -4x + b: 3 = -8 + b. The y-coordinate 3 is not the intercept.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Line t is parallel to the line through the points (1, 2) and (4, 11), and line t passes through the point (2, 11). Type the y-intercept of line t as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'First find the slope of the given line: (11 - 2)/(4 - 1). Line t has that same slope.',
        'Substitute the slope and the point (2, 11) into y = mx + b and solve for b.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-coincident',
      kind: 'misconception_check',
      question:
        'A student says that y = (1/3)x + 2 and 2x - 6y = -12 are parallel because both have slope 1/3. Is that right?',
      commonErrors: [
        {
          answer: 'The lines are parallel because the slopes match',
          misconception: 'Treating equal slopes as the whole parallel test and never checking the y-intercepts.',
          correctsTo:
            'Solve the second equation for y: -6y = -2x - 12, so y = (1/3)x + 2 — the identical equation. Same slope AND same intercept means one line drawn twice (coincident), and a line is not parallel to itself. Parallel lines share NO points: equal slopes, different intercepts.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parallel ∥: equal slopes, different y-intercepts. Equal slopes with equal intercepts is the same line, not a parallel pair.',
        'Perpendicular ⊥: negative reciprocal slopes — flip and change the sign, so the product is -1. Opposite signs every time.',
        'Horizontal (slope 0) and vertical (undefined slope) are perpendicular, but the product test cannot be used on them.',
        'Always solve for y before comparing: in Ax + By = C the slope is -A/B, not A.',
        'To build the line: take the slope from the relationship, the intercept from the point via y - y1 = m(x - x1), then check both.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Slopes & Equations of Parallel and Perpendicular Lines' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
