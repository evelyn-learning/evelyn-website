/**
 * Digital SAT — Math / Advanced Math: Quadratic & Polynomial Functions and
 * Their Graphs.
 *
 * High-frequency Advanced Math setup: the student is handed a parabola or
 * polynomial's GRAPH (or an equation to be read as a graph) and asked for
 * the vertex, the roots, or the end behavior — without ever being asked to
 * "solve" anything. Focus on reading the three quadratic forms directly off
 * the graph, plus polynomial multiplicity and end behavior. Desmos is
 * allowed on every math question — teach it as the fast way to confirm a
 * vertex or root instead of re-deriving one by hand.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_NONLINEAR_FUNCTIONS_GRAPHS: LessonPlan = {
  id: 'evelyn.testprep.dsat.nonlinear-functions-graphs.v1',
  title: 'Quadratic & Polynomial Functions and Their Graphs',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.nonlinear-functions-graphs',
      standard: 'DSAT-2.3',
      description:
        'Read vertex, roots, and end behavior directly from the graph or equation of a quadratic or polynomial function, using vertex form, factored form, and root multiplicity.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame graph-reading (vertex, roots, end behavior) for quadratics and polynomials as a high-frequency, high-speed Advanced Math skill.',
      script:
        'Advanced Math is about 35 percent of SAT Math, and reading a parabola or polynomial\'s graph — without ever solving anything — is one of the domain\'s most repeated setups. Every module has questions that hand you a picture (or an equation to picture) and ask for the vertex, the roots, or what happens as the graph runs off the edges. The algebra here is simple; graph-reading is what separates fast points from stuck ones.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-graph-reading',
      kind: 'concept',
      goal: 'The three forms of a quadratic and what each reveals about its graph, plus polynomial multiplicity, end behavior, and turning points.',
      keyIdeas: [
        'QUADRATIC GRAPH SHAPE — every quadratic y = ax² + bx + c graphs as a parabola. The sign of a alone tells you direction: a > 0 opens UP (vertex is a MINIMUM); a < 0 opens DOWN (vertex is a MAXIMUM).',
        'VERTEX FORM — y = a(x − h)² + k puts the vertex at (h, k) directly. Solve "x − h = 0" for h — don\'t just read the sign inside the parentheses; (x + 5)² has h = −5, not +5.',
        'FACTORED FORM & ROOTS — y = a(x − p)(x − q) shows the x-intercepts (roots/zeros) at x = p and x = q directly, with no solving required.',
        'MULTIPLICITY — how many times a factor repeats. A root with EVEN multiplicity (like the squared factor in (x − r)²) makes the graph TOUCH the x-axis and bounce back. A root with ODD multiplicity makes the graph CROSS straight through.',
        'END BEHAVIOR (higher-degree polynomials) — driven by the DEGREE (even/odd) and the SIGN of the leading coefficient. Even degree: both ends point the SAME direction (the sign of the leading coefficient). Odd degree: ends point OPPOSITE directions.',
        'TURNING POINTS — a degree-n polynomial graph has AT MOST n − 1 turning points. If a graph shows k direction changes ("bumps"), the polynomial\'s degree is AT LEAST k + 1.',
        'DESMOS CHECK — the calculator is available on every math question. Typing the equation in and reading the graph directly confirms a vertex, a root, or end behavior in seconds — faster than re-deriving it by hand.',
      ],
      vocabulary: [
        { term: 'zero (root)', definition: 'an x-value where the function equals 0 — where the graph crosses or touches the x-axis.' },
        { term: 'multiplicity', definition: 'how many times a factor (x − r) appears in the factored form; even → touches the x-axis, odd → crosses it.' },
        { term: 'end behavior', definition: 'what the function\'s output does as x → +∞ and x → −∞, set by the degree (even/odd) and the sign of the leading coefficient.' },
        { term: 'turning point', definition: 'a point where the graph changes from increasing to decreasing or vice versa; a degree-n polynomial has at most n − 1 of them.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-vertex-form',
      kind: 'worked_example',
      problem: 'The function f(x) = −2(x − 3)² + 8 is graphed in the xy-plane. What are the coordinates of its vertex, and is the vertex a maximum or a minimum?',
      steps: [
        'f is in vertex form y = a(x − h)² + k with h = 3 and k = 8, so the vertex is (3, 8).',
        'The leading coefficient a = −2 is negative, so the parabola opens DOWNWARD.',
        'A downward-opening parabola\'s vertex is its highest point, so (3, 8) is a MAXIMUM.',
      ],
      answer: 'Vertex (3, 8); it is a maximum.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-multiplicity-trap',
      kind: 'worked_example',
      problem: 'The function g(x) = (x + 1)²(x − 4) is graphed in the xy-plane. At how many points does the graph CROSS (not merely touch) the x-axis, and what happens to g(x) as x → +∞?',
      steps: [
        'The factored form gives zeros at x = −1 (from the squared factor, so multiplicity 2) and x = 4 (multiplicity 1).',
        'Even multiplicity (x = −1) means the graph touches the x-axis and bounces back WITHOUT crossing. Odd multiplicity (x = 4) means the graph crosses straight through.',
        'So the graph crosses the x-axis at exactly ONE point: x = 4.',
        'Multiplying the leading terms of (x + 1)² and (x − 4) gives x² · x = x³ — degree 3 (odd) with a POSITIVE leading coefficient, so as x → +∞, g(x) → +∞.',
      ],
      answer: 'Crosses at exactly 1 point (x = 4); as x → +∞, g(x) → +∞.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-vertex-sign',
      kind: 'try_yourself',
      problem: 'The graph of h(x) = (x + 5)² − 2 in the xy-plane is a parabola. What is the x-coordinate of the vertex?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5' },
        { id: 'b', text: '−5', correct: true },
        { id: 'c', text: '2' },
        { id: 'd', text: '−2' },
      ],
      expectedAnswer: '−5',
      hints: [
        'Vertex form is y = a(x − h)² + k — the vertex x-coordinate makes the inside of the parentheses equal zero.',
        'Solve x + 5 = 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-end-behavior',
      kind: 'try_yourself',
      problem: 'Which statement describes the end behavior of the graph of p(x) = −3x⁴ + 2x − 7 as x → +∞ and as x → −∞?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'As x → +∞, p(x) → +∞; as x → −∞, p(x) → −∞' },
        { id: 'b', text: 'As x → +∞, p(x) → −∞; as x → −∞, p(x) → −∞', correct: true },
        { id: 'c', text: 'As x → +∞, p(x) → +∞; as x → −∞, p(x) → +∞' },
        { id: 'd', text: 'As x → +∞, p(x) → −∞; as x → −∞, p(x) → +∞' },
      ],
      expectedAnswer: 'As x → +∞, p(x) → −∞; as x → −∞, p(x) → −∞',
      hints: [
        'Even-degree polynomials have BOTH ends pointing the same direction — check the sign of the leading coefficient.',
        'Degree is 4 (even) and the leading coefficient is −3 (negative), so both ends point down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem: 'Student-produced response (type your answer): the graph of f(x) = (x − 2)(x + 6) is shown in the xy-plane. What is the y-coordinate of the graph\'s y-intercept?',
      responseFormat: 'numeric',
      expectedAnswer: '-12',
      hints: [
        'The y-intercept is the value of f(0).',
        'Plug in x = 0: f(0) = (0 − 2)(0 + 6).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-touch-vs-solution',
      kind: 'misconception_check',
      question: 'A student looks at a parabola that touches the x-axis at exactly one point, x = 4, without crossing through it, and says "this equation has no real solutions." What went wrong?',
      commonErrors: [
        {
          answer: 'no real solutions',
          misconception: 'Confusing a graph that just touches the x-axis (a double root) with one that never reaches the x-axis at all.',
          correctsTo:
            'Touching the x-axis IS a real solution — it\'s a REPEATED (double) root. The graph y = a(x − 4)² has exactly one x-intercept, at x = 4, with multiplicity 2. "No real solutions" describes a parabola that never touches the x-axis at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Vertex form y = a(x − h)² + k gives the vertex (h, k) directly — solve x − h = 0 for h, don\'t read the sign backwards.',
        'The sign of the leading coefficient sets direction (quadratics: up/down) and, with degree parity, sets end behavior (higher-degree polynomials).',
        'Factored form shows roots directly; even multiplicity touches the x-axis, odd multiplicity crosses it.',
        'Desmos graphs any function instantly — use it to check a vertex, a root, or end behavior when a picture isn\'t literally given.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Quadratic & Polynomial Functions and Their Graphs' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
