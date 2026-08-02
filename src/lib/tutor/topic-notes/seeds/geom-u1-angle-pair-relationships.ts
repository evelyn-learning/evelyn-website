/**
 * Geometry — Unit 1 CED 1.4: Angle Pair Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.angle-pair-relationships.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U1_ANGLE_PAIR_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.angle-pair-relationships.v1',
  course: 'Geometry',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Angle Pair Relationships',
  planId: 'evelyn.hs.geom.angle-pair-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.angle-pair-relationships.v1' }],
  theory: [
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'Adjacent angles', content: `ADJACENT ANGLES — share a vertex AND a side, and their interiors do not overlap. Sharing only the vertex is not enough, and one angle sitting inside another is not adjacent.` },
    { loId: 'geom.angle-pair-relationships', content: `COMPLEMENTARY vs SUPPLEMENTARY — complementary angles sum to 90°, supplementary angles sum to 180°. These are NUMBER relationships only: the two angles may sit side by side or in completely different parts of a figure. Alphabet hook: C before S, 90 before 180.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'Linear pair', content: `LINEAR PAIR — two ADJACENT angles whose outer sides form a straight line (opposite rays). A linear pair is always supplementary, so it is the one position that hands you the 180° equation for free.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'Vertical angles', content: `VERTICAL ANGLES — when two lines cross they make two pairs of opposite, non-adjacent angles. Vertical angles are always CONGRUENT (equal measure). Why: each of them forms a linear pair with the same neighbor angle, so both equal 180° minus that neighbor.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'One angle unlocks four', content: `ONE ANGLE UNLOCKS FOUR — at any crossing the four angles read around as x, 180° - x, x, 180° - x, totalling 360°. Two copies of the acute value, two of the obtuse value.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'Perpendicular and bisectors', content: `PERPENDICULAR AND BISECTORS — if two lines are ⊥ every angle at the crossing is 90°, so all four are congruent AND complementary in pairs. An angle bisector cuts one angle into two congruent halves, each measuring half the whole.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'Never trust the look', content: `NEVER TRUST THE LOOK — an angle that looks like 90°, or two angles that look equal, prove nothing. Only given statements, tick or arc marks, and a stated ⊥ count as evidence.` },
    { loId: 'geom.angle-pair-relationships', kind: 'framework', title: 'The algebra move', content: `THE ALGEBRA MOVE — name the relationship FIRST, then write its equation: congruent pairs give expression = expression, linear pairs give expression + expression = 180, complements give a sum of 90. Solve for x, then substitute back, because the question usually asks for an ANGLE, not for x.` },
    { loId: 'geom.angle-pair-relationships', kind: 'definition', title: 'linear pair', content: `two adjacent angles whose non-shared sides form a straight line — always supplementary.` },
    { loId: 'geom.angle-pair-relationships', kind: 'definition', title: 'vertical angles', content: `the two opposite, non-adjacent angles formed by a pair of intersecting lines — always congruent.` },
  ],
  methods: [
    {
      title: 'Worked one unlocks four',
      steps: [
        `Locate ∠APD: it is adjacent to ∠APC and rays PC and PD are opposite rays, so ∠APC and ∠APD form a linear pair → m∠APD = 180° - 47° = 133°.`,
        `Locate ∠BPD: it is opposite ∠APC across the crossing, so they are vertical angles → m∠BPD = 47°.`,
        `Locate ∠BPC: it is vertical to ∠APD → m∠BPC = 133°. (It also forms a linear pair with ∠APC, which gives the same 133°.)`,
        `Sense-check: 47 + 133 + 47 + 133 = 360°, and the four angles come in two congruent pairs. ✓`,
      ],
      example: { problem: `Lines AB and CD intersect at point P, and m∠APC = 47°. Find m∠APD, m∠BPD, and m∠BPC.`, solution: 'm∠APD = 133°, m∠BPD = 47°, m∠BPC = 133°' },
      relatedLoIds: ['geom.angle-pair-relationships'],
    },
    {
      title: 'Worked linear pair trap',
      steps: [
        `Name the relationship first: a LINEAR PAIR is supplementary, not congruent. The student used the congruent-angles equation, which belongs to vertical angles.`,
        'Write the right equation: (3x + 10) + (5x + 26) = 180, so 8x + 36 = 180.',
        'Solve: 8x = 144, so x = 18.',
        `Substitute back — the question asks for angles, not x: m∠1 = 3(18) + 10 = 64° and m∠2 = 5(18) + 26 = 116°.`,
        `Check: 64 + 116 = 180 ✓. Notice the negative x was the warning sign — a negative solution usually means the wrong relationship was used.`,
      ],
      example: { problem: `∠1 and ∠2 form a linear pair, with m∠1 = (3x + 10)° and m∠2 = (5x + 26)°. A student writes 3x + 10 = 5x + 26 and gets x = -8. Find the error and the correct measure of each angle.`, solution: 'The linear pair is supplementary, not congruent: x = 18, m∠1 = 64°, m∠2 = 116°.' },
      relatedLoIds: ['geom.angle-pair-relationships'],
    },
  ],
  pointers: [
    { content: `Vertical angles are CONGRUENT, so set the expressions equal: 4x = 2x + 30 → 2x = 30 → x = 15, making both angles 60°. The 180° equation belongs only to ADJACENT angles that form a linear pair. Answer check: vertical angles must come out equal — 100° and 80° were unequal, which flags the error immediately.`, kind: 'common-error' },
    { content: `Adjacent = shared vertex AND shared side; complementary = 90°; supplementary = 180° (position not required).`, kind: 'tip' },
    { content: `Linear pair → supplementary (add to 180°). Vertical angles → congruent (set equal). Do not swap those two equations.`, kind: 'tip' },
    { content: `One angle at a crossing gives all four: x, 180° - x, x, 180° - x, totalling 360°.`, kind: 'tip' },
    { content: `Never assume a right angle or an equality from how the drawing looks — use givens, marks, and ⊥ statements.`, kind: 'tip' },
    { content: `Solve for x, then substitute back and answer the question that was actually asked.`, kind: 'tip' },
    { content: `Vertical angles → set expressions **equal**. Linear pair → set the sum **= 180**. Swapping these two equations is the #1 error in this topic. Name the relationship out loud before you write a single equal sign.`, kind: 'common-error' },
    { content: `A negative x, or a "vertical pair" that comes out as two unequal measures (like 100° and 80°), is a red flag that you used the wrong relationship — not a valid answer. Go back and re-name the pair.`, kind: 'tip' },
    { content: `Complementary and supplementary are about **numbers only** — the angles need not touch. Two 45° angles on opposite sides of a page are still complementary. Don't require adjacency to call a pair complementary or supplementary.`, kind: 'vocab-note' },
    { content: `Adjacent needs a shared vertex **AND** a shared side with non-overlapping interiors. Sharing only the vertex isn't adjacent, and an angle drawn inside a larger angle isn't adjacent to it either.`, kind: 'edge-case' },
    { content: `Every linear pair is supplementary, but not every supplementary pair is a linear pair. Same with vertical/congruent: congruent angles aren't automatically vertical. The one-way direction matters in "always true" questions.`, kind: 'gotcha' },
    { content: `Never claim a right angle, or that two angles are equal, because the picture looks that way. Only a given statement, tick/arc marks, or a stated ⊥ symbol counts as evidence.`, kind: 'common-error' },
    { content: `Solve for x, then **substitute back**. The question almost always asks for an angle measure in degrees, not for x. Circling x = 18 when the answer is 64° loses the whole problem.`, kind: 'tip' },
    { content: `Write angle names with three letters when a vertex has several rays: ∠APC, not ∠P. At an intersection, ∠P is ambiguous — it could mean any of four angles.`, kind: 'vocab-note' },
  ],
};
