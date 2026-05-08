/**
 * Test plan — exercises all 5 Phase-10 calculus diagram kinds in one
 * lesson. Each concept segment carries a teacherNote pinning the brain
 * to a specific show_diagram kind so a single test session covers:
 *   1. riemann_sum
 *   2. slope_field
 *   3. parametric_curve
 *   4. polar_graph
 *   5. taylor_polynomial_overlay
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_TEST_CALC_DIAGRAMS_TOUR: LessonPlan = {
  id: 'evelyn.test.calc-diagrams-tour.v1',
  title: 'Calc BC Diagram Tools — Visual Tour',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'test.calcbc.diagrams', description: 'Brief tour exercising the five Calc BC diagram tools (riemann_sum, slope_field, parametric_curve, polar_graph, taylor_polynomial_overlay) in a single session.', standard: 'INTERNAL-TEST' }],
  prerequisites: [], followUps: [], estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the session as a quick visual tour of five Calc BC diagram tools.',
      script: "We're taking a fast tour of five visualizations central to Calc BC — Riemann sums, slope fields, parametric curves, polar graphs, and Taylor approximations. One picture per concept; we'll move quickly.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-riemann',
      kind: 'concept',
      goal: 'Show how a Riemann sum approximates a definite integral with rectangles.',
      teacherNote: 'MUST call show_diagram with kind="riemann_sum". Use f(x) = x² on [0, 2] with n = 4 LEFT rectangles. Pre-sample the curve densely (≥40 points) and pre-compute each rectangle. Approx area = 1.75; exact area = 8/3 ≈ 2.667. Param shape (place under params field): { curve:[{x,y}…], rectangles:[{x,width,height}…], xMin:0, xMax:2, yMin:0, yMax:4.5, method:"left", n:4, exprLabel:"f(x) = x²", approxArea:1.75, exactArea:2.6667, title:"Left Riemann sum, n = 4" }. Tip: rectangle heights for left-rule on [0,2] step 0.5 are 0², 0.5², 1², 1.5² = 0, 0.25, 1, 2.25.',
      keyIdeas: [
        'A Riemann sum approximates the area under f(x) on [a, b] using n rectangles.',
        'Left rule: rectangle height = f at LEFT edge of each subinterval. Right, midpoint, and trapezoidal rules use other choices.',
        'As n → ∞, the Riemann sum converges to ∫_a^b f(x) dx.',
        'For f(x) = x² on [0, 2], the LEFT sum with n = 4 is 1.75; the exact integral is 8/3 ≈ 2.667. The left rule UNDERESTIMATES because f is increasing.',
      ],
      vocabulary: [
        { term: 'Riemann sum', definition: 'Σ f(x_i) Δx — finite-rectangle estimate of an integral.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-slope-field',
      kind: 'concept',
      goal: 'Show how a slope field visualizes solutions of dy/dx = f(x, y).',
      teacherNote: 'MUST call show_diagram with kind="slope_field". Use dy/dx = x + y. Sample on a 9×9 grid covering x ∈ [-3, 3], y ∈ [-3, 3] (so 81 samples; step = 0.75). Include a solution curve through (0, 0) — sample y\'(x) = -1 - x + e^x at ≥40 dense x-values in [-2, 2]. Highlight the point (0, 0). Param shape: { samples:[{x,y,slope}…81 entries], xMin:-3, xMax:3, yMin:-3, yMax:3, solutionCurve:[{x,y}…], highlightPoint:{x:0,y:0}, exprLabel:"dy/dx = x + y", title:"Slope field for dy/dx = x + y" }. The closed-form solution through origin is y = -1 - x + e^x — verify: y\'(x) = -1 + e^x = -1 + (1 + x + y) = x + y. ✓',
      keyIdeas: [
        'A slope field shows dy/dx at each lattice point as a small line segment whose slope is f(x, y).',
        'The set of segments traces out the FAMILY of solution curves; specific solutions follow the local slopes.',
        'You can sketch a particular solution by starting at an initial condition and following the segments.',
      ],
      vocabulary: [
        { term: 'slope field', definition: 'a grid of slope vectors visualizing dy/dx = f(x, y).' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-parametric',
      kind: 'concept',
      goal: 'Show a parametric curve with a tangent vector at a chosen t.',
      teacherNote: 'MUST call show_diagram with kind="parametric_curve". Use the cycloid-like curve x = t - sin t, y = 1 - cos t for t ∈ [0, 2π]. Sample at ≥50 t-values. Highlight t = π/2 (point ≈ (π/2 - 1, 1)). Show tangent vector at t = π/2: dx/dt = 1 - cos t, dy/dt = sin t → at t = π/2 these are (1, 1). Param shape: { curve:[{x,y,t}…50], xMin:-0.5, xMax:6.5, yMin:-0.3, yMax:2.5, highlightT:{t:1.5708,x:0.5708,y:1,label:"t = π/2"}, tangentAtT:{x:0.5708,y:1,dx:1,dy:1,length:80}, exprLabel:"x = t − sin t, y = 1 − cos t", title:"Parametric cycloid with tangent at t = π/2" }.',
      keyIdeas: [
        'A parametric curve is given by x(t) and y(t); the parameter t traces out a path in the (x, y)-plane.',
        'The TANGENT VECTOR at parameter t is ⟨dx/dt, dy/dt⟩. Slope of the tangent line: dy/dx = (dy/dt) / (dx/dt).',
        'Tangent vectors fail to be horizontal/vertical only when the corresponding component derivative is zero.',
      ],
      vocabulary: [
        { term: 'parametric curve', definition: 'a curve given by (x(t), y(t)).' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-polar',
      kind: 'concept',
      goal: 'Show a cardioid in polar with one petal-region shaded for an area integral.',
      teacherNote: 'MUST call show_diagram with kind="polar_graph". Use the cardioid r = 1 + cos θ for θ ∈ [0, 2π]. Sample at ≥80 θ-values. Shade the upper half (θ ∈ [0, π]) by passing that subset as shadeRegion. Param shape: { curve:[{theta,r,x,y}…80], shadeRegion:[{theta,r,x,y}…40 (subset for 0..π)], rMax:2.3, showAxes:true, exprLabel:"r = 1 + cos θ", title:"Cardioid r = 1 + cos θ (upper half shaded)" }. Reminder: x = r cos θ, y = r sin θ. The shaded area is (1/2)∫_0^π (1 + cos θ)² dθ = 3π/4.',
      keyIdeas: [
        'A polar curve is given by r = f(θ); the point at angle θ is at distance |f(θ)| from the origin.',
        'Convert to Cartesian: x = r cos θ, y = r sin θ.',
        'Area enclosed by a polar curve on [α, β] is (1/2)∫_α^β r² dθ. The shaded slice corresponds to that integral.',
      ],
      vocabulary: [
        { term: 'cardioid', definition: 'a heart-shaped polar curve like r = 1 + cos θ.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-taylor',
      kind: 'concept',
      goal: 'Show f(x) = sin x with three Taylor polynomials (T1, T3, T5) overlaid.',
      teacherNote: 'MUST call show_diagram with kind="taylor_polynomial_overlay". Use f(x) = sin x on x ∈ [-π, π] with center c = 0. Provide baseCurve sampled densely (≥60 points). Approximations: T1(x) = x; T3(x) = x − x³/6; T5(x) = x − x³/6 + x⁵/120. Sample each over the same x range. Param shape: { baseCurve:[{x,y}…60], approximations:[{degree:1,curve:[{x,y}…60]},{degree:3,curve:[…]},{degree:5,curve:[…]}], xMin:-3.2, xMax:3.2, yMin:-1.6, yMax:1.6, center:0, exprLabel:"f(x) = sin x", title:"Taylor polynomials of sin x at c = 0" }. The student should SEE that higher-degree polynomials match sin x over a wider interval.',
      keyIdeas: [
        'A Taylor polynomial T_n(x) of f about c matches f and its first n derivatives at c.',
        'T_n(x) is exact AT c, very accurate near c, and increasingly accurate farther from c as n grows.',
        'For sin x at c = 0: T_1 = x, T_3 = x − x³/6, T_5 = x − x³/6 + x⁵/120. Each odd-degree term tracks a higher derivative of sin.',
      ],
      vocabulary: [
        { term: 'Taylor polynomial', definition: 'T_n(x) = Σ_{k=0}^n f^{(k)}(c)(x−c)^k/k!.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 5,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five visual tools shipped: riemann_sum, slope_field, parametric_curve, polar_graph, taylor_polynomial_overlay.',
        'Each takes pre-sampled data; the brain does the math, the renderer just draws.',
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
