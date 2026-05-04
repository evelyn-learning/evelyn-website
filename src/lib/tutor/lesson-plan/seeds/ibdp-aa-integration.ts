/**
 * IB DP Math AA — Integration: Rules and Applications.
 * Antiderivatives, definite integrals, area between curves, kinematics.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_INTEGRATION: LessonPlan = {
  id: 'evelyn.ibdp.aa.integration.v1',
  title: 'IB DP Math AA — Integration Rules & Applications',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.integration',
      description: 'Compute indefinite integrals; evaluate definite integrals; apply integration to area-between-curves and kinematics problems.',
      standard: 'IB-DP-MATH-AA-5.5/5.10',
    },
  ],
  prerequisites: ['ibdp.aa.differentiation'],
  followUps: ['ibdp.aa.differential-equations'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Integration reverses differentiation — and unlocks area, volume, average value, and kinematic distance from velocity.',
      script: 'Once you know d/dx (x³) = 3x², you also know ∫3x² dx = x³ + C. Integration is differentiation in reverse, with one quirk: the +C constant. The applications follow: area under a curve, distance traveled from velocity, and the fundamental theorem linking the two operations.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-integration',
      kind: 'concept',
      goal: 'Standard antiderivatives + FTC + area + kinematics.',
      keyIdeas: [
        'POWER RULE (REVERSED): ∫x^n dx = x^(n+1)/(n+1) + C, for n ≠ −1.',
        'EXCEPTION: ∫(1/x) dx = ln|x| + C.',
        'STANDARD: ∫sin x dx = −cos x + C. ∫cos x dx = sin x + C. ∫e^x dx = e^x + C. ∫ sec²x dx = tan x + C.',
        'CHAIN-RULE REVERSED (LINEAR INNER): ∫f(ax + b) dx = (1/a)·F(ax + b) + C, where F is an antiderivative of f. Example: ∫sin(2x) dx = −(1/2)cos(2x) + C.',
        'U-SUBSTITUTION (general): if integrand has g\'(x)·f(g(x)), let u = g(x), du = g\'(x) dx. Reduces to ∫f(u) du.',
        'DEFINITE INTEGRAL ∫_a^b f(x) dx = F(b) − F(a), where F is any antiderivative. The +C cancels.',
        'AREA UNDER CURVE: between f(x) and the x-axis from a to b is ∫_a^b |f(x)| dx (use absolute value if curve dips below axis; or split the integral).',
        'AREA BETWEEN TWO CURVES: ∫_a^b [upper(x) − lower(x)] dx, where a, b are intersection x-values.',
        'KINEMATICS: if v(t) = ds/dt then s(t) = ∫v dt + s₀. If a(t) = dv/dt then v(t) = ∫a dt + v₀. Distance = ∫|v(t)| dt; displacement = ∫v(t) dt.',
      ],
      vocabulary: [
        { term: 'antiderivative', definition: 'a function F whose derivative is f; ∫f dx = F + C.' },
        { term: 'definite integral', definition: '∫_a^b f(x) dx = F(b) − F(a); a number representing signed area under the curve.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-area-between',
      kind: 'worked_example',
      problem: 'Find the area between the curves y = x² and y = 4 − x².',
      steps: [
        'Find intersections: x² = 4 − x² → 2x² = 4 → x² = 2 → x = ±√2.',
        'Decide upper and lower curves on (−√2, √2): test x = 0. y₁ = 0, y₂ = 4. So 4 − x² is above x².',
        'Area = ∫_(−√2)^(√2) [(4 − x²) − x²] dx = ∫_(−√2)^(√2) (4 − 2x²) dx.',
        'Antiderivative: 4x − (2/3)x³.',
        'Evaluate: at √2: 4√2 − (2/3)·(2√2) = 4√2 − (4√2)/3 = (12√2 − 4√2)/3 = 8√2/3. At −√2: −8√2/3.',
        'Difference: 8√2/3 − (−8√2/3) = 16√2/3.',
        'Area = 16√2/3 ≈ 7.54 (square units).',
      ],
      answer: '16√2/3',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate ∫_0^π/2 sin(2x) dx.',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: [
        '∫sin(2x) dx = −(1/2)cos(2x) + C.',
        'Evaluate at π/2: −(1/2)cos(π) = −(1/2)(−1) = 1/2.',
        'Evaluate at 0: −(1/2)cos(0) = −1/2.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-constant',
      kind: 'misconception_check',
      question: 'A student computes ∫2x dx = x² and stops there. Is this complete?',
      commonErrors: [
        {
          answer: '∫2x dx = x²',
          misconception: 'Forgetting the +C constant of integration.',
          correctsTo: 'Indefinite integrals always have a +C: ∫2x dx = x² + C. The reason: any function differing from x² by a constant has the same derivative 2x. Without the +C, you\'ve quoted only ONE specific antiderivative. For DEFINITE integrals (with limits) the +C cancels in F(b) − F(a) so it doesn\'t matter — but indefinite integrals require it. Examiners deduct marks for missing +C.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '∫x^n dx = x^(n+1)/(n+1) + C, n ≠ −1. ∫1/x dx = ln|x| + C.',
        'Standards: ∫sin = −cos, ∫cos = sin, ∫e^x = e^x.',
        'Definite: ∫_a^b f dx = F(b) − F(a). +C cancels.',
        'Area between curves: ∫(upper − lower) over their intersections.',
        'Kinematics: distance = ∫|v| dt; displacement = ∫v dt.',
        'Always +C on indefinite integrals.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A particle moves with velocity v(t) = 6 − 2t (m/s). Find: (a) displacement during 0 ≤ t ≤ 5; (b) total distance travelled.',
      hint: '(a) Displacement = ∫_0^5 (6 − 2t) dt = [6t − t²]_0^5 = 30 − 25 = 5 m. (b) Velocity changes sign at t = 3 (v = 0). For 0 ≤ t ≤ 3 v > 0; for 3 ≤ t ≤ 5 v < 0. Distance = ∫_0^3 (6 − 2t) dt + |∫_3^5 (6 − 2t) dt| = 9 + |−4| = 9 + 4 = 13 m.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
