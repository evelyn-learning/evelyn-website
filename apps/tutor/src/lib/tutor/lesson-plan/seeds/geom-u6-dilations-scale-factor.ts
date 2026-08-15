/**
 * Geometry — Similarity: Dilations & Scale Factor.
 *
 * The one transformation that changes size (CCSS G-SRT.A.1, G-SRT.A.2):
 * every point slides along its ray from the center until its distance is
 * multiplied by k. Angles survive, lengths scale by k, areas scale by k² —
 * and the center is the piece students forget, so it gets its own example.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U6_DILATIONS_SCALE_FACTOR: LessonPlan = {
  id: 'evelyn.hs.geom.dilations-scale-factor.v1',
  title: 'Dilations & Scale Factor',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.dilations-scale-factor',
      standard: 'GEOM-6.1',
      description:
        'Perform a dilation given a center and a scale factor, find the scale factor relating two figures, and describe what a dilation preserves (angle measure, parallelism) versus what it scales (lengths by k, areas by k²) (CCSS G-SRT.A.1, G-SRT.A.2).',
    },
  ],
  prerequisites: ['geom.midsegments-bisectors-inequalities'],
  followUps: ['geom.similar-polygons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame dilation as the resize transformation behind blueprints, models, and maps — and as the doorway to the whole similarity unit.',
      script:
        'An architect draws a building at 1/100 of its real size, and every wall, window, and door shrinks by exactly the same factor — otherwise the drawing would be a funhouse mirror instead of a plan. That controlled resize is a DILATION. Translations, reflections, and rotations move a shape without changing it; the dilation is the one transformation that changes SIZE while protecting SHAPE. Get it right and the rest of this unit — similar polygons, similar triangles, proportions — is just bookkeeping on top of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dilations',
      kind: 'concept',
      goal: 'Center plus scale factor as the full definition, the coordinate rules, and what does and does not survive a dilation.',
      keyIdeas: [
        'TWO INGREDIENTS — a dilation needs a CENTER point C and a SCALE FACTOR k. Every point P moves along ray CP to the image point P\' with CP\' = k · CP. The center itself never moves; it is the only fixed point (unless k = 1).',
        'RULE AT THE ORIGIN — with center (0, 0): (x, y) → (kx, ky). Multiply both coordinates. Nothing is added.',
        'RULE AWAY FROM THE ORIGIN — with center (a, b): subtract, scale, add back. (x, y) → (a + k(x - a), b + k(y - b)). Measure the trip FROM the center, stretch that trip, then start again at the center.',
        'WHAT k TELLS YOU — k = image length / preimage length, always new over old. k > 1 enlarges, 0 < k < 1 reduces, k = 1 leaves the figure alone. Find k from any pair of corresponding sides, then confirm with a second pair.',
        'PRESERVED VS SCALED — angle measures are UNCHANGED (a 40° angle stays 40°, it does not become 40k°), parallel sides stay parallel, and betweenness/collinearity survive. Only distances change, each multiplied by k. Because size changes, a dilation is NOT a rigid motion: the image is SIMILAR to the preimage, not congruent.',
        'LINES AND THE CENTER — a line through the center of dilation maps onto ITSELF; a line that misses the center maps to a PARALLEL line. This is the fact that makes similar figures line up so neatly.',
        'PERIMETER SCALES BY k, AREA SCALES BY k² — perimeter is a length, so it multiplies by k; area is a length times a length, so it multiplies by k². A dilation by 3 makes a shape 3 times as tall and 9 times as roomy. (Volume, later, scales by k³.)',
        'THE THREE CLASSIC ERRORS — (1) ADDING instead of multiplying, which is a translation, not a dilation; (2) multiplying the coordinates directly when the center is NOT the origin; (3) flipping the ratio and reporting 1/k because you divided old by new.',
      ],
      vocabulary: [
        { term: 'center of dilation', definition: 'the fixed point every image point is measured from; distances from it are multiplied by the scale factor.' },
        { term: 'scale factor', definition: 'the constant k equal to image length divided by the matching preimage length.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-origin-dilation',
      kind: 'worked_example',
      problem:
        'Triangle PQR has vertices P(-4, 2), Q(6, 8), and R(2, -6). Dilate it about the origin with scale factor k = 1/2, and check the result on side PQ.',
      steps: [
        'Center is the origin, so the rule is (x, y) → (kx, ky) with k = 1/2 — halve both coordinates of each vertex.',
        'P(-4, 2) → P\'(-2, 1). Q(6, 8) → Q\'(3, 4). R(2, -6) → R\'(1, -3).',
        'Check with a length: PQ runs from (-4, 2) to (6, 8), a horizontal change of 10 and a vertical change of 6. P\'Q\' runs from (-2, 1) to (3, 4), a horizontal change of 5 and a vertical change of 3.',
        'Both changes were halved, so P\'Q\' = (1/2) · PQ, exactly as k demands. Since 0 < k < 1 this is a reduction, and △P\'Q\'R\' ~ △PQR with all three angle measures unchanged.',
      ],
      answer: 'P\'(-2, 1), Q\'(3, 4), R\'(1, -3) — a reduction similar to △PQR',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-center-not-origin',
      kind: 'worked_example',
      problem:
        'A dilation has center C(1, 2) and scale factor k = 3. A student maps point A(7, 4) to (21, 12). Find the correct image A\' and explain the error.',
      steps: [
        'Spot the error: the student used the origin rule (x, y) → (3x, 3y). That rule only works when the center IS the origin, and here the center is C(1, 2).',
        'Subtract the center to get the trip from C to A: (7 - 1, 4 - 2) = (6, 2).',
        'Scale that trip by k = 3: (18, 6). The image is three times as far from C, in the same direction.',
        'Add the center back: A\' = (1 + 18, 2 + 6) = (19, 8).',
        'Sanity check the fixed point: the correct rule leaves C itself in place — (1 + 3(1 - 1), 2 + 3(2 - 2)) = (1, 2). The student\'s rule would have moved C to (3, 6), so it could not have been a dilation centered at C.',
      ],
      answer: 'A\' = (19, 8); the student ignored the center and used the origin-only rule',
      estimatedMinutes: 3,
    },
    {
      id: 'try-scale-factor',
      kind: 'try_yourself',
      problem:
        'A dilation maps a segment of length 12 cm to an image segment of length 18 cm. What is the scale factor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1.5', correct: true },
        { id: 'b', text: '2/3' },
        { id: 'c', text: '6' },
        { id: 'd', text: '2.25' },
      ],
      expectedAnswer: '1.5',
      hints: [
        'The scale factor is a ratio, not a difference — and it is always image over preimage.',
        'Divide the new length by the old length: 18/12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-changes',
      kind: 'try_yourself',
      problem:
        'A quadrilateral is dilated with center C and scale factor k = 0.5. Which statement about the image is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every angle measure stays the same and every side length is half as long', correct: true },
        { id: 'b', text: 'Every angle measure is half as large and every side length is half as long' },
        { id: 'c', text: 'The image is congruent to the original because dilation preserves shape' },
        { id: 'd', text: 'Every side is half as long and the area is also half as large' },
      ],
      expectedAnswer: 'Every angle measure stays the same and every side length is half as long',
      hints: [
        'A dilation multiplies DISTANCES from the center — ask yourself whether a degree measure is a distance.',
        'Lengths scale by k and area scales by k², while angle measures never move; a smaller image cannot be congruent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A dilation with center C(2, 1) and scale factor 4 maps point A(5, 1) to A\'. Points A and C both lie on the horizontal line y = 1, so A\' lies on that line too. Type the x-coordinate of A\' as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '14',
      hints: [
        'First find how far A is from the center along the line: 5 - 2.',
        'Multiply that distance by 4, then add it back to the center\'s x-coordinate of 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-area-k-squared',
      kind: 'misconception_check',
      question:
        'A rectangular garden plot with an area of 20 m² is enlarged by a dilation with scale factor 3. A student says the new plot has an area of 60 m². What went wrong?',
      commonErrors: [
        {
          answer: '60 m²',
          misconception: 'Applying the scale factor to area the same way it applies to a single length.',
          correctsTo:
            'Area is a length times a length, so BOTH dimensions get multiplied by 3 — the area scales by k² = 9, giving 180 m². Perimeter is the one that scales by plain k. Quick check: a 4 by 5 plot dilates to 12 by 15, and 12 × 15 = 180.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A dilation is defined by a CENTER and a SCALE FACTOR k: CP\' = k · CP along ray CP, and the center never moves.',
        'Origin rule: (x, y) → (kx, ky). Any other center (a, b): subtract, scale, add back — (x, y) → (a + k(x - a), b + k(y - b)).',
        'k = image length / preimage length. k > 1 enlarges, 0 < k < 1 reduces.',
        'Angle measures and parallelism survive; lengths scale by k, perimeter by k, area by k². The image is similar, never congruent (unless k = 1).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Dilations & Scale Factor' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
