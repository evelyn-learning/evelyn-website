/**
 * JEE — Coordinate Geometry (high-yield JEE topic).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_COORDINATE_GEOMETRY: LessonPlan = {
  id: 'evelyn.jee.coordinate-geometry.v1',
  title: 'JEE Coordinate Geometry',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'math',
  topic: 'jee-math',
  locale: 'en',
  los: [
    {
      id: 'jee.coord-geo',
      description: 'Apply line, circle, and conic-section equations and properties to JEE-style problems including locus and tangent/chord work.',
      standard: 'JEE-MATH-COORD',
    },
  ],
  prerequisites: ['jee.math-strategy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Coord geo is JEE\'s most pattern-friendly topic.',
      script: 'Coordinate geometry rewards PATTERN RECOGNITION. Once you know the 8-10 standard configurations (line through two points, circle from three points, locus, tangent from external point, parabola/ellipse/hyperbola features), almost every JEE coord-geo question maps to one. Mastery here means scoring high without thinking — you see the question, you recognize the type, you know the move.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Lines, circles, conic sections, locus, common configurations.',
      keyIdeas: [
        'LINE: y − y₁ = m(x − x₁). Two-point form: (y − y₁)/(x − x₁) = (y₂ − y₁)/(x₂ − x₁). Distance from (x₀,y₀) to ax + by + c = 0: |ax₀ + by₀ + c|/√(a² + b²).',
        'CIRCLE: (x − h)² + (y − k)² = r². Equation expanded: x² + y² + Dx + Ey + F = 0 has center (−D/2, −E/2) and radius √(D²/4 + E²/4 − F). Three points determine a unique circle.',
        'TANGENT TO CIRCLE: from external point (x₁,y₁), there are TWO tangent lines. Length of tangent = √(power of point) = √(x₁² + y₁² + Dx₁ + Ey₁ + F).',
        'PARABOLA y² = 4ax: vertex at origin, focus at (a, 0), directrix x = −a, latus rectum length 4a. Parametric: (at², 2at).',
        'ELLIPSE x²/a² + y²/b² = 1 (a > b): foci at (±c, 0) where c² = a² − b². Eccentricity e = c/a < 1.',
        'HYPERBOLA x²/a² − y²/b² = 1: foci at (±c, 0) where c² = a² + b². Eccentricity e = c/a > 1. Asymptotes y = ±(b/a)x.',
        'LOCUS PROBLEMS: a moving point P(x, y) satisfies a geometric condition. Express x and y from the condition, eliminate parameter, derive the locus equation.',
        'CHORD OF CONTACT: from external point P, the line joining the two points of tangency. For circle x² + y² = r²: equation is xx₁ + yy₁ = r². Same form for other conics with replacement.',
        'COMMON CONFIGURATIONS: 1) Two perpendicular chords through a focus. 2) Reflection property of parabola (parallel rays focus). 3) Locus of midpoint of moving chord. 4) Tangents from a point to two circles. Practice these — JEE recycles them.',
      ],
      vocabulary: [
        { term: 'eccentricity', definition: 'a measure of how "stretched" a conic is; e = 0 circle, < 1 ellipse, = 1 parabola, > 1 hyperbola.' },
        { term: 'directrix', definition: 'a fixed line such that points on a conic have distance to focus = e × distance to directrix.' },
        { term: 'latus rectum', definition: 'a chord through the focus perpendicular to the axis; length depends on the conic.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-locus',
      kind: 'worked_example',
      problem: 'Find the locus of the midpoint of a chord of the parabola y² = 4x that subtends a right angle at the vertex (origin).',
      steps: [
        'PARAMETRIC POINTS on parabola: (t₁², 2t₁) and (t₂², 2t₂).',
        'CHORD subtends right angle at vertex (origin): vectors from origin to the two points are perpendicular. Dot product = 0.',
        '(t₁²)(t₂²) + (2t₁)(2t₂) = 0 → t₁² t₂² + 4 t₁ t₂ = 0 → t₁ t₂ (t₁ t₂ + 4) = 0.',
        'Discard trivial t₁ t₂ = 0. So t₁ t₂ = −4.',
        'MIDPOINT (h, k): h = (t₁² + t₂²)/2 = ((t₁ + t₂)² − 2 t₁ t₂)/2 = ((t₁ + t₂)² + 8)/2. k = (2t₁ + 2t₂)/2 = t₁ + t₂.',
        'So (t₁ + t₂) = k and h = (k² + 8)/2 → 2h = k² + 8 → k² = 2h − 8 → y² = 2x − 8.',
        'LOCUS: y² = 2x − 8 (a parabola with vertex (4, 0), opening right).',
      ],
      answer: 'y² = 2x − 8',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the equation of the chord of contact from the point (3, 4) to the circle x² + y² = 25.',
      expectedAnswer: '3x + 4y = 25',
      responseFormat: 'free',
      hints: [
        'Chord of contact from (x₁, y₁) to x² + y² = r² is xx₁ + yy₁ = r².',
        'Plug in: x(3) + y(4) = 25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-conic-sections-similar',
      kind: 'misconception_check',
      question: 'Are the focal properties of the ellipse and the hyperbola the same?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating ellipse and hyperbola foci.',
          correctsTo: 'Different. ELLIPSE: sum of distances from any point on the curve to the TWO foci is constant (= 2a). HYPERBOLA: |difference| of distances to the two foci is constant (= 2a). The signs differ. Plus, c² = a² − b² for ellipse vs c² = a² + b² for hyperbola — the foci are INSIDE the ellipse but OUTSIDE the hyperbola\'s vertices. Mixing these up is a top-3 JEE error in this chapter.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Standard forms: line, circle, parabola y²=4ax, ellipse, hyperbola.',
        'Tangent + chord-of-contact formulas (xx₁ + yy₁ = r² style).',
        'Locus = parametrize, eliminate parameter, derive equation.',
        'Ellipse foci INSIDE; hyperbola foci OUTSIDE the curve.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the reflection property of the parabola (parallel rays focus to the focus) make satellite dishes parabolic?',
      hint: 'Any ray entering parallel to the parabola\'s axis reflects off the surface and passes through the focus. So a parabolic dish concentrates all incoming parallel signals at the focal point — where the receiver sits. Same principle: car headlights (light source at focus → parallel rays out), solar furnaces.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
