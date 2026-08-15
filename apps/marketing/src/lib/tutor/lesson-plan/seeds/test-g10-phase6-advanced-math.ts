/**
 * TEST PLAN — G10 advanced math — Phase 6 stress test.
 *
 * Exercises all 3 Phase 6 advanced-math kinds:
 *   1. unit_circle      (SVG — circle + angle ray + sin/cos lines + endpoint)
 *   2. transformation   (SVG — pre-image + image + transform label)
 *   3. inequality_graph (SVG — number line + ray + endpoint + label)
 *
 * Pass criteria per session:
 *   - 3 diagrams render (one per concept segment).
 *   - 3 tutor_scribble calls land on explicit targets.
 *   - 3 tutor_handwrite entries appear in the strip.
 *   - No `[VoiceTutor] scribble-reject` warnings.
 *   - Strip entries use friendly displayName:
 *       "sin → ..." (NOT "sin-line → ...")
 *       "pre-image → ..." (NOT "preimage → ...")
 *       "endpoint at 3 → ..." (NOT "endpoint → ...")
 *   - PDF export contains all 3 diagrams + their markings.
 *   - Brain emits show_diagram(type: "unit_circle") — NOT the legacy
 *     show_unit_circle tool. Verifies deprecation pointer works.
 *
 * Run:
 *   1. http://localhost:3001/tutor → Math → 10 → Algebra II / Trigonometry.
 *   2. Pick "[TEST] G10 advanced math — Phase 6 stress test".
 *   3. Hard-refresh (Cmd+Shift+R) before starting.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G10_PHASE6_ADVANCED_MATH: LessonPlan = {
  id: 'evelyn.test.g10.advanced-math.phase6.v1',
  title: '[TEST] G10 advanced math — Phase 6 stress test',
  curriculum: 'Common Core',
  grade: '9-12',
  subject: 'math',
  topic: 'algebra ii',
  locale: 'en',
  los: [
    {
      id: 'test.phase6.advanced-math-coverage',
      description:
        'Exercise all 3 Phase 6 advanced-math kinds (unit_circle, transformation, inequality_graph) with scribble + handwrite markings per kind.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind advanced-math test session.',
      script:
        "We're going to look at three visual tools for high-school math: the unit circle, geometric transformations, and inequality graphs. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. unit_circle ─────────────────────────────────────────────
    {
      id: 'concept-unit-circle',
      kind: 'concept',
      goal: 'Render a unit_circle + scribble + handwrite on the sin component.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="unit_circle" and params:\n' +
        '   { angleDegrees: 60, showSinCos: true, title: "Unit Circle at 60°" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "sin", color: "#16a34a", label: "y-component" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "At 60°, sin = √3/2 ≈ 0.87, cos = 1/2 = 0.5." }\n\n' +
        '4. Briefly explain how sin and cos read off the unit circle, then advance.\n\n' +
        'IMPORTANT: Use show_diagram(type: "unit_circle"), NOT the legacy show_unit_circle tool.',
      keyIdeas: [
        'sin θ = y-coordinate of the point on the unit circle at angle θ.',
        'cos θ = x-coordinate of the point on the unit circle at angle θ.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. transformation ──────────────────────────────────────────
    {
      id: 'concept-transformation',
      kind: 'concept',
      goal: 'Render a transformation + scribble + handwrite on the image.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="transformation" and params:\n' +
        '   { shape: { type: "triangle", vertices: [{x: -3, y: 1}, {x: -1, y: 1}, {x: -2, y: 3}] },\n' +
        '     transform: { type: "translate", tx: 4, ty: -2 },\n' +
        '     title: "Translate (4, -2)" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "image", color: "#dc2626", label: "after translation" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Translation: shift every vertex by (Δx, Δy) = (4, -2)." }\n\n' +
        '4. Briefly explain translation as a rigid motion (preserves shape + size), then advance.',
      keyIdeas: [
        'Translation = slide. Add (tx, ty) to every vertex.',
        'Translations preserve shape AND size (rigid motion).',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. inequality_graph ────────────────────────────────────────
    {
      id: 'concept-inequality-graph',
      kind: 'concept',
      goal: 'Render an inequality_graph + scribble + handwrite on the endpoint.',
      teacherNote:
        'STEP-BY-STEP TOOL SEQUENCE:\n\n' +
        '1. Use show_diagram with type="inequality_graph" and params:\n' +
        '   { variable: "x", operator: "<=", value: 3, title: "x ≤ 3" }\n\n' +
        '2. After it renders, emit ONE tutor_scribble:\n' +
        '   { target: "closed circle", color: "#dc2626", label: "≤ includes 3" }\n\n' +
        '3. Emit ONE tutor_handwrite:\n' +
        '   { text: "Closed circle = endpoint INCLUDED (≤ or ≥). Open circle = NOT included (< or >)." }\n\n' +
        '4. Briefly explain the closed/open convention, then advance.',
      keyIdeas: [
        '≤ and ≥ use a closed (filled) endpoint.',
        '< and > use an open (hollow) endpoint.',
      ],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ───────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      // Use abstract phrasing so the brain's emitted show_problem
      // doesn't contradict a hard-coded value baked into the lesson-
      // plan state. (2026-05-13 testing: when the seed said "x > 5"
      // and the brain emitted a show_problem about "x > -4", the
      // judge saw both numbers in its snapshot and cascaded KILLs
      // into MAX_VALIDATOR_RETRIES.)
      problem:
        'For a strict inequality like x > a, should the endpoint at a be a closed (filled) circle or an open (hollow) circle?',
      expectedAnswer: 'open',
      hints: [
        'Strict inequality (just > or <) does NOT include the endpoint.',
        'The endpoint is included only when the operator has the bar (≤ or ≥).',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ──────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On the unit circle: sin = y, cos = x of the angle\'s endpoint.',
        'Translation = slide; preserves shape + size.',
        '≤ / ≥ → closed endpoint; < / > → open endpoint.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose:
      'Test seed for Phase 6 (advanced math). Exercises all 3 Phase 6 kinds with explicit teacherNote directives forcing one tutor_scribble + one tutor_handwrite per diagram. Also verifies the brain prefers show_diagram(type: "unit_circle") over the deprecated show_unit_circle tool.',
  },
};
