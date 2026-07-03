/**
 * AP Calculus BC — Unit 9 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U9_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u9-frq-practice.v1', title: 'U9 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u9-frq-practice', description: 'Apply Unit 9 parametric/polar/vector techniques.', standard: 'AP-CALCBC-9-FRQ' }],
  prerequisites: ['apcalcbc.polar-area'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Unit 9 FRQs combine parametric, polar, and 2D motion. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Parametric: dy/dx = (dy/dt)/(dx/dt). Arc length: ∫ √(x\'² + y\'²) dt.',
      'Polar area: (1/2)∫r² dθ. Identify bounds where r = 0 or curves intersect.',
      '2D motion: speed = |v|, distance = ∫|v| dt.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-parametric', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Parametric. A particle\'s position is given by x = t² − 1, y = t³ − 3t. (a) Find dy/dx. (b) Find values of t where the curve has horizontal and vertical tangents. (c) Find d²y/dx² as a function of t.',
      expectedAnswer: '(a) dx/dt = 2t. dy/dt = 3t² − 3. dy/dx = (3t² − 3)/(2t) = (3(t² − 1))/(2t). (1.5)\n(b) Horizontal: dy/dt = 0 with dx/dt ≠ 0. 3t² − 3 = 0 → t = ±1. Check dx/dt = ±2 ≠ 0. ✓ Vertical: dx/dt = 0 with dy/dt ≠ 0. 2t = 0 → t = 0. dy/dt at t=0 = -3 ≠ 0. ✓ Horizontal at t = ±1; vertical at t = 0. (2)\n(c) d/dt[dy/dx] = d/dt[(3t² − 3)/(2t)]. Quotient rule: (6t·2t − (3t²−3)·2)/(2t)² = (12t² − 6t² + 6)/(4t²) = (6t² + 6)/(4t²) = (3(t² + 1))/(2t²). d²y/dx² = ÷ dx/dt = (3(t² + 1)/(2t²)) / (2t) = 3(t² + 1)/(4t³). (2.5)\nTotal: 6 points.',
      rubric: { parts: [
        { criterionId: 'a-derivatives', maxPoints: 1, scoringCriteria: 'Differentiates both components correctly: dx/dt = 2t and dy/dt = 3t² − 3.', modelResponse: 'dx/dt = 2t; dy/dt = 3t² − 3.' },
        { criterionId: 'a-quotient', maxPoints: 1, scoringCriteria: 'Forms dy/dx = (dy/dt)/(dx/dt) = (3t² − 3)/(2t) and simplifies to 3(t² − 1)/(2t).', modelResponse: 'dy/dx = (3t² − 3)/(2t) = 3(t² − 1)/(2t).' },
        { criterionId: 'b-horizontal', maxPoints: 2, scoringCriteria: 'Sets dy/dt = 0 to find t = ±1 for horizontal tangents AND verifies dx/dt ≠ 0 there (dx/dt = ±2). Both the solving and the condition check are required.', modelResponse: 'Horizontal tangents where dy/dt = 3t² − 3 = 0 → t = ±1, and dx/dt = ±2 ≠ 0. Horizontal at t = ±1.' },
        { criterionId: 'b-vertical', maxPoints: 1, scoringCriteria: 'Sets dx/dt = 0 to find t = 0 for a vertical tangent AND verifies dy/dt ≠ 0 there (dy/dt = −3).', modelResponse: 'Vertical tangent where dx/dt = 2t = 0 → t = 0, and dy/dt = −3 ≠ 0. Vertical at t = 0.' },
        { criterionId: 'c-differentiate', maxPoints: 2, scoringCriteria: 'Differentiates dy/dx with respect to t (quotient rule) to obtain d/dt[dy/dx] = 3(t² + 1)/(2t²).', modelResponse: 'd/dt[(3t² − 3)/(2t)] = (6t·2t − (3t² − 3)·2)/(4t²) = (6t² + 6)/(4t²) = 3(t² + 1)/(2t²).' },
        { criterionId: 'c-second-derivative', maxPoints: 2, scoringCriteria: 'Divides that result by dx/dt = 2t to reach d²y/dx² = 3(t² + 1)/(4t³).', modelResponse: 'd²y/dx² = [3(t² + 1)/(2t²)] ÷ (2t) = 3(t² + 1)/(4t³).' },
      ] },
      modelResponse: '(a) dx/dt = 2t, dy/dt = 3t² − 3, so dy/dx = (3t² − 3)/(2t) = 3(t² − 1)/(2t). (b) Horizontal tangents: dy/dt = 0 → t = ±1 with dx/dt = ±2 ≠ 0. Vertical tangent: dx/dt = 0 → t = 0 with dy/dt = −3 ≠ 0. (c) d/dt[dy/dx] = 3(t² + 1)/(2t²); dividing by dx/dt = 2t gives d²y/dx² = 3(t² + 1)/(4t³).',
      responseFormat: 'frq', hints: ['Parametric derivatives.'], estimatedMinutes: 6 },
    { id: 'try-frq-vector', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Vector / 2D Motion. A particle has v(t) = ⟨3 − t, 2t − 4⟩ on [0, 5]. (a) Find when the particle is at rest. (b) Find total distance traveled. (c) Find acceleration vector at t = 2.',
      expectedAnswer: '(a) At rest: |v| = 0 means BOTH components 0. v_x = 3 − t = 0 → t = 3. v_y = 2t − 4 = 0 → t = 2. Both can\'t be 0 at same t → particle is NEVER at rest. (Different from 1D motion where v=0 means at rest.) (1.5)\n(b) Distance = ∫_0^5 √((3 − t)² + (2t − 4)²) dt. Expand: (3 − t)² + (2t − 4)² = 9 − 6t + t² + 4t² − 16t + 16 = 5t² − 22t + 25. So Distance = ∫_0^5 √(5t² − 22t + 25) dt. (Numerical evaluation needed; AP would accept this setup or a calculator answer.) (3)\n(c) a(t) = ⟨-1, 2⟩ (constant). At t = 2: ⟨-1, 2⟩. (1.5)\nTotal: 6 points.',
      rubric: { parts: [
        { criterionId: 'a-condition', maxPoints: 1, scoringCriteria: 'States that being at rest requires BOTH velocity components to equal zero simultaneously and sets 3 − t = 0 and 2t − 4 = 0.', modelResponse: 'At rest requires both components zero: 3 − t = 0 and 2t − 4 = 0.' },
        { criterionId: 'a-solve', maxPoints: 1, scoringCriteria: 'Solves each component: v_x = 0 at t = 3 and v_y = 0 at t = 2.', modelResponse: 'v_x = 0 → t = 3; v_y = 0 → t = 2.' },
        { criterionId: 'a-conclusion', maxPoints: 1, scoringCriteria: 'Concludes the particle is NEVER at rest because the two components are never zero at the same t.', modelResponse: 'Since t = 3 ≠ t = 2, the components are never simultaneously zero, so the particle is never at rest.' },
        { criterionId: 'b-setup', maxPoints: 2, scoringCriteria: 'Sets up total distance as the speed integral ∫_0^5 √((3 − t)² + (2t − 4)²) dt with correct limits.', modelResponse: 'Distance = ∫_0^5 √((3 − t)² + (2t − 4)²) dt.' },
        { criterionId: 'b-integrand', maxPoints: 1, scoringCriteria: 'Correctly expands the integrand to √(5t² − 22t + 25).', modelResponse: '(3 − t)² + (2t − 4)² = 5t² − 22t + 25, so Distance = ∫_0^5 √(5t² − 22t + 25) dt.' },
        { criterionId: 'b-value', maxPoints: 1, scoringCriteria: 'Reports the numerical value of the integral (calculator-evaluated) or leaves the correct exact setup as the final answer.', modelResponse: '∫_0^5 √(5t² − 22t + 25) dt ≈ 18.1 (calculator).' },
        { criterionId: 'c-acceleration', maxPoints: 1, scoringCriteria: 'Differentiates velocity component-wise to get the constant acceleration a(t) = ⟨−1, 2⟩.', modelResponse: 'a(t) = ⟨d/dt(3 − t), d/dt(2t − 4)⟩ = ⟨−1, 2⟩.' },
        { criterionId: 'c-evaluate', maxPoints: 1, scoringCriteria: 'Evaluates at t = 2 to get a(2) = ⟨−1, 2⟩.', modelResponse: 'a(2) = ⟨−1, 2⟩.' },
      ] },
      modelResponse: '(a) At rest needs both components zero: 3 − t = 0 → t = 3 and 2t − 4 = 0 → t = 2; not simultaneous, so the particle is never at rest. (b) Distance = ∫_0^5 √((3 − t)² + (2t − 4)²) dt = ∫_0^5 √(5t² − 22t + 25) dt ≈ 18.1. (c) a(t) = ⟨−1, 2⟩, so a(2) = ⟨−1, 2⟩.',
      responseFormat: 'frq', hints: ['Component-wise differentiation.'], estimatedMinutes: 6 },
    { id: 'try-frq-polar', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Polar Area. Consider r = 2 sin(2θ) (rose curve). (a) Find the area of ONE petal. (b) Find the total area enclosed by all four petals.',
      expectedAnswer: '(a) One petal traces from r = 0 to r = 0 next time. r = 0 when sin(2θ) = 0, i.e., 2θ = 0, π, 2π, ... → θ = 0, π/2, π, ... One petal: 0 ≤ θ ≤ π/2. A = (1/2)∫_0^{π/2} (2 sin 2θ)² dθ = 2∫_0^{π/2} sin²(2θ) dθ. Use sin²(2θ) = (1 − cos 4θ)/2: = 2 · ∫_0^{π/2} (1 − cos 4θ)/2 dθ = [θ − (sin 4θ)/4]_0^{π/2} = π/2 − 0 = π/2. (3.5)\n(b) 4 petals × π/2 = 2π. (1.5)\nTotal: 5 points.',
      rubric: { parts: [
        { criterionId: 'a-bounds', maxPoints: 1, scoringCriteria: 'Finds the petal bounds by solving r = 0: sin(2θ) = 0 gives θ = 0 and θ = π/2, so one petal is traced over 0 ≤ θ ≤ π/2.', modelResponse: 'r = 0 when sin(2θ) = 0 → θ = 0, π/2. One petal: 0 ≤ θ ≤ π/2.' },
        { criterionId: 'a-setup', maxPoints: 1, scoringCriteria: 'Sets up the polar area integral A = (1/2)∫_0^{π/2} (2 sin 2θ)² dθ.', modelResponse: 'A = (1/2)∫_0^{π/2} (2 sin 2θ)² dθ = 2∫_0^{π/2} sin²(2θ) dθ.' },
        { criterionId: 'a-integrate', maxPoints: 2, scoringCriteria: 'Applies the power-reduction identity sin²(2θ) = (1 − cos 4θ)/2 and antidifferentiates to θ − (sin 4θ)/4.', modelResponse: '2∫_0^{π/2} (1 − cos 4θ)/2 dθ = [θ − (sin 4θ)/4]_0^{π/2}.' },
        { criterionId: 'a-value', maxPoints: 1, scoringCriteria: 'Evaluates the definite integral to obtain the one-petal area π/2.', modelResponse: '[θ − (sin 4θ)/4]_0^{π/2} = π/2 − 0 = π/2.' },
        { criterionId: 'b-symmetry', maxPoints: 2, scoringCriteria: 'Recognizes the rose r = 2 sin(2θ) has four congruent petals, so the total area is 4 times one petal.', modelResponse: 'The rose has 4 congruent petals, so total area = 4 × (area of one petal).' },
        { criterionId: 'b-total', maxPoints: 2, scoringCriteria: 'Computes the total enclosed area 4 · (π/2) = 2π.', modelResponse: 'Total area = 4 · (π/2) = 2π.' },
      ] },
      modelResponse: '(a) r = 0 at θ = 0 and π/2, so one petal spans 0 ≤ θ ≤ π/2. A = (1/2)∫_0^{π/2} (2 sin 2θ)² dθ = 2∫_0^{π/2} sin²(2θ) dθ = ∫_0^{π/2} (1 − cos 4θ) dθ = [θ − (sin 4θ)/4]_0^{π/2} = π/2. (b) Four congruent petals give total area 4 · (π/2) = 2π.',
      responseFormat: 'frq', hints: ['One petal: 0 to π/2. Area formula: (1/2)∫r² dθ.'], estimatedMinutes: 6 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Parametric: derivatives via chain rule.',
      'Polar area: (1/2)∫r² dθ.',
      '2D motion: vector velocity, scalar speed.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '9', cedTopic: '9-FRQ', cedTitle: 'Unit 9 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-9.' }] },
};
