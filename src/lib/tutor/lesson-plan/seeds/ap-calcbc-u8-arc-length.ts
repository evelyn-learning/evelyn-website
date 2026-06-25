/**
 * AP Calculus BC — CED Unit 8.13: Arc Length (BC only).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_ARC_LENGTH: LessonPlan = {
  id: 'evelyn.ap.calcbc.arc-length.v1', title: 'U8.13 Arc Length',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.arc-length', description: 'Compute the arc length of a curve y = f(x) on [a, b] using L = ∫_a^b √(1 + [f\'(x)]²) dx. Recognize the formula\'s origin in Pythagorean infinitesimal segments.', standard: 'AP-CALCBC-8.13' }],
  prerequisites: ['apcalcbc.volumes-revolution'], followUps: [], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame arc length as the natural extension of distance to curves.', script: "How long is a curve? On a straight segment, distance is √(Δx² + Δy²). On a curve, integrate that over infinitesimal pieces: L = ∫ √(1 + (dy/dx)²) dx. Beautiful and just integration.", estimatedMinutes: 2 },
    { id: 'concept-arc-length', kind: 'concept', goal: 'Cover the formula and its derivation.',
      keyIdeas: [
        'ARC LENGTH FORMULA: For y = f(x) on [a, b], L = ∫_a^b √(1 + [f\'(x)]²) dx.',
        'DERIVATION (sketch). Tiny segment of arc has length ds = √(dx² + dy²). Factor: ds = √(1 + (dy/dx)²) dx. Sum: L = ∫ √(1 + (dy/dx)²) dx.',
        'ALTERNATIVE — for curves x = g(y): L = ∫_c^d √(1 + (dx/dy)²) dy. Useful when y is the natural integration variable.',
        'PARAMETRIC FORM (will revisit in Unit 9): for x(t), y(t), L = ∫_α^β √((dx/dt)² + (dy/dt)²) dt.',
        'COMPUTING — often the integral isn\'t easy in closed form. AP problems with closed-form answer typically use functions like y = (2/3)x^(3/2), where 1 + (y\')² simplifies nicely.',
        'EXAMPLE: y = (2/3)x^(3/2) on [0, 3]. y\' = x^(1/2) = √x. 1 + (y\')² = 1 + x. L = ∫_0^3 √(1 + x) dx. Substitute u = 1 + x, du = dx: ∫_1^4 √u du = (2/3)[u^(3/2)]_1^4 = (2/3)(8 − 1) = 14/3.',
      ],
      vocabulary: [
        { term: 'arc length', definition: 'length of a curve between two points; computed by integrating √(1 + (dy/dx)²).' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-arc', kind: 'worked_example', problem: 'Find the arc length of y = (2/3)x^(3/2) from x = 0 to x = 3.',
      steps: [
        'STEP 1 — y\' = x^(1/2) = √x.',
        'STEP 2 — 1 + (y\')² = 1 + x.',
        'STEP 3 — L = ∫_0^3 √(1 + x) dx. Substitute u = 1 + x, du = dx, bounds become 1 to 4. ∫_1^4 √u du = [(2/3) u^(3/2)]_1^4 = (2/3)(8 − 1) = 14/3.',
      ],
      answer: 'L = 14/3', estimatedMinutes: 4 },
    { id: 'try-arc', kind: 'try_yourself', problem: 'Find the arc length of y = x^(3/2) from x = 0 to x = 4.',
      expectedAnswer: 'y\' = (3/2) x^(1/2). (y\')² = 9x/4. 1 + (y\')² = 1 + 9x/4 = (4 + 9x)/4. √ = (1/2)√(4 + 9x). L = ∫_0^4 (1/2)√(4 + 9x) dx. Substitute u = 4 + 9x, du = 9 dx, dx = du/9. Bounds: x=0 → u=4; x=4 → u=40. L = (1/2)·(1/9)·∫_4^{40} √u du = (1/18)·[(2/3)u^(3/2)]_4^{40} = (1/27)·(40^(3/2) − 8) = (1/27)·(40√40 − 8). 40√40 = 40·2√10 = 80√10. L = (80√10 − 8)/27.',
      responseFormat: 'numeric', hints: ['Differentiate; square; add 1; integrate via u-sub.'], estimatedMinutes: 5 },
    { id: 'try-setup', kind: 'try_yourself', problem: 'AP-style synthesis. Set up (do NOT evaluate) the integral for the arc length of y = sin x from x = 0 to x = π.',
      expectedAnswer: 'y\' = cos x. (y\')² = cos²x. 1 + cos²x. L = ∫_0^π √(1 + cos²x) dx. (This integral has no closed-form elementary antiderivative — it\'s an elliptic integral. AP would test SETUP only, with computer evaluation if numerical answer needed: L ≈ 3.820.)',
      responseFormat: 'frq', hints: ['Just plug into the formula. Don\'t evaluate if it doesn\'t simplify.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'L = ∫_a^b √(1 + (dy/dx)²) dx.',
      'Choose problems where 1 + (y\')² simplifies (e.g., y = (2/3)x^(3/2)).',
      'For x = g(y): L = ∫ √(1 + (dx/dy)²) dy.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8.13', cedTitle: 'Arc Length (BC)', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Standard arc length.' }] },
};
