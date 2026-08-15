/**
 * G10 — Geometry: Angle relationships (parallel lines + transversal,
 * angle pair theorems).
 *
 * The vocabulary that lets you reason about angles in any figure:
 * complementary, supplementary, vertical, linear pair. The big tool:
 * a transversal cutting two parallel lines makes 8 angles whose
 * relationships are completely determined — corresponding equal,
 * alternate interior equal, same-side interior supplementary.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_GEOM_ANGLE_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.g10.math.geometry.angle-relationships.v1',
  title: 'Angle Relationships and Parallel Lines',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'angles',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.co.c.9',
      description: 'Prove theorems about lines and angles.',
      standard: 'CCSS.MATH.CONTENT.HSG.CO.C.9',
    },
  ],
  prerequisites: ['ccss.math.7.g.b.5'],
  followUps: ['ccss.math.hsg.co.c.10'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a parking-lot scenario — straight lanes crossed by a service road — to motivate the parallel-lines setup.',
      script: 'Picture two parallel parking lanes crossed by a single service road. The service road creates 8 angles where it meets the two parking lanes. Tell me ONE of those angles, and I can tell you all 7 others without looking. There\'s a bunch of named relationships hiding in those 8 angles, and they\'re the most useful theorems in geometry.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pairs',
      kind: 'concept',
      goal: 'Complementary, supplementary, vertical, linear pair — and the parallel-line theorems.',
      keyIdeas: [
        'COMPLEMENTARY angles: sum to 90°. (e.g. 30° + 60°.)',
        'SUPPLEMENTARY angles: sum to 180°. (e.g. 110° + 70°.)',
        'LINEAR PAIR: two angles that share a side and form a straight line — always supplementary (sum 180°).',
        'VERTICAL angles: opposite angles formed by two intersecting lines. Always EQUAL.',
        'A TRANSVERSAL is a line crossing two (or more) other lines.',
        'When the two lines are PARALLEL, the transversal creates 8 angles with these special equalities:',
        '  CORRESPONDING angles (same position at each crossing): EQUAL.',
        '  ALTERNATE INTERIOR angles (opposite sides of transversal, between the parallels): EQUAL.',
        '  ALTERNATE EXTERIOR angles (opposite sides, outside the parallels): EQUAL.',
        '  SAME-SIDE INTERIOR angles (same side, between the parallels): SUPPLEMENTARY (sum 180°).',
        'Once you know any one of the 8 angles in the parallel-lines setup, every other angle is either EQUAL to it or SUPPLEMENTARY to it.',
      ],
      vocabulary: [
        { term: 'transversal', definition: 'a line that crosses two or more other lines.' },
        { term: 'vertical angles', definition: 'opposite angles at an intersection — always equal.' },
        { term: 'corresponding angles', definition: 'angles in the same position at each parallel-line crossing — equal.' },
        { term: 'alternate interior angles', definition: 'between the parallel lines, on opposite sides of the transversal — equal.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-find-angle',
      kind: 'worked_example',
      problem: 'Two parallel lines cut by a transversal. One angle measures 65°. Find the angle that is corresponding to it, the alternate interior angle, and the same-side interior angle.',
      steps: [
        'Corresponding angle: same position at the other crossing. EQUAL. → 65°.',
        'Alternate interior angle: opposite side, between the parallels. EQUAL. → 65°.',
        'Same-side interior angle: SUPPLEMENTARY to the given angle. 180° − 65° = 115°.',
        'Sense-check: every angle in the figure is either 65° or 115°. There are exactly 4 of each.',
      ],
      answer: '65°, 65°, 115°',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-vertical',
      kind: 'worked_example',
      problem: 'Two lines intersect, forming four angles. One is 40°. Find the other three.',
      steps: [
        'Linear pair (next to the 40°): supplementary. 180° − 40° = 140°.',
        'Vertical to the 40°: EQUAL. → 40°.',
        'The fourth angle is vertical to the 140°. → 140°.',
        'Two angles of 40° and two of 140°. Total: 40 + 40 + 140 + 140 = 360°. ✓',
      ],
      answer: '40°, 140°, 140°',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two parallel lines are cut by a transversal. An alternate interior angle pair: one is x + 30, the other is 100. Find x.',
      expectedAnswer: '70',
      responseFormat: 'numeric',
      hints: [
        'Alternate interior angles are EQUAL.',
        'x + 30 = 100. Solve.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-non-parallel',
      kind: 'misconception_check',
      question: 'Two lines are crossed by a transversal but the lines are NOT parallel. Asha says corresponding angles are still equal. Right?',
      commonErrors: [
        {
          answer: 'yes, corresponding angles are always equal',
          misconception: 'Forgetting that the parallel-line theorems require the parallel-line condition.',
          correctsTo: 'Wrong. The corresponding-angles-equal rule REQUIRES the two lines to be parallel. If the lines aren\'t parallel, none of the parallel-line angle equalities apply. (Vertical angles ARE always equal — that one doesn\'t need parallel lines.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Complementary = 90°, Supplementary = 180°.',
        'Vertical angles always EQUAL.',
        'Linear pair always SUPPLEMENTARY.',
        'Parallel lines + transversal: corresponding & alternate interior & alternate exterior all EQUAL; same-side interior SUPPLEMENTARY.',
        'Parallel-line theorems FAIL if the lines aren\'t parallel.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In a triangle, the three angles sum to 180°. Use parallel-line reasoning to argue why.',
      hint: 'Draw a line through one vertex parallel to the opposite side. The three angles of the triangle become alternate-interior partners of three angles forming a straight line. 180° follows.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
