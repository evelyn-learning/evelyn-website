/**
 * Digital SAT — Unit 4 CED 4.2: Lines, Angles & Triangles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.lines-angles-triangles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U4_LINES_ANGLES_TRIANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.lines-angles-triangles.v1',
  course: 'Digital SAT',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Lines, Angles & Triangles',
  planId: 'evelyn.testprep.dsat.lines-angles-triangles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.lines-angles-triangles.v1' }],
  theory: [
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Triangle angle sum', content: `TRIANGLE ANGLE SUM — the three interior angles of any triangle sum to 180°. EXTERIOR ANGLE THEOREM — an exterior angle of a triangle equals the SUM of the two remote (non-adjacent) interior angles. Both are faster than solving for the third angle first.` },
    { loId: 'dsat.lines-angles-triangles', content: `VERTICAL ANGLES (opposite angles at a crossing) are always EQUAL. A LINEAR PAIR (two angles that share a side and form a straight line) is always SUPPLEMENTARY (sums to 180°). Neither of these needs the lines to be parallel.` },
    { loId: 'dsat.lines-angles-triangles', content: `PARALLEL LINES + TRANSVERSAL — when two lines are explicitly parallel, a transversal crossing both creates 8 angles with fixed relationships: CORRESPONDING angles equal, ALTERNATE INTERIOR angles equal, ALTERNATE EXTERIOR angles equal, SAME-SIDE (co-interior) angles supplementary.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Trap', content: `TRAP — ASSUMING PARALLEL WITHOUT BEING TOLD. The corresponding/alternate/same-side rules ONLY apply when the problem states the lines are parallel (or gives you information that forces it). A figure described as "two lines crossed by a transversal" with no parallel statement gives you ONLY the vertical-angle and linear-pair facts — nothing more.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Similar triangles', content: `SIMILAR TRIANGLES — the AA criterion is enough: if two angles of one triangle equal two angles of another, the triangles are similar and ALL corresponding sides are proportional. A line drawn parallel to one side of a triangle, cutting the other two sides, always creates a smaller triangle similar to the original (shared angle + corresponding angles from the parallel line).` },
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Trap', content: `TRAP — MISMATCHED CORRESPONDENCE. When writing a similar-triangle proportion, match vertices in the SAME relative order on both sides (e.g., use the FULL side of the big triangle against the FULL side of the small triangle — not a partial segment against the full side). Get the correspondence from which angles are equal, not from which sides "look like" they line up.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Trap', content: `TRAP — EXTERIOR ANGLE MISCOUNT. The exterior angle theorem uses the two interior angles NOT adjacent to it. Adding the wrong pair (including the adjacent interior angle, which is actually supplementary to the exterior angle) is the most common slip.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'framework', title: 'Reading the description', content: `READING THE DESCRIPTION — since there is no image, restate the figure to yourself in one sentence before solving: which lines are parallel (if any), which angle or side is given, and which is asked for. That sentence IS the setup.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'definition', title: 'transversal', content: `a line that crosses two or more other lines, creating angle pairs at each crossing.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'definition', title: 'corresponding angles', content: `angles in the same relative position at each crossing of a transversal with two lines — equal when the lines are parallel.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'definition', title: 'alternate interior angles', content: `angles between two lines, on opposite sides of the transversal — equal when the lines are parallel.` },
    { loId: 'dsat.lines-angles-triangles', kind: 'definition', title: 'similar triangles', content: `triangles with equal corresponding angles and proportional corresponding sides (AA is enough to establish it).` },
  ],
  methods: [
    {
      title: 'Worked parallel transversal',
      steps: [
        `The lines are explicitly parallel, so corresponding angles are equal: 3x + 7 = 112.`,
        'Subtract 7: 3x = 105.',
        'Divide by 3: x = 35.',
        `Sense-check: 3(35) + 7 = 112. ✓ Matches the given angle, as corresponding angles must.`,
      ],
      example: { problem: `Lines p and q are parallel and are cut by a transversal. At the point where the transversal crosses line p, one of the angles formed measures 112°. At the point where it crosses line q, the angle in the corresponding position measures (3x + 7)°. What is the value of x?`, solution: 'x = 35' },
      relatedLoIds: ['dsat.lines-angles-triangles'],
    },
    {
      title: 'Worked similar triangle trap',
      steps: [
        `DE is parallel to BC, and angle A is shared by both triangles, so triangle ADE is similar to triangle ABC by AA.`,
        `TRAP: DB = 6 is only the segment from D to B, not the full side AB. Using AD/DB = DE/BC would be the mismatched-correspondence trap — DB is not the side that corresponds to BC.`,
        `The correct correspondence uses the FULL sides: A↔A, D↔B, E↔C, so the proportion is AD/AB = DE/BC. First find AB: AB = AD + DB = 4 + 6 = 10.`,
        'Set up the proportion: 4/10 = 10/BC.',
        'Cross-multiply: 4 · BC = 100, so BC = 25.',
      ],
      example: { problem: `In triangle ABC, point D lies on side AB and point E lies on side AC, with segment DE parallel to side BC. AD = 4, DB = 6, and DE = 10. What is the length of BC?`, solution: 'BC = 25' },
      relatedLoIds: ['dsat.lines-angles-triangles'],
    },
  ],
  pointers: [
    { content: `Alternate interior angles are equal ONLY when the two lines are parallel. Without that statement (or information that forces it, like both lines being perpendicular to a third line), all you can use are the rules that never need parallel lines: vertical angles are equal, and a linear pair is supplementary. The angle cannot be determined from the given information alone.`, kind: 'common-error' },
    { content: `Triangle interior angles sum to 180°; an exterior angle equals the sum of the two remote (non-adjacent) interior angles.`, kind: 'tip' },
    { content: `Vertical angles are always equal and a linear pair is always supplementary — no parallel lines required. Corresponding, alternate interior/exterior equal, and same-side supplementary ONLY apply when the lines are stated (or provably) parallel.`, kind: 'tip' },
    { content: `Similar triangles (AA is enough) have proportional corresponding sides — match vertices by equal angles, and use FULL sides, not partial segments, in the proportion.`, kind: 'tip' },
    { content: `Since figures are described in words, restate the setup in one sentence before solving: what is parallel, what is given, what is asked.`, kind: 'tip' },
    { content: `Watch for "corresponding" vs "same-side interior." Corresponding angles are EQUAL; same-side (co-interior) angles are SUPPLEMENTARY. On the SAT these appear in near-identical sentences — the only difference is the phrase "on the same side of the transversal." Read that clause before setting up.`, kind: 'gotcha' },
    { content: `Similarity ratios scale SIDES linearly, not areas. If asked for the area of a similar triangle, square the side ratio (3:5 sides ⇒ 9:25 areas). Answer choices often include the un-squared ratio as bait.`, kind: 'common-error' },
    { content: `An exterior angle question can be answered two ways: sum of the two remote interiors, OR 180° minus the adjacent interior. Both give the same number — use one and check with the other. If your two methods disagree, you grabbed the wrong pair.`, kind: 'tip' },
    { content: `"Similar to" ≠ "congruent to." Similar means same shape, ratio k; congruent means k = 1. Also, the naming order in "triangle PQR ~ triangle STU" is the correspondence — P↔S, Q↔T, R↔U — so PQ/ST = QR/TU. Never re-pair by side length size.`, kind: 'vocab-note' },
    { content: `In an isosceles triangle problem, the two BASE angles are equal — the angle between the equal sides (vertex angle) is the odd one out. "AB = AC" means angles B and C are equal, not A and B.`, kind: 'edge-case' },
    { content: `Lines being perpendicular to the SAME line forces them parallel — that's information that legitimately unlocks the transversal rules. But two lines each making a 90° angle with *different* lines proves nothing. Check what the right angles are measured against.`, kind: 'edge-case' },
    { content: `When a segment splits a triangle parallel to one side, the small triangle's side corresponds to the FULL big side — never to a leftover piece. AD/AB = DE/BC, not AD/DB. The piece-to-piece ratio AD/DB only equals AE/EC (side splitter), never a ratio involving DE or BC.`, kind: 'gotcha' },
    { content: `If a question gives only two lines and a transversal with no parallel claim, the answer may be "cannot be determined" — or the question will only ask about vertical/linear-pair angles. Before solving, underline the word "parallel"; if it isn't there, it isn't true.`, kind: 'tip' },
  ],
};
