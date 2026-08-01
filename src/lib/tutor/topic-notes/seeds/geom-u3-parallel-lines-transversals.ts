/**
 * Geometry — Unit 3 CED 3.1: Parallel Lines & Transversals.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.parallel-lines-transversals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U3_PARALLEL_LINES_TRANSVERSALS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.parallel-lines-transversals.v1',
  course: 'Geometry',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Parallel Lines & Transversals',
  planId: 'evelyn.hs.geom.parallel-lines-transversals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.parallel-lines-transversals.v1' }],
  theory: [
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'The setup', content: `THE SETUP — a TRANSVERSAL is a line that crosses two other lines. It makes four angles at each crossing, eight in all. The four angles sitting BETWEEN the two lines are INTERIOR; the four outside are EXTERIOR.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'Name pairs by position', content: `NAME PAIRS BY POSITION — CORRESPONDING angles sit in the same position at each crossing (both upper-left, say), one interior and one exterior. ALTERNATE INTERIOR: both interior, opposite sides of the transversal. ALTERNATE EXTERIOR: both exterior, opposite sides. SAME-SIDE INTERIOR (also called co-interior): both interior, SAME side of the transversal.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'What parallel unlocks', content: `WHAT PARALLEL UNLOCKS — when the two lines are parallel, corresponding angles are congruent (this is the postulate everything else is built on), and so alternate interior angles are congruent, alternate exterior angles are congruent, and same-side interior angles are SUPPLEMENTARY — they sum to 180°, they are NOT equal.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'Only two sizes in the picture', content: `ONLY TWO SIZES IN THE PICTURE — with parallel lines, all eight angles collapse into one acute measure and one obtuse measure, four of each, and the two sum to 180°. (If the transversal is ⊥ to the parallels, all eight are 90°.) After solving, sense-check that every answer is one of your two numbers.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'Always-true vs parallel-only', content: `ALWAYS-TRUE VS PARALLEL-ONLY — VERTICAL angles congruent and LINEAR PAIR supplementary need NO parallel lines; they hold at any crossing. The four pair theorems above need the lines to be parallel. ERROR 1: applying corresponding/alternate/same-side rules to two lines nobody said were parallel — those angles are then completely unrelated.` },
    { loId: 'geom.parallel-lines-transversals', content: `ERROR 2: SETTING SAME-SIDE INTERIOR ANGLES EQUAL — the reflex is "parallel means equal", so students write (2x + 5) = (3x − 10) for a co-interior pair. Same side of the transversal means SUPPLEMENTARY: the two expressions must be ADDED and set to 180.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'framework', title: 'Chaining with reasons', content: `CHAINING WITH REASONS — most problems need two moves, not one: hop across the transversal with a pair theorem, then hop around a crossing with vertical angles or a linear pair. Name the reason at each hop ("corresponding angles, m ∥ n", "linear pair") — that is exactly the two-column habit from the last lesson, and it is what makes long angle chases stay honest.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'definition', title: 'transversal', content: `a line that crosses two or more other lines, forming four angles at each crossing.` },
    { loId: 'geom.parallel-lines-transversals', kind: 'definition', title: 'same-side interior angles', content: `two angles between the lines and on the same side of the transversal — supplementary when the lines are parallel.` },
  ],
  methods: [
    {
      title: 'Worked fill the picture',
      steps: [
        `Alternate interior: both angles are interior and on opposite sides of t. With r ∥ s these are congruent → 118°.`,
        `Same-side interior: both interior, same side of t. With r ∥ s these are supplementary → 180° − 118° = 62°.`,
        `Corresponding: same position at each crossing. With r ∥ s these are congruent → 118°.`,
        `Sense-check the whole picture: only two sizes appear, 118° and 62°, four angles of each, and 118 + 62 = 180. ✓`,
      ],
      example: { problem: `Lines r and s are parallel and are cut by transversal t. One of the interior angles at the crossing with r measures 118°. Find (a) its alternate interior angle at the crossing with s, (b) the same-side interior angle at the crossing with s, and (c) its corresponding angle at the crossing with s.`, solution: '(a) 118°, (b) 62°, (c) 118°' },
      relatedLoIds: ['geom.parallel-lines-transversals'],
    },
    {
      title: 'Worked same side trap',
      steps: [
        `Classify the pair first: both angles are interior and on the same side of the transversal → same-side interior, not alternate interior.`,
        `Same-side interior angles are SUPPLEMENTARY when the lines are parallel, so the expressions get ADDED, not set equal: (4x + 10) + 6x = 180.`,
        'Combine and solve: 10x + 10 = 180 → 10x = 170 → x = 17.',
        `Check by measuring: 4(17) + 10 = 78° and 6(17) = 102°, and 78 + 102 = 180. ✓ Two sizes, supplementary — exactly what the picture demands.`,
        `Why the student answer fails: x = 5 gives 30° and 30°, a pair summing to 60°. Two same-side interior angles can only be equal if both are 90°, so 30° and 30° is impossible with j ∥ k.`,
      ],
      example: { problem: `Lines j and k are parallel and are cut by a transversal. Two interior angles on the SAME side of the transversal measure (4x + 10)° and (6x)°. A student writes 4x + 10 = 6x and gets x = 5. Explain the error and find the correct value of x.`, solution: `x = 17 — the pair is same-side interior, so the expressions sum to 180°, not to each other.` },
      relatedLoIds: ['geom.parallel-lines-transversals'],
    },
  ],
  pointers: [
    { content: `Check which side of the transversal each angle is on. Opposite sides → alternate interior → CONGRUENT → 70°. Same side → supplementary → 110°. The side of the transversal is the whole decision.`, kind: 'common-error' },
    { content: `Angle pairs made by a transversal sit along straight lines, so the non-congruent pairs sum to 180°, never 90°. Complementary pairs show up in right triangles, not in the transversal picture.`, kind: 'common-error' },
    { content: `Classify before you compute: interior or exterior, same side of the transversal or opposite sides.`, kind: 'tip' },
    { content: `With the lines parallel: corresponding, alternate interior, and alternate exterior angles are CONGRUENT; same-side interior angles are SUPPLEMENTARY (add to 180°, do not set them equal).`, kind: 'tip' },
    { content: `Vertical angles and linear pairs hold at any crossing; the four pair theorems hold ONLY when the lines are parallel.`, kind: 'tip' },
    { content: `The picture has just two angle sizes, four of each, summing to 180° — use that as your final sense-check.`, kind: 'tip' },
    { content: `Name the reason on every hop ("alternate interior angles, m ∥ n"; "linear pair") so a two-step angle chase stays provable.`, kind: 'tip' },
    { content: `Classify the pair *before* you write an equation: same side of the transversal → ADD to 180; opposite sides → set EQUAL. The side of the transversal is the entire decision, not whether the angles "look" equal.`, kind: 'tip' },
    { content: `Never write (2x+5) = (3x−10) for a same-side interior pair. "Parallel" does not mean "all equal" — co-interior angles are supplementary. Two same-side interior angles are equal ONLY if both are 90°.`, kind: 'common-error' },
    { content: `If nothing states the lines are parallel, the four pair theorems are off-limits — corresponding/alternate/same-side angles are then unrelated. Only vertical angles and linear pairs survive at a single crossing.`, kind: 'gotcha' },
    { content: `When a transversal pair isn't congruent, it's supplementary (180°), never complementary (90°). Complementary angles live in right triangles, not in the eight-angle transversal picture.`, kind: 'common-error' },
    { content: `Finish every problem by scanning the figure: with parallel lines there are only TWO sizes, four angles each, summing to 180°. If your answers include three different measures, you misclassified a pair.`, kind: 'tip' },
    { content: `"Corresponding" means same position at each crossing (both upper-left, etc.) — one interior, one exterior. Don't call two angles at the SAME crossing corresponding; those are vertical angles or a linear pair.`, kind: 'vocab-note' },
    { content: `Most problems need two hops, not one: cross the transversal with a pair theorem, then move around one crossing with vertical angles or a linear pair. Solving for x after only one hop is a classic half-answer.`, kind: 'gotcha' },
    { content: `Name the reason on every step, including the parallel condition: "alternate interior angles, m ∥ n" — not just "alternate interior." Dropping the ∥ statement is exactly what makes an angle chase unjustified.`, kind: 'edge-case' },
  ],
};
