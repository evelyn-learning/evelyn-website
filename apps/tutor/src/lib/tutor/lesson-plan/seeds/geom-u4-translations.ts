/**
 * Geometry — Transformations: Translations in the Coordinate Plane.
 *
 * The first rigid motion (CCSS G-CO.A.2, G-CO.A.4, G-CO.A.5): every point
 * slides by the same vector, so distance, angle measure, and orientation
 * all survive. Sign discipline is the whole battle — "left" and "down"
 * are the negative directions, and the rule is found by image minus
 * preimage, never the other way around.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U4_TRANSLATIONS: LessonPlan = {
  id: 'evelyn.hs.geom.translations.v1',
  title: 'Translations in the Coordinate Plane',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.translations',
      standard: 'GEOM-4.1',
      description:
        'Translate figures in the coordinate plane using a translation vector or rule, determine the rule that maps a preimage onto its image, and explain why a translation is a rigid motion preserving distance, angle measure, and orientation (CCSS G-CO.A.2, G-CO.A.4, G-CO.A.5).',
    },
  ],
  prerequisites: ['geom.slopes-parallel-perpendicular'],
  followUps: ['geom.reflections'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame translation as the simplest rigid motion — the move behind repeating patterns and the entry point to congruence.',
      script:
        'Look at a tiled floor, a brick wall, or the repeating window panels on an apartment building. Each piece is not redrawn — it is the same piece slid over by the same amount, again and again. That slide is a TRANSLATION, and it is the gentlest of all the moves in geometry: nothing turns, nothing flips, nothing changes size. Today you learn to run a slide with coordinates, and to work backwards from a before-and-after pair to the exact slide that caused it. This is also the first of four transformations that will eventually let us define congruence itself.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translation-rule',
      kind: 'concept',
      goal: 'The coordinate rule, vector language, the rigid-motion guarantees, and the sign traps that ruin most attempts.',
      keyIdeas: [
        'WHAT A TRANSLATION IS — every point of a figure moves the SAME distance in the SAME direction. No turning, no flipping, no stretching. The starting figure is the PREIMAGE, the moved copy is the IMAGE, and image points get prime marks: A moves to A prime, written A\'.',
        'THE COORDINATE RULE — a translation is (x, y) → (x + a, y + b). Every single vertex takes the same a and the same b. Translating a triangle is just the same arithmetic done three times.',
        'VECTOR LANGUAGE — the pair a, b is the TRANSLATION VECTOR: a is how far right, b is how far up. So "7 right and 3 down" is the vector with components 7 and -3, and the rule (x, y) → (x + 7, y - 3).',
        'SIGN DISCIPLINE (classic error 1) — left and down are the NEGATIVE directions. "6 units left" is a = -6, not +6; "2 units down" is b = -2. Students hear a positive word like "move" and add. Always test the rule on one point before doing the rest.',
        'FINDING THE RULE FROM A PAIR (classic error 2) — subtract IMAGE minus PREIMAGE: a = x\' - x and b = y\' - y. Reversing the subtraction flips both signs and gives the translation that undoes the move instead of the one that made it.',
        'RIGID MOTION — a translation preserves distance and angle measure, so the image is ≅ to the preimage. It also preserves ORIENTATION: the vertices still read clockwise (or counter-clockwise) in the same order, which is what separates a slide from a flip.',
        'EVERY POINT TRAVELS ON A PARALLEL TRACK — the segments AA\', BB\', and CC\' joining each point to its image are all parallel and all the same length. If your connectors are not parallel and equal, you did not translate — you distorted the figure.',
      ],
      vocabulary: [
        {
          term: 'preimage',
          definition: 'the original figure before a transformation; the moved copy is its image, labeled with prime marks.',
        },
        {
          term: 'translation vector',
          definition: 'the pair of components a, b giving the horizontal and vertical shift applied to every point.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-apply-rule',
      kind: 'worked_example',
      problem:
        'Triangle ABC has vertices A(-2, 3), B(1, 5), and C(4, -1). Apply the translation (x, y) → (x + 5, y - 2) and give the vertices of the image △A\'B\'C\'. Then check that the side lengths survived.',
      steps: [
        'Read the rule: a = 5 (5 units right) and b = -2 (2 units down). Same shift for all three vertices.',
        'A(-2, 3) → A\'(-2 + 5, 3 - 2) = A\'(3, 1).',
        'B(1, 5) → B\'(1 + 5, 5 - 2) = B\'(6, 3). C(4, -1) → C\'(4 + 5, -1 - 2) = C\'(9, -3).',
        'Check one side with the distance formula: AB runs from (-2, 3) to (1, 5), so AB = √(3² + 2²) = √13. A\'B\' runs from (3, 1) to (6, 3), so A\'B\' = √(3² + 2²) = √13. Same length — the slide is rigid. ✓',
        'Check the connectors: A to A\' is 5 right and 2 down; B to B\' is 5 right and 2 down; C to C\' is 5 right and 2 down. Parallel and equal, as required.',
      ],
      answer: 'A\'(3, 1), B\'(6, 3), C\'(9, -3) — and △A\'B\'C\' ≅ △ABC',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-rule-sign-trap',
      kind: 'worked_example',
      problem:
        'A translation maps P(7, -1) onto P\'(2, 4). A student writes the rule as (x, y) → (x + 5, y - 5). Find the correct rule and explain the error.',
      steps: [
        'The rule is found by subtracting IMAGE minus PREIMAGE, coordinate by coordinate.',
        'Horizontal: a = x\' - x = 2 - 7 = -5. Vertical: b = y\' - y = 4 - (-1) = 4 + 1 = 5.',
        'So the correct rule is (x, y) → (x - 5, y + 5): 5 units left and 5 units up.',
        'Find the error: the student computed preimage minus image (7 - 2 = 5 and -1 - 4 = -5), which flips both signs. Their rule is the trip BACK from P\' to P.',
        'Always test on the given point: the student\'s rule sends P(7, -1) to (12, -6), nowhere near P\'(2, 4). The correct rule sends P(7, -1) to (7 - 5, -1 + 5) = (2, 4) = P\'. ✓',
      ],
      answer: '(x, y) → (x - 5, y + 5); the student subtracted in the wrong order, flipping both signs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-apply-rule',
      kind: 'try_yourself',
      problem: 'Point M(-3, 6) is translated 4 units right and 7 units down. What are the coordinates of M\'?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(1, -1)', correct: true },
        { id: 'b', text: '(1, 13)' },
        { id: 'c', text: '(-7, -1)' },
        { id: 'd', text: '(-7, 13)' },
      ],
      expectedAnswer: '(1, -1)',
      hints: [
        'Turn the words into a rule first: which of a and b is positive, and which is negative?',
        'Right is +4 and down is -7, so the rule is (x, y) → (x + 4, y - 7). Now substitute x = -3 and y = 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rigid-motion',
      kind: 'try_yourself',
      problem:
        '△PQR is translated 9 units left and 4 units up to produce △P\'Q\'R\'. In the preimage, PQ = 12 cm and ∠Q = 63°. Which statement about the image must be true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'P\'Q\' = 12 cm and ∠Q\' = 63°', correct: true },
        { id: 'b', text: 'P\'Q\' = 3 cm and ∠Q\' = 63°' },
        { id: 'c', text: 'P\'Q\' = 21 cm and ∠Q\' = 63°' },
        { id: 'd', text: 'P\'Q\' = 12 cm, but the angle measures change because the triangle moved' },
      ],
      expectedAnswer: 'P\'Q\' = 12 cm and ∠Q\' = 63°',
      hints: [
        'A translation is a rigid motion — ask what a rigid motion is allowed to change.',
        'The 9 and the 4 move the triangle\'s POSITION; they never get added to or subtracted from a side length or an angle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A translation maps A(-3, 5) onto A\'(4, 1). The same translation maps B(6, -2) onto B\'. Type the x-coordinate of B\' as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'First find the horizontal shift: a = x\' - x = 4 - (-3).',
        'a = 7, and the same 7 is added to B\'s x-coordinate: 6 + 7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-uneven-shift',
      kind: 'misconception_check',
      question:
        'A student translating △ABC 5 units right and 2 units up moves vertex A correctly, then places B and C by eye so the copy "looks about right." The image comes out slightly stretched. What went wrong?',
      commonErrors: [
        {
          answer: 'The image is still a translation of △ABC because the whole triangle moved right and up',
          misconception:
            'Treating a translation as "shove the shape over roughly" instead of applying one identical rule to every point.',
          correctsTo:
            'A translation applies the SAME rule (x, y) → (x + 5, y + 2) to every vertex. Recompute B\' and C\' with that rule, then verify: AA\', BB\', and CC\' must all be parallel and the same length. Unequal shifts stretch the figure, so the result is no longer ≅ to the preimage and is not a translation at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A translation slides every point by the same vector: (x, y) → (x + a, y + b), applied identically to every vertex.',
        'Left and down are negative: "6 left, 2 down" is (x, y) → (x - 6, y - 2).',
        'To find the rule from a before-and-after pair, subtract image minus preimage: a = x\' - x, b = y\' - y. Reversing it flips both signs.',
        'Translations are rigid motions: lengths, angle measures, and orientation are unchanged, so the image is ≅ to the preimage.',
        'Every connector AA\', BB\', CC\' is parallel and equal in length — a fast way to check your work.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Translations in the Coordinate Plane' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
