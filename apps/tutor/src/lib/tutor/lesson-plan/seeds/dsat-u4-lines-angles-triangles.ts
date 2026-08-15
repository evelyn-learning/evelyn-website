/**
 * Digital SAT — Math / Geometry & Trigonometry: Lines, Angles & Triangles.
 *
 * The most-tested pattern inside the Geometry and Trigonometry domain.
 * Every question describes a figure in words (parallel lines cut by a
 * transversal, a triangle with a parallel segment inside it) rather than
 * showing an image — the skill is translating the verbal description into
 * angle-pair or similar-triangle relationships. Desmos is allowed on every
 * math question but rarely helps here; the traps are conceptual, not
 * computational.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U4_LINES_ANGLES_TRIANGLES: LessonPlan = {
  id: 'evelyn.testprep.dsat.lines-angles-triangles.v1',
  title: 'Lines, Angles & Triangles',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.lines-angles-triangles',
      standard: 'DSAT-4.2',
      description:
        'Apply angle relationships formed by parallel lines and a transversal, and triangle angle-sum, exterior-angle, and similarity relationships, to solve for unknown angles and side lengths described verbally.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Lines, Angles & Triangles as the single most common pattern inside the Geometry and Trigonometry domain, and flag that the SAT describes figures in words.',
      script:
        'Geometry and Trigonometry is about 15 percent of SAT Math — roughly 5 to 7 questions — and Lines, Angles, and Triangles is the most common pattern inside that domain. There is usually no picture to stare at: the question describes a figure in words, and you have to build the relationships in your head. Master the parallel-line angle rules and triangle similarity, and a paragraph of labeled points turns into a one-line equation.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-lines-triangles',
      kind: 'concept',
      goal: 'Angle-pair rules for a transversal crossing two lines, the triangle angle-sum and exterior-angle theorems, and similar-triangle proportions — plus the named traps.',
      keyIdeas: [
        'TRIANGLE ANGLE SUM — the three interior angles of any triangle sum to 180°. EXTERIOR ANGLE THEOREM — an exterior angle of a triangle equals the SUM of the two remote (non-adjacent) interior angles. Both are faster than solving for the third angle first.',
        'VERTICAL ANGLES (opposite angles at a crossing) are always EQUAL. A LINEAR PAIR (two angles that share a side and form a straight line) is always SUPPLEMENTARY (sums to 180°). Neither of these needs the lines to be parallel.',
        'PARALLEL LINES + TRANSVERSAL — when two lines are explicitly parallel, a transversal crossing both creates 8 angles with fixed relationships: CORRESPONDING angles equal, ALTERNATE INTERIOR angles equal, ALTERNATE EXTERIOR angles equal, SAME-SIDE (co-interior) angles supplementary.',
        'TRAP — ASSUMING PARALLEL WITHOUT BEING TOLD. The corresponding/alternate/same-side rules ONLY apply when the problem states the lines are parallel (or gives you information that forces it). A figure described as "two lines crossed by a transversal" with no parallel statement gives you ONLY the vertical-angle and linear-pair facts — nothing more.',
        'SIMILAR TRIANGLES — the AA criterion is enough: if two angles of one triangle equal two angles of another, the triangles are similar and ALL corresponding sides are proportional. A line drawn parallel to one side of a triangle, cutting the other two sides, always creates a smaller triangle similar to the original (shared angle + corresponding angles from the parallel line).',
        'TRAP — MISMATCHED CORRESPONDENCE. When writing a similar-triangle proportion, match vertices in the SAME relative order on both sides (e.g., use the FULL side of the big triangle against the FULL side of the small triangle — not a partial segment against the full side). Get the correspondence from which angles are equal, not from which sides "look like" they line up.',
        'TRAP — EXTERIOR ANGLE MISCOUNT. The exterior angle theorem uses the two interior angles NOT adjacent to it. Adding the wrong pair (including the adjacent interior angle, which is actually supplementary to the exterior angle) is the most common slip.',
        'READING THE DESCRIPTION — since there is no image, restate the figure to yourself in one sentence before solving: which lines are parallel (if any), which angle or side is given, and which is asked for. That sentence IS the setup.',
      ],
      vocabulary: [
        { term: 'transversal', definition: 'a line that crosses two or more other lines, creating angle pairs at each crossing.' },
        { term: 'corresponding angles', definition: 'angles in the same relative position at each crossing of a transversal with two lines — equal when the lines are parallel.' },
        { term: 'alternate interior angles', definition: 'angles between two lines, on opposite sides of the transversal — equal when the lines are parallel.' },
        { term: 'similar triangles', definition: 'triangles with equal corresponding angles and proportional corresponding sides (AA is enough to establish it).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-parallel-transversal',
      kind: 'worked_example',
      problem:
        'Lines p and q are parallel and are cut by a transversal. At the point where the transversal crosses line p, one of the angles formed measures 112°. At the point where it crosses line q, the angle in the corresponding position measures (3x + 7)°. What is the value of x?',
      steps: [
        'The lines are explicitly parallel, so corresponding angles are equal: 3x + 7 = 112.',
        'Subtract 7: 3x = 105.',
        'Divide by 3: x = 35.',
        'Sense-check: 3(35) + 7 = 112. ✓ Matches the given angle, as corresponding angles must.',
      ],
      answer: 'x = 35',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-similar-triangle-trap',
      kind: 'worked_example',
      problem:
        'In triangle ABC, point D lies on side AB and point E lies on side AC, with segment DE parallel to side BC. AD = 4, DB = 6, and DE = 10. What is the length of BC?',
      steps: [
        'DE is parallel to BC, and angle A is shared by both triangles, so triangle ADE is similar to triangle ABC by AA.',
        'TRAP: DB = 6 is only the segment from D to B, not the full side AB. Using AD/DB = DE/BC would be the mismatched-correspondence trap — DB is not the side that corresponds to BC.',
        'The correct correspondence uses the FULL sides: A↔A, D↔B, E↔C, so the proportion is AD/AB = DE/BC. First find AB: AB = AD + DB = 4 + 6 = 10.',
        'Set up the proportion: 4/10 = 10/BC.',
        'Cross-multiply: 4 · BC = 100, so BC = 25.',
      ],
      answer: 'BC = 25',
      estimatedMinutes: 4,
    },
    {
      id: 'try-exterior-angle',
      kind: 'try_yourself',
      problem:
        'In triangle XYZ, the interior angles at vertex X and vertex Y measure 52° and 65°. Side XZ is extended beyond Z to form an exterior angle at vertex Z. What is the measure of that exterior angle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '63°' },
        { id: 'b', text: '107°' },
        { id: 'c', text: '117°', correct: true },
        { id: 'd', text: '128°' },
      ],
      expectedAnswer: '117°',
      hints: [
        'The exterior angle at Z equals the sum of the two angles NOT adjacent to it — the ones at X and Y.',
        '52 + 65 = 117.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-side-interior',
      kind: 'try_yourself',
      problem:
        'Lines m and n are parallel and are cut by a transversal. One interior angle on a given side of the transversal measures (2x + 10)°. The interior angle on the SAME side of the transversal, at the other crossing, measures (3x − 30)°. What is the value of x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '34' },
        { id: 'b', text: '38' },
        { id: 'c', text: '40', correct: true },
        { id: 'd', text: '44' },
      ],
      expectedAnswer: '40',
      hints: [
        'Same-side (co-interior) angles are SUPPLEMENTARY when the lines are parallel — they sum to 180°.',
        '(2x + 10) + (3x − 30) = 180 → 5x − 20 = 180 → 5x = 200.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-similar-side',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): Triangle PQR is similar to triangle STU, with P corresponding to S, Q corresponding to T, and R corresponding to U. PQ = 8, QR = 14, and ST = 12. What is the length of TU?',
      responseFormat: 'numeric',
      expectedAnswer: '21',
      hints: [
        'The scale factor from triangle PQR to triangle STU is ST/PQ = 12/8 = 1.5.',
        'Apply that same scale factor to the corresponding side: TU = QR × 1.5 = 14 × 1.5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-assumed-parallel',
      kind: 'misconception_check',
      question:
        'A problem describes two straight lines crossed by a transversal, with one marked angle of 70° and another angle, in the alternate-interior position, described as "appearing equal." The problem never states the two lines are parallel. A student sets the second angle to 70° anyway. What went wrong?',
      commonErrors: [
        {
          answer: '70° — alternate interior angles are always equal',
          misconception: 'Applying the parallel-line angle rules (corresponding, alternate interior, alternate exterior, same-side) without the lines actually being stated or given as parallel.',
          correctsTo: 'Alternate interior angles are equal ONLY when the two lines are parallel. Without that statement (or information that forces it, like both lines being perpendicular to a third line), all you can use are the rules that never need parallel lines: vertical angles are equal, and a linear pair is supplementary. The angle cannot be determined from the given information alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Triangle interior angles sum to 180°; an exterior angle equals the sum of the two remote (non-adjacent) interior angles.',
        'Vertical angles are always equal and a linear pair is always supplementary — no parallel lines required. Corresponding, alternate interior/exterior equal, and same-side supplementary ONLY apply when the lines are stated (or provably) parallel.',
        'Similar triangles (AA is enough) have proportional corresponding sides — match vertices by equal angles, and use FULL sides, not partial segments, in the proportion.',
        'Since figures are described in words, restate the setup in one sentence before solving: what is parallel, what is given, what is asked.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Lines, Angles & Triangles' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
