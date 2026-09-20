/**
 * Grade 8 Math — Unit 8 CED 8.4: Dilations & Similarity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.dilations-and-similarity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U8_DILATIONS_AND_SIMILARITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.dilations-and-similarity.v1',
  course: 'Grade 8 Math',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Dilations & Similarity',
  planId: 'evelyn.ms.m8math.dilations-and-similarity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.dilations-and-similarity.v1' }],
  theory: [
    { loId: 'm8math.dilations-and-similarity', kind: 'framework', title: 'A dilation is a resize from a center', content: `A DILATION IS A RESIZE FROM A CENTER — a dilation from the origin by scale factor k sends every point (x, y) to (kx, ky). Both coordinates get multiplied by the same k, and nothing is added. With k = 3, the point (2, 1) lands on (6, 3): three times as far from the origin, on the very same line through the origin. The origin itself stays put, because 3 × 0 is still 0.` },
    { loId: 'm8math.dilations-and-similarity', content: `k ABOVE 1 ENLARGES, k BETWEEN 0 AND 1 SHRINKS — with k = 1/2, the point (6, 4) lands on (3, 2), half as far from the origin. A shrink is still a multiplication: you multiply by a number less than 1, you never subtract, and you never divide by k. In this lesson k is always positive, and a dilated point stays in the same quadrant as the point it came from, so a negative coordinate stays negative: (-6, 10) with k = 1/2 gives (-3, 5).` },
    { loId: 'm8math.dilations-and-similarity', content: `k IS THE SCALE FACTOR YOU ALREADY KNOW — in a scale drawing, k was a constant of proportionality, one multiplier for every length, and this is the same k. Every side of the image is k times the matching side of the original, so you find k by dividing new over old: image length ÷ original length, or image coordinate ÷ original coordinate. If a side of length 4 becomes a side of length 10, then k = 10 ÷ 4 = 2.5. Dividing the other way, 4 ÷ 10 = 0.4, is the most common slip, and the size check catches it: the image got bigger, so k has to be bigger than 1.` },
    { loId: 'm8math.dilations-and-similarity', kind: 'framework', title: 'Same shape, new size', content: `SAME SHAPE, NEW SIZE — a dilation is not a rigid motion, because lengths change, so the image is NOT congruent to the original. What a dilation keeps is the shape: every angle stays exactly the same size, and every side is multiplied by the same k, so a right triangle is still a right triangle and a square is still a square, only bigger or smaller.` },
    { loId: 'm8math.dilations-and-similarity', kind: 'framework', title: 'Similar means a dilation plus rigid motions', content: `SIMILAR MEANS A DILATION PLUS RIGID MOTIONS — two figures are similar when a dilation followed by a sequence of translations, reflections and rotations maps one exactly onto the other. The dilation fixes the size and the rigid motions fix the position. Congruent figures are the special case where the scale factor is 1 and only the rigid motions are needed, so every congruent pair is also similar, but a similar pair is usually not congruent.` },
    { loId: 'm8math.dilations-and-similarity', content: `DESCRIBING THE SEQUENCE: SIZE FIRST, THEN POSITION — to get from one figure to a similar one, divide a pair of matching sides, new over old, to find k, and dilate the first figure from the origin by that k. Then compare the dilated copy with the target figure: if every vertex moved the same distance in the same direction, the motion is a translation; if the y-coordinates changed sign, it is a reflection across the x-axis; if the x-coordinates changed sign, it is a reflection across the y-axis; if the copy is turned, use the rotation rules about the origin. Apply that motion vertex by vertex and check that every vertex lands.` },
    { loId: 'm8math.dilations-and-similarity', kind: 'definition', title: 'dilation', content: `a transformation that multiplies every distance from a center point by the same scale factor; from the origin, (x, y) goes to (kx, ky).` },
    { loId: 'm8math.dilations-and-similarity', kind: 'definition', title: 'scale factor', content: `the number k that every length is multiplied by in a dilation; k > 1 enlarges, 0 < k < 1 shrinks, and k = image ÷ original.` },
    { loId: 'm8math.dilations-and-similarity', kind: 'definition', title: 'center of dilation', content: 'the fixed point the resize happens from; in this lesson it is always the origin.' },
    { loId: 'm8math.dilations-and-similarity', kind: 'definition', title: 'similar', content: `two figures are similar when a dilation followed by rigid motions maps one exactly onto the other: same shape, and the size may differ.` },
    { loId: 'm8math.dilations-and-similarity', kind: 'definition', title: 'image', content: `the figure a transformation produces; its vertices are often marked with a prime, so the image of P is written P'.` },
  ],
  methods: [
    {
      title: 'Worked dilate by one half',
      steps: [
        `Dilation from the origin: multiply both coordinates of every vertex by 1/2. Nothing gets added, and every vertex gets the same treatment.`,
        `P(4, 2) → (4 × 1/2, 2 × 1/2) = (2, 1). Q(8, 2) → (8 × 1/2, 2 × 1/2) = (4, 1). R(8, 6) → (8 × 1/2, 6 × 1/2) = (4, 3). Call the image vertices P', Q' and R'.`,
        `Compare the sides. PQ runs from x = 4 to x = 8 at the same height, so PQ = 8 - 4 = 4; P'Q' runs from x = 2 to x = 4, so P'Q' = 4 - 2 = 2. QR runs up from y = 2 to y = 6, so QR = 6 - 2 = 4; Q'R' runs up from y = 1 to y = 3, so Q'R' = 3 - 1 = 2. Each image side is 2 ÷ 4 = 1/2 of the original side, which is exactly k.`,
        `The shape survived. PQ is horizontal and QR is vertical, so the angle at Q is a right angle; P'Q' is horizontal and Q'R' is vertical, so the angle at Q' is a right angle too. Same shape, half the size, so the image is similar to PQR and not congruent to it.`,
        `Check by working backward: dilate the image by 2, the number that undoes multiplying by 1/2. (2, 1) → (4, 2), (4, 1) → (8, 2), (4, 3) → (8, 6), which are P, Q and R again. Notice also that P and P' sit on the same line through the origin: in (4, 2) and in (2, 1), the y-coordinate is half the x-coordinate.`,
      ],
      example: { problem: `Triangle PQR has vertices P(4, 2), Q(8, 2) and R(8, 6). Dilate it from the origin by scale factor 1/2, and then compare the side lengths of the image with the sides of the original.`, solution: `Image vertices (2, 1), (4, 1), (4, 3); every side of the image is 1/2 of the matching side of PQR, and the angles are unchanged` },
      relatedLoIds: ['m8math.dilations-and-similarity'],
    },
    {
      title: 'Worked find k and describe sequence',
      steps: [
        `Size first. Match a pair of sides you can measure by counting: AB runs along y = 1 from x = 1 to x = 3, so AB = 3 - 1 = 2. DE runs along y = 3 from x = -9 to x = -3, so DE = -3 - (-9) = 6. New over old: k = 6 ÷ 2 = 3.`,
        `WRONG: k = 2 ÷ 6 = 1/3, dividing old by new. CORRECT: k = 6 ÷ 2 = 3, new over old. DEF is the bigger triangle, so k has to be bigger than 1, and a dilation by 1/3 would shrink ABC to a triangle whose bottom side is 2 × 1/3 = 2/3, nowhere near the size of DEF.`,
        `Confirm k with a second pair of sides. AC runs up from y = 1 to y = 4, so AC = 4 - 1 = 3; DF runs up from y = 3 to y = 12, so DF = 12 - 3 = 9, and 9 ÷ 3 = 3. Same k, so one dilation fixes the size.`,
        `Dilate ABC from the origin by 3: A(1, 1) → (3, 3), B(3, 1) → (9, 3), C(1, 4) → (3, 12). Call this middle triangle A'B'C'. It is the right size now, but it sits to the right of the y-axis while DEF sits to the left, so a rigid motion still has to move it.`,
        `WRONG: sliding A'B'C' 6 units left, because that carries A'(3, 3) onto D(-3, 3). CORRECT: a translation moves every vertex the same way, and 6 units left takes B'(9, 3) to (3, 3), not to E(-9, 3), so the slide fails on the second vertex. Read the coordinates instead: D, E and F have the same y-coordinates as A', B' and C' and x-coordinates of the opposite sign, and that is the reflection across the y-axis, (x, y) → (-x, y).`,
        `Apply the reflection to every vertex: (3, 3) → (-3, 3) = D, (9, 3) → (-9, 3) = E, (3, 12) → (-3, 12) = F. Every vertex lands, so the sequence is a dilation from the origin by 3 followed by a reflection across the y-axis.`,
        `Because a dilation followed by a rigid motion maps ABC exactly onto DEF, the triangles are similar. They are not congruent: no sequence of rigid motions alone can turn a side of length 2 into a side of length 6.`,
      ],
      example: { problem: `Triangle ABC has vertices A(1, 1), B(3, 1) and C(1, 4). Triangle DEF has vertices D(-3, 3), E(-9, 3) and F(-3, 12). Find the scale factor, describe a sequence of a dilation from the origin followed by a rigid motion that maps ABC onto DEF, and decide whether the two triangles are similar.`, solution: `k = 3; dilate from the origin by 3, then reflect across the y-axis. ABC and DEF are similar, and not congruent` },
      relatedLoIds: ['m8math.dilations-and-similarity'],
    },
  ],
  pointers: [
    { content: `Students often say "The image is (4, 4), (6, 4), (6, 6), (4, 6), because dilating by 3 means adding 3." — A scale factor multiplies; it never adds. Adding 3 to every coordinate slides the square 3 right and 3 up, and a slide is a translation, a rigid motion that never changes size: the side of that slid square is still 6 - 4 = 2. Multiply instead: (1, 1) → (3, 3), (3, 1) → (9, 3), (3, 3) → (9, 9), (1, 3) → (3, 9), and the side is now 9 - 3 = 6, which is 3 times the original side of 2, exactly what k = 3 promises.`, kind: 'common-error' },
    { content: `Students often say "The two squares are congruent, because they have the same shape." — Rigid motions keep every length. The original square has sides of length 2 and the image has sides of length 6, so no slide, flip or turn can map one onto the other, and the squares are not congruent. They are similar: a dilation from the origin by 3 maps the first square exactly onto the second, and same shape with a different size is exactly what similar means. Congruent is the special case of similar where the scale factor is 1.`, kind: 'common-error' },
    { content: `A dilation from the origin by scale factor k sends (x, y) to (kx, ky). Multiply both coordinates by k; never add, and never divide by k.`, kind: 'tip' },
    { content: `k > 1 enlarges and 0 < k < 1 shrinks. The image point sits on the same line through the origin as the original point, and in the same quadrant.`, kind: 'tip' },
    { content: `Find k by dividing new over old: image length ÷ original length, or image coordinate ÷ original coordinate. Confirm with a second pair.`, kind: 'tip' },
    { content: `A dilation keeps the shape but changes the size, so the image is similar to the original and not congruent to it, unless k = 1.`, kind: 'tip' },
    { content: `Two figures are similar when a dilation followed by rigid motions maps one exactly onto the other. Congruent is the special case k = 1.`, kind: 'tip' },
    { content: `To describe the sequence: size first, then position. Find k and dilate, then slide, flip or turn the dilated copy onto the target and check every vertex.`, kind: 'tip' },
    { content: `Dilation multiplies coordinates, never adds. (x, y) → (kx, ky) means multiply each coordinate by k. Don't add k to either coordinate—that's a translation, not a dilation.`, kind: 'common-error' },
    { content: `To find k, divide new over old: image length ÷ original length. Flipping it (old ÷ new) is the most common slip. Check your answer: if the image is bigger, k > 1; if smaller, 0 < k < 1.`, kind: 'gotcha' },
    { content: `Similar means dilation + rigid motions. Congruent means rigid motions alone (k = 1). Two figures with the same shape but different sizes are similar, not congruent.`, kind: 'vocab-note' },
    { content: `When you dilate by a fraction like k = 1/2, still multiply—don't divide by 2. (6, 4) × 1/2 = (3, 2). Multiplying by a number less than 1 shrinks the figure.`, kind: 'common-error' },
    { content: `A point and its image sit on the same line through the origin. If (4, 2) dilates to (2, 1), check: both lie on the line y = x/2. Use this to spot wrong answers.`, kind: 'tip' },
    { content: `Negative coordinates stay negative after dilation. (-6, 10) with k = 1/2 gives (-3, 5). The point stays in the same quadrant; you multiply, not flip signs.`, kind: 'edge-case' },
    { content: `Describe similarity in order: size first (find k and dilate), then position (translate, reflect, or rotate the dilated copy). Don't mix them up.`, kind: 'vocab-note' },
    { content: `When finding k with a fractional answer (like k = 2.5 or k = 7.5), write it as a decimal or simplified fraction. Both are correct; just be consistent and check against the size.`, kind: 'tip' },
  ],
};
