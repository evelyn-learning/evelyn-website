/**
 * TEST PLAN — Concept-map renderer smoke test.
 *
 * QA harness, not production content. Exercises the ConceptMapRenderer
 * across four structural variations so layout / curve-routing / label
 * placement / arrow-perimeter-clipping all get pressure-tested in a
 * single session:
 *
 *   1. Multi-root forest (concept-two-sides) — two parallel level-0
 *      hubs with separate descendant chains. Tests the swim-lane
 *      grouping that prevents subtrees from interleaving.
 *
 *   2. Single hub fan-out (concept-defint-hub) — one center node with
 *      5+ outgoing labeled edges. Tests per-source label spread,
 *      label-vs-label collision avoidance, and the perpendicular
 *      entry-offset for arrows that previously stacked at the hub.
 *
 *   3. Deep linear chain (concept-deep-chain) — root → child →
 *      grandchild → great-grandchild (4 levels deep). Tests the
 *      fixed-row-height stacking so nodes don't drift apart vertically
 *      with each added level.
 *
 *   4. Cross-linked diamond (concept-diamond) — a hub with two children
 *      that both connect to a shared grandchild PLUS a long edge from
 *      the hub directly to the grandchild that crosses through the
 *      middle. Tests segment-intersection detection + opposite-side
 *      bow routing for crossing edges.
 *
 * Every variation should render with arrows touching node box edges
 * (not entering the boxes), no crossing edges, no labels overlapping
 * other labels or unrelated nodes, and tight top spacing.
 *
 * Surfaces invited: show_concept_map only.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_RENDERER_SMOKE_CALC: LessonPlan = {
  id: 'evelyn.test.renderer.calc-smoke.v1',
  title: '[TEST] Concept map renderer smoke — 4 layout variations',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.renderer.calc-smoke',
      description: 'Smoke-test the concept-map renderer across multi-root, hub-fan, deep-chain, and crossing-edge structural variations.',
      standard: 'EVELYN-QA',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 6,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Brief frame: this is a renderer smoke test for concept maps.',
      script: "This is a short test for the concept-map renderer. We'll see four maps with different shapes — each one stresses a different part of the layout. Ready?",
      suggestedTools: [],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-sides',
      kind: 'concept',
      goal: 'Render show_concept_map with TWO level-0 roots side by side. Root 1: "Differentiation" → "Rates of Change". Root 2: "Integration" → "Accumulated Totals" → three leaf examples ("Total distance from velocity", "Total area under a curve", "Total revenue from marginal revenue"). Both roots must have explicit level: 0 in the nodes array. Use directed edges. Expected layout: two parallel chains in side-by-side swim lanes, no edges crossing other nodes, arrows touching box edges (not entering them).',
      keyIdeas: [
        'Calculus has TWO sides: differentiation and integration.',
        'Differentiation → finds rates of change.',
        'Integration → finds accumulated totals (e.g. distance from velocity, area under a curve, revenue from marginal revenue).',
        'These two operations are inverse to each other (Fundamental Theorem of Calculus).',
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-defint-hub',
      kind: 'concept',
      goal: 'Render show_concept_map for "Definite Integral" as a single level-0 hub with FIVE outgoing labeled edges fanning out to: "Limit of Riemann Sums" (label "defined as"), "Antiderivative F(x)" (label "evaluated via"), "Signed Area Under Curve" (label "geometric meaning"), "Net Change Theorem" (label "measures"), "Numerical Approximation" (label "computed via"). All targets at level 1. Edges directed FROM hub TO targets. This stresses per-source label spread (5 labels need to fan out), the perimeter arrow clip (5 arrowheads land on different targets), and label-vs-label collision avoidance.',
      keyIdeas: [
        'A definite integral can be understood five different ways.',
        'It is DEFINED as the limit of Riemann sums.',
        'It is EVALUATED via an antiderivative (Fundamental Theorem of Calculus).',
        'Its GEOMETRIC meaning is the signed area under a curve.',
        'It MEASURES net change over the interval (Net Change Theorem).',
        'It can be COMPUTED numerically via Simpson, midpoint, or trapezoidal approximations.',
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 2,
    },
    {
      id: 'concept-deep-chain',
      kind: 'concept',
      goal: 'Render show_concept_map as a DEEP LINEAR CHAIN with 4 levels: "Function f(x)" (level 0) → "Derivative f\'(x)" (level 1, label "differentiate") → "Second Derivative f\'\'(x)" (level 2, label "differentiate again") → "Concavity & Inflection Points" (level 3, label "tells us"). Each level has exactly ONE node. Tests fixed-row-height stacking — each row should be evenly spaced; the chain should NOT stretch with extra empty space between rows.',
      keyIdeas: [
        'Differentiating a function gives its derivative — the rate of change.',
        'Differentiating the derivative gives the SECOND derivative — the rate of change of the rate.',
        'The second derivative tells us about concavity and where the function changes from concave-up to concave-down (inflection points).',
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-diamond',
      kind: 'concept',
      goal: 'Render show_concept_map as a CROSSING-EDGE STRESS TEST. Nodes: "FTC" (level 0), "FTC Part 1" (level 1, label edge from FTC: "states"), "FTC Part 2" (level 1, label edge from FTC: "also states"), "Antiderivative F(x)" (level 2). Edges: FTC → FTC Part 1, FTC → FTC Part 2, FTC Part 1 → Antiderivative (label "produces"), FTC Part 2 → Antiderivative (label "uses"), AND a long edge FTC → Antiderivative directly (label "ultimately gives"). The two row-1 → row-2 edges plus the long FTC → Antiderivative edge create crossings. Renderer should detect crossings and route the long edge with curve in opposite-side bow.',
      keyIdeas: [
        'The Fundamental Theorem of Calculus has two parts that both involve the antiderivative.',
        'Part 1 says the integral of f from a to x produces an antiderivative F.',
        'Part 2 uses an antiderivative F to evaluate the integral as F(b) - F(a).',
        'Both parts ultimately link the integral back to an antiderivative.',
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multi-root maps should lay out roots side-by-side in swim lanes — no interleaved subtrees.',
        'Single-hub fans should spread their labels evenly along each edge — no clustering near the hub.',
        'Deep chains should use compact row spacing — no vertical drift.',
        'Crossing edges should curve in opposite directions — no tangle.',
        'In every map, arrows should touch the node box edges, not enter the boxes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
