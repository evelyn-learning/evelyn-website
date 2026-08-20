/**
 * Grade 7 Math — Unit 9 CED 9.4: Comparing Two Populations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.comparing-two-populations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U9_COMPARING_TWO_POPULATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.comparing-two-populations.v1',
  course: 'Grade 7 Math',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Comparing Two Populations',
  planId: 'evelyn.ms.m7math.comparing-two-populations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.comparing-two-populations.v1' }],
  theory: [
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'Compare the centers first', content: `COMPARE THE CENTERS FIRST — find the mean of each data set and subtract the smaller from the larger. That gap is the raw difference, and it is only half the story. A gap of 2 means nothing on its own until you know what a normal amount of wobble looks like in these groups.` },
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'The mad is the measuring stick', content: `THE MAD IS THE MEASURING STICK — the mean absolute deviation says how far a typical value sits from its own group mean. If a group has a MAD of 5, then values bouncing 5 away from the mean are completely ordinary inside that group. So the MAD tells you how big a gap has to be before it stands out.` },
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'Divide the gap by the mad', content: `DIVIDE THE GAP BY THE MAD — take the difference between the two means and divide it by the MAD. That answers the real question: how many typical wobbles apart are these two groups? A gap of 10 with a MAD of 2 gives 10 divided by 2, which is 5, so the groups sit 5 wobbles apart. A gap of 2 with a MAD of 5 gives 0.4, so the groups sit less than half a wobble apart.` },
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'The informal rule', content: `THE INFORMAL RULE — if the gap is about 2 MADs or more, the difference is meaningful and you will be able to see it in the data. If the gap is around 1 MAD or less, the two groups overlap so much that the difference is not convincing. In between, be cautious and say so. Use the same measures and the same units on both sets, or the comparison is meaningless.` },
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'Look for overlap as a check', content: `LOOK FOR OVERLAP AS A CHECK — line up the two sets of values and see how much they share. When groups are truly far apart, the highest value in one group can sit below the lowest value in the other. When the difference is weak, the two lists are tangled together. Overlap and the MAD calculation should agree; if they disagree, recheck the arithmetic.` },
    { loId: 'm7math.comparing-two-populations', kind: 'framework', title: 'What we are not claiming', content: `WHAT WE ARE NOT CLAIMING — this is an informal comparison, not a proof. It does not say WHY the groups differ, and it never says that every member of the higher group beats every member of the lower group. Group means describe groups. Individuals still overlap.` },
    { loId: 'm7math.comparing-two-populations', kind: 'definition', title: 'variability', content: `how spread out the values in a data set are, measured here by the mean absolute deviation.` },
    { loId: 'm7math.comparing-two-populations', kind: 'definition', title: 'overlap', content: `the range of values that both data sets share; heavy overlap means the groups are hard to tell apart.` },
  ],
  methods: [
    {
      title: 'Worked pizza delivery meaningful',
      steps: [
        `Mean for Place A: 18 plus 20 is 38, plus 22 is 60, plus 22 is 82, plus 24 is 106, plus 26 is 132. The sum is 132, and 132 divided by 6 is 22 minutes.`,
        `MAD for Place A: distances from 22 are 4, 2, 0, 0, 2, 4. Those add to 12, and 12 divided by 6 is 2. So the MAD for Place A is 2 minutes.`,
        `Mean for Place B: 28 plus 30 is 58, plus 32 is 90, plus 32 is 122, plus 34 is 156, plus 36 is 192. The sum is 192, and 192 divided by 6 is 32 minutes.`,
        `MAD for Place B: distances from 32 are 4, 2, 0, 0, 2, 4. Those add to 12, and 12 divided by 6 is 2. The MAD for Place B is also 2 minutes.`,
        `Gap between the centers: 32 minus 22 is 10 minutes. Now measure that gap in MADs: 10 divided by 2 is 5. The two groups sit 5 typical wobbles apart, far more than the 2 MADs we look for.`,
        `Check with overlap. The slowest order from Place A took 26 minutes, and the fastest order from Place B took 28 minutes. The two lists do not overlap at all, which matches the calculation.`,
        `So the difference is meaningful. Place A really is faster, by about 10 minutes, and that gap is 5 times the size of the ordinary wobble at either place.`,
      ],
      example: { problem: `Six delivery times from Place A, in minutes: 18, 20, 22, 22, 24, 26. Six delivery times from Place B, in minutes: 28, 30, 32, 32, 34, 36. Compare the two places using center and spread.`, solution: `Place A mean 22 minutes with MAD 2; Place B mean 32 minutes with MAD 2. The 10-minute gap is 5 MADs, so the difference is meaningful.` },
      relatedLoIds: ['m7math.comparing-two-populations'],
    },
    {
      title: 'Worked players not meaningful',
      steps: [
        `Mean for Player A: 12 plus 15 is 27, plus 18 is 45, plus 21 is 66, plus 24 is 90, plus 30 is 120. The sum is 120, and 120 divided by 6 is 20 points.`,
        `MAD for Player A: distances from 20 are 8, 5, 2, 1, 4, 10. Those add to 30, and 30 divided by 6 is 5. The MAD for Player A is 5 points.`,
        `Mean for Player B: 14 plus 17 is 31, plus 20 is 51, plus 23 is 74, plus 26 is 100, plus 32 is 132. The sum is 132, and 132 divided by 6 is 22 points.`,
        `MAD for Player B: distances from 22 are 8, 5, 2, 1, 4, 10. Those add to 30, and 30 divided by 6 is 5. The MAD for Player B is also 5 points.`,
        `Gap between the centers: 22 minus 20 is 2 points. Measure it in MADs: 2 divided by 5 is 0.4. The two means sit less than half a typical wobble apart.`,
        `Check with overlap. Player A scored from 12 to 30 and Player B scored from 14 to 32. Those ranges sit almost on top of each other, and Player A scored 30 in one game while Player B scored only 14 in another. Heavy overlap, exactly as the 0.4 predicted.`,
        `So the honest conclusion is that these two players are about the same. WRONG answer to avoid: Player B is the better scorer because 22 is greater than 20. RIGHT answer: the 2-point gap is small compared with the 5-point wobble each player already has, so the data do not show a real difference.`,
      ],
      example: { problem: `Points scored by Player A in six games: 12, 15, 18, 21, 24, 30. Points scored by Player B in six games: 14, 17, 20, 23, 26, 32. Is Player B really the higher scorer?`, solution: `Player A mean 20 with MAD 5; Player B mean 22 with MAD 5. The 2-point gap is only 0.4 of a MAD, so the difference is not meaningful.` },
      relatedLoIds: ['m7math.comparing-two-populations'],
    },
  ],
  pointers: [
    { content: `Students often say "Class A is better at spelling, because 82 is greater than 80." — Look at the gap next to the wobble. The gap is 82 minus 80, which is 2. The MAD is 9, so a typical student is already 9 points away from their own class mean. Divide: 2 divided by 9 is about 0.2, so the two class means sit about one fifth of a wobble apart. That is far below the 2 MADs a meaningful difference needs. These two classes are about the same at spelling.`, kind: 'common-error' },
    { content: `Students often say "Class A has the higher mean, so every student in Class A scored higher than every student in Class B." — A mean describes a whole group, not any one member. With a MAD of 9 in both classes, plenty of Class B students scored above plenty of Class A students, and the two lists of scores overlap heavily. Even when a difference IS meaningful, such as a gap of 5 MADs, the correct sentence is about the groups on average, never about every single person.`, kind: 'common-error' },
    { content: `Compare two data sets with center AND spread together. The gap between the means alone never settles the question.`, kind: 'tip' },
    { content: 'Measure the gap in MADs: subtract the two means, then divide by the MAD.', kind: 'tip' },
    { content: `A gap of about 2 MADs or more is a meaningful difference; a gap of about 1 MAD or less means the groups overlap too much to tell apart.`, kind: 'tip' },
    { content: `Overlap is the visual check. Far-apart groups barely share values; weakly different groups have tangled lists.`, kind: 'tip' },
    { content: `This comparison is informal. It describes groups on average, and it never claims that every member of one group beats every member of the other.`, kind: 'tip' },
    { content: `Never stop at "22 > 20, so B wins." A bigger mean by itself proves nothing. Always finish the job: gap ÷ MAD. A 2-point gap with a MAD of 5 is only 0.4 MADs — that's no real difference.`, kind: 'common-error' },
    { content: `Divide the GAP by the MAD, not the MAD by the gap. Gap 10, MAD 2 → 10 ÷ 2 = 5 MADs apart. Flipping it gives 0.2 and the opposite conclusion. Ask yourself: "how many wobbles fit inside the gap?"`, kind: 'gotcha' },
    { content: `A mean describes the GROUP, not each person. Even with a 5-MAD gap, you can't say every member of the higher group beat every member of the lower group. Write conclusions with "on average" or "typically."`, kind: 'common-error' },
    { content: `Subtract the means in the order that gives a positive gap (bigger − smaller). MAD distances are also always positive — they're distances. A negative number anywhere in a MAD calculation means you forgot to drop the sign.`, kind: 'gotcha' },
    { content: `Between about 1 and 2 MADs, don't fake certainty. Say the difference is possible but not convincing. Only about 2 MADs or more earns the word "meaningful."`, kind: 'edge-case' },
    { content: `"Variability" = how spread out one data set is (its MAD). "Overlap" = how much the two lists share values. They're different words: one set has variability; two sets have overlap.`, kind: 'vocab-note' },
    { content: `If the MADs of the two groups differ, use the same measure for both and compare against the MADs you actually have — and say which one you used. Never compare a mean from one set with a median from the other, or minutes with seconds.`, kind: 'edge-case' },
    { content: `Use overlap as a free double-check. Big MAD gap should mean the lists barely share values; small gap should mean they're tangled. If your number and the picture disagree, redo the arithmetic — don't pick a side.`, kind: 'tip' },
  ],
};
