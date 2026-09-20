/**
 * Grade 8 Math — Unit 6 CED 6.2: Linear vs Nonlinear Functions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.linear-vs-nonlinear-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U6_LINEAR_VS_NONLINEAR_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.linear-vs-nonlinear-functions.v1',
  course: 'Grade 8 Math',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Linear vs Nonlinear Functions',
  planId: 'evelyn.ms.m8math.linear-vs-nonlinear-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.linear-vs-nonlinear-functions.v1' }],
  theory: [
    { loId: 'm8math.linear-vs-nonlinear-functions', content: `THE LINEAR FAMILY IS y = mx + b — every rule you can write as a number times x, plus a number, is a linear function: y = 3x + 2, y = -4x + 20, y = 0.5x, y = 15x. The m is the slope you already measure as rise over run, and b is the height where the line crosses the y-axis. The m may be negative or a decimal, and b may be 0, and the rule is still in the family. Graph any member of the family and you get a straight line, every time.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'framework', title: 'Linear means a constant rate of change', content: `LINEAR MEANS A CONSTANT RATE OF CHANGE — the rate of change is the change in y divided by the change in x between two rows of a table. In Noah's table every x-step is 1 walk and every y-step is $15, so the rate is 15 ÷ 1 = 15 in every row. A function is linear exactly when that rate comes out the same between EVERY pair of neighboring rows, not just the first two. Check all of them; a table can start straight and bend later.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', content: `UNEVEN x-STEPS MEAN YOU MUST DIVIDE — a table with x-values 0, 2, 5 and y-values 4, 10, 19 has y-changes of 6 and then 9, which look uneven. The x-steps are uneven too, 2 and then 3, so divide: 6 ÷ 2 = 3 and 9 ÷ 3 = 3. Same rate, so this table IS linear. Comparing the y-changes alone only works when every x-step is the same size.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'framework', title: 'Nonlinear means the rate keeps changing', content: `NONLINEAR MEANS THE RATE KEEPS CHANGING — the area of a square is A = s². Side lengths 1, 2, 3, 4 give areas 1, 4, 9, 16, so the pairs are (1, 1), (2, 4), (3, 9), (4, 16), and the changes are 3, then 5, then 7. The rate grows every row, so A = s² is not linear. The same happens with y = x³: inputs 1, 2, 3 give 1, 8, 27, with changes 7 and then 19. There is no single m for a table like that, so no y = mx + b can describe it.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', content: `THE EXPONENT ON x IS THE GIVEAWAY IN AN EQUATION — in y = mx + b the x is plain; it is never squared, cubed, or multiplied by another x. So y = x² + 3 is nonlinear even though it ends in + 3, because the x is squared. And y = -2x is linear even though nothing is added, because the x is plain and b is simply 0. Read the x first, then the rest.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'framework', title: 'Plot it and look', content: `PLOT IT AND LOOK — a linear table's points line up along one straight line that a ruler could cover. Plot (1, 1), (2, 4), (3, 9) and they climb faster and faster: a straight line through the first two points rises 3 per step and would reach (3, 7), but the real third point is (3, 9), sitting above that line. A graph that bends is the picture of a rate that changes; a straight line is the picture of a rate that does not.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'definition', title: 'linear function', content: `a function that can be written as y = mx + b, with x plain; its rate of change is constant and its graph is a straight line.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'definition', title: 'nonlinear function', content: `a function whose rate of change is not constant; its points do not lie on one straight line, and its rule cannot be written as y = mx + b.` },
    { loId: 'm8math.linear-vs-nonlinear-functions', kind: 'definition', title: 'rate of change', content: `the change in y divided by the change in x between two rows of a table or two points on a graph; for a linear function it is the same everywhere and equals the slope m.` },
  ],
  methods: [
    {
      title: 'Worked two tables',
      steps: [
        `Both tables have x-steps of 1, so the test is whether the y-values change by the same amount in every row.`,
        `Table A: 11 - 7 = 4, then 15 - 11 = 4, then 19 - 15 = 4. Every change is 4 and every x-step is 1, so the rate of change is 4 ÷ 1 = 4 in every row. Table A is linear.`,
        `You can see the rule fits without needing to find it: the equation y = 4x + 3 gives 4 × 1 + 3 = 7, 4 × 2 + 3 = 11, 4 × 3 + 3 = 15, and 4 × 4 + 3 = 19, every row of Table A. But the constant rate was already the whole answer; the equation is just a member of the y = mx + b family showing up where a constant rate lives.`,
        `Table B: 6 - 3 = 3, then 11 - 6 = 5, then 18 - 11 = 7. The changes are 3, 5, 7, and they are not the same, so there is no single rate. Table B is not linear.`,
        `WRONG: saying Table B is linear because y goes up in every row. CORRECT: going up is not the test. The rate from row 1 to row 2 is 3, and the rate from row 3 to row 4 is 7, so the table gets steeper as it goes, and its points bend instead of lining up. Only going up by the SAME amount every row makes a table linear.`,
        `Check by plotting. Table A gives (1, 7), (2, 11), (3, 15), (4, 19), and a ruler laid on the first two points covers all four. Table B gives (1, 3), (2, 6), (3, 11), (4, 18), and a line through the first two points, rising 3 per step, would reach (3, 9) and (4, 12), while the real points sit at 11 and 18, higher and higher above it.`,
      ],
      example: { problem: `Decide whether each table shows a linear function. Table A: x-values 1, 2, 3, 4 with y-values 7, 11, 15, 19. Table B: x-values 1, 2, 3, 4 with y-values 3, 6, 11, 18.`, solution: `Table A is linear (rate of change 4 in every row); Table B is not linear (changes of 3, 5, 7)` },
      relatedLoIds: ['m8math.linear-vs-nonlinear-functions'],
    },
    {
      title: 'Worked produce and plot counterexamples',
      steps: [
        `A = s²: side 1 gives 1 × 1 = 1, side 2 gives 2 × 2 = 4, side 3 gives 3 × 3 = 9, side 4 gives 4 × 4 = 16. The pairs are (1, 1), (2, 4), (3, 9), (4, 16).`,
        `Test the rate of change. The s-steps are all 1, and the changes in A are 4 - 1 = 3, then 9 - 4 = 5, then 16 - 9 = 7. Three different rates, so A = s² is not linear.`,
        `Plot the four points. They climb faster and faster: up 3, then up 5, then up 7. The graph is a curve that bends upward, not a line.`,
        `WRONG: laying a ruler on (1, 1) and (2, 4), seeing a line, and calling the function linear. CORRECT: two points always line up; the test is whether the rest do. That line rises 3 per step, so at s = 3 it would sit at 4 + 3 = 7. The real point is (3, 9), two units above the line, and that one point is enough to make the function nonlinear.`,
        `y = x³: input 0 gives 0, input 1 gives 1 × 1 × 1 = 1, input 2 gives 2 × 2 × 2 = 8, input 3 gives 3 × 3 × 3 = 27. The pairs are (0, 0), (1, 1), (2, 8), (3, 27).`,
        `Test the rate. The x-steps are all 1 and the changes in y are 1 - 0 = 1, then 8 - 1 = 7, then 27 - 8 = 19. The rate jumps from 1 to 7 to 19, so y = x³ is not linear either. Plotted, the points hug the bottom near 0 and then shoot upward.`,
        `Read the equations the same way: in A = s² the s is squared, and in y = x³ the x is cubed. Neither is a plain x times a number plus a number, so neither belongs to the y = mx + b family, which matches what the tables and the plots just showed.`,
      ],
      example: { problem: `Make a table for the area of a square, A = s², using side lengths 1, 2, 3, 4, and plot the points. Then do the same for y = x³ using inputs 0, 1, 2, 3. Show that neither function is linear.`, solution: `Both are nonlinear: A = s² has changes 3, 5, 7 and y = x³ has changes 1, 7, 19; neither rate is constant and neither plot is a straight line` },
      relatedLoIds: ['m8math.linear-vs-nonlinear-functions'],
    },
  ],
  pointers: [
    { content: `Students often say "The table with y-values 5, 7, 11, 19 is nonlinear, because the changes 2, 4, 8 are not the same." — The x-steps are 1, 2, and 4, not 1, 1, 1, so the y-changes have to be divided before they can be compared: 2 ÷ 1 = 2, 4 ÷ 2 = 2, and 8 ÷ 4 = 2. The rate of change is 2 in every row, so the table IS linear. Plot (1, 5), (2, 7), (4, 11), (8, 19) and a ruler covers all four points. Uneven y-changes only prove nonlinear when the x-steps are even.`, kind: 'common-error' },
    { content: `Students often say "y = x² + 3 is linear, because it has a + 3 at the end like y = mx + b." — Read the x before anything else. In y = x² + 3 the x is squared, so the rule is not a number times a plain x plus a number, and it is not in the y = mx + b family. The table proves it: inputs 1, 2, 3 give 1 + 3 = 4, 4 + 3 = 7, and 9 + 3 = 12, with changes of 3 and then 5. The + 3 lifts every point up by 3, but it cannot straighten the bend that the squaring puts in.`, kind: 'common-error' },
    { content: `A function is linear when it can be written as y = mx + b with a plain x; every member of that family graphs as a straight line.`, kind: 'tip' },
    { content: `Linear means a constant rate of change: the same change in y for the same change in x, between EVERY pair of neighboring rows.`, kind: 'tip' },
    { content: `When the x-steps are uneven, divide each change in y by its change in x and compare the rates, not the raw y-changes.`, kind: 'tip' },
    { content: `Negative m, decimal m, a subtracted constant, and b = 0 are all still linear. Doubling every row is a constant multiplier, not a constant rate.`, kind: 'tip' },
    { content: `A = s² gives (1, 1), (2, 4), (3, 9), (4, 16) with changes 3, 5, 7, and y = x³ gives changes 1, 7, 19; the rate keeps changing, so both are nonlinear and both plots bend.`, kind: 'tip' },
    { content: `One point off the line is enough: a straight line through (1, 1) and (2, 4) would put the third point at (3, 7), and the real point (3, 9) breaks it.`, kind: 'tip' },
    { content: `Always divide when x-steps are uneven. If x goes 1, 2, 4, 8, you must divide each y-change by its x-change before deciding if the rate is constant. Raw y-changes alone will fool you.`, kind: 'common-error' },
    { content: `Read the exponent on x first, before you look at anything else. y = x² + 5 is nonlinear because x is squared, not because of what comes after. The + 5 just slides the curve up; it doesn't straighten it.`, kind: 'gotcha' },
    { content: `Two points always line up on a line. One point off that line is enough to prove nonlinear. Don't stop checking after the first two rows.`, kind: 'tip' },
    { content: `Constant rate ≠ constant multiplier. If points are (1, 2), (2, 4), (3, 8), each y is double the previous y, but the rate of change is 2 then 4 then 8—not constant. This is nonlinear.`, kind: 'vocab-note' },
    { content: `Negative m and decimal m are still linear. y = –3x + 1 and y = 0.5x are both in the y = mx + b family. The sign or decimal doesn't break the straight line.`, kind: 'edge-case' },
    { content: `b = 0 is fine; it just means the line passes through the origin. y = 2x with no constant term is linear. A missing + b doesn't disqualify it.`, kind: 'edge-case' },
    { content: `The y-changes in A = s² are 3, then 5, then 7—not the same. And even though the table starts low and goes up, 'going up' is not the test for linear. The rate must stay the same.`, kind: 'common-error' },
  ],
};
