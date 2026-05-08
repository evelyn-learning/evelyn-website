/**
 * AP Calculus BC — CED Unit 8.4+8.5+8.6: Area Between Curves.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_AREA_BETWEEN_CURVES: LessonPlan = {
  id: 'evelyn.ap.calcbc.area-between-curves.v1', title: 'U8.4 Area Between Curves',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.area-between-curves', description: 'Compute area between two curves using ∫_a^b [top − bottom] dx (or [right − left] dy). Handle multiple intersections and curves expressed in terms of y.', standard: 'AP-CALCBC-8.4-8.6' }],
  prerequisites: ['apcalcbc.integral-applications'], followUps: ['apcalcbc.volumes-cross-sections'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame area-between as the workhorse 2D-area calculation.', script: "Area between two curves: ∫ [top − bottom] dx. The simple integral that powers a thousand AP problems. Subtleties: which curve is top changes; sometimes you integrate w.r.t. y instead; multiple intersections need careful interval management.", estimatedMinutes: 2 },
    { id: 'concept-area', kind: 'concept', goal: 'Cover the formula and edge cases.',
      keyIdeas: [
        'AREA between f(x) and g(x) on [a, b], where f ≥ g: A = ∫_a^b [f(x) − g(x)] dx. "Top minus bottom".',
        'WHEN CURVES SWAP — if f and g intersect at x = c in (a, b), and f ≥ g on [a, c] but g ≥ f on [c, b], split the integral: A = ∫_a^c (f − g) dx + ∫_c^b (g − f) dx.',
        'INTEGRATE W.R.T. y when curves are functions of y (or it\'s easier to invert): A = ∫_c^d [right − left] dy.',
        'FINDING INTERSECTIONS: solve f(x) = g(x). The solutions are the bounds of integration (or where you split).',
        'EXAMPLE: y = x² and y = x. Intersect at x = 0 and x = 1 (solving x² = x). On [0, 1], x ≥ x² (line above parabola). Area = ∫_0^1 (x − x²) dx = [x²/2 − x³/3]_0^1 = 1/2 − 1/3 = 1/6.',
        'IF ALWAYS NON-NEGATIVE: just compute |f - g| via the integral. If unsure of sign, sketch or test a value.',
        'AP TIP: SKETCH THE REGION. Most exam errors come from misidentifying which curve is on top/bottom.',
      ],
      suggestedTools: ['show_function_graph'], estimatedMinutes: 5 },
    { id: 'worked-simple', kind: 'worked_example', problem: 'Find the area between y = x² and y = 2x on the interval where they bound a region.',
      steps: [
        'STEP 1 — Intersections: x² = 2x → x² − 2x = 0 → x(x − 2) = 0 → x = 0, x = 2.',
        'STEP 2 — Which is top? Test x = 1: y = 1 (parabola) vs y = 2 (line). Line is on TOP between x = 0 and x = 2.',
        'STEP 3 — A = ∫_0^2 (2x − x²) dx = [x² − x³/3]_0^2 = 4 − 8/3 = 4/3.',
      ],
      answer: '4/3', estimatedMinutes: 4 },
    { id: 'try-area', kind: 'try_yourself', problem: 'Find the area between y = x³ and y = x on [0, 1].',
      expectedAnswer: 'Test x = 0.5: x³ = 0.125, x = 0.5. Line on top. A = ∫_0^1 (x − x³) dx = [x²/2 − x⁴/4]_0^1 = 1/2 − 1/4 = 1/4.',
      responseFormat: 'numeric', hints: ['Top minus bottom.'], estimatedMinutes: 3 },
    { id: 'try-with-y', kind: 'try_yourself', problem: 'Find the area enclosed by x = y² and x = y + 2.',
      expectedAnswer: 'Intersections: y² = y + 2 → y² − y − 2 = 0 → (y − 2)(y + 1) = 0 → y = -1, y = 2. INTEGRATE W.R.T. y. Right curve: x = y + 2. Left curve: x = y². Test y = 0: y + 2 = 2; y² = 0. Right is the line. A = ∫_{-1}^2 [(y + 2) − y²] dy = [y²/2 + 2y − y³/3]_{-1}^2 = (2 + 4 − 8/3) − (1/2 − 2 + 1/3) = (6 − 8/3) − (-2/3 − 3/2) = (10/3) − (-13/6) = 20/6 + 13/6 = 33/6 = 11/2.',
      responseFormat: 'numeric', hints: ['Curves are functions of y. Integrate dy. Right minus left.'], estimatedMinutes: 5 },
    { id: 'try-multiple-intersections', kind: 'try_yourself', problem: 'AP-style synthesis. Find the area between y = sin x and y = x² on [0, π/2].',
      expectedAnswer: 'Intersections: sin(x) = x². At x = 0, both = 0. At x = π/2 ≈ 1.57, sin = 1, x² ≈ 2.47. Solve sin x = x² numerically: visible solution at x = 0 and around x ≈ 0.876 (computer). For [0, π/2] we have the curves crossing at x ≈ 0.876. On [0, ~0.876], sin x > x² (concave-down sine starts above x² for small x; verify: at x = 0.5, sin ≈ 0.479, x² = 0.25 → sin above). On [~0.876, π/2], x² > sin x. So total area = ∫_0^{0.876} (sin − x²) dx + ∫_{0.876}^{π/2} (x² − sin) dx. (For full AP credit: solve numerically and compute. The exact intersection requires Newton\'s method or graphing tech.) Strong answers: identify need to find intersection; split interval; sum signed differences as absolute values.',
      responseFormat: 'frq', hints: ['Find where curves cross; split interval; integrate top − bottom on each piece.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Area = ∫ [top − bottom] dx (or right − left dy).',
      'Find intersections by solving f = g.',
      'If curves swap, split the integral.',
      'Sketch the region; verify which is top.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8.4-8.6', cedTitle: 'Area Between Curves', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Standard area between curves.' }] },
};
