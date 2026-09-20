/**
 * Grade 8 Math — Unit 5 CED 5.2: Solving Systems by Graphing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.solving-systems-by-graphing.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U5_SOLVING_SYSTEMS_BY_GRAPHING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.solving-systems-by-graphing.v1',
  course: 'Grade 8 Math',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Solving Systems by Graphing',
  planId: 'evelyn.ms.m8math.solving-systems-by-graphing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.solving-systems-by-graphing.v1' }],
  theory: [
    { loId: 'm8math.solving-systems-by-graphing', kind: 'framework', title: 'The solution is still the crossing point', content: `THE SOLUTION IS STILL THE CROSSING POINT — last lesson the two lines were drawn for you, and the solution was the one (x, y) pair sitting on both. Today nobody draws the lines for you. You get two equations, such as y = 2x + 5 and y = 3x + 1, and the job is to draw both lines yourself and find where they cross.` },
    { loId: 'm8math.solving-systems-by-graphing', content: `GRAPH A LINE FROM y = mx + b — you already know that b is where the line crosses the y-axis and m is the slope, rise over run. To draw y = 3x + 1, plot (0, 1), then step by the slope: up 3 and right 1 lands on (1, 4), and again on (2, 7). Three points in a row confirm the line, so draw it through them. Do the same for the second equation on the SAME axes, or there is no crossing to find.` },
    { loId: 'm8math.solving-systems-by-graphing', content: `PUT IT INTO y = mx + b FIRST WHEN THAT IS EASY — 2y = 6x + 4 is the line y = 3x + 2 in disguise, because dividing EVERY term by 2 gives y = 3x + 2. Halving only the 4, to get y = 6x + 2, draws a different line and finds a different crossing. If y has a number in front of it and every term is a multiple of that number, divide it out of every term, and then graph.` },
    { loId: 'm8math.solving-systems-by-graphing', kind: 'framework', title: 'Read the crossing, then check it in both', content: `READ THE CROSSING, THEN CHECK IT IN BOTH — read the point as (x, y), across first and then up. If the crossing lands exactly where two grid lines meet, a lattice point, substitute it into BOTH equations. Both sides matching in both equations says the point is on both lines, and the solution is exact.` },
    { loId: 'm8math.solving-systems-by-graphing', kind: 'framework', title: 'Estimate when the crossing is between grid lines', content: `ESTIMATE WHEN THE CROSSING IS BETWEEN GRID LINES — lines do not always cross at a lattice point. If the crossing sits between x = 1 and x = 2, closer to 1, and between y = 2 and y = 3, closer to 3, say "about (1.3, 2.7)". The check will come out close on both sides rather than exact, and that is what an estimate looks like; a hand-drawn graph cannot pin the point down any more tightly than that.` },
    { loId: 'm8math.solving-systems-by-graphing', content: `SAME SLOPE, NO CROSSING; SAME LINE, EVERY POINT — y = 2x + 3 and y = 2x - 1 both climb 2 for every 1 across, so the gap between them never changes and they never meet: parallel lines, no solution. The same thing hides in 3x + 2y = 5 and 3x + 2y = 6, because for any pair (x, y) the expression 3x + 2y is one number, and one number cannot equal 5 and 6 at once, so no pair works in both and no graph is needed. And y = 2x + 1 with 2y = 4x + 2 is one line written twice, since dividing every term by 2 turns the second equation into the first: every point on that line is a solution, so there are infinitely many.` },
    { loId: 'm8math.solving-systems-by-graphing', kind: 'definition', title: 'lattice point', content: `a point whose x-coordinate and y-coordinate are both integers, so it sits exactly where two grid lines meet.` },
    { loId: 'm8math.solving-systems-by-graphing', kind: 'definition', title: 'parallel lines', content: `two lines with the same slope and different y-intercepts; they never meet, so a system whose graph is two parallel lines has no solution.` },
    { loId: 'm8math.solving-systems-by-graphing', kind: 'definition', title: 'coincident lines', content: `two equations that describe the same line, so the graph is one line drawn twice and every point on it is a solution.` },
  ],
  methods: [
    {
      title: 'Worked game passes',
      steps: [
        `Both equations are already in y = mx + b form. Pass A: b = 5 and m = 2. Pass B: b = 1 and m = 3.`,
        `Graph Pass A. Plot (0, 5). The slope 2 means up 2 for every 1 to the right, so the next points are (1, 7), (2, 9), (3, 11), (4, 13). Draw the line through them.`,
        `Graph Pass B on the SAME axes. Plot (0, 1). The slope 3 means up 3 for every 1 to the right, so the next points are (1, 4), (2, 7), (3, 10), (4, 13). Draw the line through them.`,
        `Both lists contain (4, 13), and on the grid that is exactly where the two lines cross. Read it as (x, y): x = 4 and y = 13. It is a lattice point, so the graph is giving an exact answer.`,
        `Check in BOTH equations. Pass A: 2(4) + 5 = 8 + 5 = 13. Pass B: 3(4) + 1 = 12 + 1 = 13. Both give 13, so (4, 13) is on both lines and is the solution.`,
        `Read it back into the story: after 4 games both passes cost $13. Pass B starts $4 cheaper but climbs $3 a game against Pass A's $2, so it gains $1 on Pass A every game and catches up in exactly 4 games, which is the same 4 the graph found.`,
      ],
      example: { problem: `Pass A costs $5 to join and then $2 per game. Pass B costs $1 to join and then $3 per game. After how many games do the two passes cost the same, and what is that cost? Solve by graphing y = 2x + 5 and y = 3x + 1, where x is the number of games and y is the total cost in dollars.`, solution: '(4, 13): after 4 games both passes cost $13' },
      relatedLoIds: ['m8math.solving-systems-by-graphing'],
    },
    {
      title: 'Worked estimate non lattice',
      steps: [
        `The first equation is in y = mx + b form: b = -1 and m = 3. The second is not, because y is doubled. Divide EVERY term by 2: 2y ÷ 2 = y, -2x ÷ 2 = -x, and 8 ÷ 2 = 4, so the second line is y = -x + 4.`,
        `WRONG: dividing only the 8 by 2 and writing y = -2x + 4. CORRECT: 2y = -2x + 8 says that twice y equals the whole right side, so halving y means halving every term on the right, which gives y = -x + 4. The check exposes the slip: at x = 2 the original gives 2y = -4 + 8 = 4, so y = 2, and y = -x + 4 gives -2 + 4 = 2 as well, while the wrong version gives -4 + 4 = 0.`,
        `Graph y = 3x - 1. Plot (0, -1), then up 3 and right 1: (1, 2), (2, 5). Draw the line through them.`,
        `Graph y = -x + 4 on the SAME axes. Plot (0, 4), then down 1 and right 1: (1, 3), (2, 2), (3, 1). Draw the line through them.`,
        `Look at where they cross. At x = 1 the first line is at 2 and the second at 3, so the second is above. At x = 2 the first is at 5 and the second at 2, so the first is above. The crossing is between x = 1 and x = 2, and because the gap is only 1 at x = 1 but 3 at x = 2, it sits closer to 1. The height there is between 2 and 3, closer to 3. This is not a lattice point, so the answer is an estimate: about (1.3, 2.7).`,
        `Check the estimate in BOTH equations. y = 3x - 1: 3(1.3) - 1 = 3.9 - 1 = 2.9. y = -x + 4: -1.3 + 4 = 2.7. The two sides come out close, 2.9 and 2.7, but not identical, which is exactly what an estimate looks like: the true crossing is very near (1.3, 2.7), and a hand-drawn graph cannot pin it down more tightly than that.`,
      ],
      example: { problem: `Solve by graphing: y = 3x - 1 and 2y = -2x + 8. Give the solution as precisely as the graph allows.`, solution: `About (1.3, 2.7); the crossing is not a lattice point, so the graph gives an estimate` },
      relatedLoIds: ['m8math.solving-systems-by-graphing'],
    },
  ],
  pointers: [
    { content: `Students often say "3x + 2y = 5 and 3x + 2y = 6 cross somewhere off the edge of the graph." — Look at the left sides: they are identical. For any pair (x, y), the expression 3x + 2y is one number, and one number cannot be 5 and 6 at the same time. So no pair works in both equations, and the two lines are parallel. They never meet, no matter how far the graph extends, and no graph is needed to see it. The system has no solution.`, kind: 'common-error' },
    { content: `Students often say "y = 2x + 1 and 2y = 4x + 2 have no solution, because the equations look different." — Divide every term of 2y = 4x + 2 by 2: 2y ÷ 2 = y, 4x ÷ 2 = 2x, and 2 ÷ 2 = 1, which is y = 2x + 1, the first equation exactly. The two equations describe the same line, so the graph is one line drawn twice, and every point on it is a solution: (0, 1), (1, 3), (2, 5), and on forever. Check (1, 3) in the original second equation: 2(3) = 6 and 4(1) + 2 = 6. Infinitely many solutions, not zero.`, kind: 'common-error' },
    { content: `To solve a system by graphing, draw both lines on the same axes and read the point where they cross as (x, y), across first and then up.`, kind: 'tip' },
    { content: `Graph y = mx + b by plotting (0, b) and stepping by the slope m, rise over run, to two more points.`, kind: 'tip' },
    { content: `If y has a number in front of it, such as 2y = 4x + 6, divide EVERY term by that number before graphing.`, kind: 'tip' },
    { content: `Check the crossing point in BOTH equations; a lattice point that works in both is the exact solution.`, kind: 'tip' },
    { content: `When the crossing sits between grid lines, estimate it and say "about"; the check comes out close rather than exact, and the graph cannot do better than that.`, kind: 'tip' },
    { content: `Same slope with different y-intercepts means parallel lines and no solution; two equations that turn out to be the same line have infinitely many solutions.`, kind: 'tip' },
    { content: `When an equation has a number in front of y (like 2y = 4x + 6), divide EVERY term by that number—not just some of them. Dividing only the constant gives you the wrong line.`, kind: 'common-error' },
    { content: `Always graph both lines on the SAME axes. If you draw them on separate graphs, you cannot see where they cross and you cannot find the solution.`, kind: 'gotcha' },
    { content: `Read the crossing point as (x, y): x-coordinate first (across), then y-coordinate (up). Flipping them gives you the wrong answer.`, kind: 'vocab-note' },
    { content: `If two equations have the same left side (like 3x + 2y on both), the right sides must be equal for any solution to exist. If they are different (5 vs. 6), no solution exists—do not graph.`, kind: 'tip' },
    { content: `A non-lattice crossing (between grid lines) gives an estimate, not an exact answer. Say 'about (1.3, 2.7)', not '(1.3, 2.7)'. The check will come out close but not exact.`, kind: 'vocab-note' },
    { content: `Before deciding a system has no solution, always rewrite both equations in y = mx + b form. Two equations that look different might actually be the same line.`, kind: 'common-error' },
    { content: `Check the crossing point in BOTH original equations, not just one. Both must give the same y-value for the point to be on both lines.`, kind: 'gotcha' },
    { content: `Parallel lines have the same slope but different y-intercepts. If m is the same and b is different, the lines never meet and there is no solution—even if the graph paper is huge.`, kind: 'edge-case' },
  ],
};
