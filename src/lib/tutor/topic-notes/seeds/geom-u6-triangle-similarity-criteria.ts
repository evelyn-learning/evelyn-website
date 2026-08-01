/**
 * Geometry — Unit 6 CED 6.3: Triangle Similarity: AA, SSS & SAS.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.triangle-similarity-criteria.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U6_TRIANGLE_SIMILARITY_CRITERIA: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.triangle-similarity-criteria.v1',
  course: 'Geometry',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Triangle Similarity: AA, SSS & SAS',
  planId: 'evelyn.hs.geom.triangle-similarity-criteria.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.triangle-similarity-criteria.v1' }],
  theory: [
    { loId: 'geom.triangle-similarity-criteria', kind: 'framework', title: 'What similar means', content: `WHAT SIMILAR MEANS — △ABC ~ △DEF says corresponding angles are EQUAL and corresponding sides are PROPORTIONAL: AB/DE = BC/EF = CA/FD = k. The letter order carries the matching, exactly as it does for ≅: A↔D, B↔E, C↔F.` },
    { loId: 'geom.triangle-similarity-criteria', content: `AA — two pairs of equal angles prove similarity. The third pair comes free, because the angles of every triangle sum to 180°. This is the criterion you will reach for nine times out of ten, and it has NO congruence twin: angles fix shape, never size.` },
    { loId: 'geom.triangle-similarity-criteria', kind: 'framework', title: 'Sss similarity', content: `SSS SIMILARITY — all three pairs of corresponding sides in the SAME ratio. Pair them by position: longest with longest, shortest with shortest. Compute all three ratios and check they agree before you claim it.` },
    { loId: 'geom.triangle-similarity-criteria', kind: 'framework', title: 'Sas similarity', content: `SAS SIMILARITY — two pairs of sides in the same ratio AND the INCLUDED angle equal. Included still means between: in △ABC, ∠B sits between AB and BC. A non-included angle (SSA) proves nothing here either.` },
    { loId: 'geom.triangle-similarity-criteria', content: `THE SCALE FACTOR k — once similarity is established, k multiplies EVERY length: sides, altitudes, medians, perimeter. If k = 2.5 going from △ABC to △DEF, then every length in △DEF is 2.5 times its partner in △ABC.` },
    { loId: 'geom.triangle-similarity-criteria', content: `ERROR 1: DIFFERENCES INSTEAD OF RATIOS — sides 4, 6, 8 and 6, 8, 10 are NOT similar even though each side grew by 2. Similarity is multiplicative, never additive: check 6/4, 8/6, 10/8 and watch them disagree.` },
    { loId: 'geom.triangle-similarity-criteria', content: `ERROR 2: NOT ENOUGH ANGLES — one pair of equal angles is not AA. Two right triangles both have a 90° angle and can still be wildly different shapes. You need a SECOND pair of equal angles, or a pair of proportional sides around the one you have.` },
    { loId: 'geom.triangle-similarity-criteria', content: `CONGRUENCE IS THE k = 1 CASE — SSS and SAS congruence are just these criteria with the ratio locked at 1. Similar triangles with any pair of corresponding sides equal are congruent.` },
    { loId: 'geom.triangle-similarity-criteria', kind: 'definition', title: 'scale factor', content: `the constant ratio k between every pair of corresponding lengths in two similar figures.` },
    { loId: 'geom.triangle-similarity-criteria', kind: 'definition', title: 'included angle', content: `the angle formed by (between) two given sides of a triangle — the angle SAS similarity requires.` },
  ],
  methods: [
    {
      title: 'Worked aa angle sum',
      steps: [
        `Only one pair matches on sight — ∠B = ∠E = 63°. One pair is not AA, so recover a missing angle first.`,
        'Angle sum in △ABC: ∠C = 180° - 52° - 63° = 65°.',
        'Now ∠C = ∠F = 65°, giving a second matching pair — that is AA.',
        `Fix the correspondence from the equal angles: A↔D, B↔E, C↔F. Check it: ∠D = 180° - 63° - 65° = 52° = ∠A. ✓`,
        'Write the statement in that order: △ABC ~ △DEF by AA.',
      ],
      example: { problem: `In △ABC, ∠A = 52° and ∠B = 63°. In △DEF, ∠E = 63° and ∠F = 65°. Are the two triangles similar? If so, by which criterion, and written in which order?`, solution: 'Yes — △ABC ~ △DEF by AA (after finding ∠C = 65°).' },
      relatedLoIds: ['geom.triangle-similarity-criteria'],
    },
    {
      title: 'Worked ratio not difference',
      steps: [
        'Pair the sides by size: 4 with 6, 6 with 8, 8 with 10.',
        'Compute each ratio: 6/4 = 1.5, 8/6 ≈ 1.33, 10/8 = 1.25.',
        `The three ratios disagree, so SSS similarity fails — the triangles are not similar. Adding the same amount to every side changes the shape, because 2 is a big jump next to 4 and a small one next to 8.`,
        `Similarity needs one constant MULTIPLIER. Scale △PQR by k = 1.5: 4 × 1.5 = 6, 6 × 1.5 = 9, 8 × 1.5 = 12.`,
        `So a triangle with sides 6, 9, 12 is similar to △PQR by SSS similarity, with scale factor 1.5.`,
      ],
      example: { problem: `A classmate claims △PQR with sides 4, 6, 8 is similar to △STU with sides 6, 8, 10, "because every side grew by 2." Is the claim right? And what side lengths WOULD make a triangle similar to △PQR?`, solution: `The claim is wrong — the ratios 1.5, 1.33 and 1.25 disagree. Sides 6, 9, 12 (k = 1.5) would be similar.` },
      relatedLoIds: ['geom.triangle-similarity-criteria'],
    },
  ],
  pointers: [
    { content: `AA needs TWO pairs of equal angles. A 90°-45°-45° triangle and a 90°-20°-70° triangle both have a right angle and look nothing alike. Find a second equal angle pair, or show the legs around the right angle are proportional and use SAS similarity.`, kind: 'common-error' },
    { content: `Three criteria: AA (two equal angle pairs), SSS similarity (all three side ratios equal), SAS similarity (two side ratios equal plus the INCLUDED angle).`, kind: 'tip' },
    { content: `AA is the workhorse — the third angle is forced by the 180° sum — and it never proves congruence, only shape.`, kind: 'tip' },
    { content: `Compare sides by RATIO, never by difference: 4, 6, 8 and 6, 8, 10 are not similar.`, kind: 'tip' },
    { content: `One scale factor k multiplies every corresponding length; k = 1 is exactly congruence.`, kind: 'tip' },
    { content: `Use \`~\` for similar and \`≅\` for congruent — they are not interchangeable. Writing △ABC ≅ △DEF when you only proved AA claims equal SIZE, which angles can never give you.`, kind: 'vocab-note' },
    { content: `There is no "AA congruence" and no "AAA similarity criterion" you need — two angle pairs is already enough, since the third is forced by the 180° sum. Don't hunt for a third angle, and don't use AA to claim congruence.`, kind: 'gotcha' },
    { content: `One pair of equal angles is NEVER AA — including two right angles. A 90-45-45 and a 90-20-70 triangle share a right angle and are not similar. Get a second angle pair, or proportional sides around the angle you have (SAS).`, kind: 'common-error' },
    { content: `Test sides by RATIO, not difference. Adding 2 to every side (4,6,8 → 6,8,10) fails: 6/4, 8/6, 10/8 disagree. Compute all three ratios and confirm they're equal before writing SSS ~.`, kind: 'common-error' },
    { content: `For SAS similarity the angle must sit BETWEEN the two sides you used. In △ABC, ∠B is included by AB and BC. If the equal angle isn't between the proportional pair (SSA), you have proved nothing.`, kind: 'gotcha' },
    { content: `Letter order in △ABC ~ △DEF IS the correspondence: A↔D, B↔E, C↔F. Set up ratios from that matching (AB/DE = BC/EF), not by which sides look similar in the picture — especially when a triangle is rotated or flipped.`, kind: 'common-error' },
    { content: `Before pairing sides for SSS, sort each triangle: longest with longest, shortest with shortest. Comparing sides in the order they happen to be listed is how ratios 'disagree' on genuinely similar triangles.`, kind: 'tip' },
    { content: `k scales EVERY length — altitudes, medians, perimeter — but be clear which direction you're going: k from △ABC to △DEF is the reciprocal of k from △DEF to △ABC. And k = 1 means congruent.`, kind: 'edge-case' },
  ],
};
