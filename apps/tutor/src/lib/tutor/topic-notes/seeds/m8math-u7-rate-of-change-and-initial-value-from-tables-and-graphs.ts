/**
 * Grade 8 Math — Unit 7 CED 7.1: Rate of Change & Initial Value from Tables & Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U7_RATE_OF_CHANGE_AND_INITIAL_VALUE_FROM_TABLES_AND_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1',
  course: 'Grade 8 Math',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Rate of Change & Initial Value from Tables & Graphs',
  planId: 'evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1' }],
  theory: [
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', content: `THE SHAPE YOU ARE HUNTING FOR IS y = mx + b — you already know it from reading lines off a graph. m is the rate of change, how much y goes up or down when x goes up by 1, and b is the initial value, what y is when x = 0. In the laser tag story m is the price of one game and b is the vest fee. Today the rows and the picture stop handing you b, so you learn to dig both numbers out.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', content: `m COMES FROM ANY TWO ROWS OR POINTS — pick two rows, subtract the y-values, subtract the x-values in the SAME order, and divide: m = (change in y) ÷ (change in x). From the rows (2, 14) and (5, 26), m = (26 - 14) ÷ (5 - 2) = 12 ÷ 3 = 4. The rows do not have to be next to each other, because on a line every pair of points gives the same slope, the fact you argued with slope triangles.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', kind: 'framework', title: 'Divide, do not just read the jump', content: `DIVIDE, DO NOT JUST READ THE JUMP — when a table steps x by 1, the jump in y is the rate. When it steps x by 3, the jump in y is three rates stacked together. In the laser tag table y jumps by 12 while x jumps by 3, so the rate is 12 ÷ 3 = 4, not 12. Always look at how far x moved before you trust the jump in y.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', content: `IF A ROW HAS x = 0, b IS SITTING RIGHT THERE — the initial value is the y-value when x = 0, so a table row (0, something) or the point where the line crosses the y-axis hands you b with no work. Most tables in this lesson do not start at 0, and the graphs are cut off before the y-axis, so this easy case is rare here.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', content: `IF x = 0 IS MISSING, BACK b OUT FROM ONE ROW — take any row you trust, multiply m by its x, and subtract that from its y: b = y - mx. Using the row (2, 14) with m = 4: b = 14 - 4 × 2 = 14 - 8 = 6. The row (5, 26) works too: 26 - 4 × 5 = 26 - 20 = 6. Same b either way, which is how you know the line really passes through both rows.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', kind: 'framework', title: 'Write the equation and check with a spare row', content: `WRITE THE EQUATION AND CHECK WITH A SPARE ROW — put the two numbers in place: y = 4x + 6. Then plug in a row you did NOT use for b. If the table also says (8, 38), check 4 × 8 + 6 = 32 + 6 = 38. It matches, so the equation is right. If it did not match, the first place to look is whether you divided by the change in x.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', kind: 'definition', title: 'rate of change', content: `the number m in y = mx + b; how much y changes each time x goes up by 1, found as (change in y) ÷ (change in x) between any two rows or points.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', kind: 'definition', title: 'initial value', content: `the number b in y = mx + b; the value of y when x = 0, whether it is written in the table or has to be backed out.` },
    { loId: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs', kind: 'definition', title: 'back out', content: `find a hidden number by undoing the arithmetic around it; b = y - mx backs the initial value out of one row once m is known.` },
  ],
  methods: [
    {
      title: 'Worked laser tag table',
      steps: [
        `Find m from two rows. Take (2, 14) and (5, 26). Change in y: 26 - 14 = 12. Change in x: 5 - 2 = 3. So m = 12 ÷ 3 = 4.`,
        `Confirm with a different pair, because on a line every pair must agree. From (5, 26) to (8, 38): change in y is 38 - 26 = 12, change in x is 8 - 5 = 3, and 12 ÷ 3 = 4 again.`,
        `Look for x = 0. The table starts at 2 games, so nobody paid for zero games and b is not written down. Back it out from one row.`,
        'Use the row (2, 14): b = y - mx = 14 - 4 × 2 = 14 - 8 = 6.',
        'Write the equation: y = 4x + 6.',
        `Check with the row you have not touched yet, (8, 38): 4 × 8 + 6 = 32 + 6 = 38. It matches. Read it back into the story: each game costs $4 and the vest fee is $6.`,
      ],
      example: { problem: `The laser tag table lists games played and total cost in dollars. Games: 2, 5, 8. Cost: 14, 26, 38. Write the equation for the cost y of x games.`, solution: 'y = 4x + 6' },
      relatedLoIds: ['m8math.rate-of-change-and-initial-value-from-tables-and-graphs'],
    },
    {
      title: 'Worked battery graph',
      steps: [
        `Find m from the two points. Change in y: 40 - 70 = -30. Change in x: 30 - 10 = 20. So m = -30 ÷ 20 = -1.5. The line falls, so a negative rate is exactly what you expect: the battery drops 1.5 percent every minute.`,
        `WRONG: subtracting in mixed order, (70 - 40) ÷ (30 - 10) = 30 ÷ 20 = 1.5, and calling the rate positive. CORRECT: whichever point you start from for y, start from the same point for x. (70 - 40) ÷ (10 - 30) = 30 ÷ (-20) = -1.5, the same answer as before. A falling line always gets a negative m.`,
        `Look for x = 0. The picture starts at 5 minutes, so the y-axis crossing is not on the page. WRONG: taking the first point you can see, (10, 70), and calling 70 the initial value. CORRECT: 70 is the battery at 10 minutes, not at 0 minutes. Back b out.`,
        `Use the point (10, 70): b = y - mx = 70 - (-1.5) × 10 = 70 - (-15) = 70 + 15 = 85.`,
        'Write the equation: y = -1.5x + 85.',
        `Check with the other point, (30, 40): -1.5 × 30 + 85 = -45 + 85 = 40. It matches. Read it back: the call started with the battery at 85 percent, and the phone loses 1.5 percent a minute.`,
      ],
      example: { problem: `A graph shows a phone battery during a video call, with minutes on the horizontal axis and battery percent on the vertical axis. The horizontal axis starts at 5 minutes, not 0, so the line runs off the left edge before it reaches the y-axis. Two points sit exactly on grid crossings: (10, 70) and (30, 40). Write the equation of the line.`, solution: 'y = -1.5x + 85' },
      relatedLoIds: ['m8math.rate-of-change-and-initial-value-from-tables-and-graphs'],
    },
  ],
  pointers: [
    { content: `Students often say "y = 15x + 22" — y jumps by 15 while x jumps by 5, so the rate is 15 ÷ 5 = 3, not 15. Then b is backed out from the row (5, 22): b = 22 - 3 × 5 = 22 - 15 = 7, so the equation is y = 3x + 7. The check exposes the slip: for x = 10, Theo's equation gives 15 × 10 + 22 = 172, nowhere near 37, while 3 × 10 + 7 = 37 matches.`, kind: 'common-error' },
    { content: `Students often say "y = 3x + 22" — The initial value is y when x = 0, and this table starts at x = 5, so 22 is the value five steps in, not the start. Back b out: b = 22 - 3 × 5 = 7, so the equation is y = 3x + 7. The check catches it too: for x = 10, Nadia's equation gives 3 × 10 + 22 = 52, but the table says 37, while 3 × 10 + 7 = 37 matches. Both students needed the same habit: after writing the equation, test it on a row you did not use.`, kind: 'common-error' },
    { content: `Every linear function is y = mx + b: m is the rate of change and b is the initial value, the y when x = 0.`, kind: 'tip' },
    { content: `m comes from any two rows or points: (change in y) ÷ (change in x), subtracting in the same order both times. A falling line gets a negative m.`, kind: 'tip' },
    { content: 'When x steps by more than 1, divide. The jump in y alone is not the rate.', kind: 'tip' },
    { content: `If a row has x = 0, read b from it. If not, back it out from one row: b = y - mx.`, kind: 'tip' },
    { content: `The first row of a table, or the first point you can see on a graph, is not b unless its x is 0.`, kind: 'tip' },
    { content: 'Write y = mx + b, then check it against a row you did not use.', kind: 'tip' },
  ],
};
