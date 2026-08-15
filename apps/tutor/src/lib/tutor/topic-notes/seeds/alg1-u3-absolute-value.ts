/**
 * Algebra 1 — Unit 3 CED 3.3: Absolute-Value Equations & Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.absolute-value.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U3_ABSOLUTE_VALUE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.absolute-value.v1',
  course: 'Algebra 1',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Absolute-Value Equations & Inequalities',
  planId: 'evelyn.hs.alg1.absolute-value.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.absolute-value.v1' }],
  theory: [
    { loId: 'alg1.absolute-value', kind: 'framework', title: 'Absolute value is distance', content: `ABSOLUTE VALUE IS DISTANCE — |x| is how far x sits from 0 on the number line, so it is never negative. Read |x − 5| as "the distance between x and 5" and |x + 5| as "the distance between x and −5", since x + 5 = x − (−5).` },
    { loId: 'alg1.absolute-value', kind: 'framework', title: 'The two-case split', content: `THE TWO-CASE SPLIT — for c > 0, |ax + b| = c becomes ax + b = c OR ax + b = −c. Two answers, because exactly two points on a number line sit c units from a given spot: one on each side.` },
    { loId: 'alg1.absolute-value', kind: 'framework', title: 'Isolate first', content: `ISOLATE FIRST — strip everything off the bars before splitting. For 2|x − 1| + 5 = 13, subtract 5 and divide by 2 to reach |x − 1| = 4, THEN split. Splitting while a coefficient or constant still clings to the bars is the most common wrecking error.` },
    { loId: 'alg1.absolute-value', kind: 'framework', title: 'The edge cases', content: `THE EDGE CASES — |expr| = 0 has exactly ONE solution (distance zero means the inside is zero). |expr| = a negative number has NO SOLUTION, because a distance can never be negative. Check the sign of the right side before you write any cases.` },
    { loId: 'alg1.absolute-value', content: `LESS THAN → AND (a band) — |ax + b| < c means "within c units", so −c < ax + b < c. Solve the three-part inequality all at once; the answer is one connected interval like −2 < x < 8.` },
    { loId: 'alg1.absolute-value', content: `GREATER THAN → OR (two rays) — |ax + b| > c means "farther than c units away", so ax + b > c OR ax + b < −c. Note the flipped sign on the negative branch. The answer is two separate pieces and can never be squeezed into one double inequality.` },
    { loId: 'alg1.absolute-value', kind: 'framework', title: 'Sanity check by testing', content: `SANITY CHECK BY TESTING — pick any number from your answer region and any number outside it, and plug both into the original. A band answer should fail on the outside; an OR answer should fail in the middle.` },
    { loId: 'alg1.absolute-value', kind: 'definition', title: 'absolute value', content: 'the distance of a number from zero on the number line — always zero or positive.' },
    { loId: 'alg1.absolute-value', kind: 'definition', title: 'tolerance', content: 'the largest acceptable distance a measurement may fall from its target value.' },
  ],
  methods: [
    {
      title: 'Worked two cases',
      steps: [
        'The absolute value is already alone, and 9 is positive, so the split is valid.',
        'Case 1 — the inside equals 9: 2x + 3 = 9 → 2x = 6 → x = 3.',
        'Case 2 — the inside equals −9: 2x + 3 = −9 → 2x = −12 → x = −6.',
        'Check both: |2(3) + 3| = |9| = 9 ✓ and |2(−6) + 3| = |−9| = 9 ✓.',
      ],
      example: { problem: 'Solve: |2x + 3| = 9', solution: 'x = 3 or x = −6' },
      relatedLoIds: ['alg1.absolute-value'],
    },
    {
      title: 'Worked isolate or',
      steps: [
        `Isolate the absolute value BEFORE splitting: add 2 to both sides → 3|x − 1| > 9, then divide by 3 → |x − 1| > 3.`,
        `Read it as distance: the distance from x to 1 is more than 3 units. That is two rays, so this is an OR.`,
        `Branch 1: x − 1 > 3 → x > 4. Branch 2: x − 1 < −3 (sign flips on the negative branch) → x < −2.`,
        `Answer: x > 4 or x < −2. Test x = 5: 3|4| − 2 = 10 > 7 ✓. Test x = 0 (in the middle): 3|−1| − 2 = 1, not greater than 7 ✓ correctly excluded.`,
      ],
      example: { problem: 'Solve: 3|x − 1| − 2 > 7', solution: 'x > 4 or x < −2' },
      relatedLoIds: ['alg1.absolute-value'],
    },
  ],
  pointers: [
    { content: `"Greater than" means FARTHER than 5 units from 2, which is two rays, not a band: x − 2 > 5 OR x − 2 < −5, so x > 7 or x < −3. The band −3 < x < 7 is exactly the set of values that FAIL. Test x = 0: |0 − 2| = 2, which is not greater than 5.`, kind: 'common-error' },
    { content: `An absolute value is a distance, so it can never equal −4. Check the sign before splitting: |x + 1| = −4 has NO SOLUTION. The two-case split is only valid when the right side is zero or positive.`, kind: 'common-error' },
    { content: `|x| is distance from zero, so it is never negative — read |x − 5| as "how far x is from 5".`, kind: 'tip' },
    { content: `Isolate the absolute value first, then split |ax + b| = c into ax + b = c OR ax + b = −c (valid only when c ≥ 0).`, kind: 'tip' },
    { content: `A negative right side means NO SOLUTION; a right side of 0 means exactly one solution.`, kind: 'tip' },
    { content: `|expr| < c is an AND band: −c < expr < c. |expr| > c is an OR pair: expr > c or expr < −c.`, kind: 'tip' },
    { content: `Isolate the bars BEFORE splitting. In \`3|x − 1| − 2 > 7\` you may not turn the left side into \`3(x−1)\` and \`−3(x−1)\`. Add 2, divide by 3, get \`|x − 1| > 3\`, then split.`, kind: 'common-error' },
    { content: `Check the sign of the right side before writing any cases. \`|4x + 7| + 5 = 2\` becomes \`|4x + 7| = −3\` → NO SOLUTION. Writing two cases anyway produces two fake answers that both fail the check.`, kind: 'edge-case' },
    { content: `\`|expr| = 0\` has exactly ONE solution, not two. The two branches \`expr = 0\` and \`expr = −0\` are the same equation. Don't list a duplicate answer.`, kind: 'edge-case' },
    { content: `Don't force a \`>\` answer into a double inequality. \`x > 4 or x < −2\` is NOT \`−2 > x > 4\` — that string says x is below −2 and above 4 at once, which is impossible. Two rays need the word **or**.`, kind: 'common-error' },
    { content: `Flip the sign on the negative branch: \`|x − 1| > 3\` gives \`x − 1 > 3\` OR \`x − 1 < −3\` — not \`x − 1 > −3\`. Same for equations turning into inequalities: the direction reverses only on the negative case.`, kind: 'gotcha' },
    { content: `Read \`|x + 5|\` as "distance from **−5**", not from 5, since \`x + 5 = x − (−5)\`. Get this backwards and your center point — and every endpoint — shifts.`, kind: 'vocab-note' },
    { content: `Watch ≤ and ≥ in word problems. \`|v − 500| ≤ 8\` includes the endpoints, so 492 and 508 both PASS. A strict \`<\` would exclude them — the tolerance wording decides whether the boundary counts.`, kind: 'gotcha' },
    { content: `Sanity-test two numbers: one inside your answer set, one outside. A band answer must FAIL outside; an OR answer must fail in the MIDDLE. For \`|x − 2| > 5\`, test x = 0: \`|−2| = 2\`, not > 5 — so 0 is correctly excluded.`, kind: 'tip' },
  ],
};
