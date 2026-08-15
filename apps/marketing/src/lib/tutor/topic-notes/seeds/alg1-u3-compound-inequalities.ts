/**
 * Algebra 1 — Unit 3 CED 3.2: Compound Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.compound-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U3_COMPOUND_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.compound-inequalities.v1',
  course: 'Algebra 1',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Compound Inequalities',
  planId: 'evelyn.hs.alg1.compound-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.compound-inequalities.v1' }],
  theory: [
    { loId: 'alg1.compound-inequalities', content: `A COMPOUND INEQUALITY is two inequalities joined by AND or OR. Solve each piece separately first — the joining word only decides what you do with the two answers.` },
    { loId: 'alg1.compound-inequalities', content: `AND = INTERSECTION — keep only the values that satisfy BOTH pieces. x > 2 AND x < 7 keeps the overlap: 2 < x < 7, a band between two boundaries.` },
    { loId: 'alg1.compound-inequalities', content: `OR = UNION — keep every value that satisfies EITHER piece. x < −1 OR x > 5 keeps both outer rays; the numbers in between are not solutions.` },
    { loId: 'alg1.compound-inequalities', kind: 'framework', title: 'Three-part form', content: `THREE-PART FORM — an AND whose pieces share a middle can be written once: 2 < x < 7. Read it left to right, smallest to largest. Only AND is ever written this way; an OR must stay as two statements.` },
    { loId: 'alg1.compound-inequalities', kind: 'framework', title: 'The all-three rule', content: `THE ALL-THREE RULE — whatever you do to a three-part inequality, do it to all three parts. For −3 < 2x + 1 ≤ 7 you subtract 1 from the left, the middle AND the right.` },
    { loId: 'alg1.compound-inequalities', kind: 'framework', title: 'The flip rule still applies', content: `THE FLIP RULE STILL APPLIES — multiplying or dividing by a NEGATIVE flips every inequality sign in the statement, and a three-part inequality then reads backwards, so rewrite it smallest-to-largest.` },
    { loId: 'alg1.compound-inequalities', kind: 'framework', title: 'Graphing', content: `GRAPHING — open circle for < or >, closed circle for ≤ or ≥. AND shades the segment BETWEEN the two circles; OR shades two arrows pointing AWAY from each other.` },
    { loId: 'alg1.compound-inequalities', kind: 'framework', title: 'The two extreme cases', content: `THE TWO EXTREME CASES — an AND whose pieces never overlap (x > 4 AND x < 3) has NO solution; an OR whose pieces cover everything (x < 4 OR x > 3) is ALL real numbers.` },
    { loId: 'alg1.compound-inequalities', kind: 'definition', title: 'intersection', content: 'the values shared by both solution sets — what AND keeps.' },
    { loId: 'alg1.compound-inequalities', kind: 'definition', title: 'union', content: 'the values in either solution set — what OR keeps.' },
  ],
  methods: [
    {
      title: 'Worked three part',
      steps: [
        `This is an AND written in three-part form: 2x + 1 is greater than −3 and at the same time less than or equal to 7.`,
        'Subtract 1 from ALL THREE parts: −4 < 2x ≤ 6.',
        'Divide ALL THREE parts by 2 (positive, so no flip): −2 < x ≤ 3.',
        'Graph: open circle at −2, closed circle at 3, shade the segment between them.',
        `Check the ends. x = 3: 2(3) + 1 = 7 and 7 ≤ 7 ✓ so 3 is in. x = −2: 2(−2) + 1 = −3 and −3 < −3 is false ✓ so −2 is out.`,
      ],
      example: { problem: 'Solve and graph: −3 < 2x + 1 ≤ 7', solution: '−2 < x ≤ 3' },
      relatedLoIds: ['alg1.compound-inequalities'],
    },
    {
      title: 'Worked negative flip',
      steps: [
        `Subtract 10 from all three parts: −6 ≤ −2x < 6. (Subtracting never flips anything.)`,
        `Divide all three parts by −2. Dividing by a NEGATIVE flips BOTH signs: 3 ≥ x > −3.`,
        `That statement is true but written backwards. Rewrite it smallest to largest: −3 < x ≤ 3.`,
        `Watch the endpoints travel with their signs: the ≤ that started on the left is now attached to the 3 on the right.`,
        `Check x = 3: 10 − 2(3) = 4, and 4 ≤ 4 ✓. Check x = −3: 10 − 2(−3) = 16, and 16 < 16 is false ✓ so −3 is correctly excluded.`,
      ],
      example: { problem: 'Solve: 4 ≤ 10 − 2x < 16', solution: '−3 < x ≤ 3' },
      relatedLoIds: ['alg1.compound-inequalities'],
    },
  ],
  pointers: [
    { content: `Three-part notation means AND, so 4 < x < −2 claims x is bigger than 4 and smaller than −2 at once — impossible. An OR whose rays point away from each other must stay two statements: x < −2 or x > 4.`, kind: 'common-error' },
    { content: `Every operation hits all three parts: −3 − 1 < 2x + 1 − 1 ≤ 7 − 1 gives −4 < 2x ≤ 6, and dividing all three by 2 gives −2 < x ≤ 3.`, kind: 'common-error' },
    { content: 'Solve each piece separately; the joining word decides what happens next.', kind: 'tip' },
    { content: `AND keeps the overlap (a band, or nothing at all); OR keeps both pieces (two rays, or everything).`, kind: 'tip' },
    { content: 'Three-part form is AND only — do every operation to all three parts.', kind: 'tip' },
    { content: `Dividing or multiplying by a negative flips every sign, then rewrite smallest to largest.`, kind: 'tip' },
    { content: `Graph: open circle for < or >, closed for ≤ or ≥; shade between for AND, outward for OR.`, kind: 'tip' },
    { content: `Never write an OR answer in three-part form. \`4 < x < −2\` is nonsense — it claims x is above 4 and below −2 at once. OR solutions stay as two statements joined by "or": \`x < −2 or x ≥ 5\`.`, kind: 'common-error' },
    { content: `In three-part form, every operation hits **all three** parts. Subtracting 1 only from the middle of −3 < 2x + 1 ≤ 7 gives the wrong \`−3 < 2x ≤ 7\`. Correct: −4 < 2x ≤ 6.`, kind: 'common-error' },
    { content: `When you divide a three-part inequality by a negative, flip **both** signs and let each endpoint keep its own sign. 3 ≥ x > −3 rewritten smallest-to-largest is −3 < x ≤ 3 — the ≤ travels with the 3, not with the left side.`, kind: 'gotcha' },
    { content: `Check whether an AND actually overlaps before writing an answer. x > 4 AND x < 3 is **no solution**, not \`4 < x < 3\`. Likewise an OR can cover everything: x < 4 OR x > 3 is all real numbers.`, kind: 'edge-case' },
    { content: `Say "intersection" for AND and "union" for OR, and match them to the picture: AND shades the segment *between* the circles, OR shades two arrows pointing *away* from each other. If your AND graph has two arrows, you used the wrong word.`, kind: 'vocab-note' },
    { content: `Circle type is decided by the symbol, not by the joining word: open for < or >, closed for ≤ or ≥. A single problem can have one open and one closed circle, like −2 < x ≤ 3.`, kind: 'tip' },
    { content: `Test both endpoints in the ORIGINAL inequality when you finish. For −2 < x ≤ 3: x = 3 gives 7 ≤ 7 ✓ (in), x = −2 gives −3 < −3 ✗ (out). This catches flipped signs and dropped strictness instantly.`, kind: 'tip' },
    { content: `If a question asks how many **integers** are in the solution, list them — don't subtract the endpoints. For −1 ≤ x < 5 the integers are −1, 0, 1, 2, 3, 4 → 6 values, and whether an endpoint is open or closed changes the count.`, kind: 'edge-case' },
  ],
};
