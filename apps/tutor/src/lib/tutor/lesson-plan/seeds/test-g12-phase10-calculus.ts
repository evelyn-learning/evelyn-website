/**
 * TEST PLAN — G12 AP Calc BC — Phase 10 stress test.
 *
 * Exercises all 5 Phase 10 calculus kinds:
 *   1. riemann_sum               (rectangles approximating ∫ x² dx)
 *   2. slope_field               (dy/dx = x with solution curve)
 *   3. parametric_curve          (unit circle x=cos t, y=sin t)
 *   4. polar_graph               (cardioid r = 1 + cos θ)
 *   5. taylor_polynomial_overlay (sin x with T₁ and T₃)
 *
 * Uses abstract phrasing in try-yourself.
 */

import type { LessonPlan } from '../types';

// Pre-sampled curves (brain would generate these dynamically; here we
// inline reasonable values to keep the seed self-contained).
function squared(xs: number[]): [number, number][] {
  return xs.map((x): [number, number] => [x, x * x]);
}
function sinCurve(xs: number[]): [number, number][] {
  return xs.map((x): [number, number] => [x, Math.sin(x)]);
}
function range(a: number, b: number, step: number): number[] {
  const out: number[] = [];
  for (let v = a; v <= b + 1e-9; v += step) out.push(Number(v.toFixed(4)));
  return out;
}

export const SEED_TEST_G12_PHASE10_CALCULUS: LessonPlan = {
  id: 'evelyn.test.g12.calculus.phase10.v1',
  title: '[TEST] G12 AP Calc BC — Phase 10 stress test',
  curriculum: 'AP Calculus BC',
  grade: '9-12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'test.phase10.calculus-coverage',
      description: 'Exercise all 5 Phase 10 calculus kinds with scribble + handwrite markings.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind calc test session.',
      script: "We're touring five AP Calc BC visualization tools today. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. riemann_sum ────────────────────────────────────────────
    {
      id: 'concept-riemann-sum',
      kind: 'concept',
      goal: 'Render riemann_sum + scribble on rectangles + handwrite.',
      teacherNote:
        '1. show_diagram with type="riemann_sum" and params:\n' +
        '   { curve: [[0,0],[0.5,0.25],[1,1],[1.5,2.25],[2,4],[2.5,6.25],[3,9]],\n' +
        '     rectangles: [[0,1,0],[1,1,1],[2,1,4]],\n' +
        '     method: "left",\n' +
        '     exprLabel: "f(x) = x²",\n' +
        '     approxArea: 5, exactArea: 9,\n' +
        '     title: "Left Riemann Sum, n=3" }\n\n' +
        '2. tutor_scribble { target: "rectangles", color: "#dc2626", label: "underestimate" }\n' +
        '3. tutor_handwrite { text: "Left sum underestimates an increasing function — gap = 9 − 5 = 4." }\n' +
        '4. Briefly explain left vs right vs midpoint, then advance.',
      keyIdeas: ['Left Riemann sum UNDERestimates an increasing function.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. slope_field ────────────────────────────────────────────
    {
      id: 'concept-slope-field',
      kind: 'concept',
      goal: 'Render slope_field + scribble on solution curve + handwrite.',
      teacherNote:
        '1. show_diagram with type="slope_field" and params (samples form a 5×5 grid for dy/dx = x):\n' +
        '   { samples: [\n' +
        '       [-2,-2,-2],[-1,-2,-1],[0,-2,0],[1,-2,1],[2,-2,2],\n' +
        '       [-2,-1,-2],[-1,-1,-1],[0,-1,0],[1,-1,1],[2,-1,2],\n' +
        '       [-2,0,-2],[-1,0,-1],[0,0,0],[1,0,1],[2,0,2],\n' +
        '       [-2,1,-2],[-1,1,-1],[0,1,0],[1,1,1],[2,1,2],\n' +
        '       [-2,2,-2],[-1,2,-1],[0,2,0],[1,2,1],[2,2,2]\n' +
        '     ],\n' +
        '     solutionCurve: [[-2,2],[-1,0.5],[0,0],[1,0.5],[2,2]],\n' +
        '     highlightPoint: { x: 0, y: 0 },\n' +
        '     exprLabel: "dy/dx = x",\n' +
        '     title: "Slope Field for dy/dx = x" }\n\n' +
        '2. tutor_scribble { target: "solution curve", color: "#dc2626", label: "y = x²/2" }\n' +
        '3. tutor_handwrite { text: "Solving dy/dx = x by separation gives y = x²/2 + C." }\n' +
        '4. Briefly explain how integral curves follow the slopes, then advance.',
      keyIdeas: ['A solution curve\'s tangent matches the slope segment at every point.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. parametric_curve ───────────────────────────────────────
    {
      id: 'concept-parametric-curve',
      kind: 'concept',
      goal: 'Render parametric_curve + scribble on tangent + handwrite.',
      teacherNote:
        '1. show_diagram with type="parametric_curve" and params (unit circle):\n' +
        '   { curve: [\n' +
        '       [1,0,0],[0.866,0.5,0.524],[0.5,0.866,1.047],[0,1,1.571],\n' +
        '       [-0.5,0.866,2.094],[-0.866,0.5,2.618],[-1,0,3.14159],\n' +
        '       [-0.866,-0.5,3.665],[-0.5,-0.866,4.189],[0,-1,4.712],\n' +
        '       [0.5,-0.866,5.236],[0.866,-0.5,5.76],[1,0,6.283]\n' +
        '     ],\n' +
        '     highlightT: { t: 1.047, x: 0.5, y: 0.866, label: "t = π/3" },\n' +
        '     tangentAtT: { x: 0.5, y: 0.866, dx: -0.866, dy: 0.5 },\n' +
        '     exprLabel: "x = cos t, y = sin t",\n' +
        '     title: "Unit Circle" }\n\n' +
        '2. tutor_scribble { target: "tangent vector", color: "#dc2626", label: "velocity at t = π/3" }\n' +
        '3. tutor_handwrite { text: "At t, velocity = ⟨dx/dt, dy/dt⟩ — always perpendicular to the radius for a circle." }\n' +
        '4. Briefly explain the velocity vector geometry, then advance.',
      keyIdeas: ['Parametric velocity = ⟨dx/dt, dy/dt⟩ is tangent to the curve.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. polar_graph ────────────────────────────────────────────
    {
      id: 'concept-polar-graph',
      kind: 'concept',
      goal: 'Render polar_graph + scribble on shaded region + handwrite.',
      teacherNote:
        '1. show_diagram with type="polar_graph" and params (cardioid r = 1 + cos θ):\n' +
        '   { curve: [\n' +
        '       [0,2],[0.524,1.866],[1.047,1.5],[1.571,1],[2.094,0.5],\n' +
        '       [2.618,0.134],[3.14159,0],[3.665,0.134],[4.189,0.5],\n' +
        '       [4.712,1],[5.236,1.5],[5.76,1.866],[6.283,2]\n' +
        '     ],\n' +
        '     shadeRegion: [[0,2],[0.524,1.866],[1.047,1.5],[1.571,1]],\n' +
        '     exprLabel: "r = 1 + cos θ",\n' +
        '     title: "Cardioid r = 1 + cos θ" }\n\n' +
        '2. tutor_scribble { target: "shaded region", color: "#dc2626", label: "area ∫(1/2)r² dθ" }\n' +
        '3. tutor_handwrite { text: "Polar area between θ = 0 and θ = π/2: A = ½ ∫₀^(π/2) (1+cos θ)² dθ." }\n' +
        '4. Briefly explain the polar area formula, then advance.',
      keyIdeas: ['Polar area = ½ ∫ r(θ)² dθ.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. taylor_polynomial_overlay ──────────────────────────────
    {
      id: 'concept-taylor-overlay',
      kind: 'concept',
      goal: 'Render taylor_polynomial_overlay + scribble on T_3 + handwrite.',
      teacherNote:
        '1. show_diagram with type="taylor_polynomial_overlay" and params (sin x):\n' +
        '   { baseCurve: ' + JSON.stringify(sinCurve(range(-3, 3, 0.25))) + ',\n' +
        '     approximations: [\n' +
        '       { degree: 1, curve: ' + JSON.stringify(range(-3, 3, 0.25).map((x): [number, number] => [x, x])) + ' },\n' +
        '       { degree: 3, curve: ' + JSON.stringify(range(-3, 3, 0.25).map((x): [number, number] => [x, x - (x*x*x)/6])) + ' }\n' +
        '     ],\n' +
        '     center: 0,\n' +
        '     exprLabel: "f(x) = sin x",\n' +
        '     title: "Taylor Approximations of sin x at c = 0" }\n\n' +
        '2. tutor_scribble { target: "T3", color: "#16a34a", label: "matches sin x near 0" }\n' +
        '3. tutor_handwrite { text: "T_3(x) = x − x³/6 — already a great fit near x = 0." }\n' +
        '4. Briefly explain why higher-degree Taylor polynomials fit better near c, then advance.',
      keyIdeas: ['T_n(x) approximates f(x) better near the center c as n increases.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ──────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'For an INCREASING function on [a, b], does a LEFT Riemann sum overestimate or underestimate the integral?',
      expectedAnswer: 'underestimate',
      hints: [
        'Each rectangle\'s height is f(x) at the LEFT endpoint of its subinterval.',
        'On an increasing function, the value at the left endpoint is SMALLER than the value to the right.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ─────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Left Riemann sum UNDERestimates an increasing function.',
        'A solution curve is tangent to the slope segments at every point.',
        'Parametric velocity = ⟨dx/dt, dy/dt⟩.',
        'Polar area = ½ ∫ r² dθ.',
        'Higher-degree Taylor polynomials fit better near the center.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose: 'Test seed for Phase 10 (calculus). All 5 kinds × one scribble + one handwrite per concept.',
  },
};
