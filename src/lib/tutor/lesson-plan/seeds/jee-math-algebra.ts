/**
 * JEE Math — Algebra (quadratic equations, sequences, complex numbers).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MATH_ALGEBRA: LessonPlan = {
  id: 'evelyn.jee.math.algebra.v1',
  title: 'JEE Math — Algebra (Quadratics, Sequences, Complex Numbers)',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-math',
  locale: 'en',
  los: [{ id: 'jee.math.algebra', description: 'Drill JEE-style algebra: quadratic roots/discriminant, AP/GP/HP series, complex numbers (modulus/argument/De Moivre).', standard: 'JEE-MATH-ALGEBRA' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'JEE algebra rewards pattern recognition + speed — the same handful of techniques solve thousands of problems.', script: 'Quadratic roots, AP/GP sums, complex number geometry — JEE Main returns to these every single year. Today we cover the high-yield results and the question patterns to recognise instantly.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Quadratic theorems, sequence formulas, complex-number tools.', keyIdeas: [
      'QUADRATIC ax² + bx + c = 0 with roots α, β:',
      '  Sum of roots: α + β = −b/a.',
      '  Product of roots: αβ = c/a.',
      '  Discriminant Δ = b² − 4ac. Δ > 0: 2 real roots. Δ = 0: 1 repeated. Δ < 0: 2 complex conjugate roots.',
      '  Useful: α² + β² = (α+β)² − 2αβ. Compute symmetric functions without solving.',
      'AP (arithmetic progression) with first term a, common difference d:',
      '  Tₙ = a + (n−1)d.',
      '  Sum of n terms: Sₙ = n/2 · (2a + (n−1)d) = n/2 · (a + l) where l is last term.',
      'GP (geometric progression) with first term a, common ratio r:',
      '  Tₙ = a · r^(n−1).',
      '  Sum of n terms: Sₙ = a · (1 − rⁿ)/(1 − r) for r ≠ 1.',
      '  Sum to infinity (|r| < 1): S∞ = a / (1 − r).',
      'HP (harmonic progression): reciprocals form an AP. AM ≥ GM ≥ HM (means inequality).',
      'COMPLEX NUMBERS z = a + bi:',
      '  |z| = √(a² + b²) (modulus).',
      '  arg(z) = arctan(b/a) with quadrant care (argument).',
      '  POLAR FORM: z = r(cos θ + i sin θ) = r·e^(iθ).',
      '  DE MOIVRE: (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ).',
      '  Multiplying complex numbers: multiply moduli, ADD arguments.',
      '  ROOTS OF UNITY: solutions of zⁿ = 1 are evenly spaced on the unit circle.',
      'COMMON JEE TRICKS:',
      '  Newton\'s identities: relate symmetric functions of roots to coefficients.',
      '  AM-GM-HM inequalities for optimisation.',
      '  Complex number on locus: |z − z₁| = |z − z₂| → perpendicular bisector.',
    ], vocabulary: [{ term: 'discriminant', definition: 'b² − 4ac for ax² + bx + c = 0; sign determines number of real roots.' }, { term: 'De Moivre theorem', definition: '(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ); enables fast computation of complex powers and roots.' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'If α, β are roots of x² + 5x + 4 = 0, find α³ + β³ without solving.', steps: [
      'Sum and product of roots: α + β = −5, αβ = 4.',
      'Use identity: α³ + β³ = (α + β)³ − 3αβ(α + β).',
      '= (−5)³ − 3(4)(−5) = −125 + 60 = −65.',
    ], answer: '−65', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Find the sum of an infinite GP with first term 6 and common ratio 1/3.', expectedAnswer: 'S∞ = a/(1−r) = 6/(1−1/3) = 6/(2/3) = 9.', responseFormat: 'numeric', hints: ['|r| < 1, so the infinite sum converges.', 'Use S∞ = a/(1−r).'], estimatedMinutes: 2 },
    { id: 'misconception-symmetric', kind: 'misconception_check', question: 'A student tries to solve x² − 4x + 1 = 0 to find α² + β². Why is there a faster way?', commonErrors: [{ answer: 'Solves quadratic directly', misconception: 'Forgetting that symmetric functions of roots can be computed without solving.', correctsTo: 'Sum α + β = 4, product αβ = 1 (Vieta\'s). Use α² + β² = (α+β)² − 2αβ = 16 − 2 = 14. No need to compute roots (which would be 2 ± √3) and square them. JEE rewards this kind of identity-based shortcut.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['α + β = −b/a, αβ = c/a (Vieta).', 'AP sum: n/2(2a + (n-1)d). GP sum: a(1-rⁿ)/(1-r).', 'GP infinite sum: a/(1-r) for |r|<1.', '|z| = √(a²+b²), arg = arctan(b/a).', 'De Moivre for fast complex powers.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
