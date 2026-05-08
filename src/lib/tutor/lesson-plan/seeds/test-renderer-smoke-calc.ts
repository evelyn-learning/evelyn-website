/**
 * TEST PLAN — Renderer smoke test for concept-map layout, integral
 * notation, and core calc render tools (function graph, table, equation).
 *
 * QA harness, not production content. Targets recently-shipped renderer
 * fixes plus stress-tests three additional rendering surfaces commonly
 * used in calculus lessons.
 *
 *   1. show_concept_map multi-root layout. Concept segment goal asks for
 *      two level-0 roots ("Differentiation" / "Integration") with separate
 *      descendant chains. ConceptMapRenderer should place each root's
 *      subtree in its own swim lane with no edges crossing other nodes.
 *
 *   2. Integral / sum auto-wrap. Three problem cards exercise three
 *      Unicode math-symbol shapes that previously rendered with literal
 *      underscores and carets:
 *        - ∫_0^4 (alphanumeric token both sides)
 *        - ∫_a^b (single-letter tokens)
 *        - ∑_{i=1}^n (brace token + alphanumeric)
 *      InlineMathText autoWrapUnicodeMath should convert each to KaTeX
 *      with proper sub/superscript placement.
 *
 *   3. show_function_graph. A worked example invites the brain to plot
 *      y = x² with the area under the curve from 0 to 4 shaded, exercising
 *      the function-plotter renderer's domain/range/shading params.
 *
 *   4. show_table. A worked example invites a 5-row comparison table of
 *      LRAM / RRAM / MRAM / Trapezoidal / Actual values, exercising
 *      multi-column tabular rendering.
 *
 *   5. show_equation. A concept segment invites the Fundamental Theorem
 *      of Calculus formula as a standalone equation card, exercising
 *      KaTeX block-mode rendering for a multi-symbol formula.
 *
 * Surfaces invited:
 *   - show_concept_map
 *   - show_function_graph
 *   - show_table
 *   - show_equation
 *   - show_segment_card → showProblem (problem statement w/ math chars)
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_RENDERER_SMOKE_CALC: LessonPlan = {
  id: 'evelyn.test.renderer.calc-smoke.v1',
  title: '[TEST] Renderer smoke — concept map, integrals, graph, table, equation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.renderer.calc-smoke',
      description: 'Smoke-test multi-root concept maps, Unicode integral / sum auto-wrap, function graph plotting, table rendering, and equation cards.',
      standard: 'EVELYN-QA',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Brief frame: this is a renderer smoke test.',
      script: "This is a short test session that exercises several whiteboard renderers — a concept map, integral notation, a function graph, a comparison table, and an equation card. Ready?",
      suggestedTools: [],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-sides',
      kind: 'concept',
      goal: 'Render show_concept_map with TWO level-0 roots side by side. Root 1: "Differentiation" → "Rates of Change". Root 2: "Integration" → "Accumulated Totals" → three leaf examples ("Total distance from velocity", "Total area under a curve", "Total revenue from marginal revenue"). Both roots must have explicit level: 0 in the nodes array. Use directed edges. The expected layout is two parallel chains; no edges should cross other nodes.',
      keyIdeas: [
        'Calculus has TWO sides: differentiation and integration.',
        'Differentiation → finds rates of change.',
        'Integration → finds accumulated totals (e.g. distance from velocity, area under a curve, revenue from marginal revenue).',
        'These two operations are inverse to each other (Fundamental Theorem of Calculus).',
      ],
      vocabulary: [
        { term: 'differentiation', definition: 'the operation that finds the rate of change of a function.' },
        { term: 'integration', definition: 'the operation that finds the accumulated total / area / running sum.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ftc-equation',
      kind: 'concept',
      goal: 'Render the Fundamental Theorem of Calculus as a standalone equation card via show_equation. Expected LaTeX: \\int_a^b f(x)\\,dx = F(b) - F(a). Briefly narrate what each part means. This exercises block-mode KaTeX rendering for a multi-symbol formula.',
      keyIdeas: [
        'The Fundamental Theorem of Calculus connects integration to antidifferentiation.',
        'If F is any antiderivative of f on [a, b], then ∫_a^b f(x) dx = F(b) - F(a).',
        'In other words: to evaluate a definite integral, find an antiderivative and subtract its values at the bounds.',
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'worked-int-zero-four',
      kind: 'worked_example',
      problem: 'Approximate ∫_0^4 x² dx using LRAM with n = 4 subintervals. After computing, render a comparison table via show_table with columns "Method", "Approximation", "Error vs Actual" and rows for LRAM (14), RRAM (30), MRAM (21), Trapezoidal (22), Actual (64/3 ≈ 21.33). Errors are signed differences from Actual.',
      steps: [
        'Δx = (4 - 0) / 4 = 1.',
        'Left endpoints: x = 0, 1, 2, 3.',
        'f-values at left endpoints: 0, 1, 4, 9.',
        'LRAM = (0 + 1 + 4 + 9) · 1 = 14.',
        'After computing LRAM, render the comparison table covering all four methods plus the actual value.',
      ],
      answer: 'LRAM ≈ 14. The comparison table should show LRAM=14, RRAM=30, MRAM=21, Trapezoidal=22, Actual=64/3≈21.33.',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-graph-area',
      kind: 'worked_example',
      problem: 'Visualize the integral ∫_0^4 x² dx geometrically. Render show_function_graph with the function y = x² over the domain [0, 4], with the area between the curve and the x-axis from x=0 to x=4 shaded. Add a label noting the shaded area equals 64/3.',
      steps: [
        'Plot y = x² from x = 0 to x = 4. Suggested y-range: 0 to 16.',
        'Shade the region between the curve and the x-axis on [0, 4].',
        'Annotate that the shaded area equals the value of the definite integral, 64/3 ≈ 21.33.',
      ],
      answer: 'Shaded area under y = x² on [0, 4] equals ∫_0^4 x² dx = 64/3 ≈ 21.33.',
      estimatedMinutes: 2,
    },
    {
      id: 'try-int-a-b',
      kind: 'try_yourself',
      problem: 'If ∫_a^b f(x) dx = 12 and ∫_a^b g(x) dx = 5, what is ∫_a^b [f(x) + g(x)] dx?',
      expectedAnswer: '17',
      responseFormat: 'numeric',
      hints: [
        'Integration is linear: the integral of a sum is the sum of the integrals.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'try-sum',
      kind: 'try_yourself',
      problem: 'Compute ∑_{i=1}^4 i².',
      expectedAnswer: '30',
      responseFormat: 'numeric',
      hints: [
        'Square each integer from 1 to 4 and add them.',
        '1² + 2² + 3² + 4² = ?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Differentiation = rates. Integration = accumulation. They are inverse operations.',
        'FTC: ∫_a^b f(x) dx = F(b) - F(a) where F is any antiderivative of f.',
        'In ∫_a^b f(x) dx, the a and b should render as small subscript / superscript on the integral sign — not as literal underscore and caret characters.',
        '∑_{i=1}^n follows the same rule.',
        'show_function_graph, show_table, and show_equation cards should each render cleanly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
