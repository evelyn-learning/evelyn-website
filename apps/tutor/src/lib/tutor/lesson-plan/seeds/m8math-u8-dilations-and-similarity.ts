/**
 * Grade 8 Math — Transformations, Congruence & Similarity: Dilations &
 * Similarity.
 *
 * CONCEPT-LED. The student owns three rigid motions and the fact that a
 * sequence of them defines congruence; what is new is the one transformation
 * that changes size. The lesson builds two linked models (CCSS 8.G.A.3,
 * 8.G.A.4): a dilation from the origin multiplies BOTH coordinates by the
 * same scale factor k, and nothing is added — k > 1 enlarges, 0 < k < 1
 * shrinks, and k is found by dividing new over old; and two figures are
 * similar exactly when a dilation followed by rigid motions maps one onto
 * the other, with congruence falling out as the k = 1 case. Both worked
 * examples apply the rule to every vertex and check by working backward, the
 * second one runs the size-first-then-position recipe for describing a
 * sequence, and the plan is built to kill three traps: adding the scale
 * factor instead of multiplying (which is a translation), dividing old by new
 * to get 1/k, and calling two same-shape figures congruent.
 *
 * SCOPE GUARD: Grade 8 row 8.4 dilates a figure from the origin by scale
 * factor k ((x, y) → (kx, ky), including 0 < k < 1), finds k from a pair of
 * figures, and defines similar figures as those connected by a dilation
 * followed by rigid motions, describing such a sequence. Assumes scale factor
 * = constant of proportionality and area scaling by k² from
 * `m7math-u7-scale-drawings.ts` (not re-taught). Withholds: dilations about
 * other centers and the preserved-vs-scaled catalogue →
 * `geom-u6-dilations-scale-factor.ts`; proportional-sides tests and
 * perimeter/area ratios → `geom-u6-similar-polygons.ts`; SSS/SAS similarity →
 * `geom-u6-triangle-similarity-criteria.ts` (AA is row 9.2). Concretely:
 * every dilation in this plan is centered at the origin, and "center of
 * dilation" is defined only to say that the center is the origin here; every
 * scale factor is positive, with both k > 1 and 0 < k < 1 appearing; vertices
 * may have negative coordinates and figures sit in any quadrant. "Same shape"
 * is stated in one sentence — angles unchanged, every side multiplied by the
 * same k — only as far as the definition of similar needs it, and is never
 * expanded into a preserved-versus-scaled list; the word "area" and the word
 * "perimeter" do not appear anywhere in the body below this comment. The
 * scale factor is always found by dividing ONE matching pair of sides or
 * coordinates, new over old, and confirmed with a second pair; testing every
 * side ratio of two given polygons as a similarity criterion never appears,
 * and no triangle similarity criterion (AA, SSS, SAS) is named. Sideways: the
 * rigid motions that follow a dilation are only ones the student already owns
 * from rows 8.1-8.3 (translations, reflections across the x- or y-axis,
 * rotations about the origin), no rigid-motion rule is taught as new, and
 * congruence appears only as the contrast case (congruent is k = 1, and a
 * figure whose side lengths changed is not congruent to its original), never
 * as a question in its own right (row 8.3); no angle fact is used to argue
 * similarity (row 9.2). Salvaged from `g8-math-transformations.ts`: the
 * "dilation changes size but preserves shape (similarity)" framing only.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U8_DILATIONS_AND_SIMILARITY: LessonPlan = {
  id: 'evelyn.ms.m8math.dilations-and-similarity.v1',
  title: 'Dilations & Similarity',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.dilations-and-similarity',
      standard: 'M8MATH-8.4',
      description:
        'Dilate a figure from the origin by scale factor k ((x, y) → (kx, ky), including 0 < k < 1), find k from a pair of figures, and define similar figures as those connected by a dilation followed by rigid motions; describe such a sequence (CCSS 8.G.A.3, 8.G.A.4).',
    },
  ],
  prerequisites: ['m8math.congruence-through-rigid-motions'],
  followUps: ['m8math.parallel-lines-cut-by-a-transversal'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel a resize from a fixed point, and feel that a zoomed, dragged, turned picture is the same shape without being the same size, before dilation and similar are defined.',
      script:
        'Open a photo of your team on your phone and pinch to zoom. The whole picture grows at once: no one gets a bigger head than anyone else, because every distance from the spot between your fingers gets multiplied by the same number. Zoom in by 2 and everything sits twice as far from that spot; pinch the other way and everything sits half as far. That resize has a name, dilation, and on the coordinate plane we pin the zoom spot at the origin so the rule becomes a single multiplication. Now zoom the photo, then drag it across the screen and turn it a little. It is still the same picture, only bigger. It is not congruent to the original, because the size changed, but it has exactly the same shape. Today that idea gets a name too, similar, and you will test it with the slides, flips and turns you already own.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dilate-then-move',
      kind: 'concept',
      goal: 'Install the origin dilation rule for both kinds of k, the new-over-old way to find k, and the definition of similar as a dilation followed by rigid motions, with a recipe for describing the sequence.',
      keyIdeas: [
        'A DILATION IS A RESIZE FROM A CENTER — a dilation from the origin by scale factor k sends every point (x, y) to (kx, ky). Both coordinates get multiplied by the same k, and nothing is added. With k = 3, the point (2, 1) lands on (6, 3): three times as far from the origin, on the very same line through the origin. The origin itself stays put, because 3 × 0 is still 0.',
        'k ABOVE 1 ENLARGES, k BETWEEN 0 AND 1 SHRINKS — with k = 1/2, the point (6, 4) lands on (3, 2), half as far from the origin. A shrink is still a multiplication: you multiply by a number less than 1, you never subtract, and you never divide by k. In this lesson k is always positive, and a dilated point stays in the same quadrant as the point it came from, so a negative coordinate stays negative: (-6, 10) with k = 1/2 gives (-3, 5).',
        'k IS THE SCALE FACTOR YOU ALREADY KNOW — in a scale drawing, k was a constant of proportionality, one multiplier for every length, and this is the same k. Every side of the image is k times the matching side of the original, so you find k by dividing new over old: image length ÷ original length, or image coordinate ÷ original coordinate. If a side of length 4 becomes a side of length 10, then k = 10 ÷ 4 = 2.5. Dividing the other way, 4 ÷ 10 = 0.4, is the most common slip, and the size check catches it: the image got bigger, so k has to be bigger than 1.',
        'SAME SHAPE, NEW SIZE — a dilation is not a rigid motion, because lengths change, so the image is NOT congruent to the original. What a dilation keeps is the shape: every angle stays exactly the same size, and every side is multiplied by the same k, so a right triangle is still a right triangle and a square is still a square, only bigger or smaller.',
        'SIMILAR MEANS A DILATION PLUS RIGID MOTIONS — two figures are similar when a dilation followed by a sequence of translations, reflections and rotations maps one exactly onto the other. The dilation fixes the size and the rigid motions fix the position. Congruent figures are the special case where the scale factor is 1 and only the rigid motions are needed, so every congruent pair is also similar, but a similar pair is usually not congruent.',
        'DESCRIBING THE SEQUENCE: SIZE FIRST, THEN POSITION — to get from one figure to a similar one, divide a pair of matching sides, new over old, to find k, and dilate the first figure from the origin by that k. Then compare the dilated copy with the target figure: if every vertex moved the same distance in the same direction, the motion is a translation; if the y-coordinates changed sign, it is a reflection across the x-axis; if the x-coordinates changed sign, it is a reflection across the y-axis; if the copy is turned, use the rotation rules about the origin. Apply that motion vertex by vertex and check that every vertex lands.',
      ],
      vocabulary: [
        { term: 'dilation', definition: 'a transformation that multiplies every distance from a center point by the same scale factor; from the origin, (x, y) goes to (kx, ky).' },
        { term: 'scale factor', definition: 'the number k that every length is multiplied by in a dilation; k > 1 enlarges, 0 < k < 1 shrinks, and k = image ÷ original.' },
        { term: 'center of dilation', definition: 'the fixed point the resize happens from; in this lesson it is always the origin.' },
        { term: 'similar', definition: 'two figures are similar when a dilation followed by rigid motions maps one exactly onto the other: same shape, and the size may differ.' },
        { term: 'image', definition: 'the figure a transformation produces; its vertices are often marked with a prime, so the image of P is written P\'.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_equation', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-dilate-by-one-half',
      kind: 'worked_example',
      problem:
        'Triangle PQR has vertices P(4, 2), Q(8, 2) and R(8, 6). Dilate it from the origin by scale factor 1/2, and then compare the side lengths of the image with the sides of the original.',
      steps: [
        'Dilation from the origin: multiply both coordinates of every vertex by 1/2. Nothing gets added, and every vertex gets the same treatment.',
        'P(4, 2) → (4 × 1/2, 2 × 1/2) = (2, 1). Q(8, 2) → (8 × 1/2, 2 × 1/2) = (4, 1). R(8, 6) → (8 × 1/2, 6 × 1/2) = (4, 3). Call the image vertices P\', Q\' and R\'.',
        'Compare the sides. PQ runs from x = 4 to x = 8 at the same height, so PQ = 8 - 4 = 4; P\'Q\' runs from x = 2 to x = 4, so P\'Q\' = 4 - 2 = 2. QR runs up from y = 2 to y = 6, so QR = 6 - 2 = 4; Q\'R\' runs up from y = 1 to y = 3, so Q\'R\' = 3 - 1 = 2. Each image side is 2 ÷ 4 = 1/2 of the original side, which is exactly k.',
        'The shape survived. PQ is horizontal and QR is vertical, so the angle at Q is a right angle; P\'Q\' is horizontal and Q\'R\' is vertical, so the angle at Q\' is a right angle too. Same shape, half the size, so the image is similar to PQR and not congruent to it.',
        'Check by working backward: dilate the image by 2, the number that undoes multiplying by 1/2. (2, 1) → (4, 2), (4, 1) → (8, 2), (4, 3) → (8, 6), which are P, Q and R again. Notice also that P and P\' sit on the same line through the origin: in (4, 2) and in (2, 1), the y-coordinate is half the x-coordinate.',
      ],
      answer: 'Image vertices (2, 1), (4, 1), (4, 3); every side of the image is 1/2 of the matching side of PQR, and the angles are unchanged',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-k-and-describe-sequence',
      kind: 'worked_example',
      problem:
        'Triangle ABC has vertices A(1, 1), B(3, 1) and C(1, 4). Triangle DEF has vertices D(-3, 3), E(-9, 3) and F(-3, 12). Find the scale factor, describe a sequence of a dilation from the origin followed by a rigid motion that maps ABC onto DEF, and decide whether the two triangles are similar.',
      steps: [
        'Size first. Match a pair of sides you can measure by counting: AB runs along y = 1 from x = 1 to x = 3, so AB = 3 - 1 = 2. DE runs along y = 3 from x = -9 to x = -3, so DE = -3 - (-9) = 6. New over old: k = 6 ÷ 2 = 3.',
        'WRONG: k = 2 ÷ 6 = 1/3, dividing old by new. CORRECT: k = 6 ÷ 2 = 3, new over old. DEF is the bigger triangle, so k has to be bigger than 1, and a dilation by 1/3 would shrink ABC to a triangle whose bottom side is 2 × 1/3 = 2/3, nowhere near the size of DEF.',
        'Confirm k with a second pair of sides. AC runs up from y = 1 to y = 4, so AC = 4 - 1 = 3; DF runs up from y = 3 to y = 12, so DF = 12 - 3 = 9, and 9 ÷ 3 = 3. Same k, so one dilation fixes the size.',
        'Dilate ABC from the origin by 3: A(1, 1) → (3, 3), B(3, 1) → (9, 3), C(1, 4) → (3, 12). Call this middle triangle A\'B\'C\'. It is the right size now, but it sits to the right of the y-axis while DEF sits to the left, so a rigid motion still has to move it.',
        'WRONG: sliding A\'B\'C\' 6 units left, because that carries A\'(3, 3) onto D(-3, 3). CORRECT: a translation moves every vertex the same way, and 6 units left takes B\'(9, 3) to (3, 3), not to E(-9, 3), so the slide fails on the second vertex. Read the coordinates instead: D, E and F have the same y-coordinates as A\', B\' and C\' and x-coordinates of the opposite sign, and that is the reflection across the y-axis, (x, y) → (-x, y).',
        'Apply the reflection to every vertex: (3, 3) → (-3, 3) = D, (9, 3) → (-9, 3) = E, (3, 12) → (-3, 12) = F. Every vertex lands, so the sequence is a dilation from the origin by 3 followed by a reflection across the y-axis.',
        'Because a dilation followed by a rigid motion maps ABC exactly onto DEF, the triangles are similar. They are not congruent: no sequence of rigid motions alone can turn a side of length 2 into a side of length 6.',
      ],
      answer: 'k = 3; dilate from the origin by 3, then reflect across the y-axis. ABC and DEF are similar, and not congruent',
      estimatedMinutes: 3,
    },
    {
      id: 'try-dilate-a-vertex-by-one-quarter',
      kind: 'try_yourself',
      problem: 'A triangle has a vertex at (-8, 12). The triangle is dilated from the origin by scale factor 1/4. Where does that vertex land?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-2, 3)', correct: true },
        { id: 'b', text: '(-32, 48)' },
        { id: 'c', text: '(-2, 12)' },
        { id: 'd', text: '(2, 3)' },
      ],
      expectedAnswer: '(-2, 3)',
      hints: [
        'Multiply BOTH coordinates by k. Here k is less than 1, so the image should end up closer to the origin than (-8, 12), not farther away.',
        '-8 × 1/4 = -2 and 12 × 1/4 = 3. A negative coordinate stays negative, because the point stays in the same quadrant it started in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-sequence',
      kind: 'try_yourself',
      problem: 'Triangle 1 has vertices (2, 1), (4, 1) and (2, 5). Triangle 2 has vertices (4, -2), (8, -2) and (4, -10). Which sequence maps Triangle 1 exactly onto Triangle 2?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A dilation from the origin by 1/2, then a reflection across the x-axis' },
        { id: 'b', text: 'A dilation from the origin by 2, then a reflection across the y-axis' },
        { id: 'c', text: 'A dilation from the origin by 2, then a reflection across the x-axis', correct: true },
        { id: 'd', text: 'A reflection across the x-axis only, because the two triangles are congruent' },
      ],
      expectedAnswer: 'A dilation from the origin by 2, then a reflection across the x-axis',
      hints: [
        'Size first. The bottom side of Triangle 1 runs from x = 2 to x = 4, length 2; the bottom side of Triangle 2 runs from x = 4 to x = 8, length 4. Divide new over old to get k.',
        'After the dilation by that k, the vertices are (4, 2), (8, 2) and (4, 10). Compare them with Triangle 2: which coordinate changed sign? A flipped y-coordinate means a reflection across the x-axis.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-missing-coordinate',
      kind: 'try_yourself',
      problem: 'A dilation from the origin sends the point (8, 3) to the point (20, y). What is y? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7.5',
      hints: [
        'Find k from the coordinates you can see on both points: new over old, 20 ÷ 8.',
        'k = 2.5, and the y-coordinate gets multiplied by the same k: 3 × 2.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-instead-of-multiply-and-similar-vs-congruent',
      kind: 'misconception_check',
      question:
        'A square has vertices (1, 1), (3, 1), (3, 3) and (1, 3). It is dilated from the origin by scale factor 3, and the image has vertices (3, 3), (9, 3), (9, 9) and (3, 9). Student 1 says the image should have been (4, 4), (6, 4), (6, 6) and (4, 6), because dilating by 3 means adding 3 to each coordinate. Student 2 looks at the correct image and says the two squares are congruent, because they are both squares and have the same shape. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The image is (4, 4), (6, 4), (6, 6), (4, 6), because dilating by 3 means adding 3.',
          misconception: 'Treating the scale factor as an amount to add, which slides the figure without changing its size, when a dilation multiplies every coordinate by k.',
          correctsTo:
            'A scale factor multiplies; it never adds. Adding 3 to every coordinate slides the square 3 right and 3 up, and a slide is a translation, a rigid motion that never changes size: the side of that slid square is still 6 - 4 = 2. Multiply instead: (1, 1) → (3, 3), (3, 1) → (9, 3), (3, 3) → (9, 9), (1, 3) → (3, 9), and the side is now 9 - 3 = 6, which is 3 times the original side of 2, exactly what k = 3 promises.',
        },
        {
          answer: 'The two squares are congruent, because they have the same shape.',
          misconception: 'Using congruent to mean same shape, when congruent means a sequence of rigid motions alone maps one figure onto the other, so the size must match too.',
          correctsTo:
            'Rigid motions keep every length. The original square has sides of length 2 and the image has sides of length 6, so no slide, flip or turn can map one onto the other, and the squares are not congruent. They are similar: a dilation from the origin by 3 maps the first square exactly onto the second, and same shape with a different size is exactly what similar means. Congruent is the special case of similar where the scale factor is 1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A dilation from the origin by scale factor k sends (x, y) to (kx, ky). Multiply both coordinates by k; never add, and never divide by k.',
        'k > 1 enlarges and 0 < k < 1 shrinks. The image point sits on the same line through the origin as the original point, and in the same quadrant.',
        'Find k by dividing new over old: image length ÷ original length, or image coordinate ÷ original coordinate. Confirm with a second pair.',
        'A dilation keeps the shape but changes the size, so the image is similar to the original and not congruent to it, unless k = 1.',
        'Two figures are similar when a dilation followed by rigid motions maps one exactly onto the other. Congruent is the special case k = 1.',
        'To describe the sequence: size first, then position. Find k and dilate, then slide, flip or turn the dilated copy onto the target and check every vertex.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Dilations & Similarity' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
