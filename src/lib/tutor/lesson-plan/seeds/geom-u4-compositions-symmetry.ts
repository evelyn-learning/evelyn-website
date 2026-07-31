/**
 * Geometry — Transformations: Compositions of Rigid Motions & Symmetry.
 *
 * Stacking rigid motions (CCSS G-CO.A.3, G-CO.A.5): order matters, two
 * reflections collapse into a single translation or rotation, and a figure
 * that maps onto itself under a rigid motion is symmetric. The doubling
 * rules (2 × distance, 2 × angle) and the 360°-doesn't-count rule are the
 * two places students reliably slip.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U4_COMPOSITIONS_SYMMETRY: LessonPlan = {
  id: 'evelyn.hs.geom.compositions-symmetry.v1',
  title: 'Compositions of Rigid Motions & Symmetry',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.compositions-symmetry',
      standard: 'GEOM-4.4',
      description:
        'Perform and describe compositions of translations, reflections, and rotations, predict the single rigid motion two reflections produce, and identify the lines of symmetry and angles of rotational symmetry that carry a figure onto itself (CCSS G-CO.A.3, G-CO.A.5).',
    },
  ],
  prerequisites: ['geom.rotations'],
  followUps: ['geom.congruence-rigid-motions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame compositions and symmetry as the grammar behind tile patterns, logos, and repeating design.',
      script:
        'Look at a tiled floor, a wallpaper border, or a company logo. None of those were drawn shape by shape — someone drew ONE motif and then moved it: slide, flip, turn, repeat. Today you learn to stack those motions and name what the stack does. Two flips across two mirrors, for instance, are secretly a single slide or a single spin. And when a motion lands a figure exactly back on top of itself, that figure has symmetry — the property designers chase and engineers exploit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-compositions-symmetry',
      kind: 'concept',
      goal: 'Composition mechanics, the two-reflection theorems, glide reflections, and the two kinds of symmetry.',
      keyIdeas: [
        'WHAT A COMPOSITION IS — apply one rigid motion, then apply another to the RESULT. Every rigid motion preserves length and angle measure, so a composition of rigid motions is itself a rigid motion: the final image is still congruent to the original.',
        'READ THE NOTATION BACKWARD — the composition written (T ∘ r)(P) means "do r FIRST, then T," exactly like function composition. Written in words instead, say "reflect, then translate" and do it in that spoken order.',
        'ORDER MATTERS — reflecting then translating usually lands somewhere different from translating then reflecting. Composition is not commutative, so never reorder the steps to make the arithmetic easier.',
        'TWO REFLECTIONS, PARALLEL MIRRORS = TRANSLATION — reflecting across line m and then across line n, where m ∥ n and the lines sit d apart, translates the figure perpendicular to the lines a distance of 2d, in the direction from m toward n. The classic error is answering d instead of 2d.',
        'TWO REFLECTIONS, INTERSECTING MIRRORS = ROTATION — if m and n meet at the point P forming an angle of θ, reflecting across m and then across n rotates the figure about P through 2θ, turning from m toward n. Again the error is answering θ instead of 2θ.',
        'GLIDE REFLECTION — a reflection composed with a translation PARALLEL to the line of reflection; a line of footprints down a beach is the standard picture. This is the one composition where the order genuinely does not matter.',
        'LINE SYMMETRY — a figure has a line of symmetry if reflecting across that line maps the figure exactly onto itself. A regular n-gon has exactly n lines of symmetry.',
        'ROTATIONAL SYMMETRY — a figure has rotational symmetry if some rotation of less than 360° about its center maps it onto itself; for a regular n-gon the smallest such angle is 360°/n. A full 360° turn does NOT count — it maps every figure onto itself, so it would make the idea meaningless. Line symmetry and rotational symmetry are independent: a slanted parallelogram has 180° rotational symmetry and no line of symmetry at all.',
      ],
      vocabulary: [
        {
          term: 'composition of transformations',
          definition: 'a sequence of two or more transformations where each one is applied to the image produced by the previous one.',
        },
        {
          term: 'rotational symmetry',
          definition: 'the property of a figure that some rotation of less than 360° about its center maps the figure onto itself.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-coordinate-composition',
      kind: 'worked_example',
      problem:
        '△ABC has vertices A(1, 2), B(4, 2), and C(1, 6). Reflect it across the x-axis, then translate the image 3 units right and 1 unit up. Give the final coordinates, and check whether reversing the order would give the same answer.',
      steps: [
        'Do the FIRST motion only. Reflection across the x-axis: (x, y) → (x, -y). A(1, 2) → (1, -2), B(4, 2) → (4, -2), C(1, 6) → (1, -6).',
        'Feed those images into the SECOND motion. Translation 3 right and 1 up: (x, y) → (x + 3, y + 1).',
        '(1, -2) → (4, -1), (4, -2) → (7, -1), (1, -6) → (4, -5). Final triangle: (4, -1), (7, -1), (4, -5).',
        'Now test the reverse order. Translating first gives (4, 3), (7, 3), (4, 7); reflecting those across the x-axis gives (4, -3), (7, -3), (4, -7) — a different triangle.',
        'Same two motions, different order, different image. Both images are congruent to △ABC, since each step was a rigid motion, but they sit in different places.',
      ],
      answer: '(4, -1), (7, -1), (4, -5) — and no, the reverse order gives (4, -3), (7, -3), (4, -7)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parallel-mirrors',
      kind: 'worked_example',
      problem:
        'Lines m and n are the vertical lines x = 2 and x = 5, so they are parallel and 3 units apart. A figure is reflected across m and then across n. A student says "the two mirrors are 3 apart, so the figure slides 3 units right." Track the point P(1, 4) and settle it.',
      steps: [
        'Reflect P(1, 4) across m, the line x = 2. P sits 1 unit to the LEFT of m, so its image sits 1 unit to the RIGHT of m: (3, 4).',
        'Reflect (3, 4) across n, the line x = 5. That point sits 2 units to the left of n, so its image sits 2 units to the right of n: (7, 4).',
        'Compare start and finish: (1, 4) → (7, 4). The point moved 6 units right, not 3. The y-coordinate never changed, so the net motion is a horizontal translation.',
        'Check the rule: the translation distance is 2d = 2(3) = 6, perpendicular to the mirrors, in the direction from m toward n. The student halved the answer by reporting the gap between the mirrors instead of twice the gap.',
        'Test a second point to be sure: Q(0, 1) → (4, 1) across m → (6, 1) across n. Again 6 units right — every point of the figure shifts the same way, which is exactly what makes the composition a translation.',
      ],
      answer: 'A translation of 6 units to the right (2 × 3), not 3 units.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-intersecting-mirrors',
      kind: 'try_yourself',
      problem:
        'Lines p and q intersect at point V, forming a 35° angle. A figure is reflected across p and then across q. Which single rigid motion is that composition equivalent to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A rotation of 70° about V', correct: true },
        { id: 'b', text: 'A rotation of 35° about V' },
        { id: 'c', text: 'A translation of 70 units' },
        { id: 'd', text: 'A reflection across a third line through V' },
      ],
      expectedAnswer: 'A rotation of 70° about V',
      hints: [
        'The mirrors intersect rather than run parallel — which of the two reflection theorems applies?',
        'Intersecting mirrors give a rotation about the intersection point through TWICE the angle between them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hexagon-symmetry',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes the symmetry of a regular hexagon?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6 lines of symmetry, and the smallest rotation that maps it onto itself is 60°', correct: true },
        { id: 'b', text: '3 lines of symmetry, and the smallest rotation that maps it onto itself is 60°' },
        { id: 'c', text: '6 lines of symmetry, and the smallest rotation that maps it onto itself is 30°' },
        { id: 'd', text: '6 lines of symmetry, and no rotational symmetry' },
      ],
      expectedAnswer: '6 lines of symmetry, and the smallest rotation that maps it onto itself is 60°',
      hints: [
        'A regular n-gon has n lines of symmetry — count the vertex-to-vertex lines AND the ones through opposite edge midpoints.',
        'The smallest angle of rotational symmetry for a regular n-gon is 360°/n.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'The point P(3, -2) is rotated 90° counterclockwise about the origin, and then that image is translated 4 units right and 1 unit down. What is the x-coordinate of the final image? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Rotate first: 90° counterclockwise about the origin is (x, y) → (-y, x).',
        'That puts the point at (2, 3); now add 4 to the x-coordinate for the translation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parallelogram-symmetry',
      kind: 'misconception_check',
      question:
        'A student says a slanted (non-rectangular) parallelogram has 2 lines of symmetry, one along each diagonal, "because the diagonals cut it into matching halves." What went wrong?',
      commonErrors: [
        {
          answer: 'It has 2 lines of symmetry, one along each diagonal',
          misconception:
            'Treating "cuts the figure into two congruent pieces" as the test for a line of symmetry, instead of testing whether a reflection maps the figure ONTO ITSELF.',
          correctsTo:
            'Reflect the parallelogram across a diagonal and the halves swap but do not land back on the original outline — the slanted sides tip the wrong way. A general parallelogram has NO lines of symmetry; what it does have is 180° rotational symmetry about the intersection of its diagonals. (Add equal sides and you get a rhombus, with the diagonals finally becoming true lines of symmetry.)',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A composition applies each motion to the previous image; order matters, and notation like (T ∘ r) is read right to left.',
        'Two reflections across parallel mirrors d apart = a translation of 2d, perpendicular to the mirrors, first mirror toward second.',
        'Two reflections across mirrors meeting at θ = a rotation of 2θ about the intersection point. Double it — do not report d or θ.',
        'A composition of rigid motions is a rigid motion, so the final image is always congruent to the original.',
        'Symmetry = a rigid motion that maps the figure onto itself: n lines and 360°/n rotation for a regular n-gon; 360° never counts, and line and rotational symmetry can occur without each other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Compositions of Rigid Motions & Symmetry' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
