/**
 * Geometry — Quadrilaterals & Polygons: Polygon Interior & Exterior Angle Sums.
 *
 * Two formulas that unlock every polygon problem in the unit
 * (CCSS G-CO.C.11, G-SRT.B.5): interior angles sum to (n - 2) × 180°
 * because an n-gon triangulates into n - 2 triangles, while the exterior
 * angles always sum to 360° no matter how many sides there are. Equal
 * billing for the two errors that eat the most points — losing the -2,
 * and dividing by n on a polygon nobody said was regular.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U8_POLYGON_ANGLE_SUMS: LessonPlan = {
  id: 'evelyn.hs.geom.polygon-angle-sums.v1',
  title: 'Polygon Interior & Exterior Angle Sums',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.polygon-angle-sums',
      standard: 'GEOM-8.1',
      description:
        'Find and use the interior angle sum (n - 2) × 180° and the constant 360° exterior angle sum of a convex polygon, including the interior and exterior angle measures of a regular n-gon and working backward from an angle to the number of sides (CCSS G-CO.C.11, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.solving-right-triangles'],
  followUps: ['geom.parallelograms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame polygon angle sums as the rule that decides which shapes can tile a floor, close a dome, or fit together in a design.',
      script:
        'Look at a tiled floor: squares fit together perfectly, regular hexagons fit together perfectly, regular pentagons never do. That is not a matter of taste — it is arithmetic. Every regular polygon has a fixed corner angle, and unless copies of that angle add up to exactly 360° around a point, you get a gap. Today you get the two formulas that produce those corner angles for any polygon: one for the interior angles, one for the exterior angles. They power everything else in this unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-sums',
      kind: 'concept',
      goal: 'Triangulation as the source of the interior sum, the constant exterior sum, the regular-polygon per-angle formulas, and the two classic errors.',
      keyIdeas: [
        'TRIANGULATE TO DERIVE — pick one vertex of a convex n-gon and draw every diagonal from it. The polygon splits into exactly n - 2 triangles, each contributing 180°. So the interior angle sum is (n - 2) × 180°. A quadrilateral gives 2 triangles → 360°; a pentagon gives 3 → 540°; a hexagon gives 4 → 720°.',
        'CLASSIC ERROR 1: LOSING THE -2 — writing n × 180° instead of (n - 2) × 180°. Sanity check every answer against a shape you know: if your formula says a quadrilateral totals 720°, it is wrong, because two triangles taped together clearly total 360°.',
        'ONE ANGLE OF A REGULAR n-GON — regular means all sides equal AND all angles equal, so each interior angle = (n - 2) × 180° / n. Regular octagon: (6 × 180°) / 8 = 1080° / 8 = 135°.',
        'CLASSIC ERROR 2: DIVIDING WHEN IT IS NOT REGULAR — the SUM formula works for every convex polygon, but dividing that sum by n only gives one angle when the polygon is regular. On an irregular polygon the sum is still (n - 2) × 180°, and you find a missing angle by subtracting the known ones.',
        'EXTERIOR ANGLES ALWAYS SUM TO 360° — extend each side in the same rotational direction and take one exterior angle per vertex. Walk the whole boundary and you turn through the exterior angles until you face your original direction: one full turn, 360°, no matter whether the polygon has 5 sides or 500.',
        'ONE EXTERIOR ANGLE OF A REGULAR n-GON — 360° / n. Regular octagon: 360° / 8 = 45°.',
        'THE SUPPLEMENT LINK — at any vertex the interior angle and its exterior angle form a straight line, so they sum to 180°. That link is the fastest bridge between the two formulas: interior 135° ↔ exterior 45°.',
        'WORKING BACKWARD TO n — given an angle, go through the EXTERIOR angle. If each interior angle is 150°, the exterior is 180° - 150° = 30°, so n = 360° / 30° = 12. Solving (n - 2) × 180° / n = 150 gives the same 12, just with more algebra.',
      ],
      vocabulary: [
        {
          term: 'regular polygon',
          definition: 'a polygon whose sides are all congruent and whose angles are all congruent — both conditions, not just one.',
        },
        {
          term: 'exterior angle of a polygon',
          definition: 'the angle between one side and the extension of an adjacent side; it is supplementary to the interior angle at that vertex.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-regular-octagon',
      kind: 'worked_example',
      problem:
        'A stop sign is a regular octagon. Find (a) the sum of its interior angles, (b) the measure of each interior angle, and (c) the measure of each exterior angle.',
      steps: [
        'Count the sides: an octagon has n = 8.',
        'Interior sum = (n - 2) × 180° = (8 - 2) × 180° = 6 × 180° = 1080°.',
        'The sign is REGULAR, so all 8 interior angles are equal: each = 1080° / 8 = 135°.',
        'Each exterior angle is the supplement of its interior angle: 180° - 135° = 45°. (Shortcut: 360° / 8 = 45°.)',
        'Check: 8 exterior angles × 45° = 360°. ✓ The exterior angles of any convex polygon must total 360°.',
      ],
      answer: 'Interior sum = 1080°; each interior angle = 135°; each exterior angle = 45°.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-backward-to-n',
      kind: 'worked_example',
      problem:
        'Each interior angle of a regular polygon measures 150°. A classmate writes (n - 2) × 180° = 150 and gets a fraction for n. Find the number of sides and explain the error.',
      steps: [
        'Name the error: (n - 2) × 180° is the SUM of all the interior angles, not one of them. Setting the whole sum equal to a single 150° angle can only produce nonsense.',
        'Fast route — use the exterior angle. Interior and exterior are supplementary at each vertex: exterior = 180° - 150° = 30°.',
        'The exterior angles total 360° and the polygon is regular, so all n of them are equal: n = 360° / 30° = 12. The polygon is a regular 12-gon (dodecagon).',
        'Confirm with the interior formula written correctly, one angle at a time: (n - 2) × 180° / n = 150 → 180n - 360 = 150n → 30n = 360 → n = 12. ✓ Same answer, more algebra.',
      ],
      answer: '12 sides — the classmate set the interior SUM equal to a single interior angle instead of dividing the sum by n.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-interior-sum-12gon',
      kind: 'try_yourself',
      problem: 'What is the sum of the interior angles of a convex polygon with 12 sides?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1800°', correct: true },
        { id: 'b', text: '2160°' },
        { id: 'c', text: '1620°' },
        { id: 'd', text: '360°' },
      ],
      expectedAnswer: '1800°',
      hints: [
        'Use the interior angle sum formula (n - 2) × 180° with n = 12 — do not skip the subtraction.',
        '(12 - 2) × 180° = 10 × 180°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exterior-sum-20gon',
      kind: 'try_yourself',
      problem:
        'A convex polygon has 20 sides. Taking one exterior angle at each vertex, what is the SUM of its exterior angles?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3240°' },
        { id: 'b', text: '360°', correct: true },
        { id: 'c', text: '18°' },
        { id: 'd', text: '7200°' },
      ],
      expectedAnswer: '360°',
      hints: [
        'The question asks for the exterior sum, not the interior sum — does the number of sides even enter this one?',
        'Walking once around any convex polygon turns you through exactly one full rotation, so the exterior angles always total 360° regardless of n.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A convex pentagon has four interior angles measuring 100°, 118°, 95°, and 130°. Find the measure of the fifth interior angle. Type your answer as a number of degrees.',
      responseFormat: 'numeric',
      expectedAnswer: '97',
      hints: [
        'First find the total: for a pentagon, (5 - 2) × 180° = 540°.',
        'Add the four known angles (100 + 118 + 95 + 130 = 443) and subtract from 540.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divide-nonregular',
      kind: 'misconception_check',
      question:
        'A student correctly finds that the interior angles of a convex hexagon sum to 720°, then concludes that each of its six angles measures 120°. The hexagon was never described as regular. What went wrong?',
      commonErrors: [
        {
          answer: 'Every angle of the hexagon is 120°',
          misconception:
            'Treating the per-angle formula (n - 2) × 180° / n as if it applied to all polygons, instead of only to regular ones.',
          correctsTo:
            'The SUM of 720° is true for every convex hexagon, but dividing by 6 assumes all six angles are equal — that is the definition of regular. An irregular hexagon could have angles of 90°, 100°, 110°, 130°, 140°, and 150°, which still total 720°. Without the word "regular" (or given congruent angle marks), find a missing angle by subtracting the known angles from 720°.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Interior angle sum of a convex n-gon = (n - 2) × 180° — the -2 comes from triangulating into n - 2 triangles.',
        'Exterior angles (one per vertex) always sum to 360°, for every convex polygon, no matter how many sides.',
        'REGULAR only: each interior angle = (n - 2) × 180° / n, and each exterior angle = 360° / n.',
        'Interior and exterior angles at a vertex are supplementary (180°) — use that link to work backward from any angle to n via 360° / exterior.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Polygon Interior & Exterior Angle Sums' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
