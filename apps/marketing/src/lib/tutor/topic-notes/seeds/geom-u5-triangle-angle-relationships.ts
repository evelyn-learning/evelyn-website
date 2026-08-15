/**
 * Geometry — Unit 5 CED 5.1: Triangle Angle Sum & Exterior Angles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.triangle-angle-relationships.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U5_TRIANGLE_ANGLE_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.triangle-angle-relationships.v1',
  course: 'Geometry',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Triangle Angle Sum & Exterior Angles',
  planId: 'evelyn.hs.geom.triangle-angle-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.triangle-angle-relationships.v1' }],
  theory: [
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Triangle angle sum', content: `TRIANGLE ANGLE SUM — the three interior angles of ANY triangle sum to 180°. In △ABC: m∠A + m∠B + m∠C = 180°. It holds for skinny, wide, right, and obtuse triangles alike — there are no exceptions to check.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Why it is true', content: `WHY IT IS TRUE — draw a line through vertex A parallel to side BC. The two outer angles at A are alternate interior angles with ∠B and ∠C, so they equal them. Together with ∠A they form a straight angle at A: 180°. The parallel-line rules from Unit 3 are what prove it.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Exterior angle', content: `EXTERIOR ANGLE — extend one side of a triangle past a vertex. The angle between that extension and the other side at the vertex is an exterior angle. It forms a LINEAR PAIR with the interior angle at that same vertex, so exterior + adjacent interior = 180°.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Exterior angle theorem', content: `EXTERIOR ANGLE THEOREM — an exterior angle equals the SUM of the two REMOTE interior angles, the two that do not touch it. This is a one-step shortcut: no need to find the third interior angle first.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — WRONG PAIR. The remote angles are the two at the OTHER vertices. Including the adjacent interior angle (the one right next to the exterior angle) is the single most common slip; that angle is SUPPLEMENTARY to the exterior angle, not part of the sum.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — REPORTING x. With algebraic angles like (2x + 10)°, solving the equation gives x, not an angle measure. Substitute back. A fast check: the three angle values must add to 180°.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — 180 vs 360. A triangle sums to 180°; a quadrilateral sums to 360°, and so does a full turn around a point. Using 360° for a triangle is the most common set-up mistake.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'framework', title: 'Third angle theorem', content: `THIRD ANGLE THEOREM — if two angles of one triangle equal two angles of another, the third pair must be equal too, since all three sum to the same 180°. That is what makes AAS a real congruence criterion in the next lesson.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'definition', title: 'exterior angle', content: `the angle formed outside a triangle between one extended side and the adjacent side at that vertex.` },
    { loId: 'geom.triangle-angle-relationships', kind: 'definition', title: 'remote interior angles', content: `the two interior angles of a triangle that are NOT adjacent to a given exterior angle.` },
  ],
  methods: [
    {
      title: 'Worked algebraic angle sum',
      steps: [
        `Write the angle-sum equation before any arithmetic: (2x + 10) + (3x − 15) + (x + 5) = 180.`,
        `Combine like terms: the x terms give 2x + 3x + x = 6x; the constants give 10 − 15 + 5 = 0. So 6x = 180.`,
        'Divide by 6: x = 30. Stop — x is not an angle. Substitute back.',
        'm∠A = 2(30) + 10 = 70°, m∠B = 3(30) − 15 = 75°, m∠C = 30 + 5 = 35°.',
        'Check: 70 + 75 + 35 = 180. ✓ The three measures spend the full budget.',
      ],
      example: { problem: `In △ABC, m∠A = (2x + 10)°, m∠B = (3x − 15)°, and m∠C = (x + 5)°. Find the measure of each angle.`, solution: 'm∠A = 70°, m∠B = 75°, m∠C = 35°' },
      relatedLoIds: ['geom.triangle-angle-relationships'],
    },
    {
      title: 'Worked exterior wrong pair',
      steps: [
        `Locate the exterior angle: because QR is extended past R, ∠PRS sits outside the triangle at vertex R and is adjacent to the interior angle ∠PRQ.`,
        `Identify the REMOTE interior angles — the two that do not touch ∠PRS. Those are ∠P (47°) and ∠Q (68°), at the other two vertices.`,
        'Exterior Angle Theorem: m∠PRS = 47 + 68 = 115°.',
        `Find the error: the interior angle at R is 180 − 47 − 68 = 65°, and the student added 68 + 65 = 133 — pairing a remote angle with the ADJACENT interior angle instead of using the two remote ones.`,
        `Verify with the linear pair: the exterior angle and its adjacent interior angle must sum to 180°. 115 + 65 = 180 ✓, while 133 + 65 = 198 ✗ — the wrong answer was catchable in one line.`,
      ],
      example: { problem: `In △PQR, m∠P = 47° and m∠Q = 68°. Side QR is extended beyond R to a point S, forming exterior angle ∠PRS. A student answers 133°. Find the correct measure and explain the error.`, solution: `m∠PRS = 115° — the remote interior angles are ∠P and ∠Q, not the adjacent interior angle at R` },
      relatedLoIds: ['geom.triangle-angle-relationships'],
    },
  ],
  pointers: [
    { content: `The remote interior angles are the two that do not touch the exterior angle: ∠M and ∠N. So m∠NPQ = 40 + 75 = 115°. The adjacent angle at P is supplementary to the exterior angle, never added to it — and 115 + 65 = 180 confirms it.`, kind: 'common-error' },
    { content: `Every triangle spends exactly 180° across its three interior angles — provable from the parallel-line angle rules.`, kind: 'tip' },
    { content: `An exterior angle equals the SUM of the two REMOTE interior angles (the two that do not touch it).`, kind: 'tip' },
    { content: `An exterior angle and its adjacent interior angle form a linear pair: they sum to 180°. Use that as a one-line answer check.`, kind: 'tip' },
    { content: `With algebraic angles, solve for x and then substitute back — x is almost never the answer, and the three measures must total 180°.`, kind: 'tip' },
    { content: `The two remote interior angles are the ones at the **other two vertices** — never the interior angle sitting next to the exterior angle. That adjacent one is supplementary to the exterior angle, so it's *subtracted from 180*, not added.`, kind: 'common-error' },
    { content: `After solving for x in angles like (2x + 10)°, **substitute back**. x = 30 is not an angle measure. Then add your three answers: they must hit exactly 180°.`, kind: 'common-error' },
    { content: `Check any exterior-angle answer in one line: exterior + adjacent interior must equal 180°. If you get 133° with a 65° interior angle, 133 + 65 = 198 ✗ — catch it before you write the answer.`, kind: 'tip' },
    { content: `180° is for a triangle's three interior angles. Don't reach for 360° — that's a quadrilateral or a full turn around a point. Wrong total means every angle in the problem comes out wrong.`, kind: 'gotcha' },
    { content: `Say "exterior angle" only for the angle between an **extended side** and the adjacent side. The angle vertically opposite it and the reflex angle outside the triangle are not what the theorem is about — read which side is extended and past which vertex.`, kind: 'vocab-note' },
    { content: `The angle sum holds for **every** triangle — skinny, obtuse, right, huge, tiny. There is no case to check and no triangle that 'breaks the rule'. Two angles of 90° each is impossible for that reason.`, kind: 'edge-case' },
    { content: `The proof of the 180° sum rests on **alternate interior angles** with a line through one vertex parallel to the opposite side. If asked *why*, cite the parallel-line rules — don't just say "because it's a triangle."`, kind: 'tip' },
    { content: `Third Angle Theorem gives equal third angles only when **two full angle pairs** match. Two matching angles plus a matching side is AAS; matching angles alone never prove the triangles are the same size.`, kind: 'gotcha' },
  ],
};
