/**
 * Grade 8 Math — Transformations, Congruence & Similarity: Congruence
 * Through Rigid Motions.
 *
 * CONCEPT-LED. The student arrives owning three coordinate motions (slide,
 * flip across an axis, turn about the origin) and the fact that each one
 * keeps every length and angle. What is new is a DEFINITION built on them
 * (CCSS 8.G.A.2): two figures are congruent exactly when some sequence of
 * translations, reflections and rotations lands one figure exactly on the
 * other. "Exactly when" cuts both ways, and the lesson works both: to say YES
 * the student writes a chain of motions and pushes every vertex through it
 * one motion at a time, in order, then checks by undoing the chain in
 * reverse; to say NO the student finds one length or angle the two figures
 * do not share, because no rigid motion can change it. The two errors this
 * plan is built to kill: calling a mirror image "not congruent" because it
 * faces the other way (a reflection IS a rigid motion), and calling a bigger
 * same-shaped figure "congruent" because it looks alike (no rigid motion
 * changes a length).
 *
 * SCOPE GUARD: Grade 8 row 8.3 defines congruence by rigid motions,
 * describes a sequence between two given figures, applies it to
 * coordinates, and decides congruence from coordinates. Withholds:
 * correspondence statements, triangle congruence criteria and CPCTC →
 * `geom-u4-congruence-rigid-motions.ts`,
 * `geom-u5-triangle-congruence-criteria.ts`, `geom-u5-cpctc-proofs.ts`.
 * Concretely: no congruence statement with lettered vertices (no "△ABC ≅
 * △DEF", no ≅ at all) is ever written, no criterion (SSS, SAS, ASA) is named
 * or used, and matching side lengths are always called a hint that makes a
 * sequence possible, never a proof — the proof is always the sequence that
 * lands every vertex. The clockwise/counterclockwise vertex-order test for
 * orientation (`geom-u4-reflections.ts`) is never taught; the plan only says,
 * in plain words, that a slide or a turn never flips a figure over, so a
 * mirror image needs a reflection in its chain. Sequences are applied here
 * as the row requires (two motions, in order, order matters) and are never
 * named "compositions" or studied for their own properties (no "two
 * reflections make a rotation"; that is `geom-u4-compositions-symmetry.ts`).
 * Sideways: the words "dilation", "similar" and "scale factor" never appear
 * in any spoken field (the `followUps` loId names row 8.4 and is not prose)
 * — a bigger same-shaped figure is simply "not congruent, because a rigid
 * motion never changes a length" (row 8.4 owns dilations and similarity).
 * Every length in this plan runs along a grid line and is found by
 * subtracting coordinates, the way the distance between two points that
 * share a coordinate is found (`m6math` row 6.3); no slanted length is ever
 * computed, so nothing from row 9.3 or 9.4 (Pythagorean theorem, distance
 * between arbitrary points) is used. Below, assumed and not re-taught: the
 * coordinate rules for translations and reflections across the axes (row
 * 8.1, `m8math-u8-translations-and-reflections.ts`) and for 90°, 180° and
 * 270° counterclockwise rotations about the origin (row 8.2,
 * `m8math-u8-rotations-about-the-origin.ts`), together with the verified
 * fact that each motion keeps every length and angle measure; every rule is
 * recalled in a clause and applied, never derived. Reflections here are
 * across the x-axis or the y-axis only, and rotations are about the origin
 * only. Salvaged from `g8-math-transformations.ts`: the framing "the first
 * three preserve size and shape (rigid motions)" only; its four-in-one
 * compression and its dilation material were left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U8_CONGRUENCE_THROUGH_RIGID_MOTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.congruence-through-rigid-motions.v1',
  title: 'Congruence Through Rigid Motions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.congruence-through-rigid-motions',
      standard: 'M8MATH-8.3',
      description:
        'Two figures are congruent exactly when a sequence of translations, reflections and rotations maps one onto the other; describe such a sequence between two given figures, apply it to coordinates, and decide congruence from coordinates (CCSS 8.G.A.2).',
    },
  ],
  prerequisites: ['m8math.rotations-about-the-origin'],
  followUps: ['m8math.dilations-and-similarity'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that "same size and shape" is really "can be moved onto each other", before the definition is stated.',
      script:
        'In Tetris, every piece gets where it is going by sliding sideways and turning a quarter turn at a time, and the S-piece and the Z-piece count as two different pieces, because the game never lets you flip one over. Cut the two pieces out of paper and you CAN flip one, and it lands exactly on top of the other. Same size, same shape, only facing the other way. That is the whole question of this lesson. Two figures are congruent when the slides, flips and turns you already know how to do on the coordinate plane can carry one figure exactly onto the other. Today you will describe those chains of moves between two figures, run them through the coordinates one motion at a time, and use them to decide, from coordinates alone, whether two figures are congruent or only look alike.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-congruence-by-rigid-motions',
      kind: 'concept',
      goal: 'Define congruence as the existence of a sequence of rigid motions, show how to apply a sequence in order, how to read two figures to choose the motions, and how a yes and a no are each decided from coordinates.',
      keyIdeas: [
        'CONGRUENT MEANS A CHAIN OF RIGID MOTIONS LANDS ONE FIGURE ON THE OTHER — two figures are congruent exactly when some sequence of translations, reflections and rotations maps one figure exactly onto the other, every vertex landing on a vertex. That is the definition, not a feeling that they look alike: the S-piece and the Z-piece are congruent because one flip lays one on top of the other, and you can name the flip.',
        'WHY A CHAIN KEEPS SIZE AND SHAPE — you verified in the last two lessons that a slide, a flip across an axis, and a turn about the origin each keep every length and every angle measure. A chain of them keeps every length and angle too, one motion at a time, so the final image is the same size and the same shape as the original. It only sits somewhere else, and maybe faces another way.',
        'APPLY A SEQUENCE ONE MOTION AT A TIME, IN ORDER — do the first motion to every vertex, write the new coordinates down, then do the second motion to THOSE coordinates, not to the originals. Order matters: take the point (2, 1), translate right 3 to (5, 1), then reflect across the y-axis to (-5, 1). Reflect first instead and (2, 1) goes to (-2, 1), then right 3 lands it on (1, 1), a different point.',
        'READ THE TWO FIGURES BEFORE YOU PICK THE MOVES — compare them side by side. If every side points the same way in both figures, a slide may be all you need. If a side that pointed right now points left, up or down, the figure was flipped or turned, so a reflection or a rotation comes first and a slide finishes the job. A slide or a turn never flips a figure over, so a mirror image always needs a reflection somewhere in the chain.',
        'YES NEEDS A SEQUENCE, NO NEEDS ONE MISMATCH — to show two figures ARE congruent, write a sequence and check that every vertex lands. To show they are NOT, you only need one thing a rigid motion could never change: a side that is 3 units long in one figure and 6 units long in the other, or a right angle that the other figure does not have. Find lengths along the grid lines by subtracting coordinates, the way you find the distance between two points that share a coordinate.',
        'SAME SHAPE IS NOT THE SAME AS CONGRUENT — a figure that is the same shape but bigger is not congruent to the original, because no slide, flip or turn changes a length. A figure that is flipped over IS congruent, because a reflection is a rigid motion. Size and shape both have to match; which way the figure faces does not.',
      ],
      vocabulary: [
        { term: 'rigid motion', definition: 'a translation, a reflection or a rotation; a motion that keeps every length and every angle measure.' },
        { term: 'sequence of rigid motions', definition: 'two or more rigid motions done one after another, each one applied to the result of the one before.' },
        { term: 'congruent', definition: 'two figures are congruent when a sequence of rigid motions maps one exactly onto the other.' },
        { term: 'maps onto', definition: 'lands exactly on top of; a motion maps a figure onto another when every vertex of the image is a vertex of the other figure.' },
        { term: 'image', definition: 'the figure you get after a motion, or after a whole sequence of motions.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_geometry_constructed'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reflect-then-slide',
      kind: 'worked_example',
      problem:
        'Triangle A has vertices (1, 1), (4, 1), (1, 3). Triangle B has vertices (-4, -4), (-1, -4), (-1, -2). Describe a sequence of rigid motions that maps triangle A onto triangle B, apply it to every vertex, and say whether the two triangles are congruent.',
      steps: [
        'Read both figures before choosing any move. Triangle A has its right-angle corner at (1, 1), a horizontal leg of 4 - 1 = 3 running to the right, and a vertical leg of 3 - 1 = 2 running up. Triangle B has its corner at (-1, -4), a horizontal leg of -1 - (-4) = 3 running to the LEFT, and a vertical leg of -2 - (-4) = 2 running up. Same lengths, but the horizontal leg points the opposite way, so B is a mirror image of A.',
        'A slide alone cannot flip a figure over. Try it and see: sliding the corner (1, 1) onto (-1, -4) is left 2 and down 5, which sends (4, 1) to (2, -4), and B has no vertex there. The chain needs a reflection, and since the leg that flips is the horizontal one, reflect across the y-axis first.',
        'Reflect across the y-axis, (x, y) → (-x, y): (1, 1) → (-1, 1), (4, 1) → (-4, 1), (1, 3) → (-1, 3). The horizontal leg now points left, matching B, but the whole figure sits 5 units too high: the corner is at (-1, 1) and needs to be at (-1, -4).',
        'Translate down 5, (x, y) → (x, y - 5), applied to the reflected vertices, not the originals: (-1, 1) → (-1, -4), (-4, 1) → (-4, -4), (-1, 3) → (-1, -2).',
        'Compare with triangle B: (-4, -4), (-1, -4), (-1, -2). All three image vertices land exactly on vertices of B, so the sequence "reflect across the y-axis, then translate down 5" maps A onto B, and the two triangles are congruent.',
        'Check by undoing the chain in reverse order: translate B up 5 to (-4, 1), (-1, 1), (-1, 3), then reflect across the y-axis to (4, 1), (1, 1), (1, 3). That is triangle A, so the chain is right. Other chains also work here, for example sliding down 5 first and reflecting second, and any correct chain is a full proof of congruence.',
      ],
      answer: 'Congruent. Reflect across the y-axis, then translate (x, y) → (x, y - 5); the images are (-1, -4), (-4, -4), (-1, -2), which are the vertices of triangle B.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-decide-from-coordinates',
      kind: 'worked_example',
      problem:
        'Triangle T has vertices (2, 2), (5, 2), (2, 4). Triangle U has vertices (4, 4), (10, 4), (4, 8). Triangle V has vertices (2, 1), (4, 1), (4, 4). Use the coordinates to decide which of U and V is congruent to T, and describe a sequence for the one that is.',
      steps: [
        'Measure T along the grid lines. From the corner (2, 2), the horizontal leg runs to (5, 2), a length of 5 - 2 = 3, and the vertical leg runs to (2, 4), a length of 4 - 2 = 2. The corner is a right angle.',
        'Measure U the same way: horizontal leg 10 - 4 = 6, vertical leg 8 - 4 = 4. WRONG: "U is the same shape as T, just bigger, so they are congruent." CORRECT: a rigid motion never changes a length, so no chain of slides, flips and turns can stretch a leg of 3 into a leg of 6. U is not congruent to T, and there is no sequence to look for.',
        'Measure V: from the corner (4, 1), the horizontal leg runs to (2, 1), a length of 4 - 2 = 2, and the vertical leg runs to (4, 4), a length of 4 - 1 = 3. The same two lengths as T, with the same right angle between them, but the 3 now runs up and down. Matching lengths make congruence possible; a sequence that lands every vertex is what proves it.',
        'In T the leg of 3 points right from the corner, and in V it points up. A quarter turn counterclockwise sends right to up, so start with a 90° rotation about the origin, (x, y) → (-y, x): (2, 2) → (-2, 2), (5, 2) → (-2, 5), (2, 4) → (-4, 2).',
        'The rotated corner is at (-2, 2) and needs to reach (4, 1), which is right 6 and down 1. Translate (x, y) → (x + 6, y - 1), applied to the rotated vertices: (-2, 2) → (4, 1), (-2, 5) → (4, 4), (-4, 2) → (2, 1). Those are exactly the vertices of V, so T and V are congruent.',
        'Check by undoing in reverse: translate V left 6 and up 1, (2, 1) → (-4, 2), (4, 1) → (-2, 2), (4, 4) → (-2, 5), then rotate 270° counterclockwise, (x, y) → (y, -x), the turn that undoes a 90° turn: (-4, 2) → (2, 4), (-2, 2) → (2, 2), (-2, 5) → (5, 2). Those are the vertices of triangle T.',
      ],
      answer: 'V is congruent to T: rotate 90° counterclockwise about the origin, then translate (x, y) → (x + 6, y - 1). U is not congruent to T, because its legs are 6 and 4 while the legs of T are 3 and 2.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-sequence',
      kind: 'try_yourself',
      problem:
        'Triangle C has vertices (1, 1), (3, 1), (1, 4). Triangle D has vertices (5, -1), (7, -1), (5, -4). Which sequence of rigid motions maps triangle C onto triangle D?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Translate (x, y) → (x + 4, y - 2)' },
        { id: 'b', text: 'Reflect across the y-axis, then translate (x, y) → (x + 6, y - 2)' },
        { id: 'c', text: 'Rotate 180° about the origin, then translate (x, y) → (x + 6, y)' },
        { id: 'd', text: 'Reflect across the x-axis, then translate (x, y) → (x + 4, y)', correct: true },
      ],
      expectedAnswer: 'Reflect across the x-axis, then translate (x, y) → (x + 4, y)',
      hints: [
        'Compare the figures first. In triangle C the vertical leg goes UP from the corner (1, 1); in triangle D it goes DOWN from the corner (5, -1), while the horizontal leg still points right in both. A slide alone cannot turn up into down, so the chain needs a flip or a turn, and it has to leave the horizontal leg pointing right.',
        'Apply each candidate to all three vertices, not just the corner. Reflecting across the x-axis sends (1, 1), (3, 1), (1, 4) to (1, -1), (3, -1), (1, -4); then find the slide that carries (1, -1) to (5, -1) and check that the other two vertices land on vertices of D too.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-triangle-is-congruent',
      kind: 'try_yourself',
      problem: 'Triangle P has vertices (0, 0), (4, 0), (0, 2). Which triangle is congruent to triangle P?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(0, 0), (8, 0), (0, 4)' },
        { id: 'b', text: '(-3, 1), (-3, 5), (-5, 1)', correct: true },
        { id: 'c', text: '(1, 1), (5, 1), (1, 4)' },
        { id: 'd', text: '(1, 1), (5, 1), (3, 3)' },
      ],
      expectedAnswer: '(-3, 1), (-3, 5), (-5, 1)',
      hints: [
        'Measure P along the grid lines: a leg of 4 and a leg of 2 with a right angle between them. A rigid motion keeps every length and every angle, so a congruent triangle must have exactly those two legs and that right angle, possibly turned or flipped.',
        'Rule out any triangle with a leg that is not 4 or 2, and any triangle whose corner is not a right angle. For the one that is left, a 90° counterclockwise rotation about the origin followed by a slide lands every vertex of P on it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-two-step-image',
      kind: 'try_yourself',
      problem:
        'Triangle J has a vertex at (4, -1). Triangle J is reflected across the y-axis, then translated (x, y) → (x - 3, y + 2). What is the x-coordinate of the image of that vertex? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-7',
      hints: [
        'Do the motions in the order they are listed, and write the coordinates down after each one. Reflecting across the y-axis changes the sign of the x-coordinate only, so (4, -1) becomes (-4, -1).',
        'Now apply the translation to THAT point, not to the original: subtract 3 from its x-coordinate and add 2 to its y-coordinate. Report only the x-coordinate of the result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flipped-and-bigger',
      kind: 'misconception_check',
      question:
        'Triangle M has vertices (2, 1), (5, 1), (2, 3). Dev looks at triangle N with vertices (-2, 1), (-5, 1), (-2, 3) and says N cannot be congruent to M because N is flipped the other way. Lena looks at a triangle with vertices (2, 2), (8, 2), (2, 6) and says it is congruent to M because it is exactly the same shape. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'N is not congruent to M, because N faces the other way.',
          misconception: 'Treating a mirror image as a different figure, as if congruent figures had to face the same way, when a reflection is a rigid motion.',
          correctsTo:
            'Reflect M across the y-axis, (x, y) → (-x, y): (2, 1) → (-2, 1), (5, 1) → (-5, 1), (2, 3) → (-2, 3). Those are exactly the vertices of N, so one reflection maps M onto N, and a single reflection counts as a sequence of rigid motions. M and N are congruent. Facing the other way never breaks congruence; your left hand and your right hand are the same size and shape and still mirror each other.',
        },
        {
          answer: 'The triangle with vertices (2, 2), (8, 2), (2, 6) is congruent to M, because it is the same shape.',
          misconception: 'Reading "same shape" as congruent, when congruent needs the same size as well, and no rigid motion changes a length.',
          correctsTo:
            'Measure along the grid lines. The legs of M are 5 - 2 = 3 and 3 - 1 = 2. The legs of the other triangle are 8 - 2 = 6 and 6 - 2 = 4. A slide, a flip or a turn keeps every length, so no chain of them can turn a leg of 3 into a leg of 6. There is no sequence to find, and the triangles are not congruent, no matter how alike they look.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two figures are congruent exactly when a sequence of translations, reflections and rotations maps one onto the other, every vertex landing on a vertex.',
        'Apply a sequence one motion at a time, in the order given, and feed each new set of coordinates into the next motion. Order matters.',
        'Read the figures first: a side that changed direction means a flip or a turn comes before the slide, and a mirror image always needs a reflection.',
        'To say yes, write the sequence and check every vertex. To say no, find one length or one angle the two figures do not share, because rigid motions never change those.',
        'Same shape but a different size is not congruent; flipped over is still congruent.',
        'Check a chain by undoing it in reverse order and landing back on the original figure.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Congruence Through Rigid Motions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
