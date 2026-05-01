/**
 * AP Pre-Calculus — Unit 3: Trigonometric and Polar Functions.
 *
 * Aligned with the 2025-26 College Board CED. Unit 3 weight: 30-35%
 * of the multiple-choice section.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PRECALC_TRIGONOMETRIC_POLAR: LessonPlan = {
  id: 'evelyn.ap.precalc.trigonometric-polar.v1',
  title: 'Trigonometric and Polar Functions',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'math',
  topic: 'ap-precalculus',
  locale: 'en',
  los: [
    {
      id: 'apprecalc.trigonometric-polar',
      description: 'Use the unit circle, graph sine/cosine/tangent and their transformations, apply trig identities, solve trig equations, and represent points in polar form.',
      standard: 'AP-PRECALC-3',
    },
  ],
  prerequisites: ['apprecalc.exponential-logarithmic'],
  followUps: ['apprecalc.parametric-vectors-matrices'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trig is the language of anything that repeats.',
      script: 'Tides rise and fall every 12 hours. Your heart pumps every second. Sound waves oscillate at hundreds of cycles per second. All of these are MODELED by sine and cosine. Master a few essentials — the unit circle, sine and cosine graphs, transformations, and a small core of identities — and you can describe any periodic phenomenon. Add polar coordinates, and you have a second way to describe any point in the plane that\'s perfect for circles, spirals, and rotating objects.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Unit circle, trig graphs, transformations, identities, polar coords.',
      keyIdeas: [
        'UNIT CIRCLE: a circle of radius 1 centered at origin. For any angle θ measured CCW from the positive x-axis: cos θ = x-coordinate, sin θ = y-coordinate. tan θ = sin/cos = y/x.',
        'KEY ANGLES (radians): π/6 (30°), π/4 (45°), π/3 (60°), π/2 (90°), π (180°), 3π/2 (270°), 2π (360°). Memorize sin/cos values for these.',
        'PYTHAGOREAN IDENTITY: sin²θ + cos²θ = 1. Derivative-style: 1 + tan²θ = sec²θ. 1 + cot²θ = csc²θ.',
        'GRAPHS: y = A·sin(B(x − h)) + k. AMPLITUDE = |A|. PERIOD = 2π/|B|. PHASE SHIFT = h. VERTICAL SHIFT = k. Same form for cosine.',
        'TANGENT GRAPH has period π (not 2π) and vertical asymptotes at x = π/2 + nπ where cos = 0.',
        'INVERSE TRIG: arcsin, arccos, arctan return PRINCIPAL VALUES. arcsin: [−π/2, π/2]. arccos: [0, π]. arctan: (−π/2, π/2). Be careful: solving sin x = 0.5 has infinitely many solutions; arcsin gives just one.',
        'COMMON IDENTITIES: cos(−θ) = cos(θ) (even), sin(−θ) = −sin(θ) (odd). Sum: sin(A + B) = sin A·cos B + cos A·sin B. Double-angle: sin(2θ) = 2sin θ·cos θ. cos(2θ) = cos²θ − sin²θ = 1 − 2sin²θ = 2cos²θ − 1.',
        'POLAR COORDINATES: a point (r, θ) means distance r from origin at angle θ from positive x-axis. Convert: x = r·cos θ, y = r·sin θ. r = √(x² + y²), θ = arctan(y/x) (with quadrant correction).',
        'POLAR GRAPHS: r = a (circle of radius a), r = θ (Archimedean spiral), r = a·cos θ (circle through origin), r = a + b·cos θ (cardioid / limaçon).',
      ],
      vocabulary: [
        { term: 'unit circle', definition: 'a circle of radius 1 centered at the origin; (cos θ, sin θ) is the point at angle θ.' },
        { term: 'amplitude', definition: 'half the vertical span of a sine/cosine graph; coefficient A in y = A·sin(...).' },
        { term: 'polar coordinates', definition: 'a point described by (r, θ): distance from origin and angle from positive x-axis.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-graph',
      kind: 'worked_example',
      problem: 'Identify the amplitude, period, phase shift, and vertical shift of y = 3·sin(2(x − π/4)) + 1. Where is the first maximum?',
      steps: [
        'Compare to y = A·sin(B(x − h)) + k.',
        'A = 3 → amplitude = 3.',
        'B = 2 → period = 2π/2 = π.',
        'h = π/4 → phase shift π/4 to the right.',
        'k = 1 → vertical shift up 1.',
        'First maximum: a regular sin reaches max at B(x − h) = π/2. So 2(x − π/4) = π/2 → x − π/4 = π/4 → x = π/2.',
        'Max value = vertical shift + amplitude = 1 + 3 = 4.',
      ],
      answer: 'Amplitude 3, period π, phase shift π/4 right, vertical shift +1. First max at (π/2, 4).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Convert the polar coordinate (4, π/3) to rectangular (Cartesian) form.',
      expectedAnswer: '(2, 2√3)',
      responseFormat: 'free',
      hints: [
        'x = r·cos θ. y = r·sin θ.',
        'cos(π/3) = 1/2. sin(π/3) = √3/2.',
        'x = 4·(1/2) = 2. y = 4·(√3/2) = 2√3.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-arcsin-multiple',
      kind: 'misconception_check',
      question: 'You solve sin x = 0.5 and your calculator gives x = π/6. So x = π/6 is the only solution. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Forgetting that trig equations have infinitely many solutions.',
          correctsTo: 'False. arcsin returns one principal value (here π/6 ≈ 30°), but sin x = 0.5 has solutions at x = π/6, 5π/6 (in the second quadrant, also has sin = 0.5), and infinitely many more by adding 2π. General solution: x = π/6 + 2πn OR x = 5π/6 + 2πn for integer n. The College Board loves to test whether students know to include the supplementary angle and the 2πn family.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Unit circle: cos θ = x, sin θ = y. Memorize values at π/6, π/4, π/3, π/2.',
        'sin²θ + cos²θ = 1. Sum/difference + double-angle identities.',
        'y = A·sin(B(x − h)) + k: amp |A|, period 2π/|B|, shift h right + k up.',
        'Polar: x = r·cos θ, y = r·sin θ. Convert ↔ rectangular freely.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A Ferris wheel has a 30 m radius and rotates once every 4 minutes. The bottom of the wheel is 2 m above the ground. Write a sine model for the height of a passenger as a function of time t (minutes), assuming they start at the bottom.',
      hint: 'Center of wheel = 2 + 30 = 32 m above ground (vertical shift k = 32). Amplitude = 30. Period = 4 → B = 2π/4 = π/2. Starting at the BOTTOM means h(0) = 2, which is the minimum. Use h(t) = 32 − 30·cos(π·t/2) — cosine starts at max, so negative cosine starts at min. ✓ at t = 0: h = 32 − 30 = 2. At t = 2: h = 32 + 30 = 62 (top). ✓',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
