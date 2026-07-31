/**
 * Geometry — Quadrilaterals: Rectangles, Rhombuses & Squares.
 *
 * The special parallelograms (CCSS G-CO.C.11, G-SRT.B.5): each one is a
 * parallelogram that inherits everything, then adds ONE condition — four
 * right angles or four equal sides — and earns a new diagonal property.
 * The two classic errors get equal billing: reading the family tree
 * backwards, and swapping "congruent diagonals" with "perpendicular
 * diagonals". Numeric work stays on Pythagorean triples so sides come
 * out whole.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U8_SPECIAL_PARALLELOGRAMS: LessonPlan = {
  id: 'evelyn.hs.geom.special-parallelograms.v1',
  title: 'Rectangles, Rhombuses & Squares',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.special-parallelograms',
      standard: 'GEOM-8.3',
      description:
        'Identify rectangles, rhombuses, and squares by their defining conditions, apply their diagonal and angle properties to find missing lengths and angle measures, and use the diagonal tests to classify a parallelogram (CCSS G-CO.C.11, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.parallelograms'],
  followUps: ['geom.trapezoids-kites'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the congruent-diagonals test as the carpenter trick that makes buildings square.',
      script:
        'Frame a deck, hang a door, lay out a tennis court — the first thing a builder does is stretch a tape across both diagonals. If the two diagonals come out equal, the corners are perfect right angles; if they are off by even a centimeter, the frame is a leaning parallelogram. No protractor involved. That test is a theorem you are about to prove-and-use: a parallelogram with congruent diagonals is a rectangle. Today you meet the three special parallelograms — rectangle, rhombus, square — and the diagonal signature that identifies each one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-special-parallelograms',
      kind: 'concept',
      goal: 'The family tree, the one extra condition each special type adds, and the diagonal property that comes with it.',
      keyIdeas: [
        'THEY ARE PARALLELOGRAMS FIRST — a rectangle, a rhombus, and a square each inherit EVERY parallelogram property: opposite sides ∥ and ≅, opposite angles ≅, consecutive angles supplementary, and diagonals that bisect each other. Then each adds one condition of its own.',
        'RECTANGLE = parallelogram + four right angles. Bonus property: THE DIAGONALS ARE CONGRUENT (in rectangle ABCD, AC = BD). Because they also bisect each other, the intersection point sits the same distance from all four vertices.',
        'RHOMBUS = parallelogram + four congruent sides. Two bonus properties: the diagonals are PERPENDICULAR (AC ⊥ BD), and each diagonal BISECTS the two angles it runs between.',
        'SQUARE = both at once — four right angles AND four equal sides. A square owns every rectangle property and every rhombus property: its diagonals are congruent, perpendicular, bisect each other, and cut each 90° corner into two 45° angles.',
        'DIAGONALS BUILD RIGHT TRIANGLES — in a rhombus the two diagonals cut the figure into four congruent right triangles whose legs are HALF of each diagonal and whose hypotenuse is a SIDE. That is the bridge to the Pythagorean theorem: (half of one diagonal)² + (half of the other diagonal)² = side².',
        'CLASSIC ERROR — READING THE TREE BACKWARDS. Every square is a rectangle and every square is a rhombus, but a rectangle need not be a square. Properties travel DOWN the tree to the more special shapes, never back up.',
        'CLASSIC ERROR — SWAPPING THE DIAGONAL SIGNATURES. Congruent diagonals mean rectangle; perpendicular diagonals mean rhombus. A rhombus that is not a square has diagonals of DIFFERENT lengths; a rectangle that is not a square has diagonals that are NOT perpendicular. Only the square gets both.',
        'THE CONDITIONS (used to classify) — a parallelogram with congruent diagonals is a rectangle; a parallelogram with perpendicular diagonals, or with a diagonal that bisects an angle, is a rhombus; a parallelogram with both is a square.',
      ],
      vocabulary: [
        { term: 'rhombus', definition: 'a parallelogram with four congruent sides.' },
        {
          term: 'perpendicular bisector',
          definition: 'a line that cuts a segment into two equal halves at a 90° angle — in a rhombus each diagonal is the perpendicular bisector of the other.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rectangle-diagonals',
      kind: 'worked_example',
      problem:
        'In rectangle ABCD the diagonals AC and BD intersect at point E. AE = 2x + 5 and BD = 6x + 2. Find x and the length of AC.',
      steps: [
        'Use the inherited property first: a rectangle is a parallelogram, so its diagonals bisect each other. E is the midpoint of AC, which makes AC = 2 · AE = 2(2x + 5) = 4x + 10.',
        'Now use the rectangle-only property: the diagonals are congruent, so AC = BD. That gives the equation 4x + 10 = 6x + 2.',
        'Solve: subtract 4x from both sides to get 10 = 2x + 2, then subtract 2 to get 8 = 2x, so x = 4.',
        'Substitute back: AC = 4(4) + 10 = 26. Check against the other diagonal: BD = 6(4) + 2 = 26 ✓. Half-diagonal AE = 13, so E is 13 units from all four corners.',
      ],
      answer: 'x = 4 and AC = 26 (BD = 26 as well)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rhombus-side-trap',
      kind: 'worked_example',
      problem:
        'Rhombus JKLM has diagonals JL = 16 and KM = 12. A student says each side is 14, because half of 16 plus half of 12 is 8 + 6 = 14. Find the actual side length and explain the error.',
      steps: [
        'Name the properties in play: the diagonals of a rhombus bisect each other AND meet at right angles, so they slice the rhombus into four congruent right triangles.',
        'Halve each diagonal: half of JL is 8 and half of KM is 6. In each little triangle those two halves are the LEGS, and the hypotenuse is a side of the rhombus.',
        'Apply the Pythagorean theorem: side² = 6² + 8² = 36 + 64 = 100, so each side is 10 (the 3-4-5 triple, doubled to 6-8-10).',
        'The error: adding 8 + 6 treats the two half-diagonals as if they lay end-to-end along the side. They meet at a 90° corner instead, so the side is the hypotenuse — always shorter than the two legs combined. 10 < 14 ✓.',
      ],
      answer: 'Each side is 10 — the half-diagonals are the legs of a right triangle, not pieces of the side.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-diagonal-signature',
      kind: 'try_yourself',
      problem: 'Which property is true of EVERY rectangle but NOT of every rhombus?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The diagonals are congruent', correct: true },
        { id: 'b', text: 'The diagonals bisect each other' },
        { id: 'c', text: 'The diagonals are perpendicular' },
        { id: 'd', text: 'Opposite sides are parallel' },
      ],
      expectedAnswer: 'The diagonals are congruent',
      hints: [
        'Two of these are plain parallelogram properties, so they hold for both shapes — rule those out first.',
        'One of the remaining two is the rhombus signature; the other is the rectangle signature.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rhombus-angle',
      kind: 'try_yourself',
      problem:
        'In rhombus ABCD, ∠ABC measures 70°. Diagonal BD is drawn from vertex B to vertex D. What is m∠ABD?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '35°', correct: true },
        { id: 'b', text: '70°' },
        { id: 'c', text: '55°' },
        { id: 'd', text: '110°' },
      ],
      expectedAnswer: '35°',
      hints: [
        'A rhombus diagonal does something special to the angles at the vertices it connects.',
        'BD bisects ∠ABC, so ∠ABD is half of 70°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Rhombus PQRS has diagonals of length 10 and 24. Its diagonals bisect each other at right angles. Find the length of one side and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Half of each diagonal — 5 and 12 — are the legs of a right triangle whose hypotenuse is a side of the rhombus.',
        '5² + 12² = 25 + 144 = 169; take the square root.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-perpendicular-means-square',
      kind: 'misconception_check',
      question:
        'A student is told that a parallelogram has diagonals that meet at a 90° angle and concludes "then it must be a square." What went wrong?',
      commonErrors: [
        {
          answer: 'The parallelogram is a square',
          misconception:
            'Treating any special diagonal property as proof of the most special shape — and assuming perpendicular diagonals must also be congruent diagonals.',
          correctsTo:
            'Perpendicular diagonals prove RHOMBUS only — four equal sides, but the corners can still be slanted and the two diagonals can have very different lengths. A square needs BOTH signatures: diagonals perpendicular (rhombus) AND congruent (rectangle).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'All three are parallelograms first — they inherit opposite sides ∥ and ≅, opposite angles ≅, and diagonals that bisect each other.',
        'Rectangle adds four right angles → congruent diagonals. Rhombus adds four equal sides → perpendicular diagonals that also bisect the angles.',
        'A square is both, so it gets both diagonal properties; every square is a rectangle and a rhombus, but never the reverse.',
        'Rhombus diagonals build four right triangles: half of one diagonal and half of the other are the legs, and the side is the hypotenuse — the Pythagorean route to a missing side.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Rectangles, Rhombuses & Squares' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
