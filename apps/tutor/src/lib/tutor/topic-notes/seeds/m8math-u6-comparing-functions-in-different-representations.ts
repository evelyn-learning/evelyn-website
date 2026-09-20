/**
 * Grade 8 Math — Unit 6 CED 6.3: Comparing Functions in Different Representations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.comparing-functions-in-different-representations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U6_COMPARING_FUNCTIONS_IN_DIFFERENT_REPRESENTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.comparing-functions-in-different-representations.v1',
  course: 'Grade 8 Math',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Comparing Functions in Different Representations',
  planId: 'evelyn.ms.m8math.comparing-functions-in-different-representations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.comparing-functions-in-different-representations.v1' }],
  theory: [
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'A linear function is two numbers', content: `A LINEAR FUNCTION IS TWO NUMBERS — every linear function is y = mx + b: m is the rate of change, how much y goes up for each 1 unit of x, and b is the initial value, the y when x is 0. A savings plan that starts at $40 and adds $8 a week has initial value 40 and rate of change 8. When every relationship went through the origin, one number told the whole story; now that the start can be anything, you need both numbers, and comparing two linear functions means comparing two pairs of numbers.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'From an equation or a sentence', content: `FROM AN EQUATION OR A SENTENCE — in y = 8x + 40 the rate is the number in front of x, 8, and the initial value is the number standing alone, 40. The order does not matter: 40 + 8x is the same function. In a sentence, the amount "per week", "per minute", or "for each person" is the rate, and the amount that is there before anything happens, "starts with", "already has", "to book", is the initial value.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'From a table', content: `FROM A TABLE — the initial value is the y-value in the row where x is 0. The rate of change is the change in y for one step of 1 in x, so when x goes 0, 1, 2, 3, subtract neighboring y-values. When x steps by 5, or by 2, divide the change in y by the change in x: from (0, 20) to (5, 30), the rate is 10 ÷ 5 = 2. This is the constant rate you tested for last lesson; in a linear table it comes out the same between any two rows, so use whichever two rows are easiest.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'From a graph, subtract before you divide', content: `FROM A GRAPH, SUBTRACT BEFORE YOU DIVIDE — the initial value is the height where the line crosses the vertical axis, at x = 0. The rate of change is rise over run from that crossing to a marked point: from a crossing at 60 to the point (4, 100), the rise is 100 - 60 = 40, the run is 4, and the rate is 40 ÷ 4 = 10. Dividing 100 by 4 only gave the rate when you compared proportional relationships, because those lines passed through the origin; a line that starts at 60 has a rise of 40, not 100.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'Higher start and faster growth are separate questions', content: `HIGHER START AND FASTER GROWTH ARE SEPARATE QUESTIONS — compare the two initial values to see which starts higher, and compare the two rates to see which grows faster. The one that starts higher does not have to grow faster: $60 plus $10 a week starts higher than $25 plus $15 a week, and grows slower. When each question has a different winner, the slower one is ahead at first and the faster one catches up.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'framework', title: 'Where they meet', content: `WHERE THEY MEET — the gap at the start is the difference between the two initial values, and every unit of x the gap shrinks by the difference between the two rates. The two functions meet after (starting gap) ÷ (rate difference) units: a $35 head start closing at $5 a week is gone after 35 ÷ 5 = 7 weeks. Check by putting that x into both functions; both must give the same y. If the two rates are equal, the gap never changes and the two functions never meet.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'definition', title: 'rate of change', content: `how much y changes for each 1 unit of x; in y = mx + b it is m, the number in front of x, and on a graph it is rise over run.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'definition', title: 'initial value', content: `the value of y when x is 0; in y = mx + b it is b, in a table it is the x = 0 row, and on a graph it is where the line crosses the vertical axis.` },
    { loId: 'm8math.comparing-functions-in-different-representations', kind: 'definition', title: 'linear function', content: `a function of the form y = mx + b, whose graph is a straight line and whose rate of change is the same between any two points.` },
  ],
  methods: [
    {
      title: 'Worked phones table vs sentence',
      steps: [
        `Extract your phone's two numbers from the table. The row where minutes is 0 gives the initial value: 20 percent. For the rate, take two rows and divide the change in percent by the change in minutes: from (0, 20) to (5, 30), that is 10 ÷ 5 = 2 percent per minute. The next rows agree, 40 - 30 = 10 over 5 minutes is again 2 per minute, so the rate is 2.`,
        `Extract Sam's two numbers from the sentence. "35 percent when plugged in" is the initial value, 35. "Gaining 1.5 percent every minute" is the rate of change, 1.5.`,
        `Compare the starts: 35 is bigger than 20, so Sam's phone started higher. Compare the rates: 2 is bigger than 1.5, so your phone charges faster. The two questions have different winners, which means yours will catch up.`,
        `Find where they meet. The starting gap is 35 - 20 = 15 percent, and every minute the gap shrinks by 2 - 1.5 = 0.5 percent. The gap is gone after 15 ÷ 0.5 = 30 minutes.`,
        `Check by plugging 30 minutes into both. Yours: 20 + 2 × 30 = 20 + 60 = 80 percent. Sam's: 35 + 1.5 × 30 = 35 + 45 = 80 percent. Both phones read 80 percent at 30 minutes, so the meeting point holds. Setting the two amounts equal, 20 + 2t = 35 + 1.5t, and collecting the variable terms the way you already do gives 0.5t = 15 and t = 30, the same arithmetic.`,
        `Read it back into the story. At 15 minutes the table says yours is at 50, while Sam's is at 35 + 1.5 × 15 = 35 + 22.5 = 57.5, still ahead. Sam's lead was 15 points, it lost 0.5 of a point every minute, and 30 minutes is when the lead runs out.`,
      ],
      example: { problem: `Your phone's charge is a table: 0 minutes, 20 percent; 5 minutes, 30 percent; 10 minutes, 40 percent; 15 minutes, 50 percent. Sam's phone reads "35 percent when plugged in, gaining 1.5 percent every minute." Which phone started higher, which charges faster, and after how many minutes do they show the same charge?`, solution: `Sam's phone started higher (35 versus 20 percent); yours charges faster (2 versus 1.5 percent per minute); they meet at 30 minutes, both at 80 percent` },
      relatedLoIds: ['m8math.comparing-functions-in-different-representations'],
    },
    {
      title: 'Worked skateboard graph vs equation',
      steps: [
        `Extract Theo's two numbers from the graph. The line crosses the vertical axis at 60, so the initial value is 60: that is what Theo had at week 0. For the rate, use the crossing and the marked point: from (0, 60) to (4, 100), the rise is 100 - 60 = 40 and the run is 4 - 0 = 4, so the rate is 40 ÷ 4 = 10 dollars per week.`,
        `WRONG: dividing 100 by 4 to get a rate of 25 dollars per week. CORRECT: dividing y by x at a point only gives the rate when the line passes through the origin, and this line starts at 60. The rise from week 0 to week 4 is 40, not 100. The graph itself exposes the slip: at 25 a week Theo would have 60 + 25 × 4 = 160 at week 4, but the marked point says 100.`,
        `Extract Nia's two numbers from the equation. In s = 15w + 25, the number in front of w is the rate, 15 dollars per week, and the number standing alone is the initial value, 25 dollars.`,
        `Compare the starts: 60 is bigger than 25, so Theo started with more. Compare the rates: 15 is bigger than 10, so Nia saves faster. Different winners, so Nia catches up.`,
        `Find where they meet. The starting gap is 60 - 25 = 35 dollars, and each week it shrinks by 15 - 10 = 5 dollars, so the gap is gone after 35 ÷ 5 = 7 weeks.`,
        `Check by plugging 7 weeks into both. Theo: 60 + 10 × 7 = 60 + 70 = 130. Nia: 15 × 7 + 25 = 105 + 25 = 130. Both have $130 after 7 weeks, so the answer holds, and from week 8 on Nia has more: 140 for Theo against 145 for Nia.`,
      ],
      example: { problem: `Theo and Nia are both saving for the same skateboard. Theo's savings are shown by a graph, weeks across and dollars up: the line crosses the vertical axis at 60 and passes through the point (4, 100). Nia's savings follow the equation s = 15w + 25, where s is dollars and w is weeks. Who started with more, who saves faster, and after how many weeks do they have the same amount?`, solution: `Theo started with more ($60 versus $25); Nia saves faster ($15 versus $10 per week); they have the same amount, $130, after 7 weeks` },
      relatedLoIds: ['m8math.comparing-functions-in-different-representations'],
    },
  ],
  pointers: [
    { content: `Students often say "Jonah saves faster, because 110 ÷ 6 is about 18.3 and that is bigger than 16." — Subtract before you divide. From the crossing at (0, 50) to the point (6, 110), the rise is 110 - 50 = 60 and the run is 6, so Jonah's rate is 60 ÷ 6 = 10 dollars per week. Ria adds 16 dollars per week, and 16 is bigger than 10, so Ria saves faster. A quick check: at 10 a week Jonah has 50 + 10 × 6 = 110 at week 6, exactly the marked point; at 18.3 a week he would have about 160, which the graph does not show.`, kind: 'common-error' },
    { content: `Students often say "Jonah has more money now, so Jonah will always have more." — Starting higher and growing faster are separate questions. Jonah starts higher, 50 against 20, but Ria grows faster, 16 against 10 per week, so Ria catches up. The gap is 50 - 20 = 30 dollars and it shrinks by 16 - 10 = 6 dollars a week, so it is gone after 30 ÷ 6 = 5 weeks: Jonah has 50 + 10 × 5 = 100 and Ria has 20 + 16 × 5 = 100. By week 6, Jonah has 110, the marked point, and Ria has 20 + 16 × 6 = 116, so Ria is ahead.`, kind: 'common-error' },
    { content: `A linear function is two numbers: the rate of change (the number in front of x, the "per" amount) and the initial value (the number standing alone, the y when x is 0).`, kind: 'tip' },
    { content: `From a table, the initial value is the x = 0 row and the rate is the change in y divided by the change in x between any two rows. From a graph, the initial value is where the line crosses the vertical axis and the rate is rise over run from that crossing to a marked point.`, kind: 'tip' },
    { content: `On a graph that does not pass through the origin, subtract before you divide: the rise is the point's height minus the crossing, not the height by itself.`, kind: 'tip' },
    { content: `Which starts higher is decided by the initial values; which grows faster is decided by the rates. They are separate questions and can have different winners.`, kind: 'tip' },
    { content: `Two functions with different winners meet after (starting gap) ÷ (rate difference) units; check by plugging that x into both and getting the same y.`, kind: 'tip' },
    { content: `On a graph, always subtract before you divide. Rise = (point's y) − (crossing's y), not just the point's y. Then divide rise by run. If the line doesn't pass through the origin, dividing y by x at a point gives the wrong rate.`, kind: 'common-error' },
    { content: `Don't let 'starts higher' decide 'ends higher.' Compare initial values to see who starts ahead; compare rates to see who catches up. The one that starts with less can win if it grows faster.`, kind: 'gotcha' },
    { content: `In an equation like y = 40 + 3x or 3x + 40, the number in front of x is always the rate, and the standalone number is always the initial value—even if they're in different order than y = mx + b.`, kind: 'vocab-note' },
    { content: `From a table, find the initial value first—it's in the row where x = 0. If there's no x = 0 row, you can't read the initial value directly; you have to calculate it using the rate and another row.`, kind: 'edge-case' },
    { content: `To find where two functions meet, use (starting gap) ÷ (rate difference). Then check by plugging that x into both equations—if you get the same y, you're right. If the rates are equal, the functions never meet (unless they're identical).`, kind: 'tip' },
    { content: `When you extract the rate from a table, use any two rows you want—pick the ones that are easiest to subtract. The rate comes out the same between any two rows in a linear function, so don't feel stuck using consecutive rows.`, kind: 'tip' },
    { content: `The rate of change is 'per' something—per minute, per week, per person. The initial value is what's there 'at the start,' 'already there,' or 'to book.' These phrases in a sentence tell you which number is which.`, kind: 'vocab-note' },
    { content: `If the starting gap shrinks to zero, that's where they meet. But after that point, the faster-growing function pulls ahead. Don't confuse 'same y-value at one moment' with 'same forever.'`, kind: 'gotcha' },
  ],
};
