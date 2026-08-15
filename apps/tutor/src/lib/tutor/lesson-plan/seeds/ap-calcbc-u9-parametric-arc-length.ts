/**
 * AP Calculus BC — CED Unit 9.3: Parametric Arc Length.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_PARAMETRIC_ARC_LENGTH: LessonPlan = {
  id: 'evelyn.ap.calcbc.parametric-arc-length.v1', title: 'U9.3 Arc Length of Parametric Curves',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.parametric-arc-length', description: 'Compute arc length of a parametric curve x(t), y(t) from t = α to t = β using L = ∫_α^β √((dx/dt)² + (dy/dt)²) dt.', standard: 'AP-CALCBC-9.3' }],
  prerequisites: ['apcalcbc.parametric'], followUps: ['apcalcbc.vector-valued'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame parametric arc length as the natural extension.', script: "If x and y depend on t, arc length integrates √((dx/dt)² + (dy/dt)²) dt. This generalizes y = f(x) arc length and applies to ANY parametric curve.", estimatedMinutes: 2 },
    { id: 'concept-parametric-arc', kind: 'concept', goal: 'Cover the formula and standard examples.',
      keyIdeas: [
        'PARAMETRIC ARC LENGTH: L = ∫_α^β √((dx/dt)² + (dy/dt)²) dt.',
        'DERIVATION: ds² = dx² + dy². Factor dt: ds = √((dx/dt)² + (dy/dt)²) dt.',
        'CONNECTION TO y = f(x) FORM: if x = t and y = f(t), then dx/dt = 1, dy/dt = f\'(t). L = ∫ √(1 + f\'(t)²) dt — same as Unit 8.12 formula.',
        'EXAMPLE: x = cos t, y = sin t for t ∈ [0, 2π]. dx/dt = -sin t, dy/dt = cos t. (dx/dt)² + (dy/dt)² = sin²t + cos²t = 1. L = ∫_0^{2π} 1 dt = 2π. ✓ (Circumference of unit circle.)',
      ],
      vocabulary: [{ term: 'parametric arc length', definition: 'L = ∫ √((dx/dt)² + (dy/dt)²) dt.' }],
      estimatedMinutes: 4 },
    { id: 'worked-arc', kind: 'worked_example', problem: 'Find the arc length of x = 3t², y = 2t³ from t = 0 to t = 1.',
      steps: [
        'STEP 1 — dx/dt = 6t. dy/dt = 6t².',
        'STEP 2 — (dx/dt)² + (dy/dt)² = 36t² + 36t⁴ = 36t²(1 + t²).',
        'STEP 3 — √ = 6t√(1 + t²). (For t ≥ 0.)',
        'STEP 4 — L = ∫_0^1 6t√(1 + t²) dt. u-sub: u = 1 + t², du = 2t dt. 6t dt = 3 du. ∫_1^2 3√u du = 3·[(2/3)u^(3/2)]_1^2 = 2·(2^(3/2) − 1) = 2(2√2 − 1) = 4√2 − 2.',
      ],
      answer: 'L = 4√2 − 2', estimatedMinutes: 4 },
    { id: 'try-arc', kind: 'try_yourself', problem: 'Find the arc length of x = 2 sin t, y = 2 cos t from t = 0 to t = π/2.',
      expectedAnswer: 'dx/dt = 2 cos t. dy/dt = -2 sin t. (dx/dt)² + (dy/dt)² = 4 cos²t + 4 sin²t = 4. √ = 2. L = ∫_0^{π/2} 2 dt = π. (Quarter of circumference of circle of radius 2 = π.) ✓',
      responseFormat: 'numeric', hints: ['Pythagorean identity simplifies dramatically.'], estimatedMinutes: 3 },
    { id: 'try-setup', kind: 'try_yourself', problem: 'AP-style synthesis. Set up (don\'t evaluate) the arc length integral for x = t², y = ln t from t = 1 to t = e.',
      expectedAnswer: 'dx/dt = 2t. dy/dt = 1/t. (dx/dt)² + (dy/dt)² = 4t² + 1/t² = (4t⁴ + 1)/t². √ = √(4t⁴ + 1)/|t| = √(4t⁴ + 1)/t (since t > 0). L = ∫_1^e √(4t⁴ + 1)/t dt.',
      responseFormat: 'frq', hints: ['Plug into the formula. Don\'t worry about evaluating.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'L = ∫_α^β √((dx/dt)² + (dy/dt)²) dt.',
      'Reduces to standard arc length when x = t.',
      'For circular motion: simplifies via Pythagorean identity.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Parametric Arc Length', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '10', note: 'Standard parametric arc length.' }] },
};
