/**
 * Digital SAT — Math / Advanced Math: Nonlinear Systems & Function
 * Transformations.
 *
 * Two Advanced Math patterns that share a common Desmos-friendly skill:
 * reading a graph's algebra. Nonlinear systems (line meets parabola) test
 * whether the student can substitute and count solutions from the
 * discriminant of the RESULTING equation. Transformations test whether the
 * student tracks shift direction and reflection order correctly. Desmos is
 * allowed on every math question — graphing both sides is a fast sanity
 * check for both skills.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_NONLINEAR_SYSTEMS_TRANSFORMATIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.nonlinear-systems-transformations.v1',
  title: 'Nonlinear Systems & Function Transformations',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.nonlinear-systems-transformations',
      standard: 'DSAT-2.6',
      description:
        'Solve systems containing a linear and a quadratic equation by substitution and determine the number of solutions from the resulting equation; apply shifts, reflections, and stretches to transform function graphs and their equations.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame both skills as the same underlying move — substitute and track signs carefully — and connect to graph intersections and shifted parabolas students already see.',
      script:
        'Advanced Math loves two related questions: "how many times does this line cross this parabola?" and "what happens to the equation when the graph shifts and flips?" Both come down to careful substitution and sign-tracking. Nail the sign rules today and both question types become quick points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nonlinear-and-transformations',
      kind: 'concept',
      goal: 'Solving linear-quadratic systems by substitution, reading solution count from the resulting quadratic, and the shift/reflection/stretch rules for transforming a function.',
      keyIdeas: [
        'NONLINEAR SYSTEM — one linear equation and one quadratic (or other nonlinear) equation solved together. Solve the LINEAR equation for a variable, then SUBSTITUTE into the quadratic to collapse to one variable.',
        'The substitution always produces a ONE-VARIABLE QUADRATIC. Solve it by factoring or the quadratic formula, then back-substitute into the linear equation (never the quadratic — it is easier and the linear one is exact) to get the paired coordinate.',
        'SOLUTION COUNT = number of intersection points = a discriminant question on the RESULTING quadratic, not the original one. Δ > 0 → two solutions (line crosses the parabola twice). Δ = 0 → exactly one solution (line is TANGENT). Δ < 0 → no real solutions (line misses the parabola).',
        'TRAP — "for what value of k does the system have exactly one solution?" Students often set the discriminant of the ORIGINAL quadratic to zero. Substitute FIRST, THEN take the discriminant of the combined equation.',
        'FUNCTION TRANSFORMATIONS from a base function f(x): f(x − h) shifts RIGHT h units; f(x + h) shifts LEFT h units — the sign INSIDE is the opposite of the direction. f(x) + k shifts UP k; f(x) − k shifts DOWN k.',
        'REFLECTIONS: −f(x) reflects over the x-axis (flips every y-value). f(−x) reflects over the y-axis (flips every x-value). Reflecting negates the WHOLE expression on that side, not just one term.',
        'STRETCH/COMPRESSION: a·f(x) with |a| > 1 stretches vertically (taller); 0 < |a| < 1 compresses vertically (flatter). The sign of a also reflects: negative a both flips and scales.',
        'ORDER MATTERS when combining transformations. Apply them in the order stated — shift first then reflect gives a different result than reflect first then shift, unless it is purely a horizontal-then-horizontal or vertical-then-vertical chain.',
      ],
      vocabulary: [
        { term: 'nonlinear system', definition: 'a system where at least one equation is not linear (e.g., a line and a parabola); solved by substitution into a one-variable equation.' },
        { term: 'tangent', definition: 'a line that touches a curve at exactly one point — the substituted equation has discriminant zero.' },
        { term: 'reflection', definition: 'flipping a graph across an axis: −f(x) flips over the x-axis, f(−x) flips over the y-axis.' },
        { term: 'vertical stretch/compression', definition: 'multiplying f(x) by a constant a; |a| > 1 stretches, 0 < |a| < 1 compresses.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-nonlinear-system',
      kind: 'worked_example',
      problem: 'Solve the system: y = x + 1 and y = x² − 5',
      steps: [
        'Substitute the linear expression for y into the quadratic equation: x + 1 = x² − 5.',
        'Collect everything on one side and factor: x² − x − 6 = 0 → (x − 3)(x + 2) = 0, so x = 3 or x = −2.',
        'Back-substitute into the LINEAR equation (faster): x = 3 → y = 4; x = −2 → y = −1. Check in the quadratic: 3² − 5 = 4 ✓ and (−2)² − 5 = −1 ✓.',
      ],
      answer: '(3, 4) and (−2, −1)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-transformation-trap',
      kind: 'worked_example',
      problem:
        'The graph of f(x) = x² − 4x is shifted 2 units LEFT, then reflected over the x-axis, to form g(x). Write g(x) in standard form.',
      steps: [
        'Shift LEFT 2 first: replace x with (x + 2) inside f. f(x + 2) = (x + 2)² − 4(x + 2) = x² + 4x + 4 − 4x − 8 = x² − 4.',
        'TRAP — reflecting over the x-axis comes SECOND and negates the ENTIRE shifted expression, not just one term: g(x) = −(x² − 4) = −x² + 4.',
        'Check with the vertex: f(x) = (x − 2)² − 4 has vertex (2, −4). Shifting left 2 moves the vertex to (0, −4). Reflecting over the x-axis flips the y-coordinate to (0, 4) — which matches the vertex of g(x) = −x² + 4. ✓',
      ],
      answer: 'g(x) = −x² + 4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solution-count',
      kind: 'try_yourself',
      problem: 'How many solutions does the system y = x² − 2x − 3 and y = −4 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0' },
        { id: 'b', text: '1', correct: true },
        { id: 'c', text: '2' },
        { id: 'd', text: 'Infinitely many' },
      ],
      expectedAnswer: '1',
      hints: [
        'Substitute y = −4 into the quadratic and collect to one side.',
        'x² − 2x − 3 = −4 → x² − 2x + 1 = 0 → (x − 1)² = 0 — a repeated root means one solution (the line is tangent).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transformation-direction',
      kind: 'try_yourself',
      problem:
        'The graph of g(x) is the graph of f(x) shifted 3 units right and 5 units down. Which equation defines g(x) in terms of f?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'g(x) = f(x − 3) − 5', correct: true },
        { id: 'b', text: 'g(x) = f(x + 3) − 5' },
        { id: 'c', text: 'g(x) = f(x − 3) + 5' },
        { id: 'd', text: 'g(x) = f(x + 3) + 5' },
      ],
      expectedAnswer: 'g(x) = f(x − 3) − 5',
      hints: [
        'A shift RIGHT h uses (x − h) inside the function — the sign inside is opposite the direction.',
        'A shift DOWN k subtracts k OUTSIDE the function.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr-tangent-k',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): for what positive value of k does the system y = x² and y = kx − 9 have exactly one solution?',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Substitute first: x² = kx − 9 → x² − kx + 9 = 0. One solution means this quadratic\'s discriminant is zero.',
        'Δ = k² − 36 = 0 → k = ±6. The problem asks for the positive value.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shift-sign',
      kind: 'misconception_check',
      question:
        'A student is told the graph of g(x) = f(x + 4) is f(x) shifted right 4 units. Is that correct?',
      commonErrors: [
        {
          answer: 'Shifted right 4',
          misconception: 'Reading the sign inside the parentheses directly as the shift direction, instead of recognizing the transformation is written as (x − h).',
          correctsTo: 'g(x) = f(x + 4) = f(x − (−4)), so h = −4: the shift is LEFT 4, not right. Quick check: if f(0) = c, then g(−4) = f(−4 + 4) = f(0) = c, so the point that used to sit at x = 0 now sits at x = −4 — a move in the negative (left) direction.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nonlinear system: solve the linear equation for a variable, substitute into the quadratic, solve the resulting one-variable quadratic, back-substitute into the LINEAR equation.',
        'Solution count comes from the discriminant of the SUBSTITUTED equation: Δ > 0 two solutions, Δ = 0 tangent (one), Δ < 0 none.',
        'f(x − h) shifts right h; f(x + h) shifts left h — sign inside is opposite the direction. f(x) + k / − k shifts up/down.',
        '−f(x) reflects over the x-axis; f(−x) reflects over the y-axis — apply transformations in the stated order.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.6', cedTitle: 'Nonlinear Systems & Function Transformations' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
