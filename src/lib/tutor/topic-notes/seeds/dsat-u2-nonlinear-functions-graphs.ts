/**
 * Digital SAT — Unit 2 CED 2.3: Quadratic & Polynomial Functions and Their Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.nonlinear-functions-graphs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_NONLINEAR_FUNCTIONS_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.nonlinear-functions-graphs.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Quadratic & Polynomial Functions and Their Graphs',
  planId: 'evelyn.testprep.dsat.nonlinear-functions-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.nonlinear-functions-graphs.v1' }],
  theory: [
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'framework', title: 'Quadratic graph shape', content: `QUADRATIC GRAPH SHAPE — every quadratic y = ax² + bx + c graphs as a parabola. The sign of a alone tells you direction: a > 0 opens UP (vertex is a MINIMUM); a < 0 opens DOWN (vertex is a MAXIMUM).` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'framework', title: 'Vertex form', content: `VERTEX FORM — y = a(x − h)² + k puts the vertex at (h, k) directly. Solve "x − h = 0" for h — don't just read the sign inside the parentheses; (x + 5)² has h = −5, not +5.` },
    { loId: 'dsat.nonlinear-functions-graphs', content: `FACTORED FORM & ROOTS — y = a(x − p)(x − q) shows the x-intercepts (roots/zeros) at x = p and x = q directly, with no solving required.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'framework', title: 'Multiplicity', content: `MULTIPLICITY — how many times a factor repeats. A root with EVEN multiplicity (like the squared factor in (x − r)²) makes the graph TOUCH the x-axis and bounce back. A root with ODD multiplicity makes the graph CROSS straight through.` },
    { loId: 'dsat.nonlinear-functions-graphs', content: `END BEHAVIOR (higher-degree polynomials) — driven by the DEGREE (even/odd) and the SIGN of the leading coefficient. Even degree: both ends point the SAME direction (the sign of the leading coefficient). Odd degree: ends point OPPOSITE directions.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'framework', title: 'Turning points', content: `TURNING POINTS — a degree-n polynomial graph has AT MOST n − 1 turning points. If a graph shows k direction changes ("bumps"), the polynomial's degree is AT LEAST k + 1.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the calculator is available on every math question. Typing the equation in and reading the graph directly confirms a vertex, a root, or end behavior in seconds — faster than re-deriving it by hand.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'definition', title: 'zero (root)', content: `an x-value where the function equals 0 — where the graph crosses or touches the x-axis.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'definition', title: 'multiplicity', content: `how many times a factor (x − r) appears in the factored form; even → touches the x-axis, odd → crosses it.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'definition', title: 'end behavior', content: `what the function's output does as x → +∞ and x → −∞, set by the degree (even/odd) and the sign of the leading coefficient.` },
    { loId: 'dsat.nonlinear-functions-graphs', kind: 'definition', title: 'turning point', content: `a point where the graph changes from increasing to decreasing or vice versa; a degree-n polynomial has at most n − 1 of them.` },
  ],
  methods: [
    {
      title: 'Worked vertex form',
      steps: [
        `f is in vertex form y = a(x − h)² + k with h = 3 and k = 8, so the vertex is (3, 8).`,
        'The leading coefficient a = −2 is negative, so the parabola opens DOWNWARD.',
        `A downward-opening parabola's vertex is its highest point, so (3, 8) is a MAXIMUM.`,
      ],
      example: { problem: `The function f(x) = −2(x − 3)² + 8 is graphed in the xy-plane. What are the coordinates of its vertex, and is the vertex a maximum or a minimum?`, solution: 'Vertex (3, 8); it is a maximum.' },
      relatedLoIds: ['dsat.nonlinear-functions-graphs'],
    },
    {
      title: 'Worked multiplicity trap',
      steps: [
        `The factored form gives zeros at x = −1 (from the squared factor, so multiplicity 2) and x = 4 (multiplicity 1).`,
        `Even multiplicity (x = −1) means the graph touches the x-axis and bounces back WITHOUT crossing. Odd multiplicity (x = 4) means the graph crosses straight through.`,
        'So the graph crosses the x-axis at exactly ONE point: x = 4.',
        `Multiplying the leading terms of (x + 1)² and (x − 4) gives x² · x = x³ — degree 3 (odd) with a POSITIVE leading coefficient, so as x → +∞, g(x) → +∞.`,
      ],
      example: { problem: `The function g(x) = (x + 1)²(x − 4) is graphed in the xy-plane. At how many points does the graph CROSS (not merely touch) the x-axis, and what happens to g(x) as x → +∞?`, solution: 'Crosses at exactly 1 point (x = 4); as x → +∞, g(x) → +∞.' },
      relatedLoIds: ['dsat.nonlinear-functions-graphs'],
    },
  ],
  pointers: [
    { content: `Touching the x-axis IS a real solution — it's a REPEATED (double) root. The graph y = a(x − 4)² has exactly one x-intercept, at x = 4, with multiplicity 2. "No real solutions" describes a parabola that never touches the x-axis at all.`, kind: 'common-error' },
    { content: `Vertex form y = a(x − h)² + k gives the vertex (h, k) directly — solve x − h = 0 for h, don't read the sign backwards.`, kind: 'tip' },
    { content: `The sign of the leading coefficient sets direction (quadratics: up/down) and, with degree parity, sets end behavior (higher-degree polynomials).`, kind: 'tip' },
    { content: `Factored form shows roots directly; even multiplicity touches the x-axis, odd multiplicity crosses it.`, kind: 'tip' },
    { content: `Desmos graphs any function instantly — use it to check a vertex, a root, or end behavior when a picture isn't literally given.`, kind: 'tip' },
    { content: `Vertex form gives the vertex — standard form doesn't. For y = ax² + bx + c, the vertex x-coordinate is x = −b/(2a), or the midpoint of the two roots. Don't grab c as the vertex y-value; c is the **y-intercept**.`, kind: 'common-error' },
    { content: `Watch the leading coefficient hiding outside the parentheses: in y = −2(x − 3)² + 8 the −2 does NOT move the vertex, only flips and stretches. Vertex is still (3, 8). Only h and k relocate the vertex.`, kind: 'gotcha' },
    { content: `Read the stem word-for-word: 'crosses the x-axis' ≠ 'x-intercepts' ≠ 'distinct real solutions'. A double root at x = r counts as one x-intercept and one distinct solution, but the graph does NOT cross there.`, kind: 'vocab-note' },
    { content: `Discriminant tie-in: b² − 4ac > 0 → two x-intercepts (crosses twice); = 0 → vertex sits ON the x-axis (touches once); < 0 → graph never meets the x-axis. 'Touches at one point' means = 0, not < 0.`, kind: 'edge-case' },
    { content: `For end behavior, use the leading term only — the degree comes from the SUM of exponents across factors. (x + 1)²(x − 4)³ is degree 5, not 3 or 2. Expand nothing; just add the multiplicities.`, kind: 'tip' },
    { content: `A negative leading coefficient flips both ends. p(x) = −3x⁴ + 2x − 7 goes to −∞ on BOTH sides. The lower-degree terms (+2x, −7) never affect end behavior — ignore them entirely.`, kind: 'common-error' },
    { content: `'At most n − 1 turning points' runs one way only. A cubic can show 2 bumps or 0. So a graph with 3 visible bumps means degree ≥ 4 — the answer choice may be degree 5 or 6, not automatically 4.`, kind: 'edge-case' },
    { content: `Y-intercept from factored form: plug in x = 0, don't read the constants. For f(x) = (x − 2)(x + 6), f(0) = (−2)(6) = −12 — not 2, −6, or 12. Sign errors here are the #1 miss on the free-response version.`, kind: 'gotcha' },
  ],
};
