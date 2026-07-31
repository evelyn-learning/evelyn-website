/**
 * Geometry — Parallel & Perpendicular Lines: Parallel Lines & Transversals.
 *
 * The engine room of the course (CCSS G-CO.C.9): one transversal, two
 * parallel lines, eight angles — and every one of them is either equal to
 * a given angle or supplementary to it. Equal billing for the two errors
 * that eat the most points: setting same-side interior angles EQUAL, and
 * using the parallel-only theorems when nobody said the lines are parallel.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U3_PARALLEL_LINES_TRANSVERSALS: LessonPlan = {
  id: 'evelyn.hs.geom.parallel-lines-transversals.v1',
  title: 'Parallel Lines & Transversals',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.parallel-lines-transversals',
      standard: 'GEOM-3.1',
      description:
        'Identify the angle pairs formed when a transversal crosses two lines and use the parallel-line angle theorems — corresponding, alternate interior, and alternate exterior angles congruent, same-side interior angles supplementary — to find unknown angle measures and justify each step (CCSS G-CO.C.9).',
    },
  ],
  prerequisites: ['geom.two-column-proofs'],
  followUps: ['geom.proving-lines-parallel'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the eight-angle picture as a one-measurement guarantee that builders, road engineers, and the rest of this course all lean on.',
      script:
        'A roof frame has parallel rafters, and a diagonal brace cuts across two of them. Where that brace crosses, eight angles appear. Here is the deal: measure ONE of them and I can tell you the other seven without touching a protractor — every angle in that picture is either equal to yours or supplementary to it. That is why a carpenter cuts one bevel angle and reuses it down the whole roof, and why road crews can lay a diagonal off-ramp across parallel lanes at a single specified angle. Today you learn the four angle pairs that make it work — and the two places students hand back points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-pairs',
      kind: 'concept',
      goal: 'The eight-angle setup, the four named pairs, what parallel actually unlocks, and the two classic errors.',
      keyIdeas: [
        'THE SETUP — a TRANSVERSAL is a line that crosses two other lines. It makes four angles at each crossing, eight in all. The four angles sitting BETWEEN the two lines are INTERIOR; the four outside are EXTERIOR.',
        'NAME PAIRS BY POSITION — CORRESPONDING angles sit in the same position at each crossing (both upper-left, say), one interior and one exterior. ALTERNATE INTERIOR: both interior, opposite sides of the transversal. ALTERNATE EXTERIOR: both exterior, opposite sides. SAME-SIDE INTERIOR (also called co-interior): both interior, SAME side of the transversal.',
        'WHAT PARALLEL UNLOCKS — when the two lines are parallel, corresponding angles are congruent (this is the postulate everything else is built on), and so alternate interior angles are congruent, alternate exterior angles are congruent, and same-side interior angles are SUPPLEMENTARY — they sum to 180°, they are NOT equal.',
        'ONLY TWO SIZES IN THE PICTURE — with parallel lines, all eight angles collapse into one acute measure and one obtuse measure, four of each, and the two sum to 180°. (If the transversal is ⊥ to the parallels, all eight are 90°.) After solving, sense-check that every answer is one of your two numbers.',
        'ALWAYS-TRUE VS PARALLEL-ONLY — VERTICAL angles congruent and LINEAR PAIR supplementary need NO parallel lines; they hold at any crossing. The four pair theorems above need the lines to be parallel. ERROR 1: applying corresponding/alternate/same-side rules to two lines nobody said were parallel — those angles are then completely unrelated.',
        'ERROR 2: SETTING SAME-SIDE INTERIOR ANGLES EQUAL — the reflex is "parallel means equal", so students write (2x + 5) = (3x − 10) for a co-interior pair. Same side of the transversal means SUPPLEMENTARY: the two expressions must be ADDED and set to 180.',
        'CHAINING WITH REASONS — most problems need two moves, not one: hop across the transversal with a pair theorem, then hop around a crossing with vertical angles or a linear pair. Name the reason at each hop ("corresponding angles, m ∥ n", "linear pair") — that is exactly the two-column habit from the last lesson, and it is what makes long angle chases stay honest.',
      ],
      vocabulary: [
        { term: 'transversal', definition: 'a line that crosses two or more other lines, forming four angles at each crossing.' },
        {
          term: 'same-side interior angles',
          definition: 'two angles between the lines and on the same side of the transversal — supplementary when the lines are parallel.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fill-the-picture',
      kind: 'worked_example',
      problem:
        'Lines r and s are parallel and are cut by transversal t. One of the interior angles at the crossing with r measures 118°. Find (a) its alternate interior angle at the crossing with s, (b) the same-side interior angle at the crossing with s, and (c) its corresponding angle at the crossing with s.',
      steps: [
        'Alternate interior: both angles are interior and on opposite sides of t. With r ∥ s these are congruent → 118°.',
        'Same-side interior: both interior, same side of t. With r ∥ s these are supplementary → 180° − 118° = 62°.',
        'Corresponding: same position at each crossing. With r ∥ s these are congruent → 118°.',
        'Sense-check the whole picture: only two sizes appear, 118° and 62°, four angles of each, and 118 + 62 = 180. ✓',
      ],
      answer: '(a) 118°, (b) 62°, (c) 118°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-side-trap',
      kind: 'worked_example',
      problem:
        'Lines j and k are parallel and are cut by a transversal. Two interior angles on the SAME side of the transversal measure (4x + 10)° and (6x)°. A student writes 4x + 10 = 6x and gets x = 5. Explain the error and find the correct value of x.',
      steps: [
        'Classify the pair first: both angles are interior and on the same side of the transversal → same-side interior, not alternate interior.',
        'Same-side interior angles are SUPPLEMENTARY when the lines are parallel, so the expressions get ADDED, not set equal: (4x + 10) + 6x = 180.',
        'Combine and solve: 10x + 10 = 180 → 10x = 170 → x = 17.',
        'Check by measuring: 4(17) + 10 = 78° and 6(17) = 102°, and 78 + 102 = 180. ✓ Two sizes, supplementary — exactly what the picture demands.',
        'Why the student answer fails: x = 5 gives 30° and 30°, a pair summing to 60°. Two same-side interior angles can only be equal if both are 90°, so 30° and 30° is impossible with j ∥ k.',
      ],
      answer: 'x = 17 — the pair is same-side interior, so the expressions sum to 180°, not to each other.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-alternate-exterior',
      kind: 'try_yourself',
      problem:
        'Two parallel lines are cut by a transversal. An alternate exterior angle pair has measures (5x − 12)° and (3x + 24)°. What is the value of x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6' },
        { id: 'b', text: '18', correct: true },
        { id: 'c', text: '21' },
        { id: 'd', text: '78' },
      ],
      expectedAnswer: '18',
      hints: [
        'Alternate exterior angles are congruent when the lines are parallel — equal, not supplementary.',
        '5x − 12 = 3x + 24 → 2x = 36. And the question asks for x, not for the angle measure.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-no-parallel-claim',
      kind: 'try_yourself',
      problem:
        'Lines c and d are cut by transversal t, and nothing in the problem says c and d are parallel. The angle above line c and to the right of t measures 68°. Which statement MUST be true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The angle below line c and to the left of t measures 68°.', correct: true },
        { id: 'b', text: 'The corresponding angle at the crossing with d measures 68°.' },
        { id: 'c', text: 'The alternate interior angle at the crossing with d measures 68°.' },
        { id: 'd', text: 'The same-side interior angle at the crossing with d measures 112°.' },
      ],
      expectedAnswer: 'The angle below line c and to the left of t measures 68°.',
      hints: [
        'Sort the four rules into "always true at any crossing" and "needs the lines to be parallel".',
        'Corresponding, alternate interior, and same-side interior all require c ∥ d. Vertical angles do not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-chain',
      kind: 'try_yourself',
      problem:
        'Lines u and v are parallel and are cut by transversal t. An angle at the crossing with u measures (3x + 8)°. Its corresponding angle at the crossing with v forms a linear pair with an angle measuring 115°. Find x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '19',
      hints: [
        'Work the crossing with v first: a linear pair is supplementary, so the corresponding angle is 180 − 115.',
        'Corresponding angles are congruent with u ∥ v, so 3x + 8 = 65.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-alternate-vs-same-side',
      kind: 'misconception_check',
      question:
        'Lines m and n are parallel, cut by a transversal, and one interior angle measures 70°. A student is asked for the ALTERNATE interior angle and answers 110°. What went wrong?',
      commonErrors: [
        {
          answer: '110°',
          misconception:
            'Blurring the two interior pairs — treating any interior angle across the figure as supplementary, when only the SAME-SIDE pair is supplementary.',
          correctsTo:
            'Check which side of the transversal each angle is on. Opposite sides → alternate interior → CONGRUENT → 70°. Same side → supplementary → 110°. The side of the transversal is the whole decision.',
        },
        {
          answer: '20°',
          misconception: 'Reaching for complementary (90°) instead of supplementary (180°) when a pair is not congruent.',
          correctsTo:
            'Angle pairs made by a transversal sit along straight lines, so the non-congruent pairs sum to 180°, never 90°. Complementary pairs show up in right triangles, not in the transversal picture.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Classify before you compute: interior or exterior, same side of the transversal or opposite sides.',
        'With the lines parallel: corresponding, alternate interior, and alternate exterior angles are CONGRUENT; same-side interior angles are SUPPLEMENTARY (add to 180°, do not set them equal).',
        'Vertical angles and linear pairs hold at any crossing; the four pair theorems hold ONLY when the lines are parallel.',
        'The picture has just two angle sizes, four of each, summing to 180° — use that as your final sense-check.',
        'Name the reason on every hop ("alternate interior angles, m ∥ n"; "linear pair") so a two-step angle chase stays provable.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Parallel Lines & Transversals' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
