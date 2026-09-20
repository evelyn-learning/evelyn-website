/**
 * Grade 8 Math — Unit 8 CED 8.3: Congruence Through Rigid Motions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.congruence-through-rigid-motions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U8_CONGRUENCE_THROUGH_RIGID_MOTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.congruence-through-rigid-motions.v1',
  course: 'Grade 8 Math',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Congruence Through Rigid Motions',
  planId: 'evelyn.ms.m8math.congruence-through-rigid-motions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.congruence-through-rigid-motions.v1' }],
  theory: [
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Congruent means a chain of rigid motions lands one figure on the other', content: `CONGRUENT MEANS A CHAIN OF RIGID MOTIONS LANDS ONE FIGURE ON THE OTHER — two figures are congruent exactly when some sequence of translations, reflections and rotations maps one figure exactly onto the other, every vertex landing on a vertex. That is the definition, not a feeling that they look alike: the S-piece and the Z-piece are congruent because one flip lays one on top of the other, and you can name the flip.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Why a chain keeps size and shape', content: `WHY A CHAIN KEEPS SIZE AND SHAPE — you verified in the last two lessons that a slide, a flip across an axis, and a turn about the origin each keep every length and every angle measure. A chain of them keeps every length and angle too, one motion at a time, so the final image is the same size and the same shape as the original. It only sits somewhere else, and maybe faces another way.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Apply a sequence one motion at a time, in order', content: `APPLY A SEQUENCE ONE MOTION AT A TIME, IN ORDER — do the first motion to every vertex, write the new coordinates down, then do the second motion to THOSE coordinates, not to the originals. Order matters: take the point (2, 1), translate right 3 to (5, 1), then reflect across the y-axis to (-5, 1). Reflect first instead and (2, 1) goes to (-2, 1), then right 3 lands it on (1, 1), a different point.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Read the two figures before you pick the moves', content: `READ THE TWO FIGURES BEFORE YOU PICK THE MOVES — compare them side by side. If every side points the same way in both figures, a slide may be all you need. If a side that pointed right now points left, up or down, the figure was flipped or turned, so a reflection or a rotation comes first and a slide finishes the job. A slide or a turn never flips a figure over, so a mirror image always needs a reflection somewhere in the chain.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Yes needs a sequence, no needs one mismatch', content: `YES NEEDS A SEQUENCE, NO NEEDS ONE MISMATCH — to show two figures ARE congruent, write a sequence and check that every vertex lands. To show they are NOT, you only need one thing a rigid motion could never change: a side that is 3 units long in one figure and 6 units long in the other, or a right angle that the other figure does not have. Find lengths along the grid lines by subtracting coordinates, the way you find the distance between two points that share a coordinate.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'framework', title: 'Same shape is not the same as congruent', content: `SAME SHAPE IS NOT THE SAME AS CONGRUENT — a figure that is the same shape but bigger is not congruent to the original, because no slide, flip or turn changes a length. A figure that is flipped over IS congruent, because a reflection is a rigid motion. Size and shape both have to match; which way the figure faces does not.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'definition', title: 'rigid motion', content: `a translation, a reflection or a rotation; a motion that keeps every length and every angle measure.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'definition', title: 'sequence of rigid motions', content: `two or more rigid motions done one after another, each one applied to the result of the one before.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'definition', title: 'congruent', content: `two figures are congruent when a sequence of rigid motions maps one exactly onto the other.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'definition', title: 'maps onto', content: `lands exactly on top of; a motion maps a figure onto another when every vertex of the image is a vertex of the other figure.` },
    { loId: 'm8math.congruence-through-rigid-motions', kind: 'definition', title: 'image', content: 'the figure you get after a motion, or after a whole sequence of motions.' },
  ],
  methods: [
    {
      title: 'Worked reflect then slide',
      steps: [
        `Read both figures before choosing any move. Triangle A has its right-angle corner at (1, 1), a horizontal leg of 4 - 1 = 3 running to the right, and a vertical leg of 3 - 1 = 2 running up. Triangle B has its corner at (-1, -4), a horizontal leg of -1 - (-4) = 3 running to the LEFT, and a vertical leg of -2 - (-4) = 2 running up. Same lengths, but the horizontal leg points the opposite way, so B is a mirror image of A.`,
        `A slide alone cannot flip a figure over. Try it and see: sliding the corner (1, 1) onto (-1, -4) is left 2 and down 5, which sends (4, 1) to (2, -4), and B has no vertex there. The chain needs a reflection, and since the leg that flips is the horizontal one, reflect across the y-axis first.`,
        `Reflect across the y-axis, (x, y) → (-x, y): (1, 1) → (-1, 1), (4, 1) → (-4, 1), (1, 3) → (-1, 3). The horizontal leg now points left, matching B, but the whole figure sits 5 units too high: the corner is at (-1, 1) and needs to be at (-1, -4).`,
        `Translate down 5, (x, y) → (x, y - 5), applied to the reflected vertices, not the originals: (-1, 1) → (-1, -4), (-4, 1) → (-4, -4), (-1, 3) → (-1, -2).`,
        `Compare with triangle B: (-4, -4), (-1, -4), (-1, -2). All three image vertices land exactly on vertices of B, so the sequence "reflect across the y-axis, then translate down 5" maps A onto B, and the two triangles are congruent.`,
        `Check by undoing the chain in reverse order: translate B up 5 to (-4, 1), (-1, 1), (-1, 3), then reflect across the y-axis to (4, 1), (1, 1), (1, 3). That is triangle A, so the chain is right. Other chains also work here, for example sliding down 5 first and reflecting second, and any correct chain is a full proof of congruence.`,
      ],
      example: { problem: `Triangle A has vertices (1, 1), (4, 1), (1, 3). Triangle B has vertices (-4, -4), (-1, -4), (-1, -2). Describe a sequence of rigid motions that maps triangle A onto triangle B, apply it to every vertex, and say whether the two triangles are congruent.`, solution: `Congruent. Reflect across the y-axis, then translate (x, y) → (x, y - 5); the images are (-1, -4), (-4, -4), (-1, -2), which are the vertices of triangle B.` },
      relatedLoIds: ['m8math.congruence-through-rigid-motions'],
    },
    {
      title: 'Worked decide from coordinates',
      steps: [
        `Measure T along the grid lines. From the corner (2, 2), the horizontal leg runs to (5, 2), a length of 5 - 2 = 3, and the vertical leg runs to (2, 4), a length of 4 - 2 = 2. The corner is a right angle.`,
        `Measure U the same way: horizontal leg 10 - 4 = 6, vertical leg 8 - 4 = 4. WRONG: "U is the same shape as T, just bigger, so they are congruent." CORRECT: a rigid motion never changes a length, so no chain of slides, flips and turns can stretch a leg of 3 into a leg of 6. U is not congruent to T, and there is no sequence to look for.`,
        `Measure V: from the corner (4, 1), the horizontal leg runs to (2, 1), a length of 4 - 2 = 2, and the vertical leg runs to (4, 4), a length of 4 - 1 = 3. The same two lengths as T, with the same right angle between them, but the 3 now runs up and down. Matching lengths make congruence possible; a sequence that lands every vertex is what proves it.`,
        `In T the leg of 3 points right from the corner, and in V it points up. A quarter turn counterclockwise sends right to up, so start with a 90° rotation about the origin, (x, y) → (-y, x): (2, 2) → (-2, 2), (5, 2) → (-2, 5), (2, 4) → (-4, 2).`,
        `The rotated corner is at (-2, 2) and needs to reach (4, 1), which is right 6 and down 1. Translate (x, y) → (x + 6, y - 1), applied to the rotated vertices: (-2, 2) → (4, 1), (-2, 5) → (4, 4), (-4, 2) → (2, 1). Those are exactly the vertices of V, so T and V are congruent.`,
        `Check by undoing in reverse: translate V left 6 and up 1, (2, 1) → (-4, 2), (4, 1) → (-2, 2), (4, 4) → (-2, 5), then rotate 270° counterclockwise, (x, y) → (y, -x), the turn that undoes a 90° turn: (-4, 2) → (2, 4), (-2, 2) → (2, 2), (-2, 5) → (5, 2). Those are the vertices of triangle T.`,
      ],
      example: { problem: `Triangle T has vertices (2, 2), (5, 2), (2, 4). Triangle U has vertices (4, 4), (10, 4), (4, 8). Triangle V has vertices (2, 1), (4, 1), (4, 4). Use the coordinates to decide which of U and V is congruent to T, and describe a sequence for the one that is.`, solution: `V is congruent to T: rotate 90° counterclockwise about the origin, then translate (x, y) → (x + 6, y - 1). U is not congruent to T, because its legs are 6 and 4 while the legs of T are 3 and 2.` },
      relatedLoIds: ['m8math.congruence-through-rigid-motions'],
    },
  ],
  pointers: [
    { content: `Students often say "N is not congruent to M, because N faces the other way." — Reflect M across the y-axis, (x, y) → (-x, y): (2, 1) → (-2, 1), (5, 1) → (-5, 1), (2, 3) → (-2, 3). Those are exactly the vertices of N, so one reflection maps M onto N, and a single reflection counts as a sequence of rigid motions. M and N are congruent. Facing the other way never breaks congruence; your left hand and your right hand are the same size and shape and still mirror each other.`, kind: 'common-error' },
    { content: `Students often say "The triangle with vertices (2, 2), (8, 2), (2, 6) is congruent to M, because it is the same shape." — Measure along the grid lines. The legs of M are 5 - 2 = 3 and 3 - 1 = 2. The legs of the other triangle are 8 - 2 = 6 and 6 - 2 = 4. A slide, a flip or a turn keeps every length, so no chain of them can turn a leg of 3 into a leg of 6. There is no sequence to find, and the triangles are not congruent, no matter how alike they look.`, kind: 'common-error' },
    { content: `Two figures are congruent exactly when a sequence of translations, reflections and rotations maps one onto the other, every vertex landing on a vertex.`, kind: 'tip' },
    { content: `Apply a sequence one motion at a time, in the order given, and feed each new set of coordinates into the next motion. Order matters.`, kind: 'tip' },
    { content: `Read the figures first: a side that changed direction means a flip or a turn comes before the slide, and a mirror image always needs a reflection.`, kind: 'tip' },
    { content: `To say yes, write the sequence and check every vertex. To say no, find one length or one angle the two figures do not share, because rigid motions never change those.`, kind: 'tip' },
    { content: `Same shape but a different size is not congruent; flipped over is still congruent.`, kind: 'tip' },
    { content: `Check a chain by undoing it in reverse order and landing back on the original figure.`, kind: 'tip' },
  ],
};
