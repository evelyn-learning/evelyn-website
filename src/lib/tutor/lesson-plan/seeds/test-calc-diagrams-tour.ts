/**
 * Test plan — exercises all 5 Phase-10 calculus diagram kinds in one
 * lesson. Each concept segment carries a teacherNote pinning the brain
 * to a specific show_diagram kind so a single test session covers:
 *   1. riemann_sum
 *   2. slope_field
 *   3. parametric_curve
 *   4. polar_graph
 *   5. taylor_polynomial_overlay
 *
 * Design notes (after first test session 2026-05-08):
 *   - Curves chosen so the brain's mental math is reliable (unit circle,
 *     dy/dx = x, sin x, cardioid). Cycloid produced visible hallucinations
 *     in earlier draft; reverted to unit circle.
 *   - Sample counts kept small (≥30 points per curve, 7×7 slope-field
 *     grid). Combined with tuple-format params this leaves room for
 *     narrative text inside the brain's ~1500 output-token budget.
 *   - "EMIT EXACTLY ONE diagram for this concept; do NOT promise a
 *     follow-up" language to prevent the brain from showing a simple
 *     warm-up then trying to upgrade to a richer version mid-turn (the
 *     follow-up keeps blowing the token budget).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_TEST_CALC_DIAGRAMS_TOUR: LessonPlan = {
  id: 'evelyn.test.calc-diagrams-tour.v1',
  title: 'Calc BC Diagram Tools — Visual Tour',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'test.calcbc.diagrams', description: 'Brief tour exercising the five Calc BC diagram tools (riemann_sum, slope_field, parametric_curve, polar_graph, taylor_polynomial_overlay) in a single session.', standard: 'INTERNAL-TEST' }],
  prerequisites: [], followUps: [], estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the session as a quick visual tour of five Calc BC diagram tools.',
      script: "Quick visual tour of five Calc BC diagrams — Riemann sums, slope fields, parametric curves, polar graphs, Taylor approximations. One picture each; we move fast.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-riemann',
      kind: 'concept',
      goal: 'Show how a Riemann sum approximates a definite integral with rectangles.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="riemann_sum". Use f(x)=x² on [0,2], n=4 LEFT rectangles. USE TUPLE FORMAT to save tokens. params shape: { curve: [[0,0],[0.25,0.0625],[0.5,0.25],[0.75,0.5625],[1,1],[1.25,1.5625],[1.5,2.25],[1.75,3.0625],[2,4]], rectangles: [[0,0.5,0],[0.5,0.5,0.25],[1,0.5,1],[1.5,0.5,2.25]], xMin:0, xMax:2, yMin:0, yMax:4.5, method:"left", n:4, exprLabel:"f(x) = x²", approxArea:1.75, exactArea:2.6667, title:"Left Riemann sum, n = 4" }. Do NOT promise to show a follow-up diagram.',
      keyIdeas: [
        'A Riemann sum approximates ∫_a^b f(x) dx using n rectangles.',
        'Left rule: rectangle height = f at LEFT edge of each subinterval.',
        'For f(x) = x² on [0, 2], left sum with n = 4 is 1.75; exact integral is 8/3 ≈ 2.667. Left rule UNDERESTIMATES because f is increasing.',
      ],
      vocabulary: [{ term: 'Riemann sum', definition: 'Σ f(x_i) Δx — finite-rectangle estimate of an integral.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-slope-field',
      kind: 'concept',
      goal: 'Show dy/dx = x as a slope field with one parabolic solution curve.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="slope_field". Use the SIMPLE ODE dy/dx = x (slopes depend only on x; brain math is reliable). USE TUPLE FORMAT. 7×7 grid on x ∈ [-3,3], y ∈ [-3,3], step = 1. samples uses [x, y, slope=x]. solutionCurve = the parabola y = x²/2 sampled at 13 x-values from -3 to 3. params shape: { samples: [[-3,-3,-3],[-2,-3,-2],[-1,-3,-1],[0,-3,0],[1,-3,1],[2,-3,2],[3,-3,3], [-3,-2,-3],[-2,-2,-2],[-1,-2,-1],[0,-2,0],[1,-2,1],[2,-2,2],[3,-2,3], [-3,-1,-3],[-2,-1,-2],[-1,-1,-1],[0,-1,0],[1,-1,1],[2,-1,2],[3,-1,3], [-3,0,-3],[-2,0,-2],[-1,0,-1],[0,0,0],[1,0,1],[2,0,2],[3,0,3], [-3,1,-3],[-2,1,-2],[-1,1,-1],[0,1,0],[1,1,1],[2,1,2],[3,1,3], [-3,2,-3],[-2,2,-2],[-1,2,-1],[0,2,0],[1,2,1],[2,2,2],[3,2,3], [-3,3,-3],[-2,3,-2],[-1,3,-1],[0,3,0],[1,3,1],[2,3,2],[3,3,3]], xMin:-3, xMax:3, yMin:-3, yMax:3, solutionCurve:[[-3,4.5],[-2.5,3.125],[-2,2],[-1.5,1.125],[-1,0.5],[-0.5,0.125],[0,0],[0.5,0.125],[1,0.5],[1.5,1.125],[2,2],[2.5,3.125],[3,4.5]], highlightPoint:{x:0,y:0}, exprLabel:"dy/dx = x", title:"Slope field for dy/dx = x" }. Do NOT show a richer follow-up version after this.',
      keyIdeas: [
        'A slope field shows dy/dx at each lattice point as a tiny line segment.',
        'For dy/dx = x, the slopes depend only on x — they line up vertically.',
        'Solutions are parabolas y = x²/2 + C, one for each constant C.',
      ],
      vocabulary: [{ term: 'slope field', definition: 'a grid of slope vectors visualizing dy/dx = f(x, y).' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-parametric',
      kind: 'concept',
      goal: 'Show the unit circle as a parametric curve with a tangent vector at t = π/2.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="parametric_curve". Use the unit circle x = cos t, y = sin t for t ∈ [0, 2π]. USE TUPLE FORMAT [x, y, t]. ~25 points evenly spaced (Δt = 2π/24). At t = π/2 the point is (0, 1) and the tangent is (-sin(π/2), cos(π/2)) = (-1, 0). Highlight that point and show the tangent vector. Do NOT emit t values past 2π and do NOT add extra cycles. params shape: { curve: [[1,0,0],[0.966,0.259,0.262],[0.866,0.5,0.524],[0.707,0.707,0.785],[0.5,0.866,1.047],[0.259,0.966,1.309],[0,1,1.571],[-0.259,0.966,1.833],[-0.5,0.866,2.094],[-0.707,0.707,2.356],[-0.866,0.5,2.618],[-0.966,0.259,2.880],[-1,0,3.142],[-0.966,-0.259,3.403],[-0.866,-0.5,3.665],[-0.707,-0.707,3.927],[-0.5,-0.866,4.189],[-0.259,-0.966,4.451],[0,-1,4.712],[0.259,-0.966,4.974],[0.5,-0.866,5.236],[0.707,-0.707,5.498],[0.866,-0.5,5.760],[0.966,-0.259,6.021],[1,0,6.283]], xMin:-1.5, xMax:1.5, yMin:-1.5, yMax:1.5, highlightT:{t:1.571,x:0,y:1,label:"t = π/2"}, tangentAtT:{x:0,y:1,dx:-1,dy:0,length:80}, exprLabel:"x = cos t, y = sin t", title:"Unit circle with tangent at t = π/2" }.',
      keyIdeas: [
        'A parametric curve gives x(t) and y(t); t traces a path in the plane.',
        'Tangent vector at t is ⟨dx/dt, dy/dt⟩. For x = cos t, y = sin t at t = π/2: ⟨-1, 0⟩ — points horizontally left.',
        'Slope of tangent line: dy/dx = (dy/dt) / (dx/dt) when dx/dt ≠ 0.',
      ],
      vocabulary: [{ term: 'parametric curve', definition: 'a curve given by (x(t), y(t)).' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-polar',
      kind: 'concept',
      goal: 'Show the cardioid r = 1 + cos θ in polar.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="polar_graph". Use cardioid r = 1 + cos θ on θ ∈ [0, 2π]. USE TUPLE FORMAT [theta, r]. ~30 points. Solver derives x, y. Optionally shade the upper half (θ ∈ [0, π]) — first 16 points of the curve. Sample θ values: 0, π/15, 2π/15, ..., 2π. r = 1 + cos(θ). params shape: { curve: [[0,2],[0.209,1.978],[0.419,1.913],[0.628,1.809],[0.838,1.669],[1.047,1.5],[1.257,1.309],[1.466,1.105],[1.676,0.895],[1.885,0.691],[2.094,0.5],[2.304,0.331],[2.513,0.191],[2.723,0.087],[2.932,0.022],[3.142,0],[3.351,0.022],[3.560,0.087],[3.770,0.191],[3.979,0.331],[4.189,0.5],[4.398,0.691],[4.608,0.895],[4.817,1.105],[5.027,1.309],[5.236,1.5],[5.445,1.669],[5.655,1.809],[5.864,1.913],[6.074,1.978],[6.283,2]], shadeRegion: [[0,2],[0.209,1.978],[0.419,1.913],[0.628,1.809],[0.838,1.669],[1.047,1.5],[1.257,1.309],[1.466,1.105],[1.676,0.895],[1.885,0.691],[2.094,0.5],[2.304,0.331],[2.513,0.191],[2.723,0.087],[2.932,0.022],[3.142,0]], rMax:2.3, showAxes:true, exprLabel:"r = 1 + cos θ", title:"Cardioid r = 1 + cos θ (upper half shaded)" }.',
      keyIdeas: [
        'A polar curve is r = f(θ); the point at angle θ sits at distance |f(θ)| from origin.',
        'Cartesian: x = r cos θ, y = r sin θ.',
        'Polar area: A = (1/2) ∫_α^β r² dθ. Shaded slice corresponds to that integral.',
      ],
      vocabulary: [{ term: 'cardioid', definition: 'a heart-shaped polar curve like r = 1 + cos θ.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-taylor',
      kind: 'concept',
      goal: 'Show f(x) = sin x with three Taylor polynomials (T1, T3, T5) overlaid.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="taylor_polynomial_overlay". Use f(x) = sin x on [-π, π] with center c = 0. USE TUPLE FORMAT [x, y]. ~17 sample points per curve (step = π/8 ≈ 0.393). T1(x) = x; T3(x) = x − x³/6; T5(x) = x − x³/6 + x⁵/120. params shape: { baseCurve: [[-3.142,-0.000],[-2.749,-0.383],[-2.356,-0.707],[-1.963,-0.924],[-1.571,-1],[-1.178,-0.924],[-0.785,-0.707],[-0.393,-0.383],[0,0],[0.393,0.383],[0.785,0.707],[1.178,0.924],[1.571,1],[1.963,0.924],[2.356,0.707],[2.749,0.383],[3.142,0]], approximations:[ {degree:1, curve: [[-3.142,-3.142],[-2.749,-2.749],[-2.356,-2.356],[-1.963,-1.963],[-1.571,-1.571],[-1.178,-1.178],[-0.785,-0.785],[-0.393,-0.393],[0,0],[0.393,0.393],[0.785,0.785],[1.178,1.178],[1.571,1.571],[1.963,1.963],[2.356,2.356],[2.749,2.749],[3.142,3.142]] }, {degree:3, curve: [[-3.142,2.026],[-2.749,0.713],[-2.356,-0.177],[-1.963,-0.701],[-1.571,-0.925],[-1.178,-0.906],[-0.785,-0.705],[-0.393,-0.383],[0,0],[0.393,0.383],[0.785,0.705],[1.178,0.906],[1.571,0.925],[1.963,0.701],[2.356,0.177],[2.749,-0.713],[3.142,-2.026]] }, {degree:5, curve: [[-3.142,-0.524],[-2.749,-0.491],[-2.356,-0.690],[-1.963,-0.918],[-1.571,-1.005],[-1.178,-0.927],[-0.785,-0.707],[-0.393,-0.383],[0,0],[0.393,0.383],[0.785,0.707],[1.178,0.927],[1.571,1.005],[1.963,0.918],[2.356,0.690],[2.749,0.491],[3.142,0.524]] } ], xMin:-3.2, xMax:3.2, yMin:-1.6, yMax:1.6, center:0, exprLabel:"f(x) = sin x", title:"Taylor polynomials of sin x at c = 0" }.',
      keyIdeas: [
        'T_n(x) of f about c matches f and its first n derivatives at c.',
        'For sin x at c = 0: T_1 = x, T_3 = x − x³/6, T_5 = x − x³/6 + x⁵/120.',
        'Higher-degree polynomials hug the curve over a wider interval.',
      ],
      vocabulary: [{ term: 'Taylor polynomial', definition: 'T_n(x) = Σ_{k=0}^n f^{(k)}(c)(x−c)^k/k!.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 5,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five visual tools shipped: riemann_sum, slope_field, parametric_curve, polar_graph, taylor_polynomial_overlay.',
        'Tuple format keeps tool calls within token budget.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: 'TEST',
    cedTopic: 'diagrams',
    cedTitle: 'Diagram Tools Test',
    sources: [{ type: 'internal-test', source: 'AP Plans Initiative', note: 'Single plan exercising all five Phase-10 calculus diagram tools.' }],
  },
};
