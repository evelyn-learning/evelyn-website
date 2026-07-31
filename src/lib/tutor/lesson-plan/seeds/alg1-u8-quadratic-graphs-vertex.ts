/**
 * Algebra 1 — Quadratic Functions: Graphs and Vertex Form.
 *
 * The first time a graph stops being a straight line. Students learn the
 * anatomy of a parabola (vertex, axis of symmetry, opens up/down), read a
 * vertex straight off y = a(x − h)² + k — surviving the sign-of-h trap —
 * find the vertex of a standard-form quadratic with x = −b/(2a), and use
 * the vertex to answer "what is the biggest/smallest" in a real model.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U8_QUADRATIC_GRAPHS_VERTEX: LessonPlan = {
  id: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1',
  title: 'Quadratic Functions: Graphs & Vertex Form',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.quadratic-graphs-vertex',
      standard: 'ALG1-8.1',
      description:
        'Graph quadratic functions by identifying the vertex, axis of symmetry, and direction of opening, reading the vertex from y = a(x − h)² + k or computing it from standard form with x = −b/(2a), and interpreting the vertex as a maximum or minimum in context (CCSS F-IF.C.7a, F-IF.C.8a).',
    },
  ],
  prerequisites: ['alg1.factoring-special-forms'],
  followUps: ['alg1.solving-by-factoring-square-roots'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the parabola as the shape that answers "what is the best I can do?" — and the vertex as the answer.',
      script:
        'Everything you have graphed so far has been a straight line, which only ever goes one way: up forever or down forever. A quadratic bends. It rises, turns around, and comes back — and that turning point is worth money. Maximum height of a thrown ball, biggest garden you can fence, the price that earns the most: all of them are one point on a parabola called the vertex. Today you learn to find it without graphing a thing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parabola-anatomy',
      kind: 'concept',
      goal: 'Parabola anatomy, vertex form and the sign-of-h trap, the −b/(2a) route from standard form, and max vs min.',
      keyIdeas: [
        'ANATOMY — every quadratic graphs as a parabola: a U-shaped curve with exactly one turning point, the VERTEX, and a vertical mirror line through it, the AXIS OF SYMMETRY. Naming those two things is most of graphing.',
        'THE SIGN OF a DECIDES THE DIRECTION — a > 0 opens UP so the vertex is the lowest point (a MINIMUM); a < 0 opens DOWN so the vertex is the highest point (a MAXIMUM). Nothing else in the equation changes this.',
        'THE SIZE OF a ONLY CHANGES WIDTH — |a| > 1 makes the parabola narrower, 0 < |a| < 1 makes it wider. It never moves the vertex.',
        'VERTEX FORM — y = a(x − h)² + k hands you the vertex (h, k) for free, and the axis of symmetry is the line x = h. That is the whole reason this form exists.',
        'THE SIGN-OF-H TRAP — the form SUBTRACTS h, so what you see inside the parentheses is the opposite of h. y = (x + 5)² − 2 is really (x − (−5))² − 2, so h = −5 and the vertex is (−5, −2), not (5, −2). Safety check: h is the x-value that makes the inside equal zero.',
        'K DOES NOT FLIP — k is ADDED, so you read it off exactly as written. Only the inside of the parentheses plays the sign game; the second coordinate does not.',
        'VERTEX FROM STANDARD FORM — for y = ax² + bx + c the axis of symmetry is x = −b/(2a). Compute that x, then SUBSTITUTE it back into the equation to get the y-coordinate. Do not use c as the y-coordinate — c is the y-intercept (0, c), a completely different point.',
        'MAX/MIN IN CONTEXT — in a real model the vertex answers two different questions: the x-coordinate is WHEN or AT WHAT INPUT the best case happens, the y-coordinate is HOW MUCH it is. Read the question to see which one it wants.',
      ],
      vocabulary: [
        { term: 'vertex', definition: 'the single turning point of a parabola — its highest or lowest point; (h, k) in vertex form.' },
        { term: 'axis of symmetry', definition: 'the vertical line x = h that folds the parabola onto itself, so every point has a mirror twin.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-read-vertex-form',
      kind: 'worked_example',
      problem: 'For y = 2(x − 3)² − 8, name the vertex, the axis of symmetry, and the direction it opens — then find enough points to sketch it.',
      steps: [
        'Match to y = a(x − h)² + k: a = 2, h = 3, k = −8.',
        'Vertex is (h, k) = (3, −8). Axis of symmetry is x = 3.',
        'a = 2 is positive, so the parabola opens UP and the vertex is a minimum — the smallest y-value this function ever reaches is −8.',
        'y-intercept: substitute x = 0. y = 2(0 − 3)² − 8 = 2(9) − 8 = 18 − 8 = 10, giving the point (0, 10).',
        'Symmetry gives a free point: (0, 10) is 3 units left of the axis x = 3, so its mirror twin is 3 units right, at (6, 10).',
        'x-intercepts: set y = 0. 2(x − 3)² = 8, so (x − 3)² = 4, so x − 3 = ±2, giving x = 5 and x = 1 — points (1, 0) and (5, 0).',
        'Sketch: an upward U with its bottom at (3, −8), crossing the x-axis at 1 and 5 and the y-axis at 10.',
      ],
      answer: 'Vertex (3, −8); axis of symmetry x = 3; opens up (minimum value −8)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-standard-form-max',
      kind: 'worked_example',
      problem: 'A water jet leaves a fountain nozzle and its height in feet after t seconds is h = −16t² + 64t + 5. When does the jet reach its highest point, and how high is it?',
      steps: [
        'This is standard form with a = −16, b = 64, c = 5. Since a is negative the parabola opens DOWN, so the vertex is a MAXIMUM — good, the question asks for a highest point.',
        'Axis of symmetry: t = −b/(2a) = −(64)/(2 · (−16)) = −64/(−32) = 2 seconds.',
        'WATCH THE SIGN: the formula is −b/(2a), not b/(2a). Dropping that leading minus gives 64/(−32) = −2 seconds — a time before the jet started, which is your signal that a sign got lost.',
        'Now substitute t = 2 back into the ORIGINAL equation for the height: h = −16(2)² + 64(2) + 5 = −16(4) + 128 + 5 = −64 + 128 + 5 = 69.',
        'Do not answer 5. The c-value 5 is the starting height at t = 0 (the y-intercept), not the maximum.',
        'Vertex is (2, 69): the jet peaks 2 seconds in, at a height of 69 feet.',
      ],
      answer: 'Maximum height 69 feet, reached at t = 2 seconds',
      estimatedMinutes: 3,
    },
    {
      id: 'try-vertex-sign',
      kind: 'try_yourself',
      problem: 'What is the vertex of y = 4(x + 5)² − 7?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(−5, −7)', correct: true },
        { id: 'b', text: '(5, −7)' },
        { id: 'c', text: '(−5, 7)' },
        { id: 'd', text: '(4, −7)' },
      ],
      expectedAnswer: '(−5, −7)',
      hints: [
        'Vertex form subtracts h, so rewrite (x + 5) as (x − (−5)).',
        'The x-value that makes the inside zero is x = −5; k = −7 is read off as written.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-axis-standard',
      kind: 'try_yourself',
      problem: 'What is the axis of symmetry of y = 2x² − 12x + 5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 3', correct: true },
        { id: 'b', text: 'x = −3' },
        { id: 'c', text: 'x = 6' },
        { id: 'd', text: 'x = 5' },
      ],
      expectedAnswer: 'x = 3',
      hints: [
        'Use x = −b/(2a) with a = 2 and b = −12.',
        'Two negatives: −(−12) = 12, and 2a = 4, so x = 12/4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-max-area',
      kind: 'try_yourself',
      problem: 'A rectangular garden is modeled by A = −w² + 30w, where w is the width in feet and A is the area in square feet. What is the largest possible area, in square feet? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '225',
      hints: [
        'a = −1 and b = 30, so the best width is w = −b/(2a) = −30/(2 · (−1)).',
        'That gives w = 15 — now substitute 15 back in to get the AREA, not the width.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-c-as-vertex-y',
      kind: 'misconception_check',
      question: 'A student finds the vertex of y = x² − 6x + 5 by computing x = −b/(2a) = 3 and then writing the vertex as (3, 5). What went wrong?',
      commonErrors: [
        {
          answer: '(3, 5)',
          misconception: 'Grabbing c = 5 for the y-coordinate instead of substituting the vertex x back into the function — treating the y-intercept as if it were the vertex.',
          correctsTo: 'The x = 3 is right, but the y-coordinate must come from the equation: y = (3)² − 6(3) + 5 = 9 − 18 + 5 = −4. The vertex is (3, −4). The point (0, 5) is the y-intercept — a different point on the same parabola. Rule: −b/(2a) gives you only HALF the vertex; you always have to plug it back in.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = a(x − h)² + k → vertex (h, k), axis of symmetry x = h.',
        'The sign inside the parentheses is OPPOSITE h: (x + 5)² means h = −5. k is read straight off.',
        'a > 0 opens up, vertex is a minimum; a < 0 opens down, vertex is a maximum. |a| only changes the width.',
        'From standard form: x = −b/(2a), then SUBSTITUTE back for the y-coordinate — never use c.',
        'In a word problem the vertex x tells you WHEN/at what input, the vertex y tells you HOW MUCH.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Quadratic Functions: Graphs & Vertex Form' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
