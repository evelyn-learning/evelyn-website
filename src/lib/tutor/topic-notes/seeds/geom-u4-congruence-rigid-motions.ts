/**
 * Geometry — Unit 4 CED 4.5: Congruence in Terms of Rigid Motions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.congruence-rigid-motions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U4_CONGRUENCE_RIGID_MOTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.congruence-rigid-motions.v1',
  course: 'Geometry',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Congruence in Terms of Rigid Motions',
  planId: 'evelyn.hs.geom.congruence-rigid-motions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.congruence-rigid-motions.v1' }],
  theory: [
    { loId: 'geom.congruence-rigid-motions', kind: 'framework', title: 'The definition', content: `THE DEFINITION — two figures are CONGRUENT when there is a sequence of rigid motions (translations, reflections, rotations) that maps one exactly onto the other. Not "they look the same" — there must be a sequence of moves you can name.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'framework', title: 'What rigid motions preserve', content: `WHAT RIGID MOTIONS PRESERVE — every distance and every angle measure. Position and facing may change; length, angle, area, and shape never do. That is why the matching sides and angles of congruent figures are automatically equal — you get corresponding parts for free from the motion.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'framework', title: 'The motion names the match', content: `THE MOTION NAMES THE MATCH — if the sequence sends A→D, B→E, C→F, you write △ABC ≅ △DEF. The letter ORDER is the mapping, not decoration: it tells you AB = DE and ∠B = ∠E without measuring anything.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'framework', title: 'How to build the sequence', content: `HOW TO BUILD THE SEQUENCE — translate one vertex onto its partner, rotate about that vertex until a matching side lines up, then reflect across that side if the figure is still facing the wrong way. Two or three motions are always enough for triangles.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'framework', title: 'Orientation tells you if a reflection is needed', content: `ORIENTATION TELLS YOU IF A REFLECTION IS NEEDED — read the vertices A→B→C around the figure. If one figure reads counterclockwise and the other reads clockwise, the sequence MUST contain a reflection (an odd number of them). Same reading direction → translations and rotations alone will do it.` },
    { loId: 'geom.congruence-rigid-motions', content: `ERROR: A DILATION IS NOT A RIGID MOTION — scaling by anything other than 1 changes distances, so a mapping that doubles a figure proves SIMILARITY, not congruence. Same shape is not the same as congruent.` },
    { loId: 'geom.congruence-rigid-motions', content: `ERROR: "IT IS FLIPPED, SO IT CANNOT BE CONGRUENT" — a reflection is a rigid motion. A mirror image is fully congruent; your left and right hands are congruent figures. Congruence never requires matching orientation.` },
    { loId: 'geom.congruence-rigid-motions', content: `ERROR: MATCHING PARTS IN THE WRONG ORDER — two triangles can be congruent while the statement you wrote is false. △ABC ≅ △DEF is a claim about WHICH vertex goes to which; if the motion actually sends A→E, that statement is wrong even though the triangles are congruent.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'definition', title: 'rigid motion', content: `a transformation that preserves every distance and angle measure — a translation, reflection, rotation, or any sequence of them.` },
    { loId: 'geom.congruence-rigid-motions', kind: 'definition', title: 'orientation', content: `the direction, clockwise or counterclockwise, in which the labeled vertices of a figure are read; reflections reverse it, translations and rotations do not.` },
  ],
  methods: [
    {
      title: 'Worked name the sequence',
      steps: [
        `Compare the side lengths first: AB runs 3 units right, AC runs 2 units up; DE runs 3 units right, DF runs 2 units down. The legs match, so congruence is at least plausible.`,
        `Check orientation: reading A→B→C goes right, then up-and-left — counterclockwise. Reading D→E→F goes right, then down-and-left — clockwise. The reading direction reversed, so the sequence must include a reflection.`,
        `Reflect across the x-axis, the rule (x, y) → (x, -y): A(-5, 1) → (-5, -1), B(-2, 1) → (-2, -1), C(-5, 3) → (-5, -3). The image now faces the same way as △DEF.`,
        `Translate 7 units right, the rule (x, y) → (x + 7, y): (-5, -1) → (2, -1) = D, (-2, -1) → (5, -1) = E, (-5, -3) → (2, -3) = F. Every vertex lands on its partner.`,
        `A sequence of rigid motions maps △ABC exactly onto △DEF, so by definition the triangles are congruent — and the mapping A→D, B→E, C→F makes △ABC ≅ △DEF the correct statement.`,
      ],
      example: { problem: `Right triangle ABC has vertices A(-5, 1), B(-2, 1), and C(-5, 3), with the right angle at A. Triangle DEF has vertices D(2, -1), E(5, -1), and F(2, -3). Show that △ABC ≅ △DEF by naming a sequence of rigid motions that maps A→D, B→E, and C→F.`, solution: `Reflect across the x-axis, then translate 7 units right; the sequence maps A→D, B→E, C→F, so △ABC ≅ △DEF.` },
      relatedLoIds: ['geom.congruence-rigid-motions'],
    },
    {
      title: 'Worked dilation impostor',
      steps: [
        `Identify the transformation: every point doubled its distance from the origin, so this is a dilation centered at (0, 0) with scale factor 2 — not a translation, reflection, or rotation.`,
        `Test the rigid-motion requirement on distances: AB = 3 but JK = 6; the hypotenuse BC = 5 (a 3-4-5 triangle) but KL = 10. Distances changed, so the mapping is NOT a rigid motion.`,
        `Notice what DID survive: the angles are unchanged, so the triangles have the same shape. Same shape with different size is SIMILARITY, which is Unit 6, not congruence.`,
        `Could some other sequence work? No — every rigid motion preserves length, so no sequence of them can turn a side of 3 into a side of 6. No sequence exists.`,
        `The transformation exists, but it is the wrong kind. △ABC and △JKL are similar, not congruent.`,
      ],
      example: { problem: `A classmate says: "Triangle ABC has A(0, 0), B(3, 0), C(0, 4). Triangle JKL has J(0, 0), K(6, 0), L(0, 8). I found a transformation that maps △ABC onto △JKL, so the triangles are congruent." Is the conclusion right?`, solution: `No — the mapping is a dilation with scale factor 2, which is not a rigid motion; the triangles are similar, not congruent.` },
      relatedLoIds: ['geom.congruence-rigid-motions'],
    },
  ],
  pointers: [
    { content: `A reflection IS a rigid motion — it preserves every distance and angle, so the mirror image is fully congruent. Reversed orientation only tells you the sequence contains a reflection; it never rules congruence out. Your left and right hands are congruent.`, kind: 'common-error' },
    { content: `Congruent means there IS a sequence of rigid motions — translations, reflections, rotations — mapping one figure onto the other.`, kind: 'tip' },
    { content: `Rigid motions preserve all distances and angles, so matching sides and angles come free with the mapping.`, kind: 'tip' },
    { content: `The mapping sets the letter order: A→D, B→E, C→F means △ABC ≅ △DEF, and a scrambled order makes the statement false.`, kind: 'tip' },
    { content: `Reversed orientation means a reflection is in the sequence — flipped figures are still congruent.`, kind: 'tip' },
    { content: `Dilations with scale factor other than 1 are not rigid motions: they give similarity, never congruence.`, kind: 'tip' },
    { content: `Write the congruence statement in the order the motion dictates. If the sequence sends P→U, Q→S, R→T, the statement is △PQR ≅ △UST — copy the images in the same slot order as the pre-image letters, don't alphabetize.`, kind: 'common-error' },
    { content: `"Congruent" is a claim that a sequence EXISTS, not that the figures look alike. If you can't name specific motions (with rules or lines/angles/vectors), you haven't shown congruence yet.`, kind: 'vocab-note' },
    { content: `Check orientation BEFORE you pick motions: read A→B→C around the figure. Opposite reading directions (one CCW, one CW) means your sequence must contain an odd number of reflections — no pile of translations and rotations will ever fix it.`, kind: 'tip' },
    { content: `A flipped figure is still congruent. Reversed orientation tells you a reflection is IN the sequence; it never disqualifies congruence. Your left and right hands are congruent.`, kind: 'common-error' },
    { content: `A dilation with scale factor ≠ 1 is NOT a rigid motion. Finding *a* transformation that maps one figure onto another proves nothing — it has to be a translation, reflection, rotation, or a sequence of those.`, kind: 'gotcha' },
    { content: `Scale factor exactly 1 is the edge case: a dilation with k = 1 leaves every point fixed, so it acts as the identity and is harmless. Any other k changes distances and gives similarity, not congruence.`, kind: 'edge-case' },
    { content: `Sometimes ONE motion is enough — check for a single reflection, rotation, or translation before stacking three. Matching coordinates like (1,1)→(1,−1) and (4,1)→(4,−1) scream reflection across the x-axis.`, kind: 'tip' },
    { content: `A translation must move EVERY point by the same vector. Find the vector once from a known pair — A(−3,5)→D(4,1) gives (x+7, y−4) — then apply that same rule to the others; don't re-derive a new shift per vertex.`, kind: 'common-error' },
  ],
};
