/**
 * Geometry — Transformations: Reflections.
 *
 * The flip (CCSS G-CO.A.4, G-CO.A.5): the line of reflection is the
 * perpendicular bisector of every segment joining a point to its image.
 * Coordinate rules come second — the distance-to-the-line definition is
 * what survives when the mirror line is not an axis. Reflections are also
 * the only rigid motion that reverses orientation, which is the property
 * symmetry and the congruence proofs of Unit 4 lean on.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U4_REFLECTIONS: LessonPlan = {
  id: 'evelyn.hs.geom.reflections.v1',
  title: 'Reflections',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.reflections',
      standard: 'GEOM-4.2',
      description:
        'Describe a reflection as the rigid motion whose line of reflection is the perpendicular bisector of every segment joining a point to its image, apply reflection rules across the axes, y = x, and horizontal or vertical lines, and explain why a reflection reverses orientation while preserving distance and angle measure (CCSS G-CO.A.4, G-CO.A.5, G-CO.B.6).',
    },
  ],
  prerequisites: ['geom.translations'],
  followUps: ['geom.rotations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame reflection as the move that generates symmetry — the designer\'s and architect\'s workhorse — and the only rigid motion that flips handedness.',
      script:
        'Hold your left hand up to a mirror and you see a right hand. Nothing changed size, nothing bent — and yet the mirror image is a hand you cannot slide or spin your left hand into. That is a reflection: distances and angles survive perfectly, but the figure comes back flipped. Architects fold a facade across a center line to make it symmetric, logo designers mirror a letterform, and later in this course you will reflect a triangle onto another triangle to PROVE they are congruent. Today: how to reflect anything across any line, and how to spot the flip.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reflection-rules',
      kind: 'concept',
      goal: 'The perpendicular-bisector definition, the coordinate rules that follow from it, and the orientation reversal that makes reflections different.',
      keyIdeas: [
        'THE DEFINITION — a reflection across line m sends each point P to the point P\' such that m is the perpendicular bisector of segment PP\'. In plain words: P and P\' sit on opposite sides of m, the same distance from m, and PP\' ⊥ m. Everything else in this lesson is a shortcut for that sentence.',
        'POINTS ON THE MIRROR DO NOT MOVE — if P is on line m, then P\' = P. Those fixed points are what pins a reflection in place, and they are why a reflected figure can overlap the original.',
        'THE FOUR STANDARD RULES — across the x-axis: (x, y) → (x, -y). Across the y-axis: (x, y) → (-x, y). Across y = x: (x, y) → (y, x) — the coordinates SWAP, no sign change. Across y = -x: (x, y) → (-y, -x).',
        'ANY HORIZONTAL OR VERTICAL MIRROR — across y = k: (x, y) → (x, 2k - y). Across x = h: (2h - x, y). You never have to memorize these: count how far the point is from the line, then count the same distance to the other side.',
        'RIGID MOTION — a reflection preserves every length and every angle measure, so the image is CONGRUENT to the original: △ABC ≅ △A\'B\'C\'. Only positions change, never sizes.',
        'ORIENTATION REVERSES — this is the signature of a reflection. If A, B, C read counterclockwise around the original triangle, then A\', B\', C\' read CLOCKWISE around the image. Translations and rotations never do this, so no slide or turn can ever reproduce a single reflection.',
        'THE CLASSIC ERROR: NEGATING THE WRONG COORDINATE — reflecting across the x-axis changes the y-coordinate, because y measures distance FROM the x-axis. Name the mirror, ask which coordinate measures distance from it, and flip only that one.',
      ],
      vocabulary: [
        { term: 'line of reflection', definition: 'the mirror line — the perpendicular bisector of every segment joining a point to its image.' },
        { term: 'orientation', definition: 'the rotational order (clockwise or counterclockwise) in which a figure\'s labeled vertices are read; a reflection reverses it.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-reflect-y-axis',
      kind: 'worked_example',
      problem:
        'Triangle DEF has vertices D(2, 1), E(6, 1), and F(2, 4). Reflect it across the y-axis and give the coordinates of D\', E\', and F\'. Then state how the orientation changed.',
      steps: [
        'Identify the mirror: the y-axis is the vertical line x = 0, so the x-coordinate measures distance from it — the rule is (x, y) → (-x, y).',
        'Apply it vertex by vertex: D(2, 1) → D\'(-2, 1); E(6, 1) → E\'(-6, 1); F(2, 4) → F\'(-2, 4).',
        'Check with the definition, not the rule: D is 2 units right of the y-axis, and D\' is 2 units left of it, on the same horizontal line — so the y-axis bisects DD\' perpendicularly. ✓',
        'Check congruence: DE was 6 - 2 = 4 units long; D\'E\' is from -2 to -6, also 4 units. Lengths survived, as they must for a rigid motion.',
        'Orientation: reading D → E → F you travel counterclockwise; reading D\' → E\' → F\' you travel clockwise. The reflection flipped the orientation while keeping the triangle congruent.',
      ],
      answer: 'D\'(-2, 1), E\'(-6, 1), F\'(-2, 4) — congruent to △DEF, with orientation reversed from counterclockwise to clockwise.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-horizontal-line-trap',
      kind: 'worked_example',
      problem:
        'Reflect the points A(5, 8), B(5, 3), and C(1, 3) across the horizontal line y = 3. A classmate answers A\'(5, -8), B\'(5, -3), C\'(1, -3) by "flipping the y-signs." Find the correct images and explain the error.',
      steps: [
        'Name the mirror: y = 3 is a horizontal line, so vertical distance is what matters and only the y-coordinate changes. The x-coordinates stay 5, 5, and 1.',
        'Reflect A by counting: A(5, 8) is 8 - 3 = 5 units ABOVE the line, so A\' is 5 units below it, at y = 3 - 5 = -2. A\'(5, -2).',
        'Reflect B and C: both sit at y = 3, which is ON the mirror line — so they do not move. B\'(5, 3) and C\'(1, 3).',
        'Same answer from the rule (x, y) → (x, 2k - y) with k = 3: A gives (5, 6 - 8) = (5, -2); B gives (5, 6 - 3) = (5, 3). ✓',
        'The error: "flip the y-sign" is the rule for the x-axis only, because y = 0 is the ONLY horizontal line whose reflection sends y to -y. The classmate reflected across y = 0 instead of y = 3, and even moved B and C, which were sitting on the mirror.',
      ],
      answer: 'A\'(5, -2), B\'(5, 3), C\'(1, 3) — points on the line of reflection stay fixed, and (x, y) → (x, -y) is only valid for the x-axis.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-reflect-y-equals-x',
      kind: 'try_yourself',
      problem: 'What is the image of the point (5, -2) after a reflection across the line y = x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-2, 5)', correct: true },
        { id: 'b', text: '(2, -5)' },
        { id: 'c', text: '(-5, 2)' },
        { id: 'd', text: '(5, 2)' },
      ],
      expectedAnswer: '(-2, 5)',
      hints: [
        'Reflecting across y = x trades the roles of the two coordinates — ask yourself whether any sign should change at all.',
        'The rule is (x, y) → (y, x): swap the coordinates and leave the signs alone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-orientation',
      kind: 'try_yourself',
      problem:
        'Triangle PQR is reflected across a line to produce triangle P\'Q\'R\'. Reading P → Q → R travels counterclockwise around the original. Which statement about the image is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'P\' → Q\' → R\' reads clockwise, and △P\'Q\'R\' ≅ △PQR', correct: true },
        { id: 'b', text: 'P\' → Q\' → R\' reads counterclockwise, and △P\'Q\'R\' ≅ △PQR' },
        { id: 'c', text: 'P\' → Q\' → R\' reads clockwise, and △P\'Q\'R\' is similar but smaller than △PQR' },
        { id: 'd', text: 'The side lengths of △P\'Q\'R\' depend on how far the triangle is from the line of reflection' },
      ],
      expectedAnswer: 'P\' → Q\' → R\' reads clockwise, and △P\'Q\'R\' ≅ △PQR',
      hints: [
        'Two separate questions: does a reflection change size, and does it change the rotational order of the labels?',
        'A reflection is a rigid motion, so lengths and angles survive — but it is the one rigid motion that reverses orientation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'The point P(3, 7) is reflected across the horizontal line y = 2. Its image is P\'(3, k). Type the value of k as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'How many units above the line y = 2 does P sit? The image sits that same distance below it.',
        'P is 5 units above the mirror, so drop 5 units below y = 2. (Or use (x, y) → (x, 2k - y): 2(2) - 7.)',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-coordinate',
      kind: 'misconception_check',
      question:
        'A student reflects the point (-4, 5) across the x-axis and writes (4, 5), explaining "a reflection puts it on the other side, so the number becomes negative the other way." What went wrong?',
      commonErrors: [
        {
          answer: '(4, 5)',
          misconception: 'Swapping the axis rules — negating the coordinate named by the axis instead of the coordinate that measures distance from it.',
          correctsTo:
            'The x-axis is the mirror, and the y-coordinate is what measures distance from the x-axis — so y flips and x stays: (-4, 5) → (-4, -5). Check it against the definition: the point is 5 units above the x-axis, so the image is 5 units below, directly underneath. The answer (4, 5) is the reflection across the y-axis instead.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Definition first: the line of reflection is the perpendicular bisector of every segment joining a point to its image — equal distance, opposite sides, PP\' ⊥ m.',
        'Rules: x-axis (x, y) → (x, -y); y-axis (x, y) → (-x, y); y = x (x, y) → (y, x); y = k (x, y) → (x, 2k - y); x = h (2h - x, y).',
        'Points sitting on the line of reflection do not move.',
        'Reflections are rigid motions: the image is congruent — every length and angle is preserved.',
        'Orientation reverses. That flip is the fingerprint of a reflection, and no translation or rotation can imitate it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Reflections' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
