/**
 * AP Calculus BC — Unit 8 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u8-frq-practice.v1', title: 'U8 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u8-frq-practice', description: 'Apply Unit 8 integral applications.', standard: 'AP-CALCBC-8-FRQ' }],
  prerequisites: ['apcalcbc.arc-length'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Unit 8 FRQs combine area, volume, motion. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Always sketch when possible.', 'Identify integration variable carefully.', 'Volumes: identify disc vs washer; cross-section shape and dimensions.', 'Motion: displacement is signed, distance uses |v|.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-area-volume', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Area + Volume. The region R is bounded by y = x and y = x², 0 ≤ x ≤ 1. (a) Find the area of R. (b) Find the volume when R is revolved around the x-axis. (c) Set up the integral for the volume when R is revolved around the LINE y = -1.',
      expectedAnswer: '(a) A = ∫_0^1 (x − x²) dx = 1/2 − 1/3 = 1/6. (3)\n(b) Washer: R_outer = x, R_inner = x². V = π·∫_0^1 (x² − x⁴) dx = π·(1/3 − 1/5) = 2π/15. (3)\n(c) Around y = -1: shift radii. R_outer = x − (-1) = x + 1; R_inner = x² − (-1) = x² + 1. V = π·∫_0^1 [(x+1)² − (x²+1)²] dx. (3)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Sets up the area integral of (top − bottom) with correct limits and evaluates: A = ∫_0^1 (x − x²) dx = 1/2 − 1/3 = 1/6.', modelResponse: 'A = ∫_0^1 (x − x²) dx = [x²/2 − x³/3]_0^1 = 1/2 − 1/3 = 1/6.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Uses the washer method with outer radius x and inner radius x², sets up V = π∫_0^1 (x² − x⁴) dx, and evaluates to 2π/15.', modelResponse: 'Washer with R_outer = x, R_inner = x²: V = π∫_0^1 (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15.' },
        { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Shifts each radius for the axis y = −1 (outer = x + 1, inner = x² + 1) and sets up the correct volume integral V = π∫_0^1 [(x+1)² − (x²+1)²] dx (setup only; evaluation not required).', modelResponse: 'Revolving about y = −1 adds 1 to each radius: outer = x + 1, inner = x² + 1. V = π∫_0^1 [(x+1)² − (x²+1)²] dx.' },
      ] },
      modelResponse: '(a) A = ∫_0^1 (x − x²) dx = 1/2 − 1/3 = 1/6. (b) Washer (outer x, inner x²): V = π∫_0^1 (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15. (c) About y = −1 the radii shift up by 1: V = π∫_0^1 [(x+1)² − (x²+1)²] dx.',
      responseFormat: 'frq', hints: ['Disc/washer with shifted axis: radius = distance from axis.'], estimatedMinutes: 7 },
    { id: 'try-frq-motion', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Motion. A particle moves with v(t) = 3t² − 12t + 9 (m/s) on [0, 5]. (a) Find times when particle is at rest. (b) Find total displacement on [0, 5]. (c) Find total distance traveled.',
      expectedAnswer: '(a) v = 3(t² − 4t + 3) = 3(t-1)(t-3) = 0 → t = 1, 3. (2)\n(b) Displacement = ∫_0^5 v dt = [t³ − 6t² + 9t]_0^5 = 125 − 150 + 45 = 20. (3)\n(c) v changes sign at t = 1 and t = 3. v > 0 on (0,1), v < 0 on (1,3), v > 0 on (3,5). Distance = ∫_0^1 v + ∫_1^3 -v + ∫_3^5 v. \n∫_0^1 (3t²-12t+9) dt = [t³−6t²+9t]_0^1 = 4. \n∫_1^3 (3t²-12t+9) dt = (27 − 54 + 27) − 4 = -4. So |...| = 4. \nTotal ∫_0^5 = 20, so ∫_3^5 = 20 − 4 − (-4) = 20. \nDistance = |4| + |-4| + |20| = 4 + 4 + 20 = 28. (4)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Sets v(t) = 0, factors 3(t−1)(t−3) = 0, and finds the rest times t = 1 and t = 3.', modelResponse: 'v(t) = 3t² − 12t + 9 = 3(t − 1)(t − 3) = 0 → the particle is at rest at t = 1 and t = 3.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Computes displacement as ∫_0^5 v dt with a correct antiderivative and evaluation: [t³ − 6t² + 9t]_0^5 = 125 − 150 + 45 = 20.', modelResponse: 'Displacement = ∫_0^5 (3t² − 12t + 9) dt = [t³ − 6t² + 9t]_0^5 = 125 − 150 + 45 = 20 m.' },
        { criterionId: 'c', maxPoints: 4, scoringCriteria: 'Identifies sign changes of v at t = 1 and t = 3, integrates |v| over the three subintervals (obtaining 4, 4, and 20), and sums to total distance = 28.', modelResponse: 'v > 0 on (0,1), v < 0 on (1,3), v > 0 on (3,5). |∫_0^1 v| = 4, |∫_1^3 v| = 4, |∫_3^5 v| = 20. Total distance = 4 + 4 + 20 = 28 m.' },
      ] },
      modelResponse: '(a) v = 3(t−1)(t−3) = 0 → at rest at t = 1, 3. (b) Displacement = ∫_0^5 v dt = [t³ − 6t² + 9t]_0^5 = 20 m. (c) v changes sign at t = 1, 3; distance = |∫_0^1 v| + |∫_1^3 v| + |∫_3^5 v| = 4 + 4 + 20 = 28 m.',
      responseFormat: 'frq', hints: ['Find sign changes of v; integrate each piece; sum absolute values.'], estimatedMinutes: 7 },
    { id: 'try-frq-cross', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Cross Sections. A solid has base bounded by y = sin x, y = 0, on [0, π]. Cross sections perpendicular to the x-axis are SQUARES. (a) Set up the volume integral. (b) Evaluate.',
      expectedAnswer: '(a) Side at x = sin x. A(x) = sin²x. V = ∫_0^π sin²x dx. (4)\n(b) Use identity sin²x = (1 − cos 2x)/2. V = (1/2)·∫_0^π (1 − cos 2x) dx = (1/2)·[x − (sin 2x)/2]_0^π = (1/2)·(π − 0) = π/2. (5)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 4, scoringCriteria: 'Recognizes the square side length equals the height sin x, so the cross-sectional area is A(x) = sin²x, and sets up V = ∫_0^π sin²x dx with correct limits.', modelResponse: 'Each square cross section has side sin x, so A(x) = (sin x)² = sin²x. Volume V = ∫_0^π sin²x dx.' },
        { criterionId: 'b', maxPoints: 5, scoringCriteria: 'Applies the identity sin²x = (1 − cos 2x)/2, finds a correct antiderivative, and evaluates over [0, π] to get V = π/2.', modelResponse: 'V = ∫_0^π sin²x dx = (1/2)∫_0^π (1 − cos 2x) dx = (1/2)[x − (sin 2x)/2]_0^π = (1/2)(π − 0) = π/2.' },
      ] },
      modelResponse: '(a) The side of each square is the region height sin x, so A(x) = sin²x and V = ∫_0^π sin²x dx. (b) Using sin²x = (1 − cos 2x)/2: V = (1/2)[x − (sin 2x)/2]_0^π = (1/2)(π) = π/2.',
      responseFormat: 'frq', hints: ['Side of square = sin x. A = sin²x. Use identity to integrate.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Area = ∫(top − bottom). Volume = ∫A(x) dx (cross sections) or π∫(R² − r²) (revolution).',
      'Motion: displacement signed, distance |v|.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8-FRQ', cedTitle: 'Unit 8 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-8.' }] },
};
