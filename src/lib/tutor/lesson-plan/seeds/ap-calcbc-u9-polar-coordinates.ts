/**
 * AP Calculus BC — CED Unit 9.7: Polar Coordinates and Differentiation.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_POLAR_COORDINATES: LessonPlan = {
  id: 'evelyn.ap.calcbc.polar-coordinates.v1', title: 'U9.7 Polar Coordinates and Differentiation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.polar-coordinates', description: 'Convert between Cartesian and polar; differentiate polar curves r(θ) using x = r cos θ, y = r sin θ; compute dy/dx for polar curves.', standard: 'AP-CALCBC-9.7' }],
  prerequisites: ['apcalcbc.vector-valued'], followUps: ['apcalcbc.polar-area'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame polar as a different way to describe points.', script: "Polar coordinates: a point is (r, θ) — distance from origin and angle from positive x-axis. Better than Cartesian for circles, spirals, and rose curves. Differentiation in polar uses parametric techniques.", estimatedMinutes: 2 },
    { id: 'concept-polar', kind: 'concept', goal: 'Cover polar definition + conversions + differentiation.',
      keyIdeas: [
        'POLAR COORDINATES: a point is (r, θ) where r is the DISTANCE from origin and θ is the ANGLE measured from the positive x-axis.',
        'CARTESIAN-POLAR CONVERSION: x = r cos θ; y = r sin θ. Reverse: r² = x² + y²; tan θ = y/x.',
        'POLAR EQUATIONS: r = f(θ). Examples: r = 1 (circle radius 1), r = 2 cos θ (circle), r = 1 + cos θ (cardioid), r = sin(3θ) (3-petaled rose).',
        'POLAR CURVES PARAMETRIZED: take θ as parameter. x(θ) = r(θ) cos θ; y(θ) = r(θ) sin θ.',
        'DIFFERENTIATING IN POLAR: dy/dx = (dy/dθ)/(dx/dθ).',
        'dx/dθ = r\' cos θ − r sin θ.',
        'dy/dθ = r\' sin θ + r cos θ.',
        '(Both follow from product rule applied to x = r·cos θ and y = r·sin θ.)',
        'HORIZONTAL TANGENT: dy/dθ = 0 (with dx/dθ ≠ 0). VERTICAL TANGENT: dx/dθ = 0 (with dy/dθ ≠ 0).',
        'EXAMPLE: r = 2 sin θ. x = 2 sin θ cos θ = sin(2θ). y = 2 sin²θ = 1 − cos(2θ). dx/dθ = 2 cos(2θ). dy/dθ = 2 sin(2θ). dy/dx = sin(2θ)/cos(2θ) = tan(2θ).',
      ],
      vocabulary: [
        { term: 'polar coordinates', definition: '(r, θ): distance from origin and angle from positive x-axis.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-convert', kind: 'worked_example', problem: 'Convert (a) (r, θ) = (3, π/4) to Cartesian. (b) (x, y) = (-1, √3) to polar.',
      steps: [
        '(a) x = 3 cos(π/4) = 3·√2/2 = 3√2/2. y = 3 sin(π/4) = 3√2/2. Cartesian: (3√2/2, 3√2/2).',
        '(b) r = √(1 + 3) = 2. tan θ = √3/(-1) = -√3. (-1, √3) is in Q2 (x < 0, y > 0). θ = π − π/3 = 2π/3. Polar: (2, 2π/3).',
      ],
      answer: '(a) (3√2/2, 3√2/2). (b) (2, 2π/3).', estimatedMinutes: 3 },
    { id: 'try-derivative', kind: 'try_yourself', problem: 'For r = 1 + cos θ (cardioid), find dy/dx at θ = π/2.',
      expectedAnswer: 'r = 1 + cos θ. r\' = -sin θ. dx/dθ = r\' cos θ − r sin θ = -sin θ cos θ − (1 + cos θ) sin θ = -sin θ(cos θ + 1 + cos θ) = -sin θ(2 cos θ + 1). dy/dθ = r\' sin θ + r cos θ = -sin²θ + (1 + cos θ) cos θ = -sin²θ + cos θ + cos²θ = cos θ + (cos²θ − sin²θ) = cos θ + cos(2θ). At θ = π/2: dx/dθ = -(1)(0 + 1) = -1. dy/dθ = 0 + cos(π) = -1. dy/dx = -1/-1 = 1.',
      responseFormat: 'numeric', hints: ['Use dx/dθ and dy/dθ formulas; evaluate at θ.'], estimatedMinutes: 5 },
    { id: 'try-polar-types', kind: 'try_yourself', problem: 'AP-style synthesis. Identify the type of polar curve. (a) r = 4 cos θ. (b) r = 1 + 2 sin θ. (c) r = sin(2θ).',
      expectedAnswer: '(a) r = 2a cos θ form: CIRCLE through origin with center on x-axis. r = 4 cos θ has center (2, 0), radius 2. (b) Limaçon (or cardioid if |a| = |b|): r = 1 + 2 sin θ has |b| > |a| → INNER LOOP. (c) ROSE CURVE r = sin(nθ). n = 2 (even) gives 2n = 4 petals. Note: rose curves r = sin(nθ) or r = cos(nθ) have n petals if n is odd, 2n if n is even.',
      responseFormat: 'free', hints: ['Recognize polar-curve families: circle, limaçon, rose.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'x = r cos θ; y = r sin θ. Reverse: r² = x² + y², tan θ = y/x.',
      'dx/dθ = r\' cos θ − r sin θ. dy/dθ = r\' sin θ + r cos θ.',
      'dy/dx = (dy/dθ)/(dx/dθ).',
      'Polar curve families: circles (r = a cos θ), limaçons (r = a + b cos θ), roses (r = a sin(nθ)).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9.7', cedTitle: 'Polar Coordinates', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '10', note: 'Standard polar.' }] },
};
