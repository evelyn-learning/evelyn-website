/**
 * Algebra 1 — Unit 5 CED 5.1: Solving Systems by Graphing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.systems-by-graphing.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U5_SYSTEMS_BY_GRAPHING: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.systems-by-graphing.v1',
  course: 'Algebra 1',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Solving Systems by Graphing',
  planId: 'evelyn.hs.alg1.systems-by-graphing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.systems-by-graphing.v1' }],
  theory: [
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'What a solution is', content: `WHAT A SOLUTION IS — one linear equation is satisfied by a whole line of points. TWO equations together are satisfied only by the points on BOTH lines, so the solution of a system is the intersection point, written as an ordered pair (x, y).` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'How to graph', content: `HOW TO GRAPH — rewrite each equation as y = mx + b, plot the y-intercept b, then step by the slope m as rise/run to get a second point, and draw the line. Do this for both equations on the SAME set of axes.` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Read, then verify', content: `READ, THEN VERIFY — a graph only gives an exact answer when the crossing lands on a lattice point (whole-number coordinates). Always confirm the point algebraically; a hand sketch cannot tell (2, 3) from (2.1, 3.2).` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Check in both equations', content: `CHECK IN BOTH EQUATIONS — substitute the candidate x and y into equation 1 AND equation 2. A point that works in only one equation is on only one line, so it is not a solution.` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Three outcomes from slopes and intercepts', content: `THREE OUTCOMES FROM SLOPES AND INTERCEPTS — different slopes → lines cross once → exactly ONE solution. Same slope, different y-intercept → parallel lines → NO solution. Same slope AND same y-intercept → one line drawn twice → INFINITELY many solutions.` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Classify before you graph', content: `CLASSIFY BEFORE YOU GRAPH — solve both equations for y and compare m and b. That comparison answers "how many solutions" in seconds, with no graph paper at all.` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Standard form trap', content: `STANDARD FORM TRAP — you cannot compare slopes until each equation is solved for y. From 6x + 2y = 14, divide EVERY term by 2 after moving 6x: 2y = −6x + 14, so y = −3x + 7 (not y = −6x + 7).` },
    { loId: 'alg1.systems-by-graphing', kind: 'framework', title: 'Order matters', content: `ORDER MATTERS — the answer is (x, y), not (y, x). Reporting (3, 2) when the intersection is (2, 3) is a different point and fails the check.` },
    { loId: 'alg1.systems-by-graphing', kind: 'definition', title: 'system of equations', content: 'two or more equations solved together, all of which must be true at once.' },
    { loId: 'alg1.systems-by-graphing', kind: 'definition', title: 'point of intersection', content: 'the (x, y) where two graphed lines cross — the solution of the system.' },
    { loId: 'alg1.systems-by-graphing', kind: 'definition', title: 'inconsistent system', content: 'a system with no solution; its lines are parallel.' },
  ],
  methods: [
    {
      title: 'Worked one solution',
      steps: [
        `Graph the first line: y-intercept −1, slope 2, so from (0, −1) go up 2 and right 1 to (1, 1).`,
        `Graph the second line: y-intercept 5, slope −1, so from (0, 5) go down 1 and right 1 to (1, 4).`,
        `The slopes 2 and −1 are different, so the lines cross exactly once. Reading the graph, they meet at (2, 3).`,
        `Check in BOTH equations: 2(2) − 1 = 3 ✓ and −(2) + 5 = 3 ✓. Both true, so (2, 3) is the solution.`,
      ],
      example: { problem: 'Solve by graphing: y = 2x − 1 and y = −x + 5', solution: '(2, 3)' },
      relatedLoIds: ['alg1.systems-by-graphing'],
    },
    {
      title: 'Worked parallel no solution',
      steps: [
        `The second equation is in standard form, so solve it for y: subtract 6x to get 2y = −6x + 14.`,
        `Divide EVERY term by 2: y = −3x + 7. (Dividing only the 6x is the classic slip that gives a wrong slope.)`,
        'Compare: both lines have slope −3, but the y-intercepts are 4 and 7 — different.',
        `Same slope with different intercepts means the lines are parallel: they stay 3 units apart vertically and never cross, so there is NO solution.`,
        `Contrast: if the second equation had been 6x + 2y = 8, it would simplify to y = −3x + 4 — the SAME line — and the system would have infinitely many solutions.`,
      ],
      example: { problem: 'Solve by graphing: y = −3x + 4 and 6x + 2y = 14', solution: 'No solution (the lines are parallel)' },
      relatedLoIds: ['alg1.systems-by-graphing'],
    },
  ],
  pointers: [
    { content: `A point has two coordinates. Substitute x = 2 back in: y = 2 + 2 = 4, so the solution is (2, 4). Check both: 2 + 2 = 4 ✓ and −2(2) + 8 = 4 ✓.`, kind: 'common-error' },
    { content: `Test it: for x = 4, the first equation gives y = 6, not 2. The correct pair is (2, 4). Order always goes (x, y).`, kind: 'common-error' },
    { content: `The solution of a system is the intersection point of the two lines, written as (x, y).`, kind: 'tip' },
    { content: 'Graph by putting each equation in y = mx + b: plot b, then step by the slope.', kind: 'tip' },
    { content: `Different slopes → one solution. Same slope, different intercept → none. Same slope and intercept → infinitely many.`, kind: 'tip' },
    { content: 'Solve for y before comparing slopes — divide every term, not just the x-term.', kind: 'tip' },
    { content: 'A point is only a solution if it checks out in BOTH equations.', kind: 'tip' },
    { content: `Never compare slopes while an equation is still in standard form. From $6x + 2y = 14$ you must divide **every** term: $y = -3x + 7$, not $y = -6x + 7$. Forgetting to divide the constant is the #1 wrong-answer generator in this topic.`, kind: 'common-error' },
    { content: `Finish the answer as an ordered pair. Stopping at "x = 2" is only half a solution — plug that x back into either equation to get y, then write $(2, 4)$.`, kind: 'common-error' },
    { content: `Order is $(x, y)$ — always. If you read the graph as "over 2, up 4," write $(2,4)$; writing $(4,2)$ names a totally different point and will fail the substitution check.`, kind: 'gotcha' },
    { content: `Substitute into BOTH equations, not just the easier one. A point that satisfies only one equation sits on only one line, so it is not a solution of the system.`, kind: 'tip' },
    { content: `A graph only gives an *exact* answer when the crossing sits on a lattice point. If the lines seem to cross between grid marks, don't guess "(2.1, 3.2)" — say the graph is inexact and confirm algebraically.`, kind: 'edge-case' },
    { content: `"No solution" and "infinitely many" are different, and neither is "0". Parallel lines (same $m$, different $b$) = no solution; identical lines (same $m$ AND same $b$) = infinitely many. Don't write $(0,0)$ or leave it blank.`, kind: 'common-error' },
    { content: `Use *inconsistent* only for a system with no solution (parallel lines). Two equations that describe the same line are one line drawn twice — not two separate solutions, and not "two answers."`, kind: 'vocab-note' },
    { content: `Two equations can look completely different and still be the same line: $y = \\tfrac12 x - 3$ and $x - 2y = 6$. Always solve for $y$ before deciding — appearance in standard form tells you nothing.`, kind: 'gotcha' },
  ],
};
