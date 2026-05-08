/**
 * TEST PLAN — Renderer smoke test for concept-map layout + integral notation.
 *
 * QA harness, not production content. Targets two recently-shipped renderer
 * fixes:
 *
 *   1. show_concept_map multi-root layout. The concept segment goal explicitly
 *      asks for two level-0 roots ("Differentiation" and "Integration") with
 *      separate descendant chains, so the brain emits the same structure that
 *      previously produced crossing edges. The fix in ConceptMapRenderer.tsx
 *      should place each root's subtree in its own swim lane — Differentiation
 *      with Rates of Change directly under it, Integration with Accumulated
 *      Totals directly under it, and the three example leaves grouped under
 *      Accumulated Totals on the right side. No edge should cross another node.
 *
 *   2. Integral / sum auto-wrap. Three problem cards exercise three Unicode
 *      math-symbol shapes that previously rendered with literal underscores
 *      and carets:
 *        - ∫_0^4 (alphanumeric token both sides)
 *        - ∫_a^b (single-letter tokens)
 *        - ∑_{i=1}^n (brace token + alphanumeric)
 *      InlineMathText.tsx's autoWrapUnicodeMath pre-pass should convert each
 *      to KaTeX with proper sub/superscript placement.
 *
 * Surfaces invited:
 *   - show_concept_map — the concept hub
 *   - show_segment_card → showProblem — three problem cards exercise the
 *     three math-symbol shapes above.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_RENDERER_SMOKE_CALC: LessonPlan = {
  id: 'evelyn.test.renderer.calc-smoke.v1',
  title: '[TEST] Renderer smoke — concept map + integral notation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.renderer.calc-smoke',
      description: 'Smoke-test the multi-root concept-map layout and the Unicode integral / sum auto-wrap on the whiteboard.',
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
      goal: 'Brief frame: this is a quick rendering test session.',
      script: "This is a short test session for two whiteboard features. We'll see a concept map and a few integral problems. Ready?",
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
      id: 'worked-int-zero-four',
      kind: 'worked_example',
      problem: 'Approximate ∫_0^4 x² dx using LRAM with n = 4 subintervals.',
      steps: [
        'Δx = (4 - 0) / 4 = 1.',
        'Left endpoints: x = 0, 1, 2, 3.',
        'f-values at left endpoints: 0, 1, 4, 9.',
        'LRAM = (0 + 1 + 4 + 9) · 1 = 14.',
      ],
      answer: 'LRAM ≈ 14. (Exact value of ∫_0^4 x² dx = 64/3 ≈ 21.33.)',
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
        'In ∫_a^b f(x) dx, the a and b should render as small subscript / superscript on the integral sign — not as literal underscore and caret characters.',
        '∑_{i=1}^n follows the same rule.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
