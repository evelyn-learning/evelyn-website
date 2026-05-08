/**
 * AP Calculus BC — CED Unit 9.8+9.9: Areas Using Polar Curves.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_POLAR_AREA: LessonPlan = {
  id: 'evelyn.ap.calcbc.polar-area.v1', title: 'U9.8 Area in Polar Coordinates',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.polar-area', description: 'Compute the area enclosed by a polar curve r(θ) using A = (1/2)∫_α^β r² dθ. Compute area between two polar curves.', standard: 'AP-CALCBC-9.8-9.9' }],
  prerequisites: ['apcalcbc.polar-coordinates'], followUps: [], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame polar area as integration of pie slices.', script: "In polar, area is built from THIN PIE SLICES, not rectangles. Each slice has area (1/2)r² dθ. Sum: A = (1/2)∫r² dθ.", estimatedMinutes: 2 },
    { id: 'concept-polar-area', kind: 'concept', goal: 'Cover the polar area formula.',
      keyIdeas: [
        'POLAR AREA FORMULA: A = (1/2) ∫_α^β [r(θ)]² dθ for the region bounded by r = r(θ) on θ ∈ [α, β].',
        'DERIVATION: a thin pie slice at angle θ with width dθ has area ≈ (1/2)·r²·dθ (sector formula). Sum: integral.',
        'AREA BETWEEN TWO POLAR CURVES r_1(θ) (outer) and r_2(θ) (inner): A = (1/2)∫_α^β [r_1² − r_2²] dθ.',
        'KEY ISSUE — DETERMINING BOUNDS: find α and β where the curve closes (or where the desired region ends). For ONE LOOP of a polar curve, find where r = 0 (curve passes through origin) or r reaches max/min.',
        'EXAMPLE: r = 2 sin θ (circle of radius 1 centered at (0, 1)). Trace from θ = 0 to θ = π. A = (1/2) ∫_0^π (2 sin θ)² dθ = 2 ∫_0^π sin²θ dθ = 2·π/2 = π. (Matches: circle of radius 1 has area π. ✓)',
        'ROSE CURVES: r = sin(nθ) traces multiple petals as θ varies. AREA OF ONE PETAL: A = (1/2) ∫_α^β sin²(nθ) dθ where (α, β) bound one petal (where r goes 0 → max → 0).',
        'CARDIOID: r = 1 + cos θ. Total enclosed area = (1/2) ∫_0^{2π} (1 + cos θ)² dθ. Expand: 1 + 2 cos θ + cos²θ. Integrate: 2π + 0 + π = 3π. So total area = 3π/2.',
      ],
      vocabulary: [{ term: 'polar area', definition: 'A = (1/2) ∫ r² dθ.' }],
      estimatedMinutes: 5 },
    { id: 'worked-cardioid', kind: 'worked_example', problem: 'Find the area enclosed by the cardioid r = 1 + cos θ.',
      steps: [
        'STEP 1 — Bounds: cardioid traces from θ = 0 to θ = 2π.',
        'STEP 2 — A = (1/2) ∫_0^{2π} (1 + cos θ)² dθ.',
        'STEP 3 — Expand: (1 + cos θ)² = 1 + 2 cos θ + cos²θ. Use cos²θ = (1 + cos 2θ)/2.',
        'STEP 4 — Integrand: 1 + 2 cos θ + 1/2 + (cos 2θ)/2 = 3/2 + 2 cos θ + (cos 2θ)/2.',
        'STEP 5 — Integrate over [0, 2π]: ∫_0^{2π} 3/2 dθ = 3π. ∫ 2 cos θ dθ = 0 (full cycle). ∫ (cos 2θ)/2 dθ = 0 (full cycle). Total = 3π.',
        'STEP 6 — A = (1/2)·3π = 3π/2.',
      ],
      answer: '3π/2', estimatedMinutes: 4 },
    { id: 'try-petal', kind: 'try_yourself', problem: 'Find the area of ONE PETAL of r = sin(2θ). (Hint: a petal exists for 0 ≤ θ ≤ π/2.)',
      expectedAnswer: 'r = 0 at θ = 0 and θ = π/2. One petal traces 0 to π/2. A = (1/2)∫_0^{π/2} sin²(2θ) dθ. Use sin²(2θ) = (1 − cos(4θ))/2. = (1/2)∫_0^{π/2} (1 − cos 4θ)/2 dθ = (1/4)[θ − (sin 4θ)/4]_0^{π/2} = (1/4)·(π/2 − 0) = π/8.',
      responseFormat: 'numeric', hints: ['Bounds where r = 0. Use double-angle to integrate sin²(2θ).'], estimatedMinutes: 4 },
    { id: 'try-between', kind: 'try_yourself', problem: 'AP-style synthesis. Find the area inside r = 2 + 2 sin θ but outside r = 2.',
      expectedAnswer: 'Two curves: cardioid r = 2 + 2 sin θ and circle r = 2. Find intersections: 2 + 2 sin θ = 2 → sin θ = 0 → θ = 0, π. The region "inside cardioid, outside circle" exists where cardioid > circle, i.e., 2 + 2 sin θ > 2, i.e., sin θ > 0, i.e., 0 < θ < π. \nA = (1/2)∫_0^π [(2 + 2 sin θ)² − 2²] dθ = (1/2)∫_0^π (4 + 8 sin θ + 4 sin²θ − 4) dθ = (1/2)∫_0^π (8 sin θ + 4 sin²θ) dθ. \nUse sin²θ = (1 − cos 2θ)/2: 4 sin²θ = 2(1 − cos 2θ) = 2 − 2 cos 2θ. \nIntegrand: 8 sin θ + 2 − 2 cos 2θ. \nIntegrate: -8 cos θ + 2θ − sin 2θ from 0 to π. \nAt π: -8(-1) + 2π − 0 = 8 + 2π. At 0: -8 + 0 − 0 = -8. Difference: (8 + 2π) − (-8) = 16 + 2π. \nA = (1/2)(16 + 2π) = 8 + π.',
      responseFormat: 'frq', hints: ['Find intersection angles; subtract inner from outer; integrate.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'A = (1/2)∫_α^β r² dθ.',
      'Area between two polar curves: A = (1/2)∫(r_outer² − r_inner²) dθ.',
      'Find bounds where r = 0 (or where curves intersect).',
      'Use double-angle identity to handle sin² and cos² in integrand.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.8-9.9', cedTitle: 'Polar Areas', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '10', note: 'Standard polar areas.' }] },
};
