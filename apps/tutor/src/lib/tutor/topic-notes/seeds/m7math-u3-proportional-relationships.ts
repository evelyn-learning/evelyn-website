/**
 * Grade 7 Math — Unit 3 CED 3.3: Recognizing Proportional Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.proportional-relationships.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U3_PROPORTIONAL_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.proportional-relationships.v1',
  course: 'Grade 7 Math',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Recognizing Proportional Relationships',
  planId: 'evelyn.ms.m7math.proportional-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.proportional-relationships.v1' }],
  theory: [
    { loId: 'm7math.proportional-relationships', kind: 'framework', title: 'Proportional means the ratio never changes', content: `PROPORTIONAL MEANS THE RATIO NEVER CHANGES — two quantities are in a proportional relationship when y ÷ x gives the same number for every single pair. That shared number is the unit rate you have been finding all unit long.` },
    { loId: 'm7math.proportional-relationships', kind: 'framework', title: 'Test 1, the table', content: `TEST 1, THE TABLE — divide y by x in EVERY row, not just the first one. If all the answers match, the relationship is proportional. One matching row proves nothing, because a table can start out looking proportional and then break in a later row.` },
    { loId: 'm7math.proportional-relationships', kind: 'framework', title: 'Test 2, the graph', content: `TEST 2, THE GRAPH — the graph must be a straight line AND it must pass through the origin, the point (0, 0). Both parts are required. The origin part is the one students forget, and it is exactly where most mistakes come from. A straight line that crosses the vertical axis anywhere else is linear but NOT proportional.` },
    { loId: 'm7math.proportional-relationships', kind: 'framework', title: 'Test 3, the equation', content: `TEST 3, THE EQUATION — the equation has to look like y = kx, a number times x and nothing else. Nothing added on, nothing subtracted off. So y = 5x is proportional, and y = 2x + 3 is not, because that + 3 is riding along no matter how small x gets.` },
    { loId: 'm7math.proportional-relationships', content: `THE DISCRIMINATING CASE IS y = 2x + 3 — it climbs by the same amount every step, so its graph is a straight line, and it feels proportional. Check the ratios and it falls apart: at x = 1 the ratio is 5, at x = 2 it is 3.5, at x = 3 it is 3. Every proportional relationship is linear, but plenty of linear relationships are not proportional.` },
    { loId: 'm7math.proportional-relationships', kind: 'framework', title: 'Two fast sanity checks', content: `TWO FAST SANITY CHECKS — first, zero in should give zero out: if x = 0 does not make y = 0, stop, it is not proportional. Second, doubling x must exactly double y. Either check can rule a relationship out in seconds.` },
    { loId: 'm7math.proportional-relationships', kind: 'definition', title: 'proportional relationship', content: 'a relationship in which y ÷ x is the same number for every pair of values.' },
    { loId: 'm7math.proportional-relationships', kind: 'definition', title: 'origin', content: 'the point (0, 0) on a graph, where both axes meet.' },
    { loId: 'm7math.proportional-relationships', kind: 'definition', title: 'linear', content: `graphing as a straight line. Every proportional relationship is linear, but not every linear one is proportional.` },
  ],
  methods: [
    {
      title: 'Worked table test',
      steps: [
        'Run the table test, which means dividing cost by tacos in every row.',
        `Row by row: 5 ÷ 2 = 2.5, then 10 ÷ 4 = 2.5, then 15 ÷ 6 = 2.5, then 25 ÷ 10 = 2.5.`,
        'All four rows give the same number, 2.5, so the relationship IS proportional.',
        `The shared number has meaning: $2.50 per taco. That is the unit rate, and it is the same kind of number you found in lessons 3.1 and 3.2.`,
        `Confirm with the sanity checks. Zero tacos cost zero dollars, so the graph goes through the origin. And doubling the tacos from 2 to 4 doubles the cost from $5 to $10.`,
      ],
      example: { problem: `A taco stand posts this table. Tacos: 2, 4, 6, 10. Cost in dollars: 5, 10, 15, 25. Is the relationship proportional?`, solution: 'Yes, it is proportional, and every row gives 2.5' },
      relatedLoIds: ['m7math.proportional-relationships'],
    },
    {
      title: 'Worked non example',
      steps: [
        `Build a small table from the equation. At x = 0, y = 2(0) + 3 = 3. At x = 1, y = 5. At x = 2, y = 7. At x = 3, y = 9.`,
        `Table test: 5 ÷ 1 = 5, then 7 ÷ 2 = 3.5, then 9 ÷ 3 = 3. Those are not the same number, so it fails the table test.`,
        `Graph test: at x = 0 the cost is $3, not $0. The line crosses the vertical axis at (0, 3), so it misses the origin and fails the graph test.`,
        `Equation test: y = 2x + 3 is not in the form y = kx, because of the + 3. That is a third failure, and all three tests agree.`,
        `Notice what is still true. The cost climbs by exactly $2 every hour, so the graph really is a perfectly straight line. Straight is not enough.`,
        `WRONG answer to avoid: it is proportional because the graph is a straight line. RIGHT answer: it is linear but NOT proportional, because the $3 entry fee is paid once and does not grow with the hours.`,
      ],
      example: { problem: `A skating rink charges $3 to get in, plus $2 for each hour you skate, so the cost is y = 2x + 3. Is the relationship between hours and cost proportional?`, solution: 'No. It is linear but not proportional.' },
      relatedLoIds: ['m7math.proportional-relationships'],
    },
  ],
  pointers: [
    { content: `Students often say "It is proportional, because y goes up by 2 each time" — Divide instead of subtracting: 5 ÷ 1 = 5, then 7 ÷ 2 = 3.5, then 9 ÷ 3 = 3. Those do not match, so it is not proportional. This table is exactly y = 2x + 3, which means x = 0 gives y = 3, and the graph is a straight line through (0, 3) rather than through the origin. Linear, yes. Proportional, no.`, kind: 'common-error' },
    { content: `Students often say "Any straight line on a graph shows a proportional relationship" — The graph test has two parts, and both are required: straight line AND through the origin (0, 0). The line for y = 2x + 3 is perfectly straight, but it crosses the vertical axis at (0, 3), so it is not proportional. Every proportional relationship is linear; the reverse is not true.`, kind: 'common-error' },
    { content: 'Proportional means y ÷ x is the SAME number for every pair.', kind: 'tip' },
    { content: 'Table test: divide y by x in every row, not just one row.', kind: 'tip' },
    { content: `Graph test: straight line AND through the origin (0, 0). Both parts are required.`, kind: 'tip' },
    { content: `Equation test: y = kx with nothing added or subtracted. y = 2x + 3 is linear but not proportional.`, kind: 'tip' },
    { content: 'Fast checks: x = 0 must give y = 0, and doubling x must double y.', kind: 'tip' },
    { content: `Constant DIFFERENCE is not the same as constant RATIO. If y goes up by 2 each row, that only makes it linear. Divide y ÷ x in every row before you call it proportional.`, kind: 'common-error' },
    { content: `"Linear" and "proportional" are not synonyms. Every proportional relationship is linear, but plenty of linear ones (like y = 2x + 3) are not proportional. Say which word you mean.`, kind: 'vocab-note' },
    { content: `The graph test has TWO parts: straight line AND through the origin (0, 0). Students almost always remember "straight" and forget "origin." A straight line crossing the y-axis at (0, 3) fails.`, kind: 'gotcha' },
    { content: `One matching row proves nothing. Test EVERY row. A table can give the same ratio for the first two rows and then break in the third.`, kind: 'common-error' },
    { content: `Divide y ÷ x, not x ÷ y, and keep the same order in every row. Flipping the division halfway through makes matching ratios look like they don't match.`, kind: 'gotcha' },
    { content: `Watch out for x = 0. You can't divide by 0, so don't test that row — use it as the origin check instead: if x = 0 gives y anything other than 0, it's already not proportional.`, kind: 'edge-case' },
    { content: `The shared ratio doesn't have to be a whole number. 2.5 and 4.5 are perfectly good unit rates. Don't reject a table just because the division gives a decimal.`, kind: 'edge-case' },
    { content: `Quick 5-second screen: double x and see if y doubles. If doubling hours from 2 to 4 doesn't double the cost, stop — it's not proportional, no table needed.`, kind: 'tip' },
  ],
};
