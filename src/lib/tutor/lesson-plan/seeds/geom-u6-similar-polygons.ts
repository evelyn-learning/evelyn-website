/**
 * Geometry — Similarity: Similar Polygons.
 *
 * The definition that powers every scale drawing (CCSS G-SRT.A.2,
 * G-SRT.B.5): similar means BOTH corresponding angles congruent AND
 * corresponding sides proportional. Equal billing for the half-checks —
 * the square-vs-rectangle trap — and for the k versus k² split that
 * separates perimeter scaling from area scaling.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U6_SIMILAR_POLYGONS: LessonPlan = {
  id: 'evelyn.hs.geom.similar-polygons.v1',
  title: 'Similar Polygons',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.similar-polygons',
      standard: 'GEOM-6.2',
      description:
        'Decide whether two polygons are similar by checking that all corresponding angles are congruent and all corresponding sides are proportional, use the scale factor to find unknown side lengths, and apply the k ratio for perimeter and the k² ratio for area (CCSS G-SRT.A.2, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.dilations-scale-factor'],
  followUps: ['geom.triangle-similarity-criteria'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame similarity as the guarantee that makes scale drawings, models, and enlargements trustworthy.',
      script:
        'An architect draws a floor plan at 1 inch to 4 feet. A model-car builder shrinks a real chassis to fit in your hand. Both are betting on one promise: the shape survives the resize. Every angle stays exactly what it was, and every length shrinks by the SAME factor — otherwise the plan lies and the model looks warped. Today you learn the two conditions that make that promise true, and the two ways students accidentally check only half of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-similar-polygons',
      kind: 'concept',
      goal: 'The two-part definition, the scale factor, why one condition alone fails, and how perimeter and area scale.',
      keyIdeas: [
        'THE TWO-PART DEFINITION — polygon ABCD ~ polygon EFGH means BOTH conditions hold: every pair of corresponding ANGLES is congruent (∠A ≅ ∠E, ∠B ≅ ∠F, …) AND every pair of corresponding SIDES is proportional (AB/EF = BC/FG = CD/GH = DA/HE). One condition alone is not similarity.',
        'LETTER ORDER CARRIES THE MATCHING — in ABCD ~ EFGH the pairing is A↔E, B↔F, C↔G, D↔H, so side AB pairs with EF and side BC with FG. Pair sides by position in the statement, never by "both look like the long one."',
        'SCALE FACTOR k — the common ratio of corresponding sides. Going from ABCD to EFGH, k = EF/AB, and EVERY length in EFGH is k times its partner in ABCD. k > 1 enlarges, 0 < k < 1 shrinks, k = 1 is congruence — congruent polygons are the special case of similar.',
        'ANGLES ALONE FAIL — a 4-by-6 rectangle and a 6-by-8 rectangle both have four 90° angles, yet 4/6 ≠ 6/8. Equal angles fix the corner shape but let one direction stretch more than the other. (Triangles are the one exception, and that is Topic 6.3.)',
        'SIDES ALONE FAIL — a square and a non-square rhombus with the same side length have all four sides in a 1:1 ratio, but the rhombus leans. Proportional sides without matching angles is a squashed copy, not a similar one.',
        'SOLVING FOR A MISSING SIDE — write one proportion pairing a KNOWN pair with the unknown pair, e.g. AB/EF = BC/FG, then cross-multiply. Sense-check with the scale factor: does the answer land on the bigger side of the ratio when k > 1?',
        'PERIMETER SCALES BY k, AREA SCALES BY k² — perimeter is a sum of lengths, so it scales like a length. Area is a product of two lengths, so it picks up the factor twice. Double every side and the perimeter doubles but the area quadruples.',
      ],
      vocabulary: [
        { term: 'similar polygons', definition: 'polygons whose corresponding angles are all congruent and whose corresponding sides are all proportional; written with the ~ symbol.' },
        { term: 'scale factor', definition: 'the constant ratio k between corresponding side lengths of two similar figures.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-find-missing-side',
      kind: 'worked_example',
      problem:
        'Quadrilateral ABCD ~ quadrilateral EFGH. In ABCD, AB = 6, BC = 10, CD = 14, and DA = 8. In EFGH, EF = 9. Find the scale factor from ABCD to EFGH, the length of FG, and the measure of ∠F given that ∠B = 115°.',
      steps: [
        'Read the letter order: A↔E, B↔F, C↔G, D↔H. So AB pairs with EF, and BC pairs with FG.',
        'Find the scale factor from the one complete pair: k = EF/AB = 9/6 = 1.5. Every length in EFGH is 1.5 times its partner in ABCD.',
        'Find FG by proportion: AB/EF = BC/FG, so 6/9 = 10/FG. Cross-multiply: 6 · FG = 90, so FG = 15.',
        'Sense-check with k: 10 × 1.5 = 15. ✓ And since k > 1, EFGH should be the larger polygon — 15 > 10 confirms it.',
        'Angles do NOT scale — similarity leaves them alone. ∠F ≅ ∠B, so ∠F = 115°.',
      ],
      answer: 'k = 1.5, FG = 15, ∠F = 115°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-angles-not-enough',
      kind: 'worked_example',
      problem:
        'Rectangle JKLM has JK = 4 and KL = 6. Rectangle PQRS has PQ = 6 and QR = 8, with J↔P, K↔Q, L↔R, M↔S. A classmate says: "Both are rectangles, so all four pairs of corresponding angles are 90° and congruent — the rectangles must be similar." Is that right?',
      steps: [
        'Check the angle condition first: every angle of every rectangle is 90°, so all four corresponding pairs are congruent. That half of the definition passes.',
        'Check the side condition using the letter order: JK pairs with PQ, and KL pairs with QR.',
        'Compute both ratios: JK/PQ = 4/6 = 2/3 ≈ 0.67, and KL/QR = 6/8 = 3/4 = 0.75.',
        '2/3 ≠ 3/4, so the corresponding sides are NOT proportional — the second rectangle was stretched more in one direction than the other.',
        'Similarity requires BOTH conditions, so these rectangles are not similar. To be similar with k = 6/4 = 1.5, PQRS would need sides 6 and 9; the 8 is too short.',
      ],
      answer: 'Not similar — the angles all match, but 4/6 ≠ 6/8, so the sides are not proportional.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-condition',
      kind: 'try_yourself',
      problem: 'Which statement is enough, by itself, to guarantee that two quadrilaterals are similar?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All four pairs of corresponding angles are congruent' },
        { id: 'b', text: 'All four pairs of corresponding sides are proportional' },
        { id: 'c', text: 'Both the angle condition and the side condition hold', correct: true },
        { id: 'd', text: 'The two quadrilaterals have the same perimeter' },
      ],
      expectedAnswer: 'Both the angle condition and the side condition hold',
      hints: [
        'Test each single condition against a counterexample: a 4-by-6 rectangle versus a 6-by-8 rectangle, and a square versus a leaning rhombus.',
        'Each single condition has a counterexample, so similarity needs the angle condition AND the side condition together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-area-ratio',
      kind: 'try_yourself',
      problem:
        'Two similar pentagons have a scale factor of 3 from the smaller to the larger. The smaller pentagon has an area of 20 cm². What is the area of the larger pentagon?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '180 cm²', correct: true },
        { id: 'b', text: '60 cm²' },
        { id: 'c', text: '23 cm²' },
        { id: 'd', text: '540 cm²' },
      ],
      expectedAnswer: '180 cm²',
      hints: [
        'Lengths scale by k, but area is a product of two lengths — what does that do to the factor?',
        'Area scales by k² = 3² = 9, so multiply 20 by 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Quadrilateral ABCD ~ quadrilateral WXYZ, with A↔W, B↔X, C↔Y, D↔Z. AB = 8, WX = 12, and BC = 10. Find XY and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Pair sides by letter order: AB with WX, and BC with XY. Write AB/WX = BC/XY.',
        'The scale factor is 12/8 = 1.5, so XY = 10 × 1.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-area-scales-by-k',
      kind: 'misconception_check',
      question:
        'Two similar hexagons have a scale factor of 4 from the smaller to the larger. The smaller has an area of 5 m². A student answers that the larger has an area of 20 m². What went wrong?',
      commonErrors: [
        {
          answer: '20 m²',
          misconception: 'Scaling area by the scale factor k, the same way lengths and perimeter scale.',
          correctsTo:
            'Every length multiplies by 4, and area is built from two lengths, so area multiplies by 4² = 16: the larger hexagon has area 5 × 16 = 80 m². Perimeter is the measurement that scales by plain k.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Similar polygons need BOTH: corresponding angles congruent AND corresponding sides proportional.',
        'Letter order in ABCD ~ EFGH tells you which sides and angles correspond — pair by position, not by appearance.',
        'The scale factor k multiplies every length; angles never change, and k = 1 is congruence.',
        'Perimeter scales by k, area scales by k² — the most common similarity slip is using k for area.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Similar Polygons' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
