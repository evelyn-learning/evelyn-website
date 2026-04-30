/**
 * AP Calculus BC — Polar coordinates and curves.
 *
 * (r, θ) representation. Converting to/from rectangular. Area
 * inside a polar curve.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_BC_POLAR: LessonPlan = {
  id: 'evelyn.ap.calcbc.polar.v1',
  title: 'Polar coordinates and area',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.polar',
      description: 'Convert between polar and rectangular coordinates and compute area enclosed by polar curves.',
      standard: 'AP-CALCBC-CHA-5',
    },
  ],
  prerequisites: ['apcalcbc.parametric'],
  followUps: ['apcalcbc.series'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame polar as a different way to point.',
      script: 'In rectangular coordinates you give an address with east-west (x) and north-south (y). In polar you give a DIRECTION (angle θ) and a DISTANCE (r). Some shapes are much easier in polar — circles, spirals, flowers.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-conversion-area',
      kind: 'concept',
      goal: 'Coordinate conversion + area integral.',
      keyIdeas: [
        'POLAR: a point is (r, θ). r = distance from origin. θ = angle from positive x-axis (counterclockwise).',
        'CONVERSION: x = r cos θ, y = r sin θ. r² = x² + y². tan θ = y/x.',
        'POLAR EQUATIONS: r as a function of θ. r = a (circle radius a). r = a + b·cos θ (cardioid / limaçon). r = a·sin(nθ) (rose).',
        'AREA inside a polar curve: A = (1/2) ∫_α^β [r(θ)]² dθ. The 1/2 r² dθ is the area of an infinitesimal sector.',
        'AREA between two polar curves: A = (1/2) ∫_α^β [(r_outer)² − (r_inner)²] dθ.',
        'Common GOTCHA: when integrating over a full curve, find the right θ range. r could be negative — most common rule: integrate from where r = 0 (start) back to r = 0.',
      ],
      vocabulary: [
        { term: 'polar coordinates', definition: 'a point representation as (r, θ) — distance from origin + angle.' },
        { term: 'cardioid', definition: 'a heart-shaped curve r = a(1 + cos θ).' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-area-circle',
      kind: 'worked_example',
      problem: 'Find the area enclosed by r = 3 (a circle).',
      steps: [
        'Polar form r = 3 is a circle of radius 3 centered at origin.',
        'A = (1/2) ∫_0^(2π) (3)² dθ = (1/2) · 9 · 2π = 9π.',
        'Check: standard circle area πr² = π(9) = 9π. ✓',
      ],
      answer: '9π',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cardioid',
      kind: 'worked_example',
      problem: 'Find the area enclosed by r = 1 + cos θ.',
      steps: [
        'A = (1/2) ∫_0^(2π) (1 + cos θ)² dθ.',
        'Expand: (1 + cos θ)² = 1 + 2cos θ + cos²θ.',
        'Use cos²θ = (1 + cos 2θ)/2: integrand = 1 + 2cos θ + 1/2 + (1/2)cos 2θ = 3/2 + 2cos θ + (1/2)cos 2θ.',
        'Integrate over [0, 2π]: cos θ and cos 2θ each integrate to 0 over a full period.',
        'Remaining: ∫ (3/2) dθ from 0 to 2π = 3π.',
        'Multiply by 1/2: A = (1/2)(3π) = 3π/2.',
      ],
      answer: '3π/2',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Convert polar (4, π/3) to rectangular (x, y).',
      expectedAnswer: '(2, 2√3)',
      responseFormat: 'free',
      hints: [
        'x = r cos θ = 4 cos(π/3) = 4 · 1/2 = 2.',
        'y = r sin θ = 4 sin(π/3) = 4 · √3/2 = 2√3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-r-squared',
      kind: 'misconception_check',
      question: 'For polar area, do you integrate r dθ, like rectangular dy?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Mixing rectangular and polar area formulas.',
          correctsTo: 'No — polar uses (1/2) r² dθ. Each infinitesimal sector has area (1/2) r² dθ — derived from the area of a pie slice. The factor of 1/2 and the squaring of r are essential.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Conversion: x = r cos θ, y = r sin θ.',
        'Area: A = (1/2) ∫ r² dθ.',
        'Some shapes (cardioids, roses) are simpler in polar.',
        'Watch the θ range — make sure it traces the curve once.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does r² appear (not just r) in the polar area formula?',
      hint: 'A pie-slice sector has area (1/2) r² Δθ — same formula as area of a sector. The integral is summing infinitesimal pie slices. Compare to rectangular: dy dx where dy is a HEIGHT, not a height-squared.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
