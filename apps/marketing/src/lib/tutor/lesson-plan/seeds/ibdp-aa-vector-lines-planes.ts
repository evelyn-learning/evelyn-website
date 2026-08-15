/**
 * IB DP Math AA — Vector Equations of Lines and Planes.
 * Parametric vector equation of a line, intersection of two lines,
 * cross product, vector and scalar equations of planes.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_VECTOR_LINES_PLANES: LessonPlan = {
  id: 'evelyn.ibdp.aa.vector-lines-planes.v1',
  title: 'IB DP Math AA — Vector Equations of Lines & Planes',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.vector-lines-planes',
      description: 'Write vector equations of lines (parametric) and planes (vector or scalar form); compute intersections of two lines or a line and a plane.',
      standard: 'IB-DP-MATH-AA-3.12/3.16',
    },
  ],
  prerequisites: ['ibdp.aa.vectors-2d-3d'],
  followUps: ['ibdp.aa.statistics-descriptive'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Lines and planes in 3D are intimidating until you realise the recipes are short — point + direction → line; point + normal → plane.',
      script: 'Two lines in 3D might intersect, be parallel, or be SKEW (neither). A line might pierce a plane in one point, lie within it, or miss entirely. The vector equations make all these cases mechanical: substitute, solve, check.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-line-plane',
      kind: 'concept',
      goal: 'Vector equations of line and plane, intersection algorithms.',
      keyIdeas: [
        'LINE EQUATION (parametric vector): r = a + λd. a is a point on the line; d is the direction vector; λ ∈ ℝ.',
        'COMPONENT FORM: (x, y, z) = (a₁, a₂, a₃) + λ(d₁, d₂, d₃) → x = a₁ + λd₁, etc.',
        'CROSS PRODUCT: a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁). Result is a VECTOR perpendicular to both a and b.',
        'PLANE — vector equation: r = a + λu + μv where a is a point, u and v are two non-parallel directions in the plane.',
        'PLANE — scalar (Cartesian) equation: ax + by + cz = d, where (a, b, c) is the NORMAL vector. Or n · (r − r₀) = 0.',
        'NORMAL FROM TWO DIRECTIONS: take the cross product of any two non-parallel direction vectors in the plane to get a normal n.',
        'INTERSECTION OF TWO LINES: set parametric forms equal, solve for λ and μ. If consistent → one point. If inconsistent → parallel or skew.',
        'INTERSECTION LINE-PLANE: substitute the line\'s parametric form into the plane equation, solve for λ, then back-substitute for the intersection point.',
        'PARALLEL/SKEW DECISION: lines are parallel ⟺ direction vectors are scalar multiples. Skew ⟺ not parallel AND no intersection.',
      ],
      vocabulary: [
        { term: 'direction vector', definition: 'a vector parallel to a line, used in its parametric equation.' },
        { term: 'normal vector', definition: 'a vector perpendicular to a plane; defines the plane\'s orientation.' },
        { term: 'skew lines', definition: 'two lines in 3D that neither intersect nor are parallel — they pass each other in different planes.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-line-plane',
      kind: 'worked_example',
      problem: 'Line L: r = (1, 2, 3) + λ(2, −1, 1). Plane Π: 2x + y − z = 5. Find the point of intersection.',
      steps: [
        'Parametric line: x = 1 + 2λ, y = 2 − λ, z = 3 + λ.',
        'Substitute into plane: 2(1 + 2λ) + (2 − λ) − (3 + λ) = 5.',
        'Expand: 2 + 4λ + 2 − λ − 3 − λ = 5 → 1 + 2λ = 5 → λ = 2.',
        'Plug λ = 2 back: x = 1 + 4 = 5, y = 2 − 2 = 0, z = 3 + 2 = 5.',
        'Intersection point: (5, 0, 5).',
        'CHECK: 2·5 + 0 − 5 = 5 ✓.',
      ],
      answer: '(5, 0, 5)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write the vector equation of the line through points A(1, 0, 2) and B(3, 4, −1).',
      expectedAnswer: 'r = (1, 0, 2) + λ(2, 4, −3)',
      responseFormat: 'free',
      hints: [
        'Direction vector AB = B − A.',
        'Equation: r = A + λ(AB).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skew',
      kind: 'misconception_check',
      question: 'A student sets two parametric lines equal, gets an inconsistent system, and concludes "the lines must be parallel." Is this always right?',
      commonErrors: [
        {
          answer: 'Inconsistent → parallel',
          misconception: 'Forgetting the third possibility — skew lines.',
          correctsTo: 'Inconsistent system means NO common point. Two cases: PARALLEL (direction vectors are scalar multiples; lines never meet but are aligned) or SKEW (not parallel; lines pass each other in 3D, never meeting). Always check the direction vectors first: if proportional → parallel; if not → skew. Skew is unique to 3D — doesn\'t exist in 2D.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Line: r = a + λd.',
        'Plane (Cartesian): ax + by + cz = d, normal (a, b, c).',
        'Cross product gives a vector perpendicular to both.',
        'Line-plane intersection: substitute parametric line into plane, solve for λ.',
        'Two lines: parallel, intersecting, or skew. Inconsistent + non-parallel direction = skew.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the equation of the plane containing the points A(1, 0, 0), B(0, 2, 0), C(0, 0, 3).',
      hint: 'Two direction vectors in the plane: AB = (−1, 2, 0), AC = (−1, 0, 3). Normal n = AB × AC = (2·3 − 0·0, 0·(−1) − (−1)·3, (−1)·0 − 2·(−1)) = (6, 3, 2). Equation: 6(x − 1) + 3(y − 0) + 2(z − 0) = 0 → 6x + 3y + 2z = 6. Sanity check: A(1,0,0) gives 6 ✓, B(0,2,0) gives 6 ✓, C(0,0,3) gives 6 ✓.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
