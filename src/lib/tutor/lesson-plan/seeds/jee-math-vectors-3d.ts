/**
 * JEE Math — Vectors and 3D Geometry.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MATH_VECTORS_3D: LessonPlan = {
  id: 'evelyn.jee.math.vectors-3d.v1',
  title: 'JEE Math — Vectors and 3D Geometry',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-math',
  locale: 'en',
  los: [{ id: 'jee.math.vectors-3d', description: 'Apply dot/cross products, lines/planes in 3D, distance/angle formulas, and scalar triple product.', standard: 'JEE-MATH-VECTORS' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Vectors and 3D geometry give you formulas for "what\'s the angle, distance, area" in space.', script: 'Two vectors → angle (dot product), area of parallelogram (cross product), volume of parallelepiped (scalar triple product). The formulas are tight and JEE expects fluency.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Dot/cross/triple products, lines, planes, distances.', keyIdeas: [
      'VECTORS in 3D: a = a₁i + a₂j + a₃k. Magnitude |a| = √(a₁² + a₂² + a₃²).',
      'DOT PRODUCT: a·b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cos θ.',
      '  Use cases: angle between vectors (cos θ = a·b/|a||b|), projection, perpendicularity (a·b = 0 ⟺ ⊥).',
      'CROSS PRODUCT: a × b = (a₂b₃ − a₃b₂)i − (a₁b₃ − a₃b₁)j + (a₁b₂ − a₂b₁)k.',
      '  |a × b| = |a||b|sin θ = area of parallelogram.',
      '  a × b is perpendicular to both a and b.',
      '  Right-hand rule for direction.',
      'SCALAR TRIPLE PRODUCT: [a b c] = a·(b × c) = volume of parallelepiped.',
      '  = 0 ⟺ vectors are coplanar.',
      'LINE in 3D: r = a + λ·b (point a, direction b).',
      'PLANE in 3D: r·n = d (n is normal, d is constant).',
      'DISTANCE point to plane: |a·n − d| / |n|.',
      'DISTANCE point to line: |b × (a − p)| / |b|.',
      'ANGLE between two lines: cos θ = |b₁·b₂|/(|b₁||b₂|).',
      'ANGLE between two planes: cos θ = |n₁·n₂|/(|n₁||n₂|).',
      'ANGLE between line and plane: sin θ = |b·n|/(|b||n|).',
    ], vocabulary: [{ term: 'cross product', definition: 'a × b: a vector perpendicular to both a and b with magnitude |a||b|sin θ.' }, { term: 'scalar triple product', definition: '[a b c] = a·(b×c); represents the signed volume of the parallelepiped formed by a, b, c.' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'Find the angle between vectors a = i + 2j + 2k and b = 2i − j + 2k.', steps: [
      'Dot product: a·b = (1)(2) + (2)(−1) + (2)(2) = 2 − 2 + 4 = 4.',
      '|a| = √(1² + 2² + 2²) = √9 = 3.',
      '|b| = √(2² + (−1)² + 2²) = √9 = 3.',
      'cos θ = 4/(3·3) = 4/9.',
      'θ = arccos(4/9) ≈ 63.6°.',
    ], answer: 'arccos(4/9) ≈ 63.6°', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Find the area of the parallelogram with adjacent sides a = i + j + k and b = i − j.', expectedAnswer: 'a × b = (j·0 − k·(−1))i − (i·0 − k·1)j + (i·(−1) − j·1)k = (1)i − (−1)j + (−2)k = i + j − 2k. |a × b| = √(1 + 1 + 4) = √6. Area = √6.', responseFormat: 'free', hints: ['Compute a × b first.', 'Magnitude = parallelogram area.'], estimatedMinutes: 3 },
    { id: 'misconception-cross-direction', kind: 'misconception_check', question: 'A student computes a × b and b × a and gets the same result. What\'s wrong?', commonErrors: [{ answer: 'a × b = b × a', misconception: 'Treating cross product as commutative.', correctsTo: 'Cross product is ANTI-COMMUTATIVE: a × b = −(b × a). The magnitudes are equal but directions are OPPOSITE. Right-hand rule for a × b vs b × a points the opposite way. Always: order matters in cross products. Dot product IS commutative; cross product is not.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Dot product → angle, projection. Zero ⟺ perpendicular.', 'Cross product → perpendicular vector + parallelogram area.', 'a × b = −(b × a). Anti-commutative.', 'Scalar triple product → parallelepiped volume.', 'Coplanar ⟺ scalar triple product = 0.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
